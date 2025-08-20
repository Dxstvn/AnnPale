'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play,
  Users,
  Star,
  ChevronRight,
  CheckCircle,
  Lock,
  Gift,
  Sparkles,
  TrendingUp,
  Heart,
  Shield,
  Crown,
  Video,
  MessageSquare,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface DiscoveryStepProps {
  creatorName?: string;
  subscriberCount?: number;
  onContinue?: () => void;
  onLearnMore?: () => void;
  showPreview?: boolean;
}

export function DiscoveryStep({
  creatorName = 'Creator',
  subscriberCount = 5234,
  onContinue,
  onLearnMore,
  showPreview = true
}: DiscoveryStepProps) {
  const [hoveredBenefit, setHoveredBenefit] = React.useState<string | null>(null);
  const [playingPreview, setPlayingPreview] = React.useState(false);

  // Key benefits for discovery
  const keyBenefits = [
    {
      id: 'exclusive',
      icon: Lock,
      title: 'Exclusive Content',
      description: 'Members-only videos and behind-the-scenes',
      color: 'text-purple-600 bg-purple-100'
    },
    {
      id: 'interaction',
      icon: MessageSquare,
      title: 'Direct Interaction',
      description: 'Chat and connect with your favorite creator',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      id: 'community',
      icon: Users,
      title: 'Join Community',
      description: 'Be part of an exclusive fan community',
      color: 'text-green-600 bg-green-100'
    },
    {
      id: 'perks',
      icon: Gift,
      title: 'Special Perks',
      description: 'Discounts, gifts, and surprise benefits',
      color: 'text-yellow-600 bg-yellow-100'
    }
  ];

  // Sample exclusive content previews
  const contentPreviews = [
    { type: 'video', title: 'Behind the Scenes', duration: '5:23', locked: true },
    { type: 'live', title: 'Members-Only Live Stream', date: 'Tomorrow 8PM', locked: true },
    { type: 'post', title: 'Personal Story', likes: 234, locked: true },
    { type: 'video', title: 'Exclusive Tutorial', duration: '12:45', locked: true }
  ];

  // Social proof stats
  const socialProof = [
    { metric: 'Active Members', value: subscriberCount.toLocaleString(), icon: Users },
    { metric: 'Exclusive Videos', value: '150+', icon: Video },
    { metric: 'Member Rating', value: '4.9★', icon: Star },
    { metric: 'Response Rate', value: '98%', icon: MessageSquare }
  ];

  // Tier preview
  const tierHighlights = [
    { tier: 'Bronze', price: '$9.99', benefit: 'Monthly exclusive video', icon: Shield, color: 'text-orange-600' },
    { tier: 'Silver', price: '$24.99', benefit: 'Weekly content + Live access', icon: Star, color: 'text-gray-600' },
    { tier: 'Gold', price: '$49.99', benefit: 'Daily content + Video calls', icon: Crown, color: 'text-yellow-600' }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200 overflow-hidden">
        <CardContent className="p-8">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-block"
            >
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
            </motion.div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Join {creatorName}'s Exclusive Community
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
              Get exclusive content, direct access, and special perks as a member
            </p>
            
            {/* Social Proof Badge */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <Badge variant="secondary" className="bg-white text-purple-700 text-sm px-4 py-2">
                <Users className="h-4 w-4 mr-2" />
                {subscriberCount.toLocaleString()} Active Members
              </Badge>
              <Badge variant="secondary" className="bg-white text-pink-700 text-sm px-4 py-2">
                <TrendingUp className="h-4 w-4 mr-2" />
                Growing Community
              </Badge>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                onClick={onContinue}
              >
                Start Your Membership
                <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={onLearnMore}
              >
                Learn More
              </Button>
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              ✓ 7-day free trial • ✓ Cancel anytime • ✓ Instant access
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Content Preview */}
      {showPreview && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Exclusive Content Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {contentPreviews.map((content, idx) => (
                <div 
                  key={idx}
                  className="relative p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer group"
                  onClick={() => setPlayingPreview(true)}
                >
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      {content.type === 'video' && <Video className="h-6 w-6 text-purple-600" />}
                      {content.type === 'live' && <Play className="h-6 w-6 text-red-600" />}
                      {content.type === 'post' && <MessageSquare className="h-6 w-6 text-blue-600" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm mb-1">{content.title}</h4>
                      <p className="text-xs text-gray-500">
                        {content.duration && content.duration}
                        {content.date && content.date}
                        {content.likes && `${content.likes} likes`}
                      </p>
                    </div>
                    {content.locked && (
                      <Lock className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
                    )}
                  </div>
                  {idx === 0 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-pink-600/10 rounded-lg pointer-events-none" />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-4">
              + Hundreds more exclusive content pieces waiting for you
            </p>
          </CardContent>
        </Card>
      )}

      {/* Key Benefits */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {keyBenefits.map((benefit) => {
          const Icon = benefit.icon;
          return (
            <motion.div
              key={benefit.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all"
                onMouseEnter={() => setHoveredBenefit(benefit.id)}
                onMouseLeave={() => setHoveredBenefit(null)}
              >
                <CardContent className="p-4">
                  <div className={cn(
                    "w-12 h-12 rounded-lg flex items-center justify-center mb-3",
                    benefit.color
                  )}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{benefit.title}</h3>
                  <p className="text-xs text-gray-600">{benefit.description}</p>
                  {hoveredBenefit === benefit.id && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2"
                    >
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Social Proof Stats */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {socialProof.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.metric} className="text-center">
                  <Icon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.metric}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Tier Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Choose Your Membership Level</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {tierHighlights.map((tier) => {
              const Icon = tier.icon;
              return (
                <div 
                  key={tier.tier}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className={cn("h-5 w-5", tier.color)} />
                    <h4 className="font-semibold">{tier.tier}</h4>
                  </div>
                  <div className="text-2xl font-bold mb-1">{tier.price}</div>
                  <p className="text-sm text-gray-600">{tier.benefit}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center mt-4">
            <Button variant="link" onClick={onContinue}>
              See full comparison
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Trust Signals */}
      <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-green-600" />
          <span>Secure Payment</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-blue-600" />
          <span>Cancel Anytime</span>
        </div>
        <div className="flex items-center gap-2">
          <Heart className="h-4 w-4 text-red-600" />
          <span>Support Creator</span>
        </div>
      </div>
    </div>
  );
}