"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Star, Heart, Gift, Menu, X } from "lucide-react"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"
import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const featuredCreators = [
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
  },
  {
    id: 2,
    name: "Ti Jo Zenny",
    category: "comedian",
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
    category: "actor",
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
    category: "djProducer",
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
    category: "singer",
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
    category: "singer",
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
    category: "radioHost",
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
    category: "dj",
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
    category: "dj",
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
    category: "singer",
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
    category: "singer",
    price: 105,
    rating: 4.8,
    reviews: 312,
    image: "/images/reynaldo-martino.jpg",
    responseTime: "2 days",
    verified: true,
  },
  {
    id: 14,
    name: "Fatima Altieri",
    category: "singer",
    price: 95,
    rating: 4.7,
    reviews: 287,
    image: "/images/fatima-altieri.jpg",
    responseTime: "1 day",
    verified: true,
  },
]

const categories = [
  { name: "musicians", count: 156, icon: "🎵" },
  { name: "actors", count: 89, icon: "🎭" },
  { name: "athletes", count: 67, icon: "⚽" },
  { name: "comedians", count: 34, icon: "😂" },
  { name: "influencers", count: 234, icon: "📱" },
  { name: "artists", count: 78, icon: "🎨" },
]

interface Creator {
  id: number
  name: string
  category: string
  price: number
  rating: number
  reviews: number
  image: string
  responseTime: string
  verified: boolean
}

interface FeaturedCreatorsCarouselProps {
  creators: Creator[]
}

