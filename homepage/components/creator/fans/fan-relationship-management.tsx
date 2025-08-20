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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Users,
  UserPlus,
  Crown,
  Star,
  Heart,
  MessageSquare,
  Gift,
  Calendar,
  Clock,
  TrendingUp,
  TrendingDown,
  Award,
  Target,
  Zap,
  Brain,
  Lightbulb,
  BarChart3,
  PieChart,
  Activity,
  Timer,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Flag,
  Share2,
  Copy,
  Send,
  Mail,
  Phone,
  MapPin,
  Globe,
  Tag,
  Bookmark,
  Bell,
  BellOff,
  Settings,
  RefreshCw,
  Download,
  Upload,
  FileText,
  Image as ImageIcon,
  Video,
  Mic,
  Camera,
  Smile,
  PartyPopper,
  Cake,
  Sparkles,
  Trophy,
  Medal,
  ThumbsUp,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  MoreVertical,
  X,
  Check,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Shield,
  Lock,
  Unlock,
  Archive,
  Folder,
  FolderOpen
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { format, formatDistanceToNow, addDays, addMonths, isWithinInterval, subDays, startOfDay, endOfDay, differenceInDays } from "date-fns"

// Types
interface Fan {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  location: string
  timezone: string
  joinDate: Date
  lastActive: Date
  segment: "new_fans" | "active_fans" | "super_fans" | "advocates" | "dormant"
  engagementLevel: "low" | "medium" | "high" | "very_high"
  lifetimeValue: number
  totalBookings: number
  avgOrderValue: number
  engagementScore: number
  npsScore?: number
  preferences: {
    occasions: string[]
    communicationChannels: string[]
    languages: string[]
    timezone: string
  }
  specialDates: {
    birthday?: Date
    anniversary?: Date
    custom: { name: string; date: Date }[]
  }
  tags: string[]
  notes: string
  referralCount: number
  socialMedia: {
    instagram?: string
    twitter?: string
    tiktok?: string
    facebook?: string
  }
  communicationHistory: CommunicationEvent[]
  bookingHistory: Booking[]
  isVip: boolean
  customFields: Record<string, any>
}

interface CommunicationEvent {
  id: string
  type: "email" | "sms" | "call" | "message" | "notification"
  channel: string
  subject?: string
  content: string
  date: Date
  direction: "inbound" | "outbound"
  status: "sent" | "delivered" | "read" | "replied"
  campaignId?: string
}

interface Booking {
  id: string
  date: Date
  occasion: string
  amount: number
  status: "completed" | "pending" | "cancelled" | "refunded"
  rating?: number
  feedback?: string
  videoDelivered: boolean
}

interface EngagementCampaign {
  id: string
  name: string
  type: "welcome" | "birthday" | "anniversary" | "winback" | "loyalty" | "milestone"
  status: "active" | "paused" | "completed" | "draft"
  targetSegments: string[]
  trigger: {
    type: "date" | "behavior" | "manual"
    condition: string
  }
  content: {
    subject: string
    message: string
    mediaUrl?: string
  }
  schedule: {
    sendDate?: Date
    recurring?: boolean
    frequency?: string
  }
  metrics: {
    sent: number
    delivered: number
    opened: number
    clicked: number
    converted: number
  }
}

interface FanJourneyStage {
  stage: "discovery" | "first_booking" | "satisfaction" | "repeat" | "advocacy"
  description: string
  expectedDuration: number // days
  conversionRate: number
  dropoffReasons: string[]
  optimizationTips: string[]
}

interface FanRelationshipManagementProps {
  onSendMessage?: (fanId: string, message: string, channel: string) => void
  onUpdateFan?: (fanId: string, updates: Partial<Fan>) => void
  onCreateCampaign?: (campaign: Omit<EngagementCampaign, "id" | "metrics">) => void
  onScheduleReminder?: (fanId: string, reminder: any) => void
}

