"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Users,
  User,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Activity,
  Shield,
  Ban,
  Edit,
  Eye,
  Download,
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  DollarSign,
  Video,
  Star,
  MessageSquare,
  TrendingUp,
  Lock,
  Unlock,
  Settings,
  RefreshCw,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
  ArrowUpDown,
  Plus,
  Minus,
  Send,
  FileText,
  History,
  AlertTriangle,
  Zap,
  Globe,
  Building,
  Briefcase
} from "lucide-react"

interface EnhancedUser {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  type: "customer" | "creator" | "admin" | "moderator"
  status: "active" | "inactive" | "suspended" | "pending" | "banned"
  joinDate: string
  lastActive: string
  location?: string
  country?: string
  timezone?: string
  language: string
  emailVerified: boolean
  phoneVerified: boolean
  idVerified: boolean
  twoFactorEnabled: boolean
  totalSpent?: number
  totalEarned?: number
  totalOrders?: number
  totalVideos?: number
  rating?: number
  reviews?: number
  violations: number
  notes?: string
  tags: string[]
  deviceInfo?: {
    lastDevice: string
    browser: string
    os: string
  }
  riskScore: number
  lifetimeValue: number
  engagementLevel: "low" | "medium" | "high"
  supportTickets: number
  referrals: number
  socialConnections?: {
    facebook?: string
    twitter?: string
    instagram?: string
  }
}

interface UserActivity {
  id: string
  type: "login" | "purchase" | "upload" | "message" | "violation" | "support"
  description: string
  timestamp: string
  metadata?: Record<string, any>
  severity: "low" | "medium" | "high"
}

interface FilterState {
  search: string
  type: string
  status: string
  verified: string
  location: string
  joinDateRange?: { from: Date; to: Date }
  activity: string
  riskLevel: string
  engagement: string
  tags: string[]
}

interface BulkAction {
  id: string
  label: string
  icon: React.ElementType
  requiresConfirmation: boolean
  requiresReason: boolean
  permission: string
  action: (userIds: string[], reason?: string) => void
}

const mockUsers: EnhancedUser[] = [
  {
    id: "USR001",
    name: "Marie Laurent",
    email: "marie.laurent@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "/placeholder-user.jpg",
    type: "customer",
    status: "active",
    joinDate: "2023-06-15T00:00:00Z",
    lastActive: "2024-01-15T14:30:00Z",
    location: "New York, NY",
    country: "United States",
    timezone: "America/New_York",
    language: "English",
    emailVerified: true,
    phoneVerified: true,
    idVerified: false,
    twoFactorEnabled: false,
    totalSpent: 850,
    totalOrders: 12,
    violations: 0,
    tags: ["premium", "loyal"],
    deviceInfo: {
      lastDevice: "iPhone 15 Pro",
      browser: "Safari",
      os: "iOS 17"
    },
    riskScore: 15,
    lifetimeValue: 1200,
    engagementLevel: "high",
    supportTickets: 2,
    referrals: 3,
    socialConnections: {
      facebook: "marie.laurent.ny",
      instagram: "@marie_laurent"
    }
  },
  {
    id: "CRT001",
    name: "Ti Jo Zenny",
    email: "tijo@annpale.com",
    phone: "+1 (555) 987-6543",
    avatar: "/images/ti-jo-zenny.jpg",
    type: "creator",
    status: "active",
    joinDate: "2023-08-20T00:00:00Z",
    lastActive: "2024-01-15T10:15:00Z",
    location: "Miami, FL",
    country: "United States",
    timezone: "America/New_York",
    language: "Kreyòl",
    emailVerified: true,
    phoneVerified: true,
    idVerified: true,
    twoFactorEnabled: true,
    totalEarned: 12500,
    totalVideos: 145,
    rating: 4.8,
    reviews: 234,
    violations: 0,
    tags: ["verified", "popular", "comedian"],
    deviceInfo: {
      lastDevice: "MacBook Pro",
      browser: "Chrome",
      os: "macOS"
    },
    riskScore: 5,
    lifetimeValue: 15000,
    engagementLevel: "high",
    supportTickets: 1,
    referrals: 25,
    socialConnections: {
      instagram: "@tijozennyofficial",
      facebook: "tijo.zenny"
    }
  },
  {
    id: "USR002",
    name: "Jean Pierre",
    email: "jpierre@email.com",
    type: "customer",
    status: "suspended",
    joinDate: "2023-09-10T00:00:00Z",
    lastActive: "2024-01-10T08:00:00Z",
    location: "Montreal, QC",
    country: "Canada",
    timezone: "America/Montreal",
    language: "Français",
    emailVerified: true,
    phoneVerified: false,
    idVerified: false,
    twoFactorEnabled: false,
    totalSpent: 250,
    totalOrders: 3,
    violations: 2,
    notes: "Suspended for repeated payment disputes",
    tags: ["high-risk", "disputed"],
    deviceInfo: {
      lastDevice: "Samsung Galaxy S23",
      browser: "Chrome",
      os: "Android"
    },
    riskScore: 85,
    lifetimeValue: 250,
    engagementLevel: "low",
    supportTickets: 8,
    referrals: 0
  },
  {
    id: "CRT002",
    name: "Sarah Williams",
    email: "sarah.w@email.com",
    type: "creator",
    status: "pending",
    joinDate: "2024-01-14T00:00:00Z",
    lastActive: "2024-01-14T16:45:00Z",
    location: "London, UK",
    country: "United Kingdom",
    timezone: "Europe/London",
    language: "English",
    emailVerified: true,
    phoneVerified: false,
    idVerified: false,
    twoFactorEnabled: false,
    totalEarned: 0,
    totalVideos: 0,
    violations: 0,
    tags: ["new-applicant", "musician"],
    deviceInfo: {
      lastDevice: "iPad Pro",
      browser: "Safari",
      os: "iPadOS"
    },
    riskScore: 25,
    lifetimeValue: 0,
    engagementLevel: "medium",
    supportTickets: 0,
    referrals: 0
  },
  {
    id: "ADM001",
    name: "Marcus Johnson",
    email: "marcus.johnson@annpale.com",
    type: "moderator",
    status: "active",
    joinDate: "2023-05-01T00:00:00Z",
    lastActive: "2024-01-15T15:00:00Z",
    location: "Port-au-Prince, Haiti",
    country: "Haiti",
    timezone: "America/Port-au-Prince",
    language: "Kreyòl",
    emailVerified: true,
    phoneVerified: true,
    idVerified: true,
    twoFactorEnabled: true,
    violations: 0,
    tags: ["staff", "content-moderator"],
    deviceInfo: {
      lastDevice: "Dell Laptop",
      browser: "Firefox",
      os: "Windows 11"
    },
    riskScore: 0,
    lifetimeValue: 0,
    engagementLevel: "high",
    supportTickets: 0,
    referrals: 0
  }
]

