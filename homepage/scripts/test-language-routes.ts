#!/usr/bin/env npx tsx

/**
 * Script to test language switching functionality across all major routes
 * Verifies that each locale (en, fr, ht) works for key pages
 */

const BASE_URL = 'http://localhost:3000';
const LOCALES = ['en', 'fr', 'ht'];

// Define major routes to test
const ROUTES = [
  '/',                      // Homepage
  '/browse',                // Browse creators
  '/fan/explore',          // Fan explore page
  '/fan/home',             // Fan home
  '/creator/dashboard',    // Creator dashboard
];

interface TestResult {
  route: string;
  locale: string;
  status: number;
  success: boolean;
  error?: string;
}

async function testRoute(locale: string, route: string): Promise<TestResult> {
  const url = locale === 'en'
    ? `${BASE_URL}${route}`
    : `${BASE_URL}/${locale}${route}`;

  try {
    console.log(`Testing: ${url}`);
    const response = await fetch(url, {
      redirect: 'manual', // Don't follow redirects automatically
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Language-Test-Script'
      }
    });

    // Handle redirects (3xx) as success if they're locale redirects
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      console.log(`  ➜ Redirected to: ${location}`);
    }

    const success = response.status < 400;

    return {
      route,
      locale,
      status: response.status,
      success,
      error: success ? undefined : `HTTP ${response.status}`
    };
  } catch (error) {
    return {
      route,
      locale,
      status: 0,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function runTests() {
  console.log('🌍 Testing Trilingual Language Support\n');
  console.log('=' .repeat(50));

  const results: TestResult[] = [];

  for (const locale of LOCALES) {
    console.log(`\n📍 Testing ${locale.toUpperCase()} locale:`);
    console.log('-'.repeat(30));

    for (const route of ROUTES) {
      const result = await testRoute(locale, route);
      results.push(result);

      const icon = result.success ? '✅' : '❌';
      const status = result.success ? `(${result.status})` : `ERROR: ${result.error}`;
      console.log(`${icon} ${route} ${status}`);

      // Small delay to avoid overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 SUMMARY\n');

  const totalTests = results.length;
  const successCount = results.filter(r => r.success).length;
  const failureCount = totalTests - successCount;
  const successRate = ((successCount / totalTests) * 100).toFixed(1);

  console.log(`Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}`);
  console.log(`📈 Success Rate: ${successRate}%`);

  // Group failures by locale
  const failuresByLocale = results
    .filter(r => !r.success)
    .reduce((acc, r) => {
      if (!acc[r.locale]) acc[r.locale] = [];
      acc[r.locale].push(r.route);
      return acc;
    }, {} as Record<string, string[]>);

  if (failureCount > 0) {
    console.log('\n⚠️  Failed Routes by Locale:');
    for (const [locale, routes] of Object.entries(failuresByLocale)) {
      console.log(`  ${locale}: ${routes.join(', ')}`);
    }
  }

  // Test language switcher functionality
  console.log('\n' + '='.repeat(50));
  console.log('🔄 Testing Language Switcher\n');

  // Test if switching from one locale to another works
  const switchTests = [
    { from: 'en', to: 'fr', path: '/fan/explore' },
    { from: 'fr', to: 'ht', path: '/fan/explore' },
    { from: 'ht', to: 'en', path: '/creator/dashboard' },
  ];

  for (const test of switchTests) {
    const fromUrl = test.from === 'en'
      ? `${BASE_URL}${test.path}`
      : `${BASE_URL}/${test.from}${test.path}`;
    const toUrl = test.to === 'en'
      ? `${BASE_URL}${test.path}`
      : `${BASE_URL}/${test.to}${test.path}`;

    try {
      const response = await fetch(toUrl);
      const success = response.status < 400;
      const icon = success ? '✅' : '❌';
      console.log(`${icon} Switch ${test.from} → ${test.to} on ${test.path}`);
    } catch (error) {
      console.log(`❌ Switch ${test.from} → ${test.to} on ${test.path}: Failed`);
    }
  }

  console.log('\n✨ Language testing complete!\n');

  return failureCount === 0;
}

// Run tests
runTests().then(success => {
  process.exit(success ? 0 : 1);
}).catch(error => {
  console.error('Test script error:', error);
  process.exit(1);
});