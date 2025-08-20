"use client"

import { CommunicationAnalytics } from "@/components/creator/analytics/communication-analytics"

export default function Phase347Demo() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 3.4.7: Communication Analytics
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Data-driven insights into communication patterns and effectiveness to optimize 
          creator-customer relationships with comprehensive KPI tracking and analysis.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            6 Core KPIs
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Response Analytics
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Pattern Analysis
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Efficiency Metrics
          </span>
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            Quality Indicators
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            AI Insights
          </span>
        </div>
      </div>

      {/* KPI Overview Table */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Communication KPIs & Targets</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Metric</th>
                <th className="text-left p-3">Measurement</th>
                <th className="text-left p-3">Current</th>
                <th className="text-left p-3">Target</th>
                <th className="text-left p-3">Status</th>
                <th className="text-left p-3">Impact on Business</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Response Rate</td>
                <td className="p-3">% messages answered</td>
                <td className="p-3">
                  <span className="font-bold text-green-600">96.5%</span>
                </td>
                <td className="p-3">95%</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Above Target</span>
                </td>
                <td className="p-3">Customer satisfaction</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Response Time</td>
                <td className="p-3">Average hours</td>
                <td className="p-3">
                  <span className="font-bold text-green-600">3.2 hrs</span>
                </td>
                <td className="p-3">&lt;4 hours</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">On Target</span>
                </td>
                <td className="p-3">Booking conversion</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Message Volume</td>
                <td className="p-3">Daily average</td>
                <td className="p-3">
                  <span className="font-bold text-blue-600">127 msgs</span>
                </td>
                <td className="p-3">Manageable</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Healthy</span>
                </td>
                <td className="p-3">Creator burnout prevention</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Sentiment Score</td>
                <td className="p-3">Positive %</td>
                <td className="p-3">
                  <span className="font-bold text-green-600">88.3%</span>
                </td>
                <td className="p-3">&gt;85%</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Above Target</span>
                </td>
                <td className="p-3">Brand reputation</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Resolution Rate</td>
                <td className="p-3">First contact</td>
                <td className="p-3">
                  <span className="font-bold text-green-600">82.7%</span>
                </td>
                <td className="p-3">&gt;80%</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Above Target</span>
                </td>
                <td className="p-3">Efficiency</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-medium">Engagement Rate</td>
                <td className="p-3">Active conversations</td>
                <td className="p-3">
                  <span className="font-bold text-green-600">234</span>
                </td>
                <td className="p-3">Growing</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">+12% Growth</span>
                </td>
                <td className="p-3">Relationship depth</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Weekly Pattern Visual */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Weekly Communication Flow Pattern</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-4">
            <span className="w-24 text-right font-medium">Monday:</span>
            <div className="flex-1 bg-white/20 rounded-full h-8 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-white/80 rounded-full flex items-center justify-end pr-3" style={{width: '92%'}}>
                <span className="text-purple-900 font-bold text-sm">Peak (185)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-24 text-right font-medium">Tuesday:</span>
            <div className="flex-1 bg-white/20 rounded-full h-8 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-white/60 rounded-full flex items-center justify-end pr-3" style={{width: '71%'}}>
                <span className="text-purple-900 font-bold text-sm">High (142)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-24 text-right font-medium">Wednesday:</span>
            <div className="flex-1 bg-white/20 rounded-full h-8 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-white/40 rounded-full flex items-center justify-end pr-3" style={{width: '59%'}}>
                <span className="text-purple-900 font-bold text-sm">Normal (118)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-24 text-right font-medium">Thursday:</span>
            <div className="flex-1 bg-white/20 rounded-full h-8 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-white/60 rounded-full flex items-center justify-end pr-3" style={{width: '78%'}}>
                <span className="text-purple-900 font-bold text-sm">High (156)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-24 text-right font-medium">Friday:</span>
            <div className="flex-1 bg-white/20 rounded-full h-8 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-white/80 rounded-full flex items-center justify-end pr-3" style={{width: '96%'}}>
                <span className="text-purple-900 font-bold text-sm">Peak (192)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-24 text-right font-medium">Saturday:</span>
            <div className="flex-1 bg-white/20 rounded-full h-8 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-white/30 rounded-full flex items-center justify-end pr-3" style={{width: '39%'}}>
                <span className="text-purple-900 font-bold text-sm">Low (78)</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="w-24 text-right font-medium">Sunday:</span>
            <div className="flex-1 bg-white/20 rounded-full h-8 relative overflow-hidden">
              <div className="absolute inset-y-0 left-0 bg-white/30 rounded-full flex items-center justify-end pr-3" style={{width: '33%'}}>
                <span className="text-purple-900 font-bold text-sm">Low (65)</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center text-sm opacity-90">
          <p>Peak activity on Monday (weekend follow-up) and Friday (weekend prep)</p>
        </div>
      </div>

      {/* Optimization Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4">📊 Efficiency Metrics</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Template usage rate</span>
              <span className="font-bold text-purple-600">68%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Automation effectiveness</span>
              <span className="font-bold text-blue-600">42%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Time per conversation</span>
              <span className="font-bold text-green-600">8.5 min</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Bulk message impact</span>
              <span className="font-bold text-orange-600">3.2x</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Channel preference (In-app)</span>
              <span className="font-bold text-purple-600">45%</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4">✨ Quality Indicators</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Customer satisfaction</span>
              <span className="font-bold text-yellow-600">4.6/5 ⭐</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Conversation depth</span>
              <span className="font-bold text-blue-600">3.8 msgs</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Problem resolution</span>
              <span className="font-bold text-green-600">82%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Repeat engagement</span>
              <span className="font-bold text-purple-600">67%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Referral generation</span>
              <span className="font-bold text-pink-600">23%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">96.5%</div>
          <p className="text-gray-600 mt-1">Response Rate</p>
          <div className="text-sm text-green-600 mt-2">↑ 2.3% vs last month</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">3.2 hrs</div>
          <p className="text-gray-600 mt-1">Avg Response Time</p>
          <div className="text-sm text-green-600 mt-2">↓ 18% improvement</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">82.7%</div>
          <p className="text-gray-600 mt-1">First Contact Resolution</p>
          <div className="text-sm text-green-600 mt-2">↑ 5.1% vs target</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-yellow-500">4.6/5</div>
          <p className="text-gray-600 mt-1">Satisfaction Score</p>
          <div className="text-sm text-green-600 mt-2">Above industry avg</div>
        </div>
      </div>

      {/* Main Component */}
      <div className="bg-white rounded-2xl border shadow-sm">
        <CommunicationAnalytics />
      </div>

      {/* Implementation Notes */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Communication KPIs</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Response Rate tracking (target: &gt;95%)</li>
              <li>• Response Time monitoring (&lt;4 hours)</li>
              <li>• Message Volume analysis (manageable load)</li>
              <li>• Sentiment Score tracking (&gt;85% positive)</li>
              <li>• Resolution Rate metrics (&gt;80% first contact)</li>
              <li>• Engagement Rate growth tracking</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Pattern Analysis</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Weekly communication flow visualization</li>
              <li>• Peak hours heatmap (9am-5pm highest)</li>
              <li>• Channel distribution insights</li>
              <li>• Response time by channel analysis</li>
              <li>• Message type categorization</li>
              <li>• Seasonal trend identification</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Efficiency Metrics</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Template usage rate (68%)</li>
              <li>• Automation effectiveness (42%)</li>
              <li>• Time per conversation tracking</li>
              <li>• Bulk message impact analysis</li>
              <li>• Channel preference monitoring</li>
              <li>• Cost reduction calculations</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Quality Indicators</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Customer satisfaction scoring (4.6/5)</li>
              <li>• Conversation depth analysis</li>
              <li>• Problem resolution tracking</li>
              <li>• Repeat engagement monitoring</li>
              <li>• Referral generation metrics</li>
              <li>• Sentiment trend analysis</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}