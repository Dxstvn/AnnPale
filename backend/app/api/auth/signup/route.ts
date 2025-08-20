import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { z } from 'zod'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2),
  role: z.enum(['fan', 'creator']),
  language: z.enum(['en', 'fr', 'ht']).optional().default('en')
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = signupSchema.parse(body)
    
    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: validatedData.email,
      password: validatedData.password,
      email_confirm: true,
      user_metadata: {
        name: validatedData.name,
        role: validatedData.role,
        language: validatedData.language
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json(
        { error: authError.message },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Update the profile with the correct role
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        name: validatedData.name,
        role: validatedData.role,
        language_preference: validatedData.language,
        email_verified: true
      })
      .eq('id', authData.user.id)

    if (profileError) {
      console.error('Profile update error:', profileError)
      // Don't fail the signup if profile update fails
    }

    // Create a session for the user
    const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: validatedData.email,
      options: {
        redirectTo: `${process.env.FRONTEND_URL}/auth/callback`
      }
    })

    if (sessionError) {
      console.error('Session error:', sessionError)
    }

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        name: validatedData.name,
        role: validatedData.role
      }
    })

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Signup error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}