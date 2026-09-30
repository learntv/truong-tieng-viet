import type { Block } from 'payload'

import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { ColumnsFeature } from '@/features/columns'
import { JsonViewFeature } from '@/features/json-view'
import { KmdBlocksFeature } from '@/features/kmd-blocks'
import { TextColorFeature } from '@/features/text-color'

import { ImageHotspots } from './ImageHotspots'
import { SyllableBlend } from './SyllableBlend'
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
          // Payload's own image (the `upload` node) is left out: a picture in a lesson is always
          // an ImageHotspots block, which is the same picture plus boxes that can be drawn on
          // it. Existing images were converted by the 20260930_064054 migration.
          ...defaultFeatures.filter((feature) => feature.key !== 'upload'),
          FixedToolbarFeature(),
          ColumnsFeature(),
          TextColorFeature(),
          JsonViewFeature(),
          KmdBlocksFeature({ blocks: [VocabularyCard, SyllableChain, SyllableBlend, ImageHotspots] }),
        ],
      }),
      label: 'Nội dung',
    },
  ],
}
