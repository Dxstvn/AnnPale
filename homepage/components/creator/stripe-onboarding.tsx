"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Calculator,
  Globe
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

// Stripe Connect supported countries (46 countries as of 2024)
const SUPPORTED_COUNTRIES = [
  // Americas
  { code: 'US', name: 'United States', region: 'Americas' },
  { code: 'CA', name: 'Canada', region: 'Americas' },
  { code: 'MX', name: 'Mexico', region: 'Americas' },
  { code: 'BR', name: 'Brazil', region: 'Americas' },
  // Europe
  { code: 'GB', name: 'United Kingdom', region: 'Europe' },
  { code: 'IE', name: 'Ireland', region: 'Europe' },
  { code: 'FR', name: 'France', region: 'Europe' },
  { code: 'DE', name: 'Germany', region: 'Europe' },
  { code: 'NL', name: 'Netherlands', region: 'Europe' },
  { code: 'BE', name: 'Belgium', region: 'Europe' },
  { code: 'LU', name: 'Luxembourg', region: 'Europe' },
  { code: 'ES', name: 'Spain', region: 'Europe' },
  { code: 'PT', name: 'Portugal', region: 'Europe' },
  { code: 'IT', name: 'Italy', region: 'Europe' },
  { code: 'AT', name: 'Austria', region: 'Europe' },
  { code: 'CH', name: 'Switzerland', region: 'Europe' },
  { code: 'SE', name: 'Sweden', region: 'Europe' },
  { code: 'NO', name: 'Norway', region: 'Europe' },
  { code: 'DK', name: 'Denmark', region: 'Europe' },
  { code: 'FI', name: 'Finland', region: 'Europe' },
  { code: 'EE', name: 'Estonia', region: 'Europe' },
  { code: 'LV', name: 'Latvia', region: 'Europe' },
  { code: 'LT', name: 'Lithuania', region: 'Europe' },
  { code: 'PL', name: 'Poland', region: 'Europe' },
  { code: 'CZ', name: 'Czech Republic', region: 'Europe' },
  { code: 'SK', name: 'Slovakia', region: 'Europe' },
  { code: 'HU', name: 'Hungary', region: 'Europe' },
  { code: 'RO', name: 'Romania', region: 'Europe' },
  { code: 'BG', name: 'Bulgaria', region: 'Europe' },
  { code: 'HR', name: 'Croatia', region: 'Europe' },
  { code: 'SI', name: 'Slovenia', region: 'Europe' },
  { code: 'GR', name: 'Greece', region: 'Europe' },
  { code: 'CY', name: 'Cyprus', region: 'Europe' },
  { code: 'MT', name: 'Malta', region: 'Europe' },
  // Asia-Pacific
  { code: 'AU', name: 'Australia', region: 'Asia-Pacific' },
  { code: 'NZ', name: 'New Zealand', region: 'Asia-Pacific' },
  { code: 'JP', name: 'Japan', region: 'Asia-Pacific' },
  { code: 'SG', name: 'Singapore', region: 'Asia-Pacific' },
  { code: 'HK', name: 'Hong Kong', region: 'Asia-Pacific' },
  { code: 'IN', name: 'India', region: 'Asia-Pacific' },
  { code: 'MY', name: 'Malaysia', region: 'Asia-Pacific' },
  { code: 'TH', name: 'Thailand', region: 'Asia-Pacific' },
  { code: 'ID', name: 'Indonesia', region: 'Asia-Pacific' },
  { code: 'PH', name: 'Philippines', region: 'Asia-Pacific' },
  // Middle East & Africa
  { code: 'AE', name: 'United Arab Emirates', region: 'Middle East & Africa' },
  { code: 'IL', name: 'Israel', region: 'Middle East & Africa' },
  { code: 'ZA', name: 'South Africa', region: 'Middle East & Africa' },
  { code: 'EG', name: 'Egypt', region: 'Middle East & Africa' },
  { code: 'NG', name: 'Nigeria', region: 'Middle East & Africa' },
  { code: 'KE', name: 'Kenya', region: 'Middle East & Africa' },
].sort((a, b) => {
  if (a.region !== b.region) {
    return a.region.localeCompare(b.region)
  }
  return a.name.localeCompare(b.name)
})

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
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const supabase = createClient()

  const handleStartOnboarding = async () => {
    if (!selectedCountry) {
      setError('Please select your country to continue')
      return
    }

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
          country: selectedCountry,
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

            <Separator />

            {/* Country Selection for re-onboarding */}
            <div className="space-y-2">
              <Label htmlFor="country-incomplete" className="flex items-center gap-2">
                <Globe className="h-4 w-4" />
                Select your country
              </Label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger id="country-incomplete" className="w-full">
                  <SelectValue placeholder="Choose your country..." />
                </SelectTrigger>
                <SelectContent>
                  {SUPPORTED_COUNTRIES.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                Select the country where you'll receive payments.
              </p>
            </div>
          </div>

          {error && (
            <Alert variant="destructive" className="mt-3">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
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

        {/* Country Selection */}
        <div className="space-y-2">
          <Label htmlFor="country" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Select your country
          </Label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger id="country" className="w-full">
              <SelectValue placeholder="Choose your country..." />
            </SelectTrigger>
            <SelectContent>
              {SUPPORTED_COUNTRIES.map((country) => (
                <SelectItem key={country.code} value={country.code}>
                  {country.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-gray-500">
            Select the country where you'll receive payments. This cannot be changed later.
          </p>
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