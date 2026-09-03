import React from 'react'

import styles from './Brand.module.css'

/**
 * `admin.components.graphics.Logo` — the login screen mark.
 *
 * A plain <img> rather than next/image: this renders inside Payload's own login
 * layout, the asset is a fixed local file, and next/image's wrapper markup fights
 * the slot's sizing for no benefit.
 */
export const Logo: React.FC = () => (
  <img
    alt="Trường Tiếng Việt Của Em"
    className={styles.wordmark}
    src="/brand/logo-wordmark.png"
  />
)
