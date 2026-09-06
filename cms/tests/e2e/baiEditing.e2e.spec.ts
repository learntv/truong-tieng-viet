import { expect, test, type BrowserContext, type Locator, type Page } from '@playwright/test'

import { EXPECTED_EMPTY_BAI, EXPECTED_EMPTY_PER_CHANG } from '../fixtures/chuDeTree'
import { login } from '../helpers/login'
import { seedChuDe, type SeededContent } from '../helpers/seedContent'
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'
import { serverURL } from '../helpers/serverURL'

/**
 * The journeys the bai-editing and content-gaps specs describe, walked end to end.
 *
 * The fixture is the same tree the integration tests count against, so what a test reads off
 * the screen and what the endpoint computes are being held to one source — if the browser and
 * the server ever disagree about what "holds nothing" means, these numbers stop matching.
 */
test.describe('Bài editing', () => {
  let content: SeededContent
  let context: BrowserContext
  let page: Page

  /** Every row's name, in order. */
  const namesIn = (list: Locator): Promise<string[]> =>
    list
      .locator('ol > li input')
      .evaluateAll((inputs) => (inputs as HTMLInputElement[]).map((input) => input.value))

  /**
   * The row whose bài is named `name`.
   *
   * Not `filter({ hasText })`: a bài's name lives in an `<input>`'s value, which is not text
   * content, so a text filter matches nothing — and matches it *silently*, which would make an
   * assertion like "this row shows no video indication" pass against no row at all.
   */
  const rowNamed = async (list: Locator, name: string): Promise<Locator> => {
    const index = (await namesIn(list)).indexOf(name)
    expect(index, `no bài named "${name}" in this list`).toBeGreaterThanOrEqual(0)
    return list.locator('ol > li').nth(index)
  }

  /**
   * Clicks a chặng tab and waits for it to actually become the selected one.
   *
   * The click is retried, not just the assertion. A tab's select button is in the
   * server-rendered HTML before React attaches its handler, so a click that lands during
   * hydration is swallowed — and it is swallowed *silently*, because the click itself
   * succeeds. Selecting a tab has no effect other than React state, so there is nothing else
   * to wait on; re-clicking until the tab reports itself selected is the only honest way.
   */
  const selectTab = async (tab: Locator): Promise<void> => {
    await expect(async () => {
      await tab.getByRole('button').first().click()
      await expect(tab).toHaveAttribute('aria-selected', 'true', { timeout: 1_000 })
    }).toPass({ timeout: 20_000 })
  }

  /** Loads the chủ đề and selects one of its chặng tabs. */
  const openChang = async (index: number) => {
    await page.goto(`${serverURL}/admin/collections/chu-de/${content.chuDeID}`)
    await expect(page.locator('[data-testid="bai-list"]').first()).toBeVisible()
    if (index === 0) return

    await selectTab(page.getByRole('tab').nth(index))
  }

  test.beforeAll(async ({ browser }) => {
    await seedTestUser()
    content = await seedChuDe()
    context = await browser.newContext({ viewport: { height: 1000, width: 1600 } })
    // Signing in once puts the session cookie on the context, so every page below is already
    // authenticated.
    const first = await context.newPage()
    await login({ page: first, user: testUser })
    await first.close()
  })

  /*
   * A fresh page per test.
   *
   * These tests edit the document and never save it, and Payload registers a `beforeunload`
   * guard the moment a form is modified. Reusing one page means the next test's `page.goto` is
   * cancelled by that guard — Playwright dismisses the prompt, and dismissing it is what keeps
   * you on the page — so the test then runs against the previous test's half-edited document
   * while reporting something else entirely. Every test here assumes the stored fixture; a new
   * page is what gives it to them.
   */
  test.beforeEach(async () => {
    page = await context.newPage()
  })

  test.afterEach(async () => {
    await page.close()
  })

  test.afterAll(async () => {
    await context?.close()
    // Optional-chained: when `beforeAll` failed there is nothing to clean, and throwing here
    // would bury the error that actually mattered.
    await content?.cleanup()
    await cleanupTestUser()
  })

  test('every bài is visible at once, numbered, with nothing to open', async () => {
    await openChang(0)

    // Chặng 1 of the fixture: three bài under "Nghe và nhắc lại", two under "Luyện tập".
    const first = page.locator('[data-testid="bai-list"]').first().locator('ol > li')
    await expect(first).toHaveCount(3)
    await expect(first.first()).toBeVisible()
    await expect(first.nth(2)).toBeVisible()

    // Numbered by position within the nội dung — the second list starts again at 1.
    const second = page.locator('[data-testid="bai-list"]').nth(1).locator('ol > li')
    await expect(second.first()).toContainText('1')

    // Nothing is a collapsible: no row has a toggle to open.
    await expect(page.locator('[data-testid="bai-list"] .collapsible__toggle')).toHaveCount(0)
  })

  test('two bài sharing a name are told apart from their rows alone', async () => {
    await openChang(0)
    const list = page.locator('[data-testid="bai-list"]').first()
    const names = await namesIn(list)

    // All three bài in this nội dung carry the same name — which is the situation the whole
    // change exists for.
    expect(names.filter((name) => name === 'Nhìn hình, nghe và nhắc lại')).toHaveLength(3)

    // The first two hold different hình; the third holds nothing. The rows differ anyway,
    // without opening any of them.
    await expect(list.locator('ol > li img')).toHaveCount(2)
    const sources = await list
      .locator('ol > li img')
      .evaluateAll((images) => (images as HTMLImageElement[]).map((image) => image.getAttribute('src')))
    expect(new Set(sources).size).toBe(2)
  })

  test('a row shows one indication per attachment that is set, and none for one that is not', async () => {
    await openChang(1)
    const list = page.locator('[data-testid="bai-list"]').first()

    const link = await rowNamed(list, 'Trò chơi Wordwall')
    await expect(link.locator('[data-mark="link"]')).toHaveCount(1)
    await expect(link.locator('[data-mark="audio"]')).toHaveCount(0)
    await expect(link.locator('[data-mark="video"]')).toHaveCount(0)

    const video = await rowNamed(list, 'Xem video')
    await expect(video.locator('[data-mark="video"]')).toHaveCount(1)
    await expect(video.locator('[data-mark="link"]')).toHaveCount(0)
  })

  test('a bài that holds nothing is marked, and one with only a link is not', async () => {
    await openChang(1)
    const list = page.locator('[data-testid="bai-list"]').first()

    const nothing = await rowNamed(list, 'Chưa có gì')
    await expect(nothing.locator('[data-mark="empty"]')).toHaveCount(1)

    const onlyALink = await rowNamed(list, 'Trò chơi Wordwall')
    await expect(onlyALink.locator('[data-mark="empty"]')).toHaveCount(0)
  })

  test('renaming from the row leaves the row where it is', async () => {
    await openChang(0)
    const list = page.locator('[data-testid="bai-list"]').first()
    const third = list.locator('ol > li').nth(2)
    const name = third.locator('input').first()

    await name.fill('Bài đã đổi tên')
    await expect(name).toHaveValue('Bài đã đổi tên')
    // Same position, same list length, still the third row.
    await expect(list.locator('ol > li')).toHaveCount(3)
    await expect(list.locator('ol > li').nth(2).locator('input').first()).toHaveValue('Bài đã đổi tên')
  })

  test('moving a bài renumbers it and the rows it passed', async () => {
    await openChang(0)
    const list = page.locator('[data-testid="bai-list"]').first()
    const namesBefore = await namesIn(list)

    // "Move up" on the third row.
    await list.locator('ol > li').nth(2).getByRole('button', { name: 'Chuyển lên' }).click()

    const namesAfter = await namesIn(list)
    expect(namesAfter[1]).toBe(namesBefore[2])
    expect(namesAfter[2]).toBe(namesBefore[1])
  })

  test('move up on the first bài is unavailable', async () => {
    await openChang(0)
    const list = page.locator('[data-testid="bai-list"]').first()
    await expect(list.locator('ol > li').first().getByRole('button', { name: 'Chuyển lên' })).toBeDisabled()
  })

  test('duplicating produces an independent copy directly below', async () => {
    await openChang(0)
    const list = page.locator('[data-testid="bai-list"]').first()
    const before = await list.locator('ol > li').count()

    // The first bài: two hình are not in the fixture, but it has a captioned hình, which is
    // the subtree that has to come across.
    const sourceImage = await list.locator('ol > li').first().locator('img').getAttribute('src')
    await list.locator('ol > li').first().getByRole('button', { name: 'Nhân đôi' }).click()

    await expect(list.locator('ol > li')).toHaveCount(before + 1)
    const copy = list.locator('ol > li').nth(1)
    await expect(copy.locator('img')).toHaveAttribute('src', sourceImage!)

    // Independent: renaming the copy leaves the original alone.
    const originalName = await list.locator('ol > li').first().locator('input').first().inputValue()
    await copy.locator('input').first().fill('Bản sao')
    await expect(list.locator('ol > li').first().locator('input').first()).toHaveValue(originalName)
    await expect(copy.locator('input').first()).toHaveValue('Bản sao')
  })

  test('deleting asks for confirmation first', async () => {
    await openChang(0)
    const list = page.locator('[data-testid="bai-list"]').first()
    const before = await list.locator('ol > li').count()

    // Declining leaves the list alone.
    page.once('dialog', (dialog) => void dialog.dismiss())
    await list.locator('ol > li').first().getByRole('button', { name: 'Xoá bài' }).click()
    await expect(list.locator('ol > li')).toHaveCount(before)

    page.once('dialog', (dialog) => void dialog.accept())
    await list.locator('ol > li').first().getByRole('button', { name: 'Xoá bài' }).click()
    await expect(list.locator('ol > li')).toHaveCount(before - 1)
  })

  test('a new bài lands at the end, marked as holding nothing, ready to type into', async () => {
    await openChang(0)
    const list = page.locator('[data-testid="bai-list"]').first()
    const before = await list.locator('ol > li').count()

    await list.getByRole('button', { name: 'Thêm bài' }).click()
    await expect(list.locator('ol > li')).toHaveCount(before + 1)

    const added = list.locator('ol > li').last()
    await expect(added.locator('[data-mark="empty"]')).toHaveCount(1)
    await added.locator('input').first().fill('Bài mới')
    await expect(added.locator('input').first()).toHaveValue('Bài mới')
  })

  test('opening a bài’s detail and closing returns to the same list, in the same order', async () => {
    await openChang(0)
    const list = page.locator('[data-testid="bai-list"]').first()
    const namesBefore = await namesIn(list)
    const scrollBefore = await page.evaluate(() => window.scrollY)

    // Payload's Drawer renders through @faceless-ui/modal, not a <dialog>; `.drawer__header`
    // is the part it always draws, whatever the bài's own fields render below it.
    const drawer = page.locator('.drawer__header').first()
    // Retried for the same reason `selectTab` retries: opening a drawer is React state and
    // nothing else, so a click swallowed during hydration leaves no trace to wait on.
    await expect(async () => {
      await list.locator('ol > li').first().getByRole('button', { name: /^Chi tiết bài / }).click()
      await expect(drawer).toBeVisible({ timeout: 1_000 })
    }).toPass({ timeout: 20_000 })
    // The list is not reordered or collapsed behind it — it is still the same rows.
    await expect(list.locator('ol > li')).toHaveCount(namesBefore.length)

    await page.keyboard.press('Escape')
    await expect(drawer).toBeHidden()

    const namesAfter = await namesIn(list)
    expect(namesAfter).toEqual(namesBefore)
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore)
  })

  test('the empty marker clears the instant a hình arrives, before saving', async () => {
    await openChang(0)
    const list = page.locator('[data-testid="bai-list"]').first()

    // Pinned to an index, not left as `filter({ has: [data-mark="empty"] })`: a filtered
    // locator re-resolves every time it is used, so the moment the marker clears it would stop
    // pointing at the row under test — and the assertions after it would silently be about
    // some other row, or none.
    const marks = await list
      .locator('ol > li')
      .evaluateAll((items) => items.map((item) => item.querySelector('[data-mark="empty"]') !== null))
    const emptyIndex = marks.indexOf(true)
    expect(emptyIndex, 'this chặng should hold a bài with nothing in it').toBeGreaterThanOrEqual(0)

    const empty = list.locator('ol > li').nth(emptyIndex)
    await expect(empty.locator('[data-mark="empty"]')).toHaveCount(1)

    const chooser = page.waitForEvent('filechooser')
    await empty.getByRole('button', { name: 'Chọn hình cho bài này' }).click()
    await (await chooser).setFiles({
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64',
      ),
      mimeType: 'image/png',
      name: 'chon-tu-hang.png',
    })

    // No save in between: the marker goes as soon as the hình is in form state.
    await expect(empty.locator('[data-mark="empty"]')).toHaveCount(0)
    await expect(empty.locator('img')).toBeVisible()
  })

  test('one media request per chặng, not one per bài row', async () => {
    const mediaRequests: string[] = []
    const listen = (url: string) => {
      if (/\/api\/media\?/.test(url)) mediaRequests.push(url)
    }
    page.on('request', (request) => listen(request.url()))

    try {
      await openChang(0)
      await expect(page.locator('[data-testid="bai-list"] ol > li img').first()).toBeVisible()
      const afterFirst = mediaRequests.length
      expect(afterFirst).toBeGreaterThan(0)
      // Chặng 1 holds five bài across two nội dung; a per-row fetch would be at least five.
      expect(afterFirst).toBeLessThanOrEqual(2)

      await page.getByRole('tab').nth(1).getByRole('button').first().click()
      await expect(page.locator('[data-testid="bai-list"]').first()).toBeVisible()
      expect(mediaRequests.length - afterFirst).toBeLessThanOrEqual(2)
    } finally {
      page.removeAllListeners('request')
    }
  })
})

