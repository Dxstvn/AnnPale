"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Wallet,
  DollarSign,
  BanknoteIcon,
  CreditCard,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  ChevronLeft,
  Plus,
  Calendar,
  TrendingUp,
  Info,
  Shield,
  Zap
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

// Currency formatter
const formatCurrency = (amount: number, locale: string = 'en') => {
  const currency = locale === 'ht' ? 'HTG' : locale === 'fr' ? 'EUR' : 'USD'
  const formatter = new Intl.NumberFormat(locale === 'ht' ? 'ht-HT' : locale === 'fr' ? 'fr-FR' : 'en-US', {
    style: 'currency',
    currency: currency,
  })
  return formatter.format(amount)
}

// Translations
const payoutTranslations: Record<string, Record<string, string>> = {
  payout_management: {
    en: "Payout Management",
    fr: "Gestion des paiements",
    ht: "Jesyon peman"
  },
  manage_withdrawals: {
    en: "Manage your withdrawals and payout settings",
    fr: "Gérez vos retraits et paramètres de paiement",
    ht: "Jere retrè ak paramèt peman ou"
  },
  request_payout: {
    en: "Request Payout",
    fr: "Demander un paiement",
    ht: "Mande peman"
  },
  payout_schedule: {
    en: "Payout Schedule",
    fr: "Calendrier des paiements",
    ht: "Orè peman"
  },
  minimum_payout: {
    en: "Minimum Payout",
    fr: "Paiement minimum",
    ht: "Peman minimòm"
  },
  instant_payout: {
    en: "Instant Payout",
    fr: "Paiement instantané",
    ht: "Peman rapid"
  },
  scheduled_payout: {
    en: "Scheduled Payout",
    fr: "Paiement programmé",
    ht: "Peman pwograme"
  },
  payout_history: {
    en: "Payout History",
    fr: "Historique des paiements",
    ht: "Istwa peman"
  },
  payout_settings: {
    en: "Payout Settings",
    fr: "Paramètres de paiement",
    ht: "Paramèt peman"
  },
  select_amount: {
    en: "Select Amount",
    fr: "Sélectionner le montant",
    ht: "Chwazi kantite"
  },
  processing_time: {
    en: "Processing Time",
    fr: "Temps de traitement",
    ht: "Tan pwosesis"
  },
  fee: {
    en: "Fee",
    fr: "Frais",
    ht: "Frè"
  }
}

// Mock data
const availableBalance = 1875.50
const pendingPayouts = 420.75

const payoutHistory = [
  {
    id: "PAY-001",
    date: "2024-12-08",
    amount: 500.00,
    method: "Chase ****1234",
    status: "completed" as const,
    fee: 0,
    processingTime: "1 day"
  },
  {
    id: "PAY-002",
    date: "2024-12-01",
    amount: 650.00,
    method: "Chase ****1234",
    status: "completed" as const,
    fee: 0,
    processingTime: "1 day"
  },
  {
    id: "PAY-003",
    date: "2024-11-24",
    amount: 420.00,
    method: "PayPal",
    status: "completed" as const,
    fee: 2.50,
    processingTime: "Instant"
  },
  {
    id: "PAY-004",
    date: "2024-11-17",
    amount: 380.00,
    method: "Visa ****5678",
    status: "processing" as const,
    fee: 5.00,
    processingTime: "Instant"
  }
]

const paymentMethods = [
  {
    id: "1",
    type: "bank",
    name: "Chase Checking ****1234",
    icon: BanknoteIcon,
    isDefault: true,
    processingTime: "1-2 business days",
    fee: 0,
    minAmount: 50
  },
  {
    id: "2",
    type: "card",
    name: "Visa Debit ****5678",
    icon: CreditCard,
    isDefault: false,
    processingTime: "Instant",
    fee: 2.5,
    minAmount: 10
  },
  {
    id: "3",
    type: "paypal",
    name: "PayPal (creator@email.com)",
    icon: Wallet,
    isDefault: false,
    processingTime: "Instant",
    fee: 1.5,
    minAmount: 25
  }
]

const payoutScheduleOptions = [
  { value: "weekly", label: "Weekly (Every Friday)", description: "Automatic weekly payouts" },
  { value: "biweekly", label: "Bi-weekly", description: "Every two weeks" },
  { value: "monthly", label: "Monthly", description: "Once per month" },
  { value: "manual", label: "Manual", description: "Request payouts manually" }
]

