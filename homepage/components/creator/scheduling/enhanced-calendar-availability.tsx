"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar } from "@/components/ui/calendar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
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
  Settings,
  PlayCircle,
  PauseCircle,
  AlertCircle,
  CheckCircle,
  Users,
  TrendingUp,
  Moon,
  Sun,
  Coffee,
  Zap,
  Target,
  Globe,
  MapPin,
  Timer,
  Briefcase,
  Home,
  Plane,
  Heart,
  Battery,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Plus,
  Minus,
  Edit,
  Copy,
  Trash2,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  Filter,
  Search,
  Download,
  Upload,
  RefreshCw,
  Save,
  X,
  Calendar1,
  CalendarDays,
  CalendarClock,
  CalendarCheck,
  CalendarX
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

// Types
interface TimeSlot {
  id: string
  start: string // "09:00"
  end: string // "10:00" 
  isAvailable: boolean
  maxRequests: number
  currentRequests: number
  bufferTime: number // minutes
  category: "standard" | "premium" | "rush"
  price?: number
}

interface DaySchedule {
  date: string // ISO date
  isAvailable: boolean
  timeSlots: TimeSlot[]
  maxDailyRequests: number
  currentRequests: number
  notes?: string
  dayType: "work" | "light" | "off" | "vacation"
}

interface AvailabilitySettings {
  workingHours: {
    start: string
    end: string
  }
  timeZone: string
  bufferBetweenRequests: number
  maxRequestsPerDay: number
  maxRequestsPerWeek: number
  vacationMode: boolean
  emergencyAvailable: boolean
  autoDeclineWhenFull: boolean
  requireAdvanceBooking: number // hours
}

interface Request {
  id: string
  customerName: string
  requestType: string
  scheduledFor: string
  status: "pending" | "accepted" | "completed" | "cancelled"
  priority: "normal" | "rush" | "vip"
  duration: number // minutes
  price: number
}

interface EnhancedCalendarAvailabilityProps {
  schedule?: DaySchedule[]
  requests?: Request[]
  settings?: AvailabilitySettings
  onUpdateSchedule?: (schedule: DaySchedule[]) => void
  onUpdateSettings?: (settings: AvailabilitySettings) => void
  onRescheduleRequest?: (requestId: string, newSlot: TimeSlot) => void
  className?: string
}

// Mock data generator
const generateMockSchedule = (): DaySchedule[] => {
  const schedule: DaySchedule[] = []
  const today = new Date()
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    
    const dayOfWeek = date.getDay()
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
    
    // Generate time slots for working days
    const timeSlots: TimeSlot[] = []
    if (!isWeekend) {
      for (let hour = 9; hour < 17; hour++) {
        timeSlots.push({
          id: `slot-${i}-${hour}`,
          start: `${hour.toString().padStart(2, '0')}:00`,
          end: `${(hour + 1).toString().padStart(2, '0')}:00`,
          isAvailable: Math.random() > 0.3,
          maxRequests: Math.floor(Math.random() * 3) + 1,
          currentRequests: Math.floor(Math.random() * 2),
          bufferTime: 15,
          category: Math.random() > 0.8 ? "premium" : "standard"
        })
      }
    }
    
    schedule.push({
      date: date.toISOString().split('T')[0],
      isAvailable: !isWeekend && Math.random() > 0.2,
      timeSlots,
      maxDailyRequests: 8,
      currentRequests: Math.floor(Math.random() * 6),
      dayType: isWeekend ? "off" : Math.random() > 0.8 ? "light" : "work"
    })
  }
  
  return schedule
}

const generateMockRequests = (): Request[] => {
  const requests: Request[] = []
  const today = new Date()
  
  for (let i = 0; i < 20; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + Math.floor(Math.random() * 14))
    date.setHours(9 + Math.floor(Math.random() * 8))
    
    requests.push({
      id: `req-${i}`,
      customerName: `Customer ${i + 1}`,
      requestType: ["Birthday", "Anniversary", "Congratulations", "Motivation"][Math.floor(Math.random() * 4)],
      scheduledFor: date.toISOString(),
      status: ["pending", "accepted", "completed"][Math.floor(Math.random() * 3)] as any,
      priority: Math.random() > 0.8 ? "rush" : "normal" as any,
      duration: 30 + Math.floor(Math.random() * 30),
      price: 50 + Math.floor(Math.random() * 100)
    })
  }
  
  return requests.sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime())
}

