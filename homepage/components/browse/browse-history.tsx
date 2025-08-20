"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Clock,
  Search,
  Trash2,
  Star,
  Filter,
  Calendar,
  TrendingUp,
  Eye,
  ChevronRight,
  BarChart3,
  Download,
  RefreshCw,
  Settings,
  History,
  Bookmark,
  MapPin
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import type { EnhancedCreator } from "./enhanced-creator-card"
import type { FilterState } from "./filter-sidebar"

// History Entry Types
export interface HistoryEntry {
  id: string
  type: "creator_view" | "search" | "filter_change" | "page_visit"
  timestamp: Date
  data: {
    creatorId?: string
    creatorName?: string
    creatorCategory?: string
    searchQuery?: string
    filters?: Partial<FilterState>
    page?: string
    duration?: number
    metadata?: Record<string, any>
  }
  sessionId: string
}

export interface BrowseSession {
  id: string
  startTime: Date
  endTime?: Date
  pageViews: number
  creatorsViewed: string[]
  searchesPerformed: string[]
  filtersApplied: number
  duration: number
  userAgent?: string
  location?: string
}

export interface HistoryStats {
  totalSessions: number
  totalCreatorsViewed: number
  totalSearches: number
  averageSessionDuration: number
  topCategories: Array<{ category: string; count: number }>
  topSearchTerms: Array<{ term: string; count: number }>
  browsingPeakHours: number[]
  favoriteCreators: string[]
}

interface BrowseHistoryProps {
  onLoadHistory?: (entry: HistoryEntry) => void
  onClearHistory?: () => void
  className?: string
}

