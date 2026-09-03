import type { Payload } from 'payload'

import { QUYEN_ROSTER } from '@/collections/Quyen'

export type NavItem = {
  disabled?: boolean
  href: null | string
  label: string
  note?: string
}

export type NavGroup = {
  items: NavItem[]
  label: null | string
}

/**
 * The sidebar's contents.
 *
 * Kept apart from the component so it can be tested against a real Payload instance
 * without rendering React — and so the failure behaviour below is verifiable, which
 * matters more here than anywhere else in the panel: the nav renders on every page
 * and is a server component, so an uncaught throw is a 500 on the admin root rather
 * than one broken widget.
 *
 * Two deliberate omissions:
 *
 * - Chủ đề never appears. It must stay routable (every chủ đề lives at
 *   /admin/collections/chu-de/:id) while never being listed, and Payload's
 *   `admin.hidden` flag would remove the routes too. Rendering the list ourselves is
 *   the only way to get "reachable but not listed" — which is the reason the Nav
 *   slot is replaced wholesale rather than extended with beforeNavLinks.
 * - Quyển are linked by *document*, not by list view. Their ids are Postgres-assigned
 *   and differ between dev and production, so they are resolved from the slugs in
 *   QUYEN_ROSTER at render time. That keeps the roster the single source of truth:
 *   adding a third quyển there makes a third nav item appear with no edit here.
 */
export async function buildNavGroups({
  adminRoute,
  payload,
}: {
  adminRoute: string
  payload: Payload
}): Promise<NavGroup[]> {
  const quyenItems = await buildQuyenItems({ adminRoute, payload })

  return [
    {
      label: null,
      items: [{ href: adminRoute, label: 'Trang chính' }],
    },
    {
      label: 'Nội dung học',
      items: [
        ...quyenItems,
        { href: `${adminRoute}/collections/speaking-topics`, label: 'Luyện nói' },
      ],
    },
    {
      label: 'Thư viện',
      items: [{ href: `${adminRoute}/collections/media`, label: 'Hình & âm thanh' }],
    },
    {
      label: 'Quản trị',
      items: [{ href: `${adminRoute}/collections/users`, label: 'Người dùng' }],
    },
  ]
}

async function buildQuyenItems({
  adminRoute,
  payload,
}: {
  adminRoute: string
  payload: Payload
}): Promise<NavItem[]> {
  const unavailable = (title: string): NavItem => ({
    disabled: true,
    href: null,
    label: title,
    note: 'Chưa sẵn sàng',
  })

  let idBySlug: Map<string, number | string>

  try {
    const found = await payload.find({
      collection: 'quyen',
      depth: 0,
      limit: QUYEN_ROSTER.length,
      pagination: false,
      select: { slug: true },
      where: { slug: { in: QUYEN_ROSTER.map((q) => q.slug) } },
    })

    idBySlug = new Map(found.docs.map((doc) => [doc.slug, doc.id]))
  } catch (err) {
    // onInit seeds these rows on server start, so an empty or failed result means the
    // database is unreachable or mid-migration. Show the items disabled and let the
    // rest of the sidebar render.
    payload.logger?.error?.({ err }, 'nav: could not resolve quyển documents')
    idBySlug = new Map()
  }

  return QUYEN_ROSTER.map((quyen) => {
    const id = idBySlug.get(quyen.slug)
    if (id === undefined) return unavailable(quyen.title)

    return {
      href: `${adminRoute}/collections/quyen/${id}`,
      label: quyen.title,
    }
  })
}
