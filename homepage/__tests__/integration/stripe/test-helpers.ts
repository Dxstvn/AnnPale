/**
 * Stripe Test Helpers
 * Utilities for creating test data in Stripe's test environment
 */
import Stripe from 'stripe'

// Initialize Stripe with test key
const stripe = new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
})

export interface TestAccount {
  account: Stripe.Account
  onboardingUrl?: string
}

export interface TestCustomer {
  customer: Stripe.Customer
  paymentMethod?: Stripe.PaymentMethod
}

export interface TestPayment {
  paymentIntent: Stripe.PaymentIntent
  platformFee: number
  creatorEarnings: number
  splitPercentage: number
}

/**
 * Creates a test connected account that's ready for testing
 * Note: In test mode, accounts can't be fully onboarded programmatically
 */
export async function createTestConnectedAccount(
  email?: string
): Promise<TestAccount> {
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'US',
    email: email || `creator-${Date.now()}@test.annpale.com`,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
    business_type: 'individual',
    business_profile: {
      mcc: '5815',
      name: 'Test Creator',
      product_description: 'Personalized video messages',
    },
    metadata: {
      test: 'true',
      created_at: new Date().toISOString(),
    },
  })

  // Create onboarding link
  const accountLink = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: 'http://localhost:3000/creator/settings/payments?refresh=true',
    return_url: 'http://localhost:3000/creator/settings/payments?success=true',
    type: 'account_onboarding',
  })

  return {
    account,
    onboardingUrl: accountLink.url,
  }
}

/**
 * Creates a test customer with a test payment method
 */
export async function createTestCustomer(
  email?: string
): Promise<TestCustomer> {
  const customer = await stripe.customers.create({
    email: email || `customer-${Date.now()}@test.annpale.com`,
    name: 'Test Customer',
    metadata: {
      test: 'true',
    },
  })

  // Attach a test card
  const paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card: {
      token: 'tok_visa', // Test token for Visa card
    },
  })

  await stripe.paymentMethods.attach(paymentMethod.id, {
    customer: customer.id,
  })

  return {
    customer,
    paymentMethod,
  }
}

/**
 * Creates a test payment with 70/30 split
 */
export async function createTestPaymentWith7030Split(
  amount: number,
  customerIdOrEmail: string,
  connectedAccountId: string
): Promise<TestPayment> {
  // Get or create customer
  let customerId: string
  if (customerIdOrEmail.startsWith('cus_')) {
    customerId = customerIdOrEmail
  } else {
    const customer = await createTestCustomer(customerIdOrEmail)
    customerId = customer.customer.id
  }

  const amountInCents = Math.round(amount * 100)
  const platformFee = Math.round(amountInCents * 0.30) // 30% platform fee
  const creatorEarnings = amountInCents - platformFee // 70% to creator

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: 'usd',
    customer: customerId,
    application_fee_amount: platformFee,
    transfer_data: {
      destination: connectedAccountId,
    },
    metadata: {
      test: 'true',
      split: '70/30',
      platform_fee: platformFee.toString(),
      creator_earnings: creatorEarnings.toString(),
    },
  })

  return {
    paymentIntent,
    platformFee: platformFee / 100,
    creatorEarnings: creatorEarnings / 100,
    splitPercentage: 0.70,
  }
}

/**
 * Confirms a test payment intent with a test card
 */
export async function confirmTestPayment(
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> {
  return await stripe.paymentIntents.confirm(paymentIntentId, {
    payment_method: 'pm_card_visa', // Test payment method
  })
}

/**
 * Creates and confirms a complete test payment flow
 */
export async function executeCompletePaymentFlow(
  amount: number,
  connectedAccountId: string
): Promise<{
  payment: TestPayment
  confirmed: Stripe.PaymentIntent
}> {
  const customer = await createTestCustomer()
  const payment = await createTestPaymentWith7030Split(
    amount,
    customer.customer.id,
    connectedAccountId
  )
  
  const confirmed = await confirmTestPayment(payment.paymentIntent.id)
  
  return {
    payment,
    confirmed,
  }
}

/**
 * Verifies 70/30 split calculations
 */
export function verify7030Split(paymentIntent: Stripe.PaymentIntent): {
  isValid: boolean
  platformFeePercent: number
  creatorPercent: number
  errors: string[]
} {
  const errors: string[] = []
  const amount = paymentIntent.amount
  const platformFee = paymentIntent.application_fee_amount || 0
  const creatorAmount = amount - platformFee

  const platformFeePercent = platformFee / amount
  const creatorPercent = creatorAmount / amount

  // Check if platform fee is 30%
  if (Math.abs(platformFeePercent - 0.30) > 0.01) {
    errors.push(`Platform fee is ${(platformFeePercent * 100).toFixed(2)}%, expected 30%`)
  }

  // Check if creator gets 70%
  if (Math.abs(creatorPercent - 0.70) > 0.01) {
    errors.push(`Creator receives ${(creatorPercent * 100).toFixed(2)}%, expected 70%`)
  }

  return {
    isValid: errors.length === 0,
    platformFeePercent,
    creatorPercent,
    errors,
  }
}

/**
 * Cleans up test resources
 */
export async function cleanupTestResources(resources: {
  accounts?: string[]
  customers?: string[]
  paymentIntents?: string[]
  subscriptions?: string[]
}) {
  const results = {
    success: [] as string[],
    failed: [] as string[],
  }

  // Cancel subscriptions
  if (resources.subscriptions) {
    for (const id of resources.subscriptions) {
      try {
        await stripe.subscriptions.cancel(id)
        results.success.push(`Canceled subscription: ${id}`)
      } catch (e: any) {
        results.failed.push(`Failed to cancel subscription ${id}: ${e.message}`)
      }
    }
  }

  // Note: Accounts, customers, and payment intents can't be deleted in test mode
  // They will remain but won't affect production

  return results
}

/**
 * Waits for a webhook event to be received
 * Requires webhook endpoint to be set up and stripe CLI forwarding
 */
export async function waitForWebhookEvent(
  eventType: string,
  timeoutMs: number = 10000
): Promise<Stripe.Event | null> {
  const startTime = Date.now()
  
  while (Date.now() - startTime < timeoutMs) {
    // List recent events
    const events = await stripe.events.list({
      type: eventType,
      created: {
        gte: Math.floor(startTime / 1000),
      },
      limit: 1,
    })
    
    if (events.data.length > 0) {
      return events.data[0]
    }
    
    // Wait 1 second before checking again
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  return null
}

/**
 * Gets test account ID for a fully onboarded test account
 * This should be an account that's been manually onboarded in test mode
 */
export function getTestConnectedAccountId(): string {
  // This should be replaced with an actual test account ID
  // that has been onboarded in your Stripe test dashboard
  const testAccountId = process.env.STRIPE_TEST_CONNECTED_ACCOUNT_ID
  
  if (!testAccountId) {
    console.warn(
      'No test connected account ID found. ' +
      'Set STRIPE_TEST_CONNECTED_ACCOUNT_ID env variable ' +
      'with a fully onboarded test account ID'
    )
    // Return a placeholder that will cause tests to skip
    return 'acct_test_placeholder'
  }
  
  return testAccountId
}