"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Video,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MessageSquare,
  Calendar,
  DollarSign,
  Gift,
  Star,
  RefreshCw,
  Download,
  Share2,
  ArrowLeft,
  Loader2,
  Bell,
  Package,
  Truck,
  PlayCircle,
  FileText,
  User,
  MapPin,
  CreditCard,
  Shield,
  Phone,
  Mail,
  Info,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSupabaseAuth } from "@/contexts/supabase-auth-compat"
import { useTranslations } from "next-intl"
import { useNotificationStream } from "@/hooks/use-notification-stream"
import { useNotificationStore } from "@/stores/notification-store"

// Types
interface OrderTimeline {
  id: string
  status: string
  title: string
  description: string
  timestamp: string
  icon: any
  completed: boolean
  current: boolean
  rejected?: boolean
  disabled?: boolean
}

interface OrderDetails {
  id: string
  orderNumber: string
  creatorName: string
  creatorAvatar: string
  creatorId: string
  occasion: string
  recipientName: string
  recipientRelation: string
  instructions: string
  amount: number
  currency: string
  paymentMethod: string
  status: 'pending' | 'accepted' | 'recording' | 'processing' | 'completed' | 'cancelled' | 'refunded'
  orderedAt: string
  acceptedAt?: string
  recordingStartedAt?: string
  processingStartedAt?: string
  completedAt?: string
  cancelledAt?: string
  expectedDelivery: string
  actualDelivery?: string
  videoUrl?: string
  videoDuration?: string
  rushOrder: boolean
  privateVideo: boolean
  allowDownload: boolean
  progress: number
  communicationLog: Array<{
    id: string
    type: 'system' | 'creator' | 'customer'
    message: string
    timestamp: string
  }>
}

// Mock order data
const mockOrder: OrderDetails = {
  id: "order-123",
  orderNumber: "ORD-2024-0123",
  creatorName: "Marie Jean",
  creatorAvatar: "/placeholder.svg",
  creatorId: "creator-1",
  occasion: "Birthday",
  recipientName: "Sarah Johnson",
  recipientRelation: "Sister",
  instructions: "Please wish my sister Sarah a happy 25th birthday! She loves your music, especially your song 'Lanmou Toujou'. If you could sing a few lines, that would be amazing. Her favorite color is purple and she just graduated from nursing school. Thanks so much!",
  amount: 75,
  currency: "USD",
  paymentMethod: "Stripe",
  status: "recording",
  orderedAt: "2024-03-20T10:00:00",
  acceptedAt: "2024-03-20T10:30:00",
  recordingStartedAt: "2024-03-20T14:00:00",
  expectedDelivery: "2024-03-22T18:00:00",
  rushOrder: false,
  privateVideo: false,
  allowDownload: true,
  progress: 65,
  communicationLog: [
    {
      id: "1",
      type: "system",
      message: "Order placed successfully",
      timestamp: "2024-03-20T10:00:00"
    },
    {
      id: "2",
      type: "system",
      message: "Payment confirmed",
      timestamp: "2024-03-20T10:01:00"
    },
    {
      id: "3",
      type: "creator",
      message: "Hi! I'm excited to create this birthday video for Sarah. I'll make it extra special!",
      timestamp: "2024-03-20T10:35:00"
    },
    {
      id: "4",
      type: "system",
      message: "Creator started recording",
      timestamp: "2024-03-20T14:00:00"
    }
  ]
}

