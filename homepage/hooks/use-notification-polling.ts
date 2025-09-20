'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'

interface UseNotificationPollingOptions {
  creatorId: string
  pollInterval?: number // in milliseconds, default 30 seconds
  enabled?: boolean
}

export function useNotificationPolling({
  creatorId,
  pollInterval = 30000, // 30 seconds
  enabled = true
}: UseNotificationPollingOptions) {
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch unread count from database
  const fetchUnreadCount = useCallback(async () => {
    if (!creatorId) return

    try {
      // Query for unviewed video requests
      const { count, error } = await supabase
        .from('video_requests')
        .select('*', { count: 'exact', head: true })
        .eq('creator_id', creatorId)
        .eq('status', 'pending')
        .filter('viewed_at', 'is', null)

      if (!error && count !== null) {
        setUnreadCount(count)
      } else if (error) {
        // Handle any database errors gracefully
        console.error('Error fetching unread video requests:', error)
        setUnreadCount(0)
      }
    } catch (err) {
      console.error('Error in fetchUnreadCount:', err)
      setUnreadCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [creatorId, supabase])

  // Mark requests as viewed
  const markAsViewed = useCallback(async () => {
    if (!creatorId) return

    try {
      const { error } = await supabase
        .from('video_requests')
        .update({ viewed_at: new Date().toISOString() })
        .eq('creator_id', creatorId)
        .eq('status', 'pending')
        .filter('viewed_at', 'is', null)

      if (error) {
        console.error('Error marking video requests as viewed:', error)
      } else {
        // Reset count after marking as viewed
        setUnreadCount(0)
      }
    } catch (err) {
      console.error('Error in markAsViewed:', err)
    }
  }, [creatorId, supabase])

  // Set up polling
  useEffect(() => {
    if (!enabled || !creatorId) {
      setIsLoading(false)
      return
    }

    // Initial fetch
    fetchUnreadCount()

    // Set up interval for polling
    intervalRef.current = setInterval(() => {
      fetchUnreadCount()
    }, pollInterval)

    // Cleanup
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }
  }, [enabled, creatorId, pollInterval, fetchUnreadCount])

  // Also fetch on window focus for immediate updates
  useEffect(() => {
    if (!enabled || !creatorId) return

    const handleFocus = () => {
      fetchUnreadCount()
    }

    window.addEventListener('focus', handleFocus)
    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [enabled, creatorId, fetchUnreadCount])

  return {
    unreadCount,
    isLoading,
    markAsViewed,
    refetch: fetchUnreadCount
  }
}