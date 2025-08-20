"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut, 
  HelpCircle,
  Shield,
  Activity,
  Globe,
  Sun,
  Moon,
  AlertTriangle,
  Zap,
  Lock,
  Power,
  Database,
  Server,
  Wifi,
  Phone,
  Mail,
  MessageCircle,
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Flag,
  Users,
  Video,
  DollarSign,
  FileText
} from "lucide-react"
import { usePathname } from "next/navigation"

interface EnhancedAdminHeaderProps {
  user?: {
    name: string
    email: string
    avatar?: string
    role: string
  }
  notifications?: number
}

interface Notification {
  id: string
  type: "critical" | "warning" | "info" | "success"
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  category: "system" | "user" | "content" | "financial" | "security"
}

interface EmergencyAction {
  id: string
  title: string
  description: string
  icon: React.ElementType
  severity: "high" | "critical"
  confirmRequired: boolean
  action: () => void
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "critical",
    title: "Payment System Alert",
    message: "Multiple payment failures detected in the last hour",
    timestamp: "2 min ago",
    read: false,
    actionUrl: "/admin/finance",
    category: "financial"
  },
  {
    id: "2",
    type: "warning",
    title: "High Storage Usage",
    message: "Video storage at 78% capacity",
    timestamp: "5 min ago",
    read: false,
    actionUrl: "/admin/system",
    category: "system"
  },
  {
    id: "3",
    type: "info",
    title: "New Creator Applications",
    message: "8 new creator applications pending review",
    timestamp: "10 min ago",
    read: false,
    actionUrl: "/admin/creators",
    category: "user"
  },
  {
    id: "4",
    type: "warning",
    title: "Content Flagged",
    message: "Multiple videos flagged for review",
    timestamp: "15 min ago",
    read: true,
    actionUrl: "/admin/moderation",
    category: "content"
  },
  {
    id: "5",
    type: "success",
    title: "System Update Complete",
    message: "Security patches applied successfully",
    timestamp: "1 hour ago",
    read: true,
    category: "system"
  }
]

const emergencyActions: EmergencyAction[] = [
  {
    id: "lockdown",
    title: "Emergency Lockdown",
    description: "Immediately disable all user access to the platform",
    icon: Lock,
    severity: "critical",
    confirmRequired: true,
    action: () => console.log("Emergency lockdown initiated")
  },
  {
    id: "payment_halt",
    title: "Halt All Payments",
    description: "Stop all payment processing immediately",
    icon: DollarSign,
    severity: "high",
    confirmRequired: true,
    action: () => console.log("Payment processing halted")
  },
  {
    id: "content_freeze",
    title: "Content Upload Freeze",
    description: "Disable all new content uploads",
    icon: Video,
    severity: "high",
    confirmRequired: true,
    action: () => console.log("Content uploads frozen")
  },
  {
    id: "maintenance_mode",
    title: "Maintenance Mode",
    description: "Put platform in maintenance mode",
    icon: Settings,
    severity: "high",
    confirmRequired: true,
    action: () => console.log("Maintenance mode activated")
  }
]

export function EnhancedAdminHeader({ 
  user = {
    name: "Admin User",
    email: "admin@annpale.com",
    role: "super_admin"
  },
  notifications = 5
}: EnhancedAdminHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isEmergencyDialogOpen, setIsEmergencyDialogOpen] = useState(false)
  const [notificationsList, setNotificationsList] = useState(mockNotifications)
  const pathname = usePathname()

  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean)
    if (segments.length <= 1) return "Dashboard"
    return segments[segments.length - 1]
      .split("-")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ")
  }

  const getBreadcrumbs = () => {
    const segments = pathname.split("/").filter(Boolean)
    return segments.map((segment, index) => ({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace("-", " "),
      href: "/" + segments.slice(0, index + 1).join("/"),
      isLast: index === segments.length - 1
    }))
  }

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case "info":
        return <Info className="h-4 w-4 text-blue-600" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-600" />
    }
  }

  const getCategoryIcon = (category: Notification["category"]) => {
    switch (category) {
      case "system":
        return <Server className="h-3 w-3" />
      case "user":
        return <Users className="h-3 w-3" />
      case "content":
        return <Video className="h-3 w-3" />
      case "financial":
        return <DollarSign className="h-3 w-3" />
      case "security":
        return <Shield className="h-3 w-3" />
    }
  }

  const unreadCount = notificationsList.filter(n => !n.read).length
  const criticalCount = notificationsList.filter(n => n.type === "critical" && !n.read).length

  const markAsRead = (id: string) => {
    setNotificationsList(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotificationsList(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  return (
    <header className="sticky top-0 z-30 border-b bg-white">
      <div className="flex h-16 items-center gap-4 px-6">
        {/* Page Title & Breadcrumbs */}
        <div className="flex-1">
          <h1 className="text-xl font-semibold">{getPageTitle()}</h1>
          <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
            {getBreadcrumbs().map((crumb, index) => (
              <div key={crumb.href} className="flex items-center">
                {index > 0 && <span className="mx-1">/</span>}
                {crumb.isLast ? (
                  <span>{crumb.label}</span>
                ) : (
                  <a href={crumb.href} className="hover:text-foreground">
                    {crumb.label}
                  </a>
                )}
              </div>
            ))}
          </nav>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex items-center w-96">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search users, orders, content..."
              className="pl-10 pr-4"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">ESC</span>
              </kbd>
            )}
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2">
          {/* Emergency Actions */}
          <Dialog open={isEmergencyDialogOpen} onOpenChange={setIsEmergencyDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                <AlertTriangle className="h-4 w-4 mr-2" />
                Emergency
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-red-600">Emergency Actions</DialogTitle>
                <DialogDescription>
                  Critical actions that can be taken in emergency situations. Use with extreme caution.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyActions.map((action) => {
                  const Icon = action.icon
                  return (
                    <AlertDialog key={action.id}>
                      <AlertDialogTrigger asChild>
                        <div className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                          action.severity === "critical" ? "border-red-200 bg-red-50" : "border-orange-200 bg-orange-50"
                        }`}>
                          <div className="flex items-center space-x-3 mb-2">
                            <Icon className={`h-5 w-5 ${
                              action.severity === "critical" ? "text-red-600" : "text-orange-600"
                            }`} />
                            <span className="font-medium">{action.title}</span>
                          </div>
                          <p className="text-sm text-gray-600">{action.description}</p>
                        </div>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-red-600">
                            Confirm Emergency Action
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to execute "{action.title}"? This action may have 
                            immediate and significant impact on the platform.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            className="bg-red-600 hover:bg-red-700"
                            onClick={action.action}
                          >
                            Execute Action
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )
                })}
              </div>
            </DialogContent>
          </Dialog>

          {/* Language Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span className="mr-2">🇺🇸</span> English
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="mr-2">🇫🇷</span> Français
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span className="mr-2">🇭🇹</span> Kreyòl
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </Button>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge 
                    variant={criticalCount > 0 ? "destructive" : "default"}
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96">
              <div className="flex items-center justify-between p-3">
                <DropdownMenuLabel className="p-0">Notifications</DropdownMenuLabel>
                {unreadCount > 0 && (
                  <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs h-6">
                    Mark all read
                  </Button>
                )}
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-96 overflow-y-auto">
                {notificationsList.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                      !notification.read ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {getNotificationIcon(notification.type)}
                        <span className="font-medium text-sm">{notification.title}</span>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        {getCategoryIcon(notification.category)}
                        <span className="text-xs text-gray-500 capitalize">{notification.category}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{notification.timestamp}</span>
                      {notification.actionUrl && (
                        <Button variant="ghost" size="sm" className="text-xs h-6">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          View
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button variant="ghost" className="w-full text-sm">
                  View all notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* System Status */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Activity className="h-5 w-5 text-green-600" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>System Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Server className="h-3 w-3" />
                    <span className="text-sm">API</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Database className="h-3 w-3" />
                    <span className="text-sm">Database</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Globe className="h-3 w-3" />
                    <span className="text-sm">CDN</span>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Operational
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Video className="h-3 w-3" />
                    <span className="text-sm">Video Processing</span>
                  </div>
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                    Slow
                  </Badge>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <ExternalLink className="mr-2 h-4 w-4" />
                Status Page
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help & Documentation */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <HelpCircle className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Help & Support</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Documentation
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Support
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Phone className="mr-2 h-4 w-4" />
                Emergency Contact
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Activity className="mr-2 h-4 w-4" />
                System Health
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  <Badge variant="secondary" className="w-fit mt-1 capitalize">
                    {user.role.replace("_", " ")}
                  </Badge>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Shield className="mr-2 h-4 w-4" />
                <span>Security</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="mr-2 h-4 w-4" />
                <span>Help & Support</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}