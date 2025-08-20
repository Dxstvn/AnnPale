"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Star,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Video,
  Users,
  Clock,
  Activity,
  Award,
  Shield,
  Eye,
  Edit,
  MoreVertical,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Target,
  Zap,
  Crown,
  Heart,
  ThumbsUp,
  MapPin,
  Globe,
  Phone,
  Mail,
  Trophy
} from "lucide-react"

interface Creator {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  joinDate: string
  lastActive: string
  status: "active" | "inactive" | "suspended" | "pending_review"
  verificationLevel: "unverified" | "basic" | "premium" | "verified"
  featuredStatus: "none" | "featured" | "premium_featured" | "trending"
  category: string
  location: string
  languages: string[]
  
  // Performance Metrics
  performance: {
    totalEarnings: number
    monthlyEarnings: number
    totalOrders: number
    completionRate: number
    averageRating: number
    totalReviews: number
    responseTime: number // in hours
    lastDelivery: string
  }
  
  // Ranking & Tiers
  ranking: {
    overall: number
    category: number
    revenueRank: number
    qualityRank: number
  }
  
  revenueTier: "bronze" | "silver" | "gold" | "platinum" | "diamond"
  
  // Activity & Engagement
  activity: {
    loginStreak: number
    videosThisMonth: number
    responseRate: number
    profileViews: number
    bookingConversion: number
  }
  
  // Compliance & Health
  compliance: {
    score: number
    violations: number
    lastViolation?: string
    policyVersion: string
  }
  
  relationshipHealth: {
    score: number
    customerSatisfaction: number
    supportTickets: number
    escalations: number
  }
  
  // Profile Settings
  profile: {
    bio: string
    specialties: string[]
    priceRange: { min: number; max: number }
    availability: "high" | "medium" | "low"
    languages: string[]
    responseTime: string
  }
}

const mockCreators: Creator[] = [
  {
    id: "CRT001",
    name: "Ti Jo Zenny",
    email: "tijo@annpale.com",
    phone: "+1 (555) 987-6543",
    avatar: "/images/ti-jo-zenny.jpg",
    joinDate: "2023-08-20",
    lastActive: "2024-01-15T10:15:00",
    status: "active",
    verificationLevel: "verified",
    featuredStatus: "premium_featured",
    category: "Music",
    location: "Miami, FL",
    languages: ["Kreyòl", "English"],
    performance: {
      totalEarnings: 12500,
      monthlyEarnings: 2800,
      totalOrders: 145,
      completionRate: 98.5,
      averageRating: 4.8,
      totalReviews: 234,
      responseTime: 2.5,
      lastDelivery: "2024-01-15T08:30:00"
    },
    ranking: {
      overall: 1,
      category: 1,
      revenueRank: 2,
      qualityRank: 1
    },
    revenueTier: "diamond",
    activity: {
      loginStreak: 15,
      videosThisMonth: 28,
      responseRate: 95,
      profileViews: 2341,
      bookingConversion: 12.5
    },
    compliance: {
      score: 98,
      violations: 0,
      policyVersion: "2024.1"
    },
    relationshipHealth: {
      score: 95,
      customerSatisfaction: 96,
      supportTickets: 2,
      escalations: 0
    },
    profile: {
      bio: "Haitian singer bringing joy through personalized musical messages",
      specialties: ["Birthday Songs", "Motivational Messages", "Cultural Content"],
      priceRange: { min: 50, max: 200 },
      availability: "high",
      languages: ["Kreyòl", "English"],
      responseTime: "2-4 hours"
    }
  },
  {
    id: "CRT002",
    name: "Marie Ange",
    email: "marie.ange@email.com",
    joinDate: "2023-12-15",
    lastActive: "2024-01-14T18:45:00",
    status: "active",
    verificationLevel: "premium",
    featuredStatus: "featured",
    category: "Comedy",
    location: "Montreal, QC",
    languages: ["Français", "English"],
    performance: {
      totalEarnings: 8750,
      monthlyEarnings: 1950,
      totalOrders: 89,
      completionRate: 96.2,
      averageRating: 4.6,
      totalReviews: 156,
      responseTime: 4.2,
      lastDelivery: "2024-01-14T16:20:00"
    },
    ranking: {
      overall: 3,
      category: 2,
      revenueRank: 5,
      qualityRank: 3
    },
    revenueTier: "gold",
    activity: {
      loginStreak: 8,
      videosThisMonth: 18,
      responseRate: 88,
      profileViews: 1456,
      bookingConversion: 9.8
    },
    compliance: {
      score: 94,
      violations: 1,
      lastViolation: "2023-11-20",
      policyVersion: "2024.1"
    },
    relationshipHealth: {
      score: 89,
      customerSatisfaction: 91,
      supportTickets: 3,
      escalations: 1
    },
    profile: {
      bio: "Comedy creator spreading laughter in French and English",
      specialties: ["Funny Greetings", "Roasts", "Impressions"],
      priceRange: { min: 25, max: 100 },
      availability: "medium",
      languages: ["Français", "English"],
      responseTime: "4-8 hours"
    }
  },
  {
    id: "CRT003",
    name: "Jean Baptiste",
    email: "jean.baptiste@email.com",
    joinDate: "2024-01-10",
    lastActive: "2024-01-14T12:30:00",
    status: "active",
    verificationLevel: "basic",
    featuredStatus: "trending",
    category: "Lifestyle",
    location: "Port-au-Prince, Haiti",
    languages: ["Kreyòl"],
    performance: {
      totalEarnings: 450,
      monthlyEarnings: 450,
      totalOrders: 8,
      completionRate: 87.5,
      averageRating: 4.2,
      totalReviews: 12,
      responseTime: 8.5,
      lastDelivery: "2024-01-13T14:15:00"
    },
    ranking: {
      overall: 125,
      category: 45,
      revenueRank: 234,
      qualityRank: 89
    },
    revenueTier: "bronze",
    activity: {
      loginStreak: 3,
      videosThisMonth: 8,
      responseRate: 75,
      profileViews: 234,
      bookingConversion: 6.2
    },
    compliance: {
      score: 85,
      violations: 2,
      lastViolation: "2024-01-08",
      policyVersion: "2024.1"
    },
    relationshipHealth: {
      score: 78,
      customerSatisfaction: 82,
      supportTickets: 5,
      escalations: 2
    },
    profile: {
      bio: "Lifestyle coach and motivational speaker from Haiti",
      specialties: ["Motivation", "Life Advice", "Cultural Education"],
      priceRange: { min: 15, max: 50 },
      availability: "low",
      languages: ["Kreyòl"],
      responseTime: "8-12 hours"
    }
  }
]

