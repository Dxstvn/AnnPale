import { useEffect, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface SubscriptionUpdate {
  id: string
  type: 'new_subscription' | 'subscription_cancelled' | 'subscription_renewed' | 'tier_changed'
  subscription_id: string
  fan_name?: string
  creator_name?: string
  tier_name?: string
  amount?: number
  timestamp: string
}

interface UseSubscriptionRealtimeProps {
  userId: string
  role: 'creator' | 'fan'
  onUpdate?: (update: SubscriptionUpdate) => void
}

export function useSubscriptionRealtime({ 
  userId, 
  role, 
  onUpdate 
}: UseSubscriptionRealtimeProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [updates, setUpdates] = useState<SubscriptionUpdate[]>([])
  const [isConnected, setIsConnected] = useState(false)

  const handleSubscriptionChange = useCallback((payload: any) => {
    const { eventType, new: newRecord, old: oldRecord } = payload

    let update: SubscriptionUpdate | null = null

    if (eventType === 'INSERT') {
      // New subscription
      update = {
        id: newRecord.id,
        type: 'new_subscription',
        subscription_id: newRecord.id,
        fan_name: newRecord.fan_name,
        tier_name: newRecord.tier_name,
        amount: newRecord.total_amount,
        timestamp: new Date().toISOString()
      }

      if (role === 'creator') {
        toast({
          title: '🎉 New Subscriber!',
          description: `${newRecord.fan_name || 'Someone'} subscribed to ${newRecord.tier_name || 'your tier'}`,
          action: {
            label: 'View',
            onClick: () => router.push('/creator/dashboard')
          }
        })
      }
    } else if (eventType === 'UPDATE') {
      // Check what changed
      if (oldRecord.status !== newRecord.status) {
        if (newRecord.status === 'cancelled') {
          update = {
            id: newRecord.id,
            type: 'subscription_cancelled',
            subscription_id: newRecord.id,
            fan_name: newRecord.fan_name,
            timestamp: new Date().toISOString()
          }

          if (role === 'creator') {
            toast({
              title: 'Subscription Cancelled',
              description: `${newRecord.fan_name || 'A subscriber'} cancelled their subscription`,
              variant: 'destructive'
            })
          }
        } else if (newRecord.status === 'active' && oldRecord.status === 'pending') {
          update = {
            id: newRecord.id,
            type: 'subscription_renewed',
            subscription_id: newRecord.id,
            timestamp: new Date().toISOString()
          }

          if (role === 'fan') {
            toast({
              title: '✅ Subscription Active',
              description: 'Your subscription has been activated successfully'
            })
          }
        }
      } else if (oldRecord.tier_id !== newRecord.tier_id) {
        update = {
          id: newRecord.id,
          type: 'tier_changed',
          subscription_id: newRecord.id,
          tier_name: newRecord.tier_name,
          timestamp: new Date().toISOString()
        }

        toast({
          title: 'Subscription Updated',
          description: `Subscription tier changed to ${newRecord.tier_name || 'new tier'}`
        })
      }
    }

    if (update) {
      setUpdates(prev => [update, ...prev].slice(0, 50)) // Keep last 50 updates
      onUpdate?.(update)
    }
  }, [role, toast, router, onUpdate])

  useEffect(() => {
    const supabase = createClient()
    
    // Subscribe to subscription changes based on role
    const channel = supabase
      .channel(`subscriptions:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscription_orders',
          filter: role === 'creator' 
            ? `creator_id=eq.${userId}`
            : `fan_id=eq.${userId}`
        },
        handleSubscriptionChange
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [userId, role, handleSubscriptionChange])

  const clearUpdates = useCallback(() => {
    setUpdates([])
  }, [])

  const dismissUpdate = useCallback((updateId: string) => {
    setUpdates(prev => prev.filter(u => u.id !== updateId))
  }, [])

  return {
    updates,
    isConnected,
    clearUpdates,
    dismissUpdate
  }
}