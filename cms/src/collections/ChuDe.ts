import type { CollectionConfig } from 'payload'

// A chủ đề (topic) and everything under it:
//
//   chủ đề → chặng → nội dung → bài → hình
//
// Chủ đề is its own collection rather than an array inside the quyển so each one gets a real
// admin page at /admin/collections/chu-de/:id — a quyển holds dozens of them and editing the
// whole tree as a single document meant six levels of accordion and loading every bài and
// hình just to rename one chặng. The levels below chủ đề stay nested: they are only ever
// edited in the context of their chủ đề, and keeping them here means one save per topic.
//
// Ids are generated, never hand-typed, and downstream consumers key off them (chặng ids back
// student progress, chủ đề ids appear in roadmap URLs, hình ids back the highlight overlays
// in src/data/lessonHighlights.ts). They survive edits but not delete-and-recreate.
export const ChuDe: CollectionConfig = {
  slug: 'chu-de',
  labels: {
    singular: 'Chủ đề',
    plural: 'Chủ đề',
  },
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'quyen'],
  },
  // Drag-to-reorder, both in this collection's list view and in the grid on the quyển page,
  // which sorts by the same hidden _order fractional index.
  orderable: true,
  defaultSort: '_order',
  fields: [
    { name: 'title', type: 'text', required: true, label: 'Tên chủ đề' },
    {
      // Which quyển this chủ đề belongs to. Set automatically when the grid on a quyển page
      // creates it; editors only touch this when they create a chủ đề from the list view.
      name: 'quyen',
      type: 'relationship',
      relationTo: 'quyen',
      required: true,
      index: true,
      label: 'Quyển',
      admin: { position: 'sidebar' },
    },
    {
      name: 'changs',
      label: 'Chặng',
      type: 'array',
      labels: { singular: 'Chặng', plural: 'Chặng' },
      // Rendered as tabs rather than the default stack of collapsibles — one tab per chặng,
      // with that chặng's nội dung → bài → hình inside the panel. See ChangTabs.tsx.
      admin: {
        initCollapsed: true,
        components: {
          Field: '@/components/admin/ChangTabs#ChangTabs',
        },
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          label: 'Tên chặng',
          admin: { placeholder: 'Tên chặng' },
        },
        {
          name: 'noiDungs',
          label: 'Nội dung',
          type: 'array',
          labels: { singular: 'Nội dung', plural: 'Nội dung' },
          // Presented as section headings dividing the chặng's bài, the way sections divide a
          // slide deck — the bài still belong to a nội dung in the database. See
          // NoiDungSections.tsx.
          admin: {
            components: {
              Field: '@/components/admin/NoiDungSections#NoiDungSections',
            },
          },
          fields: [
            {
              // The tab and section headings show this name and nothing else, so the field's
              // own label is hidden there and the placeholder does the prompting.
              name: 'title',
              type: 'text',
              required: true,
              label: 'Tên nội dung',
              admin: { placeholder: 'Tên phần' },
            },
            {
              name: 'bais',
              label: 'Bài',
              type: 'array',
              labels: { singular: 'Bài', plural: 'Bài' },
              admin: {
                initCollapsed: true,
                components: {
                  RowLabel: '@/components/admin/BaiRowLabel#BaiRowLabel',
                },
              },
              fields: [
                {
                  // Optional — an unnamed bài says so instead of showing a number. public.bai
                  // has no matching column, so this is CMS-side only until the app's table
                  // grows one.
                  name: 'title',
                  type: 'text',
                  label: 'Tên bài',
                  // Edited on the row header, so the field itself renders nothing here.
                  admin: {
                    components: {
                      Field: '@/components/admin/NoField#NoField',
                    },
                  },
                },
                {
                  // public.bai.meta — optional media attached to the bài.
                  name: 'meta',
                  label: 'Tệp đính kèm',
                  type: 'group',
                  fields: [
                    {
                      // Uploaded like the hình are, rather than a URL typed by hand. Lands in
                      // the same media collection, which is R2-backed in production — and that
                      // collection also holds every image, so the filter keeps this field to
                      // audio files, both in the picker and on save.
                      name: 'audio',
                      type: 'upload',
                      relationTo: 'media',
                      label: 'Âm thanh',
                      filterOptions: { mimeType: { contains: 'audio' } },
                      // The upload card names the file but can't play it; AudioPreview puts a
                      // player under it so the recording can be checked here.
                      admin: {
                        components: {
                          afterInput: ['@/components/admin/AudioPreview#AudioPreview'],
                        },
                      },
                    },
                    {
                      // A YouTube link — the app embeds it. YouTubePreview renders the embed
                      // under the input so the right video can be confirmed here.
                      name: 'videoUrl',
                      type: 'text',
                      label: 'Video YouTube',
                      admin: {
                        placeholder: 'https://www.youtube.com/watch?v=…',
                        components: {
                          afterInput: ['@/components/admin/YouTubePreview#YouTubePreview'],
                        },
                      },
                    },
                    { name: 'link', type: 'text', label: 'Liên kết' },
                  ],
                },
                {
                  name: 'hinhs',
                  label: 'Hình',
                  type: 'array',
                  labels: { singular: 'Hình', plural: 'Hình' },
                  // A gallery whose add button opens the file picker and uploads straight into
                  // a new row — see HinhGallery.tsx.
                  admin: {
                    components: {
                      Field: '@/components/admin/HinhGallery#HinhGallery',
                    },
                  },
                  fields: [
                    {
                      // Uploaded into the media collection, which is backed by Cloudflare R2
                      // in production (see the s3Storage plugin in payload.config.ts). In dev
                      // the same upload lands on the local filesystem instead. That collection
                      // holds audio too, so the filter keeps this field to images.
                      name: 'image',
                      type: 'upload',
                      relationTo: 'media',
                      required: true,
                      label: 'Hình',
                      filterOptions: { mimeType: { contains: 'image' } },
                    },
                    {
                      // public.hinh.text is a jsonb array of captions. Edited as a cloud of
                      // chips rather than a stack of rows — see TextCloud.tsx.
                      name: 'captions',
                      label: 'Chú thích',
                      type: 'array',
                      labels: { singular: 'Chú thích', plural: 'Chú thích' },
                      admin: {
                        components: {
                          Field: '@/components/admin/TextCloud#TextCloud',
                        },
                      },
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
}
