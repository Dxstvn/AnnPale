import { describe, test, expect, beforeEach, vi } from 'vitest'

// Create mock instances
const mockStripeInstance = {
  accounts: {
    create: vi.fn(),
    retrieve: vi.fn(),
    update: vi.fn(),
  },
  accountLinks: {
    create: vi.fn(),
  },
  paymentIntents: {
    create: vi.fn(),
    confirm: vi.fn(),
    retrieve: vi.fn(),
  },
  transfers: {
    list: vi.fn(),
  },
  refunds: {
    create: vi.fn(),
  },
  applicationFees: {
    listRefunds: vi.fn(),
  },
  products: {
    create: vi.fn(),
  },
  prices: {
    create: vi.fn(),
  },
  subscriptions: {
    create: vi.fn(),
    cancel: vi.fn(),
  },
  invoices: {
    retrieveUpcoming: vi.fn(),
    retrieve: vi.fn(),
  },
}

const mockSupabaseClient = {
  from: vi.fn(() => mockSupabaseClient),
  select: vi.fn(() => mockSupabaseClient),
  insert: vi.fn(() => mockSupabaseClient),
  update: vi.fn(() => mockSupabaseClient),
  eq: vi.fn(() => mockSupabaseClient),
  single: vi.fn(),
  gte: vi.fn(() => mockSupabaseClient),
  lte: vi.fn(() => mockSupabaseClient),
}

// Mock Stripe
vi.mock('stripe', () => {
  return {
    default: vi.fn(() => mockStripeInstance),
  }
})

// Mock Supabase
vi.mock('@/lib/supabase/client', () => {
  return {
    createClient: vi.fn(() => mockSupabaseClient),
  }
})

// Mock environment variables
process.env.STRIPE_SANDBOX_SECRET_KEY = 'sk_test_mock'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'

// Import after mocks are defined
import { StripeConnectService } from '@/lib/stripe/connect-service'

