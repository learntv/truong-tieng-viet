import React from 'react'

import styles from './Brand.module.css'

/**
 * `admin.components.beforeLogin` — orientation for a teacher landing here.
 *
 * Stock Payload's login gives no signal about which system this is. One line and a
 * mascot is enough; the wordmark above it comes from the Logo slot.
 */
export const BeforeLogin: React.FC = () => (
  <div className={styles.beforeLogin}>
    <img alt="" aria-hidden="true" className={styles.mascot} src="/brand/wave.png" />
    <p className={styles.copy}>
      <span className={styles.school}>Trường Tiếng Việt Của Em</span>
      Đây là nơi soạn nội dung bài học. Cô đăng nhập để bắt đầu.
    </p>
  </div>
)