export function BrowseHistory({
  onLoadHistory,
  onClearHistory,
  className
}: BrowseHistoryProps) {
  const [history, setHistory] = React.useState<HistoryEntry[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("browseHistory")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  
  const [sessions, setSessions] = React.useState<BrowseSession[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("browseSessions")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })
  
  const [currentSession, setCurrentSession] = React.useState<BrowseSession | null>(null)
  const [isTrackingEnabled, setIsTrackingEnabled] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterType, setFilterType] = React.useState<string>("all")
  const [timeRange, setTimeRange] = React.useState<string>("all")
  const [showStats, setShowStats] = React.useState(false)
  
  // Initialize session on mount
  React.useEffect(() => {
    if (isTrackingEnabled && !currentSession) {
      const newSession: BrowseSession = {
        id: `session_${Date.now()}`,
        startTime: new Date(),
        pageViews: 1,
        creatorsViewed: [],
        searchesPerformed: [],
        filtersApplied: 0,
        duration: 0,
        userAgent: navigator.userAgent,
        location: window.location.hostname
      }
      setCurrentSession(newSession)
    }
  }, [isTrackingEnabled, currentSession])
  
  // Update session duration periodically
  React.useEffect(() => {
    if (!currentSession) return
    
    const interval = setInterval(() => {
      setCurrentSession(prev => prev ? {
        ...prev,
        duration: Date.now() - prev.startTime.getTime()
      } : null)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [currentSession])
  
  // Save history and sessions to localStorage
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("browseHistory", JSON.stringify(history))
    }
  }, [history])
  
  React.useEffect(() => {
    if (typeof window !== "undefined" && currentSession) {
      const allSessions = [...sessions.filter(s => s.id !== currentSession.id), currentSession]
      localStorage.setItem("browseSessions", JSON.stringify(allSessions))
      setSessions(allSessions)
    }
  }, [currentSession, sessions])
  
  // Cleanup session on page unload
  React.useEffect(() => {
    const handleBeforeUnload = () => {
      if (currentSession) {
        const endedSession = {
          ...currentSession,
          endTime: new Date(),
          duration: Date.now() - currentSession.startTime.getTime()
        }
        
        setSessions(prev => [
          ...prev.filter(s => s.id !== currentSession.id),
          endedSession
        ])
      }
    }
    
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [currentSession])
  
  // Add history entry
  const addHistoryEntry = React.useCallback((entry: Omit<HistoryEntry, "id" | "timestamp" | "sessionId">) => {
    if (!isTrackingEnabled) return
    
    const newEntry: HistoryEntry = {
      id: `entry_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      sessionId: currentSession?.id || "unknown",
      ...entry
    }
    
    setHistory(prev => [newEntry, ...prev].slice(0, 1000)) // Keep last 1000 entries
    
    // Update current session
    if (currentSession) {
      setCurrentSession(prev => {
        if (!prev) return null
        
        const updated = { ...prev }
        
        switch (entry.type) {
          case "creator_view":
            if (entry.data.creatorId && !updated.creatorsViewed.includes(entry.data.creatorId)) {
              updated.creatorsViewed.push(entry.data.creatorId)
            }
            break
          case "search":
            if (entry.data.searchQuery && !updated.searchesPerformed.includes(entry.data.searchQuery)) {
              updated.searchesPerformed.push(entry.data.searchQuery)
            }
            break
          case "filter_change":
            updated.filtersApplied++
            break
          case "page_visit":
            updated.pageViews++
            break
        }
        
        return updated
      })
    }
  }, [isTrackingEnabled, currentSession])
  
  // Track creator view
  const trackCreatorView = React.useCallback((creator: EnhancedCreator, duration?: number) => {
    addHistoryEntry({
      type: "creator_view",
      data: {
        creatorId: creator.id,
        creatorName: creator.name,
        creatorCategory: creator.category,
        duration,
        metadata: {
          price: creator.price,
          rating: creator.rating,
          verified: creator.verified
        }
      }
    })
  }, [addHistoryEntry])
  
  // Track search
  const trackSearch = React.useCallback((query: string, resultCount?: number) => {
    addHistoryEntry({
      type: "search",
      data: {
        searchQuery: query,
        metadata: { resultCount }
      }
    })
  }, [addHistoryEntry])
  
  // Track filter change
  const trackFilterChange = React.useCallback((filters: Partial<FilterState>) => {
    addHistoryEntry({
      type: "filter_change",
      data: { filters }
    })
  }, [addHistoryEntry])
  
  // Track page visit
  const trackPageVisit = React.useCallback((page: string) => {
    addHistoryEntry({
      type: "page_visit",
      data: { page }
    })
  }, [addHistoryEntry])
  
  // Filter history entries
  const filteredHistory = React.useMemo(() => {
    let filtered = history
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(entry => {
        const searchIn = [
          entry.data.creatorName,
          entry.data.searchQuery,
          entry.data.page
        ].filter(Boolean).join(" ").toLowerCase()
        
        return searchIn.includes(searchTerm.toLowerCase())
      })
    }
    
    // Filter by type
    if (filterType !== "all") {
      filtered = filtered.filter(entry => entry.type === filterType)
    }
    
    // Filter by time range
    if (timeRange !== "all") {
      const now = new Date()
      let cutoff: Date
      
      switch (timeRange) {
        case "today":
          cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case "week":
          cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case "month":
          cutoff = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        default:
          cutoff = new Date(0)
      }
      
      filtered = filtered.filter(entry => entry.timestamp >= cutoff)
    }
    
    return filtered
  }, [history, searchTerm, filterType, timeRange])
  
  // Calculate statistics
  const calculateStats = (): HistoryStats => {
    const categoryCount: Record<string, number> = {}
    const searchTermCount: Record<string, number> = {}
    const hourCount: number[] = new Array(24).fill(0)
    
    history.forEach(entry => {
      // Count categories
      if (entry.data.creatorCategory) {
        categoryCount[entry.data.creatorCategory] = (categoryCount[entry.data.creatorCategory] || 0) + 1
      }
      
      // Count search terms
      if (entry.data.searchQuery) {
        searchTermCount[entry.data.searchQuery] = (searchTermCount[entry.data.searchQuery] || 0) + 1
      }
      
      // Count by hour
      const hour = entry.timestamp.getHours()
      hourCount[hour]++
    })
    
    const topCategories = Object.entries(categoryCount)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    
    const topSearchTerms = Object.entries(searchTermCount)
      .map(([term, count]) => ({ term, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
    
    const uniqueCreators = new Set(
      history
        .filter(e => e.type === "creator_view")
        .map(e => e.data.creatorId)
        .filter(Boolean)
    )
    
    const totalSearches = history.filter(e => e.type === "search").length
    const avgSessionDuration = sessions.length > 0 
      ? sessions.reduce((sum, s) => sum + s.duration, 0) / sessions.length 
      : 0
    
    return {
      totalSessions: sessions.length,
      totalCreatorsViewed: uniqueCreators.size,
      totalSearches,
      averageSessionDuration: avgSessionDuration / 1000, // Convert to seconds
      topCategories,
      topSearchTerms,
      browsingPeakHours: hourCount,
      favoriteCreators: [] // Would be calculated from user preferences
    }
  }
  
  const stats = calculateStats()
  
  // Clear all history
  const clearAllHistory = () => {
    setHistory([])
    setSessions([])
    setCurrentSession(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("browseHistory")
      localStorage.removeItem("browseSessions")
    }
    onClearHistory?.()
    toast.success("Browse history cleared")
  }
  
  // Export history data
  const exportHistory = () => {
    const data = {
      history,
      sessions,
      stats,
      exportedAt: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `browse-history-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success("History exported successfully")
  }
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <History className="h-5 w-5" />
              Browse History
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowStats(!showStats)}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={exportHistory}
              >
                <Download className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-2 text-sm">
                <Label htmlFor="tracking">Track</Label>
                <Switch
                  id="tracking"
                  checked={isTrackingEnabled}
                  onCheckedChange={setIsTrackingEnabled}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        
        {/* Filters */}
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger>
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="creator_view">Creator Views</SelectItem>
                <SelectItem value="search">Searches</SelectItem>
                <SelectItem value="filter_change">Filter Changes</SelectItem>
                <SelectItem value="page_visit">Page Visits</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>
            
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Clear Browse History</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your browse history and sessions. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={clearAllHistory}>
                    Clear History
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
      
      {/* Statistics */}
      {showStats && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Browse Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{stats.totalSessions}</p>
                <p className="text-xs text-gray-500">Sessions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{stats.totalCreatorsViewed}</p>
                <p className="text-xs text-gray-500">Creators Viewed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{stats.totalSearches}</p>
                <p className="text-xs text-gray-500">Searches</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(stats.averageSessionDuration)}s
                </p>
                <p className="text-xs text-gray-500">Avg Session</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Top Categories</h4>
                <div className="space-y-1">
                  {stats.topCategories.map(({ category, count }) => (
                    <div key={category} className="flex items-center justify-between text-xs">
                      <span>{category}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Top Searches</h4>
                <div className="space-y-1">
                  {stats.topSearchTerms.map(({ term, count }) => (
                    <div key={term} className="flex items-center justify-between text-xs">
                      <span className="truncate">{term}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Current Session */}
      {currentSession && isTrackingEnabled && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-sm font-medium">Current Session</p>
                  <p className="text-xs text-gray-500">
                    {Math.floor(currentSession.duration / 60000)}m {Math.floor((currentSession.duration % 60000) / 1000)}s
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>{currentSession.creatorsViewed.length} creators</span>
                <span>{currentSession.searchesPerformed.length} searches</span>
                <span>{currentSession.filtersApplied} filters</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* History List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium">
              Recent Activity ({filteredHistory.length} items)
            </h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {filteredHistory.length === 0 ? (
            <div className="text-center py-6">
              <Clock className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No history found</p>
              <p className="text-xs text-gray-400 mt-1">
                {!isTrackingEnabled 
                  ? "Enable tracking to see your browse history"
                  : "Start browsing to see your activity here"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              <AnimatePresence mode="popLayout">
                {filteredHistory.slice(0, 50).map((entry) => (
                  <motion.div
                    key={entry.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="group"
                  >
                    <HistoryItem
                      entry={entry}
                      onLoad={() => onLoadHistory?.(entry)}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// History Item Component
function HistoryItem({
  entry,
  onLoad
}: {
  entry: HistoryEntry
  onLoad: () => void
}) {
  const getIcon = () => {
    switch (entry.type) {
      case "creator_view":
        return <Eye className="h-4 w-4 text-blue-500" />
      case "search":
        return <Search className="h-4 w-4 text-green-500" />
      case "filter_change":
        return <Filter className="h-4 w-4 text-purple-500" />
      case "page_visit":
        return <MapPin className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }
  
  const getDescription = () => {
    switch (entry.type) {
      case "creator_view":
        return `Viewed ${entry.data.creatorName}`
      case "search":
        return `Searched "${entry.data.searchQuery}"`
      case "filter_change":
        return "Applied filters"
      case "page_visit":
        return `Visited ${entry.data.page}`
      default:
        return "Unknown activity"
    }
  }
  
  const formatTime = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    
    if (diff < 60000) return "Just now"
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    return timestamp.toLocaleDateString()
  }
  
  return (
    <button
      onClick={onLoad}
      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition text-left group"
    >
      {getIcon()}
      
      <div className="flex-1">
        <p className="text-sm font-medium">{getDescription()}</p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{formatTime(entry.timestamp)}</span>
          {entry.data.creatorCategory && (
            <Badge variant="secondary" className="text-xs">
              {entry.data.creatorCategory}
            </Badge>
          )}
          {entry.data.duration && (
            <span>• {Math.round(entry.data.duration / 1000)}s</span>
          )}
        </div>
      </div>
      
      <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition" />
    </button>
  )
}

// Export hooks for tracking
export const useBrowseHistory = () => {
  const [historyComponent, setHistoryComponent] = React.useState<any>(null)
  
  const trackCreatorView = React.useCallback((creator: EnhancedCreator, duration?: number) => {
    historyComponent?.trackCreatorView(creator, duration)
  }, [historyComponent])
  
  const trackSearch = React.useCallback((query: string, resultCount?: number) => {
    historyComponent?.trackSearch(query, resultCount)
  }, [historyComponent])
  
  const trackFilterChange = React.useCallback((filters: Partial<FilterState>) => {
    historyComponent?.trackFilterChange(filters)
  }, [historyComponent])
  
  const trackPageVisit = React.useCallback((page: string) => {
    historyComponent?.trackPageVisit(page)
  }, [historyComponent])
  
  return {
    trackCreatorView,
    trackSearch,
    trackFilterChange,
    trackPageVisit,
    setHistoryRef: setHistoryComponent
  }
}