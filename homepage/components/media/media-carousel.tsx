"use client"

import * as React from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Eye,
  Heart
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

export interface CarouselMedia {
  id: string
  type: "video" | "photo"
  title: string
  thumbnail: string
  url: string
  duration?: number
  views?: number
  featured?: boolean
}

interface MediaCarouselProps {
  items: CarouselMedia[]
  title?: string
  autoPlay?: boolean
  showControls?: boolean
  onItemClick?: (item: CarouselMedia) => void
  className?: string
}

export function MediaCarousel({
  items,
  title,
  autoPlay = true,
  showControls = true,
  onItemClick,
  className
}: MediaCarouselProps) {
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const [isPlaying, setIsPlaying] = React.useState(autoPlay)
  
  const autoplayPlugin = React.useRef(
    Autoplay({ 
      delay: 5000, 
      stopOnInteraction: true,
      stopOnMouseEnter: true
    })
  )

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true,
      align: "start",
      skipSnaps: false,
      containScroll: "trimSnaps"
    },
    autoPlay ? [autoplayPlugin.current] : []
  )

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = React.useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index)
  }, [emblaApi])

  const onSelect = React.useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  React.useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  React.useEffect(() => {
    if (!autoplayPlugin.current) return
    
    if (isPlaying) {
      autoplayPlugin.current.play()
    } else {
      autoplayPlugin.current.stop()
    }
  }, [isPlaying])

  if (items.length === 0) return null

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">{title}</h3>
          
          {showControls && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsPlaying(!isPlaying)}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={scrollPrev}
                disabled={!emblaApi?.canScrollPrev()}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={scrollNext}
                disabled={!emblaApi?.canScrollNext()}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Carousel */}
      <div className="relative">
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
              >
                <CarouselItem
                  item={item}
                  isActive={index === selectedIndex}
                  onClick={() => onItemClick?.(item)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons (Large) */}
        {showControls && items.length > 3 && (
          <>
            <button
              onClick={scrollPrev}
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2",
                "p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg",
                "hover:bg-gray-100 dark:hover:bg-gray-700 transition",
                "hidden lg:flex items-center justify-center"
              )}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <button
              onClick={scrollNext}
              className={cn(
                "absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2",
                "p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg",
                "hover:bg-gray-100 dark:hover:bg-gray-700 transition",
                "hidden lg:flex items-center justify-center"
              )}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Dots Indicator */}
      {items.length > 1 && (
        <div className="flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                index === selectedIndex
                  ? "w-8 bg-purple-600"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400"
              )}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Individual carousel item
function CarouselItem({
  item,
  isActive,
  onClick
}: {
  item: CarouselMedia
  isActive: boolean
  onClick: () => void
}) {
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const [isHovered, setIsHovered] = React.useState(false)

  // Auto-play video preview on hover
  React.useEffect(() => {
    if (item.type === "video" && videoRef.current) {
      if (isHovered) {
        videoRef.current.play().catch(() => {})
      } else {
        videoRef.current.pause()
        videoRef.current.currentTime = 0
      }
    }
  }, [isHovered, item.type])

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      animate={{ opacity: isActive ? 1 : 0.8 }}
      className="relative cursor-pointer group"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden">
        <div className="relative aspect-video bg-gray-100">
          {item.type === "video" ? (
            <>
              <video
                ref={videoRef}
                src={item.url}
                poster={item.thumbnail}
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Play Button Overlay */}
              {!isHovered && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="p-3 bg-white/90 rounded-full">
                    <Play className="h-6 w-6 text-black fill-current" />
                  </div>
                </div>
              )}

              {/* Duration */}
              {item.duration && (
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
                  {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                </div>
              )}
            </>
          ) : (
            <Image
              src={item.thumbnail}
              alt={item.title}
              fill
              className="object-cover"
            />
          )}

          {/* Featured Badge */}
          {item.featured && (
            <Badge className="absolute top-2 left-2 bg-purple-600">
              Featured
            </Badge>
          )}

          {/* Hover Overlay */}
          <div className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent",
            "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          )} />

          {/* Title & Stats */}
          <div className={cn(
            "absolute bottom-0 left-0 right-0 p-4",
            "transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"
          )}>
            <p className="text-white font-medium line-clamp-1">{item.title}</p>
            {item.views && (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-white/80 flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {item.views.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}