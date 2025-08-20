# Phase 2.3.5 - Creator-Controlled Booking & Pricing Section (REVISED)

## Overview
This revised specification enables creators to set their own pricing with optional rush delivery surcharges, providing flexibility while maintaining conversion optimization through psychological pricing strategies.

## Creator Pricing Control System

### Pricing Configuration Interface
**Purpose**: Empower creators to set competitive pricing based on their value proposition while maximizing their earning potential.

#### Creator Dashboard Pricing Settings

```typescript
interface CreatorPricingConfig {
  // Base Pricing
  basePrice: {
    amount: number        // Creator-defined base price
    currency: string      // USD, EUR, HTG, etc.
    minPrice: number      // Platform minimum ($20)
    maxPrice: number      // Platform maximum ($5000)
  }
  
  // Rush Delivery Options
  rushDelivery: {
    enabled: boolean
    surcharge: number | percentage  // Fixed amount or percentage
    deliveryTime: number  // Hours (e.g., 24, 48)
    maxOrders: number     // Capacity limit
  }
  
  // Optional Pricing Tiers
  tiers?: Array<{
    id: string
    name: string          // "Personal", "Business", "Extended"
    baseMultiplier: number
    features: string[]
    deliveryDays: number
  }>
  
  // Promotional Pricing
  promotions?: {
    discount: number      // Percentage off
    validUntil: Date
    firstTimeOnly?: boolean
    quantity?: number     // Limited quantity
  }
  
  // Bundle Options
  bundles?: Array<{
    quantity: number      // Number of videos
    discount: number      // Percentage discount
    validityMonths: number
  }>
}
```

### Dynamic Pricing Display Component

```typescript
interface PricingDisplayProps {
  creatorPricing: CreatorPricingConfig
  availability: CreatorAvailability
  demandLevel: "low" | "medium" | "high"
  userContext: {
    isFirstTime: boolean
    previousBookings: number
    giftPurchase: boolean
  }
}
```

#### Pricing Display Strategies

| Strategy | Implementation | Psychological Effect | Conversion Impact |
|----------|---------------|---------------------|-------------------|
| **Creator-Set Base** | Display creator's price prominently | Ownership/authenticity | Baseline |
| **Rush Premium** | "+$X for rush delivery" | Urgency option | +40% rush uptake |
| **Demand Indicators** | "High demand - book soon!" | Scarcity | +30% conversion |
| **Smart Discounts** | First-time customer savings | Acquisition | +25% new users |
| **Gift Framing** | "Gift option available" | Emotional purchase | +20% gift sales |
| **Value Anchoring** | Show comparable creator prices | Context | +15% acceptance |

### Booking Options Layout (Creator-Controlled)

```
Example for Creator Setting $150 Base Price:

┌─────────────────────────────────────────┐
│ 📹 Personal Video Message               │
│                                          │
│ 💵 $150                                  │
│ Set by [Creator Name]                   │
│                                          │
│ ⏱️ Delivery Options:                    │
│                                          │
│ ○ Standard (3-5 days) - $150            │
│   └── Regular delivery queue            │
│                                          │
│ ○ Rush (24 hours) - $225 (+$75)         │
│   └── ⚡ Priority delivery              │
│   └── 🔥 Only 2 rush slots left today   │
│                                          │
│ [Book Standard] [Book Rush]             │
└─────────────────────────────────────────┘
```

### Technical Implementation

#### Price Calculation Engine

```typescript
class PricingCalculator {
  calculateTotal(options: BookingOptions): PricingBreakdown {
    const base = creator.pricing.basePrice.amount
    const rush = options.rushDelivery ? 
      this.calculateRushSurcharge(base, creator.pricing.rushDelivery) : 0
    const bundle = options.quantity > 1 ? 
      this.calculateBundleDiscount(base, options.quantity) : 0
    const promo = this.getApplicablePromotion(userContext)
    
    return {
      basePrice: base,
      rushSurcharge: rush,
      bundleDiscount: bundle,
      promoDiscount: promo,
      platformFee: this.calculatePlatformFee(base + rush),
      creatorEarnings: this.calculateCreatorEarnings(base + rush),
      total: base + rush - bundle - promo
    }
  }
  
  private calculateRushSurcharge(base: number, rushConfig: RushConfig): number {
    if (rushConfig.surchargeType === 'percentage') {
      return base * (rushConfig.surcharge / 100)
    }
    return rushConfig.surcharge
  }
}
```

#### Dynamic Pricing UI Components

