import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  console.log('[Avatar Upload API] Starting upload process...')

  try {
    // Validate environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error('[Avatar Upload API] Missing Supabase environment variables')
      return NextResponse.json({
        error: 'Server configuration error. Please try again later.'
      }, { status: 500 })
    }

    console.log('[Avatar Upload API] Creating Supabase client...')
    const supabase = await createClient()
    console.log('[Avatar Upload API] Supabase client created successfully')

    // Check authentication
    console.log('[Avatar Upload API] Checking user authentication...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError) {
      console.error('[Avatar Upload API] Auth error:', authError)
      return NextResponse.json({
        error: 'Authentication failed. Please sign in again.'
      }, { status: 401 })
    }

    if (!user) {
      console.error('[Avatar Upload API] No user found in session')
      return NextResponse.json({
        error: 'No user session found. Please sign in.'
      }, { status: 401 })
    }

    console.log('[Avatar Upload API] User authenticated:', user.id)

    // Get the file from form data
    console.log('[Avatar Upload API] Parsing form data...')
    let formData
    try {
      formData = await request.formData()
    } catch (formError) {
      console.error('[Avatar Upload API] Form data parsing error:', formError)
      return NextResponse.json({
        error: 'Invalid form data. Please try again.'
      }, { status: 400 })
    }

    const file = formData.get('file') as File
    console.log('[Avatar Upload API] File received:', file ? `${file.name} (${file.size} bytes, ${file.type})` : 'No file')

    if (!file) {
      console.error('[Avatar Upload API] No file provided in form data')
      return NextResponse.json({
        error: 'No file provided. Please select an image to upload.'
      }, { status: 400 })
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
    console.log('[Avatar Upload API] Validating file type:', file.type)
    if (!allowedTypes.includes(file.type)) {
      console.error('[Avatar Upload API] Invalid file type:', file.type)
      return NextResponse.json({
        error: 'Invalid file type. Only JPG, PNG, and GIF are allowed.'
      }, { status: 400 })
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024 // 5MB in bytes
    console.log('[Avatar Upload API] Validating file size:', `${file.size} bytes (max: ${maxSize})`)
    if (file.size > maxSize) {
      console.error('[Avatar Upload API] File too large:', file.size)
      return NextResponse.json({
        error: 'File too large. Maximum size is 5MB.'
      }, { status: 400 })
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.id}/${uuidv4()}.${fileExt}`
    console.log('[Avatar Upload API] Generated filename:', fileName)

    // Convert File to ArrayBuffer then to Buffer
    console.log('[Avatar Upload API] Converting file to buffer...')
    let arrayBuffer, buffer
    try {
      arrayBuffer = await file.arrayBuffer()
      buffer = Buffer.from(arrayBuffer)
      console.log('[Avatar Upload API] File converted to buffer successfully:', buffer.length, 'bytes')
    } catch (bufferError) {
      console.error('[Avatar Upload API] Buffer conversion error:', bufferError)
      return NextResponse.json({
        error: 'Failed to process uploaded file. Please try again.'
      }, { status: 500 })
    }

    // Upload to Supabase Storage
    console.log('[Avatar Upload API] Uploading to Supabase Storage...')
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      console.error('[Avatar Upload API] Storage upload error:', uploadError)
      return NextResponse.json({
        error: `Failed to upload image: ${uploadError.message}. Please try again.`
      }, { status: 500 })
    }

    console.log('[Avatar Upload API] File uploaded successfully:', uploadData.path)

    // Get public URL
    console.log('[Avatar Upload API] Getting public URL...')
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    console.log('[Avatar Upload API] Public URL generated:', publicUrl)

    // Update user profile with new avatar URL
    console.log('[Avatar Upload API] Updating user profile...')
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    if (updateError) {
      console.error('[Avatar Upload API] Profile update error:', updateError)

      // Try to delete the uploaded file to clean up
      try {
        await supabase.storage.from('avatars').remove([fileName])
        console.log('[Avatar Upload API] Cleaned up uploaded file after profile update failure')
      } catch (cleanupError) {
        console.error('[Avatar Upload API] Failed to cleanup uploaded file:', cleanupError)
      }

      return NextResponse.json({
        error: `Failed to update profile: ${updateError.message}. Please try again.`
      }, { status: 500 })
    }

    console.log('[Avatar Upload API] Profile updated successfully')

    return NextResponse.json({
      success: true,
      avatar_url: publicUrl,
      message: 'Avatar uploaded successfully'
    })

  } catch (error) {
    console.error('[Avatar Upload API] Unexpected error:', error)

    // Ensure we always return JSON even for unexpected errors
    if (error instanceof Error) {
      return NextResponse.json({
        error: `Unexpected error: ${error.message}. Please try again.`
      }, { status: 500 })
    }

    return NextResponse.json({
      error: 'An unexpected error occurred. Please try again.'
    }, { status: 500 })
  }
}