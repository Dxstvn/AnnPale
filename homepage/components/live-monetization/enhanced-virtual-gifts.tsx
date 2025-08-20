'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Gift,
  Heart,
  Star,
  Crown,
  Sparkles,
  DollarSign,
  Zap,
  Target,
  Award,
  Coins,
  PartyPopper,
  Music,
  Flag,
  Flower2,
  Drum,
  Volume2,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Users,
  Timer,
  ChevronRight,
  Plus,
  X,
  PlayCircle,
  Pause,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Enhanced virtual gift categories with Haiti-specific items
export interface EnhancedVirtualGift {
  id: string;
  name: string;
  nameCreole: string; // Haitian Creole name
  emoji: string;
  image?: string;
  price: number;
  category: 'basic' | 'premium' | 'mega' | 'cultural';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  animation: {
    type: 'float' | 'burst' | 'rain' | 'wave' | 'dance' | 'celebration' | 'cultural';
    duration: number; // milliseconds
    particles: number;
    sound?: string;
  };
  effect: {
    screen: 'sparkles' | 'confetti' | 'hearts' | 'fireworks' | 'cultural' | 'music';
    intensity: 'light' | 'medium' | 'heavy' | 'epic';
  };
  description: string;
  descriptionCreole: string;
  culturalSignificance?: string;
  unlockRequirement?: string;
}

