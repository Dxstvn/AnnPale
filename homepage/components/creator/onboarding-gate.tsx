"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Lock,
  CreditCard,
  ArrowRight,
  AlertCircle,
  Loader2,
  Globe
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useStripeStatus } from "@/contexts/stripe-status-context"

// Stripe Connect supported countries
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

interface OnboardingGateProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  featureName?: string
  description?: string
  className?: string
}

export function OnboardingGate({
  children,
  fallback,
  featureName = "This feature",
  description = "Complete payment setup to unlock monetization features",
  className
}: OnboardingGateProps) {
  const router = useRouter()
  const { status: stripeStatus } = useStripeStatus()
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [isInitiating, setIsInitiating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSetupPayments = async () => {
    if (!selectedCountry) {
      setError('Please select your country to continue')
      return
    }

    setIsInitiating(true)
    setError(null)

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
    }
  }

  // If loading, show loading state
  if (stripeStatus.isLoading) {
    return (
      <div className={cn("flex items-center justify-center p-8", className)}>
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  // If fully onboarded, show children
  if (stripeStatus.chargesEnabled && stripeStatus.payoutsEnabled) {
    return <>{children}</>
  }

  // Otherwise, show locked state
  const defaultFallback = (
    <Card className={cn("border-2 border-dashed border-muted", className)}>
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-muted flex items-center justify-center">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle>{featureName} Requires Payment Setup</CardTitle>
        <CardDescription className="mt-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        <Alert className="mb-4 border-orange-200 bg-orange-50">
          <AlertCircle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            You must complete Stripe onboarding to access monetization features.
            This ensures you can receive payments from fans.
          </AlertDescription>
        </Alert>

        {error && (
          <Alert className="mb-4 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2 text-sm text-muted-foreground mb-6">
          <p>✓ Accept payments from fans</p>
          <p>✓ Create subscription tiers</p>
          <p>✓ Receive daily payouts</p>
          <p>✓ Appear in fan discovery</p>
        </div>

        {/* Country Selection */}
        <div className="space-y-2 mb-6 text-left">
          <Label htmlFor="onboarding-country" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Select your country
          </Label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger id="onboarding-country" className="w-full">
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

        <Button
          size="lg"
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          onClick={handleSetupPayments}
          disabled={isInitiating}
        >
          {isInitiating ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Redirecting to Stripe...
            </>
          ) : (
            <>
              <CreditCard className="h-5 w-5 mr-2" />
              Complete Payment Setup
              <ArrowRight className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>

        {stripeStatus.hasAccount && !stripeStatus.chargesEnabled && (
          <p className="text-xs text-muted-foreground mt-4">
            You started setup but haven't completed it. Click above to continue.
          </p>
        )}
      </CardContent>
    </Card>
  )

  return fallback || defaultFallback
}