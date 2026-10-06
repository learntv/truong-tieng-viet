import type { CollectionConfig } from 'payload'

import { toCanvaEmbedUrl } from '@/lib/canva'
import { deriveSlug } from '@/lib/slug'

// One document per Khai Minh Đức (KMD) bài — the phonics curriculum's own lesson shape,
// independent of the quyển → chủ đề → chặng → nội dung → bài tree (see ChuDe.ts / Quyen.ts).
// A lesson is a flat list ordered by drag position (the hidden _order fractional index, same
// mechanism as Quyen.ts / ChuDe.ts / SpeakingTopics.ts), and its body is a single embedded
// Canva design, authored in Canva rather than in this CMS.
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
    // The edit view's header is one row: the title, the preview button, Lưu and the ⋮ menu. No
    // API tab. The title is drawn inside the save bar by KmdDocTitle; hiding Payload's own title
    // row, the lone "Chỉnh sửa" tab and the timestamps is CSS in custom.scss, since Payload has
    // no option for those.
    hideAPIURL: true,
    // The preview button, left of Lưu. SITE_URL is the site's own origin, unset locally where
    // the two apps share no domain, so the button falls back to the Canva design itself rather
    // than ever building a broken link.
    preview: (doc) => {
      const siteUrl = process.env.SITE_URL?.replace(/\/+$/, '')
      if (typeof doc?.slug === 'string' && siteUrl) {
        return `${siteUrl}/hoc-tap/khai-minh-duc/${doc.slug}`
      }
      return typeof doc?.canvaUrl === 'string' ? doc.canvaUrl.replace(/\?embed$/, '') : null
    },
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
      // The whole lesson body: a Canva design, embedded on the site in a 16:9 frame. Editors
      // paste Canva's share link or its full embed snippet; the hook keeps only the normalised
      // embed URL (see lib/canva.ts), so the site never renders pasted HTML.
      name: 'canvaUrl',
      type: 'text',
      required: true,
      label: 'Link Canva',
      admin: {
        placeholder: 'Dán link chia sẻ hoặc mã nhúng từ Canva',
        components: { afterInput: ['@/components/admin/kmd/CanvaPreview#CanvaPreview'] },
      },
      validate: (value: string | null | undefined) => {
        if (!value?.trim()) return 'Cần có link Canva.'
        return toCanvaEmbedUrl(value)
          ? true
          : 'Không nhận ra link Canva. Trong Canva, chọn Chia sẻ, rồi Nhúng hoặc Chỉ xem, và dán link đó.'
      },
      hooks: {
        beforeValidate: [
          ({ value }) => (typeof value === 'string' ? (toCanvaEmbedUrl(value) ?? value) : value),
        ],
      },
    },
  ],
}
