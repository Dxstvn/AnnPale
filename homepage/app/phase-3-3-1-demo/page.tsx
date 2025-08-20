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
  Radar,
  Sankey
} from "recharts"
import {
  ArrowLeft,
  Brain,
  Folder,
  FolderOpen,
  FolderTree,
  Clock,
  Calendar,
  Users,
  User,
  Gift,
  Heart,
  Star,
  Tag,
  Hash,
  Grid,
  List,
  Layers,
  Archive,
  FileText,
  FileVideo,
  Film,
  Video,
  PlayCircle,
  Upload,
  Download,
  Send,
  Check,
  CheckCircle,
  AlertCircle,
  Info,
  Edit,
  Trash,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Settings,
  Filter,
  Search,
  Zap,
  Sparkles,
  Trophy,
  Award,
  Target,
  Briefcase,
  Package,
  Box,
  Database,
  HardDrive,
  Save,
  RefreshCw,
  Activity,
  BarChart3,
  PieChart as PieIcon,
  TrendingUp,
  Layout,
  Palette,
  Wand2,
  Camera,
  Timer,
  CalendarDays,
  UserCircle,
  UserCheck,
  History,
  FastForward,
  Rewind,
  Pause,
  Play,
  Lightbulb,
  BookOpen,
  GraduationCap,
  Workflow
} from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ContentOrganizationPsychology } from "@/components/creator/content/content-organization-psychology"

// Demo data for visualizations
const personaDistribution = [
  { name: "Systematic", value: 35, color: "#3B82F6" },
  { name: "Time-based", value: 25, color: "#10B981" },
  { name: "Project", value: 20, color: "#8B5CF6" },
  { name: "Minimal", value: 15, color: "#6B7280" },
  { name: "Power User", value: 5, color: "#F97316" }
]

const organizationPatternUsage = [
  { pattern: "By Status", usage: 78, effectiveness: 85 },
  { pattern: "By Date", usage: 71, effectiveness: 82 },
  { pattern: "By Customer", usage: 65, effectiveness: 88 },
  { pattern: "By Occasion", usage: 52, effectiveness: 75 },
  { pattern: "By Quality", usage: 38, effectiveness: 70 }
]

const contentLifecycleTime = [
  { stage: "Creation", time: 30, subStages: 3 },
  { stage: "Processing", time: 45, subStages: 3 },
  { stage: "Delivery", time: 15, subStages: 3 },
  { stage: "Archive", time: 5, subStages: 3 }
]

const workflowEfficiency = [
  { persona: "Systematic", before: 45, after: 15, improvement: 67 },
  { persona: "Time-based", before: 35, after: 12, improvement: 66 },
  { persona: "Project", before: 40, after: 18, improvement: 55 },
  { persona: "Minimal", before: 20, after: 5, improvement: 75 },
  { persona: "Power User", before: 60, after: 20, improvement: 67 }
]

const painPointResolution = [
  { painPoint: "Finding old content", severity: 85, resolved: 92 },
  { painPoint: "Scrolling through history", severity: 78, resolved: 88 },
  { painPoint: "Switching contexts", severity: 72, resolved: 85 },
  { painPoint: "Complex systems", severity: 68, resolved: 90 },
  { painPoint: "Limited options", severity: 45, resolved: 95 }
]

const mentalModelAlignment = [
  { aspect: "Folder Structure", alignment: 92 },
  { aspect: "Naming Convention", alignment: 88 },
  { aspect: "Search Behavior", alignment: 85 },
  { aspect: "Filtering Logic", alignment: 82 },
  { aspect: "Archive Strategy", alignment: 78 },
  { aspect: "Tag Usage", alignment: 72 }
]

const automationImpact = [
  { task: "File Organization", manual: 15, automated: 2, saved: 13 },
  { task: "Metadata Tagging", manual: 10, automated: 1, saved: 9 },
  { task: "Status Updates", manual: 5, automated: 0.5, saved: 4.5 },
  { task: "Archiving", manual: 8, automated: 1, saved: 7 },
  { task: "Categorization", manual: 12, automated: 2, saved: 10 }
]

