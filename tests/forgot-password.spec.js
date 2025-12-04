import { test, expect } from '@playwright/test';

test.describe('Saayam Forgot Password Page Tests', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('https://test-saayam.netlify.app/forgot-password');
  });

  // Group 1: Page Load and Elements
  test.describe('Page Load and Elements', () => {
    test('should load forgot password page with correct heading', async ({ page }) => {
      const heading = page.getByRole('heading', { name: 'Password Reset' });
      await expect(heading).toBeVisible();
    });

    test('should display email input and placeholder', async ({ page }) => {
      const emailInput = page.getByRole('textbox', { name: 'Email *' });
      await expect(emailInput).toBeVisible();

      const placeholder = await emailInput.getAttribute('placeholder');
      expect(placeholder).toBe('Your Email');
    });
  });

  // Group 2: Navigation Links
  test.describe('Navigation Links', () => {
    test('should handle Cancel button based on browser behavior', async ({ page }) => {
      const cancelBtn = page.getByRole('button', { name: 'Cancel' });
      await expect(cancelBtn).toBeVisible();
      await cancelBtn.click();

      // Get actual URL after clicking cancel
      const currentUrl = page.url();

      // Valid outcomes depending on browser
      const validOutcomes = [
        'https://test-saayam.netlify.app/forgot-password', // Firefox
        'about:blank'                                      // Chromium/WebKit
      ];

      expect(validOutcomes).toContain(currentUrl);
    });
  });

  // Group 3: Form Validation
  test.describe('Form Validation', () => {
    test('should show validation error for empty email', async ({ page }) => {
      const resetBtn = page.getByRole('button', { name: 'Reset' });
      await resetBtn.click();

      const emailInput = page.getByRole('textbox', { name: 'Email *' });
      const validationMessage = await emailInput.evaluate(el => el.validationMessage);

      expect(validationMessage).toBeTruthy();
    });
  });

  // Group 4: Core Functionality
  test.describe('Reset Flow', () => {
    test('should accept valid email and navigate to verify-account page', async ({ page }) => {
      const emailInput = page.getByRole('textbox', { name: 'Email *' });
      const resetBtn = page.getByRole('button', { name: 'Reset' });

      await emailInput.fill('test@example.com');
      await resetBtn.click();

      // App navigates to verify-account page
      await expect(page).toHaveURL('https://test-saayam.netlify.app/verify-account');

      // Success message appears on this page
      const successMessage = page.getByText(/reset|email|sent|verify/i);
      await expect(successMessage).toBeVisible({ timeout: 7000 });
    });
  });

});