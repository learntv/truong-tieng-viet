'use client'

import type { ArrayFieldClientComponent } from 'payload'

import {
  Button,
  ErrorPill,
  RenderFields,
  useField,
  useForm,
  ShimmerEffect,
  useFormSubmitted,
  useTranslation,
  XIcon,
} from '@payloadcms/ui'
import React, { useCallback, useMemo, useState } from 'react'

import styles from './ChangTabs.module.css'

// Shown on a tab whose chặng hasn't been named yet. Deliberately not a number: nothing in this
// editor labels rows by position, so a name is the only thing that identifies one.
const UNTITLED = 'Chưa đặt tên'

// Keeps a freshly added tab from collapsing to nothing before it's typed into.
const MIN_INPUT_SIZE = 12

type TabProps = {
  readonly errorCount: number
  readonly isActive: boolean
  readonly onDelete: () => void
  readonly onSelect: () => void
  readonly readOnly?: boolean
  readonly rowPath: string
}

/**
 * One tab. The chặng is renamed here rather than in a field below: the active tab turns into an
 * input bound straight to that row's `title` in form state, so what you type is the tab's name.
 */
const ChangTab: React.FC<TabProps> = ({
  errorCount,
  isActive,
  onDelete,
  onSelect,
  readOnly,
  rowPath,
}) => {
  const { i18n } = useTranslation()
  const { setValue, value } = useField<string>({ path: `${rowPath}.title` })
  const title = value ?? ''

  const className = [styles.tab, isActive && styles.tabActive, errorCount > 0 && styles.tabError]
    .filter(Boolean)
    .join(' ')

  return (
    <div aria-selected={isActive} className={className} role="tab">
      {isActive ? (
        <input
          className={styles.tabInput}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Tên chặng"
          readOnly={readOnly}
          // The pill grows with the name instead of sitting at a fixed width.
          size={Math.max(title.length, MIN_INPUT_SIZE)}
          value={title}
        />
      ) : (
        <button className={styles.tabSelect} onClick={onSelect} type="button">
          {title || UNTITLED}
        </button>
      )}

      {errorCount > 0 && <ErrorPill count={errorCount} i18n={i18n} />}

      {!readOnly && (
        <button
          aria-label="Xoá chặng"
          className={styles.tabDelete}
          onClick={onDelete}
          title="Xoá chặng"
          type="button"
        >
          <XIcon />
        </button>
      )}
    </div>
  )
}

/**
 * The `changs` array on a chủ đề, rendered as tabs instead of stacked collapsibles: one tab per
 * chặng, "+" adds one, and the panel below holds that chặng's own fields — including the nội
 * dung → bài → hình arrays underneath it. The name is edited on the tab itself, so the title
 * field is left out of the panel.
 *
 * Only the active panel is mounted. That is safe because form state lives in the Form context
 * rather than in the field components, so an unmounted tab keeps its edits and still validates
 * on save — a tab whose fields have errors shows a count.
 */
export const ChangTabs: ArrayFieldClientComponent = ({
  field,
  path: pathFromProps,
  permissions,
  readOnly,
  schemaPath: schemaPathFromProps,
}) => {
  const { name, fields, maxRows } = field
  const schemaPath = schemaPathFromProps ?? name

  const { addFieldRow, removeFieldRow } = useForm()
  const submitted = useFormSubmitted()
  const { disabled, errorPaths, path, rows = [] } = useField({
    hasRows: true,
    potentiallyStalePath: pathFromProps,
  })

  const [selectedIndex, setActiveIndex] = useState(0)
  // Rows can shrink underneath the selection — a delete, or the document reloading with fewer
  // chặng than were there before — so the selection is clamped rather than trusted.
  const activeIndex = Math.min(selectedIndex, rows.length - 1)

  // The name is edited on the tab, so the panel renders everything except the title.
  const panelFields = useMemo(() => fields.filter((f) => !('name' in f && f.name === 'title')), [fields])

  const isReadOnly = readOnly || disabled
  const hasMaxRows = typeof maxRows === 'number' && rows.length >= maxRows
  const activeRow = rows[activeIndex]

  const addRow = useCallback(async () => {
    const rowIndex = rows.length
    await addFieldRow({ path, rowIndex, schemaPath })
    setActiveIndex(rowIndex)
  }, [addFieldRow, path, rows.length, schemaPath])

  // A chặng holds its whole nội dung → bài → hình subtree, so losing one to a stray click costs
  // a lot more than losing an ordinary array row.
  const removeRow = useCallback(
    (rowIndex: number) => {
      if (!window.confirm('Xoá chặng này và toàn bộ nội dung bên trong?')) return
      removeFieldRow({ path, rowIndex })
      setActiveIndex(Math.max(0, Math.min(rowIndex, rows.length - 2)))
    },
    [path, removeFieldRow, rows.length],
  )

  const errorCountFor = (rowIndex: number) =>
    submitted
      ? (errorPaths ?? []).filter((errorPath) => errorPath.startsWith(`${path}.${rowIndex}.`)).length
      : 0

  return (
    <div className="field-type">
      <div className={styles.tabBar} role="tablist">
        {rows.map((row, index) => (
          <ChangTab
            errorCount={errorCountFor(index)}
            isActive={index === activeIndex}
            key={row.id}
            onDelete={() => removeRow(index)}
            onSelect={() => setActiveIndex(index)}
            readOnly={isReadOnly}
            rowPath={`${path}.${index}`}
          />
        ))}

        {!hasMaxRows && !isReadOnly && (
          <Button
            buttonStyle="icon-label"
            className={styles.addTab}
            icon="plus"
            iconPosition="left"
            iconStyle="with-border"
            margin={false}
            onClick={() => void addRow()}
            size="small"
          >
            Thêm chặng
          </Button>
        )}
      </div>

      {rows.length === 0 && (
        <p className={styles.empty}>Chưa có chặng nào. Bấm “Thêm chặng” để tạo cái đầu tiên.</p>
      )}

      {activeRow && (
        <div className={styles.panel} key={activeRow.id} role="tabpanel">
          {/*
           * A row added a moment ago has no server-rendered field components yet, and without
           * this the panel would fall back to Payload's stock array UI for nội dung until they
           * arrive — the wrong editor, flashed for an instant.
           */}
          {activeRow.isLoading ? (
            <ShimmerEffect height="8rem" />
          ) : (
            <RenderFields
              fields={panelFields}
              forceRender
              margins="small"
              parentIndexPath=""
              parentPath={`${path}.${activeIndex}`}
              parentSchemaPath={schemaPath}
              permissions={permissions === true ? permissions : (permissions?.fields ?? {})}
              readOnly={isReadOnly}
            />
          )}
        </div>
      )}
    </div>
  )
}
