"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import {
  Users,
  Star,
  Clock,
  Video,
  Radio,
  MessageSquare,
  Heart,
  Share2,
  Bell,
  ChevronRight,
  Check,
  Lock,
  Globe,
  Music,
  Trophy,
  Gift,
  Sparkles,
  DollarSign,
  Calendar,
  Eye,
  ThumbsUp,
  Play,
  Zap,
  Info,
  MapPin,
  Mail
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { createClient } from "@/lib/supabase/client"
import CreatorSubscriptionTiers from "@/components/creator/creator-subscription-tiers"
import { InfiniteScrollFeed } from "@/components/creator/infinite-scroll-feed"
import { VideoOrderModal } from "@/components/video/VideoOrderModal"

interface CreatorTier {
  id: string
  name: string
  slug: string
  description: string
  price: number
  color: string
  icon: string
  benefits: string[]
  subscriberCount: number
  sortOrder: number
}

interface CreatorProfile {
  id: string
  name: string
  bio: string
  avatar: string
  banner: string
  category: string
  rating: number
  responseTime: string
  totalVideos: number
  totalSubscribers: number
  languages: string[]
  isVerified: boolean
  tiers: CreatorTier[]
}

interface CreatorContent {
  id: string
  type: "video" | "post" | "live"
  title: string
  description: string
  thumbnail?: string
  createdAt: string
  tierRequired: string
  likes: number
  views: number
  comments: number
}