export default function OrderTrackingPage() {
  const params = useParams()
  const router = useRouter()
  const t = useTranslations('orders')
  const { user, isLoading: authLoading, isAuthenticated } = useSupabaseAuth()

  const [order, setOrder] = useState<OrderDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState("")

  // Real-time notifications
  useNotificationStream()
  const notifications = useNotificationStore(state => state.notifications)

  // Fetch order data from database
  useEffect(() => {
    const fetchOrderData = async () => {
      console.log('=== Starting order fetch ===')
      console.log('User ID:', user?.id)
      console.log('Order ID:', params.orderId)
      console.log('Locale:', params.locale)

      if (!user?.id || !params.orderId) {
        console.error('Missing user ID or order ID')
        setError(t('alerts.orderNotFound'))
        setLoading(false)
        return
      }

      try {
        const { createClient } = await import('@/lib/supabase/client')
        const supabase = createClient()

        // First try to fetch by payment_intent_id, then by video_request id as fallback
        let videoRequest = null
        let fetchError = null

        // Check if orderId looks like a payment intent ID (starts with pi_)
        if (params.orderId.startsWith('pi_')) {
          console.log('Attempting to fetch by payment_intent_id:', params.orderId)

          // Try fetching by payment_intent_id
          const { data, error } = await supabase
            .from('video_requests')
            .select(`
              *,
              creator:creator_id (
                id,
                display_name,
                username,
                avatar_url
              )
            `)
            .eq('payment_intent_id', params.orderId)
            .eq('fan_id', user.id)
            .maybeSingle()

          console.log('Payment intent query result:')
          console.log('Data:', data)
          console.log('Error:', error)

          videoRequest = data
          fetchError = error

          // If not found by payment_intent_id, also try as regular ID
          if (!videoRequest && !error) {
            console.log('No data found by payment_intent_id, trying as regular ID')
            const { data: altData, error: altError } = await supabase
              .from('video_requests')
              .select(`
                *,
                creator:creator_id (
                  id,
                  display_name,
                  username,
                  avatar_url
                )
              `)
              .eq('id', params.orderId)
              .eq('fan_id', user.id)
              .maybeSingle()

            console.log('Alternative query result:')
            console.log('Data:', altData)
            console.log('Error:', altError)

            if (altData) {
              videoRequest = altData
              fetchError = null
            }
          }
        } else {
          console.log('Attempting to fetch by video_request ID:', params.orderId)

          // Try by video_request id
          const { data, error } = await supabase
            .from('video_requests')
            .select(`
              *,
              creator:creator_id (
                id,
                display_name,
                username,
                avatar_url
              )
            `)
            .eq('id', params.orderId)
            .eq('fan_id', user.id)
            .maybeSingle()

          console.log('Video request query result:')
          console.log('Data:', data)
          console.log('Error:', error)

          videoRequest = data
          fetchError = error
        }

        if (fetchError) {
          console.error('Database query error:')
          console.error('  Message:', fetchError.message || 'Unknown error')
          console.error('  Code:', fetchError.code || 'N/A')
          console.error('  Details:', fetchError.details || 'N/A')
          console.error('  Hint:', fetchError.hint || 'N/A')
          setError(t('alerts.loadingError'))
          setLoading(false)
          return
        }

        if (!videoRequest) {
          console.error('No video request found for ID:', params.orderId)

          // For payment intent IDs, try automatic recovery
          if (params.orderId.startsWith('pi_')) {
            console.log('🔄 Attempting automatic recovery for orphaned payment intent:', params.orderId)

            try {
              const recoveryResponse = await fetch('/api/payments/recover-orphaned-intent', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  paymentIntentId: params.orderId
                })
              })

              if (recoveryResponse.ok) {
                const recoveryData = await recoveryResponse.json()

                if (recoveryData.success && recoveryData.videoRequestId) {
                  console.log('✅ Automatic recovery successful, redirecting to proper order URL')
                  // Redirect to the proper video request ID URL
                  window.location.replace(`/${params.locale}/fan/orders/${recoveryData.videoRequestId}`)
                  return
                } else {
                  console.warn('⚠️ Automatic recovery failed:', recoveryData.error)
                }
              } else {
                console.warn('⚠️ Recovery API request failed')
              }
            } catch (recoveryError) {
              console.error('❌ Error during automatic recovery:', recoveryError)
            }
          }

          setError(t('alerts.orderNotFound'))
          setLoading(false)
          return
        }

        console.log('Successfully fetched video request:', videoRequest)

        // Map database fields to OrderDetails interface
        const orderDetails: OrderDetails = {
          id: videoRequest.id,
          orderNumber: `ORD-${new Date(videoRequest.created_at).getFullYear()}-${videoRequest.id.slice(0, 8).toUpperCase()}`,
          creatorName: videoRequest.creator?.display_name || videoRequest.creator?.username || 'Creator',
          creatorAvatar: videoRequest.creator?.avatar_url || '/placeholder.svg',
          creatorId: videoRequest.creator_id,
          occasion: videoRequest.occasion || '',
          recipientName: videoRequest.recipient_name || '',
          recipientRelation: '', // Not in database, could be added
          instructions: videoRequest.instructions || '',
          amount: videoRequest.price,
          currency: 'USD',
          paymentMethod: 'Stripe',
          status: mapDatabaseStatus(videoRequest.status),
          orderedAt: videoRequest.created_at,
          acceptedAt: videoRequest.accepted_at || undefined,
          recordingStartedAt: videoRequest.recording_started_at || undefined,
          processingStartedAt: undefined, // Could be added to database
          completedAt: videoRequest.delivered_at || undefined,
          cancelledAt: undefined, // Could be added to database
          expectedDelivery: calculateExpectedDelivery(videoRequest.created_at, videoRequest.rush_delivery),
          actualDelivery: videoRequest.delivered_at || undefined,
          videoUrl: videoRequest.video_url || undefined,
          videoDuration: undefined,
          rushOrder: videoRequest.rush_delivery || false,
          privateVideo: false, // Could be added to database
          allowDownload: true, // Could be added to database
          progress: calculateProgress(videoRequest.status),
          communicationLog: []
        }

        console.log('Mapped order details:', orderDetails)

        setOrder(orderDetails)
        setLoading(false)
      } catch (err) {
        console.error('Unexpected error fetching order:', err)
        setError(t('alerts.loadingError'))
        setLoading(false)
      }
    }

    if (user?.id && params.orderId) {
      fetchOrderData()
    } else {
      console.log('Waiting for user or orderId...')
      if (!user?.id) console.log('No user ID yet')
      if (!params.orderId) console.log('No order ID yet')
    }
  }, [user?.id, params.orderId, t])

  // Listen for real-time order status updates via notifications
  useEffect(() => {
    if (!order || !notifications) return

    const orderNotifications = notifications.filter(notification =>
      notification.metadata?.order_id === order.id &&
      (notification.type === 'order_accepted' ||
       notification.type === 'order_completed' ||
       notification.type === 'order_cancelled')
    )

    if (orderNotifications.length > 0) {
      const latestNotification = orderNotifications[0] // Most recent first

      // Update order status based on notification
      if (latestNotification.type === 'order_accepted' && order.status !== 'accepted') {
        console.log('📡 Real-time update: Order accepted')
        setOrder(prev => prev ? {
          ...prev,
          status: 'accepted',
          acceptedAt: new Date().toISOString()
        } : null)
      } else if (latestNotification.type === 'order_completed' && order.status !== 'completed') {
        console.log('📡 Real-time update: Order completed')
        setOrder(prev => prev ? {
          ...prev,
          status: 'completed',
          completedAt: new Date().toISOString()
        } : null)
      } else if (latestNotification.type === 'order_cancelled' && order.status !== 'cancelled') {
        console.log('📡 Real-time update: Order cancelled')
        setOrder(prev => prev ? {
          ...prev,
          status: 'cancelled',
          cancelledAt: new Date().toISOString()
        } : null)
      }
    }
  }, [notifications, order])

  // Helper function to map database status to UI status
  const mapDatabaseStatus = (dbStatus: string): OrderDetails['status'] => {
    const statusMap: Record<string, OrderDetails['status']> = {
      'pending': 'pending',
      'pending_payment': 'pending',
      'accepted': 'accepted',
      'in_progress': 'recording',
      'recording': 'recording',
      'processing': 'processing',
      'completed': 'completed',
      'delivered': 'completed',
      'cancelled': 'cancelled',
      'rejected': 'rejected',
      'expired': 'expired'
    }
    return statusMap[dbStatus] || 'pending'
  }

  // Calculate expected delivery based on creation date and rush status
  const calculateExpectedDelivery = (createdAt: string, isRush: boolean) => {
    const created = new Date(createdAt)
    const deliveryDays = isRush ? 1 : 3
    created.setDate(created.getDate() + deliveryDays)
    return created.toISOString()
  }

  // Calculate progress percentage based on simplified 4-step flow
  const calculateProgress = (status: string): number => {
    const progressMap: Record<string, number> = {
      'pending': 50,           // Order Placed (25%) + Payment Confirmed (25%) = 50%
      'pending_payment': 25,   // Only Order Placed = 25%
      'accepted': 75,          // Order + Payment + Creator Accepted = 75%
      'recording': 75,         // Same as accepted (we no longer track recording separately)
      'in_progress': 75,       // Same as accepted
      'processing': 75,        // Same as accepted
      'completed': 100,        // All 4 steps completed
      'delivered': 100,        // Same as completed
      'rejected': 75,          // Order + Payment + Rejection = 75% (but shows X icon)
      'cancelled': 75          // Same as rejected
    }
    return progressMap[status] || 50  // Default to 50% (Order + Payment) for unknown status
  }

  // Calculate time remaining
  useEffect(() => {
    if (!order?.expectedDelivery) return

    const calculateTimeRemaining = () => {
      const now = new Date()
      const delivery = new Date(order.expectedDelivery)
      const diff = delivery.getTime() - now.getTime()

      if (diff <= 0) {
        setTimeRemaining(t('timeline.deliveryReached'))
        return
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      
      if (days > 0) {
        setTimeRemaining(`${days}d ${hours}h ${minutes}m`)
      } else if (hours > 0) {
        setTimeRemaining(`${hours}h ${minutes}m`)
      } else {
        setTimeRemaining(`${minutes}m`)
      }
    }
    
    calculateTimeRemaining()
    const interval = setInterval(calculateTimeRemaining, 60000) // Update every minute
    
    return () => clearInterval(interval)
  }, [order?.expectedDelivery, t])
  
  // Generate timeline based on order status (Simplified 4-step flow)
  const generateTimeline = (): OrderTimeline[] => {
    if (!order || !order.orderedAt) return []

    // Check if order is rejected/cancelled
    const isRejected = order.status === 'rejected' || order.status === 'cancelled'

    const timeline: OrderTimeline[] = [
      {
        id: "placed",
        status: "placed",
        title: t('timeline.events.placed.title'),
        description: t('timeline.events.placed.description'),
        timestamp: order.orderedAt || "",
        icon: Package,
        completed: true,
        current: false
      },
      {
        id: "payment",
        status: "payment",
        title: t('timeline.events.paymentConfirmed.title'),
        description: t('timeline.events.paymentConfirmed.description'),
        timestamp: order.orderedAt || "",
        icon: CreditCard,
        completed: true,
        current: false
      },
      {
        id: "accepted",
        status: "accepted",
        title: isRejected ? t('timeline.events.rejected.title') : t('timeline.events.accepted.title'),
        description: isRejected
          ? t('timeline.events.rejected.description', { creator: order.creatorName || 'Creator' })
          : t('timeline.events.accepted.description', { creator: order.creatorName || 'Creator' }),
        timestamp: order.acceptedAt || order.cancelledAt || "",
        icon: isRejected ? X : CheckCircle,
        completed: !!order.acceptedAt || isRejected || order.status === "completed",
        current: order.status === "accepted",
        rejected: isRejected
      },
      {
        id: "completed",
        status: "completed",
        title: t('timeline.events.delivered.title'),
        description: t('timeline.events.delivered.description'),
        timestamp: order.completedAt || "",
        icon: PlayCircle,
        completed: order.status === "completed",
        current: order.status === "completed",
        disabled: isRejected // Don't show as achievable if order was rejected
      }
    ]

    return timeline
  }
  
  const timeline = order ? generateTimeline() : []
  
  // Get status configuration
  const getStatusConfig = () => {
    if (!order) return {
      label: "",
      color: "bg-gray-500",
      textColor: "text-gray-700",
      bgColor: "bg-gray-100",
      icon: AlertCircle,
      description: ""
    }

    switch (order.status) {
      case 'pending':
        return {
          label: t('statusLabels.pendingAcceptance'),
          color: "bg-yellow-500",
          textColor: "text-yellow-700",
          bgColor: "bg-yellow-100",
          icon: Clock,
          description: t('statusDescriptions.pendingAcceptance')
        }
      case 'accepted':
        return {
          label: t('statusLabels.accepted'),
          color: "bg-blue-500",
          textColor: "text-blue-700",
          bgColor: "bg-blue-100",
          icon: CheckCircle,
          description: t('statusDescriptions.accepted')
        }
      case 'recording':
        return {
          label: t('statusLabels.recording'),
          color: "bg-purple-500",
          textColor: "text-purple-700",
          bgColor: "bg-purple-100",
          icon: Video,
          description: t('statusDescriptions.recording')
        }
      case 'processing':
        return {
          label: t('statusLabels.processing'),
          color: "bg-indigo-500",
          textColor: "text-indigo-700",
          bgColor: "bg-indigo-100",
          icon: RefreshCw,
          description: t('statusDescriptions.processing')
        }
      case 'completed':
        return {
          label: t('statusLabels.delivered'),
          color: "bg-green-500",
          textColor: "text-green-700",
          bgColor: "bg-green-100",
          icon: CheckCircle,
          description: t('statusDescriptions.delivered')
        }
      case 'cancelled':
        return {
          label: t('statusLabels.cancelled'),
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-100",
          icon: XCircle,
          description: t('statusDescriptions.cancelled')
        }
      case 'refunded':
        return {
          label: t('statusLabels.refunded'),
          color: "bg-purple-500",
          textColor: "text-purple-700",
          bgColor: "bg-purple-100",
          icon: RefreshCw,
          description: t('statusDescriptions.refunded')
        }
      default:
        return {
          label: t('statusLabels.unknown'),
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-100",
          icon: AlertCircle,
          description: t('statusDescriptions.unknown')
        }
    }
  }
  
  const statusConfig = getStatusConfig()
  const StatusIcon = statusConfig.icon
  
  // Handlers
  const handleCancelOrder = async () => {
    setIsSubmitting(true)
    // TODO: Implement cancel order
    await new Promise(resolve => setTimeout(resolve, 2000))
    setOrder({ ...order, status: 'cancelled', cancelledAt: new Date().toISOString() })
    setIsSubmitting(false)
    setShowCancelDialog(false)
  }
  
  const handleSendMessage = async () => {
    if (!message.trim()) return
    
    setIsSubmitting(true)
    // TODO: Implement send message
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const newMessage = {
      id: Date.now().toString(),
      type: 'customer' as const,
      message: message,
      timestamp: new Date().toISOString()
    }
    
    setOrder({
      ...order,
      communicationLog: [...order.communicationLog, newMessage]
    })
    
    setMessage("")
    setIsSubmitting(false)
    setShowMessageDialog(false)
  }
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [authLoading, isAuthenticated, router])
  
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">{t('error')}</h2>
            <p className="text-gray-600 mb-4">{error || t('alerts.orderNotFound')}</p>
            <Button onClick={() => router.push('/fan/orders')}>
              {t('backToOrders')}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('backToOrders')}
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{t('title')}</h1>
              <p className="text-gray-600 mt-1">{t('orderNumber', { number: order.orderNumber })}</p>
            </div>
            <Badge className={cn("px-3 py-1", statusConfig.bgColor, statusConfig.textColor)}>
              <StatusIcon className="h-4 w-4 mr-1" />
              {statusConfig.label}
            </Badge>
          </div>
        </div>
        
        {/* Status Alert */}
        <Alert className="mb-6">
          <StatusIcon className="h-4 w-4" />
          <AlertDescription>
            <strong>{statusConfig.label}:</strong> {statusConfig.description}
            {order.status === 'recording' && order.progress > 0 && (
              <div className="mt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>{t('timeline.recordingProgress')}</span>
                  <span>{order.progress}%</span>
                </div>
                <Progress value={order.progress} className="h-2" />
              </div>
            )}
          </AlertDescription>
        </Alert>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Timeline and Communication */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t('timeline.title')}</span>
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span className="font-normal">{t('timeline.estimatedDelivery', { time: timeRemaining })}</span>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  {timeline.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <div key={item.id} className="flex gap-4 pb-8 last:pb-0">
                        {/* Line */}
                        {index < timeline.length - 1 && (
                          <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-gray-200" />
                        )}
                        
                        {/* Icon */}
                        <div className={cn(
                          "relative z-10 flex h-10 w-10 items-center justify-center rounded-full",
                          item.rejected
                            ? "bg-red-600 text-white"  // Red for rejection
                            : item.completed && !item.disabled
                              ? "bg-purple-600 text-white"
                              : "bg-gray-200 text-gray-400",
                          item.current && !item.rejected && "ring-4 ring-purple-100",
                          item.rejected && "ring-4 ring-red-100"
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-1">
                          <div className="flex items-center justify-between">
                            <h3 className={cn(
                              "font-semibold",
                              item.rejected
                                ? "text-red-600"  // Red text for rejection
                                : item.disabled
                                  ? "text-gray-400"  // Gray for disabled steps
                                  : !item.completed
                                    ? "text-gray-400"
                                    : "text-gray-900"  // Normal completed color
                            )}>
                              {item.title}
                            </h3>
                            {item.timestamp && (
                              <span className="text-sm text-gray-500">
                                {new Date(item.timestamp).toLocaleString()}
                              </span>
                            )}
                          </div>
                          <p className={cn(
                            "text-sm mt-1",
                            item.rejected
                              ? "text-red-500"  // Red description for rejection
                              : item.disabled
                                ? "text-gray-400"  // Gray for disabled steps
                                : item.completed
                                  ? "text-gray-600"
                                  : "text-gray-400"
                          )}>
                            {item.description}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
            
            {/* Communication Log */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t('communication.title')}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowMessageDialog(true)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t('communication.sendMessage')}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {order.communicationLog.map((log) => (
                    <div key={log.id} className={cn(
                      "flex gap-3",
                      log.type === 'customer' && "flex-row-reverse"
                    )}>
                      <Avatar className="h-8 w-8">
                        {log.type === 'creator' && (
                          <>
                            <AvatarImage src={order.creatorAvatar} />
                            <AvatarFallback>{order.creatorName[0]}</AvatarFallback>
                          </>
                        )}
                        {log.type === 'customer' && (
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                        {log.type === 'system' && (
                          <AvatarFallback className="bg-gray-100">
                            <Info className="h-4 w-4" />
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className={cn(
                        "flex-1",
                        log.type === 'customer' && "text-right"
                      )}>
                        <div className={cn(
                          "inline-block p-3 rounded-lg",
                          log.type === 'creator' && "bg-gray-100",
                          log.type === 'customer' && "bg-purple-100",
                          log.type === 'system' && "bg-blue-50 text-blue-700"
                        )}>
                          <p className="text-sm">{log.message}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(log.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Right Column - Order Details */}
          <div className="space-y-6">
            {/* Creator Info */}
            <Card>
              <CardHeader>
                <CardTitle>{t('details.creator')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={order.creatorAvatar} />
                    <AvatarFallback>{order.creatorName[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link
                      href={`/creator/${order.creatorId}`}
                      className="font-semibold hover:text-purple-600 transition-colors"
                    >
                      {order.creatorName}
                    </Link>
                    <p className="text-sm text-gray-600">{t('details.viewProfile')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Video Details */}
            <Card>
              <CardHeader>
                <CardTitle>{t('details.videoDetails')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">{t('details.occasion')}</p>
                  <p className="font-medium">{order.occasion}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">{t('details.for')}</p>
                  <p className="font-medium">{order.recipientName}</p>
                  <p className="text-sm text-gray-500">({order.recipientRelation})</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600 mb-2">{t('details.instructions')}</p>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{order.instructions}</p>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('details.rushOrder')}</span>
                  <Badge variant={order.rushOrder ? "default" : "secondary"}>
                    {order.rushOrder ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{t('details.privateVideo')}</span>
                  <Badge variant={order.privateVideo ? "default" : "secondary"}>
                    {order.privateVideo ? "Yes" : "No"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle>{t('details.payment')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('details.amount')}</span>
                  <span className="font-semibold">${order.amount} {order.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('details.method')}</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{t('details.paidOn')}</span>
                  <span className="font-medium">
                    {new Date(order.orderedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
            
            {/* Actions */}
            <Card>
              <CardContent className="pt-6 space-y-3">
                {order.status === 'completed' && order.videoUrl && (
                  <>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      {t('actions.watchVideo')}
                    </Button>
                    {order.allowDownload && (
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        {t('actions.downloadVideo')}
                      </Button>
                    )}
                    {!order.privateVideo && (
                      <Button variant="outline" className="w-full">
                        <Share2 className="h-4 w-4 mr-2" />
                        {t('actions.shareVideo')}
                      </Button>
                    )}
                  </>
                )}
                
                {['pending', 'accepted', 'recording'].includes(order.status) && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setShowMessageDialog(true)}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {t('communication.messageCreator')}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700"
                      onClick={() => setShowCancelDialog(true)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {t('actions.cancelOrder')}
                    </Button>
                  </>
                )}
                
                {order.status === 'cancelled' && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This order was cancelled on {new Date(order.cancelledAt!).toLocaleDateString()}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Cancel Order Dialog */}
        <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('dialogs.cancelOrder.title')}</DialogTitle>
              <DialogDescription>
                {t('dialogs.cancelOrder.description')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                {t('actions.keepOrder')}
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('actions.cancelling')}
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    {t('actions.cancelOrder')}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Message Dialog */}
        <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('dialogs.sendMessage.title')}</DialogTitle>
              <DialogDescription>
                {t('dialogs.sendMessage.description')}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder={t('communication.messagePlaceholder')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
                {t('cancel')}
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('communication.sending')}
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {t('communication.send')}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}