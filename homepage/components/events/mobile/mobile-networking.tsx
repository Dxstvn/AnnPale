'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users,
  MessageSquare,
  UserPlus,
  Heart,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Coffee,
  Handshake,
  Star,
  Share2,
  Send,
  Phone,
  Video,
  Mail,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  Filter,
  Search,
  X,
  Check,
  Clock,
  TrendingUp,
  Award,
  Zap,
  Eye,
  ThumbsUp,
  MessageCircle,
  UserCheck,
  Settings,
  Bell,
  ChevronRight,
  Plus,
  Minus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface NetworkingProfile {
  id: string;
  name: string;
  avatar: string;
  title: string;
  company?: string;
  location: string;
  interests: string[];
  bio: string;
  isConnected: boolean;
  isOnline: boolean;
  mutualConnections: number;
  joinedDate: Date;
  verified: boolean;
  lookingFor: 'networking' | 'collaboration' | 'mentorship' | 'friendship';
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
}

interface NetworkingRequest {
  id: string;
  user: NetworkingProfile;
  message: string;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'declined';
}

interface MobileNetworkingProps {
  eventId?: string;
  currentUser?: NetworkingProfile;
  onConnect?: (userId: string, message?: string) => void;
  onMessage?: (userId: string, message: string) => void;
  onScheduleMeeting?: (userId: string, details: any) => void;
}

