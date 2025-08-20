"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileText,
  Download,
  Mail,
  Cloud,
  Calendar as CalendarIcon,
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
  PieChart,
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
  Sparkles
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

// Types
export interface ReportType {
  id: string
  name: string
  purpose: string
  formatOptions: string[]
  frequency: string[]
  customization: "minimal" | "standard" | "moderate" | "extensive" | "full"
  icon: React.ElementType
  color: string
  estimatedTime: string
  lastGenerated?: Date
  sections?: string[]
  dataPoints?: number
}

export interface ExportFormat {
  id: string
  name: string
  extension: string
  icon: React.ElementType
  color: string
  features: string[]
  maxSize?: string
  compression?: boolean
}

export interface ScheduleOption {
  id: string
  type: "one-time" | "recurring" | "triggered"
  frequency?: "daily" | "weekly" | "monthly" | "quarterly" | "annual"
  time?: string
  condition?: string
  lastRun?: Date
  nextRun?: Date
  status: "active" | "paused" | "completed"
}

export interface DeliveryMethod {
  id: string
  type: "download" | "email" | "cloud" | "api"
  destination?: string
  icon: React.ElementType
  configured: boolean
  lastUsed?: Date
}

export interface ReportTemplate {
  id: string
  name: string
  type: string
  created: Date
  modified: Date
  used: number
  shared: boolean
  tags: string[]
}

export interface ReportGenerationExportProps {
  onGenerateReport?: (reportType: string, format: string) => void
  onScheduleReport?: (schedule: ScheduleOption) => void
  onExportData?: (format: string, delivery: string) => void
  onTemplateAction?: (templateId: string, action: string) => void
}

// Mock data generators
const generateReportTypes = (): ReportType[] => {
  return [
    {
      id: "executive_summary",
      name: "Executive Summary",
      purpose: "Quick overview of key metrics and performance",
      formatOptions: ["PDF", "Email"],
      frequency: ["Weekly", "Monthly"],
      customization: "minimal",
      icon: Briefcase,
      color: "text-blue-600",
      estimatedTime: "2 min",
      lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      sections: ["KPIs", "Trends", "Highlights", "Recommendations"],
      dataPoints: 25
    },
    {
      id: "detailed_analytics",
      name: "Detailed Analytics",
      purpose: "Deep analysis with comprehensive metrics",
      formatOptions: ["PDF", "Excel"],
      frequency: ["Monthly", "Quarterly"],
      customization: "full",
      icon: BarChart3,
      color: "text-purple-600",
      estimatedTime: "5 min",
      lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      sections: ["Performance", "Audience", "Content", "Revenue", "Trends"],
      dataPoints: 150
    },
    {
      id: "financial_statement",
      name: "Financial Statement",
      purpose: "Tax and accounting documentation",
      formatOptions: ["CSV", "PDF"],
      frequency: ["Monthly", "Annual"],
      customization: "standard",
      icon: Calculator,
      color: "text-green-600",
      estimatedTime: "3 min",
      lastGenerated: new Date(Date.now() - 1000 * 60 * 60 * 24),
      sections: ["Income", "Expenses", "Taxes", "Summary"],
      dataPoints: 75
    },
    {
      id: "performance_report",
      name: "Performance Report",
      purpose: "Goal tracking and achievement analysis",
      formatOptions: ["PDF", "Dashboard"],
      frequency: ["Custom"],
      customization: "extensive",
      icon: Target,
      color: "text-orange-600",
      estimatedTime: "4 min",
      sections: ["Goals", "Progress", "Achievements", "Gaps", "Actions"],
      dataPoints: 100
    },
    {
      id: "customer_report",
      name: "Customer Report",
      purpose: "Audience insights and engagement analysis",
      formatOptions: ["PDF", "PPT"],
      frequency: ["Quarterly"],
      customization: "moderate",
      icon: Users,
      color: "text-pink-600",
      estimatedTime: "3 min",
      sections: ["Demographics", "Behavior", "Preferences", "Feedback"],
      dataPoints: 80
    }
  ]
}

const generateExportFormats = (): ExportFormat[] => {
  return [
    {
      id: "csv",
      name: "CSV",
      extension: ".csv",
      icon: FileSpreadsheet,
      color: "text-green-600",
      features: ["Raw data", "Excel compatible", "Small file size"],
      maxSize: "50MB",
      compression: false
    },
    {
      id: "excel",
      name: "Excel",
      extension: ".xlsx",
      icon: FileBarChart,
      color: "text-green-700",
      features: ["Formatted tables", "Multiple sheets", "Charts included"],
      maxSize: "25MB",
      compression: true
    },
    {
      id: "pdf",
      name: "PDF",
      extension: ".pdf",
      icon: FileText,
      color: "text-red-600",
      features: ["Professional design", "Print-ready", "Secure"],
      maxSize: "10MB",
      compression: true
    },
    {
      id: "json",
      name: "JSON",
      extension: ".json",
      icon: FileJson,
      color: "text-purple-600",
      features: ["API ready", "Machine readable", "Structured data"],
      maxSize: "100MB",
      compression: false
    }
  ]
}

