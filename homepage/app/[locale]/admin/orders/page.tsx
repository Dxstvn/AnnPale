"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Download, RefreshCw, DollarSign, Calendar, ArrowLeft, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useTranslations } from 'next-intl'

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

export default function AdminOrdersPage() {
  const t = useTranslations('admin.orders')
  const tCommon = useTranslations('admin.common')
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.creator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.occasion.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "refunded":
        return "bg-gray-100 text-gray-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getUrgencyIndicator = (status: string, dueDate: string) => {
    if (status === "overdue") {
      return <AlertTriangle className="h-4 w-4 text-red-600" />
    }

    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays <= 1 && status === "pending") {
      return <AlertTriangle className="h-4 w-4 text-orange-600" />
    }

    return null
  }

  const totalRevenue = filteredOrders.reduce((sum, order) => {
    if (order.status === "completed") {
      return sum + order.amount + order.serviceFee
    }
    return sum
  }, 0)

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
              <Badge variant="destructive">{filteredOrders.filter((o) => o.status === "overdue").length} {t('filters.overdue', {fallback: 'Overdue'})}</Badge>
              <Badge variant="secondary">{filteredOrders.filter((o) => o.status === "pending").length} {t('filters.pending')}</Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{tCommon('total')} {t('title', {fallback: 'Orders'}).split(' ')[1]}</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredOrders.length}</p>
                </div>
                <RefreshCw className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{tCommon('total')} {tCommon('revenue', {fallback: 'Revenue'})}</p>
                  <p className="text-2xl font-bold text-gray-900">${totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('filters.completed')}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredOrders.filter((o) => o.status === "completed").length}
                  </p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-bold">✓</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{t('filters.overdue', {fallback: 'Overdue'})}</p>
                  <p className="text-2xl font-bold text-red-600">
                    {filteredOrders.filter((o) => o.status === "overdue").length}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

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
                  <SelectValue placeholder={`${tCommon('filter')} by ${tCommon('status')}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('filters.all')}</SelectItem>
                  <SelectItem value="pending">{t('filters.pending')}</SelectItem>
                  <SelectItem value="in-progress">{t('filters.processing')}</SelectItem>
                  <SelectItem value="completed">{t('filters.completed')}</SelectItem>
                  <SelectItem value="overdue">{t('filters.overdue', {fallback: 'Overdue'})}</SelectItem>
                  <SelectItem value="refunded">{t('filters.refunded')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={`${tCommon('filter')} by ${tCommon('date')}`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{tCommon('allTime', {fallback: 'All Time'})}</SelectItem>
                  <SelectItem value="today">{tCommon('today', {fallback: 'Today'})}</SelectItem>
                  <SelectItem value="week">{tCommon('thisWeek', {fallback: 'This Week'})}</SelectItem>
                  <SelectItem value="month">{tCommon('thisMonth', {fallback: 'This Month'})}</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <Download className="h-4 w-4" />
                <span>{tCommon('export')}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            {tCommon('showing')} {filteredOrders.length} {tCommon('of')} {allOrders.length} {t('title').toLowerCase()}
          </p>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold">{order.id}</h3>
                        <Badge className={getStatusColor(order.status)}>{order.status.replace("-", " ")}</Badge>
                        {getUrgencyIndicator(order.status, order.dueDate)}
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                  <div>
                    <span className="font-medium">{t('table.date', {fallback: 'Order Date'})}:</span>
                    <p>{order.orderDate}</p>
                  </div>
                  <div>
                    <span className="font-medium">{t('table.customer')} Email:</span>
                    <p>{order.customerEmail}</p>
                  </div>
                  <div>
                    <span className="font-medium">{t('table.creator')} Fee:</span>
                    <p>${order.amount}</p>
                  </div>
                  <div>
                    <span className="font-medium">Service Fee:</span>
                    <p>${order.serviceFee}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {order.completedDate && <span>{t('filters.completed')}: {order.completedDate}</span>}
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4 mr-1" />
                      {t('actions.view')}
                    </Button>

                    {order.status === "completed" && (
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        {tCommon('export', {fallback: 'Download'})}
                      </Button>
                    )}

                    {(order.status === "overdue" || order.status === "pending") && (
                      <Button size="sm" variant="outline">
                        <RefreshCw className="h-4 w-4 mr-1" />
                        {tCommon('followUp', {fallback: 'Follow Up'})}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">{tCommon('noDataFound')}.</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setDateFilter("all")
                }}
              >
                {tCommon('clear')} {tCommon('filter')}s
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
