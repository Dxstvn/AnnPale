import { SupabaseClient } from '@supabase/supabase-js'
import {
  createTestClient,
  cleanupCreatorTiers,
  getAuthenticatedClient
} from '../helpers/test-db'
import {
  createTestTier,
  createTestTiers,
  insertTestTier,
  insertTestTiers
} from '../helpers/test-data'

describe('Creator Tiers Database Integration', () => {
  let supabase: SupabaseClient
  let testCreatorId: string
  let creatorClient: SupabaseClient
  let otherCreatorClient: SupabaseClient
  let otherCreatorId: string

  beforeAll(async () => {
    // Use service role client for setup
    supabase = createTestClient()
    
    // Use existing test creator
    const { data: creator } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'testcreator@annpale.test')
      .single()
    
    if (!creator) {
      throw new Error('Test creator not found. Run create-test-users.js first')
    }
    
    testCreatorId = creator.id
    
    // Get authenticated client for creator
    creatorClient = await getAuthenticatedClient(
      'testcreator@annpale.test',
      'TestCreator123!'
    )
    
    // Use testcreator2 as "other creator" for RLS tests
    const { data: otherCreator } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', 'testcreator2@annpale.test')
      .single()
    
    otherCreatorId = otherCreator.id
    otherCreatorClient = await getAuthenticatedClient(
      'testcreator2@annpale.test',
      'TestCreator2123!'
    )
  })

  afterEach(async () => {
    // Clean up test data after each test
    await cleanupCreatorTiers(supabase, testCreatorId)
    await cleanupCreatorTiers(supabase, otherCreatorId)
  })

  afterAll(async () => {
    // Final cleanup
    await cleanupCreatorTiers(supabase, testCreatorId)
    await cleanupCreatorTiers(supabase, otherCreatorId)
  })

  describe('Basic CRUD Operations', () => {
    test('creator can create a subscription tier', async () => {
      const tier = createTestTier(testCreatorId, {
        tier_name: 'Premium Access',
        price: 29.99,
        benefits: ['Ad-free experience', 'Exclusive content']
      })

      const { data, error } = await creatorClient
        .from('creator_subscription_tiers')
        .insert(tier)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data).toBeDefined()
      expect(data.tier_name).toBe('Premium Access')
      expect(data.price).toBe(29.99)
      expect(data.benefits).toEqual(['Ad-free experience', 'Exclusive content'])
      expect(data.creator_id).toBe(testCreatorId)
    })

    test('creator can create multiple subscription tiers', async () => {
      const tiers = createTestTiers(testCreatorId)

      const { data, error } = await creatorClient
        .from('creator_subscription_tiers')
        .insert(tiers)
        .select()

      expect(error).toBeNull()
      expect(data).toHaveLength(3)
      
      // Verify tier names
      const tierNames = data.map(t => t.tier_name).sort()
      expect(tierNames).toEqual(['Bronze', 'Gold', 'Silver'])
      
      // Verify prices
      const bronzeTier = data.find(t => t.tier_name === 'Bronze')
      expect(bronzeTier.price).toBe(10)
      
      const goldTier = data.find(t => t.tier_name === 'Gold')
      expect(goldTier.price).toBe(50)
    })

    test('creator can update their own tier', async () => {
      // First create a tier
      const tier = await insertTestTier(supabase, 
        createTestTier(testCreatorId, { tier_name: 'Original' })
      )

      // Update via creator client
      const { data, error } = await creatorClient
        .from('creator_subscription_tiers')
        .update({ 
          price: 19.99,
          tier_name: 'Updated Tier'
        })
        .eq('id', tier.id)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data.tier_name).toBe('Updated Tier')
      expect(data.price).toBe(19.99)
    })

    test('creator can deactivate their tier', async () => {
      const tier = await insertTestTier(supabase,
        createTestTier(testCreatorId, { is_active: true })
      )

      const { data, error } = await creatorClient
        .from('creator_subscription_tiers')
        .update({ is_active: false })
        .eq('id', tier.id)
        .select()
        .single()

      expect(error).toBeNull()
      expect(data.is_active).toBe(false)
    })

    test('creator can delete their tier', async () => {
      const tier = await insertTestTier(supabase,
        createTestTier(testCreatorId)
      )

      const { error: deleteError } = await creatorClient
        .from('creator_subscription_tiers')
        .delete()
        .eq('id', tier.id)

      expect(deleteError).toBeNull()

      // Verify it's deleted
      const { data: checkData } = await supabase
        .from('creator_subscription_tiers')
        .select('*')
        .eq('id', tier.id)
        .single()

      expect(checkData).toBeNull()
    })
  })

  describe('RLS Policies', () => {
    test('RLS policies prevent cross-creator tier access', async () => {
      // Create tier for first creator
      const tier = await insertTestTier(supabase,
        createTestTier(testCreatorId, {
          tier_name: 'Creator 1 Tier',
          price: 20
        })
      )

      // Try to modify as other creator
      const { data, error } = await otherCreatorClient
        .from('creator_subscription_tiers')
        .update({ price: 999 })
        .eq('id', tier.id)
        .select()

      // RLS will silently filter out the row, so no data is returned
      expect(data).toEqual([])
      expect(error).toBeNull()
      
      // Verify the tier wasn't actually modified
      const { data: checkData } = await supabase
        .from('creator_subscription_tiers')
        .select('price')
        .eq('id', tier.id)
        .single()
      
      expect(checkData.price).toBe(20) // Original price unchanged
    })

    test('creator cannot delete another creator\'s tier', async () => {
      // Create tier for first creator
      const tier = await insertTestTier(supabase,
        createTestTier(testCreatorId)
      )

      // Try to delete as other creator
      const { data, error } = await otherCreatorClient
        .from('creator_subscription_tiers')
        .delete()
        .eq('id', tier.id)
        .select()

      // RLS will silently filter out the row, so no deletion occurs
      expect(data).toEqual([])
      expect(error).toBeNull()
      
      // Verify tier still exists
      const { data: checkData } = await supabase
        .from('creator_subscription_tiers')
        .select('*')
        .eq('id', tier.id)
        .single()
      
      expect(checkData).toBeDefined()
      expect(checkData.id).toBe(tier.id)
    })

    test('anyone can view active tiers', async () => {
      // Create an active tier
      await insertTestTier(supabase,
        createTestTier(testCreatorId, {
          tier_name: 'Public Tier',
          is_active: true
        })
      )

      // Other creator should be able to view it
      const { data, error } = await otherCreatorClient
        .from('creator_subscription_tiers')
        .select('*')
        .eq('creator_id', testCreatorId)
        .eq('is_active', true)

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data[0].tier_name).toBe('Public Tier')
    })
  })

  describe('Validation and Constraints', () => {
    test('tier name must be unique per creator', async () => {
      // Create first tier
      await insertTestTier(supabase,
        createTestTier(testCreatorId, { tier_name: 'Unique Name' })
      )

      // Try to create another with same name
      const { error } = await creatorClient
        .from('creator_subscription_tiers')
        .insert(createTestTier(testCreatorId, { tier_name: 'Unique Name' }))
        .select()

      expect(error).not.toBeNull()
      expect(error.message).toContain('duplicate')
    })

    test('price cannot be negative', async () => {
      const { error } = await creatorClient
        .from('creator_subscription_tiers')
        .insert(createTestTier(testCreatorId, { price: -10 }))
        .select()

      expect(error).not.toBeNull()
    })

    test('different creators can have tiers with same name', async () => {
      // Create tier for first creator
      await insertTestTier(supabase,
        createTestTier(testCreatorId, { tier_name: 'Premium' })
      )

      // Create tier with same name for other creator
      const { data, error } = await supabase
        .from('creator_subscription_tiers')
        .insert(createTestTier(otherCreatorId, { tier_name: 'Premium' }))
        .select()
        .single()

      expect(error).toBeNull()
      expect(data.tier_name).toBe('Premium')
    })
  })

  describe('Querying and Filtering', () => {
    test('can query all tiers for a creator', async () => {
      const tiers = createTestTiers(testCreatorId)
      await insertTestTiers(supabase, tiers)

      const { data, error } = await creatorClient
        .from('creator_subscription_tiers')
        .select('*')
        .eq('creator_id', testCreatorId)
        .order('price', { ascending: true })

      expect(error).toBeNull()
      expect(data).toHaveLength(3)
      expect(data[0].price).toBe(10)
      expect(data[2].price).toBe(50)
    })

    test('can filter by price range', async () => {
      await insertTestTiers(supabase, createTestTiers(testCreatorId))

      const { data, error } = await creatorClient
        .from('creator_subscription_tiers')
        .select('*')
        .eq('creator_id', testCreatorId)
        .gte('price', 20)
        .lte('price', 30)

      expect(error).toBeNull()
      expect(data).toHaveLength(1)
      expect(data[0].tier_name).toBe('Silver')
    })

    test('can filter by tier features', async () => {
      await insertTestTiers(supabase, createTestTiers(testCreatorId))

      const { data, error } = await creatorClient
        .from('creator_subscription_tiers')
        .select('*')
        .eq('creator_id', testCreatorId)
        .eq('ad_free', true)

      expect(error).toBeNull()
      expect(data).toHaveLength(2) // Silver and Gold tiers
      expect(data.every(t => t.ad_free)).toBe(true)
    })
  })
})