"use client"

import { MarketingCampaignManagement } from "@/components/creator/marketing/marketing-campaign-management"

export default function Phase345Demo() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 3.4.5: Marketing Campaign Management
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Complete marketing campaign management system enabling creators to design, execute, and track 
          targeted campaigns across 6 campaign types with advanced analytics and A/B testing capabilities.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Campaign Wizard
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            6 Campaign Types
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Performance Analytics
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            A/B Testing
          </span>
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            Audience Segmentation
          </span>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            ROI Tracking
          </span>
        </div>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
          <h3 className="font-semibold text-purple-900 mb-2">📊 Campaign Analytics</h3>
          <p className="text-purple-700 text-sm">
            Track open rates, click rates, conversions, and ROI across all campaigns with detailed performance metrics.
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
          <h3 className="font-semibold text-blue-900 mb-2">🎯 Smart Targeting</h3>
          <p className="text-blue-700 text-sm">
            Target 5 fan segments with custom filters and audience size estimation for precise campaign delivery.
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
          <h3 className="font-semibold text-green-900 mb-2">🚀 Campaign Wizard</h3>
          <p className="text-green-700 text-sm">
            5-step wizard guides through goal definition, audience selection, message creation, scheduling, and launch.
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
          <h3 className="font-semibold text-orange-900 mb-2">⚡ A/B Testing</h3>
          <p className="text-orange-700 text-sm">
            Test subject lines, send times, content variations, and CTAs to optimize campaign performance.
          </p>
        </div>
        <div className="bg-gradient-to-br from-pink-50 to-pink-100 p-6 rounded-xl">
          <h3 className="font-semibold text-pink-900 mb-2">💎 Campaign Types</h3>
          <p className="text-pink-700 text-sm">
            6 proven campaign types: Welcome Series (35% activation), VIP Exclusive (400% ROI), Flash Sales, and more.
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl">
          <h3 className="font-semibold text-red-900 mb-2">📈 ROI Optimization</h3>
          <p className="text-red-700 text-sm">
            Revenue tracking, performance benchmarks, and automated optimization recommendations for maximum ROI.
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Campaign Performance Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold">5,351</div>
            <p className="text-purple-100">Total Sent</p>
            <div className="text-sm text-green-300">+12% this month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">69.7%</div>
            <p className="text-purple-100">Avg Open Rate</p>
            <div className="text-sm text-green-300">+18% improvement</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">$11,300</div>
            <p className="text-purple-100">Revenue Generated</p>
            <div className="text-sm text-green-300">+28% vs last month</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold">285%</div>
            <p className="text-purple-100">Average ROI</p>
            <div className="text-sm text-green-300">Industry leading</div>
          </div>
        </div>
      </div>

      {/* Campaign Types Preview */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-center">6 Proven Campaign Types</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white">
                ❤️
              </div>
              <div>
                <h3 className="font-semibold">Welcome Series</h3>
                <p className="text-sm text-gray-600">35% activation rate</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">Onboard new customers with personalized welcome sequences</p>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                🎁
              </div>
              <div>
                <h3 className="font-semibold">Seasonal</h3>
                <p className="text-sm text-gray-600">250% ROI</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">Holiday and special occasion campaigns for increased bookings</p>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center text-white">
                🔄
              </div>
              <div>
                <h3 className="font-semibold">Re-engagement</h3>
                <p className="text-sm text-gray-600">45% reactivation</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">Win back dormant fans with targeted reactivation campaigns</p>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center text-white">
                ⭐
              </div>
              <div>
                <h3 className="font-semibold">VIP Exclusive</h3>
                <p className="text-sm text-gray-600">400% ROI</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">Reward top 20% of fans with exclusive offers and content</p>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center text-white">
                ⚡
              </div>
              <div>
                <h3 className="font-semibold">Flash Sale</h3>
                <p className="text-sm text-gray-600">180% ROI</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">Create urgency with limited-time offers for quick revenue</p>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-pink-500 rounded-lg flex items-center justify-center text-white">
                👥
              </div>
              <div>
                <h3 className="font-semibold">Referral</h3>
                <p className="text-sm text-gray-600">300% ROI</p>
              </div>
            </div>
            <p className="text-sm text-gray-700">Grow your audience through existing fan referrals and rewards</p>
          </div>
        </div>
      </div>

      {/* Main Component */}
      <div className="bg-white rounded-2xl border shadow-sm">
        <MarketingCampaignManagement />
      </div>

      {/* Implementation Notes */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Campaign Creation Wizard</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 5-step guided campaign setup process</li>
              <li>• Goal definition with 4 primary objectives</li>
              <li>• Audience targeting with 5 fan segments</li>
              <li>• Message creation with templates and personalization</li>
              <li>• Scheduling with timezone handling and batch sending</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Performance Analytics</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Real-time campaign performance tracking</li>
              <li>• Open rate, click rate, and conversion metrics</li>
              <li>• Revenue attribution and ROI calculation</li>
              <li>• A/B testing with multiple variants</li>
              <li>• Historical trend analysis and reporting</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Audience Management</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 5 pre-defined fan segments with criteria</li>
              <li>• Custom filter combinations</li>
              <li>• Audience size estimation and preview</li>
              <li>• Engagement rate and spending insights</li>
              <li>• Segment performance comparison</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Campaign Operations</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Draft, scheduled, active, and completed states</li>
              <li>• Campaign duplication and template system</li>
              <li>• Pause, resume, and archive functionality</li>
              <li>• Batch sending and follow-up sequences</li>
              <li>• Automated optimization recommendations</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}