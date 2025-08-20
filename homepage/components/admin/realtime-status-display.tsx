"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Server,
  Database,
  Globe,
  CreditCard,
  Video,
  Wifi,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  RefreshCw,
  Zap,
  Cloud,
  Shield,
  Clock,
  TrendingUp,
  TrendingDown,
  Gauge,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Lock
} from "lucide-react"
import { cn } from "@/lib/utils"

interface ServiceStatus {
  id: string
  name: string
  status: "operational" | "degraded" | "down" | "maintenance"
  uptime: number
  responseTime: number
  icon: any
  lastChecked: string
  dependencies: string[]
  metrics?: {
    requests?: number
    errors?: number
    latency?: number
  }
}

interface SystemMetric {
  name: string
  value: number
  unit: string
  threshold: {
    warning: number
    critical: number
  }
  trend: "up" | "down" | "stable"
}

interface HealthCheck {
  service: string
  endpoint: string
  status: "healthy" | "unhealthy" | "unknown"
  responseTime: number
  lastCheck: string
  nextCheck: string
}

const services: ServiceStatus[] = [
  {
    id: "web-server",
    name: "Web Servers",
    status: "operational",
    uptime: 99.99,
    responseTime: 142,
    icon: Server,
    lastChecked: "10 seconds ago",
    dependencies: ["database", "cdn"],
    metrics: {
      requests: 12453,
      errors: 3,
      latency: 142
    }
  },
  {
    id: "database",
    name: "Database Cluster",
    status: "operational",
    uptime: 99.95,
    responseTime: 23,
    icon: Database,
    lastChecked: "5 seconds ago",
    dependencies: [],
    metrics: {
      requests: 8932,
      errors: 0,
      latency: 23
    }
  },
  {
    id: "cdn",
    name: "CDN Network",
    status: "operational",
    uptime: 100,
    responseTime: 89,
    icon: Globe,
    lastChecked: "8 seconds ago",
    dependencies: [],
    metrics: {
      requests: 45230,
      errors: 12,
      latency: 89
    }
  },
  {
    id: "payment",
    name: "Payment Gateway",
    status: "operational",
    uptime: 99.98,
    responseTime: 342,
    icon: CreditCard,
    lastChecked: "15 seconds ago",
    dependencies: ["web-server"],
    metrics: {
      requests: 523,
      errors: 0,
      latency: 342
    }
  },
  {
    id: "video-streaming",
    name: "Video Streaming",
    status: "degraded",
    uptime: 98.5,
    responseTime: 523,
    icon: Video,
    lastChecked: "3 seconds ago",
    dependencies: ["cdn", "storage"],
    metrics: {
      requests: 2341,
      errors: 45,
      latency: 523
    }
  },
  {
    id: "api",
    name: "API Services",
    status: "operational",
    uptime: 99.97,
    responseTime: 156,
    icon: Network,
    lastChecked: "7 seconds ago",
    dependencies: ["database", "cache"],
    metrics: {
      requests: 34521,
      errors: 8,
      latency: 156
    }
  }
]

const systemMetrics: SystemMetric[] = [
  {
    name: "CPU Usage",
    value: 42,
    unit: "%",
    threshold: { warning: 70, critical: 90 },
    trend: "stable"
  },
  {
    name: "Memory Usage",
    value: 68,
    unit: "%",
    threshold: { warning: 80, critical: 95 },
    trend: "up"
  },
  {
    name: "Disk I/O",
    value: 234,
    unit: "MB/s",
    threshold: { warning: 500, critical: 800 },
    trend: "down"
  },
  {
    name: "Network Traffic",
    value: 1.2,
    unit: "GB/s",
    threshold: { warning: 2, critical: 3 },
    trend: "up"
  }
]

const healthChecks: HealthCheck[] = [
  {
    service: "API Gateway",
    endpoint: "/health",
    status: "healthy",
    responseTime: 45,
    lastCheck: "2024-03-15T10:30:00Z",
    nextCheck: "2024-03-15T10:31:00Z"
  },
  {
    service: "Auth Service",
    endpoint: "/auth/health",
    status: "healthy",
    responseTime: 32,
    lastCheck: "2024-03-15T10:30:00Z",
    nextCheck: "2024-03-15T10:31:00Z"
  },
  {
    service: "Video Service",
    endpoint: "/video/health",
    status: "unhealthy",
    responseTime: 1523,
    lastCheck: "2024-03-15T10:30:00Z",
    nextCheck: "2024-03-15T10:30:30Z"
  }
]

