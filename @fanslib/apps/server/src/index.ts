import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { docsRoutes } from './routes/docs';

const app = new Elysia()
  .use(cors())
  .use(docsRoutes)
  .get('/', () => ({ message: 'FansLib API Server Running' }))
  .listen(8000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
console.log('🔍 API documentation available at /swagger');
