'use client';

import { useState } from 'react';
import { EventCreationWizard, type EventData } from '@/components/events/event-creation-wizard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Ticket,
  Settings,
  Megaphone,
  FileCheck,
  Rocket,
  ArrowRight,
  Music,
  Users,
  MessageCircle,
  GraduationCap,
  PartyPopper,
  Video,
  CheckCircle,
  Star
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

// Event Templates based on Phase 4.2.4
const EVENT_TEMPLATES = [
  {
    id: 'concert',
    name: 'Concert/Performance',
    icon: Music,
    description: 'Live music or performance show',
    color: 'bg-purple-500',
    template: {
      type: 'concert',
      category: 'Music & Performance',
      duration: 120,
      interactionLevel: 'limited' as const,
      recordingAllowed: true,
      tickets: [
        { tierId: 'general', name: 'General Admission', price: 25, capacity: 500, perks: [] },
        { tierId: 'vip', name: 'VIP', price: 75, capacity: 100, perks: [] }
      ]
    }
  },
  {
    id: 'workshop',
    name: 'Workshop/Masterclass',
    icon: GraduationCap,
    description: 'Educational or skill-building session',
    color: 'bg-green-500',
    template: {
      type: 'workshop',
      category: 'Education & Workshops',
      duration: 90,
      interactionLevel: 'full' as const,
      recordingAllowed: true,
      replayAvailable: true,
      tickets: [
        { tierId: 'standard', name: 'Standard', price: 45, capacity: 50, perks: [] },
        { tierId: 'premium', name: 'Premium (with materials)', price: 95, capacity: 20, perks: [] }
      ]
    }
  },
  {
    id: 'meetgreet',
    name: 'Meet & Greet',
    icon: Users,
    description: 'Personal interaction with fans',
    color: 'bg-blue-500',
    template: {
      type: 'meetgreet',
      category: 'Entertainment',
      duration: 60,
      interactionLevel: 'full' as const,
      recordingAllowed: false,
      tickets: [
        { tierId: 'standard', name: 'Standard Meet', price: 50, capacity: 30, perks: [] },
        { tierId: 'vip', name: 'VIP Experience', price: 150, capacity: 10, perks: [] }
      ]
    }
  },
  {
    id: 'qa',
    name: 'Q&A Session',
    icon: MessageCircle,
    description: 'Question and answer format',
    color: 'bg-yellow-500',
    template: {
      type: 'qa',
      category: 'Entertainment',
      duration: 45,
      interactionLevel: 'full' as const,
      recordingAllowed: true,
      tickets: [
        { tierId: 'general', name: 'General Access', price: 15, capacity: 200, perks: [] }
      ]
    }
  },
  {
    id: 'watch',
    name: 'Watch Party',
    icon: Video,
    description: 'Group viewing experience',
    color: 'bg-red-500',
    template: {
      type: 'watch',
      category: 'Entertainment',
      duration: 180,
      interactionLevel: 'full' as const,
      tickets: [
        { tierId: 'free', name: 'Free Access', price: 0, capacity: 1000, perks: [] },
        { tierId: 'premium', name: 'Premium (No ads)', price: 5, capacity: 500, perks: [] }
      ]
    }
  },
  {
    id: 'celebration',
    name: 'Birthday/Celebration',
    icon: PartyPopper,
    description: 'Special occasion celebration',
    color: 'bg-pink-500',
    template: {
      type: 'celebration',
      category: 'Entertainment',
      duration: 120,
      interactionLevel: 'full' as const,
      accessType: 'private' as const,
      tickets: [
        { tierId: 'guest', name: 'Guest', price: 0, capacity: 100, perks: [] }
      ]
    }
  }
];

