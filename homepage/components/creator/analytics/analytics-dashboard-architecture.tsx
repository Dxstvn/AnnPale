"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Clock,
  Star,
  Eye,
  Activity,
  Calendar,
  Target,
  Info,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BarChart3,
  PieChart as PieIcon,
  Settings,
  Filter,
  Download,
  Share2,
  RefreshCw,
  Maximize2,
  Minimize2,
  Home,
  Layers,
  Sparkles,
  Gauge,
  Zap,
  AlertTriangle,
  CheckCircle,
  MessageSquare,
  Heart,
  Award,
  Lightbulb,
  Brain,
  Search,
  Grid3X3,
  List,
  MoreHorizontal
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Dashboard Level Types
type DashboardLevel = "snapshot" | "overview" | "detailed" | "custom"

// KPI Data Types
interface KPIData {
  id: string
  name: string
  value: number | string
  change: number
  trend: "up" | "down" | "stable"
  period: string
  comparison: string
  sparklineData: { value: number }[]
  status: "good" | "warning" | "critical"
  target?: number
  benchmark?: number
  unit?: string
  description?: string
  tooltip?: string
}

// Dashboard Configuration
interface DashboardConfig {
  level: DashboardLevel
  title: string
  description: string
  updateFrequency: string
  interaction: string
  maxMetrics: number
}

// Component Props
interface AnalyticsDashboardArchitectureProps {
  initialLevel?: DashboardLevel
  onLevelChange?: (level: DashboardLevel) => void
  onKPIClick?: (kpiId: string) => void
  onDrillDown?: (path: string[]) => void
  className?: string
}

// Dashboard Level Configurations
const DASHBOARD_CONFIGS: Record<DashboardLevel, DashboardConfig> = {
  snapshot: {
    level: "snapshot",
    title: "Quick Status",
    description: "Essential KPIs at a glance",
    updateFrequency: "Real-time",
    interaction: "View only",
    maxMetrics: 6
  },
  overview: {
    level: "overview", 
    title: "Daily Performance",
    description: "Key metrics with trend context",
    updateFrequency: "Hourly",
    interaction: "Hover details",
    maxMetrics: 12
  },
  detailed: {
    level: "detailed",
    title: "Deep Analysis",
    description: "Comprehensive metrics breakdown",
    updateFrequency: "On-demand",
    interaction: "Full interactive",
    maxMetrics: 24
  },
  custom: {
    level: "custom",
    title: "Custom Focus",
    description: "User-configured dashboard",
    updateFrequency: "Varies",
    interaction: "Configurable",
    maxMetrics: 16
  }
}

// Color Psychology Mapping
const COLOR_PSYCHOLOGY = {
  positive: "#10B981", // Green: Growth/positive
  negative: "#EF4444", // Red: Decline/negative  
  warning: "#F59E0B",  // Yellow: Warning/attention
  neutral: "#3B82F6",  // Blue: Neutral/info
  brand: "#9333EA"     // Purple: Brand/special
}

