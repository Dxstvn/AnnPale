'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Send, 
  Gift, 
  Heart, 
  Star, 
  Crown, 
  Shield, 
  Sparkles,
  DollarSign,
  MessageSquare,
  Users,
  Lock,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { ChatMessage, ViewerInfo } from '@/lib/streaming/realtime-manager'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface StreamChatProps {
  streamId: string
  messages: ChatMessage[]
  viewers: ViewerInfo[]
  viewerCount: number
  currentUser?: {
    id: string
    name: string
    role: ViewerInfo['role']
    subscriptionTier?: 'basic' | 'premium' | 'vip'
  }
  isSubscriberOnly?: boolean
  onSendMessage: (message: string) => Promise<void>
  onSendGift?: (amount: number, message?: string, type?: 'tip' | 'super_chat' | 'gift') => Promise<void>
  className?: string
}

const roleIcons = {
  creator: Crown,
  moderator: Shield,
  vip: Star,
  subscriber: Heart,
  fan: null,
}

const roleColors = {
  creator: 'text-yellow-600 bg-yellow-50',
  moderator: 'text-blue-600 bg-blue-50',
  vip: 'text-purple-600 bg-purple-50',
  subscriber: 'text-pink-600 bg-pink-50',
  fan: 'text-gray-600',
}

const giftOptions = [
  { amount: 1, emoji: '☕', label: 'Coffee' },
  { amount: 5, emoji: '🍕', label: 'Pizza' },
  { amount: 10, emoji: '💐', label: 'Flowers' },
  { amount: 25, emoji: '🎂', label: 'Cake' },
  { amount: 50, emoji: '💎', label: 'Diamond' },
  { amount: 100, emoji: '🚀', label: 'Rocket' },
]

