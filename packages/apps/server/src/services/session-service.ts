import { getDatabase } from "../database/config";
import { RedditSession } from "../database/entities";

export type RedditSessionData = {
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
  localStorage: Record<string, string>;
  sessionStorage: Record<string, string>;
  userAgent: string;
};

export type SessionResponse = {
  id: string;
  userId?: string;
  username?: string;
  expiresAt: string;
  isValid: boolean;
  createdAt: string;
  updatedAt: string;
};

const generateId = () => crypto.randomUUID();

const getCurrentTimestamp = () => new Date().toISOString();

const getDefaultExpiryTime = () => {
  const now = new Date();
  // Default to 48 hours from now
  now.setHours(now.getHours() + 48);
  return now.toISOString();
};

export const storeSession = async (
  sessionData: RedditSessionData,
  username?: string,
  userId?: string,
  expiresAt?: string
): Promise<SessionResponse> => {
  const db = await getDatabase();
  const sessionRepository = db.getRepository(RedditSession);

  const id = generateId();

  const session = sessionRepository.create({
    id,
    userId,
    sessionData: JSON.stringify(sessionData),
    username,
    expiresAt: expiresAt || getDefaultExpiryTime(),
  });

  await sessionRepository.save(session);

  return {
    id: session.id,
    userId: session.userId,
    username: session.username,
    expiresAt: session.expiresAt,
    isValid: true,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
  };
};

export const getSession = async (userId?: string): Promise<SessionResponse | null> => {
  const db = await getDatabase();
  const sessionRepository = db.getRepository(RedditSession);

  const session = await sessionRepository.findOne({
    where: { userId },
    order: { updatedAt: "DESC" },
  });

  if (!session) return null;

  const now = getCurrentTimestamp();
  const isValid = session.expiresAt > now;

  return {
    id: session.id,
    userId: session.userId,
    username: session.username,
    expiresAt: session.expiresAt,
    isValid,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
  };
};

export const getSessionData = async (userId?: string): Promise<RedditSessionData | null> => {
  const db = await getDatabase();
  const sessionRepository = db.getRepository(RedditSession);

  const session = await sessionRepository.findOne({
    where: { userId },
    order: { updatedAt: "DESC" },
  });

  if (!session) return null;

  const now = getCurrentTimestamp();
  const isValid = session.expiresAt > now;

  if (!isValid) return null;

  try {
    return JSON.parse(session.sessionData) as RedditSessionData;
  } catch {
    return null;
  }
};

export const updateSession = async (
  sessionData: RedditSessionData,
  username?: string,
  userId?: string,
  expiresAt?: string
): Promise<SessionResponse | null> => {
  const db = await getDatabase();
  const sessionRepository = db.getRepository(RedditSession);

  const existingSession = await sessionRepository.findOne({
    where: { userId },
    order: { updatedAt: "DESC" },
  });

  if (!existingSession) {
    // Create new session if none exists
    return await storeSession(sessionData, username, userId, expiresAt);
  }

  // Update existing session
  await sessionRepository.update(existingSession.id, {
    sessionData: JSON.stringify(sessionData),
    username,
    expiresAt: expiresAt || getDefaultExpiryTime(),
  });

  const updatedSession = await sessionRepository.findOne({
    where: { id: existingSession.id },
  });

  if (!updatedSession) return null;

  return {
    id: updatedSession.id,
    userId: updatedSession.userId,
    username: updatedSession.username,
    expiresAt: updatedSession.expiresAt,
    isValid: true,
    createdAt: updatedSession.createdAt.toISOString(),
    updatedAt: updatedSession.updatedAt.toISOString(),
  };
};

export const deleteSession = async (userId?: string): Promise<boolean> => {
  const db = await getDatabase();
  const sessionRepository = db.getRepository(RedditSession);

  if (userId) {
    const result = await sessionRepository.delete({ userId });
    return result.affected ? result.affected > 0 : false;
  } else {
    // Delete all sessions if no userId specified
    const result = await sessionRepository.delete({});
    return result.affected ? result.affected > 0 : false;
  }
};

export const isSessionValid = async (userId?: string): Promise<boolean> => {
  const session = await getSession(userId);
  return session?.isValid ?? false;
};
