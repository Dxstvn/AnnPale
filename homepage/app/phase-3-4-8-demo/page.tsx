"use client"

import { MultiChannelCommunication } from "@/components/creator/communication/multi-channel-communication"

export default function Phase348Demo() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 3.4.8: Multi-Channel Communication
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Unified inbox managing customer communications across multiple channels with 
          consistency, efficiency, and intelligent routing for seamless conversations.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            5 Channels
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Unified Inbox
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Auto-Response
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Channel Settings
          </span>
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            Cross-Channel
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Smart Routing
          </span>
        </div>
      </div>

      {/* Channel Overview Table */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Channel Characteristics & Automation</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Channel</th>
                <th className="text-left p-3">Use Case</th>
                <th className="text-left p-3">Response Time</th>
                <th className="text-left p-3">Formality</th>
                <th className="text-left p-3">Automation</th>
                <th className="text-left p-3">Features</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="font-medium">In-app Messages</span>
                  </div>
                </td>
                <td className="p-3">Primary</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Real-time</span>
                </td>
                <td className="p-3">Professional</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">High</span>
                </td>
                <td className="p-3">Templates, Quick replies</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Email</span>
                  </div>
                </td>
                <td className="p-3">Notifications</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Hours</span>
                </td>
                <td className="p-3">Formal</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Medium</span>
                </td>
                <td className="p-3">Threading, Attachments</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">SMS</span>
                  </div>
                </td>
                <td className="p-3">Urgent only</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">Minutes</span>
                </td>
                <td className="p-3">Brief</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Low</span>
                </td>
                <td className="p-3">160 char limit, Links</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span className="font-medium">WhatsApp</span>
                  </div>
                </td>
                <td className="p-3">International</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Hours</span>
                </td>
                <td className="p-3">Casual</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Medium</span>
                </td>
                <td className="p-3">Rich media, Voice notes</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="font-medium">Social DMs</span>
                  </div>
                </td>
                <td className="p-3">Public relations</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Daily</span>
                </td>
                <td className="p-3">Friendly</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">Low</span>
                </td>
                <td className="p-3">Emojis, GIFs, Stories</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Unified Inbox Features */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Unified Inbox Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              📬 Channel Tabs
            </h3>
            <ul className="space-y-2 text-sm">
              <li>✓ All Messages (unified view)</li>
              <li>✓ Platform messages</li>
              <li>✓ Email threads</li>
              <li>✓ SMS conversations</li>
              <li>✓ WhatsApp chats</li>
              <li>✓ Social mentions</li>
            </ul>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              ⚙️ Channel Settings
            </h3>
            <ul className="space-y-2 text-sm">
              <li>✓ Enable/disable channels</li>
              <li>✓ Auto-response rules</li>
              <li>✓ Routing logic</li>
              <li>✓ Priority levels</li>
              <li>✓ Notification preferences</li>
              <li>✓ SLA configuration</li>
            </ul>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              🔄 Cross-Channel Tools
            </h3>
            <ul className="space-y-2 text-sm">
              <li>✓ Conversation merge</li>
              <li>✓ Channel switching</li>
              <li>✓ History sync</li>
              <li>✓ Preference tracking</li>
              <li>✓ Context preservation</li>
              <li>✓ Unified threading</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">43</div>
          <p className="text-gray-600 mt-1">Unread Messages</p>
          <div className="text-sm text-green-600 mt-2">↓ 23% vs yesterday</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">3.2h</div>
          <p className="text-gray-600 mt-1">Avg Response Time</p>
          <div className="text-sm text-green-600 mt-2">Meeting SLA</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">127</div>
          <p className="text-gray-600 mt-1">Active Conversations</p>
          <div className="text-sm text-blue-600 mt-2">Across 5 channels</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">42%</div>
          <p className="text-gray-600 mt-1">Automation Rate</p>
          <div className="text-sm text-green-600 mt-2">↑ 8% improvement</div>
        </div>
      </div>

      {/* Communication Flow Diagram */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Multi-Channel Communication Flow</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { icon: "📱", title: "Customer Contact", desc: "Any channel", color: "purple" },
            { icon: "🤖", title: "Smart Routing", desc: "Priority & category", color: "blue" },
            { icon: "📬", title: "Unified Inbox", desc: "Single view", color: "green" },
            { icon: "💬", title: "Response", desc: "Optimal channel", color: "orange" },
            { icon: "📊", title: "Analytics", desc: "Track & optimize", color: "pink" }
          ].map((step, index) => (
            <div key={index} className="text-center">
              <div className={`mx-auto w-16 h-16 bg-${step.color}-100 rounded-full flex items-center justify-center text-2xl mb-3`}>
                {step.icon}
              </div>
              <h3 className="font-semibold text-sm mb-1">{step.title}</h3>
              <p className="text-xs text-gray-600">{step.desc}</p>
              {index < 4 && (
                <div className="hidden md:block absolute ml-16 mt-[-3rem] text-2xl text-gray-300">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Component */}
      <div className="bg-white rounded-2xl border shadow-sm">
        <MultiChannelCommunication />
      </div>

      {/* Implementation Notes */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Unified Inbox</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• All messages in single view</li>
              <li>• Channel-specific tabs</li>
              <li>• Unread count per channel</li>
              <li>• Search across all channels</li>
              <li>• Filter by priority/status</li>
              <li>• Conversation threading</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Channel Management</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 5 integrated channels</li>
              <li>• Enable/disable per channel</li>
              <li>• Custom response times</li>
              <li>• Formality levels</li>
              <li>• Automation settings</li>
              <li>• Priority routing rules</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Cross-Channel Features</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Merge conversations</li>
              <li>• Switch channels mid-conversation</li>
              <li>• Sync conversation history</li>
              <li>• Track channel preferences</li>
              <li>• Maintain context across channels</li>
              <li>• Unified customer profile</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Automation & Efficiency</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Auto-response templates</li>
              <li>• Smart routing based on content</li>
              <li>• Priority detection</li>
              <li>• SLA tracking per channel</li>
              <li>• Bulk actions</li>
              <li>• Quick reply suggestions</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}