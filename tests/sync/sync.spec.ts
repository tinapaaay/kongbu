import { expect, test, type BrowserContext } from '@playwright/test'
import { submitQuiz } from '../e2e/helpers.ts'

const USER = '00000000-0000-0000-0000-000000000001'
const user = { id: USER, aud: 'authenticated', role: 'authenticated', email: 'learner@example.test', created_at: '2026-11-21T00:00:00Z' }

test('two devices converge after offline work, reload and a lost upload response', async ({ browser }, testInfo) => {
  test.setTimeout(60_000)
  const disconnected = new Set<BrowserContext>()
  const rows = new Map<string, Map<string, object>>()
  let loseResponse = false
  let duplicateUploads = 0
  async function mock(context: BrowserContext) {
    await context.addInitScript(({ user }) => {
      localStorage.setItem('sb-kongbu-test-auth-token', JSON.stringify({
        access_token: 'test-access-token', refresh_token: 'test-refresh-token', token_type: 'bearer',
        expires_at: Math.floor(Date.now() / 1000) + 3600, expires_in: 3600, user,
      }))
    }, { user })
    await context.route('https://kongbu-test.supabase.co/**', async (route) => {
      if (disconnected.has(context)) { await route.abort(); return }
      const request = route.request()
      const url = new URL(request.url())
      const headers = { 'access-control-allow-origin': '*', 'access-control-allow-headers': '*', 'access-control-expose-headers': '*', 'content-type': 'application/json' }
      if (request.method() === 'OPTIONS') { await route.fulfill({ status: 200, headers }); return }
      if (url.pathname.startsWith('/auth/')) { await route.fulfill({ json: user, headers }); return }
      const table = url.pathname.split('/').pop()!
      const records = rows.get(table) ?? new Map<string, object>()
      rows.set(table, records)
      if (request.method() === 'POST') {
        for (const row of request.postDataJSON()) {
          if (records.has(row.id)) duplicateUploads++
          else records.set(row.id, { ...row, received_at: new Date().toISOString().replace('Z', '+00:00') })
        }
        if (loseResponse) { loseResponse = false; await route.abort(); return }
        await route.fulfill({ status: 201, body: '', headers }); return
      }
      const range = request.headers().range ?? `${url.searchParams.get('offset') ?? 0}-${Number(url.searchParams.get('offset') ?? 0) + Number(url.searchParams.get('limit') ?? 500) - 1}`
      const [from, to] = range.split('-').map(Number)
      const data = [...records.entries()].sort(([a], [b]) => a.localeCompare(b)).slice(from, to + 1).map(([, row]) => row)
      await route.fulfill({ json: data, headers })
    })
  }
  const laptop = await browser.newContext()
  const phone = await browser.newContext({ viewport: { width: 390, height: 844 } })
  await mock(laptop); await mock(phone)
  const a = await laptop.newPage(); const b = await phone.newPage()
  try {
    await a.goto('/settings'); await b.goto('/settings')
    for (const page of [a, b]) await expect(page.getByText('All progress synced.')).toBeVisible()
    for (const page of [a, b]) {
      await page.getByRole('link', { name: /^(Dashboard|Home)$/ }).click()
      await page.waitForLoadState('networkidle')
    }
    disconnected.add(laptop); disconnected.add(phone)
    await laptop.setOffline(true); await phone.setOffline(true)
    for (const page of [a, b]) {
      await page.getByRole('link', { name: 'Open Chapter 11' }).click()
      await page.getByRole('button', { name: /Start practice exam|Take another practice exam/ }).first().click()
      await submitQuiz(page)
    }
    for (const page of [a, b]) {
      await page.getByRole('link', { name: 'Back to chapter' }).click()
      await page.getByRole('button', { name: /Start practice exam|Take another practice exam/ }).first().click()
    }
    const activeA = await a.evaluate(() => JSON.parse(localStorage.getItem('hangul-lab:learner-data')!).activeSession.id)
    const activeB = await b.evaluate(() => JSON.parse(localStorage.getItem('hangul-lab:learner-data')!).activeSession.id)
    for (const page of [a, b]) {
      await page.getByRole('button', { name: 'Exit quiz' }).click()
      await page.getByRole('dialog').getByRole('button', { name: 'Leave quiz' }).click()
      await page.getByRole('link', { name: 'Settings', exact: true }).click()
    }
    await expect(a.getByRole('status').filter({ hasText: 'Offline' }).first()).toBeVisible()
    // An upload reaches the server, but its response is lost. The next pass must be idempotent.
    loseResponse = true
    disconnected.delete(laptop)
    await laptop.setOffline(false)
    await expect(a.getByRole('status').filter({ hasText: 'Could not send progress' })).toBeVisible({ timeout: 20_000 })
    await a.reload()
    await expect(a.getByText('All progress synced.')).toBeVisible()
    disconnected.delete(phone)
    await phone.setOffline(false)
    await expect(b.getByText('All progress synced.')).toBeVisible()
    await a.getByRole('button', { name: 'Sync now', exact: true }).click()
    await expect(a.getByText('All progress synced.')).toBeVisible()
    for (const [page, active] of [[a, activeA], [b, activeB]] as const) {
      await expect.poll(() => page.evaluate(() => JSON.parse(localStorage.getItem('hangul-lab:learner-data')!).sessions.length)).toBe(2)
      const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('hangul-lab:learner-data')!))
      expect(saved.attempts).toHaveLength(20)
      expect(saved.activeSession.id).toBe(active)
    }
    expect(rows.get('learner_quizzes')?.size).toBe(2)
    expect(rows.get('learner_attempts')?.size).toBe(20)
    expect(duplicateUploads).toBeGreaterThan(0)
    await a.screenshot({ path: testInfo.outputPath('sync-desktop.png'), fullPage: true })
    await b.screenshot({ path: testInfo.outputPath('sync-mobile.png'), fullPage: true })
  } finally { await laptop.close(); await phone.close() }
})
