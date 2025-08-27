/**
 * Real-time Features Manager
 * Handles viewer tracking, chat, and live interactions using Supabase Realtime
 */

import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel, RealtimePresenceState } from '@supabase/supabase-js'
import { EventEmitter } from 'events'

export interface ViewerInfo {
  id: string
  name: string
  avatar?: string
  role: 'fan' | 'subscriber' | 'vip' | 'moderator' | 'creator'
  subscriptionTier?: 'basic' | 'premium' | 'vip'
  joinedAt: string
}

export interface ChatMessage {
  id: string
  streamId: string
  userId: string
  userName: string
  userAvatar?: string
  userRole: ViewerInfo['role']
  message: string
  timestamp: string
  isHighlighted?: boolean
  giftAmount?: number
  giftType?: 'tip' | 'super_chat' | 'gift'
}

export interface StreamMetrics {
  viewerCount: number
  peakViewerCount: number
  totalViews: number
  chatMessageCount: number
  totalGifts: number
  totalRevenue: number
}

export class RealtimeManager extends EventEmitter {
  private supabase = createClient()
  private channels: Map<string, RealtimeChannel> = new Map()
  private presence: Map<string, RealtimePresenceState> = new Map()
  private viewerCounts: Map<string, number> = new Map()
  private metrics: Map<string, StreamMetrics> = new Map()

  constructor() {
    super()
  }

  /**
   * Join a stream as a viewer
   */
  async joinStream(streamId: string, userInfo: ViewerInfo) {
    try {
      // Create or get channel for this stream
      const channelName = `stream:${streamId}`
      let channel = this.channels.get(channelName)

      if (!channel) {
        channel = this.supabase.channel(channelName, {
          config: {
            presence: {
              key: userInfo.id,
            },
          },
        })

        // Set up presence tracking for viewer count
        channel.on('presence', { event: 'sync' }, () => {
          const state = channel.presenceState()
          this.presence.set(streamId, state)
          this.updateViewerCount(streamId, state)
        })

        // Listen for presence joins
        channel.on('presence', { event: 'join' }, ({ key, newPresences }) => {
          console.log('User joined:', key, newPresences)
          this.emit('viewer:joined', { streamId, viewer: newPresences[0] })
        })

        // Listen for presence leaves
        channel.on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
          console.log('User left:', key, leftPresences)
          this.emit('viewer:left', { streamId, viewer: leftPresences[0] })
        })

        // Listen for chat messages
        channel.on('broadcast', { event: 'chat' }, ({ payload }) => {
          this.emit('chat:message', payload)
        })

        // Listen for gifts
        channel.on('broadcast', { event: 'gift' }, ({ payload }) => {
          this.emit('gift:received', payload)
        })

        // Listen for stream metrics updates
        channel.on('broadcast', { event: 'metrics' }, ({ payload }) => {
          this.metrics.set(streamId, payload)
          this.emit('metrics:updated', { streamId, metrics: payload })
        })

        // Subscribe to the channel
        await channel.subscribe()
        this.channels.set(channelName, channel)
      }

      // Track presence
      await channel.track({
        user_id: userInfo.id,
        user_name: userInfo.name,
        user_avatar: userInfo.avatar,
        user_role: userInfo.role,
        subscription_tier: userInfo.subscriptionTier,
        joined_at: new Date().toISOString(),
      })

