'use client'

import type { ArrayFieldClientComponent, ArrayFieldClientProps } from 'payload'

import {
  Button,
  Drawer,
  DrawerToggler,
  ErrorPill,
  RenderFields,
  ShimmerEffect,
  useConfig,
  useDrawerSlug,
  useField,
  useForm,
  useFormFields,
  useFormSubmitted,
  useTranslation,
} from '@payloadcms/ui'
import React, { useCallback, useMemo, useRef, useState } from 'react'

import { hasAudio, hasHinh, hasLink, hasVideo, isBaiEmpty } from '@/lib/baiContent'
import { readBaisInArray } from '@/lib/baiFormState'

import styles from './BaiList.module.css'
import { useResolvedMedia } from './RowMedia'

/**
 * The `bais` array of a nội dung, as a flat numbered list of always-visible rows.
 *
 * Payload's array row is a collapsible by construction, and its `RowLabel` hook can only
 * decorate the header of one — which is why this takes the whole array over the way
 * `ChangTabs`, `NoiDungSections` and `HinhGallery` already do. What that buys is the thing the
 * change is for: 173 bài across Quyển 1 share 75 distinct titles, and "Nhìn hình, nghe và nhắc
 * lại" labels 26 different rows, so a row has to show what its bài *holds* — its picture and
 * its attachments — or two bài are indistinguishable without opening both.
 *
 * The cost is owning add / delete / reorder / duplicate, and it is small: `useForm()` exposes
 * every primitive Payload's own array field uses, including the single dispatch that copies a
 * row's whole subtree.
 */

const UNTITLED = 'Chưa đặt tên'

/** Keeps a freshly added row's name box from collapsing to nothing before it is typed into. */
const MIN_INPUT_SIZE = 24

type RowState = {
  readonly audio: boolean
  readonly empty: boolean
  readonly firstHinh: string
  readonly link: boolean
  readonly video: boolean
}

/**
 * Every row's content state, from live form state, in one pass.
 *
 * Flattened to a string because `useFormFields` re-runs its selector on every keystroke
 * anywhere in the document: a primitive lets React skip the re-render unless something a row
 * actually shows has changed. Asking per row would walk the whole form once per row.
 */
const useRowStates = (arrayPath: string, rowCount: number): RowState[] => {
  const signature = useFormFields(([fields]) => {
    const bais = readBaisInArray(fields, arrayPath)

    return Array.from({ length: rowCount }, (_, index) => {
      const bai = bais.get(index) ?? {}
      const first = (bai.hinhs ?? []).find((hinh) => hinh?.image != null && hinh.image !== '')
      const image = first?.image
      const id =
        typeof image === 'object' && image !== null && 'id' in image
          ? String((image as { id: unknown }).id)
          : (image ?? '')

      return [
        id,
        hasHinh(bai) ? '1' : '0',
        hasAudio(bai) ? '1' : '0',
        hasVideo(bai) ? '1' : '0',
        hasLink(bai) ? '1' : '0',
        isBaiEmpty(bai) ? '1' : '0',
      ].join('|')
    }).join(';')
  })

  return useMemo(
    () =>
      signature.split(';').map((row) => {
        const [firstHinh, , audio, video, link, empty] = row.split('|')
        return {
          audio: audio === '1',
          empty: empty === '1',
          firstHinh,
          link: link === '1',
          video: video === '1',
        }
      }),
    [signature],
  )
}

/**
 * The bài's first hình, resolved through the one batched media request `RowMediaProvider`
 * issues for the whole chặng, and the action that sets one when there is none.
 *
 * `loading="lazy"` because a chặng averages ~7 hình at full size (Media declares no
 * `imageSizes`, so the original file is the only variant); only the active chặng is mounted,
 * and only the rows on screen fetch.
 */
