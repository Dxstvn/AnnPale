'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Mail,
  Send,
  Users,
  Clock,
  Calendar,
  TrendingUp,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle,
  FileText,
  Gift,
  ShoppingCart,
  Timer,
  Bell,
  Edit,
  Eye,
  BarChart,
  Filter,
  Sparkles,
  UserCheck,
  UserX
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmailCampaign {
  id: string;
  name: string;
  type: 'announcement' | 'reminder' | 'lastChance' | 'followUp' | 'abandoned';
  subject: string;
  previewText: string;
  content: string;
  scheduledFor?: Date;
  segment: 'all' | 'registered' | 'vip' | 'pastAttendees' | 'abandoned';
  status: 'draft' | 'scheduled' | 'sent';
  stats?: {
    sent: number;
    opened: number;
    clicked: number;
    converted: number;
  };
}

interface EmailMarketingProps {
  eventId: string;
  eventTitle: string;
  eventDate: Date;
  registeredCount: number;
  totalCapacity: number;
  onSendCampaign?: (campaign: EmailCampaign) => void;
  onScheduleCampaign?: (campaign: EmailCampaign) => void;
  onTestEmail?: (email: string) => void;
  onSaveTemplate?: (template: Partial<EmailCampaign>) => void;
}

export function EmailMarketing({
  eventId,
  eventTitle,
  eventDate,
  registeredCount,
  totalCapacity,
  onSendCampaign,
  onScheduleCampaign,
  onTestEmail,
  onSaveTemplate
}: EmailMarketingProps) {
  const [selectedTemplate, setSelectedTemplate] = React.useState<'announcement' | 'reminder' | 'lastChance' | 'followUp' | 'abandoned'>('announcement');
  const [subject, setSubject] = React.useState('');
  const [previewText, setPreviewText] = React.useState('');
  const [emailContent, setEmailContent] = React.useState('');
  const [selectedSegment, setSelectedSegment] = React.useState<'all' | 'registered' | 'vip' | 'pastAttendees' | 'abandoned'>('all');
  const [testEmail, setTestEmail] = React.useState('');

  const daysUntilEvent = Math.ceil((eventDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const spotsLeft = totalCapacity - registeredCount;

  // Email templates
  const templates = {
    announcement: {
      subject: `🎉 You're Invited: ${eventTitle}`,
      preview: `Join us for an exclusive event on ${eventDate.toLocaleDateString()}`,
      content: `
        <h2>You're Invited to Something Special!</h2>
        <p>We're thrilled to announce our upcoming event: <strong>${eventTitle}</strong></p>
        <p>📅 Date: ${eventDate.toLocaleDateString()}<br/>
        🕐 Time: ${eventDate.toLocaleTimeString()}<br/>
        📍 Location: Virtual Event</p>
        <p>This is your chance to be part of an incredible experience. Don't miss out!</p>
        <p><a href="#" style="background: #9333EA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Get Your Ticket</a></p>
      `
    },
    reminder: {
      subject: `⏰ Reminder: ${eventTitle} is coming up!`,
      preview: `Only ${daysUntilEvent} days left until the event`,
      content: `
        <h2>Don't Forget! ${eventTitle} is Almost Here</h2>
        <p>Just ${daysUntilEvent} days until we go live!</p>
        <p>Have you secured your spot yet? We're ${Math.round((registeredCount / totalCapacity) * 100)}% full!</p>
        <p><a href="#" style="background: #9333EA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Reserve Your Spot</a></p>
      `
    },
    lastChance: {
      subject: `🚨 Last Chance: Only ${spotsLeft} spots left for ${eventTitle}!`,
      preview: `Final call - event is almost sold out!`,
      content: `
        <h2>Final Call! 🚨</h2>
        <p>We're down to our last ${spotsLeft} spots for <strong>${eventTitle}</strong>!</p>
        <p>This is your last chance to join us. Once these spots are gone, they're gone!</p>
        <p><a href="#" style="background: #DC2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Claim Your Spot Now</a></p>
      `
    },
    followUp: {
      subject: `Thank you for attending ${eventTitle}! 🙏`,
      preview: `We hope you enjoyed the event. Here's what's next...`,
      content: `
        <h2>Thank You for Joining Us!</h2>
        <p>We hope you enjoyed ${eventTitle}. Your participation made it special!</p>
        <p>📹 Recording is now available<br/>
        📊 Event materials can be downloaded<br/>
        🎯 Mark your calendar for our next event</p>
        <p><a href="#" style="background: #9333EA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Access Recording</a></p>
      `
    },
    abandoned: {
      subject: `Still interested in ${eventTitle}? Your spot is waiting...`,
      preview: `Complete your registration with a special offer`,
      content: `
        <h2>You Were So Close!</h2>
        <p>We noticed you started registering for ${eventTitle} but didn't complete it.</p>
        <p>Good news - we've saved your spot! Plus, here's 10% off if you complete your registration today.</p>
        <p><a href="#" style="background: #9333EA; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">Complete Registration</a></p>
      `
    }
  };

  // Email sequence timeline
  const sequenceTimeline = [
    { phase: 'Launch', timing: '4 weeks out', template: 'announcement', audience: 'all' },
    { phase: 'Build', timing: '3 weeks out', template: 'reminder', audience: 'registered' },
    { phase: 'Push', timing: '2 weeks out', template: 'reminder', audience: 'all' },
    { phase: 'Final', timing: '1 week out', template: 'lastChance', audience: 'all' },
    { phase: 'Day Before', timing: '1 day out', template: 'reminder', audience: 'registered' },
    { phase: 'Day Of', timing: 'Event day', template: 'reminder', audience: 'registered' },
    { phase: 'Follow-up', timing: '1 day after', template: 'followUp', audience: 'attended' }
  ];

  // Segment stats
  const segments = [
    { id: 'all', name: 'All Subscribers', count: 5234, icon: Users },
    { id: 'registered', name: 'Registered', count: registeredCount, icon: UserCheck },
    { id: 'vip', name: 'VIP Members', count: 432, icon: Sparkles },
    { id: 'pastAttendees', name: 'Past Attendees', count: 1876, icon: Clock },
    { id: 'abandoned', name: 'Abandoned Cart', count: 89, icon: ShoppingCart }
  ];

  const handleUseTemplate = (type: keyof typeof templates) => {
    setSelectedTemplate(type);
    setSubject(templates[type].subject);
    setPreviewText(templates[type].preview);
    setEmailContent(templates[type].content);
  };

  const handleSendTest = () => {
    if (testEmail) {
      onTestEmail?.(testEmail);
    }
  };

  return (
    <div className="space-y-6">
      {/* Campaign Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Email Campaign Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Mail className="h-8 w-8 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">12,456</p>
              <p className="text-xs text-gray-600">Total Sent</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <Eye className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">68%</p>
              <p className="text-xs text-gray-600">Open Rate</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <TrendingUp className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">24%</p>
              <p className="text-xs text-gray-600">Click Rate</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-pink-600 mx-auto mb-2" />
              <p className="text-2xl font-bold">156</p>
              <p className="text-xs text-gray-600">Conversions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTemplate} onValueChange={(v) => handleUseTemplate(v as any)}>
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="announcement">Announce</TabsTrigger>
              <TabsTrigger value="reminder">Reminder</TabsTrigger>
              <TabsTrigger value="lastChance">Last Chance</TabsTrigger>
              <TabsTrigger value="followUp">Follow-up</TabsTrigger>
              <TabsTrigger value="abandoned">Abandoned</TabsTrigger>
            </TabsList>

            <div className="mt-6 space-y-4">
              {/* Subject Line */}
              <div>
                <Label>Subject Line</Label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Enter email subject..."
                  className="mt-1"
                />
                <p className="text-xs text-gray-600 mt-1">Keep it under 50 characters for best results</p>
              </div>

              {/* Preview Text */}
              <div>
                <Label>Preview Text</Label>
                <Input
                  value={previewText}
                  onChange={(e) => setPreviewText(e.target.value)}
                  placeholder="Enter preview text..."
                  className="mt-1"
                />
                <p className="text-xs text-gray-600 mt-1">This appears after the subject in most email clients</p>
              </div>

              {/* Email Content */}
              <div>
                <Label>Email Content</Label>
                <div className="mt-1 border rounded-lg p-4 bg-white">
                  <div dangerouslySetInnerHTML={{ __html: emailContent }} />
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Content
                </Button>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Audience Segmentation */}
      <Card>
        <CardHeader>
          <CardTitle>Audience Segmentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {segments.map((segment) => {
              const Icon = segment.icon;
              return (
                <div
                  key={segment.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors",
                    selectedSegment === segment.id ? "border-purple-600 bg-purple-50" : "hover:bg-gray-50"
                  )}
                  onClick={() => setSelectedSegment(segment.id as any)}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="font-medium">{segment.name}</p>
                      <p className="text-sm text-gray-600">{segment.count.toLocaleString()} recipients</p>
                    </div>
                  </div>
                  {selectedSegment === segment.id && (
                    <CheckCircle className="h-5 w-5 text-purple-600" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Email Sequence */}
      <Card>
        <CardHeader>
          <CardTitle>Automated Email Sequence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sequenceTimeline.map((item, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-shrink-0 w-24 text-right">
                  <p className="text-xs text-gray-600">{item.timing}</p>
                </div>
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.phase}</p>
                    <p className="text-xs text-gray-600">Template: {item.template}</p>
                  </div>
                  <Badge variant="secondary">{item.audience}</Badge>
                </div>
              </div>
            ))}
          </div>
          <Alert className="mt-4">
            <Zap className="h-4 w-4" />
            <AlertDescription>
              Automated sequence will send emails at optimal times based on your event date
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Abandoned Cart Recovery */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Abandoned Cart Recovery
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="border-orange-200 bg-white">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription>
              <strong>89 abandoned registrations</strong> detected in the last 7 days
            </AlertDescription>
          </Alert>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Enable automated recovery emails</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Include discount offer</Label>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <Label>Send after (hours)</Label>
              <Input type="number" defaultValue="24" className="w-20" />
            </div>
          </div>

          <Button className="w-full bg-orange-600 hover:bg-orange-700">
            <Send className="h-4 w-4 mr-2" />
            Send Recovery Campaign Now
          </Button>
        </CardContent>
      </Card>

      {/* Send Options */}
      <Card>
        <CardHeader>
          <CardTitle>Send Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Send Test Email</Label>
            <div className="flex gap-2 mt-1">
              <Input
                type="email"
                placeholder="test@example.com"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
              />
              <Button variant="outline" onClick={handleSendTest}>
                Send Test
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              onClick={() => onSaveTemplate?.({ 
                name: selectedTemplate,
                type: selectedTemplate,
                subject,
                previewText,
                content: emailContent,
                segment: selectedSegment
              })}
            >
              <FileText className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button
              onClick={() => onScheduleCampaign?.({
                id: '',
                name: selectedTemplate,
                type: selectedTemplate,
                subject,
                previewText,
                content: emailContent,
                segment: selectedSegment,
                status: 'scheduled'
              })}
            >
              <Clock className="h-4 w-4 mr-2" />
              Schedule
            </Button>
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
            onClick={() => onSendCampaign?.({
              id: '',
              name: selectedTemplate,
              type: selectedTemplate,
              subject,
              previewText,
              content: emailContent,
              segment: selectedSegment,
              status: 'sent'
            })}
          >
            <Send className="h-4 w-4 mr-2" />
            Send Campaign Now
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}