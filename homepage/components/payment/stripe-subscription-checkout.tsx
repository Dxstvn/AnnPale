'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CreditCard, AlertCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface StripeSubscriptionCheckoutProps {
  tierId: string
  creatorId: string
  price: number
  billingPeriod?: 'monthly' | 'yearly'
  onSuccess?: (sessionId: string) => void
  onError?: (error: string) => void
}

export function StripeSubscriptionCheckout({
  tierId,
  creatorId,
  price,
  billingPeriod = 'monthly',
  onSuccess,
  onError
}: StripeSubscriptionCheckoutProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const handleCheckout = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Generate idempotency key to prevent duplicate subscriptions
      const idempotencyKey = `sub_${tierId}_${Date.now()}`
      
      const response = await fetch('/api/stripe/subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tierId,
          creatorId,
          billingPeriod,
          idempotencyKey,
          successUrl: `${window.location.origin}/fan/creators/${creatorId}?subscription=success&session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/fan/creators/${creatorId}?cancelled=true`,
        }),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session')
      }
      
      if (data.sessionUrl) {
        // Track the session ID before redirecting
        if (onSuccess) {
          onSuccess(data.sessionId)
        }
        
        // Redirect to Stripe Checkout
        toast({
          title: 'Redirecting to checkout...',
          description: 'You will be redirected to Stripe to complete your subscription.',
        })
        
        // Small delay to show the toast
        setTimeout(() => {
          window.location.href = data.sessionUrl
        }, 1000)
      } else {
        throw new Error('No checkout URL received')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create subscription'
      setError(errorMessage)
      
      toast({
        title: 'Subscription failed',
        description: errorMessage,
        variant: 'destructive',
      })
      
      if (onError) {
        onError(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <Button
        onClick={handleCheckout}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
        size="lg"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Redirecting to checkout...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-5 w-5" />
            Subscribe - ${price}/{billingPeriod === 'yearly' ? 'year' : 'mo'}
          </>
        )}
      </Button>
      
      <p className="text-xs text-center text-gray-500">
        You will be redirected to Stripe's secure checkout page.
        Cancel anytime from your account settings.
      </p>
    </div>
  )
}

export default StripeSubscriptionCheckout