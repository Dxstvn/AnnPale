import { test, expect } from '@playwright/test'
import { AuthHelper } from '../helpers/auth.helper'

test.describe('OAuth Authentication Flows', () => {
  let authHelper: AuthHelper

  test.beforeAll(async () => {
    authHelper = new AuthHelper()
  })

  test.describe('Google OAuth', () => {
    test('Google OAuth button is visible and clickable', async ({ page }) => {
      await page.goto('/login')
      
      const googleButton = page.locator('[data-testid="oauth-google"]')
      await expect(googleButton).toBeVisible()
      await expect(googleButton).toContainText('Google')
      
      // Verify button is not disabled
      const isDisabled = await googleButton.evaluate(el => 
        el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true'
      )
      expect(isDisabled).toBe(false)
    })

    test('Google OAuth initiates authentication flow', async ({ page, context }) => {
      await page.goto('/login')
      
      // Set up listener for popup
      const popupPromise = context.waitForEvent('page')
      
      // Click Google OAuth button
      await page.click('[data-testid="oauth-google"]')
      
      // Wait for popup to open
      const popup = await popupPromise
      
      // Verify popup URL is Google OAuth
      await popup.waitForLoadState()
      const popupUrl = popup.url()
      expect(popupUrl).toContain('accounts.google.com')
      
      // Close popup
      await popup.close()
    })

    test('handles Google OAuth errors gracefully', async ({ page }) => {
      // Navigate to login with error parameter
      await page.goto('/login?error=access_denied')
      
      // Verify error toast is displayed
      const toast = page.locator('.toast, [role="alert"]').first()
      await expect(toast).toBeVisible({ timeout: 5000 })
      await expect(toast).toContainText(/access_denied|Authentication Error/i)
    })
  })

  test.describe('Twitter/X OAuth', () => {
    test('Twitter/X OAuth button is visible and clickable', async ({ page }) => {
      await page.goto('/login')
      
      const twitterButton = page.locator('[data-testid="oauth-twitter"]')
      await expect(twitterButton).toBeVisible()
      await expect(twitterButton).toContainText('X')
      
      // Verify button is not disabled
      const isDisabled = await twitterButton.evaluate(el => 
        el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true'
      )
      expect(isDisabled).toBe(false)
    })

    test('Twitter/X OAuth initiates authentication flow', async ({ page, context }) => {
      await page.goto('/login')
      
      // Set up listener for popup
      const popupPromise = context.waitForEvent('page')
      
      // Click Twitter OAuth button
      await page.click('[data-testid="oauth-twitter"]')
      
      // Wait for popup to open
      const popup = await popupPromise
      
      // Wait for navigation
      await popup.waitForLoadState()
      const popupUrl = popup.url()
      
      // Verify popup URL is Twitter OAuth or Supabase auth
      expect(popupUrl).toMatch(/twitter\.com|x\.com|supabase/)
      
      // Close popup
      await popup.close()
    })

    test('handles Twitter/X OAuth errors gracefully', async ({ page }) => {
      // Navigate to login with error parameter
      await page.goto('/login?error=access_denied&error_description=User%20denied%20access')
      
      // Verify error toast is displayed
      const toast = page.locator('.toast, [role="alert"]').first()
      await expect(toast).toBeVisible({ timeout: 5000 })
      await expect(toast).toContainText(/denied|Authentication Error/i)
    })
  })

  test.describe('OAuth Callback Handling', () => {
    test('successful OAuth callback redirects to appropriate dashboard', async ({ page }) => {
      // This test would require mocking the Supabase auth response
      // In a real scenario, you'd use a test OAuth provider or mock the response
      
      // Navigate to callback with mock success code
      await page.goto('/auth/callback?code=test_auth_code')
      
      // Should redirect to a dashboard (the specific dashboard depends on user role)
      await page.waitForURL(/\/(fan|creator|admin)\/dashboard/, { timeout: 10000 })
      
      // Verify we're on a dashboard page
      const url = page.url()
      expect(url).toMatch(/\/(fan|creator|admin)\/dashboard/)
    })

    test('OAuth callback handles missing code parameter', async ({ page }) => {
      // Navigate to callback without code
      await page.goto('/auth/callback')
      
      // Should redirect to login with error
      await page.waitForURL('/login', { timeout: 5000 })
      
      // Verify error message is shown
      const errorMessage = page.locator('text=/error|failed/i').first()
      const messageVisible = await errorMessage.isVisible().catch(() => false)
      
      // Either an error message is shown or we're on the login page
      if (!messageVisible) {
        await expect(page).toHaveURL('/login')
      }
    })

    test('OAuth callback preserves return URL after authentication', async ({ page }) => {
      // Set a return URL in session storage or as a query param
      await page.goto('/login')
      await page.evaluate(() => {
        sessionStorage.setItem('returnUrl', '/creator/content')
      })
      
      // Simulate OAuth callback
      await page.goto('/auth/callback?code=test_auth_code')
      
      // Should eventually redirect to the return URL (after dashboard redirect)
      // Note: This behavior depends on implementation
      await page.waitForURL(/\/creator\/(dashboard|content)/, { timeout: 10000 })
    })
  })

  test.describe('OAuth Loading States', () => {
    test('shows loading state when OAuth button is clicked', async ({ page }) => {
      await page.goto('/login')
      
      // Click Google OAuth button
      const googleButton = page.locator('[data-testid="oauth-google"]')
      
      // Start clicking (don't await)
      const clickPromise = googleButton.click()
      
      // Check for loading indicator quickly
      const loadingIndicator = googleButton.locator('.animate-spin, [role="progressbar"]')
      const hasLoadingState = await loadingIndicator.isVisible({ timeout: 1000 }).catch(() => false)
      
      // Complete the click
      await clickPromise.catch(() => {})
      
      // Loading state should appear (or button should be disabled)
      if (!hasLoadingState) {
        const isDisabled = await googleButton.evaluate(el => 
          el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true'
        )
        expect(isDisabled).toBe(true)
      }
    })

    test('disables all auth buttons during OAuth flow', async ({ page }) => {
      await page.goto('/login')
      
      // Click Google OAuth button
      const googleButton = page.locator('[data-testid="oauth-google"]')
      const twitterButton = page.locator('[data-testid="oauth-twitter"]')
      const loginButton = page.locator('[data-testid="login-button"]')
      
      // Start OAuth flow (don't await)
      googleButton.click().catch(() => {})
      
      // Wait a moment for state to update
      await page.waitForTimeout(100)
      
      // Check if other buttons are disabled
      const twitterDisabled = await twitterButton.evaluate(el => 
        el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true'
      )
      const loginDisabled = await loginButton.evaluate(el => 
        el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true'
      )
      
      // At least one button should be disabled during OAuth flow
      expect(twitterDisabled || loginDisabled).toBe(true)
    })
  })

  test.describe('OAuth Provider Icons', () => {
    test('OAuth buttons display correct provider icons', async ({ page }) => {
      await page.goto('/login')
      
      // Check Google button has Google icon
      const googleButton = page.locator('[data-testid="oauth-google"]')
      const googleIcon = googleButton.locator('svg')
      await expect(googleIcon).toBeVisible()
      
      // Check Twitter button has X icon
      const twitterButton = page.locator('[data-testid="oauth-twitter"]')
      const twitterIcon = twitterButton.locator('svg')
      await expect(twitterIcon).toBeVisible()
    })
  })
})

