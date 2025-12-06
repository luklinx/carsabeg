import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const consoleMessages = [];
  const networkRequests = [];

  page.on("console", (msg) => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text(),
      location: msg.location(),
    });
  });

  page.on("response", (response) => {
    if (response.url().includes("_next") || response.url().includes(".css")) {
      networkRequests.push({
        url: response.url(),
        status: response.status(),
        headers: response.headers(),
      });
    }
  });

  try {
    await page.goto("http://localhost:3000", { waitUntil: "networkidle" });

    const html = await page.content();
    const linkTags = html.match(/<link[^>]*>/g) || [];
    const styleTags = html.match(/<style[^>]*>/g) || [];

    console.log("=== CSS LINK TAGS ===");
    linkTags.forEach((tag) => console.log(tag));

    console.log("\n=== STYLE TAGS ===");
    styleTags.forEach((tag) => console.log(tag.substring(0, 200)));

    console.log("\n=== CONSOLE MESSAGES ===");
    consoleMessages.forEach((msg) => {
      console.log(`[${msg.type}] ${msg.text}`);
    });

    console.log("\n=== NETWORK REQUESTS (CSS/NEXT) ===");
    networkRequests.forEach((req) => {
      console.log(`${req.url} -> ${req.status}`);
      if (req.status !== 200) {
        console.log(`  Headers: ${JSON.stringify(req.headers, null, 2)}`);
      }
    });

    await page.close();
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    await browser.close();
  }
})();
