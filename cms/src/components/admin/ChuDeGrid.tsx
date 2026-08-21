'use client'

import { Button, useConfig, useDocumentInfo } from '@payloadcms/ui'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useCallback, useEffect, useState } from 'react'

import styles from './ChuDeGrid.module.css'

// Only the two columns the cards render. The REST `select` below keeps the response to these
// fields, so opening a quyển never pulls down the chặng/nội dung/bài/hình underneath every
// chủ đề — that tree is loaded only on the chủ đề's own page.
type ChuDeSummary = {
  id: number | string
  title?: null | string
}

/**
 * The `chuDes` UI field on the quyển edit page: this quyển's chủ đề as a grid of cards, each
 * linking to its own document. Replaces the nested-array accordion the tree used to render as.
 */
export const ChuDeGrid: React.FC = () => {
  const { id: quyenID } = useDocumentInfo()
  const {
    config: {
      routes: { admin: adminRoute, api: apiRoute },
      serverURL,
    },
  } = useConfig()
  const router = useRouter()

  const [docs, setDocs] = useState<ChuDeSummary[] | null>(null)
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<null | string>(null)

  const apiBase = `${serverURL || ''}${apiRoute}/chu-de`

  useEffect(() => {
    if (!quyenID) {
      setDocs([])
      return
    }

    const controller = new AbortController()
    const query = new URLSearchParams({
      depth: '0',
      limit: '200',
      'select[title]': 'true',
      sort: '_order',
      'where[quyen][equals]': String(quyenID),
    })

    fetch(`${apiBase}?${query}`, { credentials: 'include', signal: controller.signal })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(String(res.status)))))
      .then((data: { docs?: ChuDeSummary[] }) => setDocs(data.docs ?? []))
      .catch((err: Error) => {
        if (err.name !== 'AbortError') setError('Không tải được danh sách chủ đề.')
      })

    return () => controller.abort()
  }, [apiBase, quyenID])

  // Creating through the API rather than linking to /create means the new chủ đề is already
  // attached to this quyển by the time its edit page opens — the create view has no way to
  // prefill a relationship from the URL.
  const createChuDe = useCallback(async () => {
    if (!quyenID) return
    setCreating(true)
    setError(null)

    try {
      const res = await fetch(apiBase, {
        body: JSON.stringify({ title: 'Chủ đề mới', quyen: quyenID }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        method: 'POST',
      })
      if (!res.ok) throw new Error(String(res.status))
      const { doc } = (await res.json()) as { doc: ChuDeSummary }
      router.push(`${adminRoute}/collections/chu-de/${doc.id}`)
    } catch {
      setError('Không tạo được chủ đề mới.')
      setCreating(false)
    }
  }, [adminRoute, apiBase, quyenID, router])

  return (
    <div className="field-type">
      <div className={styles.header}>
        <h4 className={styles.heading}>Chủ đề</h4>
        <Button
          buttonStyle="secondary"
          disabled={!quyenID || creating}
          icon={['plus']}
          iconPosition="left"
          margin={false}
          onClick={createChuDe}
          size="small"
          type="button"
        >
          Thêm chủ đề
        </Button>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      {docs === null && <p className={styles.message}>Đang tải…</p>}

      {docs?.length === 0 && (
        <p className={styles.message}>Chưa có chủ đề nào. Bấm “Thêm chủ đề” để tạo cái đầu tiên.</p>
      )}

      {docs && docs.length > 0 && (
        <ul className={styles.grid}>
          {docs.map((doc) => (
            <li key={doc.id}>
              <Link className={styles.card} href={`${adminRoute}/collections/chu-de/${doc.id}`}>
                <span className={styles.cardTitle}>{doc.title || 'Chưa đặt tên'}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