// Gift categories following Phase 4.1.6 spec
export const VIRTUAL_GIFT_CATEGORIES: Record<string, EnhancedVirtualGift[]> = {
  basic: [
    {
      id: 'heart',
      name: 'Hearts',
      nameCreole: 'Kè yo',
      emoji: '❤️',
      price: 0.99,
      category: 'basic',
      rarity: 'common',
      animation: { type: 'float', duration: 3000, particles: 5 },
      effect: { screen: 'hearts', intensity: 'light' },
      description: 'Float across screen',
      descriptionCreole: 'Vole sou ekran an'
    },
    {
      id: 'rose',
      name: 'Roses',
      nameCreole: 'Wòz yo',
      emoji: '🌹',
      price: 1.99,
      category: 'basic',
      rarity: 'common',
      animation: { type: 'rain', duration: 4000, particles: 8 },
      effect: { screen: 'sparkles', intensity: 'light' },
      description: 'Fall animation',
      descriptionCreole: 'Animasyon tonbe'
    },
    {
      id: 'stars',
      name: 'Stars',
      nameCreole: 'Zetwal yo',
      emoji: '⭐',
      price: 2.99,
      category: 'basic',
      rarity: 'common',
      animation: { type: 'burst', duration: 2500, particles: 12 },
      effect: { screen: 'sparkles', intensity: 'medium' },
      description: 'Sparkle effect',
      descriptionCreole: 'Efè briyan'
    },
    {
      id: 'flag',
      name: 'Flags',
      nameCreole: 'Drapo yo',
      emoji: '🏳️',
      price: 4.99,
      category: 'basic',
      rarity: 'rare',
      animation: { type: 'wave', duration: 5000, particles: 3 },
      effect: { screen: 'confetti', intensity: 'medium' },
      description: 'Wave animation',
      descriptionCreole: 'Animasyon vantèl'
    }
  ],
  premium: [
    {
      id: 'fireworks',
      name: 'Fireworks',
      nameCreole: 'Artificiel yo',
      emoji: '🎆',
      price: 9.99,
      category: 'premium',
      rarity: 'rare',
      animation: { type: 'burst', duration: 6000, particles: 25, sound: 'fireworks' },
      effect: { screen: 'fireworks', intensity: 'heavy' },
      description: 'Full screen explosion',
      descriptionCreole: 'Eksplozyon plen ekran'
    },
    {
      id: 'rainbow',
      name: 'Rainbow',
      nameCreole: 'Ansièl',
      emoji: '🌈',
      price: 12.99,
      category: 'premium',
      rarity: 'rare',
      animation: { type: 'wave', duration: 8000, particles: 15 },
      effect: { screen: 'sparkles', intensity: 'heavy' },
      description: 'Color wave across screen',
      descriptionCreole: 'Vag koulè sou ekran an'
    },
    {
      id: 'crown',
      name: 'Crown',
      nameCreole: 'Kouwòn',
      emoji: '👑',
      price: 15.99,
      category: 'premium',
      rarity: 'epic',
      animation: { type: 'celebration', duration: 5000, particles: 20 },
      effect: { screen: 'confetti', intensity: 'heavy' },
      description: 'Royalty effect',
      descriptionCreole: 'Efè wayal'
    },
    {
      id: 'music-notes',
      name: 'Music Notes',
      nameCreole: 'Nòt Mizik',
      emoji: '🎵',
      price: 18.99,
      category: 'premium',
      rarity: 'epic',
      animation: { type: 'dance', duration: 7000, particles: 18, sound: 'music' },
      effect: { screen: 'music', intensity: 'heavy' },
      description: 'Dance animation with sound',
      descriptionCreole: 'Animasyon danse ak son'
    }
  ],
  mega: [
    {
      id: 'celebration',
      name: 'Mega Celebration',
      nameCreole: 'Gwo Selebrasyon',
      emoji: '🎉',
      price: 29.99,
      category: 'mega',
      rarity: 'legendary',
      animation: { type: 'celebration', duration: 12000, particles: 50, sound: 'celebration' },
      effect: { screen: 'fireworks', intensity: 'epic' },
      description: 'Epic party mode with full effects',
      descriptionCreole: 'Gwo fèt ak tout efè yo'
    },
    {
      id: 'golden-shower',
      name: 'Golden Coins',
      nameCreole: 'Pyès Lò',
      emoji: '🪙',
      price: 49.99,
      category: 'mega',
      rarity: 'legendary',
      animation: { type: 'rain', duration: 15000, particles: 100, sound: 'coins' },
      effect: { screen: 'sparkles', intensity: 'epic' },
      description: 'Coins rain from sky',
      descriptionCreole: 'Pyès k ap tonbe nan syèl la'
    },
    {
      id: 'love-explosion',
      name: 'Love Explosion',
      nameCreole: 'Eksplozyon Lanmou',
      emoji: '💖',
      price: 59.99,
      category: 'mega',
      rarity: 'legendary',
      animation: { type: 'burst', duration: 10000, particles: 75, sound: 'hearts' },
      effect: { screen: 'hearts', intensity: 'epic' },
      description: 'Massive heart burst effect',
      descriptionCreole: 'Gwo eksplozyon kè'
    },
    {
      id: 'custom-animation',
      name: 'Custom Animation',
      nameCreole: 'Animasyon Pèsonèl',
      emoji: '✨',
      price: 99.99,
      category: 'mega',
      rarity: 'legendary',
      animation: { type: 'celebration', duration: 20000, particles: 150, sound: 'custom' },
      effect: { screen: 'fireworks', intensity: 'epic' },
      description: 'Personalized mega effect',
      descriptionCreole: 'Efè pèsonèl mega'
    }
  ],
  cultural: [
    {
      id: 'hibiscus',
      name: 'Hibiscus',
      nameCreole: 'Ébiskis',
      emoji: '🌺',
      price: 7.99,
      category: 'cultural',
      rarity: 'rare',
      animation: { type: 'float', duration: 6000, particles: 12, sound: 'nature' },
      effect: { screen: 'sparkles', intensity: 'medium' },
      description: 'National flower of Haiti',
      descriptionCreole: 'Flè nasyonal Ayiti',
      culturalSignificance: 'Symbol of Haitian natural beauty and resilience'
    },
    {
      id: 'drums',
      name: 'Traditional Drums',
      nameCreole: 'Tanbou Tradisyonèl',
      emoji: '🥁',
      price: 12.99,
      category: 'cultural',
      rarity: 'epic',
      animation: { type: 'cultural', duration: 8000, particles: 20, sound: 'drums' },
      effect: { screen: 'music', intensity: 'heavy' },
      description: 'Cultural music celebration',
      descriptionCreole: 'Selebrasyon mizik kiltirèl',
      culturalSignificance: 'Heart of Haitian rhythm and cultural expression'
    },
    {
      id: 'haiti-flag',
      name: 'Haiti Flag Wave',
      nameCreole: 'Drapo Ayiti',
      emoji: '🇭🇹',
      price: 15.99,
      category: 'cultural',
      rarity: 'epic',
      animation: { type: 'wave', duration: 10000, particles: 8, sound: 'anthem' },
      effect: { screen: 'confetti', intensity: 'heavy' },
      description: 'Proud display of national pride',
      descriptionCreole: 'Ekspresyon fyètè nasyonal',
      culturalSignificance: 'Symbol of independence and national pride'
    },
    {
      id: 'carnival',
      name: 'Carnival Festival',
      nameCreole: 'Kanaval',
      emoji: '🎭',
      price: 24.99,
      category: 'cultural',
      rarity: 'legendary',
      animation: { type: 'cultural', duration: 15000, particles: 60, sound: 'carnival' },
      effect: { screen: 'cultural', intensity: 'epic' },
      description: 'Full carnival celebration with music and dance',
      descriptionCreole: 'Selebrasyon kanaval konplè ak mizik ak danse',
      culturalSignificance: 'The vibrant heart of Haitian celebration culture',
      unlockRequirement: 'Supporter of Haitian culture'
    }
  ]
};

