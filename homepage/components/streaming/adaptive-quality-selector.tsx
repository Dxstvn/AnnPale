'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Zap,
  Wifi,
  WifiOff,
  TrendingUp,
  TrendingDown,
  Activity,
  Settings,
  Monitor,
  Smartphone,
  CheckCircle,
  AlertTriangle,
  Info,
  Play,
  Pause,
  RotateCcw,
  Signal,
  Gauge,
  Network,
  Eye,
  Clock,
  Cpu,
  MemoryStick
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Types for adaptive quality selection
export interface NetworkCondition {
  bandwidth: number; // Mbps
  latency: number; // ms
  packetLoss: number; // percentage
  jitter: number; // ms
  stability: 'excellent' | 'good' | 'fair' | 'poor';
  timestamp: Date;
}

export interface QualityAdaptation {
  enabled: boolean;
  strategy: 'conservative' | 'balanced' | 'aggressive';
  thresholds: {
    upgrade: number;
    downgrade: number;
    emergency: number;
  };
  bufferHealth: number; // seconds
  maxDrops: number;
}

export interface DeviceCapabilities {
  type: 'desktop' | 'tablet' | 'mobile';
  screen: {
    width: number;
    height: number;
    density: number;
  };
  hardware: {
    cpu: 'high' | 'medium' | 'low';
    memory: number; // GB
    gpu: boolean;
  };
  battery: {
    level: number;
    charging: boolean;
    saver: boolean;
  };
}

export interface AdaptiveQualitySelectorProps {
  currentQuality: string;
  networkCondition: NetworkCondition;
  deviceCapabilities: DeviceCapabilities;
  qualityAdaptation: QualityAdaptation;
  isStreaming?: boolean;
  onQualityChange?: (quality: string) => void;
  onAdaptationChange?: (adaptation: QualityAdaptation) => void;
  onNetworkTest?: () => void;
  className?: string;
}

// Mock data
const MOCK_NETWORK_CONDITION: NetworkCondition = {
  bandwidth: 8.5,
  latency: 45,
  packetLoss: 0.2,
  jitter: 2.1,
  stability: 'good',
  timestamp: new Date()
};

const MOCK_DEVICE_CAPABILITIES: DeviceCapabilities = {
  type: 'desktop',
  screen: {
    width: 1920,
    height: 1080,
    density: 1
  },
  hardware: {
    cpu: 'high',
    memory: 16,
    gpu: true
  },
  battery: {
    level: 85,
    charging: true,
    saver: false
  }
};

const MOCK_QUALITY_ADAPTATION: QualityAdaptation = {
  enabled: true,
  strategy: 'balanced',
  thresholds: {
    upgrade: 80,
    downgrade: 40,
    emergency: 20
  },
  bufferHealth: 3.5,
  maxDrops: 5
};

// Quality options based on capabilities
const QUALITY_OPTIONS = [
  { id: 'auto', name: 'Auto (Adaptive)', bandwidth: 0, resolution: 'Dynamic' },
  { id: 'ultra_hd', name: 'Ultra HD 4K', bandwidth: 15, resolution: '2160p' },
  { id: 'full_hd', name: 'Full HD', bandwidth: 5, resolution: '1080p' },
  { id: 'hd', name: 'HD', bandwidth: 2.5, resolution: '720p' },
  { id: 'sd', name: 'SD', bandwidth: 1, resolution: '480p' },
  { id: 'low', name: 'Low', bandwidth: 0.5, resolution: '360p' },
  { id: 'audio', name: 'Audio Only', bandwidth: 0.128, resolution: 'Audio' }
];

// Network status indicator
function NetworkStatusIndicator({ 
  condition, 
  onTest 
}: { 
  condition: NetworkCondition;
  onTest?: () => void;
}) {
  const getStatusColor = (stability: string) => {
    switch (stability) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'fair': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusIcon = (stability: string) => {
    switch (stability) {
      case 'excellent': return CheckCircle;
      case 'good': return Wifi;
      case 'fair': return AlertTriangle;
      case 'poor': return WifiOff;
      default: return Signal;
    }
  };

  const StatusIcon = getStatusIcon(condition.stability);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <StatusIcon className={cn("h-5 w-5", getStatusColor(condition.stability))} />
            Network Status
          </span>
          <Button size="sm" variant="outline" onClick={onTest}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Test
          </Button>
        </CardTitle>
        <CardDescription>
          Current network conditions - {condition.stability}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Bandwidth</div>
            <div className="font-medium">{condition.bandwidth} Mbps</div>
          </div>
          <div>
            <div className="text-gray-600">Latency</div>
            <div className="font-medium">{condition.latency}ms</div>
          </div>
          <div>
            <div className="text-gray-600">Packet Loss</div>
            <div className="font-medium">{condition.packetLoss}%</div>
          </div>
          <div>
            <div className="text-gray-600">Jitter</div>
            <div className="font-medium">{condition.jitter}ms</div>
          </div>
        </div>
        
        <div className="pt-2">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Connection Quality</span>
            <span>Last checked: {condition.timestamp.toLocaleTimeString()}</span>
          </div>
          <Progress 
            value={
              condition.stability === 'excellent' ? 95 :
              condition.stability === 'good' ? 80 :
              condition.stability === 'fair' ? 60 : 30
            } 
            className="h-2" 
          />
        </div>
      </CardContent>
    </Card>
  );
}

