'use client'

import type { ClientBlock } from 'payload'
import type { BlocksFieldClientComponent } from 'payload'

import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { getTranslation } from '@payloadcms/translations'
import { RichText } from '@payloadcms/richtext-lexical/react'
import {
  DraggableSortable,
  DraggableSortableItem,
  FieldDescription,
  FieldLabel,
  Popup,
  PopupList,
  RenderFields,
  useConfig,
  useField,
  useForm,
  useFormFields,
  useTranslation,
} from '@payloadcms/ui'
import { lessonConverters } from '@ttv/lesson-render'
import contentStyles from '@ttv/lesson-render/lessonContent.module.css'
import '@ttv/lesson-render/tokens.css'
import React, { useCallback, useMemo, useState } from 'react'

import styles from './KmdBlocksField.module.css'
import { useMediaPopulated } from './useMediaPopulated'

const isEditorState = (value: unknown): value is SerializedEditorState =>
  Boolean(value && typeof value === 'object' && 'root' in value)

/**
 * A miniature of the section, read live from the form rather than from the saved document, so it
 * follows the editor as they type. Same `RichText`/`lessonConverters` the site's own rail uses,
 * shrunk with a CSS transform (see the public `Lesson` in packages/lesson-render). `inert` keeps
 * its links and checkboxes out of the tab order: it is a picture of the section, not a copy of it.
 */
const RailThumb: React.FC<{ contentPath: string }> = ({ contentPath }) => {
  const value = useFormFields(([fields]) => fields[contentPath]?.value)
  const content = useMediaPopulated(isEditorState(value) ? value : undefined)

  return (
    <div className={styles.railThumb}>
      {content && (
        <div className={styles.railThumbScale} inert>
          <RichText className={contentStyles.content} converters={lessonConverters} data={content} />
        </div>
      )}
    </div>
  )
}

const getBlockPermissions = (permissions: unknown, blockType: string): unknown => {
  if (permissions === true || permissions == null) return true
  const perBlock = (permissions as { blocks?: Record<string, unknown> }).blocks
  return perBlock?.[blockType] ?? perBlock ?? true
}

/**
 * A "slide editor" for the lesson's `blocks` field: a left rail of live miniatures of every
 * section, reordered by dragging them, and a right pane editing
 * whichever section is selected — the powerpoint-style layout requested in place of Payload's
 * default stacked-accordion blocks UI. Built directly on `useField`/`useForm`/`RenderFields`,
 * the same public hooks the default `BlocksField` uses, so row storage, validation and the
 * per-block `preview` ui fields (see design.md) are unchanged — only how rows are browsed and
 * edited is different.
 */
