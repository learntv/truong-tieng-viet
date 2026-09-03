import type { Payload } from 'payload'

import { QUYEN_ROSTER } from '@/collections/Quyen'

export type Destination = {
  buttonLabel: string
  count: null | number
  href: null | string
  key: string
  label: string
}

export type RecentEdit = {
  href: string
  id: number | string
  kind: 'chu-de' | 'speaking-topic'
  title: string
  updatedAt: string
}

export type DashboardData = {
  destinations: Destination[]
  recents: null | RecentEdit[]
}

const RECENT_LIMIT = 5

/**
 * What to call the person logged in.
 *
 * Users carry an optional display name; without one, the email's local part is far
 * better than the whole address in a greeting.
 */
export function greetingName(
  user: { email?: null | string; name?: null | string } | null | undefined,
): string {
  const name = user?.name?.trim()
  if (name) return name

  const local = user?.email?.split('@')[0]?.trim()
  if (local) return local

  return 'cô'
}

/**
 * Everything the dashboard renders.
 *
 * A launchpad, not a report: counts come from `count`, and recents from one sorted
 * `find` per collection at depth 0. Nothing here walks a chủ đề's nested arrays —
 * which is also why the destination cards show a chủ đề count and not a bài count.
 * Bài live inside those arrays, and counting them would mean loading every chủ đề
 * document on every dashboard load.
 *
 * Every query is guarded on its own. This is a server component's data source, so an
 * uncaught throw is a 500 on the admin root; a failed count renders "—" and a failed
 * recents query leaves the destination cards standing.
 */
export async function loadDashboardData({
  adminRoute,
  payload,
}: {
  adminRoute: string
  payload: Payload
}): Promise<DashboardData> {
  const [destinations, recents] = await Promise.all([
    loadDestinations({ adminRoute, payload }),
    loadRecents({ adminRoute, payload }),
  ])

  return { destinations, recents }
}

async function loadDestinations({
  adminRoute,
  payload,
}: {
  adminRoute: string
  payload: Payload
}): Promise<Destination[]> {
  const quyenIds = await resolveQuyenIds(payload)

  const quyenDestinations = await Promise.all(
    QUYEN_ROSTER.map(async (quyen) => {
      const id = quyenIds.get(quyen.slug)

      return {
        buttonLabel: `Mở ${quyen.title.toLowerCase()}`,
        // No row means nothing to count against — asking anyway would send a sentinel
        // into a relationship filter and rely on the catch to clean up after it.
        count:
          id === undefined
            ? null
            : await countOrNull(payload, 'chu-de', { quyen: { equals: id } }),
        href: id === undefined ? null : `${adminRoute}/collections/quyen/${id}`,
        key: quyen.slug,
        label: quyen.title,
      }
    }),
  )

  return [
    ...quyenDestinations,
    {
      buttonLabel: 'Mở luyện nói',
      count: await countOrNull(payload, 'speaking-topics'),
      href: `${adminRoute}/collections/speaking-topics`,
      key: 'luyen-noi',
      label: 'Luyện nói',
    },
  ]
}

async function resolveQuyenIds(payload: Payload): Promise<Map<string, number | string>> {
  try {
    const found = await payload.find({
      collection: 'quyen',
      depth: 0,
      pagination: false,
      select: { slug: true },
      where: { slug: { in: QUYEN_ROSTER.map((q) => q.slug) } },
    })

    return new Map(found.docs.map((doc) => [doc.slug, doc.id]))
  } catch {
    return new Map()
  }
}

async function countOrNull(
  payload: Payload,
  collection: 'chu-de' | 'speaking-topics',
  where?: Record<string, unknown>,
): Promise<null | number> {
  try {
    const result = await payload.count({ collection, where } as never)
    return result.totalDocs
  } catch (err) {
    payload.logger?.error?.({ collection, err }, 'dashboard: count failed')
    return null
  }
}

async function loadRecents({
  adminRoute,
  payload,
}: {
  adminRoute: string
  payload: Payload
}): Promise<null | RecentEdit[]> {
  try {
    const [chuDe, speaking] = await Promise.all([
      payload.find({
        collection: 'chu-de',
        depth: 0,
        limit: RECENT_LIMIT,
        select: { title: true, updatedAt: true },
        sort: '-updatedAt',
      }),
      payload.find({
        collection: 'speaking-topics',
        depth: 0,
        limit: RECENT_LIMIT,
        select: { title: true, updatedAt: true },
        sort: '-updatedAt',
      }),
    ])

    const merged: RecentEdit[] = [
      ...chuDe.docs.map((doc) => ({
        href: `${adminRoute}/collections/chu-de/${doc.id}`,
        id: doc.id,
        kind: 'chu-de' as const,
        title: doc.title || 'Chưa đặt tên',
        updatedAt: doc.updatedAt,
      })),
      ...speaking.docs.map((doc) => ({
        href: `${adminRoute}/collections/speaking-topics/${doc.id}`,
        id: doc.id,
        kind: 'speaking-topic' as const,
        title: doc.title || 'Chưa đặt tên',
        updatedAt: doc.updatedAt,
      })),
    ]

    return merged
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
      .slice(0, RECENT_LIMIT)
  } catch (err) {
    payload.logger?.error?.({ err }, 'dashboard: recent edits failed')
    return null
  }
}
