"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  FileText,
  Plus,
  Save,
  Download,
  Calendar as CalendarIcon,
  Clock,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  TableIcon,
  Database,
  Layers,
  Settings,
  Play,
  Pause,
  Mail,
  Share2,
  Code,
  Eye,
  Edit,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronRight,
  Grid,
  List,
  Columns,
  Users,
  DollarSign,
  Video,
  Star,
  TrendingUp
} from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: string
  metrics: string[]
  visualizations: string[]
  schedule?: string
  lastRun?: string
  status: "active" | "draft" | "archived"
}

interface DataSource {
  id: string
  name: string
  type: string
  icon: any
  fields: string[]
  available: boolean
}

interface ReportField {
  id: string
  name: string
  type: "dimension" | "metric"
  dataType: "string" | "number" | "date" | "boolean"
  aggregations?: string[]
}

interface SavedReport {
  id: string
  name: string
  createdBy: string
  createdAt: string
  lastModified: string
  schedule: string
  recipients: string[]
  format: string
  status: "scheduled" | "manual" | "paused"
}

const reportTemplates: ReportTemplate[] = [
  {
    id: "template-1",
    name: "Monthly Revenue Report",
    description: "Comprehensive revenue analysis with breakdowns",
    category: "Financial",
    metrics: ["Revenue", "Transactions", "AOV", "Growth"],
    visualizations: ["Line Chart", "Bar Chart", "Table"],
    schedule: "Monthly",
    lastRun: "2024-03-01",
    status: "active"
  },
  {
    id: "template-2",
    name: "Creator Performance Dashboard",
    description: "Creator metrics and rankings",
    category: "Performance",
    metrics: ["Videos", "Completion Rate", "Rating", "Revenue"],
    visualizations: ["Table", "Bar Chart", "Pie Chart"],
    schedule: "Weekly",
    lastRun: "2024-03-10",
    status: "active"
  },
  {
    id: "template-3",
    name: "User Engagement Analysis",
    description: "User behavior and engagement patterns",
    category: "Analytics",
    metrics: ["Active Users", "Sessions", "Duration", "Retention"],
    visualizations: ["Line Chart", "Cohort Grid", "Table"],
    status: "draft"
  }
]

const dataSources: DataSource[] = [
  {
    id: "users",
    name: "Users",
    type: "database",
    icon: Users,
    fields: ["User ID", "Name", "Email", "Join Date", "Location", "Status"],
    available: true
  },
  {
    id: "transactions",
    name: "Transactions",
    type: "database",
    icon: DollarSign,
    fields: ["Transaction ID", "Amount", "Date", "Type", "Status", "User ID"],
    available: true
  },
  {
    id: "videos",
    name: "Videos",
    type: "database",
    icon: Video,
    fields: ["Video ID", "Title", "Creator", "Duration", "Views", "Rating"],
    available: true
  },
  {
    id: "creators",
    name: "Creators",
    type: "database",
    icon: Star,
    fields: ["Creator ID", "Name", "Videos", "Rating", "Revenue", "Status"],
    available: true
  }
]

const reportFields: ReportField[] = [
  // Dimensions
  { id: "date", name: "Date", type: "dimension", dataType: "date" },
  { id: "creator", name: "Creator", type: "dimension", dataType: "string" },
  { id: "category", name: "Category", type: "dimension", dataType: "string" },
  { id: "country", name: "Country", type: "dimension", dataType: "string" },
  { id: "device", name: "Device Type", type: "dimension", dataType: "string" },
  // Metrics
  { id: "revenue", name: "Revenue", type: "metric", dataType: "number", aggregations: ["Sum", "Average", "Min", "Max"] },
  { id: "users", name: "Users", type: "metric", dataType: "number", aggregations: ["Count", "Unique"] },
  { id: "videos", name: "Videos", type: "metric", dataType: "number", aggregations: ["Count", "Sum"] },
  { id: "rating", name: "Rating", type: "metric", dataType: "number", aggregations: ["Average", "Min", "Max"] },
  { id: "duration", name: "Duration", type: "metric", dataType: "number", aggregations: ["Sum", "Average"] }
]

const savedReports: SavedReport[] = [
  {
    id: "report-1",
    name: "Q1 2024 Financial Summary",
    createdBy: "Admin User",
    createdAt: "2024-01-01",
    lastModified: "2024-03-15",
    schedule: "Quarterly",
    recipients: ["finance@annpale.com", "executives@annpale.com"],
    format: "PDF",
    status: "scheduled"
  },
  {
    id: "report-2",
    name: "Weekly Creator Performance",
    createdBy: "Admin User",
    createdAt: "2024-02-15",
    lastModified: "2024-03-10",
    schedule: "Weekly",
    recipients: ["creators@annpale.com"],
    format: "Excel",
    status: "scheduled"
  }
]

