"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
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
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  ComposedChart,
  RadialBarChart,
  RadialBar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts"
import {
  ArrowLeft,
  Upload,
  FileVideo,
  Camera,
  Cloud,
  Webcam,
  FolderOpen,
  Cpu,
  Zap,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  Wifi,
  WifiOff,
  Battery,
  HardDrive,
  Server,
  Shield,
  RefreshCw,
  TrendingUp,
  BarChart3,
  Info,
  Sparkles,
  Package,
  Layers,
  Grid,
  List,
  Play,
  Pause,
  RotateCcw,
  Download,
  Settings,
  Filter,
  ChevronRight,
  Database,
  FileCheck,
  Film,
  Image,
  Scissors,
  Volume2,
  Eye,
  Timer,
  Gauge
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { UploadProcessingInterface } from "@/components/creator/content/upload-processing-interface"

// Demo data for visualizations
const uploadMethodStats = [
  { method: "Drag & Drop", count: 452, percentage: 35, avgSize: "45MB", success: 98 },
  { method: "File Browser", count: 387, percentage: 30, avgSize: "38MB", success: 97 },
  { method: "Mobile Camera", count: 258, percentage: 20, avgSize: "25MB", success: 95 },
  { method: "Cloud Import", count: 129, percentage: 10, avgSize: "52MB", success: 99 },
  { method: "Webcam", count: 64, percentage: 5, avgSize: "15MB", success: 94 }
]

const processingPipelineMetrics = [
  { stage: "Upload", avgTime: 45, success: 98, retries: 2 },
  { stage: "Validate", avgTime: 5, success: 99.5, retries: 0.5 },
  { stage: "Process", avgTime: 60, success: 97, retries: 1.5 },
  { stage: "Optimize", avgTime: 30, success: 99, retries: 0.8 },
  { stage: "Thumbnail", avgTime: 10, success: 99.8, retries: 0.2 },
  { stage: "Finalize", avgTime: 8, success: 99.9, retries: 0.1 }
]

const compressionEfficiency = [
  { quality: "High", originalSize: 100, compressedSize: 75, savings: 25, time: 45 },
  { quality: "Balanced", originalSize: 100, compressedSize: 60, savings: 40, time: 30 },
  { quality: "Optimized", originalSize: 100, compressedSize: 45, savings: 55, time: 20 },
  { quality: "Mobile", originalSize: 100, compressedSize: 35, savings: 65, time: 15 }
]

const uploadPerformance = [
  { time: "00:00", speed: 5.2, concurrent: 3, queue: 8 },
  { time: "00:30", speed: 8.5, concurrent: 3, queue: 6 },
  { time: "01:00", speed: 12.3, concurrent: 3, queue: 4 },
  { time: "01:30", speed: 10.8, concurrent: 3, queue: 3 },
  { time: "02:00", speed: 15.2, concurrent: 3, queue: 2 },
  { time: "02:30", speed: 11.5, concurrent: 2, queue: 1 },
  { time: "03:00", speed: 9.8, concurrent: 1, queue: 0 }
]

const errorRecoveryStats = [
  { error: "Network Timeout", occurrences: 23, recovered: 21, avgRetries: 1.8 },
  { error: "File Too Large", occurrences: 15, recovered: 12, avgRetries: 2.1 },
  { error: "Format Unsupported", occurrences: 8, recovered: 0, avgRetries: 0 },
  { error: "Server Error", occurrences: 5, recovered: 4, avgRetries: 2.5 },
  { error: "Connection Lost", occurrences: 18, recovered: 17, avgRetries: 1.5 }
]

const batchProcessingMetrics = [
  { batch: 1, files: 5, totalSize: 225, processTime: 180, avgSpeed: 1.25 },
  { batch: 2, files: 8, totalSize: 360, processTime: 240, avgSpeed: 1.5 },
  { batch: 3, files: 3, totalSize: 135, processTime: 120, avgSpeed: 1.125 },
  { batch: 4, files: 10, totalSize: 450, processTime: 300, avgSpeed: 1.5 },
  { batch: 5, files: 6, totalSize: 270, processTime: 200, avgSpeed: 1.35 }
]

const chunkUploadAnalysis = [
  { chunkSize: "1MB", speed: 2.5, reliability: 95, overhead: 15 },
  { chunkSize: "2MB", speed: 4.2, reliability: 93, overhead: 12 },
  { chunkSize: "5MB", speed: 7.8, reliability: 90, overhead: 8 },
  { chunkSize: "10MB", speed: 12.5, reliability: 85, overhead: 5 }
]

const networkAdaptation = [
  { condition: "Excellent", speed: ">10 Mbps", strategy: "Large chunks", success: 99 },
  { condition: "Good", speed: "5-10 Mbps", strategy: "Medium chunks", success: 97 },
  { condition: "Fair", speed: "2-5 Mbps", strategy: "Small chunks", success: 94 },
  { condition: "Poor", speed: "<2 Mbps", strategy: "Minimal chunks", success: 88 }
]

const COLORS = {
  primary: "#3B82F6",
  secondary: "#10B981",
  tertiary: "#8B5CF6",
  quaternary: "#F97316",
  quinary: "#EC4899",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#06B6D4"
}

export default function Phase333Demo() {
  const [activeTab, setActiveTab] = React.useState("overview")
  const [selectedMethod, setSelectedMethod] = React.useState("drag-drop")
  const [compressionLevel, setCompressionLevel] = React.useState("balanced")

  const handleUploadComplete = (files: any[]) => {
    console.log("Upload complete:", files)
  }

  const handleProcessingComplete = (files: any[]) => {
    console.log("Processing complete:", files)
  }

  const handleError = (error: string, file?: any) => {
    console.error("Upload error:", error, file)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-white/20 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/creator/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-xl font-semibold">Phase 3.3.3 Demo</h1>
                <p className="text-sm text-gray-600">Upload & Processing Interface</p>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Upload className="h-3 w-3 mr-1" />
                Upload System
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-pink-50 text-pink-700">
                5 Upload Methods
              </Badge>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="methods" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Methods
            </TabsTrigger>
            <TabsTrigger value="processing" className="flex items-center gap-2">
              <Cpu className="h-4 w-4" />
              Processing
            </TabsTrigger>
            <TabsTrigger value="optimization" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Optimization
            </TabsTrigger>
            <TabsTrigger value="demo" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Live Demo
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-purple-600" />
                  Upload & Processing System Overview
                </CardTitle>
                <CardDescription>
                  Comprehensive file upload and processing pipeline with optimization
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Upload Method Distribution */}
                  <div>
                    <h4 className="font-semibold mb-4">Upload Method Usage</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={uploadMethodStats}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="percentage"
                          >
                            {uploadMethodStats.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={Object.values(COLORS)[index]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `${value}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                      {uploadMethodStats.map((method, index) => (
                        <div key={method.method} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: Object.values(COLORS)[index] }}
                          />
                          <span className="text-sm">{method.method}: {method.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Upload Performance */}
                  <div>
                    <h4 className="font-semibold mb-4">Upload Performance</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={uploadPerformance}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis yAxisId="left" />
                          <YAxis yAxisId="right" orientation="right" />
                          <Tooltip />
                          <Area
                            yAxisId="left"
                            type="monotone"
                            dataKey="speed"
                            fill={COLORS.primary}
                            stroke={COLORS.primary}
                            fillOpacity={0.3}
                            name="Speed (MB/s)"
                          />
                          <Line
                            yAxisId="right"
                            type="monotone"
                            dataKey="queue"
                            stroke={COLORS.danger}
                            strokeWidth={2}
                            name="Queue Size"
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Uploads</p>
                      <p className="text-2xl font-bold">1,290</p>
                      <p className="text-xs text-green-600 mt-1">+15% this week</p>
                    </div>
                    <Upload className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Success Rate</p>
                      <p className="text-2xl font-bold">97.8%</p>
                      <p className="text-xs text-green-600 mt-1">+2.3% improvement</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Processing</p>
                      <p className="text-2xl font-bold">2.5 min</p>
                      <p className="text-xs text-blue-600 mt-1">-30s faster</p>
                    </div>
                    <Timer className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Data Saved</p>
                      <p className="text-2xl font-bold">42%</p>
                      <p className="text-xs text-orange-600 mt-1">Via compression</p>
                    </div>
                    <Zap className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Methods Tab */}
          <TabsContent value="methods" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upload Method Analysis</CardTitle>
                <CardDescription>
                  Performance and usage statistics for each upload method
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uploadMethodStats.map((method) => (
                    <div key={method.method} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <h5 className="font-medium">{method.method}</h5>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <span>{method.count} uploads</span>
                          <span>Avg: {method.avgSize}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-2xl font-bold">{method.success}%</div>
                          <div className="text-xs text-gray-500">success rate</div>
                        </div>
                        <div className="w-32">
                          <Progress value={method.percentage} className="h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Batch Processing Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-600" />
                  Batch Processing Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={batchProcessingMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="batch" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="files" fill={COLORS.primary} name="Files" />
                      <Bar yAxisId="left" dataKey="processTime" fill={COLORS.secondary} name="Time (s)" />
                      <Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="avgSpeed" 
                        stroke={COLORS.tertiary} 
                        strokeWidth={3}
                        name="Speed (MB/s)"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Processing Tab */}
          <TabsContent value="processing" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-green-600" />
                  Processing Pipeline Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={processingPipelineMetrics}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="stage" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="avgTime" fill={COLORS.primary} name="Avg Time (s)" />
                      <Bar dataKey="success" fill={COLORS.success} name="Success %" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Error Recovery */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 text-orange-600" />
                  Error Recovery Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {errorRecoveryStats.map((error) => (
                    <div key={error.error} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <h5 className="font-medium text-sm">{error.error}</h5>
                        <p className="text-xs text-gray-600">
                          {error.occurrences} occurrences • {error.avgRetries} avg retries
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-lg font-bold">
                            {Math.round((error.recovered / error.occurrences) * 100)}%
                          </div>
                          <div className="text-xs text-gray-500">recovered</div>
                        </div>
                        <Progress 
                          value={(error.recovered / error.occurrences) * 100} 
                          className="w-24 h-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Optimization Tab */}
          <TabsContent value="optimization" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Compression Efficiency */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-600" />
                    Compression Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={compressionEfficiency}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="quality" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="originalSize" fill={COLORS.danger} name="Original" />
                        <Bar dataKey="compressedSize" fill={COLORS.success} name="Compressed" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Chunk Upload Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-indigo-600" />
                    Chunk Size Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={chunkUploadAnalysis}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="chunkSize" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="speed" fill={COLORS.primary} name="Speed (MB/s)" />
                        <Line 
                          type="monotone" 
                          dataKey="reliability" 
                          stroke={COLORS.success} 
                          strokeWidth={3}
                          name="Reliability %"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Network Adaptation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="h-5 w-5 text-blue-600" />
                  Network Adaptive Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  {networkAdaptation.map((condition) => (
                    <div key={condition.condition} className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className={cn(
                        "text-lg font-bold mb-1",
                        condition.success >= 95 ? "text-green-600" :
                        condition.success >= 90 ? "text-yellow-600" : "text-red-600"
                      )}>
                        {condition.condition}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{condition.speed}</div>
                      <Badge variant="outline" className="mb-2">{condition.strategy}</Badge>
                      <Progress value={condition.success} className="h-2 mt-2" />
                      <div className="text-xs text-gray-500 mt-1">{condition.success}% success</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <Alert className="border-purple-200 bg-purple-50 dark:bg-purple-900/20">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                <strong>Interactive Demo:</strong> Experience the complete Upload & Processing Interface with 
                5 upload methods (Drag & Drop, File Browser, Camera, Cloud, Webcam), smart compression, 
                batch processing, error recovery, and real-time processing pipeline visualization.
              </AlertDescription>
            </Alert>

            <UploadProcessingInterface
              onUploadComplete={handleUploadComplete}
              onProcessingComplete={handleProcessingComplete}
              onError={handleError}
              maxConcurrentUploads={3}
              enableAutoRetry={true}
              enableCompression={true}
              enableBatchProcessing={true}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}