const generateScheduleOptions = (): ScheduleOption[] => {
  return [
    {
      id: "sch_1",
      type: "recurring",
      frequency: "weekly",
      time: "Monday 9:00 AM",
      lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      nextRun: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      status: "active"
    },
    {
      id: "sch_2",
      type: "recurring",
      frequency: "monthly",
      time: "1st of month",
      lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24 * 15),
      nextRun: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
      status: "active"
    },
    {
      id: "sch_3",
      type: "triggered",
      condition: "Revenue > $5000",
      lastRun: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
      status: "active"
    },
    {
      id: "sch_4",
      type: "one-time",
      time: "Dec 31, 2024",
      status: "completed"
    }
  ]
}

const generateDeliveryMethods = (): DeliveryMethod[] => {
  return [
    {
      id: "download",
      type: "download",
      icon: Download,
      configured: true,
      lastUsed: new Date()
    },
    {
      id: "email",
      type: "email",
      destination: "creator@example.com",
      icon: Mail,
      configured: true,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24)
    },
    {
      id: "cloud",
      type: "cloud",
      destination: "Google Drive",
      icon: Cloud,
      configured: true,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3)
    },
    {
      id: "api",
      type: "api",
      destination: "webhook.site/123",
      icon: Zap,
      configured: false
    }
  ]
}

const generateReportTemplates = (): ReportTemplate[] => {
  return [
    {
      id: "tpl_1",
      name: "Monthly Performance Review",
      type: "Performance Report",
      created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
      modified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      used: 12,
      shared: true,
      tags: ["monthly", "performance", "standard"]
    },
    {
      id: "tpl_2",
      name: "Q4 Financial Summary",
      type: "Financial Statement",
      created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
      modified: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
      used: 4,
      shared: false,
      tags: ["quarterly", "financial", "tax"]
    },
    {
      id: "tpl_3",
      name: "Weekly Dashboard Export",
      type: "Executive Summary",
      created: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
      modified: new Date(Date.now() - 1000 * 60 * 60 * 24),
      used: 8,
      shared: true,
      tags: ["weekly", "dashboard", "quick"]
    }
  ]
}

