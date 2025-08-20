"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { 
  Play,
  Users,
  Clock,
  Heart,
  Star,
  TrendingUp,
  Filter,
  Search,
  Bell,
  Calendar,
  Globe,
  Music,
  MessageSquare,
  BookOpen,
  Camera,
  PartyPopper,
  Coffee,
  Dumbbell,
  ChefHat,
  Gamepad2,
  Newspaper,
  ArrowRight,
  ChevronRight,
  ChevronLeft,
  X,
  Check,
  Sparkles,
  Flame,
  Zap,
  Eye,
  Share2,
  MoreVertical,
  Volume2,
  VolumeX,
  Pause,
  RefreshCw,
  AlertCircle,
  Info,
  Video,
  Radio,
  Wifi,
  WifiOff,
  Languages,
  UserCheck,
  Shield,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  TrendingDown,
  Award,
  Medal,
  Trophy,
  Crown,
  Gem,
  Rocket,
  Lightning,
  Timer,
  Mic,
  Headphones,
  Monitor,
  Smartphone,
  Tv,
  ArrowUp,
  ArrowDown,
  Hash,
  AtSign,
  Flag,
  MapPin,
  Sun,
  Moon,
  Cloud
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Stream categories with icons and colors
const streamCategories = [
  { id: "all", name: "All Streams", icon: <Sparkles className="w-4 h-4" />, color: "bg-gradient-to-r from-purple-500 to-pink-500" },
  { id: "music-performance", name: "Music", icon: <Music className="w-4 h-4" />, color: "bg-purple-500" },
  { id: "qa-session", name: "Q&A", icon: <MessageSquare className="w-4 h-4" />, color: "bg-blue-500" },
  { id: "behind-scenes", name: "Behind Scenes", icon: <Camera className="w-4 h-4" />, color: "bg-green-500" },
  { id: "tutorial", name: "Tutorials", icon: <BookOpen className="w-4 h-4" />, color: "bg-yellow-500" },
  { id: "special-event", name: "Events", icon: <PartyPopper className="w-4 h-4" />, color: "bg-pink-500" },
  { id: "casual-chat", name: "Chat", icon: <Coffee className="w-4 h-4" />, color: "bg-orange-500" },
  { id: "workout", name: "Workout", icon: <Dumbbell className="w-4 h-4" />, color: "bg-red-500" },
  { id: "cooking", name: "Cooking", icon: <ChefHat className="w-4 h-4" />, color: "bg-amber-500" },
  { id: "gaming", name: "Gaming", icon: <Gamepad2 className="w-4 h-4" />, color: "bg-indigo-500" },
  { id: "news", name: "News", icon: <Newspaper className="w-4 h-4" />, color: "bg-gray-500" }
]

// Sorting options
const sortOptions = [
  { id: "trending", name: "Trending", icon: <TrendingUp className="w-4 h-4" />, description: "Hot content" },
  { id: "most-viewers", name: "Most Viewers", icon: <Users className="w-4 h-4" />, description: "Popular now" },
  { id: "recently-started", name: "Just Started", icon: <Clock className="w-4 h-4" />, description: "Fresh streams" },
  { id: "category", name: "By Category", icon: <Filter className="w-4 h-4" />, description: "Grouped by type" },
  { id: "language", name: "By Language", icon: <Languages className="w-4 h-4" />, description: "Your language" },
  { id: "following", name: "Following", icon: <Heart className="w-4 h-4" />, description: "Your creators" }
]

// Language options
const languages = [
  { id: "all", name: "All Languages", flag: "🌍" },
  { id: "en", name: "English", flag: "🇺🇸" },
  { id: "fr", name: "Français", flag: "🇫🇷" },
  { id: "ht", name: "Kreyòl", flag: "🇭🇹" },
  { id: "es", name: "Español", flag: "🇪🇸" },
  { id: "pt", name: "Português", flag: "🇧🇷" }
]

