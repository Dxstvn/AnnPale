"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Lock, Shield, Info } from "lucide-react"
import { cn } from "@/lib/utils"

const paymentMethods = [
  { id: "card", label: "Credit/Debit Card", icon: "💳" },
  { id: "paypal", label: "PayPal", icon: "🅿️" },
  { id: "apple", label: "Apple Pay", icon: "🍎" },
  { id: "google", label: "Google Pay", icon: "🪙" }
]

interface PaymentProcessingProps {
  bookingData: any
  updateBookingData: (data: any) => void
  creator: any
}

export function PaymentProcessing({ bookingData, updateBookingData, creator }: PaymentProcessingProps) {
  const [saveCard, setSaveCard] = useState(false)
  
  // Calculate total
  const basePrice = creator.price
  const rushFee = bookingData.rushDelivery ? 50 : 0
  const subtotal = basePrice + rushFee
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Payment Details
        </h2>
        <p className="text-gray-600">
          Complete your booking securely
        </p>
      </div>

      {/* Order Summary */}
      <Card className="p-6 bg-gray-50">
        <h3 className="font-medium text-gray-900 mb-4">Order Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Video from {creator.name}</span>
            <span className="font-medium">${basePrice}</span>
          </div>
          {rushFee > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Rush delivery (24hr)</span>
              <span className="font-medium">+${rushFee}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span className="text-purple-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </Card>

      {/* Payment Method Selection */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Payment Method
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => updateBookingData({ paymentMethod: method.id })}
              className={cn(
                "p-3 rounded-lg border-2 transition-all hover:shadow-md",
                bookingData.paymentMethod === method.id
                  ? "border-purple-600 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300 bg-white"
              )}
            >
              <div className="text-2xl mb-1">{method.icon}</div>
              <div className="text-xs font-medium">{method.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Card Details (if card payment selected) */}
      {bookingData.paymentMethod === "card" && (
        <>
          <div>
            <Label htmlFor="cardNumber" className="mb-2 block">
              Card Number
            </Label>
            <div className="relative">
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                value={bookingData.cardNumber || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim()
                  updateBookingData({ cardNumber: value })
                }}
                className="py-3 px-4 pr-12"
              />
              <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiry" className="mb-2 block">
                Expiry Date
              </Label>
              <Input
                id="expiry"
                placeholder="MM/YY"
                maxLength={5}
                value={bookingData.cardExpiry || ""}
                onChange={(e) => {
                  let value = e.target.value.replace(/\D/g, '')
                  if (value.length >= 2) {
                    value = value.slice(0, 2) + '/' + value.slice(2, 4)
                  }
                  updateBookingData({ cardExpiry: value })
                }}
                className="py-3 px-4"
              />
            </div>
            <div>
              <Label htmlFor="cvv" className="mb-2 block">
                CVV
              </Label>
              <Input
                id="cvv"
                type="password"
                placeholder="123"
                maxLength={4}
                value={bookingData.cardCvv || ""}
                onChange={(e) => updateBookingData({ cardCvv: e.target.value.replace(/\D/g, '') })}
                className="py-3 px-4"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cardName" className="mb-2 block">
              Cardholder Name
            </Label>
            <Input
              id="cardName"
              placeholder="John Doe"
              value={bookingData.cardName || ""}
              onChange={(e) => updateBookingData({ cardName: e.target.value })}
              className="py-3 px-4"
            />
          </div>
        </>
      )}

      {/* Billing Information */}
      <div>
        <h3 className="font-medium text-gray-900 mb-3">Billing Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="mb-2 block">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="your-email@example.com"
              value={bookingData.email || ""}
              onChange={(e) => updateBookingData({ email: e.target.value })}
              className="py-3 px-4"
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll send your receipt and video link here
            </p>
          </div>

          <div>
            <Label htmlFor="phone" className="mb-2 block">
              Phone Number (optional)
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={bookingData.phone || ""}
              onChange={(e) => updateBookingData({ phone: e.target.value })}
              className="py-3 px-4"
            />
          </div>
        </div>
      </div>

      {/* Security Badges */}
      <div className="flex items-center justify-center gap-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Lock className="h-4 w-4" />
          <span>256-bit SSL</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Shield className="h-4 w-4" />
          <span>PCI Compliant</span>
        </div>
      </div>

      {/* Terms and Conditions */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-2">
          <Info className="h-4 w-4 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-700">
            <p className="mb-1">
              By completing this purchase, you agree to our Terms of Service and Privacy Policy.
            </p>
            <p>
              Your video will be delivered within {bookingData.rushDelivery ? "24 hours" : creator.responseTime} or you'll receive a full refund.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}