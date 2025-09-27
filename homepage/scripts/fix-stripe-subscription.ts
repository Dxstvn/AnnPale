#!/usr/bin/env tsx
/**
 * Fix Stripe subscription ID for existing subscriptions
 */

import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { config } from 'dotenv'
import path from 'path'

// Load environment variables
config({ path: path.join(__dirname, '../.env.local') })

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia',
})

async function fixSubscription() {
  console.log('🔍 Checking for subscriptions without Stripe IDs...\n')

  // Find the user by email
  const { data: userData } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', 'daj353@nyu.edu')
    .single()

  if (!userData) {
    console.error('❌ User not found')
    return
  }

  const userId = userData.id
  console.log(`✅ Found user: ${userId}`)

  // Find the creator by email
  const { data: creatorData } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', 'dustin.jasmin@jaspire.co')
    .single()

  if (!creatorData) {
    console.error('❌ Creator not found')
    return
  }

  const creatorId = creatorData.id
  console.log(`✅ Found creator: ${creatorId}\n`)

  // Find subscriptions for this user to this creator
  const { data: subscriptions, error } = await supabase
    .from('subscription_orders')
    .select('*, creator_subscription_tiers(*)')
    .eq('user_id', userId)
    .eq('creator_id', creatorId)

  if (error) {
    console.error('❌ Error fetching subscriptions:', error)
    return
  }

  console.log(`📊 Found ${subscriptions?.length || 0} subscription(s)\n`)

  for (const subscription of subscriptions || []) {
    console.log(`\n📋 Subscription ${subscription.id}:`)
    console.log(`   Status: ${subscription.status}`)
    console.log(`   Stripe ID: ${subscription.stripe_subscription_id || 'MISSING'}`)
    console.log(`   Total: $${(subscription.total_amount / 100).toFixed(2)}`)
    console.log(`   Tier: ${subscription.creator_subscription_tiers?.tier_name || 'Unknown'}`)

    // Check if we need to create a Stripe subscription
    if (!subscription.stripe_subscription_id ||
        subscription.stripe_subscription_id.startsWith('test_') ||
        subscription.stripe_subscription_id.startsWith('demo_')) {

      console.log('\n🔧 Creating real Stripe subscription...')

      try {
        // Create or get Stripe customer
        let customerId: string

        // Check if customer already exists
        const customers = await stripe.customers.list({
          email: 'daj353@nyu.edu',
          limit: 1
        })

        if (customers.data.length > 0) {
          customerId = customers.data[0].id
          console.log(`   Using existing customer: ${customerId}`)
        } else {
          const customer = await stripe.customers.create({
            email: 'daj353@nyu.edu',
            metadata: {
              supabase_user_id: userId
            }
          })
          customerId = customer.id
          console.log(`   Created customer: ${customerId}`)
        }

        // Create or get price
        const priceAmount = subscription.total_amount || 999 // Default to $9.99

        // Search for existing price
        const prices = await stripe.prices.list({
          currency: 'usd',
          recurring: { interval: 'month' },
          limit: 100
        })

        let priceId: string | undefined
        const existingPrice = prices.data.find(p => p.unit_amount === priceAmount)

        if (existingPrice) {
          priceId = existingPrice.id
          console.log(`   Using existing price: ${priceId}`)
        } else {
          // Create product first
          const product = await stripe.products.create({
            name: subscription.creator_subscription_tiers?.tier_name || 'Creator Subscription',
            metadata: {
              creator_id: creatorId,
              tier_id: subscription.tier_id || ''
            }
          })

          // Create price
          const price = await stripe.prices.create({
            product: product.id,
            unit_amount: priceAmount,
            currency: 'usd',
            recurring: {
              interval: 'month'
            }
          })
          priceId = price.id
          console.log(`   Created price: ${priceId}`)
        }

        // Create subscription in Stripe
        const stripeSubscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [{ price: priceId }],
          metadata: {
            supabase_subscription_id: subscription.id,
            creator_id: creatorId,
            user_id: userId,
            tier_id: subscription.tier_id || ''
          },
          // Start with a trial to avoid immediate charge
          trial_period_days: 30
        })

        console.log(`   ✅ Created Stripe subscription: ${stripeSubscription.id}`)

        // Update database with real Stripe subscription ID
        const { error: updateError } = await supabase
          .from('subscription_orders')
          .update({
            stripe_subscription_id: stripeSubscription.id,
            stripe_customer_id: customerId,
            updated_at: new Date().toISOString()
          })
          .eq('id', subscription.id)

        if (updateError) {
          console.error('   ❌ Error updating database:', updateError)
        } else {
          console.log('   ✅ Database updated successfully')
        }

      } catch (error) {
        console.error('   ❌ Error creating Stripe subscription:', error)
      }
    } else {
      console.log('   ✅ Already has valid Stripe subscription')

      // Verify it exists in Stripe
      try {
        const stripeSubscription = await stripe.subscriptions.retrieve(
          subscription.stripe_subscription_id
        )
        console.log(`   ✅ Verified in Stripe - Status: ${stripeSubscription.status}`)
      } catch (error) {
        console.log('   ⚠️  Subscription not found in Stripe, may need to recreate')
      }
    }
  }

  console.log('\n✅ Script completed')
}

fixSubscription().catch(console.error)