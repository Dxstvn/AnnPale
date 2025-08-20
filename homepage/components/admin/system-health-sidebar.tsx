"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Globe,
  HardDrive,
  MemoryStick,
  Server,
  Shield,
  TrendingUp,
  Users,
  Wifi,
  Zap,
  Bell,
  Settings,
  RefreshCw,
  ExternalLink,
  Phone,
  Mail,
  MessageCircle,
  User,
  UserCheck,
  Video,
  DollarSign,
  Flag,
  FileText,
  Calendar
} from "lucide-react"

interface SystemMetric {
  name: string
  value: string | number
  status: "healthy" | "warning" | "critical"
  icon: React.ElementType
  trend?: "up" | "down" | "stable"
  lastUpdated: string
}

interface ActiveAdmin {
  id: string
  name: string
  avatar?: string
  role: string
  status: "online" | "away" | "busy"
  lastActive: string
  currentSection: string
}

interface PendingItem {
  id: string
  type: "approval" | "review" | "support" | "financial"
  title: string
  priority: "low" | "medium" | "high" | "critical"
  createdAt: string
  assignee?: string
}

interface RecentChange {
  id: string
  action: string
  user: string
  target: string
  timestamp: string
  type: "user" | "content" | "financial" | "system"
}

const systemMetrics: SystemMetric[] = [
  {
    name: "System Uptime",
    value: "99.97%",
    status: "healthy",
    icon: Activity,
    trend: "stable",
    lastUpdated: "2 min ago"
  },
  {
    name: "API Response",
    value: "127ms",
    status: "healthy",
    icon: Zap,
    trend: "down",
    lastUpdated: "1 min ago"
  },
  {
    name: "Database",
    value: "Active",
    status: "healthy",
    icon: Database,
    trend: "stable",
    lastUpdated: "30s ago"
  },
  {
    name: "CDN Status",
    value: "Global",
    status: "healthy",
    icon: Globe,
    trend: "stable",
    lastUpdated: "1 min ago"
  },
  {
    name: "Storage",
    value: "78%",
    status: "warning",
    icon: HardDrive,
    trend: "up",
    lastUpdated: "5 min ago"
  },
  {
    name: "Memory",
    value: "64%",
    status: "healthy",
    icon: MemoryStick,
    trend: "stable",
    lastUpdated: "1 min ago"
  }
]

const activeAdmins: ActiveAdmin[] = [
  {
    id: "1",
    name: "Sarah Chen",
    avatar: "/placeholder-user.jpg",
    role: "Operations Admin",
    status: "online",
    lastActive: "Active now",
    currentSection: "User Management"
  },
  {
    id: "2",
    name: "Marcus Johnson",
    role: "Content Moderator",
    status: "online",
    lastActive: "2 min ago",
    currentSection: "Content Review"
  },
  {
    id: "3",
    name: "Elena Rodriguez",
    role: "Finance Manager",
    status: "away",
    lastActive: "15 min ago",
    currentSection: "Financial Oversight"
  }
]

const pendingItems: PendingItem[] = [
  {
    id: "1",
    type: "approval",
    title: "Creator application: DJ Max",
    priority: "medium",
    createdAt: "10 min ago",
    assignee: "Sarah Chen"
  },
  {
    id: "2",
    type: "review",
    title: "Flagged video content",
    priority: "high",
    createdAt: "5 min ago"
  },
  {
    id: "3",
    type: "support",
    title: "Payment dispute #1234",
    priority: "critical",
    createdAt: "2 min ago",
    assignee: "Elena Rodriguez"
  },
  {
    id: "4",
    type: "financial",
    title: "Payout processing delay",
    priority: "medium",
    createdAt: "1 hour ago"
  }
]

const recentChanges: RecentChange[] = [
  {
    id: "1",
    action: "User suspended",
    user: "Sarah Chen",
    target: "john.doe@email.com",
    timestamp: "2 min ago",
    type: "user"
  },
  {
    id: "2",
    action: "Content approved",
    user: "Marcus Johnson", 
    target: "Video #5678",
    timestamp: "5 min ago",
    type: "content"
  },
  {
    id: "3",
    action: "Payout processed",
    user: "Elena Rodriguez",
    target: "$2,450.00",
    timestamp: "8 min ago",
    type: "financial"
  },
  {
    id: "4",
    action: "Role updated",
    user: "Admin System",
    target: "marcus.j@annpale.com",
    timestamp: "12 min ago",
    type: "system"
  }
]

