import { createServerFileRoute } from '@tanstack/react-start/server';
import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { trpcRouter } from '~/lib/trpc/routes';

export type AppRouter = typeof trpcRouter;

const serve = ({ request }: { request: Request }) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req: request,
    router: trpcRouter,
    createContext: async () => ({
      db,
    }),
  });

export const ServerRoute = createServerFileRoute('/api/trpc/$').methods({
  GET: serve,
  POST: serve,
});
