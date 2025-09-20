'use client'

import { useCallback, useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Bell,
  CheckCircle,
  AlertCircle,
  DollarSign,
  Video,
  Star,
  MessageSquare,
  Clock,
  Check,
  X,
  Wifi,
  WifiOff
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useSupabaseAuth } from '@/contexts/supabase-auth-compat'
import { toast } from '@/hooks/use-toast'
import { useNotificationStore, type Notification } from '@/stores/notification-store'
import { useNotificationStream } from '@/hooks/use-notification-stream'
import { cn } from '@/lib/utils'

export function NotificationCenter() {
  const { user } = useSupabaseAuth()
  const { isConnected, isPolling } = useNotificationStream()
  const [isOpen, setIsOpen] = useState(false)

  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll
  } = useNotificationStore()

  // Handle marking as read via API
  const handleMarkAsRead = useCallback(async (notificationId: string) => {
    markAsRead(notificationId)

    // Update on server
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [notificationId] })
      })
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }, [markAsRead])

  // Handle marking all as read
  const handleMarkAllAsRead = useCallback(async () => {
    markAllAsRead()

    // Update on server
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAll: true })
      })
    } catch (error) {
      console.error('Failed to mark all as read:', error)
    }
  }, [markAllAsRead])

  // Handle clearing all notifications
  const handleClearAll = useCallback(async () => {
    clearAll()

    // Delete on server
    try {
      await fetch('/api/notifications?all=true', {
        method: 'DELETE'
      })
    } catch (error) {
      console.error('Failed to clear notifications:', error)
    }
  }, [clearAll])

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/sounds/notification.mp3')
      audio.volume = 0.5
      audio.play().catch(() => {})
    } catch {}
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order_new':
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case 'order_accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'order_completed':
        return <Video className="h-4 w-4 text-purple-500" />
      case 'order_cancelled':
        return <X className="h-4 w-4 text-red-500" />
      case 'payment_received':
      case 'payment_succeeded':
        return <DollarSign className="h-4 w-4 text-green-500" />
      case 'payment_failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'review_received':
        return <Star className="h-4 w-4 text-yellow-500" />
      case 'message_received':
        return <MessageSquare className="h-4 w-4 text-gray-500" />
      case 'system_announcement':
      case 'system':
        return <Bell className="h-4 w-4 text-indigo-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getNotificationColor = (type: string, isRead: boolean) => {
    if (isRead) {
      return 'bg-gray-50 hover:bg-gray-100'
    }

    switch (type) {
      case 'order_new':
        return 'bg-blue-50 hover:bg-blue-100'
      case 'payment_received':
      case 'payment_succeeded':
        return 'bg-green-50 hover:bg-green-100'
      case 'review_received':
        return 'bg-yellow-50 hover:bg-yellow-100'
      case 'order_cancelled':
      case 'payment_failed':
        return 'bg-red-50 hover:bg-red-100'
      case 'system_announcement':
        return 'bg-indigo-50 hover:bg-indigo-100'
      default:
        return 'bg-white hover:bg-gray-50'
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id)
    }

    // Navigate based on notification type and data
    const data = notification.data as any
    if (data?.order_id) {
      window.location.href = `/creator/orders/${data.order_id}`
    } else if (data?.review_id) {
      window.location.href = `/creator/reviews`
    } else if (data?.payment_id) {
      window.location.href = `/creator/earnings`
    }
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label={`${unreadCount} unread notifications`}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <>
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold animate-in zoom-in-50 duration-200">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full animate-ping" />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-96" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">Notifications</span>
            {isConnected ? (
              <Badge variant="outline" className="text-xs">
                <Wifi className="h-3 w-3 mr-1 text-green-500" />
                Live
              </Badge>
            ) : isPolling ? (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1 text-yellow-500" />
                Polling
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                <WifiOff className="h-3 w-3 mr-1 text-red-500" />
                Offline
              </Badge>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="h-auto p-1 text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="h-auto p-1 text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            </div>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <ScrollArea className="h-[400px]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No notifications yet</p>
              <p className="text-xs text-gray-400 mt-1">
                We'll notify you when something important happens
              </p>
            </div>
          ) : (
            <div className="py-2">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className={cn(
                    "p-3 cursor-pointer transition-colors",
                    notification.is_read && "opacity-70",
                    getNotificationColor(notification.type, !!notification.is_read)
                  )}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex gap-3 w-full">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium">
                          {notification.data?.title || notification.title || notification.type}
                        </p>
                        {!notification.is_read && (
                          <Badge variant="default" className="ml-2 px-1.5 py-0 text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                      </div>

                      {/* Data badges */}
                      {notification.data && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {(notification.data as any).amount && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              ${(notification.data as any).amount}
                            </Badge>
                          )}
                          {(notification.data as any).rating && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              {(notification.data as any).rating} ⭐
                            </Badge>
                          )}
                          {(notification.data as any).fan_name && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              {(notification.data as any).fan_name}
                            </Badge>
                          )}
                          {(notification.data as any).creator_name && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              {(notification.data as any).creator_name}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          )}
        </ScrollArea>

        {notifications.length > 5 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center py-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => window.location.href = '/notifications'}
              >
                View all notifications
              </Button>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}