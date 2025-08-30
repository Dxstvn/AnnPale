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
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yijizsscwkvepljqojkz.supabase.co'
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    
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
        password: 'TestFan123!',
        role: 'fan'
      }],
      ['creator', {
        email: 'testcreator@annpale.test', 
        password: 'TestCreator123!',
        role: 'creator'
      }],
      ['admin', {
        email: 'testadmin@annpale.test',
        password: 'TestAdmin123!',
        role: 'admin'
      }]
    ])
  }

  /**
   * Create test accounts via Supabase Admin API
   */
  async createTestAccounts() {
    const results = {
      testFan: null as TestUser | null,
      testCreator: null as TestUser | null,
      testAdmin: null as TestUser | null
    }

    for (const [key, user] of this.testUsers) {
      try {
        const created = await this.createUser(user.email, user.password, user.role)
        if (key === 'fan') results.testFan = created
        if (key === 'creator') results.testCreator = created
        if (key === 'admin') results.testAdmin = created
      } catch (error) {
        console.log(`Test user ${user.email} may already exist:`, error)
        // User might already exist, that's okay
        if (key === 'fan') results.testFan = user
        if (key === 'creator') results.testCreator = user
        if (key === 'admin') results.testAdmin = user
      }
    }

    return results
  }

  /**
   * Create a single test user
   */
  async createUser(email: string, password: string, role: 'fan' | 'creator' | 'admin'): Promise<TestUser> {
    // First try to sign up the user
    const { data: authData, error: authError } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role
        }
      }
    })

    if (authError && !authError.message.includes('already registered')) {
      throw authError
    }

    const userId = authData?.user?.id

    if (userId) {
      // Create or update the profile
      const { error: profileError } = await this.supabase
        .from('profiles')
        .upsert({
          id: userId,
          email,
          name: `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`,
          role,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (profileError) {
        console.warn(`Could not create profile for ${email}:`, profileError)
      }
    }

    return {
      email,
      password,
      role,
      id: userId
    }
  }

  /**
   * Login as a specific role and save session
   */
  async loginAs(page: Page, role: 'fan' | 'creator' | 'admin') {
    const user = this.testUsers.get(role)
    if (!user) {
      throw new Error(`No test user defined for role: ${role}`)
    }

    // Navigate to login page
    await page.goto('/login')
    
    // Fill in credentials
    await page.fill('[data-testid="email-input"], input[type="email"], #email', user.email)
    await page.fill('[data-testid="password-input"], input[type="password"], #password', user.password)
    
    // Click login button
    await page.click('[data-testid="login-button"], button[type="submit"]:has-text("Sign In"), button:has-text("Login")')
    
    // Wait for navigation to dashboard/home based on role
    const expectedUrl = role === 'fan' ? '/fan/home' : `/${role}/dashboard`
    await page.waitForURL(expectedUrl, { timeout: 10000 })
    
    // Store auth session for reuse
    const storageState = await page.context().storageState()
    return storageState
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
    // Check for presence of Supabase auth token in localStorage
    const hasToken = await page.evaluate(() => {
      const token = localStorage.getItem('supabase.auth.token')
      return !!token
    })
    return hasToken
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