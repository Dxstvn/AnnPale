import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createClient } from '@/lib/supabase/server-admin'

// Initialize Stripe
const stripe = process.env.STRIPE_SANDBOX_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    })
  : null

// Determine webhook secret based on environment
const webhookSecret = process.env.NODE_ENV === 'development'
  ? (process.env.STRIPE_WEBHOOK_SECRET_DEV || process.env.STRIPE_WEBHOOK_SECRET)
  : (process.env.STRIPE_WEBHOOK_SECRET || process.env.STRIPE_WEBHOOK_SECRET_SUBSCRIPTIONS)

// Enhanced error logging and monitoring system
function logWebhookEvent(correlationId: string, message: string, data?: any) {
  const timestamp = new Date().toISOString()
  console.log(`[WEBHOOK ${correlationId}] ${timestamp}: ${message}`, data ? JSON.stringify(data, null, 2) : '')
}

async function recordWebhookError(supabase: any, correlationId: string, eventType: string, error: Error, eventData?: any) {
  try {
    // Record error in webhook_events table for monitoring and debugging
    const { error: insertError } = await supabase
      .from('webhook_events')
      .insert({
        correlation_id: correlationId,
        event_type: eventType,
        status: 'failed',
        error_message: error.message,
        error_stack: error.stack,
        event_data: eventData,
        processed_at: new Date().toISOString()
      })

    if (insertError) {
      console.error(`Failed to record webhook error: ${insertError.message}`)
    }
  } catch (recordError) {
    console.error('Error recording webhook error:', recordError)
  }
}

async function recordWebhookSuccess(supabase: any, correlationId: string, eventType: string, result?: any) {
  try {
    const { error: insertError } = await supabase
      .from('webhook_events')
      .insert({
        correlation_id: correlationId,
        event_type: eventType,
        status: 'completed',
        result_data: result,
        processed_at: new Date().toISOString()
      })

    if (insertError) {
      console.error(`Failed to record webhook success: ${insertError.message}`)
    }
  } catch (recordError) {
    console.error('Error recording webhook success:', recordError)
  }
}

// Enhanced error handling with retry logic
async function executeWithRetry<T>(
  operation: () => Promise<T>,
  correlationId: string,
  operationName: string,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logWebhookEvent(correlationId, `Attempting ${operationName} (attempt ${attempt}/${maxRetries})`)
      const result = await operation()

      if (attempt > 1) {
        logWebhookEvent(correlationId, `${operationName} succeeded on attempt ${attempt}`)
      }

      return result
    } catch (error) {
      lastError = error as Error
      logWebhookEvent(correlationId, `${operationName} failed on attempt ${attempt}: ${lastError.message}`)

      if (attempt === maxRetries) {
        logWebhookEvent(correlationId, `${operationName} failed after ${maxRetries} attempts`)
        throw lastError
      }

      // Exponential backoff: wait 1s, 2s, 4s, etc.
      const delayMs = Math.pow(2, attempt - 1) * 1000
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }

  throw lastError || new Error(`Operation failed after ${maxRetries} attempts`)
}

// Error classification functions for better error handling
function isTransientError(error: Error): boolean {
  const transientErrorPatterns = [
    /connection/i,
    /timeout/i,
    /network/i,
    /temporarily unavailable/i,
    /rate limit/i,
    /502/,
    /503/,
    /504/,
    /ECONNRESET/,
    /ENOTFOUND/,
    /ETIMEDOUT/
  ]

  return transientErrorPatterns.some(pattern => pattern.test(error.message))
}

function classifyError(error: Error): string {
  if (error.message.includes('connection')) return 'connection_error'
  if (error.message.includes('timeout')) return 'timeout_error'
  if (error.message.includes('not found')) return 'not_found_error'
  if (error.message.includes('validation')) return 'validation_error'
  if (error.message.includes('authentication')) return 'auth_error'
  if (error.message.includes('authorization')) return 'permission_error'
  if (error.message.includes('duplicate')) return 'duplicate_error'
  if (error.message.includes('constraint')) return 'constraint_error'
  if (isTransientError(error)) return 'transient_error'
  return 'unknown_error'
}