export const KmdBlocksField: BlocksFieldClientComponent = (props) => {
  const {
    field: { admin: fieldAdmin, blockReferences, blocks, label, localized, required },
    path: pathFromProps,
    permissions,
    readOnly,
    schemaPath: schemaPathFromProps,
    validate,
  } = props

  const { i18n } = useTranslation()
  const { config } = useConfig()
  const { addFieldRow, moveFieldRow, removeFieldRow } = useForm()

  const memoizedValidate = useCallback(
    (value: unknown, options: Record<string, unknown>) => {
      if (typeof validate === 'function') return validate(value as never, options as never)
      return true
    },
    [validate],
  )

  const { path, rows = [] } = useField<unknown>({
    hasRows: true,
    potentiallyStalePath: pathFromProps,
    validate: memoizedValidate,
  }) as { path: string; rows: { blockType?: string; id: string }[] }

  const resolvedSchemaPath = schemaPathFromProps ?? props.field.name

  const blocksMap = config.blocksMap as Record<string, ClientBlock> | undefined

  const clientBlocks: ClientBlock[] = useMemo(() => {
    if (blockReferences) {
      return blockReferences
        .map((ref) => (typeof ref === 'string' ? blocksMap?.[ref] : ref))
        .filter((block): block is ClientBlock => Boolean(block))
    }
    return blocks ?? []
  }, [blockReferences, blocks, blocksMap])

  const blockBySlug = useCallback(
    (slug: string): ClientBlock | undefined =>
      blocksMap?.[slug] ?? clientBlocks.find((block) => block.slug === slug),
    [clientBlocks, blocksMap],
  )

  const [rawActiveIndex, setActiveIndex] = useState(0)

  // Clamped at read time, not via an effect: a row removal or reorder can leave the previously
  // selected index out of bounds for one render, and this way that render is already correct.
  const activeIndex = rows.length === 0 ? 0 : Math.min(rawActiveIndex, rows.length - 1)

  const addBlock = useCallback(
    (blockType: string) => {
      const rowIndex = rows.length
      addFieldRow({ blockType, path, rowIndex, schemaPath: resolvedSchemaPath })
      setActiveIndex(rowIndex)
    },
    [addFieldRow, path, resolvedSchemaPath, rows.length],
  )

  const removeBlock = useCallback(
    (rowIndex: number) => {
      removeFieldRow({ path, rowIndex })
      setActiveIndex((current) => {
        if (rowIndex < current) return current - 1
        if (rowIndex === current) return Math.max(0, current - 1)
        return current
      })
    },
    [path, removeFieldRow],
  )

  // The selection follows the section it was on, wherever the drag put it — and slides along one
  // place when a section is dragged across it.
  const moveBlock = useCallback(
    (moveFromIndex: number, moveToIndex: number) => {
      if (moveFromIndex < 0 || moveToIndex < 0 || moveFromIndex === moveToIndex) return
      moveFieldRow({ moveFromIndex, moveToIndex, path })
      setActiveIndex((current) => {
        if (current === moveFromIndex) return moveToIndex
        if (moveFromIndex < current && current <= moveToIndex) return current - 1
        if (moveToIndex <= current && current < moveFromIndex) return current + 1
        return current
      })
    },
    [moveFieldRow, path],
  )

  const rowIds = useMemo(() => rows.map((row) => row.id), [rows])

  const activeRow = rows[activeIndex]
  const activeBlock = activeRow?.blockType ? blockBySlug(activeRow.blockType) : undefined

  return (
    <div className="field-type" id={`field-${path?.replace(/\./g, '__')}`}>
      <FieldLabel label={label} localized={localized} path={path} required={required} />
      <FieldDescription description={fieldAdmin?.description} path={path} />
      <div className={styles.layout}>
        <div className={styles.rail}>
          <DraggableSortable
            className={styles.railList}
            ids={rowIds}
            onDragEnd={({ moveFromIndex, moveToIndex }) => moveBlock(moveFromIndex, moveToIndex)}
          >
            {rows.map((row, index) => (
              <DraggableSortableItem disabled={readOnly} id={row.id} key={row.id}>
                {({ attributes, isDragging, listeners, setNodeRef, transform, transition }) => (
                  // The whole thumbnail is the drag handle: a press that moves under 5px is still a
                  // click (Payload's sensor threshold), so picking a section and dragging it are
                  // the same gesture, the way a slide sorter works.
                  <div
                    {...attributes}
                    {...listeners}
                    aria-label={`Mục ${index + 1}`}
                    className={styles.railItem}
                    data-active={index === activeIndex}
                    data-dragging={isDragging || undefined}
                    onClick={() => setActiveIndex(index)}
                    // Enter selects; Space picks the section up for a keyboard drag.
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') setActiveIndex(index)
                      else listeners?.onKeyDown?.(event)
                    }}
                    ref={setNodeRef}
                    style={{ ...attributes.style, transform, transition }}
                  >
                    <RailThumb contentPath={`${path}.${index}.content`} />
                    <span className={styles.railIndex}>{index + 1}</span>
                    {!readOnly && (
                      <button
                        className={styles.railRemove}
                        onClick={(event) => {
                          event.stopPropagation()
                          if (window.confirm('Xoá mục này khỏi bài học?')) removeBlock(index)
                        }}
                        // Keeps Enter/Space on this button from reaching the item's keyboard drag.
                        onKeyDown={(event) => event.stopPropagation()}
                        title="Xoá"
                        type="button"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                )}
              </DraggableSortableItem>
            ))}
          </DraggableSortable>

          {!readOnly && clientBlocks.length === 1 && (
            <div className={styles.addWrap}>
              <button
                className={styles.addButton}
                onClick={() => addBlock(clientBlocks[0].slug)}
                type="button"
              >
                + Thêm mục
              </button>
            </div>
          )}

          {!readOnly && clientBlocks.length > 1 && (
            <div className={styles.addWrap}>
              <Popup
                button={<span className={styles.addButton}>+ Thêm mục</span>}
                buttonType="custom"
                horizontalAlign="left"
                render={({ close }) => (
                  <PopupList.ButtonGroup>
                    {clientBlocks.map((block) => (
                      <PopupList.Button
                        key={block.slug}
                        onClick={() => {
                          addBlock(block.slug)
                          close()
                        }}
                      >
                        {getTranslation(block.labels?.singular ?? block.slug, i18n)}
                      </PopupList.Button>
                    ))}
                  </PopupList.ButtonGroup>
                )}
                size="small"
              />
            </div>
          )}
        </div>

        <div className={styles.editor}>
          {activeRow && activeBlock ? (
            <>
              <div className={styles.editorHeader}>
                <span className={styles.editorHeaderIndex}>
                  Mục {activeIndex + 1} / {rows.length}
                </span>
              </div>
              <RenderFields
                fields={activeBlock.fields}
                parentIndexPath=""
                parentPath={`${path}.${activeIndex}`}
                parentSchemaPath={`${resolvedSchemaPath}.${activeBlock.slug}`}
                permissions={getBlockPermissions(permissions, activeBlock.slug) as never}
                readOnly={readOnly}
              />
            </>
          ) : (
            <p className={styles.empty}>
              Chưa có mục nào. Bấm &quot;+ Thêm mục&quot; để bắt đầu bài học.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
