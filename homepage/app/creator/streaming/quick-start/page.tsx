'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Radio, 
  Copy, 
  Download, 
  Monitor,
  Smartphone,
  Video,
  Zap,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Play,
  Settings
} from 'lucide-react'
import { toast } from 'sonner'

export default function StreamQuickStartPage() {
  const [channelCreated, setChannelCreated] = useState(false)
  const [streamKey, setStreamKey] = useState('')
  const [selectedMethod, setSelectedMethod] = useState<'browser' | 'obs' | 'mobile'>('browser')
  
  // Simulated channel data
  const channelData = {
    playbackUrl: 'https://eb5fc6c5eb1d.us-east-1.playback.live-video.net/api/video/v1/us-east-1.206254861786.channel.ALKd3nFpmt5Z.m3u8',
    serverUrl: 'rtmps://eb5fc6c5eb1d.global-contribute.live-video.net:443/app/',
    streamKey: 'REDACTED'
  }

  const createChannel = async () => {
    // Simulate channel creation
    setTimeout(() => {
      setChannelCreated(true)
      setStreamKey(channelData.streamKey)
      toast.success('Channel created! You can now start streaming.')
    }, 2000)
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard`)
  }

  const downloadOBSConfig = () => {
    // Create clear setup instructions (OBS doesn't support direct config import)
    const instructions = `ANN PALE - OBS QUICK SETUP INSTRUCTIONS
=========================================

COPY & PASTE SETUP (2 minutes):

Step 1: Open OBS Settings
• File → Settings (or OBS → Preferences on Mac)

Step 2: Go to "Stream" section
• Service: Choose "Custom"
• Server: Copy and paste this:
${channelData.serverUrl}

• Stream Key: Copy and paste this:
${channelData.streamKey}

Step 3: Click "OK" to save

YOU'RE READY TO STREAM! Just click "Start Streaming" in OBS.

=========================================
RECOMMENDED SETTINGS (Optional):

In Settings → Output:
• Video Bitrate: 4500 Kbps
• Audio Bitrate: 160 Kbps

In Settings → Video:
• Base Resolution: 1920x1080
• Output Resolution: 1920x1080
• FPS: 30

=========================================
NEED HELP?
Visit: https://annpale.com/help/streaming
`

    const blob = new Blob([instructions], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'AnnPale_OBS_Setup.txt'
    a.click()
    toast.success('Setup instructions downloaded! Open the file for easy copy & paste.')
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Zap className="h-10 w-10 text-yellow-500" />
          Quick Start Streaming
        </h1>
        <p className="text-lg text-gray-600">
          Get live in 60 seconds with our simplified streaming setup
        </p>
      </div>

      {/* Step 1: Create Channel */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                1
              </div>
              <CardTitle>Create Your Channel</CardTitle>
            </div>
            {channelCreated && <CheckCircle className="h-5 w-5 text-green-600" />}
          </div>
        </CardHeader>
        <CardContent>
          {!channelCreated ? (
            <Button 
              onClick={createChannel} 
              size="lg" 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Radio className="mr-2 h-5 w-5" />
              Create Streaming Channel
            </Button>
          ) : (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Channel created successfully! Your stream is ready to go live.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Choose Method */}
      {channelCreated && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                2
              </div>
              <CardTitle>Choose Your Streaming Method</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedMethod} onValueChange={(v: any) => setSelectedMethod(v)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="browser" className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  Browser
                </TabsTrigger>
                <TabsTrigger value="obs" className="flex items-center gap-2">
                  <Video className="h-4 w-4" />
                  OBS Studio
                </TabsTrigger>
                <TabsTrigger value="mobile" className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  Mobile
                </TabsTrigger>
              </TabsList>

              <TabsContent value="browser" className="mt-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                    <h3 className="font-semibold text-blue-900 mb-2">Easiest Option - No Downloads!</h3>
                    <p className="text-blue-700 text-sm mb-4">
                      Stream directly from your browser with one click. Perfect for quick streams and beginners.
                    </p>
                    <Button 
                      size="lg" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => window.location.href = '/creator/streaming/browser-stream'}
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Start Browser Streaming
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    ✅ No software needed<br/>
                    ✅ Works instantly<br/>
                    ✅ Camera & screen sharing<br/>
                    ⚠️ Limited features compared to OBS
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="obs" className="mt-6">
                <div className="space-y-4">
                  <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
                    <h3 className="font-semibold text-purple-900 mb-2">Professional Streaming</h3>
                    <p className="text-purple-700 text-sm mb-4">
                      Use OBS Studio for professional features like overlays, scenes, and advanced settings.
                    </p>
                    
                    <div className="space-y-3">
                      {/* One-Click Download */}
                      <Button 
                        size="lg" 
                        className="w-full bg-purple-600 hover:bg-purple-700"
                        onClick={downloadOBSConfig}
                      >
                        <Download className="mr-2 h-5 w-5" />
                        Download One-Click OBS Config
                      </Button>

                      {/* Manual Setup */}
                      <div className="border rounded-lg p-3 bg-white">
                        <h4 className="font-medium mb-2">Or Configure Manually:</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Server:</span>
                            <div className="flex gap-1">
                              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {channelData.serverUrl}
                              </code>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(channelData.serverUrl, 'Server URL')}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Stream Key:</span>
                            <div className="flex gap-1">
                              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                                {streamKey.substring(0, 10)}...
                              </code>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(streamKey, 'Stream Key')}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* OBS Download Link */}
                      <a
                        href="https://obsproject.com/download"
                        target="_blank"
                        className="flex items-center justify-center gap-2 text-sm text-purple-600 hover:text-purple-700"
                      >
                        Don't have OBS? Download it here
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mobile" className="mt-6">
                <div className="space-y-4">
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-900 mb-2">Stream from Your Phone</h3>
                    <p className="text-green-700 text-sm mb-4">
                      Use our mobile web app to stream on the go. Works on iOS and Android browsers.
                    </p>
                    <Button 
                      size="lg" 
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        // Generate QR code or mobile link
                        const mobileUrl = `${window.location.origin}/creator/streaming/mobile?key=${streamKey}`
                        if (/Android|iPhone/i.test(navigator.userAgent)) {
                          window.location.href = '/creator/streaming/browser-stream'
                        } else {
                          toast.info('Scan QR code with your phone or visit on mobile browser')
                        }
                      }}
                    >
                      <Smartphone className="mr-2 h-5 w-5" />
                      Open Mobile Streaming
                    </Button>
                  </div>
                  <div className="text-sm text-gray-600">
                    ✅ Stream from anywhere<br/>
                    ✅ Front & back camera<br/>
                    ✅ Built-in chat<br/>
                    ⚠️ Depends on phone performance
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Go Live */}
      {channelCreated && (
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold">
                3
              </div>
              <CardTitle>You're Ready to Stream!</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Alert>
                <Radio className="h-4 w-4 text-red-600 animate-pulse" />
                <AlertDescription>
                  Your stream will be live at: 
                  <br/>
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                    {window.location.origin}/fan/livestreams/your-stream
                  </code>
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => window.location.href = '/creator/streaming'}>
                  <Settings className="mr-2 h-4 w-4" />
                  Advanced Settings
                </Button>
                <Button 
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    toast.success('Opening stream preview...')
                    window.open('/test-stream', '_blank')
                  }}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Preview Stream
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle>Need Help?</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <a href="/help/streaming-guide" className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
              <Video className="h-4 w-4" />
              <span className="text-sm">Streaming Guide</span>
            </a>
            <a href="/help/troubleshooting" className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
              <Settings className="h-4 w-4" />
              <span className="text-sm">Troubleshooting</span>
            </a>
            <a href="/help/best-practices" className="flex items-center gap-2 text-purple-600 hover:text-purple-700">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm">Best Practices</span>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}