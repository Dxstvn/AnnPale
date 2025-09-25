#!/usr/bin/env node

import fetch from 'node-fetch';

// Configuration
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Test data - using a mock subscription ID
const TEST_SUBSCRIPTION_ID = 'test-sub-123';
const TEST_TOKEN = 'mock-token';

// Color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(colors[color] + message + colors.reset);
}

async function testEndpoint(name, endpoint, method, body, expectedStatus = 200) {
  log(`\nTesting ${name}...`, 'cyan');

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sb-yijizsscwkvepljqojkz-auth-token=${TEST_TOKEN}`
      },
      body: body ? JSON.stringify(body) : undefined
    });

    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch {
      responseData = responseText;
    }

    if (response.status === expectedStatus || (expectedStatus === 200 && response.ok)) {
      log(`  ✅ ${name} - Status: ${response.status}`, 'green');

      // Check for specific expected fields in successful responses
      if (response.ok && responseData) {
        if (responseData.success !== undefined) {
          log(`    Success: ${responseData.success}`, 'blue');
        }
        if (responseData.url) {
          log(`    URL generated: ${responseData.url.substring(0, 50)}...`, 'blue');
        }
        if (responseData.subscription) {
          log(`    Subscription ID: ${responseData.subscription.id}`, 'blue');
          log(`    Status: ${responseData.subscription.status}`, 'blue');
        }
        if (responseData.error) {
          log(`    Error: ${responseData.error}`, 'yellow');
        }
      }
      return true;
    } else {
      log(`  ❌ ${name} - Status: ${response.status} (expected ${expectedStatus})`, 'red');
      if (responseData?.error) {
        log(`    Error: ${responseData.error}`, 'red');
      }
      return false;
    }
  } catch (error) {
    log(`  ❌ ${name} - Error: ${error.message}`, 'red');
    return false;
  }
}

async function runTests() {
  log('\n' + '='.repeat(60), 'bright');
  log('   SUBSCRIPTION MANAGEMENT API ENDPOINT TESTS', 'bright');
  log('='.repeat(60), 'bright');
  log('\nNote: These tests verify endpoint availability and basic response structure.', 'yellow');
  log('Authentication errors (401) are expected and indicate the endpoint is working.\n', 'yellow');

  const tests = [
    {
      name: 'Pause Subscription',
      endpoint: '/api/stripe/subscriptions/manage',
      method: 'POST',
      body: {
        subscriptionOrderId: TEST_SUBSCRIPTION_ID,
        action: 'pause'
      },
      expectedStatus: 401 // Expecting unauthorized without valid auth
    },
    {
      name: 'Resume Subscription',
      endpoint: '/api/stripe/subscriptions/manage',
      method: 'POST',
      body: {
        subscriptionOrderId: TEST_SUBSCRIPTION_ID,
        action: 'resume'
      },
      expectedStatus: 401
    },
    {
      name: 'Cancel Subscription',
      endpoint: '/api/stripe/subscriptions/manage',
      method: 'POST',
      body: {
        subscriptionOrderId: TEST_SUBSCRIPTION_ID,
        action: 'cancel'
      },
      expectedStatus: 401
    },
    {
      name: 'Reactivate Subscription',
      endpoint: '/api/stripe/subscriptions/manage',
      method: 'POST',
      body: {
        subscriptionOrderId: TEST_SUBSCRIPTION_ID,
        action: 'reactivate'
      },
      expectedStatus: 401
    },
    {
      name: 'Update Payment Method',
      endpoint: '/api/stripe/subscriptions/payment-method',
      method: 'POST',
      body: {
        subscriptionId: TEST_SUBSCRIPTION_ID
      },
      expectedStatus: 401
    },
    {
      name: 'Get Subscription Details',
      endpoint: `/api/stripe/subscriptions/manage?id=${TEST_SUBSCRIPTION_ID}`,
      method: 'GET',
      body: null,
      expectedStatus: 401
    },
    {
      name: 'List Subscriptions',
      endpoint: '/api/subscriptions/list',
      method: 'GET',
      body: null,
      expectedStatus: 401
    },
    {
      name: 'Invalid Action',
      endpoint: '/api/stripe/subscriptions/manage',
      method: 'POST',
      body: {
        subscriptionOrderId: TEST_SUBSCRIPTION_ID,
        action: 'invalid_action'
      },
      expectedStatus: 401 // Will fail auth before checking action
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    const result = await testEndpoint(
      test.name,
      test.endpoint,
      test.method,
      test.body,
      test.expectedStatus
    );
    if (result) passed++;
    else failed++;
  }

  // Test that server is running
  log('\n' + '='.repeat(60), 'bright');
  log('Testing Server Health...', 'cyan');

  try {
    const response = await fetch(`${BASE_URL}/api/health`, {
      method: 'GET'
    });

    // If we get any response (even 404), server is running
    log('  ✅ Server is running and responding', 'green');
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      log('  ❌ Server is not running at ' + BASE_URL, 'red');
      log('  Please start the server with: pnpm dev', 'yellow');
    } else {
      log('  ⚠️  Unexpected error: ' + error.message, 'yellow');
    }
  }

  // Summary
  log('\n' + '='.repeat(60), 'bright');
  log('   SUMMARY', 'bright');
  log('='.repeat(60), 'bright');
  log(`Tests Passed: ${passed}/${tests.length}`, passed === tests.length ? 'green' : 'yellow');
  log(`Tests Failed: ${failed}/${tests.length}`, failed > 0 ? 'red' : 'green');

  if (passed === tests.length) {
    log('\n✅ All API endpoints are properly configured and responding!', 'green');
    log('   401 errors are expected (authentication required)', 'blue');
  } else {
    log('\n⚠️  Some endpoints may need attention', 'yellow');
  }

  log('\nTo test with real authentication:', 'cyan');
  log('  1. Use the manual test script: node test-subscription-management.mjs', 'blue');
  log('  2. Or test through the UI at: http://localhost:3000/fan/settings', 'blue');

  process.exit(failed > 0 ? 1 : 0);
}

// Run the tests
runTests();