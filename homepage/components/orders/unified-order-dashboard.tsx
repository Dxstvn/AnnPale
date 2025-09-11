'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Video,
  Users,
  DollarSign,
  Clock,
  MoreVertical,
  Search,
  Filter,
  Download,
  Eye,
  Play,
  Calendar,
  TrendingUp,
  Package,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2
} from 'lucide-react'
import { formatCurrency, cn } from '@/lib/utils'
import { formatDistanceToNow, format } from 'date-fns'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

interface UnifiedOrder {
  id: string
  type: 'video' | 'subscription'
  status: string
  amount: number
  created_at: string
  customer_name?: string
  creator_name?: string
  details: any
}

interface OrderStats {
  total: number
  video_orders: number
  subscriptions: number
  pending: number
  active: number
  total_revenue: number
}

interface UnifiedOrderDashboardProps {
  role: 'creator' | 'fan'
}

export function UnifiedOrderDashboard({ role }: UnifiedOrderDashboardProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<UnifiedOrder[]>([])
  const [filteredOrders, setFilteredOrders] = useState<UnifiedOrder[]>([])
  const [stats, setStats] = useState<OrderStats>({
    total: 0,
    video_orders: 0,
    subscriptions: 0,
    pending: 0,
    active: 0,
    total_revenue: 0
  })
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState<'all' | 'video' | 'subscription'>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadOrders()
  }, [role])

  useEffect(() => {
    filterOrders()
  }, [orders, filterType, filterStatus, searchQuery])

  const loadOrders = async () => {
    try {
      const params = new URLSearchParams({
        role
      })

      const response = await fetch(`/api/orders/unified?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      setOrders(data.orders || [])
      setStats(data.stats || {
        total: 0,
        video_orders: 0,
        subscriptions: 0,
        pending: 0,
        active: 0,
        total_revenue: 0
      })
    } catch (error) {
      console.error('Error loading orders:', error)
      toast({
        title: 'Error',
        description: 'Failed to load orders',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = [...orders]

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(order => order.type === filterType)
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus)
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(order => {
        const name = role === 'creator' 
          ? order.customer_name?.toLowerCase() 
          : order.creator_name?.toLowerCase()
        return name?.includes(query) || 
               order.id.toLowerCase().includes(query) ||
               order.type.toLowerCase().includes(query)
      })
    }

    setFilteredOrders(filtered)
  }

  const getStatusBadge = (status: string, type: 'video' | 'subscription') => {
    const variants: Record<string, { className: string; label: string }> = {
      pending: { className: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
      active: { className: 'bg-green-100 text-green-700', label: 'Active' },
      completed: { className: 'bg-blue-100 text-blue-700', label: 'Completed' },
      cancelled: { className: 'bg-red-100 text-red-700', label: 'Cancelled' },
      expired: { className: 'bg-gray-100 text-gray-700', label: 'Expired' },
      paused: { className: 'bg-orange-100 text-orange-700', label: 'Paused' },
      trialing: { className: 'bg-purple-100 text-purple-700', label: 'Trial' }
    }

    const variant = variants[status] || variants.pending
    return <Badge className={variant.className}>{variant.label}</Badge>
  }

  const getTypeIcon = (type: 'video' | 'subscription') => {
    return type === 'video' 
      ? <Video className="h-4 w-4" />
      : <Users className="h-4 w-4" />
  }

  const handleOrderAction = (order: UnifiedOrder, action: string) => {
    if (order.type === 'video' && action === 'view') {
      router.push(`/creator/requests/${order.id}`)
    } else if (order.type === 'subscription' && action === 'manage') {
      router.push('/fan/settings?tab=subscriptions')
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              {stats.video_orders} videos, {stats.subscriptions} subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
            <p className="text-xs text-muted-foreground">
              Currently active orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting action
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.total_revenue)}</div>
            <p className="text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3 inline mr-1" />
              All time earnings
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>
                View and manage all your {role === 'creator' ? 'customer' : ''} orders
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder={`Search by ${role === 'creator' ? 'customer' : 'creator'} name...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="subscription">Subscriptions</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-lg",
                      order.type === 'video' 
                        ? "bg-purple-100 text-purple-600"
                        : "bg-blue-100 text-blue-600"
                    )}>
                      {getTypeIcon(order.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {role === 'creator' 
                            ? order.customer_name 
                            : order.creator_name}
                        </p>
                        {getStatusBadge(order.status, order.type)}
                        <Badge variant="outline">
                          {order.type === 'video' ? 'Video' : 'Subscription'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                        {' • '}
                        {formatCurrency(order.amount)}
                      </p>
                      {order.type === 'video' && order.details.occasion && (
                        <p className="text-xs text-gray-400 mt-1">
                          {order.details.occasion}
                        </p>
                      )}
                      {order.type === 'subscription' && order.details.tier && (
                        <p className="text-xs text-gray-400 mt-1">
                          {order.details.tier.tier_name} - {order.details.billing_period}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {order.type === 'video' && order.status === 'pending' && role === 'creator' && (
                      <Button
                        size="sm"
                        onClick={() => handleOrderAction(order, 'view')}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Fulfill
                      </Button>
                    )}
                    {order.type === 'video' && order.status === 'completed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOrderAction(order, 'view')}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    )}
                    {order.type === 'subscription' && ['active', 'paused'].includes(order.status) && role === 'fan' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleOrderAction(order, 'manage')}
                      >
                        Manage
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </DropdownMenuItem>
                        {order.type === 'video' && order.details.video_url && (
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download Video
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <AlertCircle className="h-4 w-4 mr-2" />
                          Report Issue
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}