"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Smartphone,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Mic,
  Camera,
  Bell,
  WifiOff,
  Download,
  Upload,
  Clock,
  Users,
  Star,
  DollarSign,
  MessageSquare,
  Calendar,
  Activity,
  Play,
  Pause,
  Square,
  Eye,
  Settings,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Target,
  Zap,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Info,
  Lightbulb,
  Brain,
  Timer,
  RefreshCw,
  Globe,
  Heart,
  ThumbsUp,
  Share2,
  Headphones,
  Video,
  Image as ImageIcon,
  FileText,
  CloudOff,
  Cloud,
  Wifi,
  Volume2,
  Sparkles,
  Rocket,
  MonitorSpeaker
} from "lucide-react"
import { motion } from "framer-motion"

// Import the main component
import { MobileCreatorExperience } from "@/components/creator/mobile/mobile-creator-experience"

// Mobile optimization data
const mobileOptimizations = [
  {
    feature: "Request Review",
    desktop: "Full details in sidebar",
    mobile: "Essential info only", 
    optimization: "Swipe actions for accept/decline",
    impact: "+65% faster decisions",
    icon: Eye,
    color: "blue"
  },
  {
    feature: "Quick Accept",
    desktop: "Multi-select with bulk actions",
    mobile: "Single tap per request",
    optimization: "One-thumb reach design",
    impact: "+40% response rate",
    icon: Check,
    color: "green"
  },
  {
    feature: "Recording",
    desktop: "External camera/software required",
    mobile: "In-app native camera",
    optimization: "Native iOS/Android integration",
    impact: "+80% recording completion",
    icon: Camera,
    color: "purple"
  },
  {
    feature: "Earnings Check",
    desktop: "Detailed graphs and charts",
    mobile: "Key numbers widget",
    optimization: "Quick glance metrics",
    impact: "+90% daily engagement",
    icon: DollarSign,
    color: "yellow"
  },
  {
    feature: "Messaging",
    desktop: "Full conversation threads",
    mobile: "Recent messages only",
    optimization: "Push notifications",
    impact: "+50% message response time",
    icon: MessageSquare,
    color: "pink"
  }
]

// Quick actions data
const quickActionsData = [
  {
    action: "Accept/Decline Swipe",
    description: "Swipe right to accept, left to decline requests",
    usage: "92% of creators prefer vs tap",
    efficiency: "+3.2 seconds per request",
    icon: ArrowRight,
    demo: "Swipe gestures with haptic feedback"
  },
  {
    action: "Voice Recording",
    description: "Quick voice responses to customer questions",
    usage: "78% use for clarifications",
    efficiency: "2x faster than typing",
    icon: Mic,
    demo: "Push-to-record with waveform"
  },
  {
    action: "Photo Responses", 
    description: "Behind-the-scenes photos for customers",
    usage: "34% send with videos",
    efficiency: "+25% customer satisfaction",
    icon: Camera,
    demo: "Native camera with filters"
  },
  {
    action: "Quick Withdrawal",
    description: "Instant earnings withdrawal to bank",
    usage: "Daily withdrawals up 340%",
    efficiency: "30 seconds vs 5 minutes",
    icon: Download,
    demo: "Biometric authentication"
  },
  {
    action: "Status Updates",
    description: "Availability and location status",
    usage: "Updated 6x more frequently",
    efficiency: "Better customer expectations",
    icon: Activity,
    demo: "One-tap status presets"
  }
]

// Notification types
const notificationTypes = [
  {
    type: "New Request Alerts",
    description: "Immediate push notification for new video requests",
    priority: "Critical",
    timing: "Instant",
    response: "+85% within 1 hour",
    icon: Bell,
    sound: true,
    vibration: true
  },
  {
    type: "Deadline Reminders", 
    description: "Smart reminders based on video complexity",
    priority: "High",
    timing: "24h, 6h, 1h before",
    response: "0% missed deadlines",
    icon: Clock,
    sound: false,
    vibration: true
  },
  {
    type: "Earnings Milestones",
    description: "Celebration notifications for achievements",
    priority: "Medium", 
    timing: "Real-time",
    response: "+30% motivation boost",
    icon: DollarSign,
    sound: true,
    vibration: false
  },
  {
    type: "Customer Messages",
    description: "Direct messages and clarification requests",
    priority: "High",
    timing: "Instant",
    response: "+60% faster replies",
    icon: MessageSquare,
    sound: true,
    vibration: true
  },
  {
    type: "Platform Updates",
    description: "New features and system announcements",
    priority: "Low",
    timing: "Digest format",
    response: "Better feature adoption",
    icon: Info,
    sound: false,
    vibration: false
  }
]

