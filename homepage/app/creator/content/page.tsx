"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Upload, 
  Video, 
  Folder, 
  FolderOpen,
  Search, 
  Filter, 
  Grid3x3, 
  List,
  MoreVertical,
  Download,
  Trash2,
  Edit,
  Share2,
  Eye,
  Calendar,
  Clock,
  Star,
  FileVideo,
  Plus,
  ChevronRight,
  Check,
  X,
  FolderPlus,
  Copy,
  Move,
  Archive,
  Tag,
  Info
} from "lucide-react"
import { useDropzone } from 'react-dropzone'
import { format } from "date-fns"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

// Mock data for video library
const mockVideos = [
  {
    id: "1",
    title: "Birthday Message for Sarah",
    thumbnail: "/images/video-thumb-1.jpg",
    duration: "2:45",
    size: "45.2 MB",
    createdAt: new Date("2024-01-15"),
    views: 1250,
    rating: 4.9,
    status: "published",
    folder: "Birthday Messages",
    tags: ["birthday", "personal", "english"]
  },
  {
    id: "2",
    title: "Graduation Congratulations",
    thumbnail: "/images/video-thumb-2.jpg",
    duration: "1:30",
    size: "28.7 MB",
    createdAt: new Date("2024-01-18"),
    views: 890,
    rating: 4.8,
    status: "published",
    folder: "Graduation",
    tags: ["graduation", "achievement", "french"]
  },
  {
    id: "3",
    title: "Anniversary Wishes",
    thumbnail: "/images/video-thumb-3.jpg",
    duration: "3:15",
    size: "62.3 MB",
    createdAt: new Date("2024-01-20"),
    views: 750,
    rating: 4.7,
    status: "draft",
    folder: "Anniversary",
    tags: ["anniversary", "love", "creole"]
  },
  {
    id: "4",
    title: "Get Well Soon Message",
    thumbnail: "/images/video-thumb-4.jpg",
    duration: "1:45",
    size: "33.8 MB",
    createdAt: new Date("2024-01-22"),
    views: 425,
    rating: 4.6,
    status: "processing",
    folder: "Get Well",
    tags: ["health", "support", "english"]
  }
]

const mockFolders = [
  { name: "Birthday Messages", count: 23, color: "bg-purple-500" },
  { name: "Graduation", count: 15, color: "bg-blue-500" },
  { name: "Anniversary", count: 18, color: "bg-pink-500" },
  { name: "Get Well", count: 8, color: "bg-green-500" },
  { name: "Holiday Greetings", count: 12, color: "bg-orange-500" },
  { name: "Thank You", count: 10, color: "bg-yellow-500" }
]

// Translations
const contentTranslations: Record<string, Record<string, string>> = {
  content_library: {
    en: "Content Library",
    fr: "Bibliothèque de contenu",
    ht: "Bibliyotèk kontni"
  },
  manage_videos: {
    en: "Manage your videos and content",
    fr: "Gérez vos vidéos et votre contenu",
    ht: "Jere videyo ak kontni ou"
  },
  upload_new: {
    en: "Upload New",
    fr: "Télécharger nouveau",
    ht: "Telechaje nouvo"
  },
  all_videos: {
    en: "All Videos",
    fr: "Toutes les vidéos",
    ht: "Tout videyo"
  },
  folders: {
    en: "Folders",
    fr: "Dossiers",
    ht: "Dosye"
  },
  recent: {
    en: "Recent",
    fr: "Récent",
    ht: "Resan"
  },
  search_videos: {
    en: "Search videos...",
    fr: "Rechercher des vidéos...",
    ht: "Chèche videyo..."
  },
  drag_drop: {
    en: "Drag & drop videos here, or click to browse",
    fr: "Glissez et déposez des vidéos ici, ou cliquez pour parcourir",
    ht: "Trennen ak lage videyo isit la, oswa klike pou navige"
  },
  bulk_actions: {
    en: "Bulk Actions",
    fr: "Actions en masse",
    ht: "Aksyon an mas"
  },
  select_all: {
    en: "Select All",
    fr: "Tout sélectionner",
    ht: "Chwazi tout"
  },
  delete_selected: {
    en: "Delete Selected",
    fr: "Supprimer la sélection",
    ht: "Efase sa ou chwazi"
  }
}

