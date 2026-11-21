import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/sync', fullyParallel: false,
  use: { baseURL: 'http://localhost:4175', trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run build && npx vite preview --port 4175 --strictPort',
    url: 'http://localhost:4175', timeout: 120_000,
    env: { VITE_SUPABASE_URL: 'https://kongbu-test.supabase.co', VITE_SUPABASE_ANON_KEY: 'sb_publishable_kongbu_test_public_key' },
  },
  projects: [
    { name: 'chrome-desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'safari-desktop', use: { ...devices['Desktop Safari'] } },
    { name: 'safari-iphone', use: { ...devices['iPhone 13'] } },
  ],
})
