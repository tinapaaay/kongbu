import { defineConfig, devices } from '@playwright/test'

/**
 * Browser tests run against the real production build, served by `vite preview`.
 * Each test gets a fresh browser profile, so every test starts as a brand-new learner.
 * WebKit is Safari's engine, so the Safari projects stand in for Safari on Mac and iPhone.
 */
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:4174',
    trace: 'retain-on-failure',
    // The service worker would answer requests that tests block on purpose (a failed chapter download),
    // so it's off by default. tests/e2e/installable-offline.spec.ts turns it on.
    serviceWorkers: 'block',
  },
  webServer: {
    command: 'npm run build && npx vite preview --port 4174 --strictPort',
    url: 'http://localhost:4174',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'chrome-desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'safari-desktop', use: { ...devices['Desktop Safari'] } },
    { name: 'safari-iphone', use: { ...devices['iPhone 13'] } },
  ],
})
