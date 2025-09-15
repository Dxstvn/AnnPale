"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { useDropzone } from "react-dropzone"
import {
  Plus,
  Upload,
  Video,
  Image as ImageIcon,
  FileText,
  Loader2,
  X,
  Star,
  Eye,
  Users,
  Lock,
  Globe,
  Camera
} from "lucide-react"
import { CreatePostData, SubscriptionTier } from "@/types/posts"
import { useToast } from "@/hooks/use-toast"
import { VideoRecorder } from "@/components/video/VideoRecorder"

interface PostCreationDialogProps {
  onPostCreated?: (post: any) => void
}

export function PostCreationDialog({ onPostCreated }: PostCreationDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [subscriptionTiers, setSubscriptionTiers] = useState<SubscriptionTier[]>([])
  const [loadingTiers, setLoadingTiers] = useState(false)
  const [uploadMode, setUploadMode] = useState<'upload' | 'record'>('upload')
  const [isRecording, setIsRecording] = useState(false)
  const [formData, setFormData] = useState<CreatePostData>({
    title: '',
    description: '',
    content_type: 'text',
    is_public: false,
    is_preview: false,
    is_featured: false,
    access_tier_ids: [],
    status: 'draft'
  })

  const { toast } = useToast()
  const router = useRouter()

  // Fetch creator's subscription tiers when dialog opens
  useEffect(() => {
    if (open) {
      fetchSubscriptionTiers()
    }
  }, [open])

  const fetchSubscriptionTiers = async () => {
    setLoadingTiers(true)
    try {
      const response = await fetch('/api/creator/tiers')
      if (!response.ok) {
        throw new Error('Failed to fetch tiers')
      }
      const data = await response.json()
      setSubscriptionTiers(data.tiers || [])
    } catch (error) {
      console.error('Error fetching tiers:', error)
      toast({
        title: "Failed to load subscription tiers",
        description: "You can still create posts without tier restrictions.",
        variant: "destructive"
      })
    } finally {
      setLoadingTiers(false)
    }
  }

  const handleInputChange = (field: keyof CreatePostData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = async (file: File) => {
    try {
      setUploadProgress(0)

      // Determine file type based on MIME type
      const isVideo = file.type.startsWith('video/')
      const isImage = file.type.startsWith('image/')

      if (!isVideo && !isImage) {
        toast({
          title: "Invalid file type",
          description: "Please upload an image or video file.",
          variant: "destructive"
        })
        return
      }

      const type = isVideo ? 'video' : 'image'
      setFormData(prev => ({ ...prev, content_type: type }))

      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('type', type)
      if (type === 'video') {
        uploadFormData.append('generateThumbnail', 'true')
      }

      const response = await fetch('/api/creator/posts/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()

      if (type === 'video') {
        setFormData(prev => ({
          ...prev,
          video_url: result.url,
          thumbnail_url: result.thumbnail_url || result.url
        }))
      } else {
        setFormData(prev => ({
          ...prev,
          image_url: result.url,
          thumbnail_url: result.url
        }))
      }

      setUploadProgress(100)
      toast({
        title: "Upload successful",
        description: `${type} has been uploaded successfully.`
      })
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload failed",
        description: "Failed to upload media. Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleRecordingComplete = useCallback(async (blob: Blob, duration: number) => {
    try {
      setUploadProgress(0)
      setIsRecording(false)

      // Convert blob to File object
      const file = new File([blob], `recording-${Date.now()}.webm`, { type: 'video/webm' })

      // Set content type to video
      setFormData(prev => ({ ...prev, content_type: 'video' }))

      // Upload the recorded video
      const uploadFormData = new FormData()
      uploadFormData.append('file', file)
      uploadFormData.append('type', 'video')
      uploadFormData.append('generateThumbnail', 'true')

      const response = await fetch('/api/creator/posts/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const result = await response.json()

      setFormData(prev => ({
        ...prev,
        video_url: result.url,
        thumbnail_url: result.thumbnail_url || result.url
      }))

      setUploadProgress(100)
      toast({
        title: "Recording saved",
        description: `Your ${Math.floor(duration)}s video has been saved successfully.`
      })

      // Switch back to upload mode after successful recording
      setUploadMode('upload')
    } catch (error) {
      console.error('Recording upload error:', error)
      toast({
        title: "Upload failed",
        description: "Failed to save your recording. Please try again.",
        variant: "destructive"
      })
    }
  }, [toast])
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      handleFileUpload(acceptedFiles[0])
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.webm'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    },
    maxFiles: 1,
    multiple: false
  })

  const handleTierToggle = (tierId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      access_tier_ids: checked 
        ? [...(prev.access_tier_ids || []), tierId]
        : (prev.access_tier_ids || []).filter(id => id !== tierId)
    }))
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your post.",
        variant: "destructive"
      })
      return
    }

    if (formData.content_type === 'video' && !formData.video_url) {
      toast({
        title: "Video required",
        description: "Please upload a video for video posts.",
        variant: "destructive"
      })
      return
    }

    if (formData.content_type === 'image' && !formData.image_url) {
      toast({
        title: "Image required",
        description: "Please upload an image for image posts.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/creator/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create post')
      }

      const result = await response.json()
      
      toast({
        title: "Post created!",
        description: `Your ${formData.content_type} post has been created successfully.`
      })

      onPostCreated?.(result.post)
      setOpen(false)
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        content_type: 'text',
        is_public: false,
        is_preview: false,
        is_featured: false,
        access_tier_ids: [],
        status: 'draft'
      })
      setUploadProgress(0)
      
      // Refresh page to show new post
      router.refresh()

    } catch (error: any) {
      console.error('Create post error:', error)
      toast({
        title: "Failed to create post",
        description: error.message || "Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getAccessLevelIcon = () => {
    if (formData.is_public) return <Globe className="h-4 w-4 text-green-600" />
    if (formData.access_tier_ids?.length === 0) return <Users className="h-4 w-4 text-blue-600" />
    return <Lock className="h-4 w-4 text-purple-600" />
  }

  const getAccessLevelText = () => {
    if (formData.is_public) return "Public - Everyone can see"
    if (formData.access_tier_ids?.length === 0) return "Subscribers - All subscribers can see"
    return `Tier Access - ${formData.access_tier_ids?.length} tier(s) selected`
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
          <DialogDescription>
            Share content with your subscribers. Choose the type of content and access level.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {/* Media Upload/Record Section */}
          {formData.content_type !== 'text' || (!formData.video_url && !formData.image_url) ? (
            <>
              {/* Tab Selector */}
              <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                <Button
                  variant={uploadMode === 'upload' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setUploadMode('upload')}
                  className="flex-1 gap-2"
                >
                  <Upload className="h-4 w-4" />
                  Upload Media
                </Button>
                <Button
                  variant={uploadMode === 'record' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setUploadMode('record')}
                  className="flex-1 gap-2"
                >
                  <Camera className="h-4 w-4" />
                  Record Video
                </Button>
              </div>

              {/* Upload Section */}
              {uploadMode === 'upload' && (
                <Card className="border-2 border-dashed border-purple-300 bg-purple-50/50">
                  <CardContent className="p-8">
                    <div
                      {...getRootProps()}
                      className={`flex flex-col items-center justify-center py-12 px-6 rounded-lg transition-all cursor-pointer hover:bg-purple-50 ${
                        isDragActive ? 'bg-purple-100 border-purple-400' : ''
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="h-12 w-12 mb-4 transition-all text-gray-400" />
                      <p className="text-center text-gray-600 mb-2">
                        {isDragActive
                          ? "Drop the file here..."
                          : "Drag & drop media here, or click to browse"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Supported formats: MP4, MOV, AVI, WebM, JPG, PNG, GIF
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Record Section */}
              {uploadMode === 'record' && (
                <Card className="border-2 border-purple-300">
                  <CardContent className="p-4">
                    <VideoRecorder
                      maxDuration={180}
                      onRecordingComplete={handleRecordingComplete}
                      enableWatermark={false}
                      className="border-0 shadow-none"
                    />
                  </CardContent>
                </Card>
              )}
            </>
          ) : null}

          {/* Upload Progress */}
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="space-y-2">
              <Label>Uploading...</Label>
              <Progress value={uploadProgress} />
            </div>
          )}

          {/* Media Preview */}
          {(formData.video_url || formData.image_url) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Media Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {formData.content_type === 'video' && formData.video_url && (
                  <video
                    src={formData.video_url}
                    controls
                    className="w-full h-48 object-cover rounded-md"
                  />
                )}
                {formData.content_type === 'image' && formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                )}
              </CardContent>
            </Card>
          )}

          {/* Title and Description */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter post title..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Add a description (optional)..."
              rows={3}
            />
          </div>

          {/* Access Control */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                {getAccessLevelIcon()}
                Access Control
              </CardTitle>
              <CardDescription className="text-xs">
                {getAccessLevelText()}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Switch
                  id="public"
                  checked={formData.is_public}
                  onCheckedChange={(checked) => handleInputChange('is_public', checked)}
                />
                <Label htmlFor="public" className="text-sm">
                  Make this post public
                </Label>
              </div>

              {!formData.is_public && (
                <div>
                  <Label className="text-sm font-medium">Tier Access</Label>
                  {loadingTiers ? (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="ml-2 text-sm text-gray-500">Loading tiers...</span>
                    </div>
                  ) : subscriptionTiers.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      {subscriptionTiers.map((tier) => (
                        <div key={tier.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={tier.id}
                            checked={formData.access_tier_ids?.includes(tier.id) || false}
                            onCheckedChange={(checked) => handleTierToggle(tier.id, checked as boolean)}
                          />
                          <Label htmlFor={tier.id} className="text-sm flex items-center gap-2">
                            {tier.name}
                            <Badge variant="outline" className="text-xs">
                              ${tier.price}/mo
                            </Badge>
                          </Label>
                        </div>
                      ))}
                      <p className="text-xs text-gray-500 mt-2">
                        {formData.access_tier_ids?.length === 0 
                          ? "All subscribers will have access" 
                          : `Only subscribers of selected tier(s) will have access`}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">
                      No subscription tiers configured. All subscribers will have access.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Post Options */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="preview"
                checked={formData.is_preview}
                onCheckedChange={(checked) => handleInputChange('is_preview', checked)}
              />
              <Label htmlFor="preview" className="text-sm flex items-center gap-1">
                <Eye className="h-3 w-3" />
                Preview Post
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.is_featured}
                onCheckedChange={(checked) => handleInputChange('is_featured', checked)}
              />
              <Label htmlFor="featured" className="text-sm flex items-center gap-1">
                <Star className="h-3 w-3" />
                Featured
              </Label>
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <Label>Post Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Post'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}