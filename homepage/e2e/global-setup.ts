import { chromium, FullConfig } from '@playwright/test'
import { AuthHelper } from './helpers/auth.helper'
import * as fs from 'fs'
import * as path from 'path'
import dotenv from 'dotenv'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(__dirname, '..', '.env.local') })

/**
 * Global setup runs once before all tests
 * Prepares test data and authentication states
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Running global setup...')
  
  // Verify environment variables are loaded
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('⚠️  Missing Supabase environment variables. Tests may fail.')
    console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('SUPABASE')))
  }
  
  // Create auth directory if it doesn't exist
  const authDir = path.join(__dirname, '.auth')
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true })
  }
  
  // Setup auth states - always run to ensure fresh auth
  const shouldSetupAuth = true // Always setup auth
  if (shouldSetupAuth) {
    const browser = await chromium.launch()
    const authHelper = new AuthHelper()
    
    try {
      // Setup fan auth state using AuthHelper
      console.log('  📝 Setting up fan authentication...')
      const fanContext = await browser.newContext({
        baseURL: process.env.BASE_URL || 'http://localhost:3000'
      })
      const fanPage = await fanContext.newPage()
      
      try {
        const fanStorageState = await authHelper.loginAs(fanPage, 'fan', 3)
        fs.writeFileSync(
          path.join(authDir, 'fan.json'),
          JSON.stringify(fanStorageState, null, 2)
        )
        console.log('    ✅ Fan authentication saved')
      } catch (error) {
        console.error('    ❌ Fan login failed:', error)
      } finally {
        await fanPage.close()
        await fanContext.close()
      }
      
      // Setup creator auth state
      console.log('  📝 Setting up creator authentication...')
      const creatorContext = await browser.newContext({
        baseURL: process.env.BASE_URL || 'http://localhost:3000'
      })
      const creatorPage = await creatorContext.newPage()
      
      try {
        const creatorStorageState = await authHelper.loginAs(creatorPage, 'creator', 3)
        fs.writeFileSync(
          path.join(authDir, 'creator.json'),
          JSON.stringify(creatorStorageState, null, 2)
        )
        console.log('    ✅ Creator authentication saved')
      } catch (error) {
        console.error('    ❌ Creator login failed:', error)
      } finally {
        await creatorPage.close()
        await creatorContext.close()
      }
      
      // Setup admin auth state
      console.log('  📝 Setting up admin authentication...')
      const adminContext = await browser.newContext({
        baseURL: process.env.BASE_URL || 'http://localhost:3000'
      })
      const adminPage = await adminContext.newPage()
      
      try {
        const adminStorageState = await authHelper.loginAs(adminPage, 'admin', 3)
        fs.writeFileSync(
          path.join(authDir, 'admin.json'),
          JSON.stringify(adminStorageState, null, 2)
        )
        console.log('    ✅ Admin authentication saved')
      } catch (error) {
        console.error('    ❌ Admin login failed:', error)
      } finally {
        await adminPage.close()
        await adminContext.close()
      }
      
      console.log('✅ Authentication states prepared')
    } catch (error) {
      console.error('❌ Failed to setup authentication states:', error)
      // Don't fail the entire test run if auth setup fails
      // Tests can still run with manual login
    } finally {
      await browser.close()
    }
  } else {
    console.log('  ⏭️  Skipping auth setup (CI mode or disabled)')
  }
  
  // Setup test database if needed
  if (process.env.SETUP_TEST_DB === 'true') {
    console.log('  🗄️  Setting up test database...')
    // TODO: Add database setup logic when backend is implemented
  }
  
  // Create test data directory
  const testDataDir = path.join(__dirname, 'test-data')
  if (!fs.existsSync(testDataDir)) {
    fs.mkdirSync(testDataDir, { recursive: true })
  }
  
  // Store config for teardown
  process.env.TEST_RUN_ID = Date.now().toString()
  console.log(`  🏷️  Test run ID: ${process.env.TEST_RUN_ID}`)
  
  console.log('✨ Global setup complete')
}

export default globalSetup