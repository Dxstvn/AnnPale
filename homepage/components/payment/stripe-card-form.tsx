"use client"

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, CreditCard, Lock, CheckCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_SANDBOX_PUBLIC_KEY || '')

interface CardPaymentFormProps {
  amount: number
  currency?: string
  description?: string
  metadata?: Record<string, string>
  onSuccess?: (paymentIntentId: string) => void
  onError?: (error: string) => void
}

function CardForm({ 
  amount, 
  currency = 'usd', 
  description,
  metadata,
  onSuccess, 
  onError 
}: CardPaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
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
          metadata: {
            ...metadata,
            customerEmail: email,
            customerName: name,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create payment intent')
      }

      const { clientSecret, paymentIntentId } = await response.json()

      // Confirm card payment
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name,
              email,
            },
          },
        }
      )

      if (stripeError) {
        setError(stripeError.message || 'Payment failed')
        onError?.(stripeError.message || 'Payment failed')
      } else if (paymentIntent) {
        setPaymentSuccess(true)
        toast({
          title: "Payment successful!",
          description: `Payment of $${amount.toFixed(2)} has been processed.`,
        })
        onSuccess?.(paymentIntent.id)
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
              Your payment of ${amount.toFixed(2)} has been processed successfully.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Information
          </CardTitle>
          <CardDescription>
            {description || `Amount to pay: $${amount.toFixed(2)} ${currency.toUpperCase()}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Cardholder Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Card Details</Label>
              <div className="border rounded-lg p-3">
                <CardElement options={cardElementOptions} />
              </div>
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Lock className="h-4 w-4" />
              <span>Secure payment powered by Stripe</span>
            </div>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-sm">
            <p className="font-medium">Test Card Numbers:</p>
            <ul className="mt-2 space-y-1 text-muted-foreground">
              <li>✓ Success: 4242 4242 4242 4242</li>
              <li>✓ 3D Secure: 4000 0025 0000 3155</li>
              <li>✗ Declined: 4000 0000 0000 9995</li>
            </ul>
            <p className="mt-2 text-xs">Use any future date and any 3-digit CVC</p>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        disabled={!stripe || isProcessing || !email || !name}
        className="w-full"
        size="lg"
      >
        {isProcessing ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          `Pay $${amount.toFixed(2)}`
        )}
      </Button>
    </form>
  )
}

export default function StripeCardForm(props: CardPaymentFormProps) {
  return (
    <Elements stripe={stripePromise}>
      <CardForm {...props} />
    </Elements>
  )
}