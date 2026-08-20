import type { CollectionConfig } from 'payload'

// A quyển (workbook) holds the whole learning tree in one document:
//
//   quyển → chủ đề → chặng → nội dung → bài → hình
//
// This mirrors public.quyen / chude / chang / noidung / bai / hinh in the app's Supabase
// database (see src/lib/learning.ts in the root workspace), but collapses the five child
// tables into nested arrays so a teacher edits one quyển as a single document instead of
// hopping between six collections. Order comes from array order — the `position` columns
// in Postgres have no equivalent field here.
//
// No level has a hand-typed id field — not the quyển, not the nested rows. Payload
// generates them all, and those generated ids are what downstream consumers key off (chặng
// ids back student progress, chủ đề ids appear in roadmap URLs, hình ids back the highlight
// overlays in src/data/lessonHighlights.ts). They are stable as long as a row is edited
// rather than deleted and re-added — deleting a row and recreating it mints a new id and
// orphans whatever pointed at the old one.
// The set of quyển is fixed: this list is the whole roster, and `onInit` in payload.config.ts
// creates any row that is missing on server start. Adding a quyển means adding an entry here
// and redeploying — editors can't do it from the admin UI, by design.
export const QUYEN_ROSTER = [
  { slug: 'quyen-1', title: 'Quyển 1' },
  { slug: 'quyen-2', title: 'Quyển 2' },
] as const

export const Quyen: CollectionConfig = {
  slug: 'quyen',
  labels: {
    singular: 'Quyển',
    plural: 'Quyển',
  },
  // Editors edit what's inside a quyển, never the roster itself: no create, no delete, and
  // slug/title are locked below. `onInit` seeds the rows through the Local API, which bypasses
  // access control, so these denials don't block it.
  access: {
    read: () => true,
    create: () => false,
    delete: () => false,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title'],
  },
  // Duplicating would mint a quyển outside the roster; hide the button.
  disableDuplicate: true,
  // Drag-to-reorder in the list view; display order lives in the hidden _order
  // fractional-index field.
  orderable: true,
  defaultSort: '_order',
  fields: [
    {
      // Stable key for the roster and for anything outside the CMS that needs to name a
      // specific quyển — the numeric document id is assigned by Postgres and differs between
      // environments. Written by `onInit` only; never typed by hand.
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      access: { update: () => false },
      admin: {
        readOnly: true,
        description: 'Mã cố định của quyển. Không sửa được.',
      },
    },
    {
      // Fixed alongside the slug: the title comes from QUYEN_ROSTER, not from the editor.
      name: 'title',
      type: 'text',
      required: true,
      access: { update: () => false },
      admin: {
        readOnly: true,
        description: 'Tên quyển cố định. Không sửa được.',
      },
    },
    {
      name: 'chuDes',
      label: 'Chủ đề',
      type: 'array',
      labels: { singular: 'Chủ đề', plural: 'Chủ đề' },
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Tên chủ đề' },
        {
          name: 'changs',
          label: 'Chặng',
          type: 'array',
          labels: { singular: 'Chặng', plural: 'Chặng' },
          admin: { initCollapsed: true },
          fields: [
            { name: 'title', type: 'text', required: true, label: 'Tên chặng' },
            {
              name: 'noiDungs',
              label: 'Nội dung',
              type: 'array',
              labels: { singular: 'Nội dung', plural: 'Nội dung' },
              admin: { initCollapsed: true },
              fields: [
                { name: 'title', type: 'text', required: true, label: 'Tên nội dung' },
                {
                  name: 'bais',
                  label: 'Bài',
                  type: 'array',
                  labels: { singular: 'Bài', plural: 'Bài' },
                  admin: { initCollapsed: true },
                  fields: [
                    {
                      // public.bai.text is a jsonb array of lines; each row here is one line.
                      name: 'texts',
                      label: 'Câu chữ',
                      type: 'array',
                      labels: { singular: 'Câu', plural: 'Câu' },
                      fields: [{ name: 'text', type: 'text', required: true }],
                    },
                    {
                      // public.bai.meta — optional media attached to the bài.
                      name: 'meta',
                      label: 'Tệp đính kèm',
                      type: 'group',
                      fields: [
                        { name: 'audioUrl', type: 'text', label: 'Đường dẫn âm thanh' },
                        { name: 'videoUrl', type: 'text', label: 'Đường dẫn video' },
                        { name: 'link', type: 'text', label: 'Liên kết' },
                      ],
                    },
                    {
                      name: 'hinhs',
                      label: 'Hình',
                      type: 'array',
                      labels: { singular: 'Hình', plural: 'Hình' },
                      admin: { initCollapsed: true },
                      fields: [
                        {
                          // Uploaded into the media collection, which is backed by Cloudflare
                          // R2 in production (see the s3Storage plugin in payload.config.ts).
                          // In dev the same upload lands on the local filesystem instead.
                          name: 'image',
                          type: 'upload',
                          relationTo: 'media',
                          required: true,
                          label: 'Hình',
                        },
                        {
                          // public.hinh.text is a jsonb array of captions.
                          name: 'captions',
                          label: 'Chú thích',
                          type: 'array',
                          labels: { singular: 'Chú thích', plural: 'Chú thích' },
                          fields: [{ name: 'text', type: 'text', required: true }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}

