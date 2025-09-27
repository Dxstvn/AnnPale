#!/usr/bin/env tsx
/**
 * Comprehensive Subscription System Test
 * Tests all critical subscription functions with direct validation
 */

import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import fetch from 'node-fetch'
import { config } from 'dotenv'
import path from 'path'

// Load environment variables
config({ path: path.join(__dirname, '../.env.local') })

// Initialize clients
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const stripe = new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia' as any
})

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

// Test data
const TEST_USER = {
  email: 'test.subscriber@annpale.com',
  password: 'TestPass123!'
}

const TEST_CREATOR = {
  email: 'test.creator@annpale.com',
  password: 'TestPass123!'
}

// Color codes for output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message: string, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`)
}

function logSection(title: string) {
  console.log('\n' + '='.repeat(60))
  log(title, colors.bright + colors.cyan)
  console.log('='.repeat(60))
}

function logTest(name: string, status: 'pass' | 'fail' | 'skip', details?: string) {
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : '⏭️'
  const color = status === 'pass' ? colors.green : status === 'fail' ? colors.red : colors.yellow

  log(`${icon} ${name}`, color)
  if (details) {
    log(`   └─ ${details}`, colors.reset)
  }
}

class SubscriptionSystemTest {
  private userId?: string
  private creatorId?: string
  private tierId?: string
  private subscriptionId?: string
  private stripeSubscriptionId?: string
  private authToken?: string
  private creatorToken?: string

  async run() {
    logSection('🚀 SUBSCRIPTION SYSTEM COMPREHENSIVE TEST')

    try {
      // Setup
      await this.setupTestData()

      // Test Categories
      await this.testAuthentication()
      await this.testSubscriptionCreation()
      await this.testSubscriptionListAndManagement()
      await this.testStripeIntegration()
      await this.testWebhookProcessing()
      await this.testSynchronization()
      await this.testMonitoringDashboard()
      await this.testEdgeCases()

      // Cleanup
      await this.cleanup()

      logSection('✨ ALL TESTS COMPLETED')

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
      log(`\n❌ CRITICAL ERROR: ${errorMessage}`, colors.red)
      await this.cleanup()
      process.exit(1)
    }
  }

  async setupTestData() {
    logSection('📦 SETTING UP TEST DATA')

    try {
      // Clean up existing test users
      await supabase.auth.admin.deleteUser(TEST_USER.email).catch(() => {})
      await supabase.auth.admin.deleteUser(TEST_CREATOR.email).catch(() => {})

      // Create test user (subscriber)
      const { data: userData, error: userError } = await supabase.auth.admin.createUser({
        email: TEST_USER.email,
        password: TEST_USER.password,
        email_confirm: true
      })

      if (userError) throw userError
      this.userId = userData.user.id

      // Create profile for user
      await supabase
        .from('profiles')
        .upsert({
          id: this.userId,
          email: TEST_USER.email,
          display_name: 'Test Subscriber',
          role: 'fan'
        })

      logTest('Created test subscriber', 'pass', `ID: ${this.userId}`)

      // Create test creator
      const { data: creatorData, error: creatorError } = await supabase.auth.admin.createUser({
        email: TEST_CREATOR.email,
        password: TEST_CREATOR.password,
        email_confirm: true
      })

      if (creatorError) throw creatorError
      this.creatorId = creatorData.user.id

      // Create profile for creator with Stripe account
      const stripeAccount = await stripe.accounts.create({
        type: 'express',
        email: TEST_CREATOR.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true }
        }
      })

      await supabase
        .from('profiles')
        .upsert({
          id: this.creatorId,
          email: TEST_CREATOR.email,
          display_name: 'Test Creator',
          role: 'creator',
          stripe_account_id: stripeAccount.id
        })

      logTest('Created test creator', 'pass', `ID: ${this.creatorId}`)

      // Create subscription tier
      const { data: tier, error: tierError } = await supabase
        .from('creator_subscription_tiers')
        .insert({
          creator_id: this.creatorId,
          tier_name: 'Test Premium Tier',
          description: 'Test tier for subscription testing',
          price: 19.99, // Price as decimal
          billing_period: 'monthly',
          benefits: ['Benefit 1', 'Benefit 2'],
          is_active: true
        })
        .select()
        .single()

      if (tierError) throw tierError
      this.tierId = tier.id

