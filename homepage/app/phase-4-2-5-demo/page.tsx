'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TicketSalesOverview } from '@/components/events/tickets/ticket-sales-overview';
import { AttendeeManagement, type Attendee } from '@/components/events/tickets/attendee-management';
import { PromotionalTools } from '@/components/events/tickets/promotional-tools';
import { TicketAnalytics } from '@/components/events/tickets/ticket-analytics';
import { DigitalTicket, type DigitalTicketData } from '@/components/events/tickets/digital-ticket';
import { CheckInSystem } from '@/components/events/tickets/check-in-system';
import {
  Ticket,
  Users,
  TrendingUp,
  Tag,
  BarChart,
  QrCode,
  ArrowRight,
  Calendar,
  Clock,
  MapPin,
  Star
} from 'lucide-react';
import Link from 'next/link';

// Sample data for demonstration
const SAMPLE_SALES_DATA = {
  totalSold: 487,
  totalCapacity: 600,
  revenue: 38960,
  remainingCapacity: 113,
  salesVelocity: {
    value: 23,
    trend: 'up' as const,
    percentChange: 15.4
  },
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  ticketTiers: [
    { id: 'general', name: 'General Admission', sold: 320, capacity: 400, price: 45, revenue: 14400 },
    { id: 'vip', name: 'VIP Experience', sold: 147, capacity: 150, price: 125, revenue: 18375 },
    { id: 'platinum', name: 'Platinum Package', sold: 20, capacity: 50, price: 295, revenue: 5900 }
  ]
};

const SAMPLE_ATTENDEES: Attendee[] = [
  {
    id: '1',
    name: 'Marie Joseph',
    email: 'marie.joseph@example.com',
    phone: '+1 (305) 555-0123',
    ticketTier: 'VIP Experience',
    ticketNumber: 'TKT-001234',
    purchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    checkInStatus: 'checked-in',
    checkInTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: '2',
    name: 'Jean-Claude Pierre',
    email: 'jcpierre@example.com',
    ticketTier: 'General Admission',
    ticketNumber: 'TKT-001235',
    purchaseDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    checkInStatus: 'not-arrived',
    refundRequested: true,
  },
  {
    id: '3',
    name: 'Sophia Laurent',
    email: 'sophia.l@example.com',
    phone: '+1 (786) 555-0456',
    ticketTier: 'Platinum Package',
    ticketNumber: 'TKT-001236',
    purchaseDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    checkInStatus: 'checked-in',
    checkInTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
  },
  {
    id: '4',
    name: 'Marcus Toussaint',
    email: 'mtoussaint@example.com',
    ticketTier: 'VIP Experience',
    ticketNumber: 'TKT-001237',
    purchaseDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    checkInStatus: 'not-arrived',
    upgradeRequested: true,
  },
];

const SAMPLE_DISCOUNT_CODES = [
  {
    id: '1',
    code: 'EARLY25',
    type: 'percentage' as const,
    value: 25,
    usageLimit: 100,
    usageCount: 67,
    validFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    active: true,
  },
  {
    id: '2',
    code: 'VIP50OFF',
    type: 'fixed' as const,
    value: 50,
    usageLimit: 50,
    usageCount: 12,
    validFrom: new Date(),
    active: true,
  },
];

const SAMPLE_COMPLIMENTARY_TICKETS = [
  {
    id: '1',
    recipientEmail: 'press@haitiantimes.com',
    recipientName: 'Haitian Times',
    ticketTier: 'VIP Experience',
    sentDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    claimed: true,
    notes: 'Press coverage',
  },
  {
    id: '2',
    recipientEmail: 'influencer@instagram.com',
    recipientName: 'Popular Creator',
    ticketTier: 'Platinum Package',
    sentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    claimed: false,
    notes: 'Social media promotion',
  },
];

const SAMPLE_AFFILIATE_PARTNERS = [
  {
    id: '1',
    name: 'Haiti Events Network',
    code: 'HEN2024',
    commission: 15,
    sales: 43,
    revenue: 3870,
    clicks: 1250,
    conversionRate: 3.4,
  },
  {
    id: '2',
    name: 'Caribbean Promotions',
    code: 'CARIB10',
    commission: 10,
    sales: 28,
    revenue: 2520,
    clicks: 890,
    conversionRate: 3.1,
  },
];

