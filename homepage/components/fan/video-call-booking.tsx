"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Phone,
  Video,
  Clock,
  Calendar as CalendarIcon,
  DollarSign,
  Check,
  Star,
  Info,
  Shield,
  Sparkles,
  ChevronRight,
  Users,
  Globe,
  Zap,
  Award,
  Heart
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

interface VideoCallBookingProps {
  creator: {
    id: string
    name: string
    avatar?: string
    rating: number
    totalCalls: number
    responseTime: string
    languages: string[]
    pricePerMinute: number
    availability: {
      date: Date
      slots: string[]
    }[]
  }
  onBookingComplete?: (booking: any) => void
}

export function VideoCallBooking({ creator, onBookingComplete }: VideoCallBookingProps) {
  const { language } = useLanguage()
  const [selectedDuration, setSelectedDuration] = useState("5")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isBooking, setIsBooking] = useState(false)

  const durations = [
    {
      value: "5",
      label: "5 Minutes",
      price: creator.pricePerMinute * 5,
      popular: false,
      description: "Quick chat"
    },
    {
      value: "10",
      label: "10 Minutes",
      price: creator.pricePerMinute * 10,
      popular: true,
      description: "Standard session"
    },
    {
      value: "15",
      label: "15 Minutes",
      price: creator.pricePerMinute * 15,
      popular: false,
      description: "Extended conversation"
    },
    {
      value: "30",
      label: "30 Minutes",
      price: creator.pricePerMinute * 30,
      popular: false,
      description: "Deep dive session"
    }
  ]

  const timeSlots = [
    "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "2:00 PM", "2:30 PM",
    "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
    "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM"
  ]

  const benefits = [
    { icon: Video, text: "HD Video Quality" },
    { icon: Shield, text: "Secure & Private" },
    { icon: Globe, text: "Multi-language Support" },
    { icon: Award, text: "Satisfaction Guaranteed" }
  ]

  const handleBooking = async () => {
    setIsBooking(true)
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const booking = {
      creatorId: creator.id,
      creatorName: creator.name,
      duration: selectedDuration,
      date: selectedDate,
      time: selectedTime,
      price: durations.find(d => d.value === selectedDuration)?.price,
      status: "confirmed"
    }
    
    setIsBooking(false)
    setShowConfirmDialog(false)
    onBookingComplete?.(booking)
  }

  const selectedDurationDetails = durations.find(d => d.value === selectedDuration)

  return (
    <div className="space-y-6">
      {/* Creator Info Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={creator.avatar} />
              <AvatarFallback>{creator.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{creator.name}</h3>
              <div className="flex items-center gap-4 mt-2 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span>{creator.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>{creator.totalCalls} calls</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{creator.responseTime} response</span>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                {creator.languages.map((lang) => (
                  <Badge key={lang} variant="secondary">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Starting at</p>
              <p className="text-2xl font-bold text-purple-600">
                ${creator.pricePerMinute * 5}
              </p>
              <p className="text-sm text-gray-600">for 5 minutes</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="duration" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="duration">Duration</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="confirm">Confirm</TabsTrigger>
        </TabsList>

        {/* Duration Selection */}
        <TabsContent value="duration" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600" />
                Select Call Duration
              </CardTitle>
              <CardDescription>
                Choose how long you'd like to chat with {creator.name}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={selectedDuration}
                onValueChange={setSelectedDuration}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >
                {durations.map((duration) => (
                  <div key={duration.value} className="relative">
                    {duration.popular && (
                      <Badge className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    )}
                    <Label
                      htmlFor={duration.value}
                      className={cn(
                        "flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                        selectedDuration === duration.value
                          ? "border-purple-600 bg-purple-50"
                          : "border-gray-200 hover:border-purple-300"
                      )}
                    >
                      <RadioGroupItem value={duration.value} id={duration.value} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold">{duration.label}</p>
                            <p className="text-sm text-gray-600">{duration.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-purple-600">
                              ${duration.price}
                            </p>
                            <p className="text-xs text-gray-500">
                              ${creator.pricePerMinute}/min
                            </p>
                          </div>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              {/* Benefits */}
              <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  What's Included
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <benefit.icon className="h-4 w-4 text-purple-600" />
                      <span>{benefit.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schedule Selection */}
        <TabsContent value="schedule" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-purple-600" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Time Slots */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  Available Times
                </CardTitle>
                <CardDescription>
                  {selectedDate?.toLocaleDateString() || "Select a date"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className={cn(
                        selectedTime === time && "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      )}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
                <Alert className="mt-4">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    All times are shown in your local timezone
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Confirmation */}
        <TabsContent value="confirm" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Review Your Booking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Creator</span>
                  <span className="font-medium">{creator.name}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{selectedDurationDetails?.label}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Date</span>
                  <span className="font-medium">
                    {selectedDate?.toLocaleDateString() || "Not selected"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Time</span>
                  <span className="font-medium">{selectedTime || "Not selected"}</span>
                </div>
                <Separator />
                <div className="flex justify-between items-center py-2">
                  <span className="text-lg font-semibold">Total</span>
                  <span className="text-2xl font-bold text-purple-600">
                    ${selectedDurationDetails?.price}
                  </span>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Your call is protected by our satisfaction guarantee. If you're not happy, we'll make it right.
                </AlertDescription>
              </Alert>

              <Button
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:translate-y-[-2px] transition-all"
                size="lg"
                onClick={() => setShowConfirmDialog(true)}
                disabled={!selectedDate || !selectedTime}
              >
                <Phone className="h-5 w-5 mr-2" />
                Book Video Call
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Your Booking</DialogTitle>
            <DialogDescription>
              You're about to book a {selectedDurationDetails?.label} video call with {creator.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Date:</strong> {selectedDate?.toLocaleDateString()}
              </p>
              <p className="text-sm">
                <strong>Time:</strong> {selectedTime}
              </p>
              <p className="text-sm">
                <strong>Duration:</strong> {selectedDurationDetails?.label}
              </p>
              <p className="text-sm">
                <strong>Price:</strong> ${selectedDurationDetails?.price}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              onClick={handleBooking}
              disabled={isBooking}
            >
              {isBooking ? "Booking..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}