'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Heart, MessageCircle, Users, DollarSign, Star, Clock, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export interface CreatorPreview {
  id: string
  name: string
  username: string
  display_name?: string
  avatar_url?: string
  cover_image?: string
  bio?: string
  category: string
  subcategory?: string
  verified: boolean
  price_video_message: number
  price_range?: {
    min: number
    max: number
  }
  rating?: number
  total_reviews?: number
  subscriber_count?: number
  response_time?: string
  languages?: string[]
  recent_post?: {
    content: string
    created_at: string
    likes: number
    comments: number
  }
  is_subscribed?: boolean
  is_online?: boolean
  is_demo?: boolean
}

interface CreatorPreviewCardProps {
  creator: CreatorPreview
  viewMode?: 'grid' | 'list'
  onQuickSubscribe?: (creatorId: string) => void
  className?: string
}

export function CreatorPreviewCard({
  creator,
  viewMode = 'grid',
  onQuickSubscribe,
  className
}: CreatorPreviewCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const displayName = creator.display_name || creator.name

  if (viewMode === 'list') {
    return (
      <Card className={cn(
        "p-4 hover:shadow-lg transition-all duration-200 border-gray-200",
        className
      )}>
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Link href={`/creator/${creator.username}`}>
            <div className="relative">
              <Avatar className="h-16 w-16 border-2 border-gray-100">
                <AvatarImage src={creator.avatar_url} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-lg">
                  {displayName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {creator.is_online && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
              )}
            </div>
          </Link>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            <Link href={`/creator/${creator.username}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900 hover:text-purple-600 transition-colors">
                      {displayName}
                    </h3>
                    {creator.verified && (
                      <svg className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                    {creator.is_demo && (
                      <Badge variant="secondary" className="text-xs">Demo</Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">@{creator.username}</p>
                </div>
                <Badge variant="outline" className="ml-2">
                  {creator.category}
                </Badge>
              </div>
            </Link>

            {/* Bio */}
            {creator.bio && (
              <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                {creator.bio}
              </p>
            )}

            {/* Recent Post Preview */}
            {creator.recent_post && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700 line-clamp-2">
                  {creator.recent_post.content}
                </p>
                <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Heart className="h-3 w-3" />
                    {creator.recent_post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {creator.recent_post.comments}
                  </span>
                  <span>{new Date(creator.recent_post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            )}

            {/* Stats and Actions */}
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-4 text-sm">
                {creator.subscriber_count !== undefined && (
                  <span className="flex items-center gap-1 text-gray-600">
                    <Users className="h-4 w-4" />
                    {formatNumber(creator.subscriber_count)}
                  </span>
                )}
                {creator.rating && (
                  <span className="flex items-center gap-1 text-gray-600">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    {creator.rating.toFixed(1)}
                  </span>
                )}
                <span className="text-purple-600 font-medium">
                  ${creator.price_video_message}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {creator.is_subscribed ? (
                  <Badge className="bg-green-100 text-green-700 border-green-300">
                    Subscribed
                  </Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault()
                      onQuickSubscribe?.(creator.id)
                    }}
                    className="hover:bg-purple-50 hover:text-purple-600 hover:border-purple-300"
                  >
                    Subscribe
                  </Button>
                )}
                <Link href={`/creator/${creator.username}`}>
                  <Button size="sm" variant="ghost">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  // Grid view
  return (
    <Link href={`/creator/${creator.username}`}>
      <Card 
        className={cn(
          "overflow-hidden hover:shadow-xl transition-all duration-200 border-gray-200 group",
          "transform hover:-translate-y-1",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Cover Image / Gradient */}
        <div className="relative h-24 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400">
          {creator.cover_image && (
            <img
              src={creator.cover_image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          
          {/* Online indicator */}
          {creator.is_online && (
            <div className="absolute top-2 right-2">
              <Badge className="bg-green-500 text-white border-0 text-xs">
                Online
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Avatar and Name */}
          <div className="flex items-start gap-3 -mt-8">
            <Avatar className="h-16 w-16 border-4 border-white shadow-md">
              <AvatarImage src={creator.avatar_url} alt={displayName} />
              <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white text-lg">
                {displayName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 pt-3">
              <div className="flex items-center gap-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                  {displayName}
                </h3>
                {creator.verified && (
                  <svg className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-sm text-gray-500">@{creator.username}</p>
            </div>
          </div>

          {/* Category and Price */}
          <div className="flex items-center justify-between mt-3">
            <Badge variant="secondary" className="text-xs">
              {creator.category}
            </Badge>
            <span className="text-sm font-medium text-purple-600">
              ${creator.price_video_message}
            </span>
          </div>

          {/* Bio */}
          {creator.bio && (
            <p className="text-sm text-gray-600 mt-3 line-clamp-2">
              {creator.bio}
            </p>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3 text-xs text-gray-500">
              {creator.subscriber_count !== undefined && (
                <span className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  {formatNumber(creator.subscriber_count)}
                </span>
              )}
              {creator.rating && (
                <span className="flex items-center gap-1">
                  <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                  {creator.rating.toFixed(1)}
                </span>
              )}
              {creator.response_time && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {creator.response_time}
                </span>
              )}
            </div>
          </div>

          {/* Quick Subscribe Button - Shows on hover */}
          {isHovered && !creator.is_subscribed && (
            <Button
              size="sm"
              className="w-full mt-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              onClick={(e) => {
                e.preventDefault()
                onQuickSubscribe?.(creator.id)
              }}
            >
              Quick Subscribe
            </Button>
          )}
          
          {creator.is_subscribed && (
            <div className="mt-3 text-center">
              <Badge className="bg-green-100 text-green-700 border-green-300">
                ✓ Subscribed
              </Badge>
            </div>
          )}
        </div>
      </Card>
    </Link>
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