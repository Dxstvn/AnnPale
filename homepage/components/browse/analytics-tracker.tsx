"use client"

import * as React from "react"
import { toast } from "sonner"

// Event Types
export type AnalyticsEventType = 
  | "page_view"
  | "search"
  | "filter_apply"
  | "filter_clear"
  | "sort_change"
  | "view_mode_change"
  | "creator_click"
  | "creator_favorite"
  | "creator_share"
  | "creator_compare"
  | "book_now_click"
  | "quick_view_open"
  | "pagination_change"
  | "infinite_scroll_load"
  | "error_occurred"
  | "performance_metric"

export interface AnalyticsEvent {
  type: AnalyticsEventType
  category: string
  action: string
  label?: string
  value?: number
  metadata?: Record<string, any>
  timestamp: number
  sessionId: string
  userId?: string
}

interface UserBehavior {
  sessionStart: number
  pageViews: number
  searches: number
  filtersApplied: number
  creatorsViewed: number
  bookingInitiated: number
  timeOnPage: number
  scrollDepth: number
  clickmapData: Array<{
    x: number
    y: number
    element: string
    timestamp: number
  }>
  searchQueries: string[]
  viewedCreators: string[]
  appliedFilters: Record<string, any>[]
}

interface AnalyticsContextValue {
  trackEvent: (event: Omit<AnalyticsEvent, "timestamp" | "sessionId">) => void
  getUserBehavior: () => UserBehavior
  getSessionEvents: () => AnalyticsEvent[]
  clearSession: () => void
  exportAnalytics: () => string
}

const AnalyticsContext = React.createContext<AnalyticsContextValue | undefined>(undefined)

