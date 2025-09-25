import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/server'

// GET - Fetch creator profile data
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // Fetch profile data
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('bio, extended_bio, languages, social_media')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 })
    }

    // Parse social_media JSON if it's a string
    let socialMedia = {}
    if (profile?.social_media) {
      try {
        socialMedia = typeof profile.social_media === 'string'
          ? JSON.parse(profile.social_media)
          : profile.social_media
      } catch (e) {
        console.error('Error parsing social media:', e)
        socialMedia = {}
      }
    }

    return NextResponse.json({
      bio: profile?.bio || '',
      extendedBio: profile?.extended_bio || '',
      languages: profile?.languages || ['English'],
      socialMedia: socialMedia
    })
  } catch (error) {
    console.error('Error in GET /api/creator/profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PUT - Update creator profile data
export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()
    const body = await request.json()

    // Validate input
    if (body.bio && body.bio.length > 500) {
      return NextResponse.json({ error: 'Bio must be 500 characters or less' }, { status: 400 })
    }

    if (body.extendedBio && body.extendedBio.length > 2000) {
      return NextResponse.json({ error: 'Extended bio must be 2000 characters or less' }, { status: 400 })
    }

    // Ensure languages is an array
    const languages = Array.isArray(body.languages) ? body.languages : ['English']

    // Prepare update data
    const updateData: any = {}

    if (body.bio !== undefined) {
      updateData.bio = body.bio
    }

    if (body.extendedBio !== undefined) {
      updateData.extended_bio = body.extendedBio
    }

    if (body.languages !== undefined) {
      updateData.languages = languages
    }

    if (body.socialMedia !== undefined) {
      // Store social media as JSON string
      updateData.social_media = JSON.stringify(body.socialMedia)
    }

    // Update profile
    const { data: updatedProfile, error } = await supabase
      .from('profiles')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    // Parse social_media for response
    let socialMedia = {}
    if (updatedProfile?.social_media) {
      try {
        socialMedia = typeof updatedProfile.social_media === 'string'
          ? JSON.parse(updatedProfile.social_media)
          : updatedProfile.social_media
      } catch (e) {
        console.error('Error parsing social media:', e)
        socialMedia = {}
      }
    }

    return NextResponse.json({
      success: true,
      profile: {
        bio: updatedProfile.bio || '',
        extendedBio: updatedProfile.extended_bio || '',
        languages: updatedProfile.languages || ['English'],
        socialMedia: socialMedia
      }
    })
  } catch (error) {
    console.error('Error in PUT /api/creator/profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}