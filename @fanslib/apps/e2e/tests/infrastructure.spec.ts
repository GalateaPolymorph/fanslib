import { expect, test } from "@playwright/test";

test.describe("Infrastructure E2E Validation", () => {
  test("web application serves correctly", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("h1")).toContainText(
      "FansLib Content Management",
    );
  });

  test("server API endpoints respond correctly", async ({ request }) => {
    const healthResponse = await request.get("http://localhost:8000/health");
    expect(healthResponse.ok()).toBeTruthy();

    const healthData = await healthResponse.json();
    expect(healthData).toHaveProperty("status", "ok");
    expect(healthData).toHaveProperty("timestamp");

    const rootResponse = await request.get("http://localhost:8000/");
    expect(rootResponse.ok()).toBeTruthy();
  });

  test("swagger documentation is accessible", async ({ page }) => {
    await page.goto("http://localhost:8000/swagger");
    await expect(page.locator("text=FansLib API")).toBeVisible();
  });
});
