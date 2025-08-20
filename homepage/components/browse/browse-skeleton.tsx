"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface BrowseSkeletonProps {
  viewMode?: "grid" | "list" | "compact"
  count?: number
  className?: string
}

function CreatorCardSkeleton({ viewMode = "grid" }: { viewMode: "grid" | "list" | "compact" }) {
  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="flex gap-4">
            <Skeleton className="h-32 w-32 rounded-lg" />
            <div className="flex-1 p-4 space-y-3">
              <div className="space-y-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex gap-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (viewMode === "compact") {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-3">
          <div className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
            <Skeleton className="h-8 w-16" />
          </div>
        </CardContent>
      </Card>
    )
  }

  // Grid view (default)
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Skeleton className="h-64 w-full" />
        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-4 w-1/2" />
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-3 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}

export function BrowseSkeleton({ 
  viewMode = "grid", 
  count = 12,
  className 
}: BrowseSkeletonProps) {
  const gridClasses = {
    grid: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6",
    list: "space-y-4",
    compact: "grid grid-cols-1 md:grid-cols-2 gap-4"
  }

  return (
    <div className={cn(gridClasses[viewMode], className)}>
      {Array.from({ length: count }).map((_, index) => (
        <CreatorCardSkeleton key={index} viewMode={viewMode} />
      ))}
    </div>
  )
}

export function FilterSidebarSkeleton() {
  return (
    <div className="bg-white rounded-lg p-4 space-y-6">
      <div>
        <Skeleton className="h-6 w-32 mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </div>
      </div>
      
      <Skeleton className="h-px w-full" />
      
      <div>
        <Skeleton className="h-6 w-28 mb-3" />
        <Skeleton className="h-2 w-full mb-2" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
      
      <Skeleton className="h-px w-full" />
      
      <div>
        <Skeleton className="h-6 w-36 mb-3" />
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 flex-1" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}