// Calendar view component
const CalendarView = ({ 
  schedule, 
  selectedDate, 
  onDateSelect,
  requests,
  viewMode 
}: {
  schedule: DaySchedule[]
  selectedDate?: Date
  onDateSelect: (date: Date) => void
  requests: Request[]
  viewMode: "month" | "week" | "day"
}) => {
  const [currentDate, setCurrentDate] = React.useState(new Date())
  
  // Get schedule data for a specific date
  const getScheduleForDate = (date: Date | undefined) => {
    if (!date) return null
    const dateStr = date.toISOString().split('T')[0]
    return schedule.find(s => s.date === dateStr)
  }
  
  // Get requests for a specific date
  const getRequestsForDate = (date: Date | undefined) => {
    if (!date) return []
    const dateStr = date.toISOString().split('T')[0]
    return requests.filter(r => r.scheduledFor.startsWith(dateStr))
  }
  
  // Custom day content for calendar
  const renderDay = (date: Date | undefined) => {
    if (!date) return null
    const daySchedule = getScheduleForDate(date)
    const dayRequests = getRequestsForDate(date)
    
    if (!daySchedule) return null
    
    const availableSlots = daySchedule.timeSlots.filter(slot => slot.isAvailable).length
    const totalRequests = dayRequests.length
    const capacity = daySchedule.maxDailyRequests
    
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-1">
        <div className="text-sm font-medium">{date.getDate()}</div>
        {daySchedule.isAvailable && (
          <div className="flex gap-1 mt-1">
            {totalRequests > 0 && (
              <div className={cn(
                "w-2 h-2 rounded-full",
                totalRequests >= capacity ? "bg-red-500" :
                totalRequests >= capacity * 0.7 ? "bg-yellow-500" :
                "bg-green-500"
              )} />
            )}
            {!daySchedule.isAvailable && (
              <div className="w-2 h-2 rounded-full bg-gray-300" />
            )}
          </div>
        )}
        {daySchedule.dayType === "vacation" && (
          <Plane className="w-3 h-3 text-blue-500 mt-1" />
        )}
      </div>
    )
  }
  
  if (viewMode === "month") {
    return (
      <Card>
        <CardContent className="p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateSelect(date)}
            className="rounded-md border"
            components={{
              Day: ({ date, displayMonth, ...props }) => {
                if (!date) return null
                return (
                  <button
                    {...props}
                    className={cn(
                      "relative w-full h-16 p-1 text-sm hover:bg-accent rounded-md",
                      selectedDate?.toISOString().split('T')[0] === date.toISOString().split('T')[0] && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => onDateSelect(date)}
                  >
                    {renderDay(date)}
                  </button>
                )
              }
            }}
          />
        </CardContent>
      </Card>
    )
  }
  
  // Week and day views would go here with more detailed layouts
  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-center text-gray-500">
          {viewMode} view coming soon
        </div>
      </CardContent>
    </Card>
  )
}

