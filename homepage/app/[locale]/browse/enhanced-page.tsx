"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { 
  Search, 
  Star, 
  Filter, 
  SlidersHorizontal,
  Clock,
  Globe,
  DollarSign,
  CheckCircle,
  TrendingUp,
  Heart
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

// Import our new components
import { FilterSidebar, type FilterState } from "@/components/browse/filter-sidebar"
import { FilterPills } from "@/components/browse/filter-pills"
import { ViewToggle, type ViewMode } from "@/components/browse/view-toggle"
import { BrowseSkeleton } from "@/components/browse/browse-skeleton"

// Mock data - in production this would come from an API
const allCreators = [
  {
    id: 1,
    name: "Wyclef Jean",
    category: "musician",
    price: 150,
    rating: 4.9,
    reviews: 1247,
    image: "/images/wyclef-jean.png",
    responseTime: "24hr",
    verified: true,
    languages: ["english", "french", "kreyol"],
    availability: "available",
    videoCount: 342,
    bio: "Grammy-winning artist and producer",
    trending: true
  },
  {
    id: 2,
    name: "Ti Jo Zenny",
    category: "comedian",
    price: 85,
    rating: 4.8,
    reviews: 456,
    image: "/images/ti-jo-zenny.jpg",
    responseTime: "2days",
    verified: true,
    languages: ["kreyol", "french"],
    availability: "available",
    videoCount: 128,
    bio: "Haiti's favorite comedian",
    featured: true
  },
  {
    id: 4,
    name: "Richard Cave",
    category: "actor",
    price: 120,
    rating: 4.9,
    reviews: 678,
    image: "/images/richard-cave.jpg",
    responseTime: "3days",
    verified: true,
    languages: ["french", "kreyol"],
    availability: "this-week",
    videoCount: 89,
    bio: "Award-winning Haitian actor"
  },
  {
    id: 5,
    name: "Michael Brun",
    category: "dj",
    price: 200,
    rating: 4.8,
    reviews: 892,
    image: "/images/michael-brun.jpg",
    responseTime: "2days",
    verified: true,
    languages: ["english", "french"],
    availability: "available",
    videoCount: 156,
    bio: "International DJ and producer"
  },
  {
    id: 6,
    name: "Rutshelle Guillaume",
    category: "singer",
    price: 85,
    rating: 4.9,
    reviews: 634,
    image: "/images/rutshelle-guillaume.jpg",
    responseTime: "24hr",
    verified: true,
    languages: ["kreyol", "french"],
    availability: "available",
    videoCount: 213,
    bio: "Powerful voice of Haiti"
  },
  {
    id: 7,
    name: "Kenny",
    category: "singer",
    price: 95,
    rating: 4.6,
    reviews: 423,
    image: "/images/kenny.jpg",
    responseTime: "2days",
    verified: true,
    languages: ["kreyol"],
    availability: "this-month",
    videoCount: 97,
    bio: "Kompa music sensation"
  },
  {
    id: 8,
    name: "Carel Pedre",
    category: "radio-host",
    price: 110,
    rating: 4.8,
    reviews: 567,
    image: "/images/carel-pedre.jpg",
    responseTime: "24hr",
    verified: true,
    languages: ["french", "kreyol", "english"],
    availability: "available",
    videoCount: 178,
    bio: "Voice of Haitian radio"
  },
  {
    id: 9,
    name: "DJ K9",
    category: "dj",
    price: 65,
    rating: 4.7,
    reviews: 234,
    image: "/images/dj-k9.jpg",
    responseTime: "24hr",
    verified: true,
    languages: ["kreyol", "english"],
    availability: "available",
    videoCount: 67,
    bio: "Party DJ extraordinaire"
  },
  {
    id: 10,
    name: "DJ Bullet",
    category: "dj",
    price: 70,
    rating: 4.6,
    reviews: 189,
    image: "/images/dj-bullet.jpg",
    responseTime: "24hr",
    verified: true,
    languages: ["kreyol"],
    availability: "available",
    videoCount: 54,
    bio: "Master of the turntables"
  },
  {
    id: 11,
    name: "J Perry",
    category: "singer",
    price: 90,
    rating: 4.8,
    reviews: 345,
    image: "/images/jonathan-perry.jpg",
    responseTime: "2days",
    verified: true,
    languages: ["kreyol", "french"],
    availability: "this-week",
    videoCount: 112,
    bio: "Rising star of Haitian music"
  },
  {
    id: 13,
    name: "Reynaldo Martino",
    category: "singer",
    price: 105,
    rating: 4.8,
    reviews: 312,
    image: "/images/reynaldo-martino.jpg",
    responseTime: "2days",
    verified: true,
    languages: ["kreyol", "spanish"],
    availability: "available",
    videoCount: 93,
    bio: "Cross-cultural music artist"
  },
]

