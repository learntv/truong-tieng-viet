'use client'

import { useBlockComponentContext } from '@payloadcms/richtext-lexical/client'
import { RenderFields } from '@payloadcms/ui'
import type { ClientField } from 'payload'
import React, { useMemo } from 'react'

import styles from './SyllableChainBlock.module.css'

const renderFieldsProps = {
  forceRender: true,
  parentIndexPath: '',
  parentPath: '',
  parentSchemaPath: '',
  permissions: true,
} as const

const CELL_NAMES = ['amDau', 'van', 'dauThanh', 'tieng'] as const

/**
 * Admin-editor rendering for the SyllableChain block (see SyllableChain.ts) — âm đầu, vần, dấu
 * thanh and tiếng laid out as a chain of boxes joined by arrows, instead of Payload's default
 * stacked field list. One chain per block (see SyllableChain.ts for why there's no rows array),
 * so this only ever renders these four fields, same layout every time.
 */
export const SyllableChainBlock: React.FC = () => {
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
      <div className={styles.chain}>
        {CELL_NAMES.map(
          (name, index) => fieldsByName[name] && (
            <React.Fragment key={name}>
              {index > 0 && (
                <span className={styles.arrow} aria-hidden>
                  →
                </span>
              )}
              <RenderFields fields={[fieldsByName[name]]} {...renderFieldsProps} />
            </React.Fragment>
          ),
        )}
      </div>
    </div>
  )
}
