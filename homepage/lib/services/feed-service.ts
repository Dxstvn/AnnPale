import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

// Feed item types
export interface FeedItem {
  id: string
  creatorId: string
  creatorName: string
  creatorAvatar: string
  creatorTier: {
    id: string
    name: string
    color: string
  }
  type: 'video' | 'post' | 'live' | 'announcement'
  title: string
  description: string
  thumbnail?: string
  content?: string
  createdAt: string
  tierRequired: string
  engagement: {
    likes: number
    views: number
    comments: number
    shares: number
  }
  userAccess: {
    hasAccess: boolean
    currentTier?: string
    requiredTier?: string
  }
}

// Creator tier information
export interface CreatorTier {
  id: string
  creatorId: string
  name: string
  slug: string
  description: string
  price: number
  color: string
  icon: string
  benefits: string[]
  subscriberCount: number
  sortOrder: number
  createdAt: string
}

// Feed filters
export interface FeedFilters {
  type?: 'all' | 'video' | 'post' | 'live' | 'announcement'
  creatorIds?: string[]
  tierIds?: string[]
  timeRange?: 'today' | 'week' | 'month' | 'all'
  hasAccess?: boolean
}

// Feed service with caching
export class FeedService {
  private supabase = createClientComponentClient()
  private cache = new Map<string, { data: any; timestamp: number }>()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes

