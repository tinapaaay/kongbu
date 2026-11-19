import { expect, test } from '@playwright/test'
import { expectHeading, takeQuickExam } from './helpers.ts'

/**
 * Moving progress between browsers: download a backup in one fresh browser profile
 * and restore it in another. This is the Chrome ⇄ Safari path from Settings.
 */
test('a backup downloaded in one browser restores in another', async ({ browser, page }, testInfo) => {
  await takeQuickExam(page)

  await page.goto('/settings')
  await expectHeading(page, 'Settings')
  await expect(page.getByText('Last backup: never')).toBeVisible()
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Download backup' }).click(),
  ])
  expect(download.suggestedFilename()).toMatch(/^hangul-lab-backup-\d{4}-\d{2}-\d{2}\.json$/)
  const file = testInfo.outputPath(download.suggestedFilename())
  await download.saveAs(file)
  await expect(page.getByText(/Last backup: \d/)).toBeVisible()

  // A completely separate browser profile: no saved progress at all.
  const otherBrowser = await browser.newContext()
  const other = await otherBrowser.newPage()
  await other.goto('/settings')
  await expectHeading(other, 'Settings')
  await expect(other.getByText(/This browser has 0 quizzes and 0 answers saved/)).toBeVisible()

  await other.getByLabel('Backup file').setInputFiles(file)
  await expect(other.getByText('Replace progress in this browser?')).toBeVisible()
  await expect(other.getByText(/contains 1 quiz, 10 answers/)).toBeVisible()
  await other.getByRole('button', { name: 'Replace progress' }).click()
  await expect(other.getByRole('status')).toContainText('Progress restored: 1 quiz and 10 answers')

  await other.goto('/')
  await expect(other.getByRole('region', { name: 'Chapter progress' })).toContainText('Practiced')
  await otherBrowser.close()
})

test('a file that is not a backup is rejected without touching progress', async ({ page }, testInfo) => {
  await takeQuickExam(page)
  await page.goto('/settings')
  await expectHeading(page, 'Settings')

  const file = testInfo.outputPath('notes.json')
  const { writeFile } = await import('node:fs/promises')
  await writeFile(file, '{"shopping":["milk"]}')
  await page.getByLabel('Backup file').setInputFiles(file)

  await expect(page.getByRole('alert')).toContainText("isn't a Hangul Lab backup")
  await expect(page.getByRole('alert')).toContainText('not changed')
  await expect(page.getByText(/This browser has 1 quiz and 10 answers saved/)).toBeVisible()
})
