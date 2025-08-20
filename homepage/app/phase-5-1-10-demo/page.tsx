"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Smartphone,
  Tablet,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Fingerprint,
  Shield,
  Bell,
  Users,
  AlertTriangle,
  DollarSign,
  Video,
  TrendingUp,
  Lock,
  Unlock,
  Ban,
  UserCheck,
  XCircle,
  CheckCircle,
  RefreshCw,
  MessageSquare,
  Eye,
  Clock,
  Zap,
  Settings,
  Menu,
  Home,
  ArrowLeft,
  Activity,
  Server,
  Database,
  Globe,
  Power,
  PauseCircle,
  PlayCircle,
  ShieldAlert,
  AlertOctagon,
  FileWarning,
  Siren,
  Phone,
  Mail,
} from "lucide-react"
import Link from "next/link"

const mockAlerts = [
  {
    id: "1",
    type: "critical",
    title: "Suspicious Login Activity",
    message: "Multiple failed login attempts from IP 192.168.1.100",
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    actionRequired: true,
  },
  {
    id: "2", 
    type: "warning",
    title: "High CPU Usage",
    message: "Server CPU usage above 85% for 10 minutes",
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    actionRequired: false,
  },
  {
    id: "3",
    type: "info",
    title: "New Creator Application",
    message: "Sarah Williams has submitted a creator application",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    actionRequired: true,
  }
]

const quickActions = [
  { id: "lock-user", label: "Lock User", icon: <Lock className="h-5 w-5" />, variant: "destructive" },
  { id: "approve-creator", label: "Approve Creator", icon: <UserCheck className="h-5 w-5" />, variant: "default" },
  { id: "remove-content", label: "Remove Content", icon: <XCircle className="h-5 w-5" />, variant: "destructive" },
  { id: "refresh-cache", label: "Refresh Cache", icon: <RefreshCw className="h-5 w-5" />, variant: "secondary" },
]

const emergencyControls = [
  {
    id: "maintenance-mode",
    name: "Maintenance Mode", 
    description: "Enable platform-wide maintenance mode",
    enabled: false,
    critical: true,
  },
  {
    id: "freeze-payments",
    name: "Freeze Payments",
    description: "Stop all payment processing",
    enabled: false,
    critical: true,
  },
  {
    id: "disable-uploads",
    name: "Disable Uploads",
    description: "Prevent new video uploads",
    enabled: false,
    critical: false,
  }
]

