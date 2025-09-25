// Archived from creator/settings/page.tsx on 2025-09-16
// This tab was used for managing pricing, payments, and promotional tools

import React from 'react'
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Info, Sparkles } from "lucide-react"

interface PricingTabProps {
  creatorData: {
    stats: {
      totalEarned: string
    }
  }
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>
}

export function PricingTab({ creatorData, setHasUnsavedChanges }: PricingTabProps) {
  return (
    <TabsContent value="pricing" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pricing & Payments</CardTitle>
          <CardDescription>
            Manage your earnings and payment settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Earnings Overview */}
          <div className="grid sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Total Earned</p>
                <p className="text-2xl font-bold text-purple-600">{creatorData.stats.totalEarned}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-green-600">$12,450</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-amber-600">$1,850</p>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Platform Fees */}
          <div className="space-y-4">
            <h3 className="font-semibold">Platform Fees</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Platform Commission</span>
                <span className="font-medium">20%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Payment Processing</span>
                <span className="font-medium">2.9% + $0.30</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-medium">Your Earnings</span>
                <span className="font-bold text-green-600">~77%</span>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              <Info className="h-4 w-4 inline mr-1" />
              Fees are automatically deducted from each transaction
            </p>
          </div>

          <Separator />

          {/* Payout Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold">Payout Settings</h3>
            <div className="space-y-2">
              <Label>Payout Method</Label>
              <select className="w-full p-2 border rounded-lg">
                <option>Direct Deposit (Bank Transfer)</option>
                <option>PayPal</option>
                <option>Stripe</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Payout Schedule</Label>
              <select className="w-full p-2 border rounded-lg">
                <option>Weekly</option>
                <option>Bi-weekly</option>
                <option>Monthly</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Minimum Payout Amount</Label>
              <Input type="number" defaultValue="100" min="50" step="10" />
              <p className="text-sm text-gray-500">
                Earnings below this amount will roll over to the next payout
              </p>
            </div>
          </div>

          <Separator />

          {/* Promotional Tools */}
          <div className="space-y-4">
            <h3 className="font-semibold">Promotional Tools</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Limited-Time Discount</p>
                  <p className="text-sm text-gray-600">Offer a temporary discount to boost bookings</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Bundle Deals</p>
                  <p className="text-sm text-gray-600">Offer discounts for multiple video bookings</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Referral Program</p>
                  <p className="text-sm text-gray-600">Earn when you refer other creators</p>
                </div>
                <Switch />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}