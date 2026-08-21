// One-off migration: copy the production learning tree — quyển → chủ đề → chặng → nội dung →
// bài → hình — out of the app's Supabase tables and into this CMS's quyen / chu-de collections.
//
// Source is the production data dump at supabase/prod-snapshot/data.sql (see the root README:
// gitignored, produced by the Supabase CLI). The dump is used rather than a live connection
// because the local stack's public.* tables are empty and .env carries no production service
// key — pass a different dump path as the first argument if yours lives elsewhere.
//
// Images and lesson audio are fetched from the bucket the dump points at and uploaded into the
// media collection, so hình arrive as real uploads rather than URLs (locally they land on disk
// under cms/media; in production the same code would push them to R2).
//
// Idempotent at two levels: a quyển is created only if its slug is missing, and a chủ đề only
// if the quyển has none with that title. Re-running after an editor has changed content leaves
// that content alone — it never updates, only fills in what is absent.
//
// Run from cms/ with: bun run seed:quyen
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { getPayload } from 'payload'

import config from './payload.config'
import { QUYEN_ROSTER } from './collections/Quyen'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const DUMP = process.argv[2] || path.resolve(dirname, '../../supabase/prod-snapshot/data.sql')

// --- the dump ---------------------------------------------------------------------------

type Row = Record<string, string | null>

