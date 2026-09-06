import type { Block } from 'payload'

// A word/definition card editors can drop inline into a FreeText section — for lesson slides
// that call out a single âm/vần or word without needing a whole separate section for it.
//
// Rendered in the admin editor as an actual flashcard (see VocabularyCardBlock.tsx), not a
// stacked field list — labels are hidden and placeholders take their place because the card's
// own layout (big word, muted meaning, quoted example) already says what each field is.
export const VocabularyCard: Block = {
  slug: 'vocabularyCard',
  labels: { singular: 'Thẻ từ vựng', plural: 'Thẻ từ vựng' },
  admin: {
    // Hides the block's built-in "blockName" title field — every card is already named by its
    // Từ, so a second freeform title would just be an empty field editors have to skip past.
    disableBlockName: true,
    components: {
      Block: '@/components/admin/blocks/VocabularyCardBlock#VocabularyCardBlock',
    },
  },
  fields: [
    {
      name: 'word',
      type: 'text',
      required: true,
      label: 'Từ',
      admin: { className: 'vocabulary-card-field vocabulary-card-field--word', placeholder: 'Từ' },
    },
    {
      name: 'meaning',
      type: 'text',
      label: 'Nghĩa',
      admin: {
        className: 'vocabulary-card-field vocabulary-card-field--meaning',
        placeholder: 'Nghĩa của từ',
      },
    },
    {
      name: 'example',
      type: 'text',
      label: 'Ví dụ',
      admin: {
        className: 'vocabulary-card-field vocabulary-card-field--example',
        placeholder: 'Đặt câu ví dụ…',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Hình ảnh',
      admin: { className: 'vocabulary-card-field vocabulary-card-field--image' },
    },
  ],
}
