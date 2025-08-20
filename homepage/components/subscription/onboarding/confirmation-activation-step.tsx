'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle,
  Star,
  Crown,
  Shield,
  Video,
  Users,
  Calendar,
  Gift,
  MessageSquare,
  Play,
  ArrowRight,
  Sparkles,
  Heart,
  Trophy,
  Zap,
  Download,
  Bell,
  BookOpen,
  Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface ConfirmationActivationStepProps {
  onComplete?: () => void;
  onExplore?: () => void;
  tierName?: string;
  tierIcon?: React.ElementType;
  creatorName?: string;
}

export function ConfirmationActivationStep({
  onComplete,
  onExplore,
  tierName = 'Silver',
  tierIcon,
  creatorName = 'Creator'
}: ConfirmationActivationStepProps) {
  const [activationProgress, setActivationProgress] = React.useState(0);
  const [checklistCompleted, setChecklistCompleted] = React.useState<string[]>([]);

  // Trigger confetti on mount
  React.useEffect(() => {
    const timer = setTimeout(() => {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Simulate activation progress
  React.useEffect(() => {
    const interval = setInterval(() => {
      setActivationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 20;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Get tier icon
  const TierIcon = tierIcon || (
    tierName === 'Bronze' ? Shield :
    tierName === 'Silver' ? Star :
    Crown
  );

  // Immediate benefits based on tier
  const immediateBenefits = {
    Bronze: [
      { icon: Video, text: 'Access to this month\'s exclusive video' },
      { icon: Users, text: 'Join the community forum' },
      { icon: Shield, text: 'Bronze badge activated' },
      { icon: Gift, text: '10% merchandise discount applied' }
    ],
    Silver: [
      { icon: Video, text: 'Access to 4 exclusive videos' },
      { icon: Zap, text: 'Live stream access unlocked' },
      { icon: MessageSquare, text: '5 direct messages ready' },
      { icon: Star, text: 'Silver VIP badge activated' },
      { icon: Gift, text: '20% merchandise discount applied' }
    ],
    Gold: [
      { icon: Video, text: 'Access to entire video library' },
      { icon: Crown, text: 'VIP live stream room access' },
      { icon: MessageSquare, text: 'Unlimited direct messages' },
      { icon: Trophy, text: 'Gold VIP badge activated' },
      { icon: Calendar, text: 'Video call scheduled for next quarter' },
      { icon: Gift, text: '30% merchandise discount + surprise gift coming' }
    ]
  };

  // Onboarding checklist
  const onboardingChecklist = [
    {
      id: 'watch-welcome',
      title: 'Watch welcome video',
      description: 'Personal message from ' + creatorName,
      icon: Play,
      action: 'Watch Now'
    },
    {
      id: 'join-community',
      title: 'Join the community',
      description: 'Introduce yourself to other members',
      icon: Users,
      action: 'Join Forum'
    },
    {
      id: 'first-content',
      title: 'Explore exclusive content',
      description: 'Browse your unlocked videos',
      icon: Video,
      action: 'Browse'
    },
    {
      id: 'customize-profile',
      title: 'Customize your profile',
      description: 'Add your photo and bio',
      icon: Heart,
      action: 'Edit Profile'
    },
    {
      id: 'notifications',
      title: 'Set up notifications',
      description: 'Never miss new content',
      icon: Bell,
      action: 'Configure'
    }
  ];

  // Upcoming content
  const upcomingContent = [
    { type: 'video', title: 'Behind the Scenes Part 2', date: 'Tomorrow', icon: Video },
    { type: 'live', title: 'Members-Only Q&A', date: 'Friday 8PM', icon: Zap },
    { type: 'post', title: 'Personal Story Time', date: 'This Weekend', icon: BookOpen }
  ];

  const handleChecklistItem = (itemId: string) => {
    setChecklistCompleted(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const checklistProgress = (checklistCompleted.length / onboardingChecklist.length) * 100;

  return (
    <div className="space-y-6">
      {/* Success Message */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to the Community! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Your {tierName} membership is now active
            </p>
            
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className={cn(
                "w-12 h-12 rounded-full bg-gradient-to-r flex items-center justify-center",
                tierName === 'Bronze' ? 'from-orange-400 to-orange-600' :
                tierName === 'Silver' ? 'from-gray-400 to-gray-600' :
                'from-yellow-400 to-yellow-600'
              )}>
                <TierIcon className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <div className="font-semibold">{tierName} Member</div>
                <div className="text-sm text-gray-600">ID: #MB{Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
              </div>
            </div>
            
            <Badge className="bg-purple-100 text-purple-700 text-sm px-4 py-2">
              <Sparkles className="h-4 w-4 mr-2" />
              Full Access Granted
            </Badge>
          </CardContent>
        </Card>
      </motion.div>

      {/* Activation Progress */}
      {activationProgress < 100 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Activating your benefits...</span>
              <span className="text-sm text-gray-600">{activationProgress}%</span>
            </div>
            <Progress value={activationProgress} className="h-2" />
          </CardContent>
        </Card>
      )}

      {/* Immediate Benefits */}
      {activationProgress === 100 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Your Benefits Are Now Active
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {immediateBenefits[tierName as keyof typeof immediateBenefits].map((benefit, idx) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * idx }}
                      className="flex items-center gap-3 p-3 bg-green-50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-green-600" />
                      </div>
                      <span className="text-sm font-medium">{benefit.text}</span>
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Onboarding Checklist */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Get Started Checklist</span>
            <Badge variant="secondary">
              {checklistCompleted.length}/{onboardingChecklist.length} Complete
            </Badge>
          </CardTitle>
          <Progress value={checklistProgress} className="h-2 mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {onboardingChecklist.map((item) => {
              const Icon = item.icon;
              const isCompleted = checklistCompleted.includes(item.id);
              
              return (
                <div
                  key={item.id}
                  className={cn(
                    "flex items-center justify-between p-3 rounded-lg border transition-all",
                    isCompleted ? "bg-green-50 border-green-200" : "hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      isCompleted ? "bg-green-100" : "bg-gray-100"
                    )}>
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <Icon className="h-5 w-5 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <div className={cn(
                        "font-medium text-sm",
                        isCompleted && "line-through text-gray-500"
                      )}>
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-600">{item.description}</div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant={isCompleted ? "ghost" : "outline"}
                    onClick={() => handleChecklistItem(item.id)}
                  >
                    {isCompleted ? "Done" : item.action}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Coming Soon For You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingContent.map((content, idx) => {
              const Icon = content.icon;
              return (
                <div key={idx} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">{content.title}</div>
                      <div className="text-xs text-gray-600">{content.date}</div>
                    </div>
                  </div>
                  <Badge variant="secondary">
                    <Bell className="h-3 w-3 mr-1" />
                    Reminder Set
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Creator Welcome Message */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-2xl font-bold text-purple-700">
                {creatorName[0]}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Personal Message from {creatorName}</h3>
              <p className="text-sm text-gray-700 italic">
                "Welcome to our exclusive community! I'm so excited to have you here. 
                As a {tierName} member, you're getting access to content I don't share 
                anywhere else. Check out the welcome video I made just for new members, 
                and don't hesitate to reach out if you have any questions. Can't wait 
                to connect with you!"
              </p>
              <Button className="mt-3" size="sm">
                <Play className="h-4 w-4 mr-2" />
                Watch Welcome Video
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button 
          size="lg"
          variant="outline"
          onClick={() => window.location.href = '/account/subscription'}
        >
          <Download className="h-5 w-5 mr-2" />
          Download Receipt
        </Button>
        <Button 
          size="lg"
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          onClick={onExplore}
        >
          Start Exploring
          <ArrowRight className="h-5 w-5 ml-2" />
        </Button>
      </div>

      {/* Tutorial Prompt */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-medium text-sm">Want a quick tour?</p>
                <p className="text-xs text-gray-600">Learn how to make the most of your membership</p>
              </div>
            </div>
            <Button size="sm" variant="secondary">
              Start Tutorial
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}