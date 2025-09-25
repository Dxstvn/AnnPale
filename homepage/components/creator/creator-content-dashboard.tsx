"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useSupabaseAuth } from "@/contexts/supabase-auth-compat"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
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
import {
  Upload,
  Search,
  Grid3x3,
  List,
  MoreVertical,
  Trash2,
  Edit,
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
  RefreshCw,
  Plus,
  Check,
  X,
  Filter,
  FolderPlus
} from "lucide-react"
import { PostInteractions } from "@/components/ui/post-interactions"
import { useDropzone } from 'react-dropzone'
import { format, formatDistanceToNow } from "date-fns"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"
import { Post, PostFilters, SubscriptionTier } from "@/types/posts"
import { PostCreationDialog } from "./post-creation-dialog"
import { useToast } from "@/hooks/use-toast"

interface CreatorContentDashboardProps {
  subscriptionTiers: SubscriptionTier[]
}


export function CreatorContentDashboard({ subscriptionTiers }: CreatorContentDashboardProps) {
  const t = useTranslations('creator')
  const { user } = useSupabaseAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPosts, setSelectedPosts] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [activeTab, setActiveTab] = useState("all")
  const [showUploadZone, setShowUploadZone] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [filters, setFilters] = useState<PostFilters>({
    content_type: 'all',
    status: 'all',
    access_level: 'all'
  })

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

  // Drag and drop configuration
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles)
    // This would trigger the post creation dialog with pre-loaded media
    setShowUploadZone(false)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.webm'],
      'image/*': ['.jpg', '.jpeg', '.png', '.gif', '.webp']
    },
    multiple: true
  })

  const handleSelectPost = (postId: string) => {
    if (selectedPosts.includes(postId)) {
      setSelectedPosts(selectedPosts.filter(id => id !== postId))
    } else {
      setSelectedPosts([...selectedPosts, postId])
    }
  }

  const handleSelectAll = () => {
    if (selectedPosts.length === filteredPosts.length) {
      setSelectedPosts([])
    } else {
      setSelectedPosts(filteredPosts.map(p => p.id))
    }
  }

  const handleBulkDelete = async () => {
    try {
      await Promise.all(selectedPosts.map(postId => 
        fetch(`/api/creator/posts/${postId}`, { method: 'DELETE' })
      ))
      
      toast({
        title: "Posts deleted",
        description: `${selectedPosts.length} posts have been deleted.`
      })
      
      setSelectedPosts([])
      setIsSelecting(false)
      loadPosts()
    } catch (error) {
      toast({
        title: "Failed to delete posts",
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
        body: JSON.stringify({ ...post, status: newStatus })
      })
      
      if (!response.ok) throw new Error('Failed to update post')
      
      setPosts(prev => prev.map(p => 
        p.id === post.id ? { ...p, status: newStatus } : p
      ))
      
      toast({
        title: newStatus === 'published' ? "Post published" : "Post unpublished",
        description: `Your post is now ${newStatus}.`
      })
    } catch (error) {
      toast({
        title: "Failed to update post",
        description: "Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleToggleFeatured = async (post: Post) => {
    try {
      const newFeatured = !post.is_featured
      const response = await fetch(`/api/creator/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...post, is_featured: newFeatured })
      })
      
      if (!response.ok) throw new Error('Failed to update post')
      
      setPosts(prev => prev.map(p => 
        p.id === post.id ? { ...p, is_featured: newFeatured } : p
      ))
      
      toast({
        title: newFeatured ? "Post featured" : "Post unfeatured",
        description: `Your post is ${newFeatured ? 'now featured' : 'no longer featured'}.`
      })
    } catch (error) {
      toast({
        title: "Failed to update post",
        description: "Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleDeletePost = async (post: Post) => {
    try {
      const response = await fetch(`/api/creator/posts/${post.id}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete post')
      
      setPosts(prev => prev.filter(p => p.id !== post.id))
      
      toast({
        title: "Post deleted",
        description: "Your post has been deleted successfully."
      })
    } catch (error) {
      toast({
        title: "Failed to delete post",
        description: "Please try again.",
        variant: "destructive"
      })
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadPosts()
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { label: "Published", className: "bg-green-500 text-white" },
      draft: { label: "Draft", className: "bg-gray-500 text-white" },
      archived: { label: "Archived", className: "bg-orange-500 text-white" }
    }
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const getContentTypeIcon = (contentType: string) => {
    switch (contentType) {
      case 'video': return <Video className="h-4 w-4" />
      case 'image': return <ImageIcon className="h-4 w-4" />
      case 'text': return <FileText className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getAccessLevelIcon = (post: Post) => {
    if (post.is_public) return <Globe className="h-3 w-3 text-green-600" />
    if (post.access_tier_ids?.length === 0) return <Users className="h-3 w-3 text-blue-600" />
    return <Lock className="h-3 w-3 text-purple-600" />
  }

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.description?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesTab = activeTab === 'all' || post.status === activeTab
    return matchesSearch && matchesTab
  })

  const postStats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    drafts: posts.filter(p => p.status === 'draft').length,
    archived: posts.filter(p => p.status === 'archived').length,
    totalViews: posts.reduce((sum, p) => sum + p.views_count, 0),
    totalLikes: posts.reduce((sum, p) => sum + p.likes_count, 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }

  return (
    <TooltipProvider>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('subscriber_content')}</h1>
              <p className="text-gray-600 mt-1">{t('manage_posts')}</p>
            </div>
            <div className="flex items-center gap-3">
              {isSelecting && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    {t('select_all')} ({selectedPosts.length}/{filteredPosts.length})
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={selectedPosts.length === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('delete_selected')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsSelecting(false)
                      setSelectedPosts([])
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <PostCreationDialog
                onPostCreated={() => loadPosts()}
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Posts</p>
                    <p className="text-2xl font-bold text-gray-900">{postStats.total}</p>
                  </div>
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Published</p>
                    <p className="text-2xl font-bold text-green-600">{postStats.published}</p>
                  </div>
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Views</p>
                    <p className="text-2xl font-bold text-blue-600">{postStats.totalViews.toLocaleString()}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Likes</p>
                    <p className="text-2xl font-bold text-pink-600">{postStats.totalLikes.toLocaleString()}</p>
                  </div>
                  <Heart className="h-8 w-8 text-pink-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Upload Zone - Collapsible with proper drag-drop styling */}
        {showUploadZone && (
          <Card className="mb-6 border-2 border-dashed border-purple-300 bg-purple-50/50">
            <CardContent className="p-8">
              <div
                {...getRootProps()}
                className={cn(
                  "flex flex-col items-center justify-center py-12 px-6 rounded-lg transition-all cursor-pointer",
                  isDragActive ? "bg-purple-100 border-purple-500 scale-[1.02]" : "hover:bg-purple-50"
                )}
              >
                <input {...getInputProps()} />
                <Upload className={cn(
                  "h-12 w-12 mb-4 transition-all",
                  isDragActive ? "text-purple-600 animate-bounce" : "text-gray-400"
                )} />
                <p className="text-center text-gray-600 mb-2">
                  {t('drag_drop_media')}
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: MP4, MOV, AVI, WebM, JPG, PNG, GIF
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search Bar */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('search_posts')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="views">Most Views</SelectItem>
                <SelectItem value="likes">Most Likes</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3x3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Categories & Analytics */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{t('categories')}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => console.log('Create category')}
                  >
                    <FolderPlus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors",
                      activeTab === 'all' ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <span className="text-sm font-medium">{t('all_posts')}</span>
                    </div>
                    <span className="text-xs text-gray-500">{postStats.total}</span>
                  </button>
                  
                  <button
                    onClick={() => setActiveTab('published')}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors",
                      activeTab === 'published' ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-green-500" />
                      <span className="text-sm font-medium">Published</span>
                    </div>
                    <span className="text-xs text-gray-500">{postStats.published}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('draft')}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors",
                      activeTab === 'draft' ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-gray-500" />
                      <span className="text-sm font-medium">Drafts</span>
                    </div>
                    <span className="text-xs text-gray-500">{postStats.drafts}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('archived')}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors",
                      activeTab === 'archived' ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-orange-500" />
                      <span className="text-sm font-medium">Archived</span>
                    </div>
                    <span className="text-xs text-gray-500">{postStats.archived}</span>
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Analytics */}
            <Card className="mt-4">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Avg. Views per Post</span>
                    <span className="font-medium">
                      {postStats.total > 0 ? Math.round(postStats.totalViews / postStats.total) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Engagement Rate</span>
                    <span className="font-medium">
                      {postStats.totalViews > 0 ? 
                        ((postStats.totalLikes / postStats.totalViews) * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Active Tiers</span>
                    <span className="font-medium">{subscriptionTiers.length}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Posts Grid/List */}
          <div className="lg:col-span-3">
                {filteredPosts.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                      <p className="text-gray-500 mb-4">
                        {activeTab === 'all' 
                          ? "Create your first post to get started with subscriber content."
                          : `No ${activeTab} posts found. Try adjusting your filters.`
                        }
                      </p>
                      <PostCreationDialog
                        onPostCreated={() => loadPosts()}
                      />
                    </CardContent>
                  </Card>
                ) : viewMode === 'grid' ? (
                  // Grid View
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredPosts.map((post) => (
                      <Card 
                        key={post.id} 
                        className={cn(
                          "group cursor-pointer transition-all hover:shadow-lg",
                          selectedPosts.includes(post.id) && "ring-2 ring-purple-500"
                        )}
                      >
                        <div className="relative aspect-video bg-gray-100">
                          {isSelecting && (
                            <div className="absolute top-2 left-2 z-10">
                              <Checkbox
                                checked={selectedPosts.includes(post.id)}
                                onCheckedChange={() => handleSelectPost(post.id)}
                                className="bg-white"
                              />
                            </div>
                          )}
                          {post.thumbnail_url ? (
                            <img
                              src={post.thumbnail_url}
                              alt={post.title}
                              className="w-full h-full object-cover rounded-t-lg"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-t-lg">
                              {getContentTypeIcon(post.content_type)}
                            </div>
                          )}
                          <div className="absolute top-2 right-2 flex gap-1">
                            {getAccessLevelIcon(post)}
                            {post.is_featured && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toast({
                                    title: "View Post",
                                    description: `Viewing "${post.title}"`
                                  })
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="secondary"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toast({
                                    title: "Edit Post", 
                                    description: `Editing "${post.title}"`
                                  })
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-sm line-clamp-2">{post.title}</h3>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleToggleVisibility(post)}>
                                  {post.status === 'published' ? (
                                    <>
                                      <EyeOff className="h-4 w-4 mr-2" />
                                      Unpublish
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
                                      Unfeature
                                    </>
                                  ) : (
                                    <>
                                      <Star className="h-4 w-4 mr-2" />
                                      Feature
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-red-600"
                                  onClick={() => {
                                    setSelectedPost(post)
                                    setDeleteDialogOpen(true)
                                  }}
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                            <span>{format(new Date(post.created_at), "MMM d, yyyy")}</span>
                            <span className="capitalize">{post.content_type}</span>
                          </div>
                          <div className="flex items-center justify-between mb-2">
                            <PostInteractions
                              postId={post.id}
                              creatorId={post.creator_id}
                              initialLikes={post.likes_count}
                              initialComments={post.comments_count}
                              initialViews={post.views_count}
                              isLiked={post.is_liked}
                              isViewed={post.is_viewed}
                              isAuthenticated={!!user}
                              currentUserId={user?.id}
                              size="sm"
                              className="text-gray-500"
                            />
                            {getStatusBadge(post.status)}
                          </div>
                          {post.access_tier_ids && post.access_tier_ids.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {post.access_tier_ids.map((tierId) => {
                                const tier = subscriptionTiers.find(t => t.id === tierId)
                                return tier ? (
                                  <Badge key={tierId} variant="outline" className="text-xs">
                                    {tier.name}
                                  </Badge>
                                ) : null
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  // List View
                  <div className="space-y-2">
                    {filteredPosts.map((post) => (
                      <Card 
                        key={post.id}
                        className={cn(
                          "transition-all hover:shadow-md",
                          selectedPosts.includes(post.id) && "ring-2 ring-purple-500"
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            {isSelecting && (
                              <Checkbox
                                checked={selectedPosts.includes(post.id)}
                                onCheckedChange={() => handleSelectPost(post.id)}
                              />
                            )}
                            <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                              {post.thumbnail_url ? (
                                <img
                                  src={post.thumbnail_url}
                                  alt={post.title}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  {getContentTypeIcon(post.content_type)}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-medium truncate">{post.title}</h3>
                                <div className="flex items-center gap-2">
                                  {getStatusBadge(post.status)}
                                  {post.is_featured && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                                  {getAccessLevelIcon(post)}
                                </div>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span className="capitalize">{post.content_type}</span>
                                <span>{format(new Date(post.created_at), "MMM d, yyyy")}</span>
                                <PostInteractions
                                  postId={post.id}
                                  creatorId={post.creator_id}
                                  initialLikes={post.likes_count}
                                  initialComments={post.comments_count}
                                  initialViews={post.views_count}
                                  isLiked={post.is_liked}
                                  isViewed={post.is_viewed}
                                  isAuthenticated={!!user}
                                  currentUserId={user?.id}
                                  size="sm"
                                />
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View Post</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={() => handleToggleVisibility(post)}>
                                    {post.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {post.status === 'published' ? 'Unpublish' : 'Publish'}
                                </TooltipContent>
                              </Tooltip>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleToggleFeatured(post)}>
                                    {post.is_featured ? (
                                      <>
                                        <StarOff className="h-4 w-4 mr-2" />
                                        Unfeature
                                      </>
                                    ) : (
                                      <>
                                        <Star className="h-4 w-4 mr-2" />
                                        Feature
                                      </>
                                    )}
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-red-600"
                                    onClick={() => {
                                      setSelectedPost(post)
                                      setDeleteDialogOpen(true)
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
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
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Post</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{selectedPost?.title}"? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (selectedPost) {
                    handleDeletePost(selectedPost)
                    setDeleteDialogOpen(false)
                    setSelectedPost(null)
                  }
                }}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  )
}