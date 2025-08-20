'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { 
  Calendar as CalendarIcon,
  Clock,
  DollarSign,
  Percent,
  TrendingUp,
  Pause,
  Play,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Info,
  CreditCard,
  Receipt,
  ChevronRight,
  Settings,
  Zap,
  Gift,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface BillingCycle {
  id: string;
  name: string;
  interval: 'monthly' | 'quarterly' | 'semi-annual' | 'annual' | 'custom';
  intervalCount: number;
  price: number;
  originalPrice?: number;
  discount?: number;
  currency: string;
  features?: string[];
  popular?: boolean;
  savings?: number;
}

interface BillingSchedule {
  currentCycle: BillingCycle;
  nextBillingDate: Date;
  lastBillingDate?: Date;
  pausedUntil?: Date;
  customBillingDay?: number;
  prorationAmount?: number;
  upcomingChanges?: {
    type: 'upgrade' | 'downgrade' | 'pause' | 'resume' | 'cancel';
    effectiveDate: Date;
    newCycle?: BillingCycle;
  };
}

interface BillingCyclesProps {
  currentCycle?: BillingCycle;
  availableCycles?: BillingCycle[];
  schedule?: BillingSchedule;
  onCycleChange?: (cycle: BillingCycle) => void;
  onScheduleUpdate?: (schedule: Partial<BillingSchedule>) => void;
  showProration?: boolean;
}

