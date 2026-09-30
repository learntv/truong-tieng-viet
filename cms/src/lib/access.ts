import type { Access, ClientUser, FieldAccess } from 'payload'

// Who may edit what in the panel. Two roles (see collections/Users.ts):
//   admin — everything.
//   kmd   — Khai Minh Đức lessons and the image library only; the quyển → chủ đề tree,
//           Luyện nói and user accounts are out of reach, and hidden from their panel.
//
// Public `read` access on the content collections is untouched by any of this: the site reads
// them without a user at all.
export const ROLES = [
  { label: 'Quản trị viên', value: 'admin' },
  { label: 'Biên soạn KMD', value: 'kmd' },
] as const

export type Role = (typeof ROLES)[number]['value']

type MaybeUser = { role?: null | string } | null | undefined

export const isAdminUser = (user: MaybeUser): boolean => user?.role === 'admin'

export const isAdmin: Access = ({ req: { user } }) => isAdminUser(user)

export const isAdminField: FieldAccess = ({ req: { user } }) => isAdminUser(user)

// For `admin.hidden`: takes a collection out of a KMD editor's dashboard and routes.
export const hiddenFromNonAdmins = ({ user }: { user: ClientUser }): boolean =>
  !isAdminUser(user as MaybeUser)