const emergencyContacts = [
  {
    name: "Platform Owner",
    contact: "+1 (555) 123-4567",
    email: "owner@annpale.com",
    type: "phone"
  },
  {
    name: "Tech Lead", 
    contact: "+1 (555) 987-6543",
    email: "tech@annpale.com",
    type: "phone"
  },
  {
    name: "Legal Team",
    contact: "legal@annpale.com",
    type: "email"
  }
]

export function SystemHealthSidebar() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getStatusColor = (status: SystemMetric["status"]) => {
    switch (status) {
      case "healthy":
        return "text-green-600"
      case "warning":
        return "text-yellow-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getStatusIcon = (status: SystemMetric["status"]) => {
    switch (status) {
      case "healthy":
        return CheckCircle
      case "warning":
        return AlertTriangle
      case "critical":
        return AlertTriangle
      default:
        return CheckCircle
    }
  }

  const getPriorityColor = (priority: PendingItem["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-blue-100 text-blue-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeIcon = (type: PendingItem["type"]) => {
    switch (type) {
      case "approval":
        return UserCheck
      case "review":
        return Video
      case "support":
        return MessageCircle
      case "financial":
        return DollarSign
      default:
        return FileText
    }
  }

  const getChangeTypeColor = (type: RecentChange["type"]) => {
    switch (type) {
      case "user":
        return "bg-blue-100 text-blue-800"
      case "content":
        return "bg-purple-100 text-purple-800"
      case "financial":
        return "bg-green-100 text-green-800"
      case "system":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getAdminStatusColor = (status: ActiveAdmin["status"]) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "away":
        return "bg-yellow-500"
      case "busy":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false)
    }, 1000)
  }

  return (
    <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-900">System Overview</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        <p className="text-xs text-gray-500">
          Last updated: {currentTime.toLocaleTimeString()}
        </p>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* System Health */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">System Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {systemMetrics.map((metric) => {
                const StatusIcon = getStatusIcon(metric.status)
                return (
                  <div key={metric.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <metric.icon className="h-3 w-3 text-gray-500" />
                      <span className="text-xs">{metric.name}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span className="text-xs font-medium">{metric.value}</span>
                      <StatusIcon className={`h-3 w-3 ${getStatusColor(metric.status)}`} />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Active Admins */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Active Admins</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeAdmins.map((admin) => (
                <div key={admin.id} className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={admin.avatar} />
                      <AvatarFallback className="text-xs">
                        {admin.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-white ${getAdminStatusColor(admin.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{admin.name}</p>
                    <p className="text-xs text-gray-500 truncate">{admin.currentSection}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Pending Approvals */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm">Pending Items</CardTitle>
                <Badge variant="destructive" className="text-xs">
                  {pendingItems.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {pendingItems.map((item) => {
                const TypeIcon = getTypeIcon(item.type)
                return (
                  <div key={item.id} className="space-y-1">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <TypeIcon className="h-3 w-3 text-gray-500 mt-0.5" />
                        <span className="text-xs font-medium">{item.title}</span>
                      </div>
                      <Badge className={`text-xs ${getPriorityColor(item.priority)}`}>
                        {item.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500 ml-5">
                      <span>{item.createdAt}</span>
                      {item.assignee && <span>→ {item.assignee}</span>}
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <UserCheck className="h-3 w-3 mr-2" />
                Approve Pending Users
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <Flag className="h-3 w-3 mr-2" />
                Review Flagged Content
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <DollarSign className="h-3 w-3 mr-2" />
                Process Payouts
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start text-xs">
                <Settings className="h-3 w-3 mr-2" />
                System Settings
              </Button>
            </CardContent>
          </Card>

          {/* Recent Changes */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">Recent Changes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentChanges.map((change) => (
                <div key={change.id} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium">{change.action}</span>
                    <Badge className={`text-xs ${getChangeTypeColor(change.type)}`}>
                      {change.type}
                    </Badge>
                  </div>
                  <div className="text-xs text-gray-500">
                    <span>{change.user}</span> → <span className="font-medium">{change.target}</span>
                  </div>
                  <div className="text-xs text-gray-400">{change.timestamp}</div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Emergency Contacts */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-red-600">Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium">{contact.name}</p>
                    <p className="text-xs text-gray-500">{contact.contact}</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    {contact.type === "phone" ? (
                      <Phone className="h-3 w-3" />
                    ) : (
                      <Mail className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>v2.1.4</span>
          <div className="flex items-center space-x-1">
            <Wifi className="h-3 w-3 text-green-500" />
            <span>Online</span>
          </div>
        </div>
        <div className="text-xs text-gray-400">
          Last system update: 2 hours ago
        </div>
      </div>
    </div>
  )
}