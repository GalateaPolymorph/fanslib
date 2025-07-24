import { Elysia } from "elysia";

const port = process.env.PORT || 3000;

const app = new Elysia()
  .get("/", () => ({
    message: "FansLib Server - Work In Progress",
    version: "1.0.0",
    status: "WIP",
  }))
  .get("/health", () => ({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  }))
  .listen(port);

console.log(`🦊 Elysia is running at http://localhost:${app.server?.port}`);
