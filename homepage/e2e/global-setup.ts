import { chromium, FullConfig } from '@playwright/test'
import { AuthHelper } from './helpers/auth.helper'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Global setup runs once before all tests
 * Prepares test data and authentication states
 */
async function globalSetup(config: FullConfig) {
  console.log('🚀 Running global setup...')
  
  // Create auth directory if it doesn't exist
  const authDir = path.join(__dirname, '.auth')
  if (!fs.existsSync(authDir)) {
    fs.mkdirSync(authDir, { recursive: true })
  }
  
  // Only setup auth states if explicitly requested (disabled for now since test users don't exist)
  if (process.env.SETUP_AUTH === 'true') {
    const browser = await chromium.launch()
    const context = await browser.newContext({
      baseURL: process.env.BASE_URL || 'http://localhost:3000'
    })
    const page = await context.newPage()
    const authHelper = new AuthHelper()
    
    try {
      // Setup fan auth state
      console.log('  📝 Setting up fan authentication...')
      const fanStorage = await authHelper.loginAs(page, 'fan')
      if (fanStorage) {
        fs.writeFileSync(
          path.join(authDir, 'fan.json'),
          JSON.stringify(fanStorage)
        )
      }
      
      // Clear cookies for next login
      await context.clearCookies()
      
      // Setup creator auth state
      console.log('  📝 Setting up creator authentication...')
      const creatorStorage = await authHelper.loginAs(page, 'creator')
      if (creatorStorage) {
        fs.writeFileSync(
          path.join(authDir, 'creator.json'),
          JSON.stringify(creatorStorage)
        )
      }
      
      // Clear cookies for next login
      await context.clearCookies()
      
      // Setup admin auth state
      console.log('  📝 Setting up admin authentication...')
      const adminStorage = await authHelper.loginAs(page, 'admin')
      if (adminStorage) {
        fs.writeFileSync(
          path.join(authDir, 'admin.json'),
          JSON.stringify(adminStorage)
        )
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