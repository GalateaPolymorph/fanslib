import { chromium } from "playwright";
import { BrowserConfig, SessionStorage } from "../types/config";
import { RedditPostingContext } from "../types/context";

export const closeBrowserIfOpened = async (context: RedditPostingContext | null): Promise<void> => {
  if (!context) {
    return;
  }

  if (context.browserContext) {
    await context.browserContext.close();
    context.browserContext = null;
  }

  if (context.browser) {
    await context.browser.close();
    context.browser = null;
  }
};

export const initializeBrowser = async (
  sessionStorage?: SessionStorage,
  browserConfig: BrowserConfig = {}
): Promise<RedditPostingContext> => {
  const { headless = false, timeout = 180000, userDataDir } = browserConfig;

  const browser = await chromium.launch({
    headless,
    timeout,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-blink-features=AutomationControlled",
      ...(userDataDir ? [`--user-data-dir=${userDataDir}`] : []),
    ],
  });

  let storageState: string | undefined;

  try {
    if (sessionStorage && (await sessionStorage.exists())) {
      const sessionPath = sessionStorage.getPath();
      storageState = sessionPath;
      console.log(`[Reddit Automation] Loading session from: ${sessionPath}`);
    }
  } catch (error) {
    console.warn(`[Reddit Automation] Failed to load session:`, error);
  }

  const browserContext = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    viewport: { width: 1920, height: 1080 },
    locale: "de-DE",
    timezoneId: "Europe/Berlin",
    storageState,
    javaScriptEnabled: true,
  });

  await browserContext.route("**/*", (route) => {
    const resourceType = route.request().resourceType();
    const url = route.request().url();

    // Only block large media files and some images, but keep CSS and essential resources
    if (
      resourceType === "image" &&
      (url.includes(".jpg") ||
        url.includes(".jpeg") ||
        url.includes(".png") ||
        url.includes(".gif") ||
        url.includes(".webp")) &&
      !url.includes("icon") &&
      !url.includes("logo") &&
      !url.includes("avatar")
    ) {
      route.abort();
    } else if (resourceType === "media" || resourceType === "font") {
      route.abort();
    } else {
      route.continue();
    }
  });

  const page = await browserContext.newPage();

  return {
    browser,
    page,
    browserContext,
  };
};

export const saveSession = async (
  context: RedditPostingContext,
  sessionStorage?: SessionStorage
): Promise<void> => {
  if (!context.browserContext || !sessionStorage) {
    return;
  }

  try {
    const sessionPath = sessionStorage.getPath();
    await context.browserContext.storageState({ path: sessionPath });
    console.log(`[Reddit Automation] Session saved to: ${sessionPath}`);
  } catch (error) {
    console.error(`[Reddit Automation] Failed to save session:`, error);
  }
};
