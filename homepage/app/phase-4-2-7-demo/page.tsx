'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListingOptimization } from '@/components/events/marketing/listing-optimization';
import { SocialMediaPromotion } from '@/components/events/marketing/social-media-promotion';
import { EmailMarketing } from '@/components/events/marketing/email-marketing';
import { PartnershipsManagement } from '@/components/events/marketing/partnerships-management';
import { PaidPromotion } from '@/components/events/marketing/paid-promotion';
import { PromotionalTimeline } from '@/components/events/marketing/promotional-timeline';
import {
  Search,
  Share2,
  Mail,
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  Target,
  Megaphone,
  ArrowRight,
  Zap,
  Award,
  BarChart,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function Phase427Demo() {
  const [activeTab, setActiveTab] = useState('optimization');

  // Demo event data
  const eventData = {
    id: 'demo-event-427',
    title: 'Haitian Music & Culture Festival 2024',
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    url: 'https://annpale.com/events/haitian-festival-2024',
    registeredCount: 187,
    totalCapacity: 500
  };

  // Phase statistics
  const phaseStats = {
    components: 6,
    marketingChannels: 5,
    automationFeatures: 12,
    analyticsMetrics: 15
  };

  // Marketing metrics
  const marketingMetrics = [
    { metric: 'SEO Score', value: '85%', trend: '+12%', status: 'good' },
    { metric: 'Social Reach', value: '45.2K', trend: '+28%', status: 'excellent' },
    { metric: 'Email Opens', value: '68%', trend: '+5%', status: 'good' },
    { metric: 'Partner Referrals', value: '367', trend: '+45%', status: 'excellent' },
    { metric: 'Ad ROI', value: '240%', trend: '+18%', status: 'excellent' }
  ];

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 4.2.7: Event Marketing & Promotion
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Comprehensive marketing toolkit with SEO optimization, social media automation, 
          email campaigns, partnerships, paid promotion, and timeline management
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            SEO Optimization
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Social Media
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Email Marketing
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Partnerships
          </span>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            Paid Ads
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Timeline
          </span>
        </div>
      </div>

      {/* Live Demo Links */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">🚀 Marketing Suite Ready</h2>
        <p className="mb-6 text-lg opacity-90">
          Complete event marketing platform with multi-channel promotion, automated campaigns, 
          partnership tools, and ROI tracking for maximum event attendance
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/events/create">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
            >
              <Megaphone className="w-5 h-5 mr-2" />
              Start Marketing
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/creator/events">
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <BarChart className="w-5 h-5 mr-2" />
              View Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* Marketing Metrics Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Marketing Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {marketingMetrics.map((item) => (
              <div key={item.metric} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600 mb-1">{item.metric}</p>
                <p className="text-2xl font-bold">{item.value}</p>
                <Badge variant={
                  item.status === 'excellent' ? 'success' :
                  item.status === 'good' ? 'default' :
                  'secondary'
                } className="mt-2">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {item.trend}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Marketing Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
          <TabsTrigger value="optimization">
            <Search className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">SEO</span>
          </TabsTrigger>
          <TabsTrigger value="social">
            <Share2 className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Social</span>
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Email</span>
          </TabsTrigger>
          <TabsTrigger value="partnerships">
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Partners</span>
          </TabsTrigger>
          <TabsTrigger value="paid">
            <DollarSign className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Ads</span>
          </TabsTrigger>
          <TabsTrigger value="timeline">
            <Calendar className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Timeline</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="optimization" className="mt-6">
          <ListingOptimization
            eventId={eventData.id}
            currentTitle={eventData.title}
            currentDescription="Join us for an unforgettable celebration of Haitian music, art, and culture featuring live performances, traditional food, and community connections."
            currentCategory="Festival & Fair"
            currentTags={['haitian-culture', 'live-music', 'festival', 'community']}
            onUpdateTitle={(title) => console.log('Update title:', title)}
            onUpdateDescription={(desc) => console.log('Update description:', desc)}
            onUpdateCategory={(cat) => console.log('Update category:', cat)}
            onUpdateTags={(tags) => console.log('Update tags:', tags)}
            onUpdateKeywords={(keywords) => console.log('Update keywords:', keywords)}
            onRequestFeature={() => console.log('Request featured placement')}
          />
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <SocialMediaPromotion
            eventId={eventData.id}
            eventTitle={eventData.title}
            eventDate={eventData.date}
            eventUrl={eventData.url}
            onGenerateGraphics={() => console.log('Generate graphics')}
            onSchedulePost={(post) => console.log('Schedule post:', post)}
            onCopyContent={(content) => console.log('Copy content:', content)}
            onDownloadAssets={(type) => console.log('Download assets:', type)}
          />
        </TabsContent>

        <TabsContent value="email" className="mt-6">
          <EmailMarketing
            eventId={eventData.id}
            eventTitle={eventData.title}
            eventDate={eventData.date}
            registeredCount={eventData.registeredCount}
            totalCapacity={eventData.totalCapacity}
            onSendCampaign={(campaign) => console.log('Send campaign:', campaign)}
            onScheduleCampaign={(campaign) => console.log('Schedule campaign:', campaign)}
            onTestEmail={(email) => console.log('Send test to:', email)}
            onSaveTemplate={(template) => console.log('Save template:', template)}
          />
        </TabsContent>

        <TabsContent value="partnerships" className="mt-6">
          <PartnershipsManagement
            eventId={eventData.id}
            onAddPartner={(partner) => console.log('Add partner:', partner)}
            onGenerateMediaKit={() => console.log('Generate media kit')}
            onCreateAffiliateLink={(partnerId) => console.log('Create affiliate link:', partnerId)}
            onSendInvite={(email, type) => console.log('Send invite:', email, type)}
          />
        </TabsContent>

        <TabsContent value="paid" className="mt-6">
          <PaidPromotion
            eventId={eventData.id}
            eventTitle={eventData.title}
            currentBudget={500}
            onCreateCampaign={(campaign) => console.log('Create campaign:', campaign)}
            onUpdateBudget={(budget) => console.log('Update budget:', budget)}
            onBoostEvent={(type, budget) => console.log('Boost event:', type, budget)}
            onPauseCampaign={(id) => console.log('Pause campaign:', id)}
          />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <PromotionalTimeline
            eventId={eventData.id}
            eventTitle={eventData.title}
            eventDate={eventData.date}
            onCompleteAction={(phaseId, action) => console.log('Complete action:', phaseId, action)}
            onSkipPhase={(phaseId) => console.log('Skip phase:', phaseId)}
            onSetReminder={(phaseId) => console.log('Set reminder:', phaseId)}
          />
        </TabsContent>
      </Tabs>

      {/* Marketing Channels */}
      <Card>
        <CardHeader>
          <CardTitle>Multi-Channel Marketing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Organic Reach</h3>
              <ul className="space-y-1 text-sm text-left">
                <li>✓ SEO optimization</li>
                <li>✓ Content marketing</li>
                <li>✓ Social media posts</li>
                <li>✓ Partner cross-promotion</li>
              </ul>
            </div>
            <div className="text-center p-4 border-2 border-purple-600 rounded-lg bg-purple-50">
              <Zap className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Paid Promotion</h3>
              <ul className="space-y-1 text-sm text-left">
                <li>✓ Platform boost</li>
                <li>✓ Social media ads</li>
                <li>✓ Retargeting campaigns</li>
                <li>✓ Influencer partnerships</li>
              </ul>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Award className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Automation</h3>
              <ul className="space-y-1 text-sm text-left">
                <li>✓ Email sequences</li>
                <li>✓ Social scheduling</li>
                <li>✓ Abandoned cart recovery</li>
                <li>✓ Timeline reminders</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promotional Timeline Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Promotional Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-4 p-3 bg-green-50 rounded-lg">
              <Clock className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <p className="font-semibold">Launch Phase (4 weeks out)</p>
                <p className="text-sm text-gray-600">Announcement, early bird pricing</p>
              </div>
              <Badge variant="success">Completed</Badge>
            </div>
            <div className="flex items-center gap-4 p-3 bg-purple-50 rounded-lg border-2 border-purple-300">
              <Clock className="h-5 w-5 text-purple-600 animate-pulse" />
              <div className="flex-1">
                <p className="font-semibold">Build Phase (3 weeks out)</p>
                <p className="text-sm text-gray-600">Content teasers, social engagement</p>
              </div>
              <Badge>Current</Badge>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="font-semibold">Push Phase (2 weeks out)</p>
                <p className="text-sm text-gray-600">Testimonials, FOMO campaigns</p>
              </div>
              <Badge variant="secondary">Upcoming</Badge>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-gray-400" />
              <div className="flex-1">
                <p className="font-semibold">Final Push (1 week out)</p>
                <p className="text-sm text-gray-600">Last chance, urgency messaging</p>
              </div>
              <Badge variant="secondary">Upcoming</Badge>
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
          <div className="text-3xl font-bold text-green-600">{phaseStats.marketingChannels}</div>
          <p className="text-gray-600 mt-1">Marketing Channels</p>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{phaseStats.automationFeatures}</div>
          <p className="text-gray-600 mt-1">Automation Features</p>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">{phaseStats.analyticsMetrics}</div>
          <p className="text-gray-600 mt-1">Analytics Metrics</p>
        </div>
      </div>

      {/* Implementation Details */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🚀 Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">SEO & Discovery</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Real-time SEO scoring system</li>
              <li>• Keyword optimization suggestions</li>
              <li>• Meta tags and structured data</li>
              <li>• Search result preview</li>
              <li>• Featured placement options</li>
              <li>• Category and tag management</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Social Media</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Auto-generated post templates</li>
              <li>• Multi-platform scheduling</li>
              <li>• Countdown graphics generator</li>
              <li>• Story templates library</li>
              <li>• Hashtag recommendations</li>
              <li>• Influencer collaboration packs</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Email Marketing</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Automated email sequences</li>
              <li>• Segment-based targeting</li>
              <li>• Abandoned cart recovery</li>
              <li>• A/B testing capabilities</li>
              <li>• Template library</li>
              <li>• Performance analytics</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Partnerships & Ads</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Co-host collaboration tools</li>
              <li>• Affiliate program management</li>
              <li>• Sponsorship packages</li>
              <li>• Media kit generator</li>
              <li>• Paid promotion campaigns</li>
              <li>• ROI tracking and optimization</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}