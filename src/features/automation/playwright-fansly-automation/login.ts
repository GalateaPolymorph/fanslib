import type { Page } from "playwright";

export const handleAgeRestrictionModal = async (page: Page): Promise<void> => {
  try {
    console.log("[Fansly Automation] Checking for age restriction modal");
    const enterButton = page.getByText("Enter", { exact: true });
    const isVisible = await enterButton.isVisible({ timeout: 3000 });

    if (!isVisible) {
      console.log("[Fansly Automation] No age restriction modal found");
      return;
    }

    console.log("[Fansly Automation] Handling age restriction modal");
    await enterButton.click();
    await enterButton.waitFor({ state: "hidden", timeout: 5000 });
    console.log("[Fansly Automation] Age restriction modal dismissed");
  } catch {
    console.log("[Fansly Automation] No age restriction modal found");
  }
};

const avatarSelector = ".user-account.sm-mobile-hidden > .avatar-container";

export const waitForPushNotificationModalOrAvatar = async (page: Page): Promise<void> => {
  const dismissButton = page.getByText("Maybe later").first();
  const accountAvatar = page.locator(avatarSelector).first();
  await Promise.race([
    dismissButton.waitFor({ state: "visible", timeout: 600000 }), // 10 minutes
    accountAvatar.waitFor({ state: "visible", timeout: 600000 }),
  ]);
};

export const handlePushNotificationModal = async (page: Page): Promise<void> => {
  try {
    console.log("[Fansly Automation] Checking for push notification modal");
    const dismissButton = page.getByText("Maybe later").first();
    const isVisible = await dismissButton.isVisible({ timeout: 3000 });

    if (!isVisible) {
      console.log("[Fansly Automation] No push notification modal found");
      return;
    }

    console.log("[Fansly Automation] Handling push notification modal");
    await dismissButton.click();
    await dismissButton.waitFor({ state: "hidden", timeout: 5000 });
    console.log("[Fansly Automation] Push notification modal dismissed");
  } catch {
    console.log("[Fansly Automation] No push notification modal found");
  }
};

export const navigateToFansly = async (page: Page): Promise<void> => {
  console.log("[Fansly Automation] Navigating to Fansly");
  await page.goto("https://fansly.com/", {
    waitUntil: "networkidle",
    timeout: 30000,
  });
};

export const checkIfLoggedIn = async (page: Page): Promise<boolean> => {
  try {
    console.log("[Fansly Automation] Checking if logged in");
    const accountAvatar = page.locator(avatarSelector).first();
    await accountAvatar.waitFor({ timeout: 5000 });
    console.log("[Fansly Automation] Logged in");
    return true;
  } catch {
    console.log("[Fansly Automation] Not logged in");
    return false;
  }
};

export const performLogin = async (
  page: Page
): Promise<{ success: boolean; requiresManualAuth?: boolean }> => {
  console.log("[Fansly Automation] Performing login");
  try {
    if (await checkIfLoggedIn(page)) {
      console.log("[Fansly Automation] Already logged in");
      return { success: true };
    }

    try {
      console.log("[Fansly Automation] Waiting for manual login");
      await waitForPushNotificationModalOrAvatar(page);
      console.log("[Fansly Automation] Manual login completed");
      return { success: true };
    } catch {
      return { success: false, requiresManualAuth: true };
    }
  } catch (error) {
    console.error("[Fansly Automation] Login error:", error);
    return { success: false, requiresManualAuth: true };
  }
};
