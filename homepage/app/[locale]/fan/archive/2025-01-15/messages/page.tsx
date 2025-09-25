'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  MessageSquare, Send, Search, Star, Archive, Trash2, 
  MoreVertical, Paperclip, Image, Video, Clock, CheckCheck,
  Bell, BellOff, Pin, Filter, ChevronLeft, Smile, Mic,
  AlertCircle, Shield, Flag
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface Message {
  id: string
  content: string
  timestamp: string
  isRead: boolean
  isSent: boolean
}

interface Conversation {
  id: string
  creatorName: string
  creatorImage: string
  lastMessage: string
  timestamp: string
  unreadCount: number
  isPinned?: boolean
  isMuted?: boolean
  messages: Message[]
  status?: 'online' | 'offline' | 'away'
}

export default function CustomerMessagesPage() {
  const t = useTranslations()
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTab, setSelectedTab] = useState('all')

  // Mock conversations data
  const conversations: Conversation[] = [
    {
      id: 'CONV-001',
      creatorName: 'Marie-Claire Laurent',
      creatorImage: '/api/placeholder/40/40',
      lastMessage: 'Your video is ready! Click here to view.',
      timestamp: '2 min ago',
      unreadCount: 1,
      isPinned: true,
      status: 'online',
      messages: [
        {
          id: 'MSG-001',
          content: 'Hi! Thank you for booking a video message.',
          timestamp: '10:00 AM',
          isRead: true,
          isSent: false
        },
        {
          id: 'MSG-002',
          content: 'I\'m excited to create something special for your friend!',
          timestamp: '10:01 AM',
          isRead: true,
          isSent: false
        },
        {
          id: 'MSG-003',
          content: 'Thank you so much! Looking forward to it.',
          timestamp: '10:05 AM',
          isRead: true,
          isSent: true
        },
        {
          id: 'MSG-004',
          content: 'Your video is ready! Click here to view.',
          timestamp: '2:30 PM',
          isRead: false,
          isSent: false
        }
      ]
    },
    {
      id: 'CONV-002',
      creatorName: 'Jean-Baptiste Pierre',
      creatorImage: '/api/placeholder/40/40',
      lastMessage: 'See you at the call tomorrow!',
      timestamp: '1 hour ago',
      unreadCount: 0,
      status: 'away',
      messages: [
        {
          id: 'MSG-005',
          content: 'Confirming our video call for tomorrow at 3 PM.',
          timestamp: '1:00 PM',
          isRead: true,
          isSent: false
        },
        {
          id: 'MSG-006',
          content: 'Perfect! I\'ll be ready.',
          timestamp: '1:15 PM',
          isRead: true,
          isSent: true
        },
        {
          id: 'MSG-007',
          content: 'See you at the call tomorrow!',
          timestamp: '1:20 PM',
          isRead: true,
          isSent: false
        }
      ]
    },
    {
      id: 'CONV-003',
      creatorName: 'Sophie Duval',
      creatorImage: '/api/placeholder/40/40',
      lastMessage: 'Thank you for attending the livestream!',
      timestamp: 'Yesterday',
      unreadCount: 0,
      isMuted: true,
      status: 'offline',
      messages: [
        {
          id: 'MSG-008',
          content: 'Thank you for attending the livestream!',
          timestamp: 'Yesterday',
          isRead: true,
          isSent: false
        }
      ]
    },
    {
      id: 'CONV-004',
      creatorName: 'Support Team',
      creatorImage: '/api/placeholder/40/40',
      lastMessage: 'Your refund has been processed.',
      timestamp: '2 days ago',
      unreadCount: 0,
      messages: [
        {
          id: 'MSG-009',
          content: 'Your refund has been processed.',
          timestamp: '2 days ago',
          isRead: true,
          isSent: false
        }
      ]
    }
  ]

  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.creatorName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = selectedTab === 'all' ||
                      (selectedTab === 'unread' && conv.unreadCount > 0) ||
                      (selectedTab === 'starred' && conv.isPinned)
    return matchesSearch && matchesTab
  })

  const ConversationItem = ({ conversation }: { conversation: Conversation }) => (
    <div
      onClick={() => setSelectedConversation(conversation)}
      className={`p-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 cursor-pointer transition-all border-l-4 ${
        selectedConversation?.id === conversation.id 
          ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-600' 
          : 'border-transparent hover:border-purple-400'
      } ${conversation.unreadCount > 0 ? 'bg-gradient-to-r from-purple-50/50 to-pink-50/50' : ''}`}
    >
      <div className="flex items-start space-x-3">
        <div className="relative">
          <Avatar className="h-10 w-10 ring-2 ring-purple-100">
            <AvatarImage src={conversation.creatorImage} alt={conversation.creatorName} />
            <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
              {conversation.creatorName[0]}
            </AvatarFallback>
          </Avatar>
          {conversation.status === 'online' && (
            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white shadow-sm" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900 truncate">
                {conversation.creatorName}
              </h3>
              {conversation.isPinned && <Pin className="h-3 w-3 text-purple-400" />}
              {conversation.isMuted && <BellOff className="h-3 w-3 text-gray-400" />}
            </div>
            <span className="text-xs text-purple-500">{conversation.timestamp}</span>
          </div>
          
          <p className="text-sm text-gray-600 truncate mt-1">
            {conversation.lastMessage}
          </p>
          
          {conversation.unreadCount > 0 && (
            <Badge className="mt-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 shadow-sm">
              {conversation.unreadCount} new
            </Badge>
          )}
        </div>
      </div>
    </div>
  )

  const MessageBubble = ({ message }: { message: Message }) => (
    <div className={`flex ${message.isSent ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${message.isSent ? 'order-2' : 'order-1'}`}>
        <div className={`rounded-lg px-4 py-2 ${
          message.isSent 
            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
            : 'bg-gray-100 text-gray-900'
        }`}>
          <p className="text-sm">{message.content}</p>
        </div>
        <div className={`flex items-center space-x-1 mt-1 ${
          message.isSent ? 'justify-end' : 'justify-start'
        }`}>
          <span className="text-xs text-gray-500">{message.timestamp}</span>
          {message.isSent && (
            <CheckCheck className={`h-3 w-3 ${message.isRead ? 'text-blue-500' : 'text-gray-400'}`} />
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold flex items-center">
                <MessageSquare className="mr-2 h-6 w-6" />
                {'Messages'}
              </h1>
              <p className="text-purple-100 text-sm mt-1">
                {conversations.filter(c => c.unreadCount > 0).length} unread conversations
              </p>
            </div>
            <Button variant="secondary" size="sm">
              <Archive className="h-4 w-4 mr-2" />
              Archived
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="flex h-[calc(100vh-140px)]">
          {/* Conversations List */}
          <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-96 flex-col bg-white border-r border-purple-100`}>
            {/* Search and Tabs */}
            <div className="p-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-pink-50">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={'Search conversations...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 border-purple-200 focus:border-purple-400 focus:ring-purple-400/20 bg-white"
                />
              </div>
              
              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="grid w-full grid-cols-3 bg-white/80">
                  <TabsTrigger 
                    value="all" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger 
                    value="unread" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    Unread ({conversations.filter(c => c.unreadCount > 0).length})
                  </TabsTrigger>
                  <TabsTrigger 
                    value="starred" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                  >
                    Starred
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Conversations */}
            <ScrollArea className="flex-1 bg-gradient-to-b from-white to-purple-50/30">
              {filteredConversations.length > 0 ? (
                filteredConversations.map(conversation => (
                  <div key={conversation.id}>
                    <ConversationItem conversation={conversation} />
                    <Separator className="bg-purple-100" />
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-3 text-purple-300" />
                  <p className="text-purple-600">No conversations found</p>
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Message Thread */}
          {selectedConversation ? (
            <div className="flex-1 flex flex-col bg-white">
              {/* Conversation Header */}
              <div className="p-4 border-b border-purple-100 flex items-center justify-between bg-gradient-to-r from-purple-50 to-pink-50">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="md:hidden hover:bg-purple-100"
                    onClick={() => setSelectedConversation(null)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Avatar className="h-10 w-10 ring-2 ring-purple-200">
                    <AvatarImage src={selectedConversation.creatorImage} />
                    <AvatarFallback className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      {selectedConversation.creatorName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900">{selectedConversation.creatorName}</h3>
                    <p className="text-sm text-purple-600">
                      {selectedConversation.status === 'online' ? '• Active now' : '• Offline'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="hover:bg-purple-100">
                    <Video className="h-4 w-4 text-purple-600" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="hover:bg-purple-100">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pin className="h-4 w-4 mr-2" />
                        Pin conversation
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Bell className="h-4 w-4 mr-2" />
                        Mute notifications
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Archive className="h-4 w-4 mr-2" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Flag className="h-4 w-4 mr-2" />
                        Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="flex-1 p-4 bg-gradient-to-b from-white to-purple-50/20">
                <div className="space-y-4">
                  {selectedConversation.messages.map(message => (
                    <MessageBubble key={message.id} message={message} />
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t border-purple-100 bg-gradient-to-r from-purple-50/50 to-pink-50/50">
                <Alert className="mb-3 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <AlertDescription className="text-xs text-purple-700">
                    Messages are monitored for safety. Never share personal information.
                  </AlertDescription>
                </Alert>
                
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <Textarea
                      placeholder={'Type a message...'}
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      className="min-h-[60px] max-h-[120px] border-purple-200 focus:border-purple-400 focus:ring-purple-400/20 bg-white"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          // Send message
                          setMessageInput('')
                        }
                      }}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="icon" className="hover:bg-purple-100 hover:border-purple-400">
                      <Paperclip className="h-4 w-4 text-purple-600" />
                    </Button>
                    <Button variant="outline" size="icon" className="hover:bg-purple-100 hover:border-purple-400">
                      <Image className="h-4 w-4 text-purple-600" />
                    </Button>
                    <Button variant="outline" size="icon" className="hover:bg-purple-100 hover:border-purple-400">
                      <Smile className="h-4 w-4 text-purple-600" />
                    </Button>
                    <Button 
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:translate-y-[-1px] transition-all"
                      disabled={!messageInput.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 hidden md:flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
              <div className="text-center">
                <div className="relative inline-block">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl opacity-30" />
                  <MessageSquare className="h-16 w-16 text-purple-400 mx-auto mb-4 relative" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Select a conversation
                </h3>
                <p className="text-purple-600">
                  Choose a conversation from the list to start messaging
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}