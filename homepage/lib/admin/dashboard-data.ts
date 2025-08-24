// Static data for admin dashboard - moved to separate file for better performance

export const dashboardStats = {
  totalUsers: 12450,
  totalCreators: 156,
  totalVideos: 8920,
  totalRevenue: 125000,
  monthlyGrowth: 15.2,
  pendingApprovals: 8,
  activeOrders: 45,
  averageRating: 4.7,
}

export const allOrders = [
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

export const allCreators = [
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

export const topCreators = [
  {
    name: "Wyclef Jean",
    image: "/images/wyclef-jean.png",
    earnings: 4500,
    videos: 45,
    rating: 4.9,
    verified: true,
  },
  {
    name: "Ti Jo Zenny",
    image: "/images/ti-jo-zenny.jpg",
    earnings: 3200,
    videos: 38,
    rating: 4.8,
    verified: true,
  },
  {
    name: "Rutshelle Guillaume",
    image: "/images/rutshelle-guillaume.jpg",
    earnings: 2800,
    videos: 33,
    rating: 4.9,
    verified: true,
  },
]

export function getStatusColor(status: string) {
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