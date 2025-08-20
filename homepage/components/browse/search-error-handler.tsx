"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  AlertCircle,
  WifiOff,
  Clock,
  RefreshCw,
  Search,
  Home,
  ChevronRight,
  Loader2,
  AlertTriangle,
  Ban,
  Sparkles,
  ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

export type SearchErrorType = 
  | "no-results"
  | "network-error"
  | "timeout"
  | "invalid-query"
  | "rate-limited"
  | "server-error"
  | "unknown"

interface SearchError {
  type: SearchErrorType
  message?: string
  details?: any
  timestamp: Date
  retryable: boolean
  retryCount?: number
}

interface SearchErrorHandlerProps {
  error: SearchError | null
  searchQuery?: string
  onRetry?: () => void
  onClear?: () => void
  onBrowseAll?: () => void
  onSuggestionClick?: (suggestion: string) => void
  className?: string
}

// Error messages and recovery strategies
const errorStrategies: Record<SearchErrorType, {
  icon: React.ElementType
  title: string
  message: string
  recovery: string[]
  suggestions?: string[]
  actionLabel?: string
  actionIcon?: React.ElementType
}> = {
  "no-results": {
    icon: Search,
    title: "No creators found",
    message: "We couldn't find any creators matching your search",
    recovery: [
      "Try using different keywords",
      "Remove some filters to see more results",
      "Check your spelling",
      "Browse popular categories instead"
    ],
    suggestions: ["Birthday messages", "Wedding wishes", "Comedians", "Musicians"],
    actionLabel: "Browse all creators",
    actionIcon: Home
  },
  "network-error": {
    icon: WifiOff,
    title: "Connection issue",
    message: "We're having trouble connecting to our servers",
    recovery: [
      "Check your internet connection",
      "Try refreshing the page",
      "Wait a moment and try again",
      "Contact support if the problem persists"
    ],
    actionLabel: "Try again",
    actionIcon: RefreshCw
  },
  "timeout": {
    icon: Clock,
    title: "Taking longer than usual",
    message: "The search is taking more time than expected",
    recovery: [
      "The servers might be busy",
      "Try a simpler search query",
      "Refresh and try again",
      "Browse popular creators while you wait"
    ],
    actionLabel: "Keep waiting",
    actionIcon: Loader2
  },
  "invalid-query": {
    icon: AlertTriangle,
    title: "Invalid search query",
    message: "There seems to be an issue with your search terms",
    recovery: [
      "Try using different keywords",
      "Avoid special characters",
      "Use simpler search terms",
      "Try searching for categories or names"
    ],
    suggestions: ["Musicians", "Comedians", "Athletes", "Birthdays"],
    actionLabel: "Clear search",
    actionIcon: X
  },
  "rate-limited": {
    icon: Ban,
    title: "Too many searches",
    message: "You've made too many search requests. Please wait a moment.",
    recovery: [
      "Wait a few seconds before searching again",
      "Browse popular creators instead",
      "Use filters to narrow your search",
      "Try again in a moment"
    ],
    actionLabel: "Browse popular",
    actionIcon: Sparkles
  },
  "server-error": {
    icon: AlertCircle,
    title: "Something went wrong",
    message: "We encountered an error while processing your search",
    recovery: [
      "Our team has been notified",
      "Try refreshing the page",
      "Clear your browser cache",
      "Contact support if this persists"
    ],
    actionLabel: "Refresh page",
    actionIcon: RefreshCw
  },
  "unknown": {
    icon: AlertCircle,
    title: "Unexpected error",
    message: "Something unexpected happened",
    recovery: [
      "Try refreshing the page",
      "Clear your search and try again",
      "Browse categories instead",
      "Contact our support team"
    ],
    actionLabel: "Go home",
    actionIcon: Home
  }
}

export function SearchErrorHandler({
  error,
  searchQuery,
  onRetry,
  onClear,
  onBrowseAll,
  onSuggestionClick,
  className
}: SearchErrorHandlerProps) {
  const [isRetrying, setIsRetrying] = React.useState(false)
  const [countdown, setCountdown] = React.useState<number | null>(null)

  if (!error) return null

  const strategy = errorStrategies[error.type]
  const Icon = strategy.icon
  const ActionIcon = strategy.actionIcon || ArrowRight

  // Handle rate limiting countdown
  React.useEffect(() => {
    if (error.type === "rate-limited" && !countdown) {
      setCountdown(10) // 10 second cooldown
    }
  }, [error.type, countdown])

  React.useEffect(() => {
    if (countdown && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (countdown === 0) {
      setCountdown(null)
      toast.success("You can search again!")
    }
  }, [countdown])

  const handleRetry = async () => {
    if (countdown && countdown > 0) {
      toast.error(`Please wait ${countdown} seconds before retrying`)
      return
    }

    setIsRetrying(true)
    try {
      await onRetry?.()
    } finally {
      setTimeout(() => setIsRetrying(false), 1000)
    }
  }

  const handleAction = () => {
    switch (error.type) {
      case "no-results":
        onBrowseAll?.()
        break
      case "network-error":
      case "server-error":
        handleRetry()
        break
      case "timeout":
        if (isRetrying) {
          onClear?.()
        } else {
          setIsRetrying(true)
        }
        break
      case "invalid-query":
        onClear?.()
        break
      case "rate-limited":
        onBrowseAll?.()
        break
      case "unknown":
      default:
        window.location.href = "/"
        break
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={error.type}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={cn("w-full max-w-2xl mx-auto", className)}
      >
        <Card className="border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-900/10">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <Icon className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-red-900 dark:text-red-100">
                  {strategy.title}
                </CardTitle>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {strategy.message}
                </p>
                {searchQuery && (
                  <Badge variant="secondary" className="mt-2">
                    Searched for: "{searchQuery}"
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Recovery suggestions */}
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2">What you can try:</h4>
              <ul className="space-y-1">
                {strategy.recovery.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-purple-600 dark:text-purple-400 mt-0.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Alternative suggestions */}
            {strategy.suggestions && (
              <div>
                <p className="text-sm font-medium mb-2">Try searching for:</p>
                <div className="flex flex-wrap gap-2">
                  {strategy.suggestions.map((suggestion) => (
                    <Badge
                      key={suggestion}
                      variant="secondary"
                      className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition"
                      onClick={() => onSuggestionClick?.(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              {error.retryable && onRetry && (
                <Button
                  onClick={handleRetry}
                  disabled={isRetrying || (countdown !== null && countdown > 0)}
                  variant="outline"
                  className="flex-1"
                >
                  {isRetrying ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Retrying...
                    </>
                  ) : countdown && countdown > 0 ? (
                    <>
                      <Clock className="h-4 w-4 mr-2" />
                      Wait {countdown}s
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try again
                    </>
                  )}
                </Button>
              )}
              
              <Button
                onClick={handleAction}
                variant="default"
                className="flex-1"
              >
                <ActionIcon className="h-4 w-4 mr-2" />
                {strategy.actionLabel}
              </Button>
            </div>

            {/* Error details for debugging */}
            {process.env.NODE_ENV === "development" && error.details && (
              <details className="mt-4">
                <summary className="text-xs text-gray-500 cursor-pointer">
                  Technical details
                </summary>
                <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-auto">
                  {JSON.stringify(error.details, null, 2)}
                </pre>
              </details>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}