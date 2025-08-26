"use client"

import { useState } from "react"
import dynamic from 'next/dynamic'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

// Dynamic import for Stripe components to avoid SSR issues
const StripeCardForm = dynamic(
  () => import('@/components/payment/stripe-card-form'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }
)

const StripePaymentForm = dynamic(
  () => import('@/components/payment/stripe-payment-form'),
  { 
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }
)

export default function TestStripePage() {
  const [paymentResults, setPaymentResults] = useState<any[]>([])
  const { toast } = useToast()

  const handleSuccess = (paymentIntentId: string) => {
    const result = {
      id: paymentIntentId,
      timestamp: new Date().toISOString(),
      status: 'success'
    }
    setPaymentResults([result, ...paymentResults])
    toast({
      title: "Payment Successful!",
      description: `Payment intent: ${paymentIntentId}`,
    })
  }

  const handleError = (error: string) => {
    const result = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: 'error',
      error
    }
    setPaymentResults([result, ...paymentResults])
    toast({
      title: "Payment Failed",
      description: error,
      variant: "destructive",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Stripe Payment Integration Test</CardTitle>
            <CardDescription>
              Test the Stripe payment forms with test card numbers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">Test Card Numbers:</h3>
              <ul className="space-y-1 text-sm">
                <li>✅ <strong>Success:</strong> 4242 4242 4242 4242</li>
                <li>💳 <strong>3D Secure Authentication:</strong> 4000 0025 0000 3155</li>
                <li>❌ <strong>Declined:</strong> 4000 0000 0000 9995</li>
                <li>🚫 <strong>Insufficient Funds:</strong> 4000 0000 0000 9995</li>
              </ul>
              <p className="text-xs text-gray-600 mt-2">
                Use any future expiration date (e.g., 12/34) and any 3-digit CVC
              </p>
            </div>

            <Tabs defaultValue="card" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="card">Card Form</TabsTrigger>
                <TabsTrigger value="elements">Payment Elements</TabsTrigger>
              </TabsList>
              
              <TabsContent value="card" className="mt-6">
                <StripeCardForm
                  amount={99.99}
                  currency="usd"
                  description="Test payment for Ann Pale video request"
                  metadata={{
                    test: "true",
                    source: "test-page"
                  }}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              </TabsContent>
              
              <TabsContent value="elements" className="mt-6">
                <StripePaymentForm
                  amount={149.99}
                  currency="usd"
                  creatorId="test-creator-123"
                  requestDetails={{
                    occasion: "Birthday",
                    recipientName: "Test User",
                    instructions: "This is a test payment"
                  }}
                  onSuccess={handleSuccess}
                  onError={handleError}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {paymentResults.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Payment Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {paymentResults.map((result) => (
                  <div
                    key={result.id}
                    className={`p-3 rounded-lg border ${
                      result.status === 'success'
                        ? 'bg-green-50 border-green-200'
                        : 'bg-red-50 border-red-200'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">
                          {result.status === 'success' ? '✅ Success' : '❌ Failed'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {result.status === 'success'
                            ? `Payment Intent: ${result.id}`
                            : `Error: ${result.error}`}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}