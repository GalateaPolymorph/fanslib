import { BunContext } from '@effect/platform-bun';
import { cors } from '@elysiajs/cors';
import { Effect, Layer, Logger, Schedule } from 'effect';
import { Elysia } from 'elysia';
import { executeScan } from './modules/scan/scan';
import { docsRoutes } from './routes/docs';
import { healthRoutes } from './routes/health';
import { Database } from './services/database';

const app = new Elysia()
  .use(cors())
  .use(docsRoutes)
  .use(healthRoutes)
  .get('/', () => ({ message: 'FansLib API Server Running' }))
  .listen({ port: 8001 });

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
console.log('🔍 API documentation available at /swagger\n');

const scanSchedule = Schedule.spaced('1 hours');
const periodicScan = Effect.repeat(
  executeScan.pipe(Effect.catchAll(Effect.logError)),
  scanSchedule
);

const AppLive = Layer.merge(
  Layer.merge(Database.Default, Logger.pretty),
  BunContext.layer
);

Effect.runFork(Effect.scoped(periodicScan).pipe(Effect.provide(AppLive)));
