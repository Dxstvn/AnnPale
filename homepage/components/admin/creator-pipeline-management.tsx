"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Users,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Edit,
  Send,
  PlayCircle,
  BookOpen,
  Award,
  TrendingUp,
  MessageSquare,
  FileText,
  Calendar,
  Star,
  Video,
  Shield,
  DollarSign,
  Activity,
  Search,
  Filter,
  Download,
  Plus,
  ArrowRight,
  Zap,
  GraduationCap,
  Target,
  Timer
} from "lucide-react"

interface CreatorApplication {
  id: string
  applicantName: string
  email: string
  phone?: string
  socialMedia: {
    instagram?: string
    tiktok?: string
    youtube?: string
    followers: number
  }
  applicationDate: string
  status: "submitted" | "under_review" | "interview_scheduled" | "approved" | "rejected" | "onboarding"
  stage: "application" | "background_check" | "interview" | "content_review" | "approval" | "onboarding"
  category: string
  experience: "beginner" | "intermediate" | "professional"
  expectedEarnings: number
  motivation: string
  portfolioItems: Array<{
    type: "video" | "audio" | "image"
    url: string
    description: string
  }>
  reviewNotes?: string
  interviewer?: string
  interviewDate?: string
  score?: number
  rejectionReason?: string
  onboardingProgress?: {
    profileSetup: boolean
    trainingComplete: boolean
    firstVideoSubmitted: boolean
    paymentSetup: boolean
    agreementSigned: boolean
  }
}

interface CreatorOnboarding {
  id: string
  creatorId: string
  creatorName: string
  email: string
  startDate: string
  status: "in_progress" | "completed" | "stalled" | "dropped_out"
  currentStep: number
  totalSteps: number
  progress: number
  steps: Array<{
    id: string
    name: string
    description: string
    status: "pending" | "in_progress" | "completed" | "skipped"
    completedAt?: string
    dueDate?: string
    requirements: string[]
  }>
  mentor?: string
  lastActivity: string
  firstVideoMilestone?: {
    submitted: boolean
    approved: boolean
    revenue: number
    customerRating: number
  }
}

const mockApplications: CreatorApplication[] = [
  {
    id: "APP001",
    applicantName: "Marie Ange",
    email: "marie.ange@email.com",
    phone: "+1 (555) 234-5678",
    socialMedia: {
      instagram: "@marie_ange_ht",
      tiktok: "@marieange",
      followers: 45000
    },
    applicationDate: "2024-01-14T16:45:00",
    status: "under_review",
    stage: "content_review",
    category: "Music",
    experience: "professional",
    expectedEarnings: 2000,
    motivation: "I want to share my passion for Haitian music and connect with fans worldwide through personalized messages.",
    portfolioItems: [
      { type: "video", url: "/portfolio/marie_demo.mp4", description: "Demo reel showcasing vocal range" },
      { type: "audio", url: "/portfolio/marie_song.mp3", description: "Original composition" }
    ],
    score: 85
  },
  {
    id: "APP002",
    applicantName: "Jean Baptiste",
    email: "jean.baptiste@email.com",
    socialMedia: {
      youtube: "JeanBaptiste Comedy",
      followers: 12000
    },
    applicationDate: "2024-01-13T09:30:00",
    status: "interview_scheduled",
    stage: "interview",
    category: "Comedy",
    experience: "intermediate",
    expectedEarnings: 800,
    motivation: "I love making people laugh and want to bring joy through personalized comedy videos.",
    portfolioItems: [
      { type: "video", url: "/portfolio/jean_comedy.mp4", description: "Stand-up comedy snippet" }
    ],
    interviewer: "Content Manager Lisa",
    interviewDate: "2024-01-16T14:00:00"
  },
  {
    id: "APP003",
    applicantName: "Sarah Williams",
    email: "sarah.w@email.com",
    applicationDate: "2024-01-12T11:20:00",
    status: "approved",
    stage: "onboarding",
    category: "Lifestyle",
    experience: "beginner",
    expectedEarnings: 500,
    motivation: "I want to help people with lifestyle tips and motivational messages.",
    portfolioItems: [
      { type: "video", url: "/portfolio/sarah_lifestyle.mp4", description: "Lifestyle tips video" }
    ],
    score: 78,
    onboardingProgress: {
      profileSetup: true,
      trainingComplete: false,
      firstVideoSubmitted: false,
      paymentSetup: false,
      agreementSigned: true
    }
  }
]

