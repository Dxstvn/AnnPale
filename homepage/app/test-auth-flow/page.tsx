'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSupabaseAuth } from '@/contexts/supabase-auth-context'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestAuthFlowPage() {
  const [logs, setLogs] = useState<string[]>([])
  const supabase = createClient()
  const { user, supabaseUser, isLoading, isAuthenticated } = useSupabaseAuth()

  const addLog = (message: string, type: string = 'info') => {
    const timestamp = new Date().toISOString().split('T')[1].substring(0, 12)
    const logEntry = `[${timestamp}] [${type.toUpperCase()}] ${message}`
    setLogs(prev => [...prev, logEntry])
    console.log(logEntry)
  }

  useEffect(() => {
    addLog('Page loaded')
    addLog(`Auth context - isLoading: ${isLoading}, isAuthenticated: ${isAuthenticated}`)
    if (user) {
      addLog(`User profile: ${user.email}, role: ${user.role}`)
    }
    if (supabaseUser) {
      addLog(`Supabase user: ${supabaseUser.email}`)
    }
  }, [isLoading, isAuthenticated, user, supabaseUser])

  const checkSession = async () => {
    addLog('Checking Supabase session...')
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        addLog(`Session error: ${error.message}`, 'error')
      } else if (session) {
        addLog(`Session found: ${session.user.email}`, 'success')
        addLog(`Access token: ${session.access_token.substring(0, 20)}...`)
        addLog(`Expires at: ${new Date(session.expires_at! * 1000).toLocaleString()}`)
      } else {
        addLog('No session found', 'warning')
      }
    } catch (err) {
      addLog(`Exception checking session: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error')
    }
  }

  const checkProfile = async () => {
    addLog('Checking profile in database...')
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        addLog('No session, cannot check profile', 'error')
        return
      }

      addLog(`Session user ID: ${session.user.id}`)
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (error) {
        addLog(`Profile error: ${error.message}`, 'error')
        if (error.code === 'PGRST116') {
          addLog('Profile does not exist in database', 'warning')
        }
      } else if (profile) {
        addLog(`Profile found: ${JSON.stringify(profile)}`, 'success')
      }
    } catch (err) {
      addLog(`Exception checking profile: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error')
    }
  }

  const testGoogleOAuth = async () => {
    addLog('Starting Google OAuth...')
    
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
          skipBrowserRedirect: true
        }
      })
      
      if (error) {
        addLog(`OAuth error: ${error.message}`, 'error')
      } else if (data?.url) {
        addLog('OAuth URL generated, opening in new tab...', 'success')
        window.open(data.url, '_blank')
      }
    } catch (err) {
      addLog(`Exception: ${err instanceof Error ? err.message : 'Unknown'}`, 'error')
    }
  }

  const navigateToDashboard = () => {
    if (!user) {
      addLog('No user profile, cannot navigate', 'error')
      return
    }
    
    const path = user.role === 'admin' ? '/admin/dashboard' :
                 user.role === 'creator' ? '/creator/dashboard' :
                 '/fan/dashboard'
    
    addLog(`Navigating to ${path}`)
    window.location.href = path
  }

  const signOut = async () => {
    addLog('Signing out...')
    await supabase.auth.signOut()
    addLog('Signed out', 'success')
  }

  const refreshPage = () => {
    addLog('Refreshing page...')
    window.location.reload()
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-2xl font-bold mb-6">Auth Flow Diagnostic</h1>
      
      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
            <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
            <div>User Email: {user?.email || 'None'}</div>
            <div>User Role: {user?.role || 'None'}</div>
            <div>Supabase User: {supabaseUser?.email || 'None'}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button onClick={checkSession} className="w-full" variant="outline">
              Check Session
            </Button>
            <Button onClick={checkProfile} className="w-full" variant="outline">
              Check Profile
            </Button>
            <Button onClick={testGoogleOAuth} className="w-full" variant="outline">
              Test Google OAuth
            </Button>
            <Button onClick={navigateToDashboard} className="w-full" variant="outline">
              Go to Dashboard
            </Button>
            <Button onClick={signOut} className="w-full" variant="outline">
              Sign Out
            </Button>
            <Button onClick={refreshPage} className="w-full" variant="outline">
              Refresh Page
            </Button>
            <Button onClick={() => setLogs([])} className="w-full" variant="outline">
              Clear Logs
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs max-h-96 overflow-y-auto">
            {logs.length > 0 ? (
              logs.map((log, i) => (
                <div 
                  key={i} 
                  className={
                    log.includes('[ERROR]') ? 'text-red-400' : 
                    log.includes('[SUCCESS]') ? 'text-green-400' : 
                    log.includes('[WARNING]') ? 'text-yellow-400' :
                    'text-blue-400'
                  }
                >
                  {log}
                </div>
              ))
            ) : (
              <div className="text-gray-500">No logs yet</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}