import { MobileFinancialManagement } from "@/components/creator/finance/mobile-financial-management"

export default function Phase3510Demo() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 3.5.10: Mobile Financial Management
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Secure, optimized mobile interfaces for creators to manage finances on-the-go 
          with biometric authentication, quick actions, and offline capabilities.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Biometric Auth
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Quick Actions
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Offline Mode
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Balance Widget
          </span>
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            Swipe Navigation
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Emergency Lock
          </span>
        </div>
      </div>

      {/* Mobile Feature Comparison */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
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
                <td className="p-3 font-medium">Balance Check</td>
                <td className="p-3">Full dashboard</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">Quick view</span>
                </td>
                <td className="p-3">Widget support</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Withdrawals</td>
                <td className="p-3">Multi-step process</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">Simplified</span>
                </td>
                <td className="p-3">Biometric auth</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Transactions</td>
                <td className="p-3">Full table view</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">List view</span>
                </td>
                <td className="p-3">Infinite scroll</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Goals</td>
                <td className="p-3">Detailed charts</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">Progress cards</span>
                </td>
                <td className="p-3">Swipe navigation</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="p-3 font-medium">Reports</td>
                <td className="p-3">Full generation</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">View only</span>
                </td>
                <td className="p-3">Download option</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Security Features */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Mobile Security Enhancements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Authentication */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold mb-3">🔐 Authentication</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Biometric login (Face/Touch ID)</li>
              <li>• 4-digit PIN backup</li>
              <li>• Device registration</li>
              <li>• Session timeout (5 min)</li>
              <li>• Secure token storage</li>
            </ul>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold mb-3">⚡ Quick Actions</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Balance widget</li>
              <li>• One-tap withdrawal</li>
              <li>• Quick deposit</li>
              <li>• Instant notifications</li>
              <li>• Emergency lock button</li>
            </ul>
          </div>

          {/* Offline Features */}
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
            <h3 className="font-bold mb-3">📱 Offline Features</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>• Cached balance view</li>
              <li>• Transaction history</li>
              <li>• Saved reports access</li>
              <li>• Goal tracking</li>
              <li>• Auto-sync on reconnect</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile UI Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-purple-600">👆</span>
            Touch Optimized
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Large touch targets</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Swipe gestures</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Pull to refresh</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Haptic feedback</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Bottom navigation</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-blue-600">🎨</span>
            Responsive Design
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Adaptive layouts</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Dark mode support</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Text size adjustment</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Portrait/landscape</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Minimal scrolling</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="text-green-600">⚡</span>
            Performance
          </h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Fast load times</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Optimized images</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Lazy loading</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Cached data</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Battery efficient</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile Experience Demo */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Mobile Experience Flow</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">👆</span>
            </div>
            <h3 className="font-bold mb-1">Launch</h3>
            <p className="text-xs text-gray-600">App opens with biometric prompt</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">🔐</span>
            </div>
            <h3 className="font-bold mb-1">Authenticate</h3>
            <p className="text-xs text-gray-600">Face ID or PIN entry</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">💰</span>
            </div>
            <h3 className="font-bold mb-1">Dashboard</h3>
            <p className="text-xs text-gray-600">View balance & quick actions</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="font-bold mb-1">Navigate</h3>
            <p className="text-xs text-gray-600">Swipe between sections</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="font-bold mb-1">Secure</h3>
            <p className="text-xs text-gray-600">Auto-lock after timeout</p>
          </div>
        </div>
      </div>

      {/* Key Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">99.9%</div>
          <p className="text-gray-600 mt-1">Uptime</p>
          <div className="text-sm text-purple-600 mt-2">Always available</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">2FA</div>
          <p className="text-gray-600 mt-1">Security</p>
          <div className="text-sm text-blue-600 mt-2">Biometric + PIN</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">5 sec</div>
          <p className="text-gray-600 mt-1">Quick Access</p>
          <div className="text-sm text-green-600 mt-2">To balance</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">100%</div>
          <p className="text-gray-600 mt-1">Offline</p>
          <div className="text-sm text-orange-600 mt-2">Capability</div>
        </div>
      </div>

      {/* Main Component - Mobile View */}
      <div className="bg-gray-100 rounded-2xl p-8">
        <div className="max-w-sm mx-auto">
          <div className="bg-black rounded-[2.5rem] p-2">
            <div className="bg-black rounded-[2.3rem] p-1">
              <div className="bg-white rounded-[2.1rem] overflow-hidden" style={{ minHeight: "600px" }}>
                <MobileFinancialManagement />
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            ☝️ Try the mobile experience above (best viewed on mobile devices)
          </p>
        </div>
      </div>

      {/* Implementation Notes */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Authentication & Security</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Biometric authentication (Face ID/Touch ID)</li>
              <li>• 4-digit PIN backup option</li>
              <li>• Device registration tracking</li>
              <li>• Configurable session timeout</li>
              <li>• Emergency lock feature</li>
              <li>• Secure token storage</li>
              <li>• Auto-logout on inactivity</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Mobile-Optimized UI</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Bottom tab navigation</li>
              <li>• Swipe gesture support</li>
              <li>• Pull-to-refresh functionality</li>
              <li>• Large touch targets (44x44 min)</li>
              <li>• Infinite scroll for transactions</li>
              <li>• Hide/show balance toggle</li>
              <li>• Dark mode support</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">Quick Actions</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• One-tap withdrawal</li>
              <li>• Quick deposit feature</li>
              <li>• Balance widget view</li>
              <li>• Goal progress cards</li>
              <li>• Recent activity list</li>
              <li>• Instant notifications</li>
              <li>• Configurable shortcuts</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Offline Capabilities</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Cached balance display</li>
              <li>• Transaction history storage</li>
              <li>• Goal tracking offline</li>
              <li>• Report viewing capability</li>
              <li>• Auto-sync on reconnection</li>
              <li>• Offline indicator</li>
              <li>• Last sync timestamp</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}