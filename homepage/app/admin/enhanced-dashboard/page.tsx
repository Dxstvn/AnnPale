"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Activity,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  BarChart3,
  CheckCircle,
  Clock,
  CreditCard,
  Database,
  DollarSign,
  FileText,
  Globe,
  HardDrive,
  Home,
  Lock,
  MemoryStick,
  MessageSquare,
  Monitor,
  MoreVertical,
  Network,
  Package,
  Play,
  RefreshCw,
  Server,
  Settings,
  Shield,
  Terminal,
  TrendingUp,
  Users,
  Wifi,
  XCircle,
  Zap,
  Eye,
  Ban,
  UserCheck,
  Flag,
  Search,
  Filter,
  Download,
  Upload,
  Cpu
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"

// Translations
const adminTranslations: Record<string, Record<string, string>> = {
  command_center: {
    en: "Command Center",
    fr: "Centre de commande",
    ht: "Sant kòmandman"
  },
  system_health: {
    en: "System Health",
    fr: "Santé du système",
    ht: "Sante sistèm"
  },
  critical_alerts: {
    en: "Critical Alerts",
    fr: "Alertes critiques",
    ht: "Alèt kritik"
  },
  real_time_metrics: {
    en: "Real-time Metrics",
    fr: "Métriques en temps réel",
    ht: "Metrik an tan reyèl"
  },
  active_users: {
    en: "Active Users",
    fr: "Utilisateurs actifs",
    ht: "Itilizatè aktif"
  },
  today_revenue: {
    en: "Today's Revenue",
    fr: "Revenus d'aujourd'hui",
    ht: "Revni jodi a"
  },
  pending_reviews: {
    en: "Pending Reviews",
    fr: "Avis en attente",
    ht: "Revi k ap tann"
  },
  system_uptime: {
    en: "System Uptime",
    fr: "Disponibilité du système",
    ht: "Tan sistèm disponib"
  },
  quick_actions: {
    en: "Quick Actions",
    fr: "Actions rapides",
    ht: "Aksyon rapid"
  },
  platform_overview: {
    en: "Platform Overview",
    fr: "Aperçu de la plateforme",
    ht: "Apèsi platfòm"
  },
  security_status: {
    en: "Security Status",
    fr: "État de sécurité",
    ht: "Estati sekirite"
  },
  performance_metrics: {
    en: "Performance Metrics",
    fr: "Métriques de performance",
    ht: "Metrik pèfòmans"
  }
}

// Mock real-time data
const initialRealtimeData = {
  activeUsers: 1234,
  todayRevenue: 45678,
  pendingReviews: 23,
  systemUptime: 99.98,
  cpuUsage: 45,
  memoryUsage: 62,
  diskUsage: 71,
  databaseConnections: 127,
  networkLatency: 23
}

// System metrics history
const systemMetricsHistory = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  cpu: Math.floor(Math.random() * 40 + 30),
  memory: Math.floor(Math.random() * 30 + 50),
  network: Math.floor(Math.random() * 20 + 10)
}))

// Traffic sources
const trafficSources = [
  { name: "Direct", value: 35, color: "#8B5CF6" },
  { name: "Social", value: 25, color: "#EC4899" },
  { name: "Search", value: 20, color: "#3B82F6" },
  { name: "Email", value: 15, color: "#10B981" },
  { name: "Other", value: 5, color: "#F59E0B" }
]

// Recent activities
const recentActivities = [
  {
    id: "1",
    type: "user",
    message: "New creator registration: Sarah Johnson",
    time: new Date(Date.now() - 5 * 60 * 1000),
    status: "success"
  },
  {
    id: "2",
    type: "payment",
    message: "Payment processed: $195 from Michael Chen",
    time: new Date(Date.now() - 12 * 60 * 1000),
    status: "success"
  },
  {
    id: "3",
    type: "security",
    message: "Failed login attempt detected from IP 192.168.1.1",
    time: new Date(Date.now() - 25 * 60 * 1000),
    status: "warning"
  },
  {
    id: "4",
    type: "content",
    message: "Video flagged for review: ID #V12345",
    time: new Date(Date.now() - 45 * 60 * 1000),
    status: "critical"
  },
  {
    id: "5",
    type: "system",
    message: "Database backup completed successfully",
    time: new Date(Date.now() - 60 * 60 * 1000),
    status: "success"
  }
]

