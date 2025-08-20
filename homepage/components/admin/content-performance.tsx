"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Video,
  Play,
  Eye,
  Clock,
  TrendingUp,
  TrendingDown,
  Star,
  Heart,
  Share2,
  MessageSquare,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Award,
  Calendar,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Music,
  Gift,
  Users,
  Globe
} from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoMetrics {
  totalVideos: number
  completedVideos: number
  avgCompletionRate: number
  avgDuration: number
  totalViews: number
  avgRating: number
  totalRevenue: number
}

interface CategoryPerformance {
  category: string
  icon: any
  videos: number
  views: number
  completionRate: number
  avgRating: number
  revenue: number
  trend: "up" | "down" | "stable"
  popularityScore: number
}

interface CreatorRanking {
  rank: number
  creator: {
    id: string
    name: string
    avatar: string
    verified: boolean
  }
  metrics: {
    videos: number
    completionRate: number
    avgRating: number
    responseTime: number
    revenue: number
  }
  change: number
  changeDirection: "up" | "down" | "same"
}

interface ContentQuality {
  metric: string
  score: number
  benchmark: number
  status: "excellent" | "good" | "needs_improvement" | "poor"
  impact: string
}

interface TrendingContent {
  id: string
  title: string
  creator: string
  category: string
  views: number
  growthRate: number
  viralScore: number
  createdAt: string
}

interface ConsumptionPattern {
  pattern: string
  description: string
  percentage: number
  insight: string
  recommendation: string
}

const videoMetrics: VideoMetrics = {
  totalVideos: 8934,
  completedVideos: 7842,
  avgCompletionRate: 87.8,
  avgDuration: 2.5,
  totalViews: 145230,
  avgRating: 4.7,
  totalRevenue: 402150
}

const categoryPerformance: CategoryPerformance[] = [
  {
    category: "Birthday Wishes",
    icon: Gift,
    videos: 3421,
    views: 58420,
    completionRate: 92,
    avgRating: 4.8,
    revenue: 154890,
    trend: "up",
    popularityScore: 95
  },
  {
    category: "Business Messages",
    icon: Users,
    videos: 1847,
    views: 31250,
    completionRate: 88,
    avgRating: 4.7,
    revenue: 92430,
    trend: "up",
    popularityScore: 82
  },
  {
    category: "Music & Performance",
    icon: Music,
    videos: 1523,
    views: 28940,
    completionRate: 85,
    avgRating: 4.9,
    revenue: 68750,
    trend: "stable",
    popularityScore: 78
  },
  {
    category: "Motivational",
    icon: Sparkles,
    videos: 1236,
    views: 19870,
    completionRate: 83,
    avgRating: 4.6,
    revenue: 49320,
    trend: "up",
    popularityScore: 71
  },
  {
    category: "Special Events",
    icon: Calendar,
    videos: 907,
    views: 15750,
    completionRate: 90,
    avgRating: 4.8,
    revenue: 36760,
    trend: "down",
    popularityScore: 65
  }
]

const creatorRankings: CreatorRanking[] = [
  {
    rank: 1,
    creator: {
      id: "creator-1",
      name: "Wyclef Jean",
      avatar: "/placeholder-avatar.jpg",
      verified: true
    },
    metrics: {
      videos: 342,
      completionRate: 94,
      avgRating: 4.9,
      responseTime: 1.2,
      revenue: 45230
    },
    change: 0,
    changeDirection: "same"
  },
  {
    rank: 2,
    creator: {
      id: "creator-2",
      name: "Ti Jo Zenny",
      avatar: "/placeholder-avatar.jpg",
      verified: true
    },
    metrics: {
      videos: 486,
      completionRate: 91,
      avgRating: 4.8,
      responseTime: 1.5,
      revenue: 38940
    },
    change: 2,
    changeDirection: "up"
  },
  {
    rank: 3,
    creator: {
      id: "creator-3",
      name: "Marie-Claire Dubois",
      avatar: "/placeholder-avatar.jpg",
      verified: true
    },
    metrics: {
      videos: 267,
      completionRate: 89,
      avgRating: 4.7,
      responseTime: 1.8,
      revenue: 32100
    },
    change: 1,
    changeDirection: "down"
  },
  {
    rank: 4,
    creator: {
      id: "creator-4",
      name: "Jean Baptiste",
      avatar: "/placeholder-avatar.jpg",
      verified: false
    },
    metrics: {
      videos: 412,
      completionRate: 86,
      avgRating: 4.6,
      responseTime: 2.1,
      revenue: 28750
    },
    change: 1,
    changeDirection: "down"
  }
]

