"use client"

import { useState, useEffect } from "react"
import { 
  Bell, 
  Heart, 
  MessageCircle, 
  Repeat2, 
  UserPlus, 
  CreditCard,
  Video,
  Check,
  CheckCheck,
  Filter,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { createClient } from "@/lib/supabase/client"
import { formatDistanceToNow } from "date-fns"
import toast from "react-hot-toast"

interface Notification {
  id: string
  user_id: string
  type: "like" | "comment" | "repost" | "follow" | "subscription" | "payment" | "video"
  title: string
  message: string
  data: {
    from_user?: {
      id: string
      name: string
      avatar_url?: string
    }
    post_id?: string
    comment_id?: string
    subscription_tier?: string
    amount?: number
    video_url?: string
  }
  read: boolean
  created_at: string
}

type NotificationFilter = "all" | "unread" | "likes" | "comments" | "follows" | "payments"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<NotificationFilter>("all")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const { user } = useSupabaseAuth()
  const supabase = createClient()
  const notificationsPerPage = 20

  useEffect(() => {
    if (user) {
      loadNotifications()
      subscribeToNotifications()
    }
  }, [user, filter])

  const loadNotifications = async (loadMore = false) => {
    if (!user) return
    
    setIsLoading(true)
    try {
      let query = supabase
        .from("notifications")
        .select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      // Apply filters
      if (filter === "unread") {
        query = query.eq("read", false)
      } else if (filter !== "all") {
        const typeMap = {
          likes: "like",
          comments: "comment",
          follows: "follow",
          payments: ["subscription", "payment"]
        }
        const filterType = typeMap[filter as keyof typeof typeMap]
        if (Array.isArray(filterType)) {
          query = query.in("type", filterType)
        } else {
          query = query.eq("type", filterType)
        }
      }

      const from = loadMore ? page * notificationsPerPage : 0
      const to = from + notificationsPerPage - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      if (loadMore) {
        setNotifications(prev => [...prev, ...(data || [])])
        setPage(prev => prev + 1)
      } else {
        setNotifications(data || [])
      }

      setHasMore((data?.length || 0) === notificationsPerPage)
    } catch (error) {
      console.error("Error loading notifications:", error)
      toast.error("Failed to load notifications")
    } finally {
      setIsLoading(false)
    }
  }

  const subscribeToNotifications = () => {
    if (!user) return

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          // Add new notification to the top of the list
          setNotifications(prev => [payload.new as Notification, ...prev])
          toast.custom((t) => (
            <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3">
              {getNotificationIcon(payload.new.type)}
              <div className="flex-1">
                <p className="font-medium">{payload.new.title}</p>
                <p className="text-sm text-gray-500">{payload.new.message}</p>
              </div>
            </div>
          ))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const markAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("id", notificationId)

    if (!error) {
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
    }
  }

  const markAllAsRead = async () => {
    if (!user) return

    const { error } = await supabase
      .from("notifications")
      .update({ read: true })
      .eq("user_id", user.id)
      .eq("read", false)

    if (!error) {
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      toast.success("All notifications marked as read")
    } else {
      toast.error("Failed to mark notifications as read")
    }
  }

  const getNotificationIcon = (type: string) => {
    const iconMap = {
      like: <Heart className="h-5 w-5 text-red-500" />,
      comment: <MessageCircle className="h-5 w-5 text-blue-500" />,
      repost: <Repeat2 className="h-5 w-5 text-green-500" />,
      follow: <UserPlus className="h-5 w-5 text-purple-500" />,
      subscription: <CreditCard className="h-5 w-5 text-orange-500" />,
      payment: <CreditCard className="h-5 w-5 text-green-600" />,
      video: <Video className="h-5 w-5 text-pink-500" />
    }
    return iconMap[type as keyof typeof iconMap] || <Bell className="h-5 w-5" />
  }

  const groupNotificationsByDate = (notifications: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {}
    const now = new Date()
    
    notifications.forEach(notification => {
      const date = new Date(notification.created_at)
      const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
      
      let groupKey: string
      if (diffInDays === 0) {
        groupKey = "Today"
      } else if (diffInDays === 1) {
        groupKey = "Yesterday"
      } else if (diffInDays < 7) {
        groupKey = "This Week"
      } else if (diffInDays < 30) {
        groupKey = "This Month"
      } else {
        groupKey = "Older"
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = []
      }
      groups[groupKey].push(notification)
    })
    
    return groups
  }

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <div
      className={cn(
        "flex gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer",
        !notification.read && "bg-blue-50/50"
      )}
      onClick={() => !notification.read && markAsRead(notification.id)}
    >
      {/* Icon or Avatar */}
      {notification.data.from_user ? (
        <Avatar className="h-10 w-10">
          <AvatarImage src={notification.data.from_user.avatar_url} />
          <AvatarFallback>{notification.data.from_user.name[0]}</AvatarFallback>
        </Avatar>
      ) : (
        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
          {getNotificationIcon(notification.type)}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm">
              <span className="font-medium">{notification.title}</span>
            </p>
            {notification.message && (
              <p className="text-sm text-gray-600">{notification.message}</p>
            )}
          </div>
          {!notification.read && (
            <Badge variant="secondary" className="ml-2">New</Badge>
          )}
        </div>
        
        <p className="text-xs text-gray-500">
          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
        </p>
      </div>
    </div>
  )

  const groupedNotifications = groupNotificationsByDate(
    notifications.filter(n => {
      if (filter === "all") return true
      if (filter === "unread") return !n.read
      if (filter === "likes") return n.type === "like"
      if (filter === "comments") return n.type === "comment"
      if (filter === "follows") return n.type === "follow"
      if (filter === "payments") return ["subscription", "payment"].includes(n.type)
      return true
    })
  )

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-500 mt-1">
                You have {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
              </p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={markAllAsRead}
            >
              <CheckCheck className="h-4 w-4 mr-1" />
              Mark all as read
            </Button>
          )}
        </div>

        {/* Filter tabs */}
        <Tabs value={filter} onValueChange={(v) => setFilter(v as NotificationFilter)}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="likes">Likes</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
            <TabsTrigger value="follows">Follows</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Notifications list */}
      <div className="bg-white rounded-lg shadow">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No notifications yet</p>
            <p className="text-sm text-gray-400 mt-1">
              We'll notify you when something happens
            </p>
          </div>
        ) : (
          <div>
            {Object.entries(groupedNotifications).map(([date, items]) => (
              <div key={date}>
                <div className="px-4 py-2 bg-gray-50 border-y">
                  <p className="text-sm font-medium text-gray-600">{date}</p>
                </div>
                {items.map(notification => (
                  <NotificationItem key={notification.id} notification={notification} />
                ))}
              </div>
            ))}
            
            {hasMore && (
              <div className="p-4 text-center border-t">
                <Button
                  variant="outline"
                  onClick={() => loadNotifications(true)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Load more"
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}