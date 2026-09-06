import type { CollectionConfig } from 'payload'

import { KMD_BLOCKS } from '@/blocks'

// One document per Khai Minh Đức (KMD) bài — the phonics curriculum's own lesson shape,
// independent of the quyển → chủ đề → chặng → nội dung → bài tree (see ChuDe.ts / Quyen.ts).
// A lesson is a flat list ordered by drag position (the hidden _order fractional index, same
// mechanism as Quyen.ts / ChuDe.ts / SpeakingTopics.ts), with a body composed from a fixed
// vocabulary of typed blocks (see src/blocks) rather than the nested-array shape the rest of
// the CMS uses — see openspec/changes/kmd-lessons/design.md for why.
export const BaiKMD: CollectionConfig = {
  slug: 'bai-kmd',
  labels: {
    singular: 'Bài KMD',
    plural: 'Bài KMD',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'amVan'],
  },
  // Drag-to-reorder in the list view; display order lives in the hidden _order
  // fractional-index field. Replaces a hand-entered "Số bài" number, which duplicated what
  // the list's own ordering already says.
  orderable: true,
  defaultSort: '_order',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Tên bài',
      admin: { placeholder: 'VD: ONG – ÔNG – UNG – ƯNG' },
    },
    {
      // Not a `select`: the full inventory of âm/vần across 50+ lessons isn't known up front,
      // and a lesson can teach one, a pair, or several (see design.md — "amVan").
      name: 'amVan',
      type: 'text',
      hasMany: true,
      label: 'Âm/Vần',
      admin: {
        description: 'Âm hoặc vần bài học dạy, mỗi âm/vần một mục.',
        placeholder: 'Nhập rồi nhấn Enter để thêm',
      },
    },
    {
      name: 'blocks',
      type: 'blocks',
      label: 'Nội dung bài học',
      blocks: KMD_BLOCKS,
      // A two-pane "slide editor" (section list + editor for the selected section) in place of
      // the default stacked-accordion blocks UI — see KmdBlocksField.tsx.
      admin: {
        components: { Field: '@/components/admin/kmd/KmdBlocksField#KmdBlocksField' },
      },
    },
  ],
}
