import { test, expect } from '@playwright/test'

test.describe('Simple Login Test', () => {
  test('fan can login and reach fan/home', async ({ page }) => {
    // Step 1: Go to login page
    await page.goto('/login')
    await expect(page).toHaveURL(/\/login/)
    
    // Step 2: Fill login form
    await page.fill('#email', 'testfan@annpale.test')
    await page.fill('#password', 'TestPassword123!')
    
    // Step 3: Submit login by clicking the Sign In button
    await page.click('button:has-text("Sign In")')
    
    // Step 4: Wait for redirect
    await page.waitForFunction(
      () => !window.location.pathname.includes('/login'),
      { timeout: 15000 }
    ).catch(async () => {
      // Check for error message
      const errorText = await page.locator('.text-red-500, .error, [role="alert"]').textContent().catch(() => null)
      if (errorText) {
        console.error('Login error:', errorText)
      }
      throw new Error('Login failed - still on login page')
    })
    
    // Step 5: Verify we're logged in and on fan/home
    await page.waitForURL('**/fan/home', { timeout: 5000 })
    const currentUrl = page.url()
    console.log('✅ Successfully logged in and redirected to:', currentUrl)
    expect(currentUrl).toContain('/fan/home')
    
    // Step 6: Verify the page has loaded properly
    await page.waitForLoadState('networkidle')
    
    // Verify some expected elements on fan/home
    const pageTitle = await page.title()
    console.log('Page title:', pageTitle)
    
    console.log('✅ Test passed: Login successful and fan/home loaded')
  })
})