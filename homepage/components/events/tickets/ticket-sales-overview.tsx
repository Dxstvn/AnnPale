'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Ticket,
  Clock,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SalesData {
  totalSold: number;
  totalCapacity: number;
  revenue: number;
  remainingCapacity: number;
  salesVelocity: {
    value: number;
    trend: 'up' | 'down' | 'stable';
    percentChange: number;
  };
  deadline: Date;
  ticketTiers: Array<{
    id: string;
    name: string;
    sold: number;
    capacity: number;
    price: number;
    revenue: number;
  }>;
}

interface TicketSalesOverviewProps {
  eventId: string;
  salesData: SalesData;
  onManageTiers?: () => void;
}

export function TicketSalesOverview({
  eventId,
  salesData,
  onManageTiers
}: TicketSalesOverviewProps) {
  const soldPercentage = (salesData.totalSold / salesData.totalCapacity) * 100;
  const daysUntilEvent = Math.ceil((salesData.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const hoursUntilEvent = Math.ceil((salesData.deadline.getTime() - Date.now()) / (1000 * 60 * 60));

  const getStatusColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-orange-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getStatusBadge = (percentage: number) => {
    if (percentage >= 100) return { label: 'Sold Out', variant: 'destructive' as const };
    if (percentage >= 90) return { label: 'Almost Full', variant: 'warning' as const };
    if (percentage >= 75) return { label: 'Selling Fast', variant: 'warning' as const };
    return { label: 'On Sale', variant: 'default' as const };
  };

  const status = getStatusBadge(soldPercentage);

  return (
    <div className="space-y-6">
      {/* Main Sales Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Total Sold</CardTitle>
              <Ticket className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {salesData.totalSold}
              <span className="text-sm font-normal text-gray-500">/{salesData.totalCapacity}</span>
            </div>
            <Progress value={soldPercentage} className="mt-2" />
            <p className="text-xs text-gray-500 mt-1">{soldPercentage.toFixed(1)}% capacity</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${salesData.revenue.toLocaleString()}</div>
            <div className="flex items-center gap-1 mt-1">
              {salesData.salesVelocity.trend === 'up' ? (
                <TrendingUp className="h-4 w-4 text-green-500" />
              ) : salesData.salesVelocity.trend === 'down' ? (
                <TrendingDown className="h-4 w-4 text-red-500" />
              ) : null}
              <span className={cn(
                "text-xs",
                salesData.salesVelocity.trend === 'up' ? 'text-green-600' : 
                salesData.salesVelocity.trend === 'down' ? 'text-red-600' : 
                'text-gray-600'
              )}>
                {salesData.salesVelocity.trend === 'up' ? '+' : ''}
                {salesData.salesVelocity.percentChange}% this week
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Sales Velocity</CardTitle>
              <Users className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{salesData.salesVelocity.value}</div>
            <p className="text-xs text-gray-500 mt-1">tickets/day avg</p>
            <Badge variant={status.variant} className="mt-2">
              {status.label}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Time Until Event</CardTitle>
              <Clock className="h-4 w-4 text-gray-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {daysUntilEvent > 0 ? `${daysUntilEvent}d` : `${hoursUntilEvent}h`}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {salesData.deadline.toLocaleDateString()}
            </p>
            {daysUntilEvent <= 7 && (
              <div className="flex items-center gap-1 mt-2">
                <AlertTriangle className="h-3 w-3 text-orange-500" />
                <span className="text-xs text-orange-600">Final week</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tier Performance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Ticket Tier Performance</CardTitle>
            {onManageTiers && (
              <button
                onClick={onManageTiers}
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                Manage Tiers
              </button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {salesData.ticketTiers.map((tier) => {
              const tierPercentage = (tier.sold / tier.capacity) * 100;
              const tierStatus = tierPercentage >= 100 ? 'sold-out' : 'available';
              
              return (
                <div key={tier.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{tier.name}</span>
                      {tierStatus === 'sold-out' && (
                        <Badge variant="destructive" className="text-xs">Sold Out</Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">${tier.revenue.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">
                        {tier.sold}/{tier.capacity} sold
                      </div>
                    </div>
                  </div>
                  <Progress 
                    value={tierPercentage} 
                    className={cn(
                      "h-2",
                      tierStatus === 'sold-out' && "opacity-60"
                    )}
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Sales Alerts */}
      {(soldPercentage >= 90 || daysUntilEvent <= 7) && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              Sales Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {soldPercentage >= 90 && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-4 w-4 text-orange-600" />
                  <span>Event is {soldPercentage.toFixed(0)}% sold. Consider adding capacity.</span>
                </div>
              )}
              {daysUntilEvent <= 7 && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span>Event is in {daysUntilEvent} days. Boost promotion for final push.</span>
                </div>
              )}
              {salesData.remainingCapacity > 0 && salesData.remainingCapacity <= 10 && (
                <div className="flex items-center gap-2 text-sm">
                  <Ticket className="h-4 w-4 text-orange-600" />
                  <span>Only {salesData.remainingCapacity} tickets remaining!</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}