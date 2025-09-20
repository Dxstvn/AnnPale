"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  Clock,
  Globe,
  DollarSign,
  CheckCircle,
  MessageSquare,
  Video,
  Calendar,
  TrendingUp,
  Users,
  Award,
  Heart,
  Share2,
  Play,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { useSupabaseAuth } from "@/contexts/supabase-auth-compat"
import { VideoOrderModal } from "@/components/video/VideoOrderModal"
import type { EnhancedCreator } from "./enhanced-creator-card"

interface QuickViewModalProps {
  creator: EnhancedCreator | null
  isOpen: boolean
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
  hasNext?: boolean
  hasPrevious?: boolean
  onBook?: (id: string) => void
  onFavorite?: (id: string) => void
  onShare?: (creator: EnhancedCreator) => void
  onMessage?: (id: string) => void
  isFavorited?: boolean
}

export function QuickViewModal({
  creator,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  onBook,
  onFavorite,
  onShare,
  onMessage,
  isFavorited = false
}: QuickViewModalProps) {
  const [activeTab, setActiveTab] = React.useState("overview")
  const [videoPlaying, setVideoPlaying] = React.useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = React.useState(false)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const router = useRouter()
  const { isAuthenticated } = useSupabaseAuth()

  // Reset tab when creator changes
  React.useEffect(() => {
    setActiveTab("overview")
    setVideoPlaying(false)
  }, [creator?.id])

  if (!creator) return null

  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (videoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setVideoPlaying(!videoPlaying)
    }
  }

  const handleBookNow = () => {
    if (!isAuthenticated) {
      // Redirect to signup with return URL for better conversion
      // Properly encode the full destination URL including query parameters
      const returnUrl = `/fan/creators/${creator?.id}?openBooking=true`
      router.push(`/signup?returnTo=${encodeURIComponent(returnUrl)}`)
    } else {
      // Open the booking modal for authenticated users
      setIsBookingModalOpen(true)
      onBook?.(creator?.id || '')
    }
  }

  // Mock data for demonstration
  const mockReviews = [
    {
      id: "1",
      author: "Marie L.",
      rating: 5,
      date: "2 days ago",
      text: "Amazing experience! The video was personalized and heartfelt."
    },
    {
      id: "2",
      author: "Jean P.",
      rating: 5,
      date: "1 week ago",
      text: "Quick delivery and great quality. Highly recommend!"
    },
    {
      id: "3",
      author: "Sophie M.",
      rating: 4,
      date: "2 weeks ago",
      text: "Good service, delivered on time."
    }
  ]

  const mockVideos = [
    { id: "1", thumbnail: creator.coverImage, title: "Birthday Wishes", views: 1234 },
    { id: "2", thumbnail: creator.avatar, title: "Anniversary Message", views: 987 },
    { id: "3", thumbnail: creator.coverImage, title: "Congratulations", views: 654 }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        {/* Header with navigation */}
        <div className="relative">
          {/* Cover Image */}
          <div className="relative h-48 bg-gradient-to-br from-purple-600 to-pink-600">
            {creator.coverImage && (
              <img
                src={creator.coverImage}
                alt={creator.name}
                className="w-full h-full object-cover opacity-80"
              />
            )}
            
            {/* Navigation buttons */}
            {hasPrevious && onPrevious && (
              <button
                onClick={onPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full hover:bg-white dark:hover:bg-gray-900 transition"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            )}
            
            {hasNext && onNext && (
              <button
                onClick={onNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full hover:bg-white dark:hover:bg-gray-900 transition"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            )}

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full hover:bg-white dark:hover:bg-gray-900 transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Creator Info */}
          <div className="relative px-6 pb-6">
            <div className="flex items-end gap-4 -mt-12">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900"
              />
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{creator.name}</h2>
                  {creator.verified && (
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  )}
                  {creator.trending && (
                    <Badge variant="warning">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                  {creator.category}
                </p>
              </div>
              
              {/* Quick Actions */}
              <div className="flex gap-2 pb-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onFavorite?.(creator.id)}
                >
                  <Heart className={cn(
                    "h-4 w-4",
                    isFavorited && "fill-red-500 text-red-500"
                  )} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onShare?.(creator)}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onMessage?.(creator.id)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{creator.rating}</span>
                <span className="text-gray-500">({creator.reviewCount} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-gray-400" />
                <span className="font-semibold">${creator.price}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-400" />
                <span>{creator.responseTime}</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4 text-gray-400" />
                <span>{creator.languages.join(", ")}</span>
              </div>
              {creator.videoCount && (
                <div className="flex items-center gap-1">
                  <Video className="h-4 w-4 text-gray-400" />
                  <span>{creator.videoCount} videos</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabs Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="w-full justify-start px-6 rounded-none border-b">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[400px]">
            {/* Overview Tab */}
            <TabsContent value="overview" className="px-6 pb-6 space-y-6">
              {/* Bio */}
              <div>
                <h3 className="font-semibold mb-2">About {creator.name}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {creator.bio || `${creator.name} is a talented ${creator.category.toLowerCase()} bringing joy to fans through personalized video messages. Book a video for birthdays, anniversaries, or any special occasion!`}
                </p>
              </div>

              {/* Specialties */}
              {creator.specialties && (
                <div>
                  <h3 className="font-semibold mb-2">Specialties</h3>
                  <div className="flex flex-wrap gap-2">
                    {creator.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              <div>
                <h3 className="font-semibold mb-2">Availability</h3>
                <div className="flex items-center gap-2">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    creator.availability === "available" && "bg-green-500",
                    creator.availability === "busy" && "bg-yellow-500",
                    creator.availability === "offline" && "bg-gray-400"
                  )} />
                  <span className="capitalize">
                    {creator.availability || "Available"}
                  </span>
                  {creator.lastActive && (
                    <span className="text-sm text-gray-500">
                      • Last active {creator.lastActive}
                    </span>
                  )}
                </div>
              </div>

              {/* Completion Rate */}
              {creator.completionRate && (
                <div>
                  <h3 className="font-semibold mb-2">Performance</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Award className="h-4 w-4 text-yellow-500" />
                      <span>{creator.completionRate}% completion rate</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-500" />
                      <span>{creator.reviewCount} happy customers</span>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            {/* Videos Tab */}
            <TabsContent value="videos" className="px-6 pb-6">
              <div className="grid grid-cols-3 gap-4">
                {mockVideos.map((video) => (
                  <div key={video.id} className="space-y-2">
                    <div className="relative aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden group cursor-pointer">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium truncate">{video.title}</p>
                      <p className="text-xs text-gray-500">{video.views} views</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Reviews Tab */}
            <TabsContent value="reviews" className="px-6 pb-6 space-y-4">
              {mockReviews.map((review) => (
                <div key={review.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{review.author}</span>
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3 w-3",
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {review.text}
                  </p>
                  <Separator />
                </div>
              ))}
            </TabsContent>

            {/* About Tab */}
            <TabsContent value="about" className="px-6 pb-6 space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Experience</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  With years of experience in the entertainment industry, {creator.name} brings professionalism and authenticity to every video message.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">What to Expect</h3>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>• Personalized video message within {creator.responseTime}</li>
                  <li>• High-quality video and audio</li>
                  <li>• Authentic and heartfelt delivery</li>
                  <li>• Option for special requests</li>
                </ul>
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>

        {/* Footer Actions */}
        <div className="p-6 border-t bg-gray-50 dark:bg-gray-800">
          <div className="flex items-center justify-end">
            <Button
              onClick={handleBookNow}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Book Now - ${creator.price}
            </Button>
          </div>
        </div>

        {/* Video Order Modal */}
        <VideoOrderModal
          creator={{
            id: creator.id,
            name: creator.name,
            avatar: creator.avatar || creator.coverImage,
            responseTime: creator.responseTime,
            rating: creator.rating,
            price: creator.price
          }}
          open={isBookingModalOpen}
          onOpenChange={setIsBookingModalOpen}
        />
      </DialogContent>
    </Dialog>
  )
}