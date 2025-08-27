import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'
import { 
  Users, Calendar, DollarSign, ChevronRight, Clock, 
  Star, CheckCircle, AlertCircle, XCircle 
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SubscriptionCardProps {
  subscription: {
    id: string
    creatorName: string
    creatorAvatar: string
    tierName: string
    tierColor: string
    price: number
    status: 'active' | 'paused' | 'cancelled' | 'expired'
    nextBillingDate: string
    subscribedSince: string
    benefits: string[]
  }
  onManage?: () => void
  onUpgrade?: () => void
  variant?: 'default' | 'elevated'
}

export function SubscriptionCard({ 
  subscription, 
  onManage, 
  onUpgrade,
  variant = 'elevated' 
}: SubscriptionCardProps) {
  const getStatusIcon = () => {
    switch(subscription.status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'paused': return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'cancelled': return <XCircle className="h-4 w-4 text-red-600" />
      case 'expired': return <XCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadgeVariant = () => {
    switch(subscription.status) {
      case 'active': return 'default'
      case 'paused': return 'secondary'
      case 'cancelled': return 'destructive'
      case 'expired': return 'outline'
      default: return 'secondary'
    }
  }

  return (
    <Card className={cn(
      "overflow-hidden transition-all hover:shadow-lg",
      variant === 'elevated' && "hover:-translate-y-1"
    )}>
      {/* Gradient Header */}
      <div className={cn(
        "h-2 bg-gradient-to-r",
        subscription.tierColor
      )} />
      
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={subscription.creatorAvatar} />
              <AvatarFallback>{subscription.creatorName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{subscription.creatorName}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={cn(
                  "bg-gradient-to-r text-white text-xs",
                  subscription.tierColor
                )}>
                  {subscription.tierName}
                </Badge>
                <Badge variant={getStatusBadgeVariant()} className="gap-1">
                  {getStatusIcon()}
                  {subscription.status}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Billing Info */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Monthly Price</p>
            <p className="font-semibold flex items-center gap-1">
              <DollarSign className="h-4 w-4" />
              {subscription.price}/mo
            </p>
          </div>
          <div>
            <p className="text-gray-500">Next Billing</p>
            <p className="font-semibold flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {subscription.nextBillingDate}
            </p>
          </div>
        </div>

        {/* Subscription Duration */}
        <div>
          <p className="text-sm text-gray-500 mb-1">
            Subscribed since {subscription.subscribedSince}
          </p>
          <Progress value={75} className="h-2" />
        </div>

        {/* Quick Benefits */}
        <div className="space-y-1">
          <p className="text-sm font-medium">Your Benefits:</p>
          <ul className="text-xs text-gray-600 space-y-1">
            {subscription.benefits.slice(0, 3).map((benefit, idx) => (
              <li key={idx} className="flex items-center gap-1">
                <Star className="h-3 w-3 text-purple-600" />
                {benefit}
              </li>
            ))}
            {subscription.benefits.length > 3 && (
              <li className="text-purple-600 font-medium">
                +{subscription.benefits.length - 3} more benefits
              </li>
            )}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button 
            size="sm" 
            className="flex-1"
            onClick={onManage}
          >
            Manage
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
          {subscription.status === 'active' && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={onUpgrade}
            >
              Upgrade
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}