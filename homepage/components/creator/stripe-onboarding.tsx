"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight,
  DollarSign,
  Shield,
  Clock,
  TrendingUp,
  Info,
  Loader2,
  Calculator
} from "lucide-react"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

interface StripeOnboardingProps {
  creatorId: string
  creatorName: string
  isOnboarded?: boolean
  chargesEnabled?: boolean
  payoutsEnabled?: boolean
  className?: string
}

export function StripeOnboarding({ 
  creatorId, 
  creatorName,
  isOnboarded = false,
  chargesEnabled = false,
  payoutsEnabled = false,
  className 
}: StripeOnboardingProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const handleStartOnboarding = async () => {
    setLoading(true)
    setError(null)

    try {
      // Call API to create Stripe Connect account and get onboarding URL
      const response = await fetch('/api/stripe/connect/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          creatorId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to start onboarding')
      }

      const { onboardingUrl } = await response.json()

      // Redirect to Stripe onboarding
      window.location.href = onboardingUrl
    } catch (err) {
      console.error('Onboarding error:', err)
      setError('Failed to start payment setup. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRefreshStatus = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/connect/status', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const status = await response.json()
        if (status.chargesEnabled && status.payoutsEnabled) {
          router.refresh()
        }
      }
    } catch (err) {
      console.error('Status check error:', err)
    } finally {
      setLoading(false)
    }
  }

  // If fully onboarded, show success state
  if (isOnboarded && chargesEnabled && payoutsEnabled) {
    return (
      <Card className={cn("bg-green-50 border-green-200", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <CardTitle className="text-green-900">Payment Setup Complete</CardTitle>
            </div>
            <Badge className="bg-green-600 text-white">Active</Badge>
          </div>
          <CardDescription className="text-green-700">
            You're all set to receive payments from your fans!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Payments Enabled</p>
                <p className="text-sm text-gray-600">You can accept payments from fans</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">Payouts Active</p>
                <p className="text-sm text-gray-600">Daily automatic transfers to your bank</p>
              </div>
            </div>
            <Separator />
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                <Calculator className="h-4 w-4" />
                Revenue Split
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Your Earnings:</span>
                  <span className="font-semibold text-green-600">70%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Platform Fee:</span>
                  <span className="text-sm text-gray-600">30%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full" onClick={() => router.push('/creator/finances')}>
            View Earnings Dashboard
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // If partially onboarded, show warning state
  if (isOnboarded && (!chargesEnabled || !payoutsEnabled)) {
    return (
      <Card className={cn("bg-yellow-50 border-yellow-200", className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-yellow-600" />
              <CardTitle className="text-yellow-900">Setup Incomplete</CardTitle>
            </div>
            <Badge className="bg-yellow-600 text-white">Pending</Badge>
          </div>
          <CardDescription className="text-yellow-700">
            Your payment setup needs additional information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CreditCard className={cn(
                "h-5 w-5",
                chargesEnabled ? "text-green-600" : "text-gray-400"
              )} />
              <div>
                <p className="font-medium">Payment Processing</p>
                <p className="text-sm text-gray-600">
                  {chargesEnabled ? "✓ Enabled" : "✗ Not configured"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DollarSign className={cn(
                "h-5 w-5",
                payoutsEnabled ? "text-green-600" : "text-gray-400"
              )} />
              <div>
                <p className="font-medium">Bank Payouts</p>
                <p className="text-sm text-gray-600">
                  {payoutsEnabled ? "✓ Enabled" : "✗ Not configured"}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button 
            className="flex-1"
            onClick={handleStartOnboarding}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CreditCard className="h-4 w-4 mr-2" />
            )}
            Complete Setup
          </Button>
          <Button 
            variant="outline"
            onClick={handleRefreshStatus}
            disabled={loading}
          >
            Refresh Status
          </Button>
        </CardFooter>
      </Card>
    )
  }

  // Not onboarded - show CTA
  return (
    <Card className={cn("", className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-purple-600" />
          Start Accepting Payments
        </CardTitle>
        <CardDescription>
          Set up your payment account to start earning from video messages and subscriptions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Benefits */}
        <div className="grid gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold">70% Revenue Share</h4>
              <p className="text-sm text-gray-600">
                Keep 70% of all earnings from video messages and subscriptions
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold">Daily Payouts</h4>
              <p className="text-sm text-gray-600">
                Automatic daily transfers directly to your bank account
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold">Secure & Trusted</h4>
              <p className="text-sm text-gray-600">
                Powered by Stripe with bank-level security and fraud protection
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Setup Steps */}
        <div>
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Info className="h-4 w-4" />
            Quick Setup Process
          </h4>
          <ol className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="font-semibold text-purple-600">1.</span>
              <span>Create your Stripe account (2 minutes)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-purple-600">2.</span>
              <span>Verify your identity for compliance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-purple-600">3.</span>
              <span>Add your bank account for payouts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-semibold text-purple-600">4.</span>
              <span>Start earning immediately!</span>
            </li>
          </ol>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          size="lg"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          onClick={handleStartOnboarding}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Setting up...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 mr-2" />
              Set Up Payments
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}