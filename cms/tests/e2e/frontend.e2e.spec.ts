import { test, expect } from '@playwright/test'

import { serverURL } from '../helpers/serverURL'

test.describe('Frontend', () => {
  test('the root goes straight to the admin panel', async ({ page }) => {
    await page.goto(serverURL)

    await expect(page).toHaveURL(/\/admin(\/|$)/)
  })
})
