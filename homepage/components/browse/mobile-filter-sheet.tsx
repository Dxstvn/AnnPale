"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { 
  X,
  Check,
  ChevronRight,
  DollarSign,
  Globe,
  Clock,
  Star,
  Calendar,
  MapPin,
  Sparkles,
  TrendingUp,
  Filter
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion"
import type { FilterState } from "./filter-sidebar"

interface MobileFilterSheetProps {
  isOpen: boolean
  onClose: () => void
  filters: FilterState
  onFilterChange: (filters: FilterState) => void
  creatorCount?: number
}

// Quick filter presets
const filterPresets = [
  {
    id: "budget",
    label: "Budget Friendly",
    icon: DollarSign,
    filters: { priceRange: [0, 50] }
  },
  {
    id: "today",
    label: "Available Today",
    icon: Calendar,
    filters: { availability: "today" }
  },
  {
    id: "verified",
    label: "Verified Only",
    icon: Check,
    filters: { verified: true }
  },
  {
    id: "trending",
    label: "Trending",
    icon: TrendingUp,
    filters: { sortBy: "trending" }
  }
]

const categories = [
  "Musicians",
  "Comedians",
  "Athletes", 
  "Influencers",
  "DJs",
  "Radio Hosts",
  "Actors",
  "Chefs"
]

const languages = [
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "ht", label: "Kreyòl", flag: "🇭🇹" },
  { code: "es", label: "Español", flag: "🇪🇸" }
]

const responseTimes = [
  { value: "1h", label: "Within 1 hour" },
  { value: "24h", label: "Within 24 hours" },
  { value: "48h", label: "Within 2 days" },
  { value: "1w", label: "Within 1 week" }
]

export function MobileFilterSheet({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  creatorCount = 0
}: MobileFilterSheetProps) {
  const [localFilters, setLocalFilters] = React.useState<FilterState>(filters)
  const [activeSection, setActiveSection] = React.useState<string | null>(null)
  const y = useMotionValue(0)
  const sheetRef = React.useRef<HTMLDivElement>(null)
  
  // Calculate drag progress
  const dragProgress = useTransform(y, [0, 300], [0, 1])
  const sheetOpacity = useTransform(dragProgress, [0, 1], [1, 0])

  React.useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleApply = () => {
    onFilterChange(localFilters)
    onClose()
  }

  const handleReset = () => {
    const resetFilters: FilterState = {
      categories: [],
      priceRange: [0, 500],
      languages: [],
      rating: 0,
      responseTime: [],
      availability: "any",
      verified: false,
      location: ""
    }
    setLocalFilters(resetFilters)
  }

  const handleDragEnd = (_: any, info: PanInfo) => {
    if (info.offset.y > 150 || info.velocity.y > 500) {
      onClose()
    } else {
      // Snap back
      y.set(0)
    }
  }

  const filterCount = React.useMemo(() => {
    let count = 0
    if (localFilters.categories && localFilters.categories.length > 0) count += localFilters.categories.length
    if (localFilters.priceRange && (localFilters.priceRange[0] > 0 || localFilters.priceRange[1] < 500)) count++
    if (localFilters.languages && localFilters.languages.length > 0) count += localFilters.languages.length
    if (localFilters.rating && localFilters.rating > 0) count++
    if (localFilters.responseTime && localFilters.responseTime.length > 0) count += localFilters.responseTime.length
    if (localFilters.availability && localFilters.availability !== "any") count++
    if (localFilters.verified) count++
    if (localFilters.location) count++
    return count
  }, [localFilters])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={handleDragEnd}
            style={{ y, opacity: sheetOpacity }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-3xl max-h-[85vh] flex flex-col"
          >
            {/* Drag Handle */}
            <div className="flex justify-center py-3">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-4 border-b dark:border-gray-800">
              <div>
                <h2 className="text-lg font-semibold">Filters</h2>
                {filterCount > 0 && (
                  <p className="text-sm text-gray-500 mt-1">
                    {filterCount} active • {creatorCount} creators
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-purple-600"
                >
                  Reset
                </Button>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {/* Quick Presets */}
              <div className="p-4 border-b dark:border-gray-800">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Quick Filters</h3>
                <div className="grid grid-cols-2 gap-2">
                  {filterPresets.map((preset) => {
                    const isActive = Object.entries(preset.filters).every(([key, value]) => {
                      const filterKey = key as keyof FilterState
                      return JSON.stringify(localFilters[filterKey]) === JSON.stringify(value)
                    })
                    
                    return (
                      <button
                        key={preset.id}
                        onClick={() => {
                          setLocalFilters({ ...localFilters, ...preset.filters })
                        }}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-xl transition touch-manipulation active:scale-95",
                          isActive 
                            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                            : "bg-gray-50 dark:bg-gray-800"
                        )}
                      >
                        <preset.icon className="h-4 w-4" />
                        <span className="text-sm font-medium">{preset.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Categories */}
              <div className="p-4 border-b dark:border-gray-800">
                <button
                  onClick={() => setActiveSection(activeSection === "categories" ? null : "categories")}
                  className="w-full flex items-center justify-between mb-3 touch-manipulation"
                >
                  <h3 className="text-sm font-medium">Categories</h3>
                  <div className="flex items-center gap-2">
                    {localFilters.categories.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {localFilters.categories.length}
                      </Badge>
                    )}
                    <ChevronRight className={cn(
                      "h-4 w-4 transition-transform",
                      activeSection === "categories" && "rotate-90"
                    )} />
                  </div>
                </button>
                
                <AnimatePresence>
                  {activeSection === "categories" && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-2 pt-2">
                        {categories.map((category) => {
                          const isSelected = localFilters.categories.includes(category)
                          return (
                            <Badge
                              key={category}
                              variant={isSelected ? "default" : "secondary"}
                              className={cn(
                                "px-3 py-2 cursor-pointer transition touch-manipulation active:scale-95",
                                isSelected && "bg-purple-600"
                              )}
                              onClick={() => {
                                setLocalFilters({
                                  ...localFilters,
                                  categories: isSelected
                                    ? localFilters.categories.filter(c => c !== category)
                                    : [...localFilters.categories, category]
                                })
                              }}
                            >
                              {isSelected && <Check className="h-3 w-3 mr-1" />}
                              {category}
                            </Badge>
                          )
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Price Range */}
              <div className="p-4 border-b dark:border-gray-800">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium">Price Range</h3>
                  <span className="text-sm text-gray-500">
                    ${localFilters.priceRange[0]} - ${localFilters.priceRange[1]}
                  </span>
                </div>
                <Slider
                  value={localFilters.priceRange}
                  onValueChange={(value) => {
                    setLocalFilters({ ...localFilters, priceRange: value as [number, number] })
                  }}
                  min={0}
                  max={500}
                  step={10}
                  className="touch-manipulation"
                />
                <div className="flex justify-between mt-2 text-xs text-gray-500">
                  <span>$0</span>
                  <span>$500+</span>
                </div>
              </div>

              {/* Languages */}
              <div className="p-4 border-b dark:border-gray-800">
                <h3 className="text-sm font-medium mb-3">Languages</h3>
                <div className="space-y-2">
                  {languages.map((lang) => {
                    const isSelected = localFilters.languages.includes(lang.code)
                    return (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLocalFilters({
                            ...localFilters,
                            languages: isSelected
                              ? localFilters.languages.filter(l => l !== lang.code)
                              : [...localFilters.languages, lang.code]
                          })
                        }}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-lg transition touch-manipulation active:scale-[0.98]",
                          isSelected 
                            ? "bg-purple-50 dark:bg-purple-900/20"
                            : "hover:bg-gray-50 dark:hover:bg-gray-800"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{lang.flag}</span>
                          <span className="text-sm font-medium">{lang.label}</span>
                        </div>
                        {isSelected && <Check className="h-4 w-4 text-purple-600" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Response Time */}
              <div className="p-4 border-b dark:border-gray-800">
                <h3 className="text-sm font-medium mb-3">Response Time</h3>
                <div className="grid grid-cols-2 gap-2">
                  {responseTimes.map((time) => {
                    const isSelected = localFilters.responseTime.includes(time.value)
                    return (
                      <button
                        key={time.value}
                        onClick={() => {
                          setLocalFilters({
                            ...localFilters,
                            responseTime: isSelected
                              ? localFilters.responseTime.filter(t => t !== time.value)
                              : [...localFilters.responseTime, time.value]
                          })
                        }}
                        className={cn(
                          "p-3 rounded-lg text-sm transition touch-manipulation active:scale-95",
                          isSelected
                            ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300"
                            : "bg-gray-50 dark:bg-gray-800"
                        )}
                      >
                        {time.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Additional Options */}
              <div className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-purple-600" />
                      <span className="text-sm font-medium">Verified Creators Only</span>
                    </div>
                    <Switch
                      checked={localFilters.verified}
                      onCheckedChange={(checked) => {
                        setLocalFilters({ ...localFilters, verified: checked })
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">Minimum Rating</span>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => {
                            setLocalFilters({ 
                              ...localFilters, 
                              rating: localFilters.rating === star ? 0 : star 
                            })
                          }}
                          className="p-1 touch-manipulation"
                        >
                          <Star className={cn(
                            "h-5 w-5 transition",
                            star <= localFilters.rating 
                              ? "fill-yellow-500 text-yellow-500"
                              : "text-gray-300"
                          )} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t dark:border-gray-800">
              <Button
                onClick={handleApply}
                size="lg"
                className="w-full h-12 rounded-full touch-manipulation active:scale-[0.98]"
              >
                <Filter className="h-5 w-5 mr-2" />
                Apply Filters
                {filterCount > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-white/20">
                    {filterCount}
                  </Badge>
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default MobileFilterSheet
