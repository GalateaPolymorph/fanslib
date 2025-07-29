import { Elysia, t } from "elysia";
import { createJob, getJobs, getJobById, deleteJob, getJobLogs } from "../services/queue-service";
import { CreateQueueJobSchema } from "../types";

export const redditQueueRoutes = new Elysia({ prefix: "/api/reddit" })
  .post(
    "/queue",
    async ({ body, set }) => {
      try {
        const validated = CreateQueueJobSchema.parse(body);
        const job = await createJob(validated);

        set.status = 201;
        return job;
      } catch (error) {
        set.status = 400;
        return {
          error: "Invalid request data",
          details: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      body: t.Object({
        subreddit: t.String({ minLength: 1 }),
        caption: t.String({ minLength: 1 }),
        url: t.Optional(t.String()),
        flair: t.Optional(t.String()),
        mediaId: t.Optional(t.String()),
        scheduledTime: t.String(),
      }),
    }
  )

  .get(
    "/queue",
    async ({ query }) => {
      try {
        const since = query.since ? String(query.since) : undefined;
        const response = await getJobs(since);
        return response;
      } catch (error) {
        return {
          error: "Failed to fetch queue jobs",
          details: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      query: t.Object({
        since: t.Optional(t.String()),
      }),
    }
  )

  .get("/queue/:id", async ({ params, set }) => {
    try {
      const job = await getJobById(params.id);

      if (!job) {
        set.status = 404;
        return { error: "Job not found" };
      }

      return job;
    } catch (error) {
      set.status = 500;
      return {
        error: "Failed to fetch job",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  })

  .delete("/queue/:id", async ({ params, set }) => {
    try {
      const deleted = await deleteJob(params.id);

      if (!deleted) {
        set.status = 404;
        return { error: "Job not found" };
      }

      set.status = 204;
      return null;
    } catch (error) {
      set.status = 500;
      return {
        error: "Failed to delete job",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  })

  .get("/queue/:id/logs", async ({ params, set }) => {
    try {
      const logs = await getJobLogs(params.id);
      return { logs };
    } catch (error) {
      set.status = 500;
      return {
        error: "Failed to fetch job logs",
        details: error instanceof Error ? error.message : "Unknown error",
      };
    }
  })

  .get(
    "/queue/status",
    async ({ query }) => {
      try {
        const since = query.since ? String(query.since) : undefined;
        const response = await getJobs(since);
        return response;
      } catch (error) {
        return {
          error: "Failed to fetch queue status",
          details: error instanceof Error ? error.message : "Unknown error",
        };
      }
    },
    {
      query: t.Object({
        since: t.Optional(t.String()),
      }),
    }
  );
