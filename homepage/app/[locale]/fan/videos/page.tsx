"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Video,
  Search,
  Filter,
  Download,
  Share2,
  Heart,
  Star,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Grid,
  List,
  Calendar,
  Clock,
  Eye,
  MessageSquare,
  MoreVertical,
  Gift,
  Trophy,
  Cake,
  Music,
  Sparkles,
  ChevronRight,
  Info,
  Lock,
  Unlock,
  RefreshCw,
  Flag,
  CheckCircle,
  Loader2,
  X,
  Settings,
  SkipBack,
  SkipForward
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSupabaseAuth } from "@/contexts/supabase-auth-compat"

// Types
interface VideoData {
  id: string
  creatorName: string
  creatorAvatar: string
  creatorId: string
  recipientName: string
  occasion: string
  message: string
  videoUrl: string
  thumbnailUrl: string
  duration: string
  deliveredAt: string
  rating?: number
  isPrivate: boolean
  allowDownload: boolean
  viewCount: number
  isFavorite: boolean
  status: 'processing' | 'ready' | 'failed'
}

// Mock video data
const mockVideos: VideoData[] = [
  {
    id: "1",
    creatorName: "Marie Jean",
    creatorAvatar: "/placeholder.svg",
    creatorId: "creator-1",
    recipientName: "Sarah",
    occasion: "Birthday",
    message: "Happy 25th birthday message",
    videoUrl: "/video1.mp4",
    thumbnailUrl: "/placeholder.svg",
    duration: "2:34",
    deliveredAt: "2024-03-15T10:00:00",
    rating: 5,
    isPrivate: false,
    allowDownload: true,
    viewCount: 12,
    isFavorite: true,
    status: 'ready'
  },
  {
    id: "2",
    creatorName: "Jean Baptiste",
    creatorAvatar: "/placeholder.svg",
    creatorId: "creator-2",
    recipientName: "Marc",
    occasion: "Graduation",
    message: "Congratulations on medical school",
    videoUrl: "/video2.mp4",
    thumbnailUrl: "/placeholder.svg",
    duration: "3:12",
    deliveredAt: "2024-03-10T14:00:00",
    rating: 4,
    isPrivate: false,
    allowDownload: true,
    viewCount: 8,
    isFavorite: false,
    status: 'ready'
  },
  {
    id: "3",
    creatorName: "Claudette Pierre",
    creatorAvatar: "/placeholder.svg",
    creatorId: "creator-3",
    recipientName: "My Parents",
    occasion: "Anniversary",
    message: "30th wedding anniversary",
    videoUrl: "/video3.mp4",
    thumbnailUrl: "/placeholder.svg",
    duration: "1:45",
    deliveredAt: "2024-03-08T16:00:00",
    isPrivate: true,
    allowDownload: false,
    viewCount: 5,
    isFavorite: false,
    status: 'ready'
  },
  {
    id: "4",
    creatorName: "Michel Louis",
    creatorAvatar: "/placeholder.svg",
    creatorId: "creator-4",
    recipientName: "Me",
    occasion: "Motivation",
    message: "New year motivation",
    videoUrl: "",
    thumbnailUrl: "/placeholder.svg",
    duration: "0:00",
    deliveredAt: "2024-03-20T09:00:00",
    isPrivate: false,
    allowDownload: true,
    viewCount: 0,
    isFavorite: false,
    status: 'processing'
  }
]

