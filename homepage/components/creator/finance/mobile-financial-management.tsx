"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Smartphone,
  DollarSign,
  CreditCard,
  Wallet,
  Target,
  BarChart3,
  FileText,
  Fingerprint,
  Lock,
  Shield,
  Bell,
  Zap,
  TrendingUp,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  Plus,
  Minus,
  Home,
  User,
  Settings,
  LogOut,
  RefreshCw,
  Download,
  Upload,
  Share2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Info,
  Clock,
  Calendar,
  Receipt,
  Send,
  Inbox,
  Gift,
  ShoppingCart,
  Package,
  Car,
  Coffee,
  Music,
  Camera,
  Heart,
  Star,
  Award,
  Trophy,
  Flag,
  Bookmark,
  Hash,
  Percent,
  Activity,
  Wifi,
  WifiOff,
  Battery,
  BatteryCharging,
  Sun,
  Moon,
  QrCode,
  ScanLine,
  Vibrate,
  Volume2,
  VolumeX,
  MessageSquare,
  Mail,
  Phone,
  Video,
  Mic,
  MicOff,
  Headphones,
  Monitor,
  Tablet,
  Watch,
  Navigation,
  MapPin,
  Compass,
  Globe
} from "lucide-react"
import { motion, AnimatePresence, PanInfo } from "framer-motion"
import { cn } from "@/lib/utils"

interface Transaction {
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  date: Date
  category: string
  icon: React.ReactNode
}

interface Goal {
  id: string
  title: string
  current: number
  target: number
  deadline: Date
  color: string
}

interface QuickAction {
  id: string
  title: string
  icon: React.ReactNode
  action: () => void
  color: string
}

