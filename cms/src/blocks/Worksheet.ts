import type { Block } from 'payload'

// Phiếu luyện đọc & bài tập — free-form rich text, because worksheet slides vary the most
// between lessons (numbered task lists mixing reading rows, sentences and instructions) and
// pinning them to a schema would fight the editor rather than help (see design.md).
export const Worksheet: Block = {
  slug: 'worksheet',
  labels: { singular: 'Phiếu bài tập', plural: 'Phiếu bài tập' },
  fields: [
    { name: 'content', type: 'richText', label: 'Nội dung' },
    {
      name: 'preview',
      type: 'ui',
      label: 'Xem trước',
      admin: { components: { Field: '@/components/admin/kmd/WorksheetPreview#WorksheetPreview' } },
    },
  ],
}
