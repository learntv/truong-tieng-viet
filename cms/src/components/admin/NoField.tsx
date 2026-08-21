'use client'

import React from 'react'

/**
 * Renders nothing. Used for a field that is edited somewhere else in the UI — the bài title,
 * which is typed on the row header (see BaiRowLabel.tsx) — so it isn't a second input sitting
 * in the row with a label of its own.
 *
 * Unlike `admin.hidden`, the field stays in the client config and in form state, which is what
 * the component doing the editing binds to.
 */
export const NoField: React.FC = () => null
