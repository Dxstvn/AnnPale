"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, Filter } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

const allCreators = [
  {
    id: 1,
    name: "Wyclef Jean",
    category: "Musician",
    price: 150,
    rating: 4.9,
    reviews: 1247,
    image: "/images/wyclef-jean.png",
    responseTime: "24hr",
    verified: true,
  },
  {
    id: 2,
    name: "Ti Jo Zenny",
    category: "Comedian",
    price: 85,
    rating: 4.8,
    reviews: 456,
    image: "/images/ti-jo-zenny.jpg",
    responseTime: "2 days",
    verified: true,
  },
  {
    id: 4,
    name: "Richard Cave",
    category: "Actor",
    price: 120,
    rating: 4.9,
    reviews: 678,
    image: "/images/richard-cave.jpg",
    responseTime: "3 days",
    verified: true,
  },
  {
    id: 5,
    name: "Michael Brun",
    category: "DJ/Producer",
    price: 200,
    rating: 4.8,
    reviews: 892,
    image: "/images/michael-brun.jpg",
    responseTime: "2 days",
    verified: true,
  },
  {
    id: 6,
    name: "Rutshelle Guillaume",
    category: "Singer",
    price: 85,
    rating: 4.9,
    reviews: 634,
    image: "/images/rutshelle-guillaume.jpg",
    responseTime: "1 day",
    verified: true,
  },
  {
    id: 7,
    name: "Kenny",
    category: "Singer",
    price: 95,
    rating: 4.6,
    reviews: 423,
    image: "/images/kenny.jpg",
    responseTime: "2 days",
    verified: true,
  },
  {
    id: 8,
    name: "Carel Pedre",
    category: "Radio Host",
    price: 110,
    rating: 4.8,
    reviews: 567,
    image: "/images/carel-pedre.jpg",
    responseTime: "1 day",
    verified: true,
  },
  {
    id: 9,
    name: "DJ K9",
    category: "DJ",
    price: 65,
    rating: 4.7,
    reviews: 234,
    image: "/images/dj-k9.jpg",
    responseTime: "24hr",
    verified: true,
  },
  {
    id: 10,
    name: "DJ Bullet",
    category: "DJ",
    price: 70,
    rating: 4.6,
    reviews: 189,
    image: "/images/dj-bullet.jpg",
    responseTime: "1 day",
    verified: true,
  },
  {
    id: 11,
    name: "J Perry",
    category: "Singer",
    price: 90,
    rating: 4.8,
    reviews: 345,
    image: "/images/jonathan-perry.jpg",
    responseTime: "2 days",
    verified: true,
  },
  {
    id: 13,
    name: "Reynaldo Martino",
    category: "Singer",
    price: 105,
    rating: 4.8,
    reviews: 312,
    image: "/images/reynaldo-martino.jpg",
    responseTime: "2 days",
    verified: true,
  },
]

export default function BrowsePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("featured")

  const filteredCreators = allCreators.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === "all" || creator.category.toLowerCase() === selectedCategory.toLowerCase()
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
      case "reviews":
        return b.reviews - a.reviews
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <span>🎤</span>
                <span>Ann Pale</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link href="/browse" className="text-purple-600 font-medium">
                  Browse
                </Link>
                <Link href="/categories" className="text-gray-600 hover:text-gray-900">
                  Categories
                </Link>
                <Link href="/how-it-works" className="text-gray-600 hover:text-gray-900">
                  How it works
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-gray-600" asChild>
                <Link href="/login">Log in</Link>
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700" asChild>
                <Link href="/signup">Sign up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Browse Creators</h1>
          <p className="text-xl text-gray-600">
            Discover amazing Haitian creators ready to make your perfect video message
          </p>
        </div>

        {/* Filters */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search creators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="musician">Musicians</SelectItem>
                <SelectItem value="singer">Singers</SelectItem>
                <SelectItem value="comedian">Comedians</SelectItem>
                <SelectItem value="actor">Actors</SelectItem>
                <SelectItem value="dj">DJs</SelectItem>
                <SelectItem value="radio host">Radio Hosts</SelectItem>
                <SelectItem value="dj/producer">DJ/Producers</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedCreators.length} of {allCreators.length} creators
          </p>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedCreators.map((creator) => (
            <Link key={creator.id} href={`/creator/${creator.id}`}>
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="relative">
                    <Image
                      src={creator.image || "/placeholder.svg"}
                      alt={creator.name}
                      width={300}
                      height={300}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    {creator.verified && <Badge className="absolute top-3 left-3 bg-blue-600">Verified</Badge>}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{creator.name}</h3>
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{creator.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{creator.category}</p>
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-gray-900">${creator.price}</div>
                      <div className="text-sm text-gray-500">{creator.responseTime}</div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{creator.reviews.toLocaleString()} reviews</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {sortedCreators.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No creators found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchTerm("")
                setSelectedCategory("all")
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
