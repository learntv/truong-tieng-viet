import React from 'react'

import styles from './BeforeLogin.module.css'

/**
 * The line under the school's mark on the sign-in screen.
 *
 * The mark itself is not repeated here — Payload's login view already renders
 * `admin.components.graphics.Logo`, which is the school's, so a second copy would put the
 * buffalo and the name on the screen twice.
 */
export const BeforeLogin: React.FC = () => (
  <p className={styles.blurb}>Trang quản lý nội dung học tập</p>
)
