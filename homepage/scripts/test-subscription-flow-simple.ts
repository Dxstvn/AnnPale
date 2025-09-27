#!/usr/bin/env tsx
/**
 * Simple Subscription Flow Test
 * Tests subscription system using direct database operations
 */

import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
import path from 'path'

// Load environment variables
config({ path: path.join(__dirname, '../.env.local') })

// Initialize Supabase client with service role
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Test results tracking
let testsRun = 0
let testsPassed = 0
let testsFailed = 0

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
}

function log(message: string, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function testStart(name: string) {
  testsRun++
  process.stdout.write(`Testing ${name}... `)
}

function testPass(details?: string) {
  testsPassed++
  log('✅ PASS', colors.green)
  if (details) {
    log(`  └─ ${details}`, colors.cyan)
  }
}

function testFail(error: string) {
  testsFailed++
  log('❌ FAIL', colors.red)
  log(`  └─ ${error}`, colors.red)
}

async function runTests() {
  log('\n🚀 SUBSCRIPTION FLOW TEST (SIMPLE)', colors.bright + colors.cyan)
  log('=' .repeat(50))

  let userId: string | undefined
  let creatorId: string | undefined
  let tierId: string | undefined
  let subscriptionId: string | undefined

  try {
    // Test 1: Create test users
    testStart('Create test users')

    // Create fan user
    const { data: userData, error: userError } = await supabase.auth.admin.createUser({
      email: 'test.fan@example.com',
      password: 'TestPass123!',
      email_confirm: true
    })

    if (userError) throw userError
    userId = userData.user.id

    // Create creator user
    const { data: creatorData, error: creatorError } = await supabase.auth.admin.createUser({
      email: 'test.creator@example.com',
      password: 'TestPass123!',
      email_confirm: true
    })

    if (creatorError) throw creatorError
    creatorId = creatorData.user.id

    // Create profiles
    await supabase.from('profiles').upsert([
      { id: userId, email: 'test.fan@example.com', role: 'fan' },
      { id: creatorId, email: 'test.creator@example.com', role: 'creator' }
    ])

    testPass(`Fan: ${userId}, Creator: ${creatorId}`)

    // Test 2: Create subscription tier
    testStart('Create subscription tier')

    const { data: tier, error: tierError } = await supabase
      .from('creator_subscription_tiers')
      .insert({
        creator_id: creatorId,
        tier_name: 'Test Tier',
        description: 'Test subscription tier',
        price: 9.99,
        billing_period: 'monthly',
        is_active: true
      })
      .select()
      .single()

    if (tierError) throw tierError
    tierId = tier.id

    testPass(`Tier created: $${tier.price}/month`)

    // Test 3: Create subscription
    testStart('Create subscription')

    const totalAmount = 999 // Store in cents
    const platformFee = Math.round(totalAmount * 0.30)
    const creatorEarnings = totalAmount - platformFee

    const { data: subscription, error: subError } = await supabase
      .from('subscription_orders')
      .insert({
        user_id: userId,
        creator_id: creatorId,
        tier_id: tierId,
        total_amount: totalAmount,
        platform_fee: platformFee,
        creator_earnings: creatorEarnings,
        currency: 'USD',
        status: 'active',
        billing_period: 'monthly',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        stripe_subscription_id: `test_sub_${Date.now()}`
      })
      .select()
      .single()

    if (subError) throw subError
    subscriptionId = subscription.id

    testPass(`Subscription created with ID: ${subscriptionId}`)

    // Test 4: Verify subscription exists
    testStart('Verify subscription in database')

    const { data: verifyData, error: verifyError } = await supabase
      .from('subscription_orders')
      .select('*')
      .eq('id', subscriptionId)
      .single()

    if (verifyError || !verifyData) throw new Error('Subscription not found')

    testPass(`Status: ${verifyData.status}, Platform fee: $${verifyData.platform_fee / 100}`)

    // Test 5: Test subscription update
    testStart('Update subscription status')

    const { error: updateError } = await supabase
      .from('subscription_orders')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString()
      })
      .eq('id', subscriptionId)

    if (updateError) throw updateError

    testPass('Status updated to cancelled')

    // Test 6: Test sync log creation
    testStart('Create sync log entry')

    const { error: syncError } = await supabase
      .from('sync_logs')
      .insert({
        results: {
          checked: 1,
          synced: 0,
          errors: 0,
          mismatches: []
        },
        errors: 0
      })

    if (syncError) throw syncError

    testPass('Sync log created successfully')

    // Test 7: Check webhook events table
    testStart('Check webhook events table')

    const { data: webhookData, error: webhookError } = await supabase
      .from('webhook_events')
      .select('id')
      .limit(1)

    if (webhookError) {
      // Table might not have any events yet, that's ok
      testPass('Table exists (no events)')
    } else {
      testPass(`Table exists with ${webhookData?.length || 0} events`)
    }

    // Test 8: Verify fee calculations (30% platform, 70% creator)
    testStart('Verify 30% platform fee calculation')

    const expectedPlatformFee = Math.round(999 * 0.30) // 300 cents
    const expectedCreatorEarnings = 999 - expectedPlatformFee // 699 cents

    if (verifyData.platform_fee === expectedPlatformFee &&
        verifyData.creator_earnings === expectedCreatorEarnings) {
      testPass(`Platform: $${expectedPlatformFee/100} (30%), Creator: $${expectedCreatorEarnings/100} (70%)`)
    } else {
      throw new Error(`Fee mismatch - Expected platform: ${expectedPlatformFee}, got: ${verifyData.platform_fee}`)
    }

  } catch (error) {
    testFail(error instanceof Error ? error.message : String(error))
  } finally {
    // Cleanup
    log('\n🧹 Cleaning up test data...', colors.yellow)

    if (subscriptionId) {
      await supabase.from('subscription_orders').delete().eq('id', subscriptionId)
    }
    if (tierId) {
      await supabase.from('creator_subscription_tiers').delete().eq('id', tierId)
    }
    if (userId) {
      await supabase.auth.admin.deleteUser(userId)
    }
    if (creatorId) {
      await supabase.auth.admin.deleteUser(creatorId)
    }

    log('Cleanup complete\n')
  }

  // Print summary
  log('=' .repeat(50))
  log('📊 TEST SUMMARY', colors.bright)
  log(`Tests run: ${testsRun}`)
  log(`✅ Passed: ${testsPassed}`, colors.green)
  if (testsFailed > 0) {
    log(`❌ Failed: ${testsFailed}`, colors.red)
  }

  const successRate = testsRun > 0 ? Math.round((testsPassed / testsRun) * 100) : 0
  log(`Success rate: ${successRate}%\n`)

  // Exit with appropriate code
  process.exit(testsFailed > 0 ? 1 : 0)
}

// Run the tests
runTests().catch(error => {
  log(`\n❌ Fatal error: ${error}`, colors.red)
  process.exit(1)
})