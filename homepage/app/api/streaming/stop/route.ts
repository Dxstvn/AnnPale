import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getWebRTCBridge } from '@/lib/streaming/webrtc-rtmp-bridge';
import { getMediaLiveManager } from '@/lib/streaming/medialive-manager';

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

    // Parse request body
    const body = await request.json();
    const { streamId } = body;

    if (!streamId) {
      return NextResponse.json(
        { error: 'Stream ID is required' },
        { status: 400 }
      );
    }

    // Verify stream ownership
    const { data: stream, error: streamError } = await supabase
      .from('livestreams')
      .select('creator_id, status')
      .eq('id', streamId)
      .single();

    if (streamError || !stream) {
      return NextResponse.json(
        { error: 'Stream not found' },
        { status: 404 }
      );
    }

    if (stream.creator_id !== user.id) {
      return NextResponse.json(
        { error: 'Unauthorized to stop this stream' },
        { status: 403 }
      );
    }

    if (stream.status !== 'live' && stream.status !== 'initializing') {
      return NextResponse.json(
        { error: 'Stream is not active' },
        { status: 400 }
      );
    }

    // Stop WebRTC bridge
    const webrtcBridge = getWebRTCBridge();
    webrtcBridge.stopStream(streamId);

    // Stop and delete MediaLive channel
    const mediaLiveManager = getMediaLiveManager();
    try {
      await mediaLiveManager.stopChannel(streamId);
      
      // Schedule channel deletion after a delay
      setTimeout(async () => {
        try {
          await mediaLiveManager.deleteChannel(streamId);
        } catch (deleteError) {
          console.error('Failed to delete MediaLive channel:', deleteError);
        }
      }, 5000); // 5 second delay
    } catch (mediaLiveError) {
      console.error('MediaLive stop error:', mediaLiveError);
      // Continue even if MediaLive fails
    }

    // Update stream status in database
    const { error: updateError } = await supabase
      .from('livestreams')
      .update({
        status: 'ended',
        ended_at: new Date().toISOString()
      })
      .eq('id', streamId);

    if (updateError) {
      console.error('Failed to update stream status:', updateError);
    }

    // Calculate stream duration
    const { data: finalStream } = await supabase
      .from('livestreams')
      .select('started_at, ended_at, viewer_count')
      .eq('id', streamId)
      .single();

    let duration = 0;
    if (finalStream?.started_at && finalStream?.ended_at) {
      duration = Math.floor(
        (new Date(finalStream.ended_at).getTime() - new Date(finalStream.started_at).getTime()) / 1000
      );
    }

    return NextResponse.json({
      success: true,
      streamId,
      duration,
      viewerCount: finalStream?.viewer_count || 0
    });

  } catch (error) {
    console.error('Stream stop error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}