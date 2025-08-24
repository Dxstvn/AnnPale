"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useSupabaseAuth } from '@/contexts/supabase-auth-context'

export function ProfileRedirect() {
  const router = useRouter()
  const pathname = usePathname()
  const { user, supabaseUser, isLoading } = useSupabaseAuth()
  
  useEffect(() => {
    console.log('[ProfileRedirect] Check:', {
      pathname,
      isLoading,
      hasSupabaseUser: !!supabaseUser,
      hasProfile: !!user
    })
    
    // Skip if still loading
    if (isLoading) {
      console.log('[ProfileRedirect] Still loading, skipping')
      return
    }
    
    // Skip if on auth pages
    if (pathname.startsWith('/auth/') || pathname === '/login' || pathname === '/signup') {
      console.log('[ProfileRedirect] On auth page, skipping')
      return
    }
    
    // If authenticated but no profile, redirect to role selection
    if (supabaseUser && !user) {
      console.log('[ProfileRedirect] Authenticated user without profile, redirecting to role selection')
      router.push('/auth/role-selection')
    }
  }, [user, supabaseUser, isLoading, pathname, router])
  
  return null
}