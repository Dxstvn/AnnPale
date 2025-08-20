"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Play,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Video,
  Heart,
  Share2,
  Maximize2,
  Volume2,
  VolumeX,
  X,
  Download
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion"
import { useIsMobile } from "@/hooks/use-media-query"
import type { MediaItem } from "@/components/media/media-gallery"

interface MobileGalleryCarouselProps {
  items: MediaItem[]
  title?: string
  onItemClick?: (item: MediaItem) => void
  className?: string
}

// Swipe threshold
const SWIPE_THRESHOLD = 50

// Single media slide
function MediaSlide({
  item,
  isActive,
  onLike,
  onShare,
  onExpand
}: {
  item: MediaItem
  isActive: boolean
  onLike: () => void
  onShare: () => void
  onExpand: () => void
}) {
  const [isVideoPlaying, setIsVideoPlaying] = React.useState(false)
  const [isMuted, setIsMuted] = React.useState(true)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  
  React.useEffect(() => {
    if (!isActive && videoRef.current) {
      videoRef.current.pause()
      setIsVideoPlaying(false)
    }
  }, [isActive])
  
  const handleVideoToggle = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }
  
  return (
    <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
      {item.type === "video" ? (
        <>
          <video
            ref={videoRef}
            src={item.url}
            poster={item.thumbnail}
            muted={isMuted}
            loop
            playsInline
            className="w-full h-full object-cover"
            onClick={handleVideoToggle}
          />
          
          {/* Video controls overlay */}
          <div className="absolute inset-0 pointer-events-none">
            {/* Play/Pause button */}
            {!isVideoPlaying && (
              <button
                onClick={handleVideoToggle}
                className="absolute inset-0 flex items-center justify-center pointer-events-auto"
              >
                <div className="h-16 w-16 bg-white/90 rounded-full flex items-center justify-center">
                  <Play className="h-8 w-8 text-gray-900 ml-1" />
                </div>
              </button>
            )}
            
            {/* Top controls */}
            <div className="absolute top-2 left-2 right-2 flex justify-between pointer-events-auto">
              <Badge className="bg-black/50 text-white">
                <Video className="h-3 w-3 mr-1" />
                {item.duration}
              </Badge>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="h-8 w-8 bg-black/50 rounded-full flex items-center justify-center text-white"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <img
            src={item.thumbnail || item.url}
            alt={item.title}
            className="w-full h-full object-cover"
          />
          {/* Image badge */}
          <div className="absolute top-2 left-2">
            <Badge className="bg-black/50 text-white">
              <ImageIcon className="h-3 w-3 mr-1" />
              Photo
            </Badge>
          </div>
        </>
      )}
      
      {/* Bottom action bar */}
      <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent pointer-events-auto">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h3 className="text-white font-medium text-sm truncate">
              {item.title}
            </h3>
            {item.views && (
              <p className="text-white/70 text-xs">
                {item.views.toLocaleString()} views
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onLike}
              className="h-8 w-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30"
            >
              <Heart className="h-4 w-4" />
            </button>
            <button
              onClick={onShare}
              className="h-8 w-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={onExpand}
              className="h-8 w-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/30"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      
      {/* Featured badge */}
      {item.featured && (
        <div className="absolute top-2 right-2">
          <Badge className="bg-yellow-500 text-white">
            Featured
          </Badge>
        </div>
      )}
    </div>
  )
}

