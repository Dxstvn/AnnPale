'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StreamingQualityManager } from '@/components/streaming/streaming-quality-manager';
import { AdaptiveQualitySelector } from '@/components/streaming/adaptive-quality-selector';
import { StreamingTechnicalMonitor } from '@/components/streaming/streaming-technical-monitor';
import {
  Settings,
  Zap,
  Monitor,
  Network,
  Server,
  Shield,
  Activity,
  Radio,
  CheckCircle,
  ArrowRight,
  Gauge,
  Wifi,
  Signal,
  HardDrive,
  Cpu,
  MemoryStick,
  Globe,
  Database,
  Video,
  Volume2,
  Play,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Phase419Demo() {
  const [selectedDemo, setSelectedDemo] = useState('overview');
  const [currentQuality, setCurrentQuality] = useState('hd');
  const [isStreaming, setIsStreaming] = useState(true);
  const [autoAdapt, setAutoAdapt] = useState(true);

  // Phase 4.1.9 statistics
  const phaseStats = {
    qualityTiers: 6,
    technicalMetrics: 15,
    cdnRegions: 12,
    reliabilityFeatures: 8,
    encodingOptions: 10,
    monitoringPoints: 20
  };

  // Technical requirements implementation
  const technicalFeatures = [
    {
      category: 'CDN & Distribution',
      features: [
        'Global edge servers',
        'Adaptive bitrate streaming',
        'Failover systems',
        'Load balancing',
        'Cache optimization'
      ],
      status: 'implemented'
    },
    {
      category: 'Encoding Pipeline',
      features: [
        'Real-time transcoding',
        'Multiple quality levels',
        'Codec optimization',
        'Audio processing',
        'Thumbnail generation'
      ],
      status: 'implemented'
    },
    {
      category: 'Reliability Features',
      features: [
        'Auto-reconnection',
        'Stream recovery',
        'Backup ingest',
        'Error handling',
        'Quality fallback'
      ],
      status: 'implemented'
    }
  ];

  // Quality tiers based on Phase 4.1.9 specs
  const qualityTiers = [
    { quality: 'Ultra HD', resolution: '4K (2160p)', bitrate: '15 Mbps', fps: 60, useCase: 'Premium', bandwidth: '20+ Mbps' },
    { quality: 'Full HD', resolution: '1080p', bitrate: '5 Mbps', fps: 30, useCase: 'Standard', bandwidth: '10+ Mbps' },
    { quality: 'HD', resolution: '720p', bitrate: '2.5 Mbps', fps: 30, useCase: 'Default', bandwidth: '5+ Mbps' },
    { quality: 'SD', resolution: '480p', bitrate: '1 Mbps', fps: 30, useCase: 'Mobile', bandwidth: '2+ Mbps' },
    { quality: 'Low', resolution: '360p', bitrate: '0.5 Mbps', fps: 30, useCase: 'Limited', bandwidth: '1+ Mbps' },
    { quality: 'Audio', resolution: 'N/A', bitrate: '128 kbps', fps: 0, useCase: 'Minimal', bandwidth: '0.5+ Mbps' }
  ];

  const handleQualityChange = (quality: string) => {
    setCurrentQuality(quality);
    console.log('Quality changed to:', quality);
  };

  const handleAutoAdaptToggle = (enabled: boolean) => {
    setAutoAdapt(enabled);
    console.log('Auto-adapt:', enabled);
  };

  const handleTechnicalTest = () => {
    console.log('Running technical test...');
  };

  const handleNetworkTest = () => {
    console.log('Testing network conditions...');
  };

  const handleAlertResolve = (alertId: string) => {
    console.log('Resolving alert:', alertId);
  };

  const handleSystemOptimize = () => {
    console.log('Optimizing system performance...');
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 4.1.9: Technical Requirements & Quality
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Comprehensive streaming infrastructure ensuring reliable, high-quality streaming experiences 
          across all devices and connection speeds with adaptive quality management.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Quality Tiers
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Adaptive Streaming
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Technical Monitoring
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            CDN Distribution
          </span>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            Reliability
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Auto-optimization
          </span>
        </div>
      </div>

      {/* Live Demo Links */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">🔧 Technical Infrastructure Ready</h2>
        <p className="mb-6 text-lg opacity-90">
          Enterprise-grade streaming infrastructure with adaptive quality, global CDN distribution, 
          real-time monitoring, and automatic optimization for optimal viewer experience
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/streaming/quality">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
            >
              <Settings className="w-5 h-5 mr-2" />
              Quality Manager
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/streaming/monitor">
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Activity className="w-5 h-5 mr-2" />
              Technical Monitor
            </Button>
          </Link>
        </div>
      </div>

      {/* Quality Tiers Table */}
      <Card>
        <CardHeader>
          <CardTitle>Streaming Quality Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Quality</th>
                  <th className="text-left p-3">Resolution</th>
                  <th className="text-left p-3">Bitrate</th>
                  <th className="text-left p-3">Frame Rate</th>
                  <th className="text-left p-3">Use Case</th>
                  <th className="text-left p-3">Bandwidth</th>
                </tr>
              </thead>
              <tbody>
                {qualityTiers.map((tier, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{tier.quality}</td>
                    <td className="p-3">{tier.resolution}</td>
                    <td className="p-3">{tier.bitrate}</td>
                    <td className="p-3">{tier.fps > 0 ? `${tier.fps} fps` : 'N/A'}</td>
                    <td className="p-3">
                      <Badge variant="outline">{tier.useCase}</Badge>
                    </td>
                    <td className="p-3 text-green-600">{tier.bandwidth}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Demo */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Interactive Technical Demo</h2>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <Gauge className="w-3 h-3 mr-1" />
              Quality: {currentQuality.toUpperCase()}
            </Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700">
              <Zap className="w-3 h-3 mr-1" />
              {autoAdapt ? 'Auto-Adapt ON' : 'Manual Mode'}
            </Badge>
            <Button
              size="sm"
              variant={isStreaming ? "destructive" : "outline"}
              onClick={() => setIsStreaming(!isStreaming)}
            >
              {isStreaming ? (
                <>
                  <Radio className="w-4 h-4 mr-1 animate-pulse" />
                  LIVE
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-1" />
                  START
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs value={selectedDemo} onValueChange={setSelectedDemo}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="quality">Quality Manager</TabsTrigger>
            <TabsTrigger value="adaptive">Adaptive Control</TabsTrigger>
            <TabsTrigger value="monitor">Technical Monitor</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {technicalFeatures.map((feature, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{feature.category}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {feature.features.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-4">
                        <Badge className="bg-green-100 text-green-700">
                          {feature.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Technical Architecture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Globe className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="font-medium">Global CDN</div>
                          <div className="text-sm text-gray-600">12 edge locations worldwide</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Server className="w-5 h-5 text-green-600" />
                        <div>
                          <div className="font-medium">Encoding Pipeline</div>
                          <div className="text-sm text-gray-600">Real-time transcoding & optimization</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-purple-600" />
                        <div>
                          <div className="font-medium">Reliability Systems</div>
                          <div className="text-sm text-gray-600">99.9% uptime guarantee</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Network className="w-5 h-5 text-orange-600" />
                        <div>
                          <div className="font-medium">Adaptive Bitrate</div>
                          <div className="text-sm text-gray-600">Automatic quality adjustment</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Signal className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">Stream Quality</span>
                        </div>
                        <p className="text-sm text-blue-600">
                          Automatic quality optimization based on network conditions
                        </p>
                      </div>
                      
                      <div className="p-3 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Activity className="w-5 h-5 text-green-600" />
                          <span className="font-medium">Real-time Monitoring</span>
                        </div>
                        <p className="text-sm text-green-600">
                          Comprehensive technical performance tracking
                        </p>
                      </div>
                      
                      <div className="p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Zap className="w-5 h-5 text-purple-600" />
                          <span className="font-medium">Auto-optimization</span>
                        </div>
                        <p className="text-sm text-purple-600">
                          Intelligent resource allocation and performance tuning
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="quality" className="mt-6">
            <StreamingQualityManager
              currentQuality={currentQuality}
              autoAdapt={autoAdapt}
              onQualityChange={handleQualityChange}
              onAutoAdaptToggle={handleAutoAdaptToggle}
              onTechnicalTest={handleTechnicalTest}
            />
          </TabsContent>

          <TabsContent value="adaptive" className="mt-6">
            <AdaptiveQualitySelector
              currentQuality={currentQuality}
              networkCondition={{
                bandwidth: 8.5,
                latency: 45,
                packetLoss: 0.2,
                jitter: 2.1,
                stability: 'good',
                timestamp: new Date()
              }}
              deviceCapabilities={{
                type: 'desktop',
                screen: { width: 1920, height: 1080, density: 1 },
                hardware: { cpu: 'high', memory: 16, gpu: true },
                battery: { level: 85, charging: true, saver: false }
              }}
              qualityAdaptation={{
                enabled: autoAdapt,
                strategy: 'balanced',
                thresholds: { upgrade: 80, downgrade: 40, emergency: 20 },
                bufferHealth: 3.5,
                maxDrops: 5
              }}
              isStreaming={isStreaming}
              onQualityChange={handleQualityChange}
              onAdaptationChange={(adaptation) => setAutoAdapt(adaptation.enabled)}
              onNetworkTest={handleNetworkTest}
            />
          </TabsContent>

          <TabsContent value="monitor" className="mt-6">
            <StreamingTechnicalMonitor
              isLive={isStreaming}
              autoRefresh={true}
              refreshInterval={5000}
              onAlertResolve={handleAlertResolve}
              onSystemOptimize={handleSystemOptimize}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{phaseStats.qualityTiers}</div>
          <p className="text-gray-600 mt-1">Quality Tiers</p>
          <div className="text-sm text-blue-600 mt-2">Adaptive streaming</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{phaseStats.technicalMetrics}</div>
          <p className="text-gray-600 mt-1">Technical Metrics</p>
          <div className="text-sm text-green-600 mt-2">Real-time monitoring</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{phaseStats.cdnRegions}</div>
          <p className="text-gray-600 mt-1">CDN Regions</p>
          <div className="text-sm text-purple-600 mt-2">Global coverage</div>
        </div>
      </div>

      {/* Implementation Details */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🔧 Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Quality Management</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 6 quality tiers from 4K to audio-only</li>
              <li>• Adaptive bitrate streaming (ABR)</li>
              <li>• Automatic quality selection based on bandwidth</li>
              <li>• Device capability detection</li>
              <li>• Manual quality override options</li>
              <li>• Buffer health monitoring</li>
              <li>• Frame drop detection and recovery</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Technical Monitoring</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Real-time system metrics (CPU, memory, GPU)</li>
              <li>• Network performance tracking</li>
              <li>• Streaming quality indicators</li>
              <li>• CDN performance monitoring</li>
              <li>• Alert system with severity levels</li>
              <li>• Automatic issue resolution</li>
              <li>• Performance optimization recommendations</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Reliability Features</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Automatic reconnection on disconnect</li>
              <li>• Stream recovery with minimal interruption</li>
              <li>• Backup ingest servers</li>
              <li>• Error handling and fallback mechanisms</li>
              <li>• Quality degradation instead of dropping</li>
              <li>• Load balancing across servers</li>
              <li>• Cache optimization for edge delivery</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">CDN & Distribution</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Global edge server network</li>
              <li>• Intelligent routing to nearest server</li>
              <li>• Dynamic failover between regions</li>
              <li>• Cache hit rate optimization</li>
              <li>• Low-latency delivery paths</li>
              <li>• Bandwidth optimization</li>
              <li>• Multi-CDN support for redundancy</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}