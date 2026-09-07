'use client'

import { useBlockComponentContext } from '@payloadcms/richtext-lexical/client'
import { useField, useForm, useFormFields } from '@payloadcms/ui'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { TEXT_COLORS } from '@/features/text-color/palette'

import styles from './SyllableBlendBlock.module.css'

const INK = '#1c293f'
const PARTS_PATH = 'parts'
/** Mirrors `minRows` in SyllableBlend.ts — below two parts there is nothing to blend. */
const MIN_PARTS = 2
const MAX_PARTS = 6

type Part = { color: string; text: string }

/** The syllable the parts spell out, and the default contents of the wide box below them. */
const derive = (parts: Part[]): string =>
  parts
    .map((part) => part.text.trim())
    .filter(Boolean)
    .join(' ')

const Swatches: React.FC<{ onPick: (value: string) => void; value: string }> = ({
  onPick,
  value,
}) => (
  <div className={styles.swatches}>
    {TEXT_COLORS.map((swatch) => (
      <button
        aria-label={swatch.label}
        aria-pressed={value === swatch.value}
        className={styles.swatch}
        key={swatch.value}
        onClick={() => onPick(swatch.value)}
        style={{ background: swatch.value }}
        title={swatch.label}
        type="button"
      />
    ))}
  </div>
)

/**
 * One box in the top row: the text itself, plus a colour dot that opens the palette. The dot only
 * appears on hover or focus (CSS) — at rest the box should look like the diagram it will become,
 * not like a form control.
 */
const PartCell: React.FC<{ index: number; onRemove: null | (() => void) }> = ({
  index,
  onRemove,
}) => {
  const { setValue: setText, value: text } = useField<string>({ path: `${PARTS_PATH}.${index}.text` })
  const { setValue: setColor, value: color } = useField<string>({
    path: `${PARTS_PATH}.${index}.color`,
  })
  const [pickerOpen, setPickerOpen] = useState(false)
  const cellRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!pickerOpen) return
    const onPointerDown = (event: MouseEvent) => {
      if (!cellRef.current?.contains(event.target as Node)) setPickerOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    return () => document.removeEventListener('mousedown', onPointerDown)
  }, [pickerOpen])

  return (
    <div className={styles.part} ref={cellRef}>
      <input
        className={styles.partInput}
        onChange={(event) => setText(event.target.value)}
        placeholder="…"
        style={{ color: color || INK }}
        value={text ?? ''}
      />
      <div className={styles.partActions}>
        <button
          aria-label="Màu chữ"
          className={styles.colorDot}
          onClick={() => setPickerOpen((open) => !open)}
          style={{ background: color || INK }}
          type="button"
        />
        {onRemove ? (
          <button aria-label="Xoá phần này" className={styles.remove} onClick={onRemove} type="button">
            ×
          </button>
        ) : null}
      </div>
      {pickerOpen ? (
        <div className={styles.picker}>
          <Swatches
            onPick={(value) => {
              setColor(value)
              setPickerOpen(false)
            }}
            value={color || INK}
          />
        </div>
      ) : null}
    </div>
  )
}

/**
 * The wide box underneath. It shows the parts in their own colours while it still says what they
 * spell — that is what makes the diagram read as one thing — and swaps to a plain input on click,
 * because a single `<input>` cannot paint half its text red. Once an editor types something the
 * parts don't spell (đ + a → "đá"), the override is theirs and the colouring drops to plain ink.
 */
