"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { 
  MessageSquare,
  Send,
  Mic,
  Camera,
  Paperclip,
  Archive,
  Star,
  Bell,
  BellOff,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Clock,
  CheckCheck,
  Wifi,
  WifiOff,
  Download,
  Upload,
  Volume2,
  Vibrate,
  Moon,
  Sun,
  MapPin,
  Image,
  Video,
  FileText,
  Smile,
  MoreVertical,
  Reply,
  Forward,
  Trash2,
  Flag,
  Phone,
  Zap,
  User,
  Settings,
  Inbox,
  Users,
  Heart,
  ThumbsUp,
  AlertCircle,
  X,
  ArrowLeft
} from "lucide-react"
import { motion, AnimatePresence, useMotionValue, useTransform, PanInfo } from "framer-motion"

interface Message {
  id: string
  sender: string
  avatar?: string
  content: string
  timestamp: string
  read: boolean
  starred: boolean
  type: "text" | "voice" | "image" | "video"
  attachments?: string[]
  offline?: boolean
  sending?: boolean
}

interface Conversation {
  id: string
  participant: string
  avatar?: string
  lastMessage: string
  timestamp: string
  unread: number
  priority: "high" | "normal" | "low"
  starred: boolean
  archived: boolean
  muted: boolean
  draft?: string
}

interface QuickReply {
  id: string
  text: string
  icon: React.ReactNode
}

interface NotificationSettings {
  enabled: boolean
  sound: boolean
  vibration: boolean
  quietHours: {
    enabled: boolean
    start: string
    end: string
  }
  priority: {
    high: boolean
    normal: boolean
    low: boolean
  }
}

