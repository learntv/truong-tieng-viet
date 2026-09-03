import { expect, test } from '@playwright/test'

import { adminURL } from '../helpers/serverURL'

/**
 * A deliberately narrow smoke test. Its job is to fail loudly if a Payload upgrade
 * reverts the skin — not to police pixels. It runs on the login screen so it needs
 * no authenticated session.
 */
test.describe('Admin theme', () => {
  test('brand tokens and Arimo are applied', async ({ page }) => {
    await page.goto(adminURL('/login'))

    const tokens = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement)
      return {
        blue500: root.getPropertyValue('--ttv-blue-500').trim(),
        amber700: root.getPropertyValue('--ttv-amber-700').trim(),
        base0: root.getPropertyValue('--color-base-0').trim(),
        fontFamily: getComputedStyle(document.body).fontFamily,
        rootFontSize: root.fontSize,
      }
    })

    expect(tokens.blue500).toBe('#006cb4')
    expect(tokens.amber700).toBe('#8c5500')
    expect(tokens.base0).toBe('#ffffff')
    expect(tokens.rootFontSize).toBe('15px')

    expect(tokens.fontFamily).toContain('Arimo')
    // Regression guard: a literal Arial makes browsers synthesize bold from a
    // substitute face that drops Vietnamese diacritics.
    expect(tokens.fontFamily).not.toContain('Arial')
  })

  test('the primary button carries the brand blue', async ({ page }) => {
    await page.goto(adminURL('/login'))

    const button = page.locator('button[type="submit"]').first()
    await expect(button).toBeVisible()

    // rgb(0, 108, 180) is #006cb4.
    await expect(button).toHaveCSS('background-color', 'rgb(0, 108, 180)')
  })
})
