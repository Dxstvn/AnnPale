import { Page } from '@playwright/test'
import { createClient } from '@supabase/supabase-js'

export interface TestUser {
  email: string
  password: string
  role: 'fan' | 'creator' | 'admin'
  id?: string
}

export class AuthHelper {
  private supabase
  private testUsers: Map<string, TestUser>

  constructor() {
    // Initialize Supabase client with service role key for admin operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
    }
    
    this.supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Define test users
    this.testUsers = new Map([
      ['fan', {
        email: 'testfan@annpale.test',
        password: 'TestPassword123!',
        role: 'fan'
      }],
      ['creator', {
        email: 'testcreator@annpale.test', 
        password: 'TestPassword123!',
        role: 'creator'
      }],
      ['admin', {
        email: 'testadmin@annpale.test',
        password: 'TestPassword123!',
        role: 'admin'
      }]
    ])
  }

  /**
   * Get test accounts (no creation, they already exist)
   */
  async getTestAccounts() {
    const results = {
      testFan: this.testUsers.get('fan') || null,
      testCreator: this.testUsers.get('creator') || null,
      testAdmin: this.testUsers.get('admin') || null
    }

    return results
  }

  /**
   * Get existing test user info
   */
  async getUserInfo(email: string, password: string, role: 'fan' | 'creator' | 'admin'): Promise<TestUser> {
    // Check if user exists in profiles
    const { data: existingProfiles } = await this.supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
    
    if (existingProfiles && existingProfiles.length > 0) {
      const existingProfile = existingProfiles[0]
      return {
        email,
        password,
        role,
        id: existingProfile.id
      }
    }

    // User doesn't exist, return without ID
    console.warn(`Test user ${email} not found in database`)
    return {
      email,
      password,
      role
    }
  }

  /**
   * Login using Twitter OAuth
   */
  async loginWithTwitterOAuth(page: Page) {
    console.log('Starting Twitter OAuth login flow...')
    
    // Navigate to login page
    await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 15000 })
    
    // Click on Twitter/X OAuth button
    const twitterButton = page.locator('button:has-text("X")').or(
      page.locator('button:has-text("Twitter")')
    )
    
    await twitterButton.waitFor({ state: 'visible', timeout: 10000 })
    
    // Start waiting for popup/redirect before clicking
    const [oauthPage] = await Promise.all([
      page.context().waitForEvent('page').catch(() => null), // Wait for new page/popup
      twitterButton.click()
    ])
    
    // Handle OAuth flow
    const targetPage = oauthPage || page
    
    // Check if we're redirected to Twitter
    await targetPage.waitForLoadState('domcontentloaded', { timeout: 15000 })
    
    if (targetPage.url().includes('twitter.com') || targetPage.url().includes('x.com') || targetPage.url().includes('api.twitter.com')) {
      const username = process.env.TWITTER_USERNAME
      const password = process.env.TWITTER_PASSWORD
      
      if (!username || !password) {
        throw new Error('Twitter credentials not found in environment variables')
      }
      
      // Check if we need to enter username
      const usernameInput = targetPage.locator('input[name="text"], input[name="session[username_or_email]"], input[autocomplete="username"]')
      if (await usernameInput.isVisible({ timeout: 5000 }).catch(() => false)) {
        console.log('Entering Twitter username...')
        await usernameInput.fill(username)
        
        // Click next or submit
        const nextButton = targetPage.locator('button:has-text("Next"), div[role="button"]:has-text("Next")')
        if (await nextButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await nextButton.click()
        } else {
          await targetPage.keyboard.press('Enter')
        }
      }
      
      // Wait for password field
      const passwordInput = targetPage.locator('input[name="password"], input[type="password"], input[autocomplete="current-password"]')
      await passwordInput.waitFor({ state: 'visible', timeout: 10000 })
      console.log('Entering Twitter password...')
      await passwordInput.fill(password)
      
      // Submit login
      const loginButton = targetPage.locator('button:has-text("Log in"), div[role="button"]:has-text("Log in")')
      if (await loginButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await loginButton.click()
      } else {
        await targetPage.keyboard.press('Enter')
      }
      
      console.log('Twitter credentials submitted, waiting for authorization...')
      
      // Check if we need to authorize the app
      try {
        const authorizeButton = targetPage.locator('button:has-text("Authorize"), input[value="Authorize"], button:has-text("Allow")')
        if (await authorizeButton.isVisible({ timeout: 5000 }).catch(() => false)) {
          console.log('Clicking authorize button...')
          await authorizeButton.click()
        }
      } catch (e) {
        console.log('No authorization button found, might be auto-authorized')
      }
    }
    
    // Wait for callback and successful authentication
    await page.waitForURL('**/auth/callback**', { timeout: 30000 }).catch(() => {
      console.log('OAuth callback URL not detected, checking if already redirected...')
    })
    
    // Wait a bit for any redirects to complete
    await page.waitForTimeout(3000)
    
    // Check final URL
    const finalUrl = page.url()
    console.log(`OAuth flow completed, final URL: ${finalUrl}`)
    
    if (finalUrl.includes('error')) {
      throw new Error('OAuth authentication failed')
    }
    
    // Store auth session for reuse
    const storageState = await page.context().storageState()
    console.log('Successfully logged in via Twitter OAuth')
    return storageState
  }

  /**
   * Login as a specific role and save session with retry logic
   * Now supports OAuth login for fan role
   */
  async loginAs(page: Page, role: 'fan' | 'creator' | 'admin', retries = 3, useOAuth = false) {
    // Use Twitter OAuth for fan role if requested or if OAuth is preferred
    if (useOAuth && role === 'fan') {
      return await this.loginWithTwitterOAuth(page)
    }
    
    const user = this.testUsers.get(role)
    if (!user) {
      throw new Error(`No test user defined for role: ${role}`)
    }

    let lastError: Error | null = null
    
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Login attempt ${attempt}/${retries} for role: ${role}`)
        
        // Navigate to login page with retry on network errors
        try {
          await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 15000 })
        } catch (navError) {
          console.warn(`Navigation error on attempt ${attempt}:`, navError)
          if (attempt === retries) throw navError
          await page.waitForTimeout(2000 * attempt) // Exponential backoff
          continue
        }
        
        // Wait for login form to be ready
        await page.waitForSelector('#email', { timeout: 5000 })
        await page.waitForSelector('#password', { timeout: 5000 })
        
        // Clear fields first to ensure clean input
        await page.fill('#email', '')
        await page.fill('#password', '')
        
        // Fill in credentials
        await page.fill('#email', user.email)
        await page.fill('#password', user.password)
        
        // Debug: verify fields are filled
        const emailValue = await page.locator('#email').inputValue()
        const passwordValue = await page.locator('#password').inputValue()
        console.log(`Email filled: ${emailValue === user.email ? 'YES' : 'NO'}`)
        console.log(`Password filled: ${passwordValue ? 'YES (hidden)' : 'NO'}`)
        
        // Submit the form by pressing Enter (more reliable than clicking button)
        await page.locator('#password').press('Enter')
        console.log('Form submitted via Enter key')
        
        // Wait for navigation or error - simpler approach
        // Just wait for URL to change from /login
        try {
          await page.waitForFunction(
            () => !window.location.pathname.includes('/login'),
            { timeout: 10000 }
          )
          console.log(`Successfully navigated away from login page to: ${page.url()}`)
          // Success! Break out of retry loop
        } catch (navError) {
          // Still on login page - check for error messages
          const errorElement = await page.locator('text=/Invalid login|incorrect|error|failed/i').first().isVisible().catch(() => false)
          
          if (errorElement) {
            const errorText = await page.locator('text=/Invalid login|incorrect|error|failed/i').first().textContent().catch(() => 'Unknown error')
            console.warn(`Login error on attempt ${attempt}: ${errorText}`)
            
            // Check for rate limiting
            if (errorText && errorText.toLowerCase().includes('rate')) {
              console.log(`Rate limited. Waiting ${5 * attempt} seconds before retry...`)
              await page.waitForTimeout(5000 * attempt)
            } else {
              await page.waitForTimeout(2000 * attempt)
            }
            
            if (attempt === retries) {
              throw new Error(`Login failed after ${retries} attempts: ${errorText}`)
            }
            continue
          } else {
            // No error message but still on login page - timeout
            console.warn(`Login timeout on attempt ${attempt} - still on login page`)
            if (attempt === retries) {
              // Last attempt - double check current URL
              const currentUrl = page.url()
              if (!currentUrl.includes('/login')) {
                console.log(`Actually succeeded - now at: ${currentUrl}`)
                break // Success!
              }
              throw new Error(`Login timed out after ${retries} attempts - stuck on login page`)
            }
            await page.waitForTimeout(3000 * attempt)
            continue
          }
        }
        
        // Success - ensure we're on the right page
        if (role === 'fan' && page.url().includes('/fan/dashboard')) {
          // Navigate to home if on dashboard
          await page.goto('/fan/home', { waitUntil: 'domcontentloaded', timeout: 10000 }).catch(() => {
            console.log('Could not navigate to /fan/home, staying on dashboard')
          })
        }
        
        // Store auth session for reuse
        const storageState = await page.context().storageState()
        console.log(`Successfully logged in as ${role}`)
        return storageState
        
      } catch (error: any) {
        lastError = error
        console.error(`Login attempt ${attempt} failed:`, error.message)
        
        if (attempt < retries) {
          const waitTime = Math.min(5000 * attempt, 15000) // Max 15s wait
          console.log(`Waiting ${waitTime}ms before retry...`)
          await page.waitForTimeout(waitTime)
        }
      }
    }
    
    throw lastError || new Error(`Failed to login as ${role} after ${retries} attempts`)
  }

  /**
   * Get test credentials for a role
   */
  getTestCredentials(role: 'fan' | 'creator' | 'admin') {
    const user = this.testUsers.get(role)
    if (!user) {
      throw new Error(`No test user defined for role: ${role}`)
    }
    return user
  }

  /**
   * Clean up test users after tests
   */
  async cleanupTestUsers() {
    for (const user of this.testUsers.values()) {
      try {
        // Delete from profiles first
        await this.supabase
          .from('profiles')
          .delete()
          .eq('email', user.email)

        // Note: Deleting from auth requires service role key and admin API
        // This would need to be implemented based on your Supabase setup
      } catch (error) {
        console.warn(`Could not cleanup user ${user.email}:`, error)
      }
    }
  }

  /**
   * Check if a user is logged in
   */
  async isLoggedIn(page: Page): Promise<boolean> {
    try {
      // Navigate to a page first if not already on one
      if (page.url() === 'about:blank') {
        await page.goto('/')
      }
      
      // Check for presence of Supabase auth token in localStorage
      const hasToken = await page.evaluate(() => {
        const token = localStorage.getItem('supabase.auth.token')
        return !!token
      })
      return hasToken
    } catch (error) {
      // If we can't access localStorage, assume not logged in
      return false
    }
  }

  /**
   * Logout the current user
   */
  async logout(page: Page) {
    // Try to find and click logout button
    try {
      // First try to open user menu if it exists
      const userMenuTrigger = page.locator('[data-testid="user-menu-trigger"], [aria-label*="User menu"], button:has-text("Account")')
      if (await userMenuTrigger.isVisible()) {
        await userMenuTrigger.click()
        await page.waitForTimeout(500) // Wait for dropdown to open
      }

      // Click logout
      await page.click('[data-testid="logout-button"], button:has-text("Log Out"), button:has-text("Logout"), button:has-text("Sign Out")')
      
      // Wait for redirect to home or login page
      await page.waitForURL(/\/(login|$)/, { timeout: 5000 })
    } catch (error) {
      console.warn('Could not find logout button, clearing session manually')
      // Clear session manually
      await page.evaluate(() => {
        localStorage.clear()
        sessionStorage.clear()
      })
      await page.goto('/')
    }
  }
}

/**
 * Get existing test user for E2E tests (no creation)
 */
export async function getTestUser(role: 'fan' | 'creator' | 'admin') {
  const email = `test${role}@annpale.test`
  
  // Initialize Supabase client to check for existing user
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing required environment variables')
  }
  
  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
  
  // Check if user exists in profiles
  const { data: existingProfiles, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
  
  if (!profileError && existingProfiles && existingProfiles.length > 0) {
    const existingProfile = existingProfiles[0]
    console.log(`Test user ${email} found with ID: ${existingProfile.id}`)
    return { userId: existingProfile.id }
  }
  
  console.warn(`Test user ${email} not found in database`)
  return { userId: '' }
}

/**
 * No cleanup needed - test users are permanent
 */
export async function cleanupTestUser(userId: string) {
  // Do nothing - test users should remain in the database
  console.log(`Skipping cleanup for test user ${userId} - permanent test data`)
}