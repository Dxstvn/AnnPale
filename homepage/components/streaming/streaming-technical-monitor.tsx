'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Cpu,
  Database,
  Globe,
  HardDrive,
  MemoryStick,
  Network,
  Server,
  Signal,
  Wifi,
  WifiOff,
  Zap,
  Gauge,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  Settings,
  AlertCircle,
  Info,
  Eye,
  Users,
  Video,
  Volume2,
  Radio,
  ArrowUp,
  ArrowDown,
  Timer,
  Target,
  Thermometer,
  Power,
  MonitorSpeaker
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Types for technical monitoring
export interface SystemMetrics {
  cpu: {
    usage: number;
    temperature: number;
    cores: number;
    frequency: number;
    status: 'optimal' | 'warning' | 'critical';
  };
  memory: {
    used: number;
    total: number;
    usage: number;
    available: number;
    status: 'optimal' | 'warning' | 'critical';
  };
  storage: {
    used: number;
    total: number;
    usage: number;
    available: number;
    writeSpeed: number;
    readSpeed: number;
    status: 'optimal' | 'warning' | 'critical';
  };
  gpu: {
    usage: number;
    memory: number;
    temperature: number;
    encoder: boolean;
    status: 'optimal' | 'warning' | 'critical';
  };
}

export interface NetworkMetrics {
  upload: {
    current: number;
    average: number;
    peak: number;
    stability: number;
    status: 'optimal' | 'warning' | 'critical';
  };
  download: {
    current: number;
    average: number;
    peak: number;
    stability: number;
    status: 'optimal' | 'warning' | 'critical';
  };
  latency: {
    current: number;
    average: number;
    jitter: number;
    status: 'optimal' | 'warning' | 'critical';
  };
  packetLoss: {
    current: number;
    average: number;
    status: 'optimal' | 'warning' | 'critical';
  };
}

export interface StreamingMetrics {
  encoding: {
    codec: string;
    bitrate: number;
    frameRate: number;
    resolution: string;
    quality: number;
    droppedFrames: number;
    skippedFrames: number;
    status: 'optimal' | 'warning' | 'critical';
  };
  delivery: {
    cdnRegion: string;
    edgeLatency: number;
    throughput: number;
    cacheHitRate: number;
    errorRate: number;
    status: 'optimal' | 'warning' | 'critical';
  };
  viewer: {
    count: number;
    bufferHealth: number;
    qualityDistribution: { [key: string]: number };
    rebufferRate: number;
    startupTime: number;
    status: 'optimal' | 'warning' | 'critical';
  };
}

export interface TechnicalAlert {
  id: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'critical';
  category: 'system' | 'network' | 'streaming' | 'cdn';
  title: string;
  description: string;
  resolution?: string;
  auto_resolved?: boolean;
  metrics?: Record<string, number>;
}

export interface StreamingTechnicalMonitorProps {
  systemMetrics?: SystemMetrics;
  networkMetrics?: NetworkMetrics;
  streamingMetrics?: StreamingMetrics;
  alerts?: TechnicalAlert[];
  isLive?: boolean;
  autoRefresh?: boolean;
  refreshInterval?: number;
  onAlertResolve?: (alertId: string) => void;
  onSystemOptimize?: () => void;
  className?: string;
}

// Mock data generators
const generateSystemMetrics = (): SystemMetrics => ({
  cpu: {
    usage: 42,
    temperature: 68,
    cores: 8,
    frequency: 3.2,
    status: 'optimal'
  },
  memory: {
    used: 12.5,
    total: 32,
    usage: 39,
    available: 19.5,
    status: 'optimal'
  },
  storage: {
    used: 850,
    total: 2000,
    usage: 42.5,
    available: 1150,
    writeSpeed: 520,
    readSpeed: 2400,
    status: 'optimal'
  },
  gpu: {
    usage: 78,
    memory: 6.2,
    temperature: 72,
    encoder: true,
    status: 'optimal'
  }
});

const generateNetworkMetrics = (): NetworkMetrics => ({
  upload: {
    current: 8.5,
    average: 8.2,
    peak: 9.1,
    stability: 95,
    status: 'optimal'
  },
  download: {
    current: 125,
    average: 120,
    peak: 140,
    stability: 98,
    status: 'optimal'
  },
  latency: {
    current: 45,
    average: 48,
    jitter: 2.1,
    status: 'optimal'
  },
  packetLoss: {
    current: 0.1,
    average: 0.2,
    status: 'optimal'
  }
});

