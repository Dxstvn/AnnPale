'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  DollarSign,
  Target,
  TrendingUp,
  Users,
  Eye,
  MousePointer,
  BarChart,
  Zap,
  Settings,
  Calendar,
  MapPin,
  Globe,
  Smartphone,
  Monitor,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  ChevronUp,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Campaign {
  id: string;
  name: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  status: 'active' | 'paused' | 'completed';
  roi: number;
}

interface PaidPromotionProps {
  eventId: string;
  eventTitle: string;
  currentBudget?: number;
  onCreateCampaign?: (campaign: Partial<Campaign>) => void;
  onUpdateBudget?: (budget: number) => void;
  onBoostEvent?: (type: string, budget: number) => void;
  onPauseCampaign?: (campaignId: string) => void;
}

export function PaidPromotion({
  eventId,
  eventTitle,
  currentBudget = 0,
  onCreateCampaign,
  onUpdateBudget,
  onBoostEvent,
  onPauseCampaign
}: PaidPromotionProps) {
  const [dailyBudget, setDailyBudget] = React.useState(50);
  const [totalBudget, setTotalBudget] = React.useState(500);
  const [targetAudience, setTargetAudience] = React.useState({
    age: [25, 45],
    location: 'United States',
    interests: ['Music', 'Culture', 'Entertainment']
  });

  // Active campaigns
  const campaigns: Campaign[] = [
    {
      id: '1',
      name: 'Homepage Feature',
      budget: 200,
      spent: 145,
      impressions: 12500,
      clicks: 425,
      conversions: 28,
      status: 'active',
      roi: 240
    },
    {
      id: '2',
      name: 'Social Media Boost',
      budget: 150,
      spent: 89,
      impressions: 8900,
      clicks: 312,
      conversions: 18,
      status: 'active',
      roi: 180
    }
  ];

  // Calculate totals
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalImpressions = campaigns.reduce((sum, c) => sum + c.impressions, 0);
  const totalClicks = campaigns.reduce((sum, c) => sum + c.clicks, 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + c.conversions, 0);
  const avgROI = campaigns.length > 0 
    ? campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length 
    : 0;

  // Boost options
  const boostOptions = [
    {
      name: 'Quick Boost',
      description: '24-hour visibility boost',
      price: 49,
      features: ['Homepage placement', '5,000 impressions', 'Social promotion']
    },
    {
      name: 'Week Boost',
      description: '7-day campaign',
      price: 199,
      features: ['Featured listing', '25,000 impressions', 'Email inclusion', 'Social ads']
    },
    {
      name: 'Max Boost',
      description: 'Maximum exposure',
      price: 499,
      features: ['Premium placement', '100,000 impressions', 'Full marketing', 'Retargeting']
    }
  ];

  // Audience insights
  const audienceInsights = {
    totalReach: 45000,
    engagement: 3.4,
    demographics: [
      { category: '25-34 years', percentage: 35 },
      { category: '35-44 years', percentage: 28 },
      { category: '18-24 years', percentage: 22 },
      { category: '45+ years', percentage: 15 }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Campaign Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <DollarSign className="h-6 w-6 text-purple-600 mx-auto mb-1" />
              <p className="text-2xl font-bold">${totalSpent}</p>
              <p className="text-xs text-gray-600">Spent</p>
            </div>
            <div className="text-center">
              <Eye className="h-6 w-6 text-blue-600 mx-auto mb-1" />
              <p className="text-2xl font-bold">{(totalImpressions / 1000).toFixed(1)}K</p>
              <p className="text-xs text-gray-600">Impressions</p>
            </div>
            <div className="text-center">
              <MousePointer className="h-6 w-6 text-green-600 mx-auto mb-1" />
              <p className="text-2xl font-bold">{totalClicks}</p>
              <p className="text-xs text-gray-600">Clicks</p>
            </div>
            <div className="text-center">
              <CheckCircle className="h-6 w-6 text-pink-600 mx-auto mb-1" />
              <p className="text-2xl font-bold">{totalConversions}</p>
              <p className="text-xs text-gray-600">Conversions</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-1" />
              <p className="text-2xl font-bold">{avgROI.toFixed(0)}%</p>
              <p className="text-xs text-gray-600">ROI</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Campaigns */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Campaigns</CardTitle>
            <Button size="sm">
              <Zap className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h4 className="font-semibold">{campaign.name}</h4>
                    <Badge variant={campaign.status === 'active' ? 'success' : 'secondary'}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>Budget Used</span>
                      <span>${campaign.spent} / ${campaign.budget}</span>
                    </div>
                    <Progress value={(campaign.spent / campaign.budget) * 100} className="h-2" />
                  </div>
                  
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div>
                      <p className="text-xs text-gray-600">Impressions</p>
                      <p className="font-semibold text-sm">{(campaign.impressions / 1000).toFixed(1)}K</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Clicks</p>
                      <p className="font-semibold text-sm">{campaign.clicks}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">CTR</p>
                      <p className="font-semibold text-sm">{((campaign.clicks / campaign.impressions) * 100).toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">ROI</p>
                      <p className="font-semibold text-sm text-green-600">+{campaign.roi}%</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Boost Options */}
      <Card>
        <CardHeader>
          <CardTitle>Boost Your Event</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {boostOptions.map((option) => (
              <Card key={option.name} className={cn(
                "p-4",
                option.name === 'Week Boost' && "border-purple-600 bg-purple-50"
              )}>
                <div className="text-center mb-3">
                  <h4 className="font-semibold">{option.name}</h4>
                  <p className="text-xs text-gray-600">{option.description}</p>
                  <p className="text-2xl font-bold text-purple-600 mt-2">${option.price}</p>
                </div>
                <ul className="space-y-1 mb-3">
                  {option.features.map((feature, index) => (
                    <li key={index} className="text-xs flex items-start gap-1">
                      <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full"
                  variant={option.name === 'Week Boost' ? 'default' : 'outline'}
                  onClick={() => onBoostEvent?.(option.name, option.price)}
                >
                  Boost Now
                </Button>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Budget Control */}
      <Card>
        <CardHeader>
          <CardTitle>Budget Control</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Daily Budget</Label>
              <span className="text-sm font-semibold">${dailyBudget}/day</span>
            </div>
            <Slider
              value={[dailyBudget]}
              onValueChange={(value) => setDailyBudget(value[0])}
              max={200}
              step={10}
              className="mb-2"
            />
            <p className="text-xs text-gray-600">
              Estimated reach: {(dailyBudget * 100).toLocaleString()} people/day
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Total Campaign Budget</Label>
              <span className="text-sm font-semibold">${totalBudget}</span>
            </div>
            <Slider
              value={[totalBudget]}
              onValueChange={(value) => setTotalBudget(value[0])}
              max={2000}
              step={50}
              className="mb-2"
            />
            <p className="text-xs text-gray-600">
              Campaign duration: {Math.floor(totalBudget / dailyBudget)} days
            </p>
          </div>

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-sm">
              We'll automatically optimize your budget distribution for maximum results
            </AlertDescription>
          </Alert>

          <Button 
            className="w-full"
            onClick={() => onUpdateBudget?.(totalBudget)}
          >
            Update Budget
          </Button>
        </CardContent>
      </Card>

      {/* Target Audience */}
      <Card>
        <CardHeader>
          <CardTitle>Target Audience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Age Range</Label>
            <div className="flex items-center gap-3 mt-2">
              <Input type="number" value={targetAudience.age[0]} className="w-20" readOnly />
              <span>to</span>
              <Input type="number" value={targetAudience.age[1]} className="w-20" readOnly />
              <span className="text-sm text-gray-600">years old</span>
            </div>
          </div>

          <div>
            <Label>Location</Label>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="h-4 w-4 text-gray-600" />
              <select className="flex-1 px-3 py-2 border rounded-lg">
                <option>United States</option>
                <option>Haiti</option>
                <option>Canada</option>
                <option>France</option>
              </select>
            </div>
          </div>

          <div>
            <Label>Interests</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {targetAudience.interests.map((interest) => (
                <Badge key={interest} variant="secondary">
                  {interest}
                </Badge>
              ))}
              <Button variant="outline" size="sm">
                + Add Interest
              </Button>
            </div>
          </div>

          <div>
            <Label>Device Targeting</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <Smartphone className="h-4 w-4" />
                  <span className="text-sm">Mobile</span>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <Monitor className="h-4 w-4" />
                  <span className="text-sm">Desktop</span>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audience Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Audience Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-semibold">Estimated Reach</p>
                <p className="text-sm text-gray-600">Based on your targeting</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-blue-600">{(audienceInsights.totalReach / 1000).toFixed(0)}K</p>
                <p className="text-xs text-gray-600">people</p>
              </div>
            </div>

            <div>
              <Label className="text-sm mb-2">Age Distribution</Label>
              <div className="space-y-2">
                {audienceInsights.demographics.map((demo) => (
                  <div key={demo.category}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span>{demo.category}</span>
                      <span>{demo.percentage}%</span>
                    </div>
                    <Progress value={demo.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ROI Tracking */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            ROI Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Cost per Click</p>
              <p className="text-xl font-bold">${(totalSpent / totalClicks).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Cost per Conversion</p>
              <p className="text-xl font-bold">${(totalSpent / totalConversions).toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Revenue Generated</p>
              <p className="text-xl font-bold text-green-600">${(totalConversions * 50).toFixed(0)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Net Profit</p>
              <p className="text-xl font-bold text-green-600">
                ${((totalConversions * 50) - totalSpent).toFixed(0)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}