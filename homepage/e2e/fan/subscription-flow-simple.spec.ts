import { test, expect } from '@playwright/test'

test.describe('Simple Fan Tests - No Auth', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/login')
    await expect(page.locator('h2:has-text("Welcome Back")')).toBeVisible()
    await expect(page.locator('#email')).toBeVisible()
    await expect(page.locator('#password')).toBeVisible()
  })

  test('should fill login form', async ({ page }) => {
    await page.goto('/login')
    
    // Fill the form
    await page.fill('#email', 'testfan@annpale.test')
    await page.fill('#password', 'TestFan123!')
    
    // Verify fields are filled
    await expect(page.locator('#email')).toHaveValue('testfan@annpale.test')
    await expect(page.locator('#password')).toHaveValue('TestFan123!')
    
    // Find the button
    const button = page.locator('button[type="submit"]')
    await expect(button).toBeVisible()
    await expect(button).toContainText('Sign In')
  })

  test('should attempt login', async ({ page }) => {
    await page.goto('/login')
    
    // Wait for form
    await page.waitForSelector('#email', { timeout: 10000 })
    
    // Fill the form
    await page.fill('#email', 'testfan@annpale.test')
    await page.fill('#password', 'TestFan123!')
    
    // Click submit
    await page.locator('button[type="submit"]').click()
    
    // Wait for response - either success or error
    await page.waitForTimeout(5000)
    
    // Check where we ended up
    const url = page.url()
    console.log('Final URL:', url)
    
    // If still on login, check for error message
    if (url.includes('/login')) {
      const errorMessage = await page.locator('text=/error|failed|invalid/i').first().textContent().catch(() => null)
      if (errorMessage) {
        console.log('Login error:', errorMessage)
      }
    }
    
    // Success if we navigated away from login
    expect(url).not.toContain('/login')
  })
})