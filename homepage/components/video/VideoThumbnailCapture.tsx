"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Camera, 
  Download, 
  Upload,
  Play,
  Pause,
  RotateCcw,
  Check,
  Loader2,
  Clock,
  Image as ImageIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { 
  generateThumbnailOptions, 
  captureVideoFrame,
  createVideoElementFromBlob,
  cleanupVideoElement,
  cleanupThumbnails,
  formatTimestamp,
  type ThumbnailOption,
  type VideoFrameExtractionResult
} from "@/lib/utils/video-processing"

interface VideoThumbnailCaptureProps {
  videoBlob: Blob
  onThumbnailSelect?: (thumbnail: ThumbnailOption) => void
  onThumbnailUpload?: (thumbnail: Blob, timestamp: number) => Promise<void>
  maxThumbnails?: number
  className?: string
}

export function VideoThumbnailCapture({
  videoBlob,
  onThumbnailSelect,
  onThumbnailUpload,
  maxThumbnails = 5,
  className
}: VideoThumbnailCaptureProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)
  const [thumbnails, setThumbnails] = useState<ThumbnailOption[]>([])
  const [selectedThumbnail, setSelectedThumbnail] = useState<ThumbnailOption | null>(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [customThumbnail, setCustomThumbnail] = useState<ThumbnailOption | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)

  // Initialize video element
  useEffect(() => {
    const initializeVideo = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const video = await createVideoElementFromBlob(videoBlob)
        setVideoElement(video)
        setDuration(video.duration)

        // Generate automatic thumbnail options
        const result = await generateThumbnailOptions(video, maxThumbnails)
        
        if (result.success && result.thumbnails) {
          setThumbnails(result.thumbnails)
          // Auto-select the middle thumbnail
          const middleIndex = Math.floor(result.thumbnails.length / 2)
          setSelectedThumbnail(result.thumbnails[middleIndex])
        } else {
          setError(result.error || 'Failed to generate thumbnails')
        }
      } catch (err) {
        console.error('Video initialization error:', err)
        setError('Failed to load video for thumbnail generation')
      } finally {
        setIsLoading(false)
      }
    }

    initializeVideo()

    // Cleanup on unmount
    return () => {
      if (videoElement) {
        cleanupVideoElement(videoElement)
      }
      cleanupThumbnails(thumbnails)
      if (customThumbnail) {
        cleanupThumbnails([customThumbnail])
      }
    }
  }, [videoBlob])

  // Set up video preview element
  useEffect(() => {
    if (videoRef.current && videoElement) {
      const previewVideo = videoRef.current
      previewVideo.src = videoElement.src
      previewVideo.currentTime = currentTime

      const handleTimeUpdate = () => {
        setCurrentTime(previewVideo.currentTime)
      }

      const handlePlay = () => setIsPlaying(true)
      const handlePause = () => setIsPlaying(false)

      previewVideo.addEventListener('timeupdate', handleTimeUpdate)
      previewVideo.addEventListener('play', handlePlay)
      previewVideo.addEventListener('pause', handlePause)

      return () => {
        previewVideo.removeEventListener('timeupdate', handleTimeUpdate)
        previewVideo.removeEventListener('play', handlePlay)
        previewVideo.removeEventListener('pause', handlePause)
      }
    }
  }, [videoElement])

  const handleTimelineChange = (values: number[]) => {
    const newTime = values[0]
    setCurrentTime(newTime)
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
    }
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
    }
  }

  const handleCaptureCurrentFrame = async () => {
    if (!videoElement) return

    setIsLoading(true)
    try {
      const blob = await captureVideoFrame(videoElement, currentTime)
      
      if (blob) {
        const dataUrl = URL.createObjectURL(blob)
        const newThumbnail: ThumbnailOption = {
          id: `custom_${Date.now()}`,
          timestamp: currentTime,
          blob,
          dataUrl,
          label: `Custom (${formatTimestamp(currentTime)})`
        }
        
        setCustomThumbnail(newThumbnail)
        setSelectedThumbnail(newThumbnail)
      } else {
        setError('Failed to capture frame')
      }
    } catch (err) {
      console.error('Frame capture error:', err)
      setError('Failed to capture current frame')
    } finally {
      setIsLoading(false)
    }
  }

  const handleThumbnailClick = (thumbnail: ThumbnailOption) => {
    setSelectedThumbnail(thumbnail)
    setCurrentTime(thumbnail.timestamp)
    if (videoRef.current) {
      videoRef.current.currentTime = thumbnail.timestamp
    }
    onThumbnailSelect?.(thumbnail)
  }

  const handleUploadThumbnail = async () => {
    if (!selectedThumbnail || !onThumbnailUpload) return

    setIsUploading(true)
    setError(null)

    try {
      await onThumbnailUpload(selectedThumbnail.blob, selectedThumbnail.timestamp)
    } catch (err) {
      console.error('Thumbnail upload error:', err)
      setError('Failed to upload thumbnail')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDownloadThumbnail = () => {
    if (!selectedThumbnail) return

    const link = document.createElement('a')
    link.href = selectedThumbnail.dataUrl
    link.download = `thumbnail-${selectedThumbnail.timestamp.toFixed(1)}s.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleRegenerateThumbnails = async () => {
    if (!videoElement) return

    setIsLoading(true)
    setError(null)

    try {
      // Clean up old thumbnails
      cleanupThumbnails(thumbnails)
      
      const result = await generateThumbnailOptions(videoElement, maxThumbnails)
      
      if (result.success && result.thumbnails) {
        setThumbnails(result.thumbnails)
        setSelectedThumbnail(result.thumbnails[0])
      } else {
        setError(result.error || 'Failed to regenerate thumbnails')
      }
    } catch (err) {
      console.error('Thumbnail regeneration error:', err)
      setError('Failed to regenerate thumbnails')
    } finally {
      setIsLoading(false)
    }
  }

  const allThumbnails = [...thumbnails, ...(customThumbnail ? [customThumbnail] : [])]

  if (isLoading && thumbnails.length === 0) {
    return (
      <Card className={cn("w-full", className)}>
        <CardContent className="flex items-center justify-center p-8">
          <div className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Generating thumbnails...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="h-5 w-5" />
          Video Thumbnail Selection
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Video Preview */}
        <div className="space-y-4">
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
            <video
              ref={videoRef}
              className="w-full h-full object-contain"
              muted
              playsInline
            />
            {selectedThumbnail && (
              <div className="absolute top-4 right-4">
                <Badge variant="secondary">
                  Frame: {formatTimestamp(selectedThumbnail.timestamp)}
                </Badge>
              </div>
            )}
          </div>

          {/* Video Controls */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={handlePlayPause}
                disabled={!videoElement}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <div className="flex-1 px-2">
                <Slider
                  value={[currentTime]}
                  min={0}
                  max={duration || 100}
                  step={0.1}
                  onValueChange={handleTimelineChange}
                  disabled={!videoElement}
                  className="w-full"
                />
              </div>
              
              <span className="text-sm text-muted-foreground min-w-20">
                {formatTimestamp(currentTime)} / {formatTimestamp(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleCaptureCurrentFrame}
                disabled={!videoElement || isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="h-4 w-4" />
                )}
                Capture Current Frame
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleRegenerateThumbnails}
                disabled={!videoElement || isLoading}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Regenerate Options
              </Button>
            </div>
          </div>
        </div>

        {/* Thumbnail Options Grid */}
        {allThumbnails.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Choose Thumbnail ({allThumbnails.length} options)
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {allThumbnails.map((thumbnail) => (
                <div
                  key={thumbnail.id}
                  className={cn(
                    "relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:scale-105",
                    selectedThumbnail?.id === thumbnail.id 
                      ? "border-purple-600 ring-2 ring-purple-600 ring-offset-2" 
                      : "border-gray-200 hover:border-purple-300"
                  )}
                  onClick={() => handleThumbnailClick(thumbnail)}
                >
                  <img
                    src={thumbnail.dataUrl}
                    alt={`Thumbnail at ${thumbnail.label}`}
                    className="w-full aspect-video object-cover"
                  />
                  
                  {selectedThumbnail?.id === thumbnail.id && (
                    <div className="absolute top-1 right-1 bg-purple-600 text-white rounded-full p-1">
                      <Check className="h-3 w-3" />
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-2 py-1">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {thumbnail.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {selectedThumbnail && (
          <div className="flex items-center gap-3 pt-4 border-t">
            <Button
              onClick={handleDownloadThumbnail}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
            
            {onThumbnailUpload && (
              <Button
                onClick={handleUploadThumbnail}
                disabled={isUploading}
                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600"
              >
                {isUploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {isUploading ? 'Uploading...' : 'Use This Thumbnail'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}