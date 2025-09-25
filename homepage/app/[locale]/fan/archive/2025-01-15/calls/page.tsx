"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { VideoCallBooking } from "@/components/fan/video-call-booking"
import {
  Phone,
  Video,
  Calendar,
  Clock,
  Search,
  Filter,
  Star,
  ChevronRight,
  Users,
  TrendingUp,
  Heart,
  Globe,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Sparkles,
  Play,
  PhoneIncoming,
  PhoneOff
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function CustomerCallsPage() {
  const t = useTranslations()
  const [selectedCreator, setSelectedCreator] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("book")
  const [searchQuery, setSearchQuery] = useState("")

  // Mock data for available creators
  const availableCreators = [
    {
      id: "1",
      name: "Marie Jean",
      avatar: "/placeholder.svg",
      category: "Music",
      rating: 4.9,
      totalCalls: 342,
      responseTime: "24h",
      languages: ["English", "Kreyòl", "Français"],
      pricePerMinute: 15,
      isOnline: true,
      nextAvailable: "Today, 2:00 PM",
      specialties: ["Music lessons", "Career advice", "Motivation"],
      availability: [
        { date: new Date(), slots: ["2:00 PM", "3:00 PM", "4:00 PM"] }
      ]
    },
    {
      id: "2",
      name: "Jean Baptiste",
      avatar: "/placeholder.svg",
      category: "Comedy",
      rating: 4.8,
      totalCalls: 256,
      responseTime: "48h",
      languages: ["English", "Kreyòl"],
      pricePerMinute: 12,
      isOnline: false,
      nextAvailable: "Tomorrow, 10:00 AM",
      specialties: ["Comedy coaching", "Entertainment", "Life advice"],
      availability: [
        { date: new Date(Date.now() + 86400000), slots: ["10:00 AM", "11:00 AM", "2:00 PM"] }
      ]
    },
    {
      id: "3",
      name: "Claudette Pierre",
      avatar: "/placeholder.svg",
      category: "Sports",
      rating: 4.7,
      totalCalls: 189,
      responseTime: "12h",
      languages: ["English", "Français"],
      pricePerMinute: 20,
      isOnline: true,
      nextAvailable: "Today, 5:00 PM",
      specialties: ["Fitness coaching", "Nutrition", "Motivation"],
      availability: [
        { date: new Date(), slots: ["5:00 PM", "6:00 PM", "7:00 PM"] }
      ]
    }
  ]

  // Mock data for scheduled calls
  const scheduledCalls = [
    {
      id: "1",
      creator: "Marie Jean",
      avatar: "/placeholder.svg",
      date: "Today",
      time: "2:00 PM",
      duration: "10 minutes",
      price: "$150",
      status: "confirmed",
      joinLink: "#"
    },
    {
      id: "2",
      creator: "Jean Baptiste",
      avatar: "/placeholder.svg",
      date: "Tomorrow",
      time: "10:00 AM",
      duration: "5 minutes",
      price: "$60",
      status: "pending",
      joinLink: "#"
    }
  ]

  // Mock data for call history
  const callHistory = [
    {
      id: "1",
      creator: "Claudette Pierre",
      avatar: "/placeholder.svg",
      date: "March 15, 2024",
      duration: "15 minutes",
      price: "$300",
      rating: 5,
      status: "completed"
    },
    {
      id: "2",
      creator: "Marie Jean",
      avatar: "/placeholder.svg",
      date: "March 10, 2024",
      duration: "10 minutes",
      price: "$150",
      rating: 5,
      status: "completed"
    },
    {
      id: "3",
      creator: "Jean Baptiste",
      avatar: "/placeholder.svg",
      date: "March 5, 2024",
      duration: "5 minutes",
      price: "$60",
      rating: 0,
      status: "cancelled"
    }
  ]

  const filteredCreators = availableCreators.filter(creator =>
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleBookingComplete = (booking: any) => {
    console.log("Booking completed:", booking)
    setSelectedCreator(null)
    setActiveTab("scheduled")
  }

  if (selectedCreator) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => setSelectedCreator(null)}
            className="mb-4"
          >
            ← Back to Creators
          </Button>
        </div>
        <VideoCallBooking
          creator={selectedCreator}
          onBookingComplete={handleBookingComplete}
        />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              Video Calls
              <Phone className="h-6 w-6" />
            </h1>
            <p className="text-white/90 mt-2">
              Connect face-to-face with your favorite Haitian creators
            </p>
          </div>
          <div className="flex gap-3">
            <Badge className="bg-white/20 text-white border-white/30">
              <PhoneIncoming className="h-4 w-4 mr-1" />
              2 Upcoming Calls
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              <CheckCircle className="h-4 w-4 mr-1" />
              5 Completed
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="book">Book Call</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Book Call Tab */}
        <TabsContent value="book" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Find a Creator for Video Call</CardTitle>
              <CardDescription>
                Browse creators available for one-on-one video conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Available Creators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCreators.map((creator) => (
              <Card
                key={creator.id}
                className="hover:shadow-lg transition-all hover:translate-y-[-2px] cursor-pointer"
                onClick={() => setSelectedCreator(creator)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={creator.avatar} />
                        <AvatarFallback>{creator.name[0]}</AvatarFallback>
                      </Avatar>
                      {creator.isOnline && (
                        <div className="absolute bottom-0 right-0">
                          <div className="h-4 w-4 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                      )}
                    </div>
                    <Badge variant={creator.isOnline ? "default" : "secondary"}>
                      {creator.isOnline ? "Online" : "Offline"}
                    </Badge>
                  </div>

                  <h3 className="font-semibold text-lg">{creator.name}</h3>
                  <p className="text-sm text-gray-600">{creator.category}</p>

                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="text-sm">{creator.rating}</span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm">{creator.totalCalls} calls</span>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Price</span>
                      <span className="font-semibold">${creator.pricePerMinute}/min</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Next Available</span>
                      <span className="font-semibold text-green-600">{creator.nextAvailable}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {creator.languages.slice(0, 2).map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                    {creator.languages.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{creator.languages.length - 2}
                      </Badge>
                    )}
                  </div>

                  <Button
                    className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    size="sm"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Book Call
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Scheduled Calls Tab */}
        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Video Calls</CardTitle>
              <CardDescription>
                Your scheduled calls with creators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {scheduledCalls.map((call) => (
                <div
                  key={call.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={call.avatar} />
                    <AvatarFallback>{call.creator[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{call.creator}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {call.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {call.time}
                      </span>
                      <span>{call.duration}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-purple-600">{call.price}</p>
                    <Badge
                      variant={call.status === "confirmed" ? "default" : "secondary"}
                      className="mt-1"
                    >
                      {call.status === "confirmed" ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Confirmed
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending
                        </>
                      )}
                    </Badge>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                    size="sm"
                  >
                    <Video className="h-4 w-4 mr-2" />
                    Join Call
                  </Button>
                </div>
              ))}

              {scheduledCalls.length === 0 && (
                <div className="text-center py-8">
                  <Phone className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">No scheduled calls yet</p>
                  <Button
                    className="mt-4"
                    onClick={() => setActiveTab("book")}
                  >
                    Book Your First Call
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Call History</CardTitle>
              <CardDescription>
                Your past video calls with creators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {callHistory.map((call) => (
                <div
                  key={call.id}
                  className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={call.avatar} />
                    <AvatarFallback>{call.creator[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{call.creator}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                      <span>{call.date}</span>
                      <span>{call.duration}</span>
                      <span className="font-semibold">{call.price}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {call.status === "completed" && call.rating > 0 && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "h-4 w-4",
                              i < call.rating
                                ? "text-yellow-500 fill-current"
                                : "text-gray-300"
                            )}
                          />
                        ))}
                      </div>
                    )}
                    <Badge
                      variant={call.status === "completed" ? "default" : "destructive"}
                    >
                      {call.status === "completed" ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </>
                      ) : (
                        <>
                          <XCircle className="h-3 w-3 mr-1" />
                          Cancelled
                        </>
                      )}
                    </Badge>
                  </div>
                  {call.status === "completed" && (
                    <Button variant="outline" size="sm">
                      Book Again
                    </Button>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}