// Thumbnail strip for navigation
function ThumbnailStrip({
  items,
  currentIndex,
  onSelect
}: {
  items: MediaItem[]
  currentIndex: number
  onSelect: (index: number) => void
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null)
  
  React.useEffect(() => {
    if (scrollRef.current) {
      const thumbnail = scrollRef.current.children[currentIndex] as HTMLElement
      if (thumbnail) {
        thumbnail.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
      }
    }
  }, [currentIndex])
  
  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide py-2"
      >
        {items.map((item, index) => (
          <button
            key={item.id}
            onClick={() => onSelect(index)}
            className={cn(
              "relative flex-shrink-0 w-20 h-14 rounded overflow-hidden transition-all",
              currentIndex === index
                ? "ring-2 ring-purple-600 scale-105"
                : "opacity-60"
            )}
          >
            <img
              src={item.thumbnail || item.url}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <Play className="h-4 w-4 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// Fullscreen viewer
function FullscreenViewer({
  item,
  onClose
}: {
  item: MediaItem
  onClose: () => void
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 h-10 w-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white"
      >
        <X className="h-5 w-5" />
      </button>
      
      <button
        onClick={(e) => {
          e.stopPropagation()
          // Download logic here
        }}
        className="absolute top-4 left-4 h-10 w-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white"
      >
        <Download className="h-5 w-5" />
      </button>
      
      {item.type === "video" ? (
        <video
          src={item.url}
          controls
          autoPlay
          className="max-w-full max-h-full"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <img
          src={item.url}
          alt={item.title}
          className="max-w-full max-h-full"
          onClick={(e) => e.stopPropagation()}
        />
      )}
    </motion.div>
  )
}

// Main mobile gallery carousel component
export function MobileGalleryCarousel({
  items,
  title = "Media Gallery",
  onItemClick,
  className
}: MobileGalleryCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [fullscreenItem, setFullscreenItem] = React.useState<MediaItem | null>(null)
  const [direction, setDirection] = React.useState(0)
  const isMobile = useIsMobile()
  
  const x = useMotionValue(0)
  const scale = useTransform(x, [-200, 0, 200], [0.85, 1, 0.85])
  const opacity = useTransform(x, [-200, 0, 200], [0.5, 1, 0.5])
  
  if (!isMobile || items.length === 0) {
    return null
  }
  
  const currentItem = items[currentIndex]
  
  const handleDragEnd = (event: any, info: PanInfo) => {
    const swipeThreshold = SWIPE_THRESHOLD
    
    if (info.offset.x > swipeThreshold && currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex(currentIndex - 1)
    } else if (info.offset.x < -swipeThreshold && currentIndex < items.length - 1) {
      setDirection(1)
      setCurrentIndex(currentIndex + 1)
    }
  }
  
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setDirection(-1)
      setCurrentIndex(currentIndex - 1)
    }
  }
  
  const goToNext = () => {
    if (currentIndex < items.length - 1) {
      setDirection(1)
      setCurrentIndex(currentIndex + 1)
    }
  }
  
  return (
    <div className={cn("space-y-3", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        <Badge variant="secondary">
          {currentIndex + 1} / {items.length}
        </Badge>
      </div>
      
      {/* Main carousel */}
      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={currentIndex}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ x, scale, opacity }}
            initial={{ x: direction > 0 ? 300 : -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? -300 : 300, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <MediaSlide
              item={currentItem}
              isActive={true}
              onLike={() => console.log("Liked:", currentItem.id)}
              onShare={() => {
                if (onItemClick) onItemClick(currentItem)
              }}
              onExpand={() => setFullscreenItem(currentItem)}
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation arrows (optional on mobile, hidden by default) */}
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className={cn(
            "absolute left-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg transition-opacity",
            currentIndex === 0 ? "opacity-0 pointer-events-none" : ""
          )}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={goToNext}
          disabled={currentIndex === items.length - 1}
          className={cn(
            "absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 bg-white/80 backdrop-blur rounded-full flex items-center justify-center shadow-lg transition-opacity",
            currentIndex === items.length - 1 ? "opacity-0 pointer-events-none" : ""
          )}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      
      {/* Dot indicators */}
      <div className="flex justify-center gap-1.5">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1)
              setCurrentIndex(index)
            }}
            className={cn(
              "h-2 transition-all rounded-full",
              index === currentIndex
                ? "w-6 bg-purple-600"
                : "w-2 bg-gray-300 dark:bg-gray-600"
            )}
          />
        ))}
      </div>
      
      {/* Thumbnail strip */}
      <ThumbnailStrip
        items={items}
        currentIndex={currentIndex}
        onSelect={(index) => {
          setDirection(index > currentIndex ? 1 : -1)
          setCurrentIndex(index)
        }}
      />
      
      {/* Fullscreen viewer */}
      <AnimatePresence>
        {fullscreenItem && (
          <FullscreenViewer
            item={fullscreenItem}
            onClose={() => setFullscreenItem(null)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}