const contentQuality: ContentQuality[] = [
  {
    metric: "Video Resolution",
    score: 92,
    benchmark: 85,
    status: "excellent",
    impact: "Higher viewer satisfaction"
  },
  {
    metric: "Audio Quality",
    score: 88,
    benchmark: 80,
    status: "good",
    impact: "Clear communication"
  },
  {
    metric: "Delivery Time",
    score: 85,
    benchmark: 90,
    status: "needs_improvement",
    impact: "Customer retention"
  },
  {
    metric: "Personalization",
    score: 94,
    benchmark: 85,
    status: "excellent",
    impact: "Higher ratings"
  },
  {
    metric: "Script Quality",
    score: 87,
    benchmark: 80,
    status: "good",
    impact: "Engagement rates"
  }
]

const trendingContent: TrendingContent[] = [
  {
    id: "video-1",
    title: "Birthday Surprise for Marie",
    creator: "Wyclef Jean",
    category: "Birthday Wishes",
    views: 12430,
    growthRate: 245,
    viralScore: 92,
    createdAt: "2 days ago"
  },
  {
    id: "video-2",
    title: "Business Partnership Message",
    creator: "Ti Jo Zenny",
    category: "Business Messages",
    views: 8920,
    growthRate: 180,
    viralScore: 85,
    createdAt: "3 days ago"
  },
  {
    id: "video-3",
    title: "Wedding Anniversary Special",
    creator: "Marie-Claire Dubois",
    category: "Special Events",
    views: 7650,
    growthRate: 150,
    viralScore: 78,
    createdAt: "1 day ago"
  }
]

const consumptionPatterns: ConsumptionPattern[] = [
  {
    pattern: "Peak Viewing Hours",
    description: "7-9 PM EST",
    percentage: 35,
    insight: "Evening leisure time drives most engagement",
    recommendation: "Schedule premium content releases for this window"
  },
  {
    pattern: "Mobile Dominance",
    description: "68% mobile views",
    percentage: 68,
    insight: "Users prefer mobile for video consumption",
    recommendation: "Optimize for vertical video formats"
  },
  {
    pattern: "Repeat Viewers",
    description: "42% watch multiple times",
    percentage: 42,
    insight: "High sentimental value in personalized content",
    recommendation: "Add sharing features for family/friends"
  },
  {
    pattern: "Category Preference",
    description: "Birthday messages lead",
    percentage: 38,
    insight: "Celebratory content most popular",
    recommendation: "Expand celebration-focused creator offerings"
  }
]