describe('Stripe Connect Onboarding Integration', () => {
  let stripeService: StripeConnectService
  let testCreatorId: string

  beforeEach(() => {
    vi.clearAllMocks()
    
    testCreatorId = 'test-creator-123'
    stripeService = new StripeConnectService()
  })

  describe('Creator Onboarding Flow', () => {
    test('complete creator onboarding flow', async () => {
      mockSupabaseClient.single.mockResolvedValueOnce({
        data: {
          id: testCreatorId,
          name: 'Test Creator',
          email: 'creator@test.com',
        },
        error: null,
      })

      mockStripeInstance.accounts.create.mockResolvedValueOnce({
        id: 'acct_test123',
        charges_enabled: false,
        payouts_enabled: false,
      })

      mockStripeInstance.accountLinks.create.mockResolvedValueOnce({
        url: 'https://connect.stripe.com/test/onboarding',
      })

      mockSupabaseClient.eq.mockResolvedValueOnce({
        data: null,
        error: null,
      })

      const result = await stripeService.createConnectedAccount(testCreatorId)
      
      expect(result.accountId).toBe('acct_test123')
      expect(result.onboardingUrl).toBe('https://connect.stripe.com/test/onboarding')
      
      expect(mockStripeInstance.accounts.create).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'express',
          country: 'US',
          email: 'creator@test.com',
        })
      )
      
      mockStripeInstance.accounts.retrieve.mockResolvedValueOnce({
        id: 'acct_test123',
        charges_enabled: true,
        payouts_enabled: true,
        details_submitted: true,
        requirements: { currently_due: [], errors: [] },
      })
      
      const account = await stripeService.getAccount('acct_test123')
      expect(account.charges_enabled).toBe(true)
      expect(account.payouts_enabled).toBe(true)
    })

    test('creates payment with 70/30 split', async () => {
      const accountId = 'acct_test123'
      
      mockStripeInstance.accounts.retrieve.mockResolvedValueOnce({
        id: accountId,
        charges_enabled: true,
        payouts_enabled: true,
      })
      
      mockStripeInstance.paymentIntents.create.mockResolvedValueOnce({
        id: 'pi_test123',
        amount: 10000,
        application_fee_amount: 3000,
        transfer_data: { destination: accountId },
        metadata: { videoRequestId: 'req_123' },
      })
      
      mockSupabaseClient.insert.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: { id: 'txn_123' },
          error: null,
        }),
      })
      
      const paymentIntent = await stripeService.createPaymentWithSplit({
        amount: 100,
        creatorAccountId: accountId,
        customerId: 'test_customer',
        metadata: {
          videoRequestId: 'req_123',
          tierName: 'Gold',
        },
      })
      
      // Verify 70/30 split
      expect(paymentIntent.amount).toBe(10000)
      expect(paymentIntent.transfer_data.destination).toBe(accountId)
      expect(paymentIntent.application_fee_amount).toBe(3000) // 30% fee
      
      // Verify the split percentages
      const creatorAmount = paymentIntent.amount - paymentIntent.application_fee_amount
      expect(creatorAmount).toBe(7000) // 70% to creator
      expect(creatorAmount / paymentIntent.amount).toBe(0.7)
      expect(paymentIntent.application_fee_amount / paymentIntent.amount).toBe(0.3)
    })

    test('handles refunds with fee reversal', async () => {
      const paymentIntentId = 'pi_test123'
      
      mockStripeInstance.paymentIntents.retrieve.mockResolvedValueOnce({
        id: paymentIntentId,
        amount: 10000,
        application_fee: 'fee_test123',
      })
      
      mockStripeInstance.refunds.create.mockResolvedValueOnce({
        id: 'refund_test123',
        status: 'succeeded',
        amount: 10000,
      })
      
      mockSupabaseClient.eq.mockResolvedValueOnce({
        data: null,
        error: null,
      })
      
      const refund = await stripeService.refundPayment(paymentIntentId, {
        reason: 'requested_by_customer',
        reverseTransfer: true,
      })
      
      expect(refund.status).toBe('succeeded')
      expect(refund.amount).toBe(10000)
      
      expect(mockStripeInstance.refunds.create).toHaveBeenCalledWith({
        payment_intent: paymentIntentId,
        amount: 10000,
        reason: 'requested_by_customer',
        reverse_transfer: true,
        refund_application_fee: true,
      })
    })

    test('handles partial refunds', async () => {
      const paymentIntentId = 'pi_test123'
      
      mockStripeInstance.paymentIntents.retrieve.mockResolvedValueOnce({
        id: paymentIntentId,
        amount: 10000,
        application_fee: 'fee_test123',
      })
      
      mockStripeInstance.refunds.create.mockResolvedValueOnce({
        id: 'refund_test456',
        status: 'succeeded',
        amount: 5000,
      })
      
      mockSupabaseClient.eq.mockResolvedValueOnce({
        data: null,
        error: null,
      })
      
      const refund = await stripeService.refundPayment(paymentIntentId, {
        amount: 50,
        reason: 'requested_by_customer',
        reverseTransfer: true,
      })
      
      expect(refund.amount).toBe(5000)
      
      expect(mockStripeInstance.refunds.create).toHaveBeenCalledWith({
        payment_intent: paymentIntentId,
        amount: 5000,
        reason: 'requested_by_customer',
        reverse_transfer: true,
        refund_application_fee: true,
      })
    })

    test('validates creator account before payment', async () => {
      mockStripeInstance.accounts.retrieve.mockRejectedValueOnce(
        new Error('No such account')
      )
      
      await expect(
        stripeService.createPaymentWithSplit({
          amount: 100,
          creatorAccountId: 'invalid_account',
          customerId: 'test_customer',
          metadata: {},
        })
      ).rejects.toThrow('Creator account not found or not active')
      
      mockStripeInstance.accounts.retrieve.mockResolvedValueOnce({
        id: 'acct_incomplete',
        charges_enabled: false,
        payouts_enabled: false,
      })
      
      await expect(
        stripeService.createPaymentWithSplit({
          amount: 100,
          creatorAccountId: 'acct_incomplete',
          customerId: 'test_customer',
          metadata: {},
        })
      ).rejects.toThrow('Creator has not completed payment setup')
    })

    test('tracks payment metrics', async () => {
      const accountId = 'acct_test123'
      
      mockSupabaseClient.lte.mockResolvedValueOnce({
        data: [
          { amount: 100, platform_fee: 30, creator_earnings: 70, status: 'completed' },
          { amount: 150, platform_fee: 45, creator_earnings: 105, status: 'completed' },
          { amount: 200, platform_fee: 60, creator_earnings: 140, status: 'completed' },
        ],
        error: null,
      })
      
      const earnings = await stripeService.getCreatorEarnings(accountId, {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
      })
      
      expect(earnings.totalRevenue).toBe(45000) // $450 in cents
      expect(earnings.platformFees).toBe(13500) // 30%
      expect(earnings.netEarnings).toBe(31500) // 70%
      expect(earnings.transactionCount).toBe(3)
      
      // Verify 70/30 split ratio
      expect(earnings.netEarnings / earnings.totalRevenue).toBeCloseTo(0.70, 2)
      expect(earnings.platformFees / earnings.totalRevenue).toBeCloseTo(0.30, 2)
    })
  })

  describe('Subscription Payment Splits', () => {
    test('processes subscription payment with split', async () => {
      const accountId = 'acct_test123'
      
      mockStripeInstance.accounts.retrieve.mockResolvedValueOnce({
        id: accountId,
        charges_enabled: true,
        payouts_enabled: true,
      })
      
      mockStripeInstance.products.create.mockResolvedValueOnce({
        id: 'prod_test123',
        name: 'Gold Tier Subscription',
      })
      
      mockStripeInstance.prices.create.mockResolvedValueOnce({
        id: 'price_test123',
        unit_amount: 2000,
        recurring: { interval: 'month' },
      })
      
      mockStripeInstance.subscriptions.create.mockResolvedValueOnce({
        id: 'sub_test123',
        status: 'active',
        items: {
          data: [{ price: { unit_amount: 2000 } }],
        },
        current_period_start: Math.floor(Date.now() / 1000),
        current_period_end: Math.floor(Date.now() / 1000) + 2592000,
      })
      
      mockSupabaseClient.insert.mockReturnValueOnce({
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValueOnce({
          data: { id: 'sub_db_123' },
          error: null,
        }),
      })
      
      const subscription = await stripeService.createSubscriptionWithSplit({
        amount: 20,
        creatorAccountId: accountId,
        customerId: 'test_customer',
        tierName: 'Gold Tier',
        interval: 'month',
      })
      
      expect(subscription.status).toBe('active')
      expect(subscription.items.data[0].price.unit_amount).toBe(2000)
      
      expect(mockStripeInstance.subscriptions.create).toHaveBeenCalledWith({
        customer: 'test_customer',
        items: [{ price: 'price_test123' }],
        application_fee_percent: 30, // 30% platform fee
        transfer_data: {
          destination: accountId,
        },
        metadata: {
          creatorAccountId: accountId,
          tierName: 'Gold Tier',
          platformFeePercent: 30,
        },
      })
    })

    test('handles subscription cancellation', async () => {
      const subscriptionId = 'sub_test123'
      
      mockStripeInstance.subscriptions.cancel.mockResolvedValueOnce({
        id: subscriptionId,
        status: 'canceled',
        canceled_at: Math.floor(Date.now() / 1000),
        latest_invoice: 'inv_test123',
      })
      
      mockStripeInstance.invoices.retrieve.mockResolvedValueOnce({
        id: 'inv_test123',
        total: -500,
      })
      
      mockSupabaseClient.eq.mockResolvedValueOnce({
        data: null,
        error: null,
      })
      
      const canceled = await stripeService.cancelSubscription(subscriptionId, {
        prorate: true,
        invoice_now: true,
      })
      
      expect(canceled.status).toBe('canceled')
      expect(canceled.canceled_at).toBeTruthy()
      
      const invoice = await stripeService.getInvoice(canceled.latest_invoice as string)
      expect(invoice.total).toBeLessThan(0)
    })
  })

  describe('Error Handling', () => {
    test('handles network errors gracefully', async () => {
      mockStripeInstance.paymentIntents.create.mockRejectedValueOnce(
        new Error('Network error')
      )
      
      mockStripeInstance.accounts.retrieve.mockResolvedValueOnce({
        id: 'acct_test',
        charges_enabled: true,
        payouts_enabled: true,
      })
      
      await expect(
        stripeService.createPaymentWithSplit({
          amount: 100,
          creatorAccountId: 'acct_test',
          customerId: 'cust_test',
          metadata: {},
        })
      ).rejects.toThrow('Network error')
    })

    test('handles invalid amounts', async () => {
      await expect(
        stripeService.createPaymentWithSplit({
          amount: -100,
          creatorAccountId: 'acct_test',
          customerId: 'cust_test',
          metadata: {},
        })
      ).rejects.toThrow('Invalid payment amount')
      
      await expect(
        stripeService.createPaymentWithSplit({
          amount: 0.5,
          creatorAccountId: 'acct_test',
          customerId: 'cust_test',
          metadata: {},
        })
      ).rejects.toThrow('Minimum payment amount is $1')
    })
  })
})