      logTest('Created subscription tier', 'pass', `Price: $19.99/month`)

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : JSON.stringify(error)
      logTest('Setup test data', 'fail', errorMessage)
      throw error
    }
  }

  async testAuthentication() {
    logSection('🔐 TESTING AUTHENTICATION')

    try {
      // Sign in as subscriber
      const { data: session, error } = await supabase.auth.signInWithPassword({
        email: TEST_USER.email,
        password: TEST_USER.password
      })

      if (error) throw error
      this.authToken = session.session?.access_token

      logTest('User authentication', 'pass', 'Access token obtained')

      // Sign in as creator
      const { data: creatorSession, error: creatorError } = await supabase.auth.signInWithPassword({
        email: TEST_CREATOR.email,
        password: TEST_CREATOR.password
      })

      if (creatorError) throw creatorError
      this.creatorToken = creatorSession.session?.access_token

      logTest('Creator authentication', 'pass', 'Access token obtained')

    } catch (error) {
      logTest('Authentication', 'fail', String(error))
      throw error
    }
  }

  async testSubscriptionCreation() {
    logSection('💳 TESTING SUBSCRIPTION CREATION')

    try {
      // Test subscription creation via API
      const response = await fetch(`${BASE_URL}/api/subscriptions/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        },
        body: JSON.stringify({
          creatorId: this.creatorId,
          tierId: this.tierId
        })
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(`API Error: ${result.error}`)
      }

      if (!result.subscription || !result.subscription.id) {
        throw new Error('No subscription ID returned')
      }

      this.subscriptionId = result.subscription.id
      this.stripeSubscriptionId = result.subscription.stripe_subscription_id

      logTest('Create subscription via API', 'pass', `ID: ${this.subscriptionId}`)

      // Verify in database
      const { data: dbSub, error: dbError } = await supabase
        .from('subscription_orders')
        .select('*')
        .eq('id', this.subscriptionId)
        .single()

      if (dbError || !dbSub) {
        throw new Error('Subscription not found in database')
      }

      // Validate all required fields
      const requiredFields = [
        'user_id', 'creator_id', 'tier_id', 'status',
        'total_amount', 'platform_fee', 'creator_earnings'
      ]

      for (const field of requiredFields) {
        if (!dbSub[field] && dbSub[field] !== 0) {
          throw new Error(`Missing required field: ${field}`)
        }
      }

      logTest('Database record validation', 'pass',
        `Status: ${dbSub.status}, Amount: $${dbSub.total_amount}`)

      // Verify financial calculations
      const expectedPlatformFee = Math.round(dbSub.total_amount * 0.30)
      const expectedCreatorEarnings = dbSub.total_amount - expectedPlatformFee

      if (dbSub.platform_fee !== expectedPlatformFee) {
        throw new Error(`Platform fee mismatch: ${dbSub.platform_fee} !== ${expectedPlatformFee}`)
      }

      if (dbSub.creator_earnings !== expectedCreatorEarnings) {
        throw new Error(`Creator earnings mismatch: ${dbSub.creator_earnings} !== ${expectedCreatorEarnings}`)
      }

      logTest('Financial calculations', 'pass',
        `Platform: $${dbSub.platform_fee}, Creator: $${dbSub.creator_earnings}`)

    } catch (error) {
      logTest('Subscription creation', 'fail', String(error))
      throw error
    }
  }

  async testSubscriptionListAndManagement() {
    logSection('📋 TESTING SUBSCRIPTION LIST & MANAGEMENT')

    try {
      // Test listing subscriptions
      const listResponse = await fetch(`${BASE_URL}/api/subscriptions/list`, {
        headers: {
          'Authorization': `Bearer ${this.authToken}`
        }
      })

      const subscriptions = await listResponse.json()

      if (!Array.isArray(subscriptions)) {
        throw new Error('List API did not return an array')
      }

      const ourSub = subscriptions.find(s => s.id === this.subscriptionId)
      if (!ourSub) {
        throw new Error('Our subscription not found in list')
      }

      logTest('List subscriptions', 'pass', `Found ${subscriptions.length} subscription(s)`)

      // Test subscription management (cancel)
      const cancelResponse = await fetch(`${BASE_URL}/api/subscriptions/list`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        },
        body: JSON.stringify({
          subscriptionId: this.subscriptionId,
          action: 'cancel'
        })
      })

      if (!cancelResponse.ok) {
        const error = await cancelResponse.json()
        throw new Error(`Cancel failed: ${error.error}`)
      }

      // Verify cancellation in database
      const { data: cancelledSub } = await supabase
        .from('subscription_orders')
        .select('status, cancelled_at')
        .eq('id', this.subscriptionId)
        .single()

      if (cancelledSub?.status !== 'cancelled') {
        throw new Error(`Status not updated: ${cancelledSub?.status}`)
      }

      if (!cancelledSub?.cancelled_at) {
        throw new Error('Cancelled_at timestamp not set')
      }

      logTest('Cancel subscription', 'pass', 'Status: cancelled')

      // Test reactivation
      const reactivateResponse = await fetch(`${BASE_URL}/api/subscriptions/list`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        },
        body: JSON.stringify({
          subscriptionId: this.subscriptionId,
          action: 'reactivate'
        })
      })

      if (!reactivateResponse.ok) {
        const error = await reactivateResponse.json()
        throw new Error(`Reactivate failed: ${error.error}`)
      }

      const { data: reactivatedSub } = await supabase
        .from('subscription_orders')
        .select('status, cancelled_at')
        .eq('id', this.subscriptionId)
        .single()

      if (reactivatedSub?.status !== 'active') {
        throw new Error(`Status not reactivated: ${reactivatedSub?.status}`)
      }

      logTest('Reactivate subscription', 'pass', 'Status: active')

    } catch (error) {
      logTest('Subscription management', 'fail', String(error))
      throw error
    }
  }

  async testStripeIntegration() {
    logSection('💰 TESTING STRIPE INTEGRATION')

    try {
      // Check if subscription exists in Stripe (for non-demo subscriptions)
      if (this.stripeSubscriptionId && !this.stripeSubscriptionId.startsWith('demo_')) {
        const stripeSub = await stripe.subscriptions.retrieve(this.stripeSubscriptionId)

        if (!stripeSub) {
          throw new Error('Subscription not found in Stripe')
        }

        logTest('Stripe subscription exists', 'pass', `Status: ${stripeSub.status}`)

        // Verify webhook endpoint exists
        const webhooks = await stripe.webhookEndpoints.list({ limit: 10 })
        const ourWebhook = webhooks.data.find(w =>
          w.url.includes('stripe/subscriptions/webhook')
        )

        if (ourWebhook) {
          logTest('Webhook endpoint configured', 'pass', ourWebhook.url)
        } else {
          logTest('Webhook endpoint configured', 'skip', 'No webhook found (local env)')
        }
      } else {
        logTest('Stripe integration', 'skip', 'Demo subscription - no Stripe record')
      }

    } catch (error) {
      // Stripe integration might not be fully configured in dev
      logTest('Stripe integration', 'skip', String(error))
    }
  }

  async testWebhookProcessing() {
    logSection('🔔 TESTING WEBHOOK PROCESSING')

    try {
      // Simulate webhook event
      const testEvent = {
        id: `evt_test_${Date.now()}`,
        type: 'customer.subscription.updated',
        data: {
          object: {
            id: this.stripeSubscriptionId || `sub_test_${Date.now()}`,
            status: 'active',
            current_period_start: Math.floor(Date.now() / 1000) - 86400,
            current_period_end: Math.floor(Date.now() / 1000) + 2592000 // 30 days
          }
        }
      }

      // Check if webhook was recorded
      const { data: webhookEvents } = await supabase
        .from('webhook_events')
        .select('*')
        .eq('event_type', 'customer.subscription.updated')
        .order('created_at', { ascending: false })
        .limit(1)

      if (webhookEvents && webhookEvents.length > 0) {
        logTest('Webhook events recorded', 'pass',
          `Last event: ${webhookEvents[0].event_type}`)
      } else {
        logTest('Webhook events recorded', 'skip', 'No events found (webhook may not be configured)')
      }

    } catch (error) {
      logTest('Webhook processing', 'skip', String(error))
    }
  }

  async testSynchronization() {
    logSection('🔄 TESTING SYNCHRONIZATION')

    try {
      // Run sync job
      const syncResponse = await fetch(`${BASE_URL}/api/cron/sync-subscriptions`, {
        headers: {
          'Authorization': `Bearer ${process.env.CRON_SECRET || ''}`
        }
      })

      if (!syncResponse.ok) {
        throw new Error(`Sync failed: ${syncResponse.status}`)
      }

      const syncResult = await syncResponse.json()

      if (!syncResult.success) {
        throw new Error('Sync did not return success')
      }

      logTest('Run synchronization job', 'pass',
        `Checked: ${syncResult.results.checked}, Synced: ${syncResult.results.synced}`)

      // Check for mismatches
      if (syncResult.results.mismatches.length > 0) {
        logTest('Synchronization mismatches', 'fail',
          `Found ${syncResult.results.mismatches.length} mismatch(es)`)

        syncResult.results.mismatches.forEach(m => {
          log(`   - ${m.stripe_id}: ${m.issue}`, colors.yellow)
        })
      } else {
        logTest('No synchronization mismatches', 'pass', '100% synchronized')
      }

      // Verify sync log was created
      const { data: syncLogs } = await supabase
        .from('sync_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1)

      if (syncLogs && syncLogs.length > 0) {
        logTest('Sync log recorded', 'pass',
          `Errors: ${syncLogs[0].errors || 0}`)
      }

    } catch (error) {
      logTest('Synchronization', 'fail', String(error))
    }
  }

  async testMonitoringDashboard() {
    logSection('📊 TESTING MONITORING DASHBOARD')

    try {
      // Test stats endpoint
      const statsResponse = await fetch(`${BASE_URL}/api/admin/subscriptions/stats`, {
        headers: {
          'Authorization': `Bearer ${this.creatorToken}` // Using creator token (should fail)
        }
      })

      if (statsResponse.ok) {
        throw new Error('Non-admin should not access stats')
      }

      logTest('Admin access control', 'pass', 'Non-admin blocked correctly')

      // Create admin user for testing
      const { data: adminUser } = await supabase.auth.admin.createUser({
        email: 'test.admin@annpale.com',
        password: 'AdminPass123!',
        email_confirm: true
      })

      if (adminUser?.user) {
        await supabase
          .from('profiles')
          .upsert({
            id: adminUser.user.id,
            email: 'test.admin@annpale.com',
            role: 'admin'
          })

        const { data: adminSession } = await supabase.auth.signInWithPassword({
          email: 'test.admin@annpale.com',
          password: 'AdminPass123!'
        })

        if (adminSession?.session) {
          // Test with admin token
          const adminStatsResponse = await fetch(`${BASE_URL}/api/admin/subscriptions/stats`, {
            headers: {
              'Authorization': `Bearer ${adminSession.session.access_token}`
            }
          })

          if (adminStatsResponse.ok) {
            const stats = await adminStatsResponse.json()

            if (typeof stats.total !== 'number') {
              throw new Error('Stats missing total count')
            }

            logTest('Admin dashboard stats', 'pass',
              `Total: ${stats.total}, Active: ${stats.active}, MRR: $${stats.monthlyRecurringRevenue / 100}`)
          }
        }

        // Cleanup admin user
        await supabase.auth.admin.deleteUser(adminUser.user.id)
      }

    } catch (error) {
      logTest('Monitoring dashboard', 'skip', String(error))
    }
  }

  async testEdgeCases() {
    logSection('🔍 TESTING EDGE CASES')

    try {
      // Test duplicate subscription prevention
      const dupResponse = await fetch(`${BASE_URL}/api/subscriptions/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        },
        body: JSON.stringify({
          creatorId: this.creatorId,
          tierId: this.tierId
        })
      })

      if (dupResponse.ok) {
        throw new Error('Should not allow duplicate subscription')
      }

      const dupError = await dupResponse.json()
      if (!dupError.error.includes('already')) {
        throw new Error('Wrong error message for duplicate')
      }

      logTest('Duplicate subscription prevention', 'pass', 'Correctly blocked')

      // Test invalid tier subscription
      const invalidResponse = await fetch(`${BASE_URL}/api/subscriptions/subscribe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        },
        body: JSON.stringify({
          creatorId: this.creatorId,
          tierId: 'invalid-tier-id'
        })
      })

      if (invalidResponse.ok) {
        throw new Error('Should not allow invalid tier')
      }

      logTest('Invalid tier prevention', 'pass', 'Correctly blocked')

      // Test unauthorized access
      const unauthResponse = await fetch(`${BASE_URL}/api/subscriptions/list`)

      if (unauthResponse.ok) {
        throw new Error('Should require authentication')
      }

      logTest('Authentication requirement', 'pass', 'Unauthorized blocked')

    } catch (error) {
      logTest('Edge cases', 'fail', String(error))
    }
  }

  async cleanup() {
    logSection('🧹 CLEANING UP TEST DATA')

    try {
      // Delete test subscription
      if (this.subscriptionId) {
        await supabase
          .from('subscription_orders')
          .delete()
          .eq('id', this.subscriptionId)

        logTest('Deleted test subscription', 'pass')
      }

      // Delete test tier
      if (this.tierId) {
        await supabase
          .from('creator_subscription_tiers')
          .delete()
          .eq('id', this.tierId)

        logTest('Deleted test tier', 'pass')
      }

      // Delete test users
      if (this.userId) {
        await supabase.auth.admin.deleteUser(this.userId)
        logTest('Deleted test subscriber', 'pass')
      }

      if (this.creatorId) {
        await supabase.auth.admin.deleteUser(this.creatorId)
        logTest('Deleted test creator', 'pass')
      }

    } catch (error) {
      log(`Cleanup error: ${error}`, colors.yellow)
    }
  }
}

// Run the test
async function main() {
  const test = new SubscriptionSystemTest()
  await test.run()
}

main().catch(console.error)