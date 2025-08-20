'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  Trophy,
  Star,
  Award,
  Medal,
  Crown,
  Shield,
  Heart,
  Users,
  MessageSquare,
  Camera,
  Video,
  Gift,
  Sparkles,
  Target,
  Zap,
  Flame,
  Calendar,
  Clock,
  BookOpen,
  Handshake,
  Lightbulb,
  Rocket,
  Diamond,
  Gem,
  Lock,
  Unlock,
  CheckCircle,
  Info,
  Search,
  Filter,
  Grid3x3,
  List,
  ChevronRight,
  ExternalLink,
  Share2,
  Download,
  Eye,
  EyeOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface BadgeItem {
  id: string;
  name: string;
  description: string;
  category: 'participation' | 'expertise' | 'helpfulness' | 'creativity' | 'leadership' | 'special';
  icon: React.ElementType;
  rarity: 'common' | 'rare' | 'epic' | 'legendary' | 'mythic';
  points: number;
  unlockedAt?: Date;
  progress?: number;
  requirement?: number;
  secret?: boolean;
  seasonal?: boolean;
  limited?: boolean;
}

interface BadgeCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  totalBadges: number;
  unlockedBadges: number;
}

interface BadgeSystemProps {
  userId?: string;
  badges?: BadgeItem[];
  totalBadges?: number;
  unlockedBadges?: number;
  onViewBadge?: (badge: BadgeItem) => void;
  onShareBadge?: (badge: BadgeItem) => void;
  onEquipBadge?: (badge: BadgeItem) => void;
  showProgress?: boolean;
  showCategories?: boolean;
}

