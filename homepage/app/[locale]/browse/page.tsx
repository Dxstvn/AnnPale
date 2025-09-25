'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layouts/header'
import {
  Search,
  Filter,
  Grid3x3,
  List,
  LayoutGrid,
  ChevronDown,
  X,
  Star,
  Clock,
  Globe,
  CheckCircle,
  Users,
  DollarSign,
  TrendingUp,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { CreatorAvatar, VideoThumbnail } from '@/components/ui/avatar-with-fallback'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import CreatorQuickViewModal from '@/components/creator/creator-quick-view-modal'
import { CreatorServicesModal } from '@/components/creator/creator-services-modal'

// Simple Pagination Component
const SimplePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  tPagination,
}: {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  tPagination: (key: string) => string
}) => {
  const pages = []
  const maxVisible = 5

  let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(totalPages, start + maxVisible - 1)

  if (end - start + 1 < maxVisible) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        {tPagination('pagination.previous')}
      </Button>

      {start > 1 && (
        <>
          <Button
            variant={currentPage === 1 ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(1)}
          >
            1
          </Button>
          {start > 2 && <span className="px-2 text-gray-500">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Button
          key={page}
          variant={currentPage === page ? 'default' : 'outline'}
          size="sm"
          onClick={() => onPageChange(page)}
        >
          {page}
        </Button>
      ))}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-2 text-gray-500">...</span>}
          <Button
            variant={currentPage === totalPages ? 'default' : 'outline'}
            size="sm"
            onClick={() => onPageChange(totalPages)}
          >
            {totalPages}
          </Button>
        </>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        {tPagination('pagination.next')}
      </Button>
    </div>
  )
}

// Type for creator data
interface Creator {
  id: string
  name: string
  category: string
  price: number
  rating: number
  reviews: number
  image: string
  responseTime: string
  verified: boolean
  languages: string[]
  videoCount: number
  bio?: string
}

// Initial empty array - will be populated from Supabase
const initialCreators: Creator[] = []

// Categories and price ranges will be created with translations inside the component