const SAMPLE_ANALYTICS_DATA = {
  salesFunnel: [
    { stage: 'Event Page Views', count: 8542, percentage: 100 },
    { stage: 'Ticket Selection', count: 3417, percentage: 40 },
    { stage: 'Checkout Started', count: 1537, percentage: 18 },
    { stage: 'Payment Info', count: 892, percentage: 10.4 },
    { stage: 'Purchase Complete', count: 487, percentage: 5.7 },
  ],
  trafficSources: [
    { source: 'Social Media', visits: 3420, conversions: 165, revenue: 14850 },
    { source: 'Email', visits: 2150, conversions: 134, revenue: 12060 },
    { source: 'Direct', visits: 1890, conversions: 98, revenue: 8820 },
    { source: 'Affiliate', visits: 1082, conversions: 71, revenue: 6390 },
    { source: 'Search', visits: 1000, conversions: 19, revenue: 1710 },
  ],
  geographicData: [
    { country: 'USA', city: 'Miami', sales: 142, percentage: 29.2 },
    { country: 'USA', city: 'New York', sales: 98, percentage: 20.1 },
    { country: 'Haiti', city: 'Port-au-Prince', sales: 67, percentage: 13.8 },
    { country: 'Canada', city: 'Montreal', sales: 54, percentage: 11.1 },
    { country: 'USA', city: 'Boston', sales: 43, percentage: 8.8 },
  ],
  deviceBreakdown: [
    { device: 'Desktop', sessions: 4250, conversions: 243, percentage: 49.9 },
    { device: 'Mobile', sessions: 3680, conversions: 198, percentage: 40.7 },
    { device: 'Tablet', sessions: 612, conversions: 46, percentage: 9.4 },
  ],
  salesOverTime: [
    { date: 'Mon', sales: 42, revenue: 3780 },
    { date: 'Tue', sales: 58, revenue: 5220 },
    { date: 'Wed', sales: 71, revenue: 6390 },
    { date: 'Thu', sales: 89, revenue: 8010 },
    { date: 'Fri', sales: 124, revenue: 11160 },
    { date: 'Sat', sales: 156, revenue: 14040 },
    { date: 'Sun', sales: 132, revenue: 11880 },
  ],
  conversionMetrics: {
    overallRate: 5.7,
    cartAbandonment: 42.1,
    averageOrderValue: 80,
    repeatPurchaseRate: 23.5,
  },
};

const SAMPLE_DIGITAL_TICKET: DigitalTicketData = {
  id: 'TKT-DEMO-001',
  eventName: 'Haitian Music Festival 2024',
  eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  eventTime: '7:00 PM EST',
  eventLocation: 'Miami Convention Center, Miami, FL',
  ticketHolder: {
    name: 'Marie Joseph',
    email: 'marie.joseph@example.com',
  },
  ticketDetails: {
    tier: 'VIP Experience',
    seatNumber: 'A-15',
    price: 125,
    purchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    orderNumber: 'ORD-2024-001234',
  },
  qrCode: 'https://annpale.com/ticket/TKT-DEMO-001',
  status: 'valid',
  transferable: true,
};

