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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts"
import {
  ArrowLeft,
  FileText,
  Download,
  Mail,
  Cloud,
  Calendar,
  Clock,
  FileSpreadsheet,
  FileImage,
  FileJson,
  FilePlus,
  Filter,
  Settings,
  Send,
  Save,
  Archive,
  Printer,
  Share2,
  Upload,
  Database,
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  DollarSign,
  Users,
  Target,
  Award,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
  X,
  ExternalLink,
  Lock,
  Unlock,
  RefreshCw,
  Zap,
  Package,
  Receipt,
  FileBarChart,
  Briefcase,
  BookOpen,
  CreditCard,
  Calculator,
  Presentation,
  FolderOpen,
  HardDrive,
  Smartphone,
  Globe,
  Sparkles,
  Timer,
  Activity,
  Gauge,
  Hash,
  Layers,
  Layout,
  List
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ReportGenerationExport } from "@/components/creator/analytics/report-generation-export"

// Demo data for visualizations
const reportTypesOverview = [
  { type: "Executive Summary", frequency: "Weekly/Monthly", customization: "Minimal", dataPoints: 25, color: "#3B82F6" },
  { type: "Detailed Analytics", frequency: "Monthly/Quarterly", customization: "Full", dataPoints: 150, color: "#8B5CF6" },
  { type: "Financial Statement", frequency: "Monthly/Annual", customization: "Standard", dataPoints: 75, color: "#10B981" },
  { type: "Performance Report", frequency: "Custom", customization: "Extensive", dataPoints: 100, color: "#F97316" },
  { type: "Customer Report", frequency: "Quarterly", customization: "Moderate", dataPoints: 80, color: "#EC4899" }
]

const exportFormatsComparison = [
  { format: "CSV", fileSize: 50, features: 3, compatibility: 100, compression: 0 },
  { format: "Excel", fileSize: 25, features: 5, compatibility: 95, compression: 60 },
  { format: "PDF", fileSize: 10, features: 4, compatibility: 100, compression: 80 },
  { format: "JSON", fileSize: 100, features: 2, compatibility: 70, compression: 0 }
]

const schedulingOptions = [
  { type: "One-time", icon: Clock, description: "Single report generation", usage: 15, color: "text-blue-600" },
  { type: "Recurring", icon: RefreshCw, description: "Regular scheduled reports", usage: 65, color: "text-green-600" },
  { type: "Triggered", icon: Zap, description: "Event-based generation", usage: 20, color: "text-purple-600" }
]

const deliveryMethods = [
  { method: "Download", configured: true, usage: 45, lastUsed: "Today", icon: Download },
  { method: "Email", configured: true, usage: 35, lastUsed: "Yesterday", icon: Mail },
  { method: "Cloud Storage", configured: true, usage: 15, lastUsed: "3 days ago", icon: Cloud },
  { method: "API", configured: false, usage: 5, lastUsed: "Not configured", icon: Zap }
]

const reportGenerationStats = [
  { month: "Jan", generated: 12, scheduled: 8, manual: 4 },
  { month: "Feb", generated: 15, scheduled: 10, manual: 5 },
  { month: "Mar", generated: 18, scheduled: 12, manual: 6 },
  { month: "Apr", generated: 22, scheduled: 15, manual: 7 },
  { month: "May", generated: 25, scheduled: 18, manual: 7 },
  { month: "Jun", generated: 28, scheduled: 20, manual: 8 }
]

const dataExportVolume = [
  { week: "W1", csv: 120, excel: 80, pdf: 150, json: 30 },
  { week: "W2", csv: 140, excel: 90, pdf: 160, json: 35 },
  { week: "W3", csv: 130, excel: 85, pdf: 170, json: 40 },
  { week: "W4", csv: 150, excel: 95, pdf: 180, json: 45 }
]

const reportSections = [
  { section: "KPIs", included: 95, customizable: true },
  { section: "Trends", included: 88, customizable: true },
  { section: "Revenue", included: 92, customizable: true },
  { section: "Audience", included: 85, customizable: true },
  { section: "Content", included: 78, customizable: false },
  { section: "Recommendations", included: 65, customizable: true }
]

const automationBenefits = [
  { benefit: "Time Saved", value: 85, unit: "%", description: "Reduction in manual work" },
  { benefit: "Accuracy", value: 98, unit: "%", description: "Data accuracy rate" },
  { benefit: "Consistency", value: 100, unit: "%", description: "Format standardization" },
  { benefit: "Frequency", value: 4, unit: "x", description: "More reports generated" }
]

