import { test, expect } from "@playwright/test";

const CAR_ID = "replace-with-valid-car-id";

test("book inspection modal opens/closes and emits no console errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("console", (msg) => {
    if (msg.type() === "error") {
      errors.push(msg.text());
    }
  });

  await page.route("/api/inspections/book", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, booking: { id: "test-booking" } }),
    });
  });

  await page.goto(`/car/${CAR_ID}`);

  const bookBtn = page
    .getByRole("button", { name: /Book Inspection/i })
    .first();
  await bookBtn.click();

  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();

  // Close then re-open to ensure hooks are stable across open/close
  await modal.getByRole("button", { name: /Cancel/i }).click();
  await expect(modal).toBeHidden();

  await bookBtn.click();
  await expect(modal).toBeVisible();

  await modal.getByLabel("Full name").fill("Test User");
  await modal.getByLabel("Phone").fill("08030000000");
  await modal.getByLabel("Preferred date/time").fill("2025-12-28 10:00");

  await modal.getByRole("button", { name: /Book/i }).click();

  await expect(page.locator("text=Booking confirmed")).toBeVisible();

  // Assert no console errors were emitted
  expect(errors, `Console errors found: ${errors.join("\n")}`).toEqual([]);
});
