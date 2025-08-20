'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Trophy,
  Gift,
  Star,
  Heart,
  MessageCircle,
  Share2,
  Clock,
  Users,
  Zap,
  Lock,
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Reward {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  requirement: string;
  progress: number;
  unlocked: boolean;
  claimed: boolean;
  type: 'achievement' | 'milestone' | 'special';
  points: number;
}

interface EngagementRewardsProps {
  viewerScore: number;
  watchTime: number;
  interactions: {
    reactions: number;
    messages: number;
    tips: number;
    shares: number;
  };
  onClaimReward?: (rewardId: string) => void;
  className?: string;
}

export function EngagementRewards({
  viewerScore,
  watchTime,
  interactions,
  onClaimReward,
  className
}: EngagementRewardsProps) {
  const [rewards, setRewards] = useState<Reward[]>([
    {
      id: 'first-reaction',
      name: 'First Love',
      description: 'Send your first reaction',
      icon: Heart,
      requirement: '1 reaction',
      progress: Math.min(100, interactions.reactions * 100),
      unlocked: interactions.reactions >= 1,
      claimed: false,
      type: 'achievement',
      points: 10
    },
    {
      id: 'chat-starter',
      name: 'Conversation Starter',
      description: 'Send 5 chat messages',
      icon: MessageCircle,
      requirement: '5 messages',
      progress: Math.min(100, (interactions.messages / 5) * 100),
      unlocked: interactions.messages >= 5,
      claimed: false,
      type: 'achievement',
      points: 25
    },
    {
      id: 'supporter',
      name: 'True Supporter',
      description: 'Send your first tip',
      icon: Gift,
      requirement: '1 tip',
      progress: Math.min(100, interactions.tips * 100),
      unlocked: interactions.tips >= 1,
      claimed: false,
      type: 'achievement',
      points: 50
    },
    {
      id: 'watch-30',
      name: 'Dedicated Viewer',
      description: 'Watch for 30 minutes',
      icon: Clock,
      requirement: '30 minutes',
      progress: Math.min(100, (watchTime / 1800) * 100),
      unlocked: watchTime >= 1800,
      claimed: false,
      type: 'milestone',
      points: 30
    },
    {
      id: 'sharer',
      name: 'Stream Promoter',
      description: 'Share the stream',
      icon: Share2,
      requirement: '1 share',
      progress: Math.min(100, interactions.shares * 100),
      unlocked: interactions.shares >= 1,
      claimed: false,
      type: 'achievement',
      points: 20
    },
    {
      id: 'super-fan',
      name: 'Super Fan',
      description: 'Reach 100 engagement points',
      icon: Star,
      requirement: '100 points',
      progress: Math.min(100, viewerScore),
      unlocked: viewerScore >= 100,
      claimed: false,
      type: 'special',
      points: 100
    }
  ]);

  const [showAnimation, setShowAnimation] = useState<string | null>(null);

  const handleClaimReward = (rewardId: string) => {
    setRewards(prev => prev.map(reward => 
      reward.id === rewardId 
        ? { ...reward, claimed: true }
        : reward
    ));
    setShowAnimation(rewardId);
    setTimeout(() => setShowAnimation(null), 2000);
    onClaimReward?.(rewardId);
  };

  const totalPoints = rewards
    .filter(r => r.claimed)
    .reduce((sum, r) => sum + r.points, 0);

  const availableRewards = rewards.filter(r => r.unlocked && !r.claimed);
  const completedRewards = rewards.filter(r => r.claimed);
  const lockedRewards = rewards.filter(r => !r.unlocked);

  return (
    <div className={cn('space-y-4', className)}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Engagement Rewards
              </CardTitle>
              <CardDescription>
                Earn rewards by engaging with the stream
              </CardDescription>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{totalPoints}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Points</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4 text-sm">
              <span className="flex items-center gap-1">
                <Badge variant="default">{availableRewards.length}</Badge>
                Available
              </span>
              <span className="flex items-center gap-1">
                <Badge variant="secondary">{completedRewards.length}</Badge>
                Completed
              </span>
              <span className="flex items-center gap-1">
                <Badge variant="outline">{lockedRewards.length}</Badge>
                Locked
              </span>
            </div>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {rewards.map((reward) => (
                <RewardCard
                  key={reward.id}
                  reward={reward}
                  onClaim={() => handleClaimReward(reward.id)}
                  showAnimation={showAnimation === reward.id}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <RewardNotifications rewards={availableRewards} />
    </div>
  );
}

function RewardCard({ 
  reward, 
  onClaim, 
  showAnimation 
}: { 
  reward: Reward; 
  onClaim: () => void;
  showAnimation: boolean;
}) {
  const Icon = reward.icon;
  const typeColors = {
    achievement: 'from-blue-500 to-purple-500',
    milestone: 'from-green-500 to-emerald-500',
    special: 'from-yellow-500 to-orange-500'
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative"
    >
      <AnimatePresence>
        {showAnimation && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [1, 1.5, 1], opacity: [1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
          >
            <Zap className="w-12 h-12 text-yellow-500" />
          </motion.div>
        )}
      </AnimatePresence>

      <Card className={cn(
        'transition-all',
        reward.unlocked && !reward.claimed && 'ring-2 ring-green-500 shadow-lg',
        reward.claimed && 'opacity-75'
      )}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className={cn(
              'p-2 rounded-full bg-gradient-to-r',
              typeColors[reward.type],
              !reward.unlocked && 'opacity-50 grayscale'
            )}>
              {reward.unlocked ? (
                reward.claimed ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <Icon className="w-5 h-5 text-white" />
                )
              ) : (
                <Lock className="w-5 h-5 text-white" />
              )}
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium">{reward.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {reward.description}
                  </p>
                </div>
                <Badge variant="outline">+{reward.points} pts</Badge>
              </div>

              {!reward.unlocked && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      {reward.requirement}
                    </span>
                    <span>{reward.progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={reward.progress} className="h-1.5" />
                </div>
              )}

              {reward.unlocked && !reward.claimed && (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={onClaim}
                >
                  Claim Reward
                </Button>
              )}

              {reward.claimed && (
                <Badge className="w-full justify-center" variant="secondary">
                  Claimed ✓
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function RewardNotifications({ rewards }: { rewards: Reward[] }) {
  const [shown, setShown] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newRewards = rewards.filter(r => !shown.has(r.id));
    if (newRewards.length > 0) {
      const reward = newRewards[0];
      setShown(prev => new Set(prev).add(reward.id));
    }
  }, [rewards, shown]);

  const currentReward = rewards.find(r => !shown.has(r.id));

  if (!currentReward) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="fixed bottom-4 left-4 z-40"
    >
      <Card className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/20">
        <div className="flex items-center gap-3">
          <Trophy className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm font-medium">Reward Unlocked!</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {currentReward.name} is ready to claim
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}