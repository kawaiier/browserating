import { defineConfig, devices } from '@playwright/test';

const FAILURE_PORT = 3101;
const smoke = { testIgnore: '**/failure.pw.js' };

export default defineConfig({
  testDir: './e2e',
  testMatch: '**/*.pw.js',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:3100', trace: 'retain-on-failure' },
  projects: [
    { name: 'chromium', ...smoke, use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', ...smoke, use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', ...smoke, use: { ...devices['Desktop Safari'] } },
    {
      name: 'data-failure',
      testMatch: '**/failure.pw.js',
      use: { ...devices['Desktop Chrome'], baseURL: `http://127.0.0.1:${FAILURE_PORT}` },
    },
  ],
  webServer: [
    {
      command: 'bun run start -- -p 3100',
      url: 'http://127.0.0.1:3100',
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
    },
    {
      // Same build, but benchmark data comes from a copy the failure spec can break.
      command: `rm -rf e2e/.failure-data && cp -R public/data e2e/.failure-data && BENCHMARK_DATA_DIR=e2e/.failure-data bun run start -- -p ${FAILURE_PORT}`,
      url: `http://127.0.0.1:${FAILURE_PORT}`,
      reuseExistingServer: false,
      timeout: 120000,
    },
  ],
});
