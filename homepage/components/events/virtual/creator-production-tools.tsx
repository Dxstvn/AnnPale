'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  Camera,
  Volume2,
  Settings,
  Users,
  UserX,
  MessageSquareOff,
  Shield,
  Radio,
  Pause,
  Play,
  StopCircle,
  AlertTriangle,
  Eye,
  Sparkles,
  Layout,
  Share2,
  FileText,
  Presentation
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreamSettings {
  videoEnabled: boolean;
  audioEnabled: boolean;
  screenSharing: boolean;
  camera: string;
  microphone: string;
  resolution: '720p' | '1080p' | '4K';
  bitrate: number;
  fps: 30 | 60;
}

interface ModerationAction {
  id: string;
  type: 'mute' | 'remove' | 'warn' | 'block_chat';
  targetUser: string;
  timestamp: Date;
  reason?: string;
}

interface CreatorProductionToolsProps {
  eventId: string;
  isLive: boolean;
  viewerCount: number;
  streamHealth: 'excellent' | 'good' | 'poor';
  streamSettings: StreamSettings;
  onToggleStream?: () => void;
  onToggleVideo?: () => void;
  onToggleAudio?: () => void;
  onToggleScreenShare?: () => void;
  onChangeCamera?: (camera: string) => void;
  onChangeMicrophone?: (mic: string) => void;
  onChangeSettings?: (settings: Partial<StreamSettings>) => void;
  onModerateUser?: (userId: string, action: string) => void;
  onSpotlightUser?: (userId: string) => void;
  onStartRecording?: () => void;
  onStopRecording?: () => void;
  isRecording?: boolean;
}

