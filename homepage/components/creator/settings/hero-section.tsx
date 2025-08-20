"use client"

import * as React from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  Star,
  Video,
  Clock,
  TrendingUp,
  Edit,
  Camera,
  Shield
} from "lucide-react"
import { motion } from "framer-motion"

interface CreatorStats {
  completedVideos: number
  rating: number
  responseTime: string
  onTimeDelivery: number
  repeatCustomers: number
  totalEarned: string
}

interface CreatorHeroSectionProps {
  name: string
  tagline: string
  category: string
  image?: string
  coverImage?: string
  verified?: boolean
  featured?: boolean
  trending?: boolean
  stats: CreatorStats
  onEditProfile?: () => void
  onEditCover?: () => void
}

export default function CreatorHeroSection({
  name,
  tagline,
  category,
  image = "/placeholder.svg",
  coverImage,
  verified = false,
  featured = false,
  trending = false,
  stats,
  onEditProfile,
  onEditCover
}: CreatorHeroSectionProps) {
  return (
    <div className="relative h-80 bg-gradient-to-r from-purple-600 to-pink-600 overflow-hidden">
      {/* Cover Image with Overlay */}
      {coverImage && (
        <Image
          src={coverImage}
          alt={`${name} cover`}
          fill
          className="object-cover opacity-50"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
      
      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-10 text-6xl opacity-10 text-white"
        >
          🎵
        </motion.div>
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-10 left-10 text-7xl opacity-10 text-white"
        >
          🎭
        </motion.div>
      </div>

      {/* Edit Cover Button */}
      {onEditCover && (
        <Button
          onClick={onEditCover}
          size="sm"
          variant="secondary"
          className="absolute top-4 right-4 bg-white/10 backdrop-blur hover:bg-white/20 text-white"
        >
          <Camera className="h-4 w-4 mr-2" />
          Edit Cover
        </Button>
      )}

      {/* Creator Info */}
      <div className="absolute bottom-0 left-0 right-0 p-8">
        <div className="container mx-auto">
          <div className="flex items-end gap-6">
            {/* Profile Image */}
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                <Image
                  src={image}
                  alt={name}
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
              {verified && (
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2">
                  <CheckCircle className="h-6 w-6" />
                </div>
              )}
              {onEditProfile && (
                <Button
                  onClick={onEditProfile}
                  size="icon"
                  variant="secondary"
                  className="absolute bottom-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Creator Details */}
            <div className="flex-1 text-white">
              <h1 className="text-4xl font-bold mb-2">{name}</h1>
              <p className="text-xl opacity-90 mb-3">{tagline}</p>
              <div className="flex items-center gap-3">
                <Badge className="bg-white/20 text-white border-white/30">
                  {category}
                </Badge>
                {featured && (
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                    <Star className="h-3 w-3 mr-1" />
                    Featured
                  </Badge>
                )}
                {trending && (
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    Trending
                  </Badge>
                )}
                {verified && (
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="hidden lg:grid grid-cols-2 gap-4 text-white">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.completedVideos}</div>
                <div className="text-sm opacity-75">Videos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold flex items-center justify-center">
                  <Star className="h-5 w-5 mr-1 fill-yellow-400 text-yellow-400" />
                  {stats.rating}
                </div>
                <div className="text-sm opacity-75">Rating</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.onTimeDelivery}%</div>
                <div className="text-sm opacity-75">On Time</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.responseTime}</div>
                <div className="text-sm opacity-75">Response</div>
              </div>
            </div>
          </div>

          {/* Mobile Stats */}
          <div className="lg:hidden grid grid-cols-4 gap-2 mt-4 text-white text-center">
            <div>
              <div className="font-bold">{stats.completedVideos}</div>
              <div className="text-xs opacity-75">Videos</div>
            </div>
            <div>
              <div className="font-bold">{stats.rating}</div>
              <div className="text-xs opacity-75">Rating</div>
            </div>
            <div>
              <div className="font-bold">{stats.onTimeDelivery}%</div>
              <div className="text-xs opacity-75">On Time</div>
            </div>
            <div>
              <div className="font-bold">{stats.responseTime}</div>
              <div className="text-xs opacity-75">Response</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}