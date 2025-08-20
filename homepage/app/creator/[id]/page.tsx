"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { 
  Star, 
  Heart, 
  Clock, 
  MessageCircle, 
  Play, 
  Shield,
  Share2,
  CheckCircle,
  Calendar,
  Globe,
  DollarSign,
  TrendingUp,
  Award,
  Users,
  Video,
  ThumbsUp,
  MapPin,
  Music,
  Sparkles,
  Gift,
  Zap,
  ChevronRight,
  ChevronDown,
  ExternalLink,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  MoreHorizontal
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"
import CreatorHeroSection from "@/components/creator/creator-hero-section"
import CreatorVideoGallery from "@/components/creator/creator-video-gallery"
import CreatorReviews from "@/components/creator/creator-reviews"
import CreatorBookingWidget from "@/components/creator/creator-booking-widget"
import CreatorSocialProof from "@/components/creator/creator-social-proof"
import CreatorPricingTiers from "@/components/creator/creator-pricing-tiers"
import CreatorAvailability from "@/components/creator/creator-availability"
import CreatorSimilar from "@/components/creator/creator-similar"
import CreatorVideoGrid from "@/components/creator/creator-video-grid"
import CreatorBookingPackages from "@/components/creator/creator-booking-packages"
import CreatorBookingSidebar from "@/components/creator/creator-booking-sidebar"

const creatorsData = {
  "1": {
    id: 1,
    name: "Wyclef Jean",
    category: "Musician",
    tagline: "Grammy Award Winner • Former Fugees Member",
    price: 150,
    rating: 4.9,
    totalReviews: 1247,
    image: "/images/wyclef-jean.png",
    coverImage: "/placeholder.jpg",
    responseTime: "24hr",
    verified: true,
    featured: true,
    trending: true,
    bio: "Grammy-winning musician, producer, and humanitarian. Former member of the Fugees and solo artist with hits like 'Hips Don't Lie' and 'Gone Till November'. Proud Haitian-American artist bringing joy through personalized messages.",
    extendedBio: {
      career: "Over 30 years in the music industry with multiple Grammy wins and nominations. Collaborated with artists like Shakira, Carlos Santana, and many more.",
      personal: "Passionate about Haiti and education. Founded Yéle Haiti to provide aid and support to the Haitian community.",
      message: "I love connecting with fans through Ann Pale! Every message is special to me."
    },
    stats: {
      completedVideos: 1247,
      responseTime: "24hr",
      onTimeDelivery: 98,
      repeatCustomers: 34,
      avgRating: 4.9,
      totalEarned: "$186,500"
    },
    languages: [
      { code: "en", name: "English", flag: "🇺🇸" },
      { code: "ht", name: "Kreyòl", flag: "🇭🇹" },
      { code: "fr", name: "Français", flag: "🇫🇷" }
    ],
    specialties: [
      { name: "Birthday wishes", icon: "🎂", popular: true },
      { name: "Congratulations", icon: "🎉", popular: true },
      { name: "Motivational messages", icon: "💪" },
      { name: "Music dedications", icon: "🎵" },
      { name: "Cultural celebrations", icon: "🇭🇹" },
      { name: "Wedding messages", icon: "💍" }
    ],
    pricingTiers: [
      {
        id: "standard",
        name: "Standard Message",
        price: 150,
        features: ["Up to 90 seconds", "Delivered in 7 days", "Basic personalization"],
        popular: false
      },
      {
        id: "express",
        name: "Express Delivery",
        price: 225,
        features: ["Up to 90 seconds", "Delivered in 24 hours", "Priority queue"],
        popular: true
      },
      {
        id: "premium",
        name: "Premium Experience",
        price: 350,
        features: ["Up to 3 minutes", "Delivered in 24 hours", "Song performance included", "Behind-the-scenes content"],
        popular: false
      }
    ],
    availability: {
      nextAvailable: "Today",
      calendar: {
        today: true,
        tomorrow: true,
        thisWeek: true
      },
      bookingSlots: 15
    },
    socialMedia: {
      instagram: "@wyclefjean",
      twitter: "@wyclef",
      facebook: "wyclefjean",
      youtube: "wyclefjeanVEVO"
    },
    badges: [
      { name: "Grammy Winner", icon: "🏆", color: "gold" },
      { name: "Top Creator", icon: "⭐", color: "purple" },
      { name: "Fast Responder", icon: "⚡", color: "blue" },
      { name: "Haitian Pride", icon: "🇭🇹", color: "red" }
    ],
    sampleVideos: [
      { 
        id: 1, 
        title: "Birthday Message for Marie", 
        thumbnail: "/placeholder.svg?height=200&width=300",
        duration: "1:23",
        views: 15234,
        category: "Birthday"
      },
      { 
        id: 2, 
        title: "Graduation Congratulations", 
        thumbnail: "/placeholder.svg?height=200&width=300",
        duration: "1:45",
        views: 8921,
        category: "Congratulations"
      },
      {
        id: 3,
        title: "Anniversary Song",
        thumbnail: "/placeholder.svg?height=200&width=300",
        duration: "2:10",
        views: 12456,
        category: "Anniversary"
      },
      {
        id: 4,
        title: "Motivational Monday",
        thumbnail: "/placeholder.svg?height=200&width=300",
        duration: "1:30",
        views: 6789,
        category: "Motivation"
      }
    ],
    reviews: [
      {
        id: 1,
        user: "Marie L.",
        avatar: "/placeholder-user.jpg",
        rating: 5,
        comment: "Wyclef made my daughter's birthday so special! He sang happy birthday in Creole and even added a personal touch by mentioning her favorite song. Worth every penny!",
        date: "2 days ago",
        verified: true,
        helpful: 45,
        videoThumbnail: "/placeholder.svg?height=100&width=150"
      },
      {
        id: 2,
        user: "Jean P.",
        avatar: "/placeholder-user.jpg",
        rating: 5,
        comment: "Amazing video for my graduation! Very personal and heartfelt. The whole family was moved to tears. Mèsi anpil!",
        date: "1 week ago",
        verified: true,
        helpful: 32
      },
      {
        id: 3,
        user: "Sarah D.",
        avatar: "/placeholder-user.jpg",
        rating: 5,
        comment: "Wyclef went above and beyond! Not only did he deliver the message quickly, but he also included a mini performance. My husband was speechless!",
        date: "2 weeks ago",
        verified: true,
        helpful: 28
      }
    ],
    similarCreators: [
      { id: 2, name: "Michael Brun", category: "DJ/Producer", price: 200, rating: 4.8 },
      { id: 6, name: "Rutshelle Guillaume", category: "Singer", price: 85, rating: 4.9 },
      { id: 13, name: "J Perry", category: "Singer", price: 90, rating: 4.8 }
    ]
  }
}

