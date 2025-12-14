// @ts-check
import { defineConfig, devices } from '@playwright/test';

// ----------------------
// Device groups
// ----------------------
const desktopProjects = [
  { name: 'chromium', device: 'Desktop Chrome' },
  { name: 'firefox', device: 'Desktop Firefox' },
  { name: 'webkit', device: 'Desktop Safari' },
];

const mobileProjects = [
  { name: 'MobileChrome', device: 'Pixel 5' },
  { name: 'MobileSafari', device: 'iPhone 12' },
];

// Branded browsers (solo si están instalados)
const brandedProjects = [
  { name: 'MicrosoftEdge', device: 'Desktop Edge', channel: 'msedge' },
  { name: 'GoogleChrome', device: 'Desktop Chrome', channel: 'chrome' },
];

// ----------------------
// Helpers
// ----------------------
const mapProjects = (projects) =>
  projects.map(({ name, device, channel }) => ({
    name,
    use: {
      ...devices[device],
      ...(channel ? { channel } : {}),
    },
  }));

// ----------------------
// Config
// ----------------------
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',

  use: {
    trace: 'on-first-retry',
    // baseURL: 'http://localhost:3000',
  },

  projects: [
    ...mapProjects(desktopProjects),
    ...mapProjects(mobileProjects),
    ...mapProjects(brandedProjects),

      {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /* Test against mobile viewports. */
    {
      name: 'MobileChrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'MobileSafari',
      use: { ...devices['iPhone 12'] },
    },
    /* Test against branded browsers. */
    {
      name: 'GoogleChrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' }, // or 'chrome-beta'
    },
    {
      name: 'MicrosoftEdge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' }, // or 'msedge-dev'
    },

    
  ]
});
