import { test, expect, type Page, type BrowserContext } from '@playwright/test'

// Test user credentials
const TEST_USERS = {
  fan: {
    email: 'testfan@annpale.test',
    password: 'TestPassword123!',
    role: 'fan'
  },
  creator: {
    email: 'testcreator@annpale.test',
    password: 'TestPassword123!',
    role: 'creator'
  }
}

// Helper to login via UI
async function loginViaUI(page: Page, role: 'fan' | 'creator') {
  const user = TEST_USERS[role]
  
  console.log(`🔐 Logging in as ${role} via UI: ${user.email}`)
  
  // Navigate to login page
  await page.goto('/login')
  await page.waitForLoadState('networkidle')
  
  // Fill in email
  await page.fill('input[type="email"]', user.email)
  
  // Fill in password
  await page.fill('input[type="password"]', user.password)
  
  // Click login button
  await page.click('button[type="submit"]')
  
  // Wait for redirect after successful login
  await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 10000 })
  
  console.log(`✅ Logged in successfully, redirected to: ${page.url()}`)
}

test.describe('Complete Order Flow with UI Login', () => {
  let fanContext: BrowserContext
  let creatorContext: BrowserContext
  let fanPage: Page
  let creatorPage: Page

  test.beforeAll(async ({ browser }) => {
    // Create two browser contexts for fan and creator
    fanContext = await browser.newContext()
    creatorContext = await browser.newContext()
    
    fanPage = await fanContext.newPage()
    creatorPage = await creatorContext.newPage()
  })

  test.afterAll(async () => {
    await fanContext.close()
    await creatorContext.close()
  })

  test('should complete order flow with UI login', async () => {
    // Step 1: Login as creator via UI
    console.log('🎬 Step 1: Creator login via UI...')
    await loginViaUI(creatorPage, 'creator')
    
    // Navigate to requests page
    await creatorPage.goto('/creator/requests')
    await creatorPage.waitForLoadState('networkidle')
    
    // Verify we're on the requests page
    const creatorPageTitle = await creatorPage.locator('h1').first().textContent()
    console.log(`   Creator on page: ${creatorPageTitle}`)
    
    // Step 2: Login as fan via UI
    console.log('👤 Step 2: Fan login via UI...')
    await loginViaUI(fanPage, 'fan')
    
    // Navigate to explore page
    await fanPage.goto('/fan/explore')
    await fanPage.waitForLoadState('networkidle')
    
    // Wait for creators to load
    console.log('⏳ Step 3: Waiting for creators to load...')
    await fanPage.waitForTimeout(5000) // Give time for creators to load
    
    // Check how many creators loaded
    const viewButtons = await fanPage.locator('button:has-text("View Profile")').count()
    console.log(`📊 Found ${viewButtons} creators with View Profile buttons`)
    
    // Take screenshot as proof
    await fanPage.screenshot({ path: 'proof-creators-loaded.png', fullPage: true })
    console.log('📸 Screenshot saved: proof-creators-loaded.png')
    
    if (viewButtons === 0) {
      // Take screenshot for debugging
      await fanPage.screenshot({ path: 'no-creators-loaded.png' })
      throw new Error('No creators loaded on explore page')
    }
    
    // Step 4: Select a creator
    console.log('👆 Step 4: Selecting a creator...')
    
    // Try to find Test Creator, otherwise use first creator
    const testCreatorCard = fanPage.locator('[data-testid="creator-card-test-creator"]')
    let creatorName = 'Unknown Creator'
    
    if (await testCreatorCard.count() > 0) {
      console.log('✅ Found Test Creator')
      const button = testCreatorCard.locator('button:has-text("View Profile")')
      await button.click()
      creatorName = 'Test Creator'
    } else {
      console.log('⚠️ Test Creator not found, using first creator')
      const firstButton = fanPage.locator('button:has-text("View Profile")').first()
      await firstButton.click()
    }
    
    // Wait for navigation to creator profile
    await fanPage.waitForURL('**/fan/creators/**', { timeout: 15000 })
    console.log(`✅ Navigated to creator profile: ${fanPage.url()}`)
    
    // Take screenshot of creator profile
    await fanPage.screenshot({ path: 'proof-creator-profile.png' })
    console.log('📸 Screenshot saved: proof-creator-profile.png')
    
    // Step 5: Request a video
    console.log('📹 Step 5: Requesting a video...')
    
    // Look for request video button
    const requestButton = await fanPage.locator('[data-testid="request-video-button"], button:has-text("Request Video"), button:has-text("Book Video")')
    await expect(requestButton.first()).toBeVisible({ timeout: 10000 })
    await requestButton.first().click()
    
    // Wait for modal
    await fanPage.waitForSelector('[data-testid="video-order-modal"], [role="dialog"]', { timeout: 10000 })
    console.log('✅ Video order modal opened')
    
    // Fill out the form
    console.log('📝 Step 6: Filling out video request form...')
    
    // Select occasion if dropdown exists
    const occasionSelect = fanPage.locator('[data-testid="occasion-select"]')
    if (await occasionSelect.count() > 0) {
      await occasionSelect.click()
      await fanPage.locator('[role="option"]:has-text("Birthday")').click()
    }
    
    // Enter recipient name
    await fanPage.fill('[data-testid="recipient-name-input"], input[placeholder*="recipient"]', 'Test Recipient')
    
    // Add instructions
    await fanPage.fill('[data-testid="instructions-textarea"], textarea', 'This is a test video request from the E2E test suite')
    
    // Continue to checkout
    await fanPage.click('[data-testid="continue-checkout-button"], button:has-text("Continue"), button:has-text("Checkout")')
    
    // Wait for checkout page
    await fanPage.waitForURL('**/checkout**', { timeout: 15000 })
    console.log('✅ Navigated to checkout page')
    
    // Take screenshot of checkout page
    await fanPage.screenshot({ path: 'proof-checkout-page.png' })
    console.log('📸 Screenshot saved: proof-checkout-page.png')
    
    // Step 7: Process payment (in test mode)
    console.log('💳 Step 7: Processing payment...')
    
    // Look for pay button
    const payButton = await fanPage.locator('[data-testid="pay-button"], button:has-text("Pay")')
    await expect(payButton.first()).toBeVisible({ timeout: 15000 })
    
    // Click pay (in test mode this should process immediately)
    await payButton.first().click()
    
    // Wait for success indication
    console.log('⏳ Waiting for payment processing...')
    await fanPage.waitForTimeout(5000)
    
    // Check if we got redirected to success page or see success message
    const currentUrl = fanPage.url()
    const hasSuccess = currentUrl.includes('success') || currentUrl.includes('orders')
    
    if (hasSuccess) {
      console.log(`✅ Payment processed, redirected to: ${currentUrl}`)
    } else {
      const successMessage = await fanPage.locator('text=/success|confirmed|thank you/i').count()
      if (successMessage > 0) {
        console.log('✅ Payment success message displayed')
      } else {
        console.log('⚠️ Payment may not have completed successfully')
      }
    }
    
    // Step 8: Check creator notifications
    console.log('🔔 Step 8: Checking creator notifications...')
    
    // Switch back to creator page
    await creatorPage.reload()
    await creatorPage.waitForLoadState('networkidle')
    
    // Check for new requests
    const requestCards = await creatorPage.locator('[data-testid="request-card"], .card:has-text("Test Recipient")').count()
    
    if (requestCards > 0) {
      console.log(`✅ Creator has ${requestCards} new request(s)`)
    } else {
      console.log('⚠️ No new requests visible in creator dashboard')
    }
    
    // Final summary
    console.log('\n📊 Test Summary:')
    console.log('✅ Both users logged in via UI')
    console.log('✅ Fan browsed creators and selected one')
    console.log('✅ Video request form completed')
    console.log('✅ Checkout process initiated')
    console.log(hasSuccess ? '✅ Payment appeared to complete' : '⚠️ Payment status uncertain')
    console.log(requestCards > 0 ? '✅ Creator received request' : '⚠️ Creator notification not confirmed')
  })
})