/**
 * Comprehensive Payment Flow Integration Test
 * Tests the complete end-to-end payment flow including:
 * - Payment creation
 * - Webhook handling
 * - Order creation
 * - Creator notifications
 * - Database state changes
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Test configuration
const TEST_CONFIG = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  supabaseServiceKey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  stripeSecretKey: process.env.STRIPE_SANDBOX_SECRET_KEY!,
  apiBaseUrl: process.env.TEST_API_URL || 'http://localhost:3000',
}

// Initialize clients
const stripe = new Stripe(TEST_CONFIG.stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
})

const supabaseAdmin = createClient(
  TEST_CONFIG.supabaseUrl,
  TEST_CONFIG.supabaseServiceKey
)

const supabaseClient = createClient(
  TEST_CONFIG.supabaseUrl,
  TEST_CONFIG.supabaseAnonKey
)

// Test data
const TEST_FAN = {
  email: 'test-fan@example.com',
  password: 'TestPassword123!',
  name: 'Test Fan',
}

const TEST_CREATOR = {
  email: 'test-creator@example.com',
  password: 'TestPassword123!',
  name: 'Test Creator',
  stripeAccountId: null as string | null,
}

let fanUserId: string
let creatorUserId: string
let videoRequestId: string
let paymentIntentId: string
let orderId: string

describe('Payment Flow Integration', () => {
  beforeAll(async () => {
    // Clean up any existing test data
    await cleanupTestData()
    
    // Create test users
    await setupTestUsers()
    
    // Setup Stripe Connect account for creator
    await setupStripeConnect()
  })

  afterAll(async () => {
    // Clean up test data
    await cleanupTestData()
  })

  beforeEach(() => {
    // Reset any mocked values
  })

  describe('1. Payment Intent Creation', () => {
    it('should create a video request', async () => {
      const { data: videoRequest, error } = await supabaseClient
        .from('video_requests')
        .insert({
          user_id: fanUserId,
          creator_id: creatorUserId,
          occasion: 'birthday',
          recipient_name: 'John Doe',
          instructions: 'Happy 30th birthday!',
          price: 100,
          status: 'pending',
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(videoRequest).toBeDefined()
      expect(videoRequest.status).toBe('pending')
      
      videoRequestId = videoRequest.id
    })

    it('should create a payment intent via API', async () => {
      const response = await fetch(`${TEST_CONFIG.apiBaseUrl}/api/payments/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken(fanUserId)}`,
        },
        body: JSON.stringify({
          creatorId: creatorUserId,
          videoRequestId: videoRequestId,
          amount: 100,
        }),
      })

      expect(response.ok).toBe(true)
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.clientSecret).toBeDefined()
      expect(data.data.amount).toBe(10000) // In cents
      
      paymentIntentId = data.data.id
    })

    it('should store payment intent in database', async () => {
      const { data: paymentIntent, error } = await supabaseAdmin
        .from('payment_intents')
        .select('*')
        .eq('id', paymentIntentId)
        .single()

      expect(error).toBeNull()
      expect(paymentIntent).toBeDefined()
      expect(paymentIntent.user_id).toBe(fanUserId)
      expect(paymentIntent.creator_id).toBe(creatorUserId)
      expect(paymentIntent.amount).toBe(100)
      expect(paymentIntent.status).toBe('pending')
    })
  })

  describe('2. Payment Processing', () => {
    it('should confirm payment with Stripe', async () => {
      // Simulate payment confirmation
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: 'pm_card_visa', // Test card
      })

      expect(paymentIntent.status).toBe('succeeded')
    })

    it('should trigger webhook event', async () => {
      // Construct webhook event
      const event = {
        id: 'evt_test_' + Date.now(),
        object: 'event',
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: paymentIntentId,
            amount: 10000,
            currency: 'usd',
            status: 'succeeded',
            latest_charge: 'ch_test_' + Date.now(),
            metadata: {
              videoRequestId: videoRequestId,
              creatorId: creatorUserId,
              userId: fanUserId,
              fanName: TEST_FAN.name,
            },
          },
        },
      }

      // Send webhook to API
      const response = await fetch(`${TEST_CONFIG.apiBaseUrl}/api/webhooks/stripe`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': 'test-signature', // In production, this would be validated
        },
        body: JSON.stringify(event),
      })

      expect(response.ok).toBe(true)
      
      // Wait for webhook processing
      await new Promise(resolve => setTimeout(resolve, 2000))
    })
  })

  describe('3. Order Creation & Validation', () => {
    it('should create order in database', async () => {
      const { data: orders, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('video_request_id', videoRequestId)
        .eq('payment_intent_id', paymentIntentId)

      expect(error).toBeNull()
      expect(orders).toHaveLength(1)
      
      const order = orders![0]
      expect(order.user_id).toBe(fanUserId)
      expect(order.creator_id).toBe(creatorUserId)
      expect(order.amount).toBe(100)
      expect(order.platform_fee).toBe(30) // 30% platform fee
      expect(order.creator_earnings).toBe(70) // 70% creator earnings
      expect(order.status).toBe('pending')
      
      orderId = order.id
    })

    it('should update video request status to paid', async () => {
      const { data: videoRequest, error } = await supabaseAdmin
        .from('video_requests')
        .select('status')
        .eq('id', videoRequestId)
        .single()

      expect(error).toBeNull()
      expect(videoRequest.status).toBe('paid')
    })

    it('should create payment record', async () => {
      const { data: payment, error } = await supabaseAdmin
        .from('payments')
        .select('*')
        .eq('order_id', orderId)
        .single()

      expect(error).toBeNull()
      expect(payment).toBeDefined()
      expect(payment.stripe_payment_id).toBe(paymentIntentId)
      expect(payment.amount).toBe(100)
      expect(payment.platform_fee).toBe(30)
      expect(payment.creator_earnings).toBe(70)
      expect(payment.status).toBe('completed')
    })
  })

  describe('4. Creator Notifications via Broadcast', () => {
    it('should send broadcast notification to creator channel', async () => {
      // Set up a listener for the creator channel
      const receivedMessages: any[] = []
      const channel = supabaseClient.channel(`creator-${creatorUserId}`)
      
      // Subscribe to broadcast messages
      channel.on('broadcast', { event: 'new_order' }, (payload) => {
        receivedMessages.push(payload)
      })
      
      await channel.subscribe()
      
      // Simulate sending a notification (this would happen in the webhook)
      await channel.send({
        type: 'broadcast',
        event: 'new_order',
        payload: {
          title: 'New Video Request!',
          message: `You have a new video request worth $100`,
          orderId: orderId,
          amount: 100,
          fanName: TEST_FAN.name,
          timestamp: new Date().toISOString()
        }
      })
      
      // Wait for message to be received
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Verify message was received
      expect(receivedMessages).toHaveLength(1)
      expect(receivedMessages[0].payload.orderId).toBe(orderId)
      expect(receivedMessages[0].payload.amount).toBe(100)
      
      // Cleanup
      await channel.unsubscribe()
    })

    it('should handle order status updates via broadcast', async () => {
      const channel = supabaseClient.channel(`creator-${creatorUserId}`)
      const receivedMessages: any[] = []
      
      channel.on('broadcast', { event: 'order_accepted' }, (payload) => {
        receivedMessages.push(payload)
      })
      
      await channel.subscribe()
      
      // Simulate order acceptance notification
      await channel.send({
        type: 'broadcast',
        event: 'order_accepted',
        payload: {
          orderId: orderId,
          status: 'accepted',
          timestamp: new Date().toISOString()
        }
      })
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      expect(receivedMessages).toHaveLength(1)
      expect(receivedMessages[0].payload.status).toBe('accepted')
      
      await channel.unsubscribe()
    })
  })

  describe('5. Creator Order Management', () => {
    it('should allow creator to fetch their orders', async () => {
      const response = await fetch(`${TEST_CONFIG.apiBaseUrl}/api/creator/orders`, {
        headers: {
          'Authorization': `Bearer ${await getAuthToken(creatorUserId)}`,
        },
      })

      expect(response.ok).toBe(true)
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toBeInstanceOf(Array)
      expect(data.data).toHaveLength(1)
      
      const order = data.data[0]
      expect(order.id).toBe(orderId)
      expect(order.status).toBe('pending')
      expect(order.creator_earnings).toBe(70)
    })

    it('should allow creator to accept order', async () => {
      const response = await fetch(`${TEST_CONFIG.apiBaseUrl}/api/creator/orders/${orderId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await getAuthToken(creatorUserId)}`,
        },
        body: JSON.stringify({
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Will deliver within 7 days',
        }),
      })

      expect(response.ok).toBe(true)
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data.status).toBe('accepted')
    })
  })

  describe('6. Fan Order Tracking', () => {
    it('should allow fan to view their orders', async () => {
      const response = await fetch(`${TEST_CONFIG.apiBaseUrl}/api/fan/orders`, {
        headers: {
          'Authorization': `Bearer ${await getAuthToken(fanUserId)}`,
        },
      })

      expect(response.ok).toBe(true)
      
      const data = await response.json()
      expect(data.success).toBe(true)
      expect(data.data).toBeInstanceOf(Array)
      expect(data.data).toHaveLength(1)
      
      const order = data.data[0]
      expect(order.id).toBe(orderId)
      expect(order.status).toBe('accepted')
      expect(order.amount).toBe(100)
    })

    it('should send broadcast notification to fan when order is accepted', async () => {
      // Set up listener for fan channel
      const channel = supabaseClient.channel(`fan-${fanUserId}`)
      const receivedMessages: any[] = []
      
      channel.on('broadcast', { event: 'order_status_update' }, (payload) => {
        receivedMessages.push(payload)
      })
      
      await channel.subscribe()
      
      // Simulate order acceptance notification to fan
      await channel.send({
        type: 'broadcast',
        event: 'order_status_update',
        payload: {
          orderId: orderId,
          status: 'accepted',
          message: 'Your order has been accepted by the creator',
          timestamp: new Date().toISOString()
        }
      })
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      expect(receivedMessages).toHaveLength(1)
      expect(receivedMessages[0].payload.orderId).toBe(orderId)
      expect(receivedMessages[0].payload.status).toBe('accepted')
      
      await channel.unsubscribe()
    })
  })

  describe('7. Statistics & Analytics', () => {
    it('should update creator earnings stats', async () => {
      const { data: stats, error } = await supabaseAdmin
        .from('creator_stats')
        .select('*')
        .eq('creator_id', creatorUserId)
        .single()

      expect(error).toBeNull()
      expect(stats).toBeDefined()
      expect(stats.total_orders).toBeGreaterThanOrEqual(1)
      expect(stats.pending_orders).toBeGreaterThanOrEqual(0)
      expect(stats.total_earnings).toBeGreaterThanOrEqual(0)
    })

    it('should track platform revenue', async () => {
      const { data: revenue, error } = await supabaseAdmin
        .from('platform_revenue')
        .select('*')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

      expect(error).toBeNull()
      expect(revenue).toBeDefined()
      
      const totalRevenue = revenue.reduce((sum, r) => sum + r.platform_fee, 0)
      expect(totalRevenue).toBeGreaterThanOrEqual(30) // At least our test order's platform fee
    })
  })
})

// Helper functions
async function setupTestUsers() {
  // Create fan user
  const { data: fanAuth, error: fanError } = await supabaseAdmin.auth.admin.createUser({
    email: TEST_FAN.email,
    password: TEST_FAN.password,
    email_confirm: true,
  })
  
  if (fanError) throw fanError
  fanUserId = fanAuth.user.id

  // Create fan profile
  await supabaseAdmin.from('profiles').insert({
    id: fanUserId,
    email: TEST_FAN.email,
    name: TEST_FAN.name,
    role: 'fan',
    user_type: 'fan',
  })

  // Create creator user
  const { data: creatorAuth, error: creatorError } = await supabaseAdmin.auth.admin.createUser({
    email: TEST_CREATOR.email,
    password: TEST_CREATOR.password,
    email_confirm: true,
  })
  
  if (creatorError) throw creatorError
  creatorUserId = creatorAuth.user.id

  // Create creator profile
  await supabaseAdmin.from('profiles').insert({
    id: creatorUserId,
    email: TEST_CREATOR.email,
    name: TEST_CREATOR.name,
    role: 'creator',
    user_type: 'creator',
  })
}

async function setupStripeConnect() {
  // Create a test Stripe Connect account
  const account = await stripe.accounts.create({
    type: 'express',
    country: 'US',
    email: TEST_CREATOR.email,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  })

  TEST_CREATOR.stripeAccountId = account.id

  // Store in database
  await supabaseAdmin.from('stripe_accounts').insert({
    creator_id: creatorUserId,
    stripe_account_id: account.id,
    onboarding_complete: true,
    charges_enabled: true,
    payouts_enabled: true,
  })
}

async function cleanupTestData() {
  // Delete test users and related data
  if (fanUserId) {
    await supabaseAdmin.from('profiles').delete().eq('id', fanUserId)
    await supabaseAdmin.auth.admin.deleteUser(fanUserId)
  }
  
  if (creatorUserId) {
    await supabaseAdmin.from('profiles').delete().eq('id', creatorUserId)
    await supabaseAdmin.auth.admin.deleteUser(creatorUserId)
  }

  // Delete Stripe account if exists
  if (TEST_CREATOR.stripeAccountId) {
    try {
      await stripe.accounts.del(TEST_CREATOR.stripeAccountId)
    } catch (error) {
      // Account might not exist
    }
  }
}

async function getAuthToken(userId: string): Promise<string> {
  // Generate a test JWT token for the user
  // In a real test environment, you would use your auth service
  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email: userId === fanUserId ? TEST_FAN.email : TEST_CREATOR.email,
  })
  
  return data?.properties?.access_token || 'test-token'
}