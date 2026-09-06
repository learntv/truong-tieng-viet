'use client'

import React from 'react'

import styles from './PreviewShell.module.css'

/**
 * The read-only frame every block preview renders inside — a dashed box labelled "Xem trước",
 * so an editor can tell the mockup apart from the fields above it. Shared so a block's preview
 * component is only the layout specific to that block's shape.
 */
export const PreviewShell: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className={`${styles.shell} field-type`}>
    <p className={styles.label}>Xem trước</p>
    {children}
  </div>
)

/** What a preview shows in place of its layout when the section holds nothing at all yet. */
export const PreviewEmpty: React.FC<{ children?: React.ReactNode }> = ({
  children = 'Chưa có nội dung.',
}) => <p className={styles.empty}>{children}</p>
