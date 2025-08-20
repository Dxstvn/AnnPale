"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useLanguage } from "@/contexts/language-context"
import { getTranslation } from "@/lib/translations"
import { Check, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

// Import booking components
import { OccasionSelection } from "@/components/booking/wizard/occasion-selection"
import { MessageDetails } from "@/components/booking/wizard/message-details"
import { GiftOptions } from "@/components/booking/wizard/gift-options"
import { DeliveryOptions } from "@/components/booking/wizard/delivery-options"
import { PaymentProcessing } from "@/components/booking/wizard/payment-processing"
import { BookingConfirmation } from "@/components/booking/wizard/booking-confirmation"

// Mock creator data
const creators = {
  "1": {
    id: "1",
    name: "Wyclef Jean",
    price: 150,
    image: "/images/wyclef-jean.png",
    responseTime: "24hr",
    rating: 4.9,
    reviews: 1247
  },
  "2": {
    id: "2",
    name: "Ti Jo Zenny",
    price: 85,
    image: "/images/ti-jo-zenny.jpg",
    responseTime: "2 days",
    rating: 4.8,
    reviews: 456
  }
}

const steps = [
  { id: 1, name: "Occasion", icon: "🎉" },
  { id: 2, name: "Message", icon: "✍️" },
  { id: 3, name: "Gift Options", icon: "🎁" },
  { id: 4, name: "Delivery", icon: "📅" },
  { id: 5, name: "Payment", icon: "💳" },
  { id: 6, name: "Confirmation", icon: "✅" }
]

export default function BookingPage() {
  const params = useParams()
  const router = useRouter()
  const { language } = useLanguage()
  const [currentStep, setCurrentStep] = useState(1)
  const [isAnimating, setIsAnimating] = useState(false)
  const [bookingData, setBookingData] = useState({
    creatorId: params.id as string,
    occasion: "",
    recipient: "",
    message: "",
    isGift: false,
    giftFrom: "",
    giftMessage: "",
    deliveryDate: null as Date | null,
    rushDelivery: false,
    paymentMethod: "",
    email: "",
    phone: ""
  })

  const creator = creators[params.id as keyof typeof creators]

  useEffect(() => {
    if (!creator) {
      router.push("/browse")
    }
  }, [creator, router])

  if (!creator) {
    return null
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(currentStep - 1)
        setIsAnimating(false)
      }, 300)
    }
  }

  const handleStepClick = (stepId: number) => {
    if (stepId < currentStep) {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentStep(stepId)
        setIsAnimating(false)
      }, 300)
    }
  }

  const updateBookingData = (data: Partial<typeof bookingData>) => {
    setBookingData(prev => ({ ...prev, ...data }))
  }

  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-16 z-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="hover:bg-gray-100 hover:border-2 hover:border-black"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="text-center">
              <h1 className="text-xl font-bold text-gray-900">
                Book {creator.name}
              </h1>
              <p className="text-sm text-gray-600">
                ${creator.price} per video
              </p>
            </div>
            <div className="w-20" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            {/* Step Indicators */}
            <div className="flex justify-between mb-4">
              {steps.map((step) => (
                <button
                  key={step.id}
                  onClick={() => handleStepClick(step.id)}
                  disabled={step.id > currentStep}
                  className={cn(
                    "flex flex-col items-center gap-2 transition-all",
                    step.id === currentStep && "scale-110",
                    step.id < currentStep && "cursor-pointer"
                  )}
                >
                  <div
                    className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-xl transition-all",
                      step.id === currentStep && "bg-purple-600 text-white shadow-lg",
                      step.id < currentStep && "bg-green-500 text-white",
                      step.id > currentStep && "bg-gray-200 text-gray-400"
                    )}
                  >
                    {step.id < currentStep ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <span>{step.icon}</span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium hidden sm:block",
                      step.id === currentStep && "text-purple-600",
                      step.id < currentStep && "text-green-600",
                      step.id > currentStep && "text-gray-400"
                    )}
                  >
                    {step.name}
                  </span>
                </button>
              ))}
            </div>
            {/* Progress Bar */}
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: isAnimating ? 50 : 0 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isAnimating ? -50 : 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 md:p-8"
              >
                {/* Step Content */}
                {currentStep === 1 && (
                  <OccasionSelection
                    bookingData={bookingData}
                    updateBookingData={updateBookingData}
                    creator={creator}
                  />
                )}
                {currentStep === 2 && (
                  <MessageDetails
                    bookingData={bookingData}
                    updateBookingData={updateBookingData}
                    creator={creator}
                  />
                )}
                {currentStep === 3 && (
                  <GiftOptions
                    bookingData={bookingData}
                    updateBookingData={updateBookingData}
                  />
                )}
                {currentStep === 4 && (
                  <DeliveryOptions
                    bookingData={bookingData}
                    updateBookingData={updateBookingData}
                    creator={creator}
                  />
                )}
                {currentStep === 5 && (
                  <PaymentProcessing
                    bookingData={bookingData}
                    updateBookingData={updateBookingData}
                    creator={creator}
                  />
                )}
                {currentStep === 6 && (
                  <BookingConfirmation
                    bookingData={bookingData}
                    creator={creator}
                  />
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-8 pt-6 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentStep === 1}
                    className="hover:bg-gray-100 hover:border-2 hover:border-black"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  {currentStep < steps.length ? (
                    <Button
                      onClick={handleNext}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
                    >
                      Next
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={() => router.push(`/booking-confirmation/${bookingData.creatorId}`)}
                      className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-lg"
                    >
                      Complete Booking
                      <Check className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </Card>

          {/* Trust Badges */}
          <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="text-green-500">🔒</span>
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-500">💯</span>
              <span>100% Satisfaction Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-purple-500">⚡</span>
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}