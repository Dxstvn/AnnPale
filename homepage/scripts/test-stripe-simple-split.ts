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

async function simulatePaymentSplit() {
  console.log('💳 Simulating payment with 70/30 split (without Connect)...')
  
  try {
    // Create a test customer (the fan)
    const customer = await stripe.customers.create({
      email: 'fan@annpale.test',
      description: 'Test fan purchasing video',
      metadata: {
        platform: 'ann-pale',
        role: 'fan',
      },
    })
    
    console.log('✅ Created customer:', customer.id)
    
    // Create payment intent
    const amount = 10000 // $100.00
    const platformFee = Math.round(amount * PLATFORM_FEE_PERCENTAGE)
    const creatorEarnings = amount - platformFee
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      customer: customer.id,
      description: 'Video message from Haitian celebrity',
      payment_method_types: ['card'],
      metadata: {
        // Store the split information in metadata for now
        total_amount: amount.toString(),
        platform_fee: platformFee.toString(),
        creator_earnings: creatorEarnings.toString(),
        platform_fee_percentage: (PLATFORM_FEE_PERCENTAGE * 100).toString(),
        creator_id: 'test-creator-123',
        video_request_id: `video-${Date.now()}`,
        platform: 'ann-pale',
      },
    })
    
    console.log('\n📊 Payment Split Calculation:')
    console.log('   Total Amount: $', amount / 100)
    console.log('   Platform Fee (30%): $', platformFee / 100)
    console.log('   Creator Earnings (70%): $', creatorEarnings / 100)
    console.log('\n✅ Created payment intent:', paymentIntent.id)
    
    // Confirm payment with test card
    const confirmedPayment = await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: 'pm_card_visa',
    })
    
    console.log('✅ Payment confirmed:', confirmedPayment.status)
    
    // In a real scenario with Connect enabled, this would automatically:
    // 1. Transfer 70% to the creator's connected account
    // 2. Keep 30% as platform fee
    // For now, we're tracking this in metadata and would handle payouts manually
    
    return confirmedPayment
  } catch (error) {
    console.error('Error testing payment:', error)
    throw error
  }
}

async function simulateRefundWithSplit(paymentIntentId: string) {
  console.log('\n↩️  Simulating refund with fee reversal...')
  
  try {
    // Get the original payment to calculate refund split
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    const platformFee = parseInt(paymentIntent.metadata.platform_fee)
    const creatorEarnings = parseInt(paymentIntent.metadata.creator_earnings)
    
    // Create a refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: 'requested_by_customer',
      metadata: {
        platform_fee_reversed: platformFee.toString(),
        creator_earnings_reversed: creatorEarnings.toString(),
        reason: 'Customer requested refund',
        platform: 'ann-pale',
      },
    })
    
    console.log('✅ Refund created:', refund.id)
    console.log('   Total refunded: $', refund.amount / 100)
    console.log('   Platform fee reversed: $', platformFee / 100)
    console.log('   Creator earnings reversed: $', creatorEarnings / 100)
    
    return refund
  } catch (error) {
    console.error('Error testing refund:', error)
    throw error
  }
}

async function main() {
  console.log('🚀 Testing Payment Splits (Without Connect)')
  console.log('============================================')
  console.log('This simulates how the 70/30 split would work')
  console.log('Once Connect is enabled, this will be automatic\n')
  
  try {
    // Test payment with split
    const payment = await simulatePaymentSplit()
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Test refund with split reversal
    await simulateRefundWithSplit(payment.id)
    
    console.log('\n✅ Test completed successfully!')
    console.log('\n📝 Next Steps:')
    console.log('1. Enable Stripe Connect in your dashboard')
    console.log('2. Once enabled, run the full Connect test script')
    console.log('3. The platform will automatically handle splits and transfers')
    
  } catch (error) {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  }
}

// Run the tests
main()