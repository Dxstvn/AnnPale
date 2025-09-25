'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useNotificationStore } from '@/stores/notification-store'
import { useSupabaseAuth } from '@/contexts/supabase-auth-compat'
import { SessionManager } from '@/lib/auth/session-manager'

interface SSEMessage {
  type: 'connected' | 'unread_count' | 'new_notification' | 'notification_updated' | 'initial_notifications' | 'realtime_connected' | 'realtime_error' | 'realtime_unavailable' | 'reconnect_required'
  count?: number
  notification?: any
  notifications?: any[]
  error?: string
  reason?: string
  fallback?: string
  message?: string
  timestamp: string
}

// Global singleton to prevent multiple SSE connections
let globalEventSource: EventSource | null = null
let globalConnectionCount = 0

export function useNotificationStream() {
  const { user, isAuthenticated, supabase } = useSupabaseAuth()
  const router = useRouter()
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const sessionMonitorRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const isConnectingRef = useRef(false) // Prevent multiple connection attempts
  const sessionManagerRef = useRef<SessionManager | null>(null)

  const {
    addNotification,
    updateNotification,
    setUnreadCount,
    setConnectionStatus,
    setPollingStatus,
    setLastFetch,
    setNotifications
  } = useNotificationStore()

  // Polling fallback
  const pollNotifications = useCallback(async () => {
    if (!isAuthenticated) return

    try {
      setPollingStatus(true)
      const response = await fetch('/api/notifications/poll')

      if (!response.ok) {
        // Don't throw, just log and return
        console.warn(`[Polling] Server returned ${response.status}`)
        return
      }

      const data = await response.json()
      setNotifications(data.notifications)
      setUnreadCount(data.unreadCount)
      setLastFetch(data.timestamp)
    } catch (error: any) {
      // Handle different error types gracefully
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        // Network error - this is expected when offline or server is down
        console.warn('[Polling] Network error - unable to reach server')
      } else if (error.message?.includes('interrupted')) {
        // User interrupted (page navigation) - don't log as error
        // Silent fail
      } else {
        // Unexpected error
        console.warn('[Polling] Unexpected error:', error.message || error)
      }
    } finally {
      setPollingStatus(false)
    }
  }, [isAuthenticated, setNotifications, setUnreadCount, setLastFetch, setPollingStatus])

  // Start polling
  const startPolling = useCallback(() => {
    // Clear any existing polling
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
    }

    // Poll immediately
    pollNotifications()

    // Set up interval (30 seconds)
    pollingIntervalRef.current = setInterval(pollNotifications, 30000)
  }, [pollNotifications])

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current)
      pollingIntervalRef.current = null
    }
    setPollingStatus(false)
  }, [setPollingStatus])

  // Connect to SSE with auth check
  const connectSSE = useCallback(async () => {
    if (!isAuthenticated || isConnectingRef.current) return

    // Initialize session manager if needed
    if (!sessionManagerRef.current && supabase) {
      sessionManagerRef.current = SessionManager.getInstance(supabase)
    }

    // Check and refresh session if needed before connecting
    if (sessionManagerRef.current) {
      const sessionValid = await sessionManagerRef.current.refreshSession()
      if (!sessionValid) {
        console.warn('[SSE] Session refresh failed, falling back to polling')
        startPolling()
        return
      }
    }

    // Check health of global connection before reusing
    if (globalEventSource && globalEventSource.readyState === EventSource.OPEN) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[SSE] Using existing healthy global connection, count:', globalConnectionCount)
      }
      eventSourceRef.current = globalEventSource
      globalConnectionCount++
      return
    } else if (globalEventSource) {
      // Global connection exists but is not healthy, clean it up
      if (process.env.NODE_ENV === 'development') {
        console.log('[SSE] Cleaning up unhealthy global connection')
      }
      globalEventSource.close()
      globalEventSource = null
      globalConnectionCount = 0
    }

    // Close existing local connection if any
    if (eventSourceRef.current && eventSourceRef.current !== globalEventSource) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }

    isConnectingRef.current = true

    try {
      const eventSource = new EventSource('/api/notifications/stream')
      eventSourceRef.current = eventSource
      globalEventSource = eventSource
      globalConnectionCount = 1

      eventSource.onopen = () => {
        isConnectingRef.current = false
        if (process.env.NODE_ENV === 'development') {
          console.log('SSE connection established')
        }
        setConnectionStatus(true)
        reconnectAttempts.current = 0
        stopPolling() // Stop polling when SSE is connected

        // Start monitoring session expiry
        startSessionMonitoring()
      }

      eventSource.onmessage = (event) => {
        try {
          const data: SSEMessage = JSON.parse(event.data)

          switch (data.type) {
            case 'connected':
              if (process.env.NODE_ENV === 'development') {
                console.log('SSE connected at:', data.timestamp)
              }
              break

            case 'initial_notifications':
              if (data.notifications) {
                if (process.env.NODE_ENV === 'development') {
                  console.log('[SSE] Received initial notifications:', data.notifications.length, 'notifications')
                  console.log('[SSE] First notification:', data.notifications[0])
                }
                // Call setNotifications and log the result
                console.log('[SSE] Calling setNotifications with', data.notifications.length, 'items')
                setNotifications(data.notifications)
                console.log('[SSE] setNotifications called successfully')
              }
              break

            case 'unread_count':
              setUnreadCount(data.count || 0)
              break

            case 'new_notification':
              if (data.notification) {
                console.log('[SSE] Received new notification:', data.notification)
                addNotification(data.notification)
              } else {
                console.warn('[SSE] new_notification event without notification data')
              }
              break

            case 'notification_updated':
              if (data.notification) {
                updateNotification(data.notification.id, data.notification)
              }
              break

            case 'realtime_connected':
              if (process.env.NODE_ENV === 'development') {
                console.log('[SSE] Real-time subscription confirmed at:', data.timestamp)
              }
              break

            case 'realtime_error':
              // This is now a hard error - should be rare
              console.error('[SSE] Real-time subscription error:', data.error)
              // Fall back to polling if real-time fails
              startPolling()
              break

            case 'realtime_unavailable':
              // This is expected in some environments - use debug log instead of error
              if (process.env.NODE_ENV === 'development') {
                console.log('[SSE] Real-time unavailable, using polling fallback')
              }
              // Start polling as a fallback
              startPolling()
              break

            case 'reconnect_required':
              if (process.env.NODE_ENV === 'development') {
                console.log('[SSE] Server requested reconnection:', data.reason)
              }
              // Close current connection and reconnect
              eventSource.close()
              eventSourceRef.current = null
              globalEventSource = null
              globalConnectionCount = 0

              // If session is expiring, refresh it first
              if (data.reason === 'session_expiring' || data.reason === 'session_expired') {
                if (sessionManagerRef.current) {
                  sessionManagerRef.current.refreshSession().then(() => {
                    if (isAuthenticated) {
                      connectSSE()
                    }
                  })
                }
              } else {
                // Reconnect after a short delay for other reasons
                setTimeout(() => {
                  if (isAuthenticated) {
                    connectSSE()
                  }
                }, 1000)
              }
              break
          }
        } catch (error) {
          console.error('SSE message parse error:', error)
        }
      }

      eventSource.onerror = (error) => {
        isConnectingRef.current = false

        // Don't log the raw error event as it's typically empty
        // Instead, provide meaningful context based on the connection state
        if (eventSource.readyState === EventSource.CLOSED) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[SSE] Connection closed - will reconnect')
          }
        } else if (eventSource.readyState === EventSource.CONNECTING) {
          // This is a normal reconnection attempt, not an error
          if (reconnectAttempts.current === 0) {
            console.warn('[SSE] Connection interrupted - attempting to reconnect')
          }
        } else {
          console.warn('[SSE] Connection issue detected')
        }

        setConnectionStatus(false, 'Reconnecting...')
        eventSource.close()
        eventSourceRef.current = null
        globalEventSource = null
        globalConnectionCount = 0

        // Start polling as fallback
        startPolling()

        // Attempt reconnection with exponential backoff and jitter
        const baseDelay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
        const jitter = Math.random() * 1000 // Add 0-1 second of random jitter
        const delay = baseDelay + jitter
        reconnectAttempts.current++

        // Don't attempt reconnection if we've failed too many times
        if (reconnectAttempts.current > 10) {
          console.warn('[SSE] Max reconnection attempts reached, falling back to polling only')
          return
        }

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
        }

        reconnectTimeoutRef.current = setTimeout(() => {
          if (isAuthenticated) {
            if (process.env.NODE_ENV === 'development') {
              console.log(`[SSE] Attempting reconnection (attempt ${reconnectAttempts.current})`)
            }
            connectSSE()
          }
        }, delay)
      }
    } catch (error: any) {
      isConnectingRef.current = false
      // Log a meaningful error message instead of the error object
      console.warn('[SSE] Failed to establish connection:', error.message || 'Unknown error')
      setConnectionStatus(false, 'Failed to connect')
      startPolling() // Fall back to polling
    }
  }, [
    isAuthenticated,
    supabase,
    setConnectionStatus,
    setUnreadCount,
    addNotification,
    updateNotification,
    startPolling,
    stopPolling
  ])

  // Start monitoring session expiry (defined without dependencies to avoid circular ref)
  const startSessionMonitoring = useCallback(() => {
    if (!sessionManagerRef.current) return

    // Clear existing monitor
    if (sessionMonitorRef.current) {
      clearInterval(sessionMonitorRef.current)
    }

    // Check session every minute
    sessionMonitorRef.current = setInterval(async () => {
      if (!sessionManagerRef.current) return

      const sessionInfo = await sessionManagerRef.current.getSessionInfo()
      if (!sessionInfo) {
        // No session, disconnect
        if (eventSourceRef.current) {
          eventSourceRef.current.close()
          eventSourceRef.current = null
        }
        return
      }

      const timeUntilExpiry = sessionInfo.expiresAt - Date.now()

      // If session expires in less than 5 minutes, proactively reconnect
      if (timeUntilExpiry < 5 * 60 * 1000 && timeUntilExpiry > 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[SSE] Session expiring soon, refreshing and reconnecting')
        }

        // Refresh session
        const refreshed = await sessionManagerRef.current.refreshSession()
        if (refreshed) {
          // Send a heartbeat to confirm connection is still alive
          // The server will detect the refreshed session on next auth check
          if (process.env.NODE_ENV === 'development') {
            console.log('[SSE] Session refreshed successfully')
          }
        } else {
          // If refresh fails, trigger reconnection
          if (eventSourceRef.current) {
            eventSourceRef.current.close()
          }
        }
      }
    }, 60000) // Check every minute
  }, [])

  // Disconnect from SSE
  const disconnectSSE = useCallback(() => {
    isConnectingRef.current = false

    // Stop session monitoring
    if (sessionMonitorRef.current) {
      clearInterval(sessionMonitorRef.current)
      sessionMonitorRef.current = null
    }

    // Decrement global connection count
    if (globalConnectionCount > 0) {
      globalConnectionCount--
      if (process.env.NODE_ENV === 'development') {
        console.log('[SSE] Disconnecting, remaining connections:', globalConnectionCount)
      }
    }

    // Only close global connection when no more consumers
    if (globalConnectionCount === 0 && globalEventSource) {
      globalEventSource.close()
      globalEventSource = null
      if (process.env.NODE_ENV === 'development') {
        console.log('[SSE] Closing global connection')
      }
    }

    if (eventSourceRef.current) {
      eventSourceRef.current = null
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }

    stopPolling()
    setConnectionStatus(false)
  }, [setConnectionStatus, stopPolling])

  // Connect when authenticated
  useEffect(() => {
    // Prevent double connection in React Strict Mode
    let mounted = true

    if (isAuthenticated && mounted) {
      // Try SSE first
      connectSSE()

      // If SSE fails, polling will start automatically
    } else {
      disconnectSSE()
    }

    return () => {
      mounted = false
      disconnectSSE()
    }
  }, [isAuthenticated, connectSSE, disconnectSSE])

  // Poll immediately on route change
  useEffect(() => {
    if (isAuthenticated && !eventSourceRef.current) {
      pollNotifications()
    }
  }, [router, isAuthenticated, pollNotifications])

  // Handle visibility change (reconnect when tab becomes active)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        // Tab became visible
        if (!eventSourceRef.current || eventSourceRef.current.readyState !== EventSource.OPEN) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[SSE] Tab became visible, reconnecting...')
          }
          // Reset reconnection attempts when tab becomes active
          reconnectAttempts.current = 0
          connectSSE()
        } else {
          // Connection exists, just poll for latest data
          pollNotifications()
        }
      } else if (document.visibilityState === 'hidden') {
        // Tab became hidden - could optionally close connection to save resources
        // but we'll keep it open for now for better UX
        if (process.env.NODE_ENV === 'development') {
          console.log('[SSE] Tab became hidden')
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isAuthenticated, pollNotifications, connectSSE])

  return {
    isConnected: useNotificationStore((state) => state.isConnected),
    isPolling: useNotificationStore((state) => state.isPolling),
    connectionError: useNotificationStore((state) => state.connectionError)
  }
}