// Mock KPI Data
const generateKPIData = (level: DashboardLevel): KPIData[] => {
  const baseKPIs: KPIData[] = [
    {
      id: "revenue",
      name: "Total Revenue",
      value: "$2,840",
      change: 12.4,
      trend: "up",
      period: "Last 7 days",
      comparison: "vs last period: +$234",
      sparklineData: [
        { value: 200 }, { value: 250 }, { value: 180 }, { value: 320 },
        { value: 280 }, { value: 380 }, { value: 290 }
      ],
      status: "good",
      target: 3000,
      benchmark: 2200,
      unit: "$",
      description: "Total earnings from all video services",
      tooltip: "Includes base fees, rush orders, and tips"
    },
    {
      id: "requests",
      name: "Video Requests",
      value: 28,
      change: 18.4,
      trend: "up",
      period: "Last 7 days",
      comparison: "vs last period: +4",
      sparklineData: [
        { value: 3 }, { value: 5 }, { value: 2 }, { value: 6 },
        { value: 4 }, { value: 7 }, { value: 5 }
      ],
      status: "good",
      target: 35,
      benchmark: 22,
      description: "Number of video requests received",
      tooltip: "Includes completed and pending requests"
    },
    {
      id: "rating",
      name: "Avg Rating",
      value: "4.8",
      change: 2.1,
      trend: "up",
      period: "Last 30 days",
      comparison: "vs last period: +0.1",
      sparklineData: [
        { value: 4.6 }, { value: 4.7 }, { value: 4.8 }, { value: 4.8 },
        { value: 4.7 }, { value: 4.9 }, { value: 4.8 }
      ],
      status: "good",
      target: 4.9,
      benchmark: 4.5,
      description: "Customer satisfaction rating",
      tooltip: "Average of all video ratings received"
    },
    {
      id: "response_time",
      name: "Response Time",
      value: "2.4h",
      change: -15.2,
      trend: "up",
      period: "Last 7 days",
      comparison: "vs last period: -30min",
      sparklineData: [
        { value: 180 }, { value: 160 }, { value: 140 }, { value: 120 },
        { value: 100 }, { value: 140 }, { value: 144 }
      ],
      status: "good",
      target: 180,
      benchmark: 240,
      unit: "min",
      description: "Average time to respond to requests",
      tooltip: "Time from request received to first response"
    },
    {
      id: "completion_rate",
      name: "Completion Rate",
      value: "96%",
      change: 5.3,
      trend: "up",
      period: "Last 30 days",
      comparison: "vs last period: +4%",
      sparklineData: [
        { value: 92 }, { value: 94 }, { value: 95 }, { value: 96 },
        { value: 97 }, { value: 95 }, { value: 96 }
      ],
      status: "good",
      target: 98,
      benchmark: 88,
      description: "Percentage of requests completed",
      tooltip: "Completed requests / Total requests"
    },
    {
      id: "views",
      name: "Profile Views",
      value: "1.2k",
      change: 25.7,
      trend: "up",
      period: "Last 7 days",
      comparison: "vs last period: +280",
      sparklineData: [
        { value: 150 }, { value: 180 }, { value: 220 }, { value: 190 },
        { value: 240 }, { value: 200 }, { value: 210 }
      ],
      status: "good",
      benchmark: 800,
      description: "Number of profile page views",
      tooltip: "Unique visitors to your creator profile"
    }
  ]

  // Additional KPIs for detailed view
  const detailedKPIs: KPIData[] = [
    {
      id: "conversion_rate",
      name: "Conversion Rate",
      value: "23.8%",
      change: -2.1,
      trend: "down",
      period: "Last 30 days",
      comparison: "vs last period: -0.5%",
      sparklineData: [
        { value: 25 }, { value: 24 }, { value: 23 }, { value: 24 },
        { value: 22 }, { value: 24 }, { value: 23.8 }
      ],
      status: "warning",
      target: 25,
      benchmark: 20,
      description: "Profile views that result in bookings"
    },
    {
      id: "repeat_customers",
      name: "Repeat Customers",
      value: "42%",
      change: 8.7,
      trend: "up",
      period: "Last 90 days",
      comparison: "vs last period: +3%",
      sparklineData: [
        { value: 38 }, { value: 40 }, { value: 41 }, { value: 42 },
        { value: 43 }, { value: 41 }, { value: 42 }
      ],
      status: "good",
      benchmark: 35,
      description: "Customers who made multiple bookings"
    },
    {
      id: "avg_order_value",
      name: "Avg Order Value",
      value: "$85",
      change: 6.2,
      trend: "up",
      period: "Last 30 days",
      comparison: "vs last period: +$5",
      sparklineData: [
        { value: 78 }, { value: 82 }, { value: 85 }, { value: 83 },
        { value: 87 }, { value: 84 }, { value: 85 }
      ],
      status: "good",
      target: 90,
      benchmark: 75,
      description: "Average revenue per video request"
    }
  ]

  // Filter based on dashboard level
  const config = DASHBOARD_CONFIGS[level]
  const allKPIs = [...baseKPIs, ...detailedKPIs]
  
  return allKPIs.slice(0, config.maxMetrics)
}

