'use client'

import React, { use } from 'react'
import { SubscriberGatedPlayer } from '@/components/streaming/subscriber-gated-player'
import { StreamChat } from '@/components/streaming/stream-chat'
import { useStreamRealtime } from '@/hooks/use-stream-realtime'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Heart, 
  Share2, 
  Bell, 
  Gift,
  Star,
  Trophy,
  TrendingUp,
  Users,
  DollarSign,
  MessageSquare,
  Clock,
  Calendar,
  Crown,
  Shield,
  Sparkles
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface EnhancedStreamPageProps {
  params: Promise<{
    streamId: string
  }>
}

// Mock stream data - in production, fetch from database
const getMockStreamData = (streamId: string) => ({
  id: streamId,
  title: "Live Concert: Kompa Classics Night 🎵",
  description: "Join me for an unforgettable evening of classic Kompa music! We'll be performing all your favorite hits and taking requests from the audience.",
  streamUrl: `https://demo-stream.annpale.com/live/${streamId}/master.m3u8`,
  thumbnailUrl: '/api/placeholder/800/450',
  isLive: true,
  isSubscriberOnly: false,
  category: 'Music',
  tags: ['Kompa', 'Live Music', 'Concert'],
  scheduledStart: new Date(Date.now() - 30 * 60000).toISOString(), // Started 30 mins ago
  creator: {
    id: 'creator-001',
    name: 'Marie-Claire Laurent',
    avatar: '/api/placeholder/100/100',
    bio: 'Professional Kompa singer and performer',
    followerCount: 12500,
    isVerified: true,
  },
  monetization: {
    tipsEnabled: true,
    superChatEnabled: true,
    giftsEnabled: true,
    goalAmount: 500,
    goalProgress: 235,
    goalTitle: 'New Music Video Production',
  },
})

// Mock user subscription - in production, fetch from auth/database
const getMockUserSubscription = () => ({
  tier: 'premium' as const,
  benefits: [
    'Ad-free viewing',
    'Full HD streaming',
    'Priority chat',
    'Exclusive emotes',
    'Download for offline',
  ],
  adFree: true,
})

export default function EnhancedStreamPage({ params }: EnhancedStreamPageProps) {
  const { streamId } = use(params)
  const streamData = getMockStreamData(streamId)
  const userSubscription = getMockUserSubscription()
  
  // Mock current user - in production, get from auth context
  const currentUser = {
    id: 'user-123',
    name: 'Test User',
    role: 'subscriber' as const,
    subscriptionTier: userSubscription.tier,
  }

  // Use real-time hook
  const {
    viewerCount,
    viewers,
    messages,
    metrics,
    isConnected,
    sendMessage,
    sendGift,
  } = useStreamRealtime({
    streamId,
    userId: currentUser.id,
    userName: currentUser.name,
    userRole: currentUser.role,
    subscriptionTier: currentUser.subscriptionTier,
  })

  const handleSubscribe = () => {
    console.log('Navigate to subscription page')
    // router.push(`/creator/${streamData.creator.id}/subscribe`)
  }

  const handleUpgrade = () => {
    console.log('Navigate to upgrade page')
    // router.push('/subscription/upgrade')
  }

  const handleFollow = () => {
    console.log('Follow creator')
  }

  const handleShare = () => {
    console.log('Share stream')
  }

  // Calculate stream duration
  const getStreamDuration = () => {
    const start = new Date(streamData.scheduledStart)
    const now = new Date()
    const diff = now.getTime() - start.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto p-4 lg:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Video & Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* Video Player with Subscriber Logic */}
            <SubscriberGatedPlayer
              streamUrl={streamData.streamUrl}
              streamId={streamData.id}
              isLive={streamData.isLive}
              viewerCount={viewerCount || 0}
              subscription={userSubscription}
              onSubscribe={handleSubscribe}
              onUpgrade={handleUpgrade}
            />

            {/* Stream Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl mb-2">
                      {streamData.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 text-sm">
                      <Badge variant="outline">{streamData.category}</Badge>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {getStreamDuration()}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {viewerCount} watching
                      </span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button size="icon" variant="outline" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="outline">
                      <Bell className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Creator Info */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={streamData.creator.avatar} />
                      <AvatarFallback>{streamData.creator.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{streamData.creator.name}</h3>
                        {streamData.creator.isVerified && (
                          <Badge className="bg-blue-500 text-white h-5 px-1">
                            <Star className="h-3 w-3" />
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {streamData.creator.followerCount.toLocaleString()} followers
                      </p>
                    </div>
                  </div>
                  <Button onClick={handleFollow}>
                    <Heart className="mr-2 h-4 w-4" />
                    Follow
                  </Button>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-700 mb-4">
                  {streamData.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {streamData.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Monetization Goal */}
            {streamData.monetization.goalTitle && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
                      Stream Goal
                    </CardTitle>
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                      {((streamData.monetization.goalProgress / streamData.monetization.goalAmount) * 100).toFixed(0)}%
                    </Badge>
                  </div>
                  <CardDescription>
                    {streamData.monetization.goalTitle}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Progress 
                      value={(streamData.monetization.goalProgress / streamData.monetization.goalAmount) * 100}
                      className="h-3"
                    />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        ${streamData.monetization.goalProgress} raised
                      </span>
                      <span className="font-semibold">
                        ${streamData.monetization.goalAmount} goal
                      </span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    <Gift className="mr-2 h-4 w-4" />
                    Contribute to Goal
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Stream Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stream Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {metrics.viewerCount}
                    </div>
                    <p className="text-xs text-muted-foreground">Current Viewers</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {metrics.peakViewerCount}
                    </div>
                    <p className="text-xs text-muted-foreground">Peak Viewers</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      ${metrics.totalRevenue}
                    </div>
                    <p className="text-xs text-muted-foreground">Total Tips</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">
                      {metrics.chatMessageCount}
                    </div>
                    <p className="text-xs text-muted-foreground">Messages</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Chat & Activity */}
          <div className="space-y-4">
            {/* Connection Status */}
            {isConnected && (
              <Alert className="bg-green-50 border-green-200">
                <div className="flex items-center text-green-700">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse" />
                  <span className="text-sm font-medium">Connected to live chat</span>
                </div>
              </Alert>
            )}

            {/* Live Chat */}
            <StreamChat
              streamId={streamId}
              messages={messages}
              viewers={viewers}
              viewerCount={viewerCount}
              currentUser={currentUser}
              isSubscriberOnly={false}
              onSendMessage={sendMessage}
              onSendGift={sendGift}
              className="h-[600px]"
            />

            {/* Top Supporters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-yellow-500" />
                  Top Supporters
                </CardTitle>
                <CardDescription>Most generous viewers today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'David M.', amount: 50, tier: 'vip' },
                    { name: 'Lisa K.', amount: 25, tier: 'premium' },
                    { name: 'Robert J.', amount: 15, tier: 'basic' },
                  ].map((supporter, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{supporter.name}</p>
                          <Badge variant="secondary" className="text-xs">
                            {supporter.tier}
                          </Badge>
                        </div>
                      </div>
                      <span className="text-sm font-semibold text-primary">
                        ${supporter.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}