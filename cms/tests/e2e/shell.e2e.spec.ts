import { expect, test } from '@playwright/test'

import { adminURL } from '../helpers/serverURL'

test.describe('Login screen', () => {
  test('shows the school branding and orientation copy', async ({ page }) => {
    await page.goto(adminURL('/login'))

    await expect(page.getByAltText('Trường Tiếng Việt Của Em')).toBeVisible()
    await expect(
      page.getByText('Đây là nơi soạn nội dung bài học. Cô đăng nhập để bắt đầu.'),
    ).toBeVisible()
  })

  test('names the school in the browser tab', async ({ page }) => {
    await page.goto(adminURL('/login'))

    await expect(page).toHaveTitle(/Trường Tiếng Việt Của Em$/)
  })
})
