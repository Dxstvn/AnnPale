"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Mail, Download, Share2, Calendar, Clock } from "lucide-react"
import { format } from "date-fns"
import confetti from "canvas-confetti"
import { useEffect } from "react"

interface BookingConfirmationProps {
  bookingData: any
  creator: any
}

export function BookingConfirmation({ bookingData, creator }: BookingConfirmationProps) {
  // Trigger confetti animation on mount
  useEffect(() => {
    const duration = 3 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#9333EA', '#EC4899', '#F59E0B', '#10B981']
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#9333EA', '#EC4899', '#F59E0B', '#10B981']
      })
    }, 250)

    return () => clearInterval(interval)
  }, [])

  const orderNumber = `AP${Date.now().toString().slice(-8)}`
  const deliveryDate = bookingData.deliveryDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)

  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="p-4 bg-green-100 rounded-full">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Booking Confirmed! 🎉
        </h2>
        <p className="text-lg text-gray-600">
          Your video from {creator.name} is on its way!
        </p>
      </div>

      {/* Order Details Card */}
      <Card className="p-6">
        <h3 className="font-medium text-gray-900 mb-4">Order Details</h3>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Order Number</span>
            <span className="font-mono font-medium">{orderNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Creator</span>
            <span className="font-medium">{creator.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Recipient</span>
            <span className="font-medium">{bookingData.recipient}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Occasion</span>
            <span className="font-medium capitalize">{bookingData.occasion}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Paid</span>
            <span className="font-bold text-lg text-purple-600">
              ${(creator.price + (bookingData.rushDelivery ? 50 : 0) + creator.price * 0.1).toFixed(2)}
            </span>
          </div>
        </div>
      </Card>

      {/* Delivery Information */}
      <Card className="p-6 bg-purple-50 border-purple-200">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <Calendar className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium text-purple-900 mb-1">
              Expected Delivery
            </h3>
            <p className="text-purple-700 font-medium">
              {format(deliveryDate, "EEEE, MMMM d, yyyy")}
            </p>
            <p className="text-sm text-purple-600 mt-1">
              {bookingData.rushDelivery ? "Rush delivery - within 24 hours" : `Standard delivery - ${creator.responseTime}`}
            </p>
          </div>
        </div>
      </Card>

      {/* What Happens Next */}
      <Card className="p-6">
        <h3 className="font-medium text-gray-900 mb-4">What Happens Next?</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Check your email</p>
              <p className="text-sm text-gray-600">
                We've sent a confirmation to {bookingData.email}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{creator.name} creates your video</p>
              <p className="text-sm text-gray-600">
                They'll record a personalized message just for {bookingData.recipient}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Download className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Video delivered</p>
              <p className="text-sm text-gray-600">
                You'll receive an email with the video link to download and share
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg">
          <Share2 className="h-4 w-4 mr-2" />
          Share the News
        </Button>
        <Button variant="outline" className="flex-1 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:shadow-md transition-all duration-300">
          View Order Details
        </Button>
      </div>

      {/* Satisfaction Guarantee */}
      <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <h4 className="font-medium text-green-900 mb-2">
          💯 100% Satisfaction Guarantee
        </h4>
        <p className="text-sm text-green-700">
          If you're not completely satisfied with your video, we'll work with {creator.name} to make it right or provide a full refund.
        </p>
      </Card>
    </div>
  )
}