'use client'

import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RealtimeChannel } from '@supabase/supabase-js'
import { useToast } from '@/hooks/use-toast'

export interface VideoRequestNotification {
  id: string
  fan_id: string
  creator_id: string
  request_type: string
  occasion: string
  recipient_name: string
  instructions: string
  price: number // Changed from price_usd
  status: string
  created_at: string
  fan?: {
    username: string
    full_name: string
    avatar_url?: string
  }
}

interface UseCreatorNotificationsOptions {
  creatorId: string
  onNewRequest?: (request: VideoRequestNotification) => void
  playSound?: boolean
  showToast?: boolean
}

export function useCreatorNotifications({
  creatorId,
  onNewRequest,
  playSound = true,
  showToast = true,
}: UseCreatorNotificationsOptions) {
  const [isConnected, setIsConnected] = useState(false)
  const [newRequests, setNewRequests] = useState<VideoRequestNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const { toast } = useToast()
  const supabase = createClient()
  
  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (!playSound) return
    
    try {
      const audio = new Audio('/sounds/notification.mp3')
      audio.volume = 0.5
      audio.play().catch(err => {
        console.log('Could not play notification sound:', err)
      })
    } catch (error) {
      console.log('Audio not supported:', error)
    }
  }, [playSound])
  
  // Show browser notification
  const showBrowserNotification = useCallback((request: VideoRequestNotification) => {
    if (!('Notification' in window)) return
    
    if (Notification.permission === 'granted') {
      const notification = new Notification('New Video Request! 🎬', {
        body: `${request.fan?.full_name || 'Someone'} requested a ${request.occasion} video for ${request.recipient_name}`,
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        tag: `video-request-${request.id}`,
        requireInteraction: true,
      })
      
      notification.onclick = () => {
        window.focus()
        window.location.href = `/creator/requests`
        notification.close()
      }
    }
  }, [])
  
  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if (!('Notification' in window)) return
    
    if (Notification.permission === 'default') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    
    return Notification.permission === 'granted'
  }, [])
  
  // Handle broadcast notification from server
  const handleBroadcastNotification = useCallback(async (payload: any) => {
    console.log('New order notification received:', payload)
    
    const notificationPayload = payload.payload
    
    // Create a request-like object from the broadcast data
    const newRequest: VideoRequestNotification = {
      id: notificationPayload.orderId,
      fan_id: notificationPayload.fanId || 'unknown',
      creator_id: creatorId,
      request_type: 'video_request',
      occasion: notificationPayload.data?.occasion || 'unknown',
      recipient_name: notificationPayload.data?.recipientName || 'recipient',
      instructions: '',
      price: notificationPayload.amount || 0,
      status: 'pending',
      created_at: notificationPayload.timestamp,
      fan: {
        username: notificationPayload.fanName || 'A fan',
        full_name: notificationPayload.fanName || 'A fan',
      }
    }
    
    // Update state
    setNewRequests(prev => [...prev, newRequest])
    setUnreadCount(prev => prev + 1)
    
    // Play sound
    playNotificationSound()
    
    // Show toast
    if (showToast) {
      toast({
        title: notificationPayload.title || "New Video Request! 🎬",
        description: notificationPayload.message,
        duration: 5000,
      })
    }
    
    // Show browser notification
    showBrowserNotification(newRequest)
    
    // Call custom handler
    onNewRequest?.(newRequest)
  }, [creatorId, playNotificationSound, showToast, toast, showBrowserNotification, onNewRequest])
  
  // Set up realtime subscription
  useEffect(() => {
    if (!creatorId) return
    
    let channel: RealtimeChannel | null = null
    let isSubscribed = false
    
    const setupSubscription = async () => {
      // Prevent duplicate subscriptions
      if (isSubscribed) return
      
      // Request notification permission
      await requestNotificationPermission()
      
      // Remove any existing channel with same name first
      const existingChannel = supabase.getChannels().find(ch => 
        ch.topic === `realtime:creator-notifications-${creatorId}`
      )
      if (existingChannel) {
        await supabase.removeChannel(existingChannel)
      }
      
      // Create channel for broadcast notifications from server
      channel = supabase
        .channel(`creator-${creatorId}`)
        .on(
          'broadcast',
          { event: 'new_order' },
          handleBroadcastNotification
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            isSubscribed = true
            setIsConnected(true)
          } else if (status === 'CHANNEL_ERROR' || status === 'CLOSED') {
            isSubscribed = false
            setIsConnected(false)
          }
        })
    }
    
    setupSubscription()
    
    // Cleanup subscription
    return () => {
      isSubscribed = false
      if (channel) {
        supabase.removeChannel(channel)
        channel = null
      }
    }
  }, [creatorId, supabase, handleBroadcastNotification, requestNotificationPermission])
  
  // Mark requests as read
  const markAsRead = useCallback((requestIds?: string[]) => {
    if (requestIds) {
      setNewRequests(prev => prev.filter(r => !requestIds.includes(r.id)))
      setUnreadCount(prev => Math.max(0, prev - requestIds.length))
    } else {
      // Mark all as read
      setNewRequests([])
      setUnreadCount(0)
    }
  }, [])
  
  return {
    isConnected,
    newRequests,
    unreadCount,
    markAsRead,
  }
}