const generateStreamingMetrics = (): StreamingMetrics => ({
  encoding: {
    codec: 'H.264',
    bitrate: 5000,
    frameRate: 30,
    resolution: '1080p',
    quality: 92,
    droppedFrames: 5,
    skippedFrames: 2,
    status: 'optimal'
  },
  delivery: {
    cdnRegion: 'US-East-1',
    edgeLatency: 15,
    throughput: 4.8,
    cacheHitRate: 96,
    errorRate: 0.02,
    status: 'optimal'
  },
  viewer: {
    count: 267,
    bufferHealth: 3.5,
    qualityDistribution: {
      '1080p': 65,
      '720p': 25,
      '480p': 8,
      '360p': 2
    },
    rebufferRate: 0.5,
    startupTime: 1.2,
    status: 'optimal'
  }
});

const generateAlerts = (): TechnicalAlert[] => [
  {
    id: 'alert_1',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    severity: 'warning',
    category: 'network',
    title: 'Upload Bandwidth Fluctuation',
    description: 'Upload speed varied between 6-10 Mbps in the last 5 minutes',
    resolution: 'Consider switching to adaptive bitrate',
    metrics: { upload: 8.5, stability: 85 }
  },
  {
    id: 'alert_2',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    severity: 'info',
    category: 'streaming',
    title: 'Quality Adaptation Triggered',
    description: 'Automatically reduced bitrate from 6 Mbps to 5 Mbps',
    auto_resolved: true,
    metrics: { bitrate: 5000, quality: 92 }
  },
  {
    id: 'alert_3',
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    severity: 'error',
    category: 'system',
    title: 'High CPU Temperature',
    description: 'CPU temperature reached 85°C, enabling thermal throttling',
    resolution: 'Improve ventilation or reduce encoding complexity',
    metrics: { temperature: 85, cpu_usage: 95 }
  }
];

