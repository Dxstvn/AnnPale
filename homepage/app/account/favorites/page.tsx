"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Heart, Search, Bell, BellOff, Star, Video, DollarSign } from "lucide-react"
import Link from "next/link"

export default function FavoritesPage() {
  const [notifications, setNotifications] = useState<{ [key: string]: boolean }>({
    "1": true,
    "2": false,
    "3": true
  })

  const favorites = [
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
      lastActive: "Active now"
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
      lastActive: "2 hours ago"
    },
    {
      id: "3",
      name: "Claudette Pierre",
      username: "@claudettepierre",
      avatar: "/placeholder.svg",
      category: "Sports",
      price: 50,
      rating: 4.7,
      responseTime: "12 hours",
      isOnline: true,
      lastActive: "Active now"
    }
  ]

  const toggleNotification = (creatorId: string) => {
    setNotifications(prev => ({
      ...prev,
      [creatorId]: !prev[creatorId]
    }))
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Favorite Creators</h1>
        <p className="text-muted-foreground">Manage your favorite creators and notifications</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search favorites..."
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid gap-4">
        {favorites.map((creator) => (
          <Card key={creator.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={creator.avatar}
                      alt={creator.name}
                      className="h-16 w-16 rounded-full"
                    />
                    {creator.isOnline && (
                      <span className="absolute bottom-0 right-0 h-4 w-4 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <CardTitle className="text-xl">{creator.name}</CardTitle>
                    <CardDescription>
                      {creator.username} • {creator.category}
                    </CardDescription>
                    <p className="text-sm text-muted-foreground mt-1">
                      {creator.lastActive}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:text-red-600"
                >
                  <Heart className="h-5 w-5 fill-current" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-6 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    {creator.rating}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    ${creator.price}
                  </span>
                  <span className="flex items-center gap-1">
                    <Video className="h-4 w-4" />
                    {creator.responseTime}
                  </span>
                </div>
                <Badge variant={creator.isOnline ? "default" : "secondary"}>
                  {creator.isOnline ? "Available" : "Offline"}
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button asChild className="flex-1">
                  <Link href={`/book/${creator.id}`}>
                    Book a Video
                  </Link>
                </Button>
                <Button variant="outline" asChild className="flex-1">
                  <Link href={`/creator/${creator.id}`}>
                    View Profile
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => toggleNotification(creator.id)}
                  className={notifications[creator.id] ? "text-primary" : "text-muted-foreground"}
                >
                  {notifications[creator.id] ? (
                    <Bell className="h-4 w-4" />
                  ) : (
                    <BellOff className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {notifications[creator.id] && (
                <p className="text-xs text-muted-foreground mt-2">
                  You'll receive notifications when this creator is available or has special offers
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {favorites.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
            <p className="text-muted-foreground mb-4">
              Start adding creators to your favorites to see them here
            </p>
            <Button asChild>
              <Link href="/browse">Browse Creators</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}