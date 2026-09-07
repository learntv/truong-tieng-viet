'use client'

import type { ClientBlock } from 'payload'
import type { BlocksFieldClientComponent } from 'payload'

import { getTranslation } from '@payloadcms/translations'
import {
  FieldDescription,
  FieldLabel,
  Pill,
  Popup,
  PopupList,
  RenderFields,
  useConfig,
  useDocumentInfo,
  useField,
  useForm,
  useTranslation,
} from '@payloadcms/ui'
import React, { useCallback, useMemo, useState } from 'react'

import styles from './KmdBlocksField.module.css'

// A literal placeholder, not a rendering of the section's real content — the rail's job is to
// let an editor jump between sections, not to reproduce what `RenderFields` already shows for
// the selected one on the right.
const RailThumbPlaceholder: React.FC = () => (
  <svg aria-hidden="true" className={styles.railThumbIcon} viewBox="0 0 24 24">
    <rect fill="none" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" width="20" x="2" y="4" />
    <circle cx="8" cy="9.5" fill="currentColor" r="1.5" />
    <path d="M3 16l5-4 4 3 3-2.5 6 4.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
)

/**
 * Opens the lesson as a reader sees it (see app/(preview)/xem-truoc/bai-kmd/[id]), scrolled to the
 * section being edited — the ids on the preview's cards are the same "Mục n" numbering as the rail.
 *
 * It links to the *saved* lesson, which is why an unsaved one gets a disabled control saying so
 * rather than a link to a document id that does not exist yet. Payload also puts its own preview
 * button in the save bar (`admin.preview` in collections/BaiKMD.ts); this one is here because it
 * is where the sections are edited, and because it can point at the section in hand.
 */
const PreviewLink: React.FC<{ sectionNumber: number }> = ({ sectionNumber }) => {
  const { id } = useDocumentInfo()

  if (!id) {
    return (
      <span className={styles.previewLink} data-disabled title="Lưu bài học trước khi xem trước.">
        Xem trước
      </span>
    )
  }

  return (
    <a
      className={styles.previewLink}
      href={`/xem-truoc/bai-kmd/${id}#muc-${sectionNumber}`}
      rel="noreferrer"
      target="_blank"
      title="Mở bản xem trước của bài học (nội dung đã lưu) trong tab mới."
    >
      Xem trước
    </a>
  )
}

const getBlockPermissions = (permissions: unknown, blockType: string): unknown => {
  if (permissions === true || permissions == null) return true
  const perBlock = (permissions as { blocks?: Record<string, unknown> }).blocks
  return perBlock?.[blockType] ?? perBlock ?? true
}

/**
 * A "slide editor" for the lesson's `blocks` field: a left rail listing every section by type
 * and position (a placeholder thumbnail, not its real content), and a right pane editing
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

  const moveBlock = useCallback(
    (rowIndex: number, direction: -1 | 1) => {
      const moveToIndex = rowIndex + direction
      if (moveToIndex < 0 || moveToIndex > rows.length - 1) return
      moveFieldRow({ moveFromIndex: rowIndex, moveToIndex, path })
      setActiveIndex((current) => {
        if (current === rowIndex) return moveToIndex
        if (current === moveToIndex) return rowIndex
        return current
      })
    },
    [moveFieldRow, path, rows.length],
  )

  const activeRow = rows[activeIndex]
  const activeBlock = activeRow?.blockType ? blockBySlug(activeRow.blockType) : undefined

  return (
    <div className="field-type" id={`field-${path?.replace(/\./g, '__')}`}>
      <FieldLabel label={label} localized={localized} path={path} required={required} />
      <FieldDescription description={fieldAdmin?.description} path={path} />
      <div className={styles.layout}>
        <div className={styles.rail}>
          {rows.map((row, index) => {
            const block = row.blockType ? blockBySlug(row.blockType) : undefined
            return (
              <div className={styles.railItem} data-active={index === activeIndex} key={row.id}>
                <button
                  className={styles.railItemButton}
                  onClick={() => setActiveIndex(index)}
                  type="button"
                >
                  <div className={styles.railThumb}>
                    <RailThumbPlaceholder />
                  </div>
                  <div className={styles.railMeta}>
                    <span className={styles.railIndex}>{String(index + 1).padStart(2, '0')}</span>
                    <span className={styles.railLabel}>
                      {block ? getTranslation(block.labels?.singular ?? block.slug, i18n) : row.blockType}
                    </span>
                  </div>
                </button>
                {!readOnly && (
                  <div className={styles.railControls}>
                    <button
                      disabled={index === 0}
                      onClick={() => moveBlock(index, -1)}
                      title="Di chuyển lên"
                      type="button"
                    >
                      ↑
                    </button>
                    <button
                      disabled={index === rows.length - 1}
                      onClick={() => moveBlock(index, 1)}
                      title="Di chuyển xuống"
                      type="button"
                    >
                      ↓
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm('Xoá mục này khỏi bài học?')) removeBlock(index)
                      }}
                      title="Xoá"
                      type="button"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            )
          })}

          {!readOnly && (
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
                <Pill pillStyle="white" size="small">
                  {getTranslation(activeBlock.labels?.singular ?? activeBlock.slug, i18n)}
                </Pill>
                <span className={styles.editorHeaderIndex}>
                  Mục {activeIndex + 1} / {rows.length}
                </span>
                <PreviewLink sectionNumber={activeIndex + 1} />
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
