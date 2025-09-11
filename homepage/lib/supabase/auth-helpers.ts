/**
 * Supabase Authentication Helpers
 * @module lib/supabase/auth-helpers
 * 
 * Simplified authentication utilities that leverage Supabase's built-in patterns
 * for better session management and state handling.
 */

import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'
import type { UserProfile } from '@/types/auth'

/**
 * Get the current user session and profile
 * Works on both client and server side
 */
export async function getCurrentUser(isServer = false): Promise<{
  user: User | null
  profile: UserProfile | null
  session: any
}> {
  const supabase = isServer ? await createServerClient() : createClient()
  
  // Get current session
  const { data: { session }, error } = await supabase.auth.getSession()
  
  if (error || !session?.user) {
    return { user: null, profile: null, session: null }
  }
  
  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()
  
  return {
    user: session.user,
    profile: profile as UserProfile | null,
    session
  }
}

/**
 * Get redirect path based on user role
 */
export function getRedirectPath(userRole: string | null): string {
  switch (userRole) {
    case 'admin':
      return '/admin/dashboard'
    case 'creator':
      return '/creator/dashboard'
    case 'fan':
      return '/fan/home'
    default:
      return '/auth/role-selection'
  }
}

/**
 * Sign in with email and password
 * Returns the redirect path or error
 */
export async function signInWithEmail(email: string, password: string): Promise<{
  success: boolean
  redirectPath?: string
  error?: string
}> {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  if (!data.user) {
    return { success: false, error: 'No user returned from login' }
  }
  
  // Get user profile to determine redirect
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', data.user.id)
    .single()
  
  const redirectPath = getRedirectPath(profile?.role || null)
  
  return { success: true, redirectPath }
}

/**
 * Create a new user account
 */
export async function signUpWithEmail(
  email: string, 
  password: string, 
  name: string, 
  role: 'fan' | 'creator'
): Promise<{
  success: boolean
  redirectPath?: string
  error?: string
}> {
  const supabase = createClient()
  
  // Sign up the user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role }
    }
  })
  
  if (error) {
    return { success: false, error: error.message }
  }
  
  if (!data.user) {
    return { success: false, error: 'No user created' }
  }
  
  // Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: data.user.id,
      email: data.user.email!,
      name,
      role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  
  if (profileError) {
    console.error('Profile creation error:', profileError)
    // Don't fail the signup if profile creation fails
  }
  
  const redirectPath = getRedirectPath(role)
  return { success: true, redirectPath }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  const supabase = createClient()
  await supabase.auth.signOut()
}

/**
 * Listen to auth state changes
 * This is the recommended Supabase pattern
 */
export function onAuthStateChange(callback: (event: string, session: any) => void) {
  const supabase = createClient()
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
  
  return () => subscription.unsubscribe()
}