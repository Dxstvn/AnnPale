import { test, expect, Page } from '@playwright/test'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

test.describe('Twitter OAuth Flow', () => {
  test('should complete Twitter OAuth authentication flow', async ({ page, context }) => {
    // Enable console logging to debug
    page.on('console', msg => {
      console.log(`Browser console [${msg.type()}]:`, msg.text())
    })
    
    page.on('pageerror', error => {
      console.error('Page error:', error)
    })

    // Navigate to login page
    console.log('Navigating to login page...')
    await page.goto('http://localhost:3000/login')
    await page.waitForLoadState('networkidle')

    // Take screenshot before clicking OAuth
    await page.screenshot({ path: 'before-oauth.png' })

    // Click on Twitter/X OAuth button
    console.log('Looking for Twitter/X OAuth button...')
    const twitterButton = page.locator('button:has-text("X")').or(
      page.locator('button:has-text("Twitter")')
    )
    
    await expect(twitterButton).toBeVisible({ timeout: 10000 })
    console.log('Twitter/X button found, clicking...')
    
    // Start waiting for popup/redirect before clicking
    const [oauthPage] = await Promise.all([
      context.waitForEvent('page'), // Wait for new page/popup
      twitterButton.click()
    ])

    // If OAuth opened in a new window/tab
    if (oauthPage && oauthPage.url() !== page.url()) {
      console.log('OAuth opened in new window, URL:', oauthPage.url())
      
      // Handle Twitter OAuth flow
      await handleTwitterOAuth(oauthPage)
      
      // Wait for callback
      console.log('Waiting for OAuth callback...')
      await page.waitForURL('**/auth/callback**', { timeout: 30000 })
    } else {
      // OAuth in same window
      console.log('OAuth in same window, current URL:', page.url())
      
      // Check if we're redirected to Twitter
      if (page.url().includes('twitter.com') || page.url().includes('x.com')) {
        await handleTwitterOAuth(page)
      }
      
      // Wait for callback
      console.log('Waiting for OAuth callback...')
      await page.waitForURL('**/auth/callback**', { timeout: 30000 })
    }

    // Check console logs for errors
    await page.waitForTimeout(2000) // Give time for any errors to appear

    // Take screenshot of callback page
    await page.screenshot({ path: 'oauth-callback.png' })

    // Check if we're redirected to a dashboard or error page
    await page.waitForTimeout(3000)
    
    const currentUrl = page.url()
    console.log('Final URL after OAuth:', currentUrl)
    
    // Take final screenshot
    await page.screenshot({ path: 'after-oauth.png' })

    // Check for success
    if (currentUrl.includes('/dashboard')) {
      console.log('OAuth successful! Redirected to dashboard')
    } else if (currentUrl.includes('error')) {
      console.error('OAuth failed with error')
      // Get error message if visible
      const errorMessage = await page.locator('text=/error|failed/i').first().textContent().catch(() => null)
      if (errorMessage) {
        console.error('Error message:', errorMessage)
      }
    }

    // Verify we're not on login page with error
    expect(currentUrl).not.toContain('login?error=oauth_failed')
  })
})

async function handleTwitterOAuth(page: Page) {
  console.log('Handling Twitter OAuth flow...')
  
  const username = process.env.TWITTER_USERNAME
  const password = process.env.TWITTER_PASSWORD

  if (!username || !password) {
    throw new Error('Twitter credentials not found in environment variables')
  }

  try {
    // Wait for Twitter login page to load
    await page.waitForLoadState('domcontentloaded', { timeout: 15000 })
    
    // Check if we need to enter username
    const usernameInput = page.locator('input[name="text"], input[name="session[username_or_email]"], input[autocomplete="username"]')
    if (await usernameInput.isVisible({ timeout: 5000 })) {
      console.log('Entering username...')
      await usernameInput.fill(username)
      
      // Click next or submit
      const nextButton = page.locator('button:has-text("Next"), div[role="button"]:has-text("Next")')
      if (await nextButton.isVisible({ timeout: 2000 })) {
        await nextButton.click()
      } else {
        await page.keyboard.press('Enter')
      }
    }

    // Wait for password field
    const passwordInput = page.locator('input[name="password"], input[type="password"], input[autocomplete="current-password"]')
    await passwordInput.waitFor({ state: 'visible', timeout: 10000 })
    console.log('Entering password...')
    await passwordInput.fill(password)

    // Submit login
    const loginButton = page.locator('button:has-text("Log in"), div[role="button"]:has-text("Log in")')
    if (await loginButton.isVisible({ timeout: 2000 })) {
      await loginButton.click()
    } else {
      await page.keyboard.press('Enter')
    }

    console.log('Credentials submitted, waiting for authorization...')

    // Wait for authorization page or automatic redirect
    try {
      // Check if we need to authorize the app
      const authorizeButton = page.locator('button:has-text("Authorize"), input[value="Authorize"], button:has-text("Allow")')
      if (await authorizeButton.isVisible({ timeout: 5000 })) {
        console.log('Clicking authorize button...')
        await authorizeButton.click()
      }
    } catch (e) {
      console.log('No authorization button found, might be auto-authorized')
    }
  } catch (error) {
    console.error('Error during Twitter OAuth:', error)
    await page.screenshot({ path: 'twitter-oauth-error.png' })
    throw error
  }
}