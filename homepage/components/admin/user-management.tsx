"use client"

import { useState, useCallback, useMemo } from "react"
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
import { Separator } from "@/components/ui/separator"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { DateRange } from "react-day-picker"
// import { format } from "date-fns" // Commented out for now - will use toLocaleDateString instead
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
  User,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar as CalendarIcon,
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
  ChevronDown,
  SortAsc,
  SortDesc,
  RotateCcw,
  FileText,
  Send,
  History,
  AlertTriangle,
  Settings,
  Trash2,
  Copy,
  ExternalLink,
  Filter as FilterIcon
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  type: "customer" | "creator" | "admin"
  status: "active" | "inactive" | "suspended" | "pending" | "banned"
  joinDate: string
  lastActive: string
  location?: string
  language: string
  emailVerified: boolean
  phoneVerified: boolean
  twoFactorEnabled: boolean
  totalSpent?: number
  totalEarned?: number
  totalOrders?: number
  totalVideos?: number
  rating?: number
  reviews?: number
  violations: number
  notes?: string
  activityLevel: "high" | "medium" | "low"
  accountAge: number // days since registration
  lastPayment?: string
  supportTickets?: number
  riskScore?: number
  tags?: string[]
}

interface SearchFilters {
  search: string
  type: string
  status: string
  verification: string
  activityLevel: string
  location: string
  dateRange: DateRange | undefined
  customQuery: string
}

interface SortConfig {
  key: keyof User | null
  direction: 'asc' | 'desc'
}

interface BulkAction {
  id: string
  label: string
  icon: React.ElementType
  action: (userIds: string[]) => void
  requiresConfirmation: boolean
  destructive?: boolean
}

const mockUsers: User[] = [
  {
    id: "USR001",
    name: "Marie Laurent",
    email: "marie.laurent@email.com",
    phone: "+1 (555) 123-4567",
    type: "customer",
    status: "active",
    joinDate: "2023-06-15",
    lastActive: "2024-01-15T14:30:00",
    location: "New York, NY",
    language: "English",
    emailVerified: true,
    phoneVerified: true,
    twoFactorEnabled: false,
    totalSpent: 850,
    totalOrders: 12,
    violations: 0,
    activityLevel: "high",
    accountAge: 214,
    lastPayment: "2024-01-10",
    supportTickets: 1,
    riskScore: 12,
    tags: ["VIP", "Frequent Buyer"]
  },
  {
    id: "CRT001",
    name: "Ti Jo Zenny",
    email: "tijo@annpale.com",
    phone: "+1 (555) 987-6543",
    avatar: "/images/ti-jo-zenny.jpg",
    type: "creator",
    status: "active",
    joinDate: "2023-08-20",
    lastActive: "2024-01-15T10:15:00",
    location: "Miami, FL",
    language: "Kreyòl",
    emailVerified: true,
    phoneVerified: true,
    twoFactorEnabled: true,
    totalEarned: 12500,
    totalVideos: 145,
    rating: 4.8,
    reviews: 234,
    violations: 0,
    activityLevel: "high",
    accountAge: 148,
    supportTickets: 0,
    riskScore: 5,
    tags: ["Verified Creator", "Top Rated"]
  },
  {
    id: "USR002",
    name: "Jean Pierre",
    email: "jpierre@email.com",
    type: "customer",
    status: "suspended",
    joinDate: "2023-09-10",
    lastActive: "2024-01-10T08:00:00",
    location: "Montreal, QC",
    language: "Français",
    emailVerified: true,
    phoneVerified: false,
    twoFactorEnabled: false,
    totalSpent: 250,
    totalOrders: 3,
    violations: 2,
    notes: "Suspended for repeated payment disputes",
    activityLevel: "low",
    accountAge: 127,
    lastPayment: "2023-12-15",
    supportTickets: 8,
    riskScore: 85,
    tags: ["High Risk", "Payment Issues"]
  },
  {
    id: "CRT002",
    name: "Sarah Williams",
    email: "sarah.w@email.com",
    type: "creator",
    status: "pending",
    joinDate: "2024-01-14",
    lastActive: "2024-01-14T16:45:00",
    location: "Los Angeles, CA",
    language: "English",
    emailVerified: true,
    phoneVerified: false,
    twoFactorEnabled: false,
    totalEarned: 0,
    totalVideos: 0,
    violations: 0,
    activityLevel: "medium",
    accountAge: 2,
    supportTickets: 1,
    riskScore: 25,
    tags: ["New Creator", "Pending Verification"]
  },
  {
    id: "ADM001",
    name: "Elena Rodriguez",
    email: "elena@annpale.com",
    phone: "+1 (555) 555-5555",
    type: "admin",
    status: "active",
    joinDate: "2023-01-01",
    lastActive: "2024-01-15T16:00:00",
    location: "Boston, MA",
    language: "English",
    emailVerified: true,
    phoneVerified: true,
    twoFactorEnabled: true,
    violations: 0,
    activityLevel: "high",
    accountAge: 379,
    supportTickets: 0,
    riskScore: 0,
    tags: ["Super Admin", "System Manager"]
  },
  {
    id: "USR003",
    name: "Claude Michel",
    email: "cmichel@email.com",
    phone: "+1 (555) 777-8888",
    type: "customer",
    status: "banned",
    joinDate: "2023-11-22",
    lastActive: "2024-01-05T12:00:00",
    location: "Port-au-Prince, Haiti",
    language: "Kreyòl",
    emailVerified: false,
    phoneVerified: false,
    twoFactorEnabled: false,
    totalSpent: 0,
    totalOrders: 0,
    violations: 5,
    notes: "Banned for spam and inappropriate content",
    activityLevel: "low",
    accountAge: 54,
    supportTickets: 12,
    riskScore: 95,
    tags: ["Banned User", "Spam", "Inappropriate Content"]
  }
]

