"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Video,
  Clock,
  Calendar,
  Search,
  Filter,
  Download,
  Star,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  XCircle,
  PlayCircle,
  Gift,
  MessageSquare,
  RefreshCw,
  Eye,
  Sparkles,
  Timer,
  TrendingUp,
  Heart,
  Package,
  DollarSign
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function CustomerBookingsPage() {
  const t = useTranslations()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<any>(null)
  const [showRatingDialog, setShowRatingDialog] = useState(false)
  const [rating, setRating] = useState(0)

  // Mock data for bookings
  const bookings = {
    active: [
      {
        id: "1",
        creator: "Marie Jean",
        creatorAvatar: "/placeholder.svg",
        occasion: "Birthday",
        recipient: "My sister Sarah",
        message: "Please wish her a happy 25th birthday in Kreyòl...",
        price: 75,
        status: "processing",
        orderedAt: "2024-03-20T10:00:00",
        expectedDelivery: "2024-03-22T18:00:00",
        progress: 65,
        videoUrl: null
      },
      {
        id: "2",
        creator: "Jean Baptiste",
        creatorAvatar: "/placeholder.svg",
        occasion: "Graduation",
        recipient: "My nephew Marc",
        message: "Congratulations on graduating from medical school...",
        price: 100,
        status: "pending",
        orderedAt: "2024-03-21T14:00:00",
        expectedDelivery: "2024-03-25T12:00:00",
        progress: 0,
        videoUrl: null
      }
    ],
    scheduled: [
      {
        id: "3",
        creator: "Claudette Pierre",
        creatorAvatar: "/placeholder.svg",
        occasion: "Anniversary",
        recipient: "My parents",
        message: "30th wedding anniversary message...",
        price: 60,
        status: "scheduled",
        orderedAt: "2024-03-15T09:00:00",
        expectedDelivery: "2024-04-01T15:00:00",
        progress: 0,
        videoUrl: null
      }
    ],
    completed: [
      {
        id: "4",
        creator: "Michel Louis",
        creatorAvatar: "/placeholder.svg",
        occasion: "Birthday",
        recipient: "My brother",
        message: "Happy birthday message with cooking tips...",
        price: 80,
        status: "completed",
        orderedAt: "2024-03-10T11:00:00",
        deliveredAt: "2024-03-12T16:00:00",
        progress: 100,
        videoUrl: "/video1.mp4",
        duration: "2:34",
        rating: 5,
        thumbnail: "/placeholder.svg"
      },
      {
        id: "5",
        creator: "Marie Jean",
        creatorAvatar: "/placeholder.svg",
        occasion: "Motivation",
        recipient: "Myself",
        message: "Motivational message for new year...",
        price: 75,
        status: "completed",
        orderedAt: "2024-03-05T13:00:00",
        deliveredAt: "2024-03-07T10:00:00",
        progress: 100,
        videoUrl: "/video2.mp4",
        duration: "1:45",
        rating: 4,
        thumbnail: "/placeholder.svg"
      }
    ],
    cancelled: [
      {
        id: "6",
        creator: "Jean Baptiste",
        creatorAvatar: "/placeholder.svg",
        occasion: "Birthday",
        recipient: "Friend",
        message: "Birthday wishes...",
        price: 100,
        status: "cancelled",
        orderedAt: "2024-03-01T10:00:00",
        cancelledAt: "2024-03-02T14:00:00",
        reason: "Creator unavailable",
        refunded: true
      }
    ]
  }

  const statusConfig = {
    pending: {
      label: "Pending",
      color: "bg-yellow-500",
      icon: Clock,
      description: "Waiting for creator to accept"
    },
    processing: {
      label: "Recording",
      color: "bg-blue-500",
      icon: PlayCircle,
      description: "Creator is recording your video"
    },
    scheduled: {
      label: "Scheduled",
      color: "bg-purple-500",
      icon: Calendar,
      description: "Scheduled for future delivery"
    },
    completed: {
      label: "Delivered",
      color: "bg-green-500",
      icon: CheckCircle,
      description: "Video ready to watch"
    },
    cancelled: {
      label: "Cancelled",
      color: "bg-gray-500",
      icon: XCircle,
      description: "Order was cancelled"
    },
    refunded: {
      label: "Refunded",
      color: "bg-purple-500",
      icon: RefreshCw,
      description: "Payment refunded"
    }
  }

  const allBookings = [
    ...bookings.active,
    ...bookings.scheduled,
    ...bookings.completed,
    ...bookings.cancelled
  ]

  const filteredBookings = allBookings.filter(booking => {
    const matchesSearch = booking.creator.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.occasion.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          booking.recipient.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || booking.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getTimeUntilDelivery = (deliveryDate: string) => {
    const now = new Date()
    const delivery = new Date(deliveryDate)
    const diff = delivery.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''}`
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`
    return "Soon"
  }

  const BookingCard = ({ booking, showActions = true }: any) => {
    const status = statusConfig[booking.status as keyof typeof statusConfig]
    const StatusIcon = status.icon

    return (
      <Card className="hover:shadow-lg transition-all hover:translate-y-[-2px]">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            {/* Creator Avatar */}
            <Avatar className="h-16 w-16">
              <AvatarImage src={booking.creatorAvatar} />
              <AvatarFallback>{booking.creator[0]}</AvatarFallback>
            </Avatar>

            {/* Booking Details */}
            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{booking.creator}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant="secondary">
                      <Gift className="h-3 w-3 mr-1" />
                      {booking.occasion}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      For: {booking.recipient}
                    </span>
                  </div>
                </div>
                <Badge className={cn("text-white", status.color)}>
                  <StatusIcon className="h-3 w-3 mr-1" />
                  {status.label}
                </Badge>
              </div>

              {/* Message Preview */}
              <p className="text-sm text-gray-600 line-clamp-2">
                "{booking.message}"
              </p>

              {/* Progress Bar (for active bookings) */}
              {booking.status === "processing" && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-600">
                    <span>Recording Progress</span>
                    <span>{booking.progress}%</span>
                  </div>
                  <Progress value={booking.progress} className="h-2" />
                </div>
              )}

              {/* Delivery Info */}
              <div className="flex items-center gap-4 text-sm">
                {booking.status === "completed" ? (
                  <>
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      Delivered {new Date(booking.deliveredAt).toLocaleDateString()}
                    </span>
                    {booking.duration && (
                      <span className="flex items-center gap-1">
                        <Timer className="h-4 w-4" />
                        {booking.duration}
                      </span>
                    )}
                    {booking.rating && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-3 w-3",
                              i < booking.rating
                                ? "text-yellow-500 fill-current"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    )}
                  </>
                ) : booking.expectedDelivery ? (
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Expected in {getTimeUntilDelivery(booking.expectedDelivery)}
                  </span>
                ) : booking.cancelledAt ? (
                  <span className="flex items-center gap-1 text-gray-500">
                    <XCircle className="h-4 w-4" />
                    Cancelled on {new Date(booking.cancelledAt).toLocaleDateString()}
                  </span>
                ) : null}
                <span className="font-semibold text-purple-600">${booking.price}</span>
              </div>

              {/* Actions */}
              {showActions && (
                <div className="flex gap-2 pt-2">
                  {booking.status === "completed" && (
                    <>
                      <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        <Eye className="h-4 w-4 mr-1" />
                        Watch Video
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                      {!booking.rating && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => {
                            setSelectedBooking(booking)
                            setShowRatingDialog(true)
                          }}
                        >
                          <Star className="h-4 w-4 mr-1" />
                          Rate
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        Reorder
                      </Button>
                    </>
                  )}
                  {booking.status === "processing" && (
                    <Button size="sm" variant="outline">
                      <MessageSquare className="h-4 w-4 mr-1" />
                      Message Creator
                    </Button>
                  )}
                  {booking.status === "pending" && (
                    <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                      <XCircle className="h-4 w-4 mr-1" />
                      Cancel Request
                    </Button>
                  )}
                  {booking.status === "cancelled" && booking.refunded && (
                    <Badge variant="outline" className="text-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Refunded
                    </Badge>
                  )}
                  <Button size="sm" variant="ghost">
                    View Details
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </div>

            {/* Video Thumbnail (for completed) */}
            {booking.status === "completed" && booking.thumbnail && (
              <div className="relative group cursor-pointer">
                <img
                  src={booking.thumbnail}
                  alt="Video thumbnail"
                  className="w-32 h-20 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayCircle className="h-8 w-8 text-white" />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              My Bookings
              <Package className="h-6 w-6" />
            </h1>
            <p className="text-white/90 mt-2">
              Track your video message requests and deliveries
            </p>
          </div>
          <div className="flex gap-3">
            <Badge className="bg-white/20 text-white border-white/30">
              <Video className="h-4 w-4 mr-1" />
              {bookings.active.length} Active
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              <CheckCircle className="h-4 w-4 mr-1" />
              {bookings.completed.length} Completed
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              <DollarSign className="h-4 w-4 mr-1" />
              ${allBookings.reduce((sum, b) => sum + b.price, 0)} Total
            </Badge>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by creator, occasion, or recipient..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bookings</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Recording</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Tabs */}
      <Tabs defaultValue="active" className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-4">
          <TabsTrigger value="active">
            Active
            {bookings.active.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {bookings.active.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="scheduled">
            Scheduled
            {bookings.scheduled.length > 0 && (
              <Badge variant="secondary" className="ml-2">
                {bookings.scheduled.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            Cancelled
          </TabsTrigger>
        </TabsList>

        {/* Active Bookings */}
        <TabsContent value="active" className="space-y-4">
          {bookings.active.length > 0 ? (
            bookings.active.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No active bookings</h3>
                <p className="text-gray-600 mb-4">
                  Request a personalized video from your favorite creators
                </p>
                <Button asChild>
                  <Link href="/browse">
                    Browse Creators
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Scheduled Bookings */}
        <TabsContent value="scheduled" className="space-y-4">
          {bookings.scheduled.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </TabsContent>

        {/* Completed Bookings */}
        <TabsContent value="completed" className="space-y-4">
          {bookings.completed.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </TabsContent>

        {/* Cancelled Bookings */}
        <TabsContent value="cancelled" className="space-y-4">
          {bookings.cancelled.map((booking) => (
            <BookingCard key={booking.id} booking={booking} />
          ))}
        </TabsContent>
      </Tabs>

      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Your Video</DialogTitle>
            <DialogDescription>
              How was your experience with {selectedBooking?.creator}?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className="hover:scale-110 transition-transform"
                >
                  <Star
                    className={cn(
                      "h-8 w-8",
                      value <= rating
                        ? "text-yellow-500 fill-current"
                        : "text-gray-300"
                    )}
                  />
                </button>
              ))}
            </div>
            <Label className="mt-4 block">
              <span className="text-sm font-medium">Add a comment (optional)</span>
              <textarea
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm"
                rows={3}
                placeholder="Share your experience..."
              />
            </Label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRatingDialog(false)}>
              Cancel
            </Button>
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              onClick={() => {
                // Handle rating submission
                setShowRatingDialog(false)
                setRating(0)
              }}
            >
              Submit Rating
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}