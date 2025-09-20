"use client"

/**
 * Supabase Authentication Context Provider
 * @module contexts/supabase-auth-context
 *
 * Provides authentication state and methods throughout the application.
 * Handles session management, profile fetching, and OAuth providers.
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'
import type { UserRole, UserProfile } from '@/types/auth'
import { getAuthRedirectPath } from '@/types/auth'

/**
 * Authentication context interface
 */
interface AuthContextType {
  /** Current user profile from database */
  user: UserProfile | null
  /** Supabase auth user object */
  supabaseUser: SupabaseUser | null
  /** Whether auth state is being loaded */
  isLoading: boolean
  /** Whether user is authenticated */
  isAuthenticated: boolean
  /** Supabase client instance */
  supabase: ReturnType<typeof createClient>
  /** Sign in with email and password */
  login: (email: string, password: string) => Promise<{ error?: string }>
  /** Create new account */
  signup: (email: string, password: string, name: string, role: 'fan' | 'creator') => Promise<{ error?: string }>
  /** Sign in with OAuth provider */
  loginWithProvider: (provider: 'google' | 'apple' | 'twitter', options?: { role?: 'fan' | 'creator' }) => Promise<void>
  /** Send magic link to email */
  sendMagicLink: (email: string) => Promise<{ error?: string }>
  /** Sign out current user */
  logout: () => Promise<void>
  /** Update user profile */
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>
  /** Refresh current session */
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Create a singleton instance of the Supabase client
let supabaseInstance: ReturnType<typeof createClient> | null = null

/**
 * Get singleton Supabase client instance
 * @returns Supabase client
 */
const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient()
  }
  return supabaseInstance
}

/**
 * Supabase Authentication Provider Component
 * Wraps the application to provide authentication context
 * @param children - Child components
 */
