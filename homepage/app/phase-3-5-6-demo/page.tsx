"use client"

import { InvoiceGenerationSystem } from "@/components/creator/finance/invoice-generation-system"

export default function Phase356Demo() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 3.5.6: Invoice Generation System
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Professional invoice creation with automated generation, customizable templates, 
          and comprehensive distribution capabilities for business legitimacy.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Auto-Generation
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Custom Templates
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Multi-Language
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Bulk Creation
          </span>
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            Email Delivery
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            PDF Export
          </span>
        </div>
      </div>

      {/* Invoice Template Components */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Invoice Template Components</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Section</th>
                <th className="text-left p-3">Information</th>
                <th className="text-left p-3">Customizable</th>
                <th className="text-left p-3">Required</th>
                <th className="text-left p-3">Auto-Generated</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Header</td>
                <td className="p-3">Creator branding</td>
                <td className="p-3">
                  <span className="text-green-600">✓ Yes</span>
                </td>
                <td className="p-3">
                  <span className="text-gray-400">No</span>
                </td>
                <td className="p-3">Logo placement</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Creator Info</td>
                <td className="p-3">Name, address, tax ID</td>
                <td className="p-3">
                  <span className="text-green-600">✓ Yes</span>
                </td>
                <td className="p-3">
                  <span className="text-green-600">✓ Yes</span>
                </td>
                <td className="p-3">From profile</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Customer Info</td>
                <td className="p-3">Name, company, address</td>
                <td className="p-3">
                  <span className="text-gray-400">No</span>
                </td>
                <td className="p-3">
                  <span className="text-green-600">✓ Yes</span>
                </td>
                <td className="p-3">From booking</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Service Details</td>
                <td className="p-3">Description, date, duration</td>
                <td className="p-3">
                  <span className="text-yellow-600">Partial</span>
                </td>
                <td className="p-3">
                  <span className="text-green-600">✓ Yes</span>
                </td>
                <td className="p-3">From delivery</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Pricing</td>
                <td className="p-3">Amount, taxes, total</td>
                <td className="p-3">
                  <span className="text-gray-400">No</span>
                </td>
                <td className="p-3">
                  <span className="text-green-600">✓ Yes</span>
                </td>
                <td className="p-3">Calculated</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Payment</td>
                <td className="p-3">Method, status, date</td>
                <td className="p-3">
                  <span className="text-gray-400">No</span>
                </td>
                <td className="p-3">
                  <span className="text-green-600">✓ Yes</span>
                </td>
                <td className="p-3">From transaction</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-medium">Footer</td>
                <td className="p-3">Terms, thank you</td>
                <td className="p-3">
                  <span className="text-green-600">✓ Yes</span>
                </td>
                <td className="p-3">
                  <span className="text-gray-400">No</span>
                </td>
                <td className="p-3">Template</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice Workflow */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Invoice Management Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-bold mb-1">Generate</h3>
              <p className="text-sm opacity-90">Automatic</p>
              <p className="text-xs opacity-75 mt-1">Triggered</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-2">🎨</div>
              <h3 className="font-bold mb-1">Customize</h3>
              <p className="text-sm opacity-90">Branding</p>
              <p className="text-xs opacity-75 mt-1">Edit</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-2">👁️</div>
              <h3 className="font-bold mb-1">Review</h3>
              <p className="text-sm opacity-90">Preview</p>
              <p className="text-xs opacity-75 mt-1">Approve</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-2">📧</div>
              <h3 className="font-bold mb-1">Send</h3>
              <p className="text-sm opacity-90">Email</p>
              <p className="text-xs opacity-75 mt-1">Download</p>
            </div>
          </div>
          <div className="text-center">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="font-bold mb-1">Track</h3>
              <p className="text-sm opacity-90">Status</p>
              <p className="text-xs opacity-75 mt-1">Payment</p>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Capabilities */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-600">⚙️</span>
            Generation Options
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Automatic creation on payment</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Manual generation anytime</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Bulk creation for multiple</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Recurring invoice setup</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Credit note generation</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-blue-600">🎨</span>
            Customization
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Logo upload & placement</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Custom color scheme</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Add custom fields</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Multiple language support</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Terms & conditions selection</span>
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
              <span>Email delivery to customers</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>PDF download option</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Shareable link generation</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Print-ready formatting</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>API access for integration</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Invoice Templates */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Available Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded mb-3 flex items-center justify-center">
              <span className="text-4xl">📄</span>
            </div>
            <h3 className="font-bold">Professional</h3>
            <p className="text-sm text-gray-600">Clean and modern</p>
            <div className="mt-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Popular</span>
            </div>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded mb-3 flex items-center justify-center">
              <span className="text-4xl">📝</span>
            </div>
            <h3 className="font-bold">Minimal</h3>
            <p className="text-sm text-gray-600">Simple and elegant</p>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded mb-3 flex items-center justify-center">
              <span className="text-4xl">🎨</span>
            </div>
            <h3 className="font-bold">Creative</h3>
            <p className="text-sm text-gray-600">Bold and colorful</p>
          </div>
          <div className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
            <div className="h-32 bg-gradient-to-br from-green-100 to-green-200 rounded mb-3 flex items-center justify-center">
              <span className="text-4xl">🏢</span>
            </div>
            <h3 className="font-bold">Corporate</h3>
            <p className="text-sm text-gray-600">Traditional business</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">247</div>
          <p className="text-gray-600 mt-1">Total Invoices</p>
          <div className="text-sm text-purple-600 mt-2">All time</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">92%</div>
          <p className="text-gray-600 mt-1">Paid on Time</p>
          <div className="text-sm text-blue-600 mt-2">Last 30 days</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">4</div>
          <p className="text-gray-600 mt-1">Languages</p>
          <div className="text-sm text-green-600 mt-2">EN, FR, HT, ES</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">1.5s</div>
          <p className="text-gray-600 mt-1">Avg Generation</p>
          <div className="text-sm text-orange-600 mt-2">Quick creation</div>
        </div>
      </div>

      {/* Main Component */}
      <div className="bg-white rounded-2xl border shadow-sm">
        <InvoiceGenerationSystem />
      </div>

      {/* Implementation Notes */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Invoice Management</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Invoice list with status tracking</li>
              <li>• Quick actions (send, download, preview)</li>
              <li>• Bulk operations for multiple invoices</li>
              <li>• Search and filter capabilities</li>
              <li>• Status indicators (paid, sent, overdue)</li>
              <li>• Invoice details panel</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Template System</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 4 professional templates</li>
              <li>• Logo upload and placement</li>
              <li>• Custom color schemes</li>
              <li>• Language selection (EN, FR, HT, ES)</li>
              <li>• Terms & conditions toggle</li>
              <li>• Thank you message option</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Invoice Preview</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Full-page preview modal</li>
              <li>• Professional layout rendering</li>
              <li>• Line items with calculations</li>
              <li>• Tax and total breakdowns</li>
              <li>• Customer and creator info</li>
              <li>• Print and download options</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Automation Features</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Automatic invoice generation</li>
              <li>• Recurring invoice setup</li>
              <li>• Bulk creation for multiple orders</li>
              <li>• Credit note generation</li>
              <li>• Email delivery automation</li>
              <li>• Payment status tracking</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}