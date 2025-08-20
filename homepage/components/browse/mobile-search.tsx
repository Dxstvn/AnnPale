"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  X, 
  Mic, 
  MicOff,
  ArrowLeft,
  TrendingUp, 
  Clock,
  Loader2,
  Filter,
  MapPin,
  Calendar,
  DollarSign
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion"
import { toast } from "sonner"

interface MobileSearchProps {
  value?: string
  onChange?: (value: string) => void
  onSearch?: (query: string) => void
  onClear?: () => void
  onFilterClick?: () => void
  recentSearches?: string[]
  trendingSearches?: string[]
  popularCategories?: string[]
  loading?: boolean
  filterCount?: number
  className?: string
}

export function MobileSearch({
  value: controlledValue,
  onChange,
  onSearch,
  onClear,
  onFilterClick,
  recentSearches = [],
  trendingSearches = [],
  popularCategories = [],
  loading = false,
  filterCount = 0,
  className
}: MobileSearchProps) {
  const [internalValue, setInternalValue] = React.useState("")
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [isListening, setIsListening] = React.useState(false)
  const [showSuggestions, setShowSuggestions] = React.useState(false)
  const [selectedIndex, setSelectedIndex] = React.useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const recognitionRef = React.useRef<any>(null)
  const y = useMotionValue(0)
  const opacity = useTransform(y, [0, 100], [1, 0])

  const value = controlledValue !== undefined ? controlledValue : internalValue
  const setValue = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  // Initialize speech recognition
  React.useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = true
      recognitionRef.current.lang = 'en-US'

      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result: any) => result.transcript)
          .join('')
        setValue(transcript)
      }

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        toast.error("Voice recognition failed. Please try again.")
      }

      recognitionRef.current.onend = () => {
        setIsListening(false)
      }
    }
  }, [])

  // Toggle voice search
  const toggleVoiceSearch = () => {
    if (!recognitionRef.current) {
      toast.error("Voice search is not supported on your device")
      return
    }

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
      toast.info("Listening... Speak now")
    }
  }

  // Handle search submission
  const handleSearch = (searchQuery?: string) => {
    const query = searchQuery || value.trim()
    if (query) {
      onSearch?.(query)
      setIsExpanded(false)
      setShowSuggestions(false)
      // Add to recent searches
      const stored = localStorage.getItem('recentSearches')
      const recent = stored ? JSON.parse(stored) : []
      const updated = [query, ...recent.filter((s: string) => s !== query)].slice(0, 5)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
    }
  }

  // Handle clear
  const handleClear = () => {
    setValue("")
    onClear?.()
    inputRef.current?.focus()
  }

  // Default suggestions
  const defaultTrending = trendingSearches.length > 0 ? trendingSearches : [
    "Birthday wishes",
    "Wedding messages",
    "Kompa artists",
    "Comedians",
    "Anniversary"
  ]

  const defaultCategories = popularCategories.length > 0 ? popularCategories : [
    "Musicians",
    "Comedians",
    "Athletes",
    "Influencers"
  ]

  // Quick search shortcuts
  const quickSearches = [
    { icon: MapPin, label: "Near me", action: () => handleSearch("creators near me") },
    { icon: Calendar, label: "Available today", action: () => handleSearch("available today") },
    { icon: DollarSign, label: "Under $50", action: () => handleSearch("under $50") },
    { icon: TrendingUp, label: "Popular", action: () => handleSearch("most popular") }
  ]

  // Handle swipe down to close
  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.y > 100) {
      setIsExpanded(false)
    }
  }

  return (
    <>
      {/* Collapsed Search Bar */}
      <AnimatePresence>
        {!isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn("relative", className)}
          >
            <button
              onClick={() => {
                setIsExpanded(true)
                setTimeout(() => inputRef.current?.focus(), 100)
              }}
              className="w-full flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-full shadow-sm border border-gray-200 dark:border-gray-700"
            >
              <Search className="h-5 w-5 text-gray-400" />
              <span className="flex-1 text-left text-gray-500">
                {value || "Search creators..."}
              </span>
              {filterCount > 0 && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-700">
                  {filterCount}
                </Badge>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onFilterClick?.()
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
              >
                <Filter className="h-4 w-4" />
              </button>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Search Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white dark:bg-gray-900"
          >
            <motion.div
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              style={{ y, opacity }}
              className="h-full flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center gap-2 p-4 border-b dark:border-gray-800">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={(e) => {
                      setValue(e.target.value)
                      setShowSuggestions(true)
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleSearch()
                      }
                    }}
                    placeholder="Search creators, categories..."
                    className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-full outline-none focus:ring-2 focus:ring-purple-500"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                  />
                  
                  {value && (
                    <button
                      onClick={handleClear}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1"
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                </div>

                <button
                  onClick={toggleVoiceSearch}
                  className={cn(
                    "p-3 rounded-full transition touch-manipulation",
                    isListening 
                      ? "bg-red-500 text-white animate-pulse" 
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  {isListening ? (
                    <MicOff className="h-5 w-5" />
                  ) : (
                    <Mic className="h-5 w-5" />
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain">
                {/* Quick Actions */}
                {!value && (
                  <div className="p-4">
                    <div className="grid grid-cols-2 gap-2 mb-6">
                      {quickSearches.map((item) => (
                        <button
                          key={item.label}
                          onClick={item.action}
                          className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl touch-manipulation active:scale-95 transition"
                        >
                          <item.icon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Popular Categories */}
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-500 mb-3">Popular Categories</h3>
                      <div className="flex flex-wrap gap-2">
                        {defaultCategories.map((category) => (
                          <Badge
                            key={category}
                            variant="secondary"
                            className="px-4 py-2 text-sm cursor-pointer active:scale-95 transition touch-manipulation"
                            onClick={() => handleSearch(category)}
                          >
                            {category}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Trending Searches */}
                    {defaultTrending.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
                          <TrendingUp className="h-4 w-4" />
                          <span>Trending</span>
                        </div>
                        <div className="space-y-2">
                          {defaultTrending.map((search) => (
                            <button
                              key={search}
                              onClick={() => handleSearch(search)}
                              className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition touch-manipulation active:scale-[0.98]"
                            >
                              <span className="text-sm">{search}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                            <Clock className="h-4 w-4" />
                            <span>Recent</span>
                          </div>
                          <button
                            onClick={() => {
                              localStorage.removeItem('recentSearches')
                              toast.success("Recent searches cleared")
                            }}
                            className="text-xs text-purple-600 hover:text-purple-700"
                          >
                            Clear
                          </button>
                        </div>
                        <div className="space-y-2">
                          {recentSearches.map((search) => (
                            <button
                              key={search}
                              onClick={() => handleSearch(search)}
                              className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition touch-manipulation active:scale-[0.98]"
                            >
                              <span className="text-sm">{search}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Search Suggestions */}
                {value && showSuggestions && (
                  <div className="p-4">
                    <div className="text-sm text-gray-500 mb-3">
                      Suggestions for "{value}"
                    </div>
                    {/* Auto-suggestions would go here based on the query */}
                    <button
                      onClick={() => handleSearch()}
                      className="w-full p-4 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-xl font-medium touch-manipulation active:scale-[0.98] transition"
                    >
                      Search for "{value}"
                    </button>
                  </div>
                )}
              </div>

              {/* Search Button */}
              {value && (
                <div className="p-4 border-t dark:border-gray-800">
                  <Button
                    onClick={() => handleSearch()}
                    disabled={loading}
                    size="lg"
                    className="w-full h-12 rounded-full touch-manipulation active:scale-[0.98]"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Search className="h-5 w-5 mr-2" />
                        Search
                      </>
                    )}
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}