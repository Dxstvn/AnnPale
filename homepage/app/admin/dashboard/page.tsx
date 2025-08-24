"use client"

import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { AdminLayout } from "@/components/admin/admin-layout"
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
  Star,
  Settings,
  Eye,
  UserCheck,
  Ban,
  Edit,
  Search,
  Download,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react"
import { useState } from "react"
import { AvatarWithFallback, CreatorAvatar } from "@/components/ui/avatar-with-fallback"

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

// Mock data for recent activities
const recentActivities = [
  { id: 1, type: "user_joined", message: "New user registered", user: "Marie Joseph", time: "2 minutes ago" },
  { id: 2, type: "video_uploaded", message: "New video uploaded", creator: "Jean Baptiste", time: "15 minutes ago" },
  { id: 3, type: "order_completed", message: "Order completed", amount: "$150", time: "1 hour ago" },
  { id: 4, type: "creator_verified", message: "Creator verified", creator: "Anne Laurent", time: "3 hours ago" },
  { id: 5, type: "withdrawal_request", message: "Withdrawal request", amount: "$500", time: "5 hours ago" },
]

// Mock data for creators
const creators = [
  {
    id: 1,
    name: "Jean Baptiste",
    username: "@jeanbaptiste",
    image: "https://i.pravatar.cc/150?img=1",
    videos: 45,
    earnings: 2500,
    rating: 4.8,
    status: "active",
    joined: "2024-01-15",
    email: "jean@example.com",
    phone: "+509 3456 7890",
  },
  {
    id: 2,
    name: "Marie Joseph",
    username: "@mariejoseph",
    image: "https://i.pravatar.cc/150?img=2",
    videos: 32,
    earnings: 1800,
    rating: 4.9,
    status: "active",
    joined: "2024-02-20",
    email: "marie@example.com",
    phone: "+509 3456 7891",
  },
  {
    id: 3,
    name: "Pierre Louis",
    username: "@pierrelouis",
    image: "https://i.pravatar.cc/150?img=3",
    videos: 28,
    earnings: 1200,
    rating: 4.7,
    status: "pending",
    joined: "2024-03-10",
    email: "pierre@example.com",
    phone: "+509 3456 7892",
  },
]

