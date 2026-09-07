'use client'

import type { LexicalEditor, NodeKey } from '@payloadcms/richtext-lexical/lexical'

import { $getRoot } from '@payloadcms/richtext-lexical/lexical'

import { $getColumns } from '../nodes/operations'
import { $isColumnsNode } from '../nodes/ColumnsNode'

/**
 * Where a block can sit, and how to work out which one the mouse is pointing at.
 *
 * Payload's own drag plugin can't answer this once columns exist: it only ever looks at
 * `root.getChildrenKeys()`, and it flattens every candidate to the full editor width before
 * measuring, so horizontal position — the only thing that distinguishes column 1 from column 3 —
 * is discarded. This module keeps both the nesting and the x axis.
 */

export type DropSlot = {
  /** Vertical hit range, widened to the midpoint of the gaps either side so there are no dead zones between blocks. */
  bottom: number
  elem: HTMLElement
  key: NodeKey
  rect: DOMRect
  top: number
}

export type DropContainer = {
  /** The container's content box, in viewport coordinates — where an insertion line spans. */
  contentLeft: number
  contentWidth: number
  /** The column's key, or null for the document root. */
  columnKey: NodeKey | null
  /** The row the column belongs to — null for the document root. */
  columnsKey: NodeKey | null
  columnsRect: DOMRect | null
  elem: HTMLElement
  rect: DOMRect
  slots: DropSlot[]
}

export type DropTarget = {
  container: DropContainer
  /** True when the block should land *after* the slot rather than before it. */
  isBelow: boolean
  slot: DropSlot
}

const contentBoxOf = (elem: HTMLElement, rect: DOMRect): { left: number; width: number } => {
  const style = window.getComputedStyle(elem)
  const paddingLeft = parseFloat(style.paddingLeft) || 0
  const paddingRight = parseFloat(style.paddingRight) || 0
  return { left: rect.left + paddingLeft, width: Math.max(0, rect.width - paddingLeft - paddingRight) }
}

const marginsOf = (elem: HTMLElement): { bottom: number; top: number } => {
  const style = window.getComputedStyle(elem)
  return { bottom: parseFloat(style.marginBottom) || 0, top: parseFloat(style.marginTop) || 0 }
}

const toSlot = (key: NodeKey, elem: HTMLElement): DropSlot => {
  const rect = elem.getBoundingClientRect()
  const { bottom, top } = marginsOf(elem)
  // Half the margin on each side: two adjacent blocks then meet exactly in the middle of the
  // gap between them, so every pixel of the column belongs to exactly one slot.
  return { bottom: rect.bottom + bottom / 2, elem, key, rect, top: rect.top - top / 2 }
}

/**
 * Every block the handles can address: the document's own children, plus — one level down, and
 * only one — the children of each column. Read fresh on each pointer event rather than cached,
 * because a cached rect is wrong the moment an image loads or a block grows a line.
 */
export const collectDropContainers = (editor: LexicalEditor): DropContainer[] => {
  const rootElem = editor.getRootElement()
  if (!rootElem) return []

  const columnContainers: DropContainer[] = []
  const rootSlots: DropSlot[] = []

  editor.getEditorState().read(() => {
    for (const child of $getRoot().getChildren()) {
      const childElem = editor.getElementByKey(child.getKey())
      if (!childElem) continue
      rootSlots.push(toSlot(child.getKey(), childElem))

      if (!$isColumnsNode(child)) continue
      const columnsRect = childElem.getBoundingClientRect()

      for (const column of $getColumns(child)) {
        const columnElem = editor.getElementByKey(column.getKey())
        if (!columnElem) continue

        const slots: DropSlot[] = []
        for (const block of column.getChildren()) {
          const blockElem = editor.getElementByKey(block.getKey())
          if (blockElem) slots.push(toSlot(block.getKey(), blockElem))
        }

        const columnRect = columnElem.getBoundingClientRect()
        const columnContent = contentBoxOf(columnElem, columnRect)

        columnContainers.push({
          contentLeft: columnContent.left,
          contentWidth: columnContent.width,
          columnKey: column.getKey(),
          columnsKey: child.getKey(),
          columnsRect,
          elem: columnElem,
          rect: columnRect,
          slots,
        })
      }
    }
  })

  const rootRect = rootElem.getBoundingClientRect()
  const rootContent = contentBoxOf(rootElem, rootRect)

  return [
    {
      contentLeft: rootContent.left,
      contentWidth: rootContent.width,
      columnKey: null,
      columnsKey: null,
      columnsRect: null,
      elem: rootElem,
      rect: rootRect,
      slots: rootSlots,
    },
    ...columnContainers,
  ]
}

const horizontalDistance = (rect: DOMRect, x: number): number =>
  x < rect.left ? rect.left - x : x > rect.right ? x - rect.right : 0

/**
 * Which block the pointer is aiming at.
 *
 * The rule that makes columns feel right is the one about the gutters: to the *left* of a row
 * you are addressing the row as a whole, and inside it you are addressing one column's blocks.
 * That mirrors how the row is drawn — the editor's own gutter runs down the left of the page,
 * each column has a narrower gutter of its own — so the handle always appears in the gutter the
 * mouse is already in, and what it will pick up is whatever that gutter belongs to.
 *
 * @param allowColumns false while dragging a row: a row can't be dropped inside a column, so
 * columns stop being candidates entirely and the whole document reads as one flat list again.
 * @param fuzzy true while dragging: past the last block, or in the padding below it, the drag
 * still resolves to the nearest block instead of nothing. False while merely hovering, where a
 * handle appearing for a block the mouse isn't over would be noise.
 */
export const findDropTarget = (
  containers: DropContainer[],
  x: number,
  y: number,
  { allowColumns, fuzzy }: { allowColumns: boolean; fuzzy: boolean },
): DropTarget | null => {
  const root = containers[0]
  if (!root) return null

  let container = root

  if (allowColumns) {
    const inRow = containers.filter(
      (candidate) =>
        candidate.columnsRect !== null &&
        y >= candidate.columnsRect.top &&
        y <= candidate.columnsRect.bottom,
    )
    // `x >= columnsRect.left` is the gutter rule: left of the row is the row, inside it is a column.
    if (inRow.length > 0 && inRow[0].columnsRect && x >= inRow[0].columnsRect.left) {
      container = inRow.reduce((best, candidate) =>
        horizontalDistance(candidate.rect, x) < horizontalDistance(best.rect, x) ? candidate : best,
      )
    }
  }

  const { slots } = container
  if (slots.length === 0) return null

  let slot = slots.find((candidate) => y >= candidate.top && y <= candidate.bottom) ?? null

  if (!slot) {
    if (!fuzzy) return null
    slot = slots.reduce((best, candidate) => {
      const distance = y < candidate.top ? candidate.top - y : y - candidate.bottom
      const bestDistance = y < best.top ? best.top - y : y - best.bottom
      return distance < bestDistance ? candidate : best
    })
  }

  return { container, isBelow: y > slot.rect.top + slot.rect.height / 2, slot }
}
