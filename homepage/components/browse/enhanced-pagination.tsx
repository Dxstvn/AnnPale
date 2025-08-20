"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
  ArrowDown,
  MoreHorizontal,
  Eye,
  RefreshCw,
  Settings,
  Layers
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useInView } from "react-intersection-observer"

export type PaginationMode = "infinite" | "load-more" | "traditional" | "hybrid"

interface PaginationConfig {
  mode: PaginationMode
  pageSize: number
  threshold: number // px from bottom to trigger load
  maxItemsInDOM: number // for virtual scrolling
  enablePrefetch: boolean
  enableVirtualScroll: boolean
  showLoadingIndicator: boolean
  showItemCount: boolean
  showPageInfo: boolean
}

const defaultConfig: PaginationConfig = {
  mode: "hybrid",
  pageSize: 12,
  threshold: 200,
  maxItemsInDOM: 100,
  enablePrefetch: true,
  enableVirtualScroll: true,
  showLoadingIndicator: true,
  showItemCount: true,
  showPageInfo: true
}

interface EnhancedPaginationProps {
  mode?: PaginationMode
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage?: number
  isLoading?: boolean
  hasMore?: boolean
  onPageChange: (page: number) => void
  onLoadMore?: () => void
  onItemsPerPageChange?: (count: number) => void
  className?: string
  config?: Partial<PaginationConfig>
  loadedItems?: number
  onReset?: () => void
}

export function EnhancedPagination({
  mode = "hybrid",
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage = 12,
  isLoading = false,
  hasMore = false,
  onPageChange,
  onLoadMore,
  onItemsPerPageChange,
  className,
  config = {},
  loadedItems = 0,
  onReset
}: EnhancedPaginationProps) {
  const finalConfig = { ...defaultConfig, ...config, mode }
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = []
    const maxVisible = 7
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push("...")
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push(1)
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }
    
    return pages
  }

  // Traditional pagination controls
  if (mode === "traditional") {
    return (
      <div className={cn("flex items-center justify-between", className)}>
        {/* Items info */}
        {finalConfig.showItemCount && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {(currentPage - 1) * itemsPerPage + 1}-
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
          </div>
        )}

        {/* Page controls */}
        <div className="flex items-center gap-2">
          {/* Items per page selector */}
          {onItemsPerPageChange && (
            <Select 
              value={itemsPerPage.toString()} 
              onValueChange={(value) => onItemsPerPageChange(parseInt(value))}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[12, 24, 48, 96].map((count) => (
                  <SelectItem key={count} value={count.toString()}>
                    {count} / page
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* First page */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          {/* Previous page */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-2">
                    <MoreHorizontal className="h-4 w-4 text-gray-400" />
                  </span>
                ) : (
                  <Button
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                    disabled={isLoading}
                    className={cn(
                      "h-8 min-w-[32px]",
                      currentPage === page && "bg-purple-600 hover:bg-purple-700"
                    )}
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next page */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Last page */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages || isLoading}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  // Load More button
  if (mode === "load-more") {
    return (
      <div className={cn("flex flex-col items-center gap-4", className)}>
        {finalConfig.showItemCount && loadedItems > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Showing {loadedItems} of {totalItems} items
          </div>
        )}
        
        {hasMore && (
          <Button
            onClick={onLoadMore}
            disabled={isLoading}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <ArrowDown className="mr-2 h-4 w-4" />
                Load More
              </>
            )}
          </Button>
        )}

        {!hasMore && loadedItems > 0 && (
          <div className="text-sm text-gray-500">
            You've reached the end • {totalItems} items total
          </div>
        )}
      </div>
    )
  }

  // Infinite scroll indicator
  if (mode === "infinite") {
    return (
      <InfiniteScrollIndicator
        isLoading={isLoading}
        hasMore={hasMore}
        loadedItems={loadedItems}
        totalItems={totalItems}
        showItemCount={finalConfig.showItemCount}
        className={className}
      />
    )
  }

  // Hybrid mode - combination of pagination and infinite scroll
  if (mode === "hybrid") {
    return (
      <HybridPagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        isLoading={isLoading}
        hasMore={hasMore}
        onPageChange={onPageChange}
        onLoadMore={onLoadMore}
        loadedItems={loadedItems}
        className={className}
        config={finalConfig}
      />
    )
  }

  return null
}

// Infinite scroll indicator component
function InfiniteScrollIndicator({
  isLoading,
  hasMore,
  loadedItems,
  totalItems,
  showItemCount,
  className
}: {
  isLoading?: boolean
  hasMore?: boolean
  loadedItems?: number
  totalItems?: number
  showItemCount?: boolean
  className?: string
}) {
  return (
    <div className={cn("flex flex-col items-center gap-4 py-8", className)}>
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3"
        >
          <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Loading more...
          </span>
        </motion.div>
      )}

      {!isLoading && hasMore && (
        <div className="text-sm text-gray-500">
          Scroll for more
        </div>
      )}

      {!hasMore && loadedItems && totalItems && (
        <div className="text-center space-y-2">
          <Badge variant="secondary" className="text-xs">
            End of results
          </Badge>
          {showItemCount && (
            <p className="text-sm text-gray-500">
              {totalItems} items total
            </p>
          )}
        </div>
      )}
    </div>
  )
}

