import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch creator's subscription tiers with subscriber counts
    const { data: tiers, error } = await supabase
      .from('subscription_tiers')
      .select(`
        *,
        subscription_orders!inner(
          id
        )
      `)
      .eq('creator_id', user.id)
      .order('price', { ascending: true })

    if (error) {
      console.error('Error fetching tiers:', error)
      return NextResponse.json({ error: 'Failed to fetch tiers' }, { status: 500 })
    }

    // Calculate subscriber counts
    const tiersWithCounts = (tiers || []).map(tier => {
      const subscriberCount = tier.subscription_orders?.length || 0
      const { subscription_orders, ...tierData } = tier
      return {
        ...tierData,
        subscriber_count: subscriberCount
      }
    })

    return NextResponse.json({ tiers: tiersWithCounts })
  } catch (error) {
    console.error('Error in GET /api/creator/subscription-tiers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { tier_name, description, price, billing_period, benefits, is_active } = body

    // Validate required fields
    if (!tier_name || !price || !billing_period) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Create new tier
    const { data: tier, error } = await supabase
      .from('subscription_tiers')
      .insert({
        creator_id: user.id,
        tier_name,
        description,
        price,
        billing_period,
        benefits: benefits || [],
        is_active: is_active !== undefined ? is_active : true
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating tier:', error)
      return NextResponse.json({ error: 'Failed to create tier' }, { status: 500 })
    }

    return NextResponse.json({ tier })
  } catch (error) {
    console.error('Error in POST /api/creator/subscription-tiers:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}