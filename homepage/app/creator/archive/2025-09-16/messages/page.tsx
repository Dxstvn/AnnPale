"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  MessageCircle,
  Send,
  Archive,
  Star,
  Trash2,
  Search,
  Filter,
  MoreVertical,
  Paperclip,
  Smile,
  Clock,
  Check,
  CheckCheck,
  AlertCircle,
  Users,
  User,
  BellRing,
  Settings,
  Reply,
  Forward,
  Zap,
  FileText,
  Image as ImageIcon,
  Video,
  Mic
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

// Translations
const messageTranslations: Record<string, Record<string, string>> = {
  message_center: {
    en: "Message Center",
    fr: "Centre de messages",
    ht: "Sant mesaj"
  },
  manage_conversations: {
    en: "Manage all your fan conversations",
    fr: "Gérez toutes vos conversations avec les fans",
    ht: "Jere tout konvèsasyon ak fanatik ou yo"
  },
  inbox: {
    en: "Inbox",
    fr: "Boîte de réception",
    ht: "Bwat resepsyon"
  },
  sent: {
    en: "Sent",
    fr: "Envoyés",
    ht: "Voye"
  },
  archived: {
    en: "Archived",
    fr: "Archivés",
    ht: "Achive"
  },
  starred: {
    en: "Starred",
    fr: "Favoris",
    ht: "Favori"
  },
  all_messages: {
    en: "All Messages",
    fr: "Tous les messages",
    ht: "Tout mesaj"
  },
  unread: {
    en: "Unread",
    fr: "Non lus",
    ht: "Pa li"
  },
  booking_requests: {
    en: "Booking Requests",
    fr: "Demandes de réservation",
    ht: "Demann rezèvasyon"
  },
  support: {
    en: "Support",
    fr: "Support",
    ht: "Sipò"
  },
  type_message: {
    en: "Type a message...",
    fr: "Tapez un message...",
    ht: "Ekri yon mesaj..."
  },
  quick_replies: {
    en: "Quick Replies",
    fr: "Réponses rapides",
    ht: "Repons rapid"
  },
  automated_responses: {
    en: "Automated Responses",
    fr: "Réponses automatiques",
    ht: "Repons otomatik"
  },
  search_messages: {
    en: "Search messages...",
    fr: "Rechercher des messages...",
    ht: "Chèche mesaj..."
  },
  mark_as_read: {
    en: "Mark as read",
    fr: "Marquer comme lu",
    ht: "Make kòm li"
  }
}

// Mock data
const conversations = [
  {
    id: "1",
    user: {
      name: "Sarah Mitchell",
      avatar: "/api/placeholder/32/32",
      status: "online" as const
    },
    lastMessage: {
      text: "Thank you so much for the birthday message! My mom loved it!",
      time: new Date(Date.now() - 30 * 60 * 1000),
      unread: true,
      type: "text" as const
    },
    category: "booking",
    starred: true,
    unreadCount: 2
  },
  {
    id: "2",
    user: {
      name: "Michael Rodriguez",
      avatar: "/api/placeholder/32/32",
      status: "offline" as const
    },
    lastMessage: {
      text: "When will my video be ready?",
      time: new Date(Date.now() - 2 * 60 * 60 * 1000),
      unread: true,
      type: "text" as const
    },
    category: "support",
    starred: false,
    unreadCount: 1
  },
  {
    id: "3",
    user: {
      name: "Lisa Kim",
      avatar: "/api/placeholder/32/32",
      status: "away" as const
    },
    lastMessage: {
      text: "Perfect! Looking forward to it.",
      time: new Date(Date.now() - 5 * 60 * 60 * 1000),
      unread: false,
      type: "text" as const
    },
    category: "booking",
    starred: false,
    unreadCount: 0
  },
  {
    id: "4",
    user: {
      name: "John Davis",
      avatar: "/api/placeholder/32/32",
      status: "online" as const
    },
    lastMessage: {
      text: "Can you do a wedding congratulations video?",
      time: new Date(Date.now() - 24 * 60 * 60 * 1000),
      unread: false,
      type: "text" as const
    },
    category: "booking",
    starred: true,
    unreadCount: 0
  }
]

