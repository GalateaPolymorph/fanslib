import { R } from '@mobily/ts-belt';
import { Elysia } from 'elysia';

export const healthRoutes = new Elysia()
  .get('/health', () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }))
