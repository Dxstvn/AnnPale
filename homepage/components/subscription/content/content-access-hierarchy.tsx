'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Lock, 
  Unlock, 
  Crown, 
  Star, 
  Shield, 
  Video, 
  Users, 
  Clock,
  Calendar,
  MessageSquare,
  Play,
  Eye,
  EyeOff,
  ChevronRight,
  Sparkles,
  Timer,
  Zap,
  Radio
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'post' | 'stream' | 'event' | 'call';
  tier: 'public' | 'all' | 'bronze' | 'silver' | 'gold';
  duration?: string;
  releaseDate?: string;
  earlyAccess?: number; // hours before public release
  views?: number;
  exclusive?: boolean;
  live?: boolean;
}

interface ContentAccessHierarchyProps {
  currentUserTier?: 'none' | 'bronze' | 'silver' | 'gold';
  onContentSelect?: (content: ContentItem) => void;
  showAnalytics?: boolean;
}

export function ContentAccessHierarchy({
  currentUserTier = 'none',
  onContentSelect,
  showAnalytics = false
}: ContentAccessHierarchyProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<'public' | 'subscriber' | 'tier' | 'timed' | 'interactive'>('public');
  const [previewMode, setPreviewMode] = React.useState(false);

  // Content categories with access rules
  const contentCategories = {
    public: {
      name: 'Public Content',
      icon: Unlock,
      description: 'Free content available to everyone',
      color: 'from-green-400 to-green-600',
      items: [
        { id: '1', title: 'Profile Preview', type: 'video' as const, tier: 'public' as const, duration: '2:30', views: 15420 },
        { id: '2', title: 'Sample Video (Watermarked)', type: 'video' as const, tier: 'public' as const, duration: '5:00', views: 8932 },
        { id: '3', title: 'Public Announcement', type: 'post' as const, tier: 'public' as const, views: 12103 },
        { id: '4', title: 'Highlights Reel', type: 'video' as const, tier: 'public' as const, duration: '3:45', views: 21893 },
        { id: '5', title: 'Subscribe Call-to-Action', type: 'post' as const, tier: 'public' as const, views: 9284 }
      ]
    },
    subscriber: {
      name: 'Subscriber Content',
      icon: Star,
      description: 'Available to all subscription tiers',
      color: 'from-blue-400 to-blue-600',
      items: [
        { id: '6', title: 'Full Video Library', type: 'video' as const, tier: 'all' as const, exclusive: true },
        { id: '7', title: 'Behind-the-Scenes', type: 'video' as const, tier: 'all' as const, duration: '15:00', exclusive: true },
        { id: '8', title: 'Extended Cuts', type: 'video' as const, tier: 'all' as const, duration: '25:00', exclusive: true },
        { id: '9', title: 'Bloopers & Outtakes', type: 'video' as const, tier: 'all' as const, duration: '10:00', exclusive: true },
        { id: '10', title: 'Member-Only Posts', type: 'post' as const, tier: 'all' as const, exclusive: true }
      ]
    },
    tier: {
      name: 'Tier-Exclusive',
      icon: Crown,
      description: 'Content based on subscription tier',
      color: 'from-purple-400 to-purple-600',
      items: [
        { id: '11', title: 'Bronze Monthly Special', type: 'video' as const, tier: 'bronze' as const, exclusive: true },
        { id: '12', title: 'Silver Weekly Exclusive', type: 'video' as const, tier: 'silver' as const, exclusive: true },
        { id: '13', title: 'Gold Daily Content', type: 'video' as const, tier: 'gold' as const, exclusive: true },
        { id: '14', title: 'Limited Edition Series', type: 'video' as const, tier: 'gold' as const, exclusive: true },
        { id: '15', title: 'VIP Behind-the-Scenes', type: 'video' as const, tier: 'gold' as const, exclusive: true }
      ]
    },
    timed: {
      name: 'Time-Gated',
      icon: Clock,
      description: 'Early access and premiere content',
      color: 'from-orange-400 to-orange-600',
      items: [
        { id: '16', title: 'Early Access Video', type: 'video' as const, tier: 'silver' as const, earlyAccess: 48 },
        { id: '17', title: 'Premiere Privileges', type: 'event' as const, tier: 'gold' as const, earlyAccess: 72 },
        { id: '18', title: 'Pre-Release Viewing', type: 'video' as const, tier: 'gold' as const, earlyAccess: 96 },
        { id: '19', title: 'Exclusive Window Content', type: 'video' as const, tier: 'silver' as const, earlyAccess: 24 },
        { id: '20', title: 'First Look Preview', type: 'video' as const, tier: 'all' as const, earlyAccess: 12 }
      ]
    },
    interactive: {
      name: 'Interactive',
      icon: Users,
      description: 'Live and interactive experiences',
      color: 'from-pink-400 to-pink-600',
      items: [
        { id: '21', title: 'Live Stream Session', type: 'stream' as const, tier: 'silver' as const, live: true },
        { id: '22', title: 'Q&A Session', type: 'event' as const, tier: 'gold' as const, live: true },
        { id: '23', title: 'Virtual Meetup', type: 'event' as const, tier: 'gold' as const, live: true },
        { id: '24', title: '1-on-1 Video Call', type: 'call' as const, tier: 'gold' as const, exclusive: true },
        { id: '25', title: 'Group Watch Party', type: 'stream' as const, tier: 'silver' as const, live: true }
      ]
    }
  };

  // Check if user has access to content
  const hasAccess = (contentTier: string): boolean => {
    if (contentTier === 'public') return true;
    if (currentUserTier === 'none') return false;
    if (contentTier === 'all') return currentUserTier !== 'none';
    
    const tierHierarchy = { bronze: 1, silver: 2, gold: 3 };
    const userLevel = tierHierarchy[currentUserTier as keyof typeof tierHierarchy] || 0;
    const requiredLevel = tierHierarchy[contentTier as keyof typeof tierHierarchy] || 0;
    
    return userLevel >= requiredLevel;
  };

  // Get tier icon
  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return Shield;
      case 'silver': return Star;
      case 'gold': return Crown;
      default: return Lock;
    }
  };

  // Get tier color
  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'public': return 'bg-green-100 text-green-700';
      case 'all': return 'bg-blue-100 text-blue-700';
      case 'bronze': return 'bg-orange-100 text-orange-700';
      case 'silver': return 'bg-gray-100 text-gray-700';
      case 'gold': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const selectedCategoryData = contentCategories[selectedCategory];

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Content Access Hierarchy</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Your Tier: {currentUserTier === 'none' ? 'Free' : currentUserTier.charAt(0).toUpperCase() + currentUserTier.slice(1)}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPreviewMode(!previewMode)}
              >
                {previewMode ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                {previewMode ? 'Hide Preview' : 'Preview Mode'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Category Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {Object.entries(contentCategories).map(([key, category]) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === key;
          
          return (
            <motion.button
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(key as any)}
              className={cn(
                "relative p-4 rounded-lg border-2 transition-all",
                isSelected 
                  ? "border-purple-500 bg-gradient-to-br " + category.color + " text-white"
                  : "border-gray-200 hover:border-purple-300 bg-white"
              )}
            >
              <div className="flex flex-col items-center gap-2">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center",
                  isSelected ? "bg-white/20" : "bg-gradient-to-br " + category.color
                )}>
                  <Icon className={cn(
                    "h-6 w-6",
                    isSelected ? "text-white" : "text-white"
                  )} />
                </div>
                <span className={cn(
                  "text-sm font-medium",
                  isSelected ? "text-white" : "text-gray-900"
                )}>
                  {category.name}
                </span>
              </div>
              {isSelected && (
                <motion.div
                  layoutId="category-indicator"
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[8px] border-t-purple-500"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Content Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
              selectedCategoryData.color
            )}>
              <selectedCategoryData.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>{selectedCategoryData.name}</CardTitle>
              <p className="text-sm text-gray-600">{selectedCategoryData.description}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {selectedCategoryData.items.map((item) => {
              const accessible = hasAccess(item.tier);
              const TierIcon = getTierIcon(item.tier);
              
              return (
                <motion.div
                  key={item.id}
                  whileHover={{ x: accessible ? 4 : 0 }}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-lg border transition-all",
                    accessible 
                      ? "border-gray-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer"
                      : "border-gray-100 bg-gray-50 opacity-60"
                  )}
                  onClick={() => accessible && onContentSelect?.(item)}
                >
                  <div className="flex items-center gap-4">
                    {/* Content Type Icon */}
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      accessible ? "bg-purple-100" : "bg-gray-100"
                    )}>
                      {item.type === 'video' && <Video className="h-5 w-5 text-purple-600" />}
                      {item.type === 'post' && <MessageSquare className="h-5 w-5 text-purple-600" />}
                      {item.type === 'stream' && <Radio className="h-5 w-5 text-purple-600" />}
                      {item.type === 'event' && <Calendar className="h-5 w-5 text-purple-600" />}
                      {item.type === 'call' && <Users className="h-5 w-5 text-purple-600" />}
                    </div>
                    
                    {/* Content Details */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{item.title}</h4>
                        {item.exclusive && (
                          <Badge variant="secondary" className="text-xs">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Exclusive
                          </Badge>
                        )}
                        {item.live && (
                          <Badge className="bg-red-100 text-red-700 text-xs">
                            <Zap className="h-3 w-3 mr-1" />
                            Live
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 mt-1">
                        <Badge className={cn("text-xs", getTierColor(item.tier))}>
                          <TierIcon className="h-3 w-3 mr-1" />
                          {item.tier === 'all' ? 'All Tiers' : item.tier.charAt(0).toUpperCase() + item.tier.slice(1)}
                        </Badge>
                        
                        {item.duration && (
                          <span className="text-xs text-gray-500">
                            <Clock className="h-3 w-3 inline mr-1" />
                            {item.duration}
                          </span>
                        )}
                        
                        {item.earlyAccess && (
                          <span className="text-xs text-green-600">
                            <Timer className="h-3 w-3 inline mr-1" />
                            {item.earlyAccess}h early
                          </span>
                        )}
                        
                        {item.views && showAnalytics && (
                          <span className="text-xs text-gray-500">
                            <Eye className="h-3 w-3 inline mr-1" />
                            {item.views.toLocaleString()} views
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Access Indicator */}
                  <div className="flex items-center gap-2">
                    {accessible ? (
                      <>
                        {previewMode && (
                          <Badge className="bg-green-100 text-green-700">
                            <Play className="h-3 w-3 mr-1" />
                            Available
                          </Badge>
                        )}
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          <Lock className="h-3 w-3 mr-1" />
                          Upgrade to {item.tier}
                        </Badge>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Access Summary */}
      {currentUserTier !== 'none' && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Your Access Level</h3>
                <p className="text-sm text-gray-600">
                  As a {currentUserTier} member, you have access to {
                    currentUserTier === 'gold' ? 'all content tiers' :
                    currentUserTier === 'silver' ? 'Silver, Bronze, and subscriber content' :
                    'Bronze and basic subscriber content'
                  }
                </p>
              </div>
              {currentUserTier !== 'gold' && (
                <Button>
                  Upgrade Tier
                  <Crown className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}