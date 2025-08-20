'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { VirtualEventRoom, type VirtualEventData } from '@/components/events/virtual/virtual-event-room';
import { EventInteractionPanel } from '@/components/events/virtual/event-interaction-panel';
import { AttendeeFeaturesPanel } from '@/components/events/virtual/attendee-features';
import { EventTools } from '@/components/events/virtual/event-tools';
import { CreatorProductionTools } from '@/components/events/virtual/creator-production-tools';
import {
  Video,
  Users,
  MessageSquare,
  Gift,
  BarChart,
  Sparkles,
  Crown,
  Coffee,
  Monitor,
  Settings,
  Play,
  ArrowRight,
  Star,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';

// Sample event data
const SAMPLE_EVENT: VirtualEventData = {
  id: 'demo-event',
  title: 'Haitian Music Industry Masterclass',
  presenter: {
    name: 'Jean Baptiste',
    title: 'Grammy-Nominated Producer',
  },
  streamUrl: 'https://stream.example.com/demo',
  isLive: true,
  viewerCount: 487,
  duration: 5400, // 90 minutes
  startTime: new Date(Date.now() - 30 * 60 * 1000), // Started 30 minutes ago
  features: {
    chat: true,
    qa: true,
    polls: true,
    networking: true,
    recording: true,
    translation: true,
  },
  userTier: 'vip' as const,
};

const SAMPLE_AGENDA = [
  { id: '1', time: '7:00 PM', title: 'Welcome & Introduction', speaker: 'Host', duration: 10, isCompleted: true },
  { id: '2', time: '7:10 PM', title: 'The Evolution of Haitian Music', speaker: 'Jean Baptiste', duration: 20, isCompleted: true },
  { id: '3', time: '7:30 PM', title: 'Production Techniques', speaker: 'Jean Baptiste', duration: 30, isCurrent: true },
  { id: '4', time: '8:00 PM', title: 'Q&A Session', speaker: 'All', duration: 20 },
  { id: '5', time: '8:20 PM', title: 'Networking & Closing', speaker: 'Host', duration: 10 },
];

const SAMPLE_RESOURCES = [
  { id: '1', title: 'Presentation Slides', type: 'pdf' as const, size: '2.4 MB', url: '#', downloadable: true },
  { id: '2', title: 'Production Template', type: 'link' as const, url: '#', downloadable: true },
  { id: '3', title: 'Bonus: Behind the Scenes', type: 'video' as const, size: '145 MB', url: '#', downloadable: false },
  { id: '4', title: 'Resource Guide', type: 'pdf' as const, size: '1.1 MB', url: '#', downloadable: true },
];

const SAMPLE_ATTENDEES = [
  { 
    id: '1', 
    name: 'Marie Joseph', 
    title: 'Music Producer', 
    company: 'MJ Productions',
    tier: 'vip' as const, 
    isOnline: true,
    interests: ['Production', 'Mixing', 'Collaboration'],
    isNetworking: true
  },
  { 
    id: '2', 
    name: 'Pierre Laurent', 
    title: 'Artist Manager', 
    company: 'Laurent Entertainment',
    tier: 'platinum' as const, 
    isOnline: true,
    interests: ['Business', 'Marketing', 'Tours'],
    isNetworking: true
  },
  { 
    id: '3', 
    name: 'Sophie Dubois', 
    title: 'Singer/Songwriter',
    tier: 'general' as const, 
    isOnline: true,
    interests: ['Songwriting', 'Performance', 'Recording']
  },
  { 
    id: '4', 
    name: 'Marcus Thompson', 
    title: 'Record Label Executive',
    company: 'Caribbean Records',
    tier: 'platinum' as const, 
    isOnline: true,
    interests: ['A&R', 'Distribution', 'Partnerships'],
    isNetworking: true
  },
];

export default function Phase426Demo() {
  const [viewMode, setViewMode] = useState<'attendee' | 'creator'>('attendee');
  const [userTier, setUserTier] = useState<'general' | 'vip' | 'platinum'>('vip');
  const [chatOpen, setChatOpen] = useState(true);

  // Phase statistics
  const phaseStats = {
    components: 5,
    engagementFeatures: 12,
    tierFeatures: 8,
    productionTools: 10,
  };

  // Engagement metrics
  const engagementMetrics = [
    { feature: 'Live Polls', rate: '65%', impact: 'High' },
    { feature: 'Q&A Sessions', rate: '28%', impact: 'Very High' },
    { feature: 'Breakout Rooms', rate: '45%', impact: 'Medium' },
    { feature: 'Networking', rate: '38%', impact: 'High' },
    { feature: 'Virtual Gifts', rate: '12%', impact: 'Revenue' },
  ];

  const currentUser = {
    id: 'current-user',
    name: 'Demo User',
    title: 'Music Enthusiast',
    company: 'Ann Pale Platform',
    tier: userTier,
    isOnline: true,
    bio: 'Passionate about Haitian music and culture',
    socialLinks: {
      linkedin: 'linkedin.com',
      twitter: 'twitter.com',
      instagram: 'instagram.com',
    },
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 4.2.6: Virtual Event Experience
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Immersive virtual event platform with HD streaming, real-time interaction, 
          multi-tier experiences, and comprehensive creator production tools
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            HD Streaming
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Live Interaction
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            VIP Features
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Networking
          </span>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            Production Tools
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Analytics
          </span>
        </div>
      </div>

      {/* Live Demo Links */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">🎬 Virtual Event Platform Ready</h2>
        <p className="mb-6 text-lg opacity-90">
          Professional virtual event experience with HD streaming, real-time engagement tools, 
          tiered access features, and comprehensive production controls
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/events/live">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
            >
              <Video className="w-5 h-5 mr-2" />
              Join Live Event
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/creator/streaming">
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Monitor className="w-5 h-5 mr-2" />
              Creator Studio
            </Button>
          </Link>
        </div>
      </div>

      {/* View Mode Selector */}
      <div className="flex items-center justify-center gap-4">
        <span className="text-sm text-gray-600">View as:</span>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'attendee' ? 'default' : 'outline'}
            onClick={() => setViewMode('attendee')}
          >
            <Users className="h-4 w-4 mr-2" />
            Attendee
          </Button>
          <Button
            variant={viewMode === 'creator' ? 'default' : 'outline'}
            onClick={() => setViewMode('creator')}
          >
            <Video className="h-4 w-4 mr-2" />
            Creator
          </Button>
        </div>
        {viewMode === 'attendee' && (
          <div className="flex gap-2 ml-4">
            <Button
              size="sm"
              variant={userTier === 'general' ? 'default' : 'outline'}
              onClick={() => setUserTier('general')}
            >
              General
            </Button>
            <Button
              size="sm"
              variant={userTier === 'vip' ? 'default' : 'outline'}
              onClick={() => setUserTier('vip')}
            >
              <Sparkles className="h-3 w-3 mr-1" />
              VIP
            </Button>
            <Button
              size="sm"
              variant={userTier === 'platinum' ? 'default' : 'outline'}
              onClick={() => setUserTier('platinum')}
            >
              <Crown className="h-3 w-3 mr-1" />
              Platinum
            </Button>
          </div>
        )}
      </div>

      {/* Main Event Interface */}
      {viewMode === 'attendee' ? (
        <div className="space-y-6">
          {/* Virtual Event Room */}
          <VirtualEventRoom
            event={{ ...SAMPLE_EVENT, userTier }}
            chatOpen={chatOpen}
            onToggleChat={() => setChatOpen(!chatOpen)}
            onToggleFullscreen={() => console.log('Toggle fullscreen')}
            onChangeQuality={(quality) => console.log('Change quality:', quality)}
            onLeaveEvent={() => console.log('Leave event')}
          />

          {/* Interaction Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <EventInteractionPanel
                eventId="demo-event"
                userTier={userTier}
                onSendMessage={(msg) => console.log('Send message:', msg)}
                onSubmitQuestion={(q) => console.log('Submit question:', q)}
                onVotePoll={(pollId, optionId) => console.log('Vote:', pollId, optionId)}
                onRaiseHand={() => console.log('Raise hand')}
                onSendReaction={(reaction) => console.log('Send reaction:', reaction)}
                onSendGift={(gift) => console.log('Send gift:', gift)}
              />
            </div>
            <div className="space-y-6">
              <AttendeeFeaturesPanel
                eventId="demo-event"
                currentUser={currentUser}
                attendees={SAMPLE_ATTENDEES}
                networkingRequests={[]}
                onSendNetworkingRequest={(id) => console.log('Network with:', id)}
                onStartPrivateChat={(id) => console.log('Chat with:', id)}
                onExchangeBusinessCard={(id) => console.log('Exchange card with:', id)}
              />
              <EventTools
                eventId="demo-event"
                agenda={SAMPLE_AGENDA}
                resources={SAMPLE_RESOURCES}
                hasTranslation={true}
                availableLanguages={['English', 'French', 'Haitian Creole']}
                selectedLanguage="English"
                onChangeLanguage={(lang) => console.log('Change language:', lang)}
                onTakeScreenshot={() => console.log('Take screenshot')}
                onCreateClip={(start, end) => console.log('Create clip:', start, end)}
                onDownloadResource={(id) => console.log('Download:', id)}
                onSaveNote={(note) => console.log('Save note:', note)}
                userTier={userTier}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Creator Production Tools */}
          <CreatorProductionTools
            eventId="demo-event"
            isLive={true}
            viewerCount={487}
            streamHealth="excellent"
            streamSettings={{
              videoEnabled: true,
              audioEnabled: true,
              screenSharing: false,
              camera: 'Default Camera',
              microphone: 'Default Microphone',
              resolution: '1080p',
              bitrate: 4500,
              fps: 30,
            }}
            onToggleStream={() => console.log('Toggle stream')}
            onToggleVideo={() => console.log('Toggle video')}
            onToggleAudio={() => console.log('Toggle audio')}
            onToggleScreenShare={() => console.log('Toggle screen share')}
            onChangeCamera={(cam) => console.log('Change camera:', cam)}
            onChangeMicrophone={(mic) => console.log('Change mic:', mic)}
            onChangeSettings={(settings) => console.log('Change settings:', settings)}
            onModerateUser={(userId, action) => console.log('Moderate:', userId, action)}
            onSpotlightUser={(userId) => console.log('Spotlight:', userId)}
            onStartRecording={() => console.log('Start recording')}
            onStopRecording={() => console.log('Stop recording')}
            isRecording={false}
          />
        </div>
      )}

      {/* Engagement Mechanics */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Mechanics & Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {engagementMetrics.map((metric) => (
              <div key={metric.feature} className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-sm">{metric.feature}</h4>
                <p className="text-2xl font-bold text-purple-600 my-2">{metric.rate}</p>
                <Badge variant={
                  metric.impact === 'Very High' ? 'destructive' :
                  metric.impact === 'High' ? 'default' :
                  metric.impact === 'Revenue' ? 'success' :
                  'secondary'
                }>
                  {metric.impact}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tier Features Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Tier Features Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <h3 className="font-semibold mb-3">General Admission</h3>
              <ul className="space-y-2 text-sm text-left">
                <li>✓ HD Stream Access</li>
                <li>✓ Live Chat</li>
                <li>✓ Basic Q&A</li>
                <li>✓ Event Recording (24h)</li>
                <li className="text-gray-400">✗ Networking</li>
                <li className="text-gray-400">✗ Downloads</li>
              </ul>
            </div>
            <div className="text-center p-4 border-2 border-purple-600 rounded-lg bg-purple-50">
              <h3 className="font-semibold mb-3">
                <Sparkles className="inline h-4 w-4 mr-1" />
                VIP Experience
              </h3>
              <ul className="space-y-2 text-sm text-left">
                <li>✓ Everything in General</li>
                <li>✓ Networking Lounge</li>
                <li>✓ Priority Q&A</li>
                <li>✓ Resource Downloads</li>
                <li>✓ Recording (Lifetime)</li>
                <li>✓ Virtual Gifts</li>
              </ul>
            </div>
            <div className="text-center p-4 border-2 border-pink-600 rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
              <h3 className="font-semibold mb-3">
                <Crown className="inline h-4 w-4 mr-1" />
                Platinum Package
              </h3>
              <ul className="space-y-2 text-sm text-left">
                <li>✓ Everything in VIP</li>
                <li>✓ Backstage Access</li>
                <li>✓ 1-on-1 Meet & Greet</li>
                <li>✓ Exclusive Content</li>
                <li>✓ Green Room Access</li>
                <li>✓ Event Clips Creator</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{phaseStats.components}</div>
          <p className="text-gray-600 mt-1">Components</p>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{phaseStats.engagementFeatures}</div>
          <p className="text-gray-600 mt-1">Engagement Features</p>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{phaseStats.tierFeatures}</div>
          <p className="text-gray-600 mt-1">Tier Features</p>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">{phaseStats.productionTools}</div>
          <p className="text-gray-600 mt-1">Production Tools</p>
        </div>
      </div>

      {/* Implementation Details */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🚀 Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Virtual Event Room</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• HD video streaming with quality selector</li>
              <li>• Screen sharing and presentation tools</li>
              <li>• Multi-camera support</li>
              <li>• Picture-in-picture mode</li>
              <li>• Auto-hide controls</li>
              <li>• Connection quality indicator</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Interaction Features</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Real-time chat with reactions</li>
              <li>• Q&A with upvoting system</li>
              <li>• Live polls and surveys</li>
              <li>• Hand raising for participation</li>
              <li>• Virtual gifts (VIP/Platinum)</li>
              <li>• Private messaging</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Attendee Features</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Attendee list with tier badges</li>
              <li>• Networking lounge (VIP+)</li>
              <li>• Business card exchange</li>
              <li>• Breakout rooms</li>
              <li>• Speed networking</li>
              <li>• Social links sharing</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Creator Tools</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Stream management dashboard</li>
              <li>• Multi-layout options</li>
              <li>• Moderation controls</li>
              <li>• Recording capabilities</li>
              <li>• Analytics in real-time</li>
              <li>• Spotlight participants</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}