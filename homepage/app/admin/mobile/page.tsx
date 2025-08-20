"use client"

import { useState, useEffect } from "react"
import { AuthGuard } from "@/components/auth/auth-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Users,
  Video,
  DollarSign,
  AlertTriangle,
  Bell,
  Shield,
  Menu,
  Home,
  Ban,
  CheckCircle,
  XCircle,
  AlertOctagon,
  Power,
  MessageSquare,
  TrendingUp,
  Clock,
  Eye,
  UserCheck,
  RefreshCw,
  Zap,
  Lock,
  Unlock,
  PauseCircle,
  PlayCircle,
  ShieldAlert,
  FileWarning,
  UserX,
  Fingerprint,
  Smartphone,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useIsMobile } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { MobileQuickActions } from "@/components/admin/mobile-quick-actions"
import { EmergencyResponse } from "@/components/admin/emergency-response"
import { MobileAlertManager } from "@/components/admin/mobile-alert-manager"
import { BiometricAuth } from "@/components/admin/biometric-auth"

interface QuickAction {
  id: string
  label: string
  icon: React.ReactNode
  action: () => void
  variant?: "default" | "destructive" | "secondary"
  requireConfirmation?: boolean
}

interface Alert {
  id: string
  type: "critical" | "warning" | "info"
  title: string
  message: string
  timestamp: Date
  actionRequired: boolean
  actions?: QuickAction[]
}

interface EmergencyControl {
  id: string
  name: string
  description: string
  enabled: boolean
  critical: boolean
}

