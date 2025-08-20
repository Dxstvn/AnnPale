"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  CheckSquare, 
  Users, 
  MessageCircle, 
  CheckCircle, 
  XCircle,
  Clock,
  Send,
  Archive,
  Calendar,
  DollarSign,
  Zap,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

interface BatchOperation {
  id: string
  label: string
  icon: React.ElementType
  description: string
  psychologyTip: string
  color: string
  requiresMessage?: boolean
  actionType: 'accept' | 'decline' | 'message' | 'reschedule' | 'archive'
}

interface BatchOperationsProps {
  selectedCount: number
  selectedRequests: number[]
  onBatchAction: (action: string, data?: any) => void
  onSelectAll: () => void
  onClearSelection: () => void
  availabilitySlots?: string[]
}

export function BatchOperations({
  selectedCount,
  selectedRequests,
  onBatchAction,
  onSelectAll,
  onClearSelection,
  availabilitySlots = []
}: BatchOperationsProps) {
  const [customMessage, setCustomMessage] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const [selectedAvailability, setSelectedAvailability] = useState('')

  const batchOperations: BatchOperation[] = [
    {
      id: 'accept-all',
      label: 'Accept All',
      icon: CheckCircle,
      description: 'Accept all selected requests',
      psychologyTip: 'Creates positive momentum and reduces decision fatigue',
      color: 'bg-green-600 hover:bg-green-700 text-white',
      actionType: 'accept'
    },
    {
      id: 'accept-with-message',
      label: 'Accept with Message',
      icon: MessageCircle,
      description: 'Accept and send personalized message',
      psychologyTip: 'Builds stronger customer relationships',
      color: 'bg-blue-600 hover:bg-blue-700 text-white',
      requiresMessage: true,
      actionType: 'accept'
    },
    {
      id: 'decline-polite',
      label: 'Decline Politely',
      icon: XCircle,
      description: 'Decline with template response',
      psychologyTip: 'Maintains reputation while managing workload',
      color: 'bg-red-600 hover:bg-red-700 text-white',
      requiresMessage: true,
      actionType: 'decline'
    },
    {
      id: 'message-only',
      label: 'Send Message',
      icon: Send,
      description: 'Message without state change',
      psychologyTip: 'Clarify details before committing',
      color: 'bg-purple-600 hover:bg-purple-700 text-white',
      requiresMessage: true,
      actionType: 'message'
    },
    {
      id: 'set-availability',
      label: 'Set Availability',
      icon: Calendar,
      description: 'Propose alternative timeline',
      psychologyTip: 'Offers compromise instead of rejection',
      color: 'bg-orange-600 hover:bg-orange-700 text-white',
      actionType: 'reschedule'
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: Archive,
      description: 'Move to archive',
      psychologyTip: 'Clean workspace for better focus',
      color: 'bg-gray-600 hover:bg-gray-700 text-white',
      actionType: 'archive'
    }
  ]

  const messageTemplates = [
    {
      id: 'accept-standard',
      label: 'Standard Acceptance',
      content: 'Thanks for choosing me! I\'m excited to create something special for {recipient}. I\'ll get started right away and deliver within the agreed timeframe.'
    },
    {
      id: 'accept-rush',
      label: 'Rush Order Acceptance',
      content: 'I can definitely help with this rush request for {recipient}! Due to the tight timeline, I\'ll prioritize this and have it ready for you soon.'
    },
    {
      id: 'decline-busy',
      label: 'Decline - Too Busy',
      content: 'Thank you for thinking of me for {recipient}\'s {occasion}. Unfortunately, I\'m fully booked and wouldn\'t be able to give this the attention it deserves. I hope you find someone perfect for this special moment!'
    },
    {
      id: 'decline-not-fit',
      label: 'Decline - Not Right Fit',
      content: 'I appreciate you reaching out! While this sounds like a wonderful {occasion} for {recipient}, I don\'t think I\'m the right fit for this particular request. I hope you find the perfect creator!'
    },
    {
      id: 'clarification',
      label: 'Need Clarification',
      content: 'Hi! I\'d love to help with {recipient}\'s {occasion}. Could you provide a bit more detail about what you\'re looking for? This will help me create the perfect message!'
    },
    {
      id: 'availability',
      label: 'Alternative Timeline',
      content: 'Thanks for your request! I\'m currently booked until {date}, but I\'d love to help with {recipient}\'s {occasion} if you can wait a bit longer. Let me know if this works!'
    }
  ]

  const handleBatchAction = (operation: BatchOperation) => {
    const data: any = {}
    
    if (operation.requiresMessage) {
      if (selectedTemplate) {
        const template = messageTemplates.find(t => t.id === selectedTemplate)
        data.message = template?.content || customMessage
      } else {
        data.message = customMessage
      }
    }
    
    if (operation.actionType === 'reschedule' && selectedAvailability) {
      data.availability = selectedAvailability
    }
    
    onBatchAction(operation.id, data)
  }

  const psychologyInsights = [
    {
      icon: Zap,
      title: 'Batch Processing Benefits',
      description: 'Reduces decision fatigue by 60% and increases productivity',
      color: 'text-blue-600'
    },
    {
      icon: Clock,
      title: 'Optimal Timing',
      description: 'Handle batches during your peak energy hours for better decisions',
      color: 'text-purple-600'
    },
    {
      icon: Users,
      title: 'Customer Psychology',
      description: 'Quick responses (even declines) build trust and professionalism',
      color: 'text-green-600'
    }
  ]

  if (selectedCount === 0) {
    return (
      <Card className="bg-gray-50 border-gray-200">
        <CardContent className="p-6 text-center">
          <CheckSquare className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <h3 className="font-medium text-gray-900 mb-2">Batch Operations</h3>
          <p className="text-gray-600 text-sm mb-4">
            Select multiple requests to enable bulk actions
          </p>
          <Button variant="outline" onClick={onSelectAll}>
            Select All Pending
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-purple-600" />
            Batch Operations
            <Badge className="bg-purple-600">
              {selectedCount} selected
            </Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClearSelection}>
            Clear Selection
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Quick Actions */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {batchOperations.map((operation) => {
              const Icon = operation.icon
              return (
                <Button
                  key={operation.id}
                  onClick={() => handleBatchAction(operation)}
                  className={cn(
                    "h-auto p-3 flex flex-col items-center gap-2",
                    operation.color
                  )}
                  disabled={operation.requiresMessage && !customMessage && !selectedTemplate}
                >
                  <Icon className="h-5 w-5" />
                  <div className="text-center">
                    <div className="text-xs font-medium">{operation.label}</div>
                    <div className="text-xs opacity-80 mt-1">{operation.description}</div>
                  </div>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Message Templates */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Message Templates</h3>
          <div className="space-y-3">
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a template..." />
              </SelectTrigger>
              <SelectContent>
                {messageTemplates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    {template.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Textarea
              placeholder="Or write a custom message..."
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
              className="min-h-[80px]"
            />
            
            {selectedTemplate && (
              <div className="bg-white rounded-lg p-3 border">
                <p className="text-sm text-gray-700">
                  {messageTemplates.find(t => t.id === selectedTemplate)?.content}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Availability Slots (for rescheduling) */}
        {availabilitySlots.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Available Slots</h3>
            <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
              <SelectTrigger>
                <SelectValue placeholder="Select availability..." />
              </SelectTrigger>
              <SelectContent>
                {availabilitySlots.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Psychology Insights */}
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
            <AlertCircle className="h-4 w-4" />
            Batch Processing Psychology
          </h3>
          <div className="space-y-3">
            {psychologyInsights.map((insight, index) => {
              const Icon = insight.icon
              return (
                <div key={index} className="flex items-start gap-3">
                  <Icon className={cn("h-4 w-4 mt-0.5", insight.color)} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{insight.title}</p>
                    <p className="text-xs text-gray-600">{insight.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Action Summary */}
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-900">
                Ready to process {selectedCount} requests
              </p>
              <p className="text-xs text-purple-700">
                This will affect {selectedCount} customers and clear your pending queue
              </p>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-bold text-green-600">
                ${selectedRequests.length * 85} potential
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}