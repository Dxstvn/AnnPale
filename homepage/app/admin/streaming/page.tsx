'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Radio, Users, DollarSign, TrendingUp, AlertTriangle,
  Shield, Activity, BarChart3, Eye, Ban, Play, Pause,
  StopCircle, Settings, RefreshCw, ChevronRight, Info,
  Zap, Server, Globe, Clock, CheckCircle, XCircle,
  AlertCircle, Filter, Search, Download, MoreVertical,
  Tv, WifiOff, Wifi, Database, CreditCard
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

// Mock data for active streams
const mockActiveStreams = [
  {
    id: 'stream-001',
    creatorId: 'creator-001',
    creatorName: 'Marie-Claire Laurent',
    title: 'Live Concert: Kompa Classics Night',
    status: 'live',
    viewers: 1250,
    duration: '1:23:45',
    revenue: 156.50,
    health: 'good',
    reports: 0,
    channelArn: 'arn:aws:ivs:us-east-1:206254861786:channel/ALKd3nFpmt5Z'
  },
  {
    id: 'stream-002',
    creatorId: 'creator-002',
    creatorName: 'Jean-Baptiste Pierre',
    title: 'Comedy Night Special',
    status: 'live',
    viewers: 856,
    duration: '0:45:12',
    revenue: 89.30,
    health: 'warning',
    reports: 2,
    channelArn: 'arn:aws:ivs:us-east-1:206254861786:channel/BLKd3nFpmt5Y'
  },
  {
    id: 'stream-003',
    creatorId: 'creator-003',
    creatorName: 'Sophie Duval',
    title: 'Cooking Master Class',
    status: 'live',
    viewers: 423,
    duration: '0:15:30',
    revenue: 0,
    health: 'good',
    reports: 0,
    channelArn: 'arn:aws:ivs:us-east-1:206254861786:channel/CLKd3nFpmt5X'
  }
]

// Mock AWS infrastructure metrics
const mockAWSMetrics = {
  channels: {
    total: 15,
    active: 3,
    idle: 12
  },
  bandwidth: {
    current: 18.5, // Gbps
    peak: 24.3,
    limit: 100
  },
  storage: {
    recordings: 456.7, // GB
    thumbnails: 12.3,
    total: 469.0,
    limit: 1000
  },
  costs: {
    today: 124.56,
    month: 3456.78,
    projected: 4200.00
  }
}

