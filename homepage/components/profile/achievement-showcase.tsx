"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Trophy,
  Award,
  Star,
  Medal,
  Target,
  Zap,
  TrendingUp,
  Users,
  Heart,
  Briefcase,
  GraduationCap,
  Mic,
  Camera,
  Music,
  Film,
  Radio,
  Tv,
  Globe,
  Crown,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Calendar,
  CheckCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

// Achievement types and data structure
export interface Achievement {
  id: string
  title: string
  description: string
  date?: Date
  category: "career" | "media" | "awards" | "education" | "community" | "platform"
  icon?: "trophy" | "star" | "medal" | "mic" | "camera" | "film" | "tv" | "radio" | "crown"
  verified?: boolean
  link?: string
  highlight?: boolean
}

export interface Milestone {
  id: string
  title: string
  description: string
  date: Date
  type: "career" | "personal" | "platform"
  metric?: string
}

export interface AchievementShowcaseData {
  achievements: Achievement[]
  milestones?: Milestone[]
  stats?: {
    totalAwards?: number
    mediaAppearances?: number
    yearsExperience?: number
    projectsCompleted?: number
  }
  certifications?: Array<{
    name: string
    issuer: string
    date: Date
    verified: boolean
  }>
}

interface AchievementShowcaseProps {
  data: AchievementShowcaseData
  creatorName: string
  className?: string
  variant?: "full" | "compact" | "timeline"
}

// Icon mapping
const iconMap = {
  trophy: Trophy,
  star: Star,
  medal: Medal,
  mic: Mic,
  camera: Camera,
  film: Film,
  tv: Tv,
  radio: Radio,
  crown: Crown
}

// Category colors
const categoryColors = {
  career: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  media: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  awards: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  education: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  community: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
  platform: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
}

