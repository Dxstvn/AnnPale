"use client"

/**
 * Supabase Authentication Context Provider
 * @module contexts/supabase-auth-context
 * 
 * Provides authentication state and methods throughout the application.
 * Handles session management, profile fetching, and OAuth providers.
 */

import React, { createContext, useContext, useState, useEffect } from 'react'
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
  // Create client directly - avoid singleton pattern which might cause issues
  const supabase = createClient()

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    // If we already have the profile and it matches the user ID, return it
    if (user && user.id === userId) {
      console.log('[fetchUserProfile] Returning cached profile for user:', userId)
      return user
    }
    
    if (!userId) {
      console.warn('[fetchUserProfile] No userId provided')
      return null
    }
    
    try {
      console.log('[fetchUserProfile] Fetching profile for user:', userId)
      
      // Simple direct fetch - use maybeSingle() to handle non-existent profiles
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, email, name, role, avatar_url, created_at, updated_at')
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
      
      return null
    } catch (error) {
      console.error('[fetchUserProfile] Unexpected error:', error)
      return null
    }
  }

  // Setup auth state listener on mount
  useEffect(() => {
    console.log('[SupabaseAuthProvider] Initializing auth...')
    
    // The onAuthStateChange will fire INITIAL_SESSION automatically on mount
    // No need for manual session check - let the auth state handler do it
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('[SupabaseAuthProvider] Auth state changed:', event, 'Session:', !!session)
      
      // Only process INITIAL_SESSION and SIGNED_OUT to avoid duplicate fetches
      if (event === 'INITIAL_SESSION') {
        console.log('[SupabaseAuthProvider] Processing INITIAL_SESSION event')
        if (session?.user) {
          setSupabaseUser(session.user)
          
          // Skip if profile is already loaded for this user
          if (user && user.id === session.user.id) {
            console.log('[SupabaseAuthProvider] Profile already loaded, skipping fetch')
            setIsLoading(false)
            return
          }
          
          // Fetch profile without fallback
          const profile = await fetchUserProfile(session.user.id)
          if (profile) {
            console.log('[SupabaseAuthProvider] Profile loaded successfully')
            setUser(profile)
          } else {
            console.log('[SupabaseAuthProvider] No profile found - user needs to be created in database')
            setUser(null)
          }
        } else {
          setSupabaseUser(null)
          setUser(null)
        }
        setIsLoading(false)
      } else if (event === 'SIGNED_OUT') {
        console.log('[SupabaseAuthProvider] Processing SIGNED_OUT event')
        setSupabaseUser(null)
        setUser(null)
        setIsLoading(false)
      } else {
        // Log ignored events for debugging
        console.log(`[SupabaseAuthProvider] Ignoring ${event} event to prevent duplicate operations`)
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])


  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        return { error: error.message }
      }

      if (data.user) {
        // Fetch user profile
        const profile = await fetchUserProfile(data.user.id)
        
        if (!profile) {
          console.warn('No profile found for user')
          // Check if user is admin
          const adminEmails = ['jasmindustin@gmail.com', 'loicjasmin@gmail.com']
          const isAdmin = adminEmails.includes(data.user.email || '')
          
          if (isAdmin) {
            // Admin users should have profiles created automatically
            const profileData = {
              id: data.user.id,
              email: data.user.email || '',
              name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Admin',
              role: 'admin' as const,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
            
            await supabase.from('profiles').insert(profileData)
            router.push('/admin/dashboard')
          } else {
            // For regular email/password users without profiles, return an error
            // They should complete their profile first
            await supabase.auth.signOut()
            return { error: 'Please complete your profile setup. Sign up to create a new account with your preferred role.' }
          }
        } else {
          // Redirect based on existing profile role
          const redirectPath = 
            profile.role === 'admin' ? '/admin/dashboard' :
            profile.role === 'creator' ? '/creator/dashboard' :
            '/fan/dashboard'
          
          router.push(redirectPath)
        }
      }

      return {}
    } catch (error) {
      console.error('Login error:', error)
      return { error: 'An unexpected error occurred' }
    }
  }

  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    role: 'fan' | 'creator'
  ): Promise<{ error?: string }> => {
    try {
      console.log('Starting signup for:', { email, name, role })
      
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
        console.error('Auth signup error:', error)
        return { error: error.message }
      }

      if (data.user) {
        // Create profile with all necessary fields
        const profileData = {
          id: data.user.id,
          email: data.user.email,
          name,
          role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        
        console.log('Creating profile for new user:', profileData)
        
        const { data: profileResult, error: profileError } = await supabase
          .from('profiles')
          .insert(profileData)
          .select()
          .single()

        if (profileError) {
          console.error('Profile creation error details:', {
            error: profileError,
            code: profileError.code,
            message: profileError.message,
            details: profileError.details,
            hint: profileError.hint
          })
          
          // Check if it's a duplicate key error (profile already exists)
          if (profileError.code === '23505') {
            // Profile might already exist, try to continue with login
            console.log('Profile may already exist, attempting login...')
            const loginResult = await login(email, password)
            if (!loginResult.error) {
              return {} // Success
            }
          }
          
          // Return a user-friendly error message
          return { 
            error: profileError.message?.includes('duplicate') 
              ? 'An account with this email already exists. Please try logging in.'
              : `Failed to create profile: ${profileError.message || 'Database error. Please try again.'}` 
          }
        } else {
          console.log('Profile created successfully:', profileResult)
        }

        // Auto-login after signup
        const loginResult = await login(email, password)
        if (loginResult.error) {
          return { error: `Account created but auto-login failed: ${loginResult.error}` }
        }
      }

      return {}
    } catch (error) {
      console.error('Unexpected signup error:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred'
      return { error: errorMessage }
    }
  }

  const loginWithProvider = async (provider: 'google' | 'apple' | 'twitter', options?: { role?: 'fan' | 'creator' }) => {
    window.console.log(`[loginWithProvider] Starting OAuth flow for ${provider}`)
    
    try {
      // Always use the current origin for redirects
      // This ensures it works both locally and in production
      const redirectUrl = `${window.location.origin}/auth/callback`
      
      window.console.log(`Starting OAuth with ${provider}`)
      window.console.log('OAuth redirect URL:', redirectUrl)
      window.console.log('OAuth role:', options?.role || 'fan')
      window.console.log('Supabase client exists:', !!supabase)
      window.console.log('Supabase auth exists:', !!supabase?.auth)
      
      // Store the intended role in localStorage for retrieval after OAuth
      if (options?.role) {
        localStorage.setItem('oauth_intended_role', options.role)
      }
      
      // Create state parameter with role
      const stateData = {
        role: options?.role || 'fan',
        timestamp: Date.now()
      }
      const encodedState = btoa(JSON.stringify(stateData))
      
      // For Twitter/X, ensure we're using the correct provider name
      const oauthProvider = provider === 'twitter' ? 'twitter' : provider
        
      // Just use the base redirect URL - don't add state as query param
      window.console.log('About to call signInWithOAuth with:', {
        provider: oauthProvider,
        redirectTo: redirectUrl
      })
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: oauthProvider,
        options: {
          redirectTo: redirectUrl,
          queryParams: provider === 'google' ? {
            access_type: 'offline',
            prompt: 'consent',
          } : undefined,
          scopes: provider === 'twitter' ? 'tweet.read users.read' : undefined,
          skipBrowserRedirect: false // Allow automatic redirect to OAuth provider
        }
      })

      window.console.log('OAuth response:', { data, error })

      if (error) {
        console.error(`OAuth login error for ${provider}:`, error)
        // Check if it's a provider configuration error
        if (error.message?.includes('not enabled') || error.message?.includes('not configured')) {
          throw new Error(`${provider === 'twitter' ? 'X (Twitter)' : provider} login is not configured. Please contact support.`)
        }
        throw error
      }

      if (data?.url) {
        console.log('OAuth URL generated:', data.url)
        
        // Clean up the URL - remove any non-ASCII characters
        const cleanUrl = data.url.replace(/[^\x00-\x7F]/g, (match) => {
          console.warn('Found non-ASCII character in URL:', match.charCodeAt(0))
          // Try to replace common mistaken characters
          if (match.charCodeAt(0) === 1040) return 'A'; // Cyrillic А to Latin A
          if (match.charCodeAt(0) === 1047) return '3'; // Cyrillic З to 3
          return encodeURIComponent(match);
        });
        
        if (cleanUrl !== data.url) {
          console.warn('OAuth URL contained non-ASCII characters, cleaned URL:', cleanUrl)
        }
        
        // Check if URL is just the base Supabase URL without path
        if (cleanUrl === 'https://yijizsscwkvepljqojkz.supabase.co' || 
            cleanUrl === 'https://yijizsscwkvepljqojkz.supabase.co/') {
          console.error('Invalid OAuth URL - missing auth path. Provider may not be configured.')
          throw new Error(`${provider === 'twitter' ? 'X (Twitter)' : provider} authentication is not properly configured. Please contact support.`)
        }
        
        // Verify the URL is valid before redirecting
        try {
          const url = new URL(cleanUrl)
          console.log('Parsed OAuth URL:', {
            hostname: url.hostname,
            pathname: url.pathname,
            search: url.search
          })
          
          // Don't redirect if it's just the base URL
          if (url.pathname === '/' || url.pathname === '') {
            throw new Error('OAuth URL is missing the authorization path')
          }
          
          console.log('ABOUT TO REDIRECT TO:', cleanUrl);
          window.location.href = cleanUrl
        } catch (urlError) {
          console.error('Invalid OAuth URL generated:', cleanUrl, urlError)
          throw new Error(`Failed to initiate ${provider === 'twitter' ? 'X' : provider} login. Please try again.`)
        }
      } else {
        console.error('No URL in OAuth response data:', data)
        throw new Error(`Failed to initiate ${provider === 'twitter' ? 'X' : provider} login. Please try again.`)
      }

      // The browser will be redirected to the OAuth provider
    } catch (error: any) {
      console.error(`OAuth login error for ${provider}:`, error)
      // Re-throw with a user-friendly message
      if (error.message) {
        throw error
      }
      throw new Error(`Failed to login with ${provider === 'twitter' ? 'X' : provider}. Please try again.`)
    }
  }

  const sendMagicLink = async (email: string): Promise<{ error?: string }> => {
    try {
      const response = await fetch('/api/auth/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Failed to send magic link' }
      }

      return {}
    } catch (error) {
      console.error('Magic link error:', error)
      return { error: 'An unexpected error occurred' }
    }
  }

  const logout = async () => {
    try {
      console.log('[logout] Starting sign out process')
      
      // Clear any stored OAuth role
      localStorage.removeItem('oauth_intended_role')
      
      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('[logout] Supabase sign out error:', error)
        // Continue with local cleanup even if Supabase signout fails
      }
      
      // Clear local state
      setUser(null)
      setSupabaseUser(null)
      
      console.log('[logout] Sign out successful, redirecting to home')
      
      // Redirect to home page
      router.push('/')
    } catch (error) {
      console.error('[logout] Unexpected error during sign out:', error)
      // Still try to redirect even if there's an error
      router.push('/')
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>): Promise<{ error?: string }> => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        },
        body: JSON.stringify(updates)
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Failed to update profile' }
      }

      setUser(data.profile)
      return {}
    } catch (error) {
      console.error('Update profile error:', error)
      return { error: 'An unexpected error occurred' }
    }
  }

  const refreshSession = async () => {
    try {
      console.log('[SupabaseAuthProvider] Refreshing session...')
      const { data: { session }, error } = await supabase.auth.refreshSession()
      
      if (error) {
        console.error('[SupabaseAuthProvider] Session refresh error:', error)
        throw error
      }
      
      if (session?.user) {
        setSupabaseUser(session.user)
        const profile = await fetchUserProfile(session.user.id)
        if (profile) {
          setUser(profile)
        }
        console.log('[SupabaseAuthProvider] Session refreshed successfully')
      }
    } catch (error) {
      console.error('[SupabaseAuthProvider] Failed to refresh session:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider 
      value={{
        user,
        supabaseUser,
        isLoading,
        isAuthenticated: !!supabaseUser,
        login,
        signup,
        loginWithProvider,
        sendMagicLink,
        logout,
        updateProfile,
        refreshSession
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

/**
 * Hook to access authentication context
 * @returns Authentication context value
 * @throws Error if used outside of SupabaseAuthProvider
 */
export function useSupabaseAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}