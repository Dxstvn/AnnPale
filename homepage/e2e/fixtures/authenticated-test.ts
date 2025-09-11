import { test as base, Page, BrowserContext } from '@playwright/test'
import { AuthHelper } from '../helpers/auth.helper'
import * as fs from 'fs'
import * as path from 'path'
import dotenv from 'dotenv'

// Load environment variables at module level
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

export type AuthenticatedFixtures = {
  fanPage: Page
  creatorPage: Page
  adminPage: Page
  fanContext: BrowserContext
  creatorContext: BrowserContext
  adminContext: BrowserContext
  authHelper: AuthHelper
}

/**
 * Extended test fixture with pre-authenticated pages for each role
 */
export const authenticatedTest = base.extend<AuthenticatedFixtures>({
  authHelper: async ({}, use) => {
    const helper = new AuthHelper()
    await use(helper)
  },

  fanContext: async ({ browser }, use) => {
    const authFile = path.join(__dirname, '../.auth/fan.json')
    
    // Create context with stored auth state if it exists
    let context: BrowserContext
    if (fs.existsSync(authFile)) {
      context = await browser.newContext({
        storageState: authFile
      })
    } else {
      // Create new context and login
      context = await browser.newContext()
      const page = await context.newPage()
      const authHelper = new AuthHelper()
      
      try {
        // Use OAuth login for fan role by default (since Twitter OAuth is working)
        const useOAuth = process.env.TWITTER_USERNAME && process.env.TWITTER_PASSWORD
        const storageState = await authHelper.loginAs(page, 'fan', 3, useOAuth)
        
        // Save auth state for future use
        const authDir = path.dirname(authFile)
        if (!fs.existsSync(authDir)) {
          fs.mkdirSync(authDir, { recursive: true })
        }
        fs.writeFileSync(authFile, JSON.stringify(storageState))
      } catch (error) {
        console.error('Failed to authenticate as fan:', error)
      }
      
      await page.close()
    }
    
    await use(context)
    await context.close()
  },

  creatorContext: async ({ browser }, use) => {
    const authFile = path.join(__dirname, '../.auth/creator.json')
    
    let context: BrowserContext
    if (fs.existsSync(authFile)) {
      context = await browser.newContext({
        storageState: authFile
      })
    } else {
      context = await browser.newContext()
      const page = await context.newPage()
      const authHelper = new AuthHelper()
      
      try {
        const storageState = await authHelper.loginAs(page, 'creator')
        
        const authDir = path.dirname(authFile)
        if (!fs.existsSync(authDir)) {
          fs.mkdirSync(authDir, { recursive: true })
        }
        fs.writeFileSync(authFile, JSON.stringify(storageState))
      } catch (error) {
        console.error('Failed to authenticate as creator:', error)
      }
      
      await page.close()
    }
    
    await use(context)
    await context.close()
  },

  adminContext: async ({ browser }, use) => {
    const authFile = path.join(__dirname, '../.auth/admin.json')
    
    let context: BrowserContext
    if (fs.existsSync(authFile)) {
      context = await browser.newContext({
        storageState: authFile
      })
    } else {
      context = await browser.newContext()
      const page = await context.newPage()
      const authHelper = new AuthHelper()
      
      try {
        const storageState = await authHelper.loginAs(page, 'admin')
        
        const authDir = path.dirname(authFile)
        if (!fs.existsSync(authDir)) {
          fs.mkdirSync(authDir, { recursive: true })
        }
        fs.writeFileSync(authFile, JSON.stringify(storageState))
      } catch (error) {
        console.error('Failed to authenticate as admin:', error)
      }
      
      await page.close()
    }
    
    await use(context)
    await context.close()
  },

  fanPage: async ({ fanContext }, use) => {
    const page = await fanContext.newPage()
    await use(page)
    await page.close()
  },

  creatorPage: async ({ creatorContext }, use) => {
    const page = await creatorContext.newPage()
    await use(page)
    await page.close()
  },

  adminPage: async ({ adminContext }, use) => {
    const page = await adminContext.newPage()
    await use(page)
    await page.close()
  }
})

export { expect, Page } from '@playwright/test'

/**
 * Simple class-based authenticated test helper
 */
export class AuthenticatedTest {
  private page: Page
  private role: 'fan' | 'creator' | 'admin'
  private authHelper: AuthHelper

  constructor(page: Page, role: 'fan' | 'creator' | 'admin') {
    this.page = page
    this.role = role
    this.authHelper = new AuthHelper()
  }

  async setup() {
    // Check if already logged in
    const isLoggedIn = await this.authHelper.isLoggedIn(this.page)
    
    if (!isLoggedIn) {
      // Use OAuth for fan role if Twitter credentials are available
      const useOAuth = this.role === 'fan' && process.env.TWITTER_USERNAME && process.env.TWITTER_PASSWORD
      // Login with the specified role - the loginAs method now has built-in retry logic
      await this.authHelper.loginAs(this.page, this.role, 3, useOAuth)
    } else {
      console.log(`Already logged in as ${this.role}`)
    }
  }

  async cleanup() {
    // Logout after test if needed
    await this.authHelper.logout(this.page)
  }
}