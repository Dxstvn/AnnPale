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
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"

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
  const [activeTab, setActiveTab] = useState("feed")
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
    // Mock data - replace with API call
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
    // Check if user is subscribed (mock)
    setIsSubscribed(true)
    setCurrentTier(mockCreator.tiers[1]) // Mock: user has Studio Live tier
    setLoading(false)
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Hero Banner */}
      <div className="relative h-64 lg:h-80 bg-gradient-to-r from-purple-600 to-pink-600">
        {creator.banner && (
          <img 
            src={creator.banner} 
            alt={creator.name}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Creator Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-end gap-4 lg:gap-6">
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
                <div className="flex flex-wrap items-center gap-4 text-sm lg:text-base">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {creator.totalSubscribers.toLocaleString()} subscribers
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="h-4 w-4" />
                    {creator.totalVideos} videos
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-current" />
                    {creator.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Responds in {creator.responseTime}
                  </span>
                </div>
              </div>
              {/* Quick Actions */}
              <div className="hidden lg:flex gap-2">
                {isSubscribed ? (
                  <>
                    <Button size="lg" variant="secondary">
                      <Bell className="h-4 w-4 mr-2" />
                      Subscribed
                    </Button>
                    <Button size="lg" variant="outline" className="bg-white/10 text-white border-white hover:bg-white/20">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                  </>
                ) : (
                  <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
                    <Users className="h-4 w-4 mr-2" />
                    Subscribe
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* Bio Section */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <p className="text-gray-700">{creator.bio}</p>
            <div className="flex flex-wrap gap-2 mt-4">
              {creator.languages.map((lang) => (
                <Badge key={lang} variant="secondary">
                  <Globe className="h-3 w-3 mr-1" />
                  {lang}
                </Badge>
              ))}
              <Badge variant="outline">{creator.category}</Badge>
            </div>
          </CardContent>
        </Card>

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
            <TabsTrigger value="feed">Feed</TabsTrigger>
            <TabsTrigger value="tiers">Subscription Tiers</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          {/* Feed Tab */}
          <TabsContent value="feed" className="space-y-6">
            {content.map((item) => {
              const hasAccess = canAccessContent(item.tierRequired)
              const requiredTier = creator.tiers.find(t => t.slug === item.tierRequired)
              
              return (
                <Card 
                  key={item.id}
                  className={cn(
                    "overflow-hidden",
                    !hasAccess && "opacity-75"
                  )}
                >
                  {item.type === "video" && item.thumbnail && (
                    <div className="relative aspect-video bg-gray-100">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className={cn(
                          "w-full h-full object-cover",
                          !hasAccess && "blur-sm"
                        )}
                      />
                      {hasAccess ? (
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button size="lg" className="bg-white/90 text-black hover:bg-white">
                            <Play className="h-5 w-5 mr-2" />
                            Play
                          </Button>
                        </div>
                      ) : (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <div className="text-center text-white p-4">
                            <Lock className="h-8 w-8 mx-auto mb-2" />
                            <p className="font-semibold">Subscribe to {requiredTier?.name}</p>
                            <p className="text-sm opacity-90">to access this content</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {item.type === "video" && <Video className="h-4 w-4" />}
                          {item.type === "post" && <MessageSquare className="h-4 w-4" />}
                          {item.type === "live" && <Radio className="h-4 w-4" />}
                          <Badge 
                            className={cn(
                              "bg-gradient-to-r text-white text-xs",
                              requiredTier?.color
                            )}
                          >
                            {requiredTier?.name}
                          </Badge>
                          <span className="text-xs text-gray-500">{item.createdAt}</span>
                        </div>
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <button className="flex items-center gap-1 hover:text-purple-600">
                          <ThumbsUp className="h-4 w-4" />
                          {item.likes}
                        </button>
                        <button className="flex items-center gap-1 hover:text-purple-600">
                          <MessageSquare className="h-4 w-4" />
                          {item.comments}
                        </button>
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {item.views}
                        </span>
                      </div>
                      {hasAccess ? (
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                          View Full
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setActiveTab("tiers")}
                        >
                          Upgrade to Access
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          {/* Tiers Tab */}
          <TabsContent value="tiers" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-3">
              {creator.tiers.map((tier) => {
                const IconComponent = getIconComponent(tier.icon)
                const isCurrentTier = currentTier?.id === tier.id
                
                return (
                  <Card 
                    key={tier.id}
                    className={cn(
                      "relative overflow-hidden hover:shadow-xl transition-all",
                      isCurrentTier && "border-2 border-purple-500"
                    )}
                  >
                    {isCurrentTier && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-purple-600 text-white">
                          Current
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader>
                      <div className={cn(
                        "w-12 h-12 rounded-lg bg-gradient-to-r flex items-center justify-center mb-4",
                        tier.color
                      )}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{tier.name}</CardTitle>
                      <CardDescription>{tier.description}</CardDescription>
                      <div className="mt-4">
                        <span className="text-3xl font-bold">${tier.price}</span>
                        <span className="text-gray-600">/month</span>
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <ul className="space-y-3">
                        {tier.benefits.map((benefit, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                            <span className="text-sm">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <div className="mt-6 space-y-3">
                        <Button 
                          className={cn(
                            "w-full",
                            !isCurrentTier && "bg-gradient-to-r from-purple-600 to-pink-600"
                          )}
                          disabled={isCurrentTier}
                        >
                          {isCurrentTier ? "Current Plan" : "Subscribe"}
                        </Button>
                        
                        <p className="text-xs text-center text-gray-500">
                          {tier.subscriberCount.toLocaleString()} subscribers
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About {creator.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Category</h4>
                  <Badge variant="outline">{creator.category}</Badge>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-2">Languages</h4>
                  <div className="flex flex-wrap gap-2">
                    {creator.languages.map((lang) => (
                      <Badge key={lang} variant="secondary">
                        <Globe className="h-3 w-3 mr-1" />
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-semibold mb-2">Stats</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <p className="text-2xl font-bold">{creator.totalSubscribers.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Subscribers</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{creator.totalVideos}</p>
                      <p className="text-sm text-gray-600">Videos</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{creator.rating}</p>
                      <p className="text-sm text-gray-600">Rating</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{creator.responseTime}</p>
                      <p className="text-sm text-gray-600">Response Time</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}