// Device capabilities display
function DeviceCapabilitiesDisplay({ 
  capabilities 
}: { 
  capabilities: DeviceCapabilities;
}) {
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return Smartphone;
      case 'tablet': return Monitor; // Using Monitor as tablet placeholder
      case 'desktop': return Monitor;
      default: return Monitor;
    }
  };

  const DeviceIcon = getDeviceIcon(capabilities.type);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DeviceIcon className="h-5 w-5" />
          Device Capabilities
        </CardTitle>
        <CardDescription>
          Current device performance characteristics
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-gray-600">Device Type</div>
            <div className="font-medium capitalize">{capabilities.type}</div>
          </div>
          <div>
            <div className="text-gray-600">Screen</div>
            <div className="font-medium">
              {capabilities.screen.width}×{capabilities.screen.height}
            </div>
          </div>
          <div>
            <div className="text-gray-600">CPU Power</div>
            <Badge className={
              capabilities.hardware.cpu === 'high' ? 'bg-green-500' :
              capabilities.hardware.cpu === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
            }>
              {capabilities.hardware.cpu}
            </Badge>
          </div>
          <div>
            <div className="text-gray-600">Memory</div>
            <div className="font-medium">{capabilities.hardware.memory}GB</div>
          </div>
        </div>

        {capabilities.type === 'mobile' && (
          <div className="pt-2 border-t">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Battery</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{capabilities.battery.level}%</span>
                {capabilities.battery.saver && (
                  <Badge variant="outline" className="text-xs">
                    Power Saver
                  </Badge>
                )}
              </div>
            </div>
            <Progress value={capabilities.battery.level} className="h-2 mt-1" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Adaptation strategy controls
function AdaptationControls({ 
  adaptation, 
  onChange 
}: { 
  adaptation: QualityAdaptation;
  onChange?: (adaptation: QualityAdaptation) => void;
}) {
  const updateAdaptation = (updates: Partial<QualityAdaptation>) => {
    onChange?.({ ...adaptation, ...updates });
  };

  const updateThresholds = (key: keyof QualityAdaptation['thresholds'], value: number[]) => {
    updateAdaptation({
      thresholds: {
        ...adaptation.thresholds,
        [key]: value[0]
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Adaptive Quality
          </span>
          <Switch
            checked={adaptation.enabled}
            onCheckedChange={(enabled) => updateAdaptation({ enabled })}
          />
        </CardTitle>
        <CardDescription>
          Automatically adjust quality based on network conditions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Strategy</label>
          <Select
            value={adaptation.strategy}
            onValueChange={(strategy: 'conservative' | 'balanced' | 'aggressive') => 
              updateAdaptation({ strategy })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="conservative">Conservative - Stable quality</SelectItem>
              <SelectItem value="balanced">Balanced - Adaptive response</SelectItem>
              <SelectItem value="aggressive">Aggressive - Quick adjustments</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {adaptation.enabled && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Upgrade Threshold: {adaptation.thresholds.upgrade}%
              </label>
              <Slider
                value={[adaptation.thresholds.upgrade]}
                onValueChange={(value) => updateThresholds('upgrade', value)}
                min={50}
                max={95}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-gray-600">
                Network quality needed to upgrade to higher quality
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Downgrade Threshold: {adaptation.thresholds.downgrade}%
              </label>
              <Slider
                value={[adaptation.thresholds.downgrade]}
                onValueChange={(value) => updateThresholds('downgrade', value)}
                min={20}
                max={70}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-gray-600">
                Network quality below which to downgrade quality
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Emergency Threshold: {adaptation.thresholds.emergency}%
              </label>
              <Slider
                value={[adaptation.thresholds.emergency]}
                onValueChange={(value) => updateThresholds('emergency', value)}
                min={5}
                max={40}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-gray-600">
                Critical threshold for emergency quality reduction
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Quality selection interface
function QualitySelection({ 
  currentQuality, 
  networkCondition,
  deviceCapabilities,
  onQualityChange 
}: {
  currentQuality: string;
  networkCondition: NetworkCondition;
  deviceCapabilities: DeviceCapabilities;
  onQualityChange?: (quality: string) => void;
}) {
  const getQualityCompatibility = (quality: typeof QUALITY_OPTIONS[0]) => {
    if (quality.id === 'auto') return true;
    if (quality.id === 'audio') return true;
    
    const hasEnoughBandwidth = networkCondition.bandwidth >= quality.bandwidth;
    const deviceCanHandle = quality.id === 'ultra_hd' ? 
      deviceCapabilities.type === 'desktop' && deviceCapabilities.hardware.cpu === 'high' :
      true;
    
    return hasEnoughBandwidth && deviceCanHandle;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quality Selection</CardTitle>
        <CardDescription>
          Choose quality tier or enable adaptive streaming
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {QUALITY_OPTIONS.map((quality) => {
          const compatible = getQualityCompatibility(quality);
          const isSelected = quality.id === currentQuality;
          
          return (
            <div
              key={quality.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                isSelected ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50",
                !compatible && "opacity-50 cursor-not-allowed"
              )}
              onClick={() => compatible && onQualityChange?.(quality.id)}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-4 h-4 rounded-full border-2",
                  isSelected ? "bg-blue-500 border-blue-500" : "border-gray-300"
                )} />
                <div>
                  <div className="font-medium">{quality.name}</div>
                  <div className="text-sm text-gray-600">
                    {quality.resolution}
                    {quality.bandwidth > 0 && ` • ${quality.bandwidth} Mbps`}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {quality.id === 'auto' && (
                  <Badge className="bg-green-500">
                    Recommended
                  </Badge>
                )}
                {!compatible && (
                  <Badge variant="outline" className="text-red-600">
                    Unavailable
                  </Badge>
                )}
                {compatible && !isSelected && (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

// Main component
export function AdaptiveQualitySelector({
  currentQuality,
  networkCondition = MOCK_NETWORK_CONDITION,
  deviceCapabilities = MOCK_DEVICE_CAPABILITIES,
  qualityAdaptation = MOCK_QUALITY_ADAPTATION,
  isStreaming = false,
  onQualityChange,
  onAdaptationChange,
  onNetworkTest,
  className
}: AdaptiveQualitySelectorProps) {
  const [localAdaptation, setLocalAdaptation] = React.useState(qualityAdaptation);
  const [isOptimizing, setIsOptimizing] = React.useState(false);

  const currentQualityOption = QUALITY_OPTIONS.find(q => q.id === currentQuality);
  const isAdaptiveMode = currentQuality === 'auto';

  const handleAdaptationChange = (adaptation: QualityAdaptation) => {
    setLocalAdaptation(adaptation);
    onAdaptationChange?.(adaptation);
  };

  const handleOptimize = () => {
    setIsOptimizing(true);
    
    // Simulate optimization process
    setTimeout(() => {
      setIsOptimizing(false);
      
      // Auto-select best quality based on conditions
      const recommendedQuality = networkCondition.bandwidth >= 15 ? 'ultra_hd' :
                                networkCondition.bandwidth >= 5 ? 'full_hd' :
                                networkCondition.bandwidth >= 2.5 ? 'hd' :
                                networkCondition.bandwidth >= 1 ? 'sd' : 'low';
      
      onQualityChange?.(localAdaptation.enabled ? 'auto' : recommendedQuality);
    }, 2000);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Adaptive Quality Control</h2>
          <p className="text-gray-600">
            Intelligent quality adaptation based on network and device conditions
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {isStreaming && (
            <Badge className="bg-red-500 animate-pulse">
              <Play className="h-3 w-3 mr-1" />
              LIVE
            </Badge>
          )}
          <Button
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="flex items-center gap-2"
          >
            {isOptimizing ? (
              <Activity className="h-4 w-4 animate-spin" />
            ) : (
              <Zap className="h-4 w-4" />
            )}
            {isOptimizing ? 'Optimizing...' : 'Auto Optimize'}
          </Button>
        </div>
      </div>

      {/* Status Alert */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          {isAdaptiveMode ? (
            <>Currently using <strong>adaptive quality</strong> - automatically adjusting based on conditions.</>
          ) : (
            <>Currently streaming at <strong>{currentQualityOption?.name || 'Unknown'}</strong> quality.</>
          )}
          {networkCondition.stability === 'poor' && (
            <span className="ml-2 text-red-600">
              Network conditions may affect quality.
            </span>
          )}
        </AlertDescription>
      </Alert>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <NetworkStatusIndicator 
            condition={networkCondition} 
            onTest={onNetworkTest}
          />
          <DeviceCapabilitiesDisplay capabilities={deviceCapabilities} />
        </div>
        
        <div className="space-y-6">
          <QualitySelection
            currentQuality={currentQuality}
            networkCondition={networkCondition}
            deviceCapabilities={deviceCapabilities}
            onQualityChange={onQualityChange}
          />
        </div>
      </div>

      {/* Adaptation Controls */}
      <AdaptationControls
        adaptation={localAdaptation}
        onChange={handleAdaptationChange}
      />

      {/* Performance Metrics */}
      {isStreaming && (
        <Card>
          <CardHeader>
            <CardTitle>Live Performance Metrics</CardTitle>
            <CardDescription>
              Real-time streaming performance indicators
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {localAdaptation.bufferHealth.toFixed(1)}s
                </div>
                <div className="text-sm text-gray-600">Buffer Health</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {(100 - networkCondition.packetLoss).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Stream Stability</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {localAdaptation.maxDrops - 2}
                </div>
                <div className="text-sm text-gray-600">Frames Dropped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {networkCondition.latency}ms
                </div>
                <div className="text-sm text-gray-600">End-to-End</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}