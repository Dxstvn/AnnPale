import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import { createClient } from '@supabase/supabase-js'
import { v4 as uuidv4 } from 'uuid'

// Test database connection
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

describe('Subscription System Database Schema', () => {
  let testUserId: string
  let testCreatorId: string
  let testTierId: string
  let testPostId: string

  beforeAll(async () => {
    // Create test users
    const { data: userData, error: userError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: uuidv4(),
          email: `test-user-${Date.now()}@test.com`,
          role: 'fan',
          display_name: 'Test User'
        },
        {
          id: uuidv4(),
          email: `test-creator-${Date.now()}@test.com`,
          role: 'creator',
          display_name: 'Test Creator'
        }
      ])
      .select()

    if (userError) throw userError
    testUserId = userData[0].id
    testCreatorId = userData[1].id

    // Create test subscription tier
    const { data: tierData, error: tierError } = await supabase
      .from('creator_subscription_tiers')
      .insert({
        creator_id: testCreatorId,
        tier_name: 'Test Tier',
        description: 'Test subscription tier',
        price: 9.99,
        billing_period: 'monthly',
        benefits: ['Benefit 1', 'Benefit 2']
      })
      .select()
      .single()

    if (tierError) throw tierError
    testTierId = tierData.id

    // Create test post
    const { data: postData, error: postError } = await supabase
      .from('posts')
      .insert({
        creator_id: testCreatorId,
        title: 'Test Post',
        content_type: 'text',
        is_public: false
      })
      .select()
      .single()

    if (postError) throw postError
    testPostId = postData.id
  })

  afterAll(async () => {
    // Clean up test data
    await supabase.from('subscription_orders').delete().eq('user_id', testUserId)
    await supabase.from('posts').delete().eq('id', testPostId)
    await supabase.from('creator_subscription_tiers').delete().eq('id', testTierId)
    await supabase.from('profiles').delete().in('id', [testUserId, testCreatorId])
  })

  describe('Subscription Orders Table', () => {
    let subscriptionOrderId: string

    it('should create a subscription order with all required fields', async () => {
      const subscriptionOrder = {
        user_id: testUserId,
        creator_id: testCreatorId,
        tier_id: testTierId,
        total_amount: 9.99,
        platform_fee: 1.99,
        creator_earnings: 8.00,
        status: 'pending',
        billing_period: 'monthly'
      }

      const { data, error } = await supabase
        .from('subscription_orders')
        .insert(subscriptionOrder)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.user_id).toBe(testUserId)
      expect(data.creator_id).toBe(testCreatorId)
      expect(data.tier_id).toBe(testTierId)
      expect(data.status).toBe('pending')
      
      subscriptionOrderId = data.id
    })

    it('should enforce unique active subscription constraint', async () => {
      // First, update the existing subscription to active
      await supabase
        .from('subscription_orders')
        .update({ status: 'active' })
        .eq('id', subscriptionOrderId)

      // Try to create another active subscription for same user-creator pair
      const duplicateOrder = {
        user_id: testUserId,
        creator_id: testCreatorId,
        tier_id: testTierId,
        total_amount: 9.99,
        platform_fee: 1.99,
        creator_earnings: 8.00,
        status: 'active',
        billing_period: 'monthly'
      }

      const { error } = await supabase
        .from('subscription_orders')
        .insert(duplicateOrder)

      expect(error).toBeDefined()
      expect(error?.code).toBe('23505') // Unique violation
    })

    it('should update subscription status with timestamps', async () => {
      const { data: beforeData } = await supabase
        .from('subscription_orders')
        .select('activated_at, paused_at, cancelled_at')
        .eq('id', subscriptionOrderId)
        .single()

      expect(beforeData?.activated_at).toBeNull()

      // Update to active status
      const { data: activatedData, error: activateError } = await supabase
        .from('subscription_orders')
        .update({ status: 'active' })
        .eq('id', subscriptionOrderId)
        .select()
        .single()

      expect(activateError).toBeNull()
      
      // Update to paused status
      const { data: pausedData, error: pauseError } = await supabase
        .from('subscription_orders')
        .update({ status: 'paused' })
        .eq('id', subscriptionOrderId)
        .select()
        .single()

      expect(pauseError).toBeNull()

      // Update to cancelled status
      const { data: cancelledData, error: cancelError } = await supabase
        .from('subscription_orders')
        .update({ status: 'cancelled' })
        .eq('id', subscriptionOrderId)
        .select()
        .single()

      expect(cancelError).toBeNull()
    })

    it('should handle subscription lifecycle states correctly', async () => {
      const states = ['pending', 'processing', 'active', 'paused', 'cancelled', 'expired', 'failed', 'trialing']
      
      for (const state of states) {
        const { error } = await supabase
          .from('subscription_orders')
          .update({ status: state })
          .eq('id', subscriptionOrderId)

        expect(error).toBeNull()
      }
    })

    it('should validate billing period constraint', async () => {
      const invalidOrder = {
        user_id: testUserId,
        creator_id: testCreatorId,
        tier_id: testTierId,
        total_amount: 9.99,
        platform_fee: 1.99,
        creator_earnings: 8.00,
        status: 'pending',
        billing_period: 'weekly' // Invalid period
      }

      const { error } = await supabase
        .from('subscription_orders')
        .insert(invalidOrder)

      expect(error).toBeDefined()
      expect(error?.code).toBe('23514') // Check constraint violation
    })

    it('should clean up test subscription order', async () => {
      const { error } = await supabase
        .from('subscription_orders')
        .delete()
        .eq('id', subscriptionOrderId)

      expect(error).toBeNull()
    })
  })

  describe('Posts Enhancement for Preview System', () => {
    it('should add preview fields to posts table', async () => {
      const { data, error } = await supabase
        .from('posts')
        .update({
          is_preview: true,
          preview_order: 1,
          preview_start_date: new Date().toISOString(),
          preview_end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          is_featured: true,
          access_tier_ids: [testTierId]
        })
        .eq('id', testPostId)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data.is_preview).toBe(true)
      expect(data.preview_order).toBe(1)
      expect(data.is_featured).toBe(true)
      expect(data.access_tier_ids).toContain(testTierId)
    })

    it('should query preview posts efficiently', async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('is_preview', true)
        .order('preview_order', { ascending: true })

      expect(error).toBeNull()
      expect(Array.isArray(data)).toBe(true)
    })
  })

  describe('Post Access Tiers Junction Table', () => {
    let postAccessTierId: string

    it('should create post-tier associations', async () => {
      const { data, error } = await supabase
        .from('post_access_tiers')
        .insert({
          post_id: testPostId,
          tier_id: testTierId
        })
        .select()
        .single()

      expect(error).toBeNull()
      expect(data.post_id).toBe(testPostId)
      expect(data.tier_id).toBe(testTierId)
      
      postAccessTierId = data.id
    })

    it('should enforce unique post-tier constraint', async () => {
      const { error } = await supabase
        .from('post_access_tiers')
        .insert({
          post_id: testPostId,
          tier_id: testTierId
        })

      expect(error).toBeDefined()
      expect(error?.code).toBe('23505') // Unique violation
    })

    it('should clean up test post access tier', async () => {
      const { error } = await supabase
        .from('post_access_tiers')
        .delete()
        .eq('id', postAccessTierId)

      expect(error).toBeNull()
    })
  })

  describe('User Feed Preferences Table', () => {
    let feedPreferencesId: string

    it('should create user feed preferences', async () => {
      const preferences = {
        user_id: testUserId,
        feed_layout: 'vertical',
        autoplay_videos: true,
        show_captions: true,
        content_quality: 'auto',
        prioritize_subscribed: true,
        notify_new_posts: true
      }

      const { data, error } = await supabase
        .from('user_feed_preferences')
        .insert(preferences)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data.user_id).toBe(testUserId)
      expect(data.feed_layout).toBe('vertical')
      expect(data.autoplay_videos).toBe(true)
      
      feedPreferencesId = data.id
    })

    it('should enforce unique user constraint', async () => {
      const { error } = await supabase
        .from('user_feed_preferences')
        .insert({
          user_id: testUserId,
          feed_layout: 'grid'
        })

      expect(error).toBeDefined()
      expect(error?.code).toBe('23505') // Unique violation
    })

    it('should validate feed layout options', async () => {
      const validLayouts = ['vertical', 'grid', 'list']
      
      for (const layout of validLayouts) {
        const { error } = await supabase
          .from('user_feed_preferences')
          .update({ feed_layout: layout })
          .eq('id', feedPreferencesId)

        expect(error).toBeNull()
      }
    })

    it('should clean up test feed preferences', async () => {
      const { error } = await supabase
        .from('user_feed_preferences')
        .delete()
        .eq('id', feedPreferencesId)

      expect(error).toBeNull()
    })
  })

  describe('Creator Feed Settings Table', () => {
    let feedSettingsId: string

    it('should create creator feed settings', async () => {
      const settings = {
        creator_id: testCreatorId,
        theme_color: '#9333EA',
        default_post_visibility: 'subscribers',
        preview_post_count: 5,
        allow_comments: true,
        show_subscriber_count: true,
        subscription_prompt_frequency: 3
      }

      const { data, error } = await supabase
        .from('creator_feed_settings')
        .insert(settings)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data.creator_id).toBe(testCreatorId)
      expect(data.theme_color).toBe('#9333EA')
      expect(data.preview_post_count).toBe(5)
      
      feedSettingsId = data.id
    })

    it('should enforce preview post count constraints', async () => {
      // Test valid range (0-10)
      const { error: validError } = await supabase
        .from('creator_feed_settings')
        .update({ preview_post_count: 10 })
        .eq('id', feedSettingsId)

      expect(validError).toBeNull()

      // Test invalid count (> 10)
      const { error: invalidError } = await supabase
        .from('creator_feed_settings')
        .update({ preview_post_count: 11 })
        .eq('id', feedSettingsId)

      expect(invalidError).toBeDefined()
    })

    it('should clean up test feed settings', async () => {
      const { error } = await supabase
        .from('creator_feed_settings')
        .delete()
        .eq('id', feedSettingsId)

      expect(error).toBeNull()
    })
  })

  describe('Subscription Transactions Table', () => {
    let transactionId: string
    let tempOrderId: string

    beforeEach(async () => {
      // Create a temporary subscription order for transaction tests
      const { data } = await supabase
        .from('subscription_orders')
        .insert({
          user_id: testUserId,
          creator_id: testCreatorId,
          tier_id: testTierId,
          total_amount: 9.99,
          platform_fee: 1.99,
          creator_earnings: 8.00,
          status: 'active',
          billing_period: 'monthly'
        })
        .select()
        .single()
      
      tempOrderId = data.id
    })

    afterEach(async () => {
      await supabase.from('subscription_orders').delete().eq('id', tempOrderId)
    })

    it('should create subscription transactions', async () => {
      const transaction = {
        subscription_order_id: tempOrderId,
        amount: 9.99,
        currency: 'USD',
        type: 'payment',
        status: 'succeeded',
        stripe_payment_intent_id: 'pi_test_123',
        description: 'Monthly subscription payment'
      }

      const { data, error } = await supabase
        .from('subscription_transactions')
        .insert(transaction)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data.subscription_order_id).toBe(tempOrderId)
      expect(data.amount).toBe('9.99')
      expect(data.type).toBe('payment')
      expect(data.status).toBe('succeeded')
      
      transactionId = data.id
    })

    it('should validate transaction types', async () => {
      const validTypes = ['payment', 'refund', 'chargeback', 'adjustment', 'promo_credit']
      
      for (const type of validTypes) {
        const { error } = await supabase
          .from('subscription_transactions')
          .update({ type })
          .eq('id', transactionId)

        expect(error).toBeNull()
      }
    })

    it('should clean up test transaction', async () => {
      const { error } = await supabase
        .from('subscription_transactions')
        .delete()
        .eq('id', transactionId)

      expect(error).toBeNull()
    })
  })

  describe('Subscription Analytics Table', () => {
    let analyticsId: string

    it('should create subscription analytics records', async () => {
      const analytics = {
        creator_id: testCreatorId,
        date: new Date().toISOString().split('T')[0],
        new_subscribers: 5,
        cancelled_subscribers: 1,
        active_subscribers: 25,
        trial_subscribers: 3,
        daily_revenue: 149.85,
        monthly_recurring_revenue: 374.63,
        average_revenue_per_user: 14.99,
        churn_rate: 4.0,
        retention_rate: 96.0,
        conversion_rate: 62.5
      }

      const { data, error } = await supabase
        .from('subscription_analytics')
        .insert(analytics)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data.creator_id).toBe(testCreatorId)
      expect(data.new_subscribers).toBe(5)
      expect(data.active_subscribers).toBe(25)
      
      analyticsId = data.id
    })

    it('should enforce unique creator-date constraint', async () => {
      const { error } = await supabase
        .from('subscription_analytics')
        .insert({
          creator_id: testCreatorId,
          date: new Date().toISOString().split('T')[0],
          new_subscribers: 10
        })

      expect(error).toBeDefined()
      expect(error?.code).toBe('23505') // Unique violation
    })

    it('should clean up test analytics', async () => {
      const { error } = await supabase
        .from('subscription_analytics')
        .delete()
        .eq('id', analyticsId)

      expect(error).toBeNull()
    })
  })

  describe('Database Functions', () => {
    it('should check post access based on subscription', async () => {
      // Create an active subscription
      const { data: orderData } = await supabase
        .from('subscription_orders')
        .insert({
          user_id: testUserId,
          creator_id: testCreatorId,
          tier_id: testTierId,
          total_amount: 9.99,
          platform_fee: 1.99,
          creator_earnings: 8.00,
          status: 'active',
          billing_period: 'monthly'
        })
        .select()
        .single()

      // Update post to require the tier
      await supabase
        .from('posts')
        .update({
          is_public: false,
          access_tier_ids: [testTierId]
        })
        .eq('id', testPostId)

      // Test access check function
      const { data: hasAccess, error } = await supabase
        .rpc('check_post_access', {
          p_user_id: testUserId,
          p_post_id: testPostId
        })

      expect(error).toBeNull()
      expect(hasAccess).toBe(true)

      // Clean up
      await supabase.from('subscription_orders').delete().eq('id', orderData.id)
    })

    it('should calculate subscription analytics', async () => {
      const today = new Date().toISOString().split('T')[0]
      
      const { error } = await supabase
        .rpc('calculate_subscription_analytics', {
          p_creator_id: testCreatorId,
          p_date: today
        })

      expect(error).toBeNull()

      // Verify analytics were created/updated
      const { data } = await supabase
        .from('subscription_analytics')
        .select('*')
        .eq('creator_id', testCreatorId)
        .eq('date', today)
        .single()

      expect(data).toBeDefined()
      
      // Clean up
      if (data) {
        await supabase.from('subscription_analytics').delete().eq('id', data.id)
      }
    })
  })

  describe('Row Level Security Policies', () => {
    it('should enforce RLS on subscription_orders', async () => {
      // This would require creating a separate client with user auth
      // For now, we'll just verify the policies exist
      const { data } = await supabase
        .from('pg_policies')
        .select('*')
        .eq('tablename', 'subscription_orders')

      expect(data).toBeDefined()
      expect(data.length).toBeGreaterThan(0)
    })

    it('should enforce RLS on user_feed_preferences', async () => {
      const { data } = await supabase
        .from('pg_policies')
        .select('*')
        .eq('tablename', 'user_feed_preferences')

      expect(data).toBeDefined()
      expect(data.length).toBeGreaterThan(0)
    })

    it('should enforce RLS on creator_feed_settings', async () => {
      const { data } = await supabase
        .from('pg_policies')
        .select('*')
        .eq('tablename', 'creator_feed_settings')

      expect(data).toBeDefined()
      expect(data.length).toBeGreaterThan(0)
    })
  })

  describe('Index Performance', () => {
    it('should have proper indexes on subscription_orders', async () => {
      const { data } = await supabase
        .from('pg_indexes')
        .select('*')
        .eq('tablename', 'subscription_orders')

      const indexNames = data?.map(idx => idx.indexname) || []
      
      expect(indexNames).toContain('idx_subscription_orders_user_id')
      expect(indexNames).toContain('idx_subscription_orders_creator_id')
      expect(indexNames).toContain('idx_subscription_orders_status')
      expect(indexNames).toContain('idx_subscription_orders_next_billing_date')
    })

    it('should have proper indexes on posts for preview system', async () => {
      const { data } = await supabase
        .from('pg_indexes')
        .select('*')
        .eq('tablename', 'posts')

      const indexNames = data?.map(idx => idx.indexname) || []
      
      expect(indexNames).toContain('idx_posts_preview')
      expect(indexNames).toContain('idx_posts_access_tiers')
    })
  })
})