import { spawn, ChildProcess } from 'child_process'
import { EventEmitter } from 'events'

export interface WebhookEvent {
  id: string
  type: string
  data: any
  timestamp: string
}

export class StripeWebhookListener extends EventEmitter {
  private process: ChildProcess | null = null
  private events: WebhookEvent[] = []
  private isListening = false
  private webhookEndpoint: string
  
  constructor(webhookEndpoint: string = 'http://localhost:3000/api/webhooks/stripe') {
    super()
    this.webhookEndpoint = webhookEndpoint
  }
  
  /**
   * Start the Stripe CLI webhook listener
   */
  async start(): Promise<void> {
    if (this.isListening) {
      console.log('⚠️ Webhook listener already running')
      return
    }
    
    return new Promise((resolve, reject) => {
      console.log('🚀 Starting Stripe webhook listener...')
      
      // Start stripe listen command
      // Use --format JSON instead of deprecated --print-json
      this.process = spawn('stripe', [
        'listen',
        '--forward-to',
        this.webhookEndpoint,
        '--format',
        'JSON'
      ], {
        // Detached to prevent blocking
        detached: false,
        stdio: ['ignore', 'pipe', 'pipe']
      })
      
      // Handle stdout (webhook events)
      this.process.stdout?.on('data', (data) => {
        const output = data.toString()
        
        // Parse JSON output from Stripe CLI
        try {
          const lines = output.split('\n').filter(line => line.trim())
          
          for (const line of lines) {
            if (line.includes('Ready!')) {
              this.isListening = true
              console.log('✅ Webhook listener ready')
              resolve()
            } else if (line.startsWith('{')) {
              const event = JSON.parse(line)
              this.handleWebhookEvent(event)
            }
          }
        } catch (error) {
          // Not JSON, likely status message
          if (output.includes('Ready!')) {
            this.isListening = true
            console.log('✅ Webhook listener ready')
            resolve()
          } else {
            console.log('Stripe CLI:', output.trim())
          }
        }
      })
      
      // Handle stderr (errors and status messages)
      this.process.stderr?.on('data', (data) => {
        const output = data.toString()
        
        if (output.includes('Ready!') || output.includes('forwarding to')) {
          this.isListening = true
          console.log('✅ Webhook listener ready')
          resolve()
        } else if (output.includes('error')) {
          console.error('Stripe CLI Error:', output)
          reject(new Error(output))
        } else {
          console.log('Stripe CLI:', output.trim())
        }
      })
      
      // Handle process errors
      this.process.on('error', (error) => {
        console.error('Failed to start Stripe CLI:', error)
        reject(error)
      })
      
      // Handle process exit
      this.process.on('exit', (code) => {
        this.isListening = false
        console.log(`Stripe CLI exited with code ${code}`)
      })
      
      // Set a timeout for startup
      setTimeout(() => {
        if (!this.isListening) {
          // Don't reject, just resolve anyway - tests can continue without webhook
          console.log('⚠️ Webhook listener timeout - continuing without it')
          resolve()
        }
      }, 5000)
    })
  }
  
  /**
   * Stop the webhook listener
   */
  async stop(): Promise<void> {
    if (!this.process) {
      return
    }
    
    console.log('🛑 Stopping webhook listener...')
    
    return new Promise((resolve) => {
      this.process?.on('exit', () => {
        this.process = null
        this.isListening = false
        console.log('✅ Webhook listener stopped')
        resolve()
      })
      
      this.process?.kill('SIGTERM')
      
      // Force kill after timeout
      setTimeout(() => {
        if (this.process) {
          this.process.kill('SIGKILL')
        }
        resolve()
      }, 5000)
    })
  }
  
  /**
   * Handle incoming webhook event
   */
  private handleWebhookEvent(event: any): void {
    const webhookEvent: WebhookEvent = {
      id: event.id || event.data?.object?.id || Date.now().toString(),
      type: event.type,
      data: event.data,
      timestamp: new Date().toISOString()
    }
    
    this.events.push(webhookEvent)
    this.emit('webhook', webhookEvent)
    
    console.log(`📨 Webhook received: ${webhookEvent.type}`)
    
    // Emit specific events for common types
    switch (webhookEvent.type) {
      case 'payment_intent.succeeded':
        this.emit('payment_succeeded', webhookEvent)
        break
      case 'payment_intent.payment_failed':
        this.emit('payment_failed', webhookEvent)
        break
      case 'charge.refunded':
        this.emit('refunded', webhookEvent)
        break
    }
  }
  
