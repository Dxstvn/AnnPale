"use client"

import { MobileCommunicationManagement } from "@/components/creator/mobile/mobile-communication-management"

export default function Phase3410Demo() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4 md:p-8">
        <div className="container mx-auto">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Phase 3.4.10: Mobile Communication Management
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              Enable creators to manage customer relationships effectively from mobile devices 
              with optimized interfaces, swipe gestures, and offline support.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                Swipe Actions
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                Voice Messages
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                Quick Replies
              </span>
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                Offline Mode
              </span>
              <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                Smart Notifications
              </span>
              <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                Mobile-First
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Features Comparison */}
      <div className="container mx-auto p-4 md:p-8">
        <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Mobile vs Desktop Features</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Feature</th>
                  <th className="text-left p-3">Desktop</th>
                  <th className="text-left p-3">Mobile</th>
                  <th className="text-left p-3">Mobile Optimization</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">Message View</td>
                  <td className="p-3">Full thread</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Condensed</span>
                  </td>
                  <td className="p-3">Swipe actions, pull to refresh</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">Quick Reply</td>
                  <td className="p-3">Keyboard</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Voice/Quick</span>
                  </td>
                  <td className="p-3">Predictive text, voice-to-text</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">Review Response</td>
                  <td className="p-3">Full editor</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Templates</span>
                  </td>
                  <td className="p-3">One-tap responses</td>
                </tr>
                <tr className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">Fan Notes</td>
                  <td className="p-3">Detailed form</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">Quick notes</span>
                  </td>
                  <td className="p-3">Voice-to-text, tags</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="p-3 font-medium">Campaign Send</td>
                  <td className="p-3">Full wizard</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs">Simple</span>
                  </td>
                  <td className="p-3">Pre-built templates</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions Guide */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl mb-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Mobile Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                👆 Touch Gestures
              </h3>
              <ul className="space-y-2 text-sm">
                <li>✓ Swipe right to archive</li>
                <li>✓ Swipe left to star</li>
                <li>✓ Long press for options</li>
                <li>✓ Pull down to refresh</li>
                <li>✓ Double tap to like</li>
              </ul>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                🔔 Smart Notifications
              </h3>
              <ul className="space-y-2 text-sm">
                <li>✓ Grouped by priority</li>
                <li>✓ Quick reply from notification</li>
                <li>✓ Quiet hours (10pm-8am)</li>
                <li>✓ Custom sounds per type</li>
                <li>✓ Vibration patterns</li>
              </ul>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2">
                📱 Mobile Tools
              </h3>
              <ul className="space-y-2 text-sm">
                <li>✓ Voice responses</li>
                <li>✓ Photo attachments</li>
                <li>✓ Location sharing</li>
                <li>✓ Quick templates</li>
                <li>✓ Offline drafts</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Offline Support Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-xl font-bold mb-4">📴 Offline Capabilities</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">✉️</span>
                </div>
                <div>
                  <p className="font-medium">Draft Messages</p>
                  <p className="text-sm text-gray-600">Auto-save drafts locally for later sending</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">📤</span>
                </div>
                <div>
                  <p className="font-medium">Queue Responses</p>
                  <p className="text-sm text-gray-600">Queue messages to send when reconnected</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">💾</span>
                </div>
                <div>
                  <p className="font-medium">Cache Conversations</p>
                  <p className="text-sm text-gray-600">Access recent conversations offline</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">🔄</span>
                </div>
                <div>
                  <p className="font-medium">Sync on Connect</p>
                  <p className="text-sm text-gray-600">Auto-sync when connection restored</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm">🔍</span>
                </div>
                <div>
                  <p className="font-medium">Local Search</p>
                  <p className="text-sm text-gray-600">Search cached messages offline</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border p-6">
            <h3 className="text-xl font-bold mb-4">⚡ Quick Reply Templates</h3>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                <button className="px-3 py-2 bg-purple-100 text-purple-700 rounded-full text-sm hover:bg-purple-200 transition-colors">
                  👍 Thank you!
                </button>
                <button className="px-3 py-2 bg-blue-100 text-blue-700 rounded-full text-sm hover:bg-blue-200 transition-colors">
                  ⏰ Working on it
                </button>
                <button className="px-3 py-2 bg-green-100 text-green-700 rounded-full text-sm hover:bg-green-200 transition-colors">
                  💬 Will respond soon
                </button>
                <button className="px-3 py-2 bg-orange-100 text-orange-700 rounded-full text-sm hover:bg-orange-200 transition-colors">
                  📧 Check your email
                </button>
                <button className="px-3 py-2 bg-pink-100 text-pink-700 rounded-full text-sm hover:bg-pink-200 transition-colors">
                  🎬 Video ready!
                </button>
                <button className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm hover:bg-yellow-200 transition-colors">
                  ℹ️ Need more info
                </button>
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-600">
                  💡 Tip: Long press any template to customize it
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl border p-4 md:p-6 text-center">
            <div className="text-2xl md:text-3xl font-bold text-purple-600">87%</div>
            <p className="text-gray-600 mt-1 text-sm">Mobile Usage</p>
            <div className="text-xs text-green-600 mt-2">↑ 12% vs desktop</div>
          </div>
          <div className="bg-white rounded-xl border p-4 md:p-6 text-center">
            <div className="text-2xl md:text-3xl font-bold text-blue-600">2.1s</div>
            <p className="text-gray-600 mt-1 text-sm">Avg Response</p>
            <div className="text-xs text-green-600 mt-2">↓ 45% faster</div>
          </div>
          <div className="bg-white rounded-xl border p-4 md:p-6 text-center">
            <div className="text-2xl md:text-3xl font-bold text-green-600">342</div>
            <p className="text-gray-600 mt-1 text-sm">Daily Messages</p>
            <div className="text-xs text-blue-600 mt-2">Via mobile</div>
          </div>
          <div className="bg-white rounded-xl border p-4 md:p-6 text-center">
            <div className="text-2xl md:text-3xl font-bold text-orange-600">98%</div>
            <p className="text-gray-600 mt-1 text-sm">Sync Success</p>
            <div className="text-xs text-green-600 mt-2">Offline to online</div>
          </div>
        </div>

        {/* Mobile Demo Frame */}
        <div className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4 text-center">📱 Mobile Experience Demo</h2>
          <div className="max-w-sm mx-auto">
            <div className="border-8 border-gray-800 rounded-3xl overflow-hidden bg-white" style={{ aspectRatio: "9/19" }}>
              <MobileCommunicationManagement />
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            Best viewed on mobile device or responsive view
          </p>
        </div>

        {/* Implementation Notes */}
        <div className="bg-gray-50 p-6 rounded-xl mt-8">
          <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2 text-purple-700">Mobile Interface</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Condensed message view with avatars</li>
                <li>• Swipe gestures (archive/star)</li>
                <li>• Pull-to-refresh functionality</li>
                <li>• Voice message recording</li>
                <li>• Photo/video attachments</li>
                <li>• Location sharing support</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-blue-700">Quick Actions</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• 6 quick reply templates</li>
                <li>• Voice-to-text input</li>
                <li>• One-tap responses</li>
                <li>• Predictive text suggestions</li>
                <li>• Smart emoji picker</li>
                <li>• Gesture-based navigation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-green-700">Notifications</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Smart notification grouping</li>
                <li>• Priority-based alerts</li>
                <li>• Quiet hours (10pm-8am)</li>
                <li>• Custom sounds per type</li>
                <li>• Quick reply from notification</li>
                <li>• Vibration patterns</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-orange-700">Offline Support</h3>
              <ul className="space-y-1 text-gray-700">
                <li>• Draft message auto-save</li>
                <li>• Response queue system</li>
                <li>• Conversation caching</li>
                <li>• Auto-sync on reconnect</li>
                <li>• Local search capability</li>
                <li>• Offline indicator UI</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}