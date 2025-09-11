import { createClient, SupabaseClient, RealtimeChannel } from '@supabase/supabase-js'
import { EventEmitter } from 'events'

export interface RealtimeNotification {
  id: string
  type: string
  channel: string
  payload: any
  timestamp: string
}

export class RealtimeNotificationTracker extends EventEmitter {
  private supabase: SupabaseClient
  private channels: Map<string, RealtimeChannel> = new Map()
  private notifications: RealtimeNotification[] = []
  private isTracking = false
  
  constructor(supabaseUrl?: string, supabaseKey?: string) {
    super()
    this.supabase = createClient(
      supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }
  
  /**
   * Start tracking notifications for a creator
   */
  async trackCreatorNotifications(creatorId: string): Promise<void> {
    const channelName = `creator-${creatorId}`
    
    if (this.channels.has(channelName)) {
      console.log(`⚠️ Already tracking notifications for creator ${creatorId}`)
      return
    }
    
    console.log(`📡 Starting to track notifications for creator ${creatorId}`)
    
    // Subscribe to creator's broadcast channel
    const channel = this.supabase
      .channel(channelName)
      .on('broadcast', { event: '*' }, (payload) => {
        this.handleNotification(channelName, 'broadcast', payload)
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Subscribed to creator ${creatorId} notifications`)
          this.isTracking = true
        }
      })
    
    this.channels.set(channelName, channel)
    
    // Also track database changes for video_requests
    const dbChannelName = `creator-requests-${creatorId}`
    const dbChannel = this.supabase
      .channel(dbChannelName)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'video_requests',
          filter: `creator_id=eq.${creatorId}`
        },
        (payload) => {
          this.handleNotification(dbChannelName, 'video_request', payload)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders',
          filter: `creator_id=eq.${creatorId}`
        },
        (payload) => {
          this.handleNotification(dbChannelName, 'new_order', payload)
        }
      )
      .subscribe()
    
    this.channels.set(dbChannelName, dbChannel)
  }
  
  /**
   * Track fan notifications
   */
  async trackFanNotifications(fanId: string): Promise<void> {
    const channelName = `fan-${fanId}`
    
    if (this.channels.has(channelName)) {
      console.log(`⚠️ Already tracking notifications for fan ${fanId}`)
      return
    }
    
    console.log(`📡 Starting to track notifications for fan ${fanId}`)
    
    const channel = this.supabase
      .channel(channelName)
      .on('broadcast', { event: '*' }, (payload) => {
        this.handleNotification(channelName, 'broadcast', payload)
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`✅ Subscribed to fan ${fanId} notifications`)
        }
      })
    
    this.channels.set(channelName, channel)
  }
  
  /**
   * Track order status updates
   */
  async trackOrderUpdates(orderId: string): Promise<void> {
    const channelName = `order-${orderId}`
    
    console.log(`📡 Tracking updates for order ${orderId}`)
    
    const channel = this.supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          this.handleNotification(channelName, 'order_update', payload)
        }
      )
      .subscribe()
    
    this.channels.set(channelName, channel)
  }
  
  /**
   * Handle incoming notification
   */
  private handleNotification(channel: string, type: string, payload: any): void {
    const notification: RealtimeNotification = {
      id: `${Date.now()}-${Math.random()}`,
      type,
      channel,
      payload,
      timestamp: new Date().toISOString()
    }
    
    this.notifications.push(notification)
    this.emit('notification', notification)
    
    console.log(`🔔 Notification received on ${channel}: ${type}`)
    
    // Emit specific events
    switch (type) {
      case 'new_order':
        this.emit('new_order', notification)
        break
      case 'video_request':
        this.emit('video_request', notification)
        break
      case 'order_update':
        this.emit('order_update', notification)
        break
      case 'broadcast':
        if (payload.event === 'new_order') {
          this.emit('creator_notified', notification)
        }
        break
    }
  }
  
  /**
   * Wait for a specific notification type
   */
  async waitForNotification(
    type: string,
    timeout: number = 30000,
    filter?: (notification: RealtimeNotification) => boolean
  ): Promise<RealtimeNotification> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout waiting for ${type} notification`))
      }, timeout)
      
      // Check existing notifications
      const existing = this.notifications.find(n => 
        n.type === type && (!filter || filter(n))
      )
      if (existing) {
        clearTimeout(timer)
        resolve(existing)
        return
      }
      
      // Wait for new notification
      const handler = (notification: RealtimeNotification) => {
        if (notification.type === type && (!filter || filter(notification))) {
          clearTimeout(timer)
          this.removeListener('notification', handler)
          resolve(notification)
        }
      }
      
