"use client"

import { EarningsDashboardDesign } from "@/components/creator/finance/earnings-dashboard-design"

export default function Phase352Demo() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 3.5.2: Earnings Dashboard Design
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Present financial information in clear, actionable formats that help creators 
          understand their earnings and make informed business decisions.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Balance Hero
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Metrics Cards
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Visualizations
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Status Indicators
          </span>
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            Transactions
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Analytics
          </span>
        </div>
      </div>

      {/* Financial Summary Hierarchy */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Financial Summary Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold text-purple-700">Primary Display (Hero)</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <div>
                  <strong>Available Balance:</strong> $3,456.78
                  <span className="text-gray-500 block text-xs">Large, bold, animated</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <div>
                  <strong>Pending Clearance:</strong> $892.34
                  <span className="text-gray-500 block text-xs">Medium size, yellow indicator</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <div>
                  <strong>This Month Total:</strong> $4,349.12
                  <span className="text-gray-500 block text-xs">Medium size, progress bar</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <div>
                  <strong>[Withdraw Now] Button</strong>
                  <span className="text-gray-500 block text-xs">Prominent CTA</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-blue-700">Secondary Metrics</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <div>
                  <strong>Today's Earnings:</strong> $234.56
                  <span className="text-gray-500 block text-xs">With trend indicator</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <div>
                  <strong>Weekly Average:</strong> $789.00
                  <span className="text-gray-500 block text-xs">Comparison metrics</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <div>
                  <strong>Best Day Ever:</strong> $1,234.56
                  <span className="text-gray-500 block text-xs">Achievement badge</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <div>
                  <strong>Next Payout:</strong> In 2 days
                  <span className="text-gray-500 block text-xs">Countdown timer</span>
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-green-700">Detailed Breakdown</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <div>
                  <strong>Recent Transactions</strong>
                  <span className="text-gray-500 block text-xs">List with status</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <div>
                  <strong>Fee Breakdowns</strong>
                  <span className="text-gray-500 block text-xs">Transparent costs</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <div>
                  <strong>Service Categories</strong>
                  <span className="text-gray-500 block text-xs">Pie chart visualization</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600">✓</span>
                <div>
                  <strong>Customer Sources</strong>
                  <span className="text-gray-500 block text-xs">Analytics insights</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Earnings Visualization Strategy */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Earnings Visualization Strategy</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Timeframe</th>
                <th className="text-left p-3">Chart Type</th>
                <th className="text-left p-3">Key Metrics</th>
                <th className="text-left p-3">Interactive Features</th>
                <th className="text-left p-3">Insights</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <span className="font-medium">Daily</span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Bar chart</span>
                </td>
                <td className="p-3">Hourly breakdown</td>
                <td className="p-3">Hover for details</td>
                <td className="p-3">Peak times</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <span className="font-medium">Weekly</span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Line graph</span>
                </td>
                <td className="p-3">7-day trend</td>
                <td className="p-3">Compare weeks</td>
                <td className="p-3">Patterns</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <span className="font-medium">Monthly</span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Area chart</span>
                </td>
                <td className="p-3">Running total</td>
                <td className="p-3">Goal tracking</td>
                <td className="p-3">Progress</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <span className="font-medium">Yearly</span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">Combined</span>
                </td>
                <td className="p-3">Seasons/growth</td>
                <td className="p-3">Zoom capability</td>
                <td className="p-3">Tax prep</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3">
                  <span className="font-medium">Custom</span>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Selected</span>
                </td>
                <td className="p-3">User-defined</td>
                <td className="p-3">Export option</td>
                <td className="p-3">Analysis</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Balance Status Indicators */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Balance Status Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-bold">Available Balance</h3>
            </div>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Instant withdrawal ready</li>
              <li>• Green color coding</li>
              <li>• Animated on increase</li>
              <li>• Click for details</li>
            </ul>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
              <h3 className="font-bold">Pending Balance</h3>
            </div>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• In clearance period</li>
              <li>• Yellow indicator</li>
              <li>• Countdown timer</li>
              <li>• Breakdown by date</li>
            </ul>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-4 h-4 bg-red-400 rounded-full"></div>
              <h3 className="font-bold">On Hold</h3>
            </div>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Dispute/review</li>
              <li>• Red indicator</li>
              <li>• Reason displayed</li>
              <li>• Resolution path</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">$3,456</div>
          <p className="text-gray-600 mt-1">Available Now</p>
          <div className="text-sm text-green-600 mt-2">Ready to withdraw</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">$892</div>
          <p className="text-gray-600 mt-1">Pending</p>
          <div className="text-sm text-yellow-600 mt-2">Clears in 2 days</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">$4,349</div>
          <p className="text-gray-600 mt-1">Month Total</p>
          <div className="text-sm text-green-600 mt-2">↑ 23% vs last month</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">$1,234</div>
          <p className="text-gray-600 mt-1">Best Day</p>
          <div className="text-sm text-orange-600 mt-2">Dec 10, 2024</div>
        </div>
      </div>

      {/* Main Component */}
      <div className="bg-white rounded-2xl border shadow-sm">
        <EarningsDashboardDesign />
      </div>

      {/* Implementation Notes */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Hero Section</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Large available balance display ($3,456.78)</li>
              <li>• Pending clearance indicator ($892.34)</li>
              <li>• Monthly total progress ($4,349.12)</li>
              <li>• Prominent withdraw CTA button</li>
              <li>• Animated balance increases</li>
              <li>• Balance breakdown visualization</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Secondary Metrics</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Today's earnings with trend</li>
              <li>• Weekly average comparison</li>
              <li>• Best day achievement tracking</li>
              <li>• Next payout countdown</li>
              <li>• Color-coded indicators</li>
              <li>• Real-time updates</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Visualizations</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Daily bar chart (hourly breakdown)</li>
              <li>• Weekly line graph (trend analysis)</li>
              <li>• Monthly area chart (cumulative)</li>
              <li>• Yearly combined view (tax prep)</li>
              <li>• Service category pie chart</li>
              <li>• Interactive tooltips and zoom</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Transaction Details</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Recent transactions list</li>
              <li>• Fee breakdown transparency</li>
              <li>• Status indicators (completed/pending/hold)</li>
              <li>• Customer source tracking</li>
              <li>• Export functionality</li>
              <li>• Detailed filtering options</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}