// Mock data
const mockFanJourneyStages: FanJourneyStage[] = [
  {
    stage: "discovery",
    description: "Fan discovers you through social media, referrals, or browsing",
    expectedDuration: 7,
    conversionRate: 25,
    dropoffReasons: ["Price concerns", "Unclear value proposition", "No urgency"],
    optimizationTips: ["Social proof", "Clear pricing", "Limited-time offers"]
  },
  {
    stage: "first_booking",
    description: "Fan makes their first video request",
    expectedDuration: 3,
    conversionRate: 85,
    dropoffReasons: ["Complex booking process", "Payment issues", "Long wait times"],
    optimizationTips: ["Streamline checkout", "Multiple payment options", "Clear delivery timeline"]
  },
  {
    stage: "satisfaction",
    description: "Fan receives and enjoys their first video",
    expectedDuration: 1,
    conversionRate: 92,
    dropoffReasons: ["Video quality issues", "Wrong expectations", "Delivery delays"],
    optimizationTips: ["Quality control", "Clear guidelines", "Proactive communication"]
  },
  {
    stage: "repeat",
    description: "Fan books additional videos for themselves or others",
    expectedDuration: 30,
    conversionRate: 45,
    dropoffReasons: ["Forgot about service", "Financial constraints", "Found alternatives"],
    optimizationTips: ["Follow-up campaigns", "Loyalty rewards", "Referral incentives"]
  },
  {
    stage: "advocacy",
    description: "Fan actively promotes and refers others",
    expectedDuration: 0,
    conversionRate: 15,
    dropoffReasons: ["Lost engagement", "Negative experience", "Life changes"],
    optimizationTips: ["VIP treatment", "Exclusive access", "Ambassador programs"]
  }
]

