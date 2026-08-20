import { postgresAdapter } from '@payloadcms/db-postgres'
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

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Uploaded media goes to a Cloudflare R2 bucket in production only. Locally the plugin stays
// off so `bun run dev` needs no R2 credentials and writes files to disk under cms/media —
// which is also why it can't be left on everywhere: with the plugin enabled Payload sets
// `disableLocalStorage`, and a dev machine would then need real bucket access to show images.
//
// R2 speaks the S3 API, so the s3Storage adapter drives it. Two R2 specifics: the region is
// always 'auto', and the endpoint is the account-scoped R2 URL rather than an AWS host.
// R2_PUBLIC_URL is the bucket's public hostname (an r2.dev URL or a custom domain) — without
// it Payload serves media back through its own /api/media/file route instead of straight
// from the CDN.
const r2Storage = s3Storage({
  enabled: process.env.NODE_ENV === 'production',
  // The prefix field this plugin adds must exist in the database whether or not the plugin
  // is switched on: migrations are generated locally (plugin off) and applied to production
  // (plugin on), so without this the two schemas drift apart.
  alwaysInsertFields: true,
  collections: {
    media: {
      // Media is world-readable anyway, so let the browser hit the bucket's public hostname
      // directly instead of proxying every image through this Next server.
      disablePayloadAccessControl: true,
      generateFileURL: ({ filename, prefix }) =>
        [process.env.R2_PUBLIC_URL, prefix, filename].filter(Boolean).join('/'),
    },
  },
  bucket: process.env.R2_BUCKET || '',
  config: {
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT || '',
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
  },
})

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, SpeakingTopics, Quyen],
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
