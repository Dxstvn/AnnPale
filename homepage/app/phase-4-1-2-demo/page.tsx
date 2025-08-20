import { LiveStreamDiscovery } from "@/components/streaming/live-stream-discovery"

export default function Phase412Demo() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 4.1.2: Live Stream Discovery & Directory
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Advanced discovery interface helping viewers find relevant live streams 
          with smart algorithms, personalized recommendations, and comprehensive 
          filtering options for maximum engagement.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Discovery Algorithm
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Smart Filtering
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Live Grid
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Upcoming Streams
          </span>
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            Personalization
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Real-time Updates
          </span>
        </div>
      </div>

      {/* Discovery Framework Overview */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-4">Live Stream Discovery Framework</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Component</th>
                <th className="text-left p-3">Purpose</th>
                <th className="text-left p-3">Algorithm Weight</th>
                <th className="text-left p-3">User Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Featured Stream Hero</td>
                <td className="p-3">Highlight top-performing stream</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">Highest score</span>
                </td>
                <td className="p-3">Maximum visibility</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Discovery Algorithm</td>
                <td className="p-3">Rank streams by relevance</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Multi-factor</span>
                </td>
                <td className="p-3">Personalized results</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Category Filtering</td>
                <td className="p-3">Group by content type</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">User choice</span>
                </td>
                <td className="p-3">Focused discovery</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Sorting Options</td>
                <td className="p-3">Order by preferences</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">6 options</span>
                </td>
                <td className="p-3">Custom ordering</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-medium">Real-time Updates</td>
                <td className="p-3">Live viewer counts & status</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">30s intervals</span>
                </td>
                <td className="p-3">Fresh information</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Algorithm Breakdown */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Smart Discovery Algorithm</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {/* Viewer Count Factor */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center">
            <h3 className="font-bold mb-3">👥 Viewer Count</h3>
            <div className="text-3xl font-bold mb-2">30%</div>
            <ul className="space-y-1 text-sm opacity-90">
              <li>• Current viewers</li>
              <li>• Peak today</li>
              <li>• Growth velocity</li>
            </ul>
          </div>

          {/* Engagement Factor */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center">
            <h3 className="font-bold mb-3">💬 Engagement</h3>
            <div className="text-3xl font-bold mb-2">25%</div>
            <ul className="space-y-1 text-sm opacity-90">
              <li>• Chat activity</li>
              <li>• Reactions</li>
              <li>• Interaction rate</li>
            </ul>
          </div>

          {/* Creator Reputation */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center">
            <h3 className="font-bold mb-3">⭐ Creator Score</h3>
            <div className="text-3xl font-bold mb-2">20%</div>
            <ul className="space-y-1 text-sm opacity-90">
              <li>• Verification status</li>
              <li>• Follower count</li>
              <li>• Stream quality</li>
            </ul>
          </div>

          {/* Stream Quality */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center">
            <h3 className="font-bold mb-3">🎥 Quality</h3>
            <div className="text-3xl font-bold mb-2">15%</div>
            <ul className="space-y-1 text-sm opacity-90">
              <li>• Video resolution</li>
              <li>• Audio clarity</li>
              <li>• Connection stability</li>
            </ul>
          </div>

          {/* Newness Bonus */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6 text-center">
            <h3 className="font-bold mb-3">✨ Fresh Content</h3>
            <div className="text-3xl font-bold mb-2">10%</div>
            <ul className="space-y-1 text-sm opacity-90">
              <li>• Recently started</li>
              <li>• New creators</li>
              <li>• Trending topics</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Personalization Features */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Personalization Engine</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Viewing History */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-purple-600">📊</span>
              Viewing History Analysis
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Preferred categories tracking</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Creator interaction patterns</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Watch time analysis</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Engagement behavior</span>
              </li>
            </ul>
          </div>

          {/* Following Preferences */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-blue-600">❤️</span>
              Following Boost
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>1.5x score multiplier</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Priority notifications</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Dedicated following tab</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Early access previews</span>
              </li>
            </ul>
          </div>

          {/* Location & Time */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <span className="text-green-600">🌍</span>
              Location Optimization
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Time zone matching</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Language preferences</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Cultural relevance</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Regional trending</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Discovery Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-600">🎯</span>
            Smart Filtering
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>11 content categories</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>6 language options</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Viewer count ranges</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Quality preferences</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Premium/Free toggle</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-blue-600">📊</span>
            Sorting Options
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Trending (AI-powered)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Most viewers</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Just started</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>By category</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Language groups</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-600">⚡</span>
            Real-time Features
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Live viewer counts</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Stream duration tracking</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>30-second updates</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Status change alerts</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Trending notifications</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Interface Layouts */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Discovery Interface Layouts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Live Directory Structure */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-purple-700">Live Directory Structure</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="font-medium">Hero Section</div>
                <ul className="mt-1 text-gray-600 space-y-1">
                  <li>• Featured stream (auto-playing)</li>
                  <li>• Creator info overlay</li>
                  <li>• Real-time viewer count</li>
                  <li>• Prominent join button</li>
                </ul>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="font-medium">Currently Live Grid</div>
                <ul className="mt-1 text-gray-600 space-y-1">
                  <li>• Animated thumbnails</li>
                  <li>• Creator & category info</li>
                  <li>• Live viewer counts</li>
                  <li>• Stream duration display</li>
                </ul>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="font-medium">Upcoming Timeline</div>
                <ul className="mt-1 text-gray-600 space-y-1">
                  <li>• Schedule timeline view</li>
                  <li>• Set reminder buttons</li>
                  <li>• Creator preview cards</li>
                  <li>• Time zone optimization</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Filtering System */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-blue-700">Advanced Filtering</h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="font-medium">Category Filters</div>
                <ul className="mt-1 text-gray-600 space-y-1">
                  <li>• Music performances</li>
                  <li>• Q&A sessions</li>
                  <li>• Behind the scenes</li>
                  <li>• Tutorials & education</li>
                  <li>• Special events</li>
                </ul>
              </div>
              <div className="p-3 bg-pink-50 rounded-lg">
                <div className="font-medium">Smart Sorting</div>
                <ul className="mt-1 text-gray-600 space-y-1">
                  <li>• Trending (velocity algorithm)</li>
                  <li>• Most viewers (popularity)</li>
                  <li>• Recently started (fresh)</li>
                  <li>• Following (personalized)</li>
                  <li>• Language preference</li>
                </ul>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="font-medium">Personalization</div>
                <ul className="mt-1 text-gray-600 space-y-1">
                  <li>• Viewing history analysis</li>
                  <li>• Followed creator boost</li>
                  <li>• Category preferences</li>
                  <li>• Language matching</li>
                  <li>• Time zone optimization</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">11</div>
          <p className="text-gray-600 mt-1">Categories</p>
          <div className="text-sm text-purple-600 mt-2">Content types</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">6</div>
          <p className="text-gray-600 mt-1">Sort Options</p>
          <div className="text-sm text-blue-600 mt-2">Discovery methods</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">30s</div>
          <p className="text-gray-600 mt-1">Update Rate</p>
          <div className="text-sm text-green-600 mt-2">Real-time data</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">100%</div>
          <p className="text-gray-600 mt-1">Personalized</p>
          <div className="text-sm text-orange-600 mt-2">AI-powered</div>
        </div>
      </div>

      {/* Main Component */}
      <div className="bg-white rounded-2xl border shadow-sm">
        <LiveStreamDiscovery />
      </div>

      {/* Implementation Notes */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Discovery Algorithm</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Multi-factor scoring system</li>
              <li>• Real-time viewer count weighting (30%)</li>
              <li>• Engagement rate analysis (25%)</li>
              <li>• Creator reputation scoring (20%)</li>
              <li>• Stream quality assessment (15%)</li>
              <li>• Newness bonus calculation (10%)</li>
              <li>• Personalization multipliers</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Filtering & Search</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 11 content categories with icons</li>
              <li>• 6 language options with flags</li>
              <li>• Viewer count range sliders</li>
              <li>• Quality preference toggles</li>
              <li>• Premium/Free content filters</li>
              <li>• Real-time search with debouncing</li>
              <li>• Advanced filter panel</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">User Experience</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Three-tab interface (Live/Upcoming/Following)</li>
              <li>• Grid and list view modes</li>
              <li>• Featured stream hero section</li>
              <li>• Animated card interactions</li>
              <li>• Infinite scroll support</li>
              <li>• Mobile-responsive design</li>
              <li>• Keyboard navigation support</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Real-time Features</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• 30-second automatic updates</li>
              <li>• Live viewer count tracking</li>
              <li>• Stream duration monitoring</li>
              <li>• Status change notifications</li>
              <li>• Trending score calculations</li>
              <li>• Connection status indicators</li>
              <li>• Auto-refresh on network recovery</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}