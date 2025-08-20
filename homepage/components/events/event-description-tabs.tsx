'use client';

import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Info,
  Calendar,
  Clock,
  List,
  CheckCircle,
  Gift,
  HelpCircle,
  User,
  Users,
  Star,
  Video,
  Music,
  MessageCircle,
  Trophy,
  Heart,
  Share2,
  ChevronRight,
  ExternalLink,
  Sparkles,
  Target
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export interface EventCreator {
  id: string;
  name: string;
  bio: string;
  avatarUrl: string;
  verified: boolean;
  followers: number;
  eventsHosted: number;
  rating: number;
  specialties: string[];
  socialLinks?: {
    platform: string;
    url: string;
  }[];
}

export interface EventCoHost {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  verified: boolean;
}

export interface EventAgendaItem {
  time: string;
  duration: number;
  title: string;
  description: string;
  speaker?: string;
}

export interface EventFAQ {
  question: string;
  answer: string;
}

export interface EventReview {
  id: string;
  author: string;
  authorAvatar: string;
  rating: number;
  comment: string;
  eventName: string;
  date: Date;
}

interface EventDescriptionTabsProps {
  eventId: string;
  description: string;
  whatToExpect: string[];
  agenda: EventAgendaItem[];
  requirements: string[];
  whatsIncluded: string[];
  faqs: EventFAQ[];
  creator: EventCreator;
  coHosts?: EventCoHost[];
  pastEvents?: {
    id: string;
    title: string;
    date: Date;
    attendees: number;
    rating: number;
  }[];
  reviews?: EventReview[];
  onFollowCreator: (creatorId: string) => void;
  isFollowing?: boolean;
  className?: string;
}

export function EventDescriptionTabs({
  eventId,
  description,
  whatToExpect,
  agenda,
  requirements,
  whatsIncluded,
  faqs,
  creator,
  coHosts,
  pastEvents,
  reviews,
  onFollowCreator,
  isFollowing = false,
  className
}: EventDescriptionTabsProps) {
  const [selectedTab, setSelectedTab] = React.useState('about');

  return (
    <div className={cn("w-full", className)}>
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="about">
            <Info className="h-4 w-4 mr-2" />
            About
          </TabsTrigger>
          <TabsTrigger value="schedule">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule
          </TabsTrigger>
          <TabsTrigger value="creator">
            <User className="h-4 w-4 mr-2" />
            Creator
          </TabsTrigger>
          <TabsTrigger value="faqs">
            <HelpCircle className="h-4 w-4 mr-2" />
            FAQs
          </TabsTrigger>
        </TabsList>

        {/* About Tab */}
        <TabsContent value="about" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 whitespace-pre-wrap">{description}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                What to Expect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {whatToExpect.map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <List className="h-5 w-5" />
                  Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="h-1.5 w-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  What's Included
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {whatsIncluded.map((item, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Sparkles className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Schedule Tab */}
        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Event Agenda</CardTitle>
              <p className="text-sm text-gray-600">
                All times are shown in your local timezone
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agenda.map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0 text-center">
                      <div className="text-lg font-bold">{item.time}</div>
                      <div className="text-xs text-gray-500">{item.duration} min</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                      {item.speaker && (
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">Speaker: {item.speaker}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Creator Tab */}
        <TabsContent value="creator" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={creator.avatarUrl} alt={creator.name} />
                    <AvatarFallback>{creator.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">{creator.name}</h3>
                      {creator.verified && (
                        <Badge className="bg-blue-100 text-blue-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {creator.followers.toLocaleString()} followers
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {creator.eventsHosted} events
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        {creator.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => onFollowCreator(creator.id)}
                  variant={isFollowing ? "outline" : "default"}
                >
                  {isFollowing ? (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Following
                    </>
                  ) : (
                    <>
                      <Heart className="h-4 w-4 mr-2" />
                      Follow
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Bio</h4>
                <p className="text-gray-600">{creator.bio}</p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {creator.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              {creator.socialLinks && creator.socialLinks.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Connect</h4>
                  <div className="flex gap-2">
                    {creator.socialLinks.map((link, index) => (
                      <Button
                        key={index}
                        size="sm"
                        variant="outline"
                        asChild
                      >
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          {link.platform}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Co-hosts */}
          {coHosts && coHosts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Co-hosts & Special Guests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {coHosts.map((coHost) => (
                    <div key={coHost.id} className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={coHost.avatarUrl} alt={coHost.name} />
                        <AvatarFallback>{coHost.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{coHost.name}</span>
                          {coHost.verified && (
                            <CheckCircle className="h-4 w-4 text-blue-500" />
                          )}
                        </div>
                        <span className="text-sm text-gray-600">{coHost.role}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Past Events */}
          {pastEvents && pastEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Past Events by {creator.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pastEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div>
                        <h5 className="font-medium">{event.title}</h5>
                        <div className="flex items-center gap-3 text-sm text-gray-600 mt-1">
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {event.attendees}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                            {event.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`faq-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-gray-600">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}