export default function AdminDashboard() {
  const { user, isLoading } = useSupabaseAuth()
  const [selectedCreator, setSelectedCreator] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const filteredCreators = creators.filter(creator => {
    const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          creator.username.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || creator.status === filterStatus
    return matchesSearch && matchesFilter
  })

  // Show loading while auth is being checked
  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-purple-600" />
            <p className="mt-2 text-gray-600">Loading...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Welcome back, {user?.name || user?.email}!</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
            <Button>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalUsers.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{dashboardStats.monthlyGrowth}%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Creators</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalCreators}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-orange-600">{dashboardStats.pendingApprovals} pending</span> approvals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Videos</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.totalVideos.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-blue-600">{dashboardStats.activeOrders} active</span> orders
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${dashboardStats.totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">+{dashboardStats.monthlyGrowth}%</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="creators">Creators</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="finance">Finance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Activities */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`h-2 w-2 rounded-full ${
                            activity.type === 'user_joined' ? 'bg-green-500' :
                            activity.type === 'video_uploaded' ? 'bg-blue-500' :
                            activity.type === 'order_completed' ? 'bg-purple-500' :
                            activity.type === 'creator_verified' ? 'bg-yellow-500' :
                            'bg-red-500'
                          }`} />
                          <div>
                            <p className="text-sm font-medium">{activity.message}</p>
                            <p className="text-xs text-gray-500">
                              {activity.user || activity.creator || activity.amount}
                            </p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-400">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Pending Approvals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Pending Approvals
                    <Badge variant="destructive">{dashboardStats.pendingApprovals}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {creators.filter(c => c.status === 'pending').map((creator) => (
                      <div key={creator.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <CreatorAvatar
                            src={creator.image}
                            name={creator.name}
                            size="sm"
                          />
                          <div>
                            <p className="text-sm font-medium">{creator.name}</p>
                            <p className="text-xs text-gray-500">{creator.username}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3 mr-1" />
                            Review
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <UserCheck className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="destructive">
                            <Ban className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart Placeholder */}
            <Card>
              <CardHeader>
                <CardTitle>Platform Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">Chart visualization would go here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="creators" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Manage Creators</CardTitle>
                  <div className="flex gap-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search creators..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4">Creator</th>
                        <th className="text-left p-4">Videos</th>
                        <th className="text-left p-4">Earnings</th>
                        <th className="text-left p-4">Rating</th>
                        <th className="text-left p-4">Status</th>
                        <th className="text-left p-4">Joined</th>
                        <th className="text-left p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCreators.map((creator) => (
                        <tr key={creator.id} className="border-b hover:bg-gray-50">
                          <td className="p-4">
                            <div className="flex items-center space-x-3">
                              <CreatorAvatar
                                src={creator.image}
                                name={creator.name}
                                size="sm"
                              />
                              <div>
                                <p className="font-medium">{creator.name}</p>
                                <p className="text-sm text-gray-500">{creator.username}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">{creator.videos}</td>
                          <td className="p-4">${creator.earnings.toLocaleString()}</td>
                          <td className="p-4">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              {creator.rating}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge variant={
                              creator.status === 'active' ? 'default' :
                              creator.status === 'pending' ? 'secondary' :
                              'destructive'
                            }>
                              {creator.status}
                            </Badge>
                          </td>
                          <td className="p-4">{creator.joined}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedCreator(creator)}
                              >
                                <Eye className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="text-red-600">
                                <Ban className="h-3 w-3" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Other tabs content simplified for brevity */}
          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">User management interface will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Content Moderation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Content moderation tools will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="finance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Financial reports and analytics will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Creator Details Dialog */}
        <Dialog open={!!selectedCreator} onOpenChange={() => setSelectedCreator(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Creator Details</DialogTitle>
            </DialogHeader>
            {selectedCreator && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <CreatorAvatar
                    src={selectedCreator.image}
                    name={selectedCreator.name}
                    size="lg"
                  />
                  <div>
                    <h3 className="text-lg font-semibold">{selectedCreator.name}</h3>
                    <p className="text-sm text-gray-500">{selectedCreator.username}</p>
                    <Badge variant={
                      selectedCreator.status === 'active' ? 'default' :
                      selectedCreator.status === 'pending' ? 'secondary' :
                      'destructive'
                    }>
                      {selectedCreator.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <p className="text-sm">{selectedCreator.email}</p>
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <p className="text-sm">{selectedCreator.phone}</p>
                  </div>
                  <div>
                    <Label>Total Videos</Label>
                    <p className="text-sm">{selectedCreator.videos}</p>
                  </div>
                  <div>
                    <Label>Total Earnings</Label>
                    <p className="text-sm">${selectedCreator.earnings.toLocaleString()}</p>
                  </div>
                  <div>
                    <Label>Rating</Label>
                    <p className="text-sm flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 mr-1" />
                      {selectedCreator.rating}
                    </p>
                  </div>
                  <div>
                    <Label>Joined Date</Label>
                    <p className="text-sm">{selectedCreator.joined}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  {selectedCreator.status === 'pending' && (
                    <>
                      <Button className="bg-green-600 hover:bg-green-700">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button variant="destructive">
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                  {selectedCreator.status === 'active' && (
                    <Button variant="destructive">
                      <Ban className="h-4 w-4 mr-2" />
                      Suspend
                    </Button>
                  )}
                  {selectedCreator.status === 'suspended' && (
                    <Button>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Reactivate
                    </Button>
                  )}
                  <Button variant="outline" onClick={() => setSelectedCreator(null)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}