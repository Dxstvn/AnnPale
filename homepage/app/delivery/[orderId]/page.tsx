"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Maximize,
  Minimize,
  Download,
  Share2,
  Star,
  Heart,
  MessageSquare,
  Clock,
  Calendar,
  User,
  Gift,
  ChevronLeft,
  RotateCw,
  Settings,
  Facebook,
  Twitter,
  Copy,
  Check,
  Mail
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"

interface VideoDetails {
  id: string
  creatorName: string
  creatorImage: string
  recipientName: string
  occasion: string
  videoUrl: string
  thumbnailUrl: string
  duration: number
  deliveredAt: Date
  orderedBy: string
  message: string
  views: number
  rating?: number
  isGift: boolean
}

export default function VideoDeliveryPage() {
  const params = useParams()
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [rating, setRating] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [shareMenuOpen, setShareMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [showSpeedMenu, setShowSpeedMenu] = useState(false)
  const controlsTimeoutRef = useRef<NodeJS.Timeout>()

  // Mock data - would come from API
  useEffect(() => {
    const mockVideo: VideoDetails = {
      id: params.orderId as string,
      creatorName: "Wyclef Jean",
      creatorImage: "/images/wyclef-jean.png",
      recipientName: "Marie Joseph",
      occasion: "Birthday",
      videoUrl: "/videos/sample.mp4",
      thumbnailUrl: "/images/video-thumbnail.jpg",
      duration: 125,
      deliveredAt: new Date(),
      orderedBy: "Jean Joseph",
      message: "Happy Birthday Marie! Wishing you all the best on your special day. Keep shining and spreading joy!",
      views: 1,
      isGift: true
    }
    setVideoDetails(mockVideo)
  }, [params.orderId])

  // Video control handlers
  const togglePlay = () => {
    if (!videoRef.current) return
    
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    setCurrentTime(videoRef.current.currentTime)
  }

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return
    setDuration(videoRef.current.duration)
  }

  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return
    const time = value[0]
    videoRef.current.currentTime = time
    setCurrentTime(time)
  }

  const handleVolumeChange = (value: number[]) => {
    if (!videoRef.current) return
    const vol = value[0]
    videoRef.current.volume = vol
    setVolume(vol)
    setIsMuted(vol === 0)
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    if (isMuted) {
      videoRef.current.volume = volume || 0.5
      setIsMuted(false)
    } else {
      videoRef.current.volume = 0
      setIsMuted(true)
    }
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  const handleSpeedChange = (speed: number) => {
    if (!videoRef.current) return
    videoRef.current.playbackRate = speed
    setPlaybackSpeed(speed)
    setShowSpeedMenu(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleDownload = async () => {
    setIsDownloading(true)
    // Simulate download
    setTimeout(() => {
      const link = document.createElement('a')
      link.href = videoDetails?.videoUrl || ''
      link.download = `${videoDetails?.creatorName}-${videoDetails?.recipientName}-${videoDetails?.occasion}.mp4`
      link.click()
      setIsDownloading(false)
    }, 2000)
  }

  const handleShare = async (platform: string) => {
    const shareUrl = `${window.location.origin}/delivery/${params.orderId}`
    const shareText = `Check out this amazing video from ${videoDetails?.creatorName}!`
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')
        break
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
        break
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank')
        break
      case 'copy':
        navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        break
      case 'email':
        window.location.href = `mailto:?subject=Video from ${videoDetails?.creatorName}&body=${shareText} ${shareUrl}`
        break
    }
    setShareMenuOpen(false)
  }

  const handleRating = (stars: number) => {
    setRating(stars)
    // Would send to API
  }

  // Auto-hide controls
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true)
      
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setShowControls(false)
        }, 3000)
      }
    }
    
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isPlaying])

  if (!videoDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="hover:bg-gray-100 hover:border-2 hover:border-black mb-4"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Your Video is Ready! 🎉
              </h1>
              <p className="text-gray-600">
                From {videoDetails.creatorName} to {videoDetails.recipientName}
              </p>
            </div>
            <Badge variant="success" className="text-lg px-4 py-2">
              Delivered
            </Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="relative bg-black aspect-video">
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  poster={videoDetails.thumbnailUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onClick={togglePlay}
                >
                  <source src={videoDetails.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Video Controls Overlay */}
                <AnimatePresence>
                  {showControls && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none"
                    >
                      {/* Center Play/Pause Button */}
                      <button
                        onClick={togglePlay}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                      >
                        <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                          {isPlaying ? (
                            <Pause className="h-12 w-12 text-white" />
                          ) : (
                            <Play className="h-12 w-12 text-white translate-x-0.5" />
                          )}
                        </div>
                      </button>

                      {/* Bottom Controls */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 pointer-events-auto">
                        {/* Progress Bar */}
                        <div className="mb-4">
                          <Slider
                            value={[currentTime]}
                            max={duration}
                            step={0.1}
                            onValueChange={handleSeek}
                            className="w-full"
                          />
                          <div className="flex justify-between text-xs text-white mt-1">
                            <span>{formatTime(currentTime)}</span>
                            <span>{formatTime(duration)}</span>
                          </div>
                        </div>

                        {/* Control Buttons */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={togglePlay}
                              className="text-white hover:bg-white/20"
                            >
                              {isPlaying ? (
                                <Pause className="h-5 w-5" />
                              ) : (
                                <Play className="h-5 w-5" />
                              )}
                            </Button>

                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={toggleMute}
                              className="text-white hover:bg-white/20"
                            >
                              {isMuted ? (
                                <VolumeX className="h-5 w-5" />
                              ) : (
                                <Volume2 className="h-5 w-5" />
                              )}
                            </Button>

                            <div className="w-24">
                              <Slider
                                value={[isMuted ? 0 : volume]}
                                max={1}
                                step={0.1}
                                onValueChange={handleVolumeChange}
                                className="w-full"
                              />
                            </div>

                            <div className="relative">
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                                className="text-white hover:bg-white/20"
                              >
                                <Settings className="h-5 w-5" />
                              </Button>
                              
                              {showSpeedMenu && (
                                <div className="absolute bottom-12 left-0 bg-black/90 backdrop-blur-sm rounded-lg p-2 space-y-1">
                                  {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                                    <button
                                      key={speed}
                                      onClick={() => handleSpeedChange(speed)}
                                      className={`block w-full text-left px-3 py-1 text-white hover:bg-white/20 rounded ${
                                        playbackSpeed === speed ? 'bg-white/30' : ''
                                      }`}
                                    >
                                      {speed}x
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={toggleFullscreen}
                            className="text-white hover:bg-white/20"
                          >
                            {isFullscreen ? (
                              <Minimize className="h-5 w-5" />
                            ) : (
                              <Maximize className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Action Buttons Below Video */}
              <CardContent className="p-6">
                <div className="flex flex-wrap gap-3">
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
                    onClick={handleDownload}
                    disabled={isDownloading}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isDownloading ? "Downloading..." : "Download Video"}
                  </Button>
                  
                  <div className="relative flex-1">
                    <Button
                      variant="outline"
                      className="w-full hover:bg-gray-100 hover:border-2 hover:border-black"
                      onClick={() => setShareMenuOpen(!shareMenuOpen)}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    
                    {shareMenuOpen && (
                      <div className="absolute top-12 left-0 right-0 bg-white border rounded-lg shadow-xl p-2 z-10">
                        <button
                          onClick={() => handleShare('facebook')}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
                        >
                          <Facebook className="h-4 w-4 text-blue-600" />
                          Facebook
                        </button>
                        <button
                          onClick={() => handleShare('twitter')}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
                        >
                          <Twitter className="h-4 w-4 text-blue-400" />
                          Twitter
                        </button>
                        <button
                          onClick={() => handleShare('whatsapp')}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
                        >
                          <MessageSquare className="h-4 w-4 text-green-500" />
                          WhatsApp
                        </button>
                        <button
                          onClick={() => handleShare('email')}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
                        >
                          <Mail className="h-4 w-4 text-gray-600" />
                          Email
                        </button>
                        <Separator className="my-2" />
                        <button
                          onClick={() => handleShare('copy')}
                          className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded flex items-center gap-2"
                        >
                          {copied ? (
                            <>
                              <Check className="h-4 w-4 text-green-600" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4 text-gray-600" />
                              Copy Link
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant={isLiked ? "default" : "outline"}
                    size="icon"
                    onClick={() => setIsLiked(!isLiked)}
                    className={isLiked ? "bg-red-500 hover:bg-red-600" : "hover:bg-gray-100 hover:border-2 hover:border-black"}
                  >
                    <Heart className={`h-5 w-5 ${isLiked ? "fill-white" : ""}`} />
                  </Button>
                </div>

                {/* Rating Section */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Rate this video</p>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-green-600 mt-2">
                      Thanks for your feedback!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Video Details Sidebar */}
          <div className="space-y-6">
            {/* Creator Info */}
            <Card>
              <CardHeader>
                <CardTitle>Creator</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <img
                    src={videoDetails.creatorImage}
                    alt={videoDetails.creatorName}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{videoDetails.creatorName}</h3>
                    <Button
                      variant="link"
                      className="p-0 h-auto text-purple-600"
                      onClick={() => router.push(`/creator/${videoDetails.creatorName.toLowerCase().replace(' ', '-')}`)}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Details */}
            <Card>
              <CardHeader>
                <CardTitle>Video Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">For</p>
                    <p className="font-medium">{videoDetails.recipientName}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Gift className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Occasion</p>
                    <p className="font-medium capitalize">{videoDetails.occasion}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Delivered</p>
                    <p className="font-medium">
                      {format(videoDetails.deliveredAt, "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">{formatTime(videoDetails.duration)}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm text-gray-600 mb-2">Message</p>
                  <p className="text-gray-800 italic">"{videoDetails.message}"</p>
                </div>
              </CardContent>
            </Card>

            {/* Gift Notice */}
            {videoDetails.isGift && (
              <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Gift className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                    <p className="font-medium text-purple-900 mb-1">
                      This is a gift!
                    </p>
                    <p className="text-sm text-purple-700">
                      From {videoDetails.orderedBy}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Need Help */}
            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-gray-100 hover:border-2 hover:border-black"
                  onClick={() => router.push('/help')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Support
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start hover:bg-gray-100 hover:border-2 hover:border-black"
                  onClick={() => router.push('/account/orders')}
                >
                  <RotateCw className="h-4 w-4 mr-2" />
                  View All Orders
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}