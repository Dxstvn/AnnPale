"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AuthCallbackPage() {
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get parameters from URL
        const searchParams = new URLSearchParams(window.location.search)
        const code = searchParams.get('code')
        const errorParam = searchParams.get('error')
        const errorDescription = searchParams.get('error_description')

        if (errorParam) {
          setError(errorDescription || errorParam)
          return
        }

        if (!code) {
          setError('No authorization code received')
          return
        }

        // Exchange code for session
        const { data, error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
        
        if (sessionError) {
          setError(sessionError.message)
          return
        }

        if (!data.user) {
          setError('Failed to authenticate user')
          return
        }

        // Get user profile to determine role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single()

        // Redirect based on role
        const redirectPath = 
          profile?.role === 'admin' ? '/admin/dashboard' :
          profile?.role === 'creator' ? '/creator/dashboard' :
          '/fan/dashboard'

        router.push(redirectPath)
      } catch (err) {
        console.error('Auth callback error:', err)
        setError('An unexpected error occurred during authentication')
      }
    }

    handleCallback()
  }, [router, supabase])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Authentication Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex gap-4">
              <Button
                onClick={() => router.push('/login')}
                className="flex-1"
                variant="default"
              >
                Back to Login
              </Button>
              <Button
                onClick={() => router.push('/signup')}
                className="flex-1"
                variant="outline"
              >
                Sign Up
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center">Completing Authentication</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mb-4" />
          <p className="text-gray-600 text-center">
            Please wait while we complete your sign in...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}