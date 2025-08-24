const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Enable console logging
  page.on('console', msg => {
    console.log('Browser console:', msg.text());
  });
  
  console.log('Opening admin dashboard (assuming you are already logged in)...');
  await page.goto('http://localhost:3000/admin/dashboard');
  
  // Wait a bit for React to hydrate
  await page.waitForTimeout(3000);
  
  // Take screenshot
  const timestamp = new Date().getTime();
  const screenshotPath = `./admin-logged-in-${timestamp}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log('Screenshot saved to:', screenshotPath);
  
  // Check what's visible
  const hasLoadingSpinner = await page.locator('.animate-spin').count() > 0;
  const hasAdminDashboard = await page.locator('text="Admin Dashboard"').count() > 0;
  const hasTotalUsers = await page.locator('text="Total Users"').count() > 0;
  
  console.log('\nPage Status:');
  console.log('Loading spinner present:', hasLoadingSpinner);
  console.log('Admin Dashboard title visible:', hasAdminDashboard);
  console.log('Total Users card visible:', hasTotalUsers);
  
  // Get the HTML of the main content
  const bodyHTML = await page.locator('body').innerHTML();
  
  // Check if there's a loading message
  if (bodyHTML.includes('Verifying access') || bodyHTML.includes('Loading')) {
    console.log('\nPage is stuck showing loading message');
  }
  
  // Log any errors in console
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  
  if (errors.length > 0) {
    console.log('\nPage errors:', errors);
  }
  
  console.log('\nWaiting 5 more seconds to see if content loads...');
  await page.waitForTimeout(5000);
  
  // Check again
  const hasLoadingSpinnerAfter = await page.locator('.animate-spin').count() > 0;
  const hasAdminDashboardAfter = await page.locator('text="Admin Dashboard"').count() > 0;
  
  console.log('\nAfter waiting:');
  console.log('Loading spinner still present:', hasLoadingSpinnerAfter);
  console.log('Admin Dashboard title visible:', hasAdminDashboardAfter);
  
  // Take final screenshot
  const finalScreenshotPath = `./admin-final-${timestamp}.png`;
  await page.screenshot({ path: finalScreenshotPath, fullPage: true });
  console.log('\nFinal screenshot saved to:', finalScreenshotPath);
  
  await browser.close();
})();