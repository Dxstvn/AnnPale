"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Users,
  User,
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
  MessageSquare,
  DollarSign,
  Video,
  Star,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  History,
  Settings,
  Globe,
  Smartphone,
  Monitor,
  Link,
  Copy,
  ExternalLink,
  Send,
  Unlock,
  Lock,
  UserCheck,
  UserX,
  TrendingUp,
  TrendingDown,
  Building,
  Briefcase,
  Flag,
  Zap
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
  type: "login" | "purchase" | "upload" | "message" | "violation" | "support" | "verification" | "payment"
  description: string
  timestamp: string
  metadata?: Record<string, any>
  severity: "low" | "medium" | "high"
  ipAddress?: string
  device?: string
}

interface FinancialTransaction {
  id: string
  type: "payment" | "payout" | "refund" | "fee" | "adjustment"
  amount: number
  currency: string
  status: "completed" | "pending" | "failed"
  timestamp: string
  description: string
  orderId?: string
  method?: string
}

interface SupportTicket {
  id: string
  subject: string
  status: "open" | "pending" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  createdAt: string
  resolvedAt?: string
  category: string
  assignee?: string
}

interface UserAction {
  id: string
  label: string
  icon: React.ElementType
  variant: "default" | "destructive" | "outline" | "secondary"
  requiresConfirmation: boolean
  requiresReason: boolean
  requiredPermission: string
  action: (user: EnhancedUser, reason?: string) => void
}

const mockActivities: UserActivity[] = [
  {
    id: "1",
    type: "login",
    description: "Logged in from New York, NY",
    timestamp: "2024-01-15T14:30:00Z",
    severity: "low",
    ipAddress: "192.168.1.100",
    device: "iPhone 15 Pro"
  },
  {
    id: "2",
    type: "purchase",
    description: "Purchased video message from Ti Jo Zenny",
    timestamp: "2024-01-15T10:15:00Z",
    severity: "low",
    metadata: { amount: 85, orderId: "ORD-001" }
  },
  {
    id: "3",
    type: "violation",
    description: "Content flagged for inappropriate language",
    timestamp: "2024-01-10T16:20:00Z",
    severity: "high",
    metadata: { contentId: "VID-123", action: "warning_issued" }
  },
  {
    id: "4",
    type: "verification",
    description: "Email address verified",
    timestamp: "2024-01-05T09:00:00Z",
    severity: "low"
  },
  {
    id: "5",
    type: "support",
    description: "Created support ticket about payment issue",
    timestamp: "2024-01-03T14:45:00Z",
    severity: "medium",
    metadata: { ticketId: "TKT-456" }
  }
]

const mockTransactions: FinancialTransaction[] = [
  {
    id: "TXN-001",
    type: "payment",
    amount: 85,
    currency: "USD",
    status: "completed",
    timestamp: "2024-01-15T10:15:00Z",
    description: "Video message purchase",
    orderId: "ORD-001",
    method: "Credit Card"
  },
  {
    id: "TXN-002",
    type: "payment",
    amount: 65,
    currency: "USD",
    status: "completed",
    timestamp: "2024-01-10T16:30:00Z",
    description: "Birthday message",
    orderId: "ORD-002",
    method: "PayPal"
  },
  {
    id: "TXN-003",
    type: "refund",
    amount: -45,
    currency: "USD",
    status: "completed",
    timestamp: "2024-01-08T11:20:00Z",
    description: "Order cancellation refund",
    orderId: "ORD-003",
    method: "Credit Card"
  }
]

const mockSupportTickets: SupportTicket[] = [
  {
    id: "TKT-456",
    subject: "Payment not processing",
    status: "resolved",
    priority: "medium",
    createdAt: "2024-01-03T14:45:00Z",
    resolvedAt: "2024-01-04T10:30:00Z",
    category: "Payment",
    assignee: "Support Team"
  },
  {
    id: "TKT-789",
    subject: "Cannot upload profile picture",
    status: "closed",
    priority: "low",
    createdAt: "2023-12-20T09:15:00Z",
    resolvedAt: "2023-12-20T16:45:00Z",
    category: "Technical",
    assignee: "Tech Support"
  }
]

