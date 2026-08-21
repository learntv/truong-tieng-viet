import { postgresAdapter } from '@payloadcms/db-postgres'
import { vi } from '@payloadcms/translations/languages/vi'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { SpeakingTopics } from './collections/SpeakingTopics'
import { Quyen, QUYEN_ROSTER } from './collections/Quyen'
import { ChuDe } from './collections/ChuDe'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Uploaded media goes to a Cloudflare R2 bucket in production only. Locally the plugin stays
// off so `bun run dev` needs no R2 credentials and writes files to disk under cms/media —
// which is also why it can't be left on everywhere: with the plugin enabled Payload sets
// `disableLocalStorage`, and a dev machine would then need real bucket access to show images.
const R2_ENABLED = process.env.NODE_ENV === 'production'

// Folder every upload lands in, inside the bucket. Without it Payload writes to the bucket
// root, and this bucket is shared: the TTS cache owns audio/ (src/lib/tts/hash.ts) and the
// original lesson images the CMS was seeded from still sit under quyen_1/.
//
// Applied on read as well as write, so it can't be changed once files exist without moving
// every object by hand.
const MEDIA_PREFIX = 'media'

// The app half of the repo talks to this same bucket (src/lib/tts/r2.server.ts), so the CMS
// reads the same variable names instead of keeping a second set of its own. It used to want
// R2_ENDPOINT and R2_PUBLIC_URL where the app had R2_ACCOUNT_ID and R2_PUBLIC_BASE_URL, and
// both halves of that mismatch failed badly: a missing endpoint left the AWS SDK to invent
// `<bucket>.s3.auto.amazonaws.com` and every upload died on DNS, while a missing public URL
// didn't fail at all — uploads succeeded and quietly stored a hostless URL.
//
// So: one set of names, no endpoint to configure (R2's S3 endpoint is always derivable from
// the account id), and a hard failure at startup naming whatever is absent.
function requireR2Env() {
  const missing = (
    ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET', 'R2_PUBLIC_BASE_URL'] as const
  ).filter((name) => !process.env[name])

  if (missing.length > 0) {
    throw new Error(
      `Media uploads are enabled (NODE_ENV=production) but these R2 variables are unset: ` +
        `${missing.join(', ')}. Set them on the CMS deployment, or run with NODE_ENV unset to ` +
        `store uploads on local disk instead.`,
    )
  }

  return {
    bucket: process.env.R2_BUCKET!,
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    // Public hostname the bucket is served from — an r2.dev URL or a custom domain.
    publicBaseUrl: process.env.R2_PUBLIC_BASE_URL!.replace(/\/+$/, ''),
    // R2's S3-compatible endpoint is account-scoped and fixed. R2_ENDPOINT stays as an escape
    // hatch for the jurisdiction-specific hosts (`<id>.eu.r2.cloudflarestorage.com`), which
    // this project doesn't use.
    endpoint:
      process.env.R2_ENDPOINT || `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  }
}

// Read once, at import: a misconfigured deployment should refuse to boot rather than fail on
// the first upload an editor attempts.
const r2 = R2_ENABLED ? requireR2Env() : null

const r2Storage = s3Storage({
  enabled: R2_ENABLED,
  // The prefix field this plugin adds must exist in the database whether or not the plugin
  // is switched on: migrations are generated locally (plugin off) and applied to production
  // (plugin on), so without this the two schemas drift apart.
  alwaysInsertFields: true,
  collections: {
    media: {
      prefix: MEDIA_PREFIX,
      // Media is world-readable anyway, so let the browser hit the bucket's public hostname
      // directly instead of proxying every image through this Next server.
      disablePayloadAccessControl: true,
      // `prefix` here is the *document's* prefix field, never the collection prefix above —
      // the plugin passes only `data.prefix` to this hook. Falling back to MEDIA_PREFIX is
      // what keeps the URL pointing at the folder the file was actually written to; without
      // it every upload would be stored under media/ and linked from the bucket root.
      // The `||` mirrors the plugin's own rule, where a document prefix overrides the
      // collection one rather than nesting inside it.
      generateFileURL: ({ filename, prefix }) =>
        [r2?.publicBaseUrl, prefix || MEDIA_PREFIX, filename].filter(Boolean).join('/'),
    },
  },
  // Empty when the plugin is disabled: `enabled: false` means none of this is ever read, and
  // `requireR2Env` has already thrown if it should have been.
  bucket: r2?.bucket ?? '',
  config: {
    // R2 has no regions; 'auto' is the literal value its S3 API expects.
    region: 'auto',
    endpoint: r2?.endpoint ?? '',
    credentials: {
      accessKeyId: r2?.accessKeyId ?? '',
      secretAccessKey: r2?.secretAccessKey ?? '',
    },
  },
})

export default buildConfig({
  admin: {
    user: Users.slug,
    // Pin the admin panel to the light palette instead of following the OS setting,
    // so every editor sees the same white background.
    theme: 'light',
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, SpeakingTopics, Quyen, ChuDe],
  // The app (Vite dev server / prod site) fetches public content from this CMS's REST API.
  // Browsers enforce this list, so every origin the app is served from has to appear here:
  // the custom domain, the Vercel project URL it is aliased to, and the local dev server.
  // Preview deploys get a unique URL per deployment and are deliberately not covered —
  // point a preview at the local CMS, or add its origin here temporarily.
  cors: [
    'http://localhost:8080',
    'https://truongtiengviet.cvcec.org',
    'https://truong-tieng-viet.vercel.app',
  ],
  // The quyển roster is fixed and editors can't create rows, so the rows have to come from
  // here. Runs on every server start and only fills in what's missing, so it's safe to run
  // repeatedly and never touches the content a teacher has already put inside a quyển.
  onInit: async (payload) => {
    for (const quyen of QUYEN_ROSTER) {
      const existing = await payload.find({
        collection: 'quyen',
        where: { slug: { equals: quyen.slug } },
        limit: 1,
        depth: 0,
      })
      if (existing.docs.length > 0) continue
      await payload.create({ collection: 'quyen', data: quyen })
      payload.logger.info(`created quyển ${quyen.slug}`)
    }
  },
  // Every label in this config is Vietnamese; leaving the admin chrome on its English default
  // meant a form that read "Add Bài" and "Collapse All" next to "Thêm phần". Only Vietnamese is
  // offered, so the panel can't fall back to English from a browser's Accept-Language header.
  i18n: {
    fallbackLanguage: 'vi',
    supportedLanguages: { vi },
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    schemaName: 'payload',
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [r2Storage],
})
