"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Calendar, Clock, Settings, ChevronLeft, ChevronRight, Plus, X, CalendarDays, CalendarOff, AlertCircle, Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import { format, addDays, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore, isAfter } from "date-fns"

// Translations
const scheduleTranslations: Record<string, Record<string, string>> = {
  availability_schedule: {
    en: "Availability Schedule",
    fr: "Calendrier de disponibilité",
    ht: "Orè disponibilite"
  },
  manage_availability: {
    en: "Manage your availability and booking schedule",
    fr: "Gérez votre disponibilité et votre calendrier de réservation",
    ht: "Jere disponibilite ak orè rezèvasyon ou"
  },
  availability_status: {
    en: "Availability Status",
    fr: "Statut de disponibilité",
    ht: "Estati disponibilite"
  },
  toggle_availability: {
    en: "Toggle your availability for new bookings",
    fr: "Basculer votre disponibilité pour de nouvelles réservations",
    ht: "Chanje disponibilite ou pou nouvo rezèvasyon"
  },
  available: {
    en: "Available",
    fr: "Disponible",
    ht: "Disponib"
  },
  unavailable: {
    en: "Unavailable",
    fr: "Indisponible",
    ht: "Pa disponib"
  },
  accepting_bookings: {
    en: "Accepting Bookings",
    fr: "Accepter les réservations",
    ht: "Aksepte rezèvasyon"
  },
  not_accepting: {
    en: "Not Accepting Bookings",
    fr: "Ne pas accepter les réservations",
    ht: "Pa aksepte rezèvasyon"
  },
  weekly_schedule: {
    en: "Weekly Schedule",
    fr: "Horaire hebdomadaire",
    ht: "Orè semèn"
  },
  set_regular: {
    en: "Set your regular availability",
    fr: "Définissez votre disponibilité régulière",
    ht: "Defini disponibilite regilye ou"
  },
  upcoming_bookings: {
    en: "Upcoming Bookings",
    fr: "Réservations à venir",
    ht: "Rezèvasyon k ap vini"
  },
  scheduled_recordings: {
    en: "Your next scheduled recordings",
    fr: "Vos prochains enregistrements programmés",
    ht: "Pwochèn anrejistreman pwograme ou yo"
  },
  calendar_view: {
    en: "Calendar View",
    fr: "Vue calendrier",
    ht: "Gade kalandriye"
  },
  blocked_dates: {
    en: "Blocked Dates",
    fr: "Dates bloquées",
    ht: "Dat bloke"
  },
  when_unavailable: {
    en: "Dates when you're not available",
    fr: "Dates où vous n'êtes pas disponible",
    ht: "Dat ou pa disponib"
  },
  block_dates: {
    en: "Block Dates",
    fr: "Bloquer des dates",
    ht: "Bloke dat"
  },
  vacation_mode: {
    en: "Vacation Mode",
    fr: "Mode vacances",
    ht: "Mòd vakans"
  },
  quick_actions: {
    en: "Quick Actions",
    fr: "Actions rapides",
    ht: "Aksyon rapid"
  }
}

