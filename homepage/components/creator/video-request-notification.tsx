'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Bell,
  Video,
  DollarSign,
  Calendar,
  User,
  X,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { VideoRequestNotification } from '@/hooks/use-creator-notifications'

interface VideoRequestNotificationCardProps {
  request: VideoRequestNotification
  onAccept?: (requestId: string) => void
  onReject?: (requestId: string) => void
  onView?: (requestId: string) => void
  onDismiss?: (requestId: string) => void
}

export function VideoRequestNotificationCard({
  request,
  onAccept,
  onReject,
  onView,
  onDismiss
}: VideoRequestNotificationCardProps) {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  
  const handleAccept = async () => {
    setIsProcessing(true)
    await onAccept?.(request.id)
    setIsProcessing(false)
  }
  
  const handleReject = async () => {
    setIsProcessing(true)
    await onReject?.(request.id)
    setIsProcessing(false)
  }
  
  const handleView = () => {
    onView?.(request.id)
    router.push(`/creator/requests?highlight=${request.id}`)
  }
  
  return (
    <Card className="relative overflow-hidden border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-600" />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-full">
              <Bell className="h-4 w-4 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-lg">New Video Request</CardTitle>
              <CardDescription className="text-xs">
                {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
              </CardDescription>
            </div>
          </div>
          {onDismiss && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => onDismiss(request.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Fan Info */}
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src={request.fan?.avatar_url} />
            <AvatarFallback>
              {(request.fan?.display_name || request.fan?.name)?.charAt(0) || 'F'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="font-medium">{request.fan?.display_name || request.fan?.name || 'Anonymous Fan'}</p>
            <p className="text-sm text-gray-600">@{request.fan?.username || 'anonymous'}</p>
          </div>
          <Badge className="bg-green-100 text-green-800">
            ${request.price}
          </Badge>
        </div>
        
        {/* Request Details */}
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-gray-400" />
            <span className="font-medium">Occasion:</span>
            <span>{request.occasion}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="font-medium">For:</span>
            <span>{request.recipient_name}</span>
          </div>
          
        </div>
        
        {/* Instructions Preview */}
        <div className="p-3 bg-white/50 rounded-lg">
          <p className="text-sm text-gray-700 line-clamp-2">
            "{request.instructions}"
          </p>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleView}
            className="flex-1"
            data-testid="notification-view-button"
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleReject}
            disabled={isProcessing}
            className="flex-1 text-red-600 hover:bg-red-50"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Decline
          </Button>
          
          <Button
            size="sm"
            onClick={handleAccept}
            disabled={isProcessing}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white"
            data-testid="notification-accept-button"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Accept
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

interface NotificationBadgeProps {
  count: number
  onClick?: () => void
}

export function NotificationBadge({ count, onClick }: NotificationBadgeProps) {
  return (
    <button
      onClick={onClick}
      className="relative inline-flex items-center p-2 rounded-full hover:bg-gray-100 transition-colors"
      data-testid="notification-badge"
    >
      <Bell className="h-5 w-5 text-gray-600" />
      {count > 0 && (
        <>
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-medium" data-testid="notification-count">
              {count > 9 ? '9+' : count}
            </span>
          </span>
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full animate-ping" />
        </>
      )}
    </button>
  )
}

interface NotificationPanelProps {
  requests: VideoRequestNotification[]
  onAccept?: (requestId: string) => void
  onReject?: (requestId: string) => void
  onView?: (requestId: string) => void
  onDismiss?: (requestId: string) => void
  onClearAll?: () => void
}

export function NotificationPanel({
  requests,
  onAccept,
  onReject,
  onView,
  onDismiss,
  onClearAll
}: NotificationPanelProps) {
  if (requests.length === 0) {
    return (
      <div className="p-8 text-center">
        <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No new notifications</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-4 py-2 border-b">
        <h3 className="font-semibold">New Video Requests</h3>
        {onClearAll && (
          <Button variant="ghost" size="sm" onClick={onClearAll}>
            Clear all
          </Button>
        )}
      </div>
      
      <div className="space-y-3 max-h-[500px] overflow-y-auto px-4 pb-4">
        {requests.map((request) => (
          <VideoRequestNotificationCard
            key={request.id}
            request={request}
            onAccept={onAccept}
            onReject={onReject}
            onView={onView}
            onDismiss={onDismiss}
          />
        ))}
      </div>
    </div>
  )
}