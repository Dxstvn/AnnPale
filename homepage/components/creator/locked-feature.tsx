"use client"

import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Lock,
  CreditCard,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface LockedFeatureProps {
  title: string
  description?: string
  icon?: React.ReactNode
  ctaText?: string
  className?: string
  compact?: boolean
}

export function LockedFeature({
  title,
  description = "Complete payment setup to access this feature",
  icon,
  ctaText = "Setup Payments",
  className,
  compact = false
}: LockedFeatureProps) {
  const router = useRouter()

  const handleSetupPayments = () => {
    router.push('/creator/settings?tab=payments')
  }

  if (compact) {
    return (
      <div className={cn(
        "relative rounded-lg border-2 border-dashed border-muted p-4 bg-muted/20",
        className
      )}>
        <div className="absolute -top-2 -right-2">
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            <Lock className="h-3 w-3 mr-1" />
            Locked
          </Badge>
        </div>
        <div className="opacity-50 blur-sm pointer-events-none select-none">
          <div className="flex items-center gap-3">
            {icon && <div className="text-muted-foreground">{icon}</div>}
            <div>
              <h4 className="font-medium text-sm">{title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Button
            size="sm"
            variant="default"
            onClick={handleSetupPayments}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <CreditCard className="h-3 w-3 mr-1" />
            {ctaText}
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className={cn(
      "relative overflow-hidden",
      className
    )}>
      {/* Locked overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-100/90 to-gray-200/90 backdrop-blur-sm z-10 flex items-center justify-center">
        <div className="text-center p-6 max-w-sm">
          <div className="h-16 w-16 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto mb-4">
            <Lock className="h-8 w-8 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {title} is Locked
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            {description}
          </p>
          <Button
            size="lg"
            onClick={handleSetupPayments}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
          >
            <CreditCard className="h-5 w-5 mr-2" />
            {ctaText}
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Blurred content underneath */}
      <div className="blur-sm opacity-30 p-6">
        <div className="flex items-center gap-4 mb-4">
          {icon && <div className="text-2xl">{icon}</div>}
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {/* Placeholder content */}
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </Card>
  )
}