      return channel
    } catch (error) {
      console.error('Error joining stream:', error)
      throw error
    }
  }

  /**
   * Leave a stream
   */
  async leaveStream(streamId: string) {
    const channelName = `stream:${streamId}`
    const channel = this.channels.get(channelName)

    if (channel) {
      await channel.untrack()
      await channel.unsubscribe()
      this.channels.delete(channelName)
      this.presence.delete(streamId)
      this.viewerCounts.delete(streamId)
    }
  }

  /**
   * Send a chat message
   */
  async sendChatMessage(
    streamId: string,
    userId: string,
    userName: string,
    message: string,
    userRole: ViewerInfo['role'] = 'fan'
  ) {
    const channelName = `stream:${streamId}`
    const channel = this.channels.get(channelName)

    if (!channel) {
      throw new Error('Not connected to stream')
    }

    const chatMessage: ChatMessage = {
      id: crypto.randomUUID(),
      streamId,
      userId,
      userName,
      userRole,
      message,
      timestamp: new Date().toISOString(),
      isHighlighted: userRole === 'vip' || userRole === 'creator',
    }

    // Broadcast message to all viewers
    await channel.send({
      type: 'broadcast',
      event: 'chat',
      payload: chatMessage,
    })

    // Store message in database for persistence
    await this.storeChatMessage(chatMessage)

    return chatMessage
  }

  /**
   * Send a gift or tip
   */
  async sendGift(
    streamId: string,
    userId: string,
    userName: string,
    amount: number,
    message?: string,
    giftType: 'tip' | 'super_chat' | 'gift' = 'tip'
  ) {
    const channelName = `stream:${streamId}`
    const channel = this.channels.get(channelName)

    if (!channel) {
      throw new Error('Not connected to stream')
    }

    const giftData = {
      id: crypto.randomUUID(),
      streamId,
      userId,
      userName,
      amount,
      message,
      giftType,
      timestamp: new Date().toISOString(),
    }

    // Broadcast gift to all viewers
    await channel.send({
      type: 'broadcast',
      event: 'gift',
      payload: giftData,
    })

    // Store gift in database
    await this.storeGift(giftData)

    // Update stream metrics
    const currentMetrics = this.metrics.get(streamId) || this.getDefaultMetrics()
    const updatedMetrics = {
      ...currentMetrics,
      totalGifts: currentMetrics.totalGifts + 1,
      totalRevenue: currentMetrics.totalRevenue + amount,
    }
    
    await this.updateStreamMetrics(streamId, updatedMetrics)

    return giftData
  }

  /**
   * Get current viewer count for a stream
   */
  getViewerCount(streamId: string): number {
    return this.viewerCounts.get(streamId) || 0
  }

  /**
   * Get current viewers list
   */
  getViewers(streamId: string): ViewerInfo[] {
    const state = this.presence.get(streamId)
    if (!state) return []

    const viewers: ViewerInfo[] = []
    Object.values(state).forEach((presences) => {
      presences.forEach((presence: any) => {
        viewers.push({
          id: presence.user_id,
          name: presence.user_name,
          avatar: presence.user_avatar,
          role: presence.user_role,
          subscriptionTier: presence.subscription_tier,
          joinedAt: presence.joined_at,
        })
      })
    })

    return viewers
  }

  /**
   * Get stream metrics
   */
  getStreamMetrics(streamId: string): StreamMetrics {
    return this.metrics.get(streamId) || this.getDefaultMetrics()
  }

  /**
   * Update viewer count
   */
  private updateViewerCount(streamId: string, state: RealtimePresenceState) {
    let count = 0
    Object.values(state).forEach((presences) => {
      count += presences.length
    })
    
    const previousCount = this.viewerCounts.get(streamId) || 0
    this.viewerCounts.set(streamId, count)

    // Update peak viewer count
    const metrics = this.metrics.get(streamId) || this.getDefaultMetrics()
    if (count > metrics.peakViewerCount) {
      metrics.peakViewerCount = count
      this.metrics.set(streamId, metrics)
    }

    // Emit viewer count change event
    if (count !== previousCount) {
      this.emit('viewerCount:changed', { streamId, count, previousCount })
    }
  }

  /**
   * Store chat message in database
   */
  private async storeChatMessage(message: ChatMessage) {
    try {
      const { error } = await this.supabase
        .from('stream_chat_messages')
        .insert({
          stream_id: message.streamId,
          user_id: message.userId,
          user_name: message.userName,
          user_role: message.userRole,
          message: message.message,
          is_highlighted: message.isHighlighted,
          created_at: message.timestamp,
        })

      if (error) {
        console.error('Error storing chat message:', error)
      }
    } catch (error) {
      console.error('Error storing chat message:', error)
    }
  }

  /**
   * Store gift in database
   */
  private async storeGift(gift: any) {
    try {
      const { error } = await this.supabase
        .from('stream_gifts')
        .insert({
          stream_id: gift.streamId,
          user_id: gift.userId,
          user_name: gift.userName,
          amount: gift.amount,
          message: gift.message,
          gift_type: gift.giftType,
          created_at: gift.timestamp,
        })

      if (error) {
        console.error('Error storing gift:', error)
      }
    } catch (error) {
      console.error('Error storing gift:', error)
    }
  }

  /**
   * Update stream metrics
   */
  private async updateStreamMetrics(streamId: string, metrics: StreamMetrics) {
    const channelName = `stream:${streamId}`
    const channel = this.channels.get(channelName)

    if (channel) {
      await channel.send({
        type: 'broadcast',
        event: 'metrics',
        payload: metrics,
      })
    }

    this.metrics.set(streamId, metrics)
  }

  /**
   * Get default metrics
   */
  private getDefaultMetrics(): StreamMetrics {
    return {
      viewerCount: 0,
      peakViewerCount: 0,
      totalViews: 0,
      chatMessageCount: 0,
      totalGifts: 0,
      totalRevenue: 0,
    }
  }

  /**
   * Cleanup all channels
   */
  async cleanup() {
    for (const [channelName, channel] of this.channels) {
      await channel.unsubscribe()
    }
    this.channels.clear()
    this.presence.clear()
    this.viewerCounts.clear()
    this.metrics.clear()
  }
}

// Export singleton instance
export const realtimeManager = new RealtimeManager()