import { test, expect } from '@playwright/test';

test.describe('Current Authentication State', () => {
  test('Check if authenticated user can access dashboard', async ({ page }) => {
    console.log('=== Testing Current Auth State ===\n');
    
    // Monitor console for middleware logs
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('[Middleware]') || text.includes('auth') || text.includes('session')) {
        console.log(text);
      }
    });
    
    // First, check if we can access the dashboard directly
    console.log('1. Attempting direct dashboard access...');
    await page.goto('http://localhost:3000/fan/dashboard', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    const currentUrl = page.url();
    console.log('   Current URL:', currentUrl);
    
    if (currentUrl.includes('/fan/dashboard')) {
      console.log('   ✓ Successfully on dashboard!\n');
      
      // Check dashboard content
      const dashboardContent = await page.evaluate(() => {
        return {
          title: document.title,
          h1: document.querySelector('h1')?.textContent,
          hasWelcome: document.body.innerText.includes('Welcome'),
          bodyPreview: document.body.innerText.substring(0, 200)
        };
      });
      
      console.log('   Dashboard content:', JSON.stringify(dashboardContent, null, 2));
      
      // Take screenshot of successful dashboard
      await page.screenshot({ path: 'tests/screenshots/dashboard-success.png', fullPage: true });
      
    } else if (currentUrl.includes('/login')) {
      console.log('   ✗ Redirected to login\n');
      
      // Check for error message
      const errorMsg = await page.locator('[role="alert"], .toast, [class*="error"]').first().textContent().catch(() => null);
      if (errorMsg) {
        console.log('   Error message:', errorMsg);
      }
      
      // Try to check cookies directly
      console.log('\n2. Checking cookies...');
      const cookies = await page.context().cookies();
      const supabaseCookies = cookies.filter(c => c.name.includes('supabase') || c.name.includes('sb-'));
      
      console.log('   Supabase cookies found:', supabaseCookies.length);
      supabaseCookies.forEach(cookie => {
        console.log(`   - ${cookie.name}: ${cookie.value.substring(0, 50)}...`);
      });
      
      // Take screenshot of login page
      await page.screenshot({ path: 'tests/screenshots/login-redirect.png', fullPage: true });
    }
    
    // Try to manually check authentication via browser console
    console.log('\n3. Checking authentication via browser console...');
    const authCheck = await page.evaluate(async () => {
      try {
        // Import Supabase client
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        
        // Get session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        // Get user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        return {
          hasSession: !!session,
          sessionError: sessionError?.message,
          sessionUser: session?.user?.email,
          hasUser: !!user,
          userError: userError?.message,
          userEmail: user?.email,
          userId: user?.id
        };
      } catch (error: any) {
        return { error: error.message };
      }
    });
    
    console.log('   Auth check result:', JSON.stringify(authCheck, null, 2));
    
    // If authenticated but can't access dashboard, try to force navigation
    if (authCheck.hasSession && !currentUrl.includes('/fan/dashboard')) {
      console.log('\n4. Session exists but dashboard not accessible. Attempting force navigation...');
      
      await page.evaluate(() => {
        window.location.href = '/fan/dashboard';
      });
      
      await page.waitForLoadState('networkidle');
      const newUrl = page.url();
      console.log('   After force navigation, URL:', newUrl);
      
      if (newUrl.includes('/fan/dashboard')) {
        console.log('   ✓ Force navigation successful!');
      } else {
        console.log('   ✗ Still redirected away from dashboard');
      }
    }
  });
});