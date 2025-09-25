"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
import { useSupabaseAuth } from "@/contexts/supabase-auth-compat"
import { createClient } from "@/lib/supabase/client"
import { InfiniteScrollFeed } from "@/components/creator/infinite-scroll-feed"
import { CreatorServicesModal } from "@/components/creator/creator-services-modal"

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
  coverImage?: string
  category: string
  rating: number
  responseTime: string
  totalVideos: number
  totalSubscribers: number
  languages: string[]
  isVerified: boolean
  tiers: CreatorTier[]
}


export default function CreatorFeedPage() {
  const router = useRouter()
  const params = useParams()
  const t = useTranslations()
  const { user, isAuthenticated } = useSupabaseAuth()
  const [selectedTier, setSelectedTier] = useState<string | null>(null)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [currentTier, setCurrentTier] = useState<CreatorTier | null>(null)
  const [creator, setCreator] = useState<CreatorProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalState, setModalState] = useState<{ isOpen: boolean, defaultTab: "video" | "subscription" }>({ isOpen: false, defaultTab: "video" })
  const hasCheckedParam = useRef(false)

  useEffect(() => {
    loadCreatorProfile()
  }, [params.id])

  // Check for openBooking or openSubscription query parameters after authentication
  useEffect(() => {
    if (creator && !hasCheckedParam.current && typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const openBookingParam = urlParams.get('openBooking')
      const openSubscriptionParam = urlParams.get('openSubscription')

      if (openBookingParam === 'true') {
        hasCheckedParam.current = true
        setModalState({ isOpen: true, defaultTab: 'video' })
        window.history.replaceState({}, '', window.location.pathname)
      } else if (openSubscriptionParam === 'true') {
        hasCheckedParam.current = true
        setModalState({ isOpen: true, defaultTab: 'subscription' })
        window.history.replaceState({}, '', window.location.pathname)
      }
    }
  }, [creator])

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
          cover_image,
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
        banner: profileData.cover_image || "/placeholder.svg",
        coverImage: profileData.cover_image || undefined,
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


  const getIconComponent = (iconName: string) => {
    switch(iconName) {
      case "Music": return Music
      case "Mic": return Music
      case "Trophy": return Trophy
      default: return Star
    }
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
      <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 h-64 lg:h-80 overflow-hidden">
        {/* Cover Image */}
        {creator.coverImage && (
          <img
            src={creator.coverImage}
            alt={`${creator.name} cover`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
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
                    <Button
                      size="lg"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                      data-testid="request-video-button"
                      onClick={() => setModalState({ isOpen: true, defaultTab: 'video' })}
                    >
                      <Video className="h-5 w-5 mr-2" />
                      Request Video Message
                    </Button>

                    {/* Subscribe Button */}
                    {!isSubscribed && (
                      <Button
                        size="lg"
                        variant="outline"
                        className="w-full"
                        onClick={() => setModalState({ isOpen: true, defaultTab: 'subscription' })}
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


        {/* Creator Feed */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Creator Feed</h2>
            <Badge variant="outline" className="text-gray-600">
              <MessageSquare className="h-4 w-4 mr-1" />
              Latest Updates
            </Badge>
          </div>

          <InfiniteScrollFeed
            creatorId={creator.id}
            creatorName={creator.name}
            creatorAvatar={creator.avatar}
            userTier={currentTier?.slug || null}
            userId={user?.id || null}
            initialLimit={3}
            loadMoreLimit={6}
          />
        </div>
      </div>

      {/* Creator Services Modal */}
      {creator && (
        <CreatorServicesModal
          creator={{
            id: creator.id,
            name: creator.name,
            avatar: creator.avatar,
            responseTime: creator.responseTime,
            rating: creator.rating,
            price: 50
          }}
          open={modalState.isOpen}
          onOpenChange={(open) => setModalState({ ...modalState, isOpen: open })}
          defaultTab={modalState.defaultTab}
        />
      )}
    </div>
  )
}