export function StreamChat({
  streamId,
  messages,
  viewers,
  viewerCount,
  currentUser,
  isSubscriberOnly = false,
  onSendMessage,
  onSendGift,
  className,
}: StreamChatProps) {
  const [message, setMessage] = useState('')
  const [isGiftMenuOpen, setIsGiftMenuOpen] = useState(false)
  const [selectedTab, setSelectedTab] = useState<'chat' | 'viewers'>('chat')
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async () => {
    if (!message.trim()) return
    
    try {
      await onSendMessage(message)
      setMessage('')
    } catch (error) {
      console.error('Failed to send message:', error)
    }
  }

  const handleSendGift = async (amount: number, emoji: string) => {
    if (!onSendGift) return
    
    try {
      await onSendGift(amount, `${emoji} Sent a gift!`, 'gift')
      setIsGiftMenuOpen(false)
    } catch (error) {
      console.error('Failed to send gift:', error)
    }
  }

  const canChat = !isSubscriberOnly || 
    (currentUser && ['subscriber', 'vip', 'moderator', 'creator'].includes(currentUser.role))

  const renderMessage = (msg: ChatMessage) => {
    const RoleIcon = roleIcons[msg.userRole]
    const isGiftMessage = msg.giftAmount && msg.giftAmount > 0

    return (
      <div
        key={msg.id}
        className={cn(
          'px-3 py-2 hover:bg-gray-50 transition-colors',
          msg.isHighlighted && 'bg-gradient-to-r from-purple-50 to-pink-50',
          isGiftMessage && 'bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500'
        )}
      >
        <div className="flex items-start space-x-2">
          {/* User Role Badge */}
          {RoleIcon && (
            <div className={cn('mt-0.5', roleColors[msg.userRole])}>
              <RoleIcon className="h-4 w-4" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline space-x-1">
              <span className={cn(
                'font-semibold text-sm',
                roleColors[msg.userRole]
              )}>
                {msg.userName}
              </span>
              
              {/* Gift Amount Badge */}
              {isGiftMessage && (
                <Badge className="ml-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {msg.giftAmount}
                </Badge>
              )}
            </div>
            
            <p className="text-sm text-gray-800 break-words">
              {msg.message}
            </p>
          </div>
          
          {/* Timestamp */}
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {new Date(msg.timestamp).toLocaleTimeString('en-US', { 
              hour: 'numeric', 
              minute: '2-digit' 
            })}
          </span>
        </div>
      </div>
    )
  }

  const renderViewer = (viewer: ViewerInfo) => {
    const RoleIcon = roleIcons[viewer.role]
    
    return (
      <div key={viewer.id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={viewer.avatar} />
            <AvatarFallback>{viewer.name[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{viewer.name}</p>
            {viewer.subscriptionTier && (
              <Badge variant="secondary" className="text-xs">
                {viewer.subscriptionTier}
              </Badge>
            )}
          </div>
        </div>
        {RoleIcon && (
          <div className={cn('p-1 rounded', roleColors[viewer.role])}>
            <RoleIcon className="h-3 w-3" />
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className={cn('flex flex-col h-full', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Live Chat</CardTitle>
          <Badge variant="secondary" className="flex items-center">
            <Users className="w-3 h-3 mr-1" />
            {viewerCount}
          </Badge>
        </div>
        
        {/* Tabs for Chat and Viewers */}
        <Tabs value={selectedTab} onValueChange={(v) => setSelectedTab(v as 'chat' | 'viewers')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="chat" className="text-xs">
              <MessageSquare className="h-3 w-3 mr-1" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="viewers" className="text-xs">
              <Users className="h-3 w-3 mr-1" />
              Viewers ({viewers.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <Tabs value={selectedTab} className="flex-1 flex flex-col">
          {/* Chat Tab */}
          <TabsContent value="chat" className="flex-1 flex flex-col mt-0">
            <ScrollArea className="flex-1 px-2" ref={scrollAreaRef}>
              <div className="space-y-1 py-2">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">No messages yet</p>
                    <p className="text-xs">Be the first to say hello!</p>
                  </div>
                ) : (
                  messages.map(renderMessage)
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Chat Input */}
            <div className="p-3 border-t">
              {!canChat ? (
                <div className="text-center py-2 text-sm text-gray-500">
                  <Lock className="h-4 w-4 mx-auto mb-1" />
                  Subscribers only chat
                </div>
              ) : (
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                    disabled={!currentUser}
                  />
                  
                  {/* Gift Button */}
                  {onSendGift && (
                    <Popover open={isGiftMenuOpen} onOpenChange={setIsGiftMenuOpen}>
                      <PopoverTrigger asChild>
                        <Button 
                          size="icon" 
                          variant="outline"
                          className="text-yellow-600 hover:bg-yellow-50"
                        >
                          <Gift className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid grid-cols-3 gap-2">
                          {giftOptions.map((gift) => (
                            <Button
                              key={gift.amount}
                              variant="outline"
                              className="flex flex-col h-auto py-3 hover:bg-gradient-to-r hover:from-yellow-50 hover:to-orange-50"
                              onClick={() => handleSendGift(gift.amount, gift.emoji)}
                            >
                              <span className="text-2xl mb-1">{gift.emoji}</span>
                              <span className="text-xs">${gift.amount}</span>
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                  )}
                  
                  <Button 
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!message.trim() || !currentUser}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Viewers Tab */}
          <TabsContent value="viewers" className="flex-1 mt-0">
            <ScrollArea className="h-full px-3">
              <div className="space-y-2 py-3">
                {viewers.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Users className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">No viewers yet</p>
                  </div>
                ) : (
                  <>
                    {/* Group viewers by role */}
                    {['creator', 'moderator', 'vip', 'subscriber', 'fan'].map(role => {
                      const roleViewers = viewers.filter(v => v.role === role)
                      if (roleViewers.length === 0) return null
                      
                      return (
                        <div key={role}>
                          <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                            {role}s ({roleViewers.length})
                          </p>
                          <div className="space-y-1 mb-4">
                            {roleViewers.map(renderViewer)}
                          </div>
                        </div>
                      )
                    })}
                  </>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}