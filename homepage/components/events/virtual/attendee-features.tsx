'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  MessageSquare,
  CreditCard,
  Link2,
  Search,
  UserPlus,
  Mail,
  Linkedin,
  Twitter,
  Instagram,
  Globe,
  Sparkles,
  Crown,
  Coffee,
  Video,
  Filter,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface Attendee {
  id: string;
  name: string;
  title?: string;
  company?: string;
  avatar?: string;
  tier: 'general' | 'vip' | 'platinum';
  isOnline: boolean;
  bio?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
    website?: string;
  };
  interests?: string[];
  isNetworking?: boolean;
}

interface NetworkingRequest {
  id: string;
  from: Attendee;
  message?: string;
  timestamp: Date;
  status: 'pending' | 'accepted' | 'declined';
}

interface AttendeeFeaturesPanelProps {
  eventId: string;
  currentUser: Attendee;
  attendees: Attendee[];
  networkingRequests?: NetworkingRequest[];
  onSendNetworkingRequest?: (attendeeId: string, message?: string) => void;
  onAcceptNetworking?: (requestId: string) => void;
  onDeclineNetworking?: (requestId: string) => void;
  onStartPrivateChat?: (attendeeId: string) => void;
  onExchangeBusinessCard?: (attendeeId: string) => void;
}

