'use client'

import { useState, useRef } from 'react'
import { useLanguage } from '@/contexts/language-context'
import {
  Radio, Calendar, Clock, Users, Heart, Bell, Play, 
  TrendingUp, Star, Filter, Search, ChevronRight, Ticket,
  Music, Smile, Mic, Camera, Globe, Gift, MessageSquare,
  AlertCircle, CheckCircle, Share2, Bookmark, ChevronLeft,
  Eye, Sparkles, Zap, Trophy, Flame, ArrowRight, X
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

interface LiveStream {
  id: string
  title: string
  creatorName: string
  creatorImage: string
  category: string
  startTime: string
  duration: string
  price: number
  viewers?: number
  maxViewers?: number
  description: string
  isLive?: boolean
  isPurchased?: boolean
  isFree?: boolean
  tags: string[]
  thumbnail?: string
  rating?: number
}

export default function CustomerLivestreamsPage() {
  const { language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null)
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Enhanced mock livestream data
  const liveStreams: LiveStream[] = [
    {
      id: 'LS-001',
      title: 'Live Concert: Kompa Classics Night 🎵',
      creatorName: 'Marie-Claire Laurent',
      creatorImage: '/api/placeholder/40/40',
      category: 'music',
      startTime: '2024-01-20 20:00',
      duration: '2 hours',
      price: 25,
      viewers: 1250,
      maxViewers: 2000,
      description: 'Join me for an unforgettable evening of classic Kompa music! We\'ll be performing all your favorite hits and taking requests from the audience.',
      isLive: true,
      isPurchased: true,
      tags: ['Music', 'Kompa', 'Live Performance'],
      rating: 4.9
    },
    {
      id: 'LS-002',
      title: 'Comedy Night: Laugh Until You Cry 😂',
      creatorName: 'Jean-Baptiste Pierre',
      creatorImage: '/api/placeholder/40/40',
      category: 'comedy',
      startTime: '2024-01-21 19:00',
      duration: '1.5 hours',
      price: 15,
      viewers: 856,
      description: 'Get ready for a night of non-stop laughter! Brand new material, audience interaction, and surprise guests.',
      isLive: true,
      tags: ['Comedy', 'Stand-up', 'Entertainment'],
      rating: 4.7
    },
    {
      id: 'LS-003',
      title: 'Master Class: Traditional Haitian Cuisine 🍲',
      creatorName: 'Sophie Duval',
      creatorImage: '/api/placeholder/40/40',
      category: 'cooking',
      startTime: '2024-01-22 18:00',
      duration: '1 hour',
      price: 10,
      viewers: 423,
      description: 'Learn to cook authentic Haitian dishes from scratch. Today: Griot, Pikliz, and Bannann Peze!',
      isFree: true,
      isLive: true,
      tags: ['Cooking', 'Tutorial', 'Haitian Culture'],
      rating: 5.0
    },
    {
      id: 'LS-004',
      title: 'Exclusive Q&A: Behind the Scenes',
      creatorName: 'Marcus Thompson',
      creatorImage: '/api/placeholder/40/40',
      category: 'talk',
      startTime: '2024-01-23 17:00',
      duration: '45 minutes',
      price: 5,
      isPurchased: true,
      tags: ['Q&A', 'Interactive', 'Fan Meeting'],
      rating: 4.6
    },
    {
      id: 'LS-005',
      title: 'Dance Workshop: Master Konpa Moves 💃',
      creatorName: 'Lisa Chen',
      creatorImage: '/api/placeholder/40/40',
      category: 'dance',
      startTime: '2024-01-24 16:00',
      duration: '1 hour',
      price: 20,
      tags: ['Dance', 'Workshop', 'Konpa'],
      rating: 4.8
    },
    {
      id: 'LS-006',
      title: 'Podcast Live: Current Events Discussion',
      creatorName: 'David Wilson',
      creatorImage: '/api/placeholder/40/40',
      category: 'talk',
      startTime: '2024-01-24 19:00',
      duration: '2 hours',
      price: 0,
      isFree: true,
      tags: ['Podcast', 'Discussion', 'News'],
      rating: 4.5
    },
    {
      id: 'LS-007',
      title: 'Acoustic Session: Unplugged & Intimate',
      creatorName: 'Emma Rodriguez',
      creatorImage: '/api/placeholder/40/40',
      category: 'music',
      startTime: '2024-01-25 21:00',
      duration: '1.5 hours',
      price: 30,
      tags: ['Music', 'Acoustic', 'Intimate'],
      rating: 4.9
    },
    {
      id: 'LS-008',
      title: 'Fitness Session: Full Body Workout',
      creatorName: 'Mike Johnson',
      creatorImage: '/api/placeholder/40/40',
      category: 'fitness',
      startTime: '2024-01-25 07:00',
      duration: '45 minutes',
      price: 10,
      tags: ['Fitness', 'Workout', 'Health'],
      rating: 4.7
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

  const filteredStreams = liveStreams.filter(stream => {
    const matchesSearch = stream.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         stream.creatorName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || stream.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const liveNow = filteredStreams.filter(s => s.isLive)
  const upcomingStreams = filteredStreams.filter(s => !s.isLive)
  const musicStreams = liveStreams.filter(s => s.category === 'music')
  const comedyStreams = liveStreams.filter(s => s.category === 'comedy')
  const talkStreams = liveStreams.filter(s => s.category === 'talk')

  // Enhanced Stream Card Component
  const StreamCard = ({ stream, size = 'normal' }: { stream: LiveStream, size?: 'normal' | 'large' | 'small' }) => {
    const isHovered = hoveredCard === stream.id
    
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
            
            {/* Live indicator */}
            {stream.isLive && (
              <div className="absolute top-3 left-3 flex items-center space-x-2">
                <Badge className="bg-red-600 text-white border-0 animate-pulse">
                  <Radio className="h-3 w-3 mr-1" />
                  LIVE
                </Badge>
                {stream.viewers && (
                  <Badge className="bg-white/90 text-purple-700 border-0 backdrop-blur">
                    <Eye className="h-3 w-3 mr-1" />
                    {stream.viewers.toLocaleString()}
                  </Badge>
                )}
              </div>
            )}
            
            {/* Category badge */}
            <div className="absolute top-3 right-3">
              <Badge className="bg-white/90 text-purple-700 border-0 backdrop-blur capitalize">
                {stream.category}
              </Badge>
            </div>
            
            {/* Duration/Price overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
              <Badge className="bg-white/90 text-gray-700 border-0 backdrop-blur">
                <Clock className="h-3 w-3 mr-1" />
                {stream.duration}
              </Badge>
              {stream.isFree ? (
                <Badge className="bg-green-600 text-white border-0">
                  FREE
                </Badge>
              ) : stream.isPurchased ? (
                <Badge className="bg-purple-600 text-white border-0">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Purchased
                </Badge>
              ) : (
                <Badge className="bg-white/90 text-purple-700 border-0 backdrop-blur font-semibold">
                  ${stream.price}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Content */}
          <div className="p-3 bg-white">
            <div className="flex items-start space-x-3">
              <Avatar className={cn(
                "border-2 border-purple-600",
                size === 'small' ? 'h-8 w-8' : 'h-10 w-10'
              )}>
                <AvatarImage src={stream.creatorImage} />
                <AvatarFallback>{stream.creatorName[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h3 className={cn(
                  "font-semibold text-gray-900 truncate",
                  size === 'large' ? 'text-lg' : 'text-sm'
                )}>
                  {stream.title}
                </h3>
                <p className="text-sm text-gray-600">{stream.creatorName}</p>
                {stream.rating && (
                  <div className="flex items-center mt-1">
                    <Star className="h-3 w-3 text-yellow-500 fill-current" />
                    <span className="text-xs text-gray-600 ml-1">{stream.rating}</span>
                  </div>
                )}
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
                <span>{liveNow[0].creatorName} is live: "{liveNow[0].title}"</span>
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
                        <AvatarImage src={stream.creatorImage} />
                        <AvatarFallback>{stream.creatorName[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-red-600 rounded-full animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {stream.title}
                      </p>
                      <p className="text-xs text-gray-600">
                        {stream.creatorName} • {stream.viewers} viewers
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

      {/* Enhanced Stream Details Modal */}
      <Dialog open={!!selectedStream} onOpenChange={() => setSelectedStream(null)}>
        <DialogContent className="max-w-5xl p-0 overflow-hidden">
          {selectedStream && (
            <div className="grid grid-cols-1 lg:grid-cols-5">
              {/* Left side - Video Preview */}
              <div className="lg:col-span-3 bg-black">
                <div className="aspect-video bg-gradient-to-br from-purple-600 to-pink-600 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="h-20 w-20 text-white/80 mx-auto mb-4" />
                      {selectedStream.isLive && (
                        <Badge className="bg-red-600 text-white border-0 text-lg px-4 py-2 animate-pulse">
                          <Radio className="h-4 w-4 mr-2" />
                          LIVE NOW
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Overlay info */}
                  {selectedStream.viewers && (
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <Badge className="bg-white/90 text-purple-700 border-0 backdrop-blur">
                        <Eye className="h-3 w-3 mr-1" />
                        {selectedStream.viewers.toLocaleString()} watching
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
                      <Avatar className="h-8 w-8 border-2 border-purple-600">
                        <AvatarImage src={selectedStream.creatorImage} />
                        <AvatarFallback>{selectedStream.creatorName[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{selectedStream.creatorName}</span>
                    </div>
                    {selectedStream.rating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="ml-1">{selectedStream.rating}</span>
                      </div>
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
                
                {/* Price/Status */}
                <div className="text-center py-4 border-b">
                  {selectedStream.isFree ? (
                    <div>
                      <Badge className="bg-green-100 text-green-700 text-2xl px-6 py-3">
                        FREE EVENT
                      </Badge>
                    </div>
                  ) : selectedStream.isPurchased ? (
                    <div className="space-y-2">
                      <Badge className="bg-purple-100 text-purple-700 text-lg px-4 py-2">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        You have access
                      </Badge>
                      <p className="text-sm text-gray-600">Ticket purchased</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-3xl font-bold text-gray-900">${selectedStream.price}</p>
                      <p className="text-sm text-gray-600 mt-1">per ticket</p>
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
                        <span className="font-medium">{selectedStream.startTime}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          Duration
                        </span>
                        <span className="font-medium">{selectedStream.duration}</span>
                      </div>
                      {selectedStream.maxViewers && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-600 flex items-center">
                              <Users className="h-4 w-4 mr-2" />
                              Capacity
                            </span>
                            <span className="font-medium">
                              {selectedStream.viewers}/{selectedStream.maxViewers}
                            </span>
                          </div>
                          <Progress 
                            value={(selectedStream.viewers! / selectedStream.maxViewers) * 100} 
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
                  {selectedStream.isPurchased ? (
                    selectedStream.isLive ? (
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
                  ) : (
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white h-12 text-lg hover:shadow-lg transform hover:scale-105 transition-all">
                      <Ticket className="h-5 w-5 mr-2" />
                      Get Ticket - ${selectedStream.price}
                    </Button>
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
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}