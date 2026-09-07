'use client'

import { useBlockComponentContext } from '@payloadcms/richtext-lexical/client'
import { RenderFields } from '@payloadcms/ui'
import type { ClientField } from 'payload'
import React, { useMemo } from 'react'

import styles from './VocabularyCardBlock.module.css'

const renderFieldsProps = {
  forceRender: true,
  parentIndexPath: '',
  parentPath: '',
  parentSchemaPath: '',
  permissions: true,
} as const

/**
 * Admin-editor rendering for the VocabularyCard block (see VocabularyCard.ts) — a flashcard
 * (image, word, meaning, quoted example) instead of Payload's default stacked field list, so an
 * editor sees roughly what the card will look like while filling it in.
 *
 * Built on `useBlockComponentContext`, the same public API Payload's own premade CodeBlock uses
 * for a custom `admin.components.Block` — it hands back the block's already-scoped form
 * (`formSchema`) so this only has to decide layout, not re-implement field editing. The card
 * renders flat, without the default collapse/expand chrome — a two-line flashcard has nothing
 * worth collapsing — keeping only the remove button.
 */
export const VocabularyCardBlock: React.FC = () => {
  const { formSchema, RemoveButton } = useBlockComponentContext()

  const fieldsByName = useMemo(() => {
    const byName: Record<string, ClientField> = {}
    for (const field of formSchema) {
      if ('name' in field && field.name) byName[field.name] = field
    }
    return byName
  }, [formSchema])

  return (
    <div className={styles.card}>
      <div className={styles.remove}>
        <RemoveButton />
      </div>
      {fieldsByName.image && (
        <div className={styles.media}>
          <RenderFields fields={[fieldsByName.image]} {...renderFieldsProps} />
        </div>
      )}
      <div className={styles.text}>
        {fieldsByName.word && (
          <RenderFields fields={[fieldsByName.word]} {...renderFieldsProps} />
        )}
        {fieldsByName.meaning && (
          <RenderFields fields={[fieldsByName.meaning]} {...renderFieldsProps} />
        )}
        {fieldsByName.example && (
          <RenderFields fields={[fieldsByName.example]} {...renderFieldsProps} />
        )}
      </div>
    </div>
  )
}
