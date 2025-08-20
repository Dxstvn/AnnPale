"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  Video,
  Phone,
  Radio,
  Calendar,
  Clock,
  Star,
  Heart,
  TrendingUp,
  ArrowRight,
  Bell,
  Play,
  Users,
  MessageSquare,
  Package,
  Sparkles,
  ChevronRight,
  DollarSign,
  Activity,
  Zap,
  Gift,
  Trophy,
  Flame,
  Search,
  Filter,
  Music,
  Mic,
  Smile,
  Award
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { cn } from "@/lib/utils"
import { Globe } from "lucide-react"

export default function CustomerDashboard() {
  const { language } = useLanguage()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("popular")

  // Mock data for upcoming events
  const upcomingEvents = [
    {
      id: 1,
      type: "call",
      title: "Video Call with Marie Jean",
      time: "Today, 2:00 PM",
      duration: "10 minutes",
      price: "$150",
      avatar: "/placeholder.svg",
      status: "confirmed"
    },
    {
      id: 2,
      type: "livestream",
      title: "Live Music Session",
      creator: "Jean Baptiste",
      time: "Today, 8:00 PM",
      viewers: 245,
      avatar: "/placeholder.svg",
      status: "upcoming"
    },
    {
      id: 3,
      type: "video",
      title: "Birthday Message",
      creator: "Claudette Pierre",
      time: "Tomorrow",
      status: "processing",
      avatar: "/placeholder.svg"
    }
  ]

  // Mock favorite creators
  const favoriteCreators = [
    {
      id: 1,
      name: "Marie Jean",
      category: "Music",
      avatar: "/placeholder.svg",
      isOnline: true,
      rating: 4.9,
      responseTime: "24h"
    },
    {
      id: 2,
      name: "Jean Baptiste",
      category: "Comedy",
      avatar: "/placeholder.svg",
      isOnline: false,
      rating: 4.8,
      responseTime: "48h"
    },
    {
      id: 3,
      name: "Claudette Pierre",
      category: "Sports",
      avatar: "/placeholder.svg",
      isOnline: true,
      rating: 4.7,
      responseTime: "12h"
    },
    {
      id: 4,
      name: "Michel Louis",
      category: "Chef",
      avatar: "/placeholder.svg",
      isOnline: false,
      rating: 4.9,
      responseTime: "36h"
    }
  ]

  // Mock discover creators data
  const discoverCreators = [
    {
      id: 5,
      name: "Rose Charles",
      category: "Singer",
      avatar: "/placeholder.svg",
      rating: 4.8,
      price: 85,
      responseTime: "24h",
      trending: true,
      languages: ["English", "Kreyòl"],
      specialties: ["Love songs", "Birthday wishes"]
    },
    {
      id: 6,
      name: "Patrick Jean",
      category: "Motivational Speaker",
      avatar: "/placeholder.svg",
      rating: 4.9,
      price: 120,
      responseTime: "48h",
      trending: true,
      languages: ["English", "Français", "Kreyòl"],
      specialties: ["Life coaching", "Success mindset"]
    },
    {
      id: 7,
      name: "Sandra Pierre",
      category: "Dancer",
      avatar: "/placeholder.svg",
      rating: 4.7,
      price: 65,
      responseTime: "12h",
      trending: false,
      languages: ["English"],
      specialties: ["Dance tutorials", "Celebrations"]
    },
    {
      id: 8,
      name: "Alex Toussaint",
      category: "Chef",
      avatar: "/placeholder.svg",
      rating: 4.9,
      price: 95,
      responseTime: "36h",
      trending: true,
      languages: ["Français", "Kreyòl"],
      specialties: ["Cooking tips", "Recipe videos"]
    }
  ]

  const categories = [
    { name: "Music", icon: Music, count: 45, color: "from-purple-600 to-pink-600" },
    { name: "Comedy", icon: Smile, count: 32, color: "from-pink-600 to-rose-600" },
    { name: "Sports", icon: Trophy, count: 28, color: "from-green-600 to-emerald-600" },
    { name: "Motivation", icon: Award, count: 19, color: "from-orange-600 to-amber-600" }
  ]

  // Mock activity data
  const recentActivity = [
    {
      id: 1,
      action: "Booked video message",
      creator: "Marie Jean",
      time: "2 hours ago",
      icon: Video,
      color: "text-purple-600"
    },
    {
      id: 2,
      action: "Scheduled video call",
      creator: "Jean Baptiste",
      time: "5 hours ago",
      icon: Phone,
      color: "text-green-600"
    },
    {
      id: 3,
      action: "Watched livestream",
      creator: "Claudette Pierre",
      time: "Yesterday",
      icon: Radio,
      color: "text-pink-600"
    },
    {
      id: 4,
      action: "Received video message",
      creator: "Michel Louis",
      time: "2 days ago",
      icon: Gift,
      color: "text-orange-600"
    }
  ]

  const stats = [
    {
      label: "Total Bookings",
      value: "24",
      change: "+12%",
      icon: Video,
      color: "from-purple-600 to-pink-600"
    },
    {
      label: "Video Calls",
      value: "8",
      change: "+25%",
      icon: Phone,
      color: "from-green-600 to-emerald-600"
    },
    {
      label: "Livestreams Watched",
      value: "156",
      change: "+8%",
      icon: Radio,
      color: "from-pink-600 to-rose-600"
    },
    {
      label: "Total Spent",
      value: "$1,245",
      change: "+18%",
      icon: DollarSign,
      color: "from-orange-600 to-amber-600"
    }
  ]

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center flex-wrap gap-2">
              Welcome back, {user?.name || "Customer"}!
              <Sparkles className="h-5 sm:h-6 w-5 sm:w-6" />
            </h1>
            <p className="text-white/90 mt-2 text-sm sm:text-base">
              You have 3 upcoming events today. Don't miss your video call at 2:00 PM!
            </p>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button className="bg-white text-purple-600 hover:bg-gray-100 text-sm sm:text-base">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              <Badge className="ml-2 bg-purple-600 text-white">8</Badge>
            </Button>
            <Button variant="outline" className="text-white border-white hover:bg-white/10 text-sm sm:text-base">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Browse Creators Section - Primary Focus */}
      <Card className="border-2 border-purple-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div className="flex-1">
              <CardTitle className="flex items-center flex-wrap gap-2 text-xl sm:text-2xl">
                <Sparkles className="h-5 sm:h-6 w-5 sm:w-6 text-purple-600" />
                Discover Amazing Creators
              </CardTitle>
              <CardDescription className="text-sm sm:text-base mt-1">
                Book personalized videos, calls, and experiences from your favorite Haitian celebrities
              </CardDescription>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="border-purple-300 hover:bg-purple-50 flex-1 sm:flex-initial">
                <Filter className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Filters</span>
                <span className="sm:hidden">Filter</span>
              </Button>
              <Button variant="default" size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white flex-1 sm:flex-initial" asChild>
                <Link href="/browse">
                  View All
                  <ArrowRight className="h-4 w-4 ml-1 sm:ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Search Bar with Live Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-purple-500" />
            <Input
              placeholder="Search creators by name, category, or specialty..."
              className="pl-10 pr-32 h-12 text-base border-2 focus:border-purple-400 transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
              <Badge variant="secondary" className="cursor-pointer hover:bg-purple-100">
                <Music className="h-3 w-3 mr-1" />
                Music
              </Badge>
              <Badge variant="secondary" className="cursor-pointer hover:bg-pink-100">
                <Smile className="h-3 w-3 mr-1" />
                Comedy
              </Badge>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-2 px-2 sm:mx-0 sm:px-0">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              className={cn(
                "flex-shrink-0 transition-all text-xs sm:text-sm",
                selectedCategory === "all" 
                  ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white" 
                  : "hover:shadow-md hover:border-purple-400"
              )}
              onClick={() => setSelectedCategory("all")}
            >
              <Sparkles className="h-3 sm:h-4 w-3 sm:w-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">All Categories</span>
              <span className="sm:hidden">All</span>
            </Button>
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name.toLowerCase() ? "default" : "outline"}
                size="sm"
                className={cn(
                  "flex-shrink-0 transition-all group text-xs sm:text-sm",
                  selectedCategory === category.name.toLowerCase()
                    ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    : "hover:shadow-md hover:border-purple-400"
                )}
                onClick={() => setSelectedCategory(category.name.toLowerCase())}
              >
                <div className={cn("p-0.5 sm:p-1 rounded bg-gradient-to-r mr-1 sm:mr-2", category.color)}>
                  <category.icon className="h-3 w-3 text-white" />
                </div>
                <span className="hidden sm:inline">{category.name}</span>
                <span className="sm:hidden">{category.name.slice(0, 3)}</span>
                <Badge variant="secondary" className="ml-1 sm:ml-2 group-hover:bg-purple-100 text-xs">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs sm:text-sm text-gray-600">Sort:</span>
              <div className="flex gap-1 sm:gap-2 flex-wrap">
                <Badge 
                  className={cn(
                    "cursor-pointer",
                    sortBy === "popular" ? "bg-purple-100 text-purple-700 hover:bg-purple-200" : "hover:bg-purple-50"
                  )}
                  variant={sortBy === "popular" ? "default" : "outline"}
                  onClick={() => setSortBy("popular")}
                >
                  Popular
                </Badge>
                <Badge 
                  variant={sortBy === "price" ? "default" : "outline"} 
                  className={cn(
                    "cursor-pointer",
                    sortBy === "price" ? "bg-purple-100 text-purple-700 hover:bg-purple-200" : "hover:bg-purple-50"
                  )}
                  onClick={() => setSortBy("price")}
                >
                  Price: Low to High
                </Badge>
                <Badge 
                  variant={sortBy === "rating" ? "default" : "outline"} 
                  className={cn(
                    "cursor-pointer",
                    sortBy === "rating" ? "bg-purple-100 text-purple-700 hover:bg-purple-200" : "hover:bg-purple-50"
                  )}
                  onClick={() => setSortBy("rating")}
                >
                  Rating
                </Badge>
                <Badge 
                  variant={sortBy === "response" ? "default" : "outline"} 
                  className={cn(
                    "cursor-pointer",
                    sortBy === "response" ? "bg-purple-100 text-purple-700 hover:bg-purple-200" : "hover:bg-purple-50"
                  )}
                  onClick={() => setSortBy("response")}
                >
                  Response Time
                </Badge>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm">
              <Flame className="h-3 sm:h-4 w-3 sm:w-4 text-orange-500" />
              <span className="text-gray-600">248 creators online</span>
            </div>
          </div>

          {/* Featured Creator Spotlight */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 sm:p-6 text-white">
            <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6">
              <Avatar className="h-20 sm:h-24 w-20 sm:w-24 border-4 border-white shadow-xl">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                  <Trophy className="h-4 sm:h-5 w-4 sm:w-5 text-yellow-300" />
                  <span className="text-xs sm:text-sm font-medium text-yellow-300">Featured Creator of the Week</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-1">Marie-Claire Laurent</h3>
                <p className="text-white/90 mb-3 text-sm sm:text-base">Award-winning singer with 500+ happy customers</p>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 sm:h-4 w-3 sm:w-4 text-yellow-300 fill-current" />
                    <span className="font-semibold">4.9</span>
                    <span className="text-white/80">(523)</span>
                  </div>
                  <span className="text-white/60 hidden sm:inline">•</span>
                  <span className="text-white/90">From $75</span>
                  <span className="text-white/60 hidden sm:inline">•</span>
                  <span className="text-white/90">2hr response</span>
                </div>
              </div>
              <div className="flex flex-row sm:flex-col gap-2 w-full sm:w-auto">
                <Button className="bg-white text-purple-600 hover:bg-gray-100 flex-1 sm:flex-initial text-sm sm:text-base">
                  <Video className="h-4 w-4 mr-2" />
                  Book Video
                </Button>
                <Button variant="outline" className="text-white border-white hover:bg-white/10 flex-1 sm:flex-initial text-sm sm:text-base">
                  View Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Enhanced Creators Grid */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Popular Creators
              </h4>
              <Button variant="ghost" size="sm" className="text-purple-600 hover:bg-purple-50">
                Show More
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[...discoverCreators, ...favoriteCreators.slice(0, 4)].slice(0, 8).map((creator, index) => (
                <Link
                  key={`creator-${index}`}
                  href={`/creator/${creator.id}`}
                  className="group"
                >
                  <Card className="hover:shadow-2xl transition-all duration-300 hover:translate-y-[-4px] cursor-pointer h-full border-2 hover:border-purple-300">
                    <CardContent className="p-3 sm:p-4">
                      {/* Online Indicator & Trending Badge */}
                      <div className="relative mb-3">
                        <Avatar className="h-16 sm:h-20 w-16 sm:w-20 mx-auto ring-2 sm:ring-4 ring-purple-100 group-hover:ring-purple-300 transition-all">
                          <AvatarImage src={creator.avatar} />
                          <AvatarFallback className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                            {creator.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        {'isOnline' in creator && creator.isOnline && (
                          <div className="absolute bottom-1 right-1/2 translate-x-10">
                            <div className="h-5 w-5 bg-green-500 rounded-full border-3 border-white shadow-md" />
                          </div>
                        )}
                        {'trending' in creator && creator.trending && (
                          <Badge className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
                            <Flame className="h-3 w-3 mr-1" />
                            Hot
                          </Badge>
                        )}
                      </div>
                      
                      {/* Creator Info */}
                      <h4 className="font-semibold text-center text-sm sm:text-base group-hover:text-purple-600 transition-colors line-clamp-1">
                        {creator.name}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-600 text-center mb-2">{creator.category}</p>
                      
                      {/* Stats Row */}
                      <div className="flex items-center justify-center gap-1 sm:gap-3 mb-2 sm:mb-3 text-xs sm:text-sm">
                        <div className="flex items-center gap-0.5 sm:gap-1">
                          <Star className="h-3 w-3 text-yellow-500 fill-current" />
                          <span className="font-medium">{creator.rating}</span>
                        </div>
                        {'price' in creator && (
                          <>
                            <span className="text-gray-300 hidden sm:inline">•</span>
                            <span className="font-bold text-purple-600">${creator.price || 75}</span>
                          </>
                        )}
                        <span className="text-gray-300 hidden sm:inline">•</span>
                        <span className="text-gray-600 hidden sm:inline">{creator.responseTime}</span>
                      </div>

                      {/* Specialties Tags - Hidden on mobile */}
                      {'specialties' in creator && (
                        <div className="hidden sm:flex flex-wrap gap-1 justify-center mb-3">
                          {creator.specialties.slice(0, 2).map((specialty, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Languages - Hidden on mobile */}
                      {'languages' in creator && (
                        <div className="hidden sm:flex items-center justify-center gap-1 mb-3">
                          <Globe className="h-3 w-3 text-gray-500" />
                          <span className="text-xs text-gray-600">
                            {creator.languages.join(', ')}
                          </span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                        <Button 
                          size="sm"
                          variant="outline"
                          className="hover:bg-purple-50 hover:border-purple-400 text-xs sm:text-sm hidden sm:flex"
                          onClick={(e) => {
                            e.preventDefault()
                            // Handle quick book
                          }}
                        >
                          <Video className="h-3 w-3 mr-0.5 sm:mr-1" />
                          Video
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg text-xs sm:text-sm sm:col-span-1 col-span-1"
                        >
                          <MessageSquare className="h-3 w-3 mr-0.5 sm:mr-1" />
                          Book
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Load More Button */}
          <div className="text-center pt-4">
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-purple-300 hover:bg-purple-50 hover:border-purple-400"
            >
              <Users className="h-5 w-5 mr-2" />
              Load More Creators
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Events */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-purple-600" />
                      Upcoming Events
                    </span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="/fan/bookings">
                        View All
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                    >
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={event.avatar} />
                        <AvatarFallback>{event.creator?.[0] || event.title[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h4 className="font-medium">{event.title}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </span>
                          {event.duration && (
                            <span>{event.duration}</span>
                          )}
                          {event.viewers && (
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {event.viewers} viewers
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {event.type === "call" && (
                          <Badge className="bg-green-100 text-green-700">
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Badge>
                        )}
                        {event.type === "livestream" && (
                          <Badge className="bg-pink-100 text-pink-700">
                            <Radio className="h-3 w-3 mr-1" />
                            Live
                          </Badge>
                        )}
                        {event.type === "video" && (
                          <Badge className="bg-purple-100 text-purple-700">
                            <Video className="h-3 w-3 mr-1" />
                            Video
                          </Badge>
                        )}
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                          {event.type === "call" ? "Join" : event.type === "livestream" ? "Watch" : "View"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/fan/calls">
                      <Phone className="h-4 w-4 mr-2" />
                      Book Video Call
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/browse">
                      <Video className="h-4 w-4 mr-2" />
                      Request Video Message
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/fan/livestreams">
                      <Radio className="h-4 w-4 mr-2" />
                      Browse Live Streams
                    </Link>
                  </Button>
                  <Button className="w-full justify-start" variant="outline" asChild>
                    <Link href="/fan/favorites">
                      <Heart className="h-4 w-4 mr-2" />
                      View Favorites
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Rewards */}
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-purple-600" />
                    Loyalty Rewards
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Points Balance</span>
                        <span className="font-bold text-purple-600">1,245</span>
                      </div>
                      <Progress value={62} className="h-2" />
                      <p className="text-xs text-gray-600 mt-1">
                        755 points to Gold status
                      </p>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white" size="sm">
                      <Gift className="h-4 w-4 mr-2" />
                      Redeem Rewards
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Favorite Creators */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-600" />
                  Favorite Creators
                </span>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/fan/favorites">
                    View All
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {favoriteCreators.map((creator) => (
                  <Link
                    key={creator.id}
                    href={`/creator/${creator.id}`}
                    className="group"
                  >
                    <Card className="hover:shadow-lg transition-all hover:translate-y-[-2px] cursor-pointer">
                      <CardContent className="p-4">
                        <div className="relative">
                          <Avatar className="h-16 w-16 mx-auto">
                            <AvatarImage src={creator.avatar} />
                            <AvatarFallback>{creator.name[0]}</AvatarFallback>
                          </Avatar>
                          {creator.isOnline && (
                            <div className="absolute bottom-0 right-1/2 translate-x-8 translate-y-0">
                              <div className="h-4 w-4 bg-green-500 rounded-full border-2 border-white" />
                            </div>
                          )}
                        </div>
                        <h4 className="font-medium text-center mt-3 group-hover:text-purple-600 transition-colors">
                          {creator.name}
                        </h4>
                        <p className="text-sm text-gray-600 text-center">{creator.category}</p>
                        <div className="flex items-center justify-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs">{creator.rating}</span>
                          </div>
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-600">{creator.responseTime}</span>
                        </div>
                        <Button 
                          className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white" 
                          size="sm"
                        >
                          Book Now
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

        </TabsContent>

        {/* Upcoming Tab */}
        <TabsContent value="upcoming" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Upcoming Events</CardTitle>
              <CardDescription>Your scheduled calls, bookings, and livestreams</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...upcomingEvents, ...upcomingEvents].map((event, index) => (
                  <div
                    key={`${event.id}-${index}`}
                    className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                  >
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={event.avatar} />
                      <AvatarFallback>{event.creator?.[0] || event.title[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium">{event.title}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {event.time}
                        </span>
                        {event.duration && (
                          <span>{event.duration}</span>
                        )}
                        {event.price && (
                          <span className="font-semibold text-green-600">{event.price}</span>
                        )}
                      </div>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      Details
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activity Tab */}
        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent interactions and bookings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className={cn(
                      "p-2 rounded-lg",
                      activity.color === "text-purple-600" && "bg-purple-100",
                      activity.color === "text-green-600" && "bg-green-100",
                      activity.color === "text-pink-600" && "bg-pink-100",
                      activity.color === "text-orange-600" && "bg-orange-100"
                    )}>
                      <activity.icon className={cn("h-5 w-5", activity.color)} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-gray-600">with {activity.creator}</p>
                    </div>
                    <span className="text-sm text-gray-500">{activity.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}