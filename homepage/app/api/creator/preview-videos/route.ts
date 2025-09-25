import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

// GET: Fetch creator's preview videos
export async function GET(request: NextRequest) {
  try {
    console.log('[Preview Videos API] Starting GET request with cookies')
    const cookieStore = await cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Ignore - called from Server Component
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // Ignore - called from Server Component
            }
          },
        },
      }
    )
    console.log('[Preview Videos API] Supabase client created')

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('[Preview Videos API] Auth error:', authError)
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    console.log('[Preview Videos API] Authenticated user:', user.id)

    // Check if user is a creator
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role, is_creator')
      .eq('id', user.id)
      .single()

    console.log('[Preview Videos API] Profile fetch result:', { profile, error: profileError })

    if (profileError) {
      console.error('[Preview Videos API] Profile fetch error:', profileError)
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      )
    }

    // Check if user is a creator (either by role or is_creator flag)
    if (!profile || (profile.role !== 'creator' && !profile.is_creator)) {
      console.error('[Preview Videos API] Access denied - user role:', profile?.role, 'is_creator:', profile?.is_creator)
      return NextResponse.json(
        { error: 'Creator access required' },
        { status: 403 }
      )
    }

    // Fetch creator's preview videos
    const { data: previewVideos, error } = await supabase
      .from('creator_preview_videos')
      .select('*')
      .eq('creator_id', user.id)
      .order('display_order', { ascending: true })

    if (error) {
      console.error('Error fetching preview videos:', error)
      return NextResponse.json(
        { error: 'Failed to fetch preview videos' },
        { status: 500 }
      )
    }

    return NextResponse.json(previewVideos || [])
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// POST: Add a video from library as preview
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Ignore - called from Server Component
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // Ignore - called from Server Component
            }
          },
        },
      }
    )
    const body = await request.json()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Validate required fields
    const { video_request_id, title, display_order = 0 } = body

    if (!video_request_id || !title) {
      return NextResponse.json(
        { error: 'video_request_id and title are required' },
        { status: 400 }
      )
    }

    // Fetch the video request to get video details
    const { data: videoRequest, error: fetchError } = await supabase
      .from('video_requests')
      .select('*')
      .eq('id', video_request_id)
      .eq('creator_id', user.id)
      .eq('status', 'completed')
      .single()

    if (fetchError || !videoRequest) {
      return NextResponse.json(
        { error: 'Video request not found or not completed' },
        { status: 404 }
      )
    }

    // Check if this video is already a preview
    const { data: existing } = await supabase
      .from('creator_preview_videos')
      .select('id')
      .eq('video_request_id', video_request_id)
      .eq('creator_id', user.id)
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'This video is already a preview' },
        { status: 409 }
      )
    }

    // Create preview video entry
    const { data: previewVideo, error: insertError } = await supabase
      .from('creator_preview_videos')
      .insert({
        creator_id: user.id,
        video_request_id,
        title,
        thumbnail_url: videoRequest.thumbnail_url,
        video_url: videoRequest.video_url,
        duration: videoRequest.duration,
        occasion: videoRequest.occasion,
        display_order,
        is_active: true
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error creating preview video:', insertError)
      return NextResponse.json(
        { error: 'Failed to create preview video' },
        { status: 500 }
      )
    }

    return NextResponse.json(previewVideo, { status: 201 })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// PUT: Update preview video (order, title, status)
export async function PUT(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Ignore - called from Server Component
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // Ignore - called from Server Component
            }
          },
        },
      }
    )
    const body = await request.json()

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { id, title, display_order, is_active } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Preview video ID is required' },
        { status: 400 }
      )
    }

    // Update preview video
    const { data: updatedVideo, error: updateError } = await supabase
      .from('creator_preview_videos')
      .update({
        ...(title !== undefined && { title }),
        ...(display_order !== undefined && { display_order }),
        ...(is_active !== undefined && { is_active })
      })
      .eq('id', id)
      .eq('creator_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating preview video:', updateError)
      return NextResponse.json(
        { error: 'Failed to update preview video' },
        { status: 500 }
      )
    }

    if (!updatedVideo) {
      return NextResponse.json(
        { error: 'Preview video not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedVideo)
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

// DELETE: Remove preview video
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const supabase = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // Ignore - called from Server Component
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // Ignore - called from Server Component
            }
          },
        },
      }
    )
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Preview video ID is required' },
        { status: 400 }
      )
    }

    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Delete preview video
    const { error: deleteError } = await supabase
      .from('creator_preview_videos')
      .delete()
      .eq('id', id)
      .eq('creator_id', user.id)

    if (deleteError) {
      console.error('Error deleting preview video:', deleteError)
      return NextResponse.json(
        { error: 'Failed to delete preview video' },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Preview video deleted successfully' })
  } catch (error) {
    console.error('Unexpected error:', error)
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}