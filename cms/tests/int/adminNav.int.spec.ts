import { getPayload, type Payload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { QUYEN_ROSTER } from '@/collections/Quyen'
import { adminNavEntries } from '@/lib/adminNav'

/**
 * The top bar's entries, against a real Payload instance.
 *
 * The thing worth asserting is not the labels — it is that the quyển entries are resolved from
 * the roster's slugs against real documents, so the same bar appears in every environment
 * whatever ids Postgres handed out, and that chủ đề is absent from it.
 */
describe('admin nav entries', () => {
  let payload: Payload
  let entries: Awaited<ReturnType<typeof adminNavEntries>>

  beforeAll(async () => {
    payload = await getPayload({ config: await config })
    // `onInit` seeds the roster on boot, so the documents the nav resolves already exist.
    entries = await adminNavEntries(payload)
  }, 120_000)

  it('opens with the dashboard', () => {
    expect(entries[0]).toEqual({ href: '', label: 'Trang chính' })
  })

  it('gives every quyển in the roster an entry pointing at that quyển’s document', async () => {
    for (const quyen of QUYEN_ROSTER) {
      const { docs } = await payload.find({
        collection: 'quyen',
        depth: 0,
        limit: 1,
        where: { slug: { equals: quyen.slug } },
      })
      const doc = docs[0]
      expect(doc, `quyển ${quyen.slug} should have been seeded by onInit`).toBeDefined()

      expect(entries).toContainEqual({
        href: `/collections/quyen/${doc.id}`,
        label: quyen.title,
      })
    }
  })

  it('orders the quyển the way the roster does', () => {
    const quyenLabels = entries
      .filter((entry) => entry.href.startsWith('/collections/quyen/'))
      .map((entry) => entry.label)

    expect(quyenLabels).toEqual(QUYEN_ROSTER.map((quyen) => quyen.title))
  })

  it('adds an entry for a new roster quyển with no other edit', async () => {
    // Stands in for a redeploy with a longer roster: `onInit` would have seeded this document,
    // and the roster is the only thing that changed.
    const extra = { slug: 'quyen-3', title: 'Quyển 3' }
    const created = await payload.create({ collection: 'quyen', data: extra })

    try {
      const longer = await adminNavEntries(payload, [...QUYEN_ROSTER, extra])

      expect(longer).toContainEqual({
        href: `/collections/quyen/${created.id}`,
        label: extra.title,
      })
      // Nothing else moved: the new entry is appended after the existing quyển, and the
      // entries around them are untouched.
      expect(longer).toHaveLength(entries.length + 1)
      expect(longer.filter((entry) => !entry.href.startsWith('/collections/quyen/'))).toEqual(
        entries.filter((entry) => !entry.href.startsWith('/collections/quyen/')),
      )
    } finally {
      await payload.delete({ collection: 'quyen', id: created.id, overrideAccess: true })
    }
  })

  it('skips a roster entry whose document is missing rather than linking nowhere', async () => {
    const withGhost = await adminNavEntries(payload, [
      ...QUYEN_ROSTER,
      { slug: 'quyen-khong-ton-tai', title: 'Quyển không tồn tại' },
    ])

    expect(withGhost).toEqual(entries)
  })

  it('lists Luyện nói and the media library, and never chủ đề', () => {
    expect(entries).toContainEqual({ href: '/collections/speaking-topics', label: 'Luyện nói' })
    expect(entries).toContainEqual({ href: '/collections/media', label: 'Thư viện hình' })

    expect(entries.some((entry) => entry.href.includes('chu-de'))).toBe(false)
    expect(entries.some((entry) => /chủ đề/i.test(entry.label))).toBe(false)
  })
})
