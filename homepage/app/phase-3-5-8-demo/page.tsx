import { FinancialGoalsPlanning } from "@/components/creator/finance/financial-goals-planning"

export default function Phase358Demo() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 3.5.8: Financial Goals & Planning
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Help creators set and achieve financial goals through visual tracking, 
          intelligent recommendations, and comprehensive planning tools.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Goal Tracking
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Progress Visualization
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Financial Projections
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            What-If Analysis
          </span>
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            ROI Tracking
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Smart Recommendations
          </span>
        </div>
      </div>

      {/* Goal Types Overview */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Goal Types & Success Rates</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Goal Type</th>
                <th className="text-left p-3">Timeframe</th>
                <th className="text-left p-3">Tracking Method</th>
                <th className="text-left p-3">Motivation</th>
                <th className="text-left p-3">Achievement Rate</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Daily Earnings</td>
                <td className="p-3">24 hours</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Progress bar</span>
                </td>
                <td className="p-3">Immediate</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: "73%"}}></div>
                    </div>
                    <span className="font-medium text-green-600">73%</span>
                  </div>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Weekly Target</td>
                <td className="p-3">7 days</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Line graph</span>
                </td>
                <td className="p-3">Short-term</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: "68%"}}></div>
                    </div>
                    <span className="font-medium text-green-600">68%</span>
                  </div>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Monthly Goal</td>
                <td className="p-3">30 days</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Milestones</span>
                </td>
                <td className="p-3">Medium-term</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{width: "61%"}}></div>
                    </div>
                    <span className="font-medium text-yellow-600">61%</span>
                  </div>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Annual Income</td>
                <td className="p-3">365 days</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">Trend projection</span>
                </td>
                <td className="p-3">Long-term</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-500 h-2 rounded-full" style={{width: "54%"}}></div>
                    </div>
                    <span className="font-medium text-yellow-600">54%</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-medium">Savings Goal</td>
                <td className="p-3">Custom</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs">Accumulation</span>
                </td>
                <td className="p-3">Security</td>
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: "47%"}}></div>
                    </div>
                    <span className="font-medium text-orange-600">47%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Goal Visualization Example */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Goal Progress Visualization</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Active Goal Progress */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold mb-4">📊 Monthly Goal: $5,000</h3>
            <div className="space-y-3">
              <div className="w-full bg-white/30 rounded-full h-4 relative">
                <div className="bg-white h-4 rounded-full" style={{width: "76%"}}></div>
                <span className="absolute right-2 top-0 text-sm font-bold">76%</span>
              </div>
              <div className="text-sm space-y-1">
                <p>📈 $3,800 / $5,000 Complete</p>
                <p>📅 Days Remaining: 8</p>
                <p>💰 Daily Average Needed: $150</p>
                <p>📊 Current Daily Average: $175</p>
                <p className="font-bold text-green-300">✅ Projected: On track! 🎯</p>
              </div>
            </div>
          </div>

          {/* Achievement Celebration */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold mb-4">✨ Goal Reached Celebration!</h3>
            <div className="text-center space-y-3">
              <div className="text-4xl">🎉</div>
              <p className="text-xl font-bold">You hit $5,000!</p>
              <div className="text-sm space-y-1">
                <p>⏱️ Time Taken: 23 days</p>
                <p>🏆 Beat Goal By: 7 days</p>
                <p>💎 Bonus Earned: $50</p>
              </div>
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium mt-3">
                Set Next Goal →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Planning Tools */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-600">📈</span>
            Projection Models
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Growth scenarios (3)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Seasonal adjustments</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>What-if analysis tool</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Break-even calculator</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>ROI tracking dashboard</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-blue-600">💡</span>
            Smart Recommendations
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Pricing optimization</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Service expansion ideas</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Cost reduction tips</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Investment options</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Emergency fund guide</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-600">🎯</span>
            Goal Features
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Milestone tracking</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Progress notifications</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Achievement celebrations</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Historical performance</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Goal categories</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Projection Scenarios */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Financial Projection Scenarios</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-red-50 rounded-xl border border-red-200">
            <h3 className="text-xl font-bold text-red-900 mb-2">Conservative</h3>
            <p className="text-3xl font-bold text-red-700 mb-1">$126,000</p>
            <p className="text-sm text-red-600 mb-3">Annual projection</p>
            <ul className="space-y-1 text-sm text-red-700">
              <li>• 10% below baseline</li>
              <li>• Accounts for market dips</li>
              <li>• Safety margin included</li>
              <li>• Risk mitigation focus</li>
            </ul>
          </div>
          <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
            <h3 className="text-xl font-bold text-purple-900 mb-2">Baseline</h3>
            <p className="text-3xl font-bold text-purple-700 mb-1">$180,000</p>
            <p className="text-sm text-purple-600 mb-3">Annual projection</p>
            <ul className="space-y-1 text-sm text-purple-700">
              <li>• Current growth rate</li>
              <li>• Historical average</li>
              <li>• Most likely outcome</li>
              <li>• Steady performance</li>
            </ul>
          </div>
          <div className="p-6 bg-green-50 rounded-xl border border-green-200">
            <h3 className="text-xl font-bold text-green-900 mb-2">Optimistic</h3>
            <p className="text-3xl font-bold text-green-700 mb-1">$234,000</p>
            <p className="text-sm text-green-600 mb-3">Annual projection</p>
            <ul className="space-y-1 text-sm text-green-700">
              <li>• 30% above baseline</li>
              <li>• Best case scenario</li>
              <li>• Requires optimization</li>
              <li>• Growth acceleration</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">5</div>
          <p className="text-gray-600 mt-1">Active Goals</p>
          <div className="text-sm text-purple-600 mt-2">All tracked</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">73%</div>
          <p className="text-gray-600 mt-1">Success Rate</p>
          <div className="text-sm text-blue-600 mt-2">Above average</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">$180K</div>
          <p className="text-gray-600 mt-1">Projected</p>
          <div className="text-sm text-green-600 mt-2">Annual income</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">+285%</div>
          <p className="text-gray-600 mt-1">Best ROI</p>
          <div className="text-sm text-orange-600 mt-2">Equipment invest</div>
        </div>
      </div>

      {/* Main Component */}
      <div className="bg-white rounded-2xl border shadow-sm">
        <FinancialGoalsPlanning />
      </div>

      {/* Implementation Notes */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Goal Management</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 5 goal types (daily, weekly, monthly, annual, custom)</li>
              <li>• Visual progress tracking with progress bars</li>
              <li>• Milestone achievements (25%, 50%, 75%, 100%)</li>
              <li>• Status indicators (on-track, at-risk, behind)</li>
              <li>• Daily/weekly/monthly targets calculation</li>
              <li>• Goal categories and priority levels</li>
              <li>• Notification settings per goal</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Financial Projections</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Three scenario models (conservative, baseline, optimistic)</li>
              <li>• Interactive area charts with actual vs projected</li>
              <li>• Customizable timeframes (3, 6, 12, 24 months)</li>
              <li>• Seasonal pattern analysis</li>
              <li>• Growth opportunity identification</li>
              <li>• Quarter-by-quarter performance</li>
              <li>• Historical data comparison</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Planning Tools</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• What-if analysis calculator</li>
              <li>• Break-even point calculator</li>
              <li>• ROI tracking for investments</li>
              <li>• Variable cost adjustments</li>
              <li>• Price optimization sliders</li>
              <li>• Target profit calculations</li>
              <li>• Scenario comparison views</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Smart Insights</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Intelligent recommendations engine</li>
              <li>• Priority-based action items</li>
              <li>• Impact assessment for each recommendation</li>
              <li>• Seasonal opportunity alerts</li>
              <li>• Cost reduction strategies</li>
              <li>• Service expansion suggestions</li>
              <li>• Emergency fund guidance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}