import type { CollectionConfig } from 'payload'

import { KMD_BLOCKS } from '@/blocks'
import { deriveSlug } from '@/lib/slug'

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
    defaultColumns: ['title'],
    // The edit view's header is one row: the title, Lưu and the ⋮ menu. No API tab, and no
    // preview button (`admin.preview`), which editors didn't use. The title is drawn inside the
    // save bar by KmdDocTitle; hiding Payload's own title row, the lone "Chỉnh sửa" tab and the
    // timestamps is CSS in custom.scss, since Payload has no option for those.
    hideAPIURL: true,
    components: {
      edit: { beforeDocumentControls: ['@/components/admin/kmd/KmdDocTitle#KmdDocTitle'] },
    },
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
      // The lesson's public address — the URL segment at /hoc-tap/khai-minh-duc/<slug>. Always
      // derived from the title, never typed: hidden from the editor, filled on the first save,
      // and never re-derived after that (even if the title later changes): the slug is a shared,
      // bookmarkable address, not a display of the current title.
      // See openspec/changes/display-kmd-lessons/design.md — "Slug: derived on write, never
      // re-derived".
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Đường dẫn',
      admin: { hidden: true },
      // Replaces the default required check, which the admin form runs against its own state
      // before any hook has filled the field, and so would refuse every new lesson's first save
      // over a field the editor can't see. The hook below always leaves a value.
      validate: () => true as const,
      hooks: {
        beforeValidate: [
          async ({ originalDoc, req, siblingData, value }) => {
            if (typeof value === 'string' && value.trim().length > 0) return value
            const title = typeof siblingData?.title === 'string' ? siblingData.title : ''
            const base = deriveSlug(title) || 'bai'

            // No field to fix a clash in any more, so two lessons with the same title get
            // `-2`, `-3`… instead of a unique-constraint error about a hidden field.
            for (let n = 1; ; n++) {
              const candidate = n === 1 ? base : `${base}-${n}`
              const { totalDocs } = await req.payload.count({
                collection: 'bai-kmd',
                req,
                where: {
                  slug: { equals: candidate },
                  ...(originalDoc?.id ? { id: { not_equals: originalDoc.id } } : {}),
                },
              })
              if (totalDocs === 0) return candidate
            }
          },
        ],
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
