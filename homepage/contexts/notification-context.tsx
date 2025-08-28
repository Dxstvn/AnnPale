"use client"

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { createClient } from "@/lib/supabase/client"
import { RealtimeChannel } from "@supabase/supabase-js"
import toast from "react-hot-toast"
import { Bell } from "lucide-react"

interface NotificationData {
  id: string
  user_id: string
  type: string
  title: string
  message: string
  data: any
  read: boolean
  created_at: string
}

interface NotificationContextType {
  notifications: NotificationData[]
  unreadCount: number
  isConnected: boolean
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  clearNotifications: () => void
  refetchNotifications: () => Promise<void>
  settings: NotificationSettings
  updateSettings: (settings: Partial<NotificationSettings>) => void
}

interface NotificationSettings {
  sound: boolean
  vibration: boolean
  toasts: boolean
  browserNotifications: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider")
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [notifications, setNotifications] = useState<NotificationData[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const [settings, setSettings] = useState<NotificationSettings>({
    sound: true,
    vibration: true,
    toasts: true,
    browserNotifications: false
  })
  
  const { user } = useSupabaseAuth()
  const supabase = createClient()

  // Load saved settings from localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem("notification-settings")
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Update settings and save to localStorage
  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    localStorage.setItem("notification-settings", JSON.stringify(updated))
    
    // Request browser notification permission if enabled
    if (newSettings.browserNotifications && "Notification" in window) {
      Notification.requestPermission()
    }
  }, [settings])

  // Fetch initial notifications
  const fetchNotifications = useCallback(async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50)

      if (error) throw error

      setNotifications(data || [])
      setUnreadCount((data || []).filter(n => !n.read).length)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }, [user, supabase])

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (settings.sound && typeof window !== "undefined") {
      const audio = new Audio("/sounds/notification.mp3")
      audio.volume = 0.5
      audio.play().catch(console.error)
    }
  }, [settings.sound])

  // Trigger device vibration
  const triggerVibration = useCallback(() => {
    if (settings.vibration && "vibrate" in navigator) {
      navigator.vibrate(200)
    }
  }, [settings.vibration])

  // Show browser notification
  const showBrowserNotification = useCallback((title: string, body: string, icon?: string) => {
    if (
      settings.browserNotifications &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification(title, {
        body,
        icon: icon || "/logo.png",
        badge: "/badge.png",
        tag: "ann-pale-notification"
      })
    }
  }, [settings.browserNotifications])

  // Handle new notification
  const handleNewNotification = useCallback((notification: NotificationData) => {
    // Add to list
    setNotifications(prev => [notification, ...prev])
    setUnreadCount(prev => prev + 1)

    // Play sound
    playNotificationSound()

    // Trigger vibration
    triggerVibration()

    // Show toast
    if (settings.toasts) {
      toast.custom((t) => (
        <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-3 max-w-md">
          <div className="flex-shrink-0">
            <Bell className="h-5 w-5 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">{notification.title}</p>
            {notification.message && (
              <p className="text-sm text-gray-500 mt-0.5">{notification.message}</p>
            )}
          </div>
        </div>
      ), {
        duration: 4000,
        position: "top-right"
      })
    }

    // Show browser notification
    showBrowserNotification(notification.title, notification.message || "")
  }, [playNotificationSound, triggerVibration, settings.toasts, showBrowserNotification])

  // Set up real-time subscription
  useEffect(() => {
    if (!user) return

    // Fetch initial notifications
    fetchNotifications()

    // Subscribe to real-time notifications
    const newChannel = supabase
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
          handleNewNotification(payload.new as NotificationData)
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          // Update notification in list
          setNotifications(prev =>
            prev.map(n => n.id === payload.new.id ? payload.new as NotificationData : n)
          )
          // Recalculate unread count
          setNotifications(prev => {
            const count = prev.filter(n => !n.read).length
            setUnreadCount(count)
            return prev
          })
        }
      )
      .subscribe((status) => {
        setIsConnected(status === "SUBSCRIBED")
      })

    setChannel(newChannel)

    // Cleanup
    return () => {
      if (newChannel) {
        supabase.removeChannel(newChannel)
      }
    }
  }, [user, supabase, fetchNotifications, handleNewNotification])

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("id", notificationId)

      if (error) throw error

      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      )
      setUnreadCount(prev => Math.max(0, prev - 1))
    } catch (error) {
      console.error("Error marking notification as read:", error)
      toast.error("Failed to mark notification as read")
    }
  }, [supabase])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user) return

    try {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", user.id)
        .eq("read", false)

      if (error) throw error

      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)
      toast.success("All notifications marked as read")
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
      toast.error("Failed to mark all notifications as read")
    }
  }, [user, supabase])

  // Clear notifications from state (not from database)
  const clearNotifications = useCallback(() => {
    setNotifications([])
    setUnreadCount(0)
  }, [])

  // Refetch notifications
  const refetchNotifications = useCallback(async () => {
    await fetchNotifications()
  }, [fetchNotifications])

  // Handle tab visibility change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && user) {
        // Refetch when tab becomes visible
        fetchNotifications()
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange)
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [user, fetchNotifications])

  // Cross-tab synchronization using BroadcastChannel API
  useEffect(() => {
    if (!user || typeof window === "undefined" || !("BroadcastChannel" in window)) return

    const bc = new BroadcastChannel("ann-pale-notifications")
    
    bc.onmessage = (event) => {
      if (event.data.type === "NOTIFICATION_UPDATE") {
        // Sync notifications across tabs
        fetchNotifications()
      }
    }

    return () => {
      bc.close()
    }
  }, [user, fetchNotifications])

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    refetchNotifications,
    settings,
    updateSettings
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}