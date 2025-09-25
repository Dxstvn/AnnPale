'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, Filter, Globe, Star, Clock, DollarSign, 
  Music, Users, Sparkles, ChevronRight, TrendingUp,
  Grid3x3, List, LayoutGrid, Check, X, ChevronDown,
  Mic, Radio, Tv, Palette, BookOpen, ChefHat, Dumbbell,
  Theater, Laugh, Camera, Award, Languages, Shield
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface Creator {
  id: string
  name: string
  email: string
  avatar_url?: string
  bio?: string
  category?: string
  verified?: boolean
  languages?: string[]
  tier_count?: number
  min_price?: number
  max_price?: number
  created_at?: string
}

// Category definitions with icons
const categories = [
  { value: 'Music', label: 'Music', icon: Music, subcategories: ['Konpa', 'Rap', 'R&B', 'Gospel'] },
  { value: 'Entertainment', label: 'Entertainment', icon: Theater, subcategories: ['Comedy', 'Dance', 'Theater'] },
  { value: 'Media', label: 'Media', icon: Radio, subcategories: ['Radio', 'TV', 'Podcast'] },
  { value: 'Sports', label: 'Sports & Fitness', icon: Dumbbell, subcategories: [] },
  { value: 'Culinary', label: 'Culinary Arts', icon: ChefHat, subcategories: [] },
  { value: 'Visual Arts', label: 'Visual Arts', icon: Palette, subcategories: [] },
  { value: 'Education', label: 'Education & Business', icon: BookOpen, subcategories: [] }
]

// Language options
const languageOptions = [
  { value: 'Kreyòl', label: 'Kreyòl Ayisyen', flag: '🇭🇹' },
  { value: 'English', label: 'English', flag: '🇺🇸' },
  { value: 'French', label: 'Français', flag: '🇫🇷' },
  { value: 'Spanish', label: 'Español', flag: '🇪🇸' }
]

