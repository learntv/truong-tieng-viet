import type { Block } from 'payload'

import { FixedToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

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
        features: ({ defaultFeatures }) => [...defaultFeatures, FixedToolbarFeature()],
      }),
      label: 'Nội dung',
    },
  ],
}
