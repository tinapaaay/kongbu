import { expect, type Page } from '@playwright/test'

export const QUIZ_SIZE = 10

/** Waits for a page's main heading, which also means saved progress has loaded. */
export async function expectHeading(page: Page, name: string | RegExp) {
  await expect(page.getByRole('heading', { level: 1, name })).toBeVisible()
}

/** Opens Chapter 11 from the dashboard, the way a learner would. */
export async function openChapter11FromDashboard(page: Page) {
  await page.goto('/')
  await expectHeading(page, '오늘의 공부')
  await page.getByRole('link', { name: 'Open Chapter 11' }).click()
  await expectHeading(page, '집안일')
}

/** The question currently on screen (a fieldset named "N. prompt"). */
export function currentQuestion(page: Page) {
  return page.getByRole('group', { name: /^\d+\./ })
}

/** Picks the answer at a position (0–3) by clicking its row, like a learner. */
export async function chooseAnswer(page: Page, position: number) {
  await currentQuestion(page).locator('label').nth(position).click()
  await expect(currentQuestion(page).getByRole('radio').nth(position)).toBeChecked()
}

export async function goToNextQuestion(page: Page) {
  await page.getByRole('button', { name: 'Next →' }).click()
}

/** Opens the submit dialog and confirms it. */
export async function submitQuiz(page: Page) {
  await page.getByRole('button', { name: 'Submit quiz' }).click()
  const dialog = page.getByRole('dialog', { name: 'Submit your quiz?' })
  await expect(dialog).toBeVisible()
  await dialog.getByRole('button', { name: /^Submit/ }).click()
  await expectHeading(page, 'Results')
}

/** Starts an exam from Chapter 11 and submits it straight away (every question skipped). */
export async function takeQuickExam(page: Page) {
  await openChapter11FromDashboard(page)
  await page.getByRole('button', { name: 'Start practice exam' }).first().click()
  await expect(currentQuestion(page)).toBeVisible()
  await submitQuiz(page)
}
