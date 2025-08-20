"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  CreditCard,
  Lock,
  Shield,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Info,
  Smartphone,
  Wallet,
  DollarSign,
  ChevronRight,
  Eye,
  EyeOff,
  Sparkles,
  Zap,
  TrendingUp,
  Clock,
  Globe,
  Star,
  Award,
  Apple,
  Chrome,
  ShoppingCart,
  ArrowRight,
  Check,
  X,
  Loader2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Payment method types
export type PaymentMethod = "card" | "paypal" | "apple_pay" | "google_pay" | "afterpay"

// Card types
const CARD_TYPES = {
  visa: { name: "Visa", pattern: /^4/, icon: "💳", color: "blue" },
  mastercard: { name: "Mastercard", pattern: /^5[1-5]/, icon: "💳", color: "red" },
  amex: { name: "American Express", pattern: /^3[47]/, icon: "💳", color: "blue" },
  discover: { name: "Discover", pattern: /^6(?:011|5)/, icon: "💳", color: "orange" },
}

// Payment method configurations
const PAYMENT_METHODS = [
  {
    id: "card" as PaymentMethod,
    name: "Credit / Debit Card",
    icon: CreditCard,
    description: "All major cards accepted",
    adoption: "65%",
    friction: "medium",
    trustLevel: "high",
    conversion: "baseline",
    badge: null,
    popular: true
  },
  {
    id: "paypal" as PaymentMethod,
    name: "PayPal",
    icon: Wallet,
    description: "Fast & secure checkout",
    adoption: "20%",
    friction: "low",
    trustLevel: "very-high",
    conversion: "+15%",
    badge: "Recommended",
    popular: true
  },
  {
    id: "apple_pay" as PaymentMethod,
    name: "Apple Pay",
    icon: Apple,
    description: "One-touch payment",
    adoption: "10%",
    friction: "very-low",
    trustLevel: "very-high",
    conversion: "+25%",
    badge: "Fastest",
    popular: false
  },
  {
    id: "google_pay" as PaymentMethod,
    name: "Google Pay",
    icon: Chrome,
    description: "Quick & easy",
    adoption: "5%",
    friction: "very-low",
    trustLevel: "high",
    conversion: "+20%",
    badge: null,
    popular: false
  },
  {
    id: "afterpay" as PaymentMethod,
    name: "Afterpay",
    icon: ShoppingCart,
    description: "Buy now, pay later",
    adoption: "optional",
    friction: "low",
    trustLevel: "medium",
    conversion: "+30% AOV",
    badge: "Split payments",
    popular: false
  }
]

// Security badges
const SecurityBadge = ({ 
  icon: Icon, 
  text, 
  highlight = false 
}: {
  icon: React.ElementType
  text: string
  highlight?: boolean
}) => {
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all",
      highlight 
        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border border-green-200"
        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
    )}>
      <Icon className="h-3.5 w-3.5" />
      <span>{text}</span>
    </div>
  )
}

