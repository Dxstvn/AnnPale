"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Star, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  Shield,
  MessageSquare,
  Share2,
  Globe,
  Search,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Users,
  ThumbsUp,
  ThumbsDown,
  Eye,
  Heart,
  BarChart3,
  ShieldAlert,
  ShieldCheck,
  ShieldOff,
  Zap,
  FileText,
  Send,
  ChevronRight,
  ExternalLink,
  Flag,
  Megaphone,
  Newspaper,
  MessageCircle,
  Award,
  Target
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface MonitoringSource {
  id: string
  name: string
  icon: React.ReactNode
  frequency: string
  alertThreshold: string
  responseProtocol: string
  lastChecked: string
  status: "healthy" | "warning" | "critical"
  mentions: number
  sentiment: number
}

interface ThreatLevel {
  level: number
  name: string
  color: string
  icon: React.ReactNode
  description: string
  actions: string[]
  currentIssues: number
}

interface Review {
  id: string
  source: string
  author: string
  avatar?: string
  rating: number
  content: string
  timestamp: string
  sentiment: "positive" | "neutral" | "negative"
  responded: boolean
  impact: "high" | "medium" | "low"
  visibility: number
}

interface CrisisIncident {
  id: string
  title: string
  threatLevel: number
  status: "monitoring" | "responding" | "resolved"
  startTime: string
  source: string
  description: string
  actions: string[]
  teamMembers: string[]
}

