"use client"

import { FinancialPsychologyTrust } from "@/components/creator/finance/financial-psychology-trust"

export default function Phase351Demo() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 3.5.1: Financial Psychology & Trust
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Understanding creator financial anxieties to design systems that build trust, 
          provide clarity, and support financial success through personalized experiences.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            5 Personas
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Trust Factors
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Anxiety Mitigation
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Transparency
          </span>
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            Financial Control
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Support Tools
          </span>
        </div>
      </div>

      {/* Creator Financial Personas Table */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Creator Financial Personas</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Persona</th>
                <th className="text-left p-3">Primary Concern</th>
                <th className="text-left p-3">Financial Literacy</th>
                <th className="text-left p-3">Payout Preference</th>
                <th className="text-left p-3">Support Needs</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="font-medium">Side Hustler</span>
                  </div>
                </td>
                <td className="p-3">Extra income</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Basic</span>
                </td>
                <td className="p-3">Weekly, small amounts</td>
                <td className="p-3">Simple tracking</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Professional</span>
                  </div>
                </td>
                <td className="p-3">Stable income</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Moderate</span>
                </td>
                <td className="p-3">Bi-weekly, predictable</td>
                <td className="p-3">Business tools</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Full-Timer</span>
                  </div>
                </td>
                <td className="p-3">Primary income</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">High</span>
                </td>
                <td className="p-3">Optimized schedule</td>
                <td className="p-3">Tax planning</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="font-medium">Seasonal</span>
                  </div>
                </td>
                <td className="p-3">Irregular flow</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Varies</span>
                </td>
                <td className="p-3">Flexible</td>
                <td className="p-3">Cash flow help</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="font-medium">International</span>
                  </div>
                </td>
                <td className="p-3">Currency/fees</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Varies</span>
                </td>
                <td className="p-3">Local methods</td>
                <td className="p-3">Multi-currency</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Trust Building Framework */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Trust Building Framework</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-3">👁️</div>
            <h3 className="font-bold mb-2">Transparency</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Clear fee structure</li>
              <li>• Real-time balances</li>
              <li>• Detailed breakdowns</li>
              <li>• No hidden charges</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-white/20">
              <span className="text-xs opacity-75">+40% confidence</span>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-bold mb-2">Security</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Bank-level encryption</li>
              <li>• PCI compliance</li>
              <li>• Fraud protection</li>
              <li>• Account verification</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-white/20">
              <span className="text-xs opacity-75">+35% trust</span>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-3">⏰</div>
            <h3 className="font-bold mb-2">Reliability</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• On-time payments</li>
              <li>• Multiple payout methods</li>
              <li>• Clear timelines</li>
              <li>• Support availability</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-white/20">
              <span className="text-xs opacity-75">+30% satisfaction</span>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-bold mb-2">Control</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Flexible scheduling</li>
              <li>• Multiple options</li>
              <li>• Instant access</li>
              <li>• Full history</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-white/20">
              <span className="text-xs opacity-75">+25% empowerment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Anxiety Triggers */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Financial Anxiety Triggers & Solutions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Trigger</th>
                <th className="text-left p-3">Creator Fear</th>
                <th className="text-left p-3">Design Solution</th>
                <th className="text-left p-3">Trust Impact</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Unclear fees</td>
                <td className="p-3">Hidden costs</td>
                <td className="p-3">Upfront disclosure</td>
                <td className="p-3">
                  <span className="text-green-600 font-medium">+40% confidence</span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Resolved</span>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Payment delays</td>
                <td className="p-3">Cash flow issues</td>
                <td className="p-3">Clear timeline</td>
                <td className="p-3">
                  <span className="text-green-600 font-medium">+35% satisfaction</span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Resolved</span>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Complex taxes</td>
                <td className="p-3">IRS problems</td>
                <td className="p-3">Simple documentation</td>
                <td className="p-3">
                  <span className="text-green-600 font-medium">+45% relief</span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">In Progress</span>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Platform changes</td>
                <td className="p-3">Lost earnings</td>
                <td className="p-3">Grandfathering</td>
                <td className="p-3">
                  <span className="text-green-600 font-medium">+50% loyalty</span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Resolved</span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-medium">Technical errors</td>
                <td className="p-3">Lost money</td>
                <td className="p-3">Instant support</td>
                <td className="p-3">
                  <span className="text-green-600 font-medium">+30% trust</span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Pending</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">82%</div>
          <p className="text-gray-600 mt-1">Overall Trust Score</p>
          <div className="text-sm text-green-600 mt-2">↑ 15% this quarter</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">92%</div>
          <p className="text-gray-600 mt-1">Transparency Rating</p>
          <div className="text-sm text-green-600 mt-2">Industry leading</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">98%</div>
          <p className="text-gray-600 mt-1">On-time Payments</p>
          <div className="text-sm text-green-600 mt-2">Above target</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">3/5</div>
          <p className="text-gray-600 mt-1">Issues Resolved</p>
          <div className="text-sm text-blue-600 mt-2">2 in progress</div>
        </div>
      </div>

      {/* Main Component */}
      <div className="bg-white rounded-2xl border shadow-sm">
        <FinancialPsychologyTrust />
      </div>

      {/* Implementation Notes */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Financial Personas</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 5 distinct creator personas identified</li>
              <li>• Personalized financial literacy levels</li>
              <li>• Custom payout preferences</li>
              <li>• Targeted support recommendations</li>
              <li>• Anxiety level tracking</li>
              <li>• Trust score per persona</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Trust Building</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 4 core trust factors</li>
              <li>• Transparency metrics (92%)</li>
              <li>• Security compliance badges</li>
              <li>• Reliability tracking (98% on-time)</li>
              <li>• User control features</li>
              <li>• Trust impact measurement</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Anxiety Mitigation</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 5 key anxiety triggers identified</li>
              <li>• Design solutions for each trigger</li>
              <li>• Trust impact quantification</li>
              <li>• Resolution status tracking</li>
              <li>• Proactive communication</li>
              <li>• Support availability indicators</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Financial Tools</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Fee calculator transparency</li>
              <li>• Tax document generation</li>
              <li>• Flexible payout scheduling</li>
              <li>• Real-time balance updates</li>
              <li>• Multi-currency support</li>
              <li>• Financial planning resources</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}