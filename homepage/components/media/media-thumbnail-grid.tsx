"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Play,
  Camera,
  Film,
  Grid3X3,
  Eye,
  Heart,
  MoreHorizontal,
  Download,
  Share2,
  Info
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import Image from "next/image"

export interface ThumbnailMedia {
  id: string
  type: "video" | "photo"
  title: string
  thumbnail: string
  duration?: number
  views?: number
  likes?: number
  date?: Date
  size?: "small" | "medium" | "large" | "featured"
}

interface MediaThumbnailGridProps {
  items: ThumbnailMedia[]
  columns?: 2 | 3 | 4 | 5 | 6
  gap?: "tight" | "normal" | "relaxed"
  showStats?: boolean
  showActions?: boolean
  onItemClick?: (item: ThumbnailMedia) => void
  onItemAction?: (action: string, item: ThumbnailMedia) => void
  className?: string
}

export function MediaThumbnailGrid({
  items,
  columns = 3,
  gap = "normal",
  showStats = true,
  showActions = false,
  onItemClick,
  onItemAction,
  className
}: MediaThumbnailGridProps) {
  const gapClasses = {
    tight: "gap-2",
    normal: "gap-4",
    relaxed: "gap-6"
  }

  const gridClasses = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 sm:grid-cols-4 lg:grid-cols-6"
  }

  return (
    <div className={cn(
      "grid",
      gridClasses[columns],
      gapClasses[gap],
      className
    )}>
      {items.map((item, index) => (
        <ThumbnailItem
          key={item.id}
          item={item}
          index={index}
          showStats={showStats}
          showActions={showActions}
          onItemClick={onItemClick}
          onItemAction={onItemAction}
        />
      ))}
    </div>
  )
}

// Individual thumbnail item
function ThumbnailItem({
  item,
  index,
  showStats,
  showActions,
  onItemClick,
  onItemAction
}: {
  item: ThumbnailMedia
  index: number
  showStats: boolean
  showActions: boolean
  onItemClick?: (item: ThumbnailMedia) => void
  onItemAction?: (action: string, item: ThumbnailMedia) => void
}) {
  const [imageLoaded, setImageLoaded] = React.useState(false)
  const [isHovered, setIsHovered] = React.useState(false)

  const sizeClasses = {
    small: "aspect-square",
    medium: "aspect-video",
    large: "aspect-[4/3]",
    featured: "aspect-video md:col-span-2 md:row-span-2"
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`
    }
    return views.toString()
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className={cn(
        "relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100",
        sizeClasses[item.size || "medium"]
      )}
      onClick={() => onItemClick?.(item)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail Image */}
      <div className="absolute inset-0">
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          className={cn(
            "object-cover transition-all duration-300",
            imageLoaded ? "opacity-100" : "opacity-0",
            isHovered && "scale-110"
          )}
          onLoad={() => setImageLoaded(true)}
        />
      </div>

      {/* Type Icon */}
      <div className="absolute top-2 left-2 p-1.5 bg-black/50 rounded-full">
        {item.type === "video" ? (
          <Film className="h-3 w-3 text-white" />
        ) : (
          <Camera className="h-3 w-3 text-white" />
        )}
      </div>

      {/* Actions Menu */}
      {showActions && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="h-4 w-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onItemAction?.("download", item)}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onItemAction?.("share", item)}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onItemAction?.("info", item)}>
                <Info className="h-4 w-4 mr-2" />
                Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onItemAction?.("like", item)}>
                <Heart className="h-4 w-4 mr-2" />
                Like
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )}

      {/* Video Duration */}
      {item.type === "video" && item.duration && (
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/70 rounded text-xs text-white font-medium">
          {formatDuration(item.duration)}
        </div>
      )}

      {/* Play Button (Video) */}
      {item.type === "video" && (
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
          <div className="p-3 bg-white/90 rounded-full transform group-hover:scale-110 transition">
            <Play className="h-6 w-6 text-black fill-current" />
          </div>
        </div>
      )}

      {/* Hover Overlay with Info */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent",
        "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      )}>
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <p className="text-white font-medium text-sm line-clamp-1">
                  {item.title}
                </p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.title}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {showStats && (item.views || item.likes) && (
            <div className="flex items-center gap-3 mt-1">
              {item.views && (
                <span className="text-xs text-white/80 flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  {formatViews(item.views)}
                </span>
              )}
              {item.likes && (
                <span className="text-xs text-white/80 flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  {formatViews(item.likes)}
                </span>
              )}
            </div>
          )}

          {item.date && (
            <p className="text-xs text-white/60 mt-1">
              {item.date.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// Masonry layout variant
export function MediaMasonryGrid({
  items,
  onItemClick,
  className
}: {
  items: ThumbnailMedia[]
  onItemClick?: (item: ThumbnailMedia) => void
  className?: string
}) {
  return (
    <div className={cn(
      "columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4",
      className
    )}>
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="break-inside-avoid mb-4"
        >
          <div
            className="relative group cursor-pointer overflow-hidden rounded-lg bg-gray-100"
            onClick={() => onItemClick?.(item)}
          >
            <Image
              src={item.thumbnail}
              alt={item.title}
              width={400}
              height={item.type === "video" ? 225 : 400}
              className="w-full h-auto"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
              {item.type === "video" ? (
                <Play className="h-12 w-12 text-white fill-current" />
              ) : (
                <Eye className="h-12 w-12 text-white" />
              )}
            </div>

            {/* Info Badge */}
            <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {item.type === "video" ? "Video" : "Photo"}
              </Badge>
              
              {item.duration && (
                <Badge variant="secondary" className="text-xs">
                  {Math.floor(item.duration / 60)}:{(item.duration % 60).toString().padStart(2, '0')}
                </Badge>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}