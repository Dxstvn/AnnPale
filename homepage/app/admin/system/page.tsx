"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  Download,
  HardDrive,
  MemoryStick,
  Network,
  Package,
  Power,
  RefreshCw,
  Server,
  Settings,
  Shield,
  Trash2,
  Upload,
  Wifi,
  XCircle,
  Zap,
  ArrowUp,
  ArrowDown,
  Terminal,
  FileText,
  Play,
  Pause,
  RotateCcw
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
  Cell,
  RadialBarChart,
  RadialBar,
  Legend
} from "recharts"

// Translations
const systemTranslations: Record<string, Record<string, string>> = {
  system_health: {
    en: "System Health Monitoring",
    fr: "Surveillance de la santé du système",
    ht: "Siveyans sante sistèm"
  },
  infrastructure_status: {
    en: "Monitor and manage infrastructure health",
    fr: "Surveiller et gérer la santé de l'infrastructure",
    ht: "Siveye ak jere sante enfrastrikti"
  },
  server_status: {
    en: "Server Status",
    fr: "État du serveur",
    ht: "Estati sèvè"
  },
  database_health: {
    en: "Database Health",
    fr: "Santé de la base de données",
    ht: "Sante baz done"
  },
  network_performance: {
    en: "Network Performance",
    fr: "Performance réseau",
    ht: "Pèfòmans rezo"
  },
  storage_capacity: {
    en: "Storage Capacity",
    fr: "Capacité de stockage",
    ht: "Kapasite estokaj"
  },
  emergency_actions: {
    en: "Emergency Actions",
    fr: "Actions d'urgence",
    ht: "Aksyon ijans"
  },
  restart_services: {
    en: "Restart Services",
    fr: "Redémarrer les services",
    ht: "Rekòmanse sèvis yo"
  },
  clear_cache: {
    en: "Clear Cache",
    fr: "Vider le cache",
    ht: "Efase kach"
  },
  backup_now: {
    en: "Backup Now",
    fr: "Sauvegarder maintenant",
    ht: "Sovgade kounye a"
  },
  maintenance_mode: {
    en: "Maintenance Mode",
    fr: "Mode maintenance",
    ht: "Mòd antretyen"
  }
}

// Mock system data
const systemMetrics = {
  servers: [
    { id: "srv-001", name: "Web Server 1", status: "healthy", cpu: 45, memory: 62, uptime: "45d 12h" },
    { id: "srv-002", name: "Web Server 2", status: "healthy", cpu: 52, memory: 58, uptime: "45d 12h" },
    { id: "srv-003", name: "API Server", status: "warning", cpu: 78, memory: 85, uptime: "12d 4h" },
    { id: "srv-004", name: "Media Server", status: "healthy", cpu: 34, memory: 41, uptime: "32d 8h" }
  ],
  databases: [
    { name: "Primary DB", connections: 127, queries: 4532, latency: 12, status: "optimal" },
    { name: "Read Replica 1", connections: 89, queries: 2341, latency: 8, status: "optimal" },
    { name: "Read Replica 2", connections: 76, queries: 1987, latency: 15, status: "slow" },
    { name: "Analytics DB", connections: 23, queries: 567, latency: 22, status: "optimal" }
  ],
  storage: {
    total: 5000, // GB
    used: 3421,
    databases: 892,
    media: 2134,
    logs: 234,
    backups: 161
  },
  network: {
    bandwidth: { in: 234, out: 156 }, // Mbps
    requests: 12453,
    errors: 23,
    latency: 45
  }
}

// Performance history data
const performanceHistory = Array.from({ length: 24 }, (_, i) => ({
  time: `${i}:00`,
  cpu: Math.floor(Math.random() * 40 + 30),
  memory: Math.floor(Math.random() * 30 + 50),
  disk: Math.floor(Math.random() * 20 + 60),
  network: Math.floor(Math.random() * 50 + 100)
}))

