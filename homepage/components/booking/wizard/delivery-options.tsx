"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import { CalendarDays, Clock, Zap, Info } from "lucide-react"
import { format, addDays } from "date-fns"
import { cn } from "@/lib/utils"

interface DeliveryOptionsProps {
  bookingData: any
  updateBookingData: (data: any) => void
  creator: any
}

export function DeliveryOptions({ bookingData, updateBookingData, creator }: DeliveryOptionsProps) {
  const [showCalendar, setShowCalendar] = useState(false)
  
  // Calculate delivery dates based on creator's response time
  const standardDelivery = addDays(new Date(), parseInt(creator.responseTime) || 2)
  const rushDelivery = addDays(new Date(), 1)

  const deliveryOptions = [
    {
      id: "standard",
      title: "Standard Delivery",
      time: creator.responseTime,
      date: format(standardDelivery, "MMM dd, yyyy"),
      price: 0,
      icon: <Clock className="h-5 w-5" />,
      description: `${creator.name} typically delivers within ${creator.responseTime}`
    },
    {
      id: "rush",
      title: "Rush Delivery",
      time: "24 hours",
      date: format(rushDelivery, "MMM dd, yyyy"),
      price: 50,
      icon: <Zap className="h-5 w-5" />,
      description: "Get your video within 24 hours",
      popular: true
    }
  ]

  const handleDeliverySelection = (option: typeof deliveryOptions[0]) => {
    updateBookingData({
      rushDelivery: option.id === "rush",
      deliveryDate: option.id === "standard" ? standardDelivery : rushDelivery,
      rushFee: option.price
    })
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          When do you need it?
        </h2>
        <p className="text-gray-600">
          Choose your delivery timing
        </p>
      </div>

      {/* Delivery Speed Options */}
      <div>
        <Label className="text-sm font-medium text-gray-700 mb-3 block">
          Delivery speed
        </Label>
        <div className="space-y-3">
          {deliveryOptions.map((option) => (
            <Card
              key={option.id}
              className={cn(
                "p-4 cursor-pointer transition-all hover:shadow-md",
                (bookingData.rushDelivery && option.id === "rush") || 
                (!bookingData.rushDelivery && option.id === "standard")
                  ? "border-purple-600 bg-purple-50"
                  : "hover:border-purple-400"
              )}
              onClick={() => handleDeliverySelection(option)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    option.id === "rush" 
                      ? "bg-orange-100 text-orange-600" 
                      : "bg-gray-100 text-gray-600"
                  )}>
                    {option.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium text-gray-900">{option.title}</h4>
                      {option.popular && (
                        <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                    <p className="text-sm font-medium text-purple-600 mt-1">
                      Delivered by {option.date}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {option.price > 0 ? (
                    <p className="font-bold text-lg">+${option.price}</p>
                  ) : (
                    <p className="text-sm text-gray-500">Included</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Specific Date Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium text-gray-700">
            Schedule for specific date
          </Label>
          <Switch
            checked={showCalendar}
            onCheckedChange={setShowCalendar}
          />
        </div>
        
        {showCalendar && (
          <Card className="p-4">
            <Calendar
              mode="single"
              selected={bookingData.scheduledDate}
              onSelect={(date) => updateBookingData({ scheduledDate: date })}
              disabled={(date) => date < new Date()}
              className="rounded-md"
            />
            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5" />
                <p className="text-xs text-blue-700">
                  Videos scheduled for a specific date will be delivered on that date at 9 AM recipient's timezone
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Delivery Reminders */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CalendarDays className="h-5 w-5 text-gray-500" />
            <div>
              <Label htmlFor="reminders" className="text-base font-medium cursor-pointer">
                Send me reminders
              </Label>
              <p className="text-sm text-gray-500">
                Get notified when the video is ready
              </p>
            </div>
          </div>
          <Switch
            id="reminders"
            checked={bookingData.sendReminders !== false}
            onCheckedChange={(checked) => updateBookingData({ sendReminders: checked })}
          />
        </div>
      </Card>

      {/* Delivery Guarantee */}
      <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
        <h4 className="font-medium text-green-900 mb-2">
          ✅ Delivery Guarantee
        </h4>
        <p className="text-sm text-green-700">
          If your video isn't delivered on time, you'll receive a full refund plus a 20% credit for your next booking.
        </p>
      </Card>
    </div>
  )
}