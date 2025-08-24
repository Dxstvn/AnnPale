'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestOAuthPage() {
  const [logs, setLogs] = useState<string[]>([])
  const supabase = createClient()

  const addLog = (message: string, type: string = 'info') => {
    const timestamp = new Date().toISOString().split('T')[1].substring(0, 12)
    const logEntry = `[${timestamp}] [${type.toUpperCase()}] ${message}`
    setLogs(prev => [...prev, logEntry])
    console.log(logEntry)
  }

  useEffect(() => {
    addLog('Page loaded')
    checkSession()

    // Check for callback code in URL
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')
    const error = urlParams.get('error')
    
    if (error) {
      addLog(`OAuth error in URL: ${error}`, 'error')
    } else if (code) {
      addLog(`Found callback code: ${code}`)
      handleCodeExchange(code)
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      addLog(`Auth state changed: ${event}`)
      if (session) {
        addLog(`Session user: ${session.user.email}`, 'success')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkSession = async () => {
    addLog('Checking session...')
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      addLog(`Session error: ${error.message}`, 'error')
    } else if (session) {
      addLog(`Active session: ${session.user.email}`, 'success')
      addLog(`Provider: ${session.user.app_metadata.provider}`)
    } else {
      addLog('No active session')
    }
  }

  const handleCodeExchange = async (code: string) => {
    addLog('Starting code exchange...')
    const startTime = Date.now()
    
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)
      const duration = Date.now() - startTime
      addLog(`Exchange completed in ${duration}ms`)
      
      if (error) {
        addLog(`Exchange error: ${error.message}`, 'error')
      } else if (data?.session) {
        addLog('Session established!', 'success')
        addLog(`User: ${data.session.user.email}`, 'success')
      } else {
        addLog('No session data returned', 'error')
      }
    } catch (err) {
      const duration = Date.now() - startTime
      addLog(`Exchange failed after ${duration}ms: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error')
    }
  }

  const testGoogleOAuth = async () => {
    addLog('Testing Google OAuth...')
    
    // Check cookies before
    const cookies = document.cookie.split(';').map(c => c.trim())
    const supabaseCookies = cookies.filter(c => c.includes('supabase'))
    addLog(`Found ${supabaseCookies.length} Supabase cookies`)
    supabaseCookies.forEach(c => {
      const [name] = c.split('=')
      addLog(`  Cookie: ${name}`)
    })

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/test-oauth',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      if (error) {
        addLog(`OAuth error: ${error.message}`, 'error')
      } else {
        addLog('OAuth initiated successfully', 'success')
        addLog('Redirecting to Google...')
      }
    } catch (err) {
      addLog(`Exception: ${err instanceof Error ? err.message : 'Unknown error'}`, 'error')
    }
  }

  const signOut = async () => {
    addLog('Signing out...')
    const { error } = await supabase.auth.signOut()
    if (error) {
      addLog(`Sign out error: ${error.message}`, 'error')
    } else {
      addLog('Signed out successfully', 'success')
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">OAuth Flow Test</h1>
      
      <div className="mb-6 space-x-2">
        <button 
          onClick={testGoogleOAuth}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Google OAuth
        </button>
        <button 
          onClick={checkSession}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Check Session
        </button>
        <button 
          onClick={signOut}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Sign Out
        </button>
        <button 
          onClick={() => setLogs([])}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
        >
          Clear Logs
        </button>
      </div>

      <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-xs max-h-96 overflow-y-auto">
        {logs.length > 0 ? (
          logs.map((log, i) => (
            <div 
              key={i} 
              className={
                log.includes('[ERROR]') ? 'text-red-400' : 
                log.includes('[SUCCESS]') ? 'text-green-400' : 
                'text-blue-400'
              }
            >
              {log}
            </div>
          ))
        ) : (
          <div className="text-gray-500">No logs yet. Click a button to start.</div>
        )}
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-sm">
          <strong>Note:</strong> This page will redirect to itself after OAuth, so you can see the full flow including code exchange.
        </p>
      </div>
    </div>
  )
}