// Sub-components
const ReportTypeCard: React.FC<{
  report: ReportType
  onGenerate: () => void
}> = ({ report, onGenerate }) => {
  const Icon = report.icon

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg bg-gray-100 dark:bg-gray-800", report.color)}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">{report.name}</CardTitle>
              <CardDescription className="text-sm mt-1">
                {report.purpose}
              </CardDescription>
            </div>
          </div>
          <Badge 
            variant="outline"
            className={cn(
              report.customization === "minimal" && "border-gray-300",
              report.customization === "standard" && "border-blue-300",
              report.customization === "moderate" && "border-purple-300",
              report.customization === "extensive" && "border-orange-300",
              report.customization === "full" && "border-green-300"
            )}
          >
            {report.customization}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Formats: </span>
              <span className="font-medium">{report.formatOptions.join(", ")}</span>
            </div>
            <div>
              <span className="text-gray-600">Frequency: </span>
              <span className="font-medium">{report.frequency.join(", ")}</span>
            </div>
            <div>
              <span className="text-gray-600">Est. Time: </span>
              <span className="font-medium">{report.estimatedTime}</span>
            </div>
            <div>
              <span className="text-gray-600">Data Points: </span>
              <span className="font-medium">{report.dataPoints}</span>
            </div>
          </div>

          {report.sections && (
            <div>
              <h5 className="text-sm font-medium mb-2">Report Sections:</h5>
              <div className="flex flex-wrap gap-1">
                {report.sections.map(section => (
                  <Badge key={section} variant="secondary" className="text-xs">
                    {section}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {report.lastGenerated && (
            <div className="text-xs text-gray-500">
              Last generated: {report.lastGenerated.toLocaleDateString()}
            </div>
          )}

          <Button onClick={onGenerate} className="w-full">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const ExportFormatSelector: React.FC<{
  formats: ExportFormat[]
  selectedFormat: string
  onSelectFormat: (format: string) => void
}> = ({ formats, selectedFormat, onSelectFormat }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {formats.map(format => {
        const Icon = format.icon
        const isSelected = selectedFormat === format.id

        return (
          <motion.div
            key={format.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all",
                isSelected && "ring-2 ring-blue-500"
              )}
              onClick={() => onSelectFormat(format.id)}
            >
              <CardContent className="p-4">
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className={cn("p-2 rounded-lg bg-gray-100 dark:bg-gray-800", format.color)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h5 className="font-medium">{format.name}</h5>
                    <p className="text-xs text-gray-500">{format.extension}</p>
                  </div>
                  <div className="space-y-1">
                    {format.features.map((feature, index) => (
                      <div key={index} className="text-xs text-gray-600">
                        • {feature}
                      </div>
                    ))}
                  </div>
                  {format.maxSize && (
                    <Badge variant="outline" className="text-xs">
                      Max: {format.maxSize}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

const ScheduleManager: React.FC<{
  schedules: ScheduleOption[]
  onAddSchedule: () => void
  onEditSchedule: (id: string) => void
  onToggleSchedule: (id: string) => void
}> = ({ schedules, onAddSchedule, onEditSchedule, onToggleSchedule }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Scheduled Reports</h4>
        <Button size="sm" onClick={onAddSchedule}>
          <Plus className="h-4 w-4 mr-1" />
          Add Schedule
        </Button>
      </div>

      <div className="space-y-3">
        {schedules.map(schedule => (
          <Card key={schedule.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={schedule.type === "recurring" ? "default" : 
                                 schedule.type === "triggered" ? "secondary" : "outline"}>
                      {schedule.type}
                    </Badge>
                    {schedule.frequency && (
                      <Badge variant="outline">{schedule.frequency}</Badge>
                    )}
                    <Badge 
                      variant={schedule.status === "active" ? "default" : 
                             schedule.status === "paused" ? "secondary" : "outline"}
                      className={cn(
                        schedule.status === "active" && "bg-green-100 text-green-800",
                        schedule.status === "paused" && "bg-yellow-100 text-yellow-800",
                        schedule.status === "completed" && "bg-gray-100 text-gray-800"
                      )}
                    >
                      {schedule.status}
                    </Badge>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    {schedule.time && (
                      <div>
                        <Clock className="h-3 w-3 inline mr-1" />
                        {schedule.time}
                      </div>
                    )}
                    {schedule.condition && (
                      <div>
                        <Zap className="h-3 w-3 inline mr-1" />
                        Trigger: {schedule.condition}
                      </div>
                    )}
                    {schedule.nextRun && (
                      <div className="text-xs text-gray-500">
                        Next run: {schedule.nextRun.toLocaleDateString()}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={schedule.status === "active"}
                    onCheckedChange={() => onToggleSchedule(schedule.id)}
                    disabled={schedule.status === "completed"}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEditSchedule(schedule.id)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const DeliveryMethodSelector: React.FC<{
  methods: DeliveryMethod[]
  selectedMethod: string
  onSelectMethod: (method: string) => void
}> = ({ methods, selectedMethod, onSelectMethod }) => {
  return (
    <div className="space-y-3">
      {methods.map(method => {
        const Icon = method.icon
        const isSelected = selectedMethod === method.id

        return (
          <Card
            key={method.id}
            className={cn(
              "cursor-pointer transition-all",
              isSelected && "ring-2 ring-blue-500",
              !method.configured && "opacity-60"
            )}
            onClick={() => method.configured && onSelectMethod(method.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" />
                  <div>
                    <h5 className="font-medium capitalize">{method.type}</h5>
                    {method.destination && (
                      <p className="text-sm text-gray-600">{method.destination}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {method.configured ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                  )}
                  <RadioGroupItem value={method.id} checked={isSelected} />
                </div>
              </div>
              
              {method.lastUsed && (
                <div className="mt-2 text-xs text-gray-500">
                  Last used: {method.lastUsed.toLocaleDateString()}
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

const TemplateLibrary: React.FC<{
  templates: ReportTemplate[]
  onUseTemplate: (id: string) => void
  onEditTemplate: (id: string) => void
  onShareTemplate: (id: string) => void
}> = ({ templates, onUseTemplate, onEditTemplate, onShareTemplate }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold">Saved Templates</h4>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4 mr-1" />
          Create Template
        </Button>
      </div>

      <div className="grid gap-3">
        {templates.map(template => (
          <Card key={template.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h5 className="font-medium">{template.name}</h5>
                    {template.shared && (
                      <Badge variant="outline" className="text-xs">
                        <Share2 className="h-3 w-3 mr-1" />
                        Shared
                      </Badge>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-600 mb-2">
                    Type: {template.type}
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {template.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Used {template.used} times</span>
                    <span>Modified {new Date(template.modified).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <Button
                    size="sm"
                    onClick={() => onUseTemplate(template.id)}
                  >
                    Use
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEditTemplate(template.id)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onShareTemplate(template.id)}
                  >
                    Share
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Main component
export const ReportGenerationExport: React.FC<ReportGenerationExportProps> = ({
  onGenerateReport,
  onScheduleReport,
  onExportData,
  onTemplateAction
}) => {
  const [reportTypes] = React.useState<ReportType[]>(generateReportTypes())
  const [exportFormats] = React.useState<ExportFormat[]>(generateExportFormats())
  const [schedules] = React.useState<ScheduleOption[]>(generateScheduleOptions())
  const [deliveryMethods] = React.useState<DeliveryMethod[]>(generateDeliveryMethods())
  const [templates] = React.useState<ReportTemplate[]>(generateReportTemplates())
  
  const [selectedReportType, setSelectedReportType] = React.useState<string>("executive_summary")
  const [selectedFormat, setSelectedFormat] = React.useState<string>("pdf")
  const [selectedDelivery, setSelectedDelivery] = React.useState<string>("download")
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [generationProgress, setGenerationProgress] = React.useState(0)

  // Simulate report generation
  const handleGenerateReport = (reportType: string, format: string) => {
    setIsGenerating(true)
    setGenerationProgress(0)
    
    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          onGenerateReport?.(reportType, format)
          return 100
        }
        return prev + 20
      })
    }, 500)
  }

  return (
    <div className="space-y-6">
      {/* Report Types Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Available Reports</h3>
          <Badge variant="outline">
            5 report types
          </Badge>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reportTypes.map(report => (
            <ReportTypeCard
              key={report.id}
              report={report}
              onGenerate={() => handleGenerateReport(report.id, selectedFormat)}
            />
          ))}
        </div>
      </div>

      <Separator />

      {/* Export Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Export Configuration</CardTitle>
          <CardDescription>
            Choose format and delivery options for your reports
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Format Selection */}
          <div>
            <Label className="text-base mb-3 block">Export Format</Label>
            <ExportFormatSelector
              formats={exportFormats}
              selectedFormat={selectedFormat}
              onSelectFormat={setSelectedFormat}
            />
          </div>

          {/* Delivery Method */}
          <div>
            <Label className="text-base mb-3 block">Delivery Method</Label>
            <RadioGroup value={selectedDelivery} onValueChange={setSelectedDelivery}>
              <DeliveryMethodSelector
                methods={deliveryMethods}
                selectedMethod={selectedDelivery}
                onSelectMethod={setSelectedDelivery}
              />
            </RadioGroup>
          </div>

          {/* Export Button */}
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-600">
              Format: <span className="font-medium">{selectedFormat.toUpperCase()}</span> • 
              Delivery: <span className="font-medium capitalize">{selectedDelivery}</span>
            </div>
            <Button 
              onClick={() => onExportData?.(selectedFormat, selectedDelivery)}
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export Data
                </>
              )}
            </Button>
          </div>

          {/* Generation Progress */}
          {isGenerating && (
            <div className="space-y-2">
              <Progress value={generationProgress} />
              <p className="text-sm text-center text-gray-600">
                Generating report... {generationProgress}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Schedule Management */}
      <Card>
        <CardHeader>
          <CardTitle>Report Scheduling</CardTitle>
          <CardDescription>
            Automate report generation and delivery
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScheduleManager
            schedules={schedules}
            onAddSchedule={() => console.log("Add schedule")}
            onEditSchedule={(id) => console.log("Edit schedule:", id)}
            onToggleSchedule={(id) => console.log("Toggle schedule:", id)}
          />
        </CardContent>
      </Card>

      {/* Template Library */}
      <Card>
        <CardHeader>
          <CardTitle>Template Library</CardTitle>
          <CardDescription>
            Save and reuse report configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TemplateLibrary
            templates={templates}
            onUseTemplate={(id) => onTemplateAction?.(id, "use")}
            onEditTemplate={(id) => onTemplateAction?.(id, "edit")}
            onShareTemplate={(id) => onTemplateAction?.(id, "share")}
          />
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">47</div>
              <div className="text-sm text-gray-600 mt-1">Reports Generated</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">12</div>
              <div className="text-sm text-gray-600 mt-1">Active Schedules</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">8</div>
              <div className="text-sm text-gray-600 mt-1">Templates Saved</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">3.2GB</div>
              <div className="text-sm text-gray-600 mt-1">Data Exported</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}