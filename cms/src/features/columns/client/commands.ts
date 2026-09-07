'use client'

import type { NodeKey } from '@payloadcms/richtext-lexical/lexical'

import { createCommand } from '@payloadcms/richtext-lexical/lexical'

import type { ColumnCount } from '../nodes/ColumnsNode'

/** Insert a new column row at the caret. */
export const INSERT_COLUMNS_COMMAND = createCommand<ColumnCount>('INSERT_COLUMNS_COMMAND')

/** Re-shape an existing row to 1, 2 or 3 columns, keeping its content. */
export const SET_COLUMN_COUNT_COMMAND = createCommand<{ count: ColumnCount; key: NodeKey }>(
  'SET_COLUMN_COUNT_COMMAND',
)

/** Take a row apart, leaving its content as ordinary top-level blocks. */
export const UNWRAP_COLUMNS_COMMAND = createCommand<{ key: NodeKey }>('UNWRAP_COLUMNS_COMMAND')