export function CreatorProductionTools({
  eventId,
  isLive,
  viewerCount,
  streamHealth,
  streamSettings,
  onToggleStream,
  onToggleVideo,
  onToggleAudio,
  onToggleScreenShare,
  onChangeCamera,
  onChangeMicrophone,
  onChangeSettings,
  onModerateUser,
  onSpotlightUser,
  onStartRecording,
  onStopRecording,
  isRecording = false
}: CreatorProductionToolsProps) {
  const [audioLevel, setAudioLevel] = React.useState(75);
  const [moderationMode, setModerationMode] = React.useState(false);
  const [selectedLayout, setSelectedLayout] = React.useState<'solo' | 'sidebyside' | 'pip' | 'grid'>('solo');

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'text-green-500';
      case 'good':
        return 'text-yellow-500';
      case 'poor':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'excellent':
        return '●●●';
      case 'good':
        return '●●○';
      case 'poor':
        return '●○○';
      default:
        return '○○○';
    }
  };

  const layouts = [
    { id: 'solo', name: 'Solo', icon: Monitor },
    { id: 'sidebyside', name: 'Side by Side', icon: Layout },
    { id: 'pip', name: 'Picture in Picture', icon: Video },
    { id: 'grid', name: 'Grid', icon: Layout }
  ];

  return (
    <div className="space-y-4">
      {/* Stream Status Bar */}
      <Card className={cn(
        "border-2",
        isLive ? "border-red-500 bg-red-50" : "border-gray-300"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {isLive ? (
                <Badge className="bg-red-600 text-white animate-pulse">
                  <Radio className="h-3 w-3 mr-1" />
                  LIVE
                </Badge>
              ) : (
                <Badge variant="secondary">
                  <Pause className="h-3 w-3 mr-1" />
                  Not Live
                </Badge>
              )}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="font-semibold">{viewerCount.toLocaleString()}</span>
                <span className="text-sm text-gray-600">viewers</span>
              </div>
              <div className={cn("flex items-center gap-1", getHealthColor(streamHealth))}>
                <span className="text-sm font-medium">Stream Health:</span>
                <span>{getHealthIcon(streamHealth)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isRecording && (
                <Badge variant="destructive" className="animate-pulse">
                  <div className="h-2 w-2 bg-white rounded-full mr-2" />
                  Recording
                </Badge>
              )}
              <Button
                variant={isLive ? "destructive" : "default"}
                onClick={onToggleStream}
              >
                {isLive ? (
                  <>
                    <StopCircle className="h-4 w-4 mr-2" />
                    End Stream
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    Go Live
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Stream Controls */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Stream Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Video/Audio Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant={streamSettings.videoEnabled ? "default" : "destructive"}
                onClick={onToggleVideo}
              >
                {streamSettings.videoEnabled ? (
                  <Video className="h-4 w-4" />
                ) : (
                  <VideoOff className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant={streamSettings.audioEnabled ? "default" : "destructive"}
                onClick={onToggleAudio}
              >
                {streamSettings.audioEnabled ? (
                  <Mic className="h-4 w-4" />
                ) : (
                  <MicOff className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant={streamSettings.screenSharing ? "default" : "outline"}
                onClick={onToggleScreenShare}
              >
                <Monitor className="h-4 w-4 mr-2" />
                {streamSettings.screenSharing ? 'Stop Sharing' : 'Share Screen'}
              </Button>
              <Button variant="outline">
                <Presentation className="h-4 w-4 mr-2" />
                Slides
              </Button>
            </div>

            {/* Audio Level */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm">Audio Level</Label>
                <span className="text-sm text-gray-600">{audioLevel}%</span>
              </div>
              <div className="flex items-center gap-3">
                <Volume2 className="h-4 w-4 text-gray-600" />
                <Slider
                  value={[audioLevel]}
                  onValueChange={(value) => setAudioLevel(value[0])}
                  max={100}
                  step={1}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Layout Selection */}
            <div>
              <Label className="text-sm mb-2 block">Stream Layout</Label>
              <div className="grid grid-cols-4 gap-2">
                {layouts.map((layout) => {
                  const Icon = layout.icon;
                  return (
                    <Button
                      key={layout.id}
                      variant={selectedLayout === layout.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedLayout(layout.id as any)}
                      className="flex-col h-auto py-2"
                    >
                      <Icon className="h-5 w-5 mb-1" />
                      <span className="text-xs">{layout.name}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Recording Controls */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "h-3 w-3 rounded-full",
                  isRecording ? "bg-red-500 animate-pulse" : "bg-gray-300"
                )} />
                <div>
                  <p className="text-sm font-medium">Recording</p>
                  <p className="text-xs text-gray-600">
                    {isRecording ? 'Recording in progress...' : 'Not recording'}
                  </p>
                </div>
              </div>
              <Button
                variant={isRecording ? "destructive" : "outline"}
                size="sm"
                onClick={isRecording ? onStopRecording : onStartRecording}
              >
                {isRecording ? 'Stop' : 'Start'} Recording
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Moderation Tools */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Moderation</CardTitle>
              <Switch
                checked={moderationMode}
                onCheckedChange={setModerationMode}
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {moderationMode ? (
              <>
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-sm">
                    Moderation mode active. Click on users to moderate.
                  </AlertDescription>
                </Alert>
                
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <UserX className="h-4 w-4 mr-2" />
                    Remove Participant
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MicOff className="h-4 w-4 mr-2" />
                    Mute Participant
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageSquareOff className="h-4 w-4 mr-2" />
                    Disable Chat
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Block User
                  </Button>
                </div>

                <div className="pt-3 border-t">
                  <p className="text-xs text-gray-600 mb-2">Recent Actions</p>
                  <div className="space-y-1">
                    <div className="text-xs">
                      <span className="font-medium">Muted:</span> User123
                    </div>
                    <div className="text-xs">
                      <span className="font-medium">Removed:</span> Spammer99
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <Shield className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">
                  Enable moderation mode to access tools
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Advanced Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs">Resolution</Label>
              <select
                value={streamSettings.resolution}
                onChange={(e) => onChangeSettings?.({ resolution: e.target.value as any })}
                className="w-full text-sm px-2 py-1 rounded border mt-1"
              >
                <option value="720p">720p</option>
                <option value="1080p">1080p</option>
                <option value="4K">4K</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Frame Rate</Label>
              <select
                value={streamSettings.fps}
                onChange={(e) => onChangeSettings?.({ fps: parseInt(e.target.value) as any })}
                className="w-full text-sm px-2 py-1 rounded border mt-1"
              >
                <option value="30">30 fps</option>
                <option value="60">60 fps</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Bitrate</Label>
              <div className="flex items-center gap-2 mt-1">
                <Input
                  type="number"
                  value={streamSettings.bitrate}
                  onChange={(e) => onChangeSettings?.({ bitrate: parseInt(e.target.value) })}
                  className="text-sm h-8"
                />
                <span className="text-xs">kbps</span>
              </div>
            </div>
            <div>
              <Label className="text-xs">Stream Key</Label>
              <Button variant="outline" size="sm" className="w-full mt-1">
                <Eye className="h-3 w-3 mr-1" />
                Show
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stream Health Warning */}
      {streamHealth === 'poor' && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <p className="font-medium text-red-900">Poor Stream Quality Detected</p>
            <p className="text-sm text-red-700 mt-1">
              Consider lowering your resolution or bitrate to improve stability.
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}

// Add missing Label import
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';