"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Heart,
  Share2,
  Download,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  LayoutList,
  Film,
  Camera,
  Newspaper,
  Sparkles,
  Clock,
  Eye,
  X,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useInView } from "react-intersection-observer"

export type MediaType = "video" | "photo" | "press" | "behind-scenes"

export interface MediaItem {
  id: string
  type: MediaType
  title: string
  description?: string
  thumbnail: string
  url: string
  duration?: number // For videos in seconds
  views?: number
  likes?: number
  date: Date
  featured?: boolean
  category?: string
  source?: string // For press items
}

export interface MediaGalleryData {
  introductionVideo?: MediaItem
  recentDeliveries: MediaItem[]
  behindScenes: MediaItem[]
  photos: MediaItem[]
  press: MediaItem[]
}

interface MediaGalleryProps {
  data: MediaGalleryData
  creatorName: string
  onMediaClick?: (media: MediaItem) => void
  className?: string
}

// Video preview component with auto-play
function VideoPreview({
  media,
  featured = false,
  onPlay,
  autoPlay = false
}: {
  media: MediaItem
  featured?: boolean
  onPlay: () => void
  autoPlay?: boolean
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isMuted, setIsMuted] = React.useState(true)
  const [progress, setProgress] = React.useState(0)
  const { ref, inView } = useInView({
    threshold: 0.5,
    triggerOnce: false
  })

  // Auto-play on hover (desktop) or scroll (mobile)
  React.useEffect(() => {
    if (videoRef.current) {
      if (autoPlay && inView) {
        videoRef.current.play().catch(() => {})
        setIsPlaying(true)
      } else {
        videoRef.current.pause()
        setIsPlaying(false)
      }
    }
  }, [autoPlay, inView])

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100
      setProgress(progress)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100",
        featured && "md:col-span-2 md:row-span-2"
      )}
      onClick={onPlay}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={media.url}
        poster={media.thumbnail}
        muted={isMuted}
        loop
        playsInline
        onTimeUpdate={handleTimeUpdate}
        className="w-full h-full object-cover aspect-video"
      />

      {/* Overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      )} />

      {/* Play Button */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-4 bg-white/90 rounded-full group-hover:scale-110 transition">
            <Play className="h-8 w-8 text-black fill-current" />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition">
        {/* Progress Bar */}
        <div className="h-1 bg-white/30 rounded-full mb-3">
          <div 
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                if (videoRef.current) {
                  if (isPlaying) {
                    videoRef.current.pause()
                  } else {
                    videoRef.current.play()
                  }
                  setIsPlaying(!isPlaying)
                }
              }}
              className="p-1.5 bg-white/20 rounded hover:bg-white/30 transition"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4 text-white" />
              ) : (
                <Play className="h-4 w-4 text-white fill-current" />
              )}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsMuted(!isMuted)
                if (videoRef.current) {
                  videoRef.current.muted = !isMuted
                }
              }}
              className="p-1.5 bg-white/20 rounded hover:bg-white/30 transition"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-white" />
              ) : (
                <Volume2 className="h-4 w-4 text-white" />
              )}
            </button>
          </div>

          {media.duration && (
            <span className="text-xs text-white font-medium">
              {formatDuration(media.duration)}
            </span>
          )}
        </div>
      </div>

      {/* Featured Badge */}
      {featured && (
        <Badge className="absolute top-4 left-4 bg-purple-600">
          <Sparkles className="h-3 w-3 mr-1" />
          Featured
        </Badge>
      )}

      {/* Title & Stats */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <p className="text-white font-medium line-clamp-1">{media.title}</p>
        {media.views && (
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-white/80 flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {media.views.toLocaleString()}
            </span>
            {media.likes && (
              <span className="text-xs text-white/80 flex items-center gap-1">
                <Heart className="h-3 w-3" />
                {media.likes.toLocaleString()}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Photo gallery item
function PhotoItem({
  media,
  onClick
}: {
  media: MediaItem
  onClick: () => void
}) {
  const [imageLoaded, setImageLoaded] = React.useState(false)

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100"
      onClick={onClick}
    >
      <div className="aspect-square relative">
        <Image
          src={media.thumbnail}
          alt={media.title}
          fill
          className={cn(
            "object-cover transition-opacity duration-300",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
          <div className="text-center text-white p-4">
            <Camera className="h-8 w-8 mx-auto mb-2" />
            <p className="text-sm font-medium line-clamp-2">{media.title}</p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// Press/Media coverage item
function PressItem({
  media,
  onClick
}: {
  media: MediaItem
  onClick: () => void
}) {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition group"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Newspaper className="h-6 w-6 text-purple-600" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-medium line-clamp-1 group-hover:text-purple-600 transition">
                  {media.title}
                </h4>
                {media.source && (
                  <p className="text-sm text-gray-500 mt-1">{media.source}</p>
                )}
              </div>
              <Badge variant="secondary" className="flex-shrink-0">
                {media.category || "Press"}
              </Badge>
            </div>
            
            {media.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {media.description}
              </p>
            )}
            
            <p className="text-xs text-gray-400 mt-2">
              {media.date.toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Fullscreen media viewer
function MediaViewer({
  media,
  isOpen,
  onClose,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious
}: {
  media: MediaItem | null
  isOpen: boolean
  onClose: () => void
  onNext?: () => void
  onPrevious?: () => void
  hasNext?: boolean
  hasPrevious?: boolean
}) {
  if (!media) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
          onClick={onClose}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 rounded-full hover:bg-white/20 transition z-10"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Navigation */}
          {hasPrevious && onPrevious && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onPrevious()
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full hover:bg-white/20 transition"
            >
              <ChevronLeft className="h-6 w-6 text-white" />
            </button>
          )}

          {hasNext && onNext && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onNext()
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 rounded-full hover:bg-white/20 transition"
            >
              <ChevronRight className="h-6 w-6 text-white" />
            </button>
          )}

          {/* Media Content */}
          <div 
            className="max-w-6xl max-h-[90vh] mx-auto p-4"
            onClick={(e) => e.stopPropagation()}
          >
            {media.type === "video" ? (
              <video
                src={media.url}
                controls
                autoPlay
                className="w-full h-full max-h-[80vh] object-contain"
              />
            ) : (
              <Image
                src={media.url}
                alt={media.title}
                width={1920}
                height={1080}
                className="w-full h-full max-h-[80vh] object-contain"
              />
            )}

            {/* Media Info */}
            <div className="mt-4 text-white">
              <h3 className="text-xl font-semibold">{media.title}</h3>
              {media.description && (
                <p className="text-gray-300 mt-2">{media.description}</p>
              )}
              
              <div className="flex items-center gap-4 mt-4">
                <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
                  <Heart className="h-4 w-4 mr-2" />
                  Like
                </Button>
                <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="text-white border-white/30 hover:bg-white/10">
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Main gallery component
export function MediaGallery({
  data,
  creatorName,
  onMediaClick,
  className
}: MediaGalleryProps) {
  const [activeTab, setActiveTab] = React.useState("all")
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [selectedMedia, setSelectedMedia] = React.useState<MediaItem | null>(null)
  const [viewerOpen, setViewerOpen] = React.useState(false)
  const [visibleItems, setVisibleItems] = React.useState(12)
  const [loading, setLoading] = React.useState(false)

  // Combine all media items
  const allMedia = React.useMemo(() => {
    const items: MediaItem[] = []
    if (data.introductionVideo) items.push(data.introductionVideo)
    items.push(...data.recentDeliveries)
    items.push(...data.behindScenes)
    items.push(...data.photos)
    items.push(...data.press)
    return items.sort((a, b) => b.date.getTime() - a.date.getTime())
  }, [data])

  // Filter media by type
  const filteredMedia = React.useMemo(() => {
    if (activeTab === "all") return allMedia
    if (activeTab === "videos") {
      return allMedia.filter(m => m.type === "video")
    }
    if (activeTab === "photos") {
      return allMedia.filter(m => m.type === "photo")
    }
    if (activeTab === "behind") {
      return data.behindScenes
    }
    if (activeTab === "press") {
      return data.press
    }
    return allMedia
  }, [activeTab, allMedia, data])

  const visibleMedia = filteredMedia.slice(0, visibleItems)
  const hasMore = visibleItems < filteredMedia.length

  const handleMediaClick = (media: MediaItem) => {
    setSelectedMedia(media)
    setViewerOpen(true)
    onMediaClick?.(media)
  }

  const handleLoadMore = () => {
    setLoading(true)
    setTimeout(() => {
      setVisibleItems(prev => prev + 12)
      setLoading(false)
    }, 500)
  }

  const currentIndex = selectedMedia 
    ? filteredMedia.findIndex(m => m.id === selectedMedia.id)
    : -1

  const handleNext = () => {
    if (currentIndex < filteredMedia.length - 1) {
      setSelectedMedia(filteredMedia[currentIndex + 1])
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setSelectedMedia(filteredMedia[currentIndex - 1])
    }
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold">Media Gallery</h2>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <LayoutList className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">
            All ({allMedia.length})
          </TabsTrigger>
          <TabsTrigger value="videos">
            <Film className="h-4 w-4 mr-2" />
            Videos ({allMedia.filter(m => m.type === "video").length})
          </TabsTrigger>
          <TabsTrigger value="photos">
            <Camera className="h-4 w-4 mr-2" />
            Photos ({data.photos.length})
          </TabsTrigger>
          <TabsTrigger value="behind">
            <Sparkles className="h-4 w-4 mr-2" />
            Behind Scenes ({data.behindScenes.length})
          </TabsTrigger>
          <TabsTrigger value="press">
            <Newspaper className="h-4 w-4 mr-2" />
            Press ({data.press.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Introduction Video (Featured) */}
          {activeTab === "all" && data.introductionVideo && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Introduction Video</h3>
              <div className="max-w-3xl">
                <VideoPreview
                  media={data.introductionVideo}
                  featured
                  onPlay={() => handleMediaClick(data.introductionVideo!)}
                  autoPlay
                />
              </div>
            </div>
          )}

          {/* Media Grid/List */}
          {viewMode === "grid" ? (
            <div className={cn(
              "grid gap-4",
              activeTab === "press" 
                ? "grid-cols-1 md:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            )}>
              {visibleMedia.map((media, index) => {
                // First video in grid is featured (2x size)
                const isFeatured = activeTab === "all" && index === 0 && media.type === "video"
                
                if (media.type === "press") {
                  return (
                    <PressItem
                      key={media.id}
                      media={media}
                      onClick={() => handleMediaClick(media)}
                    />
                  )
                }
                
                if (media.type === "photo") {
                  return (
                    <PhotoItem
                      key={media.id}
                      media={media}
                      onClick={() => handleMediaClick(media)}
                    />
                  )
                }
                
                return (
                  <VideoPreview
                    key={media.id}
                    media={media}
                    featured={isFeatured}
                    onPlay={() => handleMediaClick(media)}
                    autoPlay={index < 3}
                  />
                )
              })}
            </div>
          ) : (
            <div className="space-y-4">
              {visibleMedia.map(media => (
                <Card 
                  key={media.id}
                  className="cursor-pointer hover:shadow-lg transition"
                  onClick={() => handleMediaClick(media)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* Thumbnail */}
                      <div className="relative w-32 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {media.type === "video" ? (
                          <div className="relative w-full h-full">
                            <Image
                              src={media.thumbnail}
                              alt={media.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Play className="h-8 w-8 text-white drop-shadow-lg" />
                            </div>
                          </div>
                        ) : (
                          <Image
                            src={media.thumbnail}
                            alt={media.title}
                            fill
                            className="object-cover"
                          />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-medium line-clamp-1">{media.title}</h4>
                            {media.description && (
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                {media.description}
                              </p>
                            )}
                          </div>
                          {media.featured && (
                            <Badge className="bg-purple-600 flex-shrink-0">
                              Featured
                            </Badge>
                          )}
                        </div>

                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {media.date.toLocaleDateString()}
                          </span>
                          {media.views && (
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {media.views.toLocaleString()} views
                            </span>
                          )}
                          {media.duration && (
                            <span>
                              {Math.floor(media.duration / 60)}:{(media.duration % 60).toString().padStart(2, '0')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Load More */}
          {hasMore && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={handleLoadMore}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    Load More
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Empty State */}
          {visibleMedia.length === 0 && (
            <Card>
              <CardContent className="py-12 text-center">
                <Film className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No media available in this category</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Fullscreen Viewer */}
      <MediaViewer
        media={selectedMedia}
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        onNext={handleNext}
        onPrevious={handlePrevious}
        hasNext={currentIndex < filteredMedia.length - 1}
        hasPrevious={currentIndex > 0}
      />
    </div>
  )
}