export default function Phase5110Demo() {
  const [selectedTab, setSelectedTab] = useState("overview")
  const [isOnline, setIsOnline] = useState(true)
  const [batteryLevel, setBatteryLevel] = useState(85)
  const [isBiometricEnabled, setIsBiometricEnabled] = useState(true)
  const [controls, setControls] = useState(emergencyControls)
  const [deviceView, setDeviceView] = useState<"mobile" | "tablet">("mobile")

  // Simulate device status changes
  useEffect(() => {
    const interval = setInterval(() => {
      setBatteryLevel(prev => Math.max(20, prev - Math.random() * 2))
      setIsOnline(prev => Math.random() > 0.1 ? true : prev) // 90% chance to stay online
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleEmergencyToggle = (controlId: string) => {
    setControls(prev =>
      prev.map(control =>
        control.id === controlId ? { ...control, enabled: !control.enabled } : control
      )
    )
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical": return <AlertOctagon className="h-5 w-5 text-red-600" />
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case "info": return <Bell className="h-5 w-5 text-blue-600" />
      default: return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getAlertBgColor = (type: string) => {
    switch (type) {
      case "critical": return "bg-red-50 border-red-200"
      case "warning": return "bg-yellow-50 border-yellow-200"
      case "info": return "bg-blue-50 border-blue-200"
      default: return "bg-gray-50 border-gray-200"
    }
  }

  const DeviceFrame = ({ children }: { children: React.ReactNode }) => (
    <div className={`
      mx-auto border-4 border-gray-800 rounded-3xl overflow-hidden bg-black
      ${deviceView === "mobile" ? "w-80 h-[640px]" : "w-96 h-[600px]"}
      shadow-2xl relative
    `}>
      {/* Device status bar */}
      <div className="bg-black text-white text-xs p-2 flex justify-between items-center">
        <span>9:41 AM</span>
        <div className="flex items-center space-x-1">
          {isOnline ? (
            <Wifi className="h-3 w-3" />
          ) : (
            <WifiOff className="h-3 w-3 text-red-400" />
          )}
          {batteryLevel < 20 ? (
            <BatteryLow className="h-3 w-3 text-red-400" />
          ) : (
            <Battery className="h-3 w-3" />
          )}
          <span>{Math.round(batteryLevel)}%</span>
        </div>
      </div>
      
      {/* Device content */}
      <div className="bg-white h-full overflow-auto">
        {children}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
              <Smartphone className="h-8 w-8 text-blue-600" />
              <span>Phase 5.1.10 Demo - Mobile Admin Experience</span>
            </h1>
            <p className="text-gray-600 mt-2">Essential administrative functions optimized for mobile devices</p>
          </div>
          <div className="flex space-x-2">
            <Link href="/phase-5-1-9-demo">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Phase 5.1.9 Demo
              </Button>
            </Link>
            <Button
              variant={deviceView === "mobile" ? "default" : "outline"}
              onClick={() => setDeviceView("mobile")}
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Mobile View
            </Button>
            <Button
              variant={deviceView === "tablet" ? "default" : "outline"}
              onClick={() => setDeviceView("tablet")}
            >
              <Tablet className="h-4 w-4 mr-2" />
              Tablet View
            </Button>
          </div>
        </div>

        {/* Demo Features Overview */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Fingerprint className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium">Biometric Auth</p>
                  <p className="text-sm text-gray-600">Touch/Face ID support</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Wifi className="h-6 w-6 text-blue-600" />
                <div>
                  <p className="font-medium">Offline Mode</p>
                  <p className="text-sm text-gray-600">Works without internet</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <Zap className="h-6 w-6 text-yellow-600" />
                <div>
                  <p className="font-medium">Quick Actions</p>
                  <p className="text-sm text-gray-600">One-tap admin tasks</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <ShieldAlert className="h-6 w-6 text-red-600" />
                <div>
                  <p className="font-medium">Emergency</p>
                  <p className="text-sm text-gray-600">Crisis management</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Device Simulation */}
      <div className="flex justify-center">
        <DeviceFrame>
          <div className="h-full bg-gray-50">
            {/* Mobile Header */}
            <header className="sticky top-0 z-50 bg-white border-b">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center space-x-3">
                  <Menu className="h-5 w-5" />
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
                  <Badge variant="outline" className="text-xs">
                    {Math.round(batteryLevel)}%
                  </Badge>
                </div>
              </div>
            </header>

            {/* Quick Stats */}
            <div className="bg-white border-b p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-500">Active Users</p>
                    <p className="text-sm font-bold">1,247</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <div>
                    <p className="text-xs text-gray-500">Alerts</p>
                    <p className="text-sm font-bold">{mockAlerts.filter(a => a.actionRequired).length}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldAlert className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="text-xs text-gray-500">Incidents</p>
                    <p className="text-sm font-bold">0</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="text-sm font-bold">$4.5K</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1">
              <div className="sticky top-[120px] bg-white z-40">
                <div className="grid grid-cols-4 border-b">
                  <button
                    className={`p-3 text-xs font-medium ${
                      selectedTab === "overview" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"
                    }`}
                    onClick={() => setSelectedTab("overview")}
                  >
                    Overview
                  </button>
                  <button
                    className={`p-3 text-xs font-medium relative ${
                      selectedTab === "alerts" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"
                    }`}
                    onClick={() => setSelectedTab("alerts")}
                  >
                    Alerts
                    {mockAlerts.filter(a => a.actionRequired).length > 0 && (
                      <span className="absolute top-1 right-1 h-2 w-2 bg-red-600 rounded-full" />
                    )}
                  </button>
                  <button
                    className={`p-3 text-xs font-medium ${
                      selectedTab === "actions" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"
                    }`}
                    onClick={() => setSelectedTab("actions")}
                  >
                    Actions
                  </button>
                  <button
                    className={`p-3 text-xs font-medium ${
                      selectedTab === "emergency" ? "border-b-2 border-blue-500 text-blue-600" : "text-gray-600"
                    }`}
                    onClick={() => setSelectedTab("emergency")}
                  >
                    Emergency
                  </button>
                </div>
              </div>

              {/* Overview Tab */}
              {selectedTab === "overview" && (
                <div className="p-4 space-y-4">
                  {/* System Health */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">System Health</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">API Response</span>
                          <Badge variant="outline" className="bg-green-50 text-xs">45ms</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Database</span>
                          <Badge variant="outline" className="bg-green-50 text-xs">Healthy</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">CDN Status</span>
                          <Badge variant="outline" className="bg-green-50 text-xs">Active</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <UserCheck className="h-4 w-4 text-green-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Creator Approved</p>
                            <p className="text-xs text-gray-500">2 min ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Ban className="h-4 w-4 text-red-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">User Locked</p>
                            <p className="text-xs text-gray-500">15 min ago</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Video className="h-4 w-4 text-purple-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium">Content Removed</p>
                            <p className="text-xs text-gray-500">1 hour ago</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* PWA Features */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Mobile Features</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Fingerprint className="h-4 w-4 text-blue-600" />
                            <span className="text-sm">Biometric Auth</span>
                          </div>
                          <Switch checked={isBiometricEnabled} onCheckedChange={setIsBiometricEnabled} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Bell className="h-4 w-4 text-yellow-600" />
                            <span className="text-sm">Push Notifications</span>
                          </div>
                          <Switch checked={true} />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Database className="h-4 w-4 text-green-600" />
                            <span className="text-sm">Offline Mode</span>
                          </div>
                          <Switch checked={!isOnline} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Alerts Tab */}
              {selectedTab === "alerts" && (
                <div className="p-4 space-y-3">
                  {mockAlerts.map((alert) => (
                    <Card key={alert.id} className={`border ${getAlertBgColor(alert.type)}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          {getAlertIcon(alert.type)}
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h3 className="font-medium text-sm">{alert.title}</h3>
                              <span className="text-xs text-gray-500">
                                {Math.round((Date.now() - alert.timestamp.getTime()) / 60000)}m
                              </span>
                            </div>
                            <p className="text-xs text-gray-600 mb-3">{alert.message}</p>
                            {alert.actionRequired && (
                              <div className="flex space-x-2">
                                <Button size="sm" className="text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Resolve
                                </Button>
                                <Button size="sm" variant="outline" className="text-xs">
                                  <Eye className="h-3 w-3 mr-1" />
                                  View
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {/* Actions Tab */}
              {selectedTab === "actions" && (
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {quickActions.map((action) => (
                      <Button
                        key={action.id}
                        variant={action.variant as any}
                        className="h-20 flex-col space-y-2"
                      >
                        {action.icon}
                        <span className="text-xs">{action.label}</span>
                      </Button>
                    ))}
                  </div>

                  {/* Biometric Auth Demo */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm flex items-center space-x-2">
                        <Fingerprint className="h-4 w-4 text-blue-600" />
                        <span>Biometric Authentication</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Touch ID</span>
                          <Badge variant="outline" className="bg-green-50">Active</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Face ID</span>
                          <Badge variant="outline" className="bg-green-50">Available</Badge>
                        </div>
                        <Button size="sm" className="w-full">
                          <Fingerprint className="h-4 w-4 mr-2" />
                          Authenticate
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Emergency Tab */}
              {selectedTab === "emergency" && (
                <div className="p-4 space-y-4">
                  <Card className="border-red-200 bg-red-50">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2 text-red-600">
                        <ShieldAlert className="h-5 w-5" />
                        <span className="text-sm font-medium">
                          Emergency controls affect all users
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-3">
                    {controls.map((control) => (
                      <Card
                        key={control.id}
                        className={
                          control.enabled && control.critical
                            ? "border-red-500 bg-red-50"
                            : control.enabled
                            ? "border-yellow-500 bg-yellow-50"
                            : ""
                        }
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-medium text-sm">{control.name}</h3>
                                {control.critical && (
                                  <Badge variant="destructive" className="text-xs">Critical</Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-600">{control.description}</p>
                            </div>
                            <Switch
                              checked={control.enabled}
                              onCheckedChange={() => handleEmergencyToggle(control.id)}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Emergency Actions */}
                  <div className="space-y-3">
                    <Button variant="destructive" className="w-full">
                      <Power className="h-4 w-4 mr-2" />
                      Emergency Shutdown
                    </Button>
                    <Button variant="outline" className="w-full">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Restart Services
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Siren className="h-4 w-4 mr-2" />
                      Declare Incident
                    </Button>
                  </div>

                  {/* Emergency Contacts */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Emergency Contacts</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">Jean Baptiste</p>
                            <p className="text-xs text-gray-500">CTO</p>
                          </div>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Phone className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">Marie Celeste</p>
                            <p className="text-xs text-gray-500">DevOps Lead</p>
                          </div>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Phone className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Mail className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </Tabs>

            {/* Offline Indicator */}
            {!isOnline && (
              <div className="fixed bottom-0 left-0 right-0 bg-yellow-500 text-white p-2 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <WifiOff className="h-4 w-4" />
                  <span className="text-sm">Offline Mode - Limited features</span>
                </div>
              </div>
            )}
          </div>
        </DeviceFrame>
      </div>

      {/* Feature Highlights */}
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Smartphone className="h-5 w-5" />
              <span>Touch-Optimized</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Large touch targets (44px minimum)</li>
              <li>• Swipe gestures for navigation</li>
              <li>• Haptic feedback support</li>
              <li>• One-handed operation mode</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Security Features</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Biometric authentication</li>
              <li>• Encrypted local storage</li>
              <li>• Session timeout protection</li>
              <li>• Device registration</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Wifi className="h-5 w-5" />
              <span>Offline Capabilities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li>• Critical data cached locally</li>
              <li>• Actions queued for sync</li>
              <li>• Emergency functions offline</li>
              <li>• Progressive Web App</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-8 p-4 border-t bg-white rounded-lg">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <span className="font-medium">Phase 5.1.10 Demo</span> - Mobile Admin Experience
          </div>
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>PWA Ready</span>
            </div>
            <div className="flex items-center space-x-1">
              <Activity className="h-4 w-4" />
              <span>Real-time Updates</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}