export default function BrowsePage() {
  const t = useTranslations('fan')
  const tPagination = useTranslations('common')
  const searchParams = useSearchParams()

  // Create translated categories and price ranges
  const categories = [
    { value: 'all', label: t('browse.allCategories') },
    { value: 'musician', label: t('browse.musicians') },
    { value: 'comedian', label: t('browse.comedians') },
    { value: 'actor', label: t('browse.actors') },
    { value: 'singer', label: t('browse.singers') },
    { value: 'djProducer', label: t('browse.djProducer') },
    { value: 'radioHost', label: t('browse.radioHost') },
    { value: 'dj', label: t('browse.dj') },
  ]

  const priceRanges = [
    { value: 'all', label: t('browse.allPrices') },
    { value: '0-50', label: 'Under $50' },
    { value: '50-100', label: '$50 - $100' },
    { value: '100-200', label: '$100 - $200' },
    { value: '200+', label: '$200+' },
  ]

  // State management
  const [creators, setCreators] = useState<Creator[]>([])
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid')
  const [sortBy, setSortBy] = useState('popular')
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState('all')
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
  const [onlyVerified, setOnlyVerified] = useState(false)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  // Modal state
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [servicesModalState, setServicesModalState] = useState<{
    isOpen: boolean,
    defaultTab: "video" | "subscription"
  }>({ isOpen: false, defaultTab: "video" })

  const creatorsPerPage = 12

  // Fetch creators from Supabase
  useEffect(() => {
    const fetchCreators = async () => {
      try {
        setLoading(true)
        const supabase = createClient()

        // Fetch creators from profiles table where role = 'creator'
        // Using select('*') to ensure resilience to database schema changes
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('role', 'creator')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching creators:', error)
          setError('Failed to load creators')
          return
        }

        // Map database fields to expected format
        const mappedCreators: Creator[] = (data || []).map(profile => ({
          id: profile.id,
          name: profile.display_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Creator',
          category: profile.category || 'artist',
          price: profile.price_per_video || 100,
          rating: profile.average_rating || 4.5,
          reviews: profile.total_reviews || 0,
          image: profile.avatar_url || '/images/default-avatar.png',
          responseTime: profile.response_time_hours ? `${profile.response_time_hours} hours` : '24hr',
          verified: profile.verified || false,
          languages: profile.languages || ['English'],
          videoCount: profile.total_videos || 0,
          bio: profile.bio || ''
        }))

        setCreators(mappedCreators)
        setFilteredCreators(mappedCreators)
      } catch (err) {
        console.error('Unexpected error:', err)
        setError('An unexpected error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCreators()
  }, [])

  // Initialize search from URL params
  useEffect(() => {
    const query = searchParams.get('search')
    if (query) {
      setSearchQuery(query)
    }
  }, [searchParams])

  // Filter and sort creators
  useEffect(() => {
    let filtered = [...creators]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (creator) =>
          creator.name.toLowerCase().includes(query) ||
          creator.category.toLowerCase().includes(query)
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((creator) => creator.category === selectedCategory)
    }

    // Apply price range filter
    if (selectedPriceRange !== 'all') {
      const [min, max] = selectedPriceRange
        .split('-')
        .map((p) => (p === '+' ? Infinity : parseInt(p)))
      filtered = filtered.filter((creator) => {
        if (max === Infinity) return creator.price >= min
        return creator.price >= min && creator.price <= max
      })
    }

    // Apply language filter
    if (selectedLanguages.length > 0) {
      filtered = filtered.filter((creator) =>
        creator.languages.some((lang) => selectedLanguages.includes(lang))
      )
    }

    // Apply verified filter
    if (onlyVerified) {
      filtered = filtered.filter((creator) => creator.verified)
    }

    // Apply sorting
    switch (sortBy) {
      case 'priceAsc':
        filtered.sort((a, b) => a.price - b.price)
        break
      case 'priceDesc':
        filtered.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'newest':
        // For UUIDs, we can't sort by ID numerically
        // Instead, keep the original order (newest first from database)
        break
      default: // popular
        filtered.sort((a, b) => b.reviews - a.reviews)
    }

    setFilteredCreators(filtered)
    setCurrentPage(1)
  }, [
    creators,
    searchQuery,
    selectedCategory,
    selectedPriceRange,
    selectedLanguages,
    onlyVerified,
    sortBy,
  ])

  // Pagination
  const indexOfLastCreator = currentPage * creatorsPerPage
  const indexOfFirstCreator = indexOfLastCreator - creatorsPerPage
  const currentCreators = filteredCreators.slice(indexOfFirstCreator, indexOfLastCreator)
  const totalPages = Math.ceil(filteredCreators.length / creatorsPerPage)

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedPriceRange('all')
    setSelectedLanguages([])
    setOnlyVerified(false)
    setSortBy('popular')
  }

  const hasActiveFilters =
    searchQuery ||
    selectedCategory !== 'all' ||
    selectedPriceRange !== 'all' ||
    selectedLanguages.length > 0 ||
    onlyVerified

  // Creator Card Component with Phase 0 Design Principles
  const CreatorCard = ({ creator }: { creator: Creator }) => {
    const getCategoryIcon = (category: string) => {
      switch (category) {
        case 'musician':
        case 'singer':
          return '🎵'
        case 'comedian':
          return '😂'
        case 'actor':
          return '🎭'
        case 'djProducer':
        case 'dj':
          return '🎧'
        case 'radioHost':
          return '📻'
        default:
          return '🎤'
      }
    }

    const handleCreatorClick = () => {
      setSelectedCreator(creator)
      setIsModalOpen(true)
    }

    return (
      <div
        onClick={handleCreatorClick}
        className="group cursor-pointer overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      >
        {/* Image Section - properly contained within card borders */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100">
          <VideoThumbnail
            src={creator.image}
            alt={creator.name}
            className="absolute inset-0 h-full w-full"
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {creator.verified && (
              <Badge className="border-0 bg-blue-600/90 text-white backdrop-blur-sm">
                <CheckCircle className="mr-1 h-3 w-3" />
                Verified
              </Badge>
            )}
          </div>

          {/* Category icon */}
          <div className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-lg bg-white/95 text-2xl shadow-md backdrop-blur-sm">
            {getCategoryIcon(creator.category)}
          </div>

          {/* Price overlay - bottom of image */}
          <div className="absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-3">
            <p className="text-2xl font-bold text-white">${creator.price}</p>
          </div>
        </div>

        {/* Content Section - seamlessly connected */}
        <div className="space-y-3 p-4">
          {/* Creator info */}
          <div>
            <h3 className="truncate text-lg font-semibold text-gray-900 transition-colors group-hover:text-purple-600">
              {creator.name}
            </h3>
            <p className="text-sm text-gray-600 capitalize">
              {creator.category.replace(/([A-Z])/g, ' $1').trim()}
            </p>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-gray-900">{creator.rating}</span>
              <span className="text-gray-500">({creator.reviews})</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="h-3 w-3" />
              <span className="text-xs">{creator.responseTime}</span>
            </div>
          </div>

          {/* Languages */}
          <div className="flex items-center gap-1 pb-2 text-xs text-gray-600">
            <Globe className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{creator.languages.join(', ')}</span>
          </div>

          {/* View profile button - visual only, card handles click */}
          <div className="w-full rounded-lg bg-gray-100 px-4 py-2.5 text-center text-sm font-medium text-gray-700 transition-all duration-300 group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-pink-600 group-hover:text-white">
            Quick View
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header />
      <div className="min-h-screen bg-gray-50">
        {/* Header Section with modern design */}
        <div className="sticky top-16 z-30 border-b bg-gradient-to-r from-purple-50 to-pink-50 shadow-lg">
          <div className="container mx-auto px-4 py-8">
            {/* Page Title with icon */}
            <div className="mb-8 text-center">
              <div className="mb-3 flex items-center justify-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-4xl font-bold text-transparent">
                  {t('browse.title')}
                </h1>
              </div>
              <p className="text-lg text-gray-700">
                {t('browse.subtitle')}
              </p>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col gap-4 lg:flex-row">
              {/* Enhanced Search Bar */}
              <div className="flex-1">
                <div className="group relative">
                  <Search className="absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-purple-600" />
                  <input
                    type="text"
                    placeholder={t('browse.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-14 w-full rounded-xl border-2 border-gray-200 bg-white pr-12 pl-14 text-base shadow-md transition-all duration-200 placeholder:text-gray-400 focus:border-purple-500 focus:shadow-lg focus:ring-4 focus:ring-purple-500/20"
                    aria-label={t('browse.searchPlaceholder')}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-1 transition-colors hover:bg-gray-100"
                      aria-label="Clear search"
                    >
                      <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    </button>
                  )}
                </div>
              </div>

              {/* Modern Filter Controls */}
              <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap">
                {/* Category Filter with icon */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger
                    className="group h-14 w-[180px] border-2 border-gray-200 bg-white shadow-md transition-all duration-200 hover:border-purple-300 hover:shadow-lg"
                    aria-label={t('browse.category')}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 transition-colors group-hover:bg-purple-200">
                        <Filter className="h-4 w-4 text-purple-600" />
                      </div>
                      <SelectValue placeholder={t('browse.allCategories')} />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="border-2 border-gray-200 bg-white shadow-xl">
                    {categories.map((cat) => (
                      <SelectItem
                        key={cat.value}
                        value={cat.value}
                        className="cursor-pointer transition-colors hover:bg-purple-50 focus:bg-purple-50"
                      >
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Price Filter with icon */}
                <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                  <SelectTrigger
                    className="group h-14 w-[160px] border-2 border-gray-200 bg-white shadow-md transition-all duration-200 hover:border-purple-300 hover:shadow-lg"
                    aria-label={t('browse.priceRange')}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-100 transition-colors group-hover:bg-green-200">
                        <DollarSign className="h-4 w-4 text-green-600" />
                      </div>
                      <SelectValue placeholder={t('browse.allPrices')} />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="border-2 border-gray-200 bg-white shadow-xl">
                    {priceRanges.map((range) => (
                      <SelectItem
                        key={range.value}
                        value={range.value}
                        className="cursor-pointer transition-colors hover:bg-purple-50 focus:bg-purple-50"
                      >
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort with icon */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger
                    className="group h-14 w-[180px] border-2 border-gray-200 bg-white shadow-md transition-all duration-200 hover:border-purple-300 hover:shadow-lg"
                    aria-label={t('browse.mostPopular')}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-200">
                        <TrendingUp className="h-4 w-4 text-blue-600" />
                      </div>
                      <SelectValue placeholder={t('browse.mostPopular')} />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="border-2 border-gray-200 bg-white shadow-xl">
                    <SelectItem
                      value="popular"
                      className="cursor-pointer transition-colors hover:bg-purple-50 focus:bg-purple-50"
                    >
                      {t('browse.mostPopular')}
                    </SelectItem>
                    <SelectItem
                      value="priceAsc"
                      className="cursor-pointer transition-colors hover:bg-purple-50 focus:bg-purple-50"
                    >
                      {t('browse.priceLowToHigh')}
                    </SelectItem>
                    <SelectItem
                      value="priceDesc"
                      className="cursor-pointer transition-colors hover:bg-purple-50 focus:bg-purple-50"
                    >
                      {t('browse.priceHighToLow')}
                    </SelectItem>
                    <SelectItem
                      value="rating"
                      className="cursor-pointer transition-colors hover:bg-purple-50 focus:bg-purple-50"
                    >
                      {t('browse.highestRated')}
                    </SelectItem>
                    <SelectItem
                      value="newest"
                      className="cursor-pointer transition-colors hover:bg-purple-50 focus:bg-purple-50"
                    >
                      {t('browse.newest')}
                    </SelectItem>
                  </SelectContent>
                </Select>

                {/* Modern View Toggle */}
                <div className="rounded-xl border-2 border-gray-200 bg-white p-1 shadow-md">
                  <ToggleGroup
                    type="single"
                    value={viewMode}
                    onValueChange={(value) => value && setViewMode(value as any)}
                    className="gap-1"
                  >
                    <ToggleGroupItem
                      value="grid"
                      aria-label={t('browse.gridView')}
                      className="h-12 w-12 rounded-lg transition-all hover:bg-purple-100 data-[state=on]:bg-gradient-to-r data-[state=on]:from-purple-600 data-[state=on]:to-pink-600 data-[state=on]:text-white"
                    >
                      <Grid3x3 className="h-5 w-5" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="list"
                      aria-label={t('browse.listView')}
                      className="h-12 w-12 rounded-lg transition-all hover:bg-purple-100 data-[state=on]:bg-gradient-to-r data-[state=on]:from-purple-600 data-[state=on]:to-pink-600 data-[state=on]:text-white"
                    >
                      <List className="h-5 w-5" />
                    </ToggleGroupItem>
                    <ToggleGroupItem
                      value="compact"
                      aria-label={t('browse.compactView')}
                      className="h-12 w-12 rounded-lg transition-all hover:bg-purple-100 data-[state=on]:bg-gradient-to-r data-[state=on]:from-purple-600 data-[state=on]:to-pink-600 data-[state=on]:text-white"
                    >
                      <LayoutGrid className="h-5 w-5" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              </div>
            </div>

            {/* Enhanced Active Filters Bar */}
            {hasActiveFilters && (
              <div className="mt-6 flex items-center gap-3 rounded-xl bg-white p-4 shadow-md">
                <span className="text-sm font-semibold text-gray-700">Active filters:</span>
                <div className="flex flex-1 flex-wrap items-center gap-2">
                  {searchQuery && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-200">
                      <Search className="h-3 w-3" />
                      {searchQuery}
                      <button
                        className="ml-1 hover:text-purple-900"
                        onClick={() => setSearchQuery('')}
                        aria-label={t('browse.removeSearchFilter')}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {selectedCategory !== 'all' && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-purple-100 px-3 py-1.5 text-sm font-medium text-purple-700 transition-colors hover:bg-purple-200">
                      <Filter className="h-3 w-3" />
                      {categories.find((c) => c.value === selectedCategory)?.label}
                      <button
                        className="ml-1 hover:text-purple-900"
                        onClick={() => setSelectedCategory('all')}
                        aria-label={t('browse.removeCategoryFilter')}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                  {selectedPriceRange !== 'all' && (
                    <div className="inline-flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 transition-colors hover:bg-green-200">
                      <DollarSign className="h-3 w-3" />
                      {priceRanges.find((p) => p.value === selectedPriceRange)?.label}
                      <button
                        className="ml-1 hover:text-green-900"
                        onClick={() => setSelectedPriceRange('all')}
                        aria-label={t('browse.removePriceFilter')}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                  className="border-purple-600 text-purple-600 transition-all hover:bg-purple-600 hover:text-white"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Main Content with proper container and spacing */}
        <div className="container mx-auto px-4 py-8">
          {/* Results Header */}
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredCreators.length} {filteredCreators.length === 1 ? 'Creator' : 'Creators'}{' '}
              Found
            </h2>
            {totalPages > 1 && (
              <p className="text-sm text-gray-600">
                {tPagination('page')} {currentPage} {tPagination('of')} {totalPages}
              </p>
            )}
          </div>

          {/* Loading state */}
          {loading ? (
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                  <Skeleton className="aspect-[4/3]" />
                  <div className="space-y-3 p-4">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <Card className="col-span-full">
              <CardContent className="py-16 text-center">
                <div className="mb-4 text-6xl">⚠️</div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">Error loading creators</h3>
                <p className="mb-6 text-gray-600">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  Try again
                </Button>
              </CardContent>
            </Card>
          ) : currentCreators.length > 0 ? (
            <div
              className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : ''} ${viewMode === 'list' ? 'mx-auto max-w-4xl grid-cols-1' : ''} ${viewMode === 'compact' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : ''} `}
            >
              {currentCreators.map((creator) => (
                <CreatorCard key={creator.id} creator={creator} />
              ))}
            </div>
          ) : (
            <Card className="col-span-full">
              <CardContent className="py-16 text-center">
                <div className="mb-4 text-6xl">🎭</div>
                <h3 className="mb-2 text-2xl font-bold text-gray-900">{t('browse.noResults')}</h3>
                <p className="mb-6 text-gray-600">Try adjusting your filters or search terms</p>
                <Button
                  onClick={resetFilters}
                  variant="outline"
                  className="border-purple-600 text-purple-600 hover:bg-purple-50"
                >
                  Clear all filters
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Pagination with proper spacing */}
          {totalPages > 1 && (
            <div className="mt-12">
              <SimplePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                tPagination={tPagination}
              />
            </div>
          )}
        </div>

        {/* Creator Quick View Modal */}
        <CreatorQuickViewModal
          creator={selectedCreator}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedCreator(null)
          }}
          onBookNow={() => {
            setServicesModalState({ isOpen: true, defaultTab: 'video' })
            setIsModalOpen(false)
          }}
          onSubscribe={() => {
            setServicesModalState({ isOpen: true, defaultTab: 'subscription' })
            setIsModalOpen(false)
          }}
        />

        {/* Creator Services Modal */}
        {selectedCreator && (
          <CreatorServicesModal
            creator={{
              id: selectedCreator.id,
              name: selectedCreator.name,
              avatar: selectedCreator.image || '',
              responseTime: selectedCreator.responseTime,
              rating: selectedCreator.rating,
              price: selectedCreator.price
            }}
            open={servicesModalState.isOpen}
            onOpenChange={(open) => setServicesModalState({ ...servicesModalState, isOpen: open })}
            defaultTab={servicesModalState.defaultTab}
          />
        )}
      </div>
    </div>
  )
}
