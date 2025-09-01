import { SupabaseClient } from '@supabase/supabase-js'
import {
  createTestClient,
  createTestUser,
  cleanupTestUser,
  getAuthenticatedClient
} from '../helpers/test-db'
import {
  createTestOrders,
  createTestEarnings,
  cleanupTestVideoRequests
} from '../helpers/test-video-requests'

describe('Stats Views Integration', () => {
  let supabase: SupabaseClient
  let testCreatorId: string
  let testFanId: string
  let testCreator2Id: string

  beforeAll(async () => {
    // Use service role client for setup
    supabase = createTestClient()
    
    // Get existing test users
    const { data: creator } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'testcreator@annpale.test')
      .single()
    
    const { data: fan } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'testfan@annpale.test')
      .single()
    
    const { data: creator2 } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'testcreator2@annpale.test')
      .single()
    
    if (!creator || !fan || !creator2) {
      throw new Error('Test users not found. Run create-test-users.js first')
    }
    
    testCreatorId = creator.id
    testFanId = fan.id
    testCreator2Id = creator2.id
  })

  afterEach(async () => {
    // Clean up test data after each test
    await cleanupTestVideoRequests(supabase, testCreatorId)
    await cleanupTestVideoRequests(supabase, testCreator2Id)
    
    // Clean up any test subscription tiers created in individual tests
    await supabase
      .from('creator_subscription_tiers')
      .delete()
      .in('tier_name', [
        'Bronze Stats Test', 
        'Silver Stats Test', 
        'Gold Stats Test',
        'Platform Test 1',
        'Platform Test 2'
      ])
  })

  afterAll(async () => {
    // Final cleanup
    await cleanupTestVideoRequests(supabase)
    
    // Also cleanup any test subscription tiers
    await supabase
      .from('creator_subscription_tiers')
      .delete()
      .in('tier_name', [
        'Bronze Stats Test', 
        'Silver Stats Test', 
        'Gold Stats Test',
        'Platform Test 1',
        'Platform Test 2'
      ])
  })

  describe('creator_stats view', () => {
    test('aggregates data correctly for a creator with orders', async () => {
      // Create test data
      await createTestOrders(supabase, testCreatorId, testFanId, 10)
      await createTestEarnings(supabase, testCreatorId, testFanId, 5000)

      // Query the creator_stats view
      const { data: stats, error } = await supabase
        .from('creator_stats')
        .select('*')
        .eq('creator_id', testCreatorId)
        .single()

      expect(error).toBeNull()
      expect(stats).toBeDefined()
      
      // Check video request metrics
      expect(stats.total_requests).toBeGreaterThanOrEqual(10)
      expect(stats.completed_videos).toBeGreaterThan(0)
      expect(stats.pending_requests).toBeGreaterThanOrEqual(0)
      
      // Check financial metrics
      expect(stats.total_earnings).toBeGreaterThan(0)
      expect(stats.total_revenue).toBeGreaterThan(stats.total_earnings) // Revenue > earnings due to platform fee
      expect(stats.average_price).toBeGreaterThan(0)
      
      // Check rating metrics
      expect(stats.average_rating).toBeGreaterThanOrEqual(0)
      expect(stats.average_rating).toBeLessThanOrEqual(5)
      expect(stats.total_reviews).toBeGreaterThanOrEqual(0)
      
      // Check completion rate
      expect(stats.completion_rate).toBeGreaterThanOrEqual(0)
      expect(stats.completion_rate).toBeLessThanOrEqual(100)
    })

    test('returns zero values for creator with no orders', async () => {
      // Query stats for creator with no orders
      const { data: stats, error } = await supabase
        .from('creator_stats')
        .select('*')
        .eq('creator_id', testCreator2Id)
        .single()

      expect(error).toBeNull()
      expect(stats).toBeDefined()
      
      // All counts should be zero
      expect(stats.total_requests).toBe(0)
      expect(stats.completed_videos).toBe(0)
      expect(stats.total_earnings).toBe(0)
      expect(stats.total_revenue).toBe(0)
      expect(stats.average_rating).toBe(0)
      expect(stats.completion_rate).toBe(0)
    })

    test('calculates completion rate correctly', async () => {
      // Create specific test data: 7 completed, 2 pending, 1 cancelled = 70% completion
      const requests = []
      
      // 7 completed
      for (let i = 0; i < 7; i++) {
        requests.push({
          fan_id: testFanId,
          creator_id: testCreatorId,
          request_type: 'birthday',
          price: 50,
          platform_fee: 10,
          status: 'completed',
          rating: 4,
          completed_at: new Date().toISOString()
        })
      }
      
      // 2 pending
      for (let i = 0; i < 2; i++) {
        requests.push({
          fan_id: testFanId,
          creator_id: testCreatorId,
          request_type: 'birthday',
          price: 50,
          platform_fee: 10,
          status: 'pending'
        })
      }
      
      // 1 cancelled
      requests.push({
        fan_id: testFanId,
        creator_id: testCreatorId,
        request_type: 'birthday',
        price: 50,
        platform_fee: 10,
        status: 'cancelled'
      })
      
      await supabase.from('video_requests').insert(requests)
      
      const { data: stats } = await supabase
        .from('creator_stats')
        .select('*')
        .eq('creator_id', testCreatorId)
        .single()
      
      expect(stats.total_requests).toBe(10)
      expect(stats.completed_videos).toBe(7)
      expect(stats.completion_rate).toBe(70) // 7/10 * 100
    })

    test('includes subscription tier metrics', async () => {
      // First clean up ALL existing tiers for this creator to ensure clean state
      await supabase
        .from('creator_subscription_tiers')
        .delete()
        .eq('creator_id', testCreatorId)
      
      // Create subscription tiers for the creator
      const { data: insertedTiers, error: insertError } = await supabase
        .from('creator_subscription_tiers')
        .insert([
          {
            creator_id: testCreatorId,
            tier_name: 'Bronze Stats Test',
            price: 10,
            is_active: true
          },
          {
            creator_id: testCreatorId,
            tier_name: 'Silver Stats Test',
            price: 25,
            is_active: true
          },
          {
            creator_id: testCreatorId,
            tier_name: 'Gold Stats Test',
            price: 50,
            is_active: false // Inactive
          }
        ])
        .select()
      
      expect(insertError).toBeNull()
      expect(insertedTiers).toBeDefined()
      expect(insertedTiers).toHaveLength(3)
      
      const { data: stats, error } = await supabase
        .from('creator_stats')
        .select('*')
        .eq('creator_id', testCreatorId)
        .single()
      
      expect(error).toBeNull()
      expect(stats).toBeDefined()
      
      // The view should now correctly aggregate the tiers
      // We created 3 tiers, so should have at least 3
      expect(stats.total_subscription_tiers).toBeGreaterThanOrEqual(3)
      // 2 of our tiers are active
      expect(stats.active_subscription_tiers).toBeGreaterThanOrEqual(2)
      // Min price should be at most 10 (our Bronze tier)
      expect(stats.min_tier_price).toBeLessThanOrEqual(10)
      expect(stats.min_tier_price).toBeGreaterThan(0)
      // Max price should be at least 50 (our Gold tier)
      expect(stats.max_tier_price).toBeGreaterThanOrEqual(50)
      
      // Cleanup tiers
      await supabase
        .from('creator_subscription_tiers')
        .delete()
        .eq('creator_id', testCreatorId)
        .in('tier_name', ['Bronze Stats Test', 'Silver Stats Test', 'Gold Stats Test'])
    })
  })

  describe('platform_stats view', () => {
    test('provides accurate platform-wide metrics', async () => {
      // Create some test data
      await createTestOrders(supabase, testCreatorId, testFanId, 5)
      
      const { data: stats, error } = await supabase
        .from('platform_stats')
        .select('*')
        .single()

      expect(error).toBeNull()
      expect(stats).toBeDefined()
      
      // User metrics
      expect(stats.total_users).toBeGreaterThan(0)
      expect(stats.total_creators).toBeGreaterThan(0)
      expect(stats.total_fans).toBeGreaterThan(0)
      expect(stats.total_users).toBe(
        stats.total_creators + stats.total_fans + stats.total_admins
      )
      
      // Video metrics
      expect(stats.total_video_requests).toBeGreaterThanOrEqual(5)
      expect(stats.completed_videos).toBeGreaterThanOrEqual(0)
      expect(stats.pending_videos).toBeGreaterThanOrEqual(0)
      
      // Financial metrics
      expect(stats.total_revenue).toBeGreaterThanOrEqual(0)
      expect(stats.total_platform_fees).toBeGreaterThanOrEqual(0)
      expect(stats.total_creator_earnings).toBeGreaterThanOrEqual(0)
      
      // Platform fees should be approximately 20% of revenue for completed orders
      if (stats.total_revenue > 0) {
        const feePercentage = (stats.total_platform_fees / stats.total_revenue) * 100
        expect(feePercentage).toBeGreaterThanOrEqual(15) // Allow some variance
        expect(feePercentage).toBeLessThanOrEqual(25)
      }
      
      // Rating metrics
      expect(stats.average_rating).toBeGreaterThanOrEqual(0)
      expect(stats.average_rating).toBeLessThanOrEqual(5)
      
      // Completion rate
      expect(stats.overall_completion_rate).toBeGreaterThanOrEqual(0)
      expect(stats.overall_completion_rate).toBeLessThanOrEqual(100)
      
      // Timestamp
      expect(stats.stats_generated_at).toBeDefined()
    })

    test('returns valid stats even with no data', async () => {
      // Clean all test data first
      await cleanupTestVideoRequests(supabase)
      
      const { data: stats, error } = await supabase
        .from('platform_stats')
        .select('*')
        .single()

      expect(error).toBeNull()
      expect(stats).toBeDefined()
      
      // Should still return a row with zero/default values
      expect(stats.total_users).toBeGreaterThanOrEqual(0) // Test users exist
      expect(stats.total_video_requests).toBeGreaterThanOrEqual(0)
      expect(stats.total_revenue).toBe(0)
      expect(stats.average_rating).toBe(0)
      expect(stats.overall_completion_rate).toBe(0)
    })

    test('calculates active users correctly', async () => {
      const { data: stats } = await supabase
        .from('platform_stats')
        .select('*')
        .single()
      
      // Active users should be less than or equal to total users
      expect(stats.active_users_30d).toBeLessThanOrEqual(stats.total_users)
      expect(stats.active_creators_30d).toBeLessThanOrEqual(stats.total_creators)
      expect(stats.active_users_30d).toBeGreaterThanOrEqual(0)
    })

    test('aggregates subscription tier metrics', async () => {
      // First clean up any existing test tiers
      await supabase
        .from('creator_subscription_tiers')
        .delete()
        .in('tier_name', ['Platform Test 1', 'Platform Test 2'])
      
      // Create test tiers
      const { error: insertError } = await supabase
        .from('creator_subscription_tiers')
        .insert([
          {
            creator_id: testCreatorId,
            tier_name: 'Platform Test 1',
            price: 15,
            is_active: true
          },
          {
            creator_id: testCreator2Id,
            tier_name: 'Platform Test 2',
            price: 30,
            is_active: true
          }
        ])
      
      expect(insertError).toBeNull()
      
      const { data: stats, error } = await supabase
        .from('platform_stats')
        .select('*')
        .single()
      
      expect(error).toBeNull()
      expect(stats).toBeDefined()
      expect(stats.total_subscription_tiers).toBeGreaterThanOrEqual(2)
      expect(stats.creators_with_tiers).toBeGreaterThanOrEqual(1) // At least one creator has tiers
      expect(stats.average_tier_price).toBeGreaterThan(0)
      
      // Cleanup
      await supabase
        .from('creator_subscription_tiers')
        .delete()
        .in('tier_name', ['Platform Test 1', 'Platform Test 2'])
    })
  })

  describe('View permissions', () => {
    test('authenticated users can read creator_stats', async () => {
      const fanClient = await getAuthenticatedClient(
        'testfan@annpale.test',
        'TestFan123!'
      )
      
      const { data, error } = await fanClient
        .from('creator_stats')
        .select('creator_id, total_requests, average_rating')
        .limit(5)
      
      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(Array.isArray(data)).toBe(true)
    })

    test('authenticated users can read platform_stats', async () => {
      const creatorClient = await getAuthenticatedClient(
        'testcreator@annpale.test',
        'TestCreator123!'
      )
      
      const { data, error } = await creatorClient
        .from('platform_stats')
        .select('total_users, total_creators, total_video_requests')
        .single()
      
      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.total_users).toBeGreaterThanOrEqual(0)
    })
  })
})