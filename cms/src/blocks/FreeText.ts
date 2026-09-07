import type { Block } from 'payload'

import { BlocksFeature, FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { ColumnsFeature } from '@/features/columns'

import { SyllableChain } from './SyllableChain'
import { VocabularyCard } from './VocabularyCard'

// Văn bản tự do — free-form rich text, because lesson slides vary the most between lessons
// (numbered task lists mixing reading rows, sentences and instructions) and pinning them to a
// schema would fight the editor rather than help (see design.md).
export const FreeText: Block = {
  slug: 'freeText',
  labels: { singular: 'Văn bản tự do', plural: 'Văn bản tự do' },
  fields: [
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        admin: {
          // Payload's own block handles are turned off because ColumnsFeature ships replacements
          // that can see inside a column; see BlockHandlesPlugin.tsx. Leaving these on would put
          // two drag implementations on the same `document` listeners, racing to move the same
          // node — and the built-in one can only ever address top-level blocks, so half of a
          // lesson's content would be undraggable.
          hideAddBlockButton: true,
          hideDraggableBlockElement: true,
        },
        features: ({ defaultFeatures }) => [
          ...defaultFeatures,
          FixedToolbarFeature(),
          ColumnsFeature(),
          BlocksFeature({ blocks: [VocabularyCard, SyllableChain] }),
        ],
      }),
      label: 'Nội dung',
    },
  ],
}
