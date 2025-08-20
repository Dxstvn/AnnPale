'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Users, TrendingUp } from 'lucide-react';

interface CohortData {
  cohortMonth: string;
  cohortSize: number;
  month1: number;
  month3: number;
  avgRevenue: number;
  tier: string;
}

interface CohortAnalysisProps {
  cohorts?: CohortData[];
  onCohortClick?: (cohort: CohortData) => void;
  onExport?: () => void;
}

export function CohortAnalysis({
  cohorts = [],
  onCohortClick,
  onExport
}: CohortAnalysisProps) {
  const defaultCohorts: CohortData[] = cohorts.length > 0 ? cohorts : [
    {
      cohortMonth: 'Jan 2024',
      cohortSize: 245,
      month1: 92,
      month3: 78,
      avgRevenue: 18.50,
      tier: 'Bronze'
    },
    {
      cohortMonth: 'Feb 2024',
      cohortSize: 267,
      month1: 89,
      month3: 74,
      avgRevenue: 19.80,
      tier: 'Silver'
    },
    {
      cohortMonth: 'Mar 2024',
      cohortSize: 298,
      month1: 94,
      month3: 81,
      avgRevenue: 21.20,
      tier: 'Bronze'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Cohort Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <Users className="h-5 w-5 mx-auto mb-1 text-blue-600" />
              <div className="text-2xl font-bold">92.5%</div>
              <p className="text-sm text-gray-600">Avg Month 1 Retention</p>
            </div>
            <div className="text-center">
              <TrendingUp className="h-5 w-5 mx-auto mb-1 text-green-600" />
              <div className="text-2xl font-bold">$21.58</div>
              <p className="text-sm text-gray-600">Avg Revenue</p>
            </div>
            <div className="text-center">
              <BarChart3 className="h-5 w-5 mx-auto mb-1 text-purple-600" />
              <div className="text-2xl font-bold">96%</div>
              <p className="text-sm text-gray-600">Best Retention</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Cohort</th>
                  <th className="text-center p-3">Size</th>
                  <th className="text-center p-3">Tier</th>
                  <th className="text-center p-3">Month 1</th>
                  <th className="text-center p-3">Month 3</th>
                  <th className="text-center p-3">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {defaultCohorts.map((cohort, index) => (
                  <tr 
                    key={index}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => onCohortClick?.(cohort)}
                  >
                    <td className="p-3 font-medium">{cohort.cohortMonth}</td>
                    <td className="text-center p-3">{cohort.cohortSize}</td>
                    <td className="text-center p-3">
                      <Badge variant="outline" className="text-xs">
                        {cohort.tier}
                      </Badge>
                    </td>
                    <td className="text-center p-3">
                      <Badge className="text-xs bg-green-100 text-green-700">
                        {cohort.month1}%
                      </Badge>
                    </td>
                    <td className="text-center p-3">
                      <Badge className="text-xs bg-blue-100 text-blue-700">
                        {cohort.month3}%
                      </Badge>
                    </td>
                    <td className="text-center p-3 font-medium">${cohort.avgRevenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium mb-1">Improving Month 1 Retention</h4>
                <p className="text-sm text-gray-600">Recent cohorts showing better retention rates</p>
              </div>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium mb-1">Revenue Growth</h4>
                <p className="text-sm text-gray-600">Average revenue per cohort trending upward</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Performance Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span>Strong Cohorts:</span>
                <span className="font-bold text-green-600">3</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Best Retention:</span>
                <span className="font-bold text-green-600">94%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Revenue Growth:</span>
                <span className="font-bold text-blue-600">+8.7%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}