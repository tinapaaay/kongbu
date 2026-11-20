import { expect, test } from '@playwright/test'
import {
  chooseAnswer,
  currentQuestion,
  expectHeading,
  goToNextQuestion,
  openChapter11FromDashboard,
  QUIZ_SIZE,
  submitQuiz,
} from './helpers.ts'

/**
 * The PRD's Definition of Done, step by step:
 * 1. Open the dashboard. 2. Select Chapter 11. 3. Start a practice exam.
 * 4. Answer ten original EPS-TOPIK-style questions. 5. Submit the assessment.
 * 6. Review the score and explanations. 7. See mistakes saved. 8. Return later and continue studying.
 */
test('a new learner completes the core workflow and can return later', async ({ page }) => {
  // 1. A fresh learner sees no false progress or resume state.
  await page.goto('/')
  await expectHeading(page, '오늘의 공부')
  await expect(page.getByText('Start here')).toBeVisible()
  await expect(page.getByText(/Resume/)).toHaveCount(0)

  // 2. Select Chapter 11.
  await openChapter11FromDashboard(page)
  await expect(page.getByText(/not real exam questions/)).toBeVisible()

  // 3. Start a practice exam.
  await page.getByRole('button', { name: 'Start practice exam' }).first().click()
  await expect(currentQuestion(page)).toHaveAccessibleName(/^1\./)
  await expect(currentQuestion(page).getByRole('radio')).toHaveCount(4)
  await expect(page.getByText(/Correct answer|Explanation/)).toHaveCount(0)

  // 4. Answer ten questions, refreshing halfway to prove progress is saved.
  for (let i = 0; i < QUIZ_SIZE; i++) {
    await chooseAnswer(page, i % 4)
    if (i === 4) {
      await page.reload()
      await expect(currentQuestion(page)).toHaveAccessibleName(/^5\./)
      await expect(page.getByText('5 of 10 answered')).toBeVisible()
    }
    if (i < QUIZ_SIZE - 1) await goToNextQuestion(page)
  }
  await expect(page.getByText('10 of 10 answered')).toBeVisible()

  // 5. Submit.
  await submitQuiz(page)

  // 6. Review the score and explanations.
  const score = page.getByRole('region', { name: 'Score' })
  await expect(score).toContainText('/ 10')
  const review = page.getByRole('region', { name: 'Answers and explanations' })
  await expect(review.locator('details')).toHaveCount(QUIZ_SIZE)
  const firstItem = review.locator('details').first()
  // An open <details> has open="" (an empty string), so check for the attribute itself, not its value.
  if ((await firstItem.getAttribute('open')) === null) await firstItem.locator('summary').click()
  await expect(firstItem.getByText('Explanation', { exact: true })).toBeVisible()
  await expect(firstItem.getByText(/Correct answer|Your answer · Correct/)).toBeVisible()

  // 7. Mistakes are saved (or, if every answer was right, the page says so).
  const scoreText = (await score.textContent()) ?? ''
  const correct = Number(/(\d+)\s*\/\s*10/.exec(scoreText)?.[1])
  expect(correct).toBeGreaterThanOrEqual(0)
  await page.goto('/practice/mistakes')
  await expectHeading(page, 'Mistakes')
  if (correct < QUIZ_SIZE) {
    await expect(page.getByText(new RegExp(`${QUIZ_SIZE - correct} open mistakes?`))).toBeVisible()
  } else {
    await expect(page.getByText(/Every answer/)).toBeVisible()
  }

  // 8. Return later: progress is still there after a full reload.
  await page.goto('/')
  await page.reload()
  await expectHeading(page, '오늘의 공부')
  await expect(page.getByRole('region', { name: 'Chapter progress' })).toContainText(/Practiced|Mastered/)
  await expect(page.getByRole('region', { name: 'This week' })).toContainText('10 questions answered')
})

test('chapter filters keep other chapters out of a quiz', async ({ page }) => {
  await openChapter11FromDashboard(page)
  await page.getByRole('button', { name: 'Start practice exam' }).first().click()
  await expect(currentQuestion(page)).toBeVisible()
  const ids = await page.evaluate(() => JSON.parse(localStorage.getItem('hangul-lab:learner-data')!).activeSession.questionIds)
  expect(ids).toHaveLength(10)
  for (const id of ids) expect(id).toMatch(/^ch11-q\d{3}$/)
})

test('submitting the same quiz twice records it once', async ({ page }) => {
  await openChapter11FromDashboard(page)
  await page.getByRole('button', { name: 'Start practice exam' }).first().click()
  await page.getByRole('button', { name: 'Submit quiz' }).click()
  const confirm = page.getByRole('dialog').getByRole('button', { name: /^Submit/ })
  // Two clicks in the same instant, before the page can update: the real double-click race.
  await confirm.evaluate((button: HTMLElement) => {
    button.click()
    button.click()
  })
  await expectHeading(page, 'Results')
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('hangul-lab:learner-data')!))
  expect(saved.sessions).toHaveLength(1)
  expect(saved.attempts).toHaveLength(10)
})
