import { useState, useEffect, useCallback } from 'react'
import useSWR, { mutate } from 'swr'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useSupabaseAuth } from '@/contexts/supabase-auth-context'
import type { 
  CreatorSubscriptionTier, 
  FanSubscription,
  SubscriptionStatus 
} from '@/lib/types/livestream'

// SWR fetcher
const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch')
  return res.json()
}

/**
 * Hook to manage user's active subscriptions
 */
export function useSubscriptions() {
  const { user } = useSupabaseAuth()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Fetch user's subscriptions with SWR
  const { data: subscriptions, error: fetchError, mutate: refreshSubscriptions } = useSWR<FanSubscription[]>(
    user ? `/api/subscriptions/user/${user.id}` : null,
    async () => {
      const { data, error } = await supabase
        .from('fan_subscriptions')
        .select(`
          *,
          tier:creator_subscription_tiers(*),
          creator:profiles!creator_id(
            id,
            name,
            avatar_url
          )
        `)
        .eq('fan_id', user?.id)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (error) throw error
      return data as FanSubscription[]
    },
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 5 * 60 * 1000, // 5 minutes
    }
  )

  // Subscribe to a creator's tier
  const subscribe = useCallback(async (creatorId: string, tierId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Check if already subscribed
      const existing = await supabase
        .from('fan_subscriptions')
        .select('id')
        .eq('fan_id', user?.id)
        .eq('creator_id', creatorId)
        .single()

      if (existing.data) {
        // Update existing subscription
        const { error } = await supabase
          .from('fan_subscriptions')
          .update({
            tier_id: tierId,
            status: 'active' as SubscriptionStatus,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.data.id)

        if (error) throw error
      } else {
        // Create new subscription
        const { error } = await supabase
          .from('fan_subscriptions')
          .insert({
            fan_id: user?.id,
            creator_id: creatorId,
            tier_id: tierId,
            status: 'active' as SubscriptionStatus,
            start_date: new Date().toISOString(),
            auto_renew: true
          })

        if (error) throw error
      }

      // Refresh subscriptions
      await refreshSubscriptions()
      return true
    } catch (err) {
      setError(err as Error)
      return false
    } finally {
      setLoading(false)
    }
  }, [user, supabase, refreshSubscriptions])

  // Unsubscribe from a creator
  const unsubscribe = useCallback(async (subscriptionId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase
        .from('fan_subscriptions')
        .update({
          status: 'cancelled' as SubscriptionStatus,
          end_date: new Date().toISOString(),
          auto_renew: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId)

      if (error) throw error

      // Refresh subscriptions
      await refreshSubscriptions()
      return true
    } catch (err) {
      setError(err as Error)
      return false
    } finally {
      setLoading(false)
    }
  }, [supabase, refreshSubscriptions])

  // Upgrade/downgrade subscription tier
  const changeTier = useCallback(async (subscriptionId: string, newTierId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { error } = await supabase
        .from('fan_subscriptions')
        .update({
          tier_id: newTierId,
          updated_at: new Date().toISOString()
        })
        .eq('id', subscriptionId)

      if (error) throw error

      // Refresh subscriptions
      await refreshSubscriptions()
      return true
    } catch (err) {
      setError(err as Error)
      return false
    } finally {
      setLoading(false)
    }
  }, [supabase, refreshSubscriptions])

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('subscriptions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'fan_subscriptions',
          filter: `fan_id=eq.${user.id}`
        },
        () => {
          refreshSubscriptions()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user, supabase, refreshSubscriptions])

  return {
    subscriptions: subscriptions || [],
    loading: loading || (!subscriptions && !fetchError),
    error: error || fetchError,
    subscribe,
    unsubscribe,
    changeTier,
    refresh: refreshSubscriptions
  }
}

/**
 * Hook to get creator's custom tiers
 */
export function useCreatorTiers(creatorId: string | undefined) {
  const supabase = createClientComponentClient()
  
  const { data: tiers, error, mutate: refreshTiers } = useSWR<CreatorSubscriptionTier[]>(
    creatorId ? `/api/creator/${creatorId}/tiers` : null,
    async () => {
      const { data, error } = await supabase
        .from('creator_subscription_tiers')
        .select('*')
        .eq('creator_id', creatorId)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) throw error
      
      // Add subscriber count for each tier
      const tiersWithCounts = await Promise.all(
        (data || []).map(async (tier) => {
          const { count } = await supabase
            .from('fan_subscriptions')
            .select('id', { count: 'exact', head: true })
            .eq('tier_id', tier.id)
            .eq('status', 'active')

          return {
            ...tier,
            subscriber_count: count || 0
          }
        })
      )
      
      return tiersWithCounts as CreatorSubscriptionTier[]
    },
    {
      revalidateOnFocus: false,
      refreshInterval: 30 * 1000, // 30 seconds for tier updates
    }
  )

  return {
    tiers: tiers || [],
    loading: !tiers && !error,
    error,
    refresh: refreshTiers
  }
}

