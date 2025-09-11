'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Video, 
  DollarSign, 
  Calendar,
  User,
  MessageSquare,
  AlertCircle
} from 'lucide-react'
import { OrderStatusIndicator } from './order-status-indicator'
import { VideoUpload } from './video-upload'
import { formatDistanceToNow } from 'date-fns'
import { toast } from '@/hooks/use-toast'

interface Order {
  id: string
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'rejected'
  fan_id: string
  creator_id: string
  total_amount: number
  creator_earnings: number
  platform_fee: number
  occasion: string
  instructions: string
  created_at: string
  accepted_at?: string
  completed_at?: string
  metadata?: any
  video_url?: string
  video_metadata?: any
  video_uploaded_at?: string
  video_duration?: number
  video_size?: number
  user?: {
    id: string
    display_name: string
    avatar_url: string
    email: string
  }
}

export function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [processingOrder, setProcessingOrder] = useState<string | null>(null)
  const [uploadingOrders, setUploadingOrders] = useState<Set<string>>(new Set())
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)

  useEffect(() => {
    fetchOrders()
  }, [selectedStatus])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedStatus !== 'all') {
        params.append('status', selectedStatus)
      }
      params.append('limit', '20')

      const response = await fetch(`/api/creator/orders?${params}`)
      const data = await response.json()

      if (data.success) {
        setOrders(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptOrder = async (orderId: string) => {
    try {
      setProcessingOrder(orderId)
      const response = await fetch(`/api/creator/orders/${orderId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          notes: 'Thank you for your order! I will deliver your video within 7 days.'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Order accepted successfully'
        })
        fetchOrders() // Refresh the list
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to accept order',
        variant: 'destructive'
      })
    } finally {
      setProcessingOrder(null)
    }
  }

  const handleRejectOrder = async (orderId: string) => {
    try {
      setProcessingOrder(orderId)
      const response = await fetch(`/api/creator/orders/${orderId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reason: 'unavailable',
          notes: 'Unfortunately, I am unable to fulfill this request at this time.'
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast({
          title: 'Order Rejected',
          description: 'The order has been rejected and will be refunded'
        })
        fetchOrders() // Refresh the list
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject order',
        variant: 'destructive'
      })
    } finally {
      setProcessingOrder(null)
    }
  }

  const handleVideoUploadComplete = (orderId: string, data: any) => {
    // Update the order in state with video information
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: 'in_progress' as const,
            video_url: data.videoUrl,
            video_metadata: data.metadata,
            video_uploaded_at: new Date().toISOString()
          }
        : order
    ))

    // Remove from uploading state
    setUploadingOrders(prev => {
      const next = new Set(prev)
      next.delete(orderId)
      return next
    })

    // Collapse the order
    setExpandedOrder(null)
  }

  const handleVideoUploadError = (orderId: string, error: string) => {
    setUploadingOrders(prev => {
      const next = new Set(prev)
      next.delete(orderId)
      return next
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'accepted': return 'bg-blue-100 text-blue-800'
      case 'in_progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'accepted': return <CheckCircle className="h-4 w-4" />
      case 'in_progress': return <Video className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      default: return null
    }
  }

  const filteredOrders = selectedStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === selectedStatus)

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold">
                  {orders.filter(o => o.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold">
                  {orders.filter(o => ['accepted', 'in_progress'].includes(o.status)).length}
                </p>
              </div>
              <Video className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold">
                  {orders.filter(o => o.status === 'completed').length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Earnings</p>
                <p className="text-2xl font-bold">
                  ${orders
                    .filter(o => o.status === 'completed')
                    .reduce((sum, o) => sum + (o.creator_earnings || 0), 0)
                    .toFixed(2)}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedStatus} onValueChange={setSelectedStatus}>
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedStatus} className="mt-6">
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No orders found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <Card key={order.id} className="border-l-4" style={{
                      borderLeftColor: order.status === 'pending' ? '#EAB308' :
                                      order.status === 'accepted' ? '#3B82F6' :
                                      order.status === 'in_progress' ? '#8B5CF6' :
                                      order.status === 'completed' ? '#10B981' :
                                      order.status === 'rejected' ? '#EF4444' : '#6B7280'
                    }}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage src={order.user?.avatar_url} />
                              <AvatarFallback>
                                {order.user?.display_name?.[0] || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">
                                  {order.user?.display_name || 'Anonymous Fan'}
                                </p>
                                <OrderStatusIndicator 
                                  orderId={order.id}
                                  initialStatus={order.status}
                                  onStatusChange={(newStatus) => {
                                    // Update local state when status changes
                                    setOrders(prev => prev.map(o => 
                                      o.id === order.id ? { ...o, status: newStatus } : o
                                    ))
                                  }}
                                />
                              </div>
                              
                              <div className="text-sm text-gray-600 space-y-1">
                                <div className="flex items-center gap-2">
                                  <MessageSquare className="h-3 w-3" />
                                  <span>Occasion: {order.occasion || 'General message'}</span>
                                </div>
                                {order.instructions && (
                                  <div className="flex items-start gap-2">
                                    <MessageSquare className="h-3 w-3 mt-0.5" />
                                    <span className="line-clamp-2">{order.instructions}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-4">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <DollarSign className="h-3 w-3" />
                                    ${order.creator_earnings?.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {order.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectOrder(order.id)}
                                  disabled={processingOrder === order.id}
                                >
                                  Decline
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleAcceptOrder(order.id)}
                                  disabled={processingOrder === order.id}
                                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                                >
                                  Accept
                                </Button>
                              </>
                            )}
                            {order.status === 'accepted' && !order.video_url && (
                              <Button
                                size="sm"
                                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                              >
                                <Video className="h-4 w-4 mr-1" />
                                Upload Video
                              </Button>
                            )}
                            {order.status === 'in_progress' && order.video_url && (
                              <Button size="sm" variant="outline">
                                Video Uploaded
                              </Button>
                            )}
                            {order.status === 'completed' && (
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                      
                      {/* Video Upload Section - Show when order is expanded and accepted */}
                      {expandedOrder === order.id && order.status === 'accepted' && !order.video_url && (
                        <CardContent className="pt-0">
                          <div className="border-t pt-4">
                            <VideoUpload
                              orderId={order.id}
                              onUploadComplete={(data) => handleVideoUploadComplete(order.id, data)}
                              onUploadError={(error) => handleVideoUploadError(order.id, error)}
                              disabled={uploadingOrders.has(order.id)}
                            />
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}