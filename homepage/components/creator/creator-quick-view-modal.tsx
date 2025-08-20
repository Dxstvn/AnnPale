"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  Clock,
  Globe,
  CheckCircle,
  Play,
  Heart,
  Share2,
  Video,
  DollarSign,
  MessageSquare,
  TrendingUp,
  Calendar,
  Award,
  ChevronRight,
  Users,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface CreatorQuickViewModalProps {
  creator: any
  isOpen: boolean
  onClose: () => void
}

export default function CreatorQuickViewModal({ 
  creator, 
  isOpen, 
  onClose 
}: CreatorQuickViewModalProps) {
  const router = useRouter()
  const [isLiked, setIsLiked] = React.useState(false)
  const [imageLoaded, setImageLoaded] = React.useState(false)

  if (!creator) return null

  const handleBookNow = () => {
    onClose()
    router.push(`/creator/${creator.id}#book`)
  }

  const handleViewProfile = () => {
    onClose()
    router.push(`/creator/${creator.id}`)
  }

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      musician: "🎵",
      singer: "🎵",
      comedian: "😂",
      actor: "🎭",
      djProducer: "🎧",
      dj: "🎧",
      radioHost: "📻",
      default: "🎤"
    }
    return icons[category] || icons.default
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[700px] max-h-[90vh] overflow-y-auto p-0 bg-white rounded-xl">
        {/* Hidden title for accessibility */}
        <DialogTitle className="sr-only">
          {creator?.name || "Creator"} Quick View
        </DialogTitle>
        
        {/* Header Image Section */}
        <div className="relative h-64 bg-gradient-to-br from-purple-600 to-pink-600 rounded-t-xl overflow-hidden">
          {creator.image && (
            <>
              <Image
                src={creator.image}
                alt={creator.name}
                fill
                className={cn(
                  "object-cover transition-opacity duration-300",
                  imageLoaded ? "opacity-100" : "opacity-0"
                )}
                onLoad={() => setImageLoaded(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
            </>
          )}
          
          {/* Category Icon */}
          <div className="absolute top-4 right-4 text-3xl bg-white/95 backdrop-blur-sm rounded-xl w-14 h-14 flex items-center justify-center shadow-lg">
            {getCategoryIcon(creator.category)}
          </div>

          {/* Creator Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-1">{creator.name}</h2>
                <p className="text-lg opacity-90 capitalize">
                  {creator.category?.replace(/([A-Z])/g, ' $1').trim()}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">${creator.price}</p>
                <p className="text-sm opacity-90">per video</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 mt-3">
              {creator.verified && (
                <Badge className="bg-blue-600/90 text-white border-0 backdrop-blur-sm">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{creator.rating}</span>
                <span className="opacity-90">({creator.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">{creator.responseTime}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 space-y-6">
          {/* Bio Preview */}
          {creator.bio && (
            <div>
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                About {creator.name}
              </h3>
              <p className="text-gray-600 line-clamp-3">
                {creator.bio}
              </p>
              <button 
                onClick={handleViewProfile}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm mt-2 flex items-center gap-1"
              >
                Read more
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Key Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Languages */}
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <Globe className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Languages</p>
              <p className="font-semibold text-sm">
                {creator.languages?.length || 3} Languages
              </p>
            </div>

            {/* Response Time */}
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Response</p>
              <p className="font-semibold text-sm">{creator.responseTime}</p>
            </div>

            {/* Videos Completed */}
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <Video className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Videos</p>
              <p className="font-semibold text-sm">{creator.videoCount || creator.reviews}</p>
            </div>

            {/* Rating */}
            <div className="bg-yellow-50 rounded-lg p-4 text-center">
              <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
              <p className="text-xs text-gray-600 mb-1">Rating</p>
              <p className="font-semibold text-sm">{creator.rating}/5.0</p>
            </div>
          </div>

          <Separator />

          {/* Sample Videos Preview */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <Play className="h-5 w-5 text-purple-600" />
              Sample Videos
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div 
                  key={i}
                  className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-pointer group"
                  onClick={handleViewProfile}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100 to-pink-100" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="h-6 w-6 text-purple-600 ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                    <p className="text-white text-xs font-medium">Sample {i}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Top Reviews */}
          <div>
            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              Recent Reviews
            </h3>
            <div className="space-y-3">
              {[
                {
                  name: "Sarah M.",
                  rating: 5,
                  comment: "Amazing! Exceeded all expectations. Quick delivery and so personal!",
                  date: "2 days ago"
                },
                {
                  name: "John D.",
                  rating: 5,
                  comment: "Perfect birthday surprise! My wife loved it. Will definitely book again.",
                  date: "1 week ago"
                }
              ].map((review, i) => (
                <div key={i} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-medium text-sm">{review.name}</p>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3 w-3",
                              i < review.rating
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-300 text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleBookNow}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-12 text-base font-semibold"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Book Now - ${creator.price}
            </Button>
            <Button
              onClick={handleViewProfile}
              variant="outline"
              className="flex-1 border-purple-600 text-purple-600 hover:bg-purple-50 h-12 text-base"
            >
              View Full Profile
            </Button>
          </div>

          {/* Share and Favorite */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
              <Heart className={cn("h-5 w-5", isLiked && "fill-purple-600 text-purple-600")} />
              <span className="text-sm">Save</span>
            </button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors">
              <Share2 className="h-5 w-5" />
              <span className="text-sm">Share</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}