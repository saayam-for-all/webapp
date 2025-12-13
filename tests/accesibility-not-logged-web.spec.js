import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright'; // 1

test.describe('homepage', () => { // 2
  test('should not have any automatically detectable accessibility issues on home page', async ({ page }) => {
    await page.goto('https://test-saayam.netlify.app/'); // 3

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); // 4

    expect(accessibilityScanResults.violations).toEqual([]); // 5
  });
    test('should not have any automatically detectable accessibility issues on our team page', async ({ page }) => {
    await page.goto('https://test-saayam.netlify.app/our-team'); // 3

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); // 4

    expect(accessibilityScanResults.violations).toEqual([]); // 5
  });
    test('should not have any automatically detectable accessibility issues on our mission page', async ({ page }) => {
    await page.goto('https://test-saayam.netlify.app/our-mission'); // 3

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); // 4

    expect(accessibilityScanResults.violations).toEqual([]); // 5
  });
    test('should not have any automatically detectable accessibility issues on how we operate page', async ({ page }) => {
    await page.goto('https://test-saayam.netlify.app/how-we-operate'); // 3

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); // 4

    expect(accessibilityScanResults.violations).toEqual([]); // 5
  });
    test('should not have any automatically detectable accessibility issues on collaborators page', async ({ page }) => {
    await page.goto('https://test-saayam.netlify.app/collaborators'); // 3

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); // 4

    expect(accessibilityScanResults.violations).toEqual([]); // 5
  });
    test('should not have any automatically detectable accessibility issues on contact page', async ({ page }) => {
    await page.goto('https://test-saayam.netlify.app/contact'); // 3

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); // 4

    expect(accessibilityScanResults.violations).toEqual([]); // 5
  });

      test('should not have any automatically detectable accessibility issues on donate page', async ({ page }) => {
    await page.goto('https://test-saayam.netlify.app/donate'); // 3

    const accessibilityScanResults = await new AxeBuilder({ page }).analyze(); // 4

    expect(accessibilityScanResults.violations).toEqual([]); // 5
  });
});