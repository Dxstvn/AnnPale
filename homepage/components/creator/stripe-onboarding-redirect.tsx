"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useStripeStatus } from "@/contexts/stripe-status-context"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, CreditCard, ArrowRight, AlertCircle, Globe } from "lucide-react"

// Stripe Connect supported countries (46 countries as of 2024)
// Grouped by region for better UX
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
  // Sort by region first, then by name
  if (a.region !== b.region) {
    return a.region.localeCompare(b.region)
  }
  return a.name.localeCompare(b.name)
})

export function StripeOnboardingRedirect() {
  const router = useRouter()
  const { user } = useSupabaseAuth()
  const { status: stripeStatus } = useStripeStatus()
  const [isInitiating, setIsInitiating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [showCountrySelection, setShowCountrySelection] = useState(true)

  // No longer auto-starting - user needs to select country first

  const initiateOnboarding = async () => {
    if (!selectedCountry) {
      setError('Please select your country to continue')
      return
    }

    setIsInitiating(true)
    setError(null)
    setShowCountrySelection(false)

    try {
      console.log('Initiating Stripe onboarding with country:', selectedCountry)
      const response = await fetch('/api/stripe/connect/onboard', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ country: selectedCountry }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        console.error('Onboarding API error:', response.status, errorData)
        throw new Error(errorData?.error || `Failed to start payment setup (${response.status})`)
      }

      const data = await response.json()

      if (data.onboardingUrl) {
        // Redirect to Stripe onboarding
        window.location.href = data.onboardingUrl
      } else if (data.message === 'Payment setup already complete') {
        // Already onboarded, refresh status
        window.location.reload()
      } else {
        throw new Error('No onboarding URL received')
      }
    } catch (err) {
      console.error('Onboarding error:', err)
      setError(err instanceof Error ? err.message : 'Failed to start payment setup')
      setIsInitiating(false)
      // Reset country selection visibility on error
      setShowCountrySelection(true)
    }
  }

  // Show nothing if user is not a creator or already has Stripe setup
  if (user?.role !== 'creator' || stripeStatus.chargesEnabled) {
    return null
  }

  // Show loading while checking status
  if (stripeStatus.isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // Show onboarding UI for new creators
  if (!stripeStatus.hasAccount) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
            <CreditCard className="h-6 w-6 text-purple-600" />
          </div>
          <CardTitle className="text-2xl">Welcome to Ann Pale!</CardTitle>
          <CardDescription className="mt-2">
            Let's set up your payment account so you can start earning from your video messages
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert className="border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {(showCountrySelection || !isInitiating) && (
            <div className="space-y-4">
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
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-sm">What happens next:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">1.</span>
                Select your country for payment processing
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">2.</span>
                You'll be redirected to Stripe to set up your account
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">3.</span>
                Provide your business information and bank details
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">4.</span>
                Complete identity verification (required by law)
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">5.</span>
                Start accepting payments from fans immediately!
              </li>
            </ul>
          </div>

          <div className="pt-4">
            {isInitiating ? (
              <Button disabled className="w-full" size="lg">
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Redirecting to Stripe...
              </Button>
            ) : (
              <Button
                onClick={initiateOnboarding}
                className="w-full"
                size="lg"
              >
                Continue to Payment Setup
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          <p className="text-xs text-center text-gray-500">
            Stripe handles all payment processing securely. Ann Pale never stores your banking information.
          </p>
        </CardContent>
      </Card>
    )
  }

  return null
}