export function ReputationManagement() {
  const [selectedThreatLevel, setSelectedThreatLevel] = useState<number | null>(null)
  const [activeIncident, setActiveIncident] = useState<CrisisIncident | null>(null)
  const [responseText, setResponseText] = useState("")

  // Mock monitoring sources
  const monitoringSources: MonitoringSource[] = [
    {
      id: "platform",
      name: "Platform Reviews",
      icon: <Star className="w-4 h-4" />,
      frequency: "Real-time",
      alertThreshold: "Any review",
      responseProtocol: "Standard response",
      lastChecked: "Just now",
      status: "healthy",
      mentions: 127,
      sentiment: 88
    },
    {
      id: "social",
      name: "Social Media",
      icon: <Share2 className="w-4 h-4" />,
      frequency: "Hourly",
      alertThreshold: "Mention",
      responseProtocol: "Assess & engage",
      lastChecked: "5 min ago",
      status: "warning",
      mentions: 342,
      sentiment: 75
    },
    {
      id: "google",
      name: "Google Reviews",
      icon: <Globe className="w-4 h-4" />,
      frequency: "Daily",
      alertThreshold: "Any review",
      responseProtocol: "Professional response",
      lastChecked: "2 hours ago",
      status: "healthy",
      mentions: 45,
      sentiment: 92
    },
    {
      id: "press",
      name: "Press Mentions",
      icon: <Newspaper className="w-4 h-4" />,
      frequency: "Weekly",
      alertThreshold: "Any mention",
      responseProtocol: "PR strategy",
      lastChecked: "1 day ago",
      status: "healthy",
      mentions: 8,
      sentiment: 85
    },
    {
      id: "forums",
      name: "Forums/Reddit",
      icon: <MessageCircle className="w-4 h-4" />,
      frequency: "Daily",
      alertThreshold: "Trending",
      responseProtocol: "Monitor/engage",
      lastChecked: "3 hours ago",
      status: "warning",
      mentions: 67,
      sentiment: 70
    }
  ]

  // Threat levels
  const threatLevels: ThreatLevel[] = [
    {
      level: 1,
      name: "Minor Issue",
      color: "blue",
      icon: <AlertCircle className="w-5 h-5" />,
      description: "Single complaint or minor negative feedback",
      actions: ["Respond directly", "Document resolution", "Monitor for patterns"],
      currentIssues: 3
    },
    {
      level: 2,
      name: "Pattern Emerging",
      color: "yellow",
      icon: <AlertTriangle className="w-5 h-5" />,
      description: "Multiple similar issues detected",
      actions: ["Internal review", "Process improvement", "Team briefing"],
      currentIssues: 1
    },
    {
      level: 3,
      name: "Public Attention",
      color: "orange",
      icon: <ShieldAlert className="w-5 h-5" />,
      description: "Social media spread, viral potential",
      actions: ["Crisis team activation", "Public statement", "Platform coordination"],
      currentIssues: 0
    },
    {
      level: 4,
      name: "Platform Risk",
      color: "red",
      icon: <ShieldOff className="w-5 h-5" />,
      description: "Policy violation risk, legal implications",
      actions: ["Legal consultation", "Damage control", "Executive involvement"],
      currentIssues: 0
    }
  ]

  // Mock recent reviews
  const recentReviews: Review[] = [
    {
      id: "1",
      source: "Platform",
      author: "Marie Joseph",
      avatar: "https://i.pravatar.cc/150?img=1",
      rating: 5,
      content: "Mèsi anpil! Video a te pafè pou anivèsè pitit mwen an. Li te kriye lè li wè l! 🎉",
      timestamp: "2 hours ago",
      sentiment: "positive",
      responded: true,
      impact: "high",
      visibility: 1250
    },
    {
      id: "2",
      source: "Social Media",
      author: "Jean Baptiste",
      avatar: "https://i.pravatar.cc/150?img=2",
      rating: 4,
      content: "Great video but took a bit longer than expected. Still happy with the result!",
      timestamp: "5 hours ago",
      sentiment: "positive",
      responded: false,
      impact: "medium",
      visibility: 450
    },
    {
      id: "3",
      source: "Google",
      author: "Sophia Laurent",
      avatar: "https://i.pravatar.cc/150?img=3",
      rating: 2,
      content: "Video quality was not what I expected for the price. Disappointed.",
      timestamp: "1 day ago",
      sentiment: "negative",
      responded: false,
      impact: "high",
      visibility: 890
    }
  ]

  // Mock sentiment data
  const sentimentData = [
    { date: "Mon", positive: 85, neutral: 10, negative: 5 },
    { date: "Tue", positive: 82, neutral: 12, negative: 6 },
    { date: "Wed", positive: 88, neutral: 8, negative: 4 },
    { date: "Thu", positive: 75, neutral: 15, negative: 10 },
    { date: "Fri", positive: 80, neutral: 13, negative: 7 },
    { date: "Sat", positive: 90, neutral: 7, negative: 3 },
    { date: "Sun", positive: 87, neutral: 9, negative: 4 }
  ]

  // Mock crisis incidents
  const crisisIncidents: CrisisIncident[] = [
    {
      id: "1",
      title: "Negative review going viral on Twitter",
      threatLevel: 2,
      status: "responding",
      startTime: "3 hours ago",
      source: "Social Media",
      description: "Customer complaint about delayed video spreading on social media",
      actions: ["Public response posted", "Direct message sent", "Monitoring engagement"],
      teamMembers: ["PR Team", "Creator", "Support"]
    }
  ]

  const overallSentiment = 84
  const reputationScore = 4.6
  const totalMentions = monitoringSources.reduce((sum, source) => sum + source.mentions, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Shield className="w-8 h-8 text-green-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">{reputationScore}/5</p>
                <p className="text-xs text-gray-500">Reputation Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Activity className="w-8 h-8 text-blue-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">{totalMentions}</p>
                <p className="text-xs text-gray-500">Total Mentions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Heart className="w-8 h-8 text-pink-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">{overallSentiment}%</p>
                <p className="text-xs text-gray-500">Positive Sentiment</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Clock className="w-8 h-8 text-orange-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">2.5h</p>
                <p className="text-xs text-gray-500">Avg Response</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">4</p>
                <p className="text-xs text-gray-500">Active Issues</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crisis Management Alert */}
      {crisisIncidents.length > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <ShieldAlert className="h-4 w-4 text-orange-600" />
          <AlertTitle>Active Crisis Management</AlertTitle>
          <AlertDescription>
            {crisisIncidents[0].title} - Threat Level {crisisIncidents[0].threatLevel}
            <Button size="sm" variant="outline" className="ml-4">
              View Details
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monitoring Dashboard */}
        <div className="lg:col-span-2 space-y-6">
          {/* Monitoring Sources */}
          <Card>
            <CardHeader>
              <CardTitle>Reputation Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {monitoringSources.map((source) => (
                  <div key={source.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        source.status === "healthy" ? "bg-green-100" :
                        source.status === "warning" ? "bg-yellow-100" : "bg-red-100"
                      }`}>
                        {source.icon}
                      </div>
                      <div>
                        <p className="font-medium">{source.name}</p>
                        <p className="text-sm text-gray-500">
                          {source.frequency} • Last: {source.lastChecked}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={
                          source.status === "healthy" ? "default" :
                          source.status === "warning" ? "secondary" : "destructive"
                        }>
                          {source.mentions} mentions
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              source.sentiment >= 80 ? "bg-green-500" :
                              source.sentiment >= 60 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${source.sentiment}%` }}
                          />
                        </div>
                        <span className="text-gray-500">{source.sentiment}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Analysis Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={sentimentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="positive" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="neutral" stackId="1" stroke="#6b7280" fill="#6b7280" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="negative" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Positive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                  <span className="text-sm">Neutral</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Negative</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reviews */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Reviews & Mentions</CardTitle>
                <Button variant="outline" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-4">
                  {recentReviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={review.avatar} />
                            <AvatarFallback>
                              {review.author.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.author}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Badge variant="outline" className="text-xs">
                                {review.source}
                              </Badge>
                              <span>•</span>
                              <span>{review.timestamp}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {review.sentiment === "positive" && (
                            <ThumbsUp className="w-4 h-4 text-green-600" />
                          )}
                          {review.sentiment === "negative" && (
                            <ThumbsDown className="w-4 h-4 text-red-600" />
                          )}
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < review.rating 
                                    ? "fill-yellow-400 text-yellow-400" 
                                    : "text-gray-300"
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{review.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Eye className="w-4 h-4" />
                          <span>{review.visibility} views</span>
                          <Badge 
                            variant={
                              review.impact === "high" ? "destructive" :
                              review.impact === "medium" ? "secondary" : "outline"
                            }
                            className="text-xs"
                          >
                            {review.impact} impact
                          </Badge>
                        </div>
                        {review.responded ? (
                          <Badge variant="default" className="text-xs">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Responded
                          </Badge>
                        ) : (
                          <Button size="sm" variant="outline">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            Respond
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Crisis Management Panel */}
        <div className="space-y-6">
          {/* Threat Level Assessment */}
          <Card>
            <CardHeader>
              <CardTitle>Threat Level Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {threatLevels.map((level) => (
                  <motion.div
                    key={level.level}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedThreatLevel === level.level ? 'border-purple-600 bg-purple-50' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedThreatLevel(level.level)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1 rounded ${
                          level.color === "blue" ? "bg-blue-100 text-blue-600" :
                          level.color === "yellow" ? "bg-yellow-100 text-yellow-600" :
                          level.color === "orange" ? "bg-orange-100 text-orange-600" :
                          "bg-red-100 text-red-600"
                        }`}>
                          {level.icon}
                        </div>
                        <span className="font-medium">Level {level.level}: {level.name}</span>
                      </div>
                      {level.currentIssues > 0 && (
                        <Badge variant="destructive" className="text-xs">
                          {level.currentIssues} active
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{level.description}</p>
                    {selectedThreatLevel === level.level && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 pt-3 border-t"
                      >
                        <p className="text-xs font-medium mb-2">Required Actions:</p>
                        <ul className="space-y-1">
                          {level.actions.map((action, idx) => (
                            <li key={idx} className="text-xs text-gray-600 flex items-center gap-1">
                              <ChevronRight className="w-3 h-3" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Response Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Response Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Positive Review Response
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Service Issue Apology
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Crisis Statement
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <Megaphone className="w-4 h-4 mr-2" />
                  Public Clarification
                </Button>
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-3">
                <Label>Custom Response</Label>
                <Textarea
                  placeholder="Type your response..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="min-h-[100px]"
                />
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    <Send className="w-4 h-4 mr-1" />
                    Send Response
                  </Button>
                  <Button size="sm" variant="outline">
                    Save Template
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Reputation Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Reputation Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Overall Rating</span>
                    <span className="font-medium">4.6/5.0</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Response Rate</span>
                    <span className="font-medium">87%</span>
                  </div>
                  <Progress value={87} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Positive Sentiment</span>
                    <span className="font-medium">84%</span>
                  </div>
                  <Progress value={84} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Crisis Prevention</span>
                    <span className="font-medium">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}