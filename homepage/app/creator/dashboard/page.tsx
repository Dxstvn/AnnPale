"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Video, Clock, DollarSign, Star, MessageCircle, Upload, Settings, LogOut } from "lucide-react"
import Link from "next/link"

const mockStats = {
  totalEarnings: 2450,
  pendingRequests: 8,
  completedVideos: 156,
  averageRating: 4.8,
  thisMonthEarnings: 890,
  responseTime: "24hr",
}

const recentRequests = [
  {
    id: 1,
    customer: "Marie L.",
    occasion: "Birthday",
    recipient: "Sarah",
    message: "Happy birthday message for my daughter Sarah who just turned 16...",
    price: 85,
    requestedDate: "2024-01-15",
    dueDate: "2024-01-17",
    status: "pending",
  },
  {
    id: 2,
    customer: "Jean P.",
    occasion: "Graduation",
    recipient: "Marcus",
    message: "Congratulations message for graduating from university...",
    price: 85,
    requestedDate: "2024-01-14",
    dueDate: "2024-01-16",
    status: "pending",
  },
  {
    id: 3,
    customer: "Pierre M.",
    occasion: "Anniversary",
    recipient: "Lisa & David",
    message: "5th wedding anniversary wishes for a lovely couple...",
    price: 85,
    requestedDate: "2024-01-13",
    dueDate: "2024-01-15",
    status: "completed",
  },
]

export default function CreatorDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <span>🎤</span>
                <span>Ann Pale</span>
              </Link>
              <Badge variant="secondary">Creator Dashboard</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, Ti Jo!</h1>
          <p className="text-gray-600">Here's what's happening with your account today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-2xl font-bold text-gray-900">${mockStats.totalEarnings}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Requests</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.pendingRequests}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Videos Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.completedVideos}</p>
                </div>
                <Video className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Rating</p>
                  <p className="text-2xl font-bold text-gray-900">{mockStats.averageRating}</p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Requests */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Requests</CardTitle>
                <Button asChild>
                  <Link href="/creator/requests">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">
                            {request.occasion} for {request.recipient}
                          </h3>
                          <Badge variant={request.status === "pending" ? "default" : "secondary"}>
                            {request.status}
                          </Badge>
                        </div>
                        <span className="font-bold text-green-600">${request.price}</span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">From: {request.customer}</p>
                      <p className="text-gray-700 text-sm mb-3">{request.message}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Requested: {request.requestedDate}</span>
                        <span>Due: {request.dueDate}</span>
                      </div>
                      {request.status === "pending" && (
                        <div className="flex space-x-2 mt-3">
                          <Button size="sm" asChild>
                            <Link href={`/creator/upload?request=${request.id}`}>
                              <Upload className="h-4 w-4 mr-1" />
                              Record Video
                            </Link>
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Message Customer
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" asChild>
                  <Link href="/creator/requests">
                    <Clock className="h-4 w-4 mr-2" />
                    View Pending Requests
                  </Link>
                </Button>
                <Button className="w-full bg-transparent" variant="outline" asChild>
                  <Link href="/creator/upload">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Video
                  </Link>
                </Button>
                <Button className="w-full bg-transparent" variant="outline" asChild>
                  <Link href="/creator/profile">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Performance */}
            <Card>
              <CardHeader>
                <CardTitle>This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Earnings</span>
                    <span className="font-semibold text-green-600">${mockStats.thisMonthEarnings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Videos Created</span>
                    <span className="font-semibold">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Response Time</span>
                    <span className="font-semibold">{mockStats.responseTime}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rating</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{mockStats.averageRating}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Creator Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="font-medium text-blue-900">💡 Quick Response</p>
                    <p className="text-blue-800">Respond to requests within 24 hours to maintain high ratings!</p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="font-medium text-green-900">🎯 Personal Touch</p>
                    <p className="text-green-800">Use the customer's name and specific details for better reviews.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
