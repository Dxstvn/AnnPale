'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { TrendingCreator } from '@/components/explore/TrendingCreators'

export function useTrendingCreators() {
  const [trending, setTrending] = useState<TrendingCreator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  const supabase = createClient()

  useEffect(() => {
    async function fetchTrending() {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch creators with recent activity
        // In production, this would be based on real engagement metrics
        const { data, error: queryError } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'creator')
          .eq('verified', true)
          .order('updated_at', { ascending: false })
          .limit(10)

        if (queryError) throw queryError

        // Transform to TrendingCreator format
        const transformedTrending: TrendingCreator[] = (data || []).map((profile, index) => ({
          id: profile.id,
          name: profile.display_name || profile.name,
          username: profile.username || profile.email?.split('@')[0] || 'user',
          category: profile.category || 'creator',
          avatar_url: profile.avatar_url,
          verified: profile.verified || profile.public_figure_verified || false,
          isLive: Math.random() > 0.7, // Mock live status
          trendingRank: index + 1,
          subscriberCount: profile.follower_count || Math.floor(Math.random() * 50000) + 1000,
          recentActivity: generateRecentActivity(profile.category)
        }))

        setTrending(transformedTrending)
      } catch (err) {
        console.error('Error fetching trending creators:', err)
        setError(err as Error)
        
        // Fallback to mock data for demo
        setTrending(generateMockTrending())
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrending()
    
    // Set up real-time subscription for live updates
    const subscription = supabase
      .channel('trending-creators')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'profiles',
        filter: 'role=eq.creator'
      }, () => {
        // Refresh trending on any creator profile change
        fetchTrending()
      })
      .subscribe()

    // Refresh every 30 seconds for demo purposes
    const interval = setInterval(fetchTrending, 30000)

    return () => {
      subscription.unsubscribe()
      clearInterval(interval)
    }
  }, [])

  return {
    trending,
    isLoading,
    error
  }
}

function generateRecentActivity(category?: string): string {
  const activities = {
    music: [
      'Released new single',
      'Live performance tonight',
      'Studio session updates',
      'New music video out'
    ],
    comedy: [
      'New comedy sketch',
      'Stand-up show tonight',
      'Funny video posted',
      'Comedy special announcement'
    ],
    media: [
      'Breaking news coverage',
      'Interview with special guest',
      'New podcast episode',
      'Media appearance today'
    ],
    default: [
      'Posted new content',
      'Interacting with fans',
      'Special announcement',
      'New update available'
    ]
  }
  
  const categoryActivities = activities[category as keyof typeof activities] || activities.default
  return categoryActivities[Math.floor(Math.random() * categoryActivities.length)]
}

function generateMockTrending(): TrendingCreator[] {
  return [
    {
      id: '1',
      name: 'Wyclef Jean',
      username: 'wyclef',
      category: 'Music',
      verified: true,
      isLive: true,
      trendingRank: 1,
      subscriberCount: 125000,
      recentActivity: 'Live performance tonight at 8PM ET'
    },
    {
      id: '2',
      name: 'Ti Jo Zenny',
      username: 'tijozenny',
      category: 'Entertainment',
      verified: true,
      isLive: false,
      trendingRank: 2,
      subscriberCount: 89000,
      recentActivity: 'New comedy special announcement'
    },
    {
      id: '3',
      name: 'Carel Pedre',
      username: 'carelpedre',
      category: 'Media',
      verified: true,
      isLive: true,
      trendingRank: 3,
      subscriberCount: 76000,
      recentActivity: 'Breaking news coverage on Chokarella'
    },
    {
      id: '4',
      name: 'Richard Cavé',
      username: 'richardcave',
      category: 'Music',
      verified: true,
      isLive: false,
      trendingRank: 4,
      subscriberCount: 68000,
      recentActivity: 'New KAÏ album drops tomorrow'
    },
    {
      id: '5',
      name: 'Michael Brun',
      username: 'michaelbrun',
      category: 'Music',
      verified: true,
      isLive: false,
      trendingRank: 5,
      subscriberCount: 95000,
      recentActivity: 'DJ set at Ultra Music Festival'
    }
  ]
}