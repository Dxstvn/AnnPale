"use client"

import { TaxDocumentationCenter } from "@/components/creator/finance/tax-documentation-center"

export default function Phase357Demo() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 3.5.7: Tax Documentation Center
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Simplify tax compliance with organized documentation, estimation tools, 
          and clear reporting that reduces creator stress during tax season.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            1099 Forms
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Tax Calculator
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Deduction Tracking
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Quarterly Estimates
          </span>
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            Export Tools
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Tax Resources
          </span>
        </div>
      </div>

      {/* Tax Document Types */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Tax Document Types</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Document</th>
                <th className="text-left p-3">Purpose</th>
                <th className="text-left p-3">Generation</th>
                <th className="text-left p-3">Deadline</th>
                <th className="text-left p-3">Delivery</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">1099-NEC</td>
                <td className="p-3">Income reporting</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Automatic</span>
                </td>
                <td className="p-3">Jan 31</td>
                <td className="p-3">Email + Mail</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Monthly Statements</td>
                <td className="p-3">Record keeping</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Automatic</span>
                </td>
                <td className="p-3">Month-end</td>
                <td className="p-3">Download</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Annual Summary</td>
                <td className="p-3">Tax prep</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">On-demand</span>
                </td>
                <td className="p-3">Dec 31</td>
                <td className="p-3">Dashboard</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Expense Reports</td>
                <td className="p-3">Deductions</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Manual entry</span>
                </td>
                <td className="p-3">Ongoing</td>
                <td className="p-3">Export</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-medium">W-9 Form</td>
                <td className="p-3">Tax info</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Once</span>
                </td>
                <td className="p-3">Onboarding</td>
                <td className="p-3">Upload</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Tax Information Hub Structure */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Tax Information Hub</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Current Year */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold mb-3">📊 Current Year</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• YTD Earnings: $45,678</li>
              <li>• Estimated Tax: $11,420</li>
              <li>• Quarterly Payments</li>
              <li>• Deduction Tracker</li>
            </ul>
          </div>

          {/* Documents */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold mb-3">📄 Documents</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• 1099 Forms (by year)</li>
              <li>• Monthly Statements</li>
              <li>• Annual Summaries</li>
              <li>• Expense Records</li>
            </ul>
          </div>

          {/* Tools */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold mb-3">🛠️ Tools</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Tax Calculator</li>
              <li>• Quarterly Estimator</li>
              <li>• Deduction Guide</li>
              <li>• Export to TurboTax</li>
            </ul>
          </div>

          {/* Resources */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold mb-3">📚 Resources</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Tax Tips for Creators</li>
              <li>• Deduction Checklist</li>
              <li>• State Tax Guide</li>
              <li>• CPA Directory</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tax Planning Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-600">🧮</span>
            Estimation Tools
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Quarterly tax calculator</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Year-end projections</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Withholding suggestions</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>State tax estimates</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Deduction impact analysis</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-blue-600">📝</span>
            Record Keeping
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Automatic categorization</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Receipt uploads</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Mileage tracking</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Home office calculator</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Equipment depreciation</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-600">🔄</span>
            Integration Support
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>QuickBooks export</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>TurboTax import</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Excel download</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>API access</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Accountant portal</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Deduction Categories */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Common Creator Deductions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">💻</span>
            </div>
            <p className="font-medium">Equipment</p>
            <p className="text-sm text-gray-600">$2,500</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">🏠</span>
            </div>
            <p className="font-medium">Home Office</p>
            <p className="text-sm text-gray-600">$1,800</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">🚗</span>
            </div>
            <p className="font-medium">Mileage</p>
            <p className="text-sm text-gray-600">$1,200</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">📦</span>
            </div>
            <p className="font-medium">Software</p>
            <p className="text-sm text-gray-600">$750</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">📚</span>
            </div>
            <p className="font-medium">Education</p>
            <p className="text-sm text-gray-600">$500</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">📈</span>
            </div>
            <p className="font-medium">Marketing</p>
            <p className="text-sm text-gray-600">$2,000</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">$45,678</div>
          <p className="text-gray-600 mt-1">YTD Earnings</p>
          <div className="text-sm text-purple-600 mt-2">Gross income</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">$8,750</div>
          <p className="text-gray-600 mt-1">Deductions</p>
          <div className="text-sm text-blue-600 mt-2">Tax savings</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">$11,420</div>
          <p className="text-gray-600 mt-1">Estimated Tax</p>
          <div className="text-sm text-green-600 mt-2">Federal + SE</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">$2,855</div>
          <p className="text-gray-600 mt-1">Quarterly</p>
          <div className="text-sm text-orange-600 mt-2">Next payment</div>
        </div>
      </div>

      {/* Main Component */}
      <div className="bg-white rounded-2xl border shadow-sm">
        <TaxDocumentationCenter />
      </div>

      {/* Implementation Notes */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Tax Overview</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• YTD earnings and deductions summary</li>
              <li>• Tax liability calculation</li>
              <li>• Quarterly payment tracking</li>
              <li>• Effective tax rate display</li>
              <li>• Deduction category breakdown</li>
              <li>• Payment status indicators</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Document Management</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 1099-NEC form generation</li>
              <li>• Monthly statement downloads</li>
              <li>• Annual summary reports</li>
              <li>• W-9 form upload</li>
              <li>• Document status tracking</li>
              <li>• Email and download options</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Tax Calculator</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Federal tax estimation</li>
              <li>• Self-employment tax calculation</li>
              <li>• State tax support</li>
              <li>• Tax rate slider (10-37%)</li>
              <li>• Quarterly payment estimates</li>
              <li>• Effective rate display</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Expense Tracking</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Add and categorize expenses</li>
              <li>• Deductible expense tracking</li>
              <li>• Category totals and limits</li>
              <li>• Receipt upload capability</li>
              <li>• Export to accounting software</li>
              <li>• Tax tip resources</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}