// Mock live streams data - fixed values to prevent hydration issues
const generateMockStreams = (count: number) => {
  const creators = [
    { name: "Marie Joseph", avatar: "👩🏾", verified: true },
    { name: "Jean Baptiste", avatar: "👨🏾", verified: true },
    { name: "Rose Michel", avatar: "👩🏽", verified: false },
    { name: "Pierre Louis", avatar: "👨🏿", verified: true },
    { name: "Sophia Laurent", avatar: "👩🏾", verified: false },
    { name: "Marcus Jean", avatar: "👨🏽", verified: true }
  ]

  const titles = [
    "Live Music from Port-au-Prince",
    "Cooking Traditional Haitian Food",
    "Q&A: Life as a Creator",
    "Behind the Scenes of My New Video",
    "Morning Workout Session",
    "Gaming Night with Fans",
    "Learn Kreyòl - Lesson 5",
    "Special Announcement Stream",
    "Casual Friday Chat",
    "Breaking News Discussion"
  ]

  // Fixed viewer counts for consistent hydration
  const fixedViewerCounts = [2400, 1850, 3200, 950, 4100, 750, 2800, 1200, 3600, 680, 1950, 890, 2150, 1600, 3800, 520, 2950, 1400, 2650, 1100, 3400, 800, 1750, 990]
  const fixedPeakCounts = [3200, 2400, 4100, 1200, 5200, 950, 3600, 1500, 4500, 850, 2600, 1100, 2800, 2100, 4900, 680, 3800, 1800, 3400, 1450, 4200, 1000, 2300, 1200]
  const fixedDurations = [45, 30, 75, 15, 90, 20, 60, 25, 105, 10, 50, 35, 80, 40, 120, 5, 65, 55, 85, 70, 95, 12, 38, 28]
  const fixedEngagement = [85, 92, 78, 95, 67, 88, 73, 90, 82, 94, 76, 89, 71, 93, 84, 96, 79, 87, 69, 91, 75, 86, 83, 92]
  const fixedTrending = [78, 85, 92, 68, 95, 73, 88, 80, 91, 76, 89, 82, 87, 94, 71, 96, 83, 79, 90, 77, 93, 81, 86, 74]

  // Fixed scheduled times (base time + fixed offset in hours)
  const baseTime = new Date("2025-08-15T20:00:00.000Z")
  const fixedScheduleOffsets = [2, 4, 6, 8, 12, 18, 24, 30, 36, 48] // hours

  return Array.from({ length: count }, (_, i) => {
    const creator = creators[i % creators.length]
    const categoryIndex = i % (streamCategories.length - 1) + 1
    const isLive = i < count * 0.7
    const viewerCount = fixedViewerCounts[i % fixedViewerCounts.length]
    
    return {
      id: `stream-${i}`,
      title: titles[i % titles.length],
      description: "Join me for an amazing live experience filled with entertainment and interaction!",
      creatorName: creator.name,
      creatorAvatar: creator.avatar,
      creatorVerified: creator.verified,
      thumbnail: `/api/placeholder/400/225`,
      category: streamCategories[categoryIndex].id,
      categoryName: streamCategories[categoryIndex].name,
      status: isLive ? "live" : "upcoming",
      viewerCount: isLive ? viewerCount : 0,
      peakViewerCount: fixedPeakCounts[i % fixedPeakCounts.length],
      duration: isLive ? fixedDurations[i % fixedDurations.length] : 0,
      scheduledTime: !isLive ? new Date(baseTime.getTime() + fixedScheduleOffsets[i % fixedScheduleOffsets.length] * 60 * 60 * 1000) : null,
      language: languages[(i % 3) + 1].id, // Fixed pattern instead of random
      tags: ["entertainment", "interactive", "fun"],
      quality: ["hd", "4k", "sd"][i % 3], // Fixed pattern instead of random
      isFollowed: i % 5 === 0, // Fixed pattern instead of random
      isFeatured: i === 0,
      hasChat: true,
      isPremium: i % 7 === 0, // Fixed pattern instead of random
      engagementRate: fixedEngagement[i % fixedEngagement.length],
      trendingScore: fixedTrending[i % fixedTrending.length]
    }
  })
}

