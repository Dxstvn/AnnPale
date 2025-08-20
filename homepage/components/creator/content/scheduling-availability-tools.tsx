"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import {
  Calendar as CalendarIcon,
  Clock,
  List,
  Grid,
  BarChart3,
  Brain,
  Play,
  Pause,
  Square,
  Plus,
  Minus,
  Edit,
  Copy,
  Trash2,
  Save,
  Settings,
  Zap,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  MoreVertical,
  MoreHorizontal,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Shield,
  AlertCircle,
  CheckCircle,
  Info,
  HelpCircle,
  Sun,
  Moon,
  Coffee,
  Utensils,
  Home,
  Building,
  MapPin,
  Globe,
  Wifi,
  Activity,
  TrendingUp,
  TrendingDown,
  Award,
  Trophy,
  Target,
  Flag,
  Bookmark,
  Hash,
  Tag,
  Folder,
  FolderOpen,
  FolderPlus,
  Archive,
  Database,
  Server,
  Cloud,
  CloudUpload,
  CloudDownload,
  Package,
  Box,
  Briefcase,
  Users,
  User,
  UserPlus,
  UserMinus,
  UserCheck,
  UserX,
  Gift,
  Heart,
  Star,
  Sparkles,
  Flame,
  Battery,
  BatteryLow,
  RefreshCw,
  RotateCcw,
  Download,
  Upload,
  Share2,
  Send,
  MessageSquare,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Camera,
  CameraOff,
  Phone,
  PhoneOff,
  Mail,
  Inbox,
  FileText,
  FileCheck,
  FilePlus,
  FileX,
  Filter,
  Search,
  X,
  Check,
  XCircle,
  AlertTriangle,
  Timer,
  Gauge,
  DollarSign,
  Percent,
  Hash as HashIcon,
  Calendar as CalendarDays,
  CalendarX,
  CalendarCheck,
  CalendarPlus,
  CalendarMinus,
  CalendarClock,
  CalendarHeart,
  CalendarRange,
  CalendarSearch,
  Link,
  ExternalLink,
  Repeat,
  SkipForward,
  FastForward,
  Rewind,
  PlayCircle,
  PauseCircle,
  StopCircle,
  Circle,
  CircleDot,
  Square as SquareIcon,
  Triangle,
  Hexagon,
  Octagon,
  Command,
  ToggleLeft,
  ToggleRight,
  Layers,
  Layout,
  LayoutGrid,
  LayoutList,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Tv,
  Radio,
  Headphones,
  Speaker,
  Printer,
  Keyboard,
  Mouse,
  HardDrive,
  Cpu,
  WifiOff,
  Bluetooth,
  Cast,
  Airplay,
  Navigation,
  Compass,
  Map,
  MapPinned,
  Mountain,
  Trees,
  Sunrise,
  Sunset,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { format, addDays, addHours, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isSameDay, isWithinInterval, differenceInMinutes, differenceInHours, differenceInDays } from "date-fns"

// Types
export interface ScheduleRule {
  id: string
  name: string
  type: "regular" | "capacity" | "special" | "smart"
  enabled: boolean
  priority: number
  conditions: RuleCondition[]
  actions: RuleAction[]
}

export interface RuleCondition {
  type: "time" | "day" | "date" | "capacity" | "revenue"
  operator: "equals" | "contains" | "greater" | "less" | "between"
  value: any
}

export interface RuleAction {
  type: "block" | "available" | "premium" | "discount" | "auto-accept" | "auto-decline"
  value?: any
}

export interface TimeSlot {
  id: string
  start: Date
  end: Date
  status: "available" | "busy" | "blocked" | "break" | "buffer"
  bookings?: number
  capacity?: number
  price?: number
  notes?: string
}

export interface AvailabilityPattern {
  id: string
  name: string
  days: number[] // 0-6, where 0 is Sunday
  startTime: string // "09:00"
  endTime: string // "17:00"
  breaks: TimeBreak[]
  timezone: string
}

export interface TimeBreak {
  name: string
  startTime: string
  endTime: string
}

