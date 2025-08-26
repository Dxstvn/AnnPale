"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CreditCard, Lock, CheckCircle, AlertCircle, Info, Shield } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface EnhancedPaymentFormProps {
  amount: number
  currency?: string
  description?: string
  onPaymentSuccess?: (paymentId: string) => void
  onPaymentError?: (error: string) => void
  className?: string
}

export function EnhancedPaymentForm({ 
  amount, 
  currency = "USD",
  description = "Video request payment",
  onPaymentSuccess,
  onPaymentError,
  className
}: EnhancedPaymentFormProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    zipCode: ""
  })
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [focusedField, setFocusedField] = useState<string | null>(null)

  const formatCurrency = (value: number, curr: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: curr.toUpperCase(),
      minimumFractionDigits: 2
    }).format(value)
  }

  const validateField = (name: string, value: string) => {
    const errors: Record<string, string> = {}
    
    switch (name) {
      case 'email':
        if (!value.trim()) {
          errors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.email = 'Please enter a valid email address'
        }
        break
      case 'cardholderName':
        if (!value.trim()) {
          errors.cardholderName = 'Cardholder name is required'
        } else if (value.trim().length < 2) {
          errors.cardholderName = 'Please enter a valid name'
        }
        break
      case 'cardNumber':
        const cleanCard = value.replace(/\s+/g, '')
        if (!cleanCard) {
          errors.cardNumber = 'Card number is required'
        } else if (cleanCard.length < 13 || cleanCard.length > 19) {
          errors.cardNumber = 'Please enter a valid card number'
        }
        break
      case 'expiryDate':
        if (!value.trim()) {
          errors.expiryDate = 'Expiry date is required'
        } else if (!/^\d{2}\/\d{2}$/.test(value)) {
          errors.expiryDate = 'Please enter MM/YY format'
        }
        break
      case 'cvc':
        if (!value.trim()) {
          errors.cvc = 'CVC is required'
        } else if (value.length < 3 || value.length > 4) {
          errors.cvc = 'Please enter a valid CVC'
        }
        break
    }

    setFieldErrors(prev => ({ ...prev, ...errors }))
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (name: string, value: string) => {
    // Format specific fields
    let formattedValue = value

    if (name === 'cardNumber') {
      // Format card number with spaces
      formattedValue = value.replace(/\s+/g, '').replace(/(\d{4})/g, '$1 ').trim()
    } else if (name === 'expiryDate') {
      // Format expiry date MM/YY
      formattedValue = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '$1/$2')
        .substr(0, 5)
    } else if (name === 'cvc') {
      // Only allow numbers for CVC
      formattedValue = value.replace(/\D/g, '').substr(0, 4)
    }

    setFormData(prev => ({ ...prev, [name]: formattedValue }))
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate all fields
    const isValid = Object.keys(formData).every(field => 
      validateField(field, formData[field as keyof typeof formData])
    )

    if (!isValid) {
      setError("Please correct the errors above")
      return
    }

    setIsProcessing(true)

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate success/failure based on card number
      if (formData.cardNumber.startsWith('4242')) {
        setPaymentComplete(true)
        onPaymentSuccess?.('pi_test_success_123')
      } else if (formData.cardNumber.startsWith('4000 0000 0000 9995')) {
        throw new Error('Your card was declined. Please try a different card.')
      } else {
        throw new Error('Payment processing failed. Please try again.')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed'
      setError(errorMessage)
      onPaymentError?.(errorMessage)
    } finally {
      setIsProcessing(false)
    }
  }

  if (paymentComplete) {
    return (
      <Card className={cn("w-full max-w-md mx-auto", className)}>
        <CardContent className="pt-8 pb-6">
          <div className="text-center space-y-4">
            <div className="p-3 bg-green-100 rounded-full w-fit mx-auto">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-green-900">Payment Successful!</h3>
              <p className="text-green-700 mt-2">
                Your payment of {formatCurrency(amount, currency)} has been processed successfully.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full max-w-md mx-auto", className)}>
      <CardHeader className="space-y-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <CreditCard className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-xl">Payment Details</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
        </div>
        
        {/* Amount Display */}
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <div className="flex justify-between items-center">
            <span className="text-purple-800 font-medium">Total Amount</span>
            <span className="text-2xl font-bold text-purple-900">
              {formatCurrency(amount, currency)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address *
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => validateField('email', formData.email)}
              onFocus={() => setFocusedField('email')}
              className={cn(
                "transition-colors",
                fieldErrors.email && "border-red-500 focus:ring-red-500",
                focusedField === 'email' && "ring-2 ring-purple-500"
              )}
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "email-error" : undefined}
              autoComplete="email"
              required
            />
            {fieldErrors.email && (
              <div id="email-error" className="flex items-center gap-1 text-sm text-red-600" role="alert">
                <AlertCircle className="h-4 w-4" />
                {fieldErrors.email}
              </div>
            )}
          </div>

          {/* Cardholder Name */}
          <div className="space-y-2">
            <Label htmlFor="cardholder-name" className="text-sm font-medium">
              Cardholder Name *
            </Label>
            <Input
              id="cardholder-name"
              type="text"
              placeholder="John Doe"
              value={formData.cardholderName}
              onChange={(e) => handleInputChange('cardholderName', e.target.value)}
              onBlur={() => validateField('cardholderName', formData.cardholderName)}
              onFocus={() => setFocusedField('cardholderName')}
              className={cn(
                "transition-colors",
                fieldErrors.cardholderName && "border-red-500 focus:ring-red-500",
                focusedField === 'cardholderName' && "ring-2 ring-purple-500"
              )}
              aria-invalid={!!fieldErrors.cardholderName}
              aria-describedby={fieldErrors.cardholderName ? "name-error" : undefined}
              autoComplete="cc-name"
              required
            />
            {fieldErrors.cardholderName && (
              <div id="name-error" className="flex items-center gap-1 text-sm text-red-600" role="alert">
                <AlertCircle className="h-4 w-4" />
                {fieldErrors.cardholderName}
              </div>
            )}
          </div>

          {/* Card Number */}
          <div className="space-y-2">
            <Label htmlFor="card-number" className="text-sm font-medium">
              Card Number *
            </Label>
            <Input
              id="card-number"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
              onBlur={() => validateField('cardNumber', formData.cardNumber)}
              onFocus={() => setFocusedField('cardNumber')}
              className={cn(
                "transition-colors font-mono",
                fieldErrors.cardNumber && "border-red-500 focus:ring-red-500",
                focusedField === 'cardNumber' && "ring-2 ring-purple-500"
              )}
              aria-invalid={!!fieldErrors.cardNumber}
              aria-describedby={fieldErrors.cardNumber ? "card-error" : undefined}
              autoComplete="cc-number"
              maxLength={23} // 16 digits + 3 spaces
              required
            />
            {fieldErrors.cardNumber && (
              <div id="card-error" className="flex items-center gap-1 text-sm text-red-600" role="alert">
                <AlertCircle className="h-4 w-4" />
                {fieldErrors.cardNumber}
              </div>
            )}
          </div>

          {/* Expiry and CVC Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry" className="text-sm font-medium">
                Expiry Date *
              </Label>
              <Input
                id="expiry"
                type="text"
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                onBlur={() => validateField('expiryDate', formData.expiryDate)}
                onFocus={() => setFocusedField('expiryDate')}
                className={cn(
                  "transition-colors font-mono",
                  fieldErrors.expiryDate && "border-red-500 focus:ring-red-500",
                  focusedField === 'expiryDate' && "ring-2 ring-purple-500"
                )}
                aria-invalid={!!fieldErrors.expiryDate}
                aria-describedby={fieldErrors.expiryDate ? "expiry-error" : undefined}
                autoComplete="cc-exp"
                maxLength={5}
                required
              />
              {fieldErrors.expiryDate && (
                <div id="expiry-error" className="flex items-center gap-1 text-sm text-red-600" role="alert">
                  <AlertCircle className="h-4 w-4" />
                  {fieldErrors.expiryDate}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvc" className="text-sm font-medium">
                CVC *
              </Label>
              <Input
                id="cvc"
                type="text"
                placeholder="123"
                value={formData.cvc}
                onChange={(e) => handleInputChange('cvc', e.target.value)}
                onBlur={() => validateField('cvc', formData.cvc)}
                onFocus={() => setFocusedField('cvc')}
                className={cn(
                  "transition-colors font-mono",
                  fieldErrors.cvc && "border-red-500 focus:ring-red-500",
                  focusedField === 'cvc' && "ring-2 ring-purple-500"
                )}
                aria-invalid={!!fieldErrors.cvc}
                aria-describedby={fieldErrors.cvc ? "cvc-error" : "cvc-help"}
                autoComplete="cc-csc"
                maxLength={4}
                required
              />
              <div id="cvc-help" className="text-xs text-gray-500">
                3-4 digit code on back of card
              </div>
              {fieldErrors.cvc && (
                <div id="cvc-error" className="flex items-center gap-1 text-sm text-red-600" role="alert">
                  <AlertCircle className="h-4 w-4" />
                  {fieldErrors.cvc}
                </div>
              )}
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert variant="destructive" role="alert">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Security Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-blue-800">
              <Shield className="h-4 w-4" />
              <span className="font-medium">Secure Payment</span>
            </div>
            <p className="text-xs text-blue-700 mt-1">
              Your payment information is encrypted and secure. Powered by Stripe.
            </p>
          </div>

          {/* Test Cards Info */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Info className="h-4 w-4" />
              Test Card Numbers
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>✓ Success: <code className="bg-white px-1 rounded">4242 4242 4242 4242</code></div>
              <div>✓ 3D Secure: <code className="bg-white px-1 rounded">4000 0025 0000 3155</code></div>
              <div>✗ Declined: <code className="bg-white px-1 rounded">4000 0000 0000 9995</code></div>
              <p className="text-gray-500 mt-1">Use any future date and any CVC</p>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full h-12 text-base font-medium bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Processing Payment...
              </div>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Pay {formatCurrency(amount, currency)}
              </>
            )}
          </Button>

          {/* Terms */}
          <p className="text-xs text-center text-gray-500 mt-4">
            By completing this payment, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </CardContent>
    </Card>
  )
}