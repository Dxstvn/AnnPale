'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
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
  X
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useSupabaseAuth } from '@/contexts/supabase-auth-context'
import { toast } from '@/hooks/use-toast'

interface Notification {
  id: string
  type: 'order_new' | 'order_accepted' | 'order_completed' | 'payment_received' | 'review_received' | 'message'
  title: string
  message: string
  read: boolean
  created_at: string
  metadata?: {
    orderId?: string
    amount?: number
    rating?: number
    creatorName?: string
    fanName?: string
  }
}

export function NotificationCenter() {
  const { user } = useSupabaseAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    if (!user) return

    fetchNotifications()
    setupRealtimeSubscription()

    return () => {
      supabase.removeAllChannels()
    }
  }, [user])

  const fetchNotifications = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      // For now, create mock notifications since the table doesn't exist yet
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'order_new',
          title: 'New Order Received!',
          message: 'You have a new video request for a Birthday message',
          read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          metadata: { orderId: 'order-1', fanName: 'Sarah Johnson' }
        },
        {
          id: '2',
          type: 'payment_received',
          title: 'Payment Received',
          message: 'You earned $70 from a completed video',
          read: false,
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          metadata: { amount: 70 }
        },
        {
          id: '3',
          type: 'review_received',
          title: 'New Review',
          message: 'A fan left you a 5-star review!',
          read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
          metadata: { rating: 5, fanName: 'Michael Brown' }
        },
        {
          id: '4',
          type: 'order_completed',
          title: 'Order Completed',
          message: 'Your video has been delivered successfully',
          read: true,
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
          metadata: { orderId: 'order-2' }
        }
      ]
      
      setNotifications(mockNotifications)
      setUnreadCount(mockNotifications.filter(n => !n.read).length)
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    if (!user) return

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'orders',
        filter: `creator_id=eq.${user.id}`
      }, (payload) => {
        // Create a new notification for new order
        const newNotification: Notification = {
          id: `notif-${Date.now()}`,
          type: 'order_new',
          title: 'New Order!',
          message: `New video request for ${payload.new.occasion || 'a special occasion'}`,
          read: false,
          created_at: new Date().toISOString(),
          metadata: {
            orderId: payload.new.id,
            amount: payload.new.creator_earnings
          }
        }
        
        setNotifications(prev => [newNotification, ...prev])
        setUnreadCount(prev => prev + 1)
        
        // Show toast notification
        toast({
          title: newNotification.title,
          description: newNotification.message,
          action: {
            label: 'View',
            onClick: () => window.location.href = '/creator/dashboard'
          }
        })
        
        // Play notification sound
        playNotificationSound()
      })
      .subscribe()
  }

  const markAsRead = async (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = async () => {
    setNotifications(prev =>
      prev.map(n => ({ ...n, read: true }))
    )
    setUnreadCount(0)
  }

  const clearAll = () => {
    setNotifications([])
    setUnreadCount(0)
  }

  const playNotificationSound = () => {
    try {
      const audio = new Audio('/sounds/notification.mp3')
      audio.volume = 0.5
      audio.play().catch(() => {})
    } catch {}
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'order_new':
        return <AlertCircle className="h-4 w-4 text-blue-500" />
      case 'order_accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'order_completed':
        return <Video className="h-4 w-4 text-purple-500" />
      case 'payment_received':
        return <DollarSign className="h-4 w-4 text-green-500" />
      case 'review_received':
        return <Star className="h-4 w-4 text-yellow-500" />
      case 'message':
        return <MessageSquare className="h-4 w-4 text-gray-500" />
      default:
        return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'order_new':
        return 'bg-blue-50 hover:bg-blue-100'
      case 'payment_received':
        return 'bg-green-50 hover:bg-green-100'
      case 'review_received':
        return 'bg-yellow-50 hover:bg-yellow-100'
      default:
        return 'bg-white hover:bg-gray-50'
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
          <span className="text-lg font-semibold">Notifications</span>
          {notifications.length > 0 && (
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="h-auto p-1 text-xs"
                >
                  <Check className="h-3 w-3 mr-1" />
                  Mark all read
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAll}
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
          {loading ? (
            <div className="p-4 text-center text-sm text-gray-500">
              Loading notifications...
            </div>
          ) : notifications.length === 0 ? (
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
                  className={`
                    p-3 cursor-pointer transition-colors
                    ${notification.read ? 'opacity-70' : ''}
                    ${getNotificationColor(notification.type)}
                  `}
                  onClick={() => {
                    if (!notification.read) {
                      markAsRead(notification.id)
                    }
                    // Handle navigation based on notification type
                    if (notification.metadata?.orderId) {
                      window.location.href = `/creator/orders/${notification.metadata.orderId}`
                    }
                  }}
                >
                  <div className="flex gap-3 w-full">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <p className="text-sm font-medium">
                          {notification.title}
                        </p>
                        {!notification.read && (
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
                      
                      {/* Metadata badges */}
                      {notification.metadata && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {notification.metadata.amount && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              ${notification.metadata.amount}
                            </Badge>
                          )}
                          {notification.metadata.rating && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              {notification.metadata.rating} ⭐
                            </Badge>
                          )}
                          {notification.metadata.fanName && (
                            <Badge variant="secondary" className="text-xs px-1.5 py-0">
                              {notification.metadata.fanName}
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
        
        {notifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center py-2">
              <Button variant="ghost" size="sm" className="w-full">
                View all notifications
              </Button>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}