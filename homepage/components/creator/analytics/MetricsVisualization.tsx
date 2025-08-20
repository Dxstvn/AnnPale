"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  MessageCircle,
  Star,
  Clock,
  CheckCircle,
  Eye,
  Activity,
  Calendar,
  Target,
  AlertTriangle,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import { cn } from "@/lib/utils"

interface MetricData {
  current: number
  previous: number
  target?: number
  change: number
  trend: 'up' | 'down' | 'stable'
  benchmark?: number
  status: 'good' | 'warning' | 'critical'
}

interface TimeSeriesData {
  period: string
  value: number
  label?: string
}

interface MetricsVisualizationProps {
  timeRange: '7' | '30' | '90'
  onTimeRangeChange: (range: '7' | '30' | '90') => void
  metrics: {
    earnings: MetricData & { series: TimeSeriesData[] }
    requests: MetricData & { series: TimeSeriesData[] }
    rating: MetricData & { series: TimeSeriesData[] }
    responseTime: MetricData
    completionRate: MetricData
    views: MetricData & { heatmap: { day: string, hour: number, views: number }[] }
  }
  onAnalyzeMetric?: (metric: string) => void
}

export function MetricsVisualization({
  timeRange,
  onTimeRangeChange,
  metrics,
  onAnalyzeMetric
}: MetricsVisualizationProps) {
  const formatChange = (change: number) => {
    const prefix = change > 0 ? '+' : ''
    return `${prefix}${change.toFixed(1)}%`
  }

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-600'
    if (change < 0) return 'text-red-600'
    return 'text-gray-600'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800 border-green-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'critical': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const MetricCard = ({ 
    title, 
    icon: Icon, 
    data, 
    format = 'number',
    visualization = 'line',
    metricKey
  }: {
    title: string
    icon: React.ElementType
    data: MetricData & { series?: TimeSeriesData[], heatmap?: any[] }
    format?: 'number' | 'currency' | 'percentage' | 'time'
    visualization?: 'line' | 'bar' | 'progress' | 'gauge' | 'heatmap'
    metricKey: string
  }) => {
    const formatValue = (value: number) => {
      switch (format) {
        case 'currency': return `$${value.toFixed(0)}`
        case 'percentage': return `${value.toFixed(1)}%`
        case 'time': return `${value.toFixed(1)}h`
        default: return value.toString()
      }
    }

    const maxValue = data.series ? Math.max(...data.series.map(d => d.value)) : 100
    const targetProgress = data.target ? (data.current / data.target) * 100 : undefined

    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <Icon className="h-5 w-5" />
              {title}
            </CardTitle>
            <Badge className={getStatusColor(data.status)}>
              {data.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Current Value */}
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {formatValue(data.current)}
            </div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <span className={cn("text-sm font-medium", getChangeColor(data.change))}>
                {data.trend === 'up' ? (
                  <ArrowUp className="h-3 w-3 inline mr-1" />
                ) : data.trend === 'down' ? (
                  <ArrowDown className="h-3 w-3 inline mr-1" />
                ) : null}
                {formatChange(data.change)}
              </span>
              <span className="text-xs text-gray-500">vs previous</span>
            </div>
          </div>

          {/* Visualization */}
          {visualization === 'line' && data.series && (
            <div className="h-20">
              <div className="flex items-end justify-between h-full gap-1">
                {data.series.map((point, index) => (
                  <div key={index} className="flex flex-col items-center flex-1">
                    <div 
                      className="w-full bg-gradient-to-t from-purple-600 to-pink-500 rounded-t-sm min-h-[2px] transition-all hover:from-purple-700 hover:to-pink-600"
                      style={{ height: `${(point.value / maxValue) * 100}%` }}
                      title={`${point.period}: ${formatValue(point.value)}`}
                    />
                    <span className="text-xs text-gray-500 mt-1 truncate">
                      {point.period}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {visualization === 'bar' && data.series && (
            <div className="space-y-2">
              {data.series.slice(-5).map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 w-12">{point.period}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="h-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full transition-all"
                      style={{ width: `${(point.value / maxValue) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-12 text-right">
                    {formatValue(point.value)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {visualization === 'progress' && (
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Current</span>
                  <span>{formatValue(data.current)}</span>
                </div>
                <Progress value={(data.current / 100) * 100} className="h-2" />
              </div>
              {data.target && (
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Target Progress</span>
                    <span>{targetProgress?.toFixed(0)}%</span>
                  </div>
                  <Progress value={targetProgress} className="h-2" />
                </div>
              )}
            </div>
          )}

          {visualization === 'gauge' && (
            <div className="relative w-24 h-24 mx-auto">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="none" 
                  stroke="#e5e7eb" 
                  strokeWidth="8"
                />
                <circle 
                  cx="50" cy="50" r="40" 
                  fill="none" 
                  stroke="url(#gradient)" 
                  strokeWidth="8"
                  strokeDasharray={`${(data.current / (data.target || 100)) * 251} 251`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient">
                    <stop offset="0%" stopColor="#9333ea" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold">{formatValue(data.current)}</span>
              </div>
            </div>
          )}

          {visualization === 'heatmap' && data.heatmap && (
            <div className="grid grid-cols-7 gap-1">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, dayIndex) => (
                <div key={dayIndex} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">{day}</div>
                  <div className="space-y-1">
                    {Array.from({ length: 4 }, (_, hourIndex) => {
                      const hourData = data.heatmap?.find(h => 
                        h.day === dayIndex && Math.floor(h.hour / 6) === hourIndex
                      )
                      const intensity = hourData ? hourData.views / 100 : 0
                      return (
                        <div 
                          key={hourIndex}
                          className="w-4 h-4 rounded-sm"
                          style={{
                            backgroundColor: `rgba(147, 51, 234, ${intensity})`,
                            border: '1px solid #e5e7eb'
                          }}
                          title={`${day} ${hourIndex * 6}-${(hourIndex + 1) * 6}: ${hourData?.views || 0} views`}
                        />
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Benchmark Comparison */}
          {data.benchmark && (
            <div className="pt-3 border-t">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Platform Average</span>
                <span className={cn(
                  "font-medium",
                  data.current > data.benchmark ? "text-green-600" : "text-red-600"
                )}>
                  {formatValue(data.benchmark)} 
                  ({data.current > data.benchmark ? '+' : ''}{((data.current - data.benchmark) / data.benchmark * 100).toFixed(1)}%)
                </span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => onAnalyzeMetric?.(metricKey)}
          >
            Analyze {title}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Performance Metrics</h2>
          <p className="text-sm text-gray-600">Transform data into actionable insights</p>
        </div>
        <Select value={timeRange} onValueChange={onTimeRangeChange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">7 days</SelectItem>
            <SelectItem value="30">30 days</SelectItem>
            <SelectItem value="90">90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Earnings"
          icon={DollarSign}
          data={metrics.earnings}
          format="currency"
          visualization="line"
          metricKey="earnings"
        />
        
        <MetricCard
          title="Requests"
          icon={MessageCircle}
          data={metrics.requests}
          format="number"
          visualization="bar"
          metricKey="requests"
        />
        
        <MetricCard
          title="Rating"
          icon={Star}
          data={metrics.rating}
          format="number"
          visualization="line"
          metricKey="rating"
        />
        
        <MetricCard
          title="Response Time"
          icon={Clock}
          data={metrics.responseTime}
          format="time"
          visualization="gauge"
          metricKey="responseTime"
        />
        
        <MetricCard
          title="Completion Rate"
          icon={CheckCircle}
          data={metrics.completionRate}
          format="percentage"
          visualization="progress"
          metricKey="completionRate"
        />
        
        <MetricCard
          title="Views"
          icon={Eye}
          data={metrics.views}
          format="number"
          visualization="heatmap"
          metricKey="views"
        />
      </div>

      {/* Performance Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {metrics.responseTime.status === 'critical' && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Response Time Alert</p>
                  <p className="text-sm text-red-700">Above 3 hour target</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {metrics.completionRate.current < 95 && (
          <Card className="border-yellow-200 bg-yellow-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900">Completion Rate</p>
                  <p className="text-sm text-yellow-700">Below 95% target</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        
        {metrics.earnings.trend === 'up' && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Earnings Growth</p>
                  <p className="text-sm text-green-700">Strong upward trend</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}