```typescript
// Real-time price preview
export function PricePreview({ 
  basePrice, 
  options, 
  onChange 
}: PricePreviewProps) {
  const [breakdown, setBreakdown] = useState<PricingBreakdown>()
  const [animatedTotal, setAnimatedTotal] = useState(basePrice)
  
  useEffect(() => {
    const newBreakdown = calculateTotal(options)
    setBreakdown(newBreakdown)
    
    // Animate price changes
    animateValue(animatedTotal, newBreakdown.total, 300)
  }, [options])
  
  return (
    <Card>
      <CardContent>
        <div className="space-y-3">
          {/* Base Price */}
          <div className="flex justify-between">
            <span>Video Message</span>
            <span>${basePrice}</span>
          </div>
          
          {/* Rush Surcharge */}
          {options.rushDelivery && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex justify-between text-orange-600"
            >
              <span>⚡ Rush Delivery</span>
              <span>+${breakdown.rushSurcharge}</span>
            </motion.div>
          )}
          
          {/* Total */}
          <div className="pt-3 border-t font-bold text-lg">
            <div className="flex justify-between">
              <span>Total</span>
              <motion.span>
                ${animatedTotal.toFixed(2)}
              </motion.span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
```

### Creator Pricing Analytics Dashboard

```typescript
interface PricingAnalytics {
  // Performance Metrics
  metrics: {
    averageOrderValue: number
    rushDeliveryRate: number    // % choosing rush
    conversionByPrice: Map<number, number>
    optimalPricePoint: number   // ML-suggested price
  }
  
  // Comparative Analysis
  comparison: {
    categoryAverage: number
    percentile: number           // Where creator ranks
    suggestedAdjustment?: number
  }
  
  // Revenue Optimization
  optimization: {
    currentRevenue: number
    projectedWithSuggested: number
    elasticityScore: number      // Price sensitivity
  }
}
```

### Smart Pricing Recommendations

```typescript
class PricingRecommendationEngine {
  async generateRecommendations(
    creator: Creator,
    historicalData: BookingHistory
  ): Promise<PricingRecommendations> {
    const analysis = await this.analyzePerformance(historicalData)
    
    return {
      optimal: {
        basePrice: this.calculateOptimalBase(analysis),
        rushSurcharge: this.calculateOptimalRush(analysis),
        reasoning: this.generateReasoning(analysis)
      },
      experiments: [
        {
          type: 'price_test',
          variation: '+10%',
          expectedImpact: this.predictImpact(creator, 1.1)
        },
        {
          type: 'rush_pricing',
          variation: 'dynamic',
          expectedImpact: this.predictRushImpact(creator)
        }
      ],
      alerts: this.generatePricingAlerts(analysis)
    }
  }
}
```

### Availability-Based Pricing

```typescript
interface DynamicPricingRules {
  // Scarcity Pricing
  scarcity: {
    enabled: boolean
    trigger: number              // Slots remaining
    multiplier: number           // Price increase
    message: string              // "Only X slots left!"
  }
  
  // Peak Time Pricing
  peakHours: {
    enabled: boolean
    schedule: TimeRange[]
    surcharge: number
  }
  
  // Holiday Pricing
  specialDates: Array<{
    date: Date
    name: string
    multiplier: number
  }>
}
```

### Conversion Optimization Features

#### Psychological Pricing Display
```typescript
function OptimizedPriceDisplay({ price, context }: Props) {
  // Price ending optimization
  const optimizedPrice = optimizePriceEnding(price) // $149 vs $150
  
  // Context-based messaging
  const message = getPricingMessage(context)
  // Examples:
  // - "30% below category average!"
  // - "Most popular price point"
  // - "Limited time offer"
  
  // Social proof integration
  const socialProof = getSocialProof(creatorId)
  // "87% of customers chose this option"
  
  return (
    <div className="pricing-display">
      <PriceAmount value={optimizedPrice} />
      <PriceContext message={message} />
      <SocialProof data={socialProof} />
    </div>
  )
}
```

### Implementation Checklist

- [ ] Creator pricing configuration interface
- [ ] Dynamic pricing calculation engine
- [ ] Rush delivery surcharge system
- [ ] Real-time price preview component
- [ ] Pricing analytics dashboard
- [ ] Smart pricing recommendations
- [ ] A/B testing framework for pricing
- [ ] Conversion tracking by price point
- [ ] Competitive pricing analysis
- [ ] Revenue optimization algorithms

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Creator Adoption | 90% set custom prices | Dashboard usage |
| Rush Delivery Uptake | 25% of bookings | Order analysis |
| Average Order Value | +20% increase | Revenue tracking |
| Price Optimization | 15% revenue boost | A/B testing |
| Creator Satisfaction | 4.5/5 rating | Feedback surveys |

### Migration Strategy

1. **Phase 1**: Enable pricing controls for select creators
2. **Phase 2**: Gather data and optimize recommendations
3. **Phase 3**: Roll out to all creators with best practices
4. **Phase 4**: Implement dynamic pricing features
5. **Phase 5**: Launch ML-powered pricing optimization

This revised specification empowers creators with pricing control while maintaining platform optimization for conversions and user experience.