export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Refs for tracking state and preventing duplicate operations
  const profileFetchInProgress = useRef(false)
  const profileFetchPromise = useRef<Promise<UserProfile | null> | null>(null)
  const lastFetchedUserId = useRef<string | null>(null)
  const currentSessionId = useRef<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch user profile from database with deduplication and cancellation
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    if (!userId) {
      console.warn('[fetchUserProfile] No userId provided')
      return null
    }

    // Check if we already have this profile cached
    if (lastFetchedUserId.current === userId && user?.id === userId) {
      console.log('[fetchUserProfile] Using cached profile for user:', userId)
      return user
    }

    // Check if a fetch is already in progress for this user
    if (profileFetchInProgress.current && lastFetchedUserId.current === userId) {
      console.log('[fetchUserProfile] Fetch already in progress for user:', userId, '- waiting for result')
      // Wait for the existing fetch to complete
      if (profileFetchPromise.current) {
        return profileFetchPromise.current
      }
      return null
    }

    // Cancel any existing fetch operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Create and store the fetch promise
    profileFetchPromise.current = (async () => {
      try {
        console.log('[fetchUserProfile] Fetching profile for user:', userId)
        profileFetchInProgress.current = true
        lastFetchedUserId.current = userId

        // Create new abort controller for this request
        abortControllerRef.current = new AbortController()

        // Create a timeout that will abort the request
        const timeoutPromise = new Promise<null>((resolve) => {
          timeoutRef.current = setTimeout(() => {
            console.warn('[fetchUserProfile] Profile fetch timed out after 5 seconds')
            if (abortControllerRef.current) {
              abortControllerRef.current.abort()
            }
            resolve(null)
          }, 5000)
        })

        // Create the fetch promise
        const fetchPromise = (async () => {
          try {
            const { data: profile, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .maybeSingle()

            if (error) {
              console.error('[fetchUserProfile] Error fetching profile:', error)
              return null
            }

            if (profile) {
              console.log('[fetchUserProfile] Profile fetched successfully:', {
                id: profile.id,
                email: profile.email,
                role: profile.role,
                name: profile.name
              })
              return profile as UserProfile
            }

            console.log('[fetchUserProfile] No profile found for user')
            return null
          } catch (err: any) {
            console.error('[fetchUserProfile] Fetch error:', err)
            return null
          }
        })()

        // Race between fetch and timeout
        const result = await Promise.race([fetchPromise, timeoutPromise])

        // Clear timeout if fetch completed
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
          timeoutRef.current = null
        }

        return result
      } catch (error) {
        console.error('[fetchUserProfile] Unexpected error:', error)
        return null
      } finally {
        profileFetchInProgress.current = false
        profileFetchPromise.current = null
        abortControllerRef.current = null
      }
    })()

    return profileFetchPromise.current
  }

  // Handle profile loading separately from auth state changes
  const handleAuthStateChange = async (event: string, session: any) => {
    console.log('[SupabaseAuthProvider] Auth state changed:', event, 'Session:', !!session)

    // Track user ID instead of access token to prevent issues with token refresh
    const newUserId = session?.user?.id || null

    // Update session state synchronously
    if (session?.user) {
      setSupabaseUser(session.user)
    } else {
      setSupabaseUser(null)
      setUser(null)
      setIsLoading(false)
      currentSessionId.current = null
      lastFetchedUserId.current = null
      return
    }

    // Only process profile loading for meaningful auth events
    // Skip token refresh and user updates as they don't require profile re-fetch
    if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
      console.log(`[SupabaseAuthProvider] Skipping profile fetch for ${event} - using cached data`)
      return
    }

    // For SIGNED_IN event, check if this is actually a new user or just the same user
    if (event === 'SIGNED_IN' && currentSessionId.current === newUserId) {
      console.log('[SupabaseAuthProvider] Ignoring duplicate SIGNED_IN for same user')
      return
    }

    // Handle profile loading for new sessions
    if (event === 'INITIAL_SESSION' || (event === 'SIGNED_IN' && currentSessionId.current !== newUserId)) {
      console.log(`[SupabaseAuthProvider] Processing ${event} event for new session`)
      currentSessionId.current = newUserId

      // Load profile asynchronously
      try {
        const profile = await fetchUserProfile(session.user.id)
        if (profile) {
          console.log(`[SupabaseAuthProvider] Profile loaded successfully after ${event}`)
          setUser(profile)
        } else {
          console.log(`[SupabaseAuthProvider] No profile found after ${event}`)
          setUser(null)
        }
      } catch (error) {
        console.error(`[SupabaseAuthProvider] Error loading profile after ${event}:`, error)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    } else if (event === 'SIGNED_OUT') {
      console.log('[SupabaseAuthProvider] Processing SIGNED_OUT event')
      setUser(null)
      setIsLoading(false)
      currentSessionId.current = null
      lastFetchedUserId.current = null
    }
  }

  // Setup auth state listener on mount - React Strict Mode compliant
  useEffect(() => {
    console.log('[SupabaseAuthProvider] Initializing auth...')

    let mounted = true

    // Initialize auth state
    const initAuth = async () => {
      // Get initial session first
      const { data: { session } } = await supabase.auth.getSession()

      if (!mounted) return

      if (session) {
        await handleAuthStateChange('INITIAL_SESSION', session)
      } else {
        setIsLoading(false)
      }
    }

    // Start initialization
    initAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Only process if component is still mounted
      if (!mounted) return

      // Skip INITIAL_SESSION from onAuthStateChange as we handle it in getSession
      if (event === 'INITIAL_SESSION') {
        console.log('[SupabaseAuthProvider] Skipping INITIAL_SESSION from onAuthStateChange')
        return
      }

      handleAuthStateChange(event, session)
    })

    // Cleanup function for React Strict Mode
    return () => {
      mounted = false
      console.log('[SupabaseAuthProvider] Cleaning up auth listener')
      subscription.unsubscribe()

      // Clean up any pending fetch operations
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, []) // Empty dependency array - only run once on mount


  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      console.log('Attempting login for email:', email)
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        console.error('Login error:', error)
        return { error: error.message }
      }

      if (data.user) {
        console.log('Login successful, fetching profile...')
        const profile = await fetchUserProfile(data.user.id)

        if (!profile) {
          console.error('No profile found for user')
          await supabase.auth.signOut()
          return { error: 'No profile found. Please complete your registration.' }
        }

        setUser(profile)
        const redirectPath = getAuthRedirectPath(profile.role as UserRole)
        console.log('Redirecting to:', redirectPath)
        router.push(redirectPath)
      }

      return {}
    } catch (err: any) {
      console.error('Login exception:', err)
      return { error: err.message || 'An unexpected error occurred' }
    }
  }

  const signup = async (email: string, password: string, name: string, role: 'fan' | 'creator'): Promise<{ error?: string }> => {
    try {
      console.log('Attempting signup for email:', email, 'role:', role)

      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role
          }
        }
      })

      if (error) {
        console.error('Signup error:', error)
        return { error: error.message }
      }

      if (!data.user) {
        return { error: 'Signup failed. Please try again.' }
      }

      console.log('Signup successful, user created:', data.user.id)

      // Create profile in database
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          name,
          role,
          created_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Clean up auth user if profile creation fails
        await supabase.auth.signOut()
        return { error: 'Failed to create profile. Please try again.' }
      }

      console.log('Profile created successfully')

      // Fetch the created profile
      const profile = await fetchUserProfile(data.user.id)
      if (profile) {
        setUser(profile)
        const redirectPath = getAuthRedirectPath(role as UserRole)
        console.log('Redirecting to:', redirectPath)
        router.push(redirectPath)
      }

      return {}
    } catch (err: any) {
      console.error('Signup exception:', err)
      return { error: err.message || 'An unexpected error occurred' }
    }
  }

  const loginWithProvider = async (provider: 'google' | 'apple' | 'twitter', options?: { role?: 'fan' | 'creator' }) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: provider as any,
        options: {
          redirectTo: `${window.location.origin}/auth/callback${options?.role ? `?role=${options.role}` : ''}`
        }
      })

      if (error) {
        console.error('OAuth login error:', error)
        throw error
      }
    } catch (err: any) {
      console.error('OAuth exception:', err)
      throw err
    }
  }

  const sendMagicLink = async (email: string): Promise<{ error?: string }> => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        console.error('Magic link error:', error)
        return { error: error.message }
      }

      return {}
    } catch (err: any) {
      console.error('Magic link exception:', err)
      return { error: err.message || 'An unexpected error occurred' }
    }
  }

  const logout = async () => {
    try {
      console.log('Logging out...')

      // Clear local state first
      setUser(null)
      setSupabaseUser(null)
      currentSessionId.current = null
      lastFetchedUserId.current = null

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Logout error:', error)
      }

      console.log('Logout successful, redirecting to home...')
      router.push('/')
    } catch (err) {
      console.error('Logout exception:', err)
      // Even if logout fails, redirect to home
      router.push('/')
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ error?: string }> => {
    try {
      if (!user) {
        return { error: 'No user logged in' }
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      if (error) {
        console.error('Profile update error:', error)
        return { error: error.message }
      }

      // Update local state
      setUser({ ...user, ...updates })
      return {}
    } catch (err: any) {
      console.error('Profile update exception:', err)
      return { error: err.message || 'An unexpected error occurred' }
    }
  }

  const refreshSession = async () => {
    try {
      console.log('Refreshing session...')
      const { data: { session }, error } = await supabase.auth.refreshSession()

      if (error) {
        console.error('Session refresh error:', error)
        throw error
      }

      if (session) {
        console.log('Session refreshed successfully')
        setSupabaseUser(session.user)
      }
    } catch (err) {
      console.error('Session refresh exception:', err)
      throw err
    }
  }

  const value: AuthContextType = {
    user,
    supabaseUser,
    isLoading,
    isAuthenticated: !!supabaseUser,
    supabase,
    login,
    signup,
    loginWithProvider,
    sendMagicLink,
    logout,
    updateProfile,
    refreshSession
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to use authentication context
 * @returns Authentication context
 * @throws Error if used outside of SupabaseAuthProvider
 */
export function useSupabaseAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}