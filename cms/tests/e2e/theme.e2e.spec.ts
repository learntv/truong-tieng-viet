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

      // Resolve custom properties through the browser to their canonical rgb form.
      // Minified stylesheets may rewrite hex literals (e.g. #ffffff → #fff), so the
      // test compares resolved colours, not token text — its job is to detect a
      // reverted skin, not to police the minifier.
      const resolve = (token: string) => {
        const probe = document.createElement('span')
        probe.style.color = root.getPropertyValue(token).trim()
        document.body.appendChild(probe)
        const resolved = getComputedStyle(probe).color
        probe.remove()
        return resolved
      }

      return {
        blue500: resolve('--ttv-blue-500'),
        amber700: resolve('--ttv-amber-700'),
        base0: resolve('--color-base-0'),
        fontFamily: getComputedStyle(document.body).fontFamily,
        rootFontSize: root.fontSize,
      }
    })

    expect(tokens.blue500).toBe('rgb(0, 108, 180)')
    expect(tokens.amber700).toBe('rgb(140, 85, 0)')
    expect(tokens.base0).toBe('rgb(255, 255, 255)')
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