export default function PayoutsPage() {
  const t = useTranslations()
  const [isPayoutDialogOpen, setIsPayoutDialogOpen] = useState(false)
  const [selectedMethod, setSelectedMethod] = useState("1")
  const [payoutAmount, setPayoutAmount] = useState("")
  const [payoutType, setPayoutType] = useState("standard")
  const [payoutSchedule, setPayoutSchedule] = useState("weekly")
  const [minimumPayout, setMinimumPayout] = useState("50")
  
  const tCustom = (key: string) => {
    return payoutTranslations[key]?.['en'] || payoutTranslations[key]?.en || key
  }
  
  const selectedPaymentMethod = paymentMethods.find(m => m.id === selectedMethod)
  const fee = payoutType === "instant" ? (selectedPaymentMethod?.fee || 0) * 2 : selectedPaymentMethod?.fee || 0
  const finalAmount = Number(payoutAmount) - fee
  
  const getStatusBadge = (status: string) => {
    const config = {
      completed: { label: "Completed", className: "bg-green-500 text-white" },
      processing: { label: "Processing", className: "bg-blue-500 text-white" },
      pending: { label: "Pending", className: "bg-orange-500 text-white" },
      failed: { label: "Failed", className: "bg-red-500 text-white" }
    }
    const statusConfig = config[status as keyof typeof config]
    return statusConfig ? <Badge className={statusConfig.className}>{statusConfig.label}</Badge> : null
  }
  
  const handleRequestPayout = () => {
    console.log("Requesting payout:", {
      amount: payoutAmount,
      method: selectedMethod,
      type: payoutType,
      fee,
      finalAmount
    })
    setIsPayoutDialogOpen(false)
    setPayoutAmount("")
  }
  
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link href="/creator/finances">
          <Button variant="ghost" size="sm" className="mb-4">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Financial Center
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('payout_management')}</h1>
            <p className="text-gray-600 mt-1">{t('manage_withdrawals')}</p>
          </div>
          <Dialog open={isPayoutDialogOpen} onOpenChange={setIsPayoutDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg">
                <DollarSign className="h-4 w-4 mr-2" />
                {t('request_payout')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t('request_payout')}</DialogTitle>
                <DialogDescription>
                  Choose your payout amount and method
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">{t('select_amount')}</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      className="pl-10"
                      max={availableBalance}
                      min={selectedPaymentMethod?.minAmount}
                    />
                  </div>
                  <p className="text-xs text-gray-500">
                    Available: {formatCurrency(availableBalance, language)} " 
                    Min: {formatCurrency(selectedPaymentMethod?.minAmount || 50, language)}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Payout Method</Label>
                  <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
                    {paymentMethods.map((method) => {
                      const Icon = method.icon
                      return (
                        <div key={method.id} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                          <RadioGroupItem value={method.id} />
                          <Icon className="h-4 w-4 text-gray-600" />
                          <div className="flex-1">
                            <Label htmlFor={method.id} className="cursor-pointer">
                              {method.name}
                            </Label>
                            <p className="text-xs text-gray-500">
                              {method.processingTime} " Fee: {method.fee > 0 ? `${method.fee}%` : 'Free'}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Payout Speed</Label>
                  <RadioGroup value={payoutType} onValueChange={setPayoutType}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="standard" />
                      <Clock className="h-4 w-4 text-gray-600" />
                      <div className="flex-1">
                        <Label className="cursor-pointer">Standard</Label>
                        <p className="text-xs text-gray-500">1-2 business days " Standard fee</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                      <RadioGroupItem value="instant" />
                      <Zap className="h-4 w-4 text-orange-600" />
                      <div className="flex-1">
                        <Label className="cursor-pointer">Instant</Label>
                        <p className="text-xs text-gray-500">Within 30 minutes " 2x fee</p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
                
                {payoutAmount && (
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Amount</span>
                      <span>{formatCurrency(Number(payoutAmount), language)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Processing Fee</span>
                      <span className="text-red-600">-{formatCurrency(fee, language)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>You'll receive</span>
                      <span className="text-green-600">{formatCurrency(finalAmount, language)}</span>
                    </div>
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsPayoutDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleRequestPayout}
                  disabled={!payoutAmount || Number(payoutAmount) < (selectedPaymentMethod?.minAmount || 50) || Number(payoutAmount) > availableBalance}
                >
                  Request Payout
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      {/* Balance Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Available for Payout</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(availableBalance, language)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Ready to withdraw</p>
            </div>
            <Wallet className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Payouts</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {formatCurrency(pendingPayouts, language)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Processing</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Next Scheduled</p>
              <p className="text-xl font-bold text-gray-900 mt-2">Friday, Dec 15</p>
              <p className="text-xs text-gray-500 mt-1">
                Est. {formatCurrency(availableBalance, language)}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
      </div>
      
      {/* Payout Settings */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t('payout_settings')}</CardTitle>
          <CardDescription>Configure your automatic payout preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="schedule">{t('payout_schedule')}</Label>
              <Select value={payoutSchedule} onValueChange={setPayoutSchedule}>
                <SelectTrigger id="schedule">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {payoutScheduleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div>
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minimum">{t('minimum_payout')}</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  id="minimum"
                  type="number"
                  value={minimumPayout}
                  onChange={(e) => setMinimumPayout(e.target.value)}
                  className="pl-10"
                  min="50"
                  step="10"
                />
              </div>
              <p className="text-xs text-gray-500">
                Minimum allowed: {formatCurrency(50, language)}
              </p>
            </div>
          </div>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Based on your settings, your next automatic payout of {formatCurrency(availableBalance, language)} is scheduled for Friday, December 15, 2024.
            </AlertDescription>
          </Alert>
          
          <div className="flex justify-end">
            <Button>Save Settings</Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Payout History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('payout_history')}</CardTitle>
              <CardDescription>Your recent payout transactions</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export History
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Fee</TableHead>
                <TableHead>Processing Time</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payoutHistory.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="font-mono text-sm">{payout.id}</TableCell>
                  <TableCell>{format(new Date(payout.date), 'MMM d, yyyy')}</TableCell>
                  <TableCell>{payout.method}</TableCell>
                  <TableCell className="font-bold">
                    {formatCurrency(payout.amount, language)}
                  </TableCell>
                  <TableCell>
                    {payout.fee > 0 ? formatCurrency(payout.fee, language) : '-'}
                  </TableCell>
                  <TableCell>{payout.processingTime}</TableCell>
                  <TableCell>{getStatusBadge(payout.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}