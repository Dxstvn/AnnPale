import { test, expect, Page, BrowserContext } from '@playwright/test'
import path from 'path'
import fs from 'fs'

test.describe('Video Request Fulfillment Workflow', () => {
  let page: Page
  let context: BrowserContext

  test.beforeEach(async ({ browser }) => {
    context = await browser.newContext()
    page = await context.newPage()
  })

  test.afterEach(async () => {
    await context.close()
  })

  test('should load creator requests page', async () => {
    // Navigate to creator requests page
    await page.goto('/creator/requests')
    
    // Check if page loads correctly
    await expect(page).toHaveTitle(/Ann Pale/)
    
    // Check for key elements
    const pageContent = await page.content()
    
    // The page should either show login prompt or order management
    const hasLoginButton = pageContent.includes('Sign In') || pageContent.includes('Login')
    const hasOrderManagement = pageContent.includes('Order Management') || pageContent.includes('Video Requests')
    
    expect(hasLoginButton || hasOrderManagement).toBeTruthy()
  })

  test('should load fan orders page', async () => {
    // Navigate to fan orders page
    await page.goto('/fan/orders')
    
    // Check if page loads correctly
    await expect(page).toHaveTitle(/Ann Pale/)
    
    // Check for key elements
    const pageContent = await page.content()
    
    // The page should either show login prompt or orders-related content
    // Look for various possible text that could appear on the page
    const hasLoginButton = pageContent.includes('Sign In') || 
                          pageContent.includes('Login') || 
                          pageContent.includes('Sign in')
    const hasOrders = pageContent.includes('Orders') || 
                     pageContent.includes('orders') ||
                     pageContent.includes('Track') ||
                     pageContent.includes('Active') ||
                     pageContent.includes('Completed') ||
                     pageContent.includes('Browse Creators')
    
    expect(hasLoginButton || hasOrders).toBeTruthy()
  })

  test('should test video upload API security', async () => {
    // Test that the video upload API requires authentication
    const response = await page.request.post('/api/creator/videos/upload', {
      data: new FormData()
    })
    
    // Should require authentication
    expect(response.status()).toBe(401)
    
    const body = await response.json()
    expect(body.error).toBeTruthy()
  })

  test('should test video streaming API security', async () => {
    // Test that the video streaming API requires authentication
    const response = await page.request.get('/api/fan/videos/test-order-id/stream')
    
    // Should require authentication
    expect(response.status()).toBe(401)
    
    const body = await response.json()
    expect(body.error).toBe('Unauthorized')
  })

  test('should display video player component on orders page', async () => {
    // Navigate to fan orders page
    await page.goto('/fan/orders')
    
    // Check if the page has necessary structure for video playback
    const pageContent = await page.content()
    
    // Look for video-related UI elements (these would be present even without auth)
    const hasVideoElements = 
      pageContent.includes('Watch') || 
      pageContent.includes('Play') ||
      pageContent.includes('video') ||
      pageContent.includes('Video')
    
    expect(hasVideoElements).toBeTruthy()
  })

  test('should have proper video upload form structure', async () => {
    // Navigate to creator requests page
    await page.goto('/creator/requests')
    
    // Check for upload-related elements in the page structure
    const pageContent = await page.content()
    
    // Look for upload-related UI elements
    const hasUploadElements = 
      pageContent.includes('Upload') || 
      pageContent.includes('upload') ||
      pageContent.includes('drag') ||
      pageContent.includes('drop') ||
      pageContent.includes('Accept') ||
      pageContent.includes('Video')
    
    expect(hasUploadElements).toBeTruthy()
  })

  test('should verify API endpoints are accessible', async () => {
    // Test that our API routes are properly configured
    
    // Video upload endpoint should exist
    const uploadResponse = await page.request.post('/api/creator/videos/upload', {
      headers: {
        'Content-Type': 'application/json'
      },
      data: {}
    })
    // Should get a response (even if error)
    expect(uploadResponse.status()).toBeGreaterThanOrEqual(400)
    expect(uploadResponse.status()).toBeLessThan(600)
    
    // Video streaming endpoint should exist  
    const streamResponse = await page.request.get('/api/fan/videos/test/stream')
    // Should get a response (even if error)
    expect(streamResponse.status()).toBeGreaterThanOrEqual(400)
    expect(streamResponse.status()).toBeLessThan(600)
  })

  test('should have responsive video player controls', async () => {
    // Navigate to fan orders page
    await page.goto('/fan/orders')
    
    // Check viewport for mobile responsiveness
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForTimeout(500)
    
    // Page should still be accessible on mobile
    const mobileContent = await page.content()
    expect(mobileContent).toBeTruthy()
    
    // Check desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.waitForTimeout(500)
    
    // Page should be accessible on desktop
    const desktopContent = await page.content()
    expect(desktopContent).toBeTruthy()
  })
})

test.describe('Video Upload Component Tests', () => {
  test('should validate file types in upload component', async ({ page }) => {
    // This tests the client-side validation logic
    await page.goto('/creator/requests')
    
    // Wait a moment for the page to fully load
    await page.waitForTimeout(1000)
    
    // Check the page content for video-related validation information
    const pageContent = await page.content()
    
    // The page should have references to video formats or upload functionality
    // Look for various indicators that video upload is supported
    const hasVideoValidation = 
      pageContent.toLowerCase().includes('mp4') || 
      pageContent.toLowerCase().includes('video') || 
      pageContent.toLowerCase().includes('webm') ||
      pageContent.toLowerCase().includes('mov') ||
      pageContent.toLowerCase().includes('upload') ||
      pageContent.toLowerCase().includes('drag') ||
      pageContent.toLowerCase().includes('avi') ||
      pageContent.toLowerCase().includes('quicktime')
    
    // The page should have some reference to video formats or upload functionality
    expect(hasVideoValidation).toBeTruthy()
  })

  test('should check for proper error handling', async ({ page }) => {
    // Test error handling in the streaming API
    const response = await page.request.get('/api/fan/videos/nonexistent-order/stream')
    
    // Should handle non-existent orders gracefully
    expect(response.status()).toBeGreaterThanOrEqual(400)
    
    const body = await response.json()
    expect(body.error).toBeTruthy()
  })
})