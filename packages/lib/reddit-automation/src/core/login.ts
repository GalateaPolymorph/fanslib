import { Page } from "playwright";
import { SessionStorage } from "../types/config";
import { RedditPostingContext } from "../types/context";
import { RedditPostProgress } from "../types/progress";
import { saveSession } from "./browser";
import { waitForAppLoad } from "./navigation";
import { LOGIN_SELECTOR } from "./selectors";

export const checkLoginStatus = async (page: Page): Promise<boolean> => {
  try {
    await page.waitForSelector("shreddit-app", { timeout: 5000, state: "attached" });
    const loggedInElement = await page.$(LOGIN_SELECTOR);
    return !!loggedInElement;
  } catch {
    return false;
  }
};

export const handleLogin = async (
  context: RedditPostingContext,
  sessionStorage?: SessionStorage,
  onProgress?: (progress: RedditPostProgress) => void
): Promise<void> => {
  const isLoggedIn = await checkLoginStatus(context.page);
  if (isLoggedIn) {
    return;
  }

  await waitForAppLoad(context.page);

  onProgress?.({
    stage: "logging_in",
    message: "Please log in to Reddit in the browser window that opened...",
  });

  await context.page.waitForSelector(LOGIN_SELECTOR, { timeout: 0 });

  await saveSession(context, sessionStorage);
};
