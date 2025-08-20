'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Share2,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Copy,
  Download,
  Image,
  Video,
  Hash,
  Clock,
  Calendar,
  TrendingUp,
  Users,
  Sparkles,
  Edit,
  CheckCircle,
  AlertCircle,
  Camera,
  FileText,
  Zap,
  Gift,
  Timer
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialPost {
  id: string;
  platform: 'facebook' | 'twitter' | 'instagram' | 'linkedin';
  content: string;
  mediaType?: 'image' | 'video' | 'carousel';
  scheduledFor?: Date;
  hashtags: string[];
  status: 'draft' | 'scheduled' | 'published';
}

interface SocialMediaPromotionProps {
  eventId: string;
  eventTitle: string;
  eventDate: Date;
  eventUrl: string;
  onGenerateGraphics?: () => void;
  onSchedulePost?: (post: SocialPost) => void;
  onCopyContent?: (content: string) => void;
  onDownloadAssets?: (type: string) => void;
}

export function SocialMediaPromotion({
  eventId,
  eventTitle,
  eventDate,
  eventUrl,
  onGenerateGraphics,
  onSchedulePost,
  onCopyContent,
  onDownloadAssets
}: SocialMediaPromotionProps) {
  const [selectedPlatform, setSelectedPlatform] = React.useState<'facebook' | 'twitter' | 'instagram' | 'linkedin'>('facebook');
  const [postContent, setPostContent] = React.useState('');
  const [autoHashtags, setAutoHashtags] = React.useState(true);
  const [includeCountdown, setIncludeCountdown] = React.useState(true);

  // Calculate days until event
  const daysUntilEvent = Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  // Platform-specific templates
  const templates = {
    announcement: {
      facebook: `🎉 Exciting News! Join us for "${eventTitle}"! 🎉\n\n📅 Date: ${eventDate.toLocaleDateString()}\n🎟️ Limited spots available!\n\n${eventUrl}\n\n#Event #HaitianCommunity #LiveEvent`,
      twitter: `🎉 Just announced: "${eventTitle}"!\n\n📅 ${eventDate.toLocaleDateString()}\n🎟️ Get your tickets now!\n\n${eventUrl}\n\n#HaitianEvents #LiveStream`,
      instagram: `✨ SAVE THE DATE ✨\n\n"${eventTitle}" is coming!\n\n📅 Mark your calendars: ${eventDate.toLocaleDateString()}\n\n🔗 Link in bio for tickets!\n\n#EventAnnouncement #HaitianCulture #MustAttend`,
      linkedin: `I'm excited to announce my upcoming event: "${eventTitle}"\n\nDate: ${eventDate.toLocaleDateString()}\n\nThis will be an incredible opportunity to connect and learn together.\n\nSecure your spot: ${eventUrl}\n\n#ProfessionalDevelopment #Networking`
    },
    countdown: {
      facebook: `⏰ ${daysUntilEvent} DAYS LEFT! ⏰\n\n"${eventTitle}" is almost here!\n\nDon't miss out on this exclusive event. Tickets are selling fast!\n\n🎟️ ${eventUrl}`,
      twitter: `⏰ Only ${daysUntilEvent} days until "${eventTitle}"!\n\nHave you got your ticket yet? 🎟️\n\n${eventUrl}`,
      instagram: `${daysUntilEvent} DAYS TO GO! 🔥\n\nWho's excited for "${eventTitle}"? 🙋‍♀️🙋‍♂️\n\nComment below if you'll be there! 👇`,
      linkedin: `Reminder: "${eventTitle}" is just ${daysUntilEvent} days away.\n\nLooking forward to seeing everyone there!\n\nLast chance to register: ${eventUrl}`
    },
    lastChance: {
      facebook: `🚨 LAST CHANCE ALERT! 🚨\n\nOnly a few tickets left for "${eventTitle}"!\n\nDon't miss out - grab yours NOW!\n\n${eventUrl}`,
      twitter: `🚨 FINAL CALL for "${eventTitle}"!\n\nLimited tickets remaining!\n\n${eventUrl}`,
      instagram: `LAST CHANCE! 🚨\n\nTickets for "${eventTitle}" are almost SOLD OUT!\n\nDon't say we didn't warn you! 😉\n\nLink in bio 🔗`,
      linkedin: `Final opportunity to join "${eventTitle}"\n\nWe're nearly at capacity. Secure your spot today.\n\n${eventUrl}`
    }
  };

  // Trending hashtags
  const trendingHashtags = {
    general: ['#HaitianEvents', '#AnnPale', '#VirtualEvent', '#LiveStream', '#Community'],
    facebook: ['#FacebookLive', '#Events2024', '#OnlineEvent'],
    twitter: ['#EventAlert', '#LiveNow', '#JoinUs'],
    instagram: ['#InstaLive', '#EventsOfInstagram', '#LiveExperience'],
    linkedin: ['#ProfessionalGrowth', '#VirtualNetworking', '#OnlineEvents']
  };

  // Graphics templates
  const graphicsTemplates = [
    { id: 'countdown', name: 'Countdown Timer', dimensions: '1080x1080', format: 'Square' },
    { id: 'story', name: 'Story Template', dimensions: '1080x1920', format: 'Vertical' },
    { id: 'banner', name: 'Event Banner', dimensions: '1200x630', format: 'Horizontal' },
    { id: 'carousel', name: 'Carousel Slides', dimensions: '1080x1080', format: 'Multi' }
  ];

  // Influencer pack items
  const influencerPack = [
    { item: 'Event Graphics Kit', count: 10, type: 'images' },
    { item: 'Pre-written Posts', count: 5, type: 'text' },
    { item: 'Story Templates', count: 8, type: 'stories' },
    { item: 'Hashtag Sets', count: 3, type: 'hashtags' },
    { item: 'Countdown Stickers', count: 5, type: 'stickers' }
  ];

  const handleUseTemplate = (type: 'announcement' | 'countdown' | 'lastChance') => {
    setPostContent(templates[type][selectedPlatform]);
  };

  const handleCopyContent = () => {
    navigator.clipboard.writeText(postContent);
    onCopyContent?.(postContent);
  };

  const getHashtags = () => {
    return [...trendingHashtags.general, ...trendingHashtags[selectedPlatform]];
  };

  return (
    <div className="space-y-6">
      {/* Platform Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Social Media Platforms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button
              variant={selectedPlatform === 'facebook' ? 'default' : 'outline'}
              onClick={() => setSelectedPlatform('facebook')}
              className="flex flex-col h-auto py-3"
            >
              <Facebook className="h-6 w-6 mb-1" />
              <span className="text-xs">Facebook</span>
            </Button>
            <Button
              variant={selectedPlatform === 'twitter' ? 'default' : 'outline'}
              onClick={() => setSelectedPlatform('twitter')}
              className="flex flex-col h-auto py-3"
            >
              <Twitter className="h-6 w-6 mb-1" />
              <span className="text-xs">Twitter</span>
            </Button>
            <Button
              variant={selectedPlatform === 'instagram' ? 'default' : 'outline'}
              onClick={() => setSelectedPlatform('instagram')}
              className="flex flex-col h-auto py-3"
            >
              <Instagram className="h-6 w-6 mb-1" />
              <span className="text-xs">Instagram</span>
            </Button>
            <Button
              variant={selectedPlatform === 'linkedin' ? 'default' : 'outline'}
              onClick={() => setSelectedPlatform('linkedin')}
              className="flex flex-col h-auto py-3"
            >
              <Linkedin className="h-6 w-6 mb-1" />
              <span className="text-xs">LinkedIn</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Post Generator */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Generated Posts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Templates */}
          <div>
            <Label>Quick Templates</Label>
            <div className="grid grid-cols-3 gap-2 mt-2">
              <Button
                variant="outline"
                onClick={() => handleUseTemplate('announcement')}
                className="flex flex-col h-auto py-3"
              >
                <Sparkles className="h-5 w-5 mb-1" />
                <span className="text-xs">Announcement</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleUseTemplate('countdown')}
                className="flex flex-col h-auto py-3"
              >
                <Timer className="h-5 w-5 mb-1" />
                <span className="text-xs">Countdown</span>
              </Button>
              <Button
                variant="outline"
                onClick={() => handleUseTemplate('lastChance')}
                className="flex flex-col h-auto py-3"
              >
                <AlertCircle className="h-5 w-5 mb-1" />
                <span className="text-xs">Last Chance</span>
              </Button>
            </div>
          </div>

          {/* Post Content */}
          <div>
            <Label>Post Content</Label>
            <Textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Write your post or use a template..."
              rows={6}
              className="mt-2"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-600">
                {postContent.length} characters
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyContent}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-hashtags">Auto-add hashtags</Label>
              <Switch
                id="auto-hashtags"
                checked={autoHashtags}
                onCheckedChange={setAutoHashtags}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="countdown">Include countdown</Label>
              <Switch
                id="countdown"
                checked={includeCountdown}
                onCheckedChange={setIncludeCountdown}
              />
            </div>
          </div>

          {/* Hashtags */}
          {autoHashtags && (
            <div>
              <Label>Suggested Hashtags</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {getHashtags().map((tag) => (
                  <Badge key={tag} variant="secondary">
                    <Hash className="h-3 w-3 mr-1" />
                    {tag.replace('#', '')}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Countdown Graphics */}
      <Card>
        <CardHeader>
          <CardTitle>Countdown Graphics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              {daysUntilEvent} days until your event! Use countdown graphics to build excitement.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-3">
            {graphicsTemplates.map((template) => (
              <Card key={template.id} className="p-3">
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg mb-2 flex items-center justify-center">
                  <Image className="h-12 w-12 text-purple-600" />
                </div>
                <h4 className="font-semibold text-sm">{template.name}</h4>
                <p className="text-xs text-gray-600">{template.dimensions}</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => onDownloadAssets?.(template.id)}
                >
                  <Download className="h-3 w-3 mr-1" />
                  Generate
                </Button>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Story Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Story Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {['Announcement', 'Countdown', 'Behind Scenes', 'Q&A', 'Reminder', 'Thank You'].map((type) => (
              <div key={type} className="text-center">
                <div className="aspect-[9/16] bg-gradient-to-b from-purple-500 to-pink-500 rounded-lg mb-2 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <p className="text-xs font-medium">{type}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Influencer Pack */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Influencer Collaboration Pack
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Everything your partners need to promote your event
          </p>
          <div className="space-y-2">
            {influencerPack.map((item) => (
              <div key={item.item} className="flex items-center justify-between p-2 bg-white rounded-lg">
                <div className="flex items-center gap-3">
                  {item.type === 'images' && <Image className="h-4 w-4 text-purple-600" />}
                  {item.type === 'text' && <FileText className="h-4 w-4 text-purple-600" />}
                  {item.type === 'stories' && <Camera className="h-4 w-4 text-purple-600" />}
                  {item.type === 'hashtags' && <Hash className="h-4 w-4 text-purple-600" />}
                  {item.type === 'stickers' && <Sparkles className="h-4 w-4 text-purple-600" />}
                  <span className="text-sm font-medium">{item.item}</span>
                </div>
                <Badge variant="secondary">{item.count}</Badge>
              </div>
            ))}
          </div>
          <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
            <Gift className="h-4 w-4 mr-2" />
            Generate Influencer Pack
          </Button>
        </CardContent>
      </Card>

      {/* Posting Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Optimal Posting Times</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
              <div>
                <p className="font-semibold text-sm">Best Time Today</p>
                <p className="text-xs text-gray-600">High engagement expected</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">6:00 PM</p>
                <p className="text-xs text-gray-600">EST</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">Morning</p>
                <p className="font-semibold">8:00 - 9:00 AM</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">Evening</p>
                <p className="font-semibold">6:00 - 8:00 PM</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}