'use client'

import type { NodeKey } from '@payloadcms/richtext-lexical/lexical'

import { $getSelection, $isRangeSelection } from '@payloadcms/richtext-lexical/lexical'
import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext'
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import type { ColumnCount } from '../nodes/ColumnsNode'

import { COLUMN_COUNTS } from '../nodes/ColumnsNode'
import { $getColumns, $getColumnsAncestor } from '../nodes/operations'
import { SET_COLUMN_COUNT_COMMAND, UNWRAP_COLUMNS_COMMAND } from './commands'

/**
 * The control that appears above a row while the caret is inside it: three segmented buttons for
 * the column count, and a ✕ that removes the layout.
 *
 * Selection-driven rather than hover-driven on purpose. Hover would put the control on screen
 * every time the mouse crossed a row on its way somewhere else, and it would appear over the row
 * the mouse is on rather than the row being edited — the count buttons rewrite content, so they
 * should be attached to the row the editor is actually working in.
 */

const CountIcon: React.FC<{ count: ColumnCount }> = ({ count }) => (
  <svg aria-hidden="true" height="14" viewBox="0 0 14 14" width="14">
    {Array.from({ length: count }, (_, index) => {
      const gap = 1.5
      const width = (12 - gap * (count - 1)) / count
      return (
        <rect
          fill="currentColor"
          height="10"
          key={index}
          rx="1"
          width={width}
          x={1 + index * (width + gap)}
          y="2"
        />
      )
    })}
  </svg>
)

type ActiveRow = { count: number; key: NodeKey }

export const ColumnsToolbarPlugin: React.FC<{ anchorElem: HTMLElement }> = ({ anchorElem }) => {
  const [editor] = useLexicalComposerContext()
  const [active, setActive] = useState<ActiveRow | null>(null)
  const toolbarRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const read = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection()
        const row = $isRangeSelection(selection)
          ? $getColumnsAncestor(selection.anchor.getNode())
          : null
        const next = row ? { count: $getColumns(row).length, key: row.getKey() } : null
        setActive((current) =>
          current?.key === next?.key && current?.count === next?.count ? current : next,
        )
      })
    }
    read()
    return editor.registerUpdateListener(read)
  }, [editor])

  // Positioned against the row's own box on every layout pass, and again whenever the page moves
  // under it — the control is a sibling of the editor content, not part of it, so nothing else
  // keeps the two aligned.
  useLayoutEffect(() => {
    const place = () => {
      const toolbar = toolbarRef.current
      if (!toolbar || !active) return
      const rowElem = editor.getElementByKey(active.key)
      if (!rowElem) return
      const rowRect = rowElem.getBoundingClientRect()
      const anchorRect = anchorElem.getBoundingClientRect()
      const height = toolbar.getBoundingClientRect().height
      // Sits above the row, or tucks just inside its top edge when the row is at the very top of
      // the editor and there is no room above it.
      const top = Math.max(0, rowRect.top - anchorRect.top - height - 6)
      toolbar.style.transform = `translate(${rowRect.left - anchorRect.left}px, ${top}px)`
      toolbar.style.opacity = '1'
    }

    place()
    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [active, anchorElem, editor])

  const setCount = useCallback(
    (count: ColumnCount) => {
      if (!active) return
      editor.dispatchCommand(SET_COLUMN_COUNT_COMMAND, { count, key: active.key })
    },
    [active, editor],
  )

  const unwrap = useCallback(() => {
    if (!active) return
    editor.dispatchCommand(UNWRAP_COLUMNS_COMMAND, { key: active.key })
  }, [active, editor])

  if (!active) return null

  return createPortal(
    // The caret has to stay where it is: `mousedown` inside this control would otherwise blur the
    // editor, and every button here acts on the row the caret is in.
    <div
      className="kmd-columns-toolbar"
      onMouseDown={(event) => event.preventDefault()}
      ref={toolbarRef}
    >
      {COLUMN_COUNTS.map((count) => (
        <button
          aria-pressed={active.count === count}
          className="kmd-columns-toolbar__button"
          key={count}
          onClick={() => setCount(count)}
          title={`${count} cột`}
          type="button"
        >
          <CountIcon count={count} />
        </button>
      ))}
      <span className="kmd-columns-toolbar__divider" />
      <button
        className="kmd-columns-toolbar__button"
        onClick={unwrap}
        title="Bỏ bố cục cột"
        type="button"
      >
        <svg aria-hidden="true" height="14" viewBox="0 0 14 14" width="14">
          <path d="M3 3l8 8M11 3l-8 8" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>
    </div>,
    anchorElem,
  )
}
