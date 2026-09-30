'use client'

import { useDocumentTitle } from '@payloadcms/ui'
import React from 'react'

import styles from './KmdDocTitle.module.css'

/**
 * The lesson's title, drawn inside the save bar (`beforeDocumentControls` in
 * collections/BaiKMD.ts) so the edit view's header is one row: title on the left, Lưu and ⋮ on
 * the right. Payload's own title row above it is hidden in custom.scss. Follows the Tên bài
 * field as it is typed, the same way Payload's title does.
 */
export const KmdDocTitle: React.FC = () => {
  const { title } = useDocumentTitle()
  return <h1 className={styles.title}>{title}</h1>
}
