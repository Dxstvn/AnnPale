"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Grid3X3,
  List,
  LayoutGrid,
  ArrowUpDown,
  Filter,
  X,
  Eye,
  Check
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { 
  EnhancedCreatorCard, 
  CreatorCardSkeleton,
  type EnhancedCreator 
} from "./enhanced-creator-card"
import { useInView } from "react-intersection-observer"

export type ViewMode = "grid" | "list" | "compact"
export type GridColumns = "1" | "2" | "3" | "4" | "auto"

interface CreatorGridProps {
  creators: EnhancedCreator[]
  viewMode?: ViewMode
  columns?: GridColumns
  gap?: "tight" | "normal" | "wide"
  isLoading?: boolean
  loadingCount?: number
  onCreatorClick?: (creator: EnhancedCreator) => void
  onFavorite?: (id: string) => void
  onShare?: (creator: EnhancedCreator) => void
  onQuickBook?: (id: string) => void
  favorites?: string[]
  compareMode?: boolean
  compareList?: string[]
  onCompare?: (id: string) => void
  onClearCompare?: () => void
  infiniteScroll?: boolean
  onLoadMore?: () => void
  hasMore?: boolean
  className?: string
  emptyState?: React.ReactNode
  priority?: number // Number of cards to load with priority
}

// Responsive grid column classes
const getGridClasses = (columns: GridColumns, viewMode: ViewMode) => {
  if (viewMode === "list") return "grid grid-cols-1"
  if (viewMode === "compact") return "grid grid-cols-1 md:grid-cols-2"
  
  switch (columns) {
    case "1":
      return "grid grid-cols-1"
    case "2":
      return "grid grid-cols-1 sm:grid-cols-2"
    case "3":
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
    case "4":
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    case "auto":
    default:
      // Auto responsive based on container
      return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5"
  }
}

const getGapClasses = (gap: "tight" | "normal" | "wide") => {
  switch (gap) {
    case "tight":
      return "gap-2 sm:gap-3"
    case "wide":
      return "gap-6 sm:gap-8"
    case "normal":
    default:
      return "gap-4 sm:gap-6"
  }
}