// Time slot editor component
const TimeSlotEditor = ({ 
  slot, 
  onUpdate, 
  onDelete 
}: { 
  slot: TimeSlot
  onUpdate: (slot: TimeSlot) => void
  onDelete: (slotId: string) => void
}) => {
  const [isEditing, setIsEditing] = React.useState(false)
  
  const getSlotColor = () => {
    if (!slot.isAvailable) return "bg-gray-100 dark:bg-gray-800"
    if (slot.currentRequests >= slot.maxRequests) return "bg-red-50 dark:bg-red-900/20 border-red-200"
    if (slot.currentRequests >= slot.maxRequests * 0.7) return "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200"
    return "bg-green-50 dark:bg-green-900/20 border-green-200"
  }
  
  return (
    <motion.div
      layout
      className={cn(
        "p-3 rounded-lg border transition-colors",
        getSlotColor()
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-600" />
            <span className="font-medium">
              {slot.start} - {slot.end}
            </span>
          </div>
          
          <Badge variant={slot.category === "premium" ? "default" : "outline"}>
            {slot.category}
          </Badge>
          
          <div className="flex items-center gap-1 text-sm text-gray-600">
            <Users className="w-3 h-3" />
            <span>{slot.currentRequests}/{slot.maxRequests}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Switch
            checked={slot.isAvailable}
            onCheckedChange={(checked) => 
              onUpdate({ ...slot, isAvailable: checked })
            }
          />
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(slot.id)}
          >
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>
      
      {isEditing && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="mt-3 pt-3 border-t space-y-3"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">Max Requests</label>
              <input
                type="number"
                min="1"
                max="10"
                value={slot.maxRequests}
                onChange={(e) => onUpdate({ ...slot, maxRequests: parseInt(e.target.value) })}
                className="w-full mt-1 px-3 py-1 border rounded-md"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Buffer Time (min)</label>
              <input
                type="number"
                min="0"
                max="60"
                step="5"
                value={slot.bufferTime}
                onChange={(e) => onUpdate({ ...slot, bufferTime: parseInt(e.target.value) })}
                className="w-full mt-1 px-3 py-1 border rounded-md"
              />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Category</label>
            <Select value={slot.category} onValueChange={(value: any) => onUpdate({ ...slot, category: value })}>
              <SelectTrigger className="w-full mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="premium">Premium</SelectItem>
                <SelectItem value="rush">Rush</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

// Capacity management component
const CapacityManager = ({
  schedule,
  onUpdateSettings
}: {
  schedule: DaySchedule[]
  onUpdateSettings: (settings: Partial<AvailabilitySettings>) => void
}) => {
  const today = new Date()
  const thisWeek = schedule.filter(day => {
    const dayDate = new Date(day.date)
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekStart.getDate() + 6)
    return dayDate >= weekStart && dayDate <= weekEnd
  })
  
  const totalCapacity = thisWeek.reduce((sum, day) => sum + day.maxDailyRequests, 0)
  const totalBooked = thisWeek.reduce((sum, day) => sum + day.currentRequests, 0)
  const utilizationRate = (totalBooked / totalCapacity) * 100
  
  return (
    <div className="space-y-6">
      {/* Weekly Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Weekly Capacity Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{totalCapacity}</div>
              <div className="text-sm text-gray-600">Total Slots</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalBooked}</div>
              <div className="text-sm text-gray-600">Booked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{Math.round(utilizationRate)}%</div>
              <div className="text-sm text-gray-600">Utilization</div>
            </div>
          </div>
          
          <Progress value={utilizationRate} className="h-2" />
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Low demand</span>
            <span>Optimal</span>
            <span>At capacity</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Daily Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Capacity Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {thisWeek.map((day, index) => {
              const dayUtilization = (day.currentRequests / day.maxDailyRequests) * 100
              const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })
              
              return (
                <div key={day.date} className="flex items-center gap-4">
                  <div className="w-12 text-sm font-medium">{dayName}</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{day.currentRequests}/{day.maxDailyRequests} requests</span>
                      <span>{Math.round(dayUtilization)}%</span>
                    </div>
                    <Progress value={dayUtilization} className="h-1.5" />
                  </div>
                  <Badge variant={
                    dayUtilization >= 90 ? "destructive" :
                    dayUtilization >= 70 ? "secondary" :
                    "outline"
                  }>
                    {day.dayType}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Smart Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Smart Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {utilizationRate > 85 && (
              <Alert>
                <TrendingUp className="w-4 h-4" />
                <AlertDescription>
                  <strong>High demand detected!</strong> Consider adding more slots during peak hours 
                  or increasing your daily capacity to avoid turning away customers.
                </AlertDescription>
              </Alert>
            )}
            
            {utilizationRate < 40 && (
              <Alert>
                <Target className="w-4 h-4" />
                <AlertDescription>
                  <strong>Low utilization:</strong> You have spare capacity. Consider promoting 
                  your services or adjusting your availability during higher-demand periods.
                </AlertDescription>
              </Alert>
            )}
            
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <h4 className="font-medium mb-2">Optimization Tips</h4>
              <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300">
                <li>• Peak booking hours are typically 6-8 PM</li>
                <li>• Weekend slots fill 2x faster than weekdays</li>
                <li>• Adding buffer time reduces stress but limits capacity</li>
                <li>• Premium slots can increase revenue without more time</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main component
export function EnhancedCalendarAvailability({
  schedule = generateMockSchedule(),
  requests = generateMockRequests(),
  settings = {
    workingHours: { start: "09:00", end: "17:00" },
    timeZone: "America/New_York",
    bufferBetweenRequests: 15,
    maxRequestsPerDay: 8,
    maxRequestsPerWeek: 40,
    vacationMode: false,
    emergencyAvailable: true,
    autoDeclineWhenFull: true,
    requireAdvanceBooking: 24
  },
  onUpdateSchedule,
  onUpdateSettings,
  onRescheduleRequest,
  className
}: EnhancedCalendarAvailabilityProps) {
  const [activeTab, setActiveTab] = React.useState("calendar")
  const [viewMode, setViewMode] = React.useState<"month" | "week" | "day">("month")
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date())
  const [showSettings, setShowSettings] = React.useState(false)
  
  // Get selected day's schedule
  const selectedDaySchedule = React.useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0]
    return schedule.find(s => s.date === dateStr)
  }, [schedule, selectedDate])
  
  // Get selected day's requests
  const selectedDayRequests = React.useMemo(() => {
    const dateStr = selectedDate.toISOString().split('T')[0]
    return requests.filter(r => r.scheduledFor.startsWith(dateStr))
  }, [requests, selectedDate])
  
  const handleUpdateSlot = (updatedSlot: TimeSlot) => {
    if (!selectedDaySchedule || !onUpdateSchedule) return
    
    const updatedSchedule = schedule.map(day => {
      if (day.date === selectedDaySchedule.date) {
        return {
          ...day,
          timeSlots: day.timeSlots.map(slot => 
            slot.id === updatedSlot.id ? updatedSlot : slot
          )
        }
      }
      return day
    })
    
    onUpdateSchedule(updatedSchedule)
  }
  
  const handleDeleteSlot = (slotId: string) => {
    if (!selectedDaySchedule || !onUpdateSchedule) return
    
    const updatedSchedule = schedule.map(day => {
      if (day.date === selectedDaySchedule.date) {
        return {
          ...day,
          timeSlots: day.timeSlots.filter(slot => slot.id !== slotId)
        }
      }
      return day
    })
    
    onUpdateSchedule(updatedSchedule)
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Calendar & Availability</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your schedule and availability settings
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Badge variant={settings.vacationMode ? "destructive" : "default"}>
            {settings.vacationMode ? "Vacation Mode" : "Available"}
          </Badge>
          
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>
      
      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            Calendar
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="capacity" className="flex items-center gap-2">
            <Target className="w-4 w-4" />
            Capacity
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Requests
          </TabsTrigger>
        </TabsList>
        
        {/* Calendar Tab */}
        <TabsContent value="calendar" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("month")}
                className={viewMode === "month" ? "bg-accent" : ""}
              >
                <CalendarDays className="w-4 h-4 mr-1" />
                Month
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("week")}
                className={viewMode === "week" ? "bg-accent" : ""}
              >
                <CalendarDays className="w-4 h-4 mr-1" />
                Week
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode("day")}
                className={viewMode === "day" ? "bg-accent" : ""}
              >
                <Calendar1 className="w-4 h-4 mr-1" />
                Day
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Availability
              </Button>
              <Button variant="outline" size="sm">
                <Copy className="w-4 h-4 mr-1" />
                Copy Week
              </Button>
            </div>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CalendarView
                schedule={schedule}
                selectedDate={selectedDate}
                onDateSelect={setSelectedDate}
                requests={requests}
                viewMode={viewMode}
              />
            </div>
            
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedDaySchedule ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Availability</span>
                        <Switch
                          checked={selectedDaySchedule.isAvailable}
                          onCheckedChange={(checked) => {
                            // Handle day availability toggle
                          }}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Requests</span>
                          <span>{selectedDaySchedule.currentRequests}/{selectedDaySchedule.maxDailyRequests}</span>
                        </div>
                        <Progress 
                          value={(selectedDaySchedule.currentRequests / selectedDaySchedule.maxDailyRequests) * 100} 
                          className="h-2"
                        />
                      </div>
                      
                      <Separator />
                      
                      <div>
                        <h4 className="font-medium mb-2">Today's Requests</h4>
                        <div className="space-y-2">
                          {selectedDayRequests.map(request => (
                            <div key={request.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <div>
                                <p className="text-sm font-medium">{request.customerName}</p>
                                <p className="text-xs text-gray-600">
                                  {new Date(request.scheduledFor).toLocaleTimeString('en-US', {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              </div>
                              <Badge variant={
                                request.status === "completed" ? "default" :
                                request.status === "accepted" ? "secondary" :
                                "outline"
                              }>
                                {request.status}
                              </Badge>
                            </div>
                          ))}
                          
                          {selectedDayRequests.length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">
                              No requests scheduled
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <CalendarX className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">No schedule data for this date</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        {/* Schedule Tab */}
        <TabsContent value="schedule" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                Time Slots - {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long',
                  month: 'long', 
                  day: 'numeric' 
                })}
              </CardTitle>
              <CardDescription>
                Configure your availability for the selected day
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedDaySchedule?.timeSlots.length ? (
                <div className="space-y-3">
                  {selectedDaySchedule.timeSlots.map(slot => (
                    <TimeSlotEditor
                      key={slot.id}
                      slot={slot}
                      onUpdate={handleUpdateSlot}
                      onDelete={handleDeleteSlot}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 mb-4">No time slots configured for this day</p>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Time Slot
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Capacity Tab */}
        <TabsContent value="capacity" className="space-y-6">
          <CapacityManager
            schedule={schedule}
            onUpdateSettings={onUpdateSettings || (() => {})}
          />
        </TabsContent>
        
        {/* Requests Tab */}
        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Requests</CardTitle>
              <CardDescription>
                Manage and reschedule your video requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests.filter(r => new Date(r.scheduledFor) >= new Date()).slice(0, 10).map(request => (
                  <div key={request.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-3 h-3 rounded-full",
                        request.priority === "rush" ? "bg-red-500" :
                        request.priority === "vip" ? "bg-purple-500" :
                        "bg-blue-500"
                      )} />
                      
                      <div>
                        <p className="font-medium">{request.customerName}</p>
                        <p className="text-sm text-gray-600">{request.requestType}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {new Date(request.scheduledFor).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(request.scheduledFor).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      
                      <Badge variant={
                        request.status === "completed" ? "default" :
                        request.status === "accepted" ? "secondary" :
                        "outline"
                      }>
                        {request.status}
                      </Badge>
                      
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Settings Panel */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Availability Settings</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Working Hours</label>
                      <div className="flex gap-2 mt-1">
                        <input
                          type="time"
                          value={settings.workingHours.start}
                          className="flex-1 px-3 py-2 border rounded-md"
                        />
                        <span className="py-2">to</span>
                        <input
                          type="time"
                          value={settings.workingHours.end}
                          className="flex-1 px-3 py-2 border rounded-md"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Time Zone</label>
                      <Select value={settings.timeZone}>
                        <SelectTrigger className="w-full mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="America/New_York">Eastern Time</SelectItem>
                          <SelectItem value="America/Chicago">Central Time</SelectItem>
                          <SelectItem value="America/Denver">Mountain Time</SelectItem>
                          <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Buffer Between Requests (minutes)</label>
                      <input
                        type="number"
                        min="0"
                        max="60"
                        step="5"
                        value={settings.bufferBetweenRequests}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Max Requests per Day</label>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={settings.maxRequestsPerDay}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Max Requests per Week</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={settings.maxRequestsPerWeek}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Advance Booking Required (hours)</label>
                      <input
                        type="number"
                        min="0"
                        max="168"
                        value={settings.requireAdvanceBooking}
                        className="w-full mt-1 px-3 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Vacation Mode</p>
                        <p className="text-sm text-gray-600">Pause all new requests</p>
                      </div>
                      <Switch checked={settings.vacationMode} />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Emergency Availability</p>
                        <p className="text-sm text-gray-600">Accept urgent requests outside hours</p>
                      </div>
                      <Switch checked={settings.emergencyAvailable} />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Auto-decline When Full</p>
                        <p className="text-sm text-gray-600">Automatically decline if at capacity</p>
                      </div>
                      <Switch checked={settings.autoDeclineWhenFull} />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowSettings(false)}>
                    Cancel
                  </Button>
                  <Button>
                    <Save className="w-4 h-4 mr-2" />
                    Save Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}