  /**
   * Wait for a specific webhook event type
   */
  async waitForEvent(eventType: string, timeout: number = 30000): Promise<WebhookEvent> {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error(`Timeout waiting for ${eventType} webhook`))
      }, timeout)
      
      // Check if we already received this event
      const existingEvent = this.events.find(e => e.type === eventType)
      if (existingEvent) {
        clearTimeout(timer)
        resolve(existingEvent)
        return
      }
      
      // Wait for new event
      const handler = (event: WebhookEvent) => {
        if (event.type === eventType) {
          clearTimeout(timer)
          this.removeListener('webhook', handler)
          resolve(event)
        }
      }
      
      this.on('webhook', handler)
    })
  }
  
  /**
   * Get all received events
   */
  getEvents(): WebhookEvent[] {
    return [...this.events]
  }
  
  /**
   * Get events by type
   */
  getEventsByType(type: string): WebhookEvent[] {
    return this.events.filter(e => e.type === type)
  }
  
  /**
   * Clear event history
   */
  clearEvents(): void {
    this.events = []
  }
  
  /**
   * Check if listener is running
   */
  isRunning(): boolean {
    return this.isListening
  }
  
  /**
   * Verify webhook was processed by checking database
   */
  async verifyWebhookProcessed(supabase: any, paymentIntentId: string): Promise<boolean> {
    const maxAttempts = 10
    const delayMs = 2000
    
    for (let i = 0; i < maxAttempts; i++) {
      // Check if order was created
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('payment_intent_id', paymentIntentId)
        .single()
      
      if (order) {
        console.log('✅ Webhook processed - order created:', order.id)
        return true
      }
      
      // Check webhook_events table
      const { data: webhookEvent } = await supabase
        .from('webhook_events')
        .select('*')
        .eq('event_id', `evt_${paymentIntentId}`)
        .single()
      
      if (webhookEvent) {
        console.log('✅ Webhook event logged:', webhookEvent.id)
      }
      
      if (i < maxAttempts - 1) {
        console.log(`⏳ Waiting for webhook processing... (${i + 1}/${maxAttempts})`)
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
    
    console.log('❌ Webhook not processed within timeout')
    return false
  }
}

/**
 * Create and start a webhook listener for tests
 */
export async function setupWebhookListener(
  webhookEndpoint?: string
): Promise<StripeWebhookListener> {
  const listener = new StripeWebhookListener(webhookEndpoint)
  
  try {
    await listener.start()
    return listener
  } catch (error) {
    console.error('Failed to setup webhook listener:', error)
    throw error
  }
}

/**
 * Helper to track payment through webhook pipeline
 */
export async function trackPaymentWebhook(
  listener: StripeWebhookListener,
  supabase: any,
  paymentIntentId: string
): Promise<{
  webhookReceived: boolean
  webhookProcessed: boolean
  orderCreated: boolean
  splitCalculated: boolean
  platformFee?: number
  creatorEarnings?: number
}> {
  console.log(`🔍 Tracking payment ${paymentIntentId} through webhook pipeline...`)
  
  // Wait for webhook event
  let webhookReceived = false
  try {
    const event = await listener.waitForEvent('payment_intent.succeeded', 15000)
    if (event.data?.object?.id === paymentIntentId) {
      webhookReceived = true
      console.log('✅ Webhook received for payment')
    }
  } catch (error) {
    console.log('⚠️ Webhook not received within timeout')
  }
  
  // Verify webhook was processed
  const webhookProcessed = await listener.verifyWebhookProcessed(supabase, paymentIntentId)
  
  // Check if order was created with correct split
  const { data: order } = await supabase
    .from('orders')
    .select('*')
    .eq('payment_intent_id', paymentIntentId)
    .single()
  
  const orderCreated = !!order
  let splitCalculated = false
  let platformFee: number | undefined
  let creatorEarnings: number | undefined
  
  if (order) {
    platformFee = order.platform_fee
    creatorEarnings = order.creator_earnings
    
    // Verify 70/30 split
    const total = platformFee + creatorEarnings
    const platformPercentage = (platformFee / total) * 100
    splitCalculated = Math.abs(platformPercentage - 30) < 1 // Allow 1% tolerance
    
    console.log(`💰 Payment split: Platform ${platformFee} (${platformPercentage.toFixed(1)}%), Creator ${creatorEarnings} (${(100 - platformPercentage).toFixed(1)}%)`)
  }
  
  return {
    webhookReceived,
    webhookProcessed,
    orderCreated,
    splitCalculated,
    platformFee,
    creatorEarnings
  }
}