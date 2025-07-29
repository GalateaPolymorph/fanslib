import { Elysia } from "elysia";
import "reflect-metadata";
import { getDatabase } from "./database/config";
import { redditQueueRoutes } from "./routes/reddit-queue";
import { isRunning, start, stop } from "./services/cron-scheduler";

const port = process.env.PORT || 3000;

const startServer = async () => {
  console.log("🗄️ Initializing database...");
  await getDatabase();

  const app = new Elysia()
    .get("/", () => ({
      message: "FansLib Server - Reddit Queue Automation",
      version: "1.0.0",
      status: "running",
    }))
    .get("/health", () => ({
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      scheduler: isRunning() ? "running" : "stopped",
    }))
    .use(redditQueueRoutes)
    .listen(port);

  start();

  console.log(`🦊 Elysia server running at http://localhost:${app.server?.port}`);

  return app;
};

startServer().catch(console.error);

const handleShutdown = async (signal: string) => {
  console.log(`\n🛑 Received ${signal}, shutting down gracefully...`);

  try {
    stop();
    console.log("✅ Graceful shutdown completed");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error during shutdown:", error);
    process.exit(1);
  }
};

process.on("SIGINT", () => handleShutdown("SIGINT"));
process.on("SIGTERM", () => handleShutdown("SIGTERM"));
