'use client';

import * as React from 'react';
import { SubscriptionLifecycle } from '@/components/subscription/billing/subscription-lifecycle';
import { PaymentMethods } from '@/components/subscription/billing/payment-methods';
import { BillingCycles } from '@/components/subscription/billing/billing-cycles';
import { PaymentRecovery } from '@/components/subscription/billing/payment-recovery';
import { RevenueRecognition } from '@/components/subscription/billing/revenue-recognition';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  DollarSign,
  CreditCard,
  Calendar,
  AlertCircle,
  TrendingUp,
  Info,
  Settings,
  CheckCircle,
  BarChart3,
  Receipt,
  RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function Phase456Demo() {
  const [hasFailedPayment, setHasFailedPayment] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold">Phase 4.5.6: Billing & Payment Management</h1>
              <p className="text-gray-600">Subscription revenue operations and payment processing</p>
            </div>
          </div>
          <Badge className="bg-green-100 text-green-700">
            Phase 4.5.6
          </Badge>
        </div>

        {/* Overview */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Billing System Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-700">
                A comprehensive billing and payment management system that handles recurring payments, 
                upgrades, downgrades, and edge cases while minimizing churn and payment failures.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">System Components:</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Subscription Lifecycle Management</li>
                    <li>• Multiple Payment Method Support</li>
                    <li>• Flexible Billing Cycles & Proration</li>
                    <li>• Smart Payment Recovery System</li>
                    <li>• Revenue Recognition & Compliance</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">Key Features:</h3>
                  <ul className="space-y-1 text-sm text-gray-600">
                    <li>• Automated retry logic with smart scheduling</li>
                    <li>• Grace period management (7 days)</li>
                    <li>• Dunning email campaigns</li>
                    <li>• Win-back strategies for failed payments</li>
                    <li>• Real-time revenue metrics & reporting</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Payment Failure Recovery Strategy:
                </h4>
                <div className="grid md:grid-cols-6 gap-4 text-xs">
                  <div className="text-center">
                    <p className="font-medium">1st Retry</p>
                    <p className="text-gray-600">Immediate</p>
                    <Badge className="bg-green-100 text-green-700 text-xs mt-1">30% success</Badge>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">2nd Retry</p>
                    <p className="text-gray-600">Day 3</p>
                    <Badge className="bg-blue-100 text-blue-700 text-xs mt-1">20% success</Badge>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">3rd Retry</p>
                    <p className="text-gray-600">Day 5</p>
                    <Badge className="bg-yellow-100 text-yellow-700 text-xs mt-1">15% success</Badge>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">4th Retry</p>
                    <p className="text-gray-600">Day 7</p>
                    <Badge className="bg-orange-100 text-orange-700 text-xs mt-1">25% success</Badge>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Final</p>
                    <p className="text-gray-600">Day 10</p>
                    <Badge className="bg-red-100 text-red-700 text-xs mt-1">10% success</Badge>
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Win-back</p>
                    <p className="text-gray-600">Day 30</p>
                    <Badge className="bg-purple-100 text-purple-700 text-xs mt-1">20% success</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Demo Configuration */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Demo Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium">Simulate payment failure scenario:</p>
              <Button
                variant={hasFailedPayment ? "destructive" : "outline"}
                size="sm"
                onClick={() => setHasFailedPayment(!hasFailedPayment)}
              >
                {hasFailedPayment ? (
                  <>
                    <AlertCircle className="h-4 w-4 mr-2" />
                    Payment Failed (Active)
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Payment Successful
                  </>
                )}
              </Button>
              <p className="text-xs text-gray-600">
                Toggle to see how the system handles failed payments and recovery
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Card>
          <CardContent className="p-6">
            <Tabs defaultValue="lifecycle">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="lifecycle">
                  <Receipt className="h-4 w-4 mr-2" />
                  Lifecycle
                </TabsTrigger>
                <TabsTrigger value="methods">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Methods
                </TabsTrigger>
                <TabsTrigger value="cycles">
                  <Calendar className="h-4 w-4 mr-2" />
                  Billing Cycles
                </TabsTrigger>
                <TabsTrigger value="recovery">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Recovery
                  {hasFailedPayment && (
                    <Badge className="ml-2 bg-red-500 text-white text-xs">!</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="revenue">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Revenue
                </TabsTrigger>
              </TabsList>

              <div className="mt-6">
                <TabsContent value="lifecycle">
                  <SubscriptionLifecycle 
                    showTimeline={true}
                  />
                </TabsContent>

                <TabsContent value="methods">
                  <PaymentMethods 
                    showAddOptions={true}
                  />
                </TabsContent>

                <TabsContent value="cycles">
                  <BillingCycles 
                    showProration={true}
                  />
                </TabsContent>

                <TabsContent value="recovery">
                  {hasFailedPayment ? (
                    <PaymentRecovery 
                      showMetrics={true}
                    />
                  ) : (
                    <Card className="border-green-200 bg-green-50">
                      <CardContent className="p-8 text-center">
                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">All Payments Successful</h3>
                        <p className="text-gray-600 mb-4">
                          No failed payments to recover. The payment recovery system activates automatically when a payment fails.
                        </p>
                        <Button 
                          variant="outline"
                          onClick={() => setHasFailedPayment(true)}
                        >
                          Simulate Payment Failure
                        </Button>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="revenue">
                  <RevenueRecognition 
                    showCompliance={true}
                  />
                </TabsContent>
              </div>
            </Tabs>
          </CardContent>
        </Card>

        {/* Implementation Notes */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Implementation Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong>Subscription Lifecycle:</strong> The system tracks subscriptions through trial, 
                active, grace period, suspended, and cancelled states with automated transitions based on payment status.
              </p>
              <p>
                <strong>Payment Recovery:</strong> Implements a 6-attempt recovery strategy over 30 days with 
                increasing success rates through smart retry timing and multiple communication channels.
              </p>
              <p>
                <strong>Billing Flexibility:</strong> Supports monthly, quarterly, semi-annual, and annual billing 
                with automatic proration for mid-cycle changes and customizable billing dates.
              </p>
              <p>
                <strong>Revenue Recognition:</strong> Follows accrual accounting principles with proper handling 
                of deferred revenue, refunds, chargebacks, and tax compliance.
              </p>
              <p>
                <strong>Churn Prevention:</strong> The grace period and win-back campaigns help retain customers 
                who experience temporary payment issues, reducing involuntary churn by up to 40%.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}