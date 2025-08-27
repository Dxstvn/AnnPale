import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getWebRTCBridge } from '@/lib/streaming/webrtc-rtmp-bridge';
import { getMediaLiveManager } from '@/lib/streaming/medialive-manager';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is a creator
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'creator') {
      return NextResponse.json(
        { error: 'Only creators can start streams' },
        { status: 403 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { 
      title = 'Live Stream',
      description = '',
      quality = 'HD-720p',
      offer // WebRTC offer from browser
    } = body;

    // Generate stream ID
    const streamId = nanoid(12);

    // Create stream record in database
    const { data: stream, error: streamError } = await supabase
      .from('livestreams')
      .insert({
        id: streamId,
        creator_id: user.id,
        title,
        description,
        quality,
        status: 'initializing',
        started_at: new Date().toISOString()
      })
      .select()
      .single();

    if (streamError) {
      console.error('Failed to create stream record:', streamError);
      return NextResponse.json(
        { error: 'Failed to create stream' },
        { status: 500 }
      );
    }

    // Initialize MediaLive channel
    const mediaLiveManager = getMediaLiveManager();
    const s3BucketName = process.env.STREAM_S3_BUCKET || 'ann-pale-streams';
    const s3Prefix = `livestreams/${user.id}`;

    let streamEndpoints;
    try {
      streamEndpoints = await mediaLiveManager.createChannel(streamId, {
        name: `stream-${streamId}`,
        encodingProfile: quality as any,
        inputType: 'RTMP_PUSH',
        s3BucketName,
        s3Prefix
      });

      // Start the channel
      await mediaLiveManager.startChannel(streamId);
    } catch (mediaLiveError) {
      console.error('MediaLive error:', mediaLiveError);
      
      // Clean up database record
      await supabase
        .from('livestreams')
        .delete()
        .eq('id', streamId);

      return NextResponse.json(
        { error: 'Failed to initialize streaming infrastructure' },
        { status: 500 }
      );
    }

    // Initialize WebRTC bridge
    const webrtcBridge = getWebRTCBridge();
    const answer = await webrtcBridge.initializeStream({
      streamId,
      userId: user.id,
      rtmpUrl: streamEndpoints.rtmpUrl,
      streamKey: streamEndpoints.streamKey,
      quality: quality as any
    }, offer);

    // Update stream status to live
    await supabase
      .from('livestreams')
      .update({
        status: 'live',
        stream_url: streamEndpoints.playbackUrl,
        rtmp_url: streamEndpoints.rtmpUrl
      })
      .eq('id', streamId);

    // Return stream information
    return NextResponse.json({
      streamId,
      answer,
      playbackUrl: streamEndpoints.playbackUrl,
      rtmpUrl: streamEndpoints.rtmpUrl,
      streamKey: streamEndpoints.streamKey
    });

  } catch (error) {
    console.error('Stream start error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}