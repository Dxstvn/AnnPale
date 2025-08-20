"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Clock, 
  CreditCard, 
  Building, 
  Zap,
  CheckCircle,
  AlertTriangle,
  Shield,
  DollarSign,
  Calendar,
  Info,
  Star,
  RefreshCw
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PaymentMethod {
  id: string
  type: 'debit' | 'bank' | 'paypal'
  name: string
  details: string
  isDefault: boolean
  isVerified: boolean
}

interface WithdrawalOption {
  id: string
  name: string
  description: string
  icon: React.ElementType
  fee: string
  feeAmount: number
  duration: string
  minAmount: number
  maxAmount: number
  methods: ('debit' | 'bank' | 'paypal')[]
  features: string[]
  isRecommended?: boolean
  processingSteps: string[]
}

interface WithdrawalOptionsProps {
  availableBalance: number
  paymentMethods: PaymentMethod[]
  onWithdraw?: (option: string, amount: number, method: string) => void
  onAddPaymentMethod?: () => void
}

export function WithdrawalOptions({
  availableBalance,
  paymentMethods,
  onWithdraw,
  onAddPaymentMethod
}: WithdrawalOptionsProps) {
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [withdrawAmount, setWithdrawAmount] = useState<string>('')
  const [selectedMethod, setSelectedMethod] = useState<string>('')
  const [showDetails, setShowDetails] = useState<string>('')

  const withdrawalOptions: WithdrawalOption[] = [
    {
      id: 'instant',
      name: 'Instant Withdrawal',
      description: 'Get your money in minutes',
      icon: Zap,
      fee: '2.5%',
      feeAmount: 2.5,
      duration: '0-30 minutes',
      minAmount: 10,
      maxAmount: 2000,
      methods: ['debit'],
      features: [
        'Available 24/7',
        'Perfect for urgent needs',
        'Instant confirmation',
        'No waiting period'
      ],
      processingSteps: [
        'Funds deducted from balance',
        'Payment processed instantly',
        'Funds appear in your account within 30 minutes'
      ]
    },
    {
      id: 'standard',
      name: 'Standard Transfer',
      description: 'Free bank transfer',
      icon: Building,
      fee: 'Free',
      feeAmount: 0,
      duration: '2-3 business days',
      minAmount: 50,
      maxAmount: 10000,
      methods: ['bank'],
      isRecommended: true,
      features: [
        'No fees',
        'Higher limits',
        'Most popular option',
        'Secure bank transfer'
      ],
      processingSteps: [
        'Request submitted',
        'Processing begins next business day',
        'Funds transferred to your bank',
        'Available in 2-3 business days'
      ]
    },
    {
      id: 'weekly',
      name: 'Weekly Auto-Payout',
      description: 'Automatic weekly transfers',
      icon: RefreshCw,
      fee: 'Free',
      feeAmount: 0,
      duration: 'Every Friday',
      minAmount: 100,
      maxAmount: 50000,
      methods: ['bank', 'paypal'],
      features: [
        'Set it and forget it',
        'Consistent cash flow',
        'No manual requests',
        'Flexible threshold'
      ],
      processingSteps: [
        'Automatic payout every Friday',
        'Only if balance meets minimum',
        'Funds transferred to default method',
        'Email confirmation sent'
      ]
    }
  ]

  const calculateFee = (amount: number, feePercent: number) => {
    return (amount * feePercent) / 100
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount)
  }

  const getMethodIcon = (type: string) => {
    switch (type) {
      case 'debit': return CreditCard
      case 'bank': return Building
      case 'paypal': return DollarSign
      default: return CreditCard
    }
  }

  const selectedOptionData = withdrawalOptions.find(opt => opt.id === selectedOption)
  const withdrawAmountNum = parseFloat(withdrawAmount) || 0
  const feeAmount = selectedOptionData ? calculateFee(withdrawAmountNum, selectedOptionData.feeAmount) : 0
  const totalAmount = withdrawAmountNum + feeAmount
  const netAmount = withdrawAmountNum - feeAmount

  const canProceed = selectedOption && withdrawAmount && selectedMethod && 
    withdrawAmountNum >= (selectedOptionData?.minAmount || 0) &&
    withdrawAmountNum <= (selectedOptionData?.maxAmount || Infinity) &&
    totalAmount <= availableBalance

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Withdraw Funds</h2>
          <p className="text-sm text-gray-600 mt-1">
            Available balance: <span className="font-semibold text-green-600">
              {formatCurrency(availableBalance)}
            </span>
          </p>
        </div>
        <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <Shield className="h-3 w-3" />
          Secure & Encrypted
        </Badge>
      </div>

      {/* Withdrawal Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {withdrawalOptions.map((option) => {
          const Icon = option.icon
          const isSelected = selectedOption === option.id
          
          return (
            <Card 
              key={option.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                isSelected && "ring-2 ring-purple-500 bg-purple-50",
                option.isRecommended && !isSelected && "ring-1 ring-green-300 bg-green-50"
              )}
              onClick={() => setSelectedOption(option.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <Icon className={cn(
                    "h-6 w-6",
                    isSelected ? "text-purple-600" : "text-gray-600"
                  )} />
                  <div className="flex gap-1">
                    {option.isRecommended && (
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        <Star className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    {option.fee === 'Free' && (
                      <Badge className="bg-blue-100 text-blue-800 text-xs">
                        Free
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-lg">{option.name}</CardTitle>
                <p className="text-sm text-gray-600">{option.description}</p>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">Fee</p>
                    <p className="font-semibold">{option.fee}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Duration</p>
                    <p className="font-semibold">{option.duration}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Minimum</p>
                    <p className="font-semibold">{formatCurrency(option.minAmount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Maximum</p>
                    <p className="font-semibold">{formatCurrency(option.maxAmount)}</p>
                  </div>
                </div>

                <div className="space-y-1">
                  {option.features.slice(0, 2).map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-3 w-3 text-green-600" />
                      <span className="text-xs text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  className="w-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowDetails(showDetails === option.id ? '' : option.id)
                  }}
                >
                  {showDetails === option.id ? 'Hide Details' : 'Learn More'}
                </Button>
              </CardContent>

              {/* Expanded Details */}
              {showDetails === option.id && (
                <CardContent className="pt-0 border-t">
                  <div className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-2">Processing Steps:</h4>
                      <ol className="space-y-1">
                        {option.processingSteps.map((step, index) => (
                          <li key={index} className="flex items-start gap-2 text-xs">
                            <span className="bg-purple-100 text-purple-700 rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium">
                              {index + 1}
                            </span>
                            <span className="text-gray-600">{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-2">All Features:</h4>
                      <ul className="space-y-1">
                        {option.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-xs">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Withdrawal Form */}
      {selectedOption && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Complete Your Withdrawal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Amount Input */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Withdrawal Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="pl-10"
                  min={selectedOptionData?.minAmount}
                  max={Math.min(selectedOptionData?.maxAmount || Infinity, availableBalance)}
                />
              </div>
              {selectedOptionData && withdrawAmountNum > 0 && (
                <div className="mt-2 p-2 bg-white rounded border text-xs">
                  <div className="flex justify-between">
                    <span>Amount to withdraw:</span>
                    <span>{formatCurrency(withdrawAmountNum)}</span>
                  </div>
                  {feeAmount > 0 && (
                    <div className="flex justify-between text-gray-600">
                      <span>Fee ({selectedOptionData.fee}):</span>
                      <span>-{formatCurrency(feeAmount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-medium border-t mt-1 pt-1">
                    <span>You receive:</span>
                    <span>{formatCurrency(netAmount)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Payment Method
              </label>
              <div className="space-y-2">
                {paymentMethods
                  .filter(method => selectedOptionData?.methods.includes(method.type))
                  .map((method) => {
                    const MethodIcon = getMethodIcon(method.type)
                    return (
                      <div
                        key={method.id}
                        className={cn(
                          "p-3 border rounded-lg cursor-pointer transition-colors",
                          selectedMethod === method.id ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:bg-gray-50"
                        )}
                        onClick={() => setSelectedMethod(method.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <MethodIcon className="h-5 w-5 text-gray-600" />
                            <div>
                              <p className="font-medium text-sm">{method.name}</p>
                              <p className="text-xs text-gray-500">{method.details}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {method.isDefault && (
                              <Badge variant="outline" className="text-xs">Default</Badge>
                            )}
                            {method.isVerified && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={onAddPaymentMethod}
                >
                  Add New Payment Method
                </Button>
              </div>
            </div>

            {/* Summary and Submit */}
            <div className="space-y-3 pt-4 border-t">
              <div className="bg-white rounded-lg p-3 border">
                <h4 className="font-medium text-sm mb-2">Withdrawal Summary</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Method:</span>
                    <span>{selectedOptionData?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Processing time:</span>
                    <span>{selectedOptionData?.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fee:</span>
                    <span>{selectedOptionData?.fee}</span>
                  </div>
                </div>
              </div>

              <Button
                className="w-full bg-purple-600 hover:bg-purple-700"
                disabled={!canProceed}
                onClick={() => {
                  if (canProceed && selectedOptionData) {
                    onWithdraw?.(selectedOption, withdrawAmountNum, selectedMethod)
                  }
                }}
              >
                {!canProceed ? 'Please complete all fields' : `Withdraw ${formatCurrency(withdrawAmountNum)}`}
              </Button>

              <div className="flex items-start gap-2 text-xs text-gray-600">
                <Info className="h-3 w-3 mt-0.5" />
                <p>
                  Your withdrawal will be processed securely. You'll receive an email confirmation
                  once the transfer is complete.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}