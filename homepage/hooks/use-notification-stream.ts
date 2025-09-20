'use client'

import { useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useNotificationStore } from '@/stores/notification-store'
import { useSupabaseAuth } from '@/contexts/supabase-auth-compat'

interface SSEMessage {
  type: 'connected' | 'unread_count' | 'new_notification' | 'notification_updated' | 'initial_notifications' | 'realtime_connected' | 'realtime_error'
  count?: number
  notification?: any
  notifications?: any[]
  error?: string
  timestamp: string
}

// Global singleton to prevent multiple SSE connections
let globalEventSource: EventSource | null = null
let globalConnectionCount = 0

export function useNotificationStream() {
  const { user, isAuthenticated } = useSupabaseAuth()
  const router = useRouter()
  const eventSourceRef = useRef<EventSource | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const reconnectAttempts = useRef(0)
  const isConnectingRef = useRef(false) // Prevent multiple connection attempts

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

  // Connect to SSE
  const connectSSE = useCallback(() => {
    if (!isAuthenticated || isConnectingRef.current) return

    // Use global singleton to prevent multiple connections
    if (globalEventSource) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[SSE] Using existing global connection, count:', globalConnectionCount)
      }
      eventSourceRef.current = globalEventSource
      globalConnectionCount++
      return
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
              console.error('[SSE] Real-time subscription error:', data.error)
              // Fall back to polling if real-time fails
              startPolling()
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
          console.error('[SSE] Connection closed unexpectedly')
        } else if (eventSource.readyState === EventSource.CONNECTING) {
          console.error('[SSE] Failed to establish connection')
        } else {
          console.error('[SSE] Connection error occurred')
        }

        setConnectionStatus(false, 'Connection lost')
        eventSource.close()
        eventSourceRef.current = null

        // Start polling as fallback
        startPolling()

        // Attempt reconnection with exponential backoff
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000)
        reconnectAttempts.current++

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current)
        }

        reconnectTimeoutRef.current = setTimeout(() => {
          if (isAuthenticated) {
            if (process.env.NODE_ENV === 'development') {
              console.log(`[SSE] Attempting reconnection in ${delay}ms`)
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
    setConnectionStatus,
    setUnreadCount,
    addNotification,
    updateNotification,
    startPolling,
    stopPolling
  ])

  // Disconnect from SSE
  const disconnectSSE = useCallback(() => {
    isConnectingRef.current = false

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

  // Handle visibility change (poll when tab becomes active)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated && !eventSourceRef.current) {
        pollNotifications()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isAuthenticated, pollNotifications])

  return {
    isConnected: useNotificationStore((state) => state.isConnected),
    isPolling: useNotificationStore((state) => state.isPolling),
    connectionError: useNotificationStore((state) => state.connectionError)
  }
}