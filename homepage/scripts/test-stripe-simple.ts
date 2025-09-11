#!/usr/bin/env tsx

import Stripe from 'stripe'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(__dirname, '../.env.local') })

const stripe = new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

async function testBasicPayment() {
  console.log('💳 Testing basic payment flow...')
  
  try {
    // Create a test customer
    const customer = await stripe.customers.create({
      email: 'test-fan@annpale.com',
      description: 'Test fan for payment flow',
      metadata: {
        platform: 'ann-pale',
        test: 'true',
      },
    })
    
    console.log('✅ Created customer:', customer.id)
    
    // Create payment intent
    const amount = 5000 // $50.00
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      customer: customer.id,
      description: 'Test payment for Ann Pale platform',
      payment_method_types: ['card'], // Only accept card payments for testing
      metadata: {
        video_request_id: `test-video-${Date.now()}`,
        platform: 'ann-pale',
        test: 'true',
      },
    })
    
    console.log('✅ Created payment intent:', paymentIntent.id)
    console.log('   Amount: $', amount / 100)
    console.log('   Status:', paymentIntent.status)
    
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

async function testRefund(paymentIntentId: string) {
  console.log('\n↩️  Testing refund...')
  
  try {
    // Create a refund
    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
      reason: 'requested_by_customer',
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
  console.log('\n📨 Checking recent events...')
  
  try {
    const events = await stripe.events.list({
      limit: 5,
      types: ['payment_intent.succeeded', 'payment_intent.created', 'charge.refunded'],
    })
    
    console.log('Recent relevant events:')
    events.data.forEach(event => {
      const date = new Date(event.created * 1000).toLocaleString()
      console.log(`  - ${event.type} at ${date}`)
    })
    
    return events
  } catch (error) {
    console.error('Error checking events:', error)
    throw error
  }
}

async function verifyWebhookLogging() {
  console.log('\n🔍 Checking webhook logs in database...')
  
  try {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    
    const { data: webhooks, error } = await supabase
      .from('webhook_events')
      .select('*')
      .eq('provider', 'stripe')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (error) {
      console.error('Database error:', error)
      return
    }
    
    if (webhooks && webhooks.length > 0) {
      console.log('✅ Found webhook logs in database:')
      webhooks.forEach(webhook => {
        console.log(`  - ${webhook.event_type} at ${webhook.created_at}`)
      })
    } else {
      console.log('⚠️  No webhook logs found in database')
    }
  } catch (error) {
    console.log('⚠️  Could not verify database logs (expected in test environment)')
  }
}

async function main() {
  console.log('🚀 Starting Stripe Integration Testing')
  console.log('=====================================\n')
  console.log('Using account:', process.env.STRIPE_SANDBOX_PUBLIC_KEY?.substring(0, 20) + '...')
  console.log('Webhook forwarding should be running on: localhost:3000/api/webhooks/stripe\n')
  
  try {
    // Test basic payment
    const payment = await testBasicPayment()
    
    // Wait for webhooks to process
    console.log('\n⏳ Waiting for webhooks to process...')
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Test refund
    await testRefund(payment.id)
    
    // Wait for refund webhooks
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Check webhook events
    await checkWebhookEvents()
    
    // Verify database logs
    await verifyWebhookLogging()
    
    console.log('\n✅ All tests completed!')
    console.log('Check the webhook forwarding terminal to see if events were received.')
    console.log('Check the dev server logs for webhook processing output.')
    
  } catch (error) {
    console.error('\n❌ Test failed:', error)
    process.exit(1)
  }
}

// Run the tests
main()