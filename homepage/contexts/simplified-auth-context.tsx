"use client"

/**
 * Simplified Supabase Authentication Context
 * @module contexts/simplified-auth-context
 * 
 * Leverages Supabase's built-in patterns for better auth state management
 */

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'
import type { UserProfile } from '@/types/auth'
import { 
  signInWithEmail, 
  signUpWithEmail, 
  signOut,
  getCurrentUser,
  getRedirectPath 
} from '@/lib/supabase/auth-helpers'

interface AuthContextType {
  user: UserProfile | null
  supabaseUser: SupabaseUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  signup: (email: string, password: string, name: string, role: 'fan' | 'creator') => Promise<{ error?: string }>
  logout: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function SimplifiedAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Initialize auth state and listen for changes
  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { user: currentUser, profile } = await getCurrentUser()
      setSupabaseUser(currentUser)
      setUser(profile)
      setIsLoading(false)
    }
    
    getInitialSession()

    // Listen for auth changes using Supabase's recommended pattern
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('[Auth] State changed:', event)
        
        if (session?.user) {
          setSupabaseUser(session.user)
          
          // Fetch profile for the user
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
          
          setUser(profile as UserProfile | null)
        } else {
          setSupabaseUser(null)
          setUser(null)
        }
        
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [supabase])

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    const result = await signInWithEmail(email, password)
    
    if (!result.success) {
      return { error: result.error }
    }
    
    // Navigate to appropriate page
    if (result.redirectPath) {
      router.push(result.redirectPath)
    }
    
    return {}
  }

  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    role: 'fan' | 'creator'
  ): Promise<{ error?: string }> => {
    const result = await signUpWithEmail(email, password, name, role)
    
    if (!result.success) {
      return { error: result.error }
    }
    
    // Navigate to appropriate page
    if (result.redirectPath) {
      router.push(result.redirectPath)
    }
    
    return {}
  }

  const logout = async () => {
    await signOut()
    setUser(null)
    setSupabaseUser(null)
    router.push('/')
  }

  const refreshProfile = async () => {
    if (supabaseUser) {
      const { profile } = await getCurrentUser()
      setUser(profile)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      supabaseUser,
      isLoading,
      isAuthenticated: !!supabaseUser,
      login,
      signup,
      logout,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useSimplifiedAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useSimplifiedAuth must be used within a SimplifiedAuthProvider')
  }
  return context
}