import type { Endpoint, PayloadRequest } from 'payload'

import { countEmptyBaiInChuDe } from '@/lib/baiContent'

/**
 * How many bài hold nothing, per chủ đề, for one quyển.
 *
 * `GET /api/chu-de/empty-bai-counts?quyen=<id>` → `{ "12": 2, "13": 4 }`, listing only the
 * chủ đề that actually have empty bài.
 *
 * A custom endpoint rather than a deeper REST `select` from ChuDeGrid: the grid deliberately
 * asks for `title` alone so that opening a quyển never pulls the chặng → nội dung → bài → hình
 * tree down the wire. Requesting the fields needed to judge emptiness would undo exactly that
 * — most of the quyển's content, to display four numbers. Here the tree is walked on the
 * server, next to the database, and only the numbers cross.
 *
 * The counting itself is `countEmptyBaiInChuDe`, the same function the row marker and the
 * chặng tabs call in the browser. That shared import is the only reason the two cannot drift.
 */
export const emptyBaiCounts: Endpoint = {
  method: 'get',
  path: '/empty-bai-counts',
  handler: async (req: PayloadRequest) => {
    const quyen = req.searchParams.get('quyen')

    if (!quyen) {
      return Response.json({ error: 'Thiếu tham số quyen.' }, { status: 400 })
    }

    const { docs } = await req.payload.find({
      collection: 'chu-de',
      // The tree is needed to count, but `depth: 0` keeps every upload a bare id rather than
      // fetching the media document behind it — the predicate only asks whether an id is there.
      depth: 0,
      limit: 0,
      overrideAccess: false,
      // Everything a count needs and nothing else: no titles, no relationships.
      select: { changs: true },
      user: req.user,
      where: { quyen: { equals: quyen } },
    })

    const counts: Record<string, number> = {}
    for (const doc of docs) {
      const empty = countEmptyBaiInChuDe(doc)
      // Only chủ đề with something to report. A card with no empty bài shows no count, so
      // sending a zero would only invite the grid to draw one.
      if (empty > 0) counts[String(doc.id)] = empty
    }

    return Response.json(counts)
  },
}