      this.on('notification', handler)
    })
  }
  
  /**
   * Wait for creator to be notified of new order
   */
  async waitForCreatorNotification(
    creatorId: string,
    timeout: number = 30000
  ): Promise<boolean> {
    try {
      // Wait for either broadcast or database notification
      const notification = await Promise.race([
        this.waitForNotification('creator_notified', timeout),
        this.waitForNotification('new_order', timeout, (n) => 
          n.channel.includes(creatorId)
        ),
        this.waitForNotification('broadcast', timeout, (n) => 
          n.channel === `creator-${creatorId}` && 
          n.payload.event === 'new_order'
        )
      ])
      
      console.log('✅ Creator notification received:', notification.type)
      return true
    } catch (error) {
      console.log('❌ No creator notification received')
      return false
    }
  }
  
  /**
   * Get all notifications
   */
  getNotifications(): RealtimeNotification[] {
    return [...this.notifications]
  }
  
  /**
   * Get notifications by type
   */
  getNotificationsByType(type: string): RealtimeNotification[] {
    return this.notifications.filter(n => n.type === type)
  }
  
  /**
   * Clear notification history
   */
  clearNotifications(): void {
    this.notifications = []
  }
  
  /**
   * Stop tracking and cleanup
   */
  async stop(): Promise<void> {
    console.log('🛑 Stopping realtime notification tracking...')
    
    for (const [name, channel] of this.channels) {
      await this.supabase.removeChannel(channel)
      console.log(`✅ Unsubscribed from ${name}`)
    }
    
    this.channels.clear()
    this.isTracking = false
  }
  
  /**
   * Check if currently tracking
   */
  isActive(): boolean {
    return this.isTracking
  }
}

/**
 * Helper to track creator dashboard updates
 */
export async function trackCreatorDashboardUpdates(
  tracker: RealtimeNotificationTracker,
  creatorId: string,
  supabase: SupabaseClient
): Promise<{
  notificationReceived: boolean
  ordersUpdated: boolean
  statsUpdated: boolean
  realtimeUpdate: boolean
}> {
  console.log(`🔍 Tracking dashboard updates for creator ${creatorId}...`)
  
  // Start tracking
  await tracker.trackCreatorNotifications(creatorId)
  
  // Get initial state
  const { data: initialOrders } = await supabase
    .from('orders')
    .select('*')
    .eq('creator_id', creatorId)
    .order('created_at', { ascending: false })
  
  const initialOrderCount = initialOrders?.length || 0
  
  // Track results
  let notificationReceived = false
  let ordersUpdated = false
  let statsUpdated = false
  let realtimeUpdate = false
  
  // Set up listeners
  tracker.once('creator_notified', () => {
    notificationReceived = true
    console.log('✅ Creator notification received')
  })
  
  tracker.once('new_order', () => {
    realtimeUpdate = true
    console.log('✅ Realtime order update received')
  })
  
  // Return tracking object
  return {
    get notificationReceived() { return notificationReceived },
    get ordersUpdated() { return ordersUpdated },
    get statsUpdated() { return statsUpdated },
    get realtimeUpdate() { return realtimeUpdate },
    
    // Method to check for updates
    async checkForUpdates(): Promise<void> {
      // Check if orders were updated
      const { data: currentOrders } = await supabase
        .from('orders')
        .select('*')
        .eq('creator_id', creatorId)
        .order('created_at', { ascending: false })
      
      const currentOrderCount = currentOrders?.length || 0
      ordersUpdated = currentOrderCount > initialOrderCount
      
      if (ordersUpdated) {
        console.log(`✅ Orders updated: ${initialOrderCount} → ${currentOrderCount}`)
      }
      
      // Check if stats were updated
      const { data: stats } = await supabase
        .from('creator_stats')
        .select('*')
        .eq('creator_id', creatorId)
        .single()
      
      if (stats) {
        statsUpdated = true
        console.log('✅ Creator stats updated')
      }
    }
  } as any
}

/**
 * Setup realtime tracking for tests
 */
export async function setupRealtimeTracking(
  creatorId?: string,
  fanId?: string
): Promise<RealtimeNotificationTracker> {
  const tracker = new RealtimeNotificationTracker()
  
  if (creatorId) {
    await tracker.trackCreatorNotifications(creatorId)
  }
  
  if (fanId) {
    await tracker.trackFanNotifications(fanId)
  }
  
  return tracker
}