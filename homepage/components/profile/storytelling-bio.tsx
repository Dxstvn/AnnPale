"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  Heart,
  Quote,
  ChevronDown,
  ChevronUp,
  User,
  Briefcase,
  MapPin,
  Globe,
  Book,
  Music,
  Coffee,
  Star
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Bio content structure
export interface StorytellingBioData {
  // Primary Identity
  tagline: string // 100 char limit - quick identity
  shortBio: string // 300 char limit - overview
  fullStory: string // 1000 char limit - full story
  
  // Personal Touch
  personalMotto?: string
  favoriteQuote?: string
  hometown?: string
  currentLocation?: string
  
  // Personality Markers
  personalityTraits?: string[]
  passions?: string[]
  causes?: string[]
  
  // Connection Points
  sharedExperiences?: string[]
  culturalBackground?: string
  lifePhilosophy?: string
}

interface StorytellingBioProps {
  data: StorytellingBioData
  creatorName: string
  className?: string
  variant?: "full" | "compact" | "card"
}

// Character counter component
function CharacterCount({ current, max }: { current: number; max: number }) {
  const percentage = (current / max) * 100
  const isNearLimit = percentage > 80
  const isOverLimit = percentage > 100
  
  return (
    <span className={cn(
      "text-xs",
      isOverLimit && "text-red-500",
      isNearLimit && !isOverLimit && "text-orange-500",
      !isNearLimit && "text-gray-400"
    )}>
      {current}/{max}
    </span>
  )
}

// Tagline display with emoji support
function Tagline({ tagline, className }: { tagline: string; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("text-center", className)}
    >
      <p className="text-xl md:text-2xl font-medium text-gray-800 dark:text-gray-200">
        {tagline}
      </p>
    </motion.div>
  )
}

// Expandable story section
function ExpandableStory({ 
  shortBio, 
  fullStory,
  characterLimits = { short: 300, full: 1000 }
}: { 
  shortBio: string
  fullStory: string
  characterLimits?: { short: number; full: number }
}) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const hasMore = fullStory.length > shortBio.length
  
  return (
    <div className="space-y-3">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.div
            key="short"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-2"
          >
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              {shortBio}
            </p>
            {hasMore && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(true)}
                className="text-purple-600 hover:text-purple-700"
              >
                Read Full Story
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="full"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {fullStory.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {paragraph}
              </p>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(false)}
              className="text-purple-600 hover:text-purple-700"
            >
              Show Less
              <ChevronUp className="h-4 w-4 ml-1" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Personal touch section
function PersonalTouch({ 
  data 
}: { 
  data: Pick<StorytellingBioData, 'personalMotto' | 'favoriteQuote' | 'hometown' | 'currentLocation'> 
}) {
  const items = [
    data.personalMotto && {
      icon: Heart,
      label: "Personal Motto",
      value: data.personalMotto
    },
    data.favoriteQuote && {
      icon: Quote,
      label: "Favorite Quote",
      value: data.favoriteQuote
    },
    data.hometown && {
      icon: MapPin,
      label: "Hometown",
      value: data.hometown
    },
    data.currentLocation && {
      icon: Globe,
      label: "Currently in",
      value: data.currentLocation
    }
  ].filter(Boolean)
  
  if (items.length === 0) return null
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {items.map((item, index) => item && (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
        >
          <item.icon className="h-5 w-5 text-purple-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{item.label}</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

// Personality traits display
function PersonalityTraits({ traits }: { traits: string[] }) {
  const colors = [
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
    "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
  ]
  
  return (
    <div className="flex flex-wrap gap-2">
      {traits.map((trait, index) => (
        <motion.div
          key={trait}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
        >
          <Badge className={cn("font-normal", colors[index % colors.length])}>
            {trait}
          </Badge>
        </motion.div>
      ))}
    </div>
  )
}

// Connection points for building parasocial relationships
function ConnectionPoints({ 
  experiences, 
  background, 
  philosophy 
}: { 
  experiences?: string[]
  background?: string
  philosophy?: string 
}) {
  return (
    <div className="space-y-4">
      {background && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4 text-purple-600" />
            <p className="text-sm font-medium text-purple-700 dark:text-purple-300">Cultural Background</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{background}</p>
        </div>
      )}
      
      {philosophy && (
        <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Book className="h-4 w-4 text-blue-600" />
            <p className="text-sm font-medium text-blue-700 dark:text-blue-300">Life Philosophy</p>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{philosophy}</p>
        </div>
      )}
      
      {experiences && experiences.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Shared Experiences</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {experiences.map((exp, index) => (
              <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Star className="h-3 w-3 text-yellow-500" />
                <span>{exp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// Main storytelling bio component
export function StorytellingBio({
  data,
  creatorName,
  className,
  variant = "full"
}: StorytellingBioProps) {
  if (variant === "compact") {
    return (
      <div className={cn("space-y-3", className)}>
        <Tagline tagline={data.tagline} />
        <p className="text-gray-600 dark:text-gray-400 text-center">{data.shortBio}</p>
        {data.personalityTraits && (
          <div className="flex justify-center">
            <PersonalityTraits traits={data.personalityTraits.slice(0, 3)} />
          </div>
        )}
      </div>
    )
  }
  
  if (variant === "card") {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            About {creatorName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tagline tagline={data.tagline} />
          <ExpandableStory shortBio={data.shortBio} fullStory={data.fullStory} />
          {data.personalityTraits && (
            <div>
              <p className="text-sm font-medium mb-2">Personality</p>
              <PersonalityTraits traits={data.personalityTraits} />
            </div>
          )}
        </CardContent>
      </Card>
    )
  }
  
  // Full variant (default)
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with tagline */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Get to Know {creatorName}
        </h2>
        <Tagline tagline={data.tagline} />
      </div>
      
      {/* Main story */}
      <ExpandableStory shortBio={data.shortBio} fullStory={data.fullStory} />
      
      {/* Personal touch section */}
      <PersonalTouch 
        data={{
          personalMotto: data.personalMotto,
          favoriteQuote: data.favoriteQuote,
          hometown: data.hometown,
          currentLocation: data.currentLocation
        }}
      />
      
      {/* Personality & Passions */}
      {(data.personalityTraits || data.passions || data.causes) && (
        <div className="space-y-4">
          {data.personalityTraits && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Personality Traits
              </h3>
              <PersonalityTraits traits={data.personalityTraits} />
            </div>
          )}
          
          {data.passions && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500" />
                Passions
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.passions.map((passion) => (
                  <Badge key={passion} variant="secondary">{passion}</Badge>
                ))}
              </div>
            </div>
          )}
          
          {data.causes && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Heart className="h-4 w-4 text-purple-500" />
                Causes I Support
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.causes.map((cause) => (
                  <Badge key={cause} className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                    {cause}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Connection points */}
      {(data.sharedExperiences || data.culturalBackground || data.lifePhilosophy) && (
        <ConnectionPoints
          experiences={data.sharedExperiences}
          background={data.culturalBackground}
          philosophy={data.lifePhilosophy}
        />
      )}
    </div>
  )
}