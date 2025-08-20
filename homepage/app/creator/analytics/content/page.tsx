"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from "recharts"
import { 
  Video,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Star,
  TrendingUp,
  TrendingDown,
  Clock,
  Calendar,
  Download,
  FileText,
  PlayCircle,
  Filter,
  ThumbsUp,
  BarChart3,
  Activity
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

// Mock data for content analytics
const contentData = {
  overview: {
    totalVideos: 156,
    totalViews: 45280,
    avgViewDuration: "3:45",
    completionRate: 68,
    engagementRate: 8.5,
    avgRating: 4.8
  },
  topVideos: [
    {
      id: "1",
      title: "Birthday Message for Sarah",
      thumbnail: "/video-thumb-1.jpg",
      views: 5420,
      likes: 412,
      shares: 89,
      comments: 34,
      completionRate: 72,
      avgWatchTime: "2:30",
      rating: 4.9,
      revenue: 425,
      category: "Birthday"
    },
    {
      id: "2",
      title: "Anniversary Wishes - Marie & Jean",
      thumbnail: "/video-thumb-2.jpg",
      views: 4180,
      likes: 356,
      shares: 67,
      comments: 28,
      completionRate: 68,
      avgWatchTime: "3:15",
      rating: 4.8,
      revenue: 340,
      category: "Anniversary"
    },
    {
      id: "3",
      title: "Graduation Congratulations",
      thumbnail: "/video-thumb-3.jpg",
      views: 3950,
      likes: 298,
      shares: 54,
      comments: 22,
      completionRate: 65,
      avgWatchTime: "2:45",
      rating: 4.7,
      revenue: 255,
      category: "Graduation"
    },
    {
      id: "4",
      title: "Holiday Greetings 2024",
      thumbnail: "/video-thumb-4.jpg",
      views: 3200,
      likes: 245,
      shares: 42,
      comments: 18,
      completionRate: 70,
      avgWatchTime: "1:50",
      rating: 4.6,
      revenue: 170,
      category: "Holiday"
    },
    {
      id: "5",
      title: "Custom Birthday Song",
      thumbnail: "/video-thumb-5.jpg",
      views: 2890,
      likes: 198,
      shares: 38,
      comments: 15,
      completionRate: 74,
      avgWatchTime: "3:30",
      rating: 4.9,
      revenue: 255,
      category: "Birthday"
    }
  ],
  performanceMetrics: {
    viewsOverTime: [
      { date: "Jan 1", views: 1200, engagement: 85 },
      { date: "Jan 8", views: 1450, engagement: 92 },
      { date: "Jan 15", views: 1680, engagement: 88 },
      { date: "Jan 22", views: 1520, engagement: 90 },
      { date: "Jan 29", views: 1890, engagement: 95 },
      { date: "Feb 5", views: 2100, engagement: 98 },
      { date: "Feb 12", views: 1950, engagement: 94 }
    ],
    categoryPerformance: [
      { category: "Birthday", videos: 45, views: 18500, avgRating: 4.8, revenue: 3825 },
      { category: "Anniversary", videos: 28, views: 12400, avgRating: 4.7, revenue: 2380 },
      { category: "Graduation", videos: 22, views: 9800, avgRating: 4.6, revenue: 1870 },
      { category: "Holiday", videos: 18, views: 7200, avgRating: 4.5, revenue: 1530 },
      { category: "Custom", videos: 15, views: 6500, avgRating: 4.9, revenue: 1275 },
      { category: "Other", videos: 28, views: 8900, avgRating: 4.4, revenue: 2380 }
    ],
    engagementByType: [
      { type: "Likes", value: 35 },
      { type: "Comments", value: 15 },
      { type: "Shares", value: 25 },
      { type: "Saves", value: 25 }
    ],
    viewerRetention: [
      { time: "0%", retention: 100 },
      { time: "25%", retention: 85 },
      { time: "50%", retention: 72 },
      { time: "75%", retention: 58 },
      { time: "100%", retention: 45 }
    ]
  },
  videoLength: {
    distribution: [
      { range: "0-1 min", count: 12, avgCompletion: 85 },
      { range: "1-2 min", count: 48, avgCompletion: 75 },
      { range: "2-3 min", count: 52, avgCompletion: 68 },
      { range: "3-4 min", count: 28, avgCompletion: 62 },
      { range: "4-5 min", count: 12, avgCompletion: 55 },
      { range: "5+ min", count: 4, avgCompletion: 48 }
    ]
  },
  audienceEngagement: {
    hourlyActivity: [
      { hour: "6 AM", views: 120 },
      { hour: "9 AM", views: 380 },
      { hour: "12 PM", views: 520 },
      { hour: "3 PM", views: 450 },
      { hour: "6 PM", views: 680 },
      { hour: "9 PM", views: 820 },
      { hour: "12 AM", views: 280 }
    ],
    dayOfWeek: [
      { day: "Mon", views: 2100 },
      { day: "Tue", views: 1950 },
      { day: "Wed", views: 2200 },
      { day: "Thu", views: 2050 },
      { day: "Fri", views: 2800 },
      { day: "Sat", views: 3200 },
      { day: "Sun", views: 2900 }
    ]
  }
}

// Translations
const contentTranslations: Record<string, Record<string, string>> = {
  content_performance: {
    en: "Content Performance",
    fr: "Performance du contenu",
    ht: "Pèfòmans kontni"
  },
  analyze_content: {
    en: "Analyze your video content performance and engagement",
    fr: "Analysez les performances et l'engagement de votre contenu vidéo",
    ht: "Analize pèfòmans ak angajman videyo ou"
  },
  total_videos: {
    en: "Total Videos",
    fr: "Total des vidéos",
    ht: "Total videyo"
  },
  total_views: {
    en: "Total Views",
    fr: "Vues totales",
    ht: "Total vi"
  },
  avg_watch_time: {
    en: "Avg Watch Time",
    fr: "Temps de visionnage moyen",
    ht: "Tan gade mwayèn"
  },
  engagement_rate: {
    en: "Engagement Rate",
    fr: "Taux d'engagement",
    ht: "To angajman"
  },
  top_performing: {
    en: "Top Performing Videos",
    fr: "Vidéos les plus performantes",
    ht: "Pi bon videyo"
  },
  performance_metrics: {
    en: "Performance Metrics",
    fr: "Métriques de performance",
    ht: "Mezi pèfòmans"
  },
  audience_engagement: {
    en: "Audience Engagement",
    fr: "Engagement de l'audience",
    ht: "Angajman odyans"
  },
  video_analytics: {
    en: "Video Analytics",
    fr: "Analyse vidéo",
    ht: "Analiz videyo"
  },
  completion_rate: {
    en: "Completion Rate",
    fr: "Taux de complétion",
    ht: "To konplesyon"
  },
  category_performance: {
    en: "Category Performance",
    fr: "Performance par catégorie",
    ht: "Pèfòmans pa kategori"
  },
  viewer_retention: {
    en: "Viewer Retention",
    fr: "Rétention des spectateurs",
    ht: "Retansyon espektatè"
  },
  export_analytics: {
    en: "Export Analytics",
    fr: "Exporter l'analyse",
    ht: "Ekspòte analiz"
  }
}

// Chart colors
const COLORS = ['#9333EA', '#EC4899', '#F59E0B', '#10B981', '#3B82F6', '#EF4444']

export default function ContentAnalyticsPage() {
  const { language } = useLanguage()
  const [dateRange, setDateRange] = useState("last_30_days")
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedCategory, setSelectedCategory] = useState("all")
  
  const t = (key: string) => {
    return contentTranslations[key]?.[language] || contentTranslations[key]?.en || key
  }
  
  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border">
          <p className="font-medium text-sm">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      )
    }
    return null
  }
  
  const handleExport = (format: 'csv' | 'pdf') => {
    console.log(`Exporting content analytics as ${format}`)
  }
  
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('content_performance')}</h1>
            <p className="text-gray-600 mt-1">{t('analyze_content')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_7_days">Last 7 Days</SelectItem>
                <SelectItem value="last_30_days">Last 30 Days</SelectItem>
                <SelectItem value="last_3_months">Last 3 Months</SelectItem>
                <SelectItem value="all_time">All Time</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[150px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="birthday">Birthday</SelectItem>
                <SelectItem value="anniversary">Anniversary</SelectItem>
                <SelectItem value="graduation">Graduation</SelectItem>
                <SelectItem value="holiday">Holiday</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
              onClick={() => handleExport('pdf')}
            >
              <FileText className="h-4 w-4 mr-2" />
              {t('export_analytics')}
            </Button>
          </div>
        </div>
      </div>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">{t('total_videos')}</p>
              <p className="text-xl font-bold text-gray-900">{contentData.overview.totalVideos}</p>
            </div>
            <Video className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">{t('total_views')}</p>
              <p className="text-xl font-bold text-gray-900">{contentData.overview.totalViews.toLocaleString()}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">{t('avg_watch_time')}</p>
              <p className="text-xl font-bold text-gray-900">{contentData.overview.avgViewDuration}</p>
            </div>
            <Clock className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">{t('completion_rate')}</p>
              <p className="text-xl font-bold text-gray-900">{contentData.overview.completionRate}%</p>
            </div>
            <PlayCircle className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">{t('engagement_rate')}</p>
              <p className="text-xl font-bold text-gray-900">{contentData.overview.engagementRate}%</p>
            </div>
            <Heart className="h-8 w-8 text-pink-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600">Avg Rating</p>
              <p className="text-xl font-bold text-gray-900">{contentData.overview.avgRating}</p>
            </div>
            <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
          </div>
        </Card>
      </div>
      
      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="videos">{t('top_performing')}</TabsTrigger>
          <TabsTrigger value="metrics">{t('performance_metrics')}</TabsTrigger>
          <TabsTrigger value="engagement">{t('audience_engagement')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Views Over Time */}
            <Card>
              <CardHeader>
                <CardTitle>Views & Engagement Trend</CardTitle>
                <CardDescription>Weekly performance overview</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={contentData.performanceMetrics.viewsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" stroke="#6B7280" fontSize={12} />
                    <YAxis yAxisId="left" stroke="#6B7280" fontSize={12} />
                    <YAxis yAxisId="right" orientation="right" stroke="#6B7280" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="views" 
                      stroke="#9333EA" 
                      strokeWidth={2}
                      dot={{ fill: '#9333EA', r: 4 }}
                      name="Views"
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="engagement" 
                      stroke="#EC4899" 
                      strokeWidth={2}
                      dot={{ fill: '#EC4899', r: 4 }}
                      name="Engagement"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Category Performance */}
            <Card>
              <CardHeader>
                <CardTitle>{t('category_performance')}</CardTitle>
                <CardDescription>Performance by content category</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={contentData.performanceMetrics.categoryPerformance}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="category" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="views" fill="#9333EA" radius={[8, 8, 0, 0]}>
                      {contentData.performanceMetrics.categoryPerformance.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
          
          {/* Engagement Breakdown */}
          <div className="grid lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Engagement Types</CardTitle>
                <CardDescription>How viewers interact with content</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={contentData.performanceMetrics.engagementByType}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {contentData.performanceMetrics.engagementByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {contentData.performanceMetrics.engagementByType.map((type, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span>{type.type}: {type.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>{t('viewer_retention')}</CardTitle>
                <CardDescription>Average viewer retention curve</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={contentData.performanceMetrics.viewerRetention}>
                    <defs>
                      <linearGradient id="colorRetention" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="time" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="retention" 
                      stroke="#10B981" 
                      fillOpacity={1} 
                      fill="url(#colorRetention)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Video Length Performance</CardTitle>
                <CardDescription>Completion rate by duration</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {contentData.videoLength.distribution.slice(0, 4).map((range, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{range.range}</span>
                        <span className="text-gray-600">{range.avgCompletion}% completion</span>
                      </div>
                      <Progress value={range.avgCompletion} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="videos" className="space-y-6">
          {/* Top Performing Videos */}
          <Card>
            <CardHeader>
              <CardTitle>{t('top_performing')}</CardTitle>
              <CardDescription>Your best performing video content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {contentData.topVideos.map((video, index) => (
                  <div key={video.id} className="flex items-center gap-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0",
                      index === 0 ? "bg-gradient-to-r from-purple-600 to-pink-600" :
                      index === 1 ? "bg-gray-400" :
                      index === 2 ? "bg-orange-400" : "bg-gray-300"
                    )}>
                      {index + 1}
                    </div>
                    <div className="w-24 h-16 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                      <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium truncate">{video.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {video.views.toLocaleString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {video.likes}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageCircle className="h-3 w-3" />
                          {video.comments}
                        </span>
                        <span className="flex items-center gap-1">
                          <Share2 className="h-3 w-3" />
                          {video.shares}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 justify-end mb-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{video.rating}</span>
                      </div>
                      <Badge variant="secondary">{video.category}</Badge>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${video.revenue}</p>
                      <p className="text-sm text-gray-500">{video.completionRate}% completion</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Category Breakdown Table */}
          <Card>
            <CardHeader>
              <CardTitle>Performance by Category</CardTitle>
              <CardDescription>Detailed breakdown of content categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Category</th>
                      <th className="text-right py-3 px-4">Videos</th>
                      <th className="text-right py-3 px-4">Total Views</th>
                      <th className="text-right py-3 px-4">Avg Rating</th>
                      <th className="text-right py-3 px-4">Revenue</th>
                      <th className="text-right py-3 px-4">Trend</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contentData.performanceMetrics.categoryPerformance.map((category, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{category.category}</td>
                        <td className="text-right py-3 px-4">{category.videos}</td>
                        <td className="text-right py-3 px-4">{category.views.toLocaleString()}</td>
                        <td className="text-right py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            {category.avgRating}
                          </div>
                        </td>
                        <td className="text-right py-3 px-4">${category.revenue.toLocaleString()}</td>
                        <td className="text-right py-3 px-4">
                          <div className="flex items-center justify-end gap-1">
                            {index % 2 === 0 ? (
                              <>
                                <TrendingUp className="h-4 w-4 text-green-600" />
                                <span className="text-green-600">+15%</span>
                              </>
                            ) : (
                              <>
                                <TrendingDown className="h-4 w-4 text-red-600" />
                                <span className="text-red-600">-8%</span>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="metrics" className="space-y-6">
          {/* Video Length Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Video Length Analysis</CardTitle>
              <CardDescription>Performance metrics by video duration</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={contentData.videoLength.distribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="range" stroke="#6B7280" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#6B7280" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#6B7280" fontSize={12} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="count" fill="#9333EA" name="Video Count" />
                  <Bar yAxisId="right" dataKey="avgCompletion" fill="#10B981" name="Avg Completion %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Hourly Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Hourly View Distribution</CardTitle>
                <CardDescription>When your videos are watched most</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={contentData.audienceEngagement.hourlyActivity}>
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#EC4899" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#EC4899" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="hour" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Area 
                      type="monotone" 
                      dataKey="views" 
                      stroke="#EC4899" 
                      fillOpacity={1} 
                      fill="url(#colorViews)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            {/* Day of Week Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance Pattern</CardTitle>
                <CardDescription>Video views by day of week</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={contentData.audienceEngagement.dayOfWeek}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
                    <YAxis stroke="#6B7280" fontSize={12} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="views" fill="#3B82F6" radius={[8, 8, 0, 0]}>
                      {contentData.audienceEngagement.dayOfWeek.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={entry.views > 2500 ? '#10B981' : '#3B82F6'} 
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="engagement" className="space-y-6">
          {/* Engagement Overview */}
          <div className="grid lg:grid-cols-4 gap-4">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <ThumbsUp className="h-5 w-5 text-blue-600" />
                <span className="text-xs text-green-600">+12%</span>
              </div>
              <p className="text-2xl font-bold">8,245</p>
              <p className="text-sm text-gray-600">Total Likes</p>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <MessageCircle className="h-5 w-5 text-purple-600" />
                <span className="text-xs text-green-600">+8%</span>
              </div>
              <p className="text-2xl font-bold">1,832</p>
              <p className="text-sm text-gray-600">Comments</p>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Share2 className="h-5 w-5 text-pink-600" />
                <span className="text-xs text-green-600">+15%</span>
              </div>
              <p className="text-2xl font-bold">3,421</p>
              <p className="text-sm text-gray-600">Shares</p>
            </Card>
            
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Activity className="h-5 w-5 text-green-600" />
                <span className="text-xs text-red-600">-2%</span>
              </div>
              <p className="text-2xl font-bold">68%</p>
              <p className="text-sm text-gray-600">Avg Completion</p>
            </Card>
          </div>
          
          {/* Detailed Engagement Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>Engagement Funnel</CardTitle>
              <CardDescription>How viewers interact with your content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Views</span>
                    <span>45,280 (100%)</span>
                  </div>
                  <Progress value={100} className="h-3" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Watched 50%+</span>
                    <span>30,789 (68%)</span>
                  </div>
                  <Progress value={68} className="h-3" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Completed</span>
                    <span>20,376 (45%)</span>
                  </div>
                  <Progress value={45} className="h-3" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Engaged (Like/Comment/Share)</span>
                    <span>3,848 (8.5%)</span>
                  </div>
                  <Progress value={8.5} className="h-3" />
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Converted to Booking</span>
                    <span>452 (1%)</span>
                  </div>
                  <Progress value={1} className="h-3" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}