"use client"

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Brain, Zap } from "lucide-react"
import Link from "next/link"
import { RequestStateManager, type RequestState } from "@/components/creator/requests/RequestStateManager"
import { RequestIntelligence } from "@/components/creator/requests/RequestIntelligence"
import { AdvancedFiltering, type FilterState } from "@/components/creator/requests/AdvancedFiltering"
import { BatchOperations } from "@/components/creator/requests/BatchOperations"

// Enhanced request data with psychological workflow features
const allRequests = [
  {
    id: 1,
    customer: "Marie L.",
    occasion: "Birthday",
    recipient: "Sarah",
    message: "Happy birthday message for my daughter Sarah who just turned 16. She loves your comedy and would be so excited to hear from you! Please mention that she's starting her junior year of high school and loves to dance.",
    price: 85,
    requestedDate: "2024-01-15",
    dueDate: "2024-01-17",
    state: "new" as RequestState,
    language: "English",
    urgency: 8,
    hoursRemaining: 6,
    customerType: "repeat" as const,
    complexity: "medium" as const,
    intelligence: {
      similarRequests: 12,
      suggestedPrice: 95,
      currentPrice: 85,
      estimatedTime: "2-3 hours",
      successProbability: 92,
      complexity: "medium" as const,
      customerType: "repeat" as const,
      urgencyScore: 8
    }
  },
  {
    id: 2,
    customer: "Jean P.",
    occasion: "Graduation",
    recipient: "Marcus",
    message: "Congratulations message for my son Marcus who just graduated from university with a degree in engineering. He's been a fan since your early days and this would mean the world to him.",
    price: 85,
    requestedDate: "2024-01-14",
    dueDate: "2024-01-16",
    state: "accepted" as RequestState,
    language: "English",
    urgency: 6,
    hoursRemaining: 18,
    customerType: "new" as const,
    complexity: "low" as const,
    intelligence: {
      similarRequests: 8,
      suggestedPrice: 85,
      currentPrice: 85,
      estimatedTime: "1-2 hours",
      successProbability: 88,
      complexity: "low" as const,
      customerType: "new" as const,
      urgencyScore: 6
    }
  },
  {
    id: 3,
    customer: "Pierre M.",
    occasion: "Anniversary",
    recipient: "Lisa & David",
    message: "5th wedding anniversary wishes for my friends Lisa and David. They had their first dance to one of your songs and would love a special message from you.",
    price: 85,
    requestedDate: "2024-01-13",
    dueDate: "2024-01-15",
    state: "delivered" as RequestState,
    language: "Haitian Creole",
    urgency: 2,
    customerType: "repeat" as const,
    complexity: "high" as const,
    intelligence: {
      similarRequests: 15,
      suggestedPrice: 100,
      currentPrice: 85,
      estimatedTime: "3-4 hours",
      successProbability: 95,
      complexity: "high" as const,
      customerType: "repeat" as const,
      urgencyScore: 2
    }
  },
  {
    id: 4,
    customer: "Nadine L.",
    occasion: "Congratulations",
    recipient: "Michael",
    message: "My brother Michael just got promoted to manager at his job. He's worked so hard and deserves this recognition. Please congratulate him and maybe add some motivational words!",
    price: 85,
    requestedDate: "2024-01-12",
    dueDate: "2024-01-14",
    state: "recording" as RequestState,
    language: "French",
    urgency: 4,
    customerType: "vip" as const,
    complexity: "medium" as const,
    intelligence: {
      similarRequests: 6,
      suggestedPrice: 90,
      currentPrice: 85,
      estimatedTime: "2 hours",
      successProbability: 85,
      complexity: "medium" as const,
      customerType: "vip" as const,
      urgencyScore: 4
    }
  },
  {
    id: 5,
    customer: "Alex T.",
    occasion: "Get Well Soon",
    recipient: "Grandma Rose",
    message: "My grandmother Rose is in the hospital and feeling down. She's 78 and has been a fan of yours for years. A get well message would really lift her spirits.",
    price: 85,
    requestedDate: "2024-01-11",
    dueDate: "2024-01-13",
    state: "new" as RequestState,
    language: "Haitian Creole",
    urgency: 9,
    hoursRemaining: 3,
    customerType: "new" as const,
    complexity: "low" as const,
    intelligence: {
      similarRequests: 4,
      suggestedPrice: 85,
      currentPrice: 85,
      estimatedTime: "1 hour",
      successProbability: 90,
      complexity: "low" as const,
      customerType: "new" as const,
      urgencyScore: 9
    }
  }
]

