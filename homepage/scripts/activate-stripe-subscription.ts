#!/usr/bin/env tsx
/**
 * Activate incomplete Stripe subscriptions
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

async function activateSubscription() {
  const subscriptionId = 'sub_1SBO70ENu9K8Thcgg711Wrv0'

  console.log('🔧 Checking Stripe subscription status...\n')

  try {
    // Get current subscription from Stripe
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)

    console.log(`Current status: ${subscription.status}`)
    console.log(`Customer: ${subscription.customer}`)
    console.log(`Trial end: ${subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : 'None'}`)

    if (subscription.status === 'incomplete') {
      console.log('\n⚠️  Subscription is incomplete. This usually means payment is pending.')
      console.log('For testing, we\'ll update it to active with a trial period.\n')

      // Update subscription to have a trial period (avoids payment requirement)
      const updated = await stripe.subscriptions.update(subscriptionId, {
        trial_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days from now
        proration_behavior: 'none'
      })

      console.log(`✅ Updated subscription status: ${updated.status}`)
      console.log(`Trial ends: ${new Date(updated.trial_end! * 1000).toISOString()}`)

      // Also ensure the database is marked as active
      const { error } = await supabase
        .from('subscription_orders')
        .update({
          status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscriptionId)

      if (!error) {
        console.log('✅ Database updated to active status')
      }
    } else if (subscription.status === 'active') {
      console.log('✅ Subscription is already active!')
    } else {
      console.log(`⚠️  Subscription has status: ${subscription.status}`)
    }

    // Check pause collection status
    if (subscription.pause_collection) {
      console.log('\n📋 Pause collection details:')
      console.log(JSON.stringify(subscription.pause_collection, null, 2))
    }

  } catch (error) {
    console.error('❌ Error:', error)
  }
}

activateSubscription()