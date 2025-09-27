'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { 
  Package, Clock, CheckCircle, XCircle, Download, MessageSquare,
  Calendar, CreditCard, Video, Gift, Star, Filter, Search,
  AlertCircle, Truck, RefreshCw, Play, Eye
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { VideoPlayerModal } from '@/components/video/video-player'
import { useSupabaseAuth } from '@/contexts/supabase-auth-compat'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow, format } from 'date-fns'
import { cn } from '@/lib/utils'

interface Order {
  id: string
  creator_id: string
  user_id: string
  video_request_id?: string
  payment_intent_id?: string
  amount: number  // Changed from total_amount to match database
  currency?: string
  platform_fee: number
  creator_earnings: number
  status: 'pending' | 'accepted' | 'recording' | 'in_progress' | 'completed' | 'rejected' | 'cancelled' | 'refunded'
  created_at: string
  updated_at: string
  completed_at?: string
  accepted_at?: string
  occasion?: string
  recipient_name?: string
  instructions?: string
  metadata?: any
  video_url?: string
  video_metadata?: any
  video_uploaded_at?: string
  video_duration?: number
  video_size?: number
  creator?: {
    id: string
    display_name?: string
    avatar_url?: string
    bio?: string
  }
}

export default function CustomerOrdersPage() {
  const router = useRouter()
  const params = useParams()
  const t = useTranslations('fan')
  const { user, isLoading: authLoading } = useSupabaseAuth()
  const [selectedTab, setSelectedTab] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [videoPlayer, setVideoPlayer] = useState<{
    isOpen: boolean
    videoUrl: string
    title?: string
    creatorName?: string
    creatorAvatar?: string
  }>({ isOpen: false, videoUrl: '' })
  const [isLoadingVideo, setIsLoadingVideo] = useState(false)
  const supabase = createClient()

  // Handle order card click navigation
  const handleOrderClick = (order: Order) => {
    // Use payment_intent_id if available, otherwise use video_request_id
    const orderId = order.payment_intent_id || order.video_request_id || order.id
    const locale = params.locale || 'en'

    // Navigate to detailed order tracking page
    router.push(`/${locale}/fan/orders/${orderId}`)
  }

  // Fetch orders from database - now using video_requests table for accurate status
  const fetchOrders = async () => {
    if (!user?.id) return

    try {
      setError(null)
      setLoading(true)
      
      // Get all video requests for this fan user
      const { data: requestsData, error: fetchError } = await supabase
        .from('video_requests')
        .select('*')
        .eq('fan_id', user.id)
        .order('created_at', { ascending: false })

      if (fetchError) {
        console.error('Error fetching requests:', fetchError)
        setError('Failed to load orders')
        return
      }

      if (!requestsData || requestsData.length === 0) {
        setOrders([])
        return
      }

      // Get unique creator IDs
      const creatorIds = [...new Set(requestsData.map(request => request.creator_id))]
      
      // Fetch creator profiles separately
      const { data: creatorsData, error: creatorsError } = await supabase
        .from('profiles')
        .select('id, display_name, avatar_url, bio')
        .in('id', creatorIds)

      if (creatorsError) {
        console.error('Error fetching creators:', creatorsError)
        // Still show orders even if creator info fails
        setOrders(requestsData.map(request => ({ 
          id: request.id,
          creator_id: request.creator_id,
          user_id: request.fan_id,
          video_request_id: request.id,
          amount: request.price || 0,
          currency: 'USD',
          platform_fee: request.platform_fee || 0,
          creator_earnings: request.creator_earnings || 0,
          status: request.status,
          created_at: request.created_at,
          updated_at: request.updated_at,
          completed_at: request.completed_at,
          occasion: request.occasion,
          recipient_name: request.recipient_name,
          instructions: request.instructions,
          video_url: request.video_url,
          creator: null 
        })))
        return
      }

      // Convert video requests to order format with creator information
      const ordersWithCreators = requestsData.map(request => ({
        id: request.id,
        creator_id: request.creator_id,
        user_id: request.fan_id,
        video_request_id: request.id,
        amount: request.price || 0,
        currency: 'USD',
        platform_fee: request.platform_fee || 0,
        creator_earnings: request.creator_earnings || 0,
        status: request.status, // This will now show the correct status (pending, accepted, rejected, completed)
        created_at: request.created_at,
        updated_at: request.updated_at,
        completed_at: request.completed_at,
        occasion: request.occasion,
        recipient_name: request.recipient_name, // Add recipient name for video titles
        instructions: request.instructions,
        video_url: request.video_url,
        creator: creatorsData.find(creator => creator.id === request.creator_id)
      }))

      setOrders(ordersWithCreators)
    } catch (err) {
      console.error('Error in fetchOrders:', err)
      setError('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [user?.id])

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user?.id) return

    const channel = supabase.channel(`fan-video-requests-${user.id}`)

    // Subscribe to database changes in video_requests table
    channel
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'video_requests',
        filter: `fan_id=eq.${user.id}`,
      }, () => {
        fetchOrders()
      })
      .on('broadcast', { event: 'video_request_update' }, () => {
        fetchOrders()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchOrders()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'accepted':
      case 'recording':
      case 'in_progress':
        return <RefreshCw className="h-4 w-4 animate-spin" />
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'rejected':
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
      case 'accepted':
        return 'bg-blue-100 text-blue-800'
      case 'recording':
        return 'bg-purple-100 text-purple-800'
      case 'in_progress':
        return 'bg-purple-100 text-purple-800'
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'refunded':
        return 'bg-gray-100 text-gray-800'
      default:
        return ''
    }
  }

  // Always return video icon for now since all orders are video requests
  const getTypeIcon = () => {
    return <Video className="h-4 w-4" />
  }

  const filteredOrders = orders.filter(order => {
    const searchLower = searchQuery.toLowerCase()
    const matchesSearch = !searchQuery || 
                         order.creator?.display_name?.toLowerCase().includes(searchLower) ||
                         order.occasion?.toLowerCase().includes(searchLower) ||
                         order.id.toLowerCase().includes(searchLower)
    const matchesTab = selectedTab === 'all' || 
                       (selectedTab === 'active' && ['pending', 'accepted', 'recording', 'in_progress'].includes(order.status)) ||
                       (selectedTab === 'completed' && order.status === 'completed') ||
                       (selectedTab === 'cancelled' && ['rejected', 'cancelled', 'refunded'].includes(order.status))
    
    return matchesSearch && matchesTab
  })

  const stats = {
    total: orders.length,
    active: orders.filter(o => ['pending', 'accepted', 'recording', 'in_progress'].includes(o.status)).length,
    completed: orders.filter(o => o.status === 'completed').length,
    totalSpent: orders.reduce((sum, o) => sum + (o.amount || 0), 0)
  }

  const OrderCard = ({ order }: { order: Order }) => (
    <Card
      className="hover:shadow-lg transition-all cursor-pointer border-gray-200"
      onClick={() => handleOrderClick(order)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={order.creator?.avatar_url} alt={order.creator?.display_name} />
              <AvatarFallback>{order.creator?.display_name?.[0] || 'C'}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <h3 className="font-semibold text-gray-900">{order.creator?.display_name || 'Creator'}</h3>
                <Badge variant="outline" className="flex items-center space-x-1">
                  {getTypeIcon()}
                  <span className="capitalize">{t('orders.video')}</span>
                </Badge>
              </div>
              <p className="text-sm text-gray-500">{t('orders.orderNumber')}{order.id.slice(0, 8)}</p>
              {order.occasion && (
                <p className="text-sm text-purple-600">{order.occasion}</p>
              )}
            </div>
          </div>
          
          <div className="text-right space-y-2">
            <p className="text-lg font-bold text-gray-900">${order.amount.toFixed(2)}</p>
            <Badge className={cn(getStatusColor(order.status), "flex items-center space-x-1")}>
              {getStatusIcon(order.status)}
              <span className="capitalize">{order.status.replace('_', ' ')}</span>
            </Badge>
            <p className="text-xs text-gray-500">{format(new Date(order.created_at), 'MMM d, yyyy')}</p>
          </div>
        </div>


        {order.instructions && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 italic">"{order.instructions}"</p>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-2">
            {order.status === 'completed' && order.video_url && (
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                disabled={isLoadingVideo}
                onClick={(e) => {
                  e.stopPropagation()
                  // Since video is stored in public Supabase Storage, use URL directly
                  if (order.video_url) {
                    setVideoPlayer({
                      isOpen: true,
                      videoUrl: order.video_url,
                      title: `${order.occasion} video for ${order.recipient_name || 'you'}`,
                      creatorName: order.creator?.display_name || 'Creator',
                      creatorAvatar: order.creator?.avatar_url
                    })
                  } else {
                    alert(t('orders.videoNotAvailable'))
                  }
                }}
              >
                <Play className="h-4 w-4 mr-1" />
                {isLoadingVideo ? t('orders.loading') : t('orders.watch')}
              </Button>
            )}
            {order.status === 'completed' && (
              <Button size="sm" variant="outline">
                <Star className="h-4 w-4 mr-1" />
                {t('orders.rate')}
              </Button>
            )}
            {['pending', 'accepted', 'recording', 'in_progress'].includes(order.status) && (
              <Button size="sm" variant="outline">
                <MessageSquare className="h-4 w-4 mr-1" />
                {t('orders.contact')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  // Loading skeleton
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <Skeleton className="h-8 w-48 mb-2 bg-white/20" />
            <Skeleton className="h-4 w-64 bg-white/20" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button 
              onClick={handleRefresh} 
              variant="link" 
              className="ml-2 p-0 h-auto"
            >
              {t('orders.tryAgain')}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Package className="mr-3 h-8 w-8" />
                {t('orders.title')}
              </h1>
              <p className="mt-2 text-purple-100">
                {t('orders.subtitle')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-purple-100">{t('orders.totalOrders')}</p>
              <p className="text-3xl font-bold">{stats.total}</p>
            </div>
            <Button 
              onClick={handleRefresh}
              variant="ghost"
              size="sm"
              disabled={isRefreshing}
              className="text-white hover:bg-white/10"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm">{t('orders.active')}</p>
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
                    <p className="text-purple-100 text-sm">{t('orders.completed')}</p>
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
                    <p className="text-purple-100 text-sm">{t('orders.totalSpent')}</p>
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
                    <p className="text-purple-100 text-sm">{t('orders.thisMonth')}</p>
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
              placeholder={t('orders.searchPlaceholder')}
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
              <SelectItem value="all">{t('orders.allTypes')}</SelectItem>
              <SelectItem value="video">{t('orders.videos')}</SelectItem>
              <SelectItem value="call">{t('orders.calls')}</SelectItem>
              <SelectItem value="livestream">{t('orders.livestreams')}</SelectItem>
              <SelectItem value="gift">{t('orders.gifts')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">
              {t('orders.allOrders')} ({orders.length})
            </TabsTrigger>
            <TabsTrigger value="active">
              {t('orders.active')} ({stats.active})
            </TabsTrigger>
            <TabsTrigger value="completed">
              {t('orders.completed')} ({stats.completed})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              {t('orders.cancelledRefunded')}
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
                    {t('orders.noOrdersFound')}
                  </h3>
                  <p className="text-gray-500">
                    {searchQuery 
                      ? `${t('orders.noOrdersSearchMessage')} "${searchQuery}"`
                      : t('orders.noOrdersMessage')}
                  </p>
                  <Button className="mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    {t('orders.browseCreators')}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={videoPlayer.isOpen}
        onClose={() => setVideoPlayer({ isOpen: false, videoUrl: '' })}
        videoUrl={videoPlayer.videoUrl}
        title={videoPlayer.title}
        creatorName={videoPlayer.creatorName}
        creatorAvatar={videoPlayer.creatorAvatar}
      />
    </div>
  )
}