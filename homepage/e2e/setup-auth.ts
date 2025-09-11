import { chromium } from '@playwright/test'
import * as fs from 'fs'
import * as path from 'path'

async function setupAuth() {
  const browser = await chromium.launch({ headless: false }) // Show browser for debugging
  
  try {
    // Setup fan auth
    console.log('Setting up fan auth...')
    const fanContext = await browser.newContext()
    const fanPage = await fanContext.newPage()
    
    await fanPage.goto('http://localhost:3000/login')
    await fanPage.waitForSelector('#email', { timeout: 10000 })
    
    // Fill and submit with debugging
    await fanPage.fill('#email', 'testfan@annpale.test')
    await fanPage.fill('#password', 'TestFan123!')
    
    // Take screenshot before submit
    await fanPage.screenshot({ path: 'before-login.png' })
    
    // Try different submit approach
    await fanPage.evaluate(() => {
      const form = document.querySelector('form')
      if (form) {
        form.requestSubmit()
      }
    })
    
    // Wait longer for navigation
    await fanPage.waitForTimeout(8000)
    
    // Take screenshot after
    await fanPage.screenshot({ path: 'after-login.png' })
    
    const url = fanPage.url()
    console.log('Final URL:', url)
    
    if (!url.includes('/login')) {
      console.log('Fan login successful!')
      const state = await fanContext.storageState()
      
      const authDir = path.join(__dirname, '.auth')
      if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true })
      }
      
      fs.writeFileSync(
        path.join(authDir, 'fan.json'),
        JSON.stringify(state, null, 2)
      )
      console.log('Fan auth state saved')
    } else {
      console.error('Fan login failed - still on login page')
      
      // Check for errors
      const errors = await fanPage.locator('text=/error|invalid|failed/i').allTextContents()
      if (errors.length > 0) {
        console.log('Errors found:', errors)
      }
    }
    
    await fanContext.close()
    
  } catch (error) {
    console.error('Setup failed:', error)
  } finally {
    await browser.close()
  }
}

setupAuth().catch(console.error)