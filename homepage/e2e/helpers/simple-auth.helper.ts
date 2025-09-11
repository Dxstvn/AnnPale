import { Page } from '@playwright/test'

export async function simpleLogin(page: Page, email: string, password: string) {
  // Navigate to login page
  await page.goto('/login', { waitUntil: 'domcontentloaded' })
  
  // Wait for form elements
  await page.waitForSelector('#email', { timeout: 10000 })
  await page.waitForSelector('#password', { timeout: 10000 })
  
  // Fill the form
  await page.fill('#email', email)
  await page.fill('#password', password)
  
  // Click submit button
  await page.locator('button[type="submit"]').click()
  
  // Wait for navigation away from login (simple approach)
  await page.waitForTimeout(5000) // Give it time to process
  
  const url = page.url()
  if (url.includes('/login')) {
    throw new Error('Login failed - still on login page')
  }
  
  console.log(`Login successful - navigated to: ${url}`)
  return url
}