const PictureSlot: React.FC<{
  readonly mediaID: string
  readonly onChoose: () => void
  readonly readOnly: boolean
  readonly uploading: boolean
}> = ({ mediaID, onChoose, readOnly, uploading }) => {
  const media = useResolvedMedia(mediaID || undefined)

  if (uploading) return <div className={styles.picture}><ShimmerEffect height="100%" /></div>

  if (mediaID) {
    return (
      <div className={styles.picture}>
        {media?.url ? (
          /* A plain <img>, not next/image: this URL is R2's public host in production and
           * Payload's local route in dev, so next/image would need both configured as remote
           * patterns before it could render a row thumbnail at all. The directive has to sit
           * on the line immediately above the element it silences. */
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="" className={styles.pictureImg} loading="lazy" src={media.url} />
        ) : (
          // Still loading, or the file could not be fetched. Either way the row keeps its
          // number, name, indications and controls — and is NOT reported as holding nothing,
          // because a hình whose image 404s is still a hình the teacher put there.
          <span className={styles.pictureBroken} title={media?.filename ?? 'Không tải được hình'} />
        )}
      </div>
    )
  }

  if (readOnly) return <div className={styles.picture} />

  return (
    <button className={`${styles.picture} ${styles.pictureAdd}`} onClick={onChoose} type="button">
      <span aria-hidden="true">+</span>
      <span className={styles.srOnly}>Chọn hình cho bài này</span>
    </button>
  )
}

type RowProps = {
  readonly errorCount: number
  readonly fields: ArrayFieldClientProps['field']['fields']
  readonly index: number
  readonly isLast: boolean
  readonly isLoading?: boolean
  readonly onChoosePicture: (rowIndex: number) => void
  readonly onDelete: (rowIndex: number) => void
  readonly onDuplicate: (rowIndex: number) => void
  readonly onMove: (from: number, to: number) => void
  readonly path: string
  readonly permissions: unknown
  readonly readOnly: boolean
  readonly schemaPath: string
  readonly state: RowState
  readonly uploading: boolean
}

const BaiRow: React.FC<RowProps> = ({
  errorCount,
  fields,
  index,
  isLast,
  isLoading,
  onChoosePicture,
  onDelete,
  onDuplicate,
  onMove,
  path,
  permissions,
  readOnly,
  schemaPath,
  state,
  uploading,
}) => {
  const { i18n } = useTranslation()
  const rowPath = `${path}.${index}`
  const { setValue, value } = useField<string>({ path: `${rowPath}.title` })
  const drawerSlug = useDrawerSlug(`bai-${rowPath}`)
  const title = value ?? ''

  // Everything a row cannot show, rendered in the drawer at the same row path: the hình
  // gallery with its captions and the three attachment editors with their existing previews.
  // The name is not among them — it is edited on the row.
  const detailFields = useMemo(
    () => fields.filter((field) => !('name' in field && field.name === 'title')),
    [fields],
  )

  if (isLoading) {
    return (
      <li className={styles.row}>
        <ShimmerEffect height="3.4rem" />
      </li>
    )
  }

  return (
    <li className={state.empty ? `${styles.row} ${styles.rowEmpty}` : styles.row}>
      <span className={styles.number}>{index + 1}</span>

      <PictureSlot
        mediaID={state.firstHinh}
        onChoose={() => onChoosePicture(index)}
        readOnly={readOnly}
        uploading={uploading}
      />

      <div className={styles.body}>
        <input
          aria-label={`Tên bài ${index + 1}`}
          className={styles.name}
          onChange={(event) => setValue(event.target.value)}
          placeholder={UNTITLED}
          readOnly={readOnly}
          size={Math.max(title.length, MIN_INPUT_SIZE)}
          value={title}
        />

        <div className={styles.marks}>
          {/* One indication per attachment that is set, and none for one that is not — from
            * the same helpers the empty predicate uses, so a row and the counts above it can
            * never disagree about what "set" means. */}
          {state.audio && (
            <span className={styles.mark} data-mark="audio" title="Có âm thanh">
              ♪<span className={styles.srOnly}>Có âm thanh</span>
            </span>
          )}
          {state.video && (
            <span className={styles.mark} data-mark="video" title="Có video">
              ▶<span className={styles.srOnly}>Có video</span>
            </span>
          )}
          {state.link && (
            <span className={styles.mark} data-mark="link" title="Có liên kết">
              🔗<span className={styles.srOnly}>Có liên kết</span>
            </span>
          )}
          {state.empty && (
            <span className={styles.emptyMark} data-mark="empty">
              Chưa có gì
            </span>
          )}
          {errorCount > 0 && <ErrorPill count={errorCount} i18n={i18n} />}
        </div>
      </div>

      <div className={styles.actions}>
        <DrawerToggler
          aria-label={`Chi tiết bài ${index + 1}`}
          className={styles.detail}
          slug={drawerSlug}
        >
          Chi tiết
        </DrawerToggler>

        {!readOnly && (
          <>
            <Button
              aria-label="Chuyển lên"
              buttonStyle="subtle"
              className={styles.moveUp}
              disabled={index === 0}
              icon={['chevron']}
              margin={false}
              onClick={() => onMove(index, index - 1)}
              size="xsmall"
              tooltip="Chuyển lên"
            />
            <Button
              aria-label="Chuyển xuống"
              buttonStyle="subtle"
              disabled={isLast}
              icon={['chevron']}
              margin={false}
              onClick={() => onMove(index, index + 1)}
              size="xsmall"
              tooltip="Chuyển xuống"
            />
            <Button
              aria-label="Nhân đôi"
              buttonStyle="subtle"
              className={styles.duplicate}
              margin={false}
              onClick={() => onDuplicate(index)}
              size="xsmall"
              tooltip="Nhân đôi"
            >
              ⧉
            </Button>
            <Button
              aria-label="Xoá bài"
              buttonStyle="subtle"
              icon={['x']}
              margin={false}
              onClick={() => onDelete(index)}
              size="xsmall"
              tooltip="Xoá bài"
            />
          </>
        )}
      </div>

      {/*
       * A drawer rather than an in-row expander: the spec requires the list not to reorder,
       * hide or collapse when a bài's detail is opened, and to return to the same place. An
       * expander would reintroduce exactly the collapsible this change removes, and would push
       * every row below it down the page.
       */}
      <Drawer slug={drawerSlug} title={title || UNTITLED}>
        <RenderFields
          fields={detailFields}
          forceRender
          margins="small"
          parentIndexPath=""
          parentPath={rowPath}
          parentSchemaPath={schemaPath}
          permissions={permissions as never}
          readOnly={readOnly}
        />
      </Drawer>
    </li>
  )
}

