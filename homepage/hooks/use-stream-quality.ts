'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  VideoPlayerSettings,
  StreamPlayerState,
  VideoQuality,
  LatencyMode,
  QUALITY_SETTINGS,
  LATENCY_SETTINGS,
  DEFAULT_VIDEO_SETTINGS
} from '@/lib/types/live-viewer';

interface QualityMetrics {
  bandwidth: number; // kbps
  latency: number; // milliseconds
  packetLoss: number; // percentage
  bufferHealth: number; // seconds
  connectionStability: number; // 0-100
}

interface AdaptiveQualityConfig {
  enableAutoQuality: boolean;
  qualityChangeThreshold: number; // seconds of buffering before downgrade
  upgradeDelay: number; // milliseconds before attempting upgrade
  minStabilityForUpgrade: number; // 0-100
  maxDowngrades: number; // per session
}

interface UseStreamQualityOptions {
  streamUrl: string;
  initialSettings?: Partial<VideoPlayerSettings>;
  adaptiveConfig?: Partial<AdaptiveQualityConfig>;
  onQualityChange?: (quality: VideoQuality, reason: string) => void;
  onLatencyChange?: (latency: number) => void;
  onConnectionIssue?: (issue: string, severity: 'low' | 'medium' | 'high') => void;
}

const DEFAULT_ADAPTIVE_CONFIG: AdaptiveQualityConfig = {
  enableAutoQuality: true,
  qualityChangeThreshold: 3,
  upgradeDelay: 10000,
  minStabilityForUpgrade: 80,
  maxDowngrades: 3
};

