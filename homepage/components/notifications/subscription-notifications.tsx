'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Bell,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  UserPlus,
  UserMinus,
  RefreshCw,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  Sparkles
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { useSubscriptionRealtime } from '@/hooks/use-subscription-realtime'
import { cn } from '@/lib/utils'
import { formatCurrency } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

interface SubscriptionNotificationsProps {
  userId: string
  role: 'creator' | 'fan'
  className?: string
}

export function SubscriptionNotifications({ 
  userId, 
  role,
  className 
}: SubscriptionNotificationsProps) {
  const { updates, isConnected, dismissUpdate } = useSubscriptionRealtime({
    userId,
    role
  })

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'new_subscription':
        return <UserPlus className="h-4 w-4 text-green-600" />
      case 'subscription_cancelled':
        return <UserMinus className="h-4 w-4 text-red-600" />
      case 'subscription_renewed':
        return <RefreshCw className="h-4 w-4 text-blue-600" />
      case 'tier_changed':
        return <TrendingUp className="h-4 w-4 text-purple-600" />
      default:
        return <Bell className="h-4 w-4 text-gray-600" />
    }
  }

  const getUpdateMessage = (update: any) => {
    switch (update.type) {
      case 'new_subscription':
        return role === 'creator'
          ? `${update.fan_name || 'Someone'} subscribed to ${update.tier_name || 'your tier'}`
          : `You subscribed to ${update.creator_name || 'a creator'}`
      case 'subscription_cancelled':
        return role === 'creator'
          ? `${update.fan_name || 'A subscriber'} cancelled their subscription`
          : `Your subscription to ${update.creator_name || 'a creator'} was cancelled`
      case 'subscription_renewed':
        return role === 'creator'
          ? `${update.fan_name || 'A subscriber'}'s subscription renewed`
          : `Your subscription renewed successfully`
      case 'tier_changed':
        return `Subscription tier changed to ${update.tier_name || 'new tier'}`
      default:
        return 'Subscription update'
    }
  }

  const getUpdateColor = (type: string) => {
    switch (type) {
      case 'new_subscription':
        return 'bg-green-50 border-green-200'
      case 'subscription_cancelled':
        return 'bg-red-50 border-red-200'
      case 'subscription_renewed':
        return 'bg-blue-50 border-blue-200'
      case 'tier_changed':
        return 'bg-purple-50 border-purple-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  if (updates.length === 0) {
    return null
  }

  return (
    <Card className={cn("fixed bottom-4 right-4 w-96 shadow-xl z-50", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <CardTitle className="text-base">Live Updates</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {isConnected ? (
              <Badge variant="outline" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                Live
              </Badge>
            ) : (
              <Badge variant="outline" className="text-xs">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Connecting
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px]">
          <AnimatePresence>
            {updates.map((update) => (
              <motion.div
                key={update.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 100 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  "p-3 border-b last:border-0 hover:bg-gray-50 transition-colors",
                  getUpdateColor(update.type)
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getUpdateIcon(update.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {getUpdateMessage(update)}
                      </p>
                      {update.amount && (
                        <p className="text-xs text-gray-600 mt-1">
                          Amount: {formatCurrency(update.amount)}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(update.timestamp), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => dismissUpdate(update.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

// Notification Badge Component for showing count
export function SubscriptionNotificationBadge({ 
  userId, 
  role 
}: { 
  userId: string
  role: 'creator' | 'fan' 
}) {
  const { updates, isConnected } = useSubscriptionRealtime({ userId, role })
  const [showNotifications, setShowNotifications] = useState(false)
  
  const unreadCount = updates.length

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-600 text-white"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
        {isConnected && (
          <span className="absolute top-0 right-0 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
        )}
      </Button>

      {showNotifications && (
        <SubscriptionNotifications 
          userId={userId} 
          role={role}
          className="fixed top-16 right-4 bottom-auto"
        />
      )}
    </>
  )
}

// Live Stats Component for Dashboard
export function SubscriptionLiveStats({ 
  userId, 
  role 
}: { 
  userId: string
  role: 'creator' | 'fan' 
}) {
  const [stats, setStats] = useState({
    newToday: 0,
    cancelledToday: 0,
    renewedToday: 0,
    totalActive: 0
  })

  const { updates } = useSubscriptionRealtime({
    userId,
    role,
    onUpdate: (update) => {
      // Update stats based on the update type
      setStats(prev => {
        const newStats = { ...prev }
        
        switch (update.type) {
          case 'new_subscription':
            newStats.newToday++
            newStats.totalActive++
            break
          case 'subscription_cancelled':
            newStats.cancelledToday++
            newStats.totalActive = Math.max(0, newStats.totalActive - 1)
            break
          case 'subscription_renewed':
            newStats.renewedToday++
            break
        }
        
        return newStats
      })
    }
  })

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Today</CardTitle>
          <UserPlus className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.newToday}</div>
          <AnimatePresence>
            {stats.newToday > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center text-xs text-green-600 mt-1"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                Live update
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
          <UserMinus className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.cancelledToday}</div>
          {stats.cancelledToday > 0 && (
            <div className="flex items-center text-xs text-red-600 mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              Today
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Renewed</CardTitle>
          <RefreshCw className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.renewedToday}</div>
          {stats.renewedToday > 0 && (
            <div className="flex items-center text-xs text-blue-600 mt-1">
              <CheckCircle className="h-3 w-3 mr-1" />
              Today
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Active</CardTitle>
          <Users className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalActive}</div>
          <div className="flex items-center text-xs text-purple-600 mt-1">
            <Sparkles className="h-3 w-3 mr-1" />
            Real-time
          </div>
        </CardContent>
      </Card>
    </div>
  )
}