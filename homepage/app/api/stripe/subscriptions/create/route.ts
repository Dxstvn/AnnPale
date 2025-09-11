import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Stripe from 'stripe'

// Initialize Stripe
const stripe = process.env.STRIPE_SANDBOX_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SANDBOX_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
    })
  : null

export async function POST(request: NextRequest) {
  try {
    if (!stripe) {
      return NextResponse.json({ 
        error: 'Stripe is not configured',
        fallback: true 
      }, { status: 503 })
    }

    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      tierId,
      billingPeriod = 'monthly',
      successUrl,
      cancelUrl,
      idempotencyKey 
    } = body

    // Fetch tier details - FIX: use correct table name
    const { data: tier, error: tierError } = await supabase
      .from('creator_subscription_tiers')
      .select('*')
      .eq('id', tierId)
      .single()

    if (tierError || !tier) {
      return NextResponse.json({ error: 'Tier not found' }, { status: 404 })
    }

    // Get or create Stripe customer
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email, display_name')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (!customerId) {
      // Create new Stripe customer
      const customer = await stripe.customers.create({
        email: profile?.email || user.email,
        name: profile?.display_name,
        metadata: {
          supabase_user_id: user.id
        }
      })
      
      customerId = customer.id

      // Save customer ID to profile
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // Get creator's Stripe account ID
    const { data: creatorProfile } = await supabase
      .from('profiles')
      .select('stripe_account_id')
      .eq('id', tier.creator_id)
      .single()

    // Use test account if creator doesn't have one set up
    const creatorAccountId = creatorProfile?.stripe_account_id || 'acct_1S3TOyEM4K7HiodW'
    
    if (!creatorAccountId) {
      return NextResponse.json({ 
        error: 'Creator has not set up payment processing' 
      }, { status: 400 })
    }

    // Create or get Stripe product and price
    let priceId: string

    // Check if we already have a Stripe price for this tier
    const { data: existingPrice } = await supabase
      .from('creator_subscription_tiers')
      .select(`stripe_price_id_${billingPeriod}`)
      .eq('id', tierId)
      .single()

    const stripePriceField = `stripe_price_id_${billingPeriod}`
    
    if (existingPrice?.[stripePriceField]) {
      priceId = existingPrice[stripePriceField]
    } else {
      // Create product if not exists
      let productId = tier.stripe_product_id
      
      if (!productId) {
        const product = await stripe.products.create({
          name: tier.tier_name,
          description: tier.description,
          metadata: {
            tier_id: tier.id,
            creator_id: tier.creator_id
          }
        })
        
        productId = product.id
        
        // Save product ID
        await supabase
          .from('creator_subscription_tiers')
          .update({ stripe_product_id: productId })
          .eq('id', tierId)
      }

      // Create price
      const price = await stripe.prices.create({
        product: productId,
        unit_amount: Math.round(tier.price * 100), // Convert to cents
        currency: 'usd',
        recurring: {
          interval: billingPeriod === 'yearly' ? 'year' : 'month'
        },
        metadata: {
          tier_id: tier.id,
          billing_period: billingPeriod
        }
      })
      
      priceId = price.id
      
      // Save price ID
      await supabase
        .from('creator_subscription_tiers')
        .update({ [stripePriceField]: priceId })
        .eq('id', tierId)
    }

    // Calculate application fee (30% platform fee, 70% to creator)
    const applicationFeePercent = 30

    // Create subscription checkout session with idempotency
    const sessionOptions: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      subscription_data: {
        application_fee_percent: applicationFeePercent,
        metadata: {
          tier_id: tierId,
          user_id: user.id, // FIX: use user_id instead of fan_id
          creator_id: tier.creator_id
        },
        transfer_data: {
          destination: creatorAccountId, // 70% goes to creator
        },
      },
      metadata: {
        tier_id: tierId,
        user_id: user.id, // FIX: use user_id instead of fan_id
        creator_id: tier.creator_id,
        billing_period: billingPeriod
      },
      success_url: successUrl || `${process.env.NEXT_PUBLIC_URL}/fan/subscriptions?success=true`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_URL}/fan/creators/${tier.creator_id}`,
    }

    // Add idempotency options if key is provided
    const requestOptions: Stripe.RequestOptions = {}
    if (idempotencyKey) {
      requestOptions.idempotencyKey = idempotencyKey
      console.log('🔑 Using idempotency key for subscription:', idempotencyKey)
    }

    const session = await stripe.checkout.sessions.create(
      sessionOptions,
      requestOptions
    )

    // Create pending subscription order
    const { data: order, error: orderError } = await supabase
      .from('subscription_orders')
      .insert({
        user_id: user.id, // FIX: use user_id instead of fan_id
        creator_id: tier.creator_id,
        tier_id: tierId,
        status: 'pending',
        billing_period: billingPeriod,
        total_amount: tier.price,
        platform_fee: tier.price * (applicationFeePercent / 100), // Track platform fee
        creator_earnings: tier.price * ((100 - applicationFeePercent) / 100), // Track creator earnings
        stripe_subscription_id: null, // Will be updated by webhook
        stripe_checkout_session_id: session.id,
        current_period_start: new Date().toISOString(),
        current_period_end: null, // Will be updated by webhook
        next_billing_date: null, // Will be updated by webhook
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error creating subscription order:', orderError)
      return NextResponse.json({ 
        error: 'Failed to create subscription order' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      sessionId: session.id,
      sessionUrl: session.url,
      orderId: order.id
    })
  } catch (error) {
    console.error('Error creating subscription:', error)
    return NextResponse.json({ 
      error: 'Failed to create subscription' 
    }, { status: 500 })
  }
}