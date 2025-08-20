"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DollarSign,
  Users,
  Calendar,
  Star,
  Globe,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Sparkles,
  Info,
  RotateCcw,
  Clock,
  Video,
  MessageSquare,
  Award,
  MapPin,
  Music,
  Mic,
  Heart,
  Eye,
  Search,
  Settings
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Advanced filter state
export interface AdvancedFilterState {
  // Basic filters
  categories: string[]
  priceRange: [number, number]
  rating: number
  availability: string
  languages: string[]
  
  // Advanced filters
  responseTime: string[]
  verified: boolean
  trending: boolean
  featured: boolean
  videoCount: [number, number]
  reviewCount: [number, number]
  completionRate: number
  specialties: string[]
  location: string[]
  experience: string
  sortBy: string
}

interface AdvancedFilterPanelProps {
  filters: AdvancedFilterState
  onFiltersChange: (filters: AdvancedFilterState) => void
  onReset: () => void
  resultCount?: number
  predictedCount?: number
  isOpen?: boolean
  onClose?: () => void
  savedFilters?: SavedFilter[]
  onSaveFilter?: (name: string, filters: AdvancedFilterState) => void
  className?: string
}

interface SavedFilter {
  id: string
  name: string
  filters: AdvancedFilterState
  createdAt: Date
  usageCount: number
}

// Default filter state
export const DEFAULT_ADVANCED_FILTERS: AdvancedFilterState = {
  categories: [],
  priceRange: [0, 500],
  rating: 0,
  availability: "all",
  languages: [],
  responseTime: [],
  verified: false,
  trending: false,
  featured: false,
  videoCount: [0, 100],
  reviewCount: [0, 1000],
  completionRate: 0,
  specialties: [],
  location: [],
  experience: "all",
  sortBy: "relevance"
}

// Filter categories for progressive disclosure
const FILTER_CATEGORIES = {
  essential: ["categories", "priceRange", "availability", "rating"],
  preferences: ["languages", "responseTime", "verified"],
  advanced: ["videoCount", "reviewCount", "completionRate", "specialties"],
  discovery: ["trending", "featured", "location", "experience"]
}

