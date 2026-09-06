import { getPayload, type Payload, type PayloadRequest } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { emptyBaiCounts } from '@/endpoints/emptyBaiCounts'
import { countEmptyBaiInChuDe } from '@/lib/baiContent'
import { countEmptyBaiPerChang, type FormFields } from '@/lib/baiFormState'

import { chuDeTree, EXPECTED_EMPTY_BAI, EXPECTED_EMPTY_PER_CHANG } from '../fixtures/chuDeTree'

/**
 * The endpoint behind the chủ đề grid's counts, run against a real chủ đề in the database and
 * checked against the same fixture the browser-side paths are checked against.
 *
 * The point is not that the endpoint returns *a* number: it is that the server, the chặng tab
 * (which reads flat form state) and the row marker all produce the same number from the same
 * tree. They share `baiContent`; this is what would catch it if they stopped.
 */
describe('empty bài counts', () => {
  let payload: Payload
  const created: { collection: 'chu-de' | 'media' | 'quyen'; id: number }[] = []
  let quyenId: number

  beforeAll(async () => {
    payload = await getPayload({ config: await config })

    // The fixture names media by made-up id; the database insists an upload point at a real
    // document, so each one is created here and the tree rewritten to the id it got.
    const mediaIds = new Map<number, number>()
    for (const [fixtureId, file] of [
      [101, imageFile('hinh-101.png')],
      [102, imageFile('hinh-102.png')],
      [103, imageFile('hinh-103.png')],
      [201, audioFile('am-thanh-201.mp3')],
    ] as const) {
      const doc = await payload.create({ collection: 'media', data: { alt: file.name }, file })
      created.push({ collection: 'media', id: doc.id })
      mediaIds.set(fixtureId, doc.id)
    }

    const quyen = await payload.create({
      collection: 'quyen',
      data: { slug: 'test-empty-bai-counts', title: 'Quyển thử nghiệm' },
    })
    quyenId = quyen.id
    created.push({ collection: 'quyen', id: quyenId })

    const chuDe = await payload.create({
      collection: 'chu-de',
      data: { ...toStorable(chuDeTree, mediaIds), quyen: quyenId },
    })
    created.push({ collection: 'chu-de', id: chuDe.id })
  })

  afterAll(async () => {
    // Reverse order: the chủ đề references the quyển and the media.
    for (const { collection, id } of created.reverse()) {
      await payload.delete({ collection, id })
    }
  })

  it('reports the fixture’s empty bài for the quyển', async () => {
    const response = await callEndpoint(payload, String(quyenId))
    const counts = (await response.json()) as Record<string, number>

    expect(response.status).toBe(200)
    expect(Object.values(counts)).toEqual([EXPECTED_EMPTY_BAI])
  })

  it('leaves a chủ đề with no empty bài out of the response entirely', async () => {
    const emptyless = await payload.create({
      collection: 'chu-de',
      data: {
        title: 'Không thiếu gì',
        quyen: quyenId,
        changs: [
          {
            title: 'Chặng 1',
            noiDungs: [
              { title: 'Phần 1', bais: [{ title: 'Có liên kết', meta: { link: 'https://a.test' } }] },
            ],
          },
        ],
      },
    })
    created.push({ collection: 'chu-de', id: emptyless.id })

    const counts = (await (await callEndpoint(payload, String(quyenId))).json()) as Record<
      string,
      number
    >
    expect(counts[String(emptyless.id)]).toBeUndefined()
  })

  it('refuses a request with no quyển', async () => {
    const response = await callEndpoint(payload, null)
    expect(response.status).toBe(400)
  })

  it('agrees with the flat-form-state path the chặng tabs use', () => {
    // The same tree, flattened the way Payload's form state holds it — the shape the chặng
    // tabs count from, before anything is saved.
    expect(countEmptyBaiPerChang(toFormFields(chuDeTree), 'changs', chuDeTree.changs.length)).toEqual(
      EXPECTED_EMPTY_PER_CHANG,
    )
  })

  it('agrees with the predicate run over the stored document', async () => {
    const { docs } = await payload.find({
      collection: 'chu-de',
      depth: 0,
      limit: 0,
      where: { quyen: { equals: quyenId }, title: { equals: chuDeTree.title } },
    })
    expect(countEmptyBaiInChuDe(docs[0])).toBe(EXPECTED_EMPTY_BAI)
  })
})

