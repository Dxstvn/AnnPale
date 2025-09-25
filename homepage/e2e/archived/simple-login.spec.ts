import { test, expect } from '@playwright/test'
import { TEST_FAN_CREDENTIALS, loginAsFan } from './helpers/subscription-helpers'

test.describe('Simple Login Test', () => {
  test('Can login with test fan account', async ({ page }) => {
    console.log('🔐 Testing simple login...')

    // Go to login page
    await page.goto('/login')

    // Fill credentials
    await page.fill('[data-testid="email-input"]', TEST_FAN_CREDENTIALS.email)
    await page.fill('[data-testid="password-input"]', TEST_FAN_CREDENTIALS.password)

    // Take screenshot before submit
    await page.screenshot({ path: 'e2e/screenshots/before-login.png' })

    // Click submit
    await page.click('[data-testid="login-submit-btn"]')

    // Wait for navigation
    await page.waitForURL(url => !url.toString().includes('/login'), {
      timeout: 15000
    })

    // Verify we're logged in
    const currentUrl = page.url()
    console.log('✅ Logged in! Redirected to:', currentUrl)
    expect(currentUrl).not.toContain('/login')

    // Take screenshot after login
    await page.screenshot({ path: 'e2e/screenshots/after-login-success.png' })
  })
})