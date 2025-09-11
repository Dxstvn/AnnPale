#!/usr/bin/env tsx

import Stripe from 'stripe'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') })

const stripe = new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

const PLATFORM_FEE_PERCENTAGE = 0.30 // 30% platform fee (70/30 split)

async function createTestConnectedAccount() {
  console.log('Creating test connected account...')
  
  try {
    // Create Express account
    const account = await stripe.accounts.create({
      type: 'express',
      country: 'US',
      email: `creator-${Date.now()}@annpale.test`,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      business_profile: {
        mcc: '5815', // Digital Goods Media
        url: 'https://annpale.com',
      },
      metadata: {
        creator_id: `test-creator-${Date.now()}`,
        platform: 'ann-pale',
      },
    })
    
    console.log('✅ Created account:', account.id)
    
    // Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'https://annpale.com/creator/settings/payments?refresh=true',
      return_url: 'https://annpale.com/creator/settings/payments?success=true',
      type: 'account_onboarding',
    })
    
    console.log('📝 Onboarding URL:', accountLink.url)
    
    return account
  } catch (error) {
    console.error('Error creating connected account:', error)
    throw error
  }
}

async function testPaymentWithSplit(creatorAccountId: string) {
  console.log('\n💳 Testing payment with 70/30 split...')
  
  try {
    // Create a test customer
    const customer = await stripe.customers.create({
      email: 'fan@annpale.test',
      description: 'Test fan for payment flow',
    })
    
    console.log('Created customer:', customer.id)
    
    // Create payment intent with application fee and transfer
    const amount = 10000 // $100.00
    const platformFee = Math.round(amount * PLATFORM_FEE_PERCENTAGE)
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      customer: customer.id,
      description: 'Test video message from creator',
      application_fee_amount: platformFee,
      transfer_data: {
        destination: creatorAccountId,
      },
      metadata: {
        creator_id: creatorAccountId,
        video_request_id: `test-video-${Date.now()}`,
        platform: 'ann-pale',
      },
    })
    
    console.log('✅ Created payment intent:', paymentIntent.id)
    console.log('   Amount: $', amount / 100)
    console.log('   Platform fee (30%): $', platformFee / 100)
    console.log('   Creator earnings (70%): $', (amount - platformFee) / 100)
    
    // Confirm payment with test card
    const confirmedPayment = await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: 'pm_card_visa',
    })
    
    console.log('✅ Payment confirmed:', confirmedPayment.status)
    
    return confirmedPayment
  } catch (error) {
    console.error('Error testing payment:', error)
    throw error
  }
}

async function testRefundWithFeeReversal(paymentIntentId: string) {
  console.log('\n↩️  Testing refund with fee reversal...')
  
  try {
    // Create a refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: 'requested_by_customer',
      refund_application_fee: true, // This reverses the platform fee
      metadata: {
        reason: 'Test refund',
        platform: 'ann-pale',
      },
    })
    
    console.log('✅ Refund created:', refund.id)
    console.log('   Amount refunded: $', refund.amount / 100)
    console.log('   Status:', refund.status)
    
    return refund
  } catch (error) {
    console.error('Error testing refund:', error)
    throw error
  }
}

async function checkWebhookEvents() {
  console.log('\n📨 Checking recent webhook events...')
  
  try {
    const events = await stripe.events.list({
      limit: 10,
    })
    
    console.log('Recent events:')
    events.data.forEach(event => {
      console.log(`  - ${event.type} (${event.created}): ${event.id}`)
    })
    
    return events
  } catch (error) {
    console.error('Error checking events:', error)
    throw error
  }
}

async function main() {
  console.log('🚀 Starting Stripe Connect Testing')
  console.log('=====================================\n')
  
  try {
    // Step 1: Create connected account
    const account = await createTestConnectedAccount()
    
    // Note: In test mode, we can bypass onboarding for testing
    console.log('\n⚡ Simulating account approval (test mode)...')
    const updatedAccount = await stripe.accounts.update(account.id, {
      tos_acceptance: {
        date: Math.floor(Date.now() / 1000),
        ip: '127.0.0.1',
      },
    })
    console.log('Account status:', {
      charges_enabled: updatedAccount.charges_enabled,
      payouts_enabled: updatedAccount.payouts_enabled,
    })
    
    // Wait a moment for webhooks to process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Step 2: Test payment with split
    const payment = await testPaymentWithSplit(account.id)
    
    // Wait for webhooks
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Step 3: Test refund
    await testRefundWithFeeReversal(payment.id)
    
    // Wait for webhooks
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Step 4: Check webhook events
    await checkWebhookEvents()
    
    console.log('\n✅ All tests completed successfully!')
    console.log('Check your webhook endpoint logs to verify events were received.')
    
  } catch (error) {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  }
}

// Run the tests
main()