// Card input with real-time validation and formatting
const CardInput = ({ 
  value, 
  onChange, 
  error,
  onCardTypeChange 
}: {
  value: string
  onChange: (value: string) => void
  error?: string
  onCardTypeChange?: (type: string | null) => void
}) => {
  const [cardType, setCardType] = React.useState<string | null>(null)
  const [isValid, setIsValid] = React.useState(false)
  
  const formatCardNumber = (input: string) => {
    const cleaned = input.replace(/\s+/g, '')
    const matches = cleaned.match(/.{1,4}/g) || []
    return matches.join(' ')
  }
  
  const detectCardType = (number: string) => {
    const cleaned = number.replace(/\s+/g, '')
    for (const [key, type] of Object.entries(CARD_TYPES)) {
      if (type.pattern.test(cleaned)) {
        return key
      }
    }
    return null
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/[^\d\s]/g, '')
    const formatted = formatCardNumber(input.replace(/\s+/g, ''))
    
    if (formatted.replace(/\s+/g, '').length <= 16) {
      onChange(formatted)
      
      const detected = detectCardType(formatted)
      setCardType(detected)
      onCardTypeChange?.(detected)
      
      // Basic Luhn algorithm validation
      const cleaned = formatted.replace(/\s+/g, '')
      setIsValid(cleaned.length === 16 && luhnCheck(cleaned))
    }
  }
  
  const luhnCheck = (num: string) => {
    let sum = 0
    let isEven = false
    for (let i = num.length - 1; i >= 0; i--) {
      let digit = parseInt(num[i], 10)
      if (isEven) {
        digit *= 2
        if (digit > 9) digit -= 9
      }
      sum += digit
      isEven = !isEven
    }
    return sum % 10 === 0
  }
  
  return (
    <div className="relative">
      <Input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder="1234 5678 9012 3456"
        className={cn(
          "pl-10 pr-10",
          error && "border-red-500",
          isValid && value && "border-green-500"
        )}
        autoComplete="cc-number"
      />
      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
      {cardType && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          <span className="text-lg">{CARD_TYPES[cardType as keyof typeof CARD_TYPES].icon}</span>
        </div>
      )}
      {isValid && value && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute right-10 top-1/2 -translate-y-1/2"
        >
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </motion.div>
      )}
    </div>
  )
}

