"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Heart,
  UserPlus,
  UserCheck,
  Bell,
  BellRing,
  Star,
  TrendingUp,
  Users,
  Eye,
  Share2,
  MessageSquare,
  Calendar,
  Zap,
  Sparkles,
  ChevronRight,
  Check
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Follow/Favorite data types
export interface SocialEngagementData {
  // Creator stats
  followers: number
  following: boolean
  favorited: boolean
  
  // Engagement metrics
  engagementRate: number
  responseRate: number
  repeatBookingRate: number
  
  // Fan interaction
  totalFans: number
  activeFans: number
  superFans: number
  
  // Notifications
  notificationsEnabled: boolean
  notificationTypes: {
    newVideos: boolean
    availability: boolean
    specialOffers: boolean
    liveEvents: boolean
  }
  
  // Recent activity
  recentFollowers?: Array<{
    id: string
    name: string
    avatar: string
    date: Date
  }>
  
  // Benefits
  followerBenefits?: string[]
  favoriteBenefits?: string[]
}

interface FollowFavoriteSystemProps {
  data: SocialEngagementData
  creatorName: string
  onFollow?: (following: boolean) => void
  onFavorite?: (favorited: boolean) => void
  onNotificationToggle?: (type: string, enabled: boolean) => void
  className?: string
  variant?: "full" | "compact" | "minimal"
}

// Follower count display with animation
function FollowerCount({ 
  count,
  isFollowing 
}: { 
  count: number
  isFollowing: boolean 
}) {
  const [displayCount, setDisplayCount] = React.useState(count)
  
  React.useEffect(() => {
    setDisplayCount(isFollowing ? count + 1 : count)
  }, [isFollowing, count])
  
  const formatCount = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }
  
  return (
    <div className="flex items-center gap-2">
      <Users className="h-4 w-4 text-gray-500" />
      <motion.span
        key={displayCount}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-semibold"
      >
        {formatCount(displayCount)}
      </motion.span>
      <span className="text-sm text-gray-500">followers</span>
    </div>
  )
}

// Follow button with animation
function FollowButton({
  isFollowing,
  onToggle,
  size = "default"
}: {
  isFollowing: boolean
  onToggle: () => void
  size?: "default" | "sm" | "lg"
}) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
    >
      <Button
        size={size}
        variant={isFollowing ? "secondary" : "default"}
        onClick={onToggle}
        className={cn(
          "relative overflow-hidden",
          isFollowing && "bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30"
        )}
      >
        <AnimatePresence mode="wait">
          {isFollowing ? (
            <motion.div
              key="following"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <UserCheck className="h-4 w-4" />
              <span>Following</span>
            </motion.div>
          ) : (
            <motion.div
              key="follow"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              <span>Follow</span>
            </motion.div>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  )
}

// Favorite button
function FavoriteButton({
  isFavorited,
  onToggle,
  size = "default"
}: {
  isFavorited: boolean
  onToggle: () => void
  size?: "default" | "sm" | "lg"
}) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            size={size}
            variant={isFavorited ? "default" : "outline"}
            onClick={onToggle}
            className={cn(
              "relative",
              isFavorited && "bg-red-500 hover:bg-red-600 text-white"
            )}
          >
            <motion.div
              animate={isFavorited ? {
                scale: [1, 1.2, 1],
                rotate: [0, 10, -10, 0]
              } : {}}
              transition={{ duration: 0.4 }}
            >
              <Heart className={cn(
                "h-4 w-4",
                isFavorited && "fill-current"
              )} />
            </motion.div>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">
            {isFavorited ? "Remove from favorites" : "Add to favorites"}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Notification settings
