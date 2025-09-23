import { swagger } from '@elysiajs/swagger';
import { Elysia } from 'elysia';

export const docsRoutes = new Elysia().use(
  swagger({
    documentation: {
      info: {
        title: 'FansLib API',
        version: '1.0.0',
        description: 'Content Management API for FansLib Platform',
      },
    },
  })
);
