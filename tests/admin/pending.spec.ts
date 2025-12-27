import { test, expect } from "@playwright/test";

const base = (baseURL: string | undefined) =>
  baseURL ?? "http://localhost:3000";

const makeCar = (id: string, title = "Car") => ({
  id,
  year: 2020,
  make: "Toyota",
  model: title,
  price: 1500000,
  images: ["/placeholder.jpg"],
  approved: false,
  status: "pending",
});

test.describe("admin pending page (test mount)", () => {
  test("approve single listing removes it from list and calls API", async ({
    page,
    baseURL,
  }) => {
    const baseUrl = base(baseURL);

    // stub pending list page=1
    await page.route("**/api/dashboard/cars/pending**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [makeCar("a", "One"), makeCar("b", "Two")],
          meta: { total: 2 },
        }),
      });
    });

    let approveCalled = false;
    await page.route("**/api/dashboard/cars/*/approve", (route) => {
      approveCalled = true;
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: { id: "a", status: "approved" } }),
      });
    });

    await page.goto(`${baseUrl}/test/admin-pending`, {
      waitUntil: "networkidle",
    });

    // Ensure list shows two rows
    await expect(page.locator("table tbody tr")).toHaveCount(2);

    // Click Approve for first row
    await page.click("text=Approve");

    // Confirm dialog is in-app; click OK
    await page.click("text=OK");

    // Prompt shows; just press Cancel/OK behavior—click OK to submit empty notes
    await page.click("text=OK");

    // Wait for success toast
    await page.waitForSelector("text=Approved", { timeout: 2000 });

    expect(approveCalled).toBeTruthy();

    // One row should be removed
    await expect(page.locator("table tbody tr")).toHaveCount(1);
  });

  test("bulk approve works and removes selected items", async ({
    page,
    baseURL,
  }) => {
    const baseUrl = base(baseURL);
    await page.route("**/api/dashboard/cars/pending**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          data: [makeCar("1"), makeCar("2"), makeCar("3")],
          meta: { total: 3 },
        }),
      });
    });

    let bulkCalled = false;
    await page.route("**/api/dashboard/cars/bulk", async (route) => {
      bulkCalled = true;
      const body = await route.request().postDataJSON();
      // Expect action approve and 2 ids
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ success: true, data: body.ids }),
      });
    });

    await page.goto(`${baseUrl}/test/admin-pending`, {
      waitUntil: "networkidle",
    });

    // Select all
    await page.check('label:has-text("Select all") input[type="checkbox"]');

    // Choose bulk approve
    await page.selectOption("select", "approve");

    // Click Apply
    await page.click("text=Apply");

    // Confirm
    await page.click("text=OK");

    // Wait for toast
    await page.waitForSelector("text=Bulk action completed", { timeout: 2000 });
    expect(bulkCalled).toBeTruthy();

    // List should be empty
    await expect(page.locator("table tbody tr")).toHaveCount(0);
  });

  test("pagination triggers page=2 request when Next clicked", async ({
    page,
    baseURL,
  }) => {
    const baseUrl = base(baseURL);

    // page 1 returns 51 items total=60 for PER_PAGE=50
    const firstPage = Array.from({ length: 50 }).map((_, i) =>
      makeCar(String(i), `C${i}`)
    );
    await page.route("**/api/dashboard/cars/pending?page=1**", (route) => {
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: firstPage, meta: { total: 60 } }),
      });
    });
    // page 2 returns last 10
    const secondPage = Array.from({ length: 10 }).map((_, i) =>
      makeCar(String(50 + i), `C${50 + i}`)
    );
    let page2Called = false;
    await page.route("**/api/dashboard/cars/pending?page=2**", (route) => {
      page2Called = true;
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ data: secondPage, meta: { total: 60 } }),
      });
    });

    await page.goto(`${baseUrl}/test/admin-pending`, {
      waitUntil: "networkidle",
    });

    // Click Next
    await page.click("text=Next");

    // Wait for page2 route to be called
    await page.waitForTimeout(200); // small wait for the network stub
    expect(page2Called).toBeTruthy();

    // Table now should show 10 rows
    await expect(page.locator("table tbody tr")).toHaveCount(10);
  });
});
