"use client"

import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, UserCheck, Ban, Eye, Edit, Star, DollarSign, Video, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useState } from "react"

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

export default function AdminCreatorsPage() {
  const t = useTranslations('admin.creators')
  const tCommon = useTranslations('admin.common')
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")

  const filteredCreators = allCreators.filter((creator) => {
    const matchesSearch =
      creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.stageName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      creator.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || creator.status === statusFilter
    const matchesCategory = categoryFilter === "all" || creator.category.toLowerCase() === categoryFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesCategory
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin/dashboard">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-xl font-semibold">{t('title')}</h1>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">
                {filteredCreators.filter((c) => c.status === "pending").length} {t('filters.pending')}
              </Badge>
              <Badge variant="outline">{filteredCreators.filter((c) => c.status === "active").length} {t('filters.active')}</Badge>
            </div>
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
                  placeholder={t('searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('filterByStatus', { defaultValue: 'Filter by status' })} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.all')}</SelectItem>
                  <SelectItem value="active">{t('status.active')}</SelectItem>
                  <SelectItem value="pending">{t('status.pending')}</SelectItem>
                  <SelectItem value="suspended">{t('status.suspended')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('filterByCategory', { defaultValue: 'Filter by category' })} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="musician">Musicians</SelectItem>
                  <SelectItem value="singer">Singers</SelectItem>
                  <SelectItem value="comedian">Comedians</SelectItem>
                  <SelectItem value="actor">Actors</SelectItem>
                  <SelectItem value="dj">DJs</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <Filter className="h-4 w-4" />
                <span>{tCommon('moreFilters', { defaultValue: 'More Filters' })}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            {tCommon('showing')} {filteredCreators.length} {tCommon('of')} {allCreators.length} {t('creatorsCount', { defaultValue: 'creators' })}
          </p>
        </div>

        {/* Creators List */}
        <div className="space-y-4">
          {filteredCreators.map((creator) => (
            <Card key={creator.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
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
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>

                      {creator.status === "pending" && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <UserCheck className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button size="sm" variant="destructive">
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
                          <Button size="sm" variant="destructive">
                            <Ban className="h-4 w-4 mr-1" />
                            Suspend
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCreators.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">No creators found matching your criteria.</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setCategoryFilter("all")
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
