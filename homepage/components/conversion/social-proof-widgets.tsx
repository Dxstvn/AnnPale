"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Users,
  Star,
  TrendingUp,
  Eye,
  Clock,
  MapPin,
  CheckCircle,
  Heart,
  MessageSquare,
  Calendar,
  Award,
  Sparkles,
  Zap,
  Globe,
  Activity
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { formatDistanceToNow } from "date-fns"

// Social proof data types
export interface RecentActivity {
  id: string
  type: "booking" | "review" | "follow" | "video" | "message"
  user: {
    name: string
    avatar?: string
    location?: string
  }
  message: string
  timestamp: Date
  rating?: number
}

export interface LiveStats {
  viewersNow: number
  bookingsToday: number
  responseTime: string
  satisfactionRate: number
  completionRate: number
  repeatRate: number
}

export interface PopularityIndicator {
  rank?: number
  category: string
  trending: boolean
  growth: number // percentage
  demandLevel: "low" | "medium" | "high" | "very_high"
}

export interface SocialProofData {
  recentActivity: RecentActivity[]
  liveStats: LiveStats
  popularity: PopularityIndicator
  testimonials?: Array<{
    text: string
    author: string
    rating: number
  }>
  achievements?: Array<{
    icon: React.ElementType
    label: string
    value: string
  }>
}

interface SocialProofWidgetsProps {
  data: SocialProofData
  className?: string
  showActivity?: boolean
  showStats?: boolean
  showPopularity?: boolean
  variant?: "floating" | "inline" | "compact"
}

// Activity type configurations
const activityConfig = {
  booking: {
    icon: Calendar,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/30"
  },
  review: {
    icon: Star,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/30"
  },
  follow: {
    icon: Heart,
    color: "text-pink-600",
    bgColor: "bg-pink-100 dark:bg-pink-900/30"
  },
  video: {
    icon: MessageSquare,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/30"
  },
  message: {
    icon: MessageSquare,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/30"
  }
}

// Recent activity feed
function RecentActivityFeed({
  activities,
  compact = false
}: {
  activities: RecentActivity[]
  compact?: boolean
}) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  
  // Rotate through activities
  React.useEffect(() => {
    if (activities.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activities.length)
    }, 4000)
    
    return () => clearInterval(interval)
  }, [activities.length])
  
  const currentActivity = activities[currentIndex]
  const config = activityConfig[currentActivity.type]
  const Icon = config.icon
  
  if (compact) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentActivity.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center gap-2 text-sm"
        >
          <div className={cn("h-6 w-6 rounded-full flex items-center justify-center", config.bgColor)}>
            <Icon className={cn("h-3 w-3", config.color)} />
          </div>
          <span className="text-gray-600 dark:text-gray-400">
            {currentActivity.message}
          </span>
          <span className="text-xs text-gray-400">
            {formatDistanceToNow(currentActivity.timestamp, { addSuffix: true })}
          </span>
        </motion.div>
      </AnimatePresence>
    )
  }
  
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Activity className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium">Recent Activity</span>
        <Badge variant="secondary" className="text-xs">
          Live
          <span className="ml-1 h-2 w-2 bg-green-500 rounded-full animate-pulse" />
        </Badge>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentActivity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          {currentActivity.user.avatar ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentActivity.user.avatar} />
              <AvatarFallback>{currentActivity.user.name[0]}</AvatarFallback>
            </Avatar>
          ) : (
            <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", config.bgColor)}>
              <Icon className={cn("h-4 w-4", config.color)} />
            </div>
          )}
          
          <div className="flex-1">
            <p className="text-sm">
              <span className="font-medium">{currentActivity.user.name}</span>
              {currentActivity.user.location && (
                <span className="text-gray-500"> from {currentActivity.user.location}</span>
              )}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {currentActivity.message}
            </p>
            {currentActivity.rating && (
              <div className="flex gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3 w-3",
                      i < currentActivity.rating!
                        ? "text-yellow-500 fill-current"
                        : "text-gray-300"
                    )}
                  />
                ))}
              </div>
            )}
            <p className="text-xs text-gray-400 mt-1">
              {formatDistanceToNow(currentActivity.timestamp, { addSuffix: true })}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {/* Activity dots indicator */}
      <div className="flex justify-center gap-1">
        {activities.map((_, index) => (
          <div
            key={index}
            className={cn(
              "h-1.5 w-1.5 rounded-full transition-all",
              index === currentIndex
                ? "w-4 bg-purple-600"
                : "bg-gray-300 dark:bg-gray-600"
            )}
          />
        ))}
      </div>
    </div>
  )
}