const mockOnboardingPipeline: CreatorOnboarding[] = [
  {
    id: "ONB001",
    creatorId: "CRT003",
    creatorName: "Sarah Williams",
    email: "sarah.w@email.com",
    startDate: "2024-01-15T10:00:00",
    status: "in_progress",
    currentStep: 3,
    totalSteps: 7,
    progress: 43,
    mentor: "Creator Success Manager Tom",
    lastActivity: "2024-01-15T16:30:00",
    steps: [
      {
        id: "step1",
        name: "Account Setup",
        description: "Complete profile information and verify identity",
        status: "completed",
        completedAt: "2024-01-15T11:00:00",
        requirements: ["Upload profile photo", "Verify phone number", "Complete bio"]
      },
      {
        id: "step2",
        name: "Platform Training",
        description: "Complete creator training modules",
        status: "completed",
        completedAt: "2024-01-15T14:00:00",
        requirements: ["Video creation guidelines", "Customer service training", "Platform policies"]
      },
      {
        id: "step3",
        name: "Content Guidelines",
        description: "Review and acknowledge content policies",
        status: "in_progress",
        dueDate: "2024-01-16T23:59:59",
        requirements: ["Read content policy", "Complete quiz", "Sign agreement"]
      },
      {
        id: "step4",
        name: "First Video",
        description: "Create and submit first video for review",
        status: "pending",
        requirements: ["Record demo video", "Submit for approval", "Receive feedback"]
      },
      {
        id: "step5",
        name: "Payment Setup",
        description: "Configure payment and tax information",
        status: "pending",
        requirements: ["Bank account verification", "Tax form submission", "Payment preferences"]
      },
      {
        id: "step6",
        name: "Go Live",
        description: "Activate creator profile for bookings",
        status: "pending",
        requirements: ["Profile approval", "Pricing setup", "Availability configuration"]
      },
      {
        id: "step7",
        name: "First Milestone",
        description: "Complete first paid video order",
        status: "pending",
        requirements: ["Receive first order", "Deliver video", "Customer rating"]
      }
    ]
  }
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "submitted": return "bg-blue-100 text-blue-800"
    case "under_review": return "bg-yellow-100 text-yellow-800"
    case "interview_scheduled": return "bg-purple-100 text-purple-800"
    case "approved": return "bg-green-100 text-green-800"
    case "rejected": return "bg-red-100 text-red-800"
    case "onboarding": return "bg-indigo-100 text-indigo-800"
    case "in_progress": return "bg-blue-100 text-blue-800"
    case "completed": return "bg-green-100 text-green-800"
    case "stalled": return "bg-orange-100 text-orange-800"
    case "dropped_out": return "bg-red-100 text-red-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getStepStatusIcon = (status: string) => {
  switch (status) {
    case "completed": return CheckCircle
    case "in_progress": return Clock
    case "pending": return Timer
    case "skipped": return ArrowRight
    default: return Timer
  }
}

