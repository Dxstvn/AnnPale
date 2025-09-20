'use client'

import { createContext, useContext, useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'
import type { UserRole, UserProfile } from '@/types/auth'

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Lightweight auth provider for client components.
 * Session management is handled by middleware.
 * This only provides auth state to client components.
 */
export function ClientAuthProvider({
  children,
  initialUser,
  initialProfile
}: {
  children: React.ReactNode
  initialUser?: User | null
  initialProfile?: UserProfile | null
}) {
  const [user, setUser] = useState<User | null>(initialUser || null)
  const [profile, setProfile] = useState<UserProfile | null>(initialProfile || null)
  const [isLoading, setIsLoading] = useState(!initialUser)
  const router = useRouter()
  const supabase = createClient()

  // Refs for state deduplication
  const previousAuthState = useRef<{ event: string | null, userId: string | null }>({
    event: null,
    userId: initialUser?.id || null
  })
  const isInitializing = useRef(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()

        // Only update if different from initial
        if (session?.user?.id !== initialUser?.id) {
          setUser(session?.user ?? null)

          if (session?.user) {
            // Fetch profile if we have a user
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()

            setProfile(profileData)
          } else {
            setProfile(null)
          }
        }
      } catch (error) {
        console.error('Error fetching initial session:', error)
      } finally {
        setIsLoading(false)
        isInitializing.current = false
      }
    }

    if (!initialUser) {
      getInitialSession()
    } else {
      isInitializing.current = false
    }

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUserId = session?.user?.id || null

      // Skip initial session events if we're still initializing
      if (isInitializing.current && event === 'INITIAL_SESSION') {
        return
      }

      // Skip INITIAL_SESSION if we already have the same user
      if (event === 'INITIAL_SESSION' && previousAuthState.current.userId === currentUserId && currentUserId !== null) {
        return
      }

      // Deduplicate auth state changes - check both event and user ID
      if (
        previousAuthState.current.event === event &&
        previousAuthState.current.userId === currentUserId
      ) {
        // Skip redundant auth state changes
        return
      }

      // Skip TOKEN_REFRESHED if user hasn't changed
      if (event === 'TOKEN_REFRESHED' && previousAuthState.current.userId === currentUserId) {
        return
      }

      // Update previous state tracker
      previousAuthState.current = {
        event,
        userId: currentUserId
      }

      // Only log significant events and actual changes
      if (process.env.NODE_ENV === 'development' &&
          event !== 'TOKEN_REFRESHED' &&
          event !== 'INITIAL_SESSION') {
        console.log('[ClientAuth] Auth state changed:', event, 'User ID:', currentUserId)
      }

      // Use setTimeout to prevent blocking operations as per Supabase docs
      setTimeout(async () => {
        setUser(session?.user ?? null)

        if (event === 'SIGNED_OUT') {
          setProfile(null)
          // Only redirect on sign out, not refresh the page
          router.push('/login')
        } else if (event === 'SIGNED_IN' && session?.user) {
          // Fetch profile on sign in
          try {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
            setProfile(data)
          } catch (error) {
            console.error('Error fetching profile:', error)
          }
        }

        // Remove router.refresh() calls - they cause infinite loops
        // Server components will be updated through middleware
      }, 0)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router, initialUser])

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      router.push('/login')
      // Remove router.refresh() - onAuthStateChange will handle state updates
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a ClientAuthProvider')
  }
  return context
}