export default function CreatorFeedPage() {
  const router = useRouter()
  const params = useParams()
  const { language } = useLanguage()
  const { user, isAuthenticated } = useSupabaseAuth()
  const [activeTab, setActiveTab] = useState("posts")
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [currentTier, setCurrentTier] = useState<CreatorTier | null>(null)
  const [creator, setCreator] = useState<CreatorProfile | null>(null)
  const [content, setContent] = useState<CreatorContent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCreatorProfile()
    loadCreatorContent()
  }, [params.id])

  const loadCreatorProfile = async () => {
    try {
      const supabase = createClient()
      
      // Map numeric IDs to actual creator UUIDs
      const creatorMappings: Record<string, string> = {
        '1': 'd963aa48-879d-461c-9df3-7dc557b545f9', // Wyclef Jean
        '2': '819421cf-9437-4d10-bb09-bca4e0c12cba', // Michael Brun
        '6': 'cbce25c9-04e0-45c7-b872-473fed4eeb1d'  // Rutshelle Guillaume
      }
      
      const creatorId = creatorMappings[params.id as string] || params.id
      
      // Fetch creator profile
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select(`
          id,
          name,
          email,
          avatar_url,
          bio,
          category,
          public_figure_verified
        `)
        .eq('id', creatorId)
        .single()
      
      if (error || !profileData) {
        console.error('Error fetching creator:', error?.message || error || 'No profile data found')
        // Fall back to mock data
        const mockCreator: CreatorProfile = {
      id: params.id as string,
      name: "Marie Jean",
      bio: "🎵 Haitian Singer & Songwriter | 🎤 Studio Sessions | 🎸 Live Performances | Bringing you authentic Haitian music with a modern twist. Join my journey!",
      avatar: "/placeholder.svg",
      banner: "/placeholder.svg",
      category: "Musician",
      rating: 4.9,
      responseTime: "24 hours",
      totalVideos: 156,
      totalSubscribers: 2847,
      languages: ["English", "Kreyòl", "Français"],
      isVerified: true,
      tiers: [
        {
          id: "tier-1",
          name: "Fanm ak Gason",
          slug: "fanm-ak-gason",
          description: "Get early access to all my new songs and exclusive behind-the-scenes content",
          price: 5,
          color: "from-purple-500 to-purple-700",
          icon: "Music",
          benefits: [
            "Early access to new songs",
            "Monthly exclusive content",
            "Community chat access",
            "Behind-the-scenes photos"
          ],
          subscriberCount: 1523,
          sortOrder: 1
        },
        {
          id: "tier-2",
          name: "Studio Live",
          slug: "studio-live",
          description: "Join me in the studio for live recording sessions and get demo tracks",
          price: 15,
          color: "from-pink-500 to-rose-700",
          icon: "Mic",
          benefits: [
            "All Fanm ak Gason benefits",
            "Live studio sessions (2x monthly)",
            "Demo tracks & unreleased songs",
            "Monthly Q&A sessions",
            "Name in album credits"
          ],
          subscriberCount: 892,
          sortOrder: 2
        },
        {
          id: "tier-3",
          name: "Pwodiktè VIP",
          slug: "prodikte-vip",
          description: "The ultimate experience - personal interactions and collaboration opportunities",
          price: 50,
          color: "from-amber-500 to-orange-700",
          icon: "Trophy",
          benefits: [
            "All previous tier benefits",
            "1-on-1 monthly video call (15 min)",
            "Personalized song covers",
            "Song stems for remixing",
            "Collaboration opportunities",
            "VIP concert tickets when available"
          ],
          subscriberCount: 432,
          sortOrder: 3
        }
      ]
        }
        
        setCreator(mockCreator)
        setLoading(false)
        return
      }
      
      // Convert database data to CreatorProfile format
      const creatorProfile: CreatorProfile = {
        id: profileData.id,
        name: profileData.name,
        bio: profileData.bio || "Talented creator sharing amazing content",
        avatar: profileData.avatar_url || "/placeholder.svg",
        banner: "/placeholder.svg",
        category: profileData.category || "Creator",
        rating: 4.9,
        responseTime: "24 hours",
        totalVideos: 156,
        totalSubscribers: 2847,
        languages: ["English", "Kreyòl", "Français"],
        isVerified: profileData.public_figure_verified || false,
        tiers: [] // Will be loaded by CreatorSubscriptionTiers component
      }
      
      setCreator(creatorProfile)
      setLoading(false)
    } catch (err) {
      console.error('Error loading creator profile:', err)
      setLoading(false)
    }
  }

  const loadCreatorContent = async () => {
    // Mock content data
    const mockContent: CreatorContent[] = [
      {
        id: "1",
        type: "video",
        title: "Recording 'Lanmou San Fwontyè' - Full Studio Session",
        description: "Watch the complete recording process of my new single. See how we layer vocals, add instruments, and perfect the mix.",
        thumbnail: "/placeholder.svg",
        createdAt: "2 hours ago",
        tierRequired: "studio-live",
        likes: 342,
        views: 1520,
        comments: 45
      },
      {
        id: "2",
        type: "post",
        title: "New Album Announcement! 🎉",
        description: "I'm thrilled to announce my 5th studio album 'Rasin Mwen' coming this December! It features 12 tracks celebrating our beautiful culture.",
        createdAt: "1 day ago",
        tierRequired: "fanm-ak-gason",
        likes: 892,
        views: 3420,
        comments: 156
      },
      {
        id: "3",
        type: "live",
        title: "Live Performance from Port-au-Prince",
        description: "Join me for a special live performance from my hometown. We'll be playing new songs and taking requests!",
        createdAt: "3 days ago",
        tierRequired: "prodikte-vip",
        likes: 567,
        views: 4580,
        comments: 234
      }
    ]
    
    setContent(mockContent)
  }

  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case "Music": return Music
      case "Mic": return Music
      case "Trophy": return Trophy
      default: return Star
    }
  }

  const canAccessContent = (tierRequired: string) => {
    if (!currentTier) return false
    const tierIndex = creator?.tiers.findIndex(t => t.slug === tierRequired) ?? -1
    const currentTierIndex = creator?.tiers.findIndex(t => t.id === currentTier.id) ?? -1
    return currentTierIndex >= tierIndex
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading creator profile...</p>
        </div>
      </div>
    )
  }

  if (!creator) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50" data-testid="creator-profile">
      {/* Hero Banner with About Section */}
      <div className="relative bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="absolute inset-0 bg-black/20" />
        
        <div className="relative max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Creator Info */}
            <div className="lg:col-span-2">
              <div className="flex items-start gap-4 lg:gap-6 mb-6">
                <Avatar className="h-24 w-24 lg:h-32 lg:w-32 border-4 border-white shadow-xl">
                  <AvatarImage src={creator.avatar} />
                  <AvatarFallback>{creator.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <h1 className="text-2xl lg:text-4xl font-bold">{creator.name}</h1>
                    {creator.isVerified && (
                      <Badge className="bg-blue-500 text-white">
                        <Check className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm lg:text-base opacity-90 mb-3">{creator.category}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {creator.totalSubscribers.toLocaleString()} fans
                    </span>
                    <span className="flex items-center gap-1">
                      <Video className="h-4 w-4" />
                      {creator.totalVideos} videos
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current" />
                      {creator.rating} rating
                    </span>
                  </div>
                </div>
              </div>
              
              {/* About Section */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 lg:p-6">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  About
                </h3>
                <p className="text-white/90 text-sm lg:text-base mb-3">{creator.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {creator.languages.map((lang) => (
                    <Badge key={lang} className="bg-white/20 text-white border-white/30">
                      <Globe className="h-3 w-3 mr-1" />
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Right: Quick Actions */}
            <div className="space-y-4">
              <Card className="bg-white/95 backdrop-blur">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Video Order Button */}
                    <VideoOrderModal
                      creator={{
                        id: creator.id,
                        name: creator.name,
                        avatar: creator.avatar,
                        responseTime: creator.responseTime,
                        rating: creator.rating,
                        price: 50
                      }}
                      trigger={
                        <Button 
                          size="lg" 
                          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                          data-testid="request-video-button"
                        >
                          <Video className="h-5 w-5 mr-2" />
                          Request Video Message
                        </Button>
                      }
                    />
                    
                    {/* Subscribe Button */}
                    {!isSubscribed && (
                      <Button 
                        size="lg" 
                        variant="outline"
                        className="w-full"
                        onClick={() => setActiveTab("subscriptions")}
                      >
                        <Users className="h-5 w-5 mr-2" />
                        View Subscription Tiers
                      </Button>
                    )}
                    
                    {/* Response Time */}
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Typically responds in {creator.responseTime}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Share Buttons */}
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 bg-white/90">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button size="sm" variant="outline" className="flex-1 bg-white/90">
                  <Heart className="h-4 w-4 mr-2" />
                  Follow
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-8">

        {/* Current Subscription Status */}
        {isSubscribed && currentTier && (
          <Card className="mb-6 border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Your current subscription</p>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    <Badge className={cn("bg-gradient-to-r text-white", currentTier.color)}>
                      {currentTier.name}
                    </Badge>
                    <span className="text-gray-700">${currentTier.price}/month</span>
                  </h3>
                </div>
                <Button variant="outline">Manage Subscription</Button>
              </div>
            </CardContent>
          </Card>
        )}


        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full lg:w-auto grid-cols-3">
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>

          {/* Posts Tab - Infinite Scroll Feed */}
          <TabsContent value="posts" className="space-y-6">
            <InfiniteScrollFeed
              creatorId={creator.id}
              creatorName={creator.name}
                creatorAvatar={creator.avatar}
                userTier={currentTier?.slug || null}
                userId={user?.id || null}
                initialLimit={3}
                loadMoreLimit={6}
              />
          </TabsContent>

          {/* Subscriptions Tab */}
          <TabsContent value="subscriptions" className="space-y-6">
            <CreatorSubscriptionTiers 
              creatorId={params.id as string}
              creatorName={creator.name}
              onSubscribe={(tierId, tierName, price) => {
                console.log(`Subscribing to ${tierName} (${tierId}) for $${price}/month`)
                // TODO: Implement actual subscription flow
                // For now, redirect to a checkout page or open payment modal
                router.push(`/checkout?tier=${tierId}&creator=${params.id}&price=${price}`)
              }}
            />
          </TabsContent>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  Request a Personalized Video
                </CardTitle>
                <CardDescription>
                  Get a custom video message from {creator.name} for any occasion
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Gift className="h-4 w-4" />
                      Perfect For:
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600" />
                        Birthday wishes
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600" />
                        Congratulations & celebrations
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600" />
                        Words of encouragement
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600" />
                        Holiday greetings
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-600" />
                        Special announcements
                      </li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-semibold flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      What You Get:
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-500" />
                        30-90 second personalized video
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-500" />
                        HD quality recording
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-500" />
                        Delivered within {creator.responseTime}
                      </li>
                      <li className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-500" />
                        Downloadable & shareable
                      </li>
                    </ul>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Starting at</p>
                    <p className="text-3xl font-bold text-purple-600">$50</p>
                  </div>
                  <VideoOrderModal
                    creator={{
                      id: creator.id,
                      name: creator.name,
                      avatar: creator.avatar,
                      responseTime: creator.responseTime,
                      rating: creator.rating,
                      price: 50
                    }}
                    trigger={
                      <Button 
                        size="lg" 
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      >
                        <Video className="h-5 w-5 mr-2" />
                        Order Video Message
                      </Button>
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}