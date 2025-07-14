import { closeBrowserIfOpened, createBrowserContext } from "./browser";
import type {
  FanslyAutomationContext,
  FanslyAutomationOptions,
  FanslyAutomationResult,
  FanslyCredentials,
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

  public async runFullAutomation(
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
      console.log("[Fansly Automation] Validating automation options");

      // Step 1: Launch browser
      console.log("[Fansly Automation] Launching browser");
      this.context = await createBrowserContext(options);

      // Step 2: Navigate to login page and authenticate
      console.log("[Fansly Automation] Navigating to Fansly");
      await navigateToFansly(this.context.page);

      // Step 3: Perform login
      console.log("[Fansly Automation] Performing login");
      const loginResult = await performLogin(this.context.page);

      if (!loginResult.success) {
        return {
          success: false,
          error: "Login failed",
          fallbackToManual: loginResult.requiresManualAuth,
        };
      }

      // Step 4: Extract credentials from network requests
      console.log("[Fansly Automation] Extracting authentication credentials");

      // Set up credential extraction before navigating to pages that make API calls
      const credentialPromise = setupCredentialExtraction(this.context.page);

      // Step 5: Navigate to profile to trigger API calls
      await navigateToProfile(this.context.page);

      // Wait for credentials to be extracted (with timeout)
      let credentials: FanslyCredentials;
      try {
        credentials = await Promise.race([
          credentialPromise,
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error("Credential extraction timeout")), 30000)
          ),
        ]);
      } catch (error) {
        console.error("[Fansly Automation] Credential extraction failed:", error);
        return {
          success: false,
          error: "Failed to extract credentials automatically",
          fallbackToManual: true,
        };
      }

      // Validate extracted credentials
      const credentialsValid = await validateCredentials(credentials);
      if (!credentialsValid) {
        return {
          success: false,
          error: "Extracted credentials are invalid",
          fallbackToManual: true,
        };
      }

      // Step 6: Discover posts
      console.log("[Fansly Automation] Discovering posts and statistics URLs");
      const posts = await discoverAllPosts(this.context.page, options);

      if (posts.length === 0) {
        return {
          success: false,
          error: "No posts with statistics found",
          credentials,
        };
      }

      // Step 7: Save session and complete
      console.log(
        `[Fansly Automation] Automation completed successfully. Found ${posts.length} posts.`
      );

      await saveSession(this.context);

      return {
        success: true,
        credentials,
        posts,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("[Fansly Automation] Automation failed:", error);

      console.error(`[Fansly Automation] Automation failed: ${errorMessage}`);

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

  public async extractCredentialsOnly(
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

  public async discoverPostsOnly(
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
        return {
          success: false,
          error: "No valid session found. Please extract credentials first.",
          fallbackToManual: true,
        };
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