export function ContentPerformance() {
  const [selectedPeriod, setSelectedPeriod] = useState("month")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "bg-green-100 text-green-800"
      case "good": return "bg-blue-100 text-blue-800"
      case "needs_improvement": return "bg-yellow-100 text-yellow-800"
      case "poor": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-4 w-4 text-green-600" />
      case "down": return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getRankChange = (change: number, direction: string) => {
    if (direction === "same") return <span className="text-gray-500">-</span>
    if (direction === "up") {
      return (
        <span className="flex items-center text-green-600">
          <ArrowUpRight className="h-3 w-3" />
          {change}
        </span>
      )
    }
    return (
      <span className="flex items-center text-red-600">
        <ArrowDownRight className="h-3 w-3" />
        {change}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Content Performance</h2>
          <p className="text-gray-600">Video analytics and content insights</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Content Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Videos</p>
                <p className="text-2xl font-bold">{videoMetrics.totalVideos.toLocaleString()}</p>
                <p className="text-xs text-gray-500 mt-1">{videoMetrics.completedVideos.toLocaleString()} completed</p>
              </div>
              <Video className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold">{videoMetrics.avgCompletionRate}%</p>
                <div className="flex items-center gap-1 mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-600" />
                  <span className="text-xs text-green-600">+2.3%</span>
                </div>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold">{(videoMetrics.totalViews / 1000).toFixed(1)}K</p>
                <p className="text-xs text-gray-500 mt-1">16.3 per video</p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold">{videoMetrics.avgRating}</p>
                <div className="flex gap-0.5 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={cn(
                        "h-3 w-3",
                        i < Math.floor(videoMetrics.avgRating) 
                          ? "fill-yellow-400 text-yellow-400" 
                          : "text-gray-300"
                      )} 
                    />
                  ))}
                </div>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="creators">Creator Rankings</TabsTrigger>
          <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
          <TabsTrigger value="trending">Trending</TabsTrigger>
          <TabsTrigger value="patterns">Consumption</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>Video performance by content category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryPerformance.map((category) => {
                  const Icon = category.icon
                  return (
                    <div key={category.category} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <h4 className="font-medium">{category.category}</h4>
                            <p className="text-sm text-gray-600">
                              {category.videos.toLocaleString()} videos • {(category.views / 1000).toFixed(1)}K views
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getTrendIcon(category.trend)}
                          <Badge variant="outline">
                            Popularity: {category.popularityScore}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Completion</p>
                          <div className="flex items-center gap-2">
                            <Progress value={category.completionRate} className="flex-1 h-2" />
                            <span className="font-medium">{category.completionRate}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600">Rating</p>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span className="font-medium">{category.avgRating}</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-600">Revenue</p>
                          <p className="font-medium">${(category.revenue / 1000).toFixed(1)}K</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Avg Views</p>
                          <p className="font-medium">{Math.round(category.views / category.videos)}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="creators" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Creator Performance Rankings</CardTitle>
              <CardDescription>Top performing creators by key metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">Rank</TableHead>
                    <TableHead>Creator</TableHead>
                    <TableHead className="text-right">Videos</TableHead>
                    <TableHead className="text-right">Completion</TableHead>
                    <TableHead className="text-right">Rating</TableHead>
                    <TableHead className="text-right">Response</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-center">Change</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {creatorRankings.map((ranking) => (
                    <TableRow key={ranking.creator.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {ranking.rank <= 3 && (
                            <Award className={cn(
                              "h-4 w-4",
                              ranking.rank === 1 && "text-yellow-500",
                              ranking.rank === 2 && "text-gray-400",
                              ranking.rank === 3 && "text-orange-600"
                            )} />
                          )}
                          <span className="font-bold">{ranking.rank}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={ranking.creator.avatar} />
                            <AvatarFallback>
                              {ranking.creator.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{ranking.creator.name}</p>
                            {ranking.creator.verified && (
                              <Badge variant="secondary" className="text-xs">Verified</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{ranking.metrics.videos}</TableCell>
                      <TableCell className="text-right">{ranking.metrics.completionRate}%</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          {ranking.metrics.avgRating}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{ranking.metrics.responseTime}d</TableCell>
                      <TableCell className="text-right font-medium">
                        ${ranking.metrics.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        {getRankChange(ranking.change, ranking.changeDirection)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="quality" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Quality Metrics</CardTitle>
              <CardDescription>Quality indicators and their impact on performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentQuality.map((quality) => (
                  <div key={quality.metric} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{quality.metric}</h4>
                        <Badge className={getStatusColor(quality.status)}>
                          {quality.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">Impact: {quality.impact}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-3">
                        <div>
                          <p className="text-2xl font-bold">{quality.score}</p>
                          <p className="text-xs text-gray-500">Benchmark: {quality.benchmark}</p>
                        </div>
                        <Progress 
                          value={quality.score} 
                          className="w-24 h-2" 
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trending Content</CardTitle>
              <CardDescription>Viral and rapidly growing content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trendingContent.map((content) => (
                  <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{content.title}</h4>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                        <span>by {content.creator}</span>
                        <span>•</span>
                        <span>{content.category}</span>
                        <span>•</span>
                        <span>{content.createdAt}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <p className="text-lg font-bold">{(content.views / 1000).toFixed(1)}K</p>
                        <p className="text-xs text-gray-500">views</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-lg font-bold text-green-600">+{content.growthRate}%</span>
                        </div>
                        <p className="text-xs text-gray-500">growth</p>
                      </div>
                      <div className="text-center">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          {content.viralScore} viral score
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Content Consumption Patterns</CardTitle>
              <CardDescription>How users interact with video content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {consumptionPatterns.map((pattern) => (
                  <div key={pattern.pattern} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{pattern.pattern}</h4>
                        <p className="text-2xl font-bold mt-1">{pattern.description}</p>
                      </div>
                      <Badge variant="outline">{pattern.percentage}%</Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="p-2 bg-blue-50 rounded text-sm">
                        <p className="font-medium text-blue-900">Insight</p>
                        <p className="text-blue-700">{pattern.insight}</p>
                      </div>
                      <div className="p-2 bg-green-50 rounded text-sm">
                        <p className="font-medium text-green-900">Recommendation</p>
                        <p className="text-green-700">{pattern.recommendation}</p>
                      </div>
                    </div>
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