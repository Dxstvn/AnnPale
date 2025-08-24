const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('🔍 Testing Admin Dashboard Authentication Flow...\n');
  
  // Navigate to admin dashboard
  console.log('1. Navigating to admin dashboard...');
  await page.goto('http://localhost:3000/admin/dashboard');
  
  // Wait for page to load
  await page.waitForTimeout(2000);
  
  // Check the current URL (might redirect)
  const currentUrl = page.url();
  console.log('   Current URL:', currentUrl);
  
  // Take initial screenshot
  const timestamp = new Date().getTime();
  const screenshotPath = `./admin-dashboard-test-${timestamp}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('   Screenshot saved to:', screenshotPath);
  
  // Check what's on the page
  console.log('\n2. Checking page content...');
  
  // Check for loading spinner
  const loadingSpinner = await page.locator('.animate-spin').count();
  if (loadingSpinner > 0) {
    console.log('   ⏳ Loading spinner detected');
    
    // Wait for content to load (max 10 seconds)
    try {
      await page.waitForSelector('text="Admin Dashboard"', { timeout: 10000 });
      console.log('   ✅ Admin Dashboard content loaded!');
    } catch (e) {
      console.log('   ❌ Admin Dashboard content did not load within 10 seconds');
    }
  }
  
  // Check for admin dashboard elements
  const hasAdminTitle = await page.locator('h1:has-text("Admin Dashboard")').count() > 0;
  const hasStatsCards = await page.locator('text="Total Users"').count() > 0;
  const hasCreatorsCard = await page.locator('text="Active Creators"').count() > 0;
  const hasRevenueCard = await page.locator('text="Revenue"').count() > 0;
  const hasTabs = await page.locator('text="Overview"').count() > 0;
  
  console.log('\n3. Dashboard Elements Check:');
  console.log('   Admin Dashboard Title:', hasAdminTitle ? '✅ Present' : '❌ Missing');
  console.log('   Total Users Card:', hasStatsCards ? '✅ Present' : '❌ Missing');
  console.log('   Active Creators Card:', hasCreatorsCard ? '✅ Present' : '❌ Missing');
  console.log('   Revenue Card:', hasRevenueCard ? '✅ Present' : '❌ Missing');
  console.log('   Navigation Tabs:', hasTabs ? '✅ Present' : '❌ Missing');
  
  // Check for any error messages
  const errorMessages = await page.locator('text=/error|failed|unauthorized/i').count();
  if (errorMessages > 0) {
    console.log('\n   ⚠️ Error messages detected on page');
  }
  
  // Check for redirect to login
  if (currentUrl.includes('/login')) {
    console.log('\n   ⚠️ Page redirected to login - user not authenticated');
  }
  
  // Take final screenshot after waiting
  await page.waitForTimeout(2000);
  const finalScreenshotPath = `./admin-dashboard-final-${timestamp}.png`;
  await page.screenshot({ path: finalScreenshotPath, fullPage: true });
  console.log('\n4. Final screenshot saved to:', finalScreenshotPath);
  
  // Get console logs from the page
  page.on('console', msg => {
    if (msg.type() === 'log' && (msg.text().includes('Auth') || msg.text().includes('Profile'))) {
      console.log('   Browser console:', msg.text());
    }
  });
  
  // Summary
  const allElementsPresent = hasAdminTitle && hasStatsCards && hasCreatorsCard && hasRevenueCard && hasTabs;
  console.log('\n📊 Test Summary:');
  if (allElementsPresent) {
    console.log('   ✅ SUCCESS: Admin Dashboard loaded completely!');
  } else if (currentUrl.includes('/login')) {
    console.log('   ❌ FAILED: User not authenticated (redirected to login)');
  } else if (loadingSpinner > 0 && !hasAdminTitle) {
    console.log('   ❌ FAILED: Page stuck in loading state');
  } else {
    console.log('   ⚠️ PARTIAL: Some elements are missing');
  }
  
  console.log('\n💡 Tip: Check the screenshots to see the actual page state');
  console.log('   Initial:', screenshotPath);
  console.log('   Final:', finalScreenshotPath);
  
  await browser.close();
})();