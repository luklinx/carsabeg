import { test, expect } from "@playwright/test";

const CAR_ID = "replace-with-valid-car-id";

test("book inspection flow (UI) - submits to /api/inspections/book", async ({
  page,
}) => {
  await page.route("/api/inspections/book", (route) => {
    // return a fake success response
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ ok: true, booking: { id: "test-booking" } }),
    });
  });

  // Route slots endpoint to return a couple of options (one booked, one open)
  await page.route("/api/inspections/slots?carId=*", (route) => {
    const now = new Date();
    const open = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000); // +2 days
    const booked = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // +3 days
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        slots: [
          {
            id: "slot-open",
            start_at: open.toISOString(),
            end_at: new Date(open.getTime() + 30 * 60000).toISOString(),
            capacity: 1,
            booked: 0,
            available: true,
          },
          {
            id: "slot-booked",
            start_at: booked.toISOString(),
            end_at: new Date(booked.getTime() + 30 * 60000).toISOString(),
            capacity: 1,
            booked: 1,
            available: false,
          },
        ],
      }),
    });
  });

  await page.goto(`/car/${CAR_ID}`);

  // Click Book Inspection button (may be in SellerCard)
  const bookBtn = page
    .getByRole("button", { name: /Book Inspection/i })
    .first();
  await bookBtn.click();

  // Modal should appear
  const modal = page.getByRole("dialog");
  await expect(modal).toBeVisible();

  await modal.getByLabel("Full name").fill("Test User");
  await modal.getByLabel("Phone").fill("08030000000");

  // Choose the open slot
  await modal.locator("text=Open").first().click();

  await modal.getByRole("button", { name: /Book/i }).click();

  // Expect confirmation message
  await expect(page.locator("text=Booking confirmed")).toBeVisible();
});
