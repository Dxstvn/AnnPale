'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  MessageCircle, 
  Gift, 
  Share2, 
  Star,
  Sparkles,
  TrendingUp,
  Users
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { EngagementLevel } from '@/lib/types/live-streaming';

interface EngagementPrompt {
  id: string;
  type: 'reaction' | 'message' | 'tip' | 'share' | 'follow';
  message: string;
  icon: React.ElementType;
  color: string;
  targetLevel: EngagementLevel;
  delay?: number;
}

interface EngagementPromptsProps {
  currentLevel: EngagementLevel;
  viewerCount?: number;
  isFirstTime?: boolean;
  onAction?: (type: string) => void;
  className?: string;
}

const ENGAGEMENT_PROMPTS: EngagementPrompt[] = [
  {
    id: 'first-reaction',
    type: 'reaction',
    message: 'Double tap to send love! ❤️',
    icon: Heart,
    color: 'text-red-500',
    targetLevel: 1,
    delay: 5000
  },
  {
    id: 'join-chat',
    type: 'message',
    message: 'Say hello in the chat!',
    icon: MessageCircle,
    color: 'text-blue-500',
    targetLevel: 2,
    delay: 30000
  },
  {
    id: 'support-creator',
    type: 'tip',
    message: 'Support with a tip',
    icon: Gift,
    color: 'text-green-500',
    targetLevel: 3,
    delay: 120000
  },
  {
    id: 'share-stream',
    type: 'share',
    message: 'Share with friends',
    icon: Share2,
    color: 'text-purple-500',
    targetLevel: 4,
    delay: 180000
  },
  {
    id: 'follow-creator',
    type: 'follow',
    message: 'Follow for updates',
    icon: Star,
    color: 'text-yellow-500',
    targetLevel: 2,
    delay: 60000
  }
];

export function EngagementPrompts({
  currentLevel,
  viewerCount = 0,
  isFirstTime = false,
  onAction,
  className
}: EngagementPromptsProps) {
  const [visiblePrompt, setVisiblePrompt] = useState<EngagementPrompt | null>(null);
  const [dismissedPrompts, setDismissedPrompts] = useState<Set<string>>(new Set());
  const [shownPrompts, setShownPrompts] = useState<Set<string>>(new Set());

  useEffect(() => {
    const eligiblePrompts = ENGAGEMENT_PROMPTS.filter(
      prompt => 
        prompt.targetLevel <= currentLevel && 
        !dismissedPrompts.has(prompt.id) &&
        !shownPrompts.has(prompt.id)
    );

    if (eligiblePrompts.length === 0) return;

    const prompt = eligiblePrompts[0];
    const timer = setTimeout(() => {
      setVisiblePrompt(prompt);
      setShownPrompts(prev => new Set(prev).add(prompt.id));
    }, prompt.delay || 5000);

    return () => clearTimeout(timer);
  }, [currentLevel, dismissedPrompts, shownPrompts]);

  const handleAction = (prompt: EngagementPrompt) => {
    onAction?.(prompt.type);
    setVisiblePrompt(null);
    setDismissedPrompts(prev => new Set(prev).add(prompt.id));
  };

  const handleDismiss = (prompt: EngagementPrompt) => {
    setVisiblePrompt(null);
    setDismissedPrompts(prev => new Set(prev).add(prompt.id));
  };

  return (
    <>
      <AnimatePresence>
        {visiblePrompt && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn('fixed bottom-24 right-4 z-50', className)}
          >
            <Card className="p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <visiblePrompt.icon className={cn('w-5 h-5', visiblePrompt.color)} />
                <span className="text-sm font-medium">{visiblePrompt.message}</span>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => handleAction(visiblePrompt)}
                >
                  Go
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDismiss(visiblePrompt)}
                >
                  ✕
                </Button>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {isFirstTime && (
        <WelcomeOverlay viewerCount={viewerCount} />
      )}

      <MilestoneNotifications viewerCount={viewerCount} />
    </>
  );
}

function WelcomeOverlay({ viewerCount }: { viewerCount: number }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-x-0 top-20 z-40 flex justify-center"
    >
      <Card className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border-purple-500/20">
        <div className="flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-purple-500" />
          <div>
            <p className="text-sm font-medium">Welcome to the stream!</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              You're watching with {viewerCount} other viewers
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

function MilestoneNotifications({ viewerCount }: { viewerCount: number }) {
  const [milestone, setMilestone] = useState<number | null>(null);

  useEffect(() => {
    const milestones = [10, 25, 50, 100, 250, 500, 1000];
    const reached = milestones.find(m => viewerCount >= m && viewerCount < m * 1.1);
    
    if (reached && reached !== milestone) {
      setMilestone(reached);
      setTimeout(() => setMilestone(null), 5000);
    }
  }, [viewerCount, milestone]);

  if (!milestone) return null;

  return (
    <motion.div
      initial={{ scale: 0, rotate: -10 }}
      animate={{ scale: 1, rotate: 0 }}
      exit={{ scale: 0, rotate: 10 }}
      className="fixed top-32 left-1/2 transform -translate-x-1/2 z-50"
    >
      <Card className="p-6 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="text-center">
          <Users className="w-8 h-8 mx-auto mb-2" />
          <p className="text-2xl font-bold">{milestone} Viewers!</p>
          <p className="text-sm opacity-90">Milestone reached</p>
        </div>
      </Card>
    </motion.div>
  );
}