"use client"

import { TransactionManagement } from "@/components/creator/finance/transaction-management"

export default function Phase353Demo() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 3.5.3: Transaction Management
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Complete transparency into all financial transactions with powerful search, 
          filtering, and bulk operation capabilities for efficient financial management.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Transaction History
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Status Flow
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Advanced Filtering
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Search
          </span>
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            Bulk Operations
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Fee Transparency
          </span>
        </div>
      </div>

      {/* Transaction Information Architecture */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Transaction Information Architecture</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Data Point</th>
                <th className="text-left p-3">Display Priority</th>
                <th className="text-left p-3">User Need</th>
                <th className="text-left p-3">Format</th>
                <th className="text-left p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Amount</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Primary</span>
                </td>
                <td className="p-3">"How much?"</td>
                <td className="p-3">Currency + bold</td>
                <td className="p-3">Click for details</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Customer</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Secondary</span>
                </td>
                <td className="p-3">"From whom?"</td>
                <td className="p-3">Name + avatar</td>
                <td className="p-3">View profile</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Date/Time</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Secondary</span>
                </td>
                <td className="p-3">"When?"</td>
                <td className="p-3">Relative + exact</td>
                <td className="p-3">Filter by date</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Type</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Tertiary</span>
                </td>
                <td className="p-3">"What kind?"</td>
                <td className="p-3">Icon + label</td>
                <td className="p-3">Filter by type</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Status</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Visual</span>
                </td>
                <td className="p-3">"Is it cleared?"</td>
                <td className="p-3">Color + badge</td>
                <td className="p-3">Track progress</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-medium">Fees</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">On expand</span>
                </td>
                <td className="p-3">"What was taken?"</td>
                <td className="p-3">Breakdown</td>
                <td className="p-3">View calculation</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Transaction Status Flow */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Transaction Lifecycle</h2>
        <div className="flex flex-wrap justify-center items-center gap-4 text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl mb-2">✅</div>
            <div className="font-semibold">Completed</div>
            <div className="text-xs opacity-90 mt-1">Instant</div>
            <div className="text-xs opacity-75">Record</div>
          </div>
          <div className="text-2xl">→</div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl mb-2">⏳</div>
            <div className="font-semibold">Processing</div>
            <div className="text-xs opacity-90 mt-1">1-2 hours</div>
            <div className="text-xs opacity-75">Validate</div>
          </div>
          <div className="text-2xl">→</div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl mb-2">🔄</div>
            <div className="font-semibold">Clearing</div>
            <div className="text-xs opacity-90 mt-1">2-3 days</div>
            <div className="text-xs opacity-75">Security</div>
          </div>
          <div className="text-2xl">→</div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl mb-2">💰</div>
            <div className="font-semibold">Available</div>
            <div className="text-xs opacity-90 mt-1">Ready</div>
            <div className="text-xs opacity-75">Balance</div>
          </div>
          <div className="text-2xl">→</div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl mb-2">🏦</div>
            <div className="font-semibold">Withdrawn</div>
            <div className="text-xs opacity-90 mt-1">To bank</div>
            <div className="text-xs opacity-75">Transfer</div>
          </div>
        </div>
      </div>

      {/* Filtering & Search Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4">🔍 Search Capabilities</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Customer name search</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Transaction ID lookup</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Amount exact/range search</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Date specific filtering</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Notes/memo search</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Category filtering</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4">⚙️ Filter Options</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Date range selector</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Amount range filter</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Transaction type filter</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Customer name filter</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Status filter (5 states)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Payment method filter</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bulk Operations */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Bulk Operations</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
              📥
            </div>
            <div>
              <h4 className="font-semibold">Export Selected</h4>
              <p className="text-sm text-gray-600">Download transactions in CSV, Excel, or PDF format</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              🖨️
            </div>
            <div>
              <h4 className="font-semibold">Print Statements</h4>
              <p className="text-sm text-gray-600">Generate formatted statements for records</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
              🏷️
            </div>
            <div>
              <h4 className="font-semibold">Categorize Multiple</h4>
              <p className="text-sm text-gray-600">Apply categories to multiple transactions at once</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              📝
            </div>
            <div>
              <h4 className="font-semibold">Add Notes Bulk</h4>
              <p className="text-sm text-gray-600">Add notes to multiple transactions simultaneously</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center flex-shrink-0">
              📊
            </div>
            <div>
              <h4 className="font-semibold">Generate Reports</h4>
              <p className="text-sm text-gray-600">Create custom reports from selected data</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
              🔖
            </div>
            <div>
              <h4 className="font-semibold">Tax Preparation</h4>
              <p className="text-sm text-gray-600">Export tax-ready documentation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">625</div>
          <p className="text-gray-600 mt-1">Total Transactions</p>
          <div className="text-sm text-green-600 mt-2">All time</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">$47,525</div>
          <p className="text-gray-600 mt-1">Total Processed</p>
          <div className="text-sm text-blue-600 mt-2">Lifetime earnings</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">$41,780</div>
          <p className="text-gray-600 mt-1">Net Earnings</p>
          <div className="text-sm text-green-600 mt-2">After fees</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">12%</div>
          <p className="text-gray-600 mt-1">Average Fee</p>
          <div className="text-sm text-orange-600 mt-2">Platform + payment</div>
        </div>
      </div>

      {/* Main Component */}
      <div className="bg-white rounded-2xl border shadow-sm">
        <TransactionManagement />
      </div>

      {/* Implementation Notes */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Transaction Display</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Primary: Amount (large, bold)</li>
              <li>• Secondary: Customer (name + avatar)</li>
              <li>• Secondary: Date/Time (relative + exact)</li>
              <li>• Tertiary: Type (icon + label)</li>
              <li>• Visual: Status (color + badge)</li>
              <li>• Expandable: Fee breakdown</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Status Flow</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Completed → Processing (1-2 hours)</li>
              <li>• Processing → Clearing (2-3 days)</li>
              <li>• Clearing → Available (ready)</li>
              <li>• Available → Withdrawn (to bank)</li>
              <li>• Visual indicators for each stage</li>
              <li>• Time estimates displayed</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Search & Filter</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Real-time search across all fields</li>
              <li>• Date range picker</li>
              <li>• Amount range filter</li>
              <li>• Status multi-select</li>
              <li>• Category filtering</li>
              <li>• Payment method filter</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Bulk Operations</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Select all/individual transactions</li>
              <li>• Export to CSV/Excel/PDF</li>
              <li>• Print formatted statements</li>
              <li>• Bulk categorization</li>
              <li>• Add notes to multiple</li>
              <li>• Generate custom reports</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}