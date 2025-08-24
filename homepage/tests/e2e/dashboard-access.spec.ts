import { test, expect } from '@playwright/test';

test.describe('Dashboard Access After Authentication', () => {
  test('Check if user can access fan dashboard', async ({ page }) => {
    console.log('=== Testing Dashboard Access ===\n');
    
    // Enable console logging
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('auth') || text.includes('session') || text.includes('dashboard') || text.includes('error')) {
        console.log(`[Browser]: ${text}`);
      }
    });
    
    // Monitor network requests
    page.on('response', response => {
      const url = response.url();
      if (url.includes('dashboard') || url.includes('auth') || url.includes('supabase')) {
        console.log(`[Response ${response.status()}]: ${url}`);
      }
    });
    
    // First, go to the fan dashboard directly
    console.log('Attempting to access fan dashboard directly...');
    const response = await page.goto('http://localhost:3000/fan/dashboard', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    });
    
    // Check where we ended up
    const currentUrl = page.url();
    console.log('Current URL:', currentUrl);
    console.log('Response status:', response?.status());
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/dashboard-direct-access.png', fullPage: true });
    
    // Check if we were redirected to login
    if (currentUrl.includes('/login')) {
      console.log('Redirected to login page - user not authenticated');
      
      // Check for any error messages
      const errorElement = await page.locator('[class*="error"], [class*="Error"], [role="alert"]').first();
      if (await errorElement.isVisible()) {
        const errorText = await errorElement.textContent();
        console.log('Error message:', errorText);
      }
    } else if (currentUrl.includes('/fan/dashboard')) {
      console.log('Successfully on fan dashboard!');
      
      // Check what's on the dashboard
      const pageContent = await page.evaluate(() => {
        return {
          title: document.title,
          h1: document.querySelector('h1')?.textContent,
          bodyText: document.body.innerText.substring(0, 500)
        };
      });
      
      console.log('Dashboard content:', JSON.stringify(pageContent, null, 2));
    } else {
      console.log('Unexpected redirect to:', currentUrl);
    }
    
    // Check authentication state via Supabase
    const authState = await page.evaluate(async () => {
      try {
        // Check localStorage for Supabase session
        const keys = Object.keys(localStorage);
        const supabaseKeys = keys.filter(key => key.includes('supabase'));
        
        let sessionData = null;
        for (const key of supabaseKeys) {
          const value = localStorage.getItem(key);
          if (value && value.includes('access_token')) {
            try {
              sessionData = JSON.parse(value);
              break;
            } catch {}
          }
        }
        
        return {
          hasSupabaseKeys: supabaseKeys.length > 0,
          supabaseKeys,
          hasSession: !!sessionData,
          sessionUser: sessionData?.user?.email
        };
      } catch (error: any) {
        return { error: error.message };
      }
    });
    
    console.log('\nAuthentication state:', JSON.stringify(authState, null, 2));
  });
  
  test('Check authentication flow from login to dashboard', async ({ page }) => {
    console.log('\n=== Testing Complete Authentication Flow ===\n');
    
    // Enable console logging
    page.on('console', msg => {
      console.log(`[Browser]: ${msg.text()}`);
    });
    
    // Start at login page
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
    console.log('On login page');
    
    // Check if already authenticated
    const authCheck = await page.evaluate(async () => {
      try {
        const keys = Object.keys(localStorage).filter(k => k.includes('supabase'));
        for (const key of keys) {
          const value = localStorage.getItem(key);
          if (value && value.includes('access_token')) {
            const data = JSON.parse(value);
            return { authenticated: true, user: data.user?.email };
          }
        }
        return { authenticated: false };
      } catch {
        return { authenticated: false };
      }
    });
    
    console.log('Initial auth check:', authCheck);
    
    if (authCheck.authenticated) {
      console.log('User already authenticated as:', authCheck.user);
      
      // Try to navigate to dashboard
      await page.goto('http://localhost:3000/fan/dashboard', { waitUntil: 'networkidle' });
      const finalUrl = page.url();
      
      console.log('After navigation, URL is:', finalUrl);
      
      if (finalUrl.includes('/fan/dashboard')) {
        console.log('✓ Successfully accessed dashboard while authenticated');
      } else {
        console.log('✗ Could not access dashboard despite being authenticated');
        console.log('Redirected to:', finalUrl);
      }
    } else {
      console.log('User not authenticated');
      
      // Check for OAuth buttons
      const googleButton = page.locator('button:has-text("Google")').first();
      const hasGoogleButton = await googleButton.isVisible();
      
      if (hasGoogleButton) {
        console.log('Google OAuth button is available');
        
        // Get the OAuth URL without actually clicking
        const oauthUrl = await page.evaluate(async () => {
          try {
            const { createClient } = await import('@/lib/supabase/client');
            const supabase = createClient();
            
            const { data } = await supabase.auth.signInWithOAuth({
              provider: 'google',
              options: {
                redirectTo: `${window.location.origin}/auth/callback`,
                skipBrowserRedirect: true
              }
            });
            
            return data?.url;
          } catch (error: any) {
            return { error: error.message };
          }
        });
        
        console.log('OAuth URL generated:', oauthUrl ? 'Success' : 'Failed');
      }
    }
    
    // Take final screenshot
    await page.screenshot({ path: 'tests/screenshots/auth-flow-final.png', fullPage: true });
  });
  
  test('Verify fan dashboard components and middleware', async ({ page }) => {
    console.log('\n=== Checking Dashboard Components ===\n');
    
    // Check if the dashboard page exists and loads
    const response = await page.goto('http://localhost:3000/fan/dashboard', {
      waitUntil: 'domcontentloaded',
      timeout: 10000
    });
    
    console.log('Response status:', response?.status());
    console.log('Response URL:', response?.url());
    
    // Check for any JavaScript errors
    page.on('pageerror', error => {
      console.log('Page error:', error.message);
    });
    
    // Wait a bit for any redirects
    await page.waitForTimeout(2000);
    
    const finalUrl = page.url();
    console.log('Final URL after redirects:', finalUrl);
    
    // Check page state
    const pageState = await page.evaluate(() => {
      return {
        url: window.location.href,
        pathname: window.location.pathname,
        title: document.title,
        hasError: document.body.innerText.toLowerCase().includes('error'),
        has404: document.body.innerText.includes('404'),
        bodyStart: document.body.innerText.substring(0, 200)
      };
    });
    
    console.log('\nPage state:', JSON.stringify(pageState, null, 2));
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/dashboard-component-check.png', fullPage: true });
    
    // Check console errors
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });
    
    if (consoleErrors.length > 0) {
      console.log('\nConsole errors found:');
      consoleErrors.forEach(err => console.log('  -', err));
    }
  });
});