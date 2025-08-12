"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Upload, MessageCircle, Calendar, DollarSign, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

const allRequests = [
  {
    id: 1,
    customer: "Marie L.",
    occasion: "Birthday",
    recipient: "Sarah",
    message:
      "Happy birthday message for my daughter Sarah who just turned 16. She loves your comedy and would be so excited to hear from you! Please mention that she's starting her junior year of high school and loves to dance.",
    price: 85,
    requestedDate: "2024-01-15",
    dueDate: "2024-01-17",
    status: "pending",
    language: "English",
  },
  {
    id: 2,
    customer: "Jean P.",
    occasion: "Graduation",
    recipient: "Marcus",
    message:
      "Congratulations message for my son Marcus who just graduated from university with a degree in engineering. He's been a fan since your early days and this would mean the world to him.",
    price: 85,
    requestedDate: "2024-01-14",
    dueDate: "2024-01-16",
    status: "pending",
    language: "English",
  },
  {
    id: 3,
    customer: "Pierre M.",
    occasion: "Anniversary",
    recipient: "Lisa & David",
    message:
      "5th wedding anniversary wishes for my friends Lisa and David. They had their first dance to one of your songs and would love a special message from you.",
    price: 85,
    requestedDate: "2024-01-13",
    dueDate: "2024-01-15",
    status: "completed",
    language: "Haitian Creole",
  },
  {
    id: 4,
    customer: "Nadine L.",
    occasion: "Congratulations",
    recipient: "Michael",
    message:
      "My brother Michael just got promoted to manager at his job. He's worked so hard and deserves this recognition. Please congratulate him and maybe add some motivational words!",
    price: 85,
    requestedDate: "2024-01-12",
    dueDate: "2024-01-14",
    status: "in-progress",
    language: "French",
  },
  {
    id: 5,
    customer: "Alex T.",
    occasion: "Get Well Soon",
    recipient: "Grandma Rose",
    message:
      "My grandmother Rose is in the hospital and feeling down. She's 78 and has been a fan of yours for years. A get well message would really lift her spirits.",
    price: 85,
    requestedDate: "2024-01-11",
    dueDate: "2024-01-13",
    status: "pending",
    language: "Haitian Creole",
  },
]

export default function CreatorRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const filteredRequests = allRequests.filter((request) => {
    const matchesSearch =
      request.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.occasion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.recipient.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || request.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime()
      case "oldest":
        return new Date(a.requestedDate).getTime() - new Date(b.requestedDate).getTime()
      case "due-soon":
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
      case "price-high":
        return b.price - a.price
      case "price-low":
        return a.price - b.price
      default:
        return 0
    }
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyColor = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 1) return "text-red-600"
    if (diffDays <= 2) return "text-orange-600"
    return "text-gray-600"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/creator/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-xl font-semibold">Video Requests</h1>
            </div>
            <Badge variant="secondary">{filteredRequests.filter((r) => r.status === "pending").length} Pending</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="due-soon">Due Soon</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <Filter className="h-4 w-4" />
                <span>More Filters</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {sortedRequests.length} of {allRequests.length} requests
          </p>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {sortedRequests.map((request) => (
            <Card key={request.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">
                        {request.occasion} for {request.recipient}
                      </h3>
                      <Badge className={getStatusColor(request.status)}>{request.status.replace("-", " ")}</Badge>
                      <Badge variant="outline">{request.language}</Badge>
                    </div>
                    <p className="text-gray-600 text-sm mb-1">From: {request.customer}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-green-600 font-bold text-lg mb-1">
                      <DollarSign className="h-4 w-4" />
                      <span>{request.price}</span>
                    </div>
                    <div className={`flex items-center space-x-1 text-sm ${getUrgencyColor(request.dueDate)}`}>
                      <Clock className="h-3 w-3" />
                      <span>Due: {request.dueDate}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="text-gray-700">{request.message}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>Requested: {request.requestedDate}</span>
                  </div>

                  <div className="flex space-x-2">
                    {request.status === "pending" && (
                      <>
                        <Button size="sm" asChild>
                          <Link href={`/creator/upload?request=${request.id}`}>
                            <Upload className="h-4 w-4 mr-1" />
                            Record Video
                          </Link>
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </>
                    )}
                    {request.status === "in-progress" && (
                      <Button size="sm" asChild>
                        <Link href={`/creator/upload?request=${request.id}`}>
                          <Upload className="h-4 w-4 mr-1" />
                          Continue Recording
                        </Link>
                      </Button>
                    )}
                    {request.status === "completed" && <Badge variant="secondary">Video Delivered</Badge>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedRequests.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">No requests found matching your criteria.</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
