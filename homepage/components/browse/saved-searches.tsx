"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Bell,
  BellOff,
  Save,
  Search,
  Trash2,
  Edit,
  Plus,
  Clock,
  TrendingUp,
  Filter,
  Star,
  ChevronRight,
  Mail,
  Smartphone,
  Globe,
  Calendar,
  AlertCircle,
  CheckCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import type { FilterState } from "./filter-sidebar"

export interface SavedSearch {
  id: string
  name: string
  query?: string
  filters: Partial<FilterState>
  createdAt: Date
  lastUsed?: Date
  useCount: number
  alertEnabled: boolean
  alertFrequency?: "instant" | "daily" | "weekly"
  alertChannel?: "email" | "push" | "both"
  matchCount?: number
  newMatches?: number
  tags?: string[]
}

export interface SearchAlert {
  id: string
  searchId: string
  frequency: "instant" | "daily" | "weekly"
  channel: "email" | "push" | "both"
  lastSent?: Date
  matchesSent: number
  enabled: boolean
}

interface SavedSearchesProps {
  currentQuery?: string
  currentFilters?: FilterState
  onLoadSearch: (search: SavedSearch) => void
  onDeleteSearch?: (id: string) => void
  className?: string
}

// Default saved searches for new users
const defaultSearches: SavedSearch[] = [
  {
    id: "popular-musicians",
    name: "Popular Musicians",
    filters: {
      categories: ["musician"],
      rating: 4.5
    },
    createdAt: new Date(),
    useCount: 0,
    alertEnabled: false,
    tags: ["music", "popular"]
  },
  {
    id: "budget-friendly",
    name: "Budget Friendly",
    filters: {
      priceRange: [0, 50]
    },
    createdAt: new Date(),
    useCount: 0,
    alertEnabled: false,
    tags: ["budget"]
  },
  {
    id: "fast-response",
    name: "Fast Response",
    filters: {
      responseTime: ["24hr"]
    },
    createdAt: new Date(),
    useCount: 0,
    alertEnabled: false,
    tags: ["quick"]
  }
]

