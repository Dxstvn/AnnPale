'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Bell, CheckCircle, Clock, AlertCircle, Video, XCircle } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

interface OrderStatus {
  id: string
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'rejected' | 'disputed'
  fan_name?: string
  occasion?: string
  updated_at: string
}

interface OrderStatusIndicatorProps {
  orderId: string
  initialStatus: OrderStatus['status']
  onStatusChange?: (newStatus: OrderStatus['status']) => void
}

export function OrderStatusIndicator({ orderId, initialStatus, onStatusChange }: OrderStatusIndicatorProps) {
  const [status, setStatus] = useState<OrderStatus['status']>(initialStatus)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    
    // Subscribe to real-time changes for this specific order
    const channel = supabase
      .channel(`order-status-${orderId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'orders',
        filter: `id=eq.${orderId}`
      }, (payload) => {
        const newStatus = payload.new.status as OrderStatus['status']
        if (newStatus !== status) {
          setStatus(newStatus)
          setIsAnimating(true)
          setTimeout(() => setIsAnimating(false), 1000)
          
          // Show toast notification for status change
          showStatusChangeToast(status, newStatus)
          
          if (onStatusChange) {
            onStatusChange(newStatus)
          }
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [orderId, status, onStatusChange])

  const showStatusChangeToast = (oldStatus: string, newStatus: string) => {
    const messages: Record<string, string> = {
      'accepted': '✅ Order has been accepted!',
      'in_progress': '🎥 Creator started working on your video',
      'completed': '🎉 Your video is ready!',
      'rejected': '❌ Order has been rejected',
      'disputed': '⚠️ Order is under dispute review'
    }

    if (messages[newStatus]) {
      toast({
        title: 'Order Status Updated',
        description: messages[newStatus]
      })
    }
  }

  const getStatusConfig = (status: OrderStatus['status']) => {
    switch (status) {
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
          icon: <Clock className="h-3 w-3" />,
          label: 'Pending',
          pulseColor: 'bg-yellow-400'
        }
      case 'accepted':
        return {
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          icon: <CheckCircle className="h-3 w-3" />,
          label: 'Accepted',
          pulseColor: 'bg-blue-400'
        }
      case 'in_progress':
        return {
          color: 'bg-purple-100 text-purple-800 border-purple-300',
          icon: <Video className="h-3 w-3" />,
          label: 'Recording',
          pulseColor: 'bg-purple-400'
        }
      case 'completed':
        return {
          color: 'bg-green-100 text-green-800 border-green-300',
          icon: <CheckCircle className="h-3 w-3" />,
          label: 'Completed',
          pulseColor: 'bg-green-400'
        }
      case 'rejected':
        return {
          color: 'bg-red-100 text-red-800 border-red-300',
          icon: <XCircle className="h-3 w-3" />,
          label: 'Rejected',
          pulseColor: 'bg-red-400'
        }
      case 'disputed':
        return {
          color: 'bg-orange-100 text-orange-800 border-orange-300',
          icon: <AlertCircle className="h-3 w-3" />,
          label: 'Disputed',
          pulseColor: 'bg-orange-400'
        }
      default:
        return {
          color: 'bg-gray-100 text-gray-800 border-gray-300',
          icon: <Clock className="h-3 w-3" />,
          label: 'Unknown',
          pulseColor: 'bg-gray-400'
        }
    }
  }

  const config = getStatusConfig(status)

  return (
    <div className="relative inline-flex">
      <Badge 
        className={`
          ${config.color} 
          ${isAnimating ? 'scale-110 transition-transform duration-300' : 'transition-transform duration-300'}
          border flex items-center gap-1 px-2 py-1
        `}
      >
        {config.icon}
        <span className="text-xs font-medium">{config.label}</span>
      </Badge>
      
      {/* Pulse animation for active states */}
      {(status === 'pending' || status === 'in_progress') && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${config.pulseColor} opacity-75`}></span>
          <span className={`relative inline-flex rounded-full h-3 w-3 ${config.pulseColor}`}></span>
        </span>
      )}
    </div>
  )
}

// Real-time order notifications component
export function OrderNotificationBell({ creatorId }: { creatorId: string }) {
  const [newOrders, setNewOrders] = useState(0)
  const [showNotification, setShowNotification] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    
    // Subscribe to new orders for this creator
    const channel = supabase
      .channel(`creator-orders-${creatorId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'orders',
        filter: `creator_id=eq.${creatorId}`
      }, (payload) => {
        setNewOrders(prev => prev + 1)
        setShowNotification(true)
        
        // Show toast for new order
        toast({
          title: '🎉 New Order Received!',
          description: `New video request for ${payload.new.occasion || 'a special occasion'}`,
          action: {
            label: 'View',
            onClick: () => window.location.href = '/creator/dashboard'
          }
        })
        
        // Play notification sound if available
        try {
          const audio = new Audio('/sounds/notification.mp3')
          audio.play().catch(() => {})
        } catch {}
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [creatorId])

  const handleClick = () => {
    setNewOrders(0)
    setShowNotification(false)
  }

  return (
    <button
      onClick={handleClick}
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      aria-label={`${newOrders} new orders`}
    >
      <Bell className="h-5 w-5 text-gray-600" />
      
      {newOrders > 0 && (
        <>
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {newOrders > 9 ? '9+' : newOrders}
          </span>
          
          {showNotification && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            </span>
          )}
        </>
      )}
    </button>
  )
}