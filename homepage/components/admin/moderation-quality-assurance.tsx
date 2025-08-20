"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Award,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Target,
  Users,
  BookOpen,
  FileText,
  Shield,
  Activity,
  RefreshCw,
  Download,
  ChevronUp,
  ChevronDown,
  Eye,
  MessageSquare,
  Gavel
} from "lucide-react"

interface ModeratorPerformance {
  id: string
  name: string
  avatar: string
  role: string
  stats: {
    totalReviews: number
    accuracy: number
    consistency: number
    averageTime: number
    overturnedDecisions: number
    escalations: number
    falsePositives: number
    falseNegatives: number
  }
  trends: {
    accuracyTrend: "up" | "down" | "stable"
    speedTrend: "up" | "down" | "stable"
    consistencyTrend: "up" | "down" | "stable"
  }
  recentDecisions: Array<{
    id: string
    content: string
    decision: string
    outcome: "correct" | "overturned" | "pending"
    timestamp: string
  }>
  trainingNeeds: string[]
  certifications: string[]
}

interface QualityMetric {
  name: string
  value: number
  target: number
  status: "excellent" | "good" | "needs_improvement" | "critical"
  description: string
}

interface PolicyUpdate {
  id: string
  title: string
  description: string
  impact: "high" | "medium" | "low"
  effectiveDate: string
  acknowledged: boolean
}

const mockModerators: ModeratorPerformance[] = [
  {
    id: "mod-001",
    name: "Sarah Chen",
    avatar: "/placeholder-avatar.jpg",
    role: "Senior Moderator",
    stats: {
      totalReviews: 523,
      accuracy: 94.5,
      consistency: 91.2,
      averageTime: 2.3,
      overturnedDecisions: 8,
      escalations: 12,
      falsePositives: 15,
      falseNegatives: 7
    },
    trends: {
      accuracyTrend: "up",
      speedTrend: "stable",
      consistencyTrend: "up"
    },
    recentDecisions: [
      {
        id: "dec-1",
        content: "Video content",
        decision: "Approved",
        outcome: "correct",
        timestamp: "2 hours ago"
      },
      {
        id: "dec-2",
        content: "Profile update",
        decision: "Rejected",
        outcome: "overturned",
        timestamp: "4 hours ago"
      }
    ],
    trainingNeeds: ["Copyright detection", "Cultural sensitivity"],
    certifications: ["Content Safety", "Platform Policies", "GDPR Compliance"]
  },
  {
    id: "mod-002",
    name: "Marcus Johnson",
    avatar: "/placeholder-avatar.jpg",
    role: "Moderator",
    stats: {
      totalReviews: 342,
      accuracy: 89.3,
      consistency: 85.7,
      averageTime: 3.1,
      overturnedDecisions: 18,
      escalations: 8,
      falsePositives: 22,
      falseNegatives: 11
    },
    trends: {
      accuracyTrend: "stable",
      speedTrend: "down",
      consistencyTrend: "down"
    },
    recentDecisions: [
      {
        id: "dec-3",
        content: "Message report",
        decision: "Warned",
        outcome: "correct",
        timestamp: "1 hour ago"
      }
    ],
    trainingNeeds: ["Decision consistency", "Review speed", "Policy updates"],
    certifications: ["Content Safety", "Platform Policies"]
  }
]

const qualityMetrics: QualityMetric[] = [
  {
    name: "Overall Accuracy",
    value: 92.4,
    target: 95,
    status: "good",
    description: "Percentage of correct moderation decisions"
  },
  {
    name: "Decision Consistency",
    value: 88.5,
    target: 90,
    status: "needs_improvement",
    description: "Consistency across similar content types"
  },
  {
    name: "Review Speed",
    value: 2.7,
    target: 3.0,
    status: "excellent",
    description: "Average minutes per review"
  },
  {
    name: "Overturn Rate",
    value: 3.2,
    target: 5,
    status: "excellent",
    description: "Percentage of decisions overturned on appeal"
  },
  {
    name: "Policy Compliance",
    value: 96.8,
    target: 98,
    status: "good",
    description: "Adherence to platform policies"
  }
]

