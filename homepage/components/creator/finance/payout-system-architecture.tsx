"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  DollarSign,
  CreditCard,
  Building,
  Wallet,
  Clock,
  Calendar,
  Shield,
  AlertCircle,
  CheckCircle2,
  Timer,
  TrendingUp,
  Lock,
  Smartphone,
  Mail,
  FileText,
  Globe,
  Zap,
  Bitcoin,
  ChevronRight,
  Info,
  AlertTriangle,
  ShieldCheck,
  Key,
  Fingerprint,
  Eye,
  UserCheck,
  Activity,
  BanknoteIcon,
  CalendarCheck,
  Target,
  Settings,
  HelpCircle,
  ArrowRight,
  Check,
  X,
  Loader2,
  ExternalLink,
  Copy
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface PayoutMethod {
  id: string
  name: string
  icon: React.ReactNode
  speed: string
  fee: string
  minimum: number
  maximum: number | null
  bestFor: string
  available: boolean
  popular?: boolean
  verified?: boolean
}

interface ScheduleOption {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  frequency?: string
}

interface SecurityFeature {
  id: string
  name: string
  description: string
  status: "active" | "pending" | "inactive"
  required: boolean
}

export function PayoutSystemArchitecture() {
  const [selectedMethod, setSelectedMethod] = useState<string>("bank")
  const [selectedSchedule, setSelectedSchedule] = useState<string>("manual")
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [autoSchedule, setAutoSchedule] = useState({
    enabled: false,
    frequency: "weekly",
    day: "monday",
    threshold: 100
  })
  const [verificationStep, setVerificationStep] = useState(0)
  const [showSecurityModal, setShowSecurityModal] = useState(false)

  // Available balance
  const availableBalance = 3456.78

  // Payout methods
  const payoutMethods: PayoutMethod[] = [
    {
      id: "instant",
      name: "Instant Debit",
      icon: <Zap className="w-5 h-5" />,
      speed: "30 min",
      fee: "1.5%",
      minimum: 10,
      maximum: 5000,
      bestFor: "Urgent needs",
      available: true,
      popular: true
    },
    {
      id: "bank",
      name: "Bank Transfer",
      icon: <Building className="w-5 h-5" />,
      speed: "2-3 days",
      fee: "Free",
      minimum: 50,
      maximum: 10000,
      bestFor: "Regular income",
      available: true,
      verified: true
    },
    {
      id: "paypal",
      name: "PayPal",
      icon: <Wallet className="w-5 h-5" />,
      speed: "1 day",
      fee: "2%",
      minimum: 25,
      maximum: 5000,
      bestFor: "Flexibility",
      available: true
    },
    {
      id: "venmo",
      name: "Venmo",
      icon: <DollarSign className="w-5 h-5" />,
      speed: "1 day",
      fee: "1%",
      minimum: 20,
      maximum: 3000,
      bestFor: "Personal use",
      available: true
    },
    {
      id: "check",
      name: "Check",
      icon: <FileText className="w-5 h-5" />,
      speed: "5-7 days",
      fee: "$2",
      minimum: 100,
      maximum: null,
      bestFor: "Traditional",
      available: true
    },
    {
      id: "crypto",
      name: "Crypto",
      icon: <Bitcoin className="w-5 h-5" />,
      speed: "1 hour",
      fee: "Network fee",
      minimum: 50,
      maximum: null,
      bestFor: "International",
      available: false
    }
  ]

  // Schedule options
  const scheduleOptions: ScheduleOption[] = [
    {
      id: "manual",
      name: "Manual (On-Demand)",
      description: "Withdraw anytime you want",
      icon: <Clock className="w-5 h-5" />
    },
    {
      id: "daily",
      name: "Daily",
      description: "Every evening at 6 PM EST",
      icon: <Calendar className="w-5 h-5" />,
      frequency: "daily"
    },
    {
      id: "weekly",
      name: "Weekly",
      description: "Choose your preferred day",
      icon: <CalendarCheck className="w-5 h-5" />,
      frequency: "weekly"
    },
    {
      id: "biweekly",
      name: "Bi-Weekly",
      description: "Every two weeks",
      icon: <Calendar className="w-5 h-5" />,
      frequency: "biweekly"
    },
    {
      id: "monthly",
      name: "Monthly",
      description: "Pick a date each month",
      icon: <Calendar className="w-5 h-5" />,
      frequency: "monthly"
    },
    {
      id: "threshold",
      name: "Threshold-Based",
      description: "When balance reaches target",
      icon: <Target className="w-5 h-5" />,
      frequency: "threshold"
    }
  ]

  // Security features
  const securityFeatures: SecurityFeature[] = [
    {
      id: "identity",
      name: "Identity Verification",
      description: "Government ID and selfie verification",
      status: "active",
      required: true
    },
    {
      id: "bank",
      name: "Bank Account Verification",
      description: "Micro-deposits to verify ownership",
      status: "active",
      required: true
    },
    {
      id: "2fa",
      name: "Two-Factor Authentication",
      description: "SMS or app-based authentication",
      status: "active",
      required: false
    },
    {
      id: "limits",
      name: "Withdrawal Limits",
      description: "Daily and monthly limits for protection",
      status: "active",
      required: false
    },
    {
      id: "cooling",
      name: "Cooling Period",
      description: "24-hour delay for new payment methods",
      status: "pending",
      required: false
    },
    {
      id: "alerts",
      name: "Activity Alerts",
      description: "Email/SMS for withdrawals",
      status: "active",
      required: false
    },
    {
      id: "ip",
      name: "IP Monitoring",
      description: "Track unusual login locations",
      status: "active",
      required: false
    },
    {
      id: "device",
      name: "Device Fingerprinting",
      description: "Recognize trusted devices",
      status: "inactive",
      required: false
    }
  ]

  const selectedMethodData = payoutMethods.find(m => m.id === selectedMethod)
  const withdrawAmountNum = parseFloat(withdrawAmount) || 0
  const fee = selectedMethodData?.fee === "Free" ? 0 : 
              selectedMethodData?.fee === "$2" ? 2 :
              selectedMethodData?.fee.includes("%") ? 
                withdrawAmountNum * (parseFloat(selectedMethodData.fee) / 100) : 5
  const netAmount = withdrawAmountNum - fee

  const handleWithdraw = () => {
    setShowSecurityModal(true)
    setVerificationStep(1)
  }

  const simulateVerification = () => {
    setTimeout(() => {
      setVerificationStep(2)
      setTimeout(() => {
        setVerificationStep(3)
        setTimeout(() => {
          setVerificationStep(4)
        }, 1500)
      }, 1500)
    }, 1500)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Payout System</h2>
          <p className="text-gray-500">Flexible withdrawal options with enterprise-grade security</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Verified Account
          </Badge>
          <Badge variant="outline">
            Available: ${availableBalance.toFixed(2)}
          </Badge>
        </div>
      </div>

      {/* Withdrawal Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Withdrawal Method</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {payoutMethods.map((method) => (
              <motion.div
                key={method.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className={`relative border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedMethod === method.id
                      ? "border-purple-500 bg-purple-50"
                      : "hover:border-gray-400"
                  } ${!method.available ? "opacity-50" : ""}`}
                  onClick={() => method.available && setSelectedMethod(method.id)}
                >
                  {method.popular && (
                    <Badge className="absolute -top-2 -right-2 bg-orange-500">
                      Popular
                    </Badge>
                  )}
                  {method.verified && (
                    <Badge className="absolute -top-2 -right-2 bg-green-500">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      selectedMethod === method.id ? "bg-purple-100" : "bg-gray-100"
                    }`}>
                      {method.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold flex items-center gap-2">
                        {method.name}
                        {!method.available && (
                          <Badge variant="secondary" className="text-xs">
                            Coming Soon
                          </Badge>
                        )}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">{method.bestFor}</p>
                      
                      <div className="mt-3 space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Speed:</span>
                          <span className="font-medium">{method.speed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Fee:</span>
                          <span className={`font-medium ${
                            method.fee === "Free" ? "text-green-600" : ""
                          }`}>{method.fee}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Limits:</span>
                          <span className="font-medium">
                            ${method.minimum} - {method.maximum ? `$${method.maximum}` : "No limit"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Payout Scheduling */}
      <Card>
        <CardHeader>
          <CardTitle>Payout Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedSchedule} onValueChange={setSelectedSchedule}>
            <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
              {scheduleOptions.map((option) => (
                <TabsTrigger key={option.id} value={option.id}>
                  {option.name.split(" ")[0]}
                </TabsTrigger>
              ))}
            </TabsList>

            {scheduleOptions.map((option) => (
              <TabsContent key={option.id} value={option.id} className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      {option.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold">{option.name}</h3>
                      <p className="text-sm text-gray-600">{option.description}</p>
                    </div>
                  </div>

                  {option.id === "manual" && (
                    <Alert>
                      <Info className="w-4 h-4" />
                      <AlertDescription>
                        Withdraw funds whenever you need them. No automatic schedule.
                      </AlertDescription>
                    </Alert>
                  )}

                  {option.id === "weekly" && (
                    <div className="space-y-3">
                      <Label>Select Day of Week</Label>
                      <Select defaultValue="monday">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="monday">Monday</SelectItem>
                          <SelectItem value="tuesday">Tuesday</SelectItem>
                          <SelectItem value="wednesday">Wednesday</SelectItem>
                          <SelectItem value="thursday">Thursday</SelectItem>
                          <SelectItem value="friday">Friday</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {option.id === "monthly" && (
                    <div className="space-y-3">
                      <Label>Select Day of Month</Label>
                      <Select defaultValue="1">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1st</SelectItem>
                          <SelectItem value="15">15th</SelectItem>
                          <SelectItem value="last">Last day</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {option.id === "threshold" && (
                    <div className="space-y-3">
                      <Label>Minimum Balance Threshold</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">$</span>
                        <Input
                          type="number"
                          placeholder="100"
                          value={autoSchedule.threshold}
                          onChange={(e) => setAutoSchedule({
                            ...autoSchedule,
                            threshold: parseInt(e.target.value)
                          })}
                        />
                      </div>
                      <p className="text-sm text-gray-500">
                        Automatically withdraw when balance reaches this amount
                      </p>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={autoSchedule.enabled && option.id !== "manual"}
                        onCheckedChange={(checked) => setAutoSchedule({
                          ...autoSchedule,
                          enabled: checked
                        })}
                        disabled={option.id === "manual"}
                      />
                      <div>
                        <p className="font-medium">Enable Auto-Payout</p>
                        <p className="text-sm text-gray-500">
                          {option.id === "manual" 
                            ? "Not available for manual withdrawals"
                            : "Automatically process payouts on schedule"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Withdrawal Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Withdraw Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label>Amount to Withdraw</Label>
                <div className="relative mt-2">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xl font-semibold">
                    $
                  </span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="pl-8 text-2xl font-bold h-14"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    max={availableBalance}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-sm">
                  <span className="text-gray-500">Available: ${availableBalance.toFixed(2)}</span>
                  <Button
                    variant="link"
                    className="h-auto p-0"
                    onClick={() => setWithdrawAmount(availableBalance.toString())}
                  >
                    Withdraw All
                  </Button>
                </div>
              </div>

              {withdrawAmountNum > 0 && selectedMethodData && (
                <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span>Withdrawal Amount:</span>
                    <span>${withdrawAmountNum.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Processing Fee:</span>
                    <span className={fee === 0 ? "text-green-600" : ""}>
                      {fee === 0 ? "Free" : `-$${fee.toFixed(2)}`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>You'll Receive:</span>
                    <span className="text-green-600">${netAmount.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {withdrawAmountNum > 0 && selectedMethodData && (
                withdrawAmountNum < selectedMethodData.minimum ? (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      Minimum withdrawal for {selectedMethodData.name} is ${selectedMethodData.minimum}
                    </AlertDescription>
                  </Alert>
                ) : selectedMethodData.maximum && withdrawAmountNum > selectedMethodData.maximum ? (
                  <Alert className="border-red-200 bg-red-50">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      Maximum withdrawal for {selectedMethodData.name} is ${selectedMethodData.maximum}
                    </AlertDescription>
                  </Alert>
                ) : null
              )}

              <Button
                className="w-full"
                size="lg"
                onClick={handleWithdraw}
                disabled={
                  !withdrawAmountNum ||
                  !selectedMethodData ||
                  withdrawAmountNum < selectedMethodData.minimum ||
                  (selectedMethodData.maximum && withdrawAmountNum > selectedMethodData.maximum)
                }
              >
                <BanknoteIcon className="w-5 h-5 mr-2" />
                Withdraw ${withdrawAmountNum.toFixed(2)}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Security Features */}
        <Card>
          <CardHeader>
            <CardTitle>Security Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50"
                >
                  <div className={`mt-0.5 ${
                    feature.status === "active" ? "text-green-600" :
                    feature.status === "pending" ? "text-yellow-600" : "text-gray-400"
                  }`}>
                    {feature.status === "active" ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : feature.status === "pending" ? (
                      <Clock className="w-5 h-5" />
                    ) : (
                      <X className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{feature.name}</p>
                      {feature.required && (
                        <Badge variant="secondary" className="text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {feature.description}
                    </p>
                  </div>
                  {feature.status === "inactive" && (
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      Enable
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold text-purple-900">Security Score</h4>
              </div>
              <Progress value={75} className="h-2 mb-2" />
              <p className="text-xs text-purple-700">
                Your account security is strong. Enable device fingerprinting for maximum protection.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Verification Modal */}
      <AnimatePresence>
        {showSecurityModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => verificationStep === 4 && setShowSecurityModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">Security Verification</h3>
              
              <div className="space-y-4">
                {/* Step 1: Identity */}
                <div className={`flex items-center gap-3 p-3 rounded-lg ${
                  verificationStep >= 1 ? "bg-green-50" : "bg-gray-50"
                }`}>
                  {verificationStep > 1 ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : verificationStep === 1 ? (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">Identity Verification</p>
                    <p className="text-xs text-gray-500">Confirming your identity</p>
                  </div>
                </div>

                {/* Step 2: 2FA */}
                <div className={`flex items-center gap-3 p-3 rounded-lg ${
                  verificationStep >= 2 ? "bg-green-50" : "bg-gray-50"
                }`}>
                  {verificationStep > 2 ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : verificationStep === 2 ? (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-xs text-gray-500">Sending verification code</p>
                  </div>
                </div>

                {/* Step 3: Processing */}
                <div className={`flex items-center gap-3 p-3 rounded-lg ${
                  verificationStep >= 3 ? "bg-green-50" : "bg-gray-50"
                }`}>
                  {verificationStep > 3 ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : verificationStep === 3 ? (
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">Processing Withdrawal</p>
                    <p className="text-xs text-gray-500">Initiating transfer</p>
                  </div>
                </div>
              </div>

              {verificationStep === 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-green-50 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <h4 className="font-semibold text-green-900">Withdrawal Initiated!</h4>
                  </div>
                  <p className="text-sm text-green-700">
                    Your withdrawal of ${netAmount.toFixed(2)} has been successfully initiated.
                    You'll receive it within {selectedMethodData?.speed}.
                  </p>
                </motion.div>
              )}

              <div className="mt-6 flex gap-3">
                {verificationStep < 4 ? (
                  <>
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setShowSecurityModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={simulateVerification}
                      disabled={verificationStep > 0}
                    >
                      {verificationStep > 0 ? "Verifying..." : "Start Verification"}
                    </Button>
                  </>
                ) : (
                  <Button
                    className="w-full"
                    onClick={() => {
                      setShowSecurityModal(false)
                      setVerificationStep(0)
                      setWithdrawAmount("")
                    }}
                  >
                    Done
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Fix for Circle component
const Circle = ({ className }: { className?: string }) => (
  <div className={`rounded-full border-2 ${className}`} style={{ width: "20px", height: "20px" }} />
)