export function BillingCycles({
  currentCycle,
  availableCycles = [],
  schedule,
  onCycleChange,
  onScheduleUpdate,
  showProration = true
}: BillingCyclesProps) {
  const [selectedCycle, setSelectedCycle] = React.useState<string | null>(null);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(undefined);
  const [showCalendar, setShowCalendar] = React.useState(false);
  // Use a stable time reference to avoid hydration mismatch
  const [currentTime] = React.useState(() => Date.now());

  // Sample billing cycles for demo
  const demoCycles: BillingCycle[] = availableCycles.length > 0 ? availableCycles : [
    {
      id: 'monthly',
      name: 'Monthly',
      interval: 'monthly',
      intervalCount: 1,
      price: 29.99,
      currency: 'USD',
      features: ['Cancel anytime', 'No commitment']
    },
    {
      id: 'quarterly',
      name: 'Quarterly',
      interval: 'quarterly',
      intervalCount: 3,
      price: 80.97,
      originalPrice: 89.97,
      discount: 10,
      currency: 'USD',
      features: ['Save 10%', '3 months commitment'],
      savings: 9
    },
    {
      id: 'semi-annual',
      name: 'Semi-Annual',
      interval: 'semi-annual',
      intervalCount: 6,
      price: 149.94,
      originalPrice: 179.94,
      discount: 17,
      currency: 'USD',
      features: ['Save 17%', '6 months commitment'],
      popular: true,
      savings: 30
    },
    {
      id: 'annual',
      name: 'Annual',
      interval: 'annual',
      intervalCount: 12,
      price: 287.88,
      originalPrice: 359.88,
      discount: 20,
      currency: 'USD',
      features: ['Best value', 'Save 20%', '12 months commitment'],
      savings: 72
    }
  ];

  const demoCurrentCycle = currentCycle || demoCycles[0];

  // Sample schedule for demo
  const demoSchedule: BillingSchedule = schedule || {
    currentCycle: demoCurrentCycle,
    nextBillingDate: new Date(currentTime + 15 * 24 * 60 * 60 * 1000),
    lastBillingDate: new Date(currentTime - 15 * 24 * 60 * 60 * 1000),
    customBillingDay: 15,
    prorationAmount: 0
  };

  // Calculate proration
  const calculateProration = (fromCycle: BillingCycle, toCycle: BillingCycle) => {
    const daysInCurrentPeriod = fromCycle.intervalCount * 30;
    const daysUsed = Math.floor((currentTime - (demoSchedule.lastBillingDate?.getTime() || 0)) / (1000 * 60 * 60 * 24));
    const daysRemaining = daysInCurrentPeriod - daysUsed;
    
    const dailyRateOld = fromCycle.price / daysInCurrentPeriod;
    const dailyRateNew = toCycle.price / (toCycle.intervalCount * 30);
    
    const creditRemaining = dailyRateOld * daysRemaining;
    const chargeRemaining = dailyRateNew * daysRemaining;
    
    return chargeRemaining - creditRemaining;
  };

  // Get cycle color
  const getCycleColor = (cycle: BillingCycle) => {
    if (cycle.discount && cycle.discount >= 20) return 'from-green-400 to-green-600';
    if (cycle.discount && cycle.discount >= 15) return 'from-blue-400 to-blue-600';
    if (cycle.discount && cycle.discount >= 10) return 'from-purple-400 to-purple-600';
    return 'from-gray-400 to-gray-600';
  };

  // Format date
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Get days until date
  const getDaysUntil = (date: Date) => {
    return Math.floor((date.getTime() - currentTime) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      {/* Current Billing Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              Current Billing Plan
            </CardTitle>
            <Badge variant="outline">
              {demoCurrentCycle.name}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Current Plan */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Current Plan</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">
                    ${demoCurrentCycle.price}
                  </span>
                  <span className="text-gray-600">
                    /{demoCurrentCycle.interval === 'monthly' ? 'mo' : demoCurrentCycle.intervalCount + 'mo'}
                  </span>
                </div>
                {demoCurrentCycle.discount && (
                  <Badge className="bg-green-100 text-green-700">
                    <Percent className="h-3 w-3 mr-1" />
                    {demoCurrentCycle.discount}% savings
                  </Badge>
                )}
              </div>
            </div>

            {/* Billing Schedule */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Billing Schedule</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <CalendarIcon className="h-4 w-4 text-gray-500" />
                  <span>Next billing: {formatDate(demoSchedule.nextBillingDate)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{getDaysUntil(demoSchedule.nextBillingDate)} days remaining</span>
                </div>
                {demoSchedule.customBillingDay && (
                  <div className="flex items-center gap-2 text-sm">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <span>Bills on day {demoSchedule.customBillingDay} of month</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div>
              <p className="text-sm text-gray-600 mb-2">Quick Actions</p>
              <div className="flex flex-col gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Change Billing Date
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onScheduleUpdate?.({ pausedUntil: new Date(currentTime + 30 * 24 * 60 * 60 * 1000) })}
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pause Subscription
                </Button>
              </div>
            </div>
          </div>

          {/* Upcoming Changes */}
          {demoSchedule.upcomingChanges && (
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Upcoming change: {demoSchedule.upcomingChanges.type} effective {formatDate(demoSchedule.upcomingChanges.effectiveDate)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Billing Cycles */}
      <Card>
        <CardHeader>
          <CardTitle>Change Billing Cycle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {demoCycles.map((cycle) => {
              const isCurrentCycle = demoCurrentCycle.id === cycle.id;
              const proration = selectedCycle === cycle.id && showProration 
                ? calculateProration(demoCurrentCycle, cycle)
                : null;
              
              return (
                <motion.div
                  key={cycle.id}
                  whileHover={{ scale: isCurrentCycle ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card 
                    className={cn(
                      "relative cursor-pointer transition-all",
                      isCurrentCycle 
                        ? "border-purple-500 bg-purple-50"
                        : selectedCycle === cycle.id
                        ? "border-blue-500"
                        : "hover:border-purple-300",
                      cycle.popular && "ring-2 ring-purple-500 ring-offset-2"
                    )}
                    onClick={() => !isCurrentCycle && setSelectedCycle(cycle.id)}
                  >
                    {cycle.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-purple-600 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold">{cycle.name}</h4>
                          {isCurrentCycle && (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              Current
                            </Badge>
                          )}
                        </div>
                        
                        <div>
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold">${cycle.price}</span>
                            <span className="text-gray-600 text-sm">
                              /{cycle.intervalCount > 1 ? `${cycle.intervalCount}mo` : 'mo'}
                            </span>
                          </div>
                          
                          {cycle.originalPrice && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-gray-500 line-through">
                                ${cycle.originalPrice}
                              </span>
                              <Badge className="bg-green-100 text-green-700 text-xs">
                                Save ${cycle.savings}
                              </Badge>
                            </div>
                          )}
                        </div>
                        
                        {cycle.features && (
                          <div className="space-y-1">
                            {cycle.features.map((feature, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                                <CheckCircle className="h-3 w-3 text-green-500" />
                                {feature}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {proration !== null && (
                          <div className="pt-2 border-t">
                            <p className="text-xs text-gray-600">
                              Proration: {proration > 0 ? `+$${proration.toFixed(2)}` : `-$${Math.abs(proration).toFixed(2)}`}
                            </p>
                          </div>
                        )}
                        
                        {selectedCycle === cycle.id && !isCurrentCycle && (
                          <Button 
                            size="sm" 
                            className="w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              onCycleChange?.(cycle);
                              setSelectedCycle(null);
                            }}
                          >
                            Switch to {cycle.name}
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Billing Date Selector */}
      {showCalendar && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Select New Billing Date</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setShowCalendar(false)}
              >
                Cancel
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium mb-2">How billing date changes work:</h4>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Your new billing date will take effect next cycle</li>
                    <li>• Proration will be applied for the partial period</li>
                    <li>• Your subscription remains active during the change</li>
                    <li>• You can change your billing date once per billing cycle</li>
                  </ul>
                </div>
                
                {selectedDate && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800 mb-1">
                      New billing date: {formatDate(selectedDate)}
                    </p>
                    <p className="text-xs text-green-600">
                      This change will take effect on your next billing cycle
                    </p>
                    
                    <Button 
                      size="sm" 
                      className="w-full mt-3"
                      onClick={() => {
                        onScheduleUpdate?.({ customBillingDay: selectedDate.getDate() });
                        setShowCalendar(false);
                        setSelectedDate(undefined);
                      }}
                    >
                      Confirm Date Change
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pause Subscription Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pause className="h-5 w-5" />
            Pause Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Need a break? You can pause your subscription for up to 3 months while keeping your data and preferences.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4">
              {[30, 60, 90].map((days) => (
                <Button
                  key={days}
                  variant="outline"
                  onClick={() => onScheduleUpdate?.({ 
                    pausedUntil: new Date(currentTime + days * 24 * 60 * 60 * 1000) 
                  })}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Pause for {days} days
                </Button>
              ))}
            </div>
            
            <div className="p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-yellow-600 mt-0.5" />
                <div className="text-xs text-yellow-800">
                  <p className="font-medium mb-1">What happens when you pause:</p>
                  <ul className="space-y-0.5">
                    <li>• Your subscription will automatically resume after the pause period</li>
                    <li>• You won\'t be charged during the pause</li>
                    <li>• Your data and settings will be preserved</li>
                    <li>• You can resume early at any time</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}