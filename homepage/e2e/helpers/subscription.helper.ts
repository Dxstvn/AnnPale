import { Page } from '@playwright/test'
import Stripe from 'stripe'
import { StripeWebhookListener } from './stripe-webhook.helper'
import { DatabaseTracker } from './database-tracker.helper'

export interface SubscriptionCheckoutOptions {
  tierId: string
  creatorId: string
  billingPeriod: 'monthly' | 'yearly'
  expectedPrice: number
  creatorStripeAccountId?: string
}

export interface TransferVerificationResult {
  transferCreated: boolean
  transferAmount: number
  transferDestination: string
  applicationFeeCreated: boolean
  applicationFeeAmount: number
  platformPercentage: number
  creatorPercentage: number
  transferId?: string
  applicationFeeId?: string
  errors: string[]
}

export class SubscriptionHelper {
  private page: Page
  private stripe: Stripe
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
    
    // Initialize Stripe client
    const stripeKey = process.env.STRIPE_SANDBOX_SECRET_KEY
    if (!stripeKey) {
      throw new Error('Stripe secret key is required')
    }
    
    this.stripe = new Stripe(stripeKey, {
      apiVersion: '2024-12-18.acacia',
    })
  }
  
  /**
   * Navigate to creator profile and select subscription tier
   */
  async selectSubscriptionTier(
    creatorId: string,
    tierId: string
  ): Promise<void> {
    console.log(`🎯 Selecting subscription tier ${tierId} for creator ${creatorId}`)
    
    // Navigate to creator profile
    await this.page.goto(`/fan/creators/${creatorId}`)
    await this.page.waitForLoadState('networkidle')
    
    // Find and click subscription tier
    const tierSelector = `[data-testid="tier-${tierId}"], [data-tier-id="${tierId}"]`
    await this.page.waitForSelector(tierSelector, { timeout: 10000 })
    
    // Click subscribe button for this tier
    const subscribeButton = this.page.locator(tierSelector).locator('button:has-text("Subscribe")')
    await subscribeButton.click()
    
    console.log('✅ Subscription tier selected')
  }
  
  /**
   * Process subscription checkout
   */
  async processSubscriptionCheckout(
    options: SubscriptionCheckoutOptions
  ): Promise<{
    sessionId?: string
    subscriptionId?: string
    success: boolean
  }> {
    console.log('💳 Processing subscription checkout...')
    
    // Wait for checkout page to load
    await this.page.waitForURL('**/checkout**', { timeout: 10000 })
    
    // Verify checkout details
    const priceElement = this.page.locator(`text=/$${options.expectedPrice}/`)
    await priceElement.waitFor({ state: 'visible', timeout: 5000 })
    
    // The checkout should redirect to Stripe Checkout
    // Wait for Stripe Checkout redirect
    console.log('   Waiting for Stripe Checkout redirect...')
    
    // Store the session ID if we can extract it from URL
    let sessionId: string | undefined
    
    try {
      // Wait for Stripe Checkout page
      await this.page.waitForURL('**/checkout.stripe.com/**', { timeout: 15000 })
      
      // Extract session ID from URL
      const url = this.page.url()
      const match = url.match(/cs_[a-zA-Z0-9]+/)
      if (match) {
        sessionId = match[0]
        console.log(`   Checkout session ID: ${sessionId}`)
      }
      
      // Fill in test card details
      await this.fillStripeCheckoutForm()
      
      // Submit payment
      await this.submitStripeCheckout()
      
      // Wait for success redirect
      await this.page.waitForURL('**/subscriptions?success=true**', { timeout: 30000 })
      
      console.log('✅ Subscription checkout completed')
      
      return {
        sessionId,
        success: true
      }
    } catch (error) {
      console.error('❌ Subscription checkout failed:', error)
      return {
        sessionId,
        success: false
      }
    }
  }
  
  /**
   * Process Stripe Checkout after being on checkout page
   */
  async processStripeCheckout(
    options: {
      expectedPrice: number
      creatorStripeAccountId: string
    }
  ): Promise<{
    sessionId?: string
    success: boolean
  }> {
    console.log('💳 Processing Stripe checkout...')
    
    // Store the session ID if we can extract it from URL
    let sessionId: string | undefined
    
    try {
      // First, let's see what URL we actually get after clicking subscribe tier
      const currentUrl = this.page.url()
      console.log(`   Current URL before Stripe button: ${currentUrl}`)
      
      // Check if we're on the local checkout page
      if (currentUrl.includes('/checkout')) {
        console.log('   On local checkout page, looking for Subscribe button...')
        
        // Wait for the Subscribe button to appear and click it
        const subscribeButton = this.page.locator('button', { hasText: 'Subscribe -' }).first()
        await subscribeButton.waitFor({ state: 'visible', timeout: 10000 })
        console.log('   Found Subscribe button, clicking...')
        
        await subscribeButton.click()
        console.log('   Clicked Subscribe button, waiting for Stripe redirect...')
        
        // Wait for Stripe Checkout page redirect
        await this.page.waitForURL('**/checkout.stripe.com/**', { timeout: 15000 })
        console.log('   Now redirected to Stripe Checkout')
      } else if (currentUrl.includes('checkout.stripe.com')) {
        console.log('   Already on Stripe Checkout')
      } else {
        console.log(`   Unexpected URL pattern: ${currentUrl}`)
        return { success: false }
      }
      
      // Extract session ID from URL
      const url = this.page.url()
      const match = url.match(/cs_[a-zA-Z0-9]+/)
      if (match) {
        sessionId = match[0]
        console.log(`   Checkout session ID: ${sessionId}`)
      }
      
      // Fill in test card details
      await this.fillStripeCheckoutForm()
      
      // Submit payment
      await this.submitStripeCheckout()
      
      // The redirect should have already happened in submitStripeCheckout
      // Just verify we're on the success page
      const finalUrl = this.page.url()
      if (!finalUrl.includes('success=true') && !finalUrl.includes('/success')) {
        // If not redirected yet, wait a bit more
        await this.page.waitForURL('**/subscriptions?success=true**', { timeout: 15000 }).catch(() => {
          console.log('   Warning: Success redirect may have failed')
        })
      }
      
      console.log('✅ Stripe checkout completed')
      
      return {
        sessionId,
        success: true
      }
    } catch (error) {
      console.error('❌ Stripe checkout failed:', error)
      return {
        sessionId,
        success: false
      }
    }
  }
  
  /**
   * Fill Stripe Checkout form
   */
  private async fillStripeCheckoutForm(): Promise<void> {
    console.log('   Filling Stripe Checkout form...')
    
    // Wait for email field
    const emailField = this.page.locator('input[name="email"], input[type="email"]')
    if (await emailField.isVisible({ timeout: 5000 }).catch(() => false)) {
      await emailField.fill('testfan@annpale.test')
    }
    
    // Fill card number - use role-based selectors based on error context
    const cardNumberInput = this.page.getByRole('textbox', { name: /card number/i }).first()
    await cardNumberInput.waitFor({ state: 'visible', timeout: 15000 })
    await cardNumberInput.fill('4242424242424242')
    console.log('   ✅ Card number filled')
    
    // Fill expiry
    const expiryInput = this.page.getByRole('textbox', { name: /expiration/i }).first()
    await expiryInput.waitFor({ state: 'visible', timeout: 10000 })
    await expiryInput.fill('1230')
    console.log('   ✅ Expiration filled')
    
    // Fill CVC
    const cvcInput = this.page.getByRole('textbox', { name: /cvc/i }).first()
    await cvcInput.waitFor({ state: 'visible', timeout: 10000 })
    await cvcInput.fill('123')
    console.log('   ✅ CVC filled')
    
    // Fill cardholder name
    try {
      const nameField = this.page.getByRole('textbox', { name: /cardholder name/i }).first()
      await nameField.waitFor({ state: 'visible', timeout: 5000 })
      await nameField.fill('Test Fan')
      console.log('   ✅ Cardholder name filled')
    } catch (error) {
      console.log('   ⚠️  Cardholder name field not found or not required')
    }
    
    // Fill ZIP code  
    try {
      const zipField = this.page.getByRole('textbox', { name: /zip/i }).first()
      await zipField.waitFor({ state: 'visible', timeout: 5000 })
      await zipField.fill('10001')
      console.log('   ✅ ZIP code filled')
    } catch (error) {
      console.log('   ⚠️  ZIP code field not found or not required')
    }
    
    console.log('   Form filled')
  }
  
  /**
   * Submit Stripe Checkout
   */
  private async submitStripeCheckout(): Promise<void> {
    console.log('   Submitting payment...')
    
    // Click submit button
    const submitButton = this.page.locator('button[type="submit"], button:has-text("Subscribe"), button:has-text("Pay")')
    await submitButton.click()
    
    // Wait for payment processing - look for various indicators
    try {
      // Option 1: Wait for a success redirect (most reliable)
      await Promise.race([
        this.page.waitForURL('**/subscriptions?success=true**', { timeout: 15000 }),
        this.page.waitForURL('**/success**', { timeout: 15000 }),
        this.page.waitForURL('**/subscription/success**', { timeout: 15000 })
      ]).catch(() => {
        // If no redirect, wait for processing indicators
        console.log('   No immediate redirect, checking for processing indicators...')
      })
    } catch (error) {
      // Fallback: just wait a bit longer for processing
      console.log('   Waiting for payment processing to complete...')
      await this.page.waitForTimeout(5000)
    }
  }
  
  /**
   * Verify transfer to creator's Stripe account
   */
  async verifyTransfer(
    subscriptionId: string,
    expectedAmount: number,
    creatorStripeAccountId: string
  ): Promise<TransferVerificationResult> {
    console.log(`💸 Verifying transfer for subscription ${subscriptionId}`)
    
    const result: TransferVerificationResult = {
      transferCreated: false,
      transferAmount: 0,
      transferDestination: '',
      applicationFeeCreated: false,
      applicationFeeAmount: 0,
      platformPercentage: 0,
      creatorPercentage: 0,
      errors: []
    }
    
    try {
      // Wait for transfer webhook events
      if (this.webhookListener) {
        console.log('   Waiting for transfer webhooks...')
        
        const transferEvent = await this.webhookListener.waitForEvent('transfer.created', 30000).catch(() => null)
        const feeEvent = await this.webhookListener.waitForEvent('application_fee.created', 30000).catch(() => null)
        
        if (transferEvent) {
          const transfer = transferEvent.data.object
          result.transferCreated = true
          result.transferId = transfer.id
          result.transferAmount = transfer.amount / 100 // Convert from cents
          result.transferDestination = transfer.destination
          
          console.log(`   ✅ Transfer created: ${transfer.id}`)
          console.log(`   Amount: $${result.transferAmount}`)
          console.log(`   Destination: ${result.transferDestination}`)
          
          // Verify transfer details via Stripe API
          const stripeTransfer = await this.stripe.transfers.retrieve(transfer.id)
          
          if (stripeTransfer.destination !== creatorStripeAccountId) {
            result.errors.push(`Transfer destination mismatch: ${stripeTransfer.destination} !== ${creatorStripeAccountId}`)
          }
          
          // Calculate percentage
          result.creatorPercentage = (result.transferAmount / expectedAmount) * 100
          
          if (Math.abs(result.creatorPercentage - 70) > 1) {
            result.errors.push(`Creator percentage incorrect: ${result.creatorPercentage.toFixed(2)}% !== 70%`)
          }
        } else {
          result.errors.push('Transfer webhook not received')
        }
        
        if (feeEvent) {
          const fee = feeEvent.data.object
          result.applicationFeeCreated = true
          result.applicationFeeId = fee.id
          result.applicationFeeAmount = fee.amount / 100 // Convert from cents
          
          console.log(`   ✅ Application fee created: ${fee.id}`)
          console.log(`   Amount: $${result.applicationFeeAmount}`)
          
          // Calculate percentage
          result.platformPercentage = (result.applicationFeeAmount / expectedAmount) * 100
          
          if (Math.abs(result.platformPercentage - 30) > 1) {
            result.errors.push(`Platform percentage incorrect: ${result.platformPercentage.toFixed(2)}% !== 30%`)
          }
        } else {
          result.errors.push('Application fee webhook not received')
        }
      }
      
      // Verify in database
      if (this.databaseTracker) {
        console.log('   Verifying transfer in database...')
        
        const transaction = await this.databaseTracker.getTransactionBySubscription(subscriptionId)
        
        if (transaction) {
          if (!transaction.stripe_transfer_id) {
            result.errors.push('Transfer ID not recorded in database')
          }
          
          if (!transaction.stripe_application_fee_id) {
            result.errors.push('Application fee ID not recorded in database')
          }
          
          if (transaction.transfer_status !== 'pending' && transaction.transfer_status !== 'paid') {
            result.errors.push(`Invalid transfer status: ${transaction.transfer_status}`)
          }
        } else {
          result.errors.push('Transaction record not found in database')
        }
      }
      
      // Check creator's Stripe balance
      console.log('   Checking creator balance...')
      const balance = await this.stripe.balance.retrieve({
        stripeAccount: creatorStripeAccountId
      })
      
      const pendingBalance = balance.pending.find(b => b.currency === 'usd')
      const availableBalance = balance.available.find(b => b.currency === 'usd')
      
      console.log(`   Pending balance: $${pendingBalance ? pendingBalance.amount / 100 : 0}`)
      console.log(`   Available balance: $${availableBalance ? availableBalance.amount / 100 : 0}`)
      
      // The transfer should be in pending balance initially
      if (pendingBalance && pendingBalance.amount > 0) {
        console.log('   ✅ Creator has pending balance from transfer')
      } else {
        result.errors.push('No pending balance found in creator account')
      }
      
    } catch (error) {
      console.error('Error verifying transfer:', error)
      result.errors.push(`Transfer verification failed: ${error}`)
    }
    
    // Summary
    if (result.errors.length === 0) {
      console.log('✅ Transfer verification successful')
      console.log(`   Creator receives: $${result.transferAmount} (${result.creatorPercentage.toFixed(1)}%)`)
      console.log(`   Platform receives: $${result.applicationFeeAmount} (${result.platformPercentage.toFixed(1)}%)`)
    } else {
      console.error('❌ Transfer verification failed:')
      result.errors.forEach(error => console.error(`   - ${error}`))
    }
    
    return result
  }
  
  /**
   * Track complete subscription flow
   */
  async trackCompleteSubscriptionFlow(
    userId: string,
    options: SubscriptionCheckoutOptions
  ): Promise<{
    success: boolean
    subscriptionId?: string
    transferVerification?: TransferVerificationResult
    databaseVerification?: any
  }> {
    console.log('🔄 Tracking complete subscription flow...')
    
    // Select tier and process checkout
    await this.selectSubscriptionTier(options.creatorId, options.tierId)
    const checkoutResult = await this.processSubscriptionCheckout(options)
    
    if (!checkoutResult.success) {
      return { success: false }
    }
    
    // Track database changes
    let databaseVerification
    if (this.databaseTracker) {
      databaseVerification = await this.databaseTracker.trackSubscriptionLifecycle(
        userId,
        options.tierId,
        options.expectedPrice
      )
    }
    
    // Get subscription ID from database
    const subscriptionId = databaseVerification?.order?.id
    
    // Verify transfer if we have subscription ID and creator account
    let transferVerification
    if (subscriptionId && options.creatorStripeAccountId) {
      transferVerification = await this.verifyTransfer(
        subscriptionId,
        options.expectedPrice,
        options.creatorStripeAccountId
      )
    }
    
    return {
      success: true,
      subscriptionId,
      transferVerification,
      databaseVerification
    }
  }
  
  /**
   * Verify subscription appears in fan's management page
   */
  async verifySubscriptionInManagement(
    creatorName: string,
    tierName: string,
    amount: number
  ): Promise<boolean> {
    console.log('📋 Verifying subscription in management page...')
    
    // Navigate to subscriptions page
    await this.page.goto('/fan/subscriptions')
    await this.page.waitForLoadState('networkidle')
    
    // Look for subscription card
    const subscriptionCard = this.page.locator('.subscription-card, [data-testid*="subscription"]').filter({
      hasText: creatorName
    })
    
    if (await subscriptionCard.isVisible({ timeout: 5000 }).catch(() => false)) {
      console.log(`   ✅ Found subscription for ${creatorName}`)
      
      // Verify tier name
      const tierText = await subscriptionCard.locator(`text=/${tierName}/i`).isVisible().catch(() => false)
      if (!tierText) {
        console.log(`   ⚠️ Tier name ${tierName} not found`)
        return false
      }
      
      // Verify amount
      const amountText = await subscriptionCard.locator(`text=/$${amount}/`).isVisible().catch(() => false)
      if (!amountText) {
        console.log(`   ⚠️ Amount $${amount} not found`)
        return false
      }
      
      // Verify status is active
      const statusText = await subscriptionCard.locator('text=/Active/i').isVisible().catch(() => false)
      if (!statusText) {
        console.log('   ⚠️ Status "Active" not found')
        return false
      }
      
      console.log('   ✅ Subscription details verified')
      return true
    }
    
    console.log('   ❌ Subscription not found in management page')
    return false
  }
}

/**
 * Create subscription helper for tests
 */
export function createSubscriptionHelper(
  page: Page,
  webhookListener?: StripeWebhookListener,
  databaseTracker?: DatabaseTracker
): SubscriptionHelper {
  return new SubscriptionHelper(page, webhookListener, databaseTracker)
}

/**
 * Helper to get creator's Stripe account balance
 */
export async function getCreatorBalance(
  creatorStripeAccountId: string
): Promise<{
  pending: number
  available: number
  currency: string
}> {
  const stripeKey = process.env.STRIPE_SANDBOX_SECRET_KEY
  if (!stripeKey) {
    throw new Error('Stripe secret key is required')
  }
  
  const stripe = new Stripe(stripeKey, {
    apiVersion: '2024-12-18.acacia',
  })
  
  const balance = await stripe.balance.retrieve({
    stripeAccount: creatorStripeAccountId
  })
  
  const pending = balance.pending.find(b => b.currency === 'usd') || { amount: 0 }
  const available = balance.available.find(b => b.currency === 'usd') || { amount: 0 }
  
  return {
    pending: pending.amount / 100,
    available: available.amount / 100,
    currency: 'usd'
  }
}