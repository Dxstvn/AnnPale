"use client"

import * as React from "react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface SearchCache {
  query: string
  filters: any
  results: any[]
  timestamp: number
  ttl: number // Time to live in milliseconds
}

interface NetworkStatus {
  online: boolean
  speed: "fast" | "slow" | "offline"
  lastCheck: Date
}

interface SearchResilienceConfig {
  maxRetries?: number
  retryDelay?: number
  cacheEnabled?: boolean
  cacheTTL?: number
  offlineMode?: boolean
  fallbackEnabled?: boolean
}

/**
 * Search Resilience Hook
 * Provides network error recovery, caching, and fallback mechanisms
 */
export function useSearchResilience(config: SearchResilienceConfig = {}) {
  const {
    maxRetries = 3,
    retryDelay = 1000,
    cacheEnabled = true,
    cacheTTL = 5 * 60 * 1000, // 5 minutes
    offlineMode = true,
    fallbackEnabled = true
  } = config

  const [networkStatus, setNetworkStatus] = React.useState<NetworkStatus>({
    online: true,
    speed: "fast",
    lastCheck: new Date()
  })

  const [searchCache, setSearchCache] = React.useState<Map<string, SearchCache>>(new Map())
  const [retryCount, setRetryCount] = React.useState(0)
  const [isRetrying, setIsRetrying] = React.useState(false)

  // Monitor network status
  React.useEffect(() => {
    const checkNetworkStatus = () => {
      const online = navigator.onLine
      
      // Estimate connection speed
      let speed: "fast" | "slow" | "offline" = "fast"
      if (!online) {
        speed = "offline"
      } else if ('connection' in navigator) {
        const connection = (navigator as any).connection
        if (connection?.effectiveType === "slow-2g" || connection?.effectiveType === "2g") {
          speed = "slow"
        }
      }

      setNetworkStatus({
        online,
        speed,
        lastCheck: new Date()
      })
    }

    checkNetworkStatus()
    window.addEventListener("online", checkNetworkStatus)
    window.addEventListener("offline", checkNetworkStatus)

    const interval = setInterval(checkNetworkStatus, 30000) // Check every 30 seconds

    return () => {
      window.removeEventListener("online", checkNetworkStatus)
      window.removeEventListener("offline", checkNetworkStatus)
      clearInterval(interval)
    }
  }, [])

  // Cache management
  const getCacheKey = (query: string, filters: any) => {
    return `${query}-${JSON.stringify(filters)}`
  }

  const getCachedResults = (query: string, filters: any) => {
    if (!cacheEnabled) return null

    const key = getCacheKey(query, filters)
    const cached = searchCache.get(key)

    if (!cached) return null

    const now = Date.now()
    if (now - cached.timestamp > cached.ttl) {
      // Cache expired
      searchCache.delete(key)
      return null
    }

    return cached.results
  }

  const setCachedResults = (query: string, filters: any, results: any[]) => {
    if (!cacheEnabled) return

    const key = getCacheKey(query, filters)
    const cache: SearchCache = {
      query,
      filters,
      results,
      timestamp: Date.now(),
      ttl: cacheTTL
    }

    setSearchCache(prev => new Map(prev).set(key, cache))
  }

  // Clear old cache entries
  React.useEffect(() => {
    const clearOldCache = () => {
      const now = Date.now()
      setSearchCache(prev => {
        const newCache = new Map(prev)
        for (const [key, cache] of newCache.entries()) {
          if (now - cache.timestamp > cache.ttl) {
            newCache.delete(key)
          }
        }
        return newCache
      })
    }

    const interval = setInterval(clearOldCache, 60000) // Clean every minute
    return () => clearInterval(interval)
  }, [cacheTTL])

  // Retry mechanism with exponential backoff
  const retrySearch = async (
    searchFn: () => Promise<any>,
    onError?: (error: any) => void
  ): Promise<any> => {
    let lastError: any

    for (let i = 0; i < maxRetries; i++) {
      try {
        setRetryCount(i)
        setIsRetrying(i > 0)
        
        const result = await searchFn()
        
        // Success - reset retry count
        setRetryCount(0)
        setIsRetrying(false)
        
        if (i > 0) {
          toast.success("Search successful after retry")
        }
        
        return result
      } catch (error) {
        lastError = error
        
        if (i < maxRetries - 1) {
          // Calculate delay with exponential backoff
          const delay = retryDelay * Math.pow(2, i)
          
          toast.info(`Retrying in ${delay / 1000} seconds... (Attempt ${i + 2}/${maxRetries})`)
          
          await new Promise(resolve => setTimeout(resolve, delay))
        }
      }
    }

    setIsRetrying(false)
    onError?.(lastError)
    throw lastError
  }

  // Fallback data for offline mode
  const getFallbackData = () => {
    if (!fallbackEnabled) return []

    // Return popular/featured creators as fallback
    return [
      // This would be populated with actual fallback data
      // from localStorage or hardcoded popular creators
    ]
  }

  // Intelligent search with resilience
  const resilientSearch = async (
    query: string,
    filters: any,
    searchFn: () => Promise<any>
  ) => {
    // Check network status
    if (!networkStatus.online && offlineMode) {
      toast.warning("You're offline. Showing cached results.")
      
      // Try cache first
      const cached = getCachedResults(query, filters)
      if (cached) return cached
      
      // Return fallback data
      return getFallbackData()
    }

    // Slow connection warning
    if (networkStatus.speed === "slow") {
      toast.info("Slow connection detected. This might take a moment...")
    }

    // Check cache for recent results
    const cached = getCachedResults(query, filters)
    if (cached && networkStatus.speed === "slow") {
      // Return cached results immediately on slow connection
      toast.info("Showing recent results while updating...")
      
      // Update in background
      searchFn().then(results => {
        setCachedResults(query, filters, results)
      }).catch(() => {
        // Silent fail for background update
      })
      
      return cached
    }

    // Perform search with retry mechanism
    try {
      const results = await retrySearch(searchFn)
      
      // Cache successful results
      setCachedResults(query, filters, results)
      
      return results
    } catch (error) {
      // Try cache as last resort
      const cachedFallback = getCachedResults(query, filters)
      if (cachedFallback) {
        toast.warning("Using cached results due to connection issues")
        return cachedFallback
      }

      // Return fallback data if everything fails
      if (fallbackEnabled) {
        toast.error("Search failed. Showing popular creators instead.")
        return getFallbackData()
      }

      throw error
    }
  }

  // Preload popular searches for offline use
  const preloadPopularSearches = async (searches: string[]) => {
    if (!cacheEnabled) return

    for (const search of searches) {
      try {
        // This would call the actual search API
        // and cache the results for offline use
      } catch {
        // Silent fail for preloading
      }
    }
  }

  return {
    networkStatus,
    searchCache: Array.from(searchCache.values()),
    retryCount,
    isRetrying,
    resilientSearch,
    getCachedResults,
    setCachedResults,
    preloadPopularSearches,
    clearCache: () => setSearchCache(new Map())
  }
}

