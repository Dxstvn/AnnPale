'use client'

import { CreatorPreviewCard, CreatorPreview } from './CreatorPreviewCard'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface RecommendedSectionProps {
  creators: CreatorPreview[]
  isLoading?: boolean
  className?: string
}

export function RecommendedSection({
  creators,
  isLoading = false,
  className
}: RecommendedSectionProps) {
  if (isLoading) {
    return (
      <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", className)}>
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-xl" />
        ))}
      </div>
    )
  }

  if (creators.length === 0) {
    return null
  }

  return (
    <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", className)}>
      {creators.slice(0, 8).map((creator) => (
        <CreatorPreviewCard
          key={creator.id}
          creator={creator}
          viewMode="grid"
        />
      ))}
    </div>
  )
}