'use client'

import { useLexicalComposerContext } from '@payloadcms/richtext-lexical/lexical/react/LexicalComposerContext'
import React, { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * Toolbar button that dumps the editor's serialized state — the exact shape stored in the
 * section's `jsonb` column — into a panel you can read and copy.
 *
 * Taken from the live editor state rather than from the saved document, so it shows what the
 * editor holds right now, including edits not yet saved. That is the point: it is a debugging
 * window onto what a block or a colour actually serializes to, not a view of the database row.
 */
export const JsonViewButton: React.FC = () => {
  const [editor] = useLexicalComposerContext()
  const [json, setJson] = useState<null | string>(null)
  const [copied, setCopied] = useState(false)

  const open = useCallback(() => {
    setCopied(false)
    setJson(JSON.stringify(editor.getEditorState().toJSON(), null, 2))
  }, [editor])

  const close = useCallback(() => setJson(null), [])

  useEffect(() => {
    if (json === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [close, json])

  const copy = useCallback(() => {
    if (json === null) return
    void navigator.clipboard.writeText(json).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [json])

  return (
    <>
      <button
        className="toolbar-popup__button kmd-json-view__trigger"
        // The editor keeps its selection: nothing here edits the document, and losing the caret
        // to a debugging button would be its own small bug.
        onMouseDown={(event) => event.preventDefault()}
        onClick={open}
        title="Xem JSON"
        type="button"
      >
        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
          <path
            d="M6.2 1.6c-1.5 0-2.2.7-2.2 2v2c0 .9-.4 1.4-1.4 1.4v2c1 0 1.4.5 1.4 1.4v2c0 1.3.7 2 2.2 2v-1.6c-.6 0-.8-.2-.8-.8v-1.9c0-.9-.3-1.5-1-1.9.7-.4 1-1 1-1.9V4.4c0-.6.2-.8.8-.8V1.6Zm3.6 0v1.6c.6 0 .8.2.8.8v1.9c0 .9.3 1.5 1 1.9-.7.4-1 1-1 1.9v1.9c0 .6-.2.8-.8.8v1.6c1.5 0 2.2-.7 2.2-2v-2c0-.9.4-1.4 1.4-1.4V7c-1 0-1.4-.5-1.4-1.4v-2c0-1.3-.7-2-2.2-2Z"
            fill="currentColor"
          />
        </svg>
      </button>

      {json !== null
        ? createPortal(
            <div className="kmd-json-view__backdrop" onMouseDown={close} role="presentation">
              <div
                className="kmd-json-view__panel"
                onMouseDown={(event) => event.stopPropagation()}
                role="dialog"
              >
                <div className="kmd-json-view__header">
                  <strong>JSON của nội dung</strong>
                  <div className="kmd-json-view__actions">
                    <button className="kmd-json-view__action" onClick={copy} type="button">
                      {copied ? 'Đã sao chép' : 'Sao chép'}
                    </button>
                    <button className="kmd-json-view__action" onClick={close} type="button">
                      Đóng
                    </button>
                  </div>
                </div>
                <pre className="kmd-json-view__code">{json}</pre>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  )
}
