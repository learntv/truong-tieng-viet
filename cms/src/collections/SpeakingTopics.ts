import type { CollectionConfig } from 'payload'

// Speaking-practice topics for the app's /hoc-tap/luyen-noi screens. The app reads this
// collection over the public REST API (src/hooks/useSpeakingContent.ts in the root workspace).
//
// Ids are load-bearing outside the CMS: the topic id is the /luyen-noi/$chuDeId URL param,
// and each sentence row id is the key for user progress (public.speaking_progress and the
// anonymous localStorage store) — hence the custom text id instead of Payload's default.
// Seeded ids keep the "noi-" prefix used since the content was hardcoded; renaming an id
// orphans existing progress, so don't.
export const SpeakingTopics: CollectionConfig = {
  slug: 'speaking-topics',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['id', 'emoji', 'title'],
  },
  // Drag-to-reorder in the list view; display order lives in the hidden _order
  // fractional-index field, which the app's fetch sorts by.
  orderable: true,
  defaultSort: '_order',
  fields: [
    {
      name: 'id',
      type: 'text',
      required: true,
      admin: {
        description:
          "Mã chủ đề dùng trong URL, ví dụ 'noi-chao-hoi'. Không đổi sau khi tạo — tiến độ học của học sinh gắn với mã này.",
      },
    },
    {
      name: 'emoji',
      type: 'text',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'sentences',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
