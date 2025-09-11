'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  GripVertical,
  Image,
  Video,
  FileText,
  Eye,
  EyeOff,
  Clock,
  Loader2,
  Upload,
  X
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface PreviewPost {
  id: string
  creator_id: string
  title: string
  description: string | null
  content_type: 'video' | 'image' | 'text'
  thumbnail_url: string | null
  video_url: string | null
  image_url: string | null
  text_content: string | null
  is_preview: boolean
  preview_duration: number | null
  preview_order: number
  is_public: boolean
  tier_required: string | null
  published_at: string
  created_at: string
  updated_at: string
}

interface PostFormData {
  title: string
  description: string
  content_type: 'video' | 'image' | 'text'
  thumbnail_url: string
  video_url: string
  image_url: string
  text_content: string
  preview_duration: string
  is_public: boolean
}

function SortablePostItem({ post, onEdit, onDelete }: { 
  post: PreviewPost
  onEdit: (post: PreviewPost) => void
  onDelete: (post: PreviewPost) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: post.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const getContentIcon = () => {
    switch (post.content_type) {
      case 'video': return <Video className="h-4 w-4" />
      case 'image': return <Image className="h-4 w-4" />
      case 'text': return <FileText className="h-4 w-4" />
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
    >
      <button
        className="cursor-grab hover:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5 text-gray-400" />
      </button>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          {getContentIcon()}
          <h4 className="font-medium">{post.title}</h4>
          <Badge variant={post.is_public ? 'default' : 'secondary'}>
            {post.is_public ? 'Public' : 'Private'}
          </Badge>
          {post.preview_duration && (
            <Badge variant="outline">
              <Clock className="h-3 w-3 mr-1" />
              {post.preview_duration}s
            </Badge>
          )}
        </div>
        {post.description && (
          <p className="text-sm text-gray-600 line-clamp-1">{post.description}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          Published {formatDistanceToNow(new Date(post.published_at), { addSuffix: true })}
        </p>
      </div>

      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(post)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(post)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export function PreviewPostsManager() {
  const { toast } = useToast()
  const [posts, setPosts] = useState<PreviewPost[]>([])
  const [loading, setLoading] = useState(true)
  const [editingPost, setEditingPost] = useState<PreviewPost | null>(null)
  const [deletingPost, setDeletingPost] = useState<PreviewPost | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [processing, setProcessing] = useState(false)
  
  const [formData, setFormData] = useState<PostFormData>({
    title: '',
    description: '',
    content_type: 'text',
    thumbnail_url: '',
    video_url: '',
    image_url: '',
    text_content: '',
    preview_duration: '',
    is_public: true
  })

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    loadPosts()
  }, [])

  const loadPosts = async () => {
    try {
      const response = await fetch('/api/creator/preview-posts', {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch posts')
      }

      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Error loading posts:', error)
      toast({
        title: 'Error',
        description: 'Failed to load preview posts',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = posts.findIndex(p => p.id === active.id)
      const newIndex = posts.findIndex(p => p.id === over.id)
      
      const newPosts = arrayMove(posts, oldIndex, newIndex)
      setPosts(newPosts)

      // Update order in backend
      try {
        await fetch('/api/creator/preview-posts/reorder', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            posts: newPosts.map((p, i) => ({ id: p.id, preview_order: i }))
          }),
        })
      } catch (error) {
        console.error('Error updating order:', error)
        toast({
          title: 'Error',
          description: 'Failed to update post order',
          variant: 'destructive',
        })
        // Reload to get correct order
        loadPosts()
      }
    }
  }

  const handleSubmit = async () => {
    if (!formData.title) {
      toast({
        title: 'Validation Error',
        description: 'Please provide a title',
        variant: 'destructive',
      })
      return
    }

    setProcessing(true)
    try {
      const endpoint = editingPost 
        ? `/api/creator/preview-posts/${editingPost.id}`
        : '/api/creator/preview-posts'
      
      const method = editingPost ? 'PATCH' : 'POST'

      const body: any = {
        title: formData.title,
        description: formData.description || null,
        content_type: formData.content_type,
        is_preview: true,
        is_public: formData.is_public,
        preview_duration: formData.preview_duration ? parseInt(formData.preview_duration) : null,
      }

      // Add content based on type
      switch (formData.content_type) {
        case 'video':
          body.video_url = formData.video_url || null
          body.thumbnail_url = formData.thumbnail_url || null
          break
        case 'image':
          body.image_url = formData.image_url || null
          break
        case 'text':
          body.text_content = formData.text_content || null
          break
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error('Failed to save post')
      }

      toast({
        title: 'Success',
        description: editingPost ? 'Post updated successfully' : 'Post created successfully',
      })

      // Reset form and reload
      setFormData({
        title: '',
        description: '',
        content_type: 'text',
        thumbnail_url: '',
        video_url: '',
        image_url: '',
        text_content: '',
        preview_duration: '',
        is_public: true
      })
      setEditingPost(null)
      setIsCreating(false)
      loadPosts()
    } catch (error) {
      console.error('Error saving post:', error)
      toast({
        title: 'Error',
        description: 'Failed to save post',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingPost) return

    setProcessing(true)
    try {
      const response = await fetch(`/api/creator/preview-posts/${deletingPost.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      })

      setDeletingPost(null)
      loadPosts()
    } catch (error) {
      console.error('Error deleting post:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleEdit = (post: PreviewPost) => {
    setFormData({
      title: post.title,
      description: post.description || '',
      content_type: post.content_type,
      thumbnail_url: post.thumbnail_url || '',
      video_url: post.video_url || '',
      image_url: post.image_url || '',
      text_content: post.text_content || '',
      preview_duration: post.preview_duration?.toString() || '',
      is_public: post.is_public
    })
    setEditingPost(post)
    setIsCreating(true)
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Preview Posts</CardTitle>
            <CardDescription>
              Manage posts that non-subscribers see as previews of your content
            </CardDescription>
          </div>
          <Button 
            onClick={() => {
              setIsCreating(true)
              setEditingPost(null)
              setFormData({
                title: '',
                description: '',
                content_type: 'text',
                thumbnail_url: '',
                video_url: '',
                image_url: '',
                text_content: '',
                preview_duration: '',
                is_public: true
              })
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Preview Post
          </Button>
        </CardHeader>
        <CardContent>
          {posts.length === 0 ? (
            <div className="text-center py-8">
              <Eye className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No preview posts created yet</p>
              <p className="text-sm text-gray-500">
                Create preview posts to showcase your content to potential subscribers
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <Alert>
                <AlertDescription>
                  Drag posts to reorder them. The order determines how they appear to non-subscribers.
                </AlertDescription>
              </Alert>
              
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={posts.map(p => p.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {posts.map((post) => (
                    <SortablePostItem
                      key={post.id}
                      post={post}
                      onEdit={handleEdit}
                      onDelete={setDeletingPost}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreating} onOpenChange={(open) => {
        if (!processing) {
          setIsCreating(open)
          if (!open) {
            setEditingPost(null)
          }
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingPost ? 'Edit Preview Post' : 'Create Preview Post'}
            </DialogTitle>
            <DialogDescription>
              Create content that non-subscribers can preview
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter post title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Optional description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Content Type</Label>
              <Select
                value={formData.content_type}
                onValueChange={(value: 'video' | 'image' | 'text') => 
                  setFormData(prev => ({ ...prev, content_type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Text
                    </div>
                  </SelectItem>
                  <SelectItem value="image">
                    <div className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Image
                    </div>
                  </SelectItem>
                  <SelectItem value="video">
                    <div className="flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Video
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Content fields based on type */}
            {formData.content_type === 'text' && (
              <div className="space-y-2">
                <Label htmlFor="text_content">Text Content</Label>
                <Textarea
                  id="text_content"
                  placeholder="Enter your text content"
                  value={formData.text_content}
                  onChange={(e) => setFormData(prev => ({ ...prev, text_content: e.target.value }))}
                  rows={6}
                />
              </div>
            )}

            {formData.content_type === 'image' && (
              <div className="space-y-2">
                <Label htmlFor="image_url">Image URL</Label>
                <Input
                  id="image_url"
                  placeholder="Enter image URL or upload"
                  value={formData.image_url}
                  onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                />
              </div>
            )}

            {formData.content_type === 'video' && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="video_url">Video URL</Label>
                  <Input
                    id="video_url"
                    placeholder="Enter video URL or upload"
                    value={formData.video_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail_url">Thumbnail URL (optional)</Label>
                  <Input
                    id="thumbnail_url"
                    placeholder="Enter thumbnail URL"
                    value={formData.thumbnail_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, thumbnail_url: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preview_duration">Preview Duration (seconds)</Label>
                  <Input
                    id="preview_duration"
                    type="number"
                    placeholder="e.g., 30"
                    value={formData.preview_duration}
                    onChange={(e) => setFormData(prev => ({ ...prev, preview_duration: e.target.value }))}
                  />
                </div>
              </>
            )}

            <div className="flex items-center justify-between">
              <Label htmlFor="is_public" className="flex items-center gap-2">
                <Switch
                  id="is_public"
                  checked={formData.is_public}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_public: checked }))}
                />
                Public post (visible to everyone)
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreating(false)
                setEditingPost(null)
              }}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={processing}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {editingPost ? 'Update' : 'Create'} Post
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingPost} onOpenChange={(open) => {
        if (!processing && !open) {
          setDeletingPost(null)
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Preview Post</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingPost?.title}"?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingPost(null)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Post'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}