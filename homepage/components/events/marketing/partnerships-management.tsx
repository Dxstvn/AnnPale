'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Users,
  Handshake,
  Gift,
  Link,
  Share2,
  DollarSign,
  Target,
  Award,
  FileText,
  Download,
  Plus,
  Edit,
  Send,
  CheckCircle,
  Clock,
  TrendingUp,
  Star,
  Building,
  UserPlus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Partner {
  id: string;
  name: string;
  type: 'co-host' | 'sponsor' | 'affiliate' | 'media';
  status: 'pending' | 'active' | 'completed';
  avatar?: string;
  contribution?: string;
  revenue?: number;
  referrals?: number;
}

interface PartnershipsManagementProps {
  eventId: string;
  onAddPartner?: (partner: Partial<Partner>) => void;
  onGenerateMediaKit?: () => void;
  onCreateAffiliateLink?: (partnerId: string) => void;
  onSendInvite?: (email: string, type: string) => void;
}

export function PartnershipsManagement({
  eventId,
  onAddPartner,
  onGenerateMediaKit,
  onCreateAffiliateLink,
  onSendInvite
}: PartnershipsManagementProps) {
  const [inviteEmail, setInviteEmail] = React.useState('');
  const [inviteType, setInviteType] = React.useState<'co-host' | 'sponsor' | 'affiliate' | 'media'>('co-host');

  // Sample partners
  const partners: Partner[] = [
    {
      id: '1',
      name: 'Marie Joseph',
      type: 'co-host',
      status: 'active',
      contribution: 'Co-hosting & Promotion',
      referrals: 45
    },
    {
      id: '2',
      name: 'Haiti Media Network',
      type: 'media',
      status: 'active',
      contribution: 'Press Coverage',
      referrals: 128
    },
    {
      id: '3',
      name: 'TechCorp Haiti',
      type: 'sponsor',
      status: 'pending',
      contribution: '$5,000 Sponsorship',
      revenue: 5000
    }
  ];

  // Affiliate stats
  const affiliateStats = {
    totalAffiliates: 24,
    totalReferrals: 367,
    conversionRate: 18,
    totalRevenue: 8940
  };

  // Sponsorship tiers
  const sponsorshipTiers = [
    { name: 'Platinum', amount: 10000, benefits: ['Logo on all materials', 'Speaking slot', 'VIP tickets (10)', 'Booth space'] },
    { name: 'Gold', amount: 5000, benefits: ['Logo on website', 'Social mentions', 'VIP tickets (5)', 'Email inclusion'] },
    { name: 'Silver', amount: 2500, benefits: ['Website listing', 'Social mention', 'VIP tickets (2)'] },
    { name: 'Bronze', amount: 1000, benefits: ['Website listing', 'Thank you mention'] }
  ];

  const handleSendInvite = () => {
    if (inviteEmail) {
      onSendInvite?.(inviteEmail, inviteType);
      setInviteEmail('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Partnership Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Partnership Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Handshake className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{partners.length}</p>
              <p className="text-xs text-gray-600">Active Partners</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{affiliateStats.totalReferrals}</p>
              <p className="text-xs text-gray-600">Total Referrals</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">${affiliateStats.totalRevenue}</p>
              <p className="text-xs text-gray-600">Partner Revenue</p>
            </div>
            <div className="text-center p-3 bg-pink-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-pink-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{affiliateStats.conversionRate}%</p>
              <p className="text-xs text-gray-600">Conversion Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Partners */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Current Partners</CardTitle>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Partner
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {partners.map((partner) => (
              <div key={partner.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={partner.avatar} />
                    <AvatarFallback>{partner.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{partner.name}</p>
                    <p className="text-sm text-gray-600">{partner.contribution}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={partner.type === 'sponsor' ? 'success' : 'secondary'}>
                    {partner.type}
                  </Badge>
                  {partner.referrals && (
                    <div className="text-right">
                      <p className="text-sm font-semibold">{partner.referrals}</p>
                      <p className="text-xs text-gray-600">referrals</p>
                    </div>
                  )}
                  {partner.revenue && (
                    <div className="text-right">
                      <p className="text-sm font-semibold">${partner.revenue}</p>
                      <p className="text-xs text-gray-600">contribution</p>
                    </div>
                  )}
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Co-Host Features */}
      <Card>
        <CardHeader>
          <CardTitle>Co-Host Collaboration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Share hosting duties and expand your reach with co-hosts
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border rounded-lg">
              <Users className="h-6 w-6 text-purple-600 mb-2" />
              <p className="font-semibold text-sm">Shared Hosting</p>
              <p className="text-xs text-gray-600">Multiple presenters</p>
            </div>
            <div className="p-3 border rounded-lg">
              <Share2 className="h-6 w-6 text-purple-600 mb-2" />
              <p className="font-semibold text-sm">Cross-Promotion</p>
              <p className="text-xs text-gray-600">Reach new audiences</p>
            </div>
            <div className="p-3 border rounded-lg">
              <DollarSign className="h-6 w-6 text-purple-600 mb-2" />
              <p className="font-semibold text-sm">Revenue Share</p>
              <p className="text-xs text-gray-600">Split earnings fairly</p>
            </div>
            <div className="p-3 border rounded-lg">
              <Target className="h-6 w-6 text-purple-600 mb-2" />
              <p className="font-semibold text-sm">Combined Reach</p>
              <p className="text-xs text-gray-600">Bigger audience pool</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sponsorship Packages */}
      <Card>
        <CardHeader>
          <CardTitle>Sponsorship Packages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {sponsorshipTiers.map((tier) => (
              <Card key={tier.name} className={cn(
                "p-4",
                tier.name === 'Platinum' && "border-purple-600 bg-purple-50"
              )}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold">{tier.name}</h4>
                    <p className="text-2xl font-bold text-purple-600">${tier.amount.toLocaleString()}</p>
                  </div>
                  {tier.name === 'Platinum' && (
                    <Star className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
                <ul className="space-y-1">
                  {tier.benefits.map((benefit, index) => (
                    <li key={index} className="text-xs flex items-start gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Affiliate Program */}
      <Card>
        <CardHeader>
          <CardTitle>Affiliate Program</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Program Settings</h4>
              <Badge variant="success">Active</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Commission Rate</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input type="number" defaultValue="20" className="w-20" />
                  <span className="text-sm">%</span>
                </div>
              </div>
              <div>
                <Label>Cookie Duration</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input type="number" defaultValue="30" className="w-20" />
                  <span className="text-sm">days</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm mb-2">Top Affiliates</h4>
            <div className="space-y-2">
              {[
                { name: 'Jean Baptiste', referrals: 87, earnings: 1740 },
                { name: 'Sophie Laurent', referrals: 62, earnings: 1240 },
                { name: 'Marcus Thompson', referrals: 45, earnings: 900 }
              ].map((affiliate) => (
                <div key={affiliate.name} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">{affiliate.name}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-sm">{affiliate.referrals} referrals</span>
                    <Badge variant="success">${affiliate.earnings}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button className="w-full">
            <Link className="h-4 w-4 mr-2" />
            Generate Affiliate Links
          </Button>
        </CardContent>
      </Card>

      {/* Media Kit */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Media Kit
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600">
            Professional media kit with everything partners need to promote your event
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">Event One-Pager</span>
              </div>
              <Badge>PDF</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <Gift className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">Promotional Assets</span>
              </div>
              <Badge>ZIP</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium">Sponsor Deck</span>
              </div>
              <Badge>PPT</Badge>
            </div>
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
            onClick={onGenerateMediaKit}
          >
            <Download className="h-4 w-4 mr-2" />
            Download Media Kit
          </Button>
        </CardContent>
      </Card>

      {/* Invite Partners */}
      <Card>
        <CardHeader>
          <CardTitle>Invite Partners</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Partner Type</Label>
            <select
              value={inviteType}
              onChange={(e) => setInviteType(e.target.value as any)}
              className="w-full px-3 py-2 border rounded-lg mt-1"
            >
              <option value="co-host">Co-Host</option>
              <option value="sponsor">Sponsor</option>
              <option value="affiliate">Affiliate</option>
              <option value="media">Media Partner</option>
            </select>
          </div>
          <div>
            <Label>Email Address</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="email"
                placeholder="partner@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <Button onClick={handleSendInvite}>
                <Send className="h-4 w-4 mr-2" />
                Send Invite
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}