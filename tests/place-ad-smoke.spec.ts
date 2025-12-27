import { test, expect } from '@playwright/test';

test('place-ad flow includes city/state in submit', async ({ page }) => {
  // Mock the image upload endpoint to return URLs
  await page.route('**/api/sell/upload', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ urls: ['https://example.com/img1.jpg'] }),
    })
  );

  // Capture submit payload
  let submitPayload: any = null;
  await page.route('**/api/sell/submit', async (route) => {
    try {
      submitPayload = await route.request().postDataJSON();
    } catch {
      submitPayload = null;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, data: { id: 'test-id' } }),
    });
  });

  // Start at the place-ad start page that forwards city -> /sell
  await page.goto('http://localhost:3000/place-ad/motors/used-cars/new');

  // Click the Create Listing button which navigates to /sell?city=...
  await page.click('text=Create Listing');
  await page.waitForURL('**/sell**');

  // Step 1
  await page.fill('input[name="year"]', '2018');
  // Try selecting make if available, otherwise ignore
  await page.selectOption('select[name="make"]', { label: 'Toyota' }).catch(() => undefined);
  await page.click('text=Continue');

  // Step 2
  await page.selectOption('select[name="transmission"]', 'automatic').catch(() => undefined);
  await page.fill('input[name="mileage"]', '50000');
  await page.click('text=Continue');

  // Step 3 - attach a small dummy file (intercepted on server)
  await page.setInputFiles('input[name="images"]', 'tests/fixtures/dummy.txt');
  await page.click('text=Continue');

  // Step 4 - required fields
  await page.fill('input[name="price"]', '1500000');
  await page.fill('input[name="dealer_name"]', 'Test Dealer');
  await page.fill('input[name="dealer_phone"]', '08061234567');
  await page.fill('input[name="location"]', 'Ikeja, Lagos');

  // Submit
  await page.click('text=Submit Listing');

  // Wait briefly for network handler to capture request
  await page.waitForTimeout(500);

  expect(submitPayload).not.toBeNull();
  const draft = submitPayload?.draft;
  expect(draft).toBeTruthy();

  // The place-ad page sets city via query param (default in UI is 'Dubai')
  expect(draft.city).toBe('Dubai');
});
