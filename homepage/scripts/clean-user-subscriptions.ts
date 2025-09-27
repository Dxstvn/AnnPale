#!/usr/bin/env tsx
/**
 * Clean up all subscriptions for a user
 * This will delete subscriptions from both database and Stripe
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

// User email to clean
const USER_EMAIL = 'daj353@nyu.edu'

async function cleanSubscriptions() {
  console.log('🧹 Cleaning subscriptions for:', USER_EMAIL)
  console.log('=' .repeat(60))

  try {
    // Step 1: Find the user
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', USER_EMAIL)
      .single()

    if (userError || !userData) {
      console.error('❌ User not found:', USER_EMAIL)
      return
    }

    const userId = userData.id
    console.log('✅ Found user ID:', userId)

    // Step 2: Get all subscriptions for this user
    const { data: subscriptions, error: subError } = await supabase
      .from('subscription_orders')
      .select('*')
      .eq('user_id', userId)

    if (subError) {
      console.error('❌ Error fetching subscriptions:', subError)
      return
    }

    console.log(`\n📊 Found ${subscriptions?.length || 0} subscription(s) to clean\n`)

    if (!subscriptions || subscriptions.length === 0) {
      console.log('✨ No subscriptions to clean!')
      return
    }

    // Step 3: Cancel each Stripe subscription
    let stripeErrors = 0
    let stripeCancelled = 0
    let stripeSkipped = 0

    for (const sub of subscriptions) {
      console.log(`\n📋 Processing subscription: ${sub.id}`)
      console.log(`   Stripe ID: ${sub.stripe_subscription_id || 'NONE'}`)

      if (sub.stripe_subscription_id &&
          !sub.stripe_subscription_id.startsWith('test_') &&
          !sub.stripe_subscription_id.startsWith('demo_')) {

        try {
          // Try to cancel the Stripe subscription
          const stripeSubscription = await stripe.subscriptions.retrieve(sub.stripe_subscription_id)

          if (stripeSubscription && stripeSubscription.status !== 'canceled') {
            await stripe.subscriptions.cancel(sub.stripe_subscription_id)
            console.log(`   ✅ Cancelled in Stripe`)
            stripeCancelled++
          } else {
            console.log(`   ℹ️  Already cancelled in Stripe`)
            stripeSkipped++
          }
        } catch (error: any) {
          if (error.code === 'resource_missing') {
            console.log(`   ⚠️  Not found in Stripe (already deleted)`)
            stripeSkipped++
          } else {
            console.log(`   ❌ Error cancelling in Stripe:`, error.message)
            stripeErrors++
          }
        }
      } else {
        console.log(`   ℹ️  Skipping test/demo subscription`)
        stripeSkipped++
      }
    }

    // Step 4: Delete all subscriptions from database
    const { error: deleteError } = await supabase
      .from('subscription_orders')
      .delete()
      .eq('user_id', userId)

    if (deleteError) {
      console.error('\n❌ Error deleting subscriptions from database:', deleteError)
      return
    }

    console.log(`\n✅ Deleted ${subscriptions.length} subscription(s) from database`)

    // Step 5: Summary
    console.log('\n' + '=' .repeat(60))
    console.log('📊 CLEANUP SUMMARY:')
    console.log(`   Total subscriptions processed: ${subscriptions.length}`)
    console.log(`   Stripe subscriptions cancelled: ${stripeCancelled}`)
    console.log(`   Stripe subscriptions skipped: ${stripeSkipped}`)
    console.log(`   Stripe errors: ${stripeErrors}`)
    console.log(`   Database records deleted: ${subscriptions.length}`)

    // Step 6: Verify cleanup
    const { data: remainingSubs } = await supabase
      .from('subscription_orders')
      .select('id')
      .eq('user_id', userId)

    if (remainingSubs && remainingSubs.length > 0) {
      console.log(`\n⚠️  Warning: ${remainingSubs.length} subscription(s) still remain in database`)
    } else {
      console.log('\n✨ All subscriptions successfully cleaned!')
    }

    console.log('\n🎯 Next steps:')
    console.log('1. Go to http://localhost:3000/fan/subscriptions')
    console.log('2. Verify no subscriptions are shown')
    console.log('3. Browse creators and subscribe to one')
    console.log('4. Test pause, resume, cancel, and reactivate functions')

  } catch (error) {
    console.error('❌ Unexpected error:', error)
  }
}

// Run the cleanup
cleanSubscriptions().catch(console.error)