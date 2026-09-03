import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

import { adminURL, SERVER_URL } from './serverURL'

export interface LoginOptions {
  page: Page
  user: {
    email: string
    password: string
  }
}

/**
 * Logs the user into the admin panel via the login page.
 *
 * Waits on the navigation landmark rather than any particular label: the panel is
 * Vietnamese-only, and the dashboard's contents are replaced by this project, so the
 * one durable signal that the admin shell has rendered is that a <nav> exists.
 */
export async function login({ page, user }: LoginOptions): Promise<void> {
  await page.goto(adminURL('/login'))

  await page.fill('#field-email', user.email)
  await page.fill('#field-password', user.password)
  await page.click('button[type="submit"]')

  await page.waitForURL(`${SERVER_URL}/admin`)

  // .first(): Payload may render more than one navigation landmark (the sidebar plus
  // document-level controls), and this only needs to know the shell has mounted.
  await expect(page.getByRole('navigation').first()).toBeVisible()
}
