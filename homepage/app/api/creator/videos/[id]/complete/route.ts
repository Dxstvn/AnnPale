import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// POST /api/creator/videos/[id]/complete - Mark video as completed and deliver
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params
    const body = await request.json()
    const { deliveryNotes } = body

    const supabase = await createClient()
    const videoService = new VideoService(supabase)

    // Complete the video delivery
    const completeResult = await videoService.completeVideoDelivery(videoId)

    if (!completeResult.success) {
      return NextResponse.json(
        { error: completeResult.error },
        { status: 400 }
      )
    }

    // Add delivery notes if provided
    if (deliveryNotes) {
      const { error: updateError } = await supabase
        .from('video_uploads')
        .update({
          metadata: {
            deliveryNotes,
            deliveredAt: new Date().toISOString()
          }
        })
        .eq('id', videoId)

      if (updateError) {
        console.warn('Failed to add delivery notes:', updateError)
      }
    }

    return NextResponse.json({
      success: true,
      data: completeResult.data,
      message: 'Video delivered successfully'
    })

  } catch (error) {
    console.error('Complete video delivery error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}