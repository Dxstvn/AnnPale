import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

// Set mock Stripe key before importing routes
process.env.STRIPE_SECRET_KEY = 'sk_test_mock_key'

// Import route handlers
import * as CreateOrderRoute from '@/app/api/subscriptions/create-order/route'
import * as ManageRoute from '@/app/api/subscriptions/manage/route'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

describe('Subscription APIs', () => {
  let testUserId: string
  let testCreatorId: string
  let testTierId: string
  let testOrderId: string

  beforeAll(async () => {
    // Create test user
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .insert({
        id: crypto.randomUUID(),
        email: 'test-subscriber@example.com',
        username: 'testsubscriber',
        display_name: 'Test Subscriber',
        role: 'fan'
      })
      .select()
      .single()
    
    if (userError) {
      console.error('Failed to create test user:', userError)
      throw userError
    }
    testUserId = userData!.id

    // Create test creator
    const { data: creatorData, error: creatorError } = await supabase
      .from('profiles')
      .insert({
        id: crypto.randomUUID(),
        email: 'test-creator-sub@example.com',
        username: 'testcreatorsub',
        display_name: 'Test Creator Sub',
        role: 'creator'
      })
      .select()
      .single()
    
    if (creatorError) {
      console.error('Failed to create test creator:', creatorError)
      throw creatorError
    }
    testCreatorId = creatorData!.id

    // Create test subscription tier
    const { data: tierData } = await supabase
      .from('creator_subscription_tiers')
      .insert({
        creator_id: testCreatorId,
        tier_name: 'Test Tier',
        description: 'Test subscription tier',
        price: 9.99,
        billing_period: 'monthly',
        features: { feature1: true },
        benefits: ['Benefit 1', 'Benefit 2']
      })
      .select()
      .single()
    testTierId = tierData!.id
  })

  afterAll(async () => {
    // Clean up test data
    if (testOrderId) {
      await supabase
        .from('subscription_orders')
        .delete()
        .eq('id', testOrderId)
    }
    await supabase
      .from('creator_subscription_tiers')
      .delete()
      .eq('id', testTierId)
    await supabase
      .from('profiles')
      .delete()
      .in('id', [testUserId, testCreatorId])
  })

  describe('POST /api/subscriptions/create-order', () => {
    it('should create a subscription order', async () => {
      // Mock authenticated request
      const mockRequest = new NextRequest('http://localhost:3000/api/subscriptions/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          creatorId: testCreatorId,
          tierId: testTierId,
          message: 'Looking forward to your content!'
        })
      })

      // Mock auth
      const authSpy = vi.spyOn(supabase.auth, 'getUser')
      authSpy.mockResolvedValueOnce({
        data: { user: { id: testUserId } as any },
        error: null
      })

      const response = await CreateOrderRoute.POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.order).toBeDefined()
      expect(data.order.user_id).toBe(testUserId)
      expect(data.order.creator_id).toBe(testCreatorId)
      expect(data.order.tier_id).toBe(testTierId)
      expect(data.order.status).toBe('pending')
      expect(data.order.amount).toBe('9.99')

      testOrderId = data.order.id

      authSpy.mockRestore()
    })

    it('should reject unauthenticated requests', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/subscriptions/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          creatorId: testCreatorId,
          tierId: testTierId
        })
      })

      // Mock no auth
      const authSpy = vi.spyOn(supabase.auth, 'getUser')
      authSpy.mockResolvedValueOnce({
        data: { user: null },
        error: null
      })

      const response = await CreateOrderRoute.POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.error).toBe('Unauthorized')

      authSpy.mockRestore()
    })

    it('should prevent duplicate active subscriptions', async () => {
      // First create an active subscription
      await supabase
        .from('subscription_orders')
        .insert({
          user_id: testUserId,
          creator_id: testCreatorId,
          tier_id: testTierId,
          status: 'active',
          amount: 9.99,
          currency: 'USD',
          billing_period: 'monthly'
        })

      const mockRequest = new NextRequest('http://localhost:3000/api/subscriptions/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          creatorId: testCreatorId,
          tierId: testTierId
        })
      })

      // Mock auth
      const authSpy = vi.spyOn(supabase.auth, 'getUser')
      authSpy.mockResolvedValueOnce({
        data: { user: { id: testUserId } as any },
        error: null
      })

      const response = await CreateOrderRoute.POST(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.error).toContain('already have an active subscription')

      // Clean up
      await supabase
        .from('subscription_orders')
        .delete()
        .eq('user_id', testUserId)
        .eq('creator_id', testCreatorId)
        .eq('status', 'active')

      authSpy.mockRestore()
    })
  })

  describe('GET /api/subscriptions/manage', () => {
    beforeEach(async () => {
      // Create test subscription
      const { data } = await supabase
        .from('subscription_orders')
        .insert({
          user_id: testUserId,
          creator_id: testCreatorId,
          tier_id: testTierId,
          status: 'active',
          amount: 9.99,
          currency: 'USD',
          billing_period: 'monthly'
        })
        .select()
        .single()
      testOrderId = data!.id
    })

    it('should fetch user subscriptions', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/subscriptions/manage', {
        method: 'GET'
      })

      // Mock auth
      const authSpy = vi.spyOn(supabase.auth, 'getUser')
      authSpy.mockResolvedValueOnce({
        data: { user: { id: testUserId } as any },
        error: null
      })

      const response = await ManageRoute.GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.subscriptions).toBeDefined()
      expect(Array.isArray(data.subscriptions)).toBe(true)
      expect(data.subscriptions.length).toBeGreaterThan(0)
      expect(data.subscriptions[0].user_id).toBe(testUserId)

      authSpy.mockRestore()
    })

    it('should filter subscriptions by status', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/subscriptions/manage?status=active', {
        method: 'GET'
      })

      // Mock auth
      const authSpy = vi.spyOn(supabase.auth, 'getUser')
      authSpy.mockResolvedValueOnce({
        data: { user: { id: testUserId } as any },
        error: null
      })

      const response = await ManageRoute.GET(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.subscriptions).toBeDefined()
      expect(data.subscriptions.every(s => s.status === 'active')).toBe(true)

      authSpy.mockRestore()
    })
  })

  describe('PATCH /api/subscriptions/manage', () => {
    beforeEach(async () => {
      // Create test subscription
      const { data } = await supabase
        .from('subscription_orders')
        .insert({
          user_id: testUserId,
          creator_id: testCreatorId,
          tier_id: testTierId,
          status: 'active',
          amount: 9.99,
          currency: 'USD',
          billing_period: 'monthly'
        })
        .select()
        .single()
      testOrderId = data!.id
    })

    it('should pause an active subscription', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/subscriptions/manage', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: testOrderId,
          action: 'pause'
        })
      })

      // Mock auth
      const authSpy = vi.spyOn(supabase.auth, 'getUser')
      authSpy.mockResolvedValueOnce({
        data: { user: { id: testUserId } as any },
        error: null
      })

      const response = await ManageRoute.PATCH(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.subscription.status).toBe('paused')

      // Verify in database
      const { data: updatedOrder } = await supabase
        .from('subscription_orders')
        .select('status, paused_at')
        .eq('id', testOrderId)
        .single()

      expect(updatedOrder?.status).toBe('paused')
      expect(updatedOrder?.paused_at).toBeDefined()

      authSpy.mockRestore()
    })

    it('should cancel an active subscription', async () => {
      const mockRequest = new NextRequest('http://localhost:3000/api/subscriptions/manage', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          orderId: testOrderId,
          action: 'cancel'
        })
      })

      // Mock auth
      const authSpy = vi.spyOn(supabase.auth, 'getUser')
      authSpy.mockResolvedValueOnce({
        data: { user: { id: testUserId } as any },
        error: null
      })

      const response = await ManageRoute.PATCH(mockRequest)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.subscription.status).toBe('cancelled')

      // Verify in database
      const { data: updatedOrder } = await supabase
        .from('subscription_orders')
        .select('status, cancelled_at')
        .eq('id', testOrderId)
        .single()

      expect(updatedOrder?.status).toBe('cancelled')
      expect(updatedOrder?.cancelled_at).toBeDefined()

      authSpy.mockRestore()
    })

    afterEach(async () => {
      // Clean up test subscription
      if (testOrderId) {
        await supabase
          .from('subscription_orders')
          .delete()
          .eq('id', testOrderId)
      }
    })
  })
})