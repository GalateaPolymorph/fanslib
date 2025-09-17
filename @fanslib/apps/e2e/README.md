# @fanslib/e2e

End-to-end testing package for the FansLib application using Playwright.

## Overview

This package contains all end-to-end tests for the FansLib application. It tests the complete user journey across both the web application and server API to ensure everything works together correctly.

## Getting Started

### Prerequisites

- Bun runtime
- Playwright browsers installed

### Installation

Install Playwright browsers:

```bash
bun run install
```

### Running Tests

Run all tests:

```bash
bun run test
```

Run tests with browser UI:

```bash
bun run test:headed
```

Run tests with Playwright UI mode:

```bash
bun run test:ui
```

Debug tests:

```bash
bun run test:debug
```

View test report:

```bash
bun run report
```

## Test Structure

- `tests/` - Contains all test files
  - `example.spec.ts` - Basic application functionality tests
  - `infrastructure.spec.ts` - Infrastructure and API validation tests

## Configuration

The tests are configured to run against:

- **Web App**: `http://localhost:3000`
- **API Server**: `http://localhost:8000`

Both services are automatically started when running tests if they're not already running.

## Browser Support

Tests run across multiple browsers and devices:

- Desktop Chrome
- Desktop Firefox
- Desktop Safari (WebKit)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## CI/CD Integration

Tests are configured for CI environments with:

- Automatic retries on failure
- Reduced parallelism for stability
- HTML and JSON reporting
- Screenshots and videos on failure

## Writing Tests

When adding new tests:

1. Create new `.spec.ts` files in the `tests/` directory
2. Use descriptive test names and organize with `test.describe()` blocks
3. Follow the existing patterns for API and UI testing
4. Ensure tests are independent and can run in any order

## Troubleshooting

If tests fail:

1. Check that both web and server applications are running
2. Verify browser installations: `bun run install`
3. Review test reports: `bun run report`
4. Use debug mode to step through failing tests: `bun run test:debug`

## Dependencies

- `@playwright/test` - End-to-end testing framework
- `typescript` - TypeScript support
- `@types/node` - Node.js type definitions