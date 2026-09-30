import type { Access, CollectionConfig } from 'payload'

import { hiddenFromNonAdmins, isAdmin, isAdminField, isAdminUser, ROLES } from '@/lib/access'

// An admin sees and manages every account; anyone else only their own (the Tài khoản page).
const adminOrSelf: Access = ({ req: { user } }) => {
  if (isAdminUser(user)) return true
  return user ? { id: { equals: user.id } } : false
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role'],
    hidden: hiddenFromNonAdmins,
  },
  auth: true,
  access: {
    read: adminOrSelf,
    update: adminOrSelf,
    create: isAdmin,
    delete: isAdmin,
  },
  fields: [
    // Email added by default
    {
      name: 'role',
      type: 'select',
      label: 'Vai trò',
      required: true,
      // The narrower role, so an account made without thinking about it can't touch the
      // quyển content. Existing accounts were made admins by the migration that added this.
      defaultValue: 'kmd',
      options: ROLES.map(({ label, value }) => ({ label, value })),
      // On the session, so access checks read it straight off `req.user`.
      saveToJWT: true,
      // Nobody promotes themselves: only an admin sets or changes a role.
      access: { create: isAdminField, update: isAdminField },
      hooks: {
        beforeChange: [
          // The very first account (the create-first-user screen, which runs with no one
          // logged in) has to be an admin, or the panel would start out with nobody able to
          // manage it.
          async ({ operation, req, value }) => {
            if (operation !== 'create') return value
            const { totalDocs } = await req.payload.count({ collection: 'users', req })
            return totalDocs === 0 ? 'admin' : value
          },
        ],
      },
    },
  ],
}
