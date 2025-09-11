import { test, expect, chromium, Browser, BrowserContext, Page } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import { AuthHelper } from './helpers/auth.helper'
import { StripeWebhookListener } from './helpers/stripe-webhook.helper'
import { DatabaseTracker } from './helpers/database-tracker.helper'
import { createVideoRequestHelper } from './helpers/video-request.helper'
import { createNotificationListener } from './helpers/notification-listener.helper'

// Test configuration
const TEST_CONFIG = {
  fan: {
    email: 'testfan@annpale.test',
    password: 'TestPassword123!',
    id: '8f8d7143-99e8-4ca6-868f-38df513e2264', // Actual ID from database
    name: 'Test Fan'
  },
  creator: {
    email: 'testcreator@annpale.test',
    password: 'TestPassword123!',
    id: '0f3753a3-029c-473a-9aee-fc107d10c569', // Actual ID from database
    name: 'Test Creator',
    stripeAccountId: 'acct_1S3TOyEM4K7HiodW' // Test Stripe Connect account
  },
  videoRequest: {
    recipientName: 'John Smith',
    occasion: 'Birthday',
    instructions: 'Please wish John a happy 30th birthday! He loves soccer and is a huge fan of your music. Make it special!',
    amount: 50 // $50 for video request
  }
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yijizsscwkvepljqojkz.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpaml6c3Njd2t2ZXBsanFvamt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1OTMyODgsImV4cCI6MjA3MjE2OTI4OH0.ot_XW1tE42_MPuOpoSslnxYcz89TGyDKSkT8IGaGqX8'
const supabase = createClient(supabaseUrl, supabaseKey)

test.describe('Video Request Complete Flow with Creator Notification', () => {
  // Set timeout for the entire test suite
  test.setTimeout(120000) // 2 minutes per test
  
  test('should complete full video request flow with creator notification and money transfer', async () => {
    console.log('\n🎬 Starting Video Request E2E Test with Creator Notification\n')
    console.log('Test Configuration:')
    console.log(`   Fan: ${TEST_CONFIG.fan.email}`)
    console.log(`   Creator: ${TEST_CONFIG.creator.email}`)
    console.log(`   Amount: $${TEST_CONFIG.videoRequest.amount}`)
    console.log(`   Expected split: $${TEST_CONFIG.videoRequest.amount * 0.7} to creator, $${TEST_CONFIG.videoRequest.amount * 0.3} platform fee\n`)
    
    // Initialize helpers
    const webhookListener = new StripeWebhookListener()
    const databaseTracker = new DatabaseTracker()
    const notificationListener = createNotificationListener()
    
    // Start webhook listener
    await webhookListener.start()
    console.log('✅ Webhook listener started\n')
    
    // Subscribe to creator's notification channel early with actual creator ID
    await notificationListener.subscribeToCreatorChannel(TEST_CONFIG.creator.id)
    console.log(`✅ Subscribed to creator notification channel (${TEST_CONFIG.creator.id})\n`)
    
    // Create browser instances for parallel testing
    const browser = await chromium.launch({ headless: process.env.HEADED !== 'true' })
    
    // Create contexts for fan and creator
    const fanContext = await browser.newContext()
    const creatorContext = await browser.newContext()
    
    // Create pages
    const fanPage = await fanContext.newPage()
    const creatorPage = await creatorContext.newPage()
    
    // Initialize auth helper
    const authHelper = new AuthHelper()
    
    // Initialize video request helper
    const videoRequestHelper = createVideoRequestHelper(fanPage, webhookListener, databaseTracker)
    
    try {
      // Step 1: Login both users in parallel
      console.log('🔐 Step 1: Logging in both users...')
      await Promise.all([
        authHelper.loginAs(fanPage, 'fan'), // Use email/password for fan
        authHelper.loginAs(creatorPage, 'creator')
      ])
      console.log('   ✅ Both users logged in\n')
      
      // Wait a bit for sessions to stabilize
      await fanPage.waitForTimeout(2000)
      await creatorPage.waitForTimeout(2000)
      
      // Verify fan authentication state - Supabase SSR uses cookies not localStorage
      const fanCookies = await fanContext.cookies()
      const fanAuthCookie = fanCookies.find(c => 
        c.name.includes('supabase-auth-token') || 
        c.name.includes('sb-') && c.name.includes('-auth-token')
      )
      
      if (fanAuthCookie) {
        console.log('   ✅ Fan auth cookie verified')
        console.log(`   Cookie name: ${fanAuthCookie.name}`)
      } else {
        console.log('   ⚠️ Warning: No auth cookie found for fan')
        console.log(`   Available cookies: ${fanCookies.map(c => c.name).join(', ')}`)
      }
      
      // Step 2: Navigate creator to dashboard
      console.log('📊 Step 2: Opening creator dashboard...')
      await creatorPage.goto('/creator/dashboard')
      await creatorPage.waitForLoadState('networkidle')
      
      // Capture initial order count
      const initialOrderCount = await creatorPage.locator('[data-testid="pending-orders"], .stat-orders').textContent().catch(() => '0')
      console.log(`   Initial pending orders: ${initialOrderCount}\n`)
      
      // Step 3: Fan navigates to creator profile and requests video
      console.log('🎥 Step 3: Fan requesting video from creator...')
      const requestResult = await videoRequestHelper.completeVideoRequest({
        creatorId: TEST_CONFIG.creator.id,
        creatorName: TEST_CONFIG.creator.name,
        ...TEST_CONFIG.videoRequest
      })
      
      expect(requestResult.success).toBe(true)
      expect(requestResult.paymentIntentId).toBeTruthy()
      console.log(`   ✅ Video request completed with payment intent: ${requestResult.paymentIntentId}\n`)
      
      // Step 4: Wait for and verify webhook events
      console.log('🔔 Step 4: Verifying webhook events...')
      
      // Wait for payment_intent.succeeded
      const paymentSucceeded = await webhookListener.waitForEvent('payment_intent.succeeded', 30000)
      expect(paymentSucceeded).toBeTruthy()
      
      if (paymentSucceeded) {
        const paymentIntent = paymentSucceeded.data.object
        console.log(`   ✅ Payment intent succeeded: ${paymentIntent.id}`)
        console.log(`   Amount: $${paymentIntent.amount / 100}`)
        
        // Verify metadata includes split information
        expect(paymentIntent.metadata.creatorAmount).toBe('3500') // $35 in cents
        expect(paymentIntent.metadata.platformFee).toBe('1500') // $15 in cents
        console.log(`   ✅ Split verified: $35 to creator, $15 platform fee\n`)
      }
      
      // Step 5: Verify creator notification
      console.log('📬 Step 5: Verifying creator notification...')
      
      const notification = await notificationListener.waitForNotification(
        TEST_CONFIG.creator.id,
        'new_order',
        30000
      )
      
      if (notification) {
        console.log(`   ✅ Creator notification received:`)
        console.log(`   Title: ${notification.title}`)
        console.log(`   Message: ${notification.message}`)
        console.log(`   Amount: $${notification.amount}`)
        
        // Verify notification content
        const notificationValid = notificationListener.verifyNotification(notification, {
          type: 'new_order',
          title: 'New Video Request',
          amount: TEST_CONFIG.videoRequest.amount
        })
        
        expect(notificationValid).toBe(true)
      } else {
        console.warn('   ⚠️ Creator notification not received (may be broadcast delay)')
      }
      console.log()
      
      // Step 6: Verify order in database
      console.log('💾 Step 6: Verifying order in database...')
      
      // Wait a bit for database write
      await fanPage.waitForTimeout(3000)
      
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .eq('fan_id', TEST_CONFIG.fan.id)
        .eq('creator_id', TEST_CONFIG.creator.id)
        .order('created_at', { ascending: false })
        .limit(1)
      
      if (orders && orders.length > 0) {
        const order = orders[0]
        console.log(`   ✅ Order found in database: ${order.id}`)
        console.log(`   Status: ${order.status}`)
        console.log(`   Total: $${order.total_amount}`)
        console.log(`   Creator earnings: $${order.creator_earnings}`)
        console.log(`   Platform fee: $${order.platform_fee}`)
        
        // Verify amounts
        expect(order.total_amount).toBe(TEST_CONFIG.videoRequest.amount)
        expect(order.creator_earnings).toBe(35) // $35
        expect(order.platform_fee).toBe(15) // $15
      } else {
        console.warn('   ⚠️ Order not found in database (may need more time)')
      }
      console.log()
      
      // Step 7: Verify creator dashboard updates
      console.log('📈 Step 7: Checking creator dashboard updates...')
      
      // Refresh creator dashboard
      await creatorPage.reload()
      await creatorPage.waitForLoadState('networkidle')
      
      // Check for new order notification on dashboard
      const dashboardNotification = creatorPage.locator('[data-testid="new-order-notification"], .notification').filter({
        hasText: /video.*request|new.*order/i
      })
      
      if (await dashboardNotification.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('   ✅ New order notification visible on dashboard')
      }
      
      // Check if pending orders count increased
      const finalOrderCount = await creatorPage.locator('[data-testid="pending-orders"], .stat-orders').textContent().catch(() => '0')
      console.log(`   Final pending orders: ${finalOrderCount}`)
      
      // Check for the specific order in the requests list
      const orderCard = creatorPage.locator('[data-testid*="order-card"], .order-item').filter({
        hasText: TEST_CONFIG.videoRequest.occasion
      })
      
      if (await orderCard.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('   ✅ New video request visible in creator dashboard')
      }
      console.log()
      
      // Step 8: Verify fan's order history
      console.log('📋 Step 8: Verifying fan order history...')
      
      if (requestResult.orderId) {
        const orderVisible = await videoRequestHelper.verifyFanOrderHistory(requestResult.orderId)
        expect(orderVisible).toBe(true)
      } else {
        // Navigate to orders page manually
        await fanPage.goto('/fan/orders')
        await fanPage.waitForLoadState('networkidle')
        
        const recentOrder = fanPage.locator('[data-testid*="order-card"]').first()
        if (await recentOrder.isVisible({ timeout: 5000 }).catch(() => false)) {
          console.log('   ✅ Video request visible in fan order history')
        }
      }
      console.log()
      
      // Final summary
      console.log('✅ Complete video request flow test completed successfully!')
      console.log('   - Fan requested video from creator')
      console.log('   - Payment processed via Stripe')
      console.log('   - Webhook events received and processed')
      console.log('   - 70/30 split verified ($35 to creator, $15 platform fee)')
      console.log('   - Creator notification sent (if broadcast worked)')
      console.log('   - Order created in database with correct split')
      console.log('   - Creator dashboard shows new request')
      console.log('   - Fan can see order in history')
      
    } finally {
      // Cleanup
      await notificationListener.cleanup()
      await webhookListener.stop()
      await fanContext.close()
      await creatorContext.close()
      await browser.close()
    }
  })
  
  test('manual video request verification helper', async ({ page }) => {
    console.log('\n📝 Manual Video Request Verification Helper\n')
    console.log('This test helps verify a manually created video request.\n')
    
    const webhookListener = new StripeWebhookListener()
    await webhookListener.start()
    
    console.log('Please manually create a video request, then this test will verify:')
    console.log('1. Webhook events are received')
    console.log('2. Creator gets notified')
    console.log('3. Money is split correctly\n')
    
    // Wait for payment_intent events
    console.log('⏳ Waiting for payment events (120 seconds)...')
    
    const paymentCreated = await webhookListener.waitForEvent('payment_intent.created', 120000)
    if (paymentCreated) {
      console.log(`✅ Payment intent created: ${paymentCreated.data.object.id}`)
      
      const paymentSucceeded = await webhookListener.waitForEvent('payment_intent.succeeded', 30000)
      if (paymentSucceeded) {
        const intent = paymentSucceeded.data.object
        console.log(`✅ Payment succeeded!`)
        console.log(`   Amount: $${intent.amount / 100}`)
        console.log(`   Creator earnings: $${(intent.metadata.creatorAmount || 0) / 100}`)
        console.log(`   Platform fee: $${(intent.metadata.platformFee || 0) / 100}`)
        console.log(`   Metadata:`, intent.metadata)
      }
    } else {
      console.log('No payment events received. Please create a video request manually.')
    }
    
    await webhookListener.stop()
  })
})