import { test, expect, Page } from '@playwright/test'
import { login } from '../helpers/login'
import { seedTestUser, cleanupTestUser, testUser } from '../helpers/seedUser'
import { adminURL } from '../helpers/serverURL'

test.describe('Admin Panel', () => {
  let page: Page

  test.beforeAll(async ({ browser }, testInfo) => {
    await seedTestUser()

    const context = await browser.newContext()
    page = await context.newPage()

    await login({ page, user: testUser })
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('can navigate to dashboard', async () => {
    await page.goto(adminURL())
    await expect(page).toHaveURL(adminURL())
    // The dashboard's contents are replaced by this project; the durable signal that
    // the admin shell has rendered is the navigation landmark (see login helper).
    await expect(page.getByRole('navigation').first()).toBeVisible()
  })

  test('can navigate to list view', async () => {
    await page.goto(adminURL('/collections/users'))
    await expect(page).toHaveURL(adminURL('/collections/users'))
    const listViewArtifact = page.locator('h1', { hasText: 'Users' }).first()
    await expect(listViewArtifact).toBeVisible()
  })

  test('can navigate to edit view', async () => {
    await page.goto(adminURL('/collections/users/create'))
    await expect(page).toHaveURL(/\/admin\/collections\/users\/[a-zA-Z0-9-_]+/)
    const editViewArtifact = page.locator('input[name="email"]')
    await expect(editViewArtifact).toBeVisible()
  })
})
