"use client"

import { useState, useRef, useCallback } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  Image,
  Video,
  Globe,
  Users,
  Lock,
  Calendar,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"

interface PostComposerProps {
  onPostCreated?: () => void
}

export function PostComposer({ onPostCreated }: PostComposerProps) {
  const { user, profile } = useSupabaseAuth()
  const [content, setContent] = useState("")
  const [visibility, setVisibility] = useState<"public" | "subscribers" | "tier-specific">("public")
  const [selectedTier, setSelectedTier] = useState<string>("")
  const [mediaFiles, setMediaFiles] = useState<File[]>([])
  const [mediaPreviews, setMediaPreviews] = useState<string[]>([])
  const [isPosting, setIsPosting] = useState(false)
  const [isScheduling, setIsScheduling] = useState(false)
  const [scheduleDate, setScheduleDate] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const videoInputRef = useRef<HTMLInputElement>(null)

  // Character limit
  const maxLength = 280
  const charactersRemaining = maxLength - content.length
  const progressPercentage = (content.length / maxLength) * 100

  // Handle file selection
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate file types
    const validTypes = type === "image" 
      ? ["image/jpeg", "image/png", "image/gif", "image/webp"]
      : ["video/mp4", "video/webm", "video/quicktime"]

    const validFiles = files.filter(file => validTypes.includes(file.type))
    
    if (validFiles.length !== files.length) {
      alert(`Some files were not ${type}s and were ignored`)
    }

    // Limit to 4 files
    const filesToAdd = validFiles.slice(0, 4 - mediaFiles.length)
    
    // Create previews
    const newPreviews = filesToAdd.map(file => URL.createObjectURL(file))
    
    setMediaFiles([...mediaFiles, ...filesToAdd])
    setMediaPreviews([...mediaPreviews, ...newPreviews])
  }, [mediaFiles, mediaPreviews])

  // Remove media
  const removeMedia = useCallback((index: number) => {
    URL.revokeObjectURL(mediaPreviews[index])
    setMediaFiles(mediaFiles.filter((_, i) => i !== index))
    setMediaPreviews(mediaPreviews.filter((_, i) => i !== index))
  }, [mediaFiles, mediaPreviews])

  // Handle post submission
  const handlePost = useCallback(async () => {
    if (!content.trim() && mediaFiles.length === 0) return

    setIsPosting(true)
    
    try {
      // TODO: Implement actual post creation with Supabase
      // 1. Upload media files if any
      // 2. Create post record
      // 3. Handle visibility settings
      
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      // Reset form
      setContent("")
      setMediaFiles([])
      setMediaPreviews([])
      setVisibility("public")
      setSelectedTier("")
      
      onPostCreated?.()
    } catch (error) {
      console.error("Failed to create post:", error)
      alert("Failed to create post. Please try again.")
    } finally {
      setIsPosting(false)
    }
  }, [content, mediaFiles, visibility, selectedTier, onPostCreated])

  // Check if user is a creator
  if (profile?.role !== "creator") {
    return null
  }

  return (
    <Card className="p-4">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={profile?.avatar_url} />
          <AvatarFallback>{profile?.display_name?.[0] || user?.email?.[0]}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-3">
          {/* Text input */}
          <Textarea
            placeholder="What's happening?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={maxLength}
            className="min-h-[80px] resize-none border-0 focus-visible:ring-0 p-0 text-base"
          />

          {/* Media previews */}
          {mediaPreviews.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {mediaPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  {mediaFiles[index].type.startsWith("video") ? (
                    <video 
                      src={preview} 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <img 
                      src={preview} 
                      alt="" 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeMedia(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between border-t pt-3">
            <div className="flex items-center gap-1">
              {/* Image upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFileSelect(e, "image")}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => fileInputRef.current?.click()}
                disabled={mediaFiles.length >= 4}
              >
                <Image className="h-5 w-5 text-purple-600" />
              </Button>

              {/* Video upload */}
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e, "video")}
              />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => videoInputRef.current?.click()}
                disabled={mediaFiles.length >= 4}
              >
                <Video className="h-5 w-5 text-purple-600" />
              </Button>

              {/* Visibility selector */}
              <Select value={visibility} onValueChange={(v: any) => setVisibility(v)}>
                <SelectTrigger className="w-32 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4" />
                      Public
                    </div>
                  </SelectItem>
                  <SelectItem value="subscribers">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Subscribers
                    </div>
                  </SelectItem>
                  <SelectItem value="tier-specific">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Specific Tier
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              {/* Schedule dialog */}
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Schedule Post</DialogTitle>
                    <DialogDescription>
                      Choose when to publish this post
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <input
                      type="datetime-local"
                      value={scheduleDate}
                      onChange={(e) => setScheduleDate(e.target.value)}
                      className="w-full p-2 border rounded-lg"
                      min={new Date().toISOString().slice(0, 16)}
                    />
                    <Button 
                      className="w-full"
                      onClick={() => {
                        setIsScheduling(true)
                        // TODO: Implement scheduling
                      }}
                    >
                      Schedule Post
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex items-center gap-3">
              {/* Character count */}
              {content.length > 0 && (
                <div className="flex items-center gap-2">
                  <Progress 
                    value={progressPercentage} 
                    className={cn(
                      "w-8 h-8",
                      charactersRemaining < 20 && "text-orange-500",
                      charactersRemaining < 0 && "text-red-500"
                    )}
                  />
                  <span className={cn(
                    "text-sm",
                    charactersRemaining < 20 && "text-orange-500",
                    charactersRemaining < 0 && "text-red-500"
                  )}>
                    {charactersRemaining}
                  </span>
                </div>
              )}

              {/* Post button */}
              <Button
                onClick={handlePost}
                disabled={
                  isPosting || 
                  charactersRemaining < 0 || 
                  (!content.trim() && mediaFiles.length === 0)
                }
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                {isPosting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Post
              </Button>
            </div>
          </div>

          {/* Tier selector for tier-specific posts */}
          {visibility === "tier-specific" && (
            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
              <AlertCircle className="h-4 w-4 text-purple-600" />
              <Select value={selectedTier} onValueChange={setSelectedTier}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent>
                  {/* TODO: Load actual tiers from creator profile */}
                  <SelectItem value="basic">Basic Tier</SelectItem>
                  <SelectItem value="premium">Premium Tier</SelectItem>
                  <SelectItem value="vip">VIP Tier</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}