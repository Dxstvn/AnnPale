"use client"

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, CreditCard, Lock, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_SANDBOX_PUBLIC_KEY || process.env.STRIPE_SANDBOX_PUBLIC_KEY || '')

interface PaymentFormProps {
  amount: number
  currency?: string
  creatorId?: string
  requestDetails?: any
  onSuccess?: (paymentIntentId: string) => void
  onError?: (error: string) => void
}

function CheckoutForm({ 
  amount, 
  currency = 'usd', 
  creatorId,
  requestDetails,
  onSuccess, 
  onError 
}: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      // Create payment intent
      const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          creatorId,
          requestDetails,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create payment intent')
      }

      const { clientSecret, paymentIntentId } = await response.json()

      // Confirm payment
      const { error: stripeError } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/fan/orders/${paymentIntentId}`,
        },
        redirect: 'if_required',
      })

      if (stripeError) {
        setError(stripeError.message || 'Payment failed')
        onError?.(stripeError.message || 'Payment failed')
      } else {
        setPaymentSuccess(true)
        toast({
          title: "Payment successful!",
          description: "Your order has been placed.",
        })
        onSuccess?.(paymentIntentId)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed'
      setError(errorMessage)
      onError?.(errorMessage)
      toast({
        title: "Payment failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (paymentSuccess) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <h3 className="text-xl font-semibold">Payment Successful!</h3>
            <p className="text-muted-foreground">
              Your payment has been processed successfully.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Details
          </CardTitle>
          <CardDescription>
            Enter your card information to complete the payment
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border rounded-lg p-4">
            <PaymentElement />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Lock className="h-4 w-4" />
              <span>Secure payment</span>
            </div>
            <div>
              Powered by Stripe
            </div>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${amount.toFixed(2)} ${currency.toUpperCase()}`
        )}
      </Button>
    </form>
  )
}

export default function StripePaymentForm(props: PaymentFormProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Create payment intent on component mount
  useState(() => {
    fetch('/api/payments/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: props.amount,
        currency: props.currency || 'usd',
        creatorId: props.creatorId,
        requestDetails: props.requestDetails,
      }),
    })
      .then(res => res.json())
      .then(data => {
        setClientSecret(data.clientSecret)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error creating payment intent:', err)
        setLoading(false)
        props.onError?.('Failed to initialize payment')
      })
  })

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Initializing payment...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!clientSecret) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="destructive">
            <AlertDescription>
              Failed to initialize payment. Please try again.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#9333ea',
    },
  }

  const options = {
    clientSecret,
    appearance,
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm {...props} />
    </Elements>
  )
}