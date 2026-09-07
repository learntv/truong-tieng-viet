'use client'

import { $getSelection, $isRangeSelection } from '@payloadcms/richtext-lexical/lexical'
import {
  $getSelectionStyleValueForProperty,
  $patchStyleText,
} from '@payloadcms/richtext-lexical/lexical/selection'
import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext'
import React, { useCallback, useEffect, useRef, useState } from 'react'

import type { Swatch } from '../palette'

/**
 * A toolbar button that opens a grid of swatches and writes the chosen one onto the selected text
 * as an inline `style`, via Lexical's own `$patchStyleText`.
 *
 * Inline style on the text node — not a format bit, not a custom node. Colour is the one attribute
 * that has to be able to overlap arbitrarily with every other one (half a bolded word, a coloured
 * run crossing a link boundary), and `$patchStyleText` already splits and merges text nodes to
 * make that work. A dedicated node would have to reimplement that splitting, and would fight every
 * other feature for the same text.
 */
export const ColorPicker: React.FC<{
  /** CSS property to patch — `color` or `background-color`. */
  property: 'background-color' | 'color'
  /** Label for the button itself, e.g. "Màu chữ". */
  title: string
  swatches: Swatch[]
  /** The button's glyph, drawn above the bar that shows the current colour. */
  Icon: React.FC
  /** Label of the button that strips the property, e.g. "Không tô". */
  clearLabel: string
}> = ({ clearLabel, Icon, property, swatches, title }) => {
  const [editor] = useLexicalComposerContext()
  const [open, setOpen] = useState(false)
  const [current, setCurrent] = useState<string>('')
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const read = () => {
      editor.getEditorState().read(() => {
        const selection = $getSelection()
        const value = $isRangeSelection(selection)
          ? $getSelectionStyleValueForProperty(selection, property, '')
          : ''
        setCurrent(value.toLowerCase())
      })
    }
    read()
    return editor.registerUpdateListener(read)
  }, [editor, property])

  // While the popover is open the caret is still in the editor and unfocused, so nothing else
  // would close it: a click anywhere outside, or Escape, has to do it explicitly.
  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const apply = useCallback(
    (value: null | string) => {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, { [property]: value })
        }
      })
      setOpen(false)
    },
    [editor, property],
  )

  return (
    // `mousedown` is swallowed throughout: the editor would otherwise blur and drop the selection
    // these buttons are about to recolour.
    <div
      className="kmd-color-picker"
      onMouseDown={(event) => event.preventDefault()}
      ref={containerRef}
    >
      <button
        aria-expanded={open}
        aria-haspopup="true"
        className={`toolbar-popup__button kmd-color-picker__trigger${open ? ' active' : ''}`}
        onClick={() => setOpen((value) => !value)}
        title={title}
        type="button"
      >
        <Icon />
        <span
          className="kmd-color-picker__bar"
          style={current ? { background: current } : undefined}
        />
      </button>

      {open ? (
        <div className="kmd-color-picker__popup">
          <div className="kmd-color-picker__swatches">
            {swatches.map((swatch) => (
              <button
                aria-label={swatch.label}
                aria-pressed={current === swatch.value}
                className="kmd-color-picker__swatch"
                key={swatch.value}
                onClick={() => apply(swatch.value)}
                style={{ background: swatch.value }}
                title={swatch.label}
                type="button"
              />
            ))}
          </div>
          <button className="kmd-color-picker__clear" onClick={() => apply(null)} type="button">
            {clearLabel}
          </button>
        </div>
      ) : null}
    </div>
  )
}
