"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FolderOpen,
  Save,
  Video,
  Star,
  Archive,
  Search,
  Filter,
  Grid,
  List,
  Clock,
  Eye,
  Download,
  Share2,
  MoreHorizontal,
  Calendar,
  DollarSign,
  ThumbsUp,
  Play,
  Edit,
  Trash2,
  Copy,
  Tag
} from "lucide-react"
import { cn } from "@/lib/utils"

interface VideoContent {
  id: string
  title: string
  thumbnail: string
  duration: number
  category: 'drafts' | 'published' | 'templates' | 'highlights' | 'archive'
  status: 'recording' | 'preview' | 'editing' | 'uploading' | 'processing' | 'quality-check' | 'ready' | 'delivered' | 'viewed'
  customer?: string
  occasion?: string
  createdDate: string
  lastModified: string
  earnings?: number
  views?: number
  rating?: number
  fileSize: number
  metadata: {
    tags: string[]
    notes: string
    isTemplate?: boolean
    isFeatured?: boolean
  }
}

interface VideoLibraryOrganizationProps {
  videos: VideoContent[]
  onVideoSelect?: (video: VideoContent) => void
  onBulkOperation?: (operation: string, videoIds: string[]) => void
  onCreateTemplate?: (videoId: string) => void
  onFeatureVideo?: (videoId: string) => void
}

