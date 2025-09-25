"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import {
  Upload,
  Video,
  Play,
  Pause,
  RotateCcw,
  Check,
  ArrowLeft,
  Camera,
  Mic,
  Settings,
  MessageCircle,
  Send,
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

const mockRequest = {
  id: 1,
  customer: "Marie L.",
  customerEmail: "marie.l@email.com",
  occasion: "Birthday",
  recipient: "Sarah",
  message:
    "Happy birthday message for my daughter Sarah who just turned 16. She loves your comedy and would be so excited to hear from you! Please mention that she's starting her junior year of high school and loves to dance.",
  price: 85,
  dueDate: "2024-01-17",
  language: "English",
}

export default function CreatorUploadPage() {
  const [uploadStep, setUploadStep] = useState(1) // 1: Record, 2: Review, 3: Upload, 4: Complete
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [videoTitle, setVideoTitle] = useState("")
  const [videoNotes, setVideoNotes] = useState("")
  const [hasRecordedVideo, setHasRecordedVideo] = useState(false)
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false)
  const [messageText, setMessageText] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "customer",
      text: "Hi! I'm so excited for this video. Sarah is a huge fan and this will make her day!",
      timestamp: "2024-01-15 10:30 AM",
    },
  ])

  // Recording timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const handleStartRecording = () => {
    setIsRecording(true)
    setRecordingTime(0)
    setHasRecordedVideo(false)
  }

  const handleStopRecording = () => {
    setIsRecording(false)
    setHasRecordedVideo(true)
    setUploadStep(2)
  }

  const handleUpload = () => {
    if (!hasRecordedVideo) {
      alert("Please record a video first!")
      return
    }

    setUploadStep(3)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setUploadStep(4)
          return 100
        }
        return prev + 10
      })
    }, 500)
  }

  const handleSendMessage = () => {
    if (!messageText.trim()) return

    const newMessage = {
      id: messages.length + 1,
      sender: "creator" as const,
      text: messageText,
      timestamp: new Date().toLocaleString(),
    }

    setMessages([...messages, newMessage])
    setMessageText("")

    // Simulate customer response after 2 seconds
    setTimeout(() => {
      const customerResponse = {
        id: messages.length + 2,
        sender: "customer" as const,
        text: "Thank you for the message! Looking forward to the video.",
        timestamp: new Date().toLocaleString(),
      }
      setMessages((prev) => [...prev, customerResponse])
    }, 2000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/creator/requests">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
              </Button>
              <h1 className="text-xl font-semibold">Record Video</h1>
            </div>
            <Badge variant="secondary">Request #{mockRequest.id}</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${uploadStep >= 1 ? "bg-purple-600 text-white" : "bg-gray-200"}`}
              >
                1
              </div>
              <div className={`w-16 h-1 ${uploadStep >= 2 ? "bg-purple-600" : "bg-gray-200"}`} />
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${uploadStep >= 2 ? "bg-purple-600 text-white" : "bg-gray-200"}`}
              >
                2
              </div>
              <div className={`w-16 h-1 ${uploadStep >= 3 ? "bg-purple-600" : "bg-gray-200"}`} />
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${uploadStep >= 3 ? "bg-purple-600 text-white" : "bg-gray-200"}`}
              >
                3
              </div>
              <div className={`w-16 h-1 ${uploadStep >= 4 ? "bg-purple-600" : "bg-gray-200"}`} />
              <div
                className={`flex items-center justify-center w-8 h-8 rounded-full ${uploadStep >= 4 ? "bg-purple-600 text-white" : "bg-gray-200"}`}
              >
                4
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {uploadStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Record Your Video</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-900 rounded-lg mb-6 flex items-center justify-center relative">
                      {!isRecording && !hasRecordedVideo ? (
                        <div className="text-center text-white">
                          <Camera className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg mb-4">Ready to record</p>
                          <Button onClick={handleStartRecording} size="lg" className="bg-red-600 hover:bg-red-700">
                            <Video className="h-5 w-5 mr-2" />
                            Start Recording
                          </Button>
                        </div>
                      ) : isRecording ? (
                        <div className="text-center text-white">
                          <div className="animate-pulse">
                            <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-4"></div>
                            <p className="text-lg mb-2">Recording...</p>
                            <p className="text-2xl font-mono">{formatTime(recordingTime)}</p>
                          </div>
                          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                            <Button onClick={handleStopRecording} size="lg" variant="outline">
                              <Pause className="h-5 w-5 mr-2" />
                              Stop
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-white">
                          <Check className="h-16 w-16 mx-auto mb-4 text-green-400" />
                          <p className="text-lg mb-4">Video recorded successfully!</p>
                          <p className="text-sm opacity-75">Duration: {formatTime(recordingTime)}</p>
                          <div className="flex space-x-4 mt-4">
                            <Button
                              onClick={() => setUploadStep(2)}
                              size="lg"
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Continue to Review
                            </Button>
                            <Button onClick={handleStartRecording} size="lg" variant="outline">
                              <RotateCcw className="h-5 w-5 mr-2" />
                              Re-record
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Mic className="h-4 w-4" />
                        <span>Microphone Ready</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Camera className="h-4 w-4" />
                        <span>Camera Ready</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {uploadStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Your Video</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-gray-900 rounded-lg mb-6 flex items-center justify-center">
                      <div className="text-center text-white">
                        <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg mb-4">Video Preview</p>
                        <p className="text-sm opacity-75 mb-4">Duration: {formatTime(recordingTime)}</p>
                        <div className="flex space-x-4">
                          <Button variant="outline">
                            <Play className="h-5 w-5 mr-2" />
                            Play
                          </Button>
                          <Button variant="outline" onClick={() => setUploadStep(1)}>
                            <RotateCcw className="h-5 w-5 mr-2" />
                            Re-record
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="videoTitle">Video Title (Optional)</Label>
                        <Input
                          id="videoTitle"
                          placeholder="e.g., Birthday wishes for Sarah"
                          value={videoTitle}
                          onChange={(e) => setVideoTitle(e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor="videoNotes">Notes for Customer (Optional)</Label>
                        <Textarea
                          id="videoNotes"
                          placeholder="Any additional notes or context for the customer..."
                          rows={3}
                          value={videoNotes}
                          onChange={(e) => setVideoNotes(e.target.value)}
                        />
                      </div>

                      <Button onClick={handleUpload} size="lg" className="w-full">
                        <Upload className="h-5 w-5 mr-2" />
                        Upload Video
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {uploadStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Uploading Video</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Upload className="h-16 w-16 mx-auto mb-4 text-purple-600" />
                      <p className="text-lg mb-4">Uploading your video...</p>
                      <Progress value={uploadProgress} className="w-full max-w-md mx-auto mb-4" />
                      <p className="text-sm text-gray-600">{uploadProgress}% complete</p>
                      {uploadProgress > 50 && <p className="text-xs text-gray-500 mt-2">Processing video quality...</p>}
                    </div>
                  </CardContent>
                </Card>
              )}

              {uploadStep === 4 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Video Uploaded Successfully!</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8">
                      <Check className="h-16 w-16 mx-auto mb-4 text-green-600" />
                      <p className="text-lg mb-4">Your video has been delivered to {mockRequest.customer}</p>
                      <p className="text-gray-600 mb-6">
                        The customer will receive an email notification and can download their personalized video.
                      </p>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <p className="text-green-800 font-medium">Payment Processing</p>
                        <p className="text-green-700 text-sm">
                          Your earnings of ${mockRequest.price} will be processed within 24 hours.
                        </p>
                      </div>
                      <div className="flex space-x-4 justify-center">
                        <Button asChild>
                          <Link href="/creator/requests">View More Requests</Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href="/creator/dashboard">Back to Dashboard</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Request Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {mockRequest.occasion} for {mockRequest.recipient}
                      </h3>
                      <p className="text-gray-600">From: {mockRequest.customer}</p>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-700">{mockRequest.message}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Payment:</span>
                      <span className="font-bold text-green-600">${mockRequest.price}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Due Date:</span>
                      <span className="font-semibold">{mockRequest.dueDate}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Language:</span>
                      <Badge variant="outline">{mockRequest.language}</Badge>
                    </div>

                    {/* Message Customer Button */}
                    <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="w-full bg-transparent">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Message Customer
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>Message {mockRequest.customer}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          {/* Messages */}
                          <div className="max-h-60 overflow-y-auto space-y-3">
                            {messages.map((message) => (
                              <div
                                key={message.id}
                                className={`flex ${message.sender === "creator" ? "justify-end" : "justify-start"}`}
                              >
                                <div
                                  className={`max-w-xs p-3 rounded-lg ${
                                    message.sender === "creator"
                                      ? "bg-purple-600 text-white"
                                      : "bg-gray-100 text-gray-900"
                                  }`}
                                >
                                  <p className="text-sm">{message.text}</p>
                                  <p
                                    className={`text-xs mt-1 ${
                                      message.sender === "creator" ? "text-purple-200" : "text-gray-500"
                                    }`}
                                  >
                                    {message.timestamp}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Message Input */}
                          <div className="flex space-x-2">
                            <Input
                              placeholder="Type your message..."
                              value={messageText}
                              onChange={(e) => setMessageText(e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                            />
                            <Button onClick={handleSendMessage} size="icon">
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              {uploadStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recording Tips</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <p className="font-medium text-blue-900">🎯 Be Personal</p>
                        <p className="text-blue-800">
                          Use the recipient's name and mention specific details from the request.
                        </p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="font-medium text-green-900">🎬 Good Quality</p>
                        <p className="text-green-800">Ensure good lighting and clear audio for the best experience.</p>
                      </div>
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <p className="font-medium text-purple-900">⏱️ Keep it Concise</p>
                        <p className="text-purple-800">Aim for 30-90 seconds for the perfect message length.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
