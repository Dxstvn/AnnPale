"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  TrendingUp, 
  TrendingDown, 
  Star, 
  Video, 
  DollarSign,
  ArrowUp,
  ArrowDown,
  Calendar,
  Award,
  Users,
  Eye
} from "lucide-react"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface EarningsData {
  day: string
  amount: number
  change: number
}

interface VideoPerformance {
  id: number
  title: string
  views: number
  likes: number
  earnings: number
  rating: number
}

interface PerformanceOverviewProps {
  weeklyEarnings: EarningsData[]
  completionRate: number
  ratingTrend: number
  averageRating: number
  topVideos: VideoPerformance[]
  totalViews: number
  repeatCustomers: number
  onViewAnalytics?: () => void
}

export function PerformanceOverview({
  weeklyEarnings,
  completionRate,
  ratingTrend,
  averageRating,
  topVideos,
  totalViews,
  repeatCustomers,
  onViewAnalytics
}: PerformanceOverviewProps) {
  const totalWeeklyEarnings = weeklyEarnings.reduce((sum, day) => sum + day.amount, 0)
  const weeklyGrowth = weeklyEarnings.length > 1 
    ? ((weeklyEarnings[weeklyEarnings.length - 1].amount - weeklyEarnings[0].amount) / weeklyEarnings[0].amount) * 100 
    : 0

  const maxEarnings = Math.max(...weeklyEarnings.map(d => d.amount))

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Overview</h2>
          <p className="text-sm text-gray-600">Your weekly insights and trends</p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/creator/analytics">
            Detailed Analytics
          </Link>
        </Button>
      </div>

      {/* Weekly Earnings Graph */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Weekly Earnings
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge 
                className={cn(
                  weeklyGrowth >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                )}
              >
                {weeklyGrowth >= 0 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(weeklyGrowth).toFixed(1)}%
              </Badge>
              <span className="text-2xl font-bold">${totalWeeklyEarnings}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Simple Bar Chart */}
            <div className="grid grid-cols-7 gap-2 h-32">
              {weeklyEarnings.map((day, index) => (
                <div key={index} className="flex flex-col items-center justify-end space-y-1">
                  <div className="text-xs font-medium text-gray-600">
                    ${day.amount}
                  </div>
                  <div 
                    className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-md min-h-[4px]"
                    style={{ 
                      height: `${(day.amount / maxEarnings) * 100}%` 
                    }}
                  />
                  <div className="text-xs text-gray-500 font-medium">
                    {day.day}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Chart Legend */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t">
              <div className="text-center">
                <p className="text-xs text-gray-500">Best Day</p>
                <p className="font-semibold">${Math.max(...weeklyEarnings.map(d => d.amount))}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Average</p>
                <p className="font-semibold">${Math.round(totalWeeklyEarnings / 7)}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500">Growth</p>
                <p className={cn(
                  "font-semibold",
                  weeklyGrowth >= 0 ? "text-green-600" : "text-red-600"
                )}>
                  {weeklyGrowth >= 0 ? "+" : ""}{weeklyGrowth.toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Completion Rate */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Award className="h-6 w-6 text-blue-600" />
              <Badge className="bg-blue-100 text-blue-800">
                {completionRate >= 95 ? "Excellent" : completionRate >= 85 ? "Good" : "Needs Improvement"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Completion Rate</p>
              <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
              <Progress value={completionRate} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        {/* Rating Trend */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Star className="h-6 w-6 text-yellow-600" />
              <div className="flex items-center gap-1">
                {ratingTrend > 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : ratingTrend < 0 ? (
                  <TrendingDown className="h-4 w-4 text-red-600" />
                ) : null}
                <span className={cn(
                  "text-sm font-medium",
                  ratingTrend > 0 ? "text-green-600" : ratingTrend < 0 ? "text-red-600" : "text-gray-600"
                )}>
                  {ratingTrend > 0 ? "+" : ""}{ratingTrend.toFixed(1)}
                </span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{averageRating}</p>
              <div className="flex items-center mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={cn(
                      "h-4 w-4",
                      star <= averageRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                    )}
                  />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Views */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Eye className="h-6 w-6 text-purple-600" />
              <Badge className="bg-purple-100 text-purple-800">This Week</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{totalViews.toLocaleString()}</p>
              <p className="text-xs text-gray-500 mt-1">+12% from last week</p>
            </div>
          </CardContent>
        </Card>

        {/* Repeat Customers */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <Users className="h-6 w-6 text-green-600" />
              <Badge className="bg-green-100 text-green-800">Retention</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Repeat Customers</p>
              <p className="text-2xl font-bold text-gray-900">{repeatCustomers}%</p>
              <p className="text-xs text-gray-500 mt-1">Above average</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Videos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Top Performing Videos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topVideos.map((video, index) => (
              <div key={video.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                    index === 0 ? "bg-yellow-100 text-yellow-800" :
                    index === 1 ? "bg-gray-100 text-gray-700" :
                    index === 2 ? "bg-orange-100 text-orange-800" :
                    "bg-blue-100 text-blue-800"
                  )}>
                    #{index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{video.title}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>{video.views} views</span>
                      <span>{video.likes} likes</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{video.rating}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">${video.earnings}</p>
                  <p className="text-xs text-gray-500">earned</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}