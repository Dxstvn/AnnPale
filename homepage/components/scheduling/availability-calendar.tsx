"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Calendar as CalendarIcon,
  Clock,
  Zap,
  AlertCircle,
  CheckCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  Loader2,
  MapPin,
  Globe
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { format, addDays, isSameDay, isAfter, isBefore, startOfDay, endOfDay } from "date-fns"

// Availability data types
export interface AvailabilityData {
  // Basic availability
  status: "available" | "limited" | "busy" | "unavailable"
  nextAvailable: Date
  timezone: string
  
  // Daily slots
  dailySlots: {
    [date: string]: {
      total: number
      available: number
      rush: boolean
      price?: number
    }
  }
  
  // Blackout dates
  blackoutDates: Date[]
  vacationPeriods?: Array<{
    start: Date
    end: Date
    reason?: string
  }>
  
  // Special availability
  rushAvailable: boolean
  rushSlots: number
  rushDeliveryTime: number // hours
  
  // Booking windows
  minAdvanceBooking: number // days
  maxAdvanceBooking: number // days
  
  // Statistics
  averageDeliveryTime: number // days
  onTimeRate: number // percentage
}

interface AvailabilityCalendarProps {
  data: AvailabilityData
  onDateSelect?: (date: Date) => void
  onRushToggle?: (enabled: boolean) => void
  className?: string
  variant?: "full" | "compact" | "week"
}

// Availability status indicators
const statusConfig = {
  available: {
    color: "bg-green-500",
    label: "Available",
    icon: CheckCircle,
    description: "Can deliver today"
  },
  limited: {
    color: "bg-yellow-500",
    label: "Limited Spots",
    icon: AlertCircle,
    description: "2-3 spots remaining"
  },
  busy: {
    color: "bg-orange-500",
    label: "Almost Full",
    icon: Clock,
    description: "1 spot remaining"
  },
  unavailable: {
    color: "bg-red-500",
    label: "Fully Booked",
    icon: CalendarIcon,
    description: "Next available date shown"
  }
}

// Quick status display
function QuickStatus({ 
  status, 
  nextAvailable,
  rushAvailable 
}: { 
  status: AvailabilityData["status"]
  nextAvailable: Date
  rushAvailable: boolean
}) {
  const config = statusConfig[status]
  const Icon = config.icon
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border"
    >
      <div className="flex items-center gap-3">
        <div className={cn("h-3 w-3 rounded-full animate-pulse", config.color)} />
        <div>
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4 text-gray-600" />
            <span className="font-medium">{config.label}</span>
          </div>
          <p className="text-xs text-gray-500">{config.description}</p>
        </div>
      </div>
      
      <div className="text-right">
        {status === "unavailable" ? (
          <div>
            <p className="text-xs text-gray-500">Next available</p>
            <p className="font-medium">
              {format(nextAvailable, "MMM d")}
            </p>
          </div>
        ) : (
          rushAvailable && (
            <Badge className="bg-orange-500">
              <Zap className="h-3 w-3 mr-1" />
              Rush Available
            </Badge>
          )
        )}
      </div>
    </motion.div>
  )
}

