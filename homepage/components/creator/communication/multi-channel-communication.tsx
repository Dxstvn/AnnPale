"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  MessageCircle,
  Share2,
  Settings,
  Search,
  Filter,
  MoreVertical,
  Send,
  Paperclip,
  Smile,
  Clock,
  CheckCheck,
  AlertCircle,
  Inbox,
  Archive,
  Star,
  Trash2,
  Users,
  Bot,
  Zap,
  Link,
  Hash,
  Globe,
  Bell,
  ChevronRight,
  ExternalLink,
  Reply,
  Forward
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface Channel {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  enabled: boolean
  unreadCount: number
  useCase: string
  responseTime: string
  formality: string
  automation: "High" | "Medium" | "Low"
}

interface Message {
  id: string
  channelId: string
  sender: string
  senderAvatar?: string
  content: string
  timestamp: string
  read: boolean
  starred: boolean
  attachments?: string[]
  conversationId: string
  sentiment?: "positive" | "neutral" | "negative"
  priority?: "urgent" | "high" | "normal" | "low"
}

interface Conversation {
  id: string
  participant: string
  avatar?: string
  lastMessage: string
  timestamp: string
  unread: number
  channels: string[]
  status: "active" | "waiting" | "resolved"
  priority: "urgent" | "high" | "normal" | "low"
  tags: string[]
}

