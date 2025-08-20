"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  Flag,
  Globe,
  MessageSquare,
  Minus,
  Server,
  Shield,
  TrendingDown,
  TrendingUp,
  Users,
  Video,
  Zap,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  ChevronRight,
  Bell,
  Target
} from "lucide-react"

interface MetricCard {
  title: string
  value: string | number
  change: number
  trend: "up" | "down" | "stable"
  icon: React.ElementType
  color: string
  description: string
  target?: number
  actionRequired?: boolean
}

interface Alert {
  id: string
  type: "critical" | "warning" | "info" | "success"
  title: string
  message: string
  timestamp: string
  actionUrl?: string
  dismissed: boolean
}

interface ActivityItem {
  id: string
  type: "user" | "creator" | "content" | "financial" | "system"
  action: string
  user: string
  target?: string
  timestamp: string
  severity: "low" | "medium" | "high"
}

interface QuickAction {
  title: string
  description: string
  icon: React.ElementType
  href: string
  badge?: number
  urgent?: boolean
}

const keyMetrics: MetricCard[] = [
  {
    title: "Platform Health",
    value: "99.97%",
    change: 0.02,
    trend: "up",
    icon: Activity,
    color: "text-green-600",
    description: "System uptime last 24h",
    target: 99.9,
    actionRequired: false
  },
  {
    title: "Active Users",
    value: "8,934",
    change: 12.5,
    trend: "up", 
    icon: Users,
    color: "text-blue-600",
    description: "Currently online",
    target: 10000,
    actionRequired: false
  },
  {
    title: "Revenue Today",
    value: "$24,850",
    change: 8.3,
    trend: "up",
    icon: DollarSign,
    color: "text-green-600",
    description: "vs yesterday",
    target: 25000,
    actionRequired: false
  },
  {
    title: "Content Issues",
    value: 23,
    change: -15.2,
    trend: "down",
    icon: Flag,
    color: "text-orange-600",
    description: "Flagged items",
    target: 10,
    actionRequired: true
  },
  {
    title: "Support Tickets",
    value: 47,
    change: 5.8,
    trend: "up",
    icon: MessageSquare,
    color: "text-yellow-600",
    description: "Open tickets",
    target: 30,
    actionRequired: true
  },
  {
    title: "Transaction Success",
    value: "94.2%",
    change: -1.2,
    trend: "down",
    icon: CreditCard,
    color: "text-red-600",
    description: "Success rate",
    target: 95,
    actionRequired: true
  }
]

const realtimeAlerts: Alert[] = [
  {
    id: "1",
    type: "critical",
    title: "Payment Gateway Issue",
    message: "Stripe webhook failures detected - 15 failed transactions in last hour",
    timestamp: "2 min ago",
    actionUrl: "/admin/finance",
    dismissed: false
  },
  {
    id: "2", 
    type: "warning",
    title: "High Storage Usage",
    message: "Video storage at 78% capacity - consider archiving old content",
    timestamp: "5 min ago",
    actionUrl: "/admin/system/storage",
    dismissed: false
  },
  {
    id: "3",
    type: "info",
    title: "New Creator Applications",
    message: "8 new creator applications pending review",
    timestamp: "10 min ago",
    actionUrl: "/admin/creators/pending",
    dismissed: false
  }
]

const recentActivity: ActivityItem[] = [
  {
    id: "1",
    type: "user",
    action: "User suspended",
    user: "Sarah Chen",
    target: "john.doe@email.com",
    timestamp: "2 min ago",
    severity: "high"
  },
  {
    id: "2",
    type: "financial",
    action: "Large payout processed",
    user: "Elena Rodriguez",
    target: "$5,230.00",
    timestamp: "5 min ago",
    severity: "medium"
  },
  {
    id: "3",
    type: "content",
    action: "Content flagged",
    user: "Auto-Moderation",
    target: "Video #8901",
    timestamp: "8 min ago",
    severity: "medium"
  },
  {
    id: "4",
    type: "creator",
    action: "Creator verified",
    user: "Marcus Johnson",
    target: "DJ Mike T",
    timestamp: "12 min ago",
    severity: "low"
  },
  {
    id: "5",
    type: "system",
    action: "Database backup completed",
    user: "System",
    target: "Primary DB",
    timestamp: "15 min ago",
    severity: "low"
  }
]

const quickActions: QuickAction[] = [
  {
    title: "Review Flagged Content",
    description: "23 items need immediate attention",
    icon: Flag,
    href: "/admin/moderation",
    badge: 23,
    urgent: true
  },
  {
    title: "Approve Creators",
    description: "8 applications pending",
    icon: Users,
    href: "/admin/creators/pending",
    badge: 8,
    urgent: false
  },
  {
    title: "Process Payouts",
    description: "Weekly creator payments",
    icon: DollarSign,
    href: "/admin/finance/payouts",
    badge: 156,
    urgent: false
  },
  {
    title: "Support Tickets",
    description: "47 open tickets",
    icon: MessageSquare,
    href: "/admin/support",
    badge: 47,
    urgent: true
  }
]

