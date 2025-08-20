"use client"

import { ReputationManagement } from "@/components/creator/reputation/reputation-management"

export default function Phase349Demo() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 3.4.9: Reputation Management
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Build and protect creator reputation through proactive monitoring, strategic response 
          protocols, and comprehensive crisis management framework.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            5 Monitoring Sources
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Real-time Tracking
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Sentiment Analysis
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            4 Threat Levels
          </span>
          <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
            Crisis Management
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Response Templates
          </span>
        </div>
      </div>

      {/* Monitoring Sources Table */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Reputation Monitoring Sources</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Source</th>
                <th className="text-left p-3">Monitoring Frequency</th>
                <th className="text-left p-3">Alert Threshold</th>
                <th className="text-left p-3">Response Protocol</th>
                <th className="text-left p-3">Impact Level</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="font-medium">Platform Reviews</span>
                  </div>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Real-time</span>
                </td>
                <td className="p-3">Any review</td>
                <td className="p-3">Standard response</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">High</span>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium">Social Media</span>
                  </div>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Hourly</span>
                </td>
                <td className="p-3">Mention</td>
                <td className="p-3">Assess & engage</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">Medium</span>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="font-medium">Google Reviews</span>
                  </div>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Daily</span>
                </td>
                <td className="p-3">Any review</td>
                <td className="p-3">Professional response</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">High</span>
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <span className="font-medium">Press Mentions</span>
                  </div>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Weekly</span>
                </td>
                <td className="p-3">Any mention</td>
                <td className="p-3">PR strategy</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Critical</span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                    <span className="font-medium">Forums/Reddit</span>
                  </div>
                </td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Daily</span>
                </td>
                <td className="p-3">Trending</td>
                <td className="p-3">Monitor/engage</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">Low</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Crisis Management Framework */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Crisis Management Framework</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-3">🔵</div>
            <h3 className="font-bold mb-2">Level 1: Minor Issue</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Single complaint</li>
              <li>• Respond directly</li>
              <li>• Document resolution</li>
              <li>• Monitor patterns</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-white/20">
              <span className="text-xs opacity-75">Current: 3 issues</span>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-3">🟡</div>
            <h3 className="font-bold mb-2">Level 2: Pattern Emerging</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Multiple similar issues</li>
              <li>• Internal review</li>
              <li>• Process improvement</li>
              <li>• Team briefing</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-white/20">
              <span className="text-xs opacity-75">Current: 1 issue</span>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-3">🟠</div>
            <h3 className="font-bold mb-2">Level 3: Public Attention</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Social media spread</li>
              <li>• Crisis team activation</li>
              <li>• Public statement</li>
              <li>• Platform coordination</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-white/20">
              <span className="text-xs opacity-75">Current: 0 issues</span>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <div className="text-3xl mb-3">🔴</div>
            <h3 className="font-bold mb-2">Level 4: Platform Risk</h3>
            <ul className="text-sm space-y-1 opacity-90">
              <li>• Policy violation risk</li>
              <li>• Legal consultation</li>
              <li>• Damage control</li>
              <li>• Executive involvement</li>
            </ul>
            <div className="mt-3 pt-3 border-t border-white/20">
              <span className="text-xs opacity-75">Current: 0 issues</span>
            </div>
          </div>
        </div>
      </div>

      {/* Response Protocol Flow */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Response Protocol Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { icon: "🔔", title: "Alert", desc: "Issue detected", color: "purple" },
            { icon: "🔍", title: "Assess", desc: "Evaluate severity", color: "blue" },
            { icon: "👥", title: "Assign", desc: "Team response", color: "green" },
            { icon: "💬", title: "Respond", desc: "Public/private", color: "orange" },
            { icon: "📊", title: "Monitor", desc: "Track impact", color: "pink" }
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

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">4.6/5</div>
          <p className="text-gray-600 mt-1">Reputation Score</p>
          <div className="text-sm text-green-600 mt-2">↑ 0.2 this month</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">589</div>
          <p className="text-gray-600 mt-1">Total Mentions</p>
          <div className="text-sm text-blue-600 mt-2">Across all channels</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">84%</div>
          <p className="text-gray-600 mt-1">Positive Sentiment</p>
          <div className="text-sm text-green-600 mt-2">↑ 5% improvement</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">2.5h</div>
          <p className="text-gray-600 mt-1">Avg Response Time</p>
          <div className="text-sm text-green-600 mt-2">↓ 30% faster</div>
        </div>
      </div>

      {/* Main Component */}
      <div className="bg-white rounded-2xl border shadow-sm">
        <ReputationManagement />
      </div>

      {/* Implementation Notes */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Monitoring Dashboard</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 5 source monitoring (Platform, Social, Google, Press, Forums)</li>
              <li>• Real-time alerts and notifications</li>
              <li>• Sentiment analysis tracking</li>
              <li>• Mention volume monitoring</li>
              <li>• Response time tracking</li>
              <li>• Automated alert thresholds</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Crisis Management</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 4-level threat assessment system</li>
              <li>• Automated escalation protocols</li>
              <li>• Crisis team activation</li>
              <li>• Response workflow management</li>
              <li>• Public statement templates</li>
              <li>• Legal consultation triggers</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Response System</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Quick response templates</li>
              <li>• Custom response builder</li>
              <li>• Multi-channel response</li>
              <li>• Response tracking</li>
              <li>• Impact measurement</li>
              <li>• Follow-up reminders</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Analytics & Reporting</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Sentiment trend analysis</li>
              <li>• Source-specific metrics</li>
              <li>• Response effectiveness</li>
              <li>• Reputation score tracking</li>
              <li>• Crisis prevention metrics</li>
              <li>• Monthly reputation reports</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}