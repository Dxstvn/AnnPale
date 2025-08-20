"use client"

import { PayoutSystemArchitecture } from "@/components/creator/finance/payout-system-architecture"

export default function Phase354Demo() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 3.5.4: Payout System Architecture
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Flexible payout options with multiple withdrawal methods, smart scheduling, 
          and enterprise-grade security features for creator financial management.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            6 Payment Methods
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Flexible Scheduling
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Instant Payouts
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Auto-Withdrawal
          </span>
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            Security Features
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Multi-Factor Auth
          </span>
        </div>
      </div>

      {/* Payout Methods Comparison Table */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Payout Method Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Method</th>
                <th className="text-left p-3">Speed</th>
                <th className="text-left p-3">Fee</th>
                <th className="text-left p-3">Minimum</th>
                <th className="text-left p-3">Maximum</th>
                <th className="text-left p-3">Best For</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">⚡ Instant Debit</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">30 min</span>
                </td>
                <td className="p-3">1.5%</td>
                <td className="p-3">$10</td>
                <td className="p-3">$5,000</td>
                <td className="p-3">Urgent needs</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">🏦 Bank Transfer</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">2-3 days</span>
                </td>
                <td className="p-3">
                  <span className="text-green-600 font-semibold">Free</span>
                </td>
                <td className="p-3">$50</td>
                <td className="p-3">$10,000</td>
                <td className="p-3">Regular income</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">💳 PayPal</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">1 day</span>
                </td>
                <td className="p-3">2%</td>
                <td className="p-3">$25</td>
                <td className="p-3">$5,000</td>
                <td className="p-3">Flexibility</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">💰 Venmo</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">1 day</span>
                </td>
                <td className="p-3">1%</td>
                <td className="p-3">$20</td>
                <td className="p-3">$3,000</td>
                <td className="p-3">Personal use</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">📄 Check</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">5-7 days</span>
                </td>
                <td className="p-3">$2</td>
                <td className="p-3">$100</td>
                <td className="p-3">No limit</td>
                <td className="p-3">Traditional</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-medium">₿ Crypto</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">1 hour</span>
                </td>
                <td className="p-3">Network fee</td>
                <td className="p-3">$50</td>
                <td className="p-3">No limit</td>
                <td className="p-3">International</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Scheduling Options Visualization */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Payout Scheduling Flexibility</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Manual */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-bold mb-2">Manual (On-Demand)</h3>
            <ul className="space-y-1 text-sm opacity-90">
              <li>• Withdraw anytime</li>
              <li>• Choose amount</li>
              <li>• Select method</li>
              <li>• Instant processing</li>
            </ul>
          </div>

          {/* Automatic */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-3">📅</div>
            <h3 className="font-bold mb-2">Automatic</h3>
            <ul className="space-y-1 text-sm opacity-90">
              <li>• Daily: Every evening</li>
              <li>• Weekly: Choose day</li>
              <li>• Bi-weekly: Set schedule</li>
              <li>• Monthly: Pick date</li>
            </ul>
          </div>

          {/* Threshold-Based */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold mb-2">Threshold-Based</h3>
            <ul className="space-y-1 text-sm opacity-90">
              <li>• When balance reaches $X</li>
              <li>• Minimum accumulation</li>
              <li>• Smart optimization</li>
              <li>• Tax-efficient timing</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Security Features Grid */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Security Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-purple-700 mb-3">🔐 Verification Requirements</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Identity confirmation (Government ID + Selfie)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Bank account verification (Micro-deposits)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Two-factor authentication (SMS/App)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Withdrawal limits (Daily/Monthly)</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Cooling periods (24-hour for new methods)</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-blue-700 mb-3">🛡️ Fraud Prevention</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Unusual activity alerts</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Withdrawal delays for suspicious activity</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Multi-step verification process</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>IP monitoring and geolocation</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Device fingerprinting</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Withdrawal Process Flow */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Withdrawal Process Flow</h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">1️⃣</span>
            </div>
            <p className="text-sm font-medium">Select Method</p>
            <p className="text-xs text-gray-500">Choose payout option</p>
          </div>
          <div className="text-2xl text-gray-400">→</div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">2️⃣</span>
            </div>
            <p className="text-sm font-medium">Enter Amount</p>
            <p className="text-xs text-gray-500">Specify withdrawal</p>
          </div>
          <div className="text-2xl text-gray-400">→</div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">3️⃣</span>
            </div>
            <p className="text-sm font-medium">Verify Identity</p>
            <p className="text-xs text-gray-500">Security check</p>
          </div>
          <div className="text-2xl text-gray-400">→</div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">4️⃣</span>
            </div>
            <p className="text-sm font-medium">2FA Confirm</p>
            <p className="text-xs text-gray-500">Enter code</p>
          </div>
          <div className="text-2xl text-gray-400">→</div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">5️⃣</span>
            </div>
            <p className="text-sm font-medium">Processing</p>
            <p className="text-xs text-gray-500">Transfer initiated</p>
          </div>
          <div className="text-2xl text-gray-400">→</div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">✅</span>
            </div>
            <p className="text-sm font-medium">Complete</p>
            <p className="text-xs text-gray-500">Funds sent</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">$3,456</div>
          <p className="text-gray-600 mt-1">Available Balance</p>
          <div className="text-sm text-green-600 mt-2">Ready to withdraw</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">6</div>
          <p className="text-gray-600 mt-1">Payment Methods</p>
          <div className="text-sm text-blue-600 mt-2">Multiple options</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">30 min</div>
          <p className="text-gray-600 mt-1">Fastest Payout</p>
          <div className="text-sm text-green-600 mt-2">Instant debit</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">75%</div>
          <p className="text-gray-600 mt-1">Security Score</p>
          <div className="text-sm text-orange-600 mt-2">Strong protection</div>
        </div>
      </div>

      {/* Main Component */}
      <div className="bg-white rounded-2xl border shadow-sm">
        <PayoutSystemArchitecture />
      </div>

      {/* Implementation Notes */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Withdrawal Methods</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Instant Debit (30 min, 1.5% fee)</li>
              <li>• Bank Transfer (2-3 days, free)</li>
              <li>• PayPal (1 day, 2% fee)</li>
              <li>• Venmo (1 day, 1% fee)</li>
              <li>• Check (5-7 days, $2 fee)</li>
              <li>• Crypto (1 hour, network fee)</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Scheduling Options</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Manual on-demand withdrawals</li>
              <li>• Daily automatic payouts</li>
              <li>• Weekly scheduled transfers</li>
              <li>• Bi-weekly and monthly options</li>
              <li>• Threshold-based triggers</li>
              <li>• Tax-efficient timing</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Security Features</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Identity verification (ID + selfie)</li>
              <li>• Bank account verification</li>
              <li>• Two-factor authentication</li>
              <li>• Withdrawal limits protection</li>
              <li>• 24-hour cooling periods</li>
              <li>• Activity monitoring & alerts</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">User Experience</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Real-time fee calculations</li>
              <li>• Clear minimum/maximum limits</li>
              <li>• Visual security verification flow</li>
              <li>• Animated confirmation process</li>
              <li>• Success notifications</li>
              <li>• Transaction history tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}