export function AttendeeFeaturesPanel({
  eventId,
  currentUser,
  attendees,
  networkingRequests = [],
  onSendNetworkingRequest,
  onAcceptNetworking,
  onDeclineNetworking,
  onStartPrivateChat,
  onExchangeBusinessCard
}: AttendeeFeaturesPanelProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterTier, setFilterTier] = React.useState<'all' | 'vip' | 'platinum' | 'networking'>('all');
  const [activeTab, setActiveTab] = React.useState('attendees');

  const filteredAttendees = React.useMemo(() => {
    let filtered = attendees;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             a.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
             a.company?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply tier filter
    if (filterTier === 'vip') {
      filtered = filtered.filter(a => a.tier === 'vip');
    } else if (filterTier === 'platinum') {
      filtered = filtered.filter(a => a.tier === 'platinum');
    } else if (filterTier === 'networking') {
      filtered = filtered.filter(a => a.isNetworking);
    }

    return filtered;
  }, [attendees, searchQuery, filterTier]);

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return <Crown className="h-3 w-3" />;
      case 'vip':
        return <Sparkles className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'platinum':
        return 'bg-gradient-to-r from-purple-600 to-pink-600 text-white';
      case 'vip':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Event Attendees</CardTitle>
          <Badge variant="secondary">
            <Users className="h-3 w-3 mr-1" />
            {attendees.length} attending
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid grid-cols-3 w-full rounded-none">
            <TabsTrigger value="attendees">
              <Users className="h-4 w-4 mr-2" />
              Attendees
            </TabsTrigger>
            <TabsTrigger value="networking">
              <Coffee className="h-4 w-4 mr-2" />
              Networking
              {networkingRequests.length > 0 && (
                <Badge variant="destructive" className="ml-2 h-5 w-5 p-0 rounded-full">
                  {networkingRequests.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="mycard">
              <CreditCard className="h-4 w-4 mr-2" />
              My Card
            </TabsTrigger>
          </TabsList>

          {/* Attendees List */}
          <TabsContent value="attendees" className="flex-1 flex flex-col p-4 pt-2">
            {/* Search and Filter */}
            <div className="space-y-3 mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search attendees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filterTier === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterTier('all')}
                >
                  All
                </Button>
                <Button
                  variant={filterTier === 'vip' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterTier('vip')}
                >
                  VIP
                </Button>
                <Button
                  variant={filterTier === 'platinum' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterTier('platinum')}
                >
                  Platinum
                </Button>
                <Button
                  variant={filterTier === 'networking' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterTier('networking')}
                >
                  <Coffee className="h-3 w-3 mr-1" />
                  Open
                </Button>
              </div>
            </div>

            {/* Attendee List */}
            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {filteredAttendees.map((attendee) => (
                  <Card key={attendee.id} className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Avatar>
                          <AvatarImage src={attendee.avatar} />
                          <AvatarFallback>{attendee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm">{attendee.name}</p>
                            {attendee.tier !== 'general' && (
                              <Badge className={cn("text-xs", getTierColor(attendee.tier))}>
                                {getTierIcon(attendee.tier)}
                                <span className="ml-1">{attendee.tier.toUpperCase()}</span>
                              </Badge>
                            )}
                            {attendee.isNetworking && (
                              <Badge variant="success" className="text-xs">
                                <Coffee className="h-3 w-3 mr-1" />
                                Networking
                              </Badge>
                            )}
                          </div>
                          {attendee.title && (
                            <p className="text-xs text-gray-600">{attendee.title}</p>
                          )}
                          {attendee.company && (
                            <p className="text-xs text-gray-500">{attendee.company}</p>
                          )}
                          {attendee.interests && attendee.interests.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {attendee.interests.slice(0, 3).map((interest) => (
                                <Badge key={interest} variant="secondary" className="text-xs">
                                  {interest}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onStartPrivateChat?.(attendee.id)}>
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Message
                          </DropdownMenuItem>
                          {(currentUser.tier === 'vip' || currentUser.tier === 'platinum') && (
                            <>
                              <DropdownMenuItem onClick={() => onSendNetworkingRequest?.(attendee.id)}>
                                <UserPlus className="h-4 w-4 mr-2" />
                                Connect
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => onExchangeBusinessCard?.(attendee.id)}>
                                <CreditCard className="h-4 w-4 mr-2" />
                                Exchange Card
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Networking Lounge */}
          <TabsContent value="networking" className="flex-1 flex flex-col p-4 pt-2">
            {currentUser.tier === 'general' ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <Coffee className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">Networking Lounge</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Upgrade to VIP or Platinum to access networking features
                  </p>
                  <Button>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Upgrade Now
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Networking Requests */}
                {networkingRequests.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm mb-2">Connection Requests</h3>
                    <div className="space-y-2">
                      {networkingRequests.map((request) => (
                        <Card key={request.id} className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={request.from.avatar} />
                                <AvatarFallback>{request.from.name[0]}</AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-sm">{request.from.name}</p>
                                <p className="text-xs text-gray-600">{request.from.title}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => onDeclineNetworking?.(request.id)}
                              >
                                Decline
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => onAcceptNetworking?.(request.id)}
                              >
                                Accept
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Networking Options */}
                <div>
                  <h3 className="font-semibold text-sm mb-2">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" className="justify-start">
                      <Video className="h-4 w-4 mr-2" />
                      Speed Networking
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Join Breakout
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <Coffee className="h-4 w-4 mr-2" />
                      Coffee Chat
                    </Button>
                    <Button variant="outline" className="justify-start">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Topic Rooms
                    </Button>
                  </div>
                </div>

                {/* Networking Stats */}
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm mb-2">Your Networking</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-purple-600">12</p>
                        <p className="text-xs text-gray-600">Connections</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">5</p>
                        <p className="text-xs text-gray-600">Cards Exchanged</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-purple-600">3</p>
                        <p className="text-xs text-gray-600">Chats Active</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Business Card */}
          <TabsContent value="mycard" className="flex-1 flex flex-col p-4 pt-2">
            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-purple-600 to-pink-600 text-white">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold">{currentUser.name}</h3>
                      {currentUser.title && (
                        <p className="text-sm opacity-90">{currentUser.title}</p>
                      )}
                      {currentUser.company && (
                        <p className="text-sm opacity-80">{currentUser.company}</p>
                      )}
                    </div>
                    <div className="pt-4 border-t border-white/20">
                      <p className="text-xs opacity-80 mb-2">Connect with me:</p>
                      <div className="flex gap-3">
                        {currentUser.socialLinks?.linkedin && (
                          <Linkedin className="h-5 w-5" />
                        )}
                        {currentUser.socialLinks?.twitter && (
                          <Twitter className="h-5 w-5" />
                        )}
                        {currentUser.socialLinks?.instagram && (
                          <Instagram className="h-5 w-5" />
                        )}
                        {currentUser.socialLinks?.website && (
                          <Globe className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-2">
                <Button className="w-full">
                  <Link2 className="h-4 w-4 mr-2" />
                  Share My Card
                </Button>
                <Button variant="outline" className="w-full">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Edit Card Details
                </Button>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-sm mb-3">Cards Collected</h4>
                  <div className="text-center text-gray-500">
                    <CreditCard className="h-8 w-8 mx-auto mb-2" />
                    <p className="text-sm">No cards collected yet</p>
                    <p className="text-xs mt-1">Exchange cards with other attendees</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}