function MobileAdminDashboard() {
  const isMobile = useIsMobile()
  const [isOnline, setIsOnline] = useState(true)
  const [batteryLevel, setBatteryLevel] = useState(100)
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false)
  const [selectedTab, setSelectedTab] = useState("overview")
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // Emergency controls state
  const [emergencyControls, setEmergencyControls] = useState<EmergencyControl[]>([
    {
      id: "maintenance-mode",
      name: "Maintenance Mode",
      description: "Temporarily disable all services",
      enabled: false,
      critical: true,
    },
    {
      id: "freeze-transactions",
      name: "Freeze Transactions",
      description: "Stop all payment processing",
      enabled: false,
      critical: true,
    },
    {
      id: "disable-uploads",
      name: "Disable Uploads",
      description: "Prevent new content uploads",
      enabled: false,
      critical: false,
    },
    {
      id: "disable-registrations",
      name: "Disable Registrations",
      description: "Stop new user signups",
      enabled: false,
      critical: false,
    },
  ])

  // Alerts state
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      type: "critical",
      title: "Suspicious Activity Detected",
      message: "Multiple failed login attempts from IP 192.168.1.1",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      actionRequired: true,
      actions: [
        {
          id: "block-ip",
          label: "Block IP",
          icon: <Ban className="h-4 w-4" />,
          action: () => console.log("Block IP"),
          variant: "destructive",
        },
        {
          id: "investigate",
          label: "Investigate",
          icon: <Eye className="h-4 w-4" />,
          action: () => console.log("Investigate"),
        },
      ],
    },
    {
      id: "2",
      type: "warning",
      title: "High Server Load",
      message: "CPU usage above 80% for 10 minutes",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      actionRequired: false,
    },
    {
      id: "3",
      type: "info",
      title: "New Creator Application",
      message: "Sarah Williams has applied to become a creator",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      actionRequired: true,
      actions: [
        {
          id: "approve",
          label: "Approve",
          icon: <CheckCircle className="h-4 w-4" />,
          action: () => console.log("Approve"),
          variant: "default",
        },
        {
          id: "review",
          label: "Review",
          icon: <Eye className="h-4 w-4" />,
          action: () => console.log("Review"),
        },
      ],
    },
  ])

  // Quick stats
  const quickStats = {
    activeUsers: 1247,
    pendingApprovals: 8,
    activeIncidents: 2,
    revenue24h: 4580,
  }

  // Monitor device status
  useEffect(() => {
    // Monitor online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Monitor battery status (if available)
    if ("getBattery" in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100))
        
        battery.addEventListener("levelchange", () => {
          setBatteryLevel(Math.round(battery.level * 100))
        })
      })
    }

    // Check for biometric support
    if ("credentials" in navigator) {
      setIsBiometricEnabled(true)
    }

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleEmergencyToggle = (controlId: string) => {
    setEmergencyControls((prev) =>
      prev.map((control) =>
        control.id === controlId ? { ...control, enabled: !control.enabled } : control
      )
    )
  }

  const handleAlertAction = (alertId: string, action: QuickAction) => {
    action.action()
    setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
  }

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return <AlertOctagon className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "info":
        return <Bell className="h-5 w-5 text-blue-600" />
    }
  }

  const getAlertBgColor = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      case "info":
        return "bg-blue-50 border-blue-200"
    }
  }

  const quickActions: QuickAction[] = [
    {
      id: "lock-user",
      label: "Lock User",
      icon: <Lock className="h-5 w-5" />,
      action: () => console.log("Lock user"),
      variant: "destructive",
    },
    {
      id: "remove-content",
      label: "Remove Content",
      icon: <XCircle className="h-5 w-5" />,
      action: () => console.log("Remove content"),
      variant: "destructive",
    },
    {
      id: "approve-creator",
      label: "Approve Creator",
      icon: <UserCheck className="h-5 w-5" />,
      action: () => console.log("Approve creator"),
      variant: "default",
    },
    {
      id: "refresh-cache",
      label: "Refresh Cache",
      icon: <RefreshCw className="h-5 w-5" />,
      action: () => console.log("Refresh cache"),
      variant: "secondary",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <SheetHeader>
                  <SheetTitle>Admin Menu</SheetTitle>
                </SheetHeader>
                <nav className="mt-6 space-y-2">
                  <Link href="/admin/dashboard">
                    <Button variant="ghost" className="w-full justify-start">
                      <Home className="h-4 w-4 mr-2" />
                      Full Dashboard
                    </Button>
                  </Link>
                  <Link href="/admin/users">
                    <Button variant="ghost" className="w-full justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      User Management
                    </Button>
                  </Link>
                  <Link href="/admin/moderation">
                    <Button variant="ghost" className="w-full justify-start">
                      <Shield className="h-4 w-4 mr-2" />
                      Content Moderation
                    </Button>
                  </Link>
                  <Link href="/admin/analytics">
                    <Button variant="ghost" className="w-full justify-start">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-bold">Admin</h1>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center space-x-2">
            {isBiometricEnabled && (
              <Fingerprint className="h-4 w-4 text-green-600" />
            )}
            {isOnline ? (
              <Wifi className="h-4 w-4 text-green-600" />
            ) : (
              <WifiOff className="h-4 w-4 text-red-600" />
            )}
            {batteryLevel < 20 ? (
              <BatteryLow className="h-4 w-4 text-red-600" />
            ) : (
              <Battery className="h-4 w-4 text-gray-600" />
            )}
            <Badge variant="outline" className="text-xs">
              {batteryLevel}%
            </Badge>
          </div>
        </div>
      </header>

      {/* Quick Stats Bar */}
      <div className="bg-white border-b p-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-xs text-gray-500">Active Users</p>
              <p className="text-sm font-bold">{quickStats.activeUsers}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <div>
              <p className="text-xs text-gray-500">Pending</p>
              <p className="text-sm font-bold">{quickStats.pendingApprovals}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldAlert className="h-4 w-4 text-red-600" />
            <div>
              <p className="text-xs text-gray-500">Incidents</p>
              <p className="text-sm font-bold">{quickStats.activeIncidents}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <div>
              <p className="text-xs text-gray-500">24h Revenue</p>
              <p className="text-sm font-bold">${quickStats.revenue24h}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 rounded-none">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="alerts" className="text-xs relative">
            Alerts
            {alerts.filter(a => a.actionRequired).length > 0 && (
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-600 rounded-full" />
            )}
          </TabsTrigger>
          <TabsTrigger value="actions" className="text-xs">Actions</TabsTrigger>
          <TabsTrigger value="emergency" className="text-xs">Emergency</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="p-4 space-y-4">
          {/* Critical Alerts Summary */}
          {alerts.filter(a => a.type === "critical").length > 0 && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center space-x-2">
                  <AlertOctagon className="h-4 w-4 text-red-600" />
                  <span>Critical Alerts</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {alerts
                    .filter(a => a.type === "critical")
                    .slice(0, 2)
                    .map(alert => (
                      <div key={alert.id} className="text-sm">
                        <p className="font-medium">{alert.title}</p>
                        <p className="text-xs text-gray-600">{alert.message}</p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Activity */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <UserCheck className="h-4 w-4 text-green-600" />
                    <div>
                      <p className="text-sm font-medium">New Creator Approved</p>
                      <p className="text-xs text-gray-500">2 min ago</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Ban className="h-4 w-4 text-red-600" />
                    <div>
                      <p className="text-sm font-medium">User Account Locked</p>
                      <p className="text-xs text-gray-500">15 min ago</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Video className="h-4 w-4 text-purple-600" />
                    <div>
                      <p className="text-sm font-medium">Content Removed</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* System Health */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">System Health</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">API Response Time</span>
                  <Badge variant="outline" className="bg-green-50">
                    45ms
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Database Status</span>
                  <Badge variant="outline" className="bg-green-50">
                    Healthy
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">CDN Status</span>
                  <Badge variant="outline" className="bg-green-50">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Error Rate</span>
                  <Badge variant="outline" className="bg-yellow-50">
                    0.2%
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alerts" className="p-4">
          <MobileAlertManager
            onAlertAction={(alertId, actionId) => {
              console.log("Alert action:", alertId, actionId)
            }}
            onAlertRead={(alertId) => {
              console.log("Alert read:", alertId)
            }}
            onAlertAcknowledged={(alertId) => {
              console.log("Alert acknowledged:", alertId)
            }}
          />
        </TabsContent>

        <TabsContent value="actions" className="p-4">
          <MobileQuickActions
            gridCols={2}
            showCategories={true}
            showShortcuts={false}
            onActionComplete={(actionId, result) => {
              console.log("Action completed:", actionId, result)
            }}
          />
          
          {/* Biometric Authentication */}
          <div className="mt-6">
            <BiometricAuth
              showManagement={false}
              autoPrompt={false}
              onAuthSuccess={(credential) => {
                console.log("Biometric auth success:", credential)
              }}
              onAuthFailure={(error) => {
                console.log("Biometric auth failed:", error)
              }}
            />
          </div>
        </TabsContent>

        <TabsContent value="emergency" className="p-4">
          <EmergencyResponse
            onIncidentDeclared={(incident) => {
              console.log("Incident declared:", incident)
            }}
            onControlToggled={(controlId, enabled) => {
              console.log("Emergency control toggled:", controlId, enabled)
            }}
            onActionExecuted={(actionId) => {
              console.log("Emergency action executed:", actionId)
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-white p-3 text-center">
          <div className="flex items-center justify-center space-x-2">
            <WifiOff className="h-4 w-4" />
            <span className="text-sm font-medium">
              You are offline. Some features may be limited.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MobileAdmin() {
  return (
    <AuthGuard requireAuth requireRole="admin">
      <MobileAdminDashboard />
    </AuthGuard>
  )
}