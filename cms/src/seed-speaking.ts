// One-off migration: copy speaking content out of the app's public.speaking_topic /
// public.speaking_sentence tables (same Postgres this CMS points at) into the
// speaking-topics collection, preserving every id — topic ids are URL params and
// sentence ids key user progress in public.speaking_progress. Idempotent: topics
// that already exist in the collection are skipped.
//
// Run from cms/ with: bun run seed:speaking
import { getPayload } from 'payload'

import config from './payload.config'

type TopicRow = { id: string; emoji: string; title: string; position: number }
type SentenceRow = { id: string; topic_id: string; text: string }

// pg's Pool, reached through the adapter — pg itself isn't a direct dependency here.
type PoolLike = { query: (sql: string) => Promise<{ rows: unknown[] }> }

const payload = await getPayload({ config })
const pool = (payload.db as unknown as { pool: PoolLike }).pool

const topics = (
  await pool.query('SELECT id, emoji, title, position FROM public.speaking_topic ORDER BY position')
).rows as TopicRow[]
const sentences = (
  await pool.query('SELECT id, topic_id, text FROM public.speaking_sentence ORDER BY position')
).rows as SentenceRow[]

for (const topic of topics) {
  const existing = await payload.findByID({
    collection: 'speaking-topics',
    id: topic.id,
    disableErrors: true,
  })
  if (existing) {
    payload.logger.info(`skip ${topic.id} (already seeded)`)
    continue
  }
  // No explicit order: the collection is orderable, and creating in source
  // position order appends each topic to the end of the drag-order list.
  await payload.create({
    collection: 'speaking-topics',
    data: {
      id: topic.id,
      emoji: topic.emoji,
      title: topic.title,
      sentences: sentences
        .filter((s) => s.topic_id === topic.id)
        .map((s) => ({ id: s.id, text: s.text })),
    },
  })
  payload.logger.info(`seeded ${topic.id}`)
}

process.exit(0)
