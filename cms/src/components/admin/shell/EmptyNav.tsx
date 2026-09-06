import React from 'react'

/**
 * Stands in for Payload's sidebar, rendering nothing visible.
 *
 * It renders an element rather than `null`, and that matters: `DefaultTemplate` lays the shell
 * out as a two-column grid whose first column is the nav and whose second is the view. With no
 * element at all, the view becomes the grid's *first* item and is placed in the nav's column —
 * which is `--nav-width` (275px) wide whenever the nav is considered open, and Payload's own
 * default preference is open. Every screen then renders 275px wide against an empty remainder.
 *
 * So: an empty element to hold the column, and `custom.scss` pins that column to zero.
 *
 * This rather than `admin.hidden` on the collections, which would remove their routes as well
 * as their listings — and every chủ đề lives at one of those routes.
 */
export const EmptyNav: React.FC = () => <div aria-hidden="true" className="ttv-no-nav" />
