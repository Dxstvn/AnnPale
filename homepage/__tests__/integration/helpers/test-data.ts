import { SupabaseClient } from '@supabase/supabase-js'

// Tier types based on actual database schema
export interface SubscriptionTier {
  id?: string
  creator_id: string
  tier_name: string
  tier_type?: 'basic' | 'premium' | 'vip'
  price: number
  billing_period?: 'monthly' | 'yearly'
  benefits: any  // JSONB in database
  ad_free?: boolean
  exclusive_content?: boolean
  priority_chat?: boolean
  vod_access?: boolean
  max_quality?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

// Factory function to create test tier data
export function createTestTier(
  creatorId: string,
  overrides?: Partial<SubscriptionTier>
): SubscriptionTier {
  return {
    creator_id: creatorId,
    tier_name: overrides?.tier_name || 'Test Tier',
    tier_type: overrides?.tier_type || 'basic',
    price: overrides?.price ?? 10.00,
    billing_period: overrides?.billing_period || 'monthly',
    benefits: overrides?.benefits || ['Basic access'],
    ad_free: overrides?.ad_free ?? false,
    exclusive_content: overrides?.exclusive_content ?? false,
    priority_chat: overrides?.priority_chat ?? false,
    vod_access: overrides?.vod_access ?? false,
    max_quality: overrides?.max_quality || '720p',
    is_active: overrides?.is_active ?? true,
    ...overrides
  }
}

// Create multiple test tiers
export function createTestTiers(creatorId: string): SubscriptionTier[] {
  return [
    createTestTier(creatorId, {
      tier_name: 'Bronze',
      tier_type: 'basic',
      price: 10.00,
      benefits: ['Access to exclusive posts', 'Monthly newsletter'],
      max_quality: '720p'
    }),
    createTestTier(creatorId, {
      tier_name: 'Silver',
      tier_type: 'premium',
      price: 25.00,
      benefits: ['All Bronze perks', 'Exclusive content', 'Priority responses'],
      ad_free: true,
      exclusive_content: true,
      max_quality: '1080p'
    }),
    createTestTier(creatorId, {
      tier_name: 'Gold',
      tier_type: 'vip',
      price: 50.00,
      benefits: ['All Silver perks', 'Monthly video call', 'Custom requests'],
      ad_free: true,
      exclusive_content: true,
      priority_chat: true,
      vod_access: true,
      max_quality: '4k'
    })
  ]
}

// Helper to insert tier into database
export async function insertTestTier(
  supabase: SupabaseClient,
  tier: SubscriptionTier
) {
  const { data, error } = await supabase
    .from('creator_subscription_tiers')
    .insert(tier)
    .select()
    .single()
  
  if (error) {
    throw new Error(`Failed to insert tier: ${error.message}`)
  }
  
  return data
}

// Helper to insert multiple tiers
export async function insertTestTiers(
  supabase: SupabaseClient,
  tiers: SubscriptionTier[]
) {
  const { data, error } = await supabase
    .from('creator_subscription_tiers')
    .insert(tiers)
    .select()
  
  if (error) {
    throw new Error(`Failed to insert tiers: ${error.message}`)
  }
  
  return data
}

// Create test order data
export function createTestOrder(fanId: string, creatorId: string) {
  return {
    fan_id: fanId,
    creator_id: creatorId,
    status: 'pending',
    price: 50.00,
    message: 'Test order message',
    occasion: 'birthday',
    recipient_name: 'Test Recipient',
    delivery_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
  }
}

// Create test earnings data
export function createTestEarnings(creatorId: string, amount: number) {
  return {
    creator_id: creatorId,
    amount,
    type: 'video_request',
    status: 'completed',
    description: 'Test video request payment'
  }
}