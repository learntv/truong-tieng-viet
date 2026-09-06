import Image from 'next/image'
import React from 'react'

import styles from './SchoolMark.module.css'

/**
 * The school's mark and name. Shown at the left of the top bar, on the sign-in screen, and as
 * the framework's `graphics.Icon` / `graphics.Logo`, so the panel identifies itself as the
 * school's rather than as a stock Payload install.
 *
 * The buffalo is the same artwork the public site uses (`src/assets/buffalo-icon.png`), copied
 * into `cms/public/brand/` because the two halves of the repo are separate builds and the CMS
 * cannot import through the app's Vite asset pipeline.
 */
export const SchoolMark: React.FC<{
  /** `icon` is the mark alone — for the browser-chrome-sized slots. */
  readonly variant?: 'full' | 'icon'
}> = ({ variant = 'full' }) => (
  <span className={variant === 'icon' ? styles.icon : styles.mark}>
    <Image
      alt=""
      aria-hidden="true"
      className={styles.buffalo}
      height={40}
      priority
      src="/brand/buffalo-icon.png"
      width={40}
    />
    {variant === 'full' && (
      <span className={styles.wordmark}>
        <span className={styles.line}>Trường Tiếng Việt</span>
        <span className={styles.line}>Của Em</span>
      </span>
    )}
  </span>
)
