'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Radio, 
  XCircle,
  Settings,
  Users,
  DollarSign,
  BarChart3,
  MessageSquare,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { cn } from '@/lib/utils';

interface StreamStats {
  viewers: number;
  duration: number;
  earnings: number;
  gifts: number;
  bitrate: number;
  fps: number;
  droppedFrames: number;
}

export function CreatorStreamInterface() {
  const { toast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

  // Stream state
  const [isStreaming, setIsStreaming] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [streamId, setStreamId] = useState<string | null>(null);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);

  // Media controls
  const [hasVideo, setHasVideo] = useState(true);
  const [hasAudio, setHasAudio] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>('');
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);

  // Stream settings
  const [streamTitle, setStreamTitle] = useState('');
  const [streamDescription, setStreamDescription] = useState('');
  const [streamQuality, setStreamQuality] = useState('HD-720p');
  const [streamCategory, setStreamCategory] = useState('general');

  // Stream stats
  const [stats, setStats] = useState<StreamStats>({
    viewers: 0,
    duration: 0,
    earnings: 0,
    gifts: 0,
    bitrate: 0,
    fps: 30,
    droppedFrames: 0
  });

  // Connection quality
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor'>('excellent');

  // Get available media devices
  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(d => d.kind === 'videoinput');
        const audioDevices = devices.filter(d => d.kind === 'audioinput');
        
        setCameras(videoDevices);
        setMicrophones(audioDevices);
        
        if (videoDevices.length > 0 && !selectedCamera) {
          setSelectedCamera(videoDevices[0].deviceId);
        }
        if (audioDevices.length > 0 && !selectedMicrophone) {
          setSelectedMicrophone(audioDevices[0].deviceId);
        }
      } catch (error) {
        console.error('Failed to enumerate devices:', error);
      }
    };

    getDevices();
    navigator.mediaDevices.addEventListener('devicechange', getDevices);
    
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', getDevices);
    };
  }, [selectedCamera, selectedMicrophone]);

  // Initialize local media stream
  const initializeMediaStream = useCallback(async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: hasVideo ? {
          deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        } : false,
        audio: hasAudio ? {
          deviceId: selectedMicrophone ? { exact: selectedMicrophone } : undefined,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } : false
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      return stream;
    } catch (error) {
      console.error('Failed to get media stream:', error);
      toast({
        title: 'Camera/Microphone Error',
        description: 'Failed to access camera or microphone. Please check permissions.',
        variant: 'destructive'
      });
      throw error;
    }
  }, [hasVideo, hasAudio, selectedCamera, selectedMicrophone, toast]);

  // Start preview
  useEffect(() => {
    if (!isStreaming) {
      initializeMediaStream().catch(console.error);
    }

    return () => {
      if (localStreamRef.current && !isStreaming) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isStreaming, initializeMediaStream]);

  // Start streaming
  const startStream = async () => {
    if (!streamTitle) {
      toast({
        title: 'Title Required',
        description: 'Please enter a stream title',
        variant: 'destructive'
      });
      return;
    }

    setIsPreparing(true);

    try {
      // Get media stream
      const stream = await initializeMediaStream();

      // Create peer connection
      const pc = new RTCPeerConnection({
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' }
        ]
      });
      peerConnectionRef.current = pc;

      // Add tracks to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Create offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send offer to server
      const response = await fetch('/api/streaming/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: streamTitle,
          description: streamDescription,
          quality: streamQuality,
          category: streamCategory,
          offer: offer
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start stream');
      }

      const data = await response.json();
      
      // Set remote description
      await pc.setRemoteDescription(data.answer);

      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          // Send ICE candidate to server
          fetch('/api/streaming/ice-candidate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              streamId: data.streamId,
              candidate: event.candidate
            })
          });
        }
      };

      // Monitor connection state
      pc.onconnectionstatechange = () => {
        console.log('Connection state:', pc.connectionState);
        if (pc.connectionState === 'connected') {
          setConnectionQuality('excellent');
        } else if (pc.connectionState === 'connecting') {
          setConnectionQuality('good');
        } else if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          setConnectionQuality('poor');
        }
      };

      setStreamId(data.streamId);
      setPlaybackUrl(data.playbackUrl);
      setIsStreaming(true);
      setIsPreparing(false);

      toast({
        title: 'Stream Started',
        description: 'Your live stream is now active!'
      });

      // Start monitoring stats
      startStatsMonitoring(pc);

    } catch (error) {
      console.error('Failed to start stream:', error);
      setIsPreparing(false);
      toast({
        title: 'Stream Error',
        description: 'Failed to start stream. Please try again.',
        variant: 'destructive'
      });
    }
  };

  // Stop streaming
  const stopStream = async () => {
    if (!streamId) return;

    try {
      await fetch('/api/streaming/stop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streamId })
      });

      // Close peer connection
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close();
        peerConnectionRef.current = null;
      }

      // Stop media tracks
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
        localStreamRef.current = null;
      }

      setIsStreaming(false);
      setStreamId(null);
      setPlaybackUrl(null);

      toast({
        title: 'Stream Ended',
        description: `Stream duration: ${Math.floor(stats.duration / 60)} minutes`
      });

      // Reset stats
      setStats({
        viewers: 0,
        duration: 0,
        earnings: 0,
        gifts: 0,
        bitrate: 0,
        fps: 30,
        droppedFrames: 0
      });

    } catch (error) {
      console.error('Failed to stop stream:', error);
      toast({
        title: 'Error',
        description: 'Failed to stop stream properly',
        variant: 'destructive'
      });
    }
  };

  // Monitor stream statistics
  const startStatsMonitoring = (pc: RTCPeerConnection) => {
    const interval = setInterval(async () => {
      if (pc.connectionState !== 'connected') {
        return;
      }

      const stats = await pc.getStats();
      stats.forEach((report) => {
        if (report.type === 'outbound-rtp' && report.kind === 'video') {
          setStats(prev => ({
            ...prev,
            bitrate: Math.round((report.bytesSent || 0) / 1000),
            fps: report.framesPerSecond || 30,
            droppedFrames: report.framesDropped || 0
          }));
        }
      });

      // Update duration
      setStats(prev => ({
        ...prev,
        duration: prev.duration + 1
      }));
    }, 1000);

    return () => clearInterval(interval);
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !hasVideo;
        setHasVideo(!hasVideo);
      }
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !hasAudio;
        setHasAudio(!hasAudio);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Main Stream Area */}
      <div className="lg:col-span-2 space-y-4">
        {/* Preview/Live Video */}
        <Card>
          <CardContent className="p-0">
            <div className="relative aspect-video bg-black rounded-t-lg overflow-hidden">
              <video
                ref={videoRef}
                className="w-full h-full object-cover"
                autoPlay
                playsInline
                muted
              />
              
              {/* Stream Status Overlay */}
              {isStreaming && (
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <Badge variant="destructive" className="animate-pulse">
                    <Radio className="w-3 h-3 mr-1" />
                    LIVE
                  </Badge>
                  <Badge variant="secondary">
                    <Users className="w-3 h-3 mr-1" />
                    {stats.viewers}
                  </Badge>
                </div>
              )}

              {/* Connection Quality */}
              <div className="absolute top-4 right-4">
                <Badge
                  variant={
                    connectionQuality === 'excellent' ? 'default' :
                    connectionQuality === 'good' ? 'secondary' : 'destructive'
                  }
                >
                  {connectionQuality === 'excellent' ? '●●●' :
                   connectionQuality === 'good' ? '●●○' : '●○○'}
                </Badge>
              </div>

              {/* Media Controls */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                <Button
                  size="icon"
                  variant={hasVideo ? 'secondary' : 'destructive'}
                  onClick={toggleVideo}
                  disabled={isStreaming}
                >
                  {hasVideo ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
                <Button
                  size="icon"
                  variant={hasAudio ? 'secondary' : 'destructive'}
                  onClick={toggleAudio}
                  disabled={isStreaming}
                >
                  {hasAudio ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Stream Controls */}
            <div className="p-4 border-t">
              {!isStreaming ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Stream Title *</Label>
                      <Input
                        id="title"
                        placeholder="What are you streaming today?"
                        value={streamTitle}
                        onChange={(e) => setStreamTitle(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select value={streamCategory} onValueChange={setStreamCategory}>
                        <SelectTrigger id="category">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General</SelectItem>
                          <SelectItem value="music">Music</SelectItem>
                          <SelectItem value="talk">Talk Show</SelectItem>
                          <SelectItem value="gaming">Gaming</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Tell viewers what your stream is about..."
                      value={streamDescription}
                      onChange={(e) => setStreamDescription(e.target.value)}
                      rows={3}
                    />
                  </div>

                  <Button
                    className="w-full"
                    size="lg"
                    onClick={startStream}
                    disabled={isPreparing}
                  >
                    {isPreparing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                        Preparing Stream...
                      </>
                    ) : (
                      <>
                        <Radio className="mr-2 h-4 w-4" />
                        Go Live
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Your stream is live! Share this link with viewers:{' '}
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {playbackUrl}
                      </code>
                    </AlertDescription>
                  </Alert>

                  <Button
                    className="w-full"
                    size="lg"
                    variant="destructive"
                    onClick={stopStream}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    End Stream
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Stream Settings */}
        {!isStreaming && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Stream Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="camera">Camera</Label>
                  <Select value={selectedCamera} onValueChange={setSelectedCamera}>
                    <SelectTrigger id="camera">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {cameras.map((camera) => (
                        <SelectItem key={camera.deviceId} value={camera.deviceId}>
                          {camera.label || 'Camera'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="microphone">Microphone</Label>
                  <Select value={selectedMicrophone} onValueChange={setSelectedMicrophone}>
                    <SelectTrigger id="microphone">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {microphones.map((mic) => (
                        <SelectItem key={mic.deviceId} value={mic.deviceId}>
                          {mic.label || 'Microphone'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="quality">Stream Quality</Label>
                <Select value={streamQuality} onValueChange={setStreamQuality}>
                  <SelectTrigger id="quality">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HD-720p">HD 720p (Recommended)</SelectItem>
                    <SelectItem value="SD-540p">SD 540p</SelectItem>
                    <SelectItem value="SD-360p">SD 360p (Low bandwidth)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar - Stats & Chat */}
      <div className="space-y-4">
        {/* Stream Stats */}
        {isStreaming && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Stream Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="font-medium">
                  {Math.floor(stats.duration / 60)}:{(stats.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Viewers</span>
                <span className="font-medium">{stats.viewers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Bitrate</span>
                <span className="font-medium">{stats.bitrate} kbps</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">FPS</span>
                <span className="font-medium">{stats.fps}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Dropped Frames</span>
                <span className="font-medium">{stats.droppedFrames}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Earnings */}
        {isStreaming && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Live Earnings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-3xl font-bold">
                ${stats.earnings.toFixed(2)}
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Virtual Gifts</span>
                <span>{stats.gifts}</span>
              </div>
              <Progress value={65} className="h-2" />
              <p className="text-xs text-muted-foreground">
                65% to your daily goal
              </p>
            </CardContent>
          </Card>
        )}

        {/* Chat Preview */}
        {isStreaming && (
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Live Chat
              </CardTitle>
              <CardDescription>
                Chat moderation coming soon
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-muted rounded-md flex items-center justify-center text-muted-foreground">
                Chat messages will appear here
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}