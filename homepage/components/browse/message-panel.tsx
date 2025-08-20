"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  X,
  Send,
  Paperclip,
  Smile,
  Image as ImageIcon,
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Minimize2,
  Maximize2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import type { EnhancedCreator } from "./enhanced-creator-card"

interface MessagePanelProps {
  isOpen: boolean
  onClose: () => void
  creator?: EnhancedCreator | null
  creators?: EnhancedCreator[] // For bulk messaging
  mode?: "single" | "bulk"
  className?: string
}

export function MessagePanel({
  isOpen,
  onClose,
  creator,
  creators = [],
  mode = "single",
  className
}: MessagePanelProps) {
  const [message, setMessage] = React.useState("")
  const [subject, setSubject] = React.useState("")
  const [messageType, setMessageType] = React.useState("inquiry")
  const [attachments, setAttachments] = React.useState<File[]>([])
  const [isMinimized, setIsMinimized] = React.useState(false)
  const [isSending, setIsSending] = React.useState(false)
  const [showTemplates, setShowTemplates] = React.useState(false)

  const messageTemplates = [
    {
      id: "booking",
      label: "Booking Request",
      subject: "Video Message Request",
      content: "Hi! I'd like to book a personalized video message for [occasion]. The recipient's name is [name] and the special date is [date]. Please let me know if you're available!"
    },
    {
      id: "question",
      label: "General Question",
      subject: "Question about your services",
      content: "Hi! I have a question about your video messages. [Your question here]"
    },
    {
      id: "custom",
      label: "Custom Request",
      subject: "Special Request",
      content: "Hi! I have a special request for a video message. [Describe your request]"
    },
    {
      id: "bulk",
      label: "Bulk Order",
      subject: "Bulk Video Order",
      content: "Hi! I'm interested in ordering multiple video messages for [event/company]. Could you provide information about bulk pricing?"
    }
  ]

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("Please enter a message")
      return
    }

    setIsSending(true)
    
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    if (mode === "bulk") {
      toast.success(`Message sent to ${creators.length} creators`)
    } else {
      toast.success(`Message sent to ${creator?.name}`)
    }
    
    setIsSending(false)
    setMessage("")
    setSubject("")
    setAttachments([])
    onClose()
  }

  const handleTemplateSelect = (template: typeof messageTemplates[0]) => {
    setSubject(template.subject)
    setMessage(template.content)
    setShowTemplates(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    setAttachments(prev => [...prev, ...files])
  }

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index))
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: 400 }}
        animate={{ x: 0 }}
        exit={{ x: 400 }}
        transition={{ type: "spring", damping: 20 }}
        className={cn(
          "fixed right-0 top-0 h-full w-96 bg-white dark:bg-gray-900 shadow-2xl z-50",
          isMinimized && "h-auto bottom-auto",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            {mode === "single" && creator ? (
              <>
                <Avatar>
                  <AvatarImage src={creator.avatar} />
                  <AvatarFallback>
                    {creator.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{creator.name}</h3>
                    {creator.verified && (
                      <CheckCircle className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{creator.category}</p>
                </div>
              </>
            ) : (
              <div>
                <h3 className="font-semibold">Bulk Message</h3>
                <p className="text-xs text-gray-500">
                  Sending to {creators.length} creators
                </p>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-8 w-8"
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Creator Info Bar (Single Mode) */}
            {mode === "single" && creator && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-3 w-3" />
                      <span>${creator.price}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{creator.responseTime}</span>
                    </div>
                  </div>
                  <Badge variant={creator.availability === "available" ? "success" : "secondary"}>
                    {creator.availability || "Available"}
                  </Badge>
                </div>
              </div>
            )}

            {/* Bulk Recipients List */}
            {mode === "bulk" && creators.length > 0 && (
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Recipients</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTemplates(!showTemplates)}
                  >
                    Templates
                    {showTemplates ? <ChevronUp className="h-3 w-3 ml-1" /> : <ChevronDown className="h-3 w-3 ml-1" />}
                  </Button>
                </div>
                <ScrollArea className="h-24">
                  <div className="space-y-1">
                    {creators.map((c) => (
                      <div key={c.id} className="flex items-center gap-2 text-sm">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={c.avatar} />
                          <AvatarFallback className="text-xs">
                            {c.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span>{c.name}</span>
                        <span className="text-gray-500">• ${c.price}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            {/* Message Templates */}
            <AnimatePresence>
              {showTemplates && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="overflow-hidden border-b"
                >
                  <div className="p-4 space-y-2">
                    <p className="text-sm font-medium mb-2">Quick Templates</p>
                    {messageTemplates.map((template) => (
                      <button
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className="w-full text-left p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                      >
                        <p className="text-sm font-medium">{template.label}</p>
                        <p className="text-xs text-gray-500 truncate">
                          {template.content}
                        </p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Message Form */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {/* Message Type */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Message Type
                  </label>
                  <Select value={messageType} onValueChange={setMessageType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inquiry">General Inquiry</SelectItem>
                      <SelectItem value="booking">Booking Request</SelectItem>
                      <SelectItem value="custom">Custom Request</SelectItem>
                      <SelectItem value="feedback">Feedback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Subject
                  </label>
                  <Input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="What's this about?"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Message
                  </label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                    className="min-h-[200px] resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {message.length}/500 characters
                  </p>
                </div>

                {/* Attachments */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Attachments
                  </label>
                  <div className="space-y-2">
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      multiple
                      onChange={handleFileUpload}
                    />
                    <label
                      htmlFor="file-upload"
                      className="flex items-center justify-center gap-2 p-3 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <Paperclip className="h-4 w-4" />
                      <span className="text-sm">Add attachments</span>
                    </label>
                    
                    {attachments.length > 0 && (
                      <div className="space-y-1">
                        {attachments.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded"
                          >
                            <div className="flex items-center gap-2 text-sm">
                              <ImageIcon className="h-4 w-4" />
                              <span className="truncate">{file.name}</span>
                            </div>
                            <button
                              onClick={() => removeAttachment(index)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Options */}
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMessage(prev => prev + " 🎂")}
                  >
                    <Smile className="h-4 w-4 mr-1" />
                    Add Emoji
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMessage(prev => prev + " [Date: ]")}
                  >
                    <Calendar className="h-4 w-4 mr-1" />
                    Add Date
                  </Button>
                </div>
              </div>
            </ScrollArea>

            {/* Footer */}
            <div className="p-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <AlertCircle className="h-3 w-3" />
                  <span>
                    {mode === "bulk" 
                      ? `Sending to ${creators.length} creators`
                      : `Response time: ${creator?.responseTime}`
                    }
                  </span>
                </div>
              </div>
              
              <Button
                onClick={handleSend}
                disabled={isSending || !message.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isSending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Send className="h-4 w-4 mr-2" />
                    </motion.div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  )
}