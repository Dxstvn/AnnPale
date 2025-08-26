"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Circle, 
  Square, 
  Pause, 
  Play, 
  RotateCcw,
  Download,
  Upload,
  Settings,
  Camera,
  AlertCircle,
  Check,
  X,
  Loader2,
  Image as ImageIcon,
  Paintbrush,
  Eye
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { VideoRecordingSession, VideoRequest } from "@/types/video"
import { VideoThumbnailCapture } from "./VideoThumbnailCapture"
import { WatermarkPreview } from "./WatermarkPreview"
import { 
  type WatermarkConfig, 
  defaultWatermarkConfig,
  createWatermarkedStream 
} from "@/lib/utils/watermark"

interface VideoRecorderProps {
  request?: VideoRequest
  maxDuration?: number // in seconds
  onRecordingComplete?: (blob: Blob, duration: number) => void
  onUpload?: (blob: Blob) => Promise<void>
  onThumbnailUpload?: (thumbnail: Blob, timestamp: number) => Promise<void>
  enableWatermark?: boolean
  creatorName?: string
  className?: string
}

export function VideoRecorder({ 
  request, 
  maxDuration = 180, // 3 minutes default
  onRecordingComplete,
  onUpload,
  onThumbnailUpload,
  enableWatermark = false,
  creatorName = '',
  className 
}: VideoRecorderProps) {
  // State
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [hasRecording, setHasRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const [currentStep, setCurrentStep] = useState<'record' | 'thumbnail' | 'watermark'>('record')
  
  // Watermark state
  const [watermarkConfig, setWatermarkConfig] = useState<WatermarkConfig>({
    ...defaultWatermarkConfig,
    text: creatorName,
    enabled: enableWatermark
  })
  
  // Thumbnail state
  const [showThumbnailCapture, setShowThumbnailCapture] = useState(false)
  
  // Device state
  const [hasPermission, setHasPermission] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [selectedCamera, setSelectedCamera] = useState<string>("")
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>("")
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([])
  const [availableMicrophones, setAvailableMicrophones] = useState<MediaDeviceInfo[]>([])
  
  // Refs
  const videoPreviewRef = useRef<HTMLVideoElement>(null)
  const videoPlaybackRef = useRef<HTMLVideoElement>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const recordingBlobRef = useRef<Blob | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  
  // Get available devices
  const getDevices = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const cameras = devices.filter(device => device.kind === 'videoinput')
      const microphones = devices.filter(device => device.kind === 'audioinput')
      
      setAvailableCameras(cameras)
      setAvailableMicrophones(microphones)
      
      if (cameras.length > 0 && !selectedCamera) {
        setSelectedCamera(cameras[0].deviceId)
      }
      if (microphones.length > 0 && !selectedMicrophone) {
        setSelectedMicrophone(microphones[0].deviceId)
      }
    } catch (err) {
      console.error('Error enumerating devices:', err)
    }
  }, [selectedCamera, selectedMicrophone])
  
  // Initialize media stream
  const initializeStream = useCallback(async () => {
    setIsInitializing(true)
    setError(null)
    
    try {
      // Stop existing stream
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop())
      }
      
      // Request permissions and get stream
      const constraints: MediaStreamConstraints = {
        video: videoEnabled ? {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          facingMode: 'user'
        } : false,
        audio: audioEnabled ? {
          deviceId: selectedMicrophone ? { exact: selectedMicrophone } : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } : false
      }
      
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      mediaStreamRef.current = stream
      
      // Set video preview
      if (videoPreviewRef.current) {
        videoPreviewRef.current.srcObject = stream
      }
      
      setHasPermission(true)
      await getDevices() // Refresh device list after permission granted
      
    } catch (err: any) {
      console.error('Error accessing media devices:', err)
      setError(
        err.name === 'NotAllowedError' 
          ? 'Camera and microphone access denied. Please grant permissions.'
          : 'Failed to access camera and microphone. Please check your device settings.'
      )
      setHasPermission(false)
    } finally {
      setIsInitializing(false)
    }
  }, [videoEnabled, audioEnabled, selectedCamera, selectedMicrophone, getDevices])
  
  // Start recording
  const startRecording = useCallback(() => {
    if (!mediaStreamRef.current) return
    
    try {
      // Reset chunks
      chunksRef.current = []
      
      // Create MediaRecorder with optimal settings
      const options: MediaRecorderOptions = {
        mimeType: 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: 2500000 // 2.5 Mbps
      }
      
      // Fallback to other formats if VP9 is not supported
      if (!MediaRecorder.isTypeSupported(options.mimeType!)) {
        options.mimeType = 'video/webm;codecs=vp8,opus'
      }
      if (!MediaRecorder.isTypeSupported(options.mimeType!)) {
        options.mimeType = 'video/webm'
      }
      
      const mediaRecorder = new MediaRecorder(mediaStreamRef.current, options)
      mediaRecorderRef.current = mediaRecorder
      
      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }
      
      // Handle recording stop
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' })
        recordingBlobRef.current = blob
        
        // Set playback video
        if (videoPlaybackRef.current) {
          videoPlaybackRef.current.src = URL.createObjectURL(blob)
        }
        
        setHasRecording(true)
        
        // Call callback if provided
        if (onRecordingComplete) {
          onRecordingComplete(blob, recordingTime)
        }
      }
      
      // Start recording
      mediaRecorder.start(1000) // Collect data every second
      setIsRecording(true)
      setIsPaused(false)
      setRecordingTime(0)
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1
          if (newTime >= maxDuration) {
            stopRecording()
            return maxDuration
          }
          return newTime
        })
      }, 1000)
      
    } catch (err) {
      console.error('Error starting recording:', err)
      setError('Failed to start recording. Please try again.')
    }
  }, [maxDuration, onRecordingComplete, recordingTime])
  
  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setIsPaused(false)
      
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])
  
  // Pause/Resume recording
  const togglePause = useCallback(() => {
    if (!mediaRecorderRef.current) return
    
    if (isPaused) {
      mediaRecorderRef.current.resume()
      setIsPaused(false)
      
      // Resume timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1
          if (newTime >= maxDuration) {
            stopRecording()
            return maxDuration
          }
          return newTime
        })
      }, 1000)
    } else {
      mediaRecorderRef.current.pause()
      setIsPaused(true)
      
      // Pause timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isPaused, maxDuration, stopRecording])
  
  // Reset recording
  const resetRecording = useCallback(() => {
    setHasRecording(false)
    setRecordingTime(0)
    recordingBlobRef.current = null
    chunksRef.current = []
    
    if (videoPlaybackRef.current) {
      videoPlaybackRef.current.src = ''
    }
  }, [])
  
  // Toggle video/audio
  const toggleVideo = useCallback(() => {
    if (mediaStreamRef.current) {
      const videoTrack = mediaStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setVideoEnabled(videoTrack.enabled)
      }
    }
  }, [])
  
  const toggleAudio = useCallback(() => {
    if (mediaStreamRef.current) {
      const audioTrack = mediaStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setAudioEnabled(audioTrack.enabled)
      }
    }
  }, [])
  
  // Upload recording
  const handleUpload = useCallback(async () => {
    if (!recordingBlobRef.current || !onUpload) return
    
    setIsUploading(true)
    setError(null)
    
    try {
      await onUpload(recordingBlobRef.current)
      // Reset after successful upload
      resetRecording()
    } catch (err: any) {
      console.error('Upload error:', err)
      setError(err.message || 'Failed to upload video. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }, [onUpload, resetRecording])
  
  // Download recording
  const downloadRecording = useCallback(() => {
    if (!recordingBlobRef.current) return
    
    const url = URL.createObjectURL(recordingBlobRef.current)
    const a = document.createElement('a')
    a.href = url
    a.download = `recording-${Date.now()}.webm`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [])
  
  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }
  
  // Initialize on mount
  useEffect(() => {
    initializeStream()
    
    return () => {
      // Cleanup
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(track => track.stop())
      }
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [initializeStream]) // Include initializeStream in dependencies
  
  // Re-initialize when devices change
  useEffect(() => {
    if (hasPermission) {
      initializeStream()
    }
  }, [selectedCamera, selectedMicrophone])
  
  return (
    <>
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Video className="w-5 h-5" />
            Video Recorder
          </span>
          {request && (
            <Badge variant="outline">
              Request #{request.id.slice(0, 8)}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Request Details */}
        {request && !hasRecording && (
          <div className="bg-muted rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">Recording for: {request.recipient_name}</p>
            <p className="text-sm text-muted-foreground">Occasion: {request.occasion}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              Instructions: {request.instructions}
            </p>
          </div>
        )}
        
        {/* Video Preview/Playback */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          {!hasRecording ? (
            <>
              <video
                ref={videoPreviewRef}
                autoPlay
                muted
                playsInline
                className={cn(
                  "w-full h-full object-cover",
                  !videoEnabled && "hidden"
                )}
              />
              {!videoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <VideoOff className="w-12 h-12 text-muted-foreground" />
                </div>
              )}
              
              {/* Recording Indicator */}
              {isRecording && (
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className={cn(
                    "w-3 h-3 rounded-full",
                    isPaused ? "bg-yellow-500" : "bg-red-500 animate-pulse"
                  )} />
                  <span className="text-white font-medium">
                    {isPaused ? "Paused" : "Recording"}
                  </span>
                </div>
              )}
              
              {/* Timer */}
              {isRecording && (
                <div className="absolute top-4 right-4 bg-black/50 px-3 py-1 rounded-full">
                  <span className="text-white font-mono">
                    {formatTime(recordingTime)} / {formatTime(maxDuration)}
                  </span>
                </div>
              )}
            </>
          ) : (
            <video
              ref={videoPlaybackRef}
              controls
              className="w-full h-full object-contain"
            />
          )}
          
          {/* Initializing Overlay */}
          {isInitializing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
        
        {/* Progress Bar */}
        {isRecording && (
          <Progress 
            value={(recordingTime / maxDuration) * 100} 
            className="h-2"
          />
        )}
        
        {/* Controls */}
        <div className="flex flex-wrap gap-2 justify-center">
          {!hasRecording ? (
            <>
              {!isRecording ? (
                <>
                  <Button
                    onClick={startRecording}
                    disabled={!hasPermission || isInitializing}
                    size="lg"
                    className="gap-2"
                  >
                    <Circle className="w-5 h-5 fill-current" />
                    Start Recording
                  </Button>
                  
                  <Button
                    onClick={toggleVideo}
                    variant="outline"
                    size="icon"
                    disabled={isInitializing}
                  >
                    {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    onClick={toggleAudio}
                    variant="outline"
                    size="icon"
                    disabled={isInitializing}
                  >
                    {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={stopRecording}
                    variant="destructive"
                    size="lg"
                    className="gap-2"
                  >
                    <Square className="w-5 h-5" />
                    Stop
                  </Button>
                  
                  <Button
                    onClick={togglePause}
                    variant="outline"
                    size="lg"
                    className="gap-2"
                  >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                    {isPaused ? "Resume" : "Pause"}
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <Button
                onClick={resetRecording}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                Record Again
              </Button>
              
              <Button
                onClick={downloadRecording}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <Download className="w-5 h-5" />
                Download
              </Button>
              
              <Button
                onClick={() => setShowThumbnailCapture(true)}
                variant="outline"
                size="lg"
                className="gap-2"
              >
                <ImageIcon className="w-5 h-5" />
                Add Thumbnail
              </Button>
              
              {enableWatermark && (
                <Button
                  onClick={() => setCurrentStep('watermark')}
                  variant="outline"
                  size="lg"
                  className="gap-2"
                >
                  <Paintbrush className="w-5 h-5" />
                  Watermark Settings
                </Button>
              )}

              {onUpload && (
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  size="lg"
                  className="gap-2"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" />
                      Upload Video
                    </>
                  )}
                </Button>
              )}
            </>
          )}
        </div>
        
        {/* Device Selection (when not recording) */}
        {!isRecording && !hasRecording && hasPermission && (
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Camera
              </label>
              <select
                value={selectedCamera}
                onChange={(e) => setSelectedCamera(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                disabled={isInitializing}
              >
                {availableCameras.map(camera => (
                  <option key={camera.deviceId} value={camera.deviceId}>
                    {camera.label || `Camera ${camera.deviceId.slice(0, 8)}`}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Microphone
              </label>
              <select
                value={selectedMicrophone}
                onChange={(e) => setSelectedMicrophone(e.target.value)}
                className="w-full px-3 py-2 border rounded-md"
                disabled={isInitializing}
              >
                {availableMicrophones.map(mic => (
                  <option key={mic.deviceId} value={mic.deviceId}>
                    {mic.label || `Microphone ${mic.deviceId.slice(0, 8)}`}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </CardContent>
    </Card>

    {/* Thumbnail Capture Modal */}
    {showThumbnailCapture && recordingBlobRef.current && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
          <VideoThumbnailCapture
            videoBlob={recordingBlobRef.current}
            onThumbnailSelect={(thumbnail) => {
              console.log('Thumbnail selected:', thumbnail)
            }}
            onThumbnailUpload={async (thumbnailBlob, timestamp) => {
              if (onThumbnailUpload) {
                await onThumbnailUpload(thumbnailBlob, timestamp)
              }
              setShowThumbnailCapture(false)
            }}
          />
          <div className="p-4 border-t flex justify-end">
            <Button 
              variant="outline" 
              onClick={() => setShowThumbnailCapture(false)}
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    )}

    {/* Watermark Settings Panel */}
    {currentStep === 'watermark' && (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
          <WatermarkPreview
            config={watermarkConfig}
            onChange={setWatermarkConfig}
            previewImage={recordingBlobRef.current ? URL.createObjectURL(recordingBlobRef.current) : undefined}
          />
          <div className="p-4 border-t flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep('record')}
            >
              Close
            </Button>
            <Button 
              onClick={() => {
                // Apply watermark settings and close
                setCurrentStep('record')
                console.log('Watermark settings applied:', watermarkConfig)
              }}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              Apply Settings
            </Button>
          </div>
        </div>
      </div>
    )}
  </>
  )
}