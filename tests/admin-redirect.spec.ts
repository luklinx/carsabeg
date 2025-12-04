import { test, expect } from "@playwright/test";

test("unauthenticated /admin redirects to /admin/login", async ({
  page,
  baseURL,
}) => {
  // Ensure baseURL is configured (playwright.config.ts sets default to http://localhost:3000)
  const url = (baseURL ?? "http://localhost:3000") + "/admin";
  await page.goto(url, { waitUntil: "networkidle" });

  // Expect to land on the login page
  expect(page.url()).toContain("/admin/login");
});
