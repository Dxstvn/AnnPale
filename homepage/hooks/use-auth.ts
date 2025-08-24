/**
 * Custom authentication hooks
 * @module hooks/use-auth
 */

import { useSupabaseAuth } from '@/contexts/supabase-auth-context'
import { UserRole, hasMinimumRole, hasExactRole } from '@/types/auth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Hook to check if user has a specific role
 * @param requiredRole - The role to check for
 * @returns Object with role check results
 */
export function useRole(requiredRole: UserRole) {
  const { user, isLoading } = useSupabaseAuth()
  
  return {
    hasRole: user ? hasExactRole(user.role, requiredRole) : false,
    hasMinimumRole: user ? hasMinimumRole(user.role, requiredRole) : false,
    isLoading,
    userRole: user?.role
  }
}

/**
 * Hook to require authentication
 * Redirects to login if not authenticated
 * @param redirectTo - Where to redirect if not authenticated
 */
export function useRequireAuth(redirectTo: string = '/login') {
  const { isAuthenticated, isLoading } = useSupabaseAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo)
    }
  }, [isLoading, isAuthenticated, redirectTo, router])
  
  return { isAuthenticated, isLoading }
}

/**
 * Hook to require a specific role
 * Redirects if user doesn't have the required role
 * @param requiredRole - The required role
 * @param redirectTo - Where to redirect if role doesn't match
 */
export function useRequireRole(requiredRole: UserRole, redirectTo?: string) {
  const { user, isLoading, isAuthenticated } = useSupabaseAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (user && !hasExactRole(user.role, requiredRole)) {
        router.push(redirectTo || `/unauthorized?required=${requiredRole}`)
      }
    }
  }, [isLoading, isAuthenticated, user, requiredRole, redirectTo, router])
  
  return { 
    hasRole: user ? hasExactRole(user.role, requiredRole) : false,
    isLoading,
    userRole: user?.role
  }
}

/**
 * Hook to require minimum role level
 * Redirects if user doesn't have at least the required role
 * @param minimumRole - The minimum required role
 * @param redirectTo - Where to redirect if role is insufficient
 */
export function useRequireMinimumRole(minimumRole: UserRole, redirectTo?: string) {
  const { user, isLoading, isAuthenticated } = useSupabaseAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (user && !hasMinimumRole(user.role, minimumRole)) {
        router.push(redirectTo || `/unauthorized?minimum=${minimumRole}`)
      }
    }
  }, [isLoading, isAuthenticated, user, minimumRole, redirectTo, router])
  
  return { 
    hasMinimumRole: user ? hasMinimumRole(user.role, minimumRole) : false,
    isLoading,
    userRole: user?.role
  }
}

/**
 * Hook for guest-only pages
 * Redirects authenticated users to their dashboard
 */
export function useGuestOnly() {
  const { user, isAuthenticated, isLoading } = useSupabaseAuth()
  const router = useRouter()
  
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const dashboardPath = 
        user.role === 'admin' ? '/admin/dashboard' :
        user.role === 'creator' ? '/creator/dashboard' :
        '/fan/dashboard'
      router.push(dashboardPath)
    }
  }, [isLoading, isAuthenticated, user, router])
  
  return { isGuest: !isAuthenticated, isLoading }
}

/**
 * Hook to get the current user's permissions
 * @returns Object with permission checks
 */
export function usePermissions() {
  const { user } = useSupabaseAuth()
  
  return {
    canAccessAdmin: user ? hasExactRole(user.role, 'admin') : false,
    canAccessCreator: user ? hasMinimumRole(user.role, 'creator') : false,
    canAccessFan: user ? hasMinimumRole(user.role, 'fan') : false,
    isAdmin: user?.role === 'admin',
    isCreator: user?.role === 'creator',
    isFan: user?.role === 'fan',
    role: user?.role
  }
}