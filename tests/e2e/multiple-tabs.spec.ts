import { expect, test } from '@playwright/test'
import { expectHeading, takeQuickExam } from './helpers.ts'

/**
 * Two tabs of the app in the same browser share one saved copy of progress.
 * An old tab must never erase work finished in another tab (a "lost update").
 */
test('an old tab does not erase a quiz finished in another tab', async ({ context, page }) => {
  // Tab A opens first, before any quiz exists, and is then left alone.
  await page.goto('/settings')
  await expectHeading(page, 'Settings')
  await expect(page.getByText(/This browser has 0 quizzes/)).toBeVisible()

  // Tab B takes a whole exam.
  const tabB = await context.newPage()
  await takeQuickExam(tabB)

  // Tab A notices without a reload, because the browser tells it another tab saved.
  await expect(page.getByText(/This browser has 1 quiz and 10 answers/)).toBeVisible()

  // The learner then uses the old tab. Its save must keep tab B's quiz.
  await page.getByRole('link', { name: 'Learn' }).first().click()
  await page.getByRole('link', { name: '집안일' }).first().click()
  await expectHeading(page, '집안일')

  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('hangul-lab:learner-data')!))
  expect(saved.sessions).toHaveLength(1)
  expect(saved.attempts).toHaveLength(10)
  expect(saved.chapterVisits.ch11).toBeDefined()
})
