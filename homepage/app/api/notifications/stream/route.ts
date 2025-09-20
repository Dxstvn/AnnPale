import { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/server'

// SSE endpoint for real-time notifications
export async function GET(request: NextRequest) {
  // Verify authentication
  const user = await getUser()
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const encoder = new TextEncoder()
  const supabase = await createClient()

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection message
      const connectMessage = `data: ${JSON.stringify({
        type: 'connected',
        timestamp: new Date().toISOString()
      })}\n\n`
      controller.enqueue(encoder.encode(connectMessage))

      // Send initial notifications and count
      const { data: notifications, error: notifError } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      if (!notifError && notifications) {
        const notificationsMessage = `data: ${JSON.stringify({
          type: 'initial_notifications',
          notifications: notifications,
          timestamp: new Date().toISOString()
        })}\n\n`
        controller.enqueue(encoder.encode(notificationsMessage))
      }

      // Send initial unread count
      const unreadCount = notifications?.filter(n => !n.is_read).length || 0
      const countMessage = `data: ${JSON.stringify({
        type: 'unread_count',
        count: unreadCount,
        timestamp: new Date().toISOString()
      })}\n\n`
      controller.enqueue(encoder.encode(countMessage))

      // Set up heartbeat to keep connection alive
      const heartbeatInterval = setInterval(() => {
        try {
          const heartbeat = `: heartbeat ${new Date().toISOString()}\n\n`
          controller.enqueue(encoder.encode(heartbeat))
        } catch (error) {
          clearInterval(heartbeatInterval)
        }
      }, 30000) // Send heartbeat every 30 seconds

      // Set up database listener for new notifications
      let channel: any = null

      try {
        // Subscribe to notifications table changes
        // Using '*' for all events to debug
        channel = supabase
          .channel(`notifications_all_${user.id}`)
          .on(
            'postgres_changes',
            {
              event: '*',  // Listen to all events
              schema: 'public',
              table: 'notifications'
            },
            (payload) => {
              console.log('[SSE Server] Database event received:', payload.eventType, payload)
              try {
                // Handle different event types
                if (payload.eventType === 'INSERT') {
                  // Filter for current user's notifications
                  if (payload.new && payload.new.user_id === user.id) {
                    console.log('[SSE Server] New notification for current user')
                    const message = `data: ${JSON.stringify({
                      type: 'new_notification',
                      notification: payload.new,
                      timestamp: new Date().toISOString()
                    })}\n\n`
                    controller.enqueue(encoder.encode(message))
                  } else {
                    console.log('[SSE Server] Notification for different user:', payload.new?.user_id)
                  }
                } else if (payload.eventType === 'UPDATE') {
                  if (payload.new && payload.new.user_id === user.id) {
                    console.log('[SSE Server] Updated notification for current user')
                    const message = `data: ${JSON.stringify({
                      type: 'notification_updated',
                      notification: payload.new,
                      timestamp: new Date().toISOString()
                    })}\n\n`
                    controller.enqueue(encoder.encode(message))
                  }
                }
              } catch (error) {
                console.error('[SSE Server] Error processing event:', error)
              }
            }
          )
          // Removed separate UPDATE handler since we're using * for all events
          .subscribe((status, error) => {
            console.log('[SSE Server] Realtime subscription status:', status, error)
            if (status === 'SUBSCRIBED') {
              console.log('[SSE Server] Successfully subscribed to notifications table')
              // Send a confirmation message
              const confirmMessage = `data: ${JSON.stringify({
                type: 'realtime_connected',
                timestamp: new Date().toISOString()
              })}\n\n`
              controller.enqueue(encoder.encode(confirmMessage))
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              console.error('[SSE Server] Error subscribing to notifications table:', error)
              // Send error message to client
              const errorMessage = `data: ${JSON.stringify({
                type: 'realtime_error',
                error: 'Failed to subscribe to real-time updates',
                timestamp: new Date().toISOString()
              })}\n\n`
              controller.enqueue(encoder.encode(errorMessage))
            }
          })
      } catch (error) {
        console.error('[SSE Server] Error setting up database listener:', error)
      }

      // Clean up on client disconnect
      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeatInterval)
        if (channel) {
          supabase.removeChannel(channel)
        }
        controller.close()
      })
    }
  })

  // Return SSE response with proper headers
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'Content-Encoding': 'none', // Important: Disable compression for SSE
      'X-Accel-Buffering': 'no', // Disable Nginx buffering
      'Access-Control-Allow-Origin': '*',
    },
  })
}