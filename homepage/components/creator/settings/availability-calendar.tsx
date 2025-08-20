"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Clock,
  AlertCircle,
  Plus,
  X,
  Moon,
  Sun
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AvailabilitySettings {
  weeklyLimit: number
  responseTime: string
  vacationMode: boolean
  blackoutDates: string[]
  businessDays: string[]
  businessHours: {
    start: string
    end: string
  }
}

interface AvailabilityCalendarProps {
  availability: AvailabilitySettings
  onChange: (availability: AvailabilitySettings) => void
}

const WEEKDAYS = [
  { id: "mon", label: "Monday", short: "Mon" },
  { id: "tue", label: "Tuesday", short: "Tue" },
  { id: "wed", label: "Wednesday", short: "Wed" },
  { id: "thu", label: "Thursday", short: "Thu" },
  { id: "fri", label: "Friday", short: "Fri" },
  { id: "sat", label: "Saturday", short: "Sat" },
  { id: "sun", label: "Sunday", short: "Sun" }
]

export default function AvailabilityCalendar({
  availability,
  onChange
}: AvailabilityCalendarProps) {
  const [newBlackoutDate, setNewBlackoutDate] = React.useState("")

  const handleAddBlackoutDate = () => {
    if (newBlackoutDate && !availability.blackoutDates.includes(newBlackoutDate)) {
      onChange({
        ...availability,
        blackoutDates: [...availability.blackoutDates, newBlackoutDate]
      })
      setNewBlackoutDate("")
    }
  }

  const handleRemoveBlackoutDate = (date: string) => {
    onChange({
      ...availability,
      blackoutDates: availability.blackoutDates.filter(d => d !== date)
    })
  }

  const toggleBusinessDay = (dayId: string) => {
    if (availability.businessDays.includes(dayId)) {
      onChange({
        ...availability,
        businessDays: availability.businessDays.filter(d => d !== dayId)
      })
    } else {
      onChange({
        ...availability,
        businessDays: [...availability.businessDays, dayId]
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Vacation Mode Alert */}
      {availability.vacationMode && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
          <div className="flex-1">
            <p className="font-medium text-amber-900">Vacation Mode Active</p>
            <p className="text-sm text-amber-700 mt-1">
              You won't receive new booking requests while vacation mode is on
            </p>
          </div>
        </div>
      )}

      {/* Quick Settings */}
      <div className="grid sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="weekly-limit">Weekly Booking Limit</Label>
          <Input
            id="weekly-limit"
            type="number"
            min="1"
            value={availability.weeklyLimit}
            onChange={(e) => onChange({
              ...availability,
              weeklyLimit: parseInt(e.target.value) || 1
            })}
          />
          <p className="text-sm text-gray-500">
            Maximum bookings you can accept per week
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="response-time">Response Time Commitment</Label>
          <select
            id="response-time"
            className="w-full p-2 border rounded-lg"
            value={availability.responseTime}
            onChange={(e) => onChange({
              ...availability,
              responseTime: e.target.value
            })}
          >
            <option value="12hr">12 hours</option>
            <option value="24hr">24 hours</option>
            <option value="48hr">48 hours</option>
            <option value="72hr">72 hours</option>
          </select>
          <p className="text-sm text-gray-500">
            How quickly you'll respond to requests
          </p>
        </div>
      </div>

      <Separator />

      {/* Business Days */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Business Days</Label>
          <Badge variant="secondary">
            {availability.businessDays.length} days/week
          </Badge>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {WEEKDAYS.map((day) => (
            <button
              key={day.id}
              onClick={() => toggleBusinessDay(day.id)}
              className={cn(
                "p-2 rounded-lg border text-sm font-medium transition-all",
                availability.businessDays.includes(day.id)
                  ? "bg-purple-100 border-purple-400 text-purple-700"
                  : "bg-white border-gray-200 text-gray-500 hover:border-gray-300"
              )}
            >
              <span className="hidden sm:inline">{day.short}</span>
              <span className="sm:hidden">{day.short.charAt(0)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Business Hours */}
      <div className="space-y-4">
        <Label>Business Hours</Label>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-gray-400" />
            <Input
              type="time"
              value={availability.businessHours.start}
              onChange={(e) => onChange({
                ...availability,
                businessHours: {
                  ...availability.businessHours,
                  start: e.target.value
                }
              })}
              className="w-32"
            />
          </div>
          <span className="text-gray-400">to</span>
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-gray-400" />
            <Input
              type="time"
              value={availability.businessHours.end}
              onChange={(e) => onChange({
                ...availability,
                businessHours: {
                  ...availability.businessHours,
                  end: e.target.value
                }
              })}
              className="w-32"
            />
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Bookings outside these hours will be marked as "next business day"
        </p>
      </div>

      <Separator />

      {/* Blackout Dates */}
      <div className="space-y-4">
        <Label>Blackout Dates</Label>
        <div className="flex gap-2">
          <Input
            type="date"
            value={newBlackoutDate}
            onChange={(e) => setNewBlackoutDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
          />
          <Button onClick={handleAddBlackoutDate} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Add Date
          </Button>
        </div>
        {availability.blackoutDates.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {availability.blackoutDates.map((date) => (
              <Badge
                key={date}
                variant="secondary"
                className="pl-3 pr-1 py-1"
              >
                <Calendar className="h-3 w-3 mr-2" />
                {new Date(date).toLocaleDateString()}
                <button
                  onClick={() => handleRemoveBlackoutDate(date)}
                  className="ml-2 p-1 hover:bg-gray-200 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        <p className="text-sm text-gray-500">
          Dates when you won't accept new bookings
        </p>
      </div>

      <Separator />

      {/* Vacation Mode */}
      <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50">
        <div>
          <p className="font-medium">Vacation Mode</p>
          <p className="text-sm text-gray-600">
            Temporarily pause all new bookings
          </p>
        </div>
        <Switch
          checked={availability.vacationMode}
          onCheckedChange={(checked) => onChange({
            ...availability,
            vacationMode: checked
          })}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {availability.weeklyLimit - 12}
            </p>
            <p className="text-sm text-gray-600">Available this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">12</p>
            <p className="text-sm text-gray-600">Booked this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">5</p>
            <p className="text-sm text-gray-600">Pending requests</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}