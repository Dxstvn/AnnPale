import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const role = searchParams.get('role') || 'creator'
  const redirectTo = searchParams.get('redirectTo') || '/creator/dashboard'

  try {
    const supabase = await createClient()
    
    // Create a test user session
    // NOTE: This is for development only - remove in production!
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Test login only available in development' },
        { status: 403 }
      )
    }

    // Sign in with test credentials
    const testEmail = role === 'admin' 
      ? 'admin@annpale.test' 
      : role === 'creator'
      ? 'creator@annpale.test'
      : 'fan@annpale.test'
    
    const testPassword = 'testpassword123!'

    // First, try to sign up (in case user doesn't exist)
    const { error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: role === 'admin' 
            ? 'Test Admin'
            : role === 'creator'
            ? 'Test Creator'
            : 'Test Fan',
          role: role
        }
      }
    })

    // Now sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    })

    if (error && error.message !== 'User already registered') {
      console.error('Test login error:', error)
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    if (!data?.user && !signUpError) {
      return NextResponse.json(
        { error: 'Failed to create test session' },
        { status: 500 }
      )
    }

    // Check if profile exists
    const userId = data?.user?.id || crypto.randomUUID()
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    // Create profile if it doesn't exist
    if (!profile) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: testEmail,
          name: role === 'admin' 
            ? 'Test Admin'
            : role === 'creator'
            ? 'Test Creator'
            : 'Test Fan',
          role: role,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        console.error('Profile creation error:', profileError)
      }
    }

    // Create creator-specific data if needed
    if (role === 'creator') {
      // Check if creator channel exists
      const { data: channel } = await supabase
        .from('creator_channels')
        .select('*')
        .eq('creator_id', userId)
        .single()

      if (!channel) {
        // Create a test channel
        const { error: channelError } = await supabase
          .from('creator_channels')
          .insert({
            creator_id: userId,
            channel_arn: `arn:aws:ivs:us-east-1:123456789:channel/test-${userId}`,
            channel_name: `test-channel-${userId}`,
            playback_url: `https://test-stream.annpale.com/${userId}/master.m3u8`,
            ingest_endpoint: `rtmps://test-ingest.annpale.com:443/app/`,
            stream_key_arn: `arn:aws:ivs:us-east-1:123456789:stream-key/test-${userId}`,
            is_live: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })

        if (channelError) {
          console.error('Channel creation error:', channelError)
        }
      }
    }

    // Redirect to appropriate dashboard
    const redirectUrl = role === 'admin' 
      ? '/admin/dashboard'
      : role === 'creator'
      ? '/creator/streaming/test'
      : '/fan/livestreams'

    return NextResponse.redirect(new URL(redirectUrl, request.url))
  } catch (error) {
    console.error('Test login error:', error)
    return NextResponse.json(
      { error: 'Failed to create test session' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}