'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FileText,
  Download,
  Send,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  Star,
  BarChart3,
  Mail,
  Calendar,
  Printer,
  Share2,
  Eye,
  FileSpreadsheet,
  FilePlus
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReportType {
  id: string;
  name: string;
  description: string;
  format: 'pdf' | 'excel' | 'csv';
  status: 'ready' | 'generating' | 'scheduled';
  size?: string;
  lastGenerated?: Date;
  icon: React.ElementType;
}

interface ReportSection {
  title: string;
  included: boolean;
  data?: any;
}

interface PostEventReportsProps {
  eventId: string;
  eventTitle: string;
  eventDate: Date;
  onGenerateReport?: (type: string) => void;
  onDownloadReport?: (type: string) => void;
  onScheduleReport?: (type: string, schedule: string) => void;
  onShareReport?: (type: string, recipients: string[]) => void;
}

export function PostEventReports({
  eventId,
  eventTitle,
  eventDate,
  onGenerateReport,
  onDownloadReport,
  onScheduleReport,
  onShareReport
}: PostEventReportsProps) {
  const [selectedReport, setSelectedReport] = React.useState<string>('executive');
  const [emailRecipients, setEmailRecipients] = React.useState<string>('');

  // Available reports
  const reports: ReportType[] = [
    {
      id: 'executive',
      name: 'Executive Summary',
      description: 'High-level overview with key metrics and insights',
      format: 'pdf',
      status: 'ready',
      size: '2.4 MB',
      lastGenerated: new Date(Date.now() - 2 * 60 * 60 * 1000),
      icon: FileText
    },
    {
      id: 'detailed',
      name: 'Detailed Analytics',
      description: 'Complete data analysis with charts and tables',
      format: 'excel',
      status: 'ready',
      size: '8.7 MB',
      lastGenerated: new Date(Date.now() - 3 * 60 * 60 * 1000),
      icon: FileSpreadsheet
    },
    {
      id: 'attendee',
      name: 'Attendee Report',
      description: 'Participant data, engagement metrics, and demographics',
      format: 'csv',
      status: 'ready',
      size: '1.2 MB',
      lastGenerated: new Date(Date.now() - 4 * 60 * 60 * 1000),
      icon: Users
    },
    {
      id: 'financial',
      name: 'Financial Report',
      description: 'Revenue breakdown, fees, and profit analysis',
      format: 'pdf',
      status: 'generating',
      icon: DollarSign
    },
    {
      id: 'feedback',
      name: 'Feedback Summary',
      description: 'Survey results, testimonials, and improvement suggestions',
      format: 'pdf',
      status: 'scheduled',
      icon: Star
    }
  ];

  // Executive summary sections
  const executiveSections: ReportSection[] = [
    { title: 'Event Overview', included: true },
    { title: 'Key Performance Indicators', included: true },
    { title: 'Attendance Metrics', included: true },
    { title: 'Revenue Summary', included: true },
    { title: 'Engagement Highlights', included: true },
    { title: 'Quality Score', included: true },
    { title: 'Recommendations', included: true }
  ];

  // Sample report preview data
  const reportPreview = {
    executive: {
      eventName: eventTitle,
      date: eventDate.toLocaleDateString(),
      duration: '90 minutes',
      attendees: 487,
      revenue: '$24,350',
      satisfaction: '92%',
      nps: 72,
      keyHighlights: [
        '95% show-up rate exceeded expectations',
        'Revenue target achieved with 23% growth',
        'High engagement with 1,234 chat messages',
        'Excellent stream quality with 99.5% uptime'
      ]
    }
  };

  const currentReport = reports.find(r => r.id === selectedReport) || reports[0];

  const handleShareReport = () => {
    if (emailRecipients) {
      const recipients = emailRecipients.split(',').map(e => e.trim());
      onShareReport?.(selectedReport, recipients);
      setEmailRecipients('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'success';
      case 'generating': return 'secondary';
      case 'scheduled': return 'default';
      default: return 'secondary';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'pdf': return FileText;
      case 'excel': return FileSpreadsheet;
      case 'csv': return FileText;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-6">
      {/* Report Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Post-Event Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedReport} onValueChange={setSelectedReport}>
            <TabsList className="grid grid-cols-5 w-full">
              {reports.map((report) => {
                const Icon = report.icon;
                return (
                  <TabsTrigger key={report.id} value={report.id} className="flex items-center gap-2">
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:inline">{report.name.split(' ')[0]}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            <div className="mt-6">
              {/* Report Details */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{currentReport.name}</h3>
                  <p className="text-sm text-gray-600">{currentReport.description}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge variant={getStatusColor(currentReport.status)}>
                      {currentReport.status === 'ready' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {currentReport.status === 'generating' && <Clock className="h-3 w-3 mr-1 animate-spin" />}
                      {currentReport.status}
                    </Badge>
                    <span className="text-sm text-gray-600">
                      Format: {currentReport.format.toUpperCase()}
                    </span>
                    {currentReport.size && (
                      <span className="text-sm text-gray-600">
                        Size: {currentReport.size}
                      </span>
                    )}
                    {currentReport.lastGenerated && (
                      <span className="text-sm text-gray-600">
                        Generated {new Date(currentReport.lastGenerated).toLocaleTimeString()}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  {currentReport.status === 'ready' && (
                    <>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => onDownloadReport?.(currentReport.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </>
                  )}
                  {currentReport.status === 'generating' && (
                    <Button size="sm" disabled>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </Button>
                  )}
                  {currentReport.status === 'scheduled' && (
                    <Button 
                      size="sm"
                      onClick={() => onGenerateReport?.(currentReport.id)}
                    >
                      <FilePlus className="h-4 w-4 mr-2" />
                      Generate Now
                    </Button>
                  )}
                </div>
              </div>

              {/* Report Preview */}
              {selectedReport === 'executive' && (
                <Card className="bg-gray-50">
                  <CardHeader>
                    <CardTitle className="text-base">Report Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-xs text-gray-600">Event</p>
                          <p className="font-semibold">{reportPreview.executive.eventName}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Date</p>
                          <p className="font-semibold">{reportPreview.executive.date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Duration</p>
                          <p className="font-semibold">{reportPreview.executive.duration}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600">Attendees</p>
                          <p className="font-semibold">{reportPreview.executive.attendees}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white rounded-lg">
                        <div className="text-center">
                          <DollarSign className="h-6 w-6 text-green-600 mx-auto mb-1" />
                          <p className="text-lg font-bold">{reportPreview.executive.revenue}</p>
                          <p className="text-xs text-gray-600">Revenue</p>
                        </div>
                        <div className="text-center">
                          <Users className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                          <p className="text-lg font-bold">{reportPreview.executive.attendees}</p>
                          <p className="text-xs text-gray-600">Attendees</p>
                        </div>
                        <div className="text-center">
                          <Star className="h-6 w-6 text-yellow-500 mx-auto mb-1" />
                          <p className="text-lg font-bold">{reportPreview.executive.satisfaction}</p>
                          <p className="text-xs text-gray-600">Satisfaction</p>
                        </div>
                        <div className="text-center">
                          <TrendingUp className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                          <p className="text-lg font-bold">{reportPreview.executive.nps}</p>
                          <p className="text-xs text-gray-600">NPS Score</p>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-sm mb-2">Key Highlights</h4>
                        <ul className="space-y-1">
                          {reportPreview.executive.keyHighlights.map((highlight, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Report Sections */}
              {selectedReport === 'executive' && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-base">Included Sections</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {executiveSections.map((section) => (
                        <div key={section.title} className="flex items-center gap-2">
                          <CheckCircle className={cn(
                            "h-4 w-4",
                            section.included ? "text-green-600" : "text-gray-400"
                          )} />
                          <span className={cn(
                            "text-sm",
                            !section.included && "text-gray-400"
                          )}>
                            {section.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </Tabs>
        </CardContent>
      </Card>

      {/* Distribution Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Report Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Email Distribution */}
            <div>
              <label className="text-sm font-medium mb-2 block">Email Recipients</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="email1@example.com, email2@example.com"
                  value={emailRecipients}
                  onChange={(e) => setEmailRecipients(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                />
                <Button onClick={handleShareReport}>
                  <Mail className="h-4 w-4 mr-2" />
                  Send Report
                </Button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4 mr-2" />
                Share Link
              </Button>
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Archive
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automated Reporting */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Automated Reporting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Post-event reports will be automatically generated and sent to stakeholders 24 hours after event completion.
            </AlertDescription>
          </Alert>
          
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Executive Summary</p>
                  <p className="text-xs text-gray-600">Sent to: Event organizers</p>
                </div>
              </div>
              <Badge>24h after</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Financial Report</p>
                  <p className="text-xs text-gray-600">Sent to: Finance team</p>
                </div>
              </div>
              <Badge>48h after</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm font-medium">Feedback Summary</p>
                  <p className="text-xs text-gray-600">Sent to: All stakeholders</p>
                </div>
              </div>
              <Badge>7d after</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}