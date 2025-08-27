import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createIVSChannel, deleteIVSChannel, getIVSChannel } from '@/lib/aws/ivs'

// POST /api/streaming/channel - Create a new channel for a creator
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is a creator
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profile?.role !== 'creator' && profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Only creators can create channels' }, { status: 403 })
    }

    // Check if creator already has a channel
    const { data: existingChannel } = await supabase
      .from('creator_channels')
      .select('id')
      .eq('creator_id', user.id)
      .single()
    
    if (existingChannel) {
      return NextResponse.json({ error: 'Channel already exists' }, { status: 400 })
    }

    // Create IVS channel
    const channelName = `${user.email?.split('@')[0]}-${Date.now()}`
    const { channel, streamKey } = await createIVSChannel(user.id, channelName)

    // Store channel info in database
    const { data: newChannel, error: dbError } = await supabase
      .from('creator_channels')
      .insert({
        creator_id: user.id,
        channel_arn: channel.arn,
        channel_name: channel.name,
        playback_url: channel.playbackUrl,
        ingest_endpoint: channel.ingestEndpoint,
        stream_key_arn: streamKey.arn,
        // Never store the actual stream key value in plain text
        // Instead, we'll fetch it on-demand when needed
      })
      .select()
      .single()

    if (dbError) {
      // Clean up IVS channel if database insert fails
      await deleteIVSChannel(channel.arn!)
      throw dbError
    }

    return NextResponse.json({
      success: true,
      channel: {
        id: newChannel.id,
        playbackUrl: channel.playbackUrl,
        ingestEndpoint: channel.ingestEndpoint,
        // Only return stream key on creation
        streamKey: streamKey.value,
      },
      message: 'Channel created successfully. Save your stream key securely!'
    })
  } catch (error: any) {
    console.error('Error creating channel:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create channel' },
      { status: 500 }
    )
  }
}

// GET /api/streaming/channel - Get channel details
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get channel from database
    const { data: channel, error: dbError } = await supabase
      .from('creator_channels')
      .select('*')
      .eq('creator_id', user.id)
      .single()
    
    if (dbError || !channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
    }

    // Get live status from AWS
    const ivsChannel = await getIVSChannel(channel.channel_arn)

    return NextResponse.json({
      channel: {
        id: channel.id,
        name: channel.channel_name,
        playbackUrl: channel.playback_url,
        ingestEndpoint: channel.ingest_endpoint,
        isLive: channel.is_live,
        createdAt: channel.created_at,
      },
      aws: {
        type: ivsChannel?.type,
        latencyMode: ivsChannel?.latencyMode,
      }
    })
  } catch (error: any) {
    console.error('Error getting channel:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to get channel' },
      { status: 500 }
    )
  }
}

// DELETE /api/streaming/channel - Delete a channel
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get channel from database
    const { data: channel, error: dbError } = await supabase
      .from('creator_channels')
      .select('channel_arn')
      .eq('creator_id', user.id)
      .single()
    
    if (dbError || !channel) {
      return NextResponse.json({ error: 'Channel not found' }, { status: 404 })
    }

    // Delete from AWS
    await deleteIVSChannel(channel.channel_arn)

    // Delete from database
    await supabase
      .from('creator_channels')
      .delete()
      .eq('creator_id', user.id)

    return NextResponse.json({
      success: true,
      message: 'Channel deleted successfully'
    })
  } catch (error: any) {
    console.error('Error deleting channel:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to delete channel' },
      { status: 500 }
    )
  }
}