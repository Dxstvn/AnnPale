'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMediaQuery } from '@/hooks/use-media-query';
import { StreamPreview } from '@/components/creator-streaming/stream-preview';
import { StreamSetupPanel } from '@/components/creator-streaming/stream-setup-panel';
import { LiveControls } from '@/components/creator-streaming/live-controls';
import { MetricsModeration } from '@/components/creator-streaming/metrics-moderation';
import { MonetizationInteraction } from '@/components/creator-streaming/monetization-interaction';
import {
  CreatorStreamState,
  MediaDevice,
  StreamStatus,
  StreamSetup,
  StreamingControls,
  MonetizationSettings,
  ModerationTools,
  LiveMetrics,
  StreamGoal,
  ModerationAction,
  DEFAULT_STREAM_SETUP,
  DEFAULT_MONETIZATION_SETTINGS,
  DEFAULT_STREAMING_CONTROLS,
  DEFAULT_MODERATION_TOOLS
} from '@/lib/types/creator-streaming';
import { ChatMessage } from '@/lib/types/live-viewer';
import {
  Play,
  Settings,
  Users,
  BarChart3,
  DollarSign,
  Shield,
  ArrowLeft,
  Wifi,
  WifiOff,
  AlertTriangle,
  CheckCircle,
  Bell,
  Share2,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CreatorStreamingDashboard() {
  const router = useRouter();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [activeTab, setActiveTab] = useState('preview');
  const [isLoading, setIsLoading] = useState(true);

  // Stream state
  const [streamState, setStreamState] = useState<CreatorStreamState>({
    status: 'setup',
    setup: DEFAULT_STREAM_SETUP,
    health: {
      camera: { status: 'good', resolution: '1080p', frameRate: 30, quality: 85 },
      microphone: { status: 'good', level: 75, quality: 90 },
      connection: { status: 'good', bandwidth: 5000, latency: 2000, stability: 92 },
      overall: 'good'
    },
    controls: DEFAULT_STREAMING_CONTROLS,
    metrics: {
      currentViewers: 0,
      peakViewers: 0,
      totalViewers: 0,
      averageWatchTime: 0,
      streamDuration: 0,
      chatMessages: 0,
      reactionsCount: 0,
      newFollowers: 0,
      earnings: { tips: 0, gifts: 0, subscriptions: 0, total: 0 },
      engagementRate: 0,
      retentionRate: 0
    },
    moderation: DEFAULT_MODERATION_TOOLS,
    monetization: DEFAULT_MONETIZATION_SETTINGS,
    goals: [],
    highlights: [],
    devices: [],
    chatMessages: [],
    moderationActions: [],
    streamKey: 'sk_test_abc123',
    streamUrl: 'rtmp://live.annpale.com/live'
  });

  // UI state
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSetupValid, setIsSetupValid] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState<Date | null>(null);

  // Initialize dashboard
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Simulate loading time
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Load devices
        await loadMediaDevices();
        
        // Load saved setup if exists
        loadSavedSetup();
        
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to initialize dashboard:', error);
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, []);

  // Load media devices
  const loadMediaDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const mediaDevices: MediaDevice[] = devices.map((device, index) => ({
        id: device.deviceId || `device-${index}`,
        label: device.label || `${device.kind} ${index + 1}`,
        kind: device.kind as MediaDevice['kind'],
        status: 'good',
        selected: index === 0
      }));

      setStreamState(prev => ({ ...prev, devices: mediaDevices }));
    } catch (error) {
      console.error('Failed to load media devices:', error);
    }
  };

  // Load saved setup
  const loadSavedSetup = () => {
    try {
      const savedSetup = localStorage.getItem('creator-stream-setup');
      if (savedSetup) {
        const setup = JSON.parse(savedSetup);
        setStreamState(prev => ({ ...prev, setup }));
      }
    } catch (error) {
      console.error('Failed to load saved setup:', error);
    }
  };

  // Save setup
  const saveSetup = useCallback(() => {
    try {
      localStorage.setItem('creator-stream-setup', JSON.stringify(streamState.setup));
      setHasUnsavedChanges(false);
      setLastSaveTime(new Date());
    } catch (error) {
      console.error('Failed to save setup:', error);
    }
  }, [streamState.setup]);

  // Validate setup
  useEffect(() => {
    const isValid = 
      streamState.setup.title.trim().length >= 3 &&
      streamState.setup.description.trim().length >= 10 &&
      streamState.setup.tags.length > 0 &&
      streamState.health.overall !== 'error';
    
    setIsSetupValid(isValid);
  }, [streamState.setup, streamState.health]);

  // Handle setup changes
  const handleSetupChange = useCallback((updates: Partial<StreamSetup>) => {
    setStreamState(prev => ({
      ...prev,
      setup: { ...prev.setup, ...updates }
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Handle controls changes
  const handleControlsChange = useCallback((updates: Partial<StreamingControls>) => {
    setStreamState(prev => ({
      ...prev,
      controls: { ...prev.controls, ...updates }
    }));
  }, []);

  // Handle monetization changes
  const handleMonetizationChange = useCallback((updates: Partial<MonetizationSettings>) => {
    setStreamState(prev => ({
      ...prev,
      monetization: { ...prev.monetization, ...updates }
    }));
    setHasUnsavedChanges(true);
  }, []);

  // Handle device changes
  const handleDeviceChange = useCallback((type: 'camera' | 'microphone', deviceId: string) => {
    setStreamState(prev => ({
      ...prev,
      devices: prev.devices.map(device => ({
        ...device,
        selected: device.kind.includes(type) ? device.id === deviceId : device.selected
      }))
    }));

    // Update controls
    if (type === 'camera') {
      handleControlsChange({ selectedCamera: deviceId });
    } else {
      handleControlsChange({ selectedMicrophone: deviceId });
    }
  }, [handleControlsChange]);

  // Stream actions
  const handleGoLive = async () => {
    if (!isSetupValid) return;
    
    setStreamState(prev => ({ 
      ...prev, 
      status: 'countdown',
      controls: { ...prev.controls, isLive: true },
      startTime: new Date()
    }));

    // Countdown simulation
    setTimeout(() => {
      setStreamState(prev => ({ ...prev, status: 'live' }));
      setActiveTab('controls');
    }, 3000);
  };

  const handlePauseStream = () => {
    setStreamState(prev => ({ 
      ...prev, 
      status: 'paused',
      controls: { ...prev.controls, isPaused: true }
    }));
  };

  const handleResumeStream = () => {
    setStreamState(prev => ({ 
      ...prev, 
      status: 'live',
      controls: { ...prev.controls, isPaused: false }
    }));
  };

  const handleStopStream = () => {
    setStreamState(prev => ({ 
      ...prev, 
      status: 'ended',
      controls: { ...prev.controls, isLive: false, isPaused: false },
      endTime: new Date()
    }));
    setActiveTab('analytics');
  };

  // Test connection
  const handleTestConnection = async () => {
    // Simulate connection test
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setStreamState(prev => ({
      ...prev,
      health: {
        ...prev.health,
        connection: { ...prev.health.connection, latency: 1800 }
      }
    }));
  };

  // Moderation actions
  const handleModerateUser = (userId: string, action: ModerationAction['type'], duration?: number) => {
    const moderationAction: ModerationAction = {
      id: Date.now().toString(),
      type: action,
      userId,
      reason: `${action} action via dashboard`,
      duration,
      timestamp: new Date(),
      moderatorId: 'creator-1'
    };

    setStreamState(prev => ({
      ...prev,
      moderationActions: [moderationAction, ...prev.moderationActions]
    }));
  };

  const handleModerateMessage = (messageId: string, action: 'delete' | 'pin' | 'highlight') => {
    setStreamState(prev => ({
      ...prev,
      chatMessages: prev.chatMessages.map(msg =>
        msg.id === messageId
          ? { ...msg, highlighted: action === 'highlight', pinned: action === 'pin' }
          : msg
      )
    }));
  };

  // Goal management
  const handleCreateGoal = (goal: Omit<StreamGoal, 'id' | 'current' | 'isCompleted'>) => {
    const newGoal: StreamGoal = {
      ...goal,
      id: Date.now().toString(),
      current: 0,
      isCompleted: false
    };

    setStreamState(prev => ({
      ...prev,
      goals: [...prev.goals, newGoal]
    }));
  };

  const handleUpdateGoal = (goalId: string, updates: Partial<StreamGoal>) => {
    setStreamState(prev => ({
      ...prev,
      goals: prev.goals.map(goal =>
        goal.id === goalId ? { ...goal, ...updates } : goal
      )
    }));
  };

  const handleDeleteGoal = (goalId: string) => {
    setStreamState(prev => ({
      ...prev,
      goals: prev.goals.filter(goal => goal.id !== goalId)
    }));
  };

  // Reset setup
  const handleResetSetup = () => {
    setStreamState(prev => ({ ...prev, setup: DEFAULT_STREAM_SETUP }));
    setHasUnsavedChanges(false);
  };

  // Get status color
  const getStatusColor = (status: StreamStatus) => {
    switch (status) {
      case 'live': return 'bg-red-500';
      case 'paused': return 'bg-yellow-500';
      case 'preview': return 'bg-blue-500';
      case 'countdown': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">Loading Creator Dashboard</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Setting up your streaming environment...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/creator')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Creator Hub
              </Button>

              <div className="h-6 w-px bg-gray-300" />

              <div>
                <h1 className="text-2xl font-bold">Streaming Dashboard</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Professional streaming tools for creators
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <div className={cn(
                  'w-3 h-3 rounded-full animate-pulse',
                  getStatusColor(streamState.status)
                )} />
                <Badge className={cn(
                  'text-white',
                  getStatusColor(streamState.status)
                )}>
                  {streamState.status.toUpperCase()}
                </Badge>
              </div>

              {/* Connection Status */}
              <div className="flex items-center gap-1 text-sm">
                {streamState.health.connection.status === 'good' ? (
                  <Wifi className="w-4 h-4 text-green-500" />
                ) : (
                  <WifiOff className="w-4 h-4 text-red-500" />
                )}
                <span className={cn(
                  streamState.health.connection.status === 'good' 
                    ? 'text-green-600' 
                    : 'text-red-600'
                )}>
                  {streamState.health.connection.status}
                </span>
              </div>

              {/* Live Metrics */}
              {streamState.status === 'live' && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">{streamState.metrics.currentViewers}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="w-4 h-4 text-green-500" />
                    <span className="font-medium">${streamState.metrics.earnings.total}</span>
                  </div>
                </div>
              )}

              {/* Save Status */}
              {hasUnsavedChanges && (
                <Badge variant="outline" className="border-orange-200 text-orange-700">
                  Unsaved Changes
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Play className="w-4 h-4" />
              {!isMobile && 'Preview'}
            </TabsTrigger>
            <TabsTrigger value="setup" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              {!isMobile && 'Setup'}
            </TabsTrigger>
            <TabsTrigger value="controls" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {!isMobile && 'Controls'}
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              {!isMobile && 'Analytics'}
            </TabsTrigger>
            <TabsTrigger value="monetization" className="flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              {!isMobile && 'Revenue'}
            </TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="preview">
              <StreamPreview
                devices={streamState.devices}
                streamHealth={streamState.health}
                onDeviceChange={handleDeviceChange}
                onTestConnection={handleTestConnection}
                onStartPreview={() => setStreamState(prev => ({ ...prev, status: 'preview' }))}
                onStopPreview={() => setStreamState(prev => ({ ...prev, status: 'setup' }))}
                isPreviewActive={streamState.status === 'preview'}
              />
            </TabsContent>

            <TabsContent value="setup">
              <StreamSetupPanel
                setup={streamState.setup}
                monetization={streamState.monetization}
                onSetupChange={handleSetupChange}
                onMonetizationChange={handleMonetizationChange}
                onSave={saveSetup}
                onReset={handleResetSetup}
                isValid={isSetupValid}
                hasUnsavedChanges={hasUnsavedChanges}
              />
            </TabsContent>

            <TabsContent value="controls">
              <LiveControls
                status={streamState.status}
                controls={streamState.controls}
                metrics={streamState.metrics}
                onControlsChange={handleControlsChange}
                onStartStream={handleResumeStream}
                onPauseStream={handlePauseStream}
                onStopStream={handleStopStream}
                onGoLive={handleGoLive}
              />
            </TabsContent>

            <TabsContent value="analytics">
              <MetricsModeration
                metrics={streamState.metrics}
                moderation={streamState.moderation}
                goals={streamState.goals}
                chatMessages={streamState.chatMessages}
                moderationActions={streamState.moderationActions}
                onModerateUser={handleModerateUser}
                onModerateMessage={handleModerateMessage}
                onUpdateModerationSettings={(settings) => 
                  setStreamState(prev => ({ 
                    ...prev, 
                    moderation: { ...prev.moderation, ...settings } 
                  }))
                }
                onUpdateGoal={(goalId, current) => handleUpdateGoal(goalId, { current })}
              />
            </TabsContent>

            <TabsContent value="monetization">
              <MonetizationInteraction
                monetization={streamState.monetization}
                goals={streamState.goals}
                metrics={streamState.metrics}
                onMonetizationChange={handleMonetizationChange}
                onCreateGoal={handleCreateGoal}
                onUpdateGoal={handleUpdateGoal}
                onDeleteGoal={handleDeleteGoal}
                isLive={streamState.status === 'live'}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Go Live FAB */}
      <AnimatePresence>
        {(streamState.status === 'setup' || streamState.status === 'preview') && isSetupValid && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <Button
              onClick={handleGoLive}
              size="lg"
              className="bg-red-500 hover:bg-red-600 text-white rounded-full px-8 py-6 text-lg font-semibold shadow-2xl"
            >
              <Play className="w-6 h-6 mr-3" />
              Go Live
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Setup Validation Alert */}
      <AnimatePresence>
        {!isSetupValid && activeTab === 'preview' && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-8 left-8 right-8 z-40"
          >
            <Card className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div className="flex-1">
                    <div className="font-medium text-yellow-800 dark:text-yellow-200">
                      Complete setup to go live
                    </div>
                    <div className="text-sm text-yellow-700 dark:text-yellow-300">
                      Please complete your stream setup before starting your broadcast
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('setup')}
                    className="border-yellow-500 text-yellow-700 hover:bg-yellow-100"
                  >
                    Complete Setup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}