"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Clock,
  Zap,
  Calendar,
  AlertCircle,
  CheckCircle,
  Users,
  Star,
  TrendingUp,
  Sparkles,
  Video,
  Info,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { format, parse, addMinutes, isAfter, isBefore } from "date-fns"

// Time slot data types
export interface TimeSlot {
  id: string
  startTime: string // "HH:mm" format
  endTime: string
  available: boolean
  capacity: number
  booked: number
  price?: number
  priceModifier?: number // percentage
  isPopular?: boolean
  isPeak?: boolean
  isLastMinute?: boolean
  rushEligible?: boolean
}

export interface TimeSlotGroup {
  label: string
  slots: TimeSlot[]
}

export interface TimeSlotSelectorData {
  date: Date
  timezone: string
  groups: TimeSlotGroup[]
  rushAvailable: boolean
  popularTimes?: string[]
  peakHours?: { start: string; end: string }[]
  lastMinuteDiscount?: number
  dynamicPricing?: boolean
}

interface TimeSlotSelectorProps {
  data: TimeSlotSelectorData
  onSlotSelect?: (slot: TimeSlot) => void
  selectedSlot?: TimeSlot | null
  className?: string
  variant?: "grid" | "list" | "compact"
}

// Time slot card component
function TimeSlotCard({
  slot,
  isSelected,
  onSelect,
  timezone
}: {
  slot: TimeSlot
  isSelected: boolean
  onSelect: () => void
  timezone: string
}) {
  const availability = ((slot.capacity - slot.booked) / slot.capacity) * 100
  const spotsLeft = slot.capacity - slot.booked
  
  let statusColor = "border-gray-200"
  let statusBg = "bg-white dark:bg-gray-800"
  
  if (!slot.available) {
    statusColor = "border-gray-300 opacity-50"
    statusBg = "bg-gray-50 dark:bg-gray-900"
  } else if (isSelected) {
    statusColor = "border-purple-500 ring-2 ring-purple-500"
    statusBg = "bg-purple-50 dark:bg-purple-900/20"
  } else if (slot.isPopular) {
    statusColor = "border-yellow-400"
  } else if (slot.isPeak) {
    statusColor = "border-orange-400"
  } else if (spotsLeft <= 1) {
    statusColor = "border-red-400"
  }
  
  return (
    <motion.button
      whileHover={slot.available ? { scale: 1.02 } : {}}
      whileTap={slot.available ? { scale: 0.98 } : {}}
      onClick={onSelect}
      disabled={!slot.available}
      className={cn(
        "relative p-4 rounded-lg border-2 transition-all text-left w-full",
        statusColor,
        statusBg,
        slot.available && "cursor-pointer hover:shadow-md",
        !slot.available && "cursor-not-allowed"
      )}
    >
      {/* Badges */}
      <div className="absolute -top-2 -right-2 flex gap-1">
        {slot.isPopular && (
          <Badge className="bg-yellow-500 text-xs">
            <Star className="h-3 w-3 mr-0.5" />
            Popular
          </Badge>
        )}
        {slot.isPeak && (
          <Badge className="bg-orange-500 text-xs">
            <TrendingUp className="h-3 w-3 mr-0.5" />
            Peak
          </Badge>
        )}
        {slot.isLastMinute && (
          <Badge className="bg-green-500 text-xs">
            <Sparkles className="h-3 w-3 mr-0.5" />
            Deal
          </Badge>
        )}
        {spotsLeft === 1 && slot.available && (
          <Badge className="bg-red-500 text-xs">
            Last Spot!
          </Badge>
        )}
      </div>
      
      {/* Time display */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-gray-500" />
          <span className="font-semibold">
            {slot.startTime} - {slot.endTime}
          </span>
        </div>
        {slot.rushEligible && (
          <Zap className="h-4 w-4 text-orange-500" />
        )}
      </div>
      
      {/* Availability bar */}
      {slot.available && (
        <div className="mb-2">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>{spotsLeft} spots left</span>
            <span>{slot.booked}/{slot.capacity}</span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${100 - availability}%` }}
              className={cn(
                "h-full",
                availability > 60 && "bg-green-500",
                availability > 20 && availability <= 60 && "bg-yellow-500",
                availability <= 20 && "bg-red-500"
              )}
            />
          </div>
        </div>
      )}
      
      {/* Price */}
      {slot.price && (
        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1">
            {slot.priceModifier && slot.priceModifier !== 0 ? (
              <>
                <span className="text-lg font-bold">
                  ${Math.round(slot.price * (1 + slot.priceModifier / 100))}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  ${slot.price}
                </span>
                <Badge variant="secondary" className="text-xs ml-1">
                  {slot.priceModifier > 0 ? "+" : ""}{slot.priceModifier}%
                </Badge>
              </>
            ) : (
              <span className="text-lg font-bold">${slot.price}</span>
            )}
          </div>
          {isSelected && (
            <CheckCircle className="h-5 w-5 text-purple-600" />
          )}
        </div>
      )}
      
      {/* Unavailable overlay */}
      {!slot.available && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 dark:bg-gray-900/80 rounded-lg">
          <span className="font-medium text-gray-500">Fully Booked</span>
        </div>
      )}
    </motion.button>
  )
}

// Time period selector (Morning, Afternoon, Evening)
function TimePeriodFilter({
  groups,
  selectedPeriod,
  onPeriodChange
}: {
  groups: TimeSlotGroup[]
  selectedPeriod: string
  onPeriodChange: (period: string) => void
}) {
  const periods = groups.map(g => ({
    value: g.label,
    label: g.label,
    icon: g.label === "Morning" ? "☀️" : g.label === "Afternoon" ? "🌤️" : "🌙",
    available: g.slots.some(s => s.available)
  }))
  
  return (
    <div className="flex gap-2">
      {periods.map((period) => (
        <Button
          key={period.value}
          variant={selectedPeriod === period.value ? "default" : "outline"}
          size="sm"
          onClick={() => onPeriodChange(period.value)}
          disabled={!period.available}
          className={cn(
            !period.available && "opacity-50"
          )}
        >
          <span className="mr-1">{period.icon}</span>
          {period.label}
          {!period.available && (
            <Badge variant="secondary" className="ml-2 text-xs">
              Full
            </Badge>
          )}
        </Button>
      ))}
    </div>
  )
}

// Popular times indicator
function PopularTimesIndicator({
  popularTimes,
  currentTime
}: {
  popularTimes: string[]
  currentTime?: string
}) {
  const isPopular = currentTime && popularTimes.includes(currentTime)
  
  return (
    <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Star className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <p className="font-medium text-sm">Popular Time Slots</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              These times are frequently booked by other customers
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {popularTimes.map((time) => (
                <Badge
                  key={time}
                  variant="secondary"
                  className={cn(
                    "text-xs",
                    currentTime === time && "bg-yellow-500 text-white"
                  )}
                >
                  {time}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Dynamic pricing explanation
function DynamicPricingInfo({
  enabled,
  peakHours
}: {
  enabled: boolean
  peakHours?: { start: string; end: string }[]
}) {
  if (!enabled) return null
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <TrendingUp className="h-5 w-5 text-purple-600 mt-0.5" />
          <div className="space-y-2">
            <p className="font-medium text-sm">Dynamic Pricing Active</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Prices adjust based on demand and availability
            </p>
            {peakHours && peakHours.length > 0 && (
              <div>
                <p className="text-xs font-medium mt-2">Peak Hours (Higher Rates):</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {peakHours.map((period, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {period.start} - {period.end}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// List view for time slots
function TimeSlotList({
  slots,
  selectedSlot,
  onSlotSelect,
  timezone
}: {
  slots: TimeSlot[]
  selectedSlot?: TimeSlot | null
  onSlotSelect: (slot: TimeSlot) => void
  timezone: string
}) {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-2">
        {slots.map((slot, index) => (
          <motion.div
            key={slot.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <TimeSlotCard
              slot={slot}
              isSelected={selectedSlot?.id === slot.id}
              onSelect={() => onSlotSelect(slot)}
              timezone={timezone}
            />
          </motion.div>
        ))}
      </div>
    </ScrollArea>
  )
}

// Grid view for time slots
function TimeSlotGrid({
  slots,
  selectedSlot,
  onSlotSelect,
  timezone
}: {
  slots: TimeSlot[]
  selectedSlot?: TimeSlot | null
  onSlotSelect: (slot: TimeSlot) => void
  timezone: string
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {slots.map((slot, index) => (
        <motion.div
          key={slot.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.03 }}
        >
          <TimeSlotCard
            slot={slot}
            isSelected={selectedSlot?.id === slot.id}
            onSelect={() => onSlotSelect(slot)}
            timezone={timezone}
          />
        </motion.div>
      ))}
    </div>
  )
}

// Compact view for time slots
function TimeSlotCompact({
  slots,
  selectedSlot,
  onSlotSelect
}: {
  slots: TimeSlot[]
  selectedSlot?: TimeSlot | null
  onSlotSelect: (slot: TimeSlot) => void
}) {
  return (
    <RadioGroup
      value={selectedSlot?.id}
      onValueChange={(value) => {
        const slot = slots.find(s => s.id === value)
        if (slot) onSlotSelect(slot)
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        {slots.map((slot) => (
          <div key={slot.id} className="flex items-center space-x-2">
            <RadioGroupItem
              value={slot.id}
              id={slot.id}
              disabled={!slot.available}
            />
            <Label
              htmlFor={slot.id}
              className={cn(
                "flex-1 cursor-pointer",
                !slot.available && "opacity-50 cursor-not-allowed"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {slot.startTime}
                </span>
                {slot.available ? (
                  <Badge variant="secondary" className="text-xs">
                    {slot.capacity - slot.booked} left
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Full
                  </Badge>
                )}
              </div>
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  )
}

// Main time slot selector component
export function TimeSlotSelector({
  data,
  onSlotSelect,
  selectedSlot = null,
  className,
  variant = "grid"
}: TimeSlotSelectorProps) {
  const [selectedPeriod, setSelectedPeriod] = React.useState(
    data.groups[0]?.label || ""
  )
  const [localSelectedSlot, setLocalSelectedSlot] = React.useState<TimeSlot | null>(
    selectedSlot
  )
  
  const currentGroup = data.groups.find(g => g.label === selectedPeriod)
  const availableSlots = currentGroup?.slots.filter(s => s.available) || []
  const hasAvailability = data.groups.some(g => g.slots.some(s => s.available))
  
  const handleSlotSelect = (slot: TimeSlot) => {
    setLocalSelectedSlot(slot)
    onSlotSelect?.(slot)
  }
  
  if (!hasAvailability) {
    return (
      <Card className={className}>
        <CardContent className="p-8 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">No Available Time Slots</h3>
          <p className="text-gray-600 dark:text-gray-400">
            All time slots for {format(data.date, "MMMM d, yyyy")} are fully booked.
          </p>
          <Button className="mt-4" variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Choose Different Date
          </Button>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Select Time Slot for {format(data.date, "EEEE, MMMM d")}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          All times shown in {data.timezone}
        </p>
      </div>
      
      {/* Popular times indicator */}
      {data.popularTimes && data.popularTimes.length > 0 && (
        <PopularTimesIndicator
          popularTimes={data.popularTimes}
          currentTime={localSelectedSlot?.startTime}
        />
      )}
      
      {/* Dynamic pricing info */}
      {data.dynamicPricing && (
        <DynamicPricingInfo
          enabled={data.dynamicPricing}
          peakHours={data.peakHours}
        />
      )}
      
      {/* Period filter */}
      <div className="flex items-center justify-between">
        <TimePeriodFilter
          groups={data.groups}
          selectedPeriod={selectedPeriod}
          onPeriodChange={setSelectedPeriod}
        />
        
        {data.rushAvailable && (
          <Badge className="bg-orange-500">
            <Zap className="h-3 w-3 mr-1" />
            Rush slots available
          </Badge>
        )}
      </div>
      
      {/* Time slots display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>{selectedPeriod} Slots</span>
            <Badge variant="secondary">
              {availableSlots.length} available
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {currentGroup && currentGroup.slots.length > 0 ? (
            <>
              {variant === "grid" && (
                <TimeSlotGrid
                  slots={currentGroup.slots}
                  selectedSlot={localSelectedSlot}
                  onSlotSelect={handleSlotSelect}
                  timezone={data.timezone}
                />
              )}
              {variant === "list" && (
                <TimeSlotList
                  slots={currentGroup.slots}
                  selectedSlot={localSelectedSlot}
                  onSlotSelect={handleSlotSelect}
                  timezone={data.timezone}
                />
              )}
              {variant === "compact" && (
                <TimeSlotCompact
                  slots={currentGroup.slots}
                  selectedSlot={localSelectedSlot}
                  onSlotSelect={handleSlotSelect}
                />
              )}
            </>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No time slots available for this period
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Selected slot summary */}
      {localSelectedSlot && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Selected Time</p>
                  <p className="text-xl font-bold text-purple-600">
                    {localSelectedSlot.startTime} - {localSelectedSlot.endTime}
                  </p>
                  {localSelectedSlot.price && (
                    <p className="text-lg font-semibold mt-1">
                      ${localSelectedSlot.price}
                    </p>
                  )}
                </div>
                <Button>
                  Confirm Time
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}