export function BadgeSystem({
  userId,
  badges = [],
  totalBadges = 120,
  unlockedBadges = 45,
  onViewBadge,
  onShareBadge,
  onEquipBadge,
  showProgress = true,
  showCategories = true
}: BadgeSystemProps) {
  const [activeTab, setActiveTab] = React.useState<'all' | 'unlocked' | 'locked' | 'categories'>('all');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [showSecret, setShowSecret] = React.useState(false);

  // Badge categories
  const categories: BadgeCategory[] = [
    {
      id: 'participation',
      name: 'Participation',
      description: 'Active community engagement',
      icon: Users,
      color: 'bg-blue-100 text-blue-600',
      totalBadges: 25,
      unlockedBadges: 12
    },
    {
      id: 'expertise',
      name: 'Expertise',
      description: 'Knowledge and skills',
      icon: BookOpen,
      color: 'bg-purple-100 text-purple-600',
      totalBadges: 20,
      unlockedBadges: 8
    },
    {
      id: 'helpfulness',
      name: 'Helpfulness',
      description: 'Supporting community members',
      icon: Heart,
      color: 'bg-pink-100 text-pink-600',
      totalBadges: 20,
      unlockedBadges: 10
    },
    {
      id: 'creativity',
      name: 'Creativity',
      description: 'Creative contributions',
      icon: Lightbulb,
      color: 'bg-yellow-100 text-yellow-600',
      totalBadges: 15,
      unlockedBadges: 5
    },
    {
      id: 'leadership',
      name: 'Leadership',
      description: 'Community leadership',
      icon: Crown,
      color: 'bg-orange-100 text-orange-600',
      totalBadges: 15,
      unlockedBadges: 3
    },
    {
      id: 'special',
      name: 'Special Events',
      description: 'Limited edition badges',
      icon: Sparkles,
      color: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-600',
      totalBadges: 25,
      unlockedBadges: 7
    }
  ];

  // Sample badges
  const sampleBadges: BadgeItem[] = [
    // Participation Badges
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Complete your first action',
      category: 'participation',
      icon: Rocket,
      rarity: 'common',
      points: 10,
      unlockedAt: new Date('2024-01-15'),
      progress: 100,
      requirement: 1
    },
    {
      id: 'daily-visitor',
      name: 'Daily Visitor',
      description: 'Visit 7 days in a row',
      category: 'participation',
      icon: Calendar,
      rarity: 'common',
      points: 25,
      unlockedAt: new Date('2024-01-22'),
      progress: 100,
      requirement: 7
    },
    {
      id: 'century-streak',
      name: 'Century Streak',
      description: 'Maintain a 100-day streak',
      category: 'participation',
      icon: Flame,
      rarity: 'legendary',
      points: 500,
      progress: 45,
      requirement: 100
    },
    
    // Expertise Badges
    {
      id: 'knowledge-seeker',
      name: 'Knowledge Seeker',
      description: 'Complete 10 learning modules',
      category: 'expertise',
      icon: BookOpen,
      rarity: 'rare',
      points: 50,
      unlockedAt: new Date('2024-02-10'),
      progress: 100,
      requirement: 10
    },
    {
      id: 'master-creator',
      name: 'Master Creator',
      description: 'Create 100 pieces of content',
      category: 'expertise',
      icon: Camera,
      rarity: 'epic',
      points: 200,
      progress: 67,
      requirement: 100
    },
    
    // Helpfulness Badges
    {
      id: 'helping-hand',
      name: 'Helping Hand',
      description: 'Help 5 community members',
      category: 'helpfulness',
      icon: Handshake,
      rarity: 'common',
      points: 30,
      unlockedAt: new Date('2024-01-28'),
      progress: 100,
      requirement: 5
    },
    {
      id: 'community-hero',
      name: 'Community Hero',
      description: 'Receive 100 thanks from members',
      category: 'helpfulness',
      icon: Heart,
      rarity: 'epic',
      points: 250,
      progress: 82,
      requirement: 100
    },
    
    // Creativity Badges
    {
      id: 'creative-spark',
      name: 'Creative Spark',
      description: 'Win your first challenge',
      category: 'creativity',
      icon: Sparkles,
      rarity: 'rare',
      points: 75,
      unlockedAt: new Date('2024-02-15'),
      progress: 100,
      requirement: 1
    },
    {
      id: 'innovation-master',
      name: 'Innovation Master',
      description: 'Create trending content 10 times',
      category: 'creativity',
      icon: Lightbulb,
      rarity: 'legendary',
      points: 400,
      progress: 30,
      requirement: 10
    },
    
    // Leadership Badges
    {
      id: 'team-builder',
      name: 'Team Builder',
      description: 'Lead 5 successful collaborations',
      category: 'leadership',
      icon: Users,
      rarity: 'rare',
      points: 100,
      progress: 60,
      requirement: 5
    },
    {
      id: 'community-pillar',
      name: 'Community Pillar',
      description: 'Become a top 10 contributor',
      category: 'leadership',
      icon: Crown,
      rarity: 'mythic',
      points: 1000,
      progress: 0,
      requirement: 1,
      secret: true
    },
    
    // Special Event Badges
    {
      id: 'heritage-champion',
      name: 'Heritage Champion 2024',
      description: 'Haitian Heritage Month participant',
      category: 'special',
      icon: Trophy,
      rarity: 'epic',
      points: 150,
      unlockedAt: new Date('2024-05-01'),
      progress: 100,
      requirement: 1,
      seasonal: true,
      limited: true
    },
    {
      id: 'founding-member',
      name: 'Founding Member',
      description: 'Early community supporter',
      category: 'special',
      icon: Shield,
      rarity: 'legendary',
      points: 500,
      unlockedAt: new Date('2024-01-01'),
      progress: 100,
      requirement: 1,
      limited: true
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50';
      case 'rare': return 'border-blue-300 bg-blue-50';
      case 'epic': return 'border-purple-300 bg-purple-50';
      case 'legendary': return 'border-yellow-300 bg-yellow-50';
      case 'mythic': return 'border-gradient-to-r from-purple-300 to-pink-300 bg-gradient-to-r from-purple-50 to-pink-50';
      default: return 'border-gray-300 bg-gray-50';
    }
  };

  const getRarityLabel = (rarity: string) => {
    switch (rarity) {
      case 'common': return { label: 'Common', color: 'bg-gray-600' };
      case 'rare': return { label: 'Rare', color: 'bg-blue-600' };
      case 'epic': return { label: 'Epic', color: 'bg-purple-600' };
      case 'legendary': return { label: 'Legendary', color: 'bg-yellow-600' };
      case 'mythic': return { label: 'Mythic', color: 'bg-gradient-to-r from-purple-600 to-pink-600' };
      default: return { label: 'Common', color: 'bg-gray-600' };
    }
  };

  const filteredBadges = React.useMemo(() => {
    let filtered = sampleBadges;
    
    // Filter by unlock status
    if (activeTab === 'unlocked') {
      filtered = filtered.filter(b => b.unlockedAt);
    } else if (activeTab === 'locked') {
      filtered = filtered.filter(b => !b.unlockedAt);
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(b => b.category === selectedCategory);
    }
    
    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(b => 
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Filter secret badges
    if (!showSecret) {
      filtered = filtered.filter(b => !b.secret || b.unlockedAt);
    }
    
    return filtered;
  }, [activeTab, selectedCategory, searchQuery, showSecret]);

  const renderBadgeCard = (badge: BadgeItem) => {
    const Icon = badge.icon;
    const isUnlocked = !!badge.unlockedAt;
    const rarityInfo = getRarityLabel(badge.rarity);

    return (
      <motion.div
        key={badge.id}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.05 }}
        className={cn(
          "relative cursor-pointer",
          !isUnlocked && "opacity-75"
        )}
        onClick={() => onViewBadge?.(badge)}
      >
        <Card className={cn(
          "hover:shadow-lg transition-all",
          getRarityColor(badge.rarity),
          badge.secret && !isUnlocked && "border-dashed"
        )}>
          <CardContent className="p-4">
            {/* Badge Icon */}
            <div className="flex flex-col items-center text-center">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mb-3",
                isUnlocked ? categories.find(c => c.id === badge.category)?.color : "bg-gray-200"
              )}>
                {isUnlocked || !badge.secret ? (
                  <Icon className="h-8 w-8" />
                ) : (
                  <Lock className="h-8 w-8 text-gray-400" />
                )}
              </div>
              
              <h4 className={cn(
                "font-semibold text-sm mb-1",
                !isUnlocked && badge.secret && "blur-sm"
              )}>
                {!isUnlocked && badge.secret ? '???' : badge.name}
              </h4>
              
              <p className={cn(
                "text-xs text-gray-600 mb-2 line-clamp-2",
                !isUnlocked && badge.secret && "blur-sm"
              )}>
                {!isUnlocked && badge.secret ? 'Hidden badge' : badge.description}
              </p>

              {/* Progress or Unlock Date */}
              {isUnlocked ? (
                <div className="text-xs text-gray-500">
                  <CheckCircle className="h-3 w-3 inline mr-1 text-green-600" />
                  {badge.unlockedAt?.toLocaleDateString()}
                </div>
              ) : badge.progress !== undefined && badge.requirement ? (
                <div className="w-full">
                  <Progress value={badge.progress} className="h-1.5 mb-1" />
                  <div className="text-xs text-gray-500">
                    {badge.progress}% ({Math.floor((badge.progress / 100) * badge.requirement)}/{badge.requirement})
                  </div>
                </div>
              ) : null}

              {/* Points & Rarity */}
              <div className="flex items-center gap-2 mt-2">
                <Badge className={cn("text-xs", rarityInfo.color)}>
                  {rarityInfo.label}
                </Badge>
                <span className="text-xs font-medium text-yellow-600">
                  {badge.points} pts
                </span>
              </div>

              {/* Special Indicators */}
              <div className="flex gap-1 mt-2">
                {badge.seasonal && (
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="h-3 w-3 mr-1" />
                    Seasonal
                  </Badge>
                )}
                {badge.limited && (
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    Limited
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const renderCategories = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((category) => {
        const Icon = category.icon;
        const progress = (category.unlockedBadges / category.totalBadges) * 100;

        return (
          <Card 
            key={category.id}
            className="hover:shadow-md transition-all cursor-pointer"
            onClick={() => {
              setSelectedCategory(category.id);
              setActiveTab('all');
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", category.color)}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{category.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{category.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">
                        {category.unlockedBadges}/{category.totalBadges}
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3 w-full"
                  >
                    View Badges
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Badge Collection</h2>
          <p className="text-gray-600">Collect badges and showcase your achievements</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-lg px-3 py-1">
            <Trophy className="h-4 w-4 mr-1" />
            {unlockedBadges}/{totalBadges} Badges
          </Badge>
        </div>
      </div>

      {/* Progress Overview */}
      {showProgress && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Overall Progress</h3>
              <span className="text-2xl font-bold text-purple-600">
                {Math.round((unlockedBadges / totalBadges) * 100)}%
              </span>
            </div>
            <Progress value={(unlockedBadges / totalBadges) * 100} className="h-3" />
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-4">
              {['common', 'rare', 'epic', 'legendary', 'mythic'].map((rarity) => {
                const count = sampleBadges.filter(b => b.rarity === rarity && b.unlockedAt).length;
                const total = sampleBadges.filter(b => b.rarity === rarity).length;
                const rarityInfo = getRarityLabel(rarity);
                
                return (
                  <div key={rarity} className="text-center">
                    <Badge className={cn("mb-1", rarityInfo.color)}>
                      {rarityInfo.label}
                    </Badge>
                    <div className="text-sm font-medium">{count}/{total}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search badges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowSecret(!showSecret)}
              >
                {showSecret ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                {showSecret ? 'Hide' : 'Show'} Secret
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              >
                {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid3x3 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'all', label: 'All Badges', count: sampleBadges.length },
            { id: 'unlocked', label: 'Unlocked', count: sampleBadges.filter(b => b.unlockedAt).length },
            { id: 'locked', label: 'Locked', count: sampleBadges.filter(b => !b.unlockedAt).length },
            { id: 'categories', label: 'Categories', count: categories.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.label}
              <Badge variant="secondary" className="text-xs">
                {tab.count}
              </Badge>
            </button>
          ))}
        </nav>
      </div>

      {/* Category Filter (when not on categories tab) */}
      {activeTab !== 'categories' && showCategories && (
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All Categories
          </Button>
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.name}
              </Button>
            );
          })}
        </div>
      )}

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'categories' ? (
            renderCategories()
          ) : (
            <div className={cn(
              viewMode === 'grid' 
                ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                : "space-y-4"
            )}>
              {filteredBadges.map(renderBadgeCard)}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}