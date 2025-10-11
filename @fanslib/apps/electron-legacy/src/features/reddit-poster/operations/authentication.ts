import { join } from "path";
import { app } from "electron";
import { createSessionStorage } from "../../server-communication/electron-session-storage";
import { storeSessionToServer } from "../../server-communication/session-manager";

export const performRedditLogin = async (_userId?: string): Promise<boolean> => {
  try {
    console.log("Starting Reddit login process...");

    // Import RedditLoginHandler
    const { RedditLoginHandler } = await import("@fanslib/reddit-automation");

    // Create session storage
    const sessionStorage = createSessionStorage();

    // Create login handler
    const loginHandler = new RedditLoginHandler({
      sessionStorage,
      browserOptions: {
        headless: false, // Must be visible for user to log in
        timeout: 300000, // 5 minutes timeout for login
        userDataDir: join(app.getPath("userData"), "reddit-browser-data"),
      },
      onProgress: (progress) => {
        console.log(`Reddit login progress: ${progress.stage} - ${progress.message}`);
      },
      loginTimeout: 300000, // 5 minutes
    });

    try {
      // Perform the login
      const result = await loginHandler.performLogin();

      if (result.success) {
        console.log(
          `Reddit login completed successfully${result.username ? ` for user: u/${result.username}` : ""}`
        );
        
        // After successful login, transfer session to server
        if (result.username) {
          try {
            // Read session data from local storage
            const sessionData = JSON.parse(await sessionStorage.read());
            await storeSessionToServer(sessionData, result.username);
            console.log(`✅ Session stored to server for u/${result.username}`);
          } catch (serverError) {
            console.warn("⚠️ Failed to store session to server:", serverError);
            // Don't fail the login because of server storage issues
          }
        }
        
        return true;
      } else {
        console.error("Reddit login failed:", result.error);
        return false;
      }
    } finally {
      // Always dispose of the handler
      await loginHandler.dispose();
    }
  } catch (error) {
    console.error("Reddit login failed:", error);
    return false;
  }
};

export const checkRedditLoginStatus = async (
  _userId?: string
): Promise<{ isLoggedIn: boolean; username?: string }> => {
  try {
    console.log("Checking Reddit login status...");

    // Import RedditLoginHandler
    const { RedditLoginHandler } = await import("@fanslib/reddit-automation");

    // Create session storage
    const sessionStorage = createSessionStorage();

    // Create login handler
    const loginHandler = new RedditLoginHandler({
      sessionStorage,
      browserOptions: {
        headless: true, // Headless for status checks
        timeout: 30000, // 30 seconds timeout for status check
        userDataDir: join(app.getPath("userData"), "reddit-browser-data"),
      },
      onProgress: (progress) => {
        console.log(`Reddit status check: ${progress.stage} - ${progress.message}`);
      },
    });

    try {
      // Check login status
      const result = await loginHandler.checkLoginStatus();

      if (result.success) {
        console.log(
          `Reddit login status: logged in${result.username ? ` as u/${result.username}` : ""}`
        );
        return {
          isLoggedIn: true,
          username: result.username,
        };
      } else {
        console.log("Reddit login status: not logged in");
        return {
          isLoggedIn: false,
        };
      }
    } finally {
      // Always dispose of the handler
      await loginHandler.dispose();
    }
  } catch (error) {
    console.error("Failed to check Reddit login status:", error);
    return {
      isLoggedIn: false,
    };
  }
};