const availableTags = [
  "premium", "loyal", "verified", "popular", "comedian", "musician", "actor",
  "high-risk", "disputed", "new-applicant", "staff", "content-moderator",
  "vip", "beta-tester", "ambassador", "influencer"
]

const bulkActions: BulkAction[] = [
  {
    id: "suspend",
    label: "Suspend Users",
    icon: Ban,
    requiresConfirmation: true,
    requiresReason: true,
    permission: "user_suspend",
    action: (userIds, reason) => console.log("Suspending users:", userIds, reason)
  },
  {
    id: "activate",
    label: "Activate Users",
    icon: UserCheck,
    requiresConfirmation: true,
    requiresReason: false,
    permission: "user_edit",
    action: (userIds) => console.log("Activating users:", userIds)
  },
  {
    id: "verify_email",
    label: "Verify Emails",
    icon: Mail,
    requiresConfirmation: false,
    requiresReason: false,
    permission: "user_edit",
    action: (userIds) => console.log("Verifying emails:", userIds)
  },
  {
    id: "send_message",
    label: "Send Message",
    icon: MessageSquare,
    requiresConfirmation: false,
    requiresReason: true,
    permission: "user_edit",
    action: (userIds, message) => console.log("Sending message:", userIds, message)
  },
  {
    id: "export",
    label: "Export Data",
    icon: Download,
    requiresConfirmation: false,
    requiresReason: false,
    permission: "user_view",
    action: (userIds) => console.log("Exporting users:", userIds)
  }
]