export default function Phase425Demo() {
  const [activeView, setActiveView] = useState('overview');

  // Phase statistics
  const phaseStats = {
    components: 6,
    features: 25,
    automations: 8,
    analytics: 12,
  };

  const handleCheckIn = async (ticketNumber: string) => {
    return {
      success: true,
      attendee: {
        name: 'Demo Attendee',
        email: 'demo@example.com',
        ticketTier: 'General Admission',
        ticketNumber: ticketNumber,
      },
      message: 'Successfully checked in!',
    };
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 4.2.5: Ticket Management System
        </h1>
        <p className="text-xl text-gray-600 max-w-4xl mx-auto">
          Comprehensive ticket inventory management, sales tracking, attendee access control, 
          and promotional tools with real-time analytics and digital ticket delivery
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Sales Dashboard
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Attendee Management
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Digital Tickets
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Check-In System
          </span>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            Promotional Tools
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Analytics
          </span>
        </div>
      </div>

      {/* Live Demo Links */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">🎟️ Ticket Management Platform Ready</h2>
        <p className="mb-6 text-lg opacity-90">
          Complete ticket lifecycle management from sales to check-in with real-time analytics, 
          promotional tools, and secure digital ticket delivery
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/events/tickets">
            <Button 
              size="lg" 
              className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
            >
              <Ticket className="w-5 h-5 mr-2" />
              Manage Tickets
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/events/check-in">
            <Button 
              size="lg" 
              variant="outline"
              className="border-white text-white hover:bg-white/10"
            >
              <QrCode className="w-5 h-5 mr-2" />
              Check-In Portal
            </Button>
          </Link>
        </div>
      </div>

      {/* Interactive Demo */}
      <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
        <TabsList className="grid grid-cols-3 lg:grid-cols-6 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="attendees">Attendees</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="digital">Digital Ticket</TabsTrigger>
          <TabsTrigger value="checkin">Check-In</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <TicketSalesOverview
            eventId="demo-event"
            salesData={SAMPLE_SALES_DATA}
            onManageTiers={() => console.log('Manage tiers')}
          />
        </TabsContent>

        <TabsContent value="attendees" className="space-y-6">
          <AttendeeManagement
            eventId="demo-event"
            attendees={SAMPLE_ATTENDEES}
            onContactAttendee={(attendee) => console.log('Contact:', attendee)}
            onProcessRefund={(attendee) => console.log('Refund:', attendee)}
            onProcessUpgrade={(attendee) => console.log('Upgrade:', attendee)}
            onCheckIn={(attendee) => console.log('Check in:', attendee)}
            onExport={() => console.log('Export attendees')}
          />
        </TabsContent>

        <TabsContent value="promotions" className="space-y-6">
          <PromotionalTools
            eventId="demo-event"
            discountCodes={SAMPLE_DISCOUNT_CODES}
            complimentaryTickets={SAMPLE_COMPLIMENTARY_TICKETS}
            affiliatePartners={SAMPLE_AFFILIATE_PARTNERS}
            onCreateDiscount={() => console.log('Create discount')}
            onEditDiscount={(code) => console.log('Edit:', code)}
            onDeleteDiscount={(code) => console.log('Delete:', code)}
            onSendComplimentary={() => console.log('Send comp tickets')}
            onAddAffiliate={() => console.log('Add affiliate')}
            onCreateLastMinuteOffer={() => console.log('Last minute offer')}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <TicketAnalytics
            eventId="demo-event"
            analyticsData={SAMPLE_ANALYTICS_DATA}
            dateRange={{
              start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              end: new Date()
            }}
          />
        </TabsContent>

        <TabsContent value="digital" className="space-y-6">
          <DigitalTicket
            ticket={SAMPLE_DIGITAL_TICKET}
            onTransfer={() => console.log('Transfer ticket')}
            onAddToWallet={() => console.log('Add to wallet')}
            onDownloadPDF={() => console.log('Download PDF')}
            onShare={() => console.log('Share ticket')}
          />
        </TabsContent>

        <TabsContent value="checkin" className="space-y-6">
          <CheckInSystem
            eventId="demo-event"
            onScanQR={handleCheckIn}
            onManualCheckIn={handleCheckIn}
            onUndoCheckIn={async () => true}
            stats={{
              totalAttendees: 600,
              checkedIn: 387,
              notArrived: 213,
              checkInRate: 8.5,
            }}
            isOnline={true}
          />
        </TabsContent>
      </Tabs>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <Ticket className="h-10 w-10 text-purple-600 mb-4" />
          <h3 className="font-semibold mb-2">Sales Management</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Real-time sales tracking</li>
            <li>• Multi-tier pricing</li>
            <li>• Capacity management</li>
            <li>• Revenue analytics</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <Users className="h-10 w-10 text-green-600 mb-4" />
          <h3 className="font-semibold mb-2">Attendee Control</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Attendee database</li>
            <li>• Refund processing</li>
            <li>• Upgrade requests</li>
            <li>• Bulk messaging</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <Tag className="h-10 w-10 text-blue-600 mb-4" />
          <h3 className="font-semibold mb-2">Promotional Tools</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Discount codes</li>
            <li>• Complimentary tickets</li>
            <li>• Affiliate program</li>
            <li>• Bundle deals</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <BarChart className="h-10 w-10 text-orange-600 mb-4" />
          <h3 className="font-semibold mb-2">Analytics Suite</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Sales funnel analysis</li>
            <li>• Traffic sources</li>
            <li>• Geographic data</li>
            <li>• Device breakdown</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <QrCode className="h-10 w-10 text-red-600 mb-4" />
          <h3 className="font-semibold mb-2">Digital Tickets</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• QR code generation</li>
            <li>• Mobile wallet support</li>
            <li>• Transfer capability</li>
            <li>• Anti-fraud measures</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <Star className="h-10 w-10 text-yellow-600 mb-4" />
          <h3 className="font-semibold mb-2">Check-In System</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• QR code scanning</li>
            <li>• Manual check-in</li>
            <li>• Offline support</li>
            <li>• Real-time sync</li>
          </ul>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">{phaseStats.components}</div>
          <p className="text-gray-600 mt-1">Components</p>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">{phaseStats.features}</div>
          <p className="text-gray-600 mt-1">Features</p>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">{phaseStats.automations}</div>
          <p className="text-gray-600 mt-1">Automations</p>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">{phaseStats.analytics}</div>
          <p className="text-gray-600 mt-1">Analytics</p>
        </div>
      </div>

      {/* Implementation Details */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🚀 Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Ticket Lifecycle</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Pre-sale setup and preview</li>
              <li>• Dynamic pricing and capacity</li>
              <li>• Waitlist management</li>
              <li>• Check-in and access control</li>
              <li>• Post-event feedback</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Access Control</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Unique QR codes</li>
              <li>• Transfer capability</li>
              <li>• Mobile wallet integration</li>
              <li>• Self check-in system</li>
              <li>• Anti-fraud measures</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Marketing Tools</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Discount code system</li>
              <li>• Complimentary tickets</li>
              <li>• Affiliate tracking</li>
              <li>• Last-minute offers</li>
              <li>• Bundle deals</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Analytics & Insights</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Sales funnel analysis</li>
              <li>• Traffic source tracking</li>
              <li>• Conversion metrics</li>
              <li>• Geographic distribution</li>
              <li>• Device breakdown</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}