// Helper function to record webhook events in database
async function recordWebhookEvent(supabase: any, eventId: string, eventType: string, payload: any, status: 'processed' | 'failed', errorMessage?: string) {
  try {
    await supabase
      .from('webhook_events')
      .insert({
        provider: 'stripe',
        event_id: eventId,
        event_type: eventType,
        payload: payload,
        status: status,
        processed_at: new Date().toISOString(),
        error_message: errorMessage || null
      })
  } catch (error) {
    // Don't fail the entire webhook if logging fails
    console.error(`Failed to record webhook event ${eventId}:`, error)
  }
}

export async function POST(request: NextRequest) {
  const correlationId = `wh_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Log environment for debugging
  logWebhookEvent(correlationId, `Environment: ${process.env.NODE_ENV || 'production'}`)

  if (!stripe || !webhookSecret) {
    logWebhookEvent(correlationId, 'Webhook configuration missing')
    return NextResponse.json({
      error: 'Stripe webhook is not configured'
    }, { status: 503 })
  }

  try {
    const body = await request.text()
    const signature = (await headers()).get('stripe-signature')

    if (!signature) {
      logWebhookEvent(correlationId, 'No signature provided')
      return NextResponse.json({
        error: 'No webhook signature provided'
      }, { status: 400 })
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      logWebhookEvent(correlationId, `Processing webhook event: ${event.type}`, { eventId: event.id })
    } catch (err: any) {
      logWebhookEvent(correlationId, `Webhook signature verification failed: ${err.message}`)
      return NextResponse.json({
        error: `Webhook signature verification failed: ${err.message}`
      }, { status: 400 })
    }

    const supabase = createClient()

    // Handle the event with enhanced error handling and retry logic
    try {
      await executeWithRetry(async () => {
        switch (event.type) {
          case 'checkout.session.completed': {
            await handleCheckoutSessionCompleted(supabase, event, correlationId)
            break
          }

          case 'customer.subscription.created': {
            await handleSubscriptionCreated(supabase, event, correlationId)
            break
          }

          case 'customer.subscription.updated': {
            await handleSubscriptionUpdated(supabase, event, correlationId)
            break
          }

          case 'customer.subscription.deleted': {
            await handleSubscriptionDeleted(supabase, event, correlationId)
            break
          }

          case 'invoice.payment_succeeded': {
            await handlePaymentSucceeded(supabase, event, correlationId)
            break
          }

          case 'invoice.payment_failed': {
            await handlePaymentFailed(supabase, event, correlationId)
            break
          }

          case 'customer.subscription.trial_will_end': {
            await handleTrialWillEnd(supabase, event, correlationId)
            break
          }

          case 'customer.subscription.paused': {
            await handleSubscriptionPaused(supabase, event, correlationId)
            break
          }

          case 'customer.subscription.resumed': {
            await handleSubscriptionResumed(supabase, event, correlationId)
            break
          }

          case 'invoice.payment_action_required': {
            await handlePaymentActionRequired(supabase, event, correlationId)
            break
          }

          default:
            logWebhookEvent(correlationId, `Unhandled event type: ${event.type}`)
            return // No need to retry for unhandled events
        }
      }, correlationId, `webhook processing for ${event.type}`, 2) // 2 retries for webhook processing

      // Record successful webhook processing
      await recordWebhookSuccess(supabase, correlationId, event.type, { eventId: event.id })

      // Record successful webhook processing
      await recordWebhookEvent(supabase, event.id, event.type, event.data.object, 'processed')

      logWebhookEvent(correlationId, `Successfully processed webhook event: ${event.type}`)
      return NextResponse.json({ received: true, correlationId })

    } catch (handlerError: any) {
      logWebhookEvent(correlationId, `Error in webhook handler: ${handlerError.message}`, handlerError)

      // Record failed webhook processing with enhanced error details
      await recordWebhookError(supabase, correlationId, event.type, handlerError, event.data.object)
      await recordWebhookEvent(supabase, event.id, event.type, event.data.object, 'failed', handlerError.message)

      // Determine if this is a retryable error or permanent failure
      const isRetryableError = isTransientError(handlerError)
      const statusCode = isRetryableError ? 500 : 400

      return NextResponse.json({
        error: 'Webhook processing failed',
        correlationId,
        retryable: isRetryableError,
        errorType: classifyError(handlerError)
      }, { status: statusCode })
    }

  } catch (error: any) {
    logWebhookEvent(correlationId, `General webhook error: ${error.message}`, error)
    return NextResponse.json({
      error: 'Webhook processing failed',
      correlationId
    }, { status: 500 })
  }
}

// Handler for checkout.session.completed
async function handleCheckoutSessionCompleted(supabase: any, event: Stripe.Event, correlationId: string) {
  const session = event.data.object as Stripe.Checkout.Session

  if (session.mode !== 'subscription') {
    logWebhookEvent(correlationId, 'Ignoring non-subscription checkout session')
    return
  }

  if (!session.subscription || !stripe) {
    logWebhookEvent(correlationId, 'No subscription ID in checkout session')
    return
  }

  // Fetch complete subscription details from Stripe
  const subscription = await stripe.subscriptions.retrieve(session.subscription as string)

  logWebhookEvent(correlationId, 'Fetched subscription details', {
    subscriptionId: subscription.id,
    status: subscription.status,
    currentPeriodStart: subscription.current_period_start,
    currentPeriodEnd: subscription.current_period_end
  })

  // Update subscription order with complete data
  const { data: updatedRecord, error: updateError } = await supabase
    .from('subscription_orders')
    .update({
      status: subscription.status === 'trialing' ? 'trialing' : 'active',
      stripe_subscription_id: subscription.id,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      next_billing_date: new Date(subscription.current_period_end * 1000).toISOString(),
      activated_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('stripe_checkout_session_id', session.id)
    .select()

  if (updateError) {
    logWebhookEvent(correlationId, `Error updating subscription order: ${updateError.message}`, updateError)
    throw new Error(`Failed to update subscription order: ${updateError.message}`)
  }

  if (!updatedRecord || updatedRecord.length === 0) {
    logWebhookEvent(correlationId, `No subscription order found for session: ${session.id}`)
    throw new Error(`No subscription order found for checkout session: ${session.id}`)
  }

  logWebhookEvent(correlationId, `Successfully activated subscription ${subscription.id} for session ${session.id}`)
}

// Handler for customer.subscription.created
async function handleSubscriptionCreated(supabase: any, event: Stripe.Event, correlationId: string) {
  const subscription = event.data.object as Stripe.Subscription

  logWebhookEvent(correlationId, 'Processing subscription created', {
    subscriptionId: subscription.id,
    metadata: subscription.metadata
  })

  if (!subscription.metadata.user_id || !subscription.metadata.tier_id) {
    logWebhookEvent(correlationId, 'Missing required metadata in subscription')
    throw new Error('Subscription missing required metadata (user_id, tier_id)')
  }

  // Try to find subscription order by metadata first, then by existing stripe_subscription_id
  let updateQuery = supabase
    .from('subscription_orders')
    .update({
      stripe_subscription_id: subscription.id,
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      next_billing_date: new Date(subscription.current_period_end * 1000).toISOString(),
      status: subscription.status === 'trialing' ? 'trialing' : 'active',
      updated_at: new Date().toISOString()
    })

  // First try: Find by user_id + tier_id where stripe_subscription_id is null (new subscription)
  const { data: newRecord, error: newError } = await updateQuery
    .eq('user_id', subscription.metadata.user_id)
    .eq('tier_id', subscription.metadata.tier_id)
    .is('stripe_subscription_id', null)
    .select()

  if (newRecord && newRecord.length > 0) {
    logWebhookEvent(correlationId, `Updated new subscription order for user ${subscription.metadata.user_id}`)
    return
  }

  // Second try: Update existing subscription (for subscription updates)
  const { data: existingRecord, error: existingError } = await updateQuery
    .eq('stripe_subscription_id', subscription.id)
    .select()

  if (existingRecord && existingRecord.length > 0) {
    logWebhookEvent(correlationId, `Updated existing subscription ${subscription.id}`)
    return
  }

  // If neither worked, log the issue
  if (newError) {
    logWebhookEvent(correlationId, `Error updating new subscription: ${newError.message}`, newError)
  }
  if (existingError) {
    logWebhookEvent(correlationId, `Error updating existing subscription: ${existingError.message}`, existingError)
  }

  logWebhookEvent(correlationId, `No matching subscription order found for subscription ${subscription.id}`)
}

// Handler for customer.subscription.updated
async function handleSubscriptionUpdated(supabase: any, event: Stripe.Event, correlationId: string) {
  const subscription = event.data.object as Stripe.Subscription

  // Log raw subscription data to debug date issues
  logWebhookEvent(correlationId, `Raw subscription data`, {
    id: subscription.id,
    status: subscription.status,
    current_period_start: subscription.current_period_start,
    current_period_end: subscription.current_period_end,
    canceled_at: subscription.canceled_at,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
  })

  // Map Stripe status to our internal status
  let status = 'active'
  switch (subscription.status) {
    case 'active':
      status = 'active'
      break
    case 'past_due':
      status = 'active' // Keep active but mark payment as past due
      break
    case 'unpaid':
      status = 'pending'
      break
    case 'canceled':
      status = 'cancelled'
      break
    case 'incomplete':
    case 'incomplete_expired':
      status = 'expired'
      break
    case 'trialing':
      status = 'trialing'
      break
    case 'paused':
      status = 'paused'
      break
    default:
      status = 'pending'
  }

  // Get current subscription state to detect transitions
  const { data: currentSub } = await supabase
    .from('subscription_orders')
    .select('status, cancelled_at')
    .eq('stripe_subscription_id', subscription.id)
    .single()

  // Detect if subscription was resumed (from cancelled to active)
  const wasResumed = currentSub?.status === 'cancelled' && status === 'active'

  // Prepare update object with safe date conversions
  const updateData: any = {
    status
  }

  // Safely convert dates with validation
  try {
    if (subscription.current_period_start) {
      updateData.current_period_start = new Date(subscription.current_period_start * 1000).toISOString()
    }
    if (subscription.current_period_end) {
      updateData.current_period_end = new Date(subscription.current_period_end * 1000).toISOString()
      // Set next billing date if subscription is active
      if (subscription.status === 'active') {
        updateData.next_billing_date = new Date(subscription.current_period_end * 1000).toISOString()
      } else {
        updateData.next_billing_date = null
      }
    }
    updateData.updated_at = new Date().toISOString()
  } catch (dateError: any) {
    logWebhookEvent(correlationId, `Error converting dates: ${dateError.message}`, {
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end
    })
    throw new Error(`Date conversion error: ${dateError.message}`)
  }

  // Handle cancellation vs resumption
  logWebhookEvent(correlationId, `Subscription update details`, {
    status: subscription.status,
    canceled_at: subscription.canceled_at,
    cancel_at_period_end: subscription.cancel_at_period_end,
    wasResumed,
    currentStatus: currentSub?.status
  })

  if (subscription.status === 'canceled' && subscription.canceled_at) {
    updateData.cancelled_at = new Date(subscription.canceled_at * 1000).toISOString()
  } else if (subscription.status === 'active' && subscription.cancel_at_period_end) {
    // Subscription is active but set to cancel at period end
    // Only set cancelled_at if it exists (it might be null if just set to cancel)
    if (subscription.canceled_at) {
      updateData.cancelled_at = new Date(subscription.canceled_at * 1000).toISOString()
    }
  } else if (wasResumed || (subscription.status === 'active' && !subscription.cancel_at_period_end && currentSub?.cancelled_at)) {
    // Clear cancellation data when subscription is resumed/reactivated
    updateData.cancelled_at = null
    updateData.resumed_at = new Date().toISOString()
    logWebhookEvent(correlationId, `Subscription ${subscription.id} resumed from cancelled state`)
  }

  // Update subscription order
  const { error: updateError } = await supabase
    .from('subscription_orders')
    .update(updateData)
    .eq('stripe_subscription_id', subscription.id)

  if (updateError) {
    logWebhookEvent(correlationId, `Error updating subscription: ${updateError.message}`, updateError)
    throw new Error(`Failed to update subscription: ${updateError.message}`)
  }

  logWebhookEvent(correlationId, `Updated subscription ${subscription.id} to status: ${status}${wasResumed ? ' (resumed)' : ''}`)
}

// Handler for customer.subscription.deleted
async function handleSubscriptionDeleted(supabase: any, event: Stripe.Event, correlationId: string) {
  const subscription = event.data.object as Stripe.Subscription

  // Mark subscription as cancelled
  const { error: updateError } = await supabase
    .from('subscription_orders')
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id)

  if (updateError) {
    logWebhookEvent(correlationId, `Error cancelling subscription: ${updateError.message}`, updateError)
    throw new Error(`Failed to cancel subscription: ${updateError.message}`)
  }

  logWebhookEvent(correlationId, `Cancelled subscription ${subscription.id}`)
}

// Handler for invoice.payment_succeeded
async function handlePaymentSucceeded(supabase: any, event: Stripe.Event, correlationId: string) {
  const invoice = event.data.object as Stripe.Invoice

  if (!invoice.subscription) {
    logWebhookEvent(correlationId, 'Payment succeeded for non-subscription invoice')
    return
  }

  // Get current subscription to check if it was previously in failed state
  const { data: currentSub, error: fetchError } = await supabase
    .from('subscription_orders')
    .select('status, failed_payment_count, metadata')
    .eq('stripe_subscription_id', invoice.subscription)
    .single()

  if (fetchError) {
    logWebhookEvent(correlationId, `Error fetching subscription for payment success: ${fetchError.message}`)
    // Continue with update even if fetch fails
  }

  const wasRecovering = currentSub?.status === 'past_due' || (currentSub?.failed_payment_count || 0) > 0
  const previousFailureCount = currentSub?.failed_payment_count || 0

  // Update subscription to ensure it's active and reset payment counters
  const { error: updateError } = await supabase
    .from('subscription_orders')
    .update({
      status: 'active',
      last_payment_date: new Date().toISOString(),
      last_payment_status: 'succeeded',
      failed_payment_count: 0, // Reset failed payment count
      metadata: {
        ...currentSub?.metadata,
        recovered_at: wasRecovering ? new Date().toISOString() : currentSub?.metadata?.recovered_at,
        recovery_count: wasRecovering
          ? ((currentSub?.metadata?.recovery_count || 0) + 1)
          : (currentSub?.metadata?.recovery_count || 0),
        stripe_invoice_id: invoice.id,
        payment_history: [
          ...(currentSub?.metadata?.payment_history || []),
          {
            date: new Date().toISOString(),
            status: 'succeeded',
            amount: invoice.amount_paid,
            invoice_id: invoice.id,
            recovered_from_failure: wasRecovering,
            previous_failure_count: previousFailureCount
          }
        ].slice(-20) // Keep last 20 payment records
      },
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', invoice.subscription)

  if (updateError) {
    logWebhookEvent(correlationId, `Error updating subscription after payment: ${updateError.message}`, updateError)
    throw new Error(`Failed to update subscription after payment: ${updateError.message}`)
  }

  logWebhookEvent(correlationId, `Payment succeeded for subscription ${invoice.subscription}`, {
    wasRecovering,
    previousFailureCount,
    invoiceId: invoice.id,
    amountPaid: invoice.amount_paid,
    previousStatus: currentSub?.status
  })

  // TODO: Implement recovery notification
  // if (wasRecovering) {
  //   await sendPaymentRecoveryNotification(currentSub.user, {
  //     creatorName: currentSub.creator?.name,
  //     amount: invoice.amount_paid,
  //     recoveredFromFailures: previousFailureCount
  //   })
  // }
}

// Handler for invoice.payment_failed
async function handlePaymentFailed(supabase: any, event: Stripe.Event, correlationId: string) {
  const invoice = event.data.object as Stripe.Invoice

  if (!invoice.subscription) {
    logWebhookEvent(correlationId, 'Payment failed for non-subscription invoice')
    return
  }

  // Get current subscription to check failure count and user details
  const { data: currentSub, error: fetchError } = await supabase
    .from('subscription_orders')
    .select(`
      failed_payment_count,
      status,
      user_id,
      creator_id,
      total_amount,
      creator:profiles!subscription_orders_creator_id_fkey(name, username),
      user:profiles!subscription_orders_user_id_fkey(email, name)
    `)
    .eq('stripe_subscription_id', invoice.subscription)
    .single()

  if (fetchError) {
    logWebhookEvent(correlationId, `Error fetching subscription for payment failure: ${fetchError.message}`)
    throw new Error(`Failed to fetch subscription: ${fetchError.message}`)
  }

  const currentFailureCount = currentSub?.failed_payment_count || 0
  const newFailureCount = currentFailureCount + 1

  // Enhanced failure management strategy:
  // 1-2 failures: Keep active, send retry notifications
  // 3 failures: Move to "past_due" status
  // 4+ failures: Expire subscription
  let newStatus = 'active'
  let shouldNotifyUser = false
  let notificationType = ''

  if (newFailureCount >= 4) {
    newStatus = 'expired'
    shouldNotifyUser = true
    notificationType = 'subscription_expired_payment_failed'
  } else if (newFailureCount >= 3) {
    newStatus = 'past_due'
    shouldNotifyUser = true
    notificationType = 'subscription_past_due'
  } else {
    newStatus = 'active' // Keep active but track failures
    shouldNotifyUser = true
    notificationType = 'payment_retry_failed'
  }

  // Calculate next retry date (Stripe handles this, but we track for reference)
  const nextRetryDate = new Date()
  nextRetryDate.setDate(nextRetryDate.getDate() + (newFailureCount <= 2 ? 3 : 7)) // 3 days for early failures, 7 for later

  const { error: updateError } = await supabase
    .from('subscription_orders')
    .update({
      status: newStatus,
      last_payment_status: 'failed',
      last_payment_date: new Date().toISOString(),
      failed_payment_count: newFailureCount,
      metadata: {
        ...currentSub.metadata,
        last_failure_reason: invoice.last_payment_error?.code || 'unknown',
        next_retry_date: nextRetryDate.toISOString(),
        stripe_invoice_id: invoice.id,
        failure_history: [
          ...(currentSub.metadata?.failure_history || []),
          {
            date: new Date().toISOString(),
            reason: invoice.last_payment_error?.code || 'unknown',
            message: invoice.last_payment_error?.message || 'Payment failed',
            attempt_count: invoice.attempt_count
          }
        ].slice(-10) // Keep last 10 failure records
      },
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', invoice.subscription)

  if (updateError) {
    logWebhookEvent(correlationId, `Error updating subscription after payment failure: ${updateError.message}`, updateError)
    throw new Error(`Failed to update subscription after payment failure: ${updateError.message}`)
  }

  // Log detailed payment failure information
  logWebhookEvent(correlationId, `Payment failed for subscription ${invoice.subscription}`, {
    failureCount: newFailureCount,
    newStatus,
    previousStatus: currentSub.status,
    failureReason: invoice.last_payment_error?.code || 'unknown',
    invoiceId: invoice.id,
    attemptCount: invoice.attempt_count,
    shouldNotifyUser,
    notificationType
  })

  // TODO: Implement notification system
  // if (shouldNotifyUser) {
  //   await sendPaymentFailureNotification(currentSub.user, {
  //     type: notificationType,
  //     creatorName: currentSub.creator?.name,
  //     amount: currentSub.total_amount,
  //     failureCount: newFailureCount,
  //     nextRetryDate
  //   })
  // }
}

// Handler for customer.subscription.trial_will_end
async function handleTrialWillEnd(supabase: any, event: Stripe.Event, correlationId: string) {
  const subscription = event.data.object as Stripe.Subscription

  logWebhookEvent(correlationId, `Trial ending soon for subscription ${subscription.id}`)

  // Update subscription with trial end date
  const { error: updateError } = await supabase
    .from('subscription_orders')
    .update({
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id)

  if (updateError) {
    logWebhookEvent(correlationId, `Error updating trial end date: ${updateError.message}`, updateError)
    throw new Error(`Failed to update trial end date: ${updateError.message}`)
  }
}

// Handler for customer.subscription.paused
async function handleSubscriptionPaused(supabase: any, event: Stripe.Event, correlationId: string) {
  const subscription = event.data.object as Stripe.Subscription

  // Update subscription status to paused
  const { error: updateError } = await supabase
    .from('subscription_orders')
    .update({
      status: 'paused',
      paused_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id)

  if (updateError) {
    logWebhookEvent(correlationId, `Error pausing subscription: ${updateError.message}`, updateError)
    throw new Error(`Failed to pause subscription: ${updateError.message}`)
  }

  logWebhookEvent(correlationId, `Subscription ${subscription.id} paused`)
}

// Handler for customer.subscription.resumed
async function handleSubscriptionResumed(supabase: any, event: Stripe.Event, correlationId: string) {
  const subscription = event.data.object as Stripe.Subscription

  // Update subscription status to active and clear all cancellation/pause data
  const { error: updateError } = await supabase
    .from('subscription_orders')
    .update({
      status: 'active',
      resumed_at: new Date().toISOString(),
      paused_at: null,
      cancelled_at: null, // Clear cancellation when resumed
      current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
      current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
      next_billing_date: new Date(subscription.current_period_end * 1000).toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', subscription.id)

  if (updateError) {
    logWebhookEvent(correlationId, `Error resuming subscription: ${updateError.message}`, updateError)
    throw new Error(`Failed to resume subscription: ${updateError.message}`)
  }

  logWebhookEvent(correlationId, `Subscription ${subscription.id} resumed and cleared cancellation data`)
}

// Handler for invoice.payment_action_required
async function handlePaymentActionRequired(supabase: any, event: Stripe.Event, correlationId: string) {
  const invoice = event.data.object as Stripe.Invoice

  if (!invoice.subscription) {
    logWebhookEvent(correlationId, 'Payment action required for non-subscription invoice')
    return
  }

  // Update subscription status to indicate action required
  const { error: updateError } = await supabase
    .from('subscription_orders')
    .update({
      status: 'past_due', // Mark as past due since action is required
      last_payment_status: 'requires_action',
      metadata: {
        action_required: true,
        stripe_invoice_id: invoice.id,
        payment_intent_id: invoice.payment_intent,
        requires_confirmation: true,
        action_required_at: new Date().toISOString()
      },
      updated_at: new Date().toISOString()
    })
    .eq('stripe_subscription_id', invoice.subscription)

  if (updateError) {
    logWebhookEvent(correlationId, `Error updating subscription for action required: ${updateError.message}`, updateError)
    throw new Error(`Failed to update subscription for action required: ${updateError.message}`)
  }

  logWebhookEvent(correlationId, `Payment action required for subscription ${invoice.subscription}`, {
    invoiceId: invoice.id,
    paymentIntentId: invoice.payment_intent
  })

  // TODO: Implement action required notification
  // await sendActionRequiredNotification(subscription.user, {
  //   invoiceId: invoice.id,
  //   paymentIntentId: invoice.payment_intent
  // })
}