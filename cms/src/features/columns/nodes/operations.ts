import type { ElementNode, LexicalNode, NodeKey } from '@payloadcms/richtext-lexical/lexical'

import {
  $createParagraphNode,
  $getNodeByKey,
  $getRoot,
  $isParagraphNode,
  $isRootNode,
} from '@payloadcms/richtext-lexical/lexical'

import { MAX_COLUMN_COUNT } from './ColumnsNode'

import type { ColumnCount } from './ColumnsNode'

import {
  $createColumnNode,
  $createColumnsNode,
  $isColumnNode,
  $isColumnsNode,
  ColumnNode,
  ColumnsNode,
  clampColumnCount,
} from './ColumnsNode'



/**
 * Every mutation the columns feature performs on the document, in one place — the floating
 * control, the slash menu, the toolbar and the drag plugin all go through these, so "what a
 * column row may look like" is defined once rather than re-derived at each call site.
 */

const $isBlankParagraph = (node: LexicalNode): boolean =>
  $isParagraphNode(node) && node.getChildrenSize() === 0

/** A row of `count` columns, each already holding the empty paragraph a column must never be without. */
export const $createColumns = (count: ColumnCount): ColumnsNode => {
  const columns = $createColumnsNode()
  for (let index = 0; index < clampColumnCount(count); index++) {
    columns.append($createColumnNode().append($createParagraphNode()))
  }
  return columns
}

/** The columns of a row, ignoring anything a paste or a bad drop may have left between them. */
export const $getColumns = (columns: ColumnsNode): ColumnNode[] =>
  columns.getChildren().filter($isColumnNode)

/**
 * The `ColumnsNode` a node sits inside, or null. Walks all the way up rather than checking the
 * immediate parent, because the node in hand is usually a text node deep inside a paragraph
 * inside a column.
 */
export const $getColumnsAncestor = (node: LexicalNode | null): ColumnsNode | null => {
  let current: LexicalNode | null = node
  while (current) {
    if ($isColumnsNode(current)) return current
    current = current.getParent()
  }
  return null
}

/** Same walk, for the individual column. */
export const $getColumnAncestor = (node: LexicalNode | null): ColumnNode | null => {
  let current: LexicalNode | null = node
  while (current) {
    if ($isColumnNode(current)) return current
    current = current.getParent()
  }
  return null
}

/**
 * The ancestor of `node` that is a direct child of the document root — the granularity the
 * editor's own block handles work at, and the only place a `ColumnsNode` is allowed to live.
 */
export const $getRootLevelAncestor = (node: LexicalNode | null): LexicalNode | null => {
  let current: LexicalNode | null = node
  while (current) {
    const parent: LexicalNode | null = current.getParent()
    if (parent === null) return null
    if ($isRootNode(parent)) return current
    current = parent
  }
  return null
}

/**
 * Change how many columns a row has, without ever dropping what an editor has already written:
 * growing appends blank columns, shrinking moves the surplus columns' content onto the last
 * column that survives. Blank paragraphs are skipped while merging, so collapsing 3 → 2 → 3
 * doesn't leave a stack of empty lines behind.
 */
export const $setColumnCount = (columns: ColumnsNode, requested: number): void => {
  const count = clampColumnCount(requested)
  const existing = $getColumns(columns)

  if (count > existing.length) {
    for (let index = existing.length; index < count; index++) {
      columns.append($createColumnNode().append($createParagraphNode()))
    }
    return
  }

  if (count === existing.length) return

  const survivor = existing[count - 1]
  for (const doomed of existing.slice(count)) {
    for (const child of doomed.getChildren()) {
      if ($isBlankParagraph(child)) continue
      survivor.append(child)
    }
    doomed.remove()
  }
  if (survivor.getChildrenSize() === 0) survivor.append($createParagraphNode())
}

/**
 * Take the row apart, leaving its content behind as ordinary top-level blocks in reading order
 * (column 1 first, then column 2…). This is what the control's ✕ does: removing the *layout*,
 * never the writing.
 */
export const $unwrapColumns = (columns: ColumnsNode): void => {
  const blocks: LexicalNode[] = []
  for (const column of $getColumns(columns)) {
    for (const child of column.getChildren()) {
      if ($isBlankParagraph(child)) continue
      blocks.push(child)
    }
  }
  for (const block of blocks) {
    columns.insertBefore(block)
  }
  // A row whose every column was blank would otherwise unwrap to nothing, leaving the caret
  // with no block to land in if the row was the document's only child.
  if (blocks.length === 0) columns.insertBefore($createParagraphNode())
  columns.remove()
}

