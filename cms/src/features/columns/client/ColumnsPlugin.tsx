'use client'

import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext'
import {
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_EDITOR,
} from '@payloadcms/richtext-lexical/lexical'
import { mergeRegister } from '@payloadcms/richtext-lexical/lexical/utils'
import { useEffect } from 'react'

import { ColumnNode, ColumnsNode } from '../nodes/ColumnsNode'
import {
  $getColumnsByKey,
  $insertColumns,
  $normalizeColumn,
  $normalizeColumns,
  $setColumnCount,
  $unwrapColumns,
} from '../nodes/operations'
import { INSERT_COLUMNS_COMMAND, SET_COLUMN_COUNT_COMMAND, UNWRAP_COLUMNS_COMMAND } from './commands'

/**
 * Wires the three commands that change a row, and the two transforms that keep every row
 * well-formed no matter what put it in that state — see `$normalizeColumn` / `$normalizeColumns`
 * in ../nodes/operations.ts, which is also where they are tested.
 */
export const ColumnsPlugin: React.FC = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(
    () =>
      mergeRegister(
        editor.registerCommand(
          INSERT_COLUMNS_COMMAND,
          (count) => {
            const selection = $getSelection()
            $insertColumns(count, $isRangeSelection(selection) ? selection.anchor.getNode() : null)
            return true
          },
          COMMAND_PRIORITY_EDITOR,
        ),

        editor.registerCommand(
          SET_COLUMN_COUNT_COMMAND,
          ({ count, key }) => {
            const columns = $getColumnsByKey(key)
            if (!columns) return false
            $setColumnCount(columns, count)
            return true
          },
          COMMAND_PRIORITY_EDITOR,
        ),

        editor.registerCommand(
          UNWRAP_COLUMNS_COMMAND,
          ({ key }) => {
            const columns = $getColumnsByKey(key)
            if (!columns) return false
            $unwrapColumns(columns)
            return true
          },
          COMMAND_PRIORITY_EDITOR,
        ),

        editor.registerNodeTransform(ColumnNode, $normalizeColumn),
        editor.registerNodeTransform(ColumnsNode, $normalizeColumns),
      ),
    [editor],
  )

  return null
}
