'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Crown,
  Star,
  Sparkles,
  Gift,
  CheckCircle,
  ArrowRight,
  Video,
  MessageSquare,
  Users,
  Heart,
  Award,
  Bell,
  BookOpen,
  PlayCircle,
  Unlock,
  TrendingUp,
  Zap,
  PartyPopper,
  ThumbsUp,
  Calendar,
  Mail,
  Settings,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface NewFeature {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  tutorialUrl?: string;
  quickAction?: {
    label: string;
    action: string;
  };
  completed?: boolean;
}

interface WelcomeStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  action?: {
    label: string;
    url?: string;
    onClick?: () => void;
  };
  completed?: boolean;
  estimated_time?: string;
}

interface CommunityAnnouncement {
  id: string;
  type: 'upgrade' | 'milestone' | 'achievement';
  message: string;
  visibility: 'private' | 'friends' | 'public';
  reactions?: number;
  timestamp: Date;
}

interface PostUpgradeExperienceProps {
  newTier?: string;
  previousTier?: string;
  userName?: string;
  incentiveUsed?: string;
  newFeatures?: NewFeature[];
  welcomeSteps?: WelcomeStep[];
  onFeatureExplore?: (featureId: string) => void;
  onStepComplete?: (stepId: string) => void;
  onTutorialStart?: (tutorialUrl: string) => void;
  onCommunityShare?: (announcement: CommunityAnnouncement) => void;
  onSatisfactionFeedback?: (rating: number) => void;
  showCommunityFeatures?: boolean;
}

