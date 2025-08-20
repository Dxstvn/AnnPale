"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Sparkles, 
  Heart, 
  Target, 
  AlertCircle, 
  TrendingUp,
  Award,
  BookOpen,
  Users,
  Lightbulb,
  HelpCircle
} from "lucide-react"
import { cn } from "@/lib/utils"

export type EmotionalStage = 'onboarding' | 'first-request' | 'growing' | 'busy' | 'plateau' | 'success'

interface EmotionalJourneyProps {
  stage: EmotionalStage
  stats: {
    completedVideos: number
    pendingRequests: number
    monthlyEarnings: number
    averageRating: number
    accountAge: number // days
  }
  onAction?: (action: string) => void
}

export function EmotionalJourney({ stage, stats, onAction }: EmotionalJourneyProps) {
  const journeyConfig = {
    onboarding: {
      emotion: 'Anxious',
      emotionIcon: HelpCircle,
      emotionColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      title: 'Welcome to Your Creator Journey! 🎉',
      subtitle: "Let's get you started with confidence",
      progressLabel: 'Setup Progress',
      progressValue: 25,
      needs: [
        {
          label: 'Profile Setup',
          status: 'in-progress',
          action: 'Complete Profile',
          icon: BookOpen
        },
        {
          label: 'First Video',
          status: 'pending',
          action: 'Record Sample',
          icon: Award
        },
        {
          label: 'Payment Setup',
          status: 'pending',
          action: 'Add Bank Account',
          icon: Target
        }
      ],
      tips: {
        title: 'Getting Started Tips',
        items: [
          'Watch our 5-minute creator success guide',
          'Set your initial price 20% below average to build reviews',
          'Add a personal welcome video to your profile'
        ]
      },
      celebration: null
    },
    'first-request': {
      emotion: 'Excited',
      emotionIcon: Sparkles,
      emotionColor: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      title: 'Your First Request! 🌟',
      subtitle: 'This is an exciting milestone',
      progressLabel: 'Request Progress',
      progressValue: 50,
      needs: [
        {
          label: 'Review Request',
          status: 'completed',
          icon: BookOpen
        },
        {
          label: 'Record Video',
          status: 'in-progress',
          action: 'Start Recording',
          icon: Award
        },
        {
          label: 'Deliver & Celebrate',
          status: 'pending',
          icon: Heart
        }
      ],
      tips: {
        title: 'First Video Best Practices',
        items: [
          'Take your time - quality matters more than speed',
          'Use good lighting and clear audio',
          'Be authentic and personable',
          'Include a thank you for being your first customer'
        ]
      },
      celebration: 'Completing your first video unlocks advanced features!'
    },
    growing: {
      emotion: 'Motivated',
      emotionIcon: TrendingUp,
      emotionColor: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      title: 'You\'re Growing Fast! 📈',
      subtitle: 'Keep up the momentum',
      progressLabel: 'Growth Metrics',
      progressValue: 70,
      needs: [
        {
          label: 'Weekly Goal',
          status: 'in-progress',
          action: 'View Progress',
          icon: Target
        },
        {
          label: 'Quality Score',
          status: 'completed',
          icon: Award
        },
        {
          label: 'Next Milestone',
          status: 'pending',
          action: 'See Rewards',
          icon: Sparkles
        }
      ],
      tips: {
        title: 'Growth Optimization',
        items: [
          `You're averaging ${stats.averageRating} stars - keep it up!`,
          'Consider raising your price by 10-15%',
          'Your best performing day is Thursday',
          'Enable quick responses for 20% more bookings'
        ]
      },
      celebration: `${stats.completedVideos} videos completed! You're on fire!`
    },
    busy: {
      emotion: 'Overwhelmed',
      emotionIcon: AlertCircle,
      emotionColor: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      title: 'High Demand Period! ⚡',
      subtitle: 'Let\'s help you manage the volume',
      progressLabel: 'Workload',
      progressValue: 90,
      needs: [
        {
          label: 'Batch Recording',
          status: 'pending',
          action: 'Group Similar',
          icon: Users
        },
        {
          label: 'Quick Templates',
          status: 'pending',
          action: 'Create Templates',
          icon: Lightbulb
        },
        {
          label: 'Auto-Responses',
          status: 'pending',
          action: 'Setup Auto-Reply',
          icon: Target
        }
      ],
      tips: {
        title: 'Efficiency Tools',
        items: [
          `You have ${stats.pendingRequests} requests - batch similar ones`,
          'Set "busy mode" to manage expectations',
          'Use voice-to-text for faster messaging',
          'Consider a 24-48 hour turnaround time'
        ]
      },
      celebration: null
    },
    plateau: {
      emotion: 'Concerned',
      emotionIcon: AlertCircle,
      emotionColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      title: 'Time to Shake Things Up! 🚀',
      subtitle: 'New strategies for continued growth',
      progressLabel: 'Revival Progress',
      progressValue: 40,
      needs: [
        {
          label: 'Profile Refresh',
          status: 'pending',
          action: 'Update Profile',
          icon: Sparkles
        },
        {
          label: 'New Offerings',
          status: 'pending',
          action: 'Add Services',
          icon: Lightbulb
        },
        {
          label: 'Marketing Push',
          status: 'pending',
          action: 'Promote',
          icon: TrendingUp
        }
      ],
      tips: {
        title: 'Growth Recommendations',
        items: [
          'Try offering themed videos for upcoming holidays',
          'Partner with other creators for cross-promotion',
          'Share success stories on social media',
          'Offer a limited-time discount to boost bookings'
        ]
      },
      celebration: null
    },
    success: {
      emotion: 'Confident',
      emotionIcon: Award,
      emotionColor: 'text-pink-600',
      bgColor: 'bg-gradient-to-r from-purple-50 to-pink-50',
      borderColor: 'border-pink-200',
      title: 'Top Creator Status! 👑',
      subtitle: 'You\'ve mastered the platform',
      progressLabel: 'Excellence Score',
      progressValue: 95,
      needs: [
        {
          label: 'Mentor Others',
          status: 'pending',
          action: 'Join Program',
          icon: Users
        },
        {
          label: 'Premium Tier',
          status: 'completed',
          icon: Award
        },
        {
          label: 'Brand Deals',
          status: 'in-progress',
          action: 'View Opportunities',
          icon: Sparkles
        }
      ],
      tips: {
        title: 'Advanced Strategies',
        items: [
          `$${stats.monthlyEarnings} this month - your best yet!`,
          'Consider hiring an assistant for admin tasks',
          'Explore exclusive partnership opportunities',
          'Your content could be featured in our marketing'
        ]
      },
      celebration: 'You\'re in the top 5% of creators!'
    }
  }

  const config = journeyConfig[stage]
  const EmotionIcon = config.emotionIcon

  return (
    <Card className={cn("overflow-hidden", config.borderColor)}>
      <div className={cn("h-2", config.bgColor)} />
      <CardHeader className={config.bgColor}>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl">{config.title}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{config.subtitle}</p>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <EmotionIcon className={cn("h-3 w-3", config.emotionColor)} />
            {config.emotion}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">{config.progressLabel}</span>
            <span className="font-medium">{config.progressValue}%</span>
          </div>
          <Progress value={config.progressValue} className="h-2" />
        </div>

        {/* Current Needs */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">Your Focus Areas</h3>
          <div className="space-y-2">
            {config.needs.map((need, index) => {
              const NeedIcon = need.icon
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <NeedIcon className={cn(
                      "h-4 w-4",
                      need.status === 'completed' && "text-green-600",
                      need.status === 'in-progress' && "text-blue-600",
                      need.status === 'pending' && "text-gray-400"
                    )} />
                    <span className="text-sm font-medium">{need.label}</span>
                    {need.status === 'completed' && (
                      <Badge variant="outline" className="text-xs bg-green-50">Done</Badge>
                    )}
                    {need.status === 'in-progress' && (
                      <Badge variant="outline" className="text-xs bg-blue-50">Active</Badge>
                    )}
                  </div>
                  {need.action && need.status !== 'completed' && (
                    <Button 
                      size="sm" 
                      variant="ghost"
                      className="h-7 text-xs"
                      onClick={() => onAction?.(need.action)}
                    >
                      {need.action}
                    </Button>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Contextual Tips */}
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            {config.tips.title}
          </h3>
          <ul className="space-y-1">
            {config.tips.items.map((tip, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start gap-1">
                <span className="text-purple-500 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Celebration Message */}
        {config.celebration && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 text-center">
            <p className="text-sm font-medium text-purple-900">🎉 {config.celebration}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}