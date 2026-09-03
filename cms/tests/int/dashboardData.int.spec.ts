import type { Payload } from 'payload'

import { getPayload } from 'payload'
import { beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { greetingName, loadDashboardData } from '@/components/admin/dashboard/dashboardData'

let payload: Payload

describe('greetingName', () => {
  it('prefers the display name', () => {
    expect(greetingName({ email: 'lan@example.com', name: 'cô Lan' })).toBe('cô Lan')
  })

  it('falls back to the local part of the email, never the whole address', () => {
    expect(greetingName({ email: 'tranthanhphuc042@gmail.com' })).toBe('tranthanhphuc042')
  })

  it('ignores a blank name', () => {
    expect(greetingName({ email: 'lan@example.com', name: '   ' })).toBe('lan')
  })

  it('degrades to a generic greeting with nothing to go on', () => {
    expect(greetingName(null)).toBe('cô')
    expect(greetingName({})).toBe('cô')
  })
})

describe('loadDashboardData', () => {
  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  it('offers the three destinations with chủ đề counts', async () => {
    const data = await loadDashboardData({ adminRoute: '/admin', payload })

    expect(data.destinations.map((d) => d.label)).toEqual([
      'Quyển 1',
      'Quyển 2',
      'Luyện nói',
    ])
    expect(data.destinations.map((d) => d.buttonLabel)).toEqual([
      'Mở quyển 1',
      'Mở quyển 2',
      'Mở luyện nói',
    ])

    for (const destination of data.destinations) {
      expect(typeof destination.count).toBe('number')
      expect(destination.count).toBeGreaterThanOrEqual(0)
    }

    expect(data.destinations[0].href).toMatch(/^\/admin\/collections\/quyen\/[^/]+$/)
    expect(data.destinations[2].href).toBe('/admin/collections/speaking-topics')
  })

  it('lists at most five recent edits, newest first', async () => {
    const data = await loadDashboardData({ adminRoute: '/admin', payload })

    expect(data.recents).not.toBeNull()
    expect(data.recents!.length).toBeLessThanOrEqual(5)

    const times = data.recents!.map((r) => Date.parse(r.updatedAt))
    expect([...times].sort((a, b) => b - a)).toEqual(times)

    for (const recent of data.recents!) {
      expect(recent.href).toContain('/admin/collections/')
      expect(recent.title.length).toBeGreaterThan(0)
    }
  })

  it('reports a count as null rather than throwing when its query fails', async () => {
    const brokenPayload = {
      config: { routes: { admin: '/admin' } },
      count: async () => {
        throw new Error('connection refused')
      },
      find: async () => ({ docs: [] }),
    } as unknown as Payload

    const data = await loadDashboardData({ adminRoute: '/admin', payload: brokenPayload })

    expect(data.destinations).toHaveLength(3)
    expect(data.destinations.every((d) => d.count === null)).toBe(true)
  })

  it('degrades to the destination cards when recent edits cannot be read', async () => {
    const brokenPayload = {
      config: { routes: { admin: '/admin' } },
      count: async () => ({ totalDocs: 0 }),
      find: async ({ collection }: { collection: string }) => {
        if (collection === 'quyen') return { docs: [] }
        throw new Error('connection refused')
      },
    } as unknown as Payload

    const data = await loadDashboardData({ adminRoute: '/admin', payload: brokenPayload })

    expect(data.recents).toBeNull()
    expect(data.destinations).toHaveLength(3)
  })
})
