"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ExternalLink,
  Play,
  Newspaper,
  Radio,
  Tv,
  Globe,
  Quote,
  Award,
  Calendar,
  ChevronRight,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export interface MediaItem {
  id: string
  type: "article" | "video" | "podcast" | "interview" | "award"
  title: string
  outlet: string
  outletLogo?: string
  date: Date
  url?: string
  excerpt?: string
  thumbnail?: string
  featured?: boolean
}

interface MediaCoverageProps {
  items: MediaItem[]
  variant?: "grid" | "list" | "carousel" | "compact"
  showAll?: boolean
  maxDisplay?: number
  className?: string
}

// Get icon for media type
function getMediaIcon(type: MediaItem["type"]) {
  switch (type) {
    case "article":
      return Newspaper
    case "video":
      return Tv
    case "podcast":
      return Radio
    case "interview":
      return Quote
    case "award":
      return Award
    default:
      return Globe
  }
}

// Individual media card
function MediaCard({ 
  item,
  variant = "default"
}: { 
  item: MediaItem
  variant?: "default" | "compact"
}) {
  const Icon = getMediaIcon(item.type)

  if (variant === "compact") {
    return (
      <motion.a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition group"
      >
        <div className="flex-shrink-0">
          <Icon className="h-5 w-5 text-gray-500" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{item.title}</p>
          <p className="text-xs text-gray-500">{item.outlet}</p>
        </div>
        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition flex-shrink-0" />
      </motion.a>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        {item.thumbnail && (
          <div className="relative aspect-video overflow-hidden rounded-t-lg">
            <Image
              src={item.thumbnail}
              alt={item.title}
              fill
              className="object-cover"
            />
            {item.type === "video" && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="p-3 bg-white/90 rounded-full">
                  <Play className="h-6 w-6 text-black fill-current" />
                </div>
              </div>
            )}
            {item.featured && (
              <Badge className="absolute top-2 right-2 bg-yellow-500">
                <Sparkles className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>
        )}
        
        <CardContent className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <Icon className="h-4 w-4 text-gray-500" />
              <Badge variant="secondary" className="text-xs">
                {item.type}
              </Badge>
            </div>
            <span className="text-xs text-gray-500">
              {new Date(item.date).toLocaleDateString()}
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="font-medium text-sm line-clamp-2">{item.title}</h4>
            <p className="text-xs text-gray-500 font-medium">{item.outlet}</p>
          </div>

          {item.excerpt && (
            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">
              {item.excerpt}
            </p>
          )}

          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium"
            >
              View Coverage
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Media outlet logos bar
function MediaOutlets({ 
  items 
}: { 
  items: MediaItem[] 
}) {
  const uniqueOutlets = Array.from(new Set(items.map(item => item.outlet)))

  return (
    <div className="flex items-center gap-6 overflow-x-auto py-2">
      <span className="text-xs text-gray-500 whitespace-nowrap">As seen in:</span>
      {uniqueOutlets.slice(0, 6).map((outlet) => (
        <div
          key={outlet}
          className="text-sm font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap"
        >
          {outlet}
        </div>
      ))}
      {uniqueOutlets.length > 6 && (
        <span className="text-xs text-gray-400">+{uniqueOutlets.length - 6} more</span>
      )}
    </div>
  )
}

// Grid layout
function MediaGrid({ 
  items,
  maxDisplay = 6
}: { 
  items: MediaItem[]
  maxDisplay?: number
}) {
  const displayItems = items.slice(0, maxDisplay)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {displayItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <MediaCard item={item} />
        </motion.div>
      ))}
    </div>
  )
}

// List layout
function MediaList({ 
  items,
  maxDisplay = 5
}: { 
  items: MediaItem[]
  maxDisplay?: number
}) {
  const displayItems = items.slice(0, maxDisplay)

  return (
    <div className="space-y-3">
      {displayItems.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <MediaCard item={item} variant="compact" />
        </motion.div>
      ))}
    </div>
  )
}

// Carousel layout
function MediaCarousel({ 
  items 
}: { 
  items: MediaItem[] 
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const currentItem = items[currentIndex]

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
        >
          <MediaCard item={currentItem} />
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-center gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "h-2 w-2 rounded-full transition",
              index === currentIndex
                ? "bg-purple-600 w-6"
                : "bg-gray-300 dark:bg-gray-600"
            )}
          />
        ))}
      </div>
    </div>
  )
}

// Main component
export function MediaCoverage({
  items,
  variant = "grid",
  showAll = false,
  maxDisplay = 6,
  className
}: MediaCoverageProps) {
  const [expanded, setExpanded] = React.useState(showAll)
  const hasMore = items.length > maxDisplay

  if (items.length === 0) {
    return null
  }

  return (
    <div className={cn("space-y-4", className)}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Media Coverage
            </CardTitle>
            {items.some(i => i.featured) && (
              <Badge variant="secondary">
                <Award className="h-3 w-3 mr-1" />
                Featured Creator
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Media outlets bar */}
          <MediaOutlets items={items} />

          {/* Media items */}
          {variant === "grid" && (
            <MediaGrid 
              items={expanded ? items : items.slice(0, maxDisplay)} 
              maxDisplay={expanded ? items.length : maxDisplay}
            />
          )}
          
          {variant === "list" && (
            <MediaList 
              items={expanded ? items : items.slice(0, maxDisplay)}
              maxDisplay={expanded ? items.length : maxDisplay}
            />
          )}
          
          {variant === "carousel" && (
            <MediaCarousel items={items} />
          )}

          {variant === "compact" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(expanded ? items : items.slice(0, 4)).map((item) => (
                <MediaCard key={item.id} item={item} variant="compact" />
              ))}
            </div>
          )}

          {/* Show more/less */}
          {hasMore && variant !== "carousel" && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="gap-2"
              >
                {expanded ? "Show Less" : `Show All (${items.length})`}
                <ChevronRight className={cn(
                  "h-4 w-4 transition",
                  expanded && "rotate-90"
                )} />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Compact media badge for profiles
export function MediaBadge({ 
  count 
}: { 
  count: number 
}) {
  if (count === 0) return null

  return (
    <Badge variant="outline" className="gap-1">
      <Globe className="h-3 w-3" />
      {count} Media {count === 1 ? "Feature" : "Features"}
    </Badge>
  )
}