export function VideoLibraryOrganization({
  videos,
  onVideoSelect,
  onBulkOperation,
  onCreateTemplate,
  onFeatureVideo
}: VideoLibraryOrganizationProps) {
  const [activeCategory, setActiveCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set())
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'earnings' | 'rating'>('date')

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatFileSize = (bytes: number) => {
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const getStatusColor = (status: VideoContent['status']) => {
    switch (status) {
      case 'recording': return 'bg-red-100 text-red-800'
      case 'preview': return 'bg-blue-100 text-blue-800'
      case 'editing': return 'bg-yellow-100 text-yellow-800'
      case 'uploading': return 'bg-purple-100 text-purple-800'
      case 'processing': return 'bg-orange-100 text-orange-800'
      case 'quality-check': return 'bg-indigo-100 text-indigo-800'
      case 'ready': return 'bg-green-100 text-green-800'
      case 'delivered': return 'bg-emerald-100 text-emerald-800'
      case 'viewed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'drafts': return Save
      case 'published': return Video
      case 'templates': return Copy
      case 'highlights': return Star
      case 'archive': return Archive
      default: return FolderOpen
    }
  }

  const getCategoryStats = (category: string) => {
    const categoryVideos = category === 'all' 
      ? videos 
      : videos.filter(v => v.category === category)
    
    return {
      count: categoryVideos.length,
      totalSize: categoryVideos.reduce((sum, v) => sum + v.fileSize, 0),
      totalEarnings: categoryVideos.reduce((sum, v) => sum + (v.earnings || 0), 0),
      avgRating: categoryVideos.filter(v => v.rating).reduce((sum, v) => sum + (v.rating || 0), 0) / categoryVideos.filter(v => v.rating).length || 0
    }
  }

  const filteredVideos = videos.filter(video => {
    const matchesCategory = activeCategory === 'all' || video.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.customer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.occasion?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.metadata.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    return matchesCategory && matchesSearch
  }).sort((a, b) => {
    switch (sortBy) {
      case 'name': return a.title.localeCompare(b.title)
      case 'earnings': return (b.earnings || 0) - (a.earnings || 0)
      case 'rating': return (b.rating || 0) - (a.rating || 0)
      case 'date':
      default: return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    }
  })

  const categories = [
    { id: 'all', name: 'All Videos', icon: FolderOpen },
    { id: 'drafts', name: 'Drafts', icon: Save },
    { id: 'published', name: 'Published', icon: Video },
    { id: 'templates', name: 'Templates', icon: Copy },
    { id: 'highlights', name: 'Highlights', icon: Star },
    { id: 'archive', name: 'Archive', icon: Archive }
  ]

  const handleVideoSelect = (videoId: string) => {
    const newSelected = new Set(selectedVideos)
    if (newSelected.has(videoId)) {
      newSelected.delete(videoId)
    } else {
      newSelected.add(videoId)
    }
    setSelectedVideos(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedVideos.size === filteredVideos.length) {
      setSelectedVideos(new Set())
    } else {
      setSelectedVideos(new Set(filteredVideos.map(v => v.id)))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Search and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Video Library</h2>
          <p className="text-sm text-gray-600">
            Manage your content across {videos.length} videos
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search videos, customers, occasions..."
              className="pl-10 w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar - Categories */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon
                const stats = getCategoryStats(category.id)
                const isActive = activeCategory === category.id

                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors",
                      isActive ? "bg-purple-50 border border-purple-200" : "hover:bg-gray-50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={cn(
                        "h-5 w-5",
                        isActive ? "text-purple-600" : "text-gray-600"
                      )} />
                      <span className={cn(
                        "font-medium",
                        isActive ? "text-purple-900" : "text-gray-700"
                      )}>
                        {category.name}
                      </span>
                    </div>
                    <Badge variant={isActive ? "default" : "secondary"} className="text-xs">
                      {stats.count}
                    </Badge>
                  </button>
                )
              })}
            </CardContent>
          </Card>

          {/* Category Stats */}
          {activeCategory !== 'all' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Category Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {(() => {
                  const stats = getCategoryStats(activeCategory)
                  return (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Total Videos:</span>
                        <span className="font-medium">{stats.count}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Storage Used:</span>
                        <span className="font-medium">{formatFileSize(stats.totalSize)}</span>
                      </div>
                      {stats.totalEarnings > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total Earnings:</span>
                          <span className="font-medium text-green-600">{formatCurrency(stats.totalEarnings)}</span>
                        </div>
                      )}
                      {stats.avgRating > 0 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Avg Rating:</span>
                          <span className="font-medium">{stats.avgRating.toFixed(1)} ⭐</span>
                        </div>
                      )}
                    </>
                  )
                })()}
              </CardContent>
            </Card>
          )}

          {/* Bulk Operations */}
          {selectedVideos.size > 0 && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Bulk Actions</CardTitle>
                <p className="text-sm text-gray-600">{selectedVideos.size} selected</p>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => onBulkOperation?.('categorize', Array.from(selectedVideos))}
                >
                  <Tag className="h-4 w-4 mr-2" />
                  Categorize
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => onBulkOperation?.('export', Array.from(selectedVideos))}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={() => onBulkOperation?.('share', Array.from(selectedVideos))}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Collection
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start text-red-600 hover:text-red-700"
                  onClick={() => onBulkOperation?.('delete', Array.from(selectedVideos))}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-4">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-lg border">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
                className="text-sm"
              >
                {selectedVideos.size === filteredVideos.length ? 'Deselect All' : 'Select All'}
              </Button>
              <div className="text-sm text-gray-600">
                {filteredVideos.length} videos found
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="date">Date Created</option>
                <option value="name">Name</option>
                <option value="earnings">Earnings</option>
                <option value="rating">Rating</option>
              </select>
            </div>
          </div>

          {/* Video Grid/List */}
          <div className={cn(
            "grid gap-4",
            viewMode === 'grid' 
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" 
              : "grid-cols-1"
          )}>
            {filteredVideos.map((video) => {
              const isSelected = selectedVideos.has(video.id)
              
              if (viewMode === 'list') {
                return (
                  <Card 
                    key={video.id} 
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-md",
                      isSelected && "ring-2 ring-purple-500 bg-purple-50"
                    )}
                    onClick={() => handleVideoSelect(video.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-24 h-16 bg-gray-900 rounded overflow-hidden flex-shrink-0">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Play className="h-6 w-6 text-white opacity-70" />
                          </div>
                          <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                            {formatDuration(video.duration)}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{video.title}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span>{video.customer || 'No customer'}</span>
                            <span>{video.occasion || 'General'}</span>
                            <span>{new Date(video.createdDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={getStatusColor(video.status)} variant="secondary">
                              {video.status}
                            </Badge>
                            {video.metadata.isFeatured && (
                              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          {video.earnings && (
                            <div className="text-right">
                              <p className="font-medium text-green-600">{formatCurrency(video.earnings)}</p>
                              <p className="text-xs">earnings</p>
                            </div>
                          )}
                          {video.rating && (
                            <div className="text-right">
                              <p className="font-medium">{video.rating} ⭐</p>
                              <p className="text-xs">rating</p>
                            </div>
                          )}
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              }

              return (
                <Card 
                  key={video.id} 
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    isSelected && "ring-2 ring-purple-500 bg-purple-50"
                  )}
                  onClick={() => handleVideoSelect(video.id)}
                >
                  <div className="relative aspect-video bg-gray-900 rounded-t-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Play className="h-8 w-8 text-white opacity-70" />
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {formatDuration(video.duration)}
                    </div>
                    {video.metadata.isFeatured && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-yellow-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <h3 className="font-medium text-gray-900 truncate mb-2">{video.title}</h3>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>{video.customer || 'Template'}</span>
                        <Badge className={getStatusColor(video.status)} variant="secondary">
                          {video.status}
                        </Badge>
                      </div>
                      
                      {video.occasion && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{video.occasion}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span>{formatFileSize(video.fileSize)}</span>
                        <span>{new Date(video.createdDate).toLocaleDateString()}</span>
                      </div>

                      {(video.earnings || video.rating || video.views) && (
                        <div className="flex items-center justify-between pt-2 border-t">
                          {video.earnings && (
                            <div className="flex items-center gap-1 text-green-600">
                              <DollarSign className="h-3 w-3" />
                              <span className="font-medium">{formatCurrency(video.earnings)}</span>
                            </div>
                          )}
                          {video.rating && (
                            <div className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" />
                              <span>{video.rating}</span>
                            </div>
                          )}
                          {video.views && (
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{video.views}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          onVideoSelect?.(video)
                        }}
                      >
                        <Play className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      {video.category === 'published' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onCreateTemplate?.(video.id)
                          }}
                        >
                          <Copy className="h-3 w-3 mr-1" />
                          Template
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center py-12">
              <Video className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No videos found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery ? 'Try adjusting your search terms' : 'Start creating content to build your library'}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <a href="/creator/upload">Create Your First Video</a>
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}