const userSatisfactionMetrics = [
  { metric: "Ease of Use", score: 4.8, benchmark: 4.2 },
  { metric: "Organization", score: 4.7, benchmark: 3.9 },
  { metric: "Time Saving", score: 4.9, benchmark: 4.1 },
  { metric: "Mental Model Fit", score: 4.6, benchmark: 3.8 },
  { metric: "Overall Satisfaction", score: 4.8, benchmark: 4.0 }
]

const COLORS = {
  primary: "#3B82F6",
  secondary: "#10B981",
  tertiary: "#8B5CF6",
  quaternary: "#F97316",
  neutral: "#6B7280",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444"
}

export default function Phase331Demo() {
  const [activeTab, setActiveTab] = React.useState("overview")
  const [selectedPersona, setSelectedPersona] = React.useState("systematic")
  const [selectedPattern, setSelectedPattern] = React.useState("by_status")

  const handlePersonaSelect = (personaId: string) => {
    setSelectedPersona(personaId)
    console.log("Selected persona:", personaId)
  }

  const handlePatternSelect = (patternId: string) => {
    setSelectedPattern(patternId)
    console.log("Selected pattern:", patternId)
  }

  const handleWorkflowCreate = (workflow: any) => {
    console.log("Creating workflow:", workflow)
  }

  const handleContentReorganize = (items: any[], pattern: string) => {
    console.log("Reorganizing content:", items.length, "items by", pattern)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
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
                <h1 className="text-xl font-semibold">Phase 3.3.1 Demo</h1>
                <p className="text-sm text-gray-600">Content Organization Psychology</p>
              </div>
              <Badge variant="secondary" className="bg-indigo-100 text-indigo-800">
                <Brain className="h-3 w-3 mr-1" />
                Mental Models
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                Psychology-Driven
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
              <Brain className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="personas" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Personas
            </TabsTrigger>
            <TabsTrigger value="patterns" className="flex items-center gap-2">
              <FolderTree className="h-4 w-4" />
              Patterns
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
                  <Brain className="h-5 w-5 text-indigo-600" />
                  Content Organization Psychology Framework
                </CardTitle>
                <CardDescription>
                  Understanding how creators think about and organize their content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Persona Distribution */}
                  <div>
                    <h4 className="font-semibold mb-4">Creator Persona Distribution</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={personaDistribution}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={100}
                            paddingAngle={2}
                            dataKey="value"
                          >
                            {personaDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value: number) => `${value}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="flex flex-wrap justify-center gap-3 mt-4">
                      {personaDistribution.map((persona) => (
                        <div key={persona.name} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ backgroundColor: persona.color }}
                          />
                          <span className="text-sm">{persona.name}: {persona.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Lifecycle Time Distribution */}
                  <div>
                    <h4 className="font-semibold mb-4">Content Lifecycle Time Distribution</h4>
                    <div style={{ width: '100%', height: 250 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={contentLifecycleTime}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="stage" />
                          <YAxis />
                          <Tooltip formatter={(value: number) => `${value} min`} />
                          <Bar dataKey="time" fill={COLORS.primary}>
                            {contentLifecycleTime.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS.primary} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Mental Model Alignment & User Satisfaction */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-yellow-600" />
                    Mental Model Alignment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mentalModelAlignment.map((aspect) => (
                      <div key={aspect.aspect}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{aspect.aspect}</span>
                          <span className="text-sm font-bold">{aspect.alignment}%</span>
                        </div>
                        <Progress value={aspect.alignment} className="h-2" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    User Satisfaction Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={userSatisfactionMetrics}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="metric" />
                        <PolarRadiusAxis angle={90} domain={[0, 5]} />
                        <Radar
                          name="Our System"
                          dataKey="score"
                          stroke={COLORS.primary}
                          fill={COLORS.primary}
                          fillOpacity={0.3}
                        />
                        <Radar
                          name="Industry Benchmark"
                          dataKey="benchmark"
                          stroke={COLORS.neutral}
                          fill={COLORS.neutral}
                          fillOpacity={0.1}
                        />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Personas Tab */}
          <TabsContent value="personas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Workflow Efficiency by Persona
                </CardTitle>
                <CardDescription>
                  Time saved through persona-optimized workflows
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={workflowEfficiency}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="persona" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="before" fill={COLORS.neutral} name="Before (min)" />
                      <Bar dataKey="after" fill={COLORS.success} name="After (min)" />
                      <Line
                        type="monotone"
                        dataKey="improvement"
                        stroke={COLORS.danger}
                        strokeWidth={3}
                        name="Improvement %"
                        yAxisId="right"
                      />
                      <YAxis yAxisId="right" orientation="right" />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Pain Point Resolution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    Pain Point Resolution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {painPointResolution.map((point) => (
                      <div key={point.painPoint}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium">{point.painPoint}</span>
                          <Badge 
                            variant={point.resolved > 85 ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {point.resolved}% resolved
                          </Badge>
                        </div>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <div className="text-xs text-gray-600 mb-1">Severity</div>
                            <Progress value={point.severity} className="h-2 bg-red-100" />
                          </div>
                          <div className="flex-1">
                            <div className="text-xs text-gray-600 mb-1">Resolution</div>
                            <Progress value={point.resolved} className="h-2 bg-green-100" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Persona Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-purple-600" />
                    Persona-Specific Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { persona: "Systematic", feature: "Advanced folder structures", icon: FolderTree },
                      { persona: "Time-based", feature: "Timeline view with filters", icon: Clock },
                      { persona: "Project", feature: "Customer grouping tools", icon: Briefcase },
                      { persona: "Minimal", feature: "Smart defaults & automation", icon: Zap },
                      { persona: "Power User", feature: "Custom metadata fields", icon: Database }
                    ].map((item) => {
                      const Icon = item.icon
                      return (
                        <div key={item.persona} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <Icon className="h-5 w-5 text-gray-600" />
                          <div>
                            <h5 className="font-medium text-sm">{item.persona}</h5>
                            <p className="text-xs text-gray-600">{item.feature}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Patterns Tab */}
          <TabsContent value="patterns" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FolderTree className="h-5 w-5 text-green-600" />
                  Organization Pattern Analysis
                </CardTitle>
                <CardDescription>
                  Usage and effectiveness of different organization patterns
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 350 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={organizationPatternUsage}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="pattern" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="usage" fill={COLORS.primary} name="Usage %" />
                      <Line
                        type="monotone"
                        dataKey="effectiveness"
                        stroke={COLORS.success}
                        strokeWidth={3}
                        name="Effectiveness %"
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Automation Impact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  Automation Impact on Organization Tasks
                </CardTitle>
                <CardDescription>
                  Time saved through intelligent automation (minutes per task)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div style={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={automationImpact}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="task" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="manual" fill={COLORS.neutral} name="Manual Time" />
                      <Bar dataKey="automated" fill={COLORS.success} name="Automated Time" />
                      <Bar dataKey="saved" fill={COLORS.primary} name="Time Saved" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Pattern Features */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Layout className="h-5 w-5 text-indigo-600" />
                  Mental Organization Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="font-semibold mb-3">Primary Patterns</h5>
                    <ul className="space-y-2 text-sm">
                      {[
                        "By Status: Draft → In Progress → Complete",
                        "By Customer: Individual client folders",
                        "By Occasion: Birthday, Wedding, Anniversary",
                        "By Quality: Portfolio, Standard, Practice",
                        "By Date: Today, This Week, This Month"
                      ].map((pattern, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{pattern}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-3">Psychology Insights</h5>
                    <ul className="space-y-2 text-sm">
                      {[
                        "35% prefer systematic categorization",
                        "25% organize chronologically",
                        "20% think in project contexts",
                        "15% want minimal complexity",
                        "5% need advanced customization"
                      ].map((insight, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Brain className="h-4 w-4 text-purple-600" />
                          <span>{insight}</span>
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
            <Alert className="border-indigo-200 bg-indigo-50 dark:bg-indigo-900/20">
              <Sparkles className="h-4 w-4" />
              <AlertDescription>
                <strong>Interactive Demo:</strong> Experience the complete Content Organization Psychology system with 
                5 creator personas, content lifecycle visualization, mental organization patterns, 
                and personalized workflows that match how creators naturally think about their content.
              </AlertDescription>
            </Alert>

            <ContentOrganizationPsychology
              onPersonaSelect={handlePersonaSelect}
              onPatternSelect={handlePatternSelect}
              onWorkflowCreate={handleWorkflowCreate}
              onContentReorganize={handleContentReorganize}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}