function NotificationSettings({
  notifications,
  onToggle
}: {
  notifications: SocialEngagementData['notificationTypes']
  onToggle: (type: string, enabled: boolean) => void
}) {
  const notificationOptions = [
    { key: 'newVideos', label: 'New Videos', icon: Calendar },
    { key: 'availability', label: 'Availability Updates', icon: Bell },
    { key: 'specialOffers', label: 'Special Offers', icon: Zap },
    { key: 'liveEvents', label: 'Live Events', icon: Eye }
  ]
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <BellRing className="h-4 w-4" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {notificationOptions.map((option) => (
          <div key={option.key} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <option.icon className="h-4 w-4 text-gray-500" />
              <Label htmlFor={option.key} className="text-sm">
                {option.label}
              </Label>
            </div>
            <Switch
              id={option.key}
              checked={notifications[option.key as keyof typeof notifications]}
              onCheckedChange={(checked) => onToggle(option.key, checked)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

// Engagement stats
function EngagementStats({
  data
}: {
  data: SocialEngagementData
}) {
  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-600">
          {data.engagementRate}%
        </div>
        <p className="text-xs text-gray-500">Engagement</p>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600">
          {data.responseRate}%
        </div>
        <p className="text-xs text-gray-500">Response</p>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-600">
          {data.repeatBookingRate}%
        </div>
        <p className="text-xs text-gray-500">Rebooking</p>
      </div>
    </div>
  )
}

// Fan tier display
function FanTiers({
  totalFans,
  activeFans,
  superFans
}: {
  totalFans: number
  activeFans: number
  superFans: number
}) {
  const tiers = [
    { label: 'Super Fans', count: superFans, color: 'bg-yellow-500', icon: Star },
    { label: 'Active Fans', count: activeFans, color: 'bg-purple-500', icon: Heart },
    { label: 'Total Fans', count: totalFans, color: 'bg-gray-500', icon: Users }
  ]
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Fan Community</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {tiers.map((tier) => (
            <div key={tier.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", tier.color)}>
                  <tier.icon className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-medium">{tier.label}</span>
              </div>
              <Badge variant="secondary">{tier.count}</Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Recent followers display
function RecentFollowers({
  followers
}: {
  followers: NonNullable<SocialEngagementData['recentFollowers']>
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Recent Followers
      </p>
      <div className="flex -space-x-2">
        {followers.slice(0, 5).map((follower) => (
          <TooltipProvider key={follower.id}>
            <Tooltip>
              <TooltipTrigger>
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-900 overflow-hidden">
                  {follower.avatar ? (
                    <img src={follower.avatar} alt={follower.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs font-medium">
                      {follower.name[0]}
                    </div>
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">{follower.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        {followers.length > 5 && (
          <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-gray-900 flex items-center justify-center">
            <span className="text-xs font-medium">+{followers.length - 5}</span>
          </div>
        )}
      </div>
    </div>
  )
}

// Benefits display
function BenefitsList({
  title,
  benefits,
  icon: Icon
}: {
  title: string
  benefits: string[]
  icon: React.ElementType
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-purple-500" />
        <p className="text-sm font-medium">{title}</p>
      </div>
      <ul className="space-y-1">
        {benefits.map((benefit, index) => (
          <li key={index} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400">
            <Check className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
            <span>{benefit}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Main follow/favorite system component
export function FollowFavoriteSystem({
  data,
  creatorName,
  onFollow,
  onFavorite,
  onNotificationToggle,
  className,
  variant = "full"
}: FollowFavoriteSystemProps) {
  const [isFollowing, setIsFollowing] = React.useState(data.following)
  const [isFavorited, setIsFavorited] = React.useState(data.favorited)
  const [notifications, setNotifications] = React.useState(data.notificationTypes)
  
  const handleFollow = () => {
    const newState = !isFollowing
    setIsFollowing(newState)
    onFollow?.(newState)
    toast.success(newState ? `Following ${creatorName}!` : `Unfollowed ${creatorName}`)
  }
  
  const handleFavorite = () => {
    const newState = !isFavorited
    setIsFavorited(newState)
    onFavorite?.(newState)
    toast.success(newState ? "Added to favorites!" : "Removed from favorites")
  }
  
  const handleNotificationToggle = (type: string, enabled: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [type]: enabled
    }))
    onNotificationToggle?.(type, enabled)
    toast.success(`Notifications ${enabled ? "enabled" : "disabled"} for ${type}`)
  }
  
  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center gap-3", className)}>
        <FollowButton
          isFollowing={isFollowing}
          onToggle={handleFollow}
          size="sm"
        />
        <FavoriteButton
          isFavorited={isFavorited}
          onToggle={handleFavorite}
          size="sm"
        />
        <FollowerCount count={data.followers} isFollowing={isFollowing} />
      </div>
    )
  }
  
  if (variant === "compact") {
    return (
      <Card className={className}>
        <CardContent className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <FollowerCount count={data.followers} isFollowing={isFollowing} />
            <div className="flex gap-2">
              <FollowButton
                isFollowing={isFollowing}
                onToggle={handleFollow}
                size="sm"
              />
              <FavoriteButton
                isFavorited={isFavorited}
                onToggle={handleFavorite}
                size="sm"
              />
            </div>
          </div>
          <EngagementStats data={data} />
        </CardContent>
      </Card>
    )
  }
  
  // Full variant (default)
  return (
    <div className={cn("space-y-6", className)}>
      {/* Main actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Connect with {creatorName}</span>
            <FollowerCount count={data.followers} isFollowing={isFollowing} />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-3">
            <FollowButton
              isFollowing={isFollowing}
              onToggle={handleFollow}
            />
            <FavoriteButton
              isFavorited={isFavorited}
              onToggle={handleFavorite}
            />
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
          
          <EngagementStats data={data} />
          
          {data.recentFollowers && data.recentFollowers.length > 0 && (
            <RecentFollowers followers={data.recentFollowers} />
          )}
        </CardContent>
      </Card>
      
      {/* Fan tiers */}
      <FanTiers
        totalFans={data.totalFans}
        activeFans={data.activeFans}
        superFans={data.superFans}
      />
      
      {/* Notification settings */}
      {isFollowing && (
        <NotificationSettings
          notifications={notifications}
          onToggle={handleNotificationToggle}
        />
      )}
      
      {/* Benefits */}
      {(data.followerBenefits || data.favoriteBenefits) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              Member Benefits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.followerBenefits && (
                <BenefitsList
                  title="Follower Benefits"
                  benefits={data.followerBenefits}
                  icon={UserCheck}
                />
              )}
              {data.favoriteBenefits && (
                <BenefitsList
                  title="Favorite Benefits"
                  benefits={data.favoriteBenefits}
                  icon={Heart}
                />
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}