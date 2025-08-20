'use client';

import { ViewerPersona, VIEWER_PERSONAS } from '@/lib/types/live-streaming';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ViewerPersonaCardProps {
  persona: ViewerPersona;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

const personaIcons: Record<ViewerPersona, string> = {
  'super-fan': '🌟',
  'casual-viewer': '📺',
  'supporter': '💪',
  'discoverer': '🔍',
  'event-attendee': '🎉'
};

const personaColors: Record<ViewerPersona, string> = {
  'super-fan': 'from-purple-500 to-pink-500',
  'casual-viewer': 'from-blue-500 to-cyan-500',
  'supporter': 'from-green-500 to-emerald-500',
  'discoverer': 'from-orange-500 to-yellow-500',
  'event-attendee': 'from-red-500 to-pink-500'
};

export function ViewerPersonaCard({
  persona,
  isActive = false,
  onClick,
  className
}: ViewerPersonaCardProps) {
  const profile = VIEWER_PERSONAS[persona];
  const icon = personaIcons[persona];
  const gradient = personaColors[persona];

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all cursor-pointer hover:scale-105',
        isActive && 'ring-2 ring-purple-500',
        className
      )}
      onClick={onClick}
    >
      <div className={cn(
        'absolute inset-0 opacity-10 bg-gradient-to-br',
        gradient
      )} />
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <span className="text-3xl">{icon}</span>
            <CardTitle className="capitalize">
              {persona.replace('-', ' ')}
            </CardTitle>
          </div>
          {isActive && (
            <Badge variant="default" className="bg-purple-500">
              Active
            </Badge>
          )}
        </div>
        <CardDescription>{profile.primaryMotivation}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Engagement</span>
            <span className="font-medium">{profile.engagementStyle}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Spending</span>
            <span className="font-medium">{profile.spendingBehavior}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Value</span>
            <span className="font-medium">{profile.platformValue}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}