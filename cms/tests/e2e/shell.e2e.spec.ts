import { expect, test } from '@playwright/test'

import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'
import { login } from '../helpers/login'
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

test.describe('Sidebar', () => {
  test.beforeAll(async () => {
    await seedTestUser()
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('groups destinations and hides the chủ đề collection', async ({ page }) => {
    await login({ page, user: testUser })

    const nav = page.getByRole('navigation').first()

    await expect(nav.getByText('Nội dung học')).toBeVisible()
    await expect(nav.getByText('Thư viện')).toBeVisible()
    await expect(nav.getByText('Quản trị')).toBeVisible()

    await expect(nav.getByRole('link', { name: 'Quyển 1' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Luyện nói' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Hình & âm thanh' })).toBeVisible()

    await expect(nav.getByRole('link', { name: 'Chủ đề' })).toHaveCount(0)
  })

  test('a quyển link opens that quyển document, not a list view', async ({ page }) => {
    await login({ page, user: testUser })

    await page
      .getByRole('navigation')
      .first()
      .getByRole('link', { name: 'Quyển 1' })
      .click()

    await expect(page).toHaveURL(/\/admin\/collections\/quyen\/[^/]+$/)
  })

  test('chủ đề pages stay reachable even though they are not listed', async ({ page }) => {
    await login({ page, user: testUser })

    await page.goto(adminURL('/collections/chu-de'))
    await expect(page).toHaveURL(adminURL('/collections/chu-de'))
  })
})

test.describe('Dashboard', () => {
  test.beforeAll(async () => {
    await seedTestUser()
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('greets the teacher and offers the three destinations', async ({ page }) => {
    await login({ page, user: testUser })

    // Not scoped to a landmark: "Mở quyển 1" appears nowhere else in the panel, and
    // scoping to `main` would break the moment Payload's own template renders one too.
    // seedUser creates dev@payloadcms.com with no display name, so the greeting falls
    // back to the local part.
    await expect(page.getByText(/^Chào dev/)).toBeVisible()

    await expect(page.getByRole('link', { name: 'Mở quyển 1' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Mở quyển 2' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Mở luyện nói' })).toBeVisible()
  })

  test('opens a quyển from its card', async ({ page }) => {
    await login({ page, user: testUser })

    await page.getByRole('link', { name: 'Mở quyển 1' }).click()

    await expect(page).toHaveURL(/\/admin\/collections\/quyen\/[^/]+$/)
  })
})
