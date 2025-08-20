"use client"

import * as React from "react"
import { usePathname } from "next/navigation"

interface ScrollPosition {
  x: number
  y: number
  timestamp: number
}

interface ScrollRestorationOptions {
  key?: string
  debounceMs?: number
  maxAge?: number // Max age in ms before position expires
  storageType?: "session" | "local"
  restoreOnMount?: boolean
  saveOnUnmount?: boolean
}

/**
 * Hook for managing scroll position restoration
 * Persists scroll position across navigation and page refreshes
 */
export function useScrollRestoration(options: ScrollRestorationOptions = {}) {
  const {
    key,
    debounceMs = 100,
    maxAge = 1000 * 60 * 5, // 5 minutes default
    storageType = "session",
    restoreOnMount = true,
    saveOnUnmount = true
  } = options

  const pathname = usePathname()
  const storageKey = key || `scroll-${pathname}`
  const storage = storageType === "local" ? localStorage : sessionStorage
  
  const [isRestoring, setIsRestoring] = React.useState(false)
  const scrollTimeoutRef = React.useRef<NodeJS.Timeout>()
  const lastScrollPosition = React.useRef<ScrollPosition>({ x: 0, y: 0, timestamp: Date.now() })

  // Save scroll position with debouncing
  const saveScrollPosition = React.useCallback(() => {
    const position: ScrollPosition = {
      x: window.scrollX || window.pageXOffset,
      y: window.scrollY || window.pageYOffset,
      timestamp: Date.now()
    }
    
    lastScrollPosition.current = position
    
    // Debounce the save operation
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current)
    }
    
    scrollTimeoutRef.current = setTimeout(() => {
      try {
        storage.setItem(storageKey, JSON.stringify(position))
      } catch (e) {
        console.warn("Failed to save scroll position:", e)
      }
    }, debounceMs)
  }, [storageKey, storage, debounceMs])

  // Restore scroll position
  const restoreScrollPosition = React.useCallback(() => {
    try {
      const saved = storage.getItem(storageKey)
      if (!saved) return false

      const position: ScrollPosition = JSON.parse(saved)
      
      // Check if position is not expired
      if (Date.now() - position.timestamp > maxAge) {
        storage.removeItem(storageKey)
        return false
      }

      setIsRestoring(true)
      
      // Use requestAnimationFrame for smooth restoration
      requestAnimationFrame(() => {
        window.scrollTo({
          top: position.y,
          left: position.x,
          behavior: "instant"
        })
        
        // Double-check after a short delay (for dynamic content)
        setTimeout(() => {
          if (window.scrollY !== position.y || window.scrollX !== position.x) {
            window.scrollTo(position.x, position.y)
          }
          setIsRestoring(false)
        }, 100)
      })
      
      return true
    } catch (e) {
      console.warn("Failed to restore scroll position:", e)
      setIsRestoring(false)
      return false
    }
  }, [storageKey, storage, maxAge])

  // Clear stored position
  const clearScrollPosition = React.useCallback(() => {
    try {
      storage.removeItem(storageKey)
    } catch (e) {
      console.warn("Failed to clear scroll position:", e)
    }
  }, [storageKey, storage])

  // Get current scroll position
  const getScrollPosition = React.useCallback((): ScrollPosition => {
    return {
      x: window.scrollX || window.pageXOffset,
      y: window.scrollY || window.pageYOffset,
      timestamp: Date.now()
    }
  }, [])

  // Scroll to position
  const scrollToPosition = React.useCallback((position: Partial<ScrollPosition>, behavior: ScrollBehavior = "smooth") => {
    window.scrollTo({
      top: position.y,
      left: position.x,
      behavior
    })
  }, [])

  // Setup scroll listener
  React.useEffect(() => {
    const handleScroll = () => {
      if (!isRestoring) {
        saveScrollPosition()
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    
    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [saveScrollPosition, isRestoring])

  // Restore on mount
  React.useEffect(() => {
    if (restoreOnMount) {
      const restored = restoreScrollPosition()
      if (!restored) {
        // Scroll to top if no position to restore
        window.scrollTo(0, 0)
      }
    }
  }, [restoreOnMount, restoreScrollPosition])

  // Save on unmount
  React.useEffect(() => {
    return () => {
      if (saveOnUnmount) {
        // Save immediately on unmount
        const position = getScrollPosition()
        try {
          storage.setItem(storageKey, JSON.stringify(position))
        } catch (e) {
          console.warn("Failed to save scroll position on unmount:", e)
        }
      }
    }
  }, [saveOnUnmount, storageKey, storage, getScrollPosition])

  return {
    saveScrollPosition,
    restoreScrollPosition,
    clearScrollPosition,
    getScrollPosition,
    scrollToPosition,
    isRestoring
  }
}

/**
 * Hook for infinite scroll with position restoration
 */
export function useInfiniteScrollRestoration({
  itemsPerPage = 12,
  totalItems,
  persistKey
}: {
  itemsPerPage?: number
  totalItems: number
  persistKey?: string
}) {
  const [loadedPages, setLoadedPages] = React.useState(1)
  const [scrollProgress, setScrollProgress] = React.useState(0)
  
  // Persist loaded pages
  React.useEffect(() => {
    if (persistKey) {
      const saved = sessionStorage.getItem(`infinite-${persistKey}`)
      if (saved) {
        const { pages, progress } = JSON.parse(saved)
        setLoadedPages(pages)
        setScrollProgress(progress)
        
        // Restore scroll position after content loads
        requestAnimationFrame(() => {
          const scrollHeight = document.documentElement.scrollHeight
          const targetScroll = scrollHeight * progress
          window.scrollTo(0, targetScroll)
        })
      }
    }
  }, [persistKey])

  // Save state on scroll
  React.useEffect(() => {
    if (!persistKey) return

    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentScroll = window.scrollY
      const progress = scrollHeight > 0 ? currentScroll / scrollHeight : 0
      
      setScrollProgress(progress)
      
      // Save state
      sessionStorage.setItem(
        `infinite-${persistKey}`,
        JSON.stringify({ pages: loadedPages, progress })
      )
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [persistKey, loadedPages])

  const loadMore = React.useCallback(() => {
    setLoadedPages(prev => prev + 1)
  }, [])

  const reset = React.useCallback(() => {
    setLoadedPages(1)
    setScrollProgress(0)
    if (persistKey) {
      sessionStorage.removeItem(`infinite-${persistKey}`)
    }
    window.scrollTo(0, 0)
  }, [persistKey])

  return {
    loadedItems: Math.min(loadedPages * itemsPerPage, totalItems),
    hasMore: loadedPages * itemsPerPage < totalItems,
    loadMore,
    reset,
    scrollProgress
  }
}

/**
 * Hook for virtual scroll position tracking
 */
export function useVirtualScrollPosition({
  containerRef,
  itemHeight,
  totalItems,
  overscan = 3
}: {
  containerRef: React.RefObject<HTMLElement>
  itemHeight: number
  totalItems: number
  overscan?: number
}) {
  const [scrollTop, setScrollTop] = React.useState(0)
  const [containerHeight, setContainerHeight] = React.useState(0)

  // Calculate visible range
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    totalItems,
    Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
  )

  // Update container height on resize
  React.useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight)
      }
    }

    updateHeight()
    window.addEventListener("resize", updateHeight)
    return () => window.removeEventListener("resize", updateHeight)
  }, [containerRef])

  // Handle scroll
  const handleScroll = React.useCallback((e: React.UIEvent<HTMLElement>) => {
    setScrollTop(e.currentTarget.scrollTop)
  }, [])

  // Scroll to index
  const scrollToIndex = React.useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    if (containerRef.current) {
      const targetScroll = index * itemHeight
      containerRef.current.scrollTo({
        top: targetScroll,
        behavior
      })
    }
  }, [containerRef, itemHeight])

  // Save and restore position
  const savePosition = React.useCallback(() => {
    return {
      scrollTop,
      startIndex,
      endIndex
    }
  }, [scrollTop, startIndex, endIndex])

  const restorePosition = React.useCallback((position: { scrollTop: number }) => {
    if (containerRef.current) {
      containerRef.current.scrollTop = position.scrollTop
      setScrollTop(position.scrollTop)
    }
  }, [containerRef])

  return {
    scrollTop,
    startIndex,
    endIndex,
    visibleCount: endIndex - startIndex,
    handleScroll,
    scrollToIndex,
    savePosition,
    restorePosition
  }
}