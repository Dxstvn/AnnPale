"use client"

import * as React from "react"
import { MultiStepWizard, type WizardStep, type ValidationResult } from "./multi-step-wizard"
import { OccasionSelection } from "./steps/occasion-selection"
import { MessageDetails } from "./steps/message-details"
import { DeliveryOptions } from "./steps/delivery-options"
import { ReviewConfirmation } from "./steps/review-confirmation"
import { 
  Gift, 
  MessageSquare, 
  Package, 
  CheckCircle, 
  CreditCard 
} from "lucide-react"
import { toast } from "sonner"

// Payment step placeholder (would be imported from payment components)
function PaymentStep({ data, updateData, errors }: any) {
  return (
    <div className="space-y-4">
      <p className="text-center text-gray-500">
        Payment integration would go here
      </p>
      <p className="text-sm text-center text-gray-400">
        This would typically integrate with Stripe, PayPal, or other payment providers
      </p>
    </div>
  )
}

// Validation functions for each step
const validateOccasion = (data: any): ValidationResult => {
  const errors: Record<string, string> = {}
  
  if (!data.occasion && !data.customOccasion) {
    errors.occasion = "Please select an occasion"
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

const validateMessageDetails = (data: any): ValidationResult => {
  const errors: Record<string, string> = {}
  const warnings: Record<string, string> = {}
  
  if (!data.recipientName || data.recipientName.trim().length === 0) {
    errors.recipientName = "Recipient name is required"
  }
  
  if (!data.fromName || data.fromName.trim().length === 0) {
    errors.fromName = "Your name is required"
  }
  
  if (!data.instructions || data.instructions.trim().length < 20) {
    errors.instructions = "Please provide more detailed instructions (minimum 20 characters)"
  }
  
  if (data.instructions && data.instructions.length > 450) {
    warnings.instructions = "Your instructions are quite long. Consider being more concise."
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    warnings
  }
}

const validateDelivery = (data: any): ValidationResult => {
  const errors: Record<string, string> = {}
  
  if (!data.deliveryTier) {
    errors.deliveryTier = "Please select a delivery option"
  }
  
  if (data.deliveryTier === "scheduled" && !data.scheduledDate) {
    errors.scheduledDate = "Please select a delivery date"
  }
  
  if (data.isGift && data.giftMethod === "email" && !data.recipientEmail) {
    errors.recipientEmail = "Recipient email is required for email delivery"
  }
  
  if (data.isGift && data.giftMethod === "sms" && !data.recipientPhone) {
    errors.recipientPhone = "Recipient phone is required for SMS delivery"
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Define wizard steps
const bookingSteps: WizardStep[] = [
  {
    id: "occasion",
    title: "Choose Occasion",
    subtitle: "What are we celebrating?",
    icon: Gift,
    component: OccasionSelection,
    validation: validateOccasion,
    cognitiveLoad: "low",
    helpText: "Select the occasion for your video message. This helps the creator tailor their message perfectly."
  },
  {
    id: "details",
    title: "Message Details",
    subtitle: "Personalize your request",
    icon: MessageSquare,
    component: MessageDetails,
    validation: validateMessageDetails,
    cognitiveLoad: "medium",
    helpText: "Provide details about the recipient and what you'd like the creator to say.",
    skipCondition: (data) => data.useTemplate === true
  },
  {
    id: "delivery",
    title: "Delivery Options",
    subtitle: "When and how to deliver",
    icon: Package,
    component: DeliveryOptions,
    validation: validateDelivery,
    cognitiveLoad: "low",
    isOptional: false,
    helpText: "Choose how quickly you need the video and how it should be delivered."
  },
  {
    id: "review",
    title: "Review & Confirm",
    subtitle: "Check everything looks good",
    icon: CheckCircle,
    component: ReviewConfirmation,
    cognitiveLoad: "low",
    helpText: "Review your order details before proceeding to payment."
  },
  {
    id: "payment",
    title: "Payment",
    subtitle: "Secure checkout",
    icon: CreditCard,
    component: PaymentStep,
    cognitiveLoad: "high",
    helpText: "Complete your booking with secure payment.",
    skipCondition: (data) => data.hasSavedPayment === true
  }
]

interface BookingWizardProps {
  creatorId: string
  creatorName: string
  basePrice: number
  originalPrice?: number
  onComplete?: (bookingData: any) => void
  onCancel?: () => void
  initialData?: any
  allowDraft?: boolean
}

export function BookingWizard({
  creatorId,
  creatorName,
  basePrice,
  originalPrice,
  onComplete,
  onCancel,
  initialData = {},
  allowDraft = true
}: BookingWizardProps) {
  const handleComplete = async (data: any) => {
    // Add creator and pricing info to the data
    const completeData = {
      ...data,
      creatorId,
      creatorName,
      basePrice,
      originalPrice,
      bookingId: `booking_${Date.now()}`,
      createdAt: new Date().toISOString()
    }
    
    console.log("Booking completed:", completeData)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    toast.success("Booking confirmed! 🎉")
    
    if (onComplete) {
      onComplete(completeData)
    }
  }
  
  const handleSaveDraft = (data: any) => {
    console.log("Draft saved:", data)
    // In a real app, this would save to backend/localStorage
  }
  
  const handleCancel = () => {
    console.log("Booking cancelled")
    if (onCancel) {
      onCancel()
    }
  }
  
  // Set initial data with creator info
  const wizardInitialData = {
    ...initialData,
    creatorId,
    creatorName,
    basePrice,
    originalPrice
  }
  
  return (
    <MultiStepWizard
      steps={bookingSteps}
      initialData={wizardInitialData}
      onComplete={handleComplete}
      onSaveDraft={allowDraft ? handleSaveDraft : undefined}
      onCancel={handleCancel}
      allowSkip={false}
      allowSaveDraft={allowDraft}
      showProgressBar={true}
      progressVariant="bar"
      mobileOptimized={true}
      persistKey={`booking_${creatorId}`}
      analyticsTracking={true}
    />
  )
}

// Export a standalone booking wizard page component
export function BookingWizardPage({
  creatorId = "1",
  creatorName = "Sample Creator",
  basePrice = 150,
  originalPrice = 200
}: {
  creatorId?: string
  creatorName?: string
  basePrice?: number
  originalPrice?: number
}) {
  const [isComplete, setIsComplete] = React.useState(false)
  const [bookingData, setBookingData] = React.useState<any>(null)
  
  const handleComplete = (data: any) => {
    setBookingData(data)
    setIsComplete(true)
  }
  
  const handleCancel = () => {
    // Navigate back or close modal
    window.history.back()
  }
  
  if (isComplete && bookingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
          <p className="text-gray-600 mb-4">
            Your video request has been sent to {bookingData.creatorName}
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-gray-500 mb-1">Booking ID</p>
            <p className="font-mono text-sm">{bookingData.bookingId}</p>
            <p className="text-sm text-gray-500 mt-3 mb-1">Expected Delivery</p>
            <p className="font-medium">
              {bookingData.deliveryTimeline || "5-7 days"}
            </p>
          </div>
          <button
            onClick={() => window.location.href = "/"}
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">
            Book a Video from {creatorName}
          </h1>
          <p className="text-gray-600">
            Complete your booking in just a few simple steps
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <BookingWizard
            creatorId={creatorId}
            creatorName={creatorName}
            basePrice={basePrice}
            originalPrice={originalPrice}
            onComplete={handleComplete}
            onCancel={handleCancel}
            allowDraft={true}
          />
        </div>
      </div>
    </div>
  )
}