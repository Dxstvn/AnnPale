"use client"

import { CustomerSupportIntegration } from "@/components/creator/support/customer-support-integration"

export default function Phase346Demo() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 3.4.6: Customer Support Integration
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Comprehensive support ticket management system with SLA tracking, knowledge base integration, 
          and multi-channel communication capabilities for efficient customer service.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Ticket Management
          </span>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            5 Priority Levels
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            SLA Tracking
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Knowledge Base
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Auto-Response
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Analytics
          </span>
        </div>
      </div>

      {/* Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
          <h3 className="font-semibold text-purple-900 mb-2">🎫 Smart Ticketing</h3>
          <p className="text-purple-700 text-sm">
            Automated categorization, priority assignment, and intelligent routing to the right support team.
          </p>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl">
          <h3 className="font-semibold text-red-900 mb-2">⏱️ SLA Management</h3>
          <p className="text-red-700 text-sm">
            Automated SLA tracking with escalation triggers: Urgent (1hr), High (2-4hrs), Medium (24hrs).
          </p>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
          <h3 className="font-semibold text-blue-900 mb-2">📚 Knowledge Base</h3>
          <p className="text-blue-700 text-sm">
            Self-service portal with FAQs, video guides, and searchable articles to reduce ticket volume.
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
          <h3 className="font-semibold text-green-900 mb-2">💬 Smart Responses</h3>
          <p className="text-green-700 text-sm">
            Canned responses, screen sharing, file attachments, and internal notes for efficient resolution.
          </p>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
          <h3 className="font-semibold text-orange-900 mb-2">📊 Performance Analytics</h3>
          <p className="text-orange-700 text-sm">
            Track response times, resolution rates, satisfaction scores, and first contact resolution metrics.
          </p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl">
          <h3 className="font-semibold text-yellow-900 mb-2">🔄 Workflow Automation</h3>
          <p className="text-yellow-700 text-sm">
            Automated ticket lifecycle: Triage → Assignment → Resolution → Follow-up with satisfaction survey.
          </p>
        </div>
      </div>

      {/* Support Categories Table */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Support Request Categories & SLAs</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Category</th>
                <th className="text-left p-3">Priority</th>
                <th className="text-left p-3">SLA</th>
                <th className="text-left p-3">Escalation</th>
                <th className="text-left p-3">Resolution Path</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Technical Issue
                  </div>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">High</span>
                </td>
                <td className="p-3 font-medium">2 hours</td>
                <td className="p-3">Immediate</td>
                <td className="p-3">Tech support team</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    Booking Problem
                  </div>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">High</span>
                </td>
                <td className="p-3 font-medium">4 hours</td>
                <td className="p-3">If unresolved</td>
                <td className="p-3">Refund/redo</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    General Question
                  </div>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Medium</span>
                </td>
                <td className="p-3 font-medium">24 hours</td>
                <td className="p-3">After 48 hours</td>
                <td className="p-3">FAQ/guide</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Feedback
                  </div>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Low</span>
                </td>
                <td className="p-3 font-medium">48 hours</td>
                <td className="p-3">Not needed</td>
                <td className="p-3">Acknowledge</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Complaint
                  </div>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Urgent</span>
                </td>
                <td className="p-3 font-medium">1 hour</td>
                <td className="p-3">Manager</td>
                <td className="p-3">Resolution offer</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Workflow Diagram */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Support Workflow</h2>
        <div className="flex flex-wrap justify-center items-center gap-4 text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl mb-2">🎫</div>
            <div className="font-semibold">New Ticket</div>
            <div className="text-xs opacity-90 mt-1">Categorize</div>
            <div className="text-xs opacity-75">Auto-reply</div>
          </div>
          <div className="text-2xl">→</div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl mb-2">🔍</div>
            <div className="font-semibold">Triage</div>
            <div className="text-xs opacity-90 mt-1">Priority</div>
            <div className="text-xs opacity-75">Queue</div>
          </div>
          <div className="text-2xl">→</div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl mb-2">👥</div>
            <div className="font-semibold">Assignment</div>
            <div className="text-xs opacity-90 mt-1">Creator/Support</div>
            <div className="text-xs opacity-75">Work on</div>
          </div>
          <div className="text-2xl">→</div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl mb-2">✅</div>
            <div className="font-semibold">Resolution</div>
            <div className="text-xs opacity-90 mt-1">Fix</div>
            <div className="text-xs opacity-75">Close</div>
          </div>
          <div className="text-2xl">→</div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-semibold">Follow-up</div>
            <div className="text-xs opacity-90 mt-1">Satisfaction</div>
            <div className="text-xs opacity-75">Survey</div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">156</div>
          <p className="text-gray-600 mt-1">Total Tickets</p>
          <div className="text-sm text-green-600 mt-2">+12% this month</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">3.2h</div>
          <p className="text-gray-600 mt-1">Avg Response Time</p>
          <div className="text-sm text-green-600 mt-2">-18% improvement</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">82%</div>
          <p className="text-gray-600 mt-1">First Contact Resolution</p>
          <div className="text-sm text-green-600 mt-2">Industry leading</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-yellow-500">4.6/5</div>
          <p className="text-gray-600 mt-1">Satisfaction Score</p>
          <div className="text-sm text-green-600 mt-2">Above target</div>
        </div>
      </div>

      {/* Main Component */}
      <div className="bg-white rounded-2xl border shadow-sm">
        <CustomerSupportIntegration />
      </div>

      {/* Implementation Notes */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Ticket Management</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 5 ticket categories with priority levels</li>
              <li>• 6 status states for ticket lifecycle</li>
              <li>• SLA tracking with automatic escalation</li>
              <li>• Real-time message threading</li>
              <li>• Internal notes and collaboration</li>
              <li>• File attachments and screen sharing</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Knowledge Base</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Searchable help articles</li>
              <li>• Video tutorial integration</li>
              <li>• FAQ suggestions</li>
              <li>• Helpful/not helpful tracking</li>
              <li>• Tag-based categorization</li>
              <li>• Common solutions library</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Resolution Tools</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Canned response templates</li>
              <li>• Screen sharing capability</li>
              <li>• File attachment support</li>
              <li>• Internal team notes</li>
              <li>• Escalation workflows</li>
              <li>• Customer satisfaction surveys</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Analytics & Reporting</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Real-time support metrics</li>
              <li>• SLA performance tracking</li>
              <li>• Category distribution analysis</li>
              <li>• Ticket trend visualization</li>
              <li>• Response and resolution times</li>
              <li>• Customer satisfaction scores</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}