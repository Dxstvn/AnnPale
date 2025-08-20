'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedChatSystem } from '@/components/chat-moderation/enhanced-chat-system';
import {
  Shield,
  MessageSquare,
  Users,
  Ban,
  Clock,
  Flag,
  Filter,
  Crown,
  Star,
  Heart,
  Zap,
  Settings,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Eye,
  Target,
  Award,
  Sparkles,
  Radio,
  Timer,
  Volume2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Phase415Demo() {
  const [selectedModerationLevel, setSelectedModerationLevel] = useState('automated');
  const [demoUserRole, setDemoUserRole] = useState<'viewer' | 'moderator' | 'creator'>('creator');

  // Mock data for demo
  const mockMessages = [
    {
      id: '1',
      userId: 'user1',
      username: 'haiti_music_fan',
      displayName: 'Haiti Music Fan',
      avatar: '/api/placeholder/40/40',
      message: 'This kompa performance is amazing! 🎵',
      timestamp: new Date(Date.now() - 120000),
      type: 'message' as const,
      badges: ['follower'],
      mentions: [],
      emotes: [{ id: '1', name: 'music', url: '/emote1.png' }],
      isModerated: false,
      isPinned: false,
      isHighlighted: false,
      reactions: { heart: 5, fire: 3 }
    },
    {
      id: '2',
      userId: 'user2',
      username: 'super_supporter',
      displayName: 'Super Supporter',
      message: 'Keep up the great work!',
      timestamp: new Date(Date.now() - 60000),
      type: 'super-chat' as const,
      badges: ['subscriber', 'vip'],
      mentions: [],
      emotes: [],
      isModerated: false,
      isPinned: true,
      isHighlighted: true,
      amount: 25,
      color: '#FFD700',
      reactions: { heart: 12, clap: 8 }
    },
    {
      id: '3',
      userId: 'user3',
      username: 'new_viewer',
      displayName: 'New Viewer',
      message: 'Hi everyone! Love this stream',
      timestamp: new Date(Date.now() - 30000),
      type: 'welcome' as const,
      badges: [],
      mentions: [],
      emotes: [],
      isModerated: false,
      isPinned: false,
      isHighlighted: false,
      reactions: { wave: 2 }
    }
  ];

  const mockUsers = [
    {
      id: 'user1',
      username: 'haiti_music_fan',
      displayName: 'Haiti Music Fan',
      avatar: '/api/placeholder/40/40',
      badges: ['follower'],
      isFollowing: true,
      isSubscribed: false,
      isModerator: false,
      isVip: false,
      joinedDate: new Date('2024-01-15'),
      messageCount: 45,
      timeouts: 0,
      lastMessage: new Date(Date.now() - 120000)
    },
    {
      id: 'user2',
      username: 'super_supporter',
      displayName: 'Super Supporter',
      badges: ['subscriber', 'vip'],
      isFollowing: true,
      isSubscribed: true,
      isModerator: false,
      isVip: true,
      joinedDate: new Date('2023-12-01'),
      messageCount: 234,
      timeouts: 0,
      lastMessage: new Date(Date.now() - 60000)
    },
    {
      id: 'mod1',
      username: 'chat_mod',
      displayName: 'Chat Moderator',
      badges: ['moderator'],
      isFollowing: true,
      isSubscribed: true,
      isModerator: true,
      isVip: false,
      joinedDate: new Date('2023-11-01'),
      messageCount: 89,
      timeouts: 0,
      lastMessage: new Date(Date.now() - 300000)
    }
  ];

  const mockSettings = {
    profanityFilter: true,
    spamDetection: true,
    linkBlocking: true,
    repetitionLimits: true,
    rateLimiting: true,
    slowMode: false,
    slowModeDelay: 30,
    followersOnly: false,
    subscribersOnly: false,
    wordBlacklist: ['spam', 'scam'],
    autoModeration: true,
    chatDelay: 0,
    maxMessageLength: 500,
    allowEmotes: true,
    allowMedia: false,
    allowMentions: true,
    allowLinks: false
  };

  const mockModerationActions = [
    {
      id: '1',
      type: 'timeout' as const,
      userId: 'user4',
      reason: 'Excessive spam',
      duration: 300,
      moderatorId: 'mod1',
      timestamp: new Date(Date.now() - 600000)
    },
    {
      id: '2',
      type: 'delete' as const,
      userId: 'user5',
      messageId: 'msg123',
      reason: 'Inappropriate content',
      moderatorId: 'creator1',
      timestamp: new Date(Date.now() - 300000)
    }
  ];

  const chatFeatures = [
    {
      feature: 'Standard Messages',
      purpose: 'Basic communication',
      userLevel: 'All',
      moderationImpact: 'Auto-filtered',
      color: 'blue'
    },
    {
      feature: 'Emotes/Stickers',
      purpose: 'Expression',
      userLevel: 'All',
      moderationImpact: 'Pre-approved',
      color: 'yellow'
    },
    {
      feature: 'Super Chat',
      purpose: 'Paid highlighting',
      userLevel: 'Paying',
      moderationImpact: 'Priority review',
      color: 'green'
    },
    {
      feature: 'Mentions',
      purpose: 'Direct attention',
      userLevel: 'Followers',
      moderationImpact: 'Notification',
      color: 'purple'
    },
    {
      feature: 'Links',
      purpose: 'Resource sharing',
      userLevel: 'Trusted',
      moderationImpact: 'Auto-blocked default',
      color: 'orange'
    },
    {
      feature: 'Media',
      purpose: 'Image sharing',
      userLevel: 'Subscribers',
      moderationImpact: 'Manual approval',
      color: 'pink'
    }
  ];

  const moderationHierarchy = [
    {
      level: 'Automated Filters',
      tools: ['Profanity filter', 'Spam detection', 'Link blocking', 'Repetition limits', 'Rate limiting'],
      icon: Filter,
      color: 'blue'
    },
    {
      level: 'Creator Controls',
      tools: ['Slow mode', 'Followers-only', 'Subscriber-only', 'Word blacklist', 'User blocking'],
      icon: Crown,
      color: 'purple'
    },
    {
      level: 'Moderator Actions',
      tools: ['Delete messages', 'Timeout users', 'Ban users', 'Pin messages', 'Clear chat'],
      icon: Shield,
      color: 'green'
    },
    {
      level: 'Platform Safety',
      tools: ['AI monitoring', 'Report system', 'Appeal process', 'Safety team'],
      icon: AlertTriangle,
      color: 'red'
    }
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 4.1.5: Live Chat & Moderation System
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Foster positive community interaction while protecting creators and viewers 
          from harmful content through comprehensive chat architecture and safety tools.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Chat Architecture
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Safety Tools
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Auto Moderation
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Creator Controls
          </span>
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            Community Building
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Engagement Tools
          </span>
        </div>
      </div>

      {/* Live Demo Link */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">💬 Enhanced Chat System Available</h2>
        <p className="mb-6 text-lg opacity-90">
          Experience the complete chat and moderation system with real-time filtering, 
          community management tools, and comprehensive safety features
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/live/demo-stream">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
            >
              <MessageSquare className="w-5 h-5 mr-2" />
              Try Live Chat
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/creator/streaming">
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Shield className="w-5 h-5 mr-2" />
              Creator Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Chat System Features Table */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Chat System Features Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Feature</th>
                <th className="text-left p-3">Purpose</th>
                <th className="text-left p-3">User Level</th>
                <th className="text-left p-3">Moderation Impact</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {chatFeatures.map((feature, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{feature.feature}</td>
                  <td className="p-3">{feature.purpose}</td>
                  <td className="p-3">
                    <Badge className={`bg-${feature.color}-100 text-${feature.color}-700`}>
                      {feature.userLevel}
                    </Badge>
                  </td>
                  <td className="p-3">{feature.moderationImpact}</td>
                  <td className="p-3">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Moderation Hierarchy */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">4-Tier Moderation Hierarchy</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {moderationHierarchy.map((level, index) => (
            <div
              key={index}
              className={cn(
                'p-4 rounded-lg border-2 cursor-pointer transition-all',
                selectedModerationLevel === level.level.toLowerCase().replace(' ', '-')
                  ? `border-${level.color}-500 bg-${level.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              )}
              onClick={() => setSelectedModerationLevel(level.level.toLowerCase().replace(' ', '-'))}
            >
              <div className="text-center space-y-3">
                <div className={`w-12 h-12 bg-${level.color}-100 rounded-full flex items-center justify-center mx-auto`}>
                  <level.icon className={`w-6 h-6 text-${level.color}-600`} />
                </div>
                <h3 className="font-semibold">{level.level}</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  {level.tools.map((tool, toolIndex) => (
                    <li key={toolIndex}>• {tool}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Demo */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Interactive Chat Demo</h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">View as:</span>
            <select
              value={demoUserRole}
              onChange={(e) => setDemoUserRole(e.target.value as any)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="viewer">Viewer</option>
              <option value="moderator">Moderator</option>
              <option value="creator">Creator</option>
            </select>
          </div>
        </div>

        <EnhancedChatSystem
          messages={mockMessages}
          users={mockUsers}
          settings={mockSettings}
          moderationActions={mockModerationActions}
          onSendMessage={(message) => console.log('Send message:', message)}
          onModerateMessage={(messageId, action, reason) => console.log('Moderate message:', messageId, action, reason)}
          onModerateUser={(userId, action, duration, reason) => console.log('Moderate user:', userId, action, duration, reason)}
          onUpdateSettings={(settings) => console.log('Update settings:', settings)}
          userRole={demoUserRole}
        />
      </div>

      {/* Engagement Strategies */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Engagement Mechanics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-600" />
              Engagement Mechanics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium">Welcome Messages</span>
                </div>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Regular Viewer Badges</span>
                </div>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Loyalty Rewards</span>
                </div>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Chat Games</span>
                </div>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium">Q&A Highlighting</span>
                </div>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Building */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Community Building
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium">Subscriber Emotes</span>
                </div>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium">Custom Commands</span>
                </div>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium">Inside Jokes</span>
                </div>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium">Regular Events</span>
                </div>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
              
              <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-pink-600" />
                  <span className="text-sm font-medium">Fan Recognition</span>
                </div>
                <CheckCircle className="w-4 h-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety & Trust Features */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Safety & Trust Framework</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* AI Monitoring */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Eye className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold">AI Monitoring</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Real-time content analysis</li>
              <li>• Pattern recognition</li>
              <li>• Threat detection</li>
              <li>• Behavioral analysis</li>
            </ul>
          </div>

          {/* Report System */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <Flag className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="font-semibold">Report System</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• One-click reporting</li>
              <li>• Category classification</li>
              <li>• Evidence collection</li>
              <li>• Priority escalation</li>
            </ul>
          </div>

          {/* Appeal Process */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold">Appeal Process</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Fair review system</li>
              <li>• Human oversight</li>
              <li>• Transparent decisions</li>
              <li>• Account restoration</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">4</div>
          <p className="text-gray-600 mt-1">Moderation Tiers</p>
          <div className="text-sm text-purple-600 mt-2">Comprehensive coverage</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">15+</div>
          <p className="text-gray-600 mt-1">Safety Tools</p>
          <div className="text-sm text-blue-600 mt-2">Advanced protection</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">Real-time</div>
          <p className="text-gray-600 mt-1">AI Monitoring</p>
          <div className="text-sm text-green-600 mt-2">Instant response</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">100%</div>
          <p className="text-gray-600 mt-1">Community Safe</p>
          <div className="text-sm text-orange-600 mt-2">Protected environment</div>
        </div>
      </div>

      {/* Implementation Features */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Chat Architecture</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Real-time messaging with WebSocket support</li>
              <li>• Message threading and reply system</li>
              <li>• Emoji and custom emote integration</li>
              <li>• Rich media support (images, GIFs, videos)</li>
              <li>• Super Chat with payment integration</li>
              <li>• User mentions and notifications</li>
              <li>• Message history and search</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Safety & Moderation</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• AI-powered content filtering</li>
              <li>• Automated spam and abuse detection</li>
              <li>• Customizable word blacklists</li>
              <li>• Rate limiting and slow mode</li>
              <li>• User timeout and ban system</li>
              <li>• Message deletion and pinning</li>
              <li>• Moderator role management</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Engagement Tools</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Welcome messages for new viewers</li>
              <li>• Loyalty badges and recognition</li>
              <li>• Interactive polls and Q&A</li>
              <li>• Chat games and trivia</li>
              <li>• Subscriber-only features</li>
              <li>• Custom chat commands</li>
              <li>• Celebration animations</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Creator Controls</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Followers-only and subscribers-only modes</li>
              <li>• Customizable moderation settings</li>
              <li>• Chat analytics and insights</li>
              <li>• Moderator appointment system</li>
              <li>• Emergency chat clearing</li>
              <li>• User profile and history</li>
              <li>• Appeal and review system</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}