// Generate session ID
const generateSessionId = (): string => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Analytics Provider Component
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const [sessionId] = React.useState(generateSessionId)
  const [events, setEvents] = React.useState<AnalyticsEvent[]>([])
  const [userBehavior, setUserBehavior] = React.useState<UserBehavior>({
    sessionStart: Date.now(),
    pageViews: 0,
    searches: 0,
    filtersApplied: 0,
    creatorsViewed: 0,
    bookingInitiated: 0,
    timeOnPage: 0,
    scrollDepth: 0,
    clickmapData: [],
    searchQueries: [],
    viewedCreators: [],
    appliedFilters: []
  })
  
  // Track scroll depth
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY
      const scrollPercentage = scrollHeight > 0 ? (scrolled / scrollHeight) * 100 : 0
      
      setUserBehavior(prev => ({
        ...prev,
        scrollDepth: Math.max(prev.scrollDepth, scrollPercentage)
      }))
    }
    
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  
  // Track clicks for heatmap
  React.useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const elementType = target.tagName.toLowerCase()
      const elementClass = target.className
      const elementId = target.id
      
      setUserBehavior(prev => ({
        ...prev,
        clickmapData: [
          ...prev.clickmapData,
          {
            x: e.clientX,
            y: e.clientY,
            element: `${elementType}${elementId ? `#${elementId}` : ""}${elementClass ? `.${elementClass.split(" ")[0]}` : ""}`,
            timestamp: Date.now()
          }
        ].slice(-100) // Keep last 100 clicks
      }))
    }
    
    document.addEventListener("click", handleClick)
    return () => document.removeEventListener("click", handleClick)
  }, [])
  
  // Track time on page
  React.useEffect(() => {
    const interval = setInterval(() => {
      setUserBehavior(prev => ({
        ...prev,
        timeOnPage: Date.now() - prev.sessionStart
      }))
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])
  
  // Track event function
  const trackEvent = React.useCallback((event: Omit<AnalyticsEvent, "timestamp" | "sessionId">) => {
    const fullEvent: AnalyticsEvent = {
      ...event,
      timestamp: Date.now(),
      sessionId
    }
    
    setEvents(prev => [...prev, fullEvent])
    
    // Update user behavior based on event type
    setUserBehavior(prev => {
      const updated = { ...prev }
      
      switch (event.type) {
        case "page_view":
          updated.pageViews++
          break
        case "search":
          updated.searches++
          if (event.metadata?.query) {
            updated.searchQueries.push(event.metadata.query)
          }
          break
        case "filter_apply":
          updated.filtersApplied++
          if (event.metadata) {
            updated.appliedFilters.push(event.metadata)
          }
          break
        case "creator_click":
          updated.creatorsViewed++
          if (event.metadata?.creatorId) {
            updated.viewedCreators.push(event.metadata.creatorId)
          }
          break
        case "book_now_click":
          updated.bookingInitiated++
          break
      }
      
      return updated
    })
    
    // Send to analytics service in production
    if (process.env.NODE_ENV === "production") {
      sendToAnalyticsService(fullEvent)
    } else {
      console.log("Analytics Event:", fullEvent)
    }
  }, [sessionId])
  
  // Get user behavior
  const getUserBehavior = React.useCallback(() => userBehavior, [userBehavior])
  
  // Get session events
  const getSessionEvents = React.useCallback(() => events, [events])
  
  // Clear session
  const clearSession = React.useCallback(() => {
    setEvents([])
    setUserBehavior({
      sessionStart: Date.now(),
      pageViews: 0,
      searches: 0,
      filtersApplied: 0,
      creatorsViewed: 0,
      bookingInitiated: 0,
      timeOnPage: 0,
      scrollDepth: 0,
      clickmapData: [],
      searchQueries: [],
      viewedCreators: [],
      appliedFilters: []
    })
  }, [])
  
  // Export analytics data
  const exportAnalytics = React.useCallback(() => {
    const data = {
      sessionId,
      userBehavior,
      events,
      exportedAt: new Date().toISOString()
    }
    
    return JSON.stringify(data, null, 2)
  }, [sessionId, userBehavior, events])
  
  return (
    <AnalyticsContext.Provider
      value={{
        trackEvent,
        getUserBehavior,
        getSessionEvents,
        clearSession,
        exportAnalytics
      }}
    >
      {children}
    </AnalyticsContext.Provider>
  )
}

// Hook to use analytics
export function useAnalytics() {
  const context = React.useContext(AnalyticsContext)
  if (!context) {
    throw new Error("useAnalytics must be used within AnalyticsProvider")
  }
  return context
}

// Send to analytics service (placeholder)
async function sendToAnalyticsService(event: AnalyticsEvent) {
  try {
    // In production, this would send to your analytics endpoint
    // await fetch("/api/analytics", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(event)
    // })
  } catch (error) {
    console.error("Failed to send analytics event:", error)
  }
}

// Analytics Dashboard Component
export function AnalyticsDashboard() {
  const { getUserBehavior, getSessionEvents, exportAnalytics } = useAnalytics()
  const [isOpen, setIsOpen] = React.useState(false)
  const behavior = getUserBehavior()
  const events = getSessionEvents()
  
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 p-2 bg-purple-600 text-white rounded-full shadow-lg hover:bg-purple-700 transition z-50"
        title="Open Analytics Dashboard"
      >
        📊
      </button>
    )
  }
  
  return (
    <div className="fixed bottom-4 left-4 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border p-4 z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Analytics Dashboard</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-3 text-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
            <div className="text-gray-600 dark:text-gray-400 text-xs">Page Views</div>
            <div className="font-semibold">{behavior.pageViews}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
            <div className="text-gray-600 dark:text-gray-400 text-xs">Searches</div>
            <div className="font-semibold">{behavior.searches}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
            <div className="text-gray-600 dark:text-gray-400 text-xs">Filters Applied</div>
            <div className="font-semibold">{behavior.filtersApplied}</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
            <div className="text-gray-600 dark:text-gray-400 text-xs">Creators Viewed</div>
            <div className="font-semibold">{behavior.creatorsViewed}</div>
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
          <div className="text-gray-600 dark:text-gray-400 text-xs">Time on Page</div>
          <div className="font-semibold">
            {Math.floor(behavior.timeOnPage / 60000)}m {Math.floor((behavior.timeOnPage % 60000) / 1000)}s
          </div>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
          <div className="text-gray-600 dark:text-gray-400 text-xs">Scroll Depth</div>
          <div className="font-semibold">{behavior.scrollDepth.toFixed(1)}%</div>
        </div>
        
        {behavior.searchQueries.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
            <div className="text-gray-600 dark:text-gray-400 text-xs mb-1">Recent Searches</div>
            <div className="space-y-1">
              {behavior.searchQueries.slice(-3).map((query, index) => (
                <div key={index} className="text-xs">{query}</div>
              ))}
            </div>
          </div>
        )}
        
        <div className="bg-gray-50 dark:bg-gray-700 p-2 rounded">
          <div className="text-gray-600 dark:text-gray-400 text-xs">Total Events</div>
          <div className="font-semibold">{events.length}</div>
        </div>
        
        <button
          onClick={() => {
            const data = exportAnalytics()
            navigator.clipboard.writeText(data)
            toast.success("Analytics data copied to clipboard")
          }}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          Export Analytics
        </button>
      </div>
    </div>
  )
}

// Custom hooks for common tracking patterns
export function useTrackPageView(pageName: string) {
  const { trackEvent } = useAnalytics()
  
  React.useEffect(() => {
    trackEvent({
      type: "page_view",
      category: "Navigation",
      action: "Page View",
      label: pageName
    })
  }, [pageName, trackEvent])
}

export function useTrackSearch() {
  const { trackEvent } = useAnalytics()
  
  return React.useCallback((query: string, resultCount: number) => {
    trackEvent({
      type: "search",
      category: "Search",
      action: "Search Performed",
      label: query,
      value: resultCount,
      metadata: { query, resultCount }
    })
  }, [trackEvent])
}

export function useTrackFilter() {
  const { trackEvent } = useAnalytics()
  
  return React.useCallback((filterType: string, filterValue: any) => {
    trackEvent({
      type: "filter_apply",
      category: "Filters",
      action: "Filter Applied",
      label: filterType,
      metadata: { filterType, filterValue }
    })
  }, [trackEvent])
}

export function useTrackCreatorInteraction() {
  const { trackEvent } = useAnalytics()
  
  return React.useCallback((action: string, creatorId: string, creatorName: string) => {
    trackEvent({
      type: "creator_click",
      category: "Creator",
      action,
      label: creatorName,
      metadata: { creatorId, creatorName }
    })
  }, [trackEvent])
}