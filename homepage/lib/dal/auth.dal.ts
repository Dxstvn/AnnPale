import 'server-only'
import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cache } from 'react'
import { redirect } from 'next/navigation'

/**
 * Data Access Layer for Authentication
 * Following SOTA 2025 patterns - no middleware, server-only operations
 */

// User DTO to control what data is exposed
export interface UserDTO {
  id: string
  email: string
  role: 'fan' | 'creator' | 'admin'
  displayName?: string
  avatarUrl?: string
  isVerified: boolean
  createdAt: string
}

// Session DTO
export interface SessionDTO {
  user: UserDTO | null
  isAuthenticated: boolean
  expiresAt?: string
}

/**
 * Create a Supabase server client with proper cookie handling
 * This is cached per request to avoid creating multiple clients
 */
const createClient = cache(async () => {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async get(name: string) {
          return cookieStore.get(name)?.value
        },
        async set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // This can happen in Server Components
            // Safe to ignore as middleware handles session refresh
          }
        },
        async remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // This can happen in Server Components
            // Safe to ignore
          }
        },
      },
    }
  )
})

/**
 * Get the current authenticated user
 * Returns null if not authenticated
 */
export const getCurrentUser = cache(async (): Promise<UserDTO | null> => {
  const supabase = await createClient()
  
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }

  // Fetch additional profile data
  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, avatar_url, user_role, email_verified')
    .eq('id', user.id)
    .single()

  // Map to DTO to control exposed data
  return {
    id: user.id,
    email: user.email!,
    role: profile?.user_role || 'fan',
    displayName: profile?.display_name || user.email?.split('@')[0],
    avatarUrl: profile?.avatar_url,
    isVerified: profile?.email_verified || false,
    createdAt: user.created_at,
  }
})

/**
 * Get the current session
 */
export const getSession = cache(async (): Promise<SessionDTO> => {
  const user = await getCurrentUser()
  
  if (!user) {
    return {
      user: null,
      isAuthenticated: false,
    }
  }

  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()

  return {
    user,
    isAuthenticated: true,
    expiresAt: session?.expires_at,
  }
})

/**
 * Verify if user is authenticated
 * Redirects to login if not
 */
export async function requireAuth(redirectTo: string = '/login'): Promise<UserDTO> {
  const user = await getCurrentUser()
  
  if (!user) {
    redirect(redirectTo)
  }
  
  return user
}

/**
 * Verify if user has a specific role
 * Redirects if not authorized
 */
export async function requireRole(
  role: 'fan' | 'creator' | 'admin',
  redirectTo: string = '/unauthorized'
): Promise<UserDTO> {
  const user = await requireAuth()
  
  if (user.role !== role) {
    redirect(redirectTo)
  }
  
  return user
}

/**
 * Verify if user is a creator
 * Redirects to unauthorized if not
 */
export async function requireCreator(): Promise<UserDTO> {
  return requireRole('creator', '/fan/home')
}

/**
 * Verify if user is an admin
 * Redirects to unauthorized if not
 */
export async function requireAdmin(): Promise<UserDTO> {
  return requireRole('admin', '/unauthorized')
}

/**
 * Check if user can access a specific resource
 */
export async function canAccessResource(
  resourceType: 'order' | 'video_request' | 'profile',
  resourceId: string
): Promise<boolean> {
  const user = await getCurrentUser()
  
  if (!user) return false

  const supabase = await createClient()

  switch (resourceType) {
    case 'order':
      const { data: order } = await supabase
        .from('orders')
        .select('user_id, creator_id')
        .eq('id', resourceId)
        .single()
      
      return order?.user_id === user.id || order?.creator_id === user.id

    case 'video_request':
      const { data: request } = await supabase
        .from('video_requests')
        .select('fan_id, creator_id')
        .eq('id', resourceId)
        .single()
      
      return request?.fan_id === user.id || request?.creator_id === user.id

    case 'profile':
      return resourceId === user.id || user.role === 'admin'

    default:
      return false
  }
}

/**
 * Sign out the current user
 */
export async function signOut(redirectTo: string = '/') {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect(redirectTo)
}

/**
 * Get user statistics based on role
 */
export async function getUserStats(userId?: string) {
  const user = await getCurrentUser()
  
  if (!user) return null

  const targetUserId = userId || user.id
  const supabase = await createClient()

  // Check if user can access these stats
  if (targetUserId !== user.id && user.role !== 'admin') {
    return null
  }

  if (user.role === 'creator' || (user.role === 'admin' && targetUserId)) {
    const { data } = await supabase
      .from('creator_stats')
      .select('*')
      .eq('creator_id', targetUserId)
      .single()
    
    return data
  }

  if (user.role === 'fan') {
    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', targetUserId)

    return {
      totalOrders: orders?.length || 0,
      totalSpent: orders?.reduce((sum, o) => sum + (o.amount || 0), 0) || 0,
      pendingOrders: orders?.filter(o => ['pending', 'accepted', 'in_progress'].includes(o.status)).length || 0,
      completedOrders: orders?.filter(o => o.status === 'completed').length || 0,
    }
  }

  return null
}

/**
 * Refresh the current session
 */
export async function refreshSession() {
  const supabase = await createClient()
  const { error } = await supabase.auth.refreshSession()
  
  if (error) {
    console.error('Failed to refresh session:', error)
    return false
  }
  
  return true
}

/**
 * Verify email token
 */
export async function verifyEmail(token: string) {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.verifyOtp({
    token_hash: token,
    type: 'email',
  })
  
  if (error) {
    console.error('Email verification failed:', error)
    return false
  }

  // Update profile to mark as verified
  const user = await getCurrentUser()
  if (user) {
    await supabase
      .from('profiles')
      .update({ email_verified: true })
      .eq('id', user.id)
  }

  return true
}

/**
 * Check if current request is from an authenticated user
 * Useful for conditional rendering in Server Components
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return !!user
}

/**
 * Get user's active subscriptions
 */
export async function getUserSubscriptions() {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data } = await supabase
    .from('creator_subscriptions')
    .select(`
      *,
      subscription_tier:subscription_tiers(*)
    `)
    .eq('fan_id', user.id)
    .eq('status', 'active')

  return data || []
}

/**
 * Check if user has access to creator's content
 */
export async function hasCreatorAccess(creatorId: string, tierId?: string): Promise<boolean> {
  const user = await getCurrentUser()
  
  if (!user) return false
  if (user.id === creatorId) return true // Creator has access to own content

  const supabase = await createClient()

  if (tierId) {
    // Check specific tier access
    const { data } = await supabase
      .from('creator_subscriptions')
      .select('id')
      .eq('fan_id', user.id)
      .eq('creator_id', creatorId)
      .eq('tier_id', tierId)
      .eq('status', 'active')
      .single()

    return !!data
  }

  // Check any tier access
  const { data } = await supabase
    .from('creator_subscriptions')
    .select('id')
    .eq('fan_id', user.id)
    .eq('creator_id', creatorId)
    .eq('status', 'active')
    .limit(1)

  return !!data && data.length > 0
}