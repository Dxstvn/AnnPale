import { test, expect } from '@playwright/test';

test.describe('OAuth Authentication Debug', () => {
  test('Debug callback page loading issue', async ({ page }) => {
    console.log('Starting OAuth callback debug test...');
    
    // Enable console logging from the browser
    page.on('console', msg => {
      console.log(`[Browser Console ${msg.type()}]:`, msg.text());
    });
    
    // Enable request/response logging for auth-related URLs
    page.on('request', request => {
      if (request.url().includes('auth') || request.url().includes('supabase')) {
        console.log(`[Request]: ${request.method()} ${request.url()}`);
      }
    });
    
    page.on('response', response => {
      if (response.url().includes('auth') || response.url().includes('supabase')) {
        console.log(`[Response]: ${response.status()} ${response.url()}`);
      }
    });
    
    // Navigate to callback page to see current state
    console.log('\n=== Testing callback page directly ===');
    await page.goto('http://localhost:3000/auth/callback', { waitUntil: 'networkidle' });
    
    // Wait a bit to see what happens
    await page.waitForTimeout(5000);
    
    // Check what's on the page
    const pageContent = await page.evaluate(() => {
      const errorElement = document.querySelector('[class*="error"]');
      const loaderElement = document.querySelector('[class*="animate-spin"]');
      const titleElement = document.querySelector('h2, h3, [class*="CardTitle"]');
      
      return {
        url: window.location.href,
        hasError: !!errorElement,
        hasLoader: !!loaderElement,
        errorText: errorElement?.textContent,
        title: titleElement?.textContent,
        bodyText: document.body.innerText.substring(0, 500)
      };
    });
    
    console.log('\nCallback page state:', JSON.stringify(pageContent, null, 2));
    
    // Check Supabase session
    const sessionInfo = await page.evaluate(async () => {
      try {
        // Check localStorage for Supabase data
        const storageKeys = Object.keys(localStorage).filter(key => key.includes('supabase'));
        const sessionData: any = {};
        
        for (const key of storageKeys) {
          const value = localStorage.getItem(key);
          if (value && value.includes('session')) {
            try {
              sessionData[key] = JSON.parse(value);
            } catch {
              sessionData[key] = value;
            }
          }
        }
        
        return {
          storageKeys,
          hasSession: Object.keys(sessionData).length > 0,
          sessionData: sessionData
        };
      } catch (error: any) {
        return { error: error.message };
      }
    });
    
    console.log('\nSupabase session info:', JSON.stringify(sessionInfo, null, 2));
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/callback-page-state.png', fullPage: true });
    console.log('\nScreenshot saved to tests/screenshots/callback-page-state.png');
  });
  
  test('Test sign-out functionality', async ({ page }) => {
    console.log('\n=== Testing sign-out functionality ===');
    
    // Navigate to sign-out test page
    await page.goto('http://localhost:3000/signout-test', { waitUntil: 'networkidle' });
    
    // Check current session
    await page.click('button:has-text("Check Current Session")');
    await page.waitForTimeout(2000);
    
    const statusElement = await page.locator('.font-mono').first();
    const initialStatus = await statusElement.textContent();
    console.log('Initial session status:', initialStatus);
    
    if (initialStatus?.includes('Logged in as:')) {
      console.log('User is logged in, testing normal sign-out...');
      
      // Try normal sign-out
      await page.click('button:has-text("Sign Out (Normal)")');
      await page.waitForTimeout(3000);
      
      const afterSignOut = await statusElement.textContent();
      console.log('After normal sign-out:', afterSignOut);
      
      // Check session again
      await page.click('button:has-text("Check Current Session")');
      await page.waitForTimeout(2000);
      
      const finalStatus = await statusElement.textContent();
      console.log('Final session status:', finalStatus);
      
      if (finalStatus?.includes('Logged in as:')) {
        console.log('Normal sign-out failed! User is still logged in.');
        
        // Try force sign-out
        console.log('Attempting force sign-out...');
        await page.click('button:has-text("Force Sign Out")');
        await page.waitForTimeout(3000);
        
        const afterForceSignOut = await statusElement.textContent();
        console.log('After force sign-out:', afterForceSignOut);
      } else {
        console.log('Normal sign-out successful!');
      }
    } else {
      console.log('No active session found');
    }
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/signout-test-result.png', fullPage: true });
    console.log('Screenshot saved to tests/screenshots/signout-test-result.png');
  });
  
  test('Test login page OAuth buttons', async ({ page }) => {
    console.log('\n=== Testing login page OAuth buttons ===');
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
    
    // Check for OAuth buttons
    const googleButton = page.locator('button:has-text("Continue with Google")');
    const twitterButton = page.locator('button:has-text("Continue with X")');
    
    const hasGoogleButton = await googleButton.isVisible();
    const hasTwitterButton = await twitterButton.isVisible();
    
    console.log('Google OAuth button visible:', hasGoogleButton);
    console.log('X/Twitter OAuth button visible:', hasTwitterButton);
    
    if (hasGoogleButton) {
      // Get the button's click handler info
      const googleButtonInfo = await googleButton.evaluate((el: any) => {
        return {
          disabled: el.disabled,
          className: el.className,
          onclick: el.onclick ? 'has onclick' : 'no onclick'
        };
      });
      console.log('Google button info:', googleButtonInfo);
    }
    
    if (hasTwitterButton) {
      const twitterButtonInfo = await twitterButton.evaluate((el: any) => {
        return {
          disabled: el.disabled,
          className: el.className,
          onclick: el.onclick ? 'has onclick' : 'no onclick'
        };
      });
      console.log('X/Twitter button info:', twitterButtonInfo);
    }
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/login-page-oauth.png', fullPage: true });
    console.log('Screenshot saved to tests/screenshots/login-page-oauth.png');
  });
});