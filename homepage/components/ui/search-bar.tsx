"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  X, 
  TrendingUp, 
  Clock,
  Loader2,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface SearchSuggestion {
  id: string
  text: string
  type: "trending" | "recent" | "category" | "creator"
  icon?: React.ReactNode
  metadata?: string
}

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  onSearch?: (query: string) => void
  onClear?: () => void
  suggestions?: SearchSuggestion[]
  trendingSearches?: string[]
  recentSearches?: string[]
  showSuggestions?: boolean
  loading?: boolean
  variant?: "default" | "large" | "minimal"
  className?: string
}

export function SearchBar({
  placeholder = "Search for creators, categories, or occasions...",
  value: controlledValue,
  onChange,
  onSearch,
  onClear,
  suggestions = [],
  trendingSearches = [],
  recentSearches = [],
  showSuggestions = true,
  loading = false,
  variant = "default",
  className
}: SearchBarProps) {
  const [internalValue, setInternalValue] = React.useState("")
  const [isFocused, setIsFocused] = React.useState(false)
  const [showDropdown, setShowDropdown] = React.useState(false)
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const debounceRef = React.useRef<NodeJS.Timeout>()

  const value = controlledValue !== undefined ? controlledValue : internalValue
  const setValue = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
  }

  // Default trending searches if none provided
  const defaultTrending = [
    "Birthday messages",
    "Wedding congratulations",
    "Kompa artists",
    "Comedians",
    "Anniversary wishes"
  ]

  const displayTrending = trendingSearches.length > 0 ? trendingSearches : defaultTrending

  // Handle search submission
  const handleSearch = (searchQuery?: string) => {
    const query = searchQuery || value.trim()
    if (query) {
      onSearch?.(query)
      setShowDropdown(false)
      inputRef.current?.blur()
    }
  }

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    
    // Debounce suggestions
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    
    debounceRef.current = setTimeout(() => {
      setShowDropdown(true)
    }, 300)
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const totalItems = suggestions.length || displayTrending.length + recentSearches.length
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightedIndex(prev => (prev + 1) % totalItems)
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightedIndex(prev => (prev - 1 + totalItems) % totalItems)
        break
      case "Enter":
        e.preventDefault()
        if (highlightedIndex >= 0) {
          if (suggestions.length > 0) {
            handleSearch(suggestions[highlightedIndex].text)
          } else {
            const allItems = [...displayTrending, ...recentSearches]
            handleSearch(allItems[highlightedIndex])
          }
        } else {
          handleSearch()
        }
        break
      case "Escape":
        setShowDropdown(false)
        inputRef.current?.blur()
        break
    }
  }

  // Handle clear
  const handleClear = () => {
    setValue("")
    onClear?.()
    inputRef.current?.focus()
  }

  // Click outside handler
  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Size variants
  const sizeClasses = {
    default: "h-11",
    large: "h-14",
    minimal: "h-9"
  }

  const iconSizes = {
    default: "h-5 w-5",
    large: "h-6 w-6",
    minimal: "h-4 w-4"
  }

  return (
    <div className={cn("relative", className)}>
      {/* Search Input */}
      <div className="relative">
        <Search className={cn(
          "absolute left-3 top-1/2 -translate-y-1/2 text-gray-400",
          iconSizes[variant]
        )} />
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            setIsFocused(true)
            setShowDropdown(true)
          }}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-full border bg-white dark:bg-gray-800 transition-all",
            "placeholder:text-gray-400 outline-none",
            variant === "large" ? "pl-12 pr-32 text-lg" : "pl-10 pr-24 text-base",
            sizeClasses[variant],
            isFocused && "border-purple-500 ring-4 ring-purple-500/20",
            !isFocused && "border-gray-300 dark:border-gray-700"
          )}
        />

        {/* Clear Button */}
        {value && (
          <button
            onClick={handleClear}
            className="absolute right-20 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
          >
            <X className={cn("text-gray-400", iconSizes[variant])} />
          </button>
        )}

        {/* Search Button */}
        <Button
          onClick={() => handleSearch()}
          disabled={loading}
          size={variant === "large" ? "default" : "sm"}
          variant="primary"
          className={cn(
            "absolute right-1 top-1/2 -translate-y-1/2",
            variant === "minimal" && "px-3"
          )}
        >
          {loading ? (
            <Loader2 className={cn("animate-spin", iconSizes[variant])} />
          ) : variant === "minimal" ? (
            <ArrowRight className={iconSizes[variant]} />
          ) : (
            <>
              Search
              <ArrowRight className={cn("ml-1", iconSizes[variant])} />
            </>
          )}
        </Button>
      </div>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && showDropdown && (isFocused || value) && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
          >
            {/* Filtered Suggestions */}
            {value && suggestions.length > 0 ? (
              <div className="p-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    onClick={() => handleSearch(suggestion.text)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition",
                      highlightedIndex === index
                        ? "bg-purple-50 dark:bg-purple-900/30"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700"
                    )}
                  >
                    {suggestion.icon || <Search className="h-4 w-4 text-gray-400" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium">{suggestion.text}</p>
                      {suggestion.metadata && (
                        <p className="text-xs text-gray-500">{suggestion.metadata}</p>
                      )}
                    </div>
                    {suggestion.type === "trending" && (
                      <Badge variant="secondary" className="text-xs">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Trending
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <>
                {/* Trending Searches */}
                {!value && displayTrending.length > 0 && (
                  <div className="p-4 border-b dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
                      <TrendingUp className="h-4 w-4" />
                      <span>Trending Searches</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {displayTrending.map((search, index) => (
                        <Badge
                          key={search}
                          variant="secondary"
                          className={cn(
                            "cursor-pointer transition",
                            highlightedIndex === index
                              ? "bg-purple-100 dark:bg-purple-900/50"
                              : "hover:bg-purple-50 dark:hover:bg-purple-900/30"
                          )}
                          onClick={() => handleSearch(search)}
                        >
                          {search}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Searches */}
                {!value && recentSearches.length > 0 && (
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
                      <Clock className="h-4 w-4" />
                      <span>Recent Searches</span>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search, index) => {
                        const adjustedIndex = displayTrending.length + index
                        return (
                          <button
                            key={search}
                            onClick={() => handleSearch(search)}
                            className={cn(
                              "w-full text-left px-3 py-2 text-sm rounded-lg transition",
                              highlightedIndex === adjustedIndex
                                ? "bg-purple-50 dark:bg-purple-900/30"
                                : "hover:bg-gray-50 dark:hover:bg-gray-700"
                            )}
                          >
                            {search}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}