// Single achievement card
function AchievementCard({ 
  achievement,
  index 
}: { 
  achievement: Achievement
  index: number 
}) {
  const Icon = achievement.icon ? iconMap[achievement.icon] : Award
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={cn(
        "relative group",
        achievement.highlight && "md:col-span-2"
      )}
    >
      <Card className={cn(
        "h-full transition-all hover:shadow-lg",
        achievement.highlight && "border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
      )}>
        {achievement.highlight && (
          <div className="absolute -top-2 -right-2">
            <Badge className="bg-purple-600">
              <Sparkles className="h-3 w-3 mr-1" />
              Highlight
            </Badge>
          </div>
        )}
        
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className={cn(
              "p-2 rounded-lg",
              categoryColors[achievement.category].split(' ')[0]
            )}>
              <Icon className="h-5 w-5" />
            </div>
            
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    {achievement.title}
                    {achievement.verified && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">Verified achievement</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </h4>
                  <Badge 
                    variant="secondary" 
                    className={cn("text-xs mt-1", categoryColors[achievement.category])}
                  >
                    {achievement.category}
                  </Badge>
                </div>
                
                {achievement.link && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => window.open(achievement.link, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {achievement.description}
              </p>
              
              {achievement.date && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(achievement.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short' 
                  })}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

// Timeline view for milestones
function MilestoneTimeline({ milestones }: { milestones: Milestone[] }) {
  const sortedMilestones = [...milestones].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )
  
  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-4 top-8 bottom-8 w-0.5 bg-gray-200 dark:bg-gray-700" />
      
      <div className="space-y-6">
        {sortedMilestones.map((milestone, index) => (
          <motion.div
            key={milestone.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex gap-4"
          >
            {/* Timeline dot */}
            <div className="relative z-10">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                milestone.type === "career" && "bg-blue-500",
                milestone.type === "personal" && "bg-purple-500",
                milestone.type === "platform" && "bg-green-500"
              )}>
                <div className="w-3 h-3 bg-white rounded-full" />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 pb-6">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-sm">{milestone.title}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {milestone.description}
                  </p>
                  {milestone.metric && (
                    <Badge variant="secondary" className="mt-2">
                      {milestone.metric}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(milestone.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'short' 
                  })}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Stats overview
function StatsOverview({ stats }: { stats: AchievementShowcaseData['stats'] }) {
  if (!stats) return null
  
  const statItems = [
    stats.totalAwards && { label: "Awards Won", value: stats.totalAwards, icon: Trophy },
    stats.mediaAppearances && { label: "Media Features", value: stats.mediaAppearances, icon: Tv },
    stats.yearsExperience && { label: "Years Experience", value: stats.yearsExperience, icon: Briefcase },
    stats.projectsCompleted && { label: "Projects", value: stats.projectsCompleted, icon: Target }
  ].filter(Boolean)
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statItems.map((stat, index) => stat && (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-2">
            <stat.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {stat.value}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  )
}

// Certifications section
function Certifications({ 
  certifications 
}: { 
  certifications: NonNullable<AchievementShowcaseData['certifications']> 
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
        <GraduationCap className="h-4 w-4" />
        Certifications
      </h3>
      <div className="grid gap-3">
        {certifications.map((cert, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex items-start gap-3">
              <GraduationCap className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium">{cert.name}</p>
                <p className="text-xs text-gray-500">{cert.issuer}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {cert.verified && (
                <Badge variant="secondary" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              <span className="text-xs text-gray-500">
                {new Date(cert.date).getFullYear()}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// Main achievement showcase component
export function AchievementShowcase({
  data,
  creatorName,
  className,
  variant = "full"
}: AchievementShowcaseProps) {
  const [activeTab, setActiveTab] = React.useState<"achievements" | "timeline">("achievements")
  const highlightedAchievements = data.achievements.filter(a => a.highlight)
  const regularAchievements = data.achievements.filter(a => !a.highlight)
  
  if (variant === "compact") {
    // Show only top 3 achievements
    const topAchievements = [...highlightedAchievements, ...regularAchievements].slice(0, 3)
    
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Trophy className="h-4 w-4 text-yellow-500" />
            Key Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {topAchievements.map((achievement, index) => (
            <div key={achievement.id} className="flex items-start gap-3">
              <div className="p-1.5 rounded bg-yellow-100 dark:bg-yellow-900/30">
                <Star className="h-3 w-3 text-yellow-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{achievement.title}</p>
                <p className="text-xs text-gray-500">{achievement.description}</p>
              </div>
            </div>
          ))}
          {data.achievements.length > 3 && (
            <Button variant="ghost" size="sm" className="w-full">
              View All {data.achievements.length} Achievements
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </CardContent>
      </Card>
    )
  }
  
  if (variant === "timeline" && data.milestones) {
    return (
      <div className={cn("space-y-6", className)}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {creatorName}'s Journey
        </h2>
        <MilestoneTimeline milestones={data.milestones} />
      </div>
    )
  }
  
  // Full variant (default)
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Trophy className="h-6 w-6 text-yellow-500" />
          Achievements & Recognition
        </h2>
        {data.milestones && (
          <div className="flex gap-2">
            <Button
              variant={activeTab === "achievements" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("achievements")}
            >
              Achievements
            </Button>
            <Button
              variant={activeTab === "timeline" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("timeline")}
            >
              Timeline
            </Button>
          </div>
        )}
      </div>
      
      {/* Stats Overview */}
      {data.stats && <StatsOverview stats={data.stats} />}
      
      {/* Content */}
      <AnimatePresence mode="wait">
        {activeTab === "achievements" ? (
          <motion.div
            key="achievements"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Highlighted achievements */}
            {highlightedAchievements.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {highlightedAchievements.map((achievement, index) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    index={index}
                  />
                ))}
              </div>
            )}
            
            {/* Regular achievements */}
            {regularAchievements.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {regularAchievements.map((achievement, index) => (
                  <AchievementCard
                    key={achievement.id}
                    achievement={achievement}
                    index={index}
                  />
                ))}
              </div>
            )}
            
            {/* Certifications */}
            {data.certifications && data.certifications.length > 0 && (
              <Certifications certifications={data.certifications} />
            )}
          </motion.div>
        ) : (
          <motion.div
            key="timeline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {data.milestones && <MilestoneTimeline milestones={data.milestones} />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}