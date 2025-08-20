"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User as SupabaseUser } from '@supabase/supabase-js'
import type { UserRole, UserProfile } from '@/types/auth'

interface AuthContextType {
  user: UserProfile | null
  supabaseUser: SupabaseUser | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  signup: (email: string, password: string, name: string, role: 'fan' | 'creator') => Promise<{ error?: string }>
  loginWithProvider: (provider: 'google' | 'apple' | 'twitter') => Promise<void>
  sendMagicLink: (email: string) => Promise<{ error?: string }>
  logout: () => Promise<void>
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const response = await fetch('/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        return data.profile
      }
      return null
    } catch (error) {
      console.error('Error fetching profile:', error)
      return null
    }
  }

  // Check for existing session on mount
  useEffect(() => {
    checkAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event)
      
      if (session?.user) {
        setSupabaseUser(session.user)
        const profile = await fetchUserProfile(session.user.id)
        setUser(profile)
      } else {
        setSupabaseUser(null)
        setUser(null)
      }
      
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        setSupabaseUser(session.user)
        const profile = await fetchUserProfile(session.user.id)
        setUser(profile)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Login failed' }
      }

      // Redirect based on role
      if (data.user) {
        const redirectPath = 
          data.user.role === 'admin' ? '/admin/dashboard' :
          data.user.role === 'creator' ? '/creator/dashboard' :
          '/fan/dashboard'
        
        router.push(redirectPath)
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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role })
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || 'Signup failed' }
      }

      // Auto-login after signup
      await login(email, password)
      return {}
    } catch (error) {
      console.error('Signup error:', error)
      return { error: 'An unexpected error occurred' }
    }
  }

  const loginWithProvider = async (provider: 'google' | 'apple' | 'twitter') => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, email: '' })
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to OAuth provider
        window.location.href = data.url
      }
    } catch (error) {
      console.error('OAuth login error:', error)
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
      await fetch('/api/auth/logout', { method: 'POST' })
      await supabase.auth.signOut()
      setUser(null)
      setSupabaseUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
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

  return (
    <AuthContext.Provider 
      value={{
        user,
        supabaseUser,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        loginWithProvider,
        sendMagicLink,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useSupabaseAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider')
  }
  return context
}