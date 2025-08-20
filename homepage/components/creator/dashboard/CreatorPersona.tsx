"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Target, Clock, Users, Award } from "lucide-react"

export type PersonaType = 'new' | 'part-timer' | 'full-timer' | 'celebrity' | 'influencer'

interface CreatorStats {
  totalEarnings: number
  monthlyEarnings: number
  completedVideos: number
  pendingRequests: number
  averageRating: number
  responseTime: string
  followerCount?: number
  accountAge: number // in days
}

interface CreatorPersonaProps {
  stats: CreatorStats
}

export function CreatorPersona({ stats }: CreatorPersonaProps) {
  // Determine persona based on stats
  const determinePersona = (): PersonaType => {
    if (stats.accountAge < 30) return 'new'
    if (stats.monthlyEarnings > 10000) return 'celebrity'
    if (stats.followerCount && stats.followerCount > 5000) return 'influencer'
    if (stats.monthlyEarnings > 3000) return 'full-timer'
    return 'part-timer'
  }

  const persona = determinePersona()

  const personaConfig = {
    new: {
      label: 'New Creator',
      icon: Award,
      color: 'bg-blue-500',
      focus: 'Building Reputation',
      metrics: [
        { label: 'Completion Rate', value: '0%', target: '95%' },
        { label: 'First Reviews', value: '0', target: '10' },
        { label: 'Response Time', value: stats.responseTime, target: '<3hr' }
      ],
      tips: [
        'Complete your first video to unlock more features',
        'Respond quickly to build trust with customers',
        'Add a welcome video to your profile'
      ]
    },
    'part-timer': {
      label: 'Part-Time Creator',
      icon: Clock,
      color: 'bg-purple-500',
      focus: 'Extra Income',
      metrics: [
        { label: 'Weekly Earnings', value: `$${Math.round(stats.monthlyEarnings / 4)}`, target: '$500' },
        { label: 'Time to Goal', value: '2 weeks', target: 'On track' },
        { label: 'Efficiency', value: '85%', target: '90%' }
      ],
      tips: [
        'Set up auto-responses for common requests',
        'Batch record similar videos',
        'Schedule specific hours for recordings'
      ]
    },
    'full-timer': {
      label: 'Full-Time Creator',
      icon: TrendingUp,
      color: 'bg-green-500',
      focus: 'Maximize Revenue',
      metrics: [
        { label: 'Monthly Revenue', value: `$${stats.monthlyEarnings}`, target: `$${stats.monthlyEarnings * 1.2}` },
        { label: 'Growth Rate', value: '+15%', target: '+20%' },
        { label: 'Repeat Customers', value: '45%', target: '60%' }
      ],
      tips: [
        'Analyze your best performing video types',
        'Consider premium pricing for rush orders',
        'Build relationships with repeat customers'
      ]
    },
    celebrity: {
      label: 'Celebrity Creator',
      icon: Users,
      color: 'bg-gradient-to-r from-purple-600 to-pink-600',
      focus: 'Brand Management',
      metrics: [
        { label: 'Brand Value', value: `$${stats.monthlyEarnings * 12}`, target: 'Growing' },
        { label: 'Engagement Rate', value: '92%', target: '95%' },
        { label: 'Media Reach', value: '50K+', target: '100K+' }
      ],
      tips: [
        'Consider hiring an assistant for volume',
        'Create exclusive content tiers',
        'Partner with brands for sponsored content'
      ]
    },
    influencer: {
      label: 'Influencer Creator',
      icon: Target,
      color: 'bg-pink-500',
      focus: 'Audience Growth',
      metrics: [
        { label: 'Followers', value: `${stats.followerCount || 0}`, target: `${(stats.followerCount || 0) * 1.5}` },
        { label: 'Share Rate', value: '25%', target: '40%' },
        { label: 'Viral Videos', value: '3', target: '5' }
      ],
      tips: [
        'Create shareable moments in your videos',
        'Cross-promote on social media',
        'Collaborate with other creators'
      ]
    }
  }

  const config = personaConfig[persona]
  const Icon = config.icon

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            Your Creator Journey
          </CardTitle>
          <Badge className={config.color}>
            {config.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">Current Focus</p>
          <p className="font-semibold text-lg">{config.focus}</p>
        </div>

        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Key Metrics</p>
          {config.metrics.map((metric, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{metric.label}</span>
                <span className="font-medium">{metric.value} → {metric.target}</span>
              </div>
              <Progress value={65} className="h-2" />
            </div>
          ))}
        </div>

        <div className="space-y-2 pt-2">
          <p className="text-sm font-medium text-gray-700">Personalized Tips</p>
          {config.tips.map((tip, index) => (
            <div key={index} className="flex items-start gap-2">
              <span className="text-xs mt-1">💡</span>
              <p className="text-sm text-gray-600">{tip}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}