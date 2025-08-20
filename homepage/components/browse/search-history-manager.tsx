"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"
import {
  Clock,
  Search,
  X,
  TrendingUp,
  Star,
  Bell,
  Download,
  Shield,
  Eye,
  EyeOff,
  Trash2,
  MoreVertical,
  Filter,
  Calendar,
  Globe,
  DollarSign,
  Users,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Info,
  Lock,
  Unlock
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { formatDistanceToNow, format } from "date-fns"

// Search history entry
export interface SearchHistoryEntry {
  id: string
  query: string
  timestamp: Date
  filters?: Record<string, any>
  resultCount: number
  clickedResults: string[]
  searchMethod: "text" | "voice" | "image" | "gesture"
  language: string
  pattern?: string
  intent?: string
  duration: number // Time spent on results in seconds
  successful: boolean // Did user find what they were looking for
}

// Saved search
export interface SavedSearch {
  id: string
  name: string
  query: string
  filters: Record<string, any>
  createdAt: Date
  lastUsed?: Date
  useCount: number
  alerts: boolean
  alertFrequency?: "instant" | "daily" | "weekly"
  isPublic: boolean
}

// Search alert
export interface SearchAlert {
  id: string
  savedSearchId: string
  frequency: "instant" | "daily" | "weekly"
  channels: ("email" | "push" | "sms")[]
  enabled: boolean
  lastTriggered?: Date
  triggerCount: number
}

// Privacy settings
export interface PrivacySettings {
  saveHistory: boolean
  personalizeResults: boolean
  shareAnonymousData: boolean
  incognitoMode: boolean
  autoDeleteAfterDays: number
  dataRetention: "7days" | "30days" | "90days" | "1year" | "forever"
}

interface SearchHistoryManagerProps {
  userId?: string
  onSearch: (query: string, filters?: Record<string, any>) => void
  onPrivacyChange?: (settings: PrivacySettings) => void
  className?: string
}

// Default privacy settings
const DEFAULT_PRIVACY_SETTINGS: PrivacySettings = {
  saveHistory: true,
  personalizeResults: true,
  shareAnonymousData: false,
  incognitoMode: false,
  autoDeleteAfterDays: 30,
  dataRetention: "30days"
}

export function SearchHistoryManager({
  userId,
  onSearch,
  onPrivacyChange,
  className
}: SearchHistoryManagerProps) {
  const [searchHistory, setSearchHistory] = React.useState<SearchHistoryEntry[]>([])
  const [savedSearches, setSavedSearches] = React.useState<SavedSearch[]>([])
  const [searchAlerts, setSearchAlerts] = React.useState<SearchAlert[]>([])
  const [privacySettings, setPrivacySettings] = React.useState<PrivacySettings>(DEFAULT_PRIVACY_SETTINGS)
  const [showPrivacyDialog, setShowPrivacyDialog] = React.useState(false)
  const [showSaveDialog, setShowSaveDialog] = React.useState(false)
  const [selectedSearch, setSelectedSearch] = React.useState<SearchHistoryEntry | null>(null)
  const [searchName, setSearchName] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)

  // Load search history from localStorage
  React.useEffect(() => {
    if (!privacySettings.saveHistory || privacySettings.incognitoMode) return

    const stored = localStorage.getItem(`search-history-${userId || 'anonymous'}`)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setSearchHistory(parsed.map((entry: any) => ({
          ...entry,
          timestamp: new Date(entry.timestamp)
        })))
      } catch (error) {
        console.error("Failed to load search history:", error)
      }
    }

    // Load saved searches
    const savedStored = localStorage.getItem(`saved-searches-${userId || 'anonymous'}`)
    if (savedStored) {
      try {
        const parsed = JSON.parse(savedStored)
        setSavedSearches(parsed.map((search: any) => ({
          ...search,
          createdAt: new Date(search.createdAt),
          lastUsed: search.lastUsed ? new Date(search.lastUsed) : undefined
        })))
      } catch (error) {
        console.error("Failed to load saved searches:", error)
      }
    }

    // Load privacy settings
    const privacyStored = localStorage.getItem(`privacy-settings-${userId || 'anonymous'}`)
    if (privacyStored) {
      try {
        setPrivacySettings(JSON.parse(privacyStored))
      } catch (error) {
        console.error("Failed to load privacy settings:", error)
      }
    }
  }, [userId, privacySettings.saveHistory, privacySettings.incognitoMode])

  // Auto-delete old history based on retention settings
  React.useEffect(() => {
    if (!privacySettings.saveHistory) return

    const deleteOldEntries = () => {
      const now = new Date()
      const retentionDays = {
        "7days": 7,
        "30days": 30,
        "90days": 90,
        "1year": 365,
        "forever": Infinity
      }[privacySettings.dataRetention]

      if (retentionDays === Infinity) return

      setSearchHistory(prev => {
        const filtered = prev.filter(entry => {
          const daysSince = (now.getTime() - entry.timestamp.getTime()) / (1000 * 60 * 60 * 24)
          return daysSince <= retentionDays
        })
        
        // Save to localStorage
        localStorage.setItem(
          `search-history-${userId || 'anonymous'}`,
          JSON.stringify(filtered)
        )
        
        return filtered
      })
    }

    deleteOldEntries()
    const interval = setInterval(deleteOldEntries, 24 * 60 * 60 * 1000) // Check daily

    return () => clearInterval(interval)
  }, [privacySettings.dataRetention, privacySettings.saveHistory, userId])

  // Add entry to search history
  const addToHistory = React.useCallback((entry: Omit<SearchHistoryEntry, "id">) => {
    if (!privacySettings.saveHistory || privacySettings.incognitoMode) return

    const newEntry: SearchHistoryEntry = {
      ...entry,
      id: `search_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    setSearchHistory(prev => {
      const updated = [newEntry, ...prev].slice(0, 100) // Keep last 100 searches
      localStorage.setItem(
        `search-history-${userId || 'anonymous'}`,
        JSON.stringify(updated)
      )
      return updated
    })
  }, [privacySettings.saveHistory, privacySettings.incognitoMode, userId])

  // Clear all history
  const clearHistory = React.useCallback(() => {
    setSearchHistory([])
    localStorage.removeItem(`search-history-${userId || 'anonymous'}`)
    toast.success("Search history cleared")
  }, [userId])

  // Delete specific history entry
  const deleteHistoryEntry = React.useCallback((entryId: string) => {
    setSearchHistory(prev => {
      const updated = prev.filter(entry => entry.id !== entryId)
      localStorage.setItem(
        `search-history-${userId || 'anonymous'}`,
        JSON.stringify(updated)
      )
      return updated
    })
    toast.success("Search removed from history")
  }, [userId])

  // Save a search
  const saveSearch = React.useCallback((
    entry: SearchHistoryEntry,
    name: string,
    enableAlerts: boolean = false
  ) => {
    const newSaved: SavedSearch = {
      id: `saved_${Date.now()}`,
      name,
      query: entry.query,
      filters: entry.filters || {},
      createdAt: new Date(),
      useCount: 0,
      alerts: enableAlerts,
      isPublic: false
    }

    setSavedSearches(prev => {
      const updated = [newSaved, ...prev]
      localStorage.setItem(
        `saved-searches-${userId || 'anonymous'}`,
        JSON.stringify(updated)
      )
      return updated
    })

    if (enableAlerts) {
      const newAlert: SearchAlert = {
        id: `alert_${Date.now()}`,
        savedSearchId: newSaved.id,
        frequency: "daily",
        channels: ["email"],
        enabled: true,
        triggerCount: 0
      }
      setSearchAlerts(prev => [...prev, newAlert])
    }

    toast.success(`Search "${name}" saved`)
    setShowSaveDialog(false)
    setSearchName("")
    setSelectedSearch(null)
  }, [userId])

  // Delete saved search
  const deleteSavedSearch = React.useCallback((searchId: string) => {
    setSavedSearches(prev => {
      const updated = prev.filter(search => search.id !== searchId)
      localStorage.setItem(
        `saved-searches-${userId || 'anonymous'}`,
        JSON.stringify(updated)
      )
      return updated
    })
    
    // Also remove associated alerts
    setSearchAlerts(prev => prev.filter(alert => alert.savedSearchId !== searchId))
    
    toast.success("Saved search deleted")
  }, [userId])

  // Use saved search
  const useSavedSearch = React.useCallback((search: SavedSearch) => {
    setSavedSearches(prev => {
      const updated = prev.map(s => 
        s.id === search.id 
          ? { ...s, lastUsed: new Date(), useCount: s.useCount + 1 }
          : s
      )
      localStorage.setItem(
        `saved-searches-${userId || 'anonymous'}`,
        JSON.stringify(updated)
      )
      return updated
    })
    
    onSearch(search.query, search.filters)
  }, [userId, onSearch])

  // Update privacy settings
  const updatePrivacySettings = React.useCallback((updates: Partial<PrivacySettings>) => {
    const newSettings = { ...privacySettings, ...updates }
    setPrivacySettings(newSettings)
    localStorage.setItem(
      `privacy-settings-${userId || 'anonymous'}`,
      JSON.stringify(newSettings)
    )
    onPrivacyChange?.(newSettings)
    
    if (updates.incognitoMode) {
      toast.info("Incognito mode enabled - searches won't be saved")
    } else if (updates.incognitoMode === false) {
      toast.info("Incognito mode disabled")
    }
  }, [privacySettings, userId, onPrivacyChange])

  // Export search history
  const exportHistory = React.useCallback(() => {
    const data = {
      searchHistory,
      savedSearches,
      privacySettings,
      exportDate: new Date().toISOString()
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ann-pale-search-history-${format(new Date(), "yyyy-MM-dd")}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success("Search history exported")
  }, [searchHistory, savedSearches, privacySettings])

  // Group history by date
  const groupedHistory = React.useMemo(() => {
    const groups: Record<string, SearchHistoryEntry[]> = {}
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    searchHistory.forEach(entry => {
      const entryDate = new Date(entry.timestamp)
      let groupKey: string
      
      if (entryDate.toDateString() === today.toDateString()) {
        groupKey = "Today"
      } else if (entryDate.toDateString() === yesterday.toDateString()) {
        groupKey = "Yesterday"
      } else {
        groupKey = format(entryDate, "MMMM d, yyyy")
      }
      
      if (!groups[groupKey]) groups[groupKey] = []
      groups[groupKey].push(entry)
    })
    
    return groups
  }, [searchHistory])

  return (
    <div className={cn("space-y-4", className)}>
      {/* Privacy Status Bar */}
      <Card className={cn(
        "border-2",
        privacySettings.incognitoMode ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20" : ""
      )}>
        <CardContent className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {privacySettings.incognitoMode ? (
                <>
                  <EyeOff className="h-5 w-5 text-yellow-600" />
                  <div>
                    <p className="text-sm font-medium">Incognito Mode Active</p>
                    <p className="text-xs text-gray-600">Your searches are not being saved</p>
                  </div>
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium">Search History Active</p>
                    <p className="text-xs text-gray-600">
                      {privacySettings.personalizeResults ? "Personalized" : "Standard"} results
                    </p>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowPrivacyDialog(true)}
              >
                <Settings className="h-4 w-4 mr-1" />
                Privacy
              </Button>
              
              <Switch
                checked={privacySettings.incognitoMode}
                onCheckedChange={(checked) => updatePrivacySettings({ incognitoMode: checked })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Searches */}
      {!privacySettings.incognitoMode && searchHistory.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Recent Searches
              </CardTitle>
              
              <div className="flex items-center gap-2">
                <Badge variant="secondary">
                  {searchHistory.length} searches
                </Badge>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={exportHistory}>
                      <Download className="h-4 w-4 mr-2" />
                      Export History
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={clearHistory}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All History
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                {Object.entries(groupedHistory).map(([date, entries]) => (
                  <div key={date}>
                    <h4 className="text-sm font-medium text-gray-600 mb-2">{date}</h4>
                    <div className="space-y-2">
                      {entries.map((entry) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 group"
                        >
                          <div 
                            className="flex items-center gap-3 flex-1 cursor-pointer"
                            onClick={() => onSearch(entry.query, entry.filters)}
                          >
                            <Search className="h-4 w-4 text-gray-400" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{entry.query}</p>
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>{formatDistanceToNow(entry.timestamp, { addSuffix: true })}</span>
                                {entry.resultCount > 0 && (
                                  <>
                                    <span>•</span>
                                    <span>{entry.resultCount} results</span>
                                  </>
                                )}
                                {entry.filters && Object.keys(entry.filters).length > 0 && (
                                  <>
                                    <span>•</span>
                                    <Filter className="h-3 w-3 inline" />
                                    <span>{Object.keys(entry.filters).length} filters</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedSearch(entry)
                                setShowSaveDialog(true)
                              }}
                            >
                              <Star className="h-4 w-4" />
                            </Button>
                            
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation()
                                deleteHistoryEntry(entry.id)
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Saved Searches */}
      {savedSearches.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="h-5 w-5" />
              Saved Searches
            </CardTitle>
          </CardHeader>
          
          <CardContent>
            <div className="grid gap-3">
              {savedSearches.map((search) => (
                <div
                  key={search.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => useSavedSearch(search)}
                  >
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{search.name}</p>
                      {search.alerts && (
                        <Badge variant="secondary" className="text-xs">
                          <Bell className="h-3 w-3 mr-1" />
                          Alerts
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{search.query}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>Created {formatDistanceToNow(search.createdAt, { addSuffix: true })}</span>
                      {search.useCount > 0 && (
                        <span>• Used {search.useCount} times</span>
                      )}
                    </div>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSavedSearch(search.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Save Search Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Search</DialogTitle>
            <DialogDescription>
              Save this search for quick access and optional alerts
            </DialogDescription>
          </DialogHeader>
          
          {selectedSearch && (
            <div className="space-y-4">
              <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                <p className="text-sm font-medium">{selectedSearch.query}</p>
                {selectedSearch.filters && Object.keys(selectedSearch.filters).length > 0 && (
                  <p className="text-xs text-gray-600 mt-1">
                    With {Object.keys(selectedSearch.filters).length} filters applied
                  </p>
                )}
              </div>
              
              <div>
                <Label htmlFor="search-name">Name for this search</Label>
                <Input
                  id="search-name"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="e.g., Comedians under $50"
                  className="mt-1"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="enable-alerts" className="cursor-pointer">
                  Enable alerts for new matches
                </Label>
                <Switch id="enable-alerts" />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={() => {
                if (selectedSearch && searchName) {
                  saveSearch(selectedSearch, searchName, false)
                }
              }}
              disabled={!searchName}
            >
              Save Search
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Privacy Settings Dialog */}
      <Dialog open={showPrivacyDialog} onOpenChange={setShowPrivacyDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Privacy Settings</DialogTitle>
            <DialogDescription>
              Control how your search data is stored and used
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="save-history">Save search history</Label>
                <p className="text-xs text-gray-600">Store your searches locally</p>
              </div>
              <Switch
                id="save-history"
                checked={privacySettings.saveHistory}
                onCheckedChange={(checked) => updatePrivacySettings({ saveHistory: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="personalize">Personalize results</Label>
                <p className="text-xs text-gray-600">Use your history to improve results</p>
              </div>
              <Switch
                id="personalize"
                checked={privacySettings.personalizeResults}
                onCheckedChange={(checked) => updatePrivacySettings({ personalizeResults: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="anonymous">Share anonymous data</Label>
                <p className="text-xs text-gray-600">Help improve the platform</p>
              </div>
              <Switch
                id="anonymous"
                checked={privacySettings.shareAnonymousData}
                onCheckedChange={(checked) => updatePrivacySettings({ shareAnonymousData: checked })}
              />
            </div>
            
            <Separator />
            
            <div>
              <Label>Data retention period</Label>
              <RadioGroup
                value={privacySettings.dataRetention}
                onValueChange={(value: any) => updatePrivacySettings({ dataRetention: value })}
                className="mt-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="7days" id="7days" />
                  <Label htmlFor="7days" className="text-sm cursor-pointer">7 days</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="30days" id="30days" />
                  <Label htmlFor="30days" className="text-sm cursor-pointer">30 days</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="90days" id="90days" />
                  <Label htmlFor="90days" className="text-sm cursor-pointer">90 days</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="1year" id="1year" />
                  <Label htmlFor="1year" className="text-sm cursor-pointer">1 year</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="forever" id="forever" />
                  <Label htmlFor="forever" className="text-sm cursor-pointer">Forever</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPrivacyDialog(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Hook for managing search history
export function useSearchHistory(userId?: string) {
  const [history, setHistory] = React.useState<SearchHistoryEntry[]>([])
  const [isIncognito, setIsIncognito] = React.useState(false)

  const addEntry = React.useCallback((entry: Omit<SearchHistoryEntry, "id">) => {
    if (isIncognito) return

    const newEntry: SearchHistoryEntry = {
      ...entry,
      id: `search_${Date.now()}`
    }

    setHistory(prev => [newEntry, ...prev].slice(0, 100))
  }, [isIncognito])

  const clearHistory = React.useCallback(() => {
    setHistory([])
  }, [])

  const toggleIncognito = React.useCallback(() => {
    setIsIncognito(prev => !prev)
  }, [])

  return {
    history,
    addEntry,
    clearHistory,
    isIncognito,
    toggleIncognito
  }
}