// CVV input with security emphasis
const CVVInput = ({ 
  value, 
  onChange,
  cardType 
}: {
  value: string
  onChange: (value: string) => void
  cardType?: string | null
}) => {
  const [showCVV, setShowCVV] = React.useState(false)
  const maxLength = cardType === "amex" ? 4 : 3
  
  return (
    <div className="relative">
      <Input
        type={showCVV ? "text" : "password"}
        value={value}
        onChange={(e) => {
          const input = e.target.value.replace(/\D/g, '')
          if (input.length <= maxLength) {
            onChange(input)
          }
        }}
        placeholder={cardType === "amex" ? "1234" : "123"}
        className="pr-10"
        autoComplete="cc-csc"
        maxLength={maxLength}
      />
      <button
        type="button"
        onClick={() => setShowCVV(!showCVV)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        {showCVV ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
  )
}

// Express checkout button
const ExpressCheckoutButton = ({
  method,
  onClick,
  disabled = false
}: {
  method: typeof PAYMENT_METHODS[0]
  onClick: () => void
  disabled?: boolean
}) => {
  const Icon = method.icon
  
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative w-full p-4 rounded-lg border-2 transition-all",
        "hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        method.popular && "border-purple-200 bg-purple-50/50 dark:bg-purple-900/10"
      )}
    >
      {method.badge && (
        <Badge className="absolute -top-2 right-4 text-xs" variant="default">
          {method.badge}
        </Badge>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5" />
          <div className="text-left">
            <p className="font-semibold">{method.name}</p>
            <p className="text-xs text-gray-500">{method.description}</p>
          </div>
        </div>
        <ChevronRight className="h-4 w-4 text-gray-400" />
      </div>
    </motion.button>
  )
}

interface EnhancedPaymentProcessingProps {
  amount: number
  creatorName?: string
  onPaymentComplete: (method: PaymentMethod, data: any) => void
  onBack?: () => void
  savedCards?: Array<{
    id: string
    last4: string
    brand: string
    isDefault?: boolean
  }>
}

export function EnhancedPaymentProcessing({
  amount,
  creatorName = "Creator",
  onPaymentComplete,
  onBack,
  savedCards = []
}: EnhancedPaymentProcessingProps) {
  const [selectedMethod, setSelectedMethod] = React.useState<PaymentMethod>("card")
  const [isProcessing, setIsProcessing] = React.useState(false)
  const [showSuccess, setShowSuccess] = React.useState(false)
  
  // Card form state
  const [cardNumber, setCardNumber] = React.useState("")
  const [cardName, setCardName] = React.useState("")
  const [expiryDate, setExpiryDate] = React.useState("")
  const [cvv, setCvv] = React.useState("")
  const [zipCode, setZipCode] = React.useState("")
  const [saveCard, setSaveCard] = React.useState(true)
  const [selectedSavedCard, setSelectedSavedCard] = React.useState<string | null>(
    savedCards.find(c => c.isDefault)?.id || null
  )
  
  // Validation states
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [cardType, setCardType] = React.useState<string | null>(null)
  
  // Auto-detect and fill city/state from ZIP
  const [cityState, setCityState] = React.useState({ city: "", state: "" })
  
  React.useEffect(() => {
    // Simulate ZIP code lookup
    if (zipCode.length === 5) {
      // In production, this would call an API
      setTimeout(() => {
        setCityState({
          city: "New York",
          state: "NY"
        })
        toast.success("Location auto-filled from ZIP code")
      }, 500)
    }
  }, [zipCode])
  
  // Format expiry date
  const formatExpiryDate = (input: string) => {
    const cleaned = input.replace(/\D/g, '')
    if (cleaned.length >= 3) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`
    }
    return cleaned
  }
  
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value)
    if (formatted.replace(/\D/g, '').length <= 4) {
      setExpiryDate(formatted)
    }
  }
  
  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (selectedMethod === "card" && !selectedSavedCard) {
      if (!cardNumber) newErrors.cardNumber = "Card number is required"
      if (!cardName) newErrors.cardName = "Name is required"
      if (!expiryDate) newErrors.expiryDate = "Expiry date is required"
      if (!cvv) newErrors.cvv = "CVV is required"
      if (!zipCode) newErrors.zipCode = "ZIP code is required"
      
      // Validate expiry date
      if (expiryDate) {
        const [month, year] = expiryDate.split('/')
        const now = new Date()
        const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1)
        if (expiry < now) {
          newErrors.expiryDate = "Card has expired"
        }
      }
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }
  
  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields")
      return
    }
    
    setIsProcessing(true)
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setShowSuccess(true)
    
    setTimeout(() => {
      onPaymentComplete(selectedMethod, {
        cardNumber: selectedSavedCard ? `****${savedCards.find(c => c.id === selectedSavedCard)?.last4}` : cardNumber,
        amount
      })
    }, 1500)
  }
  
  const handleExpressCheckout = async (method: PaymentMethod) => {
    setIsProcessing(true)
    
    // Simulate express checkout flow
    toast.info(`Opening ${PAYMENT_METHODS.find(m => m.id === method)?.name}...`)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    setShowSuccess(true)
    
    setTimeout(() => {
      onPaymentComplete(method, { amount })
    }, 1500)
  }
  
  if (showSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4"
        >
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </motion.div>
        <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Your booking with {creatorName} is confirmed
        </p>
      </motion.div>
    )
  }
  
  return (
    <div className="space-y-6">
      {/* Security Header */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-green-600" />
          <div>
            <p className="font-semibold text-green-900 dark:text-green-100">
              Secure Checkout
            </p>
            <p className="text-xs text-green-700 dark:text-green-300">
              Your payment info is encrypted and never stored
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <SecurityBadge icon={Lock} text="SSL Encrypted" highlight />
          <SecurityBadge icon={Shield} text="PCI Compliant" />
        </div>
      </div>
      
      {/* Express Checkout Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Express Checkout
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {PAYMENT_METHODS.filter(m => m.id !== "card").map(method => (
            <ExpressCheckoutButton
              key={method.id}
              method={method}
              onClick={() => handleExpressCheckout(method.id)}
              disabled={isProcessing}
            />
          ))}
        </CardContent>
      </Card>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <Separator />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white dark:bg-gray-900 px-2 text-gray-500">
            Or pay with card
          </span>
        </div>
      </div>
      
      {/* Card Payment Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Payment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Saved Cards */}
          {savedCards.length > 0 && (
            <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Label className="text-sm font-medium">Use saved card</Label>
              <RadioGroup
                value={selectedSavedCard || "new"}
                onValueChange={(value) => setSelectedSavedCard(value === "new" ? null : value)}
              >
                {savedCards.map(card => (
                  <div key={card.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={card.id} id={card.id} />
                    <Label htmlFor={card.id} className="flex items-center gap-2 cursor-pointer">
                      <CreditCard className="h-4 w-4" />
                      <span>{card.brand} ****{card.last4}</span>
                      {card.isDefault && (
                        <Badge variant="secondary" className="text-xs">Default</Badge>
                      )}
                    </Label>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" />
                  <Label htmlFor="new" className="cursor-pointer">
                    Use a new card
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
          
          {/* New Card Form */}
          <AnimatePresence>
            {(!selectedSavedCard || savedCards.length === 0) && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {/* Card Number */}
                <div className="space-y-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <CardInput
                    value={cardNumber}
                    onChange={setCardNumber}
                    error={errors.cardNumber}
                    onCardTypeChange={setCardType}
                  />
                  {errors.cardNumber && (
                    <p className="text-xs text-red-500">{errors.cardNumber}</p>
                  )}
                </div>
                
                {/* Cardholder Name */}
                <div className="space-y-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    placeholder="John Doe"
                    autoComplete="cc-name"
                    className={errors.cardName ? "border-red-500" : ""}
                  />
                  {errors.cardName && (
                    <p className="text-xs text-red-500">{errors.cardName}</p>
                  )}
                </div>
                
                {/* Expiry and CVV */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      value={expiryDate}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      autoComplete="cc-exp"
                      className={errors.expiryDate ? "border-red-500" : ""}
                    />
                    {errors.expiryDate && (
                      <p className="text-xs text-red-500">{errors.expiryDate}</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Info className="h-3 w-3 text-gray-400" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-xs">3-digit code on the back of your card</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                    <CVVInput
                      value={cvv}
                      onChange={setCvv}
                      cardType={cardType}
                    />
                    {errors.cvv && (
                      <p className="text-xs text-red-500">{errors.cvv}</p>
                    )}
                  </div>
                </div>
                
                {/* ZIP Code with Auto City/State */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="zip">ZIP Code</Label>
                    <Input
                      id="zip"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5))}
                      placeholder="10001"
                      autoComplete="postal-code"
                      className={errors.zipCode ? "border-red-500" : ""}
                    />
                    {errors.zipCode && (
                      <p className="text-xs text-red-500">{errors.zipCode}</p>
                    )}
                  </div>
                  
                  {cityState.city && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                      <span className="text-sm">
                        {cityState.city}, {cityState.state}
                      </span>
                    </motion.div>
                  )}
                </div>
                
                {/* Save Card Option */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="saveCard"
                    checked={saveCard}
                    onCheckedChange={(checked) => setSaveCard(checked as boolean)}
                  />
                  <Label
                    htmlFor="saveCard"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Save this card for future purchases
                  </Label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Order Summary */}
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Video Message</span>
              <span className="font-medium">${amount}</span>
            </div>
            <div className="flex justify-between items-center pt-2">
              <span className="text-lg font-bold">Total</span>
              <span className="text-2xl font-bold">${amount}</span>
            </div>
          </div>
          
          {/* Trust Signals */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Shield className="h-4 w-4" />
              <span>Your data is safe</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Instant confirmation</span>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Action Buttons */}
      <div className="flex items-center gap-3">
        {onBack && (
          <Button
            variant="outline"
            size="lg"
            onClick={onBack}
            disabled={isProcessing}
            className="min-w-[120px]"
          >
            Back
          </Button>
        )}
        <Button
          size="lg"
          onClick={handleSubmit}
          disabled={isProcessing}
          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Complete Order
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
      </div>
      
      {/* Payment Logos */}
      <div className="flex items-center justify-center gap-4 opacity-50">
        <div className="text-2xl">💳</div>
        <div className="text-2xl">🅿️</div>
        <div className="text-2xl">🍎</div>
        <div className="text-2xl">🌐</div>
        <Badge variant="outline" className="text-xs">
          & more
        </Badge>
      </div>
    </div>
  )
}