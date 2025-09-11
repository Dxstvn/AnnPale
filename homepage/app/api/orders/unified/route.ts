import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

interface UnifiedOrder {
  id: string
  type: 'video' | 'subscription'
  status: string
  amount: number
  created_at: string
  customer_name?: string
  creator_name?: string
  details: any
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role') // 'creator' or 'fan'
    const status = searchParams.get('status')
    const type = searchParams.get('type')
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const unifiedOrders: UnifiedOrder[] = []

    // Build queries based on role
    if (role === 'creator') {
      // Fetch video orders for creator
      if (!type || type === 'video') {
        let videoQuery = supabase
          .from('orders')
          .select(`
            *,
            profiles!orders_fan_id_fkey(
              id,
              display_name,
              username,
              profile_image_url
            )
          `)
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false })

        if (status) {
          videoQuery = videoQuery.eq('status', status)
        }

        const { data: videoOrders, error: videoError } = await videoQuery

        if (videoError) {
          console.error('Error fetching video orders:', videoError)
        } else if (videoOrders) {
          videoOrders.forEach(order => {
            unifiedOrders.push({
              id: order.id,
              type: 'video',
              status: order.status,
              amount: order.total_amount,
              created_at: order.created_at,
              customer_name: order.profiles?.display_name || 'Unknown',
              details: {
                order_type: order.order_type,
                occasion: order.occasion,
                instructions: order.instructions,
                delivery_date: order.delivery_date,
                video_url: order.video_url,
                customer: order.profiles
              }
            })
          })
        }
      }

      // Fetch subscription orders for creator
      if (!type || type === 'subscription') {
        let subQuery = supabase
          .from('subscription_orders')
          .select(`
            *,
            profiles!subscription_orders_fan_id_fkey(
              id,
              display_name,
              username,
              profile_image_url
            ),
            subscription_tiers(
              tier_name,
              price,
              billing_period
            )
          `)
          .eq('creator_id', user.id)
          .order('created_at', { ascending: false })

        if (status) {
          subQuery = subQuery.eq('status', status)
        }

        const { data: subOrders, error: subError } = await subQuery

        if (subError) {
          console.error('Error fetching subscription orders:', subError)
        } else if (subOrders) {
          subOrders.forEach(order => {
            unifiedOrders.push({
              id: order.id,
              type: 'subscription',
              status: order.status,
              amount: order.total_amount,
              created_at: order.created_at,
              customer_name: order.profiles?.display_name || 'Unknown',
              details: {
                tier: order.subscription_tiers,
                billing_period: order.billing_period,
                current_period_start: order.current_period_start,
                current_period_end: order.current_period_end,
                customer: order.profiles
              }
            })
          })
        }
      }
    } else if (role === 'fan') {
      // Fetch video orders for fan
      if (!type || type === 'video') {
        let videoQuery = supabase
          .from('orders')
          .select(`
            *,
            profiles!orders_creator_id_fkey(
              id,
              display_name,
              username,
              profile_image_url
            )
          `)
          .eq('fan_id', user.id)
          .order('created_at', { ascending: false })

        if (status) {
          videoQuery = videoQuery.eq('status', status)
        }

        const { data: videoOrders, error: videoError } = await videoQuery

        if (videoError) {
          console.error('Error fetching video orders:', videoError)
        } else if (videoOrders) {
          videoOrders.forEach(order => {
            unifiedOrders.push({
              id: order.id,
              type: 'video',
              status: order.status,
              amount: order.total_amount,
              created_at: order.created_at,
              creator_name: order.profiles?.display_name || 'Unknown',
              details: {
                order_type: order.order_type,
                occasion: order.occasion,
                instructions: order.instructions,
                delivery_date: order.delivery_date,
                video_url: order.video_url,
                creator: order.profiles
              }
            })
          })
        }
      }

      // Fetch subscription orders for fan
      if (!type || type === 'subscription') {
        let subQuery = supabase
          .from('subscription_orders')
          .select(`
            *,
            profiles!subscription_orders_creator_id_fkey(
              id,
              display_name,
              username,
              profile_image_url
            ),
            subscription_tiers(
              tier_name,
              price,
              billing_period
            )
          `)
          .eq('fan_id', user.id)
          .order('created_at', { ascending: false })

        if (status) {
          subQuery = subQuery.eq('status', status)
        }

        const { data: subOrders, error: subError } = await subQuery

        if (subError) {
          console.error('Error fetching subscription orders:', subError)
        } else if (subOrders) {
          subOrders.forEach(order => {
            unifiedOrders.push({
              id: order.id,
              type: 'subscription',
              status: order.status,
              amount: order.total_amount,
              created_at: order.created_at,
              creator_name: order.profiles?.display_name || 'Unknown',
              details: {
                tier: order.subscription_tiers,
                billing_period: order.billing_period,
                current_period_start: order.current_period_start,
                current_period_end: order.current_period_end,
                next_billing_date: order.next_billing_date,
                creator: order.profiles
              }
            })
          })
        }
      }
    }

    // Sort unified orders by created_at
    unifiedOrders.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    // Calculate statistics
    const stats = {
      total: unifiedOrders.length,
      video_orders: unifiedOrders.filter(o => o.type === 'video').length,
      subscriptions: unifiedOrders.filter(o => o.type === 'subscription').length,
      pending: unifiedOrders.filter(o => o.status === 'pending').length,
      active: unifiedOrders.filter(o => o.status === 'active' || o.status === 'completed').length,
      total_revenue: unifiedOrders.reduce((sum, o) => sum + (o.amount || 0), 0)
    }

    return NextResponse.json({ 
      orders: unifiedOrders,
      stats
    })
  } catch (error) {
    console.error('Error in GET /api/orders/unified:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}