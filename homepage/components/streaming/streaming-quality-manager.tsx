'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  Wifi,
  Monitor,
  Smartphone,
  Tablet,
  Zap,
  Signal,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Info,
  Gauge,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Eye,
  Play,
  Pause,
  Volume2,
  Maximize,
  RotateCcw,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Types for streaming quality management
export interface StreamingQualityTier {
  id: string;
  name: string;
  resolution: string;
  bitrate: number; // Mbps
  frameRate: number;
  useCase: string;
  minBandwidth: number; // Mbps
  recommendation: 'premium' | 'standard' | 'default' | 'mobile' | 'limited' | 'minimal';
  enabled: boolean;
  codecSupport: string[];
  deviceCompatibility: ('desktop' | 'mobile' | 'tablet')[];
}

export interface TechnicalRequirements {
  upload: {
    current: number;
    minimum: number;
    recommended: number;
    status: 'excellent' | 'good' | 'adequate' | 'poor';
  };
  latency: {
    current: number;
    target: number;
    status: 'excellent' | 'good' | 'adequate' | 'poor';
  };
  packetLoss: {
    current: number;
    threshold: number;
    status: 'excellent' | 'good' | 'adequate' | 'poor';
  };
  cpu: {
    usage: number;
    available: number;
    status: 'excellent' | 'good' | 'adequate' | 'poor';
  };
  memory: {
    usage: number;
    available: number;
    status: 'excellent' | 'good' | 'adequate' | 'poor';
  };
}

export interface StreamingQualityManagerProps {
  currentQuality?: string;
  availableQualities?: StreamingQualityTier[];
  technicalRequirements?: TechnicalRequirements;
  autoAdapt?: boolean;
  onQualityChange?: (qualityId: string) => void;
  onAutoAdaptToggle?: (enabled: boolean) => void;
  onTechnicalTest?: () => void;
  className?: string;
}

// Default quality tiers based on the plan specifications
const DEFAULT_QUALITY_TIERS: StreamingQualityTier[] = [
  {
    id: 'ultra_hd',
    name: 'Ultra HD',
    resolution: '4K (2160p)',
    bitrate: 15,
    frameRate: 60,
    useCase: 'Premium',
    minBandwidth: 20,
    recommendation: 'premium',
    enabled: true,
    codecSupport: ['H.265', 'VP9', 'AV1'],
    deviceCompatibility: ['desktop']
  },
  {
    id: 'full_hd',
    name: 'Full HD',
    resolution: '1080p',
    bitrate: 5,
    frameRate: 30,
    useCase: 'Standard',
    minBandwidth: 10,
    recommendation: 'standard',
    enabled: true,
    codecSupport: ['H.264', 'H.265', 'VP9'],
    deviceCompatibility: ['desktop', 'tablet']
  },
  {
    id: 'hd',
    name: 'HD',
    resolution: '720p',
    bitrate: 2.5,
    frameRate: 30,
    useCase: 'Default',
    minBandwidth: 5,
    recommendation: 'default',
    enabled: true,
    codecSupport: ['H.264', 'VP8', 'VP9'],
    deviceCompatibility: ['desktop', 'tablet', 'mobile']
  },
  {
    id: 'sd',
    name: 'SD',
    resolution: '480p',
    bitrate: 1,
    frameRate: 30,
    useCase: 'Mobile',
    minBandwidth: 2,
    recommendation: 'mobile',
    enabled: true,
    codecSupport: ['H.264', 'VP8'],
    deviceCompatibility: ['mobile', 'tablet']
  },
  {
    id: 'low',
    name: 'Low',
    resolution: '360p',
    bitrate: 0.5,
    frameRate: 30,
    useCase: 'Limited',
    minBandwidth: 1,
    recommendation: 'limited',
    enabled: true,
    codecSupport: ['H.264'],
    deviceCompatibility: ['mobile']
  },
  {
    id: 'audio_only',
    name: 'Audio Only',
    resolution: 'N/A',
    bitrate: 0.128,
    frameRate: 0,
    useCase: 'Minimal',
    minBandwidth: 0.5,
    recommendation: 'minimal',
    enabled: true,
    codecSupport: ['AAC', 'Opus'],
    deviceCompatibility: ['desktop', 'mobile', 'tablet']
  }
];

// Mock technical requirements
const MOCK_TECHNICAL_REQUIREMENTS: TechnicalRequirements = {
  upload: {
    current: 8.5,
    minimum: 2,
    recommended: 10,
    status: 'good'
  },
  latency: {
    current: 45,
    target: 50,
    status: 'excellent'
  },
  packetLoss: {
    current: 0.2,
    threshold: 1.0,
    status: 'excellent'
  },
  cpu: {
    usage: 35,
    available: 100,
    status: 'excellent'
  },
  memory: {
    usage: 2.1,
    available: 8,
    status: 'good'
  }
};

