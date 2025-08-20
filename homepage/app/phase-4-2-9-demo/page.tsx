'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SeriesSetup } from '@/components/events/series/series-setup';
import { PricingStrategy } from '@/components/events/series/pricing-strategy';
import { ContentPlanning } from '@/components/events/series/content-planning';
import { CommunityBuilding } from '@/components/events/series/community-building';
import { RecurringPatterns } from '@/components/events/series/recurring-patterns';
import { SeriesManagement } from '@/components/events/series/series-management';
import {
  Sparkles,
  Calendar,
  DollarSign,
  FileText,
  Users,
  Repeat,
  BarChart3,
  ArrowRight,
  Play,
  Settings,
  Target,
  TrendingUp,
  Award,
  Clock
} from 'lucide-react';
import Link from 'next/link';

export default function Phase429Demo() {
  const [activeTab, setActiveTab] = useState('setup');

  // Phase statistics
  const phaseStats = {
    components: 6,
    seriesFeatures: 25,
    automationTools: 12,
    analyticsMetrics: 35
  };

  // Sample series data
  const sampleSeries = {
    title: "Haitian Culture & Heritage Series",
    theme: "Exploring the rich tapestry of Haitian culture and heritage",
    events: 8,
    expectedRevenue: 65000,
    expectedAttendees: 1200
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 4.2.9: Recurring & Series Events
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Create engaging event series with automated recurring patterns, comprehensive pricing strategies, 
          community building tools, and advanced series management capabilities
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Series Creation
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Pricing Strategy
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Content Planning
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Community Building
          </span>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            Recurring Patterns
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Series Management
          </span>
        </div>
      </div>

      {/* Live Demo Links */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">🎯 Series Events Platform Ready</h2>
        <p className="mb-6 text-lg opacity-90">
          Complete solution for creating and managing recurring event series with automated scheduling, 
          community building, advanced pricing strategies, and comprehensive analytics
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/events/series/create">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Create Series
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/events/series/manage">
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Manage Series
            </Button>
          </Link>
        </div>
      </div>

      {/* Series Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Series Management Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{sampleSeries.events}</p>
              <p className="text-xs text-gray-600">Events Planned</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">${sampleSeries.expectedRevenue.toLocaleString()}</p>
              <p className="text-xs text-gray-600">Expected Revenue</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">{sampleSeries.expectedAttendees.toLocaleString()}</p>
              <p className="text-xs text-gray-600">Expected Attendees</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Calendar className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">Weekly</p>
              <p className="text-xs text-gray-600">Recurrence Pattern</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Award className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">750</p>
              <p className="text-xs text-gray-600">Community Members</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 md:grid-cols-6 w-full">
          <TabsTrigger value="setup">
            <Sparkles className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Setup</span>
          </TabsTrigger>
          <TabsTrigger value="pricing">
            <DollarSign className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Pricing</span>
          </TabsTrigger>
          <TabsTrigger value="content">
            <FileText className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Content</span>
          </TabsTrigger>
          <TabsTrigger value="community">
            <Users className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Community</span>
          </TabsTrigger>
          <TabsTrigger value="patterns">
            <Repeat className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Patterns</span>
          </TabsTrigger>
          <TabsTrigger value="management">
            <BarChart3 className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Management</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="setup" className="mt-6">
          <SeriesSetup
            onCreateSeries={(series) => console.log('Create series:', series)}
            onUpdateSeries={(series) => console.log('Update series:', series)}
            onAddEvent={(event) => console.log('Add event:', event)}
            onRemoveEvent={(eventId) => console.log('Remove event:', eventId)}
          />
        </TabsContent>

        <TabsContent value="pricing" className="mt-6">
          <PricingStrategy
            seriesLength={8}
            individualEventPrice={50}
            onUpdatePricing={(pricing) => console.log('Update pricing:', pricing)}
            onSavePricing={() => console.log('Save pricing strategy')}
          />
        </TabsContent>

        <TabsContent value="content" className="mt-6">
          <ContentPlanning
            seriesTitle={sampleSeries.title}
            numberOfEvents={sampleSeries.events}
            onSaveContent={(content) => console.log('Save content:', content)}
            onExportPlan={() => console.log('Export content plan')}
          />
        </TabsContent>

        <TabsContent value="community" className="mt-6">
          <CommunityBuilding
            seriesTitle={sampleSeries.title}
            expectedParticipants={sampleSeries.expectedAttendees}
            onSaveCommunity={(community) => console.log('Save community:', community)}
            onCreateEvent={(event) => console.log('Create community event:', event)}
          />
        </TabsContent>

        <TabsContent value="patterns" className="mt-6">
          <RecurringPatterns
            seriesTitle={sampleSeries.title}
            onSavePattern={(pattern) => console.log('Save pattern:', pattern)}
            onActivatePattern={(patternId) => console.log('Activate pattern:', patternId)}
            onPausePattern={(patternId) => console.log('Pause pattern:', patternId)}
          />
        </TabsContent>

        <TabsContent value="management" className="mt-6">
          <SeriesManagement
            seriesId="series-001"
            seriesTitle={sampleSeries.title}
            onEditSeries={() => console.log('Edit series')}
            onDuplicateSeries={() => console.log('Duplicate series')}
            onArchiveSeries={() => console.log('Archive series')}
          />
        </TabsContent>
      </Tabs>

      {/* Feature Highlights */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <Target className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Smart Series Creation</h3>
              <p className="text-sm text-gray-600 mb-3">
                Intelligent series setup with theme consistency, goal tracking, and automated scheduling
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Play className="h-4 w-4 mr-2" />
                Try Demo
              </Button>
            </div>
            <div className="text-center p-4 border-2 border-purple-600 rounded-lg bg-purple-50">
              <DollarSign className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Advanced Pricing</h3>
              <p className="text-sm text-gray-600 mb-3">
                Dynamic pricing strategies, bundle discounts, payment plans, and revenue optimization
              </p>
              <Button size="sm" className="w-full">
                <Settings className="h-4 w-4 mr-2" />
                Configure Pricing
              </Button>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Community Building</h3>
              <p className="text-sm text-gray-600 mb-3">
                Integrated community features, networking tools, and engagement tracking
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{phaseStats.components}</div>
          <p className="text-gray-600 mt-1">Core Components</p>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{phaseStats.seriesFeatures}</div>
          <p className="text-gray-600 mt-1">Series Features</p>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{phaseStats.automationTools}</div>
          <p className="text-gray-600 mt-1">Automation Tools</p>
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
            <h3 className="font-semibold mb-2 text-blue-700">Series Management</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Intelligent series creation with theme consistency</li>
              <li>• Automated event scheduling and generation</li>
              <li>• Goal tracking and performance analytics</li>
              <li>• Series progression and completion tracking</li>
              <li>• Flexible scheduling with seasonal adjustments</li>
              <li>• Series templates and duplication</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Pricing & Revenue</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Dynamic pricing tiers and bundle discounts</li>
              <li>• Early bird and loyalty discount systems</li>
              <li>• Flexible payment plans and installments</li>
              <li>• Group discounts and promotional codes</li>
              <li>• Revenue projections and optimization</li>
              <li>• Scarcity and urgency marketing tools</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Content & Planning</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Structured content module system</li>
              <li>• Learning objectives and material tracking</li>
              <li>• Content templates and reusable components</li>
              <li>• Progressive content difficulty planning</li>
              <li>• Quality checklists and best practices</li>
              <li>• Content performance analytics</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Community & Engagement</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Integrated community platform features</li>
              <li>• Member leveling and badge systems</li>
              <li>• Networking and connection tools</li>
              <li>• Community events and meetups</li>
              <li>• Engagement tracking and analytics</li>
              <li>• Recognition and reward systems</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}