const mockFans: Fan[] = [
  {
    id: "1",
    name: "Marie Destine",
    email: "marie@example.com",
    avatar: "👩🏾‍💼",
    phone: "+1 514-555-0123",
    location: "Montreal, Canada",
    timezone: "EST",
    joinDate: new Date("2023-06-15"),
    lastActive: new Date("2024-01-15T10:30:00"),
    segment: "super_fans",
    engagementLevel: "very_high",
    lifetimeValue: 650,
    totalBookings: 8,
    avgOrderValue: 81.25,
    engagementScore: 92,
    npsScore: 10,
    preferences: {
      occasions: ["Birthday", "Anniversary", "Graduation"],
      communicationChannels: ["Email", "SMS"],
      languages: ["French", "English"],
      timezone: "EST"
    },
    specialDates: {
      birthday: new Date("1985-03-20"),
      anniversary: new Date("2010-08-15"),
      custom: [
        { name: "Daughter's Birthday", date: new Date("2024-04-10") }
      ]
    },
    tags: ["VIP", "Family-Oriented", "Repeat Customer", "High Value"],
    notes: "Prefers family celebration videos. Always tips generously. Referred 3 friends.",
    referralCount: 3,
    socialMedia: {
      instagram: "@marie_destine",
      facebook: "Marie Destine"
    },
    communicationHistory: [],
    bookingHistory: [],
    isVip: true,
    customFields: {
      preferredLanguage: "French",
      familySize: 4,
      celebrationStyle: "Traditional"
    }
  },
  {
    id: "2",
    name: "Jean Baptiste",
    email: "jean@example.com",
    avatar: "👨🏾‍💻",
    phone: "+509 3333-4444",
    location: "Port-au-Prince, Haiti",
    timezone: "EST",
    joinDate: new Date("2023-08-20"),
    lastActive: new Date("2024-01-14T15:45:00"),
    segment: "active_fans",
    engagementLevel: "medium",
    lifetimeValue: 180,
    totalBookings: 3,
    avgOrderValue: 60,
    engagementScore: 78,
    npsScore: 8,
    preferences: {
      occasions: ["Motivation", "Business", "Achievement"],
      communicationChannels: ["Email", "WhatsApp"],
      languages: ["Haitian Creole", "English"],
      timezone: "EST"
    },
    specialDates: {
      birthday: new Date("1990-11-12"),
      custom: [
        { name: "Business Anniversary", date: new Date("2024-06-01") }
      ]
    },
    tags: ["Professional", "Motivational", "Business Owner"],
    notes: "Entrepreneur, enjoys motivational content. Prefers morning deliveries.",
    referralCount: 1,
    socialMedia: {
      instagram: "@jeanbaptiste_biz",
      twitter: "@jeanbaptiste"
    },
    communicationHistory: [],
    bookingHistory: [],
    isVip: false,
    customFields: {
      businessType: "Tech Startup",
      motivationalFocus: "Success Stories"
    }
  },
  {
    id: "3",
    name: "Sophia Laurent",
    email: "sophia@example.com",
    avatar: "👩🏾‍🎨",
    phone: "+33 6 12 34 56 78",
    location: "Paris, France",
    timezone: "CET",
    joinDate: new Date("2023-11-10"),
    lastActive: new Date("2024-01-13T09:15:00"),
    segment: "new_fans",
    engagementLevel: "low",
    lifetimeValue: 65,
    totalBookings: 1,
    avgOrderValue: 65,
    engagementScore: 45,
    npsScore: 7,
    preferences: {
      occasions: ["Art", "Creative", "Personal"],
      communicationChannels: ["Email"],
      languages: ["French", "English"],
      timezone: "CET"
    },
    specialDates: {
      birthday: new Date("1992-07-25"),
      custom: []
    },
    tags: ["Creative", "Art Lover", "First-Time Customer"],
    notes: "Artist, appreciates creative references. New to platform.",
    referralCount: 0,
    socialMedia: {
      instagram: "@sophia_art_paris"
    },
    communicationHistory: [],
    bookingHistory: [],
    isVip: false,
    customFields: {
      artStyle: "Contemporary",
      creativeInterests: "Digital Art, Photography"
    }
  },
  {
    id: "4",
    name: "Michael Thompson",
    email: "mike@example.com",
    avatar: "👨🏽‍⚕️",
    location: "Miami, FL",
    timezone: "EST",
    joinDate: new Date("2022-12-05"),
    lastActive: new Date("2023-10-20T14:30:00"),
    segment: "dormant",
    engagementLevel: "low",
    lifetimeValue: 120,
    totalBookings: 2,
    avgOrderValue: 60,
    engagementScore: 25,
    npsScore: 6,
    preferences: {
      occasions: ["Medical", "Achievement", "Family"],
      communicationChannels: ["Email"],
      languages: ["English"],
      timezone: "EST"
    },
    specialDates: {
      birthday: new Date("1978-05-14"),
      custom: []
    },
    tags: ["Healthcare", "Dormant", "Needs Re-engagement"],
    notes: "Doctor, last booking was 3 months ago. May need win-back campaign.",
    referralCount: 0,
    socialMedia: {},
    communicationHistory: [],
    bookingHistory: [],
    isVip: false,
    customFields: {
      profession: "Physician",
      specialty: "Cardiology"
    }
  },
  {
    id: "5",
    name: "Lisa Rodriguez",
    email: "lisa@example.com",
    avatar: "👩🏽‍🏫",
    location: "Los Angeles, CA",
    timezone: "PST",
    joinDate: new Date("2023-03-10"),
    lastActive: new Date("2024-01-12T18:20:00"),
    segment: "advocates",
    engagementLevel: "very_high",
    lifetimeValue: 890,
    totalBookings: 12,
    avgOrderValue: 74.17,
    engagementScore: 96,
    npsScore: 10,
    preferences: {
      occasions: ["Education", "Family", "Achievement", "Holiday"],
      communicationChannels: ["Email", "SMS", "Social Media"],
      languages: ["English", "Spanish"],
      timezone: "PST"
    },
    specialDates: {
      birthday: new Date("1983-09-18"),
      anniversary: new Date("2008-12-31"),
      custom: [
        { name: "School Year Start", date: new Date("2024-08-15") },
        { name: "Daughter's Graduation", date: new Date("2024-06-20") }
      ]
    },
    tags: ["Ambassador", "High Value", "Educator", "Influencer", "Repeat Customer"],
    notes: "Teacher and social media influencer. Refers many customers. Perfect ambassador candidate.",
    referralCount: 8,
    socialMedia: {
      instagram: "@teacher_lisa_la",
      twitter: "@lisateacher",
      tiktok: "@educatorlisa"
    },
    communicationHistory: [],
    bookingHistory: [],
    isVip: true,
    customFields: {
      schoolDistrict: "LAUSD",
      grade: "5th Grade",
      socialFollowers: 15000
    }
  }
]

