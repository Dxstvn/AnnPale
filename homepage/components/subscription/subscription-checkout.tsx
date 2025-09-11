'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface SubscriptionCheckoutProps {
  orderId: string
  amount: number
  tierName: string
  creatorName: string
  billingPeriod: 'monthly' | 'yearly'
}

function CheckoutForm({ orderId, amount, tierName, creatorName, billingPeriod }: SubscriptionCheckoutProps) {
  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Get payment method from Stripe Elements
      const { error: submitError } = await elements.submit()
      
      if (submitError) {
        setError(submitError.message || 'Payment validation failed')
        setIsProcessing(false)
        return
      }

      // Create payment method
      const { error: confirmError, paymentMethod } = await stripe.createPaymentMethod({
        elements,
      })

      if (confirmError) {
        setError(confirmError.message || 'Failed to create payment method')
        setIsProcessing(false)
        return
      }

      // Process the subscription payment
      const response = await fetch('/api/subscriptions/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId,
          paymentMethodId: paymentMethod.id,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Payment processing failed')
      }

      // Payment successful
      toast({
        title: 'Subscription Activated!',
        description: `You are now subscribed to ${creatorName}'s ${tierName} tier`,
      })

      // Redirect to success page or fan dashboard
      router.push('/fan/subscriptions?success=true')
      
    } catch (err: any) {
      console.error('Payment error:', err)
      setError(err.message || 'An unexpected error occurred')
      toast({
        title: 'Payment Failed',
        description: err.message || 'Unable to process payment',
        variant: 'destructive',
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Payment Details</CardTitle>
          <CardDescription>
            Subscribe to {creatorName}'s {tierName} tier
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="rounded-lg border p-4 bg-muted/50">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Subscription Amount</span>
              <span className="font-semibold">
                {formatCurrency(amount)} / {billingPeriod === 'yearly' ? 'year' : 'month'}
              </span>
            </div>
          </div>

          <PaymentElement 
            options={{
              layout: 'tabs',
              defaultValues: {
                billingDetails: {
                  email: '',
                }
              }
            }}
          />

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <Button
            type="submit"
            className="w-full"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Subscribe for ${formatCurrency(amount)}/${billingPeriod === 'yearly' ? 'yr' : 'mo'}`
            )}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            By subscribing, you agree to automatic recurring billing.
            You can cancel anytime from your subscriptions page.
          </p>
        </CardFooter>
      </Card>
    </form>
  )
}

export function SubscriptionCheckout(props: SubscriptionCheckoutProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Create a setup intent for subscription
  useState(() => {
    fetch('/api/subscriptions/create-setup-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        orderId: props.orderId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        }
      })
      .catch((error) => {
        console.error('Error creating setup intent:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  })

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (!clientSecret) {
    return (
      <Card>
        <CardContent className="py-12">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Unable to initialize payment. Please try again later.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Elements 
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#9333ea',
          },
        },
      }}
    >
      <CheckoutForm {...props} />
    </Elements>
  )
}