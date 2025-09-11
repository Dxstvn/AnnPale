import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { EventEmitter } from 'events'

export interface DatabaseChangeEvent {
  table: string
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  record: any
  timestamp: string
}

export interface SubscriptionOrderRecord {
  id: string
  user_id: string
  creator_id: string
  tier_id: string
  status: 'pending' | 'active' | 'paused' | 'cancelled' | 'expired' | 'failed'
  billing_period: 'monthly' | 'yearly'
  total_amount: number
  platform_fee: number
  creator_earnings: number
  stripe_subscription_id?: string
  stripe_checkout_session_id?: string
  stripe_customer_id?: string
  current_period_start?: string
  current_period_end?: string
  next_billing_date?: string
  activated_at?: string
  cancelled_at?: string
  created_at: string
  updated_at: string
}

export interface TransactionRecord {
  id: string
  order_id?: string
  subscription_id?: string
  user_id: string
  creator_id: string
  amount: number
  platform_fee: number
  creator_earnings: number
  status: string
  stripe_payment_intent_id?: string
  stripe_charge_id?: string
  stripe_transfer_id?: string
  stripe_application_fee_id?: string
  transfer_status?: string
  metadata?: any
  created_at: string
  updated_at: string
}

export class DatabaseTracker extends EventEmitter {
  private supabase: SupabaseClient
  private subscriptions: Map<string, any> = new Map()
  private isTracking = false
  
  constructor(supabaseUrl?: string, supabaseKey?: string) {
    super()
    
    // Use service role key for full database access
    const url = supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = supabaseKey || process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!url || !key) {
      throw new Error('Supabase URL and service role key are required')
    }
    
    this.supabase = createClient(url, key, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }
  
  /**
   * Start tracking database changes
   */
  async startTracking(tables: string[] = ['subscription_orders', 'transactions', 'webhook_events']): Promise<void> {
    if (this.isTracking) {
      console.log('⚠️ Database tracker already running')
      return
    }
    
    console.log('🚀 Starting database tracker for tables:', tables.join(', '))
    this.isTracking = true
    
    // Set up real-time subscriptions for each table
    for (const table of tables) {
      const subscription = this.supabase
        .channel(`${table}_changes`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: table
          },
          (payload) => {
            this.handleDatabaseChange(table, payload)
          }
        )
        .subscribe()
      
      this.subscriptions.set(table, subscription)
    }
    