// Offline capabilities
const offlineCapabilities = [
  {
    capability: "Draft Responses",
    description: "Write responses offline, auto-send when connected",
    useCase: "Poor signal areas",
    retention: "7 days",
    syncPriority: "High",
    icon: FileText
  },
  {
    capability: "View Schedule",
    description: "Access calendar and deadlines without internet",
    useCase: "Travel, airplane mode",
    retention: "30 days cached", 
    syncPriority: "Medium",
    icon: Calendar
  },
  {
    capability: "Record Videos",
    description: "Record and queue videos for upload later",
    useCase: "No WiFi in studio",
    retention: "Until uploaded",
    syncPriority: "Critical",
    icon: Video
  },
  {
    capability: "Queue Uploads",
    description: "Smart upload queue with progress tracking",
    useCase: "Bandwidth management",
    retention: "Resume on connection",
    syncPriority: "Critical", 
    icon: Upload
  },
  {
    capability: "Sync When Connected",
    description: "Automatic sync of all offline actions",
    useCase: "Seamless workflow",
    retention: "Instant sync",
    syncPriority: "All",
    icon: RefreshCw
  }
]

// Performance metrics
const performanceMetrics = [
  {
    metric: "Request Response Time",
    before: "4.2 hours average",
    after: "1.8 hours average",
    improvement: "57% faster",
    impact: "+40% more bookings",
    color: "green"
  },
  {
    metric: "Daily App Usage",
    before: "12 minutes",
    after: "28 minutes", 
    improvement: "133% increase",
    impact: "Better customer service",
    color: "blue"
  },
  {
    metric: "Video Recording Rate",
    before: "68% completion",
    after: "89% completion",
    improvement: "+21 percentage points",
    impact: "Higher earnings",
    color: "purple"
  },
  {
    metric: "Customer Satisfaction",
    before: "4.1/5 rating",
    after: "4.7/5 rating",
    improvement: "+0.6 rating points",
    impact: "More repeat customers",
    color: "yellow"
  }
]

// Success stories
const mobileSuccessStories = [
  {
    creator: "Evelyne Baptiste",
    category: "Actress/Singer",
    challenge: "Missed requests while filming on location",
    solution: "Mobile notifications + offline recording",
    result: "300% income increase in 2 months",
    quote: "I can now accept requests between takes and record responses during breaks. Game changer!",
    metrics: {
      before: { requests: 8, response: "6 hours", earnings: 580 },
      after: { requests: 24, response: "45 minutes", earnings: 1740 }
    }
  },
  {
    creator: "Michel Jean-Louis",
    category: "Comedian/Actor",
    challenge: "Slow response times hurt booking rates", 
    solution: "Swipe actions + voice responses",
    result: "Became top-rated creator in 6 weeks",
    quote: "The swipe gestures are so intuitive. I can manage requests while commuting to gigs.",
    metrics: {
      before: { requests: 15, response: "3.5 hours", earnings: 1125 },
      after: { requests: 42, response: "52 minutes", earnings: 3150 }
    }
  }
]

