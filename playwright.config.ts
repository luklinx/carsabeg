import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests",
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  use: {
    // Change this if your dev server runs on a different port
    baseURL: process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000",
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
