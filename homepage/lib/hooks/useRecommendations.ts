'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { CreatorPreview } from '@/components/explore/CreatorPreviewCard'

export function useRecommendations(userId?: string) {
  const [recommendations, setRecommendations] = useState<CreatorPreview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    async function fetchRecommendations() {
      if (!userId) {
        setRecommendations([])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // First, get user's current subscriptions to exclude them
        const { data: subscriptions } = await supabase
          .from('fan_subscriptions')
          .select('creator_id')
          .eq('fan_id', userId)
          .eq('status', 'active')

        const subscribedCreatorIds = subscriptions?.map(s => s.creator_id) || []

        // Get user's preferred categories from their subscription history
        const { data: subscriptionProfiles } = await supabase
          .from('profiles')
          .select('category')
          .in('id', subscribedCreatorIds)

        const preferredCategories = [...new Set(subscriptionProfiles?.map(p => p.category).filter(Boolean))]

        // Build recommendation query
        let query = supabase
          .from('profiles')
          .select('*')
          .eq('role', 'creator')
          .eq('verified', true)
          .order('rating', { ascending: false })
          .limit(8)

        // Exclude already subscribed creators
        if (subscribedCreatorIds.length > 0) {
          query = query.not('id', 'in', `(${subscribedCreatorIds.join(',')})`)
        }

        // Prioritize creators in user's preferred categories
        if (preferredCategories.length > 0) {
          query = query.in('category', preferredCategories)
        }

        const { data, error: queryError } = await query

        if (queryError) throw queryError

        // Transform to CreatorPreview format
        const transformedRecommendations: CreatorPreview[] = (data || []).map(profile => ({
          id: profile.id,
          name: profile.name,
          username: profile.username || profile.email?.split('@')[0] || 'user',
          display_name: profile.display_name || profile.name,
          avatar_url: profile.avatar_url,
          cover_image: profile.cover_image_url,
          bio: profile.bio,
          category: profile.category || 'creator',
          subcategory: profile.subcategory,
          verified: profile.verified || profile.public_figure_verified || false,
          price_video_message: profile.price_video_message || 50,
          rating: profile.rating,
          total_reviews: profile.total_reviews,
          subscriber_count: profile.follower_count,
          response_time: profile.response_time,
          languages: profile.languages || ['English'],
          is_subscribed: false,
          is_online: false,
          is_demo: profile.is_demo_account || false
        }))

        setRecommendations(transformedRecommendations)
      } catch (err) {
        console.error('Error fetching recommendations:', err)
        setError(err as Error)
        
        // Fallback to showing popular creators
        try {
          const { data: popularCreators } = await supabase
            .from('profiles')
            .select('*')
            .eq('role', 'creator')
            .eq('verified', true)
            .order('total_reviews', { ascending: false })
            .limit(8)

          const fallbackRecommendations: CreatorPreview[] = (popularCreators || []).map(profile => ({
            id: profile.id,
            name: profile.name,
            username: profile.username || profile.email?.split('@')[0] || 'user',
            display_name: profile.display_name || profile.name,
            avatar_url: profile.avatar_url,
            cover_image: profile.cover_image_url,
            bio: profile.bio,
            category: profile.category || 'creator',
            subcategory: profile.subcategory,
            verified: profile.verified || profile.public_figure_verified || false,
            price_video_message: profile.price_video_message || 50,
            rating: profile.rating,
            total_reviews: profile.total_reviews,
            subscriber_count: profile.follower_count,
            response_time: profile.response_time,
            languages: profile.languages || ['English'],
            is_subscribed: false,
            is_online: false,
            is_demo: profile.is_demo_account || false
          }))

          setRecommendations(fallbackRecommendations)
        } catch (fallbackError) {
          console.error('Error fetching fallback recommendations:', fallbackError)
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchRecommendations()
  }, [userId])

  return {
    recommendations,
    isLoading,
    error
  }
}