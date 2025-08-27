import { test as base, expect } from '@playwright/test';
import path from 'path';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

// Define test account types
export interface TestAccount {
  email: string;
  password: string;
  role: 'fan' | 'creator' | 'admin';
}

// Test accounts configuration
export const testAccounts: Record<string, TestAccount> = {
  fan: {
    email: process.env.TEST_FAN_EMAIL || 'e2e.fan@annpale.test',
    password: process.env.TEST_FAN_PASSWORD || 'E2EFan123!Secure',
    role: 'fan'
  },
  creator: {
    email: process.env.TEST_CREATOR_EMAIL || 'e2e.creator@annpale.test',
    password: process.env.TEST_CREATOR_PASSWORD || 'E2ECreator123!Secure',
    role: 'creator'
  },
  admin: {
    email: process.env.TEST_ADMIN_EMAIL || 'e2e.admin@annpale.test',
    password: process.env.TEST_ADMIN_PASSWORD || 'E2EAdmin123!Secure',
    role: 'admin'
  }
};

// Extend base test with authentication fixtures
export const test = base.extend<{
  authenticatedPage: any;
  userRole: 'fan' | 'creator' | 'admin' | null;
}>({
  userRole: [null, { option: true }],
  
  authenticatedPage: async ({ page, userRole }, use) => {
    if (userRole) {
      // Get auth file path for the specific role
      const authFile = path.join('tests', '.auth', `${userRole}.json`);
      
      // Check if auth state exists, if not, create it
      const fs = require('fs');
      if (!fs.existsSync(authFile)) {
        await setupAuth(page, userRole);
      }
      
      // Load the stored authentication state
      await page.context().storageState({ path: authFile });
    }
    
    await use(page);
  }
});

// Helper function to perform login and save auth state
export async function setupAuth(page: any, role: 'fan' | 'creator' | 'admin') {
  const account = testAccounts[role];
  
  // Navigate to login page
  await page.goto('/login');
  
  // Fill in login form
  await page.fill('input[type="email"]', account.email);
  await page.fill('input[type="password"]', account.password);
  
  // Submit form
  await page.click('button[type="submit"]');
  
  // Wait for successful redirect based on role
  const expectedPath = role === 'admin' ? '/admin/dashboard' : 
                       role === 'creator' ? '/creator/dashboard' : 
                       '/fan/dashboard';
  
  await page.waitForURL(`**${expectedPath}`, { timeout: 10000 });
  
  // Save authentication state
  const authFile = path.join('tests', '.auth', `${role}.json`);
  await page.context().storageState({ path: authFile });
}

// Helper function to clear all auth states
export async function clearAuthStates() {
  const fs = require('fs');
  const authDir = path.join('tests', '.auth');
  
  if (fs.existsSync(authDir)) {
    const files = fs.readdirSync(authDir);
    files.forEach((file: string) => {
      if (file.endsWith('.json')) {
        fs.unlinkSync(path.join(authDir, file));
      }
    });
  }
}

// Mock auth provider for testing isolated components
export class MockAuthProvider {
  private currentUser: TestAccount | null = null;
  
  login(role: 'fan' | 'creator' | 'admin') {
    this.currentUser = testAccounts[role];
    return this.currentUser;
  }
  
  logout() {
    this.currentUser = null;
  }
  
  getCurrentUser() {
    return this.currentUser;
  }
  
  isAuthenticated() {
    return this.currentUser !== null;
  }
  
  hasRole(role: string) {
    return this.currentUser?.role === role;
  }
}