'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import styles from './TopBar.module.css'

/**
 * One entry in the top bar, marked when the current screen is inside it.
 *
 * A client component only because "which entry am I on" needs the live pathname; the entries
 * themselves are resolved on the server. Matching is by prefix so that a quyển's entry stays
 * marked while an editor is inside it, and exact for the dashboard, which is a prefix of
 * everything — `exact` opts an entry out of the prefix match for that reason.
 */
export const TopBarLink: React.FC<{
  readonly children: React.ReactNode
  readonly exact?: boolean
  readonly href: string
}> = ({ children, exact = false, href }) => {
  const pathname = usePathname() ?? ''
  const isCurrent = pathname === href || (!exact && pathname.startsWith(`${href}/`))

  return (
    <Link
      aria-current={isCurrent ? 'page' : undefined}
      className={isCurrent ? `${styles.link} ${styles.linkCurrent}` : styles.link}
      href={href}
    >
      {children}
    </Link>
  )
}