/**
 * Walking quyển card → chặng tab → the bài that holds nothing, using only the counts.
 */
test.describe('Content gaps', () => {
  let content: SeededContent
  let context: BrowserContext
  let page: Page

  test.beforeAll(async ({ browser }) => {
    await seedTestUser()
    content = await seedChuDe()
    context = await browser.newContext({ viewport: { height: 1000, width: 1600 } })
    // Signing in once puts the session cookie on the context, so every page below is already
    // authenticated.
    const first = await context.newPage()
    await login({ page: first, user: testUser })
    await first.close()
  })

  // A fresh page per test, for the same reason as above: the count test fills a bài and never
  // saves, and an unsaved form blocks the next navigation.
  test.beforeEach(async () => {
    page = await context.newPage()
  })

  test.afterEach(async () => {
    await page.close()
  })

  test.afterAll(async () => {
    await context?.close()
    // Optional-chained: when `beforeAll` failed there is nothing to clean, and throwing here
    // would bury the error that actually mattered.
    await content?.cleanup()
    await cleanupTestUser()
  })

  test('the quyển’s chủ đề card carries its count', async () => {
    await page.goto(`${serverURL}/admin/collections/quyen/${content.quyenID}`)
    const card = page.getByRole('link', { name: /Chào hỏi/ })
    await expect(card).toBeVisible()
    await expect(card).toContainText(`${EXPECTED_EMPTY_BAI} bài chưa có gì`)
  })

  test('following the card, the chặng tabs carry theirs — and a chặng with none shows no zero', async () => {
    await page.goto(`${serverURL}/admin/collections/quyen/${content.quyenID}`)
    await page.getByRole('link', { name: /Chào hỏi/ }).click()
    await expect(page.locator('[data-testid="bai-list"]').first()).toBeVisible()

    const tabs = page.getByRole('tab')
    for (const [index, expected] of EXPECTED_EMPTY_PER_CHANG.entries()) {
      const tab = tabs.nth(index)
      if (expected === 0) {
        await expect(tab).not.toContainText('0')
      } else {
        await expect(tab).toContainText(String(expected))
      }
    }
  })

  test('the chặng count clears before saving, when the last empty bài is filled', async () => {
    await page.goto(`${serverURL}/admin/collections/chu-de/${content.chuDeID}`)
    await expect(page.locator('[data-testid="bai-list"]').first()).toBeVisible()

    // Chặng 4 of the fixture holds exactly one bài, and it holds nothing.
    const lastTab = page.getByRole('tab').nth(3)
    await expect(lastTab).toContainText('1')
    // Retried until it takes: the tab's button is in the HTML before React attaches to it, and
    // the previous chặng's rows stay on screen until the panel swaps, so there is nothing else
    // to wait on.
    await expect(async () => {
      await lastTab.getByRole('button').first().click()
      await expect(lastTab).toHaveAttribute('aria-selected', 'true', { timeout: 1_000 })
    }).toPass({ timeout: 20_000 })

    const empty = page.locator('[data-testid="bai-list"] ol > li').first()
    await expect(empty.locator('[data-mark="empty"]')).toHaveCount(1)

    const chooser = page.waitForEvent('filechooser')
    await empty.getByRole('button', { name: 'Chọn hình cho bài này' }).click()
    await (await chooser).setFiles({
      buffer: Buffer.from(
        'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        'base64',
      ),
      mimeType: 'image/png',
      name: 'lap-cho-trong.png',
    })

    await expect(empty.locator('[data-mark="empty"]')).toHaveCount(0)
    // The tab's count goes with it — no save in between.
    await expect(page.getByRole('tab').nth(3)).not.toContainText('1')
  })

  test('opening a quyển does not transfer the content tree', async () => {
    const chuDeRequests: string[] = []
    page.on('request', (request) => {
      const url = request.url()
      if (/\/api\/chu-de\?/.test(url)) chuDeRequests.push(url)
    })

    try {
      await page.goto(`${serverURL}/admin/collections/quyen/${content.quyenID}`)
      await expect(page.getByRole('link', { name: /Chào hỏi/ })).toBeVisible()

      expect(chuDeRequests.length).toBeGreaterThan(0)
      for (const url of chuDeRequests) {
        // `select[title]` and nothing else: the chặng → nội dung → bài → hình tree is never
        // asked for, which is the whole reason the counts come from their own endpoint.
        expect(url).toContain('select%5Btitle%5D=true')
        expect(url).not.toContain('changs')
      }
    } finally {
      page.removeAllListeners('request')
    }
  })
})
