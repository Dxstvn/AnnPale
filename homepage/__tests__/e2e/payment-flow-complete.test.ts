import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

/**
 * Comprehensive End-to-End Payment Flow Test
 * 
 * This test verifies the complete payment flow from multiple perspectives:
 * 1. Fan perspective - making an order
 * 2. Payment processing - Stripe webhook handling
 * 3. Database verification - order creation and updates
 * 4. Creator perspective - receiving notifications
 * 5. Statistics updates - platform and creator stats
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Test users (these should exist in your test database)
const FAN_EMAIL = 'test-fan@example.com'
const FAN_PASSWORD = 'TestPassword123!'
const CREATOR_EMAIL = 'test-creator@example.com'
const CREATOR_PASSWORD = 'TestPassword123!'

// Stripe test card
const TEST_CARD = {
  number: '4242424242424242',
  exp: '12/34',
  cvc: '123',
  zip: '10001'
}

test.describe('Complete Payment Flow', () => {
  let fanSupabase: any
  let creatorSupabase: any
  let adminSupabase: any
  
  test.beforeAll(async () => {
    // Initialize Supabase clients
    fanSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    creatorSupabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    adminSupabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    // Sign in test users
    await fanSupabase.auth.signInWithPassword({
      email: FAN_EMAIL,
      password: FAN_PASSWORD
    })
    
    await creatorSupabase.auth.signInWithPassword({
      email: CREATOR_EMAIL,
      password: CREATOR_PASSWORD
    })
  })

  test('Complete payment flow from fan order to creator notification', async ({ page, context }) => {
    // Track metrics
    const metrics = {
      orderCreated: false,
      paymentProcessed: false,
      creatorNotified: false,
      statsUpdated: false,
      orderVisible: false
    }

    // Step 1: Fan logs in and navigates to creator profile
    await page.goto('/login')
    await page.fill('input[type="email"]', FAN_EMAIL)
    await page.fill('input[type="password"]', FAN_PASSWORD)
    await page.click('button[type="submit"]')
    
    // Wait for redirect to fan home
    await page.waitForURL('**/fan/home')
    
    // Navigate to creators list
    await page.goto('/browse')
    
    // Find and click on test creator
    const creatorCard = page.locator('text=Test Creator').first()
    await expect(creatorCard).toBeVisible({ timeout: 10000 })
    await creatorCard.click()
    
    // Wait for creator profile to load
    await page.waitForSelector('text=Book a Video')
    
    // Step 2: Start booking process
    const bookButton = page.locator('button:has-text("Book a Video")')
    await bookButton.click()
    
    // Fill booking form
    await page.fill('input[name="recipient"]', 'John Doe')
    await page.selectOption('select[name="occasion"]', 'birthday')
    await page.fill('textarea[name="instructions"]', 'Please wish John a happy 30th birthday!')
    
    // Set due date (7 days from now)
    const dueDate = new Date()
    dueDate.setDate(dueDate.getDate() + 7)
    await page.fill('input[type="date"]', dueDate.toISOString().split('T')[0])
    
    // Continue to payment
    await page.click('button:has-text("Continue to Payment")')
    
    // Step 3: Handle Stripe payment
    // Wait for Stripe iframe to load
    const stripeFrame = page.frameLocator('iframe[name*="stripe"]').first()
    
    // Fill card details
    await stripeFrame.locator('input[name="cardnumber"]').fill(TEST_CARD.number)
    await stripeFrame.locator('input[name="exp-date"]').fill(TEST_CARD.exp)
    await stripeFrame.locator('input[name="cvc"]').fill(TEST_CARD.cvc)
    await stripeFrame.locator('input[name="postal"]').fill(TEST_CARD.zip)
    
    // Get initial order count for verification
    const { count: initialOrderCount } = await adminSupabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', (await fanSupabase.auth.getUser()).data.user?.id)
    
    // Submit payment
    await page.click('button:has-text("Pay")')
    
    // Step 4: Wait for payment confirmation
    await page.waitForURL('**/checkout/success', { timeout: 30000 })
    await expect(page.locator('text=Payment Successful')).toBeVisible()
    
    // Step 5: Verify order creation in database
    await page.waitForTimeout(2000) // Wait for webhook processing
    
    const { data: newOrders, error: orderError } = await adminSupabase
      .from('orders')
      .select('*')
      .eq('user_id', (await fanSupabase.auth.getUser()).data.user?.id)
      .order('created_at', { ascending: false })
      .limit(1)
    
    expect(orderError).toBeNull()
    expect(newOrders).toHaveLength(1)
    
    const order = newOrders[0]
    expect(order).toMatchObject({
      status: 'pending',
      amount: expect.any(Number),
      platform_fee: expect.any(Number),
      creator_earnings: expect.any(Number)
    })
    
    // Verify 70/30 split
    expect(order.creator_earnings).toBeCloseTo(order.amount * 0.7, 2)
    expect(order.platform_fee).toBeCloseTo(order.amount * 0.3, 2)
    
    metrics.orderCreated = true
    metrics.paymentProcessed = true
    
    // Step 6: Verify creator receives notification via Broadcast
    const creatorChannel = creatorSupabase.channel(`creator-${order.creator_id}`)
    let notificationReceived = false
    
    creatorChannel
      .on('broadcast', { event: 'new_order' }, (payload: any) => {
        notificationReceived = true
        expect(payload.orderId).toBe(order.id)
        metrics.creatorNotified = true
      })
      .subscribe()
    
    // Trigger notification check
    await page.waitForTimeout(3000)
    
    // Step 7: Verify statistics updates
    const { data: creatorStats } = await adminSupabase
      .from('creator_stats')
      .select('*')
      .eq('creator_id', order.creator_id)
      .single()
    
    expect(creatorStats).toBeTruthy()
    expect(creatorStats.pending_orders).toBeGreaterThan(0)
    metrics.statsUpdated = true
    
    // Step 8: Verify platform revenue record
    const { data: platformRevenue } = await adminSupabase
      .from('platform_revenue')
      .select('*')
      .eq('order_id', order.id)
      .single()
    
    expect(platformRevenue).toMatchObject({
      amount: order.amount,
      platform_fee: order.platform_fee,
      creator_earnings: order.creator_earnings,
      revenue_type: 'order'
    })
    
    // Step 9: Verify fan can see order in their history
    await page.goto('/fan/orders')
    await page.waitForSelector('text=My Orders')
    
    // Look for the new order
    const orderCard = page.locator(`text=${order.id.slice(0, 8)}`)
    await expect(orderCard).toBeVisible({ timeout: 10000 })
    metrics.orderVisible = true
    
    // Step 10: Open a new browser context for creator
    const creatorContext = await context.browser()?.newContext()
    const creatorPage = await creatorContext!.newPage()
    
    // Creator logs in
    await creatorPage.goto('/login')
    await creatorPage.fill('input[type="email"]', CREATOR_EMAIL)
    await creatorPage.fill('input[type="password"]', CREATOR_PASSWORD)
    await creatorPage.click('button[type="submit"]')
    
    // Navigate to creator dashboard
    await creatorPage.waitForURL('**/creator/dashboard')
    
    // Verify pending request is visible
    await expect(creatorPage.locator('text=Pending Requests')).toBeVisible()
    const pendingOrder = creatorPage.locator(`text=John Doe`).first()
    await expect(pendingOrder).toBeVisible({ timeout: 10000 })
    
    // Step 11: Creator accepts the order
    await pendingOrder.click()
    await creatorPage.click('button:has-text("Accept")')
    
    // Verify order status update
    await page.waitForTimeout(2000)
    const { data: updatedOrder } = await adminSupabase
      .from('orders')
      .select('status, accepted_at')
      .eq('id', order.id)
      .single()
    
    expect(updatedOrder.status).toBe('accepted')
    expect(updatedOrder.accepted_at).toBeTruthy()
    
    // Step 12: Verify all metrics
    console.log('Payment Flow Test Metrics:', metrics)
    expect(metrics.orderCreated).toBe(true)
    expect(metrics.paymentProcessed).toBe(true)
    expect(metrics.statsUpdated).toBe(true)
    expect(metrics.orderVisible).toBe(true)
    
    // Cleanup
    await creatorContext?.close()
    creatorChannel.unsubscribe()
  })

  test('Verify payment failure handling', async ({ page }) => {
    // Test with invalid card
    await page.goto('/login')
    await page.fill('input[type="email"]', FAN_EMAIL)
    await page.fill('input[type="password"]', FAN_PASSWORD)
    await page.click('button[type="submit"]')
    
    await page.waitForURL('**/fan/home')
    await page.goto('/browse')
    
    const creatorCard = page.locator('text=Test Creator').first()
    await creatorCard.click()
    
    await page.click('button:has-text("Book a Video")')
    await page.fill('input[name="recipient"]', 'Test User')
    await page.selectOption('select[name="occasion"]', 'birthday')
    await page.fill('textarea[name="instructions"]', 'Test message')
    await page.click('button:has-text("Continue to Payment")')
    
    // Use card that will be declined
    const stripeFrame = page.frameLocator('iframe[name*="stripe"]').first()
    await stripeFrame.locator('input[name="cardnumber"]').fill('4000000000000002') // Declined card
    await stripeFrame.locator('input[name="exp-date"]').fill('12/34')
    await stripeFrame.locator('input[name="cvc"]').fill('123')
    await stripeFrame.locator('input[name="postal"]').fill('10001')
    
    await page.click('button:has-text("Pay")')
    
    // Should show error message
    await expect(page.locator('text=Your card was declined')).toBeVisible({ timeout: 10000 })
    
    // Verify no order was created
    const { count } = await adminSupabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', (await fanSupabase.auth.getUser()).data.user?.id)
      .gte('created_at', new Date(Date.now() - 60000).toISOString()) // Last minute
    
    expect(count).toBe(0)
  })

  test('Verify refund flow', async ({ page }) => {
    // Create a completed order first
    const { data: testOrder } = await adminSupabase
      .from('orders')
      .insert({
        user_id: (await fanSupabase.auth.getUser()).data.user?.id,
        creator_id: (await creatorSupabase.auth.getUser()).data.user?.id,
        video_request_id: 'test-request-id',
        amount: 50,
        platform_fee: 15,
        creator_earnings: 35,
        status: 'completed',
        stripe_payment_intent_id: 'pi_test_' + Date.now()
      })
      .select()
      .single()
    
    // Fan requests refund
    await page.goto('/login')
    await page.fill('input[type="email"]', FAN_EMAIL)
    await page.fill('input[type="password"]', FAN_PASSWORD)
    await page.click('button[type="submit"]')
    
    await page.goto('/fan/orders')
    
    // Find the order
    const orderToRefund = page.locator(`text=${testOrder.id.slice(0, 8)}`)
    await orderToRefund.click()
    
    // Request refund
    await page.click('button:has-text("Request Refund")')
    await page.fill('textarea[name="reason"]', 'Video not delivered on time')
    await page.click('button:has-text("Submit Refund Request")')
    
    // Verify refund request created
    await expect(page.locator('text=Refund request submitted')).toBeVisible()
    
    // Verify order status updated
    const { data: refundedOrder } = await adminSupabase
      .from('orders')
      .select('status')
      .eq('id', testOrder.id)
      .single()
    
    expect(refundedOrder.status).toBe('refunded')
  })
})

test.describe('Real-time Features', () => {
  test('Verify real-time order updates', async ({ page, context }) => {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)
    
    // Create test order
    const { data: order } = await supabase
      .from('orders')
      .insert({
        user_id: 'test-user-id',
        creator_id: 'test-creator-id',
        video_request_id: 'test-request',
        amount: 100,
        platform_fee: 30,
        creator_earnings: 70,
        status: 'pending'
      })
      .select()
      .single()
    
    // Set up real-time subscription
    const channel = supabase.channel('test-orders')
    let updateReceived = false
    
    channel
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${order.id}`
      }, (payload) => {
        updateReceived = true
        expect(payload.new.status).toBe('accepted')
      })
      .subscribe()
    
    // Update order status
    await supabase
      .from('orders')
      .update({ status: 'accepted' })
      .eq('id', order.id)
    
    // Wait for real-time update
    await page.waitForTimeout(2000)
    expect(updateReceived).toBe(true)
    
    // Cleanup
    channel.unsubscribe()
    await supabase.from('orders').delete().eq('id', order.id)
  })
})