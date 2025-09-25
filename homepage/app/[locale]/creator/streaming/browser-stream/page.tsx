'use client'

import React, { useRef, useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Video, 
  Mic, 
  MicOff, 
  VideoOff,
  Radio,
  Square,
  Settings,
  Monitor,
  Camera,
  Smartphone
} from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function BrowserStreamPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [selectedCamera, setSelectedCamera] = useState<string>('')
  const [selectedMic, setSelectedMic] = useState<string>('')
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([])
  const [streamMode, setStreamMode] = useState<'camera' | 'screen' | 'both'>('camera')

  useEffect(() => {
    // Get available devices
    navigator.mediaDevices.enumerateDevices().then(setDevices)
  }, [])

  const startStream = async () => {
    try {
      let stream: MediaStream

      if (streamMode === 'screen') {
        // Screen sharing
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { width: 1920, height: 1080, frameRate: 30 },
          audio: true
        })
      } else if (streamMode === 'both') {
        // Picture-in-picture: screen + camera
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: { width: 1920, height: 1080, frameRate: 30 },
          audio: false
        })
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: selectedCamera, width: 320, height: 180 },
          audio: { deviceId: selectedMic }
        })
        
        // Combine streams (would need canvas for PiP)
        stream = screenStream
        // Add camera as picture-in-picture overlay (requires canvas implementation)
      } else {
        // Camera only
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedCamera,
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            frameRate: { ideal: 30 }
          },
          audio: {
            deviceId: selectedMic,
            echoCancellation: true,
            noiseSuppression: true
          }
        })
      }

      setMediaStream(stream)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      // Here we would send the stream to AWS IVS via WebRTC
      // This requires additional setup with AWS IVS WebRTC endpoints
      await sendStreamToIVS(stream)
      
      setIsStreaming(true)
    } catch (error) {
      console.error('Error starting stream:', error)
    }
  }

  const sendStreamToIVS = async (stream: MediaStream) => {
    // This would connect to AWS IVS via WebRTC
    // Requires setting up WebRTC ingest on AWS IVS
    
    // Placeholder for WebRTC implementation
    console.log('Sending stream to IVS...', stream)
    
    // In production, this would:
    // 1. Get WebRTC endpoint from API
    // 2. Create RTCPeerConnection
    // 3. Add stream tracks
    // 4. Exchange SDP with server
    // 5. Start streaming
  }

  const stopStream = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop())
      setMediaStream(null)
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setIsStreaming(false)
  }

  const toggleVideo = () => {
    if (mediaStream) {
      const videoTrack = mediaStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setVideoEnabled(videoTrack.enabled)
      }
    }
  }

  const toggleAudio = () => {
    if (mediaStream) {
      const audioTrack = mediaStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setAudioEnabled(audioTrack.enabled)
      }
    }
  }

  const cameras = devices.filter(d => d.kind === 'videoinput')
  const microphones = devices.filter(d => d.kind === 'audioinput')

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Radio className="h-8 w-8 text-red-600" />
          Browser Streaming (Beta)
        </h1>
        <p className="text-gray-600 mt-2">
          Stream directly from your browser - no OBS needed!
        </p>
      </div>

      {/* Stream Setup */}
      {!isStreaming && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Stream Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Stream Mode Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Stream Mode</label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={streamMode === 'camera' ? 'default' : 'outline'}
                  onClick={() => setStreamMode('camera')}
                  className="flex flex-col h-auto py-4"
                >
                  <Camera className="h-6 w-6 mb-2" />
                  <span>Camera</span>
                </Button>
                <Button
                  variant={streamMode === 'screen' ? 'default' : 'outline'}
                  onClick={() => setStreamMode('screen')}
                  className="flex flex-col h-auto py-4"
                >
                  <Monitor className="h-6 w-6 mb-2" />
                  <span>Screen Share</span>
                </Button>
                <Button
                  variant={streamMode === 'both' ? 'default' : 'outline'}
                  onClick={() => setStreamMode('both')}
                  className="flex flex-col h-auto py-4"
                >
                  <Smartphone className="h-6 w-6 mb-2" />
                  <span>Both (PiP)</span>
                </Button>
              </div>
            </div>

            {/* Device Selection */}
            {streamMode !== 'screen' && (
              <>
                <div>
                  <label className="text-sm font-medium mb-2 block">Camera</label>
                  <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select camera" />
                    </SelectTrigger>
                    <SelectContent>
                      {cameras.map(camera => (
                        <SelectItem key={camera.deviceId} value={camera.deviceId}>
                          {camera.label || `Camera ${camera.deviceId.slice(0, 5)}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Microphone</label>
                  <Select value={selectedMic} onValueChange={setSelectedMic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select microphone" />
                    </SelectTrigger>
                    <SelectContent>
                      {microphones.map(mic => (
                        <SelectItem key={mic.deviceId} value={mic.deviceId}>
                          {mic.label || `Microphone ${mic.deviceId.slice(0, 5)}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Button 
              onClick={startStream} 
              className="w-full"
              size="lg"
            >
              <Radio className="mr-2 h-5 w-5" />
              Start Streaming
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stream Preview */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              Stream Preview
              {isStreaming && (
                <Badge className="bg-red-600 text-white animate-pulse">
                  <Radio className="h-3 w-3 mr-1" />
                  LIVE
                </Badge>
              )}
            </CardTitle>
            {isStreaming && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant={videoEnabled ? "outline" : "secondary"}
                  onClick={toggleVideo}
                >
                  {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant={audioEnabled ? "outline" : "secondary"}
                  onClick={toggleAudio}
                >
                  {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={stopStream}
                >
                  <Square className="h-4 w-4 mr-2" />
                  Stop
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="relative bg-black aspect-video">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full"
            />
            {!isStreaming && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <Video className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Stream preview will appear here</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Alert className="mt-6">
        <Settings className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> Browser streaming is in beta. For professional streaming with 
          overlays, scenes, and advanced features, we recommend using OBS Studio.
        </AlertDescription>
      </Alert>
    </div>
  )
}