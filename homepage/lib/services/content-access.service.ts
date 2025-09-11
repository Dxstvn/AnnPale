import { createClient } from '@/lib/supabase/server'
import { SupabaseClient } from '@supabase/supabase-js'

interface ContentAccessResult {
  hasAccess: boolean
  reason?: 'not_authenticated' | 'no_subscription' | 'subscription_expired' | 'tier_mismatch' | 'public_content'
  subscription?: any
}

export class ContentAccessService {
  private supabase: SupabaseClient

  constructor(supabase?: SupabaseClient) {
    this.supabase = supabase || createClient()
  }

  /**
   * Check if a user has access to a specific post
   */
  async checkPostAccess(postId: string, userId?: string): Promise<ContentAccessResult> {
    try {
      // Fetch post details
      const { data: post, error: postError } = await this.supabase
        .from('posts')
        .select('*, creator:profiles!posts_creator_id_fkey(*)')
        .eq('id', postId)
        .single()

      if (postError || !post) {
        return { hasAccess: false, reason: 'public_content' }
      }

      // Check if post is public
      if (post.is_public) {
        return { hasAccess: true, reason: 'public_content' }
      }

      // Check if it's a preview post
      if (post.is_preview) {
        return { hasAccess: true, reason: 'public_content' }
      }

      // If no user, deny access
      if (!userId) {
        return { hasAccess: false, reason: 'not_authenticated' }
      }

      // Check if user is the creator (creators have access to their own content)
      if (post.creator_id === userId) {
        return { hasAccess: true, reason: 'public_content' }
      }

      // Check if post requires a specific tier
      if (post.tier_required) {
        const { data: subscription } = await this.supabase
          .from('subscription_orders')
          .select('*, subscription_tiers(*)')
          .eq('fan_id', userId)
          .eq('creator_id', post.creator_id)
          .eq('tier_id', post.tier_required)
          .in('status', ['active', 'trialing'])
          .single()

        if (subscription) {
          return { hasAccess: true, subscription }
        }

        return { hasAccess: false, reason: 'tier_mismatch' }
      }

      // Check if user has any active subscription to this creator
      const { data: subscription } = await this.supabase
        .from('subscription_orders')
        .select('*, subscription_tiers(*)')
        .eq('fan_id', userId)
        .eq('creator_id', post.creator_id)
        .in('status', ['active', 'trialing'])
        .limit(1)
        .single()

      if (subscription) {
        return { hasAccess: true, subscription }
      }

      return { hasAccess: false, reason: 'no_subscription' }
    } catch (error) {
      console.error('Error checking post access:', error)
      return { hasAccess: false, reason: 'no_subscription' }
    }
  }

  /**
   * Check if a user has access to a creator's content
   */
  async checkCreatorAccess(creatorId: string, userId?: string): Promise<ContentAccessResult> {
    // If no user, deny access
    if (!userId) {
      return { hasAccess: false, reason: 'not_authenticated' }
    }

    // Check if user is the creator
    if (creatorId === userId) {
      return { hasAccess: true, reason: 'public_content' }
    }

    try {
      // Check for active subscription
      const { data: subscription, error } = await this.supabase
        .from('subscription_orders')
        .select('*, subscription_tiers(*)')
        .eq('fan_id', userId)
        .eq('creator_id', creatorId)
        .in('status', ['active', 'trialing'])
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error checking creator access:', error)
        return { hasAccess: false, reason: 'no_subscription' }
      }

      if (subscription) {
        // Check if subscription is not expired
        if (subscription.current_period_end) {
          const endDate = new Date(subscription.current_period_end)
          if (endDate < new Date()) {
            return { hasAccess: false, reason: 'subscription_expired' }
          }
        }

        return { hasAccess: true, subscription }
      }

      return { hasAccess: false, reason: 'no_subscription' }
    } catch (error) {
      console.error('Error checking creator access:', error)
      return { hasAccess: false, reason: 'no_subscription' }
    }
  }

  /**
   * Get all accessible content for a user
   */
  async getAccessibleContent(userId: string, creatorId?: string) {
    try {
      // Get user's active subscriptions
      let subscriptionsQuery = this.supabase
        .from('subscription_orders')
        .select('creator_id, tier_id')
        .eq('fan_id', userId)
        .in('status', ['active', 'trialing'])

      if (creatorId) {
        subscriptionsQuery = subscriptionsQuery.eq('creator_id', creatorId)
      }

      const { data: subscriptions } = await subscriptionsQuery

      if (!subscriptions || subscriptions.length === 0) {
        // Return only public and preview content
        let postsQuery = this.supabase
          .from('posts')
          .select('*')
          .or('is_public.eq.true,is_preview.eq.true')
          .order('published_at', { ascending: false })

        if (creatorId) {
          postsQuery = postsQuery.eq('creator_id', creatorId)
        }

        const { data: posts } = await postsQuery
        return posts || []
      }

      // Get content from subscribed creators
      const creatorIds = [...new Set(subscriptions.map(s => s.creator_id))]
      const tierIds = subscriptions.map(s => s.tier_id).filter(Boolean)

      let query = this.supabase
        .from('posts')
        .select('*')
        .order('published_at', { ascending: false })

      if (creatorId) {
        // Specific creator - show their content based on subscription
        query = query
          .eq('creator_id', creatorId)
          .or(`is_public.eq.true,is_preview.eq.true,tier_required.in.(${tierIds.join(',')}),tier_required.is.null`)
      } else {
        // All subscribed creators
        query = query
          .or(`is_public.eq.true,is_preview.eq.true,creator_id.in.(${creatorIds.join(',')})`)
      }

      const { data: posts } = await query
      return posts || []
    } catch (error) {
      console.error('Error getting accessible content:', error)
      return []
    }
  }

  /**
   * Check if content requires subscription
   */
  async requiresSubscription(contentId: string): Promise<boolean> {
    try {
      const { data: content } = await this.supabase
        .from('posts')
        .select('is_public, is_preview, tier_required')
        .eq('id', contentId)
        .single()

      if (!content) return true

      // Public or preview content doesn't require subscription
      if (content.is_public || content.is_preview) {
        return false
      }

      // Content with tier requirement or private content requires subscription
      return true
    } catch (error) {
      console.error('Error checking subscription requirement:', error)
      return true // Default to requiring subscription for safety
    }
  }

  /**
   * Get subscription tiers that grant access to specific content
   */
  async getRequiredTiers(contentId: string): Promise<any[]> {
    try {
      const { data: post } = await this.supabase
        .from('posts')
        .select('creator_id, tier_required')
        .eq('id', contentId)
        .single()

      if (!post) return []

      // If specific tier is required
      if (post.tier_required) {
        const { data: tier } = await this.supabase
          .from('subscription_tiers')
          .select('*')
          .eq('id', post.tier_required)
          .single()

        return tier ? [tier] : []
      }

      // Return all tiers from this creator
      const { data: tiers } = await this.supabase
        .from('subscription_tiers')
        .select('*')
        .eq('creator_id', post.creator_id)
        .eq('is_active', true)
        .order('price', { ascending: true })

      return tiers || []
    } catch (error) {
      console.error('Error getting required tiers:', error)
      return []
    }
  }
}

// Singleton instance
let contentAccessService: ContentAccessService | null = null

export function getContentAccessService(supabase?: SupabaseClient): ContentAccessService {
  if (!contentAccessService) {
    contentAccessService = new ContentAccessService(supabase)
  }
  return contentAccessService
}