# E2E Testing Documentation

## Overview

The end-to-end (e2e) tests have been moved from the root `tests/` directory to their own dedicated package under `@fanslib/apps/e2e`. This provides better organization, isolation, and maintainability for the testing infrastructure.

## Migration Summary

### What Changed

- **Old Location**: `tests/e2e/` in the project root
- **New Location**: `@fanslib/apps/e2e/` as a dedicated package
- **Configuration**: Moved from root `playwright.config.ts` to package-specific config
- **Dependencies**: Playwright dependencies moved from root to e2e package

### Benefits

1. **Better Organization**: E2E tests are now a separate, self-contained package
2. **Isolated Dependencies**: Playwright and testing dependencies don't pollute the root package
3. **Independent Versioning**: E2E package can have its own versioning and dependencies
4. **Clearer Responsibilities**: Testing infrastructure is clearly separated from application code
5. **Easier CI/CD**: Can run e2e tests independently or as part of the monorepo pipeline

## Package Structure

```
@fanslib/apps/e2e/
├── tests/                     # Test files
│   ├── example.spec.ts        # Basic functionality tests
│   └── infrastructure.spec.ts # API and infrastructure tests
├── playwright.config.ts       # Playwright configuration
├── package.json              # Package dependencies and scripts
├── tsconfig.json             # TypeScript configuration
├── .gitignore                # Git ignore rules for test artifacts
├── README.md                 # Package-specific documentation
└── run-tests.sh              # Convenience script for running tests
```

## Usage

### From Root Directory

```bash
# Run e2e tests
bun run test:e2e

# Run with browser UI visible
bun run test:e2e:headed

# Run with Playwright UI
bun run test:e2e:ui

# Install Playwright browsers
bun run install-browsers
```

### From E2E Package Directory

```bash
cd @fanslib/apps/e2e

# Run tests (various modes)
bun run test              # Headless
bun run test:headed       # With browser UI
bun run test:ui          # Playwright UI mode
bun run test:debug       # Debug mode

# View test reports
bun run report

# Install browsers
bun run install-browsers

# Use convenience script
./run-tests.sh           # Run tests
./run-tests.sh check     # Check service status
./run-tests.sh install   # Install browsers
```

## Configuration

### Service Dependencies

The e2e tests require both services to be running:

- **Web Application**: `http://localhost:3000`
- **API Server**: `http://localhost:8000`

Both services are automatically started by Playwright if not already running.

### Browser Support

Tests run across multiple browsers and devices:

- Desktop Chrome, Firefox, Safari (WebKit)
- Mobile Chrome (Pixel 5), Safari (iPhone 12)

### CI/CD Configuration

- Automatic retries on failure (2 retries in CI)
- Reduced parallelism for stability
- HTML and JSON reporting
- Screenshots and videos on failure
- Test artifacts saved to `test-results/` and `playwright-report/`

## Adding New Tests

1. Create new `.spec.ts` files in the `tests/` directory
2. Use descriptive names and organize with `test.describe()` blocks
3. Follow existing patterns for API and UI testing
4. Ensure tests are independent and can run in any order

Example test structure:

```typescript
import { expect, test } from "@playwright/test";

test.describe("Feature Name", () => {
  test("should do something specific", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toBeVisible();
  });

  test("should test API functionality", async ({ request }) => {
    const response = await request.get("/api/endpoint");
    expect(response.ok()).toBeTruthy();
  });
});
```

## Troubleshooting

### Common Issues

1. **Services Not Running**: Ensure both web app (port 3000) and API server (port 8000) are running
2. **Browser Installation**: Run `bun run install-browsers` if tests fail with browser errors
3. **Node.js Version**: Playwright requires Node.js 18+
4. **Port Conflicts**: Check that ports 3000 and 8000 are available

### Debug Commands

```bash
# Check service status
./run-tests.sh check

# Run in debug mode
bun run test:debug

# View detailed test report
bun run report

# Run specific test file
bun run test tests/specific-test.spec.ts
```

## Turbo Integration

The e2e package is fully integrated with the Turbo monorepo setup:

- Tests run as part of `turbo run test`
- Can be filtered with `--filter=@fanslib/e2e`
- Properly cached and parallelized
- Dependencies managed through workspace configuration

## Migration Notes

### For Developers

- Update any scripts or CI/CD pipelines that referenced the old `tests/e2e` path
- Use the new npm scripts for running e2e tests
- Playwright configuration is now in the e2e package, not the root

### For CI/CD

- Update build pipelines to use `bun run test:e2e` instead of direct Playwright commands
- Ensure both web and API services are available during e2e test runs
- Test artifacts are now in `@fanslib/apps/e2e/test-results/` and `@fanslib/apps/e2e/playwright-report/`
