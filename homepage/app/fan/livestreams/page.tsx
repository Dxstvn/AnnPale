'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '@/contexts/language-context'
import { useRouter } from 'next/navigation'
import {
  Radio, Calendar, Clock, Users, Heart, Bell, Play, 
  TrendingUp, Star, Filter, Search, ChevronRight, Ticket,
  Music, Smile, Mic, Camera, Globe, Gift, MessageSquare,
  AlertCircle, CheckCircle, Share2, Bookmark, ChevronLeft,
  Eye, Sparkles, Zap, Trophy, Flame, ArrowRight, X,
  Lock, Crown, Shield, DollarSign, Tv, LockOpen
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from '@/components/ui/separator'
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
  SubscriptionTierType,
  StreamStatus 
} from '@/lib/types/livestream'

export default function CustomerLivestreamsPage() {
  const { language } = useLanguage()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [userSubscriptions, setUserSubscriptions] = useState<FanSubscription[]>([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Mock user subscriptions (in production, fetch from database)
  useEffect(() => {
    // Simulate fetching user subscriptions
    setTimeout(() => {
      setUserSubscriptions([
        {
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
        },
        {
          id: 'sub-002',
          fan_id: 'user-123',
          creator_id: 'creator-003',
          tier_id: 'tier-002',
          status: 'active',
          start_date: '2024-01-05',
          auto_renew: true,
          created_at: '2024-01-05',
          updated_at: '2024-01-05',
          tier: {
            id: 'tier-002',
            creator_id: 'creator-003',
            tier_name: 'Basic',
            tier_type: 'basic',
            price: 4.99,
            billing_period: 'monthly',
            benefits: ['Support creator', 'Member badge'],
            ad_free: false,
            exclusive_content: false,
            priority_chat: false,
            vod_access: true,
            max_quality: '720p',
            is_active: true,
            created_at: '2024-01-01',
            updated_at: '2024-01-01'
          }
        }
      ])
      setLoading(false)
    }, 1000)
  }, [])

  // Check if user is subscribed to a creator
  const getSubscriptionForCreator = (creatorId: string): FanSubscription | undefined => {
    return userSubscriptions.find(sub => 
      sub.creator_id === creatorId && sub.status === 'active'
    )
  }

  // Enhanced mock livestream data with subscription requirements
  const liveStreams: LiveStream[] = [
    {
      id: 'LS-001',
      creator_id: 'creator-001',
      title: 'Live Concert: Kompa Classics Night 🎵',
      description: 'Join me for an unforgettable evening of classic Kompa music! We\'ll be performing all your favorite hits and taking requests from the audience.',
      category: 'music',
      tags: ['Music', 'Kompa', 'Live Performance'],
      thumbnail_url: '/api/placeholder/800/450',
      stream_key: 'stream-key-001',
      status: 'live' as StreamStatus,
      scheduled_start: '2024-01-20 20:00',
      actual_start: '2024-01-20 20:05',
      is_subscriber_only: false,
      min_subscription_tier: 'basic' as SubscriptionTierType,
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
    },
    {
      id: 'LS-002',
      creator_id: 'creator-002',
      title: 'Comedy Night: Laugh Until You Cry 😂',
      description: 'Get ready for a night of non-stop laughter! Brand new material, audience interaction, and surprise guests.',
      category: 'comedy',
      tags: ['Comedy', 'Stand-up', 'Entertainment'],
      thumbnail_url: '/api/placeholder/800/450',
      stream_key: 'stream-key-002',
      status: 'live' as StreamStatus,
      scheduled_start: '2024-01-21 19:00',
      actual_start: '2024-01-21 19:00',
      is_subscriber_only: true,
      min_subscription_tier: 'premium' as SubscriptionTierType,
      allow_guests: false,
      max_viewers: 1000,
      chat_enabled: true,
      donations_enabled: true,
      recording_enabled: false,
      created_at: '2024-01-21',
      updated_at: '2024-01-21',
      creator: {
        id: 'creator-002',
        name: 'Jean-Baptiste Pierre',
        avatar_url: '/api/placeholder/40/40'
      },
      current_viewers: 856,
      total_viewers: 900
    },
    {
      id: 'LS-003',
      creator_id: 'creator-003',
      title: 'Master Class: Traditional Haitian Cuisine 🍲',
      description: 'Learn to cook authentic Haitian dishes from scratch. Today: Griot, Pikliz, and Bannann Peze!',
      category: 'cooking',
      tags: ['Cooking', 'Tutorial', 'Haitian Culture'],
      thumbnail_url: '/api/placeholder/800/450',
      stream_key: 'stream-key-003',
      status: 'live' as StreamStatus,
      scheduled_start: '2024-01-22 18:00',
      actual_start: '2024-01-22 18:00',
      is_subscriber_only: false,
      allow_guests: true,
      max_viewers: 500,
      chat_enabled: true,
      donations_enabled: true,
      recording_enabled: true,
      created_at: '2024-01-22',
      updated_at: '2024-01-22',
      creator: {
        id: 'creator-003',
        name: 'Sophie Duval',
        avatar_url: '/api/placeholder/40/40'
      },
      current_viewers: 423,
      total_viewers: 450
    },
    {
      id: 'LS-004',
      creator_id: 'creator-004',
      title: 'Exclusive Q&A: Behind the Scenes',
      description: 'Get exclusive behind-the-scenes insights and ask your burning questions!',
      category: 'talk',
      tags: ['Q&A', 'Interactive', 'Fan Meeting'],
      thumbnail_url: '/api/placeholder/800/450',
      stream_key: 'stream-key-004',
      status: 'scheduled' as StreamStatus,
      scheduled_start: '2024-01-23 17:00',
      is_subscriber_only: true,
      min_subscription_tier: 'vip' as SubscriptionTierType,
      allow_guests: false,
      max_viewers: 100,
      chat_enabled: true,
      donations_enabled: false,
      recording_enabled: false,
      created_at: '2024-01-23',
      updated_at: '2024-01-23',
      creator: {
        id: 'creator-004',
        name: 'Marcus Thompson',
        avatar_url: '/api/placeholder/40/40'
      }
    },
    {
      id: 'LS-005',
      creator_id: 'creator-005',
      title: 'Dance Workshop: Master Konpa Moves 💃',
      description: 'Learn the authentic moves of Konpa dance from a professional instructor.',
      category: 'dance',
      tags: ['Dance', 'Workshop', 'Konpa'],
      thumbnail_url: '/api/placeholder/800/450',
      stream_key: 'stream-key-005',
      status: 'scheduled' as StreamStatus,
      scheduled_start: '2024-01-24 16:00',
      is_subscriber_only: false,
      min_subscription_tier: 'basic' as SubscriptionTierType,
      allow_guests: true,
      max_viewers: 200,
      chat_enabled: true,
      donations_enabled: true,
      recording_enabled: true,
      created_at: '2024-01-24',
      updated_at: '2024-01-24',
      creator: {
        id: 'creator-005',
        name: 'Lisa Chen',
        avatar_url: '/api/placeholder/40/40'
      }
    }
  ]

  // Custom icons
  const ChefHat = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V22h8v-7.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zM9 22v-1h6v1H9z" />
    </svg>
  )

  const DanceIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2a3 3 0 00-3 3v4a3 3 0 006 0V5a3 3 0 00-3-3zM12 18a3 3 0 003-3v-2a3 3 0 00-6 0v2a3 3 0 003 3z" />
    </svg>
  )

  const FitnessIcon = () => (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-3-3-3 3v-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2" />
    </svg>
  )

  const categories = [
    { value: 'all', label: 'All Streams', icon: Sparkles, color: 'from-purple-600 to-pink-600' },
    { value: 'music', label: 'Music', icon: Music, color: 'from-blue-600 to-purple-600' },
    { value: 'comedy', label: 'Comedy', icon: Smile, color: 'from-yellow-500 to-orange-500' },
    { value: 'talk', label: 'Talk Shows', icon: Mic, color: 'from-green-600 to-teal-600' },
    { value: 'cooking', label: 'Cooking', icon: ChefHat, color: 'from-red-500 to-pink-500' },
    { value: 'dance', label: 'Dance', icon: DanceIcon, color: 'from-purple-500 to-indigo-500' },
    { value: 'fitness', label: 'Fitness', icon: FitnessIcon, color: 'from-orange-500 to-red-500' }
  ]

  // Get tier badge color and icon
  const getTierBadge = (tier?: SubscriptionTierType) => {
    switch (tier) {
      case 'vip':
        return { 
          color: 'bg-gradient-to-r from-yellow-500 to-amber-600', 
          icon: Crown,
          label: 'VIP'
        }
      case 'premium':
        return { 
          color: 'bg-gradient-to-r from-purple-600 to-indigo-600', 
          icon: Shield,
          label: 'Premium'
        }
      case 'basic':
        return { 
          color: 'bg-gradient-to-r from-blue-500 to-cyan-600', 
          icon: Star,
          label: 'Basic'
        }
      default:
        return null
    }
  }

  const filteredStreams = liveStreams.filter(stream => {
    const matchesSearch = stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stream.creator?.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || stream.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const liveNow = filteredStreams.filter(s => s.status === 'live')
  const upcomingStreams = filteredStreams.filter(s => s.status === 'scheduled')
  const musicStreams = liveStreams.filter(s => s.category === 'music')
  const comedyStreams = liveStreams.filter(s => s.category === 'comedy')
  const talkStreams = liveStreams.filter(s => s.category === 'talk')

  // Enhanced Stream Card Component with Subscription Status
  const StreamCard = ({ stream, size = 'normal' }: { stream: LiveStream, size?: 'normal' | 'large' | 'small' }) => {
    const isHovered = hoveredCard === stream.id
    const subscription = getSubscriptionForCreator(stream.creator_id)
    const hasAccess = !stream.is_subscriber_only || subscription
    const meetsSubscriptionTier = subscription && stream.min_subscription_tier ? 
      ['vip'].includes(subscription.tier?.tier_type || '') ||
      (stream.min_subscription_tier === 'premium' && ['premium', 'vip'].includes(subscription.tier?.tier_type || '')) ||
      (stream.min_subscription_tier === 'basic')
      : !stream.min_subscription_tier
    
    return (
      <div
        className={cn(
          "relative group cursor-pointer transition-all duration-300",
          size === 'large' ? 'col-span-2 row-span-2' : '',
          size === 'small' ? 'w-64' : ''
        )}
        onMouseEnter={() => setHoveredCard(stream.id)}
        onMouseLeave={() => setHoveredCard(null)}
        onClick={() => setSelectedStream(stream)}
      >
        <div className={cn(
          "relative overflow-hidden rounded-lg transition-all duration-300 border border-gray-200",
          isHovered ? 'transform scale-105 shadow-2xl border-purple-300' : 'shadow-lg'
        )}>
          {/* Thumbnail with gradient overlay */}
          <div className={cn(
            "relative bg-gradient-to-br from-purple-600 to-pink-600",
            size === 'large' ? 'aspect-[16/9]' : 'aspect-video'
          )}>
            {/* Placeholder for thumbnail */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Play className={cn(
                "text-white/30 transition-all duration-300",
                size === 'large' ? 'h-20 w-20' : 'h-12 w-12',
                isHovered ? 'scale-110 text-white/50' : ''
              )} />
            </div>
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            
            {/* Access/Lock Indicator */}
            {!hasAccess && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                <div className="text-center">
                  <Lock className="h-8 w-8 text-white mb-2 mx-auto" />
                  <p className="text-white font-semibold">Subscribers Only</p>
                  {stream.min_subscription_tier && (
                    <Badge className="mt-2 bg-white/20 text-white border-white/30">
                      {getTierBadge(stream.min_subscription_tier)?.label} Required
                    </Badge>
                  )}
                </div>
              </div>
            )}
            
            {/* Live indicator */}
            {stream.status === 'live' && (
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <Badge className="bg-red-600 text-white border-0 animate-pulse">
                  <Radio className="h-3 w-3 mr-1" />
                  LIVE
                </Badge>
                {stream.current_viewers && (
                  <Badge className="bg-white/90 text-purple-700 border-0 backdrop-blur">
                    <Eye className="h-3 w-3 mr-1" />
                    {stream.current_viewers.toLocaleString()}
                  </Badge>
                )}
              </div>
            )}
            
            {/* Category badge and Subscription Badge */}
            <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
              <Badge className="bg-white/90 text-purple-700 border-0 backdrop-blur capitalize">
                {stream.category}
              </Badge>
              {subscription && (
                <Badge className={cn(
                  "text-white border-0",
                  getTierBadge(subscription.tier?.tier_type)?.color
                )}>
                  {React.createElement(getTierBadge(subscription.tier?.tier_type)?.icon || Star, { 
                    className: "h-3 w-3 mr-1" 
                  })}
                  Subscribed
                </Badge>
              )}
              {stream.is_subscriber_only && !subscription && (
                <Badge className="bg-red-600 text-white border-0">
                  <Lock className="h-3 w-3 mr-1" />
                  Sub Only
                </Badge>
              )}
            </div>
            
            {/* Stream Info Overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <div className="flex gap-2">
                {stream.scheduled_start && (
                  <Badge className="bg-white/90 text-gray-700 border-0 backdrop-blur">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(stream.scheduled_start).toLocaleTimeString('en-US', { 
                      hour: 'numeric', 
                      minute: '2-digit' 
                    })}
                  </Badge>
                )}
                {stream.max_viewers && (
                  <Badge className="bg-white/90 text-gray-700 border-0 backdrop-blur">
                    <Users className="h-3 w-3 mr-1" />
                    {stream.max_viewers}
                  </Badge>
                )}
              </div>
              {subscription && subscription.tier?.ad_free ? (
                <Badge className="bg-green-600 text-white border-0">
                  <Tv className="h-3 w-3 mr-1" />
                  Ad-Free
                </Badge>
              ) : !stream.is_subscriber_only ? (
                <Badge className="bg-yellow-600 text-white border-0">
                  <Tv className="h-3 w-3 mr-1" />
                  With Ads
                </Badge>
              ) : null}
            </div>
          </div>
          
          {/* Content */}
          <div className="p-3 bg-white">
            <div className="flex items-start space-x-3">
              <Avatar className={cn(
                "border-2",
                subscription ? "border-purple-600" : "border-gray-300",
                size === 'small' ? 'h-8 w-8' : 'h-10 w-10'
              )}>
                <AvatarImage src={stream.creator?.avatar_url} />
                <AvatarFallback>{stream.creator?.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "font-semibold text-gray-900 truncate",
                  size === 'large' ? 'text-lg' : 'text-sm'
                )}>
                  {stream.title}
                </h3>
                <p className="text-sm text-gray-600">{stream.creator?.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  {stream.donations_enabled && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      <Gift className="h-3 w-3 mr-1" />
                      Tips
                    </Badge>
                  )}
                  {stream.chat_enabled && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Chat
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Category Section Component
  const CategorySection = ({ 
    title, 
    streams, 
    icon: Icon,
    color 
  }: { 
    title: string
    streams: LiveStream[]
    icon: any
    color: string
  }) => {
    if (streams.length === 0) return null
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={cn("p-2 rounded-lg bg-gradient-to-r", color)}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            <Badge variant="secondary">{streams.length} streams</Badge>
          </div>
          <Button variant="ghost" size="sm" className="text-purple-600">
            View All
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        
        <ScrollArea className="w-full whitespace-nowrap rounded-lg">
          <div className="flex space-x-4 pb-4">
            {streams.slice(0, 5).map(stream => (
              <StreamCard key={stream.id} stream={stream} size="small" />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Radio className="mr-3 h-8 w-8 animate-pulse" />
                Live Streams
              </h1>
              <p className="mt-2 text-purple-100">
                Discover amazing live content from Haitian creators
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <p className="text-3xl font-bold">{liveNow.length}</p>
                <p className="text-sm text-purple-100">Live Now</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{upcomingStreams.length}</p>
                <p className="text-sm text-purple-100">Upcoming</p>
              </div>
            </div>
          </div>

          {/* Live Alert */}
          {liveNow.length > 0 && (
            <Alert className="bg-white/10 border-white/20 text-white backdrop-blur">
              <Zap className="h-4 w-4" />
              <AlertTitle className="font-bold">Trending Now!</AlertTitle>
              <AlertDescription className="flex items-center justify-between">
                <span>{liveNow[0].creator?.name} is live: "{liveNow[0].title}"</span>
                <Button size="sm" className="bg-white text-purple-600 hover:bg-purple-50 ml-4">
                  Watch Now
                </Button>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search and Category Pills */}
        <div className="space-y-4 mb-8">
          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search streams, creators, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 h-12 text-lg"
            />
          </div>

          {/* Category Pills */}
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex space-x-2">
              {categories.map((cat) => (
                <Button
                  key={cat.value}
                  variant={selectedCategory === cat.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.value)}
                  className={cn(
                    "rounded-full transition-all duration-300",
                    selectedCategory === cat.value 
                      ? `bg-gradient-to-r ${cat.color} text-white border-0`
                      : "hover:scale-105"
                  )}
                >
                  <cat.icon className="h-4 w-4 mr-2" />
                  {cat.label}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Featured Section - Hero Stream */}
        {liveNow.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Flame className="h-6 w-6 mr-2 text-orange-500" />
                Featured Live Stream
              </h2>
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0">
                <Trophy className="h-3 w-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <StreamCard stream={liveNow[0]} size="large" />
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">More Live Streams</h3>
                {liveNow.slice(1, 4).map(stream => (
                  <div key={stream.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors"
                       onClick={() => setSelectedStream(stream)}>
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={stream.creator?.avatar_url} />
                        <AvatarFallback>{stream.creator?.name?.[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-red-600 rounded-full animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {stream.title}
                      </p>
                      <p className="text-xs text-gray-600">
                        {stream.creator?.name} • {stream.current_viewers} viewers
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Category Sections */}
        <div className="space-y-12">
          {/* Live Now Section */}
          {liveNow.length > 0 && (
            <CategorySection
              title="🔴 Live Now"
              streams={liveNow}
              icon={Radio}
              color="from-red-500 to-pink-500"
            />
          )}

          {/* Music Section */}
          <CategorySection
            title="🎵 Music & Concerts"
            streams={musicStreams}
            icon={Music}
            color="from-blue-600 to-purple-600"
          />

          {/* Comedy Section */}
          <CategorySection
            title="😂 Comedy & Entertainment"
            streams={comedyStreams}
            icon={Smile}
            color="from-yellow-500 to-orange-500"
          />

          {/* Talk Shows Section */}
          <CategorySection
            title="🎙️ Talk Shows & Podcasts"
            streams={talkStreams}
            icon={Mic}
            color="from-green-600 to-teal-600"
          />

          {/* Upcoming Section */}
          {upcomingStreams.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-purple-600" />
                  Upcoming Streams
                </h2>
                <Button variant="ghost" size="sm" className="text-purple-600">
                  View Calendar
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {upcomingStreams.slice(0, 4).map(stream => (
                  <StreamCard key={stream.id} stream={stream} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enhanced Stream Details Modal with Subscription Info */}
      <Dialog open={!!selectedStream} onOpenChange={() => setSelectedStream(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          {selectedStream && (() => {
            const subscription = getSubscriptionForCreator(selectedStream.creator_id)
            const hasAccess = !selectedStream.is_subscriber_only || subscription
            
            return (
            <div className="grid grid-cols-1 lg:grid-cols-5">
              {/* Left side - Video Preview */}
              <div className="lg:col-span-3 bg-black">
                <div className="aspect-video bg-gradient-to-br from-purple-600 to-pink-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-20 w-20 text-white/80 mx-auto mb-4" />
                      {selectedStream.status === 'live' && (
                        <Badge className="bg-red-600 text-white border-0 text-lg px-4 py-2 animate-pulse">
                          <Radio className="h-4 w-4 mr-2" />
                          LIVE NOW
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Overlay info */}
                  {selectedStream.current_viewers && (
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <Badge className="bg-white/90 text-purple-700 border-0 backdrop-blur">
                        <Eye className="h-3 w-3 mr-1" />
                        {selectedStream.current_viewers.toLocaleString()} watching
                      </Badge>
                      <Badge className="bg-white/90 text-purple-700 border-0 backdrop-blur capitalize">
                        {selectedStream.category}
                      </Badge>
                    </div>
                  )}
                </div>
                
                {/* Stream Info Bar */}
                <div className="p-4 bg-gradient-to-r from-purple-700 to-pink-700 text-white">
                  <h2 className="text-xl font-bold mb-2">{selectedStream.title}</h2>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-8 w-8 border-2 border-white">
                        <AvatarImage src={selectedStream.creator?.avatar_url} />
                        <AvatarFallback>{selectedStream.creator?.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{selectedStream.creator?.name}</span>
                    </div>
                    {subscription && (
                      <Badge className={cn(
                        "text-white border-0",
                        getTierBadge(subscription.tier?.tier_type)?.color
                      )}>
                        {React.createElement(getTierBadge(subscription.tier?.tier_type)?.icon || Star, { 
                          className: "h-3 w-3 mr-1" 
                        })}
                        {subscription.tier?.tier_name} Member
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Right side - Details */}
              <div className="lg:col-span-2 p-6 space-y-6">
                {/* Close button */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-4 right-4 z-10"
                  onClick={() => setSelectedStream(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                {/* Subscription Status & Access */}
                <div className="text-center py-4 border-b">
                  {subscription ? (
                    <div className="space-y-3">
                      <Badge className={cn(
                        "text-white text-lg px-4 py-2",
                        getTierBadge(subscription.tier?.tier_type)?.color
                      )}>
                        {React.createElement(getTierBadge(subscription.tier?.tier_type)?.icon || Star, { 
                          className: "h-5 w-5 mr-2" 
                        })}
                        {subscription.tier?.tier_name} Subscriber
                      </Badge>
                      <div className="text-sm text-gray-600 space-y-1">
                        {subscription.tier?.ad_free && (
                          <p className="flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                            Ad-free viewing
                          </p>
                        )}
                        {subscription.tier?.priority_chat && (
                          <p className="flex items-center justify-center">
                            <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
                            Priority chat
                          </p>
                        )}
                      </div>
                    </div>
                  ) : selectedStream.is_subscriber_only ? (
                    <div className="space-y-3">
                      <div className="p-4 bg-red-50 rounded-lg">
                        <Lock className="h-8 w-8 text-red-600 mx-auto mb-2" />
                        <p className="text-lg font-semibold text-red-900">Subscription Required</p>
                        <p className="text-sm text-red-700 mt-1">
                          {selectedStream.min_subscription_tier && 
                            `${getTierBadge(selectedStream.min_subscription_tier)?.label} tier or higher`
                          }
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Free to watch with ads</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-purple-600"
                        onClick={() => router.push(`/creator/${selectedStream.creator_id}/subscribe`)}
                      >
                        <LockOpen className="h-4 w-4 mr-2" />
                        Subscribe for ad-free viewing
                      </Button>
                    </div>
                  )}
                </div>
                
                {/* Stream Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Stream Details
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          Date & Time
                        </span>
                        <span className="font-medium">
                          {new Date(selectedStream.scheduled_start || '').toLocaleString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          Duration
                        </span>
                        <span className="font-medium">
                          {selectedStream.status === 'live' ? 'Live Now' : 'Scheduled'}
                        </span>
                      </div>
                      {selectedStream.max_viewers && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              Capacity
                            </span>
                            <span className="font-medium">
                              {selectedStream.current_viewers || 0}/{selectedStream.max_viewers}
                            </span>
                          </div>
                          <Progress 
                            value={((selectedStream.current_viewers || 0) / selectedStream.max_viewers) * 100} 
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      About This Stream
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selectedStream.description}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                      Tags
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedStream.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  {hasAccess ? (
                    selectedStream.status === 'live' ? (
                      <Button className="w-full bg-red-600 text-white hover:bg-red-700 h-12 text-lg">
                        <Radio className="h-5 w-5 mr-2 animate-pulse" />
                        Join Live Stream
                      </Button>
                    ) : (
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white h-12 text-lg">
                        <Bell className="h-5 w-5 mr-2" />
                        Set Reminder
                      </Button>
                    )
                  ) : selectedStream.is_subscriber_only ? (
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white h-12 text-lg"
                      onClick={() => router.push(`/creator/${selectedStream.creator_id}/subscribe`)}
                    >
                      <Crown className="h-5 w-5 mr-2" />
                      Subscribe to Watch
                    </Button>
                  ) : (
                    <div className="space-y-2">
                      <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white h-12 text-lg">
                        <Play className="h-5 w-5 mr-2" />
                        Watch with Ads
                      </Button>
                      <p className="text-xs text-center text-gray-500">
                        Or subscribe for ad-free viewing
                      </p>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button variant="outline" className="flex-1">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Heart className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}