interface GiftAnimationProps {
  gift: EnhancedVirtualGift;
  isPlaying: boolean;
  onComplete: () => void;
}

// Gift animation component
function GiftAnimation({ gift, isPlaying, onComplete }: GiftAnimationProps) {
  const [particles, setParticles] = useState<Array<{ id: string; x: number; y: number; delay: number }>>([]);

  useEffect(() => {
    if (isPlaying) {
      const newParticles = Array.from({ length: gift.animation.particles }, (_, i) => ({
        id: `particle-${i}`,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2000
      }));
      setParticles(newParticles);

      const timer = setTimeout(onComplete, gift.animation.duration);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, gift, onComplete]);

  if (!isPlaying) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute text-4xl"
          initial={{
            x: `${particle.x}%`,
            y: '100%',
            scale: 0,
            opacity: 0
          }}
          animate={{
            x: gift.animation.type === 'wave' ? [`${particle.x}%`, `${(particle.x + 20) % 100}%`] : `${particle.x}%`,
            y: gift.animation.type === 'rain' ? '-10%' : 
               gift.animation.type === 'float' ? '20%' : 
               gift.animation.type === 'burst' ? `${Math.random() * 40 + 30}%` :
               '50%',
            scale: [0, 1, 0.8],
            opacity: [0, 1, 0],
            rotate: gift.animation.type === 'dance' ? [0, 360] : 0
          }}
          transition={{
            duration: gift.animation.duration / 1000,
            delay: particle.delay / 1000,
            ease: gift.animation.type === 'burst' ? 'easeOut' : 'linear'
          }}
        >
          {gift.emoji}
        </motion.div>
      ))}
      
      {/* Screen effect overlay */}
      <motion.div
        className={cn(
          'absolute inset-0 pointer-events-none',
          gift.effect.screen === 'hearts' && 'bg-red-500/10',
          gift.effect.screen === 'sparkles' && 'bg-yellow-500/10',
          gift.effect.screen === 'confetti' && 'bg-purple-500/10',
          gift.effect.screen === 'fireworks' && 'bg-orange-500/10',
          gift.effect.screen === 'cultural' && 'bg-blue-500/10'
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: gift.animation.duration / 1000 }}
      />
    </div>
  );
}

interface EnhancedVirtualGiftsProps {
  onGiftSent: (gift: EnhancedVirtualGift, quantity: number, totalAmount: number) => void;
  userBalance: number;
  className?: string;
}

