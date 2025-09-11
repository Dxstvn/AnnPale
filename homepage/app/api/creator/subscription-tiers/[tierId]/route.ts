import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ tierId: string }> }
) {
  try {
    const { tierId } = await params
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { tier_name, description, price, billing_period, benefits, is_active } = body

    // Verify ownership
    const { data: existingTier } = await supabase
      .from('subscription_tiers')
      .select('creator_id')
      .eq('id', tierId)
      .single()

    if (!existingTier || existingTier.creator_id !== user.id) {
      return NextResponse.json({ error: 'Tier not found or unauthorized' }, { status: 404 })
    }

    // Update tier
    const { data: tier, error } = await supabase
      .from('subscription_tiers')
      .update({
        tier_name,
        description,
        price,
        billing_period,
        benefits: benefits || [],
        is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', tierId)
      .select()
      .single()

    if (error) {
      console.error('Error updating tier:', error)
      return NextResponse.json({ error: 'Failed to update tier' }, { status: 500 })
    }

    return NextResponse.json({ tier })
  } catch (error) {
    console.error('Error in PATCH /api/creator/subscription-tiers/[tierId]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ tierId: string }> }
) {
  try {
    const { tierId } = await params
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify ownership
    const { data: existingTier } = await supabase
      .from('subscription_tiers')
      .select('creator_id')
      .eq('id', tierId)
      .single()

    if (!existingTier || existingTier.creator_id !== user.id) {
      return NextResponse.json({ error: 'Tier not found or unauthorized' }, { status: 404 })
    }

    // Check for active subscriptions
    const { data: activeSubscriptions } = await supabase
      .from('subscription_orders')
      .select('id')
      .eq('tier_id', tierId)
      .in('status', ['active', 'trialing'])
      .limit(1)

    if (activeSubscriptions && activeSubscriptions.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete tier with active subscriptions' 
      }, { status: 400 })
    }

    // Delete tier
    const { error } = await supabase
      .from('subscription_tiers')
      .delete()
      .eq('id', tierId)

    if (error) {
      console.error('Error deleting tier:', error)
      return NextResponse.json({ error: 'Failed to delete tier' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in DELETE /api/creator/subscription-tiers/[tierId]:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}