export default function Phase424Demo() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  const handleSaveEvent = (data: EventData, isDraft: boolean) => {
    console.log('Saving event:', { data, isDraft });
  };

  const handlePublishEvent = (data: EventData) => {
    console.log('Publishing event:', data);
    alert('Event published successfully!');
    setShowWizard(false);
  };

  const handleCancelWizard = () => {
    setShowWizard(false);
    setSelectedTemplate(null);
  };

  const startWithTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowWizard(true);
  };

  const selectedTemplateData = EVENT_TEMPLATES.find(t => t.id === selectedTemplate);

  // Phase statistics
  const phaseStats = {
    wizardSteps: 6,
    templates: 6,
    configOptions: 12,
    ticketTiers: 5,
    promotionOptions: 5,
    customFields: 20
  };

  if (showWizard) {
    return (
      <div className="container mx-auto py-8">
        <EventCreationWizard
          template={selectedTemplateData?.template.type}
          initialData={selectedTemplateData?.template}
          onSave={handleSaveEvent}
          onPublish={handlePublishEvent}
          onCancel={handleCancelWizard}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 4.2.4: Event Creation Wizard
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Comprehensive 6-step wizard enabling creators to easily plan and configure professional 
          events with templates, custom options, and marketing tools
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            6-Step Wizard
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Event Templates
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Ticket Tiers
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Scheduling
          </span>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            Promotion Tools
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Configuration
          </span>
        </div>
      </div>

      {/* Live Demo Links */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">🎯 Event Creation Platform Ready</h2>
        <p className="mb-6 text-lg opacity-90">
          Intuitive step-by-step wizard with templates, comprehensive configuration options, 
          and built-in promotion tools for creating professional virtual events
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
            onClick={() => setShowWizard(true)}
          >
            <Rocket className="w-5 h-5 mr-2" />
            Create Event
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Link href="/creator/events">
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <Calendar className="w-5 h-5 mr-2" />
              My Events
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Templates */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Quick Start Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {EVENT_TEMPLATES.map((template) => {
            const Icon = template.icon;
            return (
              <Card 
                key={template.id}
                className="cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
                onClick={() => startWithTemplate(template.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={cn("p-3 rounded-lg text-white", template.color)}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-gray-600">{template.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{template.template.duration} minutes</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Ticket className="h-4 w-4 text-gray-500" />
                      <span>{template.template.tickets.length} ticket tiers</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span>{template.template.interactionLevel} interaction</span>
                    </div>
                  </div>
                  <Button className="w-full mt-4" variant="outline">
                    Use Template
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Wizard Steps Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Event Creation Process</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { icon: FileCheck, title: 'Basic Details', items: ['Title', 'Type', 'Description', 'Media'] },
              { icon: Calendar, title: 'Schedule', items: ['Date & Time', 'Duration', 'Timezone', 'Recurring'] },
              { icon: Ticket, title: 'Tickets', items: ['Tiers', 'Pricing', 'Capacity', 'Discounts'] },
              { icon: Settings, title: 'Details', items: ['Agenda', 'Requirements', 'Languages', 'Settings'] },
              { icon: Megaphone, title: 'Promotion', items: ['SEO', 'Email', 'Social', 'Affiliates'] },
              { icon: Rocket, title: 'Review', items: ['Preview', 'Terms', 'Publish', 'Schedule'] }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-gray-100 rounded-lg p-3 mb-2">
                    <Icon className="h-8 w-8 mx-auto text-gray-600" />
                  </div>
                  <p className="font-medium text-sm">{step.title}</p>
                  <div className="mt-2 space-y-1">
                    {step.items.map((item, i) => (
                      <p key={i} className="text-xs text-gray-500">{item}</p>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Event Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Access Type</span>
                <Badge>Public / Private / Unlisted</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Recording</span>
                <Badge>Allowed / Prohibited</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Replay</span>
                <Badge>Available / One-time</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Interaction</span>
                <Badge>Full / Limited / View-only</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Cancellation</span>
                <Badge>Refundable / Final</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Custom Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Hybrid format support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Multi-session series</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Breakout rooms</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Networking time</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">VIP experiences</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{phaseStats.wizardSteps}</div>
          <p className="text-gray-600 mt-1">Wizard Steps</p>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{phaseStats.templates}</div>
          <p className="text-gray-600 mt-1">Event Templates</p>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{phaseStats.configOptions}</div>
          <p className="text-gray-600 mt-1">Config Options</p>
        </div>
      </div>

      {/* Implementation Details */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🚀 Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Wizard Steps</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Step 1: Basic details (title, type, description, media)</li>
              <li>• Step 2: Schedule (date, time, duration, recurring)</li>
              <li>• Step 3: Tickets & pricing (tiers, capacity, discounts)</li>
              <li>• Step 4: Event details (agenda, requirements, settings)</li>
              <li>• Step 5: Promotion (SEO, email, social, affiliates)</li>
              <li>• Step 6: Review & publish (preview, terms, publish)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Templates & Configuration</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 6 quick-start event templates</li>
              <li>• Custom configuration for each event type</li>
              <li>• Multi-tier ticket pricing system</li>
              <li>• Recurring event support</li>
              <li>• Group discounts and promo codes</li>
              <li>• Multiple language support</li>
              <li>• Recording and replay options</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Promotion Features</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• SEO optimization settings</li>
              <li>• Email blast scheduling</li>
              <li>• Social media integration</li>
              <li>• Featured listing option</li>
              <li>• Affiliate program setup</li>
              <li>• Custom share messages</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Creator Tools</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Draft saving functionality</li>
              <li>• Event preview before publishing</li>
              <li>• Terms and conditions agreement</li>
              <li>• Schedule or publish immediately</li>
              <li>• Edit published events</li>
              <li>• Clone existing events</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}