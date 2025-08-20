"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Star,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Reply,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Flag,
  Shield,
  Heart,
  Share2,
  Copy,
  Edit,
  Trash2,
  Archive,
  Filter,
  Search,
  MoreHorizontal,
  MoreVertical,
  Send,
  RefreshCw,
  Settings,
  Award,
  Target,
  Zap,
  Brain,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity,
  Timer,
  Users,
  MessageCircle,
  Mail,
  PhoneCall,
  Calendar,
  FileText,
  Download,
  Upload,
  Plus,
  Minus,
  X,
  Check,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Gauge,
  Smile,
  Frown,
  Meh,
  Angry,
  Laugh,
  Globe,
  MapPin,
  BookOpen,
  Bookmark
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow, isWithinInterval, subDays, subHours } from "date-fns"

// Types
interface Review {
  id: string
  customerId: string
  customerName: string
  customerAvatar?: string
  rating: number
  title: string
  content: string
  date: Date
  orderValue: number
  occasion: string
  isVerified: boolean
  hasResponse: boolean
  response?: ReviewResponse
  sentiment: "positive" | "neutral" | "negative"
  emotions: string[]
  topics: string[]
  helpfulVotes: number
  unhelpfulVotes: number
  isPublic: boolean
  isHighlighted: boolean
  responseTimeTarget: number // hours
  publicImpact: "high_positive" | "moderate_positive" | "neutral" | "high_negative" | "crisis_level"
  urgencyLevel: "low" | "medium" | "high" | "critical"
}

interface ReviewResponse {
  id: string
  content: string
  date: Date
  responseTime: number // hours
  template: string
  isPublic: boolean
  sentimentImprovement?: number
  followUpRequired: boolean
}

interface ResponseTemplate {
  id: string
  name: string
  rating: number
  category: string
  template: string
  variables: string[]
  successRate: number
  avgSentimentImprovement: number
  usage: number
}

interface ReviewAnalytics {
  totalReviews: number
  averageRating: number
  responseRate: number
  avgResponseTime: number
  sentimentScore: number
  topTopics: string[]
  trendData: { period: string; rating: number; count: number }[]
  ratingDistribution: { rating: number; count: number; percentage: number }[]
  responseMetrics: {
    within2Hours: number
    within6Hours: number
    within12Hours: number
    within24Hours: number
    within48Hours: number
    overdue: number
  }
}

interface ReviewManagementSystemProps {
  onRespondToReview?: (reviewId: string, response: string, template: string) => void
  onUpdateReviewStatus?: (reviewId: string, status: string) => void
  onHighlightReview?: (reviewId: string) => void
  onHideReview?: (reviewId: string) => void
  onFlagReview?: (reviewId: string, reason: string) => void
}

// Mock data
const mockResponseTemplates: ResponseTemplate[] = [
  {
    id: "5star",
    name: "5-Star Glowing Response",
    rating: 5,
    category: "gratitude",
    template: "{{customerName}}, mèsi anpil for your incredible review! 🌟 Your words about {{specificDetail}} absolutely made my day. I'm so thrilled that {{videoType}} brought such joy to {{recipient}}. It means the world to me when I can create something truly special for families like yours. Can't wait to work with you again! 💙",
    variables: ["customerName", "specificDetail", "videoType", "recipient"],
    successRate: 98,
    avgSentimentImprovement: 0.2,
    usage: 145
  },
  {
    id: "4star",
    name: "4-Star Appreciation",
    rating: 4,
    category: "appreciation",
    template: "Thank you so much {{customerName}} for taking the time to share your experience! I'm delighted that {{positiveAspect}} exceeded your expectations. I really appreciate your feedback about {{improvementArea}} - it helps me continue to grow and deliver even better experiences. Looking forward to creating something amazing for you again soon!",
    variables: ["customerName", "positiveAspect", "improvementArea"],
    successRate: 94,
    avgSentimentImprovement: 0.3,
    usage: 89
  },
  {
    id: "3star",
    name: "3-Star Acknowledgment",
    rating: 3,
    category: "concern",
    template: "Hi {{customerName}}, thank you for your honest feedback. I understand your concerns about {{specificIssue}} and I take full responsibility. Here's what I'm doing to make this right: {{improvementPlan}}. I'd love the opportunity to exceed your expectations next time. Please reach out to me directly so we can discuss how I can better serve you.",
    variables: ["customerName", "specificIssue", "improvementPlan"],
    successRate: 87,
    avgSentimentImprovement: 0.5,
    usage: 34
  },
  {
    id: "2star",
    name: "2-Star Apology & Resolution",
    rating: 2,
    category: "urgency",
    template: "{{customerName}}, I am truly sorry that your experience didn't meet your expectations. {{specificApology}} is completely unacceptable, and I take full responsibility. I want to make this right immediately: {{concreteAction}}. I'll be personally following up with you within 24 hours to ensure we've resolved this properly. Thank you for giving me the chance to improve.",
    variables: ["customerName", "specificApology", "concreteAction"],
    successRate: 82,
    avgSentimentImprovement: 0.7,
    usage: 12
  },
  {
    id: "1star",
    name: "1-Star Crisis Response",
    rating: 1,
    category: "crisis",
    template: "{{customerName}}, I am deeply sorry and take immediate responsibility for this experience. This is not who I am or what I stand for. I am contacting you directly within the hour to discuss how we can resolve this properly. {{immediateAction}}. Your trust means everything to me, and I'm committed to making this right. Please check your messages for my personal response.",
    variables: ["customerName", "immediateAction"],
    successRate: 75,
    avgSentimentImprovement: 0.9,
    usage: 3
  }
]