const getTierColor = (tier: Creator["revenueTier"]) => {
  switch (tier) {
    case "diamond": return "bg-purple-100 text-purple-800"
    case "platinum": return "bg-gray-100 text-gray-800"
    case "gold": return "bg-yellow-100 text-yellow-800"
    case "silver": return "bg-gray-100 text-gray-600"
    case "bronze": return "bg-orange-100 text-orange-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getTierIcon = (tier: Creator["revenueTier"]) => {
  switch (tier) {
    case "diamond": return Crown
    case "platinum": return Award
    case "gold": return Star
    case "silver": return Target
    case "bronze": return Shield
    default: return Award
  }
}

const getVerificationColor = (level: Creator["verificationLevel"]) => {
  switch (level) {
    case "verified": return "bg-blue-100 text-blue-800"
    case "premium": return "bg-purple-100 text-purple-800"
    case "basic": return "bg-green-100 text-green-800"
    case "unverified": return "bg-gray-100 text-gray-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getStatusColor = (status: Creator["status"]) => {
  switch (status) {
    case "active": return "bg-green-100 text-green-800"
    case "inactive": return "bg-gray-100 text-gray-800"
    case "suspended": return "bg-red-100 text-red-800"
    case "pending_review": return "bg-yellow-100 text-yellow-800"
    default: return "bg-gray-100 text-gray-800"
  }
}

const getFeaturedIcon = (status: Creator["featuredStatus"]) => {
  switch (status) {
    case "premium_featured": return Crown
    case "featured": return Star
    case "trending": return TrendingUp
    case "none": return null
    default: return null
  }
}

export function CreatorDirectory() {
  const [creators, setCreators] = useState<Creator[]>(mockCreators)
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterTier, setFilterTier] = useState("all")
  const [sortBy, setSortBy] = useState("overall_rank")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")

  const filteredAndSortedCreators = useMemo(() => {
    let filtered = creators.filter(creator => {
      const matchesSearch = searchQuery === "" ||
        creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        creator.category.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesCategory = filterCategory === "all" || creator.category === filterCategory
      const matchesStatus = filterStatus === "all" || creator.status === filterStatus
      const matchesTier = filterTier === "all" || creator.revenueTier === filterTier
      
      return matchesSearch && matchesCategory && matchesStatus && matchesTier
    })

    // Sort creators
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "overall_rank":
          return a.ranking.overall - b.ranking.overall
        case "revenue":
          return b.performance.totalEarnings - a.performance.totalEarnings
        case "rating":
          return b.performance.averageRating - a.performance.averageRating
        case "completion_rate":
          return b.performance.completionRate - a.performance.completionRate
        case "join_date":
          return new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
        case "last_active":
          return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [creators, searchQuery, filterCategory, filterStatus, filterTier, sortBy])

  const stats = {
    total: creators.length,
    active: creators.filter(c => c.status === "active").length,
    verified: creators.filter(c => c.verificationLevel === "verified").length,
    featured: creators.filter(c => c.featuredStatus !== "none").length,
    totalRevenue: creators.reduce((sum, c) => sum + c.performance.totalEarnings, 0),
    avgRating: creators.reduce((sum, c) => sum + c.performance.averageRating, 0) / creators.length
  }

  return (
    <div className="space-y-6">
      {/* Directory Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Creators</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold">{stats.verified}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Featured</p>
                <p className="text-2xl font-bold">{stats.featured}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-2xl font-bold">{stats.avgRating.toFixed(1)}</p>
              </div>
              <Star className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Creator Directory */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Creator Directory</CardTitle>
              <CardDescription>Comprehensive creator management with performance rankings and analytics</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Advanced Filters */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Music">Music</SelectItem>
                <SelectItem value="Comedy">Comedy</SelectItem>
                <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                <SelectItem value="Sports">Sports</SelectItem>
                <SelectItem value="Entertainment">Entertainment</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending_review">Pending Review</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterTier} onValueChange={setFilterTier}>
              <SelectTrigger>
                <SelectValue placeholder="Revenue Tier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="diamond">Diamond</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overall_rank">Overall Rank</SelectItem>
                <SelectItem value="revenue">Revenue</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="completion_rate">Completion Rate</SelectItem>
                <SelectItem value="join_date">Join Date</SelectItem>
                <SelectItem value="last_active">Last Active</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Advanced
            </Button>
          </div>

          {/* Creator Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Creator</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Rankings</TableHead>
                  <TableHead>Revenue Tier</TableHead>
                  <TableHead>Compliance</TableHead>
                  <TableHead>Activity</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedCreators.map((creator) => {
                  const TierIcon = getTierIcon(creator.revenueTier)
                  const FeaturedIcon = getFeaturedIcon(creator.featuredStatus)
                  return (
                    <TableRow key={creator.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={creator.avatar} />
                              <AvatarFallback>{creator.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                            </Avatar>
                            {creator.verificationLevel === "verified" && (
                              <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                                <CheckCircle className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{creator.name}</p>
                              {FeaturedIcon && (
                                <FeaturedIcon className="h-4 w-4 text-yellow-500" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{creator.email}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline">{creator.category}</Badge>
                              <Badge className={getStatusColor(creator.status)}>
                                {creator.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Star className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{creator.performance.averageRating.toFixed(1)}</span>
                            <span className="text-sm text-muted-foreground">({creator.performance.totalReviews})</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{creator.performance.completionRate.toFixed(1)}%</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">{creator.performance.responseTime.toFixed(1)}h</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Trophy className="h-4 w-4 text-purple-500" />
                            <span className="font-medium">#{creator.ranking.overall}</span>
                            <span className="text-sm text-muted-foreground">overall</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">#{creator.ranking.category} in {creator.category}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="p-1 rounded-lg bg-gray-100">
                            <TierIcon className="h-4 w-4" />
                          </div>
                          <div>
                            <Badge className={getTierColor(creator.revenueTier)} variant="outline">
                              {creator.revenueTier}
                            </Badge>
                            <p className="text-sm text-muted-foreground">
                              ${creator.performance.totalEarnings.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-500 h-2 rounded-full" 
                                style={{ width: `${creator.compliance.score}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{creator.compliance.score}%</span>
                          </div>
                          {creator.compliance.violations > 0 && (
                            <div className="flex items-center space-x-1">
                              <AlertTriangle className="h-3 w-3 text-orange-500" />
                              <span className="text-xs text-orange-600">{creator.compliance.violations} violations</span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <Activity className="h-4 w-4 text-green-500" />
                            <span className="text-sm">{creator.activity.loginStreak} day streak</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Video className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">{creator.activity.videosThisMonth} videos</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Last: {new Date(creator.lastActive).toLocaleDateString()}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {
                              setSelectedCreator(creator)
                              setIsDetailsOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="ghost">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Profile
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <MessageSquare className="h-4 w-4 mr-2" />
                                Send Message
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Star className="h-4 w-4 mr-2" />
                                Toggle Featured
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <Shield className="h-4 w-4 mr-2" />
                                Review Compliance
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Creator Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Creator Profile Details</DialogTitle>
            <DialogDescription>
              Comprehensive creator information and performance analytics
            </DialogDescription>
          </DialogHeader>

          {selectedCreator && (
            <div className="space-y-6">
              {/* Creator Header */}
              <div className="flex items-center space-x-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedCreator.avatar} />
                    <AvatarFallback className="text-xl">
                      {selectedCreator.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  {selectedCreator.verificationLevel === "verified" && (
                    <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold">{selectedCreator.name}</h2>
                    {(() => {
                      const FeaturedIcon = getFeaturedIcon(selectedCreator.featuredStatus)
                      return FeaturedIcon && <FeaturedIcon className="h-6 w-6 text-yellow-500" />
                    })()}
                  </div>
                  <p className="text-muted-foreground mb-3">{selectedCreator.profile.bio}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getStatusColor(selectedCreator.status)}>
                      {selectedCreator.status}
                    </Badge>
                    <Badge className={getVerificationColor(selectedCreator.verificationLevel)}>
                      {selectedCreator.verificationLevel}
                    </Badge>
                    <Badge className={getTierColor(selectedCreator.revenueTier)}>
                      {selectedCreator.revenueTier} tier
                    </Badge>
                    <Badge variant="outline">{selectedCreator.category}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-5 w-5 text-purple-500" />
                      <span className="font-bold">#{selectedCreator.ranking.overall}</span>
                      <span className="text-sm text-muted-foreground">Overall</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="font-bold">{selectedCreator.performance.averageRating.toFixed(1)}</span>
                      <span className="text-sm text-muted-foreground">({selectedCreator.performance.totalReviews})</span>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="performance" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                  <TabsTrigger value="relationship">Relationship</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                </TabsList>

                <TabsContent value="performance" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Revenue Metrics */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center space-x-2">
                          <DollarSign className="h-4 w-4" />
                          <span>Revenue</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <p className="text-2xl font-bold">${selectedCreator.performance.totalEarnings.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Total Earnings</p>
                          </div>
                          <div>
                            <p className="text-lg font-medium text-green-600">${selectedCreator.performance.monthlyEarnings.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">This Month</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Order Metrics */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center space-x-2">
                          <Video className="h-4 w-4" />
                          <span>Orders</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <p className="text-2xl font-bold">{selectedCreator.performance.totalOrders}</p>
                            <p className="text-sm text-muted-foreground">Total Orders</p>
                          </div>
                          <div>
                            <p className="text-lg font-medium text-green-600">{selectedCreator.performance.completionRate.toFixed(1)}%</p>
                            <p className="text-sm text-muted-foreground">Completion Rate</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quality Metrics */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center space-x-2">
                          <Star className="h-4 w-4" />
                          <span>Quality</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <p className="text-2xl font-bold">{selectedCreator.performance.averageRating.toFixed(1)}</p>
                            <p className="text-sm text-muted-foreground">Average Rating</p>
                          </div>
                          <div>
                            <p className="text-lg font-medium">{selectedCreator.performance.totalReviews}</p>
                            <p className="text-sm text-muted-foreground">Total Reviews</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Response Metrics */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm flex items-center space-x-2">
                          <Clock className="h-4 w-4" />
                          <span>Response</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <p className="text-2xl font-bold">{selectedCreator.performance.responseTime.toFixed(1)}h</p>
                            <p className="text-sm text-muted-foreground">Avg Response Time</p>
                          </div>
                          <div>
                            <p className="text-lg font-medium text-green-600">{selectedCreator.activity.responseRate}%</p>
                            <p className="text-sm text-muted-foreground">Response Rate</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Rankings Section */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Rankings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-purple-600">#{selectedCreator.ranking.overall}</p>
                          <p className="text-sm text-muted-foreground">Overall Rank</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-blue-600">#{selectedCreator.ranking.category}</p>
                          <p className="text-sm text-muted-foreground">Category Rank</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-green-600">#{selectedCreator.ranking.revenueRank}</p>
                          <p className="text-sm text-muted-foreground">Revenue Rank</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-yellow-600">#{selectedCreator.ranking.qualityRank}</p>
                          <p className="text-sm text-muted-foreground">Quality Rank</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="profile" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Bio</Label>
                          <p className="text-sm">{selectedCreator.profile.bio}</p>
                        </div>
                        <div>
                          <Label>Specialties</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedCreator.profile.specialties.map((specialty, index) => (
                              <Badge key={index} variant="outline">{specialty}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <Label>Languages</Label>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {selectedCreator.profile.languages.map((language, index) => (
                              <Badge key={index} variant="secondary">{language}</Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Service Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <Label>Price Range</Label>
                          <p className="text-sm">${selectedCreator.profile.priceRange.min} - ${selectedCreator.profile.priceRange.max}</p>
                        </div>
                        <div>
                          <Label>Availability</Label>
                          <Badge variant="outline" className="capitalize">{selectedCreator.profile.availability}</Badge>
                        </div>
                        <div>
                          <Label>Response Time</Label>
                          <p className="text-sm">{selectedCreator.profile.responseTime}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Login Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <p className="text-2xl font-bold">{selectedCreator.activity.loginStreak}</p>
                            <p className="text-sm text-muted-foreground">Day Streak</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Last Active</p>
                            <p className="text-sm">{new Date(selectedCreator.lastActive).toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Content Activity</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <p className="text-2xl font-bold">{selectedCreator.activity.videosThisMonth}</p>
                            <p className="text-sm text-muted-foreground">Videos This Month</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Last Delivery</p>
                            <p className="text-sm">{new Date(selectedCreator.performance.lastDelivery).toLocaleString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-sm">Engagement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div>
                            <p className="text-2xl font-bold">{selectedCreator.activity.profileViews.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">Profile Views</p>
                          </div>
                          <div>
                            <p className="text-lg font-medium">{selectedCreator.activity.bookingConversion.toFixed(1)}%</p>
                            <p className="text-sm text-muted-foreground">Booking Conversion</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="compliance" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Compliance Score</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Overall Score</span>
                              <span className="text-2xl font-bold">{selectedCreator.compliance.score}%</span>
                            </div>
                            <Progress value={selectedCreator.compliance.score} />
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Policy Version</p>
                            <p className="text-sm font-medium">{selectedCreator.compliance.policyVersion}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Violation History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="text-2xl font-bold">{selectedCreator.compliance.violations}</p>
                            <p className="text-sm text-muted-foreground">Total Violations</p>
                          </div>
                          {selectedCreator.compliance.lastViolation && (
                            <div>
                              <p className="text-sm text-muted-foreground">Last Violation</p>
                              <p className="text-sm">{new Date(selectedCreator.compliance.lastViolation).toLocaleDateString()}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="relationship" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Relationship Health</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">Health Score</span>
                              <span className="text-2xl font-bold">{selectedCreator.relationshipHealth.score}%</span>
                            </div>
                            <Progress value={selectedCreator.relationshipHealth.score} />
                          </div>
                          <div>
                            <p className="text-lg font-medium">{selectedCreator.relationshipHealth.customerSatisfaction}%</p>
                            <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Support Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <p className="text-2xl font-bold">{selectedCreator.relationshipHealth.supportTickets}</p>
                            <p className="text-sm text-muted-foreground">Support Tickets</p>
                          </div>
                          <div>
                            <p className="text-lg font-medium">{selectedCreator.relationshipHealth.escalations}</p>
                            <p className="text-sm text-muted-foreground">Escalations</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="contact" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-center space-x-3">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{selectedCreator.email}</p>
                              <p className="text-sm text-muted-foreground">Email</p>
                            </div>
                          </div>
                          {selectedCreator.phone && (
                            <div className="flex items-center space-x-3">
                              <Phone className="h-5 w-5 text-muted-foreground" />
                              <div>
                                <p className="font-medium">{selectedCreator.phone}</p>
                                <p className="text-sm text-muted-foreground">Phone</p>
                              </div>
                            </div>
                          )}
                          <div className="flex items-center space-x-3">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="font-medium">{selectedCreator.location}</p>
                              <p className="text-sm text-muted-foreground">Location</p>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="font-medium mb-2">Account Details</p>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Joined:</span>
                                <span>{new Date(selectedCreator.joinDate).toLocaleDateString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Creator ID:</span>
                                <span className="font-mono">{selectedCreator.id}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailsOpen(false)}>
              Close
            </Button>
            <Button variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button>
              <Edit className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}