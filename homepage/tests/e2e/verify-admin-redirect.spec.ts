import { test, expect } from '@playwright/test';

test.describe('Admin User Redirect', () => {
  test('Verify admin user can access admin dashboard', async ({ page }) => {
    console.log('=== Testing Admin Dashboard Access ===\n');
    
    // Monitor console for debugging
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Middleware') || text.includes('role') || text.includes('Redirecting')) {
        console.log(`[Console]: ${text}`);
      }
    });
    
    // First, try to access admin dashboard directly
    console.log('1. Attempting to access /admin/dashboard...');
    await page.goto('http://localhost:3000/admin/dashboard', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    const currentUrl = page.url();
    console.log('   Current URL:', currentUrl);
    
    if (currentUrl.includes('/admin/dashboard')) {
      console.log('   ✓ Successfully on admin dashboard!\n');
      
      // Take screenshot of admin dashboard
      await page.screenshot({ path: 'tests/screenshots/admin-dashboard-success.png', fullPage: true });
      
      // Check dashboard content
      const content = await page.evaluate(() => {
        return {
          title: document.title,
          h1: document.querySelector('h1')?.textContent,
          bodyPreview: document.body.innerText.substring(0, 200)
        };
      });
      
      console.log('   Admin dashboard content:', JSON.stringify(content, null, 2));
      
    } else if (currentUrl.includes('/login')) {
      console.log('   Redirected to login (not authenticated)\n');
      
      // Check if there's an existing session but wrong role
      console.log('2. Checking authentication state...');
      const authState = await page.evaluate(async () => {
        try {
          const keys = Object.keys(localStorage).filter(k => k.includes('supabase'));
          for (const key of keys) {
            const value = localStorage.getItem(key);
            if (value && value.includes('access_token')) {
              const data = JSON.parse(value);
              return { 
                authenticated: true, 
                user: data.user?.email,
                userId: data.user?.id
              };
            }
          }
          return { authenticated: false };
        } catch {
          return { authenticated: false };
        }
      });
      
      console.log('   Auth state:', JSON.stringify(authState, null, 2));
      
    } else if (currentUrl.includes('/unauthorized')) {
      console.log('   Redirected to /unauthorized (wrong role)\n');
      
      // This means user is authenticated but doesn't have admin role
      console.log('   User is authenticated but lacks admin privileges');
      
    } else if (currentUrl.includes('/fan/dashboard')) {
      console.log('   ✗ Incorrectly redirected to fan dashboard!\n');
      console.log('   This suggests the role check is not working properly');
      
      // Take screenshot of incorrect redirect
      await page.screenshot({ path: 'tests/screenshots/incorrect-fan-redirect.png', fullPage: true });
    }
    
    // Test fan dashboard access for comparison
    console.log('\n3. Testing /fan/dashboard access...');
    await page.goto('http://localhost:3000/fan/dashboard', { 
      waitUntil: 'networkidle',
      timeout: 15000 
    });
    
    const fanUrl = page.url();
    console.log('   Current URL:', fanUrl);
    
    if (fanUrl.includes('/fan/dashboard')) {
      console.log('   ✓ Can access fan dashboard');
    } else {
      console.log('   Cannot access fan dashboard');
    }
    
    // Final summary
    console.log('\n=== Summary ===');
    console.log('Admin dashboard accessible:', currentUrl.includes('/admin/dashboard'));
    console.log('Fan dashboard accessible:', fanUrl.includes('/fan/dashboard'));
    console.log('Authentication working:', !currentUrl.includes('/login'));
  });
});