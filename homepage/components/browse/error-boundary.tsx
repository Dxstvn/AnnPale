"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Bug,
  ChevronDown,
  ChevronUp,
  Copy,
  Check
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
  errorCount: number
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<ErrorFallbackProps>
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
  showDetails?: boolean
  maxRetries?: number
}

interface ErrorFallbackProps {
  error: Error | null
  resetError: () => void
  errorCount: number
}

// Default error fallback component
function DefaultErrorFallback({ error, resetError, errorCount }: ErrorFallbackProps) {
  const [showDetails, setShowDetails] = React.useState(false)
  const [copied, setCopied] = React.useState(false)

  const copyErrorDetails = async () => {
    if (!error) return
    
    const details = `
Error: ${error.message}
Stack: ${error.stack}
Time: ${new Date().toISOString()}
URL: ${window.location.href}
    `.trim()
    
    await navigator.clipboard.writeText(details)
    setCopied(true)
    toast.success("Error details copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReportIssue = () => {
    // In production, this would send error details to error tracking service
    toast.success("Issue reported. Thank you for your feedback!")
  }

  return (
    <div className="min-h-[400px] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <CardTitle className="text-xl">Something went wrong</CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {errorCount > 1 && `This error has occurred ${errorCount} times. `}
                  Don't worry, we can fix this.
                </p>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Error Message */}
            <Alert className="border-orange-200 dark:border-orange-800">
              <AlertTitle className="text-sm">Error Details</AlertTitle>
              <AlertDescription className="mt-2">
                <code className="text-xs bg-gray-100 dark:bg-gray-800 p-1 rounded">
                  {error?.message || "An unexpected error occurred"}
                </code>
              </AlertDescription>
            </Alert>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <Button
                onClick={resetError}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => window.location.href = "/"}
                className="flex-1"
              >
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </div>

            {/* Additional Options */}
            <div className="pt-2 space-y-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="w-full flex items-center justify-between p-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition"
              >
                <span>Technical details</span>
                {showDetails ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>

              <AnimatePresence>
                {showDetails && error && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-3">
                      <div className="max-h-32 overflow-auto">
                        <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                          {error.stack}
                        </pre>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyErrorDetails}
                          className="flex-1"
                        >
                          {copied ? (
                            <>
                              <Check className="h-3 w-3 mr-1" />
                              Copied
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3 mr-1" />
                              Copy Details
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleReportIssue}
                          className="flex-1"
                        >
                          <Bug className="h-3 w-3 mr-1" />
                          Report Issue
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo)
    
    // Update state with error details
    this.setState(prevState => ({
      errorInfo,
      errorCount: prevState.errorCount + 1
    }))
    
    // Call optional error handler
    this.props.onError?.(error, errorInfo)
    
    // Send to error tracking service (e.g., Sentry)
    if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
      // Production error tracking
      this.logErrorToService(error, errorInfo)
    }
  }

  logErrorToService = (error: Error, errorInfo: React.ErrorInfo) => {
    // Implementation would send to actual error tracking service
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }
    
    // In production, send to error tracking API
    console.log("Would send to error tracking:", errorData)
  }

  resetError = () => {
    const { maxRetries = 3 } = this.props
    
    if (this.state.errorCount >= maxRetries) {
      toast.error(`Maximum retry attempts (${maxRetries}) reached. Please refresh the page.`)
      return
    }
    
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      
      return (
        <FallbackComponent
          error={this.state.error}
          resetError={this.resetError}
          errorCount={this.state.errorCount}
        />
      )
    }

    return this.props.children
  }
}

// Hook for error handling
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null)

  const resetError = React.useCallback(() => {
    setError(null)
  }, [])

  const captureError = React.useCallback((error: Error) => {
    setError(error)
    console.error("Error captured:", error)
  }, [])

  // Throw error to nearest error boundary
  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { captureError, resetError }
}

// Async error boundary for handling promise rejections
export function AsyncErrorBoundary({ children }: { children: React.ReactNode }) {
  const { captureError } = useErrorHandler()

  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      captureError(new Error(event.reason))
    }

    window.addEventListener("unhandledrejection", handleUnhandledRejection)
    
    return () => {
      window.removeEventListener("unhandledrejection", handleUnhandledRejection)
    }
  }, [captureError])

  return <>{children}</>
}

// Component-specific error states
export function ComponentError({
  title = "Failed to load",
  message = "We couldn't load this section. Please try again.",
  onRetry,
  showDetails = false,
  error
}: {
  title?: string
  message?: string
  onRetry?: () => void
  showDetails?: boolean
  error?: Error | null
}) {
  return (
    <div className="p-6 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
        <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{message}</p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      )}
      
      {showDetails && error && (
        <details className="mt-4 text-left">
          <summary className="text-xs text-gray-500 cursor-pointer">
            Error details
          </summary>
          <pre className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded overflow-auto">
            {error.stack}
          </pre>
        </details>
      )}
    </div>
  )
}