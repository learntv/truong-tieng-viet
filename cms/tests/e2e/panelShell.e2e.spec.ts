import { expect, test, type Page } from '@playwright/test'

import { login } from '../helpers/login'
import { seedChuDe, type SeededContent } from '../helpers/seedContent'
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'
import { serverURL } from '../helpers/serverURL'

/**
 * The chrome every admin screen sits in.
 *
 * These assert the observable results rather than the class names the CSS reaches for — no
 * sidebar, one top bar, a card narrower than a wide viewport — so that if a Payload upgrade
 * renames `.template-default__nav-toggler-wrapper` or `.document-fields`, a test fails instead
 * of the panel quietly un-styling itself.
 */
test.describe('Panel shell', () => {
  let content: SeededContent
  let page: Page

  test.beforeAll(async ({ browser }) => {
    await seedTestUser()
    content = await seedChuDe()

    page = await (await browser.newContext({ viewport: { height: 900, width: 1600 } })).newPage()
    await login({ page, user: testUser })
  })

  test.afterAll(async () => {
    // Optional-chained: when `beforeAll` failed there is nothing to clean, and throwing here
    // would bury the error that actually mattered.
    await content?.cleanup()
    await cleanupTestUser()
  })

  const screens = [
    ['the dashboard', '/admin'],
    ['a collection list', '/admin/collections/media'],
    ['a document edit view', '/admin/collections/quyen'],
  ] as const

  for (const [what, path] of screens) {
    test(`shows one top bar and no sidebar on ${what}`, async () => {
      await page.goto(`${serverURL}${path}`)
      await expect(page.getByTestId('ttv-top-bar')).toHaveCount(1)

      // Payload's sidebar renders as `.nav` inside the template's grid; the hamburger that
      // would open it is hidden.
      await expect(page.locator('.template-default .nav')).toHaveCount(0)
      await expect(page.locator('.template-default__nav-toggler-wrapper')).toBeHidden()
    })
  }

  test('the top bar carries the school, the navigation and the account control, in that order', async () => {
    await page.goto(`${serverURL}/admin`)
    const bar = page.getByTestId('ttv-top-bar')

    await expect(bar.getByText('Trường Tiếng Việt')).toBeVisible()
    await expect(bar.getByRole('navigation', { name: 'Điều hướng chính' })).toBeVisible()
    await expect(bar.getByRole('link', { name: 'Tài khoản' })).toBeVisible()
    await expect(bar.getByRole('link', { name: 'Đăng xuất' })).toBeVisible()

    const boxes = await Promise.all(
      [
        bar.getByLabel('Trang chính'),
        bar.getByRole('navigation', { name: 'Điều hướng chính' }),
        bar.getByRole('link', { name: 'Tài khoản' }),
      ].map((locator) => locator.boundingBox()),
    )
    const xs = boxes.map((box) => box!.x)
    expect(xs[0]).toBeLessThan(xs[1])
    expect(xs[1]).toBeLessThan(xs[2])
  })

  test('exactly one account control exists on the page', async () => {
    await page.goto(`${serverURL}/admin/collections/media`)
    await expect(page.locator('.collection-list')).toBeVisible()

    // Payload's own, in AppHeader, is hidden — two on a page is worse than none.
    await expect(page.locator('.app-header__account')).toBeHidden()
    await expect(page.locator(`a[href="/admin/account"]:visible`)).toHaveCount(1)
  })

  test('lists every quyển and never chủ đề', async () => {
    await page.goto(`${serverURL}/admin`)
    const nav = page.getByRole('navigation', { name: 'Điều hướng chính' })

    await expect(nav.getByRole('link', { name: 'Quyển 1' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Quyển 2' })).toBeVisible()
    await expect(nav.getByRole('link', { name: 'Luyện nói' })).toBeVisible()
    await expect(nav.getByRole('link', { name: /Chủ đề/i })).toHaveCount(0)
    await expect(nav.locator('a[href*="chu-de"]')).toHaveCount(0)
  })

  test('following a quyển entry opens that quyển', async () => {
    await page.goto(`${serverURL}/admin`)
    await page
      .getByRole('navigation', { name: 'Điều hướng chính' })
      .getByRole('link', { name: 'Quyển 1' })
      .click()

    await expect(page).toHaveURL(/\/admin\/collections\/quyen\/\d+/)
    await expect(page.getByText('Chủ đề', { exact: true }).first()).toBeVisible()
  })

  test('a chủ đề is reachable from its quyển card and from its own address', async () => {
    await page.goto(`${serverURL}/admin/collections/quyen/${content.quyenID}`)

    const card = page.getByRole('link', { name: 'Chào hỏi' })
    await expect(card).toBeVisible()
    await card.click()
    await expect(page).toHaveURL(new RegExp(`/admin/collections/chu-de/${content.chuDeID}`))
    await expect(page.locator('.document-fields')).toBeVisible()

    // And straight to the address, the way a bookmark would.
    await page.goto(`${serverURL}/admin/collections/chu-de/${content.chuDeID}`)
    await expect(page.locator('.document-fields')).toBeVisible()
    await expect(page.getByTestId('ttv-top-bar')).toHaveCount(1)
  })

  test('the breadcrumb trail still names the path to a chủ đề', async () => {
    await page.goto(`${serverURL}/admin/collections/chu-de/${content.chuDeID}`)
    const trail = page.locator('.app-header .step-nav, .step-nav').first()

    await expect(trail).toBeVisible()
    await expect(trail).toContainText('Chào hỏi')
  })

  test('content sits on a card, centred, narrower than a wide viewport', async () => {
    await page.goto(`${serverURL}/admin/collections/chu-de/${content.chuDeID}`)
    const card = page.locator('.document-fields')
    await expect(card).toBeVisible()

    const viewport = page.viewportSize()!
    const box = (await card.boundingBox())!
    const computed = await card.evaluate((element) => {
      const style = getComputedStyle(element as Element)
      return { margin: `${style.marginLeft}/${style.marginRight}`, maxWidth: style.maxWidth }
    })
    const where = `viewport ${viewport.width}, card x=${Math.round(box.x)} w=${Math.round(
      box.width,
    )}, max-width ${computed.maxWidth}, margin ${computed.margin}`

    expect(box.width, where).toBeLessThan(viewport.width - 40)
    // Centred: the ground shows on both sides, and by roughly the same amount.
    const leftGap = box.x
    const rightGap = viewport.width - (box.x + box.width)
    expect(leftGap, where).toBeGreaterThan(10)
    expect(rightGap, where).toBeGreaterThan(10)
    expect(Math.abs(leftGap - rightGap), where).toBeLessThan(24)
  })

  test('no view scrolls the page sideways', async () => {
    for (const [, path] of screens) {
      await page.goto(`${serverURL}${path}`)
      const overflows = await page.evaluate(
        () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
      )
      expect(overflows, `${path} should not scroll horizontally`).toBe(false)
    }
  })

  test('the sign-in screen carries the school rather than the framework', async ({ browser }) => {
    const anonymous = await (await browser.newContext()).newPage()
    try {
      await anonymous.goto(`${serverURL}/admin/login`)
      // Once, not twice: Payload's login view renders `graphics.Logo`, so `beforeLogin` adds
      // only the line under it.
      await expect(anonymous.getByText('Trường Tiếng Việt')).toHaveCount(1)
      await expect(anonymous.getByText('Trường Tiếng Việt')).toBeVisible()
      await expect(anonymous.getByText('Trang quản lý nội dung học tập')).toBeVisible()
      await expect(anonymous).toHaveTitle(/Trường Tiếng Việt Của Em/)
    } finally {
      await anonymous.close()
    }
  })

  test('the browser tab carries the school’s icon and title suffix', async () => {
    await page.goto(`${serverURL}/admin`)
    await expect(page).toHaveTitle(/Trường Tiếng Việt Của Em$/)
    await expect(page.locator('link[rel="icon"][href*="brand"]')).toHaveCount(1)
  })
})