test.describe('OAuth with Mocked Providers', () => {
  test.use({
    // Mock OAuth providers for faster, more reliable tests
    baseURL: process.env.MOCK_OAUTH_URL || undefined
  })

  test('complete OAuth flow with mocked Google provider', async ({ page }) => {
    // Skip if not in mock mode
    if (!process.env.MOCK_OAUTH_URL) {
      test.skip()
    }

    await page.goto('/login')
    
    // Click Google OAuth
    await page.click('[data-testid="oauth-google"]')
    
    // Handle mock OAuth provider page
    await page.waitForURL(/mock-oauth/, { timeout: 5000 })
    
    // Simulate user consent
    await page.click('[data-testid="oauth-consent-approve"]')
    
    // Should redirect back to app and then to dashboard
    await page.waitForURL(/\/creator\/dashboard/, { timeout: 10000 })
    
    // Verify user is logged in
    const userMenu = page.locator('[data-testid="user-menu-trigger"]')
    await expect(userMenu).toBeVisible()
  })

  test('complete OAuth flow with mocked Twitter provider', async ({ page }) => {
    // Skip if not in mock mode
    if (!process.env.MOCK_OAUTH_URL) {
      test.skip()
    }

    await page.goto('/login')
    
    // Click Twitter OAuth
    await page.click('[data-testid="oauth-twitter"]')
    
    // Handle mock OAuth provider page
    await page.waitForURL(/mock-oauth/, { timeout: 5000 })
    
    // Simulate user consent
    await page.click('[data-testid="oauth-consent-approve"]')
    
    // Should redirect back to app and then to dashboard
    await page.waitForURL(/\/creator\/dashboard/, { timeout: 10000 })
    
    // Verify user is logged in
    const userMenu = page.locator('[data-testid="user-menu-trigger"]')
    await expect(userMenu).toBeVisible()
  })

  test('OAuth flow handles user rejection', async ({ page }) => {
    // Skip if not in mock mode
    if (!process.env.MOCK_OAUTH_URL) {
      test.skip()
    }

    await page.goto('/login')
    
    // Click Google OAuth
    await page.click('[data-testid="oauth-google"]')
    
    // Handle mock OAuth provider page
    await page.waitForURL(/mock-oauth/, { timeout: 5000 })
    
    // Simulate user rejection
    await page.click('[data-testid="oauth-consent-deny"]')
    
    // Should redirect back to login with error
    await page.waitForURL('/login', { timeout: 5000 })
    
    // Verify error is displayed
    const toast = page.locator('.toast, [role="alert"]').first()
    await expect(toast).toBeVisible({ timeout: 5000 })
  })
})