// Live statistics display
function LiveStatsDisplay({
  stats,
  compact = false
}: {
  stats: LiveStats
  compact?: boolean
}) {
  if (compact) {
    return (
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3 text-gray-500" />
          <span className="font-medium">{stats.viewersNow}</span>
          <span className="text-gray-500">viewing</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-gray-500" />
          <span className="font-medium">{stats.bookingsToday}</span>
          <span className="text-gray-500">today</span>
        </div>
      </div>
    )
  }
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-500">Live Viewers</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">{stats.viewersNow}</span>
              <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-500">Bookings Today</span>
            </div>
            <div className="text-2xl font-bold text-green-600">
              {stats.bookingsToday}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-500">Response Time</span>
            </div>
            <div className="text-lg font-semibold">
              {stats.responseTime}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 text-gray-500" />
              <span className="text-xs text-gray-500">Satisfaction</span>
            </div>
            <div className="text-lg font-semibold text-yellow-600">
              {stats.satisfactionRate}%
            </div>
          </div>
        </div>
        
        {/* Progress bars */}
        <div className="mt-4 space-y-2">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Completion Rate</span>
              <span className="font-medium">{stats.completionRate}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.completionRate}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="h-full bg-green-500"
              />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Repeat Customers</span>
              <span className="font-medium">{stats.repeatRate}%</span>
            </div>
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.repeatRate}%` }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className="h-full bg-purple-500"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Popularity indicator
function PopularityWidget({
  popularity,
  compact = false
}: {
  popularity: PopularityIndicator
  compact?: boolean
}) {
  const demandColors = {
    low: "text-gray-600",
    medium: "text-blue-600",
    high: "text-orange-600",
    very_high: "text-red-600"
  }
  
  const demandLabels = {
    low: "Low Demand",
    medium: "Medium Demand",
    high: "High Demand",
    very_high: "🔥 Very High Demand"
  }
  
  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {popularity.trending && (
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs">
            <TrendingUp className="h-3 w-3 mr-0.5" />
            Trending
          </Badge>
        )}
        {popularity.rank && popularity.rank <= 10 && (
          <Badge variant="secondary" className="text-xs">
            #{popularity.rank} in {popularity.category}
          </Badge>
        )}
        <span className={cn("text-xs font-medium", demandColors[popularity.demandLevel])}>
          {demandLabels[popularity.demandLevel]}
        </span>
      </div>
    )
  }
  
  return (
    <Card className="overflow-hidden">
      {popularity.trending && (
        <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 text-xs font-medium text-center">
          🔥 TRENDING NOW
        </div>
      )}
      <CardContent className="p-4 space-y-3">
        {popularity.rank && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <span className="font-medium">Rank #{popularity.rank}</span>
            </div>
            <Badge variant="outline">{popularity.category}</Badge>
          </div>
        )}
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Popularity Growth</span>
            <span className={cn(
              "font-medium",
              popularity.growth > 0 ? "text-green-600" : "text-red-600"
            )}>
              {popularity.growth > 0 ? "+" : ""}{popularity.growth}%
              {popularity.growth > 0 ? (
                <TrendingUp className="inline h-3 w-3 ml-1" />
              ) : (
                <TrendingUp className="inline h-3 w-3 ml-1 rotate-180" />
              )}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Current Demand</span>
            <span className={cn("font-medium", demandColors[popularity.demandLevel])}>
              {demandLabels[popularity.demandLevel]}
            </span>
          </div>
        </div>
        
        {popularity.demandLevel === "very_high" && (
          <div className="p-2 bg-orange-50 dark:bg-orange-900/20 rounded text-xs text-center text-orange-700 dark:text-orange-300">
            ⚡ Book soon - High demand expected
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Floating social proof notifications
function FloatingNotifications({
  activities
}: {
  activities: RecentActivity[]
}) {
  const [currentActivity, setCurrentActivity] = React.useState<RecentActivity | null>(null)
  const [isVisible, setIsVisible] = React.useState(false)
  
  React.useEffect(() => {
    if (activities.length === 0) return
    
    const showNotification = () => {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)]
      setCurrentActivity(randomActivity)
      setIsVisible(true)
      
      setTimeout(() => {
        setIsVisible(false)
      }, 5000)
    }
    
    // Show first notification after 3 seconds
    const firstTimer = setTimeout(showNotification, 3000)
    
    // Then show every 15-30 seconds
    const interval = setInterval(() => {
      showNotification()
    }, Math.random() * 15000 + 15000)
    
    return () => {
      clearTimeout(firstTimer)
      clearInterval(interval)
    }
  }, [activities])
  
  if (!currentActivity) return null
  
  const config = activityConfig[currentActivity.type]
  const Icon = config.icon
  
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: -400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -400, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-20 left-4 z-40 max-w-sm"
        >
          <Card className="shadow-lg border-purple-200 dark:border-purple-800">
            <CardContent className="p-3">
              <div className="flex items-start gap-3">
                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0", config.bgColor)}>
                  <Icon className={cn("h-4 w-4", config.color)} />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{currentActivity.user.name}</span>
                    {currentActivity.user.location && (
                      <span className="text-gray-500"> from {currentActivity.user.location}</span>
                    )}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {currentActivity.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDistanceToNow(currentActivity.timestamp, { addSuffix: true })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Main social proof widgets component
export function SocialProofWidgets({
  data,
  className,
  showActivity = true,
  showStats = true,
  showPopularity = true,
  variant = "inline"
}: SocialProofWidgetsProps) {
  if (variant === "floating") {
    return <FloatingNotifications activities={data.recentActivity} />
  }
  
  if (variant === "compact") {
    return (
      <div className={cn("space-y-3", className)}>
        {showActivity && data.recentActivity.length > 0 && (
          <RecentActivityFeed activities={data.recentActivity} compact />
        )}
        {showStats && (
          <LiveStatsDisplay stats={data.liveStats} compact />
        )}
        {showPopularity && (
          <PopularityWidget popularity={data.popularity} compact />
        )}
      </div>
    )
  }
  
  // Default inline variant
  return (
    <div className={cn("space-y-4", className)}>
      {showActivity && data.recentActivity.length > 0 && (
        <RecentActivityFeed activities={data.recentActivity} />
      )}
      {showStats && (
        <LiveStatsDisplay stats={data.liveStats} />
      )}
      {showPopularity && (
        <PopularityWidget popularity={data.popularity} />
      )}
      
      {/* Achievements */}
      {data.achievements && data.achievements.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-medium">Achievements</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {data.achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <achievement.icon className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-xs text-gray-500">{achievement.label}</p>
                    <p className="text-sm font-medium">{achievement.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}