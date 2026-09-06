import type { BasePayload } from 'payload'

import { QUYEN_ROSTER } from '@/collections/Quyen'

/**
 * What the top bar lists.
 *
 * The panel's navigation names what teachers work on, in Vietnamese, rather than the
 * collections underneath it: a teacher looks for "Quyển 1", not for a "chu-de" collection with
 * 40 rows in it. That means the entries cannot be derived from the config the way Payload's
 * own sidebar derives them — they are stated here, once, and this is the only file that
 * changes when the navigation changes.
 *
 * Chủ đề is deliberately absent. It stays routable at `/admin/collections/chu-de/:id` — links
 * and bookmarks keep working — but it is never listed, because a teacher reaches a chủ đề
 * through its quyển. (`admin.hidden` would have removed the routes along with the listing,
 * which is why the nav is rendered by this project rather than configured.)
 */
type Roster = readonly { readonly slug: string; readonly title: string }[]

export type NavEntry = {
  /** Admin-relative path, e.g. `/collections/quyen/3`. The caller prefixes the admin route. */
  readonly href: string
  readonly label: string
}

/**
 * The quyển roster, resolved to the documents it seeded.
 *
 * `onInit` in payload.config.ts creates a row for every entry in `QUYEN_ROSTER` on server
 * start, so each slug has a document — but its id is assigned by Postgres and differs between
 * a developer's machine, staging and production. Resolving by slug is what makes the same
 * navigation appear in every environment.
 *
 * A roster entry whose document is somehow missing is skipped rather than linked to a dead
 * address; the rest of the bar still renders.
 */
const quyenEntries = async (payload: BasePayload, roster: Roster): Promise<NavEntry[]> => {
  const { docs } = await payload.find({
    collection: 'quyen',
    depth: 0,
    pagination: false,
    select: { slug: true, title: true },
    where: { slug: { in: roster.map((quyen) => quyen.slug) } },
  })

  const bySlug = new Map(docs.map((doc) => [doc.slug, doc]))

  // Ordered by the roster, not by whatever order the query came back in: the roster is the
  // reading order of the workbooks, and that is the order they belong in on the bar.
  return roster.flatMap((quyen) => {
    const doc = bySlug.get(quyen.slug)
    if (!doc) return []
    return [{ href: `/collections/quyen/${doc.id}`, label: doc.title ?? quyen.title }]
  })
}

/**
 * Every entry the top bar shows, left to right.
 *
 * Adding a quyển to `QUYEN_ROSTER` adds an entry here with no other edit — which is the point
 * of resolving the roster rather than listing the quyển by hand.
 */
export const adminNavEntries = async (
  payload: BasePayload,
  /* Injectable only so a test can assert that a longer roster produces a longer bar without
   * editing this file. Production always uses the shipped roster. */
  roster: Roster = QUYEN_ROSTER,
): Promise<NavEntry[]> => [
  { href: '', label: 'Trang chính' },
  ...(await quyenEntries(payload, roster)),
  { href: '/collections/speaking-topics', label: 'Luyện nói' },
  { href: '/collections/media', label: 'Thư viện hình' },
]