export function CustomReportsBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null)
  const [selectedDataSources, setSelectedDataSources] = useState<string[]>([])
  const [selectedFields, setSelectedFields] = useState<string[]>([])
  const [selectedVisualization, setSelectedVisualization] = useState("table")
  const [reportName, setReportName] = useState("")
  const [reportDescription, setReportDescription] = useState("")
  const [scheduleEnabled, setScheduleEnabled] = useState(false)
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date())
  const [activeTab, setActiveTab] = useState("templates")

  const handleDataSourceToggle = (sourceId: string) => {
    setSelectedDataSources(prev =>
      prev.includes(sourceId)
        ? prev.filter(id => id !== sourceId)
        : [...prev, sourceId]
    )
  }

  const handleFieldToggle = (fieldId: string) => {
    setSelectedFields(prev =>
      prev.includes(fieldId)
        ? prev.filter(id => id !== fieldId)
        : [...prev, fieldId]
    )
  }

  const getVisualizationIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "bar": return <BarChart3 className="h-4 w-4" />
      case "line": return <LineChart className="h-4 w-4" />
      case "pie": return <PieChart className="h-4 w-4" />
      case "table": return <TableIcon className="h-4 w-4" />
      case "grid": return <Grid className="h-4 w-4" />
      default: return <BarChart3 className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Custom Reports Builder</h2>
          <p className="text-gray-600">Create and schedule custom reports and dashboards</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Code className="h-4 w-4 mr-2" />
            API Access
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="builder">Report Builder</TabsTrigger>
          <TabsTrigger value="saved">Saved Reports</TabsTrigger>
          <TabsTrigger value="schedule">Schedule & Export</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>Start with a pre-built template or create from scratch</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportTemplates.map((template) => (
                  <Card 
                    key={template.id} 
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-lg",
                      selectedTemplate?.id === template.id && "ring-2 ring-blue-500"
                    )}
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <FileText className="h-5 w-5 text-gray-400" />
                        <Badge variant={template.status === "active" ? "default" : "secondary"}>
                          {template.status}
                        </Badge>
                      </div>
                      <h4 className="font-medium mb-1">{template.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                          <Layers className="h-3 w-3" />
                          <span>{template.metrics.length} metrics</span>
                        </div>
                        {template.schedule && (
                          <div className="flex items-center gap-2 text-xs">
                            <Clock className="h-3 w-3" />
                            <span>{template.schedule}</span>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-1 mt-2">
                          {template.visualizations.map((viz) => (
                            <Badge key={viz} variant="outline" className="text-xs">
                              {viz}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button 
                        className="w-full mt-3" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveTab("builder")
                        }}
                      >
                        Use Template
                      </Button>
                    </CardContent>
                  </Card>
                ))}
                <Card className="border-dashed">
                  <CardContent className="p-4 flex flex-col items-center justify-center h-full min-h-[200px]">
                    <Plus className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm font-medium">Create from Scratch</p>
                    <p className="text-xs text-gray-500 text-center mt-1">
                      Build a custom report with your own metrics
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-3"
                      onClick={() => setActiveTab("builder")}
                    >
                      Start Building
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="builder" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Data Configuration */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Data Sources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {dataSources.map((source) => {
                    const Icon = source.icon
                    return (
                      <div key={source.id} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            checked={selectedDataSources.includes(source.id)}
                            onCheckedChange={() => handleDataSourceToggle(source.id)}
                          />
                          <Icon className="h-4 w-4 text-gray-500" />
                          <span className="text-sm font-medium">{source.name}</span>
                        </div>
                        {source.available ? (
                          <Badge variant="outline" className="text-xs">
                            {source.fields.length} fields
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Unavailable</Badge>
                        )}
                      </div>
                    )
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Fields</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px]">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">Dimensions</p>
                        {reportFields.filter(f => f.type === "dimension").map((field) => (
                          <div key={field.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                            <Checkbox 
                              checked={selectedFields.includes(field.id)}
                              onCheckedChange={() => handleFieldToggle(field.id)}
                            />
                            <span className="text-sm">{field.name}</span>
                            <Badge variant="outline" className="text-xs ml-auto">
                              {field.dataType}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600 mb-2">Metrics</p>
                        {reportFields.filter(f => f.type === "metric").map((field) => (
                          <div key={field.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded">
                            <Checkbox 
                              checked={selectedFields.includes(field.id)}
                              onCheckedChange={() => handleFieldToggle(field.id)}
                            />
                            <span className="text-sm">{field.name}</span>
                            <Badge variant="outline" className="text-xs ml-auto">
                              {field.dataType}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            {/* Report Configuration */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Report Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="report-name">Report Name</Label>
                      <Input 
                        id="report-name"
                        placeholder="Enter report name"
                        value={reportName}
                        onChange={(e) => setReportName(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Date Range</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start">
                            <CalendarIcon className="h-4 w-4 mr-2" />
                            {dateRange ? format(dateRange, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={dateRange}
                            onSelect={setDateRange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="report-description">Description</Label>
                    <Textarea 
                      id="report-description"
                      placeholder="Describe the purpose of this report"
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label>Visualization Type</Label>
                    <RadioGroup value={selectedVisualization} onValueChange={setSelectedVisualization}>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {["table", "bar", "line", "pie", "grid", "mixed"].map((type) => (
                          <div key={type} className="flex items-center space-x-2">
                            <RadioGroupItem value={type} id={type} />
                            <Label htmlFor={type} className="flex items-center gap-2 cursor-pointer">
                              {getVisualizationIcon(type)}
                              <span className="capitalize">{type}</span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch 
                        id="schedule"
                        checked={scheduleEnabled}
                        onCheckedChange={setScheduleEnabled}
                      />
                      <Label htmlFor="schedule">Enable Scheduling</Label>
                    </div>
                    {scheduleEnabled && (
                      <Select defaultValue="weekly">
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>Preview your report with sample data</CardDescription>
                </CardHeader>
                <CardContent>
                  {selectedFields.length > 0 ? (
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-medium">
                          {reportName || "Untitled Report"}
                        </p>
                        <Badge variant="outline">
                          {selectedVisualization} view
                        </Badge>
                      </div>
                      <div className="h-64 flex items-center justify-center text-gray-500">
                        {getVisualizationIcon(selectedVisualization)}
                        <span className="ml-2">Report preview will appear here</span>
                      </div>
                    </div>
                  ) : (
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        Select data sources and fields to generate a preview
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-end gap-2">
                <Button variant="outline">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button variant="outline">
                  <Save className="h-4 w-4 mr-2" />
                  Save as Draft
                </Button>
                <Button>
                  <Play className="h-4 w-4 mr-2" />
                  Run Report
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Saved Reports</CardTitle>
              <CardDescription>Manage your custom reports and dashboards</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {savedReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>{report.createdBy}</TableCell>
                      <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{report.schedule}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.recipients.length} recipients</Badge>
                      </TableCell>
                      <TableCell>{report.format}</TableCell>
                      <TableCell>
                        <Badge variant={report.status === "scheduled" ? "default" : "secondary"}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Schedule Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Frequency</Label>
                  <Select defaultValue="weekly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="once">One Time</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Time</Label>
                  <Input type="time" defaultValue="09:00" />
                </div>

                <div>
                  <Label>Time Zone</Label>
                  <Select defaultValue="est">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="est">Eastern Time (EST)</SelectItem>
                      <SelectItem value="cst">Central Time (CST)</SelectItem>
                      <SelectItem value="mst">Mountain Time (MST)</SelectItem>
                      <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Switch id="auto-send" defaultChecked />
                  <Label htmlFor="auto-send">Automatically send report</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Export Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Export Format</Label>
                  <RadioGroup defaultValue="pdf">
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      {["pdf", "excel", "csv", "json"].map((format) => (
                        <div key={format} className="flex items-center space-x-2">
                          <RadioGroupItem value={format} id={`format-${format}`} />
                          <Label htmlFor={`format-${format}`} className="cursor-pointer uppercase">
                            {format}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label>Recipients</Label>
                  <Textarea 
                    placeholder="Enter email addresses separated by commas"
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Email Subject</Label>
                  <Input placeholder="Monthly Report - {date}" />
                </div>

                <Button className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Test Email
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>API Integration</CardTitle>
              <CardDescription>Access reports programmatically via API</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Code className="h-4 w-4" />
                <AlertDescription>
                  Use the following endpoint to retrieve this report via API
                </AlertDescription>
              </Alert>
              <div className="p-4 bg-gray-900 text-gray-100 rounded-lg font-mono text-sm">
                GET https://api.annpale.com/v1/reports/{"{report_id}"}/execute
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Endpoint
                </Button>
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  View API Docs
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}