"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Users,
  Video,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  MessageSquare,
  Activity
} from "lucide-react"
import { useCreatorRealStats } from "@/hooks/use-creator-real-stats"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

export function CreatorRealDashboard() {
  const { 
    stats, 
    analytics, 
    pendingRequests, 
    topVideos, 
    weekGrowth, 
    monthGrowth,
    loading, 
    error, 
    refresh 
  } = useCreatorRealStats()
  
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  const handleRefresh = async () => {
    setIsRefreshing(true)
    await refresh()
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  // Listen for real-time notifications
  useEffect(() => {
    const audio = new Audio('/sounds/notification.mp3')
    audio.volume = 0.5
    
    // Play sound when new order arrives
    if (pendingRequests.length > 0) {
      const latestOrder = pendingRequests[0]
      const orderTime = new Date(latestOrder.createdAt).getTime()
      const now = Date.now()
      
      // If order is less than 30 seconds old, it's likely new
      if (now - orderTime < 30000) {
        audio.play().catch(console.log)
      }
    }
  }, [pendingRequests.length])

  if (loading) {
    return <DashboardSkeleton />
  }

  if (error) {
    return (
      <Alert className="m-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load dashboard data. Please try refreshing.
          <Button 
            onClick={handleRefresh} 
            variant="link" 
            className="ml-2 p-0 h-auto"
          >
            Refresh
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Refresh */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Creator Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time statistics and order management
          </p>
        </div>
        <Button 
          onClick={handleRefresh}
          variant="outline"
          size="sm"
          disabled={isRefreshing}
        >
          <RefreshCw className={cn("h-4 w-4 mr-2", isRefreshing && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Earnings"
          value={`$${stats?.totalEarnings.toFixed(2) || '0.00'}`}
          description={`${monthGrowth > 0 ? '+' : ''}${monthGrowth}% from last month`}
          icon={DollarSign}
          trend={monthGrowth}
        />
        
        <MetricCard
          title="Pending Requests"
          value={stats?.pendingRequests || 0}
          description={`${pendingRequests.length} need action`}
          icon={Clock}
          highlight={pendingRequests.length > 0}
        />
        
        <MetricCard
          title="Completed Videos"
          value={stats?.completedVideos || 0}
          description={`${stats?.completionRate.toFixed(0)}% completion rate`}
          icon={CheckCircle2}
        />
        
        <MetricCard
          title="Average Rating"
          value={stats?.averageRating.toFixed(1) || '0.0'}
          description={`From ${stats?.totalOrders || 0} total orders`}
          icon={Star}
        />
      </div>

      {/* Earnings Overview */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Earnings Overview
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">This Week</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">${stats?.weeklyEarnings.toFixed(2) || '0.00'}</span>
                <Badge variant={weekGrowth > 0 ? "default" : "secondary"}>
                  {weekGrowth > 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {Math.abs(weekGrowth)}%
                </Badge>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">This Month</span>
              <div className="flex items-center gap-2">
                <span className="font-semibold">${stats?.monthlyEarnings.toFixed(2) || '0.00'}</span>
                <Badge variant={monthGrowth > 0 ? "default" : "secondary"}>
                  {monthGrowth > 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                  {Math.abs(monthGrowth)}%
                </Badge>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Today</span>
              <span className="font-semibold">${stats?.todayEarnings.toFixed(2) || '0.00'}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Performance Metrics
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Completion Rate</span>
              <Badge variant="outline">{stats?.completionRate.toFixed(0)}%</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Acceptance Rate</span>
              <Badge variant="outline">{stats?.acceptanceRate.toFixed(0)}%</Badge>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total Orders</span>
              <span className="font-semibold">{stats?.totalOrders || 0}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Pending Requests
            {pendingRequests.length > 0 && (
              <Badge variant="destructive">{pendingRequests.length} pending</Badge>
            )}
          </CardTitle>
          <CardDescription>
            Video requests awaiting your action
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingRequests.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Video className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No pending requests at the moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingRequests.slice(0, 5).map((request) => (
                <div 
                  key={request.id} 
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{request.occasion}</h4>
                      <Badge variant={request.status === 'pending' ? 'destructive' : 'default'} className="text-xs">
                        {request.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      For {request.recipient} • From {request.fanName}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold">${request.price.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Your earnings</p>
                  </div>
                </div>
              ))}
              
              {pendingRequests.length > 5 && (
                <Button variant="outline" className="w-full">
                  View all {pendingRequests.length} requests
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Completed Videos */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Completed Videos</CardTitle>
          <CardDescription>
            Your latest delivered videos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {topVideos.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No completed videos yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topVideos.map((video) => (
                <div 
                  key={video.id} 
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{video.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      For {video.fanName} • {video.completedAt && formatDistanceToNow(new Date(video.completedAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">${video.earnings.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Earned</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

interface MetricCardProps {
  title: string
  value: string | number
  description: string
  icon: React.ElementType
  trend?: number
  highlight?: boolean
}

function MetricCard({ 
  title, 
  value, 
  description, 
  icon: Icon, 
  trend, 
  highlight 
}: MetricCardProps) {
  return (
    <Card className={cn(highlight && "border-destructive")}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={cn("h-4 w-4 text-muted-foreground", highlight && "text-destructive")} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          {trend !== undefined && (
            trend > 0 ? 
              <ArrowUpRight className="h-3 w-3 text-green-600" /> : 
              <ArrowDownRight className="h-3 w-3 text-red-600" />
          )}
          {description}
        </p>
      </CardContent>
    </Card>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-2" />
              <Skeleton className="h-3 w-48" />
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...Array(3)].map((_, j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}