export function EnhancedVirtualGifts({ 
  onGiftSent, 
  userBalance, 
  className 
}: EnhancedVirtualGiftsProps) {
  const [selectedCategory, setSelectedCategory] = useState('basic');
  const [selectedGift, setSelectedGift] = useState<EnhancedVirtualGift | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const [playingAnimation, setPlayingAnimation] = useState<string | null>(null);
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);

  const currentGifts = VIRTUAL_GIFT_CATEGORIES[selectedCategory] || [];
  const totalCost = selectedGift ? selectedGift.price * quantity : 0;
  const canAfford = totalCost <= userBalance;

  const handleGiftSelect = (gift: EnhancedVirtualGift) => {
    setSelectedGift(gift);
    setQuantity(1);
  };

  const handlePreviewAnimation = (gift: EnhancedVirtualGift) => {
    setPlayingAnimation(gift.id);
  };

  const handleSendGift = () => {
    if (selectedGift && canAfford) {
      onGiftSent(selectedGift, quantity, totalCost);
      setShowPurchaseDialog(false);
      setSelectedGift(null);
      setQuantity(1);
      
      // Play animation after sending
      setPlayingAnimation(selectedGift.id);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600 border-gray-300';
      case 'rare': return 'text-blue-600 border-blue-300';
      case 'epic': return 'text-purple-600 border-purple-300';
      case 'legendary': return 'text-yellow-600 border-yellow-300';
      default: return 'text-gray-600 border-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'basic': return <Heart className="w-4 h-4" />;
      case 'premium': return <Star className="w-4 h-4" />;
      case 'mega': return <Crown className="w-4 h-4" />;
      case 'cultural': return <Flag className="w-4 h-4" />;
      default: return <Gift className="w-4 h-4" />;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">Virtual Gifts</h3>
          <p className="text-sm text-gray-600">Show your support with animated gifts</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Coins className="w-3 h-3 mr-1" />
            ${userBalance.toFixed(2)}
          </Badge>
        </div>
      </div>

      {/* Category Selection */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            {getCategoryIcon('basic')}
            Basic
            <Badge variant="secondary" className="text-xs">$0.99-4.99</Badge>
          </TabsTrigger>
          <TabsTrigger value="premium" className="flex items-center gap-2">
            {getCategoryIcon('premium')}
            Premium
            <Badge variant="secondary" className="text-xs">$5-24.99</Badge>
          </TabsTrigger>
          <TabsTrigger value="mega" className="flex items-center gap-2">
            {getCategoryIcon('mega')}
            Mega
            <Badge variant="secondary" className="text-xs">$25-99</Badge>
          </TabsTrigger>
          <TabsTrigger value="cultural" className="flex items-center gap-2">
            {getCategoryIcon('cultural')}
            Cultural
            <Badge variant="secondary" className="text-xs">Haiti</Badge>
          </TabsTrigger>
        </TabsList>

        {Object.entries(VIRTUAL_GIFT_CATEGORIES).map(([category, gifts]) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {gifts.map((gift) => (
                <Card
                  key={gift.id}
                  className={cn(
                    'cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2',
                    selectedGift?.id === gift.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200',
                    getRarityColor(gift.rarity)
                  )}
                  onClick={() => handleGiftSelect(gift)}
                >
                  <CardContent className="p-4 text-center space-y-3">
                    {/* Gift Emoji */}
                    <div className="text-4xl">{gift.emoji}</div>
                    
                    {/* Gift Info */}
                    <div>
                      <h4 className="font-semibold text-sm">{gift.name}</h4>
                      <p className="text-xs text-gray-500">{gift.nameCreole}</p>
                    </div>
                    
                    {/* Rarity Badge */}
                    <div className="flex justify-center">
                      <Badge 
                        variant="outline" 
                        className={cn('text-xs capitalize', getRarityColor(gift.rarity))}
                      >
                        {gift.rarity}
                      </Badge>
                    </div>
                    
                    {/* Price */}
                    <div className="font-bold text-lg text-green-600">
                      ${gift.price}
                    </div>
                    
                    {/* Preview Button */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePreviewAnimation(gift);
                      }}
                      className="w-full"
                    >
                      <PlayCircle className="w-3 h-3 mr-1" />
                      Preview
                    </Button>
                    
                    {/* Cultural Significance */}
                    {gift.culturalSignificance && (
                      <p className="text-xs text-blue-600 italic">
                        {gift.culturalSignificance}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Selected Gift Panel */}
      {selectedGift && (
        <Card className="border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <span className="text-3xl">{selectedGift.emoji}</span>
              <div>
                <h3 className="text-lg">{selectedGift.name}</h3>
                <p className="text-sm text-gray-600">{selectedGift.nameCreole}</p>
              </div>
            </CardTitle>
            <CardDescription>{selectedGift.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <Label className="text-sm font-medium">Quantity:</Label>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={quantity >= 10}
                >
                  +
                </Button>
              </div>
            </div>

            {/* Total Cost */}
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border">
              <span className="font-medium">Total Cost:</span>
              <span className="text-xl font-bold text-green-600">
                ${totalCost.toFixed(2)}
              </span>
            </div>

            {/* Send Button */}
            <div className="flex gap-2">
              <Button
                onClick={() => setShowPurchaseDialog(true)}
                disabled={!canAfford}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Gift className="w-4 h-4 mr-2" />
                Send Gift
              </Button>
              <Button
                variant="outline"
                onClick={() => handlePreviewAnimation(selectedGift)}
              >
                <PlayCircle className="w-4 h-4" />
              </Button>
            </div>

            {/* Affordability Warning */}
            {!canAfford && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                Insufficient balance. Add ${(totalCost - userBalance).toFixed(2)} to your account.
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Purchase Confirmation Dialog */}
      <Dialog open={showPurchaseDialog} onOpenChange={setShowPurchaseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-purple-600" />
              Confirm Gift Purchase
            </DialogTitle>
            <DialogDescription>
              Send this gift to the creator and show your support!
            </DialogDescription>
          </DialogHeader>
          
          {selectedGift && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <span className="text-3xl">{selectedGift.emoji}</span>
                <div className="flex-1">
                  <h4 className="font-semibold">{selectedGift.name}</h4>
                  <p className="text-sm text-gray-600">{selectedGift.nameCreole}</p>
                  <p className="text-xs text-gray-500">Quantity: {quantity}</p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">${totalCost.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setShowPurchaseDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendGift}
                  disabled={!canAfford}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Send Gift
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Animation Overlay */}
      {playingAnimation && (
        <GiftAnimation
          gift={VIRTUAL_GIFT_CATEGORIES[selectedCategory].find(g => g.id === playingAnimation)!}
          isPlaying={true}
          onComplete={() => setPlayingAnimation(null)}
        />
      )}
    </div>
  );
}