const mockCampaigns: EngagementCampaign[] = [
  {
    id: "1",
    name: "Welcome New Fans",
    type: "welcome",
    status: "active",
    targetSegments: ["new_fans"],
    trigger: {
      type: "behavior",
      condition: "First booking completed"
    },
    content: {
      subject: "Welcome to the family! 🎉",
      message: "Mèsi anpil for your first booking! Here's a special 15% discount for your next video..."
    },
    schedule: {
      sendDate: new Date(),
      recurring: false
    },
    metrics: {
      sent: 45,
      delivered: 44,
      opened: 32,
      clicked: 18,
      converted: 7
    }
  },
  {
    id: "2",
    name: "Birthday Wishes",
    type: "birthday",
    status: "active",
    targetSegments: ["active_fans", "super_fans", "advocates"],
    trigger: {
      type: "date",
      condition: "Fan birthday"
    },
    content: {
      subject: "🎂 Happy Birthday from your favorite creator!",
      message: "It's your special day! Enjoy 25% off any video to celebrate..."
    },
    schedule: {
      recurring: true,
      frequency: "yearly"
    },
    metrics: {
      sent: 128,
      delivered: 126,
      opened: 95,
      clicked: 67,
      converted: 23
    }
  },
  {
    id: "3",
    name: "Win Back Dormant Fans",
    type: "winback",
    status: "active",
    targetSegments: ["dormant"],
    trigger: {
      type: "behavior",
      condition: "No activity in 90 days"
    },
    content: {
      subject: "We miss you! Come back for something special 💙",
      message: "It's been a while! Here's 30% off to welcome you back..."
    },
    schedule: {
      recurring: true,
      frequency: "quarterly"
    },
    metrics: {
      sent: 67,
      delivered: 64,
      opened: 38,
      clicked: 15,
      converted: 4
    }
  }
]

