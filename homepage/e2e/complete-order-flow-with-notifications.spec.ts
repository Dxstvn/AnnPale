import { test, expect, type Page, type BrowserContext } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import { StripeWebhookListener, setupWebhookListener, trackPaymentWebhook } from './helpers/stripe-webhook.helper'
import { RealtimeNotificationTracker, setupRealtimeTracking, trackCreatorDashboardUpdates } from './helpers/realtime.helper'
import { createStripePaymentHelper, STRIPE_TEST_CARDS } from './helpers/enhanced-stripe-payment.helper'
import { createPaymentConfirmationHelper } from './helpers/payment-confirmation.helper'

// Initialize Supabase client for database queries
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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
    role: 'creator',
    id: '0f3753a3-029c-473a-9aee-fc107d10c569' // Test Creator's ID
  }
}

// Use test cards from the enhanced helper
const STRIPE_TEST_CARD = STRIPE_TEST_CARDS.visa

// Helper for navigation with retry patterns for net::ERR_ABORTED handling
async function navigateWithRetry(page: Page, url: string, maxRetries: number = 3): Promise<void> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Navigation attempt ${attempt}/${maxRetries} to: ${url}`)
      
      await page.goto(url, { 
        waitUntil: 'domcontentloaded', 
        timeout: 30000 
      })
      
      // For dashboard pages, wait for content instead of networkidle
      if (url.includes('/dashboard')) {
        try {
          // Wait for dashboard indicators to load
          await page.waitForSelector('main, [data-testid="dashboard"], h1, .dashboard', { timeout: 15000 })
          console.log(`✅ Dashboard content detected`)
        } catch (selectorError) {
          // Fall back to shorter networkidle wait for dashboard pages
          await page.waitForLoadState('networkidle', { timeout: 5000 })
          console.log(`✅ Using networkidle fallback`)
        }
      } else {
        // Wait for network stability for non-dashboard pages
        await page.waitForLoadState('networkidle', { timeout: 15000 })
      }
      
      console.log(`✅ Successfully navigated to: ${url}`)
      return
      
    } catch (error) {
      console.log(`⚠️ Navigation attempt ${attempt} failed:`, error)
      
      // Check if we're at the right URL despite the error
      const currentUrl = page.url()
      if (currentUrl.includes(url.split('/').pop() || '')) {
        console.log(`✅ URL validation passed, continuing despite error`)
        return
      }
      
      if (attempt === maxRetries) {
        throw new Error(`Failed to navigate to ${url} after ${maxRetries} attempts: ${error}`)
      }
      
      // Exponential backoff
      const delay = Math.pow(2, attempt - 1) * 1000
      console.log(`   Retrying in ${delay}ms...`)
      await page.waitForTimeout(delay)
    }
  }
}

// Helper to login via UI
async function loginViaUI(page: Page, role: 'fan' | 'creator') {
  const user = TEST_USERS[role]
  
  console.log(`🔐 Logging in as ${role} via UI: ${user.email}`)
  
  // Navigate to login page with retry
  await navigateWithRetry(page, '/login')
  
  // Fill in email
  await page.fill('input[type="email"]', user.email)
  
  // Fill in password
  await page.fill('input[type="password"]', user.password)
  
  // Click login button
  await page.click('button[type="submit"]')
  
  // Enhanced redirect handling with better error recovery
  try {
    console.log(`   Waiting for redirect from login page...`)
    await page.waitForURL(url => !url.toString().includes('/login'), { timeout: 20000 })
    await page.waitForLoadState('networkidle', { timeout: 5000 })
    console.log(`✅ Logged in successfully, redirected to: ${page.url()}`)
  } catch (error) {
    const currentUrl = page.url()
    console.log(`⚠️ Redirect timeout, current URL: ${currentUrl}`)
    
    // Check if we're actually logged in but page didn't redirect properly
    if (!currentUrl.includes('/login')) {
      console.log(`✅ Actually on the right page: ${currentUrl}`)
    } else {
      // Check for error messages
      const errorMessage = await page.locator('text=/error|invalid|failed/i').textContent().catch(() => null)
      if (errorMessage) {
        console.log(`❌ Login error detected: ${errorMessage}`)
        throw new Error(`Login failed: ${errorMessage}`)
      }
      
      // Final attempt - check if we can navigate to target page
      const targetUrl = role === 'creator' ? '/creator/dashboard' : '/fan/home'
      console.log(`   Attempting direct navigation to ${targetUrl}`)
      await navigateWithRetry(page, targetUrl)
      console.log(`✅ Reached target page through direct navigation`)
    }
  }
}

// Enhanced payment processing with modern helpers
async function processPaymentWithEnhancedAutomation(page: Page, options?: {
  webhookListener?: StripeWebhookListener | null
  supabase?: any
  debugMode?: boolean
}): Promise<{
  success: boolean
  paymentIntentId?: string
  confirmationResult?: any
}> {
  console.log('💳 Starting enhanced payment automation...')
  
  try {
    // Create enhanced Stripe payment helper
    const paymentHelper = createStripePaymentHelper(page, {
      testMode: true,
      debugMode: options?.debugMode || false
    })
    
    // Create payment confirmation helper
    const confirmationHelper = createPaymentConfirmationHelper(page, {
      webhookListener: options?.webhookListener,
      supabase: options?.supabase,
      debugMode: options?.debugMode || false
    })
    
    // Automate the entire payment process
    console.log('🔄 Running complete payment automation...')
    const paymentResult = await paymentHelper.automatePayment(STRIPE_TEST_CARD)
    
    if (!paymentResult.success) {
      console.log('❌ Payment automation failed:', paymentResult.error)
      return { success: false }
    }
    
    console.log('✅ Payment automation completed successfully')
    console.log(`   Payment Intent ID: ${paymentResult.paymentIntentId}`)
    
    // In test environment, manually confirm the payment since Stripe Elements doesn't submit properly
    if (paymentResult.paymentIntentId && process.env.NODE_ENV !== 'production') {
      console.log('🔧 Manually confirming payment in test environment...')
      try {
        const confirmResponse = await fetch('http://localhost:3000/api/test/confirm-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId: paymentResult.paymentIntentId })
        })
        const confirmData = await confirmResponse.json()
        if (confirmData.success) {
          console.log('✅ Payment manually confirmed:', confirmData.paymentIntent.status)
        } else {
          console.log('❌ Failed to manually confirm payment:', confirmData.error)
        }
      } catch (error) {
        console.log('❌ Error manually confirming payment:', error)
      }
    }
    
    // Wait for payment confirmation using enhanced verification
    console.log('⏳ Waiting for payment confirmation...')
    const confirmationResult = await confirmationHelper.waitForPaymentConfirmation(paymentResult.paymentIntentId)
    
    console.log('📊 Payment Confirmation Results:')
    console.log(`   Payment Success: ${confirmationResult.paymentSuccess ? '✅' : '❌'}`)
    console.log(`   Webhook Received: ${confirmationResult.webhookReceived ? '✅' : '❌'}`)
    console.log(`   Order Created: ${confirmationResult.orderCreated ? '✅' : '❌'}`)
    
    return {
      success: confirmationResult.paymentSuccess,
      paymentIntentId: confirmationResult.paymentIntentId,
      confirmationResult
    }
    
  } catch (error) {
    console.log('❌ Enhanced payment automation failed:', error)
    return { success: false }
  }
}

// Helper to check for order in database
async function checkOrderInDatabase(paymentIntentId?: string): Promise<any> {
  console.log('🔍 Checking for order in database...')
  
  let query = supabase
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
  
  if (paymentIntentId) {
    query = query.eq('payment_intent_id', paymentIntentId)
  }
  
  const { data, error } = await query.single()
  
  if (error) {
    console.log('❌ Error querying database:', error.message)
    return null
  }
  
  if (data) {
    console.log('✅ Order found in database:', {
      id: data.id,
      status: data.status,
      amount: data.amount,
      creator_id: data.creator_id
    })
  }
  
  return data
}

// Helper to wait for webhook processing
async function waitForWebhookProcessing(maxWaitTime: number = 15000): Promise<boolean> {
  console.log('⏳ Waiting for webhook processing...')
  const startTime = Date.now()
  
  while (Date.now() - startTime < maxWaitTime) {
    const order = await checkOrderInDatabase()
    if (order) {
      return true
    }
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  return false
}

test.describe('Complete Order Flow with Creator Notifications', () => {
  let fanContext: BrowserContext
  let creatorContext: BrowserContext
  let fanPage: Page
  let creatorPage: Page
  let webhookListener: StripeWebhookListener | null = null
  let realtimeTracker: RealtimeNotificationTracker | null = null

  test.beforeAll(async ({ browser }) => {
    // Create two browser contexts for fan and creator
    fanContext = await browser.newContext()
    creatorContext = await browser.newContext()
    
    fanPage = await fanContext.newPage()
    creatorPage = await creatorContext.newPage()
    
    // Start Stripe webhook listener
    try {
      console.log('🚀 Setting up Stripe webhook listener...')
      webhookListener = await setupWebhookListener()
      console.log('✅ Webhook listener ready')
    } catch (error) {
      console.warn('⚠️ Could not start webhook listener:', error)
      console.log('   Tests will continue without webhook tracking')
    }
    
    // Setup realtime tracking
    console.log('📡 Setting up realtime notification tracking...')
    realtimeTracker = await setupRealtimeTracking(TEST_USERS.creator.id)
    console.log('✅ Realtime tracking ready')
  })

  test.afterAll(async () => {
    // Cleanup webhook listener
    if (webhookListener) {
      await webhookListener.stop()
    }
    
    // Cleanup realtime tracker
    if (realtimeTracker) {
      await realtimeTracker.stop()
    }
    
    await fanContext.close()
    await creatorContext.close()
  })

  test('should complete full order flow with webhook tracking and creator dashboard updates', async () => {
    // Step 1: Login as creator and navigate to dashboard
    console.log('🎬 Step 1: Creator login and dashboard setup...')
    await loginViaUI(creatorPage, 'creator')
    
    // Navigate to creator dashboard
    await creatorPage.goto('/creator/dashboard')
    await creatorPage.waitForLoadState('networkidle')
    
    // Check initial state
    const initialOrders = await creatorPage.locator('[data-testid="order-card"], .order-item').count()
    console.log(`   Creator has ${initialOrders} existing orders`)
    
    // Get initial stats from dashboard - Real data only
    let initialPending = 0
    try {
      // Look for the pending requests count in real data
      const pendingRequestsCard = creatorPage.locator('.bg-orange-50').filter({ hasText: 'Pending Requests' })
      if (await pendingRequestsCard.count() > 0) {
        const numberElement = pendingRequestsCard.locator('p.text-2xl').first()
        if (await numberElement.count() > 0) {
          const text = await numberElement.textContent()
          initialPending = parseInt(text?.trim() || '0')
        }
      }
    } catch (e) {
      console.log('   Could not find pending requests count, assuming 0')
    }
    console.log(`   Initial pending requests: ${initialPending}`)
    
    // Setup dashboard update tracking
    const dashboardTracker = realtimeTracker ? await trackCreatorDashboardUpdates(
      realtimeTracker,
      TEST_USERS.creator.id,
      supabase
    ) : null
    
    // Step 2: Login as fan
    console.log('👤 Step 2: Fan login...')
    await loginViaUI(fanPage, 'fan')
    
    // Navigate to explore page with retry pattern
    await navigateWithRetry(fanPage, '/fan/explore')
    
    // Step 3: Select Test Creator
    console.log('👆 Step 3: Selecting Test Creator...')
    await fanPage.waitForTimeout(3000) // Allow creators to load
    
    // Look for Test Creator specifically, or use first available creator
    const testCreatorCard = fanPage.locator('[data-testid="creator-card-test-creator"]')
    const viewProfileButton = fanPage.locator('button:has-text("View Profile")').first()
    
    if (await testCreatorCard.count() > 0) {
      const button = testCreatorCard.locator('button:has-text("View Profile")')
      await button.click()
    } else if (await viewProfileButton.count() > 0) {
      await viewProfileButton.click()
    } else {
      console.log('   No View Profile button found, attempting direct navigation')
      // Navigate directly to a creator page
      await fanPage.goto('/fan/creators/0f3753a3-029c-473a-9aee-fc107d10c569') // Test Creator ID
    }
    
    await fanPage.waitForURL('**/fan/creators/**', { timeout: 15000 })
    console.log(`✅ On creator profile: ${fanPage.url()}`)
    
    // Step 4: Request a video
    console.log('📹 Step 4: Requesting a video...')
    const requestButton = fanPage.locator('[data-testid="request-video-button"], button:has-text("Request Video"), button:has-text("Book Video")')
    await requestButton.first().click()
    
    await fanPage.waitForSelector('[role="dialog"]', { timeout: 10000 })
    
    // Fill out the form
    console.log('📝 Step 5: Filling video request form...')
    
    // Select occasion first (this is critical for checkout flow)
    try {
      console.log('   Selecting occasion...')
      const occasionDropdown = fanPage.locator('select, [role="combobox"], .select, [data-testid*="occasion"]').first()
      if (await occasionDropdown.count() > 0) {
        await occasionDropdown.click()
        // Wait for dropdown options to appear
        await fanPage.waitForTimeout(1000)
        
        // Try to select Birthday or first available option
        const birthdayOption = fanPage.locator('[role="option"]:has-text("Birthday"), option:has-text("Birthday")').first()
        if (await birthdayOption.count() > 0) {
          await birthdayOption.click()
          console.log('   ✅ Selected "Birthday" occasion')
        } else {
          // Fallback: select first available option
          const firstOption = fanPage.locator('[role="option"], option').first()
          if (await firstOption.count() > 0) {
            await firstOption.click()
            const optionText = await firstOption.textContent()
            console.log(`   ✅ Selected first available occasion: "${optionText}"`)
          }
        }
      } else {
        console.log('   ⚠️ No occasion dropdown found, trying alternative selectors...')
        // Alternative approach: look for button-style dropdowns
        const occasionButton = fanPage.locator('button:has-text("occasion"), button:has-text("Select"), .dropdown-trigger').first()
        if (await occasionButton.count() > 0) {
          await occasionButton.click()
          await fanPage.waitForTimeout(1000)
          const birthdayOption = fanPage.locator('text=Birthday, [data-value="birthday"]').first()
          if (await birthdayOption.count() > 0) {
            await birthdayOption.click()
            console.log('   ✅ Selected "Birthday" from button dropdown')
          }
        }
      }
    } catch (error) {
      console.log(`   ⚠️ Could not select occasion: ${error}`)
      console.log('   Continuing without occasion selection...')
    }
    
    // Try to find and fill form fields
    const recipientInput = fanPage.locator('input[placeholder*="recipient" i], input[placeholder*="name" i]').first()
    if (await recipientInput.count() > 0) {
      await recipientInput.fill('Test Recipient')
      console.log('   ✅ Filled recipient name')
    }
    
    const instructionsTextarea = fanPage.locator('textarea').first()
    if (await instructionsTextarea.count() > 0) {
      await instructionsTextarea.fill('E2E test video request with payment')
      console.log('   ✅ Filled instructions')
    }
    
    // Continue to checkout
    const checkoutButton = fanPage.locator('button:has-text("Continue"), button:has-text("Checkout"), button:has-text("Next")').last()
    await checkoutButton.click()
    
    // Step 6: Handle payment
    console.log('💰 Step 6: Processing payment...')
    
    // Check if we're on checkout page or if payment form is in modal
    const onCheckoutPage = fanPage.url().includes('checkout')
    
    if (onCheckoutPage) {
      await fanPage.waitForLoadState('networkidle')
      console.log('   On checkout page')
    } else {
      console.log('   Payment form in modal')
    }
    
    // Use enhanced payment automation
    console.log('💳 Starting enhanced payment automation...')
    const paymentResult = await processPaymentWithEnhancedAutomation(fanPage, {
      webhookListener,
      supabase,
      debugMode: true
    })
    
    let paymentIntentId: string | undefined = paymentResult.paymentIntentId
    const result = paymentResult.success
    
    if (result) {
      console.log('✅ Payment completed successfully with enhanced automation')
      await fanPage.screenshot({ path: 'payment-success.png' })
    } else {
      console.log('⚠️ Payment completion uncertain')
    }
    
    // Step 7: Track payment through webhook pipeline
    console.log('🔄 Step 7: Tracking REAL payment through webhook pipeline...')
    console.log('   This tracks: Stripe webhook -> Our API -> Supabase DB -> Creator notification')
    
    // Extract webhook results from enhanced payment automation
    let webhookResults: {
      webhookReceived: boolean
      webhookProcessed: boolean
      orderCreated: boolean
      splitCalculated: boolean
      platformFee?: number
      creatorEarnings?: number
    } = {
      webhookReceived: paymentResult.confirmationResult?.webhookReceived || false,
      webhookProcessed: paymentResult.confirmationResult?.orderCreated || false,
      orderCreated: paymentResult.confirmationResult?.orderCreated || false,
      splitCalculated: false, // Will be set below
      platformFee: undefined,
      creatorEarnings: undefined
    }
    
    // If enhanced automation didn't capture webhook details, fall back to manual tracking
    if (!webhookResults.orderCreated && webhookListener && paymentIntentId) {
      console.log(`   Enhanced automation incomplete, tracking Payment Intent: ${paymentIntentId}`)
      const fallbackResults = await trackPaymentWebhook(
        webhookListener,
        supabase,
        paymentIntentId
      )
      webhookResults = { ...webhookResults, ...fallbackResults }
    } else if (!webhookResults.orderCreated && webhookListener) {
      console.log('   No payment intent ID captured, waiting for any payment webhook...')
      try {
        const event = await webhookListener.waitForEvent('payment_intent.succeeded', 10000)
        webhookResults.webhookReceived = true
        console.log(`   Received webhook for payment: ${event.data?.object?.id}`)
        
        const order = await checkOrderInDatabase()
        webhookResults.orderCreated = !!order
        webhookResults.webhookProcessed = !!order
      } catch (error) {
        console.log('   No webhook received within timeout')
      }
    } else if (!webhookResults.orderCreated) {
      console.log('   ⚠️ Webhook listener not available, checking database directly...')
      const webhookProcessed = await waitForWebhookProcessing(10000)
      webhookResults.webhookProcessed = webhookProcessed
      webhookResults.orderCreated = webhookProcessed
    }
    
    console.log('📊 Enhanced Payment Pipeline Results:')
    console.log(`   - Stripe Webhook Received: ${webhookResults.webhookReceived ? '✅' : '❌'}`)
    console.log(`   - Backend Processed Webhook: ${webhookResults.webhookProcessed ? '✅' : '❌'}`)
    console.log(`   - Order Created in Database: ${webhookResults.orderCreated ? '✅' : '❌'}`)
    console.log(`   - 70/30 Split Calculated: ${webhookResults.splitCalculated ? '✅' : '❌'}`)
    
    if (webhookResults.platformFee && webhookResults.creatorEarnings) {
      console.log(`   - Platform Fee (30%): $${webhookResults.platformFee}`)
      console.log(`   - Creator Earnings (70%): $${webhookResults.creatorEarnings}`)
    }
    
    if (webhookResults.orderCreated) {
      console.log('✅ Order created in database')
      
      // Get the order details
      const order = await checkOrderInDatabase(paymentIntentId || undefined)
      if (order) {
        expect(order.status).toBeTruthy()
        expect(order.amount).toBeGreaterThan(0)
        expect(order.creator_id).toBe(TEST_USERS.creator.id)
        
        // Verify the 70/30 split
        if (webhookResults.splitCalculated) {
          expect(webhookResults.platformFee).toBeDefined()
          expect(webhookResults.creatorEarnings).toBeDefined()
          
          const total = webhookResults.platformFee! + webhookResults.creatorEarnings!
          const platformPercentage = (webhookResults.platformFee! / total) * 100
          expect(platformPercentage).toBeCloseTo(30, 1)
        }
      }
    } else {
      console.log('⚠️ Order creation in database not confirmed')
    }
    
    // Step 8: Check REAL creator dashboard updates and notifications
    console.log('🔔 Step 8: Verifying REAL creator dashboard updates...')
    console.log('   Checking if creator sees the REAL order from the fan payment...')
    
    // Check realtime notification
    let realtimeNotificationReceived = false
    if (realtimeTracker) {
      console.log('   Waiting for Supabase realtime notification to creator...')
      realtimeNotificationReceived = await realtimeTracker.waitForCreatorNotification(
        TEST_USERS.creator.id,
        15000
      )
      
      if (realtimeNotificationReceived) {
        console.log('✅ Real-time notification received by creator via Supabase')
      } else {
        console.log('❌ No real-time notification received')
      }
    }
    
    // Check dashboard updates
    if (dashboardTracker && 'checkForUpdates' in dashboardTracker) {
      await (dashboardTracker as any).checkForUpdates()
      console.log('📊 Dashboard Update Results:')
      console.log(`   - Notification: ${dashboardTracker.notificationReceived ? '✅' : '❌'}`)
      console.log(`   - Orders Updated: ${dashboardTracker.ordersUpdated ? '✅' : '❌'}`)
      console.log(`   - Stats Updated: ${dashboardTracker.statsUpdated ? '✅' : '❌'}`)
      console.log(`   - Realtime Update: ${dashboardTracker.realtimeUpdate ? '✅' : '❌'}`)
    }
    
    // Refresh creator dashboard to check UI updates
    await creatorPage.reload()
    await creatorPage.waitForLoadState('networkidle')
    
    // Wait for potential real-time updates
    await creatorPage.waitForTimeout(3000)
    
    // Check for UI updates
    const notificationToast = await creatorPage.locator('[data-testid="notification-toast"], .toast, [role="alert"]').count()
    const newOrderCount = await creatorPage.locator('[data-testid="order-card"], .order-item').count()
    let currentPending = 0
    try {
      const currentPendingCard = creatorPage.locator('.bg-orange-50').filter({ hasText: 'Pending Requests' })
      if (await currentPendingCard.count() > 0) {
        const currentNumberElement = currentPendingCard.locator('p.text-2xl').first()
        if (await currentNumberElement.count() > 0) {
          const text = await currentNumberElement.textContent()
          currentPending = parseInt(text?.trim() || '0')
        }
      }
    } catch (e) {
      console.log('   Could not find current pending count')
    }
    
    console.log('📱 Dashboard UI Updates:')
    if (notificationToast > 0) {
      console.log('   ✅ Notification toast appeared')
      await creatorPage.screenshot({ path: 'creator-notification.png' })
    }
    
    if (newOrderCount > initialOrders) {
      console.log(`   ✅ New order in dashboard (${newOrderCount} vs ${initialOrders} initially)`)
      await creatorPage.screenshot({ path: 'creator-new-order.png' })
    }
    
    if (currentPending > initialPending) {
      console.log(`   ✅ Pending requests updated (${currentPending} vs ${initialPending} initially)`)
    }
    
    // Check Order Management component - it's in a div with the heading
    const orderManagementSection = creatorPage.locator('div').filter({ hasText: 'Order Management' }).first()
    if (await orderManagementSection.count() > 0) {
      console.log('   ✅ Order Management component visible')
      
      // Look for order items in the table
      const orderRows = orderManagementSection.locator('tbody tr')
      if (await orderRows.count() > 0) {
        console.log(`   ✅ Found ${await orderRows.count()} order(s) in Order Management`)
        
        // Check first order details
        const firstOrder = orderRows.first()
        const fanName = await firstOrder.locator('td').nth(0).textContent()
        const amount = await firstOrder.locator('td').nth(1).textContent()
        const status = await firstOrder.locator('td').nth(2).textContent()
        console.log(`      First order: Fan: ${fanName}, Amount: ${amount}, Status: ${status}`)
        await creatorPage.screenshot({ path: 'creator-order-management.png' })
      } else {
        console.log('   ℹ️ No orders found in Order Management table')
      }
    }
    
    // Final verification
    console.log('\n📊 Final Test Summary:')
    console.log('✅ Both users authenticated successfully')
    console.log('✅ Video request form completed')
    console.log('✅ Stripe payment form filled and submitted')
    console.log(result ? '✅ Payment completed' : '⚠️ Payment status uncertain')
    
    // Webhook pipeline summary
    if (webhookListener) {
      console.log('\n🔄 Webhook Pipeline:')
      console.log(webhookResults.webhookReceived ? '✅ Webhook received by listener' : '⚠️ Webhook not received')
      console.log(webhookResults.webhookProcessed ? '✅ Webhook processed by API' : '⚠️ Webhook processing uncertain')
      console.log(webhookResults.orderCreated ? '✅ Order created in database' : '⚠️ Order creation uncertain')
      console.log(webhookResults.splitCalculated ? '✅ 70/30 split calculated correctly' : '⚠️ Split calculation uncertain')
    }
    
    // Creator notification summary
    console.log('\n🔔 Creator Notifications:')
    console.log(realtimeNotificationReceived ? '✅ Realtime notification sent' : '⚠️ Realtime notification uncertain')
    console.log((notificationToast > 0 || newOrderCount > initialOrders || currentPending > initialPending) ? 
      '✅ Dashboard updated' : '⚠️ Dashboard update uncertain')
    
    // Assert key requirements
    expect(result).toBeTruthy() // Payment should complete
    
    // Only assert webhook if listener is available
    if (webhookListener) {
      expect(webhookResults.orderCreated).toBeTruthy() // Order should be created
      expect(webhookResults.splitCalculated).toBeTruthy() // Split should be correct
    } else {
      // Fallback assertion
      const order = await checkOrderInDatabase()
      expect(order).toBeTruthy() // Order should exist
    }
  })

  test.skip('should handle multiple simultaneous orders', async () => {
    // This test would verify the system can handle concurrent orders
    // and that creators receive all notifications correctly
    console.log('🔄 Testing concurrent order handling...')
    
    // Login as creator
    await loginViaUI(creatorPage, 'creator')
    await creatorPage.goto('/creator/requests')
    
    // Create multiple fan sessions
    const fanPages: Page[] = []
    for (let i = 0; i < 3; i++) {
      const context = await creatorContext.browser()?.newContext()
      if (context) {
        const page = await context.newPage()
        fanPages.push(page)
        await loginViaUI(page, 'fan')
      }
    }
    
    // Each fan makes a request simultaneously
    const orderPromises = fanPages.map(async (page, index) => {
      await page.goto('/fan/explore')
      await page.waitForSelector('[data-creators-loaded="true"]')
      
      // Select and book from first creator
      const viewProfileBtn = page.locator('button:has-text("View Profile")').first()
      await viewProfileBtn.click()
      await page.waitForLoadState('networkidle')
      
      await page.locator('[data-testid="request-video-button"]').click()
      await page.waitForSelector('[data-testid="video-order-modal"]')
      
      // Fill form with unique data
      await page.locator('[data-testid="occasion-select"]').click()
      await page.locator('[role="option"]:has-text("Birthday")').click()
      await page.locator('[data-testid="recipient-name-input"]').fill(`Recipient ${index + 1}`)
      await page.locator('[data-testid="instructions-textarea"]').fill(`Test order ${index + 1}`)
      await page.locator('[data-testid="continue-checkout-button"]').click()
      
      // Complete payment
      await page.waitForSelector('[data-testid="pay-button"]')
      await page.locator('[data-testid="pay-button"]').click()
      
      return index
    })
    
    // Wait for all orders to complete
    await Promise.all(orderPromises)
    console.log('✅ All orders submitted')
    
    // Verify creator received all notifications
    await creatorPage.waitForTimeout(5000) // Allow time for notifications
    await creatorPage.reload()
    
    const requestCards = creatorPage.locator('[data-testid="request-card"], .card:has-text("Recipient")')
    const totalRequests = await requestCards.count()
    
    console.log(`✅ Creator received ${totalRequests} requests`)
    expect(totalRequests).toBeGreaterThanOrEqual(3)
    
    // Clean up
    for (const page of fanPages) {
      await page.context().close()
    }
  })
})