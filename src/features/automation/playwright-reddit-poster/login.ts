import { Page } from "playwright";
import { RedditPostingContext } from "./context";
import { waitForAppLoad } from "./navigation";
import { emitProgress } from "./progress";
import { LOGIN_SELECTOR } from "./selectors";
import { saveSession } from "./session";

export const checkLoginStatus = async (page: Page): Promise<boolean> => {
  try {
    await page.waitForSelector("shreddit-app", { timeout: 5000, state: "attached" });
    const loggedInElement = await page.$(LOGIN_SELECTOR);
    return !!loggedInElement;
  } catch {
    return false;
  }
};

export const handleLogin = async (context: RedditPostingContext): Promise<void> => {
  const isLoggedIn = await checkLoginStatus(context.page);
  if (isLoggedIn) {
    return;
  }

  await waitForAppLoad(context.page);

  emitProgress({
    stage: "logging_in",
    message: "Please log in to Reddit in the browser window that opened...",
  });

  await context.page.waitForSelector(LOGIN_SELECTOR, { timeout: 0 });

  await saveSession(context);
};