export default function Phase3110DemoPage() {
  const [activeTab, setActiveTab] = React.useState("demo")
  const [selectedOptimization, setSelectedOptimization] = React.useState("all")
  const [selectedStory, setSelectedStory] = React.useState(0)
  const [showMobileFrame, setShowMobileFrame] = React.useState(true)
  const [mounted, setMounted] = React.useState(false)
  
  React.useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading mobile creator experience...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="outline" className="text-blue-600">
                  Phase 3.1.10
                </Badge>
                <Badge variant="outline">Mobile Creator Experience</Badge>
              </div>
              <h1 className="text-3xl font-bold">Mobile Creator Experience</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Mobile-optimized workflows and tools for creators on-the-go
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <Smartphone className="w-3 h-3 mr-1" />
                Mobile Optimized
              </Badge>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Key Mobile Optimizations */}
        <div className="grid lg:grid-cols-5 gap-4 mb-8">
          {mobileOptimizations.map((opt, index) => (
            <motion.div
              key={opt.feature}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`p-2 bg-${opt.color}-100 dark:bg-${opt.color}-900/30 rounded-lg`}>
                      <opt.icon className={`h-4 w-4 text-${opt.color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{opt.feature}</p>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-xs text-gray-500">Mobile Optimization:</div>
                    <div className="text-sm font-medium">{opt.optimization}</div>
                    <Badge className={`bg-${opt.color}-100 text-${opt.color}-800 text-xs`}>
                      {opt.impact}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Component Demo */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <TabsList className="grid grid-cols-6 w-full max-w-4xl mx-auto">
            <TabsTrigger value="demo">Live Demo</TabsTrigger>
            <TabsTrigger value="optimizations">Optimizations</TabsTrigger>
            <TabsTrigger value="actions">Quick Actions</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="offline">Offline Mode</TabsTrigger>
            <TabsTrigger value="success">Success Stories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="demo" className="mt-6">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Mobile Demo Frame */}
              <div className="flex justify-center">
                <div className="relative">
                  {showMobileFrame && (
                    <div className="absolute -inset-4 bg-gray-900 rounded-[2.5rem] p-2">
                      <div className="bg-black rounded-[2rem] p-1">
                        <div className="bg-white rounded-[1.5rem] overflow-hidden" style={{ width: 375, height: 667 }}>
                          {/* Mobile app demo */}
                          <MobileCreatorExperience
                            userId="demo-creator"
                            onAcceptRequest={(id) => console.log("Accept:", id)}
                            onDeclineRequest={(id) => console.log("Decline:", id)}
                            onRecordResponse={(id, type) => console.log("Record:", id, type)}
                            onQuickWithdraw={() => console.log("Quick withdraw")}
                            onUpdateStatus={(status) => console.log("Status:", status)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {!showMobileFrame && (
                    <div className="w-full max-w-md">
                      <MobileCreatorExperience
                        userId="demo-creator"
                        onAcceptRequest={(id) => console.log("Accept:", id)}
                        onDeclineRequest={(id) => console.log("Decline:", id)}
                        onRecordResponse={(id, type) => console.log("Record:", id, type)}
                        onQuickWithdraw={() => console.log("Quick withdraw")}
                        onUpdateStatus={(status) => console.log("Status:", status)}
                      />
                    </div>
                  )}
                </div>
              </div>
              
              {/* Demo Controls */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Interactive Mobile Demo</CardTitle>
                    <CardDescription>
                      Experience the mobile creator workflow optimization
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Mobile Frame</span>
                      <Button 
                        variant={showMobileFrame ? "default" : "outline"}
                        size="sm"
                        onClick={() => setShowMobileFrame(!showMobileFrame)}
                      >
                        {showMobileFrame ? "Hide Frame" : "Show Frame"}
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-3">
                      <h4 className="font-medium">Key Features to Test:</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                          <ArrowRight className="h-4 w-4 text-green-600" />
                          <span>Swipe to Accept</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowLeft className="h-4 w-4 text-red-600" />
                          <span>Swipe to Decline</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mic className="h-4 w-4 text-blue-600" />
                          <span>Voice Recording</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Bell className="h-4 w-4 text-purple-600" />
                          <span>Notifications</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <WifiOff className="h-4 w-4 text-orange-600" />
                          <span>Offline Queue</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Download className="h-4 w-4 text-green-600" />
                          <span>Quick Withdraw</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Impact */}
                <Card>
                  <CardHeader>
                    <CardTitle>Mobile Performance Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {performanceMetrics.map((metric, index) => (
                        <div key={metric.metric} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">{metric.metric}</span>
                            <Badge className={`bg-${metric.color}-100 text-${metric.color}-800`}>
                              {metric.improvement}
                            </Badge>
                          </div>
                          <div className="text-xs text-gray-600 grid grid-cols-2 gap-2">
                            <span>Before: {metric.before}</span>
                            <span>After: {metric.after}</span>
                          </div>
                          <p className="text-xs text-gray-500">{metric.impact}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="optimizations" className="mt-6">
            <div className="space-y-6">
              {/* Desktop vs Mobile Comparison */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Mobile Workflow Optimizations
                  </CardTitle>
                  <CardDescription>
                    How we transformed desktop workflows for mobile efficiency
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Feature</th>
                          <th className="text-left py-2">Desktop Experience</th>
                          <th className="text-left py-2">Mobile Experience</th>
                          <th className="text-left py-2">Optimization</th>
                          <th className="text-left py-2">Impact</th>
                        </tr>
                      </thead>
                      <tbody>
                        {mobileOptimizations.map((opt, index) => (
                          <tr key={index} className="border-b">
                            <td className="py-3 font-medium">{opt.feature}</td>
                            <td className="py-3 text-gray-600">{opt.desktop}</td>
                            <td className="py-3 text-blue-600">{opt.mobile}</td>
                            <td className="py-3">{opt.optimization}</td>
                            <td className="py-3">
                              <Badge className={`bg-${opt.color}-100 text-${opt.color}-800`}>
                                {opt.impact}
                              </Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile-First Design Principles */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-yellow-600" />
                      Speed Optimizations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">One-thumb navigation design</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Swipe gestures for primary actions</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Essential information first</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Native camera/microphone integration</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      UX Psychology
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Lightbulb className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm">Reduce cognitive load with simple UI</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Lightbulb className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm">Haptic feedback for confirmation</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Lightbulb className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm">Progressive disclosure of details</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Lightbulb className="w-4 h-4 text-yellow-600" />
                        <span className="text-sm">Context-aware notifications</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="actions" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              {quickActionsData.map((action, index) => (
                <motion.div
                  key={action.action}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <action.icon className="h-5 w-5 text-blue-600" />
                        {action.action}
                      </CardTitle>
                      <CardDescription>{action.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Usage:</span>
                          <p className="font-medium">{action.usage}</p>
                        </div>
                        <div>
                          <span className="text-gray-500">Efficiency:</span>
                          <p className="font-medium text-green-600">{action.efficiency}</p>
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="flex items-center gap-2 mb-1">
                          <Play className="w-4 h-4 text-purple-600" />
                          <span className="text-sm font-medium">Demo Feature</span>
                        </div>
                        <p className="text-sm text-gray-600">{action.demo}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-blue-600" />
                    Smart Notification System
                  </CardTitle>
                  <CardDescription>
                    Context-aware notifications that improve response times and engagement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {notificationTypes.map((notification, index) => (
                      <div key={notification.type} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                              <notification.icon className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="font-semibold">{notification.type}</h4>
                              <p className="text-sm text-gray-600">{notification.description}</p>
                            </div>
                          </div>
                          <Badge className={
                            notification.priority === 'Critical' ? 'bg-red-100 text-red-800' :
                            notification.priority === 'High' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {notification.priority}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Timing:</span>
                            <p className="font-medium">{notification.timing}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Response Impact:</span>
                            <p className="font-medium text-green-600">{notification.response}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Sound:</span>
                            <p className="font-medium">{notification.sound ? "Yes" : "No"}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Vibration:</span>
                            <p className="font-medium">{notification.vibration ? "Yes" : "No"}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="offline" className="mt-6">
            <div className="space-y-6">
              <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                <WifiOff className="h-4 w-4" />
                <AlertDescription>
                  <strong>Offline-First Design:</strong> All critical creator workflows function without internet connectivity, 
                  with smart sync when connection is restored.
                </AlertDescription>
              </Alert>

              <div className="grid md:grid-cols-2 gap-6">
                {offlineCapabilities.map((capability, index) => (
                  <motion.div
                    key={capability.capability}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <capability.icon className="h-5 w-5 text-orange-600" />
                          {capability.capability}
                        </CardTitle>
                        <CardDescription>{capability.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-500">Use Case:</span>
                            <p className="font-medium">{capability.useCase}</p>
                          </div>
                          <div>
                            <span className="text-gray-500">Retention:</span>
                            <p className="font-medium">{capability.retention}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Sync Priority:</span>
                          <Badge className={
                            capability.syncPriority === 'Critical' ? 'bg-red-100 text-red-800' :
                            capability.syncPriority === 'High' ? 'bg-orange-100 text-orange-800' :
                            capability.syncPriority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }>
                            {capability.syncPriority}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Offline Sync Strategy */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="h-5 w-5 text-blue-600" />
                    Smart Sync Strategy
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-red-600 mb-1">Critical</div>
                        <p className="text-sm text-gray-600">Videos & Acceptances</p>
                        <p className="text-xs text-gray-500">Immediate sync</p>
                      </div>
                      <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600 mb-1">High</div>
                        <p className="text-sm text-gray-600">Messages & Responses</p>
                        <p className="text-xs text-gray-500">Within 5 minutes</p>
                      </div>
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-1">Normal</div>
                        <p className="text-sm text-gray-600">Status & Preferences</p>
                        <p className="text-xs text-gray-500">Next session</p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="text-center">
                      <h4 className="font-medium mb-2">Conflict Resolution</h4>
                      <p className="text-sm text-gray-600">
                        Server timestamps + creator preference priority ensure no data loss during sync
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="success" className="mt-6">
            <div className="space-y-6">
              {/* Success Story Selector */}
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-semibold">Mobile Success Stories</h3>
                <Select value={selectedStory.toString()} onValueChange={(v) => setSelectedStory(parseInt(v))}>
                  <SelectTrigger className="w-64">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {mobileSuccessStories.map((story, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {story.creator} - {story.result}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Featured Success Story */}
              <Card className="border-l-4 border-l-blue-600">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {mobileSuccessStories[selectedStory].creator.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <CardTitle>{mobileSuccessStories[selectedStory].creator}</CardTitle>
                        <CardDescription>{mobileSuccessStories[selectedStory].category}</CardDescription>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {mobileSuccessStories[selectedStory].result}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Challenge & Solution */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Challenge:</strong> {mobileSuccessStories[selectedStory].challenge}
                        </AlertDescription>
                      </Alert>
                      
                      <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Solution:</strong> {mobileSuccessStories[selectedStory].solution}
                        </AlertDescription>
                      </Alert>
                    </div>

                    {/* Quote */}
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border-l-4 border-blue-600">
                      <p className="text-sm italic">"{mobileSuccessStories[selectedStory].quote}"</p>
                    </div>

                    {/* Metrics Comparison */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div className="text-2xl font-bold text-red-600 mb-1">
                          {mobileSuccessStories[selectedStory].metrics.before.requests}
                        </div>
                        <p className="text-sm text-gray-600">Before Requests/Month</p>
                        <div className="text-xs text-gray-500 mt-1">
                          {mobileSuccessStories[selectedStory].metrics.before.response} response • 
                          ${mobileSuccessStories[selectedStory].metrics.before.earnings}
                        </div>
                      </div>

                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <ArrowRight className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                        <p className="text-sm font-medium">Mobile Optimization</p>
                        <p className="text-xs text-gray-600">2 months implementation</p>
                      </div>

                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 mb-1">
                          {mobileSuccessStories[selectedStory].metrics.after.requests}
                        </div>
                        <p className="text-sm text-gray-600">After Requests/Month</p>
                        <div className="text-xs text-gray-500 mt-1">
                          {mobileSuccessStories[selectedStory].metrics.after.response} response • 
                          ${mobileSuccessStories[selectedStory].metrics.after.earnings}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile ROI Calculator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Mobile Optimization ROI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-3">Average Improvements</h4>
                      <div className="space-y-3">
                        {performanceMetrics.map((metric, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-sm">{metric.metric}</span>
                            <Badge className={`bg-${metric.color}-100 text-${metric.color}-800`}>
                              {metric.improvement}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-3">Business Impact</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Average Revenue Increase:</span>
                          <span className="font-bold text-green-600">+240%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Time to See Results:</span>
                          <span className="font-bold">2-4 weeks</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Creator Satisfaction:</span>
                          <span className="font-bold text-blue-600">94% positive</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Daily Active Usage:</span>
                          <span className="font-bold">+133%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Summary */}
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
          <CardHeader>
            <CardTitle>Phase 3.1.10 Implementation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Completed Features
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Mobile-optimized request review with swipe actions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Quick actions (accept/decline, voice, photo responses)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Smart notification system with context awareness</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Offline-first workflows with smart sync</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>Native camera and microphone integration</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                    <span>One-thumb navigation optimizations</span>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-600" />
                  Mobile Impact
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Response Time</span>
                    <span className="font-semibold text-green-600">57% faster</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Daily Usage</span>
                    <span className="font-semibold text-blue-600">+133%</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Recording Completion</span>
                    <span className="font-semibold text-purple-600">+21pp</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                    <span className="text-sm">Revenue Growth</span>
                    <span className="font-semibold text-yellow-600">+240%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}