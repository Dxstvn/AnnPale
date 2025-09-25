import { test, expect } from '@playwright/test'
import { loginAsFan } from './helpers/subscription-helpers'

test.describe('Simple Explore Test', () => {
  test('Can browse creators after login', async ({ page }) => {
    console.log('🔐 Logging in...')
    // Retry login if it fails
    let loginSuccess = false
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        await loginAsFan(page)
        loginSuccess = true
        break
      } catch (error) {
        console.log(`Login attempt ${attempt} failed:`, error)
        if (attempt === 3) throw error
        await page.waitForTimeout(2000)
      }
    }

    console.log('🔍 Navigating to explore...')
    await page.goto('/fan/explore')

    // Wait for page to load
    await page.waitForLoadState('domcontentloaded')

    // Look for creator elements
    const creators = await page.locator('[data-testid*="creator-"]').count()
    console.log(`Found ${creators} creator elements`)

    // Look for view profile buttons
    const viewButtons = await page.locator('[data-testid="view-creator-profile-btn"]').count()
    console.log(`Found ${viewButtons} view profile buttons`)

    // Take screenshot
    await page.screenshot({ path: 'e2e/screenshots/explore-page.png' })

    // Try clicking first creator if available
    if (viewButtons > 0) {
      const firstButton = page.locator('[data-testid="view-creator-profile-btn"]').first()
      await firstButton.click()

      // Wait for navigation
      await page.waitForURL(/\/fan\/creators\//, { timeout: 10000 })
      console.log('✅ Successfully navigated to creator profile')

      // Take screenshot
      await page.screenshot({ path: 'e2e/screenshots/creator-profile.png' })
    }
  })
})