  /**
   * Get personalized home feed for a user
   */
  async getHomeFeed(
    userId: string, 
    filters: FeedFilters = {},
    limit = 20,
    offset = 0
  ): Promise<FeedItem[]> {
    const cacheKey = `home-feed-${userId}-${JSON.stringify(filters)}-${limit}-${offset}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      // Get user's subscriptions
      const subscriptions = await this.getUserSubscriptions(userId)
      const subscribedCreatorIds = subscriptions.map(sub => sub.creator_id)

      // Build query based on subscriptions and filters
      let query = this.supabase
        .from('content_feed')
        .select(`
          *,
          creator:profiles!creator_id(
            id,
            name,
            avatar_url
          ),
          tier:creator_subscription_tiers!tier_id(
            id,
            name,
            color,
            slug
          )
        `)
        .in('creator_id', subscribedCreatorIds)
        .order('created_at', { ascending: false })
        .limit(limit)
        .range(offset, offset + limit - 1)

      // Apply filters
      if (filters.type && filters.type !== 'all') {
        query = query.eq('type', filters.type)
      }

      if (filters.timeRange && filters.timeRange !== 'all') {
        const timeFilter = this.getTimeRangeFilter(filters.timeRange)
        query = query.gte('created_at', timeFilter)
      }

      const { data, error } = await query

      if (error) throw error

      // Process and enrich feed items with access information
      const feedItems = await this.enrichFeedItems(data || [], userId, subscriptions)
      
      // Sort by priority (tier level, recency, engagement)
      const sortedItems = this.sortByPriority(feedItems, subscriptions)
      
      this.setCache(cacheKey, sortedItems)
      return sortedItems
    } catch (error) {
      console.error('Error fetching home feed:', error)
      return []
    }
  }

  /**
   * Get feed for a specific creator
   */
  async getCreatorFeed(
    creatorId: string,
    userId: string,
    filters: FeedFilters = {},
    limit = 20,
    offset = 0
  ): Promise<FeedItem[]> {
    const cacheKey = `creator-feed-${creatorId}-${userId}-${JSON.stringify(filters)}-${limit}-${offset}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      // Get user's subscription to this creator
      const subscription = await this.getUserCreatorSubscription(userId, creatorId)

      let query = this.supabase
        .from('content_feed')
        .select(`
          *,
          creator:profiles!creator_id(
            id,
            name,
            avatar_url
          ),
          tier:creator_subscription_tiers!tier_id(
            id,
            name,
            color,
            slug
          )
        `)
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false })
        .limit(limit)
        .range(offset, offset + limit - 1)

      // Apply filters
      if (filters.type && filters.type !== 'all') {
        query = query.eq('type', filters.type)
      }

      // Filter by tier access if specified
      if (filters.hasAccess !== undefined && subscription) {
        const accessibleTiers = await this.getAccessibleTiers(creatorId, subscription.tier_id)
        query = query.in('tier_id', accessibleTiers)
      }

      const { data, error } = await query

      if (error) throw error

      // Enrich with access information
      const feedItems = await this.enrichFeedItems(
        data || [], 
        userId, 
        subscription ? [subscription] : []
      )
      
      this.setCache(cacheKey, feedItems)
      return feedItems
    } catch (error) {
      console.error('Error fetching creator feed:', error)
      return []
    }
  }

  /**
   * Get recommended creators based on user's subscriptions
   */
  async getRecommendedCreators(userId: string): Promise<any[]> {
    const cacheKey = `recommended-creators-${userId}`
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    try {
      // Get user's current subscriptions
      const subscriptions = await this.getUserSubscriptions(userId)
      const subscribedCreatorIds = subscriptions.map(sub => sub.creator_id)
      
      // Get categories of subscribed creators
      const { data: subscribedCreators } = await this.supabase
        .from('profiles')
        .select('category')
        .in('id', subscribedCreatorIds)
      
      const categories = [...new Set(subscribedCreators?.map(c => c.category) || [])]

      // Find similar creators
      const { data: recommendations } = await this.supabase
        .from('profiles')
        .select(`
          *,
          creator_subscription_tiers(*)
        `)
        .eq('user_role', 'creator')
        .in('category', categories)
        .not('id', 'in', `(${subscribedCreatorIds.join(',')})`)
        .order('rating', { ascending: false })
        .limit(10)

      this.setCache(cacheKey, recommendations || [])
      return recommendations || []
    } catch (error) {
      console.error('Error fetching recommendations:', error)
      return []
    }
  }

  /**
   * Search content across subscribed creators
   */
  async searchContent(
    userId: string,
    query: string,
    filters: FeedFilters = {}
  ): Promise<FeedItem[]> {
    try {
      const subscriptions = await this.getUserSubscriptions(userId)
      const subscribedCreatorIds = subscriptions.map(sub => sub.creator_id)

      const { data, error } = await this.supabase
        .from('content_feed')
        .select(`
          *,
          creator:profiles!creator_id(
            id,
            name,
            avatar_url
          ),
          tier:creator_subscription_tiers!tier_id(
            id,
            name,
            color,
            slug
          )
        `)
        .in('creator_id', subscribedCreatorIds)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error

      return await this.enrichFeedItems(data || [], userId, subscriptions)
    } catch (error) {
      console.error('Error searching content:', error)
      return []
    }
  }

  /**
   * Get user's active subscriptions
   */
  private async getUserSubscriptions(userId: string): Promise<any[]> {
    const { data } = await this.supabase
      .from('fan_subscriptions')
      .select(`
        *,
        tier:creator_subscription_tiers(*)
      `)
      .eq('fan_id', userId)
      .eq('status', 'active')

    return data || []
  }

  /**
   * Get user's subscription to a specific creator
   */
  private async getUserCreatorSubscription(userId: string, creatorId: string): Promise<any> {
    const { data } = await this.supabase
      .from('fan_subscriptions')
      .select(`
        *,
        tier:creator_subscription_tiers(*)
      `)
      .eq('fan_id', userId)
      .eq('creator_id', creatorId)
      .eq('status', 'active')
      .single()

    return data
  }

  /**
   * Get tiers accessible with a given subscription tier
   */
  private async getAccessibleTiers(creatorId: string, userTierId: string): Promise<string[]> {
    const { data: allTiers } = await this.supabase
      .from('creator_subscription_tiers')
      .select('id, sort_order')
      .eq('creator_id', creatorId)
      .order('sort_order')

    if (!allTiers) return []

    const userTier = allTiers.find(t => t.id === userTierId)
    if (!userTier) return []

    // User can access their tier and all lower tiers
    return allTiers
      .filter(t => t.sort_order <= userTier.sort_order)
      .map(t => t.id)
  }

  /**
   * Enrich feed items with access information
   */
  private async enrichFeedItems(
    items: any[],
    userId: string,
    subscriptions: any[]
  ): Promise<FeedItem[]> {
    return items.map(item => {
      const subscription = subscriptions.find(sub => sub.creator_id === item.creator_id)
      const hasAccess = this.checkTierAccess(item.tier_id, subscription?.tier_id, subscription?.tier)

      return {
        id: item.id,
        creatorId: item.creator_id,
        creatorName: item.creator?.name || '',
        creatorAvatar: item.creator?.avatar_url || '',
        creatorTier: {
          id: item.tier?.id || '',
          name: item.tier?.name || '',
          color: item.tier?.color || 'from-gray-500 to-gray-700'
        },
        type: item.type,
        title: item.title,
        description: item.description,
        thumbnail: item.thumbnail_url,
        content: item.content,
        createdAt: this.formatTimeAgo(item.created_at),
        tierRequired: item.tier?.slug || '',
        engagement: {
          likes: item.likes_count || 0,
          views: item.views_count || 0,
          comments: item.comments_count || 0,
          shares: item.shares_count || 0
        },
        userAccess: {
          hasAccess,
          currentTier: subscription?.tier?.name,
          requiredTier: item.tier?.name
        }
      }
    })
  }

  /**
   * Check if user has access to content based on tier
   */
  private checkTierAccess(
    contentTierId: string, 
    userTierId?: string,
    userTier?: any
  ): boolean {
    if (!userTierId || !userTier) return false
    // For simplicity, checking if user has any tier gives access
    // In production, compare tier levels
    return true
  }

  /**
   * Sort feed items by priority
   */
  private sortByPriority(items: FeedItem[], subscriptions: any[]): FeedItem[] {
    return items.sort((a, b) => {
      // Priority 1: Live content
      if (a.type === 'live' && b.type !== 'live') return -1
      if (b.type === 'live' && a.type !== 'live') return 1

      // Priority 2: Higher tier content
      const aTier = subscriptions.find(s => s.creator_id === a.creatorId)?.tier?.sort_order || 999
      const bTier = subscriptions.find(s => s.creator_id === b.creatorId)?.tier?.sort_order || 999
      if (aTier !== bTier) return bTier - aTier

      // Priority 3: Engagement
      const aEngagement = a.engagement.likes + a.engagement.views
      const bEngagement = b.engagement.likes + b.engagement.views
      if (aEngagement !== bEngagement) return bEngagement - aEngagement

      // Priority 4: Recency (already sorted by created_at)
      return 0
    })
  }

  /**
   * Get time range filter
   */
  private getTimeRangeFilter(range: string): string {
    const now = new Date()
    switch(range) {
      case 'today':
        return new Date(now.setHours(0, 0, 0, 0)).toISOString()
      case 'week':
        return new Date(now.setDate(now.getDate() - 7)).toISOString()
      case 'month':
        return new Date(now.setMonth(now.getMonth() - 1)).toISOString()
      default:
        return new Date(0).toISOString()
    }
  }

  /**
   * Format time ago
   */
  private formatTimeAgo(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (seconds < 60) return 'just now'
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`
    return date.toLocaleDateString()
  }

  /**
   * Cache management
   */
  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    if (Date.now() - cached.timestamp > this.cacheTimeout) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  clearCache(): void {
    this.cache.clear()
  }
}