export interface CalendarIntegration {
  id: string
  provider: "google" | "apple" | "outlook" | "other"
  name: string
  email: string
  connected: boolean
  syncEnabled: boolean
  lastSync?: Date
  twoWaySync: boolean
}

export interface SchedulingMetrics {
  totalBookings: number
  totalHours: number
  averagePerDay: number
  peakHours: string[]
  utilizationRate: number
  revenue: number
  missedOpportunities: number
}

export interface SchedulingAvailabilityToolsProps {
  onScheduleUpdate?: (schedule: TimeSlot[]) => void
  onRuleCreate?: (rule: ScheduleRule) => void
  onIntegrationConnect?: (integration: CalendarIntegration) => void
  onAvailabilityChange?: (pattern: AvailabilityPattern) => void
  enableSmartScheduling?: boolean
  enableCalendarSync?: boolean
  enableAutomation?: boolean
}

// Mock data generators
const generateTimeSlots = (date: Date): TimeSlot[] => {
  const slots: TimeSlot[] = []
  const startHour = 9
  const endHour = 18
  
  for (let hour = startHour; hour < endHour; hour++) {
    const start = new Date(date)
    start.setHours(hour, 0, 0, 0)
    const end = new Date(date)
    end.setHours(hour + 1, 0, 0, 0)
    
    let status: TimeSlot["status"] = "available"
    if (hour === 12) status = "break" // Lunch break
    if (hour < 10 || hour > 16) status = "busy" // Busy hours
    if (Math.random() > 0.7) status = "blocked" // Random blocked slots
    
    slots.push({
      id: `slot-${hour}`,
      start,
      end,
      status,
      bookings: status === "busy" ? Math.floor(Math.random() * 3) + 1 : 0,
      capacity: 3,
      price: hour >= 14 && hour <= 16 ? 150 : 100, // Peak pricing
      notes: status === "break" ? "Lunch break" : undefined
    })
  }
  
  return slots
}

const generateScheduleRules = (): ScheduleRule[] => {
  return [
    {
      id: "rule-1",
      name: "Regular Work Hours",
      type: "regular",
      enabled: true,
      priority: 1,
      conditions: [
        { type: "day", operator: "between", value: [1, 5] }, // Monday to Friday
        { type: "time", operator: "between", value: ["09:00", "18:00"] }
      ],
      actions: [
        { type: "available" }
      ]
    },
    {
      id: "rule-2",
      name: "Weekend Limited",
      type: "regular",
      enabled: true,
      priority: 2,
      conditions: [
        { type: "day", operator: "contains", value: [0, 6] }, // Saturday and Sunday
        { type: "time", operator: "between", value: ["10:00", "14:00"] }
      ],
      actions: [
        { type: "available" },
        { type: "premium", value: 1.5 } // 50% premium
      ]
    },
    {
      id: "rule-3",
      name: "Daily Capacity Limit",
      type: "capacity",
      enabled: true,
      priority: 3,
      conditions: [
        { type: "capacity", operator: "greater", value: 10 }
      ],
      actions: [
        { type: "auto-decline" }
      ]
    },
    {
      id: "rule-4",
      name: "Holiday Blocking",
      type: "special",
      enabled: true,
      priority: 4,
      conditions: [
        { type: "date", operator: "equals", value: ["2024-12-25", "2024-01-01"] }
      ],
      actions: [
        { type: "block" }
      ]
    },
    {
      id: "rule-5",
      name: "Peak Time Premium",
      type: "smart",
      enabled: true,
      priority: 5,
      conditions: [
        { type: "time", operator: "between", value: ["14:00", "16:00"] },
        { type: "revenue", operator: "greater", value: 500 }
      ],
      actions: [
        { type: "premium", value: 1.3 }
      ]
    }
  ]
}