export default function CreatorSchedulePage() {
  const { language } = useLanguage()
  const [isAvailable, setIsAvailable] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isBlockDialogOpen, setIsBlockDialogOpen] = useState(false)
  const [isEditScheduleOpen, setIsEditScheduleOpen] = useState(false)
  const [vacationMode, setVacationMode] = useState(false)
  const [blockReason, setBlockReason] = useState("")
  const [blockType, setBlockType] = useState<"single" | "range">("single")
  const [blockEndDate, setBlockEndDate] = useState<Date | null>(null)
  
  const t = (key: string) => {
    return scheduleTranslations[key]?.[language] || scheduleTranslations[key]?.en || key
  }

  const [timeSlots, setTimeSlots] = useState([
    { day: "Monday", slots: ["9:00 AM - 12:00 PM", "2:00 PM - 6:00 PM"], enabled: true },
    { day: "Tuesday", slots: ["9:00 AM - 12:00 PM", "2:00 PM - 6:00 PM"], enabled: true },
    { day: "Wednesday", slots: ["9:00 AM - 12:00 PM", "2:00 PM - 6:00 PM"], enabled: true },
    { day: "Thursday", slots: ["9:00 AM - 12:00 PM", "2:00 PM - 6:00 PM"], enabled: false },
    { day: "Friday", slots: ["9:00 AM - 12:00 PM", "2:00 PM - 6:00 PM"], enabled: true },
    { day: "Saturday", slots: ["10:00 AM - 2:00 PM"], enabled: true },
    { day: "Sunday", slots: [], enabled: false }
  ])

  const [blockedDates, setBlockedDates] = useState([
    { id: "1", startDate: "2024-08-20", endDate: "2024-08-20", reason: "Personal Day", type: "single" as const },
    { id: "2", startDate: "2024-08-25", endDate: "2024-08-26", reason: "Vacation", type: "range" as const },
    { id: "3", startDate: "2024-09-01", endDate: "2024-09-07", reason: "Holiday Trip", type: "range" as const }
  ])

  const upcomingBookings = [
    { date: "2024-08-18", time: "10:00 AM", customer: "John Doe", occasion: "Birthday" },
    { date: "2024-08-19", time: "2:00 PM", customer: "Sarah Smith", occasion: "Anniversary" },
    { date: "2024-08-21", time: "11:00 AM", customer: "Mike Johnson", occasion: "Graduation" }
  ]

  const getDaysInMonth = (date: Date) => {
    const start = startOfMonth(date)
    const end = endOfMonth(date)
    const days = eachDayOfInterval({ start, end })
    
    // Add padding days from previous month
    const startDayOfWeek = start.getDay()
    const paddingDays = []
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      paddingDays.push(addDays(start, -(i + 1)))
    }
    
    // Add padding days from next month to complete the grid
    const totalDays = paddingDays.length + days.length
    const remainingDays = 42 - totalDays // 6 weeks * 7 days
    const nextMonthDays = []
    for (let i = 1; i <= remainingDays; i++) {
      nextMonthDays.push(addDays(end, i))
    }
    
    return [...paddingDays, ...days, ...nextMonthDays]
  }
  
  const isDateBlocked = useCallback((date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return blockedDates.some(blocked => {
      if (blocked.type === "single") {
        return blocked.startDate === dateStr
      } else {
        const start = new Date(blocked.startDate)
        const end = new Date(blocked.endDate)
        return date >= start && date <= end
      }
    })
  }, [blockedDates])
  
  const hasBookingOnDate = useCallback((date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return upcomingBookings.some(booking => booking.date === dateStr)
  }, [])
  
  const handleBlockDate = () => {
    if (!selectedDate) return
    
    const newBlock = {
      id: Date.now().toString(),
      startDate: format(selectedDate, "yyyy-MM-dd"),
      endDate: blockType === "range" && blockEndDate 
        ? format(blockEndDate, "yyyy-MM-dd")
        : format(selectedDate, "yyyy-MM-dd"),
      reason: blockReason || "Blocked",
      type: blockType
    }
    
    setBlockedDates([...blockedDates, newBlock])
    setIsBlockDialogOpen(false)
    setSelectedDate(null)
    setBlockEndDate(null)
    setBlockReason("")
    setBlockType("single")
  }
  
  const handleRemoveBlock = (id: string) => {
    setBlockedDates(blockedDates.filter(b => b.id !== id))
  }
  
  const handleToggleDay = (dayIndex: number) => {
    const newSlots = [...timeSlots]
    newSlots[dayIndex].enabled = !newSlots[dayIndex].enabled
    setTimeSlots(newSlots)
  }
  
  const handleQuickBlock = (days: number) => {
    const today = new Date()
    const endDate = addDays(today, days - 1)
    
    const newBlock = {
      id: Date.now().toString(),
      startDate: format(today, "yyyy-MM-dd"),
      endDate: format(endDate, "yyyy-MM-dd"),
      reason: `Blocked for ${days} days`,
      type: "range" as const
    }
    
    setBlockedDates([...blockedDates, newBlock])
  }

  const navigateMonth = (direction: number) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + direction, 1))
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('availability_schedule')}</h1>
            <p className="text-gray-600 mt-1">{t('manage_availability')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={vacationMode ? "destructive" : "outline"}
              onClick={() => setVacationMode(!vacationMode)}
            >
              <CalendarOff className="h-4 w-4 mr-2" />
              {t('vacation_mode')}
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
              onClick={() => setIsEditScheduleOpen(true)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Edit Schedule
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t('quick_actions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickBlock(1)}
            >
              Block Today
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickBlock(3)}
            >
              Block Next 3 Days
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleQuickBlock(7)}
            >
              Block Next Week
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setBlockedDates([])}
              className="text-red-600 hover:text-red-700"
            >
              Clear All Blocks
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 mb-6">
        <Card className={cn(
          "transition-all",
          vacationMode && "border-orange-300 bg-orange-50"
        )}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('availability_status')}</CardTitle>
                <CardDescription>
                  {t('toggle_availability')}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Label htmlFor="availability-toggle">
                  {isAvailable && !vacationMode ? t('available') : t('unavailable')}
                </Label>
                <Switch
                  id="availability-toggle"
                  checked={isAvailable && !vacationMode}
                  onCheckedChange={(checked) => {
                    setIsAvailable(checked)
                    if (checked) setVacationMode(false)
                  }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              {vacationMode ? (
                <>
                  <Badge variant="destructive">
                    <CalendarOff className="h-3 w-3 mr-1" />
                    Vacation Mode Active
                  </Badge>
                  <p className="text-sm text-orange-700">
                    All new bookings are paused
                  </p>
                </>
              ) : (
                <>
                  <Badge variant={isAvailable ? "default" : "secondary"}>
                    {isAvailable ? t('accepting_bookings') : t('not_accepting')}
                  </Badge>
                  {isAvailable && (
                    <p className="text-sm text-muted-foreground">
                      Your response time: Within 24 hours
                    </p>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{t('weekly_schedule')}</CardTitle>
              <CardDescription>{t('set_regular')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {timeSlots.map((slot, index) => (
                <div key={slot.day} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Switch 
                      checked={slot.enabled} 
                      onCheckedChange={() => handleToggleDay(index)}
                    />
                    <span className={slot.enabled ? "" : "text-muted-foreground"}>
                      {slot.day}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {slot.enabled && slot.slots.length > 0 
                      ? slot.slots.join(", ")
                      : "Unavailable"}
                  </div>
                </div>
              ))}
              <Dialog open={isEditScheduleOpen} onOpenChange={setIsEditScheduleOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full mt-4">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Time Slots
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-hidden flex flex-col bg-white">
                  <DialogHeader>
                    <DialogTitle>Edit Weekly Schedule</DialogTitle>
                    <DialogDescription>
                      Configure your regular working hours for each day
                    </DialogDescription>
                  </DialogHeader>
                  <div className="flex-1 overflow-y-auto px-1 py-4">
                    <div className="space-y-2">
                      {timeSlots.map((slot, index) => (
                        <div 
                          key={slot.day} 
                          className={cn(
                            "bg-white rounded-lg border-l-4 border-r border-t border-b shadow-sm hover:shadow-md transition-all p-3",
                            slot.enabled 
                              ? "border-l-purple-500 border-r-gray-200 border-t-gray-200 border-b-gray-200" 
                              : "border-l-gray-300 border-r-gray-200 border-t-gray-200 border-b-gray-200 opacity-75"
                          )}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-sm font-semibold">
                              {slot.day}
                            </Label>
                            <Switch 
                              checked={slot.enabled}
                              onCheckedChange={() => handleToggleDay(index)}
                              className="data-[state=checked]:bg-purple-600"
                            />
                          </div>
                          {slot.enabled && (
                            <div className="space-y-1.5 pl-2">
                              {slot.slots.map((time, timeIndex) => (
                                <div key={timeIndex} className="flex items-center gap-2 group">
                                  <Clock className="h-3.5 w-3.5 text-purple-500" />
                                  <input 
                                    value={time} 
                                    readOnly 
                                    className="flex-1 h-8 px-3 text-sm bg-white border border-gray-200 rounded-md hover:border-purple-300 transition-colors" 
                                  />
                                  <button 
                                    className="w-7 h-7 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-white hover:bg-red-500 flex items-center justify-center"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                              ))}
                              <button 
                                className="w-full h-8 mt-1.5 border border-dashed border-purple-300 rounded-md text-purple-600 hover:bg-purple-50 hover:border-purple-400 transition-all flex items-center justify-center gap-1.5 text-sm"
                              >
                                <Plus className="h-3.5 w-3.5" />
                                Add Time Slot
                              </button>
                            </div>
                          )}
                          {!slot.enabled && (
                            <div className="pl-2 text-xs text-gray-500 italic">
                              Day off - No bookings accepted
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  <DialogFooter className="border-t border-gray-200 pt-4 mt-2 bg-white">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsEditScheduleOpen(false)}
                      className="border-gray-300 hover:bg-gray-50"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={() => setIsEditScheduleOpen(false)}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:scale-[1.02] transition-all"
                    >
                      Save Changes
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t('upcoming_bookings')}</CardTitle>
              <CardDescription>{t('scheduled_recordings')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingBookings.map((booking, index) => (
                <div key={index} className="border-l-4 border-primary pl-3 py-2 hover:bg-gray-50 rounded transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{booking.customer}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.occasion}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">{booking.date}</p>
                      <p className="text-muted-foreground">{booking.time}</p>
                    </div>
                  </div>
                </div>
              ))}
              {upcomingBookings.length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No upcoming bookings
                  </p>
                </div>
              )}
              <Button variant="outline" className="w-full">
                View All Bookings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Calendar View */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{t('calendar_view')}</CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth(-1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="font-medium px-4 min-w-[180px] text-center">
                  {format(currentMonth, "MMMM yyyy")}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => navigateMonth(1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentMonth(new Date())}
                  className="ml-2"
                >
                  Today
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="text-center text-xs font-medium py-2 text-gray-600">
                  {day}
                </div>
              ))}
              {getDaysInMonth(currentMonth).map((date, index) => {
                const blocked = isDateBlocked(date)
                const hasBooking = hasBookingOnDate(date)
                const today = isToday(date)
                const currentMonthDate = isSameMonth(date, currentMonth)
                const isSelected = selectedDate?.toDateString() === date.toDateString()
                
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (currentMonthDate) {
                        setSelectedDate(date)
                        if (!blocked && !hasBooking) {
                          setIsBlockDialogOpen(true)
                        }
                      }
                    }}
                    disabled={!currentMonthDate}
                    className={cn(
                      "aspect-square flex flex-col items-center justify-center rounded-lg cursor-pointer transition-all relative p-1",
                      !currentMonthDate && "text-gray-300 cursor-default",
                      currentMonthDate && "hover:bg-gray-100",
                      today && "bg-primary text-primary-foreground hover:bg-primary/90",
                      blocked && currentMonthDate && "bg-red-100 text-red-700 hover:bg-red-200",
                      hasBooking && currentMonthDate && !blocked && "bg-green-100 text-green-700 hover:bg-green-200",
                      isSelected && "ring-2 ring-purple-500",
                      vacationMode && currentMonthDate && "opacity-50"
                    )}
                  >
                    <span className="text-sm font-medium">{format(date, "d")}</span>
                    {(blocked || hasBooking) && currentMonthDate && (
                      <div className="flex gap-0.5 mt-0.5">
                        {blocked && <div className="w-1 h-1 bg-red-500 rounded-full" />}
                        {hasBooking && <div className="w-1 h-1 bg-green-500 rounded-full" />}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-100 border border-green-300 rounded" />
                  <span className="text-gray-600">Bookings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border border-red-300 rounded" />
                  <span className="text-gray-600">Blocked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary rounded" />
                  <span className="text-gray-600">Today</span>
                </div>
              </div>
              {selectedDate && (
                <div className="text-sm text-gray-600">
                  Selected: {format(selectedDate, "MMM d, yyyy")}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Blocked Dates Management */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{t('blocked_dates')}</CardTitle>
                <CardDescription>{t('when_unavailable')}</CardDescription>
              </div>
              <Badge variant="outline">
                {blockedDates.length} blocked
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4 max-h-[300px] overflow-y-auto">
              {blockedDates.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarDays className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-muted-foreground">
                    No dates blocked
                  </p>
                </div>
              ) : (
                blockedDates.map((blocked) => (
                  <div key={blocked.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CalendarOff className="h-4 w-4 text-red-500" />
                        <p className="font-medium">
                          {blocked.type === "single" 
                            ? format(new Date(blocked.startDate), "MMM d, yyyy")
                            : `${format(new Date(blocked.startDate), "MMM d")} - ${format(new Date(blocked.endDate), "MMM d, yyyy")}`
                          }
                        </p>
                        {blocked.type === "range" && (
                          <Badge variant="secondary" className="text-xs">
                            {Math.ceil((new Date(blocked.endDate).getTime() - new Date(blocked.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{blocked.reason}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveBlock(blocked.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </div>
            
            {/* Block Dates Dialog */}
            <Dialog open={isBlockDialogOpen} onOpenChange={setIsBlockDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('block_dates')}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>{t('block_dates')}</DialogTitle>
                  <DialogDescription>
                    Select dates when you won't be available for bookings
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <Label>Block Type</Label>
                    <Select value={blockType} onValueChange={(value: "single" | "range") => setBlockType(value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single Day</SelectItem>
                        <SelectItem value="range">Date Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="block-start-date">
                      {blockType === "single" ? "Date" : "Start Date"}
                    </Label>
                    <Input
                      id="block-start-date"
                      type="date"
                      value={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                      className="mt-1"
                    />
                  </div>
                  
                  {blockType === "range" && (
                    <div>
                      <Label htmlFor="block-end-date">End Date</Label>
                      <Input
                        id="block-end-date"
                        type="date"
                        value={blockEndDate ? format(blockEndDate, "yyyy-MM-dd") : ""}
                        onChange={(e) => setBlockEndDate(new Date(e.target.value))}
                        min={selectedDate ? format(selectedDate, "yyyy-MM-dd") : ""}
                        className="mt-1"
                      />
                    </div>
                  )}
                  
                  <div>
                    <Label htmlFor="block-reason">Reason</Label>
                    <Textarea
                      id="block-reason"
                      placeholder="e.g., Vacation, Personal Day, Holiday"
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      className="mt-1"
                      rows={2}
                    />
                  </div>
                  
                  {blockType === "range" && selectedDate && blockEndDate && (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-orange-600" />
                        <span className="text-orange-700">
                          This will block {Math.ceil((blockEndDate.getTime() - selectedDate.getTime()) / (1000 * 60 * 60 * 24)) + 1} days
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <DialogFooter className="mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsBlockDialogOpen(false)
                      setSelectedDate(null)
                      setBlockEndDate(null)
                      setBlockReason("")
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleBlockDate}
                    disabled={!selectedDate || (blockType === "range" && !blockEndDate)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Block Date{blockType === "range" ? "s" : ""}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}