const userActions: UserAction[] = [
  {
    id: "verify_email",
    label: "Verify Email",
    icon: Mail,
    variant: "outline",
    requiresConfirmation: false,
    requiresReason: false,
    requiredPermission: "user_edit",
    action: (user) => console.log("Verifying email for", user.email)
  },
  {
    id: "verify_phone",
    label: "Verify Phone",
    icon: Phone,
    variant: "outline",
    requiresConfirmation: false,
    requiresReason: false,
    requiredPermission: "user_edit",
    action: (user) => console.log("Verifying phone for", user.phone)
  },
  {
    id: "enable_2fa",
    label: "Enable 2FA",
    icon: Shield,
    variant: "outline",
    requiresConfirmation: false,
    requiresReason: false,
    requiredPermission: "user_edit",
    action: (user) => console.log("Enabling 2FA for", user.id)
  },
  {
    id: "send_message",
    label: "Send Message",
    icon: MessageSquare,
    variant: "default",
    requiresConfirmation: false,
    requiresReason: true,
    requiredPermission: "user_edit",
    action: (user, message) => console.log("Sending message to", user.email, ":", message)
  },
  {
    id: "reset_password",
    label: "Reset Password",
    icon: Lock,
    variant: "outline",
    requiresConfirmation: true,
    requiresReason: false,
    requiredPermission: "user_edit",
    action: (user) => console.log("Resetting password for", user.email)
  },
  {
    id: "suspend_user",
    label: "Suspend User",
    icon: Ban,
    variant: "destructive",
    requiresConfirmation: true,
    requiresReason: true,
    requiredPermission: "user_suspend",
    action: (user, reason) => console.log("Suspending user", user.id, "Reason:", reason)
  },
  {
    id: "delete_user",
    label: "Delete User",
    icon: UserX,
    variant: "destructive",
    requiresConfirmation: true,
    requiresReason: true,
    requiredPermission: "user_delete",
    action: (user, reason) => console.log("Deleting user", user.id, "Reason:", reason)
  }
]

interface UserDetailPanelProps {
  user: EnhancedUser
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDetailPanel({ user, open, onOpenChange }: UserDetailPanelProps) {
  const [activities] = useState<UserActivity[]>(mockActivities)
  const [transactions] = useState<FinancialTransaction[]>(mockTransactions)
  const [supportTickets] = useState<SupportTicket[]>(mockSupportTickets)
  const [adminNotes, setAdminNotes] = useState(user.notes || "")
  const [selectedAction, setSelectedAction] = useState<UserAction | null>(null)
  const [actionReason, setActionReason] = useState("")
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false)

  const getActivityIcon = (type: UserActivity["type"]) => {
    switch (type) {
      case "login":
        return User
      case "purchase":
        return CreditCard
      case "upload":
        return Video
      case "message":
        return MessageSquare
      case "violation":
        return AlertTriangle
      case "support":
        return FileText
      case "verification":
        return CheckCircle
      case "payment":
        return DollarSign
      default:
        return Activity
    }
  }