const generateAvailabilityPatterns = (): AvailabilityPattern[] => {
  return [
    {
      id: "pattern-1",
      name: "Standard Weekday",
      days: [1, 2, 3, 4, 5],
      startTime: "09:00",
      endTime: "18:00",
      breaks: [
        { name: "Lunch", startTime: "12:00", endTime: "13:00" },
        { name: "Afternoon Break", startTime: "15:00", endTime: "15:15" }
      ],
      timezone: "America/New_York"
    },
    {
      id: "pattern-2",
      name: "Weekend Schedule",
      days: [0, 6],
      startTime: "10:00",
      endTime: "14:00",
      breaks: [],
      timezone: "America/New_York"
    },
    {
      id: "pattern-3",
      name: "Evening Sessions",
      days: [1, 3, 5],
      startTime: "19:00",
      endTime: "21:00",
      breaks: [],
      timezone: "America/New_York"
    }
  ]
}

const generateCalendarIntegrations = (): CalendarIntegration[] => {
  return [
    {
      id: "cal-1",
      provider: "google",
      name: "Google Calendar",
      email: "creator@gmail.com",
      connected: true,
      syncEnabled: true,
      lastSync: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      twoWaySync: true
    },
    {
      id: "cal-2",
      provider: "apple",
      name: "Apple Calendar",
      email: "creator@icloud.com",
      connected: false,
      syncEnabled: false,
      twoWaySync: false
    },
    {
      id: "cal-3",
      provider: "outlook",
      name: "Outlook Calendar",
      email: "creator@outlook.com",
      connected: true,
      syncEnabled: false,
      lastSync: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      twoWaySync: false
    }
  ]
}

const generateSchedulingMetrics = (): SchedulingMetrics => {
  return {
    totalBookings: 156,
    totalHours: 234,
    averagePerDay: 8.5,
    peakHours: ["14:00", "15:00", "16:00"],
    utilizationRate: 75,
    revenue: 23400,
    missedOpportunities: 12
  }
}

const generateHeatmapData = () => {
  const data = []
  const today = new Date()
  
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    data.push({
      date: format(date, "yyyy-MM-dd"),
      value: Math.floor(Math.random() * 10),
      bookings: Math.floor(Math.random() * 15)
    })
  }
  
  return data
}

