import { expect, test } from '@playwright/test'
import { chooseAnswer, currentQuestion, expectHeading, openChapter11FromDashboard, submitQuiz } from './helpers.ts'

test('core quizzes work with no internet connection and no AI', async ({ page, context }) => {
  await page.goto('/')
  await expectHeading(page, '오늘의 공부')
  await page.evaluate(() => document.fonts.ready)
  // The app downloads your current chapter in the background as soon as it opens.
  // Wait for that, like a learner who opened the app before losing their connection.
  await page.waitForLoadState('networkidle')

  // From here on, every network request fails.
  await context.setOffline(true)

  await page.getByRole('link', { name: 'Open Chapter 11' }).click()
  await expectHeading(page, '집안일')
  await page.getByRole('button', { name: 'Start practice exam' }).first().click()
  await chooseAnswer(page, 0)
  await expect(currentQuestion(page)).toBeVisible()
  await submitQuiz(page)
  await expect(page.getByRole('region', { name: 'Score' })).toContainText('/ 10')
})

test('a chapter that could not be downloaded explains itself and can be retried', async ({ page, context }) => {
  // Block only the chapter file, so the rest of the app loads normally.
  await context.route(/chapter-11-[^/]*\.js$/, (route) => route.abort())
  await page.goto('/learn/11')
  await expect(page.getByRole('alert')).toContainText("couldn't be loaded")

  await context.unroute(/chapter-11-[^/]*\.js$/)
  await page.getByRole('button', { name: 'Try again' }).click()
  await expectHeading(page, '집안일')
})

test('the app never contacts another website', async ({ page }) => {
  const outside: string[] = []
  page.on('request', (request) => {
    const url = new URL(request.url())
    if (url.hostname !== 'localhost' && url.protocol !== 'data:' && url.protocol !== 'blob:') outside.push(request.url())
  })

  await openChapter11FromDashboard(page)
  await page.getByRole('button', { name: 'Start practice exam' }).first().click()
  await submitQuiz(page)
  await page.goto('/practice/mistakes')
  await page.goto('/settings')
  await expectHeading(page, 'Settings')

  expect(outside).toEqual([])
})
