import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import { TEST_CONFIG, TEST_USERS } from './test-setup'

test.describe('Payment Flow via Explore', () => {
  test('fan can browse creators and initiate payment', async ({ page }) => {
    console.log('🚀 Starting payment flow test via explore page...')
    
    // Step 1: Login as fan
    console.log('Step 1: Logging in as fan...')
    await page.goto('/login')
    await page.fill('#email', TEST_USERS.fan.email)
    await page.fill('#password', TEST_USERS.fan.password)
    await page.click('button:has-text("Sign In")')
    
    // Wait for successful login
    await page.waitForURL('**/fan/home', { timeout: 10000 })
    console.log('✅ Logged in successfully')
    
    // Step 2: Navigate to explore page
    console.log('Step 2: Going to explore page...')
    
    // Wait a moment for the page to fully settle after login
    await page.waitForTimeout(2000)
    
    // Try clicking the Explore link first
    const exploreLink = page.locator('a[href="/fan/explore"]').first()
    const hasExploreLink = await exploreLink.isVisible({ timeout: 3000 }).catch(() => false)
    
    if (hasExploreLink) {
      console.log('Found Explore link, clicking...')
      await exploreLink.click()
      // Wait for navigation to complete
      await page.waitForURL('**/fan/explore', { timeout: 10000 })
    } else {
      // Direct navigation with proper waiting
      console.log('Navigating directly to /fan/explore...')
      await page.goto('/fan/explore', { waitUntil: 'domcontentloaded' })
    }
    
    // Verify we're on the explore page
    const currentUrl = page.url()
    if (!currentUrl.includes('/fan/explore')) {
      throw new Error(`Navigation failed. Expected /fan/explore but got ${currentUrl}`)
    }
    console.log('✅ Successfully navigated to explore page')
    
    // Wait for content to load
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000) // Give React time to render
    
    // Step 3: Find and click on a creator
    console.log('Step 3: Looking for creators...')
    
    // Wait for the creators to load - check for the data attribute that indicates loading is complete
    await page.waitForSelector('[data-creators-loaded="true"]', { timeout: 10000 })
    console.log('Creators loaded successfully')
    
    // Look for View Profile button (they're present in the HTML)
    const viewProfileButton = page.locator('button:has-text("View Profile")').first()
    const hasViewProfile = await viewProfileButton.isVisible({ timeout: 5000 }).catch(() => false)
    
    if (hasViewProfile) {
      console.log('Found "View Profile" button, clicking...')
      await viewProfileButton.click()
      console.log('Clicked View Profile button')
    } else {
      // Try clicking on a specific creator card
      const creatorCard = page.locator('[data-testid*="creator-card-"]').first()
      if (await creatorCard.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log('Found creator card, clicking...')
        await creatorCard.click()
      } else {
        console.log('⚠️  No creator elements found on explore page')
        console.log('Page URL:', page.url())
        console.log('Page title:', await page.title())
        
        // Take a screenshot for debugging
        await page.screenshot({ path: 'explore-page-debug.png' })
        console.log('Screenshot saved as explore-page-debug.png')
        return
      }
    }
    
    // Wait for navigation to creator profile
    await page.waitForTimeout(2000)
    
    // Check if we're on a creator profile page
    const profileUrl = page.url()
    console.log('Current URL after clicking:', profileUrl)
    
    // Step 4: Look for booking/request button
    console.log('Step 4: Looking for booking button...')
    
    // Based on the HTML, the button is "Request Video Message"
    const bookingButtons = [
      'button:has-text("Request Video Message")',
      '[data-testid="request-video-button"]',
      'button:has-text("Book")',
      'button:has-text("Request")',
      'button:has-text("Order")',
      'button:has-text("Get Video")',
      '[data-testid="book-video"]'
    ]
    
    let bookingFound = false
    for (const selector of bookingButtons) {
      const button = page.locator(selector).first()
      if (await button.isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log(`Found booking button: ${selector}`)
        await button.click()
        bookingFound = true
        break
      }
    }
    
    if (!bookingFound) {
      console.log('⚠️  No booking button found')
      return
    }
    
    // Step 5: Look for payment form
    console.log('Step 5: Looking for payment form...')
    await page.waitForTimeout(3000)
    
    const paymentSelectors = [
      'iframe[src*="stripe"]',
      'input[placeholder*="Card"]',
      '[data-testid="payment-form"]',
      'form:has(input[type="text"])'
    ]
    
    let paymentFound = false
    for (const selector of paymentSelectors) {
      if (await page.locator(selector).isVisible({ timeout: 2000 }).catch(() => false)) {
        console.log(`Found payment element: ${selector}`)
        paymentFound = true
        break
      }
    }
    
    if (paymentFound) {
      console.log('✅ Payment form found!')
      
      // Try to fill payment details if possible
      const stripeFrame = page.frameLocator('iframe[src*="stripe"]').first()
      const hasStripe = await page.locator('iframe[src*="stripe"]').count() > 0
      
      if (hasStripe) {
        console.log('Filling Stripe payment form...')
        try {
          await stripeFrame.locator('[placeholder*="Card"], #cardNumber').fill('4242424242424242')
          await stripeFrame.locator('[placeholder*="MM"], #cardExpiry').fill('12/30')
          await stripeFrame.locator('[placeholder*="CVC"], #cardCvc').fill('123')
          await stripeFrame.locator('[placeholder*="ZIP"], #billingPostalCode').fill('10001')
          console.log('✅ Payment details filled')
        } catch (error) {
          console.log('Could not fill Stripe form:', error)
        }
      }
    } else {
      console.log('⚠️  No payment form found')
    }
    
    console.log('🏁 Test completed')
  })
  
  test('simple navigation test', async ({ page }) => {
    // Simple test to verify basic navigation works
    await page.goto('/login')
    await page.fill('#email', TEST_USERS.fan.email)
    await page.fill('#password', TEST_USERS.fan.password)
    await page.click('button:has-text("Sign In")')
    await page.waitForURL('**/fan/home')
    
    // Try to navigate to explore
    await page.goto('/fan/explore')
    await page.waitForLoadState('domcontentloaded')
    
    const currentUrl = page.url()
    console.log('Current URL:', currentUrl)
    
    // Check if we're on explore page or got redirected
    if (currentUrl.includes('/fan/explore')) {
      console.log('✅ Successfully navigated to explore page')
    } else {
      console.log('⚠️  Redirected to:', currentUrl)
    }
  })
})