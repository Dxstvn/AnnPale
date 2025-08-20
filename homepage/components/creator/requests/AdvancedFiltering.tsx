"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Filter, 
  Search, 
  SortAsc, 
  SortDesc, 
  Clock, 
  DollarSign, 
  Users, 
  Zap,
  Target,
  Calendar,
  X,
  ArrowUpDown
} from "lucide-react"
import { cn } from "@/lib/utils"

export interface FilterState {
  search: string
  status: string
  occasion: string
  customerType: string
  urgency: string
  priceRange: { min: number; max: number }
  deadline: string
  complexity: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

interface AdvancedFilteringProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  requestStats: {
    total: number
    pending: number
    urgent: number
    highValue: number
  }
  availableOccasions: string[]
  onQuickFilter: (filterType: string) => void
}

export function AdvancedFiltering({
  filters,
  onFiltersChange,
  requestStats,
  availableOccasions,
  onQuickFilter
}: AdvancedFilteringProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      status: 'all',
      occasion: 'all',
      customerType: 'all',
      urgency: 'all',
      priceRange: { min: 0, max: 1000 },
      deadline: 'all',
      complexity: 'all',
      sortBy: 'deadline',
      sortOrder: 'asc'
    })
  }

  const getActiveFilterCount = () => {
    let count = 0
    if (filters.search) count++
    if (filters.status !== 'all') count++
    if (filters.occasion !== 'all') count++
    if (filters.customerType !== 'all') count++
    if (filters.urgency !== 'all') count++
    if (filters.deadline !== 'all') count++
    if (filters.complexity !== 'all') count++
    return count
  }

  const quickFilters = [
    { 
      label: 'Urgent', 
      count: requestStats.urgent, 
      action: () => onQuickFilter('urgent'),
      color: 'bg-red-100 text-red-800',
      icon: Clock
    },
    { 
      label: 'High Value', 
      count: requestStats.highValue, 
      action: () => onQuickFilter('high-value'),
      color: 'bg-green-100 text-green-800',
      icon: DollarSign
    },
    { 
      label: 'Repeat Customers', 
      count: 12, 
      action: () => onQuickFilter('repeat-customers'),
      color: 'bg-blue-100 text-blue-800',
      icon: Users
    },
    { 
      label: 'Quick Wins', 
      count: 8, 
      action: () => onQuickFilter('quick-wins'),
      color: 'bg-purple-100 text-purple-800',
      icon: Zap
    }
  ]

  const smartSorts = [
    { value: 'deadline-urgent', label: 'Deadline (Urgent First)', description: 'Prioritizes by deadline with urgency boost' },
    { value: 'price-high', label: 'Price (High to Low)', description: 'Maximize earnings potential' },
    { value: 'success-probability', label: 'Success Probability', description: 'Based on your past performance' },
    { value: 'complexity-easy', label: 'Complexity (Easy First)', description: 'Quick wins and momentum building' },
    { value: 'customer-repeat', label: 'Repeat Customers First', description: 'Prioritize relationship building' },
    { value: 'similar-grouping', label: 'Group Similar Requests', description: 'Batch similar content together' }
  ]

  return (
    <div className="space-y-4">
      {/* Quick Stats and Filters */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Smart Filtering & Sorting
            </div>
            <div className="flex items-center gap-2">
              {getActiveFilterCount() > 0 && (
                <Badge variant="outline">
                  {getActiveFilterCount()} active filters
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                disabled={getActiveFilterCount() === 0}
              >
                <X className="h-4 w-4 mr-1" />
                Clear
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Action Filters */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Quick Filters</h3>
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((filter) => {
                const Icon = filter.icon
                return (
                  <Button
                    key={filter.label}
                    variant="outline"
                    size="sm"
                    onClick={filter.action}
                    className={cn(
                      "transition-colors",
                      filter.color
                    )}
                  >
                    <Icon className="h-3 w-3 mr-1" />
                    {filter.label}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {filter.count}
                    </Badge>
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Search and Basic Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search requests, customers, occasions..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={filters.status} onValueChange={(value) => updateFilter('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="recording">Recording</SelectItem>
                <SelectItem value="in-review">In Review</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.occasion} onValueChange={(value) => updateFilter('occasion', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Occasion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Occasions</SelectItem>
                {availableOccasions.map((occasion) => (
                  <SelectItem key={occasion} value={occasion.toLowerCase()}>
                    {occasion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2"
            >
              <Target className="h-4 w-4" />
              Advanced
              {showAdvanced ? (
                <ArrowUpDown className="h-3 w-3 rotate-180" />
              ) : (
                <ArrowUpDown className="h-3 w-3" />
              )}
            </Button>
          </div>

          {/* Advanced Filters */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4 border-t">
              <Select value={filters.customerType} onValueChange={(value) => updateFilter('customerType', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Customer Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Customers</SelectItem>
                  <SelectItem value="new">New Customers</SelectItem>
                  <SelectItem value="repeat">Repeat Customers</SelectItem>
                  <SelectItem value="vip">VIP Customers</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.urgency} onValueChange={(value) => updateFilter('urgency', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Urgency Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Urgency</SelectItem>
                  <SelectItem value="high">High Urgency</SelectItem>
                  <SelectItem value="medium">Medium Urgency</SelectItem>
                  <SelectItem value="low">Low Urgency</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.complexity} onValueChange={(value) => updateFilter('complexity', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Complexity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Complexity</SelectItem>
                  <SelectItem value="low">Easy (Quick Wins)</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">Complex</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Smart Sorting */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Psychological Sorting</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {smartSorts.map((sort) => (
                <Button
                  key={sort.value}
                  variant={filters.sortBy === sort.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateFilter('sortBy', sort.value)}
                  className="justify-start h-auto p-3"
                >
                  <div className="text-left">
                    <div className="font-medium text-xs">{sort.label}</div>
                    <div className="text-xs text-gray-500 mt-1">{sort.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Filters Summary */}
      {getActiveFilterCount() > 0 && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">
                  Active Filters ({getActiveFilterCount()})
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {filters.search && (
                  <Badge variant="outline" className="bg-white">
                    Search: "{filters.search}"
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => updateFilter('search', '')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.status !== 'all' && (
                  <Badge variant="outline" className="bg-white">
                    Status: {filters.status}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => updateFilter('status', 'all')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
                {filters.occasion !== 'all' && (
                  <Badge variant="outline" className="bg-white">
                    Occasion: {filters.occasion}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1"
                      onClick={() => updateFilter('occasion', 'all')}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}