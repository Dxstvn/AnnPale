import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import type { UserProfile } from '@/types/auth'

/**
 * Get the current user from server components.
 * Redirects to login if not authenticated.
 */
export async function requireAuth() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  return user
}

/**
 * Get the current user's profile from server components.
 * Redirects to login if not authenticated.
 */
export async function requireProfile(): Promise<UserProfile> {
  const user = await requireAuth()
  const supabase = await createClient()

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    redirect('/auth/role-selection')
  }

  return profile
}

/**
 * Get the current user from server components.
 * Returns null if not authenticated (doesn't redirect).
 */
export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

/**
 * Get the current user's profile from server components.
 * Returns null if not authenticated or no profile.
 */
export async function getProfile() {
  const user = await getUser()
  if (!user) return null

  const supabase = await createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return profile
}

/**
 * Check if user has a specific role.
 */
export async function hasRole(role: string): Promise<boolean> {
  const profile = await getProfile()
  return profile?.role === role
}

/**
 * Require a specific role, redirect if not authorized.
 */
export async function requireRole(role: string) {
  const profile = await requireProfile()

  if (profile.role !== role) {
    redirect('/unauthorized')
  }

  return profile
}