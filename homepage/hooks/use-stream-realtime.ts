'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { 
  realtimeManager, 
  ViewerInfo, 
  ChatMessage, 
  StreamMetrics 
} from '@/lib/streaming/realtime-manager'

export interface UseStreamRealtimeOptions {
  streamId: string
  userId?: string
  userName?: string
  userRole?: ViewerInfo['role']
  subscriptionTier?: 'basic' | 'premium' | 'vip'
  autoJoin?: boolean
}

export function useStreamRealtime({
  streamId,
  userId = 'anonymous',
  userName = 'Anonymous User',
  userRole = 'fan',
  subscriptionTier,
  autoJoin = true,
}: UseStreamRealtimeOptions) {
  const [viewerCount, setViewerCount] = useState(0)
  const [viewers, setViewers] = useState<ViewerInfo[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [metrics, setMetrics] = useState<StreamMetrics>({
    viewerCount: 0,
    peakViewerCount: 0,
    totalViews: 0,
    chatMessageCount: 0,
    totalGifts: 0,
    totalRevenue: 0,
  })
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const hasJoined = useRef(false)

  // Join stream
  const joinStream = useCallback(async () => {
    if (hasJoined.current || !streamId) return

    setIsConnecting(true)
    try {
      const userInfo: ViewerInfo = {
        id: userId,
        name: userName,
        role: userRole,
        subscriptionTier,
        joinedAt: new Date().toISOString(),
      }

      await realtimeManager.joinStream(streamId, userInfo)
      hasJoined.current = true
      setIsConnected(true)

      // Get initial data
      setViewerCount(realtimeManager.getViewerCount(streamId))
      setViewers(realtimeManager.getViewers(streamId))
      setMetrics(realtimeManager.getStreamMetrics(streamId))
    } catch (error) {
      console.error('Error joining stream:', error)
    } finally {
      setIsConnecting(false)
    }
  }, [streamId, userId, userName, userRole, subscriptionTier])

  // Leave stream
  const leaveStream = useCallback(async () => {
    if (!hasJoined.current) return

    try {
      await realtimeManager.leaveStream(streamId)
      hasJoined.current = false
      setIsConnected(false)
      setViewerCount(0)
      setViewers([])
    } catch (error) {
      console.error('Error leaving stream:', error)
    }
  }, [streamId])

  // Send chat message
  const sendMessage = useCallback(async (message: string) => {
    if (!isConnected) {
      console.warn('Not connected to stream')
      return
    }

    try {
      const chatMessage = await realtimeManager.sendChatMessage(
        streamId,
        userId,
        userName,
        message,
        userRole
      )
      
      // Optimistically add message to local state
      setMessages((prev) => [...prev, chatMessage])
      
      return chatMessage
    } catch (error) {
      console.error('Error sending message:', error)
      throw error
    }
  }, [streamId, userId, userName, userRole, isConnected])

  // Send gift
  const sendGift = useCallback(async (
    amount: number,
    message?: string,
    giftType: 'tip' | 'super_chat' | 'gift' = 'tip'
  ) => {
    if (!isConnected) {
      console.warn('Not connected to stream')
      return
    }

    try {
      const gift = await realtimeManager.sendGift(
        streamId,
        userId,
        userName,
        amount,
        message,
        giftType
      )
      
      // Create a special chat message for the gift
      const giftMessage: ChatMessage = {
        id: crypto.randomUUID(),
        streamId,
        userId,
        userName,
        userRole,
        message: message || `Sent a ${giftType}!`,
        timestamp: new Date().toISOString(),
        isHighlighted: true,
        giftAmount: amount,
        giftType,
      }
      
      setMessages((prev) => [...prev, giftMessage])
      
      return gift
    } catch (error) {
      console.error('Error sending gift:', error)
      throw error
    }
  }, [streamId, userId, userName, userRole, isConnected])

  // Set up event listeners
  useEffect(() => {
    if (!streamId) return

    const handleViewerCountChange = ({ streamId: sid, count }: any) => {
      if (sid === streamId) {
        setViewerCount(count)
      }
    }

    const handleViewerJoined = ({ streamId: sid, viewer }: any) => {
      if (sid === streamId) {
        setViewers((prev) => {
          // Check if viewer already exists
          const exists = prev.some((v) => v.id === viewer.user_id)
          if (exists) return prev
          
          const newViewer: ViewerInfo = {
            id: viewer.user_id,
            name: viewer.user_name,
            avatar: viewer.user_avatar,
            role: viewer.user_role,
            subscriptionTier: viewer.subscription_tier,
            joinedAt: viewer.joined_at,
          }
          return [...prev, newViewer]
        })
      }
    }

    const handleViewerLeft = ({ streamId: sid, viewer }: any) => {
      if (sid === streamId) {
        setViewers((prev) => prev.filter((v) => v.id !== viewer.user_id))
      }
    }

    const handleChatMessage = (message: ChatMessage) => {
      if (message.streamId === streamId) {
        setMessages((prev) => {
          // Avoid duplicates
          const exists = prev.some((m) => m.id === message.id)
          if (exists) return prev
          return [...prev, message]
        })
      }
    }

    const handleGiftReceived = (gift: any) => {
      if (gift.streamId === streamId) {
        // Create a special chat message for the gift
        const giftMessage: ChatMessage = {
          id: gift.id,
          streamId: gift.streamId,
          userId: gift.userId,
          userName: gift.userName,
          userRole: 'fan',
          message: gift.message || `Sent a ${gift.giftType}!`,
          timestamp: gift.timestamp,
          isHighlighted: true,
          giftAmount: gift.amount,
          giftType: gift.giftType,
        }
        
        setMessages((prev) => {
          const exists = prev.some((m) => m.id === gift.id)
          if (exists) return prev
          return [...prev, giftMessage]
        })
      }
    }

    const handleMetricsUpdated = ({ streamId: sid, metrics: m }: any) => {
      if (sid === streamId) {
        setMetrics(m)
      }
    }

    // Subscribe to events
    realtimeManager.on('viewerCount:changed', handleViewerCountChange)
    realtimeManager.on('viewer:joined', handleViewerJoined)
    realtimeManager.on('viewer:left', handleViewerLeft)
    realtimeManager.on('chat:message', handleChatMessage)
    realtimeManager.on('gift:received', handleGiftReceived)
    realtimeManager.on('metrics:updated', handleMetricsUpdated)

    // Auto-join if enabled
    if (autoJoin && !hasJoined.current) {
      joinStream()
    }

    // Cleanup
    return () => {
      realtimeManager.off('viewerCount:changed', handleViewerCountChange)
      realtimeManager.off('viewer:joined', handleViewerJoined)
      realtimeManager.off('viewer:left', handleViewerLeft)
      realtimeManager.off('chat:message', handleChatMessage)
      realtimeManager.off('gift:received', handleGiftReceived)
      realtimeManager.off('metrics:updated', handleMetricsUpdated)
    }
  }, [streamId, autoJoin, joinStream])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (hasJoined.current) {
        leaveStream()
      }
    }
  }, [leaveStream])

  return {
    // State
    viewerCount,
    viewers,
    messages,
    metrics,
    isConnected,
    isConnecting,
    
    // Actions
    joinStream,
    leaveStream,
    sendMessage,
    sendGift,
  }
}