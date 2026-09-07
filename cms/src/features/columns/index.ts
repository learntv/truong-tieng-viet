import { createNode, createServerFeature } from '@payloadcms/richtext-lexical'

import { ColumnNode, ColumnsNode } from './nodes/ColumnsNode'

/**
 * Server half of the columns feature: it registers the two node types so Payload knows how to
 * validate and store them, and points at the client half that does the editing. All the
 * behaviour lives there — see ./client/index.tsx for why the columns are nodes in the lesson's
 * own editor rather than nested editors in a block.
 */
export const ColumnsFeature = createServerFeature({
  feature: {
    ClientFeature: '@/features/columns/client#ColumnsFeatureClient',
    nodes: [createNode({ node: ColumnsNode }), createNode({ node: ColumnNode })],
  },
  key: 'columns',
})

export { ColumnNode, ColumnsNode } from './nodes/ColumnsNode'
