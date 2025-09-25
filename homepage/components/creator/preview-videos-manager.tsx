"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Plus,
  Play,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Video,
  Star,
  Calendar,
  User
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSupabaseAuth } from "@/contexts/supabase-auth-compat"
import { VideoPlayerModal } from "@/components/browse/video-player-modal"

interface VideoRequest {
  id: string
  request_type: string
  occasion?: string // Keep for backward compatibility
  recipient_name: string
  instructions: string
  video_url: string | null
  thumbnail_url: string | null
  duration: number | null
  completed_at: string
  rating: number | null
  review: string | null
}

interface PreviewVideo {
  id: string
  video_request_id: string
  title: string
  thumbnail_url: string | null
  video_url: string
  duration: number | null
  occasion: string | null
  display_order: number
  is_active: boolean
  created_at: string
}

export function PreviewVideosManager() {
  const [previewVideos, setPreviewVideos] = React.useState<PreviewVideo[]>([])
  const [availableVideos, setAvailableVideos] = React.useState<VideoRequest[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [selectedVideo, setSelectedVideo] = React.useState<any>(null)
  const [isVideoPlayerOpen, setIsVideoPlayerOpen] = React.useState(false)
  const [editingVideo, setEditingVideo] = React.useState<PreviewVideo | null>(null)
  const [newTitle, setNewTitle] = React.useState("")
  const { user } = useSupabaseAuth()

  React.useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user])

  const fetchData = async () => {
    try {
      // Fetch current preview videos
      const previewResponse = await fetch('/api/creator/preview-videos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      console.log('Preview videos response status:', previewResponse.status)

      if (previewResponse.ok) {
        const previews = await previewResponse.json()
        setPreviewVideos(previews)
      } else {
        const error = await previewResponse.json()
        console.error('Preview videos error:', error)
      }

      // Fetch available completed videos
      const videosResponse = await fetch('/api/creator/videos', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      console.log('Videos response status:', videosResponse.status)

      if (videosResponse.ok) {
        const videos = await videosResponse.json()
        // Filter to only completed videos with video_url
        const completed = videos.filter((v: VideoRequest) =>
          v.video_url && v.completed_at
        )
        setAvailableVideos(completed)
      } else {
        const error = await videosResponse.json()
        console.error('Videos error:', error)
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddPreviewVideo = async (videoRequest: VideoRequest, customTitle?: string) => {
    try {
      const response = await fetch('/api/creator/preview-videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          video_request_id: videoRequest.id,
          title: customTitle || `${videoRequest.occasion} for ${videoRequest.recipient_name}`,
          display_order: previewVideos.length
        })
      })

      if (response.ok) {
        const newPreview = await response.json()
        setPreviewVideos([...previewVideos, newPreview])
        setIsAddDialogOpen(false)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to add preview video')
      }
    } catch (error) {
      console.error('Failed to add preview video:', error)
      alert('Failed to add preview video')
    }
  }

  const handleUpdateVideo = async (id: string, updates: Partial<PreviewVideo>) => {
    try {
      const response = await fetch('/api/creator/preview-videos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ id, ...updates })
      })

      if (response.ok) {
        const updatedVideo = await response.json()
        setPreviewVideos(previews =>
          previews.map(p => p.id === id ? updatedVideo : p)
        )
        setEditingVideo(null)
        setNewTitle("")
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to update video')
      }
    } catch (error) {
      console.error('Failed to update video:', error)
      alert('Failed to update video')
    }
  }

  const handleDeleteVideo = async (id: string) => {
    try {
      const response = await fetch(`/api/creator/preview-videos?id=${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        setPreviewVideos(previews => previews.filter(p => p.id !== id))
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to delete video')
      }
    } catch (error) {
      console.error('Failed to delete video:', error)
      alert('Failed to delete video')
    }
  }

  const handlePlayVideo = (video: PreviewVideo | VideoRequest) => {
    if ('video_request_id' in video) {
      // Preview video
      setSelectedVideo({
        title: video.title,
        video_url: video.video_url,
        occasion: video.request_type || video.occasion,
        duration: video.duration
      })
    } else {
      // Video request
      setSelectedVideo({
        title: `${video.request_type || video.occasion || 'Video'} for ${video.recipient_name}`,
        video_url: video.video_url,
        occasion: video.request_type || video.occasion,
        duration: video.duration
      })
    }
    setIsVideoPlayerOpen(true)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return 'N/A'
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Filter available videos to exclude ones already used as previews
  const usedVideoIds = previewVideos.map(p => p.video_request_id)
  const availableForPreview = availableVideos.filter(v => !usedVideoIds.includes(v.id))

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Preview Videos</CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Manage the sample videos shown on your profile to attract new fans
              </p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Video
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Preview Video</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {availableForPreview.length === 0 ? (
                    <div className="text-center py-8">
                      <Video className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">No videos available for preview</p>
                      <p className="text-sm text-gray-400">
                        Complete more video requests to add them as previews
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {availableForPreview.map((video) => (
                        <Card key={video.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div className="relative w-24 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                {video.thumbnail_url ? (
                                  <img
                                    src={video.thumbnail_url}
                                    alt={video.request_type || video.occasion || 'Video'}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                                    <Play className="h-6 w-6 text-purple-600" />
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="text-white h-8 w-8 p-0"
                                    onClick={() => handlePlayVideo(video)}
                                  >
                                    <Play className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm truncate">
                                  {video.request_type || video.occasion || 'Video'} for {video.recipient_name}
                                </h3>
                                <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {formatDate(video.completed_at)}
                                  </span>
                                  <span>{formatDuration(video.duration)}</span>
                                  {video.rating && (
                                    <span className="flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                      {video.rating}
                                    </span>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  className="mt-2 h-7 text-xs"
                                  onClick={() => handleAddPreviewVideo(video)}
                                >
                                  Add as Preview
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {previewVideos.length === 0 ? (
            <div className="text-center py-12">
              <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Preview Videos Yet</h3>
              <p className="text-gray-600 mb-4">
                Add sample videos to showcase your work to potential fans
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Preview Video
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {previewVideos
                .sort((a, b) => a.display_order - b.display_order)
                .map((video) => (
                  <Card key={video.id} className="group">
                    <CardContent className="p-4">
                      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden mb-3">
                        {video.thumbnail_url ? (
                          <img
                            src={video.thumbnail_url}
                            alt={video.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                            <Play className="h-8 w-8 text-purple-600" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-white"
                            onClick={() => handlePlayVideo(video)}
                          >
                            <Play className="h-5 w-5" />
                          </Button>
                        </div>
                        {video.duration && (
                          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                            {formatDuration(video.duration)}
                          </div>
                        )}
                        <div className="absolute top-2 right-2">
                          <Badge variant={video.is_active ? "default" : "secondary"}>
                            {video.is_active ? (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Visible
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3 mr-1" />
                                Hidden
                              </>
                            )}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                        {(video.request_type || video.occasion) && (
                          <p className="text-xs text-gray-500">{video.request_type || video.occasion}</p>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => {
                                setEditingVideo(video)
                                setNewTitle(video.title)
                              }}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8 w-8 p-0"
                              onClick={() => handleUpdateVideo(video.id, { is_active: !video.is_active })}
                            >
                              {video.is_active ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete Preview Video</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove this video from your previews?
                                    This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeleteVideo(video.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                          <div className="text-xs text-gray-400">
                            Order: {video.display_order + 1}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Title Dialog */}
      <Dialog open={!!editingVideo} onOpenChange={() => {
        setEditingVideo(null)
        setNewTitle("")
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Preview Video</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Enter video title"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setEditingVideo(null)
                  setNewTitle("")
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (editingVideo) {
                    handleUpdateVideo(editingVideo.id, { title: newTitle })
                  }
                }}
                disabled={!newTitle.trim()}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={isVideoPlayerOpen}
        onClose={() => {
          setIsVideoPlayerOpen(false)
          setSelectedVideo(null)
        }}
        video={selectedVideo}
      />
    </div>
  )
}