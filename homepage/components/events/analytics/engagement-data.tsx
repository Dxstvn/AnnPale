'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  MessageSquare,
  HelpCircle,
  BarChart3,
  Heart,
  Users,
  Share2,
  ThumbsUp,
  Gift,
  Link,
  Activity,
  TrendingUp,
  Eye,
  Send,
  Star,
  Zap
} from 'lucide-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { cn } from '@/lib/utils';

interface EngagementMetrics {
  chatMessages: number;
  uniqueChatters: number;
  qaSubmissions: number;
  qaAnswered: number;
  pollResponses: number;
  pollParticipation: number; // percentage
  reactions: number;
  networkConnections: number;
  shares: number;
  virtualGifts: number;
}

interface EngagementTimeline {
  time: string;
  messages: number;
  reactions: number;
  questions: number;
  polls: number;
}

interface InteractionType {
  type: string;
  count: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
}

interface EngagementDataProps {
  eventId: string;
  eventTitle: string;
  metrics: EngagementMetrics;
  timeline: EngagementTimeline[];
  interactionTypes: InteractionType[];
  topParticipants?: Array<{ name: string; interactions: number; tier: string }>;
  onExportData?: () => void;
  onViewDetails?: (metric: string) => void;
}

export function EngagementData({
  eventId,
  eventTitle,
  metrics,
  timeline,
  interactionTypes,
  topParticipants = [],
  onExportData,
  onViewDetails
}: EngagementDataProps) {
  // Calculate engagement score
  const engagementScore = React.useMemo(() => {
    const weights = {
      chat: 0.25,
      qa: 0.20,
      polls: 0.20,
      reactions: 0.15,
      networking: 0.10,
      shares: 0.10
    };

    const scores = {
      chat: Math.min((metrics.chatMessages / 500) * 100, 100) * weights.chat,
      qa: Math.min((metrics.qaSubmissions / 50) * 100, 100) * weights.qa,
      polls: metrics.pollParticipation * weights.polls,
      reactions: Math.min((metrics.reactions / 200) * 100, 100) * weights.reactions,
      networking: Math.min((metrics.networkConnections / 30) * 100, 100) * weights.networking,
      shares: Math.min((metrics.shares / 20) * 100, 100) * weights.shares
    };

    return Object.values(scores).reduce((sum, score) => sum + score, 0);
  }, [metrics]);

  // Engagement level
  const getEngagementLevel = (score: number) => {
    if (score >= 80) return { level: 'Exceptional', color: 'text-green-600', badge: 'success' };
    if (score >= 60) return { level: 'High', color: 'text-blue-600', badge: 'default' };
    if (score >= 40) return { level: 'Moderate', color: 'text-yellow-600', badge: 'secondary' };
    return { level: 'Low', color: 'text-red-600', badge: 'destructive' };
  };

  const engagement = getEngagementLevel(engagementScore);

  // Radar chart data for engagement types
  const radarData = [
    { metric: 'Chat', value: Math.min((metrics.chatMessages / 500) * 100, 100) },
    { metric: 'Q&A', value: Math.min((metrics.qaSubmissions / 50) * 100, 100) },
    { metric: 'Polls', value: metrics.pollParticipation },
    { metric: 'Reactions', value: Math.min((metrics.reactions / 200) * 100, 100) },
    { metric: 'Network', value: Math.min((metrics.networkConnections / 30) * 100, 100) },
    { metric: 'Shares', value: Math.min((metrics.shares / 20) * 100, 100) }
  ];

  // Colors for charts
  const COLORS = ['#9333EA', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444'];

  return (
    <div className="space-y-6">
      {/* Engagement Score Overview */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-2">Overall Engagement Score</p>
              <div className="flex items-center gap-3">
                <p className={cn("text-4xl font-bold", engagement.color)}>
                  {engagementScore.toFixed(0)}%
                </p>
                <Badge variant={engagement.badge as any}>
                  {engagement.level}
                </Badge>
              </div>
              <Progress value={engagementScore} className="mt-3 h-2" />
            </div>
            <Activity className="h-16 w-16 text-purple-600 opacity-50" />
          </div>
        </CardContent>
      </Card>

      {/* Key Engagement Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chat Messages</p>
                <p className="text-2xl font-bold">{metrics.chatMessages}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {metrics.uniqueChatters} participants
                </p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Q&A Activity</p>
                <p className="text-2xl font-bold">{metrics.qaSubmissions}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {((metrics.qaAnswered / metrics.qaSubmissions) * 100).toFixed(0)}% answered
                </p>
              </div>
              <HelpCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Poll Responses</p>
                <p className="text-2xl font-bold">{metrics.pollResponses}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {metrics.pollParticipation}% participation
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Reactions</p>
                <p className="text-2xl font-bold">{metrics.reactions}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {metrics.virtualGifts} gifts sent
                </p>
              </div>
              <Heart className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Engagement Timeline</CardTitle>
            <Button variant="outline" size="sm" onClick={() => onViewDetails?.('timeline')}>
              <Eye className="h-4 w-4 mr-2" />
              Details
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={timeline}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="messages" stroke="#3B82F6" strokeWidth={2} name="Messages" />
              <Line type="monotone" dataKey="reactions" stroke="#EC4899" strokeWidth={2} name="Reactions" />
              <Line type="monotone" dataKey="questions" stroke="#9333EA" strokeWidth={2} name="Questions" />
              <Line type="monotone" dataKey="polls" stroke="#10B981" strokeWidth={2} name="Poll Responses" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Engagement Types Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Engagement Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar 
                  name="Engagement" 
                  dataKey="value" 
                  stroke="#9333EA" 
                  fill="#9333EA" 
                  fillOpacity={0.6} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Interaction Types */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Interaction Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {interactionTypes.map((interaction, index) => (
                <div key={interaction.type} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <div>
                      <p className="text-sm font-medium">{interaction.type}</p>
                      <p className="text-xs text-gray-600">{interaction.count} interactions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{interaction.percentage}%</Badge>
                    {interaction.trend === 'up' && <TrendingUp className="h-4 w-4 text-green-600" />}
                    {interaction.trend === 'down' && <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Social & Networking */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5" />
              Networking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{metrics.networkConnections}</p>
              <p className="text-sm text-gray-600 mt-1">New Connections</p>
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <p className="text-xs text-gray-600">Business Cards Exchanged</p>
                <p className="text-lg font-semibold">47</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Share2 className="h-5 w-5" />
              Social Shares
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{metrics.shares}</p>
              <p className="text-sm text-gray-600 mt-1">Event Shares</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Facebook</span>
                  <span className="font-medium">12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Twitter</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>LinkedIn</span>
                  <span className="font-medium">5</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Gift className="h-5 w-5" />
              Virtual Gifts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-3xl font-bold text-pink-600">{metrics.virtualGifts}</p>
              <p className="text-sm text-gray-600 mt-1">Gifts Sent</p>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>🌹 Roses</span>
                  <span className="font-medium">23</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>💎 Diamonds</span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>🎁 Gifts</span>
                  <span className="font-medium">15</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Participants */}
      {topParticipants.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Most Engaged Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topParticipants.slice(0, 5).map((participant, index) => (
                <div key={participant.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{participant.name}</p>
                      <Badge variant="secondary" className="text-xs">{participant.tier}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{participant.interactions}</p>
                    <p className="text-xs text-gray-600">interactions</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Engagement Insights */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Engagement Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm font-medium mb-1">Peak Engagement</p>
              <p className="text-xs text-gray-600">
                Highest activity at 30-45 minutes mark with {timeline[3]?.messages || 0} messages
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm font-medium mb-1">Q&A Performance</p>
              <p className="text-xs text-gray-600">
                {((metrics.qaAnswered / metrics.qaSubmissions) * 100).toFixed(0)}% response rate shows good presenter engagement
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm font-medium mb-1">Poll Participation</p>
              <p className="text-xs text-gray-600">
                {metrics.pollParticipation}% participation rate {metrics.pollParticipation > 60 ? 'exceeds' : 'below'} expectations
              </p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm font-medium mb-1">Network Effect</p>
              <p className="text-xs text-gray-600">
                {metrics.networkConnections} new connections created lasting value beyond the event
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}