'use client'

import { useState } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { 
  Package, Clock, CheckCircle, XCircle, Download, MessageSquare,
  Calendar, CreditCard, Video, Gift, Star, Filter, Search,
  ChevronRight, AlertCircle, Truck, RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface Order {
  id: string
  type: 'video' | 'call' | 'livestream' | 'gift'
  creatorName: string
  creatorImage: string
  recipientName?: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded'
  date: string
  deliveryDate?: string
  duration?: string
  occasion?: string
  message?: string
}

export default function CustomerOrdersPage() {
  const { language } = useLanguage()
  const [selectedTab, setSelectedTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Mock orders data
  const orders: Order[] = [
    {
      id: 'ORD-001',
      type: 'video',
      creatorName: 'Marie-Claire Laurent',
      creatorImage: '/api/placeholder/40/40',
      recipientName: 'John Doe',
      amount: 50,
      status: 'processing',
      date: '2024-01-15',
      deliveryDate: '2024-01-18',
      occasion: 'Birthday',
      message: 'Happy birthday message for my brother'
    },
    {
      id: 'ORD-002',
      type: 'call',
      creatorName: 'Jean-Baptiste Pierre',
      creatorImage: '/api/placeholder/40/40',
      amount: 75,
      status: 'completed',
      date: '2024-01-14',
      duration: '10 minutes'
    },
    {
      id: 'ORD-003',
      type: 'livestream',
      creatorName: 'Sophie Duval',
      creatorImage: '/api/placeholder/40/40',
      amount: 25,
      status: 'completed',
      date: '2024-01-13'
    },
    {
      id: 'ORD-004',
      type: 'gift',
      creatorName: 'Marcus Thompson',
      creatorImage: '/api/placeholder/40/40',
      recipientName: 'Sarah Johnson',
      amount: 100,
      status: 'pending',
      date: '2024-01-16',
      deliveryDate: '2024-01-20',
      occasion: 'Anniversary'
    },
    {
      id: 'ORD-005',
      type: 'video',
      creatorName: 'Lisa Chen',
      creatorImage: '/api/placeholder/40/40',
      amount: 45,
      status: 'cancelled',
      date: '2024-01-12'
    },
    {
      id: 'ORD-006',
      type: 'call',
      creatorName: 'David Kim',
      creatorImage: '/api/placeholder/40/40',
      amount: 60,
      status: 'refunded',
      date: '2024-01-10',
      duration: '5 minutes'
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'processing':
        return <RefreshCw className="h-4 w-4 animate-spin" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelled':
        return <XCircle className="h-4 w-4" />
      case 'refunded':
        return <AlertCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-gray-100 text-gray-800'
      default:
        return ''
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />
      case 'call':
        return <Phone className="h-4 w-4" />
      case 'livestream':
        return <Radio className="h-4 w-4" />
      case 'gift':
        return <Gift className="h-4 w-4" />
      default:
        return null
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === 'all' || order.type === filterType
    const matchesTab = selectedTab === 'all' || 
                       (selectedTab === 'active' && ['pending', 'processing'].includes(order.status)) ||
                       (selectedTab === 'completed' && order.status === 'completed') ||
                       (selectedTab === 'cancelled' && ['cancelled', 'refunded'].includes(order.status))
    
    return matchesSearch && matchesType && matchesTab
  })

  const stats = {
    total: orders.length,
    active: orders.filter(o => ['pending', 'processing'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'completed').length,
    totalSpent: orders.reduce((sum, o) => sum + o.amount, 0)
  }

  const OrderCard = ({ order }: { order: Order }) => (
    <Card 
      className="hover:shadow-lg transition-all cursor-pointer border-gray-200"
      onClick={() => setSelectedOrder(order)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={order.creatorImage} alt={order.creatorName} />
              <AvatarFallback>{order.creatorName[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{order.creatorName}</h3>
                <Badge variant="outline" className="flex items-center space-x-1">
                  {getTypeIcon(order.type)}
                  <span className="capitalize">{order.type}</span>
                </Badge>
              </div>
              <p className="text-sm text-gray-500">Order #{order.id}</p>
              {order.recipientName && (
                <p className="text-sm text-gray-600">
                  <Gift className="inline h-3 w-3 mr-1" />
                  For: {order.recipientName}
                </p>
              )}
              {order.occasion && (
                <p className="text-sm text-purple-600">{order.occasion}</p>
              )}
            </div>
          </div>
          
          <div className="text-right space-y-2">
            <p className="text-lg font-bold text-gray-900">${order.amount}</p>
            <Badge className={`${getStatusColor(order.status)} flex items-center space-x-1`}>
              {getStatusIcon(order.status)}
              <span className="capitalize">{order.status}</span>
            </Badge>
            <p className="text-xs text-gray-500">{order.date}</p>
          </div>
        </div>

        {order.deliveryDate && order.status === 'processing' && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">Expected Delivery</span>
              <span className="text-sm font-semibold text-blue-900">{order.deliveryDate}</span>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-2">
            {order.status === 'completed' && (
              <Button size="sm" variant="outline">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            )}
            {['pending', 'processing'].includes(order.status) && (
              <Button size="sm" variant="outline">
                <MessageSquare className="h-4 w-4 mr-1" />
                Contact
              </Button>
            )}
          </div>
          <Button size="sm" variant="ghost">
            View Details
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  // Fix import for Phone and Radio icons
  const Phone = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
  const Radio = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z" /></svg>

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Package className="mr-3 h-8 w-8" />
                {'My Orders'}
              </h1>
              <p className="mt-2 text-purple-100">
                {'Track and manage all your orders'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-purple-100">Total Orders</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Active</p>
                    <p className="text-2xl font-bold text-white">{stats.active}</p>
                  </div>
                  <Clock className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Completed</p>
                    <p className="text-2xl font-bold text-white">{stats.completed}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-300" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">Total Spent</p>
                    <p className="text-2xl font-bold text-white">${stats.totalSpent}</p>
                  </div>
                  <CreditCard className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">This Month</p>
                    <p className="text-2xl font-bold text-white">12</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-200" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder={'Search orders...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="video">Videos</SelectItem>
              <SelectItem value="call">Calls</SelectItem>
              <SelectItem value="livestream">Livestreams</SelectItem>
              <SelectItem value="gift">Gifts</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              All Orders ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              Active ({stats.active})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({stats.completed})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled/Refunded
            </TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map(order => (
                <OrderCard key={order.id} order={order} />
              ))
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No orders found
                  </h3>
                  <p className="text-gray-500">
                    {searchQuery 
                      ? `No orders matching "${searchQuery}"`
                      : 'You haven\'t placed any orders yet'}
                  </p>
                  <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    Browse Creators
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Order Details Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Order #{selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={selectedOrder.creatorImage} />
                  <AvatarFallback>{selectedOrder.creatorName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedOrder.creatorName}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge variant="outline" className="capitalize">
                      {selectedOrder.type}
                    </Badge>
                    <Badge className={getStatusColor(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Order Date</p>
                  <p className="font-semibold">{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Amount</p>
                  <p className="font-semibold">${selectedOrder.amount}</p>
                </div>
                {selectedOrder.deliveryDate && (
                  <div>
                    <p className="text-sm text-gray-500">Delivery Date</p>
                    <p className="font-semibold">{selectedOrder.deliveryDate}</p>
                  </div>
                )}
                {selectedOrder.duration && (
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-semibold">{selectedOrder.duration}</p>
                  </div>
                )}
              </div>

              {selectedOrder.message && (
                <div>
                  <p className="text-sm text-gray-500 mb-2">Message</p>
                  <p className="p-3 bg-gray-50 rounded-lg">{selectedOrder.message}</p>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                {selectedOrder.status === 'completed' && (
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Download Video
                  </Button>
                )}
                {['pending', 'processing'].includes(selectedOrder.status) && (
                  <Button variant="outline" className="text-red-600 border-red-600">
                    Cancel Order
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}