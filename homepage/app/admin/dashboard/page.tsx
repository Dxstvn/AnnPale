"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Users,
  Video,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Star,
  Settings,
  LogOut,
  Eye,
  UserCheck,
  Ban,
  Edit,
  Search,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  MessageCircle,
  CheckCircle,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

const dashboardStats = {
  totalUsers: 12450,
  totalCreators: 156,
  totalVideos: 8920,
  totalRevenue: 125000,
  monthlyGrowth: 15.2,
  pendingApprovals: 8,
  activeOrders: 45,
  averageRating: 4.7,
}

const allOrders = [
  {
    id: "ORD-001",
    customer: "Marie L.",
    customerEmail: "marie.l@email.com",
    creator: "Ti Jo Zenny",
    occasion: "Birthday",
    recipient: "Sarah",
    amount: 85,
    serviceFee: 5,
    status: "completed",
    orderDate: "2024-01-15",
    completedDate: "2024-01-16",
    dueDate: "2024-01-17",
  },
  {
    id: "ORD-002",
    customer: "Jean P.",
    customerEmail: "jean.p@email.com",
    creator: "Wyclef Jean",
    occasion: "Graduation",
    recipient: "Marcus",
    amount: 150,
    serviceFee: 5,
    status: "pending",
    orderDate: "2024-01-14",
    completedDate: null,
    dueDate: "2024-01-16",
  },
  {
    id: "ORD-003",
    customer: "Pierre M.",
    customerEmail: "pierre.m@email.com",
    creator: "Rutshelle Guillaume",
    occasion: "Anniversary",
    recipient: "Lisa & David",
    amount: 85,
    serviceFee: 5,
    status: "in-progress",
    orderDate: "2024-01-13",
    completedDate: null,
    dueDate: "2024-01-15",
  },
  {
    id: "ORD-004",
    customer: "Nadine L.",
    customerEmail: "nadine.l@email.com",
    creator: "Carel Pedre",
    occasion: "Congratulations",
    recipient: "Michael",
    amount: 110,
    serviceFee: 5,
    status: "refunded",
    orderDate: "2024-01-12",
    completedDate: null,
    dueDate: "2024-01-14",
  },
  {
    id: "ORD-005",
    customer: "Alex T.",
    customerEmail: "alex.t@email.com",
    creator: "DJ K9",
    occasion: "Get Well Soon",
    recipient: "Grandma Rose",
    amount: 65,
    serviceFee: 5,
    status: "overdue",
    orderDate: "2024-01-11",
    completedDate: null,
    dueDate: "2024-01-13",
  },
]

const allCreators = [
  {
    id: 1,
    name: "Wyclef Jean",
    stageName: "Wyclef Jean",
    category: "Musician",
    status: "active",
    joinDate: "2023-06-15",
    totalEarnings: 4500,
    totalVideos: 45,
    rating: 4.9,
    reviews: 1247,
    image: "/images/wyclef-jean.png",
    verified: true,
  },
  {
    id: 2,
    name: "Ti Jo Zenny",
    stageName: "Ti Jo Zenny",
    category: "Comedian",
    status: "active",
    joinDate: "2023-08-20",
    totalEarnings: 3200,
    totalVideos: 38,
    rating: 4.8,
    reviews: 456,
    image: "/images/ti-jo-zenny.jpg",
    verified: true,
  },
  {
    id: 3,
    name: "Richard Cave",
    stageName: "Richard Cave",
    category: "Actor",
    status: "active",
    joinDate: "2023-07-10",
    totalEarnings: 2800,
    totalVideos: 33,
    rating: 4.9,
    reviews: 678,
    image: "/images/richard-cave.jpg",
    verified: true,
  },
  {
    id: 4,
    name: "Michael Jean",
    stageName: "Mike J",
    category: "Singer",
    status: "pending",
    joinDate: "2024-01-10",
    totalEarnings: 0,
    totalVideos: 0,
    rating: 0,
    reviews: 0,
    image: "/placeholder.svg?height=60&width=60",
    verified: false,
  },
  {
    id: 5,
    name: "Sarah Williams",
    stageName: "DJ Sarah",
    category: "DJ",
    status: "pending",
    joinDate: "2024-01-09",
    totalEarnings: 0,
    totalVideos: 0,
    rating: 0,
    reviews: 0,
    image: "/placeholder.svg?height=60&width=60",
    verified: false,
  },
]

