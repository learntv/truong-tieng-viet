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
    defaultColumns: ['title', 'amVan'],
    // The external-link button in the save bar. Same destination as the "Xem trước" control in
    // the section header (KmdBlocksField.tsx) — this one is Payload's own, in the place a
    // Payload user looks for it.
    //
    // SITE_URL is the site's own origin, unset locally where the two apps share no domain, so
    // the button falls back to the internal preview route rather than ever building a broken
    // link.
    preview: (doc) => {
      const siteUrl = process.env.SITE_URL?.replace(/\/+$/, '')
      if (typeof doc?.slug === 'string' && siteUrl) {
        return `${siteUrl}/hoc-tap/khai-minh-duc/${doc.slug}`
      }
      return doc?.id ? `/xem-truoc/bai-kmd/${doc.id}` : null
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
      // The lesson's public address — the URL segment at /hoc-tap/khai-minh-duc/<slug>. Derived
      // from the title when left blank, and never re-derived once set (even if the title later
      // changes): the slug is a shared, bookmarkable address, not a display of the current title.
      // See openspec/changes/display-kmd-lessons/design.md — "Slug: derived on write, never
      // re-derived".
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Đường dẫn',
      admin: {
        description:
          'Địa chỉ công khai của bài học (vd: ong-ong-ung-ung). Để trống để tự tạo từ tên bài. Đổi tên bài không làm đổi đường dẫn.',
        placeholder: 'Để trống để tự tạo từ tên bài',
      },
      hooks: {
        beforeValidate: [
          ({ value, siblingData }) => {
            if (typeof value === 'string' && value.trim().length > 0) return value
            const title = typeof siblingData?.title === 'string' ? siblingData.title : ''
            return deriveSlug(title)
          },
        ],
      },
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
