'use client'

import {
  createClientFeature,
  slashMenuBasicGroupWithItems,
  toolbarAddDropdownGroupWithItems,
} from '@payloadcms/richtext-lexical/client'
import React from 'react'

import type { ColumnCount } from '../nodes/ColumnsNode'

import { COLUMN_COUNTS, ColumnNode, ColumnsNode } from '../nodes/ColumnsNode'
import { BlockHandlesPlugin } from './BlockHandlesPlugin'
import { ColumnsPlugin } from './ColumnsPlugin'
import { ColumnsToolbarPlugin } from './ColumnsToolbarPlugin'
import { INSERT_COLUMNS_COMMAND } from './commands'

const ColumnsIcon: React.FC<{ count: ColumnCount }> = ({ count }) => (
  <svg
    aria-hidden="true"
    className="kmd-columns-icon"
    height="20"
    viewBox="0 0 20 20"
    width="20"
    xmlns="http://www.w3.org/2000/svg"
  >
    {Array.from({ length: count }, (_, index) => {
      const gap = 2
      const width = (16 - gap * (count - 1)) / count
      return (
        <rect
          fill="none"
          height="14"
          key={index}
          rx="1.5"
          stroke="currentColor"
          strokeWidth="1.4"
          width={width}
          x={2 + index * (width + gap)}
          y="3"
        />
      )
    })}
  </svg>
)

// The 1-column row isn't offered as an insertion — a row you'd have to widen before it did
// anything is a worse starting point than either of the ones below, and the floating control can
// take an existing row down to one column when that is genuinely what's wanted.
const INSERTABLE_COUNTS = COLUMN_COUNTS.filter((count) => count > 1)

const label = (count: ColumnCount): string => `Bố cục ${count} cột`

/**
 * Multi-column layout for the KMD lesson editor.
 *
 * The columns are real Lexical `ElementNode`s in the *same* editor as the surrounding text, not
 * nested editors inside a block. That is the decision everything else follows from: one editor
 * means one selection, one history stack, one toolbar and one set of drag handles, so a heading
 * or a vocabulary card behaves identically whether it sits in a column or on the page. Nested
 * editors would each own their own of all of those, and dragging a block from one column to
 * another — the thing this feature exists for — would be impossible rather than merely fiddly.
 */
export const ColumnsFeatureClient = createClientFeature({
  nodes: [ColumnsNode, ColumnNode],
  plugins: [
    { Component: ColumnsPlugin, position: 'normal' },
    { Component: ColumnsToolbarPlugin, position: 'floatingAnchorElem' },
    { Component: BlockHandlesPlugin, position: 'floatingAnchorElem' },
  ],
  slashMenu: {
    groups: [
      slashMenuBasicGroupWithItems(
        INSERTABLE_COUNTS.map((count) => ({
          Icon: () => <ColumnsIcon count={count} />,
          key: `columns-${count}`,
          keywords: ['cot', 'cột', 'columns', 'layout', 'bo cuc', 'bố cục', `${count}`],
          label: label(count),
          onSelect: ({ editor }) => {
            editor.dispatchCommand(INSERT_COLUMNS_COMMAND, count)
          },
        })),
      ),
    ],
  },
  toolbarFixed: {
    groups: [
      toolbarAddDropdownGroupWithItems(
        INSERTABLE_COUNTS.map((count) => ({
          ChildComponent: () => <ColumnsIcon count={count} />,
          key: `columns-${count}`,
          label: label(count),
          onSelect: ({ editor }) => {
            editor.dispatchCommand(INSERT_COLUMNS_COMMAND, count)
          },
        })),
      ),
    ],
  },
})
