'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, Clock, TrendingUp, User } from 'lucide-react'
import debounce from 'lodash.debounce'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface SearchSuggestion {
  id: string
  type: 'creator' | 'category' | 'recent' | 'trending'
  text: string
  subtitle?: string
  icon?: React.ElementType
}

interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  showSuggestions?: boolean
  onSuggestionSelect?: (suggestion: SearchSuggestion) => void
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search creators...",
  className,
  showSuggestions = true,
  onSuggestionSelect
}: SearchBarProps) {
  const [localValue, setLocalValue] = useState(value)
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches')
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored))
      } catch (e) {
        console.error('Failed to load recent searches:', e)
      }
    }
  }, [])

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        // Show recent searches when query is empty
        const recentSuggestions: SearchSuggestion[] = recentSearches.slice(0, 5).map(search => ({
          id: `recent-${search}`,
          type: 'recent',
          text: search,
          icon: Clock
        }))
        
        // Add trending suggestions
        const trendingSuggestions: SearchSuggestion[] = [
          { id: 'trend-1', type: 'trending', text: 'Musicians', icon: TrendingUp },
          { id: 'trend-2', type: 'trending', text: 'Comedians', icon: TrendingUp },
          { id: 'trend-3', type: 'trending', text: 'New creators', icon: TrendingUp },
        ]
        
        setSuggestions([...recentSuggestions, ...trendingSuggestions])
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      
      try {
        // Simulate API call for search suggestions
        // In production, this would call your actual search API
        await new Promise(resolve => setTimeout(resolve, 200))
        
        const mockSuggestions: SearchSuggestion[] = [
          {
            id: 'creator-1',
            type: 'creator',
            text: 'Wyclef Jean',
            subtitle: 'Musician',
            icon: User
          },
          {
            id: 'creator-2',
            type: 'creator',
            text: 'Ti Jo Zenny',
            subtitle: 'Entertainer',
            icon: User
          },
          {
            id: 'cat-1',
            type: 'category',
            text: 'Music',
            subtitle: '45 creators'
          }
        ].filter(s => 
          s.text.toLowerCase().includes(query.toLowerCase()) ||
          s.subtitle?.toLowerCase().includes(query.toLowerCase())
        )
        
        setSuggestions(mockSuggestions)
      } catch (error) {
        console.error('Search error:', error)
        setSuggestions([])
      } finally {
        setIsLoading(false)
      }
    }, 300),
    [recentSearches]
  )

  // Handle input change
  useEffect(() => {
    setLocalValue(value)
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    onChange(newValue)
    
    if (showSuggestions) {
      setShowDropdown(true)
      debouncedSearch(newValue)
    }
  }

  // Save to recent searches
  const saveToRecent = (search: string) => {
    if (!search.trim()) return
    
    const updated = [search, ...recentSearches.filter(s => s !== search)].slice(0, 10)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  // Handle suggestion click
  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'recent' || suggestion.type === 'trending') {
      setLocalValue(suggestion.text)
      onChange(suggestion.text)
      saveToRecent(suggestion.text)
    } else if (onSuggestionSelect) {
      onSuggestionSelect(suggestion)
    }
    setShowDropdown(false)
  }

  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (localValue.trim()) {
      saveToRecent(localValue)
      setShowDropdown(false)
    }
  }

  // Clear search
  const handleClear = () => {
    setLocalValue('')
    onChange('')
    setSuggestions([])
    inputRef.current?.focus()
  }

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={cn("relative", className)}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <Search className={cn(
            "absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 transition-colors",
            localValue ? "text-purple-500" : "text-gray-400"
          )} />
          
          <Input
            ref={inputRef}
            type="text"
            value={localValue}
            onChange={handleInputChange}
            onFocus={() => showSuggestions && setShowDropdown(true)}
            placeholder={placeholder}
            className="pl-10 pr-10 h-11 text-base border-gray-200 focus:border-purple-500 focus:ring-purple-500"
          />
          
          {localValue && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          )}
        </div>
      </form>

      {/* Search Suggestions Dropdown */}
      {showSuggestions && showDropdown && (suggestions.length > 0 || isLoading) && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
        >
          {isLoading ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              Searching...
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {/* Group suggestions by type */}
              {suggestions.some(s => s.type === 'recent') && (
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500">Recent Searches</p>
                </div>
              )}
              
              {suggestions.filter(s => s.type === 'recent').map(suggestion => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                >
                  {suggestion.icon && <suggestion.icon className="h-4 w-4 text-gray-400" />}
                  <span className="flex-1 text-sm">{suggestion.text}</span>
                </button>
              ))}

              {suggestions.some(s => s.type === 'trending') && (
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500">Trending</p>
                </div>
              )}
              
              {suggestions.filter(s => s.type === 'trending').map(suggestion => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                >
                  {suggestion.icon && <suggestion.icon className="h-4 w-4 text-orange-500" />}
                  <span className="flex-1 text-sm">{suggestion.text}</span>
                </button>
              ))}

              {suggestions.some(s => s.type === 'creator') && (
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500">Creators</p>
                </div>
              )}
              
              {suggestions.filter(s => s.type === 'creator').map(suggestion => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-purple-50 transition-colors text-left group"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
                    {suggestion.icon && <suggestion.icon className="h-4 w-4 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 group-hover:text-purple-600">
                      {suggestion.text}
                    </p>
                    {suggestion.subtitle && (
                      <p className="text-xs text-gray-500">{suggestion.subtitle}</p>
                    )}
                  </div>
                </button>
              ))}

              {suggestions.some(s => s.type === 'category') && (
                <div className="px-3 py-2 bg-gray-50 border-b border-gray-100">
                  <p className="text-xs font-medium text-gray-500">Categories</p>
                </div>
              )}
              
              {suggestions.filter(s => s.type === 'category').map(suggestion => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <Badge variant="secondary" className="text-xs">
                    {suggestion.text}
                  </Badge>
                  {suggestion.subtitle && (
                    <span className="text-xs text-gray-500">{suggestion.subtitle}</span>
                  )}
                </button>
              ))}

              {/* See all results link */}
              {localValue.trim() && (
                <div className="border-t border-gray-100 px-4 py-2">
                  <button
                    onClick={() => {
                      saveToRecent(localValue)
                      setShowDropdown(false)
                    }}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  >
                    See all results for "{localValue}"
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}