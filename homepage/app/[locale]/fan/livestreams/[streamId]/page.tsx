'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  Radio, Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  Settings, MessageSquare, Gift, Heart, Share2, Users, Eye,
  AlertCircle, CheckCircle, Crown, Shield, Star, Lock,
  Tv, SkipForward, Clock, DollarSign, Send, MoreVertical,
  Flag, Ban, Trash2, ChevronLeft, Info, Zap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { cn } from '@/lib/utils'
import type {
  LiveStream,
  FanSubscription,
  CreatorSubscriptionTier,
  StreamChatMessage,
  StreamViewerState,
  AdType
} from '@/lib/types/livestream'

// Mock ad data
const mockAds = [
  {
    id: 'ad-1',
    type: 'pre-roll' as AdType,
    duration: 15,
    title: 'Summer Sale - 50% Off',
    advertiser: 'Fashion Store',
    skipAfter: 5
  },
  {
    id: 'ad-2',
    type: 'mid-roll' as AdType,
    duration: 30,
    title: 'New Restaurant Opening',
    advertiser: 'Haitian Cuisine',
    skipAfter: 10
  }
]

export default function LiveStreamViewerPage() {
  const params = useParams()
  const router = useRouter()
  const t = useTranslations()
  const videoRef = useRef<HTMLVideoElement>(null)
  const chatScrollRef = useRef<HTMLDivElement>(null)
  
  // Stream state
  const [stream, setStream] = useState<LiveStream | null>(null)
  const [subscription, setSubscription] = useState<FanSubscription | null>(null)
  const [viewerState, setViewerState] = useState<StreamViewerState>({
    streamId: params.streamId as string,
    isSubscribed: false,
    adState: {
      showingAd: false,
      canSkip: false
    },
    quality: '720p',
    volume: 80,
    isMuted: false,
    isFullscreen: false,
    chatVisible: true
  })
  
  // UI state
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showControls, setShowControls] = useState(true)
  const [chatMessage, setChatMessage] = useState('')
  const [chatMessages, setChatMessages] = useState<StreamChatMessage[]>([])
  const [showDonation, setShowDonation] = useState(false)
  const [donationAmount, setDonationAmount] = useState('')
  const [adCountdown, setAdCountdown] = useState(0)
  const [nextAdIn, setNextAdIn] = useState(300) // 5 minutes
  const [streamHealth, setStreamHealth] = useState({
    connectionQuality: 'excellent' as const,
    buffering: false
  })

  // Load mock data
  useEffect(() => {
    // Mock stream data
    const mockStream: LiveStream = {
      id: params.streamId as string,
      creator_id: 'creator-001',
      title: 'Live Concert: Kompa Classics Night 🎵',
      description: 'An unforgettable evening of classic Kompa music!',
      category: 'music',
      tags: ['Music', 'Kompa', 'Live Performance'],
      thumbnail_url: '/api/placeholder/800/450',
      stream_key: 'stream-key-001',
      status: 'live',
      scheduled_start: '2024-01-20 20:00',
      actual_start: '2024-01-20 20:05',
      is_subscriber_only: false,
      min_subscription_tier: 'basic',
      allow_guests: true,
      max_viewers: 2000,
      chat_enabled: true,
      donations_enabled: true,
      recording_enabled: true,
      created_at: '2024-01-20',
      updated_at: '2024-01-20',
      creator: {
        id: 'creator-001',
        name: 'Marie-Claire Laurent',
        avatar_url: '/api/placeholder/40/40'
      },
      current_viewers: 1250,
      total_viewers: 1800
    }
    setStream(mockStream)

    // Check if user is subscribed (mock)
    const mockSubscription: FanSubscription = {
      id: 'sub-001',
      fan_id: 'user-123',
      creator_id: 'creator-001',
      tier_id: 'tier-001',
      status: 'active',
      start_date: '2024-01-01',
      auto_renew: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
      tier: {
        id: 'tier-001',
        creator_id: 'creator-001',
        tier_name: 'Premium',
        tier_type: 'premium',
        price: 9.99,
        billing_period: 'monthly',
        benefits: ['Ad-free viewing', 'HD streaming', 'Priority chat'],
        ad_free: true,
        exclusive_content: true,
        priority_chat: true,
        vod_access: true,
        max_quality: '1080p',
        is_active: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }
    }
    
    // Simulate checking subscription (50% chance for demo)
    if (Math.random() > 0.5) {
      setSubscription(mockSubscription)
      setViewerState(prev => ({ ...prev, isSubscribed: true }))
    } else {
      // Show pre-roll ad for non-subscribers
      setTimeout(() => {
        if (!subscription) {
          showAd('pre-roll')
        }
      }, 1000)
    }

    // Mock chat messages
    const mockMessages: StreamChatMessage[] = [
      {
        id: 'msg-1',
        stream_id: params.streamId as string,
        user_id: 'user-1',
        message: 'Amazing performance! 🎵',
        is_subscriber: true,
        is_moderator: false,
        is_creator: false,
        deleted: false,
        timestamp: new Date().toISOString(),
        user: {
          id: 'user-1',
          name: 'Jean Pierre',
          avatar_url: '/api/placeholder/32/32'
        }
      },
      {
        id: 'msg-2',
        stream_id: params.streamId as string,
        user_id: 'user-2',
        message: 'Love this song!',
        is_subscriber: false,
        is_moderator: false,
        is_creator: false,
        deleted: false,
        timestamp: new Date().toISOString(),
        user: {
          id: 'user-2',
          name: 'Sophie M',
          avatar_url: '/api/placeholder/32/32'
        }
      }
    ]
    setChatMessages(mockMessages)

    // Simulate periodic mid-roll ads for non-subscribers
    const adInterval = setInterval(() => {
      setNextAdIn(prev => {
        if (prev <= 0 && !subscription) {
          showAd('mid-roll')
          return 300 // Reset to 5 minutes
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(adInterval)
  }, [params.streamId, subscription])

  // Show ad function
  const showAd = (type: AdType) => {
    const ad = mockAds.find(a => a.type === type)
    if (!ad) return

    setViewerState(prev => ({
      ...prev,
      adState: {
        showingAd: true,
        adType: type,
        adDuration: ad.duration,
        nextAdIn: 300,
        canSkip: false
      }
    }))

    setAdCountdown(ad.duration)
    
    // Countdown timer
    const countdown = setInterval(() => {
      setAdCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdown)
          setViewerState(prev => ({
            ...prev,
            adState: { ...prev.adState, showingAd: false }
          }))
          return 0
        }
        
        // Enable skip after skipAfter seconds
        if (prev === ad.duration - (ad.skipAfter || 5) + 1) {
          setViewerState(prev => ({
            ...prev,
            adState: { ...prev.adState, canSkip: true }
          }))
        }
        
        return prev - 1
      })
    }, 1000)
  }

  // Skip ad function
  const skipAd = () => {
    if (viewerState.adState.canSkip) {
      setViewerState(prev => ({
        ...prev,
        adState: { ...prev.adState, showingAd: false }
      }))
      setAdCountdown(0)
    }
  }

  // Send chat message
  const sendChatMessage = () => {
    if (!chatMessage.trim()) return

    const newMessage: StreamChatMessage = {
      id: `msg-${Date.now()}`,
      stream_id: params.streamId as string,
      user_id: 'current-user',
      message: chatMessage,
      is_subscriber: !!subscription,
      is_moderator: false,
      is_creator: false,
      deleted: false,
      timestamp: new Date().toISOString(),
      user: {
        id: 'current-user',
        name: 'You',
        avatar_url: '/api/placeholder/32/32'
      }
    }

    setChatMessages(prev => [...prev, newMessage])
    setChatMessage('')
    
    // Auto-scroll chat
    setTimeout(() => {
      chatScrollRef.current?.scrollTo({
        top: chatScrollRef.current.scrollHeight,
        behavior: 'smooth'
      })
    }, 100)
  }

  // Get tier badge
  const getTierBadge = (tierType?: string) => {
    switch (tierType) {
      case 'vip':
        return { icon: Crown, color: 'text-yellow-500', label: 'VIP' }
      case 'premium':
        return { icon: Shield, color: 'text-purple-500', label: 'Premium' }
      case 'basic':
        return { icon: Star, color: 'text-blue-500', label: 'Basic' }
      default:
        return null
    }
  }

  if (!stream) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4" />
          <p>Loading stream...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Video Player Section */}
        <div className="flex-1 relative bg-black">
          {/* Header Bar */}
          <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="text-white hover:bg-white/20"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-red-600 text-white border-0 animate-pulse">
                    <Radio className="h-3 w-3 mr-1" />
                    LIVE
                  </Badge>
                  <Badge className="bg-white/20 text-white border-0 backdrop-blur">
                    <Eye className="h-3 w-3 mr-1" />
                    {stream.current_viewers?.toLocaleString()} watching
                  </Badge>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {subscription && subscription.tier && (
                  <Badge className={cn(
                    "border-0",
                    getTierBadge(subscription.tier.tier_type)?.color
                  )}>
                    {React.createElement(getTierBadge(subscription.tier.tier_type)?.icon || Star, {
                      className: "h-3 w-3 mr-1"
                    })}
                    {subscription.tier.tier_name}
                  </Badge>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Flag className="h-4 w-4 mr-2" />
                      Report Stream
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Info className="h-4 w-4 mr-2" />
                      Stream Info
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            
            {/* Stream Title */}
            <div className="mt-4">
              <h1 className="text-xl font-bold text-white">{stream.title}</h1>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8 border-2 border-purple-600">
                    <AvatarImage src={stream.creator?.avatar_url} />
                    <AvatarFallback>{stream.creator?.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-white font-medium">{stream.creator?.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Video Player / Ad Overlay */}
          <div className="relative w-full h-full flex items-center justify-center">
            {viewerState.adState.showingAd ? (
              // Ad Overlay
              <div className="absolute inset-0 z-30 bg-black flex items-center justify-center">
                <div className="text-center text-white max-w-2xl px-4">
                  <div className="mb-8">
                    <Badge className="bg-yellow-600 text-white text-lg px-4 py-2 mb-4">
                      <Tv className="h-4 w-4 mr-2" />
                      Advertisement
                    </Badge>
                    <h2 className="text-3xl font-bold mb-2">Summer Sale - 50% Off</h2>
                    <p className="text-gray-300">Fashion Store</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-48 rounded-lg flex items-center justify-center mb-6">
                    <Play className="h-20 w-20 text-white/50" />
                  </div>
                  
                  <div className="flex items-center justify-center space-x-4">
                    <span className="text-2xl font-bold">{adCountdown}s</span>
                    {viewerState.adState.canSkip ? (
                      <Button
                        onClick={skipAd}
                        className="bg-white text-black hover:bg-gray-200"
                      >
                        <SkipForward className="h-4 w-4 mr-2" />
                        Skip Ad
                      </Button>
                    ) : (
                      <span className="text-gray-400">
                        Skip in {adCountdown - (mockAds[0].skipAfter || 5)}s
                      </span>
                    )}
                  </div>
                  
                  <div className="mt-8">
                    <p className="text-sm text-gray-400">
                      Subscribe for ad-free viewing
                    </p>
                    <Button
                      variant="link"
                      className="text-purple-400 hover:text-purple-300"
                      onClick={() => router.push(`/creator/${stream.creator_id}/subscribe`)}
                    >
                      Learn More →
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // Video Player
              <div className="w-full h-full bg-gradient-to-br from-purple-900 to-pink-900 flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="h-24 w-24 mx-auto mb-4 text-white/50" />
                  <p className="text-lg">Stream Playing</p>
                  <p className="text-sm text-gray-300 mt-2">
                    {streamHealth.buffering ? 'Buffering...' : `Quality: ${viewerState.quality}`}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Video Controls */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0"
          )}>
            {/* Ad countdown for non-subscribers */}
            {!subscription && !viewerState.adState.showingAd && (
              <div className="mb-2 text-center">
                <span className="text-xs text-gray-400">
                  Next ad in {Math.floor(nextAdIn / 60)}:{(nextAdIn % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>
              
              <div className="flex items-center space-x-2 flex-1">
                <span className="text-white text-sm">LIVE</span>
                <Progress value={75} className="flex-1 h-1" />
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewerState(prev => ({ ...prev, isMuted: !prev.isMuted }))}
                  className="text-white hover:bg-white/20"
                >
                  {viewerState.isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </Button>
                <Slider
                  value={[viewerState.volume]}
                  onValueChange={([value]) => setViewerState(prev => ({ ...prev, volume: value }))}
                  max={100}
                  className="w-24"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
                    <Settings className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setViewerState(prev => ({ ...prev, quality: '1080p' }))}>
                    1080p {subscription?.tier?.max_quality === '1080p' && '✓'}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewerState(prev => ({ ...prev, quality: '720p' }))}>
                    720p ✓
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setViewerState(prev => ({ ...prev, quality: '480p' }))}>
                    480p
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewerState(prev => ({ ...prev, isFullscreen: !prev.isFullscreen }))}
                className="text-white hover:bg-white/20"
              >
                {viewerState.isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Chat & Info Sidebar */}
        {viewerState.chatVisible && (
          <div className="w-full lg:w-96 bg-gray-900 border-l border-gray-800 flex flex-col">
            <Tabs defaultValue="chat" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2 rounded-none bg-gray-800">
                <TabsTrigger value="chat">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="info">
                  <Info className="h-4 w-4 mr-2" />
                  Info
                </TabsTrigger>
              </TabsList>
              
              {/* Chat Tab */}
              <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
                <ScrollArea className="flex-1 p-4" ref={chatScrollRef}>
                  <div className="space-y-3">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="flex items-start space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={msg.user?.avatar_url} />
                          <AvatarFallback>{msg.user?.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-white">
                              {msg.user?.name}
                            </span>
                            {msg.is_subscriber && (
                              <Badge className="bg-purple-600/20 text-purple-400 text-xs px-1 py-0">
                                Sub
                              </Badge>
                            )}
                            {msg.is_moderator && (
                              <Badge className="bg-green-600/20 text-green-400 text-xs px-1 py-0">
                                Mod
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-300 break-words">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                {/* Chat Input */}
                <div className="p-4 border-t border-gray-800">
                  {subscription?.tier?.priority_chat && (
                    <div className="mb-2 flex items-center justify-center">
                      <Badge className="bg-purple-600/20 text-purple-400 text-xs">
                        <Zap className="h-3 w-3 mr-1" />
                        Priority Chat Active
                      </Badge>
                    </div>
                  )}
                  <div className="flex space-x-2">
                    <Input
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                      placeholder="Type a message..."
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    <Button onClick={sendChatMessage} size="sm">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Info Tab */}
              <TabsContent value="info" className="flex-1 p-4 space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">About This Stream</h3>
                  <p className="text-gray-300 text-sm">{stream.description}</p>
                </div>
                
                <Separator className="bg-gray-800" />
                
                <div>
                  <h3 className="text-white font-semibold mb-2">Stream Stats</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Current Viewers</span>
                      <span className="text-white">{stream.current_viewers?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Total Views</span>
                      <span className="text-white">{stream.total_viewers?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Started</span>
                      <span className="text-white">
                        {stream.actual_start && new Date(stream.actual_start).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                </div>
                
                <Separator className="bg-gray-800" />
                
                {/* Donation Section */}
                {stream.donations_enabled && (
                  <div>
                    <Button
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      onClick={() => setShowDonation(true)}
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Send Donation
                    </Button>
                  </div>
                )}
                
                {/* Subscription Prompt */}
                {!subscription && (
                  <Alert className="bg-purple-900/20 border-purple-700">
                    <Crown className="h-4 w-4" />
                    <AlertTitle>Get More Benefits</AlertTitle>
                    <AlertDescription className="text-gray-300">
                      Subscribe for ad-free viewing, HD quality, and priority chat
                    </AlertDescription>
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => router.push(`/creator/${stream.creator_id}/subscribe`)}
                    >
                      Subscribe Now
                    </Button>
                  </Alert>
                )}
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Donation Dialog */}
      <Dialog open={showDonation} onOpenChange={setShowDonation}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Send a Donation</DialogTitle>
            <DialogDescription>
              Support {stream?.creator?.name} with a donation
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant="outline"
                onClick={() => setDonationAmount('5')}
                className={donationAmount === '5' ? 'border-purple-600' : ''}
              >
                $5
              </Button>
              <Button
                variant="outline"
                onClick={() => setDonationAmount('10')}
                className={donationAmount === '10' ? 'border-purple-600' : ''}
              >
                $10
              </Button>
              <Button
                variant="outline"
                onClick={() => setDonationAmount('25')}
                className={donationAmount === '25' ? 'border-purple-600' : ''}
              >
                $25
              </Button>
            </div>
            <Input
              type="number"
              placeholder="Custom amount"
              value={donationAmount}
              onChange={(e) => setDonationAmount(e.target.value)}
              className="text-center"
            />
            <Input
              placeholder="Add a message (optional)"
              className="text-center"
            />
            <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              <DollarSign className="h-4 w-4 mr-2" />
              Send ${donationAmount || '0'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}