'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight, TrendingUp, Users, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'

export interface TrendingCreator {
  id: string
  name: string
  username: string
  category: string
  avatar_url?: string
  verified: boolean
  isLive?: boolean
  trendingRank?: number
  subscriberCount: number
  recentActivity?: string
}

interface TrendingCreatorsProps {
  creators: TrendingCreator[]
  isLoading?: boolean
  className?: string
}

export function TrendingCreators({
  creators,
  isLoading = false,
  className
}: TrendingCreatorsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  if (isLoading) {
    return (
      <div className="flex gap-4 overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex-shrink-0 w-64">
            <Skeleton className="h-32 rounded-xl" />
          </div>
        ))}
      </div>
    )
  }

  if (creators.length === 0) {
    return (
      <div className="text-center py-8 px-4 bg-gray-50 rounded-xl">
        <TrendingUp className="h-8 w-8 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500">No trending creators at the moment</p>
      </div>
    )
  }

  return (
    <div className={cn("relative group", className)}>
      {/* Scroll buttons */}
      <Button
        variant="outline"
        size="icon"
        onClick={scrollLeft}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-lg"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        onClick={scrollRight}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-lg"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>

      {/* Scrollable container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {creators.map((creator, index) => (
          <Link
            key={creator.id}
            href={`/creator/${creator.username}`}
            className="flex-shrink-0 block"
          >
            <div className="relative w-64 p-4 bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all duration-200 group/card">
              {/* Trending rank badge */}
              {creator.trendingRank && creator.trendingRank <= 3 && (
                <div className="absolute -top-2 -left-2 z-10">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-md",
                    creator.trendingRank === 1 && "bg-gradient-to-br from-yellow-400 to-yellow-600",
                    creator.trendingRank === 2 && "bg-gradient-to-br from-gray-300 to-gray-500",
                    creator.trendingRank === 3 && "bg-gradient-to-br from-orange-400 to-orange-600"
                  )}>
                    {creator.trendingRank}
                  </div>
                </div>
              )}

              {/* Live indicator */}
              {creator.isLive && (
                <div className="absolute -top-2 -right-2 z-10">
                  <Badge className="bg-red-500 text-white border-0 animate-pulse">
                    <Zap className="h-3 w-3 mr-1" />
                    LIVE
                  </Badge>
                </div>
              )}

              <div className="flex items-start gap-3">
                {/* Avatar */}
                <Avatar className="h-12 w-12 border-2 border-gray-100">
                  <AvatarImage src={creator.avatar_url} alt={creator.name} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                    {creator.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* Creator info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="font-semibold text-gray-900 truncate group-hover/card:text-purple-600">
                      {creator.name}
                    </h3>
                    {creator.verified && (
                      <svg className="h-4 w-4 text-blue-500 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">@{creator.username}</p>
                  
                  {/* Stats */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Users className="h-3 w-3" />
                      <span>{formatNumber(creator.subscriberCount)}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {creator.category}
                    </Badge>
                  </div>

                  {/* Recent activity */}
                  {creator.recentActivity && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-1">
                      {creator.recentActivity}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}