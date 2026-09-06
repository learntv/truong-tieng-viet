import { expect, test, type Page } from '@playwright/test'

import { contrastRatio, indicationColours, paintedColours } from '../helpers/contrast'
import { login } from '../helpers/login'
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'
import { serverURL } from '../helpers/serverURL'

/**
 * The palette, measured on a screen this project wrote no components for.
 *
 * The media library list is the point: substituting `--color-base-*` repaints screens nobody
 * here will ever open a file for, and the risk that buys is a framework component pairing two
 * tokens whose new values fall below AA. Asserting on our own screens would not catch that, so
 * this asserts on Payload's.
 */
test.describe('Visual identity', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    await seedTestUser()
    page = await (await browser.newContext()).newPage()
    await login({ page, user: testUser })
    await page.goto(`${serverURL}/admin/collections/media`)
    await expect(page.locator('.collection-list')).toBeVisible()
  })

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('body text clears 4.5:1 against what is painted behind it', async () => {
    const { background, color } = await paintedColours(page.locator('body'))
    expect(contrastRatio(color, background)).toBeGreaterThanOrEqual(4.5)
  })

  test('the list view’s own text clears 4.5:1', async () => {
    const heading = page.locator('.collection-list h1, .collection-list h2, .list-header').first()
    await expect(heading).toBeVisible()

    const { background, color } = await paintedColours(heading)
    expect(contrastRatio(color, background)).toBeGreaterThanOrEqual(4.5)
  })

  test('focus indication clears 3:1 against the control’s own background', async () => {
    // The list's search box: a framework-owned control, focusable with the keyboard, and one
    // that exists on every collection list.
    const search = page.locator('.search-filter input, input[type="search"], input[type="text"]').first()
    await expect(search).toBeVisible()
    await search.focus()

    const { background, boxShadow, outlineColor } = await paintedColours(search)
    const indications = indicationColours(boxShadow, outlineColor)
    expect(indications.length, 'a focused control should paint an outline or a ring').toBeGreaterThan(0)

    const best = Math.max(...indications.map((rgb) => contrastRatio(rgb, background)))
    expect(best).toBeGreaterThanOrEqual(3)
  })

  test('the page ground and the card surface are different colours', async () => {
    const ground = await paintedColours(page.locator('.template-default__wrap'))
    const card = await paintedColours(page.locator('.collection-list'))

    expect(card.background).not.toEqual(ground.background)
  })

  test('the panel stays light when the operating system asks for dark', async ({ browser }) => {
    const darkPage = await (await browser.newContext({ colorScheme: 'dark' })).newPage()
    try {
      await login({ page: darkPage, user: testUser })
      await darkPage.goto(`${serverURL}/admin/collections/media`)
      await expect(darkPage.locator('.collection-list')).toBeVisible()

      // The card is the panel's white surface in the light palette; a dark theme would paint
      // it near-black, so its luminance is the thing to assert on.
      const { background } = await paintedColours(darkPage.locator('.collection-list'))
      expect(contrastRatio(background, [0, 0, 0])).toBeGreaterThan(10)
      await expect(darkPage.locator('html')).toHaveAttribute('data-theme', 'light')
    } finally {
      await darkPage.close()
    }
  })

  test('no font is requested from an outside origin', async ({ browser }) => {
    const fontPage = await (await browser.newContext()).newPage()
    const outside: string[] = []
    fontPage.on('request', (request) => {
      const url = request.url()
      if (!url.startsWith(serverURL) && /\.(woff2?|ttf|otf)(\?|$)|fonts\.(googleapis|gstatic)/.test(url)) {
        outside.push(url)
      }
    })

    try {
      await login({ page: fontPage, user: testUser })
      await fontPage.goto(`${serverURL}/admin/collections/media`)
      await expect(fontPage.locator('.collection-list')).toBeVisible()
      expect(outside).toEqual([])
    } finally {
      await fontPage.close()
    }
  })

  test('body text is set in the self-hosted face, not a synthesised fallback', async () => {
    const fontFamily = await page
      .locator('body')
      .evaluate((element) => getComputedStyle(element as Element).fontFamily)

    // `next/font` mangles the family name per build, so the assertion is on what must NOT be
    // there: Arial, whose absence is what makes a browser synthesise bold from a substitute
    // face that drops the precomposed Vietnamese marks.
    expect(fontFamily).toMatch(/Arimo/i)
    expect(fontFamily).not.toMatch(/(^|[\s,'"])Arial([\s,'"]|$)/i)
  })

  test('the spacing unit did not drift when the root size changed', async () => {
    const { basePx, root } = await page.evaluate(() => {
      // A custom property computes to its token sequence, so reading `--base` back gives the
      // literal "calc(…)" string. Resolving it means putting it on a real length property and
      // asking for that.
      const probe = document.createElement('div')
      probe.style.position = 'absolute'
      probe.style.width = 'var(--base)'
      document.body.appendChild(probe)
      const basePx = getComputedStyle(probe).width
      probe.remove()

      return { basePx, root: getComputedStyle(document.documentElement).fontSize }
    })

    expect(root).toBe('15px')
    // 20px — exactly what it was at Payload's 13px root. `--base-body-size` is pinned to the
    // new root size on purpose, so raising the type size does not silently respace every
    // screen along with it.
    expect(Number.parseFloat(basePx)).toBeCloseTo(20, 1)
  })
})
