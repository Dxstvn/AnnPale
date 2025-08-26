"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Star, Search, Filter, ChevronDown, Check, Globe, Clock, DollarSign } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface Creator {
  id: string
  name: string
  category: string
  avatar: string
  rating: number
  price: number
  responseTime: string
  completedVideos: number
  languages?: string[]
  isAvailable?: boolean
  isSelected?: boolean
}

interface CreatorSelectionCardProps {
  creators?: Creator[]
  onCreatorSelect?: (creator: Creator) => void
  selectedCreatorId?: string
}

export function CreatorSelectionCard({ 
  creators = defaultCreators, 
  onCreatorSelect,
  selectedCreatorId 
}: CreatorSelectionCardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState("popular")
  const [focusedCreatorId, setFocusedCreatorId] = useState<string | null>(null)

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          creator.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === "all" || creator.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const sortedCreators = [...filteredCreators].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "response":
        return parseInt(a.responseTime) - parseInt(b.responseTime)
      default: // popular
        return b.completedVideos - a.completedVideos
    }
  })

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-50 rounded-lg" aria-hidden="true">
            <Star className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <CardTitle className="text-2xl">Choose a Creator</CardTitle>
            <CardDescription className="text-base mt-1">
              Select the perfect creator for your personalized video message
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Search and Filters Section */}
        <div className="flex flex-col sm:flex-row gap-4" role="search" aria-label="Search and filter creators">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" aria-hidden="true" />
            <Input
              placeholder="Search creators by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
              aria-label="Search creators by name or category"
              type="search"
              autoComplete="off"
            />
          </div>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-44 h-11" aria-label="Filter by category">
              <Filter className="h-4 w-4 mr-2" aria-hidden="true" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="Music">Music</SelectItem>
              <SelectItem value="Comedy">Comedy</SelectItem>
              <SelectItem value="Sports">Sports</SelectItem>
              <SelectItem value="Motivation">Motivation</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full sm:w-44 h-11" aria-label="Sort creators">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="response">Fastest Response</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-600" role="status" aria-live="polite">
          Showing {sortedCreators.length} creator{sortedCreators.length !== 1 ? 's' : ''}
          {searchQuery && ` matching "${searchQuery}"`}
        </div>

        {/* Creators Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
          aria-label="Available creators"
        >
          {sortedCreators.map((creator) => {
            const isSelected = selectedCreatorId === creator.id
            const isFocused = focusedCreatorId === creator.id

            return (
              <article
                key={creator.id}
                role="listitem"
                className={cn(
                  "relative rounded-xl border-2 bg-white transition-all duration-200",
                  "hover:shadow-lg hover:-translate-y-1 cursor-pointer",
                  "focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2",
                  isSelected ? "border-purple-600 shadow-md" : "border-gray-200",
                  isFocused && "ring-2 ring-purple-500 ring-offset-2"
                )}
                onClick={() => onCreatorSelect?.(creator)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onCreatorSelect?.(creator)
                  }
                }}
                tabIndex={0}
                onFocus={() => setFocusedCreatorId(creator.id)}
                onBlur={() => setFocusedCreatorId(null)}
                aria-label={`Select ${creator.name}, ${creator.category} creator, rated ${creator.rating} stars, starting at $${creator.price}`}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 z-10">
                    <div className="bg-purple-600 text-white rounded-full p-1">
                      <Check className="h-4 w-4" aria-label="Selected" />
                    </div>
                  </div>
                )}

                <div className="p-6 flex flex-col items-center text-center space-y-4">
                  {/* Avatar */}
                  <div className="relative">
                    <Avatar className="h-24 w-24 ring-4 ring-white shadow-lg">
                      <AvatarImage src={creator.avatar} alt={`${creator.name}'s avatar`} />
                      <AvatarFallback className="text-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                        {creator.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {creator.isAvailable !== false && (
                      <div className="absolute -bottom-1 -right-1">
                        <div className="bg-green-500 h-4 w-4 rounded-full border-2 border-white" aria-label="Available" />
                      </div>
                    )}
                  </div>

                  {/* Creator Info */}
                  <div className="space-y-1">
                    <h3 className="font-semibold text-lg">{creator.name}</h3>
                    <p className="text-sm text-gray-600">{creator.category}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" aria-hidden="true" />
                      <span className="font-semibold">{creator.rating}</span>
                      <span className="sr-only">out of 5 stars</span>
                    </div>
                    <span className="text-gray-300" aria-hidden="true">•</span>
                    <span className="text-gray-600">
                      {creator.completedVideos} videos
                    </span>
                  </div>

                  {/* Pricing & Response */}
                  <div className="w-full space-y-3 pt-2 border-t">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-gray-600">
                        <DollarSign className="h-4 w-4" aria-hidden="true" />
                        Starting at
                      </span>
                      <span className="font-bold text-lg text-purple-600">${creator.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-gray-600">
                        <Clock className="h-4 w-4" aria-hidden="true" />
                        Response time
                      </span>
                      <span className="font-medium">{creator.responseTime}</span>
                    </div>
                  </div>

                  {/* Languages */}
                  {creator.languages && creator.languages.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {creator.languages.map(lang => (
                        <Badge 
                          key={lang} 
                          variant="secondary" 
                          className="text-xs flex items-center gap-1"
                        >
                          <Globe className="h-3 w-3" aria-hidden="true" />
                          {lang}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Select Button */}
                  <Button 
                    className={cn(
                      "w-full",
                      isSelected 
                        ? "bg-purple-600 hover:bg-purple-700" 
                        : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    )}
                    onClick={(e) => {
                      e.stopPropagation()
                      onCreatorSelect?.(creator)
                    }}
                    aria-pressed={isSelected}
                    aria-label={`${isSelected ? 'Selected' : 'Select'} ${creator.name} as your creator`}
                  >
                    {isSelected ? 'Selected' : 'Select Creator'}
                  </Button>
                </div>
              </article>
            )
          })}
        </div>

        {/* Empty State */}
        {sortedCreators.length === 0 && (
          <div className="text-center py-12" role="region" aria-live="polite">
            <p className="text-gray-500 mb-4">No creators found matching your criteria.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("")
                setCategoryFilter("all")
              }}
              aria-label="Clear all search filters and show all creators"
            >
              Clear filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

const defaultCreators: Creator[] = [
  {
    id: "1",
    name: "Marie Jean",
    category: "Music",
    avatar: "/placeholder.svg",
    rating: 4.9,
    price: 75,
    responseTime: "24h",
    completedVideos: 523,
    languages: ["English", "Kreyòl", "Français"],
    isAvailable: true
  },
  {
    id: "2",
    name: "Jean Baptiste",
    category: "Comedy",
    avatar: "/placeholder.svg",
    rating: 4.8,
    price: 50,
    responseTime: "48h",
    completedVideos: 342,
    languages: ["Kreyòl", "English"],
    isAvailable: true
  },
  {
    id: "3",
    name: "Claudette Pierre",
    category: "Sports",
    avatar: "/placeholder.svg",
    rating: 4.7,
    price: 60,
    responseTime: "12h",
    completedVideos: 189,
    languages: ["English", "Français"],
    isAvailable: true
  }
]