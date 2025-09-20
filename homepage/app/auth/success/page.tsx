'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabaseAuth } from '@/contexts/supabase-auth-compat'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export default function AuthSuccessPage() {
  const router = useRouter()
  const { user, isLoading, isAuthenticated } = useSupabaseAuth()

  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      // Redirect based on role after a short delay
      const redirectPath = 
        user.role === 'admin' ? '/admin/dashboard' :
        user.role === 'creator' ? '/creator/dashboard' :
        '/fan/dashboard'
      
      setTimeout(() => {
        router.push(redirectPath)
      }, 2000)
    }
  }, [isLoading, isAuthenticated, user, router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <CardTitle className="text-2xl">Authentication Successful!</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-600 mb-4">
            Welcome back{user?.name ? `, ${user.name}` : ''}!
          </p>
          <p className="text-sm text-gray-500">
            Redirecting you to your dashboard...
          </p>
          <div className="mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}