// Week view component
function WeekView({ 
  data,
  onDateSelect 
}: { 
  data: AvailabilityData
  onDateSelect?: (date: Date) => void
}) {
  const today = new Date()
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(today, i))
  
  const getSlotInfo = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd")
    return data.dailySlots[dateKey] || { total: 5, available: 5, rush: true }
  }
  
  const isBlackout = (date: Date) => {
    return data.blackoutDates.some(blackout => isSameDay(blackout, date))
  }
  
  return (
    <div className="grid grid-cols-7 gap-2">
      {weekDays.map((date, index) => {
        const slotInfo = getSlotInfo(date)
        const blackout = isBlackout(date)
        const availabilityPercent = (slotInfo.available / slotInfo.total) * 100
        
        let statusColor = "bg-green-100 text-green-700 border-green-300"
        if (blackout) {
          statusColor = "bg-gray-100 text-gray-400 border-gray-300"
        } else if (availabilityPercent === 0) {
          statusColor = "bg-red-100 text-red-700 border-red-300"
        } else if (availabilityPercent <= 40) {
          statusColor = "bg-yellow-100 text-yellow-700 border-yellow-300"
        }
        
        return (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => !blackout && slotInfo.available > 0 && onDateSelect?.(date)}
            disabled={blackout || slotInfo.available === 0}
            className={cn(
              "p-3 rounded-lg border text-center transition-all",
              statusColor,
              !blackout && slotInfo.available > 0 && "hover:shadow-md cursor-pointer",
              (blackout || slotInfo.available === 0) && "cursor-not-allowed opacity-50"
            )}
          >
            <p className="text-xs font-medium">{format(date, "EEE")}</p>
            <p className="text-lg font-bold">{format(date, "d")}</p>
            {!blackout && (
              <>
                <p className="text-xs mt-1">
                  {slotInfo.available}/{slotInfo.total}
                </p>
                {slotInfo.rush && slotInfo.available > 0 && (
                  <Zap className="h-3 w-3 mx-auto mt-1 text-orange-500" />
                )}
              </>
            )}
            {blackout && (
              <p className="text-xs mt-1">Unavailable</p>
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

// Calendar view with slot indicators
function CalendarView({ 
  data,
  selectedDate,
  onDateSelect 
}: { 
  data: AvailabilityData
  selectedDate?: Date
  onDateSelect?: (date: Date) => void
}) {
  const [currentMonth, setCurrentMonth] = React.useState(new Date())
  
  const getSlotInfo = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd")
    return data.dailySlots[dateKey] || { total: 5, available: 5, rush: true }
  }
  
  const isBlackout = (date: Date) => {
    return data.blackoutDates.some(blackout => isSameDay(blackout, date))
  }
  
  const isInVacation = (date: Date) => {
    return data.vacationPeriods?.some(period => 
      isAfter(date, period.start) && isBefore(date, period.end)
    ) || false
  }
  
  const minDate = addDays(new Date(), data.minAdvanceBooking)
  const maxDate = addDays(new Date(), data.maxAdvanceBooking)
  
  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentMonth(prev => addDays(prev, -30))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h3 className="font-medium">{format(currentMonth, "MMMM yyyy")}</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentMonth(prev => addDays(prev, 30))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Calendar */}
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(date) => date && onDateSelect?.(date)}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        disabled={(date) => {
          return (
            isBlackout(date) ||
            isInVacation(date) ||
            isBefore(date, minDate) ||
            isAfter(date, maxDate) ||
            getSlotInfo(date).available === 0
          )
        }}
        modifiers={{
          available: (date) => !isBlackout(date) && getSlotInfo(date).available > 0,
          limited: (date) => {
            const info = getSlotInfo(date)
            return info.available > 0 && info.available <= 2
          },
          rush: (date) => getSlotInfo(date).rush
        }}
        modifiersStyles={{
          available: { backgroundColor: "rgb(220 252 231)" },
          limited: { backgroundColor: "rgb(254 240 138)" },
          rush: { border: "2px solid rgb(251 146 60)" }
        }}
        className="rounded-md border"
      />
      
      {/* Legend */}
      <div className="flex flex-wrap gap-3 text-xs">
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 bg-green-100 rounded border border-green-300" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 bg-yellow-100 rounded border border-yellow-300" />
          <span>Limited</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 bg-white rounded border-2 border-orange-400" />
          <span>Rush</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="h-3 w-3 bg-gray-100 rounded border border-gray-300" />
          <span>Unavailable</span>
        </div>
      </div>
    </div>
  )
}

// Urgency indicators
function UrgencyIndicators({ 
  data 
}: { 
  data: AvailabilityData 
}) {
  const today = new Date()
  const todayKey = format(today, "yyyy-MM-dd")
  const todaySlots = data.dailySlots[todayKey] || { available: 0, total: 5 }
  
  const urgencyMessages = []
  
  if (todaySlots.available === 1) {
    urgencyMessages.push({
      type: "critical",
      message: "Only 1 spot left today!",
      icon: AlertCircle
    })
  } else if (todaySlots.available <= 3) {
    urgencyMessages.push({
      type: "warning",
      message: `${todaySlots.available} spots remaining today`,
      icon: Clock
    })
  }
  
  if (data.rushAvailable && data.rushSlots <= 2) {
    urgencyMessages.push({
      type: "rush",
      message: `Rush delivery: ${data.rushSlots} slots left`,
      icon: Zap
    })
  }
  
  if (urgencyMessages.length === 0) return null
  
  return (
    <AnimatePresence>
      <div className="space-y-2">
        {urgencyMessages.map((msg, index) => {
          const colors = {
            critical: "bg-red-50 border-red-200 text-red-700",
            warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
            rush: "bg-orange-50 border-orange-200 text-orange-700"
          }
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "flex items-center gap-2 p-2 rounded-lg border",
                colors[msg.type as keyof typeof colors]
              )}
            >
              <msg.icon className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm font-medium">{msg.message}</span>
            </motion.div>
          )
        })}
      </div>
    </AnimatePresence>
  )
}

