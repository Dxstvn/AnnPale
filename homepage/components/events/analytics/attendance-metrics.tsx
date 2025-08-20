'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Timer,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Eye,
  LogOut,
  BarChart3
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from '@/lib/utils';

interface AttendanceData {
  registered: number;
  attended: number;
  noShows: number;
  dropOffs: number;
  avgDuration: number; // in minutes
  peakConcurrent: number;
  showUpRate: number; // percentage
  completionRate: number; // percentage
}

interface TimelineData {
  time: string;
  viewers: number;
  joiners: number;
  leavers: number;
}

interface AttendanceMetricsProps {
  eventId: string;
  eventTitle: string;
  attendanceData: AttendanceData;
  timelineData: TimelineData[];
  onExportData?: () => void;
  onViewDetails?: (metric: string) => void;
}

export function AttendanceMetrics({
  eventId,
  eventTitle,
  attendanceData,
  timelineData,
  onExportData,
  onViewDetails
}: AttendanceMetricsProps) {
  // Calculate additional metrics
  const retentionRate = attendanceData.attended > 0 
    ? ((attendanceData.attended - attendanceData.dropOffs) / attendanceData.attended * 100).toFixed(1)
    : '0';

  // Attendance breakdown for pie chart
  const attendanceBreakdown = [
    { name: 'Attended', value: attendanceData.attended, color: '#10B981' },
    { name: 'No Shows', value: attendanceData.noShows, color: '#EF4444' },
    { name: 'Drop Offs', value: attendanceData.dropOffs, color: '#F59E0B' }
  ];

  // Peak times analysis
  const peakTime = timelineData.reduce((max, current) => 
    current.viewers > max.viewers ? current : max
  , timelineData[0]);

  const lowTime = timelineData.reduce((min, current) => 
    current.viewers < min.viewers ? current : min
  , timelineData[0]);

  // Duration distribution (mock data)
  const durationDistribution = [
    { duration: '0-15 min', count: 45 },
    { duration: '15-30 min', count: 78 },
    { duration: '30-60 min', count: 156 },
    { duration: '60-90 min', count: 234 },
    { duration: '90+ min', count: 187 }
  ];

  const getMetricStatus = (rate: number) => {
    if (rate >= 80) return { color: 'text-green-600', label: 'Excellent', icon: ChevronUp };
    if (rate >= 60) return { color: 'text-yellow-600', label: 'Good', icon: ChevronUp };
    if (rate >= 40) return { color: 'text-orange-600', label: 'Fair', icon: ChevronDown };
    return { color: 'text-red-600', label: 'Poor', icon: ChevronDown };
  };

  const showUpStatus = getMetricStatus(attendanceData.showUpRate);
  const completionStatus = getMetricStatus(attendanceData.completionRate);

  return (
    <div className="space-y-6">
      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Registered</p>
                <p className="text-2xl font-bold">{attendanceData.registered}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Attended</p>
                <p className="text-2xl font-bold">{attendanceData.attended}</p>
                <p className={cn("text-xs mt-1", showUpStatus.color)}>
                  {attendanceData.showUpRate}% show-up
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">No Shows</p>
                <p className="text-2xl font-bold">{attendanceData.noShows}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {((attendanceData.noShows / attendanceData.registered) * 100).toFixed(1)}%
                </p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Peak Viewers</p>
                <p className="text-2xl font-bold">{attendanceData.peakConcurrent}</p>
                <p className="text-xs text-gray-500 mt-1">concurrent</p>
              </div>
              <Activity className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Show-up Rate Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Registration to Attendance Conversion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Show-up Rate</p>
                <p className="text-xs text-gray-600">Percentage of registered who attended</p>
              </div>
              <div className="text-right">
                <p className={cn("text-2xl font-bold", showUpStatus.color)}>
                  {attendanceData.showUpRate}%
                </p>
                <Badge variant={showUpStatus.label === 'Excellent' ? 'success' : 'secondary'}>
                  {showUpStatus.label}
                </Badge>
              </div>
            </div>
            <Progress value={attendanceData.showUpRate} className="h-3" />
            
            <div className="grid grid-cols-3 gap-4 pt-2">
              <div className="text-center">
                <p className="text-xs text-gray-600">Registered</p>
                <p className="font-semibold">{attendanceData.registered}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600">Attended</p>
                <p className="font-semibold text-green-600">{attendanceData.attended}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-600">No Shows</p>
                <p className="font-semibold text-red-600">{attendanceData.noShows}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Attendance Timeline</CardTitle>
            <Button variant="outline" size="sm" onClick={() => onViewDetails?.('timeline')}>
              <Eye className="h-4 w-4 mr-2" />
              Details
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={timelineData}>
              <defs>
                <linearGradient id="colorViewers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9333EA" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#9333EA" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="viewers" 
                stroke="#9333EA" 
                fillOpacity={1} 
                fill="url(#colorViewers)" 
                name="Viewers"
              />
              <Line 
                type="monotone" 
                dataKey="joiners" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={false}
                name="Joiners"
              />
            </AreaChart>
          </ResponsiveContainer>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-600">Peak Time</p>
              <p className="font-semibold">{peakTime?.time}</p>
              <p className="text-sm text-green-600">{peakTime?.viewers} viewers</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <p className="text-xs text-gray-600">Low Point</p>
              <p className="font-semibold">{lowTime?.time}</p>
              <p className="text-sm text-orange-600">{lowTime?.viewers} viewers</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Duration & Retention */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Average Duration */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Session Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-3xl font-bold">{attendanceData.avgDuration}</p>
                <p className="text-sm text-gray-600">minutes average</p>
              </div>
              
              <div className="space-y-2">
                <p className="text-xs font-medium text-gray-600">Duration Distribution</p>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={durationDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="duration" fontSize={10} />
                    <YAxis fontSize={10} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#9333EA" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Retention Rate */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Retention & Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Retention Rate</p>
                  <p className="text-xs text-gray-600">Stayed vs dropped off</p>
                </div>
                <p className="text-2xl font-bold text-blue-600">{retentionRate}%</p>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">Completion Rate</p>
                  <p className="text-xs text-gray-600">Watched to end</p>
                </div>
                <p className={cn("text-2xl font-bold", completionStatus.color)}>
                  {attendanceData.completionRate}%
                </p>
              </div>

              <div className="pt-2">
                <p className="text-xs font-medium text-gray-600 mb-2">Drop-off Points</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>First 5 min</span>
                    <span className="text-red-600">-12%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>15-30 min</span>
                    <span className="text-orange-600">-8%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>After 60 min</span>
                    <span className="text-yellow-600">-5%</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Breakdown Pie Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Attendance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={attendanceBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {attendanceBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            
            <div className="space-y-3">
              {attendanceBreakdown.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{item.value}</p>
                    <p className="text-xs text-gray-600">
                      {((item.value / attendanceData.registered) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Insights & Recommendations */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Attendance Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendanceData.showUpRate < 60 && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Show-up rate is below average. Consider sending more reminder emails and improving event descriptions.
                </AlertDescription>
              </Alert>
            )}
            {attendanceData.completionRate > 80 && (
              <Alert className="border-green-200 bg-green-50">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-900">
                  Excellent completion rate! Your content kept attendees engaged throughout.
                </AlertDescription>
              </Alert>
            )}
            {attendanceData.dropOffs > attendanceData.attended * 0.3 && (
              <Alert className="border-orange-200 bg-orange-50">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <AlertDescription className="text-orange-900">
                  High drop-off rate detected. Review the content at key drop-off points for improvements.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}