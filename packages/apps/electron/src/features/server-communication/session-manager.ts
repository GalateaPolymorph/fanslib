import { readFile } from "fs/promises";
import { join } from "path";
import { app } from "electron";
import type { RedditSessionData, CreateSessionRequest, SessionResponse } from "./types";
import {
  createSession,
  updateSession,
  getSession,
  deleteSession,
  getSessionStatus,
} from "./api-client";

const getElectronSessionPath = (): string => {
  const userDataDir = join(app.getPath("userData"), "reddit-browser-data");
  return join(userDataDir, "reddit-session.json");
};

// Convert Playwright storage state to our RedditSessionData format
const convertPlaywrightSession = (playwrightSession: any): RedditSessionData => {
  const sessionData: RedditSessionData = {
    cookies: playwrightSession.cookies || [],
    localStorage: {},
    sessionStorage: {},
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  };

  // Extract localStorage from origins
  if (playwrightSession.origins) {
    const redditOrigin = playwrightSession.origins.find((origin: any) =>
      origin.origin?.includes("reddit.com")
    );

    if (redditOrigin?.localStorage) {
      redditOrigin.localStorage.forEach((item: any) => {
        sessionData.localStorage[item.name] = item.value;
      });
    }
  }

  return sessionData;
};

// Extract Reddit username from session data
const extractRedditUsername = (sessionData: RedditSessionData): string | undefined => {
  // Try to find username in localStorage
  const userKey = Object.keys(sessionData.localStorage).find(
    (key) => key.includes("user") || key.includes("session") || key.includes("login")
  );

  if (userKey) {
    try {
      const userData = JSON.parse(sessionData.localStorage[userKey]);
      if (userData.name || userData.username) {
        return userData.name || userData.username;
      }
    } catch {
      // Ignore parsing errors
    }
  }

  // Try to find username in cookies
  const authCookie = sessionData.cookies.find(
    (cookie) =>
      cookie.name.includes("session") ||
      cookie.name.includes("auth") ||
      cookie.name.includes("user")
  );

  if (authCookie) {
    try {
      const decoded = decodeURIComponent(authCookie.value);
      const userMatch = decoded.match(/["|'](?:name|username)["|']:\s*["|']([^"']+)["|']/);
      if (userMatch) {
        return userMatch[1];
      }
    } catch {
      // Ignore decoding errors
    }
  }

  return undefined;
};

export const transferElectronSessionToServer = async (
  userId?: string
): Promise<SessionResponse | null> => {
  try {
    const sessionPath = getElectronSessionPath();

    // Read Electron session file
    const sessionContent = await readFile(sessionPath, "utf-8");
    const playwrightSession = JSON.parse(sessionContent);

    // Convert to our format
    const sessionData = convertPlaywrightSession(playwrightSession);

    // Extract username if possible
    const username = extractRedditUsername(sessionData);

    // Calculate expiry time (48 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    const sessionRequest: CreateSessionRequest = {
      sessionData,
      username,
      userId,
      expiresAt: expiresAt.toISOString(),
    };

    // Check if session already exists on server
    const existingSession = await getSession(userId);

    if (existingSession) {
      // Update existing session
      return await updateSession(sessionRequest);
    } else {
      // Create new session
      return await createSession(sessionRequest);
    }
  } catch (error) {
    console.error("Failed to transfer Electron session to server:", error);
    throw new Error(
      `Session transfer failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

export const getServerSessionStatus = async (
  userId?: string
): Promise<{
  hasSession: boolean;
  isValid: boolean;
  session?: SessionResponse;
}> => {
  try {
    const session = await getSession(userId);
    if (!session) {
      return { hasSession: false, isValid: false };
    }

    const isValid = await getSessionStatus(userId);
    return { hasSession: true, isValid, session };
  } catch (error) {
    console.error("Failed to get server session status:", error);
    return { hasSession: false, isValid: false };
  }
};

export const clearServerSession = async (userId?: string): Promise<boolean> => {
  try {
    return await deleteSession(userId);
  } catch (error) {
    console.error("Failed to clear server session:", error);
    return false;
  }
};

export const syncSessionWithServer = async (userId?: string): Promise<boolean> => {
  try {
    const sessionPath = getElectronSessionPath();

    // Check if Electron has a session
    try {
      await readFile(sessionPath, "utf-8");
    } catch {
      console.log("No Electron session found to sync");
      return false;
    }

    // Transfer to server
    const result = await transferElectronSessionToServer(userId);
    return result !== null;
  } catch (error) {
    console.error("Failed to sync session with server:", error);
    return false;
  }
};
