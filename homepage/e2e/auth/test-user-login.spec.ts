import { test, expect } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

test.describe('Test User Authentication', () => {
  test('can login as test creator', async ({ page }) => {
    // Navigate to login page
    await page.goto('/login')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Debug: Take screenshot of login page
    await page.screenshot({ path: 'login-page.png' })
    
    // Try to find and fill email field with various selectors
    const emailSelectors = [
      'input[name="email"]',
      'input[type="email"]',
      '#email',
      '[data-testid="email-input"]',
      'input[placeholder*="email" i]'
    ]
    
    let emailFilled = false
    for (const selector of emailSelectors) {
      try {
        const element = page.locator(selector).first()
        if (await element.isVisible({ timeout: 1000 })) {
          await element.fill('testcreator@annpale.test')
          emailFilled = true
          console.log(`✓ Email filled using selector: ${selector}`)
          break
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    if (!emailFilled) {
      throw new Error('Could not find email input field')
    }
    
    // Try to find and fill password field
    const passwordSelectors = [
      'input[name="password"]',
      'input[type="password"]',
      '#password',
      '[data-testid="password-input"]',
      'input[placeholder*="password" i]'
    ]
    
    let passwordFilled = false
    for (const selector of passwordSelectors) {
      try {
        const element = page.locator(selector).first()
        if (await element.isVisible({ timeout: 1000 })) {
          await element.fill('TestCreator123!')
          passwordFilled = true
          console.log(`✓ Password filled using selector: ${selector}`)
          break
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    if (!passwordFilled) {
      throw new Error('Could not find password input field')
    }
    
    // Take screenshot before clicking login
    await page.screenshot({ path: 'before-login.png' })
    
    // Try to find and click login button
    const loginButtonSelectors = [
      'button[type="submit"]',
      'button:has-text("Sign In")',
      'button:has-text("Login")',
      'button:has-text("Log In")',
      '[data-testid="login-button"]',
      'button:has-text("Continue")'
    ]
    
    let loginClicked = false
    for (const selector of loginButtonSelectors) {
      try {
        const element = page.locator(selector).first()
        if (await element.isVisible({ timeout: 1000 })) {
          await element.click()
          loginClicked = true
          console.log(`✓ Login button clicked using selector: ${selector}`)
          break
        }
      } catch (e) {
        // Try next selector
      }
    }
    
    if (!loginClicked) {
      throw new Error('Could not find login button')
    }
    
    // Wait for navigation
    await page.waitForURL('**/creator/**', { timeout: 10000 })
    
    // Verify we're logged in
    const url = page.url()
    expect(url).toContain('/creator')
    console.log(`✓ Successfully logged in, redirected to: ${url}`)
  })
})