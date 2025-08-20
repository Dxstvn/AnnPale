'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin,
  Bell,
  Share2,
  Calendar,
  Users,
  Zap,
  Trophy,
  Target,
  Sparkles,
  Gift,
  Heart,
  MessageSquare,
  Camera,
  Hash,
  TrendingUp,
  Clock,
  ChevronRight,
  Star,
  Flame,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface NearbyEvent {
  id: string;
  name: string;
  distance: string;
  time: string;
  attendees: number;
  type: 'meetup' | 'workshop' | 'social' | 'cultural';
}

interface PushCampaign {
  id: string;
  title: string;
  message: string;
  action: string;
  icon: React.ElementType;
  color: string;
}

interface QuickPoll {
  id: string;
  question: string;
  options: Array<{ id: string; text: string; votes: number }>;
  totalVotes: number;
  hasVoted: boolean;
  endsAt: Date;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  reward: string;
  icon: React.ElementType;
  color: string;
}

interface MobileEngagementProps {
  userId?: string;
  location?: { lat: number; lng: number };
  onLocationRequest?: () => void;
  onNotificationToggle?: (enabled: boolean) => void;
  onShareContent?: (content: any) => void;
}

export function MobileEngagement({
  userId,
  location,
  onLocationRequest,
  onNotificationToggle,
  onShareContent
}: MobileEngagementProps) {
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(false);
  const [selectedPoll, setSelectedPoll] = React.useState<string | null>(null);
  const [showShareSheet, setShowShareSheet] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<'nearby' | 'campaigns' | 'polls' | 'challenges'>('nearby');

  // Sample data
  const nearbyEvents: NearbyEvent[] = [
    {
      id: '1',
      name: 'Haitian Creole Meetup',
      distance: '0.5 mi',
      time: 'Tonight 7PM',
      attendees: 23,
      type: 'cultural'
    },
    {
      id: '2',
      name: 'Community Photo Walk',
      distance: '1.2 mi',
      time: 'Tomorrow 10AM',
      attendees: 15,
      type: 'social'
    },
    {
      id: '3',
      name: 'Creator Workshop',
      distance: '2.8 mi',
      time: 'Sat 2PM',
      attendees: 45,
      type: 'workshop'
    }
  ];

  const pushCampaigns: PushCampaign[] = [
    {
      id: '1',
      title: 'Daily Check-in',
      message: 'Check in for 5 days straight to earn bonus points!',
      action: 'Check In',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: '2',
      title: 'New Thread Alert',
      message: 'Join the trending discussion on platform updates',
      action: 'View Thread',
      icon: MessageSquare,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: '3',
      title: 'Photo Contest',
      message: 'Share your best community photo to win prizes',
      action: 'Participate',
      icon: Camera,
      color: 'bg-pink-100 text-pink-600'
    }
  ];

  const quickPolls: QuickPoll[] = [
    {
      id: '1',
      question: 'What type of content do you want to see more?',
      options: [
        { id: 'a', text: 'Tutorials', votes: 234 },
        { id: 'b', text: 'Discussions', votes: 189 },
        { id: 'c', text: 'Events', votes: 156 },
        { id: 'd', text: 'Photos', votes: 98 }
      ],
      totalVotes: 677,
      hasVoted: false,
      endsAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      question: 'Best time for community events?',
      options: [
        { id: 'a', text: 'Weekday Evening', votes: 145 },
        { id: 'b', text: 'Weekend Morning', votes: 178 },
        { id: 'c', text: 'Weekend Afternoon', votes: 234 },
        { id: 'd', text: 'Weekday Lunch', votes: 67 }
      ],
      totalVotes: 624,
      hasVoted: true,
      endsAt: new Date(Date.now() + 48 * 60 * 60 * 1000)
    }
  ];

  const challenges: Challenge[] = [
    {
      id: '1',
      title: 'Community Helper',
      description: 'Answer 10 questions this week',
      progress: 70,
      reward: '500 points',
      icon: Heart,
      color: 'text-red-600 bg-red-100'
    },
    {
      id: '2',
      title: 'Content Creator',
      description: 'Post 3 quality threads',
      progress: 33,
      reward: 'Creator Badge',
      icon: Star,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      id: '3',
      title: 'Social Butterfly',
      description: 'Connect with 5 new members',
      progress: 60,
      reward: 'Network Badge',
      icon: Users,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: '4',
      title: 'Trend Setter',
      description: 'Start a trending discussion',
      progress: 85,
      reward: 'Influencer Badge',
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  const shareOptions = [
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageSquare },
    { id: 'facebook', name: 'Facebook', icon: Share2 },
    { id: 'twitter', name: 'Twitter', icon: Share2 },
    { id: 'copy', name: 'Copy Link', icon: Share2 }
  ];

  const handleEnableNotifications = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        onNotificationToggle?.(true);
      }
    }
  };

  const handleVotePoll = (pollId: string, optionId: string) => {
    setSelectedPoll(pollId);
    // Handle vote submission
    console.log('Voted:', pollId, optionId);
  };

  const handleShare = (platform: string) => {
    onShareContent?.({ platform, content: 'Check out this community!' });
    setShowShareSheet(false);
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'cultural':
        return 'bg-purple-100 text-purple-700';
      case 'workshop':
        return 'bg-blue-100 text-blue-700';
      case 'social':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatTimeRemaining = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (hours < 24) return `${hours}h left`;
    return `${days}d left`;
  };

  return (
    <div className="space-y-4">
      {/* Location & Notifications Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={onLocationRequest}
              className="flex-1 mr-2"
            >
              <MapPin className="h-4 w-4 mr-2" />
              {location ? 'Location Enabled' : 'Enable Location'}
            </Button>
            <Button
              variant={notificationsEnabled ? "default" : "outline"}
              size="sm"
              onClick={handleEnableNotifications}
              className="flex-1 ml-2"
            >
              <Bell className="h-4 w-4 mr-2" />
              {notificationsEnabled ? 'Notifications On' : 'Enable Alerts'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {[
          { id: 'nearby', label: 'Nearby', icon: MapPin },
          { id: 'campaigns', label: 'Campaigns', icon: Zap },
          { id: 'polls', label: 'Polls', icon: Target },
          { id: 'challenges', label: 'Challenges', icon: Trophy }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab(tab.id as any)}
              className="flex-shrink-0"
            >
              <Icon className="h-4 w-4 mr-1" />
              {tab.label}
            </Button>
          );
        })}
      </div>

      {/* Content Sections */}
      <AnimatePresence mode="wait">
        {/* Nearby Events */}
        {activeTab === 'nearby' && (
          <motion.div
            key="nearby"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {location ? (
              nearbyEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{event.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {event.distance}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {event.time}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.attendees}
                          </span>
                        </div>
                      </div>
                      <Badge className={getEventTypeColor(event.type)}>
                        {event.type}
                      </Badge>
                    </div>
                    <Button size="sm" className="w-full">
                      View Details
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-12 w-12 text-yellow-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Enable Location</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Find events and meetups happening near you
                  </p>
                  <Button onClick={onLocationRequest}>
                    Enable Location Services
                  </Button>
                </CardContent>
              </Card>
            )}
          </motion.div>
        )}

        {/* Push Campaigns */}
        {activeTab === 'campaigns' && (
          <motion.div
            key="campaigns"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {pushCampaigns.map((campaign) => {
              const Icon = campaign.icon;
              return (
                <Card key={campaign.id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        campaign.color
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{campaign.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">{campaign.message}</p>
                        <Button size="sm" className="mt-3">
                          {campaign.action}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        )}

        {/* Quick Polls */}
        {activeTab === 'polls' && (
          <motion.div
            key="polls"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {quickPolls.map((poll) => (
              <Card key={poll.id} className="hover:shadow-lg transition-all">
                <CardHeader>
                  <CardTitle className="text-base flex items-center justify-between">
                    {poll.question}
                    <Badge variant="outline" className="text-xs">
                      {formatTimeRemaining(poll.endsAt)}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {poll.options.map((option) => {
                      const percentage = (option.votes / poll.totalVotes) * 100;
                      const isSelected = selectedPoll === poll.id;
                      
                      return (
                        <button
                          key={option.id}
                          onClick={() => !poll.hasVoted && handleVotePoll(poll.id, option.id)}
                          disabled={poll.hasVoted}
                          className={cn(
                            "w-full text-left p-3 rounded-lg border transition-all",
                            poll.hasVoted ? "bg-gray-50" : "hover:bg-gray-50"
                          )}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{option.text}</span>
                            {(poll.hasVoted || isSelected) && (
                              <span className="text-sm text-gray-600">
                                {percentage.toFixed(0)}%
                              </span>
                            )}
                          </div>
                          {(poll.hasVoted || isSelected) && (
                            <Progress value={percentage} className="h-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  <div className="text-xs text-gray-500 mt-3 text-center">
                    {poll.totalVotes} votes
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

        {/* Challenges */}
        {activeTab === 'challenges' && (
          <motion.div
            key="challenges"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {challenges.map((challenge) => {
              const Icon = challenge.icon;
              return (
                <Card key={challenge.id} className="hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
                        challenge.color
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-sm">{challenge.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {challenge.reward}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{challenge.description}</p>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>Progress</span>
                            <span className="font-medium">{challenge.progress}%</span>
                          </div>
                          <Progress value={challenge.progress} className="h-2" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Sheet */}
      <AnimatePresence>
        {showShareSheet && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowShareSheet(false)}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 p-6"
            >
              <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
              <h3 className="font-semibold mb-4">Share with</h3>
              <div className="grid grid-cols-4 gap-4">
                {shareOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.id}
                      onClick={() => handleShare(option.id)}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs">{option.name}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Floating Share Button */}
      <button
        onClick={() => setShowShareSheet(true)}
        className="fixed bottom-24 right-4 z-40 bg-purple-600 text-white rounded-full p-3 shadow-lg"
      >
        <Share2 className="h-5 w-5" />
      </button>
    </div>
  );
}