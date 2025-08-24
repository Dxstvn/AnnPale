'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

export default function AuthDebugPage() {
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [sessionInfo, setSessionInfo] = useState<any>(null)
  const supabase = createClient()

  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().split('T')[1]
    setLogs(prev => [...prev, `[${timestamp}] ${message}`])
    console.log(`[DEBUG] ${message}`)
  }

  useEffect(() => {
    checkCurrentSession()
  }, [])

  const checkCurrentSession = async () => {
    addLog('Checking current session...')
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      addLog(`Session check error: ${error.message}`)
    } else if (session) {
      addLog(`Active session found: ${session.user.email}`)
      setSessionInfo(session)
    } else {
      addLog('No active session')
    }
  }

  const testOAuthFlow = async (provider: 'google' | 'twitter') => {
    setIsLoading(true)
    setLogs([])
    
    try {
      addLog(`Starting OAuth flow with ${provider}...`)
      
      // Check cookies before
      addLog('Checking cookies before OAuth...')
      const cookies = document.cookie.split(';').map(c => c.trim())
      const supabaseCookies = cookies.filter(c => c.includes('supabase'))
      addLog(`Found ${supabaseCookies.length} Supabase cookies`)
      supabaseCookies.forEach(c => {
        const [name] = c.split('=')
        addLog(`  - ${name}`)
      })

      // Get the redirect URL
      const redirectUrl = `${window.location.origin}/auth/callback`
      addLog(`Redirect URL: ${redirectUrl}`)

      // Start OAuth
      addLog('Calling signInWithOAuth...')
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider,
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true // Don't redirect, just get the URL
        }
      })

      if (error) {
        addLog(`OAuth error: ${error.message}`)
        setIsLoading(false)
        return
      }

      if (data?.url) {
        addLog(`OAuth URL generated: ${data.url.substring(0, 100)}...`)
        
        // Parse the URL
        const url = new URL(data.url)
        addLog(`OAuth endpoint: ${url.hostname}${url.pathname}`)
        addLog(`State param: ${url.searchParams.get('state')?.substring(0, 50)}...`)
        addLog(`Redirect URI: ${url.searchParams.get('redirect_uri')}`)
        
        // Check cookies after
        addLog('Checking cookies after OAuth init...')
        const cookiesAfter = document.cookie.split(';').map(c => c.trim())
        const supabaseCookiesAfter = cookiesAfter.filter(c => c.includes('supabase'))
        const newCookies = supabaseCookiesAfter.filter(c => !supabaseCookies.includes(c))
        if (newCookies.length > 0) {
          addLog(`New cookies created: ${newCookies.length}`)
          newCookies.forEach(c => {
            const [name] = c.split('=')
            addLog(`  - ${name}`)
          })
        }

        addLog('Ready to redirect. Click "Open OAuth URL" to continue.')
        
        // Store URL for manual opening
        (window as any).__oauth_url = data.url
      }
    } catch (err) {
      addLog(`Exception: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testCodeExchange = async () => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code') || prompt('Enter the code from the callback URL:')
    
    if (!code) {
      addLog('No code provided')
      return
    }

    setIsLoading(true)
    setLogs([])
    
    try {
      addLog(`Testing code exchange with: ${code}`)
      addLog('Checking cookies before exchange...')
      
      const cookies = document.cookie.split(';').map(c => c.trim())
      const verifierCookie = cookies.find(c => c.includes('code-verifier'))
      if (verifierCookie) {
        addLog(`Found code verifier cookie: ${verifierCookie.substring(0, 50)}...`)
      } else {
        addLog('WARNING: No code verifier cookie found!')
      }

      addLog('Starting exchange...')
      const startTime = Date.now()
      
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      
      const duration = Date.now() - startTime
      addLog(`Exchange completed in ${duration}ms`)
      
      if (error) {
        addLog(`Exchange error: ${error.message}`)
        if (error.message.includes('invalid_grant')) {
          addLog('This usually means the code was already used or expired')
        }
      } else if (data?.session) {
        addLog(`Success! Session created for: ${data.session.user.email}`)
        setSessionInfo(data.session)
      } else {
        addLog('No error but no session data returned')
      }
    } catch (err) {
      addLog(`Exception during exchange: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsLoading(false)
    }
  }

  const clearSession = async () => {
    addLog('Signing out...')
    await supabase.auth.signOut()
    setSessionInfo(null)
    addLog('Signed out')
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">OAuth Debug Tool</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Session</CardTitle>
          </CardHeader>
          <CardContent>
            {sessionInfo ? (
              <div className="space-y-2 text-sm">
                <p><strong>User ID:</strong> {sessionInfo.user.id}</p>
                <p><strong>Email:</strong> {sessionInfo.user.email}</p>
                <p><strong>Provider:</strong> {sessionInfo.user.app_metadata?.provider || 'email'}</p>
                <p><strong>Expires:</strong> {new Date(sessionInfo.expires_at * 1000).toLocaleString()}</p>
                <Button onClick={clearSession} variant="destructive" size="sm" className="mt-2">
                  Sign Out
                </Button>
              </div>
            ) : (
              <p className="text-gray-500">No active session</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test OAuth Flow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={() => testOAuthFlow('google')} 
                  disabled={isLoading}
                  variant="outline"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Test Google OAuth
                </Button>
                <Button 
                  onClick={() => testOAuthFlow('twitter')} 
                  disabled={isLoading}
                  variant="outline"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Test X OAuth
                </Button>
              </div>
              
              {typeof window !== 'undefined' && (window as any).__oauth_url && (
                <div className="space-y-2">
                  <Button
                    onClick={() => window.open((window as any).__oauth_url, '_blank')}
                    className="w-full"
                  >
                    Open OAuth URL in New Tab
                  </Button>
                  <p className="text-xs text-gray-500">
                    After authenticating, copy the code from the callback URL and use "Test Code Exchange" below
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Code Exchange</CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={testCodeExchange} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Test Code Exchange
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              Enter the code from the callback URL after OAuth
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Debug Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 text-gray-100 p-4 rounded font-mono text-xs max-h-96 overflow-y-auto">
              {logs.length > 0 ? (
                logs.map((log, i) => (
                  <div key={i} className="mb-1">{log}</div>
                ))
              ) : (
                <div className="text-gray-500">No logs yet. Try an action above.</div>
              )}
            </div>
            {logs.length > 0 && (
              <Button 
                onClick={() => setLogs([])} 
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                Clear Logs
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}