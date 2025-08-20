'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EngagementPyramid } from '@/components/streaming/engagement-pyramid';
import { ViewerPersonaCard } from '@/components/streaming/viewer-persona-card';
import { StreamAnalyticsDashboard } from '@/components/streaming/stream-analytics-dashboard';
import { CreatorMotivationDashboard } from '@/components/streaming/creator-motivation-dashboard';
import { EngagementPrompts } from '@/components/streaming/engagement-prompts';
import { ViewerEngagementIndicator } from '@/components/streaming/viewer-engagement-indicator';
import { EngagementRewards } from '@/components/streaming/engagement-rewards';
import { useEngagementTracking } from '@/hooks/use-engagement-tracking';
import { ViewerPersona, VIEWER_PERSONAS, StreamAnalytics } from '@/lib/types/live-streaming';

export default function StreamingAnalyticsPage() {
  const [selectedPersona, setSelectedPersona] = useState<ViewerPersona>('casual-viewer');
  const [currentEngagementLevel, setCurrentEngagementLevel] = useState(2);

  const { engagement, trackAction, getEngagementSummary } = useEngagementTracking({
    streamId: 'demo-stream',
    userId: 'demo-user'
  });

  const mockAnalytics: StreamAnalytics = {
    streamId: 'demo-stream',
    creatorId: 'demo-creator',
    startTime: new Date(Date.now() - 3600000),
    metrics: {
      viewerCount: 234,
      peakViewers: 412,
      averageWatchTime: 1800,
      engagementRate: 67.5,
      chatMessages: 1234,
      reactions: 5678,
      tips: 45,
      newFollowers: 89,
      returningViewers: 156,
      shareCount: 23
    },
    viewerEngagements: [],
    peakMoments: [
      {
        timestamp: new Date(Date.now() - 2400000),
        viewerCount: 412,
        event: 'Special announcement'
      },
      {
        timestamp: new Date(Date.now() - 1200000),
        viewerCount: 387,
        event: 'Q&A session started'
      }
    ],
    revenue: {
      tips: 245,
      gifts: 180,
      subscriptions: 120,
      total: 545
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Live Streaming Analytics & Psychology
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Phase 4.1.1 - Understanding viewer engagement and creator motivations
        </p>
      </div>

      <Tabs defaultValue="pyramid" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pyramid">Engagement Pyramid</TabsTrigger>
          <TabsTrigger value="personas">Viewer Personas</TabsTrigger>
          <TabsTrigger value="analytics">Stream Analytics</TabsTrigger>
          <TabsTrigger value="creator">Creator Dashboard</TabsTrigger>
        </TabsList>

        <TabsContent value="pyramid" className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Engagement Pyramid Model</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Understanding the five levels of viewer engagement helps creators design
              experiences that move viewers up the pyramid.
            </p>
          </div>
          
          <EngagementPyramid
            currentLevel={currentEngagementLevel}
            interactive={true}
          />

          <div className="flex justify-center gap-4">
            <ViewerEngagementIndicator
              level={currentEngagementLevel as any}
              score={engagement.interactions.reactions * 1 + engagement.interactions.messages * 3}
              streak={3}
              className="max-w-md"
            />
          </div>
        </TabsContent>

        <TabsContent value="personas" className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Viewer Persona Types</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Different viewer personas have unique motivations and behaviors. 
              Understanding these helps tailor the streaming experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(Object.keys(VIEWER_PERSONAS) as ViewerPersona[]).map((persona) => (
              <ViewerPersonaCard
                key={persona}
                persona={persona}
                isActive={selectedPersona === persona}
                onClick={() => setSelectedPersona(persona)}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Real-Time Stream Analytics</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Comprehensive analytics dashboard showing engagement metrics, 
              viewer distribution, and revenue performance.
            </p>
          </div>

          <StreamAnalyticsDashboard
            analytics={mockAnalytics}
            isLive={true}
          />
        </TabsContent>

        <TabsContent value="creator" className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Creator Motivation Center</h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Align your streaming strategy with your primary goals and get 
              personalized recommendations for success.
            </p>
          </div>

          <CreatorMotivationDashboard />
        </TabsContent>
      </Tabs>

      <div className="fixed bottom-0 right-0 p-4 space-y-4">
        <EngagementPrompts
          currentLevel={currentEngagementLevel as any}
          viewerCount={234}
          isFirstTime={true}
          onAction={(type) => {
            trackAction({ type: type as any });
            if (type === 'message') setCurrentEngagementLevel(3);
            if (type === 'tip') setCurrentEngagementLevel(4);
          }}
        />
      </div>

      <div className="mt-8">
        <EngagementRewards
          viewerScore={75}
          watchTime={1800}
          interactions={engagement.interactions}
        />
      </div>
    </div>
  );
}