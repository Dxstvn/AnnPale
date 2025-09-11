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

    // Get user feed preferences
    const { data: preferences, error } = await supabase
      .from('user_feed_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Failed to fetch preferences:', error)
      return NextResponse.json(
        { error: 'Failed to fetch preferences' },
        { status: 500 }
      )
    }

    // Return preferences or defaults
    return NextResponse.json({
      preferences: preferences || {
        user_id: user.id,
        content_types: ['video', 'image', 'text'],
        autoplay_videos: true,
        show_comments: true,
        show_likes: true,
        muted_creators: [],
        blocked_creators: [],
        preferred_language: 'en',
        accessibility_captions: false,
        reduced_motion: false
      }
    })

  } catch (error) {
    console.error('Get feed preferences error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      content_types,
      autoplay_videos,
      show_comments,
      show_likes,
      muted_creators,
      blocked_creators,
      preferred_language,
      accessibility_captions,
      reduced_motion
    } = body

    // Upsert preferences
    const { data: preferences, error } = await supabase
      .from('user_feed_preferences')
      .upsert({
        user_id: user.id,
        content_types: content_types || ['video', 'image', 'text'],
        autoplay_videos: autoplay_videos !== undefined ? autoplay_videos : true,
        show_comments: show_comments !== undefined ? show_comments : true,
        show_likes: show_likes !== undefined ? show_likes : true,
        muted_creators: muted_creators || [],
        blocked_creators: blocked_creators || [],
        preferred_language: preferred_language || 'en',
        accessibility_captions: accessibility_captions || false,
        reduced_motion: reduced_motion || false,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to update preferences:', error)
      return NextResponse.json(
        { error: 'Failed to update preferences' },
        { status: 500 }
      )
    }

    return NextResponse.json({ preferences })

  } catch (error) {
    console.error('Update feed preferences error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, creatorId } = body

    if (!action || !creatorId) {
      return NextResponse.json(
        { error: 'Action and creator ID are required' },
        { status: 400 }
      )
    }

    // Get current preferences
    const { data: currentPrefs } = await supabase
      .from('user_feed_preferences')
      .select('muted_creators, blocked_creators')
      .eq('user_id', user.id)
      .single()

    let updateData: any = {}

    switch (action) {
      case 'mute':
        updateData.muted_creators = [
          ...(currentPrefs?.muted_creators || []),
          creatorId
        ].filter((id, index, self) => self.indexOf(id) === index) // Remove duplicates
        break

      case 'unmute':
        updateData.muted_creators = (currentPrefs?.muted_creators || [])
          .filter(id => id !== creatorId)
        break

      case 'block':
        updateData.blocked_creators = [
          ...(currentPrefs?.blocked_creators || []),
          creatorId
        ].filter((id, index, self) => self.indexOf(id) === index)
        // Also remove from muted if blocking
        updateData.muted_creators = (currentPrefs?.muted_creators || [])
          .filter(id => id !== creatorId)
        break

      case 'unblock':
        updateData.blocked_creators = (currentPrefs?.blocked_creators || [])
          .filter(id => id !== creatorId)
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    // Update preferences
    const { data: preferences, error } = await supabase
      .from('user_feed_preferences')
      .upsert({
        user_id: user.id,
        ...updateData,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      })
      .select()
      .single()

    if (error) {
      console.error('Failed to update creator preferences:', error)
      return NextResponse.json(
        { error: 'Failed to update preferences' },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      success: true,
      preferences 
    })

  } catch (error) {
    console.error('Update creator preferences error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}