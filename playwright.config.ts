import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/ui',
  use: { baseURL: 'http://127.0.0.1:5189', ...devices['Desktop Chrome'] },
  webServer: { command: 'npm exec vite -- --host 127.0.0.1 --port 5189 --strictPort', url: 'http://127.0.0.1:5189', timeout: 30_000, reuseExistingServer: false },
  reporter: 'list',
});