// Pull one table's rows out of a pg_dump `COPY ... FROM stdin;` block. Values are
// tab-separated, `\N` is NULL, and the block ends at a lone `\.` line.
function readCopy(sql: string, table: string): Row[] {
  const header = new RegExp(`^COPY "public"\\."${table}" \\(([^)]*)\\) FROM stdin;$`, 'm')
  const match = header.exec(sql)
  if (!match) throw new Error(`no COPY block for public.${table} in ${DUMP}`)

  const columns = match[1].split(',').map((c) => c.trim().replace(/"/g, ''))
  const body = sql.slice(match.index + match[0].length + 1)
  const end = body.indexOf('\n\\.\n')
  if (end === -1) throw new Error(`unterminated COPY block for public.${table}`)

  return body
    .slice(0, end)
    .split('\n')
    .filter((line) => line.length > 0)
    .map((line) => {
      const values = line.split('\t')
      return Object.fromEntries(
        columns.map((column, i) => [
          column,
          values[i] === '\\N' ? null : unescape(values[i] ?? ''),
        ]),
      )
    })
}

// COPY encodes these four characters; everything else is literal.
function unescape(value: string): string {
  return value.replace(/\\(.)/g, (_, c) =>
    c === 'n' ? '\n' : c === 'r' ? '\r' : c === 't' ? '\t' : c,
  )
}

// chude/chang/noidung/bai.text and hinh.text are jsonb arrays of lines — a chặng title that
// wraps onto two lines in the book is two entries. Titles want them as one string; captions
// keep them separate.
function lines(value: string | null): string[] {
  if (!value) return []
  const parsed: unknown = JSON.parse(value)
  if (Array.isArray(parsed)) return parsed.filter((s): s is string => typeof s === 'string')
  return typeof parsed === 'string' ? [parsed] : []
}

function title(value: string | null): string {
  return lines(value).join(' ').trim()
}

function byPosition(a: Row, b: Row): number {
  return Number(a.position) - Number(b.position)
}

// --- media ------------------------------------------------------------------------------

const sql = fs.readFileSync(DUMP, 'utf8')
const payload = await getPayload({ config })

const MIME_TYPES: Record<string, string> = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.mp3': 'audio/mpeg',
  '.m4a': 'audio/mp4',
  '.wav': 'audio/wav',
}

const uploaded = new Map<string, number>()

// Download one file from the production bucket into the media collection and return its id.
// The filename comes from the source row id, not from the URL: the bucket has a hinh01.webp in
// every bài folder, and Payload would otherwise rename each collision to hinh01-1.webp and lose
// the link back. That same name makes the lookup below an exact re-use check on re-runs.
async function upload(url: string, id: string, alt: string): Promise<number | null> {
  const cached = uploaded.get(url)
  if (cached) return cached

  const extension = path.extname(new URL(url).pathname).toLowerCase()
  const filename = `${id.replace(/[^a-zA-Z0-9._-]/g, '-')}${extension}`

  const existing = await payload.find({
    collection: 'media',
    where: { filename: { equals: filename } },
    limit: 1,
    depth: 0,
  })
  if (existing.docs.length > 0) {
    uploaded.set(url, existing.docs[0].id)
    return existing.docs[0].id
  }

  const response = await fetch(url)
  if (!response.ok) {
    payload.logger.warn(`skip ${url} (HTTP ${response.status})`)
    return null
  }
  const data = Buffer.from(await response.arrayBuffer())

  const doc = await payload.create({
    collection: 'media',
    data: { alt },
    file: {
      data,
      name: filename,
      size: data.length,
      mimetype:
        response.headers.get('content-type') || MIME_TYPES[extension] || 'application/octet-stream',
    },
  })
  uploaded.set(url, doc.id)
  payload.logger.info(`uploaded ${filename}`)
  return doc.id
}

// --- the tree ---------------------------------------------------------------------------

const quyens = readCopy(sql, 'quyen')
const chudes = readCopy(sql, 'chude').sort(byPosition)
const changs = readCopy(sql, 'chang').sort(byPosition)
const noidungs = readCopy(sql, 'noidung').sort(byPosition)
const bais = readCopy(sql, 'bai').sort(byPosition)
const hinhs = readCopy(sql, 'hinh').sort(byPosition)

const childrenOf = (rows: Row[], key: string, parent: string) =>
  rows.filter((row) => row[key] === parent)

type BaiMeta = { audio_url?: string; video_url?: string; link?: string }

for (const quyen of quyens) {
  // public.quyen ids use an underscore ('quyen_1'), the CMS roster a dash ('quyen-1').
  const slug = String(quyen.id).replace(/_/g, '-')
  const found = await payload.find({
    collection: 'quyen',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
  })

  let quyenId = found.docs[0]?.id
  if (!quyenId) {
    // Normally onInit has already created every roster row; this covers a database where it
    // hasn't run yet, and names a quyển outside the roster after its number.
    const rostered = QUYEN_ROSTER.find((entry) => entry.slug === slug)
    const created = await payload.create({
      collection: 'quyen',
      data: { slug, title: rostered?.title ?? `Quyển ${slug.replace(/\D+/g, '') || slug}` },
    })
    quyenId = created.id
    payload.logger.info(`created quyển ${slug}`)
  }

  for (const chude of childrenOf(chudes, 'quyen_id', String(quyen.id))) {
    const chuDeTitle = title(chude.text)
    const existing = await payload.find({
      collection: 'chu-de',
      where: { and: [{ quyen: { equals: quyenId } }, { title: { equals: chuDeTitle } }] },
      limit: 1,
      depth: 0,
    })
    if (existing.docs.length > 0) {
      payload.logger.info(`skip ${chude.id} — "${chuDeTitle}" (already seeded)`)
      continue
    }

    const changData = []
    for (const chang of childrenOf(changs, 'chude_id', String(chude.id))) {
      const noiDungData = []
      for (const noidung of childrenOf(noidungs, 'chang_id', String(chang.id))) {
        const baiData = []
        for (const bai of childrenOf(bais, 'noidung_id', String(noidung.id))) {
          const meta: BaiMeta = bai.meta ? JSON.parse(bai.meta) : {}
          const baiTitle = title(bai.text)

          const hinhData = []
          for (const hinh of childrenOf(hinhs, 'bai_id', String(bai.id))) {
            if (!hinh.storage_path) continue
            const captions = lines(hinh.text)
            // The image field is required, so a hình whose file can't be fetched is dropped
            // rather than created empty.
            const image = await upload(hinh.storage_path, String(hinh.id), captions[0] || baiTitle)
            if (!image) continue
            hinhData.push({ image, captions: captions.map((text) => ({ text })) })
          }

          const audio = meta.audio_url
            ? await upload(meta.audio_url, `${bai.id}-audio`, baiTitle)
            : null

          baiData.push({
            title: baiTitle,
            meta: {
              audio,
              videoUrl: meta.video_url ?? null,
              link: meta.link ?? null,
            },
            hinhs: hinhData,
          })
        }
        noiDungData.push({ title: title(noidung.text), bais: baiData })
      }
      changData.push({ title: title(chang.text), noiDungs: noiDungData })
    }

    await payload.create({
      collection: 'chu-de',
      data: { title: chuDeTitle, quyen: quyenId, changs: changData },
    })
    payload.logger.info(`seeded ${chude.id} — "${chuDeTitle}"`)
  }
}

process.exit(0)
