"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AuthCallbackPage() {
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from URL
        const code = new URLSearchParams(window.location.search).get('code')
        
        if (code) {
          // Exchange code for session
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          
          if (error) {
            console.error('Error exchanging code for session:', error)
            router.push('/auth/login?error=callback_failed')
            return
          }

          // Get user profile to determine role
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', data.user?.id)
            .single()

          // Redirect based on role
          if (profile?.role === 'admin') {
            router.push('/admin/dashboard')
          } else if (profile?.role === 'creator') {
            router.push('/creator/dashboard')
          } else {
            router.push('/fan/dashboard')
          }
        } else {
          // No code, redirect to login
          router.push('/auth/login')
        }
      } catch (error) {
        console.error('Callback error:', error)
        router.push('/auth/login?error=callback_failed')
      }
    }

    handleCallback()
  }, [router, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Authenticating...</p>
      </div>
    </div>
  )
}