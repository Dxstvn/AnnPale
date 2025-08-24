'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function SignOutTestPage() {
  const [status, setStatus] = useState<string>('')
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    setStatus('Signing out...')
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        setStatus(`Error: ${error.message}`)
        console.error('Sign out error:', error)
      } else {
        setStatus('Signed out successfully! Redirecting...')
        console.log('Signed out successfully')
        
        // Clear any remaining session data
        localStorage.clear()
        sessionStorage.clear()
        
        // Force reload to clear any cached state
        setTimeout(() => {
          window.location.href = '/'
        }, 1000)
      }
    } catch (err) {
      setStatus(`Exception: ${err}`)
      console.error('Sign out exception:', err)
    }
  }

  const checkSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    if (error) {
      setStatus(`Session check error: ${error.message}`)
    } else if (session) {
      setStatus(`Logged in as: ${session.user.email}`)
    } else {
      setStatus('No active session')
    }
  }

  const forceSignOut = () => {
    // Clear all auth-related storage
    localStorage.clear()
    sessionStorage.clear()
    
    // Clear cookies via API
    fetch('/api/auth/signout', { method: 'POST' })
      .then(() => {
        setStatus('Force signed out! Redirecting...')
        setTimeout(() => {
          window.location.href = '/'
        }, 1000)
      })
      .catch(err => {
        setStatus(`API signout error: ${err}`)
      })
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Out Test Page</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Button 
              onClick={checkSession} 
              className="w-full"
              variant="outline"
            >
              Check Current Session
            </Button>
            
            <Button 
              onClick={handleSignOut} 
              className="w-full"
              variant="default"
            >
              Sign Out (Normal)
            </Button>
            
            <Button 
              onClick={forceSignOut} 
              className="w-full"
              variant="destructive"
            >
              Force Sign Out (Clear Everything)
            </Button>
            
            <Button 
              onClick={() => router.push('/login')} 
              className="w-full"
              variant="outline"
            >
              Go to Login Page
            </Button>
          </div>
          
          {status && (
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="text-sm font-mono">{status}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}