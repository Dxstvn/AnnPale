'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ViewerEngagement, EngagementLevel, ViewerPersona } from '@/lib/types/live-streaming';

interface EngagementAction {
  type: 'reaction' | 'message' | 'tip' | 'share' | 'join' | 'leave';
  timestamp: Date;
  value?: number;
}

interface UseEngagementTrackingOptions {
  streamId: string;
  userId: string;
  autoDetectPersona?: boolean;
}

export function useEngagementTracking({
  streamId,
  userId,
  autoDetectPersona = true
}: UseEngagementTrackingOptions) {
  const [engagement, setEngagement] = useState<ViewerEngagement>({
    userId,
    streamId,
    engagementLevel: 1,
    watchTime: 0,
    interactions: {
      reactions: 0,
      messages: 0,
      tips: 0,
      shares: 0
    },
    joinedAt: new Date()
  });

  const [actions, setActions] = useState<EngagementAction[]>([]);
  const watchTimeInterval = useRef<NodeJS.Timeout>();
  const startTime = useRef<Date>(new Date());

  const calculateEngagementLevel = useCallback((interactions: ViewerEngagement['interactions']): EngagementLevel => {
    const { reactions, messages, tips, shares } = interactions;
    
    if (tips > 0 || shares > 0) return 5;
    if (messages > 2) return 4;
    if (messages > 0) return 3;
    if (reactions > 0) return 2;
    return 1;
  }, []);

  const detectPersona = useCallback((
    actions: EngagementAction[],
    watchTime: number
  ): ViewerPersona | undefined => {
    const tipCount = actions.filter(a => a.type === 'tip').length;
    const messageCount = actions.filter(a => a.type === 'message').length;
    const shareCount = actions.filter(a => a.type === 'share').length;
    const engagementRate = (messageCount + tipCount + shareCount) / Math.max(1, watchTime / 60);

    if (tipCount > 5 && engagementRate > 0.5) return 'super-fan';
    if (tipCount > 0 && messageCount > 3) return 'supporter';
    if (shareCount > 0) return 'discoverer';
    if (watchTime < 300 && tipCount === 0) return 'casual-viewer';
    
    return undefined;
  }, []);

  const trackAction = useCallback((action: Omit<EngagementAction, 'timestamp'>) => {
    const newAction: EngagementAction = {
      ...action,
      timestamp: new Date()
    };
    
    setActions(prev => [...prev, newAction]);
    
    setEngagement(prev => {
      const updated = { ...prev };
      
      switch (action.type) {
        case 'reaction':
          updated.interactions.reactions++;
          break;
        case 'message':
          updated.interactions.messages++;
          break;
        case 'tip':
          updated.interactions.tips++;
          updated.interactions.reactions++;
          break;
        case 'share':
          updated.interactions.shares++;
          break;
        case 'leave':
          updated.leftAt = new Date();
          break;
      }
      
      updated.engagementLevel = calculateEngagementLevel(updated.interactions);
      
      if (autoDetectPersona && !updated.persona) {
        updated.persona = detectPersona(actions, updated.watchTime);
      }
      
      return updated;
    });
  }, [actions, autoDetectPersona, calculateEngagementLevel, detectPersona]);

  const updateWatchTime = useCallback(() => {
    setEngagement(prev => ({
      ...prev,
      watchTime: Math.floor((Date.now() - startTime.current.getTime()) / 1000)
    }));
  }, []);

  useEffect(() => {
    watchTimeInterval.current = setInterval(updateWatchTime, 1000);
    
    return () => {
      if (watchTimeInterval.current) {
        clearInterval(watchTimeInterval.current);
      }
      trackAction({ type: 'leave' });
    };
  }, [updateWatchTime, trackAction]);

  const getEngagementSummary = useCallback(() => {
    return {
      level: engagement.engagementLevel,
      levelName: ['Watching', 'Reacting', 'Participating', 'Contributing', 'Advocating'][engagement.engagementLevel - 1],
      persona: engagement.persona,
      totalInteractions: Object.values(engagement.interactions).reduce((a, b) => a + b, 0),
      engagementScore: (
        engagement.interactions.reactions * 1 +
        engagement.interactions.messages * 3 +
        engagement.interactions.tips * 10 +
        engagement.interactions.shares * 5
      ) / Math.max(1, engagement.watchTime / 60),
      isActive: !engagement.leftAt
    };
  }, [engagement]);

  return {
    engagement,
    actions,
    trackAction,
    getEngagementSummary,
    updateWatchTime
  };
}