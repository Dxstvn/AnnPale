import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { posts } = body

    if (!posts || !Array.isArray(posts)) {
      return NextResponse.json({ error: 'Invalid posts data' }, { status: 400 })
    }

    // Update each post's preview_order
    const updates = posts.map(({ id, preview_order }) => 
      supabase
        .from('posts')
        .update({ preview_order })
        .eq('id', id)
        .eq('creator_id', user.id) // Ensure ownership
    )

    // Execute all updates
    const results = await Promise.all(updates)
    
    // Check for errors
    const errors = results.filter(r => r.error)
    if (errors.length > 0) {
      console.error('Error updating post order:', errors[0].error)
      return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in PATCH /api/creator/preview-posts/reorder:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}