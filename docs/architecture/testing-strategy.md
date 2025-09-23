# Testing Strategy

## Testing Approach

**Philosophy:** Focus on high-value tests that catch real bugs, avoid over-testing for a personal-use application.

**Testing Priorities:**

1. **E2E Tests (High Value)** - Test complete user workflows
2. **Backend Logic Tests (Medium Value)** - Test business logic and data operations
3. **Frontend Unit Tests (Low Priority)** - Only for complex utility functions, skip component testing

```
     E2E Tests (Playwright)
    /                     \
Backend Logic Tests       \
(Bun Test)                 \
                    Frontend Utils Tests
                    (Vitest - minimal)
```

## Test Organization

**Frontend Tests (@fanslib/apps/web/tests/) - Minimal:**

```
tests/
├── utils/               # Only complex utility functions
└── setup.ts             # Test setup and configuration
```

**Backend Tests (@fanslib/apps/server/tests/) - Focus on Business Logic:**

```
tests/
├── modules/             # Business logic tests (media operations, etc.)
├── utils/               # Utility function tests
└── setup.ts             # Test setup and configuration
```

**Why Skip Component and API Route Testing:**

- **Frontend Components:** Too much maintenance overhead for a personal app, React's built-in safety is sufficient
- **API Routes:** Testing business logic in modules is more valuable than testing HTTP layer plumbing

**E2E Tests (tests/e2e/):**

```
tests/e2e/
├── media-management.spec.ts    # Media browsing and organization
├── post-composition.spec.ts    # Post creation and editing
├── scheduling.spec.ts          # Content scheduling workflows
├── file-system-sync.spec.ts    # File system integration
└── fixtures/                   # Test data and fixtures
```

## Test Examples

**Backend Business Logic Test:**

```typescript
// @fanslib/apps/server/tests/modules/media/mediaOperations.test.ts
import { describe, it, expect, beforeEach } from "bun:test";
import {
  scanDirectory,
  assignMediaToShoot,
} from "../../../src/modules/media/mediaOperations";
import {
  setupTestDatabase,
  createTestMedia,
  createTestShoot,
} from "../../setup";

describe("Media Operations", () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });

  it("scans directory and extracts metadata correctly", async () => {
    const result = await scanDirectory("/test/media");

    expect(result).toHaveLength(3);
    expect(result[0]).toHaveProperty("filepath");
    expect(result[0]).toHaveProperty("contentHash");
    expect(result[0]).toHaveProperty("dimensions");
  });

  it("assigns media to shoot correctly", async () => {
    const mediaId = await createTestMedia();
    const shootId = await createTestShoot();

    const result = await assignMediaToShoot(mediaId, shootId);

    expect(result.shootId).toBe(shootId);
  });
});
```

**E2E Test:**

```typescript
// tests/e2e/media-management.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Media Management", () => {
  test("user can browse and filter media", async ({ page }) => {
    await page.goto("/media");

    // Wait for media to load
    await expect(page.locator('[data-testid="media-grid"]')).toBeVisible();

    // Apply filter
    await page.selectOption('[data-testid="shoot-filter"]', "test-shoot-1");
    await page.click('[data-testid="apply-filters"]');

    // Verify filtered results
    const mediaCards = page.locator('[data-testid="media-card"]');
    await expect(mediaCards).toHaveCount(5);

    // Verify all items belong to selected shoot
    const shootBadges = page.locator('[data-testid="shoot-badge"]');
    for (let i = 0; i < (await shootBadges.count()); i++) {
      await expect(shootBadges.nth(i)).toHaveText("test-shoot-1");
    }
  });

  test("user can assign media to shoot", async ({ page }) => {
    await page.goto("/media");

    // Select media item
    await page.click('[data-testid="media-card"]:first-child');
    await page.click('[data-testid="assign-to-shoot"]');

    // Choose shoot in modal
    await expect(
      page.locator('[data-testid="shoot-assignment-modal"]')
    ).toBeVisible();
    await page.selectOption('[data-testid="shoot-select"]', "new-shoot-id");
    await page.click('[data-testid="confirm-assignment"]');

    // Verify assignment
    await expect(page.locator('[data-testid="success-toast"]')).toBeVisible();
    await expect(
      page.locator('[data-testid="shoot-badge"]').first()
    ).toHaveText("New Shoot");
  });
});
```

## Test Configuration

**Vitest Configuration (@fanslib/apps/web/vitest.config.ts):**

```typescript
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.ts"],
    globals: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: ["node_modules/", "tests/"],
    },
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
```

**Playwright Configuration (playwright.config.ts):**

```typescript
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    baseURL: "http://localhost:3001",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: "bun run dev",
    url: "http://localhost:3001",
    reuseExistingServer: !process.env.CI,
  },
});
```
