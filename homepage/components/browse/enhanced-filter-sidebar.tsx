"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  X, 
  ChevronDown, 
  ChevronUp,
  Star,
  DollarSign,
  Clock,
  Globe,
  Calendar,
  Filter,
  RotateCcw,
  Info,
  Sparkles,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { FilterPresets } from "./filter-presets"
import { RecentSearches } from "./recent-searches"
import type { FilterState } from "./filter-sidebar"
import type { FilterPreset, RecentSearch } from "@/hooks/use-filter-persistence"

interface EnhancedFilterSidebarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onReset: () => void
  totalResults?: number
  isLoading?: boolean
  className?: string
  isMobile?: boolean
  onClose?: () => void
  presets?: FilterPreset[]
  onSavePreset?: (name: string, description: string, icon?: string) => void
  onLoadPreset?: (preset: FilterPreset) => void
  onDeletePreset?: (presetId: string) => void
  onShareFilters?: () => void
  recentSearches?: RecentSearch[]
  onSelectRecentSearch?: (search: RecentSearch) => void
  onClearRecentSearches?: () => void
  showAdvanced?: boolean
  onToggleAdvanced?: () => void
}

const categories = [
  { id: "musician", label: "Musicians", count: 45, emoji: "🎵", popular: true },
  { id: "singer", label: "Singers", count: 38, emoji: "🎤", popular: true },
  { id: "comedian", label: "Comedians", count: 22, emoji: "😂", popular: true },
  { id: "actor", label: "Actors", count: 18, emoji: "🎭" },
  { id: "dj", label: "DJs", count: 24, emoji: "🎧" },
  { id: "radio-host", label: "Radio Hosts", count: 12, emoji: "📻" },
  { id: "influencer", label: "Influencers", count: 31, emoji: "📱" },
  { id: "athlete", label: "Athletes", count: 15, emoji: "🏆" },
]

const responseTimes = [
  { id: "24hr", label: "24 hours", icon: "⚡", description: "Get your video within a day" },
  { id: "2days", label: "2 days", icon: "🚀", description: "Quick turnaround" },
  { id: "3days", label: "3 days", icon: "📅", description: "Standard delivery" },
  { id: "1week", label: "1 week", icon: "📆", description: "More time for quality" },
]

const languages = [
  { id: "english", label: "English", flag: "🇺🇸", speakers: "2.1K" },
  { id: "french", label: "French", flag: "🇫🇷", speakers: "1.8K" },
  { id: "kreyol", label: "Kreyòl", flag: "🇭🇹", speakers: "3.2K" },
  { id: "spanish", label: "Spanish", flag: "🇪🇸", speakers: "890" },
]

const availabilityOptions = [
  { id: "all", label: "All Creators", description: "Show everyone" },
  { id: "available", label: "Available Now", description: "Ready to create videos" },
  { id: "this-week", label: "This Week", description: "Available in 7 days" },
  { id: "this-month", label: "This Month", description: "Available in 30 days" },
]

