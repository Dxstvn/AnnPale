import { Page } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

// Test user credentials
export const TEST_USERS = {
  fan: {
    email: 'testfan@annpale.test',
    password: 'TestPassword123!',
    id: '8f8d7143-99e8-4ca6-868f-38df513e2264',
    role: 'fan'
  },
  creator: {
    email: 'testcreator@annpale.test', 
    password: 'TestPassword123!',
    id: '0f3753a3-029c-473a-9aee-fc107d10c569',
    role: 'creator'
  }
}

/**
 * Authenticate user directly with Supabase and inject session into browser
 * This bypasses the UI login flow for more reliable testing
 */
export async function authenticateWithSupabase(
  page: Page, 
  role: 'fan' | 'creator'
): Promise<void> {
  const user = TEST_USERS[role]
  
  // Get Supabase URL from environment - using production Supabase
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yijizsscwkvepljqojkz.supabase.co'
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpaml6c3Njd2t2ZXBsanFvamt6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1OTMyODgsImV4cCI6MjA3MjE2OTI4OH0.ot_XW1tE42_MPuOpoSslnxYcz89TGyDKSkT8IGaGqX8'
  
  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  console.log(`🔐 Authenticating as ${role}: ${user.email}`)
  
  // Sign in with Supabase
  const { data, error } = await supabase.auth.signInWithPassword({
    email: user.email,
    password: user.password
  })
  
  if (error) {
    throw new Error(`Failed to authenticate with Supabase: ${error.message}`)
  }
  
  if (!data.session) {
    throw new Error('No session returned from Supabase')
  }
  
  console.log(`✅ Successfully authenticated with Supabase`)
  console.log(`   User ID: ${data.user?.id}`)
  console.log(`   Session expires at: ${new Date(data.session.expires_at! * 1000).toISOString()}`)
  
  // Navigate to the app first to ensure proper domain context
  await page.goto('/', { waitUntil: 'domcontentloaded' })
  
  // Inject the session into browser localStorage
  await page.evaluate(({ session, url }) => {
    // Supabase stores the session with a specific key format
    const storageKey = `sb-${new URL(url).hostname}-auth-token`
    
    // Store the complete session object
    const sessionData = {
      access_token: session.access_token,
      token_type: session.token_type,
      expires_in: session.expires_in,
      expires_at: session.expires_at,
      refresh_token: session.refresh_token,
      user: session.user
    }
    
    localStorage.setItem(storageKey, JSON.stringify(sessionData))
    
    // Also set the legacy format for backward compatibility
    localStorage.setItem(`sb-${new URL(url).hostname}-auth-token-code-verifier`, 'undefined')
    
    console.log(`Session injected into localStorage with key: ${storageKey}`)
  }, { 
    session: data.session,
    url: supabaseUrl 
  })
  
  // Set cookies if needed (for SSR)
  if (data.session) {
    const cookies = [
      {
        name: `sb-${new URL(supabaseUrl).hostname}-auth-token`,
        value: `base64-${Buffer.from(JSON.stringify({
          access_token: data.session.access_token,
          token_type: data.session.token_type,
          expires_in: data.session.expires_in,
          expires_at: data.session.expires_at,
          refresh_token: data.session.refresh_token,
          user: data.session.user
        })).toString('base64')}`,
        domain: 'localhost',
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax' as const
      }
    ]
    
    await page.context().addCookies(cookies)
  }
  
  // Reload the page to pick up the session - use domcontentloaded for faster load
  await page.reload({ waitUntil: 'domcontentloaded' })
  
  // Wait a moment for auth context to update
  await page.waitForTimeout(2000)
  
  console.log(`✅ Session injected and page reloaded`)
  
  // Verify authentication worked by checking URL or page content
  const currentUrl = page.url()
  console.log(`   Current URL after auth: ${currentUrl}`)
  
  // Navigate to the appropriate dashboard
  const targetPath = role === 'creator' ? '/creator/dashboard' : '/fan/home'
  if (!currentUrl.includes(targetPath)) {
    console.log(`   Navigating to ${targetPath}...`)
    await page.goto(targetPath, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1000)
  }
  
  // Final verification - check if we're authenticated and not on login page
  const finalUrl = page.url()
  if (finalUrl.includes('/login')) {
    // Try one more time with direct navigation
    await page.goto(targetPath, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(1000)
    const retryUrl = page.url()
    if (retryUrl.includes('/login')) {
      throw new Error(`Authentication failed - redirected to login page. URL: ${retryUrl}`)
    }
  }
  
  console.log(`✅ Successfully authenticated and navigated to: ${finalUrl}`)
}

/**
 * Clear authentication session
 */
export async function clearAuth(page: Page): Promise<void> {
  await page.evaluate(() => {
    localStorage.clear()
    sessionStorage.clear()
  })
  
  // Clear all cookies
  const cookies = await page.context().cookies()
  if (cookies.length > 0) {
    await page.context().clearCookies()
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(page: Page): Promise<boolean> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yijizsscwkvepljqojkz.supabase.co'
  
  return await page.evaluate((url) => {
    const storageKey = `sb-${new URL(url).hostname}-auth-token`
    const session = localStorage.getItem(storageKey)
    
    if (!session) return false
    
    try {
      const sessionData = JSON.parse(session)
      return !!sessionData.access_token && !!sessionData.user
    } catch {
      return false
    }
  }, supabaseUrl)
}