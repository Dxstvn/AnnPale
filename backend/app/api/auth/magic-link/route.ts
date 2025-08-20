import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

const magicLinkSchema = z.object({
  email: z.string().email(),
  redirectTo: z.string().url().optional()
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = magicLinkSchema.parse(body)
    
    // Send magic link
    const { data, error } = await supabase.auth.signInWithOtp({
      email: validatedData.email,
      options: {
        emailRedirectTo: validatedData.redirectTo || `${process.env.FRONTEND_URL}/auth/callback`,
        shouldCreateUser: true
      }
    })

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Magic link sent to your email'
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Magic link error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}