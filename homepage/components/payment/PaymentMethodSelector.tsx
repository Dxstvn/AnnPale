"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { 
  CreditCard, 
  Smartphone, 
  Globe, 
  MapPin, 
  DollarSign,
  Loader2,
  CheckCircle,
  AlertCircle,
  Info,
  Shield,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { PaymentProvider, GeolocationData, PaymentMethodSelection, CurrencyCode } from "@/types/video"

interface PaymentMethodSelectorProps {
  amount: number
  onMethodSelect: (method: PaymentMethodSelection) => void
  className?: string
  disabled?: boolean
}

export function PaymentMethodSelector({
  amount,
  onMethodSelect,
  className,
  disabled = false
}: PaymentMethodSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentProvider | null>(null)
  const [isDetectingLocation, setIsDetectingLocation] = useState(true)
  const [userLocation, setUserLocation] = useState<GeolocationData | null>(null)
  const [availableMethods, setAvailableMethods] = useState<PaymentMethodSelection[]>([])
  const [error, setError] = useState<string | null>(null)
  
  // Detect user location on mount
  useEffect(() => {
    detectUserLocation()
  }, [])
  
  // Detect user location and determine available payment methods
  const detectUserLocation = async () => {
    setIsDetectingLocation(true)
    setError(null)
    
    try {
      // Call geolocation API
      const response = await fetch('/api/payments/detect-location')
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to detect location')
      }
      
      setUserLocation(data)
      
      // Determine available payment methods based on location
      const methods = getAvailablePaymentMethods(data)
      setAvailableMethods(methods)
      
      // Auto-select recommended method
      const recommended = methods.find(m => m.is_recommended)
      if (recommended) {
        setSelectedMethod(recommended.provider)
      }
      
    } catch (err: any) {
      console.error('Location detection error:', err)
      setError('Could not detect your location. Showing all payment options.')
      
      // Fallback to all methods
      const methods = getAvailablePaymentMethods(null)
      setAvailableMethods(methods)
    } finally {
      setIsDetectingLocation(false)
    }
  }
  
  // Get available payment methods based on location
  const getAvailablePaymentMethods = (location: GeolocationData | null): PaymentMethodSelection[] => {
    const methods: PaymentMethodSelection[] = []
    
    // Check if user is in Haiti
    const isInHaiti = location?.country_code === 'HT' || location?.is_haiti === true
    
    // MonCash (for Haiti)
    if (isInHaiti || !location) {
      methods.push({
        provider: 'moncash',
        display_name: 'MonCash',
        icon: '📱',
        is_available: true,
        is_recommended: isInHaiti,
        currency: 'HTG',
        min_amount: 50, // 50 HTG minimum
        max_amount: 500000, // 500,000 HTG maximum
        processing_fee_percentage: 3,
        fixed_fee: 10 // 10 HTG fixed fee
      })
    }
    
    // Stripe (International)
    methods.push({
      provider: 'stripe',
      display_name: 'Credit/Debit Card',
      icon: '💳',
      is_available: true,
      is_recommended: !isInHaiti,
      currency: 'USD',
      min_amount: 1, // $1 minimum
      max_amount: 10000, // $10,000 maximum
      processing_fee_percentage: 2.9,
      fixed_fee: 0.30 // $0.30 fixed fee
    })
    
    // PayPal (if needed in future)
    // methods.push({
    //   provider: 'paypal',
    //   display_name: 'PayPal',
    //   icon: '🅿️',
    //   is_available: !isInHaiti,
    //   is_recommended: false,
    //   currency: 'USD',
    //   min_amount: 1,
    //   max_amount: 10000,
    //   processing_fee_percentage: 3.49,
    //   fixed_fee: 0.49
    // })
    
    return methods
  }
  
  // Calculate fees for selected method
  const calculateFees = (method: PaymentMethodSelection) => {
    const percentageFee = (amount * (method.processing_fee_percentage || 0)) / 100
    const totalFee = percentageFee + (method.fixed_fee || 0)
    const total = amount + totalFee
    
    return {
      subtotal: amount,
      fee: totalFee,
      total: total,
      currency: method.currency
    }
  }
  
  // Format currency
  const formatCurrency = (amount: number, currency: CurrencyCode) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: currency === 'HTG' ? 0 : 2,
      maximumFractionDigits: currency === 'HTG' ? 0 : 2
    })
    return formatter.format(amount)
  }
  
  // Convert USD to HTG (approximate rate)
  const convertToHTG = (usdAmount: number) => {
    const rate = 150 // Approximate rate, should be fetched from API
    return Math.round(usdAmount * rate)
  }
  
  // Handle method selection
  const handleMethodSelect = () => {
    const method = availableMethods.find(m => m.provider === selectedMethod)
    if (method) {
      onMethodSelect(method)
    }
  }
  
  // Get method icon component
  const getMethodIcon = (provider: PaymentProvider) => {
    switch (provider) {
      case 'moncash':
        return <Smartphone className="w-5 h-5" />
      case 'stripe':
        return <CreditCard className="w-5 h-5" />
      default:
        return <DollarSign className="w-5 h-5" />
    }
  }
  
  // Get method features
  const getMethodFeatures = (provider: PaymentProvider) => {
    switch (provider) {
      case 'moncash':
        return [
          'Popular in Haiti',
          'Mobile money transfer',
          'Instant payment',
          'Pay with Haitian Gourdes'
        ]
      case 'stripe':
        return [
          'Secure card payment',
          'International support',
          'Buyer protection',
          'Multiple currencies'
        ]
      default:
        return []
    }
  }
  
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Select Payment Method
        </CardTitle>
        <CardDescription>
          Choose how you'd like to pay for this video
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Location Detection Status */}
        {isDetectingLocation ? (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Detecting your location for best payment options...</span>
          </div>
        ) : userLocation && (
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <span>
              Detected location: {userLocation.city ? `${userLocation.city}, ` : ''}
              {userLocation.country || 'Unknown'}
            </span>
          </div>
        )}
        
        {/* Error Alert */}
        {error && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Payment Methods */}
        {!isDetectingLocation && availableMethods.length > 0 && (
          <RadioGroup
            value={selectedMethod || ''}
            onValueChange={(value) => setSelectedMethod(value as PaymentProvider)}
            disabled={disabled}
            className="space-y-3"
          >
            {availableMethods.map((method) => {
              const fees = calculateFees(method)
              const isRecommended = method.is_recommended
              
              return (
                <div key={method.provider} className="relative">
                  {isRecommended && (
                    <Badge 
                      className="absolute -top-2 right-2 z-10"
                      variant="default"
                    >
                      <Zap className="w-3 h-3 mr-1" />
                      Recommended
                    </Badge>
                  )}
                  
                  <Label
                    htmlFor={method.provider}
                    className={cn(
                      "flex cursor-pointer rounded-lg border p-4",
                      selectedMethod === method.provider 
                        ? "border-primary bg-primary/5" 
                        : "border-input hover:bg-accent/50",
                      disabled && "cursor-not-allowed opacity-50"
                    )}
                  >
                    <RadioGroupItem
                      value={method.provider}
                      id={method.provider}
                      className="mt-1"
                    />
                    
                    <div className="ml-3 flex-1 space-y-3">
                      {/* Method Header */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getMethodIcon(method.provider)}
                          <span className="font-medium">{method.display_name}</span>
                        </div>
                        <span className="text-2xl">{method.icon}</span>
                      </div>
                      
                      {/* Features */}
                      <div className="flex flex-wrap gap-2">
                        {getMethodFeatures(method.provider).map((feature, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      
                      {/* Pricing Breakdown */}
                      {selectedMethod === method.provider && (
                        <div className="space-y-1 pt-2 border-t">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Subtotal:</span>
                            <span>{formatCurrency(fees.subtotal, fees.currency)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Processing Fee:</span>
                            <span>{formatCurrency(fees.fee, fees.currency)}</span>
                          </div>
                          <div className="flex justify-between font-medium">
                            <span>Total:</span>
                            <span className="text-lg">
                              {formatCurrency(fees.total, fees.currency)}
                            </span>
                          </div>
                          
                          {/* Currency conversion note */}
                          {method.currency === 'HTG' && (
                            <p className="text-xs text-muted-foreground pt-1">
                              Approximately {formatCurrency(fees.total / 150, 'USD')} USD
                            </p>
                          )}
                          {method.currency === 'USD' && userLocation?.is_haiti && (
                            <p className="text-xs text-muted-foreground pt-1">
                              Approximately {formatCurrency(convertToHTG(fees.total), 'HTG')} HTG
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </Label>
                </div>
              )
            })}
          </RadioGroup>
        )}
        
        {/* Security Note */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your payment information is encrypted and secure. We never store your card details.
          </AlertDescription>
        </Alert>
        
        {/* Continue Button */}
        <Button
          onClick={handleMethodSelect}
          disabled={!selectedMethod || disabled || isDetectingLocation}
          className="w-full"
          size="lg"
        >
          {selectedMethod ? (
            <>
              Continue with {availableMethods.find(m => m.provider === selectedMethod)?.display_name}
              <CheckCircle className="w-4 h-4 ml-2" />
            </>
          ) : (
            'Select a payment method'
          )}
        </Button>
      </CardContent>
    </Card>
  )
}