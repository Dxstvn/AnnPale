"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import {
  Heart,
  Star,
  Video,
  Phone,
  Radio,
  Bell,
  BellOff,
  Search,
  Filter,
  Clock,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Users,
  Calendar,
  MessageSquare,
  Sparkles,
  Award,
  Globe,
  Zap
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"

export default function CustomerFavoritesPage() {
  const { language } = useLanguage()
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState<{ [key: string]: boolean }>({
    "1": true,
    "2": false,
    "3": true,
    "4": true
  })

  // Mock data for favorite creators
  const favoriteCreators = [
    {
      id: "1",
      name: "Marie Jean",
      username: "@mariejean",
      avatar: "/placeholder.svg",
      category: "Music",
      price: 75,
      rating: 4.9,
      responseTime: "24 hours",
      isOnline: true,
      lastActive: "Active now",
      totalVideos: 342,
      totalCalls: 89,
      nextStream: "Tonight at 8:00 PM",
      languages: ["English", "Kreyòl", "Français"],
      specialties: ["Birthday messages", "Motivational", "Music lessons"]
    },
    {
      id: "2",
      name: "Jean Baptiste",
      username: "@jeanbaptiste",
      avatar: "/placeholder.svg",
      category: "Comedy",
      price: 100,
      rating: 4.8,
      responseTime: "48 hours",
      isOnline: false,
      lastActive: "2 hours ago",
      totalVideos: 256,
      totalCalls: 67,
      nextStream: "Tomorrow at 6:00 PM",
      languages: ["English", "Kreyòl"],
      specialties: ["Comedy roasts", "Birthday wishes", "Life advice"]
    },
    {
      id: "3",
      name: "Claudette Pierre",
      username: "@claudettepierre",
      avatar: "/placeholder.svg",
      category: "Sports",
      price: 60,
      rating: 4.7,
      responseTime: "12 hours",
      isOnline: true,
      lastActive: "Active now",
      totalVideos: 189,
      totalCalls: 45,
      nextStream: "Saturday at 3:00 PM",
      languages: ["English", "Français"],
      specialties: ["Fitness motivation", "Sports commentary", "Training tips"]
    },
    {
      id: "4",
      name: "Michel Louis",
      username: "@michellouis",
      avatar: "/placeholder.svg",
      category: "Chef",
      price: 80,
      rating: 4.9,
      responseTime: "36 hours",
      isOnline: false,
      lastActive: "Yesterday",
      totalVideos: 412,
      totalCalls: 102,
      nextStream: "Sunday at 2:00 PM",
      languages: ["English", "Kreyòl", "Français"],
      specialties: ["Cooking tips", "Recipe sharing", "Food reviews"]
    }
  ]

  const filteredCreators = favoriteCreators.filter(creator =>
    creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    creator.username.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const toggleNotification = (creatorId: string) => {
    setNotifications(prev => ({
      ...prev,
      [creatorId]: !prev[creatorId]
    }))
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              My Favorite Creators
              <Heart className="h-6 w-6 fill-current" />
            </h1>
            <p className="text-white/90 mt-2">
              Stay connected with your favorite Haitian creators
            </p>
          </div>
          <div className="flex gap-3">
            <Badge className="bg-white/20 text-white border-white/30">
              <Users className="h-4 w-4 mr-1" />
              {favoriteCreators.length} Favorites
            </Badge>
            <Badge className="bg-white/20 text-white border-white/30">
              <Bell className="h-4 w-4 mr-1" />
              {Object.values(notifications).filter(Boolean).length} Notifications On
            </Badge>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search your favorites..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Favorites Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredCreators.map((creator) => (
          <Card
            key={creator.id}
            className="hover:shadow-lg transition-all hover:translate-y-[-2px]"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Avatar and Online Status */}
                <div className="relative">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={creator.avatar} />
                    <AvatarFallback>{creator.name[0]}</AvatarFallback>
                  </Avatar>
                  {creator.isOnline && (
                    <div className="absolute bottom-0 right-0">
                      <div className="h-5 w-5 bg-green-500 rounded-full border-3 border-white" />
                    </div>
                  )}
                </div>

                {/* Creator Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{creator.name}</h3>
                      <p className="text-sm text-gray-600">{creator.username}</p>
                      <Badge variant="secondary" className="mt-1">
                        {creator.category}
                      </Badge>
                    </div>
                    {/* Notification Toggle */}
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`notif-${creator.id}`} className="sr-only">
                        Notifications
                      </Label>
                      <Switch
                        id={`notif-${creator.id}`}
                        checked={notifications[creator.id]}
                        onCheckedChange={() => toggleNotification(creator.id)}
                      />
                      {notifications[creator.id] ? (
                        <Bell className="h-4 w-4 text-purple-600" />
                      ) : (
                        <BellOff className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mt-4">
                    <div>
                      <p className="text-xs text-gray-600">Rating</p>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="font-semibold">{creator.rating}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Videos</p>
                      <p className="font-semibold">{creator.totalVideos}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Calls</p>
                      <p className="font-semibold">{creator.totalCalls}</p>
                    </div>
                  </div>

                  {/* Next Stream */}
                  {creator.nextStream && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Radio className="h-4 w-4 text-purple-600" />
                          <div>
                            <p className="text-xs text-gray-600">Next Stream</p>
                            <p className="text-sm font-semibold">{creator.nextStream}</p>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" className="text-purple-600">
                          Set Reminder
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  <div className="flex gap-2 mt-4">
                    {creator.languages.map((lang) => (
                      <Badge key={lang} variant="outline" className="text-xs">
                        <Globe className="h-3 w-3 mr-1" />
                        {lang}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-4">
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      asChild
                    >
                      <Link href={`/book/${creator.id}`}>
                        <Video className="h-4 w-4 mr-1" />
                        Video
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <Link href={`/fan/calls?creator=${creator.id}`}>
                        <Phone className="h-4 w-4 mr-1" />
                        Call
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                    >
                      <Link href={`/creator/${creator.id}`}>
                        <ChevronRight className="h-4 w-4 mr-1" />
                        Profile
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredCreators.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No favorites found</h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? "Try adjusting your search terms"
                : "Start adding creators to your favorites"}
            </p>
            <Button asChild>
              <Link href="/browse">
                Discover Creators
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      {filteredCreators.length > 0 && (
        <Card className="bg-gradient-to-br from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Recommended for You
            </CardTitle>
            <CardDescription>
              Based on your favorites, you might also like these creators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex-shrink-0 w-48 p-4 bg-white rounded-lg border border-purple-200"
                >
                  <Avatar className="h-12 w-12 mx-auto">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>RC</AvatarFallback>
                  </Avatar>
                  <h4 className="font-medium text-center mt-2">Rose Charles</h4>
                  <p className="text-xs text-gray-600 text-center">Singer</p>
                  <Button
                    size="sm"
                    className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                  >
                    <Heart className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}