#!/usr/bin/env tsx
/**
 * Prepare environment for subscription testing
 * This script provides instructions and checks for proper testing
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import path from 'path'

// Load environment variables
config({ path: path.join(__dirname, '../.env.local') })

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const USER_EMAIL = 'daj353@nyu.edu'

async function prepareTest() {
  console.log('🚀 SUBSCRIPTION TESTING GUIDE')
  console.log('=' .repeat(60))

  // Check user exists
  const { data: userData } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('email', USER_EMAIL)
    .single()

  if (!userData) {
    console.error('❌ User not found:', USER_EMAIL)
    return
  }

  console.log('✅ Fan account ready:', USER_EMAIL)
  console.log('   User ID:', userData.id)

  // Check for existing subscriptions
  const { data: subs } = await supabase
    .from('subscription_orders')
    .select('id')
    .eq('user_id', userData.id)

  console.log(`✅ Current subscriptions: ${subs?.length || 0}`)

  // Check for available creators
  const { data: creators } = await supabase
    .from('profiles')
    .select('id, display_name, email')
    .eq('role', 'creator')
    .limit(5)

  console.log(`✅ Available creators: ${creators?.length || 0}`)

  if (creators && creators.length > 0) {
    console.log('\n📋 Sample creators:')
    creators.forEach((creator, i) => {
      console.log(`   ${i + 1}. ${creator.display_name || creator.email}`)
    })
  }

  // Check for subscription tiers
  const { data: tiers } = await supabase
    .from('creator_subscription_tiers')
    .select('id, creator_id, tier_name, price')
    .eq('is_active', true)
    .limit(5)

  console.log(`\n✅ Active subscription tiers: ${tiers?.length || 0}`)

  if (tiers && tiers.length > 0) {
    console.log('\n📋 Sample tiers:')
    tiers.forEach((tier, i) => {
      console.log(`   ${i + 1}. ${tier.tier_name} - $${tier.price}/month`)
    })
  }

  // Testing instructions
  console.log('\n' + '=' .repeat(60))
  console.log('📝 TESTING INSTRUCTIONS')
  console.log('=' .repeat(60))

  console.log('\n1️⃣  CREATE A SUBSCRIPTION:')
  console.log('   a. Go to: http://localhost:3000/browse')
  console.log('   b. Click on a creator (e.g., "Dustin Jasmin")')
  console.log('   c. Click "Subscribe" on one of their tiers')
  console.log('   d. Complete the Stripe checkout flow')
  console.log('      - Use test card: 4242 4242 4242 4242')
  console.log('      - Any future expiry date and any CVC')

  console.log('\n2️⃣  VERIFY SUBSCRIPTION:')
  console.log('   a. Go to: http://localhost:3000/fan/subscriptions')
  console.log('   b. You should see your active subscription')
  console.log('   c. Status should be "Active"')

  console.log('\n3️⃣  TEST PAUSE FUNCTIONALITY:')
  console.log('   a. Click the 3-dot menu on the subscription')
  console.log('   b. Click "Pause Subscription"')
  console.log('   c. Confirm the action')
  console.log('   d. Status should change to "Paused"')

  console.log('\n4️⃣  TEST RESUME FUNCTIONALITY:')
  console.log('   a. Click the 3-dot menu on the paused subscription')
  console.log('   b. Click "Resume Subscription"')
  console.log('   c. Confirm the action')
  console.log('   d. Status should change back to "Active"')

  console.log('\n5️⃣  TEST UPDATE PAYMENT METHOD:')
  console.log('   a. Click the 3-dot menu')
  console.log('   b. Click "Update Payment Method"')
  console.log('   c. Enter new card details')
  console.log('   d. Verify payment method is updated')

  console.log('\n6️⃣  TEST CANCEL SUBSCRIPTION:')
  console.log('   a. Click the 3-dot menu')
  console.log('   b. Click "Cancel Subscription"')
  console.log('   c. Confirm cancellation')
  console.log('   d. Status should show "Cancelled" (ends at period end)')

  console.log('\n7️⃣  TEST REACTIVATE (if cancelled):')
  console.log('   a. If cancelled but not expired, you can reactivate')
  console.log('   b. Click "Reactivate Subscription"')
  console.log('   c. Status should return to "Active"')

  console.log('\n' + '=' .repeat(60))
  console.log('⚠️  IMPORTANT NOTES:')
  console.log('=' .repeat(60))
  console.log('• Use Stripe test cards for all payments')
  console.log('• Subscriptions must be "active" in Stripe to manage')
  console.log('• Incomplete subscriptions cannot be paused/resumed')
  console.log('• Check browser console for any errors')
  console.log('• Check network tab for API responses')

  console.log('\n' + '=' .repeat(60))
  console.log('🔍 VERIFICATION COMMANDS:')
  console.log('=' .repeat(60))
  console.log('• Check subscriptions: npx tsx scripts/check-user-subscriptions.ts')
  console.log('• Clean subscriptions: npx tsx scripts/clean-user-subscriptions.ts')
  console.log('• Test subscription flow: npx tsx scripts/test-subscription-flow-simple.ts')

  console.log('\n✨ Environment is ready for testing!')
}

prepareTest().catch(console.error)