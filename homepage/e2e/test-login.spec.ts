import { test, expect } from '@playwright/test'

test('test login with local Supabase', async ({ page }) => {
  // Go to login page
  await page.goto('/login')
  
  // Fill in login form
  await page.fill('#email', 'testfan@annpale.test')
  await page.fill('#password', 'testpassword123')
  
  // Click login button
  await page.click('button[type="submit"]')
  
  // Wait for navigation or error
  await page.waitForTimeout(3000)
  
  // Check if we're still on login page
  const url = page.url()
  console.log('Current URL after login:', url)
  
  // We should not be on the login page anymore
  expect(url).not.toContain('/login')
})