import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { currentQuestion, expectHeading, openChapter11FromDashboard } from './helpers.ts'

/** Runs the axe accessibility checker for WCAG 2.1 A and AA rules, including color contrast. */
async function expectNoViolations(page: Page) {
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze()
  const summary = results.violations.map((v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(' ')).join(', ')})`)
  expect(summary).toEqual([])
}

test.describe('automated accessibility checks', () => {
  // One engine is enough for axe; layout differences are covered by the other tests.
  test.skip(({ browserName }) => browserName !== 'chromium', 'axe runs once, in Chromium')

  test('every screen passes WCAG 2.1 AA checks, before and after studying', async ({ page }) => {
    for (const [path, heading] of [
      ['/', '오늘의 공부'],
      ['/learn', 'Chapters'],
      ['/learn?book=2', 'Chapters'],
      ['/practice/mistakes', 'Mistakes'],
      ['/settings', 'Settings'],
      ['/does-not-exist', 'Page not found'],
    ] as const) {
      await page.goto(path)
      await expectHeading(page, heading)
      await expectNoViolations(page)
    }

    await openChapter11FromDashboard(page)
    await expectNoViolations(page)

    await page.getByRole('button', { name: 'Start practice exam' }).first().click()
    await expect(currentQuestion(page)).toBeVisible()
    await currentQuestion(page).locator('label').first().click()
    await expectNoViolations(page)

    await page.getByRole('button', { name: 'Submit quiz' }).click()
    await expect(page.getByRole('dialog')).toBeVisible()
    await expectNoViolations(page)
    await page.getByRole('dialog').getByRole('button', { name: /^Submit/ }).click()
    await expectHeading(page, 'Results')
    await expectNoViolations(page)

    await page.goto('/practice/mistakes')
    await expectHeading(page, 'Mistakes')
    await expectNoViolations(page)

    await page.goto('/')
    await expectHeading(page, '오늘의 공부')
    await expectNoViolations(page)
  })
})

/**
 * Safari on a Mac moves Tab between text fields only, unless the learner presses Option+Tab
 * or turns on "Press Tab to highlight each item" in Safari's settings. WebKit tests do the same.
 */
function tabKey(browserName: string) {
  return browserName === 'webkit' ? 'Alt+Tab' : 'Tab'
}

test('a quiz can be taken with the keyboard alone', async ({ page, isMobile, browserName }) => {
  test.skip(isMobile, 'phones have no hardware keyboard')
  await openChapter11FromDashboard(page)

  // Reach the start button with the keyboard.
  await page.getByRole('button', { name: 'Start practice exam' }).first().focus()
  await page.keyboard.press('Enter')
  await expect(currentQuestion(page)).toHaveAccessibleName(/^1\./)

  // 1–4 choose, → moves on.
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press(String((i % 4) + 1))
    if (i < 9) await page.keyboard.press('ArrowRight')
  }
  await expect(page.getByText('10 of 10 answered')).toBeVisible()

  // The dialog starts on the safe choice; Tab reaches Submit; Enter confirms.
  await page.getByRole('button', { name: 'Submit quiz' }).focus()
  await page.keyboard.press('Enter')
  const dialog = page.getByRole('dialog', { name: 'Submit your quiz?' })
  await expect(dialog.getByRole('button', { name: 'Go back' })).toBeFocused()
  await page.keyboard.press(tabKey(browserName))
  await expect(dialog.getByRole('button', { name: 'Submit quiz' })).toBeFocused()
  await page.keyboard.press('Enter')
  await expectHeading(page, 'Results')
})

test('keyboard users see where focus is and can skip to content', async ({ page, isMobile, browserName }) => {
  test.skip(isMobile, 'phones have no hardware keyboard')
  await page.goto('/')
  await expectHeading(page, '오늘의 공부')
  await page.keyboard.press(tabKey(browserName))
  const skip = page.getByRole('link', { name: 'Skip to content' })
  await expect(skip).toBeFocused()
  await expect(skip).toBeInViewport()
  const outline = await skip.evaluate((el) => getComputedStyle(el).outlineStyle)
  expect(outline).toBe('solid')
})
