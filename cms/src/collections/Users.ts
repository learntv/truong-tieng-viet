import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  labels: {
    singular: 'Người dùng',
    plural: 'Người dùng',
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email'],
  },
  auth: true,
  fields: [
    {
      // What the dashboard greets. Optional: an account created before this field
      // existed still works, and the greeting falls back to the email's local part
      // rather than showing a bare address.
      name: 'name',
      type: 'text',
      label: 'Tên',
      admin: {
        description: 'Tên hiển thị khi đăng nhập, ví dụ "cô Lan".',
      },
    },
  ],
}