const defaultFilters: FilterState = {
  categories: [],
  priceRange: [0, 500],
  responseTime: [],
  languages: [],
  rating: 0,
  availability: "all",
  verified: false
}

export default function EnhancedBrowsePage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // State
  const [isLoading, setIsLoading] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [sortBy, setSortBy] = React.useState("featured")
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid")
  const [filters, setFilters] = React.useState<FilterState>(defaultFilters)
  const [showMobileFilters, setShowMobileFilters] = React.useState(false)
  const [favorites, setFavorites] = React.useState<number[]>([])

  // Parse filters from URL on mount
  React.useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    const urlFilters: FilterState = { ...defaultFilters }
    
    // Parse categories
    const categories = params.get("categories")
    if (categories) urlFilters.categories = categories.split(",")
    
    // Parse price range
    const minPrice = params.get("minPrice")
    const maxPrice = params.get("maxPrice")
    if (minPrice || maxPrice) {
      urlFilters.priceRange = [
        minPrice ? parseInt(minPrice) : 0,
        maxPrice ? parseInt(maxPrice) : 500
      ]
    }
    
    // Parse other filters
    const responseTime = params.get("responseTime")
    if (responseTime) urlFilters.responseTime = responseTime.split(",")
    
    const languages = params.get("languages")
    if (languages) urlFilters.languages = languages.split(",")
    
    const rating = params.get("rating")
    if (rating) urlFilters.rating = parseFloat(rating)
    
    const availability = params.get("availability")
    if (availability) urlFilters.availability = availability
    
    const verified = params.get("verified")
    if (verified === "true") urlFilters.verified = true
    
    setFilters(urlFilters)
  }, [searchParams])

  // Update URL when filters change
  const updateURL = React.useCallback((newFilters: FilterState) => {
    const params = new URLSearchParams()
    
    if (newFilters.categories.length > 0) {
      params.set("categories", newFilters.categories.join(","))
    }
    
    if (newFilters.priceRange[0] > 0 || newFilters.priceRange[1] < 500) {
      params.set("minPrice", newFilters.priceRange[0].toString())
      params.set("maxPrice", newFilters.priceRange[1].toString())
    }
    
    if (newFilters.responseTime.length > 0) {
      params.set("responseTime", newFilters.responseTime.join(","))
    }
    
    if (newFilters.languages.length > 0) {
      params.set("languages", newFilters.languages.join(","))
    }
    
    if (newFilters.rating > 0) {
      params.set("rating", newFilters.rating.toString())
    }
    
    if (newFilters.availability !== "all") {
      params.set("availability", newFilters.availability)
    }
    
    if (newFilters.verified) {
      params.set("verified", "true")
    }
    
    const queryString = params.toString()
    router.push(`${pathname}${queryString ? `?${queryString}` : ""}`)
  }, [pathname, router])

  // Filter and sort creators
  const filteredCreators = React.useMemo(() => {
    return allCreators.filter((creator) => {
      // Search term
      const matchesSearch =
        creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        creator.bio.toLowerCase().includes(searchTerm.toLowerCase())
      
      // Categories
      const matchesCategory =
        filters.categories.length === 0 || 
        filters.categories.includes(creator.category)
      
      // Price range
      const matchesPrice =
        creator.price >= filters.priceRange[0] &&
        creator.price <= filters.priceRange[1]
      
      // Response time
      const matchesResponseTime =
        filters.responseTime.length === 0 ||
        filters.responseTime.includes(creator.responseTime)
      
      // Languages
      const matchesLanguages =
        filters.languages.length === 0 ||
        filters.languages.some(lang => creator.languages.includes(lang))
      
      // Rating
      const matchesRating = creator.rating >= filters.rating
      
      // Availability
      const matchesAvailability =
        filters.availability === "all" ||
        creator.availability === filters.availability
      
      // Verified
      const matchesVerified = !filters.verified || creator.verified
      
      return matchesSearch && matchesCategory && matchesPrice &&
        matchesResponseTime && matchesLanguages && matchesRating &&
        matchesAvailability && matchesVerified
    })
  }, [searchTerm, filters])

  const sortedCreators = React.useMemo(() => {
    return [...filteredCreators].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "reviews":
          return b.reviews - a.reviews
        case "newest":
          return b.id - a.id
        case "response":
          const responseOrder = ["24hr", "2days", "3days", "1week"]
          return responseOrder.indexOf(a.responseTime) - responseOrder.indexOf(b.responseTime)
        default: // featured
          // Prioritize trending and featured
          if (a.trending && !b.trending) return -1
          if (!a.trending && b.trending) return 1
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.reviews - a.reviews
      }
    })
  }, [filteredCreators, sortBy])

  // Handlers
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters)
    updateURL(newFilters)
  }

  const handleRemoveFilter = (filterType: keyof FilterState, value?: string | number) => {
    const newFilters = { ...filters }
    
    switch (filterType) {
      case "categories":
        newFilters.categories = filters.categories.filter(c => c !== value)
        break
      case "languages":
        newFilters.languages = filters.languages.filter(l => l !== value)
        break
      case "responseTime":
        newFilters.responseTime = filters.responseTime.filter(t => t !== value)
        break
      case "priceRange":
        newFilters.priceRange = [0, 500]
        break
      case "rating":
        newFilters.rating = 0
        break
      case "availability":
        newFilters.availability = "all"
        break
      case "verified":
        newFilters.verified = false
        break
    }
    
    handleFiltersChange(newFilters)
  }

  const handleReset = () => {
    setFilters(defaultFilters)
    setSearchTerm("")
    setSortBy("featured")
    updateURL(defaultFilters)
  }

  const toggleFavorite = (creatorId: number) => {
    setFavorites(prev => 
      prev.includes(creatorId) 
        ? prev.filter(id => id !== creatorId)
        : [...prev, creatorId]
    )
  }

  // Render creator card based on view mode
  const renderCreatorCard = (creator: typeof allCreators[0]) => {
    const isFavorite = favorites.includes(creator.id)
    
    if (viewMode === "list") {
      return (
        <Card className="group hover:shadow-lg transition-all duration-200">
          <CardContent className="p-0">
            <div className="flex gap-4">
              <div className="relative">
                <Image
                  src={creator.image || "/placeholder.svg"}
                  alt={creator.name}
                  width={128}
                  height={128}
                  className="w-32 h-32 object-cover rounded-l-lg"
                />
                {creator.verified && (
                  <Badge className="absolute top-2 left-2 bg-blue-600">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex-1 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {creator.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {creator.bio}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault()
                      toggleFavorite(creator.id)
                    }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
                  >
                    <Heart className={cn(
                      "h-5 w-5",
                      isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
                    )} />
                  </button>
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{creator.rating}</span>
                    <span className="text-gray-500">({creator.reviews})</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{creator.responseTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span>{creator.languages.length} languages</span>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-4">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    ${creator.price}
                  </div>
                  <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }
    
    if (viewMode === "compact") {
      return (
        <Card className="group hover:shadow-md transition-all duration-200">
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              <Image
                src={creator.image || "/placeholder.svg"}
                alt={creator.name}
                width={48}
                height={48}
                className="w-12 h-12 object-cover rounded-full"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{creator.name}</h3>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <span className="flex items-center gap-0.5">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {creator.rating}
                  </span>
                  <span>•</span>
                  <span>{creator.category}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-sm">${creator.price}</div>
                <div className="text-xs text-gray-500">{creator.responseTime}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )
    }
    
    // Grid view (default)
    return (
      <Card className="group cursor-pointer hover:shadow-xl transition-all duration-200 overflow-hidden">
        <CardContent className="p-0">
          <div className="relative">
            <Image
              src={creator.image || "/placeholder.svg"}
              alt={creator.name}
              width={300}
              height={300}
              className="w-full h-64 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            {creator.verified && (
              <Badge className="absolute top-3 left-3 bg-blue-600">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            )}
            {creator.trending && (
              <Badge className="absolute top-3 right-3 bg-gradient-to-r from-purple-600 to-pink-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                Trending
              </Badge>
            )}
            <button
              onClick={(e) => {
                e.preventDefault()
                toggleFavorite(creator.id)
              }}
              className="absolute bottom-3 right-3 p-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Heart className={cn(
                "h-4 w-4",
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
              )} />
            </button>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                {creator.name}
              </h3>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{creator.rating}</span>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
              {creator.category.charAt(0).toUpperCase() + creator.category.slice(1)}
            </p>
            <div className="flex items-center justify-between">
              <div className="text-lg font-bold text-gray-900 dark:text-white">
                ${creator.price}
              </div>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <Clock className="h-3 w-3" />
                <span>{creator.responseTime}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <span>{creator.reviews.toLocaleString()} reviews</span>
              <span>•</span>
              <span>{creator.videoCount} videos</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Page Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Browse Creators
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Discover amazing Haitian creators ready to make your perfect video message
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar
                filters={filters}
                onFiltersChange={handleFiltersChange}
                onReset={handleReset}
                totalResults={sortedCreators.length}
              />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search creators by name, category, or bio..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="featured">Featured</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="reviews">Most Reviews</SelectItem>
                      <SelectItem value="response">Fastest Response</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <ViewToggle value={viewMode} onChange={setViewMode} />
                  
                  {/* Mobile Filter Button */}
                  <Sheet open={showMobileFilters} onOpenChange={setShowMobileFilters}>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden">
                        <SlidersHorizontal className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-80">
                      <FilterSidebar
                        filters={filters}
                        onFiltersChange={handleFiltersChange}
                        onReset={handleReset}
                        totalResults={sortedCreators.length}
                        isMobile
                        onClose={() => setShowMobileFilters(false)}
                      />
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            <FilterPills
              filters={filters}
              onRemoveFilter={handleRemoveFilter}
              onClearAll={handleReset}
              onOpenFilters={() => setShowMobileFilters(true)}
              className="mb-6"
            />

            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {sortedCreators.length} of {allCreators.length} creators
            </div>

            {/* Results Grid/List */}
            {isLoading ? (
              <BrowseSkeleton viewMode={viewMode} />
            ) : (
              <AnimatePresence mode="wait">
                {sortedCreators.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={cn(
                      viewMode === "grid" && "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6",
                      viewMode === "list" && "space-y-4",
                      viewMode === "compact" && "grid grid-cols-1 md:grid-cols-2 gap-4"
                    )}
                  >
                    {sortedCreators.map((creator) => (
                      <Link key={creator.id} href={`/creator/${creator.id}`}>
                        {renderCreatorCard(creator)}
                      </Link>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-center py-12"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full mb-4">
                      <Search className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      No creators found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Try adjusting your filters or search terms
                    </p>
                    <Button onClick={handleReset} variant="outline">
                      Clear all filters
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}