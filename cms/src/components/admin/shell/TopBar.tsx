import type { ServerProps } from 'payload'

import Link from 'next/link'
import React from 'react'

import { adminNavEntries } from '@/lib/adminNav'

import { SchoolMark } from './SchoolMark'
import styles from './TopBar.module.css'
import { TopBarLink } from './TopBarLink'

/**
 * The panel's navigation: a horizontal bar across the top of every admin screen, in place of
 * Payload's sidebar.
 *
 * Registered as `admin.components.header`, which is the one slot `DefaultTemplate` renders
 * *outside* the nav grid and above every view — exactly where a full-width bar belongs.
 * (`admin.components.Nav` renders inside the grid as its first column; that slot is filled
 * with a component that renders nothing. See `EmptyNav.tsx`.)
 *
 * A server component, so the quyển roster is resolved straight from the `payload` instance
 * Payload hands it — no client fetch, no loading state on a bar that is on every screen.
 */
export const TopBar: React.FC<ServerProps> = async ({ payload, user }) => {
  const adminRoute = payload.config.routes.admin
  const entries = await adminNavEntries(payload)

  return (
    <header className={styles.bar} data-testid="ttv-top-bar">
      <Link aria-label="Trang chính" className={styles.brand} href={adminRoute}>
        <SchoolMark />
      </Link>

      <nav aria-label="Điều hướng chính" className={styles.nav}>
        {entries.map((entry) => (
          <TopBarLink exact={entry.href === ''} href={`${adminRoute}${entry.href}`} key={entry.href}>
            {entry.label}
          </TopBarLink>
        ))}
      </nav>

      {/*
       * The account control. Payload's own sits in `AppHeader`, which is still rendered inside
       * the card below — it is hidden there in custom.scss, because two account controls on one
       * page is worse than none.
       */}
      <div className={styles.account}>
        {user?.email && <span className={styles.email}>{user.email}</span>}
        <Link className={styles.accountLink} href={`${adminRoute}/account`}>
          Tài khoản
        </Link>
        <Link className={styles.accountLink} href={`${adminRoute}/logout`}>
          Đăng xuất
        </Link>
      </div>
    </header>
  )
}