/**
 * Drop a new row into the document at the caret. Never nested: if the caret is already inside a
 * column, the new row goes after the row that column belongs to, at the top level, because a
 * column inside a column is a layout nobody asked for and every drag interaction would have to
 * reason about.
 */
export const $insertColumns = (count: ColumnCount, anchor: LexicalNode | null): ColumnsNode => {
  const columns = $createColumns(count)
  const enclosingRow = $getColumnsAncestor(anchor)
  const target = enclosingRow ?? $getRootLevelAncestor(anchor)

  if (!target) {
    $getRoot().append(columns)
  } else if (!enclosingRow && $isBlankParagraph(target)) {
    // Inserting from an empty line replaces it — otherwise every insertion leaves a stray blank
    // paragraph above the row.
    target.replace(columns)
  } else {
    target.insertAfter(columns)
  }

  const firstColumn = $getColumns(columns)[0]
  const firstBlock = firstColumn?.getFirstChild()
  if (firstBlock && 'selectStart' in firstBlock) (firstBlock as ElementNode).selectStart()

  return columns
}

/** Resolve a key back to a row, for UI that holds onto a key across renders. */
export const $getColumnsByKey = (key: NodeKey | null): ColumnsNode | null => {
  if (!key) return null
  const node = $getNodeByKey(key)
  return $isColumnsNode(node) ? node : null
}

/* -------------------------------------------------------------------------- */
/* Normalization                                                              */
/*                                                                            */
/* The two functions below are registered as node transforms by ColumnsPlugin, */
/* so they run after every edit that touches a row — a paste, an undo, a       */
/* deletion, a drop that landed somewhere unexpected. Each is a no-op on a     */
/* well-formed row, which is what keeps them from looping: a transform that    */
/* changed something would re-run, and the second pass has nothing left to do. */
/* -------------------------------------------------------------------------- */

/** A column holds blocks, at least one of them, and only ever sits inside a row. */
export const $normalizeColumn = (column: ColumnNode): void => {
  if (!$isColumnsNode(column.getParent())) {
    // Orphaned by a paste or a malformed drop — its content belongs wherever it landed, but the
    // column wrapper itself doesn't.
    for (const child of column.getChildren()) column.insertBefore(child)
    column.remove()
    return
  }

  // A row nested inside a column is flattened rather than rendered: nested layout is not a shape
  // this editor offers, and allowing it would leave content the drag handles can't reach.
  for (const child of column.getChildren()) {
    if (!$isColumnsNode(child)) continue
    for (const nested of $getColumns(child)) {
      for (const block of nested.getChildren()) child.insertBefore(block)
    }
    child.remove()
  }

  // Inline content can end up as a direct child after a paste; a column's children have to be
  // blocks for the drag handles (and for the caret) to have anything to aim at.
  let paragraph: null | ReturnType<typeof $createParagraphNode> = null
  for (const child of column.getChildren()) {
    if (!child.isInline()) {
      paragraph = null
      continue
    }
    if (!paragraph) {
      paragraph = $createParagraphNode()
      child.insertBefore(paragraph)
    }
    paragraph.append(child)
  }

  // The empty paragraph is what holds a column open. Without it an editor who clears a column
  // loses the column too, and the row silently re-flows around the gap.
  if (column.getChildrenSize() === 0) column.append($createParagraphNode())
}

/** A row holds only columns, at most three, and only ever at the top level. */
export const $normalizeColumns = (columns: ColumnsNode): void => {
  const children = columns.getChildren()
  if (children.length === 0) {
    columns.remove()
    return
  }

  const strays = children.filter((child) => !$isColumnNode(child))
  if (strays.length > 0) {
    let firstColumn = $getColumns(columns)[0]
    if (!firstColumn) {
      firstColumn = $createColumnNode()
      columns.append(firstColumn)
    }
    for (const stray of strays) firstColumn.append(stray)
  }

  if ($getColumns(columns).length > MAX_COLUMN_COUNT) $setColumnCount(columns, MAX_COLUMN_COUNT)

  const parent = columns.getParent()
  if (parent && !$isRootNode(parent) && !$isColumnNode(parent)) {
    for (const column of $getColumns(columns)) {
      for (const block of column.getChildren()) columns.insertBefore(block)
    }
    columns.remove()
  }
}
