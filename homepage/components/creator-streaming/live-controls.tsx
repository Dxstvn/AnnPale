'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Play,
  Pause,
  Square,
  Video,
  VideoOff,
  Mic,
  MicOff,
  MonitorSpeaker,
  MonitorX,
  Settings,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Circle,
  Users,
  Eye,
  Camera,
  Layers,
  Filter,
  Zap,
  AlertTriangle,
  CheckCircle,
  Activity,
  BarChart3,
  Monitor,
  Smartphone,
  Layout,
  PanelLeftOpen,
  PanelLeftClose
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  StreamingControls,
  StreamStatus,
  LiveMetrics,
  BACKGROUND_EFFECTS,
  STREAM_OVERLAYS
} from '@/lib/types/creator-streaming';

interface LiveControlsProps {
  status: StreamStatus;
  controls: StreamingControls;
  metrics: LiveMetrics;
  onControlsChange: (controls: Partial<StreamingControls>) => void;
  onStartStream: () => void;
  onPauseStream: () => void;
  onStopStream: () => void;
  onGoLive: () => void;
  className?: string;
}

export function LiveControls({
  status,
  controls,
  metrics,
  onControlsChange,
  onStartStream,
  onPauseStream,
  onStopStream,
  onGoLive,
  className
}: LiveControlsProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<string>('');
  const [backgroundBlur, setBackgroundBlur] = useState(controls.backgroundBlur);
  const [streamDuration, setStreamDuration] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout>();

  // Update stream duration
  useEffect(() => {
    if (controls.isLive) {
      intervalRef.current = setInterval(() => {
        setStreamDuration(prev => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (status === 'setup' || status === 'preview') {
        setStreamDuration(0);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [controls.isLive, status]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status: StreamStatus) => {
    switch (status) {
      case 'live': return 'bg-red-500';
      case 'paused': return 'bg-yellow-500';
      case 'preview': return 'bg-blue-500';
      case 'countdown': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status: StreamStatus) => {
    switch (status) {
      case 'live': return 'LIVE';
      case 'paused': return 'PAUSED';
      case 'preview': return 'PREVIEW';
      case 'countdown': return 'COUNTDOWN';
      case 'setup': return 'SETUP';
      case 'ended': return 'ENDED';
      default: return status.toUpperCase();
    }
  };

  const handleControlChange = (field: keyof StreamingControls, value: any) => {
    onControlsChange({ [field]: value });
  };

  const handleFilterChange = (filterId: string, enabled: boolean, intensity: number = 50) => {
    const updatedFilters = controls.filters.map(filter => 
      filter.id === filterId 
        ? { ...filter, enabled, intensity }
        : filter
    );

    if (!updatedFilters.find(f => f.id === filterId) && enabled) {
      updatedFilters.push({
        id: filterId,
        name: filterId.charAt(0).toUpperCase() + filterId.slice(1),
        enabled,
        intensity
      });
    }

    handleControlChange('filters', updatedFilters);
  };

  const handleOverlayToggle = (overlayId: string) => {
    const updatedOverlays = controls.overlays.map(overlay =>
      overlay.id === overlayId
        ? { ...overlay, visible: !overlay.visible }
        : overlay
    );

    handleControlChange('overlays', updatedOverlays);
  };

  const getMainActionButton = () => {
    switch (status) {
      case 'setup':
      case 'preview':
        return (
          <Button
            onClick={onGoLive}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg font-semibold"
            size="lg"
          >
            <Play className="w-6 h-6 mr-3" />
            Go Live
          </Button>
        );
      case 'live':
        return (
          <Button
            onClick={onPauseStream}
            variant="outline"
            className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 px-8 py-6 text-lg font-semibold"
            size="lg"
          >
            <Pause className="w-6 h-6 mr-3" />
            Pause Stream
          </Button>
        );
      case 'paused':
        return (
          <Button
            onClick={onStartStream}
            className="bg-red-500 hover:bg-red-600 text-white px-8 py-6 text-lg font-semibold"
            size="lg"
          >
            <Play className="w-6 h-6 mr-3" />
            Resume Stream
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Status Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-3 h-3 rounded-full animate-pulse',
                  getStatusColor(status)
                )} />
                <Badge className={cn(getStatusColor(status), 'text-white')}>
                  {getStatusText(status)}
                </Badge>
              </div>

              {controls.isLive && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{metrics.currentViewers}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="w-4 h-4 text-green-500" />
                    <span>{formatDuration(streamDuration)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <BarChart3 className="w-4 h-4 text-purple-500" />
                    <span>{metrics.engagementRate.toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <PanelLeftClose className="w-4 h-4" />
                ) : (
                  <PanelLeftOpen className="w-4 h-4" />
                )}
              </Button>

              {getMainActionButton()}

              {(status === 'live' || status === 'paused') && (
                <Button
                  onClick={onStopStream}
                  variant="destructive"
                  className="px-6"
                >
                  <Square className="w-4 h-4 mr-2" />
                  End Stream
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Expanded Controls */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-4"
          >
            {/* Media Controls */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Media Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Camera Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    <span className="text-sm font-medium">Camera</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select 
                      value={controls.selectedCamera} 
                      onValueChange={(value) => handleControlChange('selectedCamera', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="camera1">Camera 1</SelectItem>
                        <SelectItem value="camera2">Camera 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant={controls.selectedCamera ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleControlChange('selectedCamera', controls.selectedCamera ? '' : 'camera1')}
                    >
                      {controls.selectedCamera ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Microphone Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    <span className="text-sm font-medium">Microphone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select 
                      value={controls.selectedMicrophone} 
                      onValueChange={(value) => handleControlChange('selectedMicrophone', value)}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mic1">Microphone 1</SelectItem>
                        <SelectItem value="mic2">Microphone 2</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant={controls.selectedMicrophone ? "secondary" : "outline"}
                      size="sm"
                      onClick={() => handleControlChange('selectedMicrophone', controls.selectedMicrophone ? '' : 'mic1')}
                    >
                      {controls.selectedMicrophone ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Screen Share */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="w-4 h-4" />
                    <span className="text-sm font-medium">Screen Share</span>
                  </div>
                  <Button
                    variant={controls.isScreenSharing ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => handleControlChange('isScreenSharing', !controls.isScreenSharing)}
                  >
                    {controls.isScreenSharing ? <MonitorSpeaker className="w-4 h-4" /> : <MonitorX className="w-4 h-4" />}
                  </Button>
                </div>

                {/* Recording */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Circle className="w-4 h-4" />
                    <span className="text-sm font-medium">Recording</span>
                  </div>
                  <Button
                    variant={controls.isRecording ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => handleControlChange('isRecording', !controls.isRecording)}
                  >
                    {controls.isRecording ? (
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-xs">REC</span>
                      </div>
                    ) : (
                      <Circle className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Effects & Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Effects & Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Background Effects */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Background</Label>
                    <Switch
                      checked={controls.hasBackgroundEffects}
                      onCheckedChange={(checked) => handleControlChange('hasBackgroundEffects', checked)}
                    />
                  </div>
                  
                  {controls.hasBackgroundEffects && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="text-xs">Blur Intensity</Label>
                        <Slider
                          value={[backgroundBlur]}
                          onValueChange={([value]) => {
                            setBackgroundBlur(value);
                            handleControlChange('backgroundBlur', value);
                          }}
                          max={100}
                          step={1}
                          className="w-full"
                        />
                        <div className="text-xs text-gray-500 text-right">{backgroundBlur}%</div>
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                {/* Filters */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Filters</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {['Brightness', 'Contrast', 'Saturation', 'Warmth'].map((filter) => (
                      <Button
                        key={filter}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const filterEnabled = controls.filters.find(f => f.name === filter)?.enabled || false;
                          handleFilterChange(filter.toLowerCase(), !filterEnabled);
                        }}
                        className={cn(
                          controls.filters.find(f => f.name === filter)?.enabled && 
                          'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                        )}
                      >
                        <Filter className="w-3 h-3 mr-1" />
                        {filter}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Stream Overlays */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Stream Overlays</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {STREAM_OVERLAYS.map((overlay) => (
                    <div key={overlay.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Layers className="w-4 h-4" />
                        <span className="text-sm">{overlay.name}</span>
                      </div>
                      <Switch
                        checked={controls.overlays.find(o => o.id === overlay.id)?.visible || false}
                        onCheckedChange={() => handleOverlayToggle(overlay.id)}
                      />
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Quick Stats */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Quick Stats</Label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex justify-between">
                      <span>Peak Viewers:</span>
                      <span className="font-medium">{metrics.peakViewers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New Followers:</span>
                      <span className="font-medium">{metrics.newFollowers}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Chat Messages:</span>
                      <span className="font-medium">{metrics.chatMessages}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Earnings:</span>
                      <span className="font-medium">${metrics.earnings.total}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection Health */}
      {status === 'live' && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Wifi className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium">Connection: Stable</span>
                </div>
                <div className="text-xs text-gray-500">
                  Bitrate: 2.5 Mbps • Latency: 2.3s • 0 Dropped Frames
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-green-600">Optimal</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}