// Storage breakdown for pie chart
const storageBreakdown = [
  { name: "Media Files", value: 2134, color: "#8B5CF6" },
  { name: "Database", value: 892, color: "#EC4899" },
  { name: "Logs", value: 234, color: "#3B82F6" },
  { name: "Backups", value: 161, color: "#10B981" },
  { name: "System", value: 1579, color: "#F59E0B" }
]

// Service dependencies
const serviceDependencies = [
  { service: "API Gateway", dependencies: ["Database", "Cache", "Auth Service"], status: "healthy" },
  { service: "Video CDN", dependencies: ["Storage", "Transcoding"], status: "healthy" },
  { service: "Payment Gateway", dependencies: ["Stripe API", "Database"], status: "degraded" },
  { service: "Email Service", dependencies: ["SMTP", "Queue"], status: "healthy" },
  { service: "Search Engine", dependencies: ["Elasticsearch", "Database"], status: "healthy" }
]

// System logs
const systemLogs = [
  { id: "1", level: "info", message: "Database backup completed successfully", timestamp: new Date(Date.now() - 30 * 60 * 1000) },
  { id: "2", level: "warning", message: "High memory usage detected on API server", timestamp: new Date(Date.now() - 45 * 60 * 1000) },
  { id: "3", level: "error", message: "Failed to connect to payment gateway", timestamp: new Date(Date.now() - 60 * 60 * 1000) },
  { id: "4", level: "info", message: "Cache cleared successfully", timestamp: new Date(Date.now() - 90 * 60 * 1000) },
  { id: "5", level: "info", message: "System health check passed", timestamp: new Date(Date.now() - 120 * 60 * 1000) }
]

