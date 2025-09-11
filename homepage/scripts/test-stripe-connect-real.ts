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

async function testConnectPayment() {
  console.log('🚀 Testing Stripe Connect with 70/30 Split')
  console.log('===========================================\n')
  
  try {
    // Step 1: Create or retrieve a test connected account
    console.log('1️⃣ Creating Express connected account...')
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
        product_description: 'Personalized video messages from Haitian celebrities',
      },
      metadata: {
        creator_id: `test-creator-${Date.now()}`,
        platform: 'ann-pale',
      },
    })
    
    console.log('✅ Created account:', account.id)
    console.log('   Charges enabled:', account.charges_enabled)
    console.log('   Payouts enabled:', account.payouts_enabled)
    
    // Generate onboarding link
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: 'https://annpale.com/creator/settings/payments?refresh=true',
      return_url: 'https://annpale.com/creator/settings/payments?success=true',
      type: 'account_onboarding',
    })
    
    console.log('📝 Onboarding URL (for real onboarding):', accountLink.url)
    
    // Step 2: Create a customer (the fan)
    console.log('\n2️⃣ Creating customer (fan)...')
    const customer = await stripe.customers.create({
      email: 'fan@annpale.test',
      description: 'Test fan purchasing video message',
    })
    console.log('✅ Created customer:', customer.id)
    
    // Step 3: Create payment with application fee (70/30 split)
    console.log('\n3️⃣ Creating payment with 70/30 split...')
    const amount = 10000 // $100.00
    const platformFee = Math.round(amount * PLATFORM_FEE_PERCENTAGE)
    
    // Note: For this to work fully, the connected account needs to be onboarded
    // For testing, we'll create the payment intent without the transfer
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'usd',
      customer: customer.id,
      description: 'Video message from Haitian celebrity',
      payment_method_types: ['card'],
      // Uncomment these once the account is onboarded:
      // application_fee_amount: platformFee,
      // transfer_data: {
      //   destination: account.id,
      // },
      metadata: {
        creator_account_id: account.id,
        creator_earnings: (amount - platformFee).toString(),
        platform_fee: platformFee.toString(),
        video_request_id: `video-${Date.now()}`,
        platform: 'ann-pale',
      },
    })
    
    console.log('✅ Created payment intent:', paymentIntent.id)
    console.log('\n📊 Revenue Split:')
    console.log('   Total Amount: $' + (amount / 100))
    console.log('   Platform Fee (30%): $' + (platformFee / 100))
    console.log('   Creator Earnings (70%): $' + ((amount - platformFee) / 100))
    
    // Step 4: Confirm the payment
    console.log('\n4️⃣ Confirming payment...')
    const confirmedPayment = await stripe.paymentIntents.confirm(paymentIntent.id, {
      payment_method: 'pm_card_visa',
    })
    console.log('✅ Payment confirmed:', confirmedPayment.status)
    
    // Step 5: Check the account balance (would show transfers once onboarded)
    console.log('\n5️⃣ Checking platform balance...')
    const balance = await stripe.balance.retrieve()
    console.log('💰 Platform balance:', {
      available: balance.available[0]?.amount ? '$' + (balance.available[0].amount / 100) : '$0',
      pending: balance.pending[0]?.amount ? '$' + (balance.pending[0].amount / 100) : '$0',
    })
    
    // Step 6: List recent events
    console.log('\n6️⃣ Recent Stripe events:')
    const events = await stripe.events.list({ limit: 5 })
    events.data.forEach(event => {
      console.log(`   - ${event.type} (${new Date(event.created * 1000).toLocaleTimeString()})`)
    })
    
    console.log('\n✅ Test completed successfully!')
    console.log('\n📝 Next Steps:')
    console.log('1. Complete the platform profile at:')
    console.log('   https://dashboard.stripe.com/settings/connect/platform-profile')
    console.log('2. Once done, uncomment the transfer_data section in the script')
    console.log('3. The onboarding URL above can be used to onboard real creators')
    
    return {
      account,
      payment: confirmedPayment,
    }
    
  } catch (error: any) {
    console.error('\n❌ Error:', error.message)
    if (error.raw?.request_log_url) {
      console.log('📝 View error details:', error.raw.request_log_url)
    }
    throw error
  }
}

// Run the test
testConnectPayment().catch(console.error)