import { redirect } from 'next/navigation'

import config from '@/payload.config'

/**
 * The CMS has no public front page of its own — the site is a separate app — so its root goes
 * straight to the admin panel instead of Payload's starter "Go to admin panel" screen. The admin
 * route handles the signed-out case itself, by sending the visitor on to its login page.
 */
export default async function HomePage() {
  const payloadConfig = await config
  redirect(payloadConfig.routes.admin)
}