// Delivery time expectations
function DeliveryExpectations({ 
  data 
}: { 
  data: AvailabilityData 
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Delivery Times
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
          <span className="text-sm">Standard Delivery</span>
          <Badge variant="secondary">{data.averageDeliveryTime} days</Badge>
        </div>
        
        {data.rushAvailable && (
          <div className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
            <span className="text-sm flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Rush Delivery
            </span>
            <Badge className="bg-orange-500">{data.rushDeliveryTime} hours</Badge>
          </div>
        )}
        
        <div className="pt-2 border-t">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">On-time delivery rate</span>
            <span className="font-medium text-green-600">{data.onTimeRate}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Timezone display
function TimezoneInfo({ 
  timezone 
}: { 
  timezone: string 
}) {
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone
  const currentTime = new Date().toLocaleTimeString("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit"
  })
  
  return (
    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <div className="flex items-center gap-2">
        <Globe className="h-4 w-4 text-blue-600" />
        <div>
          <p className="text-sm font-medium">Creator's Timezone</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">{timezone}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-sm font-medium">{currentTime}</p>
        {timezone !== userTimezone && (
          <p className="text-xs text-gray-500">Your time: {userTimezone}</p>
        )}
      </div>
    </div>
  )
}

// Main availability calendar component
export function AvailabilityCalendar({
  data,
  onDateSelect,
  onRushToggle,
  className,
  variant = "full"
}: AvailabilityCalendarProps) {
  const [selectedDate, setSelectedDate] = React.useState<Date>()
  const [viewMode, setViewMode] = React.useState<"week" | "month">("week")
  const [rushEnabled, setRushEnabled] = React.useState(false)
  
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    onDateSelect?.(date)
  }
  
  const handleRushToggle = (enabled: boolean) => {
    setRushEnabled(enabled)
    onRushToggle?.(enabled)
  }
  
  if (variant === "compact") {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-base">Availability</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <QuickStatus
            status={data.status}
            nextAvailable={data.nextAvailable}
            rushAvailable={data.rushAvailable}
          />
          <WeekView data={data} onDateSelect={handleDateSelect} />
          <UrgencyIndicators data={data} />
        </CardContent>
      </Card>
    )
  }
  
  if (variant === "week") {
    return (
      <div className={cn("space-y-4", className)}>
        <QuickStatus
          status={data.status}
          nextAvailable={data.nextAvailable}
          rushAvailable={data.rushAvailable}
        />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Next 7 Days</CardTitle>
            <CardDescription>Select your preferred delivery date</CardDescription>
          </CardHeader>
          <CardContent>
            <WeekView data={data} onDateSelect={handleDateSelect} />
          </CardContent>
        </Card>
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-900/20">
              <CardContent className="p-4">
                <p className="text-sm font-medium">Selected Date</p>
                <p className="text-lg font-bold text-purple-600">
                  {format(selectedDate, "EEEE, MMMM d")}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    )
  }
  
  // Full variant (default)
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header with quick status */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Availability & Scheduling</h2>
        <QuickStatus
          status={data.status}
          nextAvailable={data.nextAvailable}
          rushAvailable={data.rushAvailable}
        />
        <UrgencyIndicators data={data} />
      </div>
      
      {/* View mode toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("week")}
          >
            Week View
          </Button>
          <Button
            variant={viewMode === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("month")}
          >
            Calendar View
          </Button>
        </div>
        
        {data.rushAvailable && (
          <div className="flex items-center gap-2">
            <label htmlFor="rush-toggle" className="text-sm font-medium">
              Rush Delivery
            </label>
            <Button
              id="rush-toggle"
              variant={rushEnabled ? "default" : "outline"}
              size="sm"
              onClick={() => handleRushToggle(!rushEnabled)}
              className={cn(
                rushEnabled && "bg-orange-500 hover:bg-orange-600"
              )}
            >
              <Zap className="h-4 w-4 mr-1" />
              {rushEnabled ? "Enabled" : "Enable"}
            </Button>
          </div>
        )}
      </div>
      
      {/* Main calendar/week view */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {viewMode === "week" ? "Next 7 Days" : "Select Date"}
              </CardTitle>
              <CardDescription>
                Choose your preferred delivery date
              </CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === "week" ? (
                <WeekView data={data} onDateSelect={handleDateSelect} />
              ) : (
                <CalendarView
                  data={data}
                  selectedDate={selectedDate}
                  onDateSelect={handleDateSelect}
                />
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Side information */}
        <div className="space-y-4">
          <TimezoneInfo timezone={data.timezone} />
          <DeliveryExpectations data={data} />
          
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                <CardHeader>
                  <CardTitle className="text-base">Selected Delivery</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-xl font-bold text-purple-600">
                    {format(selectedDate, "EEEE")}
                  </p>
                  <p className="text-lg font-medium">
                    {format(selectedDate, "MMMM d, yyyy")}
                  </p>
                  {rushEnabled && (
                    <Badge className="bg-orange-500">
                      <Zap className="h-3 w-3 mr-1" />
                      Rush Delivery
                    </Badge>
                  )}
                  <Button className="w-full mt-4">
                    Confirm Date
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}