export function MobileNetworking({
  eventId = 'event-1',
  currentUser,
  onConnect,
  onMessage,
  onScheduleMeeting
}: MobileNetworkingProps) {
  const [activeTab, setActiveTab] = React.useState<'discover' | 'connections' | 'requests' | 'chat'>('discover');
  const [showProfile, setShowProfile] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterBy, setFilterBy] = React.useState<'all' | 'online' | 'nearby' | 'similar'>('all');
  const [connectingTo, setConnectingTo] = React.useState<string | null>(null);
  const [connectMessage, setConnectMessage] = React.useState('');
  const [showConnectionModal, setShowConnectionModal] = React.useState(false);

  // Sample networking profiles
  const [attendeeProfiles, setAttendeeProfiles] = React.useState<NetworkingProfile[]>([
    {
      id: '1',
      name: 'Jean-Baptiste Pierre',
      avatar: '👨🏾‍🎨',
      title: 'Cultural Arts Director',
      company: 'Haitian Cultural Center',
      location: 'Miami, FL',
      interests: ['Traditional Music', 'Cultural Preservation', 'Community Building'],
      bio: 'Passionate about preserving and sharing Haitian cultural heritage through music and arts.',
      isConnected: false,
      isOnline: true,
      mutualConnections: 5,
      joinedDate: new Date('2023-01-15'),
      verified: true,
      lookingFor: 'collaboration',
      socialLinks: {
        linkedin: 'linkedin.com/in/jbpierre',
        instagram: '@jbpierre_art'
      }
    },
    {
      id: '2',
      name: 'Sophia Laurent',
      avatar: '👩🏾‍💼',
      title: 'Event Coordinator',
      company: 'Caribbean Events LLC',
      location: 'Brooklyn, NY',
      interests: ['Event Planning', 'Community Events', 'Networking'],
      bio: 'Connecting people through memorable experiences and cultural celebrations.',
      isConnected: true,
      isOnline: false,
      mutualConnections: 12,
      joinedDate: new Date('2022-08-20'),
      verified: false,
      lookingFor: 'networking',
      socialLinks: {
        linkedin: 'linkedin.com/in/sophialaurent',
        website: 'caribbeanevents.com'
      }
    },
    {
      id: '3',
      name: 'Marcus Thompson',
      avatar: '👨🏾‍💻',
      title: 'Software Engineer',
      company: 'Tech Solutions Inc',
      location: 'Boston, MA',
      interests: ['Technology', 'Haitian History', 'Mentorship'],
      bio: 'Building technology solutions while staying connected to my Haitian roots.',
      isConnected: false,
      isOnline: true,
      mutualConnections: 3,
      joinedDate: new Date('2023-05-10'),
      verified: false,
      lookingFor: 'mentorship',
      socialLinks: {
        linkedin: 'linkedin.com/in/marcusthompson',
        twitter: '@marcus_codes'
      }
    }
  ]);

  // Sample connection requests
  const [connectionRequests, setConnectionRequests] = React.useState<NetworkingRequest[]>([
    {
      id: '1',
      user: attendeeProfiles[0],
      message: "Hi! I'd love to connect and discuss cultural preservation initiatives.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'pending'
    }
  ]);

  // Sample chat conversations
  const [conversations, setConversations] = React.useState([
    {
      id: '1',
      user: attendeeProfiles[1],
      lastMessage: 'Thanks for connecting! Looking forward to collaborating.',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      unread: 2
    }
  ]);

  const filteredProfiles = React.useMemo(() => {
    let filtered = attendeeProfiles;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(profile =>
        profile.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profile.interests.some(interest => 
          interest.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply other filters
    switch (filterBy) {
      case 'online':
        filtered = filtered.filter(profile => profile.isOnline);
        break;
      case 'nearby':
        // Mock nearby filter - in real app would use geolocation
        filtered = filtered.filter(profile => 
          profile.location.includes('Miami') || profile.location.includes('FL')
        );
        break;
      case 'similar':
        // Mock similar interests filter
        filtered = filtered.filter(profile => 
          profile.interests.some(interest => 
            interest.includes('Cultural') || interest.includes('Music')
          )
        );
        break;
    }

    return filtered;
  }, [attendeeProfiles, searchQuery, filterBy]);

  const handleConnect = (userId: string) => {
    setConnectingTo(userId);
    setShowConnectionModal(true);
  };

  const sendConnectionRequest = () => {
    if (connectingTo) {
      onConnect?.(connectingTo, connectMessage);
      
      // Update local state
      const user = attendeeProfiles.find(p => p.id === connectingTo);
      if (user) {
        const newRequest: NetworkingRequest = {
          id: Date.now().toString(),
          user,
          message: connectMessage || "Hi! I'd like to connect with you.",
          timestamp: new Date(),
          status: 'pending'
        };
        // In real app, this would be sent to the other user
      }

      setShowConnectionModal(false);
      setConnectingTo(null);
      setConnectMessage('');
    }
  };

  const handleConnectionResponse = (requestId: string, accept: boolean) => {
    setConnectionRequests(prev => 
      prev.map(req => 
        req.id === requestId 
          ? { ...req, status: accept ? 'accepted' : 'declined' }
          : req
      )
    );

    if (accept) {
      // Add to connections
      const request = connectionRequests.find(req => req.id === requestId);
      if (request) {
        setAttendeeProfiles(prev => 
          prev.map(profile => 
            profile.id === request.user.id 
              ? { ...profile, isConnected: true }
              : profile
          )
        );
      }
    }
  };

  const getLookingForColor = (lookingFor: string) => {
    switch (lookingFor) {
      case 'networking': return 'bg-blue-100 text-blue-700';
      case 'collaboration': return 'bg-green-100 text-green-700';
      case 'mentorship': return 'bg-purple-100 text-purple-700';
      case 'friendship': return 'bg-pink-100 text-pink-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const tabs = [
    { id: 'discover', label: 'Discover', icon: Search },
    { id: 'connections', label: 'Connections', icon: Users },
    { id: 'requests', label: 'Requests', icon: UserPlus, badge: connectionRequests.filter(r => r.status === 'pending').length },
    { id: 'chat', label: 'Chat', icon: MessageSquare, badge: conversations.reduce((sum, c) => sum + c.unread, 0) }
  ];

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="p-4">
          <h1 className="text-xl font-bold">Event Networking</h1>
          <p className="text-sm text-gray-600">Connect with {filteredProfiles.length} attendees</p>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 pb-4">
          <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id as any)}
                  className="flex-1 relative"
                >
                  <Icon className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.badge && tab.badge > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                      {tab.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'discover' && (
          <div className="p-4 space-y-4">
            {/* Search and Filters */}
            <div className="space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search attendees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2 overflow-x-auto">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'online', label: 'Online' },
                  { id: 'nearby', label: 'Nearby' },
                  { id: 'similar', label: 'Similar Interests' }
                ].map((filter) => (
                  <Button
                    key={filter.id}
                    variant={filterBy === filter.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilterBy(filter.id as any)}
                    className="whitespace-nowrap"
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Profiles Grid */}
            <div className="space-y-3">
              {filteredProfiles.map((profile) => (
                <Card key={profile.id} className="overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-3">
                      <div className="relative">
                        <div className="text-3xl">{profile.avatar}</div>
                        {profile.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold truncate">{profile.name}</h3>
                          {profile.verified && (
                            <Badge variant="secondary" className="h-4 w-4 p-0">
                              ✓
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 truncate">{profile.title}</p>
                        {profile.company && (
                          <p className="text-xs text-gray-500 truncate">{profile.company}</p>
                        )}
                        
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{profile.location}</span>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                          <Badge className={cn("text-xs", getLookingForColor(profile.lookingFor))}>
                            {profile.lookingFor}
                          </Badge>
                          {profile.mutualConnections > 0 && (
                            <span className="text-xs text-gray-500">
                              {profile.mutualConnections} mutual
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-1 mt-2">
                          {profile.interests.slice(0, 2).map((interest) => (
                            <Badge key={interest} variant="secondary" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                          {profile.interests.length > 2 && (
                            <span className="text-xs text-gray-500">
                              +{profile.interests.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        {profile.isConnected ? (
                          <>
                            <Button size="sm" variant="outline">
                              <MessageSquare className="h-3 w-3 mr-1" />
                              Message
                            </Button>
                            <Button size="sm" variant="outline">
                              <Coffee className="h-3 w-3 mr-1" />
                              Meet
                            </Button>
                          </>
                        ) : (
                          <Button 
                            size="sm"
                            onClick={() => handleConnect(profile.id)}
                          >
                            <UserPlus className="h-3 w-3 mr-1" />
                            Connect
                          </Button>
                        )}
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => setShowProfile(profile.id)}
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'connections' && (
          <div className="p-4 space-y-3">
            {attendeeProfiles.filter(p => p.isConnected).map((profile) => (
              <Card key={profile.id}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="text-2xl">{profile.avatar}</div>
                      {profile.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{profile.name}</h3>
                      <p className="text-sm text-gray-600">{profile.title}</p>
                      <p className="text-xs text-gray-500">{profile.location}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <MessageSquare className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Video className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="p-4 space-y-3">
            {connectionRequests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{request.user.avatar}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{request.user.name}</h3>
                        <p className="text-sm text-gray-600">{request.user.title}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(request.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant={
                        request.status === 'pending' ? 'secondary' :
                        request.status === 'accepted' ? 'success' : 'destructive'
                      }>
                        {request.status}
                      </Badge>
                    </div>

                    <p className="text-sm">{request.message}</p>

                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button 
                          size="sm"
                          onClick={() => handleConnectionResponse(request.id, true)}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Accept
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleConnectionResponse(request.id, false)}
                        >
                          <X className="h-3 w-3 mr-1" />
                          Decline
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="p-4 space-y-3">
            {conversations.map((conversation) => (
              <Card key={conversation.id} className="cursor-pointer hover:bg-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="text-2xl">{conversation.user.avatar}</div>
                      {conversation.user.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold truncate">{conversation.user.name}</h3>
                        <span className="text-xs text-gray-500">
                          {new Date(conversation.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <Badge className="h-5 w-5 p-0 text-xs">
                        {conversation.unread}
                      </Badge>
                    )}
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Connection Modal */}
      <AnimatePresence>
        {showConnectionModal && connectingTo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg w-full max-w-md"
            >
              <div className="p-4 border-b">
                <h3 className="font-semibold">Send Connection Request</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">
                    Personal Message (Optional)
                  </label>
                  <textarea
                    placeholder="Introduce yourself and explain why you'd like to connect..."
                    value={connectMessage}
                    onChange={(e) => setConnectMessage(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg text-sm"
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    className="flex-1"
                    onClick={sendConnectionRequest}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Request
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowConnectionModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Quick Actions Floating Button */}
      <div className="fixed bottom-4 right-4">
        <Button className="h-14 w-14 rounded-full shadow-lg">
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}