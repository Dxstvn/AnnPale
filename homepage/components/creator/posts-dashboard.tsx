"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Search, 
  Filter, 
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  StarOff,
  Users,
  Heart,
  MessageSquare,
  Video,
  Image as ImageIcon,
  FileText,
  Calendar,
  TrendingUp,
  Globe,
  Lock,
  RefreshCw
} from "lucide-react"
import { Post, PostFilters, SubscriptionTier } from "@/types/posts"
import { PostCreationDialog } from "./post-creation-dialog"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow, format } from "date-fns"

interface PostsDashboardProps {
  subscriptionTiers: SubscriptionTier[]
}

export function PostsDashboard({ subscriptionTiers }: PostsDashboardProps) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<PostFilters>({
    content_type: 'all',
    status: 'all',
    access_level: 'all'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  
  const { toast } = useToast()
  const router = useRouter()

  // Load posts
  const loadPosts = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.content_type !== 'all') params.set('contentType', filters.content_type)
      if (filters.status !== 'all') params.set('status', filters.status)
      
      const response = await fetch(`/api/creator/posts?${params.toString()}`)
      if (!response.ok) throw new Error('Failed to load posts')
      
      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Load posts error:', error)
      toast({
        title: "Failed to load posts",
        description: "Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [filters])

  const handleRefresh = () => {
    setRefreshing(true)
    loadPosts()
  }

  const handleToggleFeatured = async (post: Post) => {
    try {
      const response = await fetch(`/api/creator/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post,
          is_featured: !post.is_featured
        })
      })

      if (!response.ok) throw new Error('Failed to update post')

      setPosts(prev => prev.map(p => 
        p.id === post.id ? { ...p, is_featured: !p.is_featured } : p
      ))

      toast({
        title: post.is_featured ? "Removed from featured" : "Added to featured",
        description: `Post "${post.title}" has been updated.`
      })
    } catch (error) {
      console.error('Toggle featured error:', error)
      toast({
        title: "Failed to update post",
        description: "Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleToggleVisibility = async (post: Post) => {
    try {
      const newStatus = post.status === 'published' ? 'draft' : 'published'
      
      const response = await fetch(`/api/creator/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...post,
          status: newStatus
        })
      })

      if (!response.ok) throw new Error('Failed to update post')

      setPosts(prev => prev.map(p => 
        p.id === post.id ? { ...p, status: newStatus } : p
      ))

      toast({
        title: newStatus === 'published' ? "Post published" : "Post drafted",
        description: `Post "${post.title}" is now ${newStatus}.`
      })
    } catch (error) {
      console.error('Toggle visibility error:', error)
      toast({
        title: "Failed to update post",
        description: "Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleDeletePost = async () => {
    if (!selectedPost) return
    
    try {
      const response = await fetch(`/api/creator/posts/${selectedPost.id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Failed to delete post')

      setPosts(prev => prev.filter(p => p.id !== selectedPost.id))
      
      toast({
        title: "Post archived",
        description: `Post "${selectedPost.title}" has been archived.`
      })
    } catch (error) {
      console.error('Delete post error:', error)
      toast({
        title: "Failed to archive post",
        description: "Please try again.",
        variant: "destructive"
      })
    } finally {
      setDeleteDialogOpen(false)
      setSelectedPost(null)
    }
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />
      case 'image': return <ImageIcon className="h-4 w-4" />
      case 'text': return <FileText className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getAccessLevelIcon = (post: Post) => {
    if (post.is_public) return <Globe className="h-4 w-4 text-green-600" />
    if (!post.access_tier_ids || post.access_tier_ids.length === 0) return <Users className="h-4 w-4 text-blue-600" />
    return <Lock className="h-4 w-4 text-purple-600" />
  }

  const getAccessLevelText = (post: Post) => {
    if (post.is_public) return "Public"
    if (!post.access_tier_ids || post.access_tier_ids.length === 0) return "All Subscribers"
    return `${post.access_tier_ids.length} Tier(s)`
  }

  // Filter posts based on search and filters
  const filteredPosts = posts.filter(post => {
    const matchesSearch = searchTerm === '' || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesAccessLevel = filters.access_level === 'all' ||
      (filters.access_level === 'public' && post.is_public) ||
      (filters.access_level === 'subscribers' && !post.is_public && (!post.access_tier_ids || post.access_tier_ids.length === 0)) ||
      (filters.access_level === 'tiers' && post.access_tier_ids && post.access_tier_ids.length > 0)
    
    const matchesFeatured = filters.is_featured === undefined || post.is_featured === filters.is_featured

    return matchesSearch && matchesAccessLevel && matchesFeatured
  })

  // Statistics
  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    drafts: posts.filter(p => p.status === 'draft').length,
    featured: posts.filter(p => p.is_featured).length,
    totalViews: posts.reduce((sum, p) => sum + p.views_count, 0),
    totalLikes: posts.reduce((sum, p) => sum + p.likes_count, 0)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Content Management</h2>
          <p className="text-muted-foreground">
            Manage your posts and track engagement
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={refreshing}
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <PostCreationDialog 
            subscriptionTiers={subscriptionTiers}
            onPostCreated={() => loadPosts()}
          />
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Posts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
            <p className="text-xs text-muted-foreground">Published</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">{stats.drafts}</div>
            <p className="text-xs text-muted-foreground">Drafts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{stats.featured}</div>
            <p className="text-xs text-muted-foreground">Featured</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Views</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-red-600">{stats.totalLikes.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Likes</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select
          value={filters.content_type}
          onValueChange={(value) => setFilters(prev => ({ ...prev, content_type: value as any }))}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="image">Images</SelectItem>
            <SelectItem value="text">Text Posts</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status}
          onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as any }))}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Drafts</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.access_level}
          onValueChange={(value) => setFilters(prev => ({ ...prev, access_level: value as any }))}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Access</SelectItem>
            <SelectItem value="public">Public</SelectItem>
            <SelectItem value="subscribers">Subscribers</SelectItem>
            <SelectItem value="tiers">Tier Access</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredPosts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">No posts found. Create your first post!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getContentTypeIcon(post.content_type)}
                      <h3 className="font-semibold">{post.title}</h3>
                      {post.is_featured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    
                    {post.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {post.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        {getAccessLevelIcon(post)}
                        {getAccessLevelText(post)}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {post.views_count}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4" />
                        {post.likes_count}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        {post.comments_count}
                      </div>
                      
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>
                      {post.status}
                    </Badge>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/creator/posts/${post.id}/edit`)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => handleToggleVisibility(post)}>
                          {post.status === 'published' ? (
                            <>
                              <EyeOff className="h-4 w-4 mr-2" />
                              Make Draft
                            </>
                          ) : (
                            <>
                              <Eye className="h-4 w-4 mr-2" />
                              Publish
                            </>
                          )}
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem onClick={() => handleToggleFeatured(post)}>
                          {post.is_featured ? (
                            <>
                              <StarOff className="h-4 w-4 mr-2" />
                              Remove from Featured
                            </>
                          ) : (
                            <>
                              <Star className="h-4 w-4 mr-2" />
                              Add to Featured
                            </>
                          )}
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => {
                            setSelectedPost(post)
                            setDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Post?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive "{selectedPost?.title}"? 
              This will hide it from your subscribers but keep it in your archives.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePost}>
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}