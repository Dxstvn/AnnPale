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
  Info
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"

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
  const { language } = useLanguage()
  const { user, isLoading: authLoading, isAuthenticated } = useSupabaseAuth()
  
  const [order, setOrder] = useState<OrderDetails>(mockOrder)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showMessageDialog, setShowMessageDialog] = useState(false)
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState("")
  
  // Calculate time remaining
  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date()
      const delivery = new Date(order.expectedDelivery)
      const diff = delivery.getTime() - now.getTime()
      
      if (diff <= 0) {
        setTimeRemaining("Delivery time reached")
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
  }, [order.expectedDelivery])
  
  // Generate timeline based on order status
  const generateTimeline = (): OrderTimeline[] => {
    const timeline: OrderTimeline[] = [
      {
        id: "placed",
        status: "placed",
        title: "Order Placed",
        description: "Your request has been submitted",
        timestamp: order.orderedAt,
        icon: Package,
        completed: true,
        current: false
      },
      {
        id: "payment",
        status: "payment",
        title: "Payment Confirmed",
        description: "Payment processed successfully",
        timestamp: order.orderedAt,
        icon: CreditCard,
        completed: true,
        current: false
      },
      {
        id: "accepted",
        status: "accepted",
        title: "Creator Accepted",
        description: `${order.creatorName} accepted your request`,
        timestamp: order.acceptedAt || "",
        icon: CheckCircle,
        completed: !!order.acceptedAt,
        current: order.status === "accepted"
      },
      {
        id: "recording",
        status: "recording",
        title: "Recording Video",
        description: "Creator is recording your personalized video",
        timestamp: order.recordingStartedAt || "",
        icon: Video,
        completed: !!order.recordingStartedAt,
        current: order.status === "recording"
      },
      {
        id: "processing",
        status: "processing",
        title: "Processing",
        description: "Video is being processed and prepared",
        timestamp: order.processingStartedAt || "",
        icon: RefreshCw,
        completed: !!order.processingStartedAt,
        current: order.status === "processing"
      },
      {
        id: "completed",
        status: "completed",
        title: "Delivered",
        description: "Your video is ready to watch!",
        timestamp: order.completedAt || "",
        icon: PlayCircle,
        completed: order.status === "completed",
        current: order.status === "completed"
      }
    ]
    
    return timeline
  }
  
  const timeline = generateTimeline()
  
  // Get status configuration
  const getStatusConfig = () => {
    switch (order.status) {
      case 'pending':
        return {
          label: "Pending Acceptance",
          color: "bg-yellow-500",
          textColor: "text-yellow-700",
          bgColor: "bg-yellow-100",
          icon: Clock,
          description: "Waiting for creator to accept your request"
        }
      case 'accepted':
        return {
          label: "Accepted",
          color: "bg-blue-500",
          textColor: "text-blue-700",
          bgColor: "bg-blue-100",
          icon: CheckCircle,
          description: "Creator has accepted and will record soon"
        }
      case 'recording':
        return {
          label: "Recording",
          color: "bg-purple-500",
          textColor: "text-purple-700",
          bgColor: "bg-purple-100",
          icon: Video,
          description: "Creator is recording your video"
        }
      case 'processing':
        return {
          label: "Processing",
          color: "bg-indigo-500",
          textColor: "text-indigo-700",
          bgColor: "bg-indigo-100",
          icon: RefreshCw,
          description: "Video is being processed"
        }
      case 'completed':
        return {
          label: "Delivered",
          color: "bg-green-500",
          textColor: "text-green-700",
          bgColor: "bg-green-100",
          icon: CheckCircle,
          description: "Your video is ready!"
        }
      case 'cancelled':
        return {
          label: "Cancelled",
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-100",
          icon: XCircle,
          description: "This order was cancelled"
        }
      case 'refunded':
        return {
          label: "Refunded",
          color: "bg-purple-500",
          textColor: "text-purple-700",
          bgColor: "bg-purple-100",
          icon: RefreshCw,
          description: "Payment has been refunded"
        }
      default:
        return {
          label: "Unknown",
          color: "bg-gray-500",
          textColor: "text-gray-700",
          bgColor: "bg-gray-100",
          icon: AlertCircle,
          description: "Status unknown"
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
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
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
            Back to Orders
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">Order Details</h1>
              <p className="text-gray-600 mt-1">Order #{order.orderNumber}</p>
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
                  <span>Recording Progress</span>
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
                  <span>Order Timeline</span>
                  {order.status !== 'completed' && order.status !== 'cancelled' && (
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4" />
                      <span className="font-normal">Est. delivery in {timeRemaining}</span>
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
                          item.completed
                            ? "bg-purple-600 text-white"
                            : "bg-gray-200 text-gray-400",
                          item.current && "ring-4 ring-purple-100"
                        )}>
                          <Icon className="h-5 w-5" />
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 pt-1">
                          <div className="flex items-center justify-between">
                            <h3 className={cn(
                              "font-semibold",
                              !item.completed && "text-gray-400"
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
                            item.completed ? "text-gray-600" : "text-gray-400"
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
                  <span>Communication</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowMessageDialog(true)}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
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
                <CardTitle>Creator</CardTitle>
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
                    <p className="text-sm text-gray-600">View Profile</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Video Details */}
            <Card>
              <CardHeader>
                <CardTitle>Video Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Occasion</p>
                  <p className="font-medium">{order.occasion}</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">For</p>
                  <p className="font-medium">{order.recipientName}</p>
                  <p className="text-sm text-gray-500">({order.recipientRelation})</p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600 mb-2">Instructions</p>
                  <p className="text-sm bg-gray-50 p-3 rounded-lg">{order.instructions}</p>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Rush Order</span>
                  <Badge variant={order.rushOrder ? "default" : "secondary"}>
                    {order.rushOrder ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Private Video</span>
                  <Badge variant={order.privateVideo ? "default" : "secondary"}>
                    {order.privateVideo ? "Yes" : "No"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            {/* Payment Info */}
            <Card>
              <CardHeader>
                <CardTitle>Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount</span>
                  <span className="font-semibold">${order.amount} {order.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Method</span>
                  <span className="font-medium">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Paid on</span>
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
                      Watch Video
                    </Button>
                    {order.allowDownload && (
                      <Button variant="outline" className="w-full">
                        <Download className="h-4 w-4 mr-2" />
                        Download Video
                      </Button>
                    )}
                    {!order.privateVideo && (
                      <Button variant="outline" className="w-full">
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Video
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
                      Message Creator
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 hover:text-red-700"
                      onClick={() => setShowCancelDialog(true)}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Cancel Order
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
              <DialogTitle>Cancel Order</DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel this order? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowCancelDialog(false)}>
                Keep Order
              </Button>
              <Button
                variant="destructive"
                onClick={handleCancelOrder}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Cancelling...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-2" />
                    Cancel Order
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
              <DialogTitle>Send Message to {order.creatorName}</DialogTitle>
              <DialogDescription>
                Send a message about your video request
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Textarea
                placeholder="Type your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || isSubmitting}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Send Message
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