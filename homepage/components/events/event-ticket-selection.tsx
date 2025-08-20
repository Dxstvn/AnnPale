'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Crown,
  Star,
  Users,
  Clock,
  Gift,
  Ticket,
  Plus,
  Minus,
  Check,
  X,
  AlertCircle,
  Percent,
  Shield,
  Zap,
  Video,
  MessageCircle,
  Download,
  Coffee,
  Award,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  currency: string;
  description: string;
  perks: string[];
  icon: React.ElementType;
  color: string;
  spotsAvailable: number;
  maxPerOrder: number;
  isRecommended?: boolean;
  isSoldOut?: boolean;
  earlyBird?: {
    discount: number;
    endsAt: Date;
  };
  groupDiscount?: {
    minQuantity: number;
    discountPercent: number;
  };
}

export interface PromoCode {
  code: string;
  discount: number; // percentage or fixed amount
  type: 'percentage' | 'fixed';
  validUntil?: Date;
  minPurchase?: number;
}

interface EventTicketSelectionProps {
  eventId: string;
  tiers: TicketTier[];
  onPurchase: (selections: TicketSelection[]) => void;
  onApplyPromo?: (code: string) => PromoCode | null;
  className?: string;
}

interface TicketSelection {
  tierId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// Default ticket tiers based on Phase 4.2.3 specifications
export const DEFAULT_TICKET_TIERS: Omit<TicketTier, 'spotsAvailable'>[] = [
  {
    id: 'general',
    name: 'General Admission',
    price: 25,
    currency: 'USD',
    description: 'Full access to the live event',
    perks: [
      'Live event access',
      'Chat participation',
      'Event recording (24h)',
      'Certificate of attendance'
    ],
    icon: Ticket,
    color: 'bg-gray-500',
    maxPerOrder: 10,
    groupDiscount: {
      minQuantity: 5,
      discountPercent: 15
    }
  },
  {
    id: 'vip',
    name: 'VIP Pass',
    price: 75,
    originalPrice: 100,
    currency: 'USD',
    description: 'Premium experience with exclusive perks',
    perks: [
      'Everything in General',
      'Front row virtual seating',
      'Q&A participation priority',
      'Exclusive VIP chat room',
      'Downloadable content',
      'Extended recording access (30 days)'
    ],
    icon: Star,
    color: 'bg-purple-500',
    maxPerOrder: 5,
    isRecommended: true
  },
  {
    id: 'platinum',
    name: 'Platinum Experience',
    price: 250,
    currency: 'USD',
    description: 'Ultimate access with meet & greet',
    perks: [
      'Everything in VIP',
      '1-on-1 meet & greet (15 min)',
      'Personalized shoutout',
      'Lifetime recording access',
      'Exclusive merchandise',
      'Future event discount (25%)',
      'Behind-the-scenes content'
    ],
    icon: Crown,
    color: 'bg-yellow-500',
    maxPerOrder: 1,
    isSoldOut: false
  }
];

function TicketTierCard({
  tier,
  quantity,
  onQuantityChange,
  isSelected
}: {
  tier: TicketTier;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  isSelected: boolean;
}) {
  const Icon = tier.icon;
  const isEarlyBird = tier.earlyBird && new Date() < new Date(tier.earlyBird.endsAt);
  const hasGroupDiscount = tier.groupDiscount && quantity >= tier.groupDiscount.minQuantity;
  
  const calculatePrice = () => {
    let price = tier.price;
    
    if (isEarlyBird && tier.earlyBird) {
      price = price * (1 - tier.earlyBird.discount / 100);
    }
    
    if (hasGroupDiscount && tier.groupDiscount) {
      price = price * (1 - tier.groupDiscount.discountPercent / 100);
    }
    
    return price;
  };

  const finalPrice = calculatePrice();
  const totalPrice = finalPrice * quantity;

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all",
        isSelected && "ring-2 ring-primary shadow-lg",
        tier.isSoldOut && "opacity-60"
      )}
    >
      {tier.isRecommended && !tier.isSoldOut && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
          RECOMMENDED
        </div>
      )}

      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-lg text-white", tier.color)}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">{tier.name}</CardTitle>
              <CardDescription>{tier.description}</CardDescription>
            </div>
          </div>
        </div>

        {/* Price Display */}
        <div className="mt-4">
          <div className="flex items-baseline gap-2">
            {tier.originalPrice && (
              <span className="text-lg text-gray-400 line-through">
                ${tier.originalPrice}
              </span>
            )}
            <span className="text-3xl font-bold">
              ${finalPrice.toFixed(2)}
            </span>
            <span className="text-gray-500">/ ticket</span>
          </div>

          {/* Active Discounts */}
          <div className="flex flex-wrap gap-2 mt-2">
            {isEarlyBird && tier.earlyBird && (
              <Badge className="bg-green-100 text-green-700">
                <Clock className="h-3 w-3 mr-1" />
                Early Bird -{tier.earlyBird.discount}%
              </Badge>
            )}
            {hasGroupDiscount && tier.groupDiscount && (
              <Badge className="bg-blue-100 text-blue-700">
                <Users className="h-3 w-3 mr-1" />
                Group -{tier.groupDiscount.discountPercent}%
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Perks List */}
        <div className="space-y-2">
          {tier.perks.map((perk, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{perk}</span>
            </div>
          ))}
        </div>

        {/* Availability */}
        {!tier.isSoldOut && tier.spotsAvailable < 10 && (
          <div className="p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              Only {tier.spotsAvailable} spots left!
            </p>
          </div>
        )}

        {/* Quantity Selector */}
        {tier.isSoldOut ? (
          <div className="p-3 bg-gray-100 rounded-lg text-center">
            <p className="text-gray-600 font-medium">Sold Out</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Quantity</Label>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
                  disabled={quantity === 0}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={() => onQuantityChange(Math.min(tier.maxPerOrder, quantity + 1))}
                  disabled={quantity >= tier.maxPerOrder || quantity >= tier.spotsAvailable}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {quantity > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-primary/5 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Subtotal:</span>
                  <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
                </div>
                {tier.groupDiscount && quantity >= tier.groupDiscount.minQuantity - 1 && quantity < tier.groupDiscount.minQuantity && (
                  <p className="text-xs text-orange-600 mt-1">
                    Add {tier.groupDiscount.minQuantity - quantity} more for group discount!
                  </p>
                )}
              </motion.div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function EventTicketSelection({
  eventId,
  tiers,
  onPurchase,
  onApplyPromo,
  className
}: EventTicketSelectionProps) {
  const [selections, setSelections] = React.useState<Map<string, number>>(new Map());
  const [promoCode, setPromoCode] = React.useState('');
  const [appliedPromo, setAppliedPromo] = React.useState<PromoCode | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = React.useState(false);
  const [promoError, setPromoError] = React.useState('');

  const handleQuantityChange = (tierId: string, quantity: number) => {
    const newSelections = new Map(selections);
    if (quantity === 0) {
      newSelections.delete(tierId);
    } else {
      newSelections.set(tierId, quantity);
    }
    setSelections(newSelections);
  };

  const handleApplyPromo = () => {
    if (!promoCode || !onApplyPromo) return;
    
    setIsApplyingPromo(true);
    setPromoError('');
    
    const promo = onApplyPromo(promoCode);
    
    if (promo) {
      setAppliedPromo(promo);
      setPromoError('');
    } else {
      setPromoError('Invalid or expired promo code');
    }
    
    setIsApplyingPromo(false);
  };

  const calculateTotal = (): { subtotal: number; discount: number; total: number; selections: TicketSelection[] } => {
    let subtotal = 0;
    const ticketSelections: TicketSelection[] = [];

    selections.forEach((quantity, tierId) => {
      const tier = tiers.find(t => t.id === tierId);
      if (!tier) return;

      let unitPrice = tier.price;
      
      // Apply early bird discount
      if (tier.earlyBird && new Date() < new Date(tier.earlyBird.endsAt)) {
        unitPrice = unitPrice * (1 - tier.earlyBird.discount / 100);
      }
      
      // Apply group discount
      if (tier.groupDiscount && quantity >= tier.groupDiscount.minQuantity) {
        unitPrice = unitPrice * (1 - tier.groupDiscount.discountPercent / 100);
      }

      const totalPrice = unitPrice * quantity;
      subtotal += totalPrice;

      ticketSelections.push({
        tierId,
        quantity,
        unitPrice,
        totalPrice
      });
    });

    let discount = 0;
    if (appliedPromo) {
      if (appliedPromo.type === 'percentage') {
        discount = subtotal * (appliedPromo.discount / 100);
      } else {
        discount = Math.min(appliedPromo.discount, subtotal);
      }
    }

    return {
      subtotal,
      discount,
      total: subtotal - discount,
      selections: ticketSelections
    };
  };

  const { subtotal, discount, total, selections: ticketSelections } = calculateTotal();
  const hasSelections = selections.size > 0;

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h2 className="text-2xl font-bold mb-2">Select Your Tickets</h2>
        <p className="text-gray-600">Choose your ticket tier and quantity</p>
      </div>

      {/* Ticket Tiers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {tiers.map((tier) => (
          <TicketTierCard
            key={tier.id}
            tier={tier}
            quantity={selections.get(tier.id) || 0}
            onQuantityChange={(q) => handleQuantityChange(tier.id, q)}
            isSelected={selections.has(tier.id)}
          />
        ))}
      </div>

      {/* Promo Code & Summary */}
      {hasSelections && (
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selected Tickets */}
            <div className="space-y-2">
              {Array.from(selections.entries()).map(([tierId, quantity]) => {
                const tier = tiers.find(t => t.id === tierId);
                if (!tier) return null;
                
                const selection = ticketSelections.find(s => s.tierId === tierId);
                if (!selection) return null;

                return (
                  <div key={tierId} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">{tier.name}</p>
                      <p className="text-sm text-gray-600">
                        {quantity} × ${selection.unitPrice.toFixed(2)}
                      </p>
                    </div>
                    <span className="font-medium">${selection.totalPrice.toFixed(2)}</span>
                  </div>
                );
              })}
            </div>

            {/* Promo Code */}
            <div className="space-y-2">
              <Label>Promo Code</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  disabled={!!appliedPromo}
                />
                {appliedPromo ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setAppliedPromo(null);
                      setPromoCode('');
                    }}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    onClick={handleApplyPromo}
                    disabled={!promoCode || isApplyingPromo}
                  >
                    Apply
                  </Button>
                )}
              </div>
              {promoError && (
                <p className="text-sm text-red-600">{promoError}</p>
              )}
              {appliedPromo && (
                <p className="text-sm text-green-600 flex items-center gap-1">
                  <Check className="h-4 w-4" />
                  Promo code applied: {appliedPromo.discount}
                  {appliedPromo.type === 'percentage' ? '%' : ` ${tiers[0]?.currency || 'USD'}`} off
                </p>
              )}
            </div>

            {/* Total */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Purchase Button */}
            <Button
              size="lg"
              className="w-full"
              onClick={() => onPurchase(ticketSelections)}
            >
              <Shield className="h-5 w-5 mr-2" />
              Proceed to Secure Checkout
            </Button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                Secure Payment
              </span>
              <span className="flex items-center gap-1">
                <Check className="h-3 w-3" />
                Instant Confirmation
              </span>
              <span className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                Refund Guarantee
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}