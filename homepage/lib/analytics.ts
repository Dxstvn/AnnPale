/**
 * Analytics tracking utilities for Ann Pale
 * Supports Google Analytics, custom events, and user behavior tracking
 */

type EventCategory = 
  | "engagement"
  | "navigation"
  | "booking"
  | "auth"
  | "creator"
  | "admin"
  | "error"

interface TrackEventProps {
  action: string
  category: EventCategory
  label?: string
  value?: number
  userId?: string
  metadata?: Record<string, any>
}

class Analytics {
  private isInitialized = false
  private debug = process.env.NODE_ENV === "development"

  /**
   * Initialize analytics with providers
   */
  init() {
    if (this.isInitialized) return

    // Initialize Google Analytics
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_GA_ID) {
      this.initGoogleAnalytics()
    }

    // Initialize other providers as needed
    this.isInitialized = true
    this.log("Analytics initialized")
  }

  /**
   * Initialize Google Analytics
   */
  private initGoogleAnalytics() {
    const script = document.createElement("script")
    script.src = `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`
    script.async = true
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    function gtag(...args: any[]) {
      window.dataLayer.push(args)
    }
    gtag("js", new Date())
    gtag("config", process.env.NEXT_PUBLIC_GA_ID)
  }

  /**
   * Track custom events
   */
  track({ action, category, label, value, userId, metadata }: TrackEventProps) {
    if (!this.isInitialized) this.init()

    const eventData = {
      event: "custom_event",
      event_category: category,
      event_action: action,
      event_label: label,
      value: value,
      user_id: userId,
      ...metadata,
      timestamp: new Date().toISOString(),
    }

    // Send to Google Analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", action, {
        event_category: category,
        event_label: label,
        value: value,
        user_id: userId,
        ...metadata,
      })
    }

    // Log in development
    this.log("Event tracked:", eventData)

    // Store in local analytics queue for batch processing
    this.queueEvent(eventData)
  }

  /**
   * Track page views
   */
  pageView(path: string, title?: string) {
    if (!this.isInitialized) this.init()

    const pageData = {
      page_path: path,
      page_title: title || document.title,
      page_location: window.location.href,
    }

    // Send to Google Analytics
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", pageData)
    }

    this.log("Page view tracked:", pageData)
  }

  /**
   * Track user interactions
   */
  interaction(element: string, action: string, metadata?: Record<string, any>) {
    this.track({
      action: `${element}_${action}`,
      category: "engagement",
      metadata,
    })
  }

  /**
   * Track booking flow
   */
  bookingEvent(step: string, creatorId?: string, value?: number) {
    this.track({
      action: `booking_${step}`,
      category: "booking",
      label: creatorId,
      value,
      metadata: {
        booking_step: step,
        creator_id: creatorId,
      },
    })
  }

  /**
   * Track authentication events
   */
  authEvent(action: "login" | "signup" | "logout", method?: string) {
    this.track({
      action: `auth_${action}`,
      category: "auth",
      label: method,
      metadata: {
        auth_method: method,
      },
    })
  }

  /**
   * Track errors
   */
  error(error: Error, context?: string) {
    this.track({
      action: "error_occurred",
      category: "error",
      label: context,
      metadata: {
        error_message: error.message,
        error_stack: error.stack,
        error_context: context,
      },
    })
  }

  /**
   * Track creator analytics
   */
  creatorEvent(action: string, metadata?: Record<string, any>) {
    this.track({
      action: `creator_${action}`,
      category: "creator",
      metadata,
    })
  }

  /**
   * Track admin actions
   */
  adminEvent(action: string, metadata?: Record<string, any>) {
    this.track({
      action: `admin_${action}`,
      category: "admin",
      metadata,
    })
  }

  /**
   * Set user properties
   */
  setUser(userId: string, properties?: Record<string, any>) {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("set", {
        user_id: userId,
        user_properties: properties,
      })
    }

    this.log("User set:", { userId, properties })
  }

  /**
   * Clear user data (on logout)
   */
  clearUser() {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("set", { user_id: null })
    }

    this.log("User cleared")
  }

  /**
   * Queue events for batch processing
   */
  private queueEvent(eventData: Record<string, any>) {
    if (typeof window === "undefined") return

    const queue = JSON.parse(localStorage.getItem("analytics_queue") || "[]")
    queue.push(eventData)

    // Limit queue size
    if (queue.length > 100) {
      queue.shift()
    }

    localStorage.setItem("analytics_queue", JSON.stringify(queue))

    // Process queue if it reaches threshold
    if (queue.length >= 10) {
      this.processQueue()
    }
  }

  /**
   * Process queued events
   */
  private async processQueue() {
    const queue = JSON.parse(localStorage.getItem("analytics_queue") || "[]")
    if (queue.length === 0) return

    try {
      // TODO: Send to analytics endpoint
      // await fetch("/api/analytics", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ events: queue }),
      // })

      // Clear queue on success
      localStorage.setItem("analytics_queue", "[]")
      this.log("Analytics queue processed:", queue.length, "events")
    } catch (error) {
      console.error("Failed to process analytics queue:", error)
    }
  }

  /**
   * Debug logging
   */
  private log(...args: any[]) {
    if (this.debug) {
      console.log("[Analytics]", ...args)
    }
  }
}

// Export singleton instance
export const analytics = new Analytics()

// Auto-initialize on import
if (typeof window !== "undefined") {
  analytics.init()
}

// Extend Window interface for gtag
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}