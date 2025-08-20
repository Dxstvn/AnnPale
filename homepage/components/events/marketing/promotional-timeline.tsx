'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Timer,
  Zap,
  Mail,
  Share2,
  Users,
  Target,
  TrendingUp,
  ChevronRight,
  Play,
  Pause,
  SkipForward,
  Flag,
  Bell,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelinePhase {
  id: string;
  name: string;
  timing: string;
  daysOut: number;
  status: 'completed' | 'current' | 'upcoming';
  actions: Array<{
    task: string;
    channel: 'email' | 'social' | 'platform' | 'all';
    completed: boolean;
    impact?: 'high' | 'medium' | 'low';
  }>;
  goal: string;
  metrics?: {
    target: number;
    actual: number;
    unit: string;
  };
}

interface PromotionalTimelineProps {
  eventId: string;
  eventTitle: string;
  eventDate: Date;
  onCompleteAction?: (phaseId: string, action: string) => void;
  onSkipPhase?: (phaseId: string) => void;
  onSetReminder?: (phaseId: string) => void;
}

export function PromotionalTimeline({
  eventId,
  eventTitle,
  eventDate,
  onCompleteAction,
  onSkipPhase,
  onSetReminder
}: PromotionalTimelineProps) {
  const today = new Date();
  const daysUntilEvent = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate phase statuses based on days until event
  const getPhaseStatus = (daysOut: number): 'completed' | 'current' | 'upcoming' => {
    if (daysUntilEvent > daysOut) return 'completed';
    if (daysUntilEvent <= daysOut && daysUntilEvent > daysOut - 7) return 'current';
    return 'upcoming';
  };

  // Timeline phases
  const phases: TimelinePhase[] = [
    {
      id: 'launch',
      name: 'Launch Phase',
      timing: '4 weeks out',
      daysOut: 28,
      status: getPhaseStatus(28),
      actions: [
        { task: 'Create event listing', channel: 'platform', completed: true, impact: 'high' },
        { task: 'Send announcement email', channel: 'email', completed: true, impact: 'high' },
        { task: 'Post on all social media', channel: 'social', completed: true, impact: 'medium' },
        { task: 'Enable early bird pricing', channel: 'platform', completed: true, impact: 'high' },
        { task: 'Reach out to partners', channel: 'email', completed: false, impact: 'medium' }
      ],
      goal: 'Awareness',
      metrics: { target: 1000, actual: 1245, unit: 'views' }
    },
    {
      id: 'build',
      name: 'Build Phase',
      timing: '3 weeks out',
      daysOut: 21,
      status: getPhaseStatus(21),
      actions: [
        { task: 'Share content teasers', channel: 'social', completed: true, impact: 'medium' },
        { task: 'Publish blog post', channel: 'platform', completed: true, impact: 'low' },
        { task: 'Send reminder email', channel: 'email', completed: false, impact: 'high' },
        { task: 'Create countdown posts', channel: 'social', completed: false, impact: 'medium' },
        { task: 'Update event details', channel: 'platform', completed: false, impact: 'low' }
      ],
      goal: 'Interest',
      metrics: { target: 50, actual: 38, unit: 'registrations' }
    },
    {
      id: 'push',
      name: 'Push Phase',
      timing: '2 weeks out',
      daysOut: 14,
      status: getPhaseStatus(14),
      actions: [
        { task: 'Share testimonials', channel: 'social', completed: false, impact: 'high' },
        { task: 'Send FOMO email', channel: 'email', completed: false, impact: 'high' },
        { task: 'Launch paid ads', channel: 'platform', completed: false, impact: 'high' },
        { task: 'Partner cross-promotion', channel: 'all', completed: false, impact: 'medium' },
        { task: 'Influencer outreach', channel: 'social', completed: false, impact: 'medium' }
      ],
      goal: 'Conversion',
      metrics: { target: 150, actual: 0, unit: 'tickets' }
    },
    {
      id: 'final',
      name: 'Final Push',
      timing: '1 week out',
      daysOut: 7,
      status: getPhaseStatus(7),
      actions: [
        { task: 'Last chance email', channel: 'email', completed: false, impact: 'high' },
        { task: 'Urgency social posts', channel: 'social', completed: false, impact: 'high' },
        { task: 'Boost event listing', channel: 'platform', completed: false, impact: 'medium' },
        { task: 'Final partner push', channel: 'all', completed: false, impact: 'medium' },
        { task: 'Retargeting campaign', channel: 'platform', completed: false, impact: 'high' }
      ],
      goal: 'Fill seats',
      metrics: { target: 250, actual: 0, unit: 'tickets' }
    },
    {
      id: 'dayof',
      name: 'Event Day',
      timing: 'Event day',
      daysOut: 0,
      status: getPhaseStatus(0),
      actions: [
        { task: 'Live countdown posts', channel: 'social', completed: false, impact: 'medium' },
        { task: 'Final reminder email', channel: 'email', completed: false, impact: 'high' },
        { task: 'Last-minute sales push', channel: 'all', completed: false, impact: 'low' },
        { task: 'Live updates', channel: 'social', completed: false, impact: 'low' },
        { task: 'Check-in reminders', channel: 'email', completed: false, impact: 'medium' }
      ],
      goal: 'Maximize',
      metrics: { target: 300, actual: 0, unit: 'attendees' }
    }
  ];

  // Calculate overall progress
  const totalActions = phases.reduce((sum, phase) => sum + phase.actions.length, 0);
  const completedActions = phases.reduce(
    (sum, phase) => sum + phase.actions.filter(a => a.completed).length, 
    0
  );
  const overallProgress = (completedActions / totalActions) * 100;

  // Current phase
  const currentPhase = phases.find(p => p.status === 'current') || phases[0];

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'social': return <Share2 className="h-4 w-4" />;
      case 'platform': return <Target className="h-4 w-4" />;
      case 'all': return <Users className="h-4 w-4" />;
      default: return null;
    }
  };

  const getImpactColor = (impact?: string) => {
    switch (impact) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Timeline Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Promotional Timeline</CardTitle>
            <Badge variant={daysUntilEvent <= 7 ? 'destructive' : 'secondary'}>
              <Clock className="h-3 w-3 mr-1" />
              {daysUntilEvent} days until event
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Progress</span>
                <span className="text-sm text-gray-600">
                  {completedActions}/{totalActions} actions completed
                </span>
              </div>
              <Progress value={overallProgress} className="h-3" />
            </div>

            {/* Visual Timeline */}
            <div className="relative">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gray-200"></div>
              {phases.map((phase, index) => (
                <div key={phase.id} className="relative flex items-center gap-4 pb-6">
                  <div className={cn(
                    "absolute left-0 w-4 h-4 rounded-full border-2 bg-white",
                    phase.status === 'completed' && "border-green-600 bg-green-600",
                    phase.status === 'current' && "border-purple-600 bg-purple-600 animate-pulse",
                    phase.status === 'upcoming' && "border-gray-300"
                  )} style={{ left: '-6px' }} />
                  
                  <div className="ml-8 flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{phase.name}</h4>
                        <p className="text-sm text-gray-600">{phase.timing}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={
                          phase.status === 'completed' ? 'success' :
                          phase.status === 'current' ? 'default' :
                          'secondary'
                        }>
                          {phase.status}
                        </Badge>
                        {phase.metrics && (
                          <div className="text-right">
                            <p className="text-sm font-semibold">
                              {phase.metrics.actual}/{phase.metrics.target}
                            </p>
                            <p className="text-xs text-gray-600">{phase.metrics.unit}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Phase Details */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Current Phase: {currentPhase.name}
            </CardTitle>
            <Button size="sm" variant="outline">
              <Bell className="h-4 w-4 mr-2" />
              Set Reminders
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <Alert className="border-purple-200 bg-white">
              <Target className="h-4 w-4" />
              <AlertDescription>
                <strong>Goal:</strong> {currentPhase.goal} - Focus on {currentPhase.goal.toLowerCase()} generation
              </AlertDescription>
            </Alert>

            <div>
              <h4 className="font-semibold text-sm mb-2">Action Items</h4>
              <div className="space-y-2">
                {currentPhase.actions.map((action, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-lg border",
                      getImpactColor(action.impact)
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={action.completed}
                        onChange={() => onCompleteAction?.(currentPhase.id, action.task)}
                        className="h-4 w-4"
                      />
                      <div className="flex items-center gap-2">
                        {getChannelIcon(action.channel)}
                        <span className={cn(
                          "text-sm",
                          action.completed && "line-through text-gray-500"
                        )}>
                          {action.task}
                        </span>
                      </div>
                    </div>
                    {action.impact && (
                      <Badge variant="outline" className="text-xs">
                        {action.impact} impact
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <Button className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Execute Phase Actions
              </Button>
              <Button variant="outline">
                <SkipForward className="h-4 w-4 mr-2" />
                Skip to Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Phases */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Phases</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {phases.filter(p => p.status === 'upcoming').map((phase) => (
              <div key={phase.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Timer className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-medium">{phase.name}</p>
                    <p className="text-sm text-gray-600">
                      Starts in {phase.daysOut - daysUntilEvent} days • {phase.actions.length} actions
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onSetReminder?.(phase.id)}
                >
                  <Bell className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline">
              <Mail className="h-4 w-4 mr-2" />
              Send Email Blast
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Schedule Social Posts
            </Button>
            <Button variant="outline">
              <Zap className="h-4 w-4 mr-2" />
              Boost Event
            </Button>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Contact Partners
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm">Early bird campaign exceeded target by 24%</span>
              </div>
              <Badge variant="success">+24%</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <span className="text-sm">Social engagement below average</span>
              </div>
              <Button size="sm" variant="outline">
                <TrendingUp className="h-3 w-3 mr-1" />
                Improve
              </Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Flag className="h-5 w-5 text-blue-600" />
                <span className="text-sm">Partner promotion starting tomorrow</span>
              </div>
              <ChevronRight className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}