// Critical alerts
const criticalAlerts = [
  {
    id: "1",
    severity: "critical",
    title: "High Memory Usage",
    description: "Memory usage exceeded 90% threshold",
    time: new Date(Date.now() - 10 * 60 * 1000),
    acknowledged: false
  },
  {
    id: "2",
    severity: "warning",
    title: "Suspicious Login Activity",
    description: "Multiple failed login attempts from single IP",
    time: new Date(Date.now() - 30 * 60 * 1000),
    acknowledged: true
  },
  {
    id: "3",
    severity: "critical",
    title: "Payment Gateway Issue",
    description: "Stripe webhook failures detected",
    time: new Date(Date.now() - 45 * 60 * 1000),
    acknowledged: false
  }
]

export default function EnhancedAdminDashboard() {
  const { language } = useLanguage()
  const [realtimeData, setRealtimeData] = useState(initialRealtimeData)
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h")
  const [alertFilter, setAlertFilter] = useState("all")
  const [terminalCommand, setTerminalCommand] = useState("")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const t = (key: string) => {
    return adminTranslations[key]?.[language] || adminTranslations[key]?.en || key
  }

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealtimeData(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        todayRevenue: prev.todayRevenue + Math.floor(Math.random() * 100),
        cpuUsage: Math.min(100, Math.max(0, prev.cpuUsage + Math.floor(Math.random() * 10 - 5))),
        memoryUsage: Math.min(100, Math.max(0, prev.memoryUsage + Math.floor(Math.random() * 6 - 3))),
        networkLatency: Math.max(1, prev.networkLatency + Math.floor(Math.random() * 4 - 2))
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const getStatusColor = (value: number, thresholds: { good: number, warning: number }) => {
    if (value >= thresholds.warning) return "text-red-500"
    if (value >= thresholds.good) return "text-yellow-500"
    return "text-green-500"
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user": return <Users className="h-4 w-4" />
      case "payment": return <CreditCard className="h-4 w-4" />
      case "security": return <Shield className="h-4 w-4" />
      case "content": return <Flag className="h-4 w-4" />
      case "system": return <Server className="h-4 w-4" />
      default: return <Activity className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-100 text-red-700 border-red-200"
      case "warning": return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "info": return "bg-blue-100 text-blue-700 border-blue-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const filteredAlerts = criticalAlerts.filter(alert => {
    if (alertFilter === "critical") return alert.severity === "critical"
    if (alertFilter === "warning") return alert.severity === "warning"
    if (alertFilter === "unacknowledged") return !alert.acknowledged
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        {/* Left Sidebar - System Health */}
        <aside className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">{t('system_health')}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRefresh}
                className={cn(isRefreshing && "animate-spin")}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>

            {/* System Metrics */}
            <div className="space-y-4">
              {/* CPU Usage */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">CPU Usage</span>
                  </div>
                  <span className={cn(
                    "text-sm font-bold",
                    getStatusColor(realtimeData.cpuUsage, { good: 70, warning: 85 })
                  )}>
                    {realtimeData.cpuUsage}%
                  </span>
                </div>
                <Progress value={realtimeData.cpuUsage} className="h-2" />
              </div>

              {/* Memory Usage */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MemoryStick className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Memory</span>
                  </div>
                  <span className={cn(
                    "text-sm font-bold",
                    getStatusColor(realtimeData.memoryUsage, { good: 75, warning: 90 })
                  )}>
                    {realtimeData.memoryUsage}%
                  </span>
                </div>
                <Progress value={realtimeData.memoryUsage} className="h-2" />
              </div>

              {/* Disk Usage */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Disk Space</span>
                  </div>
                  <span className={cn(
                    "text-sm font-bold",
                    getStatusColor(realtimeData.diskUsage, { good: 80, warning: 90 })
                  )}>
                    {realtimeData.diskUsage}%
                  </span>
                </div>
                <Progress value={realtimeData.diskUsage} className="h-2" />
              </div>

              {/* Database Connections */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Database</span>
                  </div>
                  <span className="text-sm font-bold text-green-500">
                    {realtimeData.databaseConnections}/500
                  </span>
                </div>
                <Progress value={(realtimeData.databaseConnections / 500) * 100} className="h-2" />
              </div>

              {/* Network Latency */}
              <div className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Network className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium">Network</span>
                  </div>
                  <span className={cn(
                    "text-sm font-bold",
                    realtimeData.networkLatency < 50 ? "text-green-500" : 
                    realtimeData.networkLatency < 100 ? "text-yellow-500" : "text-red-500"
                  )}>
                    {realtimeData.networkLatency}ms
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  Avg response time
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Performance History</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={systemMetricsHistory.slice(-12)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="cpu" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="memory" stroke="#EC4899" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Service Status */}
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Service Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm">API Gateway</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm">Video CDN</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm">Payment Gateway</span>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Degraded
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm">Email Service</span>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Operational
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>

        {/* Main Content - Command Center */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{t('command_center')}</h1>
              <p className="text-gray-600 mt-1">{t('real_time_metrics')}</p>
            </div>

            {/* Real-time Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('active_users')}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {realtimeData.activeUsers.toLocaleString()}
                      </p>
                      <div className="flex items-center mt-2">
                        <ArrowUp className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm text-green-600">+12.5%</span>
                      </div>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('today_revenue')}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        ${realtimeData.todayRevenue.toLocaleString()}
                      </p>
                      <div className="flex items-center mt-2">
                        <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm text-green-600">+8.3%</span>
                      </div>
                    </div>
                    <DollarSign className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border-orange-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('pending_reviews')}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {realtimeData.pendingReviews}
                      </p>
                      <div className="flex items-center mt-2">
                        <Clock className="h-4 w-4 text-orange-600 mr-1" />
                        <span className="text-sm text-orange-600">Requires action</span>
                      </div>
                    </div>
                    <Flag className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">{t('system_uptime')}</p>
                      <p className="text-3xl font-bold text-gray-900 mt-2">
                        {realtimeData.systemUptime}%
                      </p>
                      <div className="flex items-center mt-2">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-1" />
                        <span className="text-sm text-green-600">All systems go</span>
                      </div>
                    </div>
                    <Activity className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions Panel */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>{t('quick_actions')}</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" className="h-auto flex-col p-4">
                    <Ban className="h-5 w-5 mb-2 text-red-600" />
                    <span className="text-sm">Block User</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col p-4">
                    <UserCheck className="h-5 w-5 mb-2 text-green-600" />
                    <span className="text-sm">Verify Creator</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col p-4">
                    <Eye className="h-5 w-5 mb-2 text-blue-600" />
                    <span className="text-sm">Review Content</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col p-4">
                    <CreditCard className="h-5 w-5 mb-2 text-purple-600" />
                    <span className="text-sm">Process Refund</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col p-4">
                    <MessageSquare className="h-5 w-5 mb-2 text-indigo-600" />
                    <span className="text-sm">Send Notice</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col p-4">
                    <Download className="h-5 w-5 mb-2 text-gray-600" />
                    <span className="text-sm">Export Data</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col p-4">
                    <Settings className="h-5 w-5 mb-2 text-gray-600" />
                    <span className="text-sm">System Config</span>
                  </Button>
                  <Button variant="outline" className="h-auto flex-col p-4">
                    <Shield className="h-5 w-5 mb-2 text-red-600" />
                    <span className="text-sm">Security Scan</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Platform Overview Tabs */}
            <Tabs defaultValue="activity" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="traffic">Traffic</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="activity" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest platform events and actions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                          <div className={cn(
                            "p-2 rounded-full",
                            activity.status === "success" && "bg-green-100",
                            activity.status === "warning" && "bg-yellow-100",
                            activity.status === "critical" && "bg-red-100"
                          )}>
                            {getActivityIcon(activity.type)}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium">{activity.message}</p>
                            <p className="text-xs text-gray-500">
                              {format(activity.time, 'MMM d, HH:mm')}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="traffic" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Traffic Sources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                          <Pie
                            data={trafficSources}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            label
                          >
                            {trafficSources.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Geographic Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">United States</span>
                          <div className="flex items-center gap-2">
                            <Progress value={45} className="w-24 h-2" />
                            <span className="text-sm font-medium">45%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Haiti</span>
                          <div className="flex items-center gap-2">
                            <Progress value={25} className="w-24 h-2" />
                            <span className="text-sm font-medium">25%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Canada</span>
                          <div className="flex items-center gap-2">
                            <Progress value={15} className="w-24 h-2" />
                            <span className="text-sm font-medium">15%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">France</span>
                          <div className="flex items-center gap-2">
                            <Progress value={10} className="w-24 h-2" />
                            <span className="text-sm font-medium">10%</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Others</span>
                          <div className="flex items-center gap-2">
                            <Progress value={5} className="w-24 h-2" />
                            <span className="text-sm font-medium">5%</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('security_status')}</CardTitle>
                    <CardDescription>Current security posture and threats</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-4 mb-6">
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">Threat Level</span>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Low</Badge>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium">SSL Status</span>
                        </div>
                        <Badge className="bg-green-100 text-green-700">Valid</Badge>
                      </div>
                      <div className="p-4 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <AlertTriangle className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm font-medium">Failed Logins</span>
                        </div>
                        <span className="text-2xl font-bold">23</span>
                      </div>
                    </div>
                    <Alert>
                      <Shield className="h-4 w-4" />
                      <AlertTitle>Security Scan Scheduled</AlertTitle>
                      <AlertDescription>
                        Next automated security scan will run in 2 hours 34 minutes
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t('performance_metrics')}</CardTitle>
                    <CardDescription>System performance over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={systemMetricsHistory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="time" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="cpu" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="memory" stackId="1" stroke="#EC4899" fill="#EC4899" fillOpacity={0.6} />
                        <Area type="monotone" dataKey="network" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Right Sidebar - Critical Alerts */}
        <aside className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">{t('critical_alerts')}</h2>
              <Badge variant="destructive">{filteredAlerts.length}</Badge>
            </div>

            {/* Alert Filter */}
            <Select value={alertFilter} onValueChange={setAlertFilter}>
              <SelectTrigger className="mb-4">
                <SelectValue placeholder="Filter alerts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Alerts</SelectItem>
                <SelectItem value="critical">Critical Only</SelectItem>
                <SelectItem value="warning">Warnings</SelectItem>
                <SelectItem value="unacknowledged">Unacknowledged</SelectItem>
              </SelectContent>
            </Select>

            {/* Alerts List */}
            <ScrollArea className="h-[400px]">
              <div className="space-y-3">
                {filteredAlerts.map((alert) => (
                  <Alert key={alert.id} className={cn("relative", getSeverityColor(alert.severity))}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle className="pr-8">{alert.title}</AlertTitle>
                    <AlertDescription>{alert.description}</AlertDescription>
                    <div className="text-xs text-gray-500 mt-2">
                      {format(alert.time, 'HH:mm')}
                    </div>
                    {alert.acknowledged && (
                      <Badge variant="outline" className="absolute top-2 right-2 text-xs">
                        Ack
                      </Badge>
                    )}
                  </Alert>
                ))}
              </div>
            </ScrollArea>

            {/* Admin Terminal */}
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Terminal className="h-4 w-4" />
                  Admin Terminal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-3 rounded font-mono text-xs">
                  <div className="mb-2">
                    <span className="text-gray-500">admin@annpale:~$</span> status
                  </div>
                  <div className="text-gray-300 mb-2">
                    System: Operational<br/>
                    Database: Connected<br/>
                    Cache: Active<br/>
                    Queue: 12 jobs
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500">admin@annpale:~$</span>
                    <input
                      type="text"
                      className="bg-transparent outline-none flex-1 ml-2 text-green-400"
                      placeholder="Enter command..."
                      value={terminalCommand}
                      onChange={(e) => setTerminalCommand(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          console.log("Executing:", terminalCommand)
                          setTerminalCommand("")
                        }
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Info */}
            <Card className="mt-6">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Version</span>
                  <span className="font-mono">v2.4.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Environment</span>
                  <Badge variant="outline">Production</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Region</span>
                  <span>US-East-1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Deploy</span>
                  <span>2 hours ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
      </div>
    </div>
  )
}