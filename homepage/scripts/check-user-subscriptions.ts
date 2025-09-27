#!/usr/bin/env tsx
/**
 * Check subscriptions for a specific user
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import path from 'path'

// Load environment variables
config({ path: path.join(__dirname, '../.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Check subscriptions for user
const userId = 'c948265a-fb81-4c40-be8d-8dd536433738'

async function checkSubscriptions() {
  console.log('Checking subscriptions for user:', userId)

  const { data, error } = await supabase
    .from('subscription_orders')
    .select('*')
    .eq('user_id', userId)

  if (error) {
    console.error('Error fetching subscriptions:', error)
    return
  }

  console.log('Total subscriptions found:', data?.length || 0)

  if (data && data.length > 0) {
    data.forEach((sub, index) => {
      console.log(`\nSubscription ${index + 1}:`)
      console.log('  ID:', sub.id)
      console.log('  Creator ID:', sub.creator_id)
      console.log('  Status:', sub.status)
      console.log('  Stripe ID:', sub.stripe_subscription_id)
      console.log('  Total Amount:', sub.total_amount)
      console.log('  Platform Fee:', sub.platform_fee)
      console.log('  Creator Earnings:', sub.creator_earnings)
    })
  } else {
    console.log('No subscriptions found for this user')
    console.log('\nCreating a test subscription...')

    // Get a creator to subscribe to
    const { data: creators } = await supabase
      .from('profiles')
      .select('id')
      .eq('role', 'creator')
      .limit(1)

    if (creators && creators.length > 0) {
      const creatorId = creators[0].id

      // Check if there are any tiers
      const { data: tiers } = await supabase
        .from('creator_subscription_tiers')
        .select('*')
        .eq('creator_id', creatorId)
        .eq('is_active', true)
        .limit(1)

      if (tiers && tiers.length > 0) {
        const tier = tiers[0]

        // Create a subscription
        const totalAmount = tier.price * 100 // Convert to cents
        const platformFee = Math.round(totalAmount * 0.30)
        const creatorEarnings = totalAmount - platformFee

        const { data: newSub, error: subError } = await supabase
          .from('subscription_orders')
          .insert({
            user_id: userId,
            creator_id: creatorId,
            tier_id: tier.id,
            total_amount: totalAmount,
            platform_fee: platformFee,
            creator_earnings: creatorEarnings,
            currency: 'USD',
            status: 'active',
            billing_period: tier.billing_period || 'monthly',
            current_period_start: new Date().toISOString(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            stripe_subscription_id: `test_sub_${Date.now()}`
          })
          .select()
          .single()

        if (subError) {
          console.error('Error creating subscription:', subError)
        } else {
          console.log('Created test subscription:', newSub.id)
        }
      } else {
        console.log('No active subscription tiers found')
      }
    }
  }
}

checkSubscriptions().catch(console.error)