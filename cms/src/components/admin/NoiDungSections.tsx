'use client'

import type { ArrayFieldClientComponent } from 'payload'

import {
  Button,
  ErrorPill,
  RenderFields,
  useField,
  useForm,
  useFormSubmitted,
  useTranslation,
} from '@payloadcms/ui'
import React, { useCallback, useMemo } from 'react'

import styles from './NoiDungSections.module.css'

/**
 * The `noiDungs` array inside a chặng, rendered the way sections divide a slide deck: each nội
 * dung is a header with its bài listed directly underneath, rather than a collapsible box the
 * bài hide inside. Every section is open at once, so a chặng reads as one running list of bài
 * broken up by section headings.
 *
 * The stored shape is unchanged — bài still belong to a nội dung, mirroring public.noidung /
 * public.bai. Only the presentation is flattened.
 */
export const NoiDungSections: ArrayFieldClientComponent = ({
  field,
  path: pathFromProps,
  permissions,
  readOnly,
  schemaPath: schemaPathFromProps,
}) => {
  const { name, fields, maxRows } = field
  const schemaPath = schemaPathFromProps ?? name

  const { addFieldRow, moveFieldRow, removeFieldRow } = useForm()
  const submitted = useFormSubmitted()
  const { i18n, t } = useTranslation()
  const { disabled, errorPaths, path, rows = [] } = useField({
    hasRows: true,
    potentiallyStalePath: pathFromProps,
  })

  // The section's own fields are split across the header and the body: the title sits in the
  // heading bar, the bài list runs below it. Both halves render through RenderFields against
  // the same row path, so paths and validation are exactly what Payload would produce itself.
  const titleFields = useMemo(() => fields.filter((f) => 'name' in f && f.name === 'title'), [fields])
  const baiFields = useMemo(() => fields.filter((f) => 'name' in f && f.name === 'bais'), [fields])

  const isReadOnly = readOnly || disabled
  const hasMaxRows = typeof maxRows === 'number' && rows.length >= maxRows
  const fieldPermissions = permissions === true ? permissions : (permissions?.fields ?? {})

  const addRow = useCallback(() => {
    void addFieldRow({ path, rowIndex: rows.length, schemaPath })
  }, [addFieldRow, path, rows.length, schemaPath])

  const removeRow = useCallback(
    (rowIndex: number) => {
      if (!window.confirm('Xoá phần này và toàn bộ bài bên trong?')) return
      removeFieldRow({ path, rowIndex })
    },
    [path, removeFieldRow],
  )

  const moveRow = useCallback(
    (moveFromIndex: number, moveToIndex: number) => {
      if (moveToIndex < 0 || moveToIndex > rows.length - 1) return
      moveFieldRow({ moveFromIndex, moveToIndex, path })
    },
    [moveFieldRow, path, rows.length],
  )

  const errorCountFor = (rowIndex: number) =>
    submitted
      ? (errorPaths ?? []).filter((errorPath) => errorPath.startsWith(`${path}.${rowIndex}.`)).length
      : 0

  return (
    <div className="field-type">
      {rows.length === 0 && (
        <p className={styles.empty}>Chưa có phần nào. Bấm “Thêm phần” để tạo cái đầu tiên.</p>
      )}

      {rows.map((row, index) => {
        const errorCount = errorCountFor(index)

        return (
          <section className={styles.section} key={row.id}>
            <div className={styles.sectionHeader}>
              <div className={styles.sectionTitle}>
                <RenderFields
                  fields={titleFields}
                  forceRender
                  margins={false}
                  parentIndexPath=""
                  parentPath={`${path}.${index}`}
                  parentSchemaPath={schemaPath}
                  permissions={fieldPermissions}
                  readOnly={isReadOnly}
                />
              </div>

              {errorCount > 0 && <ErrorPill count={errorCount} i18n={i18n} />}

              {!isReadOnly && (
                <div className={styles.sectionActions}>
                  <Button
                    buttonStyle="subtle"
                    className={styles.moveUp}
                    disabled={index === 0}
                    icon={['chevron']}
                    margin={false}
                    onClick={() => moveRow(index, index - 1)}
                    size="xsmall"
                    tooltip="Chuyển lên"
                  />
                  <Button
                    buttonStyle="subtle"
                    disabled={index === rows.length - 1}
                    icon={['chevron']}
                    margin={false}
                    onClick={() => moveRow(index, index + 1)}
                    size="xsmall"
                    tooltip="Chuyển xuống"
                  />
                  <Button
                    buttonStyle="subtle"
                    icon={['x']}
                    margin={false}
                    onClick={() => removeRow(index)}
                    size="xsmall"
                    tooltip={t('general:delete')}
                  />
                </div>
              )}
            </div>

            <div className={styles.sectionBody}>
              <RenderFields
                fields={baiFields}
                forceRender
                margins="small"
                parentIndexPath=""
                parentPath={`${path}.${index}`}
                parentSchemaPath={schemaPath}
                permissions={fieldPermissions}
                readOnly={isReadOnly}
              />
            </div>
          </section>
        )
      })}

      {!hasMaxRows && !isReadOnly && (
        <Button
          buttonStyle="icon-label"
          icon="plus"
          iconPosition="left"
          iconStyle="with-border"
          margin={false}
          onClick={addRow}
          size="small"
        >
          Thêm phần
        </Button>
      )}
    </div>
  )
}