/**
 * Offline Indicator Component
 */
export function OfflineIndicator() {
  const [isOnline, setIsOnline] = React.useState(navigator.onLine)

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  if (isOnline) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-50">
      <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
        <span className="text-sm font-medium">You're offline</span>
      </div>
    </div>
  )
}

/**
 * Connection Speed Indicator
 */
export function ConnectionSpeedIndicator() {
  const [speed, setSpeed] = React.useState<"fast" | "slow" | "offline">("fast")

  React.useEffect(() => {
    const checkSpeed = () => {
      if (!navigator.onLine) {
        setSpeed("offline")
        return
      }

      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        const effectiveType = connection?.effectiveType

        if (effectiveType === "slow-2g" || effectiveType === "2g") {
          setSpeed("slow")
        } else {
          setSpeed("fast")
        }
      }
    }

    checkSpeed()
    
    if ('connection' in navigator) {
      const connection = (navigator as any).connection
      connection?.addEventListener("change", checkSpeed)
      
      return () => {
        connection?.removeEventListener("change", checkSpeed)
      }
    }
  }, [])

  if (speed === "fast") return null

  return (
    <div className="fixed top-20 right-4 z-40">
      <div className={cn(
        "px-3 py-1 rounded-full text-xs font-medium",
        speed === "slow" && "bg-yellow-100 text-yellow-800",
        speed === "offline" && "bg-red-100 text-red-800"
      )}>
        {speed === "slow" ? "Slow connection" : "No connection"}
      </div>
    </div>
  )
}