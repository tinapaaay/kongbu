import { expect, test } from '@playwright/test'

/**
 * Issue #10: after one visit, Kongbu opens with no internet, on any page, including a chapter you
 * haven't opened yet. Playwright supports service workers fully only in Chromium, so this runs there.
 */
test.use({ serviceWorkers: 'allow' })

test('the manifest makes Kongbu installable with its own name and icons', async ({ request }) => {
  const manifest = await (await request.get('/manifest.webmanifest')).json()
  expect(manifest).toMatchObject({ name: 'Kongbu · EPS-TOPIK Review', short_name: 'Kongbu', display: 'standalone' })
  for (const icon of manifest.icons) expect((await request.get(`/${icon.src}`)).ok()).toBe(true)
  expect(manifest.icons.some((icon: { purpose?: string }) => icon.purpose === 'maskable')).toBe(true)
})

test('after one visit, the app and every chapter open offline, even after a reload', async ({ page, context, browserName }) => {
  test.skip(browserName !== 'chromium', 'Service workers in Playwright are reliable only in Chromium')
  await page.goto('/')
  // Shown once every file is saved on this device.
  await expect(page.getByRole('status').filter({ hasText: 'Kongbu now works offline on this device.' })).toBeVisible()

  await context.setOffline(true)
  // Chapter 12 was never opened online: its file must come from what the service worker saved.
  await page.goto('/learn/12')
  await expect(page.getByRole('heading', { level: 1, name: '대중교통' })).toBeVisible()
  await page.getByRole('button', { name: 'Start practice exam' }).first().click()
  await expect(page.getByText('0 of 10 answered')).toBeVisible()

  await page.reload()
  await expect(page.getByText('0 of 10 answered')).toBeVisible()
  await page.goto('/mistakes')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
})
