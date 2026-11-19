import { expect, test } from '@playwright/test'
import { chooseAnswer, currentQuestion, expectHeading, openChapter11FromDashboard, submitQuiz } from './helpers.ts'

test('core quizzes work with no internet connection and no AI', async ({ page, context }) => {
  await page.goto('/')
  await expectHeading(page, '오늘의 공부')
  await page.evaluate(() => document.fonts.ready)

  // From here on, every network request fails.
  await context.setOffline(true)

  await page.getByRole('link', { name: 'Open Chapter 11' }).click()
  await expectHeading(page, '집안일')
  await page.getByRole('button', { name: 'Start practice exam' }).click()
  await chooseAnswer(page, 0)
  await expect(currentQuestion(page)).toBeVisible()
  await submitQuiz(page)
  await expect(page.getByRole('region', { name: 'Score' })).toContainText('/ 10')
})

test('the app never contacts another website', async ({ page }) => {
  const outside: string[] = []
  page.on('request', (request) => {
    const url = new URL(request.url())
    if (url.hostname !== 'localhost' && url.protocol !== 'data:' && url.protocol !== 'blob:') outside.push(request.url())
  })

  await openChapter11FromDashboard(page)
  await page.getByRole('button', { name: 'Start practice exam' }).click()
  await submitQuiz(page)
  await page.goto('/practice/mistakes')
  await page.goto('/settings')
  await expectHeading(page, 'Settings')

  expect(outside).toEqual([])
})