// Sub-components
const CalendarView: React.FC<{
  slots: TimeSlot[]
  onSlotClick?: (slot: TimeSlot) => void
  selectedDate: Date
  onDateChange: (date: Date) => void
}> = ({ slots, onSlotClick, selectedDate, onDateChange }) => {
  const [viewMode, setViewMode] = React.useState<"month" | "week" | "day">("week")
  
  const getDaySlots = (date: Date) => {
    return slots.filter(slot => isSameDay(slot.start, date))
  }
  
  const getStatusColor = (status: TimeSlot["status"]) => {
    switch (status) {
      case "available": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "busy": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "blocked": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      case "break": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
      case "buffer": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      default: return "bg-gray-100 text-gray-800"
    }
  }
  
  return (
    <div className="space-y-4">
      {/* View Mode Selector */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("month")}
          >
            Month
          </Button>
          <Button
            variant={viewMode === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("week")}
          >
            Week
          </Button>
          <Button
            variant={viewMode === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("day")}
          >
            Day
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const newDate = new Date(selectedDate)
              newDate.setDate(newDate.getDate() - 1)
              onDateChange(newDate)
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="font-medium">
            {format(selectedDate, viewMode === "month" ? "MMMM yyyy" : "MMM d, yyyy")}
          </span>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              const newDate = new Date(selectedDate)
              newDate.setDate(newDate.getDate() + 1)
              onDateChange(newDate)
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Calendar Grid */}
      {viewMode === "day" && (
        <div className="space-y-2">
          {getDaySlots(selectedDate).map(slot => (
            <motion.div
              key={slot.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSlotClick?.(slot)}
              className={cn(
                "p-3 rounded-lg border cursor-pointer transition-all",
                getStatusColor(slot.status)
              )}
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">
                    {format(slot.start, "HH:mm")} - {format(slot.end, "HH:mm")}
                  </span>
                  {slot.notes && (
                    <p className="text-sm opacity-75">{slot.notes}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {slot.bookings !== undefined && slot.capacity && (
                    <Badge variant="outline">
                      {slot.bookings}/{slot.capacity}
                    </Badge>
                  )}
                  {slot.price && (
                    <Badge variant="secondary">
                      ${slot.price}
                    </Badge>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {viewMode === "week" && (
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 7 }).map((_, index) => {
            const date = new Date(startOfWeek(selectedDate))
            date.setDate(date.getDate() + index)
            const daySlots = getDaySlots(date)
            
            return (
              <div key={index} className="space-y-2">
                <div className="text-center">
                  <div className="text-sm font-medium">
                    {format(date, "EEE")}
                  </div>
                  <div className={cn(
                    "text-lg",
                    isSameDay(date, new Date()) && "font-bold text-purple-600"
                  )}>
                    {format(date, "d")}
                  </div>
                </div>
                
                <div className="space-y-1">
                  {daySlots.slice(0, 3).map(slot => (
                    <div
                      key={slot.id}
                      className={cn(
                        "p-1 rounded text-xs text-center cursor-pointer",
                        getStatusColor(slot.status)
                      )}
                      onClick={() => onSlotClick?.(slot)}
                    >
                      {format(slot.start, "HH:mm")}
                    </div>
                  ))}
                  {daySlots.length > 3 && (
                    <div className="text-xs text-center text-gray-500">
                      +{daySlots.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
      
      {viewMode === "month" && (
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && onDateChange(date)}
          className="rounded-md border"
        />
      )}
    </div>
  )
}

const TimelineView: React.FC<{
  slots: TimeSlot[]
  onSlotUpdate?: (slot: TimeSlot) => void
}> = ({ slots, onSlotUpdate }) => {
  const hours = Array.from({ length: 24 }, (_, i) => i)
  
  const getSlotAtHour = (hour: number) => {
    return slots.find(slot => {
      const slotHour = slot.start.getHours()
      return slotHour === hour
    })
  }
  
  const getStatusColor = (status?: TimeSlot["status"]) => {
    if (!status) return "bg-gray-50 dark:bg-gray-800"
    switch (status) {
      case "available": return "bg-green-100 hover:bg-green-200 dark:bg-green-900"
      case "busy": return "bg-yellow-100 hover:bg-yellow-200 dark:bg-yellow-900"
      case "blocked": return "bg-red-100 hover:bg-red-200 dark:bg-red-900"
      case "break": return "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700"
      case "buffer": return "bg-blue-100 hover:bg-blue-200 dark:bg-blue-900"
      default: return "bg-gray-100"
    }
  }
  
  return (
    <div className="relative">
      <div className="flex gap-2 overflow-x-auto pb-4">
        {hours.map(hour => {
          const slot = getSlotAtHour(hour)
          
          return (
            <div
              key={hour}
              className="flex-shrink-0 w-20"
            >
              <div className="text-xs text-center mb-2 text-gray-600">
                {hour.toString().padStart(2, "0")}:00
              </div>
              
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  "h-24 rounded-lg border cursor-pointer transition-all flex flex-col items-center justify-center",
                  getStatusColor(slot?.status)
                )}
                onClick={() => {
                  if (slot) {
                    onSlotUpdate?.(slot)
                  }
                }}
              >
                {slot ? (
                  <>
                    <div className="text-xs font-medium capitalize">
                      {slot.status}
                    </div>
                    {slot.bookings !== undefined && slot.capacity && (
                      <div className="text-xs mt-1">
                        {slot.bookings}/{slot.capacity}
                      </div>
                    )}
                    {slot.price && (
                      <div className="text-xs mt-1 font-bold">
                        ${slot.price}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-gray-400">
                    No data
                  </div>
                )}
              </motion.div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ListView: React.FC<{
  slots: TimeSlot[]
  patterns: AvailabilityPattern[]
  onBulkAction?: (action: string, slots: TimeSlot[]) => void
}> = ({ slots, patterns, onBulkAction }) => {
  const [selectedSlots, setSelectedSlots] = React.useState<Set<string>>(new Set())
  const [dateRange, setDateRange] = React.useState(30) // Next 30 days
  
  const handleSelectSlot = (slotId: string) => {
    const newSelected = new Set(selectedSlots)
    if (newSelected.has(slotId)) {
      newSelected.delete(slotId)
    } else {
      newSelected.add(slotId)
    }
    setSelectedSlots(newSelected)
  }
  
  const handleSelectAll = () => {
    if (selectedSlots.size === slots.length) {
      setSelectedSlots(new Set())
    } else {
      setSelectedSlots(new Set(slots.map(s => s.id)))
    }
  }
  
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSelectAll}
          >
            {selectedSlots.size === slots.length ? "Deselect All" : "Select All"}
          </Button>
          
          {selectedSlots.size > 0 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const selected = slots.filter(s => selectedSlots.has(s.id))
                  onBulkAction?.("available", selected)
                }}
              >
                Mark Available
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const selected = slots.filter(s => selectedSlots.has(s.id))
                  onBulkAction?.("block", selected)
                }}
              >
                Block
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const selected = slots.filter(s => selectedSlots.has(s.id))
                  onBulkAction?.("delete", selected)
                }}
              >
                Delete
              </Button>
            </>
          )}
        </div>
        
        <Select value={dateRange.toString()} onValueChange={(v) => setDateRange(parseInt(v))}>
          <SelectTrigger className="w-[150px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Next 7 days</SelectItem>
            <SelectItem value="14">Next 14 days</SelectItem>
            <SelectItem value="30">Next 30 days</SelectItem>
            <SelectItem value="60">Next 60 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* List */}
      <div className="space-y-2">
        {slots.map(slot => (
          <div
            key={slot.id}
            className={cn(
              "flex items-center gap-4 p-3 bg-white dark:bg-gray-800 rounded-lg border",
              selectedSlots.has(slot.id) && "ring-2 ring-purple-500"
            )}
          >
            <input
              type="checkbox"
              checked={selectedSlots.has(slot.id)}
              onChange={() => handleSelectSlot(slot.id)}
              className="rounded"
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {format(slot.start, "MMM d, yyyy")}
                </span>
                <span className="text-sm text-gray-600">
                  {format(slot.start, "HH:mm")} - {format(slot.end, "HH:mm")}
                </span>
              </div>
              {slot.notes && (
                <p className="text-sm text-gray-500">{slot.notes}</p>
              )}
            </div>
            
            <Badge
              variant={
                slot.status === "available" ? "default" :
                slot.status === "busy" ? "secondary" :
                slot.status === "blocked" ? "destructive" :
                "outline"
              }
            >
              {slot.status}
            </Badge>
            
            {slot.bookings !== undefined && slot.capacity && (
              <Badge variant="outline">
                {slot.bookings}/{slot.capacity} booked
              </Badge>
            )}
            
            {slot.price && (
              <Badge variant="secondary">
                ${slot.price}
              </Badge>
            )}
            
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}

const HeatmapView: React.FC<{
  data: any[]
}> = ({ data }) => {
  const getColor = (value: number) => {
    if (value === 0) return "bg-gray-100 dark:bg-gray-800"
    if (value < 3) return "bg-green-200 dark:bg-green-900"
    if (value < 6) return "bg-green-400 dark:bg-green-700"
    if (value < 9) return "bg-green-600 dark:bg-green-500"
    return "bg-green-800 dark:bg-green-300"
  }
  
  // Group data by week
  const weeks: any[][] = []
  let currentWeek: any[] = []
  
  data.forEach((day, index) => {
    currentWeek.push(day)
    if ((index + 1) % 7 === 0) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })
  
  if (currentWeek.length > 0) {
    weeks.push(currentWeek)
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Yearly Activity Heatmap</h4>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-600">Less</span>
          <div className="flex gap-1">
            {[0, 3, 6, 9].map(value => (
              <div
                key={value}
                className={cn("w-4 h-4 rounded", getColor(value))}
                title={`${value}+ bookings`}
              />
            ))}
          </div>
          <span className="text-gray-600">More</span>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <div className="flex gap-1">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-1">
              {week.map((day, dayIndex) => (
                <div
                  key={dayIndex}
                  className={cn(
                    "w-3 h-3 rounded-sm cursor-pointer transition-all hover:ring-2 hover:ring-purple-400",
                    getColor(day.value)
                  )}
                  title={`${day.date}: ${day.bookings} bookings`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-12 gap-2 text-xs text-gray-600">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map(month => (
          <div key={month}>{month}</div>
        ))}
      </div>
    </div>
  )
}

const SmartSchedulingView: React.FC<{
  metrics: SchedulingMetrics
  onOptimize?: () => void
}> = ({ metrics, onOptimize }) => {
  const suggestions = [
    {
      icon: TrendingUp,
      title: "Increase afternoon availability",
      description: "Your 2-4 PM slots have 95% booking rate with premium pricing",
      impact: "+$450/week",
      color: "text-green-600"
    },
    {
      icon: Clock,
      title: "Add buffer time between bookings",
      description: "Reduce stress and improve quality with 15-min buffers",
      impact: "Better reviews",
      color: "text-blue-600"
    },
    {
      icon: DollarSign,
      title: "Enable dynamic pricing",
      description: "Automatically adjust prices based on demand",
      impact: "+20% revenue",
      color: "text-purple-600"
    },
    {
      icon: Calendar,
      title: "Open weekend mornings",
      description: "High demand detected for Saturday 10-12 PM slots",
      impact: "+8 bookings/month",
      color: "text-orange-600"
    }
  ]
  
  return (
    <div className="space-y-6">
      {/* Metrics Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilization</p>
                <p className="text-2xl font-bold">{metrics.utilizationRate}%</p>
              </div>
              <Gauge className="h-8 w-8 text-blue-600" />
            </div>
            <Progress value={metrics.utilizationRate} className="mt-2" />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenue</p>
                <p className="text-2xl font-bold">${metrics.revenue.toLocaleString()}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-xs text-green-600 mt-2">+12% vs last month</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg/Day</p>
                <p className="text-2xl font-bold">{metrics.averagePerDay}h</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-xs text-gray-600 mt-2">Healthy workload</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Missed Opps</p>
                <p className="text-2xl font-bold">{metrics.missedOpportunities}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
            <div className="text-xs text-orange-600 mt-2">Optimize schedule</div>
          </CardContent>
        </Card>
      </div>
      
      {/* AI Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-600" />
            Smart Scheduling Suggestions
          </CardTitle>
          <CardDescription>
            AI-powered recommendations to optimize your schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {suggestions.map((suggestion, index) => {
              const Icon = suggestion.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className={cn("p-2 rounded-lg bg-white dark:bg-gray-700", suggestion.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1">
                    <h5 className="font-medium">{suggestion.title}</h5>
                    <p className="text-sm text-gray-600 mt-1">{suggestion.description}</p>
                    <Badge variant="secondary" className="mt-2">
                      {suggestion.impact}
                    </Badge>
                  </div>
                  
                  <Button size="sm" variant="outline">
                    Apply
                  </Button>
                </motion.div>
              )
            })}
          </div>
          
          <Button className="w-full mt-4" onClick={onOptimize}>
            <Sparkles className="h-4 w-4 mr-2" />
            Optimize My Schedule
          </Button>
        </CardContent>
      </Card>
      
      {/* Peak Hours Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Peak Hours Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Your peak hours:</span>
            {metrics.peakHours.map(hour => (
              <Badge key={hour} variant="secondary">
                {hour}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Consider premium pricing during these high-demand periods
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

const RulesEngine: React.FC<{
  rules: ScheduleRule[]
  onRuleToggle?: (ruleId: string) => void
  onRuleEdit?: (ruleId: string) => void
  onRuleDelete?: (ruleId: string) => void
  onRuleCreate?: (rule: ScheduleRule) => void
}> = ({ rules, onRuleToggle, onRuleEdit, onRuleDelete, onRuleCreate }) => {
  const getRuleIcon = (type: ScheduleRule["type"]) => {
    switch (type) {
      case "regular": return Clock
      case "capacity": return Users
      case "special": return Calendar
      case "smart": return Brain
      default: return Settings
    }
  }
  
  const getRuleColor = (type: ScheduleRule["type"]) => {
    switch (type) {
      case "regular": return "text-blue-600"
      case "capacity": return "text-green-600"
      case "special": return "text-purple-600"
      case "smart": return "text-orange-600"
      default: return "text-gray-600"
    }
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Scheduling Rules</h4>
        <Button size="sm" onClick={() => {
          // Create new rule
          const newRule: ScheduleRule = {
            id: `rule-${Date.now()}`,
            name: "New Rule",
            type: "regular",
            enabled: true,
            priority: rules.length + 1,
            conditions: [],
            actions: []
          }
          onRuleCreate?.(newRule)
        }}>
          <Plus className="h-4 w-4 mr-1" />
          Add Rule
        </Button>
      </div>
      
      <div className="space-y-2">
        {rules.sort((a, b) => a.priority - b.priority).map(rule => {
          const Icon = getRuleIcon(rule.type)
          
          return (
            <Card key={rule.id}>
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("p-2 rounded-lg bg-gray-100 dark:bg-gray-800", getRuleColor(rule.type))}>
                      <Icon className="h-4 w-4" />
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <h5 className="font-medium">{rule.name}</h5>
                        <Badge variant="outline" className="text-xs">
                          Priority {rule.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-600">
                          {rule.conditions.length} conditions
                        </span>
                        <span className="text-xs text-gray-600">•</span>
                        <span className="text-xs text-gray-600">
                          {rule.actions.length} actions
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={rule.enabled}
                      onCheckedChange={() => onRuleToggle?.(rule.id)}
                    />
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRuleEdit?.(rule.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRuleDelete?.(rule.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

const CalendarIntegrations: React.FC<{
  integrations: CalendarIntegration[]
  onConnect?: (provider: string) => void
  onDisconnect?: (integrationId: string) => void
  onSyncToggle?: (integrationId: string) => void
}> = ({ integrations, onConnect, onDisconnect, onSyncToggle }) => {
  const getProviderIcon = (provider: CalendarIntegration["provider"]) => {
    switch (provider) {
      case "google": return Calendar
      case "apple": return Calendar
      case "outlook": return Calendar
      default: return Calendar
    }
  }
  
  const getProviderColor = (provider: CalendarIntegration["provider"]) => {
    switch (provider) {
      case "google": return "text-blue-600"
      case "apple": return "text-gray-600"
      case "outlook": return "text-blue-700"
      default: return "text-gray-600"
    }
  }
  
  return (
    <div className="space-y-4">
      {integrations.map(integration => {
        const Icon = getProviderIcon(integration.provider)
        
        return (
          <Card key={integration.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg bg-gray-100 dark:bg-gray-800", getProviderColor(integration.provider))}>
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div>
                    <h5 className="font-medium">{integration.name}</h5>
                    <p className="text-sm text-gray-600">{integration.email}</p>
                    {integration.lastSync && (
                      <p className="text-xs text-gray-500 mt-1">
                        Last synced: {format(integration.lastSync, "MMM d, HH:mm")}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {integration.connected ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`sync-${integration.id}`} className="text-sm">
                          Sync
                        </Label>
                        <Switch
                          id={`sync-${integration.id}`}
                          checked={integration.syncEnabled}
                          onCheckedChange={() => onSyncToggle?.(integration.id)}
                        />
                      </div>
                      
                      {integration.twoWaySync && (
                        <Badge variant="secondary" className="text-xs">
                          2-way sync
                        </Badge>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDisconnect?.(integration.id)}
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => onConnect?.(integration.provider)}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

// Main component
export const SchedulingAvailabilityTools: React.FC<SchedulingAvailabilityToolsProps> = ({
  onScheduleUpdate,
  onRuleCreate,
  onIntegrationConnect,
  onAvailabilityChange,
  enableSmartScheduling = true,
  enableCalendarSync = true,
  enableAutomation = true
}) => {
  const [selectedDate, setSelectedDate] = React.useState(new Date())
  const [slots] = React.useState<TimeSlot[]>(generateTimeSlots(new Date()))
  const [rules] = React.useState<ScheduleRule[]>(generateScheduleRules())
  const [patterns] = React.useState<AvailabilityPattern[]>(generateAvailabilityPatterns())
  const [integrations] = React.useState<CalendarIntegration[]>(generateCalendarIntegrations())
  const [metrics] = React.useState<SchedulingMetrics>(generateSchedulingMetrics())
  const [heatmapData] = React.useState(generateHeatmapData())
  const [activeView, setActiveView] = React.useState<"calendar" | "timeline" | "list" | "heatmap" | "smart">("calendar")
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">Scheduling & Availability</h3>
          <p className="text-sm text-gray-600">
            Manage your availability and production schedule
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {metrics.totalBookings} bookings
          </Badge>
          <Badge variant="outline">
            {metrics.utilizationRate}% utilized
          </Badge>
        </div>
      </div>
      
      {/* View Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Button
              variant={activeView === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("calendar")}
            >
              <CalendarIcon className="h-4 w-4 mr-1" />
              Calendar
            </Button>
            <Button
              variant={activeView === "timeline" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("timeline")}
            >
              <Clock className="h-4 w-4 mr-1" />
              Timeline
            </Button>
            <Button
              variant={activeView === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("list")}
            >
              <List className="h-4 w-4 mr-1" />
              List
            </Button>
            <Button
              variant={activeView === "heatmap" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveView("heatmap")}
            >
              <Grid className="h-4 w-4 mr-1" />
              Heatmap
            </Button>
            {enableSmartScheduling && (
              <Button
                variant={activeView === "smart" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveView("smart")}
              >
                <Brain className="h-4 w-4 mr-1" />
                Smart
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {activeView === "calendar" && (
            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
                <CardDescription>
                  Click to toggle availability, drag to adjust time slots
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CalendarView
                  slots={slots}
                  selectedDate={selectedDate}
                  onDateChange={setSelectedDate}
                  onSlotClick={(slot) => console.log("Slot clicked:", slot)}
                />
              </CardContent>
            </Card>
          )}
          
          {activeView === "timeline" && (
            <Card>
              <CardHeader>
                <CardTitle>Timeline View</CardTitle>
                <CardDescription>
                  Hourly breakdown with drag-to-adjust functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TimelineView
                  slots={slots}
                  onSlotUpdate={(slot) => console.log("Slot updated:", slot)}
                />
              </CardContent>
            </Card>
          )}
          
          {activeView === "list" && (
            <Card>
              <CardHeader>
                <CardTitle>List View</CardTitle>
                <CardDescription>
                  Quick edit with bulk actions for the next 30 days
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ListView
                  slots={slots}
                  patterns={patterns}
                  onBulkAction={(action, slots) => console.log("Bulk action:", action, slots)}
                />
              </CardContent>
            </Card>
          )}
          
          {activeView === "heatmap" && (
            <Card>
              <CardHeader>
                <CardTitle>Activity Heatmap</CardTitle>
                <CardDescription>
                  Visual analysis of busy periods over the year
                </CardDescription>
              </CardHeader>
              <CardContent>
                <HeatmapView data={heatmapData} />
              </CardContent>
            </Card>
          )}
          
          {activeView === "smart" && enableSmartScheduling && (
            <SmartSchedulingView
              metrics={metrics}
              onOptimize={() => console.log("Optimizing schedule...")}
            />
          )}
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Rules Engine */}
          {enableAutomation && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Automation Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <RulesEngine
                  rules={rules}
                  onRuleToggle={(id) => console.log("Toggle rule:", id)}
                  onRuleEdit={(id) => console.log("Edit rule:", id)}
                  onRuleDelete={(id) => console.log("Delete rule:", id)}
                  onRuleCreate={(rule) => onRuleCreate?.(rule)}
                />
              </CardContent>
            </Card>
          )}
          
          {/* Calendar Integrations */}
          {enableCalendarSync && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Calendar Sync</CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarIntegrations
                  integrations={integrations}
                  onConnect={(provider) => console.log("Connect:", provider)}
                  onDisconnect={(id) => console.log("Disconnect:", id)}
                  onSyncToggle={(id) => console.log("Toggle sync:", id)}
                />
              </CardContent>
            </Card>
          )}
          
          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Today's Bookings</span>
                  <span className="font-medium">8/10</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">This Week</span>
                  <span className="font-medium">42/50</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Revenue Today</span>
                  <span className="font-medium text-green-600">$1,200</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Next Available</span>
                  <span className="font-medium">Tomorrow 2PM</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}