// Comparison bar component
function ComparisonBar({ 
  compareList,
  creators,
  onClearCompare,
  onCompareNow
}: {
  compareList: string[]
  creators: EnhancedCreator[]
  onClearCompare: () => void
  onCompareNow: () => void
}) {
  const selectedCreators = creators.filter(c => compareList.includes(c.id))
  
  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      exit={{ y: 100 }}
      className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t shadow-2xl z-40"
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              <span className="font-medium">
                Comparing {compareList.length} creators
              </span>
            </div>
            <div className="flex -space-x-2">
              {selectedCreators.slice(0, 5).map((creator) => (
                <img
                  key={creator.id}
                  src={creator.avatar}
                  alt={creator.name}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-900"
                />
              ))}
              {compareList.length > 5 && (
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                  <span className="text-xs font-medium">
                    +{compareList.length - 5}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClearCompare}>
              Clear
            </Button>
            <Button 
              onClick={onCompareNow}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              Compare Now
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export function CreatorGrid({
  creators,
  viewMode = "grid",
  columns = "auto",
  gap = "normal",
  isLoading = false,
  loadingCount = 12,
  onCreatorClick,
  onFavorite,
  onShare,
  onQuickBook,
  favorites = [],
  compareMode = false,
  compareList = [],
  onCompare,
  onClearCompare,
  infiniteScroll = false,
  onLoadMore,
  hasMore = false,
  className,
  emptyState,
  priority = 4
}: CreatorGridProps) {
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: false,
  })

  // Load more when scrolling to bottom
  React.useEffect(() => {
    if (inView && !isLoading && hasMore && onLoadMore) {
      onLoadMore()
    }
  }, [inView, isLoading, hasMore, onLoadMore])

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  }

  // Handle empty state
  if (!isLoading && creators.length === 0 && emptyState) {
    return <div className={className}>{emptyState}</div>
  }

  return (
    <>
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className={cn(
          getGridClasses(columns, viewMode),
          getGapClasses(gap),
          className
        )}
      >
        {/* Loading skeletons */}
        {isLoading && !creators.length && (
          <>
            {Array.from({ length: loadingCount }).map((_, index) => (
              <motion.div key={`skeleton-${index}`} variants={item}>
                <CreatorCardSkeleton variant={viewMode === "list" ? "list" : viewMode === "compact" ? "compact" : "default"} />
              </motion.div>
            ))}
          </>
        )}

        {/* Creator cards */}
        {creators.map((creator, index) => (
          <motion.div
            key={creator.id}
            variants={item}
            layout
            onClick={() => onCreatorClick?.(creator)}
          >
            <EnhancedCreatorCard
              creator={creator}
              variant={viewMode === "list" ? "list" : viewMode === "compact" ? "compact" : "default"}
              interactive={!compareMode}
              onFavorite={onFavorite}
              onShare={onShare}
              onQuickBook={onQuickBook}
              isFavorited={favorites.includes(creator.id)}
              isComparing={compareList.includes(creator.id)}
              onCompare={onCompare}
              priority={index < priority}
            />
          </motion.div>
        ))}

        {/* Load more trigger for infinite scroll */}
        {infiniteScroll && hasMore && (
          <div ref={loadMoreRef} className="col-span-full py-8">
            {isLoading ? (
              <div className="flex justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <ArrowUpDown className="h-6 w-6 text-gray-400" />
                </motion.div>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                Scroll for more...
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Comparison bar */}
      <AnimatePresence>
        {compareMode && compareList.length > 0 && onClearCompare && (
          <ComparisonBar
            compareList={compareList}
            creators={creators}
            onClearCompare={onClearCompare}
            onCompareNow={() => {
              // Handle comparison logic
              console.log("Comparing:", compareList)
            }}
          />
        )}
      </AnimatePresence>
    </>
  )
}

// Grid controls component
export function GridControls({
  viewMode,
  onViewModeChange,
  columns,
  onColumnsChange,
  sortBy,
  onSortChange,
  totalResults,
  showingResults,
  className
}: {
  viewMode: ViewMode
  onViewModeChange: (mode: ViewMode) => void
  columns?: GridColumns
  onColumnsChange?: (columns: GridColumns) => void
  sortBy?: string
  onSortChange?: (sort: string) => void
  totalResults?: number
  showingResults?: number
  className?: string
}) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      {/* Results count */}
      {totalResults !== undefined && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Showing {showingResults || totalResults} of {totalResults} creators
        </div>
      )}

      <div className="flex items-center gap-3">
        {/* Sort dropdown */}
        {sortBy && onSortChange && (
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-[180px]">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="reviews">Most Reviews</SelectItem>
              <SelectItem value="response">Fastest Response</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Column selector */}
        {columns && onColumnsChange && viewMode === "grid" && (
          <Select value={columns} onValueChange={onColumnsChange}>
            <SelectTrigger className="w-[140px]">
              <Grid3X3 className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Columns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="2">2 Columns</SelectItem>
              <SelectItem value="3">3 Columns</SelectItem>
              <SelectItem value="4">4 Columns</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* View mode toggle */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "p-2 rounded transition",
              viewMode === "grid"
                ? "bg-white dark:bg-gray-900 shadow-sm"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
            aria-label="Grid view"
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange("list")}
            className={cn(
              "p-2 rounded transition",
              viewMode === "list"
                ? "bg-white dark:bg-gray-900 shadow-sm"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            onClick={() => onViewModeChange("compact")}
            className={cn(
              "p-2 rounded transition",
              viewMode === "compact"
                ? "bg-white dark:bg-gray-900 shadow-sm"
                : "hover:bg-gray-200 dark:hover:bg-gray-700"
            )}
            aria-label="Compact view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreatorGrid
