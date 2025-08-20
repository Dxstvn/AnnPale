"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/lib/utils/toast"
import {
  Bell,
  BellRing,
  AlertTriangle,
  AlertOctagon,
  Info,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  Filter,
  Search,
  Trash2,
  MoreVertical,
  Archive,
  Share,
  Forward,
  Reply,
  MessageSquare,
  Phone,
  Mail,
  Smartphone,
  Volume2,
  VolumeX,
  Vibrate,
  Settings,
  Zap,
  Timer,
  Calendar,
  User,
  Users,
  Shield,
  Activity,
  TrendingUp,
  Database,
  Server,
  Globe,
  CreditCard,
  Video,
  FileWarning,
  UserX,
  Ban,
  Lock,
  Unlock,
  RefreshCw,
  ExternalLink,
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface Alert {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "critical" | "success"
  priority: "low" | "medium" | "high" | "urgent"
  category: "security" | "system" | "user" | "content" | "financial" | "performance"
  source: string
  timestamp: Date
  read: boolean
  acknowledged: boolean
  actionRequired: boolean
  assignedTo?: string
  resolvedAt?: Date
  metadata?: Record<string, any>
  actions: AlertAction[]
  relatedAlerts?: string[]
  escalationLevel: number
  autoResolve: boolean
  resolveAfter?: number // minutes
}

export interface AlertAction {
  id: string
  label: string
  icon: React.ReactNode
  action: (alert: Alert) => Promise<void> | void
  variant?: "default" | "destructive" | "secondary" | "ghost"
  requiresConfirmation?: boolean
  quickAction?: boolean
}

export interface AlertFilter {
  type?: Alert["type"][]
  priority?: Alert["priority"][]
  category?: Alert["category"][]
  read?: boolean
  acknowledged?: boolean
  actionRequired?: boolean
  timeRange?: "1h" | "6h" | "24h" | "7d" | "30d"
  source?: string[]
}

export interface NotificationSettings {
  pushNotifications: boolean
  emailNotifications: boolean
  smsNotifications: boolean
  vibration: boolean
  sound: boolean
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
  priorities: {
    low: boolean
    medium: boolean
    high: boolean
    urgent: boolean
  }
  categories: {
    security: boolean
    system: boolean
    user: boolean
    content: boolean
    financial: boolean
    performance: boolean
  }
}

interface MobileAlertManagerProps {
  className?: string
  onAlertAction?: (alertId: string, actionId: string) => void
  onAlertRead?: (alertId: string) => void
  onAlertAcknowledged?: (alertId: string) => void
  onSettingsChange?: (settings: NotificationSettings) => void
}

const defaultAlerts: Alert[] = [
  {
    id: "alert-1",
    title: "Suspicious Login Activity",
    message: "Multiple failed login attempts detected from IP 192.168.1.100",
    type: "critical",
    priority: "urgent",
    category: "security",
    source: "Security Monitor",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    acknowledged: false,
    actionRequired: true,
    escalationLevel: 2,
    autoResolve: false,
    actions: [
      {
        id: "block-ip",
        label: "Block IP",
        icon: <Ban className="h-4 w-4" />,
        action: async () => {},
        variant: "destructive",
        requiresConfirmation: true,
        quickAction: true,
      },
      {
        id: "investigate",
        label: "Investigate",
        icon: <Eye className="h-4 w-4" />,
        action: async () => {},
        quickAction: true,
      },
    ],
  },
  {
    id: "alert-2",
    title: "High CPU Usage",
    message: "Server CPU usage above 85% for 10 minutes",
    type: "warning",
    priority: "high",
    category: "performance",
    source: "System Monitor",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    read: false,
    acknowledged: false,
    actionRequired: false,
    escalationLevel: 1,
    autoResolve: true,
    resolveAfter: 30,
    actions: [
      {
        id: "scale-up",
        label: "Scale Up",
        icon: <TrendingUp className="h-4 w-4" />,
        action: async () => {},
        quickAction: true,
      },
    ],
  },
  {
    id: "alert-3",
    title: "New Creator Application",
    message: "Sarah Williams has submitted a creator application",
    type: "info",
    priority: "medium",
    category: "user",
    source: "User Service",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    read: true,
    acknowledged: false,
    actionRequired: true,
    escalationLevel: 0,
    autoResolve: false,
    actions: [
      {
        id: "approve",
        label: "Approve",
        icon: <CheckCircle className="h-4 w-4" />,
        action: async () => {},
        quickAction: true,
      },
      {
        id: "review",
        label: "Review",
        icon: <Eye className="h-4 w-4" />,
        action: async () => {},
      },
    ],
  },
  {
    id: "alert-4",
    title: "Payment Failure",
    message: "Payment processing failure rate increased to 12%",
    type: "critical",
    priority: "urgent",
    category: "financial",
    source: "Payment Gateway",
    timestamp: new Date(Date.now() - 45 * 60 * 1000),
    read: true,
    acknowledged: true,
    actionRequired: false,
    escalationLevel: 1,
    autoResolve: false,
    actions: [],
    resolvedAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "alert-5",
    title: "Content Flagged",
    message: "Video content flagged for inappropriate material",
    type: "warning",
    priority: "high",
    category: "content",
    source: "Content Moderation",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: false,
    acknowledged: false,
    actionRequired: true,
    escalationLevel: 0,
    autoResolve: false,
    actions: [
      {
        id: "review-content",
        label: "Review",
        icon: <FileWarning className="h-4 w-4" />,
        action: async () => {},
        quickAction: true,
      },
      {
        id: "remove-content",
        label: "Remove",
        icon: <Trash2 className="h-4 w-4" />,
        action: async () => {},
        variant: "destructive",
        requiresConfirmation: true,
      },
    ],
  },
]

const defaultNotificationSettings: NotificationSettings = {
  pushNotifications: true,
  emailNotifications: true,
  smsNotifications: false,
  vibration: true,
  sound: true,
  quietHours: {
    enabled: true,
    start: "22:00",
    end: "06:00",
  },
  priorities: {
    low: false,
    medium: true,
    high: true,
    urgent: true,
  },
  categories: {
    security: true,
    system: true,
    user: true,
    content: true,
    financial: true,
    performance: true,
  },
}

export function MobileAlertManager({
  className,
  onAlertAction,
  onAlertRead,
  onAlertAcknowledged,
  onSettingsChange,
}: MobileAlertManagerProps) {
  const [alerts, setAlerts] = useState<Alert[]>(defaultAlerts)
  const [filteredAlerts, setFilteredAlerts] = useState<Alert[]>(defaultAlerts)
  const [filter, setFilter] = useState<AlertFilter>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false)
  const [settings, setSettings] = useState<NotificationSettings>(defaultNotificationSettings)
  const [isProcessing, setIsProcessing] = useState(false)
  const [sortBy, setSortBy] = useState<"timestamp" | "priority" | "type">("timestamp")

  // Auto-resolve alerts
  useEffect(() => {
    const interval = setInterval(() => {
      setAlerts(prev => prev.map(alert => {
        if (alert.autoResolve && alert.resolveAfter && !alert.resolvedAt) {
          const minutesAgo = (Date.now() - alert.timestamp.getTime()) / (1000 * 60)
          if (minutesAgo >= alert.resolveAfter) {
            return {
              ...alert,
              resolvedAt: new Date(),
              acknowledged: true,
            }
          }
        }
        return alert
      }))
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  // Filter and search alerts
  useEffect(() => {
    let filtered = alerts

    // Apply filters
    if (filter.type?.length) {
      filtered = filtered.filter(alert => filter.type!.includes(alert.type))
    }
    if (filter.priority?.length) {
      filtered = filtered.filter(alert => filter.priority!.includes(alert.priority))
    }
    if (filter.category?.length) {
      filtered = filtered.filter(alert => filter.category!.includes(alert.category))
    }
    if (filter.read !== undefined) {
      filtered = filtered.filter(alert => alert.read === filter.read)
    }
    if (filter.acknowledged !== undefined) {
      filtered = filtered.filter(alert => alert.acknowledged === filter.acknowledged)
    }
    if (filter.actionRequired !== undefined) {
      filtered = filtered.filter(alert => alert.actionRequired === filter.actionRequired)
    }
    if (filter.timeRange) {
      const now = Date.now()
      const ranges = {
        "1h": 60 * 60 * 1000,
        "6h": 6 * 60 * 60 * 1000,
        "24h": 24 * 60 * 60 * 1000,
        "7d": 7 * 24 * 60 * 60 * 1000,
        "30d": 30 * 24 * 60 * 60 * 1000,
      }
      const cutoff = now - ranges[filter.timeRange]
      filtered = filtered.filter(alert => alert.timestamp.getTime() >= cutoff)
    }

    // Apply search
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(alert =>
        alert.title.toLowerCase().includes(term) ||
        alert.message.toLowerCase().includes(term) ||
        alert.source.toLowerCase().includes(term)
      )
    }

    // Sort alerts
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "priority":
          const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        case "type":
          const typeOrder = { critical: 0, warning: 1, info: 2, success: 3 }
          return typeOrder[a.type] - typeOrder[b.type]
        default:
          return b.timestamp.getTime() - a.timestamp.getTime()
      }
    })

    setFilteredAlerts(filtered)
  }, [alerts, filter, searchTerm, sortBy])

  const handleAlertClick = (alert: Alert) => {
    if (!alert.read) {
      handleMarkAsRead(alert.id)
    }
    setSelectedAlert(alert)
    setIsDetailsDialogOpen(true)
  }

  const handleMarkAsRead = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, read: true } : alert
    ))
    onAlertRead?.(alertId)
  }

  const handleAcknowledge = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, acknowledged: true } : alert
    ))
    onAlertAcknowledged?.(alertId)
  }

  const handleAlertAction = async (alert: Alert, action: AlertAction) => {
    setIsProcessing(true)
    try {
      await action.action(alert)
      onAlertAction?.(alert.id, action.id)
      
      // If it's a resolving action, mark as resolved
      if (["approve", "resolve", "fix", "complete"].some(keyword => 
        action.id.includes(keyword))) {
        setAlerts(prev => prev.map(a =>
          a.id === alert.id ? { ...a, resolvedAt: new Date(), acknowledged: true } : a
        ))
      }
      
      toast({
        title: "Action Completed",
        description: `${action.label} executed successfully`,
      })
    } catch (error) {
      toast({
        title: "Action Failed",
        description: `Failed to execute ${action.label}`,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBulkAction = (action: "markRead" | "acknowledge" | "archive", alertIds: string[]) => {
    setAlerts(prev => prev.map(alert => {
      if (!alertIds.includes(alert.id)) return alert
      
      switch (action) {
        case "markRead":
          return { ...alert, read: true }
        case "acknowledge":
          return { ...alert, acknowledged: true }
        case "archive":
          return { ...alert, read: true, acknowledged: true }
        default:
          return alert
      }
    }))
  }

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return <AlertOctagon className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
    }
  }

  const getPriorityColor = (priority: Alert["priority"]) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800 border-red-200"
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getCategoryIcon = (category: Alert["category"]) => {
    const icons = {
      security: <Shield className="h-4 w-4" />,
      system: <Server className="h-4 w-4" />,
      user: <Users className="h-4 w-4" />,
      content: <Video className="h-4 w-4" />,
      financial: <CreditCard className="h-4 w-4" />,
      performance: <Activity className="h-4 w-4" />,
    }
    return icons[category]
  }

  const unreadCount = alerts.filter(a => !a.read).length
  const urgentCount = alerts.filter(a => a.priority === "urgent" && !a.acknowledged).length
  const actionRequiredCount = alerts.filter(a => a.actionRequired && !a.acknowledged).length

  return (
    <div className={cn("space-y-4", className)}>
      {/* Alert Summary */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Bell className="h-5 w-5 text-blue-600" />
              <h2 className="font-semibold">Alert Center</h2>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSettingsDialogOpen(true)}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{urgentCount}</div>
              <div className="text-xs text-gray-500">Urgent</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{unreadCount}</div>
              <div className="text-xs text-gray-500">Unread</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">{actionRequiredCount}</div>
              <div className="text-xs text-gray-500">Action Required</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search alerts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Select value={filter.type?.[0] || ""} onValueChange={(value) => 
              setFilter(prev => ({ ...prev, type: value ? [value as Alert["type"]] : undefined }))
            }>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="success">Success</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filter.priority?.[0] || ""} onValueChange={(value) => 
              setFilter(prev => ({ ...prev, priority: value ? [value as Alert["priority"]] : undefined }))
            }>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Priorities</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="timestamp">Time</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="type">Type</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-2">
            <Button
              variant={filter.read === false ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(prev => ({ 
                ...prev, 
                read: prev.read === false ? undefined : false 
              }))}
            >
              Unread
            </Button>
            <Button
              variant={filter.actionRequired === true ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(prev => ({ 
                ...prev, 
                actionRequired: prev.actionRequired === true ? undefined : true 
              }))}
            >
              Action Required
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alert List */}
      <ScrollArea className="h-[calc(100vh-400px)]">
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <Card
              key={alert.id}
              className={cn(
                "cursor-pointer transition-all",
                !alert.read && "ring-2 ring-blue-500 ring-opacity-50",
                alert.resolvedAt && "opacity-60"
              )}
              onClick={() => handleAlertClick(alert)}
            >
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getAlertIcon(alert.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(alert.priority)}>
                          {alert.priority}
                        </Badge>
                        {getCategoryIcon(alert.category)}
                        {alert.actionRequired && !alert.acknowledged && (
                          <Badge variant="destructive" className="text-xs">
                            Action Required
                          </Badge>
                        )}
                        {alert.escalationLevel > 0 && (
                          <Badge variant="outline" className="text-xs">
                            L{alert.escalationLevel}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.round((Date.now() - alert.timestamp.getTime()) / 60000)}m ago
                      </span>
                    </div>
                    
                    <h3 className="font-medium text-sm mb-1">{alert.title}</h3>
                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">{alert.message}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{alert.source}</span>
                        {alert.resolvedAt && (
                          <Badge variant="outline" className="text-xs">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Resolved
                          </Badge>
                        )}
                      </div>
                      
                      {alert.actions.filter(a => a.quickAction).length > 0 && (
                        <div className="flex space-x-1">
                          {alert.actions
                            .filter(a => a.quickAction)
                            .slice(0, 2)
                            .map((action) => (
                              <Button
                                key={action.id}
                                size="sm"
                                variant={action.variant || "outline"}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAlertAction(alert, action)
                                }}
                                disabled={isProcessing || !!alert.resolvedAt}
                                className="h-6 px-2 text-xs"
                              >
                                {action.icon}
                                <span className="ml-1">{action.label}</span>
                              </Button>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Alert Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              {selectedAlert && getAlertIcon(selectedAlert.type)}
              <span>{selectedAlert?.title}</span>
            </DialogTitle>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Badge className={getPriorityColor(selectedAlert.priority)}>
                  {selectedAlert.priority}
                </Badge>
                <Badge variant="outline">
                  {getCategoryIcon(selectedAlert.category)}
                  <span className="ml-1">{selectedAlert.category}</span>
                </Badge>
                {selectedAlert.actionRequired && (
                  <Badge variant="destructive">Action Required</Badge>
                )}
              </div>
              
              <div>
                <Label>Message</Label>
                <p className="text-sm text-gray-600">{selectedAlert.message}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label>Source</Label>
                  <p>{selectedAlert.source}</p>
                </div>
                <div>
                  <Label>Timestamp</Label>
                  <p>{selectedAlert.timestamp.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <p>{selectedAlert.resolvedAt ? "Resolved" : "Active"}</p>
                </div>
                <div>
                  <Label>Escalation</Label>
                  <p>Level {selectedAlert.escalationLevel}</p>
                </div>
              </div>
              
              {selectedAlert.actions.length > 0 && (
                <div>
                  <Label>Available Actions</Label>
                  <div className="space-y-2 mt-2">
                    {selectedAlert.actions.map((action) => (
                      <Button
                        key={action.id}
                        variant={action.variant || "outline"}
                        className="w-full justify-start"
                        onClick={() => handleAlertAction(selectedAlert, action)}
                        disabled={isProcessing || !!selectedAlert.resolvedAt}
                      >
                        {action.icon}
                        <span className="ml-2">{action.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            {selectedAlert && !selectedAlert.acknowledged && (
              <Button
                variant="outline"
                onClick={() => {
                  handleAcknowledge(selectedAlert.id)
                  setIsDetailsDialogOpen(false)
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Acknowledge
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setIsDetailsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Notification Settings</DialogTitle>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3">Notification Methods</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <Switch
                      id="push-notifications"
                      checked={settings.pushNotifications}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, pushNotifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <Switch
                      id="email-notifications"
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, emailNotifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <Switch
                      id="sms-notifications"
                      checked={settings.smsNotifications}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, smsNotifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="vibration">Vibration</Label>
                    <Switch
                      id="vibration"
                      checked={settings.vibration}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, vibration: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sound">Sound</Label>
                    <Switch
                      id="sound"
                      checked={settings.sound}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ ...prev, sound: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Priority Filters</h4>
                <div className="space-y-3">
                  {Object.entries(settings.priorities).map(([priority, enabled]) => (
                    <div key={priority} className="flex items-center justify-between">
                      <Label htmlFor={`priority-${priority}`} className="capitalize">
                        {priority}
                      </Label>
                      <Switch
                        id={`priority-${priority}`}
                        checked={enabled}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ 
                            ...prev, 
                            priorities: { ...prev.priorities, [priority]: checked }
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Category Filters</h4>
                <div className="space-y-3">
                  {Object.entries(settings.categories).map(([category, enabled]) => (
                    <div key={category} className="flex items-center justify-between">
                      <Label htmlFor={`category-${category}`} className="flex items-center space-x-2">
                        {getCategoryIcon(category as Alert["category"])}
                        <span className="capitalize">{category}</span>
                      </Label>
                      <Switch
                        id={`category-${category}`}
                        checked={enabled}
                        onCheckedChange={(checked) => 
                          setSettings(prev => ({ 
                            ...prev, 
                            categories: { ...prev.categories, [category]: checked }
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Quiet Hours</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="quiet-hours">Enable Quiet Hours</Label>
                    <Switch
                      id="quiet-hours"
                      checked={settings.quietHours.enabled}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({ 
                          ...prev, 
                          quietHours: { ...prev.quietHours, enabled: checked }
                        }))
                      }
                    />
                  </div>
                  {settings.quietHours.enabled && (
                    <>
                      <div>
                        <Label htmlFor="quiet-start">Start Time</Label>
                        <Input
                          id="quiet-start"
                          type="time"
                          value={settings.quietHours.start}
                          onChange={(e) => 
                            setSettings(prev => ({ 
                              ...prev, 
                              quietHours: { ...prev.quietHours, start: e.target.value }
                            }))
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="quiet-end">End Time</Label>
                        <Input
                          id="quiet-end"
                          type="time"
                          value={settings.quietHours.end}
                          onChange={(e) => 
                            setSettings(prev => ({ 
                              ...prev, 
                              quietHours: { ...prev.quietHours, end: e.target.value }
                            }))
                          }
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSettingsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onSettingsChange?.(settings)
                setIsSettingsDialogOpen(false)
                toast({
                  title: "Settings Saved",
                  description: "Notification settings have been updated",
                })
              }}
            >
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}