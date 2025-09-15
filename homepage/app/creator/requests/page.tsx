'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useCreatorNotifications } from '@/hooks/use-creator-notifications'
import { NotificationBadge, NotificationPanel } from '@/components/creator/video-request-notification'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Clock, 
  DollarSign, 
  Calendar, 
  User,
  CheckCircle,
  XCircle,
  AlertCircle,
  Video,
  TrendingUp,
  Loader2
} from 'lucide-react'
import { format, formatDistanceToNow, isPast } from 'date-fns'
import { useToast } from '@/hooks/use-toast'

interface VideoRequest {
  id: string
  fan_id: string
  creator_id: string
  request_type: string
  occasion: string
  recipient_name: string
  instructions: string
  status: 'pending' | 'accepted' | 'rejected' | 'recording' | 'processing' | 'completed' | 'cancelled' | 'expired'
  price: number
  platform_fee: number
  creator_earnings: number
  video_url?: string
  thumbnail_url?: string
  duration?: number
  rating?: number
  review?: string
  responded_at?: string
  completed_at?: string
  created_at: string
  updated_at: string
}

export default function CreatorRequestsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [requests, setRequests] = useState<VideoRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')
  const [processingRequest, setProcessingRequest] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showNotifications, setShowNotifications] = useState(false)
  const supabase = createClient()

  // Read tab from URL parameters on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const tabParam = urlParams.get('tab')
    if (tabParam && ['all', 'pending', 'in-progress', 'completed'].includes(tabParam)) {
      setActiveTab(tabParam)
    }
  }, [])
  
  // Set up real-time notifications
  const { newRequests, unreadCount, markAsRead, isConnected } = useCreatorNotifications({
    creatorId: currentUser?.id || '',
    onNewRequest: (newRequest) => {
      // Refresh the requests list when new request arrives
      fetchRequests()
      toast({
        title: "New Video Request! 🎬",
        description: `${newRequest.fan?.display_name || newRequest.fan?.name || 'Someone'} requested a ${newRequest.occasion} video`,
      })
    },
    playSound: true,
    showToast: false, // We're handling toast ourselves
  })

  useEffect(() => {
    checkUser()
  }, [])
  
  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setCurrentUser(user)
      fetchRequests()
    } else {
      router.push('/login')
    }
  }

  const fetchRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('video_requests')
        .select('*')
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setRequests(data || [])
    } catch (error) {
      console.error('Error fetching requests:', error)
      toast({
        title: 'Error',
        description: 'Failed to load video requests',
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async (requestId: string) => {
    setProcessingRequest(requestId)
    try {
      const { error } = await supabase
        .from('video_requests')
        .update({ 
          status: 'accepted',
          responded_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)

      if (error) throw error

      // Refresh the requests list
      fetchRequests()
      
      toast({
        title: 'Request Accepted',
        description: 'You can now start recording the video',
      })

      // Navigate to recording page
      router.push(`/creator/record/${requestId}`)
    } catch (error) {
      console.error('Error accepting request:', error)
      toast({
        title: 'Error',
        description: 'Failed to accept request',
        variant: 'destructive'
      })
    } finally {
      setProcessingRequest(null)
    }
  }

  const handleDeclineRequest = async (requestId: string) => {
    setProcessingRequest(requestId)
    try {
      const { error } = await supabase
        .from('video_requests')
        .update({ 
          status: 'rejected',
          responded_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)

      if (error) throw error

      // Refresh the requests list
      fetchRequests()
      
      toast({
        title: 'Request Declined',
        description: 'The video request has been declined',
      })
    } catch (error) {
      console.error('Error declining request:', error)
      toast({
        title: 'Error',
        description: 'Failed to decline request',
        variant: 'destructive'
      })
    } finally {
      setProcessingRequest(null)
    }
  }

  const filterRequests = (status: string) => {
    if (status === 'all') return requests
    if (status === 'pending') return requests.filter(r => r.status === 'pending')
    if (status === 'in-progress') return requests.filter(r => ['accepted', 'recording'].includes(r.status))
    if (status === 'completed') return requests.filter(r => r.status === 'completed')
    return requests
  }

  const filteredRequests = filterRequests(activeTab)

  // Calculate stats
  const pendingCount = requests.filter(r => r.status === 'pending').length
  const inProgressCount = requests.filter(r => ['accepted', 'recording'].includes(r.status)).length
  const completedCount = requests.filter(r => r.status === 'completed').length
  const weeklyEarnings = requests
    .filter(r => r.status === 'completed')
    .reduce((sum, r) => sum + (r.creator_earnings || 0), 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending Review</Badge>
      case 'accepted':
        return <Badge className="bg-blue-100 text-blue-800">Accepted</Badge>
      case 'recording':
        return <Badge className="bg-purple-100 text-purple-800">Recording</Badge>
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="container max-w-7xl py-8">
        <h1 className="text-3xl font-bold mb-8">Video Requests</h1>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-7xl py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Video Requests</h1>
          <p className="text-muted-foreground">Manage and respond to video requests from your fans</p>
        </div>
        <div className="flex items-center gap-4">
          {isConnected && (
            <Badge variant="outline" className="text-green-600 border-green-600">
              <div className="w-2 h-2 bg-green-600 rounded-full mr-2 animate-pulse" />
              Live Updates
            </Badge>
          )}
          <div className="relative">
            <NotificationBadge 
              count={unreadCount} 
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {showNotifications && (
              <div className="absolute top-12 right-0 w-96 bg-white rounded-lg shadow-xl border z-50">
                <NotificationPanel
                  requests={newRequests}
                  onView={(id) => {
                    markAsRead([id])
                    setShowNotifications(false)
                  }}
                  onAccept={async (id) => {
                    await handleAcceptRequest(id)
                    markAsRead([id])
                  }}
                  onReject={async (id) => {
                    await handleRejectRequest(id)
                    markAsRead([id])
                  }}
                  onDismiss={(id) => markAsRead([id])}
                  onClearAll={() => markAsRead()}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inProgressCount}</div>
            <p className="text-xs text-muted-foreground">Recording or processing</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedCount}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(weeklyEarnings)}</div>
            <p className="text-xs text-muted-foreground">From completed videos</p>
          </CardContent>
        </Card>
      </div>

      {/* Requests Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {activeTab === 'pending' ? 'No pending requests' : 
                   activeTab === 'in-progress' ? 'No requests in progress' :
                   activeTab === 'completed' ? 'No completed requests' :
                   'No requests yet'}
                </h3>
                <p className="text-muted-foreground text-center">
                  {activeTab === 'pending' ? 'New requests will appear here when fans book you.' :
                   activeTab === 'in-progress' ? 'Accepted requests will show here.' :
                   activeTab === 'completed' ? 'Completed videos will be listed here.' :
                   'Video requests from your fans will appear here.'}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => {
              const isOverdue = false // No deadline field in current schema
              
              return (
                <Card key={request.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-xl">
                          {request.occasion}
                        </CardTitle>
                        <CardDescription>
                          For {request.recipient_name} • Request Type: {request.request_type}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {getStatusBadge(request.status)}
                        {isOverdue && request.status !== 'completed' && (
                          <Badge variant="destructive">Overdue</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Instructions */}
                    <div className="bg-muted rounded-lg p-4">
                      <p className="text-sm">{request.instructions}</p>
                    </div>

                    {/* Request Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {formatCurrency(request.creator_earnings || 0)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {format(new Date(request.created_at), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {formatDistanceToNow(new Date(request.created_at))} ago
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>ID: {request.id.slice(0, 8)}...</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      {request.status === 'pending' && (
                        <>
                          <Button
                            onClick={() => handleAcceptRequest(request.id)}
                            disabled={processingRequest === request.id}
                            className="flex-1"
                          >
                            {processingRequest === request.id ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <CheckCircle className="h-4 w-4 mr-2" />
                            )}
                            Accept & Record
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handleDeclineRequest(request.id)}
                            disabled={processingRequest === request.id}
                            className="flex-1"
                          >
                            {processingRequest === request.id ? (
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            ) : (
                              <XCircle className="h-4 w-4 mr-2" />
                            )}
                            Decline
                          </Button>
                        </>
                      )}
                      {(request.status === 'accepted' || request.status === 'recording') && (
                        <Button
                          onClick={() => router.push(`/creator/record/${request.id}`)}
                          className="w-full"
                        >
                          <Video className="h-4 w-4 mr-2" />
                          Continue Recording
                        </Button>
                      )}
                      {request.status === 'completed' && (
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/creator/videos/${request.id}`)}
                          className="w-full"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          View Completed Video
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}