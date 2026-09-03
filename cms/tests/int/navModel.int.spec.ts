import type { Payload } from 'payload'

import { getPayload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { buildNavGroups } from '@/components/admin/nav/navModel'

let payload: Payload

describe('buildNavGroups', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('groups the items the way teachers are asked to think about them', async () => {
    const groups = await buildNavGroups({ adminRoute: '/admin', payload })

    expect(groups.map((g) => g.label)).toEqual([
      null,
      'Nội dung học',
      'Thư viện',
      'Quản trị',
    ])

    expect(groups[0].items).toEqual([{ href: '/admin', label: 'Trang chính' }])
    expect(groups[2].items).toEqual([
      { href: '/admin/collections/media', label: 'Hình & âm thanh' },
    ])
    expect(groups[3].items).toEqual([
      { href: '/admin/collections/users', label: 'Người dùng' },
    ])
  })

  it('never lists chủ đề, which is reached through its quyển', async () => {
    const groups = await buildNavGroups({ adminRoute: '/admin', payload })

    const labels = groups.flatMap((g) => g.items.map((i) => i.label))
    expect(labels).not.toContain('Chủ đề')
    expect(groups.flatMap((g) => g.items.map((i) => i.href))).not.toContain(
      '/admin/collections/chu-de',
    )
  })

  it('links each quyển by resolving its slug to a document id', async () => {
    const groups = await buildNavGroups({ adminRoute: '/admin', payload })
    const hoc = groups.find((g) => g.label === 'Nội dung học')!

    // onInit seeds the roster on every server start, so both rows exist.
    const quyen1 = await payload.find({
      collection: 'quyen',
      depth: 0,
      limit: 1,
      where: { slug: { equals: 'quyen-1' } },
    })
    const id = quyen1.docs[0].id

    expect(hoc.items[0]).toEqual({
      href: `/admin/collections/quyen/${id}`,
      label: 'Quyển 1',
    })
    expect(hoc.items.at(-1)).toEqual({
      href: '/admin/collections/speaking-topics',
      label: 'Luyện nói',
    })
  })

  it('honours a non-default admin route', async () => {
    const groups = await buildNavGroups({ adminRoute: '/quan-tri', payload })

    expect(groups[0].items[0].href).toBe('/quan-tri')
    expect(groups[3].items[0].href).toBe('/quan-tri/collections/users')
  })

  it('disables a quyển that has no row yet instead of throwing', async () => {
    // A roster entry whose row is missing: simulate by querying with a payload whose
    // find returns nothing for quyen. The nav renders on every page, so a missing row
    // must never be able to take the panel down.
    const emptyPayload = {
      find: async () => ({ docs: [] }),
    } as unknown as Payload

    const groups = await buildNavGroups({ adminRoute: '/admin', payload: emptyPayload })
    const hoc = groups.find((g) => g.label === 'Nội dung học')!

    expect(hoc.items[0]).toEqual({
      disabled: true,
      href: null,
      label: 'Quyển 1',
      note: 'Chưa sẵn sàng',
    })
    // The rest of the sidebar is unaffected.
    expect(groups[3].items[0].href).toBe('/admin/collections/users')
  })

  it('disables the quyển items rather than throwing when the query fails', async () => {
    const brokenPayload = {
      find: async () => {
        throw new Error('connection refused')
      },
    } as unknown as Payload

    const groups = await buildNavGroups({ adminRoute: '/admin', payload: brokenPayload })
    const hoc = groups.find((g) => g.label === 'Nội dung học')!

    expect(hoc.items.filter((i) => i.disabled)).toHaveLength(2)
    expect(hoc.items.at(-1)!.href).toBe('/admin/collections/speaking-topics')
  })
})
