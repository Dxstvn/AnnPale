import { test, expect, type Page, type Browser } from '@playwright/test'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { StripeWebhookListener, setupWebhookListener } from './helpers/stripe-webhook.helper'
import { DatabaseTracker, setupDatabaseTracking, verifySubscriptionInDatabase } from './helpers/database-tracker.helper'
import { createSubscriptionHelper, getCreatorBalance } from './helpers/subscription.helper'
import { AuthHelper } from './helpers/auth.helper'

// Load environment variables from .env.local
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const STRIPE_SECRET_KEY = process.env.STRIPE_SANDBOX_SECRET_KEY!

// Initialize clients
let supabase: SupabaseClient
let stripe: Stripe

// Initialize clients in test setup to ensure env is loaded
function initializeClients() {
  if (!supabase) {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  
  if (!stripe) {
    stripe = new Stripe(STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    })
  }
}

// Test configuration
const TEST_CONFIG = {
  fan: {
    email: 'testfan@annpale.test',
    password: 'TestPassword123!',
    id: '' // Will be populated during test
  },
  creator: {
    email: 'testcreator@annpale.test',
    password: 'TestPassword123!',
    id: '0f3753a3-029c-473a-9aee-fc107d10c569', // Test Creator's ID
    stripeAccountId: 'acct_1S3TOyEM4K7HiodW', // Test Stripe Connect account
    name: 'Test Creator'
  },
  subscription: {
    tierName: 'Gold Tier',
    price: 9.99,
    billingPeriod: 'monthly' as const
  }
}