/**
 * Hook to check specific subscription status
 */
export function useSubscriptionStatus(creatorId: string | undefined, userId: string | undefined) {
  const supabase = createClientComponentClient()
  
  const { data: subscription, error } = useSWR<FanSubscription | null>(
    creatorId && userId ? `/api/subscription/${userId}/${creatorId}` : null,
    async () => {
      const { data, error } = await supabase
        .from('fan_subscriptions')
        .select(`
          *,
          tier:creator_subscription_tiers(*)
        `)
        .eq('fan_id', userId)
        .eq('creator_id', creatorId)
        .eq('status', 'active')
        .single()

      if (error && error.code !== 'PGRST116') throw error // Ignore not found errors
      return data as FanSubscription | null
    },
    {
      revalidateOnFocus: true,
      refreshInterval: 60 * 1000, // 1 minute
    }
  )

  const hasAccess = useCallback((requiredTierOrder?: number) => {
    if (!subscription || !subscription.tier) return false
    if (!requiredTierOrder) return true
    
    // Check if user's tier level is equal or higher
    return (subscription.tier.sort_order || 999) <= requiredTierOrder
  }, [subscription])

  return {
    subscription,
    isSubscribed: !!subscription,
    currentTier: subscription?.tier,
    hasAccess,
    loading: !subscription && !error,
    error
  }
}

/**
 * Hook for creators to manage their tiers
 */
export function useCreatorTierManagement() {
  const { user } = useSupabaseAuth()
  const supabase = createClientComponentClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  
  const { tiers, refresh: refreshTiers } = useCreatorTiers(user?.id)

  // Create a new tier
  const createTier = useCallback(async (tier: Partial<CreatorSubscriptionTier>) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('creator_subscription_tiers')
        .insert({
          ...tier,
          creator_id: user?.id,
          is_active: true
        })
        .select()
        .single()

      if (error) throw error

      await refreshTiers()
      return data
    } catch (err) {
      setError(err as Error)
      return null
    } finally {
      setLoading(false)
    }
  }, [user, supabase, refreshTiers])

  // Update an existing tier
  const updateTier = useCallback(async (tierId: string, updates: Partial<CreatorSubscriptionTier>) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase
        .from('creator_subscription_tiers')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', tierId)
        .eq('creator_id', user?.id)
        .select()
        .single()

      if (error) throw error

      await refreshTiers()
      return data
    } catch (err) {
      setError(err as Error)
      return null
    } finally {
      setLoading(false)
    }
  }, [user, supabase, refreshTiers])

  // Delete a tier
  const deleteTier = useCallback(async (tierId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      // Check if tier has active subscribers
      const { count } = await supabase
        .from('fan_subscriptions')
        .select('id', { count: 'exact', head: true })
        .eq('tier_id', tierId)
        .eq('status', 'active')

      if (count && count > 0) {
        throw new Error('Cannot delete tier with active subscribers')
      }

      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from('creator_subscription_tiers')
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', tierId)
        .eq('creator_id', user?.id)

      if (error) throw error

      await refreshTiers()
      return true
    } catch (err) {
      setError(err as Error)
      return false
    } finally {
      setLoading(false)
    }
  }, [user, supabase, refreshTiers])

  // Reorder tiers
  const reorderTiers = useCallback(async (tierOrders: { id: string; sort_order: number }[]) => {
    setLoading(true)
    setError(null)
    
    try {
      // Update sort order for each tier
      await Promise.all(
        tierOrders.map(({ id, sort_order }) =>
          supabase
            .from('creator_subscription_tiers')
            .update({
              sort_order,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('creator_id', user?.id)
        )
      )

      await refreshTiers()
      return true
    } catch (err) {
      setError(err as Error)
      return false
    } finally {
      setLoading(false)
    }
  }, [user, supabase, refreshTiers])

  return {
    tiers,
    loading,
    error,
    createTier,
    updateTier,
    deleteTier,
    reorderTiers,
    refresh: refreshTiers
  }
}