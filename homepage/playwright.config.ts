import { defineConfig, devices } from '@playwright/test';

// Load environment variables
require('./e2e/setup/load-env.js')

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false, // Disable parallel execution to avoid rate limiting
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // Add retry for local tests too
  workers: 1, // Single worker to avoid rate limiting
  reporter: 'html',
  // globalSetup: require.resolve('./e2e/global-setup.ts'), // Disabled - using fallback in authenticated-test.ts
  timeout: 120000, // Increase global timeout to 2 minutes for complex flows
  expect: {
    timeout: 15000, // Increase expect timeout for slow elements
  },
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 20000, // Increased for Stripe iframe interactions
    navigationTimeout: 40000, // Increased for slow page loads
    // Additional stability settings
    launchOptions: {
      slowMo: 50, // Slow down actions for better stability
    },
    // More reliable waiting strategies
    waitForSelectorTimeout: 10000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  // webServer: {
  //   command: 'npm run dev',
  //   url: 'http://localhost:3000',
  //   reuseExistingServer: true,
  //   timeout: 120 * 1000,
  // },
});