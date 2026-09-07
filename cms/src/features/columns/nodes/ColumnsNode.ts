import type {
  EditorConfig,
  LexicalNode,
  LexicalUpdateJSON,
  SerializedElementNode,
} from '@payloadcms/richtext-lexical/lexical'

import { $applyNodeReplacement, ElementNode } from '@payloadcms/richtext-lexical/lexical'

// The column counts an editor can pick between. Not a free number: past three the columns are
// too narrow for a Vietnamese reading row, and the whole point of this feature is a layout an
// editor can eyeball rather than tune.
export const MIN_COLUMN_COUNT = 1
export const MAX_COLUMN_COUNT = 3
export const COLUMN_COUNTS = [1, 2, 3] as const

export type ColumnCount = (typeof COLUMN_COUNTS)[number]

export const clampColumnCount = (count: number): ColumnCount =>
  (Math.min(MAX_COLUMN_COUNT, Math.max(MIN_COLUMN_COUNT, Math.round(count))) as ColumnCount)

/**
 * The row wrapper. Its only children are `ColumnNode`s, and the column count *is* the number of
 * those children — no separate `columns` property to keep in sync with them, which is also why
 * `updateDOM` can always return false: nothing about this element's own DOM depends on the
 * count. The columns divide the row with `flex: 1 1 0` (see custom.scss), so adding or removing
 * a child re-divides the row without this node re-rendering at all.
 */
export class ColumnsNode extends ElementNode {
  static clone(node: ColumnsNode): ColumnsNode {
    return new ColumnsNode(node.__key)
  }

  static getType(): string {
    return 'columns'
  }

  static importJSON(serializedNode: SerializedElementNode): ColumnsNode {
    return $createColumnsNode().updateFromJSON(serializedNode as LexicalUpdateJSON<SerializedElementNode>)
  }

  // A row of empty columns carries no content and can't be typed into as a row, so let Lexical
  // drop it once its last column is gone rather than leaving an invisible husk in the document.
  canBeEmpty(): boolean {
    return false
  }

  canIndent(): boolean {
    return false
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const element = document.createElement('div')
    element.className = 'kmd-columns'
    return element
  }

  isInline(): boolean {
    return false
  }

  updateDOM(): boolean {
    return false
  }
}

/**
 * One column. A *shadow root* (the same thing `TableCellNode` does), which is what makes the
 * content inside it behave like content in its own little document: pressing Enter splits a
 * paragraph within the column instead of escaping it, list and heading toolbar actions resolve
 * against the column rather than the page, and a selection that starts here can't silently
 * merge into the neighbouring column.
 */
export class ColumnNode extends ElementNode {
  static clone(node: ColumnNode): ColumnNode {
    return new ColumnNode(node.__key)
  }

  static getType(): string {
    return 'column'
  }

  static importJSON(serializedNode: SerializedElementNode): ColumnNode {
    return $createColumnNode().updateFromJSON(serializedNode as LexicalUpdateJSON<SerializedElementNode>)
  }

  // Deliberately *not* `false` (which is what TableCellNode uses): an emptied column has to stay
  // put — an editor who deletes the last paragraph out of the middle column expects two columns
  // and a blank one, not the row silently collapsing to two. ColumnsPlugin's transform refills
  // it with an empty paragraph instead.
  canBeEmpty(): boolean {
    return true
  }

  canIndent(): boolean {
    return false
  }

  // Backspace at the very start of a column's first paragraph does nothing, rather than pulling
  // the paragraph out into whatever precedes the row.
  collapseAtStart(): boolean {
    return true
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const element = document.createElement('div')
    element.className = 'kmd-column'
    return element
  }

  isInline(): boolean {
    return false
  }

  isShadowRoot(): boolean {
    return true
  }

  updateDOM(): boolean {
    return false
  }
}

export const $createColumnsNode = (): ColumnsNode => $applyNodeReplacement(new ColumnsNode())

export const $createColumnNode = (): ColumnNode => $applyNodeReplacement(new ColumnNode())

export const $isColumnsNode = (node: LexicalNode | null | undefined): node is ColumnsNode =>
  node instanceof ColumnsNode

export const $isColumnNode = (node: LexicalNode | null | undefined): node is ColumnNode =>
  node instanceof ColumnNode