function FeaturedCreatorsCarousel({ creators }: FeaturedCreatorsCarouselProps) {
  const { language } = useLanguage()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Responsive creators per slide
  const getCreatorsPerSlide = () => {
    if (typeof window !== "undefined") {
      if (window.innerWidth < 640) return 1 // mobile
      if (window.innerWidth < 1024) return 2 // tablet
      return 4 // desktop
    }
    return 4
  }

  const [creatorsPerSlide, setCreatorsPerSlide] = useState(getCreatorsPerSlide())
  const totalSlides = Math.ceil(creators.length / creatorsPerSlide)

  // Create extended array for infinite loop
  const extendedCreators = [...creators, ...creators, ...creators]
  const extendedTotalSlides = Math.ceil(extendedCreators.length / creatorsPerSlide)

  useEffect(() => {
    const handleResize = () => {
      const newCreatorsPerSlide = getCreatorsPerSlide()
      setCreatorsPerSlide(newCreatorsPerSlide)
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => prev + 1)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentSlide((prev) => prev - 1)
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false)

      // Reset to middle section for infinite loop
      if (currentSlide >= totalSlides * 2) {
        setCurrentSlide(totalSlides)
      } else if (currentSlide < totalSlides) {
        setCurrentSlide(totalSlides + currentSlide)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [currentSlide, totalSlides])

  // Initialize to middle section
  useEffect(() => {
    setCurrentSlide(totalSlides)
  }, [totalSlides])

  return (
    <div className="relative">
      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 bg-white shadow-lg hover:bg-gray-50 hidden sm:flex"
        onClick={prevSlide}
        disabled={isTransitioning}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 bg-white shadow-lg hover:bg-gray-50 hidden sm:flex"
        onClick={nextSlide}
        disabled={isTransitioning}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Carousel Content */}
      <div className="overflow-hidden">
        <div
          className={`flex ${isTransitioning ? "transition-transform duration-300 ease-in-out" : ""}`}
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {Array.from({ length: extendedTotalSlides }).map((_, slideIndex) => (
            <div key={slideIndex} className="w-full flex-shrink-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {extendedCreators
                  .slice(slideIndex * creatorsPerSlide, (slideIndex + 1) * creatorsPerSlide)
                  .map((creator, index) => (
                    <Link key={`${creator.id}-${slideIndex}-${index}`} href={`/creator/${creator.id}`}>
                      <Card className="group cursor-pointer hover:shadow-lg transition-shadow">
                        <CardContent className="p-0">
                          <div className="relative">
                            <Image
                              src={creator.image || "/placeholder.svg"}
                              alt={creator.name}
                              width={300}
                              height={300}
                              className="w-full h-64 rounded-t-lg object-cover object-top"
                            />
                            {creator.verified && (
                              <Badge className="absolute top-3 left-3 bg-blue-600">
                                {getTranslation("verified", language)}
                              </Badge>
                            )}
                          </div>
                          <div className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold text-gray-900 truncate">{creator.name}</h3>
                              <div className="flex items-center space-x-1 text-sm text-gray-500">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span>{creator.rating}</span>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              {getTranslation(
                                creator.category as keyof typeof import("@/lib/translations").translations,
                                language,
                              )}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="text-lg font-bold text-gray-900">${creator.price}</div>
                              <div className="text-sm text-gray-500">{creator.responseTime}</div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {creator.reviews.toLocaleString()} {getTranslation("reviews", language)}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              (currentSlide % totalSlides) === index ? "bg-purple-600" : "bg-gray-300"
            }`}
            onClick={() => setCurrentSlide(totalSlides + index)}
          />
        ))}
      </div>
    </div>
  )
}

export default function HomePage() {
  const { language } = useLanguage()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to browse page with search query
      window.location.href = `/browse?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4 sm:space-x-8">
              <Link
                href="/"
                className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center space-x-2 whitespace-nowrap"
              >
                <span>🎤</span>
                <span>Ann Pale</span>
              </Link>
              <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
                <Link href="/browse" className="text-gray-600 hover:text-gray-900 text-sm lg:text-base">
                  {getTranslation("browse", language)}
                </Link>
                <Link href="/categories" className="text-gray-600 hover:text-gray-900 text-sm lg:text-base">
                  {getTranslation("categories", language)}
                </Link>
                <Link
                  href="/how-it-works"
                  className="text-gray-600 hover:text-gray-900 whitespace-nowrap text-sm lg:text-base"
                >
                  {getTranslation("howItWorks", language)}
                </Link>
              </nav>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <form
                onSubmit={handleSearch}
                className="hidden lg:flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2 w-64"
              >
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={getTranslation("searchPlaceholder", language)}
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                />
              </form>
              <div className="hidden sm:flex items-center space-x-2">
                <Button variant="ghost" className="text-gray-600 text-sm" asChild>
                  <Link href="/login">{getTranslation("login", language)}</Link>
                </Button>
                <Button className="bg-purple-600 hover:bg-purple-700 text-sm" asChild>
                  <Link href="/signup">{getTranslation("signup", language)}</Link>
                </Button>
              </div>
              <LanguageToggle />
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="flex flex-col space-y-4">
                <form
                  onSubmit={handleSearch}
                  className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2"
                >
                  <Search className="h-4 w-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={getTranslation("searchPlaceholder", language)}
                    className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
                  />
                </form>
                <nav className="flex flex-col space-y-2">
                  <Link
                    href="/browse"
                    className="text-gray-600 hover:text-gray-900 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {getTranslation("browse", language)}
                  </Link>
                  <Link
                    href="/categories"
                    className="text-gray-600 hover:text-gray-900 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {getTranslation("categories", language)}
                  </Link>
                  <Link
                    href="/how-it-works"
                    className="text-gray-600 hover:text-gray-900 py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {getTranslation("howItWorks", language)}
                  </Link>
                </nav>
                <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                  <Button variant="ghost" className="text-gray-600 justify-start" asChild>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      {getTranslation("login", language)}
                    </Link>
                  </Button>
                  <Button className="bg-purple-600 hover:bg-purple-700" asChild>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      {getTranslation("signup", language)}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-12 sm:py-16 relative overflow-hidden">
        {/* Decorative Emojis */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Left side - 2 emojis */}
          <div className="absolute top-16 sm:top-20 left-4 sm:left-10 text-2xl sm:text-4xl transform rotate-12">🎵</div>
          <div className="absolute bottom-16 sm:bottom-20 left-1/4 text-3xl sm:text-5xl transform rotate-45">🎨</div>

          {/* Right side - 2 emojis */}
          <div className="absolute top-24 sm:top-32 right-8 sm:right-16 text-2xl sm:text-4xl transform -rotate-12">
            🎭
          </div>
          <div className="absolute bottom-20 sm:bottom-24 right-8 sm:right-20 text-3xl sm:text-5xl transform rotate-12">
            😂
          </div>
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-4 sm:mb-6">
            {getTranslation("heroTitle", language)}
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90 max-w-3xl mx-auto">
            {getTranslation("heroSubtitle", language)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <form
              onSubmit={handleSearch}
              className="flex items-center space-x-2 bg-white/20 rounded-full px-4 py-3 flex-1"
            >
              <Search className="h-5 w-5" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={getTranslation("searchPlaceholder", language)}
                className="border-0 bg-transparent placeholder:text-white/70 text-white focus-visible:ring-0 focus-visible:ring-offset-0 shadow-none"
              />
            </form>
            <Button type="submit" size="lg" className="bg-white text-purple-600 hover:bg-gray-100">
              {getTranslation("search", language)}
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Creators */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {getTranslation("featuredCreators", language)}
            </h2>
            <Link href="/browse" className="text-purple-600 hover:text-purple-700 font-medium text-sm sm:text-base">
              {getTranslation("viewAll", language)}
            </Link>
          </div>

          <FeaturedCreatorsCarousel creators={featuredCreators} />
        </div>
      </section>

      {/* Categories */}
      <section className="py-12 sm:py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
            {getTranslation("browseByCategory", language)}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((category) => (
              <Link key={category.name} href={`/category/${category.name.toLowerCase()}`} className="group">
                <Card className="text-center hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4 sm:p-6">
                    <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">{category.icon}</div>
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                      {getTranslation(
                        category.name as keyof typeof import("@/lib/translations").translations,
                        language,
                      )}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {category.count} {getTranslation("creatorsCount", language)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
            {getTranslation("howAnnPaleWorks", language)}
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">{getTranslation("browseAndBook", language)}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{getTranslation("browseAndBookDesc", language)}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">{getTranslation("receiveVideo", language)}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{getTranslation("receiveVideoDesc", language)}</p>
            </div>
            <div className="text-center sm:col-span-2 md:col-span-1">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-3">{getTranslation("makeSomeoneSmile", language)}</h3>
              <p className="text-gray-600 text-sm sm:text-base">{getTranslation("makeSomeoneSmileDesc", language)}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">{getTranslation("readyToStart", language)}</h2>
          <p className="text-lg sm:text-xl mb-6 sm:mb-8 opacity-90">{getTranslation("readyToStartDesc", language)}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
              <Link href="/browse">{getTranslation("browseCreators", language)}</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10 bg-transparent"
              asChild
            >
              <Link href="/signup">{getTranslation("becomeCreator", language)}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Ann Pale</h3>
              <p className="text-gray-400 text-sm sm:text-base">{getTranslation("aboutAnnPale", language)}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">{getTranslation("company", language)}</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <Link href="/about" className="hover:text-white">
                    {getTranslation("about", language)}
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-white">
                    {getTranslation("careers", language)}
                  </Link>
                </li>
                <li>
                  <Link href="/press" className="hover:text-white">
                    {getTranslation("press", language)}
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="hover:text-white">
                    {getTranslation("blog", language)}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">{getTranslation("support", language)}</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <Link href="/help" className="hover:text-white">
                    {getTranslation("helpCenter", language)}
                  </Link>
                </li>
                <li>
                  <Link href="/safety" className="hover:text-white">
                    {getTranslation("safety", language)}
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="hover:text-white">
                    {getTranslation("communityGuidelines", language)}
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-white">
                    {getTranslation("contact", language)}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-sm sm:text-base">{getTranslation("legal", language)}</h4>
              <ul className="space-y-2 text-gray-400 text-sm sm:text-base">
                <li>
                  <Link href="/terms" className="hover:text-white">
                    {getTranslation("termsOfService", language)}
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="hover:text-white">
                    {getTranslation("privacyPolicy", language)}
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="hover:text-white">
                    {getTranslation("cookiePolicy", language)}
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm sm:text-base">
            <p>&copy; 2024 Ann Pale. {getTranslation("allRightsReserved", language)}.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
