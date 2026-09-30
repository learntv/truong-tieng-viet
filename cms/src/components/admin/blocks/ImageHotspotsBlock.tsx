'use client'

import { useBlockComponentContext } from '@payloadcms/richtext-lexical/client'
import { RenderFields, useConfig, useField } from '@payloadcms/ui'
import type { ClientField } from 'payload'
import React, { useEffect, useMemo, useRef, useState } from 'react'

import type { Hotspot } from '@/blocks/ImageHotspots'

import styles from './ImageHotspotsBlock.module.css'

const renderFieldsProps = {
  forceRender: true,
  parentIndexPath: '',
  parentPath: '',
  parentSchemaPath: '',
  permissions: true,
} as const

// Anything smaller than this (in % of the image) on release was a click, not a drawn box.
const MIN_SIZE = 2

type Point = { x: number; y: number }

type Drag =
  | { kind: 'draw'; origin: Point }
  | { kind: 'move'; grab: Point; id: string; start: Hotspot }
  | { kind: 'resize'; id: string; start: Hotspot }

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
const round = (n: number) => Math.round(n * 100) / 100

const boxFrom = (a: Point, b: Point) => ({
  h: Math.abs(b.y - a.y),
  w: Math.abs(b.x - a.x),
  x: Math.min(a.x, b.x),
  y: Math.min(a.y, b.y),
})

const newId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

// Relative, so it goes through the CMS's own /api/tts, which forwards to the site's
// (app/(payload)/api/tts/route.ts). The same URL the lesson renderer plays.
const play = (text: string) => {
  if (text.trim()) void new Audio(`/api/tts?text=${encodeURIComponent(text.trim())}`).play()
}

/** The picked media document's URL. The form holds a bare id; the upload field fetches its own
 * copy for its thumbnail but doesn't share it, so this asks for the one field it needs. */