export default function CreatorContentPage() {
  const { language } = useLanguage()
  const [selectedVideos, setSelectedVideos] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("recent")
  const [activeTab, setActiveTab] = useState("all")
  const [showUploadZone, setShowUploadZone] = useState(false)
  const [isSelecting, setIsSelecting] = useState(false)

  const t = (key: string) => {
    return contentTranslations[key]?.[language] || contentTranslations[key]?.en || key
  }

  // Drag and drop configuration
  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles)
    // Handle file upload
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.webm']
    },
    multiple: true
  })

  const handleSelectVideo = (videoId: string) => {
    if (selectedVideos.includes(videoId)) {
      setSelectedVideos(selectedVideos.filter(id => id !== videoId))
    } else {
      setSelectedVideos([...selectedVideos, videoId])
    }
  }

  const handleSelectAll = () => {
    if (selectedVideos.length === mockVideos.length) {
      setSelectedVideos([])
    } else {
      setSelectedVideos(mockVideos.map(v => v.id))
    }
  }

  const handleBulkDelete = () => {
    console.log('Delete videos:', selectedVideos)
    setSelectedVideos([])
    setIsSelecting(false)
  }

  const handleCreateFolder = () => {
    console.log('Create new folder')
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { label: "Published", className: "bg-green-500" },
      draft: { label: "Draft", className: "bg-gray-500" },
      processing: { label: "Processing", className: "bg-blue-500" }
    }
    const config = statusConfig[status as keyof typeof statusConfig]
    return <Badge className={`${config.className} text-white`}>{config.label}</Badge>
  }

  const filteredVideos = mockVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesFolder = !selectedFolder || video.folder === selectedFolder
    return matchesSearch && matchesFolder
  })

  return (
    <TooltipProvider>
      <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('content_library')}</h1>
              <p className="text-gray-600 mt-1">{t('manage_videos')}</p>
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
                    {t('select_all')} ({selectedVideos.length}/{mockVideos.length})
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={selectedVideos.length === 0}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('delete_selected')}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsSelecting(false)
                      setSelectedVideos([])
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSelecting(!isSelecting)}
              >
                {t('bulk_actions')}
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
                onClick={() => setShowUploadZone(!showUploadZone)}
              >
                <Upload className="h-4 w-4 mr-2" />
                {t('upload_new')}
              </Button>
            </div>
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
                  {t('drag_drop')}
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: MP4, MOV, AVI, WebM
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
              placeholder={t('search_videos')}
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
                <SelectItem value="rating">Highest Rated</SelectItem>
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
          {/* Sidebar - Folders */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{t('folders')}</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCreateFolder}
                  >
                    <FolderPlus className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedFolder(null)}
                    className={cn(
                      "w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors",
                      !selectedFolder ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <FileVideo className="h-4 w-4" />
                      <span className="text-sm font-medium">All Videos</span>
                    </div>
                    <span className="text-xs text-gray-500">{mockVideos.length}</span>
                  </button>
                  
                  {mockFolders.map((folder) => (
                    <button
                      key={folder.name}
                      onClick={() => setSelectedFolder(folder.name)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors",
                        selectedFolder === folder.name ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded ${folder.color}`} />
                        <span className="text-sm font-medium">{folder.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{folder.count}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Storage Info */}
            <Card className="mt-4">
              <CardHeader className="p-4">
                <CardTitle className="text-lg">Storage</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Used</span>
                      <span className="font-medium">2.4 GB / 10 GB</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full" style={{ width: '24%' }} />
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Upgrade Storage
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content - Videos Grid/List */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-4">
                <TabsTrigger value="all">{t('all_videos')} ({filteredVideos.length})</TabsTrigger>
                <TabsTrigger value="published">Published ({filteredVideos.filter(v => v.status === 'published').length})</TabsTrigger>
                <TabsTrigger value="drafts">Drafts ({filteredVideos.filter(v => v.status === 'draft').length})</TabsTrigger>
                <TabsTrigger value="processing">Processing ({filteredVideos.filter(v => v.status === 'processing').length})</TabsTrigger>
              </TabsList>

              <TabsContent value={activeTab}>
                {viewMode === 'grid' ? (
                  // Grid View with fixed spacing
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredVideos.map((video) => (
                      <Card 
                        key={video.id} 
                        className={cn(
                          "group cursor-pointer transition-all hover:shadow-lg",
                          selectedVideos.includes(video.id) && "ring-2 ring-purple-500"
                        )}
                      >
                        <div className="relative aspect-video bg-gray-100">
                          {isSelecting && (
                            <div className="absolute top-2 left-2 z-10">
                              <Checkbox
                                checked={selectedVideos.includes(video.id)}
                                onCheckedChange={() => handleSelectVideo(video.id)}
                                className="bg-white"
                              />
                            </div>
                          )}
                          <img
                            src={video.thumbnail}
                            alt={video.title}
                            className="w-full h-full object-cover rounded-t-lg"
                          />
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                            {video.duration}
                          </div>
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <div className="flex gap-2">
                              <Button size="sm" variant="secondary">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="secondary">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="secondary">
                                <Share2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="font-medium text-sm line-clamp-1">{video.title}</h3>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Copy className="h-4 w-4 mr-2" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Move className="h-4 w-4 mr-2" />
                                  Move to Folder
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                            <span>{format(video.createdAt, "MMM d, yyyy")}</span>
                            <span>{video.size}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                <span className="text-xs">{video.views}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs">{video.rating}</span>
                              </div>
                            </div>
                            {getStatusBadge(video.status)}
                          </div>
                          {video.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {video.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  // List View
                  <div className="space-y-2">
                    {filteredVideos.map((video) => (
                      <Card 
                        key={video.id}
                        className={cn(
                          "transition-all hover:shadow-md",
                          selectedVideos.includes(video.id) && "ring-2 ring-purple-500"
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            {isSelecting && (
                              <Checkbox
                                checked={selectedVideos.includes(video.id)}
                                onCheckedChange={() => handleSelectVideo(video.id)}
                              />
                            )}
                            <div className="w-24 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                              <img
                                src={video.thumbnail}
                                alt={video.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-medium truncate">{video.title}</h3>
                                {getStatusBadge(video.status)}
                              </div>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>{video.duration}</span>
                                <span>{video.size}</span>
                                <span>{format(video.createdAt, "MMM d, yyyy")}</span>
                                <div className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  <span>{video.views}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  <span>{video.rating}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View</TooltipContent>
                              </Tooltip>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <Download className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Download</TooltipContent>
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
                                  <DropdownMenuItem>
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Copy className="h-4 w-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600">
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
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}