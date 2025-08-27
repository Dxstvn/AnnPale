'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Radio,
  RefreshCw,
  Copy,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'
import { toast } from 'sonner'

export default function TestStreamPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [streamStatus, setStreamStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const [customUrl, setCustomUrl] = useState('')
  
  // Your AWS IVS stream URL
  const defaultStreamUrl = 'https://eb5fc6c5eb1d.us-east-1.playback.live-video.net/api/video/v1/us-east-1.206254861786.channel.ALKd3nFpmt5Z.m3u8'
  const [currentStreamUrl, setCurrentStreamUrl] = useState(defaultStreamUrl)

  useEffect(() => {
    loadHlsPlayer()
  }, [currentStreamUrl])

  const loadHlsPlayer = async () => {
    try {
      setIsLoading(true)
      setError(null)
      setStreamStatus('connecting')

      // Dynamically import HLS.js
      const HlsModule = await import('hls.js')
      const Hls = HlsModule.default || HlsModule
      
      if (Hls.isSupported() && videoRef.current) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        })

        hls.loadSource(currentStreamUrl)
        hls.attachMedia(videoRef.current)

        // Use the correct event binding method
        if (typeof hls.on === 'function') {
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setIsLoading(false)
            setStreamStatus('connected')
            videoRef.current?.play().catch(() => {
              // Autoplay might be blocked
              setIsPlaying(false)
            })
          })

          hls.on(Hls.Events.ERROR, (event: any, data: any) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  setError('Network error - check if stream is live')
                  setStreamStatus('error')
                  hls.startLoad()
                  break
                case Hls.ErrorTypes.MEDIA_ERROR:
                  setError('Media error - trying to recover')
                  setStreamStatus('error')
                  hls.recoverMediaError()
                  break
                default:
                  setError('Fatal error - cannot recover')
                  setStreamStatus('error')
                  hls.destroy()
                  break
              }
            }
          })
        } else {
          // Fallback for older HLS.js versions or different API
          hls.on = hls.on || hls.addEventListener
          
          const onManifestParsed = () => {
            setIsLoading(false)
            setStreamStatus('connected')
            videoRef.current?.play().catch(() => {
              setIsPlaying(false)
            })
          }
          
          const onError = (event: string, data: any) => {
            console.error('HLS Error:', data)
            if (data && data.fatal) {
              setError('Stream error - check if stream is live')
              setStreamStatus('error')
            }
          }
          
          // Try different event binding methods
          if (hls.on) {
            hls.on('hlsManifestParsed', onManifestParsed)
            hls.on('hlsError', onError)
          }
        }

        // Store HLS instance for cleanup
        (window as any).hlsInstance = hls

        // Also set up video element events as fallback
        videoRef.current.addEventListener('loadeddata', () => {
          setIsLoading(false)
          setStreamStatus('connected')
        })

        videoRef.current.addEventListener('error', () => {
          setError('Failed to load stream - check if OBS is streaming')
          setStreamStatus('error')
        })

        return () => {
          hls.destroy()
        }
      } else if (videoRef.current?.canPlayType('application/vnd.apple.mpegurl')) {
        // iOS Safari native HLS support
        videoRef.current.src = currentStreamUrl
        setIsLoading(false)
        setStreamStatus('connected')
      } else {
        setError('HLS is not supported in your browser')
        setStreamStatus('error')
      }
    } catch (err) {
      console.error('Error loading HLS player:', err)
      setError('Failed to load video player')
      setStreamStatus('error')
      setIsLoading(false)
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen()
      } else {
        videoRef.current.requestFullscreen()
      }
    }
  }

  const refreshStream = () => {
    if ((window as any).hlsInstance) {
      (window as any).hlsInstance.destroy()
    }
    loadHlsPlayer()
  }

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast.success('Stream URL copied to clipboard')
  }

  const loadCustomStream = () => {
    if (customUrl.trim()) {
      setCurrentStreamUrl(customUrl.trim())
      toast.success('Loading custom stream URL')
    }
  }

  const resetToDefault = () => {
    setCurrentStreamUrl(defaultStreamUrl)
    setCustomUrl('')
    toast.success('Reset to default stream')
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Radio className="h-8 w-8 text-red-600 animate-pulse" />
            AWS IVS Stream Test Page
          </h1>
          <p className="text-gray-600">
            Use this page to test your AWS IVS stream from OBS Studio
          </p>
        </div>

        {/* Stream URL Configuration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Stream Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Current Stream URL</Label>
              <div className="flex gap-2 mt-1">
                <Input 
                  value={currentStreamUrl} 
                  readOnly 
                  className="font-mono text-sm"
                />
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => copyUrl(currentStreamUrl)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={resetToDefault}
                >
                  Reset
                </Button>
              </div>
            </div>

            <div>
              <Label>Test Custom Stream URL (optional)</Label>
              <div className="flex gap-2 mt-1">
                <Input 
                  placeholder="Paste another HLS stream URL here..."
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  className="font-mono text-sm"
                />
                <Button 
                  size="sm" 
                  onClick={loadCustomStream}
                  disabled={!customUrl.trim()}
                >
                  Load
                </Button>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Make sure you're streaming from OBS to your AWS IVS channel using the stream key.
                The stream will appear here with ~2-3 seconds delay.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Video Player */}
        <Card className="overflow-hidden">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                Live Stream Player
                {streamStatus === 'connected' && (
                  <Badge className="bg-green-600 text-white">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                )}
                {streamStatus === 'connecting' && (
                  <Badge className="bg-yellow-600 text-white animate-pulse">
                    <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                    Connecting...
                  </Badge>
                )}
                {streamStatus === 'error' && (
                  <Badge className="bg-red-600 text-white">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Error
                  </Badge>
                )}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshStream}
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {/* Video Element */}
            <div className="relative bg-black aspect-video">
              <video
                ref={videoRef}
                className="w-full h-full"
                controls={false}
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
              
              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-white text-center">
                    <RefreshCw className="h-12 w-12 animate-spin mx-auto mb-4" />
                    <p>Loading stream...</p>
                  </div>
                </div>
              )}

              {/* Error Overlay */}
              {error && !isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <div className="text-white text-center max-w-md">
                    <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="mb-2">{error}</p>
                    <p className="text-sm text-gray-300 mb-4">
                      Make sure you're actively streaming from OBS Studio
                    </p>
                    <Button onClick={refreshStream} size="sm">
                      Try Again
                    </Button>
                  </div>
                </div>
              )}

              {/* Custom Controls Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={togglePlay}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleMute}
                      className="text-white hover:bg-white/20"
                    >
                      {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-600 text-white animate-pulse">
                      <Radio className="h-3 w-3 mr-1" />
                      LIVE
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={toggleFullscreen}
                      className="text-white hover:bg-white/20"
                    >
                      <Maximize className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* OBS Setup Instructions */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>OBS Studio Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Quick Setup:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                <li>Open OBS Studio</li>
                <li>Go to Settings → Stream</li>
                <li>Service: <strong>Custom</strong></li>
                <li>Server: <code className="bg-gray-100 px-1 py-0.5 rounded">rtmps://eb5fc6c5eb1d.global-contribute.live-video.net:443/app/</code></li>
                <li>Stream Key: <code className="bg-gray-100 px-1 py-0.5 rounded">REDACTED</code></li>
                <li>Click "Start Streaming" in OBS</li>
                <li>The stream will appear above after ~2-3 seconds</li>
              </ol>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>Recommended Settings:</strong> 1080p resolution, 30fps, 3000-6000 Kbps bitrate, Keyframe interval: 2 seconds
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}