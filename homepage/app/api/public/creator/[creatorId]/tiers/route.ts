import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ creatorId: string }> }
) {
  const { creatorId } = await params
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  // Get active tiers for the specified creator
  const { data: tiers, error } = await supabase
    .from('creator_subscription_tiers')
    .select('*')
    .eq('creator_id', creatorId)
    .eq('is_active', true)
    .order('price', { ascending: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Format tiers for public display
  const formattedTiers = tiers.map(tier => ({
    id: tier.id,
    tier_name: tier.tier_name,
    tier_type: tier.tier_type,
    description: tier.description,
    price: tier.price,
    billing_period: tier.billing_period,
    benefits: tier.benefits,
    features: tier.features,
    ad_free: tier.ad_free,
    exclusive_content: tier.exclusive_content,
    priority_chat: tier.priority_chat,
    vod_access: tier.vod_access,
    max_quality: tier.max_quality
  }))

  return NextResponse.json({ tiers: formattedTiers })
}