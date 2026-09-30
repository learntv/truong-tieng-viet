import type { CollectionConfig } from 'payload'

import { isAdmin } from '@/lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    // Any editor uploads (a KMD lesson needs its pictures), but only an admin deletes: the
    // library is shared with the quyển content, which a KMD editor can't see is using a file.
    delete: isAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: true,
}
