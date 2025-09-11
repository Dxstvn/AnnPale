import { useState, useEffect, useCallback } from 'react'
import { useSupabaseAuth } from '@/contexts/supabase-auth-context'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface ContentAccessState {
  hasAccess: boolean
  loading: boolean
  reason?: string
  message?: string
  requiredTiers?: any[]
  subscription?: any
}

interface UseContentAccessOptions {
  redirectOnNoAccess?: boolean
  redirectTo?: string
  showToast?: boolean
}

export function useContentAccess(
  contentId: string | null,
  contentType: 'post' | 'creator' = 'post',
  options: UseContentAccessOptions = {}
) {
  const { user, isAuthenticated } = useSupabaseAuth()
  const { toast } = useToast()
  const router = useRouter()
  
  const [accessState, setAccessState] = useState<ContentAccessState>({
    hasAccess: false,
    loading: true
  })

  const {
    redirectOnNoAccess = false,
    redirectTo = '/login',
    showToast = true
  } = options

  const checkAccess = useCallback(async () => {
    if (!contentId) {
      setAccessState({ hasAccess: false, loading: false })
      return
    }

    setAccessState(prev => ({ ...prev, loading: true }))

    try {
      const response = await fetch('/api/content/access', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contentId,
          contentType
        })
      })

      const data = await response.json()

      if (response.ok) {
        setAccessState({
          hasAccess: true,
          loading: false,
          subscription: data.subscription
        })
      } else {
        setAccessState({
          hasAccess: false,
          loading: false,
          reason: data.reason,
          message: data.message,
          requiredTiers: data.requiredTiers
        })

        // Handle no access
        if (redirectOnNoAccess) {
          if (data.reason === 'not_authenticated') {
            router.push(redirectTo)
          } else if (data.reason === 'no_subscription' || data.reason === 'tier_mismatch') {
            router.push(`/fan/creators/${contentId}?tab=subscriptions`)
          }
        }

        if (showToast && data.message) {
          toast({
            title: 'Access Restricted',
            description: data.message,
            variant: data.reason === 'not_authenticated' ? 'default' : 'destructive',
            action: data.reason === 'not_authenticated' 
              ? {
                  label: 'Sign In',
                  onClick: () => router.push('/login')
                }
              : data.reason === 'no_subscription' || data.reason === 'tier_mismatch'
              ? {
                  label: 'View Plans',
                  onClick: () => router.push(`/fan/creators/${contentId}?tab=subscriptions`)
                }
              : undefined
          })
        }
      }
    } catch (error) {
      console.error('Error checking content access:', error)
      setAccessState({
        hasAccess: false,
        loading: false,
        reason: 'error',
        message: 'Failed to check content access'
      })
    }
  }, [contentId, contentType, redirectOnNoAccess, redirectTo, showToast, toast, router])

  useEffect(() => {
    checkAccess()
  }, [checkAccess])

  const refetchAccess = useCallback(() => {
    checkAccess()
  }, [checkAccess])

  return {
    ...accessState,
    refetchAccess,
    isAuthenticated
  }
}

// Hook for batch content access checking
export function useContentAccessBatch(contentIds: string[], contentType: 'post' | 'creator' = 'post') {
  const { user } = useSupabaseAuth()
  const [accessMap, setAccessMap] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkBatchAccess = async () => {
      if (contentIds.length === 0) {
        setLoading(false)
        return
      }

      setLoading(true)
      const newAccessMap: Record<string, boolean> = {}

      // Check access for each content ID
      const checks = contentIds.map(async (contentId) => {
        try {
          const response = await fetch('/api/content/access', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contentId,
              contentType
            })
          })

          const data = await response.json()
          newAccessMap[contentId] = response.ok && data.hasAccess
        } catch (error) {
          console.error(`Error checking access for ${contentId}:`, error)
          newAccessMap[contentId] = false
        }
      })

      await Promise.all(checks)
      setAccessMap(newAccessMap)
      setLoading(false)
    }

    checkBatchAccess()
  }, [contentIds, contentType, user])

  return { accessMap, loading }
}

// Hook for getting all accessible content
export function useAccessibleContent(creatorId?: string) {
  const { user } = useSupabaseAuth()
  const [posts, setPosts] = useState<any[]>([])
  const [subscriptions, setSubscriptions] = useState<any[]>([])
  const [hasFullAccess, setHasFullAccess] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAccessibleContent = async () => {
      setLoading(true)

      try {
        const params = new URLSearchParams()
        if (creatorId) {
          params.append('creatorId', creatorId)
        }

        const response = await fetch(`/api/content/access?${params}`, {
          method: 'GET'
        })

        if (response.ok) {
          const data = await response.json()
          setPosts(data.posts || [])
          setSubscriptions(data.subscriptions || [])
          setHasFullAccess(data.hasFullAccess || false)
        }
      } catch (error) {
        console.error('Error fetching accessible content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAccessibleContent()
  }, [creatorId, user])

  return { posts, subscriptions, hasFullAccess, loading }
}