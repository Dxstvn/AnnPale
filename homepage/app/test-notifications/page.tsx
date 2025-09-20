'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useNotificationStore } from '@/stores/notification-store'
import { useNotificationStream } from '@/hooks/use-notification-stream'
import { useSupabaseAuth } from '@/contexts/supabase-auth-compat'
import { createClient } from '@/lib/supabase/client'
import { toast } from '@/hooks/use-toast'
import { Bell, Wifi, WifiOff, RefreshCw, Send, Trash2, CheckCircle } from 'lucide-react'

export default function TestNotificationsPage() {
  const { user, isAuthenticated } = useSupabaseAuth()
  const { isConnected, isPolling, connectionError } = useNotificationStream()
  const {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearAll
  } = useNotificationStore()

  // Debug logging
  useEffect(() => {
    console.log('[TestNotifications] Notifications in store:', notifications.length, notifications)
    console.log('[TestNotifications] Unread count:', unreadCount)
  }, [notifications, unreadCount])

  const [testCount, setTestCount] = useState(0)
  const supabase = createClient()

  // Create a test notification
  const createTestNotification = async () => {
    console.log('[CreateNotification] Starting...')
    console.log('[CreateNotification] User:', user?.id)

    if (!user) {
      toast({
        title: "Not authenticated",
        description: "Please log in to test notifications",
        variant: "destructive"
      })
      return
    }

    setTestCount(prev => prev + 1)
    const currentCount = testCount + 1

    try {
      const notificationData = {
        user_id: user.id,
        type: 'system',
        message: `Test Notification #${currentCount}: Created at ${new Date().toLocaleTimeString()}`,
        data: {
          test: true,
          title: `Test Notification #${currentCount}`,
          order_id: `test-${Date.now()}`,
          fan_name: 'Test User',
          amount: Math.floor(Math.random() * 100) + 50
        },
        is_read: false
      }

      console.log('[CreateNotification] Inserting:', notificationData)

      const { data, error } = await supabase
        .from('notifications')
        .insert(notificationData)
        .select()
        .single()

      if (error) {
        console.error('[CreateNotification] Error:', error)
        toast({
          title: "Error creating notification",
          description: error.message,
          variant: "destructive"
        })
      } else {
        console.log('[CreateNotification] Success! Created:', data)
        toast({
          title: "Success",
          description: "Test notification created!",
        })

        // Optimistically add to store immediately
        console.log('[CreateNotification] Adding to store optimistically')
        addNotification(data)

        // Poll after 1 second to sync with database
        // This ensures we get any other notifications that were created
        setTimeout(() => {
          console.log('[CreateNotification] Syncing with database')
          forcePoll()
        }, 1000)
      }
    } catch (error) {
      console.error('[CreateNotification] Caught error:', error)
      toast({
        title: "Unexpected error",
        description: "Failed to create notification",
        variant: "destructive"
      })
    }
  }

  // Force poll for notifications
  const forcePoll = async () => {
    try {
      const response = await fetch('/api/notifications/poll')
      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Poll successful",
          description: `Found ${data.notifications?.length || 0} notifications, ${data.unreadCount || 0} unread`,
        })
      }
    } catch (error) {
      console.error('Poll error:', error)
    }
  }

  // Test SSE connection
  const testSSEConnection = async () => {
    try {
      const response = await fetch('/api/notifications/stream')

      if (response.status === 401) {
        toast({
          title: "Not authenticated",
          description: "SSE requires authentication",
          variant: "destructive"
        })
      } else if (response.ok) {
        toast({
          title: "SSE endpoint accessible",
          description: "Connection test successful",
        })
      }
    } catch (error) {
      console.error('SSE test error:', error)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Notification System Test</CardTitle>
          <CardDescription>Test the SSE + Polling notification system</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Connection Status */}
          <div className="p-4 rounded-lg border bg-gray-50">
            <h3 className="font-semibold mb-2">Connection Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm text-gray-600">Authentication:</span>
                <Badge variant={isAuthenticated ? "success" : "destructive"} className="ml-2">
                  {isAuthenticated ? "Logged In" : "Not Logged In"}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-gray-600">SSE:</span>
                <Badge variant={isConnected ? "success" : "secondary"} className="ml-2">
                  {isConnected ? <><Wifi className="h-3 w-3 mr-1" /> Connected</> : <><WifiOff className="h-3 w-3 mr-1" /> Disconnected</>}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-gray-600">Polling:</span>
                <Badge variant={isPolling ? "default" : "secondary"} className="ml-2">
                  {isPolling ? "Active" : "Inactive"}
                </Badge>
              </div>
              <div>
                <span className="text-sm text-gray-600">Unread:</span>
                <Badge variant="outline" className="ml-2">
                  {unreadCount}
                </Badge>
              </div>
            </div>
            {connectionError && (
              <div className="mt-2 p-2 bg-red-50 text-red-700 rounded text-sm">
                Error: {connectionError}
              </div>
            )}
            {user && (
              <div className="mt-2 text-xs text-gray-500">
                User ID: {user.id}
              </div>
            )}
          </div>

          {/* Test Actions */}
          <div className="p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">Test Actions</h3>
            <div className="flex flex-wrap gap-2">
              <Button onClick={createTestNotification} disabled={!isAuthenticated}>
                <Send className="h-4 w-4 mr-2" />
                Create Test Notification
              </Button>
              <Button onClick={forcePoll} variant="outline" disabled={!isAuthenticated}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Force Poll
              </Button>
              <Button onClick={testSSEConnection} variant="outline">
                <Wifi className="h-4 w-4 mr-2" />
                Test SSE
              </Button>
              <Button onClick={markAllAsRead} variant="outline" disabled={unreadCount === 0}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
              <Button onClick={clearAll} variant="outline" disabled={notifications.length === 0}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="p-4 rounded-lg border">
            <h3 className="font-semibold mb-3">
              Notifications ({notifications.length} total, {unreadCount} unread)
            </h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No notifications yet</p>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border ${
                      notification.is_read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4" />
                          <span className="font-medium">{notification.data?.title || notification.title || notification.type}</span>
                          {!notification.is_read && (
                            <Badge variant="default" className="text-xs">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <div className="text-xs text-gray-400 mt-1">
                          ID: {notification.id.substring(0, 8)}... |
                          Created: {new Date(notification.created_at).toLocaleString()}
                        </div>
                        {notification.data && (
                          <div className="text-xs text-gray-500 mt-1">
                            Data: {JSON.stringify(notification.data)}
                          </div>
                        )}
                      </div>
                      {!notification.is_read && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => markAsRead(notification.id)}
                        >
                          Mark Read
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="p-4 rounded-lg bg-blue-50">
            <h3 className="font-semibold mb-2">How to Test:</h3>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Make sure you are logged in (check Authentication status)</li>
              <li>Click "Create Test Notification" to insert a notification into the database</li>
              <li>Watch for the notification to appear via SSE (if connected) or polling</li>
              <li>Test "Mark Read" functionality on individual notifications</li>
              <li>Use "Force Poll" to manually trigger a poll</li>
              <li>Open browser console to see detailed logs</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}