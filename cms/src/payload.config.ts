import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { SpeakingTopics } from './collections/SpeakingTopics'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, SpeakingTopics],
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
  plugins: [],
})
