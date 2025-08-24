import { test, expect } from '@playwright/test';

test.describe('OAuth Flow Testing', () => {
  test('Simulate Google OAuth flow and debug callback', async ({ page, context }) => {
    console.log('=== Starting Google OAuth flow simulation ===\n');
    
    // Set up console and network logging
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('auth') || text.includes('session') || text.includes('error') || text.includes('callback')) {
        console.log(`[Browser]: ${text}`);
      }
    });
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('auth') || url.includes('supabase') || url.includes('google')) {
        console.log(`[Request ${request.method()}]: ${url}`);
      }
    });
    
    page.on('response', response => {
      const url = response.url();
      if (url.includes('auth') || url.includes('supabase') || url.includes('google')) {
        console.log(`[Response ${response.status()}]: ${url}`);
      }
    });
    
    // Navigate to login page
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
    console.log('Loaded login page\n');
    
    // Find the Google OAuth button
    const googleButton = page.locator('button:has-text("Google")').first();
    const buttonExists = await googleButton.isVisible();
    
    if (!buttonExists) {
      console.log('ERROR: Google button not found!');
      return;
    }
    
    console.log('Found Google OAuth button\n');
    
    // Set up to catch the OAuth redirect
    const navigationPromise = page.waitForNavigation({ 
      url: /accounts\.google\.com|supabase\.co\/auth/,
      waitUntil: 'domcontentloaded' 
    }).catch(() => null);
    
    // Also listen for any popups
    const popupPromise = page.waitForEvent('popup', { timeout: 5000 }).catch(() => null);
    
    // Click the Google button
    console.log('Clicking Google OAuth button...\n');
    await googleButton.click();
    
    // Wait for either navigation or popup
    const [navigation, popup] = await Promise.all([navigationPromise, popupPromise]);
    
    if (popup) {
      console.log('OAuth opened in popup window');
      console.log('Popup URL:', popup.url());
      
      // Don't actually complete OAuth, just check the URL
      const popupUrl = popup.url();
      if (popupUrl.includes('accounts.google.com')) {
        console.log('✓ Successfully redirected to Google OAuth\n');
      } else if (popupUrl.includes('supabase.co/auth')) {
        console.log('✓ Redirected through Supabase auth endpoint\n');
      }
      
      await popup.close();
    } else if (navigation) {
      console.log('Page navigated to:', page.url());
      
      // Check if we were redirected to Google
      if (page.url().includes('accounts.google.com')) {
        console.log('✓ Successfully redirected to Google OAuth\n');
      } else if (page.url().includes('supabase.co/auth')) {
        console.log('✓ Redirected through Supabase auth endpoint\n');
      }
      
      // Go back to avoid actual login
      await page.goBack();
    } else {
      console.log('No navigation or popup detected after clicking OAuth button');
      console.log('Current URL:', page.url());
      
      // Check if there was any error on the page
      const errorElement = await page.locator('[class*="error"], [class*="Error"]').first();
      if (await errorElement.isVisible()) {
        const errorText = await errorElement.textContent();
        console.log('Error on page:', errorText);
      }
    }
    
    // Take a screenshot of the final state
    await page.screenshot({ path: 'tests/screenshots/oauth-click-result.png', fullPage: true });
    console.log('\nScreenshot saved to tests/screenshots/oauth-click-result.png');
  });
  
  test('Test callback page with mock OAuth code', async ({ page }) => {
    console.log('=== Testing callback with mock code ===\n');
    
    // Set up console logging
    page.on('console', msg => {
      console.log(`[Browser]: ${msg.text()}`);
    });
    
    // Navigate to callback with a mock code
    const mockCode = 'mock_auth_code_12345';
    console.log(`Navigating to callback with code: ${mockCode}\n`);
    
    await page.goto(`http://localhost:3000/auth/callback?code=${mockCode}`, { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    // Wait for processing
    await page.waitForTimeout(5000);
    
    // Check final URL
    const finalUrl = page.url();
    console.log('Final URL after callback:', finalUrl);
    
    // Check page content
    const pageContent = await page.evaluate(() => {
      const errorElement = document.querySelector('[class*="error"], [class*="Error"]');
      const successElement = document.querySelector('[class*="success"], [class*="Success"]');
      const loaderElement = document.querySelector('[class*="animate-spin"], [class*="loading"]');
      
      return {
        hasError: !!errorElement,
        errorText: errorElement?.textContent,
        hasSuccess: !!successElement,
        successText: successElement?.textContent,
        hasLoader: !!loaderElement,
        pageTitle: document.title,
        bodyText: document.body.innerText.substring(0, 500)
      };
    });
    
    console.log('\nPage state after callback:');
    console.log(JSON.stringify(pageContent, null, 2));
    
    // Take screenshot
    await page.screenshot({ path: 'tests/screenshots/callback-with-code.png', fullPage: true });
    console.log('\nScreenshot saved to tests/screenshots/callback-with-code.png');
  });
  
  test('Check Supabase auth configuration', async ({ page }) => {
    console.log('=== Checking Supabase configuration ===\n');
    
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle' });
    
    // Check Supabase client configuration
    const supabaseConfig = await page.evaluate(async () => {
      try {
        // Get the Supabase client
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        
        // Try to get the auth session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        // Get auth URL
        const { data: authUrlData } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            skipBrowserRedirect: true
          }
        });
        
        return {
          hasSession: !!session,
          sessionError: error?.message,
          authUrl: authUrlData?.url,
          supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
          origin: window.location.origin
        };
      } catch (err: any) {
        return { error: err.message };
      }
    });
    
    console.log('Supabase configuration:');
    console.log(JSON.stringify(supabaseConfig, null, 2));
    
    if (supabaseConfig.authUrl) {
      console.log('\n✓ Supabase OAuth URL generated successfully');
      
      // Parse the auth URL to check configuration
      try {
        const url = new URL(supabaseConfig.authUrl);
        console.log('\nOAuth URL components:');
        console.log('- Host:', url.host);
        console.log('- Provider:', url.searchParams.get('provider'));
        console.log('- Redirect URI:', url.searchParams.get('redirect_to'));
      } catch (err) {
        console.log('Could not parse auth URL');
      }
    }
  });
});