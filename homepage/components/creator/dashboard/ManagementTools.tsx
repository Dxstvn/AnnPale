"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { 
  Calendar,
  MessageCircle,
  FolderOpen,
  CheckSquare,
  Search,
  Filter,
  Send,
  Paperclip,
  Video,
  Image,
  Users,
  Archive,
  Star,
  Clock,
  ChevronRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarEvent {
  id: number
  time: string
  title: string
  type: 'recording' | 'deadline' | 'meeting'
  priority: 'high' | 'medium' | 'low'
}

interface Message {
  id: number
  sender: string
  preview: string
  time: string
  unread: boolean
  type: 'customer' | 'support' | 'system'
}

interface ContentItem {
  id: number
  name: string
  type: 'video' | 'template' | 'script'
  size: string
  lastModified: string
  tags: string[]
}

interface ManagementToolsProps {
  todayEvents: CalendarEvent[]
  recentMessages: Message[]
  contentLibrary: ContentItem[]
  onScheduleEvent?: () => void
  onSendMessage?: (message: string) => void
  onBulkAction?: (action: string, items: number[]) => void
}

export function ManagementTools({
  todayEvents,
  recentMessages,
  contentLibrary,
  onScheduleEvent,
  onSendMessage,
  onBulkAction
}: ManagementToolsProps) {
  const [selectedRequests, setSelectedRequests] = useState<number[]>([])
  const [messageText, setMessageText] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const handleBulkSelect = (id: number) => {
    setSelectedRequests(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  const filteredContent = contentLibrary.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Management Tools</h2>
        <p className="text-sm text-gray-600">Streamline your workflow and content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calendar View */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today's Schedule
              </CardTitle>
              <Button size="sm" onClick={onScheduleEvent}>
                Add Event
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {todayEvents.map((event) => (
                <div 
                  key={event.id} 
                  className={cn(
                    "p-3 rounded-lg border-l-4 bg-gray-50",
                    event.priority === 'high' ? "border-red-500" :
                    event.priority === 'medium' ? "border-yellow-500" :
                    "border-green-500"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">
                      {event.time}
                    </span>
                    <Badge 
                      variant="outline"
                      className={cn(
                        event.type === 'recording' ? "text-purple-700 border-purple-300" :
                        event.type === 'deadline' ? "text-red-700 border-red-300" :
                        "text-blue-700 border-blue-300"
                      )}
                    >
                      {event.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{event.title}</p>
                </div>
              ))}
              {todayEvents.length === 0 && (
                <div className="text-center py-6 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No events scheduled</p>
                  <Button size="sm" variant="ghost" className="mt-2" onClick={onScheduleEvent}>
                    Schedule your day
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Message Center */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Message Center
              {recentMessages.filter(m => m.unread).length > 0 && (
                <Badge className="bg-red-600">
                  {recentMessages.filter(m => m.unread).length}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              {recentMessages.slice(0, 4).map((message) => (
                <div 
                  key={message.id} 
                  className={cn(
                    "p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors",
                    message.unread ? "bg-blue-50 border-l-4 border-blue-500" : "bg-gray-50"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn(
                      "text-sm font-medium",
                      message.unread ? "text-blue-900" : "text-gray-900"
                    )}>
                      {message.sender}
                    </span>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                      >
                        {message.type}
                      </Badge>
                      <span className="text-xs text-gray-500">{message.time}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 truncate">{message.preview}</p>
                </div>
              ))}
            </div>

            {/* Quick Reply */}
            <div className="border-t pt-4">
              <div className="flex gap-2">
                <Textarea
                  placeholder="Type a quick reply..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  className="flex-1 min-h-[60px] resize-none"
                />
                <div className="flex flex-col gap-1">
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    className="h-8 w-8 p-0"
                    onClick={() => {
                      onSendMessage?.(messageText)
                      setMessageText("")
                    }}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bulk Operations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Bulk Operations
            </CardTitle>
            {selectedRequests.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  {selectedRequests.length} selected
                </span>
                <Button size="sm" variant="outline" onClick={() => setSelectedRequests([])}>
                  Clear
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            <Button 
              variant="outline" 
              className="w-full"
              disabled={selectedRequests.length === 0}
              onClick={() => onBulkAction?.('accept', selectedRequests)}
            >
              <CheckSquare className="h-4 w-4 mr-2" />
              Accept All
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              disabled={selectedRequests.length === 0}
              onClick={() => onBulkAction?.('decline', selectedRequests)}
            >
              <Users className="h-4 w-4 mr-2" />
              Decline All
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              disabled={selectedRequests.length === 0}
              onClick={() => onBulkAction?.('message', selectedRequests)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Message All
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              disabled={selectedRequests.length === 0}
              onClick={() => onBulkAction?.('archive', selectedRequests)}
            >
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          </div>

          {/* Sample Request List for Bulk Actions */}
          <div className="border rounded-lg">
            <div className="p-3 border-b bg-gray-50">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRequests([1, 2, 3, 4])
                    } else {
                      setSelectedRequests([])
                    }
                  }}
                  className="rounded"
                />
                <span className="text-sm font-medium">Select All Pending</span>
              </div>
            </div>
            {[1, 2, 3, 4].map((id) => (
              <div key={id} className="p-3 border-b last:border-b-0 flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={selectedRequests.includes(id)}
                  onChange={() => handleBulkSelect(id)}
                  className="rounded"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">Birthday message for Sarah</p>
                  <p className="text-xs text-gray-500">From Marie L. • Due in 6 hours</p>
                </div>
                <Badge variant="outline">$85</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Library */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Content Library
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button size="sm" variant="outline">
                <Filter className="h-4 w-4 mr-1" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredContent.map((item) => (
              <div key={item.id} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center",
                    item.type === 'video' ? "bg-purple-100" :
                    item.type === 'template' ? "bg-blue-100" :
                    "bg-green-100"
                  )}>
                    {item.type === 'video' ? (
                      <Video className="h-5 w-5 text-purple-600" />
                    ) : item.type === 'template' ? (
                      <Image className="h-5 w-5 text-blue-600" />
                    ) : (
                      <Star className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.size} • {item.lastModified}</p>
                    <div className="flex gap-1 mt-1">
                      {item.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}