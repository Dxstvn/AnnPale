"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import {
  Globe,
  MapPin,
  Clock,
  Award,
  Briefcase,
  GraduationCap,
  Music,
  Heart,
  Users,
  TrendingUp,
  BarChart3,
  Calendar as CalendarIcon,
  MessageSquare,
  Video,
  Star,
  Instagram,
  Twitter,
  Facebook,
  Youtube,
  ExternalLink,
  ChevronRight,
  Play
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { SocialProofMetrics } from "@/components/trust/social-proof-metrics"
import { AchievementBadge } from "@/components/trust/verification-badges"
import type { SocialProofMetrics as MetricsType } from "@/components/trust/social-proof-metrics"
import type { AchievementType } from "@/components/trust/verification-badges"

export interface ProfileDetailsData {
  // Bio & Background
  fullBio: string
  background?: string
  education?: string[]
  experience?: string[]
  
  // Languages & Location
  languages: Array<{
    language: string
    proficiency: "native" | "fluent" | "conversational"
  }>
  location: string
  timezone: string
  
  // Specialties & Skills
  specialties: string[]
  occasions: string[]
  skills?: string[]
  
  // Stats & Achievements
  metrics: MetricsType
  achievements: AchievementType[]
  milestones?: Array<{
    date: Date
    title: string
    description: string
  }>
  
  // Social Links
  socialLinks?: {
    instagram?: string
    twitter?: string
    facebook?: string
    youtube?: string
    website?: string
  }
  
  // Availability
  availability: {
    timezone: string
    schedule?: {
      [key: string]: { start: string; end: string }[]
    }
    blackoutDates?: Date[]
    nextAvailable?: Date
  }
  
  // Sample Videos
  sampleVideos?: Array<{
    id: string
    title: string
    thumbnail: string
    duration: number
    views?: number
  }>
}

interface ProfileDetailsProps {
  data: ProfileDetailsData
  onPlayVideo?: (videoId: string) => void
  className?: string
}

// Language proficiency badge
function LanguageBadge({ 
  language, 
  proficiency 
}: { 
  language: string
  proficiency: string 
}) {
  const colors = {
    native: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    fluent: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    conversational: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
  }

  return (
    <Badge className={cn("gap-1", colors[proficiency as keyof typeof colors])}>
      <Globe className="h-3 w-3" />
      {language}
      {proficiency === "native" && " (Native)"}
    </Badge>
  )
}

// Stats card component
function StatsCard({ 
  icon: Icon, 
  label, 
  value, 
  trend 
}: { 
  icon: React.ElementType
  label: string
  value: string | number
  trend?: number 
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Icon className="h-5 w-5 text-purple-500" />
          {trend && (
            <Badge variant={trend > 0 ? "success" : "secondary"} className="text-xs">
              {trend > 0 ? "+" : ""}{trend}%
            </Badge>
          )}
        </div>
        <p className="text-2xl font-bold">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </CardContent>
    </Card>
  )
}

// Video thumbnail component
function VideoThumbnail({ 
  video, 
  onPlay 
}: { 
  video: any
  onPlay: () => void 
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative group cursor-pointer"
      onClick={onPlay}
    >
      <div className="relative aspect-video overflow-hidden rounded-lg bg-gray-100">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
        
        {/* Play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="p-3 bg-white/90 rounded-full group-hover:scale-110 transition">
            <Play className="h-6 w-6 text-black fill-current" />
          </div>
        </div>
        
        {/* Duration */}
        <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/70 rounded text-xs text-white">
          {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
        </div>
      </div>
      
      <p className="mt-2 text-sm font-medium line-clamp-1">{video.title}</p>
      {video.views && (
        <p className="text-xs text-gray-500">{video.views.toLocaleString()} views</p>
      )}
    </motion.div>
  )
}

// Availability calendar component
function AvailabilityCalendar({ 
  availability 
}: { 
  availability: ProfileDetailsData["availability"] 
}) {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Availability</p>
          <p className="text-xs text-gray-500">Timezone: {availability.timezone}</p>
        </div>
        {availability.nextAvailable && (
          <Badge variant="secondary">
            Next: {availability.nextAvailable.toLocaleDateString()}
          </Badge>
        )}
      </div>
      
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        disabled={availability.blackoutDates}
        className="rounded-md border"
      />
    </div>
  )
}

