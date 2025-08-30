import { FullConfig } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

/**
 * Global teardown runs once after all tests
 * Cleans up test data and resources
 */
async function globalTeardown(config: FullConfig) {
  console.log('🧹 Running global teardown...')
  
  const testRunId = process.env.TEST_RUN_ID
  if (testRunId) {
    console.log(`  🏷️  Cleaning up test run: ${testRunId}`)
  }
  
  // Clean up test data if in CI
  if (process.env.CI) {
    console.log('  🗑️  Cleaning up CI test data...')
    
    // Clean auth states
    const authDir = path.join(__dirname, '.auth')
    if (fs.existsSync(authDir)) {
      fs.rmSync(authDir, { recursive: true, force: true })
      console.log('    ✓ Auth states cleaned')
    }
    
    // Clean test data
    const testDataDir = path.join(__dirname, 'test-data')
    if (fs.existsSync(testDataDir)) {
      fs.rmSync(testDataDir, { recursive: true, force: true })
      console.log('    ✓ Test data cleaned')
    }
    
    // Clean screenshots/videos if needed
    const testResultsDir = path.join(__dirname, '..', 'test-results')
    if (fs.existsSync(testResultsDir) && process.env.CLEAN_RESULTS === 'true') {
      fs.rmSync(testResultsDir, { recursive: true, force: true })
      console.log('    ✓ Test results cleaned')
    }
  } else {
    console.log('  💾 Preserving test data (local mode)')
  }
  
  // Clean up test database if needed
  if (process.env.CLEANUP_TEST_DB === 'true') {
    console.log('  🗄️  Cleaning up test database...')
    // TODO: Add database cleanup logic when backend is implemented
  }
  
  // Report summary
  console.log('\n📋 Test Run Summary:')
  console.log(`  Run ID: ${testRunId || 'N/A'}`)
  console.log(`  Environment: ${process.env.CI ? 'CI' : 'Local'}`)
  console.log(`  Base URL: ${process.env.BASE_URL || 'http://localhost:3000'}`)
  
  console.log('\n✨ Global teardown complete')
}

export default globalTeardown