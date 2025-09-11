'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Users,
  Clock,
  DollarSign,
  MoreVertical,
  Pause,
  Play,
  XCircle,
  AlertCircle,
  CreditCard,
  Calendar,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'

interface Subscription {
  id: string
  creator_id: string
  tier_id: string
  status: 'active' | 'paused' | 'cancelled' | 'expired' | 'pending' | 'trialing'
  billing_period: 'monthly' | 'yearly'
  current_period_start: string
  current_period_end: string
  next_billing_date: string
  cancelled_at: string | null
  total_amount: number
  creator: {
    id: string
    display_name: string
    username: string
    profile_image_url?: string
  }
  tier: {
    id: string
    tier_name: string
    description: string
    price: number
    benefits: string[] | null
  }
}

export function SubscriptionManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [actionDialog, setActionDialog] = useState<{
    open: boolean
    type: 'pause' | 'resume' | 'cancel' | null
    subscription: Subscription | null
  }>({
    open: false,
    type: null,
    subscription: null
  })
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    loadSubscriptions()
  }, [])

  const loadSubscriptions = async () => {
    try {
      // Fetch user's subscriptions from the correct endpoint
      const response = await fetch('/api/subscriptions/list', {
        method: 'GET',
      })

      const data = await response.json()
      
      if (!response.ok) {
        // Only show error toast if it's a real error, not just empty results
        if (response.status !== 404) {
          console.error('Failed to fetch subscriptions:', data)
          toast({
            title: 'Error',
            description: data.error || 'Failed to load subscriptions',
            variant: 'destructive',
          })
        }
        setSubscriptions([])
      } else {
        // Transform the data to match our expected format
        const transformedSubs = data.subscriptions?.map((sub: any) => ({
          id: sub.id,
          creator_id: sub.creator.id,
          tier_id: sub.tier.id,
          status: sub.is_expired ? 'expired' : sub.status,
          billing_period: 'monthly' as const,
          current_period_start: sub.started_at,
          current_period_end: sub.expires_at,
          next_billing_date: sub.expires_at,
          cancelled_at: sub.cancelled_at,
          total_amount: sub.tier.price,
          creator: {
            id: sub.creator.id,
            display_name: sub.creator.name,
            username: sub.creator.username || sub.creator.name.toLowerCase().replace(/\s+/g, ''),
            profile_image_url: sub.creator.avatar_url
          },
          tier: {
            id: sub.tier.id,
            tier_name: sub.tier.name,
            description: sub.tier.description || '',
            price: sub.tier.price,
            benefits: sub.tier.benefits
          }
        })) || []
        
        // Remove duplicates by creator_id (keep the most recent active one)
        const uniqueSubs = transformedSubs.reduce((acc: any[], sub: any) => {
          const existing = acc.find(s => s.creator_id === sub.creator_id)
          if (!existing || (sub.status === 'active' && existing.status !== 'active')) {
            return [...acc.filter(s => s.creator_id !== sub.creator_id), sub]
          }
          return acc
        }, [])
        
        setSubscriptions(uniqueSubs)
      }
    } catch (error) {
      console.error('Error loading subscriptions:', error)
      toast({
        title: 'Error',
        description: 'Failed to load subscriptions',
        variant: 'destructive',
      })
      setSubscriptions([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubscriptionAction = async () => {
    if (!actionDialog.subscription || !actionDialog.type) return

    setProcessing(true)
    try {
      const response = await fetch('/api/subscriptions/list', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: actionDialog.subscription.id,
          action: actionDialog.type,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update subscription')
      }

      toast({
        title: 'Success',
        description: `Subscription ${actionDialog.type}d successfully`,
      })

      // Reload subscriptions
      loadSubscriptions()
      
      // Close dialog
      setActionDialog({ open: false, type: null, subscription: null })
    } catch (error) {
      console.error('Error updating subscription:', error)
      toast({
        title: 'Error',
        description: 'Failed to update subscription',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      active: { className: 'bg-green-100 text-green-700', label: 'Active' },
      paused: { className: 'bg-yellow-100 text-yellow-700', label: 'Paused' },
      cancelled: { className: 'bg-red-100 text-red-700', label: 'Cancelled' },
      expired: { className: 'bg-gray-100 text-gray-700', label: 'Expired' },
    }

    const variant = variants[status] || variants.expired
    return <Badge className={variant.className}>{variant.label}</Badge>
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
          <CardDescription>Manage your creator subscriptions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">You don't have any active subscriptions yet</p>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              onClick={() => router.push('/browse')}
            >
              Browse Creators
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
          <CardDescription>Manage your creator subscriptions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={subscription.creator.profile_image_url} />
                  <AvatarFallback>
                    {subscription.creator.display_name?.[0] || 'C'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{subscription.creator.display_name}</p>
                    {getStatusBadge(subscription.status)}
                  </div>
                  <p className="text-sm text-gray-500">
                    {subscription.tier?.tier_name || 'Subscription'} • {formatCurrency(subscription.tier?.price || subscription.total_amount)}/{subscription.billing_period === 'yearly' ? 'year' : 'month'}
                  </p>
                  {subscription.status === 'active' && subscription.next_billing_date && (
                    <p className="text-xs text-gray-400 mt-1">
                      Next billing: {formatDate(subscription.next_billing_date)}
                    </p>
                  )}
                  {subscription.status === 'cancelled' && subscription.current_period_end && (
                    <p className="text-xs text-gray-400 mt-1">
                      Access until: {formatDate(subscription.current_period_end)}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/fan/creators/${subscription.creator_id}`)}
                >
                  View Creator
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {subscription.status === 'active' && (
                      <>
                        <DropdownMenuItem
                          onClick={() => setActionDialog({
                            open: true,
                            type: 'pause',
                            subscription
                          })}
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          Pause Subscription
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    {subscription.status === 'paused' && (
                      <>
                        <DropdownMenuItem
                          onClick={() => setActionDialog({
                            open: true,
                            type: 'resume',
                            subscription
                          })}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Resume Subscription
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    {['active', 'paused'].includes(subscription.status) && (
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={() => setActionDialog({
                          open: true,
                          type: 'cancel',
                          subscription
                        })}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancel Subscription
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem>
                      <CreditCard className="h-4 w-4 mr-2" />
                      Update Payment Method
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog.open} onOpenChange={(open) => {
        if (!processing) {
          setActionDialog({ ...actionDialog, open })
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionDialog.type === 'pause' && 'Pause Subscription'}
              {actionDialog.type === 'resume' && 'Resume Subscription'}
              {actionDialog.type === 'cancel' && 'Cancel Subscription'}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === 'pause' && 
                `Are you sure you want to pause your subscription to ${actionDialog.subscription?.creator.display_name}? You can resume it anytime.`
              }
              {actionDialog.type === 'resume' && 
                `Resume your subscription to ${actionDialog.subscription?.creator.display_name}? Billing will continue from the next cycle.`
              }
              {actionDialog.type === 'cancel' && 
                `Are you sure you want to cancel your subscription to ${actionDialog.subscription?.creator.display_name}? You'll have access until ${actionDialog.subscription?.current_period_end ? formatDate(actionDialog.subscription.current_period_end) : 'the end of your billing period'}.`
              }
            </DialogDescription>
          </DialogHeader>
          
          {actionDialog.type === 'cancel' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                You can resubscribe anytime, but you may lose any special pricing or perks you currently have.
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialog({ open: false, type: null, subscription: null })}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              variant={actionDialog.type === 'cancel' ? 'destructive' : 'default'}
              onClick={handleSubscriptionAction}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {actionDialog.type === 'pause' && 'Pause Subscription'}
                  {actionDialog.type === 'resume' && 'Resume Subscription'}
                  {actionDialog.type === 'cancel' && 'Cancel Subscription'}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}