export function RealtimeStatusDisplay() {
  const [refreshing, setRefreshing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        setLastUpdate(new Date())
      }, 30000) // Update every 30 seconds

      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
      case "healthy":
        return "bg-green-100 text-green-800"
      case "degraded":
        return "bg-yellow-100 text-yellow-800"
      case "down":
      case "unhealthy":
        return "bg-red-100 text-red-800"
      case "maintenance":
        return "bg-blue-100 text-blue-800"
      case "unknown":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "operational":
      case "healthy":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "degraded":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />
      case "down":
      case "unhealthy":
        return <XCircle className="h-4 w-4 text-red-600" />
      case "maintenance":
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <TrendingUp className="h-3 w-3 text-red-600" />
      case "down": return <TrendingDown className="h-3 w-3 text-green-600" />
      default: return <Activity className="h-3 w-3 text-gray-600" />
    }
  }

  const getMetricStatus = (metric: SystemMetric) => {
    if (metric.value >= metric.threshold.critical) return "critical"
    if (metric.value >= metric.threshold.warning) return "warning"
    return "normal"
  }

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setLastUpdate(new Date())
      setRefreshing(false)
    }, 1000)
  }

  const overallHealth = services.every(s => s.status === "operational") 
    ? "All Systems Operational" 
    : services.some(s => s.status === "down")
    ? "System Outage Detected"
    : "Partial Service Degradation"

  const healthStatus = services.every(s => s.status === "operational") 
    ? "operational" 
    : services.some(s => s.status === "down")
    ? "down"
    : "degraded"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">System Status</h2>
          <p className="text-gray-600">Real-time platform health monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Last updated: {lastUpdate.toLocaleTimeString()}
          </Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
          </Button>
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={refreshing}
          >
            <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status */}
      <Card className={cn(
        "border-2",
        healthStatus === "operational" && "border-green-500 bg-green-50",
        healthStatus === "degraded" && "border-yellow-500 bg-yellow-50",
        healthStatus === "down" && "border-red-500 bg-red-50"
      )}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon(healthStatus)}
              <div>
                <h3 className="text-xl font-bold">{overallHealth}</h3>
                <p className="text-sm text-gray-600">
                  {services.filter(s => s.status === "operational").length} of {services.length} services operational
                </p>
              </div>
            </div>
            <Badge className={cn("text-lg px-4 py-2", getStatusColor(healthStatus))}>
              {healthStatus.toUpperCase()}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Service Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => {
          const Icon = service.icon
          return (
            <Card key={service.id} className="relative overflow-hidden">
              <div className={cn(
                "absolute top-0 left-0 w-full h-1",
                service.status === "operational" && "bg-green-500",
                service.status === "degraded" && "bg-yellow-500",
                service.status === "down" && "bg-red-500",
                service.status === "maintenance" && "bg-blue-500"
              )} />
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-gray-600" />
                    <div>
                      <h4 className="font-medium">{service.name}</h4>
                      <p className="text-xs text-gray-500">{service.lastChecked}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(service.status)}>
                    {service.status}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Uptime</span>
                    <span className="font-medium">{service.uptime}%</span>
                  </div>
                  <Progress value={service.uptime} className="h-1" />
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Response Time</span>
                    <span className={cn(
                      "font-medium",
                      service.responseTime > 500 && "text-red-600",
                      service.responseTime > 200 && service.responseTime <= 500 && "text-yellow-600",
                      service.responseTime <= 200 && "text-green-600"
                    )}>
                      {service.responseTime}ms
                    </span>
                  </div>

                  {service.metrics && (
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t text-xs">
                      <div className="text-center">
                        <p className="text-gray-500">Requests</p>
                        <p className="font-medium">{(service.metrics.requests / 1000).toFixed(1)}K</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Errors</p>
                        <p className="font-medium">{service.metrics.errors}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-500">Latency</p>
                        <p className="font-medium">{service.metrics.latency}ms</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* System Resources */}
      <Card>
        <CardHeader>
          <CardTitle>System Resources</CardTitle>
          <CardDescription>Real-time resource utilization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemMetrics.map((metric) => {
              const status = getMetricStatus(metric)
              return (
                <div key={metric.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{metric.name}</span>
                    {getTrendIcon(metric.trend)}
                  </div>
                  <div className="flex items-end gap-2">
                    <span className={cn(
                      "text-2xl font-bold",
                      status === "critical" && "text-red-600",
                      status === "warning" && "text-yellow-600",
                      status === "normal" && "text-green-600"
                    )}>
                      {metric.value}
                    </span>
                    <span className="text-sm text-gray-500 pb-1">{metric.unit}</span>
                  </div>
                  <Progress 
                    value={(metric.value / metric.threshold.critical) * 100} 
                    className={cn(
                      "h-2",
                      status === "critical" && "bg-red-100",
                      status === "warning" && "bg-yellow-100"
                    )}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Warning: {metric.threshold.warning}{metric.unit}</span>
                    <span>Critical: {metric.threshold.critical}{metric.unit}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Health Checks */}
      <Card>
        <CardHeader>
          <CardTitle>Service Health Checks</CardTitle>
          <CardDescription>Endpoint monitoring results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {healthChecks.map((check) => (
              <div key={check.service} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(check.status)}
                  <div>
                    <p className="font-medium">{check.service}</p>
                    <p className="text-sm text-gray-600">{check.endpoint}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{check.responseTime}ms</p>
                    <p className="text-xs text-gray-500">Response time</p>
                  </div>
                  <Badge className={getStatusColor(check.status)}>
                    {check.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}