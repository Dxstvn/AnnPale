'use client';

import { ENGAGEMENT_PYRAMID } from '@/lib/types/live-streaming';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface EngagementPyramidProps {
  currentLevel?: number;
  showPercentages?: boolean;
  interactive?: boolean;
  className?: string;
}

export function EngagementPyramid({
  currentLevel,
  showPercentages = true,
  interactive = false,
  className
}: EngagementPyramidProps) {
  const pyramidLevels = [...ENGAGEMENT_PYRAMID].reverse();

  return (
    <div className={cn('w-full max-w-2xl mx-auto', className)}>
      <div className="space-y-2">
        {pyramidLevels.map((level, index) => {
          const widthPercentage = 20 + (index * 20);
          const isActive = currentLevel === level.level;
          const isPast = currentLevel ? currentLevel > level.level : false;
          
          return (
            <motion.div
              key={level.level}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="flex items-center justify-center">
                <div
                  className={cn(
                    'relative transition-all duration-300',
                    interactive && 'cursor-pointer hover:scale-105'
                  )}
                  style={{ width: `${widthPercentage}%` }}
                >
                  <div
                    className={cn(
                      'py-4 px-6 text-center rounded-lg transition-colors',
                      isActive && 'ring-2 ring-purple-500 ring-offset-2',
                      isPast ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-gray-100 dark:bg-gray-800',
                      level.level === 5 && 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                    )}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl">{level.icon}</span>
                      <div className="text-left">
                        <h4 className={cn(
                          'font-semibold',
                          level.level === 5 ? 'text-white' : 'text-gray-900 dark:text-gray-100'
                        )}>
                          Level {level.level}: {level.name}
                        </h4>
                        {showPercentages && (
                          <p className={cn(
                            'text-sm',
                            level.level === 5 ? 'text-white/90' : 'text-gray-600 dark:text-gray-400'
                          )}>
                            {level.percentage} of viewers
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {interactive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    >
                      <div className="bg-black/80 text-white p-3 rounded-lg text-sm max-w-xs">
                        <ul className="space-y-1">
                          {level.behaviors.map((behavior, i) => (
                            <li key={i} className="flex items-start">
                              <span className="mr-2">•</span>
                              <span>{behavior}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}