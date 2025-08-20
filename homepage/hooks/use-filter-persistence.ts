"use client"

import { useEffect, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { FilterState } from '@/components/browse/filter-sidebar'

const STORAGE_KEY = 'ann-pale-filter-state'
const RECENT_SEARCHES_KEY = 'ann-pale-recent-searches'
const FILTER_PRESETS_KEY = 'ann-pale-filter-presets'

export interface FilterPreset {
  id: string
  name: string
  description?: string
  filters: FilterState
  createdAt: string
  icon?: string
}

export interface RecentSearch {
  id: string
  query: string
  filters: FilterState
  timestamp: string
  resultCount: number
}

const defaultFilters: FilterState = {
  categories: [],
  priceRange: [0, 500],
  responseTime: [],
  languages: [],
  rating: 0,
  availability: "all",
  verified: false
}

export function useFilterPersistence() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Load filters from session storage
  const loadFromSession = useCallback((): FilterState => {
    if (typeof window === 'undefined') return defaultFilters
    
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY)
      if (stored) {
        return JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading filters from session:', error)
    }
    
    return defaultFilters
  }, [])

  // Save filters to session storage
  const saveToSession = useCallback((filters: FilterState) => {
    if (typeof window === 'undefined') return
    
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(filters))
    } catch (error) {
      console.error('Error saving filters to session:', error)
    }
  }, [])

  // Parse filters from URL
  const parseFromURL = useCallback((): FilterState => {
    const params = new URLSearchParams(searchParams.toString())
    const filters: FilterState = { ...defaultFilters }
    
    // Categories
    const categories = params.get('categories')
    if (categories) filters.categories = categories.split(',')
    
    // Price range
    const minPrice = params.get('minPrice')
    const maxPrice = params.get('maxPrice')
    if (minPrice || maxPrice) {
      filters.priceRange = [
        minPrice ? parseInt(minPrice) : 0,
        maxPrice ? parseInt(maxPrice) : 500
      ]
    }
    
    // Response time
    const responseTime = params.get('responseTime')
    if (responseTime) filters.responseTime = responseTime.split(',')
    
    // Languages
    const languages = params.get('languages')
    if (languages) filters.languages = languages.split(',')
    
    // Rating
    const rating = params.get('rating')
    if (rating) filters.rating = parseFloat(rating)
    
    // Availability
    const availability = params.get('availability')
    if (availability) filters.availability = availability
    
    // Verified
    const verified = params.get('verified')
    if (verified === 'true') filters.verified = true
    
    return filters
  }, [searchParams])

  // Update URL with filters
  const updateURL = useCallback((filters: FilterState) => {
    const params = new URLSearchParams()
    
    if (filters.categories.length > 0) {
      params.set('categories', filters.categories.join(','))
    }
    
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) {
      params.set('minPrice', filters.priceRange[0].toString())
      params.set('maxPrice', filters.priceRange[1].toString())
    }
    
    if (filters.responseTime.length > 0) {
      params.set('responseTime', filters.responseTime.join(','))
    }
    
    if (filters.languages.length > 0) {
      params.set('languages', filters.languages.join(','))
    }
    
    if (filters.rating > 0) {
      params.set('rating', filters.rating.toString())
    }
    
    if (filters.availability !== 'all') {
      params.set('availability', filters.availability)
    }
    
    if (filters.verified) {
      params.set('verified', 'true')
    }
    
    const queryString = params.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ''}`)
  }, [pathname, router])

  // Save current search to recent searches
  const saveRecentSearch = useCallback((query: string, filters: FilterState, resultCount: number) => {
    if (typeof window === 'undefined') return
    
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
      const searches: RecentSearch[] = stored ? JSON.parse(stored) : []
      
      // Add new search
      const newSearch: RecentSearch = {
        id: Date.now().toString(),
        query,
        filters,
        timestamp: new Date().toISOString(),
        resultCount
      }
      
      // Remove duplicates and limit to 10 recent searches
      const filtered = searches.filter(s => 
        s.query !== query || JSON.stringify(s.filters) !== JSON.stringify(filters)
      )
      const updated = [newSearch, ...filtered].slice(0, 10)
      
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated))
    } catch (error) {
      console.error('Error saving recent search:', error)
    }
  }, [])

  // Get recent searches
  const getRecentSearches = useCallback((): RecentSearch[] => {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading recent searches:', error)
      return []
    }
  }, [])

  // Clear recent searches
  const clearRecentSearches = useCallback(() => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(RECENT_SEARCHES_KEY)
  }, [])

  // Save filter preset
  const saveFilterPreset = useCallback((name: string, description: string, filters: FilterState, icon?: string) => {
    if (typeof window === 'undefined') return
    
    try {
      const stored = localStorage.getItem(FILTER_PRESETS_KEY)
      const presets: FilterPreset[] = stored ? JSON.parse(stored) : []
      
      const newPreset: FilterPreset = {
        id: Date.now().toString(),
        name,
        description,
        filters,
        createdAt: new Date().toISOString(),
        icon
      }
      
      const updated = [...presets, newPreset]
      localStorage.setItem(FILTER_PRESETS_KEY, JSON.stringify(updated))
      
      return newPreset
    } catch (error) {
      console.error('Error saving filter preset:', error)
      return null
    }
  }, [])

  // Get filter presets
  const getFilterPresets = useCallback((): FilterPreset[] => {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(FILTER_PRESETS_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error loading filter presets:', error)
      return []
    }
  }, [])

  // Delete filter preset
  const deleteFilterPreset = useCallback((presetId: string) => {
    if (typeof window === 'undefined') return
    
    try {
      const stored = localStorage.getItem(FILTER_PRESETS_KEY)
      const presets: FilterPreset[] = stored ? JSON.parse(stored) : []
      
      const updated = presets.filter(p => p.id !== presetId)
      localStorage.setItem(FILTER_PRESETS_KEY, JSON.stringify(updated))
    } catch (error) {
      console.error('Error deleting filter preset:', error)
    }
  }, [])

  // Get shareable filter URL
  const getShareableURL = useCallback((filters: FilterState): string => {
    const params = new URLSearchParams()
    
    if (filters.categories.length > 0) {
      params.set('c', filters.categories.join(','))
    }
    
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 500) {
      params.set('p', `${filters.priceRange[0]}-${filters.priceRange[1]}`)
    }
    
    if (filters.responseTime.length > 0) {
      params.set('t', filters.responseTime.join(','))
    }
    
    if (filters.languages.length > 0) {
      params.set('l', filters.languages.join(','))
    }
    
    if (filters.rating > 0) {
      params.set('r', filters.rating.toString())
    }
    
    if (filters.availability !== 'all') {
      params.set('a', filters.availability)
    }
    
    if (filters.verified) {
      params.set('v', '1')
    }
    
    const baseURL = typeof window !== 'undefined' ? window.location.origin : ''
    return `${baseURL}/browse?${params.toString()}`
  }, [])

  // Get filter suggestions based on current filters
  const getFilterSuggestions = useCallback((filters: FilterState, resultCount: number) => {
    const suggestions = []
    
    // If no results, suggest removing filters
    if (resultCount === 0) {
      if (filters.verified) {
        suggestions.push({
          text: "Try including non-verified creators",
          action: () => ({ ...filters, verified: false })
        })
      }
      
      if (filters.rating > 0) {
        suggestions.push({
          text: "Lower the minimum rating requirement",
          action: () => ({ ...filters, rating: 0 })
        })
      }
      
      if (filters.priceRange[1] < 500) {
        suggestions.push({
          text: "Increase your price range",
          action: () => ({ ...filters, priceRange: [filters.priceRange[0], 500] as [number, number] })
        })
      }
      
      if (filters.categories.length > 0) {
        suggestions.push({
          text: "Browse all categories",
          action: () => ({ ...filters, categories: [] })
        })
      }
    }
    
    // If few results, suggest broadening
    if (resultCount > 0 && resultCount < 5) {
      if (filters.languages.length > 0) {
        suggestions.push({
          text: "Show creators speaking any language",
          action: () => ({ ...filters, languages: [] })
        })
      }
      
      if (filters.responseTime.length > 0) {
        suggestions.push({
          text: "Show all response times",
          action: () => ({ ...filters, responseTime: [] })
        })
      }
    }
    
    return suggestions
  }, [])

  return {
    defaultFilters,
    loadFromSession,
    saveToSession,
    parseFromURL,
    updateURL,
    saveRecentSearch,
    getRecentSearches,
    clearRecentSearches,
    saveFilterPreset,
    getFilterPresets,
    deleteFilterPreset,
    getShareableURL,
    getFilterSuggestions
  }
}