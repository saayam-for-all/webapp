// Basic Test Structure
// test.describe('Page Name Tests')           # Main container
// ├── test.describe('Feature Group 1')      # Logical grouping
// │   ├── test('specific test case 1')      # Individual test
// │   └── test('specific test case 2')      # Individual test
// ├── test.describe('Feature Group 2')      # Another grouping
// │   ├── test('specific test case 3')      # Individual test
// │   └── test('specific test case 4')      # Individual test
// └── test.beforeEach()                     # Setup for each test


// Test Structure for Login Page
// Group 1: Page Load and Elements
// test.describe 'Page Load and Elements'
// // Tests that verify page loads correctly
// // Tests that verify UI elements are present
// // Tests that verify text content is correct
// Purpose: Verify the page renders correctly and all expected elements are visible.

// Group 2: Navigation Links
// test,describe 'Navigation Links'
// // Tests that verify links work correctly
// // Tests that verify navigation happens
// // Tests that verify correct pages load
// Purpose: Verify all navigation functionality works as expected.

// Group 3: Form Validation test.describe 'Form Validation'
// // Tests that verify validation messages
// Purpose: Verify form validation and error handling work correctly.

// Group 4: Core Functionality
// test.describe 'Login Functionality'
// // Tests that verify main business logic
// // Tests that verify success scenarios
// // Tests that verify integration works
// Purpose: Verify the main business functionality works end-to-end.


import { test, expect } from '@playwright/test';
import { loginTestData } from './login-data';

test.describe('Saayam Login Page Tests', () => {
const { validCredentials, invalidCredentials } = loginTestData;

test.beforeEach(async ({ page }) => {
    await page.goto('https://test-saayam.netlify.app/login');
  });

  test.describe('Page Load and Elements', () => {
    test('should load login page with correct heading', async ({ page }) => {
      // Verify page loads and heading is correct
      await expect(page.getByRole('heading', { name: 'Log In' })).toBeVisible();
      
      const heading = page.getByRole('heading', { name: 'Log In' });
      await expect(heading).toBeVisible();
      
      const headingText = await heading.textContent();
      expect(headingText?.trim()).toBe('Log In');
    });

    test('should display email label and placeholder correctly', async ({ page }) => {
      // Verify email label
      const emailLabel = page.getByText('Email');
      await expect(emailLabel).toBeVisible();
      
      const emailLabelText = await emailLabel.textContent();
      expect(emailLabelText).toBe('Email');
      
      // Verify email placeholder
      const emailInput = page.getByRole('textbox', { name: 'Email' });
      await expect(emailInput).toBeVisible();
      
      const emailPlaceholder = await emailInput.getAttribute('placeholder');
      expect(emailPlaceholder).toBe('Email');
    });

    test('should display password label and placeholder correctly', async ({ page }) => {
      // Verify password label
      const passwordLabel = page.getByText('Password', { exact: true });
      await expect(passwordLabel).toBeVisible();
      
      const passwordLabelText = await passwordLabel.textContent();
      expect(passwordLabelText).toBe('Password');
      
      // Verify password placeholder
      const passwordInput = page.getByRole('textbox', { name: 'Password' });
      await expect(passwordInput).toBeVisible();
      
      const passwordPlaceholder = await passwordInput.getAttribute('placeholder');
      expect(passwordPlaceholder).toBe('Password');
    });
  });

  test.describe('Navigation Links', () => {
    test('should navigate to forgot password page', async ({ page }) => {
      const forgotPasswordLink = page.getByRole('button', { name: 'Forgot Password?' });
      await expect(forgotPasswordLink).toBeVisible();
      await forgotPasswordLink.click();
      
      // Verify navigation
      await expect(page).toHaveURL(/.*forgot-password.*/);
      const currentUrl = page.url();
      expect(currentUrl.toLowerCase()).toContain('/forgot-password');
    });

    test('should navigate to signup page', async ({ page }) => {
      const signupLink = page.getByRole('button', { name: 'Sign Up' });
      await expect(signupLink).toBeVisible();
      await signupLink.click();
      
      // Verify navigation
      await expect(page).toHaveURL(/.*signup.*/);
      const currentUrl = page.url();
      expect(currentUrl.toLowerCase()).toContain('/signup');
    });
  });

  test.describe('Form Validation', () => {
    test('should show error messages for empty fields', async ({ page }) => {
      // Click login button without filling fields
      const loginButton = page.getByRole('button', { name: 'Log In' })
      await expect(loginButton).toBeVisible();
      await loginButton.click();
      
      // Wait for validation errors to appear
      await page.waitForTimeout(1000);
      
      // Check for HTML5 validation messages
      const emailInput = page.getByRole('textbox', { name: 'Email' });
      const passwordInput = page.getByRole('textbox', { name: 'Password' });
      
      const emailValidationMessage = await emailInput.evaluate((el) => el.validationMessage);
      const passwordValidationMessage = await passwordInput.evaluate((el) => el.validationMessage);
      
      // Verify validation messages appear
      expect(emailValidationMessage).toBeTruthy();
      expect(passwordValidationMessage).toBeTruthy();
    });

  });

  test.describe('Login Functionality', () => {
    
    test('should show error message for invalid credentials', async ({ page }) => {
      // Fill in invalid credentials
      const emailInput = page.getByRole('textbox', { name: 'Email' });
      const passwordInput = page.getByRole('textbox', { name: 'Password' });
      const loginButton = page.getByRole('button', { name: 'Log In' });
      
      await emailInput.fill(invalidCredentials.email);
      await passwordInput.fill(invalidCredentials.password);
      await loginButton.click();
      
      // Wait for error message to appear
      await page.waitForTimeout(3000);
      
      // Check for login error message
      const loginError = page.locator('.error, .alert-error, [class*="error"]').filter({ hasText: /invalid|incorrect|wrong/i });
      
      if (await loginError.count() > 0) {
        const errorText = await loginError.first().textContent();
        expect(errorText).toContain('Invalid email or password');
      } else {
        // Alternative: Check if we're still on login page (indicating failed login)
        const currentUrl = page.url();
        expect(currentUrl).toContain('/login');
      }
    });

    test('should successfully login with valid credentials', async ({ page }) => {

        const emailInput = page.getByRole('textbox', { name: 'Email' });
        const passwordInput = page.getByRole('textbox', { name: 'Password' });
        const loginButton = page.getByRole('button', { name: 'Log In' });
        
        await emailInput.fill(validCredentials.email);
        await passwordInput.fill(validCredentials.password);
        await loginButton.click();
      
      // Wait for navigation to dashboard (up to 60 seconds)
      await page.waitForURL(/.*dashboard.*/, { timeout: 60000 });
      
      // Verify successful login by checking URL
      const currentUrl = page.url();
      expect(currentUrl.toLowerCase()).toContain('/dashboard');
    });
  });
});