export default function FanExplorePage() {
  const router = useRouter()
  const [creators, setCreators] = useState<Creator[]>([])
  const [filteredCreators, setFilteredCreators] = useState<Creator[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [priceFilter, setPriceFilter] = useState('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [languageFilter, setLanguageFilter] = useState('all')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'compact'>('grid')
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCreators()
  }, [])

  const loadCreators = async () => {
    try {
      const supabase = createClient()
      
      // Fetch all creators (regardless of Stripe onboarding status)
      // This allows discovery of all creators, even those still setting up payments
      // Using select('*') to ensure resilience to database schema changes
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'creator')
        .order('name')

      // Also fetch their subscription tiers separately if needed
      let creatorsWithTiers = data || []
      if (data && data.length > 0) {
        const creatorIds = data.map(c => c.id)
        const { data: tiersData } = await supabase
          .from('creator_subscription_tiers')
          .select('creator_id, price, is_active')
          .in('creator_id', creatorIds)
          .eq('is_active', true)

        // Map tiers to creators
        if (tiersData) {
          creatorsWithTiers = data.map(creator => ({
            ...creator,
            creator_subscription_tiers: tiersData.filter(t => t.creator_id === creator.id)
          }))
        }
      }

      if (error) {
        console.error('Supabase query error:', error)
        // Use mock data if database query fails
        const mockCreators = getMockCreators()
        setCreators(mockCreators)
        setFilteredCreators(mockCreators)
        setError(null)
        setLoading(false)
        return
      }
      
      console.log('Raw query data:', creatorsWithTiers)
      console.log('Number of creators found:', creatorsWithTiers?.length || 0)

      // If no creators found, use mock data
      if (!creatorsWithTiers || creatorsWithTiers.length === 0) {
        const mockCreators = getMockCreators()
        setCreators(mockCreators)
        setFilteredCreators(mockCreators)
        setError(null)
        setLoading(false)
        return
      }

      // Process creators with tier information
      const processedCreators = creatorsWithTiers?.map(creator => {
        const activeTiers = creator.creator_subscription_tiers?.filter((t: any) => t.is_active) || []
        // Use actual category from database
        let category = creator.category || 'Entertainment'
        
        return {
          id: creator.id,
          name: creator.name,
          email: creator.email,
          avatar_url: creator.avatar_url,
          bio: creator.bio,
          category: category,
          verified: creator.public_figure_verified || creator.is_demo_account || false,
          languages: ['Kreyòl', 'English', 'French'], // Default languages
          tier_count: activeTiers.length,
          min_price: activeTiers.length > 0 ? Math.min(...activeTiers.map((t: any) => t.price)) : 0,
          max_price: activeTiers.length > 0 ? Math.max(...activeTiers.map((t: any) => t.price)) : 0,
          created_at: creator.created_at,
          stripe_onboarded: creator.stripe_charges_enabled && creator.stripe_payouts_enabled
        }
      }) || []

      setCreators(processedCreators)
      setFilteredCreators(processedCreators)
      setError(null)
    } catch (err: any) {
      console.error('Error loading creators:', err)
      // Use mock data on error
      const mockCreators = getMockCreators()
      setCreators(mockCreators)
      setFilteredCreators(mockCreators)
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  // Mock data for testing
  const getMockCreators = (): Creator[] => {
    return [
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Jean Baptiste',
        email: 'creator1@test.com',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator1',
        bio: 'Popular Haitian musician and performer',
        category: 'Music',
        verified: true,
        languages: ['Kreyòl', 'English', 'French'],
        tier_count: 3,
        min_price: 9.99,
        max_price: 49.99,
        created_at: new Date().toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Marie Louise',
        email: 'creator2@test.com',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator2',
        bio: 'Renowned Haitian actress and comedian',
        category: 'Entertainment',
        verified: true,
        languages: ['Kreyòl', 'French'],
        tier_count: 2,
        min_price: 14.99,
        max_price: 29.99,
        created_at: new Date().toISOString()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440003',
        name: 'Pierre Michel',
        email: 'creator3@test.com',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=creator3',
        bio: 'Professional athlete and sports personality',
        category: 'Sports',
        verified: false,
        languages: ['Kreyòl', 'English', 'French'],
        tier_count: 1,
        min_price: 24.99,
        max_price: 24.99,
        created_at: new Date().toISOString()
      },
      {
        id: 'bd47a39e-de73-4aa4-bd58-d11bcdacd63f',
        name: 'Test Creator',
        email: 'testcreator@annpale.test',
        avatar_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=testcreator',
        bio: 'Test creator for E2E testing with multiple subscription tiers',
        category: 'Entertainment',
        verified: true,
        languages: ['Kreyòl', 'English', 'French'],
        tier_count: 2,
        min_price: 5.00,
        max_price: 15.00,
        created_at: new Date().toISOString()
      }
    ]
  }

  // Apply filters and sorting
  const processedCreators = useMemo(() => {
    let filtered = [...creators]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(creator =>
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.bio?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(creator => creator.category === categoryFilter)
    }

    // Apply language filter
    if (languageFilter !== 'all') {
      filtered = filtered.filter(creator => 
        creator.languages?.includes(languageFilter)
      )
    }

    // Apply verified filter
    if (verifiedOnly) {
      filtered = filtered.filter(creator => creator.verified)
    }

    // Apply price filter
    if (priceFilter !== 'all') {
      const [min, max] = priceFilter.split('-').map(p => p === '+' ? Infinity : parseInt(p))
      filtered = filtered.filter(creator => {
        if (!creator.min_price) return false
        if (max === Infinity) return creator.min_price >= min
        return creator.min_price >= min && creator.max_price! <= max
      })
    }

    // Apply sorting
    switch (sortBy) {
      case 'priceAsc':
        filtered.sort((a, b) => (a.min_price || 0) - (b.min_price || 0))
        break
      case 'priceDesc':
        filtered.sort((a, b) => (b.max_price || 0) - (a.max_price || 0))
        break
      case 'tiers':
        filtered.sort((a, b) => (b.tier_count || 0) - (a.tier_count || 0))
        break
      case 'newest':
        filtered.sort((a, b) => 
          new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
        )
        break
      default:
        filtered.sort((a, b) => a.name.localeCompare(b.name))
    }

    return filtered
  }, [creators, searchQuery, categoryFilter, languageFilter, verifiedOnly, priceFilter, sortBy])

  useEffect(() => {
    setFilteredCreators(processedCreators)
  }, [processedCreators])

  const handleCreatorClick = (creatorId: string) => {
    router.push(`/fan/creators/${creatorId}`)
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
  }

  const formatCreatorCardId = (name: string) => {
    return `creator-card-${name.toLowerCase().replace(/\s+/g, '-')}`
  }

  const getCategoryIcon = (category?: string) => {
    const cat = categories.find(c => c.value === category)
    return cat?.icon || Sparkles
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setCategoryFilter('all')
    setLanguageFilter('all')
    setPriceFilter('all')
    setVerifiedOnly(false)
    setSortBy('name')
  }

  const hasActiveFilters = searchQuery || categoryFilter !== 'all' || 
    languageFilter !== 'all' || priceFilter !== 'all' || verifiedOnly

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Floating cultural emojis */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-20 left-10 text-6xl opacity-10"
        >
          🎭
        </motion.div>
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -15, 15, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-40 right-20 text-7xl opacity-10"
        >
          🎵
        </motion.div>
        <motion.div 
          animate={{ 
            y: [0, -15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 7, repeat: Infinity }}
          className="absolute bottom-32 left-20 text-8xl opacity-10"
        >
          🎨
        </motion.div>
      </div>

      {/* Header Section with Glassmorphism */}
      <div className="relative bg-gradient-to-r from-purple-600/90 to-pink-600/90 backdrop-blur-md border-b border-white/20">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              Explore Creators
              <Sparkles className="h-8 w-8 text-yellow-300 animate-pulse" />
            </h1>
            <p className="text-white/90 mt-2">
              Discover talented Haitian creators and explore their profiles
            </p>
          </div>

          {/* Search Bar with Glassmorphism */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 z-10" />
            <Input
              type="text"
              placeholder="Search creators by name or bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-14 bg-white/90 backdrop-blur-sm border-white/50 text-lg shadow-xl"
              data-testid="search-creators"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 280, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                className="hidden lg:block"
              >
                <Card className="sticky top-4 shadow-xl border-purple-100">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Filter className="h-5 w-5" />
                        Filters
                      </span>
                      {hasActiveFilters && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={clearAllFilters}
                          data-testid="clear-all-filters"
                        >
                          Clear all
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-6">
                    {/* Category Filter */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Category</Label>
                      <div className="max-h-80 overflow-y-auto pr-2">
                        <div className="space-y-2" data-testid="filter-category">
                          <Button
                            variant={categoryFilter === 'all' ? 'default' : 'outline'}
                            size="sm"
                            className="w-full justify-start text-left"
                            onClick={() => setCategoryFilter('all')}
                          >
                            All Categories
                          </Button>
                          {categories.map(cat => {
                            const Icon = cat.icon
                            return (
                              <Button
                                key={cat.value}
                                variant={categoryFilter === cat.value ? 'default' : 'outline'}
                                size="sm"
                                className="w-full justify-start text-left"
                                onClick={() => setCategoryFilter(cat.value)}
                                data-testid={`category-${cat.value.toLowerCase()}`}
                              >
                                <Icon className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span className="truncate">{cat.label}</span>
                              </Button>
                            )
                          })}
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Price Range */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Price Range</Label>
                      <Select value={priceFilter} onValueChange={setPriceFilter}>
                        <SelectTrigger data-testid="filter-price">
                          <SelectValue placeholder="All Prices" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Prices</SelectItem>
                          <SelectItem value="0-20">Under $20</SelectItem>
                          <SelectItem value="20-50">$20 - $50</SelectItem>
                          <SelectItem value="50-100">$50 - $100</SelectItem>
                          <SelectItem value="100+">$100+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Separator />

                    {/* Language Filter */}
                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Language</Label>
                      <div className="space-y-2" data-testid="filter-language">
                        <Button
                          variant={languageFilter === 'all' ? 'default' : 'outline'}
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => setLanguageFilter('all')}
                        >
                          All Languages
                        </Button>
                        {languageOptions.map(lang => (
                          <Button
                            key={lang.value}
                            variant={languageFilter === lang.value ? 'default' : 'outline'}
                            size="sm"
                            className="w-full justify-start"
                            onClick={() => setLanguageFilter(lang.value)}
                            data-testid={`language-${lang.value.toLowerCase()}`}
                          >
                            <span className="mr-2">{lang.flag}</span>
                            {lang.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Verified Only */}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="verified" className="text-sm font-semibold flex items-center gap-2">
                        <Shield className="h-4 w-4" />
                        Verified Only
                      </Label>
                      <Switch
                        id="verified"
                        checked={verifiedOnly}
                        onCheckedChange={setVerifiedOnly}
                        data-testid="filter-verified"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <h2 className="text-xl font-semibold">
                  {filteredCreators.length} Creator{filteredCreators.length !== 1 ? 's' : ''} Found
                </h2>
              </div>

              <div className="flex items-center gap-4">
                {/* Sort Dropdown */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]" data-testid="sort-by">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="priceAsc">Price: Low to High</SelectItem>
                    <SelectItem value="priceDesc">Price: High to Low</SelectItem>
                    <SelectItem value="tiers">Most Tiers</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center gap-1 bg-white rounded-lg p-1 shadow-sm">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    data-testid="view-mode-grid"
                  >
                    <Grid3x3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    data-testid="view-mode-list"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'compact' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('compact')}
                    data-testid="view-mode-compact"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm text-gray-600">Active filters:</span>
                {searchQuery && (
                  <Badge variant="secondary" className="gap-1" data-testid="active-filter-search">
                    <Search className="h-3 w-3" />
                    {searchQuery}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => setSearchQuery('')}
                    />
                  </Badge>
                )}
                {categoryFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1" data-testid={`active-filter-${categoryFilter}`}>
                    {React.createElement(getCategoryIcon(categoryFilter), { className: "h-3 w-3" })}
                    {categoryFilter}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => setCategoryFilter('all')}
                    />
                  </Badge>
                )}
                {languageFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1" data-testid="active-filter-language">
                    <Languages className="h-3 w-3" />
                    {languageFilter}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => setLanguageFilter('all')}
                    />
                  </Badge>
                )}
                {priceFilter !== 'all' && (
                  <Badge variant="secondary" className="gap-1" data-testid="active-filter-price">
                    <DollarSign className="h-3 w-3" />
                    {priceFilter === '100+' ? '$100+' : `$${priceFilter.replace('-', ' - $')}`}
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => setPriceFilter('all')}
                    />
                  </Badge>
                )}
                {verifiedOnly && (
                  <Badge variant="secondary" className="gap-1" data-testid="active-filter-verified">
                    <Shield className="h-3 w-3" />
                    Verified Only
                    <X 
                      className="h-3 w-3 ml-1 cursor-pointer" 
                      onClick={() => setVerifiedOnly(false)}
                    />
                  </Badge>
                )}
              </div>
            )}

            {/* Error Display */}
            {error && (
              <Card className="border-red-200 bg-red-50 mb-6">
                <CardContent className="p-4">
                  <p className="text-red-600">Error: {error}</p>
                </CardContent>
              </Card>
            )}

            {/* Results Grid/List */}
            {loading ? (
              <div 
                className={cn(
                  viewMode === 'grid' && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                  viewMode === 'list' && "space-y-4",
                  viewMode === 'compact' && "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                )}
                data-testid="creators-loading"
              >
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-20 bg-gray-200 rounded mb-4" />
                      <div className="h-4 bg-gray-200 rounded mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-2/3" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredCreators.length > 0 ? (
              <div 
                className={cn(
                  viewMode === 'grid' && "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                  viewMode === 'list' && "space-y-4",
                  viewMode === 'compact' && "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                )}
                data-testid={`creator-${viewMode}`}
                data-creators-loaded="true"
              >
                {filteredCreators.map((creator, index) => (
                  <motion.div
                    key={creator.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {viewMode === 'grid' && (
                      <Card
                        className="cursor-pointer hover:shadow-2xl transition-all hover:-translate-y-2 overflow-hidden group"
                        onClick={() => handleCreatorClick(creator.id)}
                        data-testid={formatCreatorCardId(creator.name)}
                      >
                        {/* Category Badge Overlay */}
                        {creator.category && (
                          <div className="absolute top-4 right-4 z-10">
                            <Badge
                              className="bg-white/90 backdrop-blur-sm shadow-lg text-gray-800"
                              data-testid="creator-category"
                            >
                              {React.createElement(getCategoryIcon(creator.category), { className: "h-3 w-3 mr-1" })}
                              {creator.category}
                            </Badge>
                          </div>
                        )}
                        
                        <CardHeader className="relative pb-3">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-16 w-16 ring-4 ring-purple-100 group-hover:ring-purple-300 transition-all">
                              <AvatarImage src={creator.avatar_url} />
                              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg">
                                {getInitials(creator.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <CardTitle className="text-xl flex items-center gap-2">
                                {creator.name}
                                {creator.verified && (
                                  <Badge variant="secondary" className="gap-1" data-testid="verified-badge">
                                    <Shield className="h-3 w-3" />
                                    Verified
                                  </Badge>
                                )}
                              </CardTitle>
                              {creator.tier_count ? (
                                <Badge variant="outline" className="mt-2">
                                  <Users className="h-3 w-3 mr-1" />
                                  {creator.tier_count} tier{creator.tier_count !== 1 ? 's' : ''}
                                </Badge>
                              ) : (
                                <span className="text-sm text-gray-500">No tiers yet</span>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          {creator.bio && (
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {creator.bio}
                            </p>
                          )}
                          
                          {/* Language Badges */}
                          {creator.languages && creator.languages.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {creator.languages.slice(0, 3).map(lang => {
                                const langOption = languageOptions.find(l => l.value === lang)
                                return (
                                  <Badge 
                                    key={lang} 
                                    variant="secondary" 
                                    className="text-xs"
                                    data-testid="language-badge"
                                  >
                                    {langOption?.flag} {lang}
                                  </Badge>
                                )
                              })}
                            </div>
                          )}
                          
                          <Button
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white group"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleCreatorClick(creator.id)
                            }}
                            data-testid="view-creator-profile-btn"
                          >
                            View Profile
                            <ChevronRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </CardContent>
                      </Card>
                    )}

                    {viewMode === 'list' && (
                      <Card
                        className="cursor-pointer hover:shadow-xl transition-all"
                        onClick={() => handleCreatorClick(creator.id)}
                        data-testid={formatCreatorCardId(creator.name)}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-center gap-6">
                            <Avatar className="h-20 w-20">
                              <AvatarImage src={creator.avatar_url} />
                              <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xl">
                                {getInitials(creator.name)}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-3">
                                <h3 className="text-xl font-semibold">{creator.name}</h3>
                                {creator.verified && (
                                  <Badge variant="secondary" data-testid="verified-badge">
                                    <Shield className="h-3 w-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                                {creator.category && (
                                  <Badge variant="outline" data-testid="creator-category">
                                    {creator.category}
                                  </Badge>
                                )}
                              </div>
                              
                              {creator.bio && (
                                <p className="text-gray-600">{creator.bio}</p>
                              )}
                              
                              <div className="flex items-center gap-4">
                                <Badge variant="outline">
                                  {creator.tier_count || 0} tiers
                                </Badge>
                                {creator.languages?.map(lang => (
                                  <Badge key={lang} variant="secondary" data-testid="language-badge">
                                    {lang}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <Button
                              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                              data-testid="view-creator-profile-btn"
                            >
                              View Profile
                              <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {viewMode === 'compact' && (
                      <Card
                        className="cursor-pointer hover:shadow-xl transition-all"
                        onClick={() => handleCreatorClick(creator.id)}
                        data-testid={formatCreatorCardId(creator.name)}
                      >
                        <CardContent className="p-4 text-center">
                          <Avatar className="h-12 w-12 mx-auto mb-2">
                            <AvatarImage src={creator.avatar_url} />
                            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm">
                              {getInitials(creator.name)}
                            </AvatarFallback>
                          </Avatar>
                          <h4 className="font-semibold text-sm truncate">{creator.name}</h4>
                          {creator.verified && (
                            <Shield className="h-3 w-3 mx-auto mt-1 text-purple-600" data-testid="verified-badge" />
                          )}
                          {creator.min_price && (
                            <p className="text-xs text-gray-600 mt-1">
                              From ${creator.min_price}/mo
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card data-testid="no-creators-found" data-creators-loaded="true">
                <CardContent className="py-16 text-center">
                  <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No creators found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                  <Button 
                    variant="outline"
                    onClick={clearAllFilters}
                  >
                    Clear all filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Back to Top Button */}
      {filteredCreators.length > 6 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronDown className="h-6 w-6 rotate-180" />
        </motion.button>
      )}
    </div>
  )
}