export default function CreatorRequestsPage() {
  const [selectedRequests, setSelectedRequests] = useState<number[]>([])
  const [showBatchMode, setShowBatchMode] = useState(false)
  const [expandedIntelligence, setExpandedIntelligence] = useState<number | null>(null)
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    status: 'all',
    occasion: 'all',
    customerType: 'all',
    urgency: 'all',
    priceRange: { min: 0, max: 1000 },
    deadline: 'all',
    complexity: 'all',
    sortBy: 'deadline-urgent',
    sortOrder: 'asc'
  })

  // Apply psychological filtering and sorting
  const filteredAndSortedRequests = useMemo(() => {
    let filtered = allRequests.filter((request) => {
      const matchesSearch = filters.search === '' || 
        request.customer.toLowerCase().includes(filters.search.toLowerCase()) ||
        request.occasion.toLowerCase().includes(filters.search.toLowerCase()) ||
        request.recipient.toLowerCase().includes(filters.search.toLowerCase())

      const matchesStatus = filters.status === 'all' || request.state === filters.status
      const matchesOccasion = filters.occasion === 'all' || request.occasion.toLowerCase() === filters.occasion
      const matchesCustomerType = filters.customerType === 'all' || request.customerType === filters.customerType
      
      const matchesUrgency = filters.urgency === 'all' || 
        (filters.urgency === 'high' && request.urgency >= 7) ||
        (filters.urgency === 'medium' && request.urgency >= 4 && request.urgency < 7) ||
        (filters.urgency === 'low' && request.urgency < 4)
      
      const matchesComplexity = filters.complexity === 'all' || request.complexity === filters.complexity

      return matchesSearch && matchesStatus && matchesOccasion && matchesCustomerType && matchesUrgency && matchesComplexity
    })

    // Psychological sorting algorithms
    return filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'deadline-urgent':
          // Prioritize by urgency score, then deadline
          if (a.urgency !== b.urgency) return b.urgency - a.urgency
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        
        case 'price-high':
          return b.price - a.price
        
        case 'success-probability':
          return b.intelligence.successProbability - a.intelligence.successProbability
        
        case 'complexity-easy':
          const complexityOrder = { low: 0, medium: 1, high: 2 }
          return complexityOrder[a.complexity] - complexityOrder[b.complexity]
        
        case 'customer-repeat':
          const customerOrder = { repeat: 0, vip: 1, new: 2 }
          return customerOrder[a.customerType] - customerOrder[b.customerType]
        
        case 'similar-grouping':
          // Group by occasion type, then by urgency
          if (a.occasion !== b.occasion) return a.occasion.localeCompare(b.occasion)
          return b.urgency - a.urgency
        
        default:
          return new Date(b.requestedDate).getTime() - new Date(a.requestedDate).getTime()
      }
    })
  }, [filters])

  const requestStats = {
    total: allRequests.length,
    pending: allRequests.filter(r => r.state === 'new').length,
    urgent: allRequests.filter(r => r.urgency >= 7).length,
    highValue: allRequests.filter(r => r.price >= 100).length
  }

  const availableOccasions = [...new Set(allRequests.map(r => r.occasion))]

  const handleQuickFilter = (filterType: string) => {
    switch (filterType) {
      case 'urgent':
        setFilters(prev => ({ ...prev, urgency: 'high', sortBy: 'deadline-urgent' }))
        break
      case 'high-value':
        setFilters(prev => ({ ...prev, priceRange: { min: 100, max: 1000 } }))
        break
      case 'repeat-customers':
        setFilters(prev => ({ ...prev, customerType: 'repeat' }))
        break
      case 'quick-wins':
        setFilters(prev => ({ ...prev, complexity: 'low', sortBy: 'complexity-easy' }))
        break
    }
  }

  const handleBatchAction = (action: string, data?: any) => {
    console.log('Batch action:', action, 'on requests:', selectedRequests, 'with data:', data)
    // Here you would implement the actual batch operations
    setSelectedRequests([])
    setShowBatchMode(false)
  }

  const handleStateAction = (requestId: number, action: string) => {
    console.log('State action:', action, 'on request:', requestId)
    // Here you would implement state transitions
  }

  const handleRequestSelect = (requestId: number, selected: boolean) => {
    setSelectedRequests(prev => 
      selected 
        ? [...prev, requestId]
        : prev.filter(id => id !== requestId)
    )
  }

  const toggleIntelligence = (requestId: number) => {
    setExpandedIntelligence(expandedIntelligence === requestId ? null : requestId)
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
              <h1 className="text-xl font-semibold">Request Management</h1>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                Psychological Workflow
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                {filteredAndSortedRequests.filter((r) => r.state === "new").length} Pending
              </Badge>
              <Button
                variant={showBatchMode ? "default" : "outline"}
                size="sm"
                onClick={() => setShowBatchMode(!showBatchMode)}
              >
                <Zap className="h-4 w-4 mr-1" />
                Batch Mode
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Advanced Filtering */}
        <AdvancedFiltering
          filters={filters}
          onFiltersChange={setFilters}
          requestStats={requestStats}
          availableOccasions={availableOccasions}
          onQuickFilter={handleQuickFilter}
        />

        {/* Batch Operations */}
        {showBatchMode && (
          <BatchOperations
            selectedCount={selectedRequests.length}
            selectedRequests={selectedRequests}
            onBatchAction={handleBatchAction}
            onSelectAll={() => setSelectedRequests(filteredAndSortedRequests.map(r => r.id))}
            onClearSelection={() => setSelectedRequests([])}
            availabilitySlots={['Tomorrow 2-4 PM', 'Thursday 10 AM - 12 PM', 'Friday Evening']}
          />
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            Showing {filteredAndSortedRequests.length} of {allRequests.length} requests
            {filters.sortBy !== 'newest' && (
              <span className="ml-2 text-purple-600 font-medium">
                • Sorted by {filters.sortBy.replace('-', ' ')}
              </span>
            )}
          </p>
          {filteredAndSortedRequests.length > 0 && (
            <Badge className="bg-green-100 text-green-800">
              ${filteredAndSortedRequests.reduce((sum, r) => sum + r.price, 0)} total value
            </Badge>
          )}
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredAndSortedRequests.map((request) => (
            <div key={request.id} className="space-y-4">
              <Card className={`hover:shadow-md transition-all ${
                selectedRequests.includes(request.id) ? 'ring-2 ring-purple-500 bg-purple-50' : ''
              }`}>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Request Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold">
                            {request.occasion} for {request.recipient}
                          </h3>
                          <Badge variant="outline">{request.language}</Badge>
                          <Badge className={
                            request.customerType === 'vip' ? 'bg-purple-100 text-purple-800' :
                            request.customerType === 'repeat' ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }>
                            {request.customerType} customer
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-1">From: {request.customer}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-green-600 font-bold text-lg mb-1">
                          <span>${request.price}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleIntelligence(request.id)}
                          className="text-purple-600 hover:text-purple-700"
                        >
                          <Brain className="h-4 w-4 mr-1" />
                          AI Insights
                        </Button>
                      </div>
                    </div>

                    {/* Request Message */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{request.message}</p>
                    </div>

                    {/* State Management */}
                    <RequestStateManager
                      state={request.state}
                      hoursRemaining={request.hoursRemaining}
                      deliveryDeadline={request.dueDate}
                      onStateAction={(action) => handleStateAction(request.id, action)}
                      onBulkSelect={(selected) => handleRequestSelect(request.id, selected)}
                      isSelected={selectedRequests.includes(request.id)}
                      showBulkSelect={showBatchMode}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* AI Intelligence Panel */}
              {expandedIntelligence === request.id && (
                <RequestIntelligence
                  request={request}
                  intelligence={request.intelligence}
                  onAccept={() => handleStateAction(request.id, 'accept')}
                  onDecline={() => handleStateAction(request.id, 'decline')}
                  onSuggestedAction={(action) => console.log('Suggested action:', action)}
                />
              )}
            </div>
          ))}
        </div>

        {filteredAndSortedRequests.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">No requests found matching your criteria.</p>
              <Button
                onClick={() => setFilters({
                  search: '',
                  status: 'all',
                  occasion: 'all',
                  customerType: 'all',
                  urgency: 'all',
                  priceRange: { min: 0, max: 1000 },
                  deadline: 'all',
                  complexity: 'all',
                  sortBy: 'deadline-urgent',
                  sortOrder: 'asc'
                })}
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}