export const BaiList: ArrayFieldClientComponent = ({
  field,
  path: pathFromProps,
  permissions,
  readOnly,
  schemaPath: schemaPathFromProps,
}) => {
  const { name, fields, maxRows } = field
  const schemaPath = schemaPathFromProps ?? name

  const { addFieldRow, dispatchFields, moveFieldRow, removeFieldRow, setModified } = useForm()
  const submitted = useFormSubmitted()
  const { disabled, errorPaths, path, rows = [] } = useField({
    hasRows: true,
    potentiallyStalePath: pathFromProps,
  })
  const {
    config: {
      routes: { api: apiRoute },
      serverURL,
    },
  } = useConfig()

  const states = useRowStates(path, rows.length)

  const fileInputRef = useRef<HTMLInputElement>(null)
  // Which row the file picker was opened for. The picker is one input for the whole list —
  // a hidden input per row would be 40 of them.
  const targetRow = useRef<null | number>(null)
  const [uploadingRow, setUploadingRow] = useState<null | number>(null)
  const [error, setError] = useState<null | string>(null)

  const isReadOnly = Boolean(readOnly || disabled)
  const hasMaxRows = typeof maxRows === 'number' && rows.length >= maxRows
  const fieldPermissions = permissions === true ? permissions : (permissions?.fields ?? {})

  const addRow = useCallback(() => {
    void addFieldRow({ path, rowIndex: rows.length, schemaPath })
  }, [addFieldRow, path, rows.length, schemaPath])

  // A bài carries its hình and captions with it and there is no undo.
  const removeRow = useCallback(
    (rowIndex: number) => {
      if (!window.confirm('Xoá bài này cùng hình và tệp đính kèm của nó?')) return
      removeFieldRow({ path, rowIndex })
    },
    [path, removeFieldRow],
  )

  /**
   * Duplicate. One dispatch copies the row's whole subtree — name, hình, captions and
   * attachments — which is what Payload's own array field does (`ui/dist/fields/Array`), and
   * it is why the copy is independent with no hand-written state copying to get wrong.
   */
  const duplicateRow = useCallback(
    (rowIndex: number) => {
      dispatchFields({ type: 'DUPLICATE_ROW', path, rowIndex })
      setModified(true)
    },
    [dispatchFields, path, setModified],
  )

  const moveRow = useCallback(
    (moveFromIndex: number, moveToIndex: number) => {
      if (moveToIndex < 0 || moveToIndex > rows.length - 1) return
      moveFieldRow({ moveFromIndex, moveToIndex, path })
    },
    [moveFieldRow, path, rows.length],
  )

  const choosePicture = useCallback((rowIndex: number) => {
    targetRow.current = rowIndex
    fileInputRef.current?.click()
  }, [])

  /**
   * Setting a picture from a row's slot. The upload-then-add-row pattern is `HinhGallery`'s:
   * the file goes to the media collection and the returned id is written straight into a new
   * `hinhs` row's `image`, so the picture appears in the slot without a save.
   */
  const uploadPicture = useCallback(
    async (file: File, rowIndex: number) => {
      setUploadingRow(rowIndex)
      setError(null)

      try {
        const body = new FormData()
        body.append('file', file)
        // `alt` is required on the media collection; the filename is a usable default the
        // editor can improve on the media document later.
        body.append('_payload', JSON.stringify({ alt: file.name }))

        const res = await fetch(`${serverURL || ''}${apiRoute}/media`, {
          body,
          credentials: 'include',
          method: 'POST',
        })
        if (!res.ok) throw new Error(String(res.status))

        const { doc } = (await res.json()) as { doc: { id: number | string } }
        // Row 0 of this bài's `hinhs`: the slot shows the *first* hình, and the slot is only
        // offered when the bài has none.
        addFieldRow({
          path: `${path}.${rowIndex}.hinhs`,
          rowIndex: 0,
          schemaPath: `${schemaPath}.hinhs`,
          subFieldState: { image: { initialValue: doc.id, valid: true, value: doc.id } },
        })
      } catch {
        setError('Không tải được hình lên.')
      } finally {
        setUploadingRow(null)
        // Lets the same file be picked again right after, which otherwise fires no change.
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    },
    [addFieldRow, apiRoute, path, schemaPath, serverURL],
  )

  const errorCountFor = (rowIndex: number) =>
    submitted
      ? (errorPaths ?? []).filter((errorPath) => errorPath.startsWith(`${path}.${rowIndex}.`)).length
      : 0

  return (
    <div className="field-type" data-testid="bai-list">
      {error && <p className={styles.error}>{error}</p>}

      {rows.length === 0 && (
        <p className={styles.empty}>Chưa có bài nào. Bấm “Thêm bài” để tạo cái đầu tiên.</p>
      )}

      {rows.length > 0 && (
        <ol className={styles.list}>
          {rows.map((row, index) => (
            <BaiRow
              errorCount={errorCountFor(index)}
              fields={fields}
              index={index}
              isLast={index === rows.length - 1}
              /* A row added a moment ago has no server-rendered field components yet; without
               * this the drawer's fields would fall back to Payload's stock array UI for an
               * instant. */
              isLoading={row.isLoading}
              key={row.id}
              onChoosePicture={choosePicture}
              onDelete={removeRow}
              onDuplicate={duplicateRow}
              onMove={moveRow}
              path={path}
              permissions={fieldPermissions}
              readOnly={isReadOnly}
              schemaPath={schemaPath}
              /* `empty: false` as the fallback, never true: a row whose state has not been
               * computed yet must not flash the "holds nothing" marker at a bài that holds
               * something. */
              state={states[index] ?? { audio: false, empty: false, firstHinh: '', link: false, video: false }}
              uploading={uploadingRow === index}
            />
          ))}
        </ol>
      )}

      {!isReadOnly && (
        <>
          <input
            accept="image/*"
            className={styles.fileInput}
            onChange={(event) => {
              const file = event.target.files?.[0]
              const rowIndex = targetRow.current
              if (file && rowIndex !== null) void uploadPicture(file, rowIndex)
            }}
            ref={fileInputRef}
            type="file"
          />

          {!hasMaxRows && (
            <Button
              buttonStyle="icon-label"
              className={styles.add}
              icon="plus"
              iconPosition="left"
              iconStyle="with-border"
              margin={false}
              onClick={addRow}
              size="small"
            >
              Thêm bài
            </Button>
          )}
        </>
      )}
    </div>
  )
}
