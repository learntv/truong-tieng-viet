'use client'

import type { ArrayFieldClientComponent } from 'payload'

import {
  Button,
  FieldLabel,
  RenderFields,
  ShimmerEffect,
  useConfig,
  useField,
  useForm,
  useListDrawer,
  XIcon,
} from '@payloadcms/ui'
import React, { useCallback, useMemo, useRef, useState } from 'react'

import styles from './HinhGallery.module.css'

/**
 * The `hinhs` array of a bài, as a gallery instead of collapsible rows. "Thêm hình" opens the
 * file picker straight away: each chosen file is uploaded to the media collection and becomes a
 * row with its image already set, so adding a picture is one action rather than "add a row,
 * open it, then find the upload control inside".
 *
 * Images already in the media library are added through Payload's list drawer instead, and
 * each card still renders the row's real upload field, so an image can be swapped after the
 * fact.
 */
export const HinhGallery: ArrayFieldClientComponent = ({
  field,
  path: pathFromProps,
  permissions,
  readOnly,
  schemaPath: schemaPathFromProps,
}) => {
  const { name, fields, label } = field
  const schemaPath = schemaPathFromProps ?? name

  const { addFieldRow, removeFieldRow } = useForm()
  const { disabled, path, rows = [] } = useField({
    hasRows: true,
    potentiallyStalePath: pathFromProps,
  })
  const {
    config: {
      routes: { api: apiRoute },
      serverURL,
    },
  } = useConfig()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [ListDrawer, ListDrawerToggler, { closeDrawer }] = useListDrawer({
    collectionSlugs: ['media'],
  })
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const imageFields = useMemo(() => fields.filter((f) => 'name' in f && f.name === 'image'), [fields])
  const captionFields = useMemo(
    () => fields.filter((f) => 'name' in f && f.name === 'captions'),
    [fields],
  )

  const isReadOnly = readOnly || disabled
  const fieldPermissions = permissions === true ? permissions : (permissions?.fields ?? {})

  const uploadFiles = useCallback(
    async (files: FileList) => {
      setUploading(true)
      setError(null)

      try {
        for (const [index, file] of Array.from(files).entries()) {
          const body = new FormData()
          body.append('file', file)
          // `alt` is required on the media collection; the filename is a usable default that
          // the editor can improve on the media document later.
          body.append('_payload', JSON.stringify({ alt: file.name }))

          const res = await fetch(`${serverURL || ''}${apiRoute}/media`, {
            body,
            credentials: 'include',
            method: 'POST',
          })
          if (!res.ok) throw new Error(String(res.status))

          const { doc } = (await res.json()) as { doc: { id: number | string } }
          addFieldRow({
            path,
            rowIndex: rows.length + index,
            schemaPath,
            subFieldState: { image: { initialValue: doc.id, valid: true, value: doc.id } },
          })
        }
      } catch {
        setError('Không tải được hình lên.')
      } finally {
        setUploading(false)
        // Lets the same file be picked again right after, which otherwise fires no change event.
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    },
    [addFieldRow, apiRoute, path, rows.length, schemaPath, serverURL],
  )

  const addExisting = useCallback(
    (docID: number | string) => {
      addFieldRow({
        path,
        rowIndex: rows.length,
        schemaPath,
        subFieldState: { image: { initialValue: docID, valid: true, value: docID } },
      })
      closeDrawer()
    },
    [addFieldRow, closeDrawer, path, rows.length, schemaPath],
  )

  return (
    <div className="field-type">
      <FieldLabel label={label} path={path} />

      {error && <p className={styles.error}>{error}</p>}

      {rows.length > 0 && (
        <ul className={styles.gallery}>
          {rows.map((row, index) => (
            <li className={styles.card} key={row.id}>
              {!isReadOnly && (
                <button
                  aria-label="Xoá hình"
                  className={styles.remove}
                  onClick={() => removeFieldRow({ path, rowIndex: index })}
                  title="Xoá hình"
                  type="button"
                >
                  <XIcon />
                </button>
              )}

              {row.isLoading ? (
                <ShimmerEffect height="6rem" />
              ) : (
                <>
                  <div className={styles.cardMedia}>
                    <RenderFields
                      fields={imageFields}
                      forceRender
                      margins={false}
                      parentIndexPath=""
                      parentPath={`${path}.${index}`}
                      parentSchemaPath={schemaPath}
                      permissions={fieldPermissions}
                      readOnly={isReadOnly}
                    />
                  </div>
                  <div className={styles.cardCaptions}>
                    <RenderFields
                      fields={captionFields}
                      forceRender
                      margins={false}
                      parentIndexPath=""
                      parentPath={`${path}.${index}`}
                      parentSchemaPath={schemaPath}
                      permissions={fieldPermissions}
                      readOnly={isReadOnly}
                    />
                  </div>
                </>
              )}

            </li>
          ))}
        </ul>
      )}

      {!isReadOnly && (
        <>
          <input
            accept="image/*"
            className={styles.fileInput}
            multiple
            onChange={(e) => {
              if (e.target.files?.length) void uploadFiles(e.target.files)
            }}
            ref={fileInputRef}
            type="file"
          />
          <div className={styles.actions}>
            <Button
              buttonStyle="icon-label"
              disabled={uploading}
              icon="plus"
              iconPosition="left"
              iconStyle="with-border"
              margin={false}
              onClick={() => fileInputRef.current?.click()}
              size="small"
            >
              {uploading ? 'Đang tải lên…' : 'Tải hình lên'}
            </Button>

            <ListDrawerToggler className={styles.chooseExisting}>Chọn từ thư viện</ListDrawerToggler>
          </div>

          <ListDrawer onSelect={({ doc }) => addExisting(doc.id as number | string)} />
        </>
      )}
    </div>
  )
}
