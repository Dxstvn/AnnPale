"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  MessageSquare,
  Send,
  Phone,
  Mail,
  Calendar,
  FileText,
  Award,
  Gift,
  TrendingUp,
  Users,
  Heart,
  Star,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Paperclip,
  Video,
  DollarSign,
  Target,
  Zap,
  BookOpen,
  Briefcase,
  Megaphone,
  HandshakeIcon,
  ChevronRight,
  Plus,
  Edit,
  Archive,
  RefreshCw
} from "lucide-react"

interface Communication {
  id: string
  type: "email" | "message" | "call" | "notification"
  subject: string
  content: string
  timestamp: string
  status: "sent" | "delivered" | "read" | "replied"
  direction: "inbound" | "outbound"
}

interface SupportTicket {
  id: string
  subject: string
  status: "open" | "in_progress" | "resolved" | "closed"
  priority: "low" | "medium" | "high" | "urgent"
  category: string
  createdAt: string
  lastUpdate: string
  assignedTo?: string
}

interface TrainingRecommendation {
  id: string
  title: string
  description: string
  category: string
  duration: string
  priority: "required" | "recommended" | "optional"
  completionStatus: "not_started" | "in_progress" | "completed"
  dueDate?: string
}

interface Opportunity {
  id: string
  type: "promotion" | "partnership" | "feature" | "campaign"
  title: string
  description: string
  value?: number
  status: "pending" | "offered" | "accepted" | "declined"
  expiresAt?: string
}

interface RelationshipData {
  creatorId: string
  creatorName: string
  relationshipHealth: "excellent" | "good" | "needs_attention" | "at_risk"
  engagementScore: number
  lastContact: string
  preferredContactMethod: "email" | "message" | "phone"
  communications: Communication[]
  supportTickets: SupportTicket[]
  trainingRecommendations: TrainingRecommendation[]
  opportunities: Opportunity[]
  notes: string[]
}

const mockRelationshipData: RelationshipData = {
  creatorId: "creator-001",
  creatorName: "Marie-Claire Dubois",
  relationshipHealth: "excellent",
  engagementScore: 92,
  lastContact: "2 days ago",
  preferredContactMethod: "email",
  communications: [
    {
      id: "comm-1",
      type: "email",
      subject: "Welcome to our Premium Creator Program!",
      content: "Congratulations on being selected for our premium creator program...",
      timestamp: "2 days ago",
      status: "read",
      direction: "outbound"
    },
    {
      id: "comm-2",
      type: "message",
      subject: "Quick question about pricing",
      content: "Hi, I wanted to ask about the business pricing tier...",
      timestamp: "5 days ago",
      status: "replied",
      direction: "inbound"
    },
    {
      id: "comm-3",
      type: "notification",
      subject: "New feature available",
      content: "We've launched a new scheduling feature for creators",
      timestamp: "1 week ago",
      status: "delivered",
      direction: "outbound"
    }
  ],
  supportTickets: [
    {
      id: "ticket-1",
      subject: "Video upload issue resolved",
      status: "closed",
      priority: "medium",
      category: "Technical",
      createdAt: "2 weeks ago",
      lastUpdate: "1 week ago",
      assignedTo: "Tech Support"
    },
    {
      id: "ticket-2",
      subject: "Payment processing delay",
      status: "resolved",
      priority: "high",
      category: "Financial",
      createdAt: "1 month ago",
      lastUpdate: "3 weeks ago",
      assignedTo: "Finance Team"
    }
  ],
  trainingRecommendations: [
    {
      id: "training-1",
      title: "Advanced Video Production Techniques",
      description: "Learn professional video editing and production tips",
      category: "Content Creation",
      duration: "2 hours",
      priority: "recommended",
      completionStatus: "not_started",
      dueDate: "2024-12-15"
    },
    {
      id: "training-2",
      title: "Customer Communication Best Practices",
      description: "Improve your messaging and response strategies",
      category: "Communication",
      duration: "1 hour",
      priority: "optional",
      completionStatus: "in_progress"
    }
  ],
  opportunities: [
    {
      id: "opp-1",
      type: "promotion",
      title: "Holiday Season Featured Creator",
      description: "Be featured on our homepage during the holiday season",
      value: 5000,
      status: "offered",
      expiresAt: "2024-11-30"
    },
    {
      id: "opp-2",
      type: "partnership",
      title: "Brand Ambassador Program",
      description: "Become an official Ann Pale brand ambassador",
      status: "pending",
      expiresAt: "2024-12-31"
    }
  ],
  notes: [
    "Excellent creator with consistent high-quality content",
    "Very responsive to customer messages",
    "Interested in expanding to business clients",
    "Has expressed interest in exclusive partnerships"
  ]
}

