import { describe, expect, it } from 'vitest'

import type { DropContainer, DropSlot } from '@/features/columns/client/dropTargets'

import { findDropTarget } from '@/features/columns/client/dropTargets'

/**
 * `findDropTarget` decides where a dragged block lands, and it is the one piece of the columns
 * feature with no visible state to check against — it reads geometry and returns a node key. So
 * it is exercised here on a synthetic layout rather than in the browser: a page 500px wide whose
 * middle block is a two-column row.
 *
 *   x:  40 ───────────── 100 ─────────── 300 ─── 320 ──────────── 500
 *       ↑ editor gutter   ↑ row / column A       ↑ column B
 *
 *   y:  0–40    "intro"       (top level)
 *       50–150  the row       (top level), holding
 *                 60–90   "A1"   / 100–140 "A2"   in column A
 *                 60–120  "B1"                    in column B
 *       160–200 "outro"      (top level)
 */

const rect = (left: number, top: number, right: number, bottom: number): DOMRect =>
  ({ bottom, height: bottom - top, left, right, top, width: right - left }) as DOMRect

const slot = (key: string, left: number, top: number, right: number, bottom: number): DropSlot => ({
  bottom,
  elem: null as unknown as HTMLElement,
  key,
  rect: rect(left, top, right, bottom),
  top,
})

const columnA: DropContainer = {
  columnKey: 'colA',
  columnsKey: 'row',
  columnsRect: rect(100, 50, 500, 150),
  contentLeft: 120,
  contentWidth: 180,
  elem: null as unknown as HTMLElement,
  rect: rect(100, 50, 300, 150),
  slots: [slot('a1', 120, 60, 300, 90), slot('a2', 120, 100, 300, 140)],
}

const columnB: DropContainer = {
  columnKey: 'colB',
  columnsKey: 'row',
  columnsRect: rect(100, 50, 500, 150),
  contentLeft: 340,
  contentWidth: 160,
  elem: null as unknown as HTMLElement,
  rect: rect(320, 50, 500, 150),
  slots: [slot('b1', 340, 60, 500, 120)],
}

const root: DropContainer = {
  columnKey: null,
  columnsKey: null,
  columnsRect: null,
  contentLeft: 100,
  contentWidth: 400,
  elem: null as unknown as HTMLElement,
  rect: rect(40, 0, 500, 200),
  slots: [slot('intro', 100, 0, 500, 40), slot('row', 100, 50, 500, 150), slot('outro', 100, 160, 500, 200)],
}

const containers = [root, columnA, columnB]

const find = (x: number, y: number, options?: { allowColumns?: boolean; fuzzy?: boolean }) =>
  findDropTarget(containers, x, y, {
    allowColumns: options?.allowColumns ?? true,
    fuzzy: options?.fuzzy ?? false,
  })

describe('findDropTarget', () => {
  it('finds a top-level block outside the row', () => {
    expect(find(200, 20)?.slot.key).toBe('intro')
    expect(find(200, 180)?.slot.key).toBe('outro')
  })

  it('addresses a block inside the column the pointer is over', () => {
    expect(find(200, 70)?.slot.key).toBe('a1')
    expect(find(200, 120)?.slot.key).toBe('a2')
    expect(find(400, 70)?.slot.key).toBe('b1')
  })

  it('addresses the row as a whole from the gutter to its left', () => {
    // The gutter rule: left of the row is the row, inside it is one column's blocks. Same y, one
    // step left, and the answer changes from a block to the row that contains it.
    expect(find(60, 70)?.slot.key).toBe('row')
    expect(find(200, 70)?.slot.key).toBe('a1')
  })

  it('picks the nearest column when the pointer is in the gap between two', () => {
    expect(find(310, 70)?.container.columnKey).toBe('colA')
    expect(find(316, 70)?.container.columnKey).toBe('colB')
  })

  it('ignores columns entirely when a row is the thing being dragged', () => {
    // A row can't be dropped inside a column, so with columns out of the running the document
    // reads as one flat list again and the pointer resolves to the row itself.
    expect(find(200, 70, { allowColumns: false })?.slot.key).toBe('row')
  })

  it('says nothing when merely hovering a gap no block occupies', () => {
    expect(find(200, 45)).toBeNull()
    expect(find(200, 155, { allowColumns: false })).toBeNull()
  })

  it('falls back to the nearest block while dragging', () => {
    // `fuzzy` is what makes the bottom padding of a column, or the space past the last block,
    // still a place you can drop.
    expect(find(200, 145, { fuzzy: true })?.slot.key).toBe('a2')
    expect(find(400, 145, { fuzzy: true })?.slot.key).toBe('b1')
    expect(find(200, 400, { fuzzy: true })?.slot.key).toBe('outro')
  })

  it('reports which side of the block the drop lands on', () => {
    expect(find(200, 65)?.isBelow).toBe(false)
    expect(find(200, 85)?.isBelow).toBe(true)
  })
})
