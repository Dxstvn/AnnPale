import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { RealtimeChannel } from '@supabase/supabase-js'

export interface NotificationEvent {
  type: string
  title: string
  message: string
  timestamp: string
  orderId?: string
  amount?: number
  fanName?: string
  [key: string]: any
}

export class NotificationListener {
  private supabase: SupabaseClient
  private channels: Map<string, RealtimeChannel> = new Map()
  private notifications: NotificationEvent[] = []
  private listeners: Map<string, (event: NotificationEvent) => void> = new Map()
  
  constructor() {
    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yijizsscwkvepljqojkz.supabase.co'
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpaml6c3Njd2t2ZXBsanFvamt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1OTMyODgsImV4cCI6MjA3MjE2OTI4OH0.ot_XW1tE42_MPuOpoSslnxYcz89TGyDKSkT8IGaGqX8'
    
    this.supabase = createClient(supabaseUrl, supabaseKey)
  }
  
  /**
   * Subscribe to a creator's notification channel
   */
  async subscribeToCreatorChannel(creatorId: string): Promise<void> {
    const channelName = `creator-${creatorId}`
    
    if (this.channels.has(channelName)) {
      console.log(`📡 Already subscribed to ${channelName}`)
      return
    }
    
    console.log(`📡 Subscribing to creator notification channel: ${channelName}`)
    
    const channel = this.supabase.channel(channelName)
    
    // Subscribe to broadcast events
    channel
      .on('broadcast', { event: '*' }, (payload) => {
        console.log(`📬 Notification received on ${channelName}:`, payload)
        
        const notification: NotificationEvent = {
          type: payload.event,
          title: payload.payload?.title || '',
          message: payload.payload?.message || '',
          timestamp: payload.payload?.timestamp || new Date().toISOString(),
          ...payload.payload
        }
        
        this.notifications.push(notification)
        
        // Trigger any waiting listeners
        const listenerId = `${channelName}:${payload.event}`
        const listener = this.listeners.get(listenerId)
        if (listener) {
          listener(notification)
          this.listeners.delete(listenerId)
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Successfully subscribed to ${channelName}`)
        } else {
          console.log(`📡 Subscription status for ${channelName}: ${status}`)
        }
      })
    
    this.channels.set(channelName, channel)
    
    // Wait for subscription to be ready
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
  
  /**
   * Wait for a specific notification type
   */
  async waitForNotification(
    creatorId: string,
    eventType: string,
    timeout: number = 30000
  ): Promise<NotificationEvent | null> {
    const channelName = `creator-${creatorId}`
    
    // Ensure we're subscribed
    if (!this.channels.has(channelName)) {
      await this.subscribeToCreatorChannel(creatorId)
    }
    
    console.log(`⏳ Waiting for ${eventType} notification on ${channelName} (timeout: ${timeout}ms)...`)
    
    // Check if we already received it
    const existing = this.notifications.find(n => n.type === eventType)
    if (existing) {
      console.log(`✅ Notification already received: ${eventType}`)
      return existing
    }
    
    // Wait for new notification
    return new Promise((resolve) => {
      const listenerId = `${channelName}:${eventType}`
      let timeoutId: NodeJS.Timeout
      
      // Set up listener
      this.listeners.set(listenerId, (notification) => {
        clearTimeout(timeoutId)
        console.log(`✅ Notification received: ${eventType}`)
        resolve(notification)
      })
      
      // Set up timeout
      timeoutId = setTimeout(() => {
        this.listeners.delete(listenerId)
        console.log(`⏱️ Timeout waiting for ${eventType} notification`)
        resolve(null)
      }, timeout)
    })
  }
  
  /**
   * Wait for any notification on a channel
   */
  async waitForAnyNotification(
    creatorId: string,
    timeout: number = 30000
  ): Promise<NotificationEvent | null> {
    const channelName = `creator-${creatorId}`
    
    // Ensure we're subscribed
    if (!this.channels.has(channelName)) {
      await this.subscribeToCreatorChannel(creatorId)
    }
    
    console.log(`⏳ Waiting for any notification on ${channelName} (timeout: ${timeout}ms)...`)
    
    // Check if we already have notifications
    if (this.notifications.length > 0) {
      const latest = this.notifications[this.notifications.length - 1]
      console.log(`✅ Returning latest notification: ${latest.type}`)
      return latest
    }
    
    // Wait for any new notification
    return new Promise((resolve) => {
      let timeoutId: NodeJS.Timeout
      let resolved = false
      
      // Subscribe to all events temporarily
      const channel = this.channels.get(channelName)
      if (!channel) {
        resolve(null)
        return
      }
      
      const subscription = channel.on('broadcast', { event: '*' }, (payload) => {
        if (!resolved) {
          resolved = true
          clearTimeout(timeoutId)
          
          const notification: NotificationEvent = {
            type: payload.event,
            title: payload.payload?.title || '',
            message: payload.payload?.message || '',
            timestamp: payload.payload?.timestamp || new Date().toISOString(),
            ...payload.payload
          }
          
          console.log(`✅ Notification received: ${notification.type}`)
          resolve(notification)
        }
      })
      
      // Set up timeout
      timeoutId = setTimeout(() => {
        resolved = true
        console.log(`⏱️ Timeout waiting for any notification`)
        resolve(null)
      }, timeout)
    })
  }
  
  /**
   * Get all notifications received
   */
  getAllNotifications(): NotificationEvent[] {
    return [...this.notifications]
  }
  
  /**
   * Clear all notifications
   */
  clearNotifications(): void {
    this.notifications = []
  }
  
  /**
   * Unsubscribe from all channels
   */
  async cleanup(): Promise<void> {
    console.log('🧹 Cleaning up notification listener...')
    
    for (const [name, channel] of this.channels) {
      await channel.unsubscribe()
      console.log(`   Unsubscribed from ${name}`)
    }
    
    this.channels.clear()
    this.listeners.clear()
    this.notifications = []
  }
  
  /**
   * Verify a notification contains expected data
   */
  verifyNotification(
    notification: NotificationEvent | null,
    expectedData: Partial<NotificationEvent>
  ): boolean {
    if (!notification) {
      console.error('❌ No notification received')
      return false
    }
    
    let valid = true
    
    // Check type
    if (expectedData.type && notification.type !== expectedData.type) {
      console.error(`❌ Type mismatch: ${notification.type} !== ${expectedData.type}`)
      valid = false
    }
    
    // Check title contains expected text
    if (expectedData.title && !notification.title.includes(expectedData.title)) {
      console.error(`❌ Title doesn't contain: ${expectedData.title}`)
      valid = false
    }
    
    // Check message contains expected text
    if (expectedData.message && !notification.message.includes(expectedData.message)) {
      console.error(`❌ Message doesn't contain: ${expectedData.message}`)
      valid = false
    }
    
    // Check amount if provided
    if (expectedData.amount !== undefined) {
      if (Math.abs((notification.amount || 0) - expectedData.amount) > 0.01) {
        console.error(`❌ Amount mismatch: ${notification.amount} !== ${expectedData.amount}`)
        valid = false
      }
    }
    
    // Check order ID if provided
    if (expectedData.orderId && notification.orderId !== expectedData.orderId) {
      console.error(`❌ Order ID mismatch: ${notification.orderId} !== ${expectedData.orderId}`)
      valid = false
    }
    
    if (valid) {
      console.log('✅ Notification verification passed')
    }
    
    return valid
  }
}

/**
 * Create a notification listener for tests
 */
export function createNotificationListener(): NotificationListener {
  return new NotificationListener()
}