export default function AdminStreamingDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [streams, setStreams] = useState(mockActiveStreams)
  const [selectedStream, setSelectedStream] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [loading, setLoading] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Auto-refresh data
  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      refreshData()
    }, 5000) // Refresh every 5 seconds
    
    return () => clearInterval(interval)
  }, [autoRefresh])

  const refreshData = () => {
    // In production, fetch real data from API
    console.log('Refreshing streaming data...')
    
    // Simulate viewer count changes
    setStreams(prev => prev.map(stream => ({
      ...stream,
      viewers: stream.viewers + Math.floor(Math.random() * 20) - 10,
      revenue: stream.revenue + (Math.random() * 5)
    })))
  }

  const handleStopStream = async (streamId: string) => {
    if (!confirm('Are you sure you want to force stop this stream?')) return
    
    setLoading(true)
    try {
      // In production, call API to stop stream via AWS IVS
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setStreams(prev => prev.filter(s => s.id !== streamId))
      toast.success('Stream stopped successfully')
    } catch (error) {
      toast.error('Failed to stop stream')
    } finally {
      setLoading(false)
    }
  }

  const handleBanCreator = async (creatorId: string, duration: number) => {
    if (!confirm(`Ban creator for ${duration} days?`)) return
    
    setLoading(true)
    try {
      // In production, call API to ban creator
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success(`Creator banned for ${duration} days`)
    } catch (error) {
      toast.error('Failed to ban creator')
    } finally {
      setLoading(false)
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'good': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'good': return <CheckCircle className="h-4 w-4" />
      case 'warning': return <AlertCircle className="h-4 w-4" />
      case 'error': return <XCircle className="h-4 w-4" />
      default: return <Info className="h-4 w-4" />
    }
  }

  const filteredStreams = streams.filter(stream => {
    const matchesSearch = 
      stream.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stream.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === 'all' || stream.status === filterStatus
    
    return matchesSearch && matchesStatus
  })

  // Calculate totals
  const totalViewers = streams.reduce((sum, s) => sum + s.viewers, 0)
  const totalRevenue = streams.reduce((sum, s) => sum + s.revenue, 0)
  const totalReports = streams.reduce((sum, s) => sum + s.reports, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-3">
                <Shield className="h-7 w-7" />
                Admin Streaming Monitor
              </h1>
              <p className="mt-1 text-gray-300">
                Real-time monitoring and control of all live streams
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge 
                className={cn(
                  "px-3 py-1",
                  autoRefresh ? "bg-green-600" : "bg-gray-600"
                )}
              >
                {autoRefresh ? (
                  <>
                    <Activity className="h-3 w-3 mr-1 animate-pulse" />
                    Live Updates
                  </>
                ) : (
                  <>
                    <WifiOff className="h-3 w-3 mr-1" />
                    Paused
                  </>
                )}
              </Badge>
              
              <Button
                variant={autoRefresh ? "secondary" : "default"}
                size="sm"
                onClick={() => setAutoRefresh(!autoRefresh)}
              >
                {autoRefresh ? 'Pause' : 'Resume'} Updates
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={refreshData}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Streams</p>
                  <p className="text-3xl font-bold">{streams.length}</p>
                </div>
                <div className="p-3 bg-red-100 rounded-lg">
                  <Radio className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Viewers</p>
                  <p className="text-3xl font-bold">{totalViewers.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenue (Live)</p>
                  <p className="text-3xl font-bold">${totalRevenue.toFixed(2)}</p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Reports</p>
                  <p className="text-3xl font-bold">{totalReports}</p>
                </div>
                <div className={cn(
                  "p-3 rounded-lg",
                  totalReports > 0 ? "bg-yellow-100" : "bg-gray-100"
                )}>
                  <AlertTriangle className={cn(
                    "h-6 w-6",
                    totalReports > 0 ? "text-yellow-600" : "text-gray-400"
                  )} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="streams">Active Streams</TabsTrigger>
            <TabsTrigger value="infrastructure">AWS Infrastructure</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* AWS Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  AWS IVS Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Service Health</span>
                      <Badge className="bg-green-100 text-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Operational
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Region</span>
                      <span className="text-sm font-medium">us-east-1</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Latency</span>
                      <span className="text-sm font-medium">2.3ms</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active Channels</span>
                      <span className="text-sm font-medium">{mockAWSMetrics.channels.active}/{mockAWSMetrics.channels.total}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Bandwidth Usage</span>
                      <span className="text-sm font-medium">{mockAWSMetrics.bandwidth.current} Gbps</span>
                    </div>
                    <Progress 
                      value={(mockAWSMetrics.bandwidth.current / mockAWSMetrics.bandwidth.limit) * 100} 
                      className="h-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Today's Cost</span>
                      <span className="text-sm font-bold text-green-600">
                        ${mockAWSMetrics.costs.today.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Month to Date</span>
                      <span className="text-sm font-medium">
                        ${mockAWSMetrics.costs.month.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Projected</span>
                      <span className="text-sm font-medium">
                        ${mockAWSMetrics.costs.projected.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded">
                        <Play className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Stream Started</p>
                        <p className="text-sm text-gray-600">Marie-Claire Laurent started streaming</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">2 min ago</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-yellow-100 rounded">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-medium">High Latency Detected</p>
                        <p className="text-sm text-gray-600">Stream #002 experiencing network issues</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">5 min ago</span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-red-100 rounded">
                        <StopCircle className="h-4 w-4 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Stream Ended</p>
                        <p className="text-sm text-gray-600">David Wilson ended stream after 2h 15m</p>
                      </div>
                    </div>
                    <span className="text-sm text-gray-500">15 min ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Streams Tab */}
          <TabsContent value="streams" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Live Streams Monitor</CardTitle>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Search streams..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64"
                    />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="live">Live</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Stream</TableHead>
                      <TableHead>Creator</TableHead>
                      <TableHead>Viewers</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Health</TableHead>
                      <TableHead>Reports</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStreams.map((stream) => (
                      <TableRow key={stream.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-red-600 text-white animate-pulse">
                              <Radio className="h-3 w-3 mr-1" />
                              LIVE
                            </Badge>
                            <span className="max-w-[200px] truncate">
                              {stream.title}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>{stream.creatorName[0]}</AvatarFallback>
                            </Avatar>
                            <span>{stream.creatorName}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            {stream.viewers.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>{stream.duration}</TableCell>
                        <TableCell>
                          <span className="font-medium text-green-600">
                            ${stream.revenue.toFixed(2)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge className={cn("gap-1", getHealthColor(stream.health))}>
                            {getHealthIcon(stream.health)}
                            {stream.health}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {stream.reports > 0 ? (
                            <Badge variant="destructive">{stream.reports}</Badge>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem 
                                onClick={() => window.open('/test-stream', '_blank')}
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Stream
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Activity className="h-4 w-4 mr-2" />
                                View Metrics
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-yellow-600"
                                onClick={() => toast.warning('Stream warned')}
                              >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Send Warning
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleStopStream(stream.id)}
                              >
                                <StopCircle className="h-4 w-4 mr-2" />
                                Force Stop
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleBanCreator(stream.creatorId, 7)}
                              >
                                <Ban className="h-4 w-4 mr-2" />
                                Ban Creator
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Infrastructure Tab */}
          <TabsContent value="infrastructure" className="space-y-6 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* IVS Channels */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    IVS Channels
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Channels</span>
                      <span className="font-medium">{mockAWSMetrics.channels.total}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Active Channels</span>
                      <span className="font-medium text-green-600">{mockAWSMetrics.channels.active}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Idle Channels</span>
                      <span className="font-medium text-gray-500">{mockAWSMetrics.channels.idle}</span>
                    </div>
                  </div>
                  <Progress 
                    value={(mockAWSMetrics.channels.active / mockAWSMetrics.channels.total) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-gray-600">
                    {Math.round((mockAWSMetrics.channels.active / mockAWSMetrics.channels.total) * 100)}% utilization
                  </p>
                </CardContent>
              </Card>

              {/* Bandwidth */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wifi className="h-5 w-5" />
                    Bandwidth Usage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Current Usage</span>
                      <span className="font-medium">{mockAWSMetrics.bandwidth.current} Gbps</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Peak Today</span>
                      <span className="font-medium">{mockAWSMetrics.bandwidth.peak} Gbps</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Limit</span>
                      <span className="font-medium">{mockAWSMetrics.bandwidth.limit} Gbps</span>
                    </div>
                  </div>
                  <Progress 
                    value={(mockAWSMetrics.bandwidth.current / mockAWSMetrics.bandwidth.limit) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-gray-600">
                    {Math.round((mockAWSMetrics.bandwidth.current / mockAWSMetrics.bandwidth.limit) * 100)}% of capacity
                  </p>
                </CardContent>
              </Card>

              {/* Storage */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    S3 Storage
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Recordings</span>
                      <span className="font-medium">{mockAWSMetrics.storage.recordings} GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Thumbnails</span>
                      <span className="font-medium">{mockAWSMetrics.storage.thumbnails} GB</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Total Used</span>
                      <span className="font-medium">{mockAWSMetrics.storage.total} GB</span>
                    </div>
                  </div>
                  <Progress 
                    value={(mockAWSMetrics.storage.total / mockAWSMetrics.storage.limit) * 100}
                    className="h-2"
                  />
                  <p className="text-xs text-gray-600">
                    {Math.round((mockAWSMetrics.storage.total / mockAWSMetrics.storage.limit) * 100)}% of {mockAWSMetrics.storage.limit} GB limit
                  </p>
                </CardContent>
              </Card>

              {/* Costs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5" />
                    AWS Costs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Today</span>
                      <span className="font-medium text-green-600">
                        ${mockAWSMetrics.costs.today.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">This Month</span>
                      <span className="font-medium">
                        ${mockAWSMetrics.costs.month.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Projected</span>
                      <span className="font-medium text-yellow-600">
                        ${mockAWSMetrics.costs.projected.toFixed(2)}
                      </span>
                    </div>
                  </div>
                  <Alert className="bg-blue-50 border-blue-200">
                    <Info className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      Costs update every hour. Projections based on current usage patterns.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Streaming Analytics</CardTitle>
                <CardDescription>
                  Platform-wide streaming metrics and trends
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4" />
                    <p>Analytics charts would be displayed here</p>
                    <p className="text-sm mt-2">Showing viewer trends, revenue, engagement metrics, etc.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}