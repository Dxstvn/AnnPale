"use client"

import { FeeStructureTransparency } from "@/components/creator/finance/fee-structure-transparency"

export default function Phase355Demo() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 3.5.5: Fee Structure Transparency
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Complete transparency in platform fees with interactive calculators, detailed breakdowns, 
          and optimization strategies to maximize creator earnings.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Interactive Calculator
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Fee Breakdown
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            No Hidden Fees
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Volume Discounts
          </span>
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            Optimization Tips
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Education Center
          </span>
        </div>
      </div>

      {/* Fee Structure Overview */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Fee Structure Overview</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Fee Type</th>
                <th className="text-left p-3">When Applied</th>
                <th className="text-left p-3">Rate</th>
                <th className="text-left p-3">Negotiable</th>
                <th className="text-left p-3">Ways to Reduce</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">🏛️ Platform</td>
                <td className="p-3">Every transaction</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-mono">20%</span>
                </td>
                <td className="p-3">
                  <span className="text-green-600">✓ After $10k/mo</span>
                </td>
                <td className="p-3">Volume discounts</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">💳 Processing</td>
                <td className="p-3">Card payments</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-mono">2.9% + $0.30</span>
                </td>
                <td className="p-3">
                  <span className="text-gray-400">No</span>
                </td>
                <td className="p-3">ACH transfers</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">⚡ Instant Payout</td>
                <td className="p-3">Optional</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-mono">1.5%</span>
                </td>
                <td className="p-3">
                  <span className="text-gray-400">No</span>
                </td>
                <td className="p-3">Standard payout</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">🌍 International</td>
                <td className="p-3">Cross-border</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-mono">2%</span>
                </td>
                <td className="p-3">
                  <span className="text-gray-400">No</span>
                </td>
                <td className="p-3">Local methods</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-medium">⚠️ Chargebacks</td>
                <td className="p-3">Disputes</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-mono">$15</span>
                </td>
                <td className="p-3">
                  <span className="text-gray-400">No</span>
                </td>
                <td className="p-3">Clear communication</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Example Visualization */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Example Transaction Breakdown</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold mb-4">$100 Video Message</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Earned:</span>
                <span className="font-semibold">$100.00</span>
              </div>
              <div className="flex justify-between text-red-200">
                <span>├── Platform Fee (20%):</span>
                <span>-$20.00</span>
              </div>
              <div className="flex justify-between text-red-200">
                <span>├── Processing Fee:</span>
                <span>-$3.20</span>
              </div>
              <div className="flex justify-between text-green-200">
                <span>├── Rush Bonus:</span>
                <span>+$15.00</span>
              </div>
              <div className="flex justify-between text-green-200">
                <span>├── Customer Tip:</span>
                <span>+$10.00</span>
              </div>
              <div className="border-t border-white/30 pt-2 mt-2 flex justify-between font-bold text-lg">
                <span>└── Net Earnings:</span>
                <span className="text-green-300">$101.80</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold mb-4">Visual Distribution</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Creator (80%)</span>
                  <span>$101.80</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-4">
                  <div className="bg-green-400 h-4 rounded-full" style={{width: "80%"}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Platform (20%)</span>
                  <span>$20.00</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-4">
                  <div className="bg-purple-400 h-4 rounded-full" style={{width: "20%"}}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Processing (3.2%)</span>
                  <span>$3.20</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-4">
                  <div className="bg-blue-400 h-4 rounded-full" style={{width: "3.2%"}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Volume Discount Tiers */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Volume Discount Tiers</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center p-4 border rounded-lg">
            <div className="text-2xl mb-2">🥉</div>
            <h3 className="font-bold">Standard</h3>
            <p className="text-sm text-gray-500 mb-2">$0 - $5k/mo</p>
            <div className="text-2xl font-bold text-gray-700">20%</div>
            <p className="text-xs text-gray-500">Platform Fee</p>
          </div>
          <div className="text-center p-4 border rounded-lg bg-gray-50">
            <div className="text-2xl mb-2">🥈</div>
            <h3 className="font-bold">Silver</h3>
            <p className="text-sm text-gray-500 mb-2">$5k - $10k/mo</p>
            <div className="text-2xl font-bold text-gray-600">18%</div>
            <p className="text-xs text-gray-500">Platform Fee</p>
          </div>
          <div className="text-center p-4 border rounded-lg bg-yellow-50">
            <div className="text-2xl mb-2">🥇</div>
            <h3 className="font-bold">Gold</h3>
            <p className="text-sm text-gray-500 mb-2">$10k - $25k/mo</p>
            <div className="text-2xl font-bold text-yellow-600">15%</div>
            <p className="text-xs text-gray-500">Platform Fee</p>
          </div>
          <div className="text-center p-4 border rounded-lg bg-purple-50">
            <div className="text-2xl mb-2">💎</div>
            <h3 className="font-bold">Platinum</h3>
            <p className="text-sm text-gray-500 mb-2">$25k - $50k/mo</p>
            <div className="text-2xl font-bold text-purple-600">12%</div>
            <p className="text-xs text-gray-500">Platform Fee</p>
          </div>
          <div className="text-center p-4 border rounded-lg bg-gradient-to-br from-purple-50 to-pink-50">
            <div className="text-2xl mb-2">💠</div>
            <h3 className="font-bold">Diamond</h3>
            <p className="text-sm text-gray-500 mb-2">$50k+/mo</p>
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">10%</div>
            <p className="text-xs text-gray-500">Platform Fee</p>
          </div>
        </div>
      </div>

      {/* Fee Optimization Tips */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-600">📉</span>
            Cost Reduction Strategies
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <div>
                <strong>Batch withdrawals</strong>
                <p className="text-sm text-gray-600">Save $50-100/month by combining withdrawals</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <div>
                <strong>Use free methods</strong>
                <p className="text-sm text-gray-600">Save 1.5% with bank transfers over instant</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <div>
                <strong>Achieve tier discounts</strong>
                <p className="text-sm text-gray-600">Save up to 10% with volume discounts</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <div>
                <strong>Minimize chargebacks</strong>
                <p className="text-sm text-gray-600">Save $15/incident with clear communication</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <div>
                <strong>Local payment methods</strong>
                <p className="text-sm text-gray-600">Save 2% by avoiding international fees</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-600">📈</span>
            Revenue Optimization
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-purple-600 mt-1">✓</span>
              <div>
                <strong>Price for net earnings</strong>
                <p className="text-sm text-gray-600">Increase revenue by 25% with proper pricing</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 mt-1">✓</span>
              <div>
                <strong>Encourage tips</strong>
                <p className="text-sm text-gray-600">Add 10-20% with tip suggestions</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 mt-1">✓</span>
              <div>
                <strong>Offer packages</strong>
                <p className="text-sm text-gray-600">Increase AOV by 30% with bundles</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 mt-1">✓</span>
              <div>
                <strong>Premium services</strong>
                <p className="text-sm text-gray-600">Earn 50% more per order with exclusives</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-purple-600 mt-1">✓</span>
              <div>
                <strong>Efficient operations</strong>
                <p className="text-sm text-gray-600">Save 2-3 hours/week with streamlined workflow</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">20%</div>
          <p className="text-gray-600 mt-1">Standard Fee</p>
          <div className="text-sm text-purple-600 mt-2">Platform rate</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">2.9%</div>
          <p className="text-gray-600 mt-1">Processing</p>
          <div className="text-sm text-blue-600 mt-2">+ $0.30 per transaction</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">10%</div>
          <p className="text-gray-600 mt-1">Lowest Tier</p>
          <div className="text-sm text-green-600 mt-2">Diamond level</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">$600</div>
          <p className="text-gray-600 mt-1">Annual Savings</p>
          <div className="text-sm text-orange-600 mt-2">With optimization</div>
        </div>
      </div>

      {/* Main Component */}
      <div className="bg-white rounded-2xl border shadow-sm">
        <FeeStructureTransparency />
      </div>

      {/* Implementation Notes */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Interactive Calculator</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Real-time fee calculations</li>
              <li>• Transaction amount slider</li>
              <li>• Rush bonus toggle (+$15)</li>
              <li>• Customer tip toggle (10%)</li>
              <li>• Net earnings display</li>
              <li>• Visual pie chart breakdown</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Fee Education</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Detailed fee explanations</li>
              <li>• When each fee applies</li>
              <li>• Negotiable vs fixed fees</li>
              <li>• Ways to reduce each fee</li>
              <li>• Expandable information cards</li>
              <li>• Interactive learning tabs</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Volume Tiers</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 5 discount tiers (20% → 10%)</li>
              <li>• Monthly volume calculator</li>
              <li>• Progress to next tier</li>
              <li>• Savings visualization</li>
              <li>• Tier comparison table</li>
              <li>• Automatic tier detection</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Optimization Tips</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Cost reduction strategies</li>
              <li>• Revenue optimization tactics</li>
              <li>• Estimated savings amounts</li>
              <li>• Batch withdrawal benefits</li>
              <li>• Payment method comparison</li>
              <li>• Pro tips and best practices</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}