const topCreators = [
  {
    name: "Wyclef Jean",
    image: "/images/wyclef-jean.png",
    earnings: 4500,
    videos: 45,
    rating: 4.9,
  },
  {
    name: "Ti Jo Zenny",
    image: "/images/ti-jo-zenny.jpg",
    earnings: 3200,
    videos: 38,
    rating: 4.8,
  },
  {
    name: "Rutshelle Guillaume",
    image: "/images/rutshelle-guillaume.jpg",
    earnings: 2800,
    videos: 33,
    rating: 4.9,
  },
]

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedCreator, setSelectedCreator] = useState<any>(null)
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [isCreatorDialogOpen, setIsCreatorDialogOpen] = useState(false)
  const [isOrderDialogOpen, setIsOrderDialogOpen] = useState(false)
  const [creators, setCreators] = useState(allCreators)
  const [orders, setOrders] = useState(allOrders)

  const handleApproveCreator = (creatorId: number) => {
    setCreators((prev) =>
      prev.map((creator) => (creator.id === creatorId ? { ...creator, status: "active", verified: true } : creator)),
    )
  }

  const handleRejectCreator = (creatorId: number) => {
    setCreators((prev) => prev.filter((creator) => creator.id !== creatorId))
  }

  const handleSuspendCreator = (creatorId: number) => {
    setCreators((prev) =>
      prev.map((creator) => (creator.id === creatorId ? { ...creator, status: "suspended" } : creator)),
    )
  }

  const handleRefundOrder = (orderId: string) => {
    setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: "refunded" } : order)))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
      case "refunded":
        return "bg-red-100 text-red-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredCreators = creators.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.stageName.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || creator.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.creator.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

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
              <Badge variant="destructive">Admin Dashboard</Badge>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your platform, creators, and orders from here.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">${dashboardStats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Creators</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {creators.filter((c) => c.status === "active").length}
                  </p>
                </div>
                <Video className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Videos Created</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalVideos.toLocaleString()}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="creators">Creators</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Orders */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Orders</CardTitle>
                    <Button variant="outline" onClick={() => setStatusFilter("all")}>
                      View All
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.slice(0, 5).map((order) => (
                        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-semibold">{order.id}</p>
                            <p className="text-sm text-gray-600">
                              {order.customer} → {order.creator}
                            </p>
                            <p className="text-sm text-gray-500">{order.occasion}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">${order.amount + order.serviceFee}</p>
                            <Badge className={getStatusColor(order.status)}>{order.status.replace("-", " ")}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Pending Approvals */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-orange-600" />
                      <span>Pending Approvals</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {creators
                        .filter((c) => c.status === "pending")
                        .map((creator) => (
                          <div key={creator.id} className="p-3 border rounded-lg">
                            <p className="font-semibold">{creator.stageName}</p>
                            <p className="text-sm text-gray-600">{creator.category}</p>
                            <div className="flex space-x-2 mt-2">
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700"
                                onClick={() => handleApproveCreator(creator.id)}
                              >
                                <UserCheck className="h-3 w-3 mr-1" />
                                Approve
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedCreator(creator)
                                  setIsCreatorDialogOpen(true)
                                }}
                              >
                                <Eye className="h-3 w-3 mr-1" />
                                Review
                              </Button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Performers */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Creators This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topCreators.map((creator, index) => (
                        <div key={creator.name} className="flex items-center space-x-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 text-sm font-bold">
                            {index + 1}
                          </div>
                          <Image
                            src={creator.image || "/placeholder.svg"}
                            alt={creator.name}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <div className="flex-1">
                            <p className="font-semibold text-sm">{creator.name}</p>
                            <div className="flex items-center space-x-2 text-xs text-gray-500">
                              <span>${creator.earnings}</span>
                              <span>•</span>
                              <span>{creator.videos} videos</span>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span>{creator.rating}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Order Management</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="destructive">{orders.filter((o) => o.status === "overdue").length} Overdue</Badge>
                  <Badge variant="secondary">{orders.filter((o) => o.status === "pending").length} Pending</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search orders..."
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
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="refunded">Refunded</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </Button>
                </div>

                {/* Orders List */}
                <div className="space-y-4">
                  {filteredOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg font-semibold">{order.id}</h3>
                              <Badge className={getStatusColor(order.status)}>{order.status.replace("-", " ")}</Badge>
                              {order.status === "overdue" && <AlertTriangle className="h-4 w-4 text-red-600" />}
                            </div>
                            <p className="text-gray-600">
                              {order.occasion} for {order.recipient}
                            </p>
                            <p className="text-sm text-gray-500">
                              {order.customer} → {order.creator}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center space-x-1 text-green-600 font-bold text-lg mb-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{order.amount + order.serviceFee}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Calendar className="h-3 w-3" />
                            <span>Due: {order.dueDate}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Order Date: {order.orderDate}
                          {order.completedDate && <span> • Completed: {order.completedDate}</span>}
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedOrder(order)
                              setIsOrderDialogOpen(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>

                          {order.status === "completed" && (
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-1" />
                              Download
                            </Button>
                          )}

                          {(order.status === "overdue" || order.status === "pending") && (
                            <Button size="sm" variant="outline">
                              <RefreshCw className="h-4 w-4 mr-1" />
                              Follow Up
                            </Button>
                          )}

                          {order.status !== "refunded" && order.status !== "completed" && (
                            <Button size="sm" variant="destructive" onClick={() => handleRefundOrder(order.id)}>
                              Refund
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="creators" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Creator Management</CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    {creators.filter((c) => c.status === "pending").length} Pending Approval
                  </Badge>
                  <Badge variant="outline">{creators.filter((c) => c.status === "active").length} Active</Badge>
                </div>
              </CardHeader>
              <CardContent>
                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search creators..."
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
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                    <Filter className="h-4 w-4" />
                    <span>More Filters</span>
                  </Button>
                </div>

                {/* Creators List */}
                <div className="space-y-4">
                  {filteredCreators.map((creator) => (
                    <div key={creator.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Image
                            src={creator.image || "/placeholder.svg"}
                            alt={creator.name}
                            width={60}
                            height={60}
                            className="rounded-full"
                          />
                          <div>
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="text-lg font-semibold">{creator.stageName}</h3>
                              <Badge className={getStatusColor(creator.status)}>{creator.status}</Badge>
                              {creator.verified && (
                                <Badge variant="outline" className="text-blue-600 border-blue-600">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <p className="text-gray-600">
                              {creator.name} • {creator.category}
                            </p>
                            <p className="text-sm text-gray-500">Joined: {creator.joinDate}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-8">
                          {creator.status === "active" && (
                            <>
                              <div className="text-center">
                                <div className="flex items-center space-x-1 text-green-600 font-bold">
                                  <DollarSign className="h-4 w-4" />
                                  <span>{creator.totalEarnings.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-gray-500">Earnings</p>
                              </div>

                              <div className="text-center">
                                <div className="flex items-center space-x-1 font-bold">
                                  <Video className="h-4 w-4" />
                                  <span>{creator.totalVideos}</span>
                                </div>
                                <p className="text-xs text-gray-500">Videos</p>
                              </div>

                              <div className="text-center">
                                <div className="flex items-center space-x-1 font-bold">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span>{creator.rating}</span>
                                </div>
                                <p className="text-xs text-gray-500">{creator.reviews} reviews</p>
                              </div>
                            </>
                          )}

                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedCreator(creator)
                                setIsCreatorDialogOpen(true)
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>

                            {creator.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-green-600 hover:bg-green-700"
                                  onClick={() => handleApproveCreator(creator.id)}
                                >
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button size="sm" variant="destructive" onClick={() => handleRejectCreator(creator.id)}>
                                  <Ban className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}

                            {creator.status === "active" && (
                              <>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleSuspendCreator(creator.id)}
                                >
                                  <Ban className="h-4 w-4 mr-1" />
                                  Suspend
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Growth</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <TrendingUp className="h-16 w-16 mx-auto mb-4 text-green-600" />
                    <p className="text-3xl font-bold text-green-600 mb-2">+{dashboardStats.monthlyGrowth}%</p>
                    <p className="text-gray-600">Monthly Growth</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Rating</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Star className="h-16 w-16 mx-auto mb-4 text-yellow-600 fill-current" />
                    <p className="text-3xl font-bold text-yellow-600 mb-2">{dashboardStats.averageRating}</p>
                    <p className="text-gray-600">Average Rating</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Creator Payments</span>
                      <span className="font-semibold">${(dashboardStats.totalRevenue * 0.85).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Platform Fees</span>
                      <span className="font-semibold">${(dashboardStats.totalRevenue * 0.15).toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Total Revenue</span>
                        <span className="font-bold text-green-600">
                          ${dashboardStats.totalRevenue.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Health</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Active Orders</span>
                      <span className="font-semibold">
                        {orders.filter((o) => o.status === "pending" || o.status === "in-progress").length}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Completion Rate</span>
                      <span className="font-semibold">94%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Customer Satisfaction</span>
                      <span className="font-semibold">4.7/5</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Creator Details Dialog */}
      <Dialog open={isCreatorDialogOpen} onOpenChange={setIsCreatorDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Creator Details</DialogTitle>
          </DialogHeader>
          {selectedCreator && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <Image
                  src={selectedCreator.image || "/placeholder.svg"}
                  alt={selectedCreator.name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-xl font-semibold">{selectedCreator.stageName}</h3>
                  <p className="text-gray-600">{selectedCreator.name}</p>
                  <p className="text-sm text-gray-500">{selectedCreator.category}</p>
                  <Badge className={getStatusColor(selectedCreator.status)}>{selectedCreator.status}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Join Date</Label>
                  <p className="font-medium">{selectedCreator.joinDate}</p>
                </div>
                <div>
                  <Label>Total Earnings</Label>
                  <p className="font-medium">${selectedCreator.totalEarnings.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Videos Created</Label>
                  <p className="font-medium">{selectedCreator.totalVideos}</p>
                </div>
                <div>
                  <Label>Rating</Label>
                  <p className="font-medium">
                    {selectedCreator.rating}/5 ({selectedCreator.reviews} reviews)
                  </p>
                </div>
              </div>

              <div className="flex space-x-2">
                {selectedCreator.status === "pending" && (
                  <>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        handleApproveCreator(selectedCreator.id)
                        setIsCreatorDialogOpen(false)
                      }}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve Creator
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleRejectCreator(selectedCreator.id)
                        setIsCreatorDialogOpen(false)
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Application
                    </Button>
                  </>
                )}
                {selectedCreator.status === "active" && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleSuspendCreator(selectedCreator.id)
                      setIsCreatorDialogOpen(false)
                    }}
                  >
                    <Ban className="h-4 w-4 mr-2" />
                    Suspend Creator
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={isOrderDialogOpen} onOpenChange={setIsOrderDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{selectedOrder.id}</h3>
                  <p className="text-gray-600">
                    {selectedOrder.occasion} for {selectedOrder.recipient}
                  </p>
                </div>
                <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status.replace("-", " ")}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Customer</Label>
                  <p className="font-medium">{selectedOrder.customer}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.customerEmail}</p>
                </div>
                <div>
                  <Label>Creator</Label>
                  <p className="font-medium">{selectedOrder.creator}</p>
                </div>
                <div>
                  <Label>Order Date</Label>
                  <p className="font-medium">{selectedOrder.orderDate}</p>
                </div>
                <div>
                  <Label>Due Date</Label>
                  <p className="font-medium">{selectedOrder.dueDate}</p>
                </div>
                <div>
                  <Label>Creator Fee</Label>
                  <p className="font-medium">${selectedOrder.amount}</p>
                </div>
                <div>
                  <Label>Service Fee</Label>
                  <p className="font-medium">${selectedOrder.serviceFee}</p>
                </div>
              </div>

              {selectedOrder.completedDate && (
                <div>
                  <Label>Completed Date</Label>
                  <p className="font-medium">{selectedOrder.completedDate}</p>
                </div>
              )}

              <div className="flex space-x-2">
                {selectedOrder.status === "completed" && (
                  <Button>
                    <Download className="h-4 w-4 mr-2" />
                    Download Video
                  </Button>
                )}
                {(selectedOrder.status === "pending" || selectedOrder.status === "overdue") && (
                  <Button>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Creator
                  </Button>
                )}
                {selectedOrder.status !== "refunded" && selectedOrder.status !== "completed" && (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleRefundOrder(selectedOrder.id)
                      setIsOrderDialogOpen(false)
                    }}
                  >
                    Process Refund
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
