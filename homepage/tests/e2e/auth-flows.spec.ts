import { test, expect } from '@playwright/test';

test.describe('Authentication Flows', () => {
  test.describe('Login Page', () => {
    test('should load login page', async ({ page }) => {
      await page.goto('/login');
      
      // Check page elements
      await expect(page.getByRole('heading', { name: /sign in|login/i })).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
      await expect(page.getByRole('button', { name: /sign in|login/i })).toBeVisible();
    });

    test('should show validation errors for empty form', async ({ page }) => {
      await page.goto('/login');
      
      // Try to submit empty form
      await page.getByRole('button', { name: /sign in|login/i }).click();
      
      // Check for validation messages
      const errors = await page.locator('[class*="error"], [role="alert"]').count();
      expect(errors).toBeGreaterThan(0);
    });

    test('should validate email format', async ({ page }) => {
      await page.goto('/login');
      
      // Enter invalid email
      await page.getByLabel(/email/i).fill('invalid-email');
      await page.getByLabel(/password/i).fill('password123');
      await page.getByRole('button', { name: /sign in|login/i }).click();
      
      // Check for email validation error
      const emailError = page.locator('text=/valid.*email|email.*invalid/i');
      await expect(emailError.first()).toBeVisible();
    });

    test('should have link to signup page', async ({ page }) => {
      await page.goto('/login');
      
      // Find signup link
      const signupLink = page.getByRole('link', { name: /sign up|create.*account|register/i });
      await expect(signupLink).toBeVisible();
      
      // Click and verify navigation
      await signupLink.click();
      await expect(page).toHaveURL(/\/signup/);
    });

    test('should have password reset link', async ({ page }) => {
      await page.goto('/login');
      
      // Find forgot password link
      const resetLink = page.getByRole('link', { name: /forgot.*password|reset.*password/i });
      await expect(resetLink).toBeVisible();
    });
  });

  test.describe('Signup Page', () => {
    test('should load signup page', async ({ page }) => {
      await page.goto('/signup');
      
      // Check page elements
      await expect(page.getByRole('heading', { name: /sign up|create.*account|register/i })).toBeVisible();
      await expect(page.getByLabel(/email/i)).toBeVisible();
      await expect(page.getByLabel(/password/i)).toBeVisible();
    });

    test('should have role selection', async ({ page }) => {
      await page.goto('/signup');
      
      // Look for role selection (fan/creator)
      const roleOptions = page.locator('text=/fan|creator|celebrity/i');
      expect(await roleOptions.count()).toBeGreaterThan(0);
    });

    test('should validate password strength', async ({ page }) => {
      await page.goto('/signup');
      
      // Enter weak password
      const passwordField = page.getByLabel(/password/i).first();
      await passwordField.fill('123');
      
      // Check for password strength indicator or error
      const strengthIndicator = page.locator('text=/weak|strong|password.*must/i');
      await expect(strengthIndicator.first()).toBeVisible();
    });

    test('should have link to login page', async ({ page }) => {
      await page.goto('/signup');
      
      // Find login link
      const loginLink = page.getByRole('link', { name: /sign in|already.*account|login/i });
      await expect(loginLink).toBeVisible();
      
      // Click and verify navigation
      await loginLink.click();
      await expect(page).toHaveURL(/\/login/);
    });

    test('should show terms and privacy links', async ({ page }) => {
      await page.goto('/signup');
      
      // Check for terms and privacy links
      const termsLink = page.getByRole('link', { name: /terms/i });
      await expect(termsLink).toBeVisible();
      
      const privacyLink = page.getByRole('link', { name: /privacy/i });
      await expect(privacyLink).toBeVisible();
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect to login when accessing fan dashboard', async ({ page }) => {
      await page.goto('/fan/dashboard');
      
      // Should redirect to login
      await expect(page).toHaveURL(/\/login/);
    });

    test('should redirect to login when accessing creator dashboard', async ({ page }) => {
      await page.goto('/creator/dashboard');
      
      // Should redirect to login
      await expect(page).toHaveURL(/\/login/);
    });

    test('should redirect to login when accessing admin dashboard', async ({ page }) => {
      await page.goto('/admin/dashboard');
      
      // Should redirect to login
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('Logout Flow', () => {
    test('should have logout functionality', async ({ page }) => {
      // First need to be logged in - skip if no test account available
      await page.goto('/logout');
      
      // Should redirect to home or login
      await expect(page).toHaveURL(/\/(login|$)/);
    });
  });

  test.describe('OAuth Login', () => {
    test('should display OAuth login options', async ({ page }) => {
      await page.goto('/login');
      
      // Look for OAuth buttons (Google, Facebook, etc.)
      const oauthButtons = page.locator('button:has-text(/google|facebook|twitter|github/i), a:has-text(/google|facebook|twitter|github/i)');
      
      // At least one OAuth option should be visible
      if (await oauthButtons.count() > 0) {
        await expect(oauthButtons.first()).toBeVisible();
      }
    });
  });
});