'use client'

import type { ArrayFieldClientComponent } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import { FieldLabel, useField, useForm, useTranslation, XIcon } from '@payloadcms/ui'
import React, { useCallback, useState } from 'react'

import styles from './TextCloud.module.css'

// Keeps an empty chip from collapsing to a sliver before anything is typed into it.
const MIN_INPUT_SIZE = 6

type ChipProps = {
  readonly label: string
  readonly onRemove: () => void
  readonly readOnly?: boolean
  readonly rowPath: string
}

/** One entry: an input that carries the chip's own type styling, plus an × to drop the row. */
const TextChip: React.FC<ChipProps> = ({ label, onRemove, readOnly, rowPath }) => {
  const { setValue, value } = useField<string>({ path: `${rowPath}.text` })
  const text = value ?? ''

  return (
    <span className={styles.chip}>
      <input
        className={styles.chipInput}
        onChange={(e) => setValue(e.target.value)}
        // Backspace in an already-empty chip removes it, so clearing one out doesn't need the ×.
        onKeyDown={(e) => {
          if (e.key === 'Backspace' && text === '') {
            e.preventDefault()
            onRemove()
          }
        }}
        readOnly={readOnly}
        size={Math.max(text.length, MIN_INPUT_SIZE)}
        value={text}
      />
      {!readOnly && (
        <button
          aria-label={`Xoá ${label.toLowerCase()}`}
          className={styles.chipRemove}
          onClick={onRemove}
          type="button"
        >
          <XIcon />
        </button>
      )}
    </span>
  )
}

/**
 * An array of one-line text rows — the chú thích of a hình — as a cloud of chips instead of a
 * stack of collapsible rows. Typing in the trailing box and pressing Enter adds one; each chip
 * is editable in place and drops out on × or on Backspace when it's already empty.
 *
 * Works for any array whose rows are a single `text` field; the wording comes from the field's
 * own singular label.
 */
export const TextCloud: ArrayFieldClientComponent = ({
  field,
  path: pathFromProps,
  readOnly,
  schemaPath: schemaPathFromProps,
}) => {
  const { name, label, labels } = field
  const schemaPath = schemaPathFromProps ?? name

  const { i18n } = useTranslation()
  const { addFieldRow, removeFieldRow } = useForm()
  const { disabled, path, rows = [] } = useField({
    hasRows: true,
    potentiallyStalePath: pathFromProps,
  })

  const [draft, setDraft] = useState('')
  const isReadOnly = readOnly || disabled
  // "Chú thích" here, "Câu" somewhere else — the chips borrow the array's own singular label
  // rather than hard-coding what they hold.
  const rowLabel = getTranslation(labels?.singular ?? '', i18n) || 'mục'

  // `subFieldState` lets the row arrive with its text already set, so a câu is one Enter away
  // rather than "add an empty row, then find it and type into it".
  const commitDraft = useCallback(() => {
    const text = draft.trim()
    if (!text) return

    addFieldRow({
      path,
      rowIndex: rows.length,
      schemaPath,
      subFieldState: { text: { initialValue: text, valid: true, value: text } },
    })
    setDraft('')
  }, [addFieldRow, draft, path, rows.length, schemaPath])

  return (
    <div className="field-type">
      <FieldLabel label={label} path={path} />

      <div className={styles.cloud}>
        {rows.map((row, index) => (
          <TextChip
            key={row.id}
            label={rowLabel}
            onRemove={() => removeFieldRow({ path, rowIndex: index })}
            readOnly={isReadOnly}
            rowPath={`${path}.${index}`}
          />
        ))}

        {!isReadOnly && (
          <input
            className={styles.draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                commitDraft()
              }
            }}
            // Clicking away shouldn't silently discard what was typed.
            onBlur={commitDraft}
            placeholder={`Thêm ${rowLabel.toLowerCase()}…`}
            value={draft}
          />
        )}
      </div>
    </div>
  )
}
