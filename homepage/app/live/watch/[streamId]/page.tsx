'use client';

import { VideoPlayer } from '@/components/streaming/video-player';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Gift, Share2, Bell, Users } from 'lucide-react';
import { use } from 'react';

interface WatchStreamPageProps {
  params: Promise<{
    streamId: string;
  }>;
}

export default function WatchStreamPage({ params }: WatchStreamPageProps) {
  const { streamId } = use(params);
  
  // In production, fetch stream data from database
  const mockStream = {
    id: streamId,
    title: "Live Performance & Chat",
    description: "Join me for an exclusive live performance and Q&A session!",
    creatorName: "Jean Baptiste",
    creatorAvatar: "/placeholder-user.jpg",
    viewerCount: 1234,
    isLive: true,
    streamUrl: `https://demo-stream.annpale.com/live/${streamId}/master.m3u8`,
    category: "Music",
    startedAt: new Date()
  };

  return (
    <div className="container max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Video Player */}
        <div className="lg:col-span-2 space-y-4">
          {/* Player */}
          <VideoPlayer
            streamUrl={mockStream.streamUrl}
            streamId={mockStream.id}
            isLive={mockStream.isLive}
            viewerCount={mockStream.viewerCount}
          />

          {/* Stream Info */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-2xl">{mockStream.title}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Badge variant="outline">{mockStream.category}</Badge>
                    <span>•</span>
                    <span>{mockStream.viewerCount.toLocaleString()} watching</span>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="outline">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="outline">
                    <Bell className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Creator Info */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={mockStream.creatorAvatar} />
                    <AvatarFallback>JB</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{mockStream.creatorName}</h3>
                    <p className="text-sm text-muted-foreground">5.2K followers</p>
                  </div>
                </div>
                <Button>Follow</Button>
              </div>

              {/* Description */}
              <div className="pt-4">
                <p className="text-sm">{mockStream.description}</p>
              </div>
            </CardContent>
          </Card>

          {/* Engagement Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <Button className="flex-1" variant="outline">
                  <Heart className="mr-2 h-4 w-4" />
                  Like Stream
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Gift className="mr-2 h-4 w-4" />
                  Send Gift
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Chat */}
        <div className="space-y-4">
          {/* Live Chat */}
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="text-lg flex items-center justify-between">
                Live Chat
                <Badge variant="secondary">
                  <Users className="w-3 h-3 mr-1" />
                  {mockStream.viewerCount}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              {/* Chat Messages */}
              <div className="flex-1 bg-muted/50 rounded-lg p-4 mb-4 overflow-y-auto">
                <div className="space-y-3">
                  {/* Mock chat messages */}
                  <div className="text-sm">
                    <span className="font-semibold text-primary">Alex:</span> Amazing stream! 🎉
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-primary">Marie:</span> Love from Haiti! 🇭🇹
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold text-primary">John:</span> Can you play my favorite song?
                  </div>
                  <div className="text-sm bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-2 rounded">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">Sarah sent a gift!</span> 🎁
                  </div>
                </div>
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button size="sm">Send</Button>
              </div>
            </CardContent>
          </Card>

          {/* Top Supporters */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Supporters</CardTitle>
              <CardDescription>Most generous viewers today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>1</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">David M.</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">$50</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>2</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">Lisa K.</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">$25</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>3</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium">Robert J.</span>
                  </div>
                  <span className="text-sm font-semibold text-primary">$15</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}