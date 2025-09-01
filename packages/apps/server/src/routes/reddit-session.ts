import { Elysia, t } from "elysia";
import {
  storeSession,
  getSession,
  updateSession,
  deleteSession,
  isSessionValid,
} from "../services/session-service";

// Define Playwright session schema for validation
const PlaywrightCookieSchema = t.Object({
  name: t.String(),
  value: t.String(),
  domain: t.String(),
  path: t.Optional(t.String()),
  expires: t.Optional(t.Number()),
  httpOnly: t.Optional(t.Boolean()),
  secure: t.Optional(t.Boolean()),
  sameSite: t.Optional(
    t.Union([t.Literal("Strict"), t.Literal("Lax"), t.Literal("None")])
  ),
});

const PlaywrightOriginSchema = t.Object({
  origin: t.String(),
  localStorage: t.Optional(
    t.Array(t.Object({
      name: t.String(),
      value: t.String(),
    }))
  ),
  sessionStorage: t.Optional(
    t.Array(t.Object({
      name: t.String(),
      value: t.String(),
    }))
  ),
});

const PlaywrightSessionSchema = t.Object({
  cookies: t.Array(PlaywrightCookieSchema),
  origins: t.Optional(t.Array(PlaywrightOriginSchema)),
});

const SessionRequestSchema = t.Object({
  sessionData: PlaywrightSessionSchema,
  username: t.Optional(t.String()),
  userId: t.Optional(t.String()),
  expiresAt: t.Optional(t.String()),
});

export const redditSessionRoutes = new Elysia({ prefix: "/api/reddit/session" })
  .post(
    "/",
    async ({ body }) => {
      const { sessionData, username, userId, expiresAt } = body;

      try {
        const session = await storeSession(sessionData, username, userId, expiresAt);
        return { success: true, session };
      } catch (error) {
        console.error("Failed to store session:", error);
        return { success: false, error: "Failed to store session" };
      }
    },
    {
      body: SessionRequestSchema,
    }
  )
  .put(
    "/",
    async ({ body }) => {
      const { sessionData, username, userId, expiresAt } = body;

      try {
        const session = await updateSession(sessionData, username, userId, expiresAt);
        if (!session) {
          return { success: false, error: "Session not found" };
        }
        return { success: true, session };
      } catch (error) {
        console.error("Failed to update session:", error);
        return { success: false, error: "Failed to update session" };
      }
    },
    {
      body: SessionRequestSchema,
    }
  )
  .get(
    "/",
    async ({ query }) => {
      try {
        const session = await getSession(query.userId);
        if (!session) {
          return { success: false, error: "No session found" };
        }
        return { success: true, session };
      } catch (error) {
        console.error("Failed to get session:", error);
        return { success: false, error: "Failed to get session" };
      }
    },
    {
      query: t.Object({
        userId: t.Optional(t.String()),
      }),
    }
  )
  .get(
    "/status",
    async ({ query }) => {
      try {
        const isValid = await isSessionValid(query.userId);
        return { success: true, isValid };
      } catch (error) {
        console.error("Failed to check session status:", error);
        return { success: false, error: "Failed to check session status" };
      }
    },
    {
      query: t.Object({
        userId: t.Optional(t.String()),
      }),
    }
  )
  .get(
    "/data",
    async ({ query }) => {
      try {
        const sessionData = await import("../services/session-service").then(m => m.getSessionData(query.userId));
        if (!sessionData) {
          return { success: false, error: "No session data found" };
        }
        return { success: true, sessionData };
      } catch (error) {
        console.error("Failed to get session data:", error);
        return { success: false, error: "Failed to get session data" };
      }
    },
    {
      query: t.Object({
        userId: t.Optional(t.String()),
      }),
    }
  )
  .delete(
    "/",
    async ({ query }) => {
      try {
        const deleted = await deleteSession(query.userId);
        return { success: deleted };
      } catch (error) {
        console.error("Failed to delete session:", error);
        return { success: false, error: "Failed to delete session" };
      }
    },
    {
      query: t.Object({
        userId: t.Optional(t.String()),
      }),
    }
  );