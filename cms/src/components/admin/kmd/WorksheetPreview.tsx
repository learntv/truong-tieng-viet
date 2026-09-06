'use client'

import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import type { UIFieldClientComponent } from 'payload'

import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import { PreviewEmpty, PreviewShell } from './PreviewShell'
import { useBlockValue } from './useBlockValue'

import styles from './WorksheetPreview.module.css'

type WorksheetValue = { content?: DefaultTypedEditorState }

/** Whether a lexical document holds any actual content, beyond its empty-paragraph skeleton. */
const isEmptyLexical = (content?: DefaultTypedEditorState): boolean => {
  const children = content?.root?.children
  if (!children || children.length === 0) return true
  if (children.length > 1) return false
  const only = children[0] as { children?: unknown[] }
  return !only.children || only.children.length === 0
}

export const WorksheetPreview: UIFieldClientComponent = ({ path }) => {
  const { content } = useBlockValue<WorksheetValue>(path)

  return (
    <PreviewShell>
      {isEmptyLexical(content) ? (
        <PreviewEmpty />
      ) : (
        <div className={styles.content}>
          <RichText data={content!} />
        </div>
      )}
    </PreviewShell>
  )
}
