'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Gift,
  ShoppingCart,
  Coins,
  Star,
  Ticket,
  Video,
  Calendar,
  Users,
  Crown,
  Shirt,
  Coffee,
  Headphones,
  Book,
  Camera,
  Heart,
  Zap,
  Trophy,
  Package,
  Tag,
  Filter,
  Search,
  ChevronRight,
  Info,
  Clock,
  TrendingUp,
  Sparkles,
  Lock,
  CheckCircle,
  AlertTriangle,
  Download,
  ExternalLink,
  Percent,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface RewardItem {
  id: string;
  name: string;
  description: string;
  category: 'digital' | 'discounts' | 'access' | 'physical' | 'experiences';
  icon: React.ElementType;
  pointsCost: number;
  originalPrice?: number;
  stock?: number;
  limited?: boolean;
  featured?: boolean;
  new?: boolean;
  requiresLevel?: string;
  expiresAt?: Date;
  image?: string;
  deliveryTime?: string;
  popularity?: number;
}

interface RewardCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  itemCount: number;
}

interface UserBalance {
  availablePoints: number;
  pendingPoints: number;
  lifetimeRedeemed: number;
  currentLevel: string;
}

interface RewardsStoreProps {
  userId?: string;
  userBalance?: UserBalance;
  onRedeemItem?: (item: RewardItem) => void;
  onViewDetails?: (item: RewardItem) => void;
  onAddToCart?: (item: RewardItem) => void;
  showCategories?: boolean;
  showFeatured?: boolean;
}