export function PostUpgradeExperience({
  newTier = 'silver',
  previousTier = 'bronze',
  userName = 'User',
  incentiveUsed,
  newFeatures = [],
  welcomeSteps = [],
  onFeatureExplore,
  onStepComplete,
  onTutorialStart,
  onCommunityShare,
  onSatisfactionFeedback,
  showCommunityFeatures = true
}: PostUpgradeExperienceProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [completedSteps, setCompletedSteps] = React.useState<Set<string>>(new Set());
  const [completedFeatures, setCompletedFeatures] = React.useState<Set<string>>(new Set());
  const [showSatisfactionSurvey, setShowSatisfactionSurvey] = React.useState(false);
  const [satisfactionRating, setSatisfactionRating] = React.useState<number | null>(null);
  // Use a stable time reference to avoid hydration mismatch
  const [currentTime] = React.useState(() => Date.now());

  // Default new features based on tier upgrade
  const defaultNewFeatures: NewFeature[] = newFeatures.length > 0 ? newFeatures : [
    {
      id: 'unlimited_videos',
      name: 'Unlimited Video Access',
      description: 'Watch as many videos as you want, no monthly limits',
      icon: Video,
      color: 'from-blue-400 to-blue-600',
      quickAction: {
        label: 'Browse Videos',
        action: '/videos'
      }
    },
    {
      id: 'direct_messaging',
      name: 'Direct Messaging',
      description: 'Send private messages directly to your favorite creators',
      icon: MessageSquare,
      color: 'from-green-400 to-green-600',
      tutorialUrl: '/tutorials/messaging',
      quickAction: {
        label: 'Send Message',
        action: '/messages/new'
      }
    },
    {
      id: 'exclusive_content',
      name: 'Exclusive Content Library',
      description: 'Access premium content only available to Silver+ subscribers',
      icon: Star,
      color: 'from-purple-400 to-purple-600',
      quickAction: {
        label: 'Explore Library',
        action: '/exclusive'
      }
    },
    {
      id: 'live_events',
      name: 'Unlimited Live Events',
      description: 'Join all live streams and interactive sessions',
      icon: Users,
      color: 'from-red-400 to-red-600',
      quickAction: {
        label: 'View Schedule',
        action: '/live'
      }
    },
    {
      id: 'priority_support',
      name: 'Priority Support',
      description: 'Get faster response times and dedicated support',
      icon: Heart,
      color: 'from-pink-400 to-pink-600',
      quickAction: {
        label: 'Contact Support',
        action: '/support'
      }
    }
  ];

  // Default welcome steps
  const defaultWelcomeSteps: WelcomeStep[] = welcomeSteps.length > 0 ? welcomeSteps : [
    {
      id: 'welcome_message',
      title: `Welcome to ${newTier.toUpperCase()} Tier!`,
      description: 'Learn about your new benefits and features',
      icon: Crown,
      estimated_time: '2 min'
    },
    {
      id: 'feature_tutorial',
      title: 'Feature Tutorial',
      description: 'Quick walkthrough of your new capabilities',
      icon: BookOpen,
      action: {
        label: 'Start Tutorial',
        onClick: () => onTutorialStart?.('/tutorials/silver-features')
      },
      estimated_time: '5 min'
    },
    {
      id: 'benefit_activation',
      title: 'Activate Your Benefits',
      description: 'Set up notifications and preferences for new features',
      icon: Bell,
      action: {
        label: 'Configure',
        url: '/settings/notifications'
      },
      estimated_time: '3 min'
    },
    {
      id: 'community_announcement',
      title: 'Share Your Upgrade',
      description: 'Let the community know about your tier upgrade',
      icon: Users,
      action: {
        label: 'Share',
        onClick: () => handleCommunityShare()
      },
      estimated_time: '1 min'
    },
    {
      id: 'satisfaction_check',
      title: 'How Are We Doing?',
      description: 'Quick feedback on your upgrade experience',
      icon: ThumbsUp,
      action: {
        label: 'Give Feedback',
        onClick: () => setShowSatisfactionSurvey(true)
      },
      estimated_time: '1 min'
    }
  ];

  // Handle step completion
  const handleStepComplete = (stepId: string) => {
    setCompletedSteps(prev => new Set([...prev, stepId]));
    onStepComplete?.(stepId);
    
    // Move to next step if this was the current step
    const stepIndex = defaultWelcomeSteps.findIndex(step => step.id === stepId);
    if (stepIndex === currentStep && stepIndex < defaultWelcomeSteps.length - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  // Handle feature exploration
  const handleFeatureExplore = (featureId: string) => {
    setCompletedFeatures(prev => new Set([...prev, featureId]));
    onFeatureExplore?.(featureId);
  };

  // Handle community sharing
  const handleCommunityShare = () => {
    const announcement: CommunityAnnouncement = {
      id: `upgrade_${Date.now()}`,
      type: 'upgrade',
      message: `🎉 Just upgraded to ${newTier.toUpperCase()} tier! Excited to explore all the new features!`,
      visibility: 'friends',
      timestamp: new Date(currentTime)
    };
    onCommunityShare?.(announcement);
    handleStepComplete('community_announcement');
  };

  // Handle satisfaction feedback
  const handleSatisfactionSubmit = (rating: number) => {
    setSatisfactionRating(rating);
    onSatisfactionFeedback?.(rating);
    setShowSatisfactionSurvey(false);
    handleStepComplete('satisfaction_check');
  };

  // Get tier icon
  const getTierIcon = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'silver': return Star;
      case 'gold': return Crown;
      default: return Award;
    }
  };

  // Get tier color
  const getTierColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'silver': return 'from-slate-400 to-slate-600';
      case 'gold': return 'from-yellow-400 to-yellow-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  const TierIcon = getTierIcon(newTier);
  const completedStepsCount = completedSteps.size;
  const totalSteps = defaultWelcomeSteps.length;
  const progressPercentage = (completedStepsCount / totalSteps) * 100;

  return (
    <div className="space-y-6">
      {/* Celebration Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={cn(
          "bg-gradient-to-r border-0 text-white relative overflow-hidden",
          getTierColor(newTier)
        )}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          <CardContent className="p-8 relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <motion.div
                  initial={{ rotate: -10, scale: 0.8 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center"
                >
                  <TierIcon className="h-10 w-10 text-white" />
                </motion.div>
                <div>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold mb-2"
                  >
                    🎉 Congratulations, {userName}!
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg opacity-90"
                  >
                    You've successfully upgraded to {newTier.toUpperCase()} tier
                  </motion.p>
                  {incentiveUsed && (
                    <motion.p
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="text-sm opacity-75 mt-1"
                    >
                      Applied incentive: {incentiveUsed}
                    </motion.p>
                  )}
                </div>
              </div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="text-6xl"
              >
                🎊
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Welcome Journey Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">
              {completedStepsCount} of {totalSteps} steps completed
            </span>
            <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2 mb-4" />
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-green-600">{defaultNewFeatures.length}</p>
              <p className="text-sm text-gray-600">New Features</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{completedFeatures.size}</p>
              <p className="text-sm text-gray-600">Features Explored</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {totalSteps - completedStepsCount}
              </p>
              <p className="text-sm text-gray-600">Steps Remaining</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* New Features Showcase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Your New {newTier.toUpperCase()} Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {defaultNewFeatures.map((feature, index) => {
              const Icon = feature.icon;
              const isExplored = completedFeatures.has(feature.id);

              return (
                <motion.div
                  key={feature.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={cn(
                    "transition-all cursor-pointer",
                    isExplored ? "border-green-300 bg-green-50" : "hover:shadow-md"
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={cn(
                          "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                          feature.color
                        )}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold flex items-center gap-2">
                            {feature.name}
                            {isExplored && (
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            )}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        {feature.quickAction && (
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={() => handleFeatureExplore(feature.id)}
                          >
                            <PlayCircle className="h-4 w-4 mr-1" />
                            {feature.quickAction.label}
                          </Button>
                        )}
                        {feature.tutorialUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onTutorialStart?.(feature.tutorialUrl)}
                          >
                            <BookOpen className="h-4 w-4 mr-1" />
                            Tutorial
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Welcome Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Getting Started Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {defaultWelcomeSteps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = completedSteps.has(step.id);
              const isCurrent = index === currentStep;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-lg border transition-all",
                    isCompleted && "bg-green-50 border-green-200",
                    isCurrent && !isCompleted && "bg-blue-50 border-blue-200",
                    !isCompleted && !isCurrent && "bg-gray-50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    isCompleted ? "bg-green-100" : isCurrent ? "bg-blue-100" : "bg-gray-100"
                  )}>
                    {isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Icon className={cn(
                        "h-5 w-5",
                        isCurrent ? "text-blue-600" : "text-gray-600"
                      )} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-semibold">{step.title}</h4>
                    <p className="text-sm text-gray-600">{step.description}</p>
                    {step.estimated_time && (
                      <p className="text-xs text-gray-500 mt-1">
                        Estimated time: {step.estimated_time}
                      </p>
                    )}
                  </div>
                  
                  {!isCompleted && step.action && (
                    <Button
                      size="sm"
                      onClick={() => {
                        if (step.action?.onClick) {
                          step.action.onClick();
                        } else if (step.action?.url) {
                          window.open(step.action.url, '_blank');
                          handleStepComplete(step.id);
                        }
                      }}
                    >
                      {step.action.label}
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                  
                  {!isCompleted && !step.action && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStepComplete(step.id)}
                    >
                      Mark Complete
                    </Button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Satisfaction Survey Modal */}
      <AnimatePresence>
        {showSatisfactionSurvey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowSatisfactionSurvey(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="w-96">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ThumbsUp className="h-5 w-5" />
                    How's Your Upgrade Experience?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    Rate your upgrade experience from 1 to 5 stars
                  </p>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Button
                        key={rating}
                        variant="outline"
                        size="sm"
                        className={cn(
                          "w-12 h-12",
                          satisfactionRating === rating && "bg-yellow-100 border-yellow-300"
                        )}
                        onClick={() => setSatisfactionRating(rating)}
                      >
                        <Star className={cn(
                          "h-5 w-5",
                          (satisfactionRating && rating <= satisfactionRating) ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                        )} />
                      </Button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => satisfactionRating && handleSatisfactionSubmit(satisfactionRating)}
                      disabled={!satisfactionRating}
                    >
                      Submit Feedback
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowSatisfactionSurvey(false)}
                    >
                      Skip
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Celebration */}
      <AnimatePresence>
        {completedStepsCount === totalSteps && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="border-green-300 bg-gradient-to-r from-green-50 to-emerald-50">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PartyPopper className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Welcome Journey Complete! 🎉
                </h3>
                <p className="text-green-700 mb-4">
                  You're all set up and ready to enjoy your {newTier.toUpperCase()} tier benefits. 
                  Welcome to the community!
                </p>
                <Button className="bg-green-600 hover:bg-green-700">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Start Exploring
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}