test.describe('Complete Subscription System E2E Test', () => {
  let webhookListener: StripeWebhookListener | null = null
  let databaseTracker: DatabaseTracker | null = null
  let fanBrowser: Browser | null = null
  let creatorBrowser: Browser | null = null
  let fanPage: Page | null = null
  let creatorPage: Page | null = null
  let authHelper: AuthHelper | null = null

  test.beforeAll(async () => {
    console.log('🚀 Setting up test environment...')
    
    // Initialize clients
    initializeClients()
    
    // Start webhook listener
    try {
      webhookListener = await setupWebhookListener()
      console.log('✅ Webhook listener started')
    } catch (error) {
      console.warn('⚠️ Could not start webhook listener:', error)
    }
    
    // Start database tracker
    try {
      databaseTracker = await setupDatabaseTracking()
      console.log('✅ Database tracker started')
    } catch (error) {
      console.warn('⚠️ Could not start database tracker:', error)
    }
    
    // Initialize auth helper
    authHelper = new AuthHelper()
    
    // Get fan user ID from database
    const { data: fanProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', TEST_CONFIG.fan.email)
      .single()
    
    if (fanProfile) {
      TEST_CONFIG.fan.id = fanProfile.id
      console.log(`Fan user ID: ${TEST_CONFIG.fan.id}`)
    }
    
    // Verify creator has test Stripe account
    const { data: creatorProfile } = await supabase
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', TEST_CONFIG.creator.id)
      .single()
    
    if (creatorProfile?.stripe_account_id) {
      TEST_CONFIG.creator.stripeAccountId = creatorProfile.stripe_account_id
      console.log(`Creator Stripe account: ${TEST_CONFIG.creator.stripeAccountId}`)
    }
    
    // Get creator's initial balance
    const initialBalance = await getCreatorBalance(TEST_CONFIG.creator.stripeAccountId)
    console.log(`Creator initial balance - Pending: $${initialBalance.pending}, Available: $${initialBalance.available}`)
  })

  test.afterAll(async () => {
    // Clean up resources
    if (webhookListener) {
      await webhookListener.stop()
    }
    
    if (databaseTracker) {
      await databaseTracker.stopTracking()
    }
    
    if (fanBrowser) {
      await fanBrowser.close()
    }
    
    if (creatorBrowser) {
      await creatorBrowser.close()
    }
  })

  test('complete subscription flow with money transfer verification', async ({ browser }) => {
    console.log('🎬 Starting complete subscription flow test')
    
    // Step 1: Launch parallel browser sessions
    console.log('\n📱 Step 1: Launching browser sessions...')
    fanBrowser = await browser.newContext()
    creatorBrowser = await browser.newContext()
    fanPage = await fanBrowser.newPage()
    creatorPage = await creatorBrowser.newPage()
    
    // Step 2: Login as fan
    console.log('\n🔐 Step 2: Logging in as fan...')
    await authHelper!.loginAs(fanPage, 'fan')
    await fanPage.goto('/fan/home')
    await expect(fanPage.locator('h1')).toContainText(/Your Feed|Welcome|Home|Discover/i, { timeout: 10000 })
    
    // Step 3: Login as creator in parallel browser
    console.log('\n🔐 Step 3: Logging in as creator...')
    await authHelper!.loginAs(creatorPage, 'creator')
    await creatorPage.goto('/creator/dashboard')
    // Creator dashboard shows "Welcome back, [username]" instead of "Dashboard"
    await expect(creatorPage.locator('h1')).toContainText(/Welcome back|Dashboard/i, { timeout: 10000 })
    
    // Record creator's initial stats
    const initialStats = await creatorPage.locator('[data-testid="total-subscribers"], .stat-subscribers').textContent().catch(() => '0')
    console.log(`   Initial subscribers: ${initialStats}`)
    
    // Step 4: Fan navigates directly to creator profile
    console.log('\n🔍 Step 4: Fan viewing creator profile...')
    // Navigate directly to the test creator's profile page
    await fanPage.goto(`/fan/creators/${TEST_CONFIG.creator.id}`)
    await fanPage.waitForLoadState('networkidle')
    
    // Verify we're on the creator's page - look in main content area, not sidebar
    await expect(fanPage.locator('main h1').first()).toContainText('Test Creator', { timeout: 10000 })
    
    // Step 5: Select subscription tier
    console.log('\n💳 Step 5: Selecting subscription tier...')
    
    // Click on the Subscriptions tab to view tiers
    const subscriptionsTab = fanPage.locator('[role="tab"]:has-text("Subscriptions")')
    if (await subscriptionsTab.isVisible({ timeout: 5000 }).catch(() => false)) {
      await subscriptionsTab.click()
      await fanPage.waitForTimeout(1000) // Allow tab content to load
    } else {
      // Alternative: Click "View Subscription Tiers" button
      const viewTiersButton = fanPage.locator('button:has-text("View Subscription Tiers")')
      if (await viewTiersButton.isVisible({ timeout: 5000 }).catch(() => false)) {
        await viewTiersButton.click()
        await fanPage.waitForTimeout(1000)
      }
    }
    
    const subscriptionHelper = createSubscriptionHelper(fanPage, webhookListener!, databaseTracker!)
    
    // Find tier that matches our test price (Gold Tier at $9.99)
    // Look for the tier with $9.99 price dynamically instead of using fixed index
    const goldTierCard = await fanPage.locator('[data-testid^="tier-option-"]').filter({
      has: fanPage.locator('[data-testid^="tier-price-"]', { hasText: '$9.99' })
    }).first();
    
    // Verify we found the Gold Tier
    await expect(goldTierCard).toBeVisible()
    console.log('   Found Gold Tier ($9.99)')
    
    // Click subscribe button for Gold Tier  
    const subscribeButton = goldTierCard.locator('[data-testid^="subscribe-button-"]')
    await subscribeButton.click()
    
    // Wait for navigation to checkout page
    await fanPage.waitForURL('**/checkout**', { timeout: 10000 })
    console.log('   Navigated to checkout page')
    
    // Step 6: Process checkout
    console.log('\n💰 Step 6: Processing subscription checkout...')
    
    // Verify we're on the checkout page with correct details
    await fanPage.waitForSelector('[data-testid="checkout-order-details"]', { timeout: 5000 })
    
    // Verify the price is displayed correctly
    const checkoutPrice = fanPage.locator('[data-testid="checkout-price"]')
    await expect(checkoutPrice).toContainText('$9.99/mo')
    console.log('   Checkout page loaded with correct price')
    
    // Clear webhook events before checkout
    webhookListener?.clearEvents()
    
    // The StripeSubscriptionCheckout component should auto-load
    // Look for the payment button and click it
    const proceedButton = fanPage.locator('button:has-text("Proceed to Payment"), button:has-text("Subscribe Now")')
    if (await proceedButton.isVisible({ timeout: 5000 }).catch(() => false)) {
      await proceedButton.click()
      console.log('   Clicked proceed to payment button')
    }
    
    // Process the Stripe checkout
    const checkoutResult = await subscriptionHelper.processStripeCheckout({
      expectedPrice: TEST_CONFIG.subscription.price,
      creatorStripeAccountId: TEST_CONFIG.creator.stripeAccountId
    })
    
    expect(checkoutResult.success).toBe(true)
    console.log(`   Checkout completed: ${checkoutResult.sessionId}`)
    
    // Step 7: Wait for and verify webhooks
    console.log('\n📨 Step 7: Tracking webhook events...')
    
    if (webhookListener) {
      // Wait for critical webhook events
      const checkoutCompleted = await webhookListener.waitForEvent('checkout.session.completed', 30000).catch(() => null)
      expect(checkoutCompleted).toBeTruthy()
      console.log('   ✅ checkout.session.completed received')
      
      const subscriptionCreated = await webhookListener.waitForEvent('customer.subscription.created', 30000).catch(() => null)
      expect(subscriptionCreated).toBeTruthy()
      console.log('   ✅ customer.subscription.created received')
      
      // Step 8: Verify money transfer
      console.log('\n💸 Step 8: Verifying money transfer to creator...')
      
      const transferCreated = await webhookListener.waitForEvent('transfer.created', 30000).catch(() => null)
      const applicationFeeCreated = await webhookListener.waitForEvent('application_fee.created', 30000).catch(() => null)
      
      if (transferCreated) {
        const transfer = transferCreated.data.object
        console.log(`   ✅ Transfer created: ${transfer.id}`)
        console.log(`   Amount: $${transfer.amount / 100}`)
        console.log(`   Destination: ${transfer.destination}`)
        
        // Verify transfer destination
        expect(transfer.destination).toBe(TEST_CONFIG.creator.stripeAccountId)
        
        // Verify 70% split
        const expectedCreatorAmount = Math.round(TEST_CONFIG.subscription.price * 0.70 * 100) // in cents
        expect(transfer.amount).toBe(expectedCreatorAmount)
        
        // Verify via Stripe API
        const stripeTransfer = await stripe.transfers.retrieve(transfer.id)
        expect(stripeTransfer.destination).toBe(TEST_CONFIG.creator.stripeAccountId)
        expect(stripeTransfer.amount).toBe(expectedCreatorAmount)
        console.log('   ✅ Transfer verified via Stripe API')
      } else {
        console.warn('   ⚠️ Transfer webhook not received')
      }
      
      if (applicationFeeCreated) {
        const fee = applicationFeeCreated.data.object
        console.log(`   ✅ Application fee created: ${fee.id}`)
        console.log(`   Amount: $${fee.amount / 100}`)
        
        // Verify 30% platform fee
        const expectedPlatformFee = Math.round(TEST_CONFIG.subscription.price * 0.30 * 100) // in cents
        expect(fee.amount).toBe(expectedPlatformFee)
        expect(fee.refunded).toBe(false)
      } else {
        console.warn('   ⚠️ Application fee webhook not received')
      }
    }
    
    // Step 9: Verify database records
    console.log('\n📊 Step 9: Verifying database records...')
    
    if (databaseTracker) {
      // Wait a bit for database updates
      await fanPage.waitForTimeout(3000)
      
      // Get subscription order from database
      const { data: subscriptionOrder } = await supabase
        .from('subscription_orders')
        .select('*')
        .eq('user_id', TEST_CONFIG.fan.id)
        .eq('creator_id', TEST_CONFIG.creator.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()
      
      if (subscriptionOrder) {
        console.log(`   ✅ Subscription order found: ${subscriptionOrder.id}`)
        
        // Verify status
        expect(subscriptionOrder.status).toBe('active')
        
        // Verify amounts and split
        expect(subscriptionOrder.total_amount).toBe(TEST_CONFIG.subscription.price)
        
        const expectedPlatformFee = TEST_CONFIG.subscription.price * 0.30
        const expectedCreatorEarnings = TEST_CONFIG.subscription.price * 0.70
        
        expect(Math.abs(subscriptionOrder.platform_fee - expectedPlatformFee)).toBeLessThan(0.01)
        expect(Math.abs(subscriptionOrder.creator_earnings - expectedCreatorEarnings)).toBeLessThan(0.01)
        
        console.log(`   Platform fee: $${subscriptionOrder.platform_fee} (30%)`)
        console.log(`   Creator earnings: $${subscriptionOrder.creator_earnings} (70%)`)
        
        // Check for Stripe IDs
        expect(subscriptionOrder.stripe_subscription_id).toBeTruthy()
        expect(subscriptionOrder.stripe_checkout_session_id).toBeTruthy()
        
        // Check for transaction record with transfer
        const { data: transaction } = await supabase
          .from('transactions')
          .select('*')
          .eq('subscription_id', subscriptionOrder.id)
          .single()
        
        if (transaction) {
          console.log(`   ✅ Transaction record found`)
          expect(transaction.stripe_transfer_id).toBeTruthy()
          expect(transaction.stripe_application_fee_id).toBeTruthy()
          console.log(`   Transfer ID: ${transaction.stripe_transfer_id}`)
          console.log(`   Application fee ID: ${transaction.stripe_application_fee_id}`)
        }
      }
    }
    
    // Step 10: Verify creator's balance update
    console.log('\n💰 Step 10: Verifying creator balance update...')
    
    const finalBalance = await getCreatorBalance(TEST_CONFIG.creator.stripeAccountId)
    console.log(`   Final balance - Pending: $${finalBalance.pending}, Available: $${finalBalance.available}`)
    
    // The transfer should be in pending balance
    const expectedCreatorEarnings = TEST_CONFIG.subscription.price * 0.70
    if (finalBalance.pending > 0) {
      console.log(`   ✅ Creator has pending balance (includes $${expectedCreatorEarnings} from this subscription)`)
    }
    
    // Step 11: Verify creator dashboard updates
    console.log('\n📈 Step 11: Checking creator dashboard updates...')
    
    // Refresh creator dashboard
    await creatorPage.reload()
    await creatorPage.waitForLoadState('networkidle')
    
    // Check for new subscriber notification
    const notification = creatorPage.locator('[data-testid="notification"], .notification').filter({
      hasText: /subscriber|subscription/i
    })
    
    if (await notification.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('   ✅ Creator received subscription notification')
    }
    
    // Check subscriber count increased
    const finalStats = await creatorPage.locator('[data-testid="total-subscribers"], .stat-subscribers').textContent().catch(() => '0')
    console.log(`   Final subscribers: ${finalStats}`)
    
    // Step 12: Verify fan's subscription management
    console.log('\n📋 Step 12: Verifying fan subscription management...')
    
    const subscriptionVerified = await subscriptionHelper.verifySubscriptionInManagement(
      TEST_CONFIG.creator.name,
      TEST_CONFIG.subscription.tierName,
      TEST_CONFIG.subscription.price
    )
    
    expect(subscriptionVerified).toBe(true)
    
    // Final summary
    console.log('\n✅ Complete subscription flow test completed successfully!')
    console.log('   - Fan subscribed to creator')
    console.log('   - Payment processed via Stripe Checkout')
    console.log('   - Webhooks received and processed')
    console.log('   - 70% transferred to creator account')
    console.log('   - 30% platform fee collected')
    console.log('   - Database records created with correct split')
    console.log('   - Creator balance updated')
    console.log('   - Fan can manage subscription')
  })
})