export function MobileFinancialManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [showPin, setShowPin] = useState(false)
  const [pin, setPin] = useState("")
  const [selectedTab, setSelectedTab] = useState("home")
  const [balance, setBalance] = useState(33135.50)
  const [isBalanceVisible, setIsBalanceVisible] = useState(true)
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
  const [isOffline, setIsOffline] = useState(false)
  const [lastSync, setLastSync] = useState(new Date())
  const [biometricEnabled, setBiometricEnabled] = useState(true)
  const [notifications, setNotifications] = useState(true)
  const [quickActionsEnabled, setQuickActionsEnabled] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [deviceRegistered, setDeviceRegistered] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState(5) // minutes
  const [emergencyLock, setEmergencyLock] = useState(false)

  // Fixed date for consistency
  const currentDate = new Date("2024-12-27T00:00:00.000Z")

  // Mock transactions
  const transactions: Transaction[] = [
    {
      id: "1",
      type: "income",
      amount: 150,
      description: "Birthday video - Marie J.",
      date: new Date("2024-12-27T00:00:00.000Z"),
      category: "Video Message",
      icon: <Video className="w-4 h-4" />
    },
    {
      id: "2",
      type: "expense",
      amount: 30,
      description: "Platform fee",
      date: new Date("2024-12-26T00:00:00.000Z"),
      category: "Fees",
      icon: <Receipt className="w-4 h-4" />
    },
    {
      id: "3",
      type: "income",
      amount: 300,
      description: "Business shoutout - Tech Co.",
      date: new Date("2024-12-26T00:00:00.000Z"),
      category: "Business",
      icon: <Briefcase className="w-4 h-4" />
    },
    {
      id: "4",
      type: "income",
      amount: 75,
      description: "Holiday greeting - Paul R.",
      date: new Date("2024-12-25T00:00:00.000Z"),
      category: "Holiday",
      icon: <Gift className="w-4 h-4" />
    },
    {
      id: "5",
      type: "expense",
      amount: 89,
      description: "Ring light purchase",
      date: new Date("2024-12-24T00:00:00.000Z"),
      category: "Equipment",
      icon: <Camera className="w-4 h-4" />
    }
  ]

  // Mock goals
  const goals: Goal[] = [
    {
      id: "1",
      title: "Monthly Target",
      current: 11250,
      target: 15000,
      deadline: new Date("2024-12-31T00:00:00.000Z"),
      color: "purple"
    },
    {
      id: "2",
      title: "Emergency Fund",
      current: 4500,
      target: 10000,
      deadline: new Date("2025-06-30T00:00:00.000Z"),
      color: "blue"
    },
    {
      id: "3",
      title: "Equipment Fund",
      current: 800,
      target: 2000,
      deadline: new Date("2025-03-31T00:00:00.000Z"),
      color: "green"
    }
  ]

  // Quick actions
  const quickActions: QuickAction[] = [
    {
      id: "1",
      title: "Withdraw",
      icon: <ArrowUp className="w-5 h-5" />,
      action: () => console.log("Withdraw"),
      color: "blue"
    },
    {
      id: "2",
      title: "Deposit",
      icon: <ArrowDown className="w-5 h-5" />,
      action: () => console.log("Deposit"),
      color: "green"
    },
    {
      id: "3",
      title: "Goals",
      icon: <Target className="w-5 h-5" />,
      action: () => setSelectedTab("goals"),
      color: "purple"
    },
    {
      id: "4",
      title: "Reports",
      icon: <FileText className="w-5 h-5" />,
      action: () => setSelectedTab("reports"),
      color: "orange"
    }
  ]

  // Simulate biometric authentication
  const handleBiometricAuth = () => {
    // Simulate fingerprint/face recognition
    setTimeout(() => {
      setIsAuthenticated(true)
    }, 1000)
  }

  // Handle PIN entry
  const handlePinEntry = (digit: string) => {
    if (pin.length < 4) {
      const newPin = pin + digit
      setPin(newPin)
      if (newPin.length === 4) {
        // Verify PIN (mock)
        if (newPin === "1234") {
          setIsAuthenticated(true)
          setPin("")
        } else {
          setPin("")
          // Show error
        }
      }
    }
  }

  // Handle swipe gestures
  const handleSwipe = (e: any, info: PanInfo) => {
    if (info.offset.x > 100) {
      // Swipe right - go to previous tab
      const tabs = ["home", "transactions", "goals", "reports", "settings"]
      const currentIndex = tabs.indexOf(selectedTab)
      if (currentIndex > 0) {
        setSelectedTab(tabs[currentIndex - 1])
      }
    } else if (info.offset.x < -100) {
      // Swipe left - go to next tab
      const tabs = ["home", "transactions", "goals", "reports", "settings"]
      const currentIndex = tabs.indexOf(selectedTab)
      if (currentIndex < tabs.length - 1) {
        setSelectedTab(tabs[currentIndex + 1])
      }
    }
  }

  // Calculate goal progress
  const calculateProgress = (current: number, target: number) => {
    return Math.min(100, Math.round((current / target) * 100))
  }

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // Session timeout
  useEffect(() => {
    if (!isAuthenticated) return

    const timeout = setTimeout(() => {
      setIsAuthenticated(false)
      setPin("")
    }, sessionTimeout * 60 * 1000)

    return () => clearTimeout(timeout)
  }, [isAuthenticated, sessionTimeout])

  if (emergencyLock) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <Lock className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-xl font-bold">Emergency Lock Active</h2>
              <p className="text-sm text-gray-600">
                Your account has been locked for security. Please contact support to unlock.
              </p>
              <Button variant="outline" className="w-full">
                <Phone className="w-4 h-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-100 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-center">Ann Pale Finance</CardTitle>
          </CardHeader>
          <CardContent>
            {!showPin ? (
              <div className="space-y-6">
                {/* Biometric Auth */}
                {biometricEnabled && (
                  <div className="text-center space-y-4">
                    <button
                      onClick={handleBiometricAuth}
                      className="mx-auto w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                    >
                      <Fingerprint className="w-12 h-12 text-white" />
                    </button>
                    <p className="text-sm text-gray-600">Touch to authenticate</p>
                  </div>
                )}

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or</span>
                  </div>
                </div>

                {/* PIN Option */}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowPin(true)}
                >
                  <Hash className="w-4 h-4 mr-2" />
                  Enter PIN
                </Button>

                {/* Device Info */}
                <div className="text-center text-xs text-gray-500">
                  {deviceRegistered ? (
                    <div className="flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      <span>Device registered</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1">
                      <AlertCircle className="w-3 h-3 text-yellow-500" />
                      <span>New device detected</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* PIN Entry */}
                <div className="text-center space-y-4">
                  <p className="text-sm text-gray-600">Enter your 4-digit PIN</p>
                  <div className="flex justify-center gap-2">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={cn(
                          "w-12 h-12 border-2 rounded-lg flex items-center justify-center",
                          pin.length > i ? "border-purple-500 bg-purple-50" : "border-gray-300"
                        )}
                      >
                        {pin.length > i && (
                          <div className="w-3 h-3 bg-purple-500 rounded-full" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Number Pad */}
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <Button
                      key={num}
                      variant="outline"
                      className="h-14 text-lg"
                      onClick={() => handlePinEntry(num.toString())}
                    >
                      {num}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    className="h-14"
                    onClick={() => setShowPin(false)}
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="outline"
                    className="h-14 text-lg"
                    onClick={() => handlePinEntry("0")}
                  >
                    0
                  </Button>
                  <Button
                    variant="outline"
                    className="h-14"
                    onClick={() => setPin(pin.slice(0, -1))}
                  >
                    <Delete className="w-5 h-5" />
                  </Button>
                </div>

                {/* Forgot PIN */}
                <div className="text-center">
                  <Button variant="link" className="text-xs">
                    Forgot PIN?
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={cn("min-h-screen", darkMode ? "dark bg-gray-900" : "bg-gray-50")}>
      {/* Status Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-2">
        <div className="flex justify-between items-center text-xs">
          <div className="flex items-center gap-2">
            <Smartphone className="w-3 h-3" />
            <span>Ann Pale</span>
            {isOffline && (
              <Badge variant="secondary" className="text-xs">
                <WifiOff className="w-3 h-3 mr-1" />
                Offline
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {notifications && <Bell className="w-3 h-3" />}
            <Battery className="w-3 h-3" />
            <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleSwipe}
        className="flex-1"
      >
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          {/* Tab Content */}
          <div className="min-h-[calc(100vh-8rem)]">
            {/* Home Tab */}
            <TabsContent value="home" className="mt-0 p-4 space-y-4">
              {/* Balance Card */}
              <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-sm opacity-90">Available Balance</p>
                      <div className="flex items-center gap-2 mt-1">
                        <h2 className="text-3xl font-bold">
                          {isBalanceVisible ? formatCurrency(balance) : "••••••"}
                        </h2>
                        <button onClick={() => setIsBalanceVisible(!isBalanceVisible)}>
                          {isBalanceVisible ? (
                            <EyeOff className="w-5 h-5 opacity-70" />
                          ) : (
                            <Eye className="w-5 h-5 opacity-70" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-white/20 text-white">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +8.4%
                      </Badge>
                      <p className="text-xs mt-1 opacity-70">This month</p>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/20">
                    <div>
                      <p className="text-xs opacity-70">Income</p>
                      <p className="font-semibold">+{formatCurrency(525)}</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-70">Expenses</p>
                      <p className="font-semibold">-{formatCurrency(119)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              {quickActionsEnabled && (
                <div>
                  <h3 className="font-semibold mb-3">Quick Actions</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {quickActions.map((action) => (
                      <button
                        key={action.id}
                        onClick={action.action}
                        className="flex flex-col items-center gap-2 p-3 bg-white rounded-xl border hover:shadow-md transition-shadow"
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          action.color === "blue" && "bg-blue-100 text-blue-600",
                          action.color === "green" && "bg-green-100 text-green-600",
                          action.color === "purple" && "bg-purple-100 text-purple-600",
                          action.color === "orange" && "bg-orange-100 text-orange-600"
                        )}>
                          {action.icon}
                        </div>
                        <span className="text-xs">{action.title}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Recent Transactions */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold">Recent Activity</h3>
                  <Button variant="link" size="sm" onClick={() => setSelectedTab("transactions")}>
                    View all
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <Card>
                  <CardContent className="p-0">
                    {transactions.slice(0, 3).map((transaction, index) => (
                      <div
                        key={transaction.id}
                        className={cn(
                          "flex items-center justify-between p-4",
                          index < 2 && "border-b"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                          )}>
                            {transaction.icon}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-gray-500">{transaction.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "font-semibold",
                            transaction.type === "income" ? "text-green-600" : "text-red-600"
                          )}>
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-xs text-gray-500">Today</p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="mt-0">
              <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="p-4 space-y-3">
                  <h3 className="font-semibold mb-3">All Transactions</h3>
                  {transactions.map((transaction) => (
                    <motion.div
                      key={transaction.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-white rounded-lg border p-4"
                      onClick={() => setSelectedTransaction(transaction)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center",
                            transaction.type === "income" ? "bg-green-100" : "bg-red-100"
                          )}>
                            {transaction.icon}
                          </div>
                          <div>
                            <p className="font-medium text-sm">{transaction.description}</p>
                            <p className="text-xs text-gray-500">{transaction.category}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn(
                            "font-semibold",
                            transaction.type === "income" ? "text-green-600" : "text-red-600"
                          )}>
                            {transaction.type === "income" ? "+" : "-"}
                            {formatCurrency(transaction.amount)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {transaction.date.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Goals Tab */}
            <TabsContent value="goals" className="mt-0 p-4 space-y-4">
              <h3 className="font-semibold mb-3">Financial Goals</h3>
              {goals.map((goal) => {
                const progress = calculateProgress(goal.current, goal.target)
                return (
                  <Card key={goal.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">{goal.title}</h4>
                          <p className="text-sm text-gray-500">
                            Due {goal.deadline.toLocaleDateString()}
                          </p>
                        </div>
                        <Badge variant="outline">{progress}%</Badge>
                      </div>
                      <Progress value={progress} className="h-3 mb-2" />
                      <div className="flex justify-between text-sm">
                        <span>{formatCurrency(goal.current)}</span>
                        <span className="text-gray-500">{formatCurrency(goal.target)}</span>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              <Button className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add New Goal
              </Button>
            </TabsContent>

            {/* Reports Tab */}
            <TabsContent value="reports" className="mt-0 p-4 space-y-4">
              <h3 className="font-semibold mb-3">Reports</h3>
              <Alert>
                <Info className="w-4 h-4" />
                <AlertDescription>
                  Full report generation is available on desktop. You can view and download existing reports here.
                </AlertDescription>
              </Alert>
              
              <div className="space-y-3">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">December Report</h4>
                        <p className="text-sm text-gray-500">Generated Dec 1, 2024</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Q4 Summary</h4>
                        <p className="text-sm text-gray-500">Generated Oct 1, 2024</p>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="mt-0 p-4 space-y-4">
              <h3 className="font-semibold mb-3">Settings</h3>
              
              <Card>
                <CardContent className="p-0">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between p-4 border-b">
                      <div className="flex items-center gap-3">
                        <Fingerprint className="w-5 h-5 text-gray-500" />
                        <span className="text-sm">Biometric Login</span>
                      </div>
                      <Switch checked={biometricEnabled} onCheckedChange={setBiometricEnabled} />
                    </div>
                    <div className="flex items-center justify-between p-4 border-b">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-gray-500" />
                        <span className="text-sm">Notifications</span>
                      </div>
                      <Switch checked={notifications} onCheckedChange={setNotifications} />
                    </div>
                    <div className="flex items-center justify-between p-4 border-b">
                      <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-gray-500" />
                        <span className="text-sm">Quick Actions</span>
                      </div>
                      <Switch checked={quickActionsEnabled} onCheckedChange={setQuickActionsEnabled} />
                    </div>
                    <div className="flex items-center justify-between p-4 border-b">
                      <div className="flex items-center gap-3">
                        <Moon className="w-5 h-5 text-gray-500" />
                        <span className="text-sm">Dark Mode</span>
                      </div>
                      <Switch checked={darkMode} onCheckedChange={setDarkMode} />
                    </div>
                    <div className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-gray-500" />
                        <div>
                          <span className="text-sm">Session Timeout</span>
                          <p className="text-xs text-gray-500">{sessionTimeout} minutes</p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <Button 
                    variant="destructive" 
                    className="w-full"
                    onClick={() => setEmergencyLock(true)}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Emergency Lock
                  </Button>
                </CardContent>
              </Card>

              <div className="text-center pt-4">
                <Button 
                  variant="link" 
                  className="text-red-600"
                  onClick={() => setIsAuthenticated(false)}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </TabsContent>
          </div>

          {/* Bottom Navigation */}
          <TabsList className="fixed bottom-0 left-0 right-0 h-16 rounded-none border-t bg-white grid grid-cols-5">
            <TabsTrigger value="home" className="flex flex-col gap-1 h-full">
              <Home className="w-5 h-5" />
              <span className="text-xs">Home</span>
            </TabsTrigger>
            <TabsTrigger value="transactions" className="flex flex-col gap-1 h-full">
              <Receipt className="w-5 h-5" />
              <span className="text-xs">Activity</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex flex-col gap-1 h-full">
              <Target className="w-5 h-5" />
              <span className="text-xs">Goals</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex flex-col gap-1 h-full">
              <BarChart3 className="w-5 h-5" />
              <span className="text-xs">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex flex-col gap-1 h-full">
              <Settings className="w-5 h-5" />
              <span className="text-xs">Settings</span>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </motion.div>

      {/* Offline Indicator */}
      {isOffline && (
        <div className="fixed top-12 left-4 right-4 z-50">
          <Alert className="bg-yellow-50 border-yellow-200">
            <WifiOff className="w-4 h-4" />
            <AlertDescription>
              You're offline. Data will sync when connection is restored.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Last Sync Info */}
      {isOffline && (
        <div className="fixed bottom-20 left-4 right-4 text-center">
          <p className="text-xs text-gray-500">
            Last synced: {lastSync.toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  )
}

// Add missing icons
const Briefcase = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const Delete = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
  </svg>
)