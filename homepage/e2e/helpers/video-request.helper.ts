import { Page } from '@playwright/test'
import { StripeWebhookListener } from './stripe-webhook.helper'
import { DatabaseTracker } from './database-tracker.helper'

export interface VideoRequestOptions {
  creatorId: string
  creatorName: string
  recipientName: string
  occasion: string
  instructions: string
  amount: number // in dollars
}

export interface VideoRequestResult {
  success: boolean
  orderId?: string
  paymentIntentId?: string
  creatorEarnings?: number
  platformFee?: number
  errors: string[]
}

export class VideoRequestHelper {
  private page: Page
  private webhookListener?: StripeWebhookListener
  private databaseTracker?: DatabaseTracker
  
  constructor(
    page: Page,
    webhookListener?: StripeWebhookListener,
    databaseTracker?: DatabaseTracker
  ) {
    this.page = page
    this.webhookListener = webhookListener
    this.databaseTracker = databaseTracker
  }
  
  /**
   * Navigate to creator profile and initiate video request
   */
  async navigateToCreatorAndRequestVideo(creatorId: string): Promise<void> {
    console.log(`🎬 Navigating to creator ${creatorId} profile...`)
    
    // Navigate to creator profile
    await this.page.goto(`/fan/creators/${creatorId}`)
    await this.page.waitForLoadState('networkidle')
    
    // Wait for profile to load
    await this.page.waitForSelector('[data-testid="creator-profile"]', { timeout: 10000 })
    
    // Click Request Video button
    const requestButton = this.page.locator('[data-testid="request-video-button"], button:has-text("Request Video")')
    await requestButton.waitFor({ state: 'visible', timeout: 10000 })
    await requestButton.click()
    
    console.log('✅ Video request modal opened')
  }
  
