import { LiveStreamingPsychology } from "@/components/streaming/live-streaming-psychology"

export default function Phase411Demo() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 4.1.1: Live Streaming Psychology & Engagement Models
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Master the psychology of live streaming to maximize viewer engagement, 
          build loyal communities, and create sustainable revenue streams through 
          data-driven insights and proven psychological triggers.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Viewer Psychology
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Engagement Pyramid
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Monetization
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Persona Analysis
          </span>
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            Psychological Hooks
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Analytics
          </span>
        </div>
      </div>

      {/* Key Concepts Overview */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Live Streaming Psychology Framework</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Concept</th>
                <th className="text-left p-3">Description</th>
                <th className="text-left p-3">Key Metric</th>
                <th className="text-left p-3">Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Engagement Pyramid</td>
                <td className="p-3">5-level viewer behavior hierarchy</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">20% active</span>
                </td>
                <td className="p-3">Revenue distribution</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Viewer Personas</td>
                <td className="p-3">5 distinct audience segments</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">$25 avg</span>
                </td>
                <td className="p-3">Targeted engagement</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Psychological Hooks</td>
                <td className="p-3">6 core engagement drivers</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">92% effective</span>
                </td>
                <td className="p-3">Viewer retention</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Engagement Triggers</td>
                <td className="p-3">Timed interaction prompts</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">3.5x tips</span>
                </td>
                <td className="p-3">Monetization boost</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-medium">Revenue Strategies</td>
                <td className="p-3">6 monetization methods</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">$1,225/stream</span>
                </td>
                <td className="p-3">Income optimization</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Engagement Psychology Insights */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Core Psychological Principles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* FOMO & Scarcity */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold mb-3">🎯 FOMO & Scarcity</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Limited-time exclusive content</li>
              <li>• "Only happening now" moments</li>
              <li>• Countdown timers for offers</li>
              <li>• Limited viewer slots</li>
              <li>• Never-to-be-repeated events</li>
            </ul>
          </div>

          {/* Social Proof & Belonging */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold mb-3">👥 Social Proof & Belonging</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Display viewer count prominently</li>
              <li>• Show recent tips and gifts</li>
              <li>• Highlight top supporters</li>
              <li>• Create inside jokes</li>
              <li>• Build community rituals</li>
            </ul>
          </div>

          {/* Reciprocity & Progress */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold mb-3">🎁 Reciprocity & Progress</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Give before asking</li>
              <li>• Set collective goals</li>
              <li>• Celebrate milestones together</li>
              <li>• Personal shoutouts</li>
              <li>• Viewer achievements</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Viewer Journey Map */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Viewer Journey & Conversion Funnel</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">👀</span>
            </div>
            <h3 className="font-bold mb-1">Discovery</h3>
            <p className="text-sm text-gray-600">5,000 potential</p>
            <div className="text-xs mt-2">
              <span className="px-2 py-1 bg-gray-100 rounded">100%</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">❤️</span>
            </div>
            <h3 className="font-bold mb-1">First View</h3>
            <p className="text-sm text-gray-600">2,500 viewers</p>
            <div className="text-xs mt-2">
              <span className="px-2 py-1 bg-pink-100 rounded">50%</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">💬</span>
            </div>
            <h3 className="font-bold mb-1">Return Viewer</h3>
            <p className="text-sm text-gray-600">1,000 regulars</p>
            <div className="text-xs mt-2">
              <span className="px-2 py-1 bg-blue-100 rounded">20%</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">🎁</span>
            </div>
            <h3 className="font-bold mb-1">Active Participant</h3>
            <p className="text-sm text-gray-600">200 engaged</p>
            <div className="text-xs mt-2">
              <span className="px-2 py-1 bg-purple-100 rounded">4%</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">👑</span>
            </div>
            <h3 className="font-bold mb-1">Paid Supporter</h3>
            <p className="text-sm text-gray-600">50 champions</p>
            <div className="text-xs mt-2">
              <span className="px-2 py-1 bg-purple-600 text-white rounded">1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-600">🚀</span>
            Quick Wins
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Name recognition system</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Goal progress bars</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Timed engagement triggers</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Social proof displays</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Viewer milestones</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-blue-600">📊</span>
            Key Metrics
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Viewer retention rate</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Engagement percentage</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Conversion to paid</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Average viewer value</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Return viewer rate</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-600">💰</span>
            Revenue Impact
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>+35% from recognition</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>+25% from goals</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>+20% from triggers</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>+15% from social proof</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>+10% from personas</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Success Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">5</div>
          <p className="text-gray-600 mt-1">Engagement Levels</p>
          <div className="text-sm text-purple-600 mt-2">Pyramid model</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">92%</div>
          <p className="text-gray-600 mt-1">Hook Effectiveness</p>
          <div className="text-sm text-blue-600 mt-2">FOMO trigger</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">$1,225</div>
          <p className="text-gray-600 mt-1">Per Stream</p>
          <div className="text-sm text-green-600 mt-2">Avg revenue</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">3.5x</div>
          <p className="text-gray-600 mt-1">Tip Increase</p>
          <div className="text-sm text-orange-600 mt-2">Name recognition</div>
        </div>
      </div>

      {/* Main Component */}
      <div className="bg-white rounded-2xl border shadow-sm">
        <LiveStreamingPsychology />
      </div>

      {/* Implementation Notes */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Psychology Framework</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 5-level engagement pyramid visualization</li>
              <li>• Interactive persona cards with insights</li>
              <li>• 6 psychological hooks with effectiveness ratings</li>
              <li>• Engagement trigger timing guide</li>
              <li>• Revenue optimization calculator</li>
              <li>• Stream performance timeline charts</li>
              <li>• Viewer journey funnel analytics</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Data Visualization</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Real-time engagement metrics display</li>
              <li>• Revenue stream composition charts</li>
              <li>• Persona distribution pie charts</li>
              <li>• Performance radar charts</li>
              <li>• Conversion funnel visualization</li>
              <li>• Time-series analytics graphs</li>
              <li>• Interactive hover states with details</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Monetization Tools</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 6 revenue strategy cards</li>
              <li>• Timing optimization guide</li>
              <li>• Psychological trigger playbook</li>
              <li>• Revenue potential calculator</li>
              <li>• Adoption rate tracking</li>
              <li>• Strategy effectiveness metrics</li>
              <li>• Personalized recommendations</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Analytics & Insights</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Deep performance analytics</li>
              <li>• Key insight extraction</li>
              <li>• Action item prioritization</li>
              <li>• Growth opportunity identification</li>
              <li>• Comparative benchmarking</li>
              <li>• Predictive revenue modeling</li>
              <li>• Custom report generation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}