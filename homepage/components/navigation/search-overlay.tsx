"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  X, 
  Search, 
  TrendingUp, 
  Clock, 
  Music, 
  Mic, 
  Video,
  Users,
  Star
} from "lucide-react"
import { cn } from "@/lib/utils"

interface SearchOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const trendingSearches = [
  "Birthday messages",
  "Wyclef Jean",
  "Wedding congratulations",
  "Comedy",
  "Musicians",
]

const recentSearches = [
  "Ti Jo Zenny",
  "Anniversary wishes",
  "Haitian musicians",
]

const popularCategories = [
  { name: "Music", icon: Music, count: 125 },
  { name: "Comedy", icon: Mic, count: 87 },
  { name: "Sports", icon: Users, count: 45 },
  { name: "Actors", icon: Video, count: 62 },
]

const popularCreators = [
  { id: 1, name: "Wyclef Jean", category: "Musician", rating: 4.9, avatar: "/images/wyclef-jean.png" },
  { id: 2, name: "Ti Jo Zenny", category: "Comedian", rating: 4.8, avatar: "/images/ti-jo-zenny.jpg" },
  { id: 3, name: "Michael Brun", category: "DJ/Producer", rating: 4.9, avatar: "/images/michael-brun.jpg" },
]

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<any>(null)
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsSearching(true)
      // Simulate search delay
      const timer = setTimeout(() => {
        setSearchResults({
          creators: popularCreators.filter(c => 
            c.name.toLowerCase().includes(searchQuery.toLowerCase())
          ),
          categories: popularCategories.filter(c =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        })
        setIsSearching(false)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setSearchResults(null)
    }
  }, [searchQuery])

  const handleSearch = (query: string) => {
    router.push(`/browse?search=${encodeURIComponent(query)}`)
    onClose()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      handleSearch(searchQuery)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -50, opacity: 0 }}
        className="bg-white dark:bg-gray-900 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="container mx-auto px-4 py-8">
          {/* Search Input */}
          <form onSubmit={handleSubmit} className="relative max-w-3xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400" />
            <Input
              ref={inputRef}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for creators, categories, or occasions..."
              className="h-14 pl-14 pr-14 text-lg border-2 border-purple-200 focus:border-purple-500"
            />
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition"
            >
              <X className="h-5 w-5" />
            </button>
          </form>

          {/* Search Results or Suggestions */}
          <div className="max-w-3xl mx-auto mt-8">
            {searchResults ? (
              <div className="space-y-6">
                {/* Creators Results */}
                {searchResults.creators?.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-3">Creators</h3>
                    <div className="space-y-2">
                      {searchResults.creators.map((creator: any) => (
                        <button
                          key={creator.id}
                          onClick={() => {
                            router.push(`/creator/${creator.id}`)
                            onClose()
                          }}
                          className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition text-left"
                        >
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={creator.avatar} />
                            <AvatarFallback>{creator.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-medium">{creator.name}</p>
                            <p className="text-sm text-gray-500">{creator.category}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{creator.rating}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* View All Results */}
                <button
                  onClick={() => handleSearch(searchQuery)}
                  className="w-full py-3 text-center text-purple-600 hover:bg-purple-50 rounded-lg transition"
                >
                  View all results for "{searchQuery}"
                </button>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Trending Searches */}
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
                    <TrendingUp className="h-4 w-4" />
                    <span>Trending Searches</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((search) => (
                      <Badge
                        key={search}
                        variant="secondary"
                        className="cursor-pointer hover:bg-purple-100"
                        onClick={() => handleSearch(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500 mb-3">
                      <Clock className="h-4 w-4" />
                      <span>Recent Searches</span>
                    </div>
                    <div className="space-y-1">
                      {recentSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => handleSearch(search)}
                          className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-lg transition"
                        >
                          {search}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Popular Categories */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Popular Categories</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {popularCategories.map((category) => (
                      <button
                        key={category.name}
                        onClick={() => {
                          router.push(`/category/${category.name.toLowerCase()}`)
                          onClose()
                        }}
                        className="flex flex-col items-center gap-2 p-4 hover:bg-gray-50 rounded-lg transition"
                      >
                        <category.icon className="h-6 w-6 text-purple-600" />
                        <span className="text-sm font-medium">{category.name}</span>
                        <span className="text-xs text-gray-500">{category.count} creators</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}