export default function SystemHealthPage() {
  const { language } = useLanguage()
  const [selectedTimeRange, setSelectedTimeRange] = useState("24h")
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false)
  const [selectedServer, setSelectedServer] = useState<string | null>(null)
  const [isRestartDialogOpen, setIsRestartDialogOpen] = useState(false)
  const [isClearCacheDialogOpen, setIsClearCacheDialogOpen] = useState(false)
  const [isBackupDialogOpen, setIsBackupDialogOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [systemHealth, setSystemHealth] = useState(92)

  const t = (key: string) => {
    return systemTranslations[key]?.[language] || systemTranslations[key]?.en || key
  }

  // Calculate overall system health
  useEffect(() => {
    const avgCpu = systemMetrics.servers.reduce((acc, srv) => acc + srv.cpu, 0) / systemMetrics.servers.length
    const avgMemory = systemMetrics.servers.reduce((acc, srv) => acc + srv.memory, 0) / systemMetrics.servers.length
    const storageUsage = (systemMetrics.storage.used / systemMetrics.storage.total) * 100
    const errorRate = (systemMetrics.network.errors / systemMetrics.network.requests) * 100
    
    const health = Math.round(100 - ((avgCpu + avgMemory + storageUsage + errorRate * 10) / 4))
    setSystemHealth(Math.max(0, Math.min(100, health)))
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 2000)
  }

  const handleRestartService = () => {
    console.log("Restarting service:", selectedServer)
    setIsRestartDialogOpen(false)
  }

  const handleClearCache = () => {
    console.log("Clearing cache...")
    setIsClearCacheDialogOpen(false)
  }

  const handleBackup = () => {
    console.log("Starting backup...")
    setIsBackupDialogOpen(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
      case "optimal":
        return "text-green-500"
      case "warning":
      case "slow":
        return "text-yellow-500"
      case "critical":
      case "error":
        return "text-red-500"
      case "degraded":
        return "text-orange-500"
      default:
        return "text-gray-600 dark:text-gray-400"
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      healthy: "bg-green-100 text-green-700 border-green-200",
      optimal: "bg-green-100 text-green-700 border-green-200",
      warning: "bg-yellow-100 text-yellow-700 border-yellow-200",
      slow: "bg-yellow-100 text-yellow-700 border-yellow-200",
      critical: "bg-red-100 text-red-700 border-red-200",
      error: "bg-red-100 text-red-700 border-red-200",
      degraded: "bg-orange-100 text-orange-700 border-orange-200"
    }
    return colors[status] || "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700"
  }

  const getLogLevelIcon = (level: string) => {
    switch (level) {
      case "info":
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-600 dark:text-gray-400" />
    }
  }

  const radialData = [
    { name: "System Health", value: systemHealth, fill: systemHealth > 80 ? "#10B981" : systemHealth > 60 ? "#F59E0B" : "#EF4444" }
  ]

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{t('system_health')}</h1>
            <p className="text-gray-700 dark:text-gray-300 mt-1">{t('infrastructure_status')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h">1 Hour</SelectItem>
                <SelectItem value="24h">24 Hours</SelectItem>
                <SelectItem value="7d">7 Days</SelectItem>
                <SelectItem value="30d">30 Days</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={handleRefresh}
              className={cn(refreshing && "animate-spin")}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* System Health Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Overall Health</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={150}>
              <RadialBarChart cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" data={radialData}>
                <RadialBar dataKey="value" cornerRadius={10} fill="#8B5CF6" />
                <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-bold">
                  {systemHealth}%
                </text>
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="text-center mt-2">
              <Badge className={cn(
                "font-medium",
                systemHealth > 80 ? "bg-green-100 text-green-700" :
                systemHealth > 60 ? "bg-yellow-100 text-yellow-700" :
                "bg-red-100 text-red-700"
              )}>
                {systemHealth > 80 ? "Healthy" : systemHealth > 60 ? "Warning" : "Critical"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={150}>
              <AreaChart data={performanceHistory.slice(-12)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Area type="monotone" dataKey="cpu" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="memory" stackId="1" stroke="#EC4899" fill="#EC4899" fillOpacity={0.6} />
                <Area type="monotone" dataKey="disk" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Actions Panel */}
      <Alert className="mb-8 bg-red-50 border-red-200">
        <AlertTriangle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-900">{t('emergency_actions')}</AlertTitle>
        <AlertDescription className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Dialog open={isRestartDialogOpen} onOpenChange={setIsRestartDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {t('restart_services')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Restart Services</DialogTitle>
                  <DialogDescription>
                    This will restart selected services. Users may experience brief interruptions.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <Select onValueChange={setSelectedServer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select service to restart" />
                    </SelectTrigger>
                    <SelectContent>
                      {systemMetrics.servers.map(server => (
                        <SelectItem key={server.id} value={server.id}>
                          {server.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsRestartDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleRestartService} disabled={!selectedServer}>
                    Restart Service
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isClearCacheDialogOpen} onOpenChange={setIsClearCacheDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('clear_cache')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Clear Cache</DialogTitle>
                  <DialogDescription>
                    This will clear all cached data. Performance may be temporarily affected while cache rebuilds.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsClearCacheDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleClearCache}>
                    Clear Cache
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Dialog open={isBackupDialogOpen} onOpenChange={setIsBackupDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  {t('backup_now')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Start Backup</DialogTitle>
                  <DialogDescription>
                    This will start an immediate backup of all databases and media files.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsBackupDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleBackup}>
                    Start Backup
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button
              variant={isMaintenanceMode ? "default" : "destructive"}
              onClick={() => setIsMaintenanceMode(!isMaintenanceMode)}
              className="w-full"
            >
              <Power className="h-4 w-4 mr-2" />
              {isMaintenanceMode ? "Exit" : "Enter"} {t('maintenance_mode')}
            </Button>
          </div>
        </AlertDescription>
      </Alert>

      {/* Main Content Tabs */}
      <Tabs defaultValue="servers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="servers">Servers</TabsTrigger>
          <TabsTrigger value="database">Database</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="logs">System Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="servers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('server_status')}</CardTitle>
              <CardDescription>Monitor individual server health and performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {systemMetrics.servers.map(server => (
                  <div key={server.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Server className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                        <div>
                          <p className="font-medium">{server.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">ID: {server.id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={getStatusBadge(server.status)}>
                          {server.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">CPU</span>
                          <span className={cn(
                            "text-sm font-medium",
                            server.cpu > 80 ? "text-red-500" : server.cpu > 60 ? "text-yellow-500" : "text-green-500"
                          )}>
                            {server.cpu}%
                          </span>
                        </div>
                        <Progress value={server.cpu} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Memory</span>
                          <span className={cn(
                            "text-sm font-medium",
                            server.memory > 80 ? "text-red-500" : server.memory > 60 ? "text-yellow-500" : "text-green-500"
                          )}>
                            {server.memory}%
                          </span>
                        </div>
                        <Progress value={server.memory} className="h-2" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">Uptime</span>
                          <span className="text-sm font-medium">{server.uptime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('database_health')}</CardTitle>
              <CardDescription>Database connections and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Database</TableHead>
                    <TableHead>Connections</TableHead>
                    <TableHead>Queries/min</TableHead>
                    <TableHead>Latency</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {systemMetrics.databases.map(db => (
                    <TableRow key={db.name}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4 text-gray-500" />
                          {db.name}
                        </div>
                      </TableCell>
                      <TableCell>{db.connections}/500</TableCell>
                      <TableCell>{db.queries}</TableCell>
                      <TableCell>
                        <span className={cn(
                          db.latency > 20 ? "text-red-500" : db.latency > 15 ? "text-yellow-500" : "text-green-500"
                        )}>
                          {db.latency}ms
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={getStatusBadge(db.status)}>
                          {db.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">
                          <Terminal className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="storage" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>{t('storage_capacity')}</CardTitle>
                <CardDescription>Disk usage and allocation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Total Usage</span>
                    <span className="text-sm font-bold">
                      {systemMetrics.storage.used} GB / {systemMetrics.storage.total} GB
                    </span>
                  </div>
                  <Progress 
                    value={(systemMetrics.storage.used / systemMetrics.storage.total) * 100} 
                    className="h-3"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {((systemMetrics.storage.used / systemMetrics.storage.total) * 100).toFixed(1)}% used
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Media Files</span>
                    <span className="text-sm font-medium">{systemMetrics.storage.media} GB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <span className="text-sm font-medium">{systemMetrics.storage.databases} GB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Logs</span>
                    <span className="text-sm font-medium">{systemMetrics.storage.logs} GB</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Backups</span>
                    <span className="text-sm font-medium">{systemMetrics.storage.backups} GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Storage Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={storageBreakdown}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {storageBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="network" className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Bandwidth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowDown className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Inbound</span>
                    </div>
                    <span className="text-2xl font-bold">{systemMetrics.network.bandwidth.in} Mbps</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ArrowUp className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">Outbound</span>
                    </div>
                    <span className="text-2xl font-bold">{systemMetrics.network.bandwidth.out} Mbps</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Total Requests</span>
                    <span className="text-2xl font-bold">{systemMetrics.network.requests.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Error Rate</span>
                    <span className={cn(
                      "text-lg font-bold",
                      systemMetrics.network.errors > 50 ? "text-red-500" : "text-green-500"
                    )}>
                      {((systemMetrics.network.errors / systemMetrics.network.requests) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Avg Latency</span>
                    <span className={cn(
                      "text-2xl font-bold",
                      systemMetrics.network.latency > 100 ? "text-red-500" : 
                      systemMetrics.network.latency > 50 ? "text-yellow-500" : "text-green-500"
                    )}>
                      {systemMetrics.network.latency}ms
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Uptime</span>
                    <span className="text-lg font-bold text-green-500">99.98%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Service Dependencies</CardTitle>
              <CardDescription>Monitor service connections and dependencies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {serviceDependencies.map(service => (
                  <div key={service.service} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Network className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{service.service}</span>
                      </div>
                      <Badge variant="outline" className={getStatusBadge(service.status)}>
                        {service.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {service.dependencies.map(dep => (
                        <Badge key={dep} variant="secondary" className="text-xs">
                          {dep}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Logs</CardTitle>
              <CardDescription>Recent system events and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {systemLogs.map(log => (
                  <div key={log.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50">
                    {getLogLevelIcon(log.level)}
                    <div className="flex-1">
                      <p className="text-sm">{log.message}</p>
                      <p className="text-xs text-gray-500">{format(log.timestamp, 'MMM d, HH:mm:ss')}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <Button variant="outline">
                  View All Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}