export function SavedSearches({
  currentQuery,
  currentFilters,
  onLoadSearch,
  onDeleteSearch,
  className
}: SavedSearchesProps) {
  const [searches, setSearches] = React.useState<SavedSearch[]>(() => {
    // Load from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("savedSearches")
      return saved ? JSON.parse(saved) : defaultSearches
    }
    return defaultSearches
  })
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)
  const [editingSearch, setEditingSearch] = React.useState<SavedSearch | null>(null)
  const [newSearchName, setNewSearchName] = React.useState("")
  const [alertEnabled, setAlertEnabled] = React.useState(false)
  const [alertFrequency, setAlertFrequency] = React.useState<"instant" | "daily" | "weekly">("daily")
  const [alertChannel, setAlertChannel] = React.useState<"email" | "push" | "both">("email")
  
  // Save to localStorage whenever searches change
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("savedSearches", JSON.stringify(searches))
    }
  }, [searches])
  
  // Check for new matches periodically
  React.useEffect(() => {
    const checkNewMatches = () => {
      setSearches(prev => prev.map(search => {
        // Simulate checking for new matches
        const hasNewMatches = Math.random() > 0.7
        return {
          ...search,
          newMatches: hasNewMatches ? Math.floor(Math.random() * 5) + 1 : 0
        }
      }))
    }
    
    const interval = setInterval(checkNewMatches, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])
  
  // Save current search
  const saveCurrentSearch = () => {
    if (!newSearchName.trim()) {
      toast.error("Please enter a name for the search")
      return
    }
    
    const newSearch: SavedSearch = {
      id: `search-${Date.now()}`,
      name: newSearchName,
      query: currentQuery,
      filters: currentFilters || {},
      createdAt: new Date(),
      useCount: 0,
      alertEnabled,
      alertFrequency: alertEnabled ? alertFrequency : undefined,
      alertChannel: alertEnabled ? alertChannel : undefined,
      matchCount: 0,
      newMatches: 0
    }
    
    setSearches(prev => [newSearch, ...prev])
    setIsCreateDialogOpen(false)
    setNewSearchName("")
    setAlertEnabled(false)
    
    toast.success("Search saved successfully", {
      description: alertEnabled ? "You'll receive alerts for new matches" : undefined
    })
  }
  
  // Update search
  const updateSearch = (id: string, updates: Partial<SavedSearch>) => {
    setSearches(prev => prev.map(search => 
      search.id === id ? { ...search, ...updates } : search
    ))
    setEditingSearch(null)
    toast.success("Search updated")
  }
  
  // Delete search
  const deleteSearch = (id: string) => {
    setSearches(prev => prev.filter(search => search.id !== id))
    onDeleteSearch?.(id)
    toast.success("Search deleted")
  }
  
  // Load search
  const loadSearch = (search: SavedSearch) => {
    // Update use count and last used
    setSearches(prev => prev.map(s => 
      s.id === search.id 
        ? { ...s, useCount: s.useCount + 1, lastUsed: new Date() }
        : s
    ))
    
    onLoadSearch(search)
    toast.success(`Loaded: ${search.name}`)
  }
  
  // Toggle alert
  const toggleAlert = (id: string) => {
    setSearches(prev => prev.map(search => 
      search.id === id 
        ? { ...search, alertEnabled: !search.alertEnabled }
        : search
    ))
  }
  
  const hasCurrentSearch = currentQuery || (currentFilters && Object.keys(currentFilters).length > 0)
  
  return (
    <div className={cn("space-y-4", className)}>
      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Save className="h-5 w-5" />
              Saved Searches
            </CardTitle>
            {hasCurrentSearch && (
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="h-4 w-4 mr-1" />
                    Save Current
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Save Current Search</DialogTitle>
                    <DialogDescription>
                      Save your current search filters to quickly access them later
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label htmlFor="search-name">Search Name</Label>
                      <Input
                        id="search-name"
                        value={newSearchName}
                        onChange={(e) => setNewSearchName(e.target.value)}
                        placeholder="e.g., Birthday Musicians"
                      />
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="alerts">Enable Alerts</Label>
                          <p className="text-xs text-gray-500">
                            Get notified when new creators match
                          </p>
                        </div>
                        <Switch
                          id="alerts"
                          checked={alertEnabled}
                          onCheckedChange={setAlertEnabled}
                        />
                      </div>
                      
                      {alertEnabled && (
                        <>
                          <div className="space-y-2">
                            <Label>Alert Frequency</Label>
                            <Select value={alertFrequency} onValueChange={(v: any) => setAlertFrequency(v)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="instant">Instant</SelectItem>
                                <SelectItem value="daily">Daily Digest</SelectItem>
                                <SelectItem value="weekly">Weekly Summary</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Alert Channel</Label>
                            <Select value={alertChannel} onValueChange={(v: any) => setAlertChannel(v)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="email">
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4" />
                                    Email
                                  </div>
                                </SelectItem>
                                <SelectItem value="push">
                                  <div className="flex items-center gap-2">
                                    <Smartphone className="h-4 w-4" />
                                    Push Notification
                                  </div>
                                </SelectItem>
                                <SelectItem value="both">
                                  <div className="flex items-center gap-2">
                                    <Globe className="h-4 w-4" />
                                    Both
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <Button onClick={saveCurrentSearch} className="flex-1">
                        Save Search
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateDialogOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {searches.length === 0 ? (
            <div className="text-center py-6">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">No saved searches yet</p>
              <p className="text-xs text-gray-400 mt-1">
                Save your search to quickly access it later
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <AnimatePresence mode="popLayout">
                {searches.map((search) => (
                  <motion.div
                    key={search.id}
                    layout
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="group"
                  >
                    <div className="flex items-center gap-2 p-3 rounded-lg border hover:border-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition">
                      <button
                        onClick={() => loadSearch(search)}
                        className="flex-1 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-sm">{search.name}</span>
                                {search.newMatches && search.newMatches > 0 && (
                                  <Badge variant="destructive" className="text-xs">
                                    {search.newMatches} new
                                  </Badge>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-xs text-gray-500">
                                {search.query && (
                                  <span className="truncate max-w-[150px]">
                                    "{search.query}"
                                  </span>
                                )}
                                {Object.keys(search.filters).length > 0 && (
                                  <div className="flex items-center gap-1">
                                    <Filter className="h-3 w-3" />
                                    <span>{Object.keys(search.filters).length} filters</span>
                                  </div>
                                )}
                                {search.useCount > 0 && (
                                  <div className="flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>Used {search.useCount}x</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition" />
                        </div>
                      </button>
                      
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => toggleAlert(search.id)}
                          className="h-8 w-8"
                        >
                          {search.alertEnabled ? (
                            <Bell className="h-4 w-4 text-purple-600" />
                          ) : (
                            <BellOff className="h-4 w-4 text-gray-400" />
                          )}
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingSearch(search)}
                          className="h-8 w-8"
                        >
                          <Edit className="h-4 w-4 text-gray-400" />
                        </Button>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteSearch(search.id)}
                          className="h-8 w-8"
                        >
                          <Trash2 className="h-4 w-4 text-gray-400 hover:text-red-600" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
          
          {/* Alert Summary */}
          {searches.some(s => s.alertEnabled) && (
            <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-center gap-2 text-sm">
                <Bell className="h-4 w-4 text-purple-600" />
                <span className="font-medium">
                  {searches.filter(s => s.alertEnabled).length} active alerts
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                You'll be notified when new creators match your saved searches
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Edit Dialog */}
      {editingSearch && (
        <Dialog open={!!editingSearch} onOpenChange={() => setEditingSearch(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Saved Search</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label>Search Name</Label>
                <Input
                  value={editingSearch.name}
                  onChange={(e) => setEditingSearch({
                    ...editingSearch,
                    name: e.target.value
                  })}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Alert Settings</Label>
                  <Switch
                    checked={editingSearch.alertEnabled}
                    onCheckedChange={(checked) => setEditingSearch({
                      ...editingSearch,
                      alertEnabled: checked
                    })}
                  />
                </div>
                
                {editingSearch.alertEnabled && (
                  <>
                    <Select
                      value={editingSearch.alertFrequency}
                      onValueChange={(v: any) => setEditingSearch({
                        ...editingSearch,
                        alertFrequency: v
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instant">Instant</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Select
                      value={editingSearch.alertChannel}
                      onValueChange={(v: any) => setEditingSearch({
                        ...editingSearch,
                        alertChannel: v
                      })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select channel" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="push">Push</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                      </SelectContent>
                    </Select>
                  </>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => updateSearch(editingSearch.id, editingSearch)}
                  className="flex-1"
                >
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setEditingSearch(null)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Alert History Component
export function AlertHistory({ searchId }: { searchId?: string }) {
  const [alerts] = React.useState([
    {
      id: "1",
      searchName: "Popular Musicians",
      timestamp: new Date(Date.now() - 3600000),
      matchCount: 3,
      status: "sent"
    },
    {
      id: "2", 
      searchName: "Budget Friendly",
      timestamp: new Date(Date.now() - 7200000),
      matchCount: 5,
      status: "sent"
    }
  ])
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Alert History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {alerts.map((alert) => (
            <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="space-y-1">
                <p className="text-sm font-medium">{alert.searchName}</p>
                <p className="text-xs text-gray-500">
                  {alert.matchCount} new matches • {alert.timestamp.toLocaleString()}
                </p>
              </div>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}