'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Video,
  Clock,
  Download,
  Globe,
  Archive,
  Film,
  Lock,
  Unlock,
  Star,
  Crown,
  Shield,
  Play,
  FileVideo,
  Languages,
  Calendar,
  Sparkles,
  ChevronRight,
  CheckCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface ContentBenefit {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  availability: {
    bronze: boolean;
    silver: boolean;
    gold: boolean;
  };
  value: {
    perceived: number; // 0-100
    actual: number; // in dollars
  };
  usage?: {
    current: number;
    limit?: number;
  };
  examples?: string[];
}

interface ContentBenefitsProps {
  currentTier?: 'bronze' | 'silver' | 'gold' | 'none';
  onBenefitSelect?: (benefit: ContentBenefit) => void;
  showValue?: boolean;
}

export function ContentBenefits({
  currentTier = 'none',
  onBenefitSelect,
  showValue = false
}: ContentBenefitsProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<'exclusive' | 'early' | 'extended' | 'archived' | 'downloadable' | 'multilingual'>('exclusive');

  // Content benefit categories
  const contentBenefits: Record<string, ContentBenefit[]> = {
    exclusive: [
      {
        id: 'exclusive-videos',
        title: 'Exclusive Videos',
        description: 'Access members-only video content',
        icon: Video,
        availability: { bronze: true, silver: true, gold: true },
        value: { perceived: 90, actual: 50 },
        usage: { current: 12, limit: undefined },
        examples: ['Behind-the-scenes', 'Personal vlogs', 'Tutorials']
      },
      {
        id: 'premium-series',
        title: 'Premium Series',
        description: 'Multi-part exclusive content series',
        icon: Film,
        availability: { bronze: false, silver: true, gold: true },
        value: { perceived: 85, actual: 75 },
        usage: { current: 3, limit: undefined },
        examples: ['Documentary series', 'Training courses', 'Story arcs']
      },
      {
        id: 'vip-content',
        title: 'VIP Content',
        description: 'Ultra-exclusive content for top tier',
        icon: Crown,
        availability: { bronze: false, silver: false, gold: true },
        value: { perceived: 95, actual: 100 },
        usage: { current: 5, limit: undefined },
        examples: ['Personal messages', 'Special events', 'Rare footage']
      }
    ],
    early: [
      {
        id: 'early-24h',
        title: '24-Hour Early Access',
        description: 'Watch new content 24 hours early',
        icon: Clock,
        availability: { bronze: true, silver: true, gold: true },
        value: { perceived: 70, actual: 0 },
        examples: ['New videos', 'Announcements', 'Updates']
      },
      {
        id: 'early-48h',
        title: '48-Hour Early Access',
        description: 'Watch new content 48 hours early',
        icon: Clock,
        availability: { bronze: false, silver: true, gold: true },
        value: { perceived: 75, actual: 0 },
        examples: ['Premium releases', 'Special content']
      },
      {
        id: 'early-week',
        title: 'Week Early Access',
        description: 'Get content a full week before public',
        icon: Calendar,
        availability: { bronze: false, silver: false, gold: true },
        value: { perceived: 85, actual: 0 },
        examples: ['Major releases', 'Exclusive previews']
      }
    ],
    extended: [
      {
        id: 'extended-cuts',
        title: 'Extended Cuts',
        description: 'Longer versions of public content',
        icon: Film,
        availability: { bronze: true, silver: true, gold: true },
        value: { perceived: 75, actual: 25 },
        usage: { current: 8 },
        examples: ['Director\'s cuts', 'Unedited versions', 'Bonus scenes']
      },
      {
        id: 'raw-footage',
        title: 'Raw Footage',
        description: 'Unedited original recordings',
        icon: FileVideo,
        availability: { bronze: false, silver: false, gold: true },
        value: { perceived: 80, actual: 40 },
        usage: { current: 15 },
        examples: ['Behind-camera', 'Outtakes', 'Full sessions']
      }
    ],
    archived: [
      {
        id: 'archive-6months',
        title: '6-Month Archive',
        description: 'Access content from past 6 months',
        icon: Archive,
        availability: { bronze: true, silver: true, gold: true },
        value: { perceived: 60, actual: 20 },
        usage: { current: 45 },
        examples: ['Past streams', 'Old videos', 'Previous events']
      },
      {
        id: 'archive-1year',
        title: '1-Year Archive',
        description: 'Access content from past year',
        icon: Archive,
        availability: { bronze: false, silver: true, gold: true },
        value: { perceived: 70, actual: 30 },
        usage: { current: 120 },
        examples: ['Full year catalog', 'Seasonal content']
      },
      {
        id: 'archive-unlimited',
        title: 'Unlimited Archive',
        description: 'Access all historical content',
        icon: Archive,
        availability: { bronze: false, silver: false, gold: true },
        value: { perceived: 85, actual: 50 },
        usage: { current: 500 },
        examples: ['Complete history', 'Rare content', 'Classics']
      }
    ],
    downloadable: [
      {
        id: 'download-sd',
        title: 'SD Downloads',
        description: 'Download content in standard quality',
        icon: Download,
        availability: { bronze: true, silver: true, gold: true },
        value: { perceived: 65, actual: 10 },
        usage: { current: 5, limit: 10 },
        examples: ['480p videos', 'Offline viewing']
      },
      {
        id: 'download-hd',
        title: 'HD Downloads',
        description: 'Download content in high quality',
        icon: Download,
        availability: { bronze: false, silver: true, gold: true },
        value: { perceived: 75, actual: 15 },
        usage: { current: 8, limit: 20 },
        examples: ['1080p videos', 'High quality']
      },
      {
        id: 'download-4k',
        title: '4K Downloads',
        description: 'Download content in ultra-high quality',
        icon: Download,
        availability: { bronze: false, silver: false, gold: true },
        value: { perceived: 90, actual: 25 },
        usage: { current: 3, limit: undefined },
        examples: ['4K videos', 'Maximum quality']
      }
    ],
    multilingual: [
      {
        id: 'subtitles',
        title: 'Multi-Language Subtitles',
        description: 'Subtitles in multiple languages',
        icon: Languages,
        availability: { bronze: true, silver: true, gold: true },
        value: { perceived: 55, actual: 5 },
        examples: ['English', 'French', 'Haitian Creole', 'Spanish']
      },
      {
        id: 'dubbed',
        title: 'Dubbed Content',
        description: 'Audio in different languages',
        icon: Globe,
        availability: { bronze: false, silver: false, gold: true },
        value: { perceived: 70, actual: 30 },
        examples: ['Professional dubbing', 'Native speakers']
      }
    ]
  };

  // Category metadata
  const categories = [
    { id: 'exclusive', name: 'Exclusive Content', icon: Lock, color: 'from-purple-400 to-purple-600' },
    { id: 'early', name: 'Early Access', icon: Clock, color: 'from-blue-400 to-blue-600' },
    { id: 'extended', name: 'Extended Versions', icon: Film, color: 'from-green-400 to-green-600' },
    { id: 'archived', name: 'Archived Content', icon: Archive, color: 'from-orange-400 to-orange-600' },
    { id: 'downloadable', name: 'Downloadable', icon: Download, color: 'from-pink-400 to-pink-600' },
    { id: 'multilingual', name: 'Multi-Language', icon: Globe, color: 'from-indigo-400 to-indigo-600' }
  ];

  // Check if user has access to benefit
  const hasAccess = (benefit: ContentBenefit): boolean => {
    if (currentTier === 'none') return false;
    return benefit.availability[currentTier as keyof typeof benefit.availability];
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

  // Calculate total value
  const calculateTotalValue = () => {
    const benefits = Object.values(contentBenefits).flat();
    const accessibleBenefits = benefits.filter(b => hasAccess(b));
    const totalPerceived = accessibleBenefits.reduce((sum, b) => sum + b.value.perceived, 0) / benefits.length;
    const totalActual = accessibleBenefits.reduce((sum, b) => sum + b.value.actual, 0);
    
    return { perceived: totalPerceived, actual: totalActual };
  };

  const totalValue = calculateTotalValue();
  const selectedCategoryData = contentBenefits[selectedCategory];
  const selectedCategoryMeta = categories.find(c => c.id === selectedCategory)!;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Content Benefits</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Exclusive content access for members</p>
            </div>
            {currentTier !== 'none' && (
              <div className="text-right">
                <Badge variant="outline" className="mb-1">
                  {currentTier.charAt(0).toUpperCase() + currentTier.slice(1)} Member
                </Badge>
                {showValue && (
                  <p className="text-sm text-gray-600">
                    Value: ${totalValue.actual}/month
                  </p>
                )}
              </div>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Category Selection */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategory === category.id;
          
          return (
            <motion.button
              key={category.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedCategory(category.id as any)}
              className={cn(
                "p-3 rounded-lg border-2 transition-all",
                isSelected 
                  ? "border-purple-500 bg-gradient-to-br " + category.color + " text-white"
                  : "border-gray-200 hover:border-purple-300 bg-white"
              )}
            >
              <Icon className={cn(
                "h-6 w-6 mx-auto mb-1",
                isSelected ? "text-white" : "text-gray-600"
              )} />
              <p className={cn(
                "text-xs font-medium",
                isSelected ? "text-white" : "text-gray-700"
              )}>
                {category.name}
              </p>
            </motion.button>
          );
        })}
      </div>

      {/* Benefits Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
              selectedCategoryMeta.color
            )}>
              <selectedCategoryMeta.icon className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{selectedCategoryMeta.name}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedCategoryData.map((benefit) => {
              const Icon = benefit.icon;
              const accessible = hasAccess(benefit);
              
              return (
                <motion.div
                  key={benefit.id}
                  whileHover={{ x: accessible ? 4 : 0 }}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    accessible 
                      ? "border-gray-200 hover:border-purple-300 hover:bg-purple-50 cursor-pointer"
                      : "border-gray-100 bg-gray-50 opacity-60"
                  )}
                  onClick={() => accessible && onBenefitSelect?.(benefit)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center",
                        accessible ? "bg-purple-100" : "bg-gray-100"
                      )}>
                        <Icon className={cn(
                          "h-5 w-5",
                          accessible ? "text-purple-600" : "text-gray-400"
                        )} />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{benefit.title}</h4>
                          {accessible ? (
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Available
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">
                              <Lock className="h-3 w-3 mr-1" />
                              Upgrade Required
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-2">{benefit.description}</p>
                        
                        {/* Availability Tiers */}
                        <div className="flex items-center gap-2 mb-2">
                          {(['bronze', 'silver', 'gold'] as const).map((tier) => {
                            const TierIcon = getTierIcon(tier);
                            const available = benefit.availability[tier];
                            
                            return (
                              <div
                                key={tier}
                                className={cn(
                                  "flex items-center gap-1 px-2 py-1 rounded text-xs",
                                  available 
                                    ? "bg-green-50 text-green-700"
                                    : "bg-gray-50 text-gray-400"
                                )}
                              >
                                <TierIcon className="h-3 w-3" />
                                <span className="capitalize">{tier}</span>
                              </div>
                            );
                          })}
                        </div>
                        
                        {/* Usage/Examples */}
                        {benefit.usage && (
                          <div className="mb-2">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-gray-600">Usage</span>
                              <span className="text-xs font-medium">
                                {benefit.usage.current}
                                {benefit.usage.limit && ` / ${benefit.usage.limit}`}
                              </span>
                            </div>
                            {benefit.usage.limit && (
                              <Progress 
                                value={(benefit.usage.current / benefit.usage.limit) * 100}
                                className="h-1"
                              />
                            )}
                          </div>
                        )}
                        
                        {benefit.examples && (
                          <div className="flex flex-wrap gap-1">
                            {benefit.examples.map((example, idx) => (
                              <Badge 
                                key={idx} 
                                variant="secondary"
                                className="text-xs"
                              >
                                {example}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Value Indicator */}
                    {showValue && (
                      <div className="text-right">
                        <div className="text-xs text-gray-600">Value</div>
                        <div className="text-lg font-bold text-purple-600">
                          ${benefit.value.actual}
                        </div>
                        <div className="w-12 bg-gray-200 rounded-full h-1 mt-1">
                          <div 
                            className="bg-purple-500 h-1 rounded-full"
                            style={{ width: `${benefit.value.perceived}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Value Summary */}
      {showValue && currentTier !== 'none' && (
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Total Content Value</h3>
                <p className="text-sm text-gray-600">
                  Based on your {currentTier} membership
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-purple-600">
                  ${totalValue.actual}
                </p>
                <p className="text-sm text-gray-600">per month</p>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-gray-600">Perceived Value</span>
                <span className="text-sm font-medium">{totalValue.perceived.toFixed(0)}%</span>
              </div>
              <Progress value={totalValue.perceived} className="h-2" />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}