import type { SessionResponse } from "./types";
import {
  createSession,
  updateSession,
  getSession,
  deleteSession,
  getSessionStatus,
} from "./api-client";

export type SessionStatus = {
  hasSession: boolean;
  isValid: boolean;
  session?: SessionResponse;
};

// Use Playwright's native format directly
export type PlaywrightSessionData = {
  cookies: Array<{
    name: string;
    value: string;
    domain: string;
    path?: string;
    expires?: number;
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: "Strict" | "Lax" | "None";
  }>;
  origins?: Array<{
    origin: string;
    localStorage?: Array<{ name: string; value: string }>;
    sessionStorage?: Array<{ name: string; value: string }>;
  }>;
};

export type CreateSessionRequest = {
  sessionData: PlaywrightSessionData;
  username?: string;
  userId?: string;
  expiresAt?: string;
};

export const storeSessionToServer = async (
  sessionData: PlaywrightSessionData,
  username?: string
): Promise<SessionResponse | null> => {
  try {
    // Calculate expiry time (48 hours from now)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 48);

    const sessionRequest: CreateSessionRequest = {
      sessionData,
      username,
      userId: username, // Use username as userId for consistency
      expiresAt: expiresAt.toISOString(),
    };

    // Check if session already exists on server
    const existingSession = await getSession(username);

    if (existingSession) {
      // Update existing session
      return await updateSession(sessionRequest);
    } else {
      // Create new session
      return await createSession(sessionRequest);
    }
  } catch (error) {
    console.error("Failed to store session to server:", error);
    throw new Error(
      `Session storage failed: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
};

export const getServerSessionStatus = async (username?: string): Promise<SessionStatus> => {
  try {
    const session = await getSession(username);
    if (!session) {
      return { hasSession: false, isValid: false };
    }

    const isValid = await getSessionStatus(username);
    return { hasSession: true, isValid, session };
  } catch (error) {
    console.error("Failed to get server session status:", error);
    return { hasSession: false, isValid: false };
  }
};

export const clearServerSession = async (username?: string): Promise<boolean> => {
  try {
    return await deleteSession(username);
  } catch (error) {
    console.error("Failed to clear server session:", error);
    return false;
  }
};

export const syncSessionWithServer = async (username?: string): Promise<boolean> => {
  try {
    const { readFile } = await import("fs/promises");
    const { join } = await import("path");
    const { app } = await import("electron");
    
    // Path to local session file
    const userDataDir = join(app.getPath("userData"), "reddit-browser-data");
    const sessionPath = join(userDataDir, "reddit-session.json");

    // Check if local session exists
    try {
      const sessionContent = await readFile(sessionPath, "utf-8");
      const sessionData = JSON.parse(sessionContent) as PlaywrightSessionData;
      
      // Store to server
      const result = await storeSessionToServer(sessionData, username);
      return result !== null;
    } catch (fileError) {
      console.log("No local session file found to sync");
      return false;
    }
  } catch (error) {
    console.error("Failed to sync session with server:", error);
    return false;
  }
};