export function useStreamQuality({
  streamUrl,
  initialSettings = {},
  adaptiveConfig = {},
  onQualityChange,
  onLatencyChange,
  onConnectionIssue
}: UseStreamQualityOptions) {
  const [settings, setSettings] = useState<VideoPlayerSettings>({
    ...DEFAULT_VIDEO_SETTINGS,
    ...initialSettings
  });

  const [playerState, setPlayerState] = useState<StreamPlayerState>({
    isPlaying: false,
    isBuffering: false,
    currentTime: 0,
    duration: 0,
    bufferedPercentage: 0,
    connectionQuality: 'good',
    latency: 5000,
    bitrate: 2500,
    droppedFrames: 0,
    fps: 30
  });

  const [metrics, setMetrics] = useState<QualityMetrics>({
    bandwidth: 0,
    latency: 5000,
    packetLoss: 0,
    bufferHealth: 0,
    connectionStability: 100
  });

  const config = { ...DEFAULT_ADAPTIVE_CONFIG, ...adaptiveConfig };
  const bufferingStartTime = useRef<number>(0);
  const lastQualityChange = useRef<number>(0);
  const downgrades = useRef<number>(0);
  const qualityUpgradeTimeout = useRef<NodeJS.Timeout>();
  const metricsInterval = useRef<NodeJS.Timeout>();
  const connectionTestInterval = useRef<NodeJS.Timeout>();

  // Monitor video element for quality metrics
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

  const setVideoElement = useCallback((element: HTMLVideoElement | null) => {
    videoElementRef.current = element;
  }, []);

  // Calculate connection quality based on metrics
  const calculateConnectionQuality = useCallback((metrics: QualityMetrics): StreamPlayerState['connectionQuality'] => {
    const { bandwidth, latency, packetLoss, connectionStability } = metrics;
    
    if (connectionStability < 50 || packetLoss > 5 || latency > 15000) {
      return 'poor';
    }
    if (connectionStability < 70 || packetLoss > 2 || latency > 10000) {
      return 'fair';
    }
    if (connectionStability < 90 || packetLoss > 0.5 || latency > 5000) {
      return 'good';
    }
    return 'excellent';
  }, []);

  // Adaptive quality adjustment
  const adjustQualityBasedOnConditions = useCallback((currentMetrics: QualityMetrics) => {
    if (!config.enableAutoQuality || settings.quality !== 'auto') return;

    const now = Date.now();
    const timeSinceLastChange = now - lastQualityChange.current;
    
    // Don't change quality too frequently
    if (timeSinceLastChange < 5000) return;

    const connectionQuality = calculateConnectionQuality(currentMetrics);
    const currentQualityIndex = getQualityIndex(getCurrentEffectiveQuality());
    
    // Downgrade if connection is poor
    if (connectionQuality === 'poor' && currentQualityIndex > 0) {
      if (downgrades.current < config.maxDowngrades) {
        const newQuality = getQualityByIndex(currentQualityIndex - 1);
        changeQuality(newQuality, 'Poor connection detected');
        downgrades.current++;
      }
    }
    
    // Upgrade if connection is stable and good
    if (connectionQuality === 'excellent' && 
        currentMetrics.connectionStability > config.minStabilityForUpgrade &&
        timeSinceLastChange > config.upgradeDelay) {
      
      if (currentQualityIndex < getMaxQualityIndex()) {
        const newQuality = getQualityByIndex(currentQualityIndex + 1);
        changeQuality(newQuality, 'Connection improved');
      }
    }
  }, [config, settings.quality, calculateConnectionQuality]);

  const getCurrentEffectiveQuality = (): VideoQuality => {
    if (settings.quality === 'auto') {
      // Return the quality we're actually using based on connection
      const quality = calculateConnectionQuality(metrics);
      switch (quality) {
        case 'excellent': return '1080p';
        case 'good': return '720p';
        case 'fair': return '480p';
        case 'poor': return 'audio';
      }
    }
    return settings.quality;
  };

  const getQualityIndex = (quality: VideoQuality): number => {
    const qualities: VideoQuality[] = ['audio', '480p', '720p', '1080p', '4k'];
    return qualities.indexOf(quality);
  };

  const getQualityByIndex = (index: number): VideoQuality => {
    const qualities: VideoQuality[] = ['audio', '480p', '720p', '1080p', '4k'];
    return qualities[Math.max(0, Math.min(index, qualities.length - 1))];
  };

  const getMaxQualityIndex = (): number => {
    return 4; // 4K is highest
  };

  const changeQuality = useCallback((quality: VideoQuality, reason: string) => {
    lastQualityChange.current = Date.now();
    onQualityChange?.(quality, reason);
  }, [onQualityChange]);

  // Simulate bandwidth testing
  const testBandwidth = useCallback(async (): Promise<number> => {
    try {
      const testUrl = `${streamUrl}?test=${Date.now()}`;
      const startTime = performance.now();
      
      const response = await fetch(testUrl, {
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // Estimate bandwidth based on response time
      const estimatedBandwidth = Math.max(500, 10000 - (duration * 10));
      return estimatedBandwidth;
    } catch (error) {
      return 1000; // Fallback bandwidth
    }
  }, [streamUrl]);

  // Test network latency
  const testLatency = useCallback(async (): Promise<number> => {
    try {
      const startTime = performance.now();
      await fetch(`${streamUrl}?ping=${Date.now()}`, { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      const endTime = performance.now();
      return endTime - startTime;
    } catch (error) {
      return 5000; // Fallback latency
    }
  }, [streamUrl]);

  // Update metrics periodically
  const updateMetrics = useCallback(async () => {
    const video = videoElementRef.current;
    if (!video) return;

    try {
      const [bandwidth, latency] = await Promise.all([
        testBandwidth(),
        testLatency()
      ]);

      // Calculate buffer health
      const bufferHealth = video.buffered.length > 0 
        ? video.buffered.end(video.buffered.length - 1) - video.currentTime
        : 0;

      // Simulate packet loss and stability based on performance
      const packetLoss = Math.max(0, (latency - 1000) / 10000 * 5);
      const connectionStability = Math.max(0, 100 - (latency / 100) - (packetLoss * 10));

      const newMetrics: QualityMetrics = {
        bandwidth,
        latency,
        packetLoss,
        bufferHealth,
        connectionStability
      };

      setMetrics(newMetrics);

      // Update player state
      setPlayerState(prev => ({
        ...prev,
        connectionQuality: calculateConnectionQuality(newMetrics),
        latency,
        bitrate: bandwidth,
        bufferHealth
      }));

      // Adjust quality if needed
      adjustQualityBasedOnConditions(newMetrics);

      // Notify about latency changes
      onLatencyChange?.(latency);

      // Check for connection issues
      if (connectionStability < 50) {
        onConnectionIssue?.('Unstable connection detected', 'high');
      } else if (packetLoss > 2) {
        onConnectionIssue?.('High packet loss detected', 'medium');
      } else if (latency > 10000) {
        onConnectionIssue?.('High latency detected', 'medium');
      }

    } catch (error) {
      console.error('Failed to update metrics:', error);
    }
  }, [testBandwidth, testLatency, calculateConnectionQuality, adjustQualityBasedOnConditions, onLatencyChange, onConnectionIssue]);

  // Handle buffering events
  const handleBufferingStart = useCallback(() => {
    bufferingStartTime.current = Date.now();
    setPlayerState(prev => ({ ...prev, isBuffering: true }));
  }, []);

  const handleBufferingEnd = useCallback(() => {
    const bufferingDuration = Date.now() - bufferingStartTime.current;
    setPlayerState(prev => ({ ...prev, isBuffering: false }));

    // If buffering was too long, consider quality downgrade
    if (bufferingDuration > config.qualityChangeThreshold * 1000 && 
        settings.quality === 'auto') {
      adjustQualityBasedOnConditions(metrics);
    }
  }, [config.qualityChangeThreshold, settings.quality, adjustQualityBasedOnConditions, metrics]);

  // Settings change handler
  const updateSettings = useCallback((newSettings: Partial<VideoPlayerSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      
      // Reset adaptive quality tracking if manual quality selected
      if (newSettings.quality && newSettings.quality !== 'auto') {
        downgrades.current = 0;
        lastQualityChange.current = Date.now();
      }
      
      return updated;
    });
  }, []);

  // Player state change handler
  const updatePlayerState = useCallback((newState: Partial<StreamPlayerState>) => {
    setPlayerState(prev => ({ ...prev, ...newState }));
  }, []);

  // Start/stop monitoring
  useEffect(() => {
    if (playerState.isPlaying) {
      // Start metrics monitoring
      metricsInterval.current = setInterval(updateMetrics, 5000);
      connectionTestInterval.current = setInterval(updateMetrics, 30000);
    } else {
      // Stop monitoring
      if (metricsInterval.current) {
        clearInterval(metricsInterval.current);
      }
      if (connectionTestInterval.current) {
        clearInterval(connectionTestInterval.current);
      }
    }

    return () => {
      if (metricsInterval.current) {
        clearInterval(metricsInterval.current);
      }
      if (connectionTestInterval.current) {
        clearInterval(connectionTestInterval.current);
      }
    };
  }, [playerState.isPlaying, updateMetrics]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (qualityUpgradeTimeout.current) {
        clearTimeout(qualityUpgradeTimeout.current);
      }
    };
  }, []);

  // Get recommended settings based on connection
  const getRecommendedSettings = useCallback(() => {
    const connectionQuality = calculateConnectionQuality(metrics);
    
    const recommendations: Partial<VideoPlayerSettings> = {};
    
    switch (connectionQuality) {
      case 'poor':
        recommendations.quality = 'audio';
        recommendations.latencyMode = 'reduced-data';
        break;
      case 'fair':
        recommendations.quality = '480p';
        recommendations.latencyMode = 'normal';
        break;
      case 'good':
        recommendations.quality = '720p';
        recommendations.latencyMode = 'low';
        break;
      case 'excellent':
        recommendations.quality = '1080p';
        recommendations.latencyMode = 'ultra-low';
        break;
    }
    
    return recommendations;
  }, [calculateConnectionQuality, metrics]);

  return {
    settings,
    playerState,
    metrics,
    updateSettings,
    updatePlayerState,
    setVideoElement,
    handleBufferingStart,
    handleBufferingEnd,
    getCurrentEffectiveQuality,
    getRecommendedSettings,
    testBandwidth,
    testLatency,
    downgrades: downgrades.current
  };
}