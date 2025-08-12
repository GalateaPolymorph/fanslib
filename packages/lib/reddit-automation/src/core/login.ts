import { Page } from "playwright";
import { SessionStorage } from "../types/config";
import { RedditPostingContext } from "../types/context";
import { RedditPostProgress } from "../types/progress";
import { saveSession } from "./browser";
import { waitForAppLoad } from "./navigation";

export const checkLoginStatus = async (page: Page): Promise<boolean> => {
  await page.waitForSelector("shreddit-app", { timeout: 5000, state: "attached" });
  const isLoggedIn = await page.locator("shreddit-app").getAttribute("user-logged-in");
  if (isLoggedIn === "true") {
    console.log("Login detected via user-logged-in attribute");
    return true;
  }
  return false;
};

export const extractUsernameFromPage = async (page: Page): Promise<string | null> => {
  await page.waitForSelector("shreddit-app", { timeout: 5000, state: "attached" });
  const name = await page.locator("rs-current-user").getAttribute("display-name");
  return name;
};

export const waitForLoginCompletion = async (
  page: Page,
  onProgress?: (progress: RedditPostProgress) => void,
  timeout: number = 300000 // 5 minutes
): Promise<boolean> => {
  const startTime = Date.now();

  onProgress?.({
    stage: "logging_in",
    message: "Please log in to Reddit in the browser window. Waiting for login completion...",
  });

  while (Date.now() - startTime < timeout) {
    try {
      const isLoggedIn = await checkLoginStatus(page);

      if (isLoggedIn) {
        // Double-check by trying to extract username
        const username = await extractUsernameFromPage(page);

        if (username) {
          onProgress?.({
            stage: "logging_in",
            message: `Login successful! Detected user: u/${username}`,
          });
          return true;
        } else {
          onProgress?.({
            stage: "logging_in",
            message: "Login detected but verifying user information...",
          });
        }
      } else {
        // Still waiting for login
        onProgress?.({
          stage: "logging_in",
          message: "Please complete the login process in the browser window...",
        });
      }

      // Wait 2 seconds before checking again
      await page.waitForTimeout(2000);
    } catch (error) {
      console.warn("Error during login check:", error);
      await page.waitForTimeout(2000);
    }
  }

  return false;
};

export const handleLogin = async (
  context: RedditPostingContext,
  sessionStorage?: SessionStorage,
  onProgress?: (progress: RedditPostProgress) => void
): Promise<void> => {
  const isLoggedIn = await checkLoginStatus(context.page);
  if (isLoggedIn) {
    onProgress?.({
      stage: "logging_in",
      message: "Already logged in to Reddit",
    });
    return;
  }

  await waitForAppLoad(context.page);

  onProgress?.({
    stage: "logging_in",
    message: "Opening Reddit login page...",
  });

  // Wait for the user to complete login
  const loginSuccess = await waitForLoginCompletion(context.page, onProgress);

  if (!loginSuccess) {
    throw new Error("Login timeout: User did not complete login within the allowed time");
  }

  onProgress?.({
    stage: "logging_in",
    message: "Login completed successfully! Saving session...",
  });

  await saveSession(context, sessionStorage);
};
