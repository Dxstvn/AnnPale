'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Play,
  Users,
  MessageSquare,
  Heart,
  Gift,
  Star,
  Zap,
  TrendingUp,
  Settings,
  Maximize,
  Volume2,
  Headphones,
  Smartphone,
  Monitor,
  Tv,
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign,
  ThumbsUp,
  Share2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function Phase413Demo() {
  const [selectedQuality, setSelectedQuality] = useState('auto');
  const [selectedLatency, setSelectedLatency] = useState('normal');

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
          Phase 4.1.3: Live Stream Viewer Experience
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Immersive viewing experience that balances video quality with interactive 
          features and social engagement. Real-time communication, adaptive streaming, 
          and comprehensive viewer tools for maximum engagement.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            Adaptive Player
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            Live Chat
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            Reactions
          </span>
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
            Virtual Gifts
          </span>
          <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
            Theater Mode
          </span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
            Multi-Quality
          </span>
        </div>
      </div>

      {/* Live Demo Link */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-4">🎬 Live Demo Available</h2>
        <p className="mb-6 text-lg opacity-90">
          Experience the complete live stream viewer with real-time features, 
          adaptive quality, and interactive elements
        </p>
        <Link href="/live/demo-stream">
          <Button 
            size="lg" 
            className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-8"
          >
            <Play className="w-5 h-5 mr-2" />
            Launch Live Viewer Demo
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </Link>
      </div>

      {/* Viewer Interface Layout */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Live Stream Viewer Interface</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Player Area */}
          <div className="lg:col-span-2 space-y-4">
            <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-red-500 text-white animate-pulse">
                  <div className="w-2 h-2 bg-white rounded-full mr-1" />
                  LIVE
                </Badge>
              </div>
              <div className="absolute top-4 right-4">
                <Badge className="bg-black/40 text-white">HD</Badge>
              </div>
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>1.2K</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>45m</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30">
                      <Volume2 className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30">
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="bg-white/20 hover:bg-white/30">
                      <Maximize className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <Play className="w-16 h-16 mx-auto mb-4" />
                  <p className="text-lg">Interactive Video Player</p>
                  <p className="text-sm opacity-80">Adaptive Quality • Theater Mode • PiP</p>
                </div>
              </div>
            </div>
            
            {/* Stream Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  JB
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Live Kompa Performance from Port-au-Prince</h3>
                  <p className="text-sm text-gray-600">Jean Baptiste • 1.2K watching</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Heart className="w-4 h-4 mr-1" />
                    Follow
                  </Button>
                  <Button size="sm">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Tip
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Chat & Interactions */}
          <div className="space-y-4">
            {/* Chat Panel */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Live Chat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { user: "haiti_music_lover", message: "This kompa is fire! 🔥🔥🔥", time: "2m" },
                  { user: "dancing_queen", message: "Can you play \"Mwen Renmen Ou\"?", time: "1m" },
                  { user: "kompa_king", message: "Amazing performance!", time: "30s" }
                ].map((chat, i) => (
                  <div key={i} className="flex gap-2 text-sm">
                    <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex-shrink-0" />
                    <div className="flex-1">
                      <span className="font-medium text-purple-600">{chat.user}</span>
                      <span className="ml-2">{chat.message}</span>
                      <span className="ml-2 text-gray-400 text-xs">{chat.time}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Reactions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Reactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { emoji: "❤️", count: 45 },
                    { emoji: "🔥", count: 32 },
                    { emoji: "👏", count: 28 },
                    { emoji: "😂", count: 15 },
                    { emoji: "😮", count: 12 },
                    { emoji: "🎉", count: 8 }
                  ].map((reaction, i) => (
                    <Button 
                      key={i} 
                      variant="outline" 
                      size="sm" 
                      className="flex flex-col gap-1 h-12"
                    >
                      <span className="text-lg">{reaction.emoji}</span>
                      <span className="text-xs">{reaction.count}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Interactive Features Overview */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Interactive Features Matrix</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Feature</th>
                <th className="text-left p-3">Purpose</th>
                <th className="text-left p-3">Engagement Level</th>
                <th className="text-left p-3">Revenue Potential</th>
                <th className="text-left p-3">Implementation</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Live Chat</td>
                <td className="p-3">Real-time communication</td>
                <td className="p-3">
                  <Badge className="bg-green-100 text-green-700">High</Badge>
                </td>
                <td className="p-3">Indirect</td>
                <td className="p-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Emoji Reactions</td>
                <td className="p-3">Quick expression</td>
                <td className="p-3">
                  <Badge className="bg-blue-100 text-blue-700">Medium</Badge>
                </td>
                <td className="p-3">None</td>
                <td className="p-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Virtual Gifts</td>
                <td className="p-3">Support creator</td>
                <td className="p-3">
                  <Badge className="bg-green-100 text-green-700">High</Badge>
                </td>
                <td className="p-3">
                  <Badge className="bg-purple-100 text-purple-700">Direct</Badge>
                </td>
                <td className="p-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Super Chat</td>
                <td className="p-3">Highlighted messages</td>
                <td className="p-3">
                  <Badge className="bg-green-100 text-green-700">High</Badge>
                </td>
                <td className="p-3">
                  <Badge className="bg-purple-100 text-purple-700">Direct</Badge>
                </td>
                <td className="p-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="p-3 font-medium">Polls/Q&A</td>
                <td className="p-3">Audience participation</td>
                <td className="p-3">
                  <Badge className="bg-green-100 text-green-700">High</Badge>
                </td>
                <td className="p-3">Indirect</td>
                <td className="p-3">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Quality & Performance Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Adaptive Bitrate Streaming */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Adaptive Bitrate Streaming
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { quality: 'auto', label: 'Auto Quality', desc: 'Adapts to connection', bandwidth: 'Variable', selected: true },
                { quality: '1080p', label: '1080p HD', desc: 'Full high definition', bandwidth: '5 Mbps' },
                { quality: '720p', label: '720p HD', desc: 'Standard HD', bandwidth: '2.5 Mbps' },
                { quality: '480p', label: '480p', desc: 'Standard quality', bandwidth: '1 Mbps' },
                { quality: 'audio', label: 'Audio Only', desc: 'Minimal data usage', bandwidth: '128 kbps' }
              ].map((item) => (
                <div 
                  key={item.quality}
                  className={cn(
                    'p-3 border rounded-lg cursor-pointer transition-colors',
                    selectedQuality === item.quality ? 'border-purple-500 bg-purple-50' : 'hover:bg-gray-50'
                  )}
                  onClick={() => setSelectedQuality(item.quality)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div className="text-sm text-gray-600">{item.desc}</div>
                    </div>
                    <div className="text-sm text-gray-500">{item.bandwidth}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Latency Options */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Latency Options
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { mode: 'ultra-low', label: 'Ultra-low (<2 sec)', desc: 'Real-time interaction', premium: true },
                { mode: 'low', label: 'Low (2-5 sec)', desc: 'Fast interaction', premium: false },
                { mode: 'normal', label: 'Normal (5-10 sec)', desc: 'Balanced quality', premium: false, selected: true },
                { mode: 'reduced-data', label: 'Reduced data mode', desc: 'Mobile optimized', premium: false }
              ].map((item) => (
                <div 
                  key={item.mode}
                  className={cn(
                    'p-3 border rounded-lg cursor-pointer transition-colors',
                    selectedLatency === item.mode ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  )}
                  onClick={() => setSelectedLatency(item.mode)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{item.label}</span>
                        {item.premium && (
                          <Badge className="bg-yellow-100 text-yellow-700 text-xs">Premium</Badge>
                        )}
                      </div>
                      <div className="text-sm text-gray-600">{item.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Compatibility */}
      <div className="bg-white rounded-2xl border shadow-sm p-6">
        <h2 className="text-2xl font-bold mb-6">Multi-Device Experience</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
              <Smartphone className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="font-semibold">Mobile</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Touch-optimized controls</li>
              <li>• Tab-based chat/reactions</li>
              <li>• Portrait/landscape modes</li>
              <li>• Gesture support</li>
            </ul>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Monitor className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="font-semibold">Desktop</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Full-featured interface</li>
              <li>• Keyboard shortcuts</li>
              <li>• Multi-window support</li>
              <li>• Advanced controls</li>
            </ul>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Tv className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="font-semibold">TV</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Big screen optimized</li>
              <li>• Remote control support</li>
              <li>• Theater mode default</li>
              <li>• Simplified interface</li>
            </ul>
          </div>
          
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
              <Headphones className="w-8 h-8 text-orange-600" />
            </div>
            <h3 className="font-semibold">Audio-Only</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Background listening</li>
              <li>• Minimal data usage</li>
              <li>• Chat participation</li>
              <li>• Audio quality focus</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="bg-gray-50 rounded-2xl p-6">
        <h2 className="text-2xl font-bold mb-6">Keyboard Shortcuts</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold mb-3">Player Controls</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Play/Pause</span>
                <kbd className="px-2 py-1 bg-white border rounded text-xs">Space</kbd>
              </li>
              <li className="flex justify-between">
                <span>Fullscreen</span>
                <kbd className="px-2 py-1 bg-white border rounded text-xs">F</kbd>
              </li>
              <li className="flex justify-between">
                <span>Mute/Unmute</span>
                <kbd className="px-2 py-1 bg-white border rounded text-xs">M</kbd>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Interface</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Theater Mode</span>
                <kbd className="px-2 py-1 bg-white border rounded text-xs">T</kbd>
              </li>
              <li className="flex justify-between">
                <span>Toggle Chat</span>
                <kbd className="px-2 py-1 bg-white border rounded text-xs">C</kbd>
              </li>
              <li className="flex justify-between">
                <span>Settings</span>
                <kbd className="px-2 py-1 bg-white border rounded text-xs">S</kbd>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-3">Interactions</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between">
                <span>Send Heart</span>
                <kbd className="px-2 py-1 bg-white border rounded text-xs">H</kbd>
              </li>
              <li className="flex justify-between">
                <span>Focus Chat</span>
                <kbd className="px-2 py-1 bg-white border rounded text-xs">/</kbd>
              </li>
              <li className="flex justify-between">
                <span>Share</span>
                <kbd className="px-2 py-1 bg-white border rounded text-xs">Ctrl+S</kbd>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-purple-600">6</div>
          <p className="text-gray-600 mt-1">Quality Options</p>
          <div className="text-sm text-purple-600 mt-2">Auto to 4K</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-blue-600">4</div>
          <p className="text-gray-600 mt-1">Latency Modes</p>
          <div className="text-sm text-blue-600 mt-2">2s to 15s range</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-green-600">100%</div>
          <p className="text-gray-600 mt-1">Interactive</p>
          <div className="text-sm text-green-600 mt-2">Real-time features</div>
        </div>
        <div className="bg-white rounded-xl border p-6 text-center">
          <div className="text-3xl font-bold text-orange-600">∞</div>
          <p className="text-gray-600 mt-1">Engagement</p>
          <div className="text-sm text-orange-600 mt-2">Unlimited interactions</div>
        </div>
      </div>

      {/* Implementation Features */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-4">🛠️ Implementation Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-purple-700">Video Player Technology</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Adaptive bitrate streaming (HLS/DASH)</li>
              <li>• Multiple quality levels with auto-switching</li>
              <li>• Picture-in-picture support</li>
              <li>• Theater mode and fullscreen</li>
              <li>• Buffer health monitoring</li>
              <li>• Connection quality detection</li>
              <li>• Keyboard shortcuts integration</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-blue-700">Interactive Features</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Real-time chat with moderation</li>
              <li>• 6 reaction types with animations</li>
              <li>• Virtual gifts system (3 categories)</li>
              <li>• Super chat with pricing tiers</li>
              <li>• Polls and Q&A management</li>
              <li>• Follow/subscribe integration</li>
              <li>• Share functionality</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-green-700">User Experience</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• Mobile-responsive design</li>
              <li>• Tab-based mobile interface</li>
              <li>• Stream info bar with analytics</li>
              <li>• Creator profile integration</li>
              <li>• Related content suggestions</li>
              <li>• Performance indicators</li>
              <li>• Accessibility features</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-orange-700">Technical Features</h3>
            <ul className="space-y-1 text-gray-700">
              <li>• WebRTC for ultra-low latency</li>
              <li>• Adaptive quality switching</li>
              <li>• Connection monitoring</li>
              <li>• Error recovery and retry logic</li>
              <li>• Analytics and metrics tracking</li>
              <li>• Cross-platform compatibility</li>
              <li>• Scalable real-time infrastructure</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}