// Metric card component
function MetricCard({
  title,
  value,
  unit,
  status,
  icon: Icon,
  trend,
  details,
  className
}: {
  title: string;
  value: number | string;
  unit?: string;
  status: 'optimal' | 'warning' | 'critical';
  icon: React.ElementType;
  trend?: 'up' | 'down' | 'stable';
  details?: string;
  className?: string;
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'critical': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'optimal': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'critical': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getTrendIcon = (trend?: string) => {
    switch (trend) {
      case 'up': return TrendingUp;
      case 'down': return TrendingDown;
      default: return null;
    }
  };

  const TrendIcon = getTrendIcon(trend);

  return (
    <Card className={cn('border', getStatusBg(status), className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className={cn("h-4 w-4", getStatusColor(status))} />
            <span className="text-sm font-medium text-gray-700">{title}</span>
          </div>
          {TrendIcon && (
            <TrendIcon className={cn("h-3 w-3", getStatusColor(status))} />
          )}
        </div>
        
        <div className="space-y-1">
          <div className="text-2xl font-bold">
            {value}{unit && <span className="text-sm text-gray-600 ml-1">{unit}</span>}
          </div>
          {details && (
            <p className="text-xs text-gray-600">{details}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Alert component
function AlertItem({
  alert,
  onResolve
}: {
  alert: TechnicalAlert;
  onResolve?: (alertId: string) => void;
}) {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'info': return 'text-blue-700 bg-blue-50 border-blue-200';
      default: return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return AlertTriangle;
      case 'error': return AlertCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return Info;
    }
  };

  const SeverityIcon = getSeverityIcon(alert.severity);

  return (
    <Card className={cn('border', getSeverityColor(alert.severity))}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1">
            <SeverityIcon className="h-4 w-4 mt-0.5" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h5 className="font-medium text-sm">{alert.title}</h5>
                <Badge variant="outline" className="text-xs capitalize">
                  {alert.severity}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {alert.category}
                </Badge>
              </div>
              <p className="text-sm mb-2">{alert.description}</p>
              {alert.resolution && (
                <p className="text-xs text-gray-600 mb-2">
                  <strong>Resolution:</strong> {alert.resolution}
                </p>
              )}
              <div className="text-xs text-gray-500">
                {alert.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
          {!alert.auto_resolved && onResolve && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onResolve(alert.id)}
              className="text-xs"
            >
              Resolve
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Main component
export function StreamingTechnicalMonitor({
  systemMetrics = generateSystemMetrics(),
  networkMetrics = generateNetworkMetrics(),
  streamingMetrics = generateStreamingMetrics(),
  alerts = generateAlerts(),
  isLive = true,
  autoRefresh = true,
  refreshInterval = 5000,
  onAlertResolve,
  onSystemOptimize,
  className
}: StreamingTechnicalMonitorProps) {
  const [selectedTab, setSelectedTab] = React.useState('overview');
  const [lastUpdate, setLastUpdate] = React.useState(new Date());
  const [isOptimizing, setIsOptimizing] = React.useState(false);

  // Auto-refresh simulation
  React.useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date());
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval]);

  const activeAlerts = alerts.filter(alert => !alert.auto_resolved);
  const criticalAlerts = activeAlerts.filter(alert => alert.severity === 'critical' || alert.severity === 'error');

  const handleOptimize = () => {
    setIsOptimizing(true);
    onSystemOptimize?.();
    
    setTimeout(() => {
      setIsOptimizing(false);
    }, 3000);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Technical Monitoring</h2>
          <p className="text-gray-600">
            Real-time system and streaming performance monitoring
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {isLive && (
            <Badge className="bg-red-500 animate-pulse">
              <Radio className="h-3 w-3 mr-1" />
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
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription>
            <strong>{criticalAlerts.length} critical alert(s)</strong> require immediate attention.
            Check the Alerts tab for details.
          </AlertDescription>
        </Alert>
      )}

      {/* Status Bar */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">System Operational</span>
          </div>
          <div className="text-sm text-gray-600">
            Last update: {lastUpdate.toLocaleTimeString()}
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-sm">
          <div>
            <span className="text-gray-600">Stream Quality:</span>
            <span className="font-medium ml-1">{streamingMetrics.encoding.quality}%</span>
          </div>
          <div>
            <span className="text-gray-600">Viewers:</span>
            <span className="font-medium ml-1">{streamingMetrics.viewer.count}</span>
          </div>
        </div>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
          <TabsTrigger value="alerts" className="relative">
            Alerts
            {activeAlerts.length > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
                {activeAlerts.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard
              title="CPU Usage"
              value={systemMetrics.cpu.usage}
              unit="%"
              status={systemMetrics.cpu.status}
              icon={Cpu}
              details={`${systemMetrics.cpu.temperature}°C`}
            />
            <MetricCard
              title="Memory"
              value={systemMetrics.memory.usage}
              unit="%"
              status={systemMetrics.memory.status}
              icon={MemoryStick}
              details={`${systemMetrics.memory.used}/${systemMetrics.memory.total}GB`}
            />
            <MetricCard
              title="Upload"
              value={networkMetrics.upload.current}
              unit="Mbps"
              status={networkMetrics.upload.status}
              icon={ArrowUp}
              trend="stable"
              details={`${networkMetrics.upload.stability}% stable`}
            />
            <MetricCard
              title="Stream Quality"
              value={streamingMetrics.encoding.quality}
              unit="%"
              status={streamingMetrics.encoding.status}
              icon={Video}
              details={`${streamingMetrics.encoding.resolution} @ ${streamingMetrics.encoding.frameRate}fps`}
            />
          </div>
          
          <div className="grid lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Encoding Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Codec:</span>
                  <span className="font-medium">{streamingMetrics.encoding.codec}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Bitrate:</span>
                  <span className="font-medium">{(streamingMetrics.encoding.bitrate / 1000).toFixed(1)} Mbps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Dropped Frames:</span>
                  <span className="font-medium">{streamingMetrics.encoding.droppedFrames}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">GPU Usage:</span>
                  <span className="font-medium">{systemMetrics.gpu.usage}%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Viewer Experience</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Buffer Health:</span>
                  <span className="font-medium">{streamingMetrics.viewer.bufferHealth}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Rebuffer Rate:</span>
                  <span className="font-medium">{streamingMetrics.viewer.rebufferRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Startup Time:</span>
                  <span className="font-medium">{streamingMetrics.viewer.startupTime}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">CDN Region:</span>
                  <span className="font-medium">{streamingMetrics.delivery.cdnRegion}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Cpu className="h-5 w-5" />
                  CPU Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Usage</span>
                    <span>{systemMetrics.cpu.usage}%</span>
                  </div>
                  <Progress value={systemMetrics.cpu.usage} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Temperature</span>
                    <span>{systemMetrics.cpu.temperature}°C</span>
                  </div>
                  <Progress value={(systemMetrics.cpu.temperature / 100) * 100} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Cores:</span>
                    <span className="font-medium ml-1">{systemMetrics.cpu.cores}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Frequency:</span>
                    <span className="font-medium ml-1">{systemMetrics.cpu.frequency} GHz</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MemoryStick className="h-5 w-5" />
                  Memory Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Used</span>
                    <span>{systemMetrics.memory.used} / {systemMetrics.memory.total} GB</span>
                  </div>
                  <Progress value={systemMetrics.memory.usage} className="h-2" />
                </div>
                <div className="text-sm text-gray-600">
                  Available: {systemMetrics.memory.available} GB
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5" />
                  Storage Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Used</span>
                    <span>{systemMetrics.storage.used} / {systemMetrics.storage.total} GB</span>
                  </div>
                  <Progress value={systemMetrics.storage.usage} className="h-2" />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Read:</span>
                    <span className="font-medium ml-1">{systemMetrics.storage.readSpeed} MB/s</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Write:</span>
                    <span className="font-medium ml-1">{systemMetrics.storage.writeSpeed} MB/s</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MonitorSpeaker className="h-5 w-5" />
                  GPU Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Usage</span>
                    <span>{systemMetrics.gpu.usage}%</span>
                  </div>
                  <Progress value={systemMetrics.gpu.usage} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Memory</span>
                    <span>{systemMetrics.gpu.memory} GB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Temperature</span>
                    <span>{systemMetrics.gpu.temperature}°C</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Hardware Encoder:</span>
                  {systemMetrics.gpu.encoder ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="network" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUp className="h-5 w-5" />
                  Upload Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Current:</span>
                  <span className="font-medium">{networkMetrics.upload.current} Mbps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average:</span>
                  <span className="font-medium">{networkMetrics.upload.average} Mbps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Peak:</span>
                  <span className="font-medium">{networkMetrics.upload.peak} Mbps</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Stability</span>
                    <span>{networkMetrics.upload.stability}%</span>
                  </div>
                  <Progress value={networkMetrics.upload.stability} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDown className="h-5 w-5" />
                  Download Performance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Current:</span>
                  <span className="font-medium">{networkMetrics.download.current} Mbps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average:</span>
                  <span className="font-medium">{networkMetrics.download.average} Mbps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Peak:</span>
                  <span className="font-medium">{networkMetrics.download.peak} Mbps</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Stability</span>
                    <span>{networkMetrics.download.stability}%</span>
                  </div>
                  <Progress value={networkMetrics.download.stability} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Latency & Jitter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Current Latency:</span>
                  <span className="font-medium">{networkMetrics.latency.current}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average Latency:</span>
                  <span className="font-medium">{networkMetrics.latency.average}ms</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Jitter:</span>
                  <span className="font-medium">{networkMetrics.latency.jitter}ms</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <WifiOff className="h-5 w-5" />
                  Packet Loss
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Current:</span>
                  <span className="font-medium">{networkMetrics.packetLoss.current}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average:</span>
                  <span className="font-medium">{networkMetrics.packetLoss.average}%</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Quality</span>
                    <span>{100 - networkMetrics.packetLoss.current}%</span>
                  </div>
                  <Progress value={100 - networkMetrics.packetLoss.current} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              System Alerts ({alerts.length})
            </h3>
            <Button variant="outline" size="sm">
              Clear Resolved
            </Button>
          </div>
          
          <ScrollArea className="h-96">
            <div className="space-y-3">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <AlertItem
                    key={alert.id}
                    alert={alert}
                    onResolve={onAlertResolve}
                  />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                    <h4 className="font-medium mb-2">No Active Alerts</h4>
                    <p className="text-sm text-gray-600">
                      All systems are operating normally
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}