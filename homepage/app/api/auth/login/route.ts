import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  provider: z.enum(['email', 'google', 'apple', 'twitter']).optional().default('email')
})

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()

    // Validate input
    const validatedData = loginSchema.parse(body)

    if (validatedData.provider === 'email') {
      // Email/Password login
      const { data, error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password
      })

      if (error) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        )
      }

      if (!data.user || !data.session) {
        return NextResponse.json(
          { error: 'Login failed' },
          { status: 401 }
        )
      }

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) {
        console.error('Profile fetch error:', profileError)
      }

      // Set auth cookie
      const response = NextResponse.json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email!,
          name: profile?.name || data.user.user_metadata?.name || 'User',
          role: profile?.role || 'fan',
          avatar_url: profile?.avatar_url
        },
        session: {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
          expires_at: data.session.expires_at
        }
      })

      // Set secure HTTP-only cookie
      response.cookies.set({
        name: 'auth-token',
        value: data.session.access_token,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })

      return response

    } else {
      // OAuth provider login (Google, Apple, Twitter)
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: validatedData.provider as 'google' | 'apple' | 'twitter',
        options: {
          redirectTo: `${process.env.FRONTEND_URL}/auth/callback`
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
        url: data.url
      })
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}