    console.log('✅ Database tracker started')
  }
  
  /**
   * Stop tracking database changes
   */
  async stopTracking(): Promise<void> {
    if (!this.isTracking) {
      return
    }
    
    console.log('🛑 Stopping database tracker...')
    
    // Unsubscribe from all channels
    for (const [table, subscription] of this.subscriptions) {
      await this.supabase.removeChannel(subscription)
      this.subscriptions.delete(table)
    }
    
    this.isTracking = false
    console.log('✅ Database tracker stopped')
  }
  
  /**
   * Handle database change event
   */
  private handleDatabaseChange(table: string, payload: any): void {
    const event: DatabaseChangeEvent = {
      table,
      type: payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE',
      record: payload.new || payload.old,
      timestamp: new Date().toISOString()
    }
    
    console.log(`📊 Database change detected in ${table}: ${event.type}`)
    
    // Emit general change event
    this.emit('change', event)
    
    // Emit table-specific events
    this.emit(`${table}:${event.type.toLowerCase()}`, event.record)
    
    // Emit specific events for important changes
    if (table === 'subscription_orders') {
      this.handleSubscriptionOrderChange(event)
    } else if (table === 'transactions') {
      this.handleTransactionChange(event)
    }
  }
  
  /**
   * Handle subscription order changes
   */
  private handleSubscriptionOrderChange(event: DatabaseChangeEvent): void {
    const order = event.record as SubscriptionOrderRecord
    
    if (event.type === 'UPDATE' && order.status === 'active') {
      this.emit('subscription:activated', order)
      console.log(`✅ Subscription activated: ${order.id}`)
    }
    
    if (event.type === 'INSERT') {
      this.emit('subscription:created', order)
      console.log(`📝 Subscription created: ${order.id}`)
    }
  }
  
  /**
   * Handle transaction changes
   */
  private handleTransactionChange(event: DatabaseChangeEvent): void {
    const transaction = event.record as TransactionRecord
    
    if (transaction.stripe_transfer_id) {
      this.emit('transfer:created', transaction)
      console.log(`💸 Transfer created: ${transaction.stripe_transfer_id}`)
    }
    
    if (transaction.stripe_application_fee_id) {
      this.emit('fee:created', transaction)
      console.log(`💰 Application fee created: ${transaction.stripe_application_fee_id}`)
    }
  }
  
  /**
   * Wait for a specific subscription order to be created
   */
  async waitForSubscriptionOrder(
    userId: string,
    tierId: string,
    timeout: number = 30000
  ): Promise<SubscriptionOrderRecord> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout waiting for subscription order creation`))
      }, timeout)
      
      const handler = (order: SubscriptionOrderRecord) => {
        if (order.user_id === userId && order.tier_id === tierId) {
          clearTimeout(timer)
          this.removeListener('subscription:created', handler)
          resolve(order)
        }
      }
      
      this.on('subscription:created', handler)
    })
  }
  
  /**
   * Wait for subscription activation
   */
  async waitForSubscriptionActivation(
    subscriptionId: string,
    timeout: number = 30000
  ): Promise<SubscriptionOrderRecord> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout waiting for subscription activation`))
      }, timeout)
      
      const handler = (order: SubscriptionOrderRecord) => {
        if (order.id === subscriptionId && order.status === 'active') {
          clearTimeout(timer)
          this.removeListener('subscription:activated', handler)
          resolve(order)
        }
      }
      
      this.on('subscription:activated', handler)
    })
  }
  
  /**
   * Wait for transfer creation
   */
  async waitForTransfer(
    subscriptionId: string,
    timeout: number = 30000
  ): Promise<TransactionRecord> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout waiting for transfer creation`))
      }, timeout)
      
      const handler = (transaction: TransactionRecord) => {
        if (transaction.subscription_id === subscriptionId) {
          clearTimeout(timer)
          this.removeListener('transfer:created', handler)
          resolve(transaction)
        }
      }
      
      this.on('transfer:created', handler)
    })
  }
  
  /**
   * Get subscription order by ID
   */
  async getSubscriptionOrder(orderId: string): Promise<SubscriptionOrderRecord | null> {
    const { data, error } = await this.supabase
      .from('subscription_orders')
      .select('*')
      .eq('id', orderId)
      .single()
    
    if (error) {
      console.error('Error fetching subscription order:', error)
      return null
    }
    
    return data
  }
  
  /**
   * Get transaction by subscription ID
   */
  async getTransactionBySubscription(subscriptionId: string): Promise<TransactionRecord | null> {
    const { data, error } = await this.supabase
      .from('transactions')
      .select('*')
      .eq('subscription_id', subscriptionId)
      .single()
    
    if (error) {
      console.error('Error fetching transaction:', error)
      return null
    }
    
    return data
  }
  
  /**
   * Verify money split calculation
   */
  verifySplitCalculation(
    totalAmount: number,
    platformFee: number,
    creatorEarnings: number,
    expectedPlatformPercentage: number = 30
  ): {
    isValid: boolean
    actualPlatformPercentage: number
    actualCreatorPercentage: number
    errors: string[]
  } {
    const errors: string[] = []
    
    // Check if amounts add up
    const sum = platformFee + creatorEarnings
    if (Math.abs(sum - totalAmount) > 0.01) {
      errors.push(`Sum mismatch: ${sum} !== ${totalAmount}`)
    }
    
    // Calculate actual percentages
    const actualPlatformPercentage = (platformFee / totalAmount) * 100
    const actualCreatorPercentage = (creatorEarnings / totalAmount) * 100
    
    // Check platform percentage (allow 1% tolerance for rounding)
    if (Math.abs(actualPlatformPercentage - expectedPlatformPercentage) > 1) {
      errors.push(`Platform fee incorrect: ${actualPlatformPercentage.toFixed(2)}% !== ${expectedPlatformPercentage}%`)
    }
    
    // Check creator percentage
    const expectedCreatorPercentage = 100 - expectedPlatformPercentage
    if (Math.abs(actualCreatorPercentage - expectedCreatorPercentage) > 1) {
      errors.push(`Creator earnings incorrect: ${actualCreatorPercentage.toFixed(2)}% !== ${expectedCreatorPercentage}%`)
    }
    
    return {
      isValid: errors.length === 0,
      actualPlatformPercentage,
      actualCreatorPercentage,
      errors
    }
  }
  
  /**
   * Track subscription lifecycle
   */
  async trackSubscriptionLifecycle(
    userId: string,
    tierId: string,
    expectedAmount: number
  ): Promise<{
    order: SubscriptionOrderRecord | null
    transaction: TransactionRecord | null
    splitValid: boolean
    transferCreated: boolean
    feeCreated: boolean
  }> {
    console.log(`🔍 Tracking subscription lifecycle for user ${userId}, tier ${tierId}`)
    
    // Wait for subscription order creation
    const order = await this.waitForSubscriptionOrder(userId, tierId).catch(() => null)
    
    if (!order) {
      return {
        order: null,
        transaction: null,
        splitValid: false,
        transferCreated: false,
        feeCreated: false
      }
    }
    
    // Verify split calculation
    const splitVerification = this.verifySplitCalculation(
      order.total_amount,
      order.platform_fee,
      order.creator_earnings
    )
    
    // Wait for transaction with transfer
    const transaction = await this.waitForTransfer(order.id).catch(() => null)
    
    return {
      order,
      transaction,
      splitValid: splitVerification.isValid,
      transferCreated: !!transaction?.stripe_transfer_id,
      feeCreated: !!transaction?.stripe_application_fee_id
    }
  }
  
  /**
   * Get all webhook events for a payment
   */
  async getWebhookEvents(paymentIntentId?: string, subscriptionId?: string): Promise<any[]> {
    let query = this.supabase
      .from('webhook_events')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (paymentIntentId) {
      query = query.or(`event_data->payment_intent->id.eq.${paymentIntentId}`)
    }
    
    if (subscriptionId) {
      query = query.or(`event_data->subscription->id.eq.${subscriptionId}`)
    }
    
    const { data, error } = await query
    
    if (error) {
      console.error('Error fetching webhook events:', error)
      return []
    }
    
    return data || []
  }
}

/**
 * Create and start a database tracker for tests
 */
export async function setupDatabaseTracking(
  tables?: string[]
): Promise<DatabaseTracker> {
  const tracker = new DatabaseTracker()
  
  try {
    await tracker.startTracking(tables)
    return tracker
  } catch (error) {
    console.error('Failed to setup database tracking:', error)
    throw error
  }
}

/**
 * Helper to verify complete subscription flow in database
 */
export async function verifySubscriptionInDatabase(
  supabase: SupabaseClient,
  userId: string,
  creatorId: string,
  tierId: string,
  expectedAmount: number
): Promise<{
  success: boolean
  order?: SubscriptionOrderRecord
  errors: string[]
}> {
  const errors: string[] = []
  
  // Check subscription order
  const { data: order, error: orderError } = await supabase
    .from('subscription_orders')
    .select('*')
    .eq('user_id', userId)
    .eq('creator_id', creatorId)
    .eq('tier_id', tierId)
    .single()
  
  if (orderError || !order) {
    errors.push('Subscription order not found')
    return { success: false, errors }
  }
  
  // Verify order details
  if (order.status !== 'active') {
    errors.push(`Order status is ${order.status}, expected active`)
  }
  
  if (Math.abs(order.total_amount - expectedAmount) > 0.01) {
    errors.push(`Amount mismatch: ${order.total_amount} !== ${expectedAmount}`)
  }
  
  // Verify split
  const expectedPlatformFee = expectedAmount * 0.30
  const expectedCreatorEarnings = expectedAmount * 0.70
  
  if (Math.abs(order.platform_fee - expectedPlatformFee) > 0.01) {
    errors.push(`Platform fee incorrect: ${order.platform_fee} !== ${expectedPlatformFee}`)
  }
  
  if (Math.abs(order.creator_earnings - expectedCreatorEarnings) > 0.01) {
    errors.push(`Creator earnings incorrect: ${order.creator_earnings} !== ${expectedCreatorEarnings}`)
  }
  
  // Check for Stripe IDs
  if (!order.stripe_subscription_id) {
    errors.push('Missing Stripe subscription ID')
  }
  
  if (!order.stripe_checkout_session_id) {
    errors.push('Missing Stripe checkout session ID')
  }
  
  return {
    success: errors.length === 0,
    order: order as SubscriptionOrderRecord,
    errors
  }
}