const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  console.log('Navigating to admin dashboard...');
  await page.goto('http://localhost:3000/admin/dashboard');
  
  // Wait for the page to load
  await page.waitForTimeout(3000);
  
  // Take screenshot
  const timestamp = new Date().getTime();
  const screenshotPath = `./admin-dashboard-${timestamp}.png`;
  await page.screenshot({ path: screenshotPath, fullPage: true });
  console.log(`Screenshot saved to: ${screenshotPath}`);
  
  // Log what we see on the page
  const title = await page.title();
  console.log('Page title:', title);
  
  // Check if loading spinner is present
  const loadingSpinner = await page.locator('.animate-spin').count();
  if (loadingSpinner > 0) {
    console.log('⚠️ Loading spinner detected - page is stuck loading');
  }
  
  // Check if admin dashboard content is visible
  const dashboardContent = await page.locator('text="Admin Dashboard"').count();
  if (dashboardContent > 0) {
    console.log('✅ Admin Dashboard content is visible');
  } else {
    console.log('❌ Admin Dashboard content not found');
  }
  
  // Check for any error messages
  const errorMessages = await page.locator('text=/error|failed|unauthorized/i').count();
  if (errorMessages > 0) {
    console.log('⚠️ Error messages detected on page');
  }
  
  // Get the HTML of the main content area
  const mainContent = await page.locator('main').innerHTML().catch(() => 'No main element found');
  console.log('\nMain content HTML (first 500 chars):');
  console.log(mainContent.substring(0, 500));
  
  await browser.close();
})();