export function FanRelationshipManagement({
  onSendMessage,
  onUpdateFan,
  onCreateCampaign,
  onScheduleReminder
}: FanRelationshipManagementProps) {
  const [selectedFan, setSelectedFan] = React.useState<Fan | null>(mockFans[0])
  const [searchQuery, setSearchQuery] = React.useState("")
  const [filterSegment, setFilterSegment] = React.useState<string>("all")
  const [filterEngagement, setFilterEngagement] = React.useState<string>("all")
  const [sortBy, setSortBy] = React.useState<string>("lastActive")
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("list")
  const [showProfile, setShowProfile] = React.useState(false)
  const [showCampaignDialog, setShowCampaignDialog] = React.useState(false)
  const [bulkSelectMode, setBulkSelectMode] = React.useState(false)
  const [selectedFans, setSelectedFans] = React.useState<Set<string>>(new Set())
  const [messageContent, setMessageContent] = React.useState("")
  const [showJourneyView, setShowJourneyView] = React.useState(false)

  // Filter and sort fans
  const filteredFans = React.useMemo(() => {
    let filtered = [...mockFans]

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(fan =>
        fan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fan.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fan.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        fan.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Segment filter
    if (filterSegment !== "all") {
      filtered = filtered.filter(fan => fan.segment === filterSegment)
    }

    // Engagement filter
    if (filterEngagement !== "all") {
      filtered = filtered.filter(fan => fan.engagementLevel === filterEngagement)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "lastActive":
          return b.lastActive.getTime() - a.lastActive.getTime()
        case "name":
          return a.name.localeCompare(b.name)
        case "lifetimeValue":
          return b.lifetimeValue - a.lifetimeValue
        case "engagementScore":
          return b.engagementScore - a.engagementScore
        case "joinDate":
          return b.joinDate.getTime() - a.joinDate.getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [searchQuery, filterSegment, filterEngagement, sortBy])

  // Get segment statistics
  const segmentStats = React.useMemo(() => {
    const stats = {
      new_fans: { count: 0, totalValue: 0, avgEngagement: 0 },
      active_fans: { count: 0, totalValue: 0, avgEngagement: 0 },
      super_fans: { count: 0, totalValue: 0, avgEngagement: 0 },
      advocates: { count: 0, totalValue: 0, avgEngagement: 0 },
      dormant: { count: 0, totalValue: 0, avgEngagement: 0 }
    }

    mockFans.forEach(fan => {
      stats[fan.segment].count++
      stats[fan.segment].totalValue += fan.lifetimeValue
      stats[fan.segment].avgEngagement += fan.engagementScore
    })

    // Calculate averages
    Object.keys(stats).forEach(segment => {
      const segmentData = stats[segment as keyof typeof stats]
      if (segmentData.count > 0) {
        segmentData.avgEngagement = segmentData.avgEngagement / segmentData.count
      }
    })

    return stats
  }, [])

  // Get segment color
  const getSegmentColor = (segment: string) => {
    switch (segment) {
      case "new_fans": return "bg-blue-100 text-blue-800 border-blue-200"
      case "active_fans": return "bg-green-100 text-green-800 border-green-200"
      case "super_fans": return "bg-purple-100 text-purple-800 border-purple-200"
      case "advocates": return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "dormant": return "bg-gray-100 text-gray-800 border-gray-200"
      default: return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Get engagement level color
  const getEngagementColor = (level: string) => {
    switch (level) {
      case "very_high": return "text-purple-600"
      case "high": return "text-green-600"
      case "medium": return "text-blue-600"
      case "low": return "text-orange-600"
      default: return "text-gray-600"
    }
  }

  // Get segment icon
  const getSegmentIcon = (segment: string) => {
    switch (segment) {
      case "new_fans": return <UserPlus className="h-4 w-4" />
      case "active_fans": return <Users className="h-4 w-4" />
      case "super_fans": return <Star className="h-4 w-4" />
      case "advocates": return <Crown className="h-4 w-4" />
      case "dormant": return <Clock className="h-4 w-4" />
      default: return <Users className="h-4 w-4" />
    }
  }

  // Handle fan selection
  const handleFanToggle = (fanId: string) => {
    const newSelection = new Set(selectedFans)
    if (newSelection.has(fanId)) {
      newSelection.delete(fanId)
    } else {
      newSelection.add(fanId)
    }
    setSelectedFans(newSelection)
  }

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on ${selectedFans.size} fans`)
    setSelectedFans(new Set())
    setBulkSelectMode(false)
  }

  // Handle send message
  const handleSendMessage = () => {
    if (!selectedFan || !messageContent.trim()) return
    
    onSendMessage?.(selectedFan.id, messageContent, "email")
    setMessageContent("")
  }

  // Calculate days until next special date
  const getNextSpecialDate = (fan: Fan) => {
    const today = new Date()
    const dates = []
    
    if (fan.specialDates.birthday) {
      const thisYearBirthday = new Date(today.getFullYear(), fan.specialDates.birthday.getMonth(), fan.specialDates.birthday.getDate())
      if (thisYearBirthday < today) {
        thisYearBirthday.setFullYear(today.getFullYear() + 1)
      }
      dates.push({ name: "Birthday", date: thisYearBirthday })
    }
    
    if (fan.specialDates.anniversary) {
      const thisYearAnniversary = new Date(today.getFullYear(), fan.specialDates.anniversary.getMonth(), fan.specialDates.anniversary.getDate())
      if (thisYearAnniversary < today) {
        thisYearAnniversary.setFullYear(today.getFullYear() + 1)
      }
      dates.push({ name: "Anniversary", date: thisYearAnniversary })
    }

    fan.specialDates.custom.forEach(customDate => {
      const thisYearCustom = new Date(today.getFullYear(), customDate.date.getMonth(), customDate.date.getDate())
      if (thisYearCustom < today) {
        thisYearCustom.setFullYear(today.getFullYear() + 1)
      }
      dates.push({ name: customDate.name, date: thisYearCustom })
    })

    if (dates.length === 0) return null

    dates.sort((a, b) => a.date.getTime() - b.date.getTime())
    const nextDate = dates[0]
    const daysUntil = differenceInDays(nextDate.date, today)
    
    return { ...nextDate, daysUntil }
  }

  return (
    <TooltipProvider>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        {/* Sidebar - Fan List */}
        <div className="w-96 bg-white dark:bg-gray-800 border-r flex flex-col">
          {/* Header */}
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-6 w-6 text-blue-600" />
                <h1 className="text-xl font-semibold">Fan Database</h1>
              </div>
              <div className="flex items-center gap-1">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowJourneyView(!showJourneyView)}
                      className={showJourneyView ? "bg-purple-100 text-purple-600" : ""}
                    >
                      <Target className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Fan journey view</p>
                  </TooltipContent>
                </Tooltip>
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
                  onClick={() => setShowCampaignDialog(true)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search fans..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Select value={filterSegment} onValueChange={setFilterSegment}>
                <SelectTrigger>
                  <SelectValue placeholder="Segment" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Segments</SelectItem>
                  <SelectItem value="new_fans">New Fans</SelectItem>
                  <SelectItem value="active_fans">Active Fans</SelectItem>
                  <SelectItem value="super_fans">Super Fans</SelectItem>
                  <SelectItem value="advocates">Advocates</SelectItem>
                  <SelectItem value="dormant">Dormant</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterEngagement} onValueChange={setFilterEngagement}>
                <SelectTrigger>
                  <SelectValue placeholder="Engagement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="very_high">Very High</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lastActive">Last Active</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="lifetimeValue">Lifetime Value</SelectItem>
                  <SelectItem value="engagementScore">Engagement Score</SelectItem>
                  <SelectItem value="joinDate">Join Date</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
              >
                {viewMode === "list" ? <BarChart3 className="h-4 w-4" /> : <Users className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Segment Stats */}
          <div className="px-4 py-3 border-b bg-gray-50 dark:bg-gray-700">
            <div className="grid grid-cols-5 gap-1 text-xs">
              {Object.entries(segmentStats).map(([segment, stats]) => (
                <div key={segment} className="text-center">
                  <div className="font-semibold">{stats.count}</div>
                  <div className="text-gray-500 capitalize">{segment.replace('_', ' ')}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bulk Actions */}
          <AnimatePresence>
            {bulkSelectMode && selectedFans.size > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="p-3 bg-blue-50 dark:bg-blue-900/20 border-b"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {selectedFans.size} selected
                  </span>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("message")}>
                      <MessageSquare className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("tag")}>
                      <Tag className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleBulkAction("campaign")}>
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Fan List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              <AnimatePresence>
                {filteredFans.map((fan, index) => {
                  const nextSpecialDate = getNextSpecialDate(fan)
                  
                  return (
                    <motion.div
                      key={fan.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        "p-3 rounded-lg mb-2 cursor-pointer transition-all relative",
                        "hover:bg-gray-50 dark:hover:bg-gray-700",
                        selectedFan?.id === fan.id && "bg-blue-50 dark:bg-blue-900/20 border border-blue-200"
                      )}
                      onClick={() => setSelectedFan(fan)}
                    >
                      {bulkSelectMode && (
                        <div className="absolute top-2 left-2">
                          <input
                            type="checkbox"
                            checked={selectedFans.has(fan.id)}
                            onChange={(e) => {
                              e.stopPropagation()
                              handleFanToggle(fan.id)
                            }}
                            className="rounded"
                          />
                        </div>
                      )}

                      <div className={cn(
                        "flex items-start gap-3",
                        bulkSelectMode && "ml-6"
                      )}>
                        <div className="relative">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={fan.avatar} />
                            <AvatarFallback>{fan.avatar}</AvatarFallback>
                          </Avatar>
                          {fan.isVip && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                              <Crown className="h-2 w-2 text-white" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium text-sm truncate">{fan.name}</h3>
                            <span className="text-xs text-gray-500">
                              {formatDistanceToNow(fan.lastActive)} ago
                            </span>
                          </div>

                          <div className="flex items-center gap-2 mt-1">
                            <Badge
                              variant="outline"
                              className={cn("text-xs", getSegmentColor(fan.segment))}
                            >
                              {getSegmentIcon(fan.segment)}
                              <span className="ml-1 capitalize">{fan.segment.replace('_', ' ')}</span>
                            </Badge>
                          </div>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>${fan.lifetimeValue}</span>
                              <span>{fan.totalBookings} bookings</span>
                              <span className={getEngagementColor(fan.engagementLevel)}>
                                {fan.engagementScore}% engagement
                              </span>
                            </div>
                          </div>

                          {nextSpecialDate && nextSpecialDate.daysUntil <= 14 && (
                            <div className="mt-2 flex items-center gap-1 text-xs">
                              <Cake className="h-3 w-3 text-pink-500" />
                              <span className="text-pink-600">
                                {nextSpecialDate.name} in {nextSpecialDate.daysUntil} days
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {selectedFan ? (
            <>
              {/* Fan Header */}
              <div className="p-6 border-b bg-white dark:bg-gray-800">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedFan.avatar} />
                        <AvatarFallback className="text-2xl">{selectedFan.avatar}</AvatarFallback>
                      </Avatar>
                      {selectedFan.isVip && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                          <Crown className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-semibold">{selectedFan.name}</h2>
                        <Badge
                          variant="outline"
                          className={cn("text-sm", getSegmentColor(selectedFan.segment))}
                        >
                          {getSegmentIcon(selectedFan.segment)}
                          <span className="ml-1 capitalize">{selectedFan.segment.replace('_', ' ')}</span>
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <span className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {selectedFan.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {selectedFan.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Fan since {format(selectedFan.joinDate, "MMM yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-green-600 font-medium">
                          ${selectedFan.lifetimeValue} LTV
                        </span>
                        <span className="text-blue-600">
                          {selectedFan.totalBookings} bookings
                        </span>
                        <span className={getEngagementColor(selectedFan.engagementLevel)}>
                          {selectedFan.engagementScore}% engagement
                        </span>
                        {selectedFan.npsScore && (
                          <span className="text-purple-600">
                            NPS: {selectedFan.npsScore}/10
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowProfile(true)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Full Profile
                    </Button>
                    <Button size="sm">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Send Message
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Tag className="h-4 w-4 mr-2" />
                          Manage Tags
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Calendar className="h-4 w-4 mr-2" />
                          Set Reminder
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive Fan
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Fan Details Tabs */}
              <div className="flex-1 overflow-hidden">
                <Tabs defaultValue="overview" className="h-full flex flex-col">
                  <div className="px-6 pt-4">
                    <TabsList>
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="history">History</TabsTrigger>
                      <TabsTrigger value="communication">Communication</TabsTrigger>
                      <TabsTrigger value="preferences">Preferences</TabsTrigger>
                      <TabsTrigger value="automation">Automation</TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="flex-1 overflow-auto px-6 py-4">
                    <TabsContent value="overview" className="space-y-6 mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Key Metrics */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Key Metrics</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Engagement Score</span>
                                  <span className="font-medium">{selectedFan.engagementScore}%</span>
                                </div>
                                <Progress value={selectedFan.engagementScore} />
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Avg Order Value</span>
                                  <span className="font-medium">${selectedFan.avgOrderValue}</span>
                                </div>
                              </div>
                              <div>
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Referrals Made</span>
                                  <span className="font-medium">{selectedFan.referralCount}</span>
                                </div>
                              </div>
                              {selectedFan.npsScore && (
                                <div>
                                  <div className="flex justify-between text-sm mb-1">
                                    <span>NPS Score</span>
                                    <span className="font-medium">{selectedFan.npsScore}/10</span>
                                  </div>
                                  <Progress value={selectedFan.npsScore * 10} />
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Special Dates */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Special Dates</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {selectedFan.specialDates.birthday && (
                                <div className="flex items-center gap-3">
                                  <Cake className="h-4 w-4 text-pink-500" />
                                  <div>
                                    <div className="font-medium text-sm">Birthday</div>
                                    <div className="text-xs text-gray-500">
                                      {format(selectedFan.specialDates.birthday, "MMM d")}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {selectedFan.specialDates.anniversary && (
                                <div className="flex items-center gap-3">
                                  <Heart className="h-4 w-4 text-red-500" />
                                  <div>
                                    <div className="font-medium text-sm">Anniversary</div>
                                    <div className="text-xs text-gray-500">
                                      {format(selectedFan.specialDates.anniversary, "MMM d")}
                                    </div>
                                  </div>
                                </div>
                              )}
                              {selectedFan.specialDates.custom.map((date, index) => (
                                <div key={index} className="flex items-center gap-3">
                                  <Sparkles className="h-4 w-4 text-purple-500" />
                                  <div>
                                    <div className="font-medium text-sm">{date.name}</div>
                                    <div className="text-xs text-gray-500">
                                      {format(date.date, "MMM d")}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>

                        {/* Tags & Notes */}
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Tags & Notes</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium mb-2 block">Tags</Label>
                                <div className="flex flex-wrap gap-1">
                                  {selectedFan.tags.map((tag, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium mb-2 block">Notes</Label>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                  {selectedFan.notes}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Quick Actions */}
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <Button variant="outline" className="justify-start">
                              <Send className="h-4 w-4 mr-2" />
                              Send Message
                            </Button>
                            <Button variant="outline" className="justify-start">
                              <Gift className="h-4 w-4 mr-2" />
                              Send Offer
                            </Button>
                            <Button variant="outline" className="justify-start">
                              <Calendar className="h-4 w-4 mr-2" />
                              Set Reminder
                            </Button>
                            <Button variant="outline" className="justify-start">
                              <Tag className="h-4 w-4 mr-2" />
                              Add Tag
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="history" className="space-y-6 mt-0">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Booking History</CardTitle>
                          <CardDescription>
                            Complete history of all bookings and interactions
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-8">
                            <FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500">Booking history will be displayed here</p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="communication" className="space-y-6 mt-0">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Communication History</CardTitle>
                          <CardDescription>
                            All emails, messages, and interactions with this fan
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-8">
                            <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500">Communication history will be displayed here</p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="preferences" className="space-y-6 mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Communication Preferences</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm font-medium mb-2 block">Preferred Channels</Label>
                                <div className="space-y-2">
                                  {selectedFan.preferences.communicationChannels.map((channel, index) => (
                                    <Badge key={index} variant="outline" className="mr-2">
                                      {channel}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium mb-2 block">Languages</Label>
                                <div className="space-y-2">
                                  {selectedFan.preferences.languages.map((language, index) => (
                                    <Badge key={index} variant="outline" className="mr-2">
                                      {language}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <Label className="text-sm font-medium mb-2 block">Timezone</Label>
                                <p className="text-sm">{selectedFan.preferences.timezone}</p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg">Occasion Preferences</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2">
                              {selectedFan.preferences.occasions.map((occasion, index) => (
                                <Badge key={index} variant="secondary" className="mr-2 mb-2">
                                  {occasion}
                                </Badge>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>

                    <TabsContent value="automation" className="space-y-6 mt-0">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Engagement Automation</CardTitle>
                          <CardDescription>
                            Automated campaigns and reminders for this fan
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="text-center py-8">
                            <Zap className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500">Automation rules will be displayed here</p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
              <div className="text-center">
                <Users className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Select a fan</h3>
                <p className="text-gray-500">Choose a fan from the sidebar to view their profile and relationship data</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </TooltipProvider>
  )
}