// Sparkline Component
const Sparkline = ({ data, color = COLOR_PSYCHOLOGY.neutral }: { 
  data: { value: number }[], 
  color?: string 
}) => (
  <div className="h-8 w-20">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Line
          type="monotone"
          dataKey="value"
          stroke={color}
          strokeWidth={1.5}
          dot={false}
          activeDot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  </div>
)

// KPI Card Component
const KPICard = ({ 
  kpi, 
  level, 
  onClick,
  isInteractive = true
}: { 
  kpi: KPIData
  level: DashboardLevel
  onClick?: (id: string) => void
  isInteractive?: boolean
}) => {
  const config = DASHBOARD_CONFIGS[level]
  const trendColor = kpi.trend === "up" && kpi.change > 0 ? COLOR_PSYCHOLOGY.positive :
                    kpi.trend === "down" && kpi.change < 0 ? COLOR_PSYCHOLOGY.negative :
                    kpi.status === "warning" ? COLOR_PSYCHOLOGY.warning :
                    COLOR_PSYCHOLOGY.neutral

  const TrendIcon = kpi.trend === "up" ? TrendingUp : 
                   kpi.trend === "down" ? TrendingDown : 
                   Activity

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={isInteractive ? { scale: 1.02, y: -2 } : {}}
            whileTap={isInteractive ? { scale: 0.98 } : {}}
            className={cn(
              "transition-all duration-200",
              isInteractive && "cursor-pointer"
            )}
          >
            <Card 
              className={cn(
                "relative overflow-hidden",
                kpi.status === "warning" && "border-yellow-200",
                kpi.status === "critical" && "border-red-200",
                isInteractive && "hover:shadow-md"
              )}
              onClick={() => isInteractive && onClick?.(kpi.id)}
            >
              <CardContent className="p-4">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-sm text-gray-700 dark:text-gray-300">
                      {kpi.name}
                    </h3>
                    {kpi.tooltip && (
                      <Info className="h-3 w-3 text-gray-400" />
                    )}
                  </div>
                  {kpi.status !== "good" && (
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        kpi.status === "warning" && "border-yellow-300 text-yellow-700",
                        kpi.status === "critical" && "border-red-300 text-red-700"
                      )}
                    >
                      {kpi.status}
                    </Badge>
                  )}
                </div>

                {/* Value and Trend */}
                <div className="flex items-center justify-between mb-3">
                  <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {kpi.value}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendIcon 
                      className="h-3 w-3" 
                      style={{ color: trendColor }}
                    />
                    <span 
                      className="text-xs font-medium"
                      style={{ color: trendColor }}
                    >
                      {Math.abs(kpi.change)}%
                    </span>
                  </div>
                </div>

                {/* Sparkline (for Overview and Detailed levels) */}
                {(level === "overview" || level === "detailed") && (
                  <div className="mb-3">
                    <Sparkline data={kpi.sparklineData} color={trendColor} />
                  </div>
                )}

                {/* Comparison Context */}
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {kpi.comparison}
                </div>

                {/* Target Progress (for Detailed level) */}
                {level === "detailed" && kpi.target && (
                  <div className="mt-3 space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-600">Target</span>
                      <span className="font-medium">{kpi.target}{kpi.unit}</span>
                    </div>
                    <Progress 
                      value={Math.min((Number(kpi.value.toString().replace(/[^0-9.]/g, '')) / kpi.target) * 100, 100)} 
                      className="h-1"
                    />
                  </div>
                )}

                {/* Interactive Indicator */}
                {isInteractive && config.interaction !== "View only" && (
                  <div className="absolute top-2 right-2">
                    <ChevronRight className="h-3 w-3 text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TooltipTrigger>
        {kpi.tooltip && (
          <TooltipContent>
            <p className="text-sm">{kpi.tooltip}</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  )
}

// Dashboard Level Selector
const DashboardLevelSelector = ({ 
  currentLevel, 
  onLevelChange 
}: { 
  currentLevel: DashboardLevel
  onLevelChange: (level: DashboardLevel) => void 
}) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
    {Object.entries(DASHBOARD_CONFIGS).map(([level, config]) => (
      <motion.div
        key={level}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Card 
          className={cn(
            "cursor-pointer transition-all",
            currentLevel === level 
              ? "ring-2 ring-purple-600 bg-purple-50 dark:bg-purple-900/20"
              : "hover:shadow-md hover:border-purple-200"
          )}
          onClick={() => onLevelChange(level as DashboardLevel)}
        >
          <CardContent className="p-4 text-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2",
              currentLevel === level ? "bg-purple-600" : "bg-gray-100 dark:bg-gray-800"
            )}>
              {level === "snapshot" && <Eye className={cn("h-4 w-4", currentLevel === level ? "text-white" : "text-gray-600")} />}
              {level === "overview" && <BarChart3 className={cn("h-4 w-4", currentLevel === level ? "text-white" : "text-gray-600")} />}
              {level === "detailed" && <Layers className={cn("h-4 w-4", currentLevel === level ? "text-white" : "text-gray-600")} />}
              {level === "custom" && <Settings className={cn("h-4 w-4", currentLevel === level ? "text-white" : "text-gray-600")} />}
            </div>
            <h3 className="font-semibold text-sm">{config.title}</h3>
            <p className="text-xs text-gray-600 mt-1">{config.updateFrequency}</p>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
)

// Breadcrumb Navigation
const DashboardBreadcrumb = ({ 
  path, 
  onNavigate 
}: { 
  path: string[]
  onNavigate: (index: number) => void 
}) => (
  <Breadcrumb>
    <BreadcrumbList>
      {path.map((item, index) => (
        <React.Fragment key={index}>
          <BreadcrumbItem>
            {index === path.length - 1 ? (
              <BreadcrumbPage>{item}</BreadcrumbPage>
            ) : (
              <BreadcrumbLink 
                className="cursor-pointer"
                onClick={() => onNavigate(index)}
              >
                {item}
              </BreadcrumbLink>
            )}
          </BreadcrumbItem>
          {index < path.length - 1 && <BreadcrumbSeparator />}
        </React.Fragment>
      ))}
    </BreadcrumbList>
  </Breadcrumb>
)

// Main Component
export function AnalyticsDashboardArchitecture({
  initialLevel = "overview",
  onLevelChange,
  onKPIClick,
  onDrillDown,
  className
}: AnalyticsDashboardArchitectureProps) {
  const [currentLevel, setCurrentLevel] = React.useState<DashboardLevel>(initialLevel)
  const [breadcrumbPath, setBreadcrumbPath] = React.useState<string[]>(["Dashboard"])
  const [selectedKPI, setSelectedKPI] = React.useState<string | null>(null)

  const config = DASHBOARD_CONFIGS[currentLevel]
  const kpiData = generateKPIData(currentLevel)

  const handleLevelChange = (level: DashboardLevel) => {
    setCurrentLevel(level)
    setBreadcrumbPath(["Dashboard", DASHBOARD_CONFIGS[level].title])
    onLevelChange?.(level)
  }

  const handleKPIClick = (kpiId: string) => {
    setSelectedKPI(kpiId)
    const kpi = kpiData.find(k => k.id === kpiId)
    if (kpi) {
      setBreadcrumbPath(["Dashboard", config.title, kpi.name])
    }
    onKPIClick?.(kpiId)
  }

  const handleBreadcrumbNavigate = (index: number) => {
    const newPath = breadcrumbPath.slice(0, index + 1)
    setBreadcrumbPath(newPath)
    
    if (index === 0) {
      setSelectedKPI(null)
    } else if (index === 1) {
      setSelectedKPI(null)
    }
    
    onDrillDown?.(newPath)
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Dashboard Architecture</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {config.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-purple-600">
            <Sparkles className="w-3 h-3 mr-1" />
            Information Hierarchy
          </Badge>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      {breadcrumbPath.length > 1 && (
        <DashboardBreadcrumb 
          path={breadcrumbPath}
          onNavigate={handleBreadcrumbNavigate}
        />
      )}

      {/* Dashboard Level Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-blue-600" />
            Dashboard Levels
          </CardTitle>
          <CardDescription>
            Choose your preferred information density and interaction level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DashboardLevelSelector 
            currentLevel={currentLevel}
            onLevelChange={handleLevelChange}
          />
          
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Current Level:</span>
              <span className="font-medium">{config.title}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Update Frequency:</span>
              <span>{config.updateFrequency}</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-gray-600">Interaction:</span>
              <span>{config.interaction}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Dashboard */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="h-5 w-5 text-green-600" />
                {config.title} Dashboard
              </CardTitle>
              <CardDescription>
                Showing {kpiData.length} key metrics • Updated {config.updateFrequency.toLowerCase()}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-1" />
                Refresh
              </Button>
              {currentLevel === "custom" && (
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Configure
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className={cn(
            "grid gap-4",
            currentLevel === "snapshot" ? "grid-cols-2 md:grid-cols-3" :
            currentLevel === "overview" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4" :
            "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
          )}>
            {kpiData.map((kpi) => (
              <KPICard
                key={kpi.id}
                kpi={kpi}
                level={currentLevel}
                onClick={handleKPIClick}
                isInteractive={config.interaction !== "View only"}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progressive Disclosure Information */}
      <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
        <Lightbulb className="h-4 w-4" />
        <AlertDescription>
          <strong>Progressive Disclosure:</strong> {
            currentLevel === "snapshot" 
              ? "Quick status view with essential KPIs only. Click a metric to see more details."
              : currentLevel === "overview"
              ? "Daily performance view with trend context. Hover for details, click to drill down."
              : currentLevel === "detailed"
              ? "Comprehensive analysis with full interactivity and target tracking."
              : "Custom dashboard configured to your specific needs and preferences."
          }
        </AlertDescription>
      </Alert>

      {/* Color Psychology Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-purple-600" />
            Visual Hierarchy Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Color Psychology</h4>
              <div className="space-y-2">
                {[
                  { color: COLOR_PSYCHOLOGY.positive, label: "Positive/Growth", bg: "bg-green-100" },
                  { color: COLOR_PSYCHOLOGY.negative, label: "Negative/Decline", bg: "bg-red-100" },
                  { color: COLOR_PSYCHOLOGY.warning, label: "Warning/Attention", bg: "bg-yellow-100" },
                  { color: COLOR_PSYCHOLOGY.neutral, label: "Neutral/Info", bg: "bg-blue-100" },
                  { color: COLOR_PSYCHOLOGY.brand, label: "Brand/Special", bg: "bg-purple-100" }
                ].map(({ color, label, bg }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div 
                      className={cn("w-4 h-4 rounded", bg)}
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-3">Information Density</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Snapshot:</span>
                  <span className="font-medium">4-6 KPIs</span>
                </div>
                <div className="flex justify-between">
                  <span>Overview:</span>
                  <span className="font-medium">8-12 metrics</span>
                </div>
                <div className="flex justify-between">
                  <span>Detailed:</span>
                  <span className="font-medium">All metrics</span>
                </div>
                <div className="flex justify-between">
                  <span>Custom:</span>
                  <span className="font-medium">User-selected</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}