export function CreatorRelationshipManagement() {
  const [relationshipData, setRelationshipData] = useState<RelationshipData>(mockRelationshipData)
  const [selectedTab, setSelectedTab] = useState("communication")
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [composeType, setComposeType] = useState<"email" | "message">("email")
  const [newNote, setNewNote] = useState("")

  const getHealthColor = (health: string) => {
    switch (health) {
      case "excellent": return "bg-green-100 text-green-800"
      case "good": return "bg-blue-100 text-blue-800"
      case "needs_attention": return "bg-yellow-100 text-yellow-800"
      case "at_risk": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "sent": case "pending": return "bg-gray-100 text-gray-800"
      case "delivered": case "offered": return "bg-blue-100 text-blue-800"
      case "read": case "accepted": case "resolved": return "bg-green-100 text-green-800"
      case "replied": case "closed": return "bg-purple-100 text-purple-800"
      case "declined": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": case "required": return "bg-red-100 text-red-800"
      case "high": return "bg-orange-100 text-orange-800"
      case "medium": case "recommended": return "bg-yellow-100 text-yellow-800"
      case "low": case "optional": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const handleAddNote = () => {
    if (newNote.trim()) {
      setRelationshipData({
        ...relationshipData,
        notes: [...relationshipData.notes, newNote]
      })
      setNewNote("")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Relationship Management</h2>
          <p className="text-gray-600">Manage creator communications and opportunities</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setIsComposeOpen(true)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            New Message
          </Button>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Call
          </Button>
        </div>
      </div>

      {/* Relationship Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback>MC</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{relationshipData.creatorName}</h3>
                <p className="text-sm text-gray-600">Last contact: {relationshipData.lastContact}</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">Relationship Health</p>
                <Badge className={`mt-1 ${getHealthColor(relationshipData.relationshipHealth)}`}>
                  {relationshipData.relationshipHealth.replace('_', ' ')}
                </Badge>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Engagement Score</p>
                <p className="text-2xl font-bold">{relationshipData.engagementScore}%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Preferred Contact</p>
                <Badge variant="outline" className="mt-1">
                  {relationshipData.preferredContactMethod}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="communication">Communication</TabsTrigger>
          <TabsTrigger value="support">Support History</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="opportunities">Opportunities</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="communication" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Communication History</CardTitle>
              <CardDescription>All interactions and messages with the creator</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relationshipData.communications.map((comm) => (
                  <div key={comm.id} className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex-shrink-0">
                      {comm.type === "email" && <Mail className="h-5 w-5 text-gray-400" />}
                      {comm.type === "message" && <MessageSquare className="h-5 w-5 text-gray-400" />}
                      {comm.type === "call" && <Phone className="h-5 w-5 text-gray-400" />}
                      {comm.type === "notification" && <Info className="h-5 w-5 text-gray-400" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium">{comm.subject}</h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(comm.status)}>
                            {comm.status}
                          </Badge>
                          <span className="text-sm text-gray-500">{comm.timestamp}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{comm.content}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {comm.direction}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {comm.type}
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="support" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Support Ticket History</CardTitle>
              <CardDescription>Previous support requests and resolutions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relationshipData.supportTickets.map((ticket) => (
                  <div key={ticket.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{ticket.subject}</h4>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(ticket.status)}>
                          {ticket.status}
                        </Badge>
                        <Badge className={getPriorityColor(ticket.priority)}>
                          {ticket.priority}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Category:</span> {ticket.category}
                      </div>
                      <div>
                        <span className="font-medium">Created:</span> {ticket.createdAt}
                      </div>
                      <div>
                        <span className="font-medium">Updated:</span> {ticket.lastUpdate}
                      </div>
                      <div>
                        <span className="font-medium">Assigned:</span> {ticket.assignedTo || "Unassigned"}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="training" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Training & Development</CardTitle>
              <CardDescription>Recommended courses and skill development</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relationshipData.trainingRecommendations.map((training) => (
                  <div key={training.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="h-5 w-5 text-gray-400" />
                          <h4 className="font-medium">{training.title}</h4>
                          <Badge className={getPriorityColor(training.priority)}>
                            {training.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{training.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="text-gray-500">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {training.duration}
                          </span>
                          <span className="text-gray-500">Category: {training.category}</span>
                          {training.dueDate && (
                            <span className="text-gray-500">Due: {training.dueDate}</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant="outline"
                          className={
                            training.completionStatus === "completed" ? "bg-green-50" :
                            training.completionStatus === "in_progress" ? "bg-yellow-50" :
                            "bg-gray-50"
                          }
                        >
                          {training.completionStatus.replace('_', ' ')}
                        </Badge>
                        <Button size="sm" variant="outline" className="mt-2">
                          {training.completionStatus === "completed" ? "Review" : 
                           training.completionStatus === "in_progress" ? "Continue" : 
                           "Start"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Recommend New Training
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="opportunities" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Partnership & Promotion Opportunities</CardTitle>
              <CardDescription>Special offers and collaboration proposals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relationshipData.opportunities.map((opp) => (
                  <div key={opp.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {opp.type === "promotion" && <Megaphone className="h-5 w-5 text-purple-600" />}
                          {opp.type === "partnership" && <HandshakeIcon className="h-5 w-5 text-blue-600" />}
                          {opp.type === "feature" && <Star className="h-5 w-5 text-yellow-600" />}
                          {opp.type === "campaign" && <Target className="h-5 w-5 text-green-600" />}
                          <h4 className="font-medium">{opp.title}</h4>
                          <Badge className={getStatusColor(opp.status)}>
                            {opp.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{opp.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          {opp.value && (
                            <span className="font-medium text-green-600">
                              <DollarSign className="h-3 w-3 inline" />
                              {opp.value.toLocaleString()} value
                            </span>
                          )}
                          {opp.expiresAt && (
                            <span className="text-gray-500">
                              Expires: {opp.expiresAt}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        {opp.status === "offered" && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Decline</Button>
                            <Button size="sm">Accept</Button>
                          </div>
                        )}
                        {opp.status === "pending" && (
                          <Button size="sm">Send Offer</Button>
                        )}
                        {opp.status === "accepted" && (
                          <Button size="sm" variant="outline">View Details</Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Button variant="outline" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Opportunity
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Administrative Notes</CardTitle>
              <CardDescription>Internal notes and observations about the creator</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {relationshipData.notes.map((note, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm">{note}</p>
                    <p className="text-xs text-gray-500 mt-2">Added by Admin • 2 weeks ago</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                <Label>Add New Note</Label>
                <Textarea 
                  placeholder="Enter your note here..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={3}
                />
                <Button onClick={handleAddNote} disabled={!newNote.trim()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Compose Dialog */}
      <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Compose Message</DialogTitle>
            <DialogDescription>
              Send a message to {relationshipData.creatorName}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Message Type</Label>
              <Select value={composeType} onValueChange={(value: any) => setComposeType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="message">Platform Message</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Subject</Label>
              <Input placeholder="Enter message subject" />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea 
                placeholder="Type your message here..."
                rows={8}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Paperclip className="h-4 w-4 mr-2" />
                Attach File
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Use Template
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsComposeOpen(false)}>
              Cancel
            </Button>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}