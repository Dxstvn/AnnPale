'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  MonitorSpeaker,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Wifi,
  WifiOff,
  Volume2,
  VolumeX,
  Maximize2,
  Play,
  Pause,
  BarChart3,
  Activity,
  Signal,
  Download,
  Upload
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  MediaDevice,
  StreamHealth,
  DeviceStatus,
  STREAM_QUALITY_REQUIREMENTS,
  BACKGROUND_EFFECTS
} from '@/lib/types/creator-streaming';

interface StreamPreviewProps {
  devices: MediaDevice[];
  streamHealth: StreamHealth;
  onDeviceChange: (type: 'camera' | 'microphone', deviceId: string) => void;
  onTestConnection: () => Promise<void>;
  onStartPreview: () => void;
  onStopPreview: () => void;
  isPreviewActive: boolean;
  className?: string;
}

export function StreamPreview({
  devices,
  streamHealth,
  onDeviceChange,
  onTestConnection,
  onStartPreview,
  onStopPreview,
  isPreviewActive,
  className
}: StreamPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>(0);
  
  const [selectedCamera, setSelectedCamera] = useState<string>('');
  const [selectedMicrophone, setSelectedMicrophone] = useState<string>('');
  const [selectedOutput, setSelectedOutput] = useState<string>('');
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectionTesting, setConnectionTesting] = useState(false);
  const [backgroundEffect, setBackgroundEffect] = useState<string>('none');
  const [activeTab, setActiveTab] = useState('devices');

  // Get devices by type
  const cameras = devices.filter(device => device.kind === 'videoinput');
  const microphones = devices.filter(device => device.kind === 'audioinput');
  const outputs = devices.filter(device => device.kind === 'audiooutput');

  // Initialize devices
  useEffect(() => {
    if (cameras.length > 0 && !selectedCamera) {
      const defaultCamera = cameras.find(cam => cam.selected) || cameras[0];
      setSelectedCamera(defaultCamera.id);
    }
    if (microphones.length > 0 && !selectedMicrophone) {
      const defaultMic = microphones.find(mic => mic.selected) || microphones[0];
      setSelectedMicrophone(defaultMic.id);
    }
    if (outputs.length > 0 && !selectedOutput) {
      const defaultOutput = outputs.find(out => out.selected) || outputs[0];
      setSelectedOutput(defaultOutput.id);
    }
  }, [devices, cameras, microphones, outputs, selectedCamera, selectedMicrophone, selectedOutput]);

  // Start camera stream
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: selectedCamera ? { exact: selectedCamera } : undefined },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOn(true);
      }
    } catch (error) {
      console.error('Failed to start camera:', error);
      setIsCameraOn(false);
    }
  }, [selectedCamera]);

  // Start microphone stream
  const startMicrophone = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { deviceId: selectedMicrophone ? { exact: selectedMicrophone } : undefined },
        video: false
      });

      // Set up audio level monitoring
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      
      analyser.fftSize = 256;
      source.connect(analyser);
      
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      
      setIsMicOn(true);
      monitorAudioLevel();
    } catch (error) {
      console.error('Failed to start microphone:', error);
      setIsMicOn(false);
    }
  }, [selectedMicrophone]);

  // Monitor audio level
  const monitorAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const updateLevel = () => {
      if (analyserRef.current) {
        analyserRef.current.getByteFrequencyData(dataArray);
        const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
        setAudioLevel(Math.min(100, (average / 255) * 100));
        
        if (isMicOn) {
          animationFrameRef.current = requestAnimationFrame(updateLevel);
        }
      }
    };
    
    updateLevel();
  }, [isMicOn]);

  // Stop streams
  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOn(false);
  }, []);

  const stopMicrophone = useCallback(() => {
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
      analyserRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    setIsMicOn(false);
    setAudioLevel(0);
  }, []);

  // Handle device changes
  const handleCameraChange = (deviceId: string) => {
    setSelectedCamera(deviceId);
    onDeviceChange('camera', deviceId);
    if (isCameraOn) {
      stopCamera();
      setTimeout(() => startCamera(), 100);
    }
  };

  const handleMicrophoneChange = (deviceId: string) => {
    setSelectedMicrophone(deviceId);
    onDeviceChange('microphone', deviceId);
    if (isMicOn) {
      stopMicrophone();
      setTimeout(() => startMicrophone(), 100);
    }
  };

  // Test connection
  const handleTestConnection = async () => {
    setConnectionTesting(true);
    try {
      await onTestConnection();
    } finally {
      setConnectionTesting(false);
    }
  };

  // Status indicators
  const getStatusIcon = (status: DeviceStatus) => {
    switch (status) {
      case 'good':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'unavailable':
        return <XCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: DeviceStatus) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      case 'unavailable': return 'text-gray-400';
    }
  };

  const getConnectionIcon = () => {
    const status = streamHealth.connection.status;
    if (status === 'good' || status === 'warning') {
      return <Wifi className="w-4 h-4" />;
    }
    return <WifiOff className="w-4 h-4" />;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      stopMicrophone();
    };
  }, [stopCamera, stopMicrophone]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Preview Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Stream Preview</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Test your equipment and connection before going live
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge 
            variant={streamHealth.overall === 'good' ? 'default' : 'destructive'}
            className={cn(
              streamHealth.overall === 'good' && 'bg-green-500 hover:bg-green-600',
              streamHealth.overall === 'warning' && 'bg-yellow-500 hover:bg-yellow-600'
            )}
          >
            {getStatusIcon(streamHealth.overall)}
            Overall: {streamHealth.overall}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Camera Preview</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={isCameraOn ? "destructive" : "default"}
                    size="sm"
                    onClick={isCameraOn ? stopCamera : startCamera}
                    disabled={!selectedCamera}
                  >
                    {isCameraOn ? (
                      <>
                        <VideoOff className="w-4 h-4 mr-2" />
                        Stop
                      </>
                    ) : (
                      <>
                        <Video className="w-4 h-4 mr-2" />
                        Start
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={cn(
                'relative bg-gray-900 rounded-lg overflow-hidden',
                isFullscreen ? 'aspect-video' : 'aspect-video'
              )}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                
                {!isCameraOn && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-white">
                      <VideoOff className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Camera Preview</p>
                      <p className="text-sm opacity-75">Start camera to preview</p>
                    </div>
                  </div>
                )}

                {/* Stream Quality Indicator */}
                <div className="absolute top-4 left-4">
                  <Badge className="bg-black/50 text-white border-0">
                    {streamHealth.camera.resolution} @ {streamHealth.camera.frameRate}fps
                  </Badge>
                </div>

                {/* Background Effect Indicator */}
                {backgroundEffect !== 'none' && (
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-purple-500 text-white">
                      Effect: {BACKGROUND_EFFECTS.find(e => e.id === backgroundEffect)?.name}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Background Effects */}
              <div className="mt-4">
                <label className="text-sm font-medium mb-2 block">Background Effects</label>
                <Select value={backgroundEffect} onValueChange={setBackgroundEffect}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select background effect" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {BACKGROUND_EFFECTS.map((effect) => (
                      <SelectItem key={effect.id} value={effect.id}>
                        {effect.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls Panel */}
        <div className="space-y-6">
          {/* Equipment Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Equipment Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Camera Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  <span className="text-sm">Camera</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(streamHealth.camera.status)}
                  <span className={cn('text-sm', getStatusColor(streamHealth.camera.status))}>
                    {streamHealth.camera.quality}%
                  </span>
                </div>
              </div>

              {/* Microphone Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mic className="w-4 h-4" />
                  <span className="text-sm">Microphone</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(streamHealth.microphone.status)}
                  <span className={cn('text-sm', getStatusColor(streamHealth.microphone.status))}>
                    {streamHealth.microphone.quality}%
                  </span>
                </div>
              </div>

              {/* Connection Status */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getConnectionIcon()}
                  <span className="text-sm">Connection</span>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusIcon(streamHealth.connection.status)}
                  <span className={cn('text-sm', getStatusColor(streamHealth.connection.status))}>
                    {streamHealth.connection.stability}%
                  </span>
                </div>
              </div>

              <Separator />

              {/* Test Connection */}
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={connectionTesting}
                className="w-full"
              >
                {connectionTesting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4 mr-2" />
                    Test Connection
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Audio Monitor */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Audio Monitor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Button
                    variant={isMicOn ? "destructive" : "default"}
                    size="sm"
                    onClick={isMicOn ? stopMicrophone : startMicrophone}
                    disabled={!selectedMicrophone}
                  >
                    {isMicOn ? (
                      <>
                        <MicOff className="w-4 h-4 mr-2" />
                        Mute
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Test Mic
                      </>
                    )}
                  </Button>
                  
                  <span className="text-sm text-gray-600">
                    Level: {Math.round(audioLevel)}%
                  </span>
                </div>

                {/* Audio Level Meter */}
                <div className="space-y-2">
                  <Progress 
                    value={audioLevel} 
                    className={cn(
                      'h-3',
                      audioLevel > 80 && '[&>div]:bg-red-500',
                      audioLevel > 60 && audioLevel <= 80 && '[&>div]:bg-yellow-500',
                      audioLevel <= 60 && '[&>div]:bg-green-500'
                    )}
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Silent</span>
                    <span>Optimal</span>
                    <span>Too Loud</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stream Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Stream Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Current Quality:</span>
                  <Badge variant={
                    streamHealth.overall === 'good' ? 'default' : 
                    streamHealth.overall === 'warning' ? 'secondary' : 'destructive'
                  }>
                    {streamHealth.camera.quality >= STREAM_QUALITY_REQUIREMENTS.optimal.camera.quality ? 'Optimal' :
                     streamHealth.camera.quality >= STREAM_QUALITY_REQUIREMENTS.recommended.camera.quality ? 'Good' :
                     streamHealth.camera.quality >= STREAM_QUALITY_REQUIREMENTS.minimum.camera.quality ? 'Basic' : 'Poor'}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Bandwidth:</span>
                    <span>{(streamHealth.connection.bandwidth / 1000).toFixed(1)} Mbps</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Latency:</span>
                    <span>{streamHealth.connection.latency}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frame Rate:</span>
                    <span>{streamHealth.camera.frameRate} fps</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Device Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Device Configuration</CardTitle>
          <CardDescription>
            Select and configure your streaming devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="devices">Devices</TabsTrigger>
              <TabsTrigger value="quality">Quality</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="devices" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Camera Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Camera</label>
                  <Select value={selectedCamera} onValueChange={handleCameraChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select camera" />
                    </SelectTrigger>
                    <SelectContent>
                      {cameras.map((camera) => (
                        <SelectItem key={camera.id} value={camera.id}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(camera.status)}
                            {camera.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Microphone Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Microphone</label>
                  <Select value={selectedMicrophone} onValueChange={handleMicrophoneChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select microphone" />
                    </SelectTrigger>
                    <SelectContent>
                      {microphones.map((mic) => (
                        <SelectItem key={mic.id} value={mic.id}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(mic.status)}
                            {mic.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Output Selection */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Audio Output</label>
                  <Select value={selectedOutput} onValueChange={setSelectedOutput}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select output" />
                    </SelectTrigger>
                    <SelectContent>
                      {outputs.map((output) => (
                        <SelectItem key={output.id} value={output.id}>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(output.status)}
                            {output.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="quality" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Minimum Requirements */}
                <div className="space-y-3">
                  <h4 className="font-medium text-green-600">Minimum</h4>
                  <div className="text-sm space-y-1">
                    <div>Resolution: {STREAM_QUALITY_REQUIREMENTS.minimum.camera.resolution}</div>
                    <div>Frame Rate: {STREAM_QUALITY_REQUIREMENTS.minimum.camera.frameRate} fps</div>
                    <div>Bandwidth: {STREAM_QUALITY_REQUIREMENTS.minimum.connection.bandwidth / 1000} Mbps</div>
                  </div>
                </div>

                {/* Recommended Requirements */}
                <div className="space-y-3">
                  <h4 className="font-medium text-blue-600">Recommended</h4>
                  <div className="text-sm space-y-1">
                    <div>Resolution: {STREAM_QUALITY_REQUIREMENTS.recommended.camera.resolution}</div>
                    <div>Frame Rate: {STREAM_QUALITY_REQUIREMENTS.recommended.camera.frameRate} fps</div>
                    <div>Bandwidth: {STREAM_QUALITY_REQUIREMENTS.recommended.connection.bandwidth / 1000} Mbps</div>
                  </div>
                </div>

                {/* Optimal Requirements */}
                <div className="space-y-3">
                  <h4 className="font-medium text-purple-600">Optimal</h4>
                  <div className="text-sm space-y-1">
                    <div>Resolution: {STREAM_QUALITY_REQUIREMENTS.optimal.camera.resolution}</div>
                    <div>Frame Rate: {STREAM_QUALITY_REQUIREMENTS.optimal.camera.frameRate} fps</div>
                    <div>Bandwidth: {STREAM_QUALITY_REQUIREMENTS.optimal.connection.bandwidth / 1000} Mbps</div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4 mt-4">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Advanced streaming options will be available when you start streaming.
                This includes encoder settings, bitrate control, and advanced audio processing.
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}