export function DashboardOverview() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const handleDismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => [...prev, alertId])
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  const getTrendIcon = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return <ArrowUp className="h-3 w-3 text-green-600" />
      case "down":
        return <ArrowDown className="h-3 w-3 text-red-600" />
      case "stable":
        return <Minus className="h-3 w-3 text-gray-600" />
    }
  }

  const getTrendColor = (trend: "up" | "down" | "stable") => {
    switch (trend) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      case "stable":
        return "text-gray-600"
    }
  }

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "info":
        return <AlertCircle className="h-4 w-4 text-blue-600" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
    }
  }

  const getAlertBorderColor = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return "border-red-200"
      case "warning":
        return "border-yellow-200"
      case "info":
        return "border-blue-200"
      case "success":
        return "border-green-200"
    }
  }

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "user":
        return <Users className="h-3 w-3" />
      case "creator":
        return <Video className="h-3 w-3" />
      case "content":
        return <Flag className="h-3 w-3" />
      case "financial":
        return <DollarSign className="h-3 w-3" />
      case "system":
        return <Server className="h-3 w-3" />
    }
  }

  const getActivityColor = (severity: ActivityItem["severity"]) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-blue-100 text-blue-800"
    }
  }

  const visibleAlerts = realtimeAlerts.filter(alert => !dismissedAlerts.includes(alert.id))

  return (
    <div className="space-y-6">
      {/* Header with Time and Refresh */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Command Center</h1>
          <p className="text-gray-600">
            {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          disabled={isRefreshing}
          variant="outline"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Real-time Alerts */}
      {visibleAlerts.length > 0 && (
        <div className="space-y-3">
          {visibleAlerts.map((alert) => (
            <Alert key={alert.id} className={getAlertBorderColor(alert.type)}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <AlertTitle className="text-sm font-medium">{alert.title}</AlertTitle>
                    <AlertDescription className="text-sm text-gray-600 mt-1">
                      {alert.message}
                    </AlertDescription>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">{alert.timestamp}</span>
                      {alert.actionUrl && (
                        <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View Details
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleDismissAlert(alert.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ×
                </Button>
              </div>
            </Alert>
          ))}
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {keyMetrics.map((metric) => {
          const Icon = metric.icon
          const progressValue = metric.target ? (Number(metric.value.toString().replace(/[^0-9.]/g, '')) / metric.target) * 100 : 0
          
          return (
            <Card key={metric.title} className={`${metric.actionRequired ? 'ring-2 ring-orange-200' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg bg-gray-100`}>
                      <Icon className={`h-5 w-5 ${metric.color}`} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                    </div>
                  </div>
                  {metric.actionRequired && (
                    <Badge variant="destructive" className="text-xs">
                      Action Required
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">{metric.description}</span>
                    <div className={`flex items-center space-x-1 ${getTrendColor(metric.trend)}`}>
                      {getTrendIcon(metric.trend)}
                      <span>{Math.abs(metric.change)}%</span>
                    </div>
                  </div>
                  
                  {metric.target && (
                    <div className="space-y-1">
                      <Progress value={Math.min(progressValue, 100)} className="h-2" />
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Current: {metric.value}</span>
                        <span>Target: {metric.target.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Dashboard Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Activity Timeline */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Real-time Activity</CardTitle>
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => {
                  const ActivityIcon = getActivityIcon(activity.type)
                  return (
                    <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                      <div className="flex-shrink-0 mt-1">
                        <div className="p-1 rounded-full bg-gray-100">
                          <ActivityIcon />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {activity.action}
                          </p>
                          <Badge className={`text-xs ${getActivityColor(activity.severity)}`}>
                            {activity.severity}
                          </Badge>
                        </div>
                        <div className="mt-1 text-sm text-gray-600">
                          <span className="font-medium">{activity.user}</span>
                          {activity.target && (
                            <>
                              <span className="mx-2">→</span>
                              <span className="font-medium">{activity.target}</span>
                            </>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">{activity.timestamp}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Critical tasks requiring attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {quickActions.map((action) => {
                  const ActionIcon = action.icon
                  return (
                    <div 
                      key={action.title}
                      className={`p-4 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                        action.urgent ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <ActionIcon className="h-5 w-5 text-gray-600" />
                          <span className="font-medium text-sm">{action.title}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {action.badge && (
                            <Badge variant={action.urgent ? "destructive" : "secondary"} className="text-xs">
                              {action.badge}
                            </Badge>
                          )}
                          <ChevronRight className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                      <p className="text-xs text-gray-600">{action.description}</p>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Charts Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Performance</CardTitle>
          <CardDescription>Real-time system metrics and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">Interactive performance charts</p>
              <p className="text-sm text-gray-500">Real-time metrics visualization would be displayed here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}