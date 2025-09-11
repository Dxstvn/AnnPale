"use client"

import { useState, useRef } from "react"
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
  Globe
} from "lucide-react"
import { CreatePostData, SubscriptionTier } from "@/types/posts"
import { useToast } from "@/hooks/use-toast"

interface PostCreationDialogProps {
  subscriptionTiers: SubscriptionTier[]
  onPostCreated?: (post: any) => void
}

export function PostCreationDialog({ subscriptionTiers, onPostCreated }: PostCreationDialogProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
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
  
  const videoRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleInputChange = (field: keyof CreatePostData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = async (file: File, type: 'video' | 'image') => {
    try {
      setUploadProgress(0)
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

  const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, content_type: 'video' }))
      handleFileUpload(file, 'video')
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, content_type: 'image' }))
      handleFileUpload(file, 'image')
    }
  }

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
          {/* Content Type Selection */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              variant={formData.content_type === 'text' ? 'default' : 'outline'}
              onClick={() => handleInputChange('content_type', 'text')}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              Text
            </Button>
            <Button
              variant={formData.content_type === 'image' ? 'default' : 'outline'}
              onClick={() => {
                handleInputChange('content_type', 'image')
                imageRef.current?.click()
              }}
              className="gap-2"
            >
              <ImageIcon className="h-4 w-4" />
              Image
            </Button>
            <Button
              variant={formData.content_type === 'video' ? 'default' : 'outline'}
              onClick={() => {
                handleInputChange('content_type', 'video')
                videoRef.current?.click()
              }}
              className="gap-2"
            >
              <Video className="h-4 w-4" />
              Video
            </Button>
          </div>

          {/* Hidden file inputs */}
          <input
            ref={videoRef}
            type="file"
            accept="video/*"
            style={{ display: 'none' }}
            onChange={handleVideoSelect}
          />
          <input
            ref={imageRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageSelect}
          />

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

              {!formData.is_public && subscriptionTiers.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Tier Access</Label>
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
                  </div>
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