/** Runs the endpoint's own handler, so the test covers the code the admin actually calls. */
const callEndpoint = (payload: Payload, quyen: null | string): Promise<Response> => {
  const searchParams = new URLSearchParams(quyen === null ? {} : { quyen })
  return emptyBaiCounts.handler({ payload, searchParams } as unknown as PayloadRequest) as Promise<Response>
}

/** The smallest valid PNG: one transparent pixel. */
const imageFile = (name: string) => ({
  data: Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64',
  ),
  mimetype: 'image/png',
  name,
  size: 70,
})

/** A stand-in audio file. Only its mime type matters — the upload field filters on it. */
const audioFile = (name: string) => ({
  data: Buffer.from('ID3', 'utf8'),
  mimetype: 'audio/mpeg',
  name,
  size: 3,
})

/**
 * The fixture as the database will accept it: real media ids, and without the hình row that
 * has no image. That row is a form-state-only shape — `image` is `required`, so it exists
 * only between "add hình" and the upload landing — and the bài holding it is empty either
 * way, so dropping it leaves every expected count unchanged.
 */
function toStorable(chuDe: typeof chuDeTree, mediaIds: Map<number, number>) {
  return {
    ...chuDe,
    changs: chuDe.changs.map((chang) => ({
      ...chang,
      noiDungs: chang.noiDungs.map((noiDung) => ({
        ...noiDung,
        bais: noiDung.bais.map((bai) => {
          const meta = 'meta' in bai ? bai.meta : undefined
          const hinhs = 'hinhs' in bai ? (bai.hinhs ?? []) : []

          return {
            ...bai,
            hinhs: hinhs
              .filter((hinh) => hinh.image != null)
              .map((hinh) => ({ ...hinh, image: mediaIds.get(hinh.image as number)! })),
            meta: meta && 'audio' in meta ? { ...meta, audio: mediaIds.get(meta.audio)! } : meta,
          }
        }),
      })),
    })),
  }
}

/**
 * Flattens the fixture into the shape `useFormFields` hands a selector: one entry per leaf
 * field path. Only the paths the form-state reader looks at are produced — that is the
 * contract being tested.
 */
function toFormFields(chuDe: typeof chuDeTree): FormFields {
  const fields: FormFields = {}

  chuDe.changs.forEach((chang, c) => {
    fields[`changs.${c}.title`] = { value: chang.title }

    chang.noiDungs.forEach((noiDung, n) => {
      fields[`changs.${c}.noiDungs.${n}.title`] = { value: noiDung.title }

      noiDung.bais.forEach((bai, b) => {
        const base = `changs.${c}.noiDungs.${n}.bais.${b}`
        fields[`${base}.title`] = { value: bai.title }

        const meta = 'meta' in bai ? bai.meta : undefined
        fields[`${base}.meta.audio`] = { value: meta && 'audio' in meta ? meta.audio : null }
        fields[`${base}.meta.link`] = { value: meta && 'link' in meta ? meta.link : null }
        fields[`${base}.meta.videoUrl`] = {
          value: meta && 'videoUrl' in meta ? meta.videoUrl : null,
        }

        const hinhs = 'hinhs' in bai ? (bai.hinhs ?? []) : []
        hinhs.forEach((hinh, h) => {
          fields[`${base}.hinhs.${h}.image`] = { value: hinh.image }
        })
      })
    })
  })

  return fields
}