// Discovery algorithm implementation
const calculateDiscoveryScore = (stream: any, weights: any, personalization: any) => {
  let score = 0
  
  // Current viewer count (30%)
  const viewerScore = Math.min(stream.viewerCount / 5000, 1) * weights.viewerCount
  score += viewerScore * 100
  
  // Engagement rate (25%)
  const engagementScore = (stream.engagementRate / 100) * weights.engagement
  score += engagementScore * 100
  
  // Creator reputation (20%)
  const reputationScore = stream.creatorVerified ? weights.reputation : weights.reputation * 0.5
  score += reputationScore * 100
  
  // Stream quality (15%)
  const qualityMultiplier = stream.quality === "4k" ? 1 : stream.quality === "hd" ? 0.8 : 0.6
  score += qualityMultiplier * weights.quality * 100
  
  // Newness bonus (10%)
  const newnessScore = stream.duration < 30 ? weights.newness : weights.newness * 0.5
  score += newnessScore * 100
  
  // Personalization boost
  if (personalization.followedCreators?.includes(stream.creatorName)) {
    score *= 1.5
  }
  if (personalization.preferredCategories?.includes(stream.category)) {
    score *= 1.2
  }
  if (personalization.preferredLanguage === stream.language) {
    score *= 1.1
  }
  
  // Trending boost
  score += stream.trendingScore * 0.5
  
  return Math.round(score)
}