// Hybrid pagination component
function HybridPagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  isLoading,
  hasMore,
  onPageChange,
  onLoadMore,
  loadedItems,
  className,
  config
}: any) {
  const [showPagination, setShowPagination] = React.useState(true)

  return (
    <div className={cn("space-y-4", className)}>
      {/* Toggle between modes */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {loadedItems ? `${loadedItems} of ${totalItems} items` : `${totalItems} items`}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPagination(!showPagination)}
          >
            <Layers className="h-4 w-4 mr-2" />
            {showPagination ? "Infinite Scroll" : "Pagination"}
          </Button>
        </div>
      </div>

      {/* Show either pagination or infinite scroll indicator */}
      {showPagination ? (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
          >
            Previous
          </Button>
          
          <span className="px-4 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      ) : (
        <InfiniteScrollIndicator
          isLoading={isLoading}
          hasMore={hasMore}
          loadedItems={loadedItems}
          totalItems={totalItems}
          showItemCount={false}
        />
      )}
    </div>
  )
}

// Virtual scrolling hook for memory management
export function useVirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  overscan = 3,
  maxItemsInDOM = 100
}: {
  items: T[]
  itemHeight: number
  containerHeight: number
  overscan?: number
  maxItemsInDOM?: number
}) {
  const [scrollTop, setScrollTop] = React.useState(0)
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )
  
  // Limit items in DOM
  const visibleItems = items.slice(
    startIndex,
    Math.min(endIndex, startIndex + maxItemsInDOM)
  )
  
  const totalHeight = items.length * itemHeight
  const offsetY = startIndex * itemHeight
  
  return {
    visibleItems,
    totalHeight,
    offsetY,
    onScroll: (e: React.UIEvent<HTMLDivElement>) => {
      setScrollTop(e.currentTarget.scrollTop)
    }
  }
}

// Pagination hook with state management
export function usePagination({
  totalItems,
  itemsPerPage = 12,
  mode = "hybrid",
  persistKey
}: {
  totalItems: number
  itemsPerPage?: number
  mode?: PaginationMode
  persistKey?: string
}) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [loadedItems, setLoadedItems] = React.useState(itemsPerPage)
  const [isLoading, setIsLoading] = React.useState(false)
  
  const totalPages = Math.ceil(totalItems / itemsPerPage)
  const hasMore = loadedItems < totalItems
  
  // Persist pagination state
  React.useEffect(() => {
    if (persistKey) {
      const saved = sessionStorage.getItem(`pagination-${persistKey}`)
      if (saved) {
        const { page, loaded } = JSON.parse(saved)
        setCurrentPage(page)
        setLoadedItems(loaded)
      }
    }
  }, [persistKey])
  
  React.useEffect(() => {
    if (persistKey) {
      sessionStorage.setItem(
        `pagination-${persistKey}`,
        JSON.stringify({ page: currentPage, loaded: loadedItems })
      )
    }
  }, [currentPage, loadedItems, persistKey])
  
  const loadMore = React.useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      setLoadedItems(prev => Math.min(prev + itemsPerPage, totalItems))
      setIsLoading(false)
    }, 500)
  }, [itemsPerPage, totalItems])
  
  const goToPage = React.useCallback((page: number) => {
    setCurrentPage(page)
    setLoadedItems(page * itemsPerPage)
  }, [itemsPerPage])
  
  const reset = React.useCallback(() => {
    setCurrentPage(1)
    setLoadedItems(itemsPerPage)
  }, [itemsPerPage])
  
  return {
    currentPage,
    totalPages,
    loadedItems,
    hasMore,
    isLoading,
    loadMore,
    goToPage,
    reset,
    setIsLoading
  }
}

// Intersection observer hook for infinite scroll
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 200,
  rootMargin = "200px"
}: {
  onLoadMore: () => void
  hasMore: boolean
  isLoading: boolean
  threshold?: number
  rootMargin?: string
}) {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin,
    triggerOnce: false
  })
  
  React.useEffect(() => {
    if (inView && hasMore && !isLoading) {
      onLoadMore()
    }
  }, [inView, hasMore, isLoading, onLoadMore])
  
  return { ref, inView }
}

// Memory management utilities
export const memoryManager = {
  // Clean up images not in viewport
  cleanupImages: (container: HTMLElement) => {
    const images = container.querySelectorAll('img')
    const viewportHeight = window.innerHeight
    
    images.forEach(img => {
      const rect = img.getBoundingClientRect()
      if (rect.bottom < -viewportHeight || rect.top > viewportHeight * 2) {
        // Remove src to free memory
        img.dataset.src = img.src
        img.src = ''
      } else if (img.dataset.src && !img.src) {
        // Restore src when back in range
        img.src = img.dataset.src
      }
    })
  },
  
  // Recycle DOM nodes for virtual scrolling
  recycleDOMNodes: (oldNodes: HTMLElement[], newData: any[]) => {
    // Reuse existing DOM nodes with new data
    return oldNodes.map((node, index) => {
      if (newData[index]) {
        // Update node with new data
        return node
      }
      return null
    }).filter(Boolean)
  },
  
  // Monitor memory usage
  getMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      }
    }
    return null
  }
}

export default EnhancedPagination
