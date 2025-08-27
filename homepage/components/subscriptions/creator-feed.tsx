import React from 'react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Video, Radio, MessageSquare, ThumbsUp, Eye, Play,
  Lock, MoreVertical, Share2, BookmarkPlus
} from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface FeedItem {
  id: string
  creator: {
    name: string
    avatar: string
    tierName: string
    tierColor: string
  }
  type: 'video' | 'live' | 'post'
  title: string
  description: string
  thumbnail?: string
  createdAt: string
  likes: number
  views: number
  comments: number
  hasAccess: boolean
  tierRequired?: string
}

interface CreatorFeedProps {
  items: FeedItem[]
  onItemClick?: (item: FeedItem) => void
  gridColumns?: 1 | 2 | 3
  spacing?: 4 | 6 | 8
}

export function CreatorFeed({ 
  items, 
  onItemClick,
  gridColumns = 2,
  spacing = 6 
}: CreatorFeedProps) {
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'video': return <Video className="h-4 w-4" />
      case 'live': return <Radio className="h-4 w-4" />
      case 'post': return <MessageSquare className="h-4 w-4" />
      default: return null
    }
  }

  const getTypeBadgeVariant = (type: string) => {
    switch(type) {
      case 'live': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <div className={cn(
      "grid gap-" + spacing,
      gridColumns === 1 && "grid-cols-1",
      gridColumns === 2 && "grid-cols-1 lg:grid-cols-2",
      gridColumns === 3 && "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    )}>
      {items.map((item) => (
        <Card 
          key={item.id}
          className={cn(
            "overflow-hidden hover:shadow-xl transition-all cursor-pointer",
            "hover:-translate-y-1",
            !item.hasAccess && "opacity-75"
          )}
          onClick={() => onItemClick?.(item)}
        >
          {/* Thumbnail */}
          {(item.type === 'video' || item.type === 'live') && item.thumbnail && (
            <div className="relative aspect-video bg-gray-100">
              {item.type === 'live' && (
                <Badge 
                  variant="destructive" 
                  className="absolute top-4 left-4 z-10"
                >
                  <Radio className="h-3 w-3 mr-1 animate-pulse" />
                  LIVE
                </Badge>
              )}
              
              <img 
                src={item.thumbnail} 
                alt={item.title}
                className={cn(
                  "w-full h-full object-cover",
                  !item.hasAccess && "blur-sm"
                )}
              />
              
              {item.hasAccess ? (
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Button 
                    size="lg" 
                    className="bg-white/90 text-black hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation()
                      onItemClick?.(item)
                    }}
                  >
                    <Play className="h-5 w-5 mr-2" />
                    {item.type === 'live' ? 'Watch Live' : 'Play'}
                  </Button>
                </div>
              ) : (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <Lock className="h-8 w-8 mx-auto mb-2" />
                    <p className="font-semibold">Subscription Required</p>
                    <p className="text-sm opacity-90">{item.tierRequired}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <CardHeader className="space-y-3">
            {/* Creator Info */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={item.creator.avatar} />
                  <AvatarFallback>{item.creator.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{item.creator.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={cn(
                        "bg-gradient-to-r text-white text-xs",
                        item.creator.tierColor
                      )}
                    >
                      {item.creator.tierName}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {item.createdAt}
                    </span>
                  </div>
                </div>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <BookmarkPlus className="h-4 w-4 mr-2" />
                    Save
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Content Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                {getTypeIcon(item.type)}
                <Badge variant={getTypeBadgeVariant(item.type)}>
                  {item.type === 'live' ? 'Live Now' : item.type}
                </Badge>
              </div>
              <h3 className="font-semibold line-clamp-2">{item.title}</h3>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {item.description}
              </p>
            </div>

            {/* Engagement Metrics */}
            <div className="flex items-center justify-between text-sm text-gray-600">
              <div className="flex items-center gap-4">
                <button 
                  className="flex items-center gap-1 hover:text-purple-600 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ThumbsUp className="h-4 w-4" />
                  {item.likes}
                </button>
                <button 
                  className="flex items-center gap-1 hover:text-purple-600 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MessageSquare className="h-4 w-4" />
                  {item.comments}
                </button>
                <span className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {item.views}
                </span>
              </div>
              
              {item.hasAccess ? (
                <Badge className="bg-green-100 text-green-700">
                  Full Access
                </Badge>
              ) : (
                <Badge variant="outline">
                  Upgrade
                </Badge>
              )}
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  )
}