export function LiveStreamDiscovery() {
  const [streams, setStreams] = useState(generateMockStreams(24))
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSort, setSelectedSort] = useState("trending")
  const [selectedLanguage, setSelectedLanguage] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [showFilters, setShowFilters] = useState(false)
  const [activeTab, setActiveTab] = useState("live")
  
  // Filter states
  const [filters, setFilters] = useState({
    followedOnly: false,
    premiumOnly: false,
    freeOnly: false,
    minViewers: 0,
    maxViewers: 10000,
    quality: ["sd", "hd", "4k"],
    hasChat: false
  })

  // Personalization data (mock)
  const personalization = {
    followedCreators: ["Marie Joseph", "Jean Baptiste"],
    preferredCategories: ["music-performance", "cooking"],
    preferredLanguage: "ht",
    viewingHistory: [],
    timeZone: "America/New_York"
  }

  // Algorithm weights
  const algorithmWeights = {
    viewerCount: 0.30,
    engagement: 0.25,
    reputation: 0.20,
    quality: 0.15,
    newness: 0.10
  }

  // Filter and sort streams
  const filteredStreams = useMemo(() => {
    let filtered = [...streams]
    
    // Status filter
    if (activeTab === "live") {
      filtered = filtered.filter(s => s.status === "live")
    } else if (activeTab === "upcoming") {
      filtered = filtered.filter(s => s.status === "upcoming")
    } else if (activeTab === "following") {
      filtered = filtered.filter(s => s.isFollowed)
    }
    
    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(s => s.category === selectedCategory)
    }
    
    // Language filter
    if (selectedLanguage !== "all") {
      filtered = filtered.filter(s => s.language === selectedLanguage)
    }
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }
    
    // Advanced filters
    if (filters.followedOnly) {
      filtered = filtered.filter(s => s.isFollowed)
    }
    if (filters.premiumOnly) {
      filtered = filtered.filter(s => s.isPremium)
    }
    if (filters.freeOnly) {
      filtered = filtered.filter(s => !s.isPremium)
    }
    if (filters.hasChat) {
      filtered = filtered.filter(s => s.hasChat)
    }
    filtered = filtered.filter(s => 
      s.viewerCount >= filters.minViewers && 
      s.viewerCount <= filters.maxViewers
    )
    
    // Calculate discovery scores
    filtered = filtered.map(stream => ({
      ...stream,
      discoveryScore: calculateDiscoveryScore(stream, algorithmWeights, personalization)
    }))
    
    // Sort
    switch (selectedSort) {
      case "trending":
        filtered.sort((a, b) => b.discoveryScore - a.discoveryScore)
        break
      case "most-viewers":
        filtered.sort((a, b) => b.viewerCount - a.viewerCount)
        break
      case "recently-started":
        filtered.sort((a, b) => a.duration - b.duration)
        break
      case "category":
        filtered.sort((a, b) => a.category.localeCompare(b.category))
        break
      case "language":
        filtered.sort((a, b) => a.language.localeCompare(b.language))
        break
      case "following":
        filtered = filtered.filter(s => s.isFollowed)
        filtered.sort((a, b) => b.viewerCount - a.viewerCount)
        break
    }
    
    return filtered
  }, [streams, selectedCategory, selectedLanguage, searchQuery, selectedSort, filters, activeTab])

  // Featured stream (highest discovery score)
  const featuredStream = filteredStreams.find(s => s.isFeatured) || filteredStreams[0]

  // Format numbers
  const formatViewerCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`
    return count.toString()
  }

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) return `${hours}h ${mins}m`
    return `${mins}m`
  }

  const formatScheduledTime = (date: Date) => {
    const now = new Date()
    const diff = date.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 24) {
      return `in ${Math.floor(hours / 24)} days`
    } else if (hours > 0) {
      return `in ${hours}h ${minutes}m`
    } else {
      return `in ${minutes}m`
    }
  }

  // Auto-refresh for live data - using predictable changes to avoid hydration issues
  useEffect(() => {
    const interval = setInterval(() => {
      setStreams(prevStreams => 
        prevStreams.map((stream, index) => ({
          ...stream,
          viewerCount: stream.status === "live" 
            ? Math.max(50, stream.viewerCount + (index % 2 === 0 ? 5 : -3)) // Predictable pattern
            : stream.viewerCount,
          duration: stream.status === "live" 
            ? stream.duration + 1
            : stream.duration
        }))
      )
    }, 30000) // Update every 30 seconds
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Discover Live Streams
          </h1>
          <p className="text-muted-foreground mt-1">
            Find amazing content from Haitian creators streaming right now
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="flex gap-2 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search streams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(showFilters && "bg-purple-100 dark:bg-purple-900/30")}
          >
            <Filter className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? <BarChart3 className="w-4 h-4" /> : <PieChart className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full lg:w-[400px]">
          <TabsTrigger value="live">
            <Radio className="w-4 h-4 mr-2" />
            Live Now
          </TabsTrigger>
          <TabsTrigger value="upcoming">
            <Calendar className="w-4 h-4 mr-2" />
            Upcoming
          </TabsTrigger>
          <TabsTrigger value="following">
            <Heart className="w-4 h-4 mr-2" />
            Following
          </TabsTrigger>
        </TabsList>

        {/* Category Filter Pills */}
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-2 py-4">
            {streamCategories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={cn(
                  "flex items-center gap-2",
                  selectedCategory === category.id && category.color
                )}
              >
                {category.icon}
                {category.name}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* Sort and Language Options */}
        <div className="flex flex-wrap gap-4">
          <Select value={selectedSort} onValueChange={setSelectedSort}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.id} value={option.id}>
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <div>
                      <div className="font-medium">{option.name}</div>
                      <div className="text-xs text-muted-foreground">{option.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Language..." />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.id} value={lang.id}>
                  <div className="flex items-center gap-2">
                    <span>{lang.flag}</span>
                    <span>{lang.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="w-4 h-4" />
            <span>{filteredStreams.length} streams found</span>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <Card className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Viewer Range</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={filters.minViewers}
                        onChange={(e) => setFilters({...filters, minViewers: parseInt(e.target.value)})}
                        className="w-24"
                        placeholder="Min"
                      />
                      <span>-</span>
                      <Input
                        type="number"
                        value={filters.maxViewers}
                        onChange={(e) => setFilters({...filters, maxViewers: parseInt(e.target.value)})}
                        className="w-24"
                        placeholder="Max"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Stream Quality</Label>
                    <div className="flex gap-2">
                      {["sd", "hd", "4k"].map((quality) => (
                        <Button
                          key={quality}
                          variant={filters.quality.includes(quality) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const newQuality = filters.quality.includes(quality)
                              ? filters.quality.filter(q => q !== quality)
                              : [...filters.quality, quality]
                            setFilters({...filters, quality: newQuality})
                          }}
                        >
                          {quality.toUpperCase()}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="followed">Followed Only</Label>
                      <Switch
                        id="followed"
                        checked={filters.followedOnly}
                        onCheckedChange={(checked) => setFilters({...filters, followedOnly: checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="premium">Premium Only</Label>
                      <Switch
                        id="premium"
                        checked={filters.premiumOnly}
                        onCheckedChange={(checked) => setFilters({...filters, premiumOnly: checked, freeOnly: false})}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label htmlFor="free">Free Only</Label>
                      <Switch
                        id="free"
                        checked={filters.freeOnly}
                        onCheckedChange={(checked) => setFilters({...filters, freeOnly: checked, premiumOnly: false})}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilters({
                      followedOnly: false,
                      premiumOnly: false,
                      freeOnly: false,
                      minViewers: 0,
                      maxViewers: 10000,
                      quality: ["sd", "hd", "4k"],
                      hasChat: false
                    })}
                  >
                    Reset Filters
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Featured Stream Hero */}
        {featuredStream && activeTab === "live" && (
          <Card className="relative overflow-hidden bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <CardContent className="p-0">
              <div className="flex flex-col lg:flex-row">
                {/* Stream Preview */}
                <div className="relative lg:w-2/3 h-[300px] lg:h-[400px] bg-black">
                  <img
                    src={featuredStream.thumbnail}
                    alt={featuredStream.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  
                  {/* Live Badge */}
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white animate-pulse">
                    <Radio className="w-3 h-3 mr-1" />
                    LIVE
                  </Badge>
                  
                  {/* Stream Stats */}
                  <div className="absolute bottom-4 left-4 text-white space-y-2">
                    <h2 className="text-2xl font-bold">{featuredStream.title}</h2>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8 border-2 border-white">
                          <AvatarFallback>{featuredStream.creatorAvatar}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{featuredStream.creatorName}</span>
                        {featuredStream.creatorVerified && (
                          <CheckCircle2 className="w-4 h-4 text-blue-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {formatViewerCount(featuredStream.viewerCount)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDuration(featuredStream.duration)}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Featured Info */}
                <div className="lg:w-1/3 p-6 flex flex-col justify-between">
                  <div>
                    <Badge className="mb-3" variant="secondary">
                      <Trophy className="w-3 h-3 mr-1" />
                      Featured Stream
                    </Badge>
                    <p className="text-sm text-muted-foreground mb-4">
                      {featuredStream.description}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Badge variant="outline">
                          {streamCategories.find(c => c.id === featuredStream.category)?.name}
                        </Badge>
                        <Badge variant="outline">{featuredStream.quality.toUpperCase()}</Badge>
                        {featuredStream.isPremium && (
                          <Badge variant="outline" className="text-yellow-600">
                            <Crown className="w-3 h-3 mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      <Play className="w-4 h-4 mr-2" />
                      Watch Now
                    </Button>
                    <Button variant="outline" size="icon">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Tabs */}
        <TabsContent value="live" className="space-y-4">
          {/* Currently Live Grid */}
          <div className={cn(
            "grid gap-4",
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1"
          )}>
            {filteredStreams.filter(s => s.status === "live" && !s.isFeatured).map((stream, index) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                  <div className="relative aspect-video">
                    <img
                      src={stream.thumbnail}
                      alt={stream.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Live Indicator */}
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                      LIVE
                    </Badge>
                    
                    {/* Quality Badge */}
                    <Badge className="absolute top-2 right-2 bg-black/50 text-white text-xs">
                      {stream.quality.toUpperCase()}
                    </Badge>
                    
                    {/* Viewer Count */}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs bg-black/50 px-2 py-1 rounded">
                      <Users className="w-3 h-3" />
                      {formatViewerCount(stream.viewerCount)}
                    </div>
                    
                    {/* Duration */}
                    <div className="absolute bottom-2 right-2 text-white text-xs bg-black/50 px-2 py-1 rounded">
                      {formatDuration(stream.duration)}
                    </div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" className="bg-white/90 hover:bg-white text-black rounded-full">
                        <Play className="w-6 h-6" />
                      </Button>
                    </div>
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-1 mb-2">{stream.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">{stream.creatorAvatar}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{stream.creatorName}</span>
                        {stream.creatorVerified && (
                          <CheckCircle2 className="w-3 h-3 text-blue-500" />
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {streamCategories.find(c => c.id === stream.category)?.name}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredStreams.filter(s => s.status === "live").length === 0 && (
            <Card className="p-12 text-center">
              <WifiOff className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Live Streams</h3>
              <p className="text-muted-foreground">
                Check back later or browse upcoming streams
              </p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="upcoming" className="space-y-4">
          {/* Upcoming Streams Timeline */}
          <div className="space-y-4">
            {filteredStreams.filter(s => s.status === "upcoming").map((stream, index) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="relative w-40 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={stream.thumbnail}
                          alt={stream.title}
                          className="w-full h-full object-cover"
                        />
                        <Badge className="absolute top-2 left-2 bg-purple-500 text-white text-xs">
                          Upcoming
                        </Badge>
                      </div>
                      
                      {/* Stream Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="font-semibold line-clamp-1">{stream.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Avatar className="w-5 h-5">
                                <AvatarFallback className="text-xs">{stream.creatorAvatar}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-muted-foreground">{stream.creatorName}</span>
                              {stream.creatorVerified && (
                                <CheckCircle2 className="w-3 h-3 text-blue-500" />
                              )}
                            </div>
                          </div>
                          <Badge variant="outline">
                            {streamCategories.find(c => c.id === stream.category)?.name}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {stream.scheduledTime && formatScheduledTime(stream.scheduledTime)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Languages className="w-4 h-4" />
                              {languages.find(l => l.id === stream.language)?.name}
                            </div>
                          </div>
                          
                          <Button size="sm" variant="outline">
                            <Bell className="w-4 h-4 mr-2" />
                            Set Reminder
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            {filteredStreams.filter(s => s.status === "upcoming").length === 0 && (
              <Card className="p-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Upcoming Streams</h3>
                <p className="text-muted-foreground">
                  No streams scheduled at this time
                </p>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="following" className="space-y-4">
          {/* Following Streams */}
          <div className={cn(
            "grid gap-4",
            viewMode === "grid" 
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}>
            {filteredStreams.filter(s => s.isFollowed).map((stream, index) => (
              <motion.div
                key={stream.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="relative aspect-video">
                    <img
                      src={stream.thumbnail}
                      alt={stream.title}
                      className="w-full h-full object-cover"
                    />
                    {stream.status === "live" ? (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs">
                        LIVE
                      </Badge>
                    ) : (
                      <Badge className="absolute top-2 left-2 bg-purple-500 text-white text-xs">
                        UPCOMING
                      </Badge>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-semibold line-clamp-1 mb-2">{stream.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarFallback className="text-xs">{stream.creatorAvatar}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">{stream.creatorName}</span>
                        {stream.creatorVerified && (
                          <CheckCircle2 className="w-3 h-3 text-blue-500" />
                        )}
                      </div>
                      {stream.status === "live" ? (
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users className="w-3 h-3" />
                          {formatViewerCount(stream.viewerCount)}
                        </div>
                      ) : (
                        <div className="text-xs text-muted-foreground">
                          {stream.scheduledTime && formatScheduledTime(stream.scheduledTime)}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
            
            {filteredStreams.filter(s => s.isFollowed).length === 0 && (
              <Card className="col-span-full p-12 text-center">
                <Heart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Followed Creators Live</h3>
                <p className="text-muted-foreground mb-4">
                  Follow creators to see their streams here
                </p>
                <Button>
                  Discover Creators
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Discovery Algorithm Info */}
      <Card className="bg-gradient-to-r from-purple-500/10 to-pink-500/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Smart Discovery Algorithm</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Our AI-powered discovery engine personalizes your stream recommendations based on:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                {[
                  { label: "Viewer Count", value: "30%", icon: <Users className="w-4 h-4" /> },
                  { label: "Engagement", value: "25%", icon: <Heart className="w-4 h-4" /> },
                  { label: "Creator Score", value: "20%", icon: <Star className="w-4 h-4" /> },
                  { label: "Stream Quality", value: "15%", icon: <Tv className="w-4 h-4" /> },
                  { label: "Fresh Content", value: "10%", icon: <Sparkles className="w-4 h-4" /> }
                ].map((factor, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded flex items-center justify-center">
                      {factor.icon}
                    </div>
                    <div>
                      <div className="font-medium">{factor.label}</div>
                      <div className="text-xs text-muted-foreground">{factor.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Checkbox component for filters
function CheckCircle2({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  )
}