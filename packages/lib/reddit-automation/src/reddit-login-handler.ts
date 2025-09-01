import { closeBrowserIfOpened, initializeBrowser, saveSession } from "./core/browser";
import { checkLoginStatus, extractUsernameFromPage, waitForLoginCompletion } from "./core/login";
import { waitForAppLoad } from "./core/navigation";
import { BrowserConfig, SessionStorage } from "./types/config";
import { RedditPostingContext } from "./types/context";
import { RedditPostProgress } from "./types/progress";

export type RedditLoginResult = {
  success: boolean;
  username?: string;
  error?: string;
};

export type RedditLoginConfig = {
  sessionStorage?: SessionStorage;
  onProgress?: (progress: RedditPostProgress) => void;
  browserOptions?: BrowserConfig;
  loginTimeout?: number; // in milliseconds
};

export class RedditLoginHandler {
  private context: RedditPostingContext | null = null;
  private isCurrentlyRunning = false;
  private config: RedditLoginConfig;

  constructor(config: RedditLoginConfig = {}) {
    this.config = {
      loginTimeout: 300000, // 5 minutes default
      ...config,
    };
  }

  public isRunning(): boolean {
    return this.isCurrentlyRunning;
  }

  /**
   * Check if user is currently logged in to Reddit (headless check)
   * This is useful for verifying existing sessions without opening a browser
   */
  public async checkLoginStatus(): Promise<RedditLoginResult> {
    if (this.isCurrentlyRunning) {
      return {
        success: false,
        error: "Login handler is already running",
      };
    }

    this.isCurrentlyRunning = true;
    try {
      this.config.onProgress?.({
        stage: "launching_browser",
        message: "Checking login status...",
      });

      await closeBrowserIfOpened(this.context);
      this.context = await initializeBrowser(this.config.sessionStorage, {
        ...this.config.browserOptions,
        headless: false, // TODO Change back
      });

      if (!this.context) {
        throw new Error("Failed to initialize browser context");
      }

      // Navigate to Reddit
      await this.context.page.goto("https://www.reddit.com/", {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });

      await waitForAppLoad(this.context.page);

      const isLoggedIn = await checkLoginStatus(this.context.page);

      if (!isLoggedIn) {
        this.config.onProgress?.({
          stage: "completed",
          message: "Not logged in to Reddit",
        });

        return {
          success: false,
          error: "Not logged in",
        };
      }

      // Extract username if logged in
      const username = await extractUsernameFromPage(this.context.page);

      this.config.onProgress?.({
        stage: "completed",
        message: username
          ? `Currently logged in as u/${username}`
          : "Logged in to Reddit (username not detected)",
      });

      return {
        success: true,
        username: username || undefined,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      this.config.onProgress?.({
        stage: "failed",
        message: `Failed to check login status: ${errorMessage}`,
      });

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      await closeBrowserIfOpened(this.context);
      this.isCurrentlyRunning = false;
    }
  }

  /**
   * Open a browser window for the user to log in to Reddit
   * This will wait for the user to complete the login process
   */
  public async performLogin(): Promise<RedditLoginResult> {
    if (this.isCurrentlyRunning) {
      return {
        success: false,
        error: "Login handler is already running",
      };
    }

    this.isCurrentlyRunning = true;
    try {
      this.config.onProgress?.({
        stage: "launching_browser",
        message: "Opening browser for Reddit login...",
      });

      await closeBrowserIfOpened(this.context);
      this.context = await initializeBrowser(this.config.sessionStorage, {
        ...this.config.browserOptions,
        headless: false, // Must be visible for user interaction
      });

      if (!this.context) {
        throw new Error("Failed to initialize browser context");
      }

      // Navigate to Reddit
      this.config.onProgress?.({
        stage: "navigating",
        message: "Navigating to Reddit...",
      });

      await this.context.page.goto("https://www.reddit.com/", {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });

      await waitForAppLoad(this.context.page);

      // Check if already logged in
      const isAlreadyLoggedIn = await checkLoginStatus(this.context.page);
      if (isAlreadyLoggedIn) {
        const username = await extractUsernameFromPage(this.context.page);

        this.config.onProgress?.({
          stage: "completed",
          message: username ? `Already logged in as u/${username}` : "Already logged in to Reddit",
        });

        // Save session to ensure it's up to date
        await saveSession(this.context, this.config.sessionStorage);

        // Add brief delay to let user see the confirmation message
        await new Promise((resolve) => setTimeout(resolve, 2000));

        return {
          success: true,
          username: username || undefined,
        };
      }

      // Wait for user to complete login
      this.config.onProgress?.({
        stage: "logging_in",
        message: "Please log in to Reddit in the browser window...",
      });

      const loginSuccess = await waitForLoginCompletion(
        this.context.page,
        this.config.onProgress,
        this.config.loginTimeout
      );

      if (!loginSuccess) {
        throw new Error("Login timeout: User did not complete login within the allowed time");
      }

      // Extract username after successful login
      const username = await extractUsernameFromPage(this.context.page);

      this.config.onProgress?.({
        stage: "logging_in",
        message: "Login successful! Saving session...",
      });

      // Save the session
      await saveSession(this.context, this.config.sessionStorage);

      // Verify session was saved if sessionStorage is provided
      if (this.config.sessionStorage) {
        const sessionExists = await this.config.sessionStorage.exists();
        if (!sessionExists) {
          console.warn("Session file was not created after login");
        }
      }

      this.config.onProgress?.({
        stage: "completed",
        message: username
          ? `Successfully logged in as u/${username}`
          : "Successfully logged in to Reddit",
      });

      return {
        success: true,
        username: username || undefined,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      this.config.onProgress?.({
        stage: "failed",
        message: `Login failed: ${errorMessage}`,
      });

      // Check if we got a session despite the error
      if (this.config.sessionStorage) {
        try {
          const sessionExists = await this.config.sessionStorage.exists();
          if (sessionExists) {
            console.log("Login appears to have succeeded despite error - session file exists");
            return {
              success: true,
              username: undefined,
              error: `Login completed with warnings: ${errorMessage}`,
            };
          }
        } catch {
          // Ignore session check errors
        }
      }

      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      await closeBrowserIfOpened(this.context);
      this.isCurrentlyRunning = false;
    }
  }

  /**
   * Clear any existing session data
   */
  public async clearSession(): Promise<void> {
    if (this.config.sessionStorage) {
      await this.config.sessionStorage.clear();
    }
  }

  /**
   * Check if a session exists in storage
   */
  public async hasSession(): Promise<boolean> {
    if (!this.config.sessionStorage) {
      return false;
    }
    return await this.config.sessionStorage.exists();
  }

  /**
   * Get stored session data if available
   */
  public async getSessionData(): Promise<string | null> {
    if (!this.config.sessionStorage) {
      return null;
    }

    try {
      const exists = await this.config.sessionStorage.exists();
      if (!exists) {
        return null;
      }
      return await this.config.sessionStorage.read();
    } catch {
      return null;
    }
  }

  /**
   * Cleanup resources and close any open browser
   */
  public async dispose(): Promise<void> {
    await closeBrowserIfOpened(this.context);
    this.isCurrentlyRunning = false;
  }
}