const useImageUrl = (value: unknown): null | string => {
  const {
    config: {
      routes: { api },
      serverURL,
    },
  } = useConfig()
  const inline =
    value && typeof value === 'object' && 'url' in value ? (value as { url?: string }).url : null
  const id =
    typeof value === 'number' || typeof value === 'string'
      ? String(value)
      : value && typeof value === 'object' && 'id' in value
        ? String((value as { id: unknown }).id)
        : null
  const [fetched, setFetched] = useState<{ id: string; url: null | string } | null>(null)

  useEffect(() => {
    if (inline || !id) return
    let cancelled = false
    fetch(`${serverURL ?? ''}${api}/media/${id}?depth=0`, { credentials: 'include' })
      .then((res) => (res.ok ? res.json() : null))
      .then((doc: { url?: string } | null) => {
        if (!cancelled) setFetched({ id, url: doc?.url ?? null })
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [api, id, inline, serverURL])

  if (inline) return inline
  return fetched && fetched.id === id ? fetched.url : null
}

/**
 * Admin-editor rendering for the ImageHotspots block (see ImageHotspots.ts): the picture itself
 * as a drawing surface. Drag on the picture to draw a box, drag a box to move it, drag its corner
 * to resize it; the selected box's text is edited in the bar under the picture.
 *
 * While a drag is in progress the boxes live in local state and are written to the form once, on
 * release, so a drag is one change to the lesson rather than one per pointer event.
 */
export const ImageHotspotsBlock: React.FC = () => {
  const { formSchema, RemoveButton } = useBlockComponentContext()
  const { value: image } = useField<unknown>({ path: 'image' })
  const {
    errorMessage,
    setValue: setHotspots,
    showError,
    value: storedHotspots,
  } = useField<Hotspot[]>({ path: 'hotspots' })

  const imageUrl = useImageUrl(image)
  const imageField = useMemo(
    () => formSchema.find((field: ClientField) => 'name' in field && field.name === 'image'),
    [formSchema],
  )

  const saved = useMemo(
    () => (Array.isArray(storedHotspots) ? storedHotspots : []),
    [storedHotspots],
  )
  const [draft, setDraft] = useState<Hotspot[] | null>(null)
  const [drawing, setDrawing] = useState<null | ReturnType<typeof boxFrom>>(null)
  const [selectedId, setSelectedId] = useState<null | string>(null)
  const drag = useRef<Drag | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)
  const textRef = useRef<HTMLInputElement | null>(null)
  const focusTextOnSelect = useRef(false)

  const spots = draft ?? saved
  const selected = spots.find((spot) => spot.id === selectedId) ?? null

  useEffect(() => {
    if (selected && focusTextOnSelect.current) {
      focusTextOnSelect.current = false
      textRef.current?.focus()
    }
  }, [selected])

  const pointAt = (event: React.PointerEvent): Point => {
    const rect = stageRef.current!.getBoundingClientRect()
    return {
      x: clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100),
      y: clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100),
    }
  }

  const update = (id: string, patch: Partial<Hotspot>) =>
    setHotspots(saved.map((spot) => (spot.id === id ? { ...spot, ...patch } : spot)))

  const remove = (id: string) => {
    setHotspots(saved.filter((spot) => spot.id !== id))
    setSelectedId(null)
  }

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.button !== 0) return
    const target = event.target as HTMLElement
    const spotId = target.closest<HTMLElement>('[data-spot]')?.dataset.spot
    const start = spotId ? saved.find((spot) => spot.id === spotId) : undefined
    const point = pointAt(event)

    if (start && target.closest('[data-handle]')) {
      drag.current = { id: start.id, kind: 'resize', start }
    } else if (start) {
      drag.current = { grab: point, id: start.id, kind: 'move', start }
    } else {
      drag.current = { kind: 'draw', origin: point }
    }

    setSelectedId(start?.id ?? null)
    stageRef.current!.setPointerCapture(event.pointerId)
    stageRef.current!.focus({ preventScroll: true })
    event.preventDefault()
  }

  const onPointerMove = (event: React.PointerEvent) => {
    const current = drag.current
    if (!current) return
    const point = pointAt(event)

    if (current.kind === 'draw') {
      setDrawing(boxFrom(current.origin, point))
      return
    }

    const { start } = current
    const moved =
      current.kind === 'move'
        ? {
            ...start,
            x: round(clamp(start.x + point.x - current.grab.x, 0, 100 - start.w)),
            y: round(clamp(start.y + point.y - current.grab.y, 0, 100 - start.h)),
          }
        : {
            ...start,
            h: round(clamp(point.y - start.y, MIN_SIZE, 100 - start.y)),
            w: round(clamp(point.x - start.x, MIN_SIZE, 100 - start.x)),
          }
    setDraft(saved.map((spot) => (spot.id === start.id ? moved : spot)))
  }

  const onPointerUp = (event: React.PointerEvent) => {
    const current = drag.current
    drag.current = null
    if (!current) return

    if (current.kind === 'draw') {
      setDrawing(null)
      const box = boxFrom(current.origin, pointAt(event))
      if (box.w < MIN_SIZE || box.h < MIN_SIZE) return
      const spot: Hotspot = {
        h: round(box.h),
        id: newId(),
        text: '',
        w: round(box.w),
        x: round(box.x),
        y: round(box.y),
      }
      setHotspots([...saved, spot])
      focusTextOnSelect.current = true
      setSelectedId(spot.id)
      return
    }

    if (draft) setHotspots(draft)
    setDraft(null)
  }

  // A native listener rather than React's onKeyDown: Lexical listens on its root element, which
  // the event reaches before it bubbles up to React's, and would read Backspace on the block as
  // "delete the whole block".
  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return
    const listener = (event: KeyboardEvent) => {
      if (event.target !== stage) return
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedId) {
        event.preventDefault()
        event.stopPropagation()
        setHotspots(saved.filter((spot) => spot.id !== selectedId))
        setSelectedId(null)
      } else if (event.key === 'Escape') {
        event.stopPropagation()
        setSelectedId(null)
      }
    }
    stage.addEventListener('keydown', listener)
    return () => stage.removeEventListener('keydown', listener)
  }, [imageUrl, saved, selectedId, setHotspots])

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {/* Only while nothing is picked: once there is a picture, the upload field's filename
            row is noise above the picture itself, and the block's remove button covers taking
            it out. */}
        {imageField && !image && (
          <div className={styles.imageField}>
            <RenderFields fields={[imageField]} {...renderFieldsProps} />
          </div>
        )}
        <RemoveButton />
      </div>

      {imageUrl && (
        <div
          className={styles.stage}
          onLostPointerCapture={() => {
            drag.current = null
            setDrawing(null)
            setDraft(null)
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          ref={stageRef}
          tabIndex={0}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- R2 media, see lessonConverters */}
          <img alt="" className={styles.image} draggable={false} src={imageUrl} />
          {spots.map((spot) => (
            <div
              className={styles.spot}
              data-selected={spot.id === selectedId}
              data-spot={spot.id}
              key={spot.id}
              style={{
                height: `${spot.h}%`,
                left: `${spot.x}%`,
                top: `${spot.y}%`,
                width: `${spot.w}%`,
              }}
            >
              {spot.text && <span className={styles.spotLabel}>{spot.text}</span>}
              <span className={styles.handle} data-handle />
            </div>
          ))}
          {drawing && (
            <div
              className={`${styles.spot} ${styles.drawing}`}
              style={{
                height: `${drawing.h}%`,
                left: `${drawing.x}%`,
                top: `${drawing.y}%`,
                width: `${drawing.w}%`,
              }}
            />
          )}
        </div>
      )}

      {selected && (
        <div className={styles.editor}>
          <input
            className={styles.text}
            onChange={(event) => update(selected.id, { text: event.target.value })}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                play(selected.text)
              }
            }}
            placeholder="Chữ để đọc"
            ref={textRef}
            value={selected.text}
          />
          <button
            className={styles.action}
            disabled={!selected.text.trim()}
            onClick={() => play(selected.text)}
            type="button"
          >
            Nghe
          </button>
          <button
            className={`${styles.action} ${styles.danger}`}
            onClick={() => remove(selected.id)}
            type="button"
          >
            Xóa
          </button>
        </div>
      )}

      {showError && errorMessage && <p className={styles.error}>{errorMessage}</p>}
    </div>
  )
}
