"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  AlertCircle, 
  Clock, 
  DollarSign, 
  CheckCircle, 
  XCircle, 
  Video,
  ArrowRight,
  Timer
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PendingRequest {
  id: number
  recipient: string
  occasion: string
  price: number
  hoursUntilDue: number
  isUrgent: boolean
}

interface ImmediateStatusProps {
  pendingRequests: PendingRequest[]
  todayEarnings: number
  urgentDeadlines: number
  onAccept?: (id: number) => void
  onDecline?: (id: number) => void
  onRecord?: (id: number) => void
  onViewAll?: () => void
}

export function ImmediateStatus({
  pendingRequests,
  todayEarnings,
  urgentDeadlines,
  onAccept,
  onDecline,
  onRecord,
  onViewAll
}: ImmediateStatusProps) {
  const mostUrgentRequests = pendingRequests.slice(0, 3)
  
  return (
    <div className="w-full">
      {/* Alert Bar for Urgent Items */}
      {urgentDeadlines > 0 && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <span className="text-sm font-medium text-red-900">
              {urgentDeadlines} request{urgentDeadlines > 1 ? 's' : ''} due within 24 hours
            </span>
          </div>
          <Button size="sm" variant="destructive" onClick={onViewAll}>
            View Urgent
          </Button>
        </div>
      )}

      {/* Main Status Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Pending Requests - Large Widget */}
        <Card className="lg:col-span-2 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-purple-600" />
                <h3 className="text-lg font-semibold">Pending Requests</h3>
                <Badge className="bg-purple-600">
                  {pendingRequests.length} Active
                </Badge>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onViewAll}
                className="text-purple-600 hover:text-purple-700"
              >
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>

            {mostUrgentRequests.length > 0 ? (
              <div className="space-y-3">
                {mostUrgentRequests.map((request) => (
                  <div 
                    key={request.id} 
                    className={cn(
                      "p-3 bg-white rounded-lg border",
                      request.isUrgent ? "border-red-300" : "border-gray-200"
                    )}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-sm">
                          {request.occasion} for {request.recipient}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-lg font-bold text-green-600">
                            ${request.price}
                          </span>
                          {request.isUrgent && (
                            <Badge variant="destructive" className="text-xs">
                              <Timer className="h-3 w-3 mr-1" />
                              {request.hoursUntilDue}h left
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                          onClick={() => onAccept?.(request.id)}
                        >
                          <CheckCircle className="h-5 w-5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => onDecline?.(request.id)}
                        >
                          <XCircle className="h-5 w-5" />
                        </Button>
                        <Button
                          size="sm"
                          className="h-8 px-2 bg-purple-600 hover:bg-purple-700"
                          onClick={() => onRecord?.(request.id)}
                        >
                          <Video className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Clock className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No pending requests</p>
                <p className="text-xs mt-1">New requests will appear here</p>
              </div>
            )}

            {/* Quick Action Buttons */}
            {pendingRequests.length > 0 && (
              <div className="mt-4 pt-4 border-t border-purple-200 flex gap-2">
                <Button 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => pendingRequests.forEach(r => onAccept?.(r.id))}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Accept All ({pendingRequests.length})
                </Button>
                <Button 
                  variant="outline"
                  className="flex-1"
                  onClick={onViewAll}
                >
                  Manage Requests
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Earnings - Medium Widget */}
        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <DollarSign className="h-6 w-6 text-green-600" />
              <Badge className="bg-green-100 text-green-800">Today</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Earnings</p>
              <p className="text-3xl font-bold text-gray-900">${todayEarnings}</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Completed</span>
                  <span className="font-medium">3 videos</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">In progress</span>
                  <span className="font-medium">2 videos</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Projected</span>
                  <span className="font-medium text-green-600">+${pendingRequests.reduce((sum, r) => sum + r.price, 0)}</span>
                </div>
              </div>
            </div>
            <Button className="w-full mt-4" variant="outline">
              View Earnings Report
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Response Deadline Alerts */}
      {urgentDeadlines > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-orange-800 font-medium">Response Required</p>
                  <p className="text-lg font-bold text-orange-900">{urgentDeadlines} urgent</p>
                </div>
                <AlertCircle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-800 font-medium">Avg Response Time</p>
                  <p className="text-lg font-bold text-blue-900">2.5 hours</p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-purple-800 font-medium">Acceptance Rate</p>
                  <p className="text-lg font-bold text-purple-900">92%</p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}