const policyUpdates: PolicyUpdate[] = [
  {
    id: "pol-1",
    title: "Updated Copyright Guidelines",
    description: "New procedures for handling copyright claims in user-generated content",
    impact: "high",
    effectiveDate: "2024-11-01",
    acknowledged: false
  },
  {
    id: "pol-2",
    title: "Enhanced Privacy Standards",
    description: "Stricter guidelines for personal information in videos",
    impact: "medium",
    effectiveDate: "2024-10-15",
    acknowledged: true
  }
]

export function ModerationQualityAssurance() {
  const [selectedPeriod, setSelectedPeriod] = useState("week")
  const [selectedModerator, setSelectedModerator] = useState<ModeratorPerformance | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "bg-green-100 text-green-800"
      case "good": return "bg-blue-100 text-blue-800"
      case "needs_improvement": return "bg-yellow-100 text-yellow-800"
      case "critical": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up": return <ChevronUp className="h-4 w-4 text-green-600" />
      case "down": return <ChevronDown className="h-4 w-4 text-red-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getOutcomeColor = (outcome: string) => {
    switch (outcome) {
      case "correct": return "text-green-600"
      case "overturned": return "text-red-600"
      case "pending": return "text-yellow-600"
      default: return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Quality Assurance</h2>
          <p className="text-gray-600">Monitor and improve moderation quality</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="quarter">This Quarter</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quality Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {qualityMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardContent className="p-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">{metric.name}</p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-2xl font-bold">
                      {metric.name === "Review Speed" ? `${metric.value}m` : `${metric.value}%`}
                    </p>
                    <p className="text-xs text-gray-500">
                      Target: {metric.name === "Review Speed" ? `${metric.target}m` : `${metric.target}%`}
                    </p>
                  </div>
                  <Badge className={getStatusColor(metric.status)}>
                    {metric.status.replace('_', ' ')}
                  </Badge>
                </div>
                <Progress 
                  value={metric.name === "Review Speed" 
                    ? (metric.target / metric.value) * 100 
                    : (metric.value / metric.target) * 100
                  } 
                  className="h-2" 
                />
                <p className="text-xs text-gray-600">{metric.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="performance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="performance">Moderator Performance</TabsTrigger>
          <TabsTrigger value="consistency">Consistency Tracking</TabsTrigger>
          <TabsTrigger value="training">Training & Development</TabsTrigger>
          <TabsTrigger value="policies">Policy Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Individual Moderator Performance</CardTitle>
              <CardDescription>Track and analyze moderator performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Moderator</TableHead>
                    <TableHead>Total Reviews</TableHead>
                    <TableHead>Accuracy</TableHead>
                    <TableHead>Consistency</TableHead>
                    <TableHead>Avg Time</TableHead>
                    <TableHead>Overturned</TableHead>
                    <TableHead>Trends</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockModerators.map((moderator) => (
                    <TableRow key={moderator.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={moderator.avatar} />
                            <AvatarFallback>
                              {moderator.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{moderator.name}</p>
                            <p className="text-xs text-gray-500">{moderator.role}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{moderator.stats.totalReviews}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className={moderator.stats.accuracy >= 90 ? "text-green-600" : "text-yellow-600"}>
                            {moderator.stats.accuracy}%
                          </span>
                          {getTrendIcon(moderator.trends.accuracyTrend)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span className={moderator.stats.consistency >= 90 ? "text-green-600" : "text-yellow-600"}>
                            {moderator.stats.consistency}%
                          </span>
                          {getTrendIcon(moderator.trends.consistencyTrend)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <span>{moderator.stats.averageTime}m</span>
                          {getTrendIcon(moderator.trends.speedTrend)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={moderator.stats.overturnedDecisions > 10 ? "destructive" : "secondary"}>
                          {moderator.stats.overturnedDecisions}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {moderator.trends.accuracyTrend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                          {moderator.trends.accuracyTrend === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
                          {moderator.trends.consistencyTrend === "up" && <TrendingUp className="h-4 w-4 text-green-600" />}
                          {moderator.trends.consistencyTrend === "down" && <TrendingDown className="h-4 w-4 text-red-600" />}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => setSelectedModerator(moderator)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {selectedModerator && (
            <Card>
              <CardHeader>
                <CardTitle>Detailed Performance: {selectedModerator.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-3">Recent Decisions</h4>
                    <div className="space-y-2">
                      {selectedModerator.recentDecisions.map((decision) => (
                        <div key={decision.id} className="flex items-center justify-between p-2 border rounded">
                          <div className="flex-1">
                            <p className="text-sm font-medium">{decision.content}</p>
                            <p className="text-xs text-gray-500">{decision.decision} • {decision.timestamp}</p>
                          </div>
                          <Badge className={getOutcomeColor(decision.outcome)}>
                            {decision.outcome}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-3">Performance Breakdown</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">False Positives</span>
                        <Badge variant="outline">{selectedModerator.stats.falsePositives}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">False Negatives</span>
                        <Badge variant="outline">{selectedModerator.stats.falseNegatives}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Escalations</span>
                        <Badge variant="outline">{selectedModerator.stats.escalations}</Badge>
                      </div>
                      <div className="mt-4">
                        <h5 className="text-sm font-medium mb-2">Certifications</h5>
                        <div className="flex flex-wrap gap-2">
                          {selectedModerator.certifications.map((cert) => (
                            <Badge key={cert} variant="secondary">
                              <Award className="h-3 w-3 mr-1" />
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="consistency" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Decision Consistency Analysis</CardTitle>
              <CardDescription>Identify patterns and inconsistencies in moderation decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Consistency Alert</AlertTitle>
                  <AlertDescription>
                    3 similar cases had different outcomes in the past week. Review recommended.
                  </AlertDescription>
                </Alert>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Content Type Consistency</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Video Content</span>
                          <span className="font-medium">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Text Content</span>
                          <span className="font-medium">88%</span>
                        </div>
                        <Progress value={88} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Profile Updates</span>
                          <span className="font-medium">95%</span>
                        </div>
                        <Progress value={95} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Policy Application</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Copyright</span>
                          <span className="font-medium">89%</span>
                        </div>
                        <Progress value={89} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Inappropriate Content</span>
                          <span className="font-medium">94%</span>
                        </div>
                        <Progress value={94} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Spam/Scam</span>
                          <span className="font-medium">91%</span>
                        </div>
                        <Progress value={91} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardContent className="p-4">
                      <h4 className="font-medium mb-2">Severity Alignment</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Low Severity</span>
                          <span className="font-medium">96%</span>
                        </div>
                        <Progress value={96} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>Medium Severity</span>
                          <span className="font-medium">90%</span>
                        </div>
                        <Progress value={90} className="h-2" />
                        <div className="flex justify-between text-sm">
                          <span>High Severity</span>
                          <span className="font-medium">87%</span>
                        </div>
                        <Progress value={87} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training Recommendations</CardTitle>
              <CardDescription>Personalized training paths based on performance analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockModerators.map((moderator) => (
                  <div key={moderator.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={moderator.avatar} />
                          <AvatarFallback>
                            {moderator.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{moderator.name}</p>
                          <p className="text-sm text-gray-500">{moderator.role}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline">
                        <BookOpen className="h-4 w-4 mr-1" />
                        Assign Training
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <h5 className="text-sm font-medium">Recommended Training:</h5>
                      <div className="flex flex-wrap gap-2">
                        {moderator.trainingNeeds.map((training) => (
                          <Badge key={training} variant="outline">
                            {training}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Policy Updates & Acknowledgments</CardTitle>
              <CardDescription>Track policy changes and moderator acknowledgments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {policyUpdates.map((policy) => (
                  <div key={policy.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <h4 className="font-medium">{policy.title}</h4>
                          <Badge className={
                            policy.impact === "high" ? "bg-red-100 text-red-800" :
                            policy.impact === "medium" ? "bg-yellow-100 text-yellow-800" :
                            "bg-green-100 text-green-800"
                          }>
                            {policy.impact} impact
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{policy.description}</p>
                        <p className="text-xs text-gray-500">Effective: {policy.effectiveDate}</p>
                      </div>
                      <div>
                        {policy.acknowledged ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Acknowledged
                          </Badge>
                        ) : (
                          <Button size="sm">
                            Review & Acknowledge
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}