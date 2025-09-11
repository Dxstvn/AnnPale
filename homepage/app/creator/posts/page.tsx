import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PostsDashboard } from "@/components/creator/posts-dashboard"

export default async function CreatorPostsPage() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Check if user is a creator
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_creator')
    .eq('id', user.id)
    .single()

  if (!profile?.is_creator && profile?.role !== 'creator') {
    redirect('/fan/home')
  }

  // Get creator's subscription tiers
  const { data: subscriptionTiers } = await supabase
    .from('creator_subscription_tiers')
    .select('id, name, price, currency, description, benefits, color')
    .eq('creator_id', user.id)
    .eq('is_active', true)
    .order('price', { ascending: true })

  return (
    <div className="container mx-auto px-4 py-6">
      <PostsDashboard subscriptionTiers={subscriptionTiers || []} />
    </div>
  )
}