const messageTemplates = [
  {
    id: "1",
    title: "Booking Confirmation",
    content: "Thank you for your booking! I'll create your personalized video within 24-48 hours.",
    category: "booking"
  },
  {
    id: "2",
    title: "Video Delivered",
    content: "Your video is ready! I hope your loved one enjoys this special message.",
    category: "delivery"
  },
  {
    id: "3",
    title: "Thank You",
    content: "Thank you so much for your support! It means the world to me.",
    category: "general"
  },
  {
    id: "4",
    title: "Revision Request",
    content: "I'd be happy to make those changes for you. Please give me 24 hours to update the video.",
    category: "support"
  }
]

const currentConversationMessages = [
  {
    id: "1",
    sender: "user",
    text: "Hi! I'd love to book a birthday message for my mom.",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    status: "read" as const
  },
  {
    id: "2",
    sender: "creator",
    text: "Hello! I'd be happy to create a birthday message for your mom. Could you tell me her name and anything special you'd like me to mention?",
    time: new Date(Date.now() - 90 * 60 * 1000),
    status: "read" as const
  },
  {
    id: "3",
    sender: "user",
    text: "Her name is Marie, and she's turning 60. She's a huge fan of your music!",
    time: new Date(Date.now() - 60 * 60 * 1000),
    status: "read" as const
  },
  {
    id: "4",
    sender: "creator",
    text: "That's wonderful! I'll make sure to create something special for Marie's 60th birthday. Expect the video within 24 hours!",
    time: new Date(Date.now() - 45 * 60 * 1000),
    status: "delivered" as const
  },
  {
    id: "5",
    sender: "user",
    text: "Thank you so much for the birthday message! My mom loved it!",
    time: new Date(Date.now() - 30 * 60 * 1000),
    status: "delivered" as const
  }
]