const COLORS = {
  primary: "#3B82F6",
  secondary: "#8B5CF6",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#06B6D4"
}

export default function Phase329Demo() {
  const [activeTab, setActiveTab] = React.useState("overview")
  const [selectedReportType, setSelectedReportType] = React.useState("executive_summary")
  const [selectedExportFormat, setSelectedExportFormat] = React.useState("pdf")

  const handleGenerateReport = (reportType: string, format: string) => {
    console.log("Generating report:", reportType, "in format:", format)
  }

  const handleScheduleReport = (schedule: any) => {
    console.log("Scheduling report:", schedule)
  }

  const handleExportData = (format: string, delivery: string) => {
    console.log("Exporting data:", format, "via", delivery)
  }

  const handleTemplateAction = (templateId: string, action: string) => {
    console.log("Template action:", templateId, action)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-gray-50 dark:from-gray-900 dark:to-gray-800">
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
                <h1 className="text-xl font-semibold">Phase 3.2.9 Demo</h1>
                <p className="text-sm text-gray-600">Report Generation & Export</p>
              </div>
              <Badge variant="secondary" className="bg-slate-100 text-slate-800">
                Professional Reports
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-gray-50 text-gray-700">
                Export System
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileBarChart className="h-4 w-4" />
              Report Types
            </TabsTrigger>
            <TabsTrigger value="automation" className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Automation
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
                  <FileText className="h-5 w-5 text-slate-600" />
                  Report Generation Framework
                </CardTitle>
                <CardDescription>
                  Five report types with multiple export formats and delivery options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Report Types Summary */}
                  <div>
                    <h4 className="font-semibold mb-4">Available Report Types</h4>
                    <div className="space-y-3">
                      {reportTypesOverview.map((report, index) => (
                        <motion.div
                          key={report.type}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded"
                                style={{ backgroundColor: report.color }}
                              />
                              <h5 className="font-medium text-sm">{report.type}</h5>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {report.customization}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                            <div>Frequency: {report.frequency}</div>
                            <div>Data Points: {report.dataPoints}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Export Formats */}
                  <div>
                    <h4 className="font-semibold mb-4">Export Format Comparison</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={exportFormatsComparison}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="format" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <Radar
                            name="File Size (MB)"
                            dataKey="fileSize"
                            stroke={COLORS.primary}
                            fill={COLORS.primary}
                            fillOpacity={0.3}
                          />
                          <Radar
                            name="Compatibility %"
                            dataKey="compatibility"
                            stroke={COLORS.success}
                            fill={COLORS.success}
                            fillOpacity={0.1}
                          />
                          <Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Methods & Scheduling */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Send className="h-5 w-5 text-blue-600" />
                    Delivery Methods
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {deliveryMethods.map((method) => {
                      const Icon = method.icon
                      return (
                        <div key={method.method} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Icon className="h-5 w-5 text-gray-600" />
                            <div>
                              <h5 className="font-medium text-sm">{method.method}</h5>
                              <p className="text-xs text-gray-500">Last: {method.lastUsed}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={method.usage} className="w-20 h-2" />
                            <span className="text-sm font-medium">{method.usage}%</span>
                            {method.configured ? (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    Scheduling Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {schedulingOptions.map((option) => {
                      const Icon = option.icon
                      return (
                        <div key={option.type} className="flex items-center justify-between p-3 bg-white dark:bg-gray-900 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg bg-gray-100 dark:bg-gray-800", option.color)}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <h5 className="font-medium text-sm">{option.type}</h5>
                              <p className="text-xs text-gray-500">{option.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold">{option.usage}%</div>
                            <div className="text-xs text-gray-500">usage</div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Report Types Tab */}
          <TabsContent value="reports" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  Report Generation Statistics
                </CardTitle>
                <CardDescription>
                  Monthly report generation trends and patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={reportGenerationStats}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="scheduled" stackId="a" fill={COLORS.primary} name="Scheduled" />
                      <Bar dataKey="manual" stackId="a" fill={COLORS.secondary} name="Manual" />
                      <Line
                        type="monotone"
                        dataKey="generated"
                        stroke={COLORS.success}
                        strokeWidth={3}
                        name="Total Generated"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Data Export Volume */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5 text-orange-600" />
                    Export Volume by Format
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dataExportVolume}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="week" />
                        <YAxis />
                        <Tooltip />
                        <Area type="monotone" dataKey="csv" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} name="CSV" />
                        <Area type="monotone" dataKey="excel" stackId="1" stroke="#059669" fill="#059669" fillOpacity={0.6} name="Excel" />
                        <Area type="monotone" dataKey="pdf" stackId="1" stroke="#EF4444" fill="#EF4444" fillOpacity={0.6} name="PDF" />
                        <Area type="monotone" dataKey="json" stackId="1" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.6} name="JSON" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Report Sections */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Layout className="h-5 w-5 text-cyan-600" />
                    Report Sections Usage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {reportSections.map((section, index) => (
                      <motion.div
                        key={section.section}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{section.section}</span>
                          {section.customizable && (
                            <Badge variant="outline" className="text-xs">
                              Customizable
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Progress value={section.included} className="w-24 h-2" />
                          <span className="text-sm font-medium w-12 text-right">{section.included}%</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Automation Tab */}
          <TabsContent value="automation" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Automation Benefits
                </CardTitle>
                <CardDescription>
                  Impact of automated report generation and scheduling
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {automationBenefits.map((benefit) => (
                    <div key={benefit.benefit} className="text-center">
                      <div className="text-3xl font-bold text-blue-600">
                        {benefit.value}{benefit.unit}
                      </div>
                      <div className="text-sm font-medium mt-1">{benefit.benefit}</div>
                      <div className="text-xs text-gray-500 mt-1">{benefit.description}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Export Features Matrix */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-indigo-600" />
                  Export Features Matrix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Feature</th>
                        <th className="text-center p-2">CSV</th>
                        <th className="text-center p-2">Excel</th>
                        <th className="text-center p-2">PDF</th>
                        <th className="text-center p-2">JSON</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { feature: "Raw Data", csv: true, excel: true, pdf: false, json: true },
                        { feature: "Formatting", csv: false, excel: true, pdf: true, json: false },
                        { feature: "Charts", csv: false, excel: true, pdf: true, json: false },
                        { feature: "Compression", csv: false, excel: true, pdf: true, json: false },
                        { feature: "API Ready", csv: false, excel: false, pdf: false, json: true },
                        { feature: "Print Ready", csv: false, excel: true, pdf: true, json: false }
                      ].map((row) => (
                        <tr key={row.feature} className="border-b">
                          <td className="p-2 font-medium">{row.feature}</td>
                          <td className="text-center p-2">
                            {row.csv ? <CheckCircle className="h-4 w-4 text-green-600 mx-auto" /> : <X className="h-4 w-4 text-gray-400 mx-auto" />}
                          </td>
                          <td className="text-center p-2">
                            {row.excel ? <CheckCircle className="h-4 w-4 text-green-600 mx-auto" /> : <X className="h-4 w-4 text-gray-400 mx-auto" />}
                          </td>
                          <td className="text-center p-2">
                            {row.pdf ? <CheckCircle className="h-4 w-4 text-green-600 mx-auto" /> : <X className="h-4 w-4 text-gray-400 mx-auto" />}
                          </td>
                          <td className="text-center p-2">
                            {row.json ? <CheckCircle className="h-4 w-4 text-green-600 mx-auto" /> : <X className="h-4 w-4 text-gray-400 mx-auto" />}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* Quick Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-purple-600" />
                  Advanced Features
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold mb-3">Scheduling Capabilities</h5>
                    <ul className="space-y-2 text-sm">
                      {[
                        "One-time report generation",
                        "Recurring schedules (daily, weekly, monthly)",
                        "Event-triggered reports",
                        "Custom frequency options",
                        "Timezone-aware scheduling"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-blue-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-3">Delivery Options</h5>
                    <ul className="space-y-2 text-sm">
                      {[
                        "Direct download links",
                        "Email delivery with attachments",
                        "Cloud storage integration",
                        "API webhook delivery",
                        "Batch export capabilities"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Send className="h-4 w-4 text-green-600" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Demo Tab */}
          <TabsContent value="demo" className="space-y-6">
            <Alert className="border-slate-200 bg-slate-50 dark:bg-slate-900/20">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                <strong>Interactive Demo:</strong> Experience the complete Report Generation & Export system with 
                5 report types, 4 export formats, scheduling options, delivery methods, and template library. 
                Generate professional reports for tax purposes, business planning, and performance reviews.
              </AlertDescription>
            </Alert>

            <ReportGenerationExport
              onGenerateReport={handleGenerateReport}
              onScheduleReport={handleScheduleReport}
              onExportData={handleExportData}
              onTemplateAction={handleTemplateAction}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}