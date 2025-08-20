'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import {
  Battery,
  Wifi,
  WifiOff,
  Signal,
  Smartphone,
  Download,
  Calendar,
  Bell,
  BellOff,
  MapPin,
  Camera,
  CameraOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Rotate3D,
  RotateCcw,
  Maximize,
  Minimize,
  PictureInPicture,
  Headphones,
  Save,
  Share2,
  Settings,
  Zap,
  Shield,
  Eye,
  EyeOff,
  Gauge,
  Monitor,
  Database,
  CloudDownload,
  Airplane,
  Coffee,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DeviceInfo {
  battery: number;
  isCharging: boolean;
  connectionType: 'wifi' | '4g' | '5g' | 'offline';
  connectionStrength: number;
  deviceType: 'mobile' | 'tablet';
  orientation: 'portrait' | 'landscape';
  isLowPowerMode: boolean;
  availableStorage: number;
  totalStorage: number;
}

interface MobileOptimizationsProps {
  eventId?: string;
  onOptimizationChange?: (optimization: string, enabled: boolean) => void;
  onQualityChange?: (quality: string) => void;
  onNotificationSchedule?: (settings: any) => void;
}

export function MobileOptimizations({
  eventId = 'event-1',
  onOptimizationChange,
  onQualityChange,
  onNotificationSchedule
}: MobileOptimizationsProps) {
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>({
    battery: 67,
    isCharging: false,
    connectionType: 'wifi',
    connectionStrength: 3,
    deviceType: 'mobile',
    orientation: 'portrait',
    isLowPowerMode: false,
    availableStorage: 2.1,
    totalStorage: 32
  });

  // Optimization settings
  const [optimizations, setOptimizations] = React.useState({
    batteryOptimized: false,
    dataOptimized: true,
    autoRotate: true,
    pictureInPicture: true,
    backgroundAudio: true,
    offlineMode: false,
    adaptiveQuality: true,
    reducedMotion: false,
    darkMode: false,
    autoDownload: false,
    notifications: true,
    vibration: true,
    keepScreenOn: true,
    virtualBackground: false,
    noiseReduction: true
  });

  // Quality settings
  const [qualitySettings, setQualitySettings] = React.useState({
    video: 'auto',
    audio: 'high',
    bandwidth: 'adaptive'
  });

  // Notification settings
  const [notificationSettings, setNotificationSettings] = React.useState({
    eventStart: true,
    eventReminder: true,
    chatMessages: false,
    networkingRequests: true,
    calendarSync: true,
    locationReminders: false
  });

  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const qualityOptions = [
    { value: 'auto', label: 'Auto (Recommended)', description: 'Adjusts based on connection' },
    { value: '1080p', label: '1080p', description: 'High quality, more data' },
    { value: '720p', label: '720p', description: 'Good quality, moderate data' },
    { value: '480p', label: '480p', description: 'Standard quality, less data' },
    { value: '360p', label: '360p', description: 'Low quality, minimal data' }
  ];

  const handleOptimizationToggle = (key: string, value: boolean) => {
    setOptimizations(prev => ({ ...prev, [key]: value }));
    onOptimizationChange?.(key, value);

    // Apply specific optimizations
    if (key === 'batteryOptimized' && value) {
      setOptimizations(prev => ({
        ...prev,
        reducedMotion: true,
        virtualBackground: false,
        adaptiveQuality: true
      }));
    }

    if (key === 'dataOptimized' && value) {
      setQualitySettings(prev => ({ ...prev, video: '480p' }));
      onQualityChange?.('480p');
    }
  };

  const getConnectionIcon = () => {
    switch (deviceInfo.connectionType) {
      case 'wifi': return <Wifi className="h-4 w-4 text-green-500" />;
      case '5g': return <Signal className="h-4 w-4 text-blue-500" />;
      case '4g': return <Signal className="h-4 w-4 text-yellow-500" />;
      case 'offline': return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  const getBatteryColor = (level: number) => {
    if (level > 50) return 'text-green-500';
    if (level > 20) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStorageColor = (used: number, total: number) => {
    const percentage = ((total - used) / total) * 100;
    if (percentage > 30) return 'text-green-500';
    if (percentage > 10) return 'text-yellow-500';
    return 'text-red-500';
  };

  const handleCalendarIntegration = () => {
    // Mock calendar integration
    const eventDetails = {
      title: 'Haitian Music Masterclass',
      start: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      duration: 90,
      location: 'Virtual Event'
    };
    
    // In real implementation, would use device calendar API
    console.log('Adding to calendar:', eventDetails);
  };

  const handleOfflineDownload = () => {
    // Mock offline content download
    setOptimizations(prev => ({ ...prev, offlineMode: true }));
  };

  const recommendedOptimizations = React.useMemo(() => {
    const recommendations = [];

    if (deviceInfo.battery < 30) {
      recommendations.push({
        type: 'battery',
        title: 'Enable Battery Optimization',
        description: 'Reduce video quality and disable animations to save battery',
        action: () => handleOptimizationToggle('batteryOptimized', true)
      });
    }

    if (deviceInfo.connectionStrength < 2) {
      recommendations.push({
        type: 'connection',
        title: 'Switch to Audio-Only Mode',
        description: 'Poor connection detected. Audio-only mode recommended',
        action: () => setQualitySettings(prev => ({ ...prev, video: 'audio-only' }))
      });
    }

    if (deviceInfo.availableStorage < 1) {
      recommendations.push({
        type: 'storage',
        title: 'Clear Cache',
        description: 'Low storage detected. Clear app cache to free up space',
        action: () => console.log('Clearing cache')
      });
    }

    return recommendations;
  }, [deviceInfo]);

  return (
    <div className="space-y-6">
      {/* Device Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Device Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Battery</span>
                <div className="flex items-center gap-1">
                  <Battery className={cn("h-4 w-4", getBatteryColor(deviceInfo.battery))} />
                  <span className="text-sm font-medium">{deviceInfo.battery}%</span>
                </div>
              </div>
              <Progress value={deviceInfo.battery} className="h-2" />
              {deviceInfo.isCharging && (
                <p className="text-xs text-green-600">⚡ Charging</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Connection</span>
                <div className="flex items-center gap-1">
                  {getConnectionIcon()}
                  <span className="text-sm font-medium capitalize">{deviceInfo.connectionType}</span>
                </div>
              </div>
              <Progress value={(deviceInfo.connectionStrength / 4) * 100} className="h-2" />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Storage</span>
              <span className={cn("text-sm font-medium", getStorageColor(deviceInfo.availableStorage, deviceInfo.totalStorage))}>
                {deviceInfo.availableStorage}GB free of {deviceInfo.totalStorage}GB
              </span>
            </div>
            <Progress 
              value={((deviceInfo.totalStorage - deviceInfo.availableStorage) / deviceInfo.totalStorage) * 100} 
              className="h-2" 
            />
          </div>
        </CardContent>
      </Card>

      {/* Smart Recommendations */}
      {recommendedOptimizations.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Smart Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendedOptimizations.map((rec, index) => (
              <Alert key={index}>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{rec.title}</p>
                    <p className="text-xs text-gray-600">{rec.description}</p>
                  </div>
                  <Button size="sm" onClick={rec.action}>
                    Apply
                  </Button>
                </AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Performance Optimizations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Performance Optimizations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Battery Optimization</p>
                <p className="text-xs text-gray-600">Reduce video quality and disable animations</p>
              </div>
              <Switch
                checked={optimizations.batteryOptimized}
                onCheckedChange={(value) => handleOptimizationToggle('batteryOptimized', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Data Optimization</p>
                <p className="text-xs text-gray-600">Reduce bandwidth usage for mobile data</p>
              </div>
              <Switch
                checked={optimizations.dataOptimized}
                onCheckedChange={(value) => handleOptimizationToggle('dataOptimized', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Adaptive Quality</p>
                <p className="text-xs text-gray-600">Automatically adjust based on connection</p>
              </div>
              <Switch
                checked={optimizations.adaptiveQuality}
                onCheckedChange={(value) => handleOptimizationToggle('adaptiveQuality', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Keep Screen On</p>
                <p className="text-xs text-gray-600">Prevent screen from turning off during events</p>
              </div>
              <Switch
                checked={optimizations.keepScreenOn}
                onCheckedChange={(value) => handleOptimizationToggle('keepScreenOn', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Video Quality */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Video Quality</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {qualityOptions.map((option) => (
            <div
              key={option.value}
              className={cn(
                "p-3 border rounded-lg cursor-pointer transition-colors",
                qualitySettings.video === option.value
                  ? "border-purple-600 bg-purple-50"
                  : "hover:bg-gray-50"
              )}
              onClick={() => {
                setQualitySettings(prev => ({ ...prev, video: option.value }));
                onQualityChange?.(option.value);
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-sm">{option.label}</p>
                  <p className="text-xs text-gray-600">{option.description}</p>
                </div>
                {qualitySettings.video === option.value && (
                  <CheckCircle className="h-4 w-4 text-purple-600" />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Mobile Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Mobile Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Auto-Rotate Support</p>
                <p className="text-xs text-gray-600">Automatically adjust to device orientation</p>
              </div>
              <Switch
                checked={optimizations.autoRotate}
                onCheckedChange={(value) => handleOptimizationToggle('autoRotate', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Picture-in-Picture</p>
                <p className="text-xs text-gray-600">Continue watching while using other apps</p>
              </div>
              <Switch
                checked={optimizations.pictureInPicture}
                onCheckedChange={(value) => handleOptimizationToggle('pictureInPicture', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Background Audio</p>
                <p className="text-xs text-gray-600">Keep audio playing when screen is off</p>
              </div>
              <Switch
                checked={optimizations.backgroundAudio}
                onCheckedChange={(value) => handleOptimizationToggle('backgroundAudio', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Virtual Backgrounds</p>
                <p className="text-xs text-gray-600">Use AI-powered background replacement</p>
              </div>
              <Switch
                checked={optimizations.virtualBackground}
                onCheckedChange={(value) => handleOptimizationToggle('virtualBackground', value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offline & Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Offline & Calendar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleCalendarIntegration}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Add Event to Calendar
            </Button>

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleOfflineDownload}
              disabled={deviceInfo.availableStorage < 0.5}
            >
              <Download className="h-4 w-4 mr-2" />
              Download for Offline Access
              {deviceInfo.availableStorage < 0.5 && (
                <Badge variant="destructive" className="ml-2 text-xs">
                  Low Storage
                </Badge>
              )}
            </Button>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Location Reminders</p>
                <p className="text-xs text-gray-600">Get notified when you arrive at event location</p>
              </div>
              <Switch
                checked={notificationSettings.locationReminders}
                onCheckedChange={(value) => 
                  setNotificationSettings(prev => ({ ...prev, locationReminders: value }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {Object.entries(notificationSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="text-xs text-gray-600">
                    {key === 'eventStart' && 'Notify when event begins'}
                    {key === 'eventReminder' && 'Remind 15 minutes before event'}
                    {key === 'chatMessages' && 'New messages in event chat'}
                    {key === 'networkingRequests' && 'New connection requests'}
                    {key === 'calendarSync' && 'Sync with device calendar'}
                    {key === 'locationReminders' && 'Location-based notifications'}
                  </p>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(newValue) => 
                    setNotificationSettings(prev => ({ ...prev, [key]: newValue }))
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Advanced Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Advanced Settings</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              {showAdvanced ? 'Hide' : 'Show'}
            </Button>
          </div>
        </CardHeader>
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Reduced Motion</p>
                      <p className="text-xs text-gray-600">Minimize animations for better performance</p>
                    </div>
                    <Switch
                      checked={optimizations.reducedMotion}
                      onCheckedChange={(value) => handleOptimizationToggle('reducedMotion', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Dark Mode</p>
                      <p className="text-xs text-gray-600">Use dark theme to reduce eye strain</p>
                    </div>
                    <Switch
                      checked={optimizations.darkMode}
                      onCheckedChange={(value) => handleOptimizationToggle('darkMode', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Noise Reduction</p>
                      <p className="text-xs text-gray-600">Use AI to reduce background noise</p>
                    </div>
                    <Switch
                      checked={optimizations.noiseReduction}
                      onCheckedChange={(value) => handleOptimizationToggle('noiseReduction', value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">Vibration Feedback</p>
                      <p className="text-xs text-gray-600">Haptic feedback for interactions</p>
                    </div>
                    <Switch
                      checked={optimizations.vibration}
                      onCheckedChange={(value) => handleOptimizationToggle('vibration', value)}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Reset to Defaults
                  </Button>
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>

      {/* Optimization Summary */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Optimization Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-green-600">
                {Object.values(optimizations).filter(Boolean).length}
              </p>
              <p className="text-xs text-gray-600">Active Optimizations</p>
            </div>
            <div>
              <p className="text-lg font-bold text-blue-600">
                {qualitySettings.video === 'auto' ? 'Auto' : qualitySettings.video}
              </p>
              <p className="text-xs text-gray-600">Video Quality</p>
            </div>
            <div>
              <p className="text-lg font-bold text-purple-600">
                {optimizations.batteryOptimized ? 'Optimized' : 'Standard'}
              </p>
              <p className="text-xs text-gray-600">Battery Mode</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}