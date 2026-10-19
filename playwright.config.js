import { defineConfig, devices } from '@playwright/test';
import { loadEnv } from 'vite';

const adminEnv = { ...loadEnv('development', process.cwd(), ''), ...process.env };

export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: 'http://127.0.0.1:4173', channel: 'chrome', trace: 'retain-on-failure',
    httpCredentials: { username: adminEnv.ADMIN_USERNAME || '', password: adminEnv.ADMIN_PASSWORD || '' },
  },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], deviceScaleFactor: 1, defaultBrowserType: 'chromium' } },
  ],
  webServer: { command: 'npm run dev -- --port 4173 --strictPort', url: 'http://127.0.0.1:4173', reuseExistingServer: !process.env.CI },
});
