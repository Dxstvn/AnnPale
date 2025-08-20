"use client"

import * as React from "react"
import { EnhancedPaymentProcessing, type PaymentMethod } from "../../enhanced-payment-processing"
import type { StepComponentProps } from "../multi-step-wizard"
import { toast } from "sonner"

export function PaymentProcessing({
  data,
  updateData,
  errors,
  isActive
}: StepComponentProps) {
  // Calculate total from data
  const basePrice = data.basePrice || 150
  const deliveryPrice = data.deliveryPrice || 0
  const serviceFee = Math.round(basePrice * 0.1)
  const discount = data.discount || 0
  const total = basePrice + deliveryPrice + serviceFee - discount
  
  // Mock saved cards (in production, these would come from user account)
  const savedCards = React.useMemo(() => {
    if (data.userId) {
      return [
        {
          id: "card_1",
          last4: "4242",
          brand: "Visa",
          isDefault: true
        },
        {
          id: "card_2",
          last4: "5555",
          brand: "Mastercard",
          isDefault: false
        }
      ]
    }
    return []
  }, [data.userId])
  
  const handlePaymentComplete = (method: PaymentMethod, paymentData: any) => {
    updateData({
      ...data,
      paymentMethod: method,
      paymentData,
      paymentComplete: true
    })
    
    toast.success(`Payment processed successfully via ${method}`)
  }
  
  const handleBack = () => {
    // In a real implementation, this would navigate to the previous step
    console.log("Navigate to previous step")
  }
  
  if (!isActive) {
    return null
  }
  
  return (
    <div className="w-full max-w-2xl mx-auto">
      <EnhancedPaymentProcessing
        amount={total}
        creatorName={data.creatorName}
        onPaymentComplete={handlePaymentComplete}
        onBack={handleBack}
        savedCards={savedCards}
      />
    </div>
  )
}