// Custom video player component
const VideoPlayer = ({ video, onClose }: { video: VideoData; onClose: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()
  
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    
    const updateTime = () => setCurrentTime(video.currentTime)
    const updateDuration = () => setDuration(video.duration)
    
    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateDuration)
    
    return () => {
      video.removeEventListener('timeupdate', updateTime)
      video.removeEventListener('loadedmetadata', updateDuration)
    }
  }, [])
  
  const togglePlay = () => {
    const video = videoRef.current
    if (!video) return
    
    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }
  
  const toggleMute = () => {
    const video = videoRef.current
    if (!video) return
    
    video.muted = !isMuted
    setIsMuted(!isMuted)
  }
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    
    const newTime = parseFloat(e.target.value)
    video.currentTime = newTime
    setCurrentTime(newTime)
  }
  
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current
    if (!video) return
    
    const newVolume = parseFloat(e.target.value)
    video.volume = newVolume
    setVolume(newVolume)
  }
  
  const toggleFullscreen = () => {
    const container = document.getElementById('video-player-container')
    if (!container) return
    
    if (!isFullscreen) {
      container.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
    setIsFullscreen(!isFullscreen)
  }
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  const handleMouseMove = () => {
    setShowControls(true)
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current)
    }
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false)
    }, 3000)
  }
  
  return (
    <div
      id="video-player-container"
      className="relative bg-black rounded-lg overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={video.videoUrl}
        className="w-full h-full max-h-[70vh]"
        onClick={togglePlay}
      />
      
      {/* Controls Overlay */}
      <div className={cn(
        "absolute inset-0 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300",
        showControls ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={video.creatorAvatar} />
              <AvatarFallback>{video.creatorName[0]}</AvatarFallback>
            </Avatar>
            <div className="text-white">
              <p className="font-medium text-sm">{video.creatorName}</p>
              <p className="text-xs opacity-80">{video.occasion} for {video.recipientName}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Center Play Button */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              size="icon"
              variant="ghost"
              onClick={togglePlay}
              className="h-16 w-16 rounded-full bg-white/20 backdrop-blur hover:bg-white/30"
            >
              <Play className="h-8 w-8 text-white" />
            </Button>
          </div>
        )}
        
        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          {/* Progress Bar */}
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
          
          {/* Control Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={togglePlay}
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.1}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                />
              </div>
              
              <span className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              {video.allowDownload && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <Download className="h-4 w-4" />
                </Button>
              )}
              <Button
                size="icon"
                variant="ghost"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20 h-8 w-8"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FanVideosPage() {
  const t = useTranslations()
  const { user, isLoading: authLoading, isAuthenticated } = useSupabaseAuth()
  
  // State
  const [videos, setVideos] = useState(mockVideos)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterOccasion, setFilterOccasion] = useState("all")
  const [sortBy, setSortBy] = useState("recent")
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedVideo, setSelectedVideo] = useState<VideoData | null>(null)
  const [showRatingDialog, setShowRatingDialog] = useState(false)
  const [ratingVideo, setRatingVideo] = useState<VideoData | null>(null)
  const [rating, setRating] = useState(0)
  const [ratingComment, setRatingComment] = useState("")
  
  // Filter and sort videos
  const filteredVideos = videos.filter(video => {
    const matchesSearch = 
      video.creatorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.occasion.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesOccasion = filterOccasion === "all" || video.occasion === filterOccasion
    return matchesSearch && matchesOccasion
  })
  
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.deliveredAt).getTime() - new Date(a.deliveredAt).getTime()
      case 'oldest':
        return new Date(a.deliveredAt).getTime() - new Date(b.deliveredAt).getTime()
      case 'creator':
        return a.creatorName.localeCompare(b.creatorName)
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      default:
        return 0
    }
  })
  
  // Group videos by status
  const readyVideos = sortedVideos.filter(v => v.status === 'ready')
  const processingVideos = sortedVideos.filter(v => v.status === 'processing')
  const favoriteVideos = sortedVideos.filter(v => v.isFavorite && v.status === 'ready')
  
  // Handlers
  const handleToggleFavorite = (videoId: string) => {
    setVideos(videos.map(v => 
      v.id === videoId ? { ...v, isFavorite: !v.isFavorite } : v
    ))
  }
  
  const handleDownload = async (video: VideoData) => {
    if (!video.allowDownload) return
    
    // TODO: Implement actual download
    console.log('Downloading video:', video.id)
  }
  
  const handleShare = async (video: VideoData) => {
    if (video.isPrivate) return
    
    // TODO: Implement sharing
    console.log('Sharing video:', video.id)
  }
  
  const handleRateVideo = (video: VideoData) => {
    setRatingVideo(video)
    setRating(video.rating || 0)
    setShowRatingDialog(true)
  }
  
  const submitRating = async () => {
    if (!ratingVideo) return
    
    // TODO: Submit rating to backend
    setVideos(videos.map(v => 
      v.id === ratingVideo.id ? { ...v, rating } : v
    ))
    
    setShowRatingDialog(false)
    setRatingVideo(null)
    setRating(0)
    setRatingComment("")
  }
  
  // Video card component
  const VideoCard = ({ video }: { video: VideoData }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-all">
      <div className="relative">
        {/* Thumbnail */}
        <div 
          className="aspect-video bg-gray-100 relative cursor-pointer group"
          onClick={() => video.status === 'ready' && setSelectedVideo(video)}
        >
          {video.status === 'ready' ? (
            <>
              <img
                src={video.thumbnailUrl}
                alt={`Video for ${video.recipientName}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Play className="h-12 w-12 text-white" />
              </div>
              <Badge className="absolute top-2 left-2 bg-black/70 text-white">
                {video.duration}
              </Badge>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Processing...</p>
              </div>
            </div>
          )}
          
          {/* Privacy Badge */}
          {video.isPrivate && (
            <Badge className="absolute top-2 right-2 bg-black/70 text-white">
              <Lock className="h-3 w-3 mr-1" />
              Private
            </Badge>
          )}
        </div>
        
        {/* Favorite Button */}
        <Button
          size="icon"
          variant="ghost"
          className={cn(
            "absolute bottom-2 right-2 h-8 w-8 bg-white/90 hover:bg-white",
            video.isFavorite && "text-red-500"
          )}
          onClick={() => handleToggleFavorite(video.id)}
        >
          <Heart className={cn("h-4 w-4", video.isFavorite && "fill-current")} />
        </Button>
      </div>
      
      <CardContent className="p-4">
        {/* Creator Info */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={video.creatorAvatar} />
            <AvatarFallback>{video.creatorName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Link 
              href={`/creator/${video.creatorId}`}
              className="font-medium hover:text-purple-600 transition-colors"
            >
              {video.creatorName}
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>{video.occasion}</span>
              <span>•</span>
              <span>For {video.recipientName}</span>
            </div>
          </div>
        </div>
        
        {/* Message Preview */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{video.message}</p>
        
        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-gray-600">
              <Eye className="h-3 w-3" />
              {video.viewCount}
            </span>
            <span className="flex items-center gap-1 text-gray-600">
              <Calendar className="h-3 w-3" />
              {new Date(video.deliveredAt).toLocaleDateString()}
            </span>
          </div>
          
          {/* Rating */}
          {video.rating ? (
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3 w-3",
                    i < video.rating! ? "text-yellow-500 fill-current" : "text-gray-300"
                  )}
                />
              ))}
            </div>
          ) : video.status === 'ready' && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleRateVideo(video)}
              className="text-xs"
            >
              Rate Video
            </Button>
          )}
        </div>
      </CardContent>
      
      {/* Actions */}
      {video.status === 'ready' && (
        <CardFooter className="p-4 pt-0 flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="flex-1"
            onClick={() => setSelectedVideo(video)}
          >
            <Play className="h-4 w-4 mr-1" />
            Play
          </Button>
          {video.allowDownload && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleDownload(video)}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
          {!video.isPrivate && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => handleShare(video)}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="ghost">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleRateVideo(video)}>
                <Star className="h-4 w-4 mr-2" />
                Rate Video
              </DropdownMenuItem>
              <DropdownMenuItem>
                <RefreshCw className="h-4 w-4 mr-2" />
                Request Re-recording
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageSquare className="h-4 w-4 mr-2" />
                Message Creator
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <Flag className="h-4 w-4 mr-2" />
                Report Issue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      )}
    </Card>
  )
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      window.location.href = '/login'
    }
  }, [authLoading, isAuthenticated])
  
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Video className="h-8 w-8" />
                My Video Library
              </h1>
              <p className="mt-2 text-purple-100">
                Watch and manage your personalized videos
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-purple-100">Total Videos</p>
              <p className="text-3xl font-bold">{videos.length}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by creator, recipient, or occasion..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterOccasion} onValueChange={setFilterOccasion}>
                <SelectTrigger className="w-full lg:w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="All Occasions" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Occasions</SelectItem>
                  <SelectItem value="Birthday">Birthday</SelectItem>
                  <SelectItem value="Anniversary">Anniversary</SelectItem>
                  <SelectItem value="Graduation">Graduation</SelectItem>
                  <SelectItem value="Motivation">Motivation</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="creator">Creator Name</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button
                  size="icon"
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  size="icon"
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Video Tabs */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">
              All Videos
              {readyVideos.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {readyVideos.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="favorites">
              Favorites
              {favoriteVideos.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {favoriteVideos.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="processing">
              Processing
              {processingVideos.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {processingVideos.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          {/* All Videos */}
          <TabsContent value="all">
            {readyVideos.length > 0 ? (
              <div className={cn(
                viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              )}>
                {readyVideos.map(video => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Video className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
                  <p className="text-gray-600 mb-4">
                    Request your first personalized video from a creator
                  </p>
                  <Button asChild className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    <Link href="/fan/request/new">
                      Request Video
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Favorites */}
          <TabsContent value="favorites">
            {favoriteVideos.length > 0 ? (
              <div className={cn(
                viewMode === 'grid'
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              )}>
                {favoriteVideos.map(video => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No favorite videos</h3>
                  <p className="text-gray-600">
                    Videos you mark as favorites will appear here
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Processing */}
          <TabsContent value="processing">
            {processingVideos.length > 0 ? (
              <div className="space-y-4">
                {processingVideos.map(video => (
                  <Card key={video.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="h-20 w-32 bg-gray-100 rounded flex items-center justify-center">
                          <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{video.creatorName}</h3>
                          <p className="text-sm text-gray-600">
                            {video.occasion} for {video.recipientName}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            Processing since {new Date(video.deliveredAt).toLocaleString()}
                          </p>
                        </div>
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Clock className="h-3 w-3 mr-1" />
                          Processing
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All videos ready!</h3>
                  <p className="text-gray-600">
                    No videos are currently being processed
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Video Player Dialog */}
      {selectedVideo && (
        <Dialog open={!!selectedVideo} onOpenChange={() => setSelectedVideo(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            <VideoPlayer video={selectedVideo} onClose={() => setSelectedVideo(null)} />
          </DialogContent>
        </Dialog>
      )}
      
      {/* Rating Dialog */}
      <Dialog open={showRatingDialog} onOpenChange={setShowRatingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate Your Video</DialogTitle>
            <DialogDescription>
              How was your experience with {ratingVideo?.creatorName}?
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => setRating(value)}
                  className="hover:scale-110 transition-transform"
                >
                  <Star
                    className={cn(
                      "h-8 w-8",
                      value <= rating
                        ? "text-yellow-500 fill-current"
                        : "text-gray-300"
                    )}
                  />
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="comment">Add a comment (optional)</Label>
              <Textarea
                id="comment"
                placeholder="Share your experience..."
                value={ratingComment}
                onChange={(e) => setRatingComment(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowRatingDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={submitRating}
              disabled={rating === 0}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            >
              Submit Rating
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}