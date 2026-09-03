import type { ServerProps } from 'payload'

import Link from 'next/link'
import React from 'react'

import { buildNavGroups } from './navModel'
import styles from './Nav.module.css'

/**
 * `admin.components.Nav` — replaces Payload's sidebar outright.
 *
 * A replacement rather than beforeNavLinks because the design both groups items and
 * omits one: chủ đề must stay routable while never being listed, and there is no
 * config flag for that (see navModel.ts).
 *
 * Payload passes server components its own props — `payload` comes from ServerProps,
 * so this needs no getPayload call of its own.
 */
export const Nav: React.FC<ServerProps> = async ({ payload }) => {
  const adminRoute = payload.config.routes.admin
  const groups = await buildNavGroups({ adminRoute, payload })

  return (
    <nav className={styles.nav}>
      <div className={styles.header}>
        <img alt="" aria-hidden="true" height={28} src="/brand/buffalo-icon.png" width={28} />
        <span className={styles.school}>
          Trường Tiếng Việt
          <br />
          Của Em
        </span>
      </div>

      {groups.map((group, groupIndex) => (
        <div className={styles.group} key={group.label ?? `group-${groupIndex}`}>
          {group.label && <span className={styles.groupLabel}>{group.label}</span>}

          {group.items.map((item) =>
            item.href === null ? (
              <span className={styles.itemDisabled} key={item.label}>
                {item.label}
                {item.note && <span className={styles.note}>{item.note}</span>}
              </span>
            ) : (
              <Link className={styles.item} href={item.href} key={item.label}>
                {item.label}
              </Link>
            ),
          )}
        </div>
      ))}
    </nav>
  )
}
