'use client'

import { useEffect } from 'react'
import { useSupabaseAuth } from '@/contexts/supabase-auth-compat'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function LogoutPage() {
  const { logout } = useSupabaseAuth()
  const router = useRouter()

  useEffect(() => {
    const performLogout = async () => {
      console.log('Logging out...')
      try {
        await logout()
        console.log('Logout successful, redirecting...')
        // Force redirect to home page
        router.push('/')
      } catch (error) {
        console.error('Logout error:', error)
        // Still redirect even if there's an error
        router.push('/')
      }
    }
    
    performLogout()
  }, [logout, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Signing out...</p>
      </div>
    </div>
  )
}