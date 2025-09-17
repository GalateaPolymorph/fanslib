import { cors } from '@elysiajs/cors';
import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';

const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: 'FansLib API',
          version: '1.0.0',
          description: 'Content Management API for FansLib Platform',
        },
      },
    })
  )
  .get('/', () => ({ message: 'FansLib API Server Running' }))
  .get('/health', () => ({ status: 'ok', timestamp: new Date().toISOString() }))
  .listen(8000);

console.log(`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`);
