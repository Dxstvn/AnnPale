'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Users,
  Globe,
  Smartphone,
  Monitor,
  UserPlus,
  UserCheck,
  MapPin,
  Clock,
  TrendingUp,
  Eye,
  BarChart3,
  PieChart as PieChartIcon,
  Activity
} from 'lucide-react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line
} from 'recharts';
import { cn } from '@/lib/utils';

interface Demographics {
  ageGroups: Array<{ range: string; count: number; percentage: number }>;
  gender: Array<{ type: string; count: number; percentage: number }>;
  interests: Array<{ category: string; count: number }>;
}

interface Geographic {
  countries: Array<{ name: string; count: number; percentage: number }>;
  cities: Array<{ name: string; count: number }>;
  timezones: Array<{ zone: string; count: number }>;
}

interface DeviceStats {
  types: Array<{ device: string; count: number; percentage: number }>;
  browsers: Array<{ browser: string; count: number }>;
  os: Array<{ system: string; count: number }>;
}

interface AudienceInsightsProps {
  eventId: string;
  eventTitle: string;
  totalAttendees: number;
  newVsReturning: { new: number; returning: number };
  referralSources: Array<{ source: string; count: number; percentage: number }>;
  demographics: Demographics;
  geographic: Geographic;
  deviceStats: DeviceStats;
  onExportData?: () => void;
  onViewDetails?: (section: string) => void;
}

export function AudienceInsights({
  eventId,
  eventTitle,
  totalAttendees,
  newVsReturning,
  referralSources,
  demographics,
  geographic,
  deviceStats,
  onExportData,
  onViewDetails
}: AudienceInsightsProps) {
  // Calculate percentages
  const newPercentage = ((newVsReturning.new / totalAttendees) * 100).toFixed(1);
  const returningPercentage = ((newVsReturning.returning / totalAttendees) * 100).toFixed(1);

  // Colors for charts
  const COLORS = ['#9333EA', '#EC4899', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];

  // Top locations
  const topCountries = geographic.countries.slice(0, 5);
  const topCities = geographic.cities.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Audience Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Attendees</p>
                <p className="text-2xl font-bold">{totalAttendees}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">New Attendees</p>
                <p className="text-2xl font-bold">{newVsReturning.new}</p>
                <p className="text-xs text-green-600 mt-1">{newPercentage}%</p>
              </div>
              <UserPlus className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Returning</p>
                <p className="text-2xl font-bold">{newVsReturning.returning}</p>
                <p className="text-xs text-blue-600 mt-1">{returningPercentage}%</p>
              </div>
              <UserCheck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Countries</p>
                <p className="text-2xl font-bold">{geographic.countries.length}</p>
                <p className="text-xs text-gray-500 mt-1">represented</p>
              </div>
              <Globe className="h-8 w-8 text-pink-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demographics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Audience Demographics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Age Distribution */}
            <div>
              <h4 className="text-sm font-medium mb-3">Age Distribution</h4>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={demographics.ageGroups}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" fontSize={10} />
                  <YAxis fontSize={10} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#9333EA" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gender Distribution */}
            <div>
              <h4 className="text-sm font-medium mb-3">Gender Distribution</h4>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={demographics.gender}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, percentage }) => `${type} ${percentage}%`}
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {demographics.gender.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Top Interests */}
            <div>
              <h4 className="text-sm font-medium mb-3">Top Interests</h4>
              <div className="space-y-2">
                {demographics.interests.slice(0, 5).map((interest, index) => (
                  <div key={interest.category}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs">{interest.category}</span>
                      <span className="text-xs font-medium">{interest.count}</span>
                    </div>
                    <Progress 
                      value={(interest.count / demographics.interests[0].count) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Geographic Distribution */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Geographic Distribution</CardTitle>
            <Button variant="outline" size="sm" onClick={() => onViewDetails?.('geographic')}>
              <MapPin className="h-4 w-4 mr-2" />
              View Map
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Countries */}
            <div>
              <h4 className="text-sm font-medium mb-3">Top Countries</h4>
              <div className="space-y-3">
                {topCountries.map((country, index) => (
                  <div key={country.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm">{country.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{country.count}</span>
                      <Badge variant="secondary" className="text-xs">
                        {country.percentage}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Cities */}
            <div>
              <h4 className="text-sm font-medium mb-3">Top Cities</h4>
              <div className="space-y-3">
                {topCities.map((city, index) => (
                  <div key={city.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                        {index + 1}
                      </div>
                      <span className="text-sm">{city.name}</span>
                    </div>
                    <span className="text-sm font-medium">{city.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Timezone Distribution */}
          <div className="mt-6">
            <h4 className="text-sm font-medium mb-3">Timezone Distribution</h4>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={geographic.timezones} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" fontSize={10} />
                <YAxis dataKey="zone" type="category" fontSize={10} />
                <Tooltip />
                <Bar dataKey="count" fill="#EC4899" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Device & Platform Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Device & Platform Analytics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Device Types */}
            <div>
              <h4 className="text-sm font-medium mb-3">Device Types</h4>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={deviceStats.types}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="count"
                  >
                    {deviceStats.types.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 mt-3">
                {deviceStats.types.map((device, index) => (
                  <div key={device.device} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span>{device.device}</span>
                    </div>
                    <span className="font-medium">{device.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Browsers */}
            <div>
              <h4 className="text-sm font-medium mb-3">Top Browsers</h4>
              <div className="space-y-3">
                {deviceStats.browsers.slice(0, 5).map((browser) => (
                  <div key={browser.browser} className="flex items-center justify-between">
                    <span className="text-sm">{browser.browser}</span>
                    <Badge variant="secondary">{browser.count}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Operating Systems */}
            <div>
              <h4 className="text-sm font-medium mb-3">Operating Systems</h4>
              <div className="space-y-3">
                {deviceStats.os.slice(0, 5).map((system) => (
                  <div key={system.system} className="flex items-center justify-between">
                    <span className="text-sm">{system.system}</span>
                    <Badge variant="secondary">{system.count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Referral Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Traffic & Referral Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <ComposedChart data={referralSources}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="source" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="count" fill="#9333EA" name="Visitors" />
              <Line yAxisId="right" type="monotone" dataKey="percentage" stroke="#EC4899" name="Percentage" strokeWidth={2} />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Audience Quality Score */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Audience Quality Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm font-medium mb-1">Engagement Quality</p>
              <div className="flex items-center gap-2">
                <Progress value={75} className="flex-1" />
                <span className="text-sm font-bold">75%</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">High interaction rate</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm font-medium mb-1">Audience Diversity</p>
              <div className="flex items-center gap-2">
                <Progress value={85} className="flex-1" />
                <span className="text-sm font-bold">85%</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">{geographic.countries.length} countries represented</p>
            </div>
            <div className="p-3 bg-white rounded-lg">
              <p className="text-sm font-medium mb-1">Return Rate</p>
              <div className="flex items-center gap-2">
                <Progress value={parseFloat(returningPercentage)} className="flex-1" />
                <span className="text-sm font-bold">{returningPercentage}%</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">Loyal audience base</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}