const mockReviews: Review[] = [
  {
    id: "1",
    customerId: "c1",
    customerName: "Marie Destine",
    customerAvatar: "👩🏾‍💼",
    rating: 5,
    title: "Absolutely Perfect Birthday Message!",
    content: "I ordered a birthday message for my daughter's 16th birthday and it was PERFECT! The personalization was incredible - you mentioned her love for dance and her dreams of becoming a choreographer. She cried happy tears and has watched it 20 times already. Mèsi anpil! 🎂💃🏾",
    date: new Date("2024-01-14T10:30:00"),
    orderValue: 75,
    occasion: "Birthday",
    isVerified: true,
    hasResponse: false,
    sentiment: "positive",
    emotions: ["joy", "gratitude", "excitement"],
    topics: ["personalization", "emotional impact", "family celebration"],
    helpfulVotes: 12,
    unhelpfulVotes: 0,
    isPublic: true,
    isHighlighted: false,
    responseTimeTarget: 24,
    publicImpact: "high_positive",
    urgencyLevel: "medium"
  },
  {
    id: "2",
    customerId: "c2",
    customerName: "Jean Baptiste",
    customerAvatar: "👨🏾‍💻",
    rating: 4,
    title: "Great message, minor audio issue",
    content: "The content of the motivational message was exactly what I needed to hear before my big presentation. Your words were powerful and genuine. The only small issue was that the audio was slightly quiet in the beginning, but it improved throughout. Overall very satisfied!",
    date: new Date("2024-01-13T15:45:00"),
    orderValue: 50,
    occasion: "Motivation",
    isVerified: true,
    hasResponse: true,
    response: {
      id: "r1",
      content: "Thank you Jean for your feedback! I'm so glad the message gave you the confidence boost you needed for your presentation. I really appreciate you pointing out the audio issue - I've upgraded my equipment to ensure consistent quality. Wishing you continued success!",
      date: new Date("2024-01-13T18:20:00"),
      responseTime: 2.6,
      template: "4star",
      isPublic: true,
      sentimentImprovement: 0.3,
      followUpRequired: false
    },
    sentiment: "positive",
    emotions: ["satisfaction", "appreciation"],
    topics: ["audio quality", "content quality", "motivation"],
    helpfulVotes: 8,
    unhelpfulVotes: 1,
    isPublic: true,
    isHighlighted: false,
    responseTimeTarget: 48,
    publicImpact: "moderate_positive",
    urgencyLevel: "low"
  },
  {
    id: "3",
    customerId: "c3",
    customerName: "Sophia Laurent",
    customerAvatar: "👩🏾‍🎨",
    rating: 3,
    title: "Good but not what I expected",
    content: "The video quality was good and you seemed genuine, but I was expecting more creativity given your artistic background. The message felt a bit generic for an anniversary celebration. It was fine, but I've seen more personalized work from other creators.",
    date: new Date("2024-01-12T09:15:00"),
    orderValue: 65,
    occasion: "Anniversary",
    isVerified: true,
    hasResponse: false,
    sentiment: "neutral",
    emotions: ["disappointment", "expectation"],
    topics: ["creativity", "personalization", "expectations"],
    helpfulVotes: 3,
    unhelpfulVotes: 2,
    isPublic: true,
    isHighlighted: false,
    responseTimeTarget: 12,
    publicImpact: "neutral",
    urgencyLevel: "high"
  },
  {
    id: "4",
    customerId: "c4",
    customerName: "Carlos Rodriguez",
    customerAvatar: "👨🏽‍⚕️",
    rating: 2,
    title: "Delivered late and rushed quality",
    content: "I ordered this graduation message 5 days in advance and it was delivered 2 hours before the party. The quality felt rushed - you seemed distracted and made a mistake with my son's name (Miguel, not Manuel). Disappointing experience for such an important milestone.",
    date: new Date("2024-01-11T14:30:00"),
    orderValue: 80,
    occasion: "Graduation",
    isVerified: true,
    hasResponse: false,
    sentiment: "negative",
    emotions: ["frustration", "disappointment", "anger"],
    topics: ["delivery time", "quality", "name accuracy"],
    helpfulVotes: 5,
    unhelpfulVotes: 0,
    isPublic: true,
    isHighlighted: false,
    responseTimeTarget: 6,
    publicImpact: "high_negative",
    urgencyLevel: "critical"
  }
]