export function RewardsStore({
  userId,
  userBalance = {
    availablePoints: 1850,
    pendingPoints: 100,
    lifetimeRedeemed: 2500,
    currentLevel: 'Contributor'
  },
  onRedeemItem,
  onViewDetails,
  onAddToCart,
  showCategories = true,
  showFeatured = true
}: RewardsStoreProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortBy, setSortBy] = React.useState<'popular' | 'newest' | 'points-low' | 'points-high'>('popular');
  const [cart, setCart] = React.useState<RewardItem[]>([]);
  const [showCart, setShowCart] = React.useState(false);

  // Reward categories
  const categories: RewardCategory[] = [
    {
      id: 'digital',
      name: 'Digital Goods',
      description: 'Downloadable content and digital rewards',
      icon: Download,
      color: 'bg-blue-100 text-blue-600',
      itemCount: 15
    },
    {
      id: 'discounts',
      name: 'Discounts',
      description: 'Save on platform services',
      icon: Percent,
      color: 'bg-green-100 text-green-600',
      itemCount: 8
    },
    {
      id: 'access',
      name: 'Exclusive Access',
      description: 'VIP features and early access',
      icon: Crown,
      color: 'bg-purple-100 text-purple-600',
      itemCount: 10
    },
    {
      id: 'physical',
      name: 'Physical Merch',
      description: 'Branded merchandise and gifts',
      icon: Package,
      color: 'bg-orange-100 text-orange-600',
      itemCount: 12
    },
    {
      id: 'experiences',
      name: 'Experiences',
      description: 'Special events and meetups',
      icon: Calendar,
      color: 'bg-pink-100 text-pink-600',
      itemCount: 6
    }
  ];

  // Sample reward items
  const rewardItems: RewardItem[] = [
    // Digital Goods
    {
      id: 'digital1',
      name: 'Custom Profile Badge',
      description: 'Exclusive badge to showcase on your profile',
      category: 'digital',
      icon: Star,
      pointsCost: 500,
      deliveryTime: 'Instant',
      featured: true,
      new: true,
      popularity: 95
    },
    {
      id: 'digital2',
      name: 'Premium Emoji Pack',
      description: 'Unlock 50+ exclusive Haitian-themed emojis',
      category: 'digital',
      icon: Heart,
      pointsCost: 300,
      deliveryTime: 'Instant',
      popularity: 88
    },
    {
      id: 'digital3',
      name: 'Custom Video Background',
      description: 'Personalized background for video messages',
      category: 'digital',
      icon: Camera,
      pointsCost: 750,
      deliveryTime: 'Instant',
      requiresLevel: 'Member',
      popularity: 76
    },
    
    // Discounts
    {
      id: 'discount1',
      name: '20% Off Next Booking',
      description: 'Save on your next creator video message',
      category: 'discounts',
      icon: Ticket,
      pointsCost: 1000,
      originalPrice: 20,
      featured: true,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      popularity: 92
    },
    {
      id: 'discount2',
      name: '3-Month Premium Trial',
      description: 'Try premium features free for 3 months',
      category: 'discounts',
      icon: Zap,
      pointsCost: 2000,
      originalPrice: 45,
      requiresLevel: 'Contributor',
      limited: true,
      stock: 50,
      popularity: 89
    },
    
    // Exclusive Access
    {
      id: 'access1',
      name: 'VIP Creator Meet & Greet',
      description: 'Virtual meetup with top creators',
      category: 'access',
      icon: Video,
      pointsCost: 3000,
      featured: true,
      limited: true,
      stock: 25,
      requiresLevel: 'Expert',
      popularity: 98
    },
    {
      id: 'access2',
      name: 'Early Feature Access',
      description: 'Be first to try new platform features',
      category: 'access',
      icon: Sparkles,
      pointsCost: 1500,
      requiresLevel: 'Contributor',
      popularity: 85
    },
    {
      id: 'access3',
      name: 'Creator Workshop Pass',
      description: 'Learn from successful creators',
      category: 'access',
      icon: Users,
      pointsCost: 2500,
      deliveryTime: 'Next event',
      limited: true,
      stock: 100,
      popularity: 91
    },
    
    // Physical Merchandise
    {
      id: 'physical1',
      name: 'Ann Pale T-Shirt',
      description: 'Premium quality branded t-shirt',
      category: 'physical',
      icon: Shirt,
      pointsCost: 2000,
      originalPrice: 35,
      deliveryTime: '5-7 days',
      stock: 200,
      popularity: 87
    },
    {
      id: 'physical2',
      name: 'Haitian Coffee Bundle',
      description: 'Authentic Haitian coffee selection',
      category: 'physical',
      icon: Coffee,
      pointsCost: 1800,
      originalPrice: 40,
      deliveryTime: '3-5 days',
      featured: true,
      stock: 75,
      popularity: 94
    },
    {
      id: 'physical3',
      name: 'Wireless Headphones',
      description: 'Premium audio for content creation',
      category: 'physical',
      icon: Headphones,
      pointsCost: 5000,
      originalPrice: 120,
      deliveryTime: '5-7 days',
      requiresLevel: 'Expert',
      limited: true,
      stock: 30,
      popularity: 79
    },
    
    // Experiences
    {
      id: 'experience1',
      name: 'Cultural Heritage Tour',
      description: 'Virtual tour of Haitian cultural sites',
      category: 'experiences',
      icon: Globe,
      pointsCost: 1500,
      deliveryTime: 'Scheduled',
      featured: true,
      popularity: 96
    },
    {
      id: 'experience2',
      name: 'Private Creator Consultation',
      description: '1-hour session with platform expert',
      category: 'experiences',
      icon: Calendar,
      pointsCost: 4000,
      requiresLevel: 'Leader',
      limited: true,
      stock: 10,
      popularity: 83
    }
  ];

  const canAfford = (item: RewardItem) => {
    return userBalance.availablePoints >= item.pointsCost;
  };

  const meetsLevelRequirement = (item: RewardItem) => {
    if (!item.requiresLevel) return true;
    // Simplified level check - in real app would have proper level hierarchy
    return true;
  };

  const filteredItems = React.useMemo(() => {
    let filtered = rewardItems;
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort items
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.new ? 1 : -1;
        case 'points-low':
          return a.pointsCost - b.pointsCost;
        case 'points-high':
          return b.pointsCost - a.pointsCost;
        case 'popular':
        default:
          return (b.popularity || 0) - (a.popularity || 0);
      }
    });
    
    return filtered;
  }, [selectedCategory, searchQuery, sortBy]);

  const featuredItems = rewardItems.filter(item => item.featured);
  const cartTotal = cart.reduce((sum, item) => sum + item.pointsCost, 0);

  const renderRewardCard = (item: RewardItem) => {
    const Icon = item.icon;
    const affordable = canAfford(item);
    const meetsLevel = meetsLevelRequirement(item);
    const canRedeem = affordable && meetsLevel && (!item.stock || item.stock > 0);

    return (
      <Card 
        key={item.id}
        className={cn(
          "hover:shadow-lg transition-all cursor-pointer",
          !canRedeem && "opacity-75"
        )}
        onClick={() => onViewDetails?.(item)}
      >
        <CardContent className="p-4">
          {/* Badges */}
          <div className="flex gap-2 mb-3">
            {item.featured && (
              <Badge className="bg-purple-600 text-xs">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
            {item.new && (
              <Badge className="bg-green-600 text-xs">
                New
              </Badge>
            )}
            {item.limited && (
              <Badge variant="outline" className="text-xs text-orange-600 border-orange-600">
                Limited
              </Badge>
            )}
          </div>

          {/* Icon & Info */}
          <div className="flex flex-col items-center text-center mb-4">
            <div className={cn(
              "w-16 h-16 rounded-full flex items-center justify-center mb-3",
              categories.find(c => c.id === item.category)?.color || "bg-gray-100"
            )}>
              <Icon className="h-8 w-8" />
            </div>
            <h4 className="font-semibold mb-1">{item.name}</h4>
            <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
          </div>

          {/* Points Cost */}
          <div className="text-center mb-3">
            <div className="flex items-center justify-center gap-2">
              <Coins className="h-5 w-5 text-yellow-600" />
              <span className="text-2xl font-bold">{item.pointsCost.toLocaleString()}</span>
            </div>
            {item.originalPrice && (
              <div className="text-sm text-gray-500">
                Value: ${item.originalPrice}
              </div>
            )}
          </div>

          {/* Requirements & Stock */}
          <div className="space-y-2 mb-3">
            {item.requiresLevel && (
              <div className="flex items-center justify-center gap-1 text-xs">
                {meetsLevel ? (
                  <CheckCircle className="h-3 w-3 text-green-600" />
                ) : (
                  <Lock className="h-3 w-3 text-gray-400" />
                )}
                <span className={!meetsLevel ? "text-gray-400" : ""}>
                  Requires {item.requiresLevel}
                </span>
              </div>
            )}
            
            {item.stock !== undefined && (
              <div className="flex items-center justify-center gap-1 text-xs">
                {item.stock > 0 ? (
                  <>
                    <Package className="h-3 w-3 text-blue-600" />
                    <span>{item.stock} left</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-3 w-3 text-red-600" />
                    <span className="text-red-600">Out of stock</span>
                  </>
                )}
              </div>
            )}
            
            {item.expiresAt && (
              <div className="flex items-center justify-center gap-1 text-xs">
                <Clock className="h-3 w-3 text-orange-600" />
                <span>Expires {item.expiresAt.toLocaleDateString()}</span>
              </div>
            )}
            
            {item.deliveryTime && (
              <div className="flex items-center justify-center gap-1 text-xs">
                <Package className="h-3 w-3 text-gray-400" />
                <span>{item.deliveryTime}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <Button 
            className="w-full"
            disabled={!canRedeem}
            onClick={(e) => {
              e.stopPropagation();
              if (canRedeem) {
                onRedeemItem?.(item);
                setCart([...cart, item]);
              }
            }}
          >
            {!affordable ? (
              <>Need {item.pointsCost - userBalance.availablePoints} more points</>
            ) : !meetsLevel ? (
              <>Level Required</>
            ) : item.stock === 0 ? (
              <>Out of Stock</>
            ) : (
              <>
                Redeem Now
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Rewards Store</h2>
          <p className="text-gray-600">Redeem your points for exclusive rewards</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-purple-600">{userBalance.availablePoints.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Available Points</div>
          </div>
          <Button 
            variant="outline"
            onClick={() => setShowCart(!showCart)}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Cart ({cart.length})
          </Button>
        </div>
      </div>

      {/* Featured Items */}
      {showFeatured && featuredItems.length > 0 && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Featured Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {featuredItems.slice(0, 3).map((item) => {
                const Icon = item.icon;
                return (
                  <div 
                    key={item.id}
                    className="flex items-center gap-3 p-3 bg-white rounded-lg border cursor-pointer hover:shadow-md transition-all"
                    onClick={() => onViewDetails?.(item)}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      categories.find(c => c.id === item.category)?.color
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <div className="flex items-center gap-1 mt-1">
                        <Coins className="h-4 w-4 text-yellow-600" />
                        <span className="font-bold text-yellow-600">{item.pointsCost}</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
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
                placeholder="Search rewards..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="points-low">Points: Low to High</option>
              <option value="points-high">Points: High to Low</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Category Filters */}
      {showCategories && (
        <div className="flex gap-2 flex-wrap">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All Items
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
                <Badge variant="secondary" className="ml-2 text-xs">
                  {category.itemCount}
                </Badge>
              </Button>
            );
          })}
        </div>
      )}

      {/* Rewards Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredItems.map(renderRewardCard)}
      </div>

      {/* Cart Modal */}
      <AnimatePresence>
        {showCart && cart.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCart(false)}
          >
            <Card className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <CardTitle>Your Cart</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  {cart.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                        <Icon className="h-5 w-5" />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.pointsCost} points</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-medium">Total:</span>
                    <span className="text-xl font-bold">{cartTotal.toLocaleString()} points</span>
                  </div>
                  
                  {cartTotal > userBalance.availablePoints ? (
                    <div className="text-red-600 text-sm mb-4">
                      <AlertTriangle className="h-4 w-4 inline mr-1" />
                      You need {cartTotal - userBalance.availablePoints} more points
                    </div>
                  ) : (
                    <div className="text-green-600 text-sm mb-4">
                      <CheckCircle className="h-4 w-4 inline mr-1" />
                      You have enough points!
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      disabled={cartTotal > userBalance.availablePoints}
                    >
                      Redeem All
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setCart([]);
                        setShowCart(false);
                      }}
                    >
                      Clear Cart
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const Globe = Users; // Using Users as a placeholder for Globe icon