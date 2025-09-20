'use client'

/**
 * Compatibility layer for gradual migration from old auth system.
 * This exports the same interface as the old auth context but uses the new implementation.
 */

import { useAuth } from './client-auth-context'
import type { UserProfile } from '@/types/auth'
import { createClient } from '@/lib/supabase/client'

export function useSupabaseAuth() {
  const { user, profile, isLoading, signOut } = useAuth()
  const supabase = createClient()

  // Map to old interface for backward compatibility
  return {
    user: profile, // Old system used profile as 'user'
    supabaseUser: user, // Actual Supabase user
    isLoading,
    isAuthenticated: !!user,
    supabase,
    logout: signOut,

    // These methods are now handled differently but provided for compatibility
    login: async (email: string, password: string) => {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      return { error: error?.message }
    },

    signup: async (email: string, password: string, name: string, role: 'fan' | 'creator') => {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name, role }
        }
      })
      return { error: error?.message }
    },

    loginWithProvider: async (provider: 'google' | 'apple' | 'twitter') => {
      await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })
    },

    sendMagicLink: async (email: string) => {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      return { error: error?.message }
    },

    updateProfile: async (updates: Partial<UserProfile>) => {
      if (!user) return { error: 'No user logged in' }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)

      return { error: error?.message }
    },

    refreshSession: async () => {
      await supabase.auth.refreshSession()
    }
  }
}

// Re-export the provider with the old name
export { ClientAuthProvider as SupabaseAuthProvider } from './client-auth-context'