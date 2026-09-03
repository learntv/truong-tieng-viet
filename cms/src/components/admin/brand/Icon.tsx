import React from 'react'

import styles from './Brand.module.css'

/**
 * `admin.components.graphics.Icon` — the mark in the nav header.
 *
 * buffalo-icon.png is true RGBA, so it sits cleanly on the blue sidebar. The mascot
 * PNGs would fringe there; see public/brand/README.md.
 */
export const Icon: React.FC = () => (
  <img alt="" aria-hidden="true" className={styles.icon} src="/brand/buffalo-icon.png" />
)
