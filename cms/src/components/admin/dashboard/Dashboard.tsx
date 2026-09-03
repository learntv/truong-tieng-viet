import type { AdminViewServerProps } from 'payload'

import Link from 'next/link'
import React from 'react'

import { greetingName, loadDashboardData } from './dashboardData'
import styles from './Dashboard.module.css'

/**
 * `admin.components.views.dashboard` — a launchpad, not a report.
 *
 * Payload's default dashboard is a grid of collection cards named after the schema.
 * This answers the question a teacher actually arrives with: where do I go to work
 * today, and where did I stop last time.
 *
 * A "cần hoàn thiện" work queue (empty chặng, bài with no hình) belongs here
 * eventually, but the gaps live inside nested arrays — it needs a full scan of every
 * chủ đề document plus caching, so it waits for the chủ đề workspace.
 */
export const Dashboard: React.FC<AdminViewServerProps> = async ({ payload, user }) => {
  const adminRoute = payload.config.routes.admin
  const { destinations, recents } = await loadDashboardData({ adminRoute, payload })

  return (
    <main className={styles.view}>
      <div className={styles.greeting}>
        <img alt="" aria-hidden="true" className={styles.mascot} src="/brand/wave.png" />
        <div>
          <p className={styles.hello}>Chào {greetingName(user)} 👋</p>
          <p className={styles.helloSub}>Chọn nơi cô muốn soạn bài hôm nay.</p>
        </div>
      </div>

      <h2 className={styles.sectionLabel}>Nội dung học</h2>
      <ul className={styles.cards}>
        {destinations.map((destination) => (
          <li className={styles.card} key={destination.key}>
            <span className={styles.cardTitle}>{destination.label}</span>
            <span className={styles.cardCount}>
              {/* A failed count shows a dash rather than blanking the card. */}
              {destination.count === null ? '—' : `${destination.count} chủ đề`}
            </span>
            {destination.href === null ? (
              <span className={styles.cardUnavailable}>Chưa sẵn sàng</span>
            ) : (
              <Link className={styles.cardButton} href={destination.href}>
                {destination.buttonLabel}
              </Link>
            )}
          </li>
        ))}
      </ul>

      <h2 className={styles.sectionLabel}>Cô vừa sửa</h2>
      {recents === null || recents.length === 0 ? (
        <p className={styles.empty}>
          Cô chưa sửa gì gần đây. Bắt đầu từ một quyển ở trên nhé.
        </p>
      ) : (
        <ul className={styles.recents}>
          {recents.map((recent) => (
            <li key={`${recent.kind}-${recent.id}`}>
              <Link className={styles.recent} href={recent.href}>
                <span>{recent.title}</span>
                <span className={styles.recentWhere}>
                  {recent.kind === 'chu-de' ? 'Chủ đề' : 'Luyện nói'}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
