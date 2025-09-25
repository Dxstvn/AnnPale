"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageSquare,
  TrendingUp,
  Users,
  Heart,
  Share2,
  Plus,
  Search,
  Filter,
  Clock,
  Eye,
  ThumbsUp,
  Pin,
  Lock,
  Star,
  Flame,
  Award,
  ChevronRight
} from "lucide-react"
import { format } from "date-fns"

// Mock forum data
const forumCategories = [
  { id: "general", name: "General Discussion", description: "Talk about anything", posts: 1234, color: "bg-blue-500" },
  { id: "culture", name: "Haitian Culture", description: "Celebrate our heritage", posts: 892, color: "bg-purple-500" },
  { id: "music", name: "Music & Arts", description: "Kompa, Rara, and more", posts: 567, color: "bg-pink-500" },
  { id: "food", name: "Cuisine", description: "Recipes and cooking tips", posts: 445, color: "bg-orange-500" },
  { id: "language", name: "Language Learning", description: "Kreyòl, French, English", posts: 234, color: "bg-green-500" },
  { id: "diaspora", name: "Diaspora Life", description: "Living abroad", posts: 789, color: "bg-indigo-500" }
]

const trendingTopics = [
  { id: "1", title: "Best Haitian restaurants in Miami", replies: 45, views: 1230, isPinned: true },
  { id: "2", title: "Learning Kreyòl resources", replies: 78, views: 2340, isPinned: false },
  { id: "3", title: "Carnival 2024 preparations", replies: 123, views: 4567, isPinned: false },
  { id: "4", title: "Traditional music recommendations", replies: 56, views: 890, isPinned: false }
]

export default function ForumsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Community Forums
        </h1>
        <p className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
          Connect, share, and discuss with the Haitian community worldwide
        </p>
        <div className="flex items-center justify-center gap-4 mt-6">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
            <Plus className="w-4 h-4 mr-2" />
            New Topic
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="mb-8">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search forums..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Total Topics</p>
                <p className="text-2xl font-bold">4,892</p>
              </div>
              <MessageSquare className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Active Users</p>
                <p className="text-2xl font-bold">1,234</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Posts Today</p>
                <p className="text-2xl font-bold">342</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">Online Now</p>
                <p className="text-2xl font-bold">89</p>
              </div>
              <Flame className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Forum Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {forumCategories.map(category => (
          <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${category.color} flex items-center justify-center`}>
                  <MessageSquare className="w-6 h-6 text-white" />
                </div>
                <Badge variant="secondary">{category.posts} posts</Badge>
              </div>
              <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300">{category.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Trending Topics */}
      <Card>
        <CardHeader>
          <CardTitle>Trending Topics</CardTitle>
          <CardDescription>Most active discussions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trendingTopics.map(topic => (
              <div key={topic.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-start gap-4">
                  {topic.isPinned && <Pin className="w-4 h-4 text-purple-600 mt-1" />}
                  <div>
                    <h4 className="font-medium">{topic.title}</h4>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {topic.replies} replies
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {topic.views} views
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}