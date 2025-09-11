import { Page } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'
import { StripeWebhookListener } from './stripe-webhook.helper'

export interface PaymentConfirmationOptions {
  webhookListener?: StripeWebhookListener | null
  supabase?: any
  maxWaitTime?: number
  pollInterval?: number
  debugMode?: boolean
}

export interface PaymentConfirmationResult {
  paymentSuccess: boolean
  webhookReceived: boolean
  orderCreated: boolean
  paymentIntentId?: string
  orderId?: string
  error?: string
}

export class PaymentConfirmationHelper {
  private page: Page
  private options: PaymentConfirmationOptions
  private debugMode: boolean

  constructor(page: Page, options: PaymentConfirmationOptions = {}) {
    this.page = page
    this.options = {
      maxWaitTime: 45000, // 45 seconds total
      pollInterval: 2000,  // Check every 2 seconds
      debugMode: false,
      ...options
    }
    this.debugMode = this.options.debugMode || false
  }

  private log(message: string, ...args: any[]) {
    if (this.debugMode) {
      console.log(`[PaymentConfirmationHelper] ${message}`, ...args)
    }
  }

  /**
   * Wait for payment confirmation using multiple verification methods
   */
  async waitForPaymentConfirmation(paymentIntentId?: string): Promise<PaymentConfirmationResult> {
    this.log('Starting payment confirmation process...', { paymentIntentId })
    
    const startTime = Date.now()
    const { maxWaitTime } = this.options

    // Initialize result
    const result: PaymentConfirmationResult = {
      paymentSuccess: false,
      webhookReceived: false,
      orderCreated: false,
      paymentIntentId
    }

    // Wait for any verification to succeed or timeout
    while (Date.now() - startTime < maxWaitTime!) {
      try {
        // Check UI success indicators first (fastest)
        const uiSuccess = await this.checkUIPaymentSuccess()
        if (uiSuccess.success) {
          result.paymentSuccess = true
          result.paymentIntentId = result.paymentIntentId || uiSuccess.paymentIntentId
          this.log('✅ UI payment success confirmed')
          break
        }

        // If we have a webhook listener, check for webhook events
        if (this.options.webhookListener && paymentIntentId) {
          const webhookResult = await this.checkWebhookReceived(paymentIntentId)
          if (webhookResult.received) {
            result.webhookReceived = true
            this.log('✅ Webhook received for payment')
          }
        }

        // Check database for order creation (most reliable)
        if (this.options.supabase) {
          const orderResult = await this.checkOrderCreated(paymentIntentId)
          if (orderResult.created) {
            result.orderCreated = true
            result.orderId = orderResult.orderId
            result.paymentSuccess = true // Order creation implies payment success
            this.log('✅ Order created in database')
            break
          }
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, this.options.pollInterval!))

      } catch (error) {
        this.log('Error during payment confirmation:', error)
        // Continue trying other methods
      }
    }

    // Final verification if we haven't confirmed success yet
    if (!result.paymentSuccess) {
      this.log('⏰ Payment confirmation timeout reached, doing final checks...')
      
      // Final UI check
      const finalUICheck = await this.checkUIPaymentSuccess()
      if (finalUICheck.success) {
        result.paymentSuccess = true
        result.paymentIntentId = result.paymentIntentId || finalUICheck.paymentIntentId
      }

      // Final database check
      if (this.options.supabase && !result.orderCreated) {
        const finalOrderCheck = await this.checkOrderCreated(paymentIntentId)
        if (finalOrderCheck.created) {
          result.orderCreated = true
          result.orderId = finalOrderCheck.orderId
          result.paymentSuccess = true
        }
      }
    }

