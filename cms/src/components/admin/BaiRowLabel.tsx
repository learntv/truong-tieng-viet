'use client'

import { useField, useRowLabel } from '@payloadcms/ui'
import React from 'react'

import styles from './BaiRowLabel.module.css'

/**
 * The label of a bài row, replacing Payload's default "Bài 01" — and the place the bài is
 * renamed. The input is bound straight to the row's `title` in form state, so typing here is
 * what names the bài; the same field inside the row is hidden (see NoiDungSections.module.css).
 *
 * Payload's collapsible puts a full-size toggle button behind the header and sets the header
 * itself to `pointer-events: none`, so the input has to opt back in and sit above the toggle,
 * or clicks would collapse the row instead of landing in the field.
 */
export const BaiRowLabel: React.FC = () => {
  const { path } = useRowLabel()
  const { setValue, value } = useField<string>({ path: `${path}.title` })

  return (
    <input
      className={styles.input}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Chưa đặt tên"
      value={value ?? ''}
    />
  )
}
