"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Video,
  Phone,
  Radio,
  Calendar,
  Clock,
  Star,
  Heart,
  Bell,
  Play,
  Users,
  MessageSquare,
  Sparkles,
  ChevronRight,
  DollarSign,
  Activity,
  Gift,
  Trophy,
  Search,
  Filter,
  Music,
  Mic,
  Smile,
  Award,
  Globe,
  TrendingUp,
  Eye,
  ThumbsUp,
  Share2,
  BookmarkPlus,
  MoreVertical
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ContentFeedItem {
  id: string
  creator: {
    name: string
    avatar: string
    tier: string
    tierColor: string
  }
  type: "video" | "live" | "post" | "announcement"
  title: string
  description: string
  thumbnail?: string
  createdAt: string
  likes: number
  views: number
  comments: number
  isSubscribed: boolean
  tierRequired?: string
}

export default function FanHomePage() {
  const router = useRouter()
  const { language } = useLanguage()
  const { user, isLoading, isAuthenticated } = useSupabaseAuth()
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [feedItems, setFeedItems] = useState<ContentFeedItem[]>([])

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
    return null
  }

  // Mock feed data based on subscriptions
  const mockFeedItems: ContentFeedItem[] = [
    {
      id: "1",
      creator: {
        name: "Marie Jean",
        avatar: "/placeholder.svg",
        tier: "Studio Sessions",
        tierColor: "from-purple-600 to-pink-600"
      },
      type: "video",
      title: "Behind the scenes: Recording my new album",
      description: "Get exclusive access to my studio sessions and see how I create music from scratch. This session includes a special collaboration with...",
      thumbnail: "/placeholder.svg",
      createdAt: "2 hours ago",
      likes: 342,
      views: 1520,
      comments: 45,
      isSubscribed: true,
      tierRequired: "Studio Sessions"
    },
    {
      id: "2",
      creator: {
        name: "Jean Baptiste",
        avatar: "/placeholder.svg",
        tier: "Laugh Club",
        tierColor: "from-pink-600 to-rose-600"
      },
      type: "live",
      title: "Live Comedy Show - Saturday Night Special",
      description: "Join me for a live comedy show featuring new material and special guests. We'll be taking requests and doing improv!",
      createdAt: "Live now",
      likes: 892,
      views: 3420,
      comments: 156,
      isSubscribed: true
    },
    {
      id: "3",
      creator: {
        name: "Claudette Pierre",
        avatar: "/placeholder.svg",
        tier: "Backstage Pass",
        tierColor: "from-green-600 to-emerald-600"
      },
      type: "post",
      title: "Big announcement: World Tour 2025!",
      description: "I'm excited to share that I'll be touring 15 cities across the US and Haiti. Backstage Pass members get early ticket access...",
      createdAt: "5 hours ago",
      likes: 1245,
      views: 5680,
      comments: 234,
      isSubscribed: false,
      tierRequired: "Backstage Pass"
    },
    {
      id: "4",
      creator: {
        name: "Michel Louis",
        avatar: "/placeholder.svg",
        tier: "Kitchen Krew",
        tierColor: "from-orange-600 to-amber-600"
      },
      type: "video",
      title: "Traditional Griot Recipe - Step by Step",
      description: "Learn how to make authentic Haitian griot with my family's secret marinade. Kitchen Krew members get the written recipe...",
      thumbnail: "/placeholder.svg",
      createdAt: "1 day ago",
      likes: 567,
      views: 2340,
      comments: 89,
      isSubscribed: true,
      tierRequired: "Kitchen Krew"
    }
  ]

  useEffect(() => {
    // Simulate loading feed items
    setFeedItems(mockFeedItems)
  }, [])

  // Stats for quick overview
  const stats = [
    {
      label: "Active Subscriptions",
      value: "12",
      icon: Users,
      color: "from-purple-600 to-pink-600"
    },
    {
      label: "New Content",
      value: "24",
      icon: Video,
      color: "from-green-600 to-emerald-600"
    },
    {
      label: "Live Now",
      value: "3",
      icon: Radio,
      color: "from-pink-600 to-rose-600"
    },
    {
      label: "This Month",
      value: "$145",
      icon: DollarSign,
      color: "from-orange-600 to-amber-600"
    }
  ]

  const getTypeIcon = (type: string) => {
    switch(type) {
      case "video": return <Video className="h-4 w-4" />
      case "live": return <Radio className="h-4 w-4" />
      case "post": return <MessageSquare className="h-4 w-4" />
      case "announcement": return <Bell className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getTypeBadgeVariant = (type: string) => {
    switch(type) {
      case "live": return "destructive"
      case "announcement": return "default"
      default: return "secondary"
    }
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Hero with gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center flex-wrap gap-2">
              Your Feed
              <Sparkles className="h-5 sm:h-6 w-5 sm:w-6" />
            </h1>
            <p className="text-white/90 mt-2 text-sm sm:text-base">
              Catch up on the latest from your favorite creators
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button className="bg-white text-purple-600 hover:bg-gray-100 text-sm sm:text-base">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              <Badge className="ml-2 bg-purple-600 text-white">8</Badge>
            </Button>
            <Button 
              variant="outline" 
              className="text-white border-white hover:bg-white/10 text-sm sm:text-base"
              onClick={() => router.push('/fan/subscriptions')}
            >
              <Users className="h-4 w-4 mr-2" />
              Manage Subscriptions
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className={cn(
                  "p-2 rounded-lg bg-gradient-to-r",
                  stat.color
                )}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search your subscribed content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full sm:w-auto grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="live">Live</TabsTrigger>
          <TabsTrigger value="posts">Posts</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6 space-y-6">
          {/* Feed Cards - elevated variant */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {feedItems.map((item) => (
              <Card 
                key={item.id} 
                className="overflow-hidden hover:shadow-xl transition-all hover:-translate-y-1"
              >
                {/* Thumbnail for video/live content */}
                {(item.type === "video" || item.type === "live") && (
                  <div className="relative aspect-video bg-gray-100">
                    {item.type === "live" && (
                      <Badge 
                        variant="destructive" 
                        className="absolute top-4 left-4 z-10"
                      >
                        <Radio className="h-3 w-3 mr-1" />
                        LIVE
                      </Badge>
                    )}
                    <img 
                      src={item.thumbnail || "/placeholder.svg"} 
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                    {item.type === "video" && (
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <Button size="lg" className="bg-white/90 text-black hover:bg-white">
                          <Play className="h-5 w-5 mr-2" />
                          Play
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={item.creator.avatar} />
                        <AvatarFallback>{item.creator.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{item.creator.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={cn(
                              "bg-gradient-to-r text-white text-xs",
                              item.creator.tierColor
                            )}
                          >
                            {item.creator.tier}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {item.createdAt}
                          </span>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>
                          <BookmarkPlus className="h-4 w-4 mr-2" />
                          Save
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeIcon(item.type)}
                      <Badge variant={getTypeBadgeVariant(item.type)}>
                        {item.type === "live" ? "Live Now" : item.type}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>

                  {/* Tier Gate for non-subscribed content */}
                  {!item.isSubscribed && item.tierRequired && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg">
                      <p className="text-sm text-purple-700 flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Subscribe to "{item.tierRequired}" to access this content
                      </p>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-1 hover:text-purple-600 transition-colors">
                        <ThumbsUp className="h-4 w-4" />
                        {item.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-purple-600 transition-colors">
                        <MessageSquare className="h-4 w-4" />
                        {item.comments}
                      </button>
                      <span className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {item.views}
                      </span>
                    </div>
                    {item.isSubscribed ? (
                      <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                        View Full
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline">
                        Subscribe
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center pt-6">
            <Button variant="outline" size="lg">
              Load More Content
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}