export function AdvancedFilterPanel({
  filters,
  onFiltersChange,
  onReset,
  resultCount = 0,
  predictedCount,
  isOpen = false,
  onClose,
  savedFilters = [],
  onSaveFilter,
  className
}: AdvancedFilterPanelProps) {
  const [localFilters, setLocalFilters] = React.useState<AdvancedFilterState>(filters)
  const [expandedCategories, setExpandedCategories] = React.useState<string[]>(["essential"])
  const [isCalculating, setIsCalculating] = React.useState(false)
  const [showSaveDialog, setShowSaveDialog] = React.useState(false)
  const [filterName, setFilterName] = React.useState("")
  const [filterChanges, setFilterChanges] = React.useState<string[]>([])
  
  // Track filter changes
  React.useEffect(() => {
    const changes: string[] = []
    
    if (localFilters.categories.length > 0) {
      changes.push(`${localFilters.categories.length} categories`)
    }
    if (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 500) {
      changes.push(`$${localFilters.priceRange[0]}-$${localFilters.priceRange[1]}`)
    }
    if (localFilters.rating > 0) {
      changes.push(`${localFilters.rating}+ stars`)
    }
    if (localFilters.languages.length > 0) {
      changes.push(`${localFilters.languages.length} languages`)
    }
    if (localFilters.verified) {
      changes.push("Verified only")
    }
    
    setFilterChanges(changes)
  }, [localFilters])

  // Update local filters when props change
  React.useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  // Apply filters
  const applyFilters = () => {
    setIsCalculating(true)
    
    setTimeout(() => {
      onFiltersChange(localFilters)
      setIsCalculating(false)
      toast.success(`Filters applied: ${filterChanges.join(", ") || "None"}`)
      onClose?.()
    }, 500)
  }

  // Reset filters
  const resetFilters = () => {
    setLocalFilters(DEFAULT_ADVANCED_FILTERS)
    onReset()
    toast.success("All filters reset")
  }

  // Save current filters
  const saveCurrentFilters = () => {
    if (!filterName.trim()) {
      toast.error("Please enter a name for your filter set")
      return
    }
    
    onSaveFilter?.(filterName, localFilters)
    setFilterName("")
    setShowSaveDialog(false)
    toast.success(`Filter set "${filterName}" saved`)
  }

  // Load saved filter
  const loadSavedFilter = (savedFilter: SavedFilter) => {
    setLocalFilters(savedFilter.filters)
    toast.success(`Loaded filter set "${savedFilter.name}"`)
  }

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  // Check if any filters are active
  const hasActiveFilters = filterChanges.length > 0

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-purple-600" />
              Advanced Filters
            </div>
            {hasActiveFilters && (
              <Badge variant="secondary" className="text-xs">
                {filterChanges.length} active
              </Badge>
            )}
          </SheetTitle>
          <SheetDescription>
            Fine-tune your search with advanced filtering options
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-200px)] mt-6 pr-4">
          <div className="space-y-6">
            {/* Saved filters */}
            {savedFilters.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Saved Filters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {savedFilters.slice(0, 3).map((saved) => (
                    <Button
                      key={saved.id}
                      variant="outline"
                      size="sm"
                      onClick={() => loadSavedFilter(saved)}
                      className="w-full justify-between"
                    >
                      <span>{saved.name}</span>
                      <Badge variant="secondary" className="text-xs">
                        Used {saved.usageCount}x
                      </Badge>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Essential filters (always visible) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">Essential Filters</h3>
                <Badge variant="outline" className="text-xs">
                  Most Used
                </Badge>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <Label className="text-sm">Categories</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Musicians", "Singers", "Comedians", "Actors", "DJs", "Athletes"].map((cat) => (
                    <div key={cat} className="flex items-center space-x-2">
                      <Checkbox
                        id={cat}
                        checked={localFilters.categories.includes(cat.toLowerCase())}
                        onCheckedChange={(checked) => {
                          setLocalFilters(prev => ({
                            ...prev,
                            categories: checked
                              ? [...prev.categories, cat.toLowerCase()]
                              : prev.categories.filter(c => c !== cat.toLowerCase())
                          }))
                        }}
                      />
                      <Label htmlFor={cat} className="text-xs cursor-pointer">
                        {cat}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="space-y-2">
                <Label className="text-sm">
                  Price Range: ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
                </Label>
                <Slider
                  value={localFilters.priceRange}
                  onValueChange={(value) => {
                    setLocalFilters(prev => ({
                      ...prev,
                      priceRange: value as [number, number]
                    }))
                  }}
                  max={500}
                  step={10}
                  className="mt-2"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>$0</span>
                  <span>$500+</span>
                </div>
              </div>

              {/* Availability */}
              <div className="space-y-2">
                <Label className="text-sm">Availability</Label>
                <RadioGroup
                  value={localFilters.availability}
                  onValueChange={(value) => {
                    setLocalFilters(prev => ({ ...prev, availability: value }))
                  }}
                >
                  {[
                    { value: "all", label: "All Creators" },
                    { value: "available", label: "Available Now" },
                    { value: "this-week", label: "This Week" },
                    { value: "this-month", label: "This Month" }
                  ].map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={option.value} />
                      <Label htmlFor={option.value} className="text-xs cursor-pointer">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label className="text-sm">
                  Minimum Rating: {localFilters.rating > 0 ? `${localFilters.rating}+ stars` : "Any"}
                </Label>
                <div className="flex gap-2">
                  {[0, 3, 3.5, 4, 4.5].map((rating) => (
                    <Button
                      key={rating}
                      variant={localFilters.rating === rating ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setLocalFilters(prev => ({ ...prev, rating }))
                      }}
                      className="flex-1"
                    >
                      {rating === 0 ? "Any" : `${rating}+`}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Separator />

            {/* Progressive disclosure sections */}
            <Accordion type="multiple" value={expandedCategories}>
              {/* Preferences */}
              <AccordionItem value="preferences">
                <AccordionTrigger className="text-sm">
                  <div className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Preferences
                    {(localFilters.languages.length > 0 || localFilters.responseTime.length > 0 || localFilters.verified) && (
                      <Badge variant="secondary" className="text-xs ml-2">
                        Active
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  {/* Languages */}
                  <div className="space-y-2">
                    <Label className="text-sm">Languages</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { id: "english", label: "English", flag: "🇺🇸" },
                        { id: "french", label: "French", flag: "🇫🇷" },
                        { id: "kreyol", label: "Kreyòl", flag: "🇭🇹" },
                        { id: "spanish", label: "Spanish", flag: "🇪🇸" }
                      ].map((lang) => (
                        <div key={lang.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={lang.id}
                            checked={localFilters.languages.includes(lang.id)}
                            onCheckedChange={(checked) => {
                              setLocalFilters(prev => ({
                                ...prev,
                                languages: checked
                                  ? [...prev.languages, lang.id]
                                  : prev.languages.filter(l => l !== lang.id)
                              }))
                            }}
                          />
                          <Label htmlFor={lang.id} className="text-xs cursor-pointer">
                            {lang.flag} {lang.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Response Time */}
                  <div className="space-y-2">
                    <Label className="text-sm">Response Time</Label>
                    <div className="space-y-2">
                      {[
                        { id: "24hr", label: "Within 24 hours", icon: "⚡" },
                        { id: "2days", label: "Within 2 days", icon: "🚀" },
                        { id: "3days", label: "Within 3 days", icon: "📅" },
                        { id: "1week", label: "Within 1 week", icon: "📆" }
                      ].map((time) => (
                        <div key={time.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={time.id}
                            checked={localFilters.responseTime.includes(time.id)}
                            onCheckedChange={(checked) => {
                              setLocalFilters(prev => ({
                                ...prev,
                                responseTime: checked
                                  ? [...prev.responseTime, time.id]
                                  : prev.responseTime.filter(t => t !== time.id)
                              }))
                            }}
                          />
                          <Label htmlFor={time.id} className="text-xs cursor-pointer">
                            {time.icon} {time.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verified Only */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="verified" className="text-sm cursor-pointer">
                      Verified Creators Only
                    </Label>
                    <Switch
                      id="verified"
                      checked={localFilters.verified}
                      onCheckedChange={(checked) => {
                        setLocalFilters(prev => ({ ...prev, verified: checked }))
                      }}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Advanced */}
              <AccordionItem value="advanced">
                <AccordionTrigger className="text-sm">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Advanced
                    {(localFilters.videoCount[1] < 100 || localFilters.reviewCount[1] < 1000 || localFilters.completionRate > 0) && (
                      <Badge variant="secondary" className="text-xs ml-2">
                        Active
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  {/* Video Count */}
                  <div className="space-y-2">
                    <Label className="text-sm">
                      Video Count: {localFilters.videoCount[0]} - {localFilters.videoCount[1]}
                    </Label>
                    <Slider
                      value={localFilters.videoCount}
                      onValueChange={(value) => {
                        setLocalFilters(prev => ({
                          ...prev,
                          videoCount: value as [number, number]
                        }))
                      }}
                      max={100}
                      step={5}
                    />
                  </div>

                  {/* Review Count */}
                  <div className="space-y-2">
                    <Label className="text-sm">
                      Review Count: {localFilters.reviewCount[0]} - {localFilters.reviewCount[1]}
                    </Label>
                    <Slider
                      value={localFilters.reviewCount}
                      onValueChange={(value) => {
                        setLocalFilters(prev => ({
                          ...prev,
                          reviewCount: value as [number, number]
                        }))
                      }}
                      max={1000}
                      step={50}
                    />
                  </div>

                  {/* Completion Rate */}
                  <div className="space-y-2">
                    <Label className="text-sm">
                      Min Completion Rate: {localFilters.completionRate}%
                    </Label>
                    <Slider
                      value={[localFilters.completionRate]}
                      onValueChange={(value) => {
                        setLocalFilters(prev => ({
                          ...prev,
                          completionRate: value[0]
                        }))
                      }}
                      max={100}
                      step={5}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Discovery */}
              <AccordionItem value="discovery">
                <AccordionTrigger className="text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Discovery
                    {(localFilters.trending || localFilters.featured) && (
                      <Badge variant="secondary" className="text-xs ml-2">
                        Active
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="trending" className="text-sm cursor-pointer">
                        Trending Creators
                      </Label>
                      <Switch
                        id="trending"
                        checked={localFilters.trending}
                        onCheckedChange={(checked) => {
                          setLocalFilters(prev => ({ ...prev, trending: checked }))
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="featured" className="text-sm cursor-pointer">
                        Featured Creators
                      </Label>
                      <Switch
                        id="featured"
                        checked={localFilters.featured}
                        onCheckedChange={(checked) => {
                          setLocalFilters(prev => ({ ...prev, featured: checked }))
                        }}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Filter summary */}
            {hasActiveFilters && (
              <Card className="bg-purple-50 dark:bg-purple-900/20">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-purple-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-purple-900 dark:text-purple-200">
                        Active Filters
                      </p>
                      <p className="text-xs text-purple-700 dark:text-purple-300 mt-1">
                        {filterChanges.join(" • ")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Result prediction */}
            {predictedCount !== undefined && predictedCount !== resultCount && (
              <Card className="bg-blue-50 dark:bg-blue-900/20">
                <CardContent className="p-3">
                  <div className="flex items-start gap-2">
                    <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-200">
                        Result Prediction
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        These filters will show approximately {predictedCount} results
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        <SheetFooter className="mt-6">
          <div className="flex items-center justify-between w-full gap-2">
            <Button
              variant="outline"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            
            <div className="flex gap-2">
              {onSaveFilter && hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={() => setShowSaveDialog(true)}
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
              )}
              
              <Button
                onClick={applyFilters}
                disabled={isCalculating}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isCalculating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Applying...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Apply Filters
                  </>
                )}
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

// Filter persistence hook
export function useFilterPersistence() {
  const STORAGE_KEY = "ann-pale-saved-filters"
  
  const [savedFilters, setSavedFilters] = React.useState<SavedFilter[]>([])

  // Load saved filters from localStorage
  React.useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setSavedFilters(parsed)
      } catch (error) {
        console.error("Failed to load saved filters:", error)
      }
    }
  }, [])

  // Save filter
  const saveFilter = React.useCallback((name: string, filters: AdvancedFilterState) => {
    const newFilter: SavedFilter = {
      id: `filter_${Date.now()}`,
      name,
      filters,
      createdAt: new Date(),
      usageCount: 0
    }

    setSavedFilters(prev => {
      const updated = [newFilter, ...prev].slice(0, 10) // Keep only 10 most recent
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  // Use filter (increment usage count)
  const useFilter = React.useCallback((filterId: string) => {
    setSavedFilters(prev => {
      const updated = prev.map(f => 
        f.id === filterId 
          ? { ...f, usageCount: f.usageCount + 1 }
          : f
      )
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  // Delete filter
  const deleteFilter = React.useCallback((filterId: string) => {
    setSavedFilters(prev => {
      const updated = prev.filter(f => f.id !== filterId)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  return {
    savedFilters,
    saveFilter,
    useFilter,
    deleteFilter
  }
}

export default AdvancedFilterPanel
