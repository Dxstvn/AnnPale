'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'
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
  Settings,
  AlertCircle,
  Calendar,
  ChevronRight,
  Loader2
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useSubscriptionRealtime } from '@/hooks/use-subscription-realtime'

interface Subscription {
  id: string
  creator_id?: string // Made optional for compatibility
  tier_id?: string // Made optional for compatibility
  status: 'active' | 'paused' | 'cancelled' | 'expired' | 'pending' | 'trialing'
  billing_period: 'monthly' | 'yearly'
  current_period_start?: string // Made optional
  current_period_end?: string // Made optional
  expires_at?: string // From subscription_orders
  next_billing_date?: string
  cancelled_at: string | null
  total_amount: number
  stripe_subscription_id?: string // Added for Stripe operations
  creator: {
    id: string
    display_name?: string
    name?: string // From profiles table
    username: string
    profile_image_url?: string
    avatar_url?: string // From profiles table
  }
  tier: {
    id: string
    tier_name?: string
    name?: string // Alternative field name
    description: string
    price: number
    benefits: string[] | null
    billing_period?: 'monthly' | 'yearly'
  }
}

export function SubscriptionManagement() {
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations('fan.settings.subscriptions.management')
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
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

  // Get user ID for realtime subscription
  useEffect(() => {
    const getUserId = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
      }
    }
    getUserId()
  }, [])

  // Use realtime hook for instant updates (only when userId is available)
  const { isConnected, updates } = useSubscriptionRealtime({
    userId: userId || '',
    role: 'fan',
    onUpdate: userId ? (update) => {
      console.log('Realtime subscription update:', update)
      // Reload subscriptions when any change is detected
      loadSubscriptions()
    } : undefined
  })

  useEffect(() => {
    loadSubscriptions()
  }, [])

  // Add window focus refresh as fallback with debouncing
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout | null = null

    const handleFocus = () => {
      // Clear any existing timer
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }

      // Only refresh if window is visible and debounce by 500ms
      if (document.visibilityState === 'visible') {
        debounceTimer = setTimeout(() => {
          console.log('Window focused - refreshing subscriptions')
          loadSubscriptions()
        }, 500)
      }
    }

    // Listen for both focus and visibility change events
    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleFocus)

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleFocus)
    }
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
            title: t('error'),
            description: data.error || t('messages.loadError'),
            variant: 'destructive',
          })
        }
        setSubscriptions([])
      } else {
        // Transform the data to match our expected format (handles both old and new API response)
        const transformedSubs = data.subscriptions?.map((sub: any) => ({
          id: sub.id,
          creator_id: sub.creator_id || sub.creator?.id,
          tier_id: sub.tier_id || sub.tier?.id,
          status: sub.is_expired ? 'expired' : sub.status,
          billing_period: sub.billing_period || sub.tier?.billing_period || 'monthly',
          current_period_start: sub.current_period_start || sub.started_at,
          current_period_end: sub.current_period_end || sub.expires_at,
          next_billing_date: sub.next_billing_date || sub.expires_at,
          cancelled_at: sub.cancelled_at,
          total_amount: sub.total_amount || sub.tier?.price || 0,
          stripe_subscription_id: sub.stripe_subscription_id,
          creator: {
            id: sub.creator?.id,
            display_name: sub.creator?.display_name || sub.creator?.name,
            name: sub.creator?.name,
            username: sub.creator?.username || sub.creator?.name?.toLowerCase().replace(/\s+/g, ''),
            profile_image_url: sub.creator?.profile_image_url || sub.creator?.avatar_url,
            avatar_url: sub.creator?.avatar_url
          },
          tier: {
            id: sub.tier?.id,
            tier_name: sub.tier?.tier_name || sub.tier?.name,
            name: sub.tier?.name,
            description: sub.tier?.description || '',
            price: sub.tier?.price || sub.total_amount || 0,
            benefits: sub.tier?.benefits,
            billing_period: sub.tier?.billing_period || sub.billing_period
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
        title: t('error'),
        description: t('messages.loadError'),
        variant: 'destructive',
      })
      setSubscriptions([])
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async (subscription: Subscription) => {
    try {
      const response = await fetch('/api/stripe/subscriptions/payment-method', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        // Handle specific error cases
        if (data.code === 'PORTAL_NOT_CONFIGURED') {
          toast({
            title: t('error'),
            description: 'The payment portal is currently being set up. Please try again later or contact support.',
            variant: 'destructive',
          })
          return
        }

        if (data.fallback) {
          // Fallback to generic portal link if specific customer portal fails
          const fallbackUrl = process.env.NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_LINK
          if (fallbackUrl) {
            window.location.href = fallbackUrl
            return
          }
        }

        throw new Error(data.error || 'Failed to open subscription management')
      }

      if (data.url) {
        // Redirect to Stripe Customer Portal for all subscription management
        window.location.href = data.url
      } else {
        throw new Error('No portal URL received')
      }
    } catch (error) {
      console.error('Error opening subscription management:', error)
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : 'Failed to open subscription management',
        variant: 'destructive',
      })
    }
  }

  const handleSubscriptionAction = async () => {
    if (!actionDialog.subscription || !actionDialog.type) return

    setProcessing(true)
    try {
      // Use the Stripe subscription management endpoint
      const response = await fetch('/api/stripe/subscriptions/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionOrderId: actionDialog.subscription.id,
          action: actionDialog.type, // 'pause', 'resume', or 'cancel'
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update subscription')
      }

      // Show appropriate success message
      let message = ''
      switch (actionDialog.type) {
        case 'pause':
          message = t('messages.pauseSuccess')
          break
        case 'resume':
          message = t('messages.resumeSuccess')
          break
        case 'cancel':
          message = t('messages.cancelSuccess', { date: actionDialog.subscription.current_period_end ? formatDate(actionDialog.subscription.current_period_end) : 'the end of your billing period' })
          break
      }

      toast({
        title: t('success'),
        description: message,
      })

      // Reload subscriptions
      loadSubscriptions()

      // Close dialog
      setActionDialog({ open: false, type: null, subscription: null })
    } catch (error) {
      console.error('Error updating subscription:', error)
      toast({
        title: t('error'),
        description: error instanceof Error ? error.message : t('messages.updateError'),
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      active: { className: 'bg-green-100 text-green-700', label: t('status.active') },
      paused: { className: 'bg-yellow-100 text-yellow-700', label: t('status.paused') },
      cancelled: { className: 'bg-red-100 text-red-700', label: t('status.cancelled') },
      expired: { className: 'bg-gray-100 text-gray-700', label: t('status.expired') },
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
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">{t('noSubscriptions')}</p>
            <Button
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              onClick={() => router.push('/browse')}
            >
              {t('browseCreators')}
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
          <CardTitle>{t('title')}</CardTitle>
          <CardDescription>{t('description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {subscriptions.map((subscription) => (
            <div
              key={subscription.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              data-testid="subscription-item"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={subscription.creator.profile_image_url || subscription.creator.avatar_url} />
                  <AvatarFallback>
                    {(subscription.creator.display_name || subscription.creator.name)?.[0] || 'C'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{subscription.creator.display_name || subscription.creator.name}</p>
                    <span data-testid={`subscription-status-${subscription.cancelled_at ? 'cancelled' : subscription.status}`}>
                      {getStatusBadge(subscription.cancelled_at ? 'cancelled' : subscription.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {subscription.tier?.tier_name || subscription.tier?.name || 'Subscription'} • {formatCurrency(subscription.tier?.price || subscription.total_amount)}/{subscription.billing_period === 'yearly' ? t('year') : t('month')}
                  </p>
                  {subscription.status === 'active' && subscription.next_billing_date && (
                    <p className="text-xs text-gray-400 mt-1">
                      {t('nextBilling', { date: formatDate(subscription.next_billing_date) })}
                    </p>
                  )}
                  {subscription.cancelled_at && (subscription.current_period_end || subscription.expires_at) && (
                    <p className="text-xs text-gray-400 mt-1">
                      {t('accessUntil', { date: formatDate(subscription.current_period_end || subscription.expires_at || '') })}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => router.push(`/fan/creators/${subscription.creator?.id || subscription.creator_id}`)}
                >
                  {t('viewCreator')}
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleManageSubscription(subscription)}
                  data-testid="manage-subscription-btn"
                  disabled={subscription.status === 'expired'}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {t('actions.manageSubscription')}
                </Button>
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
              {actionDialog.type === 'pause' && t('dialogs.pause.title')}
              {actionDialog.type === 'resume' && t('dialogs.resume.title')}
              {actionDialog.type === 'cancel' && t('dialogs.cancel.title')}
            </DialogTitle>
            <DialogDescription>
              {actionDialog.type === 'pause' &&
                t('dialogs.pause.description', { creator: actionDialog.subscription?.creator.display_name || actionDialog.subscription?.creator.name })
              }
              {actionDialog.type === 'resume' &&
                t('dialogs.resume.description', { creator: actionDialog.subscription?.creator.display_name || actionDialog.subscription?.creator.name })
              }
              {actionDialog.type === 'cancel' &&
                t('dialogs.cancel.description', {
                  creator: actionDialog.subscription?.creator.display_name || actionDialog.subscription?.creator.name,
                  date: actionDialog.subscription?.current_period_end || actionDialog.subscription?.expires_at ?
                    formatDate(actionDialog.subscription.current_period_end || actionDialog.subscription.expires_at || '') :
                    'the end of your billing period'
                })
              }
            </DialogDescription>
          </DialogHeader>
          
          {actionDialog.type === 'cancel' && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {t('dialogs.cancel.warning')}
              </AlertDescription>
            </Alert>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setActionDialog({ open: false, type: null, subscription: null })}
              disabled={processing}
              data-testid="dialog-cancel-btn"
            >
              {t('cancel')}
            </Button>
            <Button
              variant={actionDialog.type === 'cancel' ? 'destructive' : 'default'}
              onClick={handleSubscriptionAction}
              disabled={processing}
              data-testid="dialog-confirm-btn"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('processing')}
                </>
              ) : (
                <>
                  {actionDialog.type === 'pause' && t('actions.pauseSubscription')}
                  {actionDialog.type === 'resume' && t('actions.resumeSubscription')}
                  {actionDialog.type === 'cancel' && t('actions.cancelSubscription')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}