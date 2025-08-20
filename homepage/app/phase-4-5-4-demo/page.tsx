'use client';

import * as React from 'react';
import { ContentAccessHierarchy } from '@/components/subscription/content/content-access-hierarchy';
import { ContentCalendar } from '@/components/subscription/content/content-calendar';
import { AutoPublishingQueue } from '@/components/subscription/content/auto-publishing-queue';
import { ContentPerformanceAnalytics } from '@/components/subscription/content/content-performance-analytics';
import { ContentRecyclingTools } from '@/components/subscription/content/content-recycling-tools';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Lock, 
  Calendar, 
  Timer, 
  BarChart3, 
  RefreshCw,
  Info,
  Settings
} from 'lucide-react';
import Link from 'next/link';

export default function Phase454Demo() {
  const [userTier, setUserTier] = React.useState<'none' | 'bronze' | 'silver' | 'gold'>('silver');
  const [activeTab, setActiveTab] = React.useState('hierarchy');

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Phase 4.5.4: Exclusive Content Management</h1>
              <p className="text-gray-600">Create and manage exclusive content with tier-based access</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-700">
            Phase 4.5.4
          </Badge>
        </div>

        {/* Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Content Management System Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                This comprehensive content management system enables creators to effectively manage, schedule, 
                and optimize their exclusive content across different subscription tiers.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Key Features:</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <Lock className="h-4 w-4 mt-0.5 text-purple-600" />
                      <span>Content Access Hierarchy - Tier-based content restrictions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 mt-0.5 text-purple-600" />
                      <span>Content Calendar - Visual scheduling and planning</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Timer className="h-4 w-4 mt-0.5 text-purple-600" />
                      <span>Auto-Publishing Queue - Automated content distribution</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <BarChart3 className="h-4 w-4 mt-0.5 text-purple-600" />
                      <span>Performance Analytics - Data-driven optimization</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <RefreshCw className="h-4 w-4 mt-0.5 text-purple-600" />
                      <span>Content Recycling - Maximize content value</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Benefits:</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Streamlined content workflow management</li>
                    <li>• Clear tier segmentation for targeted content</li>
                    <li>• Automated publishing reduces manual work</li>
                    <li>• Data insights improve content strategy</li>
                    <li>• Content repurposing increases ROI</li>
                    <li>• Consistent posting schedule builds audience</li>
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Content Strategy Framework:</h3>
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-blue-800">Public Content (Free):</span>
                    <p className="text-blue-700">Teasers, samples, CTAs</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Subscriber Content:</span>
                    <p className="text-blue-700">Full library, behind-scenes</p>
                  </div>
                  <div>
                    <span className="font-medium text-blue-800">Tier-Exclusive:</span>
                    <p className="text-blue-700">Premium content by tier level</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Configuration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Demo Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <label className="text-sm font-medium">Simulate User Tier</label>
              <div className="flex gap-2 mt-2">
                <Button
                  variant={userTier === 'none' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUserTier('none')}
                >
                  Free User
                </Button>
                <Button
                  variant={userTier === 'bronze' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUserTier('bronze')}
                >
                  Bronze
                </Button>
                <Button
                  variant={userTier === 'silver' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUserTier('silver')}
                >
                  Silver
                </Button>
                <Button
                  variant={userTier === 'gold' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setUserTier('gold')}
                >
                  Gold
                </Button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Change tier to see how content access changes in the hierarchy view
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Management Tools */}
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="hierarchy">
                  <Lock className="h-4 w-4 mr-2" />
                  Access
                </TabsTrigger>
                <TabsTrigger value="calendar">
                  <Calendar className="h-4 w-4 mr-2" />
                  Calendar
                </TabsTrigger>
                <TabsTrigger value="queue">
                  <Timer className="h-4 w-4 mr-2" />
                  Queue
                </TabsTrigger>
                <TabsTrigger value="analytics">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="recycling">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Recycle
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="hierarchy">
                  <ContentAccessHierarchy 
                    currentUserTier={userTier}
                    showAnalytics={true}
                  />
                </TabsContent>

                <TabsContent value="calendar">
                  <ContentCalendar 
                    view="month"
                  />
                </TabsContent>

                <TabsContent value="queue">
                  <AutoPublishingQueue />
                </TabsContent>

                <TabsContent value="analytics">
                  <ContentPerformanceAnalytics 
                    timeRange="7d"
                  />
                </TabsContent>

                <TabsContent value="recycling">
                  <ContentRecyclingTools />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Implementation Notes */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Implementation Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>Content Hierarchy:</strong> The access hierarchy ensures clear boundaries between 
                free and paid content, with progressive value across tiers to encourage upgrades.
              </p>
              <p>
                <strong>Scheduling System:</strong> The calendar and auto-publishing queue work together to 
                maintain consistent content delivery without manual intervention.
              </p>
              <p>
                <strong>Analytics Integration:</strong> Performance metrics help creators understand what 
                content resonates with their audience and optimize their strategy.
              </p>
              <p>
                <strong>Content Recycling:</strong> Tools to repurpose existing content into new formats 
                maximize the value of created content and reduce production workload.
              </p>
              <p>
                <strong>Tier Segmentation:</strong> Content can be targeted to specific subscription tiers, 
                ensuring each tier receives appropriate value for their investment.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}