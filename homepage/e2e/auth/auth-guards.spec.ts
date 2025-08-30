import { test, expect } from '@playwright/test'
import { AuthHelper } from '../helpers/auth.helper'

test.describe('Authentication Guards', () => {
  let authHelper: AuthHelper

  test.beforeAll(async () => {
    authHelper = new AuthHelper()
  })

  test('unauthenticated user redirected from /fan to /login', async ({ page }) => {
    // Try to access fan home without authentication
    await page.goto('/fan/home')
    
    // Should be redirected to login (with query param)
    await expect(page).toHaveURL(/\/login(\?.*)?/)
    // Verify we're on login page
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible()
  })

  test('unauthenticated user redirected from /creator to /login', async ({ page }) => {
    // Try to access creator dashboard without authentication
    await page.goto('/creator/dashboard')
    
    // Should be redirected to login (with query param)
    await expect(page).toHaveURL(/\/login(\?.*)?/)
    // Verify we're on login page
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible()
  })

  test('unauthenticated user redirected from /admin to /login', async ({ page }) => {
    // Try to access admin dashboard without authentication
    await page.goto('/admin/dashboard')
    
    // Should be redirected to login (with query param)
    await expect(page).toHaveURL(/\/login(\?.*)?/)
    // Verify we're on login page
    await expect(page.locator('[data-testid="login-button"]')).toBeVisible()
  })

  test('fan cannot access creator dashboard', async ({ page }) => {
    // Login as fan
    await authHelper.loginAs(page, 'fan')
    
    // Try to access creator dashboard
    await page.goto('/creator/dashboard')
    
    // Should be redirected to unauthorized page
    await expect(page).toHaveURL('/unauthorized')
  })

  test('fan cannot access admin dashboard', async ({ page }) => {
    // Login as fan
    await authHelper.loginAs(page, 'fan')
    
    // Try to access admin dashboard
    await page.goto('/admin/dashboard')
    
    // Should be redirected to unauthorized page
    await expect(page).toHaveURL('/unauthorized')
  })

  test('creator cannot access admin dashboard', async ({ page }) => {
    // Login as creator
    await authHelper.loginAs(page, 'creator')
    
    // Try to access admin dashboard
    await page.goto('/admin/dashboard')
    
    // Should be redirected to unauthorized page
    await expect(page).toHaveURL('/unauthorized')
  })

  test('creator can access their own dashboard', async ({ page }) => {
    // Login as creator
    await authHelper.loginAs(page, 'creator')
    
    // Navigate to creator dashboard
    await page.goto('/creator/dashboard')
    
    // Should stay on creator dashboard
    await expect(page).toHaveURL('/creator/dashboard')
    
    // Verify dashboard loads
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  test('admin can access admin dashboard', async ({ page }) => {
    // Login as admin
    await authHelper.loginAs(page, 'admin')
    
    // Navigate to admin dashboard
    await page.goto('/admin/dashboard')
    
    // Should stay on admin dashboard
    await expect(page).toHaveURL('/admin/dashboard')
    
    // Verify dashboard loads
    await expect(page.locator('h1, h2').first()).toBeVisible()
  })

  test('session persists across page refreshes', async ({ page }) => {
    // Login as creator
    await authHelper.loginAs(page, 'creator')
    
    // Navigate to creator dashboard
    await page.goto('/creator/dashboard')
    await expect(page).toHaveURL('/creator/dashboard')
    
    // Refresh the page
    await page.reload()
    
    // Should still be on creator dashboard
    await expect(page).toHaveURL('/creator/dashboard')
    
    // Verify still logged in
    const isLoggedIn = await authHelper.isLoggedIn(page)
    expect(isLoggedIn).toBe(true)
  })

  test('logout clears session properly', async ({ page }) => {
    // Login as creator
    await authHelper.loginAs(page, 'creator')
    
    // Verify logged in
    let isLoggedIn = await authHelper.isLoggedIn(page)
    expect(isLoggedIn).toBe(true)
    
    // Logout
    await authHelper.logout(page)
    
    // Verify logged out
    isLoggedIn = await authHelper.isLoggedIn(page)
    expect(isLoggedIn).toBe(false)
    
    // Try to access protected route
    await page.goto('/creator/dashboard')
    
    // Should be redirected to login
    await expect(page).toHaveURL('/login')
  })

  test('multiple tabs share authentication session', async ({ browser }) => {
    // Create first context and login
    const context1 = await browser.newContext()
    const page1 = await context1.newPage()
    
    await authHelper.loginAs(page1, 'creator')
    await page1.goto('/creator/dashboard')
    await expect(page1).toHaveURL('/creator/dashboard')
    
    // Get storage state
    const storageState = await context1.storageState()
    
    // Create second context with same storage state
    const context2 = await browser.newContext({ storageState })
    const page2 = await context2.newPage()
    
    // Second tab should also be authenticated
    await page2.goto('/creator/dashboard')
    await expect(page2).toHaveURL('/creator/dashboard')
    
    // Clean up
    await context1.close()
    await context2.close()
  })
})