export default function MessagesPage() {
  const { language } = useLanguage()
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [messageText, setMessageText] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState("all")
  
  const t = (key: string) => {
    return messageTranslations[key]?.[language] || messageTranslations[key]?.en || key
  }
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "online": return "bg-green-500"
      case "away": return "bg-yellow-500"
      case "offline": return "bg-gray-400"
      default: return "bg-gray-400"
    }
  }
  
  const getMessageStatus = (status: string) => {
    switch (status) {
      case "sent": return <Check className="h-3 w-3 text-gray-400" />
      case "delivered": return <CheckCheck className="h-3 w-3 text-gray-400" />
      case "read": return <CheckCheck className="h-3 w-3 text-blue-500" />
      default: return null
    }
  }
  
  const getCategoryBadge = (category: string) => {
    const config = {
      booking: { label: "Booking", className: "bg-purple-100 text-purple-700" },
      support: { label: "Support", className: "bg-blue-100 text-blue-700" },
      general: { label: "General", className: "bg-gray-100 text-gray-700" }
    }
    const categoryConfig = config[category as keyof typeof config]
    return categoryConfig ? (
      <Badge className={categoryConfig.className}>{categoryConfig.label}</Badge>
    ) : null
  }
  
  const sendMessage = () => {
    if (!messageText.trim()) return
    console.log("Sending message:", messageText)
    setMessageText("")
  }
  
  const handleTemplateSelect = (template: typeof messageTemplates[0]) => {
    setMessageText(template.content)
    setIsTemplateDialogOpen(false)
  }
  
  const filteredConversations = conversations.filter(conv => {
    if (activeTab === "unread" && conv.unreadCount === 0) return false
    if (activeTab === "starred" && !conv.starred) return false
    if (filterCategory !== "all" && conv.category !== filterCategory) return false
    if (searchQuery && !conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })
  
  const totalUnread = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0)
  
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('message_center')}</h1>
            <p className="text-gray-600 mt-1">{t('manage_conversations')}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                  <Zap className="h-4 w-4 mr-2" />
                  {t('quick_replies')}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{t('quick_replies')}</DialogTitle>
                  <DialogDescription>
                    Select a template to quickly respond to common messages
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3 py-4">
                  {messageTemplates.map((template) => (
                    <div
                      key={template.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">{template.title}</p>
                          <p className="text-sm text-gray-600 mt-1">{template.content}</p>
                        </div>
                        {getCategoryBadge(template.category)}
                      </div>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold">324</p>
            </div>
            <MessageCircle className="h-8 w-8 text-purple-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unread</p>
              <p className="text-2xl font-bold">{totalUnread}</p>
            </div>
            <BellRing className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Response Time</p>
              <p className="text-2xl font-bold">2h</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Response Rate</p>
              <p className="text-2xl font-bold">98%</p>
            </div>
            <CheckCheck className="h-8 w-8 text-green-600" />
          </div>
        </Card>
      </div>
      
      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conversation List */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder={t('search_messages')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-[120px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="booking">Booking</SelectItem>
                    <SelectItem value="support">Support</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">{t('all_messages')}</TabsTrigger>
                  <TabsTrigger value="unread">
                    {t('unread')}
                    {totalUnread > 0 && (
                      <Badge className="ml-2 h-5 px-1" variant="destructive">
                        {totalUnread}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="starred">{t('starred')}</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[600px]">
              {filteredConversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={cn(
                    "p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors",
                    selectedConversation?.id === conversation.id && "bg-purple-50"
                  )}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={conversation.user.avatar} />
                        <AvatarFallback>{conversation.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
                        getStatusColor(conversation.user.status)
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">{conversation.user.name}</p>
                            {conversation.starred && (
                              <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            )}
                          </div>
                          <p className={cn(
                            "text-sm mt-1 truncate",
                            conversation.lastMessage.unread ? "text-gray-900 font-medium" : "text-gray-600"
                          )}>
                            {conversation.lastMessage.text}
                          </p>
                        </div>
                        <div className="text-right ml-2">
                          <p className="text-xs text-gray-500">
                            {format(conversation.lastMessage.time, 'h:mm a')}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <Badge className="mt-1" variant="destructive">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
        </Card>
        
        {/* Message Thread */}
        <Card className="lg:col-span-2">
          {selectedConversation ? (
            <>
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={selectedConversation.user.avatar} />
                        <AvatarFallback>{selectedConversation.user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className={cn(
                        "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
                        getStatusColor(selectedConversation.user.status)
                      )} />
                    </div>
                    <div>
                      <p className="font-medium">{selectedConversation.user.name}</p>
                      <p className="text-sm text-gray-500 capitalize">{selectedConversation.user.status}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getCategoryBadge(selectedConversation.category)}
                    <Button variant="ghost" size="sm">
                      <Star className={cn(
                        "h-4 w-4",
                        selectedConversation.starred && "text-yellow-500 fill-yellow-500"
                      )} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[450px] p-4">
                  <div className="space-y-4">
                    {currentConversationMessages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          "flex",
                          message.sender === "creator" ? "justify-end" : "justify-start"
                        )}
                      >
                        <div className={cn(
                          "max-w-[70%] rounded-lg p-3",
                          message.sender === "creator"
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                            : "bg-gray-100"
                        )}>
                          <p className="text-sm">{message.text}</p>
                          <div className={cn(
                            "flex items-center gap-1 mt-1",
                            message.sender === "creator" ? "justify-end" : "justify-start"
                          )}>
                            <p className={cn(
                              "text-xs",
                              message.sender === "creator" ? "text-white/70" : "text-gray-500"
                            )}>
                              {format(message.time, 'h:mm a')}
                            </p>
                            {message.sender === "creator" && getMessageStatus(message.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="border-t p-4">
                  <div className="flex items-end gap-2">
                    <Button variant="ghost" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <div className="flex-1">
                      <Textarea
                        placeholder={t('type_message')}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault()
                            sendMessage()
                          }
                        }}
                        className="min-h-[40px] max-h-[120px] resize-none"
                        rows={1}
                      />
                    </div>
                    <Button variant="ghost" size="sm">
                      <Smile className="h-4 w-4" />
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      onClick={sendMessage}
                      disabled={!messageText.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Button variant="ghost" size="sm" className="text-xs">
                      <ImageIcon className="h-3 w-3 mr-1" />
                      Photo
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Video className="h-3 w-3 mr-1" />
                      Video
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <Mic className="h-3 w-3 mr-1" />
                      Voice
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs">
                      <FileText className="h-3 w-3 mr-1" />
                      File
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </Card>
      </div>
      
      {/* Automated Response Alert */}
      <Alert className="mt-6">
        <Zap className="h-4 w-4" />
        <AlertDescription>
          <strong>Pro Tip:</strong> Set up automated responses for common questions to save time and maintain quick response times.
          You currently have 4 templates configured.
        </AlertDescription>
      </Alert>
    </div>
  )
}