export function CreatorPipelineManagement() {
  const [applications, setApplications] = useState<CreatorApplication[]>(mockApplications)
  const [onboardingPipeline, setOnboardingPipeline] = useState<CreatorOnboarding[]>(mockOnboardingPipeline)
  const [selectedApplication, setSelectedApplication] = useState<CreatorApplication | null>(null)
  const [selectedOnboarding, setSelectedOnboarding] = useState<CreatorOnboarding | null>(null)
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false)
  const [isOnboardingDialogOpen, setIsOnboardingDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("applications")
  const [filterStatus, setFilterStatus] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const handleApplicationAction = (applicationId: string, action: "approve" | "reject" | "schedule_interview") => {
    setApplications(prev =>
      prev.map(app =>
        app.id === applicationId
          ? {
              ...app,
              status: action === "approve" ? "approved" : action === "reject" ? "rejected" : "interview_scheduled",
              stage: action === "approve" ? "onboarding" : action === "reject" ? "approval" : "interview"
            }
          : app
      )
    )
  }

  const handleOnboardingProgress = (onboardingId: string, stepId: string) => {
    setOnboardingPipeline(prev =>
      prev.map(onb =>
        onb.id === onboardingId
          ? {
              ...onb,
              steps: onb.steps.map(step =>
                step.id === stepId
                  ? { ...step, status: "completed", completedAt: new Date().toISOString() }
                  : step
              ),
              progress: Math.round(((onb.steps.filter(s => s.status === "completed").length + 1) / onb.steps.length) * 100),
              currentStep: onb.currentStep + 1
            }
          : onb
      )
    )
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = searchQuery === "" || 
      app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || app.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const applicationStats = {
    total: applications.length,
    pending: applications.filter(a => a.status === "submitted" || a.status === "under_review").length,
    interviews: applications.filter(a => a.status === "interview_scheduled").length,
    approved: applications.filter(a => a.status === "approved").length,
    onboarding: onboardingPipeline.filter(o => o.status === "in_progress").length
  }

  return (
    <div className="space-y-6">
      {/* Pipeline Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-2xl font-bold">{applicationStats.total}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{applicationStats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Interviews</p>
                <p className="text-2xl font-bold">{applicationStats.interviews}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved</p>
                <p className="text-2xl font-bold">{applicationStats.approved}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Onboarding</p>
                <p className="text-2xl font-bold">{applicationStats.onboarding}</p>
              </div>
              <GraduationCap className="h-8 w-8 text-indigo-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Pipeline Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="applications">Applications Queue</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding Pipeline</TabsTrigger>
          <TabsTrigger value="milestones">First Video Milestones</TabsTrigger>
          <TabsTrigger value="analytics">Pipeline Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="applications" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Creator Applications</CardTitle>
                  <CardDescription>Review and manage incoming creator applications</CardDescription>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Applications
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search applications..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="submitted">Submitted</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                    <SelectItem value="interview_scheduled">Interview Scheduled</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>

              {/* Applications Table */}
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Social Following</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Applied</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>{application.applicantName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{application.applicantName}</p>
                              <p className="text-sm text-muted-foreground">{application.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{application.category}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {application.experience}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">{application.socialMedia?.followers?.toLocaleString() || '0'}</p>
                            <p className="text-muted-foreground">followers</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.replace("_", " ")}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{new Date(application.applicationDate).toLocaleDateString()}</p>
                            <p className="text-muted-foreground">{new Date(application.applicationDate).toLocaleTimeString()}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setSelectedApplication(application)
                                setIsApplicationDialogOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {application.status === "under_review" && (
                              <>
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApplicationAction(application.id, "approve")}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleApplicationAction(application.id, "schedule_interview")}
                                >
                                  <MessageSquare className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleApplicationAction(application.id, "reject")}
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="onboarding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Creator Onboarding Pipeline</CardTitle>
              <CardDescription>Monitor and guide new creators through the onboarding process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {onboardingPipeline.map((onboarding) => (
                  <div key={onboarding.id} className="p-6 border rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{onboarding.creatorName.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{onboarding.creatorName}</h3>
                          <p className="text-sm text-muted-foreground">{onboarding.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-medium">{onboarding.progress}% Complete</p>
                          <p className="text-xs text-muted-foreground">
                            Step {onboarding.currentStep} of {onboarding.totalSteps}
                          </p>
                        </div>
                        <Badge className={getStatusColor(onboarding.status)}>
                          {onboarding.status.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-4">
                      <Progress value={onboarding.progress} className="w-full" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {onboarding.steps?.map((step, index) => {
                        const StepIcon = getStepStatusIcon(step.status)
                        return (
                          <div key={step.id} className="p-4 border rounded-lg">
                            <div className="flex items-center space-x-3 mb-2">
                              <div className={`p-2 rounded-lg ${
                                step.status === "completed" ? "bg-green-100" :
                                step.status === "in_progress" ? "bg-blue-100" : "bg-gray-100"
                              }`}>
                                <StepIcon className={`h-4 w-4 ${
                                  step.status === "completed" ? "text-green-600" :
                                  step.status === "in_progress" ? "text-blue-600" : "text-gray-600"
                                }`} />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium text-sm">{step.name}</h4>
                                <p className="text-xs text-muted-foreground">{step.description}</p>
                              </div>
                            </div>
                            
                            {step.status === "in_progress" && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full mt-2"
                                onClick={() => handleOnboardingProgress(onboarding.id, step.id)}
                              >
                                Mark Complete
                              </Button>
                            )}

                            {step.dueDate && step.status !== "completed" && (
                              <p className="text-xs text-muted-foreground mt-2">
                                Due: {new Date(step.dueDate).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        Mentor: {onboarding.mentor}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedOnboarding(onboarding)
                            setIsOnboardingDialogOpen(true)
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>First Video Milestones</CardTitle>
              <CardDescription>Track creator progress through their first video milestone</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No First Video Milestones</h3>
                <p className="text-muted-foreground">
                  New creators will appear here once they progress to the first video milestone stage.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Application Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">This Week</span>
                    <span className="font-medium">12 applications</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Last Week</span>
                    <span className="font-medium">8 applications</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Growth</span>
                    <span className="font-medium text-green-600">+50%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Approval Rates</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Overall</span>
                    <span className="font-medium">75%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">This Month</span>
                    <span className="font-medium">82%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Target</span>
                    <span className="font-medium text-blue-600">80%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Timer className="h-5 w-5" />
                  <span>Processing Times</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg Review Time</span>
                    <span className="font-medium">2.5 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Avg Onboarding</span>
                    <span className="font-medium">5.2 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Target</span>
                    <span className="font-medium text-blue-600">7 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Application Details Dialog */}
      <Dialog open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Creator Application Details</DialogTitle>
            <DialogDescription>
              Review complete application information and make approval decision
            </DialogDescription>
          </DialogHeader>

          {selectedApplication && (
            <div className="space-y-6">
              {/* Applicant Summary */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {selectedApplication.applicantName.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedApplication.applicantName}</h3>
                  <p className="text-muted-foreground">{selectedApplication.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge variant="outline">{selectedApplication.category}</Badge>
                    <Badge variant="secondary" className="capitalize">
                      {selectedApplication.experience}
                    </Badge>
                    <Badge className={getStatusColor(selectedApplication.status)}>
                      {selectedApplication.status.replace("_", " ")}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  {selectedApplication.score && (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{selectedApplication.score}</p>
                      <p className="text-sm text-muted-foreground">Score</p>
                    </div>
                  )}
                </div>
              </div>

              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="social">Social Media</TabsTrigger>
                  <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
                  <TabsTrigger value="review">Review</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Application Date</Label>
                      <Input value={new Date(selectedApplication.applicationDate).toLocaleString()} disabled />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input value={selectedApplication.phone || "Not provided"} disabled />
                    </div>
                    <div>
                      <Label>Expected Earnings</Label>
                      <Input value={`$${selectedApplication.expectedEarnings}/month`} disabled />
                    </div>
                    <div>
                      <Label>Experience Level</Label>
                      <Input value={selectedApplication.experience} className="capitalize" disabled />
                    </div>
                  </div>

                  <div>
                    <Label>Motivation</Label>
                    <Textarea value={selectedApplication.motivation} disabled rows={4} />
                  </div>
                </TabsContent>

                <TabsContent value="social" className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-4">Social Media Presence</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Total Followers</Label>
                        <Input value={selectedApplication.socialMedia?.followers?.toLocaleString() || '0'} disabled />
                      </div>
                      {selectedApplication.socialMedia?.instagram && (
                        <div>
                          <Label>Instagram</Label>
                          <Input value={selectedApplication.socialMedia.instagram} disabled />
                        </div>
                      )}
                      {selectedApplication.socialMedia.tiktok && (
                        <div>
                          <Label>TikTok</Label>
                          <Input value={selectedApplication.socialMedia.tiktok} disabled />
                        </div>
                      )}
                      {selectedApplication.socialMedia.youtube && (
                        <div>
                          <Label>YouTube</Label>
                          <Input value={selectedApplication.socialMedia.youtube} disabled />
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="portfolio" className="space-y-4">
                  <div className="space-y-4">
                    {selectedApplication.portfolioItems?.map((item, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {item.type === "video" && <Video className="h-5 w-5" />}
                            {item.type === "audio" && <PlayCircle className="h-5 w-5" />}
                            <span className="font-medium capitalize">{item.type}</span>
                          </div>
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="review" className="space-y-4">
                  <div>
                    <Label>Review Notes</Label>
                    <Textarea
                      placeholder="Add review notes and feedback..."
                      value={selectedApplication.reviewNotes || ""}
                      rows={4}
                    />
                  </div>

                  {selectedApplication.interviewer && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Interviewer</Label>
                        <Input value={selectedApplication.interviewer} disabled />
                      </div>
                      <div>
                        <Label>Interview Date</Label>
                        <Input 
                          value={selectedApplication.interviewDate ? new Date(selectedApplication.interviewDate).toLocaleString() : ""} 
                          disabled 
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApplicationDialogOpen(false)}>
              Close
            </Button>
            {selectedApplication?.status === "under_review" && (
              <>
                <Button 
                  variant="outline"
                  onClick={() => {
                    if (selectedApplication) {
                      handleApplicationAction(selectedApplication.id, "schedule_interview")
                      setIsApplicationDialogOpen(false)
                    }
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Schedule Interview
                </Button>
                <Button 
                  variant="destructive"
                  onClick={() => {
                    if (selectedApplication) {
                      handleApplicationAction(selectedApplication.id, "reject")
                      setIsApplicationDialogOpen(false)
                    }
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button 
                  onClick={() => {
                    if (selectedApplication) {
                      handleApplicationAction(selectedApplication.id, "approve")
                      setIsApplicationDialogOpen(false)
                    }
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Approve
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}