// Main component
export function ProfileDetails({
  data,
  onPlayVideo,
  className
}: ProfileDetailsProps) {
  const [activeTab, setActiveTab] = React.useState("about")

  return (
    <div className={cn("space-y-6", className)}>
      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="availability">Book</TabsTrigger>
        </TabsList>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6">
          {/* Full Bio */}
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {data.fullBio}
              </p>
              
              {data.background && (
                <div>
                  <h4 className="font-medium mb-2">Background</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {data.background}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Languages & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Languages</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.languages.map((lang) => (
                    <LanguageBadge
                      key={lang.language}
                      language={lang.language}
                      proficiency={lang.proficiency}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{data.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">{data.timezone}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Specialties & Occasions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">What I Specialize In</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Specialties</p>
                <div className="flex flex-wrap gap-2">
                  {data.specialties.map((specialty) => (
                    <Badge key={specialty} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-2">Perfect For</p>
                <div className="flex flex-wrap gap-2">
                  {data.occasions.map((occasion) => (
                    <Badge key={occasion} variant="outline">
                      {occasion}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education & Experience */}
          {(data.education || data.experience) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {data.education && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Education
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {data.education.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {data.experience && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Experience
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {data.experience.map((item, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                          • {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* Videos Tab */}
        <TabsContent value="videos" className="space-y-6">
          {data.sampleVideos && data.sampleVideos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.sampleVideos.map((video) => (
                <VideoThumbnail
                  key={video.id}
                  video={video}
                  onPlay={() => onPlayVideo?.(video.id)}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No sample videos available yet</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Stats Tab */}
        <TabsContent value="stats" className="space-y-6">
          {/* Performance Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard
              icon={Video}
              label="Videos Delivered"
              value={data.metrics.videosDelivered}
              trend={15}
            />
            <StatsCard
              icon={Star}
              label="Average Rating"
              value={data.metrics.avgRating.toFixed(1)}
            />
            <StatsCard
              icon={Clock}
              label="Response Time"
              value={`${data.metrics.responseTime}h`}
              trend={-20}
            />
            <StatsCard
              icon={Users}
              label="Repeat Customers"
              value={`${data.metrics.repeatCustomers}%`}
              trend={10}
            />
          </div>

          {/* Detailed Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Details</CardTitle>
            </CardHeader>
            <CardContent>
              <SocialProofMetrics
                metrics={data.metrics}
                variant="detailed"
              />
            </CardContent>
          </Card>

          {/* Achievements */}
          <Card>
            <CardHeader>
              <CardTitle>Achievements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {data.achievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement}
                    type={achievement}
                    size="lg"
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Milestones */}
          {data.milestones && (
            <Card>
              <CardHeader>
                <CardTitle>Milestones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.milestones.map((milestone, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-20 text-right">
                        <p className="text-xs text-gray-500">
                          {milestone.date.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex-1 border-l-2 border-purple-200 pl-4">
                        <p className="font-medium text-sm">{milestone.title}</p>
                        <p className="text-xs text-gray-500">{milestone.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Availability Tab */}
        <TabsContent value="availability" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <AvailabilityCalendar availability={data.availability} />
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Booking Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2">How It Works</p>
                  <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li>1. Select your package and occasion</li>
                    <li>2. Write your personalized request</li>
                    <li>3. Complete secure payment</li>
                    <li>4. Receive your video within the delivery time</li>
                  </ol>
                </div>

                <Button className="w-full">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Book Now
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  100% satisfaction guaranteed or your money back
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Social Links */}
      {data.socialLinks && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Connect</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {data.socialLinks.instagram && (
                <Button variant="outline" size="sm" asChild>
                  <a href={data.socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                    <Instagram className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {data.socialLinks.twitter && (
                <Button variant="outline" size="sm" asChild>
                  <a href={data.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {data.socialLinks.facebook && (
                <Button variant="outline" size="sm" asChild>
                  <a href={data.socialLinks.facebook} target="_blank" rel="noopener noreferrer">
                    <Facebook className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {data.socialLinks.youtube && (
                <Button variant="outline" size="sm" asChild>
                  <a href={data.socialLinks.youtube} target="_blank" rel="noopener noreferrer">
                    <Youtube className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {data.socialLinks.website && (
                <Button variant="outline" size="sm" asChild>
                  <a href={data.socialLinks.website} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}