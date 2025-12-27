import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  test: {
    environment: "jsdom",
    include: [
      "tests/unit/**/*.spec.{ts,tsx}",
      "src/**/__tests__/**/*.spec.{ts,tsx}",
    ],
    exclude: [
      "tests/visual/**",
      "tests/admin/**",
      "tests/place-ad-smoke.spec.ts",
      "tests/admin-redirect.spec.ts",
    ],
    globals: true,
  },
});