    this.log('Payment confirmation completed:', result)
    return result
  }

  /**
   * Check UI for payment success indicators
   */
  private async checkUIPaymentSuccess(): Promise<{ success: boolean; paymentIntentId?: string }> {
    try {
      // Check current URL for success indicators
      const currentUrl = this.page.url()
      if (currentUrl.includes('/success') || 
          currentUrl.includes('/order') || 
          currentUrl.includes('/confirmation')) {
        
        const paymentIntentId = this.extractPaymentIntentFromUrl(currentUrl)
        return { success: true, paymentIntentId }
      }

      // Check for success elements on the page
      const successSelectors = [
        'text=/success|confirmed|thank you|payment.*complete/i',
        '[data-testid="payment-success"]',
        '[data-testid="success"]',
        '.payment-success',
        '.success-message'
      ]

      for (const selector of successSelectors) {
        try {
          const element = await this.page.locator(selector).first()
          if (await element.count() > 0 && await element.isVisible()) {
            return { success: true }
          }
        } catch {
          continue
        }
      }

      return { success: false }
    } catch (error) {
      this.log('Error checking UI payment success:', error)
      return { success: false }
    }
  }

  /**
   * Check if webhook was received
   */
  private async checkWebhookReceived(paymentIntentId: string): Promise<{ received: boolean }> {
    try {
      if (!this.options.webhookListener) {
        return { received: false }
      }

      // Check if webhook was received for this payment intent
      const events = this.options.webhookListener.getEventsByType('payment_intent.succeeded')
      const relevantEvent = events.find(event => 
        event.data?.object?.id === paymentIntentId
      )

      return { received: !!relevantEvent }
    } catch (error) {
      this.log('Error checking webhook:', error)
      return { received: false }
    }
  }

  /**
   * Check if order was created in database
   */
  private async checkOrderCreated(paymentIntentId?: string): Promise<{ created: boolean; orderId?: string }> {
    try {
      if (!this.options.supabase) {
        return { created: false }
      }

      let query = this.options.supabase
        .from('orders')
        .select('id, payment_intent_id, status')

      if (paymentIntentId) {
        query = query.eq('payment_intent_id', paymentIntentId)
      } else {
        // If no payment intent ID, get the most recent order
        query = query.order('created_at', { ascending: false }).limit(1)
      }

      const { data, error } = await query.single()

      if (error || !data) {
        return { created: false }
      }

      return { created: true, orderId: data.id }
    } catch (error) {
      this.log('Error checking order creation:', error)
      return { created: false }
    }
  }

  /**
   * Poll for order creation with exponential backoff
   */
  private async pollOrderCreation(paymentIntentId?: string): Promise<boolean> {
    const maxAttempts = 15
    let delay = 1000 // Start with 1 second

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const result = await this.checkOrderCreated(paymentIntentId)
        if (result.created) {
          this.log(`✅ Order found on attempt ${attempt}`)
          return true
        }

        // Exponential backoff with jitter
        const jitter = Math.random() * 500
        await new Promise(resolve => setTimeout(resolve, delay + jitter))
        delay = Math.min(delay * 1.2, 5000) // Max 5 second delay

      } catch (error) {
        this.log(`Polling attempt ${attempt} failed:`, error)
      }
    }

    return false
  }

  /**
   * Enhanced payment confirmation that includes webhook verification
   */
  async verifyPaymentPipeline(paymentIntentId?: string): Promise<{
    paymentConfirmed: boolean
    webhookProcessed: boolean
    orderCreated: boolean
    splitCalculated: boolean
    platformFee?: number
    creatorEarnings?: number
    error?: string
  }> {
    this.log('Verifying complete payment pipeline...', { paymentIntentId })

    try {
      // Step 1: Confirm payment completion
      const confirmation = await this.waitForPaymentConfirmation(paymentIntentId)
      
      if (!confirmation.paymentSuccess) {
        return {
          paymentConfirmed: false,
          webhookProcessed: false,
          orderCreated: false,
          splitCalculated: false,
          error: 'Payment not confirmed'
        }
      }

      // Step 2: Verify webhook processing (if webhook listener available)
      let webhookProcessed = false
      if (this.options.webhookListener && paymentIntentId) {
        const webhookResult = await this.verifyWebhookProcessing(paymentIntentId)
        webhookProcessed = webhookResult.processed
      }

      // Step 3: Verify order creation and split calculation
      let orderCreated = false
      let splitCalculated = false
      let platformFee: number | undefined
      let creatorEarnings: number | undefined

      if (this.options.supabase && confirmation.paymentIntentId) {
        const orderVerification = await this.verifyOrderAndSplit(confirmation.paymentIntentId)
        orderCreated = orderVerification.created
        splitCalculated = orderVerification.splitCalculated
        platformFee = orderVerification.platformFee
        creatorEarnings = orderVerification.creatorEarnings
      }

      return {
        paymentConfirmed: true,
        webhookProcessed,
        orderCreated,
        splitCalculated,
        platformFee,
        creatorEarnings
      }

    } catch (error) {
      this.log('Error verifying payment pipeline:', error)
      return {
        paymentConfirmed: false,
        webhookProcessed: false,
        orderCreated: false,
        splitCalculated: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Verify webhook processing
   */
  private async verifyWebhookProcessing(paymentIntentId: string): Promise<{ processed: boolean }> {
    if (!this.options.webhookListener) {
      return { processed: false }
    }

    try {
      // Use the existing webhook helper verification
      const processed = await this.options.webhookListener.verifyWebhookProcessed(
        this.options.supabase,
        paymentIntentId
      )
      
      return { processed }
    } catch (error) {
      this.log('Error verifying webhook processing:', error)
      return { processed: false }
    }
  }

  /**
   * Verify order creation and split calculation
   */
  private async verifyOrderAndSplit(paymentIntentId: string): Promise<{
    created: boolean
    splitCalculated: boolean
    platformFee?: number
    creatorEarnings?: number
  }> {
    try {
      const { data: order, error } = await this.options.supabase!
        .from('orders')
        .select('*')
        .eq('payment_intent_id', paymentIntentId)
        .single()

      if (error || !order) {
        return { created: false, splitCalculated: false }
      }

      // Verify 70/30 split
      const { platform_fee, creator_earnings, amount } = order
      let splitCalculated = false

      if (platform_fee !== null && creator_earnings !== null && amount) {
        const total = platform_fee + creator_earnings
        const platformPercentage = (platform_fee / total) * 100
        splitCalculated = Math.abs(platformPercentage - 30) < 2 // Allow 2% tolerance
      }

      return {
        created: true,
        splitCalculated,
        platformFee: platform_fee,
        creatorEarnings: creator_earnings
      }
    } catch (error) {
      this.log('Error verifying order and split:', error)
      return { created: false, splitCalculated: false }
    }
  }

  /**
   * Extract payment intent ID from URL
   */
  private extractPaymentIntentFromUrl(url: string): string | undefined {
    const match = url.match(/pi_[a-zA-Z0-9_]+/)
    return match ? match[0] : undefined
  }

  /**
   * Wait for payment with custom success criteria
   */
  async waitForCustomPaymentSuccess(
    successCriteria: {
      urlPatterns?: string[]
      elementSelectors?: string[]
      textPatterns?: RegExp[]
    },
    timeout: number = 30000
  ): Promise<{ success: boolean; paymentIntentId?: string }> {
    this.log('Waiting for custom payment success criteria...')

    const startTime = Date.now()

    while (Date.now() - startTime < timeout) {
      // Check URL patterns
      if (successCriteria.urlPatterns) {
        const currentUrl = this.page.url()
        for (const pattern of successCriteria.urlPatterns) {
          if (currentUrl.includes(pattern)) {
            const paymentIntentId = this.extractPaymentIntentFromUrl(currentUrl)
            return { success: true, paymentIntentId }
          }
        }
      }

      // Check element selectors
      if (successCriteria.elementSelectors) {
        for (const selector of successCriteria.elementSelectors) {
          try {
            const element = this.page.locator(selector).first()
            if (await element.count() > 0 && await element.isVisible()) {
              return { success: true }
            }
          } catch {
            continue
          }
        }
      }

      // Check text patterns
      if (successCriteria.textPatterns) {
        try {
          const pageText = await this.page.textContent('body')
          if (pageText) {
            for (const pattern of successCriteria.textPatterns) {
              if (pattern.test(pageText)) {
                return { success: true }
              }
            }
          }
        } catch {
          // Continue checking
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    return { success: false }
  }
}

/**
 * Factory function for easy usage
 */
export function createPaymentConfirmationHelper(
  page: Page,
  options: PaymentConfirmationOptions = {}
): PaymentConfirmationHelper {
  return new PaymentConfirmationHelper(page, options)
}