export function UserManagement() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [showBulkActions, setShowBulkActions] = useState(false)
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [viewDensity, setViewDensity] = useState<'comfortable' | 'compact' | 'spacious'>('comfortable')
  const [adminNote, setAdminNote] = useState("")
  const [isAdvancedFiltersOpen, setIsAdvancedFiltersOpen] = useState(false)
  
  const [filters, setFilters] = useState<SearchFilters>({
    search: "",
    type: "all",
    status: "all",
    verification: "all",
    activityLevel: "all",
    location: "",
    dateRange: undefined,
    customQuery: ""
  })

  const handleSuspendUser = (userId: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, status: "suspended" as const } : user
      )
    )
  }

  const handleActivateUser = (userId: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, status: "active" as const } : user
      )
    )
  }

  const handleApproveCreator = (userId: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId && user.type === "creator" 
          ? { ...user, status: "active" as const } 
          : user
      )
    )
  }

  const handleBanUser = (userId: string) => {
    setUsers(prev => 
      prev.map(user => 
        user.id === userId ? { ...user, status: "banned" as const } : user
      )
    )
  }

  const handleBulkAction = useCallback((action: string, userIds: string[]) => {
    switch (action) {
      case 'activate':
        setUsers(prev => 
          prev.map(user => 
            userIds.includes(user.id) ? { ...user, status: "active" as const } : user
          )
        )
        break
      case 'suspend':
        setUsers(prev => 
          prev.map(user => 
            userIds.includes(user.id) ? { ...user, status: "suspended" as const } : user
          )
        )
        break
      case 'ban':
        setUsers(prev => 
          prev.map(user => 
            userIds.includes(user.id) ? { ...user, status: "banned" as const } : user
          )
        )
        break
      case 'verify-email':
        setUsers(prev => 
          prev.map(user => 
            userIds.includes(user.id) ? { ...user, emailVerified: true } : user
          )
        )
        break
      case 'delete':
        setUsers(prev => prev.filter(user => !userIds.includes(user.id)))
        break
    }
    setSelectedUsers([])
    setShowBulkActions(false)
  }, [])

  const bulkActions: BulkAction[] = [
    {
      id: 'activate',
      label: 'Activate Users',
      icon: UserCheck,
      action: (userIds) => handleBulkAction('activate', userIds),
      requiresConfirmation: true
    },
    {
      id: 'suspend',
      label: 'Suspend Users',
      icon: Ban,
      action: (userIds) => handleBulkAction('suspend', userIds),
      requiresConfirmation: true,
      destructive: true
    },
    {
      id: 'ban',
      label: 'Ban Users',
      icon: XCircle,
      action: (userIds) => handleBulkAction('ban', userIds),
      requiresConfirmation: true,
      destructive: true
    },
    {
      id: 'verify-email',
      label: 'Verify Emails',
      icon: Mail,
      action: (userIds) => handleBulkAction('verify-email', userIds),
      requiresConfirmation: false
    },
    {
      id: 'export',
      label: 'Export Selected',
      icon: Download,
      action: (userIds) => {
        const selectedData = users.filter(user => userIds.includes(user.id))
        console.log('Exporting users:', selectedData)
        // Export logic would go here
      },
      requiresConfirmation: false
    },
    {
      id: 'delete',
      label: 'Delete Users',
      icon: Trash2,
      action: (userIds) => handleBulkAction('delete', userIds),
      requiresConfirmation: true,
      destructive: true
    }
  ]

  const handleSort = useCallback((key: keyof User) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }))
  }, [])

  const handleSelectUser = useCallback((userId: string, checked: boolean) => {
    if (checked) {
      setSelectedUsers(prev => [...prev, userId])
    } else {
      setSelectedUsers(prev => prev.filter(id => id !== userId))
    }
  }, [])

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(user => user.id))
    } else {
      setSelectedUsers([])
    }
  }, [])

  const updateFilter = useCallback((key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1) // Reset to first page when filtering
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      type: "all",
      status: "all",
      verification: "all",
      activityLevel: "all",
      location: "",
      dateRange: undefined,
      customQuery: ""
    })
    setCurrentPage(1)
  }, [])

  const getStatusColor = (status: User["status"]) => {
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
        return "bg-black text-white"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: User["type"]) => {
    switch (type) {
      case "customer":
        return "bg-blue-100 text-blue-800"
      case "creator":
        return "bg-purple-100 text-purple-800"
      case "admin":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      // Search filter
      const searchMatch = !filters.search || 
        user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        (user.phone && user.phone.includes(filters.search)) ||
        (user.location && user.location.toLowerCase().includes(filters.search.toLowerCase()))
      
      // Type filter
      const typeMatch = filters.type === "all" || user.type === filters.type
      
      // Status filter
      const statusMatch = filters.status === "all" || user.status === filters.status
      
      // Verification filter
      const verificationMatch = filters.verification === "all" || 
        (filters.verification === "verified" && user.emailVerified && user.phoneVerified) ||
        (filters.verification === "email-only" && user.emailVerified && !user.phoneVerified) ||
        (filters.verification === "phone-only" && !user.emailVerified && user.phoneVerified) ||
        (filters.verification === "unverified" && !user.emailVerified && !user.phoneVerified) ||
        (filters.verification === "2fa" && user.twoFactorEnabled)
      
      // Activity level filter
      const activityMatch = filters.activityLevel === "all" || user.activityLevel === filters.activityLevel
      
      // Location filter
      const locationMatch = !filters.location || 
        (user.location && user.location.toLowerCase().includes(filters.location.toLowerCase()))
      
      // Date range filter
      const dateMatch = !filters.dateRange ||
        (!filters.dateRange.from && !filters.dateRange.to) ||
        (filters.dateRange.from && new Date(user.joinDate) >= filters.dateRange.from) &&
        (filters.dateRange.to && new Date(user.joinDate) <= filters.dateRange.to)
      
      // Custom query filter (basic implementation)
      const customMatch = !filters.customQuery ||
        JSON.stringify(user).toLowerCase().includes(filters.customQuery.toLowerCase())
      
      return searchMatch && typeMatch && statusMatch && verificationMatch && 
             activityMatch && locationMatch && dateMatch && customMatch
    })
  }, [users, filters])

  const sortedUsers = useMemo(() => {
    if (!sortConfig.key) return filteredUsers
    
    return [...filteredUsers].sort((a, b) => {
      const aValue = a[sortConfig.key!]
      const bValue = b[sortConfig.key!]
      
      if (aValue === null || aValue === undefined) return 1
      if (bValue === null || bValue === undefined) return -1
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue)
        return sortConfig.direction === 'asc' ? comparison : -comparison
      }
      
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue
        return sortConfig.direction === 'asc' ? comparison : -comparison
      }
      
      return 0
    })
  }, [filteredUsers, sortConfig])

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return sortedUsers.slice(startIndex, startIndex + itemsPerPage)
  }, [sortedUsers, currentPage, itemsPerPage])

  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage)

  const stats = useMemo(() => ({
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === "active").length,
    creators: users.filter(u => u.type === "creator").length,
    pendingApprovals: users.filter(u => u.status === "pending").length,
    suspendedUsers: users.filter(u => u.status === "suspended").length,
    bannedUsers: users.filter(u => u.status === "banned").length,
    verifiedUsers: users.filter(u => u.emailVerified && u.phoneVerified).length,
    highRiskUsers: users.filter(u => u.riskScore && u.riskScore > 70).length,
    filteredCount: filteredUsers.length,
    selectedCount: selectedUsers.length
  }), [users, filteredUsers, selectedUsers])

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
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
                <p className="text-2xl font-bold">{stats.activeUsers}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Creators</p>
                <p className="text-2xl font-bold">{stats.creators}</p>
              </div>
              <Video className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pendingApprovals}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Suspended</p>
                <p className="text-2xl font-bold">{stats.suspendedUsers}</p>
              </div>
              <Ban className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Banned</p>
                <p className="text-2xl font-bold">{stats.bannedUsers}</p>
              </div>
              <XCircle className="h-8 w-8 text-black" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Verified</p>
                <p className="text-2xl font-bold">{stats.verifiedUsers}</p>
              </div>
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Risk</p>
                <p className="text-2xl font-bold">{stats.highRiskUsers}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Summary */}
      {(stats.filteredCount !== stats.totalUsers || selectedUsers.length > 0) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {stats.filteredCount !== stats.totalUsers && (
                  <div className="text-sm">
                    <span className="font-medium text-blue-900">
                      Showing {stats.filteredCount} of {stats.totalUsers} users
                    </span>
                  </div>
                )}
                {selectedUsers.length > 0 && (
                  <div className="text-sm">
                    <span className="font-medium text-blue-900">
                      {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {selectedUsers.length > 0 && (
                  <Button
                    size="sm"
                    onClick={() => setShowBulkActions(!showBulkActions)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Bulk Actions
                  </Button>
                )}
                {stats.filteredCount !== stats.totalUsers && (
                  <Button size="sm" variant="outline" onClick={resetFilters}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* User Management Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Manage all platform users and their accounts</CardDescription>
            </div>
            <Button>
              <Download className="h-4 w-4 mr-2" />
              Export Users
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Enhanced Search & Filters */}
          <div className="space-y-4 mb-6">
            {/* Primary Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <div className="relative md:col-span-2">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search users, emails, IDs..."
                  value={filters.search}
                  onChange={(e) => updateFilter('search', e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filters.type} onValueChange={(value) => updateFilter('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="customer">Customers</SelectItem>
                  <SelectItem value="creator">Creators</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
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

              <Select value={filters.verification} onValueChange={(value) => updateFilter('verification', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Verification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Verification</SelectItem>
                  <SelectItem value="verified">Fully Verified</SelectItem>
                  <SelectItem value="email-only">Email Only</SelectItem>
                  <SelectItem value="phone-only">Phone Only</SelectItem>
                  <SelectItem value="unverified">Unverified</SelectItem>
                  <SelectItem value="2fa">2FA Enabled</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => setIsAdvancedFiltersOpen(!isAdvancedFiltersOpen)}
                className="flex items-center"
              >
                <FilterIcon className="h-4 w-4 mr-2" />
                Advanced
                <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isAdvancedFiltersOpen ? 'rotate-180' : ''}`} />
              </Button>
            </div>

            {/* Advanced Filters Panel */}
            {isAdvancedFiltersOpen && (
              <Card className="border border-gray-200">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="activity-level">Activity Level</Label>
                      <Select value={filters.activityLevel} onValueChange={(value) => updateFilter('activityLevel', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Activity" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Activity</SelectItem>
                          <SelectItem value="high">High Activity</SelectItem>
                          <SelectItem value="medium">Medium Activity</SelectItem>
                          <SelectItem value="low">Low Activity</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        placeholder="City, State, Country"
                        value={filters.location}
                        onChange={(e) => updateFilter('location', e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Registration Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {filters.dateRange?.from ? (
                              filters.dateRange.to ? (
                                <>
                                  {filters.dateRange.from.toLocaleDateString()} -{" "}
                                  {filters.dateRange.to.toLocaleDateString()}
                                </>
                              ) : (
                                filters.dateRange.from.toLocaleDateString()
                              )
                            ) : (
                              <span>Pick a date range</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={filters.dateRange?.from}
                            selected={filters.dateRange}
                            onSelect={(range) => updateFilter('dateRange', range)}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="custom-query">Custom Query</Label>
                      <Input
                        id="custom-query"
                        placeholder="Advanced search..."
                        value={filters.customQuery}
                        onChange={(e) => updateFilter('customQuery', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between mt-4">
                    <Button variant="outline" onClick={resetFilters}>
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset All Filters
                    </Button>
                    <div className="flex space-x-2">
                      <Button variant="outline">
                        <FileText className="h-4 w-4 mr-2" />
                        Save Filter
                      </Button>
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Filtered
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Bulk Actions Panel */}
          {showBulkActions && selectedUsers.length > 0 && (
            <Card className="border border-orange-200 bg-orange-50 mb-4">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-orange-900">
                    Bulk Actions ({selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected)
                  </h4>
                  <Button variant="ghost" size="sm" onClick={() => setShowBulkActions(false)}>
                    ×
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {bulkActions.map((action) => {
                    const ActionIcon = action.icon
                    return (
                      <Button
                        key={action.id}
                        size="sm"
                        variant={action.destructive ? "destructive" : "outline"}
                        onClick={() => action.action(selectedUsers)}
                        className="flex items-center justify-start"
                      >
                        <ActionIcon className="h-3 w-3 mr-2" />
                        {action.label}
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* View Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Show:</span>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
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
                <span className="text-sm text-gray-600">Density:</span>
                <Select value={viewDensity} onValueChange={(value: any) => setViewDensity(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
              <Button variant="outline" size="sm">
                <RotateCcw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Enhanced Users Table */}
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center">
                      User
                      {sortConfig.key === 'name' && (
                        sortConfig.direction === 'asc' ? 
                        <SortAsc className="ml-1 h-3 w-3" /> : 
                        <SortDesc className="ml-1 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('type')}
                  >
                    <div className="flex items-center">
                      Type
                      {sortConfig.key === 'type' && (
                        sortConfig.direction === 'asc' ? 
                        <SortAsc className="ml-1 h-3 w-3" /> : 
                        <SortDesc className="ml-1 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('status')}
                  >
                    <div className="flex items-center">
                      Status
                      {sortConfig.key === 'status' && (
                        sortConfig.direction === 'asc' ? 
                        <SortAsc className="ml-1 h-3 w-3" /> : 
                        <SortDesc className="ml-1 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Verification</TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleSort('joinDate')}
                  >
                    <div className="flex items-center">
                      Activity
                      {sortConfig.key === 'joinDate' && (
                        sortConfig.direction === 'asc' ? 
                        <SortAsc className="ml-1 h-3 w-3" /> : 
                        <SortDesc className="ml-1 h-3 w-3" />
                      )}
                    </div>
                  </TableHead>
                  <TableHead>Metrics</TableHead>
                  <TableHead>Risk</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.map((user) => (
                  <TableRow 
                    key={user.id} 
                    className={`${
                      viewDensity === 'compact' ? 'h-12' : 
                      viewDensity === 'spacious' ? 'h-20' : 'h-16'
                    } ${selectedUsers.includes(user.id) ? 'bg-blue-50' : ''}`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={(checked) => handleSelectUser(user.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(user.type)}>
                        {user.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {user.emailVerified ? (
                          <Mail className="h-4 w-4 text-green-600" />
                        ) : (
                          <Mail className="h-4 w-4 text-gray-400" />
                        )}
                        {user.phoneVerified ? (
                          <Phone className="h-4 w-4 text-green-600" />
                        ) : (
                          <Phone className="h-4 w-4 text-gray-400" />
                        )}
                        {user.twoFactorEnabled ? (
                          <Shield className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Shield className="h-4 w-4 text-gray-400" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>Joined: {user.joinDate}</p>
                        <p className="text-muted-foreground">
                          Last: {new Date(user.lastActive).toLocaleDateString()}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {user.type === "customer" ? (
                        <div className="text-sm">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3" />
                            <span>${user.totalSpent || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <CalendarIcon className="h-3 w-3" />
                            <span>{user.totalOrders || 0} orders</span>
                          </div>
                        </div>
                      ) : user.type === "creator" ? (
                        <div className="text-sm">
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-3 w-3" />
                            <span>${user.totalEarned || 0}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-muted-foreground">
                            <Video className="h-3 w-3" />
                            <span>{user.totalVideos || 0} videos</span>
                          </div>
                          {user.rating && (
                            <div className="flex items-center space-x-1 text-muted-foreground">
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                              <span>{user.rating} ({user.reviews})</span>
                            </div>
                          )}
                        </div>
                      ) : user.type === "admin" ? (
                        <div className="text-sm">
                          <div className="flex items-center space-x-1 text-purple-600">
                            <Shield className="h-3 w-3" />
                            <span>Administrator</span>
                          </div>
                        </div>
                      ) : null}
                      {user.violations > 0 && (
                        <Badge variant="destructive" className="text-xs mt-1">
                          {user.violations} violations
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center space-x-1">
                          <div className={`w-2 h-2 rounded-full ${
                            user.riskScore && user.riskScore > 70 ? 'bg-red-500' :
                            user.riskScore && user.riskScore > 40 ? 'bg-yellow-500' : 'bg-green-500'
                          }`} />
                          <span className="font-medium">{user.riskScore || 0}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {user.activityLevel} activity
                        </div>
                        {user.tags && user.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {user.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                                {tag}
                              </Badge>
                            ))}
                            {user.tags.length > 2 && (
                              <Badge variant="outline" className="text-xs px-1 py-0">
                                +{user.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedUser(user)
                            setIsUserDialogOpen(true)
                            setIsEditMode(false)
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedUser(user)
                            setIsUserDialogOpen(true)
                            setIsEditMode(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {user.status === "pending" && user.type === "creator" && (
                          <Button
                            size="sm"
                            variant="default"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproveCreator(user.id)}
                          >
                            <UserCheck className="h-4 w-4" />
                          </Button>
                        )}
                        {user.status === "active" ? (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleSuspendUser(user.id)}
                            >
                              <Ban className="h-4 w-4 text-red-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleBanUser(user.id)}
                            >
                              <XCircle className="h-4 w-4 text-black" />
                            </Button>
                          </>
                        ) : user.status === "suspended" ? (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleActivateUser(user.id)}
                            >
                              <Unlock className="h-4 w-4 text-green-600" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleBanUser(user.id)}
                            >
                              <XCircle className="h-4 w-4 text-black" />
                            </Button>
                          </>
                        ) : user.status === "banned" ? (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleActivateUser(user.id)}
                          >
                            <Unlock className="h-4 w-4 text-green-600" />
                          </Button>
                        ) : null}
                        <Button
                          size="sm"
                          variant="ghost"
                        >
                          <Send className="h-4 w-4 text-blue-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-600">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedUsers.length)} of {sortedUsers.length} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = currentPage <= 3 ? i + 1 : currentPage - 2 + i
                  if (page <= totalPages) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  }
                  return null
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit User" : "User Details"}</DialogTitle>
            <DialogDescription>
              {isEditMode ? "Modify user information and settings" : "View detailed user information"}
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={selectedUser.avatar} />
                    <AvatarFallback>{selectedUser.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                    <p className="text-muted-foreground">{selectedUser.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className={getTypeColor(selectedUser.type)}>
                        {selectedUser.type}
                      </Badge>
                      <Badge className={getStatusColor(selectedUser.status)}>
                        {selectedUser.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>User ID</Label>
                    <Input value={selectedUser.id} disabled />
                  </div>
                  <div>
                    <Label>Join Date</Label>
                    <Input value={selectedUser.joinDate} disabled />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={selectedUser.email} disabled={!isEditMode} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input value={selectedUser.phone || ""} disabled={!isEditMode} />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input value={selectedUser.location || ""} disabled={!isEditMode} />
                  </div>
                  <div>
                    <Label>Language</Label>
                    <Select value={selectedUser.language} disabled={!isEditMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Français">Français</SelectItem>
                        <SelectItem value="Kreyòl">Kreyòl</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Last Active</p>
                          <p className="font-medium">
                            {new Date(selectedUser.lastActive).toLocaleString()}
                          </p>
                        </div>
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>

                  {selectedUser.type === "customer" && (
                    <>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Total Spent</p>
                              <p className="text-xl font-bold">${selectedUser.totalSpent || 0}</p>
                            </div>
                            <DollarSign className="h-5 w-5 text-green-600" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Total Orders</p>
                              <p className="text-xl font-bold">{selectedUser.totalOrders || 0}</p>
                            </div>
                            <Calendar className="h-5 w-5 text-blue-600" />
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  {selectedUser.type === "creator" && (
                    <>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Total Earned</p>
                              <p className="text-xl font-bold">${selectedUser.totalEarned || 0}</p>
                            </div>
                            <DollarSign className="h-5 w-5 text-green-600" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Videos Created</p>
                              <p className="text-xl font-bold">{selectedUser.totalVideos || 0}</p>
                            </div>
                            <Video className="h-5 w-5 text-purple-600" />
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-muted-foreground">Average Rating</p>
                              <div className="flex items-center space-x-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-xl font-bold">{selectedUser.rating || 0}</span>
                              </div>
                            </div>
                            <MessageSquare className="h-5 w-5 text-blue-600" />
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}

                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">Violations</p>
                          <p className="text-xl font-bold">{selectedUser.violations}</p>
                        </div>
                        <AlertCircle className="h-5 w-5 text-red-600" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Mail className={`h-5 w-5 ${selectedUser.emailVerified ? "text-green-600" : "text-gray-400"}`} />
                      <div>
                        <p className="font-medium">Email Verification</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedUser.emailVerified ? "Verified" : "Not verified"}
                        </p>
                      </div>
                    </div>
                    {!selectedUser.emailVerified && (
                      <Button size="sm">Send Verification</Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Phone className={`h-5 w-5 ${selectedUser.phoneVerified ? "text-green-600" : "text-gray-400"}`} />
                      <div>
                        <p className="font-medium">Phone Verification</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedUser.phoneVerified ? "Verified" : "Not verified"}
                        </p>
                      </div>
                    </div>
                    {!selectedUser.phoneVerified && (
                      <Button size="sm">Send Verification</Button>
                    )}
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className={`h-5 w-5 ${selectedUser.twoFactorEnabled ? "text-blue-600" : "text-gray-400"}`} />
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedUser.twoFactorEnabled ? "Enabled" : "Disabled"}
                        </p>
                      </div>
                    </div>
                    <Button size="sm" variant="outline">
                      {selectedUser.twoFactorEnabled ? "Disable" : "Enable"}
                    </Button>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Account Actions</h4>
                    <div className="space-y-2">
                      <Button variant="outline" className="w-full justify-start">
                        <Lock className="h-4 w-4 mr-2" />
                        Reset Password
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Mail className="h-4 w-4 mr-2" />
                        Send Account Recovery Email
                      </Button>
                      {selectedUser.status === "active" ? (
                        <Button 
                          variant="destructive" 
                          className="w-full justify-start"
                          onClick={() => {
                            handleSuspendUser(selectedUser.id)
                            setIsUserDialogOpen(false)
                          }}
                        >
                          <Ban className="h-4 w-4 mr-2" />
                          Suspend Account
                        </Button>
                      ) : (
                        <Button 
                          variant="default" 
                          className="w-full justify-start bg-green-600 hover:bg-green-700"
                          onClick={() => {
                            handleActivateUser(selectedUser.id)
                            setIsUserDialogOpen(false)
                          }}
                        >
                          <Unlock className="h-4 w-4 mr-2" />
                          Activate Account
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="notes" className="space-y-4">
                <div>
                  <Label htmlFor="admin-notes">Admin Notes</Label>
                  <Textarea
                    id="admin-notes"
                    placeholder="Add internal notes about this user..."
                    value={selectedUser.notes || adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    className="mt-2"
                    rows={6}
                    disabled={!isEditMode}
                  />
                </div>
                {selectedUser.violations > 0 && (
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <h4 className="font-medium text-red-900 mb-2">Violation History</h4>
                    <p className="text-sm text-red-700">
                      This user has {selectedUser.violations} violation(s) on record.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter>
            {isEditMode ? (
              <>
                <Button variant="outline" onClick={() => setIsEditMode(false)}>Cancel</Button>
                <Button onClick={() => {
                  // Save changes logic here
                  setIsEditMode(false)
                }}>
                  Save Changes
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsUserDialogOpen(false)}>Close</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}