import type { CollectionConfig } from 'payload'

// A quyển (workbook) is the top of the learning tree:
//
//   quyển → chủ đề → chặng → nội dung → bài → hình
//
// This mirrors public.quyen / chude / chang / noidung / bai / hinh in the app's Supabase
// database (see src/lib/learning.ts in the root workspace). The quyển document itself holds
// nothing but its name: chủ đề live in their own collection (see ChuDe.ts) and everything
// below chủ đề is nested inside those documents. Order comes from the hidden _order field at
// each level — the `position` columns in Postgres have no equivalent here.
//
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
      // The chủ đề grid: a UI-only field, so nothing is stored on the quyển row. The component
      // lists this quyển's chủ đề as cards and links each one to its own edit page, and its
      // "add" button creates the chủ đề already attached to this quyển.
      name: 'chuDes',
      type: 'ui',
      label: 'Chủ đề',
      admin: {
        components: {
          Field: '@/components/admin/ChuDeGrid#ChuDeGrid',
        },
      },
    },
  ],
}

