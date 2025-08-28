"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Bell, Heart, MessageCircle, Repeat2, UserPlus, CreditCard, Video } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useNotifications } from "@/contexts/notification-context"
import { formatDistanceToNow } from "date-fns"

interface NotificationBadgeProps {
  className?: string
  showDropdown?: boolean
  variant?: "icon" | "button"
}

export function NotificationBadge({ 
  className,
  showDropdown = true,
  variant = "icon"
}: NotificationBadgeProps) {
  const { notifications, unreadCount, markAsRead } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)
  
  // Get recent notifications (max 5)
  const recentNotifications = notifications.slice(0, 5)

  const getNotificationIcon = (type: string) => {
    const iconMap = {
      like: <Heart className="h-4 w-4 text-red-500" />,
      comment: <MessageCircle className="h-4 w-4 text-blue-500" />,
      repost: <Repeat2 className="h-4 w-4 text-green-500" />,
      follow: <UserPlus className="h-4 w-4 text-purple-500" />,
      subscription: <CreditCard className="h-4 w-4 text-orange-500" />,
      payment: <CreditCard className="h-4 w-4 text-green-600" />,
      video: <Video className="h-4 w-4 text-pink-500" />
    }
    return iconMap[type as keyof typeof iconMap] || <Bell className="h-4 w-4" />
  }

  const handleNotificationClick = async (notificationId: string, read: boolean) => {
    if (!read) {
      await markAsRead(notificationId)
    }
  }

  const NotificationButton = () => (
    <Button
      variant={variant === "button" ? "outline" : "ghost"}
      size="icon"
      className={cn("relative", className)}
    >
      <Bell className="h-5 w-5" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
          <span className="text-[10px] text-white font-bold">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        </span>
      )}
    </Button>
  )

  if (!showDropdown) {
    return (
      <Link href="/fan/notifications">
        <NotificationButton />
      </Link>
    )
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <div>
          <NotificationButton />
        </div>
      </PopoverTrigger>
      <PopoverContent 
        align="end" 
        className="w-80 p-0"
        sideOffset={5}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h4 className="font-semibold">Notifications</h4>
          {unreadCount > 0 && (
            <Badge variant="secondary">
              {unreadCount} new
            </Badge>
          )}
        </div>

        <ScrollArea className="h-[400px]">
          {recentNotifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="h-8 w-8 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No notifications yet</p>
              <p className="text-xs text-gray-400 mt-1">
                We'll notify you when something happens
              </p>
            </div>
          ) : (
            <div className="divide-y">
              {recentNotifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification.id, notification.read)}
                  className={cn(
                    "w-full text-left p-3 hover:bg-gray-50 transition-colors",
                    !notification.read && "bg-blue-50/50"
                  )}
                >
                  <div className="flex gap-3">
                    {/* Icon or Avatar */}
                    {notification.data?.from_user ? (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={notification.data.from_user.avatar_url} />
                        <AvatarFallback>
                          {notification.data.from_user.name[0]}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {notification.title}
                      </p>
                      {notification.message && (
                        <p className="text-xs text-gray-500 truncate">
                          {notification.message}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notification.created_at), { 
                          addSuffix: true 
                        })}
                      </p>
                    </div>

                    {/* Unread indicator */}
                    {!notification.read && (
                      <div className="flex-shrink-0">
                        <div className="h-2 w-2 bg-blue-500 rounded-full" />
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>

        <Separator />
        
        <div className="p-2">
          <Link href="/fan/notifications" onClick={() => setIsOpen(false)}>
            <Button variant="ghost" className="w-full justify-center text-sm">
              View all notifications
            </Button>
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  )
}