export default function CreatorProfilePage() {
  const params = useParams()
  const { language } = useLanguage()
  const creatorId = params.id as string
  const creator = creatorsData[creatorId as keyof typeof creatorsData] || creatorsData["1"]
  
  const [isLiked, setIsLiked] = React.useState(false)
  const [expandedBio, setExpandedBio] = React.useState(false)
  const [selectedTier, setSelectedTier] = React.useState("express")

  if (!creator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {getTranslation("creatorNotFound", language)}
          </h1>
          <Button asChild>
            <Link href="/browse">{getTranslation("browseCreators", language)}</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Decorative Cultural Emojis */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-10 text-6xl opacity-5"
        >
          🎵
        </motion.div>
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-40 right-20 text-7xl opacity-5"
        >
          🎭
        </motion.div>
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-32 left-20 text-8xl opacity-5"
        >
          🎨
        </motion.div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute bottom-20 right-16 text-6xl opacity-5"
        >
          🌺
        </motion.div>
      </div>

      {/* Hero Section with Cover Image */}
      <div className="relative h-96 bg-gradient-to-r from-purple-600 to-pink-600 overflow-hidden">
        {creator.coverImage && (
          <Image
            src={creator.coverImage}
            alt={`${creator.name} cover`}
            fill
            className="object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        
        {/* Navigation Bar */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <Link href="/" className="text-2xl font-bold text-white flex items-center gap-2">
                <span>🎤</span>
                <span>Ann Pale</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/browse" className="text-white/90 hover:text-white">
                  {getTranslation("browse", language)}
                </Link>
                <Link href="/categories" className="text-white/90 hover:text-white">
                  {getTranslation("categories", language)}
                </Link>
              </nav>
            </div>
          </div>
        </div>

        {/* Creator Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex items-end gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                  <Image
                    src={creator.image || "/placeholder.svg"}
                    alt={creator.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                </div>
                {creator.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full p-2">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-4xl font-bold">{creator.name}</h1>
                  {creator.badges.map((badge, index) => (
                    <span key={index} className="text-2xl" title={badge.name}>
                      {badge.icon}
                    </span>
                  ))}
                </div>
                <p className="text-xl opacity-90 mb-2">{creator.tagline}</p>
                <div className="flex items-center gap-4">
                  <Badge className="bg-white/20 text-white border-white/30">
                    {creator.category}
                  </Badge>
                  {creator.featured && (
                    <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                      <Star className="h-3 w-3 mr-1" />
                      Featured
                    </Badge>
                  )}
                  {creator.trending && (
                    <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      Trending
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-white/10 backdrop-blur hover:bg-white/20"
                  onClick={() => setIsLiked(!isLiked)}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-white/10 backdrop-blur hover:bg-white/20"
                >
                  <Share2 className="h-5 w-5 text-white" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="bg-white/10 backdrop-blur hover:bg-white/20"
                >
                  <MoreHorizontal className="h-5 w-5 text-white" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Bar */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {creator.stats.completedVideos.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Videos</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {creator.rating}
                    </div>
                    <div className="text-sm text-gray-600">Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {creator.stats.onTimeDelivery}%
                    </div>
                    <div className="text-sm text-gray-600">On Time</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">
                      {creator.stats.repeatCustomers}%
                    </div>
                    <div className="text-sm text-gray-600">Repeat</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bio Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  About {creator.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">{creator.bio}</p>
                
                <AnimatePresence>
                  {expandedBio && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Career Highlights</h4>
                        <p className="text-gray-700">{creator.extendedBio.career}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Personal Touch</h4>
                        <p className="text-gray-700">{creator.extendedBio.personal}</p>
                      </div>
                      <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-purple-900 italic">"{creator.extendedBio.message}"</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <Button
                  variant="ghost"
                  onClick={() => setExpandedBio(!expandedBio)}
                  className="mt-4"
                >
                  {expandedBio ? (
                    <>Show Less <ChevronDown className="ml-2 h-4 w-4 rotate-180" /></>
                  ) : (
                    <>Read More <ChevronDown className="ml-2 h-4 w-4" /></>
                  )}
                </Button>

                <Separator className="my-6" />

                {/* Languages & Specialties */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Globe className="h-4 w-4 text-purple-600" />
                      Languages
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {creator.languages.map((lang) => (
                        <Badge key={lang.code} variant="secondary" className="px-3 py-1">
                          <span className="mr-1">{lang.flag}</span>
                          {lang.name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-purple-600" />
                      Specialties
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {creator.specialties.map((specialty) => (
                        <Badge 
                          key={specialty.name} 
                          variant={specialty.popular ? "default" : "outline"}
                          className={specialty.popular ? "bg-purple-600" : ""}
                        >
                          <span className="mr-1">{specialty.icon}</span>
                          {specialty.name}
                          {specialty.popular && <Zap className="ml-1 h-3 w-3" />}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-semibold text-gray-900 mb-3">Follow on Social Media</h4>
                  <div className="flex gap-3">
                    {creator.socialMedia.instagram && (
                      <Button size="sm" variant="outline">
                        <Instagram className="h-4 w-4 mr-2" />
                        Instagram
                      </Button>
                    )}
                    {creator.socialMedia.twitter && (
                      <Button size="sm" variant="outline">
                        <Twitter className="h-4 w-4 mr-2" />
                        Twitter
                      </Button>
                    )}
                    {creator.socialMedia.youtube && (
                      <Button size="sm" variant="outline">
                        <Youtube className="h-4 w-4 mr-2" />
                        YouTube
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Video Gallery */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <CreatorVideoGrid 
                videos={creator.sampleVideos.map(v => ({
                  ...v,
                  rating: 4.8 + Math.random() * 0.2,
                  featured: Math.random() > 0.7
                }))}
                creatorName={creator.name}
              />
            </div>

            {/* Reviews Section */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-purple-600" />
                    Reviews
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="font-semibold">{creator.rating}</span>
                    <span className="text-gray-500">({creator.totalReviews} reviews)</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {creator.reviews.map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                          {review.user.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{review.user}</span>
                            {review.verified && (
                              <Badge variant="secondary" className="text-xs">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex">
                              {[...Array(review.rating)].map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500">{review.date}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-3">{review.comment}</p>
                    {review.videoThumbnail && (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <Image
                          src={review.videoThumbnail}
                          alt="Review video"
                          width={60}
                          height={40}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-600">Video attached</span>
                      </div>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-purple-600">
                        <ThumbsUp className="h-4 w-4" />
                        Helpful ({review.helpful})
                      </button>
                    </div>
                  </div>
                ))}
                
                <Button variant="outline" className="w-full mt-4">
                  View All Reviews
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Booking Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-20 h-fit">
            {/* Simplified Booking Widget */}
            <CreatorBookingSidebar
              creatorId={creator.id}
              creatorName={creator.name}
              basePrice={creator.price}
              responseTime={creator.responseTime}
              completedVideos={creator.stats.completedVideos}
              rating={creator.rating}
              nextAvailable={creator.availability.nextAvailable}
              bookingSlots={creator.availability.bookingSlots}
            />

            {/* Similar Creators */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Similar Creators</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {creator.similarCreators.map((similar) => (
                  <Link
                    key={similar.id}
                    href={`/creator/${similar.id}`}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
                  >
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-semibold">
                      {similar.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{similar.name}</p>
                      <p className="text-xs text-gray-500">{similar.category} • ${similar.price}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs">{similar.rating}</span>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full-width Booking Packages Section */}
        <div className="mt-12" id="packages">
          <Card className="overflow-hidden border-2 border-purple-200">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-200">
              <CardTitle className="text-2xl flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-purple-600" />
                Choose Your Video Package
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Select the perfect package for your personalized video message from {creator.name}
              </p>
            </CardHeader>
            <CardContent className="p-8">
              <CreatorBookingPackages 
                creatorId={creator.id}
                creatorName={creator.name}
                basePrice={creator.price}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}