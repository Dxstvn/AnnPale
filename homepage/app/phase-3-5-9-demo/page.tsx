import { FinancialReporting } from "@/components/creator/finance/financial-reporting"

export default function Phase359Demo() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 3.5.9: Financial Reporting
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive financial reports for business planning, tax preparation, 
          and performance analysis with automated generation and distribution.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            P&L Statements
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Cash Flow Reports
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Customer Analysis
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Service Performance
          </span>
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            Tax Summaries
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Auto-Generation
          </span>
        </div>
      </div>

      {/* Report Types Overview */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Available Report Types</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Report</th>
                <th className="text-left p-3">Purpose</th>
                <th className="text-left p-3">Frequency</th>
                <th className="text-left p-3">Format</th>
                <th className="text-left p-3">Customization</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Profit & Loss</td>
                <td className="p-3">Business overview</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Monthly</span>
                </td>
                <td className="p-3">PDF/Excel</td>
                <td className="p-3">Date range</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Cash Flow</td>
                <td className="p-3">Money movement</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Weekly</span>
                </td>
                <td className="p-3">Excel/CSV</td>
                <td className="p-3">Categories</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Customer Analysis</td>
                <td className="p-3">Revenue sources</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Quarterly</span>
                </td>
                <td className="p-3">PDF/PPT</td>
                <td className="p-3">Segments</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Service Performance</td>
                <td className="p-3">Product analysis</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">Monthly</span>
                </td>
                <td className="p-3">Dashboard</td>
                <td className="p-3">Filters</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-medium">Tax Summary</td>
                <td className="p-3">Tax preparation</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Annual</span>
                </td>
                <td className="p-3">PDF/Excel</td>
                <td className="p-3">Deductions</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Report Structure */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Financial Report Structure</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Executive Summary */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold mb-3">📊 Executive Summary</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Key metrics overview</li>
              <li>• Period comparison</li>
              <li>• Highlights & alerts</li>
              <li>• Trend indicators</li>
              <li>• Quick insights</li>
            </ul>
          </div>

          {/* Detailed Analysis */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold mb-3">📈 Detailed Analysis</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Revenue breakdown</li>
              <li>• Expense categories</li>
              <li>• Customer segments</li>
              <li>• Service performance</li>
              <li>• Growth metrics</li>
            </ul>
          </div>

          {/* Visualizations */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold mb-3">📉 Visualizations</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Charts & graphs</li>
              <li>• Trend lines</li>
              <li>• Comparisons</li>
              <li>• Projections</li>
              <li>• Heat maps</li>
            </ul>
          </div>

          {/* Appendix */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold mb-3">📋 Appendix</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Transaction details</li>
              <li>• Methodology notes</li>
              <li>• Definitions</li>
              <li>• Raw data export</li>
              <li>• References</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Report Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-600">⚡</span>
            Generation Options
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Instant generation</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Scheduled reports</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Custom date ranges</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Batch processing</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Auto-generation rules</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-blue-600">📊</span>
            Analytics & Insights
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Trend analysis</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>YoY comparisons</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Predictive insights</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Anomaly detection</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Performance metrics</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-600">📤</span>
            Distribution
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Email delivery</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Dashboard access</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Cloud storage sync</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>API integration</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Share links</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Report Metrics */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Sample Report Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">$45,678</div>
            <p className="text-gray-600 mt-1">Monthly Revenue</p>
            <div className="text-sm text-green-600 mt-2">↑ 8.4%</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">$12,543</div>
            <p className="text-gray-600 mt-1">Total Expenses</p>
            <div className="text-sm text-red-600 mt-2">↑ 12.0%</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">$33,135</div>
            <p className="text-gray-600 mt-1">Net Profit</p>
            <div className="text-sm text-purple-600 mt-2">↑ 7.1%</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">72.5%</div>
            <p className="text-gray-600 mt-1">Profit Margin</p>
            <div className="text-sm text-yellow-600 mt-2">↓ 1.2%</div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-bold text-purple-900 mb-3">Top Revenue Sources</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Birthday Messages</span>
                <span className="font-medium">40.5%</span>
              </li>
              <li className="flex justify-between">
                <span>Business Shoutouts</span>
                <span className="font-medium">26.9%</span>
              </li>
              <li className="flex justify-between">
                <span>Wedding Messages</span>
                <span className="font-medium">19.5%</span>
              </li>
            </ul>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold text-blue-900 mb-3">Customer Segments</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Individual</span>
                <span className="font-medium">234 orders</span>
              </li>
              <li className="flex justify-between">
                <span>Business</span>
                <span className="font-medium">45 orders</span>
              </li>
              <li className="flex justify-between">
                <span>Repeat</span>
                <span className="font-medium">89 orders</span>
              </li>
            </ul>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <h3 className="font-bold text-green-900 mb-3">Service Performance</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Standard</span>
                <span className="font-medium">⭐ 4.8</span>
              </li>
              <li className="flex justify-between">
                <span>Premium</span>
                <span className="font-medium">⭐ 4.9</span>
              </li>
              <li className="flex justify-between">
                <span>Rush</span>
                <span className="font-medium">⭐ 4.7</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">5</div>
          <p className="text-gray-600 mt-1">Report Types</p>
          <div className="text-sm text-purple-600 mt-2">Comprehensive</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">4</div>
          <p className="text-gray-600 mt-1">Export Formats</p>
          <div className="text-sm text-blue-600 mt-2">PDF, Excel, CSV, PPT</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">24/7</div>
          <p className="text-gray-600 mt-1">Generation</p>
          <div className="text-sm text-green-600 mt-2">On-demand</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">100%</div>
          <p className="text-gray-600 mt-1">Automated</p>
          <div className="text-sm text-orange-600 mt-2">Scheduled reports</div>
        </div>
      </div>

      {/* Main Component */}
      <div className="bg-white rounded-2xl border shadow-sm">
        <FinancialReporting />
      </div>

      {/* Implementation Notes */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Report Generation</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 5 comprehensive report types</li>
              <li>• Instant and scheduled generation</li>
              <li>• Custom date range selection</li>
              <li>• Multiple export formats (PDF, Excel, CSV, PPT)</li>
              <li>• Include/exclude charts and details options</li>
              <li>• Batch report generation</li>
              <li>• Progress tracking with loading states</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Data Visualization</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Revenue trend area charts</li>
              <li>• Expense category bar charts</li>
              <li>• Revenue breakdown pie charts</li>
              <li>• Cash flow composed charts</li>
              <li>• Customer segment analysis</li>
              <li>• Service performance metrics</li>
              <li>• Interactive tooltips and legends</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Report Features</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Executive summary with key metrics</li>
              <li>• Period-over-period comparisons</li>
              <li>• Growth indicators and trends</li>
              <li>• Transaction detail tables</li>
              <li>• Filterable and searchable data</li>
              <li>• Print-ready formatting</li>
              <li>• Report preview modal</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Automation & Distribution</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Scheduled report generation</li>
              <li>• Email delivery configuration</li>
              <li>• Dashboard integration</li>
              <li>• Auto-download options</li>
              <li>• Multiple recipient support</li>
              <li>• Archive management</li>
              <li>• Share link generation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}