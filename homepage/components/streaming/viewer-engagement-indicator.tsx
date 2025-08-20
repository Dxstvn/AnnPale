'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { EngagementLevel, ENGAGEMENT_PYRAMID } from '@/lib/types/live-streaming';
import { 
  Flame,
  TrendingUp,
  Award,
  Crown,
  Zap
} from 'lucide-react';

interface ViewerEngagementIndicatorProps {
  level: EngagementLevel;
  score: number;
  streak?: number;
  showDetails?: boolean;
  compact?: boolean;
  className?: string;
}

const levelIcons: Record<EngagementLevel, React.ElementType> = {
  1: Zap,
  2: Flame,
  3: TrendingUp,
  4: Award,
  5: Crown
};

const levelColors: Record<EngagementLevel, string> = {
  1: 'from-gray-400 to-gray-500',
  2: 'from-blue-400 to-blue-500',
  3: 'from-green-400 to-green-500',
  4: 'from-purple-400 to-purple-500',
  5: 'from-yellow-400 to-yellow-500'
};

export function ViewerEngagementIndicator({
  level,
  score,
  streak = 0,
  showDetails = true,
  compact = false,
  className
}: ViewerEngagementIndicatorProps) {
  const [previousLevel, setPreviousLevel] = useState(level);
  const [isLevelUp, setIsLevelUp] = useState(false);
  const [progressToNext, setProgressToNext] = useState(0);

  const levelInfo = ENGAGEMENT_PYRAMID[level - 1];
  const Icon = levelIcons[level];
  const gradient = levelColors[level];

  useEffect(() => {
    if (level > previousLevel) {
      setIsLevelUp(true);
      setTimeout(() => setIsLevelUp(false), 3000);
    }
    setPreviousLevel(level);
  }, [level, previousLevel]);

  useEffect(() => {
    const thresholds = [0, 10, 30, 60, 100];
    const currentThreshold = thresholds[level - 1];
    const nextThreshold = thresholds[level] || 100;
    
    const progress = ((score - currentThreshold) / (nextThreshold - currentThreshold)) * 100;
    setProgressToNext(Math.min(100, Math.max(0, progress)));
  }, [score, level]);

  if (compact) {
    return (
      <div className={cn('inline-flex items-center gap-2', className)}>
        <div className={cn(
          'p-1.5 rounded-full bg-gradient-to-r',
          gradient
        )}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-medium">Level {level}</span>
        {streak > 0 && (
          <Badge variant="secondary" className="text-xs">
            {streak}🔥
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className={cn('space-y-3', className)}>
      <AnimatePresence>
        {isLevelUp && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none z-50"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold text-lg shadow-lg">
              Level Up! 🎉
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div
            animate={isLevelUp ? {
              scale: [1, 1.3, 1],
              rotate: [0, 360, 0]
            } : {}}
            transition={{ duration: 0.5 }}
            className={cn(
              'p-2 rounded-full bg-gradient-to-r',
              gradient
            )}
          >
            <Icon className="w-5 h-5 text-white" />
          </motion.div>
          
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">{levelInfo.name}</span>
              {streak > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {streak} day streak 🔥
                </Badge>
              )}
            </div>
            {showDetails && (
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {levelInfo.percentage} of viewers
              </p>
            )}
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold">{score}</p>
          <p className="text-xs text-gray-600 dark:text-gray-400">points</p>
        </div>
      </div>

      {level < 5 && (
        <div className="space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-600 dark:text-gray-400">
              Progress to Level {level + 1}
            </span>
            <span className="font-medium">{progressToNext.toFixed(0)}%</span>
          </div>
          <Progress value={progressToNext} className="h-2" />
        </div>
      )}

      {showDetails && (
        <div className="grid grid-cols-3 gap-2 pt-2 border-t">
          <EngagementStat label="Watch Time" value="45m" />
          <EngagementStat label="Messages" value="12" />
          <EngagementStat label="Reactions" value="89" />
        </div>
      )}
    </div>
  );
}

function EngagementStat({ 
  label, 
  value 
}: { 
  label: string; 
  value: string;
}) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-600 dark:text-gray-400">{label}</p>
      <p className="text-sm font-semibold">{value}</p>
    </div>
  );
}