export function MobileCommunicationManagement() {
  const [activeView, setActiveView] = useState<"list" | "chat">("list")
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [showQuickReplies, setShowQuickReplies] = useState(false)
  const [isOffline, setIsOffline] = useState(false)
  const [offlineQueue, setOfflineQueue] = useState<Message[]>([])
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    enabled: true,
    sound: true,
    vibration: true,
    quietHours: {
      enabled: true,
      start: "22:00",
      end: "08:00"
    },
    priority: {
      high: true,
      normal: true,
      low: false
    }
  })

  const x = useMotionValue(0)
  const background = useTransform(
    x,
    [-100, 0, 100],
    ["#ef4444", "#ffffff", "#10b981"]
  )

  // Mock conversations
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: "1",
      participant: "Marie Joseph",
      avatar: "https://i.pravatar.cc/150?img=1",
      lastMessage: "Mwen ta renmen yon videyo pou anivèsè",
      timestamp: "2m",
      unread: 3,
      priority: "high",
      starred: true,
      archived: false,
      muted: false
    },
    {
      id: "2",
      participant: "Jean Baptiste",
      avatar: "https://i.pravatar.cc/150?img=2",
      lastMessage: "Business shoutout request",
      timestamp: "15m",
      unread: 0,
      priority: "normal",
      starred: false,
      archived: false,
      muted: false,
      draft: "Thank you for your request..."
    },
    {
      id: "3",
      participant: "Sophia Laurent",
      avatar: "https://i.pravatar.cc/150?img=3",
      lastMessage: "Urgent: Need video by tomorrow!",
      timestamp: "1h",
      unread: 1,
      priority: "high",
      starred: false,
      archived: false,
      muted: false
    },
    {
      id: "4",
      participant: "Pierre Michel",
      avatar: "https://i.pravatar.cc/150?img=4",
      lastMessage: "Merci pour la vidéo! 🎉",
      timestamp: "3h",
      unread: 0,
      priority: "low",
      starred: false,
      archived: false,
      muted: true
    }
  ])

  // Mock messages
  const messages: Message[] = [
    {
      id: "1",
      sender: "Marie Joseph",
      avatar: "https://i.pravatar.cc/150?img=1",
      content: "Bonjou! Mwen ta renmen yon videyo pou anivèsè pitit mwen",
      timestamp: "10:30 AM",
      read: true,
      starred: false,
      type: "text"
    },
    {
      id: "2",
      sender: "You",
      content: "Bonjou Marie! Mwen kontan ou kontakte m.",
      timestamp: "10:35 AM",
      read: true,
      starred: false,
      type: "text"
    },
    {
      id: "3",
      sender: "Marie Joseph",
      avatar: "https://i.pravatar.cc/150?img=1",
      content: "🎂 Li pral gen 18 an nan 2 jou",
      timestamp: "10:40 AM",
      read: false,
      starred: true,
      type: "text"
    }
  ]

  // Quick replies
  const quickReplies: QuickReply[] = [
    { id: "1", text: "Thank you!", icon: <ThumbsUp className="w-4 h-4" /> },
    { id: "2", text: "Working on it", icon: <Clock className="w-4 h-4" /> },
    { id: "3", text: "Will respond soon", icon: <Reply className="w-4 h-4" /> },
    { id: "4", text: "Check your email", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "5", text: "Video ready!", icon: <Video className="w-4 h-4" /> },
    { id: "6", text: "Need more info", icon: <AlertCircle className="w-4 h-4" /> }
  ]

  // Simulate offline detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const handleSwipe = (info: PanInfo, conversationId: string) => {
    if (info.offset.x > 100) {
      // Swipe right - Archive
      handleArchive(conversationId)
    } else if (info.offset.x < -100) {
      // Swipe left - Star
      handleStar(conversationId)
    }
  }

  const handleArchive = (conversationId: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, archived: true }
          : conv
      )
    )
  }

  const handleStar = (conversationId: string) => {
    setConversations(prev => 
      prev.map(conv => 
        conv.id === conversationId 
          ? { ...conv, starred: !conv.starred }
          : conv
      )
    )
  }

  const handleSendMessage = () => {
    if (!messageInput.trim()) return

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      content: messageInput,
      timestamp: "Now",
      read: false,
      starred: false,
      type: "text",
      offline: isOffline,
      sending: true
    }

    if (isOffline) {
      setOfflineQueue(prev => [...prev, newMessage])
    }

    setMessageInput("")
  }

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording)
    // Voice recording logic would go here
  }

  const openConversation = (conversationId: string) => {
    setSelectedConversation(conversationId)
    setActiveView("chat")
  }

  const selectedConv = conversations.find(c => c.id === selectedConversation)

  // Mobile-optimized conversation list
  const ConversationList = () => (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-xl font-bold">Messages</h1>
          <div className="flex items-center gap-2">
            {isOffline ? (
              <Badge variant="destructive" className="text-xs">
                <WifiOff className="w-3 h-3 mr-1" />
                Offline
              </Badge>
            ) : (
              <Badge variant="default" className="text-xs">
                <Wifi className="w-3 h-3 mr-1" />
                Online
              </Badge>
            )}
            <Button size="icon" variant="ghost">
              <Search className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost">
              <Filter className="w-5 h-5" />
            </Button>
          </div>
        </div>
        
        {/* Quick filters */}
        <div className="flex gap-2 overflow-x-auto">
          <Badge variant="default" className="whitespace-nowrap">All</Badge>
          <Badge variant="outline" className="whitespace-nowrap">Unread</Badge>
          <Badge variant="outline" className="whitespace-nowrap">Starred</Badge>
          <Badge variant="outline" className="whitespace-nowrap">Priority</Badge>
        </div>
      </div>

      {/* Conversations */}
      <ScrollArea className="flex-1">
        {conversations.filter(c => !c.archived).map((conversation) => (
          <motion.div
            key={conversation.id}
            drag="x"
            dragConstraints={{ left: -100, right: 100 }}
            onDragEnd={(e, info) => handleSwipe(info, conversation.id)}
            style={{ x, background }}
            className="relative"
          >
            <div 
              className="bg-white border-b p-4 active:bg-gray-50 cursor-pointer"
              onClick={() => openConversation(conversation.id)}
            >
              <div className="flex items-start gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={conversation.avatar} />
                  <AvatarFallback>
                    {conversation.participant.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold truncate">
                        {conversation.participant}
                      </p>
                      {conversation.starred && (
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      )}
                      {conversation.muted && (
                        <BellOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {conversation.timestamp}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.draft ? (
                        <span className="text-red-500">Draft: {conversation.draft}</span>
                      ) : (
                        conversation.lastMessage
                      )}
                    </p>
                    {conversation.unread > 0 && (
                      <Badge 
                        variant={conversation.priority === "high" ? "destructive" : "default"}
                        className="h-5 min-w-[20px]"
                      >
                        {conversation.unread}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Swipe indicators */}
            <div className="absolute inset-y-0 left-0 w-20 bg-red-500 flex items-center justify-center">
              <Archive className="w-6 h-6 text-white" />
            </div>
            <div className="absolute inset-y-0 right-0 w-20 bg-green-500 flex items-center justify-end pr-4">
              <Star className="w-6 h-6 text-white" />
            </div>
          </motion.div>
        ))}
      </ScrollArea>

      {/* Offline queue indicator */}
      {offlineQueue.length > 0 && (
        <div className="bg-orange-50 border-t border-orange-200 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Upload className="w-4 h-4 text-orange-600" />
              <span className="text-sm text-orange-900">
                {offlineQueue.length} messages queued
              </span>
            </div>
            <Button size="sm" variant="ghost" className="text-orange-600">
              View
            </Button>
          </div>
        </div>
      )}
    </div>
  )

  // Mobile-optimized chat view
  const ChatView = () => (
    <div className="h-full flex flex-col bg-white">
      {/* Chat header */}
      <div className="bg-white border-b p-4 flex items-center gap-3">
        <Button 
          size="icon" 
          variant="ghost"
          onClick={() => setActiveView("list")}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Avatar className="w-10 h-10">
          <AvatarImage src={selectedConv?.avatar} />
          <AvatarFallback>
            {selectedConv?.participant.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-semibold">{selectedConv?.participant}</p>
          <p className="text-xs text-gray-500">Active now</p>
        </div>
        <Button size="icon" variant="ghost">
          <Phone className="w-5 h-5" />
        </Button>
        <Button size="icon" variant="ghost">
          <MoreVertical className="w-5 h-5" />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.sender === "You" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] ${message.sender === "You" ? "order-2" : ""}`}>
                {message.sender !== "You" && (
                  <Avatar className="w-8 h-8 mb-1">
                    <AvatarImage src={message.avatar} />
                    <AvatarFallback>MJ</AvatarFallback>
                  </Avatar>
                )}
                <div className={`rounded-2xl px-4 py-2 ${
                  message.sender === "You" 
                    ? "bg-purple-600 text-white" 
                    : "bg-gray-100 text-gray-900"
                }`}>
                  <p className="text-sm">{message.content}</p>
                  {message.type === "voice" && (
                    <div className="flex items-center gap-2 mt-2">
                      <Volume2 className="w-4 h-4" />
                      <div className="flex-1 h-1 bg-white/30 rounded-full" />
                      <span className="text-xs">0:12</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                  <span>{message.timestamp}</span>
                  {message.sender === "You" && (
                    <>
                      {message.offline && <WifiOff className="w-3 h-3" />}
                      {message.sending ? (
                        <Clock className="w-3 h-3" />
                      ) : (
                        <CheckCheck className={`w-3 h-3 ${message.read ? "text-blue-600" : ""}`} />
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      {/* Quick replies */}
      {showQuickReplies && (
        <div className="border-t p-3 bg-gray-50">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {quickReplies.map((reply) => (
              <Button
                key={reply.id}
                variant="outline"
                size="sm"
                className="whitespace-nowrap flex items-center gap-1"
                onClick={() => {
                  setMessageInput(reply.text)
                  setShowQuickReplies(false)
                }}
              >
                {reply.icon}
                {reply.text}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="border-t p-4 bg-white">
        <div className="flex items-end gap-2">
          <Button size="icon" variant="ghost">
            <Paperclip className="w-5 h-5" />
          </Button>
          <div className="flex-1 relative">
            <Input
              placeholder="Type a message..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onFocus={() => setShowQuickReplies(false)}
              className="pr-10"
            />
            <Button 
              size="icon" 
              variant="ghost"
              className="absolute right-0 top-0"
              onClick={() => setShowQuickReplies(!showQuickReplies)}
            >
              <Zap className="w-4 h-4" />
            </Button>
          </div>
          {messageInput ? (
            <Button size="icon" onClick={handleSendMessage}>
              <Send className="w-5 h-5" />
            </Button>
          ) : (
            <Button 
              size="icon" 
              variant={isRecording ? "destructive" : "default"}
              onClick={handleVoiceRecord}
            >
              <Mic className={`w-5 h-5 ${isRecording ? "animate-pulse" : ""}`} />
            </Button>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-screen flex flex-col md:hidden">
      {/* Mobile View */}
      <AnimatePresence mode="wait">
        {activeView === "list" ? (
          <motion.div
            key="list"
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="h-full"
          >
            <ConversationList />
          </motion.div>
        ) : (
          <motion.div
            key="chat"
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="h-full"
          >
            <ChatView />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop View */}
      <div className="hidden md:flex h-screen">
        <div className="w-1/3 border-r">
          <ConversationList />
        </div>
        <div className="flex-1">
          {selectedConversation ? (
            <ChatView />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <p>Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification Settings Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            size="icon" 
            variant="outline"
            className="fixed bottom-20 right-4 z-50 md:hidden"
          >
            <Bell className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Notification Settings</SheetTitle>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5" />
                  <span>Push Notifications</span>
                </div>
                <Button variant="outline" size="sm">
                  {notificationSettings.enabled ? "On" : "Off"}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5" />
                  <span>Sound</span>
                </div>
                <Button variant="outline" size="sm">
                  {notificationSettings.sound ? "On" : "Off"}
                </Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Vibrate className="w-5 h-5" />
                  <span>Vibration</span>
                </div>
                <Button variant="outline" size="sm">
                  {notificationSettings.vibration ? "On" : "Off"}
                </Button>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Quiet Hours</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Moon className="w-5 h-5" />
                  <span>Enable Quiet Hours</span>
                </div>
                <Button variant="outline" size="sm">
                  {notificationSettings.quietHours.enabled ? "On" : "Off"}
                </Button>
              </div>
              {notificationSettings.quietHours.enabled && (
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {notificationSettings.quietHours.start} - {notificationSettings.quietHours.end}
                  </p>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold">Priority Notifications</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">High Priority</span>
                  <Badge variant="destructive">Always</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Normal Priority</span>
                  <Badge variant="default">Enabled</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Low Priority</span>
                  <Badge variant="outline">Disabled</Badge>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}