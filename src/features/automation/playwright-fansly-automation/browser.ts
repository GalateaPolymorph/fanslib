import { chromium } from "playwright";
import path from "path";
import { app } from "electron";
import type { FanslyAutomationContext, FanslyAutomationOptions } from "./context";

const DEFAULT_BROWSER_OPTIONS = {
  headless: false, // Keep visible for user interaction during 2FA
  timeout: 180000, // 3 minutes
  args: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-blink-features=AutomationControlled",
    "--disable-extensions-except",
    "--disable-extensions",
    "--disable-default-apps",
    "--disable-web-security",
    "--disable-features=TranslateUI",
    "--disable-ipc-flooding-protection",
  ],
};

const DEFAULT_CONTEXT_OPTIONS = {
  userAgent:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  viewport: { width: 1920, height: 1080 },
  locale: "de-DE",
  timezoneId: "Europe/Berlin",
  colorScheme: "dark" as const,
  acceptDownloads: false,
  javaScriptEnabled: true,
  extraHTTPHeaders: {
    "Accept-Language": "de-DE,de;q=0.9",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-User": "?1",
    "Sec-Fetch-Dest": "document",
  },
};

export const getUserDataDir = (): string => {
  const userDataPath = app.getPath("userData");
  return path.join(userDataPath, "fansly-browser-data");
};

export const getSessionFilePath = (): string => {
  const userDataDir = getUserDataDir();
  return path.join(userDataDir, "fansly-session.json");
};

export const createBrowserContext = async (
  options: FanslyAutomationOptions = {}
): Promise<FanslyAutomationContext> => {
  const userDataDir = options.userDataDir || getUserDataDir();
  const sessionPath = getSessionFilePath();

  // Ensure the session directory exists
  try {
    const { promises: fs } = await import("fs");
    await fs.mkdir(path.dirname(sessionPath), { recursive: true });
  } catch (error) {
    console.warn("[Fansly Automation] Could not create session directory:", error);
  }

  // Set debug mode environment variable if debug is enabled
  if (options.debug) {
    process.env.PWDEBUG = "1";
    console.log("[Fansly Automation] 🔍 Debug mode enabled");
    console.log("[Fansly Automation] 📋 Playwright Inspector will open");
    console.log("[Fansly Automation] 🎥 Video recording enabled");
    console.log("[Fansly Automation] ⏱️  Actions slowed down to 500ms");
    console.log("[Fansly Automation] 🛠️  Use the inspector to step through actions");
  }

  // Launch browser with anti-detection measures
  const browser = await chromium.launch({
    ...DEFAULT_BROWSER_OPTIONS,
    headless: options.debug ? false : (options.headless ?? DEFAULT_BROWSER_OPTIONS.headless),
    timeout: options.timeout ?? DEFAULT_BROWSER_OPTIONS.timeout,
    slowMo: options.debug ? 500 : 0, // Slow down actions in debug mode
  });

  // Create context with session persistence
  let storageState: string | undefined;
  try {
    // Try to load existing session if it exists
    const { promises: fs } = await import("fs");
    await fs.access(sessionPath);
    storageState = sessionPath;
  } catch {
    console.log("[Fansly Automation] No existing session found, starting fresh");
  }

  const browserContext = await browser.newContext({
    ...DEFAULT_CONTEXT_OPTIONS,
    storageState: storageState,
    recordVideo: options.debug ? { dir: path.join(userDataDir, "videos") } : undefined,
  });

  // Block unnecessary resources to improve performance
  await browserContext.route("**/*", (route) => {
    const resourceType = route.request().resourceType();
    const url = route.request().url();

    // Block tracking, ads, and heavy media
    if (
      resourceType === "font" ||
      resourceType === "media" ||
      url.includes("analytics") ||
      url.includes("tracking") ||
      url.includes("ads") ||
      url.includes("doubleclick") ||
      url.includes("googletagmanager")
    ) {
      route.abort();
      return;
    }

    // Allow everything else
    route.continue();
  });

  // Create new page
  const page = await browserContext.newPage();

  // Add debug event listeners if in debug mode
  if (options.debug) {
    page.on('console', (msg) => {
      console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`);
    });
    
    page.on('pageerror', (error) => {
      console.error(`[Browser Error] ${error.message}`);
    });
    
    page.on('requestfailed', (request) => {
      console.warn(`[Request Failed] ${request.method()} ${request.url()}: ${request.failure()?.errorText}`);
    });
  }

  // Set up request interception for credential extraction
  await page.route("**/*", (route) => {
    if (options.debug) {
      console.log(`[Network] ${route.request().method()} ${route.request().url()}`);
    }
    route.continue();
  });

  return {
    browser,
    browserContext,
    page,
    userDataDir,
  };
};

export const closeBrowserIfOpened = async (
  context: FanslyAutomationContext | null
): Promise<void> => {
  if (!context) return;

  try {
    // Save session state before closing
    if (context.browserContext) {
      const sessionPath = getSessionFilePath();
      await context.browserContext.storageState({ path: sessionPath });
      console.log(`[Fansly Automation] Session saved to: ${sessionPath}`);
    }

    // Close browser
    if (context.browser && context.browser.isConnected()) {
      await context.browser.close();
      console.log("[Fansly Automation] Browser closed successfully");
    }
  } catch (error) {
    console.error("[Fansly Automation] Error closing browser:", error);
  }
};
