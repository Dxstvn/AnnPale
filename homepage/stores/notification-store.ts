import { create } from 'zustand'
import { toast } from '@/hooks/use-toast'

export interface Notification {
  id: string
  user_id: string
  type: string
  message?: string
  is_read?: boolean
  created_at: string
  data?: Record<string, any>
  // Computed/UI fields
  title?: string
  read_at?: string | null
}

interface NotificationState {
  // State
  notifications: Notification[]
  unreadCount: number
  isConnected: boolean
  isPolling: boolean
  lastFetch: string | null
  connectionError: string | null

  // Actions
  setNotifications: (notifications: Notification[]) => void
  addNotification: (notification: Notification) => void
  updateNotification: (id: string, updates: Partial<Notification>) => void
  markAsRead: (ids: string | string[]) => void
  markAllAsRead: () => void
  deleteNotification: (id: string) => void
  clearAll: () => void
  setUnreadCount: (count: number) => void
  setConnectionStatus: (connected: boolean, error?: string) => void
  setPollingStatus: (polling: boolean) => void
  setLastFetch: (timestamp: string) => void

  // Computed values
  getUnreadNotifications: () => Notification[]
  getNotificationsByType: (type: string) => Notification[]
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  // Initial state
  notifications: [],
  unreadCount: 0,
  isConnected: false,
  isPolling: false,
  lastFetch: null,
  connectionError: null,

  // Actions
  setNotifications: (notifications) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[NotificationStore] Setting notifications:', notifications.length, notifications)
    }
    return set({
      notifications,
      unreadCount: notifications.filter(n => !n.is_read).length
    })
  },

  addNotification: (notification) => set((state) => {
    // Check for duplicates
    if (state.notifications.find(n => n.id === notification.id)) {
      return state
    }

    // Show toast for new notification
    if (!notification.is_read) {
      const title = notification.data?.title || notification.title || 'New Notification'
      toast({
        title,
        description: notification.message || '',
        duration: 5000
      })
    }

    return {
      notifications: [notification, ...state.notifications],
      unreadCount: notification.is_read ? state.unreadCount : state.unreadCount + 1
    }
  }),

  updateNotification: (id, updates) => set((state) => {
    const notifications = state.notifications.map(n =>
      n.id === id ? { ...n, ...updates } : n
    )
    const unreadCount = notifications.filter(n => !n.is_read).length
    return { notifications, unreadCount }
  }),

  markAsRead: (ids) => set((state) => {
    const idsArray = Array.isArray(ids) ? ids : [ids]
    const notifications = state.notifications.map(n =>
      idsArray.includes(n.id) ? { ...n, is_read: true, read_at: new Date().toISOString() } : n
    )
    const unreadCount = notifications.filter(n => !n.is_read).length
    return { notifications, unreadCount }
  }),

  markAllAsRead: () => set((state) => {
    const notifications = state.notifications.map(n => ({
      ...n,
      is_read: true,
      read_at: n.read_at || new Date().toISOString()
    }))
    return { notifications, unreadCount: 0 }
  }),

  deleteNotification: (id) => set((state) => {
    const notifications = state.notifications.filter(n => n.id !== id)
    const unreadCount = notifications.filter(n => !n.is_read).length
    return { notifications, unreadCount }
  }),

  clearAll: () => set({
    notifications: [],
    unreadCount: 0
  }),

  setUnreadCount: (count) => set({ unreadCount: count }),

  setConnectionStatus: (connected, error) => set({
    isConnected: connected,
    connectionError: error || null
  }),

  setPollingStatus: (polling) => set({ isPolling: polling }),

  setLastFetch: (timestamp) => set({ lastFetch: timestamp }),

  // Computed values
  getUnreadNotifications: () => {
    const state = get()
    return state.notifications.filter(n => !n.is_read)
  },

  getNotificationsByType: (type) => {
    const state = get()
    return state.notifications.filter(n => n.type === type)
  }
}))