  const getActivityColor = (severity: UserActivity["severity"]) => {
    switch (severity) {
      case "low":
        return "text-blue-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getTransactionColor = (type: FinancialTransaction["type"]) => {
    switch (type) {
      case "payment":
        return "text-green-600"
      case "payout":
        return "text-blue-600"
      case "refund":
        return "text-red-600"
      case "fee":
        return "text-orange-600"
      case "adjustment":
        return "text-purple-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
      case "resolved":
        return "bg-green-100 text-green-800"
      case "inactive":
      case "pending":
      case "open":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
      case "failed":
      case "urgent":
        return "bg-red-100 text-red-800"
      case "banned":
        return "bg-red-100 text-red-800"
      case "closed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleAction = (action: UserAction) => {
    setSelectedAction(action)
    setActionReason("")
    if (action.requiresConfirmation || action.requiresReason) {
      setIsActionDialogOpen(true)
    } else {
      action.action(user)
    }
  }

  const executeAction = () => {
    if (selectedAction) {
      selectedAction.action(user, actionReason)
      setIsActionDialogOpen(false)
      setSelectedAction(null)
      setActionReason("")
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const totalSpent = transactions
    .filter(t => t.type === "payment" && t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0)

  const riskScoreColor = user.riskScore <= 30 ? "text-green-600" : 
                       user.riskScore <= 70 ? "text-yellow-600" : "text-red-600"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>
                {user.name.split(" ").map(n => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <span className="text-xl">{user.name}</span>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={getStatusColor(user.status)}>
                  {user.status}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {user.type}
                </Badge>
                {user.tags.slice(0, 3).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </DialogTitle>
          <DialogDescription>
            User ID: {user.id} • Joined {new Date(user.joinDate).toLocaleDateString()}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
            <TabsTrigger value="financial">Financial</TabsTrigger>
            <TabsTrigger value="support">Support</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Email</Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{user.email}</span>
                      <Button variant="ghost" size="sm" onClick={() => copyToClipboard(user.email)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                      {user.emailVerified ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                  
                  {user.phone && (
                    <div className="flex items-center justify-between">
                      <Label>Phone</Label>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">{user.phone}</span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard(user.phone)}>
                          <Copy className="h-3 w-3" />
                        </Button>
                        {user.phoneVerified ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <Label>Location</Label>
                    <span className="text-sm">{user.location || "Not specified"}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Language</Label>
                    <span className="text-sm">{user.language}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Timezone</Label>
                    <span className="text-sm">{user.timezone || "Not specified"}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Account Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Risk Score</Label>
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${riskScoreColor}`}>
                        {user.riskScore}/100
                      </span>
                      <Progress value={user.riskScore} className="w-16 h-2" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Engagement</Label>
                    <Badge variant="outline" className={
                      user.engagementLevel === "high" ? "text-green-600" :
                      user.engagementLevel === "medium" ? "text-yellow-600" : "text-red-600"
                    }>
                      {user.engagementLevel}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Lifetime Value</Label>
                    <span className="text-sm font-medium">${user.lifetimeValue.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Violations</Label>
                    <Badge variant={user.violations > 0 ? "destructive" : "outline"}>
                      {user.violations}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Support Tickets</Label>
                    <span className="text-sm">{user.supportTickets}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label>Referrals</Label>
                    <span className="text-sm">{user.referrals}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              {user.type === "customer" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Customer Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Total Spent</Label>
                      <span className="text-sm font-medium">${user.totalSpent?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Total Orders</Label>
                      <span className="text-sm">{user.totalOrders || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Average Order</Label>
                      <span className="text-sm">
                        ${((user.totalSpent || 0) / Math.max(user.totalOrders || 1, 1)).toFixed(2)}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              )}

              {user.type === "creator" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Creator Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Total Earned</Label>
                      <span className="text-sm font-medium">${user.totalEarned?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Videos Created</Label>
                      <span className="text-sm">{user.totalVideos || 0}</span>
                    </div>
                    {user.rating && (
                      <div className="flex items-center justify-between">
                        <Label>Rating</Label>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{user.rating} ({user.reviews} reviews)</span>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Device Information */}
              {user.deviceInfo && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Device Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Last Device</Label>
                      <span className="text-sm">{user.deviceInfo.lastDevice}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Browser</Label>
                      <span className="text-sm">{user.deviceInfo.browser}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Operating System</Label>
                      <span className="text-sm">{user.deviceInfo.os}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Label>Last Active</Label>
                      <span className="text-sm">{new Date(user.lastActive).toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Social Connections */}
            {user.socialConnections && Object.keys(user.socialConnections).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Social Connections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4">
                    {user.socialConnections.facebook && (
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Facebook: {user.socialConnections.facebook}</span>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    {user.socialConnections.instagram && (
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Instagram: {user.socialConnections.instagram}</span>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    {user.socialConnections.twitter && (
                      <div className="flex items-center space-x-2">
                        <Globe className="h-4 w-4 text-blue-400" />
                        <span className="text-sm">Twitter: {user.socialConnections.twitter}</span>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Activity Timeline</CardTitle>
                <CardDescription>Recent user activities and system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activities.map((activity) => {
                    const ActivityIcon = getActivityIcon(activity.type)
                    return (
                      <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                        <div className={`p-2 rounded-full bg-gray-100 ${getActivityColor(activity.severity)}`}>
                          <ActivityIcon className="h-4 w-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">{activity.description}</p>
                            <Badge variant="outline" className="text-xs capitalize">
                              {activity.type.replace("_", " ")}
                            </Badge>
                          </div>
                          <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                            <span>{new Date(activity.timestamp).toLocaleString()}</span>
                            {activity.ipAddress && <span>IP: {activity.ipAddress}</span>}
                            {activity.device && <span>Device: {activity.device}</span>}
                          </div>
                          {activity.metadata && (
                            <div className="mt-2 text-xs text-gray-600">
                              {Object.entries(activity.metadata).map(([key, value]) => (
                                <span key={key} className="mr-3">
                                  {key}: {typeof value === "object" ? JSON.stringify(value) : value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Spent</p>
                      <p className="text-xl font-bold">${totalSpent.toFixed(2)}</p>
                    </div>
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Transactions</p>
                      <p className="text-xl font-bold">{transactions.length}</p>
                    </div>
                    <CreditCard className="h-6 w-6 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Lifetime Value</p>
                      <p className="text-xl font-bold">${user.lifetimeValue.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full bg-gray-100 ${getTransactionColor(transaction.type)}`}>
                          <DollarSign className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{transaction.description}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>{transaction.id}</span>
                            <span>•</span>
                            <span>{new Date(transaction.timestamp).toLocaleDateString()}</span>
                            {transaction.method && (
                              <>
                                <span>•</span>
                                <span>{transaction.method}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${transaction.amount < 0 ? "text-red-600" : "text-green-600"}`}>
                          {transaction.amount < 0 ? "-" : "+"}${Math.abs(transaction.amount).toFixed(2)}
                        </p>
                        <Badge className={getStatusColor(transaction.status)} variant="outline">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="support" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Support Tickets</CardTitle>
                <CardDescription>Customer support interaction history</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {supportTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="text-sm font-medium">{ticket.subject}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getStatusColor(ticket.status)} variant="outline">
                            {ticket.status}
                          </Badge>
                          <Badge className={getStatusColor(ticket.priority)} variant="outline">
                            {ticket.priority}
                          </Badge>
                          <span className="text-xs text-gray-500">{ticket.category}</span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Created: {new Date(ticket.createdAt).toLocaleDateString()}
                          {ticket.resolvedAt && (
                            <span> • Resolved: {new Date(ticket.resolvedAt).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Mail className={`h-5 w-5 ${user.emailVerified ? "text-green-600" : "text-gray-400"}`} />
                    <div>
                      <p className="font-medium">Email Verification</p>
                      <p className="text-sm text-gray-500">
                        {user.emailVerified ? "Verified" : "Not verified"}
                      </p>
                    </div>
                  </div>
                  {!user.emailVerified && (
                    <Button size="sm">Send Verification</Button>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Phone className={`h-5 w-5 ${user.phoneVerified ? "text-green-600" : "text-gray-400"}`} />
                    <div>
                      <p className="font-medium">Phone Verification</p>
                      <p className="text-sm text-gray-500">
                        {user.phoneVerified ? "Verified" : "Not verified"}
                      </p>
                    </div>
                  </div>
                  {!user.phoneVerified && user.phone && (
                    <Button size="sm">Send SMS</Button>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Shield className={`h-5 w-5 ${user.idVerified ? "text-blue-600" : "text-gray-400"}`} />
                    <div>
                      <p className="font-medium">ID Verification</p>
                      <p className="text-sm text-gray-500">
                        {user.idVerified ? "Government ID verified" : "Not verified"}
                      </p>
                    </div>
                  </div>
                  {!user.idVerified && (
                    <Button size="sm">Request ID</Button>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Lock className={`h-5 w-5 ${user.twoFactorEnabled ? "text-blue-600" : "text-gray-400"}`} />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">
                        {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    {user.twoFactorEnabled ? "Disable" : "Enable"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="admin" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Administrative Actions</CardTitle>
                <CardDescription>Actions available for this user account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {userActions.map((action) => {
                    const ActionIcon = action.icon
                    return (
                      <Button
                        key={action.id}
                        variant={action.variant}
                        className="justify-start h-auto p-3"
                        onClick={() => handleAction(action)}
                      >
                        <ActionIcon className="h-4 w-4 mr-3" />
                        <div className="text-left">
                          <div className="font-medium">{action.label}</div>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Administrative Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add internal notes about this user..."
                  rows={4}
                />
                <Button className="mt-3" size="sm">
                  Save Notes
                </Button>
              </CardContent>
            </Card>

            {user.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">User Tags</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {user.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                        <span>{tag}</span>
                        <Button variant="ghost" size="sm" className="h-4 w-4 p-0">
                          <XCircle className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-3">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tag
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Action Confirmation Dialog */}
        <Dialog open={isActionDialogOpen} onOpenChange={setIsActionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedAction?.label}</DialogTitle>
              <DialogDescription>
                {selectedAction?.requiresConfirmation 
                  ? `Are you sure you want to ${selectedAction.label.toLowerCase()} for ${user.name}?`
                  : `${selectedAction?.label} for ${user.name}`
                }
              </DialogDescription>
            </DialogHeader>
            {selectedAction?.requiresReason && (
              <div className="space-y-2">
                <Label>
                  {selectedAction.id === "send_message" ? "Message" : "Reason"}
                </Label>
                <Textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  placeholder={`Enter ${selectedAction.id === "send_message" ? "message" : "reason"}...`}
                  required
                />
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsActionDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={executeAction}
                disabled={selectedAction?.requiresReason && !actionReason.trim()}
                variant={selectedAction?.variant === "destructive" ? "destructive" : "default"}
              >
                {selectedAction?.requiresConfirmation ? "Confirm" : "Execute"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  )
}