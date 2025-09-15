import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server'

// Initialize Stripe with sandbox credentials
const stripe = new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

// Platform fee percentage (30%)
const PLATFORM_FEE_PERCENTAGE = 0.30

export interface PaymentSplitOptions {
  amount: number // Amount in dollars
  creatorAccountId: string
  customerId: string
  metadata: Record<string, any>
}

export interface RefundOptions {
  amount?: number // Optional for partial refunds
  reason: 'duplicate' | 'fraudulent' | 'requested_by_customer'
  reverseTransfer: boolean
}

export interface SubscriptionOptions {
  amount: number
  creatorAccountId: string
  customerId: string
  tierName: string
  interval: 'month' | 'year'
}

export interface EarningsReport {
  totalRevenue: number
  platformFees: number
  netEarnings: number
  transactionCount: number
}

export class StripeConnectService {
  private stripe: Stripe

  constructor() {
    this.stripe = stripe
  }

  /**
   * Create a Stripe Connect account for a creator
   */
  async createConnectedAccount(creatorId: string, country?: string): Promise<{ accountId: string; onboardingUrl: string }> {
    try {
      // Get creator details from database - fetch all fields for prefilling
      const supabase = await createClient()
      const { data: creator, error } = await supabase
        .from('profiles')
        .select('name, email, first_name, last_name, display_name, phone, bio, website, category')
        .eq('id', creatorId)
        .single()

      if (error || !creator) {
        throw new Error('Creator not found')
      }

      // Parse name into first and last if not already separated
      let firstName = creator.first_name
      let lastName = creator.last_name

      if (!firstName || !lastName) {
        const nameParts = creator.name.split(' ')
        firstName = firstName || nameParts[0]
        lastName = lastName || nameParts.slice(1).join(' ')
      }

      // Build the Ann Pale fan-facing profile URL
      const profileUrl = `https://annpale.com/fan/creator/${creatorId}`

      // Create Stripe Connect account with enhanced prefilling
      const accountData: any = {
        type: 'express',
        email: creator.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: 'individual',
        // Prefill individual information for faster onboarding
        individual: {
          email: creator.email,
          first_name: firstName,
          last_name: lastName || undefined,
          phone: creator.phone || undefined,
        },
        business_profile: {
          mcc: '5815', // Digital Goods Media
          name: creator.display_name || creator.name,
          product_description: `Personalized video messages from ${creator.display_name || creator.name} on Ann Pale - Haitian celebrity video platform`,
          url: creator.website || profileUrl, // Use creator's website or Ann Pale fan-facing profile
        },
        settings: {
          payouts: {
            schedule: {
              interval: 'daily',
            },
          },
        },
        metadata: {
          creatorId,
          platform: 'AnnPale',
          display_name: creator.display_name || creator.name,
          category: creator.category || undefined,
        },
      }

      // Add country if specified
      if (country) {
        accountData.country = country
      }

      const account = await this.stripe.accounts.create(accountData)

      // Create account onboarding link
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      const accountLink = await this.stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${appUrl}/creator/dashboard?onboarding=refresh`,
        return_url: `${appUrl}/creator/dashboard?onboarding=complete&account=${account.id}`,
        type: 'account_onboarding',
      })

      // DON'T save the account ID yet - wait until onboarding is complete
      // The account ID will be saved when the user returns from successful onboarding
      console.log(`Created Stripe account ${account.id} for creator ${creatorId}, but not saving until onboarding completes`)

      return {
        accountId: account.id,
        onboardingUrl: accountLink.url,
      }
    } catch (error) {
      console.error('Error creating connected account:', error)
      throw error
    }
  }

  /**
   * Get a Stripe Connect account
   */
  async getAccount(accountId: string): Promise<Stripe.Account> {
    try {
      return await this.stripe.accounts.retrieve(accountId)
    } catch (error) {
      console.error('Error retrieving account:', error)
      throw error
    }
  }

  /**
   * Simulate onboarding completion (for testing in sandbox mode)
   */
  async simulateOnboardingComplete(accountId: string): Promise<void> {
    // In production, this happens through the actual Stripe onboarding flow
    // For testing, we can update test accounts directly
    if (!process.env.STRIPE_SANDBOX_SECRET_KEY?.includes('test')) {
      throw new Error('This method is only available in test mode')
    }

    // Update account capabilities (simulated for testing)
    await this.stripe.accounts.update(accountId, {
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    })
  }

  /**
   * Create a payment with platform fee split (70% creator, 30% platform)
   */
  async createPaymentWithSplit(options: PaymentSplitOptions): Promise<Stripe.PaymentIntent> {
    const { amount, creatorAccountId, customerId, metadata } = options

    // Validate amount
    if (amount <= 0) {
      throw new Error('Invalid payment amount')
    }
    if (amount < 1) {
      throw new Error('Minimum payment amount is $1')
    }

    // Validate creator account
    const account = await this.validateCreatorAccount(creatorAccountId)

    // Calculate platform fee (30%)
    const amountInCents = Math.round(amount * 100)
    const platformFeeInCents = Math.round(amountInCents * PLATFORM_FEE_PERCENTAGE)

    try {
      // Create payment intent with automatic transfer to creator
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: amountInCents,
        currency: 'usd',
        customer: customerId,
        application_fee_amount: platformFeeInCents,
        transfer_data: {
          destination: creatorAccountId,
        },
        metadata: {
          ...metadata,
          creatorAccountId,
          platformFee: platformFeeInCents,
          creatorAmount: amountInCents - platformFeeInCents,
        },
      })

      // Save payment record to database
      const supabase = await createClient()
      await supabase.from('transactions').insert({
        stripe_payment_intent_id: paymentIntent.id,
        creator_id: metadata.creatorId || creatorAccountId,
        customer_id: customerId,
        amount: amount,
        platform_fee: platformFeeInCents / 100,
        creator_earnings: (amountInCents - platformFeeInCents) / 100,
        status: 'pending',
        type: metadata.videoRequestId ? 'video' : 'subscription',
        metadata,
      })

      return paymentIntent
    } catch (error) {
      console.error('Error creating payment with split:', error)
      throw error
    }
  }

  /**
   * Confirm a payment (for testing)
   */
  async confirmPayment(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      // In production, this happens on the client side
      // For testing, we can confirm directly
      const paymentIntent = await this.stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: 'pm_card_visa', // Test card
      })

      // Update transaction status
      const supabase = await createClient()
      await supabase
        .from('transactions')
        .update({ status: 'completed' })
        .eq('stripe_payment_intent_id', paymentIntentId)

      return paymentIntent
    } catch (error) {
      console.error('Error confirming payment:', error)
      throw error
    }
  }

  /**
   * Get transfers for a connected account
   */
  async getTransfers(accountId: string): Promise<Stripe.Transfer[]> {
    try {
      const transfers = await this.stripe.transfers.list({
        destination: accountId,
        limit: 100,
      })
      return transfers.data
    } catch (error) {
      console.error('Error getting transfers:', error)
      throw error
    }
  }

  /**
   * Refund a payment with optional fee reversal
   */
  async refundPayment(paymentIntentId: string, options: RefundOptions): Promise<Stripe.Refund> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId)
      
      // Calculate refund amount
      const refundAmount = options.amount 
        ? Math.round(options.amount * 100)
        : paymentIntent.amount

      // Create refund
      const refund = await this.stripe.refunds.create({
        payment_intent: paymentIntentId,
        amount: refundAmount,
        reason: options.reason,
        reverse_transfer: options.reverseTransfer,
        refund_application_fee: options.reverseTransfer, // Also refund the platform fee
      })

      // Update transaction status
      const supabase = await createClient()
      await supabase
        .from('transactions')
        .update({ 
          status: 'refunded',
          refund_amount: refundAmount / 100,
          refunded_at: new Date().toISOString(),
        })
        .eq('stripe_payment_intent_id', paymentIntentId)

      return refund
    } catch (error) {
      console.error('Error processing refund:', error)
      throw error
    }
  }

  /**
   * Get application fee refunds
   */
  async getApplicationFeeRefunds(paymentIntentId: string): Promise<Stripe.ApplicationFeeRefund[]> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ['application_fee'],
      })

      if (!paymentIntent.application_fee) {
        return []
      }

      const feeId = typeof paymentIntent.application_fee === 'string' 
        ? paymentIntent.application_fee 
        : paymentIntent.application_fee.id

      const refunds = await this.stripe.applicationFees.listRefunds(feeId)
      return refunds.data
    } catch (error) {
      console.error('Error getting fee refunds:', error)
      throw error
    }
  }

  /**
   * Create a subscription with platform split
   */
  async createSubscriptionWithSplit(options: SubscriptionOptions): Promise<Stripe.Subscription> {
    const { amount, creatorAccountId, customerId, tierName, interval } = options

    // Validate creator account
    await this.validateCreatorAccount(creatorAccountId)

    const amountInCents = Math.round(amount * 100)
    const platformFeeInCents = Math.round(amountInCents * PLATFORM_FEE_PERCENTAGE)

    try {
      // Create or get product for this tier
      const product = await this.stripe.products.create({
        name: `${tierName} Subscription`,
        metadata: {
          creatorAccountId,
          tierName,
        },
      })

      // Create price for the subscription
      const price = await this.stripe.prices.create({
        product: product.id,
        unit_amount: amountInCents,
        currency: 'usd',
        recurring: {
          interval,
        },
      })

      // Create subscription with transfer to creator
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: price.id }],
        application_fee_percent: PLATFORM_FEE_PERCENTAGE * 100, // 30%
        transfer_data: {
          destination: creatorAccountId,
        },
        metadata: {
          creatorAccountId,
          tierName,
          platformFeePercent: PLATFORM_FEE_PERCENTAGE * 100,
        },
      })

      // Save subscription to database
      const supabase = await createClient()
      await supabase.from('subscriptions').insert({
        stripe_subscription_id: subscription.id,
        creator_id: creatorAccountId,
        customer_id: customerId,
        tier_name: tierName,
        amount: amount,
        interval,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      })

      return subscription
    } catch (error) {
      console.error('Error creating subscription:', error)
      throw error
    }
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId: string, options?: { prorate?: boolean; invoice_now?: boolean }): Promise<Stripe.Subscription> {
    try {
      const subscription = await this.stripe.subscriptions.cancel(subscriptionId, options)

      // Update database
      const supabase = await createClient()
      await supabase
        .from('subscriptions')
        .update({ 
          status: 'canceled',
          canceled_at: new Date().toISOString(),
        })
        .eq('stripe_subscription_id', subscriptionId)

      return subscription
    } catch (error) {
      console.error('Error canceling subscription:', error)
      throw error
    }
  }

  /**
   * Get upcoming invoice for a subscription
   */
  async getUpcomingInvoice(subscriptionId: string): Promise<Stripe.Invoice> {
    try {
      return await this.stripe.invoices.retrieveUpcoming({
        subscription: subscriptionId,
      })
    } catch (error) {
      console.error('Error getting upcoming invoice:', error)
      throw error
    }
  }

  /**
   * Get an invoice by ID
   */
  async getInvoice(invoiceId: string): Promise<Stripe.Invoice> {
    try {
      return await this.stripe.invoices.retrieve(invoiceId)
    } catch (error) {
      console.error('Error getting invoice:', error)
      throw error
    }
  }

  /**
   * Get creator earnings report
   */
  async getCreatorEarnings(accountId: string, dateRange: { startDate: Date; endDate: Date }): Promise<EarningsReport> {
    try {
      // Get all transactions for the creator in the date range
      const supabase = await createClient()
      const { data: transactions, error } = await supabase
        .from('transactions')
        .select('amount, platform_fee, creator_earnings, status')
        .eq('creator_id', accountId)
        .eq('status', 'completed')
        .gte('created_at', dateRange.startDate.toISOString())
        .lte('created_at', dateRange.endDate.toISOString())

      if (error) throw error

      // Calculate totals
      const report: EarningsReport = {
        totalRevenue: 0,
        platformFees: 0,
        netEarnings: 0,
        transactionCount: transactions?.length || 0,
      }

      transactions?.forEach(transaction => {
        report.totalRevenue += transaction.amount * 100 // Convert to cents
        report.platformFees += transaction.platform_fee * 100
        report.netEarnings += transaction.creator_earnings * 100
      })

      return report
    } catch (error) {
      console.error('Error getting creator earnings:', error)
      throw error
    }
  }

  /**
   * Validate creator account is ready for payments
   */
  private async validateCreatorAccount(accountId: string): Promise<Stripe.Account> {
    try {
      const account = await this.stripe.accounts.retrieve(accountId)
      
      if (!account) {
        throw new Error('Creator account not found or not active')
      }

      if (!account.charges_enabled || !account.payouts_enabled) {
        throw new Error('Creator has not completed payment setup')
      }

      return account
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('No such account')) {
          throw new Error('Creator account not found or not active')
        }
      }
      throw error
    }
  }
}