const ResultCell: React.FC<{ derived: string; parts: Part[] }> = ({ derived, parts }) => {
  const { setValue, value } = useField<string>({ path: 'result' })
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // The last value the parts spelled, so a later edit to the parts can tell "the editor never
  // touched this box" from "the editor wrote something of their own here".
  const derivedRef = useRef<null | string>(null)

  useEffect(() => {
    const previous = derivedRef.current
    // Re-runs on every keystroke in this box too; only a change to what the parts spell is
    // allowed to write here, and this is what stops the write below from feeding itself.
    if (previous === derived) return
    derivedRef.current = derived
    // First run adopts whatever was saved without touching it; nothing to follow yet.
    if (previous === null) return
    if (!value || value === previous) setValue(derived)
  }, [derived, setValue, value])

  useEffect(() => {
    if (editing) inputRef.current?.select()
  }, [editing])

  if (editing) {
    return (
      <input
        className={`${styles.result} ${styles.resultInput}`}
        onBlur={() => setEditing(false)}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === 'Escape') setEditing(false)
        }}
        placeholder={derived}
        ref={inputRef}
        value={value ?? ''}
      />
    )
  }

  const matchesParts = Boolean(value) && value === derived

  return (
    <button className={styles.result} onClick={() => setEditing(true)} type="button">
      {value ? (
        matchesParts ? (
          parts
            .filter((part) => part.text.trim())
            .map((part, index) => (
              <span key={index} style={{ color: part.color || INK }}>
                {part.text.trim()}
              </span>
            ))
        ) : (
          <span style={{ color: INK }}>{value}</span>
        )
      ) : (
        <span className={styles.resultPlaceholder}>Tiếng</span>
      )}
    </button>
  )
}

/**
 * Admin-editor rendering for the SyllableBlend block (see SyllableBlend.ts) — the diagram itself
 * rather than Payload's stacked field list: the parts across the top, the syllable they spell in
 * the wide box below.
 *
 * The fields are read and written through `useField` on explicit paths instead of `RenderFields`,
 * which is what the neighbouring blocks do. Those blocks style Payload's own inputs down into
 * something diagram-shaped; here the boxes *are* the diagram — coloured text, a swatch popover, a
 * row that grows and shrinks — and there is no Payload control underneath any of them to reuse.
 */
export const SyllableBlendBlock: React.FC = () => {
  const { RemoveButton } = useBlockComponentContext()
  const { addFieldRow, removeFieldRow } = useForm()
  const { rows } = useField({ hasRows: true, path: PARTS_PATH })
  const count = rows?.length ?? 0

  const parts = useFormFields(([fields]) =>
    Array.from({ length: count }, (_, index) => ({
      color: (fields[`${PARTS_PATH}.${index}.color`]?.value as string) || INK,
      text: (fields[`${PARTS_PATH}.${index}.text`]?.value as string) || '',
    })),
  )

  const derived = useMemo(() => derive(parts), [parts])

  const addPart = useCallback(() => {
    addFieldRow({
      path: PARTS_PATH,
      rowIndex: count,
      // Paths inside a lexical block's form are relative to the block, so the array's schema path
      // is its own name — the same '' parent the neighbouring blocks pass to `RenderFields`.
      schemaPath: PARTS_PATH,
      // Seeded rather than left blank: `addFieldRow` only asks the server for the real row state
      // on the next debounced form-state round trip, and until it lands an unseeded row has no
      // colour to draw the box with.
      subFieldState: {
        color: { initialValue: INK, valid: true, value: INK },
        text: { initialValue: '', valid: true, value: '' },
      },
    })
  }, [addFieldRow, count])

  return (
    <div className={styles.card}>
      <div className={styles.blockRemove}>
        <RemoveButton />
      </div>
      <div className={styles.diagram}>
        <div className={styles.parts}>
          {Array.from({ length: count }, (_, index) => (
            <PartCell
              index={index}
              key={index}
              onRemove={
                count > MIN_PARTS
                  ? () => removeFieldRow({ path: PARTS_PATH, rowIndex: index })
                  : null
              }
            />
          ))}
          {count < MAX_PARTS ? (
            <button
              aria-label="Thêm một phần"
              className={styles.add}
              onClick={addPart}
              title="Thêm một phần"
              type="button"
            >
              +
            </button>
          ) : null}
        </div>
        <ResultCell derived={derived} parts={parts} />
      </div>
    </div>
  )
}
