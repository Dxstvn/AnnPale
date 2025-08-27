'use client'

import React, { useRef, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Radio,
  RefreshCw,
  Copy,
  Info,
  Play,
  Pause
} from 'lucide-react'
import { toast } from 'sonner'

export default function SimpleTestStreamPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  
  // Your AWS IVS stream URL
  const streamUrl = 'https://eb5fc6c5eb1d.us-east-1.playback.live-video.net/api/video/v1/us-east-1.206254861786.channel.ALKd3nFpmt5Z.m3u8'

  const copyUrl = () => {
    navigator.clipboard.writeText(streamUrl)
    toast.success('Stream URL copied to clipboard')
  }

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play()
        setIsPlaying(true)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Radio className="h-8 w-8 text-red-600 animate-pulse" />
            Simple Stream Test
          </h1>
          <p className="text-gray-600">
            Native HTML5 video player (works best in Safari on Mac/iOS)
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Stream URL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input value={streamUrl} readOnly className="font-mono text-sm" />
              <Button size="sm" variant="outline" onClick={copyUrl}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Live Stream
              <Badge className="bg-red-600 text-white animate-pulse">
                <Radio className="h-3 w-3 mr-1" />
                LIVE
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative bg-black">
              <video
                ref={videoRef}
                src={streamUrl}
                className="w-full aspect-video"
                controls
                autoPlay
                muted
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          </CardContent>
        </Card>

        <Alert className="mt-6">
          <Info className="h-4 w-4" />
          <AlertDescription>
            <strong>Note:</strong> This simple player works best in Safari (Mac/iOS) which has native HLS support. 
            For other browsers, use the main test page at /test-stream which includes HLS.js for wider compatibility.
          </AlertDescription>
        </Alert>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Alternative Viewing Options</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Option 1: VLC Media Player</h3>
              <ol className="list-decimal list-inside text-sm text-gray-600 space-y-1">
                <li>Download and open VLC Media Player</li>
                <li>Go to Media → Open Network Stream</li>
                <li>Paste the stream URL and click Play</li>
              </ol>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Option 2: Online HLS Player</h3>
              <p className="text-sm text-gray-600">
                Visit <a href="https://www.hlsplayer.net/" target="_blank" className="text-blue-600 underline">hlsplayer.net</a> and paste your stream URL
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Option 3: FFPlay (Command Line)</h3>
              <code className="block bg-gray-100 p-2 rounded text-sm">
                ffplay {streamUrl}
              </code>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>OBS Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Server:</strong> <code className="bg-gray-100 px-1">rtmps://eb5fc6c5eb1d.global-contribute.live-video.net:443/app/</code></p>
              <p><strong>Stream Key:</strong> <code className="bg-gray-100 px-1">REDACTED</code></p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}