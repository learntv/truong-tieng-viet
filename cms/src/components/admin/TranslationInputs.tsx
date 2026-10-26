'use client'

import { useField } from '@payloadcms/ui'
import React, { useEffect, useRef, useState } from 'react'

import { TRANSLATION_LOCALES, type TranslationLocale, translationPath } from '@/lib/translations'

import styles from './TranslationInputs.module.css'

/**
 * The translations of one text field, edited right under its Vietnamese (see lib/translations.ts).
 * Each language starts as a small "+ EN" button, so an untranslated field costs one line of
 * chrome; once it has text, or the button is pressed, it is an input tagged with its language.
 * Clearing the input and leaving it turns it back into the button.
 */
export function TranslationInputs({
  fieldPath,
  readOnly,
}: {
  fieldPath: string
  readOnly?: boolean
}) {
  return (
    <div className={styles.translations}>
      {TRANSLATION_LOCALES.map((locale) => (
        <TranslationInput
          key={locale.code}
          locale={locale}
          path={translationPath(fieldPath, locale.code)}
          readOnly={readOnly}
        />
      ))}
    </div>
  )
}

function TranslationInput({
  locale,
  path,
  readOnly,
}: {
  locale: TranslationLocale
  path: string
  readOnly?: boolean
}) {
  const { setValue, value } = useField<null | string>({ path })
  const text = value ?? ''
  const [open, setOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const tag = locale.code.toUpperCase()

  // Focus follows the click that opened the input, not the first render of a filled one.
  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  if (!text && !open) {
    if (readOnly) return null
    return (
      <button
        className={styles.add}
        onClick={() => setOpen(true)}
        title={`Thêm bản dịch ${locale.label}`}
        type="button"
      >
        + {tag}
      </button>
    )
  }

  return (
    <label className={styles.field}>
      <span className={styles.tag}>{tag}</span>
      <input
        aria-label={`Bản dịch ${locale.label}`}
        className={styles.input}
        onBlur={() => {
          if (!text) setOpen(false)
        }}
        // Stored as null rather than "" when cleared, so "no translation" has one shape.
        onChange={(event) => setValue(event.target.value || null)}
        placeholder={`Bản dịch ${locale.label}`}
        readOnly={readOnly}
        ref={inputRef}
        value={text}
      />
    </label>
  )
}

/** The `afterInput` of a translatable text field: its translations, under its own input. */
export function TranslationsAfterInput() {
  const { path, readOnly } = useField()
  return <TranslationInputs fieldPath={path} readOnly={readOnly} />
}

/** The translations group's own slot: it is edited from the field it belongs to. */
export function RenderNothing() {
  return null
}
