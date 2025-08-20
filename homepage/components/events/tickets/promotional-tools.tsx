'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Tag,
  Gift,
  Users,
  Package,
  Zap,
  Plus,
  Copy,
  Edit,
  Trash2,
  TrendingUp,
  Percent,
  Calendar,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DiscountCode {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  usageLimit?: number;
  usageCount: number;
  validFrom: Date;
  validUntil?: Date;
  active: boolean;
  ticketTiers?: string[];
}

interface ComplimentaryTicket {
  id: string;
  recipientEmail: string;
  recipientName: string;
  ticketTier: string;
  sentDate?: Date;
  claimed: boolean;
  notes?: string;
}

interface AffiliatePartner {
  id: string;
  name: string;
  code: string;
  commission: number;
  sales: number;
  revenue: number;
  clicks: number;
  conversionRate: number;
}

interface PromotionalToolsProps {
  eventId: string;
  discountCodes: DiscountCode[];
  complimentaryTickets: ComplimentaryTicket[];
  affiliatePartners: AffiliatePartner[];
  onCreateDiscount: () => void;
  onEditDiscount: (code: DiscountCode) => void;
  onDeleteDiscount: (code: DiscountCode) => void;
  onSendComplimentary: () => void;
  onAddAffiliate: () => void;
  onCreateLastMinuteOffer: () => void;
}

export function PromotionalTools({
  eventId,
  discountCodes,
  complimentaryTickets,
  affiliatePartners,
  onCreateDiscount,
  onEditDiscount,
  onDeleteDiscount,
  onSendComplimentary,
  onAddAffiliate,
  onCreateLastMinuteOffer
}: PromotionalToolsProps) {
  const [activeTab, setActiveTab] = React.useState('discounts');

  const activeDiscounts = discountCodes.filter(d => d.active);
  const totalDiscountUsage = discountCodes.reduce((sum, d) => sum + d.usageCount, 0);
  const totalAffiliateRevenue = affiliatePartners.reduce((sum, p) => sum + p.revenue, 0);
  const claimedComplimentary = complimentaryTickets.filter(t => t.claimed).length;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Discounts</p>
                <p className="text-2xl font-bold">{activeDiscounts.length}</p>
              </div>
              <Tag className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Discount Uses</p>
                <p className="text-2xl font-bold">{totalDiscountUsage}</p>
              </div>
              <Percent className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Comp Tickets</p>
                <p className="text-2xl font-bold">
                  {claimedComplimentary}/{complimentaryTickets.length}
                </p>
              </div>
              <Gift className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Affiliate Revenue</p>
                <p className="text-2xl font-bold">${totalAffiliateRevenue}</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Promotional Tools Tabs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Promotional Tools</CardTitle>
            <Button onClick={onCreateLastMinuteOffer} variant="outline" size="sm">
              <Zap className="h-4 w-4 mr-2" />
              Last-Minute Offer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="discounts">Discount Codes</TabsTrigger>
              <TabsTrigger value="complimentary">Comp Tickets</TabsTrigger>
              <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
              <TabsTrigger value="bundles">Bundles</TabsTrigger>
            </TabsList>

            {/* Discount Codes Tab */}
            <TabsContent value="discounts" className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Manage promotional discount codes for your event
                </p>
                <Button onClick={onCreateDiscount} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Code
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Discount</TableHead>
                      <TableHead>Usage</TableHead>
                      <TableHead>Valid Period</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-24"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {discountCodes.map((code) => (
                      <TableRow key={code.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="font-mono font-bold">{code.code}</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => navigator.clipboard.writeText(code.code)}
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {code.type === 'percentage' ? (
                            <Badge variant="secondary">{code.value}% OFF</Badge>
                          ) : (
                            <Badge variant="secondary">${code.value} OFF</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {code.usageCount}
                            {code.usageLimit && `/${code.usageLimit}`}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{code.validFrom.toLocaleDateString()}</div>
                            {code.validUntil && (
                              <div className="text-gray-500">
                                to {code.validUntil.toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Switch
                            checked={code.active}
                            onCheckedChange={() => {}}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEditDiscount(code)}
                            >
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteDiscount(code)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Complimentary Tickets Tab */}
            <TabsContent value="complimentary" className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Send complimentary tickets to VIPs, press, or special guests
                </p>
                <Button onClick={onSendComplimentary} size="sm">
                  <Gift className="h-4 w-4 mr-2" />
                  Send Tickets
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Recipient</TableHead>
                      <TableHead>Ticket Type</TableHead>
                      <TableHead>Sent Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Notes</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {complimentaryTickets.map((ticket) => (
                      <TableRow key={ticket.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{ticket.recipientName}</div>
                            <div className="text-sm text-gray-500">{ticket.recipientEmail}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{ticket.ticketTier}</Badge>
                        </TableCell>
                        <TableCell>
                          {ticket.sentDate?.toLocaleDateString() || 'Pending'}
                        </TableCell>
                        <TableCell>
                          {ticket.claimed ? (
                            <Badge variant="success">Claimed</Badge>
                          ) : (
                            <Badge variant="secondary">Sent</Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-gray-600">{ticket.notes}</span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Affiliate Partners Tab */}
            <TabsContent value="affiliates" className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  Manage affiliate partners and track their performance
                </p>
                <Button onClick={onAddAffiliate} size="sm">
                  <Users className="h-4 w-4 mr-2" />
                  Add Partner
                </Button>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Partner</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Commission</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Conversion</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {affiliatePartners.map((partner) => (
                      <TableRow key={partner.id}>
                        <TableCell className="font-medium">{partner.name}</TableCell>
                        <TableCell>
                          <code className="font-mono text-sm">{partner.code}</code>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{partner.commission}%</Badge>
                        </TableCell>
                        <TableCell>{partner.sales}</TableCell>
                        <TableCell className="font-medium">${partner.revenue}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3 text-green-500" />
                            <span className="text-sm">{partner.conversionRate}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>

            {/* Bundle Deals Tab */}
            <TabsContent value="bundles" className="space-y-4">
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <h3 className="font-semibold mb-2">Bundle Deals</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Create package deals for multiple tickets or events
                </p>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Bundle
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Last-Minute Offer Alert */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="h-4 w-4 text-purple-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="justify-start">
              <Clock className="h-4 w-4 mr-2" />
              Flash Sale (2 hours)
            </Button>
            <Button variant="outline" className="justify-start">
              <Users className="h-4 w-4 mr-2" />
              Group Deal (5+ tickets)
            </Button>
            <Button variant="outline" className="justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Early Bird Extended
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}