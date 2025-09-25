"use client"

import * as React from "react"
import { Play, Eye, Clock, TrendingUp, Star, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

// Import motion dynamically to avoid SSR issues
const motion = dynamic(
  () => import("framer-motion").then((mod) => mod.motion),
  { ssr: false }
) as any

interface Video {
  id: string
  title: string
  thumbnail?: string
  category: string
  views: number
  duration: string
  featured?: boolean
  rating?: number
}

interface CreatorVideoGridProps {
  videos?: Video[]
  creatorName?: string
}

const defaultVideos: Video[] = [
  {
    id: "1",
    title: "Birthday Surprise for Marie",
    category: "Birthday",
    views: 1240,
    duration: "0:52",
    featured: true,
    rating: 5.0
  },
  {
    id: "2",
    title: "Congratulations Message",
    category: "Congratulations",
    views: 890,
    duration: "0:45",
    rating: 4.9
  },
  {
    id: "3",
    title: "Wedding Wishes",
    category: "Wedding",
    views: 2100,
    duration: "1:10",
    featured: true,
    rating: 5.0
  },
  {
    id: "4",
    title: "Graduation Speech",
    category: "Graduation",
    views: 750,
    duration: "1:05",
    rating: 4.8
  },
  {
    id: "5",
    title: "Anniversary Love Message",
    category: "Anniversary",
    views: 560,
    duration: "0:48",
    rating: 4.9
  },
  {
    id: "6",
    title: "Get Well Soon",
    category: "Get Well",
    views: 320,
    duration: "0:35",
    rating: 4.7
  }
]

export default function CreatorVideoGrid({ 
  videos = defaultVideos,
  creatorName = "Creator"
}: CreatorVideoGridProps) {
  const [filter, setFilter] = React.useState("all")
  const [playingVideo, setPlayingVideo] = React.useState<string | null>(null)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const categories = React.useMemo(() => {
    const cats = ["all", ...new Set(videos.map(v => v.category))]
    return cats
  }, [videos])

  const filteredVideos = React.useMemo(() => {
    if (filter === "all") return videos
    return videos.filter(v => v.category === filter)
  }, [videos, filter])

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Birthday": "bg-purple-100 text-purple-700",
      "Wedding": "bg-pink-100 text-pink-700",
      "Graduation": "bg-blue-100 text-blue-700",
      "Anniversary": "bg-red-100 text-red-700",
      "Congratulations": "bg-green-100 text-green-700",
      "Get Well": "bg-yellow-100 text-yellow-700",
      "default": "bg-gray-100 text-gray-700"
    }
    return colors[category] || colors.default
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Videos</h2>
          <Badge variant="secondary">
            {videos.length} videos
          </Badge>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
                filter === cat
                  ? "bg-purple-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {cat === "all" ? "All Videos" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVideos.map((video, index) => (
          <div
            key={video.id || `video-${index}`}
            className="group"
            style={mounted ? {
              opacity: 1,
              transform: "translateY(0)",
              transition: `all 0.3s ease ${index * 0.1}s`
            } : {
              opacity: 0,
              transform: "translateY(20px)"
            }}
          >
            <div className="bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Thumbnail */}
              <div 
                className="relative aspect-video bg-gradient-to-br from-purple-100 to-pink-100 cursor-pointer"
                onClick={() => setPlayingVideo(video.id)}
              >
                {video.thumbnail ? (
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl opacity-20">🎬</div>
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
                
                {/* Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg group-hover:bg-white group-hover:scale-110 transition-all"
                  >
                    <Play className="h-8 w-8 text-purple-600 ml-1" />
                  </div>
                </div>

                {/* Duration */}
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  {video.duration}
                </div>

                {/* Featured Badge */}
                {video.featured && (
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-yellow-500 text-white border-0">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-900 line-clamp-1 group-hover:text-purple-600 transition-colors">
                    {video.title}
                  </h3>
                  <Badge className={cn("mt-2", getCategoryColor(video.category))}>
                    {video.category}
                  </Badge>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span>{video.views.toLocaleString()} views</span>
                  </div>
                  {video.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span>{video.rating}</span>
                    </div>
                  )}
                </div>

                {/* Action Button */}
                <button className="w-full py-2 text-sm font-medium text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors">
                  Watch Preview
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      {filteredVideos.length >= 6 && (
        <div className="text-center pt-4">
          <button className="px-6 py-3 bg-white border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors">
            Load More Videos
          </button>
        </div>
      )}
    </div>
  )
}