export function MultiChannelCommunication() {
  const [activeChannel, setActiveChannel] = useState("all")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [showSettings, setShowSettings] = useState(false)

  // Mock data for channels
  const channels: Channel[] = [
    {
      id: "platform",
      name: "Platform Messages",
      icon: <MessageSquare className="w-4 h-4" />,
      color: "purple",
      enabled: true,
      unreadCount: 12,
      useCase: "Primary",
      responseTime: "Real-time",
      formality: "Professional",
      automation: "High"
    },
    {
      id: "email",
      name: "Email",
      icon: <Mail className="w-4 h-4" />,
      color: "blue",
      enabled: true,
      unreadCount: 5,
      useCase: "Notifications",
      responseTime: "Hours",
      formality: "Formal",
      automation: "Medium"
    },
    {
      id: "sms",
      name: "SMS",
      icon: <Phone className="w-4 h-4" />,
      color: "green",
      enabled: true,
      unreadCount: 3,
      useCase: "Urgent only",
      responseTime: "Minutes",
      formality: "Brief",
      automation: "Low"
    },
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: <MessageCircle className="w-4 h-4" />,
      color: "emerald",
      enabled: true,
      unreadCount: 8,
      useCase: "International",
      responseTime: "Hours",
      formality: "Casual",
      automation: "Medium"
    },
    {
      id: "social",
      name: "Social DMs",
      icon: <Share2 className="w-4 h-4" />,
      color: "pink",
      enabled: true,
      unreadCount: 15,
      useCase: "Public relations",
      responseTime: "Daily",
      formality: "Friendly",
      automation: "Low"
    }
  ]

  // Mock conversations
  const conversations: Conversation[] = [
    {
      id: "1",
      participant: "Marie Joseph",
      avatar: "https://i.pravatar.cc/150?img=1",
      lastMessage: "Mwen ta renmen yon videyo pou anivèsè mwen",
      timestamp: "2 min ago",
      unread: 2,
      channels: ["platform", "whatsapp"],
      status: "active",
      priority: "high",
      tags: ["birthday", "custom"]
    },
    {
      id: "2",
      participant: "Jean Baptiste",
      avatar: "https://i.pravatar.cc/150?img=2",
      lastMessage: "Is it possible to get a business shoutout?",
      timestamp: "15 min ago",
      unread: 0,
      channels: ["email"],
      status: "waiting",
      priority: "normal",
      tags: ["business", "shoutout"]
    },
    {
      id: "3",
      participant: "Sophia Laurent",
      avatar: "https://i.pravatar.cc/150?img=3",
      lastMessage: "Urgent: Need video by tomorrow!",
      timestamp: "1 hour ago",
      unread: 1,
      channels: ["sms", "platform"],
      status: "active",
      priority: "urgent",
      tags: ["rush", "deadline"]
    },
    {
      id: "4",
      participant: "Pierre Michel",
      avatar: "https://i.pravatar.cc/150?img=4",
      lastMessage: "Merci pour la vidéo! C'était parfait! 🎉",
      timestamp: "3 hours ago",
      unread: 0,
      channels: ["social"],
      status: "resolved",
      priority: "low",
      tags: ["completed", "satisfied"]
    },
    {
      id: "5",
      participant: "Anna Claire",
      avatar: "https://i.pravatar.cc/150?img=5",
      lastMessage: "Can we schedule a call to discuss?",
      timestamp: "5 hours ago",
      unread: 1,
      channels: ["whatsapp", "email"],
      status: "waiting",
      priority: "normal",
      tags: ["call", "discussion"]
    }
  ]

  // Mock messages for selected conversation
  const messages: Message[] = [
    {
      id: "1",
      channelId: "platform",
      sender: "Marie Joseph",
      senderAvatar: "https://i.pravatar.cc/150?img=1",
      content: "Bonjou! Mwen ta renmen yon videyo pou anivèsè mwen",
      timestamp: "10:30 AM",
      read: true,
      starred: false,
      conversationId: "1",
      sentiment: "positive"
    },
    {
      id: "2",
      channelId: "platform",
      sender: "You",
      content: "Bonjou Marie! Mwen kontan ou kontakte m. Ki kalite mesaj ou ta renmen?",
      timestamp: "10:35 AM",
      read: true,
      starred: false,
      conversationId: "1"
    },
    {
      id: "3",
      channelId: "whatsapp",
      sender: "Marie Joseph",
      senderAvatar: "https://i.pravatar.cc/150?img=1",
      content: "Yon mesaj enkourajanman pou pitit gason mwen ki gradye",
      timestamp: "10:40 AM",
      read: true,
      starred: true,
      conversationId: "1",
      sentiment: "positive"
    }
  ]

  const totalUnread = channels.reduce((sum, channel) => sum + channel.unreadCount, 0)

  const filteredConversations = conversations.filter(conv => {
    if (activeChannel === "all") return true
    return conv.channels.includes(activeChannel)
  })

  const selectedConv = conversations.find(c => c.id === selectedConversation)

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Inbox className="w-8 h-8 text-purple-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">{totalUnread}</p>
                <p className="text-xs text-gray-500">Unread</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Clock className="w-8 h-8 text-blue-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">3.2h</p>
                <p className="text-xs text-gray-500">Avg Response</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Users className="w-8 h-8 text-green-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">127</p>
                <p className="text-xs text-gray-500">Active Chats</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Bot className="w-8 h-8 text-orange-600" />
              <div className="text-right">
                <p className="text-2xl font-bold">42%</p>
                <p className="text-xs text-gray-500">Automated</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <Star className="w-8 h-8 text-yellow-500" />
              <div className="text-right">
                <p className="text-2xl font-bold">4.8</p>
                <p className="text-xs text-gray-500">Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Tabs & Conversations List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Channel Tabs */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Channels</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowSettings(!showSettings)}
                >
                  <Settings className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={activeChannel} onValueChange={setActiveChannel}>
                <TabsList className="grid grid-cols-3 h-auto">
                  <TabsTrigger value="all" className="flex-col gap-1 h-auto py-2">
                    <div className="flex items-center gap-1">
                      <Inbox className="w-4 h-4" />
                      <span className="text-xs">All</span>
                    </div>
                    {totalUnread > 0 && (
                      <Badge variant="destructive" className="h-5 px-1">
                        {totalUnread}
                      </Badge>
                    )}
                  </TabsTrigger>
                  {channels.slice(0, 2).map(channel => (
                    <TabsTrigger 
                      key={channel.id} 
                      value={channel.id}
                      className="flex-col gap-1 h-auto py-2"
                    >
                      <div className="flex items-center gap-1">
                        {channel.icon}
                        <span className="text-xs">{channel.name.split(' ')[0]}</span>
                      </div>
                      {channel.unreadCount > 0 && (
                        <Badge variant="secondary" className="h-5 px-1">
                          {channel.unreadCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Secondary channel tabs */}
                <div className="flex gap-2 mt-2">
                  {channels.slice(2).map(channel => (
                    <Button
                      key={channel.id}
                      variant={activeChannel === channel.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setActiveChannel(channel.id)}
                      className="flex-1"
                    >
                      {channel.icon}
                      <span className="ml-1 text-xs">{channel.name.split(' ')[0]}</span>
                      {channel.unreadCount > 0 && (
                        <Badge variant="secondary" className="ml-1 h-4 px-1">
                          {channel.unreadCount}
                        </Badge>
                      )}
                    </Button>
                  ))}
                </div>
              </Tabs>
            </CardContent>
          </Card>

          {/* Conversations List */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button variant="ghost" size="icon">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                {filteredConversations.map((conversation) => (
                  <motion.div
                    key={conversation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedConversation === conversation.id ? 'bg-purple-50' : ''
                    }`}
                    onClick={() => setSelectedConversation(conversation.id)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={conversation.avatar} />
                        <AvatarFallback>
                          {conversation.participant.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-sm truncate">
                            {conversation.participant}
                          </p>
                          <span className="text-xs text-gray-500">
                            {conversation.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mb-2">
                          {conversation.lastMessage}
                        </p>
                        <div className="flex items-center gap-2">
                          {conversation.priority === "urgent" && (
                            <Badge variant="destructive" className="h-5">
                              Urgent
                            </Badge>
                          )}
                          {conversation.unread > 0 && (
                            <Badge variant="default" className="h-5">
                              {conversation.unread}
                            </Badge>
                          )}
                          <div className="flex gap-1">
                            {conversation.channels.map(ch => {
                              const channel = channels.find(c => c.id === ch)
                              return channel ? (
                                <div key={ch} className="text-gray-400">
                                  {channel.icon}
                                </div>
                              ) : null
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Conversation View */}
        <div className="lg:col-span-2">
          <Card className="h-[700px] flex flex-col">
            {selectedConv ? (
              <>
                {/* Conversation Header */}
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={selectedConv.avatar} />
                        <AvatarFallback>
                          {selectedConv.participant.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{selectedConv.participant}</h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Active {selectedConv.timestamp}
                          </span>
                          <span>•</span>
                          <span className="flex gap-1">
                            {selectedConv.channels.map(ch => {
                              const channel = channels.find(c => c.id === ch)
                              return channel ? (
                                <span key={ch} className="flex items-center gap-1">
                                  {channel.icon}
                                </span>
                              ) : null
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon">
                        <Phone className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Link className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 overflow-y-auto p-4">
                  <div className="space-y-4">
                    {messages.filter(m => m.conversationId === selectedConversation).map(message => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`flex gap-2 max-w-[70%] ${message.sender === "You" ? "flex-row-reverse" : ""}`}>
                          {message.sender !== "You" && (
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={message.senderAvatar} />
                              <AvatarFallback>
                                {message.sender.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className={`space-y-1 ${message.sender === "You" ? "items-end" : ""}`}>
                            <div className={`rounded-lg px-3 py-2 ${
                              message.sender === "You" 
                                ? "bg-purple-600 text-white" 
                                : "bg-gray-100 text-gray-900"
                            }`}>
                              <p className="text-sm">{message.content}</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <span>{message.timestamp}</span>
                              {message.sender === "You" && message.read && (
                                <CheckCheck className="w-3 h-3" />
                              )}
                              {message.starred && (
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              )}
                              <Badge variant="outline" className="h-4 text-[10px]">
                                {channels.find(c => c.id === message.channelId)?.name}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>

                {/* Message Input */}
                <CardContent className="border-t p-4">
                  <div className="flex items-end gap-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Textarea
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="flex-1 min-h-[40px] max-h-[120px] resize-none"
                      rows={1}
                    />
                    <Button variant="ghost" size="icon">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Button size="icon">
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>

      {/* Channel Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-6">Channel Settings</h2>
                
                <div className="space-y-6">
                  {channels.map(channel => (
                    <Card key={channel.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-${channel.color}-100`}>
                              {channel.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold">{channel.name}</h3>
                              <p className="text-sm text-gray-500">{channel.useCase}</p>
                            </div>
                          </div>
                          <Switch defaultChecked={channel.enabled} />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <Label className="text-gray-500">Response Time</Label>
                            <p className="font-medium">{channel.responseTime}</p>
                          </div>
                          <div>
                            <Label className="text-gray-500">Formality</Label>
                            <p className="font-medium">{channel.formality}</p>
                          </div>
                          <div>
                            <Label className="text-gray-500">Automation Level</Label>
                            <Badge variant={
                              channel.automation === "High" ? "default" : 
                              channel.automation === "Medium" ? "secondary" : "outline"
                            }>
                              {channel.automation}
                            </Badge>
                          </div>
                          <div>
                            <Label className="text-gray-500">Unread Messages</Label>
                            <p className="font-medium">{channel.unreadCount}</p>
                          </div>
                        </div>
                        
                        <Separator className="my-4" />
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label>Auto-response</Label>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Priority routing</Label>
                            <Switch />
                          </div>
                          <div className="flex items-center justify-between">
                            <Label>Notifications</Label>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="outline" onClick={() => setShowSettings(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setShowSettings(false)}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}