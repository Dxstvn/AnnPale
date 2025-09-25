"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Filter, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  PlayCircle,
  Download,
  Eye,
  Star,
  ChevronRight,
  Package,
  Gift,
  MessageSquare,
  RefreshCw
} from "lucide-react"
import { format } from "date-fns"

interface Order {
  id: string
  creatorName: string
  creatorImage: string
  recipientName: string
  occasion: string
  price: number
  status: "pending" | "processing" | "completed" | "cancelled" | "refunded"
  orderedAt: Date
  deliveredAt?: Date
  videoUrl?: string
  thumbnailUrl?: string
  duration?: string
  isGift: boolean
  rating?: number
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

export default function OrdersPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Mock data - would come from API
  useEffect(() => {
    const mockOrders: Order[] = [
      {
        id: "ANN-2024-001",
        creatorName: "Wyclef Jean",
        creatorImage: "/images/wyclef-jean.png",
        recipientName: "Marie Joseph",
        occasion: "Birthday",
        price: 150,
        status: "completed",
        orderedAt: new Date("2024-01-15"),
        deliveredAt: new Date("2024-01-17"),
        videoUrl: "/videos/sample1.mp4",
        thumbnailUrl: "/images/video-thumbnail1.jpg",
        duration: "2:45",
        isGift: false,
        rating: 5
      },
      {
        id: "ANN-2024-002",
        creatorName: "Ti Jo Zenny",
        creatorImage: "/images/ti-jo-zenny.jpg",
        recipientName: "Pierre Louis",
        occasion: "Anniversary",
        price: 85,
        status: "processing",
        orderedAt: new Date("2024-01-20"),
        isGift: true
      },
      {
        id: "ANN-2024-003",
        creatorName: "Emeline Michel",
        creatorImage: "/images/emeline-michel.jpg",
        recipientName: "Jean Baptiste",
        occasion: "Graduation",
        price: 120,
        status: "pending",
        orderedAt: new Date("2024-01-22"),
        isGift: false
      },
      {
        id: "ANN-2024-004",
        creatorName: "Mikaben",
        creatorImage: "/images/mikaben.jpg",
        recipientName: "Sophie Desir",
        occasion: "Get Well Soon",
        price: 100,
        status: "completed",
        orderedAt: new Date("2024-01-10"),
        deliveredAt: new Date("2024-01-11"),
        videoUrl: "/videos/sample2.mp4",
        thumbnailUrl: "/images/video-thumbnail2.jpg",
        duration: "1:30",
        isGift: false,
        rating: 4
      },
      {
        id: "ANN-2024-005",
        creatorName: "Rutshelle Guillaume",
        creatorImage: "/images/rutshelle.jpg",
        recipientName: "Claude Michel",
        occasion: "Birthday",
        price: 95,
        status: "cancelled",
        orderedAt: new Date("2024-01-05"),
        isGift: true
      }
    ]
    
    setTimeout(() => {
      setOrders(mockOrders)
      setFilteredOrders(mockOrders)
      setIsLoading(false)
    }, 1000)
  }, [])

  // Filter orders based on search and tab
  useEffect(() => {
    let filtered = orders

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(order => 
        order.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.occasion.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by status tab
    if (activeTab !== "all") {
      filtered = filtered.filter(order => order.status === activeTab)
    }

    setFilteredOrders(filtered)
  }, [searchQuery, activeTab, orders])

  const getStatusBadge = (status: Order["status"]) => {
    const config = statusConfig[status]
    const Icon = config.icon
    
    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  const handleViewOrder = (order: Order) => {
    if (order.status === "completed" && order.videoUrl) {
      router.push(`/delivery/${order.id}`)
    } else {
      router.push(`/order/confirmation?orderId=${order.id}`)
    }
  }

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handleViewOrder(order)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <img
              src={order.creatorImage}
              alt={order.creatorName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h3 className="font-semibold text-lg">{order.creatorName}</h3>
              <p className="text-sm text-gray-600">Order #{order.id}</p>
            </div>
          </div>
          {getStatusBadge(order.status)}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Gift className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">For:</span>
            <span className="font-medium">{order.recipientName}</span>
            {order.isGift && (
              <Badge variant="secondary" className="ml-2">
                Gift
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <MessageSquare className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Occasion:</span>
            <span className="font-medium capitalize">{order.occasion}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Ordered:</span>
            <span className="font-medium">{format(order.orderedAt, "MMM d, yyyy")}</span>
          </div>
          
          {order.deliveredAt && (
            <div className="flex items-center gap-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-gray-600">Delivered:</span>
              <span className="font-medium">{format(order.deliveredAt, "MMM d, yyyy")}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-sm text-gray-600">Total Paid</p>
            <p className="text-xl font-bold text-purple-600">${order.price}</p>
          </div>
          
          <div className="flex items-center gap-2">
            {order.status === "completed" && order.rating && (
              <div className="flex items-center gap-1 mr-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < order.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
            )}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleViewOrder(order)
              }}
            >
              {order.status === "completed" ? (
                <>
                  <Eye className="h-4 w-4 mr-2" />
                  Watch
                </>
              ) : (
                <>
                  View Details
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
            
            {order.status === "completed" && order.videoUrl && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  // Handle download
                  const link = document.createElement('a')
                  link.href = order.videoUrl!
                  link.download = `${order.creatorName}-${order.recipientName}-${order.occasion}.mp4`
                  link.click()
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  const orderCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    processing: orders.filter(o => o.status === "processing").length,
    completed: orders.filter(o => o.status === "completed").length,
    cancelled: orders.filter(o => o.status === "cancelled").length,
    refunded: orders.filter(o => o.status === "refunded").length
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Orders</h1>
          <p className="text-gray-600">
            Manage and track all your video message orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold">{orders.length}</p>
                </div>
                <Package className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">
                    {orderCounts.completed}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {orderCounts.processing}
                  </p>
                </div>
                <PlayCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {orderCounts.pending}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by creator, recipient, order ID, or occasion..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 hover:shadow-md transition-all duration-300">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-6">
            <TabsTrigger value="all">
              All ({orderCounts.all})
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending ({orderCounts.pending})
            </TabsTrigger>
            <TabsTrigger value="processing">
              Recording ({orderCounts.processing})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Delivered ({orderCounts.completed})
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled ({orderCounts.cancelled})
            </TabsTrigger>
            <TabsTrigger value="refunded">
              Refunded ({orderCounts.refunded})
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab}>
            {filteredOrders.length > 0 ? (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No orders found
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery
                      ? "Try adjusting your search terms"
                      : activeTab === "all"
                      ? "You haven't placed any orders yet"
                      : `You don't have any ${activeTab} orders`}
                  </p>
                  <Button
                    onClick={() => router.push("/browse")}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
                  >
                    Browse Creators
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Help Section */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
            <CardDescription>
              Common questions about your orders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="link"
              className="justify-start p-0 h-auto text-purple-600"
              onClick={() => router.push("/help/orders")}
            >
              How long does delivery take?
            </Button>
            <Button
              variant="link"
              className="justify-start p-0 h-auto text-purple-600"
              onClick={() => router.push("/help/refunds")}
            >
              What's your refund policy?
            </Button>
            <Button
              variant="link"
              className="justify-start p-0 h-auto text-purple-600"
              onClick={() => router.push("/help/contact")}
            >
              Contact support
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}