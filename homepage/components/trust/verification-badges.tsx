"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  CheckCircle,
  BadgeCheck,
  Trophy,
  Shield,
  Star,
  Award,
  Zap,
  Crown,
  Gem,
  Medal,
  Heart,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Verification levels and their properties
export type VerificationLevel = "identity" | "platform" | "celebrity" | "elite"

export interface VerificationBadgeProps {
  level: VerificationLevel
  size?: "xs" | "sm" | "md" | "lg"
  showLabel?: boolean
  animated?: boolean
  className?: string
}

const verificationConfig = {
  identity: {
    icon: CheckCircle,
    label: "Identity Verified",
    description: "Government ID verified and confirmed",
    color: "blue",
    bgColor: "bg-blue-500",
    borderColor: "border-blue-500",
    textColor: "text-blue-600 dark:text-blue-400",
    gradientFrom: "from-blue-400",
    gradientTo: "to-blue-600"
  },
  platform: {
    icon: Star,
    label: "Platform Verified",
    description: "Quality standards met, consistent delivery",
    color: "gold",
    bgColor: "bg-yellow-500",
    borderColor: "border-yellow-500",
    textColor: "text-yellow-600 dark:text-yellow-400",
    gradientFrom: "from-yellow-400",
    gradientTo: "to-yellow-600"
  },
  celebrity: {
    icon: Trophy,
    label: "Celebrity Status",
    description: "Public figure confirmed with media presence",
    color: "purple",
    bgColor: "bg-purple-500",
    borderColor: "border-purple-500",
    textColor: "text-purple-600 dark:text-purple-400",
    gradientFrom: "from-purple-400",
    gradientTo: "to-purple-600"
  },
  elite: {
    icon: Crown,
    label: "Elite Creator",
    description: "Top 1% of creators on the platform",
    color: "gradient",
    bgColor: "bg-gradient-to-r from-purple-500 to-pink-500",
    borderColor: "border-purple-500",
    textColor: "text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600",
    gradientFrom: "from-purple-400",
    gradientTo: "to-pink-600"
  }
}

export function VerificationBadge({
  level,
  size = "sm",
  showLabel = false,
  animated = true,
  className
}: VerificationBadgeProps) {
  const config = verificationConfig[level]
  const Icon = config.icon

  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  }

  const badgeContent = (
    <motion.div
      initial={animated ? { scale: 0, rotate: -180 } : {}}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
      className={cn(
        "inline-flex items-center gap-1",
        className
      )}
    >
      <div className={cn(
        "relative inline-flex items-center justify-center",
        sizeClasses[size]
      )}>
        {/* Glow effect for elite */}
        {level === "elite" && animated && (
          <motion.div
            className={cn(
              "absolute inset-0 rounded-full opacity-50",
              config.bgColor
            )}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 0.2, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
        
        <Icon className={cn(
          sizeClasses[size],
          config.textColor,
          level === "elite" && "relative z-10"
        )} />
      </div>
      
      {showLabel && (
        <span className={cn(
          "text-xs font-medium",
          config.textColor
        )}>
          {config.label}
        </span>
      )}
    </motion.div>
  )

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="inline-flex">
            {badgeContent}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">{config.label}</p>
            <p className="text-xs text-gray-500">{config.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Composite badge for multiple verifications
export interface CompositeVerificationProps {
  verifications: VerificationLevel[]
  size?: "xs" | "sm" | "md" | "lg"
  maxDisplay?: number
  className?: string
}

export function CompositeVerification({
  verifications,
  size = "sm",
  maxDisplay = 3,
  className
}: CompositeVerificationProps) {
  const displayVerifications = verifications.slice(0, maxDisplay)
  const remaining = verifications.length - maxDisplay

  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      {displayVerifications.map((level, index) => (
        <motion.div
          key={level}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <VerificationBadge
            level={level}
            size={size}
            animated={false}
          />
        </motion.div>
      ))}
      
      {remaining > 0 && (
        <Badge variant="secondary" className="text-xs">
          +{remaining}
        </Badge>
      )}
    </div>
  )
}

// Achievement badges for special accomplishments
export type AchievementType = 
  | "top-rated"
  | "fast-responder"
  | "super-creator"
  | "rising-star"
  | "fan-favorite"
  | "consistent"

export interface AchievementBadgeProps {
  type: AchievementType
  size?: "xs" | "sm" | "md" | "lg"
  className?: string
}

const achievementConfig = {
  "top-rated": {
    icon: Star,
    label: "Top Rated",
    description: "4.9+ star rating",
    color: "text-yellow-500"
  },
  "fast-responder": {
    icon: Zap,
    label: "Fast Responder",
    description: "Responds within 1 hour",
    color: "text-blue-500"
  },
  "super-creator": {
    icon: Award,
    label: "Super Creator",
    description: "1000+ videos delivered",
    color: "text-purple-500"
  },
  "rising-star": {
    icon: TrendingUp,
    label: "Rising Star",
    description: "Rapidly growing popularity",
    color: "text-orange-500"
  },
  "fan-favorite": {
    icon: Heart,
    label: "Fan Favorite",
    description: "High repeat booking rate",
    color: "text-pink-500"
  },
  "consistent": {
    icon: Shield,
    label: "Consistent",
    description: "100% completion rate",
    color: "text-green-500"
  }
}

export function AchievementBadge({
  type,
  size = "sm",
  className
}: AchievementBadgeProps) {
  const config = achievementConfig[type]
  const Icon = config.icon

  const sizeClasses = {
    xs: "h-3 w-3",
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className={cn(
              "inline-flex items-center justify-center p-1 rounded-full bg-gray-100 dark:bg-gray-800",
              className
            )}
          >
            <Icon className={cn(sizeClasses[size], config.color)} />
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <p className="font-medium">{config.label}</p>
            <p className="text-xs text-gray-500">{config.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Trust score indicator
export interface TrustScoreProps {
  score: number // 0-100
  showLabel?: boolean
  size?: "sm" | "md" | "lg"
  className?: string
}

export function TrustScore({
  score,
  showLabel = true,
  size = "md",
  className
}: TrustScoreProps) {
  const getColor = () => {
    if (score >= 90) return "text-green-500 border-green-500"
    if (score >= 70) return "text-blue-500 border-blue-500"
    if (score >= 50) return "text-yellow-500 border-yellow-500"
    return "text-gray-500 border-gray-500"
  }

  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base"
  }

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className={cn(
          "relative rounded-full border-2 flex items-center justify-center font-bold",
          sizeClasses[size],
          getColor()
        )}
      >
        {score}
      </motion.div>
      
      {showLabel && (
        <div className="text-xs">
          <p className="font-medium">Trust Score</p>
          <p className="text-gray-500">
            {score >= 90 ? "Excellent" :
             score >= 70 ? "Very Good" :
             score >= 50 ? "Good" : "Building"}
          </p>
        </div>
      )}
    </div>
  )
}