export function EnhancedUserManagement() {
  const [users, setUsers] = useState<EnhancedUser[]>(mockUsers)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [selectedUser, setSelectedUser] = useState<EnhancedUser | null>(null)
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false)
  const [isBulkActionOpen, setIsBulkActionOpen] = useState(false)
  const [selectedBulkAction, setSelectedBulkAction] = useState<BulkAction | null>(null)
  const [bulkActionReason, setBulkActionReason] = useState("")
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false)
  
  // Filter and sorting state
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    type: "all",
    status: "all",
    verified: "all",
    location: "all",
    activity: "all",
    riskLevel: "all",
    engagement: "all",
    tags: []
  })
  
  const [sortConfig, setSortConfig] = useState<{
    key: keyof EnhancedUser | null
    direction: "asc" | "desc"
  }>({ key: null, direction: "asc" })
  
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(25)
  const [viewDensity, setViewDensity] = useState<"compact" | "comfortable" | "spacious">("comfortable")

  // Filtered and sorted users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Search filter
      if (filters.search && !user.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !user.email.toLowerCase().includes(filters.search.toLowerCase()) &&
          !user.id.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      
      // Type filter
      if (filters.type !== "all" && user.type !== filters.type) return false
      
      // Status filter
      if (filters.status !== "all" && user.status !== filters.status) return false
      
      // Verification filter
      if (filters.verified === "verified" && !user.emailVerified) return false
      if (filters.verified === "unverified" && user.emailVerified) return false
      
      // Location filter
      if (filters.location !== "all" && user.country !== filters.location) return false
      
      // Risk level filter
      if (filters.riskLevel === "low" && user.riskScore > 30) return false
      if (filters.riskLevel === "medium" && (user.riskScore <= 30 || user.riskScore > 70)) return false
      if (filters.riskLevel === "high" && user.riskScore <= 70) return false
      
      // Engagement filter
      if (filters.engagement !== "all" && user.engagementLevel !== filters.engagement) return false
      
      // Tags filter
      if (filters.tags.length > 0 && !filters.tags.some(tag => user.tags.includes(tag))) return false
      
      return true
    })
  }, [users, filters])

  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return filteredUsers
    
    return [...filteredUsers].sort((a, b) => {
      const aVal = a[sortConfig.key!]
      const bVal = b[sortConfig.key!]
      
      if (aVal === undefined || aVal === null) return 1
      if (bVal === undefined || bVal === null) return -1
      
      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortConfig.direction === "asc" 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      
      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal
      }
      
      return 0
    })
  }, [filteredUsers, sortConfig])

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return sortedUsers.slice(startIndex, startIndex + pageSize)
  }, [sortedUsers, currentPage, pageSize])

  const totalPages = Math.ceil(sortedUsers.length / pageSize)

  const handleSort = (key: keyof EnhancedUser) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc"
    }))
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const handleSelectAll = () => {
    setSelectedUsers(prev => 
      prev.length === paginatedUsers.length 
        ? []
        : paginatedUsers.map(user => user.id)
    )
  }

  const handleBulkAction = (action: BulkAction) => {
    setSelectedBulkAction(action)
    setIsBulkActionOpen(true)
  }

  const executeBulkAction = () => {
    if (selectedBulkAction) {
      selectedBulkAction.action(selectedUsers, bulkActionReason)
      setSelectedUsers([])
      setIsBulkActionOpen(false)
      setBulkActionReason("")
      setSelectedBulkAction(null)
    }
  }

  const getUserStatusColor = (status: EnhancedUser["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "banned":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUserTypeColor = (type: EnhancedUser["type"]) => {
    switch (type) {
      case "customer":
        return "bg-blue-100 text-blue-800"
      case "creator":
        return "bg-purple-100 text-purple-800"
      case "admin":
        return "bg-red-100 text-red-800"
      case "moderator":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getRiskScoreColor = (score: number) => {
    if (score <= 30) return "text-green-600"
    if (score <= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getEngagementColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats and Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <div className="flex items-center space-x-4 mt-2">
            <Badge variant="outline">{sortedUsers.length} users</Badge>
            <Badge variant="outline">{selectedUsers.length} selected</Badge>
            {selectedUsers.length > 0 && (
              <Badge variant="secondary">Bulk actions available</Badge>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setIsAdvancedFilterOpen(true)}>
            <Filter className="h-4 w-4 mr-2" />
            Advanced Filters
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Quick Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search users..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="pl-10"
              />
            </div>

            <Select value={filters.type} onValueChange={(value) => setFilters(prev => ({ ...prev, type: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="User Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="customer">Customers</SelectItem>
                <SelectItem value="creator">Creators</SelectItem>
                <SelectItem value="admin">Admins</SelectItem>
                <SelectItem value="moderator">Moderators</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="banned">Banned</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.verified} onValueChange={(value) => setFilters(prev => ({ ...prev, verified: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="unverified">Unverified</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.riskLevel} onValueChange={(value) => setFilters(prev => ({ ...prev, riskLevel: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Risk Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk Levels</SelectItem>
                <SelectItem value="low">Low Risk (0-30)</SelectItem>
                <SelectItem value="medium">Medium Risk (31-70)</SelectItem>
                <SelectItem value="high">High Risk (71-100)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.engagement} onValueChange={(value) => setFilters(prev => ({ ...prev, engagement: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Engagement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Bulk Actions Bar */}
      {selectedUsers.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="font-medium">{selectedUsers.length} users selected</span>
                <Button variant="ghost" size="sm" onClick={() => setSelectedUsers([])}>
                  Clear selection
                </Button>
              </div>
              <div className="flex items-center space-x-2">
                {bulkActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkAction(action)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {action.label}
                    </Button>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Users ({sortedUsers.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={viewDensity} onValueChange={(value: "compact" | "comfortable" | "spacious") => setViewDensity(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="compact">Compact</SelectItem>
                  <SelectItem value="comfortable">Comfortable</SelectItem>
                  <SelectItem value="spacious">Spacious</SelectItem>
                </SelectContent>
              </Select>
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
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("name")}
                >
                  <div className="flex items-center space-x-2">
                    <span>User</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("type")}
                >
                  <div className="flex items-center space-x-2">
                    <span>Type</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center space-x-2">
                    <span>Status</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Verification</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("joinDate")}
                >
                  <div className="flex items-center space-x-2">
                    <span>Joined</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Activity</TableHead>
                <TableHead 
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleSort("riskScore")}
                >
                  <div className="flex items-center space-x-2">
                    <span>Risk</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </TableHead>
                <TableHead>Metrics</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow 
                  key={user.id} 
                  className={`${viewDensity === "compact" ? "h-12" : viewDensity === "spacious" ? "h-20" : "h-16"} ${
                    selectedUsers.includes(user.id) ? "bg-blue-50" : ""
                  }`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleSelectUser(user.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className={viewDensity === "compact" ? "h-6 w-6" : "h-8 w-8"}>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="text-xs">
                          {user.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        {viewDensity !== "compact" && (
                          <div className="text-sm text-gray-500">{user.email}</div>
                        )}
                        {user.tags.length > 0 && viewDensity === "spacious" && (
                          <div className="flex space-x-1 mt-1">
                            {user.tags.slice(0, 2).map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {user.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getUserTypeColor(user.type)}>
                      {user.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getUserStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {user.emailVerified ? (
                        <Mail className="h-3 w-3 text-green-600" />
                      ) : (
                        <Mail className="h-3 w-3 text-gray-400" />
                      )}
                      {user.phoneVerified ? (
                        <Phone className="h-3 w-3 text-green-600" />
                      ) : (
                        <Phone className="h-3 w-3 text-gray-400" />
                      )}
                      {user.idVerified ? (
                        <Shield className="h-3 w-3 text-blue-600" />
                      ) : (
                        <Shield className="h-3 w-3 text-gray-400" />
                      )}
                      {user.twoFactorEnabled && (
                        <Lock className="h-3 w-3 text-blue-600" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(user.joinDate).toLocaleDateString()}</div>
                      {viewDensity !== "compact" && (
                        <div className="text-gray-500">
                          {new Date(user.lastActive).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        new Date(user.lastActive) > new Date(Date.now() - 24 * 60 * 60 * 1000)
                          ? "bg-green-500"
                          : new Date(user.lastActive) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                          ? "bg-yellow-500"
                          : "bg-gray-400"
                      }`} />
                      <span className={`text-sm ${getEngagementColor(user.engagementLevel)}`}>
                        {user.engagementLevel}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className={getRiskScoreColor(user.riskScore)}>
                        {user.riskScore}
                      </span>
                      {user.violations > 0 && (
                        <div className="text-red-600 text-xs">
                          {user.violations} violations
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.type === "customer" ? (
                      <div className="text-sm">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3" />
                          <span>${user.totalSpent || 0}</span>
                        </div>
                        {viewDensity !== "compact" && (
                          <div className="text-gray-500 text-xs">
                            {user.totalOrders || 0} orders
                          </div>
                        )}
                      </div>
                    ) : user.type === "creator" ? (
                      <div className="text-sm">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-3 w-3" />
                          <span>${user.totalEarned || 0}</span>
                        </div>
                        {viewDensity !== "compact" && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Video className="h-3 w-3" />
                            <span>{user.totalVideos || 0}</span>
                            {user.rating && (
                              <>
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{user.rating}</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-sm text-gray-500">
                        Staff member
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user)
                          setIsUserDetailOpen(true)
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <History className="mr-2 h-4 w-4" />
                            View History
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend User
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedUsers.length)} of {sortedUsers.length} users
          </span>
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(parseInt(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Bulk Action Dialog */}
      <Dialog open={isBulkActionOpen} onOpenChange={setIsBulkActionOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedBulkAction?.label}
            </DialogTitle>
            <DialogDescription>
              This action will affect {selectedUsers.length} selected users.
              {selectedBulkAction?.requiresConfirmation && " Please confirm to proceed."}
            </DialogDescription>
          </DialogHeader>
          {selectedBulkAction?.requiresReason && (
            <div className="space-y-2">
              <Label>
                {selectedBulkAction.id === "send_message" ? "Message" : "Reason"}
              </Label>
              <Textarea
                value={bulkActionReason}
                onChange={(e) => setBulkActionReason(e.target.value)}
                placeholder={`Enter ${selectedBulkAction.id === "send_message" ? "message" : "reason"}...`}
                required
              />
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBulkActionOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={executeBulkAction}
              disabled={selectedBulkAction?.requiresReason && !bulkActionReason.trim()}
            >
              {selectedBulkAction?.requiresConfirmation ? "Confirm" : "Execute"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* User Detail Dialog will be implemented in the next component */}
    </div>
  )
}