const mockAnalytics: ReviewAnalytics = {
  totalReviews: 287,
  averageRating: 4.6,
  responseRate: 89,
  avgResponseTime: 8.5,
  sentimentScore: 82,
  topTopics: ["personalization", "delivery time", "audio quality", "emotional impact", "value"],
  trendData: [
    { period: "Oct", rating: 4.4, count: 42 },
    { period: "Nov", rating: 4.5, count: 58 },
    { period: "Dec", rating: 4.7, count: 74 },
    { period: "Jan", rating: 4.6, count: 89 }
  ],
  ratingDistribution: [
    { rating: 5, count: 165, percentage: 57.5 },
    { rating: 4, count: 89, percentage: 31.0 },
    { rating: 3, count: 21, percentage: 7.3 },
    { rating: 2, count: 8, percentage: 2.8 },
    { rating: 1, count: 4, percentage: 1.4 }
  ],
  responseMetrics: {
    within2Hours: 12,
    within6Hours: 8,
    within12Hours: 15,
    within24Hours: 28,
    within48Hours: 18,
    overdue: 6
  }
}

export function ReviewManagementSystem({
  onRespondToReview,
  onUpdateReviewStatus,
  onHighlightReview,
  onHideReview,
  onFlagReview
}: ReviewManagementSystemProps) {
  const [selectedReview, setSelectedReview] = React.useState<Review | null>(mockReviews[0])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterRating, setFilterRating] = React.useState<string>("all")
  const [filterStatus, setFilterStatus] = React.useState<string>("all")
  const [filterUrgency, setFilterUrgency] = React.useState<string>("all")
  const [sortBy, setSortBy] = React.useState<string>("date")
  const [responseContent, setResponseContent] = React.useState("")
  const [selectedTemplate, setSelectedTemplate] = React.useState<ResponseTemplate | null>(null)
  const [showResponseDialog, setShowResponseDialog] = React.useState(false)
  const [showAnalytics, setShowAnalytics] = React.useState(false)
  const [autoSuggestEnabled, setAutoSuggestEnabled] = React.useState(true)
  const [bulkSelectMode, setBulkSelectMode] = React.useState(false)
  const [selectedReviews, setSelectedReviews] = React.useState<Set<string>>(new Set())

  // Filter and sort reviews
  const filteredReviews = React.useMemo(() => {
    let filtered = [...mockReviews]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(review =>
        review.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Rating filter
    if (filterRating !== "all") {
      filtered = filtered.filter(review => review.rating === parseInt(filterRating))
    }

    // Status filter
    if (filterStatus !== "all") {
      if (filterStatus === "responded") {
        filtered = filtered.filter(review => review.hasResponse)
      } else if (filterStatus === "pending") {
        filtered = filtered.filter(review => !review.hasResponse)
      } else if (filterStatus === "overdue") {
        filtered = filtered.filter(review => {
          if (review.hasResponse) return false
          const deadline = new Date(review.date.getTime() + (review.responseTimeTarget * 60 * 60 * 1000))
          return new Date() > deadline
        })
      }
    }

    // Urgency filter
    if (filterUrgency !== "all") {
      filtered = filtered.filter(review => review.urgencyLevel === filterUrgency)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date":
          return b.date.getTime() - a.date.getTime()
        case "rating":
          return a.rating - b.rating
        case "urgency":
          const urgencyOrder = { critical: 4, high: 3, medium: 2, low: 1 }
          return urgencyOrder[b.urgencyLevel] - urgencyOrder[a.urgencyLevel]
        case "impact":
          const impactOrder = { crisis_level: 5, high_negative: 4, neutral: 3, moderate_positive: 2, high_positive: 1 }
          return impactOrder[b.publicImpact] - impactOrder[a.publicImpact]
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, filterRating, filterStatus, filterUrgency, sortBy])

  // Get suggested template for selected review
  const getSuggestedTemplate = (review: Review) => {
    return mockResponseTemplates.find(template => template.rating === review.rating)
  }

  // Generate AI response suggestion
  const generateResponseSuggestion = (review: Review, template: ResponseTemplate) => {
    let suggestion = template.template

    // Replace variables with contextual data
    suggestion = suggestion.replace("{{customerName}}", review.customerName)
    
    if (review.rating === 5) {
      suggestion = suggestion.replace("{{specificDetail}}", "the personal touches and authentic emotion")
      suggestion = suggestion.replace("{{videoType}}", "birthday message")
      suggestion = suggestion.replace("{{recipient}}", "your daughter")
    } else if (review.rating === 4) {
      suggestion = suggestion.replace("{{positiveAspect}}", "the meaningful content")
      suggestion = suggestion.replace("{{improvementArea}}", "audio quality")
    } else if (review.rating === 3) {
      suggestion = suggestion.replace("{{specificIssue}}", "the level of personalization")
      suggestion = suggestion.replace("{{improvementPlan}}", "implementing more detailed questionnaires and creative elements")
    } else if (review.rating === 2) {
      suggestion = suggestion.replace("{{specificApology}}", "the late delivery and name error")
      suggestion = suggestion.replace("{{concreteAction}}", "I'll create a new personalized video with your son Miguel's correct name, delivered within 24 hours")
    } else if (review.rating === 1) {
      suggestion = suggestion.replace("{{immediateAction}}", "I'm offering a full refund and a complimentary replacement video")
    }

    return suggestion
  }

  // Handle template selection
  const handleTemplateSelect = (template: ResponseTemplate) => {
    setSelectedTemplate(template)
    if (selectedReview && autoSuggestEnabled) {
      const suggestion = generateResponseSuggestion(selectedReview, template)
      setResponseContent(suggestion)
    }
  }

  // Handle response submission
  const handleSendResponse = () => {
    if (!selectedReview || !responseContent.trim()) return

    const templateId = selectedTemplate?.id || "custom"
    onRespondToReview?.(selectedReview.id, responseContent, templateId)
    
    // Update review with response
    selectedReview.hasResponse = true
    selectedReview.response = {
      id: `resp_${Date.now()}`,
      content: responseContent,
      date: new Date(),
      responseTime: (new Date().getTime() - selectedReview.date.getTime()) / (1000 * 60 * 60),
      template: templateId,
      isPublic: true,
      followUpRequired: selectedReview.rating <= 2
    }

    setResponseContent("")
    setSelectedTemplate(null)
    setShowResponseDialog(false)
  }

  // Get urgency color
  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical": return "bg-red-100 text-red-800 border-red-200"
      case "high": return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low": return "bg-green-100 text-green-800 border-green-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Get sentiment color
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return "text-green-600"
      case "negative": return "text-red-600"
      case "neutral": return "text-yellow-600"
      default: return "text-gray-600"
    }
  }

  // Get sentiment icon
  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive": return <Smile className="h-4 w-4" />
      case "negative": return <Frown className="h-4 w-4" />
      case "neutral": return <Meh className="h-4 w-4" />
      default: return <Meh className="h-4 w-4" />
    }
  }

  // Format response time deadline
  const getResponseDeadline = (review: Review) => {
    const deadline = new Date(review.date.getTime() + (review.responseTimeTarget * 60 * 60 * 1000))
    const now = new Date()
    
    if (now > deadline) {
      return { text: "Overdue", color: "text-red-600", isOverdue: true }
    }
    
    const timeLeft = deadline.getTime() - now.getTime()
    const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutesLeft = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hoursLeft < 1) {
      return { text: `${minutesLeft}m left`, color: "text-red-600", isOverdue: false }
    } else if (hoursLeft < 2) {
      return { text: `${hoursLeft}h ${minutesLeft}m left`, color: "text-orange-600", isOverdue: false }
    } else {
      return { text: `${hoursLeft}h left`, color: "text-gray-600", isOverdue: false }
    }
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar - Reviews List */}
        <div className="w-96 bg-white dark:bg-gray-800 border-r flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Star className="h-6 w-6 text-yellow-500" />
                <h1 className="text-xl font-semibold">Review Management</h1>
              </div>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setBulkSelectMode(!bulkSelectMode)}
                      className={bulkSelectMode ? "bg-blue-100 text-blue-600" : ""}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Bulk select mode</p>
                  </TooltipContent>
                </Tooltip>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowAnalytics(!showAnalytics)}
                  className={showAnalytics ? "bg-purple-100 text-purple-600" : ""}
                >
                  <BarChart3 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-2">
              <Select value={filterRating} onValueChange={setFilterRating}>
                <SelectTrigger>
                  <SelectValue placeholder="Rating" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="5">5 Stars</SelectItem>
                  <SelectItem value="4">4 Stars</SelectItem>
                  <SelectItem value="3">3 Stars</SelectItem>
                  <SelectItem value="2">2 Stars</SelectItem>
                  <SelectItem value="1">1 Star</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending Response</SelectItem>
                  <SelectItem value="responded">Responded</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterUrgency} onValueChange={setFilterUrgency}>
                <SelectTrigger>
                  <SelectValue placeholder="Urgency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="urgency">Urgency</SelectItem>
                  <SelectItem value="impact">Impact</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Bulk Actions */}
          <AnimatePresence>
            {bulkSelectMode && selectedReviews.size > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {selectedReviews.size} selected
                  </span>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="outline">
                      <Reply className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Flag className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Archive className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Reviews List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              <AnimatePresence>
                {filteredReviews.map((review, index) => {
                  const deadline = getResponseDeadline(review)
                  
                  return (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "p-3 rounded-lg mb-2 cursor-pointer transition-all relative",
                        "hover:bg-gray-50 dark:hover:bg-gray-700",
                        selectedReview?.id === review.id && "bg-blue-50 dark:bg-blue-900/20 border border-blue-200",
                        !review.hasResponse && deadline.isOverdue && "border-l-4 border-l-red-500",
                        !review.hasResponse && review.urgencyLevel === "critical" && "bg-red-25 border border-red-200"
                      )}
                      onClick={() => setSelectedReview(review)}
                    >
                      {bulkSelectMode && (
                        <div className="absolute top-2 left-2">
                          <input
                            type="checkbox"
                            checked={selectedReviews.has(review.id)}
                            onChange={(e) => {
                              const newSelected = new Set(selectedReviews)
                              if (e.target.checked) {
                                newSelected.add(review.id)
                              } else {
                                newSelected.delete(review.id)
                              }
                              setSelectedReviews(newSelected)
                            }}
                            className="rounded"
                          />
                        </div>
                      )}

                      <div className={cn(
                        "flex items-start gap-3",
                        bulkSelectMode && "ml-6"
                      )}>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={review.customerAvatar} />
                          <AvatarFallback>{review.customerAvatar}</AvatarFallback>
                        </Avatar>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-medium text-sm">{review.customerName}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={cn(
                                        "h-3 w-3",
                                        i < review.rating
                                          ? "text-yellow-500 fill-current"
                                          : "text-gray-300"
                                      )}
                                    />
                                  ))}
                                </div>
                                <Badge
                                  variant="outline"
                                  className={cn("text-xs", getUrgencyColor(review.urgencyLevel))}
                                >
                                  {review.urgencyLevel}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-xs text-gray-500">
                                {formatDistanceToNow(review.date)} ago
                              </span>
                              {!review.hasResponse && (
                                <div className={cn("text-xs font-medium", deadline.color)}>
                                  {deadline.text}
                                </div>
                              )}
                            </div>
                          </div>

                          <h4 className="font-medium text-sm mt-2 line-clamp-1">
                            {review.title}
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mt-1">
                            {review.content}
                          </p>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2">
                              <div className={cn("flex items-center gap-1", getSentimentColor(review.sentiment))}>
                                {getSentimentIcon(review.sentiment)}
                                <span className="text-xs capitalize">{review.sentiment}</span>
                              </div>
                              {review.isVerified && (
                                <Badge variant="outline" className="text-xs bg-green-100 text-green-800">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-1">
                              {review.hasResponse ? (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              ) : (
                                <Clock className="h-4 w-4 text-orange-500" />
                              )}
                              <span className="text-xs text-gray-500">
                                ${review.orderValue}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>

        {/* Main Content - Review Details */}
        <div className="flex-1 flex flex-col">
          {selectedReview ? (
            <>
              {/* Review Header */}
              <div className="p-6 border-b bg-white dark:bg-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={selectedReview.customerAvatar} />
                      <AvatarFallback>{selectedReview.customerAvatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-semibold">{selectedReview.customerName}</h2>
                        {selectedReview.isVerified && (
                          <Badge className="bg-green-100 text-green-800">Verified Purchase</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={cn(
                                "h-4 w-4",
                                i < selectedReview.rating
                                  ? "text-yellow-500 fill-current"
                                  : "text-gray-300"
                              )}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {format(selectedReview.date, "MMM d, yyyy 'at' h:mm a")}
                        </span>
                        <Badge variant="outline" className={getUrgencyColor(selectedReview.urgencyLevel)}>
                          {selectedReview.urgencyLevel} urgency
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Order Value: ${selectedReview.orderValue}</span>
                        <span>Occasion: {selectedReview.occasion}</span>
                        <span className={getSentimentColor(selectedReview.sentiment)}>
                          Sentiment: {selectedReview.sentiment}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onHighlightReview?.(selectedReview.id)}
                          className={selectedReview.isHighlighted ? "bg-yellow-100 text-yellow-600" : ""}
                        >
                          <Award className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Highlight review</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => onHideReview?.(selectedReview.id)}
                        >
                          {selectedReview.isPublic ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{selectedReview.isPublic ? "Hide" : "Show"} review</p>
                      </TooltipContent>
                    </Tooltip>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Share2 className="h-4 w-4 mr-2" />
                          Share Review
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Flag className="h-4 w-4 mr-2" />
                          Flag Review
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Response Status */}
                {!selectedReview.hasResponse && (
                  <Alert className="mt-4 border-orange-200 bg-orange-50 dark:bg-orange-900/20">
                    <Clock className="h-4 w-4" />
                    <AlertDescription>
                      <div className="flex items-center justify-between">
                        <span>
                          Response needed within {selectedReview.responseTimeTarget} hours for {selectedReview.publicImpact.replace(/_/g, ' ')} impact
                        </span>
                        <Button 
                          size="sm" 
                          onClick={() => setShowResponseDialog(true)}
                          className="ml-4"
                        >
                          <Reply className="h-4 w-4 mr-1" />
                          Respond Now
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Review Content */}
              <div className="flex-1 overflow-auto">
                <div className="p-6 space-y-6">
                  {/* Review Content */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">{selectedReview.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        {selectedReview.content}
                      </p>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t">
                        <div className="flex items-center gap-4">
                          <Button variant="outline" size="sm">
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            {selectedReview.helpfulVotes}
                          </Button>
                          <Button variant="outline" size="sm">
                            <ThumbsDown className="h-4 w-4 mr-1" />
                            {selectedReview.unhelpfulVotes}
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedReview.topics.map((topic) => (
                            <Badge key={topic} variant="secondary" className="text-xs">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Response Section */}
                  {selectedReview.hasResponse && selectedReview.response && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Reply className="h-5 w-5 text-blue-600" />
                          Your Response
                        </CardTitle>
                        <CardDescription>
                          Responded {formatDistanceToNow(selectedReview.response.date)} ago • 
                          Response time: {selectedReview.response.responseTime.toFixed(1)} hours
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {selectedReview.response.content}
                        </p>
                        
                        <div className="flex items-center justify-between mt-4 pt-4 border-t">
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span>Template: {selectedReview.response.template}</span>
                            {selectedReview.response.sentimentImprovement && (
                              <span className="text-green-600">
                                +{(selectedReview.response.sentimentImprovement * 100).toFixed(0)}% sentiment
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            {selectedReview.response.followUpRequired && (
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                Follow-up needed
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* AI Insights */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Brain className="h-5 w-5 text-purple-600" />
                        AI Insights & Recommendations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Emotional Analysis</h4>
                          <div className="space-y-2">
                            {selectedReview.emotions.map((emotion) => (
                              <Badge key={emotion} variant="outline" className="mr-2 capitalize">
                                {emotion}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Key Topics</h4>
                          <div className="space-y-2">
                            {selectedReview.topics.map((topic) => (
                              <Badge key={topic} variant="secondary" className="mr-2">
                                {topic}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {!selectedReview.hasResponse && (
                        <div className="mt-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                          <h4 className="font-medium mb-2 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4 text-purple-600" />
                            Response Strategy Recommendation
                          </h4>
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {selectedReview.rating === 5 && "Express genuine gratitude and highlight specific details they mentioned. Consider sharing this review as it has high positive impact."}
                            {selectedReview.rating === 4 && "Thank them warmly and acknowledge the feedback area for improvement. Show commitment to excellence."}
                            {selectedReview.rating === 3 && "Acknowledge their concerns directly and provide a specific improvement plan. Offer to make it right."}
                            {selectedReview.rating === 2 && "Respond urgently with a sincere apology and concrete action plan. Follow up personally within 24 hours."}
                            {selectedReview.rating === 1 && "This requires immediate crisis response. Apologize, take full responsibility, and move the conversation offline for resolution."}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <Star className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Select a review</h3>
                <p className="text-gray-500">Choose a review from the sidebar to view details and manage responses</p>
              </div>
            </div>
          )}
        </div>

        {/* Response Dialog */}
        <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Respond to Review</DialogTitle>
              <DialogDescription>
                Craft a thoughtful response using psychology-based templates and AI suggestions
              </DialogDescription>
            </DialogHeader>
            
            {selectedReview && (
              <div className="space-y-4">
                {/* Template Selection */}
                <div>
                  <Label className="text-sm font-medium mb-2 block">Response Templates</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {mockResponseTemplates
                      .filter(template => template.rating === selectedReview.rating)
                      .map((template) => (
                        <Card
                          key={template.id}
                          className={cn(
                            "cursor-pointer transition-all hover:shadow-md",
                            selectedTemplate?.id === template.id && "ring-2 ring-blue-500"
                          )}
                          onClick={() => handleTemplateSelect(template)}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{template.name}</h4>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {template.successRate}% success
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {template.usage} uses
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {template.template}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>

                {/* Response Content */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-sm font-medium">Response Content</Label>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={autoSuggestEnabled}
                        onCheckedChange={setAutoSuggestEnabled}
                        id="auto-suggest"
                      />
                      <Label htmlFor="auto-suggest" className="text-sm">AI Auto-suggest</Label>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Write your response..."
                    value={responseContent}
                    onChange={(e) => setResponseContent(e.target.value)}
                    className="min-h-[120px]"
                  />
                </div>

                {/* Response Preview */}
                {responseContent && (
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <h4 className="font-medium mb-2">Preview</h4>
                    <div className="prose prose-sm max-w-none">
                      <p>{responseContent}</p>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Timer className="h-4 w-4" />
                    <span>Estimated response time: {selectedTemplate?.avgSentimentImprovement ? '5-10 minutes' : '10-15 minutes'}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowResponseDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSendResponse}
                      disabled={!responseContent.trim()}
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Send Response
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}