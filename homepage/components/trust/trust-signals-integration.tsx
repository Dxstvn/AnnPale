"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

// Import all trust components
import { 
  VerificationBadge, 
  CompositeVerification,
  AchievementBadge,
  TrustScore,
  type VerificationLevel,
  type AchievementType
} from "./verification-badges"
import { 
  SocialProofMetrics,
  MetricHighlight,
  type SocialProofMetrics as MetricsType
} from "./social-proof-metrics"
import { 
  RatingDisplay,
  RatingBreakdown,
  ReviewsSection,
  type Review,
  type RatingDistribution
} from "./rating-reviews"
import { 
  ResponseIndicator,
  ResponseComparison,
  type ResponseTimeData
} from "./response-indicators"
import { 
  MediaCoverage,
  MediaBadge,
  type MediaItem
} from "./media-coverage"

// Combined trust data interface
export interface TrustSignalsData {
  // Verification
  verificationLevels: VerificationLevel[]
  achievements: AchievementType[]
  trustScore: number

  // Social proof
  metrics: MetricsType

  // Ratings & reviews
  rating: number
  totalReviews: number
  distribution: RatingDistribution
  reviews: Review[]

  // Response time
  responseData: ResponseTimeData

  // Media coverage
  mediaItems: MediaItem[]
}

interface TrustSignalsProps {
  data: TrustSignalsData
  variant?: "card" | "profile" | "minimal"
  showAll?: boolean
  className?: string
}

// Card variant - for creator cards
function TrustSignalsCard({ 
  data 
}: { 
  data: TrustSignalsData 
}) {
  return (
    <div className="space-y-3">
      {/* Top row: Verification + Rating */}
      <div className="flex items-center justify-between">
        <CompositeVerification 
          verifications={data.verificationLevels}
          size="sm"
        />
        <RatingDisplay
          rating={data.rating}
          totalReviews={data.totalReviews}
          size="sm"
        />
      </div>

      {/* Response time + Key metrics */}
      <div className="flex items-center gap-3 text-sm">
        <ResponseIndicator
          data={data.responseData}
          variant="badge"
        />
        {data.metrics.completionRate >= 99 && (
          <AchievementBadge type="consistent" size="sm" />
        )}
        {data.metrics.totalBookings >= 500 && (
          <AchievementBadge type="super-creator" size="sm" />
        )}
      </div>

      {/* Social proof bar */}
      <SocialProofMetrics
        metrics={data.metrics}
        variant="stats-bar"
      />
    </div>
  )
}

// Profile variant - for full creator profiles
function TrustSignalsProfile({ 
  data,
  showAll = false
}: { 
  data: TrustSignalsData
  showAll?: boolean
}) {
  return (
    <div className="space-y-6">
      {/* Hero trust signals */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Verification & Trust */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Verification & Trust
              </h3>
              <CompositeVerification
                verifications={data.verificationLevels}
                size="md"
              />
              <TrustScore
                score={data.trustScore}
                showLabel={true}
                size="md"
              />
              <div className="flex flex-wrap gap-2">
                {data.achievements.map((achievement) => (
                  <AchievementBadge
                    key={achievement}
                    type={achievement}
                    size="md"
                  />
                ))}
              </div>
            </div>

            {/* Rating & Reviews */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Customer Rating
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold">{data.rating.toFixed(1)}</div>
                <RatingDisplay
                  rating={data.rating}
                  totalReviews={data.totalReviews}
                  size="md"
                  showCount={false}
                />
                <p className="text-sm text-gray-500 mt-1">
                  {data.totalReviews.toLocaleString()} reviews
                </p>
              </div>
            </div>

            {/* Response Time */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Response Time
              </h3>
              <ResponseIndicator
                data={data.responseData}
                variant="detailed"
                showTrend={true}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metric highlights */}
      <MetricHighlight metrics={data.metrics} />

      {/* Detailed metrics */}
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
          <SocialProofMetrics
            metrics={data.metrics}
            variant="detailed"
          />
        </CardContent>
      </Card>

      {/* Media coverage */}
      {data.mediaItems.length > 0 && (
        <MediaCoverage
          items={data.mediaItems}
          variant="grid"
          maxDisplay={6}
          showAll={showAll}
        />
      )}

      {/* Reviews section */}
      <ReviewsSection
        reviews={data.reviews}
        distribution={data.distribution}
        averageRating={data.rating}
        totalReviews={data.totalReviews}
      />
    </div>
  )
}

// Minimal variant - for compact displays
function TrustSignalsMinimal({ 
  data 
}: { 
  data: TrustSignalsData 
}) {
  return (
    <div className="flex items-center gap-4">
      {data.verificationLevels.includes("celebrity") && (
        <VerificationBadge level="celebrity" size="sm" />
      )}
      {data.verificationLevels.includes("platform") && (
        <VerificationBadge level="platform" size="sm" />
      )}
      <RatingDisplay
        rating={data.rating}
        totalReviews={data.totalReviews}
        size="xs"
        showCount={false}
      />
      <ResponseIndicator
        data={data.responseData}
        variant="minimal"
      />
      {data.mediaItems.length > 0 && (
        <MediaBadge count={data.mediaItems.length} />
      )}
    </div>
  )
}

// Main component
export function TrustSignalsIntegration({
  data,
  variant = "card",
  showAll = false,
  className
}: TrustSignalsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={className}
    >
      {variant === "card" && <TrustSignalsCard data={data} />}
      {variant === "profile" && <TrustSignalsProfile data={data} showAll={showAll} />}
      {variant === "minimal" && <TrustSignalsMinimal data={data} />}
    </motion.div>
  )
}

// Hook to calculate trust metrics impact
export function useTrustImpact(data: TrustSignalsData) {
  const impact = React.useMemo(() => {
    let conversionBoost = 0
    let confidenceBoost = 0

    // Verification impact
    if (data.verificationLevels.includes("celebrity")) {
      conversionBoost += 35
      confidenceBoost += 40
    }
    if (data.verificationLevels.includes("platform")) {
      conversionBoost += 20
      confidenceBoost += 25
    }

    // Rating impact
    if (data.rating >= 4.5) {
      conversionBoost += 40
      confidenceBoost += 45
    } else if (data.rating >= 4.0) {
      conversionBoost += 25
      confidenceBoost += 30
    }

    // Response time impact
    if (data.responseData.averageTime <= 2) {
      conversionBoost += 25
      confidenceBoost += 20
    }

    // Social proof impact
    if (data.metrics.totalBookings >= 500) {
      conversionBoost += 20
      confidenceBoost += 25
    }

    // Media coverage impact
    if (data.mediaItems.length > 0) {
      conversionBoost += 30
      confidenceBoost += 35
    }

    return {
      conversionBoost: Math.min(conversionBoost, 100),
      confidenceBoost: Math.min(confidenceBoost, 100),
      trustLevel: data.trustScore >= 90 ? "exceptional" :
                  data.trustScore >= 70 ? "high" :
                  data.trustScore >= 50 ? "moderate" : "building"
    }
  }, [data])

  return impact
}