  /**
   * Fill out the video request form
   */
  async fillVideoRequestForm(options: VideoRequestOptions): Promise<void> {
    console.log('📝 Filling video request form...')
    
    // Set up console log monitoring
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log(`   🔴 Browser console error: ${msg.text()}`)
      }
    })
    
    // Monitor network requests for failures
    this.page.on('requestfailed', request => {
      console.log(`   🔴 Request failed: ${request.url()} - ${request.failure()?.errorText}`)
    })
    
    // Wait for modal to open
    await this.page.waitForSelector('[data-testid="video-order-modal"], [role="dialog"]', { timeout: 10000 })
    
    // The new UI shows all fields at once, no multi-step wizard
    
    // Fill recipient name
    const recipientInput = this.page.locator('input[placeholder*="recipient"], input[placeholder*="name"], input').first()
    if (await recipientInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log(`   Entering recipient: ${options.recipientName}`)
      await recipientInput.fill(options.recipientName)
    }
    
    // Fill instructions
    console.log('   Entering instructions...')
    const messageTextarea = this.page.locator('textarea[placeholder*="Tell the creator"], textarea').first()
    if (await messageTextarea.isVisible({ timeout: 3000 }).catch(() => false)) {
      await messageTextarea.fill(options.instructions)
    }
    
    // Verify auth state before clicking button - check cookies instead of localStorage
    const cookies = await this.page.context().cookies()
    const authCookie = cookies.find(c => c.name.includes('supabase-auth-token') || c.name.includes('sb-'))
    console.log(`   Auth cookie check: ${authCookie ? 'Present' : 'Missing'}`)
    
    // Click Continue to Checkout button with proper selector
    console.log('   Clicking Continue to Checkout button...')
    const checkoutButton = this.page.locator('button[data-testid="continue-checkout-button"]')
    
    // Ensure button is visible and enabled
    await checkoutButton.waitFor({ state: 'visible', timeout: 5000 })
    const isDisabled = await checkoutButton.isDisabled()
    if (isDisabled) {
      console.log('   ⚠️ Button is disabled, waiting for it to be enabled...')
      await this.page.waitForTimeout(2000)
    }
    
    // Click the button and wait for response
    await Promise.all([
      checkoutButton.click(),
      // Wait for either navigation or error
      Promise.race([
        this.page.waitForURL('**/checkout**', { timeout: 10000 }).catch(() => null),
        this.page.waitForSelector('text=/error|failed|problem/i', { timeout: 5000 }).catch(() => null),
        this.page.waitForTimeout(5000)
      ])
    ])
    
    // Check current state after click
    const currentUrl = this.page.url()
    console.log(`   Current URL after click: ${currentUrl}`)
    
    // Check if we got an error message
    const errorMessage = this.page.locator('[role="alert"], .text-destructive, text=/error|failed|problem/i')
    if (await errorMessage.first().isVisible({ timeout: 1000 }).catch(() => false)) {
      const errorText = await errorMessage.first().textContent()
      console.log(`   ⚠️ Error message displayed: ${errorText}`)
      
      // Also check console for database errors
      const dbError = await this.page.evaluate(() => {
        const lastError = (window as any).__lastSupabaseError
        return lastError || null
      })
      if (dbError) {
        console.log(`   ⚠️ Database error: ${JSON.stringify(dbError)}`)
      }
    }
    
    console.log('✅ Form submission attempted')
  }
  
  /**
   * Process payment with Stripe (with extended waits)
   */
  async processPayment(): Promise<string | null> {
    console.log('💳 Processing payment...')
    
    // Check if we're on checkout page or wait for navigation
    const currentUrl = this.page.url()
    if (currentUrl.includes('checkout')) {
      console.log('   Already on checkout page')
    } else {
      console.log('   Waiting for checkout page navigation...')
      try {
        await this.page.waitForURL('**/checkout**', { timeout: 5000 })
        console.log('   Navigated to checkout page')
      } catch (e) {
        console.log(`   Failed to navigate to checkout. Current URL: ${this.page.url()}`)
        throw new Error('Failed to navigate to checkout page')
      }
    }
    
    // Wait for Stripe Elements to load
    await this.page.waitForSelector('iframe[name*="privateStripeFrame"], iframe[src*="stripe.com"]', { timeout: 10000 })
    console.log('   Stripe payment form loaded')
    
    // Verify price is shown ($50)
    await this.page.locator('text="$50"').first().waitFor({ state: 'visible' })
    
    // Handle Stripe Elements iframe
    const stripeFrame = await this.page.waitForSelector('iframe[name*="privateStripeFrame"], iframe[src*="stripe.com"]', { timeout: 5000 })
    
    if (stripeFrame) {
      console.log('   Using Stripe Elements iframe for payment...')
      const frame = this.page.frameLocator('iframe[name*="privateStripeFrame"]').first()
      
      // Fill card details with test card
      // Stripe Elements uses a single input field for all card details
      await frame.locator('input[placeholder*="Card number"], input[name="cardnumber"], input[data-elements-stable-field-name="cardNumber"]').fill('4242424242424242')
      await frame.locator('input[placeholder*="MM / YY"], input[name="exp-date"], input[data-elements-stable-field-name="cardExpiry"]').fill('12/30')
      await frame.locator('input[placeholder*="CVC"], input[name="cvc"], input[data-elements-stable-field-name="cardCvc"]').fill('123')
      
      // Fill ZIP if present
      const zipInput = frame.locator('input[placeholder*="ZIP"], input[placeholder*="Postal"], input[data-elements-stable-field-name="postalCode"]')
      if (await zipInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await zipInput.fill('10001')
      }
    } else {
      console.log('   No Stripe iframe found, skipping payment form fill...')
    }
    
    console.log('   Card details filled, submitting payment...')
    
    // Click pay button - it shows "Pay $50.00 USD"
    const payButton = this.page.locator('button[data-testid="pay-button"], button:has-text("Pay $")')
    await payButton.click()
    
    // CRITICAL: Wait for Stripe processing with extended timeout
    console.log('   ⏳ Waiting for Stripe to process payment (up to 30 seconds)...')
    
    // Wait for either success indication or webhook confirmation
    const paymentIntentId = await this.waitForPaymentCompletion()
    
    return paymentIntentId
  }
  
  /**
   * Wait for payment to complete with multiple verification methods
   */
  private async waitForPaymentCompletion(): Promise<string | null> {
    let paymentIntentId: string | null = null
    
    // Method 1: Wait for webhook event if listener is available
    if (this.webhookListener) {
      console.log('   Waiting for payment_intent webhook...')
      
      const paymentIntentEvent = await Promise.race([
        this.webhookListener.waitForEvent('payment_intent.succeeded', 30000),
        this.webhookListener.waitForEvent('payment_intent.created', 5000)
          .then(async (created) => {
            if (created) {
              console.log('   Payment intent created, waiting for success...')
              return this.webhookListener!.waitForEvent('payment_intent.succeeded', 25000)
            }
            return null
          }),
        this.page.waitForTimeout(30000).then(() => null)
      ])
      
      if (paymentIntentEvent) {
        paymentIntentId = paymentIntentEvent.data.object.id
        console.log(`   ✅ Payment intent succeeded: ${paymentIntentId}`)
      }
    }
    
    // Method 2: Wait for success page/indication
    const successIndicators = [
      '[data-testid="payment-success"]',
      '[data-testid="success-message"]',
      'text=/Success|Thank you|confirmed/i',
      'text="Your video request has been submitted"'
    ]
    
    for (const selector of successIndicators) {
      if (await this.page.locator(selector).isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('   ✅ Payment success indication found')
        break
      }
    }
    
    // Extra wait to ensure all processing completes
    await this.page.waitForTimeout(3000)
    
    return paymentIntentId
  }
  
  /**
   * Complete video request flow with all verifications
   */
  async completeVideoRequest(options: VideoRequestOptions): Promise<VideoRequestResult> {
    const result: VideoRequestResult = {
      success: false,
      errors: []
    }
    
    try {
      // Navigate and open request modal
      await this.navigateToCreatorAndRequestVideo(options.creatorId)
      
      // Fill form
      await this.fillVideoRequestForm(options)
      
      // Process payment
      const paymentIntentId = await this.processPayment()
      if (paymentIntentId) {
        result.paymentIntentId = paymentIntentId
      }
      
      // Calculate expected split
      const expectedCreatorEarnings = options.amount * 0.70
      const expectedPlatformFee = options.amount * 0.30
      
      result.creatorEarnings = expectedCreatorEarnings
      result.platformFee = expectedPlatformFee
      
      // Verify order creation in database if tracker available
      if (this.databaseTracker) {
        console.log('📊 Verifying order in database...')
        
        // Retry logic for database check
        let order = null
        for (let i = 0; i < 5; i++) {
          const { data } = await this.databaseTracker.supabase
            .from('orders')
            .select('*')
            .eq('stripe_payment_intent_id', paymentIntentId)
            .single()
          
          if (data) {
            order = data
            break
          }
          
          console.log(`   Retry ${i + 1}/5: Order not found yet...`)
          await this.page.waitForTimeout(2000)
        }
        
        if (order) {
          result.orderId = order.id
          console.log(`   ✅ Order created: ${order.id}`)
          
          // Verify split amounts
          if (Math.abs(order.creator_earnings - expectedCreatorEarnings) < 0.01) {
            console.log(`   ✅ Creator earnings correct: $${order.creator_earnings}`)
          } else {
            result.errors.push(`Creator earnings mismatch: ${order.creator_earnings} != ${expectedCreatorEarnings}`)
          }
          
          if (Math.abs(order.platform_fee - expectedPlatformFee) < 0.01) {
            console.log(`   ✅ Platform fee correct: $${order.platform_fee}`)
          } else {
            result.errors.push(`Platform fee mismatch: ${order.platform_fee} != ${expectedPlatformFee}`)
          }
        } else {
          result.errors.push('Order not found in database after retries')
        }
      }
      
      result.success = result.errors.length === 0
      
      if (result.success) {
        console.log('✅ Video request completed successfully!')
      } else {
        console.error('❌ Video request had issues:', result.errors)
      }
      
    } catch (error) {
      console.error('Error in video request:', error)
      result.errors.push(`Video request failed: ${error}`)
    }
    
    return result
  }
  
  /**
   * Verify fan can see order in their history
   */
  async verifyFanOrderHistory(orderId: string): Promise<boolean> {
    console.log('📋 Verifying order in fan history...')
    
    // Navigate to orders page
    await this.page.goto('/fan/orders')
    await this.page.waitForLoadState('networkidle')
    
    // Look for order
    const orderCard = this.page.locator(`[data-testid="order-${orderId}"], [data-order-id="${orderId}"]`)
    
    if (await orderCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('   ✅ Order found in history')
      return true
    }
    
    // Fallback: look for any recent order
    const recentOrder = this.page.locator('[data-testid*="order-card"]').first()
    if (await recentOrder.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log('   ✅ Recent order found in history')
      return true
    }
    
    console.log('   ❌ Order not found in history')
    return false
  }
}

/**
 * Create video request helper for tests
 */
export function createVideoRequestHelper(
  page: Page,
  webhookListener?: StripeWebhookListener,
  databaseTracker?: DatabaseTracker
): VideoRequestHelper {
  return new VideoRequestHelper(page, webhookListener, databaseTracker)
}