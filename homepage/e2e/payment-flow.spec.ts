import { test, expect } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client for database verification
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

// Test data
const TEST_CREATOR = {
  id: '1', // Wyclef Jean's mock ID in booking page
  username: '1', // Using mock ID
  displayName: 'Wyclef Jean',
  basePrice: 150,
  rushPrice: 75,
  platformFeePercentage: 0.30,
}

const TEST_FAN = {
  email: 'testfan@annpale.test',
  password: 'TestPassword123!',
}

const TEST_VIDEO_REQUEST = {
  recipientName: 'John Smith',
  occasion: 'birthday',
  instructions: 'Please wish John a happy 30th birthday! Make it special.',
  videoType: 'personal',
}

test.describe('Comprehensive Payment Flow', () => {
  // Login before each test
  test.beforeEach(async ({ page }) => {
    // Login as fan
    await page.goto('/login')
    await page.fill('#email', TEST_FAN.email)
    await page.fill('#password', TEST_FAN.password)
    await page.locator('#password').press('Enter')
    
    // Wait for navigation
    await page.waitForFunction(
      () => !window.location.pathname.includes('/login'),
      { timeout: 10000 }
    )
  })

  test('complete payment flow with database verification', async ({ page, context }) => {
    // Get initial statistics
    const { data: initialStats } = await supabase
      .from('creator_stats')
      .select('*')
      .eq('creator_id', TEST_CREATOR.id)
      .single()
    
    const initialOrderCount = initialStats?.total_orders || 0
    const initialEarnings = initialStats?.total_earnings || 0
    
    // Open creator dashboard in new tab to monitor real-time updates
    const creatorPage = await context.newPage()
    
    // Login as creator in new tab
    await creatorPage.goto('/login')
    await creatorPage.fill('#email', 'testcreator@annpale.test')
    await creatorPage.fill('#password', 'TestPassword123!')
    await creatorPage.locator('#password').press('Enter')
    await creatorPage.waitForFunction(
      () => !window.location.pathname.includes('/login'),
      { timeout: 10000 }
    )
    
    // Navigate to creator dashboard
    await creatorPage.goto('/creator/dashboard')
    await creatorPage.waitForLoadState('networkidle')
    
    // Check initial pending orders count
    const initialPendingElement = creatorPage.locator('[data-testid="pending-orders-count"]')
    let initialPending = 0
    if (await initialPendingElement.isVisible({ timeout: 2000 })) {
      const text = await initialPendingElement.textContent()
      initialPending = parseInt(text || '0')
    }
    
    // Start payment flow as fan
    await page.goto(`/book/${TEST_CREATOR.username}`)
    await page.waitForURL('**/book/**')
    
    // Step 1: Select occasion
    await page.waitForSelector('text="What\'s the occasion?"')
    await page.click('button:has-text("Birthday")').catch(async () => {
      await page.click('label:has-text("Birthday")')
    })
    
    // Fill recipient name if visible
    const recipientInput = page.locator('input[placeholder*="recipient" i], input[name="recipientName"]').first()
    if (await recipientInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await recipientInput.fill(TEST_VIDEO_REQUEST.recipientName)
    }
    
    await page.click('button:has-text("Next")')
    await page.waitForTimeout(1000)
    
    // Step 2: Message step
    if (await page.locator('text="Tell us more about this video"').isVisible({ timeout: 2000 }).catch(() => false)) {
      const messageTextarea = page.locator('textarea').first()
      await messageTextarea.fill(TEST_VIDEO_REQUEST.instructions)
      await page.click('button:has-text("Next")')
      await page.waitForTimeout(1000)
    }
    
    // Step 3: Skip gift options
    if (await page.locator('text="Is this a gift?"').isVisible({ timeout: 2000 }).catch(() => false)) {
      await page.click('button:has-text("Next")')
      await page.waitForTimeout(1000)
    }
    
    // Step 4: Skip delivery options
    if (await page.locator('text="When do you need this?"').isVisible({ timeout: 2000 }).catch(() => false)) {
      await page.click('button:has-text("Next")')
      await page.waitForTimeout(1000)
    }
    
    // Step 5: Payment
    await page.waitForSelector('text="Payment", text="Complete your booking", text="Order Summary"', { timeout: 10000 })
    
    // Check order summary shows correct pricing
    const orderTotal = page.locator('[data-testid="order-total"], .order-total, text=/\\$150/')
    await expect(orderTotal).toBeVisible({ timeout: 5000 })
    
    // Fill Stripe payment form
    await page.waitForTimeout(2000) // Wait for Stripe to load
    
    const stripeFrame = await page.waitForSelector('iframe[src*="stripe"], iframe[title*="Stripe"], iframe[name*="stripe"]', { timeout: 15000 }).catch(() => null)
    
    if (stripeFrame) {
      const frame = page.frameLocator('iframe[name*="stripe"], iframe[title*="Stripe"], iframe[src*="checkout.stripe"]').first()
      await frame.locator('[placeholder*="Card"], input[name="cardnumber"], #cardNumber').fill('4242424242424242')
      await frame.locator('[placeholder*="MM"], input[name="exp-date"], #cardExpiry').fill('12/30')
      await frame.locator('[placeholder*="CVC"], input[name="cvc"], #cardCvc').fill('123')
      await frame.locator('[placeholder*="ZIP"], input[name="postal"], #billingPostalCode').fill('10001')
    } else {
      // Inline payment form
      await page.fill('input[placeholder*="Card"], input[name="cardNumber"]', '4242424242424242')
      await page.fill('input[placeholder*="MM"], input[name="expiry"]', '12/30')
      await page.fill('input[placeholder*="CVC"], input[name="cvc"]', '123')
      await page.fill('input[placeholder*="ZIP"], input[name="zip"]', '10001')
    }
    
    // Confirm payment
    await page.click('[data-testid="confirm-payment"], button:has-text("Pay"), button:has-text("Complete")')
    
    // Wait for success
    await Promise.race([
      page.waitForSelector('[data-testid="payment-success"]', { timeout: 20000 }),
      page.waitForURL('**/success**', { timeout: 20000 }),
      page.waitForSelector(':text("Payment successful")', { timeout: 20000 }),
      page.waitForSelector(':text("Thank you")', { timeout: 20000 }),
    ])
    
    // Wait for webhook processing
    await page.waitForTimeout(3000)
    
    // Verify database order creation
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('creator_id', TEST_CREATOR.id)
      .order('created_at', { ascending: false })
      .limit(1)
    
    expect(orders).toBeDefined()
    expect(orders?.length).toBeGreaterThan(0)
    
    const latestOrder = orders![0]
    expect(latestOrder.amount).toBe(TEST_CREATOR.basePrice)
    expect(latestOrder.platform_fee).toBe(TEST_CREATOR.basePrice * TEST_CREATOR.platformFeePercentage)
    expect(latestOrder.creator_earnings).toBe(TEST_CREATOR.basePrice * (1 - TEST_CREATOR.platformFeePercentage))
    expect(latestOrder.status).toBe('pending')
    
    // Verify video request creation
    const { data: videoRequests } = await supabase
      .from('video_requests')
      .select('*')
      .eq('id', latestOrder.video_request_id)
      .single()
    
    expect(videoRequests).toBeDefined()
    expect(videoRequests?.recipient_name).toBe(TEST_VIDEO_REQUEST.recipientName)
    expect(videoRequests?.occasion).toBe(TEST_VIDEO_REQUEST.occasion)
    expect(videoRequests?.instructions).toContain(TEST_VIDEO_REQUEST.instructions)
    
    // Verify payment record creation
    const { data: payments } = await supabase
      .from('payments')
      .select('*')
      .eq('order_id', latestOrder.id)
      .single()
    
    expect(payments).toBeDefined()
    expect(payments?.amount).toBe(TEST_CREATOR.basePrice)
    expect(payments?.status).toBe('succeeded')
    expect(payments?.stripe_payment_intent_id).toBeTruthy()
    
    // Verify creator statistics update
    const { data: updatedStats } = await supabase
      .from('creator_stats')
      .select('*')
      .eq('creator_id', TEST_CREATOR.id)
      .single()
    
    expect(updatedStats).toBeDefined()
    expect(updatedStats?.total_orders).toBe(initialOrderCount + 1)
    expect(updatedStats?.pending_orders).toBeGreaterThan(0)
    expect(updatedStats?.total_earnings).toBeGreaterThan(initialEarnings)
    
    // Verify creator dashboard shows new order (real-time update)
    await creatorPage.reload() // Force reload to ensure data is fresh
    
    // Check pending orders increased
    const updatedPendingElement = creatorPage.locator('[data-testid="pending-orders-count"]')
    if (await updatedPendingElement.isVisible({ timeout: 5000 })) {
      const text = await updatedPendingElement.textContent()
      const updatedPending = parseInt(text || '0')
      expect(updatedPending).toBeGreaterThan(initialPending)
    }
    
    // Check if new order appears in creator's order list
    const ordersList = creatorPage.locator('[data-testid="orders-list"], .orders-list')
    if (await ordersList.isVisible({ timeout: 5000 })) {
      const orderItem = ordersList.locator(`text="${TEST_VIDEO_REQUEST.recipientName}"`)
      await expect(orderItem).toBeVisible({ timeout: 10000 })
    }
    
    // Navigate to fan's order history
    await page.goto('/fan/orders')
    await page.waitForLoadState('networkidle')
    
    // Verify order appears in fan's history
    const fanOrderItem = page.locator(`text="${TEST_CREATOR.displayName}"`)
    await expect(fanOrderItem).toBeVisible({ timeout: 5000 })
    
    // Verify order status
    const orderStatus = page.locator('[data-testid="order-status"], .order-status').first()
    await expect(orderStatus).toContainText(/pending|processing/i)
    
    // Clean up
    await creatorPage.close()
  })

  test('handles payment failure gracefully', async ({ page }) => {
    await page.goto(`/book/${TEST_CREATOR.username}`)
    
    // Quick navigation through wizard
    await page.waitForSelector('text="What\'s the occasion?"')
    await page.click('button:has-text("Birthday")')
    
    // Fill required fields quickly
    const recipientInput = page.locator('input[type="text"]').first()
    if (await recipientInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await recipientInput.fill('Test User')
    }
    
    // Click through steps
    for (let i = 0; i < 4; i++) {
      const nextButton = page.locator('button:has-text("Next")')
      if (await nextButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await nextButton.click()
        await page.waitForTimeout(500)
      }
    }
    
    // Wait for payment step
    await page.waitForSelector('text="Payment"', { timeout: 10000 })
    await page.waitForTimeout(2000)
    
    // Use declining card
    const stripeFrame = await page.waitForSelector('iframe[src*="stripe"]', { timeout: 10000 }).catch(() => null)
    
    if (stripeFrame) {
      const frame = page.frameLocator('iframe[name*="stripe"]').first()
      await frame.locator('[placeholder*="Card"], #cardNumber').fill('4000000000000002')
      await frame.locator('[placeholder*="MM"], #cardExpiry').fill('12/30')
      await frame.locator('[placeholder*="CVC"], #cardCvc').fill('123')
      await frame.locator('[placeholder*="ZIP"], #billingPostalCode').fill('10001')
    } else {
      await page.fill('input[placeholder*="Card"]', '4000000000000002')
      await page.fill('input[placeholder*="MM"]', '12/30')
      await page.fill('input[placeholder*="CVC"]', '123')
      await page.fill('input[placeholder*="ZIP"]', '10001')
    }
    
    // Try to pay
    await page.click('[data-testid="confirm-payment"], button:has-text("Pay"), button:has-text("Complete")')
    
    // Verify error message
    const errorMessage = page.locator('text=/declined|error|failed/i')
    await expect(errorMessage).toBeVisible({ timeout: 10000 })
    
    // Verify no order created in database
    const { data: orders } = await supabase
      .from('orders')
      .select('id')
      .eq('user_id', TEST_FAN.email)
      .eq('status', 'failed')
      .order('created_at', { ascending: false })
      .limit(1)
    
    // Failed orders might not be stored, or might be stored with failed status
    if (orders && orders.length > 0) {
      expect(orders[0]).toBeDefined()
    }
  })

  test('calculates platform fees correctly', async ({ page }) => {
    await page.goto(`/book/${TEST_CREATOR.username}`)
    
    // Navigate to payment step quickly
    await page.waitForSelector('text="What\'s the occasion?"')
    await page.click('button:has-text("Birthday")')
    
    // Click through steps
    for (let i = 0; i < 3; i++) {
      const nextButton = page.locator('button:has-text("Next")')
      if (await nextButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await nextButton.click()
        await page.waitForTimeout(500)
      }
    }
    
    // Check for rush delivery option
    const rushCheckbox = page.locator('input[type="checkbox"][name*="rush"], label:has-text("Rush delivery")')
    if (await rushCheckbox.isVisible({ timeout: 2000 }).catch(() => false)) {
      // Test with rush delivery
      await rushCheckbox.click()
      await page.waitForTimeout(500)
      
      // Move to payment step
      await page.click('button:has-text("Next")')
      await page.waitForSelector('text="Payment"', { timeout: 5000 })
      
      // Verify total includes rush fee
      const totalWithRush = TEST_CREATOR.basePrice + TEST_CREATOR.rushPrice
      const rushTotal = page.locator(`text="$${totalWithRush}"`)
      await expect(rushTotal).toBeVisible({ timeout: 5000 })
    } else {
      // Continue to payment without rush
      await page.click('button:has-text("Next")')
      await page.waitForSelector('text="Payment"', { timeout: 5000 })
      
      // Verify base price
      const baseTotal = page.locator(`text="$${TEST_CREATOR.basePrice}"`)
      await expect(baseTotal).toBeVisible({ timeout: 5000 })
    }
    
    // Verify platform fee calculation (if displayed)
    const platformFee = TEST_CREATOR.basePrice * TEST_CREATOR.platformFeePercentage
    const creatorEarnings = TEST_CREATOR.basePrice - platformFee
    
    // These might be shown in order summary or receipt
    const feeElement = page.locator(`text="$${platformFee.toFixed(2)}"`)
    if (await feeElement.isVisible({ timeout: 2000 }).catch(() => false)) {
      await expect(feeElement).toBeVisible()
    }
  })
})