import { closeBrowserIfOpened, createBrowserContext } from "./browser";
import type {
  FanslyAutomationContext,
  FanslyAutomationOptions,
  FanslyAutomationResult,
  PostDiscoveryOptions,
} from "./context";
import { setupCredentialExtraction, validateCredentials } from "./credentials";
import {
  checkIfLoggedIn,
  handleAgeRestrictionModal,
  navigateToFansly,
  performLogin,
} from "./login";
import { discoverAllPosts, navigateToProfile } from "./navigation";
import { clearSession, isSessionExpired, saveSession, sessionExists } from "./session";

export class PlaywrightFanslyAutomation {
  private static instance: PlaywrightFanslyAutomation;
  private context: FanslyAutomationContext | null = null;
  private isCurrentlyRunning = false;

  private constructor() {}

  public static getInstance(): PlaywrightFanslyAutomation {
    if (!PlaywrightFanslyAutomation.instance) {
      PlaywrightFanslyAutomation.instance = new PlaywrightFanslyAutomation();
    }
    return PlaywrightFanslyAutomation.instance;
  }

  public async extractCredentials(
    options: FanslyAutomationOptions & {
      email?: string;
      password?: string;
    } = {}
  ): Promise<FanslyAutomationResult> {
    if (this.isCurrentlyRunning) {
      return {
        success: false,
        error: "Automation is already running",
      };
    }

    this.isCurrentlyRunning = true;

    try {
      this.context = await createBrowserContext({ ...options, debug: true });
      await navigateToFansly(this.context.page);
      await handleAgeRestrictionModal(this.context.page);
      const { success: loginSuccess } = await performLogin(this.context.page);

      if (!loginSuccess) {
        return {
          success: false,
          error: "Login failed",
          fallbackToManual: true,
        };
      }

      const credentialPromise = setupCredentialExtraction(this.context.page);

      // Navigate to a page that makes API calls to trigger credential extraction
      await this.context.page.goto("https://fansly.com/settings", {
        waitUntil: "networkidle",
      });

      // Extract credentials
      const credentials = await Promise.race([
        credentialPromise,
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Credential extraction timeout")), 30000)
        ),
      ]);

      // Validate credentials
      const credentialsValid = await validateCredentials(credentials);
      if (!credentialsValid) {
        return {
          success: false,
          error: "Extracted credentials are invalid",
          fallbackToManual: true,
        };
      }

      await saveSession(this.context);

      console.log("[Fansly Automation] Credentials extracted successfully");

      return {
        success: true,
        credentials,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("[Fansly Automation] Credential extraction failed:", error);

      return {
        success: false,
        error: errorMessage,
        fallbackToManual: true,
      };
    } finally {
      await closeBrowserIfOpened(this.context);
      this.context = null;
      this.isCurrentlyRunning = false;
    }
  }

  public async discoverPosts(
    options: FanslyAutomationOptions & PostDiscoveryOptions = {}
  ): Promise<FanslyAutomationResult> {
    if (this.isCurrentlyRunning) {
      return {
        success: false,
        error: "Automation is already running",
      };
    }

    this.isCurrentlyRunning = true;

    try {
      this.context = await createBrowserContext(options);

      // Check if we have a valid session
      if (!(await sessionExists()) || (await isSessionExpired())) {
        await closeBrowserIfOpened(this.context);
        this.context = null;
        this.isCurrentlyRunning = false;

        await this.extractCredentials(options);

        this.isCurrentlyRunning = true;
        this.context = await createBrowserContext(options);
      }

      // Navigate to login page to check authentication
      await navigateToFansly(this.context.page);

      if (!(await checkIfLoggedIn(this.context.page))) {
        return {
          success: false,
          error: "Not logged in. Please extract credentials first.",
          fallbackToManual: true,
        };
      }

      // Navigate to profile and discover posts
      await navigateToProfile(this.context.page);
      const posts = await discoverAllPosts(this.context.page, options);

      await saveSession(this.context);

      return {
        success: true,
        posts,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("[Fansly Automation] Post discovery failed:", error);

      return {
        success: false,
        error: errorMessage,
        fallbackToManual: true,
      };
    } finally {
      await closeBrowserIfOpened(this.context);
      this.context = null;
      this.isCurrentlyRunning = false;
    }
  }

  public async clearSessionData(): Promise<void> {
    if (this.isCurrentlyRunning) {
      throw new Error("Cannot clear session while automation is running");
    }

    await clearSession();
  }

  public isRunning(): boolean {
    return this.isCurrentlyRunning;
  }
}

// Export singleton instance
export const fanslyAutomation = PlaywrightFanslyAutomation.getInstance();