// Quality tier card component
function QualityTierCard({
  tier,
  isSelected,
  technicalRequirements,
  onSelect,
  className
}: {
  tier: StreamingQualityTier;
  isSelected?: boolean;
  technicalRequirements?: TechnicalRequirements;
  onSelect?: (tierId: string) => void;
  className?: string;
}) {
  const canSupport = technicalRequirements ? 
    technicalRequirements.upload.current >= tier.minBandwidth : true;
    
  const getRecommendationColor = (rec: string) => {
    switch (rec) {
      case 'premium': return 'bg-purple-500';
      case 'standard': return 'bg-blue-500';
      case 'default': return 'bg-green-500';
      case 'mobile': return 'bg-orange-500';
      case 'limited': return 'bg-yellow-500';
      case 'minimal': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getDeviceIcon = (device: string) => {
    switch (device) {
      case 'desktop': return Monitor;
      case 'tablet': return Tablet;
      case 'mobile': return Smartphone;
      default: return Monitor;
    }
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg",
        isSelected && "ring-2 ring-blue-500 shadow-lg",
        !canSupport && "opacity-60",
        className
      )}
      onClick={() => canSupport && onSelect?.(tier.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h4 className="font-semibold text-lg">{tier.name}</h4>
            <p className="text-sm text-gray-600">{tier.resolution}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getRecommendationColor(tier.recommendation)}>
              {tier.useCase}
            </Badge>
            {isSelected && <CheckCircle className="h-4 w-4 text-green-500" />}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Bitrate:</span>
            <span className="font-medium">{tier.bitrate} Mbps</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Frame Rate:</span>
            <span className="font-medium">{tier.frameRate || 'N/A'} fps</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Min Bandwidth:</span>
            <span className={cn(
              "font-medium",
              canSupport ? "text-green-600" : "text-red-600"
            )}>
              {tier.minBandwidth} Mbps
            </span>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-xs text-gray-600">Compatible:</span>
          </div>
          <div className="flex gap-1">
            {tier.deviceCompatibility.map((device) => {
              const Icon = getDeviceIcon(device);
              return (
                <Icon 
                  key={device} 
                  className="h-4 w-4 text-gray-600" 
                  title={device}
                />
              );
            })}
          </div>
        </div>

        {!canSupport && (
          <Alert className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              Insufficient bandwidth. Need {tier.minBandwidth} Mbps (current: {technicalRequirements?.upload.current} Mbps)
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

// Technical status indicator
function TechnicalStatusIndicator({
  label,
  current,
  target,
  unit,
  status,
  icon: Icon,
  isHigherBetter = true
}: {
  label: string;
  current: number;
  target?: number;
  unit: string;
  status: 'excellent' | 'good' | 'adequate' | 'poor';
  icon: React.ElementType;
  isHigherBetter?: boolean;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-500';
      case 'good': return 'text-blue-500';
      case 'adequate': return 'text-yellow-500';
      case 'poor': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getProgressValue = () => {
    if (!target) return status === 'excellent' ? 100 : status === 'good' ? 80 : status === 'adequate' ? 60 : 40;
    const percentage = isHigherBetter ? 
      Math.min((current / target) * 100, 100) :
      Math.max(100 - (current / target) * 100, 0);
    return Math.max(percentage, 10);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className={cn("h-4 w-4", getStatusColor(status))} />
            <span className="text-sm font-medium">{label}</span>
          </div>
          <Badge variant="outline" className={getStatusColor(status)}>
            {status}
          </Badge>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Current:</span>
            <span className="font-medium">{current} {unit}</span>
          </div>
          {target && (
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>{isHigherBetter ? 'Target:' : 'Max:'}:</span>
              <span>{target} {unit}</span>
            </div>
          )}
          <Progress value={getProgressValue()} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}

// Main component
export function StreamingQualityManager({
  currentQuality = 'hd',
  availableQualities = DEFAULT_QUALITY_TIERS,
  technicalRequirements = MOCK_TECHNICAL_REQUIREMENTS,
  autoAdapt = true,
  onQualityChange,
  onAutoAdaptToggle,
  onTechnicalTest,
  className
}: StreamingQualityManagerProps) {
  const [selectedTab, setSelectedTab] = React.useState('quality');
  const [localAutoAdapt, setLocalAutoAdapt] = React.useState(autoAdapt);
  const [isMonitoring, setIsMonitoring] = React.useState(false);

  const currentTier = availableQualities.find(q => q.id === currentQuality);
  const recommendedQuality = React.useMemo(() => {
    if (!technicalRequirements) return availableQualities[2]; // Default HD
    
    const upload = technicalRequirements.upload.current;
    const sortedQualities = [...availableQualities].sort((a, b) => b.minBandwidth - a.minBandwidth);
    
    return sortedQualities.find(q => upload >= q.minBandwidth) || availableQualities[availableQualities.length - 1];
  }, [technicalRequirements, availableQualities]);

  const handleQualitySelect = (qualityId: string) => {
    onQualityChange?.(qualityId);
  };

  const handleAutoAdaptToggle = () => {
    const newValue = !localAutoAdapt;
    setLocalAutoAdapt(newValue);
    onAutoAdaptToggle?.(newValue);
  };

  const startTechnicalTest = () => {
    setIsMonitoring(true);
    onTechnicalTest?.();
    
    // Simulate test completion
    setTimeout(() => {
      setIsMonitoring(false);
    }, 5000);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Streaming Quality Manager</h2>
          <p className="text-gray-600">
            Optimize your streaming quality based on technical requirements
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={localAutoAdapt ? "default" : "outline"}
            onClick={handleAutoAdaptToggle}
            className="flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            Auto Adapt
          </Button>
          <Button
            onClick={startTechnicalTest}
            disabled={isMonitoring}
            className="flex items-center gap-2"
          >
            {isMonitoring ? (
              <Activity className="h-4 w-4 animate-pulse" />
            ) : (
              <Signal className="h-4 w-4" />
            )}
            {isMonitoring ? 'Testing...' : 'Test Connection'}
          </Button>
        </div>
      </div>

      {/* Current Status */}
      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          Currently streaming at <strong>{currentTier?.name || 'Unknown'}</strong> quality.
          {localAutoAdapt && recommendedQuality && recommendedQuality.id !== currentQuality && (
            <span className="ml-2">
              Recommended: <strong>{recommendedQuality.name}</strong>
            </span>
          )}
        </AlertDescription>
      </Alert>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="quality">Quality Tiers</TabsTrigger>
          <TabsTrigger value="technical">Technical Status</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="quality" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableQualities.map((tier) => (
              <QualityTierCard
                key={tier.id}
                tier={tier}
                isSelected={tier.id === currentQuality}
                technicalRequirements={technicalRequirements}
                onSelect={handleQualitySelect}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TechnicalStatusIndicator
              label="Upload Speed"
              current={technicalRequirements.upload.current}
              target={technicalRequirements.upload.recommended}
              unit="Mbps"
              status={technicalRequirements.upload.status}
              icon={ArrowUp}
            />
            <TechnicalStatusIndicator
              label="Latency"
              current={technicalRequirements.latency.current}
              target={technicalRequirements.latency.target}
              unit="ms"
              status={technicalRequirements.latency.status}
              icon={Network}
              isHigherBetter={false}
            />
            <TechnicalStatusIndicator
              label="Packet Loss"
              current={technicalRequirements.packetLoss.current}
              target={technicalRequirements.packetLoss.threshold}
              unit="%"
              status={technicalRequirements.packetLoss.status}
              icon={Wifi}
              isHigherBetter={false}
            />
            <TechnicalStatusIndicator
              label="CPU Usage"
              current={technicalRequirements.cpu.usage}
              target={technicalRequirements.cpu.available}
              unit="%"
              status={technicalRequirements.cpu.status}
              icon={Cpu}
              isHigherBetter={false}
            />
            <TechnicalStatusIndicator
              label="Memory Usage"
              current={technicalRequirements.memory.usage}
              target={technicalRequirements.memory.available}
              unit="GB"
              status={technicalRequirements.memory.status}
              icon={MemoryStick}
              isHigherBetter={false}
            />
            <TechnicalStatusIndicator
              label="Overall Status"
              current={85}
              unit="%"
              status="good"
              icon={Gauge}
            />
          </div>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Recommendations</CardTitle>
                <CardDescription>
                  Based on your current technical capabilities
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="font-medium text-green-800">Recommended</span>
                  </div>
                  <p className="text-sm text-green-700">
                    <strong>{recommendedQuality?.name}</strong> - Optimal balance of quality and performance
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h5 className="font-medium">Optimization Tips:</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Close unnecessary applications to free up CPU</li>
                    <li>• Use wired connection for better stability</li>
                    <li>• Enable auto-adapt for dynamic quality adjustment</li>
                    <li>• Consider upgrading internet for higher quality tiers</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quality Impact Analysis</CardTitle>
                <CardDescription>
                  How quality affects your stream performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Bandwidth Usage</span>
                    <span className="font-medium">{currentTier?.bitrate} Mbps</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">CPU Impact</span>
                    <Badge variant="outline">
                      {currentTier?.bitrate > 5 ? 'High' : currentTier?.bitrate > 2 ? 'Medium' : 'Low'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Viewer Experience</span>
                    <Badge className={
                      currentTier?.recommendation === 'premium' ? 'bg-purple-500' :
                      currentTier?.recommendation === 'standard' ? 'bg-blue-500' :
                      'bg-green-500'
                    }>
                      {currentTier?.useCase}
                    </Badge>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <h6 className="font-medium mb-2">Quality Features:</h6>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div>Resolution: {currentTier?.resolution}</div>
                      <div>Frame Rate: {currentTier?.frameRate} fps</div>
                      <div>Codecs: {currentTier?.codecSupport.join(', ')}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}