'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users,
  MessageSquare,
  Heart,
  Award,
  Calendar,
  Video,
  Coffee,
  Handshake,
  Star,
  Share2,
  Gift,
  Trophy,
  Crown,
  Target,
  TrendingUp,
  UserPlus,
  MessageCircle,
  Bell,
  Mail,
  Zap,
  Sparkles,
  Network,
  Plus
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { cn } from '@/lib/utils';

interface CommunityFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  participants?: number;
  engagement?: number;
  icon: React.ElementType;
}

interface CommunityMember {
  id: string;
  name: string;
  avatar: string;
  role: 'creator' | 'moderator' | 'member' | 'vip';
  joinDate: Date;
  contributions: number;
  level: number;
  badges: string[];
}

interface CommunityEvent {
  id: string;
  title: string;
  type: 'meetup' | 'workshop' | 'social' | 'networking';
  date: Date;
  participants: number;
  status: 'upcoming' | 'live' | 'completed';
}

interface CommunityBuildingProps {
  seriesTitle?: string;
  expectedParticipants?: number;
  onSaveCommunity?: (community: any) => void;
  onCreateEvent?: (event: CommunityEvent) => void;
}

export function CommunityBuilding({
  seriesTitle = "Haitian Culture & Heritage Series",
  expectedParticipants = 500,
  onSaveCommunity,
  onCreateEvent
}: CommunityBuildingProps) {
  const [communityName, setCommunityName] = React.useState(`${seriesTitle} Community`);
  const [communityDescription, setCommunityDescription] = React.useState("A vibrant community celebrating Haitian culture and connecting diaspora members worldwide");
  const [guidelines, setGuidelines] = React.useState([
    "Respect all community members",
    "Share knowledge and experiences",
    "Support each other's growth",
    "Celebrate our culture together"
  ]);
  const [newGuideline, setNewGuideline] = React.useState('');

  // Community features
  const [features, setFeatures] = React.useState<CommunityFeature[]>([
    {
      id: 'discussion-forum',
      name: 'Discussion Forum',
      description: 'Dedicated space for ongoing conversations',
      enabled: true,
      participants: 350,
      engagement: 85,
      icon: MessageSquare
    },
    {
      id: 'networking-hub',
      name: 'Networking Hub',
      description: 'Connect members based on interests and location',
      enabled: true,
      participants: 200,
      engagement: 72,
      icon: Network
    },
    {
      id: 'virtual-meetups',
      name: 'Virtual Meetups',
      description: 'Regular informal video gatherings',
      enabled: true,
      participants: 80,
      engagement: 95,
      icon: Video
    },
    {
      id: 'resource-library',
      name: 'Resource Library',
      description: 'Shared collection of cultural resources',
      enabled: true,
      participants: 420,
      engagement: 60,
      icon: Award
    },
    {
      id: 'mentorship',
      name: 'Mentorship Program',
      description: 'Pair experienced members with newcomers',
      enabled: false,
      participants: 40,
      engagement: 90,
      icon: Handshake
    },
    {
      id: 'events-calendar',
      name: 'Community Calendar',
      description: 'Track cultural events and celebrations',
      enabled: true,
      participants: 300,
      engagement: 70,
      icon: Calendar
    }
  ]);

  // Sample community members
  const topMembers: CommunityMember[] = [
    {
      id: '1',
      name: 'Marie Delacroix',
      avatar: '👩🏾‍🏫',
      role: 'moderator',
      joinDate: new Date('2024-01-15'),
      contributions: 89,
      level: 8,
      badges: ['Cultural Expert', 'Helper', 'Early Adopter']
    },
    {
      id: '2',
      name: 'Jean-Baptiste Pierre',
      avatar: '👨🏾‍🎨',
      role: 'vip',
      joinDate: new Date('2024-02-01'),
      contributions: 156,
      level: 12,
      badges: ['Art Specialist', 'Community Leader', 'Top Contributor']
    },
    {
      id: '3',
      name: 'Sophia Laurent',
      avatar: '👩🏾‍💼',
      role: 'member',
      joinDate: new Date('2024-03-10'),
      contributions: 34,
      level: 4,
      badges: ['Rising Star', 'Active Participant']
    },
    {
      id: '4',
      name: 'Marcus Thompson',
      avatar: '👨🏾‍💻',
      role: 'member',
      joinDate: new Date('2024-04-05'),
      contributions: 67,
      level: 6,
      badges: ['Tech Enthusiast', 'Helpful Member']
    }
  ];

  // Community events
  const [communityEvents, setCommunityEvents] = React.useState<CommunityEvent[]>([
    {
      id: '1',
      title: 'Coffee Chat: Haitian Cuisine',
      type: 'social',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      participants: 25,
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Music Workshop: Traditional Rhythms',
      type: 'workshop',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      participants: 40,
      status: 'upcoming'
    },
    {
      id: '3',
      title: 'Virtual Heritage Tour',
      type: 'meetup',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      participants: 60,
      status: 'upcoming'
    }
  ]);

  // Engagement metrics
  const engagementData = [
    { month: 'Jan', members: 120, posts: 45, events: 3 },
    { month: 'Feb', members: 180, posts: 78, events: 5 },
    { month: 'Mar', members: 250, posts: 124, events: 8 },
    { month: 'Apr', members: 320, posts: 156, events: 12 },
    { month: 'May', members: 420, posts: 189, events: 15 },
    { month: 'Jun', members: 500, posts: 234, events: 18 }
  ];

  // Role distribution
  const roleDistribution = [
    { role: 'Members', count: 450, color: '#9333EA' },
    { role: 'VIP', count: 35, color: '#EC4899' },
    { role: 'Moderators', count: 12, color: '#3B82F6' },
    { role: 'Creators', count: 3, color: '#10B981' }
  ];

  const handleToggleFeature = (featureId: string) => {
    setFeatures(features.map(feature => 
      feature.id === featureId 
        ? { ...feature, enabled: !feature.enabled }
        : feature
    ));
  };

  const handleAddGuideline = () => {
    if (newGuideline && !guidelines.includes(newGuideline)) {
      setGuidelines([...guidelines, newGuideline]);
      setNewGuideline('');
    }
  };

  const handleRemoveGuideline = (index: number) => {
    setGuidelines(guidelines.filter((_, i) => i !== index));
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'creator': return Crown;
      case 'moderator': return Award;
      case 'vip': return Star;
      default: return Users;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'creator': return 'default';
      case 'moderator': return 'secondary';
      case 'vip': return 'destructive';
      default: return 'outline';
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'meetup': return Users;
      case 'workshop': return Award;
      case 'social': return Coffee;
      case 'networking': return Handshake;
      default: return Calendar;
    }
  };

  // Calculate community health score
  const communityHealth = React.useMemo(() => {
    const activeFeatures = features.filter(f => f.enabled).length;
    const avgEngagement = features.reduce((sum, f) => sum + (f.engagement || 0), 0) / features.length;
    const memberGrowth = 85; // Mock growth percentage
    
    return {
      overall: ((activeFeatures / features.length) * 30 + (avgEngagement / 100) * 40 + (memberGrowth / 100) * 30),
      features: (activeFeatures / features.length) * 100,
      engagement: avgEngagement,
      growth: memberGrowth
    };
  }, [features]);

  return (
    <div className="space-y-6">
      {/* Community Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Community Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Community Name</Label>
            <Input
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              placeholder="Enter community name..."
              className="mt-1"
            />
          </div>

          <div>
            <Label>Community Description</Label>
            <Textarea
              value={communityDescription}
              onChange={(e) => setCommunityDescription(e.target.value)}
              placeholder="Describe your community's purpose and values..."
              rows={3}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Community Guidelines</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={newGuideline}
                onChange={(e) => setNewGuideline(e.target.value)}
                placeholder="Add a community guideline..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddGuideline()}
              />
              <Button onClick={handleAddGuideline}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2 mt-2">
              {guidelines.map((guideline, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{guideline}</span>
                  <button
                    onClick={() => handleRemoveGuideline(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Health Score */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Community Health Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">{communityHealth.overall.toFixed(0)}</p>
              <p className="text-sm text-gray-600">Overall Health</p>
              <Progress value={communityHealth.overall} className="mt-2" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{communityHealth.features.toFixed(0)}%</p>
              <p className="text-sm text-gray-600">Features Active</p>
              <Progress value={communityHealth.features} className="mt-2" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{communityHealth.engagement.toFixed(0)}%</p>
              <p className="text-sm text-gray-600">Avg Engagement</p>
              <Progress value={communityHealth.engagement} className="mt-2" />
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{communityHealth.growth.toFixed(0)}%</p>
              <p className="text-sm text-gray-600">Growth Rate</p>
              <Progress value={communityHealth.growth} className="mt-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Community Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.id}
                  className={cn(
                    "p-4 border rounded-lg transition-all",
                    feature.enabled ? "border-purple-200 bg-purple-50" : "border-gray-200"
                  )}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        feature.enabled ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-600"
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium">{feature.name}</h3>
                        <p className="text-sm text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={feature.enabled}
                      onCheckedChange={() => handleToggleFeature(feature.id)}
                    />
                  </div>
                  
                  {feature.enabled && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 bg-white rounded">
                        <p className="text-lg font-bold">{feature.participants}</p>
                        <p className="text-xs text-gray-600">Participants</p>
                      </div>
                      <div className="text-center p-2 bg-white rounded">
                        <p className="text-lg font-bold">{feature.engagement}%</p>
                        <p className="text-xs text-gray-600">Engagement</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Community Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Growth Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Community Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Line type="monotone" dataKey="members" stroke="#9333EA" strokeWidth={2} name="Members" />
                <Line type="monotone" dataKey="posts" stroke="#EC4899" strokeWidth={2} name="Posts" />
                <Line type="monotone" dataKey="events" stroke="#10B981" strokeWidth={2} name="Events" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Member Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={roleDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {roleDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {roleDistribution.map((role) => (
                <div key={role.role} className="flex items-center gap-2 text-sm">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: role.color }}
                  />
                  <span>{role.role}: {role.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Members */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Community Champions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {topMembers.map((member) => {
              const RoleIcon = getRoleIcon(member.role);
              return (
                <div key={member.id} className="p-4 border rounded-lg">
                  <div className="text-center mb-3">
                    <div className="text-4xl mb-2">{member.avatar}</div>
                    <h3 className="font-medium">{member.name}</h3>
                    <Badge variant={getRoleBadge(member.role) as any} className="mt-1">
                      <RoleIcon className="h-3 w-3 mr-1" />
                      {member.role}
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Level</span>
                      <span className="font-medium">{member.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Contributions</span>
                      <span className="font-medium">{member.contributions}</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Badges</p>
                      <div className="flex flex-wrap gap-1">
                        {member.badges.slice(0, 2).map((badge, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                        {member.badges.length > 2 && (
                          <Badge variant="secondary" className="text-xs">
                            +{member.badges.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Community Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Upcoming Community Events</CardTitle>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {communityEvents.map((event) => {
              const EventIcon = getEventTypeIcon(event.type);
              return (
                <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                      <EventIcon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-gray-600">
                        {event.date.toLocaleDateString()} • {event.participants} registered
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="capitalize">
                      {event.type}
                    </Badge>
                    <Badge variant={event.status === 'upcoming' ? 'default' : 'secondary'}>
                      {event.status}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Engagement Tools */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Engagement & Recognition Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-white rounded-lg">
              <Trophy className="h-8 w-8 text-yellow-500 mb-2" />
              <h3 className="font-medium mb-1">Achievement Badges</h3>
              <p className="text-sm text-gray-600">Reward active participation and milestones</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <Crown className="h-8 w-8 text-purple-600 mb-2" />
              <h3 className="font-medium mb-1">Member Levels</h3>
              <p className="text-sm text-gray-600">Progressive leveling system based on engagement</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <Gift className="h-8 w-8 text-pink-600 mb-2" />
              <h3 className="font-medium mb-1">Exclusive Perks</h3>
              <p className="text-sm text-gray-600">Special benefits for top contributors</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Community Settings */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">
          Preview Community
        </Button>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-pink-600"
          onClick={() => onSaveCommunity?.({
            name: communityName,
            description: communityDescription,
            guidelines,
            features: features.filter(f => f.enabled),
            expectedParticipants
          })}
        >
          <Users className="h-4 w-4 mr-2" />
          Save Community Settings
        </Button>
      </div>
    </div>
  );
}