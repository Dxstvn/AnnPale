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
  RotateCcw
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

export interface FilterState {
  categories: string[]
  priceRange: [number, number]
  responseTime: string[]
  languages: string[]
  rating: number
  availability: string
  verified: boolean
}

interface FilterSidebarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onReset: () => void
  totalResults?: number
  className?: string
  isMobile?: boolean
  onClose?: () => void
}

const categories = [
  { id: "musician", label: "Musicians", count: 45, emoji: "🎵" },
  { id: "singer", label: "Singers", count: 38, emoji: "🎤" },
  { id: "comedian", label: "Comedians", count: 22, emoji: "😂" },
  { id: "actor", label: "Actors", count: 18, emoji: "🎭" },
  { id: "dj", label: "DJs", count: 24, emoji: "🎧" },
  { id: "radio-host", label: "Radio Hosts", count: 12, emoji: "📻" },
  { id: "influencer", label: "Influencers", count: 31, emoji: "📱" },
  { id: "athlete", label: "Athletes", count: 15, emoji: "🏆" },
]

const responseTimes = [
  { id: "24hr", label: "24 hours", icon: "⚡" },
  { id: "2days", label: "2 days", icon: "🚀" },
  { id: "3days", label: "3 days", icon: "📅" },
  { id: "1week", label: "1 week", icon: "📆" },
]

const languages = [
  { id: "english", label: "English", flag: "🇺🇸" },
  { id: "french", label: "French", flag: "🇫🇷" },
  { id: "kreyol", label: "Kreyòl", flag: "🇭🇹" },
  { id: "spanish", label: "Spanish", flag: "🇪🇸" },
]

const availabilityOptions = [
  { id: "all", label: "All Creators" },
  { id: "available", label: "Available Now" },
  { id: "this-week", label: "This Week" },
  { id: "this-month", label: "This Month" },
]

export function FilterSidebar({
  filters,
  onFiltersChange,
  onReset,
  totalResults = 0,
  className,
  isMobile = false,
  onClose
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = React.useState<Record<string, boolean>>({
    categories: true,
    price: true,
    response: true,
    languages: false,
    rating: false,
    availability: false,
  })

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

  return (
    <div className={cn("bg-white rounded-lg", className)}>
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
          {totalResults > 0 && (
            <p className="text-sm text-gray-600">
              {totalResults} creators found
            </p>
          )}
        </div>
      )}

      <ScrollArea className={cn(
        "flex-1",
        isMobile ? "h-[calc(100vh-8rem)]" : "h-[calc(100vh-12rem)]"
      )}>
        <div className="p-4 space-y-6">
          {/* Categories */}
          <div>
            <button
              onClick={() => toggleSection("categories")}
              className="flex items-center justify-between w-full text-left mb-3"
            >
              <h3 className="font-medium">Categories</h3>
              {expandedSections.categories ? (
                <ChevronUp className="h-4 w-4 text-gray-500" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-500" />
              )}
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
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
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
                      <span className="text-sm text-gray-600">
                        ${filters.priceRange[0]}
                      </span>
                      <span className="text-sm text-gray-600">
                        ${filters.priceRange[1]}+
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

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
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
                    >
                      <Checkbox
                        checked={filters.responseTime.includes(time.id)}
                        onCheckedChange={() => handleResponseTimeToggle(time.id)}
                      />
                      <span className="text-sm flex-1">
                        <span className="mr-1">{time.icon}</span>
                        {time.label}
                      </span>
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
                      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
                    >
                      <Checkbox
                        checked={filters.languages.includes(language.id)}
                        onCheckedChange={() => handleLanguageToggle(language.id)}
                      />
                      <span className="text-sm flex-1">
                        <span className="mr-1">{language.flag}</span>
                        {language.label}
                      </span>
                    </label>
                  ))}
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
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
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
                        className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition"
                      >
                        <RadioGroupItem value={option.id} />
                        <span className="text-sm">{option.label}</span>
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
            <Label htmlFor="verified" className="text-sm font-medium cursor-pointer">
              Verified Creators Only
            </Label>
            <Switch
              id="verified"
              checked={filters.verified}
              onCheckedChange={(checked) => updateFilter("verified", checked)}
            />
          </div>
        </div>
      </ScrollArea>

      {/* Mobile Footer */}
      {isMobile && (
        <div className="p-4 border-t bg-gray-50">
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
              Show {totalResults} Results
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}