export function EnhancedFilterSidebar({
  filters,
  onFiltersChange,
  onReset,
  totalResults = 0,
  isLoading = false,
  className,
  isMobile = false,
  onClose,
  presets = [],
  onSavePreset,
  onLoadPreset,
  onDeletePreset,
  onShareFilters,
  recentSearches = [],
  onSelectRecentSearch,
  onClearRecentSearches,
  showAdvanced = false,
  onToggleAdvanced
}: EnhancedFilterSidebarProps) {
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    categories: true,
    price: true,
    rating: true,
    response: false,
    languages: false,
    availability: false,
  })

  const [showMoreCategories, setShowMoreCategories] = React.useState(false)

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(c => c !== categoryId)
      : [...filters.categories, categoryId]
    updateFilter("categories", newCategories)
  }

  const handleLanguageToggle = (languageId: string) => {
    const newLanguages = filters.languages.includes(languageId)
      ? filters.languages.filter(l => l !== languageId)
      : [...filters.languages, languageId]
    updateFilter("languages", newLanguages)
  }

  const handleResponseTimeToggle = (timeId: string) => {
    const newTimes = filters.responseTime.includes(timeId)
      ? filters.responseTime.filter(t => t !== timeId)
      : [...filters.responseTime, timeId]
    updateFilter("responseTime", newTimes)
  }

  const activeFiltersCount = 
    filters.categories.length +
    filters.languages.length +
    filters.responseTime.length +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 500 ? 1 : 0) +
    (filters.rating > 0 ? 1 : 0) +
    (filters.availability !== "all" ? 1 : 0) +
    (filters.verified ? 1 : 0)

  // Determine which categories to show based on progressive disclosure
  const visibleCategories = showMoreCategories 
    ? categories 
    : categories.filter(c => c.popular).slice(0, 3)

  // Get filter hints based on current state
  const getFilterHints = () => {
    const hints = []
    
    if (filters.categories.length > 2) {
      hints.push("Try narrowing down to 1-2 categories for better results")
    }
    
    if (filters.priceRange[1] < 100) {
      hints.push("Consider increasing your budget to see more options")
    }
    
    if (filters.rating >= 4.8) {
      hints.push("High rating filter active - showing only top creators")
    }
    
    if (filters.verified && filters.categories.length === 0) {
      hints.push("Combine verified filter with categories for best results")
    }
    
    return hints
  }

  const filterHints = getFilterHints()

  return (
    <TooltipProvider>
      <div className={cn("bg-white dark:bg-gray-800 rounded-lg", className)}>
        {/* Mobile Header */}
        {isMobile && (
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              <h2 className="text-lg font-semibold">Filters</h2>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Desktop Header */}
        {!isMobile && (
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-semibold">Filters</h2>
              {activeFiltersCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onReset}
                  className="h-8 text-sm"
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reset
                </Button>
              )}
            </div>
            {isLoading ? (
              <Skeleton className="h-4 w-24" />
            ) : (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {totalResults} creators found
              </p>
            )}
          </div>
        )}

        {/* Filter Presets */}
        {onLoadPreset && (
          <div className="p-4 border-b">
            <FilterPresets
              currentFilters={filters}
              presets={presets}
              onSavePreset={onSavePreset!}
              onLoadPreset={onLoadPreset}
              onDeletePreset={onDeletePreset!}
              onShareFilters={onShareFilters!}
            />
          </div>
        )}

        {/* Recent Searches */}
        {recentSearches.length > 0 && onSelectRecentSearch && (
          <div className="p-4 border-b">
            <RecentSearches
              searches={recentSearches}
              onSelectSearch={onSelectRecentSearch}
              onClearAll={onClearRecentSearches!}
              variant="sidebar"
            />
          </div>
        )}

        <ScrollArea className={cn(
          "flex-1",
          isMobile ? "h-[calc(100vh-16rem)]" : "h-[calc(100vh-20rem)]"
        )}>
          <div className="p-4 space-y-6">
            {/* Filter Hints */}
            {filterHints.length > 0 && (
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-purple-700 dark:text-purple-300">
                  <Sparkles className="h-4 w-4" />
                  Filter Tips
                </div>
                {filterHints.map((hint, index) => (
                  <p key={index} className="text-xs text-purple-600 dark:text-purple-400">
                    • {hint}
                  </p>
                ))}
              </div>
            )}

            {/* Categories - Progressive Disclosure */}
            <div>
              <button
                onClick={() => toggleSection("categories")}
                className="flex items-center justify-between w-full text-left mb-3"
              >
                <h3 className="font-medium">Categories</h3>
                <div className="flex items-center gap-2">
                  {filters.categories.length > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {filters.categories.length}
                    </Badge>
                  )}
                  {expandedSections.categories ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </div>
              </button>
              <AnimatePresence>
                {expandedSections.categories && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2 overflow-hidden"
                  >
                    {visibleCategories.map((category) => (
                      <label
                        key={category.id}
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition"
                      >
                        <Checkbox
                          checked={filters.categories.includes(category.id)}
                          onCheckedChange={() => handleCategoryToggle(category.id)}
                        />
                        <span className="text-sm flex-1">
                          <span className="mr-1">{category.emoji}</span>
                          {category.label}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({category.count})
                        </span>
                      </label>
                    ))}
                    
                    {!showMoreCategories && categories.length > 3 && (
                      <button
                        onClick={() => setShowMoreCategories(true)}
                        className="w-full text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition py-2 flex items-center justify-center gap-1"
                      >
                        Show {categories.length - 3} more categories
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    )}
                    
                    {showMoreCategories && (
                      <button
                        onClick={() => setShowMoreCategories(false)}
                        className="w-full text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition py-2 flex items-center justify-center gap-1"
                      >
                        Show less
                        <ChevronUp className="h-3 w-3" />
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Separator />

            {/* Price Range */}
            <div>
              <button
                onClick={() => toggleSection("price")}
                className="flex items-center justify-between w-full text-left mb-3"
              >
                <h3 className="font-medium flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Price Range
                </h3>
                {expandedSections.price ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.price && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div className="px-2">
                      <Slider
                        value={filters.priceRange}
                        onValueChange={(value) => updateFilter("priceRange", value as [number, number])}
                        min={0}
                        max={500}
                        step={10}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ${filters.priceRange[0]}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          ${filters.priceRange[1]}+
                        </span>
                      </div>
                      
                      {/* Quick price presets */}
                      <div className="flex gap-2 mt-3">
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                          onClick={() => updateFilter("priceRange", [0, 50])}
                        >
                          Under $50
                        </Badge>
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                          onClick={() => updateFilter("priceRange", [50, 150])}
                        >
                          $50-$150
                        </Badge>
                        <Badge
                          variant="outline"
                          className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                          onClick={() => updateFilter("priceRange", [150, 500])}
                        >
                          $150+
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Separator />

            {/* Rating */}
            <div>
              <button
                onClick={() => toggleSection("rating")}
                className="flex items-center justify-between w-full text-left mb-3"
              >
                <h3 className="font-medium flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Minimum Rating
                </h3>
                {expandedSections.rating ? (
                  <ChevronUp className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                )}
              </button>
              <AnimatePresence>
                {expandedSections.rating && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-2 overflow-hidden"
                  >
                    <RadioGroup
                      value={filters.rating.toString()}
                      onValueChange={(value) => updateFilter("rating", parseFloat(value))}
                    >
                      {[0, 4, 4.5, 4.8].map((rating) => (
                        <label
                          key={rating}
                          className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition"
                        >
                          <RadioGroupItem value={rating.toString()} />
                          <span className="text-sm flex-1">
                            {rating === 0 ? (
                              "Any rating"
                            ) : (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{rating}+ stars</span>
                              </div>
                            )}
                          </span>
                        </label>
                      ))}
                    </RadioGroup>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Advanced Filters Toggle */}
            {!showAdvanced && (
              <button
                onClick={onToggleAdvanced}
                className="w-full py-3 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition flex items-center justify-between group"
              >
                <span className="text-sm font-medium">More Filters</span>
                <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition" />
              </button>
            )}

            {/* Advanced Filters */}
            {showAdvanced && (
              <>
                <Separator />

                {/* Response Time */}
                <div>
                  <button
                    onClick={() => toggleSection("response")}
                    className="flex items-center justify-between w-full text-left mb-3"
                  >
                    <h3 className="font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Response Time
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>How quickly creators typically deliver videos</p>
                        </TooltipContent>
                      </Tooltip>
                    </h3>
                    {expandedSections.response ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSections.response && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2 overflow-hidden"
                      >
                        {responseTimes.map((time) => (
                          <label
                            key={time.id}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition"
                          >
                            <Checkbox
                              checked={filters.responseTime.includes(time.id)}
                              onCheckedChange={() => handleResponseTimeToggle(time.id)}
                            />
                            <div className="flex-1">
                              <div className="flex items-center gap-1">
                                <span className="text-sm">
                                  <span className="mr-1">{time.icon}</span>
                                  {time.label}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500">{time.description}</p>
                            </div>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Separator />

                {/* Languages */}
                <div>
                  <button
                    onClick={() => toggleSection("languages")}
                    className="flex items-center justify-between w-full text-left mb-3"
                  >
                    <h3 className="font-medium flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Languages
                    </h3>
                    {expandedSections.languages ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSections.languages && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2 overflow-hidden"
                      >
                        {languages.map((language) => (
                          <label
                            key={language.id}
                            className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition"
                          >
                            <Checkbox
                              checked={filters.languages.includes(language.id)}
                              onCheckedChange={() => handleLanguageToggle(language.id)}
                            />
                            <span className="text-sm flex-1">
                              <span className="mr-1">{language.flag}</span>
                              {language.label}
                            </span>
                            <span className="text-xs text-gray-500">
                              {language.speakers}
                            </span>
                          </label>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Separator />

                {/* Availability */}
                <div>
                  <button
                    onClick={() => toggleSection("availability")}
                    className="flex items-center justify-between w-full text-left mb-3"
                  >
                    <h3 className="font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Availability
                    </h3>
                    {expandedSections.availability ? (
                      <ChevronUp className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedSections.availability && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2 overflow-hidden"
                      >
                        <RadioGroup
                          value={filters.availability}
                          onValueChange={(value) => updateFilter("availability", value)}
                        >
                          {availabilityOptions.map((option) => (
                            <label
                              key={option.id}
                              className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-lg transition"
                            >
                              <RadioGroupItem value={option.id} />
                              <div className="flex-1">
                                <p className="text-sm">{option.label}</p>
                                <p className="text-xs text-gray-500">{option.description}</p>
                              </div>
                            </label>
                          ))}
                        </RadioGroup>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Separator />

                {/* Verified Only */}
                <div className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="verified" className="text-sm font-medium cursor-pointer">
                      Verified Creators Only
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Creators verified by our team for authenticity</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Switch
                    id="verified"
                    checked={filters.verified}
                    onCheckedChange={(checked) => updateFilter("verified", checked)}
                  />
                </div>

                {showAdvanced && (
                  <button
                    onClick={onToggleAdvanced}
                    className="w-full text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition py-2"
                  >
                    Show fewer filters
                  </button>
                )}
              </>
            )}
          </div>
        </ScrollArea>

        {/* Mobile Footer */}
        {isMobile && (
          <div className="p-4 border-t bg-gray-50 dark:bg-gray-700">
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onReset}
              >
                Reset
              </Button>
              <Button
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={onClose}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <RefreshCw className="h-4 w-4" />
                    </motion.div>
                    Updating...
                  </span>
                ) : (
                  `Show ${totalResults} Results`
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}