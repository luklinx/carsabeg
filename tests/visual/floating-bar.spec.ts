import { test, expect } from "@playwright/test";

// NOTE: These tests expect a running dev server (npm run dev) and a real car id available.
// Replace CAR_ID with a valid id in your environment before running, or seed a test car.
const CAR_ID = "replace-with-valid-car-id";

test.describe("Floating Car Bar", () => {
  test("appears when basic info scrolls out of view", async ({ page }) => {
    await page.goto(`/car/${CAR_ID}`);

    // Ensure the basic info block is visible initially
    const basicInfo = page.locator("#basic-info");
    await expect(basicInfo).toBeVisible();

    // The floating bar should start hidden
    const floating = page.locator('role=region[name="Car quick actions"]');
    await expect